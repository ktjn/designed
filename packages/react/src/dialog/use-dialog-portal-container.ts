import { useCallback, useEffect, useState } from "react";

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

export function useDialogPortalContainer(enabled = true) {
  const [scopeNode, setScopeNode] = useState<HTMLSpanElement | null>(null);
  const [container, setContainer] = useState<HTMLElement | undefined>(
    undefined,
  );

  const scopeRef = useCallback((node: HTMLSpanElement | null) => {
    setScopeNode(node);
  }, []);

  useEffect(() => {
    if (!enabled || !scopeNode || typeof document === "undefined") {
      setContainer(undefined);
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
        }
        return resolved.ancestors;
      }

      if (activeScope) {
        releaseSharedHost(activeScope);
      }

      activeScope = resolved.nearestNestedScope;
      if (activeScope) {
        const host = acquireSharedHost(activeScope, resolved.attrs);
        setContainer(host);
      } else {
        setContainer(undefined);
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
      setContainer(undefined);
    };
  }, [enabled, scopeNode]);

  return { container, scopeRef };
}
