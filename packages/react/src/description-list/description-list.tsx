import type { HTMLAttributes, ReactNode, Ref } from "react";
import styles from "./description-list.module.css";

export interface DescriptionListRootProps
  extends HTMLAttributes<HTMLDListElement> {
  ref?: Ref<HTMLDListElement>;
  children?: ReactNode;
}

function DescriptionListRoot({ className, ...rest }: DescriptionListRootProps) {
  const classes = [styles.root, className].filter(Boolean).join(" ");
  return <dl data-slot="description-list" className={classes} {...rest} />;
}

export interface DescriptionListItemProps
  extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  term: ReactNode;
  children?: ReactNode;
}

function DescriptionListItem({
  term,
  className,
  children,
  ...rest
}: DescriptionListItemProps) {
  const classes = [styles.item, className].filter(Boolean).join(" ");
  return (
    <div data-slot="description-list-item" className={classes} {...rest}>
      <dt data-slot="description-list-term" className={styles.term}>
        {term}
      </dt>
      <dd data-slot="description-list-detail" className={styles.detail}>
        {children}
      </dd>
    </div>
  );
}

export const DescriptionList = Object.assign(DescriptionListRoot, {
  Item: DescriptionListItem,
});
