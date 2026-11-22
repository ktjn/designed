import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckIcon,
  InfoIcon,
  MinusIcon,
} from "@ktjn/designed-icons";
import type { HTMLAttributes, ReactNode, Ref } from "react";
import styles from "./status-indicator.module.css";

export type StatusIndicatorVariant =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger"
  | "pending"
  | "loading";

export interface StatusIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>;
  variant?: StatusIndicatorVariant;
  pulse?: boolean;
  children?: ReactNode;
}

const variantIcons = {
  neutral: MinusIcon,
  info: InfoIcon,
  success: CheckIcon,
  warning: AlertTriangleIcon,
  danger: AlertCircleIcon,
} as const;

export function StatusIndicator({
  ref,
  variant = "neutral",
  pulse = false,
  className,
  children,
  ...rest
}: StatusIndicatorProps) {
  const classes = [styles.root, styles[variant], className]
    .filter(Boolean)
    .join(" ");
  const hasLabel =
    children != null && typeof children !== "boolean" && children !== "";

  const renderCue = () => {
    if (variant === "pending") {
      return (
        <span
          data-slot="status-indicator-dot"
          aria-hidden="true"
          className={styles.dot}
        />
      );
    }

    if (variant === "loading") {
      return (
        <span
          data-slot="status-indicator-spinner"
          aria-hidden="true"
          className={styles.spinner}
        />
      );
    }

    const Icon = variantIcons[variant];
    return <Icon aria-hidden="true" className={styles.icon} />;
  };

  return (
    <span
      ref={ref}
      data-slot="status-indicator"
      data-variant={variant}
      data-pulse={pulse ? "" : undefined}
      className={classes}
      {...rest}
    >
      <span className={styles.indicator} aria-hidden="true">
        {renderCue()}
      </span>
      {hasLabel ? (
        <span data-slot="status-indicator-label" className={styles.label}>
          {children}
        </span>
      ) : null}
    </span>
  );
}
