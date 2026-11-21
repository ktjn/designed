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
  parseIsoDate,
  type WeekdayIndex,
} from "../calendar/calendar.js";
import { useDialogPortalContainer } from "../dialog/use-dialog-portal-container.js";
import { useFieldContext, useFieldControlId } from "../field/field-context.js";
import styles from "./date-picker.module.css";

export interface DatePickerProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "defaultValue" | "onChange"
  > {
  ref?: Ref<HTMLInputElement>;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  min?: string;
  max?: string;
  locale?: string;
  weekStartsOn?: WeekdayIndex;
  invalid?: boolean;
  openCalendarLabel?: string;
}

function validateDateText(text: string, min?: string, max?: string): string {
  if (text === "") return "";
  if (!parseIsoDate(text)) {
    return "Enter a valid date (YYYY-MM-DD)";
  }
  if (min && text < min) {
    return `Date must be on or after ${min}`;
  }
  if (max && text > max) {
    return `Date must be on or before ${max}`;
  }
  return "";
}

export function DatePicker({
  ref,
  value,
  defaultValue = "",
  onValueChange,
  min,
  max,
  locale,
  weekStartsOn,
  invalid,
  disabled,
  readOnly,
  placeholder = "YYYY-MM-DD",
  openCalendarLabel = "Choose date",
  id,
  className,
  onBlur,
  onKeyDown,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...rest
}: DatePickerProps) {
  const field = useFieldContext();
  const resolvedId = useFieldControlId(id);
  const resolvedDisabled = disabled ?? field?.disabled ?? false;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [draft, setDraft] = useState(value ?? defaultValue);
  const [validationFailed, setValidationFailed] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { container, scopeRef } = useDialogPortalContainer();

  useEffect(() => {
    if (value !== undefined) {
      setDraft(value);
      setValidationFailed(false);
    }
  }, [value]);

  const validationMessage = validateDateText(draft, min, max);

  useLayoutEffect(() => {
    inputRef.current?.setCustomValidity(validationMessage);
  }, [validationMessage]);

  const resolvedInvalid =
    invalid ?? (field?.invalid || validationFailed || false);
  const classes = [
    styles.root,
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
    const error = validateDateText(next, min, max);
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
    const error = validateDateText(draft, min, max);
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

  return (
    <BasePopover.Root
      open={readOnly || resolvedDisabled ? false : open}
      onOpenChange={(next) => {
        if (readOnly || resolvedDisabled) {
          setOpen(false);
          return;
        }
        setOpen(next);
      }}
    >
      <div data-slot="date-picker" className={classes}>
        <input
          ref={assignRefs}
          data-slot="date-picker-input"
          type="text"
          inputMode="numeric"
          id={resolvedId}
          value={draft}
          disabled={resolvedDisabled}
          readOnly={readOnly}
          placeholder={placeholder}
          aria-describedby={ariaDescribedBy ?? field?.describedBy}
          aria-invalid={ariaInvalid ?? (resolvedInvalid || undefined)}
          onChange={(event) => handleTextChange(event.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={styles.input}
          {...rest}
        />
        <BasePopover.Trigger
          data-slot="date-picker-trigger"
          aria-label={openCalendarLabel}
          disabled={resolvedDisabled || Boolean(readOnly)}
          className={styles.trigger}
        >
          <CalendarIcon aria-hidden />
        </BasePopover.Trigger>
      </div>
      <span hidden ref={scopeRef} />
      <BasePopover.Portal container={container}>
        <BasePopover.Positioner side="bottom" align="end" sideOffset={6}>
          <BasePopover.Popup
            data-slot="date-picker-content"
            className={styles.popup}
          >
            <Calendar
              value={currentValidValue}
              min={min}
              max={max}
              locale={locale}
              weekStartsOn={weekStartsOn}
              disabled={resolvedDisabled || Boolean(readOnly)}
              onValueChange={(next) => {
                commitValidValue(next);
                setOpen(false);
              }}
            />
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}
