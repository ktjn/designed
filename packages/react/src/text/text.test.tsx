import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Text } from "./text";

describe("Text", () => {
  it("renders a paragraph by default", () => {
    render(<Text>Body copy</Text>);
    const node = screen.getByText("Body copy");
    expect(node.tagName).toBe("P");
  });

  it("renders the element given via as", () => {
    render(<Text as="span">Inline copy</Text>);
    expect(screen.getByText("Inline copy").tagName).toBe("SPAN");
  });

  it("exposes size, weight, and tone as data attributes", () => {
    render(
      <Text size="300" weight="bold" tone="muted">
        Styled
      </Text>,
    );
    const node = screen.getByText("Styled");
    expect(node.getAttribute("data-size")).toBe("300");
    expect(node.getAttribute("data-weight")).toBe("bold");
    expect(node.getAttribute("data-tone")).toBe("muted");
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(<Text>Accessible copy</Text>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
