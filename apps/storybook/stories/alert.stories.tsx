import { Alert } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Alert> = {
  title: "Alert",
  component: Alert,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Alert>;

export const Info: Story = {
  args: {
    variant: "info",
    title: "Heads up",
    children: "Your changes will apply across all workspaces.",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    title: "Saved",
    children: "Your account settings have been updated.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Storage almost full",
    children: "You have used 90% of your workspace storage.",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    title: "Unable to save",
    children: "Check your network connection and try again.",
  },
};
