import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronRightIcon,
  SortIcon,
} from "@ktjn/designed-icons";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
  Ref,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";
import { useIconOverride } from "../designed-provider/icon-provider.js";
import styles from "./table.module.css";

export type TableSortDirection = "ascending" | "descending" | "none";

export interface TableRootProps extends TableHTMLAttributes<HTMLTableElement> {
  ref?: Ref<HTMLTableElement>;
  wrapperClassName?: string;
  stickyHeader?: boolean;
}
export interface TableHeaderProps
  extends HTMLAttributes<HTMLTableSectionElement> {
  ref?: Ref<HTMLTableSectionElement>;
  sticky?: boolean;
}
export interface TableBodyProps
  extends HTMLAttributes<HTMLTableSectionElement> {
  ref?: Ref<HTMLTableSectionElement>;
}
export interface TableFooterProps
  extends HTMLAttributes<HTMLTableSectionElement> {
  ref?: Ref<HTMLTableSectionElement>;
}
export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  ref?: Ref<HTMLTableRowElement>;
  selected?: boolean;
  expanded?: boolean;
}
export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  ref?: Ref<HTMLTableCellElement>;
  sortDirection?: TableSortDirection;
  onSort?: () => void;
}
export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  ref?: Ref<HTMLTableCellElement>;
}
export interface TableCaptionProps
  extends HTMLAttributes<HTMLTableCaptionElement> {
  ref?: Ref<HTMLTableCaptionElement>;
}
export interface TableExpandButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  ref?: Ref<HTMLButtonElement>;
  expanded: boolean;
  expandLabel?: string;
  collapseLabel?: string;
}
export interface TableExpandedRowProps
  extends HTMLAttributes<HTMLTableRowElement> {
  ref?: Ref<HTMLTableRowElement>;
  colSpan: number;
  open?: boolean;
  cellClassName?: string;
  children?: ReactNode;
}

function TableRoot({
  ref,
  className,
  wrapperClassName,
  stickyHeader,
  ...rest
}: TableRootProps) {
  const classes = [styles.table, className].filter(Boolean).join(" ");
  const wrapperClasses = [styles.wrapper, wrapperClassName]
    .filter(Boolean)
    .join(" ");
  const stickyAttr = stickyHeader ? "" : undefined;
  return (
    <div
      data-slot="table-wrapper"
      data-sticky-header={stickyAttr}
      tabIndex={stickyHeader ? 0 : undefined}
      className={wrapperClasses}
    >
      <table
        ref={ref}
        data-slot="table"
        data-sticky-header={stickyAttr}
        className={classes}
        {...rest}
      />
    </div>
  );
}

function TableHeader({ sticky, className, ...rest }: TableHeaderProps) {
  const classes = [styles.header, className].filter(Boolean).join(" ");
  return (
    <thead
      data-slot="table-header"
      data-sticky={sticky ? "" : undefined}
      className={classes}
      {...rest}
    />
  );
}

function TableBody({ className, ...rest }: TableBodyProps) {
  const classes = [styles.body, className].filter(Boolean).join(" ");
  return <tbody data-slot="table-body" className={classes} {...rest} />;
}

function TableFooter({ className, ...rest }: TableFooterProps) {
  const classes = [styles.footer, className].filter(Boolean).join(" ");
  return <tfoot data-slot="table-footer" className={classes} {...rest} />;
}

function TableRow({ selected, expanded, className, ...rest }: TableRowProps) {
  const classes = [styles.row, className].filter(Boolean).join(" ");
  return (
    <tr
      data-slot="table-row"
      data-selected={selected ? "" : undefined}
      data-expanded={expanded ? "" : undefined}
      className={classes}
      {...rest}
    />
  );
}

function TableHead({
  scope = "col",
  sortDirection,
  onSort,
  className,
  children,
  "aria-sort": ariaSort,
  ...rest
}: TableHeadProps) {
  const classes = [styles.head, className].filter(Boolean).join(" ");
  const AscendingIcon = useIconOverride("arrowUp", ArrowUpIcon);
  const DescendingIcon = useIconOverride("arrowDown", ArrowDownIcon);
  const NoneIcon = useIconOverride("sort", SortIcon);
  const SortGlyph =
    sortDirection === "ascending"
      ? AscendingIcon
      : sortDirection === "descending"
        ? DescendingIcon
        : NoneIcon;

  return (
    <th
      data-slot="table-head"
      scope={scope}
      aria-sort={sortDirection ?? ariaSort}
      className={classes}
      {...rest}
    >
      {onSort ? (
        <button
          type="button"
          data-slot="table-sort-button"
          className={styles.sortButton}
          onClick={onSort}
        >
          {children}
          <SortGlyph aria-hidden="true" className={styles.sortIcon} />
        </button>
      ) : (
        children
      )}
    </th>
  );
}

function TableCell({ className, ...rest }: TableCellProps) {
  const classes = [styles.cell, className].filter(Boolean).join(" ");
  return <td data-slot="table-cell" className={classes} {...rest} />;
}

function TableCaption({ className, ...rest }: TableCaptionProps) {
  const classes = [styles.caption, className].filter(Boolean).join(" ");
  return <caption data-slot="table-caption" className={classes} {...rest} />;
}

function TableExpandButton({
  ref,
  expanded,
  expandLabel = "Expand row",
  collapseLabel = "Collapse row",
  className,
  type = "button",
  "aria-label": ariaLabel,
  ...rest
}: TableExpandButtonProps) {
  const Icon = useIconOverride("chevronRight", ChevronRightIcon);
  const classes = [styles.expandButton, className].filter(Boolean).join(" ");
  return (
    <button
      ref={ref}
      type={type}
      data-slot="table-expand-button"
      aria-expanded={expanded}
      aria-label={ariaLabel ?? (expanded ? collapseLabel : expandLabel)}
      data-expanded={expanded ? "" : undefined}
      className={classes}
      {...rest}
    >
      <Icon aria-hidden="true" className={styles.expandIcon} />
    </button>
  );
}

function TableExpandedRow({
  ref,
  colSpan,
  open = true,
  className,
  cellClassName,
  children,
  ...rest
}: TableExpandedRowProps) {
  if (!open) {
    return null;
  }
  const rowClasses = [styles.expandedRow, className].filter(Boolean).join(" ");
  const cellClasses = [styles.expandedCell, cellClassName]
    .filter(Boolean)
    .join(" ");
  return (
    <tr
      ref={ref}
      data-slot="table-expanded-row"
      className={rowClasses}
      {...rest}
    >
      <td
        data-slot="table-expanded-cell"
        colSpan={colSpan}
        className={cellClasses}
      >
        {children}
      </td>
    </tr>
  );
}

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Caption: TableCaption,
  ExpandButton: TableExpandButton,
  ExpandedRow: TableExpandedRow,
});
