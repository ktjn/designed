import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckIcon,
  CloseIcon,
  InfoIcon,
} from "@ktjn/designed-icons";
import type { HTMLAttributes, ReactNode, Ref } from "react";
import styles from "./banner.module.css";

export type BannerVariant = "info" | "success" | "warning" | "danger";

export interface BannerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  ref?: Ref<HTMLDivElement>;
  variant?: BannerVariant;
  title?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  onDismiss?: () => void;
  dismissLabel?: string;
  children?: ReactNode;
}

const variantIcons = {
  info: InfoIcon,
  success: CheckIcon,
  warning: AlertTriangleIcon,
  danger: AlertCircleIcon,
} as const;

function hasRenderableContent(node: ReactNode): boolean {
  return node != null && typeof node !== "boolean" && node !== "";
}

export function Banner({
  ref,
  variant = "info",
  title,
  icon,
  action,
  onDismiss,
  dismissLabel = "Dismiss",
  children,
  role,
  className,
  ...rest
}: BannerProps) {
  const defaultRole =
    variant === "danger" || variant === "warning" ? "alert" : "status";
  const classes = [styles.root, styles[variant], className]
    .filter(Boolean)
    .join(" ");
  const DefaultIcon = variantIcons[variant];
  const resolvedIcon =
    icon === undefined ? (
      <DefaultIcon aria-hidden="true" />
    ) : hasRenderableContent(icon) ? (
      icon
    ) : null;
  const hasTitle = hasRenderableContent(title);
  const hasChildren = hasRenderableContent(children);
  const hasAction = hasRenderableContent(action);

  return (
    <div
      ref={ref}
      data-slot="banner"
      data-variant={variant}
      role={role ?? defaultRole}
      className={classes}
      {...rest}
    >
      {resolvedIcon !== null ? (
        <div data-slot="banner-icon" className={styles.icon}>
          {resolvedIcon}
        </div>
      ) : null}
      <div data-slot="banner-body" className={styles.body}>
        {hasTitle ? (
          <div data-slot="banner-title" className={styles.title}>
            {title}
          </div>
        ) : null}
        {hasChildren ? (
          <div data-slot="banner-content" className={styles.content}>
            {children}
          </div>
        ) : null}
      </div>
      {hasAction ? (
        <div data-slot="banner-action" className={styles.action}>
          {action}
        </div>
      ) : null}
      {onDismiss ? (
        <button
          type="button"
          data-slot="banner-dismiss"
          aria-label={dismissLabel}
          className={styles.dismiss}
          onClick={onDismiss}
        >
          <CloseIcon aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
