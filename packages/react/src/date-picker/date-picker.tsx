import { Popover as BasePopover } from "@base-ui/react/popover";
import { CalendarIcon } from "@ktjn/designed-icons";
import type {
  FocusEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  Ref,
} from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Calendar,
  type CalendarMode,
  type CalendarRangeValue,
  parseIsoDate,
  type WeekdayIndex,
} from "../calendar/calendar.js";
import { useI18nMessage } from "../designed-provider/i18n-provider.js";
import { useIconOverride } from "../designed-provider/icon-provider.js";
import {
  useDialogPortalContainer,
  usePortalActivity,
} from "../dialog/use-dialog-portal-container.js";
import { useFieldContext, useFieldControlId } from "../field/field-context.js";
import styles from "./date-picker.module.css";

export type DatePickerSide = "top" | "right" | "bottom" | "left";
export type DatePickerAlign = "start" | "center" | "end";
export type DatePickerSize = "small" | "medium" | "large";

export interface DatePickerProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "defaultValue" | "onChange" | "size"
  > {
  ref?: Ref<HTMLInputElement>;
  mode?: CalendarMode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  rangeValue?: CalendarRangeValue | null;
  defaultRangeValue?: CalendarRangeValue;
  onRangeValueChange?: (value: CalendarRangeValue) => void;
  min?: string;
  max?: string;
  locale?: string;
  weekStartsOn?: WeekdayIndex;
  invalid?: boolean;
  size?: DatePickerSize;
  openCalendarLabel?: string;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
  isDateDisabled?: (isoDate: string) => boolean;
  formatValidationMessage?: (
    kind: "invalid" | "min" | "max",
    context: { min?: string; max?: string },
  ) => string;
  side?: DatePickerSide;
  sideOffset?: number;
  align?: DatePickerAlign;
  alignOffset?: number;
  collisionPadding?: number | Partial<Record<DatePickerSide, number>>;
}

function defaultFormatValidationMessage(
  kind: "invalid" | "min" | "max",
  { min, max }: { min?: string; max?: string },
): string {
  if (kind === "invalid") return "Enter a valid date (YYYY-MM-DD)";
  if (kind === "min") return `Date must be on or after ${min}`;
  return `Date must be on or before ${max}`;
}

function validateDateText(
  text: string,
  min: string | undefined,
  max: string | undefined,
  formatMessage: (
    kind: "invalid" | "min" | "max",
    context: { min?: string; max?: string },
  ) => string,
): string {
  if (text === "") return "";
  if (!parseIsoDate(text)) {
    return formatMessage("invalid", { min, max });
  }
  if (min && text < min) {
    return formatMessage("min", { min, max });
  }
  if (max && text > max) {
    return formatMessage("max", { min, max });
  }
  return "";
}

export function DatePicker({
  ref,
  mode = "single",
  value,
  defaultValue = "",
  onValueChange,
  rangeValue,
  defaultRangeValue,
  onRangeValueChange,
  min,
  max,
  locale,
  weekStartsOn,
  invalid,
  size = "medium",
  disabled,
  readOnly,
  placeholder = "YYYY-MM-DD",
  openCalendarLabel,
  previousMonthLabel,
  nextMonthLabel,
  isDateDisabled,
  formatValidationMessage = defaultFormatValidationMessage,
  side = "bottom",
  sideOffset = 6,
  align = "end",
  alignOffset,
  collisionPadding,
  id,
  className,
  onBlur,
  onKeyDown,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...rest
}: DatePickerProps) {
  const Icon = useIconOverride("calendar", CalendarIcon);
  const resolvedOpenCalendarLabel = useI18nMessage(
    "openCalendar",
    openCalendarLabel,
    "Choose date",
  );
  const resolvedPreviousMonthLabel = useI18nMessage(
    "previousMonth",
    previousMonthLabel,
    "Previous month",
  );
  const resolvedNextMonthLabel = useI18nMessage(
    "nextMonth",
    nextMonthLabel,
    "Next month",
  );
  const field = useFieldContext();
  const resolvedId = useFieldControlId(id);
  const resolvedDisabled = disabled ?? field?.disabled ?? false;
  const isRangeMode = mode === "range";
  const [internalRangeValue, setInternalRangeValue] =
    useState<CalendarRangeValue | null>(defaultRangeValue ?? null);
  const currentRangeValue = rangeValue ?? internalRangeValue;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [draft, setDraft] = useState(value ?? defaultValue);
  const [validationFailed, setValidationFailed] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const effectiveOpen = readOnly || resolvedDisabled ? false : open;
  const activity = usePortalActivity(effectiveOpen);
  const { container, scopeRef } = useDialogPortalContainer(activity.active);

  useEffect(() => {
    if (value !== undefined) {
      setDraft(value);
      setValidationFailed(false);
    }
  }, [value]);

  const validationMessage = validateDateText(
    draft,
    min,
    max,
    formatValidationMessage,
  );

  useLayoutEffect(() => {
    inputRef.current?.setCustomValidity(validationMessage);
  }, [validationMessage]);

  const resolvedInvalid =
    invalid ?? (field?.invalid || validationFailed || false);
  const classes = [
    styles.root,
    styles[size],
    resolvedInvalid ? styles.invalid : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  function assignRefs(node: HTMLInputElement | null) {
    inputRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }

  function commitValidValue(next: string) {
    if (readOnly || resolvedDisabled) return;
    if (value === undefined) {
      setInternalValue(next);
    }
    setDraft(next);
    setValidationFailed(false);
    onValueChange?.(next);
  }

  function handleTextChange(next: string) {
    if (readOnly || resolvedDisabled) return;
    setDraft(next);
    const error = validateDateText(next, min, max, formatValidationMessage);
    inputRef.current?.setCustomValidity(error);
    if (error === "") {
      setValidationFailed(false);
      if (value === undefined) {
        setInternalValue(next);
      }
      onValueChange?.(next);
    }
  }

  function handleCommit() {
    const error = validateDateText(draft, min, max, formatValidationMessage);
    inputRef.current?.setCustomValidity(error);
    setValidationFailed(error !== "");
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    handleCommit();
    onBlur?.(event);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleCommit();
    }
    onKeyDown?.(event);
  }

  const currentValidValue =
    validationMessage === "" ? draft : (value ?? internalValue);

  function commitRangeValue(next: CalendarRangeValue) {
    if (rangeValue === undefined) {
      setInternalRangeValue(next);
    }
    onRangeValueChange?.(next);
    if (next.end) {
      setOpen(false);
    }
  }

  const rangeDisplayValue = currentRangeValue
    ? currentRangeValue.end
      ? `${currentRangeValue.start} – ${currentRangeValue.end}`
      : currentRangeValue.start
    : "";

  return (
    <BasePopover.Root
      open={effectiveOpen}
      onOpenChange={(next) => {
        if (readOnly || resolvedDisabled) {
          setOpen(false);
          return;
        }
        activity.onOpenChange(next);
        setOpen(next);
      }}
      onOpenChangeComplete={activity.onOpenChangeComplete}
    >
      <div data-slot="date-picker" className={classes}>
        <input
          ref={assignRefs}
          data-slot="date-picker-input"
          type="text"
          inputMode={isRangeMode ? undefined : "numeric"}
          id={resolvedId}
          value={isRangeMode ? rangeDisplayValue : draft}
          disabled={resolvedDisabled}
          readOnly={isRangeMode || readOnly}
          placeholder={placeholder}
          aria-describedby={ariaDescribedBy ?? field?.describedBy}
          aria-invalid={ariaInvalid ?? (resolvedInvalid || undefined)}
          onChange={
            isRangeMode
              ? undefined
              : (event) => handleTextChange(event.target.value)
          }
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={styles.input}
          {...rest}
        />
        <BasePopover.Trigger
          data-slot="date-picker-trigger"
          aria-label={resolvedOpenCalendarLabel}
          disabled={resolvedDisabled || Boolean(readOnly)}
          className={styles.trigger}
        >
          <Icon aria-hidden />
        </BasePopover.Trigger>
      </div>
      <span hidden ref={scopeRef} />
      <BasePopover.Portal container={container}>
        <BasePopover.Positioner
          side={side}
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
          collisionPadding={collisionPadding}
          className={styles.positioner}
        >
          <BasePopover.Popup
            data-slot="date-picker-content"
            className={styles.popup}
          >
            {isRangeMode ? (
              <Calendar
                mode="range"
                rangeValue={currentRangeValue}
                min={min}
                max={max}
                isDateDisabled={isDateDisabled}
                locale={locale}
                weekStartsOn={weekStartsOn}
                disabled={resolvedDisabled || Boolean(readOnly)}
                previousMonthLabel={resolvedPreviousMonthLabel}
                nextMonthLabel={resolvedNextMonthLabel}
                onRangeValueChange={commitRangeValue}
              />
            ) : (
              <Calendar
                value={currentValidValue}
                min={min}
                max={max}
                isDateDisabled={isDateDisabled}
                locale={locale}
                weekStartsOn={weekStartsOn}
                disabled={resolvedDisabled || Boolean(readOnly)}
                previousMonthLabel={resolvedPreviousMonthLabel}
                nextMonthLabel={resolvedNextMonthLabel}
                onValueChange={(next) => {
                  commitValidValue(next);
                  setOpen(false);
                }}
              />
            )}
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}
