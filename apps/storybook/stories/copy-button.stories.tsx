import { CopyButton } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof CopyButton> = {
  title: "CopyButton",
  component: CopyButton,
};

export default meta;
type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {
  render: () => <CopyButton value="npm install @ktjn/designed-react" />,
};

export const CopyInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const originalClipboard = navigator.clipboard;
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async () => {} },
    });
    try {
      await userEvent.click(canvas.getByRole("button", { name: "Copy" }));
      await expect(canvas.getByRole("button", { name: "Copied" })).toBeTruthy();
    } finally {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: originalClipboard,
      });
    }
  },
};
