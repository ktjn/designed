import { act, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useDialogPortalContainer } from "./use-dialog-portal-container.js";

function Probe({
  enabled = true,
  onContainer,
}: {
  enabled?: boolean;
  onContainer?: (el: HTMLElement | undefined) => void;
}) {
  const { container, scopeRef } = useDialogPortalContainer(enabled);
  onContainer?.(container);
  return <span hidden ref={scopeRef} />;
}

afterEach(() => {
  document.documentElement.removeAttribute("data-color-scheme");
  document.documentElement.removeAttribute("data-brand");
});

describe("useDialogPortalContainer", () => {
  it("shares a single body host across sibling overlays in the same nested theme scope and cleans up on unmount", () => {
    const { unmount } = render(
      <div data-density="compact">
        <Probe />
        <Probe />
        <Probe />
      </div>,
    );

    const hosts = document.body.querySelectorAll(
      '[data-slot="portal-theme-scope"]',
    );
    expect(hosts).toHaveLength(1);
    expect(hosts[0]?.getAttribute("data-density")).toBe("compact");

    unmount();
    expect(
      document.body.querySelectorAll('[data-slot="portal-theme-scope"]'),
    ).toHaveLength(0);
  });

  it("propagates theme attributes added dynamically to documentElement after mount without replacing the host", async () => {
    let latestContainer: HTMLElement | undefined;
    render(
      <div data-brand="editorial">
        <Probe
          onContainer={(el) => {
            latestContainer = el;
          }}
        />
      </div>,
    );

    const initialHost = latestContainer;
    expect(initialHost).toBeDefined();
    expect(initialHost?.getAttribute("data-brand")).toBe("editorial");
    expect(initialHost?.getAttribute("data-color-scheme")).toBeNull();

    await act(async () => {
      document.documentElement.setAttribute("data-color-scheme", "dark");
    });

    await waitFor(() => {
      expect(initialHost?.getAttribute("data-color-scheme")).toBe("dark");
    });
    expect(latestContainer).toBe(initialHost);
  });

  it("acquires a body host when a nested ancestor gains a theme attribute after mount", async () => {
    let latestContainer: HTMLElement | undefined;
    const { getByTestId } = render(
      <div data-testid="panel">
        <Probe
          onContainer={(el) => {
            latestContainer = el;
          }}
        />
      </div>,
    );

    expect(latestContainer).toBeUndefined();
    expect(
      document.body.querySelectorAll('[data-slot="portal-theme-scope"]'),
    ).toHaveLength(0);

    await act(async () => {
      getByTestId("panel").setAttribute("data-color-scheme", "dark");
    });

    await waitFor(() => {
      expect(latestContainer?.getAttribute("data-color-scheme")).toBe("dark");
    });
  });

  it("does not mount a body host when enabled is false", () => {
    const { rerender } = render(
      <div data-density="compact">
        <Probe enabled={false} />
      </div>,
    );

    expect(
      document.body.querySelectorAll('[data-slot="portal-theme-scope"]'),
    ).toHaveLength(0);

    rerender(
      <div data-density="compact">
        <Probe enabled={true} />
      </div>,
    );

    expect(
      document.body.querySelectorAll('[data-slot="portal-theme-scope"]'),
    ).toHaveLength(1);
  });
});
