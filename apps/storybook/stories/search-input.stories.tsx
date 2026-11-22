import { SearchInput } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof SearchInput> = {
  title: "SearchInput",
  component: SearchInput,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 280 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {
  render: () => <SearchInput aria-label="Search" placeholder="Search..." />,
};

export const ClearInteraction: Story = {
  render: () => <SearchInput aria-label="Search" defaultValue="query" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("searchbox") as HTMLInputElement;
    expect(input.value).toBe("query");
    await userEvent.click(canvas.getByRole("button", { name: "Clear search" }));
    expect(input.value).toBe("");
  },
};
