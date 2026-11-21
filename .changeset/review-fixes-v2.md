---

"@ktjn/design-tokens": patch
"@ktjn/design-react": minor
---

Fix token cascade sub-layer collisions, nested theme resets, overlay portal clipping, and component accessibility/ergonomics:

- `@ktjn/design-tokens`: emit ordered cascade sub-layers (`ds.tokens.base`, `ds.tokens.density`, `ds.tokens.scheme`, `ds.tokens.contrast`, `ds.tokens.brand`), remove redundant `color.border.focus` from dark scheme, add explicit default-dimension reset rules (`light`/`default`) for nested scopes, and apply `editorial` dark overrides under OS `prefers-color-scheme: dark`.
- `@ktjn/design-react`: portal overlays to `document.body` inside a theme-stamped host to prevent `overflow: hidden` clipping and `transform` stacking issues; compute `Field` `aria-describedby` dynamically from mounted `Field.Description`/`Field.Error` and add full DOM escape hatches; filter `FileUpload` drops by `accept`; add per-slot position descriptions on `OTPField`; add `render` prop on `Dialog`, `AlertDialog`, `Drawer`, `Menu`, and `Popover` triggers/close controls; keep `Button` focusable while `loading` via `aria-disabled`/`aria-busy`; standardize React 19 `ref`-as-prop across all components.
