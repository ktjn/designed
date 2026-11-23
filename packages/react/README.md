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

## Select and native forms

`Select` uses a Base UI trigger and popup. Pass `name` for form submission and use `onValueChange` to handle updates. Use a native `<select>` when you need an `HTMLSelectElement` ref, the browser's native picker, or native `change` events.

## Clipboard controls

Use `CopyButton size="xs"` or `size="sm"` for dense icon-only actions. Set `label` to identify what the button copies.

`useCopyToClipboard(resetMs)` returns `{ copy, state }` for custom controls. Call `copy(value)` from the activation handler. Its promise returns `{ ok: true, value }` or `{ ok: false, error }`. Feedback returns to `"idle"` after the configured time, which defaults to 2000 ms.

## Component composition

- Use `Card as="section"` or `as="article"` for semantic grouping. Render a kicker before `Card.Title` inside `Card.Header`.
- Pass a sparkline as `Stat` children. Use `tone` for a border accent independent of the delta trend.
- Put row actions in the detail content of `DescriptionList.Item`.
- Pass a label and count as `SegmentedControl.Item` children. Use the item's `className` for a custom accent.
- Use `RelativeTime formatter` for custom labels. It receives elapsed milliseconds, positive for past dates and negative for future dates. Place freshness status beside `RelativeTime` to keep it outside the semantic `<time>` element.
- Use `StatusIndicator icon` to distinguish states that share a color. Include the state name as text.

## Compact tabs

Use `<Tabs.Tab size="small">` for compact tabs. At a 16 px root font size, it uses 11 px text and a 28 px minimum height. Set `data-density="compact"` on an enclosing element to reduce token-based padding. Override `--ds-space-control-block` and `--ds-space-control-inline` via the tab's `className` for local padding changes.

## CSS Cascade Layers

Component styles are wrapped in `@layer ds.components` (`@layer ds.tokens.base, ds.tokens.density, ds.tokens.scheme, ds.tokens.contrast, ds.tokens.brand, ds.components;`) so unlayered consumer CSS overrides them without `!important`.

With Tailwind CSS, declare the layer order as the first line of your stylesheet:

```css
@layer theme, base, ds, components, utilities;
@import "tailwindcss";
@import "@ktjn/designed-tokens/css/all.css";
```
