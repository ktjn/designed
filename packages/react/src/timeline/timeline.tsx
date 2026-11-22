import type { HTMLAttributes, ReactNode, Ref } from "react";
import styles from "./timeline.module.css";

export type TimelineBadgeVariant =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger";

export interface TimelineRootProps extends HTMLAttributes<HTMLOListElement> {
  ref?: Ref<HTMLOListElement>;
  children?: ReactNode;
}

export interface TimelineItemProps extends HTMLAttributes<HTMLLIElement> {
  ref?: Ref<HTMLLIElement>;
  children?: ReactNode;
}

export interface TimelineBadgeProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  variant?: TimelineBadgeVariant;
  children?: ReactNode;
}

export interface TimelineBodyProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  timestamp?: ReactNode;
  children?: ReactNode;
}

function hasRenderableContent(node: ReactNode): boolean {
  return node != null && typeof node !== "boolean" && node !== "";
}

function TimelineRoot({ ref, className, ...rest }: TimelineRootProps) {
  const classes = [styles.root, className].filter(Boolean).join(" ");
  return <ol ref={ref} data-slot="timeline" className={classes} {...rest} />;
}

function TimelineItem({ ref, className, ...rest }: TimelineItemProps) {
  const classes = [styles.item, className].filter(Boolean).join(" ");
  return (
    <li ref={ref} data-slot="timeline-item" className={classes} {...rest} />
  );
}

function TimelineBadge({
  ref,
  variant = "neutral",
  className,
  children,
  ...rest
}: TimelineBadgeProps) {
  const classes = [styles.badge, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      data-slot="timeline-badge"
      data-variant={variant}
      className={classes}
      {...rest}
    >
      {hasRenderableContent(children) ? (
        children
      ) : (
        <span
          data-slot="timeline-dot"
          aria-hidden="true"
          className={styles.dot}
        />
      )}
    </div>
  );
}

function TimelineBody({
  ref,
  timestamp,
  className,
  children,
  ...rest
}: TimelineBodyProps) {
  const classes = [styles.body, className].filter(Boolean).join(" ");

  return (
    <div ref={ref} data-slot="timeline-body" className={classes} {...rest}>
      {hasRenderableContent(timestamp) ? (
        <div data-slot="timeline-timestamp" className={styles.timestamp}>
          {timestamp}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export const Timeline = Object.assign(TimelineRoot, {
  Item: TimelineItem,
  Badge: TimelineBadge,
  Body: TimelineBody,
});
