import type { ComponentPropsWithRef } from "react";
import { useEffect, useState } from "react";
import styles from "./relative-time.module.css";

export type RelativeTimeFormat = "long" | "short" | "narrow";

export interface RelativeTimeProps
  extends Omit<ComponentPropsWithRef<"time">, "dateTime" | "children"> {
  date: Date | string | number;
  locale?: string;
  format?: RelativeTimeFormat;
  formatter?: (elapsedMilliseconds: number) => string;
  numeric?: "always" | "auto";
  refreshInterval?: number;
  now?: Date | number;
  showTitle?: boolean;
}

const YEAR_SECONDS = 31536000;

const RELATIVE_TIME_UNITS: ReadonlyArray<{
  unit: Intl.RelativeTimeFormatUnit;
  seconds: number;
  threshold: number;
}> = [
  { unit: "second", seconds: 1, threshold: 60 },
  { unit: "minute", seconds: 60, threshold: 3600 },
  { unit: "hour", seconds: 3600, threshold: 86400 },
  { unit: "day", seconds: 86400, threshold: 604800 },
  { unit: "week", seconds: 604800, threshold: 2592000 },
  { unit: "month", seconds: 2592000, threshold: YEAR_SECONDS },
];

function selectUnit(absSeconds: number): {
  unit: Intl.RelativeTimeFormatUnit;
  seconds: number;
} {
  for (const entry of RELATIVE_TIME_UNITS) {
    if (absSeconds < entry.threshold) {
      return entry;
    }
  }
  return { unit: "year", seconds: YEAR_SECONDS };
}

function toTimestamp(value: Date | string | number): number {
  if (value instanceof Date) {
    return value.getTime();
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? new Date(value).getTime() : Number.NaN;
  }
  return Date.parse(value);
}

function formatRelativeTime(
  targetMs: number,
  referenceMs: number,
  locale: string | undefined,
  format: RelativeTimeFormat,
  numeric: "always" | "auto",
): string {
  const diffSeconds = (targetMs - referenceMs) / 1000;
  const selected = selectUnit(Math.abs(diffSeconds));
  const rawValue = Math.trunc(diffSeconds / selected.seconds);
  const value = rawValue === 0 ? 0 : rawValue;
  const formatter = new Intl.RelativeTimeFormat(locale, {
    style: format,
    numeric,
  });
  return formatter.format(value, selected.unit);
}

function formatExactDateTime(
  targetMs: number,
  locale: string | undefined,
): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(targetMs));
}

export function RelativeTime({
  ref,
  date,
  locale,
  format = "long",
  formatter,
  numeric = "auto",
  refreshInterval,
  now,
  showTitle = true,
  title,
  className,
  ...rest
}: RelativeTimeProps) {
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  useEffect(() => {
    if (
      now !== undefined ||
      refreshInterval === undefined ||
      !Number.isFinite(refreshInterval) ||
      refreshInterval <= 0
    ) {
      return;
    }

    const id = globalThis.setInterval(() => {
      setCurrentTime(Date.now());
    }, refreshInterval);

    return () => {
      globalThis.clearInterval(id);
    };
  }, [now, refreshInterval]);

  const classes = [styles.root, className].filter(Boolean).join(" ");
  const ms = toTimestamp(date);

  if (Number.isNaN(ms)) {
    return (
      <time
        ref={ref}
        data-slot="relative-time"
        className={classes}
        title={title}
        {...rest}
      />
    );
  }

  const explicitNowMs = now !== undefined ? toTimestamp(now) : undefined;
  const referenceMs =
    explicitNowMs !== undefined && !Number.isNaN(explicitNowMs)
      ? explicitNowMs
      : currentTime;

  const formattedText = formatter
    ? formatter(referenceMs - ms)
    : formatRelativeTime(ms, referenceMs, locale, format, numeric);
  const resolvedTitle =
    title !== undefined
      ? title
      : showTitle
        ? formatExactDateTime(ms, locale)
        : undefined;

  return (
    <time
      ref={ref}
      data-slot="relative-time"
      dateTime={new Date(ms).toISOString()}
      title={resolvedTitle}
      className={classes}
      {...rest}
    >
      {formattedText}
    </time>
  );
}
