import type { ForwardedRef, HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import styles from "./alert.module.css";

export type AlertVariant = "info" | "success" | "warning" | "danger";

export interface AlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  variant?: AlertVariant;
  title?: ReactNode;
  children?: ReactNode;
}

function AlertImpl(
  { variant = "info", title, children, role, className, ...rest }: AlertProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const defaultRole =
    variant === "danger" || variant === "warning" ? "alert" : "status";
  const classes = [styles.root, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} role={role ?? defaultRole} className={classes} {...rest}>
      {title ? <div className={styles.title}>{title}</div> : null}
      {children ? <div className={styles.content}>{children}</div> : null}
    </div>
  );
}

export const Alert = forwardRef(AlertImpl);
Alert.displayName = "Alert";
