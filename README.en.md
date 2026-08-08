# Web Stylebook

[English](./README.md) · [한국어](./README.ko.md) · [日本語](./README.ja.md)

**A practical design reference and implementation handoff for frontend teams and AI coding agents.**

Web Stylebook connects visual-direction discovery, UX and interface-design guidance, shared UI
vocabulary, interactive tools, and AI-ready frontend prompts in one localized static site.

[Live site](https://webstylebook.com) ·
[Design Guide](https://webstylebook.com/pages/ux-principles) ·
[Prompt Generator](https://webstylebook.com/pages/prompt-workflow) ·
[Web Stylebook MCP](https://github.com/seungdori/web-stylebook-mcp)

## Catalog

| Reference | Count |
| --- | ---: |
| Base styles | 32 |
| Fusion styles | 16 |
| UX principles | 23 |
| Interface design principles | 25 |
| Component terms | 20 |
| Motion patterns | 29 |
| Languages | 3 |

## How the site is organized

`Design Guide` contains knowledge you read and apply:

- [UX Principles](https://webstylebook.com/pages/ux-principles)
- [Interface Design Principles](https://webstylebook.com/pages/design-principles)
- [Component Glossary](https://webstylebook.com/pages/component-glossary)

`Tools` contains workspaces you operate:

- [Style Compare](https://webstylebook.com/pages/compare)
- [Color System](https://webstylebook.com/pages/color-system)
- [Animation Lab](https://webstylebook.com/pages/animation-lab)
- [Prompt Tips](https://webstylebook.com/pages/prompt-tips)

The [Prompt Generator](https://webstylebook.com/pages/prompt-workflow) and
[`/agent-handoff.json`](https://webstylebook.com/agent-handoff.json) turn the catalog into a
structured implementation handoff for coding agents. The standalone
[`web-stylebook-mcp`](https://github.com/seungdori/web-stylebook-mcp) package exposes the same
canonical design intelligence over MCP.

## Development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run typecheck
npm run lint
npm run i18n:check
npm run test
npm run mcp:catalog
npm run mcp:catalog:check
npm run mcp:catalog:validate
npm run build
```

## Source structure

- `src/data/styles.ts` — 32 base and 16 fusion style definitions.
- `src/ported/pages/*.tsx` — React source of truth for all style pages.
- `src/catalog/principles.ts` — canonical UX-principle catalog.
- `src/catalog/designPrinciples.ts` — canonical interface-design-principle catalog.
- `src/catalog/components.ts` — canonical component vocabulary.
- `src/pages/animation-lab/catalog.ts` — motion-pattern catalog.
- `src/data/routes.ts` — localized routes, canonical URLs, hreflang, and SEO data.
- `scripts/generate-static-pages.mjs` — static output and legacy `.html` aliases.
- `scripts/generate-agent-handoff.mjs` — machine-readable AI handoff.
- `public/previews/*.html` — archived fidelity references, not production sources.

English routes are unprefixed; Korean and Japanese use `/ko/` and `/ja/`.

## License

[CC BY-NC 4.0](./LICENSE)

The UX-principle field guide is independently written and attributes
[Laws of UX](https://lawsofux.com) (CC BY-NC-ND 4.0) as an index reference. Its prose,
illustrations, and layouts are not included. The independently authored UX and interface-design
catalogs are also distributed under MIT through
[`web-stylebook-mcp`](https://github.com/seungdori/web-stylebook-mcp).
