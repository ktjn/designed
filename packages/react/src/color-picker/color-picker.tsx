import {
  type HTMLAttributes,
  type KeyboardEvent,
  type Ref,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { ColorSwatch } from "../color-swatch/color-swatch.js";
import { useFieldContext, useFieldControlId } from "../field/field-context.js";
import {
  Popover,
  type PopoverAlign,
  type PopoverSide,
} from "../popover/popover.js";
import styles from "./color-picker.module.css";
import { isValidColor, normalizeToHex } from "./color-utils.js";

export interface ColorPickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  ref?: Ref<HTMLDivElement>;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  presets?: readonly string[];
  label?: string;
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
  side?: PopoverSide;
  sideOffset?: number;
  align?: PopoverAlign;
  alignOffset?: number;
  collisionPadding?: number | Partial<Record<PopoverSide, number>>;
}

function isContainerRtl(container: HTMLElement | null): boolean {
  if (!container) return false;
  const direction = getComputedStyle(container).direction;
  if (direction === "rtl") return true;
  if (direction === "ltr") return false;
  return container.closest("[dir]")?.getAttribute("dir") === "rtl";
}

const DEFAULT_COLOR = "#000000";

export function ColorPicker({
  ref,
  value,
  defaultValue,
  onValueChange,
  presets,
  label,
  invalid,
  disabled,
  id,
  side = "bottom",
  sideOffset,
  align,
  alignOffset,
  collisionPadding,
  className,
  "aria-describedby": ariaDescribedBy,
  "aria-label": ariaLabel,
  ...rest
}: ColorPickerProps) {
  const field = useFieldContext();
  const resolvedId = useFieldControlId(id);
  const resolvedInvalid = invalid ?? field?.invalid ?? false;
  const resolvedDisabled = disabled ?? field?.disabled ?? false;

  const presetsRootRef = useRef<HTMLDivElement | null>(null);
  const inputId = useId();

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(
    defaultValue ?? DEFAULT_COLOR,
  );
  const resolvedValue = isControlled ? value : internalValue;

  const [inputValue, setInputValue] = useState<string>(resolvedValue);
  const [inputInvalid, setInputInvalid] = useState(false);

  useEffect(() => {
    setInputValue(resolvedValue);
    setInputInvalid(false);
  }, [resolvedValue]);

  const commitValue = useCallback(
    (next: string) => {
      if (!isControlled) {
        setInternalValue(next);
      }
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const handlePresetKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const root = presetsRootRef.current;
      if (!root || !presets) return;

      const buttons = Array.from(
        root.querySelectorAll<HTMLButtonElement>(
          '[data-slot="color-picker-preset"]',
        ),
      );
      if (buttons.length === 0) return;

      const currentIndex = buttons.indexOf(event.currentTarget);
      const startIndex = currentIndex === -1 ? 0 : currentIndex;
      const rtl = isContainerRtl(root);

      let nextIndex: number;
      switch (event.key) {
        case "ArrowRight":
          nextIndex =
            (startIndex + (rtl ? -1 : 1) + buttons.length) % buttons.length;
          break;
        case "ArrowLeft":
          nextIndex =
            (startIndex + (rtl ? 1 : -1) + buttons.length) % buttons.length;
          break;
        case "ArrowDown":
          nextIndex = (startIndex + 1) % buttons.length;
          break;
        case "ArrowUp":
          nextIndex = (startIndex - 1 + buttons.length) % buttons.length;
          break;
        case "Home":
          nextIndex = 0;
          break;
        case "End":
          nextIndex = buttons.length - 1;
          break;
        default:
          return;
      }

      event.preventDefault();
      const targetButton = buttons[nextIndex];
      if (!targetButton) return;
      const targetValue = presets[nextIndex];
      targetButton.focus();
      if (targetValue !== undefined) {
        commitValue(targetValue);
        setInputValue(targetValue);
        setInputInvalid(false);
      }
    },
    [commitValue, presets],
  );

  const handlePresetClick = useCallback(
    (preset: string) => {
      commitValue(preset);
      setInputValue(preset);
      setInputInvalid(false);
    },
    [commitValue],
  );

  const commitInputValue = useCallback(() => {
    if (!isValidColor(inputValue)) {
      setInputInvalid(true);
      return;
    }
    const normalized = normalizeToHex(inputValue) ?? inputValue;
    setInputInvalid(false);
    setInputValue(normalized);
    commitValue(normalized);
  }, [commitValue, inputValue]);

  const resolvedAriaDescribedBy = ariaDescribedBy ?? field?.describedBy;
  const contentClasses = [styles.content, className].filter(Boolean).join(" ");

  return (
    <Popover>
      <Popover.Trigger
        render={
          <button
            type="button"
            disabled={resolvedDisabled}
            className={styles.trigger}
          />
        }
      >
        <ColorSwatch value={resolvedValue} label={label} />
      </Popover.Trigger>
      <Popover.Content
        ref={ref}
        data-slot="color-picker-content"
        aria-label={ariaLabel ?? label ?? "Color picker"}
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        className={contentClasses}
        {...rest}
      >
        {presets && presets.length > 0 ? (
          <div
            ref={presetsRootRef}
            role="radiogroup"
            aria-label="Preset colors"
            data-slot="color-picker-presets"
            className={styles.presets}
          >
            {presets.map((preset, index) => {
              const isSelected = preset === resolvedValue;
              const isTabStop =
                isSelected || (!presets.includes(resolvedValue) && index === 0);
              return (
                // biome-ignore lint/a11y/useSemanticElements: color-picker preset grid intentionally renders a button with role="radio" inside role="radiogroup", matching SegmentedControl's pattern.
                <button
                  key={preset}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  data-slot="color-picker-preset"
                  tabIndex={isTabStop ? 0 : -1}
                  className={styles.preset}
                  onClick={() => handlePresetClick(preset)}
                  onKeyDown={handlePresetKeyDown}
                >
                  <ColorSwatch value={preset} />
                </button>
              );
            })}
          </div>
        ) : null}
        <input
          id={resolvedId ?? inputId}
          type="text"
          data-slot="color-picker-input"
          className={styles.input}
          value={inputValue}
          disabled={resolvedDisabled}
          aria-label={field ? undefined : "Color value"}
          aria-invalid={inputInvalid || resolvedInvalid || undefined}
          aria-describedby={resolvedAriaDescribedBy}
          onChange={(event) => {
            setInputValue(event.target.value);
            setInputInvalid(false);
          }}
          onBlur={commitInputValue}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitInputValue();
            }
          }}
        />
      </Popover.Content>
    </Popover>
  );
}
