import { Avatar } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Avatar> = {
  title: "Avatar",
  component: Avatar,
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <Avatar alt="Ada Lovelace" fallback="AL" size="small" />
      <Avatar alt="Grace Hopper" fallback="GH" size="medium" />
      <Avatar alt="Alan Turing" fallback="AT" size="large" />
    </div>
  ),
};
