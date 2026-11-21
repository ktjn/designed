import "@ktjn/designed-tokens/css/all.css";
import "./preview.css";
import type { Decorator, Preview } from "@storybook/react-vite";
import { useEffect } from "react";

const withTheme: Decorator = (Story, context) => {
  const { brand, colorScheme, density, contrast } = context.globals;

  useEffect(() => {
    const root = document.documentElement;
    if (brand && brand !== "default") {
      root.setAttribute("data-brand", brand);
    } else {
      root.removeAttribute("data-brand");
    }
    if (colorScheme && colorScheme !== "default") {
      root.setAttribute("data-color-scheme", colorScheme);
    } else {
      root.setAttribute("data-color-scheme", "light");
    }
    if (density && density !== "default") {
      root.setAttribute("data-density", density);
    } else {
      root.removeAttribute("data-density");
    }
    if (contrast && contrast !== "default") {
      root.setAttribute("data-contrast", contrast);
    } else {
      root.setAttribute("data-contrast", "default");
    }
  }, [brand, colorScheme, density, contrast]);

  return <Story />;
};

const preview: Preview = {
  decorators: [withTheme],
  globalTypes: {
    brand: {
      description: "Brand",
      toolbar: {
        title: "Brand",
        icon: "paintbrush",
        items: [
          { value: "default", title: "Default" },
          { value: "editorial", title: "Editorial" },
        ],
      },
    },
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
    brand: "default",
    colorScheme: "default",
    density: "default",
    contrast: "default",
  },
  parameters: {
    options: {
      storySort: {
        order: ["Overview", "Tokens", "Icons", "Blocks", "*"],
      },
    },
    a11y: {
      test: "error",
    },
  },
};

export default preview;
