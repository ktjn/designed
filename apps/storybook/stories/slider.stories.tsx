import { Slider } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof Slider> = {
  title: "Slider",
  component: Slider,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    "aria-label": "Volume",
    defaultValue: 50,
    min: 0,
    max: 100,
    step: 5,
  },
};

export const Range: Story = {
  args: {
    "aria-label": "Price range",
    defaultValue: [25, 75],
    min: 0,
    max: 100,
  },
};

export const KeyboardInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const slider = within(canvasElement).getByRole("slider", {
      name: "Volume",
    });
    slider.focus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(slider).toHaveAttribute("aria-valuenow", "55");
  },
};
