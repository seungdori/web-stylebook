// Reviewer tests for the components gallery and pages, and the kit props added
// with them. Markup is checked with renderToStaticMarkup. Layout, scrolling, and
// timers were checked in a browser, not here. The highlighter is not exported,
// so its patterns are read from its source: these tests exercise the real regexes.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { createElement, isValidElement, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { kitCatalog } from '../../src/data/kitCatalog';
import { matchRoute } from '../../src/data/routes';
import { Button } from '../../src/kit/button/button';
import { EmptyState } from '../../src/kit/empty-state/empty-state';
import { StatusBadge, type StatusTone } from '../../src/kit/status-badge/status-badge';
import { Components } from '../../src/pages/Components';
import { CodeBlock } from '../../src/pages/components/shared';

const read = (path: string) => readFileSync(resolve(process.cwd(), path), 'utf8');
const demoSource = read('src/pages/components/demos.tsx');
const pageCss = read('src/pages/Components.css');
const themeCss = read('src/kit/theme.css');

function kitFiles(): string[] {
  const root = resolve(process.cwd(), 'src/kit');
  return readdirSync(root).flatMap((name) => {
    const path = resolve(root, name);
    return statSync(path).isDirectory() ? readdirSync(path).map((file) => resolve(path, file)) : [path];
  });
}

interface CssRule {
  prelude: string;
  body: string;
  media: string | null;
}

function parseCss(css: string, media: string | null = null): CssRule[] {
  const source = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules: CssRule[] = [];
  let cursor = 0;
  while (cursor < source.length) {
    const open = source.indexOf('{', cursor);
    if (open === -1) break;
    const prelude = source.slice(cursor, open).trim();
    let depth = 1;
    let index = open + 1;
    while (depth > 0) {
      if (source[index] === '{') depth += 1;
      if (source[index] === '}') depth -= 1;
      index += 1;
    }
    const body = source.slice(open + 1, index - 1);
    if (prelude.startsWith('@media') || prelude.startsWith('@container')) rules.push(...parseCss(body, prelude));
    else rules.push({ prelude, body, media });
    cursor = index;
  }
  return rules;
}

function splitSelectors(prelude: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const char of prelude) {
    if (char === '(') depth += 1;
    if (char === ')') depth -= 1;
    if (char === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  parts.push(current.trim());
  return parts;
}

function luminance(hex: string): number {
  const channels = [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16) / 255);
  const [r, g, b] = channels.map((value) => (value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const page = (lang: 'en' | 'ko' | 'ja', slug = 'status-badge') => renderToStaticMarkup(createElement(Components, { lang, slug }));

const unescape = (html: string) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&');

function renderCode(code: string, title: string) {
  return renderToStaticMarkup(createElement(CodeBlock, { code, title, lang: 'en' }));
}

function codePane(html: string) {
  const pane = html.match(/<pre[^>]*><code>([\s\S]*?)<\/code><\/pre>/)?.[1];
  if (pane === undefined) throw new Error('CodeBlock did not render a code pane');
  return pane;
}

function paintedTokens(html: string): Array<{ kind: string; text: string }> {
  return [...codePane(html).matchAll(/<span class="([^"]+)">([\s\S]*?)<\/span>/g)].map((match) => {
    const kind = /^cmp-tok-(\w+)$/.exec(match[1]);
    if (!kind) throw new Error(`token span has class ${match[1]}`);
    return { kind: kind[1], text: unescape(match[2]) };
  });
}

describe('code highlighting', () => {
  it('paints every kit file and keeps the source text', () => {
    for (const path of kitFiles()) {
      const code = readFileSync(path, 'utf8');
      const title = path.split('/').pop() ?? path;
      const html = renderCode(code, title);
      expect(unescape(codePane(html)), title).toBe(code.trimEnd());
      expect(paintedTokens(html).length, title).toBeGreaterThan(0);
    }
  }, 20_000);

  it('keeps a URL inside a string out of the comment class', () => {
    const result = paintedTokens(renderCode('const REGISTRY = "https://webstylebook.com/r";', 'registry.tsx'));
    expect(result).toContainEqual({ kind: 'string', text: '"https://webstylebook.com/r"' });
    expect(result.some((token) => token.kind === 'comment')).toBe(false);
  });

  it('colors the index.html snippet: tag, attribute, string, and HTML comment', () => {
    const result = paintedTokens(renderCode('<link rel="stylesheet" href="https://x.test/a.css" />\n<!-- Korean -->', 'index.html'));
    expect(result).toContainEqual({ kind: 'tag', text: '<link' });
    expect(result).toContainEqual({ kind: 'attr', text: 'href' });
    expect(result).toContainEqual({ kind: 'string', text: '"https://x.test/a.css"' });
    expect(result).toContainEqual({ kind: 'comment', text: '<!-- Korean -->' });
  });

  it('does not read a TypeScript generic as a JSX tag', () => {
    const result = paintedTokens(renderCode("ComponentPropsWithRef<'button'>; Array<string | false>; useState<Lang>(a);", 'types.tsx'));
    expect(result.some((token) => token.kind === 'tag')).toBe(false);
  });

  it('colors JSX with a template literal', () => {
    const result = paintedTokens(renderCode('<span key={`mark-${tone}`} className="x" />', 'mark.tsx'));
    expect(result).toContainEqual({ kind: 'tag', text: '<span' });
    expect(result).toContainEqual({ kind: 'string', text: '`mark-${tone}`' });
    expect(result).toContainEqual({ kind: 'attr', text: 'className' });
  });

  it('colors CSS custom properties, at-rules, and a comment with an apostrophe', () => {
    const result = paintedTokens(renderCode("/* don't */\n@media (x) {\n  --ws-a: 1;\n  color: var(--ws-b);\n}", 'theme.css'));
    expect(result).toContainEqual({ kind: 'comment', text: "/* don't */" });
    expect(result).toContainEqual({ kind: 'keyword', text: '@media' });
    expect(result).toContainEqual({ kind: 'attr', text: '--ws-b' });
  });
});

describe('Components page markup', () => {
  it.each(['en', 'ko', 'ja'] as const)('renders in %s with no unclassified token', (lang) => {
    const html = page(lang);
    expect(html).toContain('components-page');
    expect(html).not.toContain('cmp-tok-undefined');
  });

  it('highlighting leaves the source text unchanged', () => {
    const code = read('src/kit/surface/surface.tsx');
    const html = renderToStaticMarkup(createElement(CodeBlock, { code, title: 'surface.tsx', lang: 'en' }));
    const pane = html.match(/<pre[^>]*><code>([\s\S]*?)<\/code><\/pre>/)?.[1] ?? '';
    expect(unescape(pane)).toBe(code.trimEnd());
  });

  it('links every sidebar entry to a route that exists, and marks exactly one', () => {
    const html = page('en');
    const links = [...html.matchAll(/<a href="([^"]+)" data-kit-link=""/g)].map((match) => match[1]);
    expect(links.length).toBeGreaterThan(12);
    for (const href of links) expect(matchRoute(href), href).toBeDefined();
    expect(html.match(/aria-current="page"/g)).toHaveLength(1);
  });

  it('the gallery links every component and keeps its previews out of the tab order', () => {
    const html = page('en', '');
    for (const entry of kitCatalog) expect(html).toContain(`href="/pages/components/${entry.slug}"`);
    expect(html.match(/class="ws-panel cmp-card__preview"/g)).toHaveLength(kitCatalog.length);
    for (const match of html.matchAll(/<div class="ws-panel cmp-card__preview"([^>]*)>/g)) expect(match[1]).toMatch(/inert/);
  });

  it('renders each copy button with a name and an empty live region ready before the copy', () => {
    const html = page('en');
    const copies = html.match(/<span class="cmp-copy">[\s\S]*?<\/button><span class="sr-only" aria-live="polite"><\/span><\/span>/g) ?? [];
    expect(copies.length).toBeGreaterThan(0);
    for (const item of copies) expect(item).toContain('aria-label="Copy: ');
  });

  it('names scrollable tables as focusable regions', () => {
    for (const match of page('en').matchAll(/<div class="cmp-table"([^>]*)>/g)) {
      expect(match[1]).toContain('role="region"');
      expect(match[1]).toContain('tabindex="0"');
      expect(match[1]).toContain('aria-label=');
    }
  });

  // Fails today: <pre> maps to role generic, where ARIA 1.2 prohibits aria-label.
  it('gives each focusable code block a role that can carry its name', () => {
    const blocks = [...page('en').matchAll(/<pre([^>]*)>/g)].map((match) => match[1]);
    expect(blocks.length).toBeGreaterThan(0);
    for (const attributes of blocks) expect(attributes).toMatch(/role="(region|group)"/);
  });

  // Fails today: the saved list includes "macOS Liquid Glass", so the
  // "No results" situation shows one result and never its Empty State.
  it('uses a No results demo query that matches no saved style', () => {
    const list = demoSource.slice(demoSource.indexOf('const SAVED = ['), demoSource.indexOf('type SavedData'));
    const names = [...list.matchAll(/name: '([^']+)'/g)].map((match) => match[1].toLowerCase());
    const query = demoSource.match(/scenario === 'filtered-empty' \? '([^']+)' : ''/)?.[1].toLowerCase();
    expect(names.length).toBeGreaterThan(0);
    expect(query).toBeTruthy();
    expect(names.filter((name) => name.includes(query as string))).toEqual([]);
  });
});

describe('page CSS stays on this route', () => {
  const rules = parseCss(pageCss);

  it('scopes every selector to the page', () => {
    const selectors = rules.filter((rule) => !rule.prelude.startsWith('@')).flatMap((rule) => splitSelectors(rule.prelude));
    expect(selectors.length).toBeGreaterThan(0);
    for (const selector of selectors) expect(selector).toMatch(/\.cmp-|\.components-page/);
  });

  it('remaps site tokens and the main padding only while the page is mounted', () => {
    const selectors = rules.flatMap((rule) => splitSelectors(rule.prelude));
    for (const selector of selectors.filter((item) => /:root|^\.main/.test(item))) {
      expect(selector).toContain(':has(.components-page)');
    }
  });

  it('namespaces keyframes', () => {
    const names = (css: string) => [...css.matchAll(/@keyframes\s+([\w-]+)/g)].map((match) => match[1]);
    for (const name of names(pageCss)) expect(name).toMatch(/^cmp-/);
    for (const path of kitFiles().filter((item) => item.endsWith('.css'))) {
      for (const name of names(readFileSync(path, 'utf8'))) expect(name).toMatch(/^ws-/);
    }
  });
});

describe('reduced motion', () => {
  const sheets = [...kitFiles().filter((path) => path.endsWith('.css') && !path.endsWith('theme.css')), resolve(process.cwd(), 'src/pages/Components.css')];

  it('zeroes both duration tokens in the theme', () => {
    const block = parseCss(themeCss).find((rule) => rule.media?.includes('prefers-reduced-motion') && rule.prelude === ':root');
    expect(block?.body).toMatch(/--ws-duration-fast:\s*0ms/);
    expect(block?.body).toMatch(/--ws-duration:\s*0ms/);
  });

  it('turns off every infinite animation in the same file, with no help from the site', () => {
    let checked = 0;
    for (const path of sheets) {
      const rules = parseCss(readFileSync(path, 'utf8'));
      const reduced = rules.filter((rule) => rule.media?.includes('prefers-reduced-motion'));
      for (const rule of rules.filter((item) => !item.media && /animation:[^;]*infinite/.test(item.body))) {
        checked += 1;
        const off = reduced.find((item) => splitSelectors(item.prelude).includes(rule.prelude) && /animation:\s*none/.test(item.body));
        expect(off, `${path}: ${rule.prelude}`).toBeDefined();
      }
    }
    expect(checked).toBeGreaterThan(0);
  });

  it('runs every finite entrance on a duration token, or turns it off', () => {
    for (const path of sheets) {
      const rules = parseCss(readFileSync(path, 'utf8'));
      const reduced = rules.filter((rule) => rule.media?.includes('prefers-reduced-motion'));
      for (const rule of rules.filter((item) => !item.media && /animation:/.test(item.body) && !/infinite/.test(item.body))) {
        const declaration = rule.body.match(/animation:[^;]*/)?.[0] ?? '';
        const off = reduced.some((item) => splitSelectors(item.prelude).includes(rule.prelude) && /animation:\s*none/.test(item.body));
        expect(/var\(--ws-duration/.test(declaration) || off, `${path}: ${rule.prelude}`).toBe(true);
      }
    }
  });
});

describe('standing design constraints', () => {
  const sheets = [...kitFiles().filter((path) => path.endsWith('.css')), resolve(process.cwd(), 'src/pages/Components.css')];

  it('has no shadow, gradient, or Tailwind directive', () => {
    for (const path of sheets) {
      expect(readFileSync(path, 'utf8'), path).not.toMatch(/box-shadow|gradient\(|@tailwind|@apply/);
    }
  });

  it('keeps divider and line tokens at least as dark as 22% black on white', () => {
    const limit = luminance('#c7c7c7');
    for (const name of ['divider', 'line', 'line-hover', 'field-line']) {
      const value = themeCss.match(new RegExp(`--ws-color-${name}:\\s*(#[0-9a-f]{6})`))?.[1];
      expect(value, name).toBeDefined();
      expect(luminance(value as string), name).toBeLessThanOrEqual(limit);
    }
  });
});

describe('new kit props', () => {
  type Child = ReactElement<{ className?: string }>;

  function badgeChildren(tone: StatusTone, marker: 'dot' | 'icon'): Child[] {
    const element = StatusBadge({ tone, marker, children: 'x' });
    if (!isValidElement<{ children: Child[] }>(element)) throw new Error('StatusBadge did not return an element');
    return element.props.children;
  }

  it.each(['dot', 'icon'] as const)('StatusBadge %s: mark and label remount on a tone change and only then', (marker) => {
    const [markA, labelA] = badgeChildren('info', marker);
    const [markSame, labelSame] = badgeChildren('info', marker);
    const [markB, labelB] = badgeChildren('positive', marker);
    expect(markA.key).toBe(markSame.key);
    expect(labelA.key).toBe(labelSame.key);
    expect(markA.key).not.toBe(markB.key);
    expect(labelA.key).not.toBe(labelB.key);
  });

  it('Button: quiet keeps the busy contract', () => {
    const html = renderToStaticMarkup(createElement(Button, { variant: 'quiet', busy: true, children: 'Skip' }));
    expect(html).toContain('data-variant="quiet"');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('ws-button__spinner');
  });

  it('Button: no hover or active style applies while disabled or busy', () => {
    const selectors = parseCss(read('src/kit/button/button.css')).flatMap((rule) => splitSelectors(rule.prelude));
    const interactive = selectors.filter((selector) => /:hover|:active/.test(selector));
    expect(interactive.length).toBeGreaterThan(0);
    for (const selector of interactive) expect(selector).toContain(":not(:disabled):not([aria-busy='true'])");
  });

  it('EmptyState: compact keeps the alert role on critical', () => {
    const html = renderToStaticMarkup(createElement(EmptyState, { title: 'Failed', tone: 'critical', compact: true }));
    expect(html).toContain('role="alert"');
    expect(html).toContain('data-compact=""');
  });

  it('EmptyState: role={undefined} removes the alert, as the docs preview relies on', () => {
    const html = renderToStaticMarkup(createElement(EmptyState, { title: 'Failed', tone: 'critical', role: undefined }));
    expect(html).not.toContain('role=');
  });
});
