import { Skeleton } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Skeleton> = {
  title: "Skeleton",
  component: Skeleton,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const CardPlaceholder: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "0.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <Skeleton variant="circular" width={40} height={40} />
        <div style={{ flex: 1, display: "grid", gap: "0.5rem" }}>
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="rectangular" height={96} />
    </div>
  ),
};
