# Canonical visual specification

The website and standalone MCP consume the same authored recipes and pure resolver. `src/visual/recipes.json` records inspected active renderer primitives for all 48 styles, including the separately imported Duotone and macOS stylesheets. The records distinguish absent declarations and source implementation mismatches from known values. Original pages keep their distinct compositions.

`getVisualContract(styleId)` returns the versioned source contract; `resolveVisualContract(styleId, options)` applies its supported mode, preview content locale, explicit overrides, and accepted repairs. The portable equivalent, `resolveContract(contract, options)`, accepts a validated catalog object and performs no network or browser calls. The MCP repository copies this exact runtime and checks SHA-256 source provenance; it does not maintain another recipe catalog.

## Roles and precedence

Colors name canvas, surfaces, text, borders, identity accent, primary and secondary actions, links, focus, and status. `actionPrimary` can differ from `accent`: the current Bento CTA uses sage while the identity accent is marigold; Pure Noir uses a white CTA and a gold accent. Palette arrays remain discovery swatches and never determine body text.

The resolver applies common recipe values → authored mode fields → locale reading adjustments → explicit overrides → explicitly accepted current repair proposals. A mode can override typography, spacing, surfaces, motion, or component rules, not just colors. Unsupported modes fail with the list of available modes. The existing Editorial Terminal light toggle still renders dark content; it is not advertised as an authored light recipe.

Source-derived fields and finite UI adaptations have separate per-field origins. Font availability metadata uses one `typography.fonts` group origin; each font retains its own source, license, weights and scripts without repeating origins for every metadata item. Supporting type roles, missing optional values, status colors and density rules are authored *adaptations* for the workbench; they are not presented as exact source declarations. Source notes identify gradients, translucency, proprietary/system faces, unusual title scales and unresolved CSS. Mode-specific materials are retained where represented. Compound gradient/backdrop effects still require comparison against the original rendered specimen.

Overrides accept strict named colors, typography role properties, exact spacing, font metadata and an optional density preset. Unsafe CSS, unknown fields, unsupported versions, reversed size bounds, stale revisions, and mismatched resolved hashes fail. `none` shadows and zero radii are intentional values. Individual user changes are never silently replaced to earn a passing contrast result.

## Typography and fonts

Display, heading, subheading, body, small, label, caption and numeric/data roles carry font stacks, weight/style, responsive endpoints, line-height, tracking, paragraph spacing, reading measure, transforms, wrapping and numeric features. Responsive interpolation is explicitly 320–1280 px; endpoint values that came from a specimen are identified separately from this workbench adaptation.

Korean and Japanese previews apply explicit script-appropriate fallback and reading adjustments, with origins preserved. The resolver removes incompatible CJK fallback faces from the selected locale's stack while preserving original Latin faces, so a Korean face cannot preempt Japanese shared Han glyphs. A single-weight heavy display face (`HEAVY_DISPLAY_FACES`, e.g. Archivo Black) is paired with a heavy CJK display face (`HEAVY_CJK_FALLBACKS`: Black Han Sans, Dela Gothic One) instead of the regular Noto family, because its CSS weight is 400 and a multi-weight fallback would render Hangul or Kana visibly thinner than the Latin face. Full font metadata remains available. Font metadata describes system dependence or an approved external provider; it never proves a font loaded. Verified font licenses live in `fontSources.ts`. The UI loads active faces and script fallbacks, and keeps load/error/substitution evidence separate from the contract. Unsupported declared weights are warnings; no font binary is redistributed.

## Contrast and repairs

Checks use the actual component foreground/background roles. Text checks use 4.5:1, large text and essential controls 3:1, and decorative separators are marked inapplicable. Ratios are compared before rounding. Transparent or backdrop-dependent backgrounds return `needs-rendered-review` rather than a pass. This is pair-level evidence, not an accessibility certification.

`proposeContrastRepairs(spec)` returns inert proposals. Only proposals explicitly passed as `acceptedRepairs` are applied; a stale proposal fails. The accepted values, origin, before/after and pair reason appear in the preview, CSS companion JSON and handoff.

## Identity, exports and distribution

`webstylebook.visual.v1` identifies the contract shape. The `fnv1a` 64-bit revision and resolved hash are deterministic local content identities, not cryptographic security checks. The generated catalog envelope and `visual-contracts.v1.json` transport use SHA-256. Export timestamps and UI language do not change a design's identity; preview content locale and accepted edits do.

The generated sidecar lives at `packages/mcp/generated/visual-contracts.v1.json`. Catalog generation and drift checks cover it alongside the legacy envelope and manifest. Every existing catalog style carries the additive `visualContract` field. CSS exports include documented compatibility aliases and require the self-contained JSON companion for provenance, font availability, components, obligations and repairs.

New portable files with an MIT SPDX header and the newly authored recipe data are made available for the companion package under the notice in `src/visual/LICENSE`. This does not change the website's CC BY-NC license, relicense legacy source or source artwork, or redistribute provider fonts. Numeric source observations and their provenance are included; new sidecar usage guidance does not copy the site's longer prose.
