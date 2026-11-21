# @ktjn/design-tokens

Framework-independent DTCG design tokens compiled to CSS custom properties, JSON, and TypeScript types.

## Install

```sh
pnpm add @ktjn/design-tokens
```

## Usage

Import the combined theme bundle once at your app entry point:

```ts
import "@ktjn/design-tokens/css/all.css";
```

Or import individual layers:

- `@ktjn/design-tokens/css/base.css`
- `@ktjn/design-tokens/css/brands/editorial.css`
- `@ktjn/design-tokens/css/schemes/dark.css`
- `@ktjn/design-tokens/css/densities/compact.css`
- `@ktjn/design-tokens/css/contrasts/more.css`

All rules are wrapped in `@layer ds.tokens` with cascade order `@layer ds.tokens, ds.components;`.
