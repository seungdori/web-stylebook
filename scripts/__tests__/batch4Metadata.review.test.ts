import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { styleCatalog } from '../../src/data/styles';
import { stylePageBlueprints } from '../../src/data/stylePages';
import { originalStyleFonts, routeFontQueries } from '../../src/data/routeFontManifest';

// Batch 4 review: the eighteen rebuilt pages' metadata must describe what the page's own
// stylesheet and component really contain, beyond the root-token check in style-consistency.
const ROOT = join(__dirname, '..', '..');
const IDS = [
  'terminal-core', 'console-launch', 'platform-core', 'notion-style', 'neon-drift', 'cyberpunk-glitch',
  'kinetic-pop', 'swiss-poster', 'brutalist-grid', 'duotone-bold', 'liquid-metal', 'retro-pixel',
  'quiet-utility', 'editorial-silence', 'risograph-print', 'fusion-product-swiss', 'fusion-soft-inflate', 'fusion-studio-pixel',
];

interface Recipe {
  id: string;
  canvas: string;
  surface: string | null;
  text: string;
  accent: string | null;
  displayFont: string | null;
  bodyFont: string | null;
  monoFont: string | null;
  displayMinRem: number | null;
  displayMaxRem: number | null;
  notes: string;
  motionCss: string | null;
  motionDurationMs: number | null;
  source: { file: string; selectors: string[]; typographySelectors?: string[]; motionSelector?: string };
  motionSource?: string;
}

const recipes = JSON.parse(readFileSync(join(ROOT, 'src/visual/recipes.json'), 'utf8')) as Recipe[];
const registry = readFileSync(join(ROOT, 'src/ported/registry.ts'), 'utf8');

function pagePaths(id: string) {
  const path = registry.match(new RegExp(`'${id}':\\s*\\{\\s*path:\\s*'\\./(pages/[^']+)\\.tsx'`))?.[1];
  if (!path) throw new Error(`no registry path for ${id}`);
  return { css: `src/ported/${path}.css`, tsx: `src/ported/${path}.tsx` };
}

const squash = (text: string) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').toLowerCase();
const firstFamily = (stack: string | null | undefined) => (stack ?? '').split(',')[0]?.trim().replace(/^['"]|['"]$/g, '') ?? '';
const GENERIC = new Set(['ui-sans-serif', 'system-ui', 'sans-serif', 'serif', 'monospace', '-apple-system', 'ui-monospace']);

function sources(id: string) {
  const paths = pagePaths(id);
  const css = readFileSync(join(ROOT, paths.css), 'utf8');
  const tsx = readFileSync(join(ROOT, paths.tsx), 'utf8');
  return { paths, css, tsx, cssFlat: squash(css), both: squash(css + '\n' + tsx) };
}

function token(css: string, id: string, name: string): string | undefined {
  const body = css.match(new RegExp(`\\.ported-style-page--${id}\\.fusion-page\\s*\\{([^}]*)\\}`))?.[1] ?? '';
  return body.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1]?.trim();
}

describe.each(IDS)('batch-4 metadata for %s', (id) => {
  const recipe = recipes.find((item) => item.id === id)!;
  const style = styleCatalog.find((item) => item.id === id)!;
  const blueprint = stylePageBlueprints[id]!;
  const page = sources(id);

  it('has a recipe, a catalogue entry and a blueprint', () => {
    expect(recipe).toBeTruthy();
    expect(style).toBeTruthy();
    expect(blueprint).toBeTruthy();
  });

  it('points the recipe source at the page stylesheet, and every named selector exists there', () => {
    expect(recipe.source.file).toBe(page.paths.css);
    const named = [...recipe.source.selectors, ...(recipe.source.typographySelectors ?? []), ...(recipe.source.motionSelector ? [recipe.source.motionSelector] : [])];
    const missing = named.filter((selector) => !page.cssFlat.includes(squash(selector)));
    expect(missing).toEqual([]);
  });

  it('quotes a motion rule that the stylesheet really declares', () => {
    if (!recipe.motionCss || recipe.motionCss === 'none') return;
    for (const part of recipe.motionCss.split(/,(?![^(]*\))/)) {
      expect(page.cssFlat, `motionCss part "${part.trim()}"`).toContain(squash(part.trim()));
    }
  });

  it('keeps the recipe surface and accent on the page tokens', () => {
    const surface = token(page.css, id, 'fs-surface');
    // A recipe surface other than --fs-surface must still be one of the page's root tokens
    // (quiet-utility documents its kit panel colour, --lg-surface).
    if (surface && recipe.surface && recipe.surface.toLowerCase() !== surface.toLowerCase()) {
      const body = page.css.match(new RegExp(`\\.ported-style-page--${id}\\.fusion-page\\s*\\{([^}]*)\\}`))?.[1] ?? '';
      expect(body.toLowerCase(), 'recipe surface as a root token').toMatch(new RegExp(`--[a-z0-9]+-surface:\\s*${recipe.surface.toLowerCase()};`));
    }
    const accent = token(page.css, id, 'fs-accent');
    if (accent) expect((style.accent ?? '').toLowerCase(), 'catalogue accent').toBe(accent.toLowerCase());
  });

  it('uses only colours in the catalogue palette and blueprint that the page itself uses', () => {
    const hexes = [...style.palette, blueprint.surface, blueprint.accent2].filter((value) => /^#[0-9a-f]{6}$/i.test(value));
    const missing = hexes.filter((hex) => !page.both.includes(hex.toLowerCase()));
    expect(missing).toEqual([]);
  });

  it('names in its recipe notes only colours, clamps and prefixed classes the page has', () => {
    const notes = recipe.notes;
    const hexes = [...notes.matchAll(/#[0-9a-fA-F]{6}\b/g)].map((m) => m[0].toLowerCase());
    expect(hexes.filter((hex) => !page.both.includes(hex))).toEqual([]);
    const clamps = [...notes.matchAll(/clamp\([^)]*\)/g)].map((m) => m[0]);
    expect(clamps.filter((clamp) => !page.cssFlat.includes(squash(clamp)))).toEqual([]);
    const prefix = page.css.match(/\.([a-z0-9]{2})-[a-z]/)?.[1];
    const classes = [...notes.matchAll(/(?<![\w-])\.([a-z0-9]+(?:[-_][a-z0-9]+)*)\b/g)].map((m) => m[1]).filter((name) => /^[a-z]/.test(name) && !/^(md|tsx|css|ts|json|5|0)$/.test(name));
    const missing = classes.filter((name) => !page.both.includes(`.${name}`) && !page.both.includes(`"${name}`) && !page.both.includes(` ${name}`) && !page.both.includes(`'${name}`));
    expect(missing, `prefix ${prefix}`).toEqual([]);
  });

  it('declares a display clamp that agrees with the recipe display range', () => {
    const clamp = recipe.notes.match(/Display is [^.]*?at clamp\(([\d.]+)rem,\s*[^,]+,\s*([\d.]+)rem\)/);
    if (!clamp) return;
    expect(Number(clamp[1])).toBe(recipe.displayMinRem);
    expect(Number(clamp[2])).toBe(recipe.displayMaxRem);
  });

  it('loads every named non-system face on the route', () => {
    const faces = [recipe.displayFont, recipe.bodyFont, recipe.monoFont, blueprint.headingFont, blueprint.bodyFont].map(firstFamily).filter((face) => face && !GENERIC.has(face));
    const route = originalStyleFonts[id] ?? [];
    for (const face of new Set(faces)) {
      expect(route, `${face} on the ${id} route`).toContain(face);
      expect(routeFontQueries[face], `${face} query`).toBeTruthy();
    }
  });

  it('states the same first faces in blueprint and recipe', () => {
    expect(firstFamily(blueprint.headingFont)).toBe(firstFamily(recipe.displayFont));
    expect(firstFamily(blueprint.bodyFont)).toBe(firstFamily(recipe.bodyFont));
  });
});
