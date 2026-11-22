import { Menu as BaseMenu } from "@base-ui/react/menu";
import { CheckIcon } from "@ktjn/designed-icons";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from "react";
import buttonStyles from "../button/button.module.css";
import type { OverlayFocusTarget } from "../dialog/overlay-focus.js";
import {
  PortalActivityContext,
  useDialogPortalContainer,
  usePortalActivity,
} from "../dialog/use-dialog-portal-container.js";
import styles from "./menu.module.css";

export interface MenuRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

function MenuRoot({ open, defaultOpen, onOpenChange, ...rest }: MenuRootProps) {
  const activity = usePortalActivity(open, defaultOpen);
  return (
    <PortalActivityContext.Provider value={activity.active}>
      <BaseMenu.Root
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

export interface MenuTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
  render?: ReactElement;
  children?: ReactNode;
}

function MenuTrigger({ render, className, ...rest }: MenuTriggerProps) {
  const classes = render
    ? className
    : [buttonStyles.root, buttonStyles.secondary, className]
        .filter(Boolean)
        .join(" ");
  return (
    <BaseMenu.Trigger
      data-slot="menu-trigger"
      render={render}
      className={classes}
      {...rest}
    />
  );
}

export type MenuSide = "top" | "right" | "bottom" | "left";
export type MenuAlign = "start" | "center" | "end";

export interface MenuContentProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  finalFocus?: OverlayFocusTarget;
  side?: MenuSide;
  sideOffset?: number;
  align?: MenuAlign;
  alignOffset?: number;
  collisionPadding?: number | Partial<Record<MenuSide, number>>;
  children?: ReactNode;
}

function MenuContent({
  side,
  sideOffset = 4,
  align,
  alignOffset,
  collisionPadding,
  className,
  children,
  ...rest
}: MenuContentProps) {
  const { container, scopeRef } = useDialogPortalContainer();
  return (
    <>
      <span hidden ref={scopeRef} />
      <BaseMenu.Portal container={container}>
        <BaseMenu.Positioner
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          collisionPadding={collisionPadding}
          className={styles.positioner}
        >
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
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
}

function MenuGroup(props: MenuGroupProps) {
  return <BaseMenu.Group data-slot="menu-group" {...props} />;
}

export interface MenuGroupLabelProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
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
  ref?: Ref<HTMLDivElement>;
  render?: ReactElement;
  nativeButton?: boolean;
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
  ref?: Ref<HTMLDivElement>;
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
  ref?: Ref<HTMLDivElement>;
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
  ref?: Ref<HTMLDivElement>;
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

export interface MenuSeparatorProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
}

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
  ref?: Ref<HTMLSpanElement>;
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

export interface MenuSubmenuProps {
  disabled?: boolean;
  children?: ReactNode;
}

function MenuSubmenu(props: MenuSubmenuProps) {
  return <BaseMenu.SubmenuRoot {...props} />;
}

export interface MenuSubmenuTriggerProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  render?: ReactElement;
  disabled?: boolean;
  children?: ReactNode;
}

function MenuSubmenuTrigger({ className, ...rest }: MenuSubmenuTriggerProps) {
  return (
    <BaseMenu.SubmenuTrigger
      data-slot="menu-submenu-trigger"
      className={className ? `${styles.item} ${className}` : styles.item}
      {...rest}
    />
  );
}

export interface MenuLinkItemProps
  extends Omit<HTMLAttributes<HTMLAnchorElement>, "href"> {
  ref?: Ref<HTMLAnchorElement>;
  href?: string;
  closeOnClick?: boolean;
  children?: ReactNode;
}

function MenuLinkItem({ className, ...rest }: MenuLinkItemProps) {
  return (
    <BaseMenu.LinkItem
      data-slot="menu-link-item"
      className={className ? `${styles.item} ${className}` : styles.item}
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
  LinkItem: MenuLinkItem,
  CheckboxItem: MenuCheckboxItem,
  RadioGroup: MenuRadioGroup,
  RadioItem: MenuRadioItem,
  Separator: MenuSeparator,
  Shortcut: MenuShortcut,
  Submenu: MenuSubmenu,
  SubmenuTrigger: MenuSubmenuTrigger,
});
