import { ChevronLeftIcon, ChevronRightIcon } from "@ktjn/designed-icons";
import type { HTMLAttributes, KeyboardEvent, Ref } from "react";
import { useMemo, useRef, useState } from "react";
import styles from "./calendar.module.css";

export type WeekdayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface CalendarProps
  extends Omit<
    HTMLAttributes<HTMLDivElement>,
    "defaultValue" | "onChange" | "children"
  > {
  ref?: Ref<HTMLDivElement>;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  min?: string;
  max?: string;
  isDateDisabled?: (isoDate: string) => boolean;
  locale?: string;
  weekStartsOn?: WeekdayIndex;
  disabled?: boolean;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
  month?: string;
  defaultMonth?: string;
  onMonthChange?: (month: string) => void;
}

const ISO_DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseIsoDate(iso: string | undefined): Date | null {
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

const ISO_MONTH_RE = /^(\d{4})-(\d{2})$/;

function parseIsoMonth(
  iso: string | undefined,
): { year: number; month: number } | null {
  if (!iso) return null;
  const match = ISO_MONTH_RE.exec(iso);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  if (month < 0 || month > 11) return null;
  return { year, month };
}

function formatIsoMonth(year: number, month: number): string {
  return `${String(year).padStart(4, "0")}-${String(month + 1).padStart(2, "0")}`;
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

function addMonthsClamped(date: Date, deltaMonths: number): Date {
  const shifted = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + deltaMonths, 1),
  );
  const lastDay = new Date(
    Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth() + 1, 0),
  ).getUTCDate();
  return new Date(
    Date.UTC(
      shifted.getUTCFullYear(),
      shifted.getUTCMonth(),
      Math.min(date.getUTCDate(), lastDay),
    ),
  );
}

function getTodayUtc(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

function resolveWeekStartsOn(
  locale: string | undefined,
  explicit?: WeekdayIndex,
): WeekdayIndex {
  if (explicit !== undefined) return explicit;
  try {
    const resolvedLocale =
      locale ?? new Intl.DateTimeFormat().resolvedOptions().locale;
    const intlLocale = new Intl.Locale(resolvedLocale) as Intl.Locale & {
      getWeekInfo?: () => { firstDay: number };
      weekInfo?: { firstDay: number };
    };
    const info = intlLocale.getWeekInfo?.() ?? intlLocale.weekInfo;
    if (info && typeof info.firstDay === "number") {
      return (info.firstDay % 7) as WeekdayIndex;
    }
  } catch {
    return 0;
  }
  return 0;
}

function buildMonthGrid(
  year: number,
  month: number,
  weekStartsOn: WeekdayIndex,
): Date[][] {
  const firstOfMonth = new Date(Date.UTC(year, month, 1));
  const startOffset = (firstOfMonth.getUTCDay() - weekStartsOn + 7) % 7;
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

export function Calendar({
  ref,
  value,
  defaultValue,
  onValueChange,
  min,
  max,
  isDateDisabled,
  locale,
  weekStartsOn,
  disabled = false,
  previousMonthLabel = "Previous month",
  nextMonthLabel = "Next month",
  month,
  defaultMonth,
  onMonthChange,
  className,
  ...rest
}: CalendarProps) {
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const selectedIso = value ?? internalValue;
  const initialDate = parseIsoDate(selectedIso) ?? getTodayUtc();
  const isMonthControlled = month !== undefined;
  const [internalView, setInternalView] = useState(
    parseIsoMonth(month) ??
      parseIsoMonth(defaultMonth) ?? {
        year: initialDate.getUTCFullYear(),
        month: initialDate.getUTCMonth(),
      },
  );
  const view = isMonthControlled
    ? (parseIsoMonth(month) ?? internalView)
    : internalView;
  const setView = (next: { year: number; month: number }) => {
    if (!isMonthControlled) {
      setInternalView(next);
    }
    onMonthChange?.(formatIsoMonth(next.year, next.month));
  };
  const [focusedIso, setFocusedIso] = useState(formatIsoDate(initialDate));
  const [prevValue, setPrevValue] = useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    const parsed = parseIsoDate(value);
    if (parsed) {
      if (!isMonthControlled) {
        setInternalView({
          year: parsed.getUTCFullYear(),
          month: parsed.getUTCMonth(),
        });
      }
      setFocusedIso(formatIsoDate(parsed));
    }
  }
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const resolvedWeekStartsOn = useMemo(
    () => resolveWeekStartsOn(locale, weekStartsOn),
    [locale, weekStartsOn],
  );

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
      formatter.format(addDays(sunday, (resolvedWeekStartsOn + index) % 7)),
    );
  }, [locale, resolvedWeekStartsOn]);

  const weeks = useMemo(
    () => buildMonthGrid(view.year, view.month, resolvedWeekStartsOn),
    [view.year, view.month, resolvedWeekStartsOn],
  );

  const monthTitle = monthFormatter.format(
    new Date(Date.UTC(view.year, view.month, 1)),
  );

  function isDisabledDate(iso: string): boolean {
    if (disabled) return true;
    if (min && iso < min) return true;
    if (max && iso > max) return true;
    if (isDateDisabled?.(iso)) return true;
    return false;
  }

  const effectiveFocusedIso = (() => {
    const flatDays = weeks.flat();
    const visibleIsos = new Set(flatDays.map(formatIsoDate));
    if (visibleIsos.has(focusedIso) && !isDisabledDate(focusedIso)) {
      return focusedIso;
    }
    const firstEnabledInMonth = flatDays.find(
      (day) =>
        day.getUTCMonth() === view.month && !isDisabledDate(formatIsoDate(day)),
    );
    if (firstEnabledInMonth) {
      return formatIsoDate(firstEnabledInMonth);
    }
    const firstEnabledInGrid = flatDays.find(
      (day) => !isDisabledDate(formatIsoDate(day)),
    );
    return firstEnabledInGrid ? formatIsoDate(firstEnabledInGrid) : focusedIso;
  })();

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

  function shiftMonth(delta: number) {
    const nextView = addMonths(view.year, view.month, delta);
    setView(nextView);
    const currentFocused =
      parseIsoDate(focusedIso) ?? new Date(Date.UTC(view.year, view.month, 1));
    const shifted = addMonthsClamped(currentFocused, delta);
    setFocusedIso(formatIsoDate(shifted));
  }

  function handleDayKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    date: Date,
  ) {
    let next: Date | null = null;
    const offsetFromWeekStart =
      (date.getUTCDay() - resolvedWeekStartsOn + 7) % 7;
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
        next = addDays(date, -offsetFromWeekStart);
        break;
      case "End":
        next = addDays(date, 6 - offsetFromWeekStart);
        break;
      case "PageUp":
        next = addMonthsClamped(date, -1);
        break;
      case "PageDown":
        next = addMonthsClamped(date, 1);
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
      <div data-slot="calendar-header" className={styles.header}>
        <button
          type="button"
          data-slot="calendar-previous"
          className={styles.navButton}
          aria-label={previousMonthLabel}
          disabled={disabled}
          onClick={() => shiftMonth(-1)}
        >
          <ChevronLeftIcon aria-hidden />
        </button>
        <span
          data-slot="calendar-month-label"
          className={styles.monthLabel}
          aria-live="polite"
        >
          {monthTitle}
        </span>
        <button
          type="button"
          data-slot="calendar-next"
          className={styles.navButton}
          aria-label={nextMonthLabel}
          disabled={disabled}
          onClick={() => shiftMonth(1)}
        >
          <ChevronRightIcon aria-hidden />
        </button>
      </div>
      <table
        data-slot="calendar-grid"
        className={styles.grid}
        aria-label={monthTitle}
      >
        <thead>
          <tr>
            {weekdayLabels.map((label) => (
              <th
                key={label}
                scope="col"
                data-slot="calendar-weekday"
                className={styles.weekday}
              >
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
                const tabStop =
                  !dayDisabled && iso === effectiveFocusedIso ? 0 : -1;

                return (
                  <td
                    key={iso}
                    data-slot="calendar-cell"
                    className={styles.cell}
                  >
                    <button
                      ref={(node) => {
                        if (node) {
                          buttonRefs.current.set(iso, node);
                        } else {
                          buttonRefs.current.delete(iso);
                        }
                      }}
                      type="button"
                      data-slot="calendar-day"
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
