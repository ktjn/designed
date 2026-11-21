import type { HTMLAttributes, ReactNode, Ref } from "react";
import { useLayoutEffect } from "react";
import styles from "./field.module.css";
import { useFieldContext } from "./field-context.js";

export interface FieldErrorProps extends HTMLAttributes<HTMLParagraphElement> {
  ref?: Ref<HTMLParagraphElement>;
  children?: ReactNode;
}

export function FieldError({
  ref,
  id,
  className,
  children,
  ...rest
}: FieldErrorProps) {
  const field = useFieldContext();
  const registerError = field?.registerError;
  const hasContent = Boolean(children);

  useLayoutEffect(() => {
    if (!registerError) return;
    registerError(hasContent);
    return () => registerError(false);
  }, [registerError, hasContent]);

  if (!hasContent) {
    return null;
  }
  return (
    <p
      ref={ref}
      data-slot="field-error"
      id={id ?? field?.errorId}
      role="alert"
      className={className ? `${styles.error} ${className}` : styles.error}
      {...rest}
    >
      {children}
    </p>
  );
}
