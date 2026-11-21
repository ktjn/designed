import { Drawer } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof Drawer> = {
  title: "Drawer",
  component: Drawer,
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Right: Story = {
  render: () => (
    <Drawer side="right">
      <Drawer.Trigger>Open right drawer</Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Title>Filters</Drawer.Title>
        <Drawer.Description>
          Narrow down results by status or date.
        </Drawer.Description>
        <Drawer.Close>Done</Drawer.Close>
      </Drawer.Content>
    </Drawer>
  ),
};

export const Bottom: Story = {
  render: () => (
    <Drawer side="bottom">
      <Drawer.Trigger>Open bottom sheet</Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Title>Quick actions</Drawer.Title>
        <Drawer.Description>Choose an action for this item.</Drawer.Description>
        <Drawer.Close>Close</Drawer.Close>
      </Drawer.Content>
    </Drawer>
  ),
};

export const OpenInteraction: Story = {
  ...Right,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Open right drawer" }),
    );
    await expect(
      await within(document.body).findByRole("dialog", { name: "Filters" }),
    ).toBeInTheDocument();
  },
};
