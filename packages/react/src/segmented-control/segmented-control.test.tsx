import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { SegmentedControl } from "./segmented-control";

function ControlledSegmentedControl({
  onValueChange,
}: {
  onValueChange: (value: "day" | "week" | "month") => void;
}) {
  const [value, setValue] = useState<"day" | "week" | "month">("day");
  return (
    <SegmentedControl
      aria-label="Range"
      value={value}
      onValueChange={(next) => {
        onValueChange(next);
        setValue(next);
      }}
    >
      <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
      <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
      <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
    </SegmentedControl>
  );
}

function WrappedSegmentItem({
  value,
  label,
  disabled,
  onClick,
}: {
  value: string;
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <SegmentedControl.Item value={value} disabled={disabled} onClick={onClick}>
      {label}
    </SegmentedControl.Item>
  );
}

function DynamicWrappedSegmentItems({ mode }: { mode: "remove" | "disable" }) {
  const [changed, setChanged] = useState(false);
  return (
    <>
      {mode === "remove" && changed ? null : (
        <SegmentedControl.Item
          value="first"
          disabled={mode === "disable" && changed}
        >
          First
        </SegmentedControl.Item>
      )}
      <SegmentedControl.Item value="second">Second</SegmentedControl.Item>
      <SegmentedControl.Item value="third">Third</SegmentedControl.Item>
      <button type="button" onClick={() => setChanged(true)}>
        Mutate wrapper
      </button>
    </>
  );
}

describe("SegmentedControl", () => {
  it("renders a radiogroup with radio button items and defaults to medium size", () => {
    render(
      <SegmentedControl aria-label="View mode" defaultValue="list">
        <SegmentedControl.Item value="list">List</SegmentedControl.Item>
        <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
      </SegmentedControl>,
    );

    const group = screen.getByRole("radiogroup", { name: "View mode" });
    expect(group.getAttribute("data-slot")).toBe("segmented-control");
    expect(group.getAttribute("data-size")).toBe("medium");
    expect(group.hasAttribute("data-full-width")).toBe(false);
    expect(group.hasAttribute("data-disabled")).toBe(false);
    expect(group.hasAttribute("aria-disabled")).toBe(false);

    const items = screen.getAllByRole("radio");
    expect(items).toHaveLength(2);
    expect(items[0]?.getAttribute("type")).toBe("button");
    expect(items[0]?.getAttribute("data-slot")).toBe("segmented-control-item");
    expect(items[0]?.getAttribute("aria-checked")).toBe("true");
    expect(items[0]?.hasAttribute("data-selected")).toBe(true);
    expect(items[0]?.tabIndex).toBe(0);
    expect(items[1]?.getAttribute("aria-checked")).toBe("false");
    expect(items[1]?.hasAttribute("data-selected")).toBe(false);
    expect(items[1]?.tabIndex).toBe(-1);
  });

  it("defaults uncontrolled selection to the first enabled item or undefined when all are disabled", () => {
    const { rerender } = render(
      <SegmentedControl aria-label="View mode">
        <SegmentedControl.Item value="list" disabled>
          List
        </SegmentedControl.Item>
        <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
        <SegmentedControl.Item value="board">Board</SegmentedControl.Item>
      </SegmentedControl>,
    );

    expect(
      screen.getByRole("radio", { name: "List" }).getAttribute("aria-checked"),
    ).toBe("false");
    expect(screen.getByRole("radio", { name: "List" }).tabIndex).toBe(-1);
    expect(
      screen.getByRole("radio", { name: "Grid" }).getAttribute("aria-checked"),
    ).toBe("true");
    expect(screen.getByRole("radio", { name: "Grid" }).tabIndex).toBe(0);
    expect(
      screen.getByRole("radio", { name: "Board" }).getAttribute("aria-checked"),
    ).toBe("false");
    expect(screen.getByRole("radio", { name: "Board" }).tabIndex).toBe(-1);

    rerender(
      <SegmentedControl aria-label="Empty disabled" key="all-disabled">
        <SegmentedControl.Item value="a" disabled>
          A
        </SegmentedControl.Item>
        <SegmentedControl.Item value="b" disabled>
          B
        </SegmentedControl.Item>
      </SegmentedControl>,
    );

    for (const radio of screen.getAllByRole("radio")) {
      expect(radio.getAttribute("aria-checked")).toBe("false");
      expect(radio.tabIndex).toBe(-1);
    }
  });

  it("updates uncontrolled selection on click and avoids redundant change notifications", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <SegmentedControl
        aria-label="Density"
        defaultValue="comfortable"
        onValueChange={onValueChange}
      >
        <SegmentedControl.Item value="compact">Compact</SegmentedControl.Item>
        <SegmentedControl.Item value="comfortable">
          Comfortable
        </SegmentedControl.Item>
        <SegmentedControl.Item value="spacious" disabled>
          Spacious
        </SegmentedControl.Item>
      </SegmentedControl>,
    );

    const compact = screen.getByRole("radio", { name: "Compact" });
    const comfortable = screen.getByRole("radio", { name: "Comfortable" });
    const spacious = screen.getByRole("radio", { name: "Spacious" });

    await user.click(comfortable);
    expect(onValueChange).not.toHaveBeenCalled();

    await user.click(spacious);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(comfortable.getAttribute("aria-checked")).toBe("true");

    await user.click(compact);
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith("compact");
    expect(compact.getAttribute("aria-checked")).toBe("true");
    expect(compact.tabIndex).toBe(0);
    expect(comfortable.getAttribute("aria-checked")).toBe("false");
    expect(comfortable.tabIndex).toBe(-1);
  });

  it("supports controlled selection", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<ControlledSegmentedControl onValueChange={onValueChange} />);

    const day = screen.getByRole("radio", { name: "Day" });
    const week = screen.getByRole("radio", { name: "Week" });
    expect(day.getAttribute("aria-checked")).toBe("true");

    await user.click(week);
    expect(onValueChange).toHaveBeenCalledWith("week");
    expect(week.getAttribute("aria-checked")).toBe("true");
    expect(day.getAttribute("aria-checked")).toBe("false");
  });

  it("does not mutate selection in controlled mode when parent ignores onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <SegmentedControl
        aria-label="Range"
        value="day"
        onValueChange={onValueChange}
      >
        <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
        <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
      </SegmentedControl>,
    );

    await user.click(screen.getByRole("radio", { name: "Week" }));
    expect(onValueChange).toHaveBeenCalledWith("week");
    expect(
      screen.getByRole("radio", { name: "Day" }).getAttribute("aria-checked"),
    ).toBe("true");
    expect(
      screen.getByRole("radio", { name: "Week" }).getAttribute("aria-checked"),
    ).toBe("false");
  });

  it("navigates with ArrowRight, ArrowLeft, ArrowDown, ArrowUp, Home, and End with wrapping and disabled skipping", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <SegmentedControl
        aria-label="Billing"
        defaultValue="monthly"
        onValueChange={onValueChange}
      >
        <SegmentedControl.Item value="monthly">Monthly</SegmentedControl.Item>
        <SegmentedControl.Item value="quarterly" disabled>
          Quarterly
        </SegmentedControl.Item>
        <SegmentedControl.Item value="yearly">Yearly</SegmentedControl.Item>
        <SegmentedControl.Item value="lifetime">Lifetime</SegmentedControl.Item>
      </SegmentedControl>,
    );

    const monthly = screen.getByRole("radio", { name: "Monthly" });
    const yearly = screen.getByRole("radio", { name: "Yearly" });
    const lifetime = screen.getByRole("radio", { name: "Lifetime" });

    await user.tab();
    expect(document.activeElement).toBe(monthly);

    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(yearly);
    expect(yearly.getAttribute("aria-checked")).toBe("true");
    expect(onValueChange).toHaveBeenLastCalledWith("yearly");

    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(lifetime);
    expect(lifetime.getAttribute("aria-checked")).toBe("true");
    expect(onValueChange).toHaveBeenLastCalledWith("lifetime");

    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(monthly);
    expect(monthly.getAttribute("aria-checked")).toBe("true");
    expect(onValueChange).toHaveBeenLastCalledWith("monthly");

    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(lifetime);
    expect(lifetime.getAttribute("aria-checked")).toBe("true");
    expect(onValueChange).toHaveBeenLastCalledWith("lifetime");

    await user.keyboard("{ArrowUp}");
    expect(document.activeElement).toBe(yearly);
    expect(yearly.getAttribute("aria-checked")).toBe("true");
    expect(onValueChange).toHaveBeenLastCalledWith("yearly");

    await user.keyboard("{Home}");
    expect(document.activeElement).toBe(monthly);
    expect(monthly.getAttribute("aria-checked")).toBe("true");
    expect(onValueChange).toHaveBeenLastCalledWith("monthly");

    await user.keyboard("{End}");
    expect(document.activeElement).toBe(lifetime);
    expect(lifetime.getAttribute("aria-checked")).toBe("true");
    expect(onValueChange).toHaveBeenLastCalledWith("lifetime");
  });

  it("inverts ArrowLeft and ArrowRight in RTL direction", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <div dir="rtl">
        <SegmentedControl
          aria-label="Alignment"
          style={{ direction: "rtl" }}
          defaultValue="start"
          onValueChange={onValueChange}
        >
          <SegmentedControl.Item value="start">Start</SegmentedControl.Item>
          <SegmentedControl.Item value="center">Center</SegmentedControl.Item>
          <SegmentedControl.Item value="end">End</SegmentedControl.Item>
        </SegmentedControl>
      </div>,
    );

    const start = screen.getByRole("radio", { name: "Start" });
    const center = screen.getByRole("radio", { name: "Center" });
    const end = screen.getByRole("radio", { name: "End" });

    await user.tab();
    expect(document.activeElement).toBe(start);

    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(center);
    expect(center.getAttribute("aria-checked")).toBe("true");
    expect(onValueChange).toHaveBeenLastCalledWith("center");

    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(start);
    expect(start.getAttribute("aria-checked")).toBe("true");
    expect(onValueChange).toHaveBeenLastCalledWith("start");

    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(end);
    expect(end.getAttribute("aria-checked")).toBe("true");
    expect(onValueChange).toHaveBeenLastCalledWith("end");

    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(start);
    expect(start.getAttribute("aria-checked")).toBe("true");
  });

  it("assigns roving tabIndex to the first enabled item when the selected value is disabled", () => {
    render(
      <SegmentedControl aria-label="View" value="first">
        <SegmentedControl.Item value="first" disabled>
          First
        </SegmentedControl.Item>
        <SegmentedControl.Item value="second">Second</SegmentedControl.Item>
        <SegmentedControl.Item value="third">Third</SegmentedControl.Item>
      </SegmentedControl>,
    );

    expect(screen.getByRole("radio", { name: "First" }).tabIndex).toBe(-1);
    expect(screen.getByRole("radio", { name: "Second" }).tabIndex).toBe(0);
    expect(screen.getByRole("radio", { name: "Third" }).tabIndex).toBe(-1);
  });

  it("disables all items and blocks interaction when group disabled is true", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <SegmentedControl
        aria-label="Status"
        defaultValue="open"
        disabled
        onValueChange={onValueChange}
      >
        <SegmentedControl.Item value="open">Open</SegmentedControl.Item>
        <SegmentedControl.Item value="closed">Closed</SegmentedControl.Item>
      </SegmentedControl>,
    );

    const group = screen.getByRole("radiogroup", { name: "Status" });
    expect(group.hasAttribute("data-disabled")).toBe(true);
    expect(group.getAttribute("aria-disabled")).toBe("true");

    const open = screen.getByRole("radio", {
      name: "Open",
    }) as HTMLButtonElement;
    const closed = screen.getByRole("radio", {
      name: "Closed",
    }) as HTMLButtonElement;

    expect(open.disabled).toBe(true);
    expect(closed.disabled).toBe(true);
    expect(open.hasAttribute("data-disabled")).toBe(true);
    expect(closed.hasAttribute("data-disabled")).toBe(true);
    expect(open.tabIndex).toBe(-1);
    expect(closed.tabIndex).toBe(-1);

    await user.click(closed);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(open.getAttribute("aria-checked")).toBe("true");
  });

  it("supports dir=rtl attribute fallback, custom wrapper components, and consumer event handlers", async () => {
    const user = userEvent.setup();
    const onItemClick = vi.fn();

    render(
      <div dir="rtl">
        <SegmentedControl
          aria-label="Wrapped RTL"
          className="custom-root"
          data-testid="sc-root"
        >
          <WrappedSegmentItem
            value="first"
            label="First"
            onClick={onItemClick}
          />
          <WrappedSegmentItem
            value="second"
            label="Second"
            onClick={onItemClick}
          />
        </SegmentedControl>
      </div>,
    );

    const root = screen.getByTestId("sc-root");
    expect(root.className).toContain("custom-root");

    const first = screen.getByRole("radio", { name: "First" });
    const second = screen.getByRole("radio", { name: "Second" });
    expect(first.getAttribute("aria-checked")).toBe("true");
    expect(first.tabIndex).toBe(0);

    await user.tab();
    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(second);
    expect(second.getAttribute("aria-checked")).toBe("true");

    await user.click(first);
    expect(onItemClick).toHaveBeenCalledTimes(1);
    expect(first.getAttribute("aria-checked")).toBe("true");
  });

  it("throws if SegmentedControl.Item is rendered outside SegmentedControl", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      expect(() =>
        render(
          <SegmentedControl.Item value="orphan">Orphan</SegmentedControl.Item>,
        ),
      ).toThrow("SegmentedControl.Item must be used within SegmentedControl");
    } finally {
      errorSpy.mockRestore();
    }
  });

  it("applies size and fullWidth data attributes", () => {
    const { rerender } = render(
      <SegmentedControl aria-label="Scale" size="small" fullWidth>
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
      </SegmentedControl>,
    );

    const group = screen.getByRole("radiogroup", { name: "Scale" });
    expect(group.getAttribute("data-size")).toBe("small");
    expect(group.hasAttribute("data-full-width")).toBe(true);

    rerender(
      <SegmentedControl aria-label="Scale" size="large" fullWidth={false}>
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
      </SegmentedControl>,
    );

    expect(group.getAttribute("data-size")).toBe("large");
    expect(group.hasAttribute("data-full-width")).toBe(false);
  });

  it("renders optional leading icon and guards falsy values while preserving 0", () => {
    render(
      <SegmentedControl aria-label="Icons" defaultValue="svg">
        <SegmentedControl.Item
          value="svg"
          icon={<svg data-testid="icon-svg" aria-hidden="true" />}
        >
          SVG
        </SegmentedControl.Item>
        <SegmentedControl.Item value="zero" icon={0}>
          Zero
        </SegmentedControl.Item>
        <SegmentedControl.Item value="empty" icon="">
          Empty
        </SegmentedControl.Item>
        <SegmentedControl.Item value="false" icon={false}>
          False
        </SegmentedControl.Item>
        <SegmentedControl.Item value="true" icon={true}>
          True
        </SegmentedControl.Item>
        <SegmentedControl.Item value="null" icon={null}>
          Null
        </SegmentedControl.Item>
      </SegmentedControl>,
    );

    const svgItem = screen.getByRole("radio", { name: "SVG" });
    expect(
      svgItem.querySelector('[data-slot="segmented-control-item-icon"]'),
    ).toBeTruthy();
    expect(screen.getByTestId("icon-svg")).toBeTruthy();

    const zeroItem = screen.getByRole("radio", { name: "Zero" });
    const zeroIcon = zeroItem.querySelector(
      '[data-slot="segmented-control-item-icon"]',
    );
    expect(zeroIcon).toBeTruthy();
    expect(zeroIcon?.textContent).toBe("0");

    for (const label of ["Empty", "False", "True", "Null"]) {
      const item = screen.getByRole("radio", { name: label });
      expect(
        item.querySelector('[data-slot="segmented-control-item-icon"]'),
      ).toBeNull();
    }
  });

  it("forwards object refs and preserves React 19 callback-ref cleanup on root and items", () => {
    const rootRef = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLButtonElement>();
    const rootCleanup = vi.fn();
    const itemCleanup = vi.fn();
    let mountedRoot: HTMLDivElement | null = null;
    let mountedItem: HTMLButtonElement | null = null;

    const { unmount } = render(
      <SegmentedControl aria-label="Refs" ref={rootRef} defaultValue="a">
        <SegmentedControl.Item value="a" ref={itemRef}>
          A
        </SegmentedControl.Item>
      </SegmentedControl>,
    );

    expect(rootRef.current).toBe(
      screen.getByRole("radiogroup", { name: "Refs" }),
    );
    expect(itemRef.current).toBe(screen.getByRole("radio", { name: "A" }));
    unmount();
    expect(rootRef.current).toBeNull();
    expect(itemRef.current).toBeNull();

    const { unmount: unmountCallback } = render(
      <SegmentedControl
        aria-label="Callback refs"
        ref={(node) => {
          mountedRoot = node;
          return rootCleanup;
        }}
        defaultValue="b"
      >
        <SegmentedControl.Item
          value="b"
          ref={(node) => {
            mountedItem = node;
            return itemCleanup;
          }}
        >
          B
        </SegmentedControl.Item>
      </SegmentedControl>,
    );

    expect(mountedRoot).toBe(
      screen.getByRole("radiogroup", { name: "Callback refs" }),
    );
    expect(mountedItem).toBe(screen.getByRole("radio", { name: "B" }));
    expect(rootCleanup).not.toHaveBeenCalled();
    expect(itemCleanup).not.toHaveBeenCalled();

    unmountCallback();
    expect(rootCleanup).toHaveBeenCalledTimes(1);
    expect(itemCleanup).toHaveBeenCalledTimes(1);
  });

  it("handles mixed direct and wrapped items for default selection and roving tabIndex", async () => {
    const user = userEvent.setup();

    render(
      <SegmentedControl aria-label="Mixed items">
        <WrappedSegmentItem value="wrapped-first" label="Wrapped First" />
        <SegmentedControl.Item value="direct-second">
          Direct Second
        </SegmentedControl.Item>
        <WrappedSegmentItem value="wrapped-third" label="Wrapped Third" />
      </SegmentedControl>,
    );

    const wrappedFirst = screen.getByRole("radio", { name: "Wrapped First" });
    const directSecond = screen.getByRole("radio", { name: "Direct Second" });
    const wrappedThird = screen.getByRole("radio", { name: "Wrapped Third" });

    expect(wrappedFirst.getAttribute("aria-checked")).toBe("true");
    expect(wrappedFirst.tabIndex).toBe(0);
    expect(directSecond.getAttribute("aria-checked")).toBe("false");
    expect(directSecond.tabIndex).toBe(-1);
    expect(wrappedThird.getAttribute("aria-checked")).toBe("false");
    expect(wrappedThird.tabIndex).toBe(-1);

    await user.tab();
    expect(document.activeElement).toBe(wrappedFirst);

    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(directSecond);
    expect(directSecond.getAttribute("aria-checked")).toBe("true");
    expect(directSecond.tabIndex).toBe(0);
    expect(wrappedFirst.tabIndex).toBe(-1);

    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(wrappedThird);
    expect(wrappedThird.getAttribute("aria-checked")).toBe("true");
    expect(wrappedThird.tabIndex).toBe(0);
    expect(directSecond.tabIndex).toBe(-1);
  });

  it("updates roving tabIndex when a wrapper dynamically removes or disables the selected item", async () => {
    const user = userEvent.setup();

    const { unmount } = render(
      <SegmentedControl aria-label="Dynamic remove" defaultValue="first">
        <DynamicWrappedSegmentItems mode="remove" />
      </SegmentedControl>,
    );

    expect(screen.getByRole("radio", { name: "First" }).tabIndex).toBe(0);
    expect(screen.getByRole("radio", { name: "Second" }).tabIndex).toBe(-1);

    await user.click(screen.getByRole("button", { name: "Mutate wrapper" }));

    expect(screen.queryByRole("radio", { name: "First" })).toBeNull();
    expect(screen.getByRole("radio", { name: "Second" }).tabIndex).toBe(0);
    expect(screen.getByRole("radio", { name: "Third" }).tabIndex).toBe(-1);

    unmount();

    render(
      <SegmentedControl aria-label="Dynamic disable" defaultValue="first">
        <DynamicWrappedSegmentItems mode="disable" />
      </SegmentedControl>,
    );

    expect(screen.getByRole("radio", { name: "First" }).tabIndex).toBe(0);
    expect(screen.getByRole("radio", { name: "Second" }).tabIndex).toBe(-1);

    await user.click(screen.getByRole("button", { name: "Mutate wrapper" }));

    expect(screen.getByRole("radio", { name: "First" }).tabIndex).toBe(-1);
    expect(screen.getByRole("radio", { name: "Second" }).tabIndex).toBe(0);
    expect(screen.getByRole("radio", { name: "Third" }).tabIndex).toBe(-1);
  });

  it("assigns roving tabIndex to the first enabled item when controlled value matches no item", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <SegmentedControl
        aria-label="Unmatched controlled"
        value="missing"
        onValueChange={onValueChange}
      >
        <SegmentedControl.Item value="disabled-first" disabled>
          Disabled First
        </SegmentedControl.Item>
        <SegmentedControl.Item value="alpha">Alpha</SegmentedControl.Item>
        <SegmentedControl.Item value="beta">Beta</SegmentedControl.Item>
      </SegmentedControl>,
    );

    const disabledFirst = screen.getByRole("radio", { name: "Disabled First" });
    const alpha = screen.getByRole("radio", { name: "Alpha" });
    const beta = screen.getByRole("radio", { name: "Beta" });

    expect(disabledFirst.getAttribute("aria-checked")).toBe("false");
    expect(disabledFirst.tabIndex).toBe(-1);
    expect(alpha.getAttribute("aria-checked")).toBe("false");
    expect(alpha.tabIndex).toBe(0);
    expect(beta.getAttribute("aria-checked")).toBe("false");
    expect(beta.tabIndex).toBe(-1);

    await user.tab();
    expect(document.activeElement).toBe(alpha);
    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(beta);
    expect(onValueChange).toHaveBeenCalledWith("beta");
  });

  it("preserves explicit aria-disabled on root when disabled prop is not set", () => {
    render(
      <SegmentedControl
        aria-label="Explicit aria-disabled"
        aria-disabled="true"
      >
        <SegmentedControl.Item value="a">A</SegmentedControl.Item>
        <SegmentedControl.Item value="b">B</SegmentedControl.Item>
      </SegmentedControl>,
    );

    const group = screen.getByRole("radiogroup", {
      name: "Explicit aria-disabled",
    });
    expect(group.getAttribute("aria-disabled")).toBe("true");
    expect(group.hasAttribute("data-disabled")).toBe(false);
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <div>
        <SegmentedControl aria-label="View mode" defaultValue="list">
          <SegmentedControl.Item value="list" icon={<svg aria-hidden="true" />}>
            List
          </SegmentedControl.Item>
          <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
          <SegmentedControl.Item value="board" disabled>
            Board
          </SegmentedControl.Item>
        </SegmentedControl>
        <SegmentedControl aria-label="Disabled group" disabled defaultValue="a">
          <SegmentedControl.Item value="a">A</SegmentedControl.Item>
          <SegmentedControl.Item value="b">B</SegmentedControl.Item>
        </SegmentedControl>
      </div>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
