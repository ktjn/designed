import { useRender } from "@base-ui/react/use-render";
import type { AnchorHTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import styles from "./link.module.css";

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  ref?: Ref<HTMLAnchorElement>;
  render?: ReactElement;
  children?: ReactNode;
}

export function Link({ ref, render, className, ...rest }: LinkProps) {
  const classes = className ? `${styles.root} ${className}` : styles.root;
  const link = useRender({
    enabled: Boolean(render),
    ref,
    render,
    props: {
      "data-slot": "link",
      className: classes,
      ...rest,
    },
  });
  return render ? (
    link
  ) : (
    <a ref={ref} data-slot="link" className={classes} {...rest} />
  );
}
