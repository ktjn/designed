import type {
  ForwardedRef,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import { forwardRef } from "react";
import { useFieldContext } from "../field/field-context.js";
import styles from "./input-group.module.css";

export interface InputGroupRootProps extends HTMLAttributes<HTMLDivElement> {
  invalid?: boolean;
  children?: ReactNode;
}

function InputGroupRootImpl(
  { invalid, className, ...rest }: InputGroupRootProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const field = useFieldContext();
  const resolvedInvalid = invalid ?? field?.invalid ?? false;
  const classes = [styles.root, className].filter(Boolean).join(" ");

  return (
    <div
      ref={ref}
      data-slot="input-group"
      data-invalid={resolvedInvalid ? "" : undefined}
      className={classes}
      {...rest}
    />
  );
}

const InputGroupRoot = forwardRef(InputGroupRootImpl);
InputGroupRoot.displayName = "InputGroup";

export type InputGroupAddonAlign = "start" | "end";

export interface InputGroupAddonProps extends HTMLAttributes<HTMLSpanElement> {
  align?: InputGroupAddonAlign;
  children?: ReactNode;
}

function InputGroupAddonImpl(
  { align = "start", className, ...rest }: InputGroupAddonProps,
  ref: ForwardedRef<HTMLSpanElement>,
) {
  const classes = [styles.addon, className].filter(Boolean).join(" ");

  return (
    <span
      ref={ref}
      data-slot="input-group-addon"
      data-align={align}
      className={classes}
      {...rest}
    />
  );
}

const InputGroupAddon = forwardRef(InputGroupAddonImpl);
InputGroupAddon.displayName = "InputGroupAddon";

export interface InputGroupInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

function InputGroupInputImpl(
  {
    invalid,
    id,
    className,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
    ...rest
  }: InputGroupInputProps,
  ref: ForwardedRef<HTMLInputElement>,
) {
  const field = useFieldContext();
  const resolvedInvalid = invalid ?? field?.invalid ?? false;
  const classes = [styles.input, className].filter(Boolean).join(" ");

  return (
    <input
      ref={ref}
      data-slot="input-group-input"
      id={id ?? field?.controlId}
      aria-describedby={ariaDescribedBy ?? field?.describedBy}
      aria-invalid={ariaInvalid ?? (resolvedInvalid || undefined)}
      className={classes}
      {...rest}
    />
  );
}

const InputGroupInput = forwardRef(InputGroupInputImpl);
InputGroupInput.displayName = "InputGroupInput";

export const InputGroup = Object.assign(InputGroupRoot, {
  Addon: InputGroupAddon,
  Input: InputGroupInput,
});
