import { Toolbar as BaseToolbar } from "@base-ui/react/toolbar";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";
import styles from "./toolbar.module.css";

export type ToolbarOrientation = "horizontal" | "vertical";

export interface ToolbarRootProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: ToolbarOrientation;
  disabled?: boolean;
  loopFocus?: boolean;
  children?: ReactNode;
}

function ToolbarRoot({ className, ...rest }: ToolbarRootProps) {
  return (
    <BaseToolbar.Root
      data-slot="toolbar"
      className={className ? `${styles.root} ${className}` : styles.root}
      {...rest}
    />
  );
}

export interface ToolbarGroupProps extends HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  children?: ReactNode;
}

function ToolbarGroup({ className, ...rest }: ToolbarGroupProps) {
  return (
    <BaseToolbar.Group
      data-slot="toolbar-group"
      className={className ? `${styles.group} ${className}` : styles.group}
      {...rest}
    />
  );
}

export interface ToolbarButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  focusableWhenDisabled?: boolean;
  children?: ReactNode;
}

function ToolbarButton({ className, ...rest }: ToolbarButtonProps) {
  return (
    <BaseToolbar.Button
      data-slot="toolbar-button"
      className={className ? `${styles.button} ${className}` : styles.button}
      {...rest}
    />
  );
}

export interface ToolbarLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: ReactNode;
}

function ToolbarLink({ className, ...rest }: ToolbarLinkProps) {
  return (
    <BaseToolbar.Link
      data-slot="toolbar-link"
      className={className ? `${styles.link} ${className}` : styles.link}
      {...rest}
    />
  );
}

export interface ToolbarSeparatorProps extends HTMLAttributes<HTMLDivElement> {}

function ToolbarSeparator({ className, ...rest }: ToolbarSeparatorProps) {
  return (
    <BaseToolbar.Separator
      data-slot="toolbar-separator"
      className={
        className ? `${styles.separator} ${className}` : styles.separator
      }
      {...rest}
    />
  );
}

export const Toolbar = Object.assign(ToolbarRoot, {
  Group: ToolbarGroup,
  Button: ToolbarButton,
  Link: ToolbarLink,
  Separator: ToolbarSeparator,
});
