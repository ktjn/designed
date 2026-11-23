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

  it("validates impossible and out-of-range typed dates on commit and native form validation", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <form data-testid="date-form">
        <Field>
          <Field.Label>Booking date</Field.Label>
          <DatePicker
            name="booking"
            min="2026-05-10"
            max="2026-05-20"
            onValueChange={onValueChange}
          />
        </Field>
      </form>,
    );

    const form = screen.getByTestId("date-form") as HTMLFormElement;
    const input = screen.getByRole("textbox", {
      name: "Booking date",
    }) as HTMLInputElement;

    await user.type(input, "2026-02-30");
    await user.tab();
    expect(input.validity.valid).toBe(false);
    expect(form.checkValidity()).toBe(false);
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(onValueChange).not.toHaveBeenCalledWith("2026-02-30");

    await user.clear(input);
    await user.type(input, "2026-05-25");
    await user.tab();
    expect(input.validity.valid).toBe(false);
    expect(form.checkValidity()).toBe(false);
    expect(onValueChange).not.toHaveBeenCalledWith("2026-05-25");

    await user.clear(input);
    await user.type(input, "2026-05-15");
    await user.tab();
    expect(input.validity.valid).toBe(true);
    expect(form.checkValidity()).toBe(true);
    expect(onValueChange).toHaveBeenLastCalledWith("2026-05-15");
  });

  it("enforces readOnly on both text input and calendar trigger", () => {
    render(
      <Field>
        <Field.Label>Locked date</Field.Label>
        <DatePicker defaultValue="2026-05-15" readOnly />
      </Field>,
    );

    const input = screen.getByRole("textbox", {
      name: "Locked date",
    }) as HTMLInputElement;
    const trigger = screen.getByRole("button", {
      name: "Choose date",
    }) as HTMLButtonElement;
    expect(input.readOnly).toBe(true);
    expect(trigger.disabled).toBe(true);
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

  it("applies the small size class to the root", () => {
    render(<DatePicker aria-label="Start date" size="small" />);
    expect(
      screen.getByRole("textbox").closest('[data-slot="date-picker"]')
        ?.className,
    ).toContain("small");
  });

  it("applies the large size class to the root", () => {
    render(<DatePicker aria-label="Start date" size="large" />);
    expect(
      screen.getByRole("textbox").closest('[data-slot="date-picker"]')
        ?.className,
    ).toContain("large");
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
