import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import type {
  HTMLAttributes,
  LabelHTMLAttributes,
  ReactNode,
  Ref,
} from "react";
import { useFieldContext } from "../field/field-context.js";
import styles from "./radio-group.module.css";

export interface RadioGroupProps<Value = string>
  extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  ref?: Ref<HTMLDivElement>;
  name?: string;
  value?: Value;
  defaultValue?: Value;
  onValueChange?: (value: Value) => void;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  children?: ReactNode;
}

function RadioGroupRoot<Value = string>({
  disabled,
  className,
  onValueChange,
  "aria-describedby": ariaDescribedBy,
  ...rest
}: RadioGroupProps<Value>) {
  const field = useFieldContext();
  return (
    <BaseRadioGroup
      data-slot="radio-group"
      disabled={disabled ?? field?.disabled}
      aria-describedby={ariaDescribedBy ?? field?.describedBy}
      className={className ? `${styles.root} ${className}` : styles.root}
      onValueChange={(value) => onValueChange?.(value)}
      {...rest}
    />
  );
}

export interface RadioGroupItemProps<Value = string>
  extends Omit<LabelHTMLAttributes<HTMLLabelElement>, "value"> {
  ref?: Ref<HTMLLabelElement>;
  value: Value;
  disabled?: boolean;
  children?: ReactNode;
}

function RadioGroupItem<Value = string>({
  value,
  disabled,
  className,
  children,
  ...rest
}: RadioGroupItemProps<Value>) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: BaseRadio.Root renders a hidden native <input> nested inside its <span>; verified accessible by the axe test in radio-group.test.tsx.
    <label
      data-slot="radio-group-item"
      className={className ? `${styles.item} ${className}` : styles.item}
      {...rest}
    >
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
