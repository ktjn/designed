import { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu";
import type { HTMLAttributes, ReactNode } from "react";
import { useDialogPortalContainer } from "../dialog/use-dialog-portal-container.js";
import styles from "./context-menu.module.css";

export interface ContextMenuRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  children?: ReactNode;
}

function ContextMenuRoot({ onOpenChange, ...rest }: ContextMenuRootProps) {
  return (
    <BaseContextMenu.Root
      onOpenChange={onOpenChange ? (open) => onOpenChange(open) : undefined}
      {...rest}
    />
  );
}

export interface ContextMenuTriggerProps
  extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

function ContextMenuTrigger({ className, ...rest }: ContextMenuTriggerProps) {
  return (
    <BaseContextMenu.Trigger
      className={className ? `${styles.trigger} ${className}` : styles.trigger}
      {...rest}
    />
  );
}

export interface ContextMenuContentProps {
  children?: ReactNode;
}

function ContextMenuContent({ children }: ContextMenuContentProps) {
  const { container, scopeRef } = useDialogPortalContainer();
  return (
    <>
      <span hidden ref={scopeRef} />
      <BaseContextMenu.Portal container={container}>
        <BaseContextMenu.Positioner>
          <BaseContextMenu.Popup className={styles.popup}>
            {children}
          </BaseContextMenu.Popup>
        </BaseContextMenu.Positioner>
      </BaseContextMenu.Portal>
    </>
  );
}

export interface ContextMenuItemProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  children?: ReactNode;
}

function ContextMenuItem({ className, ...rest }: ContextMenuItemProps) {
  return (
    <BaseContextMenu.Item
      className={className ? `${styles.item} ${className}` : styles.item}
      {...rest}
    />
  );
}

export interface ContextMenuSeparatorProps
  extends HTMLAttributes<HTMLDivElement> {}

function ContextMenuSeparator({
  className,
  ...rest
}: ContextMenuSeparatorProps) {
  return (
    <BaseContextMenu.Separator
      className={
        className ? `${styles.separator} ${className}` : styles.separator
      }
      {...rest}
    />
  );
}

export const ContextMenu = Object.assign(ContextMenuRoot, {
  Trigger: ContextMenuTrigger,
  Content: ContextMenuContent,
  Item: ContextMenuItem,
  Separator: ContextMenuSeparator,
});
