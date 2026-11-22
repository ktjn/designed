import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import type { HTMLAttributes, ReactNode, Ref } from "react";
import { useFieldContext } from "../field/field-context.js";
import type { ChangeEventDetails } from "../shared/change-event-details.js";
import styles from "./checkbox-group.module.css";

export type CheckboxGroupOrientation = "horizontal" | "vertical";

export interface CheckboxGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  ref?: Ref<HTMLDivElement>;
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[], eventDetails?: ChangeEventDetails) => void;
  allValues?: string[];
  disabled?: boolean;
  orientation?: CheckboxGroupOrientation;
  children?: ReactNode;
}

export function CheckboxGroup({
  disabled,
  orientation = "vertical",
  onValueChange,
  className,
  ...rest
}: CheckboxGroupProps) {
  const field = useFieldContext();
  const classes = [styles.root, className].filter(Boolean).join(" ");
  return (
    <BaseCheckboxGroup
      data-slot="checkbox-group"
      data-orientation={orientation}
      disabled={disabled ?? field?.disabled}
      onValueChange={(value, eventDetails) =>
        onValueChange?.(value, eventDetails)
      }
      className={classes}
      {...rest}
    />
  );
}
