import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { CheckboxGroup } from "../checkbox-group/checkbox-group";
import { CheckboxCard } from "./checkbox-card";

describe("CheckboxCard", () => {
  it("renders the label and description and toggles on click", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <CheckboxCard
        label="Email notifications"
        description="Get notified by email"
        onCheckedChange={onCheckedChange}
      />,
    );
    expect(screen.getByText("Get notified by email")).toBeTruthy();
    await user.click(screen.getByText("Email notifications"));
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("works inside a CheckboxGroup", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup defaultValue={["email"]} onValueChange={onValueChange}>
        <CheckboxCard value="email" label="Email" description="Daily digest" />
        <CheckboxCard value="sms" label="SMS" description="Urgent alerts" />
      </CheckboxGroup>,
    );
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes[0]?.getAttribute("aria-checked")).toBe("true");
    expect(checkboxes[1]?.getAttribute("aria-checked")).toBe("false");

    await user.click(screen.getByText("SMS"));
    expect(onValueChange).toHaveBeenCalledWith(
      ["email", "sms"],
      expect.anything(),
    );
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <CheckboxCard
        label="Email notifications"
        disabled
        onCheckedChange={onCheckedChange}
      />,
    );
    await user.click(screen.getByText("Email notifications"));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("does not toggle when parent CheckboxGroup is disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup disabled onValueChange={onValueChange}>
        <CheckboxCard value="email" label="Email" description={0} />
      </CheckboxGroup>,
    );
    expect(screen.getByText("0")).toBeTruthy();
    await user.click(screen.getByText("Email"));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("forwards ref to the label element", () => {
    const ref = createRef<HTMLLabelElement>();
    render(<CheckboxCard ref={ref} label="Email notifications" />);
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(<CheckboxCard label="Email notifications" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
