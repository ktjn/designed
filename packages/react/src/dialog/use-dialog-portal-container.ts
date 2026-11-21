import { useCallback, useState } from "react";

export function useDialogPortalContainer() {
  const [container, setContainer] = useState<HTMLElement | null | undefined>(
    null,
  );
  const scopeRef = useCallback((node: HTMLSpanElement | null) => {
    if (node) {
      const scope = node.closest<HTMLElement>(
        ":is([data-brand], [data-color-scheme], [data-density], [data-contrast]):not(html, body)",
      );
      setContainer(scope ?? undefined);
    }
  }, []);

  return { container, scopeRef };
}
