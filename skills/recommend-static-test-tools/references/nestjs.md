# NestJS — ESLint Plugin Reference

> Last updated: 2026-03-20
> Sources: npm trends, GitHub, nestjs/nest, ever-gauzy, rubiin/ultimate-nest, brocoders/nestjs-boilerplate

## Baseline (most NestJS projects should have these)

| Plugin | Weekly DL | Stars | Maintainer | Notes |
|---|---|---|---|---|
| `typescript-eslint` (recommendedTypeChecked) | Very high | 15K+ | typescript-eslint org | 100% adoption. Use `recommendedTypeChecked` for backend |
| `@darraghor/eslint-plugin-nestjs-typed` | 35K | 218 | Darragh O'Riordan | Best NestJS-specific plugin. v7.1.26 (Mar 2026). 23 rules for DI, Swagger, security |
| `eslint-plugin-promise` | High | — | eslint-community | Promise best practices. `flat/recommended` preset |
| `eslint-config-prettier` | Very high | — | Community | Universal |
| `simple-import-sort` | High | — | Community | Import ordering |
| `unused-imports` | High | — | Community | Auto-removes unused imports |

## MUST-HAVE additions

| Plugin | Weekly DL | Stars | Why |
|---|---|---|---|
| `eslint-plugin-n` | 5.0M | 324 | eslint-community maintained. `prefer-node-protocol` (node:fs), `no-process-exit`, `no-deprecated-api`. Reanimated also uses |
| `eslint-plugin-jest` | 12.6M | 1.2K | NestJS defaults to Jest. Catches `test.only` leaks, missing expects. Scope to `**/*.spec.ts` |
| `@typescript-eslint/no-deprecated` | bundled | — | Replaces archived `eslint-plugin-deprecation`. Catches deprecated API usage at lint time |

## NICE-TO-HAVE

| Plugin | Weekly DL | Stars | When |
|---|---|---|---|
| `eslint-plugin-sonarjs` | 1.7M | 1.2K | SonarSource (enterprise). `cognitive-complexity` is the killer rule. Use selective rules, not full recommended (200+ rules in v2) |
| `eslint-plugin-regexp` | 1.1M | 757 | ota-meshi. **ReDoS detection** (`no-super-linear-backtracking`) critical for API backends processing user input |
| `eslint-plugin-security` | 1.7M | 2.3K | eslint-community. **Only 4 rules useful**: detect-non-literal-regexp, detect-object-injection, detect-eval-with-expression, detect-non-literal-fs-filename |
| `eslint-plugin-no-secrets` | 150K | — | Entropy-based secret detection in source code. Active (v2.3.3 Mar 2026). Supplement with gitleaks |
| `eslint-plugin-unicorn` | 5.7M | 4.9K | Sindre Sorhus. **Do NOT use recommended wholesale** — 20-30 rules conflict with NestJS patterns. Cherry-pick: prefer-node-protocol, no-nested-ternary, explicit-length-check |
| `eslint-plugin-rxjs-x` | 24K | 34 | JasonWeinzierl. Only if writing custom interceptors/microservice Observable chains. Fork of dead cartant/rxjs |

## SKIP

| Plugin | Reason |
|---|---|
| ~~`eslint-plugin-security-node`~~ | No ESLint v9, last commit Jan 2024 |
| ~~`eslint-plugin-rxjs`~~ (cartant) | Dead. No ESLint v9. Use `rxjs-x` if needed |
| ~~`@trilon/eslint-plugin`~~ | Only 4 rules, 13 stars. `@darraghor` is far superior |
| ~~`eslint-plugin-deprecation`~~ | **Archived.** Use `@typescript-eslint/no-deprecated` |

## Key Config Patterns from Real Projects

### nestjs/nest (Official — ESLint 9, flat config)
- **Extremely minimal**: typescript-eslint + prettier only
- Turns off no-explicit-any, no-unsafe-* (framework uses `any` internally)
- **Do NOT model app code after this** — framework source has different needs

### brocoders/nestjs-boilerplate (ESLint 10!)
- `no-floating-promises: error`
- `require-await: error`
- Custom `no-restricted-syntax`: enforces `configService.get()` must use `{ infer: true }`
- Enforces test names start with "should"

### rubiin/ultimate-nest (OXLint only — no ESLint)
- Fully migrated to OXLint. Uses built-in typescript, import, unicorn plugins
- Migration signal for future trend

## NestJS-Specific Rule Adjustments

When using type-checked rules with NestJS decorators:
```js
'@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
'@typescript-eslint/no-explicit-any': 'off',  // NestJS DI requires any in some patterns
'@typescript-eslint/no-unsafe-*': 'warn',      // warn not error — decorators trigger these
```

When using `@darraghor/nestjs-typed` without Swagger:
```js
'@darraghor/nestjs-typed/controllers-should-supply-api-tags': 'off',
'@darraghor/nestjs-typed/api-method-should-specify-api-response': 'off',
```
