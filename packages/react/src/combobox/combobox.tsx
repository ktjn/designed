import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import type { ReactNode } from "react";
import { useFieldContext } from "../field/field-context.js";
import styles from "./combobox.module.css";

export interface ComboboxRootProps<Value = unknown> {
  value?: Value;
  defaultValue?: Value;
  onValueChange?: (value: Value | null) => void;
  inputValue?: string;
  onInputValueChange?: (inputValue: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  children?: ReactNode;
}

function ComboboxRoot<Value = unknown>({
  onValueChange,
  onInputValueChange,
  ...rest
}: ComboboxRootProps<Value>) {
  return (
    <BaseCombobox.Root
      onValueChange={(value) => onValueChange?.(value)}
      onInputValueChange={(inputValue) => onInputValueChange?.(inputValue)}
      {...rest}
    />
  );
}

export interface ComboboxInputProps {
  id?: string;
  placeholder?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
}

function ComboboxInput({
  id,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...rest
}: ComboboxInputProps) {
  const field = useFieldContext();
  return (
    <BaseCombobox.Input
      id={id ?? field?.controlId}
      aria-describedby={ariaDescribedBy ?? field?.describedBy}
      aria-invalid={ariaInvalid ?? (field?.invalid || undefined)}
      className={styles.input}
      {...rest}
    />
  );
}

export interface ComboboxContentProps {
  children?: ReactNode;
  emptyMessage?: ReactNode;
}

function ComboboxContent({
  children,
  emptyMessage = "No results",
}: ComboboxContentProps) {
  return (
    <BaseCombobox.Portal>
      <BaseCombobox.Positioner sideOffset={4}>
        <BaseCombobox.Popup className={styles.popup}>
          <BaseCombobox.Empty className={styles.empty}>
            {emptyMessage}
          </BaseCombobox.Empty>
          <BaseCombobox.List>{children}</BaseCombobox.List>
        </BaseCombobox.Popup>
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  );
}

export interface ComboboxItemProps {
  value: unknown;
  children?: ReactNode;
}

function ComboboxItem({ children, ...rest }: ComboboxItemProps) {
  return (
    <BaseCombobox.Item className={styles.item} {...rest}>
      {children}
    </BaseCombobox.Item>
  );
}

export const Combobox = Object.assign(ComboboxRoot, {
  Input: ComboboxInput,
  Content: ComboboxContent,
  Item: ComboboxItem,
});
