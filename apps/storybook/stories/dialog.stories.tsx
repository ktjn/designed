import { Dialog } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof Dialog> = {
  title: "Dialog",
  component: Dialog,
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger>Delete</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Delete item?</Dialog.Title>
        <Dialog.Description>This cannot be undone.</Dialog.Description>
        <Dialog.Close>Cancel</Dialog.Close>
      </Dialog.Content>
    </Dialog>
  ),
};

export const OpenInteraction: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger>Delete</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Delete item?</Dialog.Title>
        <Dialog.Description>This cannot be undone.</Dialog.Description>
        <Dialog.Close>Cancel</Dialog.Close>
      </Dialog.Content>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Delete" }));
    await expect(within(document.body).getByRole("dialog")).toBeInTheDocument();
  },
};
