import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import type { HTMLAttributes, ReactNode, Ref } from "react";
import styles from "./avatar.module.css";

export type AvatarSize = "small" | "medium" | "large";

export interface AvatarProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  ref?: Ref<HTMLSpanElement>;
  src?: string;
  alt: string;
  fallback?: ReactNode;
  size?: AvatarSize;
}

export function Avatar({
  ref,
  src,
  alt,
  fallback,
  size = "medium",
  className,
  ...rest
}: AvatarProps) {
  const classes = [styles.root, styles[size], className]
    .filter(Boolean)
    .join(" ");

  return (
    <BaseAvatar.Root ref={ref} data-slot="avatar" className={classes} {...rest}>
      {src ? (
        <BaseAvatar.Image
          data-slot="avatar-image"
          src={src}
          alt={alt}
          className={styles.image}
        />
      ) : null}
      <BaseAvatar.Fallback
        data-slot="avatar-fallback"
        className={styles.fallback}
        aria-label={alt}
      >
        {fallback}
      </BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}
