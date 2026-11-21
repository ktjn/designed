import { CloseIcon } from "@ktjn/design-icons";
import type { ForwardedRef, HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import styles from "./tag.module.css";

export type TagVariant = "neutral" | "info" | "success" | "warning" | "danger";

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: TagVariant;
  onRemove?: () => void;
  removeLabel?: string;
  children?: ReactNode;
}

function TagImpl(
  {
    variant = "neutral",
    onRemove,
    removeLabel = "Remove",
    className,
    children,
    ...rest
  }: TagProps,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  const classes = [styles.root, styles[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <span ref={ref} className={classes} {...rest}>
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

export const Tag = forwardRef(TagImpl);
Tag.displayName = "Tag";
