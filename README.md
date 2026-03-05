# Vibe Styles — Frontend Design Gallery for Vibe Coding

**Tired of every AI-generated site looking the same?**

Vibe Styles is an open-source collection of **22 distinct web design styles + 7 fusion combinations**, built to break the monotony of generic AI frontend design. Browse live demos, pick a style, and use it as a reference for your next project.

**[Live Demo](https://vibestyles.pages.dev)**

[한국어](./README.ko.md) | [English](./README.en.md) | [日本語](./README.ja.md)

---

## Why This Exists

Vibe coding tools (Cursor, Claude, v0, Bolt, etc.) are making frontend development faster than ever. But there's a problem: **the designs all look the same**. The same gradients, the same card layouts, the same safe color palettes.

This project gives you **real, visually distinct alternatives** — not component libraries or design systems, but full-page references you can see, compare, and adapt.

## What's Inside

### 22 Style Pages
Each page is a complete, self-contained frontend design with its own typography, color system, layout, and motion.

| Category | Styles |
|----------|--------|
| Dark & Neon | Neon Drift, Cyberpunk Glitch, Midnight Noir, Holographic Fluid |
| Minimal & Editorial | Editorial Silence, Swiss Poster, Mono Type, Zen Minimalism |
| Organic & Warm | Earth Atelier, Soft Pastel, Aurora Gradient, Grain Texture |
| Bold & Experimental | Kinetic Pop, Brutalist Grid, Y2K Retro, Liquid Metal |
| Modern & Clean | Glass Orbit, Bento Bloom, Mesh Gradient, Neumorphism |
| Tech & Terminal | Terminal Core, Console Launch, Claymorphism |

### 7 Fusion Pages
Two styles blended into one — for when you want something in between.

`Neon × Swiss` · `Bento × Noir` · `Editorial × Terminal` · `Holo × Glass` · `Earth × Zen` · `Kinetic × Brutal` · `Cyber × Console`

### Prompt Workflow
A step-by-step reference for turning design intent into implementation prompts.

## Quick Start

```bash
# Just open it
open index.html

# Or run a local server
python3 -m http.server 4173
npx serve . -l 4173
```

## How to Use

1. **Browse** — Open the hub and scan the style gallery
2. **Compare** — Open 3-5 styles side by side
3. **Pick** — Choose a direction (or a fusion blend)
4. **Reference** — Use the page as a visual reference when prompting your AI tool
5. **Adapt** — Copy the page and modify it for your project

## Tech

- Zero build tools — plain HTML/CSS/JS
- No frameworks, no dependencies
- Dark/light theme engine
- EN/KO/JA multilingual support
- Fully static, deploy anywhere

## Project Structure

```
├── index.html          # Hub page with style gallery
├── pages/              # 22 style + 7 fusion + workflow pages
├── assets/             # Shared CSS, JS, i18n
├── LICENSE             # MIT
└── README.md
```

## Contributing

Found a bug or want to add a new style? PRs are welcome.

## License

MIT — free to use, modify, and distribute.
