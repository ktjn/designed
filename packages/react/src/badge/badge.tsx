import type { ForwardedRef, HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import styles from "./badge.module.css";

export type BadgeVariant =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children?: ReactNode;
}

function BadgeImpl(
  { variant = "neutral", className, ...rest }: BadgeProps,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  const classes = [styles.root, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  return <span ref={ref} data-slot="badge" className={classes} {...rest} />;
}

export const Badge = forwardRef(BadgeImpl);
Badge.displayName = "Badge";
