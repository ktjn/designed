import { Menu as BaseMenu } from "@base-ui/react/menu";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import styles from "./menu.module.css";

export interface MenuRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

function MenuRoot({ onOpenChange, ...rest }: MenuRootProps) {
  return (
    <BaseMenu.Root onOpenChange={(open) => onOpenChange?.(open)} {...rest} />
  );
}

export interface MenuTriggerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  children?: ReactNode;
}

function MenuTrigger(props: MenuTriggerProps) {
  return <BaseMenu.Trigger {...props} />;
}

export interface MenuContentProps {
  children?: ReactNode;
}

function MenuContent({ children }: MenuContentProps) {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner sideOffset={4}>
        <BaseMenu.Popup className={styles.popup}>{children}</BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

export interface MenuItemProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  children?: ReactNode;
}

function MenuItem({ className, ...rest }: MenuItemProps) {
  return (
    <BaseMenu.Item
      className={className ? `${styles.item} ${className}` : styles.item}
      {...rest}
    />
  );
}

export const Menu = Object.assign(MenuRoot, {
  Trigger: MenuTrigger,
  Content: MenuContent,
  Item: MenuItem,
});
