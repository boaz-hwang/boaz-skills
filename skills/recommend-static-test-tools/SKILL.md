---
name: recommend-static-test-tools
description: |
  Detect project frameworks and recommend ESLint plugins, static analysis tools,
  and code quality configurations. Triggers on: "eslint 추천", "lint 설정",
  "정적 분석 도구", "code quality tools", "recommend linting", "static test tools".
  Outputs a recommendation report only — does NOT install anything.
argument-hint: "[framework: react-native | nestjs | web-react | web-vue | angular | next | ...]"
---

# Recommend Static Test Tools

Analyze the current project's framework stack and recommend ESLint plugins/static analysis
tools that balance productivity with maintainability.

## Workflow

### Phase 1: Framework Detection

If `$ARGUMENTS` is provided, use it as the target framework(s).

Otherwise, auto-detect from `package.json` dependencies:

| Indicator | Framework |
|---|---|
| `expo`, `react-native` | `react-native` |
| `@nestjs/core` | `nestjs` |
| `vite` + `react` (no react-native) | `web-react` |
| `next` | `next` |
| `vue` | `web-vue` |
| `@angular/core` | `angular` |
| `express` / `fastify` (no @nestjs) | `node-server` |

If multiple frameworks are detected (monorepo), process each independently.

Use AskUserQuestion to confirm detected framework(s) before proceeding.

### Phase 2: Current State Diagnosis

1. **Read existing ESLint config** — find `eslint.config.*` or `.eslintrc.*`
2. **Inventory installed plugins** — parse `package.json` devDependencies for `eslint-plugin-*`
3. **Detect test framework** — jest, vitest, mocha, or none
4. **Detect formatter** — prettier, biome, or none
5. **Detect pre-commit hooks** — husky, lint-staged, lefthook, or none

Present a concise status summary to the user.

### Phase 3: Research (Agent Teams)

Spawn 3 parallel research agents:

**Agent 1 — Framework Specialist**:
- Load the matching `references/{framework}.md` for baseline recommendations
- Web search for the latest plugin versions, breaking changes, deprecations
- Verify each plugin's ESLint 9 flat config compatibility

**Agent 2 — Adoption Validator**:
- Search 5+ major open-source projects using the same framework
- Check their actual ESLint configs on GitHub
- Build a frequency table of plugin adoption

**Agent 3 — Cross-cutting Tools**:
- Load `references/cross-cutting.md` for universal tools
- Check for complementary non-ESLint tools (Knip, OXLint, Biome)
- Assess monorepo-specific needs if applicable

### Phase 4: Recommendation Report

Synthesize all agent results into a structured report:

```markdown
## Recommendation Report: {framework}

### Current State
- Installed: {list}
- Missing areas: {list}

### MUST-HAVE (install these)
| Plugin | Weekly Downloads | Why |
|---|---|---|
| ... | ... | ... |

### NICE-TO-HAVE (team decision)
| Plugin | Weekly Downloads | Why |
|---|---|---|
| ... | ... | ... |

### SKIP (not recommended)
| Plugin | Why Skip |
|---|---|
| ... | ... |

### Complementary Tools (non-ESLint)
| Tool | Purpose |
|---|---|
| ... | ... |

### Adoption Evidence
{frequency table from real projects}
```

Rating criteria (explain each recommendation against these):
- Sufficiently loose for productivity
- Sufficiently tight for maintainability and consistency
- High GitHub stars and reputable maintainer
- Active maintenance and living community
- High npm weekly downloads and real-world adoption
- Recommended by developer communities

### Phase 5: Feedback Collection

After presenting the report, ask the user:

1. "이 추천 결과에 동의하시나요? 수정할 항목이 있나요?"
2. Collect feedback on each category (MUST-HAVE, NICE-TO-HAVE, SKIP)
3. If the user provides corrections or preferences, **update the corresponding
   `references/{framework}.md`** file to reflect the learning

This creates a self-improving loop: each usage refines the reference data
for future recommendations.

## Reference Files

Load these as needed — do NOT load all at once:

- For React Native/Expo projects → read [references/react-native.md](references/react-native.md)
- For NestJS server projects → read [references/nestjs.md](references/nestjs.md)
- For Vite/Next React web projects → read [references/web-react.md](references/web-react.md)
- For universal/monorepo tools → read [references/cross-cutting.md](references/cross-cutting.md)

## Output Rules

- Report only, never install packages or modify config files
- Always include npm weekly download numbers and GitHub stars
- Always include real-world adoption evidence (name specific projects)
- Rate every plugin as MUST-HAVE / NICE-TO-HAVE / SKIP
- Explain WHY for each rating against the criteria
- If a plugin is deprecated or archived, explicitly flag it
- If a previously recommended plugin has a better successor, note the migration path
