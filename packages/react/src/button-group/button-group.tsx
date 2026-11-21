import type { ForwardedRef, HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import styles from "./button-group.module.css";

export type ButtonGroupOrientation = "horizontal" | "vertical";

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: ButtonGroupOrientation;
  children?: ReactNode;
}

function ButtonGroupImpl(
  { orientation = "horizontal", className, ...rest }: ButtonGroupProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
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

export const ButtonGroup = forwardRef(ButtonGroupImpl);
ButtonGroup.displayName = "ButtonGroup";
