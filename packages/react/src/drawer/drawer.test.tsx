import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "../button/button";
import { Drawer } from "./drawer";

function FocusManagedDrawer() {
  const initialRef = useRef<HTMLButtonElement>(null);
  const finalRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Drawer>
        <Drawer.Trigger>Open drawer</Drawer.Trigger>
        <Drawer.Content initialFocus={initialRef} finalFocus={finalRef}>
          <Drawer.Title>Filters</Drawer.Title>
          <Button>Reset</Button>
          <Button ref={initialRef}>Apply</Button>
          <Drawer.Close>Done</Drawer.Close>
        </Drawer.Content>
      </Drawer>
      <Button ref={finalRef}>After drawer</Button>
    </>
  );
}

function BasicDrawer({ side }: { side?: "right" | "left" | "bottom" }) {
  return (
    <Drawer>
      <Drawer.Trigger>Open drawer</Drawer.Trigger>
      <Drawer.Content side={side}>
        <Drawer.Title>Filters</Drawer.Title>
        <Drawer.Description>Refine search results.</Drawer.Description>
        <Drawer.Close>Done</Drawer.Close>
      </Drawer.Content>
    </Drawer>
  );
}

describe("Drawer", () => {
  it("opens on trigger click and closes via close button", async () => {
    const user = userEvent.setup();
    render(<BasicDrawer />);

    expect(screen.queryByRole("dialog")).toBeNull();
    await user.click(screen.getByRole("button", { name: "Open drawer" }));

    const dialog = await screen.findByRole("dialog", { name: "Filters" });
    expect(dialog).toBeTruthy();
    expect(screen.getByText("Refine search results.")).toBeTruthy();

    await user.click(screen.getByRole("button", { name: "Done" }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("supports left and bottom sides", async () => {
    const user = userEvent.setup();
    render(<BasicDrawer side="bottom" />);

    await user.click(screen.getByRole("button", { name: "Open drawer" }));
    const dialog = await screen.findByRole("dialog", { name: "Filters" });
    expect(dialog.getAttribute("data-side")).toBe("bottom");
  });

  it("moves initialFocus and finalFocus to caller-provided refs", async () => {
    const user = userEvent.setup();
    render(<FocusManagedDrawer />);

    await user.click(screen.getByRole("button", { name: "Open drawer" }));
    await screen.findByRole("dialog", { name: "Filters" });
    await waitFor(() => {
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "Apply" }),
      );
    });

    await user.click(screen.getByRole("button", { name: "Done" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
    await waitFor(() => {
      expect(document.activeElement).toBe(
        screen.getByRole("button", { name: "After drawer" }),
      );
    });
  });

  it("hides the corner close button when showCloseButton is false", async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <Drawer.Trigger>Open drawer</Drawer.Trigger>
        <Drawer.Content showCloseButton={false}>
          <Drawer.Title>Filters</Drawer.Title>
          <Drawer.Close>Done</Drawer.Close>
        </Drawer.Content>
      </Drawer>,
    );
    await user.click(screen.getByRole("button", { name: "Open drawer" }));
    await screen.findByRole("dialog", { name: "Filters" });
    expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
    expect(screen.getByRole("button", { name: "Done" })).toBeTruthy();
  });

  it("calls onOpenChangeComplete after the open transition finishes", async () => {
    const user = userEvent.setup();
    const onOpenChangeComplete = vi.fn();
    render(
      <Drawer onOpenChangeComplete={onOpenChangeComplete}>
        <Drawer.Trigger>Open drawer</Drawer.Trigger>
        <Drawer.Content>
          <Drawer.Title>Filters</Drawer.Title>
        </Drawer.Content>
      </Drawer>,
    );
    await user.click(screen.getByRole("button", { name: "Open drawer" }));
    await screen.findByRole("dialog", { name: "Filters" });
    await waitFor(() => {
      expect(onOpenChangeComplete).toHaveBeenCalledWith(true);
    });
  });

  it("has no automatically detectable accessibility violations when open", async () => {
    const user = userEvent.setup();
    const { container } = render(<BasicDrawer />);
    await user.click(screen.getByRole("button", { name: "Open drawer" }));
    await screen.findByRole("dialog", { name: "Filters" });
    expect(await axe(container)).toHaveNoViolations();
  });
});
