import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Popover } from "./popover";

// Opening Popover under jsdom hangs indefinitely: floating-ui's autoUpdate
// (via @base-ui/react's anchor positioning) enters a starvation loop when
// combined with jsdom's all-zero getBoundingClientRect layout, confirmed by
// isolating the click from the render (render alone is fine; the hang starts
// immediately after open, before even a single macrotask can run — not a
// missing-API issue, since PointerEvent/ResizeObserver/IntersectionObserver
// are all polyfilled in tests/setup.ts). Open/close, keyboard, focus, and
// axe coverage for Popover instead lives in Storybook interaction tests
// (apps/storybook/stories/popover.stories.tsx), which run in a real browser.
describe("Popover", () => {
  it("renders a closed trigger without mounting the popup", () => {
    render(
      <Popover>
        <Popover.Trigger>Info</Popover.Trigger>
        <Popover.Content>
          <Popover.Title>More info</Popover.Title>
        </Popover.Content>
      </Popover>,
    );
    expect(screen.getByRole("button", { name: "Info" })).toBeTruthy();
    expect(screen.queryByRole("dialog")).toBeNull();
  });
});
