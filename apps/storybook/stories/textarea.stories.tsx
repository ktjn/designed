import { Textarea } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Textarea> = {
  title: "Textarea",
  component: Textarea,
  args: {
    "aria-label": "Message",
  },
  // Textarea is width: 100% by design; constrain the canvas so the story
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
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
  args: { placeholder: "Type your message" },
};

export const Invalid: Story = {
  args: { placeholder: "Type your message", invalid: true },
};

export const Disabled: Story = {
  args: { placeholder: "Type your message", disabled: true },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <Textarea aria-label="Small" size="small" placeholder="Small" />
      <Textarea aria-label="Medium" size="medium" placeholder="Medium" />
      <Textarea aria-label="Large" size="large" placeholder="Large" />
    </div>
  ),
};
