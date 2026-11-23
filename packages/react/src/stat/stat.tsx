import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "@ktjn/designed-icons";
import type { HTMLAttributes, ReactNode, Ref } from "react";
import { useIconOverride } from "../designed-provider/icon-provider.js";
import styles from "./stat.module.css";

export type StatTrend = "up" | "down" | "neutral";

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  label: ReactNode;
  value: ReactNode;
  delta?: ReactNode;
  trend?: StatTrend;
  helpText?: ReactNode;
  children?: ReactNode;
}

export function Stat({
  ref,
  label,
  value,
  delta,
  trend = "neutral",
  helpText,
  className,
  children,
  ...rest
}: StatProps) {
  const UpIcon = useIconOverride("arrowUp", ArrowUpIcon);
  const DownIcon = useIconOverride("arrowDown", ArrowDownIcon);
  const NeutralIcon = useIconOverride("minus", MinusIcon);
  const trendIcons = {
    up: UpIcon,
    down: DownIcon,
    neutral: NeutralIcon,
  } as const;
  const classes = [styles.root, className].filter(Boolean).join(" ");
  const deltaClasses = [styles.delta, styles[trend]].filter(Boolean).join(" ");
  const TrendIcon = trendIcons[trend];
  const hasDelta = delta != null && typeof delta !== "boolean" && delta !== "";
  const hasHelpText =
    helpText != null && typeof helpText !== "boolean" && helpText !== "";

  return (
    <div ref={ref} data-slot="stat" className={classes} {...rest}>
      <span data-slot="stat-label" className={styles.label}>
        {label}
      </span>
      <span data-slot="stat-value" className={styles.value}>
        {value}
      </span>
      {hasDelta ? (
        <span
          data-slot="stat-delta"
          data-trend={trend}
          className={deltaClasses}
        >
          <TrendIcon aria-hidden="true" className={styles.trendIcon} />
          {delta}
        </span>
      ) : null}
      {hasHelpText ? (
        <span data-slot="stat-help-text" className={styles.helpText}>
          {helpText}
        </span>
      ) : null}
      {children}
    </div>
  );
}
