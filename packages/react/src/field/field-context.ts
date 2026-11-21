import { createContext, useContext, useLayoutEffect } from "react";

export interface FieldContextValue {
  controlId: string;
  descriptionId: string;
  errorId: string;
  describedBy: string;
  invalid: boolean;
  disabled: boolean;
  registerControlId: (id: string | undefined) => void;
}

export const FieldContext = createContext<FieldContextValue | null>(null);

export function useFieldContext(): FieldContextValue | null {
  return useContext(FieldContext);
}

export function useFieldControlId(
  explicitId: string | undefined,
): string | undefined {
  const field = useFieldContext();
  const registerControlId = field?.registerControlId;

  useLayoutEffect(() => {
    if (!registerControlId || !explicitId) return;
    registerControlId(explicitId);
    return () => registerControlId(undefined);
  }, [explicitId, registerControlId]);

  return explicitId ?? field?.controlId;
}
