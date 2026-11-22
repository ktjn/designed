import { act, render, waitFor } from "@testing-library/react";
import { StrictMode } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { AlertDialog } from "../alert-dialog/alert-dialog.js";
import { Autocomplete } from "../autocomplete/autocomplete.js";
import { Button } from "../button/button.js";
import { Combobox } from "../combobox/combobox.js";
import { CommandPalette } from "../command-palette/command-palette.js";
import { ContextMenu } from "../context-menu/context-menu.js";
import { DatePicker } from "../date-picker/date-picker.js";
import { Drawer } from "../drawer/drawer.js";
import { Menu } from "../menu/menu.js";
import { Popover } from "../popover/popover.js";
import { PreviewCard } from "../preview-card/preview-card.js";
import { Select } from "../select/select.js";
import { Toast } from "../toast/toast.js";
import { Tooltip } from "../tooltip/tooltip.js";
import { Dialog } from "./dialog.js";
import { useDialogPortalContainer } from "./use-dialog-portal-container.js";

function Probe({
  enabled = true,
  onContainer,
}: {
  enabled?: boolean;
  onContainer?: (el: HTMLElement | null | undefined) => void;
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

  it("maintains accurate ref-counting under StrictMode double-mount", () => {
    const { unmount } = render(
      <StrictMode>
        <div data-density="compact">
          <Probe />
          <Probe />
        </div>
      </StrictMode>,
    );

    expect(
      document.body.querySelectorAll('[data-slot="portal-theme-scope"]'),
    ).toHaveLength(1);

    unmount();
    expect(
      document.body.querySelectorAll('[data-slot="portal-theme-scope"]'),
    ).toHaveLength(0);
  });

  it("propagates theme attributes added or removed dynamically on documentElement without replacing the host", async () => {
    let latestContainer: HTMLElement | null | undefined;
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
    expect(initialHost).toBeInstanceOf(HTMLElement);
    expect(initialHost?.getAttribute("data-brand")).toBe("editorial");
    expect(initialHost?.getAttribute("data-color-scheme")).toBeNull();

    await act(async () => {
      document.documentElement.setAttribute("data-color-scheme", "dark");
    });

    await waitFor(() => {
      expect(initialHost?.getAttribute("data-color-scheme")).toBe("dark");
    });
    expect(latestContainer).toBe(initialHost);

    await act(async () => {
      document.documentElement.removeAttribute("data-color-scheme");
    });

    await waitFor(() => {
      expect(initialHost?.getAttribute("data-color-scheme")).toBeNull();
    });
    expect(latestContainer).toBe(initialHost);
  });

  it("acquires and releases a body host when a nested ancestor gains and loses a theme attribute", async () => {
    let latestContainer: HTMLElement | null | undefined;
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

    await act(async () => {
      getByTestId("panel").removeAttribute("data-color-scheme");
    });

    await waitFor(() => {
      expect(latestContainer).toBeUndefined();
      expect(
        document.body.querySelectorAll('[data-slot="portal-theme-scope"]'),
      ).toHaveLength(0);
    });
  });

  it("toggles body host mounting as enabled changes between false and true", () => {
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

    rerender(
      <div data-density="compact">
        <Probe enabled={false} />
      </div>,
    );

    expect(
      document.body.querySelectorAll('[data-slot="portal-theme-scope"]'),
    ).toHaveLength(0);
  });

  it("mounts zero body hosts for closed overlays inside a nested theme scope", () => {
    render(
      <div data-brand="editorial" data-density="compact">
        <Toast.Provider>
          <Dialog>
            <Dialog.Trigger>Dialog</Dialog.Trigger>
            <Dialog.Content>
              <Dialog.Title>Title</Dialog.Title>
            </Dialog.Content>
          </Dialog>
          <AlertDialog>
            <AlertDialog.Trigger>Alert</AlertDialog.Trigger>
            <AlertDialog.Content>
              <AlertDialog.Title>Confirm</AlertDialog.Title>
            </AlertDialog.Content>
          </AlertDialog>
          <Drawer>
            <Drawer.Trigger>Drawer</Drawer.Trigger>
            <Drawer.Content>
              <Drawer.Title>Drawer</Drawer.Title>
            </Drawer.Content>
          </Drawer>
          <Popover>
            <Popover.Trigger>Popover</Popover.Trigger>
            <Popover.Content>Body</Popover.Content>
          </Popover>
          <Menu>
            <Menu.Trigger>Menu</Menu.Trigger>
            <Menu.Content>
              <Menu.Item>Item</Menu.Item>
            </Menu.Content>
          </Menu>
          <ContextMenu>
            <ContextMenu.Trigger>Context</ContextMenu.Trigger>
            <ContextMenu.Content>
              <ContextMenu.Item>Item</ContextMenu.Item>
            </ContextMenu.Content>
          </ContextMenu>
          <Tooltip content="Tip">
            <Button>Hover</Button>
          </Tooltip>
          <PreviewCard>
            <PreviewCard.Trigger href="#preview">Link</PreviewCard.Trigger>
            <PreviewCard.Content>Preview</PreviewCard.Content>
          </PreviewCard>
          <Select items={[{ value: "a", label: "A" }]}>
            <Select.Trigger aria-label="Select">
              <Select.Value placeholder="Choose" />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="a">A</Select.Item>
            </Select.Content>
          </Select>
          <Combobox items={[{ value: "a", label: "A" }]}>
            <Combobox.Input />
            <Combobox.Content />
          </Combobox>
          <Autocomplete items={["One", "Two"]} aria-label="Auto" />
          <CommandPalette items={[{ id: "1", label: "One" }]} />
          <DatePicker aria-label="Date" />
        </Toast.Provider>
      </div>,
    );

    expect(
      document.body.querySelectorAll('[data-slot="portal-theme-scope"]'),
    ).toHaveLength(0);
  });
});
