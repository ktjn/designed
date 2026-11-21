import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="136" height="28" viewBox="0 0 136 28" fill="none">
  <rect x="1" y="2" width="24" height="24" rx="6" fill="#2563EB"/>
  <rect x="6" y="7" width="14" height="14" rx="3" stroke="#FFFFFF" stroke-width="2"/>
  <circle cx="13" cy="14" r="2.5" fill="#FFFFFF"/>
  <text x="34" y="19.5" font-family="system-ui, -apple-system, Segoe UI, Roboto, sans-serif" font-size="16" font-weight="700" letter-spacing="-0.02em" fill="#111827">Designed</text>
</svg>`;

const brandImage = `data:image/svg+xml;utf8,${encodeURIComponent(logoSvg)}`;

const designedTheme = create({
  base: "light",
  brandTitle: "Designed",
  brandUrl: "https://github.com/ktjn/designed",
  brandImage,
  brandTarget: "_blank",
  colorPrimary: "#2563eb",
  colorSecondary: "#2563eb",
  appBg: "#f9fafb",
  appContentBg: "#ffffff",
  appPreviewBg: "#ffffff",
  appBorderColor: "#e5e7eb",
  appBorderRadius: 8,
  fontBase:
    'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  fontCode:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  textColor: "#111827",
  textInverseColor: "#ffffff",
  textMutedColor: "#4b5563",
  barTextColor: "#374151",
  barSelectedColor: "#2563eb",
  barHoverColor: "#1d4ed8",
  barBg: "#ffffff",
  inputBg: "#ffffff",
  inputBorder: "#d1d5db",
  inputTextColor: "#111827",
  inputBorderRadius: 6,
});

addons.setConfig({
  theme: designedTheme,
  sidebar: {
    showRoots: true,
  },
});
