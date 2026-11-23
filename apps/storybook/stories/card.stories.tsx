import { Badge, Button, Card } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Card> = {
  title: "Card",
  component: Card,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card>
      <Card.Header>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "0.5rem",
          }}
        >
          <Card.Title>Production API</Card.Title>
          <Badge variant="success">Healthy</Badge>
        </div>
        <Card.Description>
          Manage access keys and webhook deliveries.
        </Card.Description>
      </Card.Header>
      <Card.Content>Last deployment completed 12 minutes ago.</Card.Content>
      <Card.Footer>
        <Button variant="secondary">View logs</Button>
        <Button variant="primary">Rotate key</Button>
      </Card.Footer>
    </Card>
  ),
};

export const Section: Story = {
  render: () => (
    <Card as="section" aria-labelledby="deployment-summary">
      <Card.Header>
        <span>Release status</span>
        <Card.Title as="h2" id="deployment-summary">
          Deployment summary
        </Card.Title>
      </Card.Header>
      <Card.Content>All services are running the latest release.</Card.Content>
    </Card>
  ),
};
