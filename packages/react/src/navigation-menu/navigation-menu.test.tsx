import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NavigationMenu } from "./navigation-menu";

// See ../menu/menu.test.tsx: opening any Base UI floating-positioned popup
// hangs indefinitely under jsdom. Open/close and keyboard-navigation
// coverage for NavigationMenu instead lives in Storybook interaction tests
// (apps/storybook/stories/navigation-menu.stories.tsx).
describe("NavigationMenu", () => {
  it("renders triggers and links without mounting the popup", () => {
    render(
      <NavigationMenu>
        <NavigationMenu.List>
          <NavigationMenu.Item value="products">
            <NavigationMenu.Trigger>Products</NavigationMenu.Trigger>
            <NavigationMenu.Content>Product links</NavigationMenu.Content>
          </NavigationMenu.Item>
          <NavigationMenu.Item>
            <NavigationMenu.Link href="/about">About</NavigationMenu.Link>
          </NavigationMenu.Item>
        </NavigationMenu.List>
        <NavigationMenu.Viewport />
      </NavigationMenu>,
    );
    expect(screen.getByRole("button", { name: "Products" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "About" })).toBeTruthy();
    expect(screen.queryByText("Product links")).toBeNull();
  });
});
