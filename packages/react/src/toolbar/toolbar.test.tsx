import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Toolbar } from "./toolbar.js";

describe("Toolbar", () => {
  it("renders toolbar buttons, links, groups, and separators", () => {
    const onBold = vi.fn();
    render(
      <Toolbar aria-label="Text formatting">
        <Toolbar.Group>
          <Toolbar.Button onClick={onBold}>Bold</Toolbar.Button>
          <Toolbar.Button>Italic</Toolbar.Button>
        </Toolbar.Group>
        <Toolbar.Separator />
        <Toolbar.Link href="https://example.com">Help</Toolbar.Link>
      </Toolbar>,
    );

    const toolbar = screen.getByRole("toolbar", { name: "Text formatting" });
    expect(toolbar).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Bold" }));
    expect(onBold).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole("link", { name: "Help" }).getAttribute("href"),
    ).toBe("https://example.com");
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Toolbar aria-label="Editor actions">
        <Toolbar.Button>Undo</Toolbar.Button>
        <Toolbar.Button>Redo</Toolbar.Button>
      </Toolbar>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
