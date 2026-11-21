import type { HTMLAttributes, ReactNode, Ref } from "react";
import styles from "./container.module.css";

export type ContainerSize = "sm" | "md" | "lg" | "full";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  size?: ContainerSize;
  padded?: boolean;
  children?: ReactNode;
}

export function Container({
  ref,
  size = "lg",
  padded = true,
  className,
  ...rest
}: ContainerProps) {
  const classes = [styles.root, className].filter(Boolean).join(" ");

  return (
    <div
      ref={ref}
      data-slot="container"
      data-size={size}
      data-padded={padded ? "" : undefined}
      className={classes}
      {...rest}
    />
  );
}
