import type { ReactNode } from "react";
import styles from "./field.module.css";
import { useFieldContext } from "./field-context.js";

export interface FieldErrorProps {
  children?: ReactNode;
}

export function FieldError({ children }: FieldErrorProps) {
  const field = useFieldContext();
  if (!children) {
    return null;
  }
  return (
    <p id={field?.errorId} role="alert" className={styles.error}>
      {children}
    </p>
  );
}
