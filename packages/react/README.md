# @ktjn/design-react

Accessible client-side React 19 component library styled with `@ktjn/design-tokens` and CSS Modules.

## Install

```sh
pnpm add @ktjn/design-tokens @ktjn/design-react
```

## Usage

```tsx
import "@ktjn/design-tokens/css/all.css";
import { Button, Stack } from "@ktjn/design-react";

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
@import "@ktjn/design-tokens/css/all.css";
```
