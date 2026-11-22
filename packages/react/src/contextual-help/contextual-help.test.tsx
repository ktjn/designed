import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { ContextualHelp, type ContextualHelpVariant } from "./contextual-help";

describe("ContextualHelp", () => {
  it("renders a closed info trigger with default Information label and no popup", () => {
    render(
      <ContextualHelp heading="API rate limits">
        Standard plans allow 1,000 requests per minute.
      </ContextualHelp>,
    );

    const trigger = screen.getByRole("button", { name: "Information" });
    expect(trigger.getAttribute("type")).toBe("button");
    expect(trigger.getAttribute("data-slot")).toBe("contextual-help-trigger");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.queryByText("API rate limits")).toBeNull();
  });

  it("defaults aria-label to Help for help variant and respects custom label", () => {
    const { rerender } = render(
      <ContextualHelp variant="help" heading="Need assistance?">
        Contact workspace support for billing changes.
      </ContextualHelp>,
    );

    expect(screen.getByRole("button", { name: "Help" })).toBeTruthy();

    rerender(
      <ContextualHelp
        variant="info"
        label="Billing cycle details"
        heading="Billing cycle"
      >
        Invoices are generated on the first of each month.
      </ContextualHelp>,
    );

    expect(
      screen.getByRole("button", { name: "Billing cycle details" }),
    ).toBeTruthy();
  });

  it("renders distinct decorative SVG icons for info and help variants", () => {
    const variants: ContextualHelpVariant[] = ["info", "help"];
    const markups = new Set<string>();

    const { rerender } = render(
      <ContextualHelp variant="info" heading="Details">
        Body copy
      </ContextualHelp>,
    );

    for (const variant of variants) {
      rerender(
        <ContextualHelp variant={variant} heading="Details">
          Body copy
        </ContextualHelp>,
      );

      const trigger = screen.getByRole("button");
      const svg = trigger.querySelector("svg");
      expect(svg).toBeTruthy();
      expect(svg?.getAttribute("aria-hidden")).toBe("true");
      if (svg?.innerHTML) {
        markups.add(svg.innerHTML);
      }
    }

    expect(markups.size).toBe(2);
  });

  it("supports ref, footer, controlled closed state, and positioning props", () => {
    const ref = createRef<HTMLDivElement>();
    const onOpenChange = vi.fn();

    render(
      <ContextualHelp
        ref={ref}
        variant="help"
        heading="Permissions"
        footer={<a href="/docs/permissions">Learn more about permissions</a>}
        open={false}
        defaultOpen={false}
        onOpenChange={onOpenChange}
        side="bottom"
        sideOffset={8}
        align="start"
        alignOffset={2}
        collisionPadding={8}
        className="custom-help"
      >
        Only administrators can invite members.
      </ContextualHelp>,
    );

    expect(screen.getByRole("button", { name: "Help" })).toBeTruthy();
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(ref.current).toBeNull();
  });

  it("has no automatically detectable accessibility violations in closed state", async () => {
    const { container } = render(
      <div>
        <ContextualHelp heading="Info heading">
          Informational details.
        </ContextualHelp>
        <ContextualHelp
          variant="help"
          heading="Help heading"
          footer={<a href="/docs">Documentation</a>}
        >
          Troubleshooting instructions.
        </ContextualHelp>
        <ContextualHelp
          variant="info"
          label="More about webhooks"
          heading="Webhooks"
        >
          Delivered over HTTPS.
        </ContextualHelp>
      </div>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
