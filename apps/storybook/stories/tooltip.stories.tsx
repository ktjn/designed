import { Button, Tooltip } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
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
    <Tooltip content="Saves your changes">
      <Button>Save</Button>
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Save" });
    await userEvent.pointer({ target: canvasElement, coords: { x: 0, y: 0 } });
    await userEvent.hover(trigger);
    const tooltip = await within(document.body).findByRole(
      "tooltip",
      {},
      { timeout: 5000 },
    );
    await expect(tooltip).toHaveTextContent("Saves your changes");

    await userEvent.unhover(trigger);
    await expectEventuallyRemoved(() =>
      within(document.body).queryByRole("tooltip"),
    );
  },
};
