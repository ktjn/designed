import { CheckIcon, CopyIcon } from "@ktjn/designed-icons";
import type { HTMLAttributes, ReactNode, Ref } from "react";
import { useRef, useState } from "react";
import styles from "./code-snippet.module.css";

export type CodeSnippetVariant = "inline" | "block";

export interface CodeSnippetProps extends HTMLAttributes<HTMLElement> {
  ref?: Ref<HTMLElement>;
  variant?: CodeSnippetVariant;
  showCopyButton?: boolean;
  copyLabel?: string;
  copiedLabel?: string;
  children?: ReactNode;
}

export function CodeSnippet({
  ref,
  variant = "inline",
  showCopyButton = variant === "block",
  copyLabel = "Copy code",
  copiedLabel = "Copied",
  className,
  children,
  ...rest
}: CodeSnippetProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement | null>(null);

  function assignRefs(node: HTMLElement | null) {
    codeRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }

  async function handleCopy() {
    const text = codeRef.current?.textContent ?? "";
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const classes = [styles.code, className].filter(Boolean).join(" ");

  if (variant === "inline") {
    return (
      <code
        ref={assignRefs}
        data-slot="code-snippet"
        data-variant="inline"
        className={classes}
        {...rest}
      >
        {children}
      </code>
    );
  }

  return (
    <div data-slot="code-snippet-block" className={styles.block}>
      <pre className={styles.pre}>
        <code
          ref={assignRefs}
          data-slot="code-snippet"
          data-variant="block"
          className={classes}
          {...rest}
        >
          {children}
        </code>
      </pre>
      {showCopyButton ? (
        <button
          type="button"
          data-slot="code-snippet-copy"
          aria-label={copied ? copiedLabel : copyLabel}
          onClick={handleCopy}
          className={styles.copyButton}
        >
          {copied ? <CheckIcon aria-hidden /> : <CopyIcon aria-hidden />}
        </button>
      ) : null}
    </div>
  );
}
