import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Container } from "./container.js";

describe("Container", () => {
  it("renders size and padded attributes with data-slot", () => {
    render(
      <Container size="md" padded={false} data-testid="container">
        <p>Page content</p>
      </Container>,
    );

    const el = screen.getByTestId("container");
    expect(el.getAttribute("data-slot")).toBe("container");
    expect(el.getAttribute("data-size")).toBe("md");
    expect(el.hasAttribute("data-padded")).toBe(false);
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Container size="lg">
        <p>Centered layout content</p>
      </Container>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
