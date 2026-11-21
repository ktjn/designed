import type { ForwardedRef, HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import styles from "./kbd.module.css";

export type KbdSize = "sm" | "md";

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  size?: KbdSize;
  children?: ReactNode;
}

function KbdImpl(
  { size = "md", className, ...rest }: KbdProps,
  ref: ForwardedRef<HTMLElement>,
) {
  const classes = [styles.root, className].filter(Boolean).join(" ");

  return (
    <kbd
      ref={ref}
      data-slot="kbd"
      data-size={size}
      className={classes}
      {...rest}
    />
  );
}

export const Kbd = forwardRef(KbdImpl);
Kbd.displayName = "Kbd";
