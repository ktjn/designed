import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import type { ButtonHTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import styles from "./toggle.module.css";

export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onChange"> {
  ref?: Ref<HTMLButtonElement>;
  render?: ReactElement;
  nativeButton?: boolean;
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  value?: string;
  children?: ReactNode;
}

export function Toggle({
  ref,
  pressed,
  defaultPressed,
  onPressedChange,
  value,
  disabled,
  className,
  children,
  ...rest
}: ToggleProps) {
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
