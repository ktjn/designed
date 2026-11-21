import type { ButtonHTMLAttributes, ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";
import styles from "./button.module.css";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "small" | "medium" | "large" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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
    className,
    children,
    ...rest
  }: ButtonProps,
  ref: ForwardedRef<HTMLButtonElement>,
) {
  const classes = [styles.root, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(" ");
  return (
    <button
      ref={ref}
      type={type}
      data-slot="button"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes}
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
