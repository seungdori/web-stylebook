# Local design draft

The participating tools use `src/visual/workspace.ts` and `useDesignWorkspace.ts`. The selected style, colors, typography, comparison sources, preview language, private copy, project brief, and refinement locks belong to one draft. The resolved visual contract is derived from that draft; generated prompts and the full catalog are not persisted.

## State and actions

The storage key is `webstylebook.design-draft`. Schema version 1 validates allowlisted fields, known style IDs, the current authored contract revision, supported modes, and the resolved result. A serialized draft is limited to 96,000 characters. In-memory undo keeps at most 20 accepted semantic revisions.

- `selectStyle` explicitly changes the primary style and resets its visual overrides, axis sources, and accepted repairs. It retains the project brief, preview copy/language, and refinement context.
- `requestStyleSelection` handles incoming `stylePreset` links. An unmodified draft can select the linked style immediately. A modified draft retains all values and offers Apply linked style or Keep current design. Unknown IDs produce a visible message.
- `requestStylePreset` also supports old comma-delimited multi-style links. All known IDs are retained as bounded `referencedStyleIds`; the first is the primary style and the first two populate comparison. The interface explains that reference styles are not automatically merged. Changed primary selection uses the same Apply/Keep conflict, and exports carry only the reference IDs.
- `setColorRole`, `setTypographyRole`, and `setOverrides` merge validated changes. Color edits retain independent contrast repairs; stale repair proposals are discarded and can be proposed again by the editor. Changing color mode clears prior repair decisions.
- `applyAxis` uses the same override allowlist as comparison previews. Color imports roles, typography imports roles and font metadata, and density imports exact spacing while removing a conflicting density preset. Comparison URL parameters only configure the comparison; they never apply a style.
- `requestComparisonSelection` imports validated `left`, `right`, `mode`, `axis`, `layout`, and `fixture` query values on initial load and browser back/forward. Legacy links with `left` or `right` and no explicit `mode` retain the original-example view. An explicit new `mode` wins over that legacy default; invalid values leave the current comparison and primary design unchanged with a visible message. Those parameters describe the comparison only. They do not select the working style or apply an axis.
- The compare page rewrites that allowlist onto the current history entry when it opens, then adds one history entry for each later discrete comparison or fixture change. Back and forward restore the whole selection snapshot. Color, typography, preview copy, and project text are not query parameters and do not create history entries. A single `stylePreset` already in the URL is updated in place after the committed style changes, so reload does not offer the stale link again. Comma-separated legacy presets are left unchanged.
- `resetAxis` removes that axis's overrides and source, leaving the others intact. `resetToAuthored` removes all visual adjustments but retains the brief and copy. `undo` restores the previous accepted values with a new monotonic local revision. `resetDraft` starts the documented initial draft: Brutalist Grid, native color mode, English preview content, product fixture, and an empty brief.

First-time initialization uses the current UI language for preview content. Once a draft exists, UI language changes do not change its preview language or text. Users change the preview language explicitly in an editor. Canonical, localized, and legacy `.html` tool routes share the same origin-local storage. Plain URLs do not carry local edits; exports do.

## Persistence and recovery

Committed edits update the in-memory draft synchronously. Persistence batches them over 150 ms; document link clicks, language changes, page hiding, and export flush the latest committed values synchronously. Text buffers that have not passed editor validation stay outside the committed draft. No per-keystroke history URLs or model requests are involved.

The pre-release schema version 0 shape (`selectedStyleId`, optional `overrides` and `contentLocale`) migrates explicitly. Malformed JSON, unknown fields/IDs, unsupported versions/modes, and stale authored revisions do not silently migrate. The original serialized value remains in storage and is available as a recovery download. The user can continue editing a separate in-memory draft. Starting again copies the original into the `.recovery` key when storage permits.

Denied storage and quota errors leave the editor usable and display a message to export before leaving. The browser receives a before-unload warning when modified data cannot be flushed. This does not provide storage across browsers, origins, or devices.

Text zoom is issue #14. Cross-origin and cross-device copies stay out of scope because the only stored draft is the origin-local key `webstylebook.design-draft`.

Every flush compares the persisted value with the last observed value. A different write, including one received through a storage event, stops persistence and exposes Load other tab’s version and Keep this tab’s version. Neither choice is automatic. Loading another version can be undone; keeping this tab creates a revision newer than both versions. Invalid remote versions go through the same recovery flow.

## Verification

`npm run test -- scripts/__tests__/workspace.test.ts` covers selection/edit/axis/reload continuity, final-value flushing, batching, comparison-link precedence, undo and reset boundaries, localized/legacy routes, repair invalidation, migration, corrupt/stale data retention, denied storage, and concurrent writes. These deterministic store tests complement browser checks of the integrated editor and export flow; they do not claim rendered or downstream AI-output quality.

`npm run quality:browser` is the browser proof of the two-tab choice, blocked storage, and quota. The unit tests stay the complement. The command writes `output/playwright/webstylebook-fidelity/browser-smoke/report.json`.
