import { TagOverflow } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const items = [
  { id: "design", label: "Design" },
  { id: "tokens", label: "Tokens" },
  { id: "react", label: "React" },
  { id: "accessibility", label: "Accessibility" },
  { id: "typography", label: "Typography" },
  { id: "motion", label: "Motion" },
];

const meta: Meta<typeof TagOverflow> = {
  title: "TagOverflow",
  component: TagOverflow,
};

export default meta;
type Story = StoryObj<typeof TagOverflow>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 220 }}>
      <TagOverflow items={items} />
    </div>
  ),
};

export const ExplicitMax: Story = {
  render: () => <TagOverflow items={items} max={2} />,
};

export const OverflowPopoverInteraction: Story = {
  render: () => (
    <div style={{ width: 220 }}>
      <TagOverflow items={items} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = await canvas.findByRole("button", { name: /^\+\d+$/ });
    await expect(trigger).toBeInTheDocument();

    await userEvent.click(trigger);
    const dialog = await within(document.body).findByRole("dialog", {
      name: /\d+ more items?/,
    });
    await expect(dialog).toBeInTheDocument();
    await expect(within(dialog).getByText("Motion")).toBeInTheDocument();
  },
};
