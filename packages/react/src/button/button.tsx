import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";
import styles from "./button.module.css";

export type ButtonVariant = "primary" | "secondary" | "danger";
export type ButtonSize = "medium";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: ReactNode;
}

function ButtonImpl(
  {
    variant = "primary",
    size = "medium",
    type = "button",
    ...rest
  }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  void size;
  return (
    <button
      ref={ref}
      type={type}
      className={`${styles.root} ${styles[variant]}`}
      {...rest}
    />
  );
}

export const Button = forwardRef(ButtonImpl);
Button.displayName = "Button";
