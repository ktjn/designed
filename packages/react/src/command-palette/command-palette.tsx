import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { CloseIcon, SearchIcon } from "@ktjn/designed-icons";
import {
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { useI18nMessage } from "../designed-provider/i18n-provider.js";
import { useIconOverride } from "../designed-provider/icon-provider.js";
import {
  useDialogPortalContainer,
  usePortalActivity,
} from "../dialog/use-dialog-portal-container.js";
import { LiveRegion } from "../live-region/live-region.js";
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

export interface CommandPaletteProps<
  Item extends CommandPaletteItem = CommandPaletteItem,
> extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "title" | "onSelect" | "children"
  > {
  ref?: Ref<HTMLDivElement>;
  items: readonly Item[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  query?: string;
  onQueryChange?: (query: string) => void;
  filter?: ((item: Item, query: string) => boolean) | null;
  renderItem?: (item: Item) => ReactNode;
  onSelect?: (item: Item) => void;
  title?: string;
  placeholder?: string;
  searchLabel?: string;
  emptyMessage?: string;
  status?: { kind: "loading" | "error"; message: string };
  getResultsAnnouncement?: (count: number) => string;
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

export function CommandPalette<
  Item extends CommandPaletteItem = CommandPaletteItem,
>({
  items,
  open,
  defaultOpen = false,
  onOpenChange,
  query: controlledQuery,
  onQueryChange,
  filter,
  renderItem,
  onSelect,
  title = "Command palette",
  placeholder = "Type a command or search...",
  searchLabel = "Search commands",
  emptyMessage,
  status,
  getResultsAnnouncement,
  closeLabel,
  enableGlobalShortcut = false,
  className,
  ...rest
}: CommandPaletteProps<Item>) {
  const SearchFieldIcon = useIconOverride("search", SearchIcon);
  const CloseButtonIcon = useIconOverride("close", CloseIcon);
  const resolvedEmptyMessage = useI18nMessage(
    "empty",
    emptyMessage,
    "No matching commands",
  );
  const resolvedCloseLabel = useI18nMessage("close", closeLabel, "Close");
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [uncontrolledQuery, setUncontrolledQuery] = useState("");
  const [activeId, setActiveId] = useState<string>();
  const listboxId = useId();

  const isControlled = open !== undefined;
  const currentOpen = isControlled ? open : uncontrolledOpen;
  const query = controlledQuery ?? uncontrolledQuery;
  const [prevOpen, setPrevOpen] = useState(currentOpen);
  const [prevQuery, setPrevQuery] = useState(query);
  if (currentOpen !== prevOpen) {
    setPrevOpen(currentOpen);
    if (!currentOpen) {
      setUncontrolledQuery("");
      setActiveId(undefined);
      if (controlledQuery === undefined) {
        onQueryChange?.("");
      }
    }
  }
  if (query !== prevQuery) {
    setPrevQuery(query);
    setActiveId(undefined);
  }
  const activity = usePortalActivity(currentOpen);
  const { container, scopeRef } = useDialogPortalContainer(activity.active);

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(next);
      }
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  useEffect(() => {
    if (!enableGlobalShortcut) {
      return;
    }
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(!currentOpen);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentOpen, enableGlobalShortcut, setOpen]);

  const filteredItems = useMemo(() => {
    if (filter === null) return items;
    if (filter) return items.filter((item) => filter(item, query));
    const normalized = query.trim().toLowerCase();
    return items.filter((item) => matchesQuery(item, normalized));
  }, [filter, items, query]);

  const groupedSections = useMemo(() => {
    const groups = new Map<string, Item[]>();
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

  const activeIndex = flatItems.findIndex(
    (item) => item.id === activeId && !item.disabled,
  );
  if (activeId !== undefined && activeIndex === -1) {
    setActiveId(undefined);
  }
  const resolvedActiveIndex =
    activeIndex === -1
      ? flatItems.findIndex((item) => !item.disabled)
      : activeIndex;
  const activeItem = flatItems[resolvedActiveIndex];

  const selectItem = (item: Item) => {
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
      const item = flatItems[candidate];
      if (item && !item.disabled) {
        setActiveId(item.id);
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
      const firstEnabled = flatItems.find((item) => !item.disabled);
      if (firstEnabled) {
        setActiveId(firstEnabled.id);
      }
    } else if (event.key === "End") {
      event.preventDefault();
      for (let idx = flatItems.length - 1; idx >= 0; idx -= 1) {
        const item = flatItems[idx];
        if (item && !item.disabled) {
          setActiveId(item.id);
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
        onOpenChange={(next) => {
          activity.onOpenChange(next);
          setOpen(next);
        }}
        onOpenChangeComplete={activity.onOpenChangeComplete}
      >
        <BaseDialog.Portal container={container}>
          <BaseDialog.Backdrop className={styles.backdrop} />
          <BaseDialog.Popup
            data-slot="command-palette"
            className={
              className ? `${styles.popup} ${className}` : styles.popup
            }
            {...rest}
          >
            <VisuallyHidden>
              <BaseDialog.Title>{title}</BaseDialog.Title>
            </VisuallyHidden>
            <div className={styles.searchRow}>
              <SearchFieldIcon aria-hidden className={styles.searchIcon} />
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
                  const nextQuery = event.target.value;
                  if (controlledQuery === undefined) {
                    setUncontrolledQuery(nextQuery);
                  }
                  onQueryChange?.(nextQuery);
                }}
                onKeyDown={handleInputKeyDown}
              />
              <BaseDialog.Close
                aria-label={resolvedCloseLabel}
                className={styles.closeButton}
              >
                <CloseButtonIcon aria-hidden />
              </BaseDialog.Close>
            </div>
            {status ? (
              <div
                data-slot="command-palette-status"
                data-state={status.kind}
                className={styles.empty}
                aria-hidden="true"
              >
                {status.message}
              </div>
            ) : null}
            <LiveRegion>
              {status?.message ??
                getResultsAnnouncement?.(filteredItems.length)}
            </LiveRegion>
            <div
              data-slot="command-palette-list"
              id={listboxId}
              role="listbox"
              aria-label={title}
              className={styles.list}
            >
              {filteredItems.length === 0 && !status ? (
                <div className={styles.empty}>{resolvedEmptyMessage}</div>
              ) : (
                groupedSections.map(([group, groupItems]) => (
                  <div key={group || "__ungrouped"} role="presentation">
                    {group ? (
                      <div className={styles.groupLabel} aria-hidden="true">
                        {group}
                      </div>
                    ) : null}
                    {groupItems.map((item) => {
                      const isActive = item.id === activeItem?.id;
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
                              setActiveId(item.id);
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
                          {renderItem ? (
                            renderItem(item)
                          ) : (
                            <>
                              <span>{item.label}</span>
                              {item.shortcut ? (
                                <kbd className={styles.shortcut}>
                                  {item.shortcut}
                                </kbd>
                              ) : null}
                            </>
                          )}
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
