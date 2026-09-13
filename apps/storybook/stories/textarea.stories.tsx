import { Textarea } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Textarea> = {
  title: "Textarea",
  component: Textarea,
  args: {
    "aria-label": "Message",
  },
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
