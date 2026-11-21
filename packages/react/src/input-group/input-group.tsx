import type {
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  Ref,
} from "react";
import { useFieldContext, useFieldControlId } from "../field/field-context.js";
import styles from "./input-group.module.css";

export interface InputGroupRootProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  invalid?: boolean;
  children?: ReactNode;
}

function InputGroupRoot({
  ref,
  invalid,
  className,
  ...rest
}: InputGroupRootProps) {
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

export type InputGroupAddonAlign = "start" | "end";

export interface InputGroupAddonProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>;
  align?: InputGroupAddonAlign;
  children?: ReactNode;
}

function InputGroupAddon({
  ref,
  align = "start",
  className,
  ...rest
}: InputGroupAddonProps) {
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

export interface InputGroupInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>;
  invalid?: boolean;
}

function InputGroupInput({
  ref,
  invalid,
  disabled,
  id,
  className,
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  ...rest
}: InputGroupInputProps) {
  const field = useFieldContext();
  const resolvedId = useFieldControlId(id);
  const resolvedInvalid = invalid ?? field?.invalid ?? false;
  const resolvedDisabled = disabled ?? field?.disabled ?? false;
  const classes = [styles.input, className].filter(Boolean).join(" ");

  return (
    <input
      ref={ref}
      data-slot="input-group-input"
      id={resolvedId}
      disabled={resolvedDisabled}
      aria-describedby={ariaDescribedBy ?? field?.describedBy}
      aria-invalid={ariaInvalid ?? (resolvedInvalid || undefined)}
      className={classes}
      {...rest}
    />
  );
}

export const InputGroup = Object.assign(InputGroupRoot, {
  Addon: InputGroupAddon,
  Input: InputGroupInput,
});
