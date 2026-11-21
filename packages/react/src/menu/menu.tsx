import { Menu as BaseMenu } from "@base-ui/react/menu";
import { CheckIcon } from "@ktjn/design-icons";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import buttonStyles from "../button/button.module.css";
import { useDialogPortalContainer } from "../dialog/use-dialog-portal-container.js";
import styles from "./menu.module.css";

export interface MenuRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

function MenuRoot({ onOpenChange, ...rest }: MenuRootProps) {
  return (
    <BaseMenu.Root
      onOpenChange={onOpenChange ? (open) => onOpenChange(open) : undefined}
      {...rest}
    />
  );
}

export interface MenuTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

function MenuTrigger({ className, ...rest }: MenuTriggerProps) {
  const classes = [buttonStyles.root, buttonStyles.secondary, className]
    .filter(Boolean)
    .join(" ");
  return (
    <BaseMenu.Trigger data-slot="menu-trigger" className={classes} {...rest} />
  );
}

export interface MenuContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

function MenuContent({ className, children, ...rest }: MenuContentProps) {
  const { container, scopeRef } = useDialogPortalContainer();
  return (
    <>
      <span hidden ref={scopeRef} />
      <BaseMenu.Portal container={container}>
        <BaseMenu.Positioner sideOffset={4}>
          <BaseMenu.Popup
            data-slot="menu-content"
            className={
              className ? `${styles.popup} ${className}` : styles.popup
            }
            {...rest}
          >
            {children}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </>
  );
}

export interface MenuGroupProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

function MenuGroup(props: MenuGroupProps) {
  return <BaseMenu.Group data-slot="menu-group" {...props} />;
}

export interface MenuGroupLabelProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

function MenuGroupLabel({ className, ...rest }: MenuGroupLabelProps) {
  return (
    <BaseMenu.GroupLabel
      data-slot="menu-group-label"
      className={
        className ? `${styles.groupLabel} ${className}` : styles.groupLabel
      }
      {...rest}
    />
  );
}

export interface MenuItemProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  children?: ReactNode;
}

function MenuItem({ className, ...rest }: MenuItemProps) {
  return (
    <BaseMenu.Item
      data-slot="menu-item"
      className={className ? `${styles.item} ${className}` : styles.item}
      {...rest}
    />
  );
}

export interface MenuCheckboxItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  children?: ReactNode;
}

function MenuCheckboxItem({
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  className,
  children,
  ...rest
}: MenuCheckboxItemProps) {
  return (
    <BaseMenu.CheckboxItem
      data-slot="menu-checkbox-item"
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
        <BaseMenu.CheckboxItemIndicator>
          <CheckIcon aria-hidden />
        </BaseMenu.CheckboxItemIndicator>
      </span>
      {children}
    </BaseMenu.CheckboxItem>
  );
}

export interface MenuRadioGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children?: ReactNode;
}

function MenuRadioGroup({
  value,
  defaultValue,
  onValueChange,
  disabled,
  ...rest
}: MenuRadioGroupProps) {
  return (
    <BaseMenu.RadioGroup
      data-slot="menu-radio-group"
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

export interface MenuRadioItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
  children?: ReactNode;
}

function MenuRadioItem({
  value,
  disabled,
  className,
  children,
  ...rest
}: MenuRadioItemProps) {
  return (
    <BaseMenu.RadioItem
      data-slot="menu-radio-item"
      value={value}
      disabled={disabled}
      className={
        className ? `${styles.optionItem} ${className}` : styles.optionItem
      }
      {...rest}
    >
      <span className={styles.indicatorSlot} aria-hidden="true">
        <BaseMenu.RadioItemIndicator>
          <span className={styles.radioDot} />
        </BaseMenu.RadioItemIndicator>
      </span>
      {children}
    </BaseMenu.RadioItem>
  );
}

export interface MenuSeparatorProps extends HTMLAttributes<HTMLDivElement> {}

function MenuSeparator({ className, ...rest }: MenuSeparatorProps) {
  return (
    <BaseMenu.Separator
      data-slot="menu-separator"
      className={
        className ? `${styles.separator} ${className}` : styles.separator
      }
      {...rest}
    />
  );
}

export interface MenuShortcutProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
}

function MenuShortcut({ className, ...rest }: MenuShortcutProps) {
  return (
    <span
      data-slot="menu-shortcut"
      className={
        className ? `${styles.shortcut} ${className}` : styles.shortcut
      }
      {...rest}
    />
  );
}

export const Menu = Object.assign(MenuRoot, {
  Trigger: MenuTrigger,
  Content: MenuContent,
  Group: MenuGroup,
  GroupLabel: MenuGroupLabel,
  Item: MenuItem,
  CheckboxItem: MenuCheckboxItem,
  RadioGroup: MenuRadioGroup,
  RadioItem: MenuRadioItem,
  Separator: MenuSeparator,
  Shortcut: MenuShortcut,
});
