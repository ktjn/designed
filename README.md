# Design System

A small, framework-aware design system with framework-independent design tokens and a React component library built on Base UI.

## Local validation before push

Run `pnpm run ci` from the repository root before every push. Push only after it passes for the changes being pushed. This is a documented requirement.

- Use Node.js 26 or later and the pnpm version pinned in `package.json`.
- On Linux, if Chromium reports missing system libraries, run `pnpm --filter @ktjn/storybook exec playwright install-deps chromium` after installing workspace dependencies, then rerun local CI.
- Local CI installs locked dependencies, lints, builds the packages needed by the checks, type-checks, runs unit and browser tests, and validates packages, bundle sizes, and tarball installs.
- GitHub Actions runs the full workspace build, GitHub Packages release publishing, Storybook deployment, and Chromatic visual regression.

## Installing from GitHub Packages

Configure `@ktjn` in your consumer `.npmrc` with a GitHub token that has `read:packages`:

```ini
@ktjn:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Then install the packages you need:

```sh
pnpm add @ktjn/design-tokens @ktjn/design-react
pnpm add @ktjn/design-icons
```

Import `@ktjn/design-tokens/css/all.css` once at your app entry point (or import `@ktjn/design-tokens/css/base.css` plus only the theme override sheets you need).

## Goals

- Publish design tokens independently from components.
- Support multiple brands, color schemes, density modes, and accessibility modes without coupling themes to React.
- Provide a stable React component API while treating Base UI as an implementation detail.
- Prefer native HTML where it already provides correct semantics and behavior.
- Make accessibility, compatibility, and visual consistency testable contracts.
- Keep the architecture small enough to understand and replace individual tools later.

## Non-goals

- A general-purpose CSS framework.
- A Tailwind-like styling API.
- A proprietary layout or styling DSL.
- Exposing Base UI directly to consumers.
- Supporting every frontend framework in the first release.
- Building a data grid, rich text editor, or other application-scale widget before demonstrated demand.
- Encoding product-specific business components in the core design system.

## Architecture

```text
                         DTCG token sources
                                |
                         token compiler
                                |
              +-----------------+-----------------+
              |                 |                 |
             CSS               JSON              TS
              |
       @ktjn/design-tokens
              |
              +-----------------------------+
                                            |
                                     @ktjn/design-react
                                            |
                              +-------------+-------------+
                              |                           |
                         native HTML                   Base UI
                              |                           |
                              +-------------+-------------+
                                            |
                                           DOM

@ktjn/design-icons -----------------------> @ktjn/design-react
@ktjn/design-react --------------------------------> Storybook
```

The system consists of two independently releasable products:

1. `@ktjn/design-tokens`: framework-independent design values and themes.
2. `@ktjn/design-react`: React components consuming the token contract.

Icons are a separate package because they can be consumed independently and have different change characteristics.

## Repository strategy

The token package must be independently releasable. Initially keep all packages in this repository to reduce operational overhead while preserving package boundaries:

```text
packages/
  tokens/
  react/
  icons/
apps/
  storybook/
examples/
  react/
```

Independent package versioning is mandatory. Repository separation is not required for independent releases and can be introduced later if ownership or release cadence requires it.

Use a pnpm workspace and Changesets.

## Technology choices

| Area                  | Choice                                                      |
| --------------------- | ----------------------------------------------------------- |
| Token format          | DTCG Design Tokens format                                   |
| Token compiler        | Style Dictionary behind a local build script                |
| Theme mechanism       | CSS custom properties                                       |
| Components            | React + TypeScript                                          |
| Behavioral primitives | Base UI                                                     |
| Styling               | CSS Modules                                                 |
| Icons                 | SVG source (svgo) + generated React components (@svgr/core) |
| Documentation         | Storybook                                                   |
| Unit tests            | Vitest                                                      |
| Browser tests         | Playwright / Storybook browser tests                        |
| Accessibility         | axe + explicit keyboard/focus tests                         |
| Visual regression     | Chromatic initially                                         |
| Package manager       | pnpm                                                        |
| Package build         | tsup                                                        |
| Package validation    | publint + arethetypeswrong                                  |
| Bundle-size budgets   | size-limit                                                  |
| Lint/format           | Biome                                                       |
| Releases              | Changesets                                                  |
| Validation            | Local CI before push                                        |
| Builds and deployment | GitHub Actions                                              |

Tools are replaceable implementation details. Package contracts and token semantics are not.

# Design tokens

## Source format

Use the DTCG token format as the source of truth. Do not create a custom token schema.

Token source files contain typed values and aliases. Generated CSS, JSON, and TypeScript files are build artifacts and must not become authoritative sources.

## Token layers

Use three layers initially:

```text
primitive -> semantic -> theme override
```

A fourth component-token layer may be introduced only when there is a demonstrated need to theme individual components independently of the semantic layer.

### Primitive tokens

Primitive tokens describe raw scales and values.

Examples:

```text
color.blue.500
color.neutral.900
space.100
space.200
font.size.100
radius.100
motion.duration.fast
```

Components should normally not consume primitive tokens directly.

### Semantic tokens

Semantic tokens describe intent.

Examples:

```text
color.background.default
color.background.subtle
color.foreground.default
color.foreground.muted
color.foreground.inverse
color.border.default
color.border.focus
color.action.primary.default
color.action.primary.hover
color.action.primary.active
color.action.danger.default
space.control.inline
space.control.block
radius.control
```

React components consume semantic tokens.

### Theme overrides

Themes change semantic mappings rather than introduce theme-specific token names.

Do not create tokens such as:

```text
color.dark.background
color.light.background
```

Instead keep a stable token such as:

```text
color.background.default
```

and provide different resolved values for light and dark schemes.

## Naming convention

Use:

```text
<category>.<role>.<variant>.<state>
```

Not every token needs every segment.

Examples:

```text
color.background.default
color.foreground.muted
color.action.primary.default
color.action.primary.hover
color.action.primary.disabled
```

Generated CSS names use the `--ds-` prefix:

```css
--ds-color-background-default
--ds-color-foreground-muted
--ds-color-action-primary-hover
```

Names describe purpose, never appearance.

Avoid names such as:

```text
blueButton
grayText
largeSpacing
```

## Theme dimensions

Themes are composed from independent dimensions:

```text
brand
color-scheme
density
contrast
```

Example configuration:

```text
base
+ brand/default
+ scheme/dark
+ density/compact
+ contrast/default
```

Do not create a combinatorial set of monolithic theme files such as `brand-a-dark-compact-high-contrast`.

Runtime selection uses attributes:

```html
<html
  data-brand="default"
  data-color-scheme="dark"
  data-density="compact"
  data-contrast="default"
>
```

Generated CSS can therefore compose dimensions independently:

```css
:root {
  --ds-space-control-block: 0.75rem;
}

[data-color-scheme="dark"] {
  --ds-color-background-default: #101010;
}

[data-density="compact"] {
  --ds-space-control-block: 0.5rem;
}
```

Where appropriate, support platform preferences such as:

```css
@media (prefers-color-scheme: dark)
@media (prefers-reduced-motion: reduce)
@media (prefers-contrast: more)
```

Explicit application configuration must be able to override platform preference.

## Token outputs

`@ktjn/design-tokens` should expose:

```text
dist/
  css/
    base.css
    schemes/
    brands/
    densities/
    contrasts/
  json/
    tokens.json
  types/
    tokens.d.ts
```

The package has no runtime dependency on React or the component library.

The package should have zero runtime JavaScript where practical.

## Token compiler boundary

Use Style Dictionary initially, but place it behind a local script:

```text
DTCG files -> scripts/build-tokens.ts -> Style Dictionary -> dist
```

Do not encode domain semantics in Style Dictionary configuration. The DTCG files remain portable and authoritative.

## Token compatibility

Token names and generated CSS variable names form a public API.

### Major change

- Remove or rename a token.
- Change the semantic meaning of a token.
- Remove a supported theme dimension or generated format.
- Rename a generated CSS variable.

### Minor change

- Add a token.
- Add a theme or theme dimension value.
- Add a generated output format.

### Patch change

- Adjust values without changing semantic meaning.
- Fix generated artifacts.
- Make accessibility corrections to existing values.

Large visual changes should be called out in release notes even when they are semantically patch-compatible.

# React component library

## Base UI boundary

Base UI is the behavioral foundation for complex interactive controls.

```text
application -> @ktjn/design-react -> Base UI -> DOM
```

Rules:

- Never re-export Base UI components.
- Never expose Base UI types from the public API.
- Never require consumers to understand Base UI composition.
- Wrap Base UI behind design-system-owned component contracts.
- Avoid a generic adapter abstraction between the design system and Base UI.

If Base UI is replaced later, update affected component implementations rather than maintaining a universal primitive abstraction.

## Native HTML first

Use native elements when native behavior is sufficient.

Typical examples:

```text
Button -> button
Link -> a
Input -> input
Textarea -> textarea
Heading -> h1-h6
```

Use Base UI for behavior-heavy controls such as:

```text
Dialog
AlertDialog
Popover
Tooltip
Menu
Select
Combobox
Tabs
Accordion
Checkbox
RadioGroup
Switch
Slider
Toast
```

Whether a component uses Base UI internally is not part of its public contract.

## Styling

Use CSS Modules for component styling and generated CSS custom properties for design values.

`@ktjn/design-react` ships `.module.css` files unprocessed alongside compiled JS; the consuming application's bundler resolves CSS Modules imports. This requires consumers to use a CSS-Modules-aware bundler (Vite, webpack, Next.js, and Remix all qualify); document this as a consumer requirement.

Example:

```css
.root {
  color: var(--ds-color-action-primary-foreground);
  background: var(--ds-color-action-primary-default);
  border-radius: var(--ds-radius-control);
  padding-block: var(--ds-space-control-block);
  padding-inline: var(--ds-space-control-inline);
}
```

Rules:

- No hard-coded brand colors in components.
- No theme names in component implementations.
- No CSS-in-JS runtime requirement.
- No proprietary token lookup runtime.
- No styling-prop DSL.

## Component API conventions

### Public APIs express intent

Good:

```tsx
<Button variant="primary" size="medium">
  Save
</Button>;
```

Avoid:

```tsx
<Button background="blue500" padding="space4" radius="radius2" />;
```

### Controlled and uncontrolled state

Support both where meaningful:

```tsx
<Dialog open={open} onOpenChange={setOpen} />
<Dialog defaultOpen />
```

### Event naming

Use consistent domain events:

```text
onOpenChange
onValueChange
onCheckedChange
```

Do not mix equivalent names such as `onChanged`, `handleSelect`, and `onSelectionChanged` across components.

### Variant naming

Use small closed unions:

```ts
type ButtonVariant = "primary" | "secondary" | "danger";
```

Variants represent supported design-system intent, not arbitrary CSS values.

### DOM escape hatches

Visual components should normally support:

```text
className
style
ref
data-*
aria-*
relevant native DOM props
```

Do not create a second styling language for escape hatches.

### Composition

Use simple components for simple concepts:

```tsx
<Button>Save</Button>;
```

Use compound components when composition is intrinsic to the concept:

```tsx
<Dialog>
  <Dialog.Trigger>Delete</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Delete item?</Dialog.Title>
    <Dialog.Description>This cannot be undone.</Dialog.Description>
    <Dialog.Close>Cancel</Dialog.Close>
  </Dialog.Content>
</Dialog>;
```

The design-system API may map to Base UI internally but must remain independent of Base UI's public API.

# Forms

The component library must not depend on React Hook Form, Formik, TanStack Form, or another form-state library.

Use standard HTML form contracts.

Provide composable field primitives:

```text
Field
Field.Label
Field.Description
Field.Error
Input
Textarea
Checkbox
RadioGroup
Select
Combobox
```

Example:

```tsx
<Field invalid={Boolean(error)}>
  <Field.Label>Email</Field.Label>
  <Input name="email" required />
  <Field.Description>Used for account notifications.</Field.Description>
  <Field.Error>{error}</Field.Error>
</Field>;
```

Consumers must be able to use native forms, server actions, React Hook Form, TanStack Form, or custom state without design-system adapters.

# Icons

Publish icons separately as `@ktjn/design-icons`.

Source files are SVG:

```text
packages/icons/src/svg/
  add.svg
  close.svg
  search.svg
```

Generate typed React wrappers:

```tsx
import { SearchIcon } from "@ktjn/design-icons";
```

Rules:

- Use `currentColor` for themeable monochrome icons.
- Do not encode design-system colors into icon assets.
- Preserve SVG source as the authoritative asset.
- Tree shaking must work at icon level.
- Decorative icons should support `aria-hidden` cleanly.
- Accessibility meaning belongs to the consuming control, not the icon package.

Example:

```tsx
<Button aria-label="Close">
  <CloseIcon aria-hidden />
</Button>;
```

# Accessibility

WCAG 2.2 AA is the baseline contract.

Base UI reduces implementation risk but does not make composed components automatically accessible.

Test at least:

```text
semantic HTML
accessible names and descriptions
ARIA state
keyboard operation
focus order
focus visibility
focus restoration
dialog focus containment where required
zoom and reflow
color contrast
forced colors
reduced motion
touch target behavior
```

Automated checks include:

- axe
- keyboard interaction tests
- browser interaction tests
- visual regression

Automated accessibility testing is necessary but insufficient. Maintain manual acceptance guidance for screen-reader and platform behavior for complex components.

# Documentation

Use Storybook as executable documentation and as a test fixture surface.

Every production component should document:

```text
purpose
usage
variants
states
composition
accessibility
keyboard behavior
API
examples
do / don't guidance where useful
```

Stories should represent relevant state space, not only a default example.

Example Button stories:

```text
Primary
Secondary
Danger
Disabled
Loading
WithIcon
LongText
```

Documentation consumes published/public component APIs. It must not become an alternative source of truth.

# Testing strategy

## Tokens

Test:

- DTCG schema validity.
- References resolve.
- No alias cycles.
- Naming conventions.
- Known token types.
- Theme composition resolves completely.
- Generated output is deterministic.
- Required contrast relationships satisfy policy.
- Public token surface changes are detected.

Generate a machine-readable public surface such as `token-api.json` during CI and compare it with the previous release.

## Components

Test:

- rendering
- public props
- controlled/uncontrolled behavior
- keyboard interaction
- focus behavior
- ARIA state
- form integration
- SSR where supported
- hydration
- visual states
- theme independence

Use Vitest for unit tests and Playwright/Storybook browser testing for behavior requiring a browser.

## Visual regression

Use Storybook stories as visual fixtures and Chromatic initially for regression review.

The visual regression provider is replaceable. Do not make Chromatic-specific concepts part of component or token APIs.

# Packaging

Initial packages:

```text
@ktjn/design-tokens
@ktjn/design-react
@ktjn/design-icons
```

Do not prematurely create packages such as:

```text
core
utils
hooks
primitives
foundation
system
shared
```

Internal source folders are sufficient until a boundary needs independent consumption or release.

## React package dependencies

`react` and `react-dom` are peer dependencies.

`@ktjn/design-tokens` should normally be a peer dependency of the React package so that applications control the token/theme version.

`@ktjn/design-icons` is a regular dependency of `@ktjn/design-react` for components that render icons internally (for example a Dialog close button). Applications are not required to depend on `@ktjn/design-icons` directly to use those components.

Base UI is an implementation dependency of `@ktjn/design-react` and must not appear in application-facing APIs.

# Versioning and release

Use independent SemVer for all packages.

Example:

```text
@ktjn/design-tokens 2.4.0
@ktjn/design-react 5.7.1
@ktjn/design-icons 1.3.0
```

Do not synchronize versions across packages.

Use Changesets to record user-visible package changes and generate release PRs.

CI should detect accidental public API changes before publication.

For React, consider API surface changes to include:

- exported components
- exported types
- props
- documented behavior
- documented DOM assumptions

For tokens, the API includes:

- token identifiers
- generated CSS variable names
- package exports
- theme dimension identifiers

CI enforces this rather than relying on review discipline alone: `@ktjn/design-tokens` snapshot-tests its generated `dist/json/tokens.json` against a committed `token-api.json` baseline (`packages/tokens/tests/build.test.ts`), and `@ktjn/design-react` snapshot-tests a concatenation of every generated `.d.ts` file against a committed `api-report.d.ts` baseline (`packages/react/tests/api-surface.test.ts`). Either test failing means the public surface changed; updating the baseline is a deliberate, visible diff in the PR, not an accident.

## SemVer policy

Given a package version `MAJOR.MINOR.PATCH`:

- **MAJOR**: any change in the "Major change" / breaking-change lists in the Token compatibility and Versioning sections above — removed or renamed tokens/exports/props, changed semantic meaning, removed theme dimensions or generated formats, renamed CSS variables, removed component behavior a consumer could reasonably depend on.
- **MINOR**: additive, backward-compatible changes — new tokens, new theme/dimension values, new generated output formats, new components, new optional props, new exported types.
- **PATCH**: value-only token adjustments that don't change semantic meaning, generated-artifact fixes, accessibility corrections, bug fixes that don't change the documented contract.

Packages version independently (see above); a breaking change in `@ktjn/design-react` does not require bumping `@ktjn/design-tokens` or `@ktjn/design-icons`, and vice versa.

Prereleases (`0.x.y` or `x.y.z-alpha.n` and similar) may break the above rules between prerelease versions — the guarantee starts at `1.0.0`.

## Deprecation policy

- Mark a token, component, prop, or export as deprecated in a **minor** release: keep it fully functional, add a `@deprecated` JSDoc tag (for code) pointing at the replacement, and note it in that release's changeset/changelog entry.
- Deprecated APIs must remain functionally unchanged (no silent behavior drift) until removal.
- Remove a deprecated API only in a **major** release, and only after it has shipped as deprecated for at least one prior minor release — never deprecate and remove in the same release.
- Removal must be listed explicitly in that major version's changelog under a "Breaking changes" heading, not buried in a general changes list.

# Security

The design system should minimize runtime code and dependency surface.

Rules:

- Do not execute arbitrary token values as code.
- Treat SVG source as code during review; reject scripts, event handlers, remote resources, and unsafe embedded content.
- Pin CI actions by trusted major/version policy.
- Publish from protected CI using npm trusted publishing/OIDC where available rather than long-lived publish tokens.
- Generate provenance/attestations where supported.
- Do not expose internal implementation dependencies as public package contracts.

# Proposed repository layout

```text
.
├── .changeset/
├── .github/
│   └── workflows/
├── apps/
│   └── storybook/
├── examples/
│   └── react/
├── packages/
│   ├── tokens/
│   │   ├── src/
│   │   │   ├── primitives/
│   │   │   ├── semantic/
│   │   │   └── themes/
│   │   ├── scripts/
│   │   ├── tests/
│   │   └── package.json
│   ├── react/
│   │   ├── src/
│   │   │   ├── button/
│   │   │   ├── field/
│   │   │   ├── input/
│   │   │   └── ...
│   │   ├── tests/
│   │   └── package.json
│   └── icons/
│       ├── src/
│       │   ├── svg/
│       │   └── generated/
│       └── package.json
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

# Implementation plan

Implement vertically. Each phase should leave the repository buildable and usable rather than scaffolding the entire final structure up front.

## Phase 0 - workspace

- [x] Initialize pnpm workspace.
- [x] Pin a Node.js engine floor (Node 24 LTS) via `engines` and `packageManager`/Corepack.
- [x] Add TypeScript configuration.
- [x] Add Biome for formatting/linting with the smallest viable configuration.
- [x] Add tsup as the package build tool for ESM/CJS/`.d.ts` output (applied per-package starting Phase 2).
- [x] Add Vitest.
- [x] Add Changesets with independent package versions.
- [x] Add GitHub Actions for install, typecheck, test, and build.
- [x] Add release workflow using trusted publishing where supported.
- [x] Add Dependabot for dependency update automation.

Exit criteria:

```text
pnpm install
pnpm build
pnpm test
```

work from a clean checkout. Build before typecheck/test: once packages import each other at the source level (for example `@ktjn/design-react` importing `@ktjn/design-icons`, or `apps/storybook`/`examples/react` importing `@ktjn/design-react`), both `tsc` and Vitest resolve the dependency through its package exports map, which points at `dist`. `pnpm -r` runs in topological order, so `pnpm build` before `pnpm typecheck`/`pnpm test` is required, not just conventional.

## Phase 1 - token foundation

- [x] Create `packages/tokens`.
- [x] Define initial DTCG primitive tokens for color, spacing, typography, radius, border, elevation, and motion.
- [x] Define the initial semantic token vocabulary.
- [x] Add default brand.
- [x] Add light and dark schemes.
- [x] Add default and compact density.
- [x] Add default and more contrast values.
- [x] Add Style Dictionary behind `scripts/build-tokens.ts`.
- [x] Generate CSS, JSON, and TypeScript outputs.
- [x] Add deterministic generation tests.
- [x] Add unresolved-reference and cycle validation.
- [x] Add token naming validation.
- [x] Add public token API snapshot generation.
- [ ] Publish first `@ktjn/design-tokens` prerelease. (requires npm registry access/authorization — not done)

Keep the initial token vocabulary intentionally small. Add tokens because components require semantics, not because a comprehensive taxonomy can be imagined.

Exit criteria:

A plain HTML page can consume the package, switch light/dark, density, and contrast attributes, and render without React.

## Phase 2 - React foundation

- [x] Create `packages/react`.
- [x] Add React and React DOM as peer dependencies.
- [x] Add Base UI as an internal dependency.
- [x] Add CSS Modules build support: ship `.module.css` unprocessed via tsup, consumer bundler resolves them.
- [x] Define shared public API conventions.
- [x] Verify ESM package exports and tree shaking.
- [x] Verify the example app's bundler (Vite) resolves shipped `.module.css` imports correctly.
- [x] Add SSR/hydration smoke test.
- [x] Add an example React application consuming only public package exports.

Implement the first native components:

- [x] Button.
- [x] Link.
- [ ] Heading/Text only if a typography abstraction proves useful. (not built — no demonstrated use case yet, per rule 12)
- [x] Input.
- [x] Textarea.

Do not add generic `Box`, `Stack`, or polymorphic styling primitives initially.

Exit criteria:

The example app consumes the published token contract and React components without imports from internal source paths or Base UI.

## Phase 3 - forms and accessibility contract

- [x] Implement Field composition.
- [x] Implement Checkbox.
- [x] Implement RadioGroup.
- [x] Implement Switch.
- [x] Define validation-state conventions. (`invalid` prop on Field/Input/Textarea; `aria-invalid`/`aria-describedby` wired automatically via Field context)
- [x] Verify native form submission.
- [x] Verify integration with a representative external form library without adding it as a production dependency. (react-hook-form, devDependency only)
- [x] Add axe checks.
- [x] Add keyboard and focus tests.
- [ ] Add forced-colors test cases where practical. (deferred: needs real browser rendering; jsdom cannot evaluate `forced-colors` media query — revisit once Playwright/Storybook browser testing lands in Phase 4)
- [ ] Document accessibility expectations. (deferred: full per-component documentation belongs in Storybook, Phase 4; current contract is enforced by axe + keyboard/focus tests)

Exit criteria:

Form components work with native form submission and at least one external form-state library without adapters in `@ktjn/design-react`.

## Phase 4 - Storybook and visual contract

- [x] Create Storybook application.
- [x] Document current components. (Button, Link, Input, Textarea, Field, Checkbox, RadioGroup, Switch)
- [x] Cover major visual and interaction states with stories.
- [x] Run accessibility checks against stories. (`@storybook/addon-a11y`, `parameters.a11y.test: "error"`; run in local CI with Chromium)
- [x] Add interaction tests for complex states. (Story `play` functions run in local CI via `@storybook/addon-vitest`)
- [x] Add Chromatic visual regression. (wired in CI; publish step needs a `CHROMATIC_PROJECT_TOKEN` secret to actually run — skips cleanly without one)
- [x] Test stories across light/dark and default/compact themes. (toolbar globals in `.storybook/preview.tsx` switch `data-color-scheme`/`data-density`/`data-contrast`)

Exit criteria:

Every public component built so far has executable documentation and baseline visual/accessibility coverage. Components added in later phases must gain equivalent coverage before their own phase is considered complete.

## Phase 5 - overlays

`@ktjn/design-icons` (Phase 7) was pulled forward and already exists; use its `CloseIcon`/`ChevronDownIcon` for Dialog/Menu rather than inline SVG.

Implement Base UI-backed overlay primitives:

- [x] Dialog.
- [x] AlertDialog.
- [x] Popover.
- [x] Tooltip. (implemented; hover-open interaction verified in a real browser — see notes below)
- [x] Menu.

For each component:

- [x] Define the design-system public API before implementation. (`Dialog.Trigger/Content/Title/Description/Close` etc., matching the Composition example — no Base UI names leak through. Tooltip's API departs from the compound-component shape deliberately: `<Tooltip content="...">{trigger}</Tooltip>`, since the spec's Composition example doesn't specify one for Tooltip.)
- [x] Keep Base UI types private.
- [x] Add keyboard tests. (Escape closes Dialog/Popover/Menu; AlertDialog confirmed to require an explicit in-dialog action instead of outside-press dismissal; Menu arrow-key navigation and Enter activation)
- [x] Add focus-management tests. (focus moves into the overlay on open, restores to the trigger on close, for Dialog/Popover/Menu)
- [x] Add relevant screen-reader acceptance notes. (verified via role, `aria-labelledby`/`aria-describedby` wiring, and axe with zero violations while open — automated, not just manual notes)
- [x] Add visual states and theme coverage. (Storybook stories with `play` functions; theme toolbar from Phase 4 applies)

**Testing-environment finding**: opening Popover/Tooltip/Menu (anything using Base UI's floating-ui-based `Positioner`) hangs indefinitely under jsdom/Vitest — confirmed to be an actual infinite microtask starvation triggered by jsdom's all-zero `getBoundingClientRect` layout interacting with floating-ui's anchor-tracking, not a missing polyfill (`PointerEvent`/`ResizeObserver`/`IntersectionObserver` are all polyfilled in `tests/setup.ts` and none of them fixed it). Dialog/AlertDialog are unaffected because they use fixed centered positioning, not `Positioner`. Resolution: Popover/Tooltip/Menu/Select/Combobox keep a minimal jsdom unit test (closed-state structure only) and get their open/close/keyboard/focus/axe coverage from real-browser tests instead (see "Storybook interaction tests run in CI" below) — exactly the split the Testing strategy section already specifies ("Playwright/Storybook browser testing for behavior requiring a browser"), not an improvised workaround.

**Resolved**: an earlier note here claimed Tooltip's hover-open couldn't be verified in a real browser and that this was a Base UI/Playwright incompatibility. That conclusion was wrong — it was an artifact of driving the browser with raw Playwright `page.mouse.move` calls outside of any testing-library instrumentation. Once Tooltip got real `@storybook/addon-vitest` coverage (Chromium via `@vitest/browser-playwright`, driven by `userEvent.hover`), it opened correctly and reliably. The real, previously-undiagnosed bug was different and more serious: Base UI's Tooltip is purely behavioral and sets neither `role="tooltip"` on the popup nor `aria-describedby` on the trigger, so the tooltip was completely invisible to assistive tech even though it opened and positioned correctly. Fixed in `packages/react/src/tooltip/tooltip.tsx` by generating a popup id and wiring both attributes explicitly.

**Second finding, from Chromatic's hosted test runner rather than local CI**: the `HoverInteraction` story's `play` function passed consistently locally but failed intermittently in Chromatic's environment with "Unable to find role=\"tooltip\"". Root cause: Base UI's hover-open goes through floating-ui-react's `useHover`, whose open-delay ("rest") timer only starts on a `mousemove` event whose movement delta clears a tremor filter (`movementX**2 + movementY**2 < 2` is ignored as noise). `userEvent.hover`'s implicit pointer move computes its delta from wherever the pointer already was; if that start position happened to be close to the trigger (environment- and test-order-dependent — this is why it passed locally but not in Chromatic's runner), the delta fell under the threshold and the rest timer never started, so the tooltip never opened. Fixed in `apps/storybook/stories/tooltip.stories.tsx` by explicitly moving the pointer to a far corner of the canvas before hovering, guaranteeing a large enough delta regardless of prior pointer position; also widened the `findByRole` timeout from 3s to 5s to give the real 600ms open-delay more margin on slower CI hardware.

**Storybook interaction and accessibility checks run in headless Chromium.** `pnpm run ci` installs Chromium and runs the Storybook test suite through `@storybook/addon-vitest`.

That real-browser run immediately found three genuine, previously undetected bugs that no amount of jsdom-based testing could have caught, because jsdom doesn't compute real layout or color contrast:

- **`color.blue.500` (#3b82f6) and `color.red.500` (#ef4444) both fail WCAG AA text contrast against white** (3.67:1 and 3.76:1; need 4.5:1) — affecting Button primary/danger text, Link text, and Field error text. This was a systemic primitive-palette gap: nothing had ever contrast-checked these values against real rendering. Fixed by shifting `color.action.primary.*` and `color.action.danger.*` one step darker (default now uses `blue.600`/`red.600` instead of `blue.500`/`red.500`; added `blue.800`/`red.800` primitives for the `active` state) — a patch-level "accessibility correction to existing values" per this doc's own SemVer policy above.
- **`Select.Trigger` never accepted `aria-label`/`aria-labelledby` at all.** A `role="combobox"` element's accessible name must come from a label mechanism, not its visible content (the content represents the current _value_, the same reason a native `<select>` needs an associated `<label>`) — axe correctly flagged "Buttons must have discernible text" even though the trigger visibly showed "Choose a plan". Fixed by adding both props to `SelectTriggerProps`, matching Checkbox/RadioGroup/Switch, which already had them.
- The Tooltip `role`/`aria-describedby` gap described above.

**Build/typecheck/test ordering finding**: `apps/storybook` and `examples/react` typecheck (not just test) against `@ktjn/design-react`'s package exports map, which points at `dist`. `pnpm build` must run before both `pnpm typecheck` and `pnpm test` — Phase 0's exit criteria and `.github/workflows/ci.yml` were updated accordingly.

Exit criteria:

Overlay behavior remains correct under nested usage, portals, keyboard operation, and theme changes.

## Phase 6 - selection and disclosure

Select and Combobox use `ChevronDownIcon` from `@ktjn/design-icons` (Select trigger indicator), consistent with Phase 5.

Implement:

- [x] Select.
- [x] Combobox.
- [x] Tabs.
- [x] Accordion.

Consider Autocomplete only if its use case differs materially from Combobox in consuming applications. (not built — no demonstrated use case yet, per rule 12)

Validate:

- [x] controlled/uncontrolled APIs
- [x] forms (Select/Combobox forward `name`; native hidden input per Base UI)
- [x] keyboard navigation (Tabs arrow keys, Accordion Enter/Space, Select/Combobox arrow+Enter, all verified in real-browser Storybook tests)
- [x] accessible names/descriptions (Select/Combobox wired through Field context like Input/Checkbox)
- [ ] long content (not explicitly tested — deferred, no current use case surfaced a bug)
- [x] empty states (`Combobox.Content` renders `Combobox.Empty` when filtered results are empty — see the "Real, more serious bug" note below; this line was wrong until that fix)
- [x] disabled items
- [ ] localization-sensitive content (not explicitly tested — deferred, no current use case surfaced a bug)

**Real bug found via real-browser verification, not assumed passing**: `Select.Value` renders the raw item `value` (e.g. `"pro"`) instead of the item's display label (`"Pro"`) unless an `items` map is passed to `Select` — this isn't a design-system bug, it's how Base UI's `SelectValue` label-resolution works, but our wrapper didn't expose the `items` prop at all until this was caught. Fixed by adding `items` to `SelectRootProps`, with a regression test in `select.test.tsx` and a comment in the Storybook story explaining why `items` is required.

**Real, more serious bug found via a manual Storybook + Playwright review, not caught by any automated test**: `Combobox` never actually filtered anything, and its "No results" empty message rendered permanently regardless of whether matching items existed. Root cause: Base UI's `Combobox.Empty` is documented as "requires the `items` prop on the root component" — it derives `filteredItems` entirely from an items array passed to `Combobox.Root`, not from whatever static children happen to be rendered under `Combobox.List`. This design system's `Combobox` never exposed an `items` prop at all (unlike `Select`, which already needed one for label resolution), so `filteredItems` was always `[]`: the empty message always showed, and the visible list never changed as the user typed, because it was just static JSX with no connection to Base UI's filtering. This is a breaking API change: `Combobox` now requires an `items` prop (`ReadonlyArray<{ label: string; value: Value }>`), and `Combobox.Content` no longer takes children — it renders each item internally via `Combobox.List`'s function-children form, driven by that array (`Combobox.Item` is no longer part of the public API). Fixed in `packages/react/src/combobox/combobox.tsx`, with a new `FilterInteraction` Storybook test (`apps/storybook/stories/combobox.stories.tsx`) asserting that typing narrows the list and that an unmatched query shows the empty state — regression coverage that would have caught this immediately.

**Testing-environment note**: Select and Combobox use `Positioner` (floating-ui), so they hit the same jsdom hang described in Phase 5 — minimal jsdom tests cover closed-state structure only; open/select/keyboard/axe coverage lives in Storybook `play` functions, verified in real Chromium via Playwright. Tabs and Accordion have no floating positioning and are fully covered by ordinary jsdom tests.

**Two real bugs found via a manual Storybook + Playwright visual review, neither caught by any automated test**: both are the same class of mistake — CSS targeting a `data-*` attribute name that doesn't match what Base UI actually sets, so the state-dependent styling silently never applied.

- **Tabs**: `.tab[data-selected]` never matched anything, because Base UI's `Tab` sets `data-active` on the currently selected tab, not `data-selected`. Result: the active-tab underline and text-color change never rendered — every tab looked identical regardless of selection. Fixed by changing the selector to `[data-active]` in `tabs.module.css`, with a regression test in `tabs.test.tsx` asserting the real attribute name.
- **Checkbox**: the indeterminate state rendered the exact same checkmark glyph as checked, because the indicator only ever rendered one `<svg>` with no branching on `data-indeterminate`. There was no dash/minus glyph at all, and `.root[data-checked]`'s blue-fill styling didn't apply to `[data-indeterminate]` either, so indeterminate looked like a plain unchecked box with a checkmark inside — visually indistinguishable from both other states in different ways. Fixed by adding a second dash `<svg>` toggled via `[data-indeterminate]` in `checkbox.module.css`, extending the blue-fill selector to include `[data-indeterminate]`, and adding a regression test in `checkbox.test.tsx`.

Both would have been caught immediately by a snapshot or visual-regression test asserting on the actual rendered data attributes rather than assuming the CSS selector matched Base UI's API — jsdom-based unit tests only check DOM structure, not which CSS rules end up applying, so a hand-written attribute mismatch like this is invisible to `vitest`/`axe` and only surfaces by actually looking at the rendered output.

**Third bug from the same review pass, this time systemic rather than component-specific**: `Select.Trigger`, `Combobox.Input`, `Input`, and `Textarea` all combine `width: 100%` with horizontal padding and a `1px` border, but nothing in the design system ever resets `box-sizing` to `border-box`. Under the browser default `content-box` model, padding and border are added on top of the `100%` width rather than carved out of it, so each of these controls silently overflowed its container by exactly `padding + border` — most visible on Combobox/Select, where it produced a horizontal scrollbar and a right edge that ran past the viewport. Fixed by adding `box-sizing: border-box` to `.root`/`.trigger`/`.input` in `input.module.css`, `textarea.module.css`, `select.module.css`, and `combobox.module.css`. (Accordion's trigger also has `width: 100%` but no padding/border on that element, so it wasn't affected.) No global CSS reset exists in this design system by design — each affected component now sets `box-sizing` locally instead.

**Fourth bug, also from manual review, affecting every overlay's trigger**: `Dialog.Trigger`, `Dialog.Close`, `AlertDialog.Trigger` (which reuses `Dialog.Close`), `Popover.Trigger`, `Popover.Close`, and `Menu.Trigger` never applied any `className` at all — each rendered as a completely unstyled native `<button>`, indistinguishable from plain text with a border in some browsers. This wasn't a story-authoring gap: the spec's own Composition example (`<Dialog.Trigger>Delete</Dialog.Trigger>`) shows plain text as a child with no `<Button>` wrapping expected, so the design system itself was responsible for supplying a default look. Fixed by importing `button.module.css` into `dialog.tsx`, `alert-dialog.tsx`, `popover.tsx`, and `menu.tsx`, and applying Button's `root`+`secondary` classes to each of these Trigger/Close components — giving every dialog/popover/menu trigger a sensible default button appearance out of the box, with no public API change (these components still don't accept a `className` override, matching their existing prop types).

Exit criteria:

The component set is sufficient to build a representative settings/data-entry screen entirely from public design-system components. Verified: `examples/react` now includes Tabs-organized sections with a Select (plan picker) and an Accordion (FAQ), alongside the existing Field/Input/Checkbox/RadioGroup/Switch/Dialog/AlertDialog usage — the full example builds cleanly via `vite build`.

## Phase 7 - icons

- [x] Create `packages/icons`.
- [x] Establish SVG sanitization/validation with svgo. (pre-check rejects `<script>`, inline event handlers, `<foreignObject>`, and remote hrefs before svgo even runs; verified by tests that assert these fixtures throw)
- [x] Generate typed React wrappers with @svgr/core.
- [x] Ensure `currentColor` behavior.
- [x] Ensure icon-level tree shaking. (`bundle: false`, one module per icon, matching the `@ktjn/design-react` build strategy)
- [x] Document decorative vs semantic usage. (icons never set `aria-hidden` themselves; verified by test — consuming control decides, per the Icons section)
- [x] Integrate icons into existing components only through `@ktjn/design-icons` public exports. (Dialog's close button uses `CloseIcon`; Select's trigger uses `ChevronDownIcon` — both import only from `@ktjn/design-icons`, never from `packages/icons/src` directly)

This phase may be moved earlier if components need a shared icon set sooner.

## Phase 8 - release hardening

- [x] Compare React public API against previous release in CI. (`packages/react/tests/api-surface.test.ts` snapshot-tests a concatenation of every generated `.d.ts` against a committed `api-report.d.ts` baseline; part of `pnpm test`, which CI runs)
- [x] Compare token API against previous release in CI. (already existed since Phase 1: `packages/tokens/tests/build.test.ts` snapshot-tests `dist/json/tokens.json` against `token-api.json`)
- [x] Validate package contents before publish with publint and arethetypeswrong. (`pnpm run check:packages`, wired into both `ci.yml` and `release.yml`; `attw` uses the `esm-only` profile since these packages intentionally ship ESM-only — verified this doesn't mask real issues, only the expected "no CJS" resolution warning)
- [x] Add bundle-size budgets with size-limit where they provide useful regression protection. (`pnpm run check:size`; budgets set from measured sizes with headroom, not arbitrary numbers — a Button-only import is ~400B, the full package is ~87KB brotli including Base UI + floating-ui)
- [x] Test package installation from packed tarballs rather than only workspace links. (`scripts/check-tarballs.mjs` — packs all three publishable packages, installs them together into a plain non-workspace npm project via local tarball paths, and verifies both the tokens CSS output and a real Vite build of `@ktjn/design-react`/`@ktjn/design-icons`. **This caught a real, significant bug**: `dist/index.js` used extension-less relative imports (`from "./accordion/accordion"`), which resolve fine under bundlers but fail under Node's native ESM resolver and would have broken for any consumer not using a lenient bundler. Fixed by adding explicit `.js` extensions to every internal cross-file import in `packages/react/src` and the icons package's generated `index.ts`.)
- [x] Add provenance/attestation to releases where supported. (`NPM_CONFIG_PROVENANCE: "true"` in `release.yml`'s publish step; requires OIDC trusted publishing configured on the npm side, which is outside this repo's control)
- [x] Document SemVer policy. (new "SemVer policy" subsection under Versioning and release)
- [x] Document deprecation policy. (new "Deprecation policy" subsection under Versioning and release)

Exit criteria

Local CI checks the committed API and token baselines before push.

# Component catalog

Every public component exported from `@ktjn/design-react` links to its live Storybook page (verified by `packages/react/tests/readme-catalog.test.ts`):

- **Layout**: [AspectRatio](https://ktjn.github.io/design/?path=/story/aspectratio--sixteen-by-nine), [Container](https://ktjn.github.io/design/?path=/story/container--default), [Grid](https://ktjn.github.io/design/?path=/story/grid--three-columns), [ScrollArea](https://ktjn.github.io/design/?path=/story/scrollarea--default), [Separator](https://ktjn.github.io/design/?path=/story/separator--horizontal), [Sidebar](https://ktjn.github.io/design/?path=/story/sidebar--default), [Stack](https://ktjn.github.io/design/?path=/story/stack--vertical)
- **Actions & Forms**: [Autocomplete](https://ktjn.github.io/design/?path=/story/autocomplete--default), [Button](https://ktjn.github.io/design/?path=/story/button--primary), [ButtonGroup](https://ktjn.github.io/design/?path=/story/buttongroup--horizontal), [Calendar](https://ktjn.github.io/design/?path=/story/calendar--default), [Checkbox](https://ktjn.github.io/design/?path=/story/checkbox--unchecked), [Combobox](https://ktjn.github.io/design/?path=/story/combobox--default), [DatePicker](https://ktjn.github.io/design/?path=/story/datepicker--default), [Field](https://ktjn.github.io/design/?path=/story/field--default), [Fieldset](https://ktjn.github.io/design/?path=/story/fieldset--default), [FileUpload](https://ktjn.github.io/design/?path=/story/fileupload--default), [Input](https://ktjn.github.io/design/?path=/story/input--default), [InputGroup](https://ktjn.github.io/design/?path=/story/inputgroup--default), [Link](https://ktjn.github.io/design/?path=/story/link--default), [NumberField](https://ktjn.github.io/design/?path=/story/numberfield--default), [OTPField](https://ktjn.github.io/design/?path=/story/otpfield--default), [RadioGroup](https://ktjn.github.io/design/?path=/story/radiogroup--default), [Select](https://ktjn.github.io/design/?path=/story/select--default), [Slider](https://ktjn.github.io/design/?path=/story/slider--default), [Switch](https://ktjn.github.io/design/?path=/story/switch--off), [Textarea](https://ktjn.github.io/design/?path=/story/textarea--default), [Toggle](https://ktjn.github.io/design/?path=/story/toggle--default), [ToggleGroup](https://ktjn.github.io/design/?path=/story/togglegroup--single), [Toolbar](https://ktjn.github.io/design/?path=/story/toolbar--default)
- **Overlays & Disclosure**: [Accordion](https://ktjn.github.io/design/?path=/story/accordion--default), [AlertDialog](https://ktjn.github.io/design/?path=/story/alertdialog--default), [Collapsible](https://ktjn.github.io/design/?path=/story/collapsible--default), [CommandPalette](https://ktjn.github.io/design/?path=/story/commandpalette--default), [ContextMenu](https://ktjn.github.io/design/?path=/story/contextmenu--default), [Dialog](https://ktjn.github.io/design/?path=/story/dialog--default), [Drawer](https://ktjn.github.io/design/?path=/story/drawer--right), [Menu](https://ktjn.github.io/design/?path=/story/menu--default), [Popover](https://ktjn.github.io/design/?path=/story/popover--default), [PreviewCard](https://ktjn.github.io/design/?path=/story/previewcard--default), [Tabs](https://ktjn.github.io/design/?path=/story/tabs--default), [Tooltip](https://ktjn.github.io/design/?path=/story/tooltip--default)
- **Navigation, Feedback & Display**: [Alert](https://ktjn.github.io/design/?path=/story/alert--info), [Avatar](https://ktjn.github.io/design/?path=/story/avatar--sizes), [Badge](https://ktjn.github.io/design/?path=/story/badge--all-variants), [Breadcrumb](https://ktjn.github.io/design/?path=/story/breadcrumb--default), [Card](https://ktjn.github.io/design/?path=/story/card--default), [EmptyState](https://ktjn.github.io/design/?path=/story/emptystate--default), [Kbd](https://ktjn.github.io/design/?path=/story/kbd--default), [Meter](https://ktjn.github.io/design/?path=/story/meter--default), [Pagination](https://ktjn.github.io/design/?path=/story/pagination--default), [Progress](https://ktjn.github.io/design/?path=/story/progress--determinate), [Skeleton](https://ktjn.github.io/design/?path=/story/skeleton--card-placeholder), [Spinner](https://ktjn.github.io/design/?path=/story/spinner--sizes), [Stepper](https://ktjn.github.io/design/?path=/story/stepper--horizontal), [Table](https://ktjn.github.io/design/?path=/story/table--default), [Tag](https://ktjn.github.io/design/?path=/story/tag--variants), [Toast](https://ktjn.github.io/design/?path=/story/toast--default), [VisuallyHidden](https://ktjn.github.io/design/?path=/story/visuallyhidden--icon-only-button)

Additional Storybook guides: [Overview](https://ktjn.github.io/design/?path=/story/overview--getting-started), [Tokens](https://ktjn.github.io/design/?path=/story/tokens--specimen), [Icons](https://ktjn.github.io/design/?path=/story/icons--gallery), [Blocks](https://ktjn.github.io/design/?path=/story/blocks--login-form).

Treat `DataGrid`, rich text editing, and charting as separate design efforts rather than inevitable core components.

# Explicit constraints

The following rules should remain true unless deliberately changed by an architecture decision:

1. Tokens are usable without React.
2. Themes are token concerns, not React concerns.
3. Base UI never appears in the public API.
4. Native HTML is preferred where sufficient.
5. Components consume semantic tokens rather than primitive colors/scales directly.
6. Applications can override layout/styling through normal DOM/CSS escape hatches without a proprietary styling DSL.
7. Form components obey native form semantics and do not require a form library.
8. Accessibility is a tested compatibility requirement.
9. Package versions are independent.
10. New packages require a real independent-consumption or release boundary.
11. New tokens require a semantic use case.
12. New components require a demonstrated product use case.

# Initial milestone

The first useful milestone is deliberately small:

```text
@ktjn/design-tokens
  base primitives
  semantic colors/spacing/typography/radius
  light + dark
  default + compact
  default + more contrast

@ktjn/design-react
  Button
  Input
  Textarea
  Field
  Checkbox
  Dialog

Storybook
  documentation
  axe
  interaction tests
  visual regression
```

This milestone exercises every important architectural boundary: independent tokens, theme composition, native components, Base UI-backed behavior, forms, accessibility, documentation, and releases. Expand the system only after this vertical slice is working.
