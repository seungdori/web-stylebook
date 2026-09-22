# Quality and resource regression checks

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

Run `npm run quality:browser` after the production build. It starts and stops its own local preview server. Set `WEB_STYLEBOOK_BROWSER_URL` only to reuse an explicitly chosen server. The smoke runner invokes the pinned `agent-browser@0.38.1` CLI; on a fresh CI host first run `npx --yes agent-browser@0.38.1 install --with-deps`. The Node 20 CI job runs the browser smoke once and retains its report, failure evidence and screenshots under `output/playwright/webstylebook-fidelity/browser-smoke`. Model calls are never part of this job.

Use the same owned fixture renderer as comparison and typography. The fixed smoke set is `brutalist-grid`, `editorial-silence`, `runtime-signal`, `glass-orbit`, `cyberpunk-glitch`, and `midnight-noir`; cover native light/dark, English/Korean/Japanese, 390 px and 1440 px widths, and realistic long/empty/loading/error states supported by each surface. Exercise color/type edits, same-content axis comparison, reload/locale/back preservation, and copying the final edited handoff. The broader release matrix must cover every changed contract and every advertised native specimen. Avoid a full style × locale × width × state Cartesian product in every CI run.

Record cold/warm conditions, browser/version, viewport, DPR, reduced-motion state, font readiness/fallback and screenshot paths. Verify computed roles, overflow/clipping, keyboard focus, enlarged text and applicable contrast. Disable continuous animation and wait for font readiness before comparison captures. A changed pixel image requires human review of typography, hierarchy, composition and identity; neither an automatic screenshot update nor a contrast pass establishes that it looks better.

Browser transfer, interaction and live-model results start `not-run` in the resource manifest and remain so unless their actual evidence is attached separately. Never relabel them pass from static measurements. Root browser tests may produce their own manifest; retain and link both reports rather than overwrite evidence with an unrelated test result.

For matched downstream AI evaluation, use `quality-ai-evaluation.md`. It is opt-in, keeps failed runs and planned denominators, and does not run models or incur hidden recurring cost.
