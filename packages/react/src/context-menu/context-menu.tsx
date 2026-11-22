import { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu";
import { CheckIcon } from "@ktjn/designed-icons";
import type { HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import type { OverlayFocusTarget } from "../dialog/overlay-focus.js";
import {
  PortalActivityContext,
  useDialogPortalContainer,
  usePortalActivity,
} from "../dialog/use-dialog-portal-container.js";
import styles from "./context-menu.module.css";

export interface ContextMenuRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  children?: ReactNode;
}

function ContextMenuRoot({
  open,
  defaultOpen,
  onOpenChange,
  ...rest
}: ContextMenuRootProps) {
  const activity = usePortalActivity(open, defaultOpen);
  return (
    <PortalActivityContext.Provider value={activity.active}>
      <BaseContextMenu.Root
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

export interface ContextMenuTriggerProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  render?: ReactElement;
  children?: ReactNode;
}

function ContextMenuTrigger({ className, ...rest }: ContextMenuTriggerProps) {
  return (
    <BaseContextMenu.Trigger
      data-slot="context-menu-trigger"
      className={className ? `${styles.trigger} ${className}` : styles.trigger}
      {...rest}
    />
  );
}

export interface ContextMenuContentProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  finalFocus?: OverlayFocusTarget;
  children?: ReactNode;
}

function ContextMenuContent({
  className,
  children,
  ...rest
}: ContextMenuContentProps) {
  const { container, scopeRef } = useDialogPortalContainer();
  return (
    <>
      <span hidden ref={scopeRef} />
      <BaseContextMenu.Portal container={container}>
        <BaseContextMenu.Positioner className={styles.positioner}>
          <BaseContextMenu.Popup
            data-slot="context-menu-content"
            className={
              className ? `${styles.popup} ${className}` : styles.popup
            }
            {...rest}
          >
            {children}
          </BaseContextMenu.Popup>
        </BaseContextMenu.Positioner>
      </BaseContextMenu.Portal>
    </>
  );
}

export interface ContextMenuGroupProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
}

function ContextMenuGroup(props: ContextMenuGroupProps) {
  return <BaseContextMenu.Group data-slot="context-menu-group" {...props} />;
}

export interface ContextMenuGroupLabelProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
}

function ContextMenuGroupLabel({
  className,
  ...rest
}: ContextMenuGroupLabelProps) {
  return (
    <BaseContextMenu.GroupLabel
      data-slot="context-menu-group-label"
      className={
        className ? `${styles.groupLabel} ${className}` : styles.groupLabel
      }
      {...rest}
    />
  );
}

export interface ContextMenuItemProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  render?: ReactElement;
  nativeButton?: boolean;
  disabled?: boolean;
  children?: ReactNode;
}

function ContextMenuItem({ className, ...rest }: ContextMenuItemProps) {
  return (
    <BaseContextMenu.Item
      data-slot="context-menu-item"
      className={className ? `${styles.item} ${className}` : styles.item}
      {...rest}
    />
  );
}

export interface ContextMenuCheckboxItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  ref?: Ref<HTMLDivElement>;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  children?: ReactNode;
}

function ContextMenuCheckboxItem({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  className,
  children,
  ...rest
}: ContextMenuCheckboxItemProps) {
  return (
    <BaseContextMenu.CheckboxItem
      data-slot="context-menu-checkbox-item"
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={
        onCheckedChange ? (next) => onCheckedChange(next) : undefined
      }
      disabled={disabled}
      className={
        className ? `${styles.optionItem} ${className}` : styles.optionItem
      }
      {...rest}
    >
      <span className={styles.indicatorSlot} aria-hidden="true">
        <BaseContextMenu.CheckboxItemIndicator>
          <CheckIcon aria-hidden />
        </BaseContextMenu.CheckboxItemIndicator>
      </span>
      {children}
    </BaseContextMenu.CheckboxItem>
  );
}

export interface ContextMenuRadioGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  ref?: Ref<HTMLDivElement>;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children?: ReactNode;
}

function ContextMenuRadioGroup({
  value,
  defaultValue,
  onValueChange,
  disabled,
  ...rest
}: ContextMenuRadioGroupProps) {
  return (
    <BaseContextMenu.RadioGroup
      data-slot="context-menu-radio-group"
      value={value}
      defaultValue={defaultValue}
      onValueChange={
        onValueChange ? (next) => onValueChange(String(next)) : undefined
      }
      disabled={disabled}
      {...rest}
    />
  );
}

export interface ContextMenuRadioItemProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  value: string;
  disabled?: boolean;
  children?: ReactNode;
}

function ContextMenuRadioItem({
  value,
  disabled,
  className,
  children,
  ...rest
}: ContextMenuRadioItemProps) {
  return (
    <BaseContextMenu.RadioItem
      data-slot="context-menu-radio-item"
      value={value}
      disabled={disabled}
      className={
        className ? `${styles.optionItem} ${className}` : styles.optionItem
      }
      {...rest}
    >
      <span className={styles.indicatorSlot} aria-hidden="true">
        <BaseContextMenu.RadioItemIndicator>
          <span className={styles.radioDot} />
        </BaseContextMenu.RadioItemIndicator>
      </span>
      {children}
    </BaseContextMenu.RadioItem>
  );
}

export interface ContextMenuSeparatorProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

function ContextMenuSeparator({
  className,
  ...rest
}: ContextMenuSeparatorProps) {
  return (
    <BaseContextMenu.Separator
      data-slot="context-menu-separator"
      className={
        className ? `${styles.separator} ${className}` : styles.separator
      }
      {...rest}
    />
  );
}

export interface ContextMenuShortcutProps
  extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>;
  children?: ReactNode;
}

function ContextMenuShortcut({ className, ...rest }: ContextMenuShortcutProps) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={
        className ? `${styles.shortcut} ${className}` : styles.shortcut
      }
      {...rest}
    />
  );
}

export interface ContextMenuSubmenuProps {
  disabled?: boolean;
  children?: ReactNode;
}

function ContextMenuSubmenu(props: ContextMenuSubmenuProps) {
  return <BaseContextMenu.SubmenuRoot {...props} />;
}

export interface ContextMenuSubmenuTriggerProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  render?: ReactElement;
  disabled?: boolean;
  children?: ReactNode;
}

function ContextMenuSubmenuTrigger({
  className,
  ...rest
}: ContextMenuSubmenuTriggerProps) {
  return (
    <BaseContextMenu.SubmenuTrigger
      data-slot="context-menu-submenu-trigger"
      className={className ? `${styles.item} ${className}` : styles.item}
      {...rest}
    />
  );
}

export interface ContextMenuLinkItemProps
  extends Omit<HTMLAttributes<HTMLAnchorElement>, "href"> {
  ref?: Ref<HTMLAnchorElement>;
  href?: string;
  closeOnClick?: boolean;
  children?: ReactNode;
}

function ContextMenuLinkItem({ className, ...rest }: ContextMenuLinkItemProps) {
  return (
    <BaseContextMenu.LinkItem
      data-slot="context-menu-link-item"
      className={className ? `${styles.item} ${className}` : styles.item}
      {...rest}
    />
  );
}

export const ContextMenu = Object.assign(ContextMenuRoot, {
  Trigger: ContextMenuTrigger,
  Content: ContextMenuContent,
  Group: ContextMenuGroup,
  GroupLabel: ContextMenuGroupLabel,
  Item: ContextMenuItem,
  LinkItem: ContextMenuLinkItem,
  CheckboxItem: ContextMenuCheckboxItem,
  RadioGroup: ContextMenuRadioGroup,
  RadioItem: ContextMenuRadioItem,
  Separator: ContextMenuSeparator,
  Shortcut: ContextMenuShortcut,
  Submenu: ContextMenuSubmenu,
  SubmenuTrigger: ContextMenuSubmenuTrigger,
});
