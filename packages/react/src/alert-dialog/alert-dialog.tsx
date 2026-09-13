import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Dialog } from "../dialog/dialog.js";
import styles from "../dialog/dialog.module.css";

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
  return <BaseAlertDialog.Trigger {...props} />;
}

export interface AlertDialogContentProps {
  children?: ReactNode;
}

function AlertDialogContent({ children }: AlertDialogContentProps) {
  // AlertDialog never renders a dismiss-by-icon affordance: the user must
  // choose one of the explicit actions (for example Cancel/Confirm), which
  // is the point of an alert dialog over a regular dialog.
  return (
    <BaseAlertDialog.Portal>
      <BaseAlertDialog.Backdrop className={styles.backdrop} />
      <BaseAlertDialog.Popup className={styles.popup}>
        {children}
      </BaseAlertDialog.Popup>
    </BaseAlertDialog.Portal>
  );
}

export const AlertDialog = Object.assign(AlertDialogRoot, {
  Trigger: AlertDialogTrigger,
  Content: AlertDialogContent,
  Title: Dialog.Title,
  Description: Dialog.Description,
  Close: Dialog.Close,
});
