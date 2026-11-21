// Reviewer tests for the second batch of rebuilt style pages (English routes): the six
// fusion pages that shared one cloned skeleton now each show one believable subject in
// their own typeface voice, with components taken from that subject.
//   fusion-neon-swiss          night-bus network     Familjen Grotesk + Azeret Mono
//   fusion-bento-noir          eight-seat counter    Shippori Mincho + Hanken Grotesk
//   fusion-cyber-console       command-line sync     Martian Mono
//   fusion-clay-aurora         pottery studio        Fredoka
//   fusion-grain-mono          film lab              Courier Prime
//   fusion-editorial-terminal  magazine issue        Newsreader + Fira Code
// These guard the decisions a later edit could undo without anything else failing: the
// families each page names and loads, no pill, card, all-caps label or old skeleton part,
// every class drawn by a rule, the shell drawn in the page's language, the prompt stating
// the values the stylesheet really uses, and the structure of each page's own components.
// Markup is checked with renderToStaticMarkup and CSS by reading the source. Fonts being
// painted, the controls, focus and the layouts at 320/375/768/1280 were checked in a browser.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createElement, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { originalStyleFonts, routeFontQueries } from '../../src/data/routeFontManifest';
import { styleRoutes } from '../../src/data/routes';
import { styleById, type Lang, type StyleData } from '../../src/data/styles';
import { getRouteFontFamilies } from '../../src/utils/routeFonts';
import { FONT_LICENSES, FONT_SCRIPT_COVERAGE } from '../../src/visual/fontSources';
import fontWeights from '../../src/visual/fontWeights.json';
import recipes from '../../src/visual/recipes.json';

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

type PageId =
  | 'fusion-neon-swiss'
  | 'fusion-bento-noir'
  | 'fusion-cyber-console'
  | 'fusion-clay-aurora'
  | 'fusion-grain-mono'
  | 'fusion-editorial-terminal';

interface Page {
  file: string;
  /** Families the page's stylesheet asks for, which are also its manifest entry. */
  manifest: string[];
  /** The Latin face each stack variable must lead with. null: the page authors no such variable. */
  stacks: Record<'--fs-display' | '--fs-body' | '--fs-mono', string | null>;
  /** The face that sets running text, so a weight without a family in its rule is checked against it. */
  text: string;
}

const PAGES: Record<PageId, Page> = {
  'fusion-neon-swiss': {
    file: 'PortedFusionNeonSwissPage',
    manifest: ['Azeret Mono', 'Familjen Grotesk'],
    stacks: { '--fs-display': 'Familjen Grotesk', '--fs-body': 'Familjen Grotesk', '--fs-mono': 'Azeret Mono' },
    text: 'Familjen Grotesk',
  },
  'fusion-bento-noir': {
    file: 'PortedFusionBentoNoirPage',
    manifest: ['Hanken Grotesk', 'Shippori Mincho'],
    stacks: { '--fs-display': 'Shippori Mincho', '--fs-body': 'Hanken Grotesk', '--fs-mono': null },
    text: 'Hanken Grotesk',
  },
  'fusion-cyber-console': {
    file: 'PortedFusionCyberConsolePage',
    manifest: ['Martian Mono'],
    stacks: { '--fs-display': 'Martian Mono', '--fs-body': 'Martian Mono', '--fs-mono': 'Martian Mono' },
    text: 'Martian Mono',
  },
  'fusion-clay-aurora': {
    file: 'PortedFusionClayAuroraPage',
    manifest: ['Fredoka'],
    stacks: { '--fs-display': 'Fredoka', '--fs-body': 'Fredoka', '--fs-mono': null },
    text: 'Fredoka',
  },
  'fusion-grain-mono': {
    file: 'PortedFusionGrainMonoPage',
    manifest: ['Courier Prime'],
    stacks: { '--fs-display': 'Courier Prime', '--fs-body': 'Courier Prime', '--fs-mono': 'Courier Prime' },
    text: 'Courier Prime',
  },
  'fusion-editorial-terminal': {
    file: 'PortedFusionEditorialTerminalPage',
    manifest: ['Fira Code', 'Newsreader'],
    stacks: { '--fs-display': 'Newsreader', '--fs-body': 'Newsreader', '--fs-mono': 'Fira Code' },
    text: 'Newsreader',
  },
};
const IDS = Object.keys(PAGES) as PageId[];

const cssOf = (id: PageId) => read(`src/ported/pages/${PAGES[id].file}.css`);
const sourceOf = (id: PageId) => read(`src/ported/pages/${PAGES[id].file}.tsx`);

// The families these six pages were set in before the rebuild.
const OLD_FAMILIES = ['Inter', 'JetBrains Mono', 'Cormorant Garamond', 'DM Serif Display'];
// Korean and Japanese fallbacks that close some stacks. They are outside this English review.
const CJK_FALLBACK = /^Noto (?:Sans|Serif) (?:KR|JP)$/;
// Every style route loads the shell face for the strip above the page and the three faces the previews were authored against.
const SHELL_FAMILIES = ['Wanted Sans Variable', 'Inter', 'Space Grotesk', 'IBM Plex Mono'];
// The Latin faces of the three pages rebuilt in the first batch.
const PILOT_FAMILIES = ['Geist', 'Geist Mono', 'Fraunces', 'Fragment Mono', 'Sofia Sans', 'Sofia Sans Extra Condensed'];

type PageProps = { style: StyleData; lang: Lang };

async function renderPage(id: PageId, lang: Lang = 'en'): Promise<string> {
  const { file } = PAGES[id];
  const module = (await import(`../../src/ported/pages/${file}.tsx`)) as Record<string, ComponentType<PageProps>>;
  const style = styleById.get(id);
  if (!style) throw new Error(`No style data for ${id}`);
  return renderToStaticMarkup(createElement(module[file], { style, lang }));
}

const decode = (text: string) =>
  text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'");

/** The English prompt as the page prints it. */
async function prompt(id: PageId): Promise<string> {
  const html = await renderPage(id);
  return decode(html.match(/<pre data-lang="en"[^>]*>([\s\S]*?)<\/pre>/)?.[1] ?? '');
}

/** The page's own content: what FusionShell wraps, without the shell or the prompt panel. */
function content(html: string): string {
  const start = html.indexOf('<div class="fusion-shell__content">');
  const end = html.indexOf('<details class="prompt fusion-shell__prompt">');
  return html.slice(start, end);
}

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

const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');

/** Innermost style rules of a stylesheet, in source order. At-rule wrappers are dropped. */
function cssRules(css: string): CssRule[] {
  return [...stripComments(css).matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((match) => ({ selectors: splitSelectors(match[1]), body: match[2] }));
}

const isKeyframeStep = (selector: string) => /^(?:from|to|\d+(?:\.\d+)?%)$/.test(selector);

/** The first rule, in source order, that lists exactly this selector. */
function ruleBody(css: string, selector: string): string {
  return cssRules(css).find((rule) => rule.selectors.includes(selector))?.body ?? '';
}

const declarations = (css: string, property: string) =>
  [...stripComments(css).matchAll(new RegExp(`(?:^|[;{\\s])${property}:\\s*([^;}]+)`, 'g'))].map((match) => match[1].trim());

const compact = (value: string) => value.replace(/\s+/g, '').toLowerCase();

/** Quoted family names in a stylesheet. */
const namedFamilies = (css: string) => [...new Set([...stripComments(css).matchAll(/["']([A-Z][A-Za-z0-9 ]+?)["']/g)].map((match) => match[1]))];

/** The weights a Google Fonts query asks for: a list, or a range for a variable font. */
function queryWeights(family: string): { has: (weight: number) => boolean; list: number[] | null } {
  const query = routeFontQueries[family];
  if (!query.includes(':')) return { has: (weight) => weight === 400, list: [400] };
  const [axes, tuples] = query.split(':')[1].split('@');
  const index = axes.split(',').indexOf('wght');
  const values = [...new Set(tuples.split(';').map((tuple) => tuple.split(',')[index]))];
  const range = values[0].match(/^(\d+)\.\.(\d+)$/);
  if (range) return { has: (weight) => weight >= Number(range[1]) && weight <= Number(range[2]), list: null };
  const list = [...new Set(values.map(Number))].sort((a, b) => a - b);
  return { has: (weight) => list.includes(weight), list };
}

/** The family a stack variable leads with on this page. */
const leading = (id: PageId, variable: string) => {
  const value = declarations(cssOf(id), variable)[0] ?? '';
  return value.replace(/^["']|["'].*$/g, '');
};

/** Native inputs of one name in rendered markup, whatever order React writes their attributes in. */
const inputsNamed = (html: string, name: string) =>
  [...html.matchAll(/<input\b[^>]*>/g)]
    .map((match) => match[0])
    .filter((tag) => tag.includes(` name="${name}"`))
    .map((tag) => ({ value: tag.match(/ value="([^"]*)"/)?.[1] ?? '', id: tag.match(/ id="([^"]*)"/)?.[1] ?? '', checked: / checked=""/.test(tag), disabled: / disabled=""/.test(tag) }));

/** Class names in rendered markup. */
const classesIn = (html: string) => [...new Set([...html.matchAll(/class="([^"]+)"/g)].flatMap((match) => match[1].split(/\s+/)))];

describe('each page has its own typeface voice', () => {
  for (const id of IDS) {
    const page = PAGES[id];

    it(`${id}: the stylesheet names the families of its manifest entry and none of the old ones`, () => {
      const named = namedFamilies(cssOf(id)).filter((family) => !CJK_FALLBACK.test(family));
      expect(named.filter((family) => family in routeFontQueries).sort()).toEqual([...page.manifest].sort());
      expect([...originalStyleFonts[id]].sort()).toEqual([...page.manifest].sort());
      expect(named.filter((family) => OLD_FAMILIES.includes(family))).toEqual([]);
    });

    it(`${id}: every stack leads with the Latin face, in every language`, () => {
      for (const [variable, family] of Object.entries(page.stacks)) {
        const values = declarations(cssOf(id), variable);
        if (family === null) {
          expect(values, variable).toEqual([]);
          continue;
        }
        expect(values.length, variable).toBeGreaterThan(0);
        for (const value of values) expect(value.replace(/^["']|["'].*$/g, ''), `${variable}: ${value}`).toBe(family);
      }
      // No rule sets a literal family past the variables.
      const literal = declarations(cssOf(id), 'font-family').filter((value) => !/^(?:var\(--[a-z-]+\)|inherit)$/.test(value));
      expect(literal).toEqual([]);
    });

    it(`${id}: the route loads its families, and each is an allow-listed OFL face with Latin coverage`, () => {
      const route = styleRoutes.find((item) => item.styleId === id);
      expect(route).toBeDefined();
      expect([...getRouteFontFamilies(route!, 'en')].sort()).toEqual([...new Set([...SHELL_FAMILIES, ...page.manifest])].sort());
      for (const family of page.manifest) {
        expect(routeFontQueries[family], family).toBeDefined();
        expect(FONT_LICENSES[family]?.license, family).toBe('OFL-1.1');
        expect(FONT_LICENSES[family].licenseUrl).toContain(`/ofl/${family.toLowerCase().replace(/ /g, '')}/`);
        expect(FONT_SCRIPT_COVERAGE[family]).toContain('latin');
      }
    });

    it(`${id}: the English prompt names the families the page uses and none of the old ones`, async () => {
      const text = await prompt(id);
      expect(text.length).toBeGreaterThan(2500);
      for (const family of page.manifest) expect(text).toContain(family);
      for (const family of OLD_FAMILIES) expect(text, family).not.toMatch(new RegExp(`\\b${family}\\b`));
    });

    it(`${id}: every weight the page sets is one its font query loads, so no weight is synthesised`, () => {
      const css = cssOf(id);
      const checked: string[] = [];
      for (const rule of cssRules(css)) {
        const shorthand = [...rule.body.matchAll(/(?:^|[;\s])font:\s*(\d{3})\s[^;]*var\((--fs-[a-z]+)\)/g)];
        for (const [, weight, variable] of shorthand) {
          const family = leading(id, variable);
          checked.push(`${family} ${weight}`);
          expect(queryWeights(family).has(Number(weight)), `${rule.selectors[0]}: ${family} ${weight}`).toBe(true);
        }
        const weight = rule.body.match(/(?:^|[;\s])font-weight:\s*(\d{3})\s*(?:;|$)/)?.[1];
        if (!weight) continue;
        const familyVar = rule.body.match(/font-family:\s*var\((--fs-[a-z]+)\)/)?.[1];
        const family = familyVar ? leading(id, familyVar) : page.text;
        checked.push(`${family} ${weight}`);
        expect(queryWeights(family).has(Number(weight)), `${rule.selectors[0]}: ${family} ${weight}`).toBe(true);
      }
      expect(checked.length).toBeGreaterThan(3);
    });
  }

  it('the six pages share no Latin family with each other or with the first three pilots', () => {
    const owners = new Map<string, PageId>();
    for (const id of IDS) {
      for (const family of PAGES[id].manifest) {
        expect(owners.get(family), `${family} is used by ${owners.get(family)} and ${id}`).toBeUndefined();
        owners.set(family, id);
        expect(PILOT_FAMILIES).not.toContain(family);
      }
    }
  });

  it('fontWeights.json lists loadable weights for every new family, and every weight the pages set', () => {
    const weights = fontWeights as Record<string, number[]>;
    for (const family of [...new Set(IDS.flatMap((id) => PAGES[id].manifest))]) {
      expect(weights[family], family).toBeDefined();
      for (const weight of weights[family]) expect(queryWeights(family).has(weight), `${family} ${weight}`).toBe(true);
    }
    // The static families list exactly what their query loads. Fira Code was registered
    // before this batch with 700 in its query; its new list stops at 500 (reported as open).
    for (const family of ['Azeret Mono', 'Courier Prime', 'Hanken Grotesk', 'Shippori Mincho']) expect(weights[family], family).toEqual(queryWeights(family).list);
  });

  it('Newsreader is set at the optical sizes the prompt names, and Fira Code without ligatures', () => {
    const css = cssOf('fusion-editorial-terminal');
    expect(routeFontQueries.Newsreader).toMatch(/^Newsreader:ital,opsz,wght@0,6\.\.72,400\.\.600;1,6\.\.72,400\.\.600$/);
    expect(ruleBody(css, '.ported-style-page--fusion-editorial-terminal .et-title')).toMatch(/font-variation-settings:\s*'opsz' 72/);
    expect(ruleBody(css, '.ported-style-page--fusion-editorial-terminal .et-h2')).toMatch(/font-variation-settings:\s*'opsz' 72/);
    expect(ruleBody(css, '.ported-style-page--fusion-editorial-terminal .et-prose')).toMatch(/font-variation-settings:\s*'opsz' 16/);
    // Every rule that sets the mono face turns its ligatures off, or inherits that from one that does.
    expect(css).toMatch(/font-variant-ligatures:\s*none/);
  });

  it('Martian Mono and Fredoka draw their headings from the width axis the query loads', () => {
    expect(routeFontQueries['Martian Mono']).toBe('Martian+Mono:wdth,wght@75..112.5,400..800');
    expect(routeFontQueries.Fredoka).toBe('Fredoka:wdth,wght@75..125,300..700');
    const stretches = (css: string) => declarations(css, 'font-stretch').map((value) => parseFloat(value));
    for (const value of stretches(cssOf('fusion-cyber-console'))) expect(value >= 75 && value <= 112.5, String(value)).toBe(true);
    for (const value of stretches(cssOf('fusion-clay-aurora'))) expect(value >= 75 && value <= 125, String(value)).toBe(true);
    expect(ruleBody(cssOf('fusion-cyber-console'), '.ported-style-page--fusion-cyber-console .cc h1')).toMatch(/font-stretch:\s*112\.5%/);
    expect(ruleBody(cssOf('fusion-clay-aurora'), '.ported-style-page--fusion-clay-aurora .ca-hero h1')).toMatch(/font-stretch:\s*122%/);
  });
});

describe('components come from the subject, not from the standard kit or the old skeleton', () => {
  // Square everywhere, except the materials that are round: the lacquer tray (5px) and the
  // seat marks of the counter (50%); clay is checked on its own below.
  const allowedRadii: Record<Exclude<PageId, 'fusion-clay-aurora'>, RegExp> = {
    'fusion-neon-swiss': /^0$/,
    'fusion-bento-noir': /^(?:0|5px|50%)$/,
    'fusion-cyber-console': /^0$/,
    'fusion-grain-mono': /^0$/,
    'fusion-editorial-terminal': /^0$/,
  };

  for (const id of IDS) {
    const css = () => cssOf(id);

    if (id !== 'fusion-clay-aurora') {
      it(`${id}: no radius outside the ones its material needs`, () => {
        const radii = declarations(css(), 'border-radius');
        expect(radii.length).toBeGreaterThan(0);
        expect(radii.filter((value) => !allowedRadii[id as Exclude<PageId, 'fusion-clay-aurora'>].test(value))).toEqual([]);
      });
    }

    it(`${id}: no all-caps, no small caps and no widely tracked labels`, () => {
      expect(declarations(css(), 'text-transform').filter((value) => value !== 'none')).toEqual([]);
      expect(css()).not.toMatch(/font-variant(?:-caps)?:\s*(?:all-)?small-caps/);
      // Tracking is in em, or zero. Positive tracking stops at 0.03em: the mincho name of the restaurant.
      for (const value of declarations(css(), 'letter-spacing')) {
        expect(value, value).toMatch(/^(?:0|-?\d*\.?\d+em)$/);
        expect(parseFloat(value), value).toBeLessThanOrEqual(0.03);
      }
    });

    it(`${id}: the markup has no card, pill, chip, badge, eyebrow or kicker, and none of the old cover parts`, async () => {
      const html = content(await renderPage(id));
      const classes = classesIn(html);
      expect(classes.filter((name) => /(?:^|[-_])(?:cards?|pills?|chips?|badges?|eyebrow|kicker|tagline)(?:$|[-_])/.test(name))).toEqual([]);
      expect(css()).not.toMatch(/\.[\w-]*(?:card|pill|chip|badge|eyebrow|kicker)[\w-]*\s*[,{:]/);
      // The cloned skeleton: a masthead of chips, a palette switcher, a cover with a
      // kicker, a marquee, a numbered lead and section eyebrows.
      expect(classes.filter((name) => /masthead|palette|marquee|-cover(?:$|__)|lead__num|art-(?:frame|stamp|grid)/.test(name))).toEqual([]);
      expect(html).not.toMatch(/N°\s?0\d|data-palette=/);
      expect(css()).not.toMatch(/@keyframes [\w-]*(?:marquee|blink|pulse|sweep|breathe)/);
    });

    it(`${id}: no gradient text`, () => {
      expect(css()).not.toMatch(/background-clip:\s*text|-webkit-text-fill-color:\s*transparent/);
    });

    it(`${id}: every class the page renders is drawn by a rule of its own stylesheet`, async () => {
      // Markup with every state that changes classes is not reachable statically; the
      // initial render holds every component.
      // Hooks with no look of their own: the small dish is the base size, and two
      // editorial sections are drawn by their other classes (reported as dead hooks).
      const hooks = new Set(['fusion-shell__content', 'bn-dish--sm', 'et-hero', 'et-second']);
      const classes = classesIn(content(await renderPage(id))).filter((name) => !hooks.has(name));
      const ruleText = cssRules(css()).flatMap((rule) => rule.selectors).join('\n');
      const missing = classes.filter((name) => !new RegExp(`\\.${name.replace(/[-_]/g, (char) => `\\${char}`)}(?![\\w-])`).test(ruleText));
      expect(missing).toEqual([]);
    });
  }

  it('Clay: rounded clay, never a pill on a control', () => {
    const css = cssOf('fusion-clay-aurora');
    // The one full round end is the glaze groove pressed into the test tile.
    const pills = cssRules(css).filter((rule) => /border-radius:\s*(?:\d{3,}px|99px)/.test(rule.body));
    expect(pills.map((rule) => rule.selectors.join(', '))).toEqual(['.ported-style-page--fusion-clay-aurora .ca-tile i']);
    // A control's radius stays under half its height, so its ends are never round.
    for (const [selector, height] of [['.ca-key', 62], ['.ca-levels button', 46], ['.ca-field :is(input, select)', 56]] as const) {
      const body = ruleBody(css, `.ported-style-page--fusion-clay-aurora ${selector}`);
      expect(body, selector).toMatch(new RegExp(`height:\\s*${height}px`));
      const radius = parseFloat(body.match(/border-radius:\s*([\d.]+)px/)?.[1] ?? '999');
      expect(radius, selector).toBeLessThan(height / 2);
    }
  });

  it('each page has at most one solid action button, and no hero holds two buttons', async () => {
    const solid: Record<PageId, RegExp> = {
      'fusion-neon-swiss': /class="ns-btn"/g,
      'fusion-bento-noir': /class="bn-btn bn-btn--solid"/g,
      'fusion-cyber-console': /class="cc-btn/g,
      'fusion-clay-aurora': /class="ca-key"/g,
      'fusion-grain-mono': /class="gm-btn"/g,
      'fusion-editorial-terminal': /class="et-btn/g,
    };
    const counts = await Promise.all(IDS.map(async (id) => (content(await renderPage(id)).match(solid[id]) ?? []).length));
    // Neon: the fares button. Bento: the reservation submit. Clay: the hero key and the
    // form key. Grain: the bar button and the order submit. Cyber and Editorial: none.
    expect(Object.fromEntries(IDS.map((id, index) => [id, counts[index]]))).toEqual({
      'fusion-neon-swiss': 1,
      'fusion-bento-noir': 1,
      'fusion-cyber-console': 0,
      'fusion-clay-aurora': 2,
      'fusion-grain-mono': 2,
      'fusion-editorial-terminal': 0,
    });
  });
});

describe('the shell is drawn in each page\'s language', () => {
  const rules = (id: PageId) => cssRules(cssOf(id));
  const scope = (id: PageId) => `.ported-style-page--${id}`;
  const forTarget = (id: PageId, target: string) =>
    rules(id).filter((rule) => rule.selectors.some((selector) => selector.startsWith(scope(id)) && selector.endsWith(target)));

  for (const id of IDS) {
    const radius = id === 'fusion-clay-aurora' ? /border-radius:\s*(?:8|10|12|14)px\s*;/ : /border-radius:\s*0\s*;/;

    it(`${id}: the shell's controls, prompt block and bars take the page's corners`, () => {
      for (const target of ['.fusion-shell__back', '.lang-toggle', '.fusion-shell__theme', '.fusion-shell__prompt button[data-copy-prompt]', '.fusion-shell__prompt pre', '.fusion-shell__pagenav', '.lang-menu', '.lang-menu button']) {
        const found = forTarget(id, target);
        expect(found.length, target).toBeGreaterThan(0);
        expect(found.some((rule) => radius.test(rule.body)), target).toBe(true);
      }
    });

    it(`${id}: the shell's labels are in reading case, untracked, at 0.75rem`, () => {
      for (const target of ['.fusion-shell__prompt-heading', '.fusion-shell__pagenav-label']) {
        expect(forTarget(id, target).some((rule) => /text-transform:\s*none\s*;/.test(rule.body) && /letter-spacing:\s*0\s*;/.test(rule.body)), target).toBe(true);
      }
      expect(forTarget(id, '.fusion-shell__pagenav-label').some((rule) => /font-size:\s*0\.75rem\s*;/.test(rule.body))).toBe(true);
      for (const rule of rules(id).filter((item) => /fusion-shell__|lang-/.test(item.selectors.join(' ')))) {
        expect(rule.body).not.toMatch(/border-radius:\s*9{3,4}px/);
        expect(rule.body).not.toMatch(/text-transform:\s*uppercase/);
      }
    });
  }
});

describe('the English prompt states the values the stylesheet uses', () => {
  /** `--name: value` lines of a prompt, the value up to a space or the end of the line. */
  const tokenLines = (text: string) => new Map([...text.matchAll(/^--([a-z0-9-]+): (#[0-9a-f]{6}|rgba?\([^)]*\))/gim)].map((match) => [match[1], compact(match[2])]));
  const value = (id: PageId, variable: string) => compact(declarations(cssOf(id), variable)[0] ?? `missing ${variable}`);

  it('every page: square or clay corners, no all-caps labels, 320px and reduced motion are in the forbidden and output lists', async () => {
    for (const id of IDS) {
      const text = await prompt(id);
      expect(text, id).toMatch(/FORBIDDEN:/);
      expect(text, id).toMatch(/all-caps tracked labels/);
      expect(text, id).toMatch(/[Cc]ards/);
      expect(text, id).toMatch(/320px/);
      expect(text, id).toMatch(/never as a page about its own style|in place of a subject/);
    }
  });

  it('Neon x Swiss: tokens, type scale, picker, strip and rules', async () => {
    const id = 'fusion-neon-swiss';
    const text = await prompt(id);
    const css = cssOf(id);
    const names: Record<string, string> = { bg: '--fs-bg', ink: '--fs-ink', muted: '--fs-muted', line: '--fs-line', teal: '--ns-teal', sky: '--ns-sky', lime: '--ns-lime' };
    const tokens = tokenLines(text);
    expect([...tokens.keys()]).toEqual(Object.keys(names));
    for (const [name, token] of tokens) expect(value(id, names[name]), name).toBe(token);
    const rule = (selector: string) => ruleBody(css, `.ported-style-page--fusion-neon-swiss ${selector}`);
    expect(text).toContain('H1: Familjen Grotesk 600, clamp(2.75rem, 7.4vw, 5.75rem), line-height 0.96, letter-spacing -0.045em');
    expect(rule('.ns h1')).toMatch(/font:\s*600 clamp\(2\.75rem, 7\.4vw, 5\.75rem\)\/0\.96 var\(--fs-display\);\s*letter-spacing:\s*-0\.045em/);
    expect(text).toContain('H2: Familjen Grotesk 600, clamp(1.875rem, 5.2vw, 2.875rem), line-height 1.02, letter-spacing -0.035em');
    expect(rule('.ns-head h2')).toMatch(/font:\s*600 clamp\(1\.875rem, 5\.2vw, 2\.875rem\)\/1\.02 var\(--fs-display\);\s*letter-spacing:\s*-0\.035em/);
    expect(text).toContain('Body: Familjen Grotesk 400, 1.0625rem, line-height 1.5');
    expect(rule('.ns')).toMatch(/font:\s*400 1\.0625rem\/1\.5 var\(--fs-body\)/);
    expect(text).toContain('Minutes are 2.125rem in the departures table, clock times 1rem.');
    expect(rule('.ns')).toMatch(/--ns-due:\s*2\.125rem/);
    expect(rule('.ns-at')).toMatch(/font:\s*400 1rem\/1 var\(--fs-mono\)/);
    expect(text).toContain('Line picker: buttons 48px high with a 1px rule');
    expect(rule('.ns-picker button')).toMatch(/height:\s*48px/);
    expect(text).toContain('Line strip: a 6px line in the line\'s colour, a 4px tick at each stop');
    expect(text).toContain('Hover changes colour in 160ms. Nothing else moves.');
    for (const duration of declarations(css, 'transition').flatMap((item) => [...item.matchAll(/(\d+)ms/g)].map((match) => Number(match[1])))) expect(duration).toBe(160);
    expect(css).not.toMatch(/@keyframes|animation:|box-shadow|text-shadow|gradient\(/);
  });

  it('Bento x Noir: tokens, the tray, the type scale and the colour jobs', async () => {
    const id = 'fusion-bento-noir';
    const text = await prompt(id);
    const css = cssOf(id);
    const names: Record<string, string> = { bg: '--fs-bg', lacquer: '--bn-lacquer', rim: '--bn-rim', ink: '--fs-ink', soft: '--bn-soft', muted: '--fs-muted', line: '--fs-line', gold: '--bn-gold', copper: '--bn-copper' };
    const tokens = tokenLines(text);
    expect([...tokens.keys()]).toEqual(Object.keys(names));
    for (const [name, token] of tokens) expect(value(id, names[name]), name).toBe(token);
    const rule = (selector: string) => ruleBody(css, `.ported-style-page--fusion-bento-noir ${selector}`);
    expect(text).toContain('One object: a 1px gold outline with a 5px radius, a 9px rim in --rim, then an inner 1px gold frame.');
    expect(rule('.bn-tray')).toMatch(/padding:\s*9px;\s*border:\s*1px solid var\(--bn-gold\);\s*border-radius:\s*5px;\s*background:\s*var\(--bn-rim\)/);
    expect(text).toContain('one ordered list on a 24-column grid with a 1px gap');
    expect(rule('.bn-tray ol')).toMatch(/grid-template-columns:\s*repeat\(24, minmax\(0, 1fr\)\)/);
    expect(rule('.bn-tray ol')).toMatch(/gap:\s*1px;[\s\S]*background:\s*var\(--bn-gold\)/);
    expect(text).toContain('H1, the name: Shippori Mincho 600, clamp(4.5rem, 10.5vw, 8rem), line-height 1, letter-spacing 0.03em.');
    expect(rule('.bn h1')).toMatch(/font:\s*600 clamp\(4\.5rem, 10\.5vw, 8rem\)\/1 var\(--fs-display\);\s*letter-spacing:\s*0\.03em/);
    expect(text).toContain('H2: Shippori Mincho 600, clamp(1.875rem, 3.3vw, 2.5rem), line-height 1.25, letter-spacing 0.02em.');
    expect(rule('.bn h2')).toMatch(/font:\s*600 clamp\(1\.875rem, 3\.3vw, 2\.5rem\)\/1\.25 var\(--fs-display\);\s*letter-spacing:\s*0\.02em/);
    expect(text).toContain('Dish names: Shippori Mincho 600 at 1.375rem, 1.6875rem or clamp(2.25rem, 3.5vw, 2.875rem)');
    expect(rule('.bn-dish h3')).toMatch(/font:\s*600 1\.375rem/);
    expect(rule('.bn-dish--md h3')).toMatch(/font-size:\s*1\.6875rem/);
    expect(rule('.bn-dish--lg h3')).toMatch(/font-size:\s*clamp\(2\.25rem, 3\.5vw, 2\.875rem\)/);
    expect(text).toContain('Seating times at 2.625rem with tabular figures.');
    expect(rule('.bn-seating__time')).toMatch(/font:\s*600 2\.625rem\/1 var\(--fs-display\);\s*font-variant-numeric:\s*lining-nums tabular-nums/);
    // Gold: the tray's lines, the stepper's frame and two figures. No gold text block, button or gradient stop elsewhere.
    expect(text).toContain('Gold draws the tray\'s lines and the frame of the stepper, and colours two figures: the price per person and the total.');
    const goldText = cssRules(css).filter((item) => /(?:^|;)\s*color:\s*var\(--bn-gold\)/.test(item.body)).map((item) => item.selectors.join(', '));
    expect(goldText.sort()).toEqual(['.ported-style-page--fusion-bento-noir .bn-sum b', '.ported-style-page--fusion-bento-noir .bn-tonight__price b'].sort());
    expect(text).toContain('No text under 1rem.');
    const sizes = declarations(css, 'font-size').map((item) => item.replace(/\s*!important/, ''));
    // The shell's prev/next label is the one small text, and it is the shell's.
    expect(sizes.filter((item) => /^0\.\d+rem$/.test(item))).toEqual(['0.75rem']);
    expect(text).toContain('A 160ms colour change on hover and nothing else. prefers-reduced-motion removes it.');
    expect(css).not.toMatch(/@keyframes|animation:/);
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
  });

  it('Cyber Console: tokens, the one glitch, the one family and the window', async () => {
    const id = 'fusion-cyber-console';
    const text = await prompt(id);
    const css = cssOf(id);
    const names: Record<string, string> = { bg: '--fs-bg', surface: '--fs-surface', text: '--fs-ink', dim: '--cc-dim', muted: '--fs-muted', line: '--fs-line', rule: '--cc-rule', magenta: '--cc-magenta', lime: '--cc-lime', cyan: '--cc-cyan' };
    const tokens = tokenLines(text);
    expect([...tokens.keys()]).toEqual(Object.keys(names));
    for (const [name, token] of tokens) expect(value(id, names[name]), name).toBe(token);
    const rule = (selector: string) => ruleBody(css, `.ported-style-page--fusion-cyber-console ${selector}`);
    expect(text).toContain('The wordmark carries a fixed one-pixel colour split: text-shadow -1px 0 magenta, 1px 0 cyan.');
    expect(rule('.cc-mark')).toMatch(/text-shadow:\s*-1px 0 var\(--cc-magenta\), 1px 0 var\(--cc-cyan\)/);
    // The glitch is on the wordmark only.
    expect(declarations(css, 'text-shadow')).toEqual(['-1px 0 var(--cc-magenta), 1px 0 var(--cc-cyan)']);
    expect(text).toContain('Wordmark: 800, width 112.5, 1.75rem, tracking -0.04em');
    expect(rule('.cc-mark')).toMatch(/font:\s*800 1\.75rem\/1 var\(--fs-display\);\s*font-stretch:\s*112\.5%;\s*letter-spacing:\s*-0\.04em/);
    expect(text).toContain('Headline: 700, width 112.5, tracking -0.045em, line-height 1.08, clamp(2rem, 5.3vw, 4.25rem)');
    expect(rule('.cc h1')).toMatch(/font:\s*700 clamp\(2rem, 5\.3vw, 4\.25rem\)\/1\.08 var\(--fs-display\);\s*font-stretch:\s*112\.5%;\s*letter-spacing:\s*-0\.045em/);
    expect(text).toContain('Body: 400, 1rem, line-height 1.7');
    expect(rule('.cc')).toMatch(/font-size:\s*1rem;\s*line-height:\s*1\.7/);
    expect(text).toContain('Terminal text: 400 (500 on the command line), 0.875rem, line-height 1.75');
    expect(rule('.cc-tx')).toMatch(/font-size:\s*0\.875rem;\s*line-height:\s*1\.75/);
    expect(text).toContain('A faint 1px scanline every 3px is the only texture.');
    expect(rule('.cc-term')).toMatch(/repeating-linear-gradient\(to bottom, rgba\(232, 236, 244, 0\.028\) 0 1px, transparent 1px 3px\)/);
    expect(text).toContain('Each pane has a 2px top rule in the colour of its state');
    expect(rule('.cc-pane')).toMatch(/border-top:\s*2px solid var\(--fs-line\)/);
    expect(rule('.cc-pane--ok')).toMatch(/border-top-color:\s*var\(--cc-lime\)/);
    expect(rule('.cc-pane--changed')).toMatch(/border-top-color:\s*var\(--cc-magenta\)/);
    expect(text).toContain('None. The cursor is a static block and nothing loops.');
    expect(css).not.toMatch(/@keyframes|animation:|transition:/);
    expect(css).not.toMatch(/box-shadow:\s*0 0 \d+px|filter:\s*blur|drop-shadow/);
  });

  it('Clay Aurora: tokens, two clay states, the band of light and the controls', async () => {
    const id = 'fusion-clay-aurora';
    const text = await prompt(id);
    const css = cssOf(id);
    const names: Record<string, string> = { bg: '--fs-bg', dent: '--ca-dent', mint: '--ca-mint', teal: '--ca-teal', violet: '--ca-violet', 'violet-deep': '--ca-violet-deep', text: '--fs-ink', muted: '--fs-muted', line: '--fs-line', edge: '--ca-edge' };
    // The shadow token is a colour with a range of opacities: the page keeps it as --ca-sh.
    expect(text).toContain('--shadow: rgb(52, 40, 128) at 0.14 to 0.6 opacity');
    expect(declarations(css, '--ca-sh')).toEqual(['52, 40, 128']);
    const tokens = tokenLines(text);
    tokens.delete('shadow');
    expect([...tokens.keys()]).toEqual(Object.keys(names));
    for (const [name, token] of tokens) expect(value(id, names[name]), name).toBe(token);
    const rule = (selector: string) => ruleBody(css, `.ported-style-page--fusion-clay-aurora ${selector}`);
    expect(text).toContain('Headline: weight 600, font-stretch 122%, tracking -0.015em, line-height 0.96, clamp(2.9rem, 5.2vw, 4rem)');
    expect(rule('.ca-hero h1')).toMatch(/font:\s*600 clamp\(2\.9rem, 5\.2vw, 4rem\)\/0\.96 var\(--fs-display\);\s*font-stretch:\s*122%;\s*letter-spacing:\s*-0\.015em/);
    expect(text).toContain('Section headings: weight 600, font-stretch 116%, tracking -0.01em, line-height 1, clamp(2.2rem, 4.2vw, 3.2rem)');
    expect(rule('.ca-heading')).toMatch(/font:\s*600 clamp\(2\.2rem, 4\.2vw, 3\.2rem\)\/1 var\(--fs-display\);\s*font-stretch:\s*116%;\s*letter-spacing:\s*-0\.01em/);
    expect(text).toContain('Body: weight 400 at normal width, 1.0625rem, line-height 1.55.');
    expect(rule('.ca')).toMatch(/font:\s*400 1\.0625rem\/1\.55 var\(--fs-body\)/);
    expect(text).toContain('Clay button: 62px high, radius 22px, violet with a 6px solid side in the deeper violet.');
    expect(rule('.ca-key')).toMatch(/height:\s*62px[\s\S]*border-radius:\s*22px[\s\S]*0 6px 0 var\(--ca-violet-deep\)/);
    expect(text).toContain('When pressed it travels down 5px and the side closes.');
    expect(rule('.ca-key:active')).toMatch(/transform:\s*translateY\(5px\)/);
    expect(text).toContain('Fields: 56px high, radius 16px, dent colour, 2px outline and an inner shadow.');
    expect(rule('.ca-field :is(input, select)')).toMatch(/height:\s*56px[\s\S]*border:\s*2px solid var\(--ca-edge\);\s*border-radius:\s*16px;\s*background:\s*var\(--ca-dent\)/);
    expect(text).toContain('The chosen blob lifts 9px and gets a 3px dark ring; keyboard focus adds a second ring.');
    expect(rule('.ca-glaze input:checked + i')).toMatch(/translate:\s*0 -9px;\s*outline:\s*3px solid var\(--fs-ink\)/);
    expect(rule('.ca-glaze input:focus-visible + i')).toMatch(/0 0 0 14px var\(--fs-ink\)/);
    expect(text).toContain('Focus: a 3px dark outline with a 4px offset.');
    expect(rule('.ca :focus-visible')).toMatch(/outline:\s*3px solid var\(--fs-ink\);\s*outline-offset:\s*4px/);
    // The band of light: once, on the page root, a -6deg band blurred 38px at 0.6 and rays above it.
    expect(text).toContain('It is drawn twice: as a soft band (blur 38px, opacity 0.6)');
    const soft = cssRules(css).find((item) => item.selectors.length === 1 && item.selectors[0] === '.ported-style-page--fusion-clay-aurora.fusion-page::before');
    expect(soft?.body).toMatch(/filter:\s*blur\(38px\);\s*opacity:\s*0\.6/);
    expect(ruleBody(css, '.ported-style-page--fusion-clay-aurora.fusion-page::before')).toMatch(/transform:\s*rotate\(-6deg\)/);
    const bandRules = cssRules(css).filter((item) => /var\(--ca-band\)/.test(item.body));
    expect(bandRules.map((item) => item.selectors.join(', '))).toEqual(['.ported-style-page--fusion-clay-aurora.fusion-page::before, .ported-style-page--fusion-clay-aurora.fusion-page::after']);
    // Shadows are violet, never grey or black.
    for (const shadow of declarations(css, 'box-shadow').concat(declarations(css, '--ca-raised'), declarations(css, '--ca-pressed'))) {
      expect(shadow, shadow).not.toMatch(/rgba\(0,\s*0,\s*0|#000\b|black|grey|gray/);
    }
    expect(text).toContain('prefers-reduced-motion removes the travel and the set-down.');
    const reduced = css.match(/@media \(prefers-reduced-motion: reduce\) \{([\s\S]*?)\n\}/)?.[1] ?? '';
    expect(reduced).toMatch(/\.ca-tile \{\s*animation:\s*none;/);
    expect(reduced).toMatch(/transform:\s*none;/);
  });

  it('Grain Mono: tokens, grain, one typewriter face and the two working colours', async () => {
    const id = 'fusion-grain-mono';
    const text = await prompt(id);
    const css = cssOf(id);
    const names: Record<string, string> = { paper: '--fs-bg', stock: '--gm-stock', ink: '--fs-ink', muted: '--fs-muted', rule: '--fs-line', rust: '--gm-rust', teal: '--gm-teal' };
    const tokens = tokenLines(text);
    expect([...tokens.keys()]).toEqual(Object.keys(names));
    for (const [name, token] of tokens) expect(value(id, names[name]), name).toBe(token);
    const rule = (selector: string) => ruleBody(css, `.ported-style-page--fusion-grain-mono ${selector}`);
    expect(text).toContain('Very faint on the page: ink-coloured specks from fractalNoise at baseFrequency 0.8, tiled at 180px.');
    expect(css).toMatch(/baseFrequency='0\.8'[\s\S]*?\) 0 0 \/ 180px 180px/);
    expect(text).toContain('Strong on the film frames only: grey noise at baseFrequency 1.15, blended with overlay');
    expect(css).toMatch(/baseFrequency='1\.15'/);
    expect(css).toMatch(/mix-blend-mode:\s*overlay|background-blend-mode:\s*overlay/);
    expect(text).toContain('Headline: bold, clamp(2.1rem, 7.6vw, 6rem), line-height 0.98, tracking -0.045em');
    expect(rule('.gm-title')).toMatch(/clamp\(2\.1rem, 7\.6vw, 6rem\)/);
    expect(rule('.gm-title')).toMatch(/letter-spacing:\s*-0\.045em/);
    expect(text).toContain('Section headings: bold, clamp(1.625rem, 3.3vw, 2.375rem), tracking -0.035em, underlined with a 3px ink line');
    expect(rule('.gm-h2')).toMatch(/clamp\(1\.625rem, 3\.3vw, 2\.375rem\)/);
    expect(text).toContain('The running total: bold, 2.5rem, in rust');
    expect(rule('.gm-total b')).toMatch(/2\.5rem/);
    expect(rule('.gm-total b')).toMatch(/color:\s*var\(--gm-rust\)/);
    expect(text).toContain('Tick boxes: 22px squares with a 2px ink border');
    // Rust has one job (the total and the required marks); teal has one job (links and focus).
    const rust = cssRules(css).filter((item) => /var\(--gm-rust\)/.test(item.body) && !/^\s*--/.test(item.body.trim())).flatMap((item) => item.selectors);
    for (const selector of rust) expect(selector, selector).toMatch(/gm-total|gm-req/);
    const teal = cssRules(css).filter((item) => /(?:^|;)\s*(?:color|outline(?:-color)?|text-decoration-color):[^;]*var\(--gm-teal\)/.test(item.body)).flatMap((item) => item.selectors);
    for (const selector of teal) expect(selector, selector).toMatch(/gm-go|focus|\ba\b|:is\(a|gm-bar__nav a/);
    expect(text).toContain('None. The total changes at once. Nothing fades, slides or bounces.');
    expect(css).not.toMatch(/@keyframes|animation:|transition:/);
    expect(css).not.toMatch(/font-style:\s*italic/);
  });

  it('Editorial x Terminal: tokens, the two families and the log levels', async () => {
    const id = 'fusion-editorial-terminal';
    const text = await prompt(id);
    const css = cssOf(id);
    const names: Record<string, string> = { bg: '--fs-bg', surface: '--fs-surface', ink: '--fs-ink', muted: '--fs-muted', line: '--fs-line', amber: '--et-amber', green: '--et-green' };
    const tokens = tokenLines(text);
    expect([...tokens.keys()]).toEqual(Object.keys(names));
    for (const [name, token] of tokens) expect(value(id, names[name]), name).toBe(token);
    const rule = (selector: string) => ruleBody(css, `.ported-style-page--fusion-editorial-terminal ${selector}`);
    expect(text).toContain('Title: Newsreader 400 at optical size 72, clamp(3.5rem, 12.2vw, 9.75rem), line-height 0.9, tracking -0.038em');
    expect(rule('.et-title')).toMatch(/clamp\(3\.5rem, 12\.2vw, 9\.75rem\)/);
    expect(rule('.et-title')).toMatch(/letter-spacing:\s*-0\.038em/);
    expect(text).toContain('Prose: Newsreader 400 at optical size 16, 1.3125rem, line-height 1.52, measure 31em.');
    expect(rule('.et')).toMatch(/font-size:\s*1\.3125rem/);
    expect(rule('.et-prose')).toMatch(/max-width:\s*31em/);
    expect(text).toContain('Mono: 0.8125rem, line-height 1.55, field names in lower case, ligatures off.');
    expect(declarations(css, 'font-size')).toContain('0.8125rem');
    // Amber and green are log levels only: every rule that paints them is a level.
    const levels = cssRules(css).filter((item) => /var\(--et-(?:amber|green)\)/.test(item.body) && !/^\s*--/.test(item.body.trim())).flatMap((item) => item.selectors);
    expect(levels.length).toBeGreaterThan(0);
    for (const selector of levels) expect(selector, selector).toMatch(/et-(?:warn|ok)|is-invalid|et-error/);
    expect(text).toContain('None. The page is still, and hover changes only an underline.');
    expect(css).not.toMatch(/@keyframes|animation:|transition:/);
    // Italic is for authors, the byline and captions.
    const italic = cssRules(css).filter((item) => /font-style:\s*italic/.test(item.body)).flatMap((item) => item.selectors);
    // The note under the contents list is read as its caption.
    for (const selector of italic) expect(selector, selector).toMatch(/et-by|et-who|figcaption|et-credit|et-toc__note/);
  });
});

describe('each page\'s own components', () => {
  it('Neon x Swiss: a departures table of the next eight buses, a picker of six toggles, the line as a list of stops', async () => {
    const html = content(await renderPage('fusion-neon-swiss'));
    const table = html.match(/<table class="ns-departures"[\s\S]*?<\/table>/)?.[0] ?? '';
    expect(table.match(/<th scope="col">/g)?.length).toBe(6);
    const rows = [...table.matchAll(/<tr class="ns-line--(\w+)"><th scope="row" class="ns-no">(N\d)<\/th>[\s\S]*?<time dateTime="(\d\d:\d\d)">/g)];
    expect(rows.length).toBe(8);
    const times = rows.map((row) => row[3]);
    expect([...times].sort()).toEqual(times);
    // One bus leaves now, shown as the solid block; every other row counts minutes.
    expect(table.match(/class="ns-now"/g)?.length).toBe(1);
    const picker = html.match(/<div class="ns-picker" role="group"[\s\S]*?<\/div>/)?.[0] ?? '';
    expect(picker.match(/<button type="button"/g)?.length).toBe(6);
    expect(picker.match(/aria-pressed="true"/g)?.length).toBe(1);
    expect(picker).not.toMatch(/role="(?:tab|radio)"/);
    const strip = html.match(/<ol class="ns-strip[^"]*" role="list" aria-label="[^"]+"[\s\S]*?<\/ol>/)?.[0] ?? '';
    // The default line, N4: Central Square and its nine stops.
    expect(strip.match(/<li class="ns-stop/g)?.length).toBe(10);
    expect(strip.match(/is-end/g)?.length).toBe(1);
    // The timetables are real tables that stay tables on a phone.
    expect(html.match(/<table /g)?.length).toBe(3);
  });

  it('Bento x Noir: the course is one tray holding an ordered list of seven dishes, numbered 1 to 7 in DOM order', async () => {
    const html = content(await renderPage('fusion-bento-noir'));
    const tray = html.match(/<div class="bn-tray"><ol role="list">([\s\S]*?)<\/ol><\/div>/)?.[1] ?? '';
    const dishes = [...tray.matchAll(/<li class="bn-dish bn-dish--(sm|md|lg) bn-dish--(\d)"><span class="bn-dish__no" aria-hidden="true">(\d)<\/span>/g)];
    expect(dishes.map((dish) => [dish[2], dish[3]])).toEqual(['1', '2', '3', '4', '5', '6', '7'].map((n) => [n, n]));
    expect(dishes.filter((dish) => dish[1] === 'lg').length).toBe(1);
    // Every dish has a name, its ingredients and one note.
    expect(tray.match(/<h3>/g)?.length).toBe(7);
    expect(tray.match(/class="bn-dish__of"/g)?.length).toBe(7);
    expect(tray.match(/class="bn-dish__note"/g)?.length).toBe(7);
    // The placement keeps 1 to 7 reading left to right, top to bottom.
    const css = cssOf('fusion-bento-noir');
    const place = (n: number) => ruleBody(css, `.ported-style-page--fusion-bento-noir .bn-dish--${n}`).match(/grid-column:\s*(\d+)[^;]*;\s*grid-row:\s*(\d+)/)?.slice(1).map(Number) ?? [0, 0];
    const order = [1, 2, 3, 4, 5, 6, 7].map((n) => ({ n, column: place(n)[0], row: place(n)[1] }));
    const read = [...order].sort((a, b) => a.row - b.row || a.column - b.column).map((item) => item.n);
    expect(read).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('Bento x Noir: seatings are a radio group with eight described seat marks; the stepper keeps its focus at a limit', async () => {
    const html = content(await renderPage('fusion-bento-noir'));
    const group = html.match(/<div class="bn-seatings" role="radiogroup"[\s\S]*?<\/div>/)?.[0] ?? '';
    const seatings = inputsNamed(group, 'bn-seating');
    expect(seatings.map((input) => `${input.value}${input.checked ? '*' : ''}${input.disabled ? ' disabled' : ''}`)).toEqual(['early disabled', 'late*']);
    const marks = [...group.matchAll(/<span class="bn-marks" role="img" aria-label="([^"]+)">((?:<i[^>]*><\/i>)+)<\/span>/g)];
    expect(marks.length).toBe(2);
    for (const [, label, seats] of marks) {
      expect(seats.match(/<i/g)?.length).toBe(8);
      expect(label).toMatch(/^\d of 8 seats free/);
    }
    // The early seating has one free seat, so it is disabled for the default party of two and says why.
    expect(group).toMatch(/Too few for a party of 2\./);
    // Stepper buttons are never disabled, only aria-disabled, so focus is not lost at 1 or 4.
    const stepper = html.match(/<span class="bn-stepper" role="group"[\s\S]*?<\/button><\/span>/)?.[0] ?? '';
    expect(stepper.match(/<button type="button" aria-label="[^"]+" aria-disabled="(?:true|false)">/g)?.length).toBe(2);
    expect(stepper).not.toMatch(/ disabled=""/);
    expect(stepper).toMatch(/<output>/);
  });

  it('Cyber Console: two-pane windows are labelled regions with text transcripts; tabs and copy controls are wired', async () => {
    const html = content(await renderPage('fusion-cyber-console'));
    const ids = new Set([...html.matchAll(/ id="([^"]+)"/g)].map((match) => match[1]));
    const splits = [...html.matchAll(/<div class="cc-term cc-term--split" role="group" aria-label="[^"]+">/g)];
    expect(splits.length).toBe(2);
    const panes = [...html.matchAll(/<section class="cc-pane[^"]*" aria-labelledby="([^"]+)">/g)];
    // Two machines in the hero, status beside the script, and the config file.
    expect(panes.length).toBe(5);
    for (const [, refs] of panes) for (const ref of refs.split(' ')) expect(ids.has(ref), ref).toBe(true);
    // No window chrome dots, no blinking cursor.
    expect(html).not.toMatch(/dot|blink/);
    const tabs = [...html.matchAll(/<button type="button" role="tab" id="cc-tab-(\w+)" aria-selected="(true|false)" aria-controls="cc-install-panel" tabindex="(-?\d)">/g)];
    expect(tabs.map((tab) => tab[1])).toEqual(['macos', 'linux', 'windows']);
    expect(tabs.filter((tab) => tab[2] === 'true').map((tab) => [tab[1], tab[3]])).toEqual([['macos', '0']]);
    expect(tabs.filter((tab) => tab[2] === 'false').every((tab) => tab[3] === '-1')).toBe(true);
    expect(html).toMatch(/<div class="cc-term" role="tabpanel" id="cc-install-panel" aria-labelledby="cc-tab-macos" tabindex="0">/);
    // Each copy control is named by its word and the command it copies.
    const copies = [...html.matchAll(/<button type="button" class="cc-copy" id="(cc-copy-\w+)" aria-labelledby="([^"]+)">copy<\/button>/g)];
    expect(copies.map((copy) => copy[1])).toEqual(['cc-copy-hero', 'cc-copy-macos']);
    for (const [, id, refs] of copies) expect(refs).toBe(`${id} ${id}-text`);
    for (const [, id] of copies) expect(ids.has(`${id}-text`)).toBe(true);
    expect(html).toMatch(/<p class="cc-sr" role="status"><\/p>/);
    const source = sourceOf('fusion-cyber-console');
    expect(source).toMatch(/const COPY_FEEDBACK_MS = 1600;/);
    expect(source).toMatch(/window\.setTimeout\(\(\) => setCopied\(null\), COPY_FEEDBACK_MS\)/);
    for (const key of ['ArrowRight', 'ArrowLeft', 'Home', 'End']) expect(source).toContain(`event.key === '${key}'`);
  });

  it('Clay Aurora: glaze radios drive one test tile; three filter keys; booking links name their class', async () => {
    const html = content(await renderPage('fusion-clay-aurora'));
    const shelf = html.match(/<fieldset class="ca-shelves"><legend class="ca-sr">Glazes<\/legend>[\s\S]*?<\/fieldset>/)?.[0] ?? '';
    const radios = inputsNamed(shelf, 'ca-glaze');
    expect(radios.map((radio) => radio.value)).toEqual(['seafoam', 'fjord', 'dusk', 'lilac', 'chalk', 'slate']);
    expect(radios.filter((radio) => radio.checked).map((radio) => radio.value)).toEqual(['fjord']);
    // Every glaze has a visible name next to its blob.
    expect(shelf.match(/<i aria-hidden="true"><\/i><b>/g)?.length).toBe(6);
    expect(html).toMatch(/<div class="ca-tile" role="img" aria-label="Test tile glazed in Fjord:[^"]*" style="--ca-g1:#5fb09c;/);
    expect(html).toMatch(/<div aria-live="polite"><h3 class="ca-test__name">Fjord<\/h3>/);
    const keys = html.match(/<div class="ca-levels" role="group" aria-label="Level">([\s\S]*?)<\/div>/)?.[1] ?? '';
    expect([...keys.matchAll(/<button type="button" aria-pressed="(true|false)">(\w+)<\/button>/g)].map((key) => `${key[2]}:${key[1]}`)).toEqual(['All:true', 'Beginner:false', 'Improver:false']);
    const books = [...html.matchAll(/<a href="#ca-book" aria-label="Book (\w+)">Book<\/a>/g)].map((book) => book[1]);
    // Seven classes, Tuesday is full and offers the waiting list instead.
    expect(books).toEqual(['Mondays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays', 'Sundays']);
    expect(html).toMatch(/<span class="ca-waiting">Waiting list<\/span>/);
    expect(html).toMatch(/<p class="ca-sr" role="status">Showing 7 of 7 classes<\/p>/);
    expect(sourceOf('fusion-clay-aurora')).toMatch(/onClick=\{\(\) => setValue\('classId', item\.id\)\}/);
  });

  it('Grain Mono: the stub, the price list, the hero price and the worked sum all read one price table', async () => {
    const html = content(await renderPage('fusion-grain-mono'));
    // The price list as rendered: service row -> [35 mm, 120, single-use] in pence, null when not offered.
    const table = html.match(/<table class="gm-table"[\s\S]*?<\/table>/)?.[0] ?? '';
    const prices = new Map(
      [...table.matchAll(/<tr role="row"[^>]*><th role="rowheader" scope="row">([^<]+)<\/th>((?:<td[^>]*>[^<]*<\/td>){3})<\/tr>/g)].map((row) => [
        decode(row[1]),
        [...row[2].matchAll(/<td[^>]*>([^<]*)<\/td>/g)].map((cell) => (cell[1].startsWith('£') ? Math.round(parseFloat(cell[1].slice(1)) * 100) : null)),
      ]),
    );
    expect(prices.size).toBe(7);
    expect(prices.get('Develop, E-6 slide')?.[2]).toBeNull();
    expect(prices.get('Push or pull one stop')?.[2]).toBeNull();
    // The stub's default order: one roll of 35 mm, C-41, standard scan, return post.
    const stub = html.match(/<dl class="gm-rc">([\s\S]*?)<\/dl>/)?.[1] ?? '';
    const lines = [...stub.matchAll(/<dt>([^<]+)<\/dt><dd>([^<]+)<\/dd>/g)].map((line) => [decode(line[1]), line[2]]);
    const pounds = (pence: number) => (pence / 100).toFixed(2);
    const c41 = prices.get('Develop, C-41 colour')![0]!;
    const scan = prices.get('Scan, standard')![0]!;
    expect(lines).toEqual([
      ['Develop, C-41 colour', pounds(c41)],
      ['Scan, standard', pounds(scan)],
      ['Contact sheet', '0.00'],
      ['Each roll', pounds(c41 + scan)],
      ['Rolls', '× 1'],
      ['Return post, tracked', '3.50'],
    ]);
    const total = c41 + scan + 350;
    expect(html).toMatch(new RegExp(`<p class="gm-total" aria-live="polite" aria-atomic="true"><span>Total so far</span><b>£${pounds(total).replace('.', '\\.')}</b></p>`));
    expect(html).toContain(`Includes VAT at 20%, £${pounds(Math.round((total * 20) / 120))}`);
    // The hero quotes the cheapest roll and the aside works one out, both from the same table.
    const cheapest = Math.min(...[0, 1, 2].map((column) => prices.get('Develop, C-41 colour')![column]! + prices.get('Scan, standard')![column]!));
    expect(html).toContain(`From £${pounds(cheapest)} a roll, developed and scanned.`);
    expect(html).toContain(`£${pounds(c41)} + £${pounds(scan)} + £3.50 = £${pounds(total)}`);
    // The source has one table: the order and the list both index PRICES.
    const source = sourceOf('fusion-grain-mono');
    expect(source.match(/const PRICES: Record<ServiceId, Record<FormatId, number \| null>> = \{/g)?.length).toBe(1);
    expect(source).toMatch(/price: PRICES\[id\]\[order\.format\]/);
    expect(source).toMatch(/const price = PRICES\[id\]\[item\.id\];/);
  });

  it('Grain Mono: tick boxes are native radios and checkboxes; a single-use camera disables what it cannot take', async () => {
    const html = content(await renderPage('fusion-grain-mono'));
    expect([...html.matchAll(/<div class="gm-group" role="(radiogroup|group)" aria-labelledby="(gm-\w+-label)">/g)].map((group) => `${group[1]} ${group[2]}`)).toEqual([
      'radiogroup gm-format-label',
      'radiogroup gm-process-label',
      'radiogroup gm-scan-label',
      'group gm-extras-label',
    ]);
    expect(inputsNamed(html, 'gm-format').map((input) => `${input.value}${input.checked ? '*' : ''}`)).toEqual(['f35*', 'f120', 'single']);
    expect(html.match(/<input type="checkbox"/g)?.length).toBe(2);
    expect(html).toMatch(/<input id="gm-rolls" type="text" inputMode="numeric" role="spinbutton" aria-valuemin="1" aria-valuemax="10" aria-valuenow="1"/);
    const source = sourceOf('fusion-grain-mono');
    expect(source).toMatch(/if \(PRICES\[process\]\[next\] === null\) setProcess\('c41'\);/);
    expect(source).toMatch(/disabled=\{sent \|\| !offered\(id\)\}/);
  });

  it('Editorial x Terminal: contents as an ordered list by page, two links into this page, a log figure, an edition choice with its price', async () => {
    const html = content(await renderPage('fusion-editorial-terminal'));
    const toc = html.match(/<section class="et-toc" aria-labelledby="et-contents">[\s\S]*?<ol>([\s\S]*?)<\/ol>/)?.[1] ?? '';
    const pages = [...toc.matchAll(/<span class="et-pg">(\d+)<\/span>/g)].map((match) => Number(match[1]));
    expect(pages.length).toBe(7);
    expect([...pages].sort((a, b) => a - b)).toEqual(pages);
    const links = [...toc.matchAll(/<a href="#([\w-]+)">/g)].map((match) => match[1]);
    expect(links).toEqual(['et-lead', 'et-second']);
    for (const target of links) expect(html).toMatch(new RegExp(`<article class="[^"]*" id="${target}" aria-labelledby="${target}-title">`));
    const figure = html.match(/<figure class="et-fig et-wide">([\s\S]*?)<\/figure>/)?.[1] ?? '';
    const lines = [...figure.matchAll(/<li( class="et-(warn|ok)")?><span class="et-log__n">(\d+)<\/span><span>[\d:.]+<\/span><span>(\w+)<\/span>/g)];
    expect(lines.length).toBe(9);
    // The colour of a level never comes alone: the level word is in the line.
    for (const line of lines) if (line[2]) expect(line[4]).toBe(line[2]);
    expect(lines.filter((line) => line[2] === 'warn').map((line) => line[3])).toEqual(['5']);
    expect(figure).toMatch(/<figcaption>/);
    // The prose refers to that line of the figure.
    expect(html).toMatch(/Line 5 is the only place where the job says that something went wrong/);
    const editions = inputsNamed(html, 'et-edition');
    expect(editions.map((edition) => `${edition.id}${edition.checked ? '*' : ''}`)).toEqual(['et-edition-print*', 'et-edition-digital']);
    expect(html).toMatch(/<output class="et-price" for="et-edition-print et-edition-digital">\$84 a year<\/output>/);
    expect(html).toMatch(/<label class="et-label" for="et-email">Email address<\/label>/);
  });
});

describe('forms: errors, confirmations and focus', () => {
  const FORMS: Array<{ id: PageId; done: string; doneSelector: string }> = [
    { id: 'fusion-bento-noir', done: 'className="bn-done" ref={doneRef} tabIndex={-1}', doneSelector: '.bn-done' },
    { id: 'fusion-clay-aurora', done: 'className="ca-booked" ref={doneRef} tabIndex={-1}', doneSelector: '.ca-booked' },
    { id: 'fusion-grain-mono', done: 'className="gm-done" ref={doneRef} tabIndex={-1}', doneSelector: '.gm-done' },
    { id: 'fusion-editorial-terminal', done: 'className="et-done" ref={doneRef} tabIndex={-1}', doneSelector: '.et-done' },
  ];

  for (const { id, done } of FORMS) {
    it(`${id}: the confirmation that replaces the form takes focus from an effect, not from an animation`, () => {
      const source = sourceOf(id);
      expect(source).toContain(done);
      expect(source).toMatch(/doneRef\.current\?\.focus\(\)/);
      expect(source).not.toMatch(/onAnimationEnd|animationend|onTransitionEnd|transitionend/);
      // Errors are announced and tied to their field.
      expect(source).toMatch(/role="alert"/);
      expect(source).toMatch(/aria-invalid['=]/);
      expect(source).toMatch(/aria-describedby['=]/);
    });
  }

  it('no page waits for the end of an animation', () => {
    for (const id of IDS) expect(sourceOf(id), id).not.toMatch(/onAnimationEnd|animationend|onTransitionEnd|transitionend/);
  });

  // Focus scrolls a confirmation to the top edge when it is taller than the space left.
  // Bento and Editorial give theirs a scroll margin, so it stops below the fixed back link.
  for (const { id, doneSelector } of FORMS.filter((form) => form.id === 'fusion-bento-noir' || form.id === 'fusion-editorial-terminal')) {
    it(`${id}: the focused confirmation stops below the fixed back link`, () => {
      const body = ruleBody(cssOf(id), `.ported-style-page--${id} ${doneSelector}`);
      const margin = body.match(/scroll-margin(?:-top)?:\s*([\d.]+)(px|rem)/);
      expect(margin).not.toBeNull();
      expect(Number(margin![1]) * (margin![2] === 'rem' ? 16 : 1)).toBeGreaterThanOrEqual(64);
    });
  }

  // Found in review: Clay's .ca-booked and Grain's .gm-done had no scroll margin, so at 320px
  // (Clay) and 375px (Grain) a keyboard submit left the confirmation's first line under the
  // fixed "Hub" link. Both now carry a margin of 64px or more.
  for (const { id, doneSelector } of FORMS.filter((form) => form.id === 'fusion-clay-aurora' || form.id === 'fusion-grain-mono')) {
    it(`${id}: the focused confirmation stops below the fixed back link`, () => {
      const body = ruleBody(cssOf(id), `.ported-style-page--${id} ${doneSelector}`);
      const margin = body.match(/scroll-margin(?:-top)?:\s*([\d.]+)(px|rem)/);
      expect(margin).not.toBeNull();
      expect(Number(margin![1]) * (margin![2] === 'rem' ? 16 : 1)).toBeGreaterThanOrEqual(64);
    });
  }
});

describe('home cards of the six styles', () => {
  // Under the site rule set D a home card shows a screenshot of the page and sets the
  // name in the shell face, so the home page loads no card title faces.
  it('set the name in the shell face, without a title rule of their own', () => {
    const rules = cssRules(read('src/styles.css'));
    for (const id of IDS) expect(rules.filter((rule) => rule.selectors.some((selector) => selector.includes(`.style-card--${id}`))), id).toEqual([]);
    expect(read('src/components/StyleCard.tsx')).not.toMatch(/style-card--/);
  });
});

describe('the page rules stay on their own page', () => {
  for (const id of IDS) {
    it(`${id}: every selector is scoped to the page`, () => {
      const scope = new RegExp(`^(?:\\.ported-style-page(?:\\.fusion-page)?)?\\.ported-style-page--${id}(?![\\w-])|^\\.ported-style-page\\.fusion-page\\.ported-style-page--${id}(?![\\w-])|^(?:html|body):has\\(\\.ported-style-page--${id}\\)$`);
      const selectors = cssRules(cssOf(id)).flatMap((rule) => rule.selectors).filter((selector) => !isKeyframeStep(selector));
      expect(selectors.length).toBeGreaterThan(100);
      expect(selectors.filter((selector) => !scope.test(selector))).toEqual([]);
    });
  }

  it('the shared stylesheets hold no rule for the six pages, and their old keyframes are gone', () => {
    const shared = read('src/ported/fusionPages.css') + read('src/ported/portedStylePages.css') + read('src/ported/fusionShell.css');
    for (const id of IDS) expect(shared, id).not.toContain(`.ported-style-page--${id}`);
    for (const name of ['ns-marquee', 'bn-marquee', 'et-sweep', 'et-pulse', 'et-blink', 'et-marquee', 'cc-pulse', 'cc-marquee', 'cc-blink', 'gm-marquee', 'ca-breathe', 'ca-marquee']) {
      expect(shared, name).not.toMatch(new RegExp(`@keyframes ${name}\\b`));
    }
  });

  it('the one keyframe of the six carries its page prefix and exists nowhere else', () => {
    const names = IDS.flatMap((id) => [...cssOf(id).matchAll(/@keyframes ([\w-]+)/g)].map((match) => `${id} ${match[1]}`));
    expect(names).toEqual(['fusion-clay-aurora ca-set-down']);
    const shared = read('src/ported/fusionPages.css') + read('src/ported/portedStylePages.css') + read('src/styles.css');
    expect(shared).not.toMatch(/@keyframes ca-set-down\b/);
  });
});

describe('metadata and pinned data follow the pages', () => {
  const recipe = (id: PageId) => (recipes as Array<Record<string, unknown>>).find((item) => item.id === id)!;

  for (const id of IDS) {
    it(`${id}: the recipe names the page's stacks, source file and an unrounded corner only where the page has one`, () => {
      const entry = recipe(id);
      expect(entry.displayFont).toBe(declarations(cssOf(id), '--fs-display')[0]);
      expect(entry.bodyFont).toBe(declarations(cssOf(id), '--fs-body')[0]);
      expect(entry.monoFont ?? null).toBe(declarations(cssOf(id), '--fs-mono')[0] ?? null);
      expect((entry.source as { file: string }).file).toBe(`src/ported/pages/${PAGES[id].file}.css`);
      expect(entry.canvas).toBe(declarations(cssOf(id), '--fs-bg')[0]);
      expect(entry.text).toBe(declarations(cssOf(id), '--fs-ink')[0]);
      expect(compact(String(entry.border))).toBe(compact(declarations(cssOf(id), '--fs-line')[0]));
      const radius = { 'fusion-bento-noir': 5, 'fusion-clay-aurora': 22 }[id as string] ?? 0;
      expect(entry.radiusPx).toBe(radius);
    });
  }

  it('the all-JS budget re-base keeps a second copy of the largest chunk over the cap', () => {
    const budgets = JSON.parse(read('docs/quality-budgets.json')) as { budgets?: Array<{ metric: string; max: number; reason: string }> } | Array<{ metric: string; max: number; reason: string }>;
    const list = Array.isArray(budgets) ? budgets : (budgets.budgets ?? Object.values(budgets).find(Array.isArray) as Array<{ metric: string; max: number; reason: string }>);
    const allJs = list.find((item) => item.metric === 'allJSGzipBytes')!;
    const pin = JSON.parse(read('docs/quality-baseline-2026-10-12.json')) as { comparable: { staticAssets: { metrics: Record<string, number> } } };
    const metrics = pin.comparable.staticAssets.metrics;
    expect(metrics.allJSGzipBytes).toBeLessThan(allJs.max);
    // The reason's own test: measured total plus a copy of the entry chunk exceeds the cap,
    // so the cap still catches a duplicated large module after each reviewed re-base.
    expect(metrics.allJSGzipBytes + metrics.entryJsGzipBytes).toBeGreaterThan(allJs.max);
    // Batch 4: the entry's ceiling is read from its own budget instead of a copied literal.
    expect(metrics.entryJsGzipBytes).toBeLessThanOrEqual(list.find((item) => item.metric === 'entryJsGzipBytes')!.max);
  });

  it('the editorial light alternate and its known-defect record are gone together', () => {
    expect(read('src/visual/contracts.ts')).not.toMatch(/fusion-editorial-terminal/);
    expect(read('scripts/quality-baseline.mts')).not.toMatch(/fusion-editorial-terminal-light-mode-withheld/);
    expect(recipe('fusion-editorial-terminal').alternativeModes ?? null).toBeNull();
    expect(recipe('fusion-grain-mono').defaultMode).toBe('light');
  });
});
