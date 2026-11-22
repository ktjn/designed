import type { HTMLAttributes, ReactElement, ReactNode, Ref } from "react";
import { Children, cloneElement, Fragment, isValidElement } from "react";
import { Avatar, type AvatarProps, type AvatarSize } from "../avatar/avatar.js";
import styles from "./avatar-group.module.css";

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  max?: number;
  size?: AvatarSize;
  renderOverflow?: (count: number) => ReactNode;
  overflowLabel?: (count: number) => string;
  children?: ReactNode;
}

interface FlattenedAvatarItem {
  key: string;
  element: ReactElement;
}

function defaultOverflowLabel(count: number): string {
  return `${count} more`;
}

function flattenChildren(
  children: ReactNode,
  prefix = "",
): FlattenedAvatarItem[] {
  const result: FlattenedAvatarItem[] = [];
  const items = Children.toArray(children);

  for (let index = 0; index < items.length; index += 1) {
    const child = items[index];
    if (!isValidElement(child)) {
      continue;
    }

    const segment = child.key !== null ? String(child.key) : String(index);
    const key = prefix ? `${prefix}/${segment}` : segment;

    if (child.type === Fragment) {
      const fragment = child as ReactElement<{ children?: ReactNode }>;
      result.push(...flattenChildren(fragment.props.children, key));
    } else {
      result.push({ key, element: child });
    }
  }

  return result;
}

function applyGroupSize(element: ReactElement, size: AvatarSize): ReactElement {
  if (element.type === Avatar) {
    const avatarElement = element as ReactElement<AvatarProps>;
    if (avatarElement.props.size === undefined) {
      return cloneElement(avatarElement, { size });
    }
  }
  return element;
}

export function AvatarGroup({
  ref,
  max,
  size = "medium",
  renderOverflow,
  overflowLabel = defaultOverflowLabel,
  className,
  children,
  ...rest
}: AvatarGroupProps) {
  const items = flattenChildren(children);
  const clampedMax =
    max === undefined || Number.isNaN(max) || max === Number.POSITIVE_INFINITY
      ? undefined
      : Math.max(0, Math.floor(max));
  const visibleItems =
    clampedMax !== undefined ? items.slice(0, clampedMax) : items;
  const overflowCount = items.length - visibleItems.length;

  const classes = [styles.root, className].filter(Boolean).join(" ");
  const overflowClasses = [styles.overflow, styles[size]].join(" ");

  return (
    <div
      ref={ref}
      data-slot="avatar-group"
      data-size={size}
      className={classes}
      {...rest}
    >
      {visibleItems.map(({ key, element }) => (
        <span key={key} data-slot="avatar-group-item" className={styles.item}>
          {applyGroupSize(element, size)}
        </span>
      ))}
      {overflowCount > 0 ? (
        renderOverflow ? (
          renderOverflow(overflowCount)
        ) : (
          <span
            role="img"
            data-slot="avatar-group-overflow"
            className={overflowClasses}
            aria-label={overflowLabel(overflowCount)}
          >
            +{overflowCount}
          </span>
        )
      ) : null}
    </div>
  );
}
