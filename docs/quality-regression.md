# Quality and resource regression checks

The current-tree pin for issue #11 phase 1 is [quality-baseline.md](quality-baseline.md) and [quality-baseline-2026-10-12.json](quality-baseline-2026-10-12.json). It records this repository as it exists now. The 2026-09-22 files below remain the pre-change comparison and are not replaced by that pin.

Correct visual values, rendered usability, resource use, and downstream AI quality are separate claims. No aggregate design score is generated. A successful build or a compact handoff does not prove visual quality.

## Reproduce the pre-change baseline

The committed `quality-baseline-2026-09-22.json` was measured from detached, pinned source worktrees before implementation:

| Repository | Source revision | Existing verification |
| --- | --- | --- |
| Web Stylebook | `c6d037cb630969eb726b8e73b3c3af7360a95c6f` | Production build passed; 24 tests passed |
| Web Stylebook MCP | `2aee594646c0060588f164989638bcde8d5830b6` | Build passed; 207 tests passed |

Create two temporary worktrees outside the normal checkouts, install each lockfile with `npm ci`, then run each repository's `npm run build` and `npm test`. Run the current measurement script against the pinned directories:

```sh
npx tsx scripts/quality-measure.mts --site-root /tmp/site-baseline --mcp-root /tmp/mcp-baseline --output /tmp/baseline.json
```

The initial capture used the already-installed dependencies through `node_modules` symlinks. `source.dirty` is true in that capture because the symlink is untracked and the site's build regenerates the tracked sitemap's date fields. The application, catalog, package lock and compiler sources were the pinned revisions. Do not interpret the dirty flag as an unknown implementation baseline or silently strip it from future reports. Full dependency/platform details are recorded by the lockfiles and the manifest's environment block.

The baseline's on-disk production entry JS is 79,875 bytes with gzip level 9; all lazy JS chunks total 944,130 compressed bytes, all CSS totals 241,230, the legacy slim handoff is 270,062 uncompressed bytes, and the MCP tarball is 920,576 bytes. These are artifact measurements, not browser transfer sizes. The global CSS requested definitions for 27 font families; that does not mean the browser downloaded every font file. Network measurements must distinguish definitions, actual font requests, and active font readiness.

Known baseline defects are the positional `brutalist-grid` text/accent mapping, family-level type substitution, universal shadow fallback, ignored explicit density where a family default exists, missing line-height/theme information, and tool state that does not preserve selected edits through export. The tests for their repaired paths are field-level contract, export, workspace and MCP tests. A compact old output is not evidence of greater fidelity.

## Run the implementation gates

```sh
npm run typecheck
npm run lint
npm run i18n:check
npm test
npm run mcp:catalog
npm run mcp:catalog:check
npm run mcp:catalog:validate
npm run build
npx tsx scripts/quality-measure.mts --check --scope site --output /tmp/site-quality.json
```

For the companion repository, generate/sync its canonical catalog and build it, then add `--mcp-root /path/to/web-stylebook-mcp --scope all`. This also runs a local `npm pack --dry-run --ignore-scripts --json`; it never publishes. The selected-response guard deliberately rejects full reference/ontology/principle domains, multiple catalog styles and all-language dictionaries. Mutation tests prove these injections fail.

Run `npm run quality:parity -- --mcp-root /path/to/web-stylebook-mcp --output /tmp/visual-parity.json` after both builds. It checks every style, authored mode and content locale, with default values and edited color/type/density. The website resolver, browser handoff builder, generated static artifact, MCP structured/JSON output and CSS output must agree. Independent `brutalist-grid` ink/accent and explicit override anchors prevent a shared value error from being accepted solely because two wrappers agree. Actual computed browser styles and font readiness remain browser tests.

Compact JSON rendering and grouped origins remove avoidable repetition without deleting provenance or repairs. The reviewed JSON composed-result cap is 48 KB. The actual in-memory MCP `CallToolResult` also includes a text fallback: the final measured maximum was 72,488 bytes, with 22,759 bytes of text, so the separately reviewed JSON envelope/text caps are 76 KB/24 KB. The initial 72 KB draft ceiling was 488 bytes short after the final source/repair metadata was retained in text fallback; the review preserved the metadata and recorded the larger ceiling. Across 48 styles × 3 locales × 4 formats (576 calls), the final maxima were 108,560 envelope bytes and 38,798 text bytes; separately reviewed all-format caps are 112 KB/40 KB. Theme output contains role styles and a metadata companion; CSS text-only clients receive the current edited companion as well. Only the small JSON-RPC transport wrapper is excluded. Each sample makes one tool call and does not fetch its linked style resource; client behavior determines which representations enter model context. Website static selected handoffs remain 32 KB, with a separate 34 KB prompt cap for their short implementation preface. These new typed outputs are semantically different from the old global discovery index, so their size difference alone is not an effectiveness claim.

`quality-budgets.json` records explicit byte budgets and their rationale. Missing required measurements are `not-run` and fail the requested gate. The site-only CI run does not claim MCP parity or package validation. Do not raise a threshold just to make a run pass: preserve the failing report, identify the source of growth, and obtain a review of the revised budget and benefit. Values for typed color/type/provenance fields are necessary feature growth; duplicated full catalogs are not.

The first full implementation changed the home route's static JavaScript module closure from 149,051 to 224,336 gzip bytes (+50.5%), while all lazy JavaScript grew 5.9%. The shared synchronous resolver, validated persistent workspace and working specimen add real initial code cost and move some previously lazy code into the entry. This is not a performance improvement. The reviewed absolute caps are 160 KB for the entry, 250 KB for the home module closure and 210 KB for each editor/compare/handoff closure. Dependency closure is parsed from actual static import/export declarations using the installed TypeScript compiler, including entry and route modules; dynamic feature modules, CSS, font and media transfer remain excluded. This avoids treating a mere change in Vite chunk boundaries as an improvement or a regression.

Node composition measurements distinguish the first call after module import from 200 warm calls after 20 warmups. They are lab microbenchmarks, not cold browser startup, user latency or field performance. They are informational because a sub-millisecond hard CI gate is too sensitive to platform and scheduler noise. Uninstrumented heap deltas are not reported as allocation measurements.

The `utf8-bytes-div-4/v1` context estimate is only a reproducible rough size proxy. Actual model tokenization is explicitly `not-run`; report the model's named tokenizer and exact library version when an external matched evaluation supplies real token counts. Do not use this proxy for billing.

## Browser matrix and intentional visual changes

Run `npm run quality:browser` after the production build. It starts and stops its own local preview server. Set `WEB_STYLEBOOK_BROWSER_URL` only to reuse an explicitly chosen server. The smoke runner invokes the pinned `agent-browser@0.38.1` CLI; on a fresh CI host first run `npx --yes agent-browser@0.38.1 install --with-deps`. The Node 20 CI job runs the browser smoke once and retains its report, failure evidence and screenshots under `output/playwright/webstylebook-fidelity/browser-smoke`. Model calls are never part of this job. `npm run quality:browser` does not change page zoom. Text zoom, approved pixel baselines, and the font-request audit are `npm run quality:visual`.

Use the same owned fixture renderer as comparison and typography. The fixed smoke set is `brutalist-grid`, `editorial-silence`, `runtime-signal`, `glass-orbit`, `cyberpunk-glitch`, and `midnight-noir`; cover native light/dark, English/Korean/Japanese, 390 px and 1440 px widths, and realistic long/empty/loading/error states supported by each surface. Exercise color/type edits, same-content axis comparison, reload/locale/back preservation, and copying the final edited handoff. The broader release matrix must cover every changed contract and every advertised native specimen. Avoid a full style × locale × width × state Cartesian product in every CI run.

Record cold/warm conditions, browser/version, viewport, DPR, reduced-motion state, font readiness/fallback and screenshot paths. Verify computed roles, overflow/clipping, keyboard focus, enlarged text and applicable contrast. Disable continuous animation and wait for font readiness before comparison captures. A changed pixel image requires human review of typography, hierarchy, composition and identity; neither an automatic screenshot update nor a contrast pass establishes that it looks better.

Browser transfer, interaction and live-model results start `not-run` in the resource manifest and remain so unless their actual evidence is attached separately. Never relabel them pass from static measurements. Root browser tests may produce their own manifest; retain and link both reports rather than overwrite evidence with an unrelated test result.

## Approved pixel baselines, text zoom, and font requests

`npm run quality:visual` is a browser gate. It is not part of `npm test`. Run it after `npm run build`. On a fresh machine, install the same browser the smoke gate uses first: `npx --yes agent-browser@0.38.1 install --with-deps`. The command starts and stops its own preview on `http://127.0.0.1:4176` unless `WEB_STYLEBOOK_BROWSER_URL` is already set. The hosted workflow runs it on Node 20 after the browser install and the production build, and uploads `output/playwright/webstylebook-fidelity/visual`.

The pinned baselines live in `docs/visual-baselines/`. Each capture is cropped from a full-page screenshot at device scale 1. An element screenshot of a target below the fold, or taller than the viewport, comes back as one flat color, so the crop uses the element's document box. The targets are the preview element, not the whole page: Color System (`.color-role-preview`) and the typography specimen plus role ladder, in en/ko/ja, at 320, 390, and 1440 CSS pixels. The same-content comparison specimens deferred from #7 are the editorial, utility, and expressive pairs at those widths. The manifest records the source revision, `agent-browser@0.38.1`, the Chrome version, and each viewport. Device scale is 1. Captures wait until `document.fonts.load` / `document.fonts.check` accept the same descriptors and probe strings as the typography FontFaceSet gate, with animation, transitions, and the caret turned off. Text inside the captured element is then repinned to network `url()` faces under private `WSBCapture` names, so a generic family, a `local()` source, or the host fontconfig cannot paint it. A spacer moves the target onto a whole pixel before the crop, because text outside the target can still leave it on a fraction. Hangul and Japanese load Noto Sans KR or Noto Sans JP, and leftover symbols load Noto Sans Symbols 2. The capture throws if a painted character sits outside those loaded ranges. Form controls in the capture drop native appearance so their text uses the same faces. Chrome is launched with grayscale hinting, no subpixel positioning, and an sRGB profile so two runs on this browser build match.

`pixelmatch` counts a pixel only when its OKLab distance is above `0.1`. Anti-aliased pixels are ignored. Any counted pixel fails. `npm run quality:visual:update` rewrites the PNGs, the manifest, and the font report. That command is the approval path. A green check does not mean the new picture is a better design. Do not raise `0.1` or the zero-pixel allowance to hide a diff.

Text zoom is 200% of the CSS initial 16px (`html { font-size: 32px }`). agent-browser 0.38.1 cannot set Chrome's browser zoom, and the site's type is in rem, so this is the harness equivalent. The check covers home, Color System, typography, compare, and prompt workflow at 1440 and 390 CSS pixels. It fails on horizontal overflow, a clipped control, clipped control text, or overlapping controls.

`docs/visual-baselines/font-network.json` lists each first load's font faces with family, weight, and response bytes. The audit waits until the page has painted, including text below the fold, and records the font files that paint requested. It does not call `document.fonts.load` with the screenshot gate's latin probe: that sample fetches a unicode-range file the page text never paints, and the request is not ordered with the log. Chrome's HTTP cache is off for the same reason. A variable file listed at several weights is one face spanning those weights, so a later stylesheet cannot rename it. A unicode-range file counts only when a painted character of that family falls in the range. Chrome sometimes prefetches the latin subset of a CJK face the page never paints; that file must not change the report or become its own failure. A page fails when it downloads a face or stylesheet family it does not render, or when one page requests every family in `routeFontQueries`. Bytes are the font file and stylesheet the browser asked for. The check fails if that set changes. Update the report only through `quality:visual:update`. Compare and the prompt workflow do not request IBM Plex Mono in the first shell load: those pages do not paint it. The prompt code block requests that face when its disclosure opens. A specimen face is requested only for scripts present in the text that role paints.

Per-style hand-tuned type scales and calmer or more expressive presets stay in #14.

For matched downstream AI evaluation, use `quality-ai-evaluation.md`. It is opt-in, keeps failed runs and planned denominators, and does not run models or incur hidden recurring cost.

## Phase 2 contract literals and the local resource guard

`scripts/fixtures/quality-contract/style-fields.json` holds reviewed field literals for every current style, every authored mode, and English, Korean, and Japanese. The published static file remains the default mode. `scripts/__tests__/qualityContract.test.ts` compares one browser resolution, its CSS and JSON export, `resolveStaticSelectedSpec`, the in-memory static handoff, and `dist/agent-handoff/{styleId}.{locale}.json` to those literals. It does not treat agreement between two wrappers as the expected value. Palette order, explicit `none`/zero tokens, authored tracking, content locale, and UI-language specimen copy are separate assertions. `scripts/fixtures/quality-contract/override-expectations.json` is hand-written. A migrated v0 draft must export its saved color; a stale `contractRevision` is not exported.

`scripts/generate-style-field-expectations.mts --write` rewrites the all-style literals from the current resolver. Run it only for an intentional visual change, then review the JSON diff. `quality:baseline` does not rewrite it, and the phase-1 pin in `quality-baseline-2026-10-12.json` stays the budget record. Do not raise `docs/quality-budgets.json` to absorb this gate.

`scripts/__tests__/qualityResource.test.ts` counts a first specimen font load separately from later color edits, density switches, and CSS/JSON export. A warm phase fails on a font download, a catalog or reference fetch, or a model URL. An offline stylesheet stays `error` / `load-failed`, and the export still contains the authored tokens. `npm run quality:browser` repeats that split on the home page, the color editor, and a compare axis switch. The first view may request the active faces. The warm edit must not. MCP format parity, including density-override and line-height cases, stays in `seungdori/web-stylebook-mcp#1`.
