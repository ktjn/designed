import { Popover as BasePopover } from "@base-ui/react/popover";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
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
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  children?: ReactNode;
}

function PopoverTrigger(props: PopoverTriggerProps) {
  return <BasePopover.Trigger {...props} />;
}

export type PopoverSide = "top" | "right" | "bottom" | "left";

export interface PopoverContentProps {
  side?: PopoverSide;
  sideOffset?: number;
  children?: ReactNode;
}

function PopoverContent({
  side = "bottom",
  sideOffset = 8,
  children,
}: PopoverContentProps) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner side={side} sideOffset={sideOffset}>
        <BasePopover.Popup className={styles.popup}>
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}

export interface PopoverTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
}

function PopoverTitle({ className, ...rest }: PopoverTitleProps) {
  return (
    <BasePopover.Title
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
      className={
        className ? `${styles.description} ${className}` : styles.description
      }
      {...rest}
    />
  );
}

export interface PopoverCloseProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  children?: ReactNode;
}

function PopoverClose(props: PopoverCloseProps) {
  return <BasePopover.Close {...props} />;
}

export const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Title: PopoverTitle,
  Description: PopoverDescription,
  Close: PopoverClose,
});
