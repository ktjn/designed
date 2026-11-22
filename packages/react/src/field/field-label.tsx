import type { LabelHTMLAttributes, ReactNode, Ref } from "react";
import styles from "./field.module.css";
import { useFieldContext } from "./field-context.js";

export interface FieldLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  ref?: Ref<HTMLLabelElement>;
  children?: ReactNode;
}

export function FieldLabel({
  htmlFor,
  children,
  className,
  ...rest
}: FieldLabelProps) {
  const field = useFieldContext();
  return (
    <label
      data-slot="field-label"
      htmlFor={htmlFor ?? field?.controlId}
      className={className ? `${styles.label} ${className}` : styles.label}
      {...rest}
    >
      {children}
    </label>
  );
}
