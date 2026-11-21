import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";
import styles from "./button.module.css";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "small" | "medium" | "large" | "icon";

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children?: ReactNode;
}

function ButtonImpl(
  {
    variant = "primary",
    size = "medium",
    loading = false,
    disabled,
    type = "button",
    children,
    ...rest
  }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  return (
    <button
      ref={ref}
      type={type}
      data-slot="button"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`${styles.root} ${styles[variant]} ${styles[size]}`}
      {...rest}
    >
      {loading ? (
        <span
          className={styles.spinner}
          data-loading-indicator=""
          aria-hidden="true"
        />
      ) : null}
      {children}
    </button>
  );
}

export const Button = forwardRef(ButtonImpl);
Button.displayName = "Button";
