import { Calendar } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof Calendar> = {
  title: "Calendar",
  component: Calendar,
};

export default meta;
type Story = StoryObj<typeof Calendar>;

export const Default: Story = {
  render: () => <Calendar defaultValue="2026-06-15" />,
};

export const Bounded: Story = {
  render: () => (
    <Calendar defaultValue="2026-06-15" min="2026-06-10" max="2026-06-20" />
  ),
};

export const SelectDateInteraction: Story = {
  render: () => <Calendar defaultValue="2026-06-15" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const day20 = canvas.getByRole("button", { name: /2026-06-20/ });
    await userEvent.click(day20);
    await expect(day20).toHaveAttribute("aria-pressed", "true");
  },
};
