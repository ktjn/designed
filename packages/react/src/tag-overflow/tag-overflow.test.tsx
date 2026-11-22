import { act, render, screen } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { TagOverflow } from "./tag-overflow";

const items = [
  { id: "1", label: "Alpha" },
  { id: "2", label: "Bravo" },
  { id: "3", label: "Charlie" },
];

function setupLayoutMocks(options: {
  getContainerWidth: () => number;
  getItemWidth?: (el: HTMLElement) => number;
  probeWidth?: number;
  columnGap?: string;
  paddingLeft?: string;
  paddingRight?: string;
}) {
  let resizeCallback: ResizeObserverCallback | null = null;

  class MockResizeObserver {
    constructor(callback: ResizeObserverCallback) {
      resizeCallback = callback;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  vi.stubGlobal("ResizeObserver", MockResizeObserver);

  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(
    function (this: HTMLElement) {
      return this.dataset.slot === "tag-overflow"
        ? options.getContainerWidth()
        : 0;
    },
  );

  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    function (this: HTMLElement) {
      let width = 0;
      if (this.dataset.slot === "tag-overflow-item") {
        width = options.getItemWidth ? options.getItemWidth(this) : 50;
      } else if (this.getAttribute("aria-hidden") === "true") {
        width = options.probeWidth ?? 30;
      }
      return {
        width,
        height: 24,
        top: 0,
        left: 0,
        bottom: 24,
        right: width,
        x: 0,
        y: 0,
        toJSON: () => {},
      };
    },
  );

  const originalGetComputedStyle = window.getComputedStyle;
  vi.spyOn(window, "getComputedStyle").mockImplementation((el) => {
    const style = originalGetComputedStyle(el);
    if (el instanceof HTMLElement && el.dataset.slot === "tag-overflow") {
      return {
        ...style,
        columnGap: options.columnGap ?? "8px",
        paddingLeft: options.paddingLeft ?? "0px",
        paddingRight: options.paddingRight ?? "0px",
      } as CSSStyleDeclaration;
    }
    return style;
  });

  return {
    triggerResize: () => {
      act(() => {
        resizeCallback?.([], {} as ResizeObserver);
      });
    },
  };
}

describe("TagOverflow", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("renders every item when nothing overflows", () => {
    render(<TagOverflow items={items} />);
    expect(screen.getByText("Alpha")).toBeTruthy();
    expect(screen.getByText("Bravo")).toBeTruthy();
    expect(screen.getByText("Charlie")).toBeTruthy();
    expect(screen.queryByText("+1")).toBeNull();
  });

  it("renders cleanly with an empty items array", () => {
    const { container } = render(<TagOverflow items={[]} />);
    expect(container.querySelector('[data-slot="tag-overflow"]')).toBeTruthy();
    expect(
      container.querySelector('[data-slot="tag-overflow-item"]'),
    ).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("collapses items beyond the explicit max into an overflow trigger", () => {
    render(<TagOverflow items={items} max={2} />);
    expect(screen.getByText("Alpha")).toBeTruthy();
    expect(screen.getByText("Bravo")).toBeTruthy();
    expect(screen.queryByText("Charlie")).toBeNull();
    expect(screen.getByText("+1")).toBeTruthy();
  });

  it("supports max={0} and negative max by collapsing all items into the overflow trigger", () => {
    const { rerender } = render(<TagOverflow items={items} max={0} />);
    expect(screen.queryByText("Alpha")).toBeNull();
    expect(screen.getByRole("button", { name: "+3" })).toBeTruthy();

    rerender(<TagOverflow items={items} max={-5} />);
    expect(screen.queryByText("Alpha")).toBeNull();
    expect(screen.getByRole("button", { name: "+3" })).toBeTruthy();
  });

  it("supports custom overflowLabel, overflowAriaLabel, and renderItem", () => {
    const overflowAriaLabel = vi.fn((count: number) => `Show ${count} hidden`);
    render(
      <TagOverflow
        items={items}
        max={1}
        overflowLabel={(count) => `${count} more`}
        overflowAriaLabel={overflowAriaLabel}
        renderItem={(item) => <strong>{item.label}</strong>}
      />,
    );
    expect(screen.getByText("2 more")).toBeTruthy();
    expect(screen.getByText("Alpha").tagName).toBe("STRONG");
    expect(overflowAriaLabel).toHaveBeenCalledWith(2);
  });

  it("forwards ref and className to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<TagOverflow ref={ref} className="custom-tags" items={items} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.className).toContain("custom-tags");
  });

  it("measures item widths once without duplicate DOM nodes and responds to resize", () => {
    let containerWidth = 150;
    const { triggerResize } = setupLayoutMocks({
      getContainerWidth: () => containerWidth,
    });

    const { container } = render(<TagOverflow items={items} />);

    expect(screen.getAllByText("Alpha")).toHaveLength(1);
    expect(screen.getAllByText("Bravo")).toHaveLength(1);
    expect(screen.queryByText("Charlie")).toBeNull();
    expect(screen.getByRole("button", { name: "+1" })).toBeTruthy();
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();

    containerWidth = 200;
    triggerResize();
    expect(screen.getAllByText("Alpha")).toHaveLength(1);
    expect(screen.getAllByText("Bravo")).toHaveLength(1);
    expect(screen.getAllByText("Charlie")).toHaveLength(1);
    expect(screen.queryByRole("button")).toBeNull();

    containerWidth = 100;
    triggerResize();
    expect(screen.getAllByText("Alpha")).toHaveLength(1);
    expect(screen.queryByText("Bravo")).toBeNull();
    expect(screen.getByRole("button", { name: "+2" })).toBeTruthy();
  });

  it("collapses to 0 visible items when even the first item plus trigger exceeds content-box width", () => {
    setupLayoutMocks({
      getContainerWidth: () => 120,
      getItemWidth: () => 90,
      probeWidth: 30,
      paddingLeft: "10px",
      paddingRight: "10px",
    });

    render(<TagOverflow items={items} />);
    expect(screen.queryByText("Alpha")).toBeNull();
    expect(screen.queryByText("Bravo")).toBeNull();
    expect(screen.queryByText("Charlie")).toBeNull();
    expect(screen.getByRole("button", { name: "+3" })).toBeTruthy();
  });

  it("remeasures when items update after initial measurement", () => {
    setupLayoutMocks({
      getContainerWidth: () => 150,
      getItemWidth: (el) => (el.textContent === "Extra Long Label" ? 120 : 50),
    });

    const { rerender } = render(<TagOverflow items={items} />);
    expect(screen.getByText("Alpha")).toBeTruthy();
    expect(screen.getByText("Bravo")).toBeTruthy();
    expect(screen.getByRole("button", { name: "+1" })).toBeTruthy();

    rerender(
      <TagOverflow
        items={[
          { id: "1", label: "Extra Long Label" },
          { id: "2", label: "Bravo" },
          { id: "3", label: "Charlie" },
        ]}
      />,
    );
    expect(screen.queryByText("Extra Long Label")).toBeNull();
    expect(screen.getByRole("button", { name: "+3" })).toBeTruthy();
  });

  it("measures after container transitions from 0 width to non-zero width", () => {
    let containerWidth = 0;
    const { triggerResize } = setupLayoutMocks({
      getContainerWidth: () => containerWidth,
    });

    render(<TagOverflow items={items} />);
    expect(screen.getByText("Alpha")).toBeTruthy();
    expect(screen.getByText("Bravo")).toBeTruthy();
    expect(screen.getByText("Charlie")).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();

    containerWidth = 100;
    triggerResize();
    expect(screen.getByText("Alpha")).toBeTruthy();
    expect(screen.queryByText("Bravo")).toBeNull();
    expect(screen.getByRole("button", { name: "+2" })).toBeTruthy();
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(<TagOverflow items={items} max={1} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
