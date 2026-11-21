import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { ContextMenu } from "./context-menu.js";

describe("ContextMenu", () => {
  it("renders trigger area while keeping menu closed by default", () => {
    render(
      <ContextMenu>
        <ContextMenu.Trigger>Right-click area</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Copy</ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item>Delete</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>,
    );

    expect(screen.getByText("Right-click area")).toBeTruthy();
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("has no axe violations in its closed state", async () => {
    const { container } = render(
      <ContextMenu>
        <ContextMenu.Trigger>Inspect target</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item>Rename</ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
