import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Field } from "../field/field";
import { PasswordInput } from "./password-input";

describe("PasswordInput", () => {
  it("masks input by default and reveals it via the visibility toggle", async () => {
    const user = userEvent.setup();
    render(<PasswordInput aria-label="Password" defaultValue="secret" />);

    const input = screen.getByLabelText("Password") as HTMLInputElement;
    expect(input.type).toBe("password");

    const toggle = screen.getByRole("button", { name: "Show password" });
    expect(toggle.getAttribute("aria-pressed")).toBe("false");

    await user.click(toggle);
    expect(input.type).toBe("text");
    expect(
      screen
        .getByRole("button", { name: "Hide password" })
        .getAttribute("aria-pressed"),
    ).toBe("true");
  });

  it("supports a controlled visible prop and onVisibleChange", async () => {
    const user = userEvent.setup();
    const onVisibleChange = vi.fn();
    render(
      <PasswordInput
        aria-label="Password"
        visible={false}
        onVisibleChange={onVisibleChange}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(onVisibleChange).toHaveBeenCalledWith(true);
    // Controlled: stays masked since the `visible` prop hasn't changed.
    expect((screen.getByLabelText("Password") as HTMLInputElement).type).toBe(
      "password",
    );
  });

  it("reflects invalid state from Field context", () => {
    render(
      <Field invalid>
        <Field.Label>Password</Field.Label>
        <PasswordInput />
      </Field>,
    );
    expect(screen.getByLabelText("Password").getAttribute("aria-invalid")).toBe(
      "true",
    );
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <PasswordInput aria-label="Password" defaultValue="secret" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
