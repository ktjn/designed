import { Separator as BaseSeparator } from "@base-ui/react/separator";
import type { ForwardedRef, HTMLAttributes } from "react";
import { forwardRef } from "react";
import styles from "./separator.module.css";

export type SeparatorOrientation = "horizontal" | "vertical";

export interface SeparatorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  orientation?: SeparatorOrientation;
}

function SeparatorImpl(
  { orientation = "horizontal", className, ...rest }: SeparatorProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const classes = [styles.root, className].filter(Boolean).join(" ");
  return (
    <BaseSeparator
      ref={ref}
      orientation={orientation}
      className={classes}
      {...rest}
    />
  );
}

export const Separator = forwardRef(SeparatorImpl);
Separator.displayName = "Separator";
