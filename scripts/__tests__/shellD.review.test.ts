import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { styleCatalog } from '../../src/data/styles';
import { dictionaries } from '../../src/data/i18n';
import { homeChoiceCopy } from '../../src/data/homeChoiceCopy';
import { BAND_STYLE_IDS, hasLargeShot, shotSrc, shotSrcSet } from '../../src/pages/home/shots';
import { fill, homeCopy } from '../../src/pages/home/homeCopy';

// Independent review of the site shell rule set D (white base, Wanted Sans, six sizes,
// weights 400/500/600) as applied to the home and the guide and tool pages.

const read = (file: string) => readFileSync(resolve(process.cwd(), file), 'utf8');

interface Rule {
  selector: string;
  body: string;
}

/** Every style rule as a flat list, including the rules inside @media blocks. */
function rules(css: string): Rule[] {
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
  return [...withoutComments.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((match) => ({
    selector: match[1].trim().replace(/\s+/g, ' '),
    body: match[2],
  }));
}

describe('home screenshots', () => {
  const files = new Set(readdirSync(resolve(process.cwd(), 'public/shots')));

  it('every catalog style has a 640px screenshot', () => {
    const missing = styleCatalog.filter((style) => !files.has(`${style.id}-640.webp`)).map((style) => style.id);
    expect(missing).toEqual([]);
  });

  it('only the band styles have a 1280px screenshot, and each of them has one', () => {
    const large = [...files].filter((file) => file.endsWith('-1280.webp')).map((file) => file.replace(/-1280\.webp$/, '')).sort();
    expect(large).toEqual([...BAND_STYLE_IDS].sort());
  });

  it('the band shows twelve distinct catalog styles', () => {
    const ids = new Set(styleCatalog.map((style) => style.id));
    expect(BAND_STYLE_IDS).toHaveLength(12);
    expect(new Set(BAND_STYLE_IDS).size).toBe(12);
    for (const id of BAND_STYLE_IDS) expect(ids.has(id), id).toBe(true);
  });

  it('srcset offers the 1280px file only where it exists', () => {
    for (const style of styleCatalog) {
      expect(shotSrc(style.id)).toBe(`/shots/${style.id}-640.webp`);
      const set = shotSrcSet(style.id);
      if (hasLargeShot(style.id)) expect(set).toContain(`/shots/${style.id}-1280.webp 1280w`);
      else expect(set).toBeUndefined();
    }
  });
});

describe('home copy', () => {
  const counts = { count: 48, styles: 32, fusions: 16, references: 520 };

  it('every placeholder in every language is filled', () => {
    for (const lang of ['en', 'ko', 'ja'] as const) {
      for (const [key, value] of Object.entries(homeCopy[lang])) {
        for (const text of Array.isArray(value) ? value : [value]) {
          expect(fill(text, counts), `${lang}.${key}`).not.toMatch(/\{\w+\}/);
          expect(text.trim().length, `${lang}.${key}`).toBeGreaterThan(0);
        }
      }
    }
  });

  it('Korean and Japanese shell copy never uses 장애, 障害 or 사고', () => {
    const forbidden = /장애|障害|사고/;
    for (const lang of ['ko', 'ja'] as const) {
      const texts = [
        ...Object.values(homeCopy[lang]).flat(),
        ...Object.values(homeChoiceCopy[lang]),
        ...Object.values(dictionaries[lang]),
      ].map(String);
      expect(texts.filter((text) => forbidden.test(text)), lang).toEqual([]);
    }
  });
});

describe('banned outage words across the site', () => {
  // 장애 reads first as disability and 障害 likewise; use 서비스 중단 / 오류 and 停止 / エラー.
  // Search aliases may keep the words so people who type them still find the recipe.
  const sourceFiles = (dir: string): string[] =>
    readdirSync(resolve(process.cwd(), dir), { withFileTypes: true }).flatMap((entry) => {
      const path = `${dir}/${entry.name}`;
      if (entry.isDirectory()) return sourceFiles(path);
      return /\.(ts|tsx)$/.test(entry.name) ? [path] : [];
    });

  it('no displayed string in src uses 장애 or 障害', () => {
    const hits = sourceFiles('src').flatMap((file) =>
      read(file)
        .split('\n')
        .map((line, index) => ({ line, at: `${file}:${index + 1}` }))
        .filter(({ line }) => /장애|障害/.test(line) && !/\baliases:/.test(line) && !/^\s*(\/\/|\*)/.test(line))
        .map(({ at }) => at),
    );
    expect(hits).toEqual([]);
  });
});

describe('type scale in the shell stylesheets', () => {
  // The stylesheets this change wrote for the shell. Rules inside a preview scope keep
  // the preview's own values and are not part of the rule set.
  const SHELL_FILES = [
    'src/pages/Home.css',
    'src/pages/shell-guides.css',
    'src/pages/shell-kit.css',
    'src/pages/shell-tools.css',
    'src/components/workspace-status.css',
    'src/pages/ReferenceExplorer.css',
    'src/pages/DesignPrinciples.css',
    'src/pages/PromptWorkflow.css',
  ];
  const PREVIEW = /\.(visual-specimen|color-role-preview|principle-example|glossary-preview|component-glossary-demo|animation-preview|cmp-stage__canvas|cmp-card__preview|ported-style-page|style-experience)\b/;
  const SIX = new Set(['14px', '16px', '18px', '24px', '40px', '72px']);
  // Code text is the one exception: the D prototype sets it at 13px in the mono face,
  // which reads the size of 14px Wanted Sans.
  const CODE = /(^|[\s>,(])(code|pre)\b/;

  const declarations = (property: RegExp) =>
    SHELL_FILES.flatMap((file) =>
      rules(read(file))
        // A preview named only inside :not() still leaves a shell rule.
        .filter((rule) => !PREVIEW.test(rule.selector.replace(/:not\([^)]*\)/g, '')))
        .flatMap((rule) => [...rule.body.matchAll(property)].map((match) => ({
          file,
          selector: rule.selector,
          value: match[1].trim(),
          code: CODE.test(rule.selector) || /font-family:\s*var\(--font-mono\)/.test(rule.body),
        }))),
    );

  it('every font size is a size role or one of 14, 16, 18, 24, 40, 72 px (13px for code)', () => {
    const off = declarations(/(?:^|;)\s*font-size:\s*([^;]+)/g)
      .filter(({ value, code }) => !/^var\(--(text-(14|16|18|24|40|72)|title-size|heading-size|subheading-size|lead-size)\b/.test(value) && !SIX.has(value) && value !== 'inherit' && !(code && value === '13px'))
      .map(({ file, selector, value }) => `${file} ${selector} -> ${value}`);
    expect(off).toEqual([]);
  });

  it('every font weight is 400, 500 or 600', () => {
    const off = declarations(/(?:^|;)\s*font-weight:\s*([^;]+)/g)
      .filter(({ value }) => !['400', '500', '600', 'inherit'].includes(value))
      .map(({ file, selector, value }) => `${file} ${selector} -> ${value}`);
    expect(off).toEqual([]);
  });
});
