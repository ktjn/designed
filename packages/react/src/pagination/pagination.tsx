import { ChevronLeftIcon, ChevronRightIcon } from "@ktjn/design-icons";
import type { ForwardedRef, HTMLAttributes } from "react";
import { forwardRef } from "react";
import styles from "./pagination.module.css";

export interface PaginationProps
  extends Omit<HTMLAttributes<HTMLElement>, "children"> {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  previousLabel?: string;
  nextLabel?: string;
}

type PageItem = number | "ellipsis-start" | "ellipsis-end";

function buildPageRange(
  page: number,
  totalPages: number,
  siblingCount: number,
): PageItem[] {
  if (totalPages <= 1) return totalPages === 1 ? [1] : [];
  const totalSlots = siblingCount * 2 + 5;
  if (totalPages <= totalSlots) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const leftSibling = Math.max(page - siblingCount, 1);
  const rightSibling = Math.min(page + siblingCount, totalPages);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  const items: PageItem[] = [1];

  if (showLeftEllipsis) {
    items.push("ellipsis-start");
  } else {
    for (let current = 2; current < leftSibling; current++) {
      items.push(current);
    }
  }

  const rangeStart = Math.max(2, leftSibling);
  const rangeEnd = Math.min(totalPages - 1, rightSibling);
  for (let current = rangeStart; current <= rangeEnd; current++) {
    items.push(current);
  }

  if (showRightEllipsis) {
    items.push("ellipsis-end");
  } else {
    for (let current = rightSibling + 1; current < totalPages; current++) {
      items.push(current);
    }
  }

  items.push(totalPages);
  return items;
}

function PaginationImpl(
  {
    page,
    totalPages,
    onPageChange,
    siblingCount = 1,
    previousLabel = "Previous",
    nextLabel = "Next",
    "aria-label": ariaLabel = "Pagination",
    className,
    ...rest
  }: PaginationProps,
  ref: ForwardedRef<HTMLElement>,
) {
  const safeTotal = Math.max(1, totalPages);
  const current = Math.min(Math.max(1, page), safeTotal);
  const items = buildPageRange(current, safeTotal, siblingCount);
  const classes = [styles.root, className].filter(Boolean).join(" ");

  return (
    <nav
      ref={ref}
      data-slot="pagination"
      aria-label={ariaLabel}
      className={classes}
      {...rest}
    >
      <ul className={styles.list}>
        <li>
          <button
            type="button"
            className={styles.button}
            disabled={current <= 1}
            onClick={() => onPageChange(current - 1)}
          >
            <ChevronLeftIcon aria-hidden />
            {previousLabel}
          </button>
        </li>
        {items.map((item) =>
          typeof item === "number" ? (
            <li key={item}>
              <button
                type="button"
                className={styles.button}
                aria-current={item === current ? "page" : undefined}
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            </li>
          ) : (
            <li key={item} aria-hidden="true" className={styles.ellipsis}>
              …
            </li>
          ),
        )}
        <li>
          <button
            type="button"
            className={styles.button}
            disabled={current >= safeTotal}
            onClick={() => onPageChange(current + 1)}
          >
            {nextLabel}
            <ChevronRightIcon aria-hidden />
          </button>
        </li>
      </ul>
    </nav>
  );
}

export const Pagination = forwardRef(PaginationImpl);
Pagination.displayName = "Pagination";
