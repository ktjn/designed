import { render, screen, waitFor } from "@testing-library/react";
import { createPortal } from "react-dom";
import { expect, it } from "vitest";
import {
  Field,
  RadioGroup,
  Slider,
  useFieldContext,
  useFieldControlId,
  usePortalContainer,
} from "../src/index.js";

function CustomInput({ id }: { id?: string }) {
  const field = useFieldContext();
  const controlId = useFieldControlId(id);
  return (
    <input
      id={controlId}
      aria-describedby={field?.describedBy}
      aria-invalid={field?.invalid}
      disabled={field?.disabled}
    />
  );
}

it("lets a custom Field control register its ID and receive descriptions and state", () => {
  const { rerender } = render(
    <Field disabled invalid>
      <Field.Label>Notes</Field.Label>
      <CustomInput id="custom-notes" />
      <Field.Description>Keep it brief.</Field.Description>
      <Field.Error>Notes are required.</Field.Error>
    </Field>,
  );
  const input = screen.getByRole("textbox", { name: "Notes" });
  expect(input.id).toBe("custom-notes");
  const descriptionIds = input.getAttribute("aria-describedby")?.split(" ");
  expect(
    descriptionIds?.map((id) => document.getElementById(id)?.textContent),
  ).toEqual(["Keep it brief.", "Notes are required."]);
  expect((input as HTMLInputElement).disabled).toBe(true);
  expect(input.getAttribute("aria-invalid")).toBe("true");

  rerender(
    <Field>
      <Field.Label>Notes</Field.Label>
      <CustomInput />
    </Field>,
  );
  expect(screen.getByRole("textbox", { name: "Notes" })).toBe(input);
  expect(input.id).not.toBe("custom-notes");
  expect(input.hasAttribute("aria-describedby")).toBe(false);
});

it("forwards Field invalid state to radio groups and every slider thumb", () => {
  const controls = (invalid: boolean, override?: boolean) => (
    <Field invalid={invalid}>
      <RadioGroup aria-label="Mode" aria-invalid={override}>
        <RadioGroup.Item value="a">Automatic</RadioGroup.Item>
      </RadioGroup>
      <Slider
        aria-label="Price"
        defaultValue={[20, 80]}
        aria-invalid={override}
      />
    </Field>
  );
  const { rerender } = render(controls(true));
  const group = screen.getByRole("radiogroup");
  const sliders = screen.getAllByRole("slider");
  for (const control of [group, ...sliders]) {
    expect(control.getAttribute("aria-invalid")).toBe("true");
  }
  rerender(controls(true, false));
  for (const control of [group, ...sliders]) {
    expect(control.getAttribute("aria-invalid")).toBe("false");
  }
  rerender(controls(false));
  for (const control of [group, ...sliders]) {
    expect(control.hasAttribute("aria-invalid")).toBe(false);
  }
});

function CustomPortal({ active }: { active: boolean }) {
  const { container, scopeRef } = usePortalContainer(active);
  return (
    <>
      <span hidden ref={scopeRef} />
      {container && createPortal(<p>Portaled content</p>, container)}
    </>
  );
}

it("preserves and updates nested theme attributes for a custom portal", async () => {
  const example = (active: boolean, scheme: string) => (
    <div data-brand="editorial" data-color-scheme={scheme}>
      <div data-density="compact" data-contrast="more">
        <CustomPortal active={active} />
      </div>
    </div>
  );
  const { rerender } = render(example(false, "dark"));
  expect(screen.queryByText("Portaled content")).toBeNull();
  rerender(example(true, "dark"));
  const host = screen.getByText("Portaled content").parentElement;
  expect(host?.parentElement).toBe(document.body);
  expect(host?.getAttribute("data-brand")).toBe("editorial");
  expect(host?.getAttribute("data-color-scheme")).toBe("dark");
  expect(host?.getAttribute("data-density")).toBe("compact");
  expect(host?.getAttribute("data-contrast")).toBe("more");

  rerender(example(true, "light"));
  await waitFor(() =>
    expect(host?.getAttribute("data-color-scheme")).toBe("light"),
  );
  rerender(example(false, "light"));
  expect(screen.queryByText("Portaled content")).toBeNull();
  expect(host?.isConnected).toBe(false);
});

it("uses the body directly when a custom portal has no nested theme scope", () => {
  render(<CustomPortal active />);
  expect(screen.getByText("Portaled content").parentElement).toBe(
    document.body,
  );
});
