import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { ColorSwatch } from "./color-swatch.js";

describe("ColorSwatch", () => {
  it("defaults aria-label to the raw value when no label is given", () => {
    render(<ColorSwatch value="#ff0000" />);
    const swatch = screen.getByRole("img", { name: "#ff0000" });
    expect(swatch.dataset.slot).toBe("color-swatch");
  });

  it("uses the explicit label over the raw value", () => {
    render(<ColorSwatch value="#ff0000" label="Brand red" />);
    expect(screen.getByRole("img", { name: "Brand red" })).toBeTruthy();
    expect(screen.queryByRole("img", { name: "#ff0000" })).toBeNull();
  });

  it("applies size classes and forwards the custom color property", () => {
    render(<ColorSwatch value="rgb(0, 128, 255)" size="large" label="Sky" />);
    const swatch = screen.getByRole("img", { name: "Sky" });
    expect(swatch.style.getPropertyValue("--color-swatch-value")).toBe(
      "rgb(0, 128, 255)",
    );
  });

  it("forwards refs and has no axe violations", async () => {
    const ref = createRef<HTMLSpanElement>();
    const { container } = render(
      <ColorSwatch ref={ref} value="hsl(120, 100%, 50%)" label="Green" />,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(await axe(container)).toHaveNoViolations();
  });
});
