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
import { useI18nMessage } from "../designed-provider/i18n-provider.js";
import { useIconOverride } from "../designed-provider/icon-provider.js";
import type { OverlayFocusTarget } from "../dialog/overlay-focus.js";
import {
  PortalActivityContext,
  useDialogPortalContainer,
  usePortalActivity,
} from "../dialog/use-dialog-portal-container.js";
import type { ChangeEventDetails } from "../shared/change-event-details.js";
import styles from "./drawer.module.css";

export type DrawerSide = "right" | "left" | "bottom";

export interface DrawerRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails?: ChangeEventDetails) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  modal?: boolean | "trap-focus";
  disablePointerDismissal?: boolean;
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
  showCloseButton?: boolean;
  backdropClassName?: string;
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
  onOpenChangeComplete,
  side = "right",
  children,
  ...rest
}: DrawerRootProps) {
  const activity = usePortalActivity(open, defaultOpen);
  return (
    <PortalActivityContext.Provider value={activity.active}>
      <DrawerSideContext.Provider value={side}>
        <BaseDrawer.Root
          open={open}
          defaultOpen={defaultOpen}
          swipeDirection={toSwipeDirection(side)}
          onOpenChange={(next, eventDetails) => {
            activity.onOpenChange(next);
            onOpenChange?.(next, eventDetails);
          }}
          onOpenChangeComplete={(next) => {
            activity.onOpenChangeComplete(next);
            onOpenChangeComplete?.(next);
          }}
          {...rest}
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
  closeLabel,
  showCloseButton = true,
  backdropClassName,
  className,
  children,
  ...rest
}: DrawerContentProps) {
  const Icon = useIconOverride("close", CloseIcon);
  const resolvedCloseLabel = useI18nMessage("close", closeLabel, "Close");
  const inheritedSide = useContext(DrawerSideContext);
  const resolvedSide = side ?? inheritedSide;
  const { container, scopeRef } = useDialogPortalContainer();

  return (
    <>
      <span hidden ref={scopeRef} />
      <BaseDrawer.Portal container={container}>
        <BaseDrawer.Backdrop
          className={
            backdropClassName
              ? `${styles.backdrop} ${backdropClassName}`
              : styles.backdrop
          }
        />
        <BaseDrawer.Viewport className={styles.viewport}>
          <BaseDrawer.Popup
            data-slot="drawer-content"
            data-side={resolvedSide}
            className={
              className ? `${styles.popup} ${className}` : styles.popup
            }
            {...rest}
          >
            {showCloseButton ? (
              <BaseDrawer.Close
                aria-label={resolvedCloseLabel}
                className={styles.iconClose}
              >
                <Icon aria-hidden />
              </BaseDrawer.Close>
            ) : null}
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
