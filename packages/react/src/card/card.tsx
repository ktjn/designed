import type { ForwardedRef, HTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";
import styles from "./card.module.css";

export interface CardRootProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children?: ReactNode;
}

export interface CardDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode;
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

function CardRootImpl(
  { className, ...rest }: CardRootProps,
  ref: ForwardedRef<HTMLDivElement>,
) {
  const classes = [styles.root, className].filter(Boolean).join(" ");
  return <div ref={ref} className={classes} {...rest} />;
}

const CardRoot = forwardRef(CardRootImpl);
CardRoot.displayName = "Card";

function CardHeader({ className, ...rest }: CardHeaderProps) {
  const classes = [styles.header, className].filter(Boolean).join(" ");
  return <div className={classes} {...rest} />;
}

function CardTitle({ className, ...rest }: CardTitleProps) {
  const classes = [styles.title, className].filter(Boolean).join(" ");
  return <h3 className={classes} {...rest} />;
}

function CardDescription({ className, ...rest }: CardDescriptionProps) {
  const classes = [styles.description, className].filter(Boolean).join(" ");
  return <p className={classes} {...rest} />;
}

function CardContent({ className, ...rest }: CardContentProps) {
  const classes = [styles.content, className].filter(Boolean).join(" ");
  return <div className={classes} {...rest} />;
}

function CardFooter({ className, ...rest }: CardFooterProps) {
  const classes = [styles.footer, className].filter(Boolean).join(" ");
  return <div className={classes} {...rest} />;
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});
