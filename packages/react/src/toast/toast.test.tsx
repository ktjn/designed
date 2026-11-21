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
