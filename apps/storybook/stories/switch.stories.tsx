import { Switch } from "@ktjn/design-react";
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

export const ToggleInteraction: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("switch"));
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true);
  },
};
