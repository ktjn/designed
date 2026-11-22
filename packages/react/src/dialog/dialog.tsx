import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { CloseIcon } from "@ktjn/designed-icons";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from "react";
import buttonStyles from "../button/button.module.css";
import type { ChangeEventDetails } from "../shared/change-event-details.js";
import styles from "./dialog.module.css";
import type { OverlayFocusTarget } from "./overlay-focus.js";
import {
  PortalActivityContext,
  useDialogPortalContainer,
  usePortalActivity,
} from "./use-dialog-portal-container.js";

export interface DialogRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails?: ChangeEventDetails) => void;
  onOpenChangeComplete?: (open: boolean) => void;
  modal?: boolean | "trap-focus";
  disablePointerDismissal?: boolean;
  children?: ReactNode;
}

function DialogRoot({
  open,
  defaultOpen,
  onOpenChange,
  onOpenChangeComplete,
  ...rest
}: DialogRootProps) {
  const activity = usePortalActivity(open, defaultOpen);
  return (
    <PortalActivityContext.Provider value={activity.active}>
      <BaseDialog.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={(next, eventDetails) => {
          activity.onOpenChange(next);
          onOpenChange?.(next, eventDetails);
        }}
        onOpenChangeComplete={(next) => {
          activity.onOpenChangeComplete(next);
          onOpenChangeComplete?.(next);
        }}
        {...rest}
      />
    </PortalActivityContext.Provider>
  );
}

export interface DialogTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
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
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
  closeLabel?: string;
  showCloseButton?: boolean;
  backdropClassName?: string;
  initialFocus?: OverlayFocusTarget;
  finalFocus?: OverlayFocusTarget;
}

function DialogContent({
  children,
  closeLabel = "Close",
  showCloseButton = true,
  backdropClassName,
  className,
  ...rest
}: DialogContentProps) {
  const { container, scopeRef } = useDialogPortalContainer();
  return (
    <>
      <span hidden ref={scopeRef} />
      <BaseDialog.Portal container={container}>
        <BaseDialog.Backdrop
          className={
            backdropClassName
              ? `${styles.backdrop} ${backdropClassName}`
              : styles.backdrop
          }
        />
        <BaseDialog.Popup
          data-slot="dialog-content"
          className={className ? `${styles.popup} ${className}` : styles.popup}
          {...rest}
        >
          {showCloseButton ? (
            <BaseDialog.Close
              aria-label={closeLabel}
              className={styles.iconClose}
            >
              <CloseIcon aria-hidden />
            </BaseDialog.Close>
          ) : null}
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </>
  );
}

export interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  ref?: Ref<HTMLHeadingElement>;
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
  ref?: Ref<HTMLParagraphElement>;
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
  ref?: Ref<HTMLButtonElement>;
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
