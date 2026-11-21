import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import buttonStyles from "../button/button.module.css";
import { Dialog } from "../dialog/dialog.js";
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
        <BaseAlertDialog.Popup className={styles.popup}>
          {children}
        </BaseAlertDialog.Popup>
      </BaseAlertDialog.Portal>
    </>
  );
}

export const AlertDialog = Object.assign(AlertDialogRoot, {
  Trigger: AlertDialogTrigger,
  Content: AlertDialogContent,
  Title: Dialog.Title,
  Description: Dialog.Description,
  Close: Dialog.Close,
});
