import { SearchIcon } from "@ktjn/designed-icons";
import { Button, EmptyState } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof EmptyState> = {
  title: "EmptyState",
  component: EmptyState,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  render: () => (
    <EmptyState
      icon={<SearchIcon aria-hidden />}
      title="No matching results"
      description="Try broadening your search terms or clearing active filters."
      action={<Button variant="secondary">Clear filters</Button>}
    />
  ),
};
