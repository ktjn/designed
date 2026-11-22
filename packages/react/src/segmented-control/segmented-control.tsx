import {
  type ButtonHTMLAttributes,
  Children,
  createContext,
  type HTMLAttributes,
  isValidElement,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./segmented-control.module.css";

export type SegmentedControlSize = "small" | "medium" | "large";

export interface SegmentedControlRootProps<Value extends string = string>
  extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  ref?: Ref<HTMLDivElement>;
  value?: Value;
  defaultValue?: Value;
  onValueChange?: (value: Value) => void;
  size?: SegmentedControlSize;
  fullWidth?: boolean;
  disabled?: boolean;
  children?: ReactNode;
}

export interface SegmentedControlItemProps<Value extends string = string>
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  ref?: Ref<HTMLButtonElement>;
  value: Value;
  icon?: ReactNode;
  disabled?: boolean;
  children?: ReactNode;
}

interface RegisteredItem {
  value: string;
  disabled: boolean;
}

interface SegmentedControlContextValue {
  selectedValue: string | undefined;
  tabStopValue: string | undefined;
  disabled: boolean;
  selectValue: (value: string) => void;
  registerItem: (
    node: HTMLButtonElement,
    value: string,
    disabled: boolean,
  ) => () => void;
  handleItemKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void;
}

const SegmentedControlContext =
  createContext<SegmentedControlContextValue | null>(null);

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

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

function hasRenderableNode(node: ReactNode): boolean {
  return (
    node !== null &&
    node !== undefined &&
    typeof node !== "boolean" &&
    node !== ""
  );
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

function collectEnabledItemValues(
  children: ReactNode,
  groupDisabled: boolean,
): string[] {
  if (groupDisabled) return [];
  const values: string[] = [];
  const visit = (node: ReactNode) => {
    Children.forEach(node, (child) => {
      if (!isValidElement(child)) return;
      if (child.type === SegmentedControlItem) {
        const props = child.props as SegmentedControlItemProps;
        if (!props.disabled && typeof props.value === "string") {
          values.push(props.value);
        }
        return;
      }
      const props = child.props as { children?: ReactNode };
      if (props.children !== undefined) {
        visit(props.children);
      }
    });
  };
  visit(children);
  return values;
}

function SegmentedControlRoot<Value extends string = string>({
  ref,
  value,
  defaultValue,
  onValueChange,
  size = "medium",
  fullWidth = false,
  disabled = false,
  "aria-disabled": ariaDisabled,
  className,
  children,
  ...rest
}: SegmentedControlRootProps<Value>) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const itemMapRef = useRef(new Map<HTMLButtonElement, RegisteredItem>());
  const hasInteractedRef = useRef(false);
  const hasInitializedDomRef = useRef(false);
  const isMountedRef = useRef(false);

  const staticEnabledValues = useMemo(
    () => collectEnabledItemValues(children, disabled),
    [children, disabled],
  );
  const [domEnabledValues, setDomEnabledValues] = useState<string[] | null>(
    null,
  );
  const enabledValues = disabled
    ? []
    : (domEnabledValues ?? staticEnabledValues);

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<
    string | undefined
  >(() => defaultValue ?? staticEnabledValues[0]);
  const selectedValue = isControlled ? value : uncontrolledValue;

  const tabStopValue =
    selectedValue !== undefined && enabledValues.includes(selectedValue)
      ? selectedValue
      : enabledValues[0];

  const syncDomEnabledValues = useCallback(
    (isInitialSync = false) => {
      if (!isMountedRef.current) return;
      const root = rootRef.current;
      if (!root) return;
      const nextEnabled: string[] = [];
      if (!disabled) {
        for (const button of root.querySelectorAll<HTMLButtonElement>(
          '[data-slot="segmented-control-item"]',
        )) {
          const entry = itemMapRef.current.get(button);
          if (entry !== undefined && !entry.disabled && !button.disabled) {
            nextEnabled.push(entry.value);
          }
        }
      }
      setDomEnabledValues((prev) =>
        prev !== null && areStringArraysEqual(prev, nextEnabled)
          ? prev
          : nextEnabled,
      );
      if (
        isInitialSync &&
        !isControlled &&
        defaultValue === undefined &&
        !hasInteractedRef.current
      ) {
        setUncontrolledValue(nextEnabled[0]);
      }
    },
    [defaultValue, disabled, isControlled],
  );

  const syncDomEnabledValuesRef = useRef(syncDomEnabledValues);
  syncDomEnabledValuesRef.current = syncDomEnabledValues;

  useIsomorphicLayoutEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    const isInitialSync = !hasInitializedDomRef.current;
    hasInitializedDomRef.current = true;
    syncDomEnabledValues(isInitialSync);
  }, [children, syncDomEnabledValues]);

  const registerItem = useCallback(
    (node: HTMLButtonElement, itemValue: string, itemDisabled: boolean) => {
      itemMapRef.current.set(node, {
        value: itemValue,
        disabled: itemDisabled,
      });
      if (hasInitializedDomRef.current) {
        syncDomEnabledValuesRef.current();
      }
      return () => {
        itemMapRef.current.delete(node);
        if (hasInitializedDomRef.current) {
          syncDomEnabledValuesRef.current();
        }
      };
    },
    [],
  );

  const selectValue = useCallback(
    (nextValue: string) => {
      if (disabled) return;
      if (nextValue === selectedValue) return;
      hasInteractedRef.current = true;
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }
      onValueChange?.(nextValue as Value);
    },
    [disabled, isControlled, onValueChange, selectedValue],
  );

  const handleItemKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled || event.altKey || event.ctrlKey || event.metaKey) return;
      const root = rootRef.current;
      if (!root) return;

      const enabledButtons = Array.from(
        root.querySelectorAll<HTMLButtonElement>(
          '[data-slot="segmented-control-item"]',
        ),
      ).filter((button) => {
        const entry = itemMapRef.current.get(button);
        return entry !== undefined && !entry.disabled && !button.disabled;
      });

      if (enabledButtons.length === 0) return;

      const currentIndex = enabledButtons.indexOf(event.currentTarget);
      const startIndex = currentIndex === -1 ? 0 : currentIndex;
      const rtl = isContainerRtl(root);

      let nextIndex: number;
      switch (event.key) {
        case "ArrowRight":
          nextIndex =
            (startIndex + (rtl ? -1 : 1) + enabledButtons.length) %
            enabledButtons.length;
          break;
        case "ArrowLeft":
          nextIndex =
            (startIndex + (rtl ? 1 : -1) + enabledButtons.length) %
            enabledButtons.length;
          break;
        case "ArrowDown":
          nextIndex = (startIndex + 1) % enabledButtons.length;
          break;
        case "ArrowUp":
          nextIndex =
            (startIndex - 1 + enabledButtons.length) % enabledButtons.length;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = enabledButtons.length - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      const targetButton = enabledButtons[nextIndex];
      if (!targetButton) return;
      const targetValue = itemMapRef.current.get(targetButton)?.value;
      targetButton.focus();
      if (targetValue !== undefined) {
        selectValue(targetValue);
      }
    },
    [disabled, selectValue],
  );

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

  const contextValue = useMemo<SegmentedControlContextValue>(
    () => ({
      selectedValue,
      tabStopValue,
      disabled,
      selectValue,
      registerItem,
      handleItemKeyDown,
    }),
    [
      disabled,
      handleItemKeyDown,
      registerItem,
      selectValue,
      selectedValue,
      tabStopValue,
    ],
  );

  const classes = [styles.root, className].filter(Boolean).join(" ");

  return (
    <SegmentedControlContext.Provider value={contextValue}>
      <div
        {...rest}
        ref={mergedRootRef}
        role="radiogroup"
        data-slot="segmented-control"
        data-size={size}
        data-full-width={fullWidth ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
        aria-disabled={disabled ? true : ariaDisabled}
        className={classes}
      >
        {children}
      </div>
    </SegmentedControlContext.Provider>
  );
}

function SegmentedControlItem<Value extends string = string>({
  ref,
  value,
  icon,
  disabled = false,
  type = "button",
  className,
  onClick,
  onKeyDown,
  children,
  ...rest
}: SegmentedControlItemProps<Value>) {
  const ctx = useContext(SegmentedControlContext);
  if (!ctx) {
    throw new Error(
      "SegmentedControl.Item must be used within SegmentedControl",
    );
  }

  const internalRef = useRef<HTMLButtonElement | null>(null);
  const { registerItem } = ctx;
  const isDisabled = ctx.disabled || disabled;

  useIsomorphicLayoutEffect(() => {
    const node = internalRef.current;
    if (!node) return;
    return registerItem(node, value, isDisabled);
  }, [isDisabled, registerItem, value]);

  const mergedItemRef = useMemo(() => {
    return (node: HTMLButtonElement | null) => {
      internalRef.current = node;
      if (!node) return;
      const clearExternal = attachRef(ref, node);
      return () => {
        clearExternal();
        internalRef.current = null;
      };
    };
  }, [ref]);

  const isSelected = ctx.selectedValue === value;
  const tabIndex = !isDisabled && ctx.tabStopValue === value ? 0 : -1;
  const classes = [styles.item, className].filter(Boolean).join(" ");

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (isDisabled) return;
    onClick?.(event);
    if (!event.defaultPrevented) {
      ctx.selectValue(value);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || isDisabled) return;
    ctx.handleItemKeyDown(event);
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: SegmentedControl.Item intentionally renders a button with role="radio" inside role="radiogroup" per WAI-ARIA radio group pattern.
    <button
      {...rest}
      ref={mergedItemRef}
      type={type}
      role="radio"
      data-slot="segmented-control-item"
      aria-checked={isSelected}
      data-selected={isSelected ? "" : undefined}
      data-disabled={isDisabled ? "" : undefined}
      disabled={isDisabled}
      tabIndex={tabIndex}
      className={classes}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {hasRenderableNode(icon) ? (
        <span
          data-slot="segmented-control-item-icon"
          className={styles.icon}
          aria-hidden="true"
        >
          {icon}
        </span>
      ) : null}
      {children}
    </button>
  );
}

export const SegmentedControl = Object.assign(SegmentedControlRoot, {
  Item: SegmentedControlItem,
});
