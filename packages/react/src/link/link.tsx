import type { AnchorHTMLAttributes, ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";
import styles from "./link.module.css";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: ReactNode;
}

function LinkImpl(
  { className, ...rest }: LinkProps,
  ref: ForwardedRef<HTMLAnchorElement>,
) {
  return (
    <a
      ref={ref}
      data-slot="link"
      className={className ? `${styles.root} ${className}` : styles.root}
      {...rest}
    />
  );
}

export const Link = forwardRef(LinkImpl);
Link.displayName = "Link";
