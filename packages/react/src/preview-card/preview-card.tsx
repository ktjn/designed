import { PreviewCard as BasePreviewCard } from "@base-ui/react/preview-card";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import {
  PortalActivityContext,
  useDialogPortalContainer,
  usePortalActivity,
} from "../dialog/use-dialog-portal-container.js";
import styles from "./preview-card.module.css";

export interface PreviewCardRootProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

function PreviewCardRoot({
  open,
  defaultOpen,
  onOpenChange,
  ...rest
}: PreviewCardRootProps) {
  const activity = usePortalActivity(open, defaultOpen);
  return (
    <PortalActivityContext.Provider value={activity.active}>
      <BasePreviewCard.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={(next) => {
          activity.onOpenChange(next);
          onOpenChange?.(next);
        }}
        onOpenChangeComplete={activity.onOpenChangeComplete}
        {...rest}
      />
    </PortalActivityContext.Provider>
  );
}

export interface PreviewCardTriggerProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  delay?: number;
  closeDelay?: number;
  children?: ReactNode;
}

function PreviewCardTrigger({ className, ...rest }: PreviewCardTriggerProps) {
  return (
    <BasePreviewCard.Trigger
      data-slot="preview-card-trigger"
      className={className ? `${styles.trigger} ${className}` : styles.trigger}
      {...rest}
    />
  );
}

export type PreviewCardSide = "top" | "right" | "bottom" | "left";

export interface PreviewCardContentProps {
  side?: PreviewCardSide;
  sideOffset?: number;
  className?: string;
  children?: ReactNode;
}

function PreviewCardContent({
  side = "bottom",
  sideOffset = 8,
  className,
  children,
}: PreviewCardContentProps) {
  const { container, scopeRef } = useDialogPortalContainer();
  return (
    <>
      <span hidden ref={scopeRef} />
      <BasePreviewCard.Portal container={container}>
        <BasePreviewCard.Positioner
          side={side}
          sideOffset={sideOffset}
          className={styles.positioner}
        >
          <BasePreviewCard.Popup
            data-slot="preview-card-content"
            className={
              className ? `${styles.popup} ${className}` : styles.popup
            }
          >
            {children}
          </BasePreviewCard.Popup>
        </BasePreviewCard.Positioner>
      </BasePreviewCard.Portal>
    </>
  );
}

export const PreviewCard = Object.assign(PreviewCardRoot, {
  Trigger: PreviewCardTrigger,
  Content: PreviewCardContent,
});
