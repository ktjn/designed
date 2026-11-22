import type { ElementType, HTMLAttributes, ReactNode, Ref } from "react";
import styles from "./text.module.css";

export type TextTag = "p" | "span" | "div" | "label";
export type TextSize = "100" | "200" | "300";
export type TextWeight = "regular" | "medium" | "bold";
export type TextTone = "default" | "muted" | "inverse";

export interface TextProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>;
  as?: TextTag;
  size?: TextSize;
  weight?: TextWeight;
  tone?: TextTone;
  children?: ReactNode;
}

export function Text({
  as = "p",
  size = "200",
  weight = "regular",
  tone = "default",
  className,
  ...rest
}: TextProps) {
  const Tag = as as ElementType;
  const classes = [styles.root, className].filter(Boolean).join(" ");
  return (
    <Tag
      data-slot="text"
      data-size={size}
      data-weight={weight}
      data-tone={tone}
      className={classes}
      {...rest}
    />
  );
}
