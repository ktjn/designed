import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Stat } from "./stat";

describe("Stat", () => {
  it("renders label, value, delta, helpText, and children", () => {
    const { container } = render(
      <Stat
        label="Monthly revenue"
        value="$48,200"
        delta="+12.4%"
        trend="up"
        helpText="Compared to last month"
      >
        <span>Updated just now</span>
      </Stat>,
    );

    expect(container.querySelector('[data-slot="stat"]')).toBeTruthy();
    expect(screen.getByText("Monthly revenue").getAttribute("data-slot")).toBe(
      "stat-label",
    );
    expect(screen.getByText("$48,200").getAttribute("data-slot")).toBe(
      "stat-value",
    );
    const delta = container.querySelector('[data-slot="stat-delta"]');
    expect(delta?.textContent).toBe("+12.4%");
    expect(delta?.getAttribute("data-trend")).toBe("up");
    expect(
      screen.getByText("Compared to last month").getAttribute("data-slot"),
    ).toBe("stat-help-text");
    expect(screen.getByText("Updated just now")).toBeTruthy();
  });

  it("omits optional delta and helpText slots when not provided", () => {
    const { container } = render(<Stat label="Active users" value="1,284" />);

    expect(container.querySelector('[data-slot="stat-delta"]')).toBeNull();
    expect(container.querySelector('[data-slot="stat-help-text"]')).toBeNull();
  });

  it("sets an optional tone independently of the trend and extra content", () => {
    const { rerender } = render(
      <Stat
        label="Latency"
        value="90 ms"
        tone="warning"
        trend="up"
        delta="+15 ms"
        data-testid="stat"
      >
        <span>Last hour</span>
      </Stat>,
    );
    expect(screen.getByTestId("stat").getAttribute("data-tone")).toBe(
      "warning",
    );
    expect(screen.getByText("+15 ms").getAttribute("data-trend")).toBe("up");
    expect(screen.getByText("Last hour")).toBeTruthy();

    rerender(<Stat label="Latency" value="90 ms" data-testid="stat" />);
    expect(screen.getByTestId("stat").hasAttribute("data-tone")).toBe(false);
  });

  it("renders distinct decorative icons for up, down, and neutral trends", () => {
    const { container, rerender } = render(
      <Stat label="Conversion" value="4.2%" delta="+0.8%" trend="up" />,
    );

    let delta = container.querySelector('[data-slot="stat-delta"]');
    let icon = delta?.querySelector("svg");
    expect(delta?.getAttribute("data-trend")).toBe("up");
    expect(icon?.getAttribute("aria-hidden")).toBe("true");
    const upIconHtml = icon?.innerHTML;

    rerender(
      <Stat label="Conversion" value="4.2%" delta="-0.3%" trend="down" />,
    );
    delta = container.querySelector('[data-slot="stat-delta"]');
    icon = delta?.querySelector("svg");
    expect(delta?.getAttribute("data-trend")).toBe("down");
    expect(icon?.getAttribute("aria-hidden")).toBe("true");
    const downIconHtml = icon?.innerHTML;

    rerender(<Stat label="Conversion" value="4.2%" delta="0.0%" />);
    delta = container.querySelector('[data-slot="stat-delta"]');
    icon = delta?.querySelector("svg");
    expect(delta?.getAttribute("data-trend")).toBe("neutral");
    expect(icon?.getAttribute("aria-hidden")).toBe("true");
    const neutralIconHtml = icon?.innerHTML;

    expect(upIconHtml).toBeTruthy();
    expect(downIconHtml).toBeTruthy();
    expect(neutralIconHtml).toBeTruthy();
    expect(upIconHtml).not.toBe(downIconHtml);
    expect(upIconHtml).not.toBe(neutralIconHtml);
    expect(downIconHtml).not.toBe(neutralIconHtml);
  });

  it("renders numeric zero values for value, delta, and helpText", () => {
    const { container } = render(
      <Stat label="Open incidents" value={0} delta={0} helpText={0} />,
    );

    expect(
      container.querySelector('[data-slot="stat-value"]')?.textContent,
    ).toBe("0");
    expect(
      container.querySelector('[data-slot="stat-delta"]')?.textContent,
    ).toBe("0");
    expect(
      container.querySelector('[data-slot="stat-help-text"]')?.textContent,
    ).toBe("0");
  });

  it("omits delta and helpText slots for boolean and empty string values", () => {
    const { container, rerender } = render(
      <Stat label="Open incidents" value={0} delta={false} helpText={false} />,
    );

    expect(container.querySelector('[data-slot="stat-delta"]')).toBeNull();
    expect(container.querySelector('[data-slot="stat-help-text"]')).toBeNull();

    rerender(
      <Stat label="Open incidents" value={0} delta={true} helpText={true} />,
    );
    expect(container.querySelector('[data-slot="stat-delta"]')).toBeNull();
    expect(container.querySelector('[data-slot="stat-help-text"]')).toBeNull();

    rerender(<Stat label="Open incidents" value={0} delta="" helpText="" />);
    expect(container.querySelector('[data-slot="stat-delta"]')).toBeNull();
    expect(container.querySelector('[data-slot="stat-help-text"]')).toBeNull();
  });

  it("forwards ref and className", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Stat
        ref={ref}
        className="custom-stat"
        label="Latency"
        value="42 ms"
        data-testid="latency-stat"
      />,
    );

    expect(ref.current?.tagName).toBe("DIV");
    expect(ref.current?.classList.contains("custom-stat")).toBe(true);
    expect(screen.getByTestId("latency-stat")).toBe(ref.current);
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <div>
        <Stat
          label="Revenue"
          value="$48,200"
          delta="+12.4%"
          trend="up"
          helpText="vs. prior 30 days"
        />
        <Stat
          label="Churn rate"
          value="2.1%"
          delta="-0.4%"
          trend="down"
          helpText="vs. prior 30 days"
        />
        <Stat
          label="Uptime"
          value="99.98%"
          delta="0.0%"
          trend="neutral"
          helpText="SLA target 99.9%"
        />
      </div>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
