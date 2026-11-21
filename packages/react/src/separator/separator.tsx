import { Separator as BaseSeparator } from "@base-ui/react/separator";
import type { HTMLAttributes, Ref } from "react";
import styles from "./separator.module.css";

export type SeparatorOrientation = "horizontal" | "vertical";

export interface SeparatorProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  ref?: Ref<HTMLDivElement>;
  orientation?: SeparatorOrientation;
}

export function Separator({
  ref,
  orientation = "horizontal",
  className,
  ...rest
}: SeparatorProps) {
  const classes = [styles.root, className].filter(Boolean).join(" ");
  return (
    <BaseSeparator
      ref={ref}
      data-slot="separator"
      orientation={orientation}
      className={classes}
      {...rest}
    />
  );
}
