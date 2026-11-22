import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { TagGroup } from "./tag-group.js";

function RemovableTagsHarness({
  initial = ["react", "typescript", "css"],
  dir,
  onRemoveSpy,
}: {
  initial?: string[];
  dir?: "ltr" | "rtl";
  onRemoveSpy?: (value: string) => void;
}) {
  const [tags, setTags] = useState(initial);

  return (
    <div dir={dir}>
      <TagGroup
        aria-label="Selected technologies"
        onRemove={(value) => {
          onRemoveSpy?.(value);
          setTags((prev) => prev.filter((item) => item !== value));
        }}
      >
        {tags.map((tag) => (
          <TagGroup.Item key={tag} value={tag}>
            {tag}
          </TagGroup.Item>
        ))}
      </TagGroup>
    </div>
  );
}

function WrappedItem({ value, label }: { value: string; label: string }) {
  return <TagGroup.Item value={value}>{label}</TagGroup.Item>;
}

describe("TagGroup", () => {
  it("renders list and listitem roles with expected data slots", () => {
    render(
      <TagGroup aria-label="Skills">
        <TagGroup.Item value="react" variant="info">
          React
        </TagGroup.Item>
        <TagGroup.Item value="a11y" variant="success">
          Accessibility
        </TagGroup.Item>
      </TagGroup>,
    );

    const list = screen.getByRole("list", { name: "Skills" });
    expect(list.dataset.slot).toBe("tag-group");

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]?.dataset.slot).toBe("tag-group-item");
    expect(items[0]?.querySelector('[data-slot="tag"]')).not.toBeNull();
    expect(
      items[0]?.querySelector('[data-slot="tag-label"]')?.textContent,
    ).toBe("React");
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("manages roving tabIndex across removable items including wrapped items", () => {
    render(
      <TagGroup aria-label="Tags" onRemove={vi.fn()}>
        <TagGroup.Item value="static" removable={false}>
          Static
        </TagGroup.Item>
        <WrappedItem value="first" label="First" />
        <WrappedItem value="second" label="Second" />
        <TagGroup.Item value="third">Third</TagGroup.Item>
      </TagGroup>,
    );

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
    expect(buttons[0]?.tabIndex).toBe(0);
    expect(buttons[1]?.tabIndex).toBe(-1);
    expect(buttons[2]?.tabIndex).toBe(-1);

    fireEvent.focus(buttons[1] as HTMLElement);
    expect(buttons[0]?.tabIndex).toBe(-1);
    expect(buttons[1]?.tabIndex).toBe(0);
    expect(buttons[2]?.tabIndex).toBe(-1);
  });

  it("navigates with Arrow keys, Home, and End with wrapping", async () => {
    const user = userEvent.setup();
    render(<RemovableTagsHarness />);

    const [first, second, third] = screen.getAllByRole("button");
    first?.focus();
    expect(document.activeElement).toBe(first);

    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(second);

    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(third);

    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(first);

    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(third);

    await user.keyboard("{ArrowUp}");
    expect(document.activeElement).toBe(second);

    await user.keyboard("{Home}");
    expect(document.activeElement).toBe(first);

    await user.keyboard("{End}");
    expect(document.activeElement).toBe(third);
  });

  it("inverts ArrowLeft and ArrowRight in RTL containers", async () => {
    const user = userEvent.setup();
    render(<RemovableTagsHarness dir="rtl" />);

    const [first, second, third] = screen.getAllByRole("button");
    first?.focus();

    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(second);

    await user.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(third);

    await user.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(second);
  });

  it("removes tags with Delete and Backspace and moves focus to surviving tag", async () => {
    const user = userEvent.setup();
    const onRemoveSpy = vi.fn();
    render(<RemovableTagsHarness onRemoveSpy={onRemoveSpy} />);

    const second = screen.getByRole("button", { name: "Remove typescript" });
    second.focus();

    await user.keyboard("{Delete}");
    expect(onRemoveSpy).toHaveBeenCalledWith("typescript");
    expect(screen.queryByText("typescript")).toBeNull();
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Remove css" }),
    );

    await user.keyboard("{Backspace}");
    expect(onRemoveSpy).toHaveBeenCalledWith("css");
    expect(screen.queryByText("css")).toBeNull();
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Remove react" }),
    );

    await user.keyboard("{Delete}");
    expect(onRemoveSpy).toHaveBeenCalledWith("react");
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("removes tag on click and focuses an adjacent surviving tag", async () => {
    const user = userEvent.setup();
    render(<RemovableTagsHarness />);

    await user.click(screen.getByRole("button", { name: "Remove react" }));
    expect(screen.queryByText("react")).toBeNull();
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Remove typescript" }),
    );

    await user.click(screen.getByRole("button", { name: "Remove css" }));
    expect(screen.queryByText("css")).toBeNull();
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: "Remove typescript" }),
    );
  });

  it("supports custom getRemoveLabel, item removeLabel, and item onRemove", async () => {
    const user = userEvent.setup();
    const itemRemove = vi.fn();
    const rootRemove = vi.fn();

    render(
      <TagGroup
        aria-label="Labels"
        onRemove={rootRemove}
        getRemoveLabel={(label) => `Delete ${label}`}
      >
        <TagGroup.Item value="a" onRemove={itemRemove} removeLabel="Clear A">
          Alpha
        </TagGroup.Item>
        <TagGroup.Item value="b">Beta</TagGroup.Item>
        <TagGroup.Item value="c" removable={false}>
          Gamma
        </TagGroup.Item>
      </TagGroup>,
    );

    await user.click(screen.getByRole("button", { name: "Clear A" }));
    expect(itemRemove).toHaveBeenCalledTimes(1);
    expect(rootRemove).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Delete Beta" }));
    expect(rootRemove).toHaveBeenCalledWith("b");
    expect(screen.queryByRole("button", { name: /Gamma/ })).toBeNull();
  });

  it("forwards refs on root and item", () => {
    const rootRef = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLDivElement>();

    render(
      <TagGroup ref={rootRef} aria-label="Refs">
        <TagGroup.Item ref={itemRef} value="one">
          One
        </TagGroup.Item>
      </TagGroup>,
    );

    expect(rootRef.current).toBeInstanceOf(HTMLDivElement);
    expect(rootRef.current?.dataset.slot).toBe("tag-group");
    expect(itemRef.current).toBeInstanceOf(HTMLDivElement);
    expect(itemRef.current?.dataset.slot).toBe("tag-group-item");
  });

  it("has no axe violations for removable and non-removable tags", async () => {
    const { container } = render(
      <TagGroup aria-label="Filters" onRemove={vi.fn()}>
        <TagGroup.Item value="design" variant="info">
          Design
        </TagGroup.Item>
        <TagGroup.Item value="locked" variant="neutral" removable={false}>
          Locked
        </TagGroup.Item>
        <TagGroup.Item value="tokens" variant="success">
          Tokens
        </TagGroup.Item>
      </TagGroup>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
