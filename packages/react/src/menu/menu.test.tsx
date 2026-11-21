import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Menu } from "./menu";

// See the comment in ../popover/popover.test.tsx: opening any Base UI
// floating-positioned popup (Popover/Tooltip/Menu) hangs indefinitely under
// jsdom. Open/close, keyboard-navigation, and axe coverage for Menu instead
// lives in Storybook interaction tests (apps/storybook/stories/menu.stories.tsx).
describe("Menu", () => {
  it("renders a closed trigger without mounting the menu popup", () => {
    render(
      <Menu>
        <Menu.Trigger>Options</Menu.Trigger>
        <Menu.Content>
          <Menu.Item>Edit</Menu.Item>
          <Menu.Item disabled>Delete</Menu.Item>
        </Menu.Content>
      </Menu>,
    );
    expect(screen.getByRole("button", { name: "Options" })).toBeTruthy();
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("exposes rich compound sub-parts and data-slot on trigger", () => {
    render(
      <Menu>
        <Menu.Trigger>View</Menu.Trigger>
        <Menu.Content>
          <Menu.Group>
            <Menu.GroupLabel>Display</Menu.GroupLabel>
            <Menu.CheckboxItem defaultChecked>
              Status bar <Menu.Shortcut>⌘B</Menu.Shortcut>
            </Menu.CheckboxItem>
          </Menu.Group>
          <Menu.Separator />
          <Menu.RadioGroup defaultValue="comfortable">
            <Menu.RadioItem value="comfortable">Comfortable</Menu.RadioItem>
            <Menu.RadioItem value="compact">Compact</Menu.RadioItem>
          </Menu.RadioGroup>
        </Menu.Content>
      </Menu>,
    );

    expect(
      screen.getByRole("button", { name: "View" }).getAttribute("data-slot"),
    ).toBe("menu-trigger");
  });
});
