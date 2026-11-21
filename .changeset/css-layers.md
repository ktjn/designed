---

"@ktjn/design-tokens": minor
"@ktjn/design-react": minor
---

- `@ktjn/design-tokens`:
  - Wrap emitted token stylesheets in `@layer ds.tokens` (`@layer ds.tokens, ds.components;`).
  - Fix OS dark mode (`prefers-color-scheme: dark`) combined with explicit `data-contrast="more"` to apply dark high-contrast token overrides instead of light high-contrast overrides.
- `@ktjn/design-react`:
  - Wrap built component CSS Modules in `@layer ds.components`.
  - Sync `FileUpload` removals and drops into the native `<input type="file">` via `DataTransfer` so `FormData` submits the exact visible file list, and add `getRemoveLabel` for localization.
  - Validate `DatePicker` typed values against ISO calendar validity and `min`/`max` on commit and native form submission, and enforce `readOnly` on both input and calendar popover.
  - Preserve a keyboard tab stop across `Calendar` month navigation, clamp `PageUp`/`PageDown` month-end jumps, and add locale-aware `weekStartsOn` (with `Home`/`End` aligned to the resolved week boundaries).
  - Sync explicit child control `id` / `Field controlId` with `Field.Label`, expose `htmlFor` on `Field.Label`, and propagate `Field disabled` to form controls.
  - Scope `Select`, `Combobox`, `Popover`, and `Tooltip` portals to the nearest theme container so popups inherit scoped dark/brand/contrast themes.
  - Support `className` escape hatches consistently across inputs, buttons, links, and overlay triggers/contents, and widen the `@ktjn/design-tokens` peer range (`^0.3.0`) for independent patch/minor upgrades.
