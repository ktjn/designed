import type { InputHTMLAttributes, Ref } from "react";
import { useFieldContext, useFieldControlId } from "../field/field-context.js";
import styles from "./time-picker.module.css";

export interface TimePickerProps
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
  step?: number;
  invalid?: boolean;
}

export function TimePicker({
  ref,
  value,
  defaultValue,
  onValueChange,
  min,
  max,
  step,
  invalid,
  disabled,
  id,
  className,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...rest
}: TimePickerProps) {
  const field = useFieldContext();
  const resolvedId = useFieldControlId(id);
  const resolvedInvalid = invalid ?? field?.invalid ?? false;
  const resolvedDisabled = disabled ?? field?.disabled ?? false;
  const classes = [
    styles.root,
    resolvedInvalid ? styles.invalid : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <input
      ref={ref}
      data-slot="time-picker"
      type="time"
      id={resolvedId}
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      step={step}
      disabled={resolvedDisabled}
      aria-describedby={ariaDescribedBy ?? field?.describedBy}
      aria-invalid={ariaInvalid ?? (resolvedInvalid || undefined)}
      onChange={
        onValueChange ? (event) => onValueChange(event.target.value) : undefined
      }
      className={classes}
      {...rest}
    />
  );
}
