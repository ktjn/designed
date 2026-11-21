# Design System

Framework-independent design tokens (`@ktjn/design-tokens`), monochrome SVG icons (`@ktjn/design-icons`), and a client-side React 19 component library (`@ktjn/design-react`) built on native HTML and Base UI.

## Scope

- **Client-side React 19 only**: `@ktjn/design-react` targets client-rendered React 19 applications (`react >= 19`). It does not ship `"use client"` directives or React Server Components (RSC) exports.
- **CSS-Modules-aware bundler required**: `@ktjn/design-react` ships `.module.css` files alongside compiled ESM JS so your application bundler (Vite, webpack, Rollup, Parcel, etc.) resolves and bundles styles.
- **Independent packages**:
  - `@ktjn/design-tokens`: zero-JS CSS custom properties, JSON, and TypeScript token types.
  - `@ktjn/design-react`: 59 accessible React components consuming semantic tokens; Base UI is an internal implementation detail never exposed in public types.
  - `@ktjn/design-icons`: 16 tree-shakable monochrome SVG icon components using `currentColor`.

## Local validation before push

Run `pnpm run ci` from the repository root before every push. Push only after it passes for the changes being pushed.

- Requires Node.js `>=26` (`.nvmrc`) and the `pnpm` version pinned in `package.json`.
- On Linux, if Chromium reports missing system libraries, run `pnpm --filter @ktjn/storybook exec playwright install-deps chromium`.
- `pnpm run ci` installs locked dependencies, lints with Biome, builds all packages, type-checks, runs unit and Chromium Storybook/axe tests, and validates packages (`publint` + `attw`), bundle-size budgets (`size-limit`), and packed tarball installs (`scripts/check-tarballs.ts`).
- GitHub Actions (`.github/workflows/build.yml`) runs least-privilege, commit-SHA-pinned jobs for workspace builds, GitHub Pages Storybook deployment, Chromatic visual regression, and GitHub Packages releases via Changesets.

## Installing from GitHub Packages

Configure `@ktjn` in your consumer `.npmrc` with a GitHub token that has `read:packages`:

```ini
@ktjn:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Install the packages you need:

```sh
pnpm add @ktjn/design-tokens @ktjn/design-react
pnpm add @ktjn/design-icons
```

Import `@ktjn/design-tokens/css/all.css` once at your app entry point (or import `@ktjn/design-tokens/css/base.css` plus individual dimension sheets).

## CSS Cascade Layers & Tailwind Coexistence

All token and component styles declare an explicit sub-layer order under the parent `ds` layer:

```css
@layer ds.tokens.base,
  ds.tokens.density,
  ds.tokens.scheme,
  ds.tokens.contrast,
  ds.tokens.brand,
  ds.components;
```

- Unlayered consumer CSS overrides `@layer ds.components` without `!important`.
- **Using Tailwind CSS (v4 or layered CSS)**: declare the global layer order as the **first line** of your main stylesheet so Tailwind's `base` (preflight) does not reset design-system controls while Tailwind's `utilities` (`px-8`, `w-full`, etc.) override `ds.components`:

```css
@layer theme, base, ds, components, utilities;
@import "tailwindcss";
@import "@ktjn/design-tokens/css/all.css";
```

## Themes

Themes compose four independent dimensions via `data-*` attributes on `<html>` or any nested container:

```html
<html
  data-brand="default"
  data-color-scheme="dark"
  data-density="compact"
  data-contrast="more"
>
```

- Supported values:
  - `data-brand`: `"default"` | `"editorial"`
  - `data-color-scheme`: `"light"` | `"dark"` (also respects `prefers-color-scheme: dark` when unset)
  - `data-density`: `"default"` | `"compact"`
  - `data-contrast`: `"default"` | `"more"` (also respects `prefers-contrast: more` when unset)
- Nested scopes can switch back to any default value (for example `<div data-color-scheme="light">` inside a dark page).
- Overlays portal to `document.body` while stamping the resolved theme attributes from their anchor subtree, preventing `overflow: hidden` clipping or `transform` stacking issues.

## Component API Conventions

- **Native HTML first**: standard elements (`button`, `a`, `input`, `textarea`, `table`) are used directly where native semantics suffice; Base UI backs complex interactive controls (`Dialog`, `Select`, `Combobox`, `Menu`, `Tabs`, `Accordion`, `OTPField`, etc.) without leaking Base UI types.
- **React 19 `ref`-as-prop**: components accept `ref` directly alongside normal DOM escape hatches (`className`, `style`, `data-*`, `aria-*`).
- **Custom trigger composition**: overlay triggers and close controls (`Dialog`, `AlertDialog`, `Drawer`, `Menu`, `Popover`) support `render?: ReactElement` (for example `<Dialog.Trigger render={<Button variant="primary">Delete</Button>} />`) to avoid nested `<button>` elements.
- **Forms**: form controls obey native HTML form contracts and compose with `<Field>` (`Field.Label`, `Field.Description`, `Field.Error`) without requiring any form library.
- **Localization**: date/calendar, upload, and OTP controls accept locale/label props (`locale`, `weekStartsOn`, `getRemoveLabel`, `getSlotDescription`, `previousMonthLabel`, `nextMonthLabel`).

## Component catalog

Every public component exported from `@ktjn/design-react` links to its live Storybook page (verified by `packages/react/tests/readme-catalog.test.ts`):

- **Layout**: [AspectRatio](https://ktjn.github.io/design/?path=/story/aspectratio--sixteen-by-nine), [Container](https://ktjn.github.io/design/?path=/story/container--default), [Grid](https://ktjn.github.io/design/?path=/story/grid--three-columns), [ScrollArea](https://ktjn.github.io/design/?path=/story/scrollarea--default), [Separator](https://ktjn.github.io/design/?path=/story/separator--horizontal), [Sidebar](https://ktjn.github.io/design/?path=/story/sidebar--default), [Stack](https://ktjn.github.io/design/?path=/story/stack--vertical)
- **Actions & Forms**: [Autocomplete](https://ktjn.github.io/design/?path=/story/autocomplete--default), [Button](https://ktjn.github.io/design/?path=/story/button--primary), [ButtonGroup](https://ktjn.github.io/design/?path=/story/buttongroup--horizontal), [Calendar](https://ktjn.github.io/design/?path=/story/calendar--default), [Checkbox](https://ktjn.github.io/design/?path=/story/checkbox--unchecked), [Combobox](https://ktjn.github.io/design/?path=/story/combobox--default), [DatePicker](https://ktjn.github.io/design/?path=/story/datepicker--default), [Field](https://ktjn.github.io/design/?path=/story/field--default), [Fieldset](https://ktjn.github.io/design/?path=/story/fieldset--default), [FileUpload](https://ktjn.github.io/design/?path=/story/fileupload--default), [Input](https://ktjn.github.io/design/?path=/story/input--default), [InputGroup](https://ktjn.github.io/design/?path=/story/inputgroup--default), [Link](https://ktjn.github.io/design/?path=/story/link--default), [NumberField](https://ktjn.github.io/design/?path=/story/numberfield--default), [OTPField](https://ktjn.github.io/design/?path=/story/otpfield--default), [RadioGroup](https://ktjn.github.io/design/?path=/story/radiogroup--default), [Select](https://ktjn.github.io/design/?path=/story/select--default), [Slider](https://ktjn.github.io/design/?path=/story/slider--default), [Switch](https://ktjn.github.io/design/?path=/story/switch--off), [Textarea](https://ktjn.github.io/design/?path=/story/textarea--default), [Toggle](https://ktjn.github.io/design/?path=/story/toggle--default), [ToggleGroup](https://ktjn.github.io/design/?path=/story/togglegroup--single), [Toolbar](https://ktjn.github.io/design/?path=/story/toolbar--default)
- **Overlays & Disclosure**: [Accordion](https://ktjn.github.io/design/?path=/story/accordion--default), [AlertDialog](https://ktjn.github.io/design/?path=/story/alertdialog--default), [Collapsible](https://ktjn.github.io/design/?path=/story/collapsible--default), [CommandPalette](https://ktjn.github.io/design/?path=/story/commandpalette--default), [ContextMenu](https://ktjn.github.io/design/?path=/story/contextmenu--default), [Dialog](https://ktjn.github.io/design/?path=/story/dialog--default), [Drawer](https://ktjn.github.io/design/?path=/story/drawer--right), [Menu](https://ktjn.github.io/design/?path=/story/menu--default), [Popover](https://ktjn.github.io/design/?path=/story/popover--default), [PreviewCard](https://ktjn.github.io/design/?path=/story/previewcard--default), [Tabs](https://ktjn.github.io/design/?path=/story/tabs--default), [Tooltip](https://ktjn.github.io/design/?path=/story/tooltip--default)
- **Navigation, Feedback & Display**: [Alert](https://ktjn.github.io/design/?path=/story/alert--info), [Avatar](https://ktjn.github.io/design/?path=/story/avatar--sizes), [Badge](https://ktjn.github.io/design/?path=/story/badge--all-variants), [Breadcrumb](https://ktjn.github.io/design/?path=/story/breadcrumb--default), [Card](https://ktjn.github.io/design/?path=/story/card--default), [EmptyState](https://ktjn.github.io/design/?path=/story/emptystate--default), [Kbd](https://ktjn.github.io/design/?path=/story/kbd--default), [Meter](https://ktjn.github.io/design/?path=/story/meter--default), [Pagination](https://ktjn.github.io/design/?path=/story/pagination--default), [Progress](https://ktjn.github.io/design/?path=/story/progress--determinate), [Skeleton](https://ktjn.github.io/design/?path=/story/skeleton--card-placeholder), [Spinner](https://ktjn.github.io/design/?path=/story/spinner--sizes), [Stepper](https://ktjn.github.io/design/?path=/story/stepper--horizontal), [Table](https://ktjn.github.io/design/?path=/story/table--default), [Tag](https://ktjn.github.io/design/?path=/story/tag--variants), [Toast](https://ktjn.github.io/design/?path=/story/toast--default), [VisuallyHidden](https://ktjn.github.io/design/?path=/story/visuallyhidden--icon-only-button)

Additional Storybook guides: [Overview](https://ktjn.github.io/design/?path=/story/overview--getting-started), [Tokens](https://ktjn.github.io/design/?path=/story/tokens--specimen), [Icons](https://ktjn.github.io/design/?path=/story/icons--gallery), [Blocks](https://ktjn.github.io/design/?path=/story/blocks--login-form).

## Versioning, API Baselines & Security

- **Independent SemVer**: packages version independently via Changesets (`@ktjn/design-tokens`, `@ktjn/design-react`, `@ktjn/design-icons`). Prereleases (`0.x.y`) may change before `1.0.0`.
- **Deprecation policy**: deprecate in a minor release with `@deprecated` JSDoc and changelog notes; remove only in a subsequent major release.
- **API baselines**: `packages/tokens/token-api.json` and `packages/react/api-report.d.ts` are snapshot-tested during `pnpm run ci` to prevent accidental breaking changes or Base UI type leaks.
- **Security**: SVG sources are sanitized and rejected on scripts/event handlers/foreign objects/remote refs; GitHub Actions jobs use least-privilege permissions and commit-SHA-pinned actions; packages publish to GitHub Packages (`https://npm.pkg.github.com`).

## Repository layout

```text
.
├── .changeset/
├── .github/workflows/build.yml
├── apps/storybook/
├── docs/architecture-log.md
├── examples/react/
├── packages/
│   ├── tokens/
│   ├── react/
│   └── icons/
└── scripts/check-tarballs.ts
```

For milestone history and notable engineering findings, see [docs/architecture-log.md](docs/architecture-log.md).
