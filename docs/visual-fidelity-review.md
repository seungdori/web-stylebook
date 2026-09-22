# Visual fidelity review and implementation decisions

Reviewed 22 September 2026 against the linked conversation, web-stylebook issues #3–11, MCP issue #1, and the actual repositories. Baselines: website `c6d037c`, MCP `2aee594`.

## Review outcome

The proposals address real information loss and disconnected workflows. The original Google article was read in a browser (the text-only fetch returned an empty app shell). Its live typography preview, same-logic visual variations, local element editing, and targeted refinement support the proposed direction. It does not establish that longer prompts improve generated UI quality.

Source: [Google AI Studio UI design guide](https://aistudio.google.com/learn/ai-ui-design-google-ai-studio), published 16 September 2026, observed 22 September 2026.

| Area | Current evidence | Decision |
| --- | --- | --- |
| Color roles (#4) | ColorSystem derives text from the last palette entry. Browser selection of Brutalist Grid sets both body text and accent to #d72600; the source uses #111111 for ink. | Replace positional inference with authored role data and explicit adjacency checks. Preserve identity colors; show proposed contrast repairs separately. |
| Typography (#5) | Style profiles are prose; family fallback loses selected style font relationships. | Store role-specific size, weight, tracking, leading, measure, responsive and locale rules; edit and preview the actual values. Load active fonts only. |
| Handoff and MCP (#6, MCP #1) | Independent page state and generic family compiler values diverge. CSS and theme drop line heights; explicit density loses to family row/gutter defaults. | One canonical artifact, versioned selected exports, shared semantic projection and verified cross-repository parity. Preserve legacy entry points explicitly. |
| Comparison (#7) | The original compare page shows different original iframe content. | Keep original examples and add controlled fixtures/isolated-axis comparisons; controlled fixtures do not represent complete original compositions. |
| Working design (#8) | Tools own independent state; stylePreset is only a partial handoff. | One validated persistent working design. Expose storage failure, stale data and tab conflicts; never claim a generic URL contains local edits. |
| Refinement (#9) | General implementation instructions do not bind allowed edits to an explicit baseline. | Export focused deltas and preserved axes; existing stack, content and logic remain preserved by default. Missing verification stays not-run. |
| Discovery (#10) | Home names styles with badges. Hardcoded editorial order is labeled popularity. | Use a working specimen, optional purpose filters grounded in current metadata, and curated ordering labels. Preserve the existing site identity and all original examples. |
| Evaluation (#11) | Baseline unit/build checks pass, but there is no matched generation benchmark. | Add deterministic parity, resource and browser checks plus a bounded paired-evaluation protocol. Report AI quality improvement only after actual repeated matched runs. |

## Design brief

The central task is choosing a design, adjusting only relevant values, and taking the same values into a project. The existing neutral shell remains; the specimen provides visual variety. Existing routes, EN/KO/JA support, original demos and their compositions remain relevant.

Opening structures considered: a full-width active specimen with compact controls; a gallery-first set of original thumbnails; an editorial explanation with a side comparison. Choose the active specimen because it exposes the actual choice immediately and works without decorative assets. This is the specific workflow improvement requested in #10, not a new site identity.

Typography, surface treatments and motion belong to selected contracts. The site shell retains its readable hierarchy. Forms retain invalid drafts visibly without exporting unsafe values. Real preview controls are keyboard accessible. Unsupported modes and unloaded fonts are reported honestly; an approximation is not advertised as an authored mode.

No new backend, model calls during editing, external screenshots, image generation, accounts or analytics are required. Existing source/license boundaries remain in effect. New shared reusable contract/resolver code is licensed separately from site-specific editorial content. Commit, push, npm publication and deployment are outside this implementation request.

## Verification discipline

Baseline builds and tests were captured in detached worktrees before implementation. Browser evidence is under `output/playwright/webstylebook-fidelity/`. Review screenshot baselines manually; do not auto-bless visual changes. Production build, localization, lint, tests, canonical generation/validation, MCP ingestion and selected output parity must pass. Live model quality evaluation remains explicitly not run until repeated paired output artifacts exist.
