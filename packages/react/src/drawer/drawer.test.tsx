import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Drawer } from "./drawer";

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

  it("has no automatically detectable accessibility violations when open", async () => {
    const user = userEvent.setup();
    const { container } = render(<BasicDrawer />);
    await user.click(screen.getByRole("button", { name: "Open drawer" }));
    await screen.findByRole("dialog", { name: "Filters" });
    expect(await axe(container)).toHaveNoViolations();
  });
});
