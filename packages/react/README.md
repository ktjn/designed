# @ktjn/design-react

Accessible client-side React component library styled with `@ktjn/design-tokens` and CSS Modules.

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

Component styles are wrapped in `@layer ds.components` (`@layer ds.tokens, ds.components;`) so unlayered consumer CSS overrides them cleanly without `!important`.
