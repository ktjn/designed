import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { CloseIcon } from "@ktjn/designed-icons";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactElement,
  ReactNode,
} from "react";
import buttonStyles from "../button/button.module.css";
import styles from "./dialog.module.css";
import type { OverlayFocusTarget } from "./overlay-focus.js";
import { useDialogPortalContainer } from "./use-dialog-portal-container.js";

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
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  render?: ReactElement;
  children?: ReactNode;
}

function DialogTrigger({ render, className, ...rest }: DialogTriggerProps) {
  const classes = render
    ? className
    : [buttonStyles.root, buttonStyles.secondary, className]
        .filter(Boolean)
        .join(" ");
  return (
    <BaseDialog.Trigger
      data-slot="dialog-trigger"
      render={render}
      className={classes}
      {...rest}
    />
  );
}

export interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  closeLabel?: string;
  initialFocus?: OverlayFocusTarget;
  finalFocus?: OverlayFocusTarget;
}

function DialogContent({
  children,
  closeLabel = "Close",
  className,
  ...rest
}: DialogContentProps) {
  const { container, scopeRef } = useDialogPortalContainer();
  return (
    <>
      <span hidden ref={scopeRef} />
      <BaseDialog.Portal container={container}>
        <BaseDialog.Backdrop className={styles.backdrop} />
        <BaseDialog.Popup
          data-slot="dialog-content"
          className={className ? `${styles.popup} ${className}` : styles.popup}
          {...rest}
        >
          <BaseDialog.Close
            aria-label={closeLabel}
            className={styles.iconClose}
          >
            <CloseIcon aria-hidden />
          </BaseDialog.Close>
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </>
  );
}

export interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
}

function DialogTitle({ className, ...rest }: DialogTitleProps) {
  return (
    <BaseDialog.Title
      data-slot="dialog-title"
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
      data-slot="dialog-description"
      className={
        className ? `${styles.description} ${className}` : styles.description
      }
      {...rest}
    />
  );
}

export interface DialogCloseProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  render?: ReactElement;
  children?: ReactNode;
}

function DialogCloseButton({ render, className, ...rest }: DialogCloseProps) {
  const classes = render
    ? className
    : [buttonStyles.root, buttonStyles.secondary, className]
        .filter(Boolean)
        .join(" ");
  return (
    <BaseDialog.Close
      data-slot="dialog-close"
      render={render}
      className={classes}
      {...rest}
    />
  );
}

export const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogCloseButton,
});
