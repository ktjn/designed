import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import type { ReactNode } from "react";
import { useFieldContext } from "../field/field-context.js";
import styles from "./combobox.module.css";

export interface ComboboxItem<Value> {
  label: string;
  value: Value;
}

export interface ComboboxRootProps<Value = unknown> {
  value?: Value;
  defaultValue?: Value;
  onValueChange?: (value: Value | null) => void;
  inputValue?: string;
  onInputValueChange?: (inputValue: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  /**
   * The full list of selectable items. Base UI's filtering-as-you-type and
   * its built-in empty state (`Combobox.Content`'s "no results" message)
   * are entirely items-array driven -- without this, every item is treated
   * as filtered out regardless of what's typed, and the empty message
   * shows permanently. Found via a real-browser Storybook review: the
   * input never filtered anything and "No results" rendered even when
   * matching items existed.
   */
  items: ReadonlyArray<ComboboxItem<Value>>;
  children?: ReactNode;
}

function ComboboxRoot<Value = unknown>({
  value,
  defaultValue,
  onValueChange,
  onInputValueChange,
  items,
  ...rest
}: ComboboxRootProps<Value>) {
  const findItem = (itemValue: Value | undefined) =>
    items.find((item) => item.value === itemValue) ?? null;

  return (
    <BaseCombobox.Root
      items={items}
      itemToStringLabel={(item: ComboboxItem<Value>) => item.label}
      itemToStringValue={(item: ComboboxItem<Value>) => String(item.value)}
      isItemEqualToValue={(
        item: ComboboxItem<Value>,
        other: ComboboxItem<Value>,
      ) => item.value === other.value}
      value={value !== undefined ? findItem(value) : undefined}
      defaultValue={
        defaultValue !== undefined ? findItem(defaultValue) : undefined
      }
      onValueChange={(item: ComboboxItem<Value> | null) =>
        onValueChange?.(item ? item.value : null)
      }
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
      data-slot="combobox-input"
      id={id ?? field?.controlId}
      aria-describedby={ariaDescribedBy ?? field?.describedBy}
      aria-invalid={ariaInvalid ?? (field?.invalid || undefined)}
      className={styles.input}
      {...rest}
    />
  );
}

export interface ComboboxContentProps {
  emptyMessage?: ReactNode;
}

function ComboboxContent({
  emptyMessage = "No results",
}: ComboboxContentProps) {
  return (
    <BaseCombobox.Portal>
      <BaseCombobox.Positioner sideOffset={4}>
        <BaseCombobox.Popup
          data-slot="combobox-content"
          className={styles.popup}
        >
          <BaseCombobox.Empty className={styles.empty}>
            {emptyMessage}
          </BaseCombobox.Empty>
          <BaseCombobox.List>
            {(item: ComboboxItem<unknown>) => (
              <BaseCombobox.Item
                key={String(item.value)}
                value={item}
                data-slot="combobox-item"
                className={styles.item}
              >
                {item.label}
              </BaseCombobox.Item>
            )}
          </BaseCombobox.List>
        </BaseCombobox.Popup>
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  );
}

export const Combobox = Object.assign(ComboboxRoot, {
  Input: ComboboxInput,
  Content: ComboboxContent,
});
