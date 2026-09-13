import type { ReactNode } from "react";
import { useId, useMemo } from "react";
import styles from "./field.module.css";
import { FieldContext, type FieldContextValue } from "./field-context.js";
import { FieldDescription } from "./field-description.js";
import { FieldError } from "./field-error.js";
import { FieldLabel } from "./field-label.js";

export interface FieldRootProps {
  invalid?: boolean;
  disabled?: boolean;
  children?: ReactNode;
}

function FieldRoot({ invalid = false, disabled, children }: FieldRootProps) {
  const controlId = useId();
  const descriptionId = useId();
  const errorId = useId();
  // Referencing both ids unconditionally is a deliberate simplification: if a
  // consumer omits Field.Description or Field.Error, the control's
  // aria-describedby points at an id that doesn't exist in the DOM. Assistive
  // tech ignores dangling id references, so this is harmless in practice and
  // avoids a mount-order presence-tracking registry for a static composition.
  const value = useMemo<FieldContextValue>(
    () => ({
      controlId,
      descriptionId,
      errorId,
      describedBy: `${descriptionId} ${errorId}`,
      invalid,
    }),
    [controlId, descriptionId, errorId, invalid],
  );

  return (
    <div
      className={styles.root}
      data-disabled={disabled || undefined}
      data-invalid={invalid || undefined}
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
