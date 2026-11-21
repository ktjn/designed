import type { CSSProperties, ForwardedRef, HTMLAttributes } from "react";
import { forwardRef } from "react";
import styles from "./skeleton.module.css";

export type SkeletonVariant = "text" | "rectangular" | "circular";

export interface SkeletonProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
}

function toDimension(value: number | string | undefined): string | undefined {
  if (typeof value === "number") return `${value}px`;
  return value;
}

function SkeletonImpl(
  { variant = "text", width, height, style, className, ...rest }: SkeletonProps,
  ref: ForwardedRef<HTMLSpanElement>,
) {
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

export const Skeleton = forwardRef(SkeletonImpl);
Skeleton.displayName = "Skeleton";
