# Web Stylebook

Web Stylebook is a static site for exploring frontend visual directions and turning them into implementation prompts.

## What Is Included

- 48 React-rendered style references with source in `src/ported/pages`
- 32 base styles and 16 fusion style combinations
- Side-by-side style comparison
- Prompt workflow generator
- A searchable UX-principle field guide with application, caution, evidence, and verification checks
- A searchable Visual Design Principles field guide with placement, application, and verification checks
- Color system and contrast tester
- Animation Lab for interaction tuning
- SEO, canonical, hreflang, `sitemap.xml`, and `robots.txt` generation from route data

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run typecheck
npm run lint
npm run build
npm run generate:seo
npm run generate:agent-handoff
python3 -m http.server 4173 -d dist
```

Check these routes after building:

- `/`
- `/ko/`
- `/pages/brutalist-grid.html`
- `/ko/pages/neon-drift.html`
- `/ja/pages/framer-motion.html`
- `/pages/compare`
- `/pages/compare.html`
- `/pages/prompt-workflow`
- `/pages/prompt-workflow.html`
- `/pages/animation-lab`
- `/pages/animation-example`
- `/pages/component-glossary`
- `/pages/ux-principles`
- `/pages/design-principles`

## Source Structure

- `src/data/styles.ts` controls style cards, prompt profiles, palettes, and SEO metadata.
- `src/ported/pages/*.tsx` is the React source of truth for all 32 base style pages and 16 fusion pages.
- `src/ported/portedStylePages.css` contains the ported page-specific visual CSS.
- `src/data/stylePages.ts` remains a typed fallback/metadata layer for style detail pages.
- `src/data/routes.ts` controls static route generation and hreflang URLs.
- `src/catalog/principles.ts` is the shared source for the UX-principle page and MCP catalog.
- `src/catalog/designPrinciples.ts` is the shared source for the Visual Design Principles page and MCP catalog.
- `public/previews/*.html` contains legacy visual snapshots used only as fidelity references, not build source.
- `scripts/generate-static-pages.mjs` writes Vite entry HTML for every React route and keeps legacy `.html` aliases.
- `scripts/generate-seo.mjs` writes `sitemap.xml` and `robots.txt` from React route data.

## License

[CC BY-NC 4.0](./LICENSE)

The UX-principle field guide is independently written and attributes [Laws of UX](https://lawsofux.com)
(CC BY-NC-ND 4.0) as an index reference. Source prose, illustrations, and page layouts are not included.
The independently authored principle catalog is additionally distributed in
[`web-stylebook-mcp`](https://github.com/seungdori/web-stylebook-mcp) under MIT.

The Visual Design Principles field guide is an independently authored, task-oriented review system
for contemporary interfaces. It covers semantic structure, responsive reflow, localization,
tokens and themes, multiple input modes, complete state models, recovery, and motion preferences.
The catalog is also distributed under MIT.
