import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";
import type { ForwardedRef, HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import styles from "./scroll-area.module.css";

export type ScrollAreaOrientation = "vertical" | "horizontal" | "both";

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: ScrollAreaOrientation;
  maxHeight?: number | string;
  children?: ReactNode;
}

function ScrollAreaImpl(
  {
    orientation = "vertical",
    maxHeight,
    className,
    style,
    children,
    ...rest
  }: ScrollAreaProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const classes = [styles.root, className].filter(Boolean).join(" ");
  const mergedStyle =
    maxHeight !== undefined
      ? {
          ...style,
          maxBlockSize:
            typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
        }
      : style;
  const showVertical = orientation === "vertical" || orientation === "both";
  const showHorizontal = orientation === "horizontal" || orientation === "both";

  return (
    <BaseScrollArea.Root
      ref={ref}
      data-slot="scroll-area"
      className={classes}
      style={mergedStyle}
      {...rest}
    >
      <BaseScrollArea.Viewport
        data-slot="scroll-area-viewport"
        className={styles.viewport}
        tabIndex={0}
      >
        <BaseScrollArea.Content className={styles.content}>
          {children}
        </BaseScrollArea.Content>
      </BaseScrollArea.Viewport>
      {showVertical ? (
        <BaseScrollArea.Scrollbar
          orientation="vertical"
          className={styles.scrollbar}
        >
          <BaseScrollArea.Thumb className={styles.thumb} />
        </BaseScrollArea.Scrollbar>
      ) : null}
      {showHorizontal ? (
        <BaseScrollArea.Scrollbar
          orientation="horizontal"
          className={styles.scrollbar}
        >
          <BaseScrollArea.Thumb className={styles.thumb} />
        </BaseScrollArea.Scrollbar>
      ) : null}
      {showVertical && showHorizontal ? (
        <BaseScrollArea.Corner className={styles.corner} />
      ) : null}
    </BaseScrollArea.Root>
  );
}

export const ScrollArea = forwardRef(ScrollAreaImpl);
ScrollArea.displayName = "ScrollArea";
