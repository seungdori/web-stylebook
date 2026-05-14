import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { styleCatalog } from '../src/data/styles.ts';
import { antiPatterns, preflightChecks, verificationGroups } from '../src/data/agentHandoff.ts';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const OUTPUT = join(DIST, 'agent-handoff.json');

if (!existsSync(DIST)) {
  mkdirSync(DIST, { recursive: true });
}

const publicBaseUrl = 'https://www.webstylebook.com';
const handoffUrl = `${publicBaseUrl}/pages/prompt-workflow?path=ai`;
const jsonEndpoint = `${publicBaseUrl}/agent-handoff.json`;

const preflightAsText = preflightChecks
  .map((item, index) => `${index + 1}. ${item.label.en} — ${item.detail.en}`)
  .join('\n');

const verificationAsText = verificationGroups
  .map((group) => [
    `[${group.title.en}]`,
    ...group.items.map((entry) => `- ${entry.en}`),
  ].join('\n'))
  .join('\n\n');

const antiPatternsAsText = antiPatterns
  .map((entry, index) => [
    `${index + 1}. ${entry.pattern.en}`,
    `   Why: ${entry.why.en}`,
    `   Fix: ${entry.fix.en}`,
  ].join('\n'))
  .join('\n\n');

const baseFacts = [
  'Project: Use the project described by the human, URL context, repository, or current task. Do not assume this Web Stylebook page is the project being built.',
  'Target: Infer the audience from the human request. If missing, choose a conservative product audience and record the assumption in design.md.',
  'Product: Infer the product/service from the human request. If the request is vague, define a narrow MVP that can be built and verified.',
  'Selected style references: agent chooses primary + optional secondary from the embedded style catalog.',
  'Typography: AI chooses a purpose-fit typography system after deciding the product style and tone.',
  'Required pages: Infer the minimum page set needed for the product. Do not create unnecessary marketing pages.',
  'Tech stack: Unless explicitly told otherwise, use the current stable Next.js release with TypeScript, App Router, ESLint, and a package manager matching the repository.',
  'Preferred direction: First choose the style, tone, and manner that match the product purpose. Avoid generic AI-looking UI.',
  'Must keep: Mobile stability, readable typography, accessible controls, stable responsive dimensions, clear hierarchy, and no routine clarifying questions.',
  'Forbidden: Horizontal scroll, clipped text, low contrast, nested cards, meaningless decoration, placeholder-only pages, and claiming completion without verification.',
].join('\n\n');

const foundationProtocol = [
  'Execution protocol:',
  '0. If this prompt came with a Web Stylebook link, open that link first and read the usage guide, pre-flight checklist, style catalog, anti-patterns, verification checklist, and build prompt before designing.',
  '1. Run the pre-flight checklist. Confirm the product source, repository state, primary style choice, page scope, and missing-detail policy before writing anything.',
  '2. Decide the purpose-fit visual style, tone, and manner. Use the style catalog to select one primary style and optionally one secondary style. Explain why the chosen direction fits the product and audience.',
  '3. If the compact style catalog is not enough, open only the selected style detailUrl pages. Do not browse every style page.',
  '4. If the human did not explicitly require another stack, create or continue with the current stable Next.js release, TypeScript, App Router, and ESLint.',
  '5. Before page implementation, create design.md with the chosen visual direction: color keys, typography keys, spacing, radius, borders, shadows, motion, density, responsive rules, and an Assumptions section.',
  '6. Implement the design keys as reusable theme tokens or CSS variables before building screens.',
  '7. Build the component foundation first. Use shadcn/ui for reliable common controls when it helps, but do not force it when custom composition is needed for the style.',
  '8. Assemble complete, usable screens from those components. Avoid placeholder-only landing pages unless that is the actual product.',
  '9. Confirm every anti-pattern listed in the handoff is absent from the result.',
  '10. Walk through every group of the self-verification checklist. Fix anything that fails before reporting completion.',
  '11. Run the self-audit prompt on your own output and produce PASS / FIX-NOW / RISK verdicts for every checkpoint.',
].join('\n');

const agentGuide = [
  'This document is the briefing for an AI coding agent before implementation.',
  `Handoff page: ${handoffUrl}`,
  `Direct JSON: ${jsonEndpoint}`,
  '',
  'Read in this order:',
  '1. This usage guide.',
  '2. Pre-flight checklist — confirm all five items before writing any code or design.',
  '3. Style catalog — pick one primary style (optionally one secondary) for the product.',
  '4. Anti-patterns — hard constraints, not preferences.',
  '5. Build prompt — the implementation contract.',
  '6. Self-verification checklist — run before reporting completion.',
  '7. Self-audit prompt — run on your own output to grade PASS / FIX-NOW / RISK.',
  '',
  'Rules:',
  '- Do not copy Web Stylebook as the target product.',
  '- Infer the product from the human request, repository, URL context, or attached notes.',
  '- If details are missing, make a conservative assumption, record it in design.md under "Assumptions", and continue.',
  '- Produce design.md, theme tokens, reusable components, complete responsive screens, an anti-pattern absence check, and a verification summary.',
  '- Never claim completion without running the self-audit.',
].join('\n');

const oneShotPrompt = [
  'You are an autonomous senior frontend product designer and implementation engineer.',
  `Open this Web Stylebook handoff link before designing: ${handoffUrl}. Read the usage guide, pre-flight checklist, style catalog, anti-patterns, verification checklist, and build prompt. Choose the product-fit style before implementing, and open selected style detailUrl pages only when the compact catalog is insufficient.`,
  baseFacts,
  'Pre-flight (confirm before any design or code):',
  preflightAsText,
  foundationProtocol,
  'Anti-patterns — every item below must be absent from the result:',
  antiPatternsAsText,
  'Self-verification — run every group below before reporting completion:',
  verificationAsText,
  'Required deliverables:',
  '- design.md with the chosen visual style, tone, token keys, component rules, responsive behavior, and an Assumptions section.',
  '- A tokenized theme or CSS variable layer that matches design.md.',
  '- Reusable base components before page-specific layouts.',
  '- Complete responsive pages using the chosen stack.',
  '- A final verification summary listing commands run, viewports inspected, anti-patterns confirmed absent, remaining risks, and files changed.',
  'Working rule: if information is missing, make a reasonable assumption, write it in design.md under Assumptions, and keep moving unless the missing detail makes implementation impossible.',
].join('\n\n');

const selfAuditPrompt = [
  'You are auditing your own frontend implementation against the Web Stylebook handoff contract.',
  'For every checkpoint, return one verdict: PASS, FIX-NOW, or RISK. FIX-NOW must be fixed before the work is reported as done. RISK is acceptable but must be named in the verification summary.',
  `Handoff link the work used: ${handoffUrl}`,
  baseFacts,
  'Pre-flight — confirm each item is reflected in the actual output and in design.md:',
  preflightAsText,
  'Anti-patterns — confirm each is absent. If present, report FIX-NOW with the exact location:',
  antiPatternsAsText,
  'Self-verification checklist — verdict per item:',
  verificationAsText,
  'Output format:',
  '1. Pre-flight verdicts (per item).',
  '2. Anti-pattern verdicts (per item) with file:line references for any FIX-NOW.',
  '3. Verification verdicts grouped by category, with the failing command output for any FIX-NOW.',
  '4. Final summary: total PASS / FIX-NOW / RISK counts, the smallest concrete next change for every FIX-NOW, and the residual concern for every RISK.',
  'Working rule: do not soften verdicts to look better. A genuine FIX-NOW that survives this audit is worth more than a clean-looking report that hides issues.',
].join('\n\n');

const contract = {
  schema: 'webstylebook.agent-handoff.v2',
  generatedAt: new Date().toISOString(),
  handoffUrl,
  jsonEndpoint,
  humanLanguagePage: handoffUrl,
  purpose: 'Static, JS-free handoff contract for AI coding agents. Fetch this JSON and you have everything needed: pre-flight checklist, style catalog, anti-patterns, verification checklist, the build prompt, and the self-audit prompt — no scraping required.',
  howToUse: [
    'Fetch this JSON with curl or any HTTP client. No JavaScript execution required.',
    'Run the pre-flight checklist before any design or code.',
    'Choose one primary style (optionally one secondary) from `styles`. Open `detailUrl` only when the compact entry is not enough.',
    'Use `prompts.oneShot` as the implementation contract.',
    'After building, run `prompts.selfAudit` on your own output to produce PASS / FIX-NOW / RISK verdicts.',
    'Confirm every entry in `antiPatterns` is absent.',
    'Walk through every group of `selfVerificationChecklist` before claiming completion.',
  ],
  humanInputPolicy: {
    productContext: 'Use the human request, repository context, attached notes, or current task as the product source. Do not infer that Web Stylebook itself is the product.',
    missingDetails: 'Make conservative assumptions, document them in design.md under an "Assumptions" section, and continue unless the missing detail blocks implementation.',
    customRoute: `${publicBaseUrl}/pages/prompt-workflow?path=custom`,
  },
  parseOrder: [
    'Read this usage guide and the pre-flight checklist first.',
    'Confirm all five pre-flight items, recording assumptions in design.md.',
    'Scan the embedded style catalog by tags, bestFor, constraints, typography, layout, motion, and palette.',
    'Choose one primary style and optionally one secondary style.',
    'Open detailUrl only for selected styles when the embedded catalog is insufficient.',
    'Read the build prompt as the implementation contract.',
    'Implement design.md, theme tokens, reusable components, then complete responsive screens.',
    'Run every group of the self-verification checklist.',
    'Run the self-audit prompt against your own output to produce PASS / FIX-NOW / RISK verdicts.',
    'Do not treat Web Stylebook itself as the target product unless the human explicitly says so.',
  ],
  agentGuide,
  preflightChecklist: preflightChecks.map((item) => ({
    id: item.id,
    label: item.label.en,
    detail: item.detail.en,
  })),
  selfVerificationChecklist: verificationGroups.map((group) => ({
    id: group.id,
    title: group.title.en,
    items: group.items.map((entry) => entry.en),
  })),
  antiPatterns: antiPatterns.map((entry) => ({
    id: entry.id,
    pattern: entry.pattern.en,
    why: entry.why.en,
    fix: entry.fix.en,
  })),
  styleSelectionHeuristics: [
    'Operational SaaS, dashboards, admin, and repeated workflows usually fit Quiet Utility or Platform Core.',
    'Documentation, premium writing, portfolios, and editorial products usually fit Editorial Silence, Swiss Poster, or Mono Type.',
    'Creator launches, events, campaigns, and bold consumer products usually fit Kinetic Pop, Duotone Bold, or selected fusion styles.',
    'Security, developer tools, trading, infrastructure, and terminal-heavy products can fit Terminal Core, Console Launch, Cyberpunk Glitch, or Runtime Signal when contrast remains readable.',
    'If the product requires trust, repeated use, or dense scanning, favor restraint over spectacle even when using an expressive reference.',
  ],
  detailFetchPolicy: {
    compactFirst: true,
    fetchWhen: [
      'The chosen style needs concrete layout, surface, or motion examples beyond this JSON.',
      'The target product has an unusual tone and one detail page can prevent generic output.',
      'Two candidate styles are close and the detail pages will clarify which one fits.',
    ],
    avoidWhen: [
      'The JSON already provides enough palette, typography, layout, motion, and constraints.',
      'Opening many style pages would waste context without improving implementation.',
    ],
  },
  implementationProtocol: {
    defaultStack: 'Unless the human explicitly asks for another stack, use the current stable Next.js release with TypeScript, App Router, ESLint, and the repository-consistent package manager.',
    designDocument: 'Create design.md before broad implementation. It must define the chosen style, tone, token keys, component rules, responsive behavior, and assumptions.',
    tokenContract: ['colors', 'typography', 'spacing', 'radius', 'borders', 'shadows', 'motion', 'density', 'breakpoints', 'focus states'],
    componentFoundation: ['AppShell', 'Header/Nav', 'Button', 'FormControls', 'Card/Panel', 'SectionHeader', 'FeatureList', 'CTA', 'Empty/Loading/Error states', 'domain-specific blocks'],
    libraryPolicy: 'Use shadcn/ui when it improves common-control reliability. Skip it when the chosen style needs freer custom composition.',
    assemblyPolicy: 'Build complete usable screens from tokens and components. Avoid placeholder-only landing pages, nested card stacks, meaningless decoration, clipped text, and horizontal overflow.',
    verificationChecklist: verificationGroups.flatMap((group) => group.items.map((entry) => entry.en)),
    selfAuditRoute: `${handoffUrl}#self-audit`,
  },
  prompts: {
    oneShot: oneShotPrompt,
    selfAudit: selfAuditPrompt,
  },
  styleCount: styleCatalog.length,
  styles: styleCatalog.map((style) => ({
    id: style.id,
    name: style.name,
    kind: style.kind,
    tags: style.tags,
    detailUrl: `${publicBaseUrl}${style.route}`,
    workflowUrl: `${publicBaseUrl}/pages/prompt-workflow?path=custom&stylePreset=${style.id}`,
    palette: style.palette,
    accent: style.accent,
    summary: style.summary,
    promptProfile: style.promptProfile,
    visualProfile: style.visualProfile,
    fusionOf: style.fusionOf || [],
  })),
};

writeFileSync(OUTPUT, JSON.stringify(contract, null, 2) + '\n', 'utf8');

const sizeKb = (JSON.stringify(contract).length / 1024).toFixed(1);
console.log(`[agent-handoff] wrote ${OUTPUT} (${sizeKb} kB minified, ${styleCatalog.length} styles, schema ${contract.schema})`);
