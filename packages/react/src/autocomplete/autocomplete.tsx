import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";
import type { InputHTMLAttributes, Ref } from "react";
import {
  useDialogPortalContainer,
  usePortalActivity,
} from "../dialog/use-dialog-portal-container.js";
import { useFieldContext, useFieldControlId } from "../field/field-context.js";
import styles from "./autocomplete.module.css";

export interface AutocompleteProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange"
  > {
  ref?: Ref<HTMLInputElement>;
  items: readonly string[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  emptyMessage?: string;
  invalid?: boolean;
}

export function Autocomplete({
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
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...rest
}: AutocompleteProps) {
  const field = useFieldContext();
  const resolvedId = useFieldControlId(id);
  const resolvedInvalid = invalid ?? field?.invalid ?? false;
  const resolvedDisabled = disabled ?? field?.disabled ?? false;
  const activity = usePortalActivity();
  const { container, scopeRef } = useDialogPortalContainer(activity.active);
  const inputClasses = [styles.input, className].filter(Boolean).join(" ");

  return (
    <BaseAutocomplete.Root
      items={items}
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange ? (next) => onValueChange(next) : undefined}
      onOpenChange={activity.onOpenChange}
      onOpenChangeComplete={activity.onOpenChangeComplete}
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
          sideOffset={4}
          className={styles.positioner}
        >
          <BaseAutocomplete.Popup
            data-slot="autocomplete-content"
            className={styles.popup}
          >
            <BaseAutocomplete.Empty className={styles.empty}>
              {emptyMessage}
            </BaseAutocomplete.Empty>
            <BaseAutocomplete.List>
              {(item: string) => (
                <BaseAutocomplete.Item
                  key={item}
                  value={item}
                  data-slot="autocomplete-item"
                  className={styles.item}
                >
                  {item}
                </BaseAutocomplete.Item>
              )}
            </BaseAutocomplete.List>
          </BaseAutocomplete.Popup>
        </BaseAutocomplete.Positioner>
      </BaseAutocomplete.Portal>
    </BaseAutocomplete.Root>
  );
}
