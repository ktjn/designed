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

// KNOWN ISSUE: verified against a real Chromium browser (via Playwright,
// against the built storybook-static output, not just jsdom) that hovering
// the trigger does not open the tooltip within several seconds, even with
// realistic multi-step pointer movement and confirmed mouseenter/pointerenter
// events reaching the trigger element. The same result reproduces with
// @base-ui/react's raw Tooltip compound components directly (no wrapper
// involved), so this is not a bug in this package's Tooltip implementation.
// Root cause not yet isolated — candidates include a floating-ui-react
// hover-intent/velocity heuristic that headless Chromium's synthetic pointer
// events don't satisfy, or a Base UI requirement not covered in its public
// docs. This story is left in place (rather than deleted) so the gap stays
// visible; do not treat a passing Storybook build as evidence this works.
export const HoverInteraction: Story = {
  render: () => (
    <Tooltip content="Saves your changes">
      <Button>Save</Button>
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.hover(canvas.getByRole("button", { name: "Save" }));
    const tooltip = await within(document.body).findByRole(
      "tooltip",
      {},
      { timeout: 3000 },
    );
    await expect(tooltip).toHaveTextContent("Saves your changes");

    await userEvent.unhover(canvas.getByRole("button", { name: "Save" }));
    await expectEventuallyRemoved(() =>
      within(document.body).queryByRole("tooltip"),
    );
  },
};
