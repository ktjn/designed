import { DirectionProvider as BaseDirectionProvider } from "@base-ui/react/direction-provider";
import type { HTMLAttributes, Ref } from "react";

export interface DirectionProviderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "dir"> {
  ref?: Ref<HTMLDivElement>;
  direction?: "ltr" | "rtl";
}

export function DirectionProvider({
  direction = "ltr",
  children,
  ...rest
}: DirectionProviderProps) {
  return (
    <BaseDirectionProvider direction={direction}>
      <div data-slot="direction-provider" {...rest} dir={direction}>
        {children}
      </div>
    </BaseDirectionProvider>
  );
}
