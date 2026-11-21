import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { ChevronDownIcon } from "@ktjn/design-icons";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import styles from "./collapsible.module.css";

export interface CollapsibleRootProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  children?: ReactNode;
}

function CollapsibleRoot({
  onOpenChange,
  className,
  ...rest
}: CollapsibleRootProps) {
  return (
    <BaseCollapsible.Root
      onOpenChange={onOpenChange ? (open) => onOpenChange(open) : undefined}
      className={className ? `${styles.root} ${className}` : styles.root}
      {...rest}
    />
  );
}

export interface CollapsibleTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

function CollapsibleTrigger({
  className,
  children,
  ...rest
}: CollapsibleTriggerProps) {
  return (
    <BaseCollapsible.Trigger
      className={className ? `${styles.trigger} ${className}` : styles.trigger}
      {...rest}
    >
      <span>{children}</span>
      <ChevronDownIcon aria-hidden className={styles.icon} />
    </BaseCollapsible.Trigger>
  );
}

export interface CollapsiblePanelProps extends HTMLAttributes<HTMLDivElement> {
  keepMounted?: boolean;
  children?: ReactNode;
}

function CollapsiblePanel({
  className,
  children,
  ...rest
}: CollapsiblePanelProps) {
  return (
    <BaseCollapsible.Panel
      className={className ? `${styles.panel} ${className}` : styles.panel}
      {...rest}
    >
      {children}
    </BaseCollapsible.Panel>
  );
}

export const Collapsible = Object.assign(CollapsibleRoot, {
  Trigger: CollapsibleTrigger,
  Panel: CollapsiblePanel,
});
