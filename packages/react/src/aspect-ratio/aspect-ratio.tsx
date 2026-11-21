import type { ForwardedRef, HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import styles from "./aspect-ratio.module.css";

export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  ratio?: number;
  children?: ReactNode;
}

function AspectRatioImpl(
  { ratio = 16 / 9, className, style, ...rest }: AspectRatioProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
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

export const AspectRatio = forwardRef(AspectRatioImpl);
AspectRatio.displayName = "AspectRatio";
