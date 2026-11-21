import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { CloseIcon, SearchIcon } from "@ktjn/design-icons";
import { type KeyboardEvent, useEffect, useId, useMemo, useState } from "react";
import { useDialogPortalContainer } from "../dialog/use-dialog-portal-container.js";
import { VisuallyHidden } from "../visually-hidden/visually-hidden.js";
import styles from "./command-palette.module.css";

export interface CommandPaletteItem {
  id: string;
  label: string;
  group?: string;
  keywords?: readonly string[];
  shortcut?: string;
  disabled?: boolean;
}

export interface CommandPaletteProps {
  items: readonly CommandPaletteItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (item: CommandPaletteItem) => void;
  title?: string;
  placeholder?: string;
  searchLabel?: string;
  emptyMessage?: string;
  closeLabel?: string;
  enableGlobalShortcut?: boolean;
}

function matchesQuery(item: CommandPaletteItem, normalizedQuery: string) {
  if (!normalizedQuery) {
    return true;
  }
  if (item.label.toLowerCase().includes(normalizedQuery)) {
    return true;
  }
  if (item.group?.toLowerCase().includes(normalizedQuery)) {
    return true;
  }
  return (
    item.keywords?.some((keyword) =>
      keyword.toLowerCase().includes(normalizedQuery),
    ) ?? false
  );
}

export function CommandPalette({
  items,
  open,
  defaultOpen = false,
  onOpenChange,
  onSelect,
  title = "Command palette",
  placeholder = "Type a command or search...",
  searchLabel = "Search commands",
  emptyMessage = "No matching commands",
  closeLabel = "Close",
  enableGlobalShortcut = false,
}: CommandPaletteProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const listboxId = useId();
  const { container, scopeRef } = useDialogPortalContainer();

  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : uncontrolledOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
    if (!next) {
      setQuery("");
      setActiveIndex(0);
    }
  };

  useEffect(() => {
    if (!enableGlobalShortcut) {
      return;
    }
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        const next = !currentOpen;
        if (!isControlled) {
          setUncontrolledOpen(next);
        }
        onOpenChange?.(next);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentOpen, enableGlobalShortcut, isControlled, onOpenChange]);

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return items.filter((item) => matchesQuery(item, normalized));
  }, [items, query]);

  const groupedSections = useMemo(() => {
    const groups = new Map<string, CommandPaletteItem[]>();
    for (const item of filteredItems) {
      const key = item.group ?? "";
      const bucket = groups.get(key);
      if (bucket) {
        bucket.push(item);
      } else {
        groups.set(key, [item]);
      }
    }
    return Array.from(groups.entries());
  }, [filteredItems]);

  const flatItems = useMemo(
    () => groupedSections.flatMap(([, bucket]) => bucket),
    [groupedSections],
  );

  const resolvedActiveIndex = useMemo(() => {
    if (flatItems.length === 0) {
      return -1;
    }
    if (
      activeIndex >= 0 &&
      activeIndex < flatItems.length &&
      !flatItems[activeIndex]?.disabled
    ) {
      return activeIndex;
    }
    return flatItems.findIndex((item) => !item.disabled);
  }, [activeIndex, flatItems]);

  const activeItem =
    resolvedActiveIndex >= 0 ? flatItems[resolvedActiveIndex] : undefined;

  const selectItem = (item: CommandPaletteItem) => {
    if (item.disabled) {
      return;
    }
    onSelect?.(item);
    setOpen(false);
  };

  const moveActive = (direction: 1 | -1) => {
    if (flatItems.length === 0) {
      return;
    }
    const start = Math.max(resolvedActiveIndex, 0);
    for (let step = 1; step <= flatItems.length; step += 1) {
      const candidate =
        (start + direction * step + flatItems.length) % flatItems.length;
      if (!flatItems[candidate]?.disabled) {
        setActiveIndex(candidate);
        return;
      }
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActive(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(-1);
    } else if (event.key === "Home") {
      event.preventDefault();
      const firstEnabled = flatItems.findIndex((item) => !item.disabled);
      if (firstEnabled >= 0) {
        setActiveIndex(firstEnabled);
      }
    } else if (event.key === "End") {
      event.preventDefault();
      for (let idx = flatItems.length - 1; idx >= 0; idx -= 1) {
        if (!flatItems[idx]?.disabled) {
          setActiveIndex(idx);
          break;
        }
      }
    } else if (event.key === "Enter" && activeItem) {
      event.preventDefault();
      selectItem(activeItem);
    }
  };

  return (
    <>
      <span hidden ref={scopeRef} />
      <BaseDialog.Root
        open={currentOpen}
        onOpenChange={(next) => setOpen(next)}
      >
        <BaseDialog.Portal container={container}>
          <BaseDialog.Backdrop className={styles.backdrop} />
          <BaseDialog.Popup
            data-slot="command-palette"
            className={styles.popup}
          >
            <VisuallyHidden>
              <BaseDialog.Title>{title}</BaseDialog.Title>
            </VisuallyHidden>
            <div className={styles.searchRow}>
              <SearchIcon aria-hidden className={styles.searchIcon} />
              <input
                data-slot="command-palette-input"
                type="text"
                role="combobox"
                aria-expanded={true}
                aria-controls={listboxId}
                aria-autocomplete="list"
                aria-label={searchLabel}
                aria-activedescendant={
                  activeItem ? `${listboxId}-${activeItem.id}` : undefined
                }
                value={query}
                placeholder={placeholder}
                className={styles.input}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleInputKeyDown}
              />
              <BaseDialog.Close
                aria-label={closeLabel}
                className={styles.closeButton}
              >
                <CloseIcon aria-hidden />
              </BaseDialog.Close>
            </div>
            <div
              data-slot="command-palette-list"
              id={listboxId}
              role="listbox"
              aria-label={title}
              className={styles.list}
            >
              {flatItems.length === 0 ? (
                <div className={styles.empty}>{emptyMessage}</div>
              ) : (
                groupedSections.map(([group, groupItems]) => (
                  <div key={group || "__ungrouped"} role="presentation">
                    {group ? (
                      <div className={styles.groupLabel} aria-hidden="true">
                        {group}
                      </div>
                    ) : null}
                    {groupItems.map((item) => {
                      const flatIndex = flatItems.findIndex(
                        (candidate) => candidate.id === item.id,
                      );
                      const isActive = flatIndex === resolvedActiveIndex;
                      return (
                        <div
                          key={item.id}
                          data-slot="command-palette-item"
                          id={`${listboxId}-${item.id}`}
                          role="option"
                          tabIndex={-1}
                          aria-selected={isActive}
                          aria-disabled={item.disabled || undefined}
                          data-active={isActive ? "true" : undefined}
                          className={styles.option}
                          onMouseEnter={() => {
                            if (!item.disabled) {
                              setActiveIndex(flatIndex);
                            }
                          }}
                          onClick={() => selectItem(item)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                              event.preventDefault();
                              selectItem(item);
                            }
                          }}
                        >
                          <span>{item.label}</span>
                          {item.shortcut ? (
                            <kbd className={styles.shortcut}>
                              {item.shortcut}
                            </kbd>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          </BaseDialog.Popup>
        </BaseDialog.Portal>
      </BaseDialog.Root>
    </>
  );
}
