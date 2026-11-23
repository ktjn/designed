import { ColorSwatch } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof ColorSwatch> = {
  title: "ColorSwatch",
  component: ColorSwatch,
};

export default meta;
type Story = StoryObj<typeof ColorSwatch>;

export const Default: Story = {
  render: () => <ColorSwatch value="#2563eb" label="Brand blue" />,
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <ColorSwatch value="#16a34a" size="small" label="Small swatch" />
      <ColorSwatch value="#16a34a" size="medium" label="Medium swatch" />
      <ColorSwatch value="#16a34a" size="large" label="Large swatch" />
    </div>
  ),
};
