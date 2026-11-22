import { ChevronRightIcon } from "@ktjn/designed-icons";
import type { HTMLAttributes, KeyboardEvent, ReactNode, Ref } from "react";
import { useRef, useState } from "react";
import styles from "./tree-view.module.css";

export interface TreeViewNode<T = unknown> {
  id: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  children?: readonly TreeViewNode<T>[];
  hasChildren?: boolean;
  data?: T;
}

export interface TreeViewProps<T = unknown>
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  ref?: Ref<HTMLDivElement>;
  items: readonly TreeViewNode<T>[];
  multiple?: boolean;
  selected?: readonly string[];
  defaultSelected?: readonly string[];
  onSelectedChange?: (selected: string[]) => void;
  expanded?: readonly string[];
  defaultExpanded?: readonly string[];
  onExpandedChange?: (expanded: string[]) => void;
  onLoadChildren?: (node: TreeViewNode<T>) => void;
  renderItem?: (node: TreeViewNode<T>) => ReactNode;
  getItemLabel?: (node: TreeViewNode<T>) => string;
}

interface FlatNode<T> {
  node: TreeViewNode<T>;
  level: number;
  parentId: string | null;
}

function defaultGetItemLabel(node: TreeViewNode): string {
  return typeof node.label === "string" ? node.label : String(node.label);
}

function flatten<T>(
  items: readonly TreeViewNode<T>[],
  expanded: ReadonlySet<string>,
  level: number,
  parentId: string | null,
  out: FlatNode<T>[],
): void {
  for (const node of items) {
    out.push({ node, level, parentId });
    if (node.children && expanded.has(node.id)) {
      flatten(node.children, expanded, level + 1, node.id, out);
    }
  }
}

export function TreeView<T = unknown>({
  ref,
  items,
  multiple = false,
  selected,
  defaultSelected = [],
  onSelectedChange,
  expanded,
  defaultExpanded = [],
  onExpandedChange,
  onLoadChildren,
  renderItem,
  getItemLabel = defaultGetItemLabel,
  className,
  ...rest
}: TreeViewProps<T>) {
  const [internalSelected, setInternalSelected] = useState<string[]>(
    Array.from(defaultSelected),
  );
  const currentSelected = selected ?? internalSelected;
  const [internalExpanded, setInternalExpanded] = useState<string[]>(
    Array.from(defaultExpanded),
  );
  const currentExpanded = expanded ?? internalExpanded;
  const expandedSet = new Set(currentExpanded);

  const flat: FlatNode<T>[] = [];
  flatten(items, expandedSet, 0, null, flat);
  const enabledFlat = flat.filter((entry) => !entry.node.disabled);

  const [activeId, setActiveId] = useState<string | undefined>(
    enabledFlat[0]?.node.id,
  );
  const effectiveActiveId = enabledFlat.some(
    (entry) => entry.node.id === activeId,
  )
    ? activeId
    : enabledFlat[0]?.node.id;

  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const typeaheadBuffer = useRef("");
  const typeaheadTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  function setExpanded(next: string[]) {
    if (expanded === undefined) {
      setInternalExpanded(next);
    }
    onExpandedChange?.(next);
  }

  function setSelected(next: string[]) {
    if (selected === undefined) {
      setInternalSelected(next);
    }
    onSelectedChange?.(next);
  }

  function toggleExpanded(node: TreeViewNode<T>) {
    const isExpanded = expandedSet.has(node.id);
    if (!isExpanded && node.hasChildren && !node.children) {
      onLoadChildren?.(node);
    }
    const next = isExpanded
      ? currentExpanded.filter((id) => id !== node.id)
      : [...currentExpanded, node.id];
    setExpanded(next);
  }

  function toggleSelected(node: TreeViewNode<T>) {
    if (node.disabled) return;
    if (multiple) {
      const next = currentSelected.includes(node.id)
        ? currentSelected.filter((id) => id !== node.id)
        : [...currentSelected, node.id];
      setSelected(next);
    } else {
      setSelected([node.id]);
    }
  }

  function focusItem(id: string) {
    setActiveId(id);
    itemRefs.current.get(id)?.focus();
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLDivElement>,
    entry: FlatNode<T>,
  ) {
    const index = enabledFlat.findIndex((e) => e.node.id === entry.node.id);
    const hasChildren = Boolean(
      entry.node.children?.length || entry.node.hasChildren,
    );
    const isExpanded = expandedSet.has(entry.node.id);

    switch (event.key) {
      case "ArrowDown": {
        event.preventDefault();
        const next = enabledFlat[index + 1];
        if (next) focusItem(next.node.id);
        break;
      }
      case "ArrowUp": {
        event.preventDefault();
        const prev = enabledFlat[index - 1];
        if (prev) focusItem(prev.node.id);
        break;
      }
      case "ArrowRight": {
        event.preventDefault();
        if (hasChildren && !isExpanded) {
          toggleExpanded(entry.node);
        } else if (hasChildren && isExpanded) {
          const next = enabledFlat[index + 1];
          if (next?.parentId === entry.node.id) focusItem(next.node.id);
        }
        break;
      }
      case "ArrowLeft": {
        event.preventDefault();
        if (hasChildren && isExpanded) {
          toggleExpanded(entry.node);
        } else if (entry.parentId) {
          focusItem(entry.parentId);
        }
        break;
      }
      case "Home": {
        event.preventDefault();
        const first = enabledFlat[0];
        if (first) focusItem(first.node.id);
        break;
      }
      case "End": {
        event.preventDefault();
        const last = enabledFlat[enabledFlat.length - 1];
        if (last) focusItem(last.node.id);
        break;
      }
      case "Enter":
      case " ": {
        event.preventDefault();
        toggleSelected(entry.node);
        if (hasChildren) toggleExpanded(entry.node);
        break;
      }
      default: {
        if (event.key.length === 1 && /\S/.test(event.key)) {
          typeaheadBuffer.current += event.key.toLowerCase();
          clearTimeout(typeaheadTimer.current);
          typeaheadTimer.current = setTimeout(() => {
            typeaheadBuffer.current = "";
          }, 500);
          const match = enabledFlat.find((e) =>
            getItemLabel(e.node)
              .toLowerCase()
              .startsWith(typeaheadBuffer.current),
          );
          if (match) focusItem(match.node.id);
        }
      }
    }
  }

  const classes = [styles.root, className].filter(Boolean).join(" ");

  return (
    <div
      ref={ref}
      role="tree"
      data-slot="tree-view"
      aria-multiselectable={multiple || undefined}
      className={classes}
      {...rest}
    >
      {flat.map((entry) => {
        const { node, level } = entry;
        const isExpanded = expandedSet.has(node.id);
        const hasChildren = Boolean(node.children?.length || node.hasChildren);
        const isSelected = currentSelected.includes(node.id);
        const isActive = node.id === effectiveActiveId;

        return (
          <div
            key={node.id}
            ref={(el) => {
              if (el) itemRefs.current.set(node.id, el);
              else itemRefs.current.delete(node.id);
            }}
            role="treeitem"
            data-slot="tree-view-item"
            id={`tree-item-${node.id}`}
            aria-level={level + 1}
            aria-expanded={hasChildren ? isExpanded : undefined}
            aria-selected={isSelected}
            aria-disabled={node.disabled || undefined}
            data-active={isActive ? "" : undefined}
            data-selected={isSelected ? "" : undefined}
            tabIndex={isActive && !node.disabled ? 0 : -1}
            style={{ "--level": level } as never}
            className={styles.item}
            onClick={() => {
              if (node.disabled) return;
              setActiveId(node.id);
              toggleSelected(node);
              if (hasChildren) toggleExpanded(node);
            }}
            onKeyDown={(event) => handleKeyDown(event, entry)}
          >
            {hasChildren ? (
              <button
                type="button"
                tabIndex={-1}
                aria-hidden="true"
                data-slot="tree-view-toggle"
                className={styles.toggle}
                onClick={(event) => {
                  event.stopPropagation();
                  toggleExpanded(node);
                }}
              >
                <ChevronRightIcon aria-hidden />
              </button>
            ) : (
              <span className={styles.togglePlaceholder} />
            )}
            {node.icon ? (
              <span data-slot="tree-view-item-icon" className={styles.icon}>
                {node.icon}
              </span>
            ) : null}
            <span data-slot="tree-view-item-label" className={styles.label}>
              {renderItem ? renderItem(node) : node.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
