import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import type {
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  Ref,
} from "react";
import type { OverlayFocusTarget } from "../dialog/overlay-focus.js";
import {
  PortalActivityContext,
  useDialogPortalContainer,
  usePortalActivity,
} from "../dialog/use-dialog-portal-container.js";
import { useFieldContext, useFieldControlId } from "../field/field-context.js";
import styles from "./combobox.module.css";

export interface ComboboxItem<Value> {
  label: string;
  value: Value;
  disabled?: boolean;
}

type ComboboxValue<
  Value,
  Multiple extends boolean | undefined,
> = Multiple extends true ? Value[] : Value;

export interface ComboboxRootProps<
  Value = unknown,
  Multiple extends boolean | undefined = false,
> {
  value?: ComboboxValue<Value, Multiple> | null;
  defaultValue?: ComboboxValue<Value, Multiple>;
  onValueChange?: (
    value:
      | ComboboxValue<Value, Multiple>
      | (Multiple extends true ? never : null),
  ) => void;
  multiple?: Multiple;
  inputValue?: string;
  defaultInputValue?: string;
  onInputValueChange?: (inputValue: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  items: ReadonlyArray<ComboboxItem<Value>>;
  filter?: ((item: ComboboxItem<Value>, query: string) => boolean) | null;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

function ComboboxRoot<
  Value = unknown,
  Multiple extends boolean | undefined = false,
>({
  value,
  defaultValue,
  onValueChange,
  onInputValueChange,
  disabled,
  items,
  multiple,
  filter,
  open,
  defaultOpen,
  onOpenChange,
  ...rest
}: ComboboxRootProps<Value, Multiple>) {
  const field = useFieldContext();
  const activity = usePortalActivity(open, defaultOpen);
  const findItem = (itemValue: Value) =>
    items.find((item) => item.value === itemValue) ?? null;

  const resolveValue = (
    input: ComboboxValue<Value, Multiple> | null | undefined,
  ) => {
    if (input === undefined) {
      return undefined;
    }
    if (input === null) {
      return null;
    }
    if (multiple) {
      return (input as Value[])
        .map((itemValue) => findItem(itemValue))
        .filter((item): item is ComboboxItem<Value> => item !== null);
    }
    return findItem(input as Value);
  };

  return (
    <PortalActivityContext.Provider value={activity.active}>
      <BaseCombobox.Root
        items={items}
        multiple={multiple}
        disabled={disabled ?? field?.disabled}
        itemToStringLabel={(item: ComboboxItem<Value>) => item.label}
        itemToStringValue={(item: ComboboxItem<Value>) => String(item.value)}
        isItemEqualToValue={(
          item: ComboboxItem<Value>,
          other: ComboboxItem<Value>,
        ) => item.value === other.value}
        filter={
          filter === null
            ? null
            : filter
              ? (item: ComboboxItem<Value>, query: string) =>
                  filter(item, query)
              : undefined
        }
        open={open}
        defaultOpen={defaultOpen}
        value={resolveValue(value) as never}
        defaultValue={resolveValue(defaultValue) as never}
        onValueChange={(
          next: ComboboxItem<Value> | ComboboxItem<Value>[] | null,
        ) => {
          if (multiple) {
            onValueChange?.(
              (next as ComboboxItem<Value>[]).map(
                (item) => item.value,
              ) as ComboboxValue<Value, Multiple>,
            );
          } else {
            const item = next as ComboboxItem<Value> | null;
            onValueChange?.(
              (item ? item.value : null) as
                | ComboboxValue<Value, Multiple>
                | (Multiple extends true ? never : null),
            );
          }
        }}
        onInputValueChange={(inputValue) => onInputValueChange?.(inputValue)}
        onOpenChange={(next) => {
          activity.onOpenChange(next);
          onOpenChange?.(next);
        }}
        onOpenChangeComplete={activity.onOpenChangeComplete}
        {...rest}
      />
    </PortalActivityContext.Provider>
  );
}

export interface ComboboxInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>;
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

export interface ComboboxContentProps<Value = unknown>
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  emptyMessage?: ReactNode;
  initialFocus?: OverlayFocusTarget;
  finalFocus?: OverlayFocusTarget;
  renderItem?: (item: ComboboxItem<Value>) => ReactNode;
}

function ComboboxContent<Value = unknown>({
  className,
  emptyMessage = "No results",
  initialFocus,
  finalFocus,
  renderItem,
  ...rest
}: ComboboxContentProps<Value>) {
  const { container, scopeRef } = useDialogPortalContainer();
  return (
    <>
      <span hidden ref={scopeRef} />
      <BaseCombobox.Portal container={container}>
        <BaseCombobox.Positioner sideOffset={4} className={styles.positioner}>
          <BaseCombobox.Popup
            data-slot="combobox-content"
            initialFocus={initialFocus}
            finalFocus={finalFocus}
            className={
              className ? `${styles.popup} ${className}` : styles.popup
            }
            {...rest}
          >
            <BaseCombobox.Empty className={styles.empty}>
              {emptyMessage}
            </BaseCombobox.Empty>
            <BaseCombobox.List>
              {(item: ComboboxItem<Value>) => (
                <BaseCombobox.Item
                  key={String(item.value)}
                  value={item}
                  disabled={item.disabled}
                  data-slot="combobox-item"
                  className={styles.item}
                >
                  {renderItem ? renderItem(item) : item.label}
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
