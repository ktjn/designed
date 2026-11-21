import { Popover as BasePopover } from "@base-ui/react/popover";
import { ChevronDownIcon } from "@ktjn/design-icons";
import type { ForwardedRef, InputHTMLAttributes } from "react";
import { forwardRef, useState } from "react";
import { Calendar } from "../calendar/calendar.js";
import { useDialogPortalContainer } from "../dialog/use-dialog-portal-container.js";
import { useFieldContext } from "../field/field-context.js";
import styles from "./date-picker.module.css";

export interface DatePickerProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "defaultValue" | "onChange"
  > {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  min?: string;
  max?: string;
  locale?: string;
  invalid?: boolean;
  openCalendarLabel?: string;
}

function DatePickerImpl(
  {
    value,
    defaultValue = "",
    onValueChange,
    min,
    max,
    locale,
    invalid,
    disabled,
    placeholder = "YYYY-MM-DD",
    openCalendarLabel = "Choose date",
    id,
    className,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    ...rest
  }: DatePickerProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const field = useFieldContext();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const { container, scopeRef } = useDialogPortalContainer();

  const currentValue = value ?? internalValue;
  const resolvedInvalid = invalid ?? field?.invalid ?? false;
  const classes = [
    styles.root,
    resolvedInvalid ? styles.invalid : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  function updateValue(next: string) {
    if (value === undefined) {
      setInternalValue(next);
    }
    onValueChange?.(next);
  }

  return (
    <BasePopover.Root open={open} onOpenChange={setOpen}>
      <div className={classes}>
        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          id={id ?? field?.controlId}
          value={currentValue}
          disabled={disabled}
          placeholder={placeholder}
          aria-describedby={ariaDescribedBy ?? field?.describedBy}
          aria-invalid={ariaInvalid ?? (resolvedInvalid || undefined)}
          onChange={(event) => updateValue(event.target.value)}
          className={styles.input}
          {...rest}
        />
        <BasePopover.Trigger
          aria-label={openCalendarLabel}
          disabled={disabled}
          className={styles.trigger}
        >
          <ChevronDownIcon aria-hidden />
        </BasePopover.Trigger>
      </div>
      <span hidden ref={scopeRef} />
      <BasePopover.Portal container={container}>
        <BasePopover.Positioner side="bottom" align="end" sideOffset={6}>
          <BasePopover.Popup className={styles.popup}>
            <Calendar
              value={currentValue}
              min={min}
              max={max}
              locale={locale}
              disabled={disabled}
              onValueChange={(next) => {
                updateValue(next);
                setOpen(false);
              }}
            />
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}

export const DatePicker = forwardRef(DatePickerImpl);
DatePicker.displayName = "DatePicker";
