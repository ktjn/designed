import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import buttonStyles from "../button/button.module.css";
import type {
  DialogCloseProps,
  DialogDescriptionProps,
  DialogTitleProps,
} from "../dialog/dialog.js";
import styles from "../dialog/dialog.module.css";
import { useDialogPortalContainer } from "../dialog/use-dialog-portal-container.js";

export interface AlertDialogRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

function AlertDialogRoot({ onOpenChange, ...rest }: AlertDialogRootProps) {
  return (
    <BaseAlertDialog.Root
      onOpenChange={(open) => onOpenChange?.(open)}
      {...rest}
    />
  );
}

export interface AlertDialogTriggerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  children?: ReactNode;
}

function AlertDialogTrigger(props: AlertDialogTriggerProps) {
  return (
    <BaseAlertDialog.Trigger
      data-slot="alert-dialog-trigger"
      className={`${buttonStyles.root} ${buttonStyles.secondary}`}
      {...props}
    />
  );
}

export interface AlertDialogContentProps {
  children?: ReactNode;
}

function AlertDialogContent({ children }: AlertDialogContentProps) {
  const { container, scopeRef } = useDialogPortalContainer();
  return (
    <>
      <span hidden ref={scopeRef} />
      <BaseAlertDialog.Portal container={container}>
        <BaseAlertDialog.Backdrop className={styles.backdrop} />
        <BaseAlertDialog.Popup
          data-slot="alert-dialog-content"
          className={styles.popup}
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

function AlertDialogClose(props: DialogCloseProps) {
  return (
    <BaseAlertDialog.Close
      data-slot="alert-dialog-close"
      className={`${buttonStyles.root} ${buttonStyles.secondary}`}
      {...props}
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
