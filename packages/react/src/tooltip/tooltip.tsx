import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import { cloneElement, useId } from "react";
import {
  useDialogPortalContainer,
  usePortalActivity,
} from "../dialog/use-dialog-portal-container.js";
import styles from "./tooltip.module.css";

export type TooltipSide = "top" | "right" | "bottom" | "left";
export type TooltipAlign = "start" | "center" | "end";

export interface TooltipProviderProps {
  delay?: number;
  closeDelay?: number;
  timeout?: number;
  children?: ReactNode;
}

function TooltipProvider(props: TooltipProviderProps) {
  return <BaseTooltip.Provider {...props} />;
}

export interface TooltipProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "content" | "children"> {
  ref?: Ref<HTMLDivElement>;
  content: ReactNode;
  side?: TooltipSide;
  sideOffset?: number;
  align?: TooltipAlign;
  alignOffset?: number;
  collisionPadding?: number | Partial<Record<TooltipSide, number>>;
  disabled?: boolean;
  delay?: number;
  closeDelay?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactElement;
}

function TooltipRoot({
  id,
  content,
  side = "top",
  sideOffset = 8,
  align,
  alignOffset,
  collisionPadding,
  disabled,
  delay,
  closeDelay,
  className,
  open,
  defaultOpen,
  onOpenChange,
  children,
  ...rest
}: TooltipProps) {
  const generatedPopupId = useId();
  const popupId = id ?? generatedPopupId;
  const activity = usePortalActivity(disabled ? false : open, defaultOpen);
  const active = !disabled && activity.active;
  const { container, scopeRef } = useDialogPortalContainer(activity.active);
  const childDescribedBy = (
    children.props as { "aria-describedby"?: string } | undefined
  )?.["aria-describedby"];
  const describedBy = active
    ? [childDescribedBy, popupId].filter(Boolean).join(" ")
    : childDescribedBy;
  const triggerElement =
    active && childDescribedBy
      ? cloneElement(
          children as ReactElement<{ "aria-describedby"?: string }>,
          { "aria-describedby": describedBy },
        )
      : children;
  return (
    <>
      <span hidden ref={scopeRef} />
      <BaseTooltip.Root
        disabled={disabled}
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={(next) => {
          activity.onOpenChange(next);
          onOpenChange?.(next);
        }}
        onOpenChangeComplete={activity.onOpenChangeComplete}
      >
        <BaseTooltip.Trigger
          render={triggerElement}
          delay={delay}
          closeDelay={closeDelay}
          aria-describedby={active ? describedBy : undefined}
        />
        <BaseTooltip.Portal container={container}>
          <BaseTooltip.Positioner
            side={side}
            sideOffset={sideOffset}
            align={align}
            alignOffset={alignOffset}
            collisionPadding={collisionPadding}
            className={styles.positioner}
          >
            <BaseTooltip.Popup
              data-slot="tooltip-content"
              id={popupId}
              role="tooltip"
              className={
                className ? `${styles.popup} ${className}` : styles.popup
              }
              {...rest}
            >
              {content}
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </>
  );
}

export const Tooltip = Object.assign(TooltipRoot, {
  Provider: TooltipProvider,
});
