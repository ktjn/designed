import type { HTMLAttributes, ReactNode, Ref } from "react";
import styles from "./badge.module.css";

export type BadgeVariant =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>;
  variant?: BadgeVariant;
  children?: ReactNode;
}

export function Badge({
  ref,
  variant = "neutral",
  className,
  ...rest
}: BadgeProps) {
  const classes = [styles.root, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  return <span ref={ref} data-slot="badge" className={classes} {...rest} />;
}
