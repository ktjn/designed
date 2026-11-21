import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Slider } from "./slider";

describe("Slider", () => {
  it("renders a single-value slider and updates via keyboard", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Slider
        aria-label="Volume"
        defaultValue={50}
        min={0}
        max={100}
        step={10}
        onValueChange={onValueChange}
      />,
    );
    const thumb = screen.getByRole("slider", { name: "Volume" });
    expect(thumb.getAttribute("aria-valuenow")).toBe("50");
    thumb.focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenCalledWith(60);
  });

  it("renders two thumbs for range values", () => {
    render(
      <Slider
        aria-label="Price range"
        defaultValue={[20, 80]}
        min={0}
        max={100}
      />,
    );
    const sliders = screen.getAllByRole("slider");
    expect(sliders).toHaveLength(2);
    expect(sliders[0]?.getAttribute("aria-valuenow")).toBe("20");
    expect(sliders[1]?.getAttribute("aria-valuenow")).toBe("80");
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <Slider aria-label="Brightness" defaultValue={40} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
