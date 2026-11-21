import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import styles from "./button.module.css";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "small" | "medium" | "large" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children?: ReactNode;
}

export function Button({
  ref,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled,
  type = "button",
  className,
  onClick,
  "aria-disabled": ariaDisabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      data-slot="button"
      data-loading={loading ? "" : undefined}
      disabled={disabled}
      aria-disabled={ariaDisabled ?? (loading || undefined)}
      aria-busy={loading || undefined}
      onClick={loading ? (event) => event.preventDefault() : onClick}
      className={`${styles.root} ${styles[variant]} ${styles[size]}${className ? ` ${className}` : ""}`}
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
