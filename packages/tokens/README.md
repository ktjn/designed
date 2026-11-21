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
