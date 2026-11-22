import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import type { HTMLAttributes, Ref } from "react";
import { useFieldContext, useFieldControlId } from "../field/field-context.js";
import type { ChangeEventDetails } from "../shared/change-event-details.js";
import styles from "./checkbox.module.css";

export interface CheckboxProps
  extends Omit<HTMLAttributes<HTMLElement>, "defaultChecked" | "onChange"> {
  ref?: Ref<HTMLElement>;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (
    checked: boolean,
    eventDetails?: ChangeEventDetails,
  ) => void;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  indeterminate?: boolean;
  name?: string;
  value?: string;
  parent?: boolean;
}

export function Checkbox({
  ref,
  onCheckedChange,
  disabled,
  id,
  className,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...rest
}: CheckboxProps) {
  const field = useFieldContext();
  const resolvedId = useFieldControlId(id);
  return (
    <BaseCheckbox.Root
      ref={ref}
      data-slot="checkbox"
      id={resolvedId}
      disabled={disabled ?? field?.disabled}
      aria-describedby={ariaDescribedBy ?? field?.describedBy}
      aria-invalid={ariaInvalid ?? (field?.invalid || undefined)}
      className={className ? `${styles.root} ${className}` : styles.root}
      onCheckedChange={(checked, eventDetails) =>
        onCheckedChange?.(checked, eventDetails)
      }
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
