import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { AspectRatio } from "./aspect-ratio.js";

describe("AspectRatio", () => {
  it("sets aspectRatio style and data-slot", () => {
    render(
      <AspectRatio ratio={16 / 9} data-testid="frame">
        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="Preview" />
      </AspectRatio>,
    );

    const frame = screen.getByTestId("frame");
    expect(frame.getAttribute("data-slot")).toBe("aspect-ratio");
    expect(frame.style.aspectRatio).toMatch(/^1\.777/);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <AspectRatio ratio={4 / 3}>
        <img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="Banner" />
      </AspectRatio>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
