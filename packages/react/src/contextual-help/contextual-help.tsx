import { InfoIcon } from "@ktjn/designed-icons";
import type { HTMLAttributes, ReactNode, Ref } from "react";
import {
  Popover,
  type PopoverAlign,
  type PopoverSide,
} from "../popover/popover.js";
import type { ChangeEventDetails } from "../shared/change-event-details.js";
import styles from "./contextual-help.module.css";

export type ContextualHelpVariant = "info" | "help";

export interface ContextualHelpProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  ref?: Ref<HTMLDivElement>;
  heading: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  variant?: ContextualHelpVariant;
  label?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails?: ChangeEventDetails) => void;
  side?: PopoverSide;
  sideOffset?: number;
  align?: PopoverAlign;
  alignOffset?: number;
  collisionPadding?: number | Partial<Record<PopoverSide, number>>;
}

function hasRenderableContent(node: ReactNode): boolean {
  return node != null && typeof node !== "boolean" && node !== "";
}

function HelpCircleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 16 16"
      aria-hidden="true"
    >
      <circle cx={8} cy={8} r={6} stroke="currentColor" strokeWidth={1.5} />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M6.25 6.25a1.75 1.75 0 1 1 3.5 0c0 1.25-1.75 1.35-1.75 2.5M8 11.25h.01"
      />
    </svg>
  );
}

export function ContextualHelp({
  ref,
  heading,
  children,
  footer,
  variant = "info",
  label,
  open,
  defaultOpen,
  onOpenChange,
  side = "bottom",
  sideOffset,
  align,
  alignOffset,
  collisionPadding,
  className,
  ...rest
}: ContextualHelpProps) {
  const resolvedLabel = label ?? (variant === "help" ? "Help" : "Information");
  const hasBody = hasRenderableContent(children);
  const hasFooter = hasRenderableContent(footer);
  const contentClasses = [styles.content, className].filter(Boolean).join(" ");

  return (
    <Popover open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Popover.Trigger
        data-slot="contextual-help-trigger"
        render={
          <button
            type="button"
            data-slot="contextual-help-trigger"
            aria-label={resolvedLabel}
            className={styles.trigger}
          />
        }
      >
        {variant === "help" ? (
          <HelpCircleIcon />
        ) : (
          <InfoIcon aria-hidden="true" />
        )}
      </Popover.Trigger>
      <Popover.Content
        ref={ref}
        data-slot="contextual-help-content"
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        className={contentClasses}
        {...rest}
      >
        <Popover.Title
          data-slot="contextual-help-heading"
          className={styles.heading}
        >
          {heading}
        </Popover.Title>
        {hasBody ? (
          <div data-slot="contextual-help-body" className={styles.body}>
            {children}
          </div>
        ) : null}
        {hasFooter ? (
          <div data-slot="contextual-help-footer" className={styles.footer}>
            {footer}
          </div>
        ) : null}
      </Popover.Content>
    </Popover>
  );
}
