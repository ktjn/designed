import type { HTMLAttributes, ReactNode, Ref } from "react";
import styles from "./card.module.css";

export interface CardRootProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
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

function CardRoot({ ref, className, ...rest }: CardRootProps) {
  const classes = [styles.root, className].filter(Boolean).join(" ");
  return <div ref={ref} data-slot="card" className={classes} {...rest} />;
}

function CardHeader({ className, ...rest }: CardHeaderProps) {
  const classes = [styles.header, className].filter(Boolean).join(" ");
  return <div data-slot="card-header" className={classes} {...rest} />;
}

function CardTitle({ className, ...rest }: CardTitleProps) {
  const classes = [styles.title, className].filter(Boolean).join(" ");
  return <h3 data-slot="card-title" className={classes} {...rest} />;
}

function CardDescription({ className, ...rest }: CardDescriptionProps) {
  const classes = [styles.description, className].filter(Boolean).join(" ");
  return <p data-slot="card-description" className={classes} {...rest} />;
}

function CardContent({ className, ...rest }: CardContentProps) {
  const classes = [styles.content, className].filter(Boolean).join(" ");
  return <div data-slot="card-content" className={classes} {...rest} />;
}

function CardFooter({ className, ...rest }: CardFooterProps) {
  const classes = [styles.footer, className].filter(Boolean).join(" ");
  return <div data-slot="card-footer" className={classes} {...rest} />;
}

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
});
