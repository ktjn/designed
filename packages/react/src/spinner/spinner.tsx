import type { ForwardedRef, HTMLAttributes } from "react";
import { forwardRef } from "react";
import styles from "./spinner.module.css";

export type SpinnerSize = "small" | "medium" | "large";

export interface SpinnerProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  size?: SpinnerSize;
  label?: string;
}

function SpinnerImpl(
  { size = "medium", label = "Loading", className, ...rest }: SpinnerProps,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  const classes = [styles.root, styles[size], className]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      ref={ref}
      data-slot="spinner"
      role="status"
      className={classes}
      {...rest}
    >
      <span className={styles.indicator} aria-hidden="true" />
      <span className={styles.srOnly}>{label}</span>
    </span>
  );
}

export const Spinner = forwardRef(SpinnerImpl);
Spinner.displayName = "Spinner";
