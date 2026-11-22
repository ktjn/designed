import path from "node:path";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const dirname = import.meta.dirname;

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  optimizeDeps: {
    include: [
      "@ktjn/designed-react > @base-ui/react/accordion",
      "@ktjn/designed-react > @base-ui/react/alert-dialog",
      "@ktjn/designed-react > @base-ui/react/autocomplete",
      "@ktjn/designed-react > @base-ui/react/avatar",
      "@ktjn/designed-react > @base-ui/react/checkbox",
      "@ktjn/designed-react > @base-ui/react/collapsible",
      "@ktjn/designed-react > @base-ui/react/combobox",
      "@ktjn/designed-react > @base-ui/react/context-menu",
      "@ktjn/designed-react > @base-ui/react/dialog",
      "@ktjn/designed-react > @base-ui/react/direction-provider",
      "@ktjn/designed-react > @base-ui/react/drawer",
      "@ktjn/designed-react > @base-ui/react/fieldset",
      "@ktjn/designed-react > @base-ui/react/menu",
      "@ktjn/designed-react > @base-ui/react/meter",
      "@ktjn/designed-react > @base-ui/react/number-field",
      "@ktjn/designed-react > @base-ui/react/otp-field",
      "@ktjn/designed-react > @base-ui/react/popover",
      "@ktjn/designed-react > @base-ui/react/preview-card",
      "@ktjn/designed-react > @base-ui/react/progress",
      "@ktjn/designed-react > @base-ui/react/radio",
      "@ktjn/designed-react > @base-ui/react/radio-group",
      "@ktjn/designed-react > @base-ui/react/scroll-area",
      "@ktjn/designed-react > @base-ui/react/select",
      "@ktjn/designed-react > @base-ui/react/separator",
      "@ktjn/designed-react > @base-ui/react/slider",
      "@ktjn/designed-react > @base-ui/react/switch",
      "@ktjn/designed-react > @base-ui/react/tabs",
      "@ktjn/designed-react > @base-ui/react/toast",
      "@ktjn/designed-react > @base-ui/react/toggle",
      "@ktjn/designed-react > @base-ui/react/toggle-group",
      "@ktjn/designed-react > @base-ui/react/toolbar",
      "@ktjn/designed-react > @base-ui/react/tooltip",
      "@ktjn/designed-react > @base-ui/react/use-render",
    ],
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // The plugin will run tests for the stories defined in your Storybook config
          // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
          storybookTest({ configDir: path.join(dirname, ".storybook") }),
        ],
        test: {
          name: "storybook",
          // Pin a fixed port outside this machine's Windows Hyper-V/WSL
          // dynamic port-exclusion ranges (see `netsh int ipv4 show
          // excludedportrange protocol=tcp`); the default auto-picked port
          // landed inside an excluded range and failed with EACCES.
          api: { host: "127.0.0.1", port: 45678 },
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: "chromium" }],
          },
        },
      },
    ],
  },
});
