import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import type { ReactNode } from "react";
import { useFieldContext } from "../field/field-context.js";
import styles from "./radio-group.module.css";

export interface RadioGroupProps<Value = string> {
  name?: string;
  value?: Value;
  defaultValue?: Value;
  onValueChange?: (value: Value) => void;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  children?: ReactNode;
}

function RadioGroupRoot<Value = string>({
  onValueChange,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: RadioGroupProps<Value>) {
  const field = useFieldContext();
  return (
    <BaseRadioGroup
      aria-describedby={ariaDescribedBy ?? field?.describedBy}
      className={styles.root}
      onValueChange={(value) => onValueChange?.(value)}
      {...rest}
    />
  );
}

export interface RadioGroupItemProps<Value = string> {
  value: Value;
  disabled?: boolean;
  children?: ReactNode;
}

function RadioGroupItem<Value = string>({
  value,
  disabled,
  children,
}: RadioGroupItemProps<Value>) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: BaseRadio.Root renders a hidden native <input> nested inside its <span>; verified accessible by the axe test in radio-group.test.tsx.
    <label className={styles.item}>
      <BaseRadio.Root
        value={value}
        disabled={disabled}
        className={styles.radio}
      >
        <BaseRadio.Indicator className={styles.indicator} />
      </BaseRadio.Root>
      {children}
    </label>
  );
}

export const RadioGroup = Object.assign(RadioGroupRoot, {
  Item: RadioGroupItem,
});
