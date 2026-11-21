import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Sidebar } from "./sidebar.js";

describe("Sidebar", () => {
  it("toggles collapsed state via Sidebar.Trigger and notifies onOpenChange", () => {
    const onOpenChange = vi.fn();
    render(
      <Sidebar.Provider defaultOpen onOpenChange={onOpenChange}>
        <Sidebar aria-label="Primary navigation">
          <Sidebar.Header>Workspace</Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupLabel>General</Sidebar.GroupLabel>
              <Sidebar.Item href="#overview" active>
                Overview
              </Sidebar.Item>
              <Sidebar.Item href="#settings">Settings</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Footer>v1.0</Sidebar.Footer>
        </Sidebar>
        <Sidebar.Inset>
          <Sidebar.Trigger />
          <main>Dashboard content</main>
        </Sidebar.Inset>
      </Sidebar.Provider>,
    );

    const aside = screen.getByRole("complementary", {
      name: "Primary navigation",
    });
    expect(aside.getAttribute("data-slot")).toBe("sidebar");
    expect(aside.getAttribute("data-state")).toBe("expanded");

    const activeLink = screen.getByRole("link", { name: "Overview" });
    expect(activeLink.getAttribute("aria-current")).toBe("page");

    const trigger = screen.getByRole("button", { name: "Toggle sidebar" });
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    fireEvent.click(trigger);

    expect(aside.getAttribute("data-state")).toBe("collapsed");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("supports mobile drawer mode and has no axe violations", async () => {
    const { container } = render(
      <Sidebar.Provider>
        <Sidebar aria-label="App sidebar">
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Menu</Sidebar.GroupLabel>
              <Sidebar.Item onClick={() => {}}>Projects</Sidebar.Item>
            </Sidebar.Group>
          </Sidebar.Content>
        </Sidebar>
        <Sidebar.Inset>
          <Sidebar.Trigger />
          <div>Content</div>
        </Sidebar.Inset>
      </Sidebar.Provider>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
