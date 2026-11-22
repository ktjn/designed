import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import { CloseIcon } from "@ktjn/designed-icons";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from "react";
import { createContext, useContext } from "react";
import buttonStyles from "../button/button.module.css";
import type { OverlayFocusTarget } from "../dialog/overlay-focus.js";
import {
  PortalActivityContext,
  useDialogPortalContainer,
  usePortalActivity,
} from "../dialog/use-dialog-portal-container.js";
import styles from "./drawer.module.css";

export type DrawerSide = "right" | "left" | "bottom";

export interface DrawerRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: DrawerSide;
  children: ReactNode;
}

export interface DrawerTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
  render?: ReactElement;
  children?: ReactNode;
}

export interface DrawerContentProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  side?: DrawerSide;
  closeLabel?: string;
  initialFocus?: OverlayFocusTarget;
  finalFocus?: OverlayFocusTarget;
  children: ReactNode;
}

export interface DrawerTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  ref?: Ref<HTMLHeadingElement>;
  children: ReactNode;
}

export interface DrawerDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  ref?: Ref<HTMLParagraphElement>;
  children: ReactNode;
}

export interface DrawerCloseProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
  render?: ReactElement;
  children?: ReactNode;
}

const DrawerSideContext = createContext<DrawerSide>("right");

function toSwipeDirection(side: DrawerSide): "right" | "left" | "down" {
  if (side === "bottom") return "down";
  return side;
}

function DrawerRoot({
  open,
  defaultOpen,
  onOpenChange,
  side = "right",
  children,
}: DrawerRootProps) {
  const activity = usePortalActivity(open, defaultOpen);
  return (
    <PortalActivityContext.Provider value={activity.active}>
      <DrawerSideContext.Provider value={side}>
        <BaseDrawer.Root
          open={open}
          defaultOpen={defaultOpen}
          swipeDirection={toSwipeDirection(side)}
          onOpenChange={(next) => {
            activity.onOpenChange(next);
            onOpenChange?.(next);
          }}
          onOpenChangeComplete={activity.onOpenChangeComplete}
        >
          {children}
        </BaseDrawer.Root>
      </DrawerSideContext.Provider>
    </PortalActivityContext.Provider>
  );
}

function DrawerTrigger({
  render,
  className,
  children,
  ...rest
}: DrawerTriggerProps) {
  const classes = render
    ? className
    : [buttonStyles.root, buttonStyles.secondary, className]
        .filter(Boolean)
        .join(" ");
  return (
    <BaseDrawer.Trigger
      data-slot="drawer-trigger"
      render={render}
      className={classes}
      {...rest}
    >
      {children}
    </BaseDrawer.Trigger>
  );
}

function DrawerContent({
  side,
  closeLabel = "Close",
  className,
  children,
  ...rest
}: DrawerContentProps) {
  const inheritedSide = useContext(DrawerSideContext);
  const resolvedSide = side ?? inheritedSide;
  const { container, scopeRef } = useDialogPortalContainer();

  return (
    <>
      <span hidden ref={scopeRef} />
      <BaseDrawer.Portal container={container}>
        <BaseDrawer.Backdrop className={styles.backdrop} />
        <BaseDrawer.Viewport className={styles.viewport}>
          <BaseDrawer.Popup
            data-slot="drawer-content"
            data-side={resolvedSide}
            className={
              className ? `${styles.popup} ${className}` : styles.popup
            }
            {...rest}
          >
            <BaseDrawer.Close
              aria-label={closeLabel}
              className={styles.iconClose}
            >
              <CloseIcon aria-hidden />
            </BaseDrawer.Close>
            {children}
          </BaseDrawer.Popup>
        </BaseDrawer.Viewport>
      </BaseDrawer.Portal>
    </>
  );
}

function DrawerTitle({ className, children, ...rest }: DrawerTitleProps) {
  return (
    <BaseDrawer.Title
      data-slot="drawer-title"
      className={className ? `${styles.title} ${className}` : styles.title}
      {...rest}
    >
      {children}
    </BaseDrawer.Title>
  );
}

function DrawerDescription({
  className,
  children,
  ...rest
}: DrawerDescriptionProps) {
  return (
    <BaseDrawer.Description
      data-slot="drawer-description"
      className={
        className ? `${styles.description} ${className}` : styles.description
      }
      {...rest}
    >
      {children}
    </BaseDrawer.Description>
  );
}

function DrawerClose({
  render,
  className,
  children,
  ...rest
}: DrawerCloseProps) {
  const classes = render
    ? className
    : [buttonStyles.root, buttonStyles.secondary, className]
        .filter(Boolean)
        .join(" ");
  return (
    <BaseDrawer.Close
      data-slot="drawer-close"
      render={render}
      className={classes}
      {...rest}
    >
      {children}
    </BaseDrawer.Close>
  );
}

export const Drawer = Object.assign(DrawerRoot, {
  Trigger: DrawerTrigger,
  Content: DrawerContent,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Close: DrawerClose,
});
