# React Native / Expo — ESLint Plugin Reference

> Last updated: 2026-03-20
> Sources: npm trends, GitHub, Expensify/App, Bluesky, Reanimated, expo/expo, rainbow-me

## Baseline (most RN projects should have these)

| Plugin | Weekly DL | Stars | Maintainer | Notes |
|---|---|---|---|---|
| `eslint-config-expo` | High | Expo monorepo | Expo (Meta partner) | Official Expo config. Includes react, hooks, TS, import rules |
| `typescript-eslint` | Very high | 15K+ | typescript-eslint org | 100% adoption across all surveyed RN projects |
| `eslint-plugin-react-hooks` | Very high | React monorepo | Meta | **v6+ includes React Compiler rules** via `recommended-latest` preset |
| `eslint-plugin-react-native` | 1.4M | 762 | Intellicode (community) | **Frozen since May 2021** but no replacement. Rules: no-unused-styles, no-inline-styles, no-color-literals |
| `eslint-config-prettier` | Very high | — | Community | Universal — 100% of surveyed projects use Prettier |
| `simple-import-sort` | High | — | Community | Used by Reanimated, Bluesky. Simpler than import/order |
| `unused-imports` | High | — | Community | Auto-removes unused imports |

## MUST-HAVE additions

| Plugin | Weekly DL | Stars | Why |
|---|---|---|---|
| `eslint-plugin-testing-library` | 4.5M | 1.3K+ | 3/6 RN projects use. Prevents wrong `waitFor`, `act()` wrapping, query misuse. Scope to test files |
| `eslint-plugin-jest` | 12.6M | 1.2K | 3/6 RN projects use (Expensify, Reanimated, Rainbow). Catches `test.only` leaks, missing expects |
| `@typescript-eslint/no-deprecated` | bundled | — | Replaces archived `eslint-plugin-deprecation`. Zero setup cost with existing type-checked config |

## NICE-TO-HAVE

| Plugin | Weekly DL | Stars | When |
|---|---|---|---|
| `eslint-plugin-react-native-a11y` | Moderate | FormidableLabs | 3/6 projects use (Expensify, Bluesky, RN-Paper). Accessibility rules |
| `eslint-plugin-react-perf` | 244K | 213 | **Diminished value with React Compiler**. Keep at `warn` if compiler not yet enabled |
| `@tanstack/eslint-plugin-query` | 1.7M | 45.8K (mono) | Only if using TanStack Query. Catches query key dependency bugs |
| `@rnx-kit/oxlint-config` | Growing | Microsoft | Fast CI pre-pass alongside ESLint. Microsoft-maintained RN-specific OXLint config |

## SKIP

| Plugin | Reason |
|---|---|
| ~~`eslint-plugin-react-compiler`~~ (standalone) | **Deprecated Oct 2025.** Merged into `eslint-plugin-react-hooks@latest` |
| ~~`eslint-plugin-react-hook-form`~~ | 3.4K/week, crash bugs, single maintainer, not endorsed by RHF team |
| ~~`eslint-plugin-deprecation`~~ | **Archived.** Use `@typescript-eslint/no-deprecated` |
| ~~Biome~~ (as linter) | No RN-specific rules, no react-hooks/exhaustive-deps equivalent |

## Key Config Patterns from Real Projects

### Bluesky (ESLint 9, flat config)
- `typescript-eslint` recommendedTypeChecked
- `eslint-plugin-import-x` (newer fork of import plugin)
- `eslint-plugin-react-compiler` via react-hooks
- `consistent-type-imports` with inline specifier
- Custom `bsky-internal/avoid-unwrapped-text` rule
- Forbids barrel files (index.ts)

### Expensify (ESLint 9, flat config)
- Extensive `no-restricted-imports` (forbids direct RN Text, ScrollView, Pressable)
- `eslint-plugin-testing-library` + `eslint-plugin-jest`
- `max-lines: 4000` per file
- Custom in-repo ESLint plugins

### Reanimated (ESLint 9, flat config)
- `typescript-eslint` recommendedTypeChecked
- `eslint-plugin-n` (node rules for tooling)
- `eslint-plugin-promise`
- `eslint-plugin-jsdoc` + `eslint-plugin-tsdoc`
- `consistent-type-imports` + `consistent-type-exports`

## Warnings

- `eslint-plugin-react-native` is frozen (May 2021). Maintainer confirmed no longer using RN. Monitor for community fork.
- `eslint-plugin-react-perf` value diminishes with React Compiler (Expo SDK 54+). Compiler auto-memoizes.
- `eslint-plugin-import` is being superseded by `eslint-plugin-import-x` in newer projects (Bluesky, Reanimated).
