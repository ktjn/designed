import { CloseIcon } from "@ktjn/design-icons";
import type { HTMLAttributes, ReactNode, Ref } from "react";
import styles from "./tag.module.css";

export type TagVariant = "neutral" | "info" | "success" | "warning" | "danger";

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>;
  variant?: TagVariant;
  onRemove?: () => void;
  removeLabel?: string;
  children?: ReactNode;
}

export function Tag({
  ref,
  variant = "neutral",
  onRemove,
  removeLabel = "Remove",
  className,
  children,
  ...rest
}: TagProps) {
  const classes = [styles.root, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <span ref={ref} data-slot="tag" className={classes} {...rest}>
      <span>{children}</span>
      {onRemove ? (
        <button
          type="button"
          className={styles.remove}
          aria-label={removeLabel}
          onClick={onRemove}
        >
          <CloseIcon aria-hidden />
        </button>
      ) : null}
    </span>
  );
}
