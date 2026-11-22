import { useDialogPortalContainer } from "./use-dialog-portal-container.js";

export function usePortalContainer(enabled = true) {
  const { container, scopeRef } = useDialogPortalContainer(enabled);

  return {
    container:
      enabled && container === undefined && typeof document !== "undefined"
        ? document.body
        : (container ?? null),
    scopeRef,
  };
}
