import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from "react";
import type { ChangeEventDetails } from "../shared/change-event-details.js";
import styles from "./tabs.module.css";

export type TabsOrientation = "horizontal" | "vertical";

export interface TabsRootProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  ref?: Ref<HTMLDivElement>;
  value?: unknown;
  defaultValue?: unknown;
  onValueChange?: (value: unknown, eventDetails?: ChangeEventDetails) => void;
  orientation?: TabsOrientation;
  children?: ReactNode;
}

function TabsRoot({ onValueChange, className, ...rest }: TabsRootProps) {
  return (
    <BaseTabs.Root
      data-slot="tabs"
      className={className}
      onValueChange={(value, eventDetails) =>
        onValueChange?.(value, eventDetails)
      }
      {...rest}
    />
  );
}

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  activateOnFocus?: boolean;
  loopFocus?: boolean;
  children?: ReactNode;
}

function TabsList({ className, children, ...rest }: TabsListProps) {
  return (
    <BaseTabs.List
      data-slot="tabs-list"
      className={className ? `${styles.list} ${className}` : styles.list}
      {...rest}
    >
      {children}
    </BaseTabs.List>
  );
}

export interface TabsTabProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  ref?: Ref<HTMLButtonElement>;
  render?: ReactElement;
  nativeButton?: boolean;
  value: unknown;
  disabled?: boolean;
  children?: ReactNode;
}

function TabsTab({ className, children, ...rest }: TabsTabProps) {
  return (
    <BaseTabs.Tab
      data-slot="tabs-tab"
      className={className ? `${styles.tab} ${className}` : styles.tab}
      {...rest}
    >
      {children}
    </BaseTabs.Tab>
  );
}

export interface TabsPanelProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  value: unknown;
  keepMounted?: boolean;
  children?: ReactNode;
}

function TabsPanel({ className, children, ...rest }: TabsPanelProps) {
  return (
    <BaseTabs.Panel
      data-slot="tabs-panel"
      className={className ? `${styles.panel} ${className}` : styles.panel}
      {...rest}
    >
      {children}
    </BaseTabs.Panel>
  );
}

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
});
