import { Stack, Text } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Text> = {
  title: "Text",
  component: Text,
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {
  render: () => (
    <Stack gap="sm">
      <Text size="300" weight="bold">
        Large bold text
      </Text>
      <Text>Default body copy</Text>
      <Text size="100" tone="muted">
        Small muted metadata
      </Text>
      <Text as="span" weight="medium">
        Inline medium-weight span
      </Text>
    </Stack>
  ),
};
