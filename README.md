# Designed

[![Build and Deploy](https://github.com/ktjn/designed/actions/workflows/build.yml/badge.svg)](https://github.com/ktjn/designed/actions/workflows/build.yml)
[![Storybook](https://img.shields.io/badge/Storybook-Live-ff4785?logo=storybook&logoColor=white)](https://ktjn.github.io/designed/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js >= 26](https://img.shields.io/badge/Node.js-%3E%3D26-339933?logo=node.js&logoColor=white)](.nvmrc)

Framework-independent DTCG design tokens, monochrome SVG icons, and an accessible client-side React 19 component library built on native HTML and Base UI.

**[Explore Live Storybook ->](https://ktjn.github.io/designed/)**

## Packages

| Package                 | Description                                                                              | Docs                                |
| ----------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------- |
| `@ktjn/designed-tokens` | Zero-JS DTCG design tokens compiled to CSS custom properties, JSON, and TypeScript types | [README](packages/tokens/README.md) |
| `@ktjn/designed-react`  | 59 accessible client-side React 19 components styled with CSS Modules and Cascade Layers | [README](packages/react/README.md)  |
| `@ktjn/designed-icons`  | 16 tree-shakeable monochrome SVG icons using `currentColor`                              | [README](packages/icons/README.md)  |

## Requirements & Scope

- **Client-side React 19 only**: targets client-rendered React 19 apps (`react >= 19`). Does not ship `"use client"` directives or React Server Components (RSC) exports.
- **CSS Modules bundler**: ships unprocessed `.module.css` alongside ESM JS; requires a CSS-Modules-aware bundler (Vite, webpack, Rollup, Parcel).
- **Private Base UI internals**: Base UI powers complex interactive behavior internally (`@base-ui/react` `^1.9.0`) and never appears in public types (`packages/react/api-report.d.ts`). Apps using `@base-ui/react` directly on a compatible `1.x` version (`>=1.9.0 <2.0.0`) share a single resolved installation.

## Quick Start

Configure `@ktjn` in `.npmrc` (GitHub token with `read:packages`):

```ini
@ktjn:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Install the packages:

```sh
pnpm add @ktjn/designed-tokens @ktjn/designed-react
pnpm add @ktjn/designed-icons
```

Import tokens once at your entry point and render components:

```tsx
import "@ktjn/designed-tokens/css/all.css";
import { Button, Dialog, Field, Input } from "@ktjn/designed-react";

export function Example() {
  return (
    <Dialog>
      <Dialog.Trigger render={<Button variant="primary">Edit</Button>} />
      <Dialog.Content>
        <Dialog.Title>Profile</Dialog.Title>
        <Field>
          <Field.Label>Name</Field.Label>
          <Input name="name" />
        </Field>
        <Dialog.Close>Done</Dialog.Close>
      </Dialog.Content>
    </Dialog>
  );
}
```

## CSS Cascade Layers & Tailwind Coexistence

Token and component rules declare an explicit sub-layer order under `ds`:

```css
@layer ds.tokens.base,
  ds.tokens.density,
  ds.tokens.scheme,
  ds.tokens.contrast,
  ds.tokens.brand,
  ds.components;
```

- Unlayered consumer CSS overrides `@layer ds.components` without `!important`.
- With **Tailwind CSS**, declare the global layer order on the first line of your main stylesheet so Tailwind `base` (preflight) stays below `ds` while Tailwind `utilities` override `ds.components`:

```css
@layer theme, base, ds, components, utilities;
@import "tailwindcss";
@import "@ktjn/designed-tokens/css/all.css";
```

## Theming

Compose four independent dimensions on `<html>` or any nested container:

```html
<html
  data-brand="default"
  data-color-scheme="dark"
  data-density="compact"
  data-contrast="more"
>
```

- `data-brand`: `"default"` | `"editorial"`
- `data-color-scheme`: `"light"` | `"dark"` (follows `prefers-color-scheme: dark` when unset)
- `data-density`: `"default"` | `"compact"`
- `data-contrast`: `"default"` | `"more"` (follows `prefers-contrast: more` when unset)
- Nested scopes can reset back to any default value (for example `<div data-color-scheme="light">` inside a dark page).
- Overlays portal to `document.body` inside a theme-stamped host to prevent `overflow: hidden` clipping or `transform` stacking bugs.

## Component Catalog

Every public export from `@ktjn/designed-react` links to its live Storybook story (verified by `packages/react/tests/readme-catalog.test.ts`):

- **Layout**: [AspectRatio](https://ktjn.github.io/designed/?path=/story/aspectratio--sixteen-by-nine), [Container](https://ktjn.github.io/designed/?path=/story/container--default), [Grid](https://ktjn.github.io/designed/?path=/story/grid--three-columns), [ScrollArea](https://ktjn.github.io/designed/?path=/story/scrollarea--default), [Separator](https://ktjn.github.io/designed/?path=/story/separator--horizontal), [Sidebar](https://ktjn.github.io/designed/?path=/story/sidebar--default), [Stack](https://ktjn.github.io/designed/?path=/story/stack--vertical)
- **Actions & Forms**: [Autocomplete](https://ktjn.github.io/designed/?path=/story/autocomplete--default), [Button](https://ktjn.github.io/designed/?path=/story/button--primary), [ButtonGroup](https://ktjn.github.io/designed/?path=/story/buttongroup--horizontal), [Calendar](https://ktjn.github.io/designed/?path=/story/calendar--default), [Checkbox](https://ktjn.github.io/designed/?path=/story/checkbox--unchecked), [Combobox](https://ktjn.github.io/designed/?path=/story/combobox--default), [DatePicker](https://ktjn.github.io/designed/?path=/story/datepicker--default), [Field](https://ktjn.github.io/designed/?path=/story/field--default), [Fieldset](https://ktjn.github.io/designed/?path=/story/fieldset--default), [FileUpload](https://ktjn.github.io/designed/?path=/story/fileupload--default), [Input](https://ktjn.github.io/designed/?path=/story/input--default), [InputGroup](https://ktjn.github.io/designed/?path=/story/inputgroup--default), [Link](https://ktjn.github.io/designed/?path=/story/link--default), [NumberField](https://ktjn.github.io/designed/?path=/story/numberfield--default), [OTPField](https://ktjn.github.io/designed/?path=/story/otpfield--default), [RadioGroup](https://ktjn.github.io/designed/?path=/story/radiogroup--default), [Select](https://ktjn.github.io/designed/?path=/story/select--default), [Slider](https://ktjn.github.io/designed/?path=/story/slider--default), [Switch](https://ktjn.github.io/designed/?path=/story/switch--off), [Textarea](https://ktjn.github.io/designed/?path=/story/textarea--default), [Toggle](https://ktjn.github.io/designed/?path=/story/toggle--default), [ToggleGroup](https://ktjn.github.io/designed/?path=/story/togglegroup--single), [Toolbar](https://ktjn.github.io/designed/?path=/story/toolbar--default)
- **Overlays & Disclosure**: [Accordion](https://ktjn.github.io/designed/?path=/story/accordion--default), [AlertDialog](https://ktjn.github.io/designed/?path=/story/alertdialog--default), [Collapsible](https://ktjn.github.io/designed/?path=/story/collapsible--default), [CommandPalette](https://ktjn.github.io/designed/?path=/story/commandpalette--default), [ContextMenu](https://ktjn.github.io/designed/?path=/story/contextmenu--default), [Dialog](https://ktjn.github.io/designed/?path=/story/dialog--default), [Drawer](https://ktjn.github.io/designed/?path=/story/drawer--right), [Menu](https://ktjn.github.io/designed/?path=/story/menu--default), [Popover](https://ktjn.github.io/designed/?path=/story/popover--default), [PreviewCard](https://ktjn.github.io/designed/?path=/story/previewcard--default), [Tabs](https://ktjn.github.io/designed/?path=/story/tabs--default), [Tooltip](https://ktjn.github.io/designed/?path=/story/tooltip--default)
- **Navigation, Feedback & Display**: [Alert](https://ktjn.github.io/designed/?path=/story/alert--info), [Avatar](https://ktjn.github.io/designed/?path=/story/avatar--sizes), [Badge](https://ktjn.github.io/designed/?path=/story/badge--all-variants), [Breadcrumb](https://ktjn.github.io/designed/?path=/story/breadcrumb--default), [Card](https://ktjn.github.io/designed/?path=/story/card--default), [EmptyState](https://ktjn.github.io/designed/?path=/story/emptystate--default), [Kbd](https://ktjn.github.io/designed/?path=/story/kbd--default), [Meter](https://ktjn.github.io/designed/?path=/story/meter--default), [Pagination](https://ktjn.github.io/designed/?path=/story/pagination--default), [Progress](https://ktjn.github.io/designed/?path=/story/progress--determinate), [Skeleton](https://ktjn.github.io/designed/?path=/story/skeleton--card-placeholder), [Spinner](https://ktjn.github.io/designed/?path=/story/spinner--sizes), [Stepper](https://ktjn.github.io/designed/?path=/story/stepper--horizontal), [Table](https://ktjn.github.io/designed/?path=/story/table--default), [Tag](https://ktjn.github.io/designed/?path=/story/tag--variants), [Toast](https://ktjn.github.io/designed/?path=/story/toast--default), [VisuallyHidden](https://ktjn.github.io/designed/?path=/story/visuallyhidden--icon-only-button)

Guides: [Overview](https://ktjn.github.io/designed/?path=/story/overview--getting-started) · [Tokens](https://ktjn.github.io/designed/?path=/story/tokens--specimen) · [Icons](https://ktjn.github.io/designed/?path=/story/icons--gallery) · [Blocks](https://ktjn.github.io/designed/?path=/story/blocks--login-form)

## Local validation before push

Run `pnpm run ci` from the repository root before every push (requires Node.js `>=26` and `pnpm`).

- Checks: locked install, Biome lint/format, package builds, TypeScript typecheck, unit tests, headless Chromium Storybook + axe tests, `publint` + `attw`, `size-limit` budgets, and packed tarball installs (`scripts/check-tarballs.ts`).
- GitHub Actions (`.github/workflows/build.yml`) runs least-privilege, commit-SHA-pinned jobs for workspace builds, GitHub Pages Storybook deploys, Chromatic visual regression, and GitHub Packages releases via Changesets.

## Contributing & Governance

- [Contributing Guide](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Architecture Log](docs/architecture-log.md)
- [MIT License](LICENSE)
