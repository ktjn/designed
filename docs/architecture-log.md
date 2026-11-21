# Architecture & Implementation Log

Historical milestone notes from the initial build of `@ktjn/designed-tokens`, `@ktjn/designed-react`, and `@ktjn/designed-icons`.

## Milestones

- **Phase 0 (Workspace)**: pnpm workspace, TypeScript, Biome, tsup, Vitest, Changesets (independent versions), Dependabot, and GitHub Actions.
- **Phase 1 (Tokens)**: DTCG primitives + semantic tokens + independent theme dimensions (`brand`, `color-scheme`, `density`, `contrast`) compiled via Style Dictionary behind `packages/tokens/scripts/build-tokens.ts` to CSS, JSON, and TS.
- **Phase 2 (React Foundation)**: React peer dependencies, Base UI as an internal-only dependency, CSS Modules shipped unprocessed, ESM tree-shaking, Vite example app.
- **Phase 3 (Forms & Accessibility)**: Native HTML form semantics, `Field` context wiring (`controlId`, dynamic `aria-describedby`, `invalid`, `disabled`), external form library interop verified with `react-hook-form` (devDependency only), axe + keyboard/focus tests.
- **Phase 4 (Storybook & Visual Contract)**: Storybook with `@storybook/addon-a11y`, `@storybook/addon-vitest` Chromium browser tests, theme toolbar, Chromatic visual regression.
- **Phase 5–6 (Overlays, Selection & Disclosure)**: Base UI-backed overlays and selection controls (`Dialog`, `AlertDialog`, `Drawer`, `Popover`, `Tooltip`, `Menu`, `ContextMenu`, `Select`, `Combobox`, `Autocomplete`, `CommandPalette`, `PreviewCard`, `Tabs`, `Accordion`, `Collapsible`, `Toast`).
- **Phase 7 (Icons)**: `@ktjn/designed-icons` generated from sanitized SVGs (`svgo` + `@svgr/core`) with strict security rejection of `<script>`, inline handlers, `<foreignObject>`, and remote `href`s.
- **Phase 8 (Release Hardening)**: Committed API baselines (`token-api.json`, `api-report.d.ts`), `publint` + `attw`, `size-limit` budgets, packed tarball install checks (`scripts/check-tarballs.ts`), CSS cascade sub-layers, and scoped body-mounted portals.

## Notable Engineering Findings

- **Floating UI under jsdom**: Components using Base UI's `Positioner` (`Popover`, `Tooltip`, `Menu`, `Select`, `Combobox`) hit an infinite microtask loop under jsdom's zero-rect layout. Minimal jsdom tests cover closed state while full open/keyboard/focus/axe behavior is tested in headless Chromium via `@storybook/addon-vitest`.
- **Real-browser contrast & ARIA catches**: Running axe in Chromium caught WCAG AA contrast failures on `blue.500`/`red.500` (shifted to `600`/`800`), missing `role="tooltip"` / `aria-describedby` wiring on Base UI `Tooltip`, missing `aria-label` forwarding on `Select.Trigger`, `Tabs` `[data-active]` vs `[data-selected]`, `Checkbox` indeterminate glyph branching, and `box-sizing: border-box` on full-width inputs.
- **Portal clipping vs. theme scoping**: Portaling overlays inside a themed ancestor breaks under `overflow: hidden`, `transform`, `filter`, or `contain`. Overlays instead portal to a body-level host element stamped with the ancestor's resolved `data-brand`, `data-color-scheme`, `data-density`, and `data-contrast` values.
- **Token sub-layer precedence**: Placing each theme dimension in its own ordered `@layer ds.tokens.*` sub-layer prevents equal-specificity overrides across dimensions (for example `dark` overriding `editorial` focus colors) and lets nested default scopes (`data-color-scheme="light"`, `data-brand="default"`, etc.) cleanly reset parent scopes.
