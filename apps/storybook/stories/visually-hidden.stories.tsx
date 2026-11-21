import { SearchIcon } from "@ktjn/designed-icons";
import { Button, VisuallyHidden } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof VisuallyHidden> = {
  title: "VisuallyHidden",
  component: VisuallyHidden,
};

export default meta;
type Story = StoryObj<typeof VisuallyHidden>;

export const IconOnlyButton: Story = {
  render: () => (
    <Button variant="secondary">
      <SearchIcon aria-hidden />
      <VisuallyHidden>Search workspace</VisuallyHidden>
    </Button>
  ),
};
