import type { HTMLAttributes, ReactNode, Ref } from "react";
import styles from "./alert.module.css";

export type AlertVariant = "info" | "success" | "warning" | "danger";

export interface AlertProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  ref?: Ref<HTMLDivElement>;
  variant?: AlertVariant;
  title?: ReactNode;
  children?: ReactNode;
}

export function Alert({
  ref,
  variant = "info",
  title,
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
      {title ? <div className={styles.title}>{title}</div> : null}
      {children ? <div className={styles.content}>{children}</div> : null}
    </div>
  );
}
