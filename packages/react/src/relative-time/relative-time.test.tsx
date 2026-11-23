import { act, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { RelativeTime } from "./relative-time";

const FIXED_NOW = new Date("2026-06-15T12:00:00.000Z");

describe("RelativeTime", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders a time element with ISO dateTime for past and future units", () => {
    const cases: Array<{
      label: string;
      date: Date | string | number;
      expectedText: string;
      expectedIso: string;
    }> = [
      {
        label: "past seconds",
        date: new Date("2026-06-15T11:59:30.000Z"),
        expectedText: "30 seconds ago",
        expectedIso: "2026-06-15T11:59:30.000Z",
      },
      {
        label: "future seconds",
        date: new Date("2026-06-15T12:00:45.000Z"),
        expectedText: "in 45 seconds",
        expectedIso: "2026-06-15T12:00:45.000Z",
      },
      {
        label: "past minutes",
        date: "2026-06-15T11:55:00.000Z",
        expectedText: "5 minutes ago",
        expectedIso: "2026-06-15T11:55:00.000Z",
      },
      {
        label: "future minutes",
        date: "2026-06-15T12:10:00.000Z",
        expectedText: "in 10 minutes",
        expectedIso: "2026-06-15T12:10:00.000Z",
      },
      {
        label: "past hours",
        date: Date.parse("2026-06-15T09:00:00.000Z"),
        expectedText: "3 hours ago",
        expectedIso: "2026-06-15T09:00:00.000Z",
      },
      {
        label: "future hours",
        date: Date.parse("2026-06-15T14:00:00.000Z"),
        expectedText: "in 2 hours",
        expectedIso: "2026-06-15T14:00:00.000Z",
      },
      {
        label: "past days",
        date: new Date("2026-06-12T12:00:00.000Z"),
        expectedText: "3 days ago",
        expectedIso: "2026-06-12T12:00:00.000Z",
      },
      {
        label: "future days",
        date: new Date("2026-06-19T12:00:00.000Z"),
        expectedText: "in 4 days",
        expectedIso: "2026-06-19T12:00:00.000Z",
      },
      {
        label: "past weeks",
        date: new Date("2026-06-01T12:00:00.000Z"),
        expectedText: "2 weeks ago",
        expectedIso: "2026-06-01T12:00:00.000Z",
      },
      {
        label: "future weeks",
        date: new Date("2026-06-29T12:00:00.000Z"),
        expectedText: "in 2 weeks",
        expectedIso: "2026-06-29T12:00:00.000Z",
      },
      {
        label: "past months",
        date: new Date("2026-04-15T12:00:00.000Z"),
        expectedText: "2 months ago",
        expectedIso: "2026-04-15T12:00:00.000Z",
      },
      {
        label: "future months",
        date: new Date("2026-09-15T12:00:00.000Z"),
        expectedText: "in 3 months",
        expectedIso: "2026-09-15T12:00:00.000Z",
      },
      {
        label: "past years",
        date: new Date("2024-06-15T12:00:00.000Z"),
        expectedText: "2 years ago",
        expectedIso: "2024-06-15T12:00:00.000Z",
      },
      {
        label: "future years",
        date: new Date("2028-06-15T12:00:00.000Z"),
        expectedText: "in 2 years",
        expectedIso: "2028-06-15T12:00:00.000Z",
      },
    ];

    const { rerender } = render(
      <RelativeTime date={FIXED_NOW} now={FIXED_NOW} locale="en-US" />,
    );

    for (const item of cases) {
      rerender(
        <RelativeTime
          date={item.date}
          now={FIXED_NOW}
          locale="en-US"
          data-testid="rt"
        />,
      );
      const element = screen.getByTestId("rt");
      expect(element.tagName, item.label).toBe("TIME");
      expect(element.getAttribute("data-slot"), item.label).toBe(
        "relative-time",
      );
      expect(element.getAttribute("dateTime"), item.label).toBe(
        item.expectedIso,
      );
      expect(element.textContent, item.label).toBe(item.expectedText);
    }
  });

  it("supports long, short, and narrow formats", () => {
    const date = new Date("2026-06-15T11:55:00.000Z");

    const { rerender } = render(
      <RelativeTime
        date={date}
        now={FIXED_NOW}
        locale="en-US"
        format="long"
        data-testid="rt"
      />,
    );
    expect(screen.getByTestId("rt").textContent).toBe(
      new Intl.RelativeTimeFormat("en-US", {
        style: "long",
        numeric: "auto",
      }).format(-5, "minute"),
    );

    rerender(
      <RelativeTime
        date={date}
        now={FIXED_NOW}
        locale="en-US"
        format="short"
        data-testid="rt"
      />,
    );
    expect(screen.getByTestId("rt").textContent).toBe(
      new Intl.RelativeTimeFormat("en-US", {
        style: "short",
        numeric: "auto",
      }).format(-5, "minute"),
    );

    rerender(
      <RelativeTime
        date={date}
        now={FIXED_NOW}
        locale="en-US"
        format="narrow"
        data-testid="rt"
      />,
    );
    expect(screen.getByTestId("rt").textContent).toBe(
      new Intl.RelativeTimeFormat("en-US", {
        style: "narrow",
        numeric: "auto",
      }).format(-5, "minute"),
    );
  });

  it("formats elapsed time from an unrounded signed difference", () => {
    function formatElapsed(elapsedMilliseconds: number): string {
      const seconds = Math.max(0, Math.floor(elapsedMilliseconds / 1000));
      if (seconds < 60) return `${seconds}s ago`;
      if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
      return `${Math.floor(seconds / 3600)}h ago`;
    }

    const { rerender } = render(
      <RelativeTime
        date="2026-06-15T11:59:47.500Z"
        now={FIXED_NOW}
        formatter={formatElapsed}
        data-testid="rt"
      />,
    );
    const time = screen.getByTestId("rt");
    expect(time.textContent).toBe("12s ago");
    expect(time.getAttribute("datetime")).toBe("2026-06-15T11:59:47.500Z");
    expect(time.getAttribute("title")).toBeTruthy();

    rerender(
      <RelativeTime
        date={FIXED_NOW.getTime() + 1000}
        now={FIXED_NOW}
        formatter={formatElapsed}
        data-testid="rt"
      />,
    );
    expect(time.textContent).toBe("0s ago");

    rerender(
      <RelativeTime
        date="2026-06-14T11:00:00.000Z"
        now={FIXED_NOW}
        formatter={formatElapsed}
        data-testid="rt"
      />,
    );
    expect(time.textContent).toBe("25h ago");
  });

  it("supports numeric auto and always", () => {
    const yesterday = new Date("2026-06-14T12:00:00.000Z");

    const { rerender } = render(
      <RelativeTime
        date={yesterday}
        now={FIXED_NOW}
        locale="en-US"
        numeric="auto"
        data-testid="rt"
      />,
    );
    expect(screen.getByTestId("rt").textContent).toBe("yesterday");

    rerender(
      <RelativeTime
        date={yesterday}
        now={FIXED_NOW}
        locale="en-US"
        numeric="always"
        data-testid="rt"
      />,
    );
    expect(screen.getByTestId("rt").textContent).toBe("1 day ago");
  });

  it("formats according to the provided locale", () => {
    const yesterday = new Date("2026-06-14T12:00:00.000Z");

    const { rerender } = render(
      <RelativeTime
        date={yesterday}
        now={FIXED_NOW}
        locale="en-US"
        data-testid="rt"
      />,
    );
    expect(screen.getByTestId("rt").textContent).toBe(
      new Intl.RelativeTimeFormat("en-US", {
        style: "long",
        numeric: "auto",
      }).format(-1, "day"),
    );

    rerender(
      <RelativeTime
        date={yesterday}
        now={FIXED_NOW}
        locale="sv-SE"
        data-testid="rt"
      />,
    );
    expect(screen.getByTestId("rt").textContent).toBe(
      new Intl.RelativeTimeFormat("sv-SE", {
        style: "long",
        numeric: "auto",
      }).format(-1, "day"),
    );
  });

  it("sets default title via Intl.DateTimeFormat, omits it when showTitle is false, and respects explicit title", () => {
    const date = new Date("2026-06-14T12:00:00.000Z");
    const expectedTitle = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);

    const { rerender } = render(
      <RelativeTime
        date={date}
        now={FIXED_NOW}
        locale="en-US"
        data-testid="rt"
      />,
    );
    expect(screen.getByTestId("rt").getAttribute("title")).toBe(expectedTitle);

    rerender(
      <RelativeTime
        date={date}
        now={FIXED_NOW}
        locale="en-US"
        showTitle={false}
        data-testid="rt"
      />,
    );
    expect(screen.getByTestId("rt").hasAttribute("title")).toBe(false);

    rerender(
      <RelativeTime
        date={date}
        now={FIXED_NOW}
        locale="en-US"
        title="Custom exact time"
        data-testid="rt"
      />,
    );
    expect(screen.getByTestId("rt").getAttribute("title")).toBe(
      "Custom exact time",
    );
  });

  it("refreshes on refreshInterval and cleans up interval on unmount", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-15T12:00:00.000Z"));

    const clearIntervalSpy = vi.spyOn(globalThis, "clearInterval");

    const { unmount } = render(
      <RelativeTime
        date="2026-06-15T11:59:30.000Z"
        locale="en-US"
        refreshInterval={10_000}
        data-testid="rt"
      />,
    );

    expect(screen.getByTestId("rt").textContent).toBe("30 seconds ago");

    act(() => {
      vi.advanceTimersByTime(30_000);
    });
    expect(screen.getByTestId("rt").textContent).toBe("1 minute ago");

    unmount();
    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });

  it("skips interval setup when now is explicitly provided or refreshInterval is non-positive", () => {
    vi.useFakeTimers();
    const setIntervalSpy = vi.spyOn(globalThis, "setInterval");

    const { rerender } = render(
      <RelativeTime
        date="2026-06-15T11:55:00.000Z"
        now={FIXED_NOW}
        refreshInterval={1000}
      />,
    );
    expect(setIntervalSpy).not.toHaveBeenCalled();

    rerender(
      <RelativeTime date="2026-06-15T11:55:00.000Z" refreshInterval={0} />,
    );
    expect(setIntervalSpy).not.toHaveBeenCalled();

    rerender(
      <RelativeTime
        date="2026-06-15T11:55:00.000Z"
        refreshInterval={Number.POSITIVE_INFINITY}
      />,
    );
    expect(setIntervalSpy).not.toHaveBeenCalled();

    setIntervalSpy.mockRestore();
  });

  it("handles invalid dates gracefully without throwing", () => {
    const invalidInputs: Array<Date | string | number> = [
      "not-a-date",
      new Date("invalid"),
      Number.NaN,
      Number.POSITIVE_INFINITY,
    ];

    const { rerender } = render(
      <RelativeTime date="not-a-date" data-testid="rt" />,
    );

    for (const invalidDate of invalidInputs) {
      rerender(<RelativeTime date={invalidDate} data-testid="rt" />);
      const element = screen.getByTestId("rt");
      expect(element.tagName).toBe("TIME");
      expect(element.getAttribute("data-slot")).toBe("relative-time");
      expect(element.hasAttribute("dateTime")).toBe(false);
      expect(element.textContent).toBe("");
    }
  });

  it("forwards ref, className, and HTML attributes", () => {
    const ref = createRef<HTMLTimeElement>();

    render(
      <RelativeTime
        ref={ref}
        date="2026-06-15T11:55:00.000Z"
        now={FIXED_NOW}
        locale="en-US"
        className="custom-time"
        data-testid="custom-rt"
        id="updated-at"
      />,
    );

    expect(ref.current).toBe(screen.getByTestId("custom-rt"));
    expect(ref.current?.tagName).toBe("TIME");
    expect(ref.current?.classList.contains("custom-time")).toBe(true);
    expect(ref.current?.id).toBe("updated-at");
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <p>
        Last updated{" "}
        <RelativeTime
          date="2026-06-15T11:45:00.000Z"
          now={FIXED_NOW}
          locale="en-US"
        />
      </p>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
