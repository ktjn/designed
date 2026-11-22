import type { HTMLAttributes, Ref } from "react";
import { VisuallyHidden } from "../visually-hidden/visually-hidden.js";

export interface LiveRegionProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, "aria-atomic" | "aria-live"> {
  ref?: Ref<HTMLSpanElement>;
  politeness?: "polite" | "assertive";
  atomic?: boolean;
}

export function LiveRegion({
  politeness = "polite",
  atomic = true,
  ...rest
}: LiveRegionProps) {
  return (
    <VisuallyHidden
      role="status"
      aria-live={politeness}
      aria-atomic={atomic}
      data-slot="live-region"
      {...rest}
    />
  );
}
