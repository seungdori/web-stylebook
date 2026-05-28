# Web Stylebook

[![English](https://img.shields.io/badge/lang-English-blue)](./README.en.md) [![한국어](https://img.shields.io/badge/lang-한국어-red)](./README.ko.md) [![日本語](https://img.shields.io/badge/lang-日本語-green)](./README.ja.md)

An open-source web stylebook for AI-assisted frontend work: **48 style references** (**32 base styles** and **16 fusion combinations**), style comparison, prompt generation, palette testing, component explanations, and a motion lab.

**[Live Demo](https://webstylebook.com)** · **[Prompt Workflow](https://webstylebook.com/pages/prompt-workflow)** · **[Animation Lab](https://webstylebook.com/pages/animation-lab)**

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

Legacy `.html` utility URLs are still generated as compatibility aliases, but canonical links and in-app navigation use extensionless React routes.

Localized static routes use `/ko/...` and `/ja/...`; legacy `?lang=ko|ja` URLs are normalized in the app for compatibility. English is the default and stays unprefixed.

## Source Structure

- `src/ported/pages/*.tsx` contains the React source of truth for all 32 base style pages and 16 fusion pages.
- `src/ported/portedStylePages.css` contains the ported visual CSS, including page-specific motifs, palettes, typography, and interactions.
- `src/data/styles.ts` and `src/data/routes.ts` drive cards, route generation, canonical URLs, hreflang, sitemap, and robots output.
- `src/data/stylePages.ts` remains a typed fallback/metadata layer, not the primary renderer for completed style samples.
- `public/previews/*.html` is retained only for visual reference while reviewing fidelity.

## License

MIT
