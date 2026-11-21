import type { HTMLAttributes, ReactNode, Ref } from "react";
import styles from "./visually-hidden.module.css";

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>;
  children?: ReactNode;
}

export function VisuallyHidden({
  ref,
  className,
  ...rest
}: VisuallyHiddenProps) {
  const classes = [styles.root, className].filter(Boolean).join(" ");
  return (
    <span ref={ref} data-slot="visually-hidden" className={classes} {...rest} />
  );
}
