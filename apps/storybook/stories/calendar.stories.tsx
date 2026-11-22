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

export const RangeMode: Story = {
  render: () => <Calendar mode="range" defaultMonth="2026-06" />,
};

export const RangeSelectionInteraction: Story = {
  render: () => <Calendar mode="range" defaultMonth="2026-06" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: /2026-06-10/ }));
    await userEvent.click(canvas.getByRole("button", { name: /2026-06-15/ }));
    const start = canvas.getByRole("button", { name: /2026-06-10/ });
    const end = canvas.getByRole("button", { name: /2026-06-15/ });
    const between = canvas.getByRole("button", { name: /2026-06-12/ });
    await expect(start).toHaveAttribute("data-range-start");
    await expect(end).toHaveAttribute("data-range-end");
    await expect(between).toHaveAttribute("data-in-range");
  },
};
