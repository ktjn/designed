import type { HTMLAttributes, ReactNode, Ref } from "react";
import { createContext, useContext } from "react";
import styles from "./heading.module.css";

export type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const HeadingLevelContext = createContext<HeadingTag>("h2");

export interface HeadingSectionProps {
  children?: ReactNode;
}

export function HeadingSection({ children }: HeadingSectionProps) {
  const level = useContext(HeadingLevelContext);
  const nextLevel = Math.min(Number(level.slice(1)) + 1, 6);
  return (
    <HeadingLevelContext.Provider value={`h${nextLevel}` as HeadingTag}>
      {children}
    </HeadingLevelContext.Provider>
  );
}

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  ref?: Ref<HTMLHeadingElement>;
  as?: HeadingTag;
  children?: ReactNode;
}

export function Heading({ as, className, ...rest }: HeadingProps) {
  const contextTag = useContext(HeadingLevelContext);
  const Tag = as ?? contextTag;
  const classes = [styles.root, className].filter(Boolean).join(" ");
  return (
    <Tag
      data-slot="heading"
      data-level={Tag.slice(1)}
      className={classes}
      {...rest}
    />
  );
}
