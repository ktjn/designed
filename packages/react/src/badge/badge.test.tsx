import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders label text for each semantic variant", () => {
    const variants = [
      "neutral",
      "info",
      "success",
      "warning",
      "danger",
    ] as const;
    render(
      <div>
        {variants.map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
          </Badge>
        ))}
      </div>,
    );
    for (const variant of variants) {
      expect(screen.getByText(variant)).toBeTruthy();
    }
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(<Badge variant="success">Active</Badge>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
