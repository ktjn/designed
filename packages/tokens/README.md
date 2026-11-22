# @ktjn/designed-tokens

Framework-independent DTCG design tokens compiled to CSS custom properties, JSON, and TypeScript types.

## Install

```sh
pnpm add @ktjn/designed-tokens
```

## Usage

Import the combined theme bundle once at your app entry point:

```ts
import "@ktjn/designed-tokens/css/all.css";
```

Or import individual dimension sheets:

- `@ktjn/designed-tokens/css/base.css`
- `@ktjn/designed-tokens/css/densities/compact.css`
- `@ktjn/designed-tokens/css/schemes/dark.css`
- `@ktjn/designed-tokens/css/contrasts/more.css`
- `@ktjn/designed-tokens/css/brands/default.css`
- `@ktjn/designed-tokens/css/brands/editorial.css`

All rules use ordered cascade sub-layers: `@layer ds.tokens.base, ds.tokens.density, ds.tokens.scheme, ds.tokens.contrast, ds.tokens.brand, ds.components;`.

## Custom Brands

Author custom brand themes inside `@layer ds.tokens.brand` using `[data-brand="<name>"]`:

```css
@layer ds.tokens.brand {
  [data-brand="acme"] {
    --ds-color-action-primary-default: #0f766e;
    --ds-color-action-primary-hover: #115e59;
    --ds-color-action-primary-active: #134e4a;
    --ds-color-border-focus: #14b8a6;
    --ds-radius-control: 0.5rem;
  }
}
```

Nested `[data-brand="default"]` scopes in `brands/default.css` reset brandable tokens (action colors, focus border, selected background, font families, radii, shadows, and motion) without clobbering active density or color-scheme dimensions.
