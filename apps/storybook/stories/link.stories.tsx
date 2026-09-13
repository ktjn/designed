import { Link } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof Link> = {
  title: "Link",
  component: Link,
};

export default meta;
type Story = StoryObj<typeof Link>;

export const Default: Story = {
  args: { href: "https://example.com", children: "Learn more" },
};

export const LongText: Story = {
  args: {
    href: "https://example.com",
    children: "Read the full documentation for this feature before continuing",
  },
};
