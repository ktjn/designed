import { Fieldset as BaseFieldset } from "@base-ui/react/fieldset";
import type { FieldsetHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import styles from "./fieldset.module.css";

export interface FieldsetRootProps
  extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  children?: ReactNode;
}

export interface FieldsetLegendProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

function FieldsetRoot({
  disabled,
  className,
  children,
  ...rest
}: FieldsetRootProps) {
  const classes = [styles.root, className].filter(Boolean).join(" ");
  return (
    <BaseFieldset.Root
      data-slot="fieldset"
      disabled={disabled}
      className={classes}
      {...rest}
    >
      {children}
    </BaseFieldset.Root>
  );
}

function FieldsetLegend({ className, children, ...rest }: FieldsetLegendProps) {
  const classes = [styles.legend, className].filter(Boolean).join(" ");
  return (
    <BaseFieldset.Legend
      data-slot="fieldset-legend"
      className={classes}
      {...rest}
    >
      {children}
    </BaseFieldset.Legend>
  );
}

export const Fieldset = Object.assign(FieldsetRoot, {
  Legend: FieldsetLegend,
});
