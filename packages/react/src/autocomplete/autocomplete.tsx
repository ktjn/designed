import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";
import type { InputHTMLAttributes, ReactNode, Ref } from "react";
import {
  useDialogPortalContainer,
  usePortalActivity,
} from "../dialog/use-dialog-portal-container.js";
import { useFieldContext, useFieldControlId } from "../field/field-context.js";
import styles from "./autocomplete.module.css";

export type AutocompleteSide = "top" | "right" | "bottom" | "left";
export type AutocompleteAlign = "start" | "center" | "end";

export interface AutocompleteProps<Value = string>
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange"
  > {
  ref?: Ref<HTMLInputElement>;
  items: readonly Value[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  emptyMessage?: ReactNode;
  invalid?: boolean;
  filter?: ((item: Value, query: string) => boolean) | null;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  itemToStringValue?: (item: Value) => string;
  renderItem?: (item: Value) => ReactNode;
  popupClassName?: string;
  side?: AutocompleteSide;
  sideOffset?: number;
  align?: AutocompleteAlign;
  alignOffset?: number;
  collisionPadding?: number | Partial<Record<AutocompleteSide, number>>;
}

function defaultItemLabel(item: unknown): ReactNode {
  if (item !== null && typeof item === "object" && "label" in item) {
    return (item as { label: ReactNode }).label;
  }
  return String(item);
}

export function Autocomplete<Value = string>({
  items,
  value,
  defaultValue,
  onValueChange,
  emptyMessage = "No suggestions",
  invalid,
  disabled,
  name,
  placeholder,
  id,
  className,
  filter,
  open,
  defaultOpen,
  onOpenChange,
  itemToStringValue,
  renderItem,
  popupClassName,
  side,
  sideOffset = 4,
  align,
  alignOffset,
  collisionPadding,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...rest
}: AutocompleteProps<Value>) {
  const field = useFieldContext();
  const resolvedId = useFieldControlId(id);
  const resolvedInvalid = invalid ?? field?.invalid ?? false;
  const resolvedDisabled = disabled ?? field?.disabled ?? false;
  const activity = usePortalActivity(open, defaultOpen);
  const { container, scopeRef } = useDialogPortalContainer(activity.active);
  const inputClasses = [styles.input, className].filter(Boolean).join(" ");
  const popupClasses = [styles.popup, popupClassName].filter(Boolean).join(" ");

  return (
    <BaseAutocomplete.Root
      items={items}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange ? (next) => onValueChange(next) : undefined}
      open={open}
      defaultOpen={defaultOpen}
      onOpenChange={(next) => {
        activity.onOpenChange(next);
        onOpenChange?.(next);
      }}
      onOpenChangeComplete={activity.onOpenChangeComplete}
      filter={
        filter === null
          ? null
          : filter
            ? (item: Value, query: string) => filter(item, query)
            : undefined
      }
      itemToStringValue={itemToStringValue}
      disabled={resolvedDisabled}
      name={name}
    >
      <BaseAutocomplete.Input
        data-slot="autocomplete-input"
        id={resolvedId}
        placeholder={placeholder}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy ?? field?.describedBy}
        aria-invalid={ariaInvalid ?? (resolvedInvalid || undefined)}
        className={inputClasses}
        {...rest}
      />
      <span hidden ref={scopeRef} />
      <BaseAutocomplete.Portal container={container}>
        <BaseAutocomplete.Positioner
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          collisionPadding={collisionPadding}
          className={styles.positioner}
        >
          <BaseAutocomplete.Popup
            data-slot="autocomplete-content"
            className={popupClasses}
          >
            <BaseAutocomplete.Empty className={styles.empty}>
              {emptyMessage}
            </BaseAutocomplete.Empty>
            <BaseAutocomplete.List>
              {(item: Value) => (
                <BaseAutocomplete.Item
                  key={
                    itemToStringValue ? itemToStringValue(item) : String(item)
                  }
                  value={item}
                  data-slot="autocomplete-item"
                  className={styles.item}
                >
                  {renderItem ? renderItem(item) : defaultItemLabel(item)}
                </BaseAutocomplete.Item>
              )}
            </BaseAutocomplete.List>
          </BaseAutocomplete.Popup>
        </BaseAutocomplete.Positioner>
      </BaseAutocomplete.Portal>
    </BaseAutocomplete.Root>
  );
}
