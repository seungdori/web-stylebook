import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// Review of stream 2 (keep pages): five legacy pages moved onto FusionShell, the phone
// rules for their shell controls, the back-link tuck and the selected pill edge.

interface Rule {
  selector: string;
  body: string;
  media: string;
}

const read = (file: string) => readFileSync(resolve(process.cwd(), file), 'utf8');

/** Every style rule with the @media prelude it sits in ('' at the top level). */
function rules(css: string): Rule[] {
  const src = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const out: Rule[] = [];
  const stack: string[] = [];
  let buf = '';
  for (const ch of src) {
    if (ch === '{') {
      const prelude = buf.trim().replace(/\s+/g, ' ');
      stack.push(prelude);
      buf = '';
    } else if (ch === '}') {
      const prelude = stack.pop() ?? '';
      if (!prelude.startsWith('@')) {
        const media = stack.filter((p) => p.startsWith('@media')).join(' and ');
        out.push({ selector: prelude, body: buf, media });
      }
      buf = '';
    } else {
      buf += ch;
    }
  }
  return out;
}

const PAGES = [
  { id: 'macos-liquid-glass', name: 'MacosLiquidGlass', prev: '/pages/paper-cut.html', next: '/pages/fusion-neon-swiss.html' },
  { id: 'y2k-retro', name: 'Y2kRetro', prev: '/pages/retro-pixel.html', next: '/pages/risograph-print.html' },
  { id: 'mono-type', name: 'MonoType', prev: '/pages/zen-minimalism.html', next: '/pages/duotone-bold.html' },
  { id: 'bento-bloom', name: 'BentoBloom', prev: '/pages/aurora-gradient.html', next: '/pages/midnight-noir.html' },
  { id: 'paper-cut', name: 'PaperCut', prev: '/pages/risograph-print.html', next: '/pages/macos-liquid-glass.html' },
];

describe.each(PAGES)('$id on FusionShell', ({ id, name, prev, next }) => {
  const tsx = read(`src/ported/pages/Ported${name}Page.tsx`);
  const cssFile = `src/ported/pages/Ported${name}Page.css`;
  const list = rules(read(cssFile));
  const scope = `.ported-style-page--${id}`;

  it('renders through FusionShell with its own id and drops the legacy chrome', () => {
    expect(tsx).toMatch(/<FusionShell[\s\S]*?fusionId="([^"]+)"/);
    expect(tsx.match(/fusionId="([^"]+)"/)?.[1]).toBe(id);
    expect(tsx).not.toMatch(/usePortedPageEffects|usePortedCopyPrompt/);
    expect(tsx).not.toMatch(/className="(page-nav|page-back-link|site-nav)"/);
    expect(tsx).toContain(`import './Ported${name}Page.css'`);
  });

  it('keeps the prev / next targets the legacy page-nav had on main', () => {
    expect(tsx).toMatch(new RegExp(`prev=\\{\\{ href: '${prev.replace(/[.]/g, '\\.')}'`));
    expect(tsx).toMatch(new RegExp(`next=\\{\\{ href: '${next.replace(/[.]/g, '\\.')}'`));
  });

  it('scopes every rule in its stylesheet to the page, so nothing leaks after client navigation', () => {
    const leaks = list
      .flatMap((rule) => splitSelectorList(rule.selector))
      .filter((selector) => !selector.includes(scope) && !/^(from|to|\d+%)$/.test(selector));
    expect(leaks).toEqual([]);
  });

  // Brief: "Controls at least 44px at 320–480" on the migrated pages.
  it.each(['.fusion-shell__back', '.lang-toggle', '.fusion-shell__theme', '.fusion-shell__prompt-heading', 'button[data-copy-prompt]'])(
    '%s is at least 44px tall at 480px and below',
    (target) => {
      const phone = list.filter(
        (rule) => /max-width:\s*(480|4[0-7]\d|[1-3]\d\d)px/.test(rule.media) && splitSelectorList(rule.selector).some((s) => s.includes(scope) && s.endsWith(target)),
      );
      const tall = phone.some((rule) => {
        const values = [...rule.body.matchAll(/(?:^|;|\s)(?:min-height|height)\s*:\s*(\d+(?:\.\d+)?)px/g)].map((m) => Number(m[1]));
        return values.some((v) => v >= 44);
      });
      expect(tall, `${cssFile}: no rule under @media (max-width: <=480px) gives ${target} a 44px height`).toBe(true);
    },
  );

  // Project rule: borders at least 22% opacity. Only the shell overrides this change added.
  it('draws the shell controls with borders of at least 22% opacity', () => {
    const shell = list.filter((rule) => /fusion-shell__|lang-toggle|lang-menu/.test(rule.selector));
    const faint = shell.flatMap((rule) =>
      [...rule.body.matchAll(/border(?:-top|-bottom|-left|-right)?(?:-color)?\s*:[^;]*rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0?\.\d+)\s*\)/g)]
        .filter((m) => Number(m[1]) < 0.22)
        .map((m) => `${rule.selector.slice(0, 80)} -> ${m[0].trim()}`),
    );
    expect(faint).toEqual([]);
  });
});

describe('legacy chrome rules for the migrated pages are gone from portedStylePages.css', () => {
  const css = read('src/ported/portedStylePages.css');
  it.each(['mono-type', 'y2k-retro', 'bento-bloom', 'paper-cut'])('%s has no page-nav or page-back-link rules left', (id) => {
    expect(css).not.toMatch(new RegExp(`ported-style-page--${id}[^{]*\\.(page-nav|page-back-link)`));
  });
});

describe('back link tuck and skip link (fusionShell.css)', () => {
  const list = rules(read('src/ported/fusionShell.css'));

  it('tucks the back link only up to 720px and never while it has keyboard focus', () => {
    const tuck = list.filter((rule) => rule.selector.includes('.is-tucked'));
    expect(tuck.length).toBeGreaterThan(0);
    for (const rule of tuck) {
      expect(rule.media).toMatch(/max-width:\s*720px/);
      expect(rule.selector).toContain(':not(:focus-visible)');
    }
  });

  it('opens the focused skip link below the back link (16px + 44px tall)', () => {
    const skip = list.filter((rule) => rule.selector.startsWith('.fusion-page .skip-link') && /:focus/.test(rule.selector));
    const top = Math.max(...skip.flatMap((rule) => [...rule.body.matchAll(/top:\s*(\d+)px/g)].map((m) => Number(m[1]))));
    expect(top).toBeGreaterThanOrEqual(16 + 44);
  });
});

describe('selected pill carries a visible edge', () => {
  const styles = read('src/styles.css');
  it('--line-strong on the shell is at least 45% ink', () => {
    const alpha = Number(styles.match(/:root\s*\{[^}]*--line-strong:\s*rgba\(0,\s*0,\s*0,\s*(0?\.\d+)\)/)?.[1]);
    expect(alpha).toBeGreaterThanOrEqual(0.45);
  });
  it.each([
    ['src/styles.css', ".segmented button:is(.is-active, [aria-pressed='true'], [aria-selected='true'])"],
    ['src/styles.css', '.nav-menu.is-current .nav-menu__trigger'],
    ['src/styles.css', '.design-guide-tabs__tab.is-active'],
    ['src/pages/Home.css', ".home-apply__tablist button[aria-selected='true']"],
    ['src/pages/shell-tools.css', ".compare-page .home-choice__switches > button:is(.is-active, [aria-pressed='true'])"],
  ])('%s: %s has an inset --line-strong edge', (file, selector) => {
    const found = rules(read(file)).filter((rule) => splitSelectorList(rule.selector).includes(selector));
    expect(found.some((rule) => /box-shadow:\s*inset 0 0 0 1px var\(--line-strong\)/.test(rule.body))).toBe(true);
  });
});

/** Split a selector list on top-level commas (not inside :is() / :not()). */
function splitSelectorList(list: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let cur = '';
  for (const ch of list) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      parts.push(cur.trim());
      cur = '';
    } else cur += ch;
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}
