import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Stack } from "./stack.js";

describe("Stack", () => {
  it("renders vertical and horizontal layout attributes with data-slot", () => {
    render(
      <Stack
        direction="horizontal"
        gap="lg"
        align="center"
        justify="between"
        wrap
        data-testid="stack"
      >
        <span>One</span>
        <span>Two</span>
      </Stack>,
    );

    const el = screen.getByTestId("stack");
    expect(el.getAttribute("data-slot")).toBe("stack");
    expect(el.getAttribute("data-direction")).toBe("horizontal");
    expect(el.getAttribute("data-gap")).toBe("lg");
    expect(el.getAttribute("data-align")).toBe("center");
    expect(el.getAttribute("data-justify")).toBe("between");
    expect(el.getAttribute("data-wrap")).toBe("");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Stack gap="md">
        <p>First</p>
        <p>Second</p>
      </Stack>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
