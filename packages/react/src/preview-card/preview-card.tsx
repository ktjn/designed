import { PreviewCard as BasePreviewCard } from "@base-ui/react/preview-card";
import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from "react";
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
  ref?: Ref<HTMLAnchorElement>;
  render?: ReactElement;
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
export type PreviewCardAlign = "start" | "center" | "end";

export interface PreviewCardContentProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  side?: PreviewCardSide;
  sideOffset?: number;
  align?: PreviewCardAlign;
  alignOffset?: number;
  collisionPadding?: number | Partial<Record<PreviewCardSide, number>>;
  children?: ReactNode;
}

function PreviewCardContent({
  side = "bottom",
  sideOffset = 8,
  align,
  alignOffset,
  collisionPadding,
  className,
  children,
  ...rest
}: PreviewCardContentProps) {
  const { container, scopeRef } = useDialogPortalContainer();
  return (
    <>
      <span hidden ref={scopeRef} />
      <BasePreviewCard.Portal container={container}>
        <BasePreviewCard.Positioner
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          collisionPadding={collisionPadding}
          className={styles.positioner}
        >
          <BasePreviewCard.Popup
            data-slot="preview-card-content"
            className={
              className ? `${styles.popup} ${className}` : styles.popup
            }
            {...rest}
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
