import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import { MinusIcon, PlusIcon } from "@ktjn/designed-icons";
import type { HTMLAttributes, Ref } from "react";
import { useIconOverride } from "../designed-provider/icon-provider.js";
import { useFieldContext, useFieldControlId } from "../field/field-context.js";
import styles from "./number-field.module.css";

export type NumberFieldSize = "small" | "medium" | "large";

export interface NumberFieldProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "defaultValue" | "onChange" | "children"
  > {
  ref?: Ref<HTMLDivElement>;
  value?: number | null;
  defaultValue?: number;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  size?: NumberFieldSize;
  name?: string;
  placeholder?: string;
  decrementLabel?: string;
  incrementLabel?: string;
}

export function NumberField({
  ref,
  value,
  defaultValue,
  onValueChange,
  min,
  max,
  step = 1,
  disabled,
  readOnly,
  required,
  invalid,
  size = "medium",
  name,
  placeholder,
  decrementLabel = "Decrease",
  incrementLabel = "Increase",
  id,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...rest
}: NumberFieldProps) {
  const DecrementIcon = useIconOverride("minus", MinusIcon);
  const IncrementIcon = useIconOverride("plus", PlusIcon);
  const field = useFieldContext();
  const resolvedId = useFieldControlId(id);
  const resolvedInvalid = invalid ?? field?.invalid ?? false;
  const resolvedDisabled = disabled ?? field?.disabled ?? false;
  const classes = [
    styles.root,
    styles[size],
    resolvedInvalid ? styles.invalid : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <BaseNumberField.Root
      ref={ref}
      data-slot="number-field"
      id={resolvedId}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange ? (next) => onValueChange(next) : undefined}
      min={min}
      max={max}
      step={step}
      disabled={resolvedDisabled}
      readOnly={readOnly}
      required={required}
      name={name}
      className={classes}
      {...rest}
    >
      <BaseNumberField.Group
        data-slot="number-field-group"
        className={styles.group}
      >
        <BaseNumberField.Decrement
          data-slot="number-field-decrement"
          aria-label={decrementLabel}
          className={styles.button}
        >
          <DecrementIcon aria-hidden />
        </BaseNumberField.Decrement>
        <BaseNumberField.Input
          data-slot="number-field-input"
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy ?? field?.describedBy}
          aria-invalid={ariaInvalid ?? (resolvedInvalid || undefined)}
          className={styles.input}
        />
        <BaseNumberField.Increment
          data-slot="number-field-increment"
          aria-label={incrementLabel}
          className={styles.button}
        >
          <IncrementIcon aria-hidden />
        </BaseNumberField.Increment>
      </BaseNumberField.Group>
    </BaseNumberField.Root>
  );
}
