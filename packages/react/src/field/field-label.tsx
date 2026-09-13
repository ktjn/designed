import type { LabelHTMLAttributes, ReactNode } from "react";
import styles from "./field.module.css";
import { useFieldContext } from "./field-context.js";

export interface FieldLabelProps
  extends Omit<LabelHTMLAttributes<HTMLLabelElement>, "htmlFor"> {
  children?: ReactNode;
}

export function FieldLabel({ children, className, ...rest }: FieldLabelProps) {
  const field = useFieldContext();
  return (
    <label
      htmlFor={field?.controlId}
      className={className ? `${styles.label} ${className}` : styles.label}
      {...rest}
    >
      {children}
    </label>
  );
}
