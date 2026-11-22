import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Toast, useToast } from "./toast";

function ToastDemo({ onUndo }: { onUndo?: () => void }) {
  const toast = useToast();
  return (
    <button
      type="button"
      onClick={() =>
        toast.add({
          title: "Settings saved",
          description: "Your preferences have been updated.",
          variant: "success",
          action: onUndo ? { label: "Undo", onClick: onUndo } : undefined,
        })
      }
    >
      Show toast
    </button>
  );
}

function UpdateDemo() {
  const toast = useToast();
  return (
    <button
      type="button"
      onClick={() => {
        const id = toast.add({ title: "Uploading..." });
        toast.update(id, { title: "Upload complete", variant: "success" });
      }}
    >
      Upload
    </button>
  );
}

function PromiseDemo() {
  const toast = useToast();
  return (
    <>
      <button
        type="button"
        onClick={() =>
          toast.promise(Promise.resolve("ok"), {
            loading: "Saving...",
            success: (result) => `Saved: ${result}`,
            error: "Save failed",
          })
        }
      >
        Save
      </button>
      <button
        type="button"
        onClick={() => {
          toast
            .promise(Promise.reject(new Error("nope")), {
              loading: "Saving...",
              success: "Saved",
              error: "Save failed",
            })
            .catch(() => {});
        }}
      >
        Save failing
      </button>
    </>
  );
}

function IconDemo() {
  const toast = useToast();
  return (
    <button
      type="button"
      onClick={() =>
        toast.add({
          title: "Heads up",
          icon: <span data-testid="toast-icon">!</span>,
        })
      }
    >
      Notify
    </button>
  );
}

describe("Toast", () => {
  it("adds and dismisses toasts via useToast", async () => {
    const user = userEvent.setup();
    const onUndo = vi.fn();
    render(
      <Toast.Provider>
        <ToastDemo onUndo={onUndo} />
      </Toast.Provider>,
    );

    await user.click(screen.getByRole("button", { name: "Show toast" }));
    expect(await screen.findByText("Settings saved")).toBeTruthy();
    expect(
      screen.getByText("Your preferences have been updated."),
    ).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Undo" }));
    expect(onUndo).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(screen.queryByText("Settings saved")).toBeNull();
  });

  it("updates an existing toast in place via useToast().update", async () => {
    const user = userEvent.setup();
    render(
      <Toast.Provider>
        <UpdateDemo />
      </Toast.Provider>,
    );
    await user.click(screen.getByRole("button", { name: "Upload" }));
    expect(await screen.findByText("Upload complete")).toBeTruthy();
    expect(screen.queryByText("Uploading...")).toBeNull();
  });

  it("resolves useToast().promise through loading, success, and error states", async () => {
    const user = userEvent.setup();
    render(
      <Toast.Provider>
        <PromiseDemo />
      </Toast.Provider>,
    );
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(await screen.findByText("Saved: ok")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Save failing" }));
    expect(await screen.findByText("Save failed")).toBeTruthy();
  });

  it("renders a custom icon slot and respects the viewport position prop", async () => {
    const user = userEvent.setup();
    render(
      <Toast.Provider position="top-start">
        <IconDemo />
      </Toast.Provider>,
    );
    await user.click(screen.getByRole("button", { name: "Notify" }));
    await screen.findByText("Heads up");
    expect(screen.getByTestId("toast-icon")).toBeTruthy();
    expect(
      document
        .querySelector('[data-slot="toast-viewport"]')
        ?.getAttribute("data-position"),
    ).toBe("top-start");
  });

  it("has no automatically detectable accessibility violations", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Toast.Provider>
        <ToastDemo />
      </Toast.Provider>,
    );
    await user.click(screen.getByRole("button", { name: "Show toast" }));
    await screen.findByText("Settings saved");
    expect(await axe(container)).toHaveNoViolations();
  });
});
