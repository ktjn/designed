import type { HTMLAttributes, Ref } from "react";
import styles from "./color-swatch.module.css";

export type ColorSwatchSize = "small" | "medium" | "large";

export interface ColorSwatchProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>;
  value: string;
  size?: ColorSwatchSize;
  label?: string;
}

export function ColorSwatch({
  ref,
  value,
  size = "medium",
  label,
  className,
  style,
  ...rest
}: ColorSwatchProps) {
  const classes = [styles.root, styles[size], className]
    .filter(Boolean)
    .join(" ");

  return (
    <span
      ref={ref}
      data-slot="color-swatch"
      role="img"
      aria-label={label ?? value}
      className={classes}
      style={{ ...style, "--color-swatch-value": value } as never}
      {...rest}
    />
  );
}
