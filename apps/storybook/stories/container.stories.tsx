import { Card, Container } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Container> = {
  title: "Container",
  component: Container,
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  render: () => (
    <Container size="sm">
      <Card>
        <Card.Header>
          <Card.Title>Small container</Card.Title>
          <Card.Description>
            Constrained to 40rem with symmetric inline padding.
          </Card.Description>
        </Card.Header>
      </Card>
    </Container>
  ),
};
