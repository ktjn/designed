import type { ForwardedRef, HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import styles from "./empty-state.module.css";

export interface EmptyStateProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

function EmptyStateImpl(
  { icon, title, description, action, className, ...rest }: EmptyStateProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const classes = [styles.root, className].filter(Boolean).join(" ");

  return (
    <div ref={ref} className={classes} {...rest}>
      {icon ? <div className={styles.icon}>{icon}</div> : null}
      <h2 className={styles.title}>{title}</h2>
      {description ? <p className={styles.description}>{description}</p> : null}
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}

export const EmptyState = forwardRef(EmptyStateImpl);
EmptyState.displayName = "EmptyState";
