import {
  createContext,
  type HTMLAttributes,
  type Ref,
  useContext,
  useMemo,
} from "react";

export interface ThemeValues {
  brand?: string;
  colorScheme?: "light" | "dark";
  density?: "default" | "compact";
  contrast?: "default" | "more";
}

export interface ThemeProps
  extends HTMLAttributes<HTMLDivElement>,
    ThemeValues {
  ref?: Ref<HTMLDivElement>;
}

const ThemeContext = createContext<Readonly<ThemeValues>>({});

export function useTheme() {
  return useContext(ThemeContext);
}

export function Theme({
  brand,
  colorScheme,
  density,
  contrast,
  children,
  ...rest
}: ThemeProps) {
  const parent = useTheme();
  const values = useMemo(
    () => ({
      brand: brand ?? parent.brand,
      colorScheme: colorScheme ?? parent.colorScheme,
      density: density ?? parent.density,
      contrast: contrast ?? parent.contrast,
    }),
    [brand, colorScheme, density, contrast, parent],
  );

  return (
    <ThemeContext.Provider value={values}>
      <div
        data-slot="theme"
        {...rest}
        data-brand={brand}
        data-color-scheme={colorScheme}
        data-density={density}
        data-contrast={contrast}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
