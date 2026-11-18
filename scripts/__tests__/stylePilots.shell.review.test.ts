import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Review round 5: the shared shell's controls on the two FusionShell pilots, the
// Runtime Signal layout fixes, and the order of the shell's blur declarations.

interface Rule {
  selector: string;
  body: string;
}

const read = (file: string) => readFileSync(resolve(process.cwd(), file), 'utf8');

/** Every style rule as a flat list, including the rules inside @media blocks. */
function rules(css: string): Rule[] {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  return [...withoutComments.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((match) => ({
    selector: match[1].trim().replace(/\s+/g, ' '),
    body: match[2],
  }));
}

/** Rules where one selector of the comma list starts with the page scope and ends with `target`. */
function rulesFor(list: Rule[], scope: string, target: string): Rule[] {
  return list.filter((rule) =>
    rule.selector.split(',').some((part) => {
      const selector = part.trim();
      return selector.startsWith(scope) && selector.endsWith(target);
    }),
  );
}

const CONTROLS = ['.fusion-shell__back', '.lang-toggle', '.fusion-shell__theme', '.fusion-shell__prompt button[data-copy-prompt]'];
const BLOCKS = ['.fusion-shell__prompt pre', '.fusion-shell__pagenav'];
const LABELS = ['.fusion-shell__prompt-heading', '.fusion-shell__pagenav-label'];

const PILOTS = [
  { name: 'Holographic Fluid', file: 'src/ported/pages/PortedHolographicFluidPage.css', scope: '.ported-style-page--holographic-fluid', control: '0', block: '0' },
  { name: 'Holo x Glass', file: 'src/ported/pages/PortedFusionHoloGlassPage.css', scope: '.ported-style-page--fusion-holo-glass', control: '8px', block: '4px' },
];

describe.each(PILOTS)('shell chrome on $name', ({ file, scope, control, block }) => {
  const list = rules(read(file));
  const radius = (value: string) => new RegExp(`border-radius:\\s*${value}\\s*;`);

  it.each(CONTROLS)('%s takes the page radius, not the shell pill', (target) => {
    const found = rulesFor(list, scope, target);
    expect(found.length).toBeGreaterThan(0);
    expect(found.some((rule) => radius(control).test(rule.body))).toBe(true);
  });

  it.each(BLOCKS)('%s takes the page radius', (target) => {
    const found = rulesFor(list, scope, target);
    expect(found.length).toBeGreaterThan(0);
    expect(found.some((rule) => radius(block).test(rule.body))).toBe(true);
  });

  it.each(LABELS)('%s is set in reading case with no added tracking', (target) => {
    const found = rulesFor(list, scope, target);
    expect(found.some((rule) => /text-transform:\s*none\s*;/.test(rule.body) && /letter-spacing:\s*0\s*;/.test(rule.body))).toBe(true);
  });

  it('prev/next labels are 0.75rem', () => {
    const found = rulesFor(list, scope, '.fusion-shell__pagenav-label');
    expect(found.some((rule) => /font-size:\s*0\.75rem\s*;/.test(rule.body))).toBe(true);
  });

  it('no shell rule on the page brings back a pill or upper case', () => {
    const shell = list.filter((rule) => rule.selector.includes(scope) && /fusion-shell__|lang-toggle/.test(rule.selector));
    expect(shell.length).toBeGreaterThan(0);
    for (const rule of shell) {
      expect(rule.body).not.toMatch(/border-radius:\s*9{3,4}px/);
      expect(rule.body).not.toMatch(/text-transform:\s*uppercase/);
    }
  });
});

describe('Runtime Signal layout fixes', () => {
  const list = rules(read('src/ported/portedStylePages.css'));
  const scope = '.ported-style-page--runtime-signal';

  it('the service-detail panel keeps one height across tabs', () => {
    const panel = rulesFor(list, scope, '.detail-panel');
    expect(panel.some((rule) => /display:\s*flow-root\s*;/.test(rule.body) && /min-height:\s*214px\s*;/.test(rule.body))).toBe(true);
    expect(panel.some((rule) => /min-height:\s*312px\s*;/.test(rule.body))).toBe(true);
  });

  it('focusable elements keep clear of the fixed back button', () => {
    const rule = list.find((item) => item.selector === `${scope} :is(a, button, input, [tabindex])`);
    expect(rule?.body).toMatch(/scroll-margin-top:\s*72px\s*;/);
  });
});

describe('shell blur declarations', () => {
  const blurRules = rules(read('src/ported/fusionShell.css')).filter((rule) => rule.body.includes('backdrop-filter'));

  it('the shell sets a blur in two places', () => {
    expect(blurRules.map((rule) => rule.selector)).toEqual(['.fusion-shell__back', '.fusion-shell__pagenav']);
  });

  it('-webkit-backdrop-filter comes before backdrop-filter, so the minifier keeps both', () => {
    for (const rule of blurRules) {
      const prefixed = rule.body.indexOf('-webkit-backdrop-filter');
      const plain = rule.body.search(/(?<!-webkit-)backdrop-filter/);
      expect(prefixed).toBeGreaterThanOrEqual(0);
      expect(plain).toBeGreaterThan(prefixed);
    }
  });

  // Open, low severity: fusion-studio-pixel and fusion-soft-inflate reset the bar's blur with
  // `backdrop-filter: none` first and `-webkit-backdrop-filter: none` second. The production
  // build keeps only the prefixed reset, so Chromium computes blur(16px) on those two bars.
  it.todo('page rules that reset the shell blur list -webkit-backdrop-filter first');
});
