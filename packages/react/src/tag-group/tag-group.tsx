import { CloseIcon } from "@ktjn/designed-icons";
import {
  Children,
  createContext,
  type HTMLAttributes,
  isValidElement,
  type KeyboardEvent,
  type ReactNode,
  type Ref,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useI18nMessage } from "../designed-provider/i18n-provider.js";
import { useIconOverride } from "../designed-provider/icon-provider.js";
import type { TagVariant } from "../tag/tag.js";
import styles from "./tag-group.module.css";

export interface TagGroupRootProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  onRemove?: (value: string) => void;
  getRemoveLabel?: (label: string) => string;
  children?: ReactNode;
}

export interface TagGroupItemProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  value: string;
  variant?: TagVariant;
  removable?: boolean;
  onRemove?: () => void;
  removeLabel?: string;
  children?: ReactNode;
}

interface PendingRemovalFocus {
  removedId: string;
  candidates: string[];
}

interface TagGroupContextValue {
  onRemove?: (value: string) => void;
  getRemoveLabel: (label: string) => string;
  tabStopId: string | null;
  setActiveId: (id: string) => void;
  registerButton: (id: string, node: HTMLButtonElement) => () => void;
  handleButtonKeyDown: (
    event: KeyboardEvent<HTMLButtonElement>,
    id: string,
    triggerRemove: () => void,
  ) => void;
  requestRemove: (id: string, triggerRemove: () => void) => void;
}

const TagGroupContext = createContext<TagGroupContextValue | null>(null);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function defaultGetRemoveLabel(label: string): string {
  return `Remove ${label}`;
}

function attachRef<T>(ref: Ref<T> | undefined, node: T): () => void {
  if (!ref) return () => {};
  if (typeof ref === "function") {
    const cleanup = ref(node);
    return typeof cleanup === "function" ? cleanup : () => ref(null);
  }
  ref.current = node;
  return () => {
    ref.current = null;
  };
}

function isContainerRtl(container: HTMLElement | null): boolean {
  if (!container) return false;
  const direction = getComputedStyle(container).direction;
  if (direction === "rtl") return true;
  if (direction === "ltr") return false;
  return container.closest("[dir]")?.getAttribute("dir") === "rtl";
}

function areStringArraysEqual(a: readonly string[], b: readonly string[]) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function extractNodeText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractNodeText).join("");
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractNodeText(node.props.children);
  }
  let result = "";
  Children.forEach(node, (child) => {
    if (typeof child === "string" || typeof child === "number") {
      result += String(child);
    }
  });
  return result;
}

function TagGroupRoot({
  ref,
  onRemove,
  getRemoveLabel,
  className,
  children,
  ...rest
}: TagGroupRootProps) {
  const resolvedGetRemoveLabel = useI18nMessage(
    "getRemoveLabel",
    getRemoveLabel,
    defaultGetRemoveLabel,
  );
  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonToIdRef = useRef(new Map<HTMLButtonElement, string>());
  const idToButtonRef = useRef(new Map<string, HTMLButtonElement>());
  const pendingFocusRef = useRef<PendingRemovalFocus | null>(null);
  const isMountedRef = useRef(false);

  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  const [activeId, setActiveIdState] = useState<string | null>(null);

  const getDomOrderedEntries = useCallback(() => {
    const root = rootRef.current;
    if (!root) return [] as Array<{ id: string; button: HTMLButtonElement }>;
    const entries: Array<{ id: string; button: HTMLButtonElement }> = [];
    for (const button of root.querySelectorAll<HTMLButtonElement>(
      '[data-slot="tag-remove"]',
    )) {
      const id = buttonToIdRef.current.get(button);
      if (id !== undefined && !button.disabled) {
        entries.push({ id, button });
      }
    }
    return entries;
  }, []);

  const syncDomButtons = useCallback(() => {
    if (!isMountedRef.current) return;
    const entries = getDomOrderedEntries();
    const nextIds = entries.map((entry) => entry.id);

    setOrderedIds((prev) =>
      areStringArraysEqual(prev, nextIds) ? prev : nextIds,
    );

    const pending = pendingFocusRef.current;
    if (pending && !idToButtonRef.current.has(pending.removedId)) {
      pendingFocusRef.current = null;
      const targetId = pending.candidates.find((candidateId) =>
        nextIds.includes(candidateId),
      );
      if (targetId) {
        const targetButton = idToButtonRef.current.get(targetId);
        setActiveIdState(targetId);
        targetButton?.focus();
      }
    }
  }, [getDomOrderedEntries]);

  const syncDomButtonsRef = useRef(syncDomButtons);
  syncDomButtonsRef.current = syncDomButtons;

  useIsomorphicLayoutEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    syncDomButtons();
  }, [children, orderedIds, syncDomButtons]);

  const registerButton = useCallback((id: string, node: HTMLButtonElement) => {
    buttonToIdRef.current.set(node, id);
    idToButtonRef.current.set(id, node);
    syncDomButtonsRef.current();
    return () => {
      buttonToIdRef.current.delete(node);
      if (idToButtonRef.current.get(id) === node) {
        idToButtonRef.current.delete(id);
      }
      syncDomButtonsRef.current();
    };
  }, []);

  const setActiveId = useCallback((id: string) => {
    setActiveIdState(id);
  }, []);

  const requestRemove = useCallback(
    (id: string, triggerRemove: () => void) => {
      const entries = getDomOrderedEntries();
      const ids = entries.map((entry) => entry.id);
      const index = ids.indexOf(id);
      if (index !== -1) {
        const after = ids.slice(index + 1);
        const before = ids.slice(0, index).reverse();
        pendingFocusRef.current = {
          removedId: id,
          candidates: [...after, ...before],
        };
      }
      triggerRemove();
    },
    [getDomOrderedEntries],
  );

  const handleButtonKeyDown = useCallback(
    (
      event: KeyboardEvent<HTMLButtonElement>,
      id: string,
      triggerRemove: () => void,
    ) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;

      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        requestRemove(id, triggerRemove);
        return;
      }

      const entries = getDomOrderedEntries();
      if (entries.length === 0) return;

      const currentIndex = entries.findIndex(
        (entry) => entry.button === event.currentTarget,
      );
      const startIndex = currentIndex === -1 ? 0 : currentIndex;
      const rtl = isContainerRtl(rootRef.current);

      let nextIndex: number;
      switch (event.key) {
        case "ArrowRight":
          nextIndex =
            (startIndex + (rtl ? -1 : 1) + entries.length) % entries.length;
          break;
        case "ArrowLeft":
          nextIndex =
            (startIndex + (rtl ? 1 : -1) + entries.length) % entries.length;
          break;
        case "ArrowDown":
          nextIndex = (startIndex + 1) % entries.length;
          break;
        case "ArrowUp":
          nextIndex = (startIndex - 1 + entries.length) % entries.length;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = entries.length - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      pendingFocusRef.current = null;
      const target = entries[nextIndex];
      if (!target) return;
      setActiveIdState(target.id);
      target.button.focus();
    },
    [getDomOrderedEntries, requestRemove],
  );

  const tabStopId =
    activeId !== null && orderedIds.includes(activeId)
      ? activeId
      : (orderedIds[0] ?? null);

  const mergedRootRef = useMemo(() => {
    return (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (!node) return;
      const clearExternal = attachRef(ref, node);
      return () => {
        clearExternal();
        rootRef.current = null;
      };
    };
  }, [ref]);

  const contextValue = useMemo<TagGroupContextValue>(
    () => ({
      onRemove,
      getRemoveLabel: resolvedGetRemoveLabel,
      tabStopId,
      setActiveId,
      registerButton,
      handleButtonKeyDown,
      requestRemove,
    }),
    [
      resolvedGetRemoveLabel,
      handleButtonKeyDown,
      onRemove,
      registerButton,
      requestRemove,
      setActiveId,
      tabStopId,
    ],
  );

  const classes = [styles.root, className].filter(Boolean).join(" ");

  return (
    <TagGroupContext.Provider value={contextValue}>
      {/* biome-ignore lint/a11y/useSemanticElements: TagGroup renders a flex list container with role="list" to avoid default list styling semantics */}
      <div
        {...rest}
        ref={mergedRootRef}
        role="list"
        data-slot="tag-group"
        className={classes}
      >
        {children}
      </div>
    </TagGroupContext.Provider>
  );
}

function TagGroupItem({
  ref,
  value,
  variant = "neutral",
  removable,
  onRemove,
  removeLabel,
  className,
  children,
  ...rest
}: TagGroupItemProps) {
  const ctx = useContext(TagGroupContext);
  if (!ctx) {
    throw new Error("TagGroup.Item must be used within TagGroup");
  }

  const Icon = useIconOverride("close", CloseIcon);
  const itemId = useId();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { registerButton } = ctx;

  const isRemovable = removable ?? Boolean(onRemove || ctx.onRemove);

  useIsomorphicLayoutEffect(() => {
    if (!isRemovable) return;
    const node = buttonRef.current;
    if (!node) return;
    return registerButton(itemId, node);
  }, [isRemovable, itemId, registerButton]);

  const triggerRemove = useCallback(() => {
    if (onRemove) {
      onRemove();
    } else {
      ctx.onRemove?.(value);
    }
  }, [ctx, onRemove, value]);

  const labelText = extractNodeText(children).trim() || value;
  const resolvedRemoveLabel = removeLabel ?? ctx.getRemoveLabel(labelText);
  const tabIndex = ctx.tabStopId === itemId ? 0 : -1;

  const itemClasses = [styles.item, className].filter(Boolean).join(" ");
  const tagClasses = [styles.tag, styles[variant]].filter(Boolean).join(" ");

  return (
    // biome-ignore lint/a11y/useSemanticElements: TagGroup.Item pairs role="listitem" with TagGroup's role="list" container
    <div
      {...rest}
      ref={ref}
      role="listitem"
      data-slot="tag-group-item"
      className={itemClasses}
    >
      <span data-slot="tag" className={tagClasses}>
        <span data-slot="tag-label">{children}</span>
        {isRemovable ? (
          <button
            ref={buttonRef}
            type="button"
            data-slot="tag-remove"
            className={styles.remove}
            aria-label={resolvedRemoveLabel}
            tabIndex={tabIndex}
            onFocus={() => ctx.setActiveId(itemId)}
            onClick={() => ctx.requestRemove(itemId, triggerRemove)}
            onKeyDown={(event) =>
              ctx.handleButtonKeyDown(event, itemId, triggerRemove)
            }
          >
            <Icon aria-hidden />
          </button>
        ) : null}
      </span>
    </div>
  );
}

export const TagGroup = Object.assign(TagGroupRoot, {
  Item: TagGroupItem,
});
