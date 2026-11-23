import { Toast as BaseToast } from "@base-ui/react/toast";
import { CloseIcon } from "@ktjn/designed-icons";
import type { ReactNode } from "react";
import { useCallback, useMemo } from "react";
import { useI18nMessage } from "../designed-provider/i18n-provider.js";
import { useIconOverride } from "../designed-provider/icon-provider.js";
import { useDialogPortalContainer } from "../dialog/use-dialog-portal-container.js";
import styles from "./toast.module.css";

export type ToastVariant =
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "danger";

export type ToastPosition =
  | "top-start"
  | "top-end"
  | "bottom-start"
  | "bottom-end";

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
  icon?: ReactNode;
  onClose?: () => void;
}

export type ToastUpdateOptions = Partial<Omit<ToastOptions, "id">>;

export interface ToastPromiseOptions<Value> {
  loading: string | ToastUpdateOptions;
  success:
    | string
    | ToastUpdateOptions
    | ((result: Value) => string | ToastUpdateOptions);
  error:
    | string
    | ToastUpdateOptions
    | ((error: unknown) => string | ToastUpdateOptions);
}

export interface UseToastResult {
  add: (options: ToastOptions) => string;
  update: (id: string, options: ToastUpdateOptions) => void;
  close: (id?: string) => void;
  promise: <Value>(
    promise: Promise<Value>,
    options: ToastPromiseOptions<Value>,
  ) => Promise<Value>;
}

export interface ToastProviderProps {
  children: ReactNode;
  timeout?: number;
  limit?: number;
  dismissLabel?: string;
  position?: ToastPosition;
  className?: string;
}

interface ToastItemData {
  action?: ToastActionOptions;
  icon?: ReactNode;
}

function toToastManagerOptions<
  T extends {
    variant?: ToastVariant;
    icon?: ReactNode;
    action?: ToastActionOptions;
  },
>({ variant, icon, action, ...rest }: T) {
  return {
    ...rest,
    type: variant,
    data: action || icon ? { action, icon } : undefined,
  };
}

function ToastList({ dismissLabel }: { dismissLabel: string }) {
  const Icon = useIconOverride("close", CloseIcon);
  const { toasts } = BaseToast.useToastManager<ToastItemData>();

  return (
    <>
      {toasts.map((toast) => (
        <BaseToast.Root
          key={toast.id}
          data-slot="toast"
          toast={toast}
          className={styles.toast}
        >
          <div data-slot="toast-main" className={styles.main}>
            {toast.data?.icon ? (
              <div data-slot="toast-icon" className={styles.icon}>
                {toast.data.icon}
              </div>
            ) : null}
            <BaseToast.Content data-slot="toast-body" className={styles.body}>
              {toast.title ? (
                <BaseToast.Title
                  data-slot="toast-title"
                  className={styles.title}
                />
              ) : null}
              {toast.description ? (
                <BaseToast.Description
                  data-slot="toast-description"
                  className={styles.description}
                />
              ) : null}
            </BaseToast.Content>
          </div>
          <div data-slot="toast-actions" className={styles.actions}>
            {toast.data?.action ? (
              <BaseToast.Action
                data-slot="toast-action"
                className={styles.action}
                onClick={toast.data.action.onClick}
              >
                {toast.data.action.label}
              </BaseToast.Action>
            ) : null}
            <BaseToast.Close
              data-slot="toast-close"
              aria-label={dismissLabel}
              aria-hidden={false}
              className={styles.close}
            >
              <Icon aria-hidden />
            </BaseToast.Close>
          </div>
        </BaseToast.Root>
      ))}
    </>
  );
}

function ToastPortal({
  dismissLabel,
  position,
  className,
}: {
  dismissLabel: string;
  position: ToastPosition;
  className?: string;
}) {
  const { toasts } = BaseToast.useToastManager<ToastItemData>();
  const { container, scopeRef } = useDialogPortalContainer(toasts.length > 0);

  return (
    <>
      <span hidden ref={scopeRef} />
      <BaseToast.Portal container={container}>
        <BaseToast.Viewport
          data-slot="toast-viewport"
          data-position={position}
          className={
            className ? `${styles.viewport} ${className}` : styles.viewport
          }
        >
          <ToastList dismissLabel={dismissLabel} />
        </BaseToast.Viewport>
      </BaseToast.Portal>
    </>
  );
}

function ToastProvider({
  children,
  timeout = 5000,
  limit = 3,
  dismissLabel,
  position = "bottom-end",
  className,
}: ToastProviderProps) {
  const resolvedDismissLabel = useI18nMessage(
    "dismiss",
    dismissLabel,
    "Dismiss",
  );
  return (
    <BaseToast.Provider timeout={timeout} limit={limit}>
      {children}
      <ToastPortal
        dismissLabel={resolvedDismissLabel}
        position={position}
        className={className}
      />
    </BaseToast.Provider>
  );
}

export function useToast(): UseToastResult {
  const manager = BaseToast.useToastManager<ToastItemData>();

  const add = useCallback(
    (options: ToastOptions) => manager.add(toToastManagerOptions(options)),
    [manager],
  );

  const update = useCallback(
    (id: string, options: ToastUpdateOptions) => {
      manager.update(id, toToastManagerOptions(options));
    },
    [manager],
  );

  const close = useCallback(
    (id?: string) => {
      manager.close(id);
    },
    [manager],
  );

  const promise = useCallback(
    <Value,>(
      toastPromise: Promise<Value>,
      options: ToastPromiseOptions<Value>,
    ) =>
      manager.promise(toastPromise, {
        loading:
          typeof options.loading === "string"
            ? options.loading
            : toToastManagerOptions(options.loading),
        success: (result: Value) => {
          const resolved =
            typeof options.success === "function"
              ? options.success(result)
              : options.success;
          return typeof resolved === "string"
            ? resolved
            : toToastManagerOptions(resolved);
        },
        error: (error: unknown) => {
          const resolved =
            typeof options.error === "function"
              ? options.error(error)
              : options.error;
          return typeof resolved === "string"
            ? resolved
            : toToastManagerOptions(resolved);
        },
      }),
    [manager],
  );

  return useMemo(
    () => ({ add, update, close, promise }),
    [add, update, close, promise],
  );
}

export const Toast = {
  Provider: ToastProvider,
};
