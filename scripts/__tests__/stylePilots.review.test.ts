// Reviewer tests for the style-pilot change: four shared defects (literal
// asterisks, Korean line breaks, boxed prev/next labels, top strip overlap) and
// three rebuilt pages (Runtime Signal, Holographic Fluid, Holo x Glass).
// Markup is checked with renderToStaticMarkup, CSS by reading the source.
// Layout, overlap, line breaking and the timer were checked in a browser, not here.
// The blocks named "round two" re-check what the first review reported and add
// the defects found in the second review; the link handler has its own file,
// stylePilots.links.review.test.ts.
// Round five gave the three pages new typefaces and components. Five tests that
// asserted the old markup were rewritten here with their intent kept (each is
// marked "Rewritten in round five"); the tests for the new design decisions are
// in stylePilots.type.review.test.ts.
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createElement, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { styleById, styleCatalog, type Lang, type StyleData } from '../../src/data/styles';

const LANGS: Lang[] = ['en', 'ko', 'ja'];
const PILOTS = ['runtime-signal', 'holographic-fluid', 'fusion-holo-glass'] as const;
const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');

const registrySource = read('src/ported/registry.ts');
const registry = new Map(
  [...registrySource.matchAll(/^ {2}'([a-z0-9-]+)':\s+\{ path: '\.\/pages\/(\w+)\.tsx',\s+exportName: '(\w+)' \}/gm)].map((match) => [
    match[1],
    { file: match[2], exportName: match[3] },
  ]),
);

type PageProps = { style: StyleData; lang: Lang };

async function renderPage(id: string, lang: Lang): Promise<string> {
  const entry = registry.get(id);
  if (!entry) throw new Error(`No ported page registered for ${id}`);
  const module = (await import(`../../src/ported/pages/${entry.file}.tsx`)) as Record<string, ComponentType<PageProps>>;
  const style = styleById.get(id);
  if (!style) throw new Error(`No style data for ${id}`);
  return renderToStaticMarkup(createElement(module[entry.exportName], { style, lang }));
}

const decode = (text: string) =>
  text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'");

/** Rendered copy with prompt and code blocks removed. */
function visibleText(html: string): string {
  return decode(
    html
      .replace(/<(pre|code|script|style|textarea|kbd|samp)\b[\s\S]*?<\/\1>/g, ' ')
      .replace(/<[^>]+>/g, '\n'),
  );
}

function headings(html: string): string[] {
  const body = html.replace(/<pre\b[\s\S]*?<\/pre>/g, '');
  return [...body.matchAll(/<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/g)].map((match) => decode(match[2].replace(/<[^>]+>/g, '')).trim());
}

const HANGUL = /[가-힣]/;
const KANA = /[぀-ヿ]/;
const CJK = /[぀-ヿ一-鿿]/;

describe('registry', () => {
  it('reads all 48 ported pages and every style has one', () => {
    expect(registry.size).toBe(48);
    expect(styleCatalog.map((style) => style.id).filter((id) => !registry.has(id))).toEqual([]);
    expect(readdirSync(resolve(process.cwd(), 'src/ported/pages')).filter((name) => /^Ported.*Page\.tsx$/.test(name)).length).toBe(registry.size);
  });
});

describe('defect 1: no literal *emphasis* markers in rendered copy', () => {
  for (const id of registry.keys()) {
    it(`${id} renders no *word* in en, ko or ja`, async () => {
      const found: string[] = [];
      for (const lang of LANGS) {
        const text = visibleText(await renderPage(id, lang));
        for (const match of text.matchAll(/\*[^\s*][^*\n]*\*/g)) found.push(`${lang}: ${match[0].slice(0, 60)}`);
        // An unpaired marker next to a CJK letter is also a leaked marker.
        for (const match of text.matchAll(/[가-힣぀-ヿ一-鿿]\*|\*[가-힣぀-ヿ一-鿿]/g)) found.push(`${lang}: ${match[0]}`);
      }
      expect(found).toEqual([]);
    });
  }
});

describe('defect 2: Korean and Japanese line-break rules can match', () => {
  const hook = read('src/ported/usePortedPageEffects.ts');
  const css = read('src/ported/portedStylePages.css');

  it('the shared hook puts the language on the page root', () => {
    expect(hook).toMatch(/root\.lang = lang/);
  });

  it.each(['editorial-silence', 'platform-core'])('%s keeps Korean headline words whole once the root has lang', (id) => {
    const rule = new RegExp(`\\.ported-style-page--${id}\\[lang="ko"\\][^{]*h1[^{]*\\{[^}]*word-break:\\s*keep-all`);
    expect(css).toMatch(rule);
  });
});

describe('defect 3: prev/next labels are not boxed by the global page-nav rule', () => {
  const styles = read('src/styles.css').replace(/\/\*[\s\S]*?\*\//g, '');
  const rules = [...styles.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((match) => ({ selectors: match[1].split(',').map((s) => s.trim()), body: match[2] }));
  const boxes = (body: string) => /\b(border|background|padding|min-height)\b\s*:/.test(body);
  // A selector that reaches a span nested inside a nav link, such as the label.
  const hitsNestedSpan = (selector: string) => /\.page-nav\s+span$/.test(selector) || /\.page-nav\s+a\s+span$/.test(selector);

  // `.style-experience .page-nav span` still tints nested spans, but no style reaches that
  // fallback renderer: the registry test above shows every style has a ported page.
  it('no rule that applies to ported pages draws a box on every span inside .page-nav', () => {
    const offenders = rules
      .filter((rule) => boxes(rule.body) && rule.selectors.some((selector) => hitsNestedSpan(selector) && !selector.startsWith('.style-experience ')))
      .map((rule) => rule.selectors.join(', '));
    expect(offenders).toEqual([]);
  });

  it('the link and the empty placeholder still get the box', () => {
    const rule = rules.find((item) => item.selectors.includes('.page-nav > a'));
    expect(rule?.selectors).toContain('.page-nav > span:not([class])');
    expect(rule?.body).toMatch(/flex-direction:\s*column/);
  });
});

describe('defect 4: the top strip leaves the left corner to the back button', () => {
  it('.workspace-entry aligns its content to the right', () => {
    const css = read('src/components/workspace-status.css');
    const rule = css.match(/\.workspace-entry\s*\{([^}]*)\}/)?.[1] ?? '';
    expect(rule).toMatch(/justify-content:\s*flex-end/);
  });
});

describe('the three rebuilt pages', () => {
  const pageCss: Record<(typeof PILOTS)[number], string> = {
    'runtime-signal': read('src/ported/portedStylePages.css') + read('src/ported/stylePrompt.css'),
    'holographic-fluid': read('src/ported/pages/PortedHolographicFluidPage.css') + read('src/ported/fusionShell.css'),
    'fusion-holo-glass': read('src/ported/pages/PortedFusionHoloGlassPage.css') + read('src/ported/fusionShell.css'),
  };

  for (const id of PILOTS) {
    describe(id, () => {
      it('renders in all three languages with different copy', async () => {
        const [en, ko, ja] = await Promise.all(LANGS.map((lang) => renderPage(id, lang)));
        expect(new Set([en, ko, ja]).size).toBe(3);
        expect(headings(en).length).toBeGreaterThan(3);
        expect(headings(ko).length).toBe(headings(en).length);
        expect(headings(ja).length).toBe(headings(en).length);
      });

      it('has an h1 and no heading left in the wrong language', async () => {
        const allowed = /^(Runtime Signal|Starter|Team|Enterprise|Pane|HAEPA)$/;
        for (const lang of LANGS) {
          const html = await renderPage(id, lang);
          expect(html.match(/<h1\b/g)?.length).toBe(1);
          for (const heading of headings(html)) {
            if (allowed.test(heading)) continue;
            if (lang === 'en') expect(heading, `${lang}: ${heading}`).not.toMatch(CJK);
            if (lang === 'en') expect(heading, `${lang}: ${heading}`).not.toMatch(HANGUL);
            if (lang === 'ko') expect(heading, `${lang}: ${heading}`).toMatch(HANGUL);
            if (lang === 'ko') expect(heading, `${lang}: ${heading}`).not.toMatch(KANA);
            if (lang === 'ja') expect(heading, `${lang}: ${heading}`).toMatch(CJK);
            if (lang === 'ja') expect(heading, `${lang}: ${heading}`).not.toMatch(HANGUL);
          }
        }
      });

      it('Korean copy has no Japanese and Japanese copy has no Korean', async () => {
        const strip = (html: string) => visibleText(html.replace(/<ul class="lang-menu"[\s\S]*?<\/ul>/g, ''));
        expect(strip(await renderPage(id, 'ko'))).not.toMatch(KANA);
        expect(strip(await renderPage(id, 'ja'))).not.toMatch(HANGUL);
        expect(strip(await renderPage(id, 'en'))).not.toMatch(/[가-힣぀-ヿ一-鿿]/);
      });

      it('every in-page link and aria reference points at an element that exists', async () => {
        for (const lang of LANGS) {
          const html = await renderPage(id, lang);
          const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]));
          const targets = [
            ...[...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]),
            ...[...html.matchAll(/aria-(?:labelledby|describedby|controls)="([^"]+)"/g)].flatMap((match) => match[1].split(/\s+/)),
            ...[...html.matchAll(/\sfor="([^"]+)"/g)].map((match) => match[1]),
          ];
          expect(targets.length).toBeGreaterThan(0);
          expect(targets.filter((target) => !ids.has(target))).toEqual([]);
          const all = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
          expect(all.filter((value, index) => all.indexOf(value) !== index)).toEqual([]);
        }
      });

      it('uses no class that its stylesheets do not style', async () => {
        const html = await renderPage(id, 'ko');
        const classes = new Set([...html.matchAll(/class="([^"]+)"/g)].flatMap((match) => match[1].split(/\s+/)).filter(Boolean));
        // Layout wrappers and default-state modifiers that need no rule of their own.
        const ignore = new Set([
          'ported-style-page', `ported-style-page--${id}`, 'fusion-page', 'fusion-page--dark', 'prompt', 'fusion-shell__prompt-heading-text',
          'hf-hero__copy', 'hf-sessions__state--open', 'hg-hero__copy', 'hg-rows__state--done',
        ]);
        const missing = [...classes].filter((name) => !ignore.has(name) && !new RegExp(`\\.${name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}(?![\\w-])`).test(pageCss[id]));
        expect(missing).toEqual([]);
      });

      it('explains the style only in the prompt panel, which is closed by default', async () => {
        for (const lang of LANGS) {
          const html = await renderPage(id, lang);
          const details = html.match(/<details class="(?:style-prompt|prompt fusion-shell__prompt)"[^>]*>/)?.[0];
          expect(details).toBeDefined();
          expect(details).not.toMatch(/\sopen\b/);
          const body = visibleText(html.replace(/<details\b[\s\S]*?<\/details>/g, ''));
          // Words that describe the page's own style instead of its subject.
          expect(body).not.toMatch(/STYLE DNA|COLOR TOKENS|color palette|컬러 팔레트|타이포그래피|글래스모피즘|glassmorphism|backdrop-filter|--[a-z]+-[a-z0-9]+:/i);
        }
      });

      it('keeps the copy rules: no "X가 아니라 Y", no dash chains, no label numbering outside sequences', async () => {
        const ko = visibleText((await renderPage(id, 'ko')).replace(/<details\b[\s\S]*?<\/details>/g, ''));
        expect(ko).not.toMatch(/(?:이|가) 아니라|이 아닌|가 아닌/);
        for (const lang of LANGS) {
          const text = visibleText((await renderPage(id, lang)).replace(/<details\b[\s\S]*?<\/details>/g, ''));
          const lines = text.split('\n').filter((line) => (line.match(/—/g) ?? []).length >= 2);
          expect(lines).toEqual([]);
        }
      });

      it('draws no figurative SVG: only small stroke icons', async () => {
        const html = await renderPage(id, 'en');
        for (const svg of html.match(/<svg\b[\s\S]*?<\/svg>/g) ?? []) {
          expect(svg).toMatch(/viewBox="0 0 (16|24) (16|24)"/);
          expect((svg.match(/<(path|circle|line|polyline|rect|ellipse|polygon)\b/g) ?? []).length).toBeLessThanOrEqual(3);
        }
      });
    });
  }

  it('Holographic Fluid and Holo x Glass do not share a section skeleton', async () => {
    const skeleton = (html: string) =>
      [...html.replace(/<details\b[\s\S]*?<\/details>/g, '').matchAll(/<(section|ol|ul|dl|form|table|fieldset|article)\b/g)].map((match) => match[1]).join(' ');
    const [fluid, glass, signal] = await Promise.all(PILOTS.map((id) => renderPage(id, 'en'))).then(([a, b, c]) => [skeleton(b), skeleton(c), skeleton(a)]);
    expect(fluid).not.toBe(glass);
    expect(signal).not.toBe(fluid);
    expect(signal).not.toBe(glass);
  });

  it('no stylesheet still targets classes of the removed Holographic Fluid and Holo x Glass pages', () => {
    const shared = read('src/ported/portedStylePages.css') + read('src/ported/fusionPages.css');
    expect(shared).not.toMatch(/\.ported-style-page--holographic-fluid/);
    expect(shared).not.toMatch(/\.ported-style-page--fusion-holo-glass/);
  });

  // Rewritten in round five for the new markup. The intent is unchanged: a number that looks
  // like an index appears only where the content is a real sequence, and that sequence is an
  // ordered list. The sequences are now the three timed steps and the five events of the
  // deploy trace (Runtime Signal), the two sides of the record with their real track numbers
  // (Holographic Fluid) and the eight blocks of one timer cycle (Holo x Glass).
  it('numbers appear only on real sequences: steps, trace events, tracks and cycle blocks are ordered lists', async () => {
    const page = (html: string) => html.replace(/<details\b[\s\S]*?<\/details>/g, '');

    const signal = page(await renderPage('runtime-signal', 'en'));
    const steps = signal.match(/<ol class="steps">([\s\S]*?)<\/ol>/)?.[1] ?? '';
    expect(steps.match(/<li>/g)?.length).toBe(3);
    // Each step is led by its time on the ruler, not by a step number.
    expect(steps.match(/<li><p class="steps__time">\d:\d\d/g)?.length).toBe(3);
    const trace = signal.match(/<ol class="trace__list">([\s\S]*?)<\/ol>/)?.[1] ?? '';
    expect(trace.match(/<li class="trace__row[^"]*"><time /g)?.length).toBe(5);
    expect(signal.match(/<ol\b/g)?.length).toBe(2);

    // The track list follows the record: Side A and Side B, each an ordered list named by its heading.
    const fluid = page(await renderPage('holographic-fluid', 'en'));
    const sides = [...fluid.matchAll(/<h3 id="(hf-side-[ab])" class="hf-rule">([^<]+)<\/h3><ol aria-labelledby="\1">([\s\S]*?)<\/ol>/g)];
    expect(sides.map((side) => side[2])).toEqual(['Side A', 'Side B']);
    expect(sides.map((side) => [...side[3].matchAll(/<li class="hf-track"><span class="hf-track__num">([^<]+)<\/span>/g)].map((match) => match[1]))).toEqual([
      ['A1', 'A2', 'A3', 'A4'],
      ['B1', 'B2', 'B3', 'B4'],
    ]);
    expect(fluid.match(/<ol\b/g)?.length).toBe(2);
    expect(fluid).not.toMatch(/class="hf-tracks"/);

    const glass = page(await renderPage('fusion-holo-glass', 'en'));
    const cycle = glass.match(/<ol class="hg-cycle"[^>]*>([\s\S]*?)<\/ol>/)?.[1] ?? '';
    expect(cycle.match(/<li\b/g)?.length).toBe(8);
    expect(glass.match(/<ol\b/g)?.length).toBe(1);

    for (const html of [signal, fluid, glass]) {
      const outside = html.replace(/<ol\b[\s\S]*?<\/ol>/g, '');
      // An index standing alone in an element: 01, 02, or 1. and 2) in the manner of a numbered label.
      expect(outside.match(/>(?:0[1-9]|[1-9][.)])</g) ?? []).toEqual([]);
    }
  });
});

// ---------------------------------------------------------------------------
// Round two
// ---------------------------------------------------------------------------

interface CssRule {
  selectors: string[];
  body: string;
  index: number;
}

/** Innermost style rules of a stylesheet, in source order. At-rule wrappers are dropped. */
function cssRules(css: string): CssRule[] {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
  return [...clean.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((match, index) => ({
    selectors: match[1].split(',').map((selector) => selector.trim().replace(/\s+/g, ' ')),
    body: match[2],
    index,
  }));
}

/** The word-break value a rule ends up with (a later declaration replaces an earlier one). */
const wordBreak = (body: string) => [...body.matchAll(/word-break:\s*([a-z-]+)/g)].at(-1)?.[1];

const portedCss = read('src/ported/portedStylePages.css');
/** The Runtime Signal rules of the shared stylesheet: from its marker comment to the next style's.
 *  Section markers are line-start comments naming a style id (`/* id *\/` or `/* id — …`); other
 *  styles' sections leave the file as their pages are rebuilt, so the end is found, not named. */
const runtimeBlock = (css: string) => {
  const start = css.indexOf('/* runtime-signal */');
  const others = styleCatalog.map((style) => style.id).filter((id) => id !== 'runtime-signal').join('|');
  const next = new RegExp(`\\n/\\* (?:${others})(?: \\*/| —)`).exec(css.slice(start));
  return css.slice(start, next ? start + next.index : css.length);
};
const fusionCss = read('src/ported/fusionPages.css');
const fusionShellCss = read('src/ported/fusionShell.css');
const fluidCss = read('src/ported/pages/PortedHolographicFluidPage.css');
const glassCss = read('src/ported/pages/PortedFusionHoloGlassPage.css');

describe('round two, item 1: Japanese text is free to wrap', () => {
  const targetsJapanese = (selector: string) => /\[lang="?ja"?\]|:lang\(ja\)/.test(selector) && !/ body$/.test(selector);

  it('no rule outside Editorial Silence forces keep-all on Japanese', () => {
    const forced = [...cssRules(portedCss), ...cssRules(fusionCss), ...cssRules(fluidCss), ...cssRules(glassCss), ...cssRules(read('src/ported/stylePrompt.css'))]
      .filter((rule) => wordBreak(rule.body) === 'keep-all')
      .flatMap((rule) => rule.selectors.filter(targetsJapanese))
      .filter((selector) => !selector.includes('ported-style-page--editorial-silence'));
    expect(forced).toEqual([]);
  });

  it('Editorial Silence releases its Japanese keep-all rules in a later rule of equal or higher weight', () => {
    const rules = cssRules(portedCss).filter((rule) => rule.selectors.some((selector) => selector.includes('ported-style-page--editorial-silence') && targetsJapanese(selector)));
    const keepAll = rules.filter((rule) => wordBreak(rule.body) === 'keep-all');
    const release = rules.filter((rule) => wordBreak(rule.body) !== 'keep-all' && /word-break:/.test(rule.body) && rule.selectors.some((selector) => selector.includes(':is(')));
    expect(keepAll.length).toBeGreaterThan(0);
    expect(release.length).toBe(1);
    expect(release[0].index).toBeGreaterThan(Math.max(...keepAll.map((rule) => rule.index)));
    // Every element the earlier rules name is named again in the release rule.
    const named = keepAll.flatMap((rule) => rule.selectors.filter(targetsJapanese).map((selector) => selector.split(' ').at(-1) ?? ''));
    for (const name of named) expect(release[0].selectors.join(' ')).toContain(name);
  });

  it.each(['platform-core', 'paper-cut', 'runtime-signal'])('%s has a Japanese rule that does not use keep-all', (id) => {
    const rules = cssRules(portedCss).filter((rule) => rule.selectors.some((selector) => selector.includes(`ported-style-page--${id}`) && targetsJapanese(selector)) && /word-break:/.test(rule.body));
    expect(rules.length).toBeGreaterThan(0);
    for (const rule of rules) expect(wordBreak(rule.body)).not.toBe('keep-all');
  });
});

describe('round two, item 4: the top strip stays clear of the back button on narrow screens', () => {
  it('.workspace-entry reserves the left corner with padding at every width', () => {
    const rule = read('src/components/workspace-status.css').match(/\.workspace-entry\s*\{([^}]*)\}/)?.[1] ?? '';
    const padding = rule.match(/padding:\s*([^;]+);/)?.[1].trim().split(/\s+/) ?? [];
    expect(padding.length).toBe(4);
    // Widest back button measured in a browser: 144px from the left edge (Korean, desktop).
    expect(parseFloat(padding[3])).toBeGreaterThanOrEqual(150);
    expect(rule).toMatch(/flex-wrap:\s*wrap/);
  });
});

describe('round two, item 5: Runtime Signal', () => {
  it('has no hero note in the markup or the stylesheet', async () => {
    for (const lang of LANGS) expect(await renderPage('runtime-signal', lang)).not.toMatch(/hero__note|note-highlight/);
    expect(portedCss).not.toMatch(/\.ported-style-page--runtime-signal \.(hero__note|note-highlight)\b/);
  });

  it('search is an editable, labelled field', async () => {
    const html = await renderPage('runtime-signal', 'en');
    const input = html.match(/<input\b[^>]*type="search"[^>]*>/)?.[0] ?? '';
    expect(input).not.toBe('');
    expect(input).not.toMatch(/readonly|disabled/i);
    expect(input).toMatch(/aria-label="Search services"/);
  });

  // Rewritten in round five: the segmented control became three text buttons. The intent is
  // unchanged: a named group of toggle buttons, exactly one pressed, with the pressed state
  // drawn from aria-pressed and not from a class.
  it('the status filter is a group of toggle buttons with exactly one pressed', async () => {
    for (const lang of LANGS) {
      const html = await renderPage('runtime-signal', lang);
      const group = html.match(/<div class="status-filter"[^>]*>([\s\S]*?)<\/div>/);
      expect(group?.[0] ?? '').toMatch(/^<div class="status-filter" role="group" aria-label="[^"]+">/);
      if (lang === 'en') expect(group?.[0]).toMatch(/aria-label="Status filter"/);
      const buttons = group?.[1].match(/<button\b[^>]*>/g) ?? [];
      expect(buttons.length).toBe(3);
      for (const button of buttons) expect(button).toMatch(/type="button"/);
      expect(buttons.filter((button) => /aria-pressed="true"/.test(button)).length).toBe(1);
      expect(buttons.filter((button) => /aria-pressed="false"/.test(button)).length).toBe(2);
      // The first button, All, is the one pressed when the page opens.
      expect(buttons[0]).toMatch(/aria-pressed="true"/);
    }
    const rules = cssRules(portedCss);
    const pressed = rules.find((rule) => rule.selectors.includes('.ported-style-page--runtime-signal .status-filter button[aria-pressed="true"]'));
    // The selected filter is marked by the colour of its 2px underline, not by a filled shape.
    expect(pressed?.body).toMatch(/border-bottom-color:\s*var\(--accent\)/);
    expect(pressed?.body).not.toMatch(/background|border-radius/);
    const base = rules.find((rule) => rule.selectors.includes('.ported-style-page--runtime-signal .status-filter button'));
    expect(base?.body).toMatch(/border-bottom:\s*2px solid transparent/);
    expect(base?.body).toMatch(/border-radius:\s*0\b/);
    expect(base?.body).toMatch(/height:\s*44px/);
    expect(portedCss).not.toMatch(/--runtime-signal \.status-filter button\.is-active/);
    expect(portedCss).not.toMatch(/--runtime-signal \.segmented/);
  });

  it('the service detail is a tab list of buttons that controls one labelled panel', async () => {
    const html = await renderPage('runtime-signal', 'en');
    const tabs = html.match(/<button\b[^>]*role="tab"[^>]*>/g) ?? [];
    expect(tabs.length).toBe(4);
    expect(html).not.toMatch(/<a\b[^>]*role="tab"/);
    const selected = tabs.filter((tab) => /aria-selected="true"/.test(tab));
    expect(selected.length).toBe(1);
    expect(selected[0]).toMatch(/tabindex="0"/);
    for (const tab of tabs.filter((item) => !selected.includes(item))) expect(tab).toMatch(/tabindex="-1"/);
    for (const tab of tabs) expect(tab).toMatch(/aria-controls="rs-detail-panel"/);
    const panel = html.match(/<div\b[^>]*role="tabpanel"[^>]*>/)?.[0] ?? '';
    expect(panel).toMatch(/id="rs-detail-panel"/);
    expect(panel).toMatch(new RegExp(`aria-labelledby="${selected[0].match(/id="([^"]+)"/)?.[1]}"`));
    expect(html).toMatch(/<div class="line-tabs" role="tablist"/);
  });

  // Rewritten in round five for the new layout. The intent is unchanged: every layout sentence
  // of the English prompt is checked against the markup or the stylesheet it describes.
  it('the prompt describes the layout the page has', async () => {
    const html = await renderPage('runtime-signal', 'en');
    const prompt = decode(html.match(/<details class="style-prompt"[\s\S]*?<pre>([\s\S]*?)<\/pre>/)?.[1] ?? '');
    const body = html.replace(/<details\b[\s\S]*?<\/details>/g, '');
    expect(prompt.length).toBeGreaterThan(3000);
    expect(prompt).not.toMatch(/centered second section headline|2x2 feature grid|row of three|three steps stacked in one column/i);
    const rules = cssRules(runtimeBlock(portedCss));
    const rule = (selector: string) => rules.find((item) => item.selectors.includes(`.ported-style-page--runtime-signal ${selector}`))?.body ?? '';
    const phoneBlocks = (width: number) => [...runtimeBlock(portedCss).matchAll(new RegExp(`@media \\(max-width: ${width}px\\) \\{([\\s\\S]*?)\\n\\}`, 'g'))].map((match) => match[1]).join('\n');

    // Hero: copy on the left six columns with one outline button, the deploy trace on the right six.
    expect(prompt).toMatch(/hero: headline, one paragraph and one outline button on the left six columns, the deploy trace on the right six/);
    expect(rule('.rs-hero__copy')).toMatch(/grid-column:\s*1 \/ span 6/);
    expect(rule('.trace')).toMatch(/grid-column:\s*7 \/ span 6/);
    const heroCopy = body.match(/<div class="rs-hero__copy">([\s\S]*?)<\/div>/)?.[1] ?? '';
    expect(heroCopy.match(/<a class="nav-button"/g)?.length).toBe(1);
    expect(heroCopy).not.toMatch(/nav-button--solid/);
    expect(heroCopy.match(/<p\b/g)?.length).toBe(1);

    // Section headlines are left-aligned with an intro under them.
    expect(prompt).toMatch(/left-aligned section headlines, each with a short intro under it/);
    expect(runtimeBlock(portedCss)).not.toMatch(/text-align:\s*center/);
    expect(body.match(/<h2[^>]*>[^<]+<\/h2><p class="rs-section__intro">/g)?.length).toBe(3);

    // The steps: a ruler of 18 columns with a label every 30 seconds, then an ordered list in three columns.
    expect(prompt).toMatch(/18 columns of 10 seconds, one span per step, a tick label every 30 seconds; under it the steps as an ordered list in three columns, each led by its time/);
    expect(rule('.ruler__spans')).toMatch(/grid-template-columns:\s*repeat\(18,/);
    expect(body.match(/<div class="ruler__span ruler__span--(?:detect|compare|alert)">/g)?.length).toBe(3);
    const ticks = [...(body.match(/<div class="ruler__labels">([\s\S]*?)<\/div>/)?.[1] ?? '').matchAll(/<span>([^<]+)<\/span>/g)].map((match) => match[1]);
    expect(ticks).toEqual(['0:00', '0:30', '1:00', '1:30', '2:00', '2:30', '3:00']);
    expect(rule('.steps').match(/grid-template-columns:\s*([^;]+);/)?.[1].trim().split(/\s+/).length).toBe(3);
    expect(body).toMatch(/<ol class="steps">/);

    // Plans are one comparison table and the FAQ is a definition list with nothing folded away.
    expect(prompt).toMatch(/plans as a comparison table: one column per plan, one line per attribute; on a phone each plan becomes its own block/);
    expect(body.match(/<table class="plan-table"/g)?.length).toBe(1);
    expect(body.match(/<th scope="col" role="columnheader"><span class="plan-table__name">/g)?.length).toBe(3);
    expect(phoneBlocks(560)).toMatch(/--runtime-signal \.plan-table :is\(thead, tbody, tr\) \{[^}]*display:\s*contents/);
    expect(prompt).toMatch(/FAQ as a definition list with every answer visible, no accordion/);
    expect(body).toMatch(/<dl class="faq-list">/);
    expect(body.match(/<dl class="faq-list">[\s\S]*?<\/dl>/)?.[0].match(/<dt>/g)?.length).toBe(4);
    expect(body).not.toMatch(/<details\b|aria-expanded/);

    // The page navigation ends the page and the two breakpoints are the ones the prompt names.
    expect(prompt).toMatch(/previous\/next page navigation at the end of the page, not fixed to the screen/);
    expect(rule('.page-nav')).not.toMatch(/position:/);
    expect(prompt).toMatch(/breakpoints around 860px \(one column\) and 560px \(tables stack into labelled lines\)/);
    expect(phoneBlocks(860)).toMatch(/--runtime-signal \.steps \{[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/);
    expect(phoneBlocks(560)).toMatch(/--runtime-signal \.status-table tbody tr \{[^}]*display:\s*grid/);

    // The container and its gutters.
    expect(prompt).toMatch(/max-width around 1176px on a 12-column grid, 32px side gutters, 20px on a phone/);
    const root = rules.find((item) => item.selectors.length === 1 && item.selectors[0] === '.ported-style-page--runtime-signal')?.body ?? '';
    expect(root).toMatch(/--container:\s*1176px/);
    expect(root).toMatch(/--gutter:\s*32px/);
    expect(phoneBlocks(860)).toMatch(/--gutter:\s*20px/);
  });

  it('the focused skip link is stacked above the fixed back button', () => {
    const zIndex = (name: string) => {
      const rule = cssRules(portedCss).filter((item) => item.selectors.length === 1 && item.selectors[0] === `.ported-style-page--runtime-signal ${name}`).at(0);
      return Number(rule?.body.match(/z-index:\s*(\d+)/)?.[1]);
    };
    expect(zIndex('.skip-link')).toBeGreaterThan(zIndex('.page-back-link'));
  });

  // FAILS in round two. The base h1 rule sets word-break: normal, which beats the keep-all the
  // root passes down, and the Korean h1 rule that HEAD had was removed. In a browser the Korean
  // headline breaks as "배포의 영향 / 을 3분 안에" at 320px and "3 / 분 안에" at 414px.
  it('the Korean headline keeps its words whole', () => {
    const rules = cssRules(portedCss).filter((rule) => rule.selectors.some((selector) => selector.includes('ported-style-page--runtime-signal')));
    const resets = rules.filter((rule) => rule.selectors.includes('.ported-style-page--runtime-signal h1') && wordBreak(rule.body) === 'normal');
    const restores = rules.filter(
      (rule) =>
        wordBreak(rule.body) === 'keep-all' &&
        rule.selectors.some((selector) => /--runtime-signal(?::lang\(ko\)|\[lang="ko"\]) (?:.* )?(?:h1|:is\([^)]*\bh1\b[^)]*\))$/.test(selector)),
    );
    expect(resets.length === 0 || restores.length > 0, 'h1 resets word-break and no Korean rule restores keep-all').toBe(true);
  });

  // Round two found the table wider than its card at 320px and 360px, behind a sideways-scrolling
  // wrapper with no name and no focus stop. The author then removed the wrapper: on a phone each
  // service is two lines, and explicit roles keep the table semantics when the rows become grids.
  // Rewritten in round five: the page now has a second table (the plans), so the row count is
  // taken inside the status table. The intent is unchanged: no sideways-scrolling wrapper, rows
  // that stack on a phone, and explicit roles that keep the table a table when rows become grids.
  it('the status table needs no sideways scroll: rows stack on a phone and keep their table roles', async () => {
    const html = await renderPage('runtime-signal', 'en');
    expect(html).not.toMatch(/class="table-scroll"/);
    const block = runtimeBlock(portedCss);
    expect(block).not.toMatch(/\.table-scroll\b/);
    const table = html.match(/<table class="status-table" role="table" aria-label="Service status">[\s\S]*?<\/table>/)?.[0] ?? '';
    expect(table).not.toBe('');
    expect(table.match(/<tr role="row"/g)?.length).toBe(5);
    expect(table.match(/<th scope="col" role="columnheader"/g)?.length).toBe(4);
    expect(table.match(/<td role="cell"/g)?.length).toBe(16);
    expect(table.match(/<td role="cell" class="num" data-label="(p95|Last check)"/g)?.length).toBe(8);
    expect(table).toMatch(/<thead role="rowgroup">/);
    expect(table).toMatch(/<tbody role="rowgroup">/);
    // Nothing in the page's rules lets the table scroll sideways.
    const tableRules = cssRules(block).filter((rule) => rule.selectors.some((selector) => /\.status-table\b/.test(selector)));
    expect(tableRules.length).toBeGreaterThan(8);
    expect(tableRules.filter((rule) => /overflow(?:-x)?:\s*(?:auto|scroll)|min-width:\s*\d{3,}px|white-space:\s*nowrap/.test(rule.body))).toEqual([]);
    const phone = block.match(/@media \(max-width: 560px\) \{[\s\S]*?\.ported-style-page--runtime-signal \.status-table tbody tr \{([^}]*)\}/)?.[1] ?? '';
    expect(phone).toMatch(/display:\s*grid/);
    expect(phone).toMatch(/grid-template-columns:\s*minmax\(0, 1fr\)/);
    expect(block).toMatch(/\.status-table td\.num::before \{[^}]*content:\s*attr\(data-label\)/);
  });

  // New in round five. The plans are a second table that is regrouped by plan on a phone with
  // display: contents and order, so it needs the same care: explicit roles, and a label on
  // every value because the row headers are hidden there.
  it('the plan table regroups by plan on a phone and every value carries its row label', async () => {
    const html = await renderPage('runtime-signal', 'en');
    const table = html.match(/<table class="plan-table" role="table" aria-labelledby="rs-plans-title">[\s\S]*?<\/table>/)?.[0] ?? '';
    expect(table).not.toBe('');
    expect(html).toMatch(/<h2 id="rs-plans-title">/);
    const rows = [...table.matchAll(/<tr role="row">([\s\S]*?)<\/tr>/g)].map((match) => match[1]);
    expect(rows.length).toBe(6);
    for (const row of rows.slice(1)) {
      const header = decode(row.match(/<th scope="row" role="rowheader">([^<]+)<\/th>/)?.[1] ?? '');
      expect(header).not.toBe('');
      const labels = [...row.matchAll(/<td role="cell" data-label="([^"]+)">/g)].map((match) => decode(match[1]));
      expect(labels).toEqual([header, header, header]);
    }
    const block = runtimeBlock(portedCss);
    const phone = [...block.matchAll(/@media \(max-width: 560px\) \{([\s\S]*?)\n\}/g)].map((match) => match[1]).join('\n');
    expect(phone).toMatch(/--runtime-signal \.plan-table \{[^}]*display:\s*grid/);
    expect(phone).toMatch(/--runtime-signal \.plan-table :is\(thead, tbody, tr\) \{[^}]*display:\s*contents/);
    // One order value per plan column, so each plan's cells follow its name.
    for (const [child, order] of [[2, 1], [3, 2], [4, 3]]) expect(phone).toMatch(new RegExp(`\\.plan-table :is\\(th, td\\):nth-child\\(${child}\\) \\{[^}]*order:\\s*${order};`));
    expect(phone).toMatch(/--runtime-signal \.plan-table td::before \{[^}]*content:\s*attr\(data-label\)/);
    expect(phone).toMatch(/--runtime-signal \.plan-table thead td,\s*\.ported-style-page--runtime-signal \.plan-table tbody th \{[^}]*display:\s*none/);
    // Outside the phone block the table is not regrouped.
    const base = cssRules(block.replace(/@media[^{]*\{[\s\S]*?\n\}/g, ''));
    expect(base.filter((rule) => rule.selectors.some((selector) => /\.plan-table\b/.test(selector)) && /display:\s*(?:grid|contents)|order:/.test(rule.body))).toEqual([]);
  });
});

describe('round two, item 6: Holographic Fluid', () => {
  it('each preview button says the same thing to the eye and to a screen reader', async () => {
    for (const lang of LANGS) {
      const html = await renderPage('holographic-fluid', lang);
      const buttons = [...html.matchAll(/<button\b[^>]*class="hf-track__play"[^>]*aria-label="([^"]+)"[^>]*>([^<]*)<\/button>/g)];
      expect(buttons.length).toBe(3);
      for (const [, name, text] of buttons) expect(decode(name).endsWith(decode(text))).toBe(true);
    }
    // The playing state swaps the same pair of labels in both places.
    const source = read('src/ported/pages/PortedHolographicFluidPage.tsx');
    expect(source.match(/t\(active \? TRACKLIST\.stop : TRACKLIST\.play\)/g)?.length).toBe(2);
  });

  it('focus moves to the confirmation that replaces the sign-up form', () => {
    const source = read('src/ported/pages/PortedHolographicFluidPage.tsx');
    expect(source).toMatch(/if \(formState === 'done'\) doneRef\.current\?\.focus\(\)/);
    expect(source).toMatch(/className="hf-form__done" ref=\{doneRef\} tabIndex=\{-1\}/);
  });

  // FAILS in round two. The preview stops on the end of a CSS animation, and the shared shell
  // cuts every animation to 0.001ms under prefers-reduced-motion. With reduced motion on, the
  // preview button flips back at once: in a browser the label never leaves "미리 듣기".
  it('a preview keeps playing when the visitor asks for reduced motion', () => {
    const source = read('src/ported/pages/PortedHolographicFluidPage.tsx');
    const endsOnAnimation = /onAnimationEnd=\{\(\) => setPlaying\(null\)\}/.test(source);
    const shellCutsAnimations = /@media \(prefers-reduced-motion: reduce\)\s*\{[^@]*\.fusion-page \*[^@]*animation-duration:\s*0\.001ms\s*!important/.test(fusionShellCss);
    const reduced = fluidCss.match(/@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';
    const barKeepsItsLength = /\.hf-track__bar[^{]*\{[^}]*animation-duration:[^;]*!important/.test(reduced);
    expect(endsOnAnimation && shellCutsAnimations && !barKeepsItsLength, 'playing state ends with an animation that reduced motion shortens to nothing').toBe(false);
  });

  // FAILS in round two. The stack is Outfit, Noto Sans KR, system-ui for every language. Japanese
  // glyphs that the Korean font has are drawn in it and the rest fall back to the system font,
  // so one line mixes two weights: track 03 "浅瀬" is visibly lighter than the other titles.
  it('Japanese text is not set in the Korean font', () => {
    const stack = fluidCss.match(/--fs-body:\s*([^;]+);/)?.[1] ?? '';
    const koreanFontLeads = /Noto Sans KR/.test(stack) && !/Noto Sans JP|Hiragino|Yu Gothic|Meiryo/.test(stack.split('Noto Sans KR')[0]);
    const japaneseOverride = /:lang\(ja\)[^{]*\{[^}]*(?:font-family|--fs-(?:body|display))\s*:/.test(fluidCss);
    expect(!koreanFontLeads || japaneseOverride, 'Korean font precedes any Japanese font and no :lang(ja) rule changes the stack').toBe(true);
  });
});

describe('round two: Holo x Glass', () => {
  // FAILS in round two. Narrow blocks hide the word with display: none, so a screen reader hears
  // "25 min, 5 min, 25 min" with no focus or break; the key under the bar ("filled blocks are
  // focus") is visual only. At 1280px the three short breaks already lose the word.
  it('every block of the cycle bar tells a screen reader whether it is focus or a break', async () => {
    const html = await renderPage('fusion-holo-glass', 'en');
    const list = html.match(/<ol class="hg-cycle"[\s\S]*?<\/ol>/)?.[0] ?? '';
    const items = list.match(/<li\b[^>]*>/g) ?? [];
    expect(items.length).toBe(8);
    const wordRemoved = /\.hg-cycle__word\s*\{[^}]*display:\s*none/.test(glassCss);
    const namedAnotherWay = items.every((item) => /aria-label="/.test(item)) || /class="[^"]*(?:sr-only|visually-hidden)[^"]*"/.test(list);
    expect(!wordRemoved || namedAnotherWay, 'the focus/break word is removed with display: none and nothing else names the block').toBe(true);
  });

  // Rewritten in round five: the two rows of preset buttons became a range slider and four
  // colour swatches, and the time is drawn one character per cell. The intent is unchanged:
  // the timer says its time to assistive technology, both settings are labelled, the chosen
  // light is the one pressed button, and the status line exists and starts empty.
  it('the timer and its two choices are labelled', async () => {
    for (const lang of LANGS) {
      const html = await renderPage('fusion-holo-glass', lang);
      // The name is on the timer element; the five cells inside it are hidden from assistive technology.
      const timer = html.match(/<div class="hg-pane__time" role="timer" aria-label="([^"]+)">([\s\S]*?)<\/div>/);
      expect(timer?.[1] ?? '').toMatch(/\S 25:00$/);
      const cells = [...(timer?.[2] ?? '').matchAll(/<span class="(hg-digit(?: hg-digit--mark)?)" aria-hidden="true">([^<])<\/span>/g)];
      expect(cells.map((cell) => cell[2]).join('')).toBe('25:00');
      expect(cells.map((cell) => cell[1])).toEqual(['hg-digit', 'hg-digit', 'hg-digit hg-digit--mark', 'hg-digit', 'hg-digit']);
      expect((timer?.[2] ?? '').replace(/<span class="hg-digit[^>]*>[^<]<\/span>/g, '')).toBe('');

      // Focus length: a labelled range input whose value is also spoken as minutes.
      expect(html).toMatch(/<label class="hg-set__name" for="hg-length">[^<]+<\/label>/);
      const slider = html.match(/<input\b[^>]*id="hg-length"[^>]*>/)?.[0] ?? '';
      expect(slider).toMatch(/type="range"/);
      expect(slider).toMatch(/min="5"/);
      expect(slider).toMatch(/max="60"/);
      expect(slider).toMatch(/step="5"/);
      expect(slider).toMatch(/value="25"/);
      const valueText = slider.match(/aria-valuetext="([^"]+)"/)?.[1] ?? '';
      expect(valueText).toMatch(/25/);
      expect(html).toMatch(new RegExp(`<output class="hg-set__value" for="hg-length">${valueText}</output>`));

      // Light: a group named by its visible label, four named swatches, exactly one pressed.
      const labelId = html.match(/<div class="hg-lights" role="group" aria-labelledby="([^"]+)">/)?.[1] ?? '';
      expect(labelId).toBe('hg-light-label');
      expect(html).toMatch(new RegExp(`<span class="hg-set__name" id="${labelId}">[^<]+</span>`));
      const swatches = html.match(/<button\b[^>]*class="hg-lights__swatch"[^>]*>/g) ?? [];
      expect(swatches.length).toBe(4);
      for (const swatch of swatches) expect(swatch).toMatch(/aria-label="[^"]+"/);
      expect(new Set(swatches.map((swatch) => swatch.match(/aria-label="([^"]+)"/)?.[1])).size).toBe(4);
      expect(swatches.filter((swatch) => /aria-pressed="true"/.test(swatch)).length).toBe(1);
      // No other toggle on the page: the one pressed button is the chosen light, and its name is shown beside the swatches.
      const pressed = html.match(/<button\b[^>]*aria-pressed="true"[^>]*>/g) ?? [];
      expect(pressed.length).toBe(1);
      const chosen = pressed[0]?.match(/aria-label="([^"]+)"/)?.[1] ?? '';
      expect(chosen).not.toBe('');
      expect(html).toMatch(new RegExp(`<span class="hg-set__value">${chosen}</span>`));

      expect(html).toMatch(/<div class="hg-pane__notice" role="status"><\/div>/);
      // Start and Reset are real buttons with visible text.
      expect(html).toMatch(/<button type="button" class="hg-pane__go">[^<]+<\/button><button type="button" class="hg-pane__reset">[^<]+<\/button>/);
    }
  });

  it('has exactly one element with a backdrop blur', () => {
    const blurred = cssRules(glassCss).filter((rule) => /(?<!-webkit-)backdrop-filter:/.test(rule.body));
    expect(blurred.map((rule) => rule.selectors.join(', '))).toEqual(['.ported-style-page--fusion-holo-glass .hg-pane']);
  });
});

// ---------------------------------------------------------------------------
// Round three (English routes only; Korean and Japanese were out of scope)
// ---------------------------------------------------------------------------

describe('round three', () => {
  // FAILS in round three. Round two's fix made the hero one centred column with the timer under
  // the headline, but the prompt still asks for the old two-column hero. The Korean and Japanese
  // prompts carry the same sentence (PortedFusionHoloGlassPage.tsx lines 137, 185, 233).
  it('Holo x Glass: the prompt describes the hero the page has', async () => {
    const hero = cssRules(glassCss).find((rule) => rule.selectors.includes('.ported-style-page--fusion-holo-glass .hg-hero'));
    const oneCentredColumn = /grid-template-columns:\s*minmax\(0,\s*1fr\)\s*;/.test(hero?.body ?? '') && /text-align:\s*center/.test(hero?.body ?? '');
    const html = await renderPage('fusion-holo-glass', 'en');
    const prompt = decode(html.match(/<pre data-lang="en"[^>]*>([\s\S]*?)<\/pre>/)?.[1] ?? '');
    expect(prompt.length).toBeGreaterThan(500);
    const asksForTwoColumns = /headline and two actions on the left, the glass timer on the right/.test(prompt);
    expect(oneCentredColumn && asksForTwoColumns, 'the hero is one centred column and the prompt asks for headline left, timer right').toBe(false);
  });

  // The round-two table test finds the row rule anywhere after the first 560px media query of the
  // file. This one reads the 560px block that holds the rule and checks that no rule outside a
  // media query turns the rows into grids, so the desktop table stays a table.
  it('Runtime Signal: status rows become grids only inside the 560px block', () => {
    const blocks = [...portedCss.matchAll(/@media \(max-width: 560px\) \{([\s\S]*?)\n\}/g)].map((match) => match[1]);
    const block = blocks.find((item) => /\.ported-style-page--runtime-signal \.status-table tbody tr \{/.test(item));
    expect(block).toBeDefined();
    expect(block).toMatch(/\.ported-style-page--runtime-signal \.status-table tbody tr \{[^}]*display:\s*grid/);
    expect(block).toMatch(/\.ported-style-page--runtime-signal \.status-table td\.num::before \{[^}]*content:\s*attr\(data-label\)/);
    const base = cssRules(portedCss.replace(/@media[^{]*\{[\s\S]*?\n\}/g, ''));
    const gridOutside = base.filter((rule) => rule.selectors.some((selector) => /--runtime-signal \.status-table(?: tbody)? tr$/.test(selector)) && /display:\s*grid/.test(rule.body));
    expect(gridOutside).toEqual([]);
    const labelOutside = base.filter((rule) => rule.selectors.some((selector) => /--runtime-signal \.status-table td\.num::before$/.test(selector)));
    expect(labelOutside).toEqual([]);
  });
});

// Round four re-checks the four fixes made after round three, English only. Where focus lands
// after Tab, the hero gap in pixels and the accessibility tree were measured in a browser.
describe('round four', () => {
  it('Holo x Glass: the English prompt asks for the one-column hero the page has', async () => {
    const html = await renderPage('fusion-holo-glass', 'en');
    const prompt = decode(html.match(/<pre data-lang="en"[^>]*>([\s\S]*?)<\/pre>/)?.[1] ?? '');
    const heroLine = prompt.match(/^- Hero:.*$/m)?.[0] ?? '';
    expect(heroLine).toMatch(/^- Hero: one centred column\./);
    expect(heroLine).not.toMatch(/\bleft\b|\bright\b|two[- ]column/i);
  });

  it('FusionShell: scroll padding clears the prev/next bar at every width where the bar is fixed', () => {
    const shell = read('src/ported/fusionShell.css');
    const padded = shell.match(/@media \(min-width: (\d+)px\) \{\s*html:has\(\.fusion-shell__pagenav\) \{\s*scroll-padding-bottom:\s*(\d+)px;/);
    expect(padded, 'a scroll-padding-bottom rule for pages that have the prev/next bar').not.toBeNull();
    const from = Number(padded?.[1]);
    const padding = Number(padded?.[2]);
    // The bar measured 59px tall in the browser at 1280, 1024 and 768.
    expect(padding).toBeGreaterThanOrEqual(59 + 16);
    // Below that width the bar must leave the fixed position, or focus can land under it again.
    const narrow = [...shell.matchAll(/@media \(max-width: (\d+)px\) \{([\s\S]*?)\n\}/g)].find((match) => /\.fusion-shell__pagenav \{[^}]*position:\s*(?:static|relative)/.test(match[2]));
    expect(narrow, 'a narrow-screen rule that takes the bar out of the fixed position').toBeDefined();
    expect(Number(narrow?.[1]) + 1).toBe(from);
  });

  it('Holo x Glass: the hero keeps a gap between the two actions and the glass timer', () => {
    const glass = read('src/ported/pages/PortedFusionHoloGlassPage.css');
    const heroRules = [...glass.matchAll(/\.ported-style-page--fusion-holo-glass \.hg-hero \{([^}]*)\}/g)].map((match) => match[1]);
    const gap = Number(heroRules[0]?.match(/(?:^|\s)gap:\s*(\d+)px/)?.[1] ?? 0);
    expect(gap).toBeGreaterThanOrEqual(24);
    // No later rule for the hero shrinks it again on a narrower screen.
    expect(heroRules.slice(1).filter((body) => /(?:^|\s)(?:row-)?gap:/.test(body))).toEqual([]);
  });

  it('Runtime Signal: the phone layout drops the header row and labels each numeric cell once', async () => {
    const ported = read('src/ported/portedStylePages.css');
    const blocks = [...ported.matchAll(/@media \(max-width: 560px\) \{([\s\S]*?)\n\}/g)].map((match) => match[1]);
    const block = blocks.find((item) => /--runtime-signal \.status-table thead \{/.test(item)) ?? '';
    expect(block).toMatch(/--runtime-signal \.status-table thead \{[^}]*display:\s*none/);
    expect(block).toMatch(/--runtime-signal \.status-table td\.num::before \{[^}]*content:\s*attr\(data-label\)/);
    // Outside the phone block nothing hides the header row, so wider screens keep their column headers.
    const outside = ported.replace(/@media[^{]*\{[\s\S]*?\n\}/g, '');
    expect(outside).not.toMatch(/--runtime-signal \.status-table thead \{[^}]*(?:display:\s*none|clip|position:\s*absolute)/);
    // Each numeric cell carries the label the stylesheet prints, and it is its column's header text.
    const html = await renderPage('runtime-signal', 'en');
    const table = html.match(/<table[^>]*class="[^"]*status-table[^"]*"[\s\S]*?<\/table>/)?.[0] ?? '';
    const headers = [...table.matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map((match) => decode(match[1].replace(/<[^>]+>/g, '')).trim());
    expect(headers).toHaveLength(4);
    const numericCells = [...table.matchAll(/<td[^>]*class="num"[^>]*>/g)].map((match) => match[0]);
    expect(numericCells.length).toBeGreaterThan(0);
    expect(numericCells.length % 2).toBe(0);
    numericCells.forEach((cell, index) => {
      const label = decode(cell.match(/data-label="([^"]*)"/)?.[1] ?? '');
      expect(label).toBe(headers[2 + (index % 2)]);
    });
  });
});
