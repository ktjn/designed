import type { ReactNode } from "react";
import styles from "./field.module.css";
import { useFieldContext } from "./field-context.js";

export interface FieldDescriptionProps {
  children?: ReactNode;
}

export function FieldDescription({ children }: FieldDescriptionProps) {
  const field = useFieldContext();
  return (
    <p id={field?.descriptionId} className={styles.description}>
      {children}
    </p>
  );
}
