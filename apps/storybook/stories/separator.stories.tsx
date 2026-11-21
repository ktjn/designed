import { Separator } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Separator> = {
  title: "Separator",
  component: Separator,
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "0.75rem", maxWidth: 320 }}>
      <span>Section one</span>
      <Separator />
      <span>Section two</span>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <span>Profile</span>
      <Separator orientation="vertical" />
      <span>Billing</span>
      <Separator orientation="vertical" />
      <span>Security</span>
    </div>
  ),
};
