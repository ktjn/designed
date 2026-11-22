import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, StrictMode } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Resizable } from "./resizable";

describe("Resizable", () => {
  it("renders horizontal panels and separator with default 50/50 split", () => {
    const { container } = render(
      <Resizable>
        <Resizable.Panel>Left</Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel>Right</Resizable.Panel>
      </Resizable>,
    );

    const root = container.querySelector('[data-slot="resizable"]');
    const panels = container.querySelectorAll<HTMLElement>(
      '[data-slot="resizable-panel"]',
    );
    const separator = screen.getByRole("separator", { name: "Resize panel" });

    expect(root?.getAttribute("data-orientation")).toBe("horizontal");
    expect(panels).toHaveLength(2);
    expect(panels[0]?.style.flexBasis).toBe("50%");
    expect(panels[1]?.style.flexBasis).toBe("50%");
    expect(separator.getAttribute("data-orientation")).toBe("horizontal");
    expect(separator.getAttribute("aria-orientation")).toBe("vertical");
    expect(separator.getAttribute("aria-valuenow")).toBe("50");
    expect(separator.getAttribute("aria-valuemin")).toBe("10");
    expect(separator.getAttribute("aria-valuemax")).toBe("90");
    expect(separator.getAttribute("tabindex")).toBe("0");
  });

  it("renders vertical orientation with horizontal aria-orientation", () => {
    const { container } = render(
      <Resizable orientation="vertical">
        <Resizable.Panel defaultSize={30}>Top</Resizable.Panel>
        <Resizable.Handle withHandle aria-label="Resize rows" />
        <Resizable.Panel defaultSize={70}>Bottom</Resizable.Panel>
      </Resizable>,
    );

    const root = container.querySelector('[data-slot="resizable"]');
    const panels = container.querySelectorAll<HTMLElement>(
      '[data-slot="resizable-panel"]',
    );
    const separator = screen.getByRole("separator", { name: "Resize rows" });

    expect(root?.getAttribute("data-orientation")).toBe("vertical");
    expect(panels[0]?.style.flexBasis).toBe("30%");
    expect(panels[1]?.style.flexBasis).toBe("70%");
    expect(separator.getAttribute("data-orientation")).toBe("vertical");
    expect(separator.getAttribute("aria-orientation")).toBe("horizontal");
    expect(separator.querySelector("svg")).toBeTruthy();
  });

  it("distributes remaining space evenly and normalizes totals to 100", () => {
    const { container: partialContainer } = render(
      <Resizable>
        <Resizable.Panel defaultSize={20}>A</Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel>B</Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel>C</Resizable.Panel>
      </Resizable>,
    );

    const partialPanels = partialContainer.querySelectorAll<HTMLElement>(
      '[data-slot="resizable-panel"]',
    );
    expect(partialPanels[0]?.style.flexBasis).toBe("20%");
    expect(partialPanels[1]?.style.flexBasis).toBe("40%");
    expect(partialPanels[2]?.style.flexBasis).toBe("40%");

    const { container: normalizedContainer } = render(
      <Resizable>
        <Resizable.Panel defaultSize={60}>X</Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel defaultSize={60}>Y</Resizable.Panel>
      </Resizable>,
    );

    const normalizedPanels = normalizedContainer.querySelectorAll<HTMLElement>(
      '[data-slot="resizable-panel"]',
    );
    expect(normalizedPanels[0]?.style.flexBasis).toBe("50%");
    expect(normalizedPanels[1]?.style.flexBasis).toBe("50%");
  });

  it("resizes horizontally with ArrowRight, ArrowLeft, and Shift+Arrow", async () => {
    const user = userEvent.setup();
    const onLayout = vi.fn();

    render(
      <Resizable onLayout={onLayout}>
        <Resizable.Panel defaultSize={50}>Left</Resizable.Panel>
        <Resizable.Handle step={5} />
        <Resizable.Panel defaultSize={50}>Right</Resizable.Panel>
      </Resizable>,
    );

    const separator = screen.getByRole("separator");
    separator.focus();

    await user.keyboard("{ArrowRight}");
    expect(separator.getAttribute("aria-valuenow")).toBe("55");
    expect(onLayout).toHaveBeenLastCalledWith([55, 45]);

    await user.keyboard("{ArrowLeft}");
    expect(separator.getAttribute("aria-valuenow")).toBe("50");
    expect(onLayout).toHaveBeenLastCalledWith([50, 50]);

    await user.keyboard("{Shift>}{ArrowRight}{/Shift}");
    expect(separator.getAttribute("aria-valuenow")).toBe("60");
    expect(onLayout).toHaveBeenLastCalledWith([60, 40]);

    await user.keyboard("{Shift>}{ArrowLeft}{/Shift}");
    expect(separator.getAttribute("aria-valuenow")).toBe("50");
    expect(onLayout).toHaveBeenLastCalledWith([50, 50]);
  });

  it("resizes vertically with ArrowDown, ArrowUp, and Shift+Arrow", async () => {
    const user = userEvent.setup();
    const onLayout = vi.fn();

    render(
      <Resizable orientation="vertical" onLayout={onLayout}>
        <Resizable.Panel defaultSize={40}>Top</Resizable.Panel>
        <Resizable.Handle step={5} />
        <Resizable.Panel defaultSize={60}>Bottom</Resizable.Panel>
      </Resizable>,
    );

    const separator = screen.getByRole("separator");
    separator.focus();

    await user.keyboard("{ArrowDown}");
    expect(separator.getAttribute("aria-valuenow")).toBe("45");
    expect(onLayout).toHaveBeenLastCalledWith([45, 55]);

    await user.keyboard("{ArrowUp}");
    expect(separator.getAttribute("aria-valuenow")).toBe("40");
    expect(onLayout).toHaveBeenLastCalledWith([40, 60]);

    await user.keyboard("{Shift>}{ArrowDown}{/Shift}");
    expect(separator.getAttribute("aria-valuenow")).toBe("50");
    expect(onLayout).toHaveBeenLastCalledWith([50, 50]);
  });

  it("inverts horizontal keyboard resizing in RTL direction", async () => {
    const user = userEvent.setup();
    const onLayout = vi.fn();

    render(
      <div dir="rtl">
        <Resizable style={{ direction: "rtl" }} onLayout={onLayout}>
          <Resizable.Panel defaultSize={50}>Start</Resizable.Panel>
          <Resizable.Handle step={5} />
          <Resizable.Panel defaultSize={50}>End</Resizable.Panel>
        </Resizable>
      </div>,
    );

    const separator = screen.getByRole("separator");
    separator.focus();

    await user.keyboard("{ArrowLeft}");
    expect(separator.getAttribute("aria-valuenow")).toBe("55");
    expect(onLayout).toHaveBeenLastCalledWith([55, 45]);

    await user.keyboard("{ArrowRight}");
    expect(separator.getAttribute("aria-valuenow")).toBe("50");
    expect(onLayout).toHaveBeenLastCalledWith([50, 50]);
  });

  it("clamps resizing to minSize and maxSize and supports Home and End", async () => {
    const user = userEvent.setup();
    const onLayout = vi.fn();

    render(
      <Resizable onLayout={onLayout}>
        <Resizable.Panel defaultSize={50} minSize={20} maxSize={70}>
          Left
        </Resizable.Panel>
        <Resizable.Handle step={25} />
        <Resizable.Panel defaultSize={50} minSize={25} maxSize={85}>
          Right
        </Resizable.Panel>
      </Resizable>,
    );

    const separator = screen.getByRole("separator");
    expect(separator.getAttribute("aria-valuemin")).toBe("20");
    expect(separator.getAttribute("aria-valuemax")).toBe("70");

    separator.focus();

    await user.keyboard("{End}");
    expect(separator.getAttribute("aria-valuenow")).toBe("70");
    expect(onLayout).toHaveBeenLastCalledWith([70, 30]);

    await user.keyboard("{Home}");
    expect(separator.getAttribute("aria-valuenow")).toBe("20");
    expect(onLayout).toHaveBeenLastCalledWith([20, 80]);

    const callsBefore = onLayout.mock.calls.length;
    await user.keyboard("{ArrowLeft}");
    expect(separator.getAttribute("aria-valuenow")).toBe("20");
    expect(onLayout.mock.calls.length).toBe(callsBefore);
  });

  it("collapses and expands a collapsible previous panel via Enter and Home and calls onCollapse", async () => {
    const user = userEvent.setup();
    const onCollapse = vi.fn();
    const onLayout = vi.fn();

    const { container } = render(
      <Resizable onLayout={onLayout}>
        <Resizable.Panel
          defaultSize={35}
          minSize={15}
          collapsible
          collapsedSize={0}
          onCollapse={onCollapse}
        >
          Sidebar
        </Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel defaultSize={65}>Main</Resizable.Panel>
      </Resizable>,
    );

    const panels = container.querySelectorAll<HTMLElement>(
      '[data-slot="resizable-panel"]',
    );
    const separator = screen.getByRole("separator");
    separator.focus();

    await user.keyboard("{Enter}");
    expect(separator.getAttribute("aria-valuenow")).toBe("0");
    expect(panels[0]?.hasAttribute("data-collapsed")).toBe(true);
    expect(onCollapse).toHaveBeenLastCalledWith(true);
    expect(onLayout).toHaveBeenLastCalledWith([0, 100]);

    await user.keyboard("{Enter}");
    expect(separator.getAttribute("aria-valuenow")).toBe("35");
    expect(panels[0]?.hasAttribute("data-collapsed")).toBe(false);
    expect(onCollapse).toHaveBeenLastCalledWith(false);
    expect(onLayout).toHaveBeenLastCalledWith([35, 65]);

    await user.keyboard("{Home}");
    expect(separator.getAttribute("aria-valuenow")).toBe("0");
    expect(panels[0]?.hasAttribute("data-collapsed")).toBe(true);
    expect(onCollapse).toHaveBeenLastCalledWith(true);
  });

  it("toggles collapse on the next panel via Enter when only the next panel is collapsible", async () => {
    const user = userEvent.setup();
    const onCollapse = vi.fn();

    const { container } = render(
      <Resizable>
        <Resizable.Panel defaultSize={70}>Main</Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel
          defaultSize={30}
          minSize={15}
          collapsible
          collapsedSize={0}
          onCollapse={onCollapse}
        >
          Inspector
        </Resizable.Panel>
      </Resizable>,
    );

    const panels = container.querySelectorAll<HTMLElement>(
      '[data-slot="resizable-panel"]',
    );
    const separator = screen.getByRole("separator");
    separator.focus();

    await user.keyboard("{Enter}");
    expect(panels[1]?.style.flexBasis).toBe("0%");
    expect(panels[1]?.hasAttribute("data-collapsed")).toBe(true);
    expect(onCollapse).toHaveBeenLastCalledWith(true);

    await user.keyboard("{Enter}");
    expect(panels[1]?.style.flexBasis).toBe("30%");
    expect(panels[1]?.hasAttribute("data-collapsed")).toBe(false);
    expect(onCollapse).toHaveBeenLastCalledWith(false);
  });

  it("disables interaction when handle is disabled", async () => {
    const user = userEvent.setup();
    const onLayout = vi.fn();

    render(
      <Resizable onLayout={onLayout}>
        <Resizable.Panel defaultSize={50}>Left</Resizable.Panel>
        <Resizable.Handle disabled />
        <Resizable.Panel defaultSize={50}>Right</Resizable.Panel>
      </Resizable>,
    );

    const separator = screen.getByRole("separator");
    expect(separator.hasAttribute("data-disabled")).toBe(true);
    expect(separator.getAttribute("aria-disabled")).toBe("true");
    expect(separator.hasAttribute("tabindex")).toBe(false);

    fireEvent.keyDown(separator, { key: "ArrowRight" });
    fireEvent.pointerDown(separator, { pointerId: 1, clientX: 500 });
    fireEvent.pointerMove(separator, { pointerId: 1, clientX: 600 });
    fireEvent.pointerUp(separator, { pointerId: 1, clientX: 600 });

    await user.click(separator);
    expect(separator.getAttribute("aria-valuenow")).toBe("50");
    expect(onLayout).not.toHaveBeenCalled();
  });

  it("supports pointer dragging with clamping, collapse snap, and RTL inversion", () => {
    const onLayout = vi.fn();
    const onCollapse = vi.fn();

    const { container } = render(
      <Resizable onLayout={onLayout}>
        <Resizable.Panel
          defaultSize={50}
          minSize={20}
          collapsible
          collapsedSize={0}
          onCollapse={onCollapse}
        >
          Left
        </Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel defaultSize={50} minSize={10}>
          Right
        </Resizable.Panel>
      </Resizable>,
    );

    const root = container.querySelector<HTMLElement>(
      '[data-slot="resizable"]',
    );
    if (!root) {
      throw new Error("Expected resizable root");
    }
    vi.spyOn(root, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 1000,
      bottom: 400,
      width: 1000,
      height: 400,
      toJSON: () => ({}),
    });

    const separator = screen.getByRole("separator");

    fireEvent.pointerDown(separator, { pointerId: 1, clientX: 500, button: 0 });
    expect(separator.hasAttribute("data-dragging")).toBe(true);

    fireEvent.pointerMove(separator, { pointerId: 1, clientX: 650 });
    expect(separator.getAttribute("aria-valuenow")).toBe("65");
    expect(onLayout).toHaveBeenLastCalledWith([65, 35]);

    fireEvent.pointerMove(separator, { pointerId: 1, clientX: 50 });
    expect(separator.getAttribute("aria-valuenow")).toBe("0");
    expect(onCollapse).toHaveBeenLastCalledWith(true);
    expect(onLayout).toHaveBeenLastCalledWith([0, 100]);

    fireEvent.pointerUp(separator, { pointerId: 1, clientX: 50 });
    expect(separator.hasAttribute("data-dragging")).toBe(false);
  });

  it("inverts horizontal pointer drag in RTL and supports vertical drag and pointerCancel", () => {
    const onRtlLayout = vi.fn();
    const { container: rtlContainer } = render(
      <Resizable style={{ direction: "rtl" }} onLayout={onRtlLayout}>
        <Resizable.Panel defaultSize={50}>Start</Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel defaultSize={50}>End</Resizable.Panel>
      </Resizable>,
    );

    const rtlRoot = rtlContainer.querySelector<HTMLElement>(
      '[data-slot="resizable"]',
    );
    if (!rtlRoot) {
      throw new Error("Expected RTL resizable root");
    }
    vi.spyOn(rtlRoot, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 1000,
      bottom: 400,
      width: 1000,
      height: 400,
      toJSON: () => ({}),
    });

    const rtlSeparator = screen.getByRole("separator");
    fireEvent.pointerDown(rtlSeparator, {
      pointerId: 1,
      clientX: 500,
      button: 0,
    });
    fireEvent.pointerMove(rtlSeparator, { pointerId: 1, clientX: 400 });
    expect(rtlSeparator.getAttribute("aria-valuenow")).toBe("60");
    expect(onRtlLayout).toHaveBeenLastCalledWith([60, 40]);
    fireEvent.pointerCancel(rtlSeparator, { pointerId: 1, clientX: 400 });
    expect(rtlSeparator.hasAttribute("data-dragging")).toBe(false);

    const onVerticalLayout = vi.fn();
    const { container: verticalContainer } = render(
      <Resizable orientation="vertical" onLayout={onVerticalLayout}>
        <Resizable.Panel defaultSize={50}>Top</Resizable.Panel>
        <Resizable.Handle aria-label="Resize vertically" />
        <Resizable.Panel defaultSize={50}>Bottom</Resizable.Panel>
      </Resizable>,
    );

    const verticalRoot = verticalContainer.querySelector<HTMLElement>(
      '[data-slot="resizable"]',
    );
    if (!verticalRoot) {
      throw new Error("Expected vertical resizable root");
    }
    vi.spyOn(verticalRoot, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      left: 0,
      right: 600,
      bottom: 500,
      width: 600,
      height: 500,
      toJSON: () => ({}),
    });

    const verticalSeparator = screen.getByRole("separator", {
      name: "Resize vertically",
    });
    fireEvent.pointerDown(verticalSeparator, {
      pointerId: 2,
      clientY: 250,
      button: 0,
    });
    fireEvent.pointerMove(verticalSeparator, { pointerId: 2, clientY: 350 });
    expect(verticalSeparator.getAttribute("aria-valuenow")).toBe("70");
    expect(onVerticalLayout).toHaveBeenLastCalledWith([70, 30]);
    fireEvent.pointerUp(verticalSeparator, { pointerId: 2, clientY: 350 });
    expect(verticalSeparator.hasAttribute("data-dragging")).toBe(false);
  });

  it("renders initial sizes without flicker and fires callbacks once under StrictMode", async () => {
    const user = userEvent.setup();
    const onLayout = vi.fn();
    const onCollapse = vi.fn();

    const { container } = render(
      <StrictMode>
        <Resizable onLayout={onLayout}>
          <Resizable.Panel defaultSize={30} collapsible onCollapse={onCollapse}>
            Nav
          </Resizable.Panel>
          <Resizable.Handle />
          <Resizable.Panel>Main</Resizable.Panel>
        </Resizable>
      </StrictMode>,
    );

    const panels = container.querySelectorAll<HTMLElement>(
      '[data-slot="resizable-panel"]',
    );
    expect(panels[0]?.style.flexBasis).toBe("30%");
    expect(panels[1]?.style.flexBasis).toBe("70%");

    const separator = screen.getByRole("separator");
    separator.focus();
    await user.keyboard("{Enter}");
    expect(onLayout).toHaveBeenCalledTimes(1);
    expect(onCollapse).toHaveBeenCalledTimes(1);
    expect(onCollapse).toHaveBeenCalledWith(true);
  });

  it("forwards object refs and preserves React 19 callback ref cleanup", () => {
    const cleanup = vi.fn();
    const rootCallbackRef = vi.fn((_node: HTMLDivElement | null) => cleanup);
    const panelRef = createRef<HTMLDivElement>();
    const handleRef = createRef<HTMLDivElement>();

    const { unmount } = render(
      <Resizable ref={rootCallbackRef}>
        <Resizable.Panel ref={panelRef}>Left</Resizable.Panel>
        <Resizable.Handle ref={handleRef} />
        <Resizable.Panel>Right</Resizable.Panel>
      </Resizable>,
    );

    expect(rootCallbackRef).toHaveBeenCalledTimes(1);
    expect(rootCallbackRef.mock.calls[0]?.[0]).toBeInstanceOf(HTMLDivElement);
    expect(panelRef.current).toBeInstanceOf(HTMLDivElement);
    expect(handleRef.current).toBeInstanceOf(HTMLDivElement);

    unmount();
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <Resizable>
        <Resizable.Panel defaultSize={30} collapsible>
          Navigation
        </Resizable.Panel>
        <Resizable.Handle withHandle aria-label="Resize navigation" />
        <Resizable.Panel defaultSize={40}>Content</Resizable.Panel>
        <Resizable.Handle disabled aria-label="Locked divider" />
        <Resizable.Panel defaultSize={30}>Details</Resizable.Panel>
      </Resizable>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  it("collapses a collapsible next panel on End and does not re-expand it on repeated End", async () => {
    const user = userEvent.setup();
    const onCollapse = vi.fn();
    const onLayout = vi.fn();

    const { container } = render(
      <Resizable onLayout={onLayout}>
        <Resizable.Panel defaultSize={70} maxSize={100}>
          Main
        </Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel
          defaultSize={30}
          minSize={15}
          collapsible
          collapsedSize={0}
          onCollapse={onCollapse}
        >
          Inspector
        </Resizable.Panel>
      </Resizable>,
    );

    const panels = container.querySelectorAll<HTMLElement>(
      '[data-slot="resizable-panel"]',
    );
    const separator = screen.getByRole("separator");
    separator.focus();

    await user.keyboard("{End}");
    expect(panels[0]?.style.flexBasis).toBe("100%");
    expect(panels[1]?.style.flexBasis).toBe("0%");
    expect(panels[1]?.hasAttribute("data-collapsed")).toBe(true);
    expect(onCollapse).toHaveBeenLastCalledWith(true);
    expect(onLayout).toHaveBeenLastCalledWith([100, 0]);

    const callsAfterCollapse = onLayout.mock.calls.length;
    await user.keyboard("{End}");
    expect(panels[1]?.style.flexBasis).toBe("0%");
    expect(panels[1]?.hasAttribute("data-collapsed")).toBe(true);
    expect(onLayout.mock.calls.length).toBe(callsAfterCollapse);
  });

  it("resizes adjacent panels in a 3-panel layout while keeping the third panel untouched", async () => {
    const user = userEvent.setup();
    const onLayout = vi.fn();

    render(
      <Resizable onLayout={onLayout}>
        <Resizable.Panel defaultSize={25}>Left</Resizable.Panel>
        <Resizable.Handle aria-label="Resize left and center" step={5} />
        <Resizable.Panel defaultSize={50}>Center</Resizable.Panel>
        <Resizable.Handle aria-label="Resize center and right" step={5} />
        <Resizable.Panel defaultSize={25}>Right</Resizable.Panel>
      </Resizable>,
    );

    const firstHandle = screen.getByRole("separator", {
      name: "Resize left and center",
    });
    const secondHandle = screen.getByRole("separator", {
      name: "Resize center and right",
    });

    firstHandle.focus();
    await user.keyboard("{ArrowRight}");
    expect(onLayout).toHaveBeenLastCalledWith([30, 45, 25]);

    secondHandle.focus();
    await user.keyboard("{ArrowLeft}");
    expect(onLayout).toHaveBeenLastCalledWith([30, 40, 30]);
  });

  it("recomputes sizes cleanly when panel count changes dynamically", async () => {
    const user = userEvent.setup();
    const onLayout = vi.fn();

    const { container, rerender } = render(
      <Resizable onLayout={onLayout}>
        <Resizable.Panel defaultSize={40}>A</Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel defaultSize={60}>B</Resizable.Panel>
      </Resizable>,
    );

    rerender(
      <Resizable onLayout={onLayout}>
        <Resizable.Panel defaultSize={20}>A</Resizable.Panel>
        <Resizable.Handle aria-label="First handle" />
        <Resizable.Panel defaultSize={30}>B</Resizable.Panel>
        <Resizable.Handle aria-label="Second handle" />
        <Resizable.Panel defaultSize={50}>C</Resizable.Panel>
      </Resizable>,
    );

    const panels = container.querySelectorAll<HTMLElement>(
      '[data-slot="resizable-panel"]',
    );
    expect(panels).toHaveLength(3);
    expect(panels[0]?.style.flexBasis).toBe("20%");
    expect(panels[1]?.style.flexBasis).toBe("30%");
    expect(panels[2]?.style.flexBasis).toBe("50%");

    const firstHandle = screen.getByRole("separator", { name: "First handle" });
    firstHandle.focus();
    await user.keyboard("{ArrowRight}");
    expect(onLayout).toHaveBeenLastCalledWith([25, 25, 50]);
  });

  it("renders a single panel without handles at 100%", () => {
    const { container } = render(
      <Resizable>
        <Resizable.Panel>Solo</Resizable.Panel>
      </Resizable>,
    );

    const panels = container.querySelectorAll<HTMLElement>(
      '[data-slot="resizable-panel"]',
    );
    expect(panels).toHaveLength(1);
    expect(panels[0]?.style.flexBasis).toBe("100%");
    expect(screen.queryByRole("separator")).toBeNull();
  });

  it("guards over-constrained bounds without negative sizes or inverted aria min/max", async () => {
    const user = userEvent.setup();
    const onLayout = vi.fn();

    const { container } = render(
      <Resizable onLayout={onLayout}>
        <Resizable.Panel defaultSize={20} minSize={30}>
          A
        </Resizable.Panel>
        <Resizable.Handle aria-label="Overconstrained handle" />
        <Resizable.Panel defaultSize={20} minSize={30}>
          B
        </Resizable.Panel>
        <Resizable.Handle aria-label="Second handle" />
        <Resizable.Panel defaultSize={60} minSize={10}>
          C
        </Resizable.Panel>
      </Resizable>,
    );

    const handle = screen.getByRole("separator", {
      name: "Overconstrained handle",
    });
    const min = Number(handle.getAttribute("aria-valuemin"));
    const max = Number(handle.getAttribute("aria-valuemax"));
    const now = Number(handle.getAttribute("aria-valuenow"));
    expect(min).toBeLessThanOrEqual(max);
    expect(min).toBeLessThanOrEqual(now);
    expect(now).toBeLessThanOrEqual(max);

    handle.focus();
    await user.keyboard("{Home}");
    await user.keyboard("{End}");
    await user.keyboard("{ArrowRight}");
    await user.keyboard("{ArrowLeft}");

    const panels = container.querySelectorAll<HTMLElement>(
      '[data-slot="resizable-panel"]',
    );
    for (const panel of panels) {
      expect(Number.parseFloat(panel.style.flexBasis)).toBeGreaterThanOrEqual(
        0,
      );
    }
    expect(panels[0]?.style.flexBasis).toBe("20%");
    expect(panels[1]?.style.flexBasis).toBe("20%");
    expect(onLayout).not.toHaveBeenCalled();

    const { container: maxContainer } = render(
      <Resizable>
        <Resizable.Panel defaultSize={50} maxSize={40}>
          X
        </Resizable.Panel>
        <Resizable.Handle aria-label="Max overconstrained handle" />
        <Resizable.Panel defaultSize={50} maxSize={40}>
          Y
        </Resizable.Panel>
      </Resizable>,
    );
    const maxHandle = screen.getByRole("separator", {
      name: "Max overconstrained handle",
    });
    expect(Number(maxHandle.getAttribute("aria-valuemin"))).toBeLessThanOrEqual(
      Number(maxHandle.getAttribute("aria-valuemax")),
    );
    maxHandle.focus();
    await user.keyboard("{Home}");
    await user.keyboard("{End}");
    const maxPanels = maxContainer.querySelectorAll<HTMLElement>(
      '[data-slot="resizable-panel"]',
    );
    expect(maxPanels[0]?.style.flexBasis).toBe("50%");
    expect(maxPanels[1]?.style.flexBasis).toBe("50%");
  });

  it("gives unsized panels non-zero normalized space when specified defaultSizes sum to >= 100", () => {
    const { container } = render(
      <Resizable>
        <Resizable.Panel defaultSize={60}>A</Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel defaultSize={60}>B</Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel minSize={10}>C</Resizable.Panel>
      </Resizable>,
    );

    const panels = container.querySelectorAll<HTMLElement>(
      '[data-slot="resizable-panel"]',
    );
    const sizes = Array.from(panels).map((panel) =>
      Number.parseFloat(panel.style.flexBasis),
    );
    expect(sizes[2]).toBeGreaterThan(0);
    expect(sizes.reduce((sum, value) => sum + value, 0)).toBeCloseTo(100, 2);
  });

  it("prevents partial collapse into (collapsedSize, minSize) gap when sibling maxSize blocks full collapse", async () => {
    const user = userEvent.setup();
    const onCollapse = vi.fn();

    const { container } = render(
      <Resizable>
        <Resizable.Panel
          defaultSize={30}
          minSize={20}
          collapsible
          collapsedSize={0}
          onCollapse={onCollapse}
        >
          Left
        </Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel defaultSize={70} maxSize={85}>
          Right
        </Resizable.Panel>
      </Resizable>,
    );

    const panels = container.querySelectorAll<HTMLElement>(
      '[data-slot="resizable-panel"]',
    );
    const separator = screen.getByRole("separator");
    expect(separator.getAttribute("aria-valuemin")).toBe("20");

    separator.focus();
    await user.keyboard("{Enter}");
    expect(panels[0]?.style.flexBasis).toBe("30%");
    expect(onCollapse).not.toHaveBeenCalled();

    await user.keyboard("{Home}");
    expect(panels[0]?.style.flexBasis).toBe("20%");
    expect(panels[0]?.hasAttribute("data-collapsed")).toBe(false);
    expect(onCollapse).not.toHaveBeenCalled();

    await user.keyboard("{ArrowLeft}");
    expect(panels[0]?.style.flexBasis).toBe("20%");
    expect(onCollapse).not.toHaveBeenCalled();
  });

  it("expands a collapsed next panel on Enter when both adjacent panels are collapsible", async () => {
    const user = userEvent.setup();
    const onPrevCollapse = vi.fn();
    const onNextCollapse = vi.fn();

    const { container } = render(
      <Resizable>
        <Resizable.Panel
          defaultSize={70}
          minSize={15}
          collapsible
          onCollapse={onPrevCollapse}
        >
          Left
        </Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel
          defaultSize={30}
          minSize={15}
          collapsible
          onCollapse={onNextCollapse}
        >
          Right
        </Resizable.Panel>
      </Resizable>,
    );

    const panels = container.querySelectorAll<HTMLElement>(
      '[data-slot="resizable-panel"]',
    );
    const separator = screen.getByRole("separator");
    separator.focus();

    await user.keyboard("{End}");
    expect(panels[1]?.style.flexBasis).toBe("0%");
    expect(onNextCollapse).toHaveBeenLastCalledWith(true);

    await user.keyboard("{Enter}");
    expect(panels[0]?.style.flexBasis).toBe("70%");
    expect(panels[1]?.style.flexBasis).toBe("30%");
    expect(onNextCollapse).toHaveBeenLastCalledWith(false);
    expect(onPrevCollapse).not.toHaveBeenCalled();
  });

  it("respects aria-labelledby without setting fallback aria-label", async () => {
    const { container } = render(
      <div>
        <span id="divider-label">Adjust sidebar width</span>
        <Resizable>
          <Resizable.Panel>Left</Resizable.Panel>
          <Resizable.Handle aria-labelledby="divider-label" />
          <Resizable.Panel>Right</Resizable.Panel>
        </Resizable>
      </div>,
    );

    const separator = screen.getByRole("separator", {
      name: "Adjust sidebar width",
    });
    expect(separator.getAttribute("aria-labelledby")).toBe("divider-label");
    expect(separator.hasAttribute("aria-label")).toBe(false);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("clears dragging state on lostPointerCapture and when disabled mid-drag", () => {
    const { rerender } = render(
      <Resizable>
        <Resizable.Panel>Left</Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel>Right</Resizable.Panel>
      </Resizable>,
    );

    const separator = screen.getByRole("separator");
    fireEvent.pointerDown(separator, { pointerId: 1, clientX: 100, button: 0 });
    expect(separator.hasAttribute("data-dragging")).toBe(true);

    fireEvent.lostPointerCapture(separator, { pointerId: 1 });
    expect(separator.hasAttribute("data-dragging")).toBe(false);

    fireEvent.pointerDown(separator, { pointerId: 2, clientX: 100, button: 0 });
    expect(separator.hasAttribute("data-dragging")).toBe(true);

    rerender(
      <Resizable>
        <Resizable.Panel>Left</Resizable.Panel>
        <Resizable.Handle disabled />
        <Resizable.Panel>Right</Resizable.Panel>
      </Resizable>,
    );
    expect(separator.hasAttribute("data-dragging")).toBe(false);

    rerender(
      <Resizable>
        <Resizable.Panel>Left</Resizable.Panel>
        <Resizable.Handle />
        <Resizable.Panel>Right</Resizable.Panel>
      </Resizable>,
    );
    expect(separator.hasAttribute("data-dragging")).toBe(false);
  });

  it("renders sibling Fragments without duplicate React key warnings", () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const firstGroup = (
      <>
        <Resizable.Panel defaultSize={30}>Left</Resizable.Panel>
        <Resizable.Handle aria-label="First divider" />
      </>
    );
    const secondGroup = (
      <>
        <Resizable.Panel defaultSize={30}>Middle</Resizable.Panel>
        <Resizable.Handle aria-label="Second divider" />
      </>
    );

    try {
      const { container } = render(
        <Resizable>
          {firstGroup}
          {secondGroup}
          <Resizable.Panel defaultSize={40}>Right</Resizable.Panel>
        </Resizable>,
      );

      const panels = container.querySelectorAll<HTMLElement>(
        '[data-slot="resizable-panel"]',
      );
      expect(panels).toHaveLength(3);
      expect(panels[0]?.style.flexBasis).toBe("30%");
      expect(panels[1]?.style.flexBasis).toBe("30%");
      expect(panels[2]?.style.flexBasis).toBe("40%");
      expect(errorSpy).not.toHaveBeenCalled();
    } finally {
      errorSpy.mockRestore();
    }
  });
});
