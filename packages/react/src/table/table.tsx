import type {
  HTMLAttributes,
  Ref,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";
import styles from "./table.module.css";

export interface TableRootProps extends TableHTMLAttributes<HTMLTableElement> {
  ref?: Ref<HTMLTableElement>;
  wrapperClassName?: string;
}
export interface TableHeaderProps
  extends HTMLAttributes<HTMLTableSectionElement> {
  ref?: Ref<HTMLTableSectionElement>;
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
}
export interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  ref?: Ref<HTMLTableCellElement>;
}
export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  ref?: Ref<HTMLTableCellElement>;
}
export interface TableCaptionProps
  extends HTMLAttributes<HTMLTableCaptionElement> {
  ref?: Ref<HTMLTableCaptionElement>;
}

function TableRoot({
  ref,
  className,
  wrapperClassName,
  ...rest
}: TableRootProps) {
  const classes = [styles.table, className].filter(Boolean).join(" ");
  const wrapperClasses = [styles.wrapper, wrapperClassName]
    .filter(Boolean)
    .join(" ");
  return (
    <div data-slot="table-wrapper" className={wrapperClasses}>
      <table ref={ref} data-slot="table" className={classes} {...rest} />
    </div>
  );
}

function TableHeader({ className, ...rest }: TableHeaderProps) {
  const classes = [styles.header, className].filter(Boolean).join(" ");
  return <thead data-slot="table-header" className={classes} {...rest} />;
}

function TableBody({ className, ...rest }: TableBodyProps) {
  const classes = [styles.body, className].filter(Boolean).join(" ");
  return <tbody data-slot="table-body" className={classes} {...rest} />;
}

function TableFooter({ className, ...rest }: TableFooterProps) {
  const classes = [styles.footer, className].filter(Boolean).join(" ");
  return <tfoot data-slot="table-footer" className={classes} {...rest} />;
}

function TableRow({ className, ...rest }: TableRowProps) {
  const classes = [styles.row, className].filter(Boolean).join(" ");
  return <tr data-slot="table-row" className={classes} {...rest} />;
}

function TableHead({ scope = "col", className, ...rest }: TableHeadProps) {
  const classes = [styles.head, className].filter(Boolean).join(" ");
  return (
    <th data-slot="table-head" scope={scope} className={classes} {...rest} />
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

export const Table = Object.assign(TableRoot, {
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Caption: TableCaption,
});
