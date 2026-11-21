import { PlusIcon } from "@ktjn/designed-icons";
import { Button } from "@ktjn/designed-react";
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

export const Ghost: Story = {
  args: { variant: "ghost", children: "More actions" },
};

export const IconOnly: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <Button variant="primary" size="icon" aria-label="Add item">
        <PlusIcon aria-hidden />
      </Button>
      <Button variant="secondary" size="icon" aria-label="Add item secondary">
        <PlusIcon aria-hidden />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Add item ghost">
        <PlusIcon aria-hidden />
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  ),
};

export const Loading: Story = {
  args: { variant: "primary", loading: true, children: "Saving" },
};

export const WithIcon: Story = {
  render: () => (
    <Button variant="primary">
      <PlusIcon aria-hidden />
      New item
    </Button>
  ),
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
