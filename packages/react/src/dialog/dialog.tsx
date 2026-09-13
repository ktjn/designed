import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { CloseIcon } from "@ktjn/design-icons";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import styles from "./dialog.module.css";

export interface DialogRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean | "trap-focus";
  children?: ReactNode;
}

function DialogRoot({ onOpenChange, ...rest }: DialogRootProps) {
  return (
    <BaseDialog.Root onOpenChange={(open) => onOpenChange?.(open)} {...rest} />
  );
}

export interface DialogTriggerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  children?: ReactNode;
}

function DialogTrigger(props: DialogTriggerProps) {
  return <BaseDialog.Trigger {...props} />;
}

export interface DialogContentProps {
  children?: ReactNode;
  closeLabel?: string;
}

function DialogContent({ children, closeLabel = "Close" }: DialogContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className={styles.backdrop} />
      <BaseDialog.Popup className={styles.popup}>
        <BaseDialog.Close aria-label={closeLabel} className={styles.iconClose}>
          <CloseIcon aria-hidden />
        </BaseDialog.Close>
        {children}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
}

export interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
}

function DialogTitle({ className, ...rest }: DialogTitleProps) {
  return (
    <BaseDialog.Title
      className={className ? `${styles.title} ${className}` : styles.title}
      {...rest}
    />
  );
}

export interface DialogDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode;
}

function DialogDescription({ className, ...rest }: DialogDescriptionProps) {
  return (
    <BaseDialog.Description
      className={
        className ? `${styles.description} ${className}` : styles.description
      }
      {...rest}
    />
  );
}

export interface DialogCloseProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  children?: ReactNode;
}

function DialogCloseButton(props: DialogCloseProps) {
  return <BaseDialog.Close {...props} />;
}

export const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogCloseButton,
});
