import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "../button/button";
import { Dialog } from "./dialog";

function ControlledDialog() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open externally</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Content>
          <Dialog.Title>Title</Dialog.Title>
        </Dialog.Content>
      </Dialog>
    </>
  );
}

function BasicDialog() {
  return (
    <Dialog>
      <Dialog.Trigger>Delete</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Delete item?</Dialog.Title>
        <Dialog.Description>This cannot be undone.</Dialog.Description>
        <Dialog.Close>Cancel</Dialog.Close>
      </Dialog.Content>
    </Dialog>
  );
}

function FocusManagedDialog() {
  const initialRef = useRef<HTMLButtonElement>(null);
  const finalRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Dialog>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Content initialFocus={initialRef} finalFocus={finalRef}>
          <Dialog.Title>Focus test</Dialog.Title>
          <Button>First button</Button>
          <Button ref={initialRef}>Preferred focus</Button>
          <Dialog.Close>Done</Dialog.Close>
        </Dialog.Content>
      </Dialog>
      <Button ref={finalRef}>Return target</Button>
    </>
  );
}

function CallbackFocusDialog() {
  const targetRef = useRef<HTMLButtonElement>(null);
  return (
    <Dialog>
      <Dialog.Trigger>Open callback</Dialog.Trigger>
      <Dialog.Content
        initialFocus={() => targetRef.current}
        finalFocus={() => {}}
      >
        <Dialog.Title>Callback focus</Dialog.Title>
        <Button>First</Button>
        <Button ref={targetRef}>Callback target</Button>
        <Dialog.Close>Done</Dialog.Close>
      </Dialog.Content>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("is closed by default and opens on trigger activation", async () => {
    const user = userEvent.setup();
    render(<BasicDialog />);
    expect(screen.queryByRole("dialog")).toBeNull();

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(await screen.findByRole("dialog")).toBeTruthy();
  });

  it("renders into a portal (outside the trigger's DOM subtree)", async () => {
    const user = userEvent.setup();
    const { container } = render(<BasicDialog />);
    await user.click(screen.getByRole("button", { name: "Delete" }));
    const dialog = await screen.findByRole("dialog");
    expect(container.contains(dialog)).toBe(false);
  });

  it("portals to document.body while stamping resolved nested theme attributes", async () => {
    const user = userEvent.setup();
    render(
      <div data-brand="editorial" data-color-scheme="dark">
        <div
          data-color-scheme="light"
          data-testid="nested-panel"
          style={{ overflow: "hidden" }}
        >
          <BasicDialog />
        </div>
      </div>,
    );

    const panel = screen.getByTestId("nested-panel");
    await user.click(screen.getByRole("button", { name: "Delete" }));
    const dialog = await screen.findByRole("dialog");
    expect(panel.contains(dialog)).toBe(false);
    const host = dialog.closest('[data-slot="portal-theme-scope"]');
    expect(host?.parentElement).toBe(document.body);
    expect(host?.getAttribute("data-brand")).toBe("editorial");
    expect(host?.getAttribute("data-color-scheme")).toBe("light");
  });

  it("exposes an accessible name and description via Title/Description", async () => {
    const user = userEvent.setup();
    render(<BasicDialog />);
    await user.click(screen.getByRole("button", { name: "Delete" }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog.getAttribute("aria-labelledby")).toBeTruthy();
    expect(dialog.getAttribute("aria-describedby")).toBeTruthy();
    expect(screen.getByText("Delete item?")).toBeTruthy();
  });

  it("moves focus inside the dialog when opened", async () => {
    const user = userEvent.setup();
    render(<BasicDialog />);
    await user.click(screen.getByRole("button", { name: "Delete" }));
    await screen.findByRole("dialog");
    await waitFor(() => {
      expect(document.activeElement?.closest('[role="dialog"]')).toBeTruthy();
    });
  });

  it("closes on Escape and restores focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<BasicDialog />);
    const trigger = screen.getByRole("button", { name: "Delete" });
    await user.click(trigger);
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
    await waitFor(() => {
      expect(document.activeElement).toBe(trigger);
    });
  });

  it("closes when Dialog.Close is activated", async () => {
    const user = userEvent.setup();
    render(<BasicDialog />);
    await user.click(screen.getByRole("button", { name: "Delete" }));
    await screen.findByRole("dialog");

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("supports controlled open state", async () => {
    const user = userEvent.setup();
    render(<ControlledDialog />);
    expect(screen.queryByRole("dialog")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Open externally" }));
    expect(await screen.findByRole("dialog")).toBeTruthy();
  });

  it("composes custom trigger and close elements via render without nested buttons", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <Dialog.Trigger
          render={<Button variant="primary">Delete account</Button>}
        />
        <Dialog.Content>
          <Dialog.Title>Delete account?</Dialog.Title>
          <Dialog.Close render={<Button variant="danger">Confirm</Button>} />
        </Dialog.Content>
      </Dialog>,
    );
    const trigger = screen.getByRole("button", { name: "Delete account" });
    expect(trigger.querySelector("button")).toBeNull();
    expect(trigger.className).toContain("primary");
    expect(trigger.className).not.toContain("secondary");

    await user.click(trigger);
    expect(await screen.findByRole("dialog")).toBeTruthy();

    const confirm = screen.getByRole("button", { name: "Confirm" });
    expect(confirm.querySelector("button")).toBeNull();
    expect(confirm.className).toContain("danger");
    await user.click(confirm);
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });

  it("moves initialFocus and finalFocus to caller-provided refs", async () => {
    const user = userEvent.setup();
    render(<FocusManagedDialog />);
    await user.click(screen.getByRole("button", { name: "Open" }));
    await screen.findByRole("dialog");
    await waitFor(() => {
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "Preferred focus" }),
      );
    });

    await user.click(screen.getByRole("button", { name: "Done" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
    await waitFor(() => {
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "Return target" }),
      );
    });
  });

  it("accepts boolean and callback forms for initialFocus and finalFocus", async () => {
    const user = userEvent.setup();
    render(<CallbackFocusDialog />);
    await user.click(screen.getByRole("button", { name: "Open callback" }));
    await screen.findByRole("dialog");
    await waitFor(() => {
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "Callback target" }),
      );
    });
  });

  it("exposes the change reason and a cancel() escape hatch on onOpenChange", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Dialog onOpenChange={onOpenChange}>
        <Dialog.Trigger>Delete</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Delete item?</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");
    const [, closeDetails] = onOpenChange.mock.calls.at(-1) ?? [];
    expect(closeDetails?.reason).toBe("escape-key");
    expect(typeof closeDetails?.cancel).toBe("function");
  });

  it("cancels the close when onOpenChange calls eventDetails.cancel()", async () => {
    const user = userEvent.setup();
    render(
      <Dialog
        onOpenChange={(next, eventDetails) => {
          if (!next) {
            eventDetails?.cancel();
          }
        }}
      >
        <Dialog.Trigger>Delete</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Delete item?</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("hides the corner close button when showCloseButton is false", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <Dialog.Trigger>Delete</Dialog.Trigger>
        <Dialog.Content showCloseButton={false}>
          <Dialog.Title>Delete item?</Dialog.Title>
          <Dialog.Close>Cancel</Dialog.Close>
        </Dialog.Content>
      </Dialog>,
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));
    await screen.findByRole("dialog");
    expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
  });

  it("applies backdropClassName to the backdrop element", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <Dialog.Trigger>Delete</Dialog.Trigger>
        <Dialog.Content backdropClassName="custom-backdrop">
          <Dialog.Title>Delete item?</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));
    await screen.findByRole("dialog");
    expect(document.querySelector(".custom-backdrop")).toBeTruthy();
  });

  it("calls onOpenChangeComplete after the open/close transition finishes", async () => {
    const user = userEvent.setup();
    const onOpenChangeComplete = vi.fn();
    render(
      <Dialog onOpenChangeComplete={onOpenChangeComplete}>
        <Dialog.Trigger>Delete</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Delete item?</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));
    await screen.findByRole("dialog");
    await waitFor(() => {
      expect(onOpenChangeComplete).toHaveBeenCalledWith(true);
    });
  });

  it("prevents outside-press dismissal when disablePointerDismissal is set", async () => {
    const user = userEvent.setup();
    render(
      <Dialog disablePointerDismissal modal={false}>
        <Dialog.Trigger>Delete</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Delete item?</Dialog.Title>
        </Dialog.Content>
      </Dialog>,
    );
    await user.click(screen.getByRole("button", { name: "Delete" }));
    await screen.findByRole("dialog");
    await user.click(document.body);
    expect(screen.getByRole("dialog")).toBeTruthy();
  });

  it("has no automatically detectable accessibility violations while open", async () => {
    const user = userEvent.setup();
    render(<BasicDialog />);
    await user.click(screen.getByRole("button", { name: "Delete" }));
    await screen.findByRole("dialog");
    expect(await axe(document.body)).toHaveNoViolations();
  });
});
