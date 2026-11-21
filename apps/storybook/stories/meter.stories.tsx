import { Meter } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Meter> = {
  title: "Meter",
  component: Meter,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Meter>;

export const Default: Story = {
  render: () => <Meter value={64} label="Storage used" showValue />,
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1rem" }}>
      <Meter value={35} label="CPU" showValue variant="success" />
      <Meter value={78} label="Memory" showValue variant="warning" />
      <Meter value={94} label="Disk quota" showValue variant="danger" />
    </div>
  ),
};
