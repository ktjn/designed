import { Stat } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Stat> = {
  title: "Stat",
  component: Stat,
};

export default meta;
type Story = StoryObj<typeof Stat>;

export const Default: Story = {
  args: {
    label: "Monthly revenue",
    value: "$48,200",
    delta: "+12.4%",
    trend: "up",
    helpText: "Compared to last 30 days",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 280 }}>
        <Story />
      </div>
    ),
  ],
};

export const Trends: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))",
        gap: "1rem",
      }}
    >
      <Stat
        label="Monthly revenue"
        value="$48,200"
        delta="+12.4%"
        trend="up"
        helpText="vs. prior 30 days"
      />
      <Stat
        label="Churn rate"
        value="2.1%"
        delta="-0.4%"
        trend="down"
        helpText="vs. prior 30 days"
      />
      <Stat
        label="Uptime"
        value="99.98%"
        delta="0.0%"
        trend="neutral"
        helpText="SLA target 99.9%"
      />
    </div>
  ),
};
