// Checks a reader can rerun: catalog fields, page prompts, and declared color
// tokens describe the same style, and declared text sits on a background that
// clears WCAG 2.2 contrast minimum (4.5:1) for normal text.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { styleCatalog, styleTags, type StyleData } from '../../src/data/styles.ts';
import { stylePageBlueprints } from '../../src/data/stylePages.ts';
import { styleFamilies } from '../../src/catalog/styleFamilies.ts';
import { styleFacets } from '../../src/catalog/styleFacets.ts';
import { productArchetypes } from '../../src/catalog/products.ts';

export interface ConsistencyIssue {
  id: string;
  message: string;
}

const MIN_TEXT_CONTRAST = 4.5;
const ROOT = join(import.meta.dirname, '../..');

function lum(hex: string): number {
  const n = parseInt(hex.slice(1), 16);
  const channels = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((value) => {
    const s = value / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return (channels[0] ?? 0) * 0.2126 + (channels[1] ?? 0) * 0.7152 + (channels[2] ?? 0) * 0.0722;
}

export function contrastRatio(foreground: string, background: string): number {
  const lighter = Math.max(lum(foreground), lum(background));
  const darker = Math.min(lum(foreground), lum(background));
  return (lighter + 0.05) / (darker + 0.05);
}

function pair(issues: ConsistencyIssue[], id: string, foreground: string, background: string, label: string): void {
  const ratio = contrastRatio(foreground, background);
  if (ratio < MIN_TEXT_CONTRAST) {
    issues.push({
      id,
      message: `${label} ${foreground} on ${background} is ${ratio.toFixed(2)}:1 (minimum ${MIN_TEXT_CONTRAST}:1)`,
    });
  }
}

function requiredText(style: StyleData, issues: ConsistencyIssue[]): void {
  const fields: Array<[string, string]> = [
    ['name.en', style.name.en],
    ['name.ko', style.name.ko],
    ['name.ja', style.name.ja],
    ['description.en', style.description.en],
    ['description.ko', style.description.ko],
    ['description.ja', style.description.ja],
    ['summary.en', style.summary.en],
    ['summary.ko', style.summary.ko],
    ['summary.ja', style.summary.ja],
    ['typography', style.promptProfile.typography],
    ['layout', style.promptProfile.layout],
    ['motion', style.promptProfile.motion],
  ];
  for (const [field, value] of fields) {
    if (!value.trim()) issues.push({ id: style.id, message: `missing ${field}` });
  }
  if (style.palette.length < 2) issues.push({ id: style.id, message: 'palette needs at least two colors' });
  if (!/^#[0-9a-fA-F]{6}$/.test(style.accent)) issues.push({ id: style.id, message: 'accent is not a 6-digit hex' });
  for (const field of ['bestFor', 'constraints', 'notIdealFor'] as const) {
    if (style.promptProfile[field].length === 0) issues.push({ id: style.id, message: `missing ${field}` });
  }
}

function tags(style: StyleData, issues: ConsistencyIssue[]): void {
  const allowed = new Set(styleTags);
  const mode = style.tags.filter((tag) => tag === 'dark' || tag === 'light' || tag === 'dual');
  if (mode.length !== 1) issues.push({ id: style.id, message: `needs exactly one mode tag, found ${mode.join(', ') || 'none'}` });
  for (const tag of style.tags) {
    if (!allowed.has(tag)) issues.push({ id: style.id, message: `tag '${tag}' is outside the filter vocabulary` });
  }
  if (new Set(style.tags).size !== style.tags.length) issues.push({ id: style.id, message: 'duplicate tags' });
}

function fusionParents(style: StyleData, issues: ConsistencyIssue[]): void {
  const parents = style.fusionOf ?? [];
  if (style.kind === 'style' && parents.length > 0) {
    issues.push({ id: style.id, message: 'a base style names fusion parents' });
  }
  if (style.kind === 'fusion' && parents.length < 2) {
    issues.push({ id: style.id, message: `a fusion needs at least two parents, found ${parents.length}` });
  }
  const known = new Map(styleCatalog.map((item) => [item.id, item]));
  for (const parent of parents) {
    const target = known.get(parent);
    if (!target) issues.push({ id: style.id, message: `fusion parent '${parent}' does not exist` });
    else if (target.kind !== 'style') issues.push({ id: style.id, message: `fusion parent '${parent}' is not a base style` });
  }
}

function blueprintContrast(issues: ConsistencyIssue[]): void {
  for (const style of styleCatalog) {
    const blueprint = stylePageBlueprints[style.id];
    if (!blueprint) {
      issues.push({ id: style.id, message: 'missing style page blueprint' });
      continue;
    }
    if (/^#[0-9a-fA-F]{6}$/.test(blueprint.bg) && /^#[0-9a-fA-F]{6}$/.test(blueprint.text)) {
      pair(issues, style.id, blueprint.text, blueprint.bg, 'blueprint text');
    }
    if (/^#[0-9a-fA-F]{6}$/.test(blueprint.bg) && /^#[0-9a-fA-F]{6}$/.test(blueprint.muted)) {
      pair(issues, style.id, blueprint.muted, blueprint.bg, 'blueprint muted');
    }
  }
}

function pageSource(id: string): string {
  const registry = readFileSync(join(ROOT, 'src/ported/registry.ts'), 'utf8');
  const match = registry.match(new RegExp(`'${id}':\\s*\\{\\s*path:\\s*'(\\./pages/[^']+)'`));
  if (!match?.[1]) return '';
  return readFileSync(join(ROOT, 'src/ported', match[1].slice(2)), 'utf8');
}

function englishPrompt(source: string): string {
  const pre = source.match(/<pre[^>]*data-lang="en"[^>]*>([\s\S]*?)<\/pre>/);
  if (pre) return pre[1] ?? '';
  const assigned = source.match(/promptEn = `([\s\S]*?)`;/);
  if (assigned) return assigned[1] ?? '';
  const record = source.match(/en: `([\s\S]*?)`,\s*\n\s*ko:/);
  return record?.[1] ?? '';
}

function declaredPromptPairs(issues: ConsistencyIssue[], id: string, prompt: string): void {
  const token = (name: string): string | undefined => {
    const match = prompt.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
    return match?.[1]?.toLowerCase();
  };
  const background = token('bg') ?? token('bg1');
  if (!background) return;
  for (const name of ['text', 'text-main', 'text-muted']) {
    const foreground = token(name);
    if (foreground) pair(issues, id, foreground, background, `prompt ${name}`);
  }
}

function whiteOnDeclaredBackground(issues: ConsistencyIssue[], id: string, prompt: string): void {
  const tokens = new Map<string, string>();
  for (const match of prompt.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})/g)) {
    tokens.set(match[1] ?? '', (match[2] ?? '').toLowerCase());
  }
  for (const line of prompt.split(/\n|\{"\\n"\}/)) {
    if (!/color(?::|\s)+(?:white|#fff\b|#ffffff\b)/i.test(line)) continue;
    const direct = line.match(/background(?:-color)?:\s*(#[0-9a-fA-F]{6})/i)?.[1]?.toLowerCase();
    const variable = line.match(/background(?:-color)?:\s*var\(--([a-z0-9-]+)\)/i)?.[1];
    const background = direct ?? (variable ? tokens.get(variable) : undefined);
    if (background) pair(issues, id, '#ffffff', background, 'prompt white text');
  }
}

function paletteObjects(issues: ConsistencyIssue[], id: string, source: string): void {
  const pattern = /\{[^{}]*\bbg:\s*'(#[0-9a-fA-F]{6})'[^{}]*\}/g;
  for (const match of source.matchAll(pattern)) {
    const block = match[0];
    const background = (match[1] ?? '').toLowerCase();
    for (const field of ['text', 'textMain', 'textMuted']) {
      const foreground = block.match(new RegExp(`${field}:\\s*'(#[0-9a-fA-F]{6})'`))?.[1]?.toLowerCase();
      if (foreground) pair(issues, id, foreground, background, `palette ${field}`);
    }
  }
}

function defaultPaletteMatchesCatalog(style: StyleData, source: string, issues: ConsistencyIssue[]): void {
  if (style.id === 'glass-orbit') {
    const block = source.match(/id:\s*'dusk'[\s\S]*?vars:\s*\{([\s\S]*?)\n\s*\},/);
    const body = block?.[1] ?? '';
    const read = (name: string) => body.match(new RegExp(`${name}:\\s*'(#[0-9a-fA-F]{6})'`))?.[1]?.toLowerCase();
    const expected = [read('bg1'), read('bg2'), read('bg3'), read('text')].filter((color): color is string => Boolean(color));
    const palette = new Set(style.palette.map((color) => color.toLowerCase()));
    for (const color of expected) {
      if (!palette.has(color)) issues.push({ id: style.id, message: `catalog palette omits default dusk token ${color}` });
    }
    const blueprint = stylePageBlueprints[style.id];
    if (blueprint && read('bg1') && blueprint.bg.toLowerCase() !== read('bg1')) {
      issues.push({ id: style.id, message: `blueprint bg ${blueprint.bg} is not dusk bg1 ${read('bg1')}` });
    }
    if (blueprint && read('text') && blueprint.text.toLowerCase() !== read('text')) {
      issues.push({ id: style.id, message: `blueprint text ${blueprint.text} is not dusk text ${read('text')}` });
    }
    const blur = blueprint?.metrics.find(([label]) => label === 'blur')?.[1];
    if (blur !== '18px') issues.push({ id: style.id, message: `hero blur guidance is ${blur}, the hero card uses blur(18px)` });
  }
  if (style.id === 'neon-drift') {
    const ion = source.match(/id:\s*'ion'[\s\S]*?\}/);
    const body = ion?.[0] ?? '';
    const read = (name: string) => body.match(new RegExp(`${name}:\\s*'(#[0-9a-fA-F]{6})'`))?.[1]?.toLowerCase();
    const palette = new Set(style.palette.map((color) => color.toLowerCase()));
    for (const name of ['bg', 'accent', 'accent2', 'text']) {
      const color = read(name);
      if (color && !palette.has(color)) issues.push({ id: style.id, message: `catalog palette omits default ion ${name} ${color}` });
    }
  }
}

function promptContradictsCatalog(style: StyleData, prompt: string, issues: ConsistencyIssue[]): void {
  const opening = prompt.slice(0, 500).toLowerCase();
  for (const phrase of style.promptProfile.notIdealFor) {
    const needle = phrase.toLowerCase();
    const at = opening.indexOf(needle);
    if (at < 0) continue;
    const before = opening.slice(Math.max(0, at - 16), at);
    if (/\b(not|no|never|without)\b/.test(before)) continue;
    issues.push({ id: style.id, message: `prompt opening recommends '${phrase}', which notIdealFor rejects` });
  }
  if (/no serif/i.test(prompt) && /serif/i.test(style.promptProfile.typography) && !/no serif/i.test(style.promptProfile.typography)) {
    issues.push({ id: style.id, message: 'catalog typography names a serif while the page prompt forbids serif' });
  }
  const georgiaIsTheFace = /georgia/i.test(prompt) && !/not georgia|no georgia|georgia를 쓰지|georgiaは使わない/i.test(prompt);
  if (/space grotesk/i.test(style.promptProfile.typography) && georgiaIsTheFace) {
    issues.push({ id: style.id, message: 'catalog typography is Space Grotesk while the page prompt specifies Georgia' });
  }
  const claim = `${style.description.en} ${style.promptProfile.constraints.join(' ')}`;
  if (/zero chroma|no accent chroma/i.test(claim)) {
    issues.push({ id: style.id, message: 'copy says the style has no chroma; describe the accent that is actually used' });
  }
}

function familyFonts(issues: ConsistencyIssue[]): void {
  const recipes = JSON.parse(readFileSync(join(ROOT, 'src/visual/recipes.json'), 'utf8')) as Array<{
    id: string; displayFont: string | null; bodyFont: string | null; monoFont: string | null;
  }>;
  const byId = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  for (const family of styleFamilies) {
    const stacks = Object.values(family.tokenDefaults.typography).filter((value): value is string => typeof value === 'string');
    const quoted = stacks.flatMap((stack) => [...stack.matchAll(/["']([^"']+)["']/g)].map((match) => match[1] ?? ''));
    for (const face of quoted) {
      for (const member of family.memberStyleIds) {
        const recipe = byId.get(member);
        const haystack = `${recipe?.displayFont ?? ''} ${recipe?.bodyFont ?? ''} ${recipe?.monoFont ?? ''}`;
        if (recipe && !haystack.includes(face)) {
          issues.push({ id: family.id, message: `family font "${face}" is not used by member ${member}` });
        }
      }
    }
  }
}

function recommendationSafety(issues: ConsistencyIssue[]): void {
  for (const id of ['cyberpunk-glitch', 'fusion-cyber-console']) {
    const style = styleCatalog.find((item) => item.id === id);
    if (style?.promptProfile.bestFor.some((item) => /security/i.test(item))) {
      issues.push({ id, message: 'glitch styling is recommended for a security product' });
    }
    if (styleFacets[id]?.productTypes.includes('security-console')) {
      issues.push({ id, message: 'facets recommend a security console' });
    }
  }
  if (styleFacets['soft-pastel']?.productTypes.includes('healthcare-portal')) {
    issues.push({ id: 'soft-pastel', message: 'facets recommend a healthcare portal' });
  }
  const healthcare = productArchetypes.find((item) => item.id === 'healthcare-portal');
  if (healthcare?.recommendedPrimaryStyleIds.includes('soft-pastel') || healthcare?.recommendedSecondaryStyleIds.includes('soft-pastel')) {
    issues.push({ id: 'healthcare-portal', message: 'healthcare portal recommends soft-pastel' });
  }
}

function citations(issues: ConsistencyIssue[]): void {
  const principles = readFileSync(join(ROOT, 'src/catalog/principles.ts'), 'utf8');
  const jakob = principles.slice(principles.indexOf("'jakobs-law'"), principles.indexOf("'law-of-common-region'"));
  if (!jakob.includes('https://www.nngroup.com/articles/end-of-web-design/')) {
    issues.push({ id: 'jakobs-law', message: 'missing Nielsen Norman Group, End of Web Design (22 July 2000)' });
  }
  if (!jakob.includes('https://lawsofux.com/jakobs-law/')) {
    issues.push({ id: 'jakobs-law', message: 'missing Laws of UX Jakob’s Law citation' });
  }
  if (jakob.includes('ten-usability-heuristics')) {
    issues.push({ id: 'jakobs-law', message: 'still cites the 10 usability heuristics article' });
  }
  const design = readFileSync(join(ROOT, 'src/catalog/designPrinciples.ts'), 'utf8');
  if (/30[–-]50%/.test(design)) issues.push({ id: 'align-for-reading', message: 'text expansion still says 30–50%' });
  if (!design.includes('200–300%') && !design.includes('200-300%')) {
    issues.push({ id: 'align-for-reading', message: 'text expansion does not state the 200–300% short-string range' });
  }
  const macos = pageSource('macos-liquid-glass');
  if (/3,446|599,604|Symbols 3446|macOS 26 UI Kit|macOS 26 Liquid/.test(macos)) {
    issues.push({ id: 'macos-liquid-glass', message: 'still publishes unverified macOS 26 kit counts' });
  }
  if (!macos.includes('macOS 27')) issues.push({ id: 'macos-liquid-glass', message: 'does not name the current macOS 27 kits' });
}

function softPastelInk(issues: ConsistencyIssue[]): void {
  const css = readFileSync(join(ROOT, 'src/ported/portedStylePages.css'), 'utf8');
  const blocks = css.split(/(?=\.ported-style-page--soft-pastel)/);
  for (const block of blocks) {
    if (!block.startsWith('.ported-style-page--soft-pastel')) continue;
    const rule = block.split('}')[0] ?? '';
    const paintsWhite = /color:\s*(?:white|#fff\b|#ffffff\b)/i.test(rule);
    const onPeach = /background:\s*(?:var\(--accent\)|#ff9a76)/i.test(rule);
    if (paintsWhite && onPeach) {
      issues.push({ id: 'soft-pastel', message: 'CSS paints white text on the peach accent' });
    }
  }
}

export function auditStyleConsistency(): ConsistencyIssue[] {
  const issues: ConsistencyIssue[] = [];
  const used = new Set(styleCatalog.flatMap((style) => style.tags));
  for (const tag of styleTags) {
    if (!used.has(tag)) issues.push({ id: 'style-tags', message: `filter tag '${tag}' matches no style` });
  }
  for (const style of styleCatalog) {
    requiredText(style, issues);
    tags(style, issues);
    fusionParents(style, issues);
    const source = pageSource(style.id);
    const prompt = englishPrompt(source);
    if (prompt) {
      declaredPromptPairs(issues, style.id, prompt);
      whiteOnDeclaredBackground(issues, style.id, prompt);
      promptContradictsCatalog(style, prompt, issues);
    }
    paletteObjects(issues, style.id, source);
    defaultPaletteMatchesCatalog(style, source, issues);
  }
  blueprintContrast(issues);
  familyFonts(issues);
  recommendationSafety(issues);
  citations(issues);
  softPastelInk(issues);
  return issues;
}
