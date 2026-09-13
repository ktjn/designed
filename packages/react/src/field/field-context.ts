import { createContext, useContext } from "react";

export interface FieldContextValue {
  controlId: string;
  descriptionId: string;
  errorId: string;
  describedBy: string;
  invalid: boolean;
}

export const FieldContext = createContext<FieldContextValue | null>(null);

export function useFieldContext(): FieldContextValue | null {
  return useContext(FieldContext);
}
