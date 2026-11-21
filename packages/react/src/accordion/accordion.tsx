import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import type { ReactNode } from "react";
import styles from "./accordion.module.css";

export interface AccordionRootProps {
  value?: unknown[];
  defaultValue?: unknown[];
  onValueChange?: (value: unknown[]) => void;
  disabled?: boolean;
  /**
   * Whether multiple items can be open at the same time.
   * @default false
   */
  multiple?: boolean;
  children?: ReactNode;
}

function AccordionRoot({ onValueChange, ...rest }: AccordionRootProps) {
  return (
    <BaseAccordion.Root
      data-slot="accordion"
      onValueChange={(value) => onValueChange?.(value)}
      {...rest}
    />
  );
}

export interface AccordionItemProps {
  value: unknown;
  disabled?: boolean;
  children?: ReactNode;
}

function AccordionItem({ children, ...rest }: AccordionItemProps) {
  return (
    <BaseAccordion.Item
      data-slot="accordion-item"
      className={styles.item}
      {...rest}
    >
      {children}
    </BaseAccordion.Item>
  );
}

export interface AccordionTriggerProps {
  children?: ReactNode;
}

function AccordionTrigger({ children }: AccordionTriggerProps) {
  return (
    <BaseAccordion.Header>
      <BaseAccordion.Trigger
        data-slot="accordion-trigger"
        className={styles.trigger}
      >
        {children}
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  );
}

export interface AccordionPanelProps {
  children?: ReactNode;
}

function AccordionPanel({ children }: AccordionPanelProps) {
  return (
    <BaseAccordion.Panel data-slot="accordion-panel" className={styles.panel}>
      {children}
    </BaseAccordion.Panel>
  );
}

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Panel: AccordionPanel,
});
