import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { ReactElement, ReactNode } from "react";
import { useId } from "react";
import { useDialogPortalContainer } from "../dialog/use-dialog-portal-container.js";
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
  onOpenChange,
  children,
  ...rest
}: TooltipProps) {
  const popupId = useId();
  const { container, scopeRef } = useDialogPortalContainer();
  return (
    <>
      <span hidden ref={scopeRef} />
      <BaseTooltip.Root onOpenChange={(open) => onOpenChange?.(open)} {...rest}>
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
