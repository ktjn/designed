import { Button, Tooltip } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { expectEventuallyRemoved } from "./utils/expect-removed";

const meta: Meta<typeof Tooltip> = {
  title: "Tooltip",
  component: Tooltip,
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <Tooltip content="Saves your changes">
      <Button>Save</Button>
    </Tooltip>
  ),
};

// Base UI's hover-open goes through floating-ui-react's `useHover`, which
// only starts its open-delay ("rest") timer on a `mousemove` whose
// movementX/movementY delta is large enough to not be filtered out as
// pointer tremor (movementX**2 + movementY**2 < 2 is ignored). If the
// pointer's start position happens to already be close to the trigger,
// userEvent.hover's implicit move can fall under that threshold and the
// tooltip never opens. Moving to a far corner first guarantees a large
// enough delta regardless of where the pointer started.
export const HoverInteraction: Story = {
  render: () => (
    <>
      <span id="save-hint">Shortcut: Ctrl+S</span>
      <Tooltip content="Saves your changes">
        <Button aria-describedby="save-hint">Save</Button>
      </Tooltip>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Save" });
    await expect(trigger).toHaveAttribute("aria-describedby", "save-hint");

    await userEvent.pointer({ target: canvasElement, coords: { x: 0, y: 0 } });
    await userEvent.hover(trigger);
    const tooltip = await within(document.body).findByRole(
      "tooltip",
      {},
      { timeout: 5000 },
    );
    await expect(tooltip).toHaveTextContent("Saves your changes");
    await expect(trigger).toHaveAttribute(
      "aria-describedby",
      `save-hint ${tooltip.id}`,
    );

    await userEvent.unhover(trigger);
    await expectEventuallyRemoved(() =>
      within(document.body).queryByRole("tooltip"),
    );
    await expect(trigger).toHaveAttribute("aria-describedby", "save-hint");
  },
};

export const Disabled: Story = {
  render: () => (
    <>
      <span id="disabled-save-hint">Shortcut: Ctrl+S</span>
      <Tooltip content="Saves your changes" disabled open>
        <Button aria-describedby="disabled-save-hint">Save</Button>
      </Tooltip>
    </>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Save" });

    await expect(trigger).toBeEnabled();
    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await expect(trigger).toHaveAttribute(
      "aria-describedby",
      "disabled-save-hint",
    );
    await expect(within(document.body).queryByRole("tooltip")).toBeNull();
  },
};

export const DelayOverrides: Story = {
  render: () => (
    <Tooltip.Provider delay={0} closeDelay={0}>
      <Tooltip content="Saves your changes" delay={1600} closeDelay={1600}>
        <Button>Save</Button>
      </Tooltip>
    </Tooltip.Provider>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(document.body);
    const trigger = canvas.getByRole("button", { name: "Save" });

    await userEvent.pointer({ target: canvasElement, coords: { x: 0, y: 0 } });
    await userEvent.hover(trigger);
    await new Promise((resolve) => setTimeout(resolve, 800));
    await expect(body.queryByRole("tooltip")).toBeNull();
    await body.findByRole("tooltip", {}, { timeout: 3000 });

    await userEvent.unhover(trigger);
    await new Promise((resolve) => setTimeout(resolve, 800));
    await expect(body.getByRole("tooltip")).toBeVisible();
    await waitFor(() => expect(body.queryByRole("tooltip")).toBeNull(), {
      timeout: 3000,
    });
  },
};

export const DisableDuringExit: Story = {
  render: function DisableDuringExit() {
    const [disabled, setDisabled] = useState(false);

    return (
      <div data-color-scheme="dark">
        <style>{`
          .tooltip-disable-transition { transition: opacity 1s; }
          .tooltip-disable-transition[data-ending-style] { opacity: 0; }
        `}</style>
        <Tooltip
          className="tooltip-disable-transition"
          content="Saves your changes"
          open
          disabled={disabled}
        >
          <Button>Save</Button>
        </Tooltip>
        <Button onClick={() => setDisabled(true)}>Disable tooltip</Button>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tooltip = await within(document.body).findByRole("tooltip");
    const themeHost = tooltip.closest('[data-slot="portal-theme-scope"]');
    await expect(themeHost).toHaveAttribute("data-color-scheme", "dark");

    await userEvent.click(
      canvas.getByRole("button", { name: "Disable tooltip" }),
    );
    await expect(themeHost).toBeInTheDocument();
    await expect(themeHost).toContainElement(tooltip);
    await expect(tooltip).toHaveAttribute("data-ending-style");
    await expect(
      canvas.getByRole("button", { name: "Save" }),
    ).not.toHaveAttribute("aria-describedby");
    await waitFor(() => expect(themeHost).not.toBeInTheDocument(), {
      timeout: 3000,
    });
  },
};
