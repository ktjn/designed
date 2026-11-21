import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { PreviewCard } from "./preview-card.js";

describe("PreviewCard", () => {
  it("renders trigger link while keeping preview closed by default", () => {
    render(
      <PreviewCard>
        <PreviewCard.Trigger href="https://example.com">
          Design system docs
        </PreviewCard.Trigger>
        <PreviewCard.Content>
          Tokens, icons, and accessible React primitives.
        </PreviewCard.Content>
      </PreviewCard>,
    );

    const link = screen.getByRole("link", { name: "Design system docs" });
    expect(link.getAttribute("href")).toBe("https://example.com");
    expect(
      screen.queryByText("Tokens, icons, and accessible React primitives."),
    ).toBeNull();
  });

  it("has no axe violations in its closed state", async () => {
    const { container } = render(
      <PreviewCard>
        <PreviewCard.Trigger href="https://example.com">
          Profile
        </PreviewCard.Trigger>
        <PreviewCard.Content>Maintainer profile summary.</PreviewCard.Content>
      </PreviewCard>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
