import type { InputHTMLAttributes, Ref } from "react";
import { useFieldContext, useFieldControlId } from "../field/field-context.js";
import styles from "./input.module.css";

export type InputSize = "small" | "medium" | "large";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  ref?: Ref<HTMLInputElement>;
  invalid?: boolean;
  size?: InputSize;
}

export function Input({
  ref,
  invalid,
  size = "medium",
  disabled,
  id,
  className,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...rest
}: InputProps) {
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
