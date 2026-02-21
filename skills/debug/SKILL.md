---
name: debug
description: 'Systematic debugging workflow based on Kernighan, Pike, Feathers, and Gregg methodologies. Activates on keywords: debug, bug, error, issue, troubleshoot, crash, fix, broken'
---

# Systematic Debugging

> "Debugging is twice as hard as writing the code in the first place." — Brian Kernighan

## The Two Schools of Debugging

| School | Core Question | Method | Masters |
|--------|--------------|--------|---------|
| **Symptom Tracing** | What is broken? | Logs, tracing, observability | Pike / Gregg |
| **Root Cause Elimination** | Why did it break? | Minimal reproduction, hypothesis, experiment | Kernighan / Feathers |

**Key Insight**: Master debuggers combine both approaches.

---

## Universal Debugging Protocol (UDP)

```
1. STOP      → Define the problem clearly (expected vs actual)
2. REPRODUCE → Create minimal, reliable reproduction
3. OBSERVE   → Collect evidence (logs, state, traces)
4. HYPOTHESIZE → Form testable hypothesis (max 3)
5. TEST      → Change ONE thing, observe result
6. FIX       → Apply minimal fix
7. VERIFY    → Confirm fix, run regression tests
8. DOCUMENT  → Record cause, solution, lessons learned
```

---

## Kernighan's 9 Indispensable Rules

1. **Understand the system** — Read before debug
2. **Make it fail** — Reproducibility is everything
3. **Quit thinking and look** — Observe, don't assume
4. **Divide and conquer** — Binary search the problem space
5. **Change one thing at a time** — Isolate variables
6. **Keep an audit trail** — Log everything you try
7. **Check the plug** — Verify the obvious first
8. **Get a fresh view** — Rubber duck, colleague, or sleep on it
9. **If you didn't fix it, it isn't fixed** — Verify ruthlessly

---

## Gregg's Observability Principles

### USE Method (for resources)
- **U**tilization: How busy is the resource?
- **S**aturation: How much work is queued?
- **E**rrors: Are there error events?

### RED Method (for services)
- **R**ate: Requests per second
- **E**rrors: Failed requests
- **D**uration: Latency distribution

### Flame Graphs
Visualize CPU/memory hotspots. Stack depth = call chain, width = time spent.

---

## Feathers' Legacy Code Approach

When debugging unfamiliar or legacy code:

1. **Seam** — Find a point to insert observation/tests
2. **Cover** — Add characterization test (capture current behavior)
3. **Change** — Modify with safety net
4. **Refactor** — Clean up after fixing

---

## Anti-Patterns to Avoid

| Don't | Do Instead |
|-------|------------|
| Change multiple things at once | Change ONE thing, observe |
| Fix without understanding | Understand root cause first |
| Skip reproduction step | Build reliable repro case |
| Debug in production | Reproduce locally if possible |
| Trust "works on my machine" | Check environment differences |
| Guess without data | Observe and measure first |

---

## Claude Interaction Protocol

When helping with debugging, follow this workflow:

### Phase 1: Problem Definition

```
1. ASK: "What is the expected behavior vs actual behavior?"
2. ASK: "When did this start? Any recent changes?"
3. ASK: "Is it reproducible? Steps to reproduce?"
4. CREATE: debug_notes.md to track investigation
```

### Phase 2: Reproduction

```
1. ATTEMPT: Reproduce the issue
2. DOCUMENT: Steps to reproduce in debug_notes.md
3. SIMPLIFY: Find minimal reproduction case
4. IDENTIFY: Consistent vs intermittent failure
```

### Phase 3: Investigation

```
1. OBSERVE: Gather logs, errors, stack traces
2. HYPOTHESIZE: Form at most 3 hypotheses
3. TEST: Each hypothesis with ONE change at a time
4. RECORD: Every attempt in debug_notes.md
5. NARROW: Use divide-and-conquer to isolate
```

### Phase 4: Resolution

```
1. FIX: Apply minimal fix
2. VERIFY: Confirm fix works
3. REGRESS: Check for side effects
4. PREVENT: Add test if appropriate
5. SUMMARIZE: Root cause and solution in debug_notes.md
```

---

## debug_notes.md Template

Create this file to track debugging investigations:

```markdown
# Debug Notes: [Issue Description]

## Problem Statement
- **Expected**: [what should happen]
- **Actual**: [what happens]
- **Severity**: [critical/high/medium/low]
- **First observed**: [when]

## Environment
- OS:
- Version:
- Dependencies:

## Reproduction Steps
1. [step]
2. [step]
3. [observe failure]

## Hypotheses
- [ ] H1: [hypothesis] — [how to test]
- [ ] H2: [hypothesis] — [how to test]
- [ ] H3: [hypothesis] — [how to test]

## Investigation Log

| Time | Action | Result | Next Step |
|------|--------|--------|-----------|
| | | | |

## Root Cause
[Explanation of why the bug occurred]

## Solution
[What was changed and why]

## Prevention
[How to prevent similar issues: tests, guards, docs]
```

---

## Quick Decision Tree

```
Problem reported
    │
    ▼
Can reproduce? ─No──▶ Get more info (logs, environment)
    │
   Yes
    │
    ▼
Recent change? ─Yes──▶ Check diff, rollback test
    │
    No
    │
    ▼
Obvious cause? ─Yes──▶ Verify with minimal test
    │
    No
    │
    ▼
Divide and conquer
    │
    ▼
Isolate component
    │
    ▼
Form hypothesis (max 3)
    │
    ▼
Test ONE change at a time
    │
    ▼
Fix → Verify → Document
```

---

## Domain-Specific Checklists

See [checklists.md](checklists.md) for:
- Streaming/Buffer Issues
- BLE/UART Communication
- AI Inference Bottlenecks
- System Observability
- Network/API Issues
- Memory/Crash Issues
- App Debugging
- Web Debugging

## Tool Reference

See [reference.md](reference.md) for tool commands and recipes.
