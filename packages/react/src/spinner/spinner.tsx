import type { HTMLAttributes, Ref } from "react";
import styles from "./spinner.module.css";

export type SpinnerSize = "small" | "medium" | "large";

export interface SpinnerProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  ref?: Ref<HTMLSpanElement>;
  size?: SpinnerSize;
  label?: string;
}

export function Spinner({
  ref,
  size = "medium",
  label = "Loading",
  className,
  ...rest
}: SpinnerProps) {
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
