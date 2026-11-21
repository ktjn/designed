import { Toggle } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof Toggle> = {
  title: "Toggle",
  component: Toggle,
};

export default meta;
type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  args: {
    children: "Pin item",
  },
};

export const Pressed: Story = {
  args: {
    defaultPressed: true,
    children: "Pinned",
  },
};

export const ToggleInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button", {
      name: "Pin item",
    });
    await userEvent.click(button);
    await expect(button).toHaveAttribute("aria-pressed", "true");
  },
};
