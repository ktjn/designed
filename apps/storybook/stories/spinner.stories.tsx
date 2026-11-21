import { Spinner } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Spinner> = {
  title: "Spinner",
  component: Spinner,
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <Spinner size="small" label="Loading small" />
      <Spinner size="medium" label="Loading medium" />
      <Spinner size="large" label="Loading large" />
    </div>
  ),
};
