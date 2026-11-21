# @ktjn/design-icons

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
