/**
 * i18n — lightweight translation layer for Web Stylebook.
 * Stores EN / KO dictionaries, handles switching, persists via localStorage.
 */
(() => {
  // Ensure [hidden] is never overridden by component CSS (e.g. display:inline-flex)
  const style = document.createElement('style');
  style.textContent = '[hidden]{display:none!important}';
  document.head.appendChild(style);

  // Hide nav when embedded in iframe (e.g. compare page)
  if (window !== window.top) {
    const embedStyle = document.createElement('style');
    embedStyle.textContent = '.site-nav,.skip-link{display:none!important}';
    document.head.appendChild(embedStyle);
  }

  const translations = {
    /* ─── English (default) ─── */
    en: {
      // Skip link
      'skip': 'Skip to content',

      // Nav
      'nav.styles': 'Styles',
      'nav.compare': 'Compare Styles',
      'nav.fusionLab': 'Fusion Lab',
      'nav.hub': 'Hub Home',
      'nav.tips': 'Color System',
      'nav.workflow': 'Prompt Generator',
      'nav.more-tips': 'Tips',

      // Theme toggle
      'theme.toggle.aria': 'Toggle theme',
      'theme.toggle.title': 'Switch light/dark theme',

      // Language toggle
      'lang.toggle.aria': 'Switch language',

      // Hero
      'hero.aria': 'Hero',
      'hero.desc': 'Browse sample pages by template, combine styles into workflows, and generate step-by-step prompts. Start designing creative web experiences.',
      'chip.style-split': 'Style-separated Templates',
      'chip.combo': 'Combination Experiments',
      'chip.prompt': 'Prompt Management',
      'chip.workflow': 'Workflow Integration',
      'stat.aria': 'Key statistics',

      // Style section
      'section.styles': 'Style Sample Pages',
      'search.placeholder': 'Search styles...',
      'search.aria': 'Search styles',
      'filter.aria': 'Tag filters',
      'filter.all': 'All',
      'palette.aria': 'Key colors',

      // Card descriptions (styles)
      'card.neon-drift.desc': 'Dynamic neon glow style inspired by night cityscapes.',
      'card.editorial-silence.desc': 'Restrained elegance with magazine typography and generous whitespace.',
      'card.kinetic-pop.desc': 'Bold color contrast and rhythm-driven motion design.',
      'card.earth-atelier.desc': 'Neutral, nature-inspired textures and organic layout.',
      'card.brutalist-grid.desc': 'Raw, heavy lines and structural typographic block system.',
      'card.glass-orbit.desc': 'Layered transparent panels with 3D depth glassmorphism.',
      'card.midnight-noir.desc': 'Overwhelming dark luxury with gold and silver accents.',
      'card.bento-bloom.desc': 'Soft pastel tones with an Apple-inspired bento grid.',
      'card.terminal-core.desc': 'Monospace fonts and developer console narrative.',
      'card.console-launch.desc': 'Dark onboarding with interactive cursor and panels.',
      'card.swiss-poster.desc': 'Grid-system and alignment-focused informational style.',
      'card.holographic-fluid.desc': 'Holographic mesh gradients with dreamy fluid motion.',
      'card.cyberpunk-glitch.desc': 'Neon contrast, monospace, and glitch-infused terminal look.',
      'card.zen-minimalism.desc': 'Extreme whitespace and serif fonts focused on essence.',
      'card.aurora-gradient.desc': 'Organic multi-color blur gradients flowing like aurora.',
      'card.grain-texture.desc': 'Film grain overlay and muted analog-tone aesthetic.',
      'card.liquid-metal.desc': 'Chrome metallic reflections with monochrome silver palette.',
      'card.mesh-gradient.desc': 'Apple-style multi-point mesh gradient, bright and refined.',
      'card.mono-type.desc': 'Monochrome style using only typographic weight and size for hierarchy.',
      'card.soft-pastel.desc': 'Ultra-soft pastel tones with warm rounded pill-shaped UI.',
      'card.claymorphism.desc': 'Cozy double-shadow volumetric clay-style web structure.',
      'card.y2k-retro.desc': 'Clean retro UI with beveled chrome, teal desktop, and classic window components.',
      'card.neumorphism.desc': 'Light and shadow emboss on a unified background surface.',
      'card.notion-style.desc': 'Clean productivity UI with sidebar, block-based content, and minimal chrome.',
      'card.retro-pixel.desc': '8-bit pixel art aesthetic with Game Boy colors and RPG-style UI elements.',
      'card.organic-blob.desc': 'Flowing organic shapes with nature-inspired tones and soft blob containers.',
      'card.duotone-bold.desc': 'High-contrast duotone cards with bold typography and vibrant gradients.',
      'card.framer-motion.desc': 'Motion-centric SaaS landing with gradient text, glow borders, and entrance animations.',

      // Buttons
      'btn.view': 'View Page',
      'btn.workflow': 'Apply Workflow',
      'btn.set-global': '★\uFE0E Set Global',
      'btn.applied': '★\uFE0E Applied',

      // No results
      'no-results.styles': 'No matching styles found.',
      'no-results.fusion': 'No matching fusion styles found.',

      // Fusion section
      'section.fusion': 'Fusion Styles',
      'card.neon-swiss.desc': 'A perfect blend of neon energy and Swiss design alignment.',
      'card.bento-noir.desc': 'Premium look combining efficient bento layout with dark luxury.',
      'card.editorial-terminal.desc': 'Editorial readability meets tech log aesthetics.',
      'card.holo-glass.desc': 'Dreamy organic backgrounds with transparent 3D glassmorphism.',
      'card.earth-zen.desc': 'Natural neutral tones with gallery-grade whitespace.',
      'card.kinetic-brutal.desc': 'Bold primary-color pop art with thick borders and destructive wireframes.',
      'card.cyber-console.desc': 'Hacker console sensibility fused with cyberpunk neon glitch.',

      // Workflow section
      'section.workflow': 'Prompt Generator',
      'workflow.desc': 'Automatically generates sequential prompts in order: Design → Component → Assembly → QA. Each selected template has its own DNA-infused environment ready.',
      'workflow.cta': 'Open Prompt Generator',

      // Footer
      'footer.desc': 'Web Stylebook — A creative workflow hub to explore design styles, experiment with fusion combinations, and auto-generate step-by-step prompts.',
      'footer.stat.styles': 'Style Templates',
      'footer.stat.fusions': 'Fusion Combos',
      'footer.stat.pages': 'Sample Pages',
      'footer.cta': 'Start Generating',
      'footer.license': 'Licensed under CC BY-NC 4.0',

      // Copy feedback (used by app.js)
      'copy.success': 'Copied!',
      'copy.fail': 'Copy failed',

      // Back link (style/fusion pages)
      'back.hub': 'Back to Hub',
      'back.hub.aria': 'Back to Hub',

      // Prompt-workflow page
      'pw.nav.title': 'Prompt Generator',
      'pw.nav.hub': 'Go to Hub',
      'pw.hero.title': 'Design → Component → Assembly → QA',
      'pw.hero.subtitle': 'Lock in style/typography/stack first, then generate step-by-step prompts. Entering from a template card auto-applies that style to this page.',
      'pw.input.title': 'INPUT CONFIG',
      'pw.label.project': 'Project Name',
      'pw.label.target': 'Core Target',
      'pw.label.target.default': 'Solo creators/early teams building UI fast with AI',
      'pw.label.hub-ref': 'Design Hub References (multi-select)',
      'pw.btn.deselect': 'Deselect All',
      'pw.label.product': 'Product/Service Description',
      'pw.label.product.default': 'A web hub for comparing design samples and generating step-by-step prompts to boost UI productivity',
      'pw.label.hub-summary': 'Hub Style Summary (auto-filled)',
      'pw.label.hub-summary.default': 'Selected design hub styles will be automatically reflected here.',
      'pw.hint.hub-summary': 'Auto-included in prompts. Edit directly if needed.',
      'pw.label.typo-profile': 'Typography Profile',
      'pw.option.typo-auto': 'Style-based recommendation (default)',
      'pw.option.typo-manual': 'Keep manual input',
      'pw.hint.typo': 'Default is a recommendation based on style combination.',
      'pw.label.font-heading': 'Headline Font',
      'pw.label.font-body': 'Body Font',
      'pw.label.font-code': 'Code/Terminal Font',
      'pw.label.type-density': 'Typography Density',
      'pw.label.type-note': 'Typography Notes',
      'pw.label.type-note.default': 'Headlines with clear hierarchy, body prioritizing readability, code text limited to supplementary areas.',
      'pw.label.style-dir': 'Preferred Style Direction',
      'pw.label.style-dir.default': 'Clear information structure, restrained decoration, high component consistency — practical UI',
      'pw.label.must-keep': 'Must Keep',
      'pw.label.must-keep.default': 'Mobile stability, component reusability, readability-first typography, clipping safety rules',
      'pw.label.pages': 'Required Pages',
      'pw.label.tech': 'Tech Stack',
      'pw.option.tech-custom': 'Custom input',
      'pw.placeholder.tech-custom': 'e.g., Nuxt 3 + Tailwind + TypeScript + Storybook',
      'pw.label.forbidden': 'Forbidden',
      'pw.label.forbidden.default': 'Horizontal scroll, meaningless exaggerated motion, excessive blur, low-contrast text',
      'pw.state.title': 'Current Settings',
      'pw.state.style': 'Style',
      'pw.state.style.none': 'None selected',
      'pw.state.typo': 'Typography',
      'pw.state.typo.auto': 'Style-based recommendation',
      'pw.state.stack': 'Stack',
      'pw.state.pages': 'Pages',
      'pw.state.pages.count': ' pages',
      'pw.state.theme': 'Theme',
      'pw.step1': '1) Design Prompt',
      'pw.step2': '2) Component Prompt',
      'pw.step3': '3) Assembly Prompt',
      'pw.step4': '4) QA Prompt',
      'pw.btn.copy': 'Copy',
      'pw.btn.expand': 'Expand',
      'pw.btn.collapse': 'Collapse',
      'pw.full.title': 'Full Execution Prompt',
      'pw.full.copy': 'Copy All',
      'pw.note1': '1. Lock in style/typography first, then proceed to the component phase for stable quality.',
      'pw.note2': '2. For fusion styles, include weight/priority descriptions to avoid inconsistent results.',
      'pw.note3': '3. At the QA stage, verify overflow, responsiveness, and typography consistency simultaneously.',
      'pw.hint.no-ref': 'No references selected',

      // Inline copy feedback
      'copy.done.label': 'Copied!',

      // Color System
      'cs.title': 'Color System & Testing',
      'cs.colors': 'Colors',
      'cs.label.bg': 'Background (bg)',
      'cs.label.text': 'Text (text)',
      'cs.label.main': 'Main / Primary (main)',
      'cs.label.sub': 'Sub / Accent (sub)',
      'cs.palette.title': 'Style Presets',
      'cs.palette.random': 'Shuffle Random Palette',
      'cs.filter.all': 'All',
      'cs.filter.dark': 'Dark',
      'cs.filter.light': 'Light',
      'cs.contrast.textBg': 'Text / BG',
      'cs.contrast.mainBg': 'Main / BG',
      'cs.contrast.subBg': 'Sub / BG',
      'cs.preview.title': 'Harmony & Balance',
      'cs.preview.desc': 'A carefully selected color palette brings your UI to life. Adjust the controls on the left to instantly test how your primary and secondary colors contrast against the background and text.',
      'cs.preview.badge': 'Live Preview',
      'cs.preview.card.title': 'Color in Action',
      'cs.preview.card.desc': 'See how your chosen palette performs across real UI components. Buttons, cards, and inputs all respond to your color selections in real time.',
      'cs.btn.primary': 'Apply Theme',
      'cs.btn.secondary': 'Reset Colors',
      'cs.toast.active': 'Palette testing is active!',
      'cs.stat.users': 'Palettes',
      'cs.stat.revenue': 'WCAG Pass',
      'cs.tab.general': 'Profile',
      'cs.tab.security': 'Appearance',
      'cs.tab.billing': 'Export',
      'cs.field.email': 'Display Name',
      'cs.field.notifications': 'Dark Mode',
      'cs.field.2fa': 'Border Radius',
      'cs.field.2fa.app': 'Rounded',
      'cs.field.2fa.sms': 'Sharp',
      'cs.field.plan': 'Format',
      'cs.field.plan.pro': 'CSS Variables',
      'cs.field.plan.team': 'Design Tokens (JSON)',
      'cs.alert.title': 'Palette Saved',
      'cs.alert.desc': 'Your custom color palette has been saved successfully. You can export it as CSS variables or design tokens.',
      'cs.export.title': 'Export Design Tokens',
      'cs.export.desc': 'Export your current color palette as ready-to-use code.',
      'nav.colors': 'Colors',

      // Compare page keys
      'compare.title': 'Style Compare',
      'compare.left': 'Left',
      'compare.right': 'Right',
      'compare.select': 'Select a style...',
      'compare.swap': 'Swap',
      'compare.horizontal': 'Side by Side',
      'compare.vertical': 'Stacked',
      'compare.empty': 'Select a style to preview',
      'compare.quickPairs': 'Quick Pairs',

      // Fusion Lab page keys
      'fusion.lab.title': 'Fusion Lab',
      'fusion.lab.heading': 'Custom Fusion Generator',
      'fusion.lab.desc': 'Pick any two styles and blend their design tokens. Adjust the ratio to find your perfect mix.',
      'fusion.lab.styleA': 'Style A',
      'fusion.lab.styleB': 'Style B',
      'fusion.lab.ratio': 'Mix Ratio',
      'fusion.lab.result': 'Fusion Result',
      'fusion.lab.copyTokens': 'Copy CSS',
      'fusion.lab.copyPrompt': 'Copy Prompt',
      'fusion.lab.empty': 'Select two styles above to generate a fusion preview.',
      'fusion.lab.preview.desc': 'A custom blend combining the essence of both styles into a unique hybrid direction.',
      'fusion.lab.preview.cardTitle': 'Component Preview',
      'fusion.lab.preview.cardDesc': 'This card shows how the blended tokens look together as a cohesive UI element.',
      'fusion.lab.preview.btnPrimary': 'Primary Action',
      'fusion.lab.preview.btnSecondary': 'Secondary',

      // Prompt Tips page
      'tips.title': 'Prompt Tips',
      'tips.hero.title': 'Stop Getting Generic AI Designs',
      'tips.hero.sub': 'AI tends to produce the same "safe" look every time: soft gradients, excessive rounding, meaningless blur. These tips help you write prompts that break out of that default and produce designs with actual intent.',
      'tips.toc': 'Contents',
      'tips.toc.1': 'Patterns AI Defaults To',
      'tips.toc.2': 'Prompting Principles',
      'tips.toc.3': 'Before / After',
      'tips.toc.4': 'Copy-Ready Snippets',
      'tips.s1.title': 'Patterns AI Defaults To',
      'tips.s1.intro': 'When you give a vague prompt, AI falls into comfortable patterns. Recognizing them is the first step to avoiding them.',
      'tips.label.trap': 'Trap',
      'tips.label.vague': 'Vague prompt',
      'tips.label.specific': 'Specific prompt',
      'tips.label.before': 'Before',
      'tips.label.after': 'After',
      'tips.anti.1.title': 'The Gradient Fog',
      'tips.anti.1.desc': 'Soft purple-to-blue gradient backgrounds with no relationship to the brand. Applied everywhere as a substitute for actual visual hierarchy.',
      'tips.anti.1.bad': '"Make it modern and visually appealing with a nice gradient background"',
      'tips.anti.1.good': '"Background: flat #0b0d12. Use a single linear gradient only on the hero CTA button (left: #2563eb, right: #7c3aed). No gradients elsewhere."',
      'tips.anti.2.title': 'The Blur Crutch',
      'tips.anti.2.desc': 'backdrop-filter: blur() on every panel, making the page feel foggy and ungrounded. Blur should be deliberate, not a texture replacement.',
      'tips.anti.2.bad': '"Use glassmorphism for a premium feel"',
      'tips.anti.2.good': '"Cards: solid bg rgba(28,28,30,0.85), 1px border rgba(255,255,255,0.08). Apply backdrop-filter: blur(16px) only to the floating nav overlay. No blur on cards or sections."',
      'tips.anti.3.title': 'Rounded Everything',
      'tips.anti.3.desc': 'border-radius: 16px on every element creates a toy-like sameness. Intentional variation in radius communicates hierarchy.',
      'tips.anti.3.bad': '"Use rounded corners for a friendly look"',
      'tips.anti.3.good': '"Radius system: containers 16px, cards 12px, buttons 8px, badges 4px. Tags and inline elements use 2px. Never use border-radius on full-width sections."',
      'tips.anti.4.title': 'The Icon Grid',
      'tips.anti.4.desc': 'Three columns of circle-icon + heading + paragraph repeated identically. The laziest possible feature section layout.',
      'tips.anti.4.bad': '"Create a features section with icons"',
      'tips.anti.4.good': '"Features: asymmetric bento grid. Lead feature spans 2 columns with inline demo screenshot. Secondary features are single-column cards with a monospace label instead of icons."',
      'tips.anti.5.title': 'Decorative Animation',
      'tips.anti.5.desc': 'Floating orbs, particle effects, and scroll-triggered fade-ins that add zero information. Motion should serve comprehension, not decoration.',
      'tips.anti.5.bad': '"Add some animations to make it feel dynamic and alive"',
      'tips.anti.5.good': '"Transitions: 200ms ease for hover states only. No scroll-triggered animations. No floating/pulsing decorative elements. Respect prefers-reduced-motion."',
      'tips.anti.6.title': 'Center All The Text',
      'tips.anti.6.desc': 'Centering every text block makes line start positions unpredictable, destroying reading flow. Center alignment works for short headings or CTAs, but body text should always be left-aligned with a controlled line length.',
      'tips.anti.6.bad': '"Center all the text for a clean, balanced layout"',
      'tips.anti.6.good': '"Body text: left-aligned, max-width 640px. Only center: section headings and CTA buttons. Paragraph line length must not exceed 75 characters."',
      'tips.s2.title': 'Prompting Principles',
      'tips.s2.intro': 'These principles shift AI from "make it look good" mode into "execute a precise design specification" mode.',
      'tips.p.1.title': 'Name a specific style, not an adjective',
      'tips.p.1.desc': '"Modern" and "clean" mean nothing to an AI \u2014 they map to the same generic output. Instead, reference a named design direction. This project\'s 22 style templates exist for this reason.',
      'tips.p.1.tip': '"modern and clean" \u2192 "Swiss Poster style: grid-aligned, Helvetica-derived sans-serif, red + black + white only, strong vertical rhythm."',
      'tips.p.2.title': 'Lock typography before anything else',
      'tips.p.2.desc': 'Typography defines 80% of a design\'s character. If you leave it unspecified, AI picks Inter/system-ui every time and your design immediately looks like every other AI output.',
      'tips.p.2.tip': 'Heading font, body font, code font, size scale (e.g. 14/16/20/28/40), line-height (1.5 body, 1.2 headings), and letter-spacing for headings (-0.02em).',
      'tips.p.3.title': 'Define what\'s forbidden',
      'tips.p.3.desc': 'AI is an optimizer. Without constraints, it gravitates toward statistically "safe" choices. Explicit prohibitions are more effective than positive instructions for avoiding generic results.',
      'tips.p.3.tip': '"FORBIDDEN" section: no horizontal scroll, no gradient backgrounds, no blur over 8px, no shadow larger than 0 2px 8px, no border-radius over 12px, no decorative SVG illustrations.',
      'tips.p.4.title': 'Specify colors as exact values, not descriptions',
      'tips.p.4.desc': '"A blue accent" produces #3B82F6 almost every time. Every AI uses the same safe blue. Use the Color System page to build a palette with actual hex values, then pass them verbatim.',
      'tips.p.4.tip': '"Primary: #e63946, Surface: #1d1d1f, Text: #f1faee, Muted: #a8a8a8, Border: rgba(255,255,255,0.08). No other colors."',
      'tips.p.5.title': 'Describe layout as structure, not feeling',
      'tips.p.5.desc': '"Spacious and clean layout" is subjective. AI will interpret it however it wants. Instead, give grid specs, max-widths, gap values, and padding rules.',
      'tips.p.5.tip': '"Content max-width: 720px. Section padding: 80px 0. Card grid: 2 columns, 16px gap. Hero: single column, left-aligned, no centered text."',
      'tips.p.6.title': 'Give a component hierarchy, not a page description',
      'tips.p.6.desc': '"Build a landing page" gives AI total freedom to use its default layout. Instead, specify the exact component stack and their relationships.',
      'tips.p.6.tip': '"Top to bottom: compact nav (logo left, 3 links right) / hero (h1 + subtitle + single CTA, no image) / 3-column bento features / single testimonial / footer with 2-col link grid."',
      'tips.p.7.title': 'Control line length (measure)',
      'tips.p.7.desc': 'If text runs the full width of a wide container, each line becomes too long and the reader\'s eye loses track jumping back to the next line. The optimal measure for body text is 45\u201375 characters (roughly 640px max-width at 16px font size).',
      'tips.p.7.tip': '"Body text max-width: 640px. Headings can span full container width. Code blocks and cards use full width. Never let a paragraph exceed 75 characters per line."',
      'tips.s3.title': 'Before / After',
      'tips.s3.intro': 'Side-by-side comparison of weak vs. strong prompts. The right column isn\'t longer for its own sake \u2014 every added word removes a degree of freedom from the AI.',
      'tips.ba.1.title': 'Landing Page Hero',
      'tips.ba.1.before': 'Create a modern SaaS landing page\nwith a hero section. Make it look\nprofessional and appealing.\nUse a nice color scheme.',
      'tips.ba.1.after': 'Hero section:\n- Background: flat #0a0a0f, no gradient\n- Headline: Space Grotesk 700, 48px,\n  tracking -0.03em, color #ffffff\n- Subtext: Inter 400, 17px, color #888,\n  max-width 520px, line-height 1.65\n- CTA: one button, bg #e63946, no shadow,\n  border-radius 6px, padding 14px 32px\n- Layout: left-aligned, no centered text\n- No hero image, no illustration, no blob',
      'tips.ba.2.title': 'Card Component',
      'tips.ba.2.before': 'Design a card component with\na nice hover effect. Use modern\nstyling with shadows and\nrounded corners.',
      'tips.ba.2.after': 'Card:\n- bg: #1c1c1e, border: 1px solid\n  rgba(255,255,255,0.06)\n- radius: 12px, padding: 20px\n- NO box-shadow at rest\n- Hover: border-color shifts to\n  rgba(255,255,255,0.15),\n  transition 150ms ease\n- Title: 15px 600, body: 14px 400\n  color #999, line-height 1.55\n- No image slot, no icon, no badge',
      'tips.ba.3.title': 'Dashboard Layout',
      'tips.ba.3.before': 'Create an analytics dashboard\nwith charts and statistics.\nMake it dark mode with a\nclean professional look.',
      'tips.ba.3.after': 'Dashboard:\n- Sidebar: 240px fixed, bg #111113,\n  nav items 14px 500, active: text\n  white + left 2px accent border\n- Main: fluid, max 1200px, padding 32px\n- Stat cards: grid 4-col, each shows\n  label (12px 500 muted uppercase) +\n  value (28px 700 white) + trend (12px,\n  green #30d158 or red #ff453a)\n- Chart area: 2-col grid, border 1px\n  solid rgba(255,255,255,0.06)\n- No gradient bg, no glassmorphism,\n  no decorative illustrations',
      'tips.s4.title': 'Copy-Ready Snippets',
      'tips.s4.intro': 'Paste these directly into your prompt. Snippets are kept in English because most AI models parse English constraints more reliably, reducing ambiguity in the output.',
      'tips.cheat.1.title': 'Anti-Generic Constraint',
      'tips.cheat.2.title': 'Typography Lock',
      'tips.cheat.3.title': 'Color System Handoff',
      'tips.cheat.4.title': 'Layout Specification',
      'tips.cheat.5.title': 'Motion Constraints',
      'tips.cheat.6.title': 'Quality Gate Prompt',
      'tips.copy': 'Copy',

      // Common page keys
      'page.heading.prompt': 'AI Request Prompt',
      'page.btn.copy': 'Copy Prompt',
      'page.nav.hub': 'Go to Hub',
      'page.nav.aria': 'Page navigation',
      'page.nav.prev': 'Previous',
      'page.nav.next': 'Next',
    },

    /* ─── Korean ─── */
    ko: {
      'skip': '본문으로 건너뛰기',
      'nav.styles': '스타일',
      'nav.compare': '스타일 비교',
      'nav.fusionLab': '퓨전 랩',
      'nav.hub': '허브 홈',
      'nav.tips': '색상 조합',
      'nav.workflow': '프롬프트 생성기',
      'nav.more-tips': '팁',
      'theme.toggle.aria': '테마 전환',
      'theme.toggle.title': '라이트/다크 테마 전환',
      'lang.toggle.aria': '언어 전환',
      'hero.aria': '히어로',
      'hero.desc': '템플릿별 샘플 페이지를 확인하고, 원하는 스타일 조합을 워크플로우에 반영해 단계별 프롬프트를 생성하는 허브입니다. 창의적인 웹 경험 설계를 시작하세요.',
      'chip.style-split': '템플릿별 스타일 분리',
      'chip.combo': '조합 스타일 실험',
      'chip.prompt': '프롬프트 매니징',
      'chip.workflow': '워크플로우 연동',
      'stat.aria': '주요 통계',
      'section.styles': '스타일 샘플 페이지',
      'search.placeholder': '스타일 검색...',
      'search.aria': '스타일 검색',
      'filter.aria': '태그 필터',
      'filter.all': '전체',
      'palette.aria': '대표 컬러',
      'card.neon-drift.desc': '야간 도시, 네온, 글로우 중심의 역동적 스타일.',
      'card.editorial-silence.desc': '잡지형 타이포그래피와 여백을 살린 절제미.',
      'card.kinetic-pop.desc': '강렬한 컬러 대비와 리듬감 있는 모션 중심.',
      'card.earth-atelier.desc': '자연의 질감과 뉴트럴 감성 기반의 레이아웃.',
      'card.brutalist-grid.desc': '굵고 투박한 선, 구조적인 타이포 블록 시스템.',
      'card.glass-orbit.desc': '투명 레이어 중첩과 깊이감을 살린 3D 배경 글래스모피즘.',
      'card.midnight-noir.desc': '압도적인 다크 럭셔리와 세밀한 골드/은빛 포인트.',
      'card.bento-bloom.desc': '부드러운 파스텔 톤과 애플 감성의 벤토 구조.',
      'card.terminal-core.desc': '모노스페이스 폰트와 개발자 콘솔 내러티브.',
      'card.console-launch.desc': '다크 온보딩 방식의 인터랙티브 커서와 패널.',
      'card.swiss-poster.desc': '격자 시스템과 정렬 중심의 정보 지향적 스타일.',
      'card.holographic-fluid.desc': '홀로그래픽 매시 그라데이션과 몽환적인 유체 모션.',
      'card.cyberpunk-glitch.desc': '네온 대비와 모노스페이스, 글리치가 결합된 터미널 룩.',
      'card.zen-minimalism.desc': '극도의 여백과 세리프 폰트로 본질에 집중하는 스타일.',
      'card.aurora-gradient.desc': '오로라처럼 유기적으로 흐르는 다중 컬러 블러 그라데이션 배경.',
      'card.grain-texture.desc': '필름 그레인 오버레이와 뮤트 톤의 아날로그 감성 스타일.',
      'card.liquid-metal.desc': '크롬과 메탈릭 질감의 반사 효과, 모노크롬 실버 팔레트.',
      'card.mesh-gradient.desc': 'Apple 스타일 다중 포인트 메시 그라데이션, 밝고 세련된 느낌.',
      'card.mono-type.desc': '오직 타이포그래피의 크기와 무게로만 위계를 만드는 모노크롬 스타일.',
      'card.soft-pastel.desc': '울트라 소프트 파스텔 톤과 둥근 필 형태의 따뜻한 인터페이스.',
      'card.claymorphism.desc': '포근하고 푹신한 더블 그림자(입체 볼륨) 기반의 친화형 웹 구조.',
      'card.y2k-retro.desc': '베벨 크롬, 틸 데스크톱, 클래식 윈도우 컴포넌트의 깔끔한 레트로 UI.',
      'card.neumorphism.desc': '배경과 완벽히 통일된 컬러 위에서 빛과 그림자 양각만으로 승부하는 룩.',
      'card.notion-style.desc': '사이드바와 블록 기반 콘텐츠, 미니멀 크롬의 깔끔한 프로덕티비티 UI.',
      'card.retro-pixel.desc': '게임보이 컬러와 RPG 스타일 UI 요소의 8비트 픽셀 아트 감성.',
      'card.organic-blob.desc': '자연에서 영감받은 톤과 부드러운 블롭 컨테이너의 유기적 흐름.',
      'card.duotone-bold.desc': '대담한 타이포그래피와 생동감 있는 그라데이션의 고대비 듀오톤 카드.',
      'card.framer-motion.desc': '그라데이션 텍스트, 글로우 보더, 등장 애니메이션의 모션 중심 SaaS 랜딩.',
      'btn.view': '페이지 보기',
      'btn.workflow': '프롬프트 적용',
      'btn.set-global': '★\uFE0E 글로벌 테마로 적용',
      'btn.applied': '★\uFE0E 적용 완료',
      'no-results.styles': '일치하는 스타일이 없습니다.',
      'no-results.fusion': '일치하는 퓨전 스타일이 없습니다.',
      'section.fusion': '조합 스타일 (Fusion)',
      'card.neon-swiss.desc': '네온 에너지와 스위스 디자인 정렬의 완벽한 결합.',
      'card.bento-noir.desc': '효율적인 벤토 구조에 다크 럭셔리를 얹어낸 프리미엄 룩.',
      'card.editorial-terminal.desc': '에디토리얼 특유의 압도적 가독성과 기술 로그 감성의 조화.',
      'card.holo-glass.desc': '몽환적인 유기적 배경에 투명한 입체감을 얹은 프리미엄 글래스모피즘.',
      'card.earth-zen.desc': '자연의 뉴트럴 톤과 압도적인 여백 미학의 최고급 갤러리 룩.',
      'card.kinetic-brutal.desc': '강렬한 원색 팝아트와 두꺼운 테두리, 파괴적인 와이어프레임.',
      'card.cyber-console.desc': '해커 콘솔 감성과 사이버펑크 네온 글리치의 치명적 융합.',
      'section.workflow': '프롬프트 생성기',
      'workflow.desc': '설계 ➔ 컴포넌트 제작 ➔ 프레임 조립 ➔ 품질 검증 (QA) 순서로 프롬프트를 자동 연속 생성합니다. 선택한 템플릿의 DNA를 이식한 개별 환경이 준비되어 있습니다.',
      'workflow.cta': '프롬프트 생성기 열기',
      'footer.desc': 'Web Stylebook — 다양한 디자인 스타일을 탐색하고, 퓨전 조합을 실험하며, 단계별 프롬프트를 자동 생성하는 크리에이티브 워크플로우 허브입니다.',
      'footer.stat.styles': '스타일 템플릿',
      'footer.stat.fusions': '퓨전 조합',
      'footer.stat.pages': '샘플 페이지',
      'footer.cta': '프롬프트 생성 시작',
      'footer.license': 'CC BY-NC 4.0 라이선스',
      'copy.success': '복사 완료',
      'copy.fail': '복사 실패',
      'back.hub': '허브로 돌아가기',
      'back.hub.aria': '허브로 돌아가기',
      'pw.nav.title': '프롬프트 생성기',
      'pw.nav.hub': '허브로 이동',
      'pw.hero.title': '설계 -> 컴포넌트 -> 조립 -> QA',
      'pw.hero.subtitle': '스타일/타이포/스택을 먼저 고정하고 단계별 프롬프트를 생성합니다. 템플릿 카드에서 들어오면 해당 스타일 톤이 이 페이지에 자동 적용됩니다.',
      'pw.input.title': 'INPUT CONFIG',
      'pw.label.project': '프로젝트 이름',
      'pw.label.target': '핵심 타겟',
      'pw.label.target.default': 'AI로 UI를 빠르게 제작하려는 1인 제작자/초기 팀',
      'pw.label.hub-ref': '디자인 허브 레퍼런스 (복수 선택)',
      'pw.btn.deselect': '선택 해제',
      'pw.label.product': '제품/서비스 설명',
      'pw.label.product.default': '디자인 샘플을 비교하고, 프롬프트를 단계별로 생성해 UI 생산성을 높이는 웹 허브',
      'pw.label.hub-summary': '허브 스타일 요약(자동 반영)',
      'pw.label.hub-summary.default': '선택한 디자인 허브 스타일이 여기에 자동으로 반영됩니다.',
      'pw.hint.hub-summary': '프롬프트에 자동 포함됩니다. 필요하면 직접 수정하세요.',
      'pw.label.typo-profile': '타이포그래피 프로필',
      'pw.option.typo-auto': '스타일 기반 추천 (기본)',
      'pw.option.typo-manual': '직접 입력 유지',
      'pw.hint.typo': '기본은 스타일 조합에 맞춘 추천값입니다.',
      'pw.label.font-heading': '헤드라인 폰트',
      'pw.label.font-body': '본문 폰트',
      'pw.label.font-code': '코드/터미널 폰트',
      'pw.label.type-density': '타이포 밀도',
      'pw.label.type-note': '타이포 메모',
      'pw.label.type-note.default': '헤드라인은 명확한 계층, 본문은 가독성 우선, 코드 텍스트는 보조 정보 영역에 제한 사용.',
      'pw.label.style-dir': '선호 스타일 방향',
      'pw.label.style-dir.default': '정보 구조는 명확하고, 장식은 절제하며, 컴포넌트 일관성이 높은 실무형 UI',
      'pw.label.must-keep': '반드시 유지할 것',
      'pw.label.must-keep.default': '모바일 안정성, 컴포넌트 재사용성, 가독성 우선 타이포, 클리핑 안전 규칙',
      'pw.label.pages': '필요 페이지',
      'pw.label.tech': '구현 스택',
      'pw.option.tech-custom': '직접 입력',
      'pw.placeholder.tech-custom': '예: Nuxt 3 + Tailwind + TypeScript + Storybook',
      'pw.label.forbidden': '금지사항',
      'pw.label.forbidden.default': '가로 스크롤, 의미 없는 과장 모션, 과한 blur, 낮은 대비 텍스트',
      'pw.state.title': '현재 설정',
      'pw.state.style': '스타일',
      'pw.state.style.none': '선택 안함',
      'pw.state.typo': '타이포',
      'pw.state.typo.auto': '스타일 기반 추천',
      'pw.state.stack': '스택',
      'pw.state.pages': '페이지',
      'pw.state.pages.count': '개',
      'pw.state.theme': '테마',
      'pw.step1': '1) 설계 프롬프트',
      'pw.step2': '2) 컴포넌트 프롬프트',
      'pw.step3': '3) 조립 프롬프트',
      'pw.step4': '4) QA 프롬프트',
      'pw.btn.copy': '복사',
      'pw.btn.expand': '펼치기',
      'pw.btn.collapse': '접기',
      'pw.full.title': '전체 실행 프롬프트',
      'pw.full.copy': '전체 복사',
      'pw.note1': '1. 스타일/타이포를 먼저 확정한 뒤 컴포넌트 단계로 내려가면 품질이 안정됩니다.',
      'pw.note2': '2. 조합 스타일은 가중치/우선순위를 함께 적어야 결과가 흔들리지 않습니다.',
      'pw.note3': '3. QA 단계에서 overflow, 반응형, 타이포 일관성을 동시에 검증하세요.',
      'pw.hint.no-ref': '선택한 레퍼런스 없음',
      'copy.done.label': '복사 완료!',

      // Color System
      'cs.title': '색상 시스템 및 테스트',
      'cs.colors': '색상',
      'cs.label.bg': '배경 (bg)',
      'cs.label.text': '텍스트 (text)',
      'cs.label.main': '메인 색상 (main)',
      'cs.label.sub': '서브 색상 (sub)',
      'cs.palette.title': '스타일 프리셋',
      'cs.palette.random': '랜덤 팔레트 셔플',
      'cs.filter.all': '전체',
      'cs.filter.dark': '다크',
      'cs.filter.light': '라이트',
      'cs.contrast.textBg': '텍스트 / 배경',
      'cs.contrast.mainBg': '메인 / 배경',
      'cs.contrast.subBg': '서브 / 배경',
      'cs.preview.title': '조화와 균형',
      'cs.preview.desc': '세심하게 선택된 컬러 팔레트가 UI에 생명을 불어넣습니다. 왼쪽 컨트롤을 조정하여 메인 색상과 서브 색상이 배경 및 텍스트와 어떻게 조화를 이루는지 즉시 테스트하세요.',
      'cs.preview.badge': '실시간 미리보기',
      'cs.preview.card.title': '색상 적용 예시',
      'cs.preview.card.desc': '선택한 팔레트가 실제 UI 컴포넌트에서 어떻게 보이는지 확인하세요. 버튼, 카드, 입력 필드 모두 색상 선택에 실시간으로 반응합니다.',
      'cs.btn.primary': '테마 적용',
      'cs.btn.secondary': '색상 초기화',
      'cs.toast.active': '색상 팔레트 테스트 진행중!',
      'cs.stat.users': '팔레트',
      'cs.stat.revenue': 'WCAG 통과',
      'cs.tab.general': '프로필',
      'cs.tab.security': '외관',
      'cs.tab.billing': '내보내기',
      'cs.field.email': '표시 이름',
      'cs.field.notifications': '다크 모드',
      'cs.field.2fa': '모서리 둥글기',
      'cs.field.2fa.app': '둥글게',
      'cs.field.2fa.sms': '각지게',
      'cs.field.plan': '형식',
      'cs.field.plan.pro': 'CSS 변수',
      'cs.field.plan.team': '디자인 토큰 (JSON)',
      'cs.alert.title': '팔레트 저장 완료',
      'cs.alert.desc': '커스텀 컬러 팔레트가 성공적으로 저장되었습니다. CSS 변수 또는 디자인 토큰으로 내보낼 수 있습니다.',
      'cs.export.title': '디자인 토큰 내보내기',
      'cs.export.desc': '현재 색상 팔레트를 바로 사용 가능한 코드로 내보냅니다.',
      'nav.colors': '조합 팁',

      // Compare page keys
      'compare.title': '스타일 비교',
      'compare.left': '왼쪽',
      'compare.right': '오른쪽',
      'compare.select': '스타일을 선택하세요...',
      'compare.swap': '교체',
      'compare.horizontal': '나란히',
      'compare.vertical': '위아래',
      'compare.empty': '미리보기할 스타일을 선택하세요',
      'compare.quickPairs': '추천 조합',

      // Fusion Lab page keys
      'fusion.lab.title': '퓨전 랩',
      'fusion.lab.heading': '커스텀 퓨전 생성기',
      'fusion.lab.desc': '두 가지 스타일을 골라 디자인 토큰을 블렌딩합니다. 비율을 조절해 원하는 조합을 찾아보세요.',
      'fusion.lab.styleA': '스타일 A',
      'fusion.lab.styleB': '스타일 B',
      'fusion.lab.ratio': '믹스 비율',
      'fusion.lab.result': '퓨전 결과',
      'fusion.lab.copyTokens': 'CSS 복사',
      'fusion.lab.copyPrompt': '프롬프트 복사',
      'fusion.lab.empty': '위에서 두 가지 스타일을 선택하면 퓨전 미리보기가 생성됩니다.',
      'fusion.lab.preview.desc': '두 스타일의 에센스를 결합한 커스텀 블렌드입니다.',
      'fusion.lab.preview.cardTitle': '컴포넌트 미리보기',
      'fusion.lab.preview.cardDesc': '블렌딩된 토큰이 하나의 UI 요소로 어떻게 조화를 이루는지 보여줍니다.',
      'fusion.lab.preview.btnPrimary': '기본 동작',
      'fusion.lab.preview.btnSecondary': '보조',

      // Prompt Tips page
      'tips.title': '프롬프트 팁',
      'tips.hero.title': '획일화된 AI 디자인에서 벗어나기',
      'tips.hero.sub': 'AI는 매번 같은 "안전한" 결과를 냅니다: 소프트 그라디언트, 과도한 둥글기, 의미 없는 블러. 이 팁들은 그 기본값을 깨고, 의도가 담긴 디자인을 만드는 프롬프트를 쓰는 법을 알려줍니다.',
      'tips.toc': '목차',
      'tips.toc.1': 'AI가 빠지는 패턴들',
      'tips.toc.2': '프롬프트 원칙',
      'tips.toc.3': 'Before / After',
      'tips.toc.4': '바로 쓰는 스니펫',
      'tips.s1.title': 'AI가 빠지는 패턴들',
      'tips.s1.intro': '모호한 프롬프트를 주면 AI는 익숙한 패턴에 빠집니다. 이를 인식하는 것이 피하는 첫 번째 단계입니다.',
      'tips.label.trap': '함정',
      'tips.label.vague': '모호한 프롬프트',
      'tips.label.specific': '구체적인 프롬프트',
      'tips.label.before': 'Before',
      'tips.label.after': 'After',
      'tips.anti.1.title': '그라디언트 안개',
      'tips.anti.1.desc': '브랜드와 무관한 보라-파랑 그라디언트 배경. 실제 시각적 위계 대신 무분별하게 적용됩니다.',
      'tips.anti.1.bad': '"모던하고 시각적으로 매력적인 그라디언트 배경을 써줘"',
      'tips.anti.1.good': '"배경: 단색 #0b0d12. 히어로 CTA 버튼에만 linear gradient 하나 사용 (왼쪽: #2563eb, 오른쪽: #7c3aed). 나머지에는 그라디언트 금지."',
      'tips.anti.2.title': '블러 의존',
      'tips.anti.2.desc': '모든 패널에 backdrop-filter: blur()를 적용해 페이지가 흐릿하고 근거 없이 보입니다. 블러는 의도적으로만 써야 합니다.',
      'tips.anti.2.bad': '"프리미엄 느낌의 글래스모피즘을 써줘"',
      'tips.anti.2.good': '"카드: 배경 rgba(28,28,30,0.85), 보더 1px rgba(255,255,255,0.08). backdrop-filter: blur(16px)는 플로팅 네비 오버레이에만 적용. 카드나 섹션에는 블러 금지."',
      'tips.anti.3.title': '모든 것을 둥글게',
      'tips.anti.3.desc': '모든 요소에 border-radius: 16px를 주면 장난감 같은 획일성이 생깁니다. 의도적인 radius 변화가 위계를 전달합니다.',
      'tips.anti.3.bad': '"친근한 느낌으로 둥근 모서리를 써줘"',
      'tips.anti.3.good': '"Radius 체계: 컨테이너 16px, 카드 12px, 버튼 8px, 뱃지 4px. 태그와 인라인 요소는 2px. 전체 너비 섹션에는 border-radius 사용 금지."',
      'tips.anti.4.title': '아이콘 3열 반복',
      'tips.anti.4.desc': '원형 아이콘 + 제목 + 문단을 동일하게 3열 반복. 가장 게으른 기능 소개 레이아웃입니다.',
      'tips.anti.4.bad': '"아이콘이 있는 기능 섹션을 만들어줘"',
      'tips.anti.4.good': '"기능: 비대칭 벤토 그리드. 주요 기능은 2열 스팬에 인라인 데모 스크린샷. 보조 기능은 아이콘 대신 모노스페이스 라벨이 있는 1열 카드."',
      'tips.anti.5.title': '장식 애니메이션',
      'tips.anti.5.desc': '정보 전달 가치가 없는 떠다니는 오브, 파티클, 스크롤 트리거 페이드인. 모션은 이해를 돕기 위한 것이지 장식이 아닙니다.',
      'tips.anti.5.bad': '"역동적이고 살아있는 느낌의 애니메이션을 추가해줘"',
      'tips.anti.5.good': '"전환: hover 상태에만 200ms ease. 스크롤 트리거 애니메이션 없음. 떠다니거나 맥동하는 장식 요소 없음. prefers-reduced-motion 준수."',
      'tips.anti.6.title': '모든 텍스트 중앙 정렬',
      'tips.anti.6.desc': '모든 텍스트 블록을 중앙 정렬하면 줄 시작점이 매번 달라져 읽기 흐름이 끊깁니다. 중앙 정렬은 짧은 헤딩이나 CTA에만 적합하고, 본문은 항상 좌측 정렬에 줄 길이를 제어해야 합니다.',
      'tips.anti.6.bad': '"깔끔하고 균형 잡힌 레이아웃으로 텍스트를 전부 중앙 정렬해줘"',
      'tips.anti.6.good': '"본문: 좌측 정렬, max-width 640px. 중앙 정렬 대상: 섹션 헤딩과 CTA 버튼만. 한 줄 글자 수 75자 초과 금지."',
      'tips.s2.title': '프롬프트 원칙',
      'tips.s2.intro': '이 원칙들은 AI를 "예쁘게 만들어" 모드에서 "정밀한 디자인 시방서를 실행하는" 모드로 전환시킵니다.',
      'tips.p.1.title': '형용사가 아닌 구체적 스타일을 지명하라',
      'tips.p.1.desc': '"모던"과 "깔끔"은 AI에게 아무 의미가 없습니다 — 같은 기본 결과물로 이어집니다. 대신 명명된 디자인 방향을 참조하세요. 이 프로젝트의 22가지 스타일 템플릿이 바로 그 용도입니다.',
      'tips.p.1.tip': '"모던하고 깔끔하게" \u2192 "Swiss Poster 스타일: 그리드 정렬, 헬베티카 파생 산세리프, 빨강+검정+흰색만 사용, 강한 수직 리듬"',
      'tips.p.2.title': '타이포그래피를 가장 먼저 잠가라',
      'tips.p.2.desc': '타이포그래피가 디자인 성격의 80%를 결정합니다. 지정하지 않으면 AI는 매번 Inter/system-ui를 선택하고, 당신의 디자인은 다른 모든 AI 결과물과 즉시 같아집니다.',
      'tips.p.2.tip': '헤딩 폰트, 본문 폰트, 코드 폰트, 크기 스케일 (예: 14/16/20/28/40), line-height (본문 1.5, 헤딩 1.2), 헤딩 letter-spacing (-0.02em).',
      'tips.p.3.title': '금지 조건을 정의하라',
      'tips.p.3.desc': 'AI는 최적화기입니다. 제약 없이는 통계적으로 "안전한" 선택으로 흐릅니다. 명시적 금지는 긍정적 지시보다 획일적 결과를 피하는 데 더 효과적입니다.',
      'tips.p.3.tip': '"FORBIDDEN" 섹션: 가로 스크롤 금지, 그라디언트 배경 금지, 8px 이상 블러 금지, 0 2px 8px 이상 그림자 금지, 12px 이상 border-radius 금지, 장식용 SVG 일러스트 금지.',
      'tips.p.4.title': '색상은 설명이 아닌 정확한 값으로 지정하라',
      'tips.p.4.desc': '"파란 액센트"는 거의 매번 #3B82F6을 만들어냅니다. 모든 AI가 같은 안전한 파랑을 씁니다. Color System 페이지에서 팔레트를 만들고 hex 값을 그대로 전달하세요.',
      'tips.p.4.tip': '"Primary: #e63946, Surface: #1d1d1f, Text: #f1faee, Muted: #a8a8a8, Border: rgba(255,255,255,0.08). 다른 색상 사용 금지."',
      'tips.p.5.title': '레이아웃은 느낌이 아닌 구조로 서술하라',
      'tips.p.5.desc': '"넓고 깔끔한 레이아웃"은 주관적입니다. AI는 마음대로 해석합니다. 대신 그리드 사양, max-width, gap 값, padding 규칙을 제시하세요.',
      'tips.p.5.tip': '"콘텐츠 max-width: 720px. 섹션 padding: 80px 0. 카드 그리드: 2열, 16px gap. 히어로: 1열, 좌측 정렬, 텍스트 중앙 정렬 금지."',
      'tips.p.6.title': '페이지 설명이 아닌 컴포넌트 위계를 제시하라',
      'tips.p.6.desc': '"랜딩 페이지를 만들어줘"는 AI에게 완전한 자유를 줍니다. 대신 정확한 컴포넌트 스택과 그들의 관계를 지정하세요.',
      'tips.p.6.tip': '"위에서 아래로: 컴팩트 네비 (로고 왼쪽, 링크 3개 오른쪽) / 히어로 (h1 + 서브타이틀 + CTA 1개, 이미지 없음) / 3열 벤토 기능 / 추천사 1개 / 2열 링크 그리드 푸터."',
      'tips.p.7.title': '줄 길이(measure)를 제어하라',
      'tips.p.7.desc': '텍스트가 넓은 컨테이너의 전체 폭으로 흐르면 한 줄이 너무 길어져 다음 줄로 돌아갈 때 시선을 잃습니다. 본문 텍스트의 최적 줄 길이는 45~75자 (16px 기준 대략 max-width 640px)입니다.',
      'tips.p.7.tip': '"본문 max-width: 640px. 헤딩은 컨테이너 전체 폭 사용 가능. 코드 블록과 카드는 전체 폭 사용. 문단의 한 줄 길이 75자 초과 금지."',
      'tips.s3.title': 'Before / After',
      'tips.s3.intro': '약한 프롬프트 vs 강한 프롬프트의 나란히 비교. 오른쪽이 긴 이유는 장황해서가 아니라 — 추가된 단어 하나하나가 AI에게서 자유도를 한 겹씩 벗기기 때문입니다.',
      'tips.ba.1.title': '랜딩 페이지 히어로',
      'tips.ba.2.title': '카드 컴포넌트',
      'tips.ba.3.title': '대시보드 레이아웃',
      'tips.s4.title': '바로 쓰는 스니펫',
      'tips.s4.intro': '프롬프트에 바로 붙여넣으세요. 스니펫은 영어로 유지했습니다. 대부분의 AI 모델이 영어 제약 조건을 더 정확하게 해석하여, 결과물의 모호함을 줄일 수 있습니다.',
      'tips.cheat.1.title': '획일화 방지 제약',
      'tips.cheat.2.title': '타이포그래피 잠금',
      'tips.cheat.3.title': '색상 시스템 전달',
      'tips.cheat.4.title': '레이아웃 사양',
      'tips.cheat.5.title': '모션 제약',
      'tips.cheat.6.title': '품질 점검 프롬프트',
      'tips.copy': '복사',

      // Common page keys
      'page.heading.prompt': 'AI 요청 프롬프트',
      'page.btn.copy': '프롬프트 복사',
      'page.nav.hub': '허브로 이동',
      'page.nav.aria': '페이지 내비게이션',
      'page.nav.prev': '이전',
      'page.nav.next': '다음',
    },

    /* ─── Japanese ─── */
    ja: {
      'skip': '本文へスキップ',
      'nav.styles': 'スタイル',
      'nav.compare': 'スタイル比較',
      'nav.fusionLab': 'フュージョンラボ',
      'nav.hub': 'ハブホーム',
      'nav.tips': '配色',
      'nav.workflow': 'プロンプト作成',
      'nav.more-tips': 'ヒント',
      'theme.toggle.aria': 'テーマ切替',
      'theme.toggle.title': 'ライト/ダークテーマ切替',
      'lang.toggle.aria': '言語切替',
      'hero.aria': 'ヒーロー',
      'hero.desc': 'テンプレート別のサンプルページを確認し、スタイルの組み合わせをワークフローに反映してステップ別プロンプトを生成するハブです。クリエイティブなウェブ体験の設計を始めましょう。',
      'chip.style-split': 'テンプレート別スタイル分離',
      'chip.combo': '組み合わせスタイル実験',
      'chip.prompt': 'プロンプト管理',
      'chip.workflow': 'ワークフロー連携',
      'stat.aria': '主要統計',
      'section.styles': 'スタイルサンプルページ',
      'search.placeholder': 'スタイル検索...',
      'search.aria': 'スタイル検索',
      'filter.aria': 'タグフィルター',
      'filter.all': '全て',
      'palette.aria': '代表カラー',
      'card.neon-drift.desc': '夜の都市、ネオン、グロー中心のダイナミックなスタイル。',
      'card.editorial-silence.desc': '雑誌的タイポグラフィと余白を活かした抑制の美。',
      'card.kinetic-pop.desc': '強烈なカラーコントラストとリズム感のあるモーション中心。',
      'card.earth-atelier.desc': '自然の質感とニュートラルな感性ベースのレイアウト。',
      'card.brutalist-grid.desc': '太く荒い線、構造的なタイポブロックシステム。',
      'card.glass-orbit.desc': '透明レイヤーの重なりと奥行き感を活かした3Dグラスモーフィズム。',
      'card.midnight-noir.desc': '圧倒的なダークラグジュアリーと繊細なゴールド/シルバーポイント。',
      'card.bento-bloom.desc': '柔らかなパステルトーンとApple感性のBentoグリッド構造。',
      'card.terminal-core.desc': 'モノスペースフォントと開発者コンソールナラティブ。',
      'card.console-launch.desc': 'ダークオンボーディング方式のインタラクティブカーソルとパネル。',
      'card.swiss-poster.desc': 'グリッドシステムと整列中心の情報指向スタイル。',
      'card.holographic-fluid.desc': 'ホログラフィックメッシュグラデーションと幻想的な流体モーション。',
      'card.cyberpunk-glitch.desc': 'ネオンコントラストとモノスペース、グリッチが融合したターミナルルック。',
      'card.zen-minimalism.desc': '極限の余白とセリフフォントで本質に集中するスタイル。',
      'card.aurora-gradient.desc': 'オーロラのように有機的に流れるマルチカラーブラーグラデーション背景。',
      'card.grain-texture.desc': 'フィルムグレインオーバーレイとミュートトーンのアナログ感性スタイル。',
      'card.liquid-metal.desc': 'クロームとメタリック質感の反射効果、モノクロームシルバーパレット。',
      'card.mesh-gradient.desc': 'Apple風マルチポイントメッシュグラデーション、明るく洗練された印象。',
      'card.mono-type.desc': 'タイポグラフィのサイズと太さだけで階層を作るモノクロームスタイル。',
      'card.soft-pastel.desc': 'ウルトラソフトパステルトーンと丸いピル形の温かいインターフェース。',
      'card.claymorphism.desc': '柔らかなダブルシャドウ（立体ボリューム）ベースの親和型ウェブ構造。',
      'card.y2k-retro.desc': 'ベベルクローム、ティールデスクトップ、クラシックウィンドウコンポーネントのクリーンなレトロUI。',
      'card.neumorphism.desc': '背景と完全統一されたカラーの上で光と影のエンボスだけで表現するルック。',
      'card.notion-style.desc': 'サイドバーとブロックベースのコンテンツ、ミニマルクロームのクリーンなプロダクティビティUI。',
      'card.retro-pixel.desc': 'ゲームボーイカラーとRPGスタイルUI要素の8ビットピクセルアート感性。',
      'card.organic-blob.desc': '自然にインスパイアされたトーンとソフトなブロブコンテナの有機的なフロー。',
      'card.duotone-bold.desc': '大胆なタイポグラフィと鮮やかなグラデーションのハイコントラストデュオトーンカード。',
      'card.framer-motion.desc': 'グラデーションテキスト、グローボーダー、エントランスアニメーションのモーション中心SaaSランディング。',
      'btn.view': 'ページを見る',
      'btn.workflow': 'ワークフロー適用',
      'btn.set-global': '★\uFE0E グローバル適用',
      'btn.applied': '★\uFE0E 適用完了',
      'no-results.styles': '一致するスタイルがありません。',
      'no-results.fusion': '一致するフュージョンスタイルがありません。',
      'section.fusion': '組み合わせスタイル（Fusion）',
      'card.neon-swiss.desc': 'ネオンエネルギーとスイスデザイン整列の完璧な融合。',
      'card.bento-noir.desc': '効率的なBentoレイアウトにダークラグジュアリーを載せたプレミアムルック。',
      'card.editorial-terminal.desc': 'エディトリアル特有の圧倒的可読性とテックログ感性の調和。',
      'card.holo-glass.desc': '幻想的な有機的背景に透明な立体感を載せたプレミアムグラスモーフィズム。',
      'card.earth-zen.desc': '自然のニュートラルトーンと圧倒的な余白美学の最高級ギャラリールック。',
      'card.kinetic-brutal.desc': '強烈な原色ポップアートと太い枠線、破壊的なワイヤーフレーム。',
      'card.cyber-console.desc': 'ハッカーコンソール感性とサイバーパンクネオングリッチの致命的融合。',
      'section.workflow': 'プロンプトジェネレーター',
      'workflow.desc': '設計 ➔ コンポーネント制作 ➔ フレーム組立 ➔ 品質検証（QA）の順でプロンプトを自動連続生成します。選択したテンプレートのDNAを移植した個別環境が準備されています。',
      'workflow.cta': 'プロンプトジェネレーターを開く',
      'footer.desc': 'Web Stylebook — 多様なデザインスタイルを探索し、フュージョン組み合わせを実験し、ステップ別プロンプトを自動生成するクリエイティブワークフローハブです。',
      'footer.stat.styles': 'スタイルテンプレート',
      'footer.stat.fusions': 'フュージョン組み合わせ',
      'footer.stat.pages': 'サンプルページ',
      'footer.cta': 'プロンプト生成を開始',
      'footer.license': 'CC BY-NC 4.0 ライセンス',
      'copy.success': 'コピー完了',
      'copy.fail': 'コピー失敗',
      'back.hub': 'ハブに戻る',
      'back.hub.aria': 'ハブに戻る',
      'pw.nav.title': 'プロンプトジェネレーター',
      'pw.nav.hub': 'ハブへ移動',
      'pw.hero.title': '設計 → コンポーネント → 組立 → QA',
      'pw.hero.subtitle': 'スタイル/タイポ/スタックを先に固定してステップ別プロンプトを生成します。テンプレートカードから入ると、そのスタイルトーンがこのページに自動適用されます。',
      'pw.input.title': 'INPUT CONFIG',
      'pw.label.project': 'プロジェクト名',
      'pw.label.target': 'コアターゲット',
      'pw.label.target.default': 'AIでUIを素早く制作したい個人制作者/初期チーム',
      'pw.label.hub-ref': 'デザインハブリファレンス（複数選択）',
      'pw.btn.deselect': '選択解除',
      'pw.label.product': '製品/サービス説明',
      'pw.label.product.default': 'デザインサンプルを比較し、プロンプトをステップ別に生成してUI生産性を高めるウェブハブ',
      'pw.label.hub-summary': 'ハブスタイル要約（自動反映）',
      'pw.label.hub-summary.default': '選択したデザインハブスタイルがここに自動反映されます。',
      'pw.hint.hub-summary': 'プロンプトに自動含有されます。必要に応じて直接編集してください。',
      'pw.label.typo-profile': 'タイポグラフィプロファイル',
      'pw.option.typo-auto': 'スタイルベース推薦（デフォルト）',
      'pw.option.typo-manual': '手動入力を維持',
      'pw.hint.typo': 'デフォルトはスタイル組み合わせに基づく推薦値です。',
      'pw.label.font-heading': '見出しフォント',
      'pw.label.font-body': '本文フォント',
      'pw.label.font-code': 'コード/ターミナルフォント',
      'pw.label.type-density': 'タイポ密度',
      'pw.label.type-note': 'タイポメモ',
      'pw.label.type-note.default': '見出しは明確な階層、本文は可読性優先、コードテキストは補助情報領域に制限使用。',
      'pw.label.style-dir': '希望スタイル方向',
      'pw.label.style-dir.default': '情報構造は明確で、装飾は抑制し、コンポーネント一貫性が高い実務型UI',
      'pw.label.must-keep': '必ず維持すること',
      'pw.label.must-keep.default': 'モバイル安定性、コンポーネント再利用性、可読性優先タイポ、クリッピング安全ルール',
      'pw.label.pages': '必要ページ',
      'pw.label.tech': '実装スタック',
      'pw.option.tech-custom': '手動入力',
      'pw.placeholder.tech-custom': '例：Nuxt 3 + Tailwind + TypeScript + Storybook',
      'pw.label.forbidden': '禁止事項',
      'pw.label.forbidden.default': '横スクロール、無意味な誇張モーション、過度なblur、低コントラストテキスト',
      'pw.state.title': '現在の設定',
      'pw.state.style': 'スタイル',
      'pw.state.style.none': '未選択',
      'pw.state.typo': 'タイポ',
      'pw.state.typo.auto': 'スタイルベース推薦',
      'pw.state.stack': 'スタック',
      'pw.state.pages': 'ページ',
      'pw.state.pages.count': 'ページ',
      'pw.state.theme': 'テーマ',
      'pw.step1': '1) 設計プロンプト',
      'pw.step2': '2) コンポーネントプロンプト',
      'pw.step3': '3) 組立プロンプト',
      'pw.step4': '4) QAプロンプト',
      'pw.btn.copy': 'コピー',
      'pw.btn.expand': '展開',
      'pw.btn.collapse': '折りたたむ',
      'pw.full.title': '全体実行プロンプト',
      'pw.full.copy': '全体コピー',
      'pw.note1': '1. スタイル/タイポを先に確定してからコンポーネント段階に進むと品質が安定します。',
      'pw.note2': '2. 組み合わせスタイルは重み/優先順位を一緒に記述しないと結果がぶれます。',
      'pw.note3': '3. QA段階でoverflow、レスポンシブ、タイポ一貫性を同時に検証してください。',
      'pw.hint.no-ref': '選択したリファレンスなし',
      'copy.done.label': 'コピー完了！',

      // Color System
      'cs.title': 'カラーシステムテスト',
      'cs.colors': '色設定',
      'cs.label.bg': '背景 (bg)',
      'cs.label.text': 'テキスト (text)',
      'cs.label.main': 'メイン (main)',
      'cs.label.sub': 'サブ (sub)',
      'cs.palette.title': 'スタイルプリセット',
      'cs.palette.random': 'ランダムパレット',
      'cs.filter.all': '全て',
      'cs.filter.dark': 'ダーク',
      'cs.filter.light': 'ライト',
      'cs.contrast.textBg': 'テキスト / 背景',
      'cs.contrast.mainBg': 'メイン / 背景',
      'cs.contrast.subBg': 'サブ / 背景',
      'cs.preview.title': '調和とバランス',
      'cs.preview.desc': '慎重に選ばれたカラーパレットがUIに命を吹き込みます。左側のコントロールで色を調整し、デザインのコントラストを今すぐテストしましょう。',
      'cs.preview.badge': 'ライブプレビュー',
      'cs.preview.card.title': 'カラー適用例',
      'cs.preview.card.desc': '選択したパレットが実際のUIコンポーネントでどう見えるか確認しましょう。ボタン、カード、入力欄すべてがリアルタイムで反応します。',
      'cs.btn.primary': 'テーマ適用',
      'cs.btn.secondary': 'リセット',
      'cs.toast.active': 'カラーテスト実行中！',
      'cs.stat.users': 'パレット',
      'cs.stat.revenue': 'WCAG合格',
      'cs.tab.general': 'プロフィール',
      'cs.tab.security': '外観',
      'cs.tab.billing': 'エクスポート',
      'cs.field.email': '表示名',
      'cs.field.notifications': 'ダークモード',
      'cs.field.2fa': '角丸',
      'cs.field.2fa.app': 'ラウンド',
      'cs.field.2fa.sms': 'シャープ',
      'cs.field.plan': '形式',
      'cs.field.plan.pro': 'CSS変数',
      'cs.field.plan.team': 'デザイントークン（JSON）',
      'cs.alert.title': 'パレット保存完了',
      'cs.alert.desc': 'カスタムカラーパレットが保存されました。CSS変数またはデザイントークンとしてエクスポートできます。',
      'cs.export.title': 'デザイントークンのエクスポート',
      'cs.export.desc': '現在のカラーパレットをコードとしてエクスポートします。',
      'nav.colors': '色設定',

      // Compare page keys
      'compare.title': 'スタイル比較',
      'compare.left': '左',
      'compare.right': '右',
      'compare.select': 'スタイルを選択...',
      'compare.swap': '入れ替え',
      'compare.horizontal': '横並び',
      'compare.vertical': '縦並び',
      'compare.empty': 'プレビューするスタイルを選択',
      'compare.quickPairs': 'おすすめペア',

      // Fusion Lab page keys
      'fusion.lab.title': 'フュージョンラボ',
      'fusion.lab.heading': 'カスタムフュージョン生成',
      'fusion.lab.desc': '2つのスタイルを選んでデザイントークンをブレンドします。比率を調整して最適な組み合わせを見つけましょう。',
      'fusion.lab.styleA': 'スタイルA',
      'fusion.lab.styleB': 'スタイルB',
      'fusion.lab.ratio': 'ミックス比率',
      'fusion.lab.result': 'フュージョン結果',
      'fusion.lab.copyTokens': 'CSSコピー',
      'fusion.lab.copyPrompt': 'プロンプトコピー',
      'fusion.lab.empty': '上の2つのスタイルを選択すると、フュージョンプレビューが生成されます。',
      'fusion.lab.preview.desc': '2つのスタイルのエッセンスを融合したカスタムブレンドです。',
      'fusion.lab.preview.cardTitle': 'コンポーネントプレビュー',
      'fusion.lab.preview.cardDesc': 'ブレンドされたトークンが1つのUI要素としてどう調和するかを示します。',
      'fusion.lab.preview.btnPrimary': 'メインアクション',
      'fusion.lab.preview.btnSecondary': 'サブ',

      // Nav
      'nav.tips': 'ヒント',

      // Prompt Tips page
      'tips.title': 'プロンプトヒント',
      'tips.hero.title': '画一的なAIデザインから脱却する',
      'tips.hero.sub': 'AIは毎回同じ「安全な」見た目を出します：ソフトグラデーション、過度な丸み、無意味なブラー。これらのヒントで、デフォルトを打ち破り、意図のあるデザインを生むプロンプトを書きましょう。',
      'tips.toc': '目次',
      'tips.toc.1': 'AIが陥るパターン',
      'tips.toc.2': 'プロンプト原則',
      'tips.toc.3': 'Before / After',
      'tips.toc.4': 'コピー用スニペット',
      'tips.s1.title': 'AIが陥るパターン',
      'tips.s1.intro': '曖昧なプロンプトを与えると、AIは慣れ親しんだパターンに陥ります。それを認識することが回避の第一歩です。',
      'tips.label.trap': '罠',
      'tips.label.vague': '曖昧なプロンプト',
      'tips.label.specific': '具体的なプロンプト',
      'tips.label.before': 'Before',
      'tips.label.after': 'After',
      'tips.anti.1.title': 'グラデーションの霧',
      'tips.anti.1.desc': 'ブランドと無関係な紫〜青のグラデーション背景。実際の視覚的階層の代わりにどこにでも適用されます。',
      'tips.anti.2.title': 'ブラー依存',
      'tips.anti.2.desc': 'すべてのパネルにbackdrop-filter: blur()を適用し、ページが霧がかって見えます。ブラーは意図的に使うべきです。',
      'tips.anti.3.title': 'すべてを丸く',
      'tips.anti.3.desc': 'すべての要素にborder-radius: 16pxを適用するとおもちゃのような均一性が生まれます。意図的なradius変化が階層を伝えます。',
      'tips.anti.4.title': 'アイコン3列繰り返し',
      'tips.anti.4.desc': '円形アイコン＋見出し＋段落を同一に3列繰り返し。最も怠惰な機能紹介レイアウトです。',
      'tips.anti.5.title': '装飾アニメーション',
      'tips.anti.5.desc': '情報伝達価値のない浮遊オーブ、パーティクル、スクロールトリガーフェードイン。モーションは理解を助けるものであり装飾ではありません。',
      'tips.anti.6.title': 'すべてのテキストを中央揃え',
      'tips.anti.6.desc': 'すべてのテキストブロックを中央揃えにすると行の開始位置が予測不能になり、読みの流れが壊れます。中央揃えは短い見出しやCTAにのみ適しており、本文は常に左揃えで行長を制御すべきです。',
      'tips.anti.6.bad': '「クリーンでバランスの取れたレイアウトのためにテキストをすべて中央揃えにして」',
      'tips.anti.6.good': '「本文：左揃え、max-width 640px。中央揃え対象：セクション見出しとCTAボタンのみ。段落の1行あたり75文字超過禁止。」',
      'tips.s2.title': 'プロンプト原則',
      'tips.s2.intro': 'これらの原則は、AIを「きれいに作って」モードから「精密なデザイン仕様書を実行する」モードに切り替えます。',
      'tips.p.1.title': '形容詞ではなく具体的なスタイルを指名する',
      'tips.p.1.desc': '「モダン」「クリーン」はAIにとって無意味です — 同じ汎用的な出力になります。代わりに名前のあるデザイン方向を参照してください。このプロジェクトの22のスタイルテンプレートがそのためにあります。',
      'tips.p.1.tip': '「モダンでクリーン」\u2192「Swiss Posterスタイル：グリッド整列、ヘルベチカ派生サンセリフ、赤＋黒＋白のみ、強い垂直リズム」',
      'tips.p.2.title': 'タイポグラフィを最初にロックする',
      'tips.p.2.desc': 'タイポグラフィがデザインの性格の80%を決めます。指定しないとAIは毎回Inter/system-uiを選び、あなたのデザインは他のすべてのAI出力と同じになります。',
      'tips.p.2.tip': '見出しフォント、本文フォント、コードフォント、サイズスケール（例：14/16/20/28/40）、line-height（本文1.5、見出し1.2）、見出しletter-spacing（-0.02em）。',
      'tips.p.3.title': '禁止条件を定義する',
      'tips.p.3.desc': 'AIはオプティマイザーです。制約がないと統計的に「安全な」選択に流れます。明示的な禁止は、汎用的な結果を避けるのに肯定的な指示より効果的です。',
      'tips.p.3.tip': '「FORBIDDEN」セクション：横スクロール禁止、グラデーション背景禁止、8px以上のブラー禁止、0 2px 8px以上のシャドウ禁止、12px以上のborder-radius禁止、装飾SVGイラスト禁止。',
      'tips.p.4.title': '色は説明ではなく正確な値で指定する',
      'tips.p.4.desc': '「青いアクセント」はほぼ毎回#3B82F6を生成します。すべてのAIが同じ安全な青を使います。Color Systemページでパレットを作り、hex値をそのまま渡しましょう。',
      'tips.p.4.tip': '「Primary: #e63946, Surface: #1d1d1f, Text: #f1faee, Muted: #a8a8a8, Border: rgba(255,255,255,0.08)。他の色は使用禁止。」',
      'tips.p.5.title': 'レイアウトは感覚ではなく構造で記述する',
      'tips.p.5.desc': '「広々としてクリーンなレイアウト」は主観的です。AIは好きなように解釈します。代わりにグリッド仕様、max-width、gap値、paddingルールを与えましょう。',
      'tips.p.5.tip': '「コンテンツmax-width: 720px。セクションpadding: 80px 0。カードグリッド: 2列、16px gap。ヒーロー: 1列、左揃え、テキスト中央揃え禁止。」',
      'tips.p.6.title': 'ページ説明ではなくコンポーネント階層を提示する',
      'tips.p.6.desc': '「ランディングページを作って」はAIに完全な自由を与えます。代わりに正確なコンポーネントスタックとその関係を指定しましょう。',
      'tips.p.6.tip': '「上から下へ：コンパクトナビ（ロゴ左、リンク3つ右）/ ヒーロー（h1＋サブタイトル＋CTA1つ、画像なし）/ 3列ベントー機能 / 推薦文1つ / 2列リンクグリッドフッター。」',
      'tips.p.7.title': '行長（measure）を制御する',
      'tips.p.7.desc': 'テキストが広いコンテナの全幅に流れると1行が長すぎて、次の行に戻る際に視線を見失います。本文テキストの最適な行長は45〜75文字（16pxフォントサイズで約max-width 640px）です。',
      'tips.p.7.tip': '「本文max-width: 640px。見出しはコンテナ全幅使用可。コードブロックとカードは全幅使用。段落の1行75文字超過禁止。」',
      'tips.s3.title': 'Before / After',
      'tips.s3.intro': '弱いプロンプト vs 強いプロンプトの並列比較。右側が長いのは冗長だからではなく — 追加された単語一つ一つがAIから自由度を一枚ずつ剥がすからです。',
      'tips.ba.1.title': 'ランディングページヒーロー',
      'tips.ba.2.title': 'カードコンポーネント',
      'tips.ba.3.title': 'ダッシュボードレイアウト',
      'tips.s4.title': 'コピー用スニペット',
      'tips.s4.intro': 'プロンプトに直接貼り付けてください。スニペットは英語のまま維持しています。ほとんどのAIモデルは英語の制約をより正確に解釈するため、出力の曖昧さを減らすことができます。',
      'tips.cheat.1.title': '画一化防止制約',
      'tips.cheat.2.title': 'タイポグラフィロック',
      'tips.cheat.3.title': 'カラーシステム引き渡し',
      'tips.cheat.4.title': 'レイアウト仕様',
      'tips.cheat.5.title': 'モーション制約',
      'tips.cheat.6.title': '品質チェックプロンプト',
      'tips.copy': 'コピー',

      // Common page keys
      'page.heading.prompt': 'AIリクエストプロンプト',
      'page.btn.copy': 'プロンプトをコピー',
      'page.nav.hub': 'ハブへ移動',
      'page.nav.aria': 'ページナビゲーション',
      'page.nav.prev': '前へ',
      'page.nav.next': '次へ',
    }
  };

  /** Get current language */
  function getCurrentLang() {
    return localStorage.getItem('lang') || 'en';
  }

  /** Get a translation string by key */
  function t(key) {
    const lang = getCurrentLang();
    return (translations[lang] && translations[lang][key]) ||
      (translations.en && translations.en[key]) ||
      key;
  }

  /** Apply translations to all data-i18n elements */
  function applyTranslations() {
    const lang = getCurrentLang();
    document.documentElement.lang = lang;

    // textContent
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (val !== key) el.textContent = val;
    });

    // placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = t(key);
      if (val !== key) el.placeholder = val;
    });

    // aria-label
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      const val = t(key);
      if (val !== key) el.setAttribute('aria-label', val);
    });

    // title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const val = t(key);
      if (val !== key) el.title = val;
    });

    // value (textarea / input default values)
    document.querySelectorAll('[data-i18n-value]').forEach(el => {
      const key = el.getAttribute('data-i18n-value');
      const val = t(key);
      if (val !== key) el.value = val;
    });

    // Show/hide data-lang elements (for page-specific content)
    document.querySelectorAll('[data-lang]').forEach(el => {
      el.hidden = el.getAttribute('data-lang') !== lang;
    });

    // Update language dropdown state
    const LANG_NAMES = { en: 'English', ko: '한국어', ja: '日本語' };
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
      langBtn.textContent = LANG_NAMES[lang] || lang;
    }
    // Mark active item in dropdown menu
    document.querySelectorAll('[data-lang-select]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang-select') === lang);
    });
  }

  /** Switch language and persist */
  function setLang(lang) {
    localStorage.setItem('lang', lang);
    applyTranslations();
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  /** Cycle through en → ko → ja → en */
  function toggleLang() {
    const LANGS = ['en', 'ko', 'ja'];
    const current = getCurrentLang();
    const nextIdx = (LANGS.indexOf(current) + 1) % LANGS.length;
    setLang(LANGS[nextIdx]);
  }

  // Expose globally for app.js and inline scripts
  window.i18n = { getCurrentLang, t, applyTranslations, setLang, toggleLang };

  /** Initialize dropdown or fallback to cycle toggle */
  function initLangUI() {
    applyTranslations();

    const dropdown = document.getElementById('lang-dropdown');
    const langBtn = document.getElementById('lang-toggle');

    if (dropdown && langBtn) {
      // Toggle dropdown open/close
      langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
      });

      // Language selection from menu
      dropdown.querySelectorAll('[data-lang-select]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          setLang(btn.getAttribute('data-lang-select'));
          dropdown.classList.remove('open');
        });
      });

      // Close on outside click
      document.addEventListener('click', () => {
        dropdown.classList.remove('open');
      });
    } else if (langBtn) {
      // Fallback: simple cycle toggle for pages without dropdown
      langBtn.addEventListener('click', toggleLang);
    }
  }

  // Apply on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLangUI);
  } else {
    initLangUI();
  }
})();
