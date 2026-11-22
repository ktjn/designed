import type { HTMLAttributes, ReactNode, Ref } from "react";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { Popover } from "../popover/popover.js";
import { Tag } from "../tag/tag.js";
import styles from "./tag-overflow.module.css";

export interface TagOverflowItem {
  id: string;
  label: ReactNode;
}

export interface TagOverflowProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  items: readonly TagOverflowItem[];
  max?: number;
  renderItem?: (item: TagOverflowItem) => ReactNode;
  overflowLabel?: (count: number) => string;
  overflowAriaLabel?: (count: number) => string;
}

interface MeasuredMetrics {
  widths: number[];
  overflowWidth: number;
  gap: number;
}

interface MeasurementSnapshot {
  items: readonly TagOverflowItem[];
  renderItem: (item: TagOverflowItem) => ReactNode;
  probeText: string;
}

function defaultRenderItem(item: TagOverflowItem): ReactNode {
  return <Tag>{item.label}</Tag>;
}

function defaultOverflowLabel(count: number): string {
  return `+${count}`;
}

function defaultOverflowAriaLabel(count: number): string {
  return `${count} more ${count === 1 ? "item" : "items"}`;
}

function areItemsEqual(
  prev: readonly TagOverflowItem[],
  next: readonly TagOverflowItem[],
): boolean {
  if (prev === next) return true;
  if (prev.length !== next.length) return false;
  for (let index = 0; index < prev.length; index += 1) {
    const prevItem = prev[index];
    const nextItem = next[index];
    if (
      !prevItem ||
      !nextItem ||
      prevItem.id !== nextItem.id ||
      !Object.is(prevItem.label, nextItem.label)
    ) {
      return false;
    }
  }
  return true;
}

function getAvailableWidth(
  container: HTMLElement,
  computedStyle?: CSSStyleDeclaration,
): number {
  const style = computedStyle ?? getComputedStyle(container);
  const paddingLeft = Number.parseFloat(style.paddingLeft) || 0;
  const paddingRight = Number.parseFloat(style.paddingRight) || 0;
  return Math.max(0, container.clientWidth - paddingLeft - paddingRight);
}

function computeVisibleCount(
  available: number,
  widths: number[],
  overflowWidth: number,
  gap: number,
): number {
  if (available <= 0 || widths.length === 0) {
    return widths.length;
  }

  let totalWidth = 0;
  for (let index = 0; index < widths.length; index += 1) {
    totalWidth += widths[index] ?? 0;
    if (index > 0) {
      totalWidth += gap;
    }
  }
  if (totalWidth <= available) {
    return widths.length;
  }

  let used = 0;
  let count = 0;
  for (let index = 0; index < widths.length - 1; index += 1) {
    used += (widths[index] ?? 0) + (index > 0 ? gap : 0);
    if (used + gap + overflowWidth > available) {
      break;
    }
    count = index + 1;
  }
  return count;
}

export function TagOverflow({
  ref,
  items,
  max,
  renderItem = defaultRenderItem,
  overflowLabel = defaultOverflowLabel,
  overflowAriaLabel = defaultOverflowAriaLabel,
  className,
  ...rest
}: TagOverflowProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const overflowProbeRef = useRef<HTMLSpanElement | null>(null);
  const metricsRef = useRef<MeasuredMetrics | null>(null);

  const needsAutoMeasure = max === undefined && items.length > 0;
  const probeText = needsAutoMeasure ? overflowLabel(items.length) : "";

  const [measuredSnapshot, setMeasuredSnapshot] =
    useState<MeasurementSnapshot | null>(null);
  const [autoVisibleCount, setAutoVisibleCount] = useState(items.length);

  const isMeasuring =
    needsAutoMeasure &&
    (measuredSnapshot === null ||
      measuredSnapshot.renderItem !== renderItem ||
      measuredSnapshot.probeText !== probeText ||
      !areItemsEqual(measuredSnapshot.items, items));

  const assignContainerRef = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node;
      if (typeof ref === "function") {
        const cleanup = ref(node);
        if (typeof cleanup === "function") {
          return () => {
            containerRef.current = null;
            cleanup();
          };
        }
        return undefined;
      }
      if (ref) {
        ref.current = node;
      }
      return undefined;
    },
    [ref],
  );

  useLayoutEffect(() => {
    if (!needsAutoMeasure) {
      metricsRef.current = null;
      if (measuredSnapshot !== null) {
        setMeasuredSnapshot(null);
      }
      return;
    }

    if (!isMeasuring) return;

    const container = containerRef.current;
    if (!container) return;

    const style = getComputedStyle(container);
    const available = getAvailableWidth(container, style);
    const itemElements = Array.from(container.children).filter(
      (child): child is HTMLElement =>
        child instanceof HTMLElement &&
        child.dataset.slot === "tag-overflow-item",
    );
    const widths = itemElements.map(
      (element) => element.getBoundingClientRect().width,
    );
    const overflowWidth =
      overflowProbeRef.current?.getBoundingClientRect().width ?? 0;
    const gap = Number.parseFloat(style.columnGap) || 0;

    if (available > 0) {
      metricsRef.current = { widths, overflowWidth, gap };
      setAutoVisibleCount(
        computeVisibleCount(available, widths, overflowWidth, gap),
      );
    } else {
      metricsRef.current = null;
      setAutoVisibleCount(items.length);
    }
    setMeasuredSnapshot({ items, renderItem, probeText });
  }, [
    isMeasuring,
    items,
    measuredSnapshot,
    needsAutoMeasure,
    probeText,
    renderItem,
  ]);

  useLayoutEffect(() => {
    if (!needsAutoMeasure) return;
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      const available = getAvailableWidth(container);
      if (available <= 0) return;
      const metrics = metricsRef.current;
      if (!metrics) {
        setMeasuredSnapshot(null);
        return;
      }
      setAutoVisibleCount(
        computeVisibleCount(
          available,
          metrics.widths,
          metrics.overflowWidth,
          metrics.gap,
        ),
      );
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [needsAutoMeasure]);

  const visibleCount =
    max !== undefined
      ? Math.max(0, max)
      : isMeasuring
        ? items.length
        : Math.min(autoVisibleCount, items.length);

  const visibleCountForPopover =
    max !== undefined
      ? Math.max(0, max)
      : measuredSnapshot === null
        ? items.length
        : autoVisibleCount;

  const visibleItems = items.slice(0, visibleCount);
  const overflowItems = items.slice(
    Math.min(visibleCountForPopover, items.length),
  );
  const overflowText =
    overflowItems.length > 0
      ? overflowItems.length === items.length && probeText !== ""
        ? probeText
        : overflowLabel(overflowItems.length)
      : "";

  const classes = [styles.root, className].filter(Boolean).join(" ");

  return (
    <div
      ref={assignContainerRef}
      data-slot="tag-overflow"
      className={classes}
      {...rest}
    >
      {visibleItems.map((item) => (
        <span
          key={item.id}
          data-slot="tag-overflow-item"
          className={styles.item}
        >
          {renderItem(item)}
        </span>
      ))}
      {isMeasuring ? (
        <span
          ref={overflowProbeRef}
          aria-hidden="true"
          className={`${styles.overflow} ${styles.probe}`}
        >
          {probeText}
        </span>
      ) : null}
      {overflowItems.length > 0 ? (
        <Popover>
          <Popover.Trigger
            render={<button type="button" />}
            data-slot="tag-overflow-trigger"
            className={styles.overflow}
          >
            {overflowText}
          </Popover.Trigger>
          <Popover.Content aria-label={overflowAriaLabel(overflowItems.length)}>
            <div
              data-slot="tag-overflow-popover-list"
              className={styles.popoverList}
            >
              {overflowItems.map((item) => (
                <span
                  key={item.id}
                  data-slot="tag-overflow-item"
                  className={styles.item}
                >
                  {renderItem(item)}
                </span>
              ))}
            </div>
          </Popover.Content>
        </Popover>
      ) : null}
    </div>
  );
}
