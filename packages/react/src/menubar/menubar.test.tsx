import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Menu } from "../menu/menu";
import { Menubar } from "./menubar";

// See ../menu/menu.test.tsx: opening any Base UI floating-positioned popup
// hangs indefinitely under jsdom. Open/close and keyboard-navigation
// coverage for Menubar instead lives in Storybook interaction tests
// (apps/storybook/stories/menubar.stories.tsx).
describe("Menubar", () => {
  it("renders Menu triggers as menubar items without mounting any popup", () => {
    render(
      <Menubar>
        <Menu>
          <Menu.Trigger>File</Menu.Trigger>
          <Menu.Content>
            <Menu.Item>New</Menu.Item>
          </Menu.Content>
        </Menu>
        <Menu>
          <Menu.Trigger>Edit</Menu.Trigger>
          <Menu.Content>
            <Menu.Item>Undo</Menu.Item>
          </Menu.Content>
        </Menu>
      </Menubar>,
    );
    expect(screen.getByRole("menuitem", { name: "File" })).toBeTruthy();
    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeTruthy();
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("exposes orientation as a data attribute", () => {
    render(
      <Menubar orientation="vertical">
        <Menu>
          <Menu.Trigger>File</Menu.Trigger>
          <Menu.Content>
            <Menu.Item>New</Menu.Item>
          </Menu.Content>
        </Menu>
      </Menubar>,
    );
    expect(
      screen
        .getByRole("menuitem", { name: "File" })
        .closest('[data-slot="menubar"]')
        ?.getAttribute("data-orientation"),
    ).toBe("vertical");
  });
});
