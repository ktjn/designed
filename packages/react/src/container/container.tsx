import type { ForwardedRef, HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import styles from "./container.module.css";

export type ContainerSize = "sm" | "md" | "lg" | "full";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
  padded?: boolean;
  children?: ReactNode;
}

function ContainerImpl(
  { size = "lg", padded = true, className, ...rest }: ContainerProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
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

export const Container = forwardRef(ContainerImpl);
Container.displayName = "Container";
