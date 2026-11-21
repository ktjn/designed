import { Progress } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Progress> = {
  title: "Progress",
  component: Progress,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Progress>;

export const Determinate: Story = {
  args: {
    value: 65,
    label: "Uploading assets",
    showValue: true,
  },
};

export const Indeterminate: Story = {
  args: {
    value: null,
    label: "Preparing export",
  },
};
