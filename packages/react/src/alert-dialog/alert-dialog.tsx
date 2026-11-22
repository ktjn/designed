import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactElement,
  ReactNode,
} from "react";
import buttonStyles from "../button/button.module.css";
import type {
  DialogCloseProps,
  DialogDescriptionProps,
  DialogTitleProps,
} from "../dialog/dialog.js";
import styles from "../dialog/dialog.module.css";
import type { OverlayFocusTarget } from "../dialog/overlay-focus.js";
import {
  PortalActivityContext,
  useDialogPortalContainer,
  usePortalActivity,
} from "../dialog/use-dialog-portal-container.js";

export interface AlertDialogRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

function AlertDialogRoot({
  open,
  defaultOpen,
  onOpenChange,
  ...rest
}: AlertDialogRootProps) {
  const activity = usePortalActivity(open, defaultOpen);
  return (
    <PortalActivityContext.Provider value={activity.active}>
      <BaseAlertDialog.Root
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

export interface AlertDialogTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  render?: ReactElement;
  children?: ReactNode;
}

function AlertDialogTrigger({
  render,
  className,
  ...rest
}: AlertDialogTriggerProps) {
  const classes = render
    ? className
    : [buttonStyles.root, buttonStyles.secondary, className]
        .filter(Boolean)
        .join(" ");
  return (
    <BaseAlertDialog.Trigger
      data-slot="alert-dialog-trigger"
      render={render}
      className={classes}
      {...rest}
    />
  );
}

export interface AlertDialogContentProps
  extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  initialFocus?: OverlayFocusTarget;
  finalFocus?: OverlayFocusTarget;
}

function AlertDialogContent({
  className,
  children,
  ...rest
}: AlertDialogContentProps) {
  const { container, scopeRef } = useDialogPortalContainer();
  return (
    <>
      <span hidden ref={scopeRef} />
      <BaseAlertDialog.Portal container={container}>
        <BaseAlertDialog.Backdrop className={styles.backdrop} />
        <BaseAlertDialog.Popup
          data-slot="alert-dialog-content"
          className={className ? `${styles.popup} ${className}` : styles.popup}
          {...rest}
        >
          {children}
        </BaseAlertDialog.Popup>
      </BaseAlertDialog.Portal>
    </>
  );
}

function AlertDialogTitle({ className, ...rest }: DialogTitleProps) {
  return (
    <BaseAlertDialog.Title
      data-slot="alert-dialog-title"
      className={className ? `${styles.title} ${className}` : styles.title}
      {...rest}
    />
  );
}

function AlertDialogDescription({
  className,
  ...rest
}: DialogDescriptionProps) {
  return (
    <BaseAlertDialog.Description
      data-slot="alert-dialog-description"
      className={
        className ? `${styles.description} ${className}` : styles.description
      }
      {...rest}
    />
  );
}

function AlertDialogClose({ render, className, ...rest }: DialogCloseProps) {
  const classes = render
    ? className
    : [buttonStyles.root, buttonStyles.secondary, className]
        .filter(Boolean)
        .join(" ");
  return (
    <BaseAlertDialog.Close
      data-slot="alert-dialog-close"
      render={render}
      className={classes}
      {...rest}
    />
  );
}

export const AlertDialog = Object.assign(AlertDialogRoot, {
  Trigger: AlertDialogTrigger,
  Content: AlertDialogContent,
  Title: AlertDialogTitle,
  Description: AlertDialogDescription,
  Close: AlertDialogClose,
});
