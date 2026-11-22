import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("renders as an accessible checkbox", () => {
    render(<Checkbox aria-label="Accept terms" />);
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(checkbox).toBeTruthy();
    expect(checkbox.getAttribute("aria-checked")).toBe("false");
  });

  it("toggles on click and reports state via onCheckedChange", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox aria-label="Accept terms" onCheckedChange={onCheckedChange} />,
    );
    await user.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("toggles via keyboard (space) when focused", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox aria-label="Accept terms" onCheckedChange={onCheckedChange} />,
    );
    await user.tab();
    expect(screen.getByRole("checkbox")).toHaveProperty("tagName");
    await user.keyboard(" ");
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("does not respond to interaction when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        aria-label="Accept terms"
        disabled
        onCheckedChange={onCheckedChange}
      />,
    );
    await user.click(screen.getByRole("checkbox"));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(<Checkbox aria-label="Accept terms" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  // Regression test for a real bug: the indicator rendered the same
  // checkmark glyph for both checked and indeterminate, making the two
  // states visually identical (found via a manual Storybook review). CSS
  // toggles which glyph is visible via the indicator's data-indeterminate
  // attribute, which jsdom doesn't apply stylesheets for, so this asserts
  // the wiring the CSS depends on: a distinct element per state, gated by
  // that attribute actually being present.
  it("marks the indicator indeterminate and renders both glyphs for CSS to toggle", () => {
    const { container } = render(
      <Checkbox aria-label="Select all" indeterminate />,
    );
    const indicator = container.querySelector("[data-indeterminate]");
    expect(indicator).toBeTruthy();
    const svgs = Array.from(indicator?.querySelectorAll("svg") ?? []);
    expect(svgs).toHaveLength(2);
    expect(svgs[0]?.getAttribute("class")).not.toEqual(
      svgs[1]?.getAttribute("class"),
    );
  });
});
