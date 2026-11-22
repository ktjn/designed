import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Calendar, type CalendarProps } from "./calendar";

describe("Calendar", () => {
  it("selects a date and emits an ISO YYYY-MM-DD string", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Calendar defaultValue="2026-05-15" onValueChange={onValueChange} />,
    );

    await user.click(screen.getByRole("button", { name: /2026-05-20/ }));
    expect(onValueChange).toHaveBeenCalledWith("2026-05-20");
  });

  it("omits children from CalendarProps", () => {
    const props: CalendarProps = {
      defaultValue: "2026-05-15",
      // @ts-expect-error Calendar renders its own grid and does not accept children
      children: null,
    };
    expect(props.defaultValue).toBe("2026-05-15");
  });

  it("syncs the displayed month and roving focus when controlled value changes", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Calendar value="2026-01-15" />);

    expect(screen.getByRole("button", { name: "2026-01-15" })).toBeTruthy();

    rerender(<Calendar value="2026-12-20" />);
    const dec20 = screen.getByRole("button", { name: "2026-12-20" });
    expect(dec20.getAttribute("aria-pressed")).toBe("true");
    expect(dec20.getAttribute("tabindex")).toBe("0");

    await user.click(screen.getByRole("button", { name: "Previous month" }));
    expect(screen.getByRole("button", { name: "2026-11-15" })).toBeTruthy();

    rerender(<Calendar value="2026-12-20" />);
    expect(screen.getByRole("button", { name: "2026-11-15" })).toBeTruthy();
  });

  it("navigates months and respects min/max bounds", async () => {
    const user = userEvent.setup();
    render(
      <Calendar defaultValue="2026-05-15" min="2026-05-10" max="2026-05-20" />,
    );

    const beforeMin = screen.getByRole("button", {
      name: /2026-05-09/,
    }) as HTMLButtonElement;
    expect(beforeMin.disabled).toBe(true);

    await user.click(screen.getByRole("button", { name: "Next month" }));
    expect(screen.getByRole("button", { name: /2026-06-01/ })).toBeTruthy();
  });

  it("keeps an enabled day tabbable after navigating to another month", async () => {
    const user = userEvent.setup();
    render(<Calendar defaultValue="2026-05-15" />);

    await user.click(screen.getByRole("button", { name: "Next month" }));

    const tabbableDays = screen
      .getAllByRole("button", { name: /^\d{4}-\d{2}-\d{2}$/ })
      .filter((btn) => btn.getAttribute("tabindex") === "0");
    expect(tabbableDays).toHaveLength(1);
    expect((tabbableDays[0] as HTMLButtonElement).disabled).toBe(false);
  });

  it("clamps PageDown across month-end boundaries without skipping February", async () => {
    const user = userEvent.setup();
    render(<Calendar defaultValue="2026-01-31" />);

    const jan31 = screen.getByRole("button", { name: "2026-01-31" });
    jan31.focus();
    await user.keyboard("{PageDown}");

    const feb28 = screen.getByRole("button", { name: "2026-02-28" });
    expect(feb28.getAttribute("tabindex")).toBe("0");
  });

  it("starts weeks on Monday for sv-SE locale and aligns Home/End to Monday-Sunday", async () => {
    const user = userEvent.setup();
    render(<Calendar defaultValue="2026-06-17" locale="sv-SE" />);

    const headers = screen.getAllByRole("columnheader");
    expect(headers[0]?.textContent?.toLowerCase()).toMatch(/^m/);

    const wed = screen.getByRole("button", { name: "2026-06-17" });
    wed.focus();
    await user.keyboard("{Home}");
    expect(
      screen
        .getByRole("button", { name: "2026-06-15" })
        .getAttribute("tabindex"),
    ).toBe("0");

    await user.keyboard("{End}");
    expect(
      screen
        .getByRole("button", { name: "2026-06-21" })
        .getAttribute("tabindex"),
    ).toBe("0");
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(<Calendar defaultValue="2026-05-15" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
