import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from "react";
import styles from "./accordion.module.css";

export interface AccordionRootProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  ref?: Ref<HTMLDivElement>;
  value?: unknown[];
  defaultValue?: unknown[];
  onValueChange?: (value: unknown[]) => void;
  disabled?: boolean;
  multiple?: boolean;
  children?: ReactNode;
}

function AccordionRoot({
  onValueChange,
  className,
  ...rest
}: AccordionRootProps) {
  return (
    <BaseAccordion.Root
      data-slot="accordion"
      className={className}
      onValueChange={(value) => onValueChange?.(value)}
      {...rest}
    />
  );
}

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  value: unknown;
  disabled?: boolean;
  children?: ReactNode;
}

function AccordionItem({ className, children, ...rest }: AccordionItemProps) {
  return (
    <BaseAccordion.Item
      data-slot="accordion-item"
      className={className ? `${styles.item} ${className}` : styles.item}
      {...rest}
    >
      {children}
    </BaseAccordion.Item>
  );
}

export interface AccordionTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
  render?: ReactElement;
  nativeButton?: boolean;
  children?: ReactNode;
}

function AccordionTrigger({
  className,
  children,
  ...rest
}: AccordionTriggerProps) {
  return (
    <BaseAccordion.Header>
      <BaseAccordion.Trigger
        data-slot="accordion-trigger"
        className={
          className ? `${styles.trigger} ${className}` : styles.trigger
        }
        {...rest}
      >
        {children}
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  );
}

export interface AccordionPanelProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  children?: ReactNode;
}

function AccordionPanel({ className, children, ...rest }: AccordionPanelProps) {
  return (
    <BaseAccordion.Panel
      data-slot="accordion-panel"
      className={className ? `${styles.panel} ${className}` : styles.panel}
      {...rest}
    >
      {children}
    </BaseAccordion.Panel>
  );
}

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Panel: AccordionPanel,
});
