import type { ForwardedRef, TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";
import { useFieldContext } from "../field/field-context.js";
import styles from "./textarea.module.css";

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className"> {
  invalid?: boolean;
}

function TextareaImpl(
  {
    invalid,
    id,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    ...rest
  }: TextareaProps,
  ref: ForwardedRef<HTMLTextAreaElement>,
) {
  const field = useFieldContext();
  const resolvedInvalid = invalid ?? field?.invalid ?? false;
  return (
    <textarea
      ref={ref}
      id={id ?? field?.controlId}
      aria-describedby={ariaDescribedBy ?? field?.describedBy}
      aria-invalid={ariaInvalid ?? (resolvedInvalid || undefined)}
      className={
        resolvedInvalid ? `${styles.root} ${styles.invalid}` : styles.root
      }
      {...rest}
    />
  );
}

export const Textarea = forwardRef(TextareaImpl);
Textarea.displayName = "Textarea";
