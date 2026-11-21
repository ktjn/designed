import type { HTMLAttributes, ReactNode, Ref } from "react";
import styles from "./stack.module.css";

export type StackDirection = "vertical" | "horizontal";
export type StackGap = "none" | "sm" | "md" | "lg";
export type StackAlign = "start" | "center" | "end" | "stretch" | "baseline";
export type StackJustify = "start" | "center" | "end" | "between";

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  direction?: StackDirection;
  gap?: StackGap;
  align?: StackAlign;
  justify?: StackJustify;
  wrap?: boolean;
  children?: ReactNode;
}

export function Stack({
  ref,
  direction = "vertical",
  gap = "md",
  align,
  justify,
  wrap = false,
  className,
  ...rest
}: StackProps) {
  const classes = [styles.root, className].filter(Boolean).join(" ");

  return (
    <div
      ref={ref}
      data-slot="stack"
      data-direction={direction}
      data-gap={gap}
      data-align={align}
      data-justify={justify}
      data-wrap={wrap ? "" : undefined}
      className={classes}
      {...rest}
    />
  );
}
