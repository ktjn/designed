import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import {
  StatusIndicator,
  type StatusIndicatorVariant,
} from "./status-indicator";

const iconVariants = [
  "neutral",
  "info",
  "success",
  "warning",
  "danger",
] as const satisfies readonly StatusIndicatorVariant[];

const allVariants = [
  ...iconVariants,
  "pending",
  "loading",
] as const satisfies readonly StatusIndicatorVariant[];

describe("StatusIndicator", () => {
  it("renders default neutral variant with label slot", () => {
    const { container } = render(<StatusIndicator>Idle</StatusIndicator>);

    const root = container.querySelector('[data-slot="status-indicator"]');
    expect(root?.tagName).toBe("SPAN");
    expect(root?.getAttribute("data-variant")).toBe("neutral");
    expect(root?.hasAttribute("data-pulse")).toBe(false);

    const label = screen.getByText("Idle");
    expect(label.getAttribute("data-slot")).toBe("status-indicator-label");
  });

  it("renders all 7 variants with distinct accessible non-color cues", () => {
    const iconMarkup = new Map<string, string>();

    for (const variant of iconVariants) {
      const { container, unmount } = render(
        <StatusIndicator variant={variant}>{variant}</StatusIndicator>,
      );

      const root = container.querySelector('[data-slot="status-indicator"]');
      expect(root?.getAttribute("data-variant")).toBe(variant);

      const svg = root?.querySelector("svg");
      expect(svg).toBeTruthy();
      expect(svg?.getAttribute("aria-hidden")).toBe("true");
      expect(
        root?.querySelector('[data-slot="status-indicator-dot"]'),
      ).toBeNull();
      expect(
        root?.querySelector('[data-slot="status-indicator-spinner"]'),
      ).toBeNull();

      iconMarkup.set(variant, svg?.innerHTML ?? "");
      unmount();
    }

    expect(new Set(iconMarkup.values()).size).toBe(iconVariants.length);

    const pendingResult = render(
      <StatusIndicator variant="pending">Queued</StatusIndicator>,
    );
    const pendingRoot = pendingResult.container.querySelector(
      '[data-slot="status-indicator"]',
    );
    const dot = pendingRoot?.querySelector(
      '[data-slot="status-indicator-dot"]',
    );
    expect(pendingRoot?.getAttribute("data-variant")).toBe("pending");
    expect(dot).toBeTruthy();
    expect(dot?.getAttribute("aria-hidden")).toBe("true");
    expect(pendingRoot?.querySelector("svg")).toBeNull();
    expect(
      pendingRoot?.querySelector('[data-slot="status-indicator-spinner"]'),
    ).toBeNull();
    pendingResult.unmount();

    const loadingResult = render(
      <StatusIndicator variant="loading">Syncing</StatusIndicator>,
    );
    const loadingRoot = loadingResult.container.querySelector(
      '[data-slot="status-indicator"]',
    );
    const spinner = loadingRoot?.querySelector(
      '[data-slot="status-indicator-spinner"]',
    );
    expect(loadingRoot?.getAttribute("data-variant")).toBe("loading");
    expect(spinner).toBeTruthy();
    expect(spinner?.getAttribute("aria-hidden")).toBe("true");
    expect(loadingRoot?.querySelector("svg")).toBeNull();
    expect(
      loadingRoot?.querySelector('[data-slot="status-indicator-dot"]'),
    ).toBeNull();
  });

  it("toggles data-pulse attribute based on pulse prop", () => {
    const { container, rerender } = render(
      <StatusIndicator variant="success">Connected</StatusIndicator>,
    );

    const root = container.querySelector('[data-slot="status-indicator"]');
    expect(root?.hasAttribute("data-pulse")).toBe(false);

    rerender(
      <StatusIndicator variant="success" pulse>
        Connected
      </StatusIndicator>,
    );
    expect(root?.getAttribute("data-pulse")).toBe("");

    rerender(
      <StatusIndicator variant="success" pulse={false}>
        Connected
      </StatusIndicator>,
    );
    expect(root?.hasAttribute("data-pulse")).toBe(false);
  });

  it("renders numeric 0 children and omits label slot for null, undefined, booleans, and empty string", () => {
    const { container, rerender } = render(
      <StatusIndicator variant="info">{0}</StatusIndicator>,
    );

    expect(
      container.querySelector('[data-slot="status-indicator-label"]')
        ?.textContent,
    ).toBe("0");

    for (const emptyChild of [undefined, null, false, true, ""]) {
      rerender(<StatusIndicator variant="info">{emptyChild}</StatusIndicator>);
      expect(
        container.querySelector('[data-slot="status-indicator-label"]'),
      ).toBeNull();
    }
  });

  it("forwards ref, className, and additional span attributes", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <StatusIndicator
        ref={ref}
        variant="warning"
        className="custom-status"
        role="status"
        data-testid="degraded-status"
      >
        Degraded
      </StatusIndicator>,
    );

    expect(ref.current?.tagName).toBe("SPAN");
    expect(ref.current?.classList.contains("custom-status")).toBe(true);
    expect(ref.current?.getAttribute("role")).toBe("status");
    expect(screen.getByTestId("degraded-status")).toBe(ref.current);
  });

  it("has no automatically detectable accessibility violations across all variants", async () => {
    const { container } = render(
      <div>
        {allVariants.map((variant) => (
          <StatusIndicator key={variant} variant={variant}>
            {variant}
          </StatusIndicator>
        ))}
        <StatusIndicator variant="success" pulse>
          Live
        </StatusIndicator>
        <StatusIndicator variant="pending" pulse>
          Awaiting approval
        </StatusIndicator>
      </div>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
