# @ktjn/design-icons

## 0.3.0

### Minor Changes

- acdc8a8: Rename packages to `@ktjn/designed-tokens`, `@ktjn/designed-icons`, and `@ktjn/designed-react`, and ship review fixes:
  
  - `@ktjn/designed-tokens`: emit ordered cascade sub-layers (`ds.tokens.base`, `ds.tokens.density`, `ds.tokens.scheme`, `ds.tokens.contrast`, `ds.tokens.brand`), remove redundant `color.border.focus` from dark scheme, add explicit default-dimension reset rules (`light`/`default`) for nested scopes, and apply `editorial` dark overrides under OS `prefers-color-scheme: dark`.
  - `@ktjn/designed-icons`: renamed from `@ktjn/design-icons`.
  - `@ktjn/designed-react`: portal overlays to `document.body` inside a theme-stamped host to prevent `overflow: hidden` clipping and `transform` stacking issues; compute `Field` `aria-describedby` dynamically from mounted `Field.Description`/`Field.Error` and add full DOM escape hatches; filter `FileUpload` drops by `accept`; add per-slot position descriptions on `OTPField`; add `render` prop on `Dialog`, `AlertDialog`, `Drawer`, `Menu`, and `Popover` triggers/close controls; keep `Button` focusable while `loading` via `aria-disabled`/`aria-busy`; standardize React 19 `ref`-as-prop across all components.

## 0.2.0

### Minor Changes

- f6dee9b: - `@ktjn/design-tokens`: export single-file `@ktjn/design-tokens/css/all.css` bundle combining base tokens and all theme overrides in cascade order.
  - `@ktjn/design-icons`: add `CalendarIcon` and `UploadIcon` (16 icons total).
  - `@ktjn/design-react`:
    - Add minimal layout primitives (`Stack`, `Grid`, `Container`) and shadcn-inspired components (`Kbd`, `ButtonGroup`, `InputGroup`, `AspectRatio`, `Sidebar` + `useSidebar`).
    - Add `ghost` variant and `icon` size to `Button`.
    - Extend `Menu` and `ContextMenu` with `Group`, `GroupLabel`, `CheckboxItem`, `RadioGroup`, `RadioItem`, `Separator`, and `Shortcut`.
    - Add consistent `data-slot` attributes across all components and wire `CalendarIcon` / `UploadIcon` into `DatePicker` and `FileUpload`.

## 0.1.0

### Minor Changes

- 72e6fce: Expand `@ktjn/design-icons` to 14 core monochrome icons, add platform `prefers-color-scheme` / `prefers-contrast` media queries overridable via `data-*` attributes, add `Button` `small`/`medium`/`large` sizes, `loading` state, and forced-colors styling, and integrate `@ktjn/design-icons` into `NumberField` and `Pagination`.
