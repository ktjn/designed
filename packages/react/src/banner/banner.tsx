import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckIcon,
  CloseIcon,
  InfoIcon,
} from "@ktjn/designed-icons";
import type { HTMLAttributes, ReactNode, Ref } from "react";
import { useI18nMessage } from "../designed-provider/i18n-provider.js";
import { useIconOverride } from "../designed-provider/icon-provider.js";
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
  dismissLabel,
  children,
  role,
  className,
  ...rest
}: BannerProps) {
  const resolvedDismissLabel = useI18nMessage(
    "dismiss",
    dismissLabel,
    "Dismiss",
  );
  const InfoVariantIcon = useIconOverride("info", InfoIcon);
  const SuccessVariantIcon = useIconOverride("check", CheckIcon);
  const WarningVariantIcon = useIconOverride(
    "alertTriangle",
    AlertTriangleIcon,
  );
  const DangerVariantIcon = useIconOverride("alertCircle", AlertCircleIcon);
  const CloseButtonIcon = useIconOverride("close", CloseIcon);
  const defaultRole =
    variant === "danger" || variant === "warning" ? "alert" : "status";
  const classes = [styles.root, styles[variant], className]
    .filter(Boolean)
    .join(" ");
  const variantIcons = {
    info: InfoVariantIcon,
    success: SuccessVariantIcon,
    warning: WarningVariantIcon,
    danger: DangerVariantIcon,
  } as const;
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
          aria-label={resolvedDismissLabel}
          className={styles.dismiss}
          onClick={onDismiss}
        >
          <CloseButtonIcon aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
