import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Field } from "../field/field";
import { TimePicker } from "./time-picker";

describe("TimePicker", () => {
  it("renders a native time input and reports changes", () => {
    const onValueChange = vi.fn();
    render(
      <TimePicker aria-label="Start time" onValueChange={onValueChange} />,
    );
    const input = screen.getByLabelText("Start time") as HTMLInputElement;
    expect(input.type).toBe("time");

    fireEvent.change(input, { target: { value: "14:30" } });
    expect(onValueChange).toHaveBeenCalledWith("14:30");
  });

  it("applies min, max, and step", () => {
    render(
      <TimePicker aria-label="Shift time" min="09:00" max="17:00" step={900} />,
    );
    const input = screen.getByLabelText("Shift time") as HTMLInputElement;
    expect(input.min).toBe("09:00");
    expect(input.max).toBe("17:00");
    expect(input.step).toBe("900");
  });

  it("reflects invalid state from Field context", () => {
    render(
      <Field invalid>
        <Field.Label>Meeting time</Field.Label>
        <TimePicker />
      </Field>,
    );
    expect(
      screen.getByLabelText("Meeting time").getAttribute("aria-invalid"),
    ).toBe("true");
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <Field>
        <Field.Label>Alarm time</Field.Label>
        <TimePicker defaultValue="08:00" />
      </Field>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
