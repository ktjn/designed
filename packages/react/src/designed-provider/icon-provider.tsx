import type { IconProps } from "@ktjn/designed-icons";
import {
  type ComponentType,
  createContext,
  type ReactNode,
  useContext,
  useMemo,
} from "react";

export type IconKey =
  | "close"
  | "search"
  | "chevronLeft"
  | "chevronRight"
  | "chevronDown"
  | "check"
  | "calendar"
  | "copy"
  | "upload"
  | "eye"
  | "eyeOff"
  | "minus"
  | "plus"
  | "gripVertical"
  | "arrowUp"
  | "arrowDown"
  | "info"
  | "sort"
  | "alertCircle"
  | "alertTriangle";

export type IconOverrides = Partial<Record<IconKey, ComponentType<IconProps>>>;

const IconContext = createContext<IconOverrides>({});

export function useIconOverrides(): IconOverrides {
  return useContext(IconContext);
}

export function IconProvider({
  overrides,
  children,
}: {
  overrides: IconOverrides;
  children?: ReactNode;
}) {
  const parent = useIconOverrides();
  const merged = useMemo(
    () => ({ ...parent, ...overrides }),
    [parent, overrides],
  );

  return <IconContext.Provider value={merged}>{children}</IconContext.Provider>;
}

export function useIconOverride<K extends IconKey>(
  key: K,
  defaultIcon: NonNullable<IconOverrides[K]>,
): NonNullable<IconOverrides[K]> {
  const overrides = useIconOverrides();
  return overrides[key] ?? defaultIcon;
}
