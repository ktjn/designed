import type { AnchorHTMLAttributes, ReactNode, Ref } from "react";
import styles from "./link.module.css";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  ref?: Ref<HTMLAnchorElement>;
  children?: ReactNode;
}

export function Link({ ref, className, ...rest }: LinkProps) {
  return (
    <a
      ref={ref}
      data-slot="link"
      className={className ? `${styles.root} ${className}` : styles.root}
      {...rest}
    />
  );
}
