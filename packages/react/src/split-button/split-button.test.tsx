import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { Menu } from "../menu/menu";
import { SplitButton } from "./split-button";

// See ../menu/menu.test.tsx: opening any Base UI floating-positioned popup
// hangs indefinitely under jsdom. Open/close coverage for the menu half of
// SplitButton instead lives in Storybook interaction tests
// (apps/storybook/stories/split-button.stories.tsx).
describe("SplitButton", () => {
  it("fires the primary action on the main button", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <SplitButton
        onClick={onClick}
        menu={<Menu.Item>Save as draft</Menu.Item>}
      >
        Save
      </SplitButton>,
    );
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders the menu trigger with an accessible label without opening the menu", () => {
    render(
      <SplitButton menu={<Menu.Item>Save as draft</Menu.Item>}>
        Save
      </SplitButton>,
    );
    expect(screen.getByRole("button", { name: "More actions" })).toBeTruthy();
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(
      <SplitButton menu={<Menu.Item>Save as draft</Menu.Item>}>
        Save
      </SplitButton>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
