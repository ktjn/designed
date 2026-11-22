import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import type { ReactNode } from "react";
import type { OverlayFocusTarget } from "../dialog/overlay-focus.js";
import { useDialogPortalContainer } from "../dialog/use-dialog-portal-container.js";
import { useFieldContext, useFieldControlId } from "../field/field-context.js";
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
  items: ReadonlyArray<ComboboxItem<Value>>;
  children?: ReactNode;
}

function ComboboxRoot<Value = unknown>({
  value,
  defaultValue,
  onValueChange,
  onInputValueChange,
  disabled,
  items,
  ...rest
}: ComboboxRootProps<Value>) {
  const field = useFieldContext();
  const findItem = (itemValue: Value | undefined) =>
    items.find((item) => item.value === itemValue) ?? null;

  return (
    <BaseCombobox.Root
      items={items}
      disabled={disabled ?? field?.disabled}
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
  className?: string;
  placeholder?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
}

function ComboboxInput({
  id,
  className,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...rest
}: ComboboxInputProps) {
  const field = useFieldContext();
  const resolvedId = useFieldControlId(id);
  return (
    <BaseCombobox.Input
      data-slot="combobox-input"
      id={resolvedId}
      aria-describedby={ariaDescribedBy ?? field?.describedBy}
      aria-invalid={ariaInvalid ?? (field?.invalid || undefined)}
      className={className ? `${styles.input} ${className}` : styles.input}
      {...rest}
    />
  );
}

export interface ComboboxContentProps {
  className?: string;
  emptyMessage?: ReactNode;
  initialFocus?: OverlayFocusTarget;
  finalFocus?: OverlayFocusTarget;
}

function ComboboxContent({
  className,
  emptyMessage = "No results",
  initialFocus,
  finalFocus,
}: ComboboxContentProps) {
  const { container, scopeRef } = useDialogPortalContainer();
  return (
    <>
      <span hidden ref={scopeRef} />
      <BaseCombobox.Portal container={container}>
        <BaseCombobox.Positioner sideOffset={4}>
          <BaseCombobox.Popup
            data-slot="combobox-content"
            initialFocus={initialFocus}
            finalFocus={finalFocus}
            className={
              className ? `${styles.popup} ${className}` : styles.popup
            }
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
    </>
  );
}

export const Combobox = Object.assign(ComboboxRoot, {
  Input: ComboboxInput,
  Content: ComboboxContent,
});
