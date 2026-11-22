import { Select as BaseSelect } from "@base-ui/react/select";
import { ChevronDownIcon } from "@ktjn/designed-icons";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactElement,
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
import styles from "./select.module.css";

export interface SelectRootProps<Value = unknown> {
  value?: Value;
  defaultValue?: Value;
  onValueChange?: (value: Value | null) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
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
  open,
  defaultOpen,
  onOpenChange,
  ...rest
}: SelectRootProps<Value>) {
  const field = useFieldContext();
  const activity = usePortalActivity(open, defaultOpen);
  return (
    <PortalActivityContext.Provider value={activity.active}>
      <BaseSelect.Root
        disabled={disabled ?? field?.disabled}
        onValueChange={(value) => onValueChange?.(value)}
        open={open}
        defaultOpen={defaultOpen}
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

export interface SelectTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
  render?: ReactElement;
  nativeButton?: boolean;
  children?: ReactNode;
}

function SelectTrigger({
  id,
  className,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  children,
  ...rest
}: SelectTriggerProps) {
  const field = useFieldContext();
  const resolvedId = useFieldControlId(id);
  return (
    <BaseSelect.Trigger
      data-slot="select-trigger"
      id={resolvedId}
      aria-describedby={ariaDescribedBy ?? field?.describedBy}
      aria-invalid={ariaInvalid ?? (field?.invalid || undefined)}
      className={className ? `${styles.trigger} ${className}` : styles.trigger}
      {...rest}
    >
      {children}
      <BaseSelect.Icon className={styles.icon}>
        <ChevronDownIcon aria-hidden />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  );
}

export interface SelectValueProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>;
  placeholder?: string;
}

function SelectValue({ placeholder, ...rest }: SelectValueProps) {
  return (
    <BaseSelect.Value
      data-slot="select-value"
      placeholder={placeholder}
      {...rest}
    />
  );
}

export type SelectSide = "top" | "right" | "bottom" | "left";
export type SelectAlign = "start" | "center" | "end";

export interface SelectContentProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  finalFocus?: OverlayFocusTarget;
  side?: SelectSide;
  sideOffset?: number;
  align?: SelectAlign;
  alignOffset?: number;
  collisionPadding?: number | Partial<Record<SelectSide, number>>;
  children?: ReactNode;
}

function SelectContent({
  className,
  finalFocus,
  side,
  sideOffset = 4,
  align,
  alignOffset,
  collisionPadding,
  children,
  ...rest
}: SelectContentProps) {
  const { container, scopeRef } = useDialogPortalContainer();
  return (
    <>
      <span hidden ref={scopeRef} />
      <BaseSelect.Portal container={container}>
        <BaseSelect.Positioner
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          collisionPadding={collisionPadding}
          className={styles.positioner}
        >
          <BaseSelect.Popup
            data-slot="select-content"
            finalFocus={finalFocus}
            className={
              className ? `${styles.popup} ${className}` : styles.popup
            }
            {...rest}
          >
            <BaseSelect.List>{children}</BaseSelect.List>
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </>
  );
}

export interface SelectItemProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  value: unknown;
  disabled?: boolean;
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
