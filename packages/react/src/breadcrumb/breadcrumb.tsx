import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  LiHTMLAttributes,
  OlHTMLAttributes,
  ReactNode,
  Ref,
} from "react";
import styles from "./breadcrumb.module.css";

export interface BreadcrumbRootProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>;
}
export interface BreadcrumbListProps
  extends OlHTMLAttributes<HTMLOListElement> {
  ref?: Ref<HTMLOListElement>;
}
export interface BreadcrumbItemProps extends LiHTMLAttributes<HTMLLIElement> {
  ref?: Ref<HTMLLIElement>;
}
export interface BreadcrumbLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  ref?: Ref<HTMLAnchorElement>;
}
export interface BreadcrumbPageProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>;
}
export interface BreadcrumbSeparatorProps
  extends LiHTMLAttributes<HTMLLIElement> {
  ref?: Ref<HTMLLIElement>;
  children?: ReactNode;
}

function BreadcrumbRoot({
  ref,
  "aria-label": ariaLabel = "Breadcrumb",
  className,
  ...rest
}: BreadcrumbRootProps) {
  const classes = [styles.root, className].filter(Boolean).join(" ");
  return (
    <nav
      ref={ref}
      data-slot="breadcrumb"
      aria-label={ariaLabel}
      className={classes}
      {...rest}
    />
  );
}

function BreadcrumbList({ className, ...rest }: BreadcrumbListProps) {
  const classes = [styles.list, className].filter(Boolean).join(" ");
  return <ol data-slot="breadcrumb-list" className={classes} {...rest} />;
}

function BreadcrumbItem({ className, ...rest }: BreadcrumbItemProps) {
  const classes = [styles.item, className].filter(Boolean).join(" ");
  return <li data-slot="breadcrumb-item" className={classes} {...rest} />;
}

function BreadcrumbLink({ className, ...rest }: BreadcrumbLinkProps) {
  const classes = [styles.link, className].filter(Boolean).join(" ");
  return <a data-slot="breadcrumb-link" className={classes} {...rest} />;
}

function BreadcrumbPage({ className, ...rest }: BreadcrumbPageProps) {
  const classes = [styles.page, className].filter(Boolean).join(" ");
  return (
    <span
      data-slot="breadcrumb-page"
      aria-current="page"
      className={classes}
      {...rest}
    />
  );
}

function BreadcrumbSeparator({
  children = "/",
  className,
  ...rest
}: BreadcrumbSeparatorProps) {
  const classes = [styles.separator, className].filter(Boolean).join(" ");
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={classes}
      {...rest}
    >
      {children}
    </li>
  );
}

export const Breadcrumb = Object.assign(BreadcrumbRoot, {
  List: BreadcrumbList,
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Page: BreadcrumbPage,
  Separator: BreadcrumbSeparator,
});
