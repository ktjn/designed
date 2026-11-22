import { RadioCard, RadioGroup } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof RadioCard> = {
  title: "RadioCard",
  component: RadioCard,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 420 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof RadioCard>;

export const Default: Story = {
  render: () => (
    <RadioGroup aria-label="Plan" defaultValue="basic">
      <RadioCard
        value="basic"
        label="Basic"
        description="Essential features for individuals."
      />
      <RadioCard
        value="pro"
        label="Pro"
        description="Advanced collaboration for growing teams."
      />
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup aria-label="Plan" defaultValue="basic">
      <RadioCard
        value="basic"
        label="Basic"
        description="Current active plan."
      />
      <RadioCard
        value="enterprise"
        label="Enterprise"
        description="Contact sales to enable."
        disabled
      />
    </RadioGroup>
  ),
};

export const SelectInteraction: Story = {
  render: () => (
    <RadioGroup aria-label="Plan" defaultValue="basic">
      <RadioCard value="basic" label="Basic" description="For individuals." />
      <RadioCard value="pro" label="Pro" description="For teams." />
    </RadioGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const proRadio = canvas.getByRole("radio", { name: /Pro/ });
    await expect(proRadio).toHaveAttribute("aria-checked", "false");
    await userEvent.click(canvas.getByText("Pro"));
    await expect(proRadio).toHaveAttribute("aria-checked", "true");
  },
};
