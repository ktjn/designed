import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef } from "react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "../button/button";
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

function FocusManagedAlertDialog() {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const returnRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <AlertDialog>
        <AlertDialog.Trigger>Delete account</AlertDialog.Trigger>
        <AlertDialog.Content initialFocus={cancelRef} finalFocus={returnRef}>
          <AlertDialog.Title>Delete your account?</AlertDialog.Title>
          <Button variant="danger">Confirm delete</Button>
          <AlertDialog.Close render={<Button ref={cancelRef}>Cancel</Button>} />
        </AlertDialog.Content>
      </AlertDialog>
      <Button ref={returnRef}>After close</Button>
    </>
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

  it("moves initialFocus and finalFocus to caller-provided refs", async () => {
    const user = userEvent.setup();
    render(<FocusManagedAlertDialog />);
    await user.click(screen.getByRole("button", { name: "Delete account" }));
    await screen.findByRole("alertdialog");
    await waitFor(() => {
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "Cancel" }),
      );
    });

    await user.click(screen.getByRole("button", { name: "Cancel" }));
    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).toBeNull();
    });
    await waitFor(() => {
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "After close" }),
      );
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
