import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Switch } from "./switch";

describe("Switch", () => {
  it("renders as an accessible switch", () => {
    render(<Switch aria-label="Enable notifications" />);
    const control = screen.getByRole("switch", {
      name: "Enable notifications",
    });
    expect(control.getAttribute("aria-checked")).toBe("false");
  });

  it("toggles on click", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch
        aria-label="Enable notifications"
        onCheckedChange={onCheckedChange}
      />,
    );
    await user.click(screen.getByRole("switch"));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("toggles via keyboard when focused", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch
        aria-label="Enable notifications"
        onCheckedChange={onCheckedChange}
      />,
    );
    await user.tab();
    await user.keyboard(" ");
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(<Switch aria-label="Enable notifications" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
