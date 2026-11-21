import type { HTMLAttributes, ReactNode, Ref } from "react";
import styles from "./empty-state.module.css";

export interface EmptyStateProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  ref?: Ref<HTMLDivElement>;
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({
  ref,
  icon,
  title,
  description,
  action,
  className,
  ...rest
}: EmptyStateProps) {
  const classes = [styles.root, className].filter(Boolean).join(" ");

  return (
    <div ref={ref} data-slot="empty-state" className={classes} {...rest}>
      {icon ? <div className={styles.icon}>{icon}</div> : null}
      <h2 className={styles.title}>{title}</h2>
      {description ? <p className={styles.description}>{description}</p> : null}
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}
