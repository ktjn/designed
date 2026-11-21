import { Card, Grid } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Grid> = {
  title: "Grid",
  component: Grid,
};

export default meta;
type Story = StoryObj<typeof Grid>;

export const ThreeColumns: Story = {
  render: () => (
    <Grid columns={3} gap="lg">
      <Card>
        <Card.Header>
          <Card.Title>Users</Card.Title>
          <Card.Description>1,284 active</Card.Description>
        </Card.Header>
      </Card>
      <Card>
        <Card.Header>
          <Card.Title>Latency</Card.Title>
          <Card.Description>42 ms p95</Card.Description>
        </Card.Header>
      </Card>
      <Card>
        <Card.Header>
          <Card.Title>Uptime</Card.Title>
          <Card.Description>99.98%</Card.Description>
        </Card.Header>
      </Card>
    </Grid>
  ),
};

export const AutoResponsive: Story = {
  render: () => (
    <Grid columns="auto" minItemWidth="12rem" gap="md">
      <Card>
        <Card.Content>Auto card 1</Card.Content>
      </Card>
      <Card>
        <Card.Content>Auto card 2</Card.Content>
      </Card>
      <Card>
        <Card.Content>Auto card 3</Card.Content>
      </Card>
      <Card>
        <Card.Content>Auto card 4</Card.Content>
      </Card>
    </Grid>
  ),
};
