import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Field } from "../field/field";
import { OTPField } from "./otp-field";

describe("OTPField", () => {
  it("renders the requested number of slots and emits completed codes", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onValueComplete = vi.fn();
    render(
      <Field>
        <Field.Label>Verification code</Field.Label>
        <OTPField
          length={4}
          onValueChange={onValueChange}
          onValueComplete={onValueComplete}
        />
      </Field>,
    );

    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(4);
    await user.click(inputs[0] as HTMLElement);
    await user.keyboard("4829");
    expect(onValueChange).toHaveBeenLastCalledWith("4829");
    expect(onValueComplete).toHaveBeenCalledWith("4829");
  });

  it("associates Field.Label with the first input and gives each slot a distinct position name", () => {
    render(
      <Field>
        <Field.Label>Verification code</Field.Label>
        <OTPField length={4} />
      </Field>,
    );
    const label = screen.getByText("Verification code") as HTMLLabelElement;
    const target = document.getElementById(label.htmlFor);
    expect(target?.tagName).toBe("INPUT");

    const inputs = screen.getAllByRole("textbox");
    expect(inputs[0]).toBe(target);
    const descriptions = inputs.map((input) => {
      const ids = (input.getAttribute("aria-describedby") ?? "")
        .split(/\s+/)
        .filter(Boolean);
      return ids
        .map((id) => document.getElementById(id)?.textContent ?? "")
        .join(" ")
        .trim();
    });
    expect(descriptions).toEqual([
      "Character 1 of 4",
      "Character 2 of 4",
      "Character 3 of 4",
      "Character 4 of 4",
    ]);
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <Field>
        <Field.Label>One-time code</Field.Label>
        <OTPField length={6} />
      </Field>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("labels every input slot when rendered standalone with aria-label", async () => {
    const { container } = render(
      <OTPField length={4} aria-label="One-time code" />,
    );
    const inputs = screen.getAllByRole("textbox", { name: "One-time code" });
    expect(inputs).toHaveLength(4);
    expect(await axe(container)).toHaveNoViolations();
  });
});
