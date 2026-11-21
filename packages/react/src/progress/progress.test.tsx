import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Progress } from "./progress";

describe("Progress", () => {
  it("renders determinate progress with label and percentage", () => {
    render(<Progress value={60} label="Uploading" showValue />);
    const bar = screen.getByRole("progressbar", { name: "Uploading" });
    expect(bar.getAttribute("aria-valuenow")).toBe("60");
    expect(bar.getAttribute("aria-valuemax")).toBe("100");
    expect(screen.getByText(/60\s*%/)).toBeTruthy();
  });

  it("supports indeterminate progress when value is null", () => {
    render(<Progress value={null} aria-label="Preparing files" />);
    const bar = screen.getByRole("progressbar", { name: "Preparing files" });
    expect(bar.getAttribute("aria-valuenow")).toBeNull();
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <Progress value={40} label="Storage used" showValue />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
