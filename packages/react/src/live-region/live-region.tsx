import {
  VisuallyHidden,
  type VisuallyHiddenProps,
} from "../visually-hidden/visually-hidden.js";

export interface LiveRegionProps
  extends Omit<VisuallyHiddenProps, "aria-atomic" | "aria-live"> {
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
