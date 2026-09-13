import type { ForwardedRef, InputHTMLAttributes } from "react";
import { forwardRef } from "react";
import { useFieldContext } from "../field/field-context.js";
import styles from "./input.module.css";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  invalid?: boolean;
}

function InputImpl(
  {
    invalid,
    id,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    ...rest
  }: InputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const field = useFieldContext();
  const resolvedInvalid = invalid ?? field?.invalid ?? false;
  return (
    <input
      ref={ref}
      id={id ?? field?.controlId}
      aria-describedby={ariaDescribedBy ?? field?.describedBy}
      aria-invalid={ariaInvalid ?? (resolvedInvalid || undefined)}
      className={
        resolvedInvalid ? `${styles.root} ${styles.invalid}` : styles.root
      }
      {...rest}
    />
  );
}

export const Input = forwardRef(InputImpl);
Input.displayName = "Input";
