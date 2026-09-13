import "@ktjn/design-tokens/css/base.css";
import "@ktjn/design-tokens/css/schemes/dark.css";
import "@ktjn/design-tokens/css/densities/compact.css";
import "@ktjn/design-tokens/css/contrasts/more.css";
import type { Decorator, Preview } from "@storybook/react-vite";
import { useEffect } from "react";

const withTheme: Decorator = (Story, context) => {
  const { colorScheme, density, contrast } = context.globals;

  useEffect(() => {
    const root = document.documentElement;
    if (colorScheme && colorScheme !== "default") {
      root.setAttribute("data-color-scheme", colorScheme);
    } else {
      root.removeAttribute("data-color-scheme");
    }
    if (density && density !== "default") {
      root.setAttribute("data-density", density);
    } else {
      root.removeAttribute("data-density");
    }
    if (contrast && contrast !== "default") {
      root.setAttribute("data-contrast", contrast);
    } else {
      root.removeAttribute("data-contrast");
    }
  }, [colorScheme, density, contrast]);

  return <Story />;
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    colorScheme: {
      description: "Color scheme",
      toolbar: {
        title: "Color scheme",
        icon: "circlehollow",
        items: [
          { value: "default", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
      },
    },
    density: {
      description: "Density",
      toolbar: {
        title: "Density",
        icon: "component",
        items: [
          { value: "default", title: "Default" },
          { value: "compact", title: "Compact" },
        ],
      },
    },
    contrast: {
      description: "Contrast",
      toolbar: {
        title: "Contrast",
        icon: "contrast",
        items: [
          { value: "default", title: "Default" },
          { value: "more", title: "More" },
        ],
      },
    },
  },
  initialGlobals: {
    colorScheme: "default",
    density: "default",
    contrast: "default",
  },
  parameters: {
    a11y: {
      test: "error",
    },
  },
};

export default preview;
