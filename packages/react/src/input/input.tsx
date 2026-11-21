import type { ForwardedRef, InputHTMLAttributes } from "react";
import { forwardRef } from "react";
import { useFieldContext, useFieldControlId } from "../field/field-context.js";
import styles from "./input.module.css";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

function InputImpl(
  {
    invalid,
    disabled,
    id,
    className,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    ...rest
  }: InputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
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
      data-slot="input"
      id={resolvedId}
      disabled={resolvedDisabled}
      aria-describedby={ariaDescribedBy ?? field?.describedBy}
      aria-invalid={ariaInvalid ?? (resolvedInvalid || undefined)}
      className={classes}
      {...rest}
    />
  );
}

export const Input = forwardRef(InputImpl);
Input.displayName = "Input";
