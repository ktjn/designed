import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import type { ReactNode } from "react";
import styles from "./tabs.module.css";

export interface TabsRootProps {
  value?: unknown;
  defaultValue?: unknown;
  onValueChange?: (value: unknown) => void;
  children?: ReactNode;
}

function TabsRoot({ onValueChange, ...rest }: TabsRootProps) {
  return (
    <BaseTabs.Root
      data-slot="tabs"
      onValueChange={(value) => onValueChange?.(value)}
      {...rest}
    />
  );
}

export interface TabsListProps {
  children?: ReactNode;
}

function TabsList({ children }: TabsListProps) {
  return (
    <BaseTabs.List data-slot="tabs-list" className={styles.list}>
      {children}
    </BaseTabs.List>
  );
}

export interface TabsTabProps {
  value: unknown;
  disabled?: boolean;
  children?: ReactNode;
}

function TabsTab({ children, ...rest }: TabsTabProps) {
  return (
    <BaseTabs.Tab data-slot="tabs-tab" className={styles.tab} {...rest}>
      {children}
    </BaseTabs.Tab>
  );
}

export interface TabsPanelProps {
  value: unknown;
  children?: ReactNode;
}

function TabsPanel({ children, ...rest }: TabsPanelProps) {
  return (
    <BaseTabs.Panel data-slot="tabs-panel" className={styles.panel} {...rest}>
      {children}
    </BaseTabs.Panel>
  );
}

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
});
