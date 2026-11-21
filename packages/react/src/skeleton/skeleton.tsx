import type { CSSProperties, HTMLAttributes, Ref } from "react";
import styles from "./skeleton.module.css";

export type SkeletonVariant = "text" | "rectangular" | "circular";

export interface SkeletonProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  ref?: Ref<HTMLSpanElement>;
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
}

function toDimension(value: number | string | undefined): string | undefined {
  if (typeof value === "number") return `${value}px`;
  return value;
}

export function Skeleton({
  ref,
  variant = "text",
  width,
  height,
  style,
  className,
  ...rest
}: SkeletonProps) {
  const classes = [styles.root, styles[variant], className]
    .filter(Boolean)
    .join(" ");
  const mergedStyle: CSSProperties = {
    ...style,
    ...(width !== undefined ? { width: toDimension(width) } : {}),
    ...(height !== undefined ? { height: toDimension(height) } : {}),
  };

  return (
    <span
      ref={ref}
      data-slot="skeleton"
      aria-hidden="true"
      className={classes}
      style={mergedStyle}
      {...rest}
    />
  );
}
