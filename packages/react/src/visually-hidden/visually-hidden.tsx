import type { ForwardedRef, HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import styles from "./visually-hidden.module.css";

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
}

function VisuallyHiddenImpl(
  { className, ...rest }: VisuallyHiddenProps,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  const classes = [styles.root, className].filter(Boolean).join(" ");
  return (
    <span ref={ref} data-slot="visually-hidden" className={classes} {...rest} />
  );
}

export const VisuallyHidden = forwardRef(VisuallyHiddenImpl);
VisuallyHidden.displayName = "VisuallyHidden";
