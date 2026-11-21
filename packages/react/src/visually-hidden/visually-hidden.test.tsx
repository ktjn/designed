import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { VisuallyHidden } from "./visually-hidden";

describe("VisuallyHidden", () => {
  it("keeps text accessible to assistive technology", () => {
    render(
      <button type="button">
        <VisuallyHidden>Close menu</VisuallyHidden>
      </button>,
    );
    expect(screen.getByRole("button", { name: "Close menu" })).toBeTruthy();
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <button type="button">
        <VisuallyHidden>Open settings</VisuallyHidden>
      </button>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
