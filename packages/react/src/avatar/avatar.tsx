import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import type { ForwardedRef, HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import styles from "./avatar.module.css";

export type AvatarSize = "small" | "medium" | "large";

export interface AvatarProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  src?: string;
  alt: string;
  fallback?: ReactNode;
  size?: AvatarSize;
}

function AvatarImpl(
  { src, alt, fallback, size = "medium", className, ...rest }: AvatarProps,
  ref: ForwardedRef<HTMLSpanElement>,
) {
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

export const Avatar = forwardRef(AvatarImpl);
Avatar.displayName = "Avatar";
