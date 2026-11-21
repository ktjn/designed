import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Field } from "../field/field";
import { NumberField } from "./number-field";

describe("NumberField", () => {
  it("increments and decrements values via buttons", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <NumberField
        aria-label="Quantity"
        defaultValue={2}
        min={0}
        max={10}
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Increase" }));
    expect(onValueChange).toHaveBeenCalledWith(3);

    await user.click(screen.getByRole("button", { name: "Decrease" }));
    expect(onValueChange).toHaveBeenLastCalledWith(2);

    expect(
      screen.getByRole("button", { name: "Increase" }).querySelector("svg"),
    ).not.toBeNull();
    expect(
      screen.getByRole("button", { name: "Decrease" }).querySelector("svg"),
    ).not.toBeNull();
  });

  it("integrates with Field label and invalid state", () => {
    render(
      <Field invalid>
        <Field.Label>Seats</Field.Label>
        <NumberField defaultValue={1} />
        <Field.Error>Minimum 2 seats required.</Field.Error>
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Seats" });
    expect(input.getAttribute("aria-invalid")).toBe("true");
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <Field>
        <Field.Label>Copies</Field.Label>
        <NumberField defaultValue={1} min={1} max={99} />
      </Field>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
