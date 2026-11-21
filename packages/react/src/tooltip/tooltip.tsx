import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { ReactElement, ReactNode } from "react";
import { useId } from "react";
import styles from "./tooltip.module.css";

export type TooltipSide = "top" | "right" | "bottom" | "left";

export interface TooltipProps {
  content: ReactNode;
  side?: TooltipSide;
  sideOffset?: number;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactElement;
}

export function Tooltip({
  content,
  side = "top",
  sideOffset = 8,
  onOpenChange,
  children,
  ...rest
}: TooltipProps) {
  // Base UI's Tooltip is purely behavioral: it does not set role="tooltip"
  // on the popup or aria-describedby on the trigger itself, so without this
  // wiring the tooltip is invisible to assistive tech even though it opens
  // and positions correctly. Found via a real-browser Storybook/Vitest test
  // that showed the popup opening with the right content but no accessible
  // role.
  const popupId = useId();
  return (
    <BaseTooltip.Root onOpenChange={(open) => onOpenChange?.(open)} {...rest}>
      <BaseTooltip.Trigger render={children} aria-describedby={popupId} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={side} sideOffset={sideOffset}>
          <BaseTooltip.Popup
            data-slot="tooltip-content"
            id={popupId}
            role="tooltip"
            className={styles.popup}
          >
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
