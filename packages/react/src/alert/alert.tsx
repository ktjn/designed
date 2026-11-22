import type { HTMLAttributes, ReactNode, Ref } from "react";
import styles from "./alert.module.css";

export type AlertVariant = "info" | "success" | "warning" | "danger";

export interface AlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  ref?: Ref<HTMLDivElement>;
  variant?: AlertVariant;
  title?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  children?: ReactNode;
}

export function Alert({
  ref,
  variant = "info",
  title,
  icon,
  action,
  children,
  role,
  className,
  ...rest
}: AlertProps) {
  const defaultRole =
    variant === "danger" || variant === "warning" ? "alert" : "status";
  const classes = [styles.root, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      data-slot="alert"
      role={role ?? defaultRole}
      className={classes}
      {...rest}
    >
      {icon ? (
        <div data-slot="alert-icon" className={styles.icon}>
          {icon}
        </div>
      ) : null}
      <div data-slot="alert-body" className={styles.body}>
        {title ? (
          <div data-slot="alert-title" className={styles.title}>
            {title}
          </div>
        ) : null}
        {children ? (
          <div data-slot="alert-content" className={styles.content}>
            {children}
          </div>
        ) : null}
      </div>
      {action ? (
        <div data-slot="alert-action" className={styles.action}>
          {action}
        </div>
      ) : null}
    </div>
  );
}
