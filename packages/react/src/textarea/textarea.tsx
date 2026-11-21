import type { ForwardedRef, TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";
import { useFieldContext, useFieldControlId } from "../field/field-context.js";
import styles from "./textarea.module.css";

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

function TextareaImpl(
  {
    invalid,
    disabled,
    id,
    className,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    ...rest
  }: TextareaProps,
  ref: ForwardedRef<HTMLTextAreaElement>,
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

export const Textarea = forwardRef(TextareaImpl);
Textarea.displayName = "Textarea";
