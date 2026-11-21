import { Progress as BaseProgress } from "@base-ui/react/progress";
import type { HTMLAttributes, ReactNode, Ref } from "react";
import styles from "./progress.module.css";

export interface ProgressProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  ref?: Ref<HTMLDivElement>;
  value: number | null;
  min?: number;
  max?: number;
  label?: ReactNode;
  showValue?: boolean;
}

export function Progress({
  ref,
  value,
  min = 0,
  max = 100,
  label,
  showValue = false,
  className,
  ...rest
}: ProgressProps) {
  const classes = [styles.root, className].filter(Boolean).join(" ");

  return (
    <BaseProgress.Root
      ref={ref}
      data-slot="progress"
      value={value}
      min={min}
      max={max}
      className={classes}
      {...rest}
    >
      {label || showValue ? (
        <div className={styles.header}>
          {label ? (
            <BaseProgress.Label className={styles.label}>
              {label}
            </BaseProgress.Label>
          ) : null}
          {showValue && value !== null ? (
            <BaseProgress.Value className={styles.value} />
          ) : null}
        </div>
      ) : null}
      <BaseProgress.Track data-slot="progress-track" className={styles.track}>
        <BaseProgress.Indicator
          data-slot="progress-indicator"
          className={styles.indicator}
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}
