import {
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "../button/button.js";
import {
  Popover,
  type PopoverAlign,
  type PopoverSide,
} from "../popover/popover.js";
import type { ChangeEventDetails } from "../shared/change-event-details.js";
import styles from "./popconfirm.module.css";

export type PopconfirmConfirmVariant = "primary" | "danger";

export interface PopconfirmProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "children"> {
  ref?: Ref<HTMLDivElement>;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: PopconfirmConfirmVariant;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails?: ChangeEventDetails) => void;
  side?: PopoverSide;
  sideOffset?: number;
  align?: PopoverAlign;
  alignOffset?: number;
  collisionPadding?: number | Partial<Record<PopoverSide, number>>;
  children: ReactElement;
}

function hasRenderableContent(node: ReactNode): boolean {
  return node != null && typeof node !== "boolean" && node !== "";
}

function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
  return (
    value !== null &&
    (typeof value === "object" || typeof value === "function") &&
    "then" in value &&
    typeof (value as { then?: unknown }).then === "function"
  );
}

export function Popconfirm({
  ref,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "primary",
  onConfirm,
  onCancel,
  open,
  defaultOpen,
  onOpenChange,
  side = "top",
  sideOffset,
  align,
  alignOffset,
  collisionPadding,
  className,
  children,
  ...rest
}: PopconfirmProps) {
  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(
    Boolean(defaultOpen),
  );
  const resolvedOpen = isControlled ? open : uncontrolledOpen;
  const [pending, setPending] = useState(false);
  const pendingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  function updateOpen(next: boolean, eventDetails?: ChangeEventDetails) {
    if (!isControlled) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next, eventDetails);
  }

  function handleOpenChange(next: boolean, eventDetails?: ChangeEventDetails) {
    if (pendingRef.current && !next) {
      eventDetails?.cancel();
      return;
    }
    updateOpen(next, eventDetails);
  }

  function handleCancel() {
    if (pendingRef.current) {
      return;
    }
    onCancel?.();
    updateOpen(false);
  }

  async function handleConfirm() {
    if (pendingRef.current) {
      return;
    }
    if (!onConfirm) {
      updateOpen(false);
      return;
    }

    const result = onConfirm();
    if (!isPromiseLike(result)) {
      updateOpen(false);
      return;
    }

    pendingRef.current = true;
    setPending(true);
    let succeeded = false;
    try {
      await result;
      succeeded = true;
    } catch {
      succeeded = false;
    } finally {
      pendingRef.current = false;
      if (mountedRef.current) {
        setPending(false);
        if (succeeded) {
          updateOpen(false);
        }
      }
    }
  }

  const hasDescription = hasRenderableContent(description);
  const contentClasses = [styles.content, className].filter(Boolean).join(" ");

  return (
    <Popover open={resolvedOpen} onOpenChange={handleOpenChange}>
      <Popover.Trigger render={children} />
      <Popover.Content
        ref={ref}
        data-slot="popconfirm-content"
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        collisionPadding={collisionPadding}
        className={contentClasses}
        {...rest}
      >
        <Popover.Title data-slot="popconfirm-title" className={styles.title}>
          {title}
        </Popover.Title>
        {hasDescription ? (
          <Popover.Description
            data-slot="popconfirm-description"
            className={styles.description}
          >
            {description}
          </Popover.Description>
        ) : null}
        <div data-slot="popconfirm-actions" className={styles.actions}>
          <Button
            variant="secondary"
            size="small"
            disabled={pending}
            onClick={handleCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariant}
            size="small"
            loading={pending}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </Popover.Content>
    </Popover>
  );
}
