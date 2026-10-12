# Phase 1 fidelity, performance, and AI-handoff baseline

This pin records the repository as it is. It does not change preview, export, or handoff behavior. Issue #11's later gates can compare against it. The 2026-09-22 files remain the older pre-change comparison.

Correct values, rendered pages, resource use, and model output are separate claims. This document does not turn them into one design score.

## Reproduce

```sh
npm ci
npm run build
npm run quality:baseline:check
```

`npm run quality:baseline` rewrites `docs/quality-baseline-2026-10-12.json` from the current tree and the existing `dist`. Run it only when the pin itself should change. The command refuses to write when field expectations, selected-handoff guards, font guards, or source structural guards fail.

Reviewed field values live in `scripts/fixtures/quality-baseline/field-expectations.json`. The measurement command does not rewrite that file. Change it only for an intentional visual change, then regenerate the JSON pin and review both diffs. Do not refresh either file only to make a check pass.

Hosted CI is manual. The local evidence for this pin is `npm run lint`, `npm test`, `npm run typecheck`, and `npm run build`.

## Recorded on 2026-10-12

Measured commit `db28037ecf81356722f9bcad2822c1ee033daaa7`. The worktree was dirty because these baseline files were not committed yet. Node v22.14.0, npm 10.9.7, linux x64. `npm run build` exited 0 before the pin. The manifest still marks `buildSuccess` as `not-applicable` because the measurement script only reads `dist`.

| Claim | Result |
| --- | --- |
| Field expectations, export declarations, density overrides, palette-order invariance, stale-draft rejection | pass |
| Selected handoff guards and existing site byte budgets | pass |
| Contrast pairs across 48 styles | recorded: 510 pass, 70 fail, 140 needs-rendered-review, 48 not-applicable |
| Entry JS gzip level 9 | 143,554 B |
| Home / color / typography / compare / handoff JS closures, gzip level 9 | 226,406 / 183,388 / 189,200 / 182,587 / 188,283 B |
| All JS / all CSS gzip level 9 | 1,005,272 / 247,199 B |
| Global CSS font families | 0 |
| Initial document subresources | entry script, JSX runtime and style preloads, one CSS file, favicon. No font file |
| Home English font families from source | Inter, Space Grotesk, IBM Plex Mono. Catalog demo families: 24 |
| Selected handoff maximum | 24,703 B JSON, 25,990 B prompt, 6,498 `utf8-bytes-div-4/v1` units |
| Legacy slim discovery document | 271,356 B. This is the catalog index, not a selected handoff |
| In-process brutalist resolve/export/prompt | informational: first call 9.769 ms, warm median 4.147 ms, warm p95 5.234 ms |
| Cold/warm browser transfer, interaction timing, allocation, screenshots, live model | not-run |

Vite's own gzip column is not this table. These JS and CSS figures use gzip level 9 per file.

## What is pinned

- Commit, dirty paths, Node, npm, lockfile hash, OS, and CPU. Dirty paths describe the worktree at capture. They are not a reason to delete the flag.
- Content hashes for every style in English, Korean, and Japanese.
- Field values for the smoke set: `brutalist-grid`, `editorial-silence`, `runtime-signal`, `glass-orbit`, `cyberpunk-glitch`, and `midnight-noir`.
- Known current discrepancies, including the `brutalist-grid` palette whose last swatch is still the red accent while resolved text is `#111`.
- Selected-handoff bytes, SHA-256, duplicate strings, embedded URL hosts, and `utf8-bytes-div-4/v1` token estimates.
- Source-derived font families for home, color, typography, compare, and handoff. Initial home English lists Inter, Space Grotesk, and IBM Plex Mono, not every catalog family.
- Production gzip sizes and the existing site budgets in `docs/quality-budgets.json`.

## What stays not-run

Cold and warm browser transfer, interaction and long-task timing, allocation, rendered screenshot review, and live model comparison stay `not-run`. Static gzip sizes are not transfer logs. The in-process resolve/export timer is informational and is not a pass/fail gate. `utf8-bytes-div-4/v1` is not a provider tokenizer and is not a billing figure.

`npm run quality:ai` prepares an opt-in evaluation and does not call a model. Leave it `not-run` when credentials or budget are absent.

Contrast counts are `recorded`. A contrast total is not build success and not a visual-preference result.

## Mutation checks

`scripts/__tests__/qualityBaseline.test.ts` injects swapped brutalist text/accent, removed line-height and tracking declarations, an ignored compact density, a stale draft export, and a full-catalog payload. Each injection must produce a violation. The current resolver, export, and draft parser are checked against the uninjected values.

## Update a pin

1. Record the command, commit, and whether the worktree was dirty.
2. Say which claim changed: contract fields, handoff bytes, font inventory, or on-disk assets.
3. Update the field fixture only for an intended visual change.
4. Run `npm run build` and `npm run quality:baseline`.
5. Review the JSON diff. A larger artifact needs a written fidelity or compatibility reason. Do not widen `docs/quality-budgets.json` in the same unreviewed edit.
6. Keep `not-run` claims `not-run` until their own evidence exists.
