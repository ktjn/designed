import { useRender } from "@base-ui/react/use-render";
import {
  type AnchorHTMLAttributes,
  createContext,
  type HTMLAttributes,
  type LiHTMLAttributes,
  type MouseEvent,
  type OlHTMLAttributes,
  type ReactElement,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./anchor-nav.module.css";

interface AnchorNavContextValue {
  activeId: string | null;
  smoothScroll: boolean;
  registerLink: (href: string) => void;
  unregisterLink: (href: string) => void;
}

const AnchorNavContext = createContext<AnchorNavContextValue | null>(null);

export interface AnchorNavRootProps extends HTMLAttributes<HTMLElement> {
  ref?: React.Ref<HTMLElement>;
  smoothScroll?: boolean;
}

export interface AnchorNavListProps extends OlHTMLAttributes<HTMLOListElement> {
  ref?: React.Ref<HTMLOListElement>;
}

export interface AnchorNavItemProps extends LiHTMLAttributes<HTMLLIElement> {
  ref?: React.Ref<HTMLLIElement>;
}

export interface AnchorNavLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  ref?: React.Ref<HTMLAnchorElement>;
  render?: ReactElement;
  href: string;
}

function AnchorNavRoot({
  ref,
  "aria-label": ariaLabel = "Table of contents",
  smoothScroll = true,
  className,
  ...rest
}: AnchorNavRootProps) {
  const classes = [styles.root, className].filter(Boolean).join(" ");
  const [activeId, setActiveId] = useState<string | null>(null);
  const hrefsRef = useRef<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const registerLink = useCallback((href: string) => {
    hrefsRef.current.add(href);
  }, []);

  const unregisterLink = useCallback((href: string) => {
    hrefsRef.current.delete(href);
  }, []);

  useEffect(() => {
    const targets: Element[] = [];
    for (const href of hrefsRef.current) {
      const target = document.getElementById(href.slice(1));
      if (target) targets.push(target);
    }
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const closest = visible.reduce((prev, current) =>
          current.boundingClientRect.top < prev.boundingClientRect.top
            ? current
            : prev,
        );
        setActiveId(closest.target.id);
      },
      { rootMargin: "-10% 0px -80% 0px" },
    );
    observerRef.current = observer;
    for (const target of targets) observer.observe(target);

    return () => {
      observer.disconnect();
      observerRef.current = null;
    };
  }, []);

  return (
    <AnchorNavContext.Provider
      value={{ activeId, smoothScroll, registerLink, unregisterLink }}
    >
      <nav
        ref={ref}
        data-slot="anchor-nav"
        aria-label={ariaLabel}
        className={classes}
        {...rest}
      />
    </AnchorNavContext.Provider>
  );
}

function AnchorNavList({ className, ...rest }: AnchorNavListProps) {
  const classes = [styles.list, className].filter(Boolean).join(" ");
  return <ol data-slot="anchor-nav-list" className={classes} {...rest} />;
}

function AnchorNavItem({ className, ...rest }: AnchorNavItemProps) {
  const classes = [styles.item, className].filter(Boolean).join(" ");
  return <li data-slot="anchor-nav-item" className={classes} {...rest} />;
}

function AnchorNavLink({
  ref,
  render,
  href,
  className,
  onClick,
  "aria-current": ariaCurrentProp,
  ...rest
}: AnchorNavLinkProps) {
  const context = useContext(AnchorNavContext);
  if (!context) {
    throw new Error("AnchorNav.Link must be used within AnchorNav");
  }
  const { activeId, smoothScroll, registerLink, unregisterLink } = context;

  useEffect(() => {
    registerLink(href);
    return () => unregisterLink(href);
  }, [href, registerLink, unregisterLink]);

  const active = activeId === href.slice(1);
  const classes = [styles.link, className].filter(Boolean).join(" ");

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (event.defaultPrevented) return;
      event.preventDefault();
      const target = document.getElementById(href.slice(1));
      if (!target) return;
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      target.scrollIntoView({
        behavior: !smoothScroll || prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    },
    [href, onClick, smoothScroll],
  );

  const props = {
    ...rest,
    "data-slot": "anchor-nav-link",
    "data-active": active ? "" : undefined,
    "aria-current": active ? ("location" as const) : ariaCurrentProp,
    href,
    className: classes,
    onClick: handleClick,
  };

  const link = useRender({
    enabled: Boolean(render),
    ref,
    render,
    props,
  });

  return render ? link : <a ref={ref} {...props} />;
}

export const AnchorNav = Object.assign(AnchorNavRoot, {
  List: AnchorNavList,
  Item: AnchorNavItem,
  Link: AnchorNavLink,
});
