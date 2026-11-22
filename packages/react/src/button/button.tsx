import {
  type ButtonHTMLAttributes,
  cloneElement,
  type ReactElement,
  type ReactNode,
  type Ref,
  useMemo,
} from "react";
import styles from "./button.module.css";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "small" | "medium" | "large" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  ref?: Ref<HTMLButtonElement>;
  render?: ReactElement;
  nativeButton?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children?: ReactNode;
}

export function Button({
  ref,
  render,
  nativeButton,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled,
  type,
  className,
  onClick,
  "aria-disabled": ariaDisabled,
  children,
  ...rest
}: ButtonProps) {
  const element = render as
    | ReactElement<ButtonProps & { "data-slot"?: string }>
    | undefined;
  const elementProps = element?.props;
  const isNativeButton =
    !element || (nativeButton ?? element.type === "button");
  const elementRef = elementProps?.ref;
  const isDisabled = disabled ?? elementProps?.disabled;
  const disabledReplacement = !isNativeButton && isDisabled;
  const mergedRef = useMemo(() => {
    if (!ref || !elementRef) return ref ?? elementRef;
    return (node: HTMLButtonElement | null) => {
      const clearRef = attachRef(ref, node);
      const clearElementRef = attachRef(elementRef, node);
      return () => {
        clearRef();
        clearElementRef();
      };
    };
  }, [elementRef, ref]);
  const props = {
    type: isNativeButton
      ? (type ?? elementProps?.type ?? "button")
      : elementProps?.type,
    disabled: isNativeButton ? isDisabled : undefined,
    "data-loading": loading ? "" : undefined,
    "aria-disabled":
      ariaDisabled ??
      (loading || disabledReplacement || elementProps?.["aria-disabled"]),
    "aria-busy": loading || elementProps?.["aria-busy"],
    className: [
      styles.root,
      styles[variant],
      styles[size],
      className,
      elementProps?.className,
    ]
      .filter(Boolean)
      .join(" "),
    ref: mergedRef,
    ...rest,
    onClick: loading ? preventActivation : onClick,
  };
  const spinner = loading ? (
    <span
      className={styles.spinner}
      data-loading-indicator=""
      aria-hidden="true"
    />
  ) : null;

  if (element && elementProps) {
    return cloneElement(
      element,
      {
        "data-slot": "button",
        ...props,
        ...mergeEventHandlers(props, elementProps),
        ...((loading || isDisabled) && {
          onClick: preventActivation,
          onClickCapture: preventActivation,
          onAuxClick: preventActivation,
          onAuxClickCapture: preventActivation,
        }),
        ...(disabledReplacement ? { "data-disabled": "", tabIndex: -1 } : {}),
        style: { ...rest.style, ...elementProps.style },
      },
      spinner,
      children === undefined ? elementProps.children : children,
    );
  }

  return (
    <button data-slot="button" {...props}>
      {spinner}
      {children}
    </button>
  );
}

function mergeEventHandlers(
  wrapper: Record<string, unknown>,
  replacement: ButtonProps,
) {
  const handlers: Record<string, unknown> = {};
  for (const [name, inner] of Object.entries(replacement)) {
    if (!/^on[A-Z]/.test(name) || typeof inner !== "function") continue;
    const outer = wrapper[name];
    handlers[name] =
      typeof outer === "function"
        ? (...args: unknown[]) => {
            inner(...args);
            outer(...args);
          }
        : inner;
  }
  return handlers;
}

function preventActivation(event: React.SyntheticEvent) {
  event.preventDefault();
}

function attachRef(
  ref: Exclude<Ref<HTMLButtonElement>, null>,
  node: HTMLButtonElement | null,
) {
  if (typeof ref === "function") return ref(node) ?? (() => ref(null));
  ref.current = node;
  return () => {
    ref.current = null;
  };
}
