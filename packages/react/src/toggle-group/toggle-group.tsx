import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import type { HTMLAttributes, ReactNode } from "react";
import { Toggle } from "../toggle/toggle.js";
import styles from "./toggle-group.module.css";

export type ToggleGroupOrientation = "horizontal" | "vertical";

export interface ToggleGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  value?: readonly string[];
  defaultValue?: readonly string[];
  onValueChange?: (value: string[]) => void;
  multiple?: boolean;
  disabled?: boolean;
  orientation?: ToggleGroupOrientation;
  loopFocus?: boolean;
  children?: ReactNode;
}

function ToggleGroupRoot({
  value,
  defaultValue,
  onValueChange,
  multiple = false,
  disabled,
  orientation = "horizontal",
  loopFocus = true,
  className,
  children,
  ...rest
}: ToggleGroupProps) {
  const classes = [styles.root, className].filter(Boolean).join(" ");

  return (
    <BaseToggleGroup
      data-slot="toggle-group"
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange ? (next) => onValueChange(next) : undefined}
      multiple={multiple}
      disabled={disabled}
      orientation={orientation}
      loopFocus={loopFocus}
      className={classes}
      {...rest}
    >
      {children}
    </BaseToggleGroup>
  );
}

export const ToggleGroup = Object.assign(ToggleGroupRoot, {
  Item: Toggle,
});
