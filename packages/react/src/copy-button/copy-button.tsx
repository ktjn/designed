import { AlertCircleIcon, CheckIcon, CopyIcon } from "@ktjn/designed-icons";
import { Button, type ButtonProps, type ButtonSize } from "../button/button.js";
import { useIconOverride } from "../designed-provider/icon-provider.js";
import { LiveRegion } from "../live-region/live-region.js";
import styles from "./copy-button.module.css";
import { useCopyToClipboard } from "./use-copy-to-clipboard.js";

export type CopyButtonSize = ButtonSize | "xs" | "sm";

type CopyButtonOverrides = "onClick" | "onCopy" | "value" | "children" | "size";

export interface CopyButtonProps
  extends Omit<ButtonProps, CopyButtonOverrides> {
  value: string | (() => string);
  label?: string;
  copiedLabel?: string;
  errorLabel?: string;
  copiedDuration?: number;
  size?: CopyButtonSize;
  onCopy?: (value: string) => void;
  onError?: (error: unknown) => void;
}

export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  errorLabel = "Copy failed",
  copiedDuration,
  size,
  onCopy,
  onError,
  variant = "secondary",
  className,
  "aria-label": ariaLabel,
  ...rest
}: CopyButtonProps) {
  const { copy, state } = useCopyToClipboard(copiedDuration);
  const CopiedIcon = useIconOverride("check", CheckIcon);
  const CopyActionIcon = useIconOverride("copy", CopyIcon);
  const ErrorIcon = useIconOverride("alertCircle", AlertCircleIcon);
  const feedback = { copied: copiedLabel, error: errorLabel };
  const icons = { copied: CopiedIcon, error: ErrorIcon };
  const message = state === "idle" ? undefined : feedback[state];
  const Icon = state === "idle" ? CopyActionIcon : icons[state];
  const compact = size === "xs" || size === "sm";

  async function handleClick() {
    const result = await copy(value);
    if (!result.ok) {
      onError?.(result.error);
      return;
    }
    try {
      onCopy?.(result.value);
    } catch (error) {
      onError?.(error);
    }
  }

  return (
    <>
      <Button
        data-slot="copy-button"
        variant={variant}
        size={compact ? "icon" : size}
        className={
          compact
            ? [styles.compact, styles[size], className]
                .filter(Boolean)
                .join(" ")
            : className
        }
        aria-label={ariaLabel ?? (compact ? (message ?? label) : undefined)}
        onClick={handleClick}
        {...rest}
        {...(state !== "idle" && { "data-state": state })}
      >
        <Icon aria-hidden />
        {compact ? null : (message ?? label)}
      </Button>
      <LiveRegion>{message}</LiveRegion>
    </>
  );
}
