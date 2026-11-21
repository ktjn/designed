import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { ChevronLeftIcon, ChevronRightIcon } from "@ktjn/design-icons";
import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  createContext,
  type HTMLAttributes,
  type ReactNode,
  useContext,
  useState,
} from "react";
import { useDialogPortalContainer } from "../dialog/use-dialog-portal-container.js";
import { VisuallyHidden } from "../visually-hidden/visually-hidden.js";
import styles from "./sidebar.module.css";

export interface UseSidebarResult {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

const SidebarContext = createContext<UseSidebarResult | null>(null);

export function useSidebar(): UseSidebarResult {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within Sidebar.Provider");
  }
  return ctx;
}

export interface SidebarProviderProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  mobileOpen?: boolean;
  defaultMobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

function SidebarProvider({
  open,
  defaultOpen = true,
  onOpenChange,
  mobileOpen,
  defaultMobileOpen = false,
  onMobileOpenChange,
  className,
  children,
  ...rest
}: SidebarProviderProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const [uncontrolledMobileOpen, setUncontrolledMobileOpen] =
    useState(defaultMobileOpen);

  const currentOpen = open ?? uncontrolledOpen;
  const currentMobileOpen = mobileOpen ?? uncontrolledMobileOpen;

  const setOpen = (next: boolean) => {
    if (open === undefined) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
  };

  const setMobileOpen = (next: boolean) => {
    if (mobileOpen === undefined) {
      setUncontrolledMobileOpen(next);
    }
    onMobileOpenChange?.(next);
  };

  const classes = [styles.shell, className].filter(Boolean).join(" ");

  return (
    <SidebarContext.Provider
      value={{
        open: currentOpen,
        setOpen,
        toggle: () => setOpen(!currentOpen),
        mobileOpen: currentMobileOpen,
        setMobileOpen,
      }}
    >
      <div
        data-slot="sidebar-provider"
        data-state={currentOpen ? "expanded" : "collapsed"}
        className={classes}
        {...rest}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export interface SidebarRootProps extends HTMLAttributes<HTMLElement> {
  mobileTitle?: string;
  children?: ReactNode;
}

function SidebarRoot({
  mobileTitle = "Navigation",
  className,
  children,
  ...rest
}: SidebarRootProps) {
  const { open, mobileOpen, setMobileOpen } = useSidebar();
  const { container, scopeRef } = useDialogPortalContainer();
  const classes = [styles.sidebar, className].filter(Boolean).join(" ");

  return (
    <>
      <aside
        data-slot="sidebar"
        data-state={open ? "expanded" : "collapsed"}
        inert={!open || undefined}
        className={classes}
        {...rest}
      >
        {children}
      </aside>
      <span hidden ref={scopeRef} />
      <BaseDialog.Root
        open={mobileOpen}
        onOpenChange={(next) => setMobileOpen(next)}
      >
        <BaseDialog.Portal container={container}>
          <BaseDialog.Backdrop className={styles.mobileBackdrop} />
          <BaseDialog.Popup
            data-slot="sidebar-mobile"
            className={styles.mobilePopup}
          >
            <VisuallyHidden>
              <BaseDialog.Title>{mobileTitle}</BaseDialog.Title>
            </VisuallyHidden>
            {children}
          </BaseDialog.Popup>
        </BaseDialog.Portal>
      </BaseDialog.Root>
    </>
  );
}

export interface SidebarHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

function SidebarHeader({ className, ...rest }: SidebarHeaderProps) {
  return (
    <div
      data-slot="sidebar-header"
      className={className ? `${styles.header} ${className}` : styles.header}
      {...rest}
    />
  );
}

export interface SidebarContentProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

function SidebarContent({ className, ...rest }: SidebarContentProps) {
  return (
    <nav
      data-slot="sidebar-content"
      className={className ? `${styles.content} ${className}` : styles.content}
      {...rest}
    />
  );
}

export interface SidebarFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

function SidebarFooter({ className, ...rest }: SidebarFooterProps) {
  return (
    <div
      data-slot="sidebar-footer"
      className={className ? `${styles.footer} ${className}` : styles.footer}
      {...rest}
    />
  );
}

export interface SidebarGroupProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

function SidebarGroup({ className, ...rest }: SidebarGroupProps) {
  return (
    <div
      data-slot="sidebar-group"
      className={className ? `${styles.group} ${className}` : styles.group}
      {...rest}
    />
  );
}

export interface SidebarGroupLabelProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

function SidebarGroupLabel({ className, ...rest }: SidebarGroupLabelProps) {
  return (
    <div
      data-slot="sidebar-group-label"
      className={
        className ? `${styles.groupLabel} ${className}` : styles.groupLabel
      }
      {...rest}
    />
  );
}

export interface SidebarItemProps {
  active?: boolean;
  icon?: ReactNode;
  href?: string;
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
  "aria-label"?: string;
}

function SidebarItem({
  active = false,
  icon,
  href,
  className,
  children,
  onClick,
  "aria-label": ariaLabel,
}: SidebarItemProps) {
  const classes = [styles.item, className].filter(Boolean).join(" ");
  const content = (
    <>
      {icon ? (
        <span className={styles.itemIcon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
    </>
  );

  if (href !== undefined) {
    const linkProps: AnchorHTMLAttributes<HTMLAnchorElement> = {
      href,
      onClick,
      "aria-label": ariaLabel,
      "aria-current": active ? "page" : undefined,
      className: classes,
    };
    return (
      <a
        data-slot="sidebar-item"
        data-active={active ? "true" : undefined}
        {...linkProps}
      >
        {content}
      </a>
    );
  }

  const buttonProps: ButtonHTMLAttributes<HTMLButtonElement> = {
    type: "button",
    onClick,
    "aria-label": ariaLabel,
    "aria-current": active ? "page" : undefined,
    className: classes,
  };
  return (
    <button
      data-slot="sidebar-item"
      data-active={active ? "true" : undefined}
      {...buttonProps}
    >
      {content}
    </button>
  );
}

export interface SidebarInsetProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

function SidebarInset({ className, ...rest }: SidebarInsetProps) {
  return (
    <div
      data-slot="sidebar-inset"
      className={className ? `${styles.inset} ${className}` : styles.inset}
      {...rest}
    />
  );
}

export interface SidebarTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  mobile?: boolean;
}

function SidebarTrigger({
  mobile = false,
  className,
  onClick,
  "aria-label": ariaLabel = "Toggle sidebar",
  children,
  ...rest
}: SidebarTriggerProps) {
  const { open, toggle, mobileOpen, setMobileOpen } = useSidebar();
  const expanded = mobile ? mobileOpen : open;

  return (
    <button
      type="button"
      data-slot="sidebar-trigger"
      aria-label={ariaLabel}
      aria-expanded={expanded}
      className={className ? `${styles.trigger} ${className}` : styles.trigger}
      onClick={(event) => {
        onClick?.(event);
        if (mobile) {
          setMobileOpen(!mobileOpen);
        } else {
          toggle();
        }
      }}
      {...rest}
    >
      {children ??
        (expanded ? (
          <ChevronLeftIcon aria-hidden />
        ) : (
          <ChevronRightIcon aria-hidden />
        ))}
    </button>
  );
}

export const Sidebar = Object.assign(SidebarRoot, {
  Provider: SidebarProvider,
  Header: SidebarHeader,
  Content: SidebarContent,
  Footer: SidebarFooter,
  Group: SidebarGroup,
  GroupLabel: SidebarGroupLabel,
  Item: SidebarItem,
  Inset: SidebarInset,
  Trigger: SidebarTrigger,
});
