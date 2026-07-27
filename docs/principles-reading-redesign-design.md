# Principles pages — reading-first redesign

## Intent

Make the UX and visual-design principle catalogs feel like calm reference material rather than
wide operational tables. The primary object is one selected principle and the primary action is
moving from its question to its application and verification guidance.

## Audience and tasks

- Product designers and frontend developers scanning for a relevant principle.
- Coding-agent users checking how to apply and verify a principle.
- Readers moving between visual-design and UX principles in English, Korean, or Japanese.
- Key tasks: search, filter, scan titles, open one principle, read in order, follow related material.

## Chosen direction

Use `mono-type` as a starting tone: typography and reading rhythm provide hierarchy, with the
existing blue and oxblood accents reserved for focus, links, and small status cues. Adapt the style
to the existing Web Stylebook typography rather than replacing the site's font system.

The page opening remains specific to the catalog: title, one short explanation, catalog scope, and
the search/filter action. The visual-design workbench remains as a compact demonstration of the
page's own placement-review sequence, not as a decorative half-screen panel.

## Rejected directions

- `fusion-editorial-terminal`: dark-only and too console-like for long multilingual reading.
- `editorial-silence`: its low density would make a 21–23 item reference unnecessarily long.
- `swiss-poster`: its rigid, loud grid is close to the current table-like problem.
- The previous full-width sheet: simultaneous columns, repeated dividers, and raw IDs compete for
  attention and make prose behave like dense comparison data.

## Tone

Calm, editorial, technical, and trustworthy. Precise rather than austere; quiet rather than faint.

## Color roles

- Canvas and surface: neutral light grays already used by Web Stylebook.
- Primary text: near-black.
- Muted text: readable gray, never used to hide required information.
- Visual-design accent: existing blue.
- UX accent: existing oxblood.
- Focus: the page accent with a visible outline.
- Borders: one strong catalog boundary and sparse internal separators; no wall of rules.

## Type roles

- Display: existing Web Stylebook heading family, reduced from poster scale to reference scale.
- Principle name: primary scanning target.
- Design question: secondary but readable, immediately below the summary.
- Body: existing body family at 1rem-equivalent reading size and relaxed leading.
- Metadata: mono, small but at accessible contrast; never the primary reading target.

## Spacing and density

- Constrain both pages to a useful reading width near 1120px.
- Keep individual prose measures near 68–74ch.
- Use larger gaps between summary, guidance, caution, and related principles than within each group.
- Comfortable density is the default; no compact mode is introduced.

## Layout rules

- Summary row: number, principle headline block, disclosure control.
- Design question follows the summary in the same reading column, not a competing desktop column.
- Expanded body is a vertical sequence: Place/Apply → Verify → Caution → Related principles.
- At most one principle is expanded in a catalog at a time through the shared `details` name.
- A URL hash opens its referenced principle when the page is entered.
- Search, filters, result count, and empty state remain in source order and remain keyboard usable.

## Surface hierarchy

1. Page title and one-line purpose.
2. Search and category filters.
3. Principle title and summary.
4. Design question.
5. Application guidance.
6. Verification guidance.
7. Caution and related principles.

## Component behavior

- Native `details`/`summary` remains the disclosure primitive.
- One-open-at-a-time behavior reduces accumulated reading load without replacing native semantics.
- Focus styles stay on the summary, search input, filters, clear action, and links.
- Related visual/UX links use localized human names; internal IDs remain only in URLs and titles.
- Filtered-empty keeps the query and filter visible and provides a clear reset action.

## Motion

- Use no layout animation for disclosure; content appears immediately.
- Preserve reduced-motion behavior.
- Avoid shimmer, accordion height animation, parallax, or decorative transitions.

## Selected visual-design principles

- `task-sized-composition`: use only the width and columns justified by reading.
- `relational-spacing`: make group relationships legible without depending on rules.
- `attention-budget`: principle name and question lead; metadata recedes.
- `align-for-reading`: preserve source order and allow CJK expansion and wrapping.
- Verification: 320 CSS px, 200% and 400% zoom, grayscale hierarchy, and hidden-border grouping.

## Selected UX principles

- `chunking` — contextual empirical prompt: headings should reconstruct the reading sequence.
- `law-of-common-region` — contextual Gestalt prompt: boundaries must encode real groups.
- `law-of-proximity` — contextual Gestalt prompt: intra-group gaps remain smaller than group gaps.
- `serial-position-effect` — contextual empirical prompt: filters and related links remain findable.
- Caution: these are review prompts, not universal laws or substitutes for user testing.

## UI-state coverage

- Populated: all or filtered principles, current search/filter preserved.
- Filtered empty: explicit no-match message, current query/filter visible, reset action.
- Initial empty, loading, and fetch failure do not apply because the catalog is bundled and static.
- Deep link: matching principle is visible and expanded.
- Long localization: controls wrap or scroll without clipping; content stays in source order.

## Responsive behavior

- Above 980px, headers may use two regions but reading content stays constrained.
- Below 980px, summary and body become a single reading column.
- Below 620px, filters can scroll horizontally, labels stack, and body indentation is removed.
- At 320px and 400% zoom, no two-dimensional scrolling, clipped controls, or hidden actions.

## Mobile reading correction

The first reading-first pass removed desktop prose columns, but a real-device review showed that the
mobile disclosure header still inherited the desktop number gutter. Combined with the shell padding,
this left roughly 250–270 CSS pixels for Korean sentences and made summaries, questions, and list
items feel larger and longer than they were.

- Chosen direction: adapt `notion-style` as a clean document surface with minimal chrome. Keep the
  Web Stylebook type and accent colors; borrow only the quieter hierarchy and block rhythm.
- The one thing: one principle's words, not its catalog number or metadata.
- At 620px and below, number, category/evidence metadata, and the disclosure sign form one compact
  utility row. Title, summary, question, and guidance each use the full reading width below it.
- Replace the long mobile “Guidance/Inspect” label with a 44px plus/minus disclosure sign; the native
  `summary` retains the full accessible name and remains the actual control.
- Expand each principle page through the shared shell padding so the effective page gutter is about
  16px while keeping the global navigation untouched.
- Keep 1rem body text and relaxed leading. Gain measure by removing layout gutters, not by shrinking
  readable content.
- Make the sticky mobile navigation opaque so scrolled content cannot compete with the site label and
  menu control.
- Keep real groups separated by spacing and one quiet rule. Do not add cards around Apply, Verify,
  or Caution.
- Mobile verification must include 320px, 390px, Korean, Japanese, an open middle principle, long
  bullet items, visible focus, 44px controls, and no horizontal overflow.

## Principle boundaries and visual examples

The next review showed a different failure: each disclosure was readable in isolation, but the list
still looked like one continuous document. Thin rules, equal background, and equal vertical gaps did
not make the end of an expanded principle or the start of the next principle obvious. Text-only
guidance also left readers to invent the interface example themselves.

- Approved direction: a before/after field guide. Every one of the 23 UX principles and 21 visual
  design principles receives at least one original, code-rendered UI specimen.
- The one thing: the visible change created by applying one principle to the same interface.
- Each repeated principle is one bounded region with a calm surface, one border, and a larger gap
  between principles than between the sections inside a principle.
- The open principle receives the accent boundary treatment; closed principles remain clearly
  separate without becoming a noisy grid of floating cards.
- The example is the first block inside the expanded content. “Before” and “After” are explicitly
  labelled in EN/KO/JA and never communicated by color alone.
- Desktop places the two specimens side by side. Mobile stacks them in source order so each specimen
  keeps a useful drawing area and the comparison never creates horizontal scrolling.
- Specimens use reusable interface grammars—lists, forms, layouts, statuses, tokens, and media—but
  every principle id maps to an intentional scene. No stock imagery, copied illustration, remote
  asset, or decorative placeholder is used.
- The visual is `aria-hidden` when its accompanying labels and localized explanation provide the
  same meaning. Native `details` remains the disclosure control and the example does not add a
  second nested accordion.
- Filtered-empty remains explicit and preserves the current query and filters. Initial-empty and
  loading do not apply because the catalog and examples are bundled statically.

## Accessibility

- Preserve semantic headings, ordered lists, native disclosure, labels, status announcements, and
  focus visibility.
- Keep body and muted text contrast readable.
- Do not encode evidence, state, or interactivity through color alone.
- Link labels describe the destination principle rather than exposing an internal slug.

## Anti-patterns

- No full-width prose table.
- No three equal prose columns.
- No nested card grid or repeated decorative borders.
- No raw internal IDs as visible labels.
- No multiple equally loud micro-labels.
- No animation that makes opening a principle slower.

## Confirmed decisions

- Production React/CSS implementation in the canonical Showcase repository.
- Both UX and visual-design principle pages are in scope.
- Existing real catalog content and EN/KO/JA localization are retained.
- UX source and reference links are not exposed in the reading interface.
- No imagery is needed.
- Existing site navigation, brand, and light color mode are retained.
- Desktop and mobile behavior, keyboard access, and live deployment verification are required.
- Production React, TypeScript, and CSS remain the implementation stack.
- All 44 principles receive original code-rendered examples; no external image assets are needed.

## Verification checklist

- Typecheck, lint, localization check, catalog tests, and production build pass.
- One disclosure opens while the previous one closes.
- Hash entry opens the matching principle.
- Search/filter and filtered-empty behavior work in all three locales.
- Related visual/UX links show localized human names.
- Desktop, 980px, 620px, and 320px views have no horizontal overflow.
- Principle name, summary, question, guidance, and caution read in that order.
- No UX source or reference attribution appears in the reading interface.
- Closed and open principle boundaries remain obvious with labels and color removed.
- Every UX and visual-design principle id resolves to a visual specimen.
- Before/after specimens stack at 320px, remain side by side at desktop widths, and preserve source
  order and labels in EN/KO/JA.
