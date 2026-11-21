import { Toast as BaseToast } from "@base-ui/react/toast";
import { CloseIcon } from "@ktjn/design-icons";
import type { ReactNode } from "react";
import { useCallback, useMemo } from "react";
import { useDialogPortalContainer } from "../dialog/use-dialog-portal-container.js";
import styles from "./toast.module.css";

export type ToastVariant =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger";

export interface ToastActionOptions {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  id?: string;
  title?: ReactNode;
  description?: ReactNode;
  variant?: ToastVariant;
  timeout?: number;
  priority?: "low" | "high";
  action?: ToastActionOptions;
}

export interface UseToastResult {
  add: (options: ToastOptions) => string;
  close: (id?: string) => void;
}

export interface ToastProviderProps {
  children: ReactNode;
  timeout?: number;
  limit?: number;
  dismissLabel?: string;
}

interface ToastItemData {
  action?: ToastActionOptions;
}

function ToastList({ dismissLabel }: { dismissLabel: string }) {
  const { toasts } = BaseToast.useToastManager<ToastItemData>();

  return (
    <>
      {toasts.map((toast) => (
        <BaseToast.Root key={toast.id} toast={toast} className={styles.toast}>
          <BaseToast.Content className={styles.body}>
            {toast.title ? <BaseToast.Title className={styles.title} /> : null}
            {toast.description ? (
              <BaseToast.Description className={styles.description} />
            ) : null}
          </BaseToast.Content>
          <div className={styles.actions}>
            {toast.data?.action ? (
              <BaseToast.Action
                className={styles.action}
                onClick={toast.data.action.onClick}
              >
                {toast.data.action.label}
              </BaseToast.Action>
            ) : null}
            <BaseToast.Close
              aria-label={dismissLabel}
              aria-hidden={false}
              className={styles.close}
            >
              <CloseIcon aria-hidden />
            </BaseToast.Close>
          </div>
        </BaseToast.Root>
      ))}
    </>
  );
}

function ToastProvider({
  children,
  timeout = 5000,
  limit = 3,
  dismissLabel = "Dismiss",
}: ToastProviderProps) {
  const { container, scopeRef } = useDialogPortalContainer();

  return (
    <BaseToast.Provider timeout={timeout} limit={limit}>
      {children}
      <span hidden ref={scopeRef} />
      <BaseToast.Portal container={container}>
        <BaseToast.Viewport className={styles.viewport}>
          <ToastList dismissLabel={dismissLabel} />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </BaseToast.Provider>
  );
}

export function useToast(): UseToastResult {
  const manager = BaseToast.useToastManager<ToastItemData>();

  const add = useCallback(
    ({ variant = "neutral", action, ...rest }: ToastOptions) =>
      manager.add({
        ...rest,
        type: variant,
        data: action ? { action } : undefined,
      }),
    [manager],
  );

  const close = useCallback(
    (id?: string) => {
      manager.close(id);
    },
    [manager],
  );

  return useMemo(() => ({ add, close }), [add, close]);
}

export const Toast = {
  Provider: ToastProvider,
};
