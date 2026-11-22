import { Popover as BasePopover } from "@base-ui/react/popover";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactElement,
  ReactNode,
} from "react";
import buttonStyles from "../button/button.module.css";
import type { OverlayFocusTarget } from "../dialog/overlay-focus.js";
import { useDialogPortalContainer } from "../dialog/use-dialog-portal-container.js";
import styles from "./popover.module.css";

export interface PopoverRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

function PopoverRoot({ onOpenChange, ...rest }: PopoverRootProps) {
  return (
    <BasePopover.Root onOpenChange={(open) => onOpenChange?.(open)} {...rest} />
  );
}

export interface PopoverTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  render?: ReactElement;
  children?: ReactNode;
}

function PopoverTrigger({ render, className, ...rest }: PopoverTriggerProps) {
  const classes = render
    ? className
    : [buttonStyles.root, buttonStyles.secondary, className]
        .filter(Boolean)
        .join(" ");
  return (
    <BasePopover.Trigger
      data-slot="popover-trigger"
      render={render}
      className={classes}
      {...rest}
    />
  );
}

export type PopoverSide = "top" | "right" | "bottom" | "left";

export interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
  side?: PopoverSide;
  sideOffset?: number;
  initialFocus?: OverlayFocusTarget;
  finalFocus?: OverlayFocusTarget;
  children?: ReactNode;
}

function PopoverContent({
  side = "bottom",
  sideOffset = 8,
  className,
  children,
  ...rest
}: PopoverContentProps) {
  const { container, scopeRef } = useDialogPortalContainer();
  return (
    <>
      <span hidden ref={scopeRef} />
      <BasePopover.Portal container={container}>
        <BasePopover.Positioner side={side} sideOffset={sideOffset}>
          <BasePopover.Popup
            data-slot="popover-content"
            className={
              className ? `${styles.popup} ${className}` : styles.popup
            }
            {...rest}
          >
            {children}
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </>
  );
}

export interface PopoverTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
}

function PopoverTitle({ className, ...rest }: PopoverTitleProps) {
  return (
    <BasePopover.Title
      data-slot="popover-title"
      className={className ? `${styles.title} ${className}` : styles.title}
      {...rest}
    />
  );
}

export interface PopoverDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode;
}

function PopoverDescription({ className, ...rest }: PopoverDescriptionProps) {
  return (
    <BasePopover.Description
      data-slot="popover-description"
      className={
        className ? `${styles.description} ${className}` : styles.description
      }
      {...rest}
    />
  );
}

export interface PopoverCloseProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  render?: ReactElement;
  children?: ReactNode;
}

function PopoverClose({ render, className, ...rest }: PopoverCloseProps) {
  const classes = render
    ? className
    : [buttonStyles.root, buttonStyles.secondary, className]
        .filter(Boolean)
        .join(" ");
  return (
    <BasePopover.Close
      data-slot="popover-close"
      render={render}
      className={classes}
      {...rest}
    />
  );
}

export const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: PopoverClose,
});
