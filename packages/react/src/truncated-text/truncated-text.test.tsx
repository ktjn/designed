import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { TruncatedText } from "./truncated-text";

// jsdom has no real layout, so scrollWidth/clientWidth are always 0 and the
// ResizeObserver polyfill in tests/setup.ts never invokes its callback --
// overflow detection can't be exercised here. Real-browser coverage lives in
// Storybook interaction tests (apps/storybook/stories/truncated-text.stories.tsx).
describe("TruncatedText", () => {
  it("renders the full text content and no tooltip when nothing overflows", () => {
    render(<TruncatedText>Short label</TruncatedText>);
    expect(screen.getByText("Short label")).toBeTruthy();
    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("applies the multi-line clamp attribute when lines is greater than 1", () => {
    render(<TruncatedText lines={3}>Multi-line label</TruncatedText>);
    expect(
      screen.getByText("Multi-line label").getAttribute("data-lines"),
    ).toBe("3");
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <TruncatedText>Accessible text</TruncatedText>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
