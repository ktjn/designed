import type { HTMLAttributes, ReactNode, Ref } from "react";
import styles from "./page-header.module.css";

export interface PageHeaderRootProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>;
  children?: ReactNode;
}

export interface PageHeaderBreadcrumbProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
}

export interface PageHeaderTitleProps
  extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  ref?: Ref<HTMLHeadingElement>;
  children?: ReactNode;
}

export interface PageHeaderDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  ref?: Ref<HTMLParagraphElement>;
  children?: ReactNode;
}

export interface PageHeaderActionsProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
}

export interface PageHeaderTabsProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
}

function PageHeaderRoot({ ref, className, ...rest }: PageHeaderRootProps) {
  const classes = [styles.root, className].filter(Boolean).join(" ");
  return (
    <header ref={ref} data-slot="page-header" className={classes} {...rest} />
  );
}

function PageHeaderBreadcrumb({
  ref,
  className,
  ...rest
}: PageHeaderBreadcrumbProps) {
  const classes = [styles.breadcrumb, className].filter(Boolean).join(" ");
  return (
    <div
      ref={ref}
      data-slot="page-header-breadcrumb"
      className={classes}
      {...rest}
    />
  );
}

function PageHeaderTitle({
  ref,
  as: Heading = "h1",
  className,
  ...rest
}: PageHeaderTitleProps) {
  const classes = [styles.title, className].filter(Boolean).join(" ");
  return (
    <Heading
      ref={ref}
      data-slot="page-header-title"
      className={classes}
      {...rest}
    />
  );
}

function PageHeaderDescription({
  ref,
  className,
  ...rest
}: PageHeaderDescriptionProps) {
  const classes = [styles.description, className].filter(Boolean).join(" ");
  return (
    <p
      ref={ref}
      data-slot="page-header-description"
      className={classes}
      {...rest}
    />
  );
}

function PageHeaderActions({
  ref,
  className,
  ...rest
}: PageHeaderActionsProps) {
  const classes = [styles.actions, className].filter(Boolean).join(" ");
  return (
    <div
      ref={ref}
      data-slot="page-header-actions"
      className={classes}
      {...rest}
    />
  );
}

function PageHeaderTabs({ ref, className, ...rest }: PageHeaderTabsProps) {
  const classes = [styles.tabs, className].filter(Boolean).join(" ");
  return (
    <div ref={ref} data-slot="page-header-tabs" className={classes} {...rest} />
  );
}

export const PageHeader = Object.assign(PageHeaderRoot, {
  Breadcrumb: PageHeaderBreadcrumb,
  Title: PageHeaderTitle,
  Description: PageHeaderDescription,
  Actions: PageHeaderActions,
  Tabs: PageHeaderTabs,
});
