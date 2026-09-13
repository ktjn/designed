import { AlertDialog } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";

const meta: Meta<typeof AlertDialog> = {
  title: "AlertDialog",
  component: AlertDialog,
};

export default meta;
type Story = StoryObj<typeof AlertDialog>;

export const Default: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialog.Trigger>Delete account</AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>Delete your account?</AlertDialog.Title>
        <AlertDialog.Description>
          This cannot be undone.
        </AlertDialog.Description>
        <AlertDialog.Close>Cancel</AlertDialog.Close>
      </AlertDialog.Content>
    </AlertDialog>
  ),
};
