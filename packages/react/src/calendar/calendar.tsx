import { ChevronLeftIcon, ChevronRightIcon } from "@ktjn/design-icons";
import type { ForwardedRef, HTMLAttributes, KeyboardEvent } from "react";
import { forwardRef, useMemo, useRef, useState } from "react";
import styles from "./calendar.module.css";

export interface CalendarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  min?: string;
  max?: string;
  locale?: string;
  disabled?: boolean;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
}

const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

function parseIsoDate(iso: string | undefined): Date | null {
  if (!iso) return null;
  const match = ISO_DATE_RE.exec(iso);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}

function formatIsoDate(date: Date): string {
  const year = String(date.getUTCFullYear()).padStart(4, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, delta: number): Date {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate() + delta,
    ),
  );
}

function addMonths(year: number, month: number, delta: number) {
  const shifted = new Date(Date.UTC(year, month + delta, 1));
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth(),
  };
}

function getTodayUtc(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

function buildMonthGrid(year: number, month: number): Date[][] {
  const firstOfMonth = new Date(Date.UTC(year, month, 1));
  const startOffset = firstOfMonth.getUTCDay();
  const gridStart = addDays(firstOfMonth, -startOffset);
  const weeks: Date[][] = [];
  for (let week = 0; week < 6; week++) {
    const row: Date[] = [];
    for (let day = 0; day < 7; day++) {
      row.push(addDays(gridStart, week * 7 + day));
    }
    weeks.push(row);
  }
  return weeks;
}

function CalendarImpl(
  {
    value,
    defaultValue,
    onValueChange,
    min,
    max,
    locale,
    disabled = false,
    previousMonthLabel = "Previous month",
    nextMonthLabel = "Next month",
    className,
    ...rest
  }: CalendarProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const selectedIso = value ?? internalValue;
  const initialDate = parseIsoDate(selectedIso) ?? getTodayUtc();
  const [view, setView] = useState({
    year: initialDate.getUTCFullYear(),
    month: initialDate.getUTCMonth(),
  });
  const [focusedIso, setFocusedIso] = useState(formatIsoDate(initialDate));
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const monthFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }),
    [locale],
  );

  const weekdayLabels = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, {
      weekday: "short",
      timeZone: "UTC",
    });
    const sunday = new Date(Date.UTC(2026, 0, 4));
    return Array.from({ length: 7 }, (_, index) =>
      formatter.format(addDays(sunday, index)),
    );
  }, [locale]);

  const weeks = useMemo(
    () => buildMonthGrid(view.year, view.month),
    [view.year, view.month],
  );

  const monthTitle = monthFormatter.format(
    new Date(Date.UTC(view.year, view.month, 1)),
  );

  function isDisabledDate(iso: string): boolean {
    if (disabled) return true;
    if (min && iso < min) return true;
    if (max && iso > max) return true;
    return false;
  }

  function selectDate(iso: string) {
    if (isDisabledDate(iso)) return;
    if (value === undefined) {
      setInternalValue(iso);
    }
    setFocusedIso(iso);
    onValueChange?.(iso);
  }

  function moveFocusTo(target: Date) {
    const iso = formatIsoDate(target);
    setView({ year: target.getUTCFullYear(), month: target.getUTCMonth() });
    setFocusedIso(iso);
    queueMicrotask(() => {
      buttonRefs.current.get(iso)?.focus();
    });
  }

  function handleDayKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    date: Date,
  ) {
    let next: Date | null = null;
    switch (event.key) {
      case "ArrowLeft":
        next = addDays(date, -1);
        break;
      case "ArrowRight":
        next = addDays(date, 1);
        break;
      case "ArrowUp":
        next = addDays(date, -7);
        break;
      case "ArrowDown":
        next = addDays(date, 7);
        break;
      case "Home":
        next = addDays(date, -date.getUTCDay());
        break;
      case "End":
        next = addDays(date, 6 - date.getUTCDay());
        break;
      case "PageUp":
        next = new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth() - 1,
            date.getUTCDate(),
          ),
        );
        break;
      case "PageDown":
        next = new Date(
          Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth() + 1,
            date.getUTCDate(),
          ),
        );
        break;
      default:
        return;
    }
    event.preventDefault();
    moveFocusTo(next);
  }

  const classes = [styles.root, className].filter(Boolean).join(" ");

  return (
    <div ref={ref} data-slot="calendar" className={classes} {...rest}>
      <div className={styles.header}>
        <button
          type="button"
          className={styles.navButton}
          aria-label={previousMonthLabel}
          disabled={disabled}
          onClick={() =>
            setView((prev) => addMonths(prev.year, prev.month, -1))
          }
        >
          <ChevronLeftIcon aria-hidden />
        </button>
        <div className={styles.monthLabel} aria-live="polite">
          {monthTitle}
        </div>
        <button
          type="button"
          className={styles.navButton}
          aria-label={nextMonthLabel}
          disabled={disabled}
          onClick={() => setView((prev) => addMonths(prev.year, prev.month, 1))}
        >
          <ChevronRightIcon aria-hidden />
        </button>
      </div>
      <table className={styles.grid} aria-label={monthTitle}>
        <thead>
          <tr>
            {weekdayLabels.map((label) => (
              <th key={label} scope="col" className={styles.weekday}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={formatIsoDate(week[0] ?? initialDate)}>
              {week.map((day) => {
                const iso = formatIsoDate(day);
                const outside = day.getUTCMonth() !== view.month;
                const selected = iso === selectedIso;
                const dayDisabled = isDisabledDate(iso);
                const tabStop = iso === focusedIso ? 0 : -1;

                return (
                  <td key={iso} className={styles.cell}>
                    <button
                      ref={(node) => {
                        if (node) {
                          buttonRefs.current.set(iso, node);
                        } else {
                          buttonRefs.current.delete(iso);
                        }
                      }}
                      type="button"
                      className={styles.day}
                      aria-label={iso}
                      aria-pressed={selected}
                      tabIndex={tabStop}
                      disabled={dayDisabled}
                      data-selected={selected ? "" : undefined}
                      data-outside={outside ? "" : undefined}
                      onClick={() => selectDate(iso)}
                      onKeyDown={(event) => handleDayKeyDown(event, day)}
                    >
                      {day.getUTCDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const Calendar = forwardRef(CalendarImpl);
Calendar.displayName = "Calendar";
