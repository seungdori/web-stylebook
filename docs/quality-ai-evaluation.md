# Matched AI handoff evaluation (opt-in, offline)

This protocol tests whether a changed handoff preserves the intended design better than the previous handoff. It does not infer quality from prompt size, token coverage, or an aggregate aesthetics score. The default experiment contains six materially different product briefs and three repetitions per brief: **18 matched pairs / 36 planned generations**.

`scripts/quality-ai-evaluation.mts` only prepares local input snapshots, records results that already exist, and reports denominators. It never calls a model, executes generated code, accesses the network, installs dependencies, or spends a budget. Preparing an experiment leaves every run `not-run`; do not describe it as an executed AI evaluation. Model execution remains an explicit, separately authorized activity.

## Freeze the comparison

Before preparation, choose:

- One model and a pinned provider model version. Aliases such as `latest` are not accepted. If the provider does not expose a reproducible version, state that limitation in the declared version and the final interpretation.
- One full 40-character starter commit. Verify that its dependency lockfile and working React/TypeScript/Vite Deskline support app satisfy every requirement in `scripts/quality-fixtures.json`. This is an existing application, not an empty shell: Tickets and Settings routes, navigation, searchable/filterable data, a drawer, and a working validation/save flow must already be present. Save baseline screenshots and behavior evidence before any generation. Every fixture and arm starts from that same clean commit, with no previous generated files or conversation history.
- Exact baseline and improved handoff files, including any user adjustments. Preserve both as originally emitted; do not shorten or repair only one condition. For a comparison across several styles, prepare a separate experiment per style and retain all experiments.
- Identical declared generation settings in a JSON file, including temperature, seed support, tool access, maximum turns, and any provider controls. Explicitly write `"unsupported"` for unsupported controls. Use the same seed for both members of a pair when supported, varying seeds across repetitions. Without reproducible seeds, disclose sampling variance.
- An explicit experiment cost ceiling, total token ceiling, and per-run output token ceiling. These are planning metadata, not a spending authorization. The separate runner must enforce them, stop when exhausted, and leave remaining runs `not-run`. The report flags observed overages without deleting them.

The six fixed briefs cover operational SaaS, developer tooling, editorial reading, product presentation, consumer commerce, and narrow refinement of an existing project. Mixed English, Korean, Japanese, Latin product names, and numerals are included in the editorial fixture. Each brief has explicit starter state, allowed changes, locked scope, and behavior requirements. Five fixtures may replace the starter's product UI. The refinement fixture edits the real existing Deskline interface while preserving its layout, copy, data, routes, and behaviors; generating a similar-looking replacement does not satisfy preservation. Avoid changing a brief or starter after seeing its outputs.

The starter is supplied by the experiment owner; this bookkeeping tool does not create or validate it. Before executing any model, confirm that the actual pinned commit contains the specified initial interface and known defects. Record both-route behavior and both-viewport screenshots. If it does not, prepare an appropriate starter commit first and start a new experiment with that same commit across all six fixtures. A fixture description alone is not evidence that an existing interface was present or preserved.

## Prepare

Create an external experiment parent directory. Keep generated outputs out of source control unless intentionally attaching review evidence. For example, after saving the two handoffs and a settings file:

```sh
npx tsx scripts/quality-ai-evaluation.mts prepare \
  --out /tmp/stylebook-evaluation-01 \
  --model YOUR_MODEL \
  --model-version YOUR_PINNED_VERSION \
  --starter-commit FULL_40_CHARACTER_COMMIT \
  --baseline-handoff /absolute/path/baseline-handoff.md \
  --improved-handoff /absolute/path/improved-handoff.md \
  --settings /absolute/path/generation-settings.json \
  --budget-usd 12 \
  --budget-tokens 500000 \
  --max-output-tokens 8000 \
  --runs 3
```

The amounts are example metadata, not a price estimate or recommended spend. Repetitions default to three and are bounded to 3–20. A directory that already exists is rejected, so preparation cannot replace a previous experiment. The manifest records the model, version, full starter commit, settings, budgets, and SHA-256 hashes of the exact handoffs, fixture snapshot, and per-run prompts. `results.json` is initialized with every planned run.

Example settings (replace values with the actual runner configuration):

```json
{
  "temperature": 0.2,
  "seedSupport": "unsupported",
  "tools": "local starter files and local build only; no network",
  "maxTurns": 1,
  "reasoningEffort": "medium"
}
```

## Execute and assess separately

Use the prepared prompt files verbatim in the manifest order; baseline/improved order alternates across pairs. Match model settings, starter state, output budget, allowed tools, and viewport conditions. Do not add helpful context to only one arm. Save every attempted output, including truncations, build failures, and unusable generations. A retry is a separate experiment; it cannot replace a failed attempt here.

For every attempted run, retain the generated source or patch, provider response/usage, build output, desktop and mobile screenshots, and behavior/accessibility observations. Do not expose API keys or private data in evidence. Run generated code only in the execution environment chosen for that authorized evaluation; this harness does not execute it.

Assess the output against the brief, declared change scope, and intended design reference. When practical, hide the arm label from reviewers. Use `pass`, `fail`, `not-assessed`, or `not-applicable` **with concrete evidence or an applicability rationale for every dimension**:

| Dimension | Question and evidence |
| --- | --- |
| `briefFidelity` | Are the required content, fixture data, and actions present? Cite the requirement and observation. |
| `colorRoles` | Are background, text, surface, and action roles preserved? Cite actual rendered pairs and measured contrast where applicable. |
| `typography` | Are role hierarchy, readable width, line-height, and fallback behavior retained, including required languages? |
| `layoutHierarchy` | Does placement and emphasis support the fixture's task on both viewports? Cite screenshot regions. |
| `interactionStates` | Do the fixture's acceptance behaviors and relevant error/empty/selected states work? Cite an observed interaction. |
| `accessibility` | Do keyboard operation, focus, names, contrast, and reduced motion meet the applicable checks? List what was actually checked. |
| `responsiveBehavior` | Is required content and functionality usable at 1440×900 and 390×844 without clipping or blocked actions? |
| `styleFidelity` | Does the output preserve the intended style's authored characteristics? Cite the reference and the corresponding rendered evidence; avoid an unexplained beauty score. |
| `preservationOfLockedScope` | For the existing-project refinement, do source diff, before/after screenshots, and behavior checks prove that every locked item is preserved? Full redesign or replacement fails this dimension even if the result looks polished. Use `not-applicable` with the fixture's empty-lock rationale for the five replacement fixtures. |

Use `not-assessed` when evidence is missing. Use `not-applicable` only when a dimension does not apply to the frozen fixture, explaining why; it must not hide a failure or missing evidence. A build failure usually leaves applicable visual dimensions unassessed; retain the build failure as the run outcome. A partially usable failed output can still have dimension findings if those findings have evidence. A `succeeded` run means generation/build completed, not that all dimensions passed. For refinement, judge color/style fidelity against the allowed changes and preserved existing reference; do not reward unrestricted restyling.

## Record existing results

Each result must identify a planned `runId`, the manifest's model/version and starter commit, and the exact prompt and generation-settings hashes. The settings hash attests that the recorded run used the frozen settings; verify it against the runner configuration before recording. Provide all nine assessment keys. Example shape (replace every placeholder with real evidence):

```json
{
  "runId": "editorial-reading--r1--baseline",
  "status": "failed",
  "model": "YOUR_MODEL",
  "modelVersion": "YOUR_PINNED_VERSION",
  "starterCommit": "FULL_40_CHARACTER_COMMIT",
  "promptSha256": "FULL_64_CHARACTER_PROMPT_SHA256_FROM_MANIFEST",
  "generationSettingsSha256": "FULL_64_CHARACTER_SETTINGS_SHA256_FROM_MANIFEST",
  "measurements": { "inputTokens": null, "outputTokens": null, "costUsd": null, "elapsedMs": 12500 },
  "artifacts": ["/absolute/path/output.patch", "/absolute/path/build.log"],
  "failureReason": "Build failed: include the observed error and log location.",
  "assessments": {
    "briefFidelity": { "outcome": "not-assessed", "evidence": "Build failed before behavior could be checked." },
    "colorRoles": { "outcome": "not-assessed", "evidence": "No rendered page." },
    "typography": { "outcome": "not-assessed", "evidence": "No rendered page." },
    "layoutHierarchy": { "outcome": "not-assessed", "evidence": "No rendered page." },
    "interactionStates": { "outcome": "not-assessed", "evidence": "No rendered page." },
    "accessibility": { "outcome": "not-assessed", "evidence": "No rendered page." },
    "responsiveBehavior": { "outcome": "not-assessed", "evidence": "No rendered page." },
    "styleFidelity": { "outcome": "not-assessed", "evidence": "No rendered page." },
    "preservationOfLockedScope": { "outcome": "not-applicable", "evidence": "The editorial fixture explicitly allows replacing the existing product UI and has no locked product scope." }
  }
}
```

Use `null` for unknown usage, never zero. Successful results require an artifact and an empty `failureReason`. Failed results require a reason, including transport failures that produced no artifact. Input snapshots and hashes are checked again before recording and reporting.

```sh
npx tsx scripts/quality-ai-evaluation.mts record \
  --manifest /tmp/stylebook-evaluation-01/manifest.json \
  --result /absolute/path/recorded-result.json
npx tsx scripts/quality-ai-evaluation.mts report \
  --manifest /tmp/stylebook-evaluation-01/manifest.json
```

Recording is single-writer bookkeeping: invoke it sequentially, and keep the evidence files. A recorded terminal result cannot be overwritten. Never hand-edit `results.json` to remove failures or shrink the denominator.

## Interpret the report

Report the fixed planned count, successful/failed/not-run counts per arm and fixture, pairs with both outcomes, pairs where both succeeded, and each dimension's comparable and missing counts. Paired dimension outcomes are listed separately: improved pass/baseline fail, baseline pass/improved fail, both pass, and both fail. Both-not-applicable pairs and applicability disagreements are counted separately from missing evidence and retained in the planned denominator. Investigate disagreements rather than treating them as improvements. No outcomes are summed into an aesthetics score.

Always include failed generations and unassessed pairs in the reported denominator. A `complete` report only means every planned run was recorded; it does not mean all outputs succeeded, all dimensions were assessed, or improvement was established. Known spend/token totals are lower bounds if any usage is missing. With only three repetitions per brief, treat results as limited evidence and show fixture-specific examples instead of claiming statistical certainty or general model superiority. Preserve contradictory findings and reviewer disagreements in the evidence notes.
