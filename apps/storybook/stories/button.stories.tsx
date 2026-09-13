import { Button } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";

const meta: Meta<typeof Button> = {
  title: "Button",
  component: Button,
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: "primary", children: "Save" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Cancel" },
};

export const Danger: Story = {
  args: { variant: "danger", children: "Delete" },
};

export const Disabled: Story = {
  args: { variant: "primary", children: "Save", disabled: true },
};

export const WithLongText: Story = {
  args: {
    variant: "primary",
    children: "Save and continue to the next step of the checkout process",
  },
};

export const ClickInteraction: Story = {
  args: { variant: "primary", children: "Save" },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Save" }));
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
