import { render, screen } from "@testing-library/react";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { ScrollArea } from "./scroll-area.js";

describe("ScrollArea", () => {
  const originalGetAnimations = Element.prototype.getAnimations;

  beforeAll(() => {
    if (typeof Element.prototype.getAnimations !== "function") {
      Element.prototype.getAnimations = () => [];
    }
  });

  afterAll(() => {
    Element.prototype.getAnimations = originalGetAnimations;
  });

  it("renders scrollable viewport with children and maxHeight", () => {
    render(
      <ScrollArea maxHeight={160} aria-label="Changelog">
        <p>Version 1.0.0 released.</p>
      </ScrollArea>,
    );

    expect(screen.getByText("Version 1.0.0 released.")).toBeTruthy();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <ScrollArea orientation="both" maxHeight="12rem">
        <div>Scrollable content block</div>
      </ScrollArea>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
