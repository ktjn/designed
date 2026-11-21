import { OTPField as BaseOTPField } from "@base-ui/react/otp-field";
import type { ForwardedRef, HTMLAttributes } from "react";
import { forwardRef, useId } from "react";
import { useFieldContext, useFieldControlId } from "../field/field-context.js";
import { VisuallyHidden } from "../visually-hidden/visually-hidden.js";
import styles from "./otp-field.module.css";

export interface OTPFieldProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "defaultValue" | "onChange" | "children"
  > {
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onValueComplete?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  mask?: boolean;
  invalid?: boolean;
  name?: string;
}

function OTPFieldImpl(
  {
    length = 6,
    value,
    defaultValue,
    onValueChange,
    onValueComplete,
    disabled,
    required,
    mask,
    invalid,
    name,
    id,
    className,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    ...rest
  }: OTPFieldProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const field = useFieldContext();
  const fieldControlId = useFieldControlId(id);
  const generatedId = useId();
  const resolvedId = fieldControlId ?? (ariaLabel ? generatedId : undefined);
  const resolvedInvalid = invalid ?? field?.invalid ?? false;
  const resolvedDisabled = disabled ?? field?.disabled ?? false;
  const slots = Array.from({ length }, (_, index) => index);
  const classes = [
    styles.root,
    resolvedInvalid ? styles.invalid : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {ariaLabel && !field ? (
        <VisuallyHidden>
          <label htmlFor={resolvedId}>{ariaLabel}</label>
        </VisuallyHidden>
      ) : null}
      <BaseOTPField.Root
        ref={ref}
        data-slot="otp-field"
        id={resolvedId}
        length={length}
        value={value}
        defaultValue={defaultValue}
        onValueChange={
          onValueChange ? (next) => onValueChange(next) : undefined
        }
        onValueComplete={
          onValueComplete ? (next) => onValueComplete(next) : undefined
        }
        disabled={resolvedDisabled}
        required={required}
        mask={mask}
        name={name}
        className={classes}
        {...rest}
      >
        {slots.map((slot) => (
          <BaseOTPField.Input
            key={`slot-${slot}`}
            data-slot="otp-field-input"
            aria-describedby={ariaDescribedBy ?? field?.describedBy}
            aria-invalid={ariaInvalid ?? (resolvedInvalid || undefined)}
            className={styles.input}
          />
        ))}
      </BaseOTPField.Root>
    </>
  );
}

export const OTPField = forwardRef(OTPFieldImpl);
OTPField.displayName = "OTPField";
