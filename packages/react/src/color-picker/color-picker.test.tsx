import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Field } from "../field/field.js";
import { ColorPicker } from "./color-picker.js";

function openPicker(user: ReturnType<typeof userEvent.setup>) {
  return user.click(screen.getByRole("button"));
}

function ControlledHarness() {
  const [value, setValue] = useState("#111111");
  return <ColorPicker value={value} onValueChange={setValue} />;
}

describe("ColorPicker", () => {
  it("renders a trigger swatch with the current value as accessible name", () => {
    render(<ColorPicker defaultValue="#ff0000" />);
    expect(screen.getByRole("button", { name: "#ff0000" })).toBeTruthy();
  });

  it("uses label for the trigger swatch accessible name when provided", () => {
    render(<ColorPicker defaultValue="#ff0000" label="Brand color" />);
    expect(screen.getByRole("button", { name: "Brand color" })).toBeTruthy();
  });

  it("supports uncontrolled usage with onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ColorPicker defaultValue="#000000" onValueChange={onValueChange} />,
    );

    await openPicker(user);
    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "#00ff00");
    await user.tab();

    expect(onValueChange).toHaveBeenCalledWith("#00ff00");
    expect(screen.getByRole("button", { name: "#00ff00" })).toBeTruthy();
  });

  it("supports controlled usage", async () => {
    const user = userEvent.setup();

    render(<ControlledHarness />);
    await openPicker(user);
    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "#222222{Enter}");

    expect(await screen.findByRole("button", { name: "#222222" })).toBeTruthy();
  });

  it("rejects an invalid typed value without committing", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ColorPicker defaultValue="#ff0000" onValueChange={onValueChange} />,
    );

    await openPicker(user);
    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "not-a-color");
    await user.tab();

    expect(onValueChange).not.toHaveBeenCalled();
    await waitFor(() => {
      expect(input.getAttribute("aria-invalid")).toBe("true");
    });
  });

  it("navigates presets with Arrow keys, Home, and End, updating aria-checked", async () => {
    const user = userEvent.setup();
    const presets = ["#ff0000", "#00ff00", "#0000ff"];
    render(<ColorPicker defaultValue="#ff0000" presets={presets} />);

    await openPicker(user);
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
    expect(radios[0]?.getAttribute("aria-checked")).toBe("true");

    radios[0]?.focus();
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(radios[1]);
    expect(radios[1]?.getAttribute("aria-checked")).toBe("true");

    await user.keyboard("{End}");
    expect(document.activeElement).toBe(radios[2]);
    expect(radios[2]?.getAttribute("aria-checked")).toBe("true");

    await user.keyboard("{Home}");
    expect(document.activeElement).toBe(radios[0]);
    expect(radios[0]?.getAttribute("aria-checked")).toBe("true");
  });

  it("integrates with Field for invalid and aria-describedby", async () => {
    const user = userEvent.setup();
    render(
      <Field invalid>
        <Field.Label>Accent color</Field.Label>
        <ColorPicker defaultValue="#ff0000" label="Accent color" />
        <Field.Error>Choose a valid color.</Field.Error>
      </Field>,
    );

    await openPicker(user);
    const input = screen.getByRole("textbox");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    const describedBy = input.getAttribute("aria-describedby") ?? "";
    expect(describedBy).toContain(screen.getByText("Choose a valid color.").id);
  });

  it("has no axe violations when the popover is open", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(
      <ColorPicker
        defaultValue="#ff0000"
        label="Accent color"
        presets={["#ff0000", "#00ff00"]}
      />,
    );

    await openPicker(user);
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
