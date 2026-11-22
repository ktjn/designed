import { Switch as BaseSwitch } from "@base-ui/react/switch";
import type { HTMLAttributes, Ref } from "react";
import { useFieldContext, useFieldControlId } from "../field/field-context.js";
import styles from "./switch.module.css";

export interface SwitchProps
  extends Omit<HTMLAttributes<HTMLElement>, "defaultChecked" | "onChange"> {
  ref?: Ref<HTMLElement>;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  name?: string;
}

export function Switch({
  ref,
  onCheckedChange,
  disabled,
  id,
  className,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...rest
}: SwitchProps) {
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
