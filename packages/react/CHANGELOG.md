# @ktjn/design-react

## 0.5.0

### Minor Changes

- fb134e8: - `@ktjn/design-tokens`:
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

### Patch Changes

- Updated dependencies [fb134e8]
  - @ktjn/design-tokens@0.5.0

## 0.4.0

### Minor Changes

- f6dee9b: - `@ktjn/design-tokens`: export single-file `@ktjn/design-tokens/css/all.css` bundle combining base tokens and all theme overrides in cascade order.
  - `@ktjn/design-icons`: add `CalendarIcon` and `UploadIcon` (16 icons total).
  - `@ktjn/design-react`:
    - Add minimal layout primitives (`Stack`, `Grid`, `Container`) and shadcn-inspired components (`Kbd`, `ButtonGroup`, `InputGroup`, `AspectRatio`, `Sidebar` + `useSidebar`).
    - Add `ghost` variant and `icon` size to `Button`.
    - Extend `Menu` and `ContextMenu` with `Group`, `GroupLabel`, `CheckboxItem`, `RadioGroup`, `RadioItem`, `Separator`, and `Shortcut`.
    - Add consistent `data-slot` attributes across all components and wire `CalendarIcon` / `UploadIcon` into `DatePicker` and `FileUpload`.

### Patch Changes

- Updated dependencies [f6dee9b]
  - @ktjn/design-tokens@0.4.0
  - @ktjn/design-icons@0.2.0

## 0.3.0

### Minor Changes

- d7a16d4: Add 17 standard components (`Autocomplete`, `Calendar`, `Collapsible`, `CommandPalette`, `ContextMenu`, `DatePicker`, `Drawer`, `EmptyState`, `FileUpload`, `Meter`, `OTPField`, `PreviewCard`, `ScrollArea`, `Stepper`, `Tag`, `Toolbar`, `VisuallyHidden`) and extend `@media (forced-colors: active)` styling across interactive form controls and overlays.
- 72e6fce: Expand `@ktjn/design-icons` to 14 core monochrome icons, add platform `prefers-color-scheme` / `prefers-contrast` media queries overridable via `data-*` attributes, add `Button` `small`/`medium`/`large` sizes, `loading` state, and forced-colors styling, and integrate `@ktjn/design-icons` into `NumberField` and `Pagination`.

### Patch Changes

- Updated dependencies [72e6fce]
  - @ktjn/design-icons@0.1.0
  - @ktjn/design-tokens@0.3.0

## 0.2.0

### Minor Changes

- a465d27: Add semantic status tokens (`info`, `success`, `warning`, `danger`), fix dark + high-contrast composition, add the `editorial` brand override, and add 17 React components (`Alert`, `Avatar`, `Badge`, `Breadcrumb`, `Card`, `Fieldset`, `NumberField`, `Pagination`, `Progress`, `Separator`, `Skeleton`, `Slider`, `Spinner`, `Table`, `Toast`/`useToast`, `Toggle`, `ToggleGroup`).

### Patch Changes

- c28416e: Keep dialogs within the viewport and preserve scoped themes. Improve the visibility of selected and invalid states, correct RTL switch positioning, and honor reduced-motion preferences.
- Updated dependencies [a465d27]
  - @ktjn/design-tokens@0.2.0

## 0.1.0

### Minor Changes

- 1b6fbbf: Visual polish: accessible control borders (3:1), hover/focus/disabled states, popup elevation, consistent control sizing and line-height, dialog/popover surfaces, accordion chevron, link underline. Adds tokens: `border.control`, `border.strong`, `background.muted`, `background.selected`, `space.stack.*`, `space.surface`, `radius.surface`, `shadow.*`, `font.line-height.*`. Default control block padding reduced to `space.200`.

### Patch Changes

- Updated dependencies [1b6fbbf]
  - @ktjn/design-tokens@0.1.0
