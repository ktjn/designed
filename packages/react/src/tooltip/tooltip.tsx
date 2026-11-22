import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { ReactElement, ReactNode } from "react";
import { useId } from "react";
import {
  useDialogPortalContainer,
  usePortalActivity,
} from "../dialog/use-dialog-portal-container.js";
import styles from "./tooltip.module.css";

export type TooltipSide = "top" | "right" | "bottom" | "left";

export interface TooltipProps {
  content: ReactNode;
  side?: TooltipSide;
  sideOffset?: number;
  className?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactElement;
}

export function Tooltip({
  content,
  side = "top",
  sideOffset = 8,
  className,
  open,
  defaultOpen,
  onOpenChange,
  children,
  ...rest
}: TooltipProps) {
  const popupId = useId();
  const activity = usePortalActivity(open, defaultOpen);
  const { container, scopeRef } = useDialogPortalContainer(activity.active);
  return (
    <>
      <span hidden ref={scopeRef} />
      <BaseTooltip.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={(next) => {
          activity.onOpenChange(next);
          onOpenChange?.(next);
        }}
        onOpenChangeComplete={activity.onOpenChangeComplete}
        {...rest}
      >
        <BaseTooltip.Trigger render={children} aria-describedby={popupId} />
        <BaseTooltip.Portal container={container}>
          <BaseTooltip.Positioner side={side} sideOffset={sideOffset}>
            <BaseTooltip.Popup
              data-slot="tooltip-content"
              id={popupId}
              role="tooltip"
              className={
                className ? `${styles.popup} ${className}` : styles.popup
              }
            >
              {content}
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </>
  );
}
