import { Input } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Input> = {
  title: "Input",
  component: Input,
  args: {
    "aria-label": "Email",
  },
  // Input is width: 100% by design; constrain the canvas so the story
  // reflects realistic usage instead of stretching full-bleed.
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { placeholder: "you@example.com" },
};

export const Invalid: Story = {
  args: { placeholder: "you@example.com", invalid: true },
};

export const Disabled: Story = {
  args: { placeholder: "you@example.com", disabled: true },
};

export const WithValue: Story = {
  args: { defaultValue: "a@b.com" },
};
