import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Timeline, type TimelineBadgeVariant } from "./timeline";

describe("Timeline", () => {
  it("renders an ordered list with timeline slots", () => {
    const { container } = render(
      <Timeline aria-label="Deployment history">
        <Timeline.Item>
          <Timeline.Badge />
          <Timeline.Body timestamp="10:00 AM">Build started</Timeline.Body>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Badge variant="success" />
          <Timeline.Body timestamp="10:05 AM">Build succeeded</Timeline.Body>
        </Timeline.Item>
      </Timeline>,
    );

    const list = screen.getByRole("list", { name: "Deployment history" });
    expect(list.tagName).toBe("OL");
    expect(list.getAttribute("data-slot")).toBe("timeline");

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    for (const item of items) {
      expect(item.tagName).toBe("LI");
      expect(item.getAttribute("data-slot")).toBe("timeline-item");
    }

    expect(
      container.querySelectorAll('[data-slot="timeline-badge"]'),
    ).toHaveLength(2);
    expect(
      container.querySelectorAll('[data-slot="timeline-body"]'),
    ).toHaveLength(2);
    expect(
      container.querySelectorAll('[data-slot="timeline-timestamp"]'),
    ).toHaveLength(2);
    expect(screen.getByText("Build started")).toBeTruthy();
    expect(screen.getByText("Build succeeded")).toBeTruthy();
  });

  it("supports all five badge variants and defaults to neutral", () => {
    const variants: TimelineBadgeVariant[] = [
      "neutral",
      "info",
      "success",
      "warning",
      "danger",
    ];

    const { container } = render(
      <Timeline>
        <Timeline.Item>
          <Timeline.Badge data-testid="default-badge" />
          <Timeline.Body>Default</Timeline.Body>
        </Timeline.Item>
        {variants.map((variant) => (
          <Timeline.Item key={variant}>
            <Timeline.Badge
              variant={variant}
              data-testid={`badge-${variant}`}
            />
            <Timeline.Body>{variant}</Timeline.Body>
          </Timeline.Item>
        ))}
      </Timeline>,
    );

    expect(
      screen.getByTestId("default-badge").getAttribute("data-variant"),
    ).toBe("neutral");

    for (const variant of variants) {
      const badge = screen.getByTestId(`badge-${variant}`);
      expect(badge.getAttribute("data-slot")).toBe("timeline-badge");
      expect(badge.getAttribute("data-variant")).toBe(variant);
    }

    expect(
      container.querySelectorAll('[data-slot="timeline-dot"]'),
    ).toHaveLength(6);
  });

  it("renders a decorative dot when badge children are empty and renders custom content otherwise", () => {
    const { container, rerender } = render(
      <Timeline>
        <Timeline.Item>
          <Timeline.Badge />
          <Timeline.Body>Empty</Timeline.Body>
        </Timeline.Item>
      </Timeline>,
    );

    const dot = container.querySelector('[data-slot="timeline-dot"]');
    expect(dot?.tagName).toBe("SPAN");
    expect(dot?.getAttribute("aria-hidden")).toBe("true");

    for (const emptyChild of [null, undefined, false, true, ""]) {
      rerender(
        <Timeline>
          <Timeline.Item>
            <Timeline.Badge>{emptyChild}</Timeline.Badge>
            <Timeline.Body>Empty</Timeline.Body>
          </Timeline.Item>
        </Timeline>,
      );
      expect(
        container.querySelector('[data-slot="timeline-dot"]'),
      ).toBeTruthy();
    }

    rerender(
      <Timeline>
        <Timeline.Item>
          <Timeline.Badge>
            <svg data-testid="custom-icon" aria-hidden="true" />
          </Timeline.Badge>
          <Timeline.Body>Custom icon</Timeline.Body>
        </Timeline.Item>
      </Timeline>,
    );
    expect(container.querySelector('[data-slot="timeline-dot"]')).toBeNull();
    expect(screen.getByTestId("custom-icon")).toBeTruthy();

    rerender(
      <Timeline>
        <Timeline.Item>
          <Timeline.Badge>{0}</Timeline.Badge>
          <Timeline.Body>Zero badge</Timeline.Body>
        </Timeline.Item>
      </Timeline>,
    );
    expect(container.querySelector('[data-slot="timeline-dot"]')).toBeNull();
    expect(
      container.querySelector('[data-slot="timeline-badge"]')?.textContent,
    ).toBe("0");
  });

  it("preserves numeric zero in timestamp and omits timestamp for null, undefined, booleans, and empty string", () => {
    const { container, rerender } = render(
      <Timeline>
        <Timeline.Item>
          <Timeline.Badge />
          <Timeline.Body timestamp={0}>Initial step</Timeline.Body>
        </Timeline.Item>
      </Timeline>,
    );

    expect(
      container.querySelector('[data-slot="timeline-timestamp"]')?.textContent,
    ).toBe("0");

    for (const emptyTimestamp of [null, undefined, false, true, ""]) {
      rerender(
        <Timeline>
          <Timeline.Item>
            <Timeline.Badge />
            <Timeline.Body timestamp={emptyTimestamp}>Step</Timeline.Body>
          </Timeline.Item>
        </Timeline>,
      );
      expect(
        container.querySelector('[data-slot="timeline-timestamp"]'),
      ).toBeNull();
    }
  });

  it("forwards refs, className, and HTML attributes to all subcomponents", () => {
    const rootRef = createRef<HTMLOListElement>();
    const itemRef = createRef<HTMLLIElement>();
    const badgeRef = createRef<HTMLDivElement>();
    const bodyRef = createRef<HTMLDivElement>();

    render(
      <Timeline
        ref={rootRef}
        className="custom-timeline"
        data-testid="timeline-root"
        id="activity-log"
      >
        <Timeline.Item
          ref={itemRef}
          className="custom-item"
          data-testid="timeline-item"
        >
          <Timeline.Badge
            ref={badgeRef}
            className="custom-badge"
            data-testid="timeline-badge"
          />
          <Timeline.Body
            ref={bodyRef}
            className="custom-body"
            data-testid="timeline-body"
            timestamp="Just now"
          >
            Created workspace
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>,
    );

    expect(rootRef.current).toBe(screen.getByTestId("timeline-root"));
    expect(rootRef.current?.tagName).toBe("OL");
    expect(rootRef.current?.classList.contains("custom-timeline")).toBe(true);
    expect(rootRef.current?.id).toBe("activity-log");

    expect(itemRef.current).toBe(screen.getByTestId("timeline-item"));
    expect(itemRef.current?.tagName).toBe("LI");
    expect(itemRef.current?.classList.contains("custom-item")).toBe(true);

    expect(badgeRef.current).toBe(screen.getByTestId("timeline-badge"));
    expect(badgeRef.current?.tagName).toBe("DIV");
    expect(badgeRef.current?.classList.contains("custom-badge")).toBe(true);

    expect(bodyRef.current).toBe(screen.getByTestId("timeline-body"));
    expect(bodyRef.current?.tagName).toBe("DIV");
    expect(bodyRef.current?.classList.contains("custom-body")).toBe(true);
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <Timeline aria-label="Order timeline">
        <Timeline.Item>
          <Timeline.Badge variant="success" />
          <Timeline.Body timestamp="May 1, 2026">Order placed</Timeline.Body>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Badge variant="info" />
          <Timeline.Body timestamp="May 2, 2026">Shipped</Timeline.Body>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Badge variant="warning" />
          <Timeline.Body timestamp="May 3, 2026">Delayed</Timeline.Body>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Badge variant="danger" />
          <Timeline.Body timestamp="May 4, 2026">
            Delivery attempted
          </Timeline.Body>
        </Timeline.Item>
      </Timeline>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
