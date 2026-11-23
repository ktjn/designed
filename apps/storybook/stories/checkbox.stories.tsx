import { Checkbox } from "@ktjn/designed-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

const meta: Meta<typeof Checkbox> = {
  title: "Checkbox",
  component: Checkbox,
  args: {
    "aria-label": "Accept terms",
    onCheckedChange: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Unchecked: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const Indeterminate: Story = {
  args: { indeterminate: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
      <Checkbox aria-label="Small" size="small" />
      <Checkbox aria-label="Medium" size="medium" />
      <Checkbox aria-label="Large" size="large" />
    </div>
  ),
};

export const ToggleInteraction: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox");
    await userEvent.click(checkbox);
    await expect(args.onCheckedChange).toHaveBeenCalledWith(
      true,
      expect.anything(),
    );
    await userEvent.click(checkbox);
    await expect(args.onCheckedChange).toHaveBeenCalledWith(
      false,
      expect.anything(),
    );
  },
};
