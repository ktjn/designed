import type { HTMLAttributes, ReactNode, Ref } from "react";
import styles from "./kbd.module.css";

export type KbdSize = "sm" | "md";

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>;
  size?: KbdSize;
  children?: ReactNode;
}

export function Kbd({ ref, size = "md", className, ...rest }: KbdProps) {
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
