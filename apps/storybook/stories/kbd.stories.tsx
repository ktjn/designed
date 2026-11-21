import { Kbd, Stack } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Kbd> = {
  title: "Kbd",
  component: Kbd,
};

export default meta;
type Story = StoryObj<typeof Kbd>;

export const Default: Story = {
  render: () => (
    <Stack direction="horizontal" gap="sm" align="center">
      <Kbd>Ctrl</Kbd>
      <Kbd>K</Kbd>
      <Kbd size="sm">Esc</Kbd>
    </Stack>
  ),
};
