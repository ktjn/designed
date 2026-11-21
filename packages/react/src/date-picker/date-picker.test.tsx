import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Field } from "../field/field";
import { DatePicker } from "./date-picker";

describe("DatePicker", () => {
  it("integrates with Field and emits typed ISO dates", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Field>
        <Field.Label>Start date</Field.Label>
        <DatePicker onValueChange={onValueChange} />
      </Field>,
    );

    const input = screen.getByRole("textbox", { name: "Start date" });
    await user.type(input, "2026-08-12");
    expect(onValueChange).toHaveBeenLastCalledWith("2026-08-12");
  });

  it("reflects invalid state from Field context", () => {
    render(
      <Field invalid>
        <Field.Label>Due date</Field.Label>
        <DatePicker />
        <Field.Error>Choose a valid date.</Field.Error>
      </Field>,
    );
    expect(
      screen
        .getByRole("textbox", { name: "Due date" })
        .getAttribute("aria-invalid"),
    ).toBe("true");
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <Field>
        <Field.Label>Event date</Field.Label>
        <DatePicker defaultValue="2026-05-15" />
      </Field>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
