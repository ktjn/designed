import { StatusIndicator } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof StatusIndicator> = {
  title: "StatusIndicator",
  component: StatusIndicator,
};

export default meta;
type Story = StoryObj<typeof StatusIndicator>;

export const Default: Story = {
  args: {
    variant: "success",
    children: "Operational",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
      <StatusIndicator variant="neutral">Inactive</StatusIndicator>
      <StatusIndicator variant="info">Scheduled</StatusIndicator>
      <StatusIndicator variant="success">Operational</StatusIndicator>
      <StatusIndicator variant="warning">Degraded</StatusIndicator>
      <StatusIndicator variant="danger">Outage</StatusIndicator>
      <StatusIndicator variant="pending">Pending approval</StatusIndicator>
      <StatusIndicator variant="loading">Deploying</StatusIndicator>
    </div>
  ),
};

export const Pulsing: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
      <StatusIndicator variant="success" pulse>
        Live
      </StatusIndicator>
      <StatusIndicator variant="info" pulse>
        Monitoring
      </StatusIndicator>
      <StatusIndicator variant="warning" pulse>
        High latency
      </StatusIndicator>
      <StatusIndicator variant="danger" pulse>
        Incident active
      </StatusIndicator>
      <StatusIndicator variant="pending" pulse>
        Queued
      </StatusIndicator>
    </div>
  ),
};
