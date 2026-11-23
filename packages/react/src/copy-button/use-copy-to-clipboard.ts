import { useCallback, useEffect, useRef, useState } from "react";

export type CopyToClipboardState = "idle" | "copied" | "error";

export type CopyToClipboardResult =
  | { ok: true; value: string }
  | { ok: false; error: unknown };

export function useCopyToClipboard(resetMs = 2000) {
  const [state, setState] = useState<CopyToClipboardState>("idle");
  const latestAttempt = useRef(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    return () => {
      latestAttempt.current += 1;
      clearTimeout(resetTimer.current);
    };
  }, []);

  const copy = useCallback(
    async (value: string | (() => string)): Promise<CopyToClipboardResult> => {
      const attempt = ++latestAttempt.current;
      let result: CopyToClipboardResult;
      try {
        const text = typeof value === "function" ? value() : value;
        await navigator.clipboard.writeText(text);
        result = { ok: true, value: text };
      } catch (error) {
        result = { ok: false, error };
      }

      if (attempt === latestAttempt.current) {
        clearTimeout(resetTimer.current);
        setState(result.ok ? "copied" : "error");
        resetTimer.current = setTimeout(() => setState("idle"), resetMs);
      }
      return result;
    },
    [resetMs],
  );

  return { copy, state };
}
