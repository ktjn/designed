import type { LabelHTMLAttributes, ReactNode, Ref } from "react";
import { Checkbox, type CheckboxProps } from "../checkbox/checkbox.js";
import styles from "./checkbox-card.module.css";

export interface CheckboxCardProps
  extends Omit<LabelHTMLAttributes<HTMLLabelElement>, "onChange"> {
  ref?: Ref<HTMLLabelElement>;
  label: ReactNode;
  description?: ReactNode;
  checked?: CheckboxProps["checked"];
  defaultChecked?: CheckboxProps["defaultChecked"];
  onCheckedChange?: CheckboxProps["onCheckedChange"];
  disabled?: boolean;
  name?: string;
  value?: string;
  children?: ReactNode;
}

export function CheckboxCard({
  label,
  description,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  name,
  value,
  className,
  children,
  ...rest
}: CheckboxCardProps) {
  const classes = [styles.card, className].filter(Boolean).join(" ");
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: Checkbox renders a hidden native control nested inside its root; verified accessible by the axe test in checkbox-card.test.tsx.
    <label data-slot="checkbox-card" className={classes} {...rest}>
      <Checkbox
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        name={name}
        value={value}
        className={styles.checkbox}
      />
      <span data-slot="checkbox-card-body" className={styles.body}>
        <span data-slot="checkbox-card-label" className={styles.label}>
          {label}
        </span>
        {description != null ? (
          <span
            data-slot="checkbox-card-description"
            className={styles.description}
          >
            {description}
          </span>
        ) : null}
        {children}
      </span>
    </label>
  );
}
