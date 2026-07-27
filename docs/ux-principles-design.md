# UX Principles Library — Design Brief

## Intent

Add an independently authored UX-principles reference to Web Stylebook and make the same catalog
available to the MCP. The feature should turn abstract psychology names into concrete design
questions, application moves, cautions, and verification checks. It is not a mirror of Laws of UX.

## Audience and tasks

- Frontend developers and product designers checking a screen before implementation or review.
- AI coding agents selecting a small, relevant set of behavior principles for a surface.
- Primary tasks: browse by outcome, search by name or question, inspect one principle, apply its
  guidance, and verify the result.

## The one thing

The centerpiece is the conversion from **principle → design question → observable check**. The
screen is organized around that sequence, not around decorative psychology illustrations.

## Direction

Use the existing Web Stylebook shell with a restrained “technical field sheet” composition inspired
by the catalog’s Quiet Manifesto direction: visible numbering, strong rules, one oxblood accent,
compact mono labels, and generous reading space. The style is adapted to the current site tokens and
fonts instead of importing a separate theme.

Three opening structures considered:

1. **Inline-first action** — search and outcome filters own most of the frame; the eye lands on the
   query control. Strong for retrieval, weak for explaining the catalog’s editorial boundary.
2. **Type wall** — a large statement owns most of the frame; the eye lands on the promise. Strong
   identity, weak utility and too close to an all-text opening.
3. **Numbered field sheet** — a compact title and attribution sit above a live principle index; the
   numbered index owns most of the first viewport and the eye lands on the first usable question.
   Chosen because the product mechanic is browsing and applying the catalog itself.

Rejected directions:

- A generic responsive card grid: it hides relationships and makes every principle equally loud.
- Recreating Laws of UX geometric artwork or color system: unnecessary and outside the reuse
  boundary.
- A quiz that pretends to infer the correct law from free text: opaque and incompatible with the
  deterministic catalog contract.

## Tone

Editorial, technical, cautious, and useful. Principles are evidence to consider, never universal
commands or persuasion tricks.

## Color roles

- Canvas and reading surface: existing warm-neutral site roles.
- Ink and muted ink: hierarchy and long-form legibility.
- Oxblood accent: active filter, numbering, and focus details only.
- Semantic caution: misuse and evidence caveats; never decorative urgency.

## Type roles

- Display: existing site heading family for page identity.
- Body: existing readable text family for summaries and checks.
- Mono: category, evidence confidence, sequence numbers, and filter metadata.

## Spacing and density

Medium density. A principle is a full-width row, not a tile. The collapsed row must be scannable;
expanded guidance uses two columns on wide screens and one column on narrow screens. Group spacing
must exceed spacing inside a group.

## Layout rules

- Search and category controls remain near the result count.
- Principle number, category, name, summary, and design question remain visible without expansion.
- Native disclosure reveals application, verification, caution, evidence, and references.
- No nested cards. Rules and whitespace express grouping.
- Mobile keeps the same reading order and never requires horizontal scrolling.

## Surface hierarchy

1. Compact page identity and provenance.
2. Search, category filters, and result count.
3. Numbered principle rows with a question-first scan path.
4. Expanded implementation and verification detail.
5. Source-project and independently authored content license boundary.

## Component behavior

- Search filters locally on localized name, aliases, summary, question, apply, and verify text.
- Category buttons are mutually exclusive and expose `aria-pressed`.
- Each principle uses native `details/summary`; links remain independently operable.
- “Clear filters” appears only for a filtered-empty result.
- URL anchors identify each principle for stable linking.

## Motion

Use only short color and disclosure transitions already present in the site. Avoid scroll-driven
reveals, looping illustrations, layout-shifting list animation, and attention-seeking pulses.
Reduced-motion users receive an immediate state change.

## UI-state coverage

- Populated: localized result count, active query/category, stable Web Stylebook category order.
- Filtered empty: explain that no principles match and offer a clear-filters action while preserving
  the query until the user chooses to clear it.
- Static catalog means network loading, stale, and fetch-failed states do not apply.

## Responsive behavior

- At ≥900px, controls may share a row and expanded apply/verify blocks use two columns.
- Below 900px, controls and detail blocks stack.
- At 320–390px, filter chips scroll or wrap without clipping; sequence numbers stay visible.

## Accessibility

- One `h1`, sequential section headings, native search label, buttons, and disclosures.
- Visible focus on search, filters, summaries, clear action, and external references.
- Result count uses polite live status.
- Meaning never depends on accent color, motion, or position alone.
- External links disclose source names and use safe `rel` values.

## Anti-patterns

- Do not present principles as guarantees or numerical UI limits.
- Do not use behavioral science to coerce, fabricate progress, or hide material terms.
- Do not copy source definitions, takeaways, illustrations, layout, or color motifs.
- Do not load or inject remote page HTML into the website or MCP.
- Do not duplicate principle prose in prompts, skills, or policies; link the catalog resource.

## Confirmed decisions and assumptions

- Deliverable: production-ready page plus canonical catalog and MCP integration.
- Stack: existing React, TypeScript, plain CSS, static route generation.
- Content: 23 independently authored, high-actionability principles curated from a review of the
  current 30-item Laws of UX index; seven broad, overlapping, weakly operational, or commonly
  misapplied items are intentionally not mirrored.
- Locales: English, Korean, Japanese.
- Assets: no external imagery or brand assets are needed.
- Target: current desktop and mobile breakpoints, WCAG AA behavior, light site theme.

## Verification checklist

- Catalog schema, locale, references, related IDs, stable serialization, counts, and hash pass.
- Page search, category filters, disclosures, empty state, anchors, and language switch work.
- Static routes, canonical/hreflang metadata, sitemap, and build output include the new page.
- 320, 390, 1280, and 1440px visual checks show no clipping or horizontal overflow.
- MCP list/detail resources and principle-plan tool return deterministic, compact contracts.
- Source attribution and the independent-authorship notice are visible and accurate.
