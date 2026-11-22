import { NavigationMenu as BaseNavigationMenu } from "@base-ui/react/navigation-menu";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from "react";
import {
  PortalActivityContext,
  useDialogPortalContainer,
  usePortalActivity,
} from "../dialog/use-dialog-portal-container.js";
import type { ChangeEventDetails } from "../shared/change-event-details.js";
import styles from "./navigation-menu.module.css";

export interface NavigationMenuRootProps<Value = unknown>
  extends Omit<
    HTMLAttributes<HTMLElement>,
    "onChange" | "value" | "defaultValue"
  > {
  ref?: Ref<HTMLElement>;
  value?: Value | null;
  defaultValue?: Value | null;
  onValueChange?: (
    value: Value | null,
    eventDetails?: ChangeEventDetails,
  ) => void;
  delay?: number;
  closeDelay?: number;
  children?: ReactNode;
}

function NavigationMenuRoot<Value = unknown>({
  value,
  defaultValue,
  onValueChange,
  className,
  ...rest
}: NavigationMenuRootProps<Value>) {
  const isOpen = value !== undefined ? value != null : undefined;
  const activity = usePortalActivity(isOpen, defaultValue != null);
  return (
    <PortalActivityContext.Provider value={activity.active}>
      <BaseNavigationMenu.Root
        data-slot="navigation-menu"
        value={value}
        defaultValue={defaultValue}
        className={className ? `${styles.root} ${className}` : styles.root}
        onValueChange={(next, eventDetails) => {
          activity.onOpenChange(next != null);
          onValueChange?.(next, eventDetails);
        }}
        onOpenChangeComplete={activity.onOpenChangeComplete}
        {...rest}
      />
    </PortalActivityContext.Provider>
  );
}

export interface NavigationMenuListProps
  extends HTMLAttributes<HTMLUListElement> {
  ref?: Ref<HTMLUListElement>;
  children?: ReactNode;
}

function NavigationMenuList({ className, ...rest }: NavigationMenuListProps) {
  return (
    <BaseNavigationMenu.List
      data-slot="navigation-menu-list"
      className={className ? `${styles.list} ${className}` : styles.list}
      {...rest}
    />
  );
}

export interface NavigationMenuItemProps extends HTMLAttributes<HTMLLIElement> {
  ref?: Ref<HTMLLIElement>;
  value?: unknown;
  children?: ReactNode;
}

function NavigationMenuItem({ className, ...rest }: NavigationMenuItemProps) {
  return (
    <BaseNavigationMenu.Item
      data-slot="navigation-menu-item"
      className={className ? `${styles.item} ${className}` : styles.item}
      {...rest}
    />
  );
}

export interface NavigationMenuTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
  disabled?: boolean;
  children?: ReactNode;
}

function NavigationMenuTrigger({
  className,
  ...rest
}: NavigationMenuTriggerProps) {
  return (
    <BaseNavigationMenu.Trigger
      data-slot="navigation-menu-trigger"
      className={className ? `${styles.trigger} ${className}` : styles.trigger}
      {...rest}
    />
  );
}

export interface NavigationMenuLinkProps
  extends Omit<HTMLAttributes<HTMLAnchorElement>, "href"> {
  ref?: Ref<HTMLAnchorElement>;
  render?: ReactElement;
  href?: string;
  active?: boolean;
  closeOnClick?: boolean;
  children?: ReactNode;
}

function NavigationMenuLink({ className, ...rest }: NavigationMenuLinkProps) {
  return (
    <BaseNavigationMenu.Link
      data-slot="navigation-menu-link"
      className={className ? `${styles.link} ${className}` : styles.link}
      {...rest}
    />
  );
}

export interface NavigationMenuContentProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
}

function NavigationMenuContent({
  className,
  ...rest
}: NavigationMenuContentProps) {
  return (
    <BaseNavigationMenu.Content
      data-slot="navigation-menu-content"
      className={className ? `${styles.content} ${className}` : styles.content}
      {...rest}
    />
  );
}

export type NavigationMenuSide = "top" | "right" | "bottom" | "left";
export type NavigationMenuAlign = "start" | "center" | "end";

export interface NavigationMenuViewportProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  side?: NavigationMenuSide;
  sideOffset?: number;
  align?: NavigationMenuAlign;
  alignOffset?: number;
  collisionPadding?: number | Partial<Record<NavigationMenuSide, number>>;
}

function NavigationMenuViewport({
  className,
  side,
  sideOffset = 8,
  align,
  alignOffset,
  collisionPadding,
  ...rest
}: NavigationMenuViewportProps) {
  const { container, scopeRef } = useDialogPortalContainer();
  return (
    <>
      <span hidden ref={scopeRef} />
      <BaseNavigationMenu.Portal container={container}>
        <BaseNavigationMenu.Positioner
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          collisionPadding={collisionPadding}
          className={styles.positioner}
        >
          <BaseNavigationMenu.Popup
            data-slot="navigation-menu-popup"
            className={styles.popup}
          >
            <BaseNavigationMenu.Viewport
              data-slot="navigation-menu-viewport"
              className={
                className ? `${styles.viewport} ${className}` : styles.viewport
              }
              {...rest}
            />
          </BaseNavigationMenu.Popup>
        </BaseNavigationMenu.Positioner>
      </BaseNavigationMenu.Portal>
    </>
  );
}

export const NavigationMenu = Object.assign(NavigationMenuRoot, {
  List: NavigationMenuList,
  Item: NavigationMenuItem,
  Trigger: NavigationMenuTrigger,
  Link: NavigationMenuLink,
  Content: NavigationMenuContent,
  Viewport: NavigationMenuViewport,
});
