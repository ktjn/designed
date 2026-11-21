import { AspectRatio } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof AspectRatio> = {
  title: "AspectRatio",
  component: AspectRatio,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AspectRatio>;

export const SixteenByNine: Story = {
  render: () => (
    <AspectRatio ratio={16 / 9}>
      <div
        style={{
          display: "grid",
          placeItems: "center",
          background: "var(--ds-color-background-subtle)",
          border: "1px solid var(--ds-color-border-default)",
          fontFamily: "var(--ds-font-family-base)",
          color: "var(--ds-color-foreground-muted)",
        }}
      >
        16 : 9 media container
      </div>
    </AspectRatio>
  ),
};
