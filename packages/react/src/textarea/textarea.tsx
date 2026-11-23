import type { Ref, TextareaHTMLAttributes } from "react";
import { useFieldContext, useFieldControlId } from "../field/field-context.js";
import styles from "./textarea.module.css";

export type TextareaSize = "small" | "medium" | "large";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  ref?: Ref<HTMLTextAreaElement>;
  invalid?: boolean;
  size?: TextareaSize;
}

export function Textarea({
  ref,
  invalid,
  size = "medium",
  disabled,
  id,
  className,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...rest
}: TextareaProps) {
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
    <textarea
      ref={ref}
      data-slot="textarea"
      id={resolvedId}
      disabled={resolvedDisabled}
      aria-describedby={ariaDescribedBy ?? field?.describedBy}
      aria-invalid={ariaInvalid ?? (resolvedInvalid || undefined)}
      className={classes}
      {...rest}
    />
  );
}
