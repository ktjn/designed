import { Meter as BaseMeter } from "@base-ui/react/meter";
import type { ForwardedRef, HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import styles from "./meter.module.css";

export type MeterVariant = "default" | "success" | "warning" | "danger";

export interface MeterProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  value: number;
  min?: number;
  max?: number;
  label?: ReactNode;
  showValue?: boolean;
  variant?: MeterVariant;
}

function MeterImpl(
  {
    value,
    min = 0,
    max = 100,
    label,
    showValue = false,
    variant = "default",
    className,
    ...rest
  }: MeterProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const classes = [
    styles.root,
    variant !== "default" ? styles[variant] : undefined,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <BaseMeter.Root
      ref={ref}
      data-slot="meter"
      value={value}
      min={min}
      max={max}
      className={classes}
      {...rest}
    >
      {label || showValue ? (
        <div className={styles.header}>
          {label ? (
            <BaseMeter.Label className={styles.label}>{label}</BaseMeter.Label>
          ) : null}
          {showValue ? <BaseMeter.Value className={styles.value} /> : null}
        </div>
      ) : null}
      <BaseMeter.Track data-slot="meter-track" className={styles.track}>
        <BaseMeter.Indicator
          data-slot="meter-indicator"
          className={styles.indicator}
        />
      </BaseMeter.Track>
    </BaseMeter.Root>
  );
}

export const Meter = forwardRef(MeterImpl);
Meter.displayName = "Meter";
