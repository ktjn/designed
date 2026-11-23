import type { HTMLAttributes, ReactNode, Ref } from "react";
import styles from "./badge.module.css";

export type BadgeVariant =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger";
export type BadgeSize = "small" | "medium" | "large";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>;
  variant?: BadgeVariant;
  size?: BadgeSize;
  children?: ReactNode;
}

export function Badge({
  ref,
  variant = "neutral",
  size = "medium",
  className,
  ...rest
}: BadgeProps) {
  const classes = [styles.root, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(" ");

  return <span ref={ref} data-slot="badge" className={classes} {...rest} />;
}
