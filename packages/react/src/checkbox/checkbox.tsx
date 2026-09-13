import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import type { ForwardedRef } from "react";
import { forwardRef } from "react";
import { useFieldContext } from "../field/field-context.js";
import styles from "./checkbox.module.css";

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  indeterminate?: boolean;
  name?: string;
  value?: string;
  id?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
}

function CheckboxImpl(
  {
    onCheckedChange,
    id,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    ...rest
  }: CheckboxProps,
  ref: ForwardedRef<HTMLElement>,
) {
  const field = useFieldContext();
  return (
    <BaseCheckbox.Root
      ref={ref}
      id={id ?? field?.controlId}
      aria-describedby={ariaDescribedBy ?? field?.describedBy}
      aria-invalid={ariaInvalid ?? (field?.invalid || undefined)}
      className={styles.root}
      onCheckedChange={(checked) => onCheckedChange?.(checked)}
      {...rest}
    >
      <BaseCheckbox.Indicator className={styles.indicator}>
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          focusable="false"
          className={styles.checkmark}
        >
          <path
            d="M3 8.5L6.5 12L13 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {/* Indeterminate gets its own dash glyph -- CSS toggles which of
            these two is visible via the indicator's data-indeterminate
            attribute. Previously both checked and indeterminate rendered
            the same checkmark, so the two states were visually identical. */}
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          focusable="false"
          className={styles.dash}
        >
          <path
            d="M3 8H13"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
}

export const Checkbox = forwardRef(CheckboxImpl);
Checkbox.displayName = "Checkbox";
