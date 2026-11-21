import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Meter } from "./meter.js";

describe("Meter", () => {
  it("renders meter semantics, label, and formatted value", () => {
    render(<Meter value={72} label="Storage used" showValue />);

    const meter = screen.getByRole("meter", { name: "Storage used" });
    expect(meter.getAttribute("aria-valuenow")).toBe("72");
    expect(meter.getAttribute("aria-valuemin")).toBe("0");
    expect(meter.getAttribute("aria-valuemax")).toBe("100");
    expect(screen.getByText(/72\s*%/)).toBeTruthy();
  });

  it("supports custom bounds and variants with no axe violations", async () => {
    const { container } = render(
      <Meter value={8} min={0} max={10} label="Quota" variant="warning" />,
    );

    const meter = screen.getByRole("meter", { name: "Quota" });
    expect(meter.getAttribute("aria-valuemax")).toBe("10");
    expect(await axe(container)).toHaveNoViolations();
  });
});
