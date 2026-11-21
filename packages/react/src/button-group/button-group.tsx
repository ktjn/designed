import type { HTMLAttributes, ReactNode, Ref } from "react";
import styles from "./button-group.module.css";

export type ButtonGroupOrientation = "horizontal" | "vertical";

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  orientation?: ButtonGroupOrientation;
  children?: ReactNode;
}

export function ButtonGroup({
  ref,
  orientation = "horizontal",
  className,
  ...rest
}: ButtonGroupProps) {
  const classes = [styles.root, className].filter(Boolean).join(" ");

  return (
    // biome-ignore lint/a11y/useSemanticElements: ButtonGroup groups action buttons, not form controls; fieldset breaks inline flex layout across browsers
    <div
      ref={ref}
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={classes}
      {...rest}
    />
  );
}
