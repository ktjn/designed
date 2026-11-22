import { CodeSnippet } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof CodeSnippet> = {
  title: "CodeSnippet",
  component: CodeSnippet,
};

export default meta;
type Story = StoryObj<typeof CodeSnippet>;

export const Inline: Story = {
  render: () => (
    <p>
      Run <CodeSnippet>pnpm install</CodeSnippet> before building.
    </p>
  ),
};

export const Block: Story = {
  render: () => (
    <CodeSnippet variant="block">{"pnpm install\npnpm run build"}</CodeSnippet>
  ),
};

export const CopyInteraction: Story = {
  ...Block,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const originalClipboard = navigator.clipboard;
    const writeText = async () => {};
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    try {
      const button = canvas.getByRole("button", { name: "Copy code" });
      await userEvent.click(button);
      await expect(canvas.getByRole("button", { name: "Copied" })).toBeTruthy();
    } finally {
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: originalClipboard,
      });
    }
  },
};
