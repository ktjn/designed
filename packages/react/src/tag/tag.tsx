import { CloseIcon } from "@ktjn/designed-icons";
import type { HTMLAttributes, ReactNode, Ref } from "react";
import { useI18nMessage } from "../designed-provider/i18n-provider.js";
import { useIconOverride } from "../designed-provider/icon-provider.js";
import styles from "./tag.module.css";

export type TagVariant = "neutral" | "info" | "success" | "warning" | "danger";
export type TagSize = "small" | "medium" | "large";

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>;
  variant?: TagVariant;
  size?: TagSize;
  onRemove?: () => void;
  removeLabel?: string;
  children?: ReactNode;
}

export function Tag({
  ref,
  variant = "neutral",
  size = "medium",
  onRemove,
  removeLabel,
  className,
  children,
  ...rest
}: TagProps) {
  const Icon = useIconOverride("close", CloseIcon);
  const resolvedRemoveLabel = useI18nMessage("remove", removeLabel, "Remove");
  const classes = [styles.root, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(" ");

  return (
    <span ref={ref} data-slot="tag" className={classes} {...rest}>
      <span data-slot="tag-label">{children}</span>
      {onRemove ? (
        <button
          type="button"
          data-slot="tag-remove"
          className={styles.remove}
          aria-label={resolvedRemoveLabel}
          onClick={onRemove}
        >
          <Icon aria-hidden />
        </button>
      ) : null}
    </span>
  );
}
