import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "../button/button";
import { Tooltip } from "./tooltip";

// See the comment in ../popover/popover.test.tsx: opening any Base UI
// floating-positioned popup (Popover/Tooltip/Menu) hangs indefinitely under
// jsdom. Open/close, keyboard, and axe coverage for Tooltip instead lives in
// Storybook interaction tests (apps/storybook/stories/tooltip.stories.tsx).
describe("Tooltip", () => {
  it("is hidden by default and does not change the trigger element type", () => {
    render(
      <Tooltip content="Saves your changes">
        <Button>Save</Button>
      </Tooltip>,
    );
    expect(screen.queryByRole("tooltip")).toBeNull();
    expect(screen.getByRole("button", { name: "Save" }).tagName).toBe("BUTTON");
  });

  it("does not attach a dangling aria-describedby while closed", () => {
    render(
      <Tooltip content="Saves your changes">
        <Button>Save</Button>
      </Tooltip>,
    );
    expect(
      screen
        .getByRole("button", { name: "Save" })
        .getAttribute("aria-describedby"),
    ).toBeNull();
  });

  it("preserves existing aria-describedby on the trigger element while closed", () => {
    render(
      <>
        <span id="hint-id">Shortcut: Ctrl+S</span>
        <Tooltip content="Saves your changes">
          <Button aria-describedby="hint-id">Save</Button>
        </Tooltip>
      </>,
    );
    expect(
      screen
        .getByRole("button", { name: "Save" })
        .getAttribute("aria-describedby"),
    ).toBe("hint-id");
  });
});
