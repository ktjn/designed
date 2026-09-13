import { RadioGroup } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

const meta: Meta<typeof RadioGroup> = {
  title: "RadioGroup",
  component: RadioGroup,
  args: {
    "aria-label": "Plan",
    onValueChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: (args) => (
    <RadioGroup {...args} defaultValue="basic">
      <RadioGroup.Item value="basic">Basic</RadioGroup.Item>
      <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
    </RadioGroup>
  ),
};

export const DisabledItem: Story = {
  render: (args) => (
    <RadioGroup {...args} defaultValue="basic">
      <RadioGroup.Item value="basic">Basic</RadioGroup.Item>
      <RadioGroup.Item value="pro" disabled>
        Pro (unavailable)
      </RadioGroup.Item>
    </RadioGroup>
  ),
};

export const SelectInteraction: Story = {
  render: (args) => (
    <RadioGroup {...args}>
      <RadioGroup.Item value="basic">Basic</RadioGroup.Item>
      <RadioGroup.Item value="pro">Pro</RadioGroup.Item>
    </RadioGroup>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText("Pro"));
    await expect(args.onValueChange).toHaveBeenCalledWith("pro");
  },
};
