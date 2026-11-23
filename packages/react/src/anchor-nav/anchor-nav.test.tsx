import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { AnchorNav } from "./anchor-nav.js";

type ObserverCallback = (entries: IntersectionObserverEntry[]) => void;

let observerCallback: ObserverCallback | null = null;
let observedTargets: Element[] = [];

class MockIntersectionObserver {
  callback: ObserverCallback;

  constructor(callback: ObserverCallback) {
    this.callback = callback;
    observerCallback = callback;
  }

  observe(target: Element) {
    observedTargets.push(target);
  }

  unobserve() {}

  disconnect() {
    observedTargets = [];
  }
}

function makeEntry(
  target: Element,
  isIntersecting: boolean,
  top = 0,
): IntersectionObserverEntry {
  return {
    target,
    isIntersecting,
    boundingClientRect: { top } as DOMRectReadOnly,
  } as IntersectionObserverEntry;
}

function renderAnchorNav() {
  return render(
    <>
      <AnchorNav>
        <AnchorNav.List>
          <AnchorNav.Item>
            <AnchorNav.Link href="#intro">Introduction</AnchorNav.Link>
          </AnchorNav.Item>
          <AnchorNav.Item>
            <AnchorNav.Link href="#details">Details</AnchorNav.Link>
          </AnchorNav.Item>
        </AnchorNav.List>
      </AnchorNav>
      <section id="intro">Intro content</section>
      <section id="details">Details content</section>
    </>,
  );
}

describe("AnchorNav", () => {
  beforeEach(() => {
    observerCallback = null;
    observedTargets = [];
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders nav landmark with default aria-label", () => {
    renderAnchorNav();
    expect(
      screen.getByRole("navigation", { name: "Table of contents" }),
    ).toBeTruthy();
  });

  it("toggles aria-current and data-active as the active section changes", () => {
    renderAnchorNav();
    const introLink = screen.getByRole("link", { name: "Introduction" });
    const detailsLink = screen.getByRole("link", { name: "Details" });
    const introSection = document.getElementById("intro") as HTMLElement;
    const detailsSection = document.getElementById("details") as HTMLElement;

    act(() => {
      observerCallback?.([makeEntry(introSection, true, 0)]);
    });
    expect(introLink.getAttribute("aria-current")).toBe("location");
    expect(introLink.getAttribute("data-active")).toBe("");
    expect(detailsLink.hasAttribute("data-active")).toBe(false);

    act(() => {
      observerCallback?.([makeEntry(detailsSection, true, 0)]);
    });
    expect(detailsLink.getAttribute("aria-current")).toBe("location");
    expect(detailsLink.getAttribute("data-active")).toBe("");
    expect(introLink.hasAttribute("aria-current")).toBe(false);
  });

  it("scrolls smoothly by default when clicking a link", async () => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: false }));
    const scrollIntoView = vi.fn();
    const introSection = document.createElement("section");
    introSection.id = "intro";
    HTMLElement.prototype.scrollIntoView = scrollIntoView;

    renderAnchorNav();
    const user = userEvent.setup();
    await user.click(screen.getByRole("link", { name: "Introduction" }));

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
  });

  it("scrolls without animation when prefers-reduced-motion is set", async () => {
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue({ matches: true }));
    const scrollIntoView = vi.fn();
    HTMLElement.prototype.scrollIntoView = scrollIntoView;

    renderAnchorNav();
    const user = userEvent.setup();
    await user.click(screen.getByRole("link", { name: "Introduction" }));

    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: "auto",
      block: "start",
    });
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = renderAnchorNav();
    expect(await axe(container)).toHaveNoViolations();
  });
});
