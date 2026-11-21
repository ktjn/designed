import type {
  AnchorHTMLAttributes,
  ForwardedRef,
  HTMLAttributes,
  LiHTMLAttributes,
  OlHTMLAttributes,
  ReactNode,
} from "react";
import { forwardRef } from "react";
import styles from "./breadcrumb.module.css";

export type BreadcrumbRootProps = HTMLAttributes<HTMLElement>;
export type BreadcrumbListProps = OlHTMLAttributes<HTMLOListElement>;
export type BreadcrumbItemProps = LiHTMLAttributes<HTMLLIElement>;
export type BreadcrumbLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;
export type BreadcrumbPageProps = HTMLAttributes<HTMLSpanElement>;
export interface BreadcrumbSeparatorProps
  extends LiHTMLAttributes<HTMLLIElement> {
  children?: ReactNode;
}

function BreadcrumbRootImpl(
  {
    "aria-label": ariaLabel = "Breadcrumb",
    className,
    ...rest
  }: BreadcrumbRootProps,
  ref: ForwardedRef<HTMLElement>,
) {
  const classes = [styles.root, className].filter(Boolean).join(" ");
  return <nav ref={ref} aria-label={ariaLabel} className={classes} {...rest} />;
}

const BreadcrumbRoot = forwardRef(BreadcrumbRootImpl);
BreadcrumbRoot.displayName = "Breadcrumb";

function BreadcrumbList({ className, ...rest }: BreadcrumbListProps) {
  const classes = [styles.list, className].filter(Boolean).join(" ");
  return <ol className={classes} {...rest} />;
}

function BreadcrumbItem({ className, ...rest }: BreadcrumbItemProps) {
  const classes = [styles.item, className].filter(Boolean).join(" ");
  return <li className={classes} {...rest} />;
}

function BreadcrumbLink({ className, ...rest }: BreadcrumbLinkProps) {
  const classes = [styles.link, className].filter(Boolean).join(" ");
  return <a className={classes} {...rest} />;
}

function BreadcrumbPage({ className, ...rest }: BreadcrumbPageProps) {
  const classes = [styles.page, className].filter(Boolean).join(" ");
  return <span aria-current="page" className={classes} {...rest} />;
}

function BreadcrumbSeparator({
  children = "/",
  className,
  ...rest
}: BreadcrumbSeparatorProps) {
  const classes = [styles.separator, className].filter(Boolean).join(" ");
  return (
    <li role="presentation" aria-hidden="true" className={classes} {...rest}>
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
