import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import { CloseIcon } from "@ktjn/design-icons";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { createContext, useContext } from "react";
import buttonStyles from "../button/button.module.css";
import { useDialogPortalContainer } from "../dialog/use-dialog-portal-container.js";
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
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  children: ReactNode;
}

export interface DrawerContentProps {
  side?: DrawerSide;
  closeLabel?: string;
  children: ReactNode;
}

export interface DrawerTitleProps
  extends Omit<HTMLAttributes<HTMLHeadingElement>, "className"> {
  children: ReactNode;
}

export interface DrawerDescriptionProps
  extends Omit<HTMLAttributes<HTMLParagraphElement>, "className"> {
  children: ReactNode;
}

export interface DrawerCloseProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  children: ReactNode;
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
  return (
    <DrawerSideContext.Provider value={side}>
      <BaseDrawer.Root
        open={open}
        defaultOpen={defaultOpen}
        swipeDirection={toSwipeDirection(side)}
        onOpenChange={onOpenChange ? (next) => onOpenChange(next) : undefined}
      >
        {children}
      </BaseDrawer.Root>
    </DrawerSideContext.Provider>
  );
}

function DrawerTrigger({ children, ...rest }: DrawerTriggerProps) {
  return (
    <BaseDrawer.Trigger
      className={`${buttonStyles.root} ${buttonStyles.secondary}`}
      {...rest}
    >
      {children}
    </BaseDrawer.Trigger>
  );
}

function DrawerContent({
  side,
  closeLabel = "Close",
  children,
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
          <BaseDrawer.Popup data-side={resolvedSide} className={styles.popup}>
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

function DrawerTitle({ children, ...rest }: DrawerTitleProps) {
  return (
    <BaseDrawer.Title className={styles.title} {...rest}>
      {children}
    </BaseDrawer.Title>
  );
}

function DrawerDescription({ children, ...rest }: DrawerDescriptionProps) {
  return (
    <BaseDrawer.Description className={styles.description} {...rest}>
      {children}
    </BaseDrawer.Description>
  );
}

function DrawerClose({ children, ...rest }: DrawerCloseProps) {
  return (
    <BaseDrawer.Close
      className={`${buttonStyles.root} ${buttonStyles.secondary}`}
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
