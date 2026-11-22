import type { ReactNode } from "react";
import {
  RadioGroup,
  type RadioGroupItemProps,
} from "../radio-group/radio-group.js";
import styles from "./radio-card.module.css";

export interface RadioCardProps<Value = string>
  extends RadioGroupItemProps<Value> {
  label: ReactNode;
  description?: ReactNode;
}

export function RadioCard<Value = string>({
  label,
  description,
  className,
  children,
  ...rest
}: RadioCardProps<Value>) {
  const classes = [styles.card, className].filter(Boolean).join(" ");
  return (
    <RadioGroup.Item data-slot="radio-card" className={classes} {...rest}>
      <span data-slot="radio-card-body" className={styles.body}>
        <span data-slot="radio-card-label" className={styles.label}>
          {label}
        </span>
        {description != null ? (
          <span
            data-slot="radio-card-description"
            className={styles.description}
          >
            {description}
          </span>
        ) : null}
        {children}
      </span>
    </RadioGroup.Item>
  );
}
