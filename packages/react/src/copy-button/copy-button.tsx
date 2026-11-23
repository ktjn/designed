import { CheckIcon, CopyIcon } from "@ktjn/designed-icons";
import { useState } from "react";
import { Button, type ButtonProps } from "../button/button.js";
import { useIconOverride } from "../designed-provider/icon-provider.js";
import { LiveRegion } from "../live-region/live-region.js";

export interface CopyButtonProps
  extends Omit<ButtonProps, "onClick" | "onCopy" | "value" | "children"> {
  value: string | (() => string);
  label?: string;
  copiedLabel?: string;
  copiedDuration?: number;
  onCopy?: (value: string) => void;
  onError?: (error: unknown) => void;
}

export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied",
  copiedDuration = 2000,
  onCopy,
  onError,
  variant = "secondary",
  ...rest
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const CopiedIcon = useIconOverride("check", CheckIcon);
  const CopyActionIcon = useIconOverride("copy", CopyIcon);

  async function handleClick() {
    const text = typeof value === "function" ? value() : value;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onCopy?.(text);
      setTimeout(() => setCopied(false), copiedDuration);
    } catch (error) {
      onError?.(error);
    }
  }

  return (
    <>
      <Button
        data-slot="copy-button"
        variant={variant}
        onClick={handleClick}
        {...rest}
      >
        {copied ? <CopiedIcon aria-hidden /> : <CopyActionIcon aria-hidden />}
        {copied ? copiedLabel : label}
      </Button>
      <LiveRegion>{copied ? copiedLabel : ""}</LiveRegion>
    </>
  );
}
