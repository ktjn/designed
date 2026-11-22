import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Banner, type BannerVariant } from "./banner";

describe("Banner", () => {
  it("defaults to info variant with status role and data attributes", () => {
    render(
      <Banner title="Scheduled maintenance">
        Systems will be read-only on Sunday.
      </Banner>,
    );

    const banner = screen.getByRole("status");
    expect(banner.getAttribute("data-slot")).toBe("banner");
    expect(banner.getAttribute("data-variant")).toBe("info");
    expect(
      banner.querySelector('[data-slot="banner-title"]')?.textContent,
    ).toBe("Scheduled maintenance");
    expect(
      banner.querySelector('[data-slot="banner-content"]')?.textContent,
    ).toBe("Systems will be read-only on Sunday.");
  });

  it("uses status role for info and success and alert role for warning and danger", () => {
    const cases: Array<{
      variant: BannerVariant;
      role: "status" | "alert";
    }> = [
      { variant: "info", role: "status" },
      { variant: "success", role: "status" },
      { variant: "warning", role: "alert" },
      { variant: "danger", role: "alert" },
    ];

    const { rerender } = render(<Banner variant="info">Initial</Banner>);

    for (const { variant, role } of cases) {
      rerender(<Banner variant={variant}>{variant} announcement</Banner>);
      const region = screen.getByRole(role);
      expect(region.getAttribute("data-variant")).toBe(variant);
      expect(region.textContent).toContain(`${variant} announcement`);
    }
  });

  it("allows overriding the ARIA role", () => {
    render(
      <Banner variant="info" role="alert">
        Urgent notice
      </Banner>,
    );

    expect(screen.getByRole("alert").textContent).toContain("Urgent notice");
  });

  it("renders distinct decorative default semantic icons for each variant", () => {
    const variants: BannerVariant[] = ["info", "success", "warning", "danger"];
    const iconMarkups = new Set<string>();

    const { container, rerender } = render(
      <Banner variant="info">Message</Banner>,
    );

    for (const variant of variants) {
      rerender(<Banner variant={variant}>Message</Banner>);
      const iconSlot = container.querySelector('[data-slot="banner-icon"]');
      const svg = iconSlot?.querySelector("svg");
      expect(iconSlot).toBeTruthy();
      expect(svg).toBeTruthy();
      expect(svg?.getAttribute("aria-hidden")).toBe("true");
      if (svg?.innerHTML) {
        iconMarkups.add(svg.innerHTML);
      }
    }

    expect(iconMarkups.size).toBe(4);
  });

  it("supports custom icons including 0 and suppresses the icon slot for null, booleans, and empty string", () => {
    const { container, rerender } = render(
      <Banner icon={<span data-testid="custom-icon">!</span>}>Message</Banner>,
    );

    expect(container.querySelector('[data-slot="banner-icon"]')).toBeTruthy();
    expect(screen.getByTestId("custom-icon")).toBeTruthy();

    rerender(<Banner icon={0}>Message</Banner>);
    expect(
      container.querySelector('[data-slot="banner-icon"]')?.textContent,
    ).toBe("0");

    rerender(<Banner icon={null}>Message</Banner>);
    expect(container.querySelector('[data-slot="banner-icon"]')).toBeNull();

    rerender(<Banner icon={false}>Message</Banner>);
    expect(container.querySelector('[data-slot="banner-icon"]')).toBeNull();

    rerender(<Banner icon={true}>Message</Banner>);
    expect(container.querySelector('[data-slot="banner-icon"]')).toBeNull();

    rerender(<Banner icon="">Message</Banner>);
    expect(container.querySelector('[data-slot="banner-icon"]')).toBeNull();
  });

  it("preserves numeric zero in title, action, and children", () => {
    const { container } = render(
      <Banner title={0} action={0}>
        {0}
      </Banner>,
    );

    expect(
      container.querySelector('[data-slot="banner-title"]')?.textContent,
    ).toBe("0");
    expect(
      container.querySelector('[data-slot="banner-content"]')?.textContent,
    ).toBe("0");
    expect(
      container.querySelector('[data-slot="banner-action"]')?.textContent,
    ).toBe("0");
  });

  it("omits title, action, and content slots for null, undefined, booleans, and empty strings", () => {
    const { container, rerender } = render(
      <Banner title={false} action={false}>
        {false}
      </Banner>,
    );

    expect(container.querySelector('[data-slot="banner-body"]')).toBeTruthy();
    expect(container.querySelector('[data-slot="banner-title"]')).toBeNull();
    expect(container.querySelector('[data-slot="banner-content"]')).toBeNull();
    expect(container.querySelector('[data-slot="banner-action"]')).toBeNull();

    rerender(
      <Banner title={true} action={true}>
        {true}
      </Banner>,
    );
    expect(container.querySelector('[data-slot="banner-title"]')).toBeNull();
    expect(container.querySelector('[data-slot="banner-content"]')).toBeNull();
    expect(container.querySelector('[data-slot="banner-action"]')).toBeNull();

    rerender(
      <Banner title="" action="">
        {""}
      </Banner>,
    );
    expect(container.querySelector('[data-slot="banner-title"]')).toBeNull();
    expect(container.querySelector('[data-slot="banner-content"]')).toBeNull();
    expect(container.querySelector('[data-slot="banner-action"]')).toBeNull();

    rerender(
      <Banner title={null} action={undefined}>
        {null}
      </Banner>,
    );
    expect(container.querySelector('[data-slot="banner-title"]')).toBeNull();
    expect(container.querySelector('[data-slot="banner-content"]')).toBeNull();
    expect(container.querySelector('[data-slot="banner-action"]')).toBeNull();
  });

  it("renders action slot and dismiss button with default and custom labels", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();

    const { container, rerender } = render(
      <Banner action={<button type="button">Upgrade</button>}>
        Trial ends soon.
      </Banner>,
    );

    expect(container.querySelector('[data-slot="banner-action"]')).toBeTruthy();
    expect(screen.getByRole("button", { name: "Upgrade" })).toBeTruthy();
    expect(container.querySelector('[data-slot="banner-dismiss"]')).toBeNull();

    rerender(<Banner onDismiss={onDismiss}>Trial ends soon.</Banner>);

    const dismissButton = screen.getByRole("button", { name: "Dismiss" });
    expect(dismissButton.getAttribute("type")).toBe("button");
    expect(dismissButton.getAttribute("data-slot")).toBe("banner-dismiss");
    expect(
      dismissButton.querySelector("svg")?.getAttribute("aria-hidden"),
    ).toBe("true");

    await user.click(dismissButton);
    expect(onDismiss).toHaveBeenCalledTimes(1);

    rerender(
      <Banner onDismiss={onDismiss} dismissLabel="Close announcement">
        Trial ends soon.
      </Banner>,
    );
    expect(
      screen.getByRole("button", { name: "Close announcement" }),
    ).toBeTruthy();
  });

  it("forwards ref, className, and HTML attributes", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Banner
        ref={ref}
        className="custom-banner"
        data-testid="system-banner"
        id="top-banner"
      >
        Announcement
      </Banner>,
    );

    expect(ref.current?.tagName).toBe("DIV");
    expect(ref.current?.classList.contains("custom-banner")).toBe(true);
    expect(ref.current?.id).toBe("top-banner");
    expect(screen.getByTestId("system-banner")).toBe(ref.current);
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <div>
        <Banner
          variant="info"
          title="Version 2.0 is live"
          action={<button type="button">Release notes</button>}
          onDismiss={() => {}}
        >
          Explore the new dashboard widgets.
        </Banner>
        <Banner variant="success" title="Migration complete">
          All workspaces have been upgraded.
        </Banner>
        <Banner
          variant="warning"
          title="Approaching limit"
          onDismiss={() => {}}
        >
          You have used 90% of your monthly quota.
        </Banner>
        <Banner variant="danger" title="Service disruption">
          API requests are experiencing elevated latency.
        </Banner>
      </div>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
