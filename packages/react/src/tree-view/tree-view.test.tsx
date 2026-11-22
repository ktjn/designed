import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { TreeView, type TreeViewNode } from "./tree-view";

const ITEMS: TreeViewNode[] = [
  {
    id: "src",
    label: "src",
    children: [
      { id: "index", label: "index.ts" },
      { id: "utils", label: "utils.ts" },
    ],
  },
  { id: "readme", label: "README.md" },
];

describe("TreeView", () => {
  it("renders a collapsed tree with correct ARIA roles and levels", () => {
    render(<TreeView items={ITEMS} />);
    expect(screen.getByRole("tree")).toBeTruthy();
    const items = screen.getAllByRole("treeitem");
    expect(items).toHaveLength(2);
    expect(items[0]?.getAttribute("aria-level")).toBe("1");
    expect(items[0]?.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByText("index.ts")).toBeNull();
  });

  it("expands a branch on click and reveals its children", async () => {
    const user = userEvent.setup();
    render(<TreeView items={ITEMS} />);
    await user.click(screen.getByText("src"));
    expect(screen.getByText("index.ts")).toBeTruthy();
    const child = screen.getByText("index.ts").closest('[role="treeitem"]');
    expect(child?.getAttribute("aria-level")).toBe("2");
  });

  it("expands via ArrowRight and collapses via ArrowLeft", async () => {
    const user = userEvent.setup();
    render(<TreeView items={ITEMS} />);
    const src = screen
      .getByText("src")
      .closest('[role="treeitem"]') as HTMLElement;
    src.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByText("index.ts")).toBeTruthy();
    await user.keyboard("{ArrowLeft}");
    expect(screen.queryByText("index.ts")).toBeNull();
  });

  it("moves the roving tabindex with ArrowDown/ArrowUp", async () => {
    const user = userEvent.setup();
    render(<TreeView items={ITEMS} />);
    const src = screen
      .getByText("src")
      .closest('[role="treeitem"]') as HTMLElement;
    const readme = screen
      .getByText("README.md")
      .closest('[role="treeitem"]') as HTMLElement;
    src.focus();
    expect(src.getAttribute("tabindex")).toBe("0");
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(readme);
    expect(src.getAttribute("tabindex")).toBe("-1");
    expect(readme.getAttribute("tabindex")).toBe("0");
  });

  it("selects an item on click and reports it via onSelectedChange", async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(<TreeView items={ITEMS} onSelectedChange={onSelectedChange} />);
    await user.click(screen.getByText("README.md"));
    expect(onSelectedChange).toHaveBeenCalledWith(["readme"]);
    expect(
      screen
        .getByText("README.md")
        .closest('[role="treeitem"]')
        ?.getAttribute("aria-selected"),
    ).toBe("true");
  });

  it("supports multiple selection", async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();
    render(
      <TreeView items={ITEMS} multiple onSelectedChange={onSelectedChange} />,
    );
    await user.click(screen.getByText("README.md"));
    await user.click(screen.getByText("src"));
    expect(onSelectedChange).toHaveBeenLastCalledWith(["readme", "src"]);
  });

  it("calls onLoadChildren the first time a lazy node is expanded", async () => {
    const user = userEvent.setup();
    const onLoadChildren = vi.fn();
    render(
      <TreeView
        items={[{ id: "lazy", label: "Lazy folder", hasChildren: true }]}
        onLoadChildren={onLoadChildren}
      />,
    );
    await user.click(screen.getByText("Lazy folder"));
    expect(onLoadChildren).toHaveBeenCalledTimes(1);
  });

  it("skips disabled items when navigating with arrow keys", async () => {
    const user = userEvent.setup();
    render(
      <TreeView
        items={[
          { id: "a", label: "A" },
          { id: "b", label: "B", disabled: true },
          { id: "c", label: "C" },
        ]}
      />,
    );
    const a = screen.getByText("A").closest('[role="treeitem"]') as HTMLElement;
    const c = screen.getByText("C").closest('[role="treeitem"]') as HTMLElement;
    a.focus();
    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(c);
  });

  it("has no automatically detectable accessibility violations", async () => {
    const { container } = render(<TreeView items={ITEMS} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
