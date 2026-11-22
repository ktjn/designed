import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
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

function AsyncPalette({
  open,
  onQueryChange,
}: {
  open: boolean;
  onQueryChange: (query: string) => void;
}) {
  const [search, setSearch] = useState("");
  return (
    <CommandPalette
      items={search ? COMMANDS.slice(1) : COMMANDS}
      filter={null}
      open={open}
      onQueryChange={(next) => {
        setSearch(next);
        onQueryChange(next);
      }}
    />
  );
}

describe("CommandPalette", () => {
  it("requests a controlled query change and displays the updated prop", () => {
    const onQueryChange = vi.fn();
    const { rerender } = render(
      <CommandPalette
        items={COMMANDS}
        open
        query="config"
        onQueryChange={onQueryChange}
      />,
    );
    const input = screen.getByRole<HTMLInputElement>("combobox");
    expect(input.value).toBe("config");

    fireEvent.change(input, { target: { value: "new" } });
    expect(onQueryChange).toHaveBeenCalledExactlyOnceWith("new");
    expect(input.value).toBe("config");

    rerender(
      <CommandPalette
        items={COMMANDS}
        open
        query="new"
        onQueryChange={onQueryChange}
      />,
    );
    expect(input.value).toBe("new");
    expect(screen.getByRole("option", { name: /New File/ })).toBeTruthy();
    expect(screen.queryByRole("option", { name: "Open Settings" })).toBeNull();

    rerender(
      <CommandPalette
        items={COMMANDS}
        open={false}
        query="new"
        onQueryChange={onQueryChange}
      />,
    );
    rerender(
      <CommandPalette
        items={COMMANDS}
        open
        query="new"
        onQueryChange={onQueryChange}
      />,
    );
    expect(screen.getByRole<HTMLInputElement>("combobox").value).toBe("new");
    expect(onQueryChange).toHaveBeenCalledExactlyOnceWith("new");
  });

  it("emits one uncontrolled query reset on close so async results can reset", () => {
    const onQueryChange = vi.fn();

    const { rerender } = render(
      <AsyncPalette open onQueryChange={onQueryChange} />,
      { reactStrictMode: true },
    );
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "server query" },
    });
    expect(screen.queryByRole("option", { name: /New File/ })).toBeNull();

    rerender(<AsyncPalette open={false} onQueryChange={onQueryChange} />);
    rerender(<AsyncPalette open onQueryChange={onQueryChange} />);
    expect(screen.getByRole<HTMLInputElement>("combobox").value).toBe("");
    expect(screen.getByRole("option", { name: /New File/ })).toBeTruthy();
    expect(onQueryChange.mock.calls).toEqual([["server query"], [""]]);
  });

  it("uses replacement server results and keeps custom rows keyboard-selectable", () => {
    const onQueryChange = vi.fn();
    const onSelect = vi.fn();
    const results = [
      { id: "file", label: "Quarterly Report", kind: "File" },
      { id: "account", label: "Quarterly Report", kind: "Account" },
    ];
    const renderItem = (item: (typeof results)[number]) => (
      <span>
        {item.kind}: {item.label}
      </span>
    );
    const { rerender } = render(
      <CommandPalette
        open
        items={results}
        onQueryChange={onQueryChange}
        onSelect={onSelect}
        filter={null}
        renderItem={renderItem}
      />,
    );
    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "server search" } });
    expect(onQueryChange).toHaveBeenCalledExactlyOnceWith("server search");
    expect(screen.getByText("File: Quarterly Report")).toBeTruthy();
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(input.getAttribute("aria-activedescendant")).toBe(
      screen.getByRole("option", { name: "Account: Quarterly Report" }).id,
    );

    const replacement = [
      { id: "new-file", label: "Roadmap", kind: "File" },
      { id: "new-account", label: "Contoso", kind: "Account" },
    ];
    rerender(
      <CommandPalette
        open
        items={replacement}
        onQueryChange={onQueryChange}
        onSelect={onSelect}
        filter={null}
        renderItem={renderItem}
      />,
    );
    const option = screen.getByRole("option", { name: "File: Roadmap" });
    expect(option.textContent).toBe("File: Roadmap");
    expect(input.getAttribute("aria-activedescendant")).toBe(option.id);
    expect(
      screen.queryByRole("option", { name: "Account: Quarterly Report" }),
    ).toBeNull();
    fireEvent.keyDown(input, { key: "Enter" });
    expect(onSelect).toHaveBeenCalledExactlyOnceWith(replacement[0]);
  });

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
