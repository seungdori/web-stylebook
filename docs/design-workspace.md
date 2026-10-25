# Local design draft

The participating tools use `src/visual/workspace.ts` and `useDesignWorkspace.ts`. The selected style, colors, typography, comparison sources, preview language, private copy, project brief, and refinement locks belong to one draft. The resolved visual contract is derived from that draft; generated prompts and the full catalog are not persisted.

## State and actions

The storage key is `webstylebook.design-draft`. Schema version 1 validates allowlisted fields, known style IDs, supported modes, and the resolved result. A draft saved against an older authored contract revision moves onto the current one when it is read. A serialized draft is limited to 96,000 characters. In-memory undo keeps at most 20 accepted semantic revisions.

- `selectStyle` explicitly changes the primary style and resets its visual overrides, axis sources, and accepted repairs. It retains the project brief, preview copy/language, and refinement context.
- `requestStyleSelection` handles incoming `stylePreset` links. An unmodified draft can select the linked style immediately. A modified draft retains all values and offers Apply linked style or Keep current design. Unknown IDs produce a visible message.
- `requestStylePreset` also supports old comma-delimited multi-style links. All known IDs are retained as bounded `referencedStyleIds`; the first is the primary style and the first two populate comparison. The interface explains that reference styles are not automatically merged. Changed primary selection uses the same Apply/Keep conflict, and exports carry only the reference IDs.
- `setColorRole`, `setTypographyRole`, and `setOverrides` merge validated changes. Color edits retain independent contrast repairs; stale repair proposals are discarded and can be proposed again by the editor. Changing color mode clears prior repair decisions.
- `applyAxis` uses the same override allowlist as comparison previews. Color imports roles, typography imports roles and font metadata, and density imports exact spacing while removing a conflicting density preset. Comparison URL parameters only configure the comparison; they never apply a style.
- `requestComparisonSelection` imports validated `left`, `right`, `mode`, `axis`, `layout`, and `fixture` query values on initial load and browser back/forward. Legacy links with `left` or `right` and no explicit `mode` retain the original-example view. An explicit new `mode` wins over that legacy default; invalid values leave the current comparison and primary design unchanged with a visible message. Those parameters describe the comparison only. They do not select the working style or apply an axis.
- The compare page rewrites that allowlist onto the current history entry when it opens, then adds one history entry for each later discrete comparison or fixture change. Back and forward restore the whole selection snapshot. Color, typography, preview copy, and project text are not query parameters and do not create history entries. A single `stylePreset` already in the URL is updated in place after the committed style changes, so reload does not offer the stale link again. Comma-separated legacy presets are left unchanged.
- `resetAxis` removes that axis's overrides and source, leaving the others intact. `resetToAuthored` removes all visual adjustments but retains the brief and copy. `undo` restores the previous accepted values with a new monotonic local revision. `resetDraft` starts the documented initial draft: Brutalist Grid, native color mode, English preview content, product fixture, and an empty brief.

First-time initialization uses the current UI language for preview content. Once a draft exists, UI language changes do not change its preview language or text. Users change the preview language explicitly in an editor. Canonical, localized, and legacy `.html` tool routes share the same origin-local storage. Plain URLs do not carry local edits; exports do.

## Saving

The draft saves itself, and the reader never has to think about saving. No save state, save notice, recovery prompt, or leave warning is shown.

- Each committed edit is written to storage synchronously, so a reload, a link, a language change, or closing the tab needs no save step. Text buffers that have not passed editor validation stay outside the committed draft. No per-keystroke history URLs or model requests are involved.
- Every tab shows the same draft. A write from another tab arrives as a storage event and replaces this tab's view; this tab's inputs re-sync, and `undo` steps back to what it showed before. An unreadable write from elsewhere is ignored and replaced by this tab's next edit.
- If storage is denied, full, or the draft is over 96,000 characters, editing continues in the tab. The latest complete draft stays in storage. The failure is one `console.warn` line per kind, not a message to the reader.

## Reading a saved draft

The pre-release schema version 0 shape (`selectedStyleId`, optional `overrides` and `contentLocale`) migrates explicitly, as do legacy refinement evidence kinds.

A draft saved against an older catalog revision keeps its values on the current revision. Contrast repairs that no longer resolve are dropped. A refinement baseline captured against the old revision is dropped together with its change decisions; the rest of the brief stays. A stale revision is never exported.

Malformed JSON, unknown fields or IDs, unsupported versions, and drafts that do not resolve start a new draft without a prompt. The unreadable value is copied to `webstylebook.design-draft.recovery` before the next write replaces it, and the console notes the reason. The value itself is not logged.

Cross-origin and cross-device copies stay out of scope because the only stored draft is the origin-local key `webstylebook.design-draft`.

## Verification

`npm run test -- scripts/__tests__/workspace.test.ts` covers selection/edit/axis/reload continuity, immediate writes, comparison-link precedence, undo and reset boundaries, localized/legacy routes, repair invalidation, migration, catalog-revision carry-over, unreadable drafts set aside, denied storage, and following another tab. These deterministic store tests complement browser checks of the integrated editor and export flow; they do not claim rendered or downstream AI-output quality.

`npm run quality:browser` is the browser proof that two tabs follow each other, that blocked storage and a full quota keep editing without a notice or a leave warning, and that reload keeps the latest saved draft. The unit tests stay the complement. The command writes `output/playwright/webstylebook-fidelity/browser-smoke/report.json`.
