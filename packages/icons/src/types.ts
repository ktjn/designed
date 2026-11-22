import type { Ref, SVGProps } from "react";

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  ref?: Ref<SVGSVGElement>;
}
