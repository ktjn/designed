import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { CommandPalette } from "./command-palette.js";

const COMMANDS = [
  { id: "new-file", label: "New File", group: "File", shortcut: "Ctrl+N" },
  {
    id: "open-settings",
    label: "Open Settings",
    group: "Preferences",
    keywords: ["config", "options"],
  },
  { id: "delete", label: "Delete Workspace", group: "Danger", disabled: true },
];

describe("CommandPalette", () => {
  it("filters commands and invokes onSelect on click or Enter", () => {
    const onSelect = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <CommandPalette
        open
        onOpenChange={onOpenChange}
        items={COMMANDS}
        onSelect={onSelect}
      />,
    );

    const input = screen.getByRole("combobox", { name: "Search commands" });
    fireEvent.change(input, { target: { value: "config" } });

    expect(screen.getByRole("option", { name: /Open Settings/ })).toBeTruthy();
    expect(screen.queryByRole("option", { name: /New File/ })).toBeNull();

    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "open-settings" }),
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("supports keyboard navigation and global shortcut when enabled", () => {
    const onOpenChange = vi.fn();

    render(
      <CommandPalette
        open={false}
        onOpenChange={onOpenChange}
        items={COMMANDS}
        enableGlobalShortcut
      />,
    );

    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("resets query and activeIndex when closed via global Cmd/Ctrl+K shortcut", () => {
    render(
      <CommandPalette items={COMMANDS} defaultOpen enableGlobalShortcut />,
    );

    const input = screen.getByRole("combobox", { name: "Search commands" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(
      screen.getAllByRole("option")[1]?.getAttribute("aria-selected"),
    ).toBe("true");

    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(screen.queryByRole("dialog")).toBeNull();

    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    const reopenedInput = screen.getByRole("combobox", {
      name: "Search commands",
    }) as HTMLInputElement;
    expect(reopenedInput.value).toBe("");
    const reopenedOptions = screen.getAllByRole("option");
    expect(reopenedOptions[0]?.getAttribute("aria-selected")).toBe("true");
    expect(reopenedOptions[1]?.getAttribute("aria-selected")).toBe("false");

    fireEvent.change(reopenedInput, { target: { value: "config" } });
    expect(reopenedInput.value).toBe("config");
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    fireEvent.keyDown(window, { key: "k", ctrlKey: true });
    expect(
      (
        screen.getByRole("combobox", {
          name: "Search commands",
        }) as HTMLInputElement
      ).value,
    ).toBe("");
  });

  it("resets query and activeIndex when closed via controlled open prop", () => {
    const { rerender } = render(<CommandPalette items={COMMANDS} open />);

    const input = screen.getByRole("combobox", { name: "Search commands" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(
      screen.getAllByRole("option")[1]?.getAttribute("aria-selected"),
    ).toBe("true");
    fireEvent.change(input, { target: { value: "e" } });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(
      screen.getAllByRole("option")[1]?.getAttribute("aria-selected"),
    ).toBe("true");

    rerender(<CommandPalette items={COMMANDS} open={false} />);
    rerender(<CommandPalette items={COMMANDS} open />);

    const reopenedInput = screen.getByRole("combobox", {
      name: "Search commands",
    }) as HTMLInputElement;
    expect(reopenedInput.value).toBe("");
    const reopenedOptions = screen.getAllByRole("option");
    expect(reopenedOptions[0]?.getAttribute("aria-selected")).toBe("true");
    expect(reopenedOptions[1]?.getAttribute("aria-selected")).toBe("false");
  });

  it("has no axe violations when open", async () => {
    const { container } = render(
      <CommandPalette open items={COMMANDS} title="Command palette" />,
    );

    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(await axe(container)).toHaveNoViolations();
  });
});
