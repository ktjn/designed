import type { HTMLAttributes, ReactNode, Ref } from "react";
import { useLayoutEffect } from "react";
import styles from "./field.module.css";
import { useFieldContext } from "./field-context.js";

export interface FieldDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  ref?: Ref<HTMLParagraphElement>;
  children?: ReactNode;
}

export function FieldDescription({
  ref,
  id,
  className,
  children,
  ...rest
}: FieldDescriptionProps) {
  const field = useFieldContext();
  const registerDescription = field?.registerDescription;

  useLayoutEffect(() => {
    if (!registerDescription) return;
    registerDescription(true);
    return () => registerDescription(false);
  }, [registerDescription]);

  return (
    <p
      ref={ref}
      data-slot="field-description"
      id={id ?? field?.descriptionId}
      className={
        className ? `${styles.description} ${className}` : styles.description
      }
      {...rest}
    >
      {children}
    </p>
  );
}
