import { Switch as BaseSwitch } from "@base-ui/react/switch";
import type { ForwardedRef } from "react";
import { forwardRef } from "react";
import { useFieldContext, useFieldControlId } from "../field/field-context.js";
import styles from "./switch.module.css";

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  name?: string;
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
}

function SwitchImpl(
  {
    onCheckedChange,
    disabled,
    id,
    className,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    ...rest
  }: SwitchProps,
  ref: ForwardedRef<HTMLElement>,
) {
  const field = useFieldContext();
  const resolvedId = useFieldControlId(id);
  return (
    <BaseSwitch.Root
      ref={ref}
      data-slot="switch"
      id={resolvedId}
      disabled={disabled ?? field?.disabled}
      aria-describedby={ariaDescribedBy ?? field?.describedBy}
      aria-invalid={ariaInvalid ?? (field?.invalid || undefined)}
      className={className ? `${styles.root} ${className}` : styles.root}
      onCheckedChange={(checked) => onCheckedChange?.(checked)}
      {...rest}
    >
      <BaseSwitch.Thumb data-slot="switch-thumb" className={styles.thumb} />
    </BaseSwitch.Root>
  );
}

export const Switch = forwardRef(SwitchImpl);
Switch.displayName = "Switch";
