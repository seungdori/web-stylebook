# Web Stylebook

[![English](https://img.shields.io/badge/lang-English-blue)](./README.en.md) [![한국어](https://img.shields.io/badge/lang-한국어-red)](./README.ko.md) [![日本語](https://img.shields.io/badge/lang-日本語-green)](./README.ja.md)

A source-available web stylebook for AI-assisted frontend work: **48 style references** (**32 base styles** and **16 fusion combinations**), style comparison, prompt generation, palette testing, component explanations, and a motion lab.

**[Live Demo](https://webstylebook.com)** · **[Visual Design Principles](https://webstylebook.com/pages/design-principles)** · **[UX Principles](https://webstylebook.com/pages/ux-principles)** · **[Prompt Workflow](https://webstylebook.com/pages/prompt-workflow)**

## Stack

- React + TypeScript + Vite
- Motion library for the Animation Lab
- Static output in `dist/`
- Route, style, SEO, sitemap, and hreflang data generated from `src/data`
- Style sample pages rendered from React components and CSS in `src/ported`, with route/style metadata in `src/data`
- Archived visual sample pages under `public/previews/` kept only as porting references, not as build source

## Commands

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run build
npm run generate:seo
npm run generate:agent-handoff
python3 -m http.server 4173 -d dist
```

## Routes

- `/`
- `/pages/:styleId`
- `/pages/:styleId.html`
- `/pages/compare`
- `/pages/compare.html`
- `/pages/prompt-workflow`
- `/pages/prompt-workflow.html`
- `/pages/color-system`
- `/pages/prompt-tips`
- `/pages/animation-lab`
- `/pages/animation-example`
- `/pages/component-glossary`
- `/pages/ux-principles`
- `/pages/design-principles`

Legacy `.html` utility URLs are still generated as compatibility aliases, but canonical links and in-app navigation use extensionless React routes.

Localized static routes use `/ko/...` and `/ja/...`; legacy `?lang=ko|ja` URLs are normalized in the app for compatibility. English is the default and stays unprefixed.

## Source Structure

- `src/ported/pages/*.tsx` contains the React source of truth for all 32 base style pages and 16 fusion pages.
- `src/ported/portedStylePages.css` contains the ported visual CSS, including page-specific motifs, palettes, typography, and interactions.
- `src/data/styles.ts` and `src/data/routes.ts` drive cards, route generation, canonical URLs, hreflang, sitemap, and robots output.
- `src/catalog/principles.ts` contains the independently authored UX-principle field guide, evidence labels, source attribution, and application/verification checks used by both the page and MCP snapshot.
- `src/catalog/designPrinciples.ts` contains the independently authored placement and visual-craft field guide shared by the page and MCP snapshot.
- `src/data/stylePages.ts` remains a typed fallback/metadata layer, not the primary renderer for completed style samples.
- `public/previews/*.html` is retained only for visual reference while reviewing fidelity.

## Web Stylebook MCP

Give your coding agent a design vocabulary. The standalone
[`web-stylebook-mcp`](https://github.com/seungdori/web-stylebook-mcp) package
exposes the same catalog to AI coding agents over the Model Context Protocol so they can:

- Choose a product-fit visual direction (scored, with reasons — and rejected directions)
- Select relevant UX principles by outcome, surface, and design phase, with evidence confidence and cautions
- Select visual design principles by concern, surface, and phase, with placement and verification checks
- Plan screen hierarchy by user task
- Cover non-happy-path UI states (loading, empty, error, permission, stale, …)
- Compose role-based design tokens (with contrast warnings)
- Avoid generic AI-looking interfaces

No API key, no model call, no project access — deterministic, read-only design intelligence built
from the same `src/catalog` source as this site. See the
[standalone MCP README](https://github.com/seungdori/web-stylebook-mcp#readme). Install in a coding agent with:

```json
{ "mcpServers": { "web-stylebook": { "command": "npx", "args": ["-y", "web-stylebook-mcp@latest"] } } }
```

```bash
npm run mcp:catalog            # generate the local snapshot used to sync the standalone MCP repo
npm run mcp:catalog:check      # compare that local snapshot with the canonical source
npm run mcp:catalog:validate   # validate that local snapshot
```

## License

[CC BY-NC 4.0](./LICENSE)

The UX-principle field guide is independently written and attributes [Laws of UX](https://lawsofux.com)
(CC BY-NC-ND 4.0) as an index reference. Laws of UX prose, illustrations, and page layouts are not
included. The independently authored principle catalog is additionally distributed in
[`web-stylebook-mcp`](https://github.com/seungdori/web-stylebook-mcp) under MIT.

The Visual Design Principles field guide is an independently authored, task-oriented review system
for contemporary interfaces. It covers semantic structure, responsive reflow, localization,
tokens and themes, multiple input modes, complete state models, recovery, and motion preferences.
The catalog is also distributed under MIT through `web-stylebook-mcp`.
