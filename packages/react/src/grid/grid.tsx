import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from "react";
import styles from "./grid.module.css";

export type GridColumns = 1 | 2 | 3 | 4 | "auto";
export type GridGap = "none" | "sm" | "md" | "lg";
export type GridAlign = "start" | "center" | "end" | "stretch";

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  columns?: GridColumns;
  minItemWidth?: string;
  gap?: GridGap;
  align?: GridAlign;
  children?: ReactNode;
}

export function Grid({
  ref,
  columns = "auto",
  minItemWidth,
  gap = "md",
  align,
  className,
  style,
  ...rest
}: GridProps) {
  const classes = [styles.root, className].filter(Boolean).join(" ");
  const mergedStyle = minItemWidth
    ? ({ ...style, "--ds-grid-min-width": minItemWidth } as CSSProperties)
    : style;

  return (
    <div
      ref={ref}
      data-slot="grid"
      data-columns={String(columns)}
      data-gap={gap}
      data-align={align}
      className={classes}
      style={mergedStyle}
      {...rest}
    />
  );
}
