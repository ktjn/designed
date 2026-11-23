import type { HTMLAttributes, ReactNode, Ref } from "react";
import styles from "./card.module.css";

export interface CardRootProps extends HTMLAttributes<HTMLDivElement> {
  as?: "div";
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
}

export interface CardSectionProps extends HTMLAttributes<HTMLElement> {
  as: "section" | "article";
  ref?: Ref<HTMLElement>;
  children?: ReactNode;
}

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  ref?: Ref<HTMLHeadingElement>;
  children?: ReactNode;
}

export interface CardDescriptionProps
  extends HTMLAttributes<HTMLParagraphElement> {
  ref?: Ref<HTMLParagraphElement>;
  children?: ReactNode;
}

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
}

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
}

function CardRoot({ className, ...props }: CardRootProps | CardSectionProps) {
  const classes = [styles.root, className].filter(Boolean).join(" ");
  if (props.as === undefined || props.as === "div") {
    const { as, ...rest } = props;
    return <div data-slot="card" className={classes} {...rest} />;
  }
  const { as: Element, ...rest } = props;
  return <Element data-slot="card" className={classes} {...rest} />;
}

function CardHeader({ className, ...rest }: CardHeaderProps) {
  const classes = [styles.header, className].filter(Boolean).join(" ");
  return <div data-slot="card-header" className={classes} {...rest} />;
}

function CardTitle({ as: Heading = "h3", className, ...rest }: CardTitleProps) {
  const classes = [styles.title, className].filter(Boolean).join(" ");
  return <Heading data-slot="card-title" className={classes} {...rest} />;
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
