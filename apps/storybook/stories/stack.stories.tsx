import { Badge, Button, Stack } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Stack> = {
  title: "Stack",
  component: Stack,
};

export default meta;
type Story = StoryObj<typeof Stack>;

export const Vertical: Story = {
  render: () => (
    <Stack gap="md">
      <Badge variant="info">First item</Badge>
      <Badge variant="success">Second item</Badge>
      <Badge variant="warning">Third item</Badge>
    </Stack>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <Stack direction="horizontal" gap="md" align="center" wrap>
      <Button variant="primary">Save</Button>
      <Button variant="secondary">Cancel</Button>
      <Button variant="ghost">Reset</Button>
    </Stack>
  ),
};
