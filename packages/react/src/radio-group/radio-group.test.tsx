import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { RadioGroup } from "./radio-group";

describe("RadioGroup", () => {
  it("renders a group of accessible radio buttons", () => {
    render(
      <RadioGroup aria-label="Plan">
        <RadioGroup.Item value="basic">Basic</RadioGroup.Item>
        <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
      </RadioGroup>,
    );
    expect(screen.getByRole("radiogroup", { name: "Plan" })).toBeTruthy();
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("selects an item on click and reports the value via onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup aria-label="Plan" onValueChange={onValueChange}>
        <RadioGroup.Item value="basic">Basic</RadioGroup.Item>
        <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
      </RadioGroup>,
    );
    await user.click(screen.getByText("Pro"));
    expect(onValueChange).toHaveBeenCalledWith("pro");
  });

  it("moves selection between items with arrow keys", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup aria-label="Plan" onValueChange={onValueChange}>
        <RadioGroup.Item value="basic">Basic</RadioGroup.Item>
        <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
      </RadioGroup>,
    );
    await user.tab();
    await user.keyboard("{ArrowDown}");
    expect(onValueChange).toHaveBeenCalledWith("pro");
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <RadioGroup aria-label="Plan">
        <RadioGroup.Item value="basic">Basic</RadioGroup.Item>
        <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
      </RadioGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
