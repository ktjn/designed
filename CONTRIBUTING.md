# Contributing to Designed

## Prerequisites

- Node.js `>=26` (`.nvmrc`)
- `pnpm` matching `packageManager` in `package.json`

## Local Setup

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm --filter @ktjn/storybook dev
```

On Linux, if Chromium reports missing system libraries when running browser tests:

```sh
pnpm --filter @ktjn/storybook exec playwright install-deps chromium
```

## Development Rules

- **TDD**: add a failing test before implementing a bug fix or new behavior.
- **Keep Base UI internal**: never re-export Base UI components or leak `@base-ui/*` types into `packages/react/api-report.d.ts`.
- **Use semantic tokens**: components consume `--ds-*` semantic tokens rather than hard-coded brand colors.
- **Add a changeset**: run `pnpm changeset` for user-visible package changes (`@ktjn/designed-tokens`, `@ktjn/designed-icons`, `@ktjn/designed-react`).
- **Update baselines deliberately**: if a PR changes public token or React types, regenerate `packages/tokens/token-api.json` or `packages/react/api-report.d.ts` and review the diff.

## Validation Before Push

Run the full local validation suite from the repository root before opening or updating a pull request:

```sh
pnpm run ci
```

`pnpm run ci` runs Biome lint/format, package builds, TypeScript typecheck, unit tests, headless Chromium Storybook + axe tests, `publint` + `attw`, `size-limit` budgets, and packed tarball installation checks.
