import { Dialog } from "@ktjn/designed-react";
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

export const ScopedTheme: Story = {
  render: () => (
    <div data-color-scheme="dark">
      <Dialog>
        <Dialog.Trigger>Edit details</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Edit details</Dialog.Title>
          <Dialog.Description>
            Update your account information.
          </Dialog.Description>
          <Dialog.Close>Cancel</Dialog.Close>
        </Dialog.Content>
      </Dialog>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Edit details" }));
    const dialog = await within(document.body).findByRole("dialog");
    await expect(dialog).toHaveStyle({ backgroundColor: "rgb(24, 24, 27)" });
    await expect(getComputedStyle(dialog).overflowY).toBe("auto");
  },
};
