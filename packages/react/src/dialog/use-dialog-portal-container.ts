import { useCallback, useEffect, useState } from "react";

const THEME_ATTRIBUTES = [
  "data-brand",
  "data-color-scheme",
  "data-density",
  "data-contrast",
] as const;

function collectResolvedTheme(node: HTMLElement): {
  attrs: Partial<Record<(typeof THEME_ATTRIBUTES)[number], string>>;
  hasNestedScope: boolean;
  observed: HTMLElement[];
} {
  const attrs: Partial<Record<(typeof THEME_ATTRIBUTES)[number], string>> = {};
  const observed = new Set<HTMLElement>();
  let hasNestedScope = false;

  for (const attr of THEME_ATTRIBUTES) {
    const match = node.closest<HTMLElement>(`[${attr}]`);
    if (match) {
      const value = match.getAttribute(attr);
      if (value !== null) {
        attrs[attr] = value;
      }
      observed.add(match);
      if (match !== document.documentElement && match !== document.body) {
        hasNestedScope = true;
      }
    }
  }

  return { attrs, hasNestedScope, observed: Array.from(observed) };
}

function applyThemeAttrs(
  host: HTMLElement,
  attrs: Partial<Record<(typeof THEME_ATTRIBUTES)[number], string>>,
) {
  for (const attr of THEME_ATTRIBUTES) {
    const value = attrs[attr];
    if (value !== undefined) {
      host.setAttribute(attr, value);
    } else {
      host.removeAttribute(attr);
    }
  }
}

export function useDialogPortalContainer() {
  const [scopeNode, setScopeNode] = useState<HTMLSpanElement | null>(null);
  const [container, setContainer] = useState<HTMLElement | undefined>(
    undefined,
  );

  const scopeRef = useCallback((node: HTMLSpanElement | null) => {
    setScopeNode(node);
  }, []);

  useEffect(() => {
    if (!scopeNode || typeof document === "undefined") {
      setContainer(undefined);
      return;
    }

    const initial = collectResolvedTheme(scopeNode);
    if (!initial.hasNestedScope) {
      setContainer(undefined);
      return;
    }

    const host = document.createElement("div");
    host.setAttribute("data-slot", "portal-theme-scope");
    applyThemeAttrs(host, initial.attrs);
    document.body.appendChild(host);
    setContainer(host);

    const observer = new MutationObserver(() => {
      const updated = collectResolvedTheme(scopeNode);
      applyThemeAttrs(host, updated.attrs);
    });
    for (const target of initial.observed) {
      observer.observe(target, {
        attributes: true,
        attributeFilter: [...THEME_ATTRIBUTES],
      });
    }

    return () => {
      observer.disconnect();
      host.remove();
      setContainer(undefined);
    };
  }, [scopeNode]);

  return { container, scopeRef };
}
