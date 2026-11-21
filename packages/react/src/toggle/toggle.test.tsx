import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Toggle } from "./toggle";

describe("Toggle", () => {
  it("toggles pressed state on click", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(<Toggle onPressedChange={onPressedChange}>Bold</Toggle>);

    const button = screen.getByRole("button", { name: "Bold" });
    expect(button.getAttribute("aria-pressed")).toBe("false");

    await user.click(button);
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(<Toggle defaultPressed>Italic</Toggle>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
