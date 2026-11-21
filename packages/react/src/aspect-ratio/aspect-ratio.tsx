import type { HTMLAttributes, ReactNode, Ref } from "react";
import styles from "./aspect-ratio.module.css";

export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  ratio?: number;
  children?: ReactNode;
}

export function AspectRatio({
  ref,
  ratio = 16 / 9,
  className,
  style,
  ...rest
}: AspectRatioProps) {
  const classes = [styles.root, className].filter(Boolean).join(" ");

  return (
    <div
      ref={ref}
      data-slot="aspect-ratio"
      className={classes}
      style={{ ...style, aspectRatio: String(ratio) }}
      {...rest}
    />
  );
}
