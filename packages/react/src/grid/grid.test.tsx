import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Grid } from "./grid.js";

describe("Grid", () => {
  it("renders column count, gap, and auto-fit minItemWidth with data-slot", () => {
    const { rerender } = render(
      <Grid columns={3} gap="lg" data-testid="grid">
        <div>A</div>
        <div>B</div>
        <div>C</div>
      </Grid>,
    );

    const el = screen.getByTestId("grid");
    expect(el.getAttribute("data-slot")).toBe("grid");
    expect(el.getAttribute("data-columns")).toBe("3");
    expect(el.getAttribute("data-gap")).toBe("lg");

    rerender(
      <Grid columns="auto" minItemWidth="14rem" data-testid="grid">
        <div>A</div>
      </Grid>,
    );

    expect(el.getAttribute("data-columns")).toBe("auto");
    expect(el.style.getPropertyValue("--ds-grid-min-width")).toBe("14rem");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Grid columns={2} gap="md">
        <div>Cell 1</div>
        <div>Cell 2</div>
      </Grid>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
