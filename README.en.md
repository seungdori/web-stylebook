# Web Stylebook

Web Stylebook is a static site for exploring frontend visual directions and turning them into implementation prompts.

## What Is Included

- 48 React-rendered style references with source in `src/ported/pages`
- 32 base styles and 16 fusion style combinations
- Side-by-side style comparison
- Prompt workflow generator
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
- `/?lang=ko`
- `/pages/brutalist-grid.html`
- `/pages/neon-drift.html?lang=ko`
- `/pages/framer-motion.html?lang=ko`
- `/pages/compare`
- `/pages/compare.html`
- `/pages/prompt-workflow`
- `/pages/prompt-workflow.html`
- `/pages/animation-lab`
- `/pages/animation-example`
- `/pages/component-glossary`

## Source Structure

- `src/data/styles.ts` controls style cards, prompt profiles, palettes, and SEO metadata.
- `src/ported/pages/*.tsx` is the React source of truth for all 32 base style pages and 16 fusion pages.
- `src/ported/portedStylePages.css` contains the ported page-specific visual CSS.
- `src/data/stylePages.ts` remains a typed fallback/metadata layer for style detail pages.
- `src/data/routes.ts` controls static route generation and hreflang URLs.
- `public/previews/*.html` contains legacy visual snapshots used only as fidelity references, not build source.
- `scripts/generate-static-pages.mjs` writes Vite entry HTML for every React route and keeps legacy `.html` aliases.
- `scripts/generate-seo.mjs` writes `sitemap.xml` and `robots.txt` from React route data.

## License

MIT
