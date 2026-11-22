import type { HTMLAttributes, ReactNode, Ref } from "react";
import { useCallback, useId, useMemo, useState } from "react";
import styles from "./field.module.css";
import { FieldContext, type FieldContextValue } from "./field-context.js";
import { FieldDescription } from "./field-description.js";
import { FieldError } from "./field-error.js";
import { FieldLabel } from "./field-label.js";

export interface FieldRootProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  controlId?: string;
  invalid?: boolean;
  disabled?: boolean;
  children?: ReactNode;
}

function FieldRoot({
  controlId: explicitControlId,
  invalid = false,
  disabled = false,
  className,
  children,
  ...rest
}: FieldRootProps) {
  const generatedControlId = useId();
  const [registeredControlId, setRegisteredControlId] = useState<
    string | undefined
  >(undefined);
  const [hasDescription, setHasDescription] = useState(false);
  const [hasError, setHasError] = useState(false);
  const descriptionId = useId();
  const errorId = useId();
  const controlId =
    explicitControlId ?? registeredControlId ?? generatedControlId;

  const registerControlId = useCallback((id: string | undefined) => {
    setRegisteredControlId(id);
  }, []);

  const registerDescription = useCallback((mounted: boolean) => {
    setHasDescription(mounted);
  }, []);

  const registerError = useCallback((mounted: boolean) => {
    setHasError(mounted);
  }, []);

  const describedBy =
    [hasDescription ? descriptionId : null, hasError ? errorId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  const value = useMemo<FieldContextValue>(
    () => ({
      controlId,
      descriptionId,
      errorId,
      describedBy,
      invalid,
      disabled,
      registerControlId,
      registerDescription,
      registerError,
    }),
    [
      controlId,
      descriptionId,
      errorId,
      describedBy,
      invalid,
      disabled,
      registerControlId,
      registerDescription,
      registerError,
    ],
  );

  return (
    <div
      data-slot="field"
      className={className ? `${styles.root} ${className}` : styles.root}
      data-disabled={disabled || undefined}
      data-invalid={invalid || undefined}
      {...rest}
    >
      <FieldContext.Provider value={value}>{children}</FieldContext.Provider>
    </div>
  );
}

export const Field = Object.assign(FieldRoot, {
  Label: FieldLabel,
  Description: FieldDescription,
  Error: FieldError,
});
