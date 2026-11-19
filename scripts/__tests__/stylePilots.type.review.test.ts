// Reviewer tests for round five of the style-pilot change (English routes): each of the
// three pilot pages has its own typeface voice and components taken from its subject.
// These guard the design decisions that a later edit could undo without anything else
// failing: which families a page names and loads, that no pill, card, all-caps label or
// shadow comes back, that the prompt panel states the values the stylesheet really uses,
// and that the page rules stay scoped to their own page.
// Markup is checked with renderToStaticMarkup and CSS by reading the source. Whether the
// fonts are painted, the timer, the previews and the layouts were checked in a browser.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createElement, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { originalStyleFonts, routeFontQueries } from '../../src/data/routeFontManifest';
import { styleRoutes } from '../../src/data/routes';
import { styleById, type Lang, type StyleData } from '../../src/data/styles';
import { getRouteFontFamilies, getRouteFontStylesheet } from '../../src/utils/routeFonts';
import { activeFontStylesheet } from '../../src/visual/fontLoader';
import { FONT_LICENSES, FONT_SCRIPT_COVERAGE } from '../../src/visual/fontSources';
import fontWeights from '../../src/visual/fontWeights.json';
import recipes from '../../src/visual/recipes.json';
import type { FontMetadata } from '../../src/visual/types';

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

const portedCss = read('src/ported/portedStylePages.css');
const stylesCss = read('src/styles.css');
/** The Runtime Signal rules of the shared stylesheet: from its marker comment to the next style's. */
const signalCss = portedCss.slice(portedCss.indexOf('/* runtime-signal */'), portedCss.indexOf('/* neon-drift */'));
const fluidCss = read('src/ported/pages/PortedHolographicFluidPage.css');
const glassCss = read('src/ported/pages/PortedFusionHoloGlassPage.css');

type PilotId = 'runtime-signal' | 'holographic-fluid' | 'fusion-holo-glass';

const PILOTS: Record<PilotId, { css: string; file: string; exportName: string; display: string; text: string; mono: string | null; manifest: string[]; scope: RegExp }> = {
  'runtime-signal': {
    css: signalCss,
    file: 'PortedRuntimeSignalPage',
    exportName: 'PortedRuntimeSignalPage',
    display: 'Geist',
    text: 'Geist',
    mono: 'Geist Mono',
    // IBM Plex Sans KR is the Hangul fallback of the Korean stack.
    manifest: ['Geist', 'Geist Mono', 'IBM Plex Sans KR'],
    scope: /^\.ported-style-page--runtime-signal(?![\w-])/,
  },
  'holographic-fluid': {
    css: fluidCss,
    file: 'PortedHolographicFluidPage',
    exportName: 'PortedHolographicFluidPage',
    display: 'Fraunces',
    text: 'Fraunces',
    mono: 'Fragment Mono',
    manifest: ['Fragment Mono', 'Fraunces', 'Noto Sans KR'],
    scope: /^(?:\.ported-style-page\.fusion-page)?\.ported-style-page--holographic-fluid(?![\w-])|^(?:html|body):has\(\.ported-style-page--holographic-fluid\)$/,
  },
  'fusion-holo-glass': {
    css: glassCss,
    file: 'PortedFusionHoloGlassPage',
    exportName: 'PortedFusionHoloGlassPage',
    display: 'Sofia Sans Extra Condensed',
    text: 'Sofia Sans',
    mono: null,
    manifest: ['Sofia Sans', 'Sofia Sans Extra Condensed'],
    scope: /^(?:\.ported-style-page\.fusion-page)?\.ported-style-page--fusion-holo-glass(?![\w-])|^(?:html|body):has\(\.ported-style-page--fusion-holo-glass\)$/,
  },
};
const IDS = Object.keys(PILOTS) as PilotId[];

// The families these three pages were set in before, and the ones the shell defaults to.
const OLD_FAMILIES = ['Instrument Sans', 'Inter', 'IBM Plex Mono', 'Outfit', 'Exo 2', 'JetBrains Mono', 'Space Grotesk', 'Syne'];
// Every style route loads the shell face for the strip above the page and the three faces the previews were authored against.
const SHELL_FAMILIES = ['Wanted Sans Variable', 'Inter', 'Space Grotesk', 'IBM Plex Mono'];

type PageProps = { style: StyleData; lang: Lang };

async function renderPage(id: PilotId, lang: Lang = 'en'): Promise<string> {
  const { file, exportName } = PILOTS[id];
  const module = (await import(`../../src/ported/pages/${file}.tsx`)) as Record<string, ComponentType<PageProps>>;
  const style = styleById.get(id);
  if (!style) throw new Error(`No style data for ${id}`);
  return renderToStaticMarkup(createElement(module[exportName], { style, lang }));
}

const decode = (text: string) =>
  text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'");

/** The English prompt as the page prints it. */
async function prompt(id: PilotId): Promise<string> {
  const html = await renderPage(id);
  const pre = id === 'runtime-signal' ? html.match(/<details class="style-prompt"[\s\S]*?<pre>([\s\S]*?)<\/pre>/) : html.match(/<pre data-lang="en"[^>]*>([\s\S]*?)<\/pre>/);
  return decode(pre?.[1] ?? '');
}

/** The page without the prompt panel. */
const content = (html: string) => html.replace(/<details\b[\s\S]*?<\/details>/g, '');

interface CssRule {
  selectors: string[];
  body: string;
}

/** A selector list split at its top-level commas: the commas inside :is() and :where() stay. */
function splitSelectors(list: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const char of list) {
    if (char === '(') depth += 1;
    if (char === ')') depth -= 1;
    if (char === ',' && depth === 0) {
      parts.push(current);
      current = '';
    } else current += char;
  }
  parts.push(current);
  return parts.map((selector) => selector.trim().replace(/\s+/g, ' ')).filter(Boolean);
}

/** Innermost style rules of a stylesheet, in source order. At-rule wrappers are dropped. */
function cssRules(css: string): CssRule[] {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
  return [...clean.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((match) => ({ selectors: splitSelectors(match[1]), body: match[2] }));
}

const isKeyframeStep = (selector: string) => /^(?:from|to|\d+(?:\.\d+)?%)$/.test(selector);

/** The first rule, in source order, that lists exactly this selector. */
function ruleBody(css: string, selector: string): string {
  return cssRules(css).find((rule) => rule.selectors.includes(selector))?.body ?? '';
}

const declarations = (css: string, property: string) =>
  [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(new RegExp(`(?:^|[;{\\s])${property}:\\s*([^;}]+)`, 'g'))].map((match) => match[1].trim());

const compact = (value: string) => value.replace(/\s+/g, '').toLowerCase();

/** Quoted family names in a stylesheet. */
const namedFamilies = (css: string) => [...new Set([...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/["']([A-Z][A-Za-z0-9 ]+?)["']/g)].map((match) => match[1]))];

/** The weights a Google Fonts query asks for: a list, or a range for a variable font. */
function queryWeights(family: string): { has: (weight: number) => boolean; list: number[] | null } {
  const query = routeFontQueries[family];
  if (!query.includes(':')) return { has: (weight) => weight === 400, list: [400] };
  const [axes, tuples] = query.split(':')[1].split('@');
  const index = axes.split(',').indexOf('wght');
  const values = [...new Set(tuples.split(';').map((tuple) => tuple.split(',')[index]))];
  const range = values[0].match(/^(\d+)\.\.(\d+)$/);
  if (range) return { has: (weight) => weight >= Number(range[1]) && weight <= Number(range[2]), list: null };
  const list = values.map(Number);
  return { has: (weight) => list.includes(weight), list };
}

const shorthandWeights = (css: string, variable: string) =>
  [...css.matchAll(new RegExp(`font:\\s*(\\d{3})\\s[^;]*var\\(${variable}\\)`, 'g'))].map((match) => Number(match[1]));

describe('each pilot page has its own typeface voice', () => {
  for (const id of IDS) {
    const pilot = PILOTS[id];

    it(`${id}: the stylesheet names the families of its manifest entry and none of the old ones`, () => {
      const named = namedFamilies(pilot.css);
      // Web fonts the page can ask for, in both directions: named in the CSS and listed for the route.
      expect(named.filter((family) => family in routeFontQueries).sort()).toEqual([...pilot.manifest].sort());
      expect([...originalStyleFonts[id]].sort()).toEqual([...pilot.manifest].sort());
      expect(named.filter((family) => OLD_FAMILIES.includes(family))).toEqual([]);
    });

    it(`${id}: every stack leads with the Latin face, in every language`, () => {
      const stacks: Array<[string, string | null]> =
        id === 'runtime-signal'
          ? [['--sans', pilot.text], ['--mono', pilot.mono]]
          : [['--fs-display', pilot.display], ['--fs-body', pilot.text], ['--fs-mono', pilot.mono]];
      for (const [variable, family] of stacks) {
        const values = declarations(pilot.css, variable);
        if (family === null) {
          // Holo x Glass authors no mono face.
          expect(values).toEqual([]);
          continue;
        }
        expect(values.length).toBeGreaterThan(0);
        for (const value of values) expect(value.replace(/^["']|["'].*$/g, ''), `${variable}: ${value}`).toBe(family);
      }
      // No rule sets a literal family past the variables.
      const literal = declarations(pilot.css, 'font-family').filter((value) => !/^(?:var\(--[a-z-]+\)|inherit)$/.test(value));
      expect(literal).toEqual([]);
    });

    it(`${id}: the English prompt names the families the page uses and none of the old ones`, async () => {
      const text = await prompt(id);
      expect(text.length).toBeGreaterThan(2500);
      for (const family of new Set([pilot.display, pilot.text, ...(pilot.mono ? [pilot.mono] : [])])) expect(text).toContain(family);
      for (const family of OLD_FAMILIES) expect(text, family).not.toMatch(new RegExp(`\\b${family}\\b`));
    });

    it(`${id}: the route loads its families and the font allow-list holds each of them`, () => {
      const route = styleRoutes.find((item) => item.styleId === id);
      expect(route).toBeDefined();
      const loaded = getRouteFontFamilies(route!, 'en');
      expect([...loaded].sort()).toEqual([...new Set([...SHELL_FAMILIES, ...pilot.manifest])].sort());
      for (const family of pilot.manifest) {
        const url = getRouteFontStylesheet(family);
        expect(url, family).toMatch(/^https:\/\/fonts\.googleapis\.com\/css2\?family=/);
        const license = FONT_LICENSES[family];
        expect(license, `${family} is not in the font allow-list`).toBeDefined();
        expect(license.license).toBe('OFL-1.1');
        expect(license.licenseUrl).toMatch(/^https:\/\/github\.com\/google\/fonts\/blob\/main\/ofl\/[a-z0-9]+\/OFL\.txt$/);
        expect(license.licenseUrl).toContain(`/ofl/${family.toLowerCase().replace(/ /g, '')}/`);
        expect(FONT_SCRIPT_COVERAGE[family]).toContain('latin');
        // The loader's own check: it returns a stylesheet only for an approved host and family.
        const meta: FontMetadata = { family, source: 'external', stylesheetUrl: url, ...license, weights: [400], scripts: ['latin'], fallback: 'sans-serif', availability: 'requires-load' };
        expect(activeFontStylesheet(meta), family).toMatch(/^https:\/\/fonts\.googleapis\.com\/css2\?/);
      }
    });
  }

  it('the three pages share no Latin family', () => {
    const latin = IDS.map((id) => new Set([PILOTS[id].display, PILOTS[id].text, PILOTS[id].mono].filter((family): family is string => family !== null)));
    for (let a = 0; a < latin.length; a += 1) for (let b = a + 1; b < latin.length; b += 1) expect([...latin[a]].filter((family) => latin[b].has(family))).toEqual([]);
  });

  it('the allow-list test above fails for a family that is not registered', () => {
    const meta: FontMetadata = { family: 'Not A Registered Face', source: 'external', stylesheetUrl: 'https://fonts.googleapis.com/css2?family=Not+A+Registered+Face&display=swap', license: 'OFL-1.1', licenseUrl: 'https://example.com', weights: [400], scripts: ['latin'], fallback: 'sans-serif', availability: 'requires-load' };
    expect(activeFontStylesheet(meta)).toBeUndefined();
  });

  it('every weight a page sets is one its font query loads, so no weight is synthesised', () => {
    const numeric = (css: string) => declarations(css, 'font-weight').filter((value) => /^\d+$/.test(value)).map(Number);

    // Runtime Signal: Geist carries text, Geist Mono carries times and identifiers.
    const geist = queryWeights('Geist');
    const geistMono = queryWeights('Geist Mono');
    expect(geist.list).toEqual([400, 500, 600]);
    expect(geistMono.list).toEqual([400, 500]);
    for (const weight of [...numeric(signalCss), ...shorthandWeights(signalCss, '--sans')]) expect(geist.has(weight), `Geist ${weight}`).toBe(true);
    const monoWeights = shorthandWeights(signalCss, '--mono');
    expect(monoWeights.length).toBeGreaterThan(10);
    for (const weight of monoWeights) expect(geistMono.has(weight), `Geist Mono ${weight}`).toBe(true);

    // Holographic Fluid: Fraunces is variable; Fragment Mono has one weight.
    const fraunces = queryWeights('Fraunces');
    expect(fraunces.list).toBeNull();
    const fluidWeights = numeric(fluidCss);
    expect(fluidWeights).toContain(300);
    for (const weight of fluidWeights) expect(fraunces.has(weight), `Fraunces ${weight}`).toBe(true);
    expect(queryWeights('Fragment Mono').list).toEqual([400]);
    const fluidMono = cssRules(fluidCss).filter((rule) => /font-family:\s*var\(--fs-mono\)/.test(rule.body));
    expect(fluidMono.length).toBeGreaterThan(5);
    expect(fluidMono.filter((rule) => /font-weight:\s*(?!400)\d/.test(rule.body))).toEqual([]);

    // Holo x Glass: the condensed face for headlines and figures, Sofia Sans for text.
    const condensed = queryWeights('Sofia Sans Extra Condensed');
    const sofia = queryWeights('Sofia Sans');
    expect(condensed.list).toEqual([200, 300, 500, 600]);
    expect(sofia.list).toEqual([400, 500, 600]);
    const displayWeights = shorthandWeights(glassCss, '--fs-display');
    expect(displayWeights).toContain(200);
    for (const weight of displayWeights) expect(condensed.has(weight), `Sofia Sans Extra Condensed ${weight}`).toBe(true);
    for (const weight of [...numeric(glassCss), ...shorthandWeights(glassCss, '--fs-body')]) expect(sofia.has(weight), `Sofia Sans ${weight}`).toBe(true);
  });

  it('fontWeights.json lists the weights each new query loads', () => {
    const weights = fontWeights as Record<string, number[]>;
    for (const family of ['Geist', 'Geist Mono', 'Fragment Mono', 'Sofia Sans', 'Sofia Sans Extra Condensed']) expect(weights[family], family).toEqual(queryWeights(family).list);
    // Fraunces is variable; the list must hold the light weight of the title and every listed weight must be loadable.
    expect(weights.Fraunces).toContain(300);
    for (const weight of weights.Fraunces) expect(queryWeights('Fraunces').has(weight)).toBe(true);
  });

  it('Holographic Fluid sets its title and headings in the light, soft Fraunces the query can serve', () => {
    expect(routeFontQueries.Fraunces).toMatch(/^Fraunces:ital,opsz,wght,SOFT,WONK@0,/);
    for (const selector of ['.hf-hero__title', '.hf-heading']) {
      const body = ruleBody(fluidCss, `.ported-style-page--holographic-fluid ${selector}`);
      expect(body).toMatch(/font-family:\s*var\(--fs-display\)/);
      expect(body).toMatch(/font-weight:\s*300/);
      expect(body).toMatch(/font-variation-settings:\s*'SOFT' 100, 'WONK' 1/);
    }
    // The shell turns on stylistic sets meant for its own sans; the page turns them off for Fraunces.
    expect(ruleBody(fluidCss, '.ported-style-page--holographic-fluid .hf')).toMatch(/font-feature-settings:\s*normal/);
  });

  it('recipes.json describes the faces and the display scale the stylesheets set', () => {
    const recipe = (id: PilotId) => (recipes as Array<Record<string, unknown>>).find((item) => item.id === id)!;
    const clamp = (value: string) => value.match(/clamp\(([\d.]+)rem,\s*[\d.]+vw,\s*([\d.]+)rem\)/)?.slice(1, 3).map(Number);

    const signal = recipe('runtime-signal');
    expect(signal.displayFont).toBe(declarations(signalCss, '--sans')[0]);
    expect(signal.bodyFont).toBe(declarations(signalCss, '--sans')[0]);
    expect(signal.monoFont).toBe(declarations(signalCss, '--mono')[0]);
    const h1 = ruleBody(signalCss, '.ported-style-page--runtime-signal h1');
    expect([signal.displayMinRem, signal.displayMaxRem]).toEqual(clamp(h1));
    expect(h1).toMatch(new RegExp(`font:\\s*${signal.displayWeight} clamp\\([^)]*\\)/${signal.displayLineHeight} var\\(--sans\\)`));
    expect(h1).toMatch(new RegExp(`letter-spacing:\\s*${signal.displayLetterSpacingEm}em`));
    expect(signal.radiusPx).toBe(0);
    expect(compact(String(signal.border))).toBe(compact(declarations(signalCss, '--line')[0]));
    expect([signal.canvas, signal.surface, signal.text, signal.muted, signal.accent]).toEqual(['--bg', '--surface', '--text', '--muted', '--accent'].map((name) => declarations(signalCss, name)[0]));

    const fluid = recipe('holographic-fluid');
    expect(fluid.displayFont).toBe(declarations(fluidCss, '--fs-display')[0]);
    expect(fluid.bodyFont).toBe(declarations(fluidCss, '--fs-body')[0]);
    expect(fluid.monoFont).toBe(declarations(fluidCss, '--fs-mono')[0]);
    const heading = ruleBody(fluidCss, '.ported-style-page--holographic-fluid .hf-heading');
    expect([fluid.displayMinRem, fluid.displayMaxRem]).toEqual(clamp(heading));
    expect(heading).toMatch(new RegExp(`font-weight:\\s*${fluid.displayWeight};`));
    expect(heading).toMatch(new RegExp(`line-height:\\s*${fluid.displayLineHeight};`));
    expect(heading).toMatch(new RegExp(`letter-spacing:\\s*${fluid.displayLetterSpacingEm}em`));
    expect(fluid.radiusPx).toBe(0);
    expect([fluid.canvas, fluid.surface, fluid.text]).toEqual(['--fs-bg', '--fs-surface', '--fs-ink'].map((name) => declarations(fluidCss, name)[0]));
    expect(compact(String(fluid.muted))).toBe(compact(declarations(fluidCss, '--fs-muted')[0]));
    expect(compact(String(fluid.border))).toBe(compact(declarations(fluidCss, '--fs-line')[0]));

    const glass = recipe('fusion-holo-glass');
    expect(glass.displayFont).toBe(declarations(glassCss, '--fs-display')[0]);
    expect(glass.bodyFont).toBe(declarations(glassCss, '--fs-body')[0]);
    expect(glass.monoFont).toBeNull();
    const headline = ruleBody(glassCss, '.ported-style-page--fusion-holo-glass .hg h1');
    expect([glass.displayMinRem, glass.displayMaxRem]).toEqual(clamp(headline));
    expect(headline).toMatch(new RegExp(`font:\\s*${glass.displayWeight} clamp\\([^)]*\\)/${glass.displayLineHeight} var\\(--fs-display\\)`));
    const pane = ruleBody(glassCss, '.ported-style-page--fusion-holo-glass .hg-pane');
    expect(pane).toMatch(new RegExp(`border-radius:\\s*${glass.radiusPx}px`));
    expect(compact(pane)).toContain(`background:${compact(String(glass.surface))}`);
    expect([glass.canvas, glass.text]).toEqual(['--fs-bg', '--fs-ink'].map((name) => declarations(glassCss, name)[0]));
  });
});

describe('components come from the subject, not from the standard kit', () => {
  const allowedRadii: Record<PilotId, RegExp> = {
    // Square everywhere.
    'runtime-signal': /^0$/,
    // The record and the colour fields are round; 2px rounds the focus ring.
    'holographic-fluid': /^(?:50%|2px|0)$/,
    // Round controls, the one pane (30px, 24px on a phone) and the cycle blocks (8px, 4px on a phone).
    'fusion-holo-glass': /^(?:50%|30px|24px|8px|4px)$/,
  };

  for (const id of IDS) {
    const { css } = PILOTS[id];

    it(`${id}: no pill shapes and no radius outside the ones its components need`, () => {
      const radii = declarations(css, 'border-radius');
      expect(radii.length).toBeGreaterThan(0);
      expect(radii.filter((value) => !allowedRadii[id].test(value))).toEqual([]);
      expect(css).not.toMatch(/border-radius:\s*(?:\d{3,}px|\d+(?:em|rem|vw|vmax))/);
    });

    it(`${id}: no all-caps and no widely tracked labels`, () => {
      expect(declarations(css, 'text-transform').filter((value) => value !== 'none')).toEqual([]);
      const tracking = declarations(css, 'letter-spacing');
      expect(tracking.length).toBeGreaterThan(0);
      // Tracking is in em, or zero. Positive tracking stops at 0.04em: the side headings of the record.
      for (const value of tracking) {
        expect(value, value).toMatch(/^(?:0|-?\d*\.?\d+em)$/);
        expect(parseFloat(value), value).toBeLessThanOrEqual(0.04);
      }
      expect(css).not.toMatch(/font-variant(?:-caps)?:\s*(?:all-)?small-caps/);
    });

    it(`${id}: the markup has no card, pill, chip, badge or eyebrow`, async () => {
      const html = content(await renderPage(id));
      const classes = [...new Set([...html.matchAll(/class="([^"]+)"/g)].flatMap((match) => match[1].split(/\s+/)))];
      expect(classes.filter((name) => /(?:^|[-_])(?:cards?|pills?|chips?|badges?|eyebrow|kicker|tagline)(?:$|[-_])/.test(name))).toEqual([]);
      expect(css).not.toMatch(/\.[\w-]*(?:card|pill|chip|badge|eyebrow|kicker)[\w-]*\s*[,{]/);
    });

    it(`${id}: no gradient text`, () => {
      expect(css).not.toMatch(/background-clip:\s*text|-webkit-text-fill-color:\s*transparent/);
    });
  }

  it('Runtime Signal: one flat surface, with lines for structure and squares for state', () => {
    // The only shadow is the 2px inset rule on the left of the warning band.
    expect(declarations(signalCss, 'box-shadow').filter((value) => value !== 'none')).toEqual(['inset 2px 0 0 var(--accent-alt)']);
    // Gradients draw the grid and the ruler ticks, nothing else.
    const gradients = cssRules(signalCss).filter((rule) => /gradient\(/.test(rule.body));
    expect(gradients.map((rule) => rule.selectors.join(', ')).sort()).toEqual(['.ported-style-page--runtime-signal .container::before', '.ported-style-page--runtime-signal .ruler__ticks']);
    for (const rule of gradients) expect(rule.body.match(/[a-z-]+gradient\(/g)?.every((name) => name === 'repeating-linear-gradient(')).toBe(true);
    expect(signalCss).not.toMatch(/backdrop-filter|filter:\s*blur/);
    // A state is a 9px square and a word.
    const square = ruleBody(signalCss, '.ported-style-page--runtime-signal .health::before');
    expect(square).toMatch(/width:\s*9px/);
    expect(square).toMatch(/height:\s*9px/);
    expect(square).not.toMatch(/border-radius/);
    // Buttons are 44px high and square; one modifier makes the solid one.
    const button = cssRules(signalCss).find((rule) => rule.selectors.includes('.ported-style-page--runtime-signal .nav-button'))?.body ?? '';
    expect(button).toMatch(/height:\s*44px/);
    expect(button).toMatch(/border-radius:\s*0\b/);
    expect(button).toMatch(/background:\s*transparent/);
  });

  it('Runtime Signal: motion is hover transitions of 160ms at most', () => {
    expect(signalCss).not.toMatch(/@keyframes|animation(?:-name)?:/);
    const durations = [...signalCss.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(\d*\.?\d+)(ms|s)\b(?=[^;{}]*(?:ease|linear|;))/g)].map((match) => Number(match[1]) * (match[2] === 's' ? 1000 : 1));
    expect(durations.length).toBeGreaterThan(3);
    expect(Math.max(...durations)).toBeLessThanOrEqual(160);
  });

  it('Runtime Signal: the hero carries one outline button, and the page one solid button per bar', async () => {
    const html = content(await renderPage('runtime-signal'));
    const hero = html.match(/<section class="rs-hero">([\s\S]*?)<section class="trace"/)?.[1] ?? '';
    expect(hero.match(/<a class="nav-button[^"]*"/g)).toEqual(['<a class="nav-button"']);
    // The solid button is the pricing action: once in the top bar and once in the footer.
    const solid = [...html.matchAll(/<a class="nav-button nav-button--solid" href="([^"]+)">/g)].map((match) => match[1]);
    expect(solid).toEqual(['#plans', '#plans']);
    expect(html.match(/<header class="runtime-nav"[\s\S]*?<\/header>/)?.[0].match(/nav-button--solid/g)?.length).toBe(1);
  });

  it('Holographic Fluid: actions are underlined words, not buttons', async () => {
    const link = ruleBody(fluidCss, '.ported-style-page--holographic-fluid .hf-link');
    expect(link).toMatch(/font-weight:\s*600/);
    expect(link).toMatch(/text-decoration:\s*underline/);
    expect(link).toMatch(/text-decoration-thickness:\s*2px/);
    for (const selector of ['.hf-track__play', '.hf-field__submit']) {
      const body = ruleBody(fluidCss, `.ported-style-page--holographic-fluid ${selector}`);
      expect(body, selector).toMatch(/border:\s*0;/);
      expect(body, selector).toMatch(/background:\s*none;/);
      expect(body, selector).toMatch(/font-weight:\s*600/);
    }
    // No rule in the page, hover and focus included, gives one of these controls a filled or outlined box.
    const controls = cssRules(fluidCss).filter((rule) => rule.selectors.some((selector) => /(?:\.hf-link(?:--quiet)?|\.hf-track__play|\.hf-field__submit|\.hf-top__nav a)(?::[\w-]+)?$/.test(selector)));
    expect(controls.length).toBeGreaterThan(8);
    const boxed = controls.filter((rule) =>
      [...rule.body.matchAll(/(?:^|;)\s*(background(?:-color)?|border(?:-(?:top|right|bottom|left|color|width|style))?|box-shadow)\s*:\s*([^;]+)/g)].some((match) => !/^(?:none|0)$/.test(match[2].trim())),
    );
    expect(boxed.map((rule) => rule.selectors.join(', '))).toEqual([]);
    const html = content(await renderPage('holographic-fluid'));
    expect(html.match(/<a class="hf-link[^"]*" href="#hf-(?:tracks|editions)">/g)?.length).toBe(2);
  });

  it('Holographic Fluid: dotted leaders join each label to its value', async () => {
    expect(declarations(fluidCss, '--hf-dots')).toEqual(['rgba(255, 255, 255, 0.38)']);
    const leader = cssRules(fluidCss).find((rule) => rule.selectors.includes('.ported-style-page--holographic-fluid .hf-leader'));
    expect(leader?.selectors).toContain('.ported-style-page--holographic-fluid .hf-facts dt::after');
    expect(leader?.body).toMatch(/border-bottom:\s*2px dotted var\(--hf-dots\)/);
    const html = content(await renderPage('holographic-fluid'));
    // One leader per track, between the title and the length, and hidden from assistive technology.
    expect(html.match(/<span class="hf-track__title">[^<]+<\/span><i class="hf-leader" aria-hidden="true"><\/i><span class="hf-track__length">\d:\d\d<\/span>/g)?.length).toBe(8);
    expect(html.match(/<dl class="hf-facts">/g)?.length).toBe(2);
  });

  it('Holographic Fluid: the gradient lives on the record and the two colour fields only', () => {
    const gradients = cssRules(fluidCss).filter((rule) => /gradient\(/.test(rule.body));
    expect(gradients.map((rule) => rule.selectors.join(', ')).sort()).toEqual([
      '.ported-style-page--holographic-fluid .hf-disc__foil',
      '.ported-style-page--holographic-fluid .hf-fields i:first-child',
      '.ported-style-page--holographic-fluid .hf-fields i:last-child',
    ]);
    expect(ruleBody(fluidCss, '.ported-style-page--holographic-fluid .hf-disc__foil')).toMatch(/conic-gradient\(from calc\(24deg \+ var\(--hf-shift, 0deg\)\)/);
    expect(fluidCss).not.toMatch(/backdrop-filter/);
  });

  it('Holographic Fluid: a preview ends on a 20-second timer, not on the end of an animation', () => {
    const source = read('src/ported/pages/PortedHolographicFluidPage.tsx');
    expect(source).toMatch(/const PREVIEW_MS = 20000;/);
    expect(source).toMatch(/window\.setTimeout\(\(\) => setPlaying\(null\), PREVIEW_MS\)/);
    expect(source).toMatch(/return \(\) => window\.clearTimeout\(timer\);/);
    expect(source).not.toMatch(/onAnimationEnd/);
    // One state holds the playing track, so two previews cannot run at once.
    expect(source.match(/useState<number \| null>\(null\)/g)?.length).toBe(1);
  });

  it('Holo x Glass: the time is set one character per fixed cell, sized in em', () => {
    const digit = ruleBody(glassCss, '.ported-style-page--fusion-holo-glass .hg-digit');
    expect(digit).toMatch(/display:\s*inline-block/);
    expect(digit).toMatch(/width:\s*0\.\d+em/);
    expect(digit).toMatch(/text-align:\s*center/);
    const mark = ruleBody(glassCss, '.ported-style-page--fusion-holo-glass .hg-digit--mark');
    expect(parseFloat(mark.match(/width:\s*([\d.]+)em/)?.[1] ?? '9')).toBeLessThan(parseFloat(digit.match(/width:\s*([\d.]+)em/)?.[1] ?? '0'));
    // No later rule changes a cell's width, on a phone or anywhere else.
    expect(cssRules(glassCss).filter((rule) => rule.selectors.some((selector) => /\.hg-digit(?:--mark)?$/.test(selector))).length).toBe(2);
    const time = ruleBody(glassCss, '.ported-style-page--fusion-holo-glass .hg-pane__time');
    expect(time).toMatch(/font:\s*200 clamp\(9\.5rem, 36vw, 20rem\)\/0\.78 var\(--fs-display\)/);
    expect(time).not.toMatch(/tabular-nums/);
  });

  it('Holo x Glass: each record time is read once, from a hidden text copy', async () => {
    const html = content(await renderPage('fusion-holo-glass'));
    const times = [...html.matchAll(/<time class="hg-log__time" dateTime="(\d\d:\d\d)"><span class="hg-sr">(\d\d:\d\d)<\/span>((?:<span class="hg-digit[^"]*" aria-hidden="true">[^<]<\/span>){5})<\/time>/g)];
    expect(times.length).toBe(4);
    for (const [, attribute, text, cells] of times) {
      expect(text).toBe(attribute);
      expect(cells.replace(/<[^>]+>/g, '')).toBe(attribute);
    }
    const hidden = ruleBody(glassCss, '.ported-style-page--fusion-holo-glass .hg-sr');
    expect(hidden).toMatch(/position:\s*absolute/);
    expect(hidden).toMatch(/clip-path:\s*inset\(50%\)/);
    expect(hidden).not.toMatch(/display:\s*none|visibility:\s*hidden/);
  });

  it('Holo x Glass: the build keeps the blur of the pane', () => {
    // The production minifier keeps the last of the two declarations. Chrome reads only the
    // unprefixed one, so it has to come second.
    const pane = ruleBody(glassCss, '.ported-style-page--fusion-holo-glass .hg-pane');
    const prefixed = pane.indexOf('-webkit-backdrop-filter:');
    const plain = pane.search(/(?<!-webkit-)backdrop-filter:/);
    expect(prefixed).toBeGreaterThan(-1);
    expect(plain).toBeGreaterThan(prefixed);
    expect(pane).toMatch(/(?<!-webkit-)backdrop-filter:\s*blur\(24px\) saturate\(140%\)/);
  });

  it('Holo x Glass: controls are the timer\'s own and everything under the hero is flat', async () => {
    const html = content(await renderPage('fusion-holo-glass'));
    const pane = html.match(/<div class="hg-pane" id="hg-timer">[\s\S]*?<\/div><\/div><\/section>/)?.[0] ?? '';
    // Two buttons to run the timer, one slider, four swatches.
    expect(pane.match(/<button\b/g)?.length).toBe(6);
    expect(pane.match(/<input\b/g)?.length).toBe(1);
    const below = html.slice(html.indexOf('<section class="hg-section"'));
    expect(below).not.toMatch(/<button\b|<input\b/);
    expect(below.match(/<a class="hg-link"/g)?.length).toBe(1);
    const go = ruleBody(glassCss, '.ported-style-page--fusion-holo-glass .hg-pane__go');
    expect(go).toMatch(/width:\s*96px/);
    expect(go).toMatch(/border-radius:\s*50%/);
    expect(ruleBody(glassCss, '.ported-style-page--fusion-holo-glass .hg-pane__reset')).toMatch(/text-decoration:\s*underline/);
    // Gradients: the aurora, the swatches and the slider ticks.
    const gradients = cssRules(glassCss).filter((rule) => /gradient\(/.test(rule.body)).map((rule) => rule.selectors.join(', ').replace('.ported-style-page--fusion-holo-glass ', ''));
    expect(gradients.sort()).toEqual(['.hg-aurora', '.hg-lights__swatch', '.hg-slider::before']);
    expect(declarations(glassCss, 'box-shadow')).toEqual([]);
  });
});

describe('the English prompt states the values the stylesheet uses', () => {
  const tokenLines = (text: string) => new Map([...text.matchAll(/^--([a-z0-9-]+): (#[0-9a-f]{6}|rgba\([^)]*\))/gm)].map((match) => [match[1], compact(match[2])]));

  it('Runtime Signal: colour tokens, type scale and controls', async () => {
    const text = await prompt('runtime-signal');
    const tokens = tokenLines(text);
    expect([...tokens.keys()]).toEqual(['bg', 'surface', 'text', 'muted', 'line', 'grid', 'accent', 'accent-alt', 'danger']);
    for (const [name, value] of tokens) expect(compact(declarations(signalCss, `--${name}`)[0]), `--${name}`).toBe(value);

    const rule = (selector: string) => ruleBody(signalCss, `.ported-style-page--runtime-signal ${selector}`);
    expect(text).toContain('H1: clamp(2.6rem, 5.1vw, 4.5rem), weight 600, line-height 1, letter-spacing -0.05em');
    expect(rule('h1')).toMatch(/font:\s*600 clamp\(2\.6rem, 5\.1vw, 4\.5rem\)\/1 var\(--sans\);\s*letter-spacing:\s*-0\.05em/);
    expect(text).toContain('H2: clamp(1.8rem, 3.1vw, 2.5rem), weight 600, line-height 1.05, letter-spacing -0.04em');
    expect(rule('h2')).toMatch(/font:\s*600 clamp\(1\.8rem, 3\.1vw, 2\.5rem\)\/1\.05 var\(--sans\);\s*letter-spacing:\s*-0\.04em/);
    expect(text).toContain('H3: 1.375rem, weight 600, line-height 1.2, letter-spacing -0.03em');
    expect(rule('h3')).toMatch(/font:\s*600 1\.375rem\/1\.2 var\(--sans\);\s*letter-spacing:\s*-0\.03em/);
    expect(text).toContain('Body: 1.0625rem, line-height 1.6');
    expect(ruleBody(signalCss, '.ported-style-page--runtime-signal')).toMatch(/font:\s*400 1\.0625rem\/1\.6 var\(--sans\)/);
    expect(text).toContain('Mono meta: 0.8125rem, written in the case it is read in, no added tracking');
    expect(rule('.trace__head')).toMatch(/font:\s*400 0\.8125rem\/1\.4 var\(--mono\)/);
    expect(text).toContain('Figures: 2.2rem, weight 600, letter-spacing -0.05em');
    expect(rule('.stat-strip__value')).toMatch(/font:\s*600 2\.2rem\/1 var\(--sans\);\s*letter-spacing:\s*-0\.05em/);
    expect(text).toContain('Table numerics: Geist Mono 1.125rem, weight 500');
    expect(rule('.status-table td:nth-child(3)')).toMatch(/font:\s*500 1\.125rem\/1 var\(--mono\)/);
    expect(text).toContain('buttons: 44px high and square');
    expect(text).toContain('filters and tabs: text buttons, the selected one with a 2px teal underline');
    expect(text).toContain('motion: hover transitions only, 160ms max');
    expect(text).toContain('search: an underlined field with a small icon, no box');
    const field = rule('.toolbar__field');
    expect(field).toMatch(/border-bottom:\s*1px solid var\(--line\)/);
    expect(field).not.toMatch(/border:\s*1px|background/);
  });

  it('Holographic Fluid: colour tokens, type scale, rules and motion', async () => {
    const text = await prompt('holographic-fluid');
    const tokens = tokenLines(text);
    const names: Record<string, string> = { bg: '--fs-bg', surface: '--fs-surface', text: '--fs-ink', muted: '--fs-muted', line: '--fs-line', c1: '--hf-c1', c2: '--hf-c2', c3: '--hf-c3', c4: '--hf-c4', c5: '--hf-c5' };
    expect([...tokens.keys()]).toEqual(Object.keys(names));
    for (const [name, value] of tokens) expect(compact(declarations(fluidCss, names[name])[0]), name).toBe(value);

    const rule = (selector: string) => ruleBody(fluidCss, `.ported-style-page--holographic-fluid ${selector}`);
    expect(text).toContain("Display: Fraunces 300 with the soft axis at its maximum (font-variation-settings: 'SOFT' 100, 'WONK' 1), tracking -0.05em, line-height 0.8, clamp(5.5rem, 31vw, 25rem)");
    const title = rule('.hf-hero__title');
    expect(title).toMatch(/font-size:\s*clamp\(5\.5rem, 31vw, 25rem\)/);
    expect(title).toMatch(/line-height:\s*0\.8;/);
    expect(title).toMatch(/letter-spacing:\s*-0\.05em/);
    expect(text).toContain('Headings: the same light, soft Fraunces, tracking -0.035em, clamp(2.75rem, 6.6vw, 5.25rem)');
    expect(rule('.hf-heading')).toMatch(/font-size:\s*clamp\(2\.75rem, 6\.6vw, 5\.25rem\)/);
    expect(rule('.hf-heading')).toMatch(/letter-spacing:\s*-0\.035em/);
    expect(text).toContain('1.0625rem, line-height 1.6');
    expect(rule('.hf')).toMatch(/font-size:\s*1\.0625rem;[\s\S]*line-height:\s*1\.6;/);
    expect(text).toContain('Lengths, dates, prices and catalogue numbers: Fragment Mono, 0.95rem');
    for (const selector of ['.hf-facts dd', '.hf-track__length', '.hf-price']) expect(rule(selector), selector).toMatch(/font-family:\s*var\(--fs-mono\);\s*font-size:\s*0\.95rem/);
    expect(text).toContain('Dotted leader: a 2px dotted line at 0.38 opacity');
    expect(text).toContain('Rows: 1px line at 0.26 opacity, no background, no radius. A 2px white rule under each side heading.');
    expect(rule('.hf-track')).toMatch(/border-bottom:\s*1px solid var\(--hf-line\)/);
    expect(compact(declarations(fluidCss, '--hf-line')[0])).toBe('rgba(255,255,255,0.26)');
    expect(rule('.hf-rule')).toMatch(/border-bottom:\s*2px solid #ffffff/);
    expect(text).toContain('Max width about 1120px, section gap 120px.');
    expect(rule('.hf-section')).toMatch(/margin-top:\s*120px/);
    expect(text).toContain('The record turns once every 48s. Fields drift over 18s.');
    expect(rule('.hf-disc__foil')).toMatch(/animation:\s*hf-spin 48s linear infinite/);
    expect(rule('.hf-fields i')).toMatch(/animation:\s*hf-drift 18s /);
    expect(text).toContain('prefers-reduced-motion stops the turning and the drift.');
    const reduced = fluidCss.match(/@media \(prefers-reduced-motion: reduce\) \{([\s\S]*?)\n\}/)?.[1] ?? '';
    expect(reduced).toMatch(/\.hf-fields i,\s*\.ported-style-page--holographic-fluid \.hf-disc__foil \{\s*animation:\s*none;/);
    expect(text).toContain('Form: one single-line field on a 2px underline with a text button on the same line, visible label, error text under the field.');
    expect(rule('.hf-field')).toMatch(/border-bottom:\s*2px solid #ffffff/);
  });

  it('Holo x Glass: tokens, light scenes, the pane, type scale and the slider', async () => {
    const text = await prompt('fusion-holo-glass');
    const html = content(await renderPage('fusion-holo-glass'));
    const tokens = tokenLines(text);
    const names: Record<string, string> = { bg: '--fs-bg', ink: '--fs-ink', muted: '--fs-muted', line: '--fs-line' };
    expect([...tokens.keys()]).toEqual(Object.keys(names));
    for (const [name, value] of tokens) expect(compact(declarations(glassCss, names[name])[0]), name).toBe(value);

    // The four scenes of the prompt are the four swatches of the timer, colour for colour.
    const scenes = [...text.matchAll(/^ {2}(dawn|forest|lilac|dusk) (#[0-9a-f]{6}) \/ (#[0-9a-f]{6}) \/ (#[0-9a-f]{6})$/gm)].map((match) => match.slice(1, 5));
    const swatches = [...html.matchAll(/class="hg-lights__swatch" style="--hg-s-a:(#[0-9a-f]{6});--hg-s-b:(#[0-9a-f]{6});--hg-s-c:(#[0-9a-f]{6})"[^>]*aria-label="([^"]+)"/g)].map((match) => [match[4].toLowerCase(), match[1], match[2], match[3]]);
    expect(scenes.length).toBe(4);
    expect(swatches).toEqual(scenes);
    // The page opens on the first scene, and the stylesheet's own defaults are that scene.
    expect(['--hg-a', '--hg-b', '--hg-c'].map((name) => declarations(glassCss, name)[0])).toEqual(scenes[0].slice(1));

    const rule = (selector: string) => ruleBody(glassCss, `.ported-style-page--fusion-holo-glass ${selector}`);
    expect(text).toContain('rgba(14,16,28,0.34) fill, 1px line at rgba(255,255,255,0.36), backdrop-filter blur(24px) saturate(140%), radius 30px');
    const pane = rule('.hg-pane');
    expect(compact(pane)).toContain('background:rgba(14,16,28,0.34)');
    expect(compact(pane)).toContain('border:1pxsolidrgba(255,255,255,0.36)');
    expect(pane).toMatch(/border-radius:\s*30px/);
    expect(text).toContain('H1 clamp(3.4rem, 7.6vw, 6.6rem), H2 clamp(2.6rem, 5.4vw, 4.4rem)');
    expect(text).toContain('Headings: Sofia Sans Extra Condensed 500, line-height 0.94 to 0.96.');
    expect(rule('.hg h1')).toMatch(/font:\s*500 clamp\(3\.4rem, 7\.6vw, 6\.6rem\)\/0\.94 var\(--fs-display\)/);
    expect(rule('.hg-section h2')).toMatch(/font:\s*500 clamp\(2\.6rem, 5\.4vw, 4\.4rem\)\/0\.96 var\(--fs-display\)/);
    expect(text).toContain('Timer digits: Sofia Sans Extra Condensed 200, thin tall figures at clamp(9.5rem, 36vw, 20rem) with line-height 0.78.');
    expect(text).toContain('Body: Sofia Sans 400 at 1.0625rem with line-height 1.6');
    expect(rule('.hg')).toMatch(/font-size:\s*1\.0625rem;\s*line-height:\s*1\.6;/);
    expect(text).toContain('a range slider for the focus length (5 to 60 minutes in steps of 5)');
    expect(html).toMatch(/<input id="hg-length" type="range" min="5" max="60" step="5"/);
    expect(text).toContain('The aurora drifts over 24s. The timer ticks once a second.');
    expect(rule('.hg-aurora')).toMatch(/animation:\s*hg-drift 24s /);
    expect(read('src/ported/pages/PortedFusionHoloGlassPage.tsx')).toMatch(/window\.setInterval\(\(\) => dispatch\(\{ type: 'tick' \}\), 1000\)/);
    expect(text).toContain('prefers-reduced-motion stops the drift.');
    expect(glassCss.match(/@media \(prefers-reduced-motion: reduce\) \{([\s\S]*?)\n\}/)?.[1] ?? '').toMatch(/\.hg-aurora \{\s*animation:\s*none;/);
    // The headline is in the prompt's own words about the hero: one centred column, timer under the copy.
    expect(html.indexOf('class="hg-hero__copy"')).toBeLessThan(html.indexOf('class="hg-stage"'));
  });
});

describe('home cards of the three styles', () => {
  // Under the site rule set D a home card shows a screenshot of the page and sets the
  // name in the shell face, so the home page loads no card title faces.
  it('set the name in the shell face, without a title rule of their own', () => {
    const rules = cssRules(stylesCss);
    for (const id of IDS) expect(rules.filter((rule) => rule.selectors.some((selector) => selector.includes(`.style-card--${id}`))), id).toEqual([]);
    expect(read('src/components/StyleCard.tsx')).not.toMatch(/style-card--/);
    expect(cssRules(read('src/pages/Home.css')).find((rule) => rule.selectors.includes('.home-d .home-card .home-card__name'))?.body).toMatch(/font-family:\s*var\(--font-heading\)/);
  });
});

describe('the page rules stay on their own page', () => {
  for (const id of IDS) {
    const { css, scope } = PILOTS[id];

    it(`${id}: every selector is scoped to the page`, () => {
      const selectors = cssRules(css).flatMap((rule) => rule.selectors).filter((selector) => !isKeyframeStep(selector));
      expect(selectors.length).toBeGreaterThan(100);
      expect(selectors.filter((selector) => !scope.test(selector))).toEqual([]);
    });
  }

  it('keyframes of the two page stylesheets carry the page prefix and exist nowhere else', () => {
    const shared = portedCss + read('src/ported/fusionPages.css') + read('src/ported/fusionShell.css') + stylesCss;
    for (const [css, prefix] of [[fluidCss, 'hf-'], [glassCss, 'hg-']] as const) {
      const names = [...css.matchAll(/@keyframes ([\w-]+)/g)].map((match) => match[1]);
      expect(names.length).toBeGreaterThan(0);
      for (const name of names) {
        expect(name.startsWith(prefix), name).toBe(true);
        expect(shared).not.toMatch(new RegExp(`@keyframes ${name}\\b`));
      }
    }
  });

  it('the shared stylesheets hold no rule for the two pages that have their own file', () => {
    const shared = portedCss + read('src/ported/fusionPages.css');
    expect(shared).not.toMatch(/\.ported-style-page--holographic-fluid/);
    expect(shared).not.toMatch(/\.ported-style-page--fusion-holo-glass/);
    // Only Runtime Signal's block, and the shared page-nav rules that step aside for it, name it.
    const outside = portedCss.replace(signalCss, '');
    const named = cssRules(outside).flatMap((rule) => rule.selectors).filter((selector) => selector.includes('--runtime-signal'));
    expect(named.filter((selector) => !selector.includes(':not(.ported-style-page--runtime-signal)'))).toEqual([]);
  });
});
