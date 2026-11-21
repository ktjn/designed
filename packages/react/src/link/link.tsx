import type { AnchorHTMLAttributes, ForwardedRef, ReactNode } from "react";
import { forwardRef } from "react";
import styles from "./link.module.css";

export interface LinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> {
  children?: ReactNode;
}

function LinkImpl(
  { ...rest }: LinkProps,
  ref: ForwardedRef<HTMLAnchorElement>,
) {
  return <a ref={ref} data-slot="link" className={styles.root} {...rest} />;
}

export const Link = forwardRef(LinkImpl);
Link.displayName = "Link";
