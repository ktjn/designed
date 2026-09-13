import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { AlertDialog } from "./alert-dialog";

function DestructiveAlertDialog() {
  return (
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
  );
}

describe("AlertDialog", () => {
  it("opens with role alertdialog, not the plain dialog role", async () => {
    const user = userEvent.setup();
    render(<DestructiveAlertDialog />);
    await user.click(screen.getByRole("button", { name: "Delete account" }));
    expect(await screen.findByRole("alertdialog")).toBeTruthy();
  });

  it("does not close on an outside press (alert dialogs require an explicit in-dialog choice)", async () => {
    const user = userEvent.setup();
    render(<DestructiveAlertDialog />);
    await user.click(screen.getByRole("button", { name: "Delete account" }));
    await screen.findByRole("alertdialog");

    await user.click(document.body);

    // Give any (incorrect) close animation a chance to complete before asserting.
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(screen.queryByRole("alertdialog")).toBeTruthy();
  });

  it("closes via an explicit action (Cancel)", async () => {
    const user = userEvent.setup();
    render(<DestructiveAlertDialog />);
    await user.click(screen.getByRole("button", { name: "Delete account" }));
    await screen.findByRole("alertdialog");

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).toBeNull();
    });
  });

  it("has no automatically detectable accessibility violations while open", async () => {
    const user = userEvent.setup();
    render(<DestructiveAlertDialog />);
    await user.click(screen.getByRole("button", { name: "Delete account" }));
    await screen.findByRole("alertdialog");
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
