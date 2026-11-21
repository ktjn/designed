import type {
  ForwardedRef,
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";
import { forwardRef } from "react";
import styles from "./table.module.css";

export type TableRootProps = TableHTMLAttributes<HTMLTableElement>;
export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>;
export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;
export type TableFooterProps = HTMLAttributes<HTMLTableSectionElement>;
export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;
export type TableHeadProps = ThHTMLAttributes<HTMLTableCellElement>;
export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;
export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>;

function TableRootImpl(
  { className, ...rest }: TableRootProps,
  ref: ForwardedRef<HTMLTableElement>,
) {
  const classes = [styles.table, className].filter(Boolean).join(" ");
  return (
    <div className={styles.wrapper}>
      <table ref={ref} className={classes} {...rest} />
    </div>
  );
}

const TableRoot = forwardRef(TableRootImpl);
TableRoot.displayName = "Table";

function TableHeader({ className, ...rest }: TableHeaderProps) {
  const classes = [styles.header, className].filter(Boolean).join(" ");
  return <thead className={classes} {...rest} />;
}

function TableBody({ className, ...rest }: TableBodyProps) {
  const classes = [styles.body, className].filter(Boolean).join(" ");
  return <tbody className={classes} {...rest} />;
}

function TableFooter({ className, ...rest }: TableFooterProps) {
  const classes = [styles.footer, className].filter(Boolean).join(" ");
  return <tfoot className={classes} {...rest} />;
}

function TableRow({ className, ...rest }: TableRowProps) {
  const classes = [styles.row, className].filter(Boolean).join(" ");
  return <tr className={classes} {...rest} />;
}

function TableHead({ scope = "col", className, ...rest }: TableHeadProps) {
  const classes = [styles.head, className].filter(Boolean).join(" ");
  return <th scope={scope} className={classes} {...rest} />;
}

function TableCell({ className, ...rest }: TableCellProps) {
  const classes = [styles.cell, className].filter(Boolean).join(" ");
  return <td className={classes} {...rest} />;
}

function TableCaption({ className, ...rest }: TableCaptionProps) {
  const classes = [styles.caption, className].filter(Boolean).join(" ");
  return <caption className={classes} {...rest} />;
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
