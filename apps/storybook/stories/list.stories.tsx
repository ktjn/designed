import { Badge, List } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof List> = {
  title: "List",
  component: List,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof List>;

export const Default: Story = {
  render: () => (
    <List>
      <List.Item
        leading={<span aria-hidden="true">01</span>}
        trailing={<Badge variant="success">Active</Badge>}
      >
        Production API
      </List.Item>
      <List.Item
        leading={<span aria-hidden="true">02</span>}
        trailing={<Badge variant="warning">Degraded</Badge>}
      >
        Webhook worker
      </List.Item>
      <List.Item
        leading={<span aria-hidden="true">03</span>}
        trailing={<Badge variant="neutral">Idle</Badge>}
      >
        Batch importer
      </List.Item>
    </List>
  ),
};

export const Contained: Story = {
  render: () => (
    <List variant="contained">
      <List.Item trailing={<Badge variant="success">Active</Badge>}>
        Production API
      </List.Item>
      <List.Item trailing={<Badge variant="warning">Degraded</Badge>}>
        Webhook worker
      </List.Item>
      <List.Item trailing={<Badge variant="neutral">Idle</Badge>}>
        Batch importer
      </List.Item>
    </List>
  ),
};
