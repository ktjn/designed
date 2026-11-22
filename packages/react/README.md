# @ktjn/designed-react

Accessible client-side React 19 component library styled with `@ktjn/designed-tokens` and CSS Modules.

## Install

```sh
pnpm add @ktjn/designed-tokens @ktjn/designed-react
```

`@ktjn/designed-react` declares `@base-ui/react` as `^1.9.0` in `dependencies`, so apps that also depend directly on a compatible `@base-ui/react` `1.x` version (`>=1.9.0 <2.0.0`) share a single installation without version skew.

## Usage

```tsx
import "@ktjn/designed-tokens/css/all.css";
import { Button, Stack } from "@ktjn/designed-react";

export function Example() {
  return (
    <Stack direction="horizontal" gap="md">
      <Button variant="primary">Save</Button>
      <Button variant="ghost">Cancel</Button>
    </Stack>
  );
}
```

## CSS Cascade Layers

Component styles are wrapped in `@layer ds.components` (`@layer ds.tokens.base, ds.tokens.density, ds.tokens.scheme, ds.tokens.contrast, ds.tokens.brand, ds.components;`) so unlayered consumer CSS overrides them without `!important`.

With Tailwind CSS, declare the layer order as the first line of your stylesheet:

```css
@layer theme, base, ds, components, utilities;
@import "tailwindcss";
@import "@ktjn/designed-tokens/css/all.css";
```
