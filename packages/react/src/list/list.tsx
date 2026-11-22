import type { HTMLAttributes, ReactNode, Ref } from "react";
import styles from "./list.module.css";

export type ListVariant = "plain" | "contained";

export interface ListRootProps extends HTMLAttributes<HTMLUListElement> {
  ref?: Ref<HTMLUListElement>;
  variant?: ListVariant;
  children?: ReactNode;
}

function ListRoot({ variant = "plain", className, ...rest }: ListRootProps) {
  const classes = [styles.root, styles[variant], className]
    .filter(Boolean)
    .join(" ");
  return <ul data-slot="list" className={classes} {...rest} />;
}

export interface ListItemProps extends HTMLAttributes<HTMLLIElement> {
  ref?: Ref<HTMLLIElement>;
  leading?: ReactNode;
  trailing?: ReactNode;
  children?: ReactNode;
}

function ListItem({
  leading,
  trailing,
  className,
  children,
  ...rest
}: ListItemProps) {
  const classes = [styles.item, className].filter(Boolean).join(" ");
  return (
    <li data-slot="list-item" className={classes} {...rest}>
      {leading != null ? (
        <span data-slot="list-item-leading" className={styles.leading}>
          {leading}
        </span>
      ) : null}
      <span data-slot="list-item-content" className={styles.content}>
        {children}
      </span>
      {trailing != null ? (
        <span data-slot="list-item-trailing" className={styles.trailing}>
          {trailing}
        </span>
      ) : null}
    </li>
  );
}

export const List = Object.assign(ListRoot, {
  Item: ListItem,
});
