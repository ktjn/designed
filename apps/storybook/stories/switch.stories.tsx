import { Switch } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

const meta: Meta<typeof Switch> = {
  title: "Switch",
  component: Switch,
  args: {
    "aria-label": "Enable notifications",
    onCheckedChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Off: Story = {};

export const On: Story = {
  args: { defaultChecked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const RightToLeft: Story = {
  args: { defaultChecked: true },
  decorators: [
    (Story) => (
      <div dir="rtl">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const control = within(canvasElement).getByRole("switch");
    const thumb = control.querySelector("span[data-checked]");
    if (!thumb) throw new Error("Checked switch thumb is missing");
    const trackBounds = control.getBoundingClientRect();
    const thumbBounds = thumb.getBoundingClientRect();
    await expect(thumbBounds.left).toBeGreaterThanOrEqual(trackBounds.left);
    await expect(thumbBounds.right).toBeLessThanOrEqual(trackBounds.right);
    await expect(thumbBounds.left).toBeLessThan(
      trackBounds.left + trackBounds.width / 2,
    );
  },
};

export const ToggleInteraction: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("switch"));
    await expect(args.onCheckedChange).toHaveBeenCalledWith(
      true,
      expect.anything(),
    );
  },
};
