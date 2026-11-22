import { CalendarIcon, HomeIcon, SettingsIcon } from "@ktjn/designed-icons";
import { SegmentedControl } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof SegmentedControl> = {
  title: "SegmentedControl",
  component: SegmentedControl,
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

export const Default: Story = {
  render: () => (
    <SegmentedControl aria-label="Timeframe" defaultValue="day">
      <SegmentedControl.Item value="day">Day</SegmentedControl.Item>
      <SegmentedControl.Item value="week">Week</SegmentedControl.Item>
      <SegmentedControl.Item value="month">Month</SegmentedControl.Item>
    </SegmentedControl>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <SegmentedControl aria-label="Small scale" size="small" defaultValue="a">
        <SegmentedControl.Item value="a">Small</SegmentedControl.Item>
        <SegmentedControl.Item value="b">Option B</SegmentedControl.Item>
        <SegmentedControl.Item value="c">Option C</SegmentedControl.Item>
      </SegmentedControl>
      <SegmentedControl
        aria-label="Medium scale"
        size="medium"
        defaultValue="a"
      >
        <SegmentedControl.Item value="a">Medium</SegmentedControl.Item>
        <SegmentedControl.Item value="b">Option B</SegmentedControl.Item>
        <SegmentedControl.Item value="c">Option C</SegmentedControl.Item>
      </SegmentedControl>
      <SegmentedControl aria-label="Large scale" size="large" defaultValue="a">
        <SegmentedControl.Item value="a">Large</SegmentedControl.Item>
        <SegmentedControl.Item value="b">Option B</SegmentedControl.Item>
        <SegmentedControl.Item value="c">Option C</SegmentedControl.Item>
      </SegmentedControl>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <SegmentedControl aria-label="Section" defaultValue="overview">
      <SegmentedControl.Item value="overview" icon={<HomeIcon aria-hidden />}>
        Overview
      </SegmentedControl.Item>
      <SegmentedControl.Item
        value="schedule"
        icon={<CalendarIcon aria-hidden />}
      >
        Schedule
      </SegmentedControl.Item>
      <SegmentedControl.Item
        value="settings"
        icon={<SettingsIcon aria-hidden />}
      >
        Settings
      </SegmentedControl.Item>
    </SegmentedControl>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <div style={{ maxInlineSize: "28rem" }}>
      <SegmentedControl aria-label="View mode" fullWidth defaultValue="list">
        <SegmentedControl.Item value="list">List</SegmentedControl.Item>
        <SegmentedControl.Item value="grid">Grid</SegmentedControl.Item>
        <SegmentedControl.Item value="board">Board</SegmentedControl.Item>
      </SegmentedControl>
    </div>
  ),
};

export const KeyboardSelectionInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const day = canvas.getByRole("radio", { name: "Day" });
    const week = canvas.getByRole("radio", { name: "Week" });
    const month = canvas.getByRole("radio", { name: "Month" });

    await userEvent.click(week);
    await expect(week).toHaveAttribute("aria-checked", "true");
    await expect(day).toHaveAttribute("aria-checked", "false");

    await userEvent.keyboard("{ArrowRight}");
    await expect(month).toHaveAttribute("aria-checked", "true");
    await expect(week).toHaveAttribute("aria-checked", "false");

    await userEvent.keyboard("{ArrowLeft}");
    await expect(week).toHaveAttribute("aria-checked", "true");
    await expect(month).toHaveAttribute("aria-checked", "false");
  },
};
