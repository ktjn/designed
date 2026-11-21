import { Select as BaseSelect } from "@base-ui/react/select";
import { ChevronDownIcon } from "@ktjn/designed-icons";
import type { ReactNode } from "react";
import { useDialogPortalContainer } from "../dialog/use-dialog-portal-container.js";
import { useFieldContext, useFieldControlId } from "../field/field-context.js";
import styles from "./select.module.css";

export interface SelectRootProps<Value = unknown> {
  value?: Value;
  defaultValue?: Value;
  onValueChange?: (value: Value | null) => void;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  name?: string;
  items?:
    | Record<string, ReactNode>
    | ReadonlyArray<{ label: ReactNode; value: Value }>;
  children?: ReactNode;
}

function SelectRoot<Value = unknown>({
  disabled,
  onValueChange,
  ...rest
}: SelectRootProps<Value>) {
  const field = useFieldContext();
  return (
    <BaseSelect.Root
      disabled={disabled ?? field?.disabled}
      onValueChange={(value) => onValueChange?.(value)}
      {...rest}
    />
  );
}

export interface SelectTriggerProps {
  id?: string;
  className?: string;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false" | "grammar" | "spelling";
  children?: ReactNode;
}

function SelectTrigger({
  id,
  className,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  children,
}: SelectTriggerProps) {
  const field = useFieldContext();
  const resolvedId = useFieldControlId(id);
  return (
    <BaseSelect.Trigger
      data-slot="select-trigger"
      id={resolvedId}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy ?? field?.describedBy}
      aria-invalid={ariaInvalid ?? (field?.invalid || undefined)}
      className={className ? `${styles.trigger} ${className}` : styles.trigger}
    >
      {children}
      <BaseSelect.Icon className={styles.icon}>
        <ChevronDownIcon aria-hidden />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  );
}

export interface SelectValueProps {
  placeholder?: string;
}

function SelectValue({ placeholder }: SelectValueProps) {
  return <BaseSelect.Value placeholder={placeholder} />;
}

export interface SelectContentProps {
  className?: string;
  children?: ReactNode;
}

function SelectContent({ className, children }: SelectContentProps) {
  const { container, scopeRef } = useDialogPortalContainer();
  return (
    <>
      <span hidden ref={scopeRef} />
      <BaseSelect.Portal container={container}>
        <BaseSelect.Positioner sideOffset={4}>
          <BaseSelect.Popup
            data-slot="select-content"
            className={
              className ? `${styles.popup} ${className}` : styles.popup
            }
          >
            <BaseSelect.List>{children}</BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </>
  );
}

export interface SelectItemProps {
  value: unknown;
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
}

function SelectItem({ className, children, ...rest }: SelectItemProps) {
  return (
    <BaseSelect.Item
      data-slot="select-item"
      className={className ? `${styles.item} ${className}` : styles.item}
      {...rest}
    >
      <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
    </BaseSelect.Item>
  );
}

export const Select = Object.assign(SelectRoot, {
  Trigger: SelectTrigger,
  Value: SelectValue,
  Content: SelectContent,
  Item: SelectItem,
});
