import { AlertDialog, Button } from "@ktjn/design-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";

const meta: Meta<typeof AlertDialog> = {
  title: "AlertDialog",
  component: AlertDialog,
};

export default meta;
type Story = StoryObj<typeof AlertDialog>;

function DeleteAccountExample() {
  const [open, setOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger>Delete account</AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title>Delete your account?</AlertDialog.Title>
        <AlertDialog.Description>
          This cannot be undone.
        </AlertDialog.Description>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            gap: "var(--ds-space-stack-sm)",
          }}
        >
          <AlertDialog.Close>Cancel</AlertDialog.Close>
          <Button
            variant="danger"
            onClick={() => {
              setDeleted(true);
              setOpen(false);
            }}
          >
            Delete account
          </Button>
        </div>
      </AlertDialog.Content>
      <p role="status">{deleted ? "Account deleted." : null}</p>
    </AlertDialog>
  );
}

export const Default: Story = {
  render: () => <DeleteAccountExample />,
};

export const ConfirmInteraction: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Delete account" }),
    );
    const dialog = await within(document.body).findByRole("alertdialog");
    const actions = within(dialog);
    await expect(
      actions.getByRole("button", { name: "Cancel" }),
    ).toBeInTheDocument();
    await userEvent.click(
      actions.getByRole("button", { name: "Delete account" }),
    );
    await expect(
      await canvas.findByText("Account deleted."),
    ).toBeInTheDocument();
  },
};
