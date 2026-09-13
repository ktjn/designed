# Design System

A small, framework-aware design system with framework-independent design tokens and a React component library built on Base UI.

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
- Building a data grid, rich text editor, date picker, or other application-scale widget before demonstrated demand.
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
Storybook --------------------------------> @ktjn/design-react
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

| Area | Choice |
| --- | --- |
| Token format | DTCG Design Tokens format |
| Token compiler | Style Dictionary behind a local build script |
| Theme mechanism | CSS custom properties |
| Components | React + TypeScript |
| Behavioral primitives | Base UI |
| Styling | CSS Modules |
| Icons | SVG source + generated React components |
| Documentation | Storybook |
| Unit tests | Vitest |
| Browser tests | Playwright / Storybook browser tests |
| Accessibility | axe + explicit keyboard/focus tests |
| Visual regression | Chromatic initially |
| Package manager | pnpm |
| Releases | Changesets |
| CI | GitHub Actions |

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
<Button variant="primary" size="medium">Save</Button>
```

Avoid:

```tsx
<Button background="blue500" padding="space4" radius="radius2" />
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
<Button>Save</Button>
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
</Dialog>
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
</Field>
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
</Button>
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

- [ ] Initialize pnpm workspace.
- [ ] Add TypeScript configuration.
- [ ] Add formatting/linting with the smallest viable configuration.
- [ ] Add Vitest.
- [ ] Add Changesets with independent package versions.
- [ ] Add GitHub Actions for install, typecheck, test, and build.
- [ ] Add release workflow using trusted publishing where supported.
- [ ] Add dependency update automation.

Exit criteria:

```text
pnpm install
pnpm test
pnpm build
```

work from a clean checkout.

## Phase 1 - token foundation

- [ ] Create `packages/tokens`.
- [ ] Define initial DTCG primitive tokens for color, spacing, typography, radius, border, elevation, and motion.
- [ ] Define the initial semantic token vocabulary.
- [ ] Add default brand.
- [ ] Add light and dark schemes.
- [ ] Add default and compact density.
- [ ] Add Style Dictionary behind `scripts/build-tokens.ts`.
- [ ] Generate CSS, JSON, and TypeScript outputs.
- [ ] Add deterministic generation tests.
- [ ] Add unresolved-reference and cycle validation.
- [ ] Add token naming validation.
- [ ] Add public token API snapshot generation.
- [ ] Publish first `@ktjn/design-tokens` prerelease.

Keep the initial token vocabulary intentionally small. Add tokens because components require semantics, not because a comprehensive taxonomy can be imagined.

Exit criteria:

A plain HTML page can consume the package, switch light/dark and density attributes, and render without React.

## Phase 2 - React foundation

- [ ] Create `packages/react`.
- [ ] Add React and React DOM as peer dependencies.
- [ ] Add Base UI as an internal dependency.
- [ ] Add CSS Modules build support.
- [ ] Define shared public API conventions.
- [ ] Verify ESM package exports and tree shaking.
- [ ] Add SSR/hydration smoke test.
- [ ] Add an example React application consuming only public package exports.

Implement the first native components:

- [ ] Button.
- [ ] Link.
- [ ] Heading/Text only if a typography abstraction proves useful.
- [ ] Input.
- [ ] Textarea.

Do not add generic `Box`, `Stack`, or polymorphic styling primitives initially.

Exit criteria:

The example app consumes the published token contract and React components without imports from internal source paths or Base UI.

## Phase 3 - forms and accessibility contract

- [ ] Implement Field composition.
- [ ] Implement Checkbox.
- [ ] Implement RadioGroup.
- [ ] Implement Switch.
- [ ] Define validation-state conventions.
- [ ] Verify native form submission.
- [ ] Verify integration with a representative external form library without adding it as a production dependency.
- [ ] Add axe checks.
- [ ] Add keyboard and focus tests.
- [ ] Add forced-colors test cases where practical.
- [ ] Document accessibility expectations.

Exit criteria:

Form components work with native form submission and at least one external form-state library without adapters in `@ktjn/design-react`.

## Phase 4 - Storybook and visual contract

- [ ] Create Storybook application.
- [ ] Document current components.
- [ ] Cover major visual and interaction states with stories.
- [ ] Run accessibility checks against stories.
- [ ] Add interaction tests for complex states.
- [ ] Add Chromatic visual regression.
- [ ] Test stories across light/dark and default/compact themes.

Exit criteria:

Every public component has executable documentation and baseline visual/accessibility coverage.

## Phase 5 - overlays

Implement Base UI-backed overlay primitives:

- [ ] Dialog.
- [ ] AlertDialog.
- [ ] Popover.
- [ ] Tooltip.
- [ ] Menu.

For each component:

- [ ] Define the design-system public API before implementation.
- [ ] Keep Base UI types private.
- [ ] Add keyboard tests.
- [ ] Add focus-management tests.
- [ ] Add relevant screen-reader acceptance notes.
- [ ] Add visual states and theme coverage.

Exit criteria:

Overlay behavior remains correct under nested usage, portals, keyboard operation, and theme changes.

## Phase 6 - selection and disclosure

Implement:

- [ ] Select.
- [ ] Combobox.
- [ ] Tabs.
- [ ] Accordion.

Consider Autocomplete only if its use case differs materially from Combobox in consuming applications.

Validate:

- [ ] controlled/uncontrolled APIs
- [ ] forms
- [ ] keyboard navigation
- [ ] accessible names/descriptions
- [ ] long content
- [ ] empty states
- [ ] disabled items
- [ ] localization-sensitive content

Exit criteria:

The component set is sufficient to build a representative settings/data-entry screen entirely from public design-system components.

## Phase 7 - icons

- [ ] Create `packages/icons`.
- [ ] Establish SVG sanitization/validation.
- [ ] Generate typed React wrappers.
- [ ] Ensure `currentColor` behavior.
- [ ] Ensure icon-level tree shaking.
- [ ] Document decorative vs semantic usage.
- [ ] Integrate icons into existing components only through `@ktjn/design-icons` public exports.

This phase may be moved earlier if components need a shared icon set sooner.

## Phase 8 - release hardening

- [ ] Compare React public API against previous release in CI.
- [ ] Compare token API against previous release in CI.
- [ ] Validate package contents before publish.
- [ ] Add bundle-size budgets where they provide useful regression protection.
- [ ] Test package installation from packed tarballs rather than only workspace links.
- [ ] Add provenance/attestation to releases where supported.
- [ ] Document SemVer policy.
- [ ] Document deprecation policy.

Exit criteria:

Breaking API and token-surface changes cannot be published accidentally through the normal release workflow.

# Component backlog

Build only when backed by a concrete use case.

## Foundation

```text
Button
Link
Input
Textarea
Field
Checkbox
RadioGroup
Switch
```

## Overlay

```text
Dialog
AlertDialog
Popover
Tooltip
Menu
```

## Selection and disclosure

```text
Select
Combobox
Tabs
Accordion
```

## Later candidates

```text
Toast
Breadcrumb
Pagination
Table
Slider
Progress
Skeleton
FileUpload
DatePicker
```

Treat `DataGrid`, rich text editing, advanced date/time selection, charts, and application navigation shells as separate design efforts rather than inevitable core components.

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