import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const srcDir = path.join(
  path.dirname(path.dirname(fileURLToPath(import.meta.url))),
  "src",
);

const stylesheetsWithForcedColors = [
  "accordion/accordion.module.css",
  "autocomplete/autocomplete.module.css",
  "breadcrumb/breadcrumb.module.css",
  "button/button.module.css",
  "button-group/button-group.module.css",
  "calendar/calendar.module.css",
  "checkbox/checkbox.module.css",
  "checkbox-card/checkbox-card.module.css",
  "collapsible/collapsible.module.css",
  "combobox/combobox.module.css",
  "command-palette/command-palette.module.css",
  "context-menu/context-menu.module.css",
  "date-picker/date-picker.module.css",
  "dialog/dialog.module.css",
  "drawer/drawer.module.css",
  "file-upload/file-upload.module.css",
  "input/input.module.css",
  "input-group/input-group.module.css",
  "kbd/kbd.module.css",
  "link/link.module.css",
  "menu/menu.module.css",
  "meter/meter.module.css",
  "number-field/number-field.module.css",
  "otp-field/otp-field.module.css",
  "pagination/pagination.module.css",
  "popover/popover.module.css",
  "preview-card/preview-card.module.css",
  "progress/progress.module.css",
  "radio-card/radio-card.module.css",
  "radio-group/radio-group.module.css",
  "scroll-area/scroll-area.module.css",
  "select/select.module.css",
  "sidebar/sidebar.module.css",
  "slider/slider.module.css",
  "stepper/stepper.module.css",
  "switch/switch.module.css",
  "tabs/tabs.module.css",
  "tag/tag.module.css",
  "tag-overflow/tag-overflow.module.css",
  "textarea/textarea.module.css",
  "toast/toast.module.css",
  "toggle/toggle.module.css",
  "toggle-group/toggle-group.module.css",
  "toolbar/toolbar.module.css",
  "tooltip/tooltip.module.css",
];

describe("forced-colors support", () => {
  it("defines @media (forced-colors: active) rules on interactive controls and overlays", async () => {
    for (const file of stylesheetsWithForcedColors) {
      const css = await readFile(path.join(srcDir, file), "utf8");
      expect(css, `${file} should support forced-colors`).toContain(
        "@media (forced-colors: active)",
      );
    }
  });
});
