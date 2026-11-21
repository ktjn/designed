import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Kbd } from "./kbd.js";

describe("Kbd", () => {
  it("renders a kbd element with data-slot and size", () => {
    render(<Kbd size="sm">Ctrl+K</Kbd>);

    const el = screen.getByText("Ctrl+K");
    expect(el.tagName).toBe("KBD");
    expect(el.getAttribute("data-slot")).toBe("kbd");
    expect(el.getAttribute("data-size")).toBe("sm");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <p>
        Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search.
      </p>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
