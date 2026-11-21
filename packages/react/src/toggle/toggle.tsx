import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";
import styles from "./toggle.module.css";

export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onChange"> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  value?: string;
  children?: ReactNode;
}

function ToggleImpl(
  {
    pressed,
    defaultPressed,
    onPressedChange,
    value,
    disabled,
    className,
    children,
    ...rest
  }: ToggleProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const classes = [styles.root, className].filter(Boolean).join(" ");

  return (
    <BaseToggle
      ref={ref}
      data-slot="toggle"
      pressed={pressed}
      defaultPressed={defaultPressed}
      onPressedChange={
        onPressedChange ? (next) => onPressedChange(next) : undefined
      }
      value={value}
      disabled={disabled}
      className={classes}
      {...rest}
    >
      {children}
    </BaseToggle>
  );
}

export const Toggle = forwardRef(ToggleImpl);
Toggle.displayName = "Toggle";
