import type { HTMLAttributes, ReactNode, Ref } from "react";
import styles from "./empty-state.module.css";

export interface EmptyStateClassNames {
  icon?: string;
  title?: string;
  description?: string;
  action?: string;
}

export interface EmptyStateProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  ref?: Ref<HTMLDivElement>;
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  classNames?: EmptyStateClassNames;
  children?: ReactNode;
}

export function EmptyState({
  ref,
  icon,
  title,
  description,
  action,
  classNames,
  className,
  children,
  ...rest
}: EmptyStateProps) {
  const classes = [styles.root, className].filter(Boolean).join(" ");
  const iconClasses = [styles.icon, classNames?.icon].filter(Boolean).join(" ");
  const titleClasses = [styles.title, classNames?.title]
    .filter(Boolean)
    .join(" ");
  const descriptionClasses = [styles.description, classNames?.description]
    .filter(Boolean)
    .join(" ");
  const actionClasses = [styles.action, classNames?.action]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={ref} data-slot="empty-state" className={classes} {...rest}>
      {icon ? (
        <div data-slot="empty-state-icon" className={iconClasses}>
          {icon}
        </div>
      ) : null}
      <h2 data-slot="empty-state-title" className={titleClasses}>
        {title}
      </h2>
      {description ? (
        <p data-slot="empty-state-description" className={descriptionClasses}>
          {description}
        </p>
      ) : null}
      {action ? (
        <div data-slot="empty-state-action" className={actionClasses}>
          {action}
        </div>
      ) : null}
      {children}
    </div>
  );
}
