import { cleanup } from "@testing-library/react";
import { afterEach, expect } from "vitest";
import "vitest-axe/extend-expect";
import * as matchers from "vitest-axe/matchers";

expect.extend(matchers);

// jsdom does not implement PointerEvent; Base UI's interaction handling
// (click-after-keyup simulation, pointer-based activation) requires it.
// This mirrors the polyfill commonly used to test Radix/Base UI components
// under jsdom rather than a real browser.
if (
  typeof window !== "undefined" &&
  typeof window.PointerEvent === "undefined"
) {
  class PointerEventPolyfill extends MouseEvent implements PointerEvent {
    pointerId: number;
    width: number;
    height: number;
    pressure: number;
    tangentialPressure: number;
    tiltX: number;
    tiltY: number;
    twist: number;
    pointerType: string;
    isPrimary: boolean;
    altitudeAngle: number;
    azimuthAngle: number;
    persistentDeviceId: number;

    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
      this.pointerId = params.pointerId ?? 0;
      this.width = params.width ?? 1;
      this.height = params.height ?? 1;
      this.pressure = params.pressure ?? 0;
      this.tangentialPressure = params.tangentialPressure ?? 0;
      this.tiltX = params.tiltX ?? 0;
      this.tiltY = params.tiltY ?? 0;
      this.twist = params.twist ?? 0;
      this.pointerType = params.pointerType ?? "mouse";
      this.isPrimary = params.isPrimary ?? false;
      this.altitudeAngle = params.altitudeAngle ?? 0;
      this.azimuthAngle = params.azimuthAngle ?? 0;
      this.persistentDeviceId = 0;
    }

    getCoalescedEvents(): PointerEvent[] {
      return [];
    }

    getPredictedEvents(): PointerEvent[] {
      return [];
    }
  }

  window.PointerEvent = PointerEventPolyfill as unknown as typeof PointerEvent;
}

// jsdom does not implement ResizeObserver, which Base UI's floating-ui-based
// anchor positioning (Popover/Menu/Tooltip Positioner) requires to compute
// placement. Without it, opening one of these components hangs indefinitely
// under jsdom instead of throwing, which is what actually surfaced this gap.
if (
  typeof window !== "undefined" &&
  typeof window.ResizeObserver === "undefined"
) {
  class ResizeObserverPolyfill {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  window.ResizeObserver =
    ResizeObserverPolyfill as unknown as typeof ResizeObserver;
}

// jsdom also lacks IntersectionObserver, used by the same anchor-positioning
// machinery to track anchor visibility.
if (
  typeof window !== "undefined" &&
  typeof window.IntersectionObserver === "undefined"
) {
  class IntersectionObserverPolyfill {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }

  window.IntersectionObserver =
    IntersectionObserverPolyfill as unknown as typeof IntersectionObserver;
}

afterEach(() => {
  cleanup();
});
