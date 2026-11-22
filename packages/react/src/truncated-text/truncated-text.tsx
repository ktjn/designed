import type { HTMLAttributes, ReactNode, Ref } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import { Tooltip } from "../tooltip/tooltip.js";
import styles from "./truncated-text.module.css";

export interface TruncatedTextProps extends HTMLAttributes<HTMLSpanElement> {
  ref?: Ref<HTMLSpanElement>;
  lines?: number;
  showTooltip?: boolean;
  children?: ReactNode;
}

export function TruncatedText({
  ref,
  lines = 1,
  showTooltip = true,
  className,
  children,
  ...rest
}: TruncatedTextProps) {
  const [truncated, setTruncated] = useState(false);
  const elementRef = useRef<HTMLSpanElement | null>(null);

  function assignRefs(node: HTMLSpanElement | null) {
    elementRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  }

  useLayoutEffect(() => {
    const node = elementRef.current;
    if (!node) return;
    const measure = () => {
      setTruncated(
        lines === 1
          ? node.scrollWidth > node.clientWidth
          : node.scrollHeight > node.clientHeight,
      );
    };
    measure();
    // Guards against a CSS Modules stylesheet that hasn't applied yet at
    // mount time (e.g. a brief flash-of-unstyled-content in dev/test
    // bundlers), which would make clientWidth report the unclipped width
    // and miss real overflow on the very first measurement.
    const raf = requestAnimationFrame(measure);
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [lines]);

  const classes = [styles.root, className].filter(Boolean).join(" ");
  const element = (
    <span
      ref={assignRefs}
      data-slot="truncated-text"
      data-lines={lines === 1 ? undefined : lines}
      style={lines === 1 ? undefined : ({ "--lines": lines } as never)}
      className={classes}
      {...rest}
    >
      {children}
    </span>
  );

  // The tooltip wrapper is always present (never conditionally swapped in
  // for the bare span) so toggling `truncated` can't force React to unmount
  // and remount the measured node -- that remount was discarding the very
  // state update it was reacting to.
  return (
    <Tooltip content={children} disabled={!showTooltip || !truncated}>
      {element}
    </Tooltip>
  );
}
