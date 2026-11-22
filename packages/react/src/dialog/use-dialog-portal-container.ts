import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

const THEME_ATTRIBUTES = [
  "data-brand",
  "data-color-scheme",
  "data-density",
  "data-contrast",
] as const;

type ThemeAttr = (typeof THEME_ATTRIBUTES)[number];
type ResolvedThemeAttrs = Partial<Record<ThemeAttr, string>>;

interface SharedHostEntry {
  host: HTMLDivElement;
  count: number;
}

const sharedHosts = new Map<HTMLElement, SharedHostEntry>();

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export const PortalActivityContext = createContext<boolean | undefined>(
  undefined,
);

export function usePortalActivity(open?: boolean, defaultOpen?: boolean) {
  const [mounted, setMounted] = useState(Boolean(open ?? defaultOpen));
  if (open && !mounted) {
    setMounted(true);
  }
  const active = Boolean(open) || mounted;

  const onOpenChange = useCallback((next: boolean) => {
    if (next) {
      setMounted(true);
    }
  }, []);

  const onOpenChangeComplete = useCallback((next: boolean) => {
    if (!next) {
      setMounted(false);
    }
  }, []);

  return { active, onOpenChange, onOpenChangeComplete };
}

function collectResolvedTheme(node: HTMLElement): {
  attrs: ResolvedThemeAttrs;
  nearestNestedScope: HTMLElement | null;
  ancestors: HTMLElement[];
} {
  const attrs: ResolvedThemeAttrs = {};
  const ancestors: HTMLElement[] = [];
  let nearestNestedScope: HTMLElement | null = null;

  let current: HTMLElement | null = node.parentElement;
  while (current) {
    ancestors.push(current);
    const isRoot =
      current === document.documentElement || current === document.body;
    for (const attr of THEME_ATTRIBUTES) {
      if (attrs[attr] === undefined && current.hasAttribute(attr)) {
        const value = current.getAttribute(attr);
        if (value !== null) {
          attrs[attr] = value;
        }
        if (!isRoot && nearestNestedScope === null) {
          nearestNestedScope = current;
        }
      }
    }
    current = current.parentElement;
  }

  return { attrs, nearestNestedScope, ancestors };
}

function applyThemeAttrs(host: HTMLElement, attrs: ResolvedThemeAttrs) {
  for (const attr of THEME_ATTRIBUTES) {
    const value = attrs[attr];
    if (value !== undefined) {
      host.setAttribute(attr, value);
    } else {
      host.removeAttribute(attr);
    }
  }
}

function acquireSharedHost(
  scope: HTMLElement,
  attrs: ResolvedThemeAttrs,
): HTMLDivElement {
  const existing = sharedHosts.get(scope);
  if (existing) {
    existing.count += 1;
    applyThemeAttrs(existing.host, attrs);
    if (!existing.host.isConnected) {
      document.body.appendChild(existing.host);
    }
    return existing.host;
  }

  const host = document.createElement("div");
  host.setAttribute("data-slot", "portal-theme-scope");
  applyThemeAttrs(host, attrs);
  document.body.appendChild(host);
  sharedHosts.set(scope, { host, count: 1 });
  return host;
}

function releaseSharedHost(scope: HTMLElement) {
  const existing = sharedHosts.get(scope);
  if (!existing) {
    return;
  }
  existing.count -= 1;
  if (existing.count <= 0) {
    existing.host.remove();
    sharedHosts.delete(scope);
  }
}

export function useDialogPortalContainer(enabled?: boolean) {
  const contextActive = useContext(PortalActivityContext);
  const isEnabled = enabled ?? contextActive ?? true;
  const [scopeNode, setScopeNode] = useState<HTMLSpanElement | null>(null);
  const [resolvedState, setResolvedState] = useState<{
    ready: boolean;
    host: HTMLElement | undefined;
  }>({ ready: false, host: undefined });

  const scopeRef = useCallback((node: HTMLSpanElement | null) => {
    setScopeNode(node);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!isEnabled || !scopeNode || typeof document === "undefined") {
      setResolvedState({ ready: false, host: undefined });
      return;
    }

    let activeScope: HTMLElement | null = null;

    const sync = () => {
      const resolved = collectResolvedTheme(scopeNode);
      if (resolved.nearestNestedScope === activeScope) {
        if (activeScope) {
          const entry = sharedHosts.get(activeScope);
          if (entry) {
            applyThemeAttrs(entry.host, resolved.attrs);
          }
        } else {
          setResolvedState({ ready: true, host: undefined });
        }
        return resolved.ancestors;
      }

      if (activeScope) {
        releaseSharedHost(activeScope);
      }

      activeScope = resolved.nearestNestedScope;
      if (activeScope) {
        const host = acquireSharedHost(activeScope, resolved.attrs);
        setResolvedState({ ready: true, host });
      } else {
        setResolvedState({ ready: true, host: undefined });
      }
      return resolved.ancestors;
    };

    const ancestors = sync();

    const observer = new MutationObserver(() => {
      sync();
    });
    for (const target of ancestors) {
      observer.observe(target, {
        attributes: true,
        attributeFilter: [...THEME_ATTRIBUTES],
      });
    }

    return () => {
      observer.disconnect();
      if (activeScope) {
        releaseSharedHost(activeScope);
        activeScope = null;
      }
      setResolvedState({ ready: false, host: undefined });
    };
  }, [isEnabled, scopeNode]);

  const container: HTMLElement | null | undefined = isEnabled
    ? resolvedState.ready
      ? resolvedState.host
      : null
    : undefined;

  return { container, scopeRef };
}
