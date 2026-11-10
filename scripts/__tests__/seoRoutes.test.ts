import { PNG } from 'pngjs';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { buildRouteSeo, ogCardSpecs, routeLastModified } from '../lib/seo.ts';
import { notFoundCopy } from '../../src/data/notFound.ts';
import { buildSitemapXml } from '../lib/sitemap.ts';
import { localize, type Lang } from '../../src/data/styles.ts';
import {
  filePathForPublicPath,
  localizedPath,
  publicRoutes,
  referenceIdFromPath,
  routeToFilePath,
} from '../../src/data/routes.ts';
import { resolvePublicRequest } from '../../src/data/publicPath.ts';
import { applySeo } from '../../src/utils/seo.ts';
import { renderOgCard } from '../../scripts/generate-og.mjs';

const langs: Lang[] = ['en', 'ko', 'ja'];
let documentRoot: TestElement | undefined;
afterEach(() => {
  vi.unstubAllGlobals();
  documentRoot = undefined;
});
const button = publicRoutes.find((route) => route.path === '/pages/components/button');
const brutal = publicRoutes.find((route) => route.styleId === 'brutalist-grid');
const home = publicRoutes.find((route) => route.path === '/');

if (!button || !brutal || !home) throw new Error('expected home, brutalist, and button routes');

describe('public files match extensionless canonical URLs', () => {
  it('writes every non-home route as a flat html file', () => {
    expect(routeToFilePath(button, 'en')).toBe('pages/components/button.html');
    expect(routeToFilePath(button, 'ko')).toBe('ko/pages/components/button.html');
    expect(routeToFilePath(brutal, 'en')).toBe('pages/brutalist-grid.html');
    expect(routeToFilePath(home, 'ko')).toBe('ko/index.html');
    expect(routeToFilePath(home, 'ja')).toBe('ja/index.html');
    expect(routeToFilePath(home, 'en')).toBe('index.html');
    for (const route of publicRoutes) {
      for (const lang of langs) {
        const file = routeToFilePath(route, lang);
        const path = localizedPath(route.path, lang);
        if (path === '/' || path === '/ko/' || path === '/ja/') {
          expect(file.endsWith('/index.html') || file === 'index.html').toBe(true);
        } else {
          expect(file.endsWith('/index.html')).toBe(false);
          expect(file.endsWith('.html')).toBe(true);
        }
      }
    }
  });
});

describe('one redirect reaches the canonical path', () => {
  const cases: Array<[string, string, string?]> = [
    ['/pages/components/button', '/pages/components/button'],
    ['/pages/components/button/', '/pages/components/button'],
    ['/pages/components/button/index.html', '/pages/components/button'],
    ['/pages/components/button/index', '/pages/components/button'],
    ['/pages/components/button.html', '/pages/components/button'],
    ['/ko/pages/components/button/', '/ko/pages/components/button'],
    ['/ja/pages/brutalist-grid.html', '/ja/pages/brutalist-grid'],
    ['/pages/brutalist-grid/', '/pages/brutalist-grid'],
    ['/references', '/pages/reference-explorer'],
    ['/references.html', '/pages/reference-explorer'],
    ['/ko/references/', '/ko/pages/reference-explorer'],
    ['/typography/', '/pages/typography'],
    ['/ja/typography', '/ja/pages/typography'],
    ['/components/', '/pages/components'],
    ['/pro-kit', '/pages/pro-kit'],
    ['/pro-kit.html', '/pages/pro-kit'],
    ['/ko/pro-kit/', '/ko/pages/pro-kit'],
    ['/en/pages/compare', '/pages/compare'],
    ['/en/', '/'],
    ['/index.html', '/'],
    ['/ko', '/ko/'],
    ['/ko/', '/ko/'],
    ['/ko/index.html', '/ko/'],
    ['/ja/index', '/ja/'],
    ['/social-card.jpg', '/og/default.png'],
  ];

  it.each(cases)('%s resolves to %s', (input, expected) => {
    const resolved = resolvePublicRequest(input, '');
    if (input === expected) {
      expect(resolved).toEqual({ kind: 'page', file: filePathForPublicPath(expected) });
      return;
    }
    expect(resolved).toEqual({ kind: 'redirect', pathname: expected, search: '' });
    const again = resolvePublicRequest(expected, '');
    expect(again.kind).toBe('page');
  });

  it('moves a lang query onto the path in the same redirect', () => {
    expect(resolvePublicRequest('/pages/compare/', '?lang=ja&dense=1')).toEqual({
      kind: 'redirect',
      pathname: '/ja/pages/compare',
      search: '?dense=1',
    });
  });

  it('leaves unknown URLs and static assets alone', () => {
    expect(resolvePublicRequest('/missing-page/', '')).toEqual({ kind: 'pass' });
    expect(resolvePublicRequest('/pages/references/aeon/', '')).toEqual({ kind: 'pass' });
    expect(resolvePublicRequest('/assets/app.js', '')).toEqual({ kind: 'pass' });
    expect(resolvePublicRequest('/previews/brutalist-grid.html', '')).toEqual({ kind: 'pass' });
    expect(referenceIdFromPath('/pages/references/nope/../aeon')).toBeNull();
    expect(referenceIdFromPath('/ko/pages/references/aeon/')).toBe('aeon');
  });
});

describe('localized titles and descriptions', () => {
  it('adds a Korean and Japanese descriptor to style and component titles', () => {
    for (const route of publicRoutes) {
      const styleTitle = Boolean(route.styleId);
      const componentTitle = route.path.startsWith('/pages/components/') && !route.path.endsWith('/getting-started');
      if (!styleTitle && !componentTitle) continue;
      const en = buildRouteSeo(route, 'en').title;
      const ko = buildRouteSeo(route, 'ko').title;
      const ja = buildRouteSeo(route, 'ja').title;
      expect(ko).not.toBe(en);
      expect(ja).not.toBe(en);
      expect(ko).not.toBe(ja);
      if (styleTitle) {
        expect(ko).toContain('스타일');
        expect(ja).toContain('スタイル');
      }
      if (componentTitle) {
        expect(ko).toContain('컴포넌트');
        expect(ja).toContain('コンポーネント');
      }
    }
  });

  it('keeps every indexable description in the 110 to 160 character range', () => {
    const offenders: string[] = [];
    for (const route of publicRoutes) {
      for (const lang of langs) {
        const description = buildRouteSeo(route, lang).description;
        if (description.length < 110 || description.length > 160) {
          offenders.push(`${lang} ${route.path} (${description.length}) ${description}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it('uses the style summary, not only the short tagline', () => {
    const description = buildRouteSeo(brutal, 'en').description;
    expect(description.startsWith('High-contrast boxes')).toBe(true);
    expect(description.length).toBeGreaterThanOrEqual(110);
  });
});

describe('structured data and sitemap stability', () => {
  it('gives each language its own WebSite node and description', () => {
    const ko = graph(buildRouteSeo(home, 'ko').jsonLd, 'WebSite');
    const en = graph(buildRouteSeo(home, 'en').jsonLd, 'WebSite');
    expect(ko['@id']).toBe('https://webstylebook.com/ko/#website');
    expect(en['@id']).toBe('https://webstylebook.com/#website');
    expect(ko.inLanguage).toBe('ko-KR');
    expect(String(ko.description)).toContain('디자인');
    expect(String(ko.description)).not.toContain('Explore');
    expect(ko.url).toBe('https://webstylebook.com/ko/');
  });

  it('derives lastmod from authored dates', () => {
    expect(routeLastModified(brutal)).toBe('2026-03-05');
    const xml = buildSitemapXml();
    expect(xml).not.toContain(`<lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>`);
    expect(xml).toContain('<loc>https://webstylebook.com/pages/brutalist-grid</loc>');
    expect(xml).toContain('<lastmod>2026-03-05</lastmod>');
    expect(xml).not.toContain('/pages/references/aeon');
    expect(xml).toContain('hreflang="x-default" href="https://webstylebook.com/"');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    expect(locs).toHaveLength(publicRoutes.length * langs.length);
    for (const loc of locs) {
      const path = new URL(loc).pathname;
      if (path !== '/' && path !== '/ko/' && path !== '/ja/') expect(path.endsWith('/')).toBe(false);
    }
  });

  it('points sharing tags at a 1200 by 630 card for that page', () => {
    const seo = buildRouteSeo(brutal, 'ko');
    expect(seo.image).toMatchObject({
      url: 'https://webstylebook.com/og/styles/brutalist-grid.png',
      width: 1200,
      height: 630,
      type: 'image/png',
    });
    expect(seo.image.alt.ko).toContain('Brutalist Grid');
    expect(seo.image.alt.ko).not.toBe(seo.image.alt.en);
    const specs = ogCardSpecs();
    const card = renderOgCard(specs.find((spec) => spec.file === '/og/styles/brutalist-grid.png')!);
    expect(card.equals(renderOgCard(specs.find((spec) => spec.file === '/og/styles/brutalist-grid.png')!))).toBe(true);
    const png = PNG.sync.read(card);
    expect(png.width).toBe(1200);
    expect(png.height).toBe(630);
  });
});

describe('static HTML metadata during client navigation', () => {
  const documentHtml = (path: string, lang: Lang) => {
    const route = publicRoutes.find((item) => item.path === path)!;
    const seo = buildRouteSeo(route, lang);
    return `<html lang="${lang}"><head>
      <title>${seo.title}</title>
      <meta name="description" content="${seo.description}">
      <meta name="robots" content="index, follow">
      <meta property="og:locale" content="${seo.locale}">
      <meta property="og:image" content="${seo.image.url}">
      <meta name="twitter:title" content="${seo.title}">
      <link rel="canonical" href="${seo.canonicalUrl}">
      <link rel="alternate" hreflang="en" href="${seo.alternates.en}">
      <script type="application/ld+json">${JSON.stringify(seo.jsonLd)}</script>
      <script src="/assets/app.js"></script>
    </head></html>`;
  };

  it('uses the initial static head without fetching it again', async () => {
    installDocument(documentHtml('/', 'ko'));
    const fetch = vi.fn();
    vi.stubGlobal('fetch', fetch);
    await applySeo('/ko/', 'ko');
    expect(fetch).not.toHaveBeenCalled();
    expect(document.title).toBe(buildRouteSeo(home, 'ko').title);
  });

  it('copies destination metadata for language and route changes, retaining app scripts', async () => {
    installDocument(documentHtml('/', 'en'));
    const fetch = vi.fn(async (path: string) => new Response(documentHtml(path.includes('button') ? button.path : '/', 'ko')));
    vi.stubGlobal('fetch', fetch);
    for (const route of [home, button]) {
      await applySeo(route.path, 'ko');
      const seo = buildRouteSeo(route, 'ko');
      expect(document.title).toBe(seo.title);
      expect(document.documentElement.lang).toBe('ko');
      expect(document.head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(seo.description);
      expect(document.head.querySelector('meta[property="og:locale"]')?.getAttribute('content')).toBe('ko_KR');
      expect(document.head.querySelector('meta[property="og:image"]')?.getAttribute('content')).toBe(seo.image.url);
      expect(document.head.querySelector('meta[name="twitter:title"]')?.getAttribute('content')).toBe(seo.title);
      expect(document.head.querySelector('link[rel="alternate"]')?.getAttribute('href')).toBe(seo.alternates.en);
      expect(document.head.querySelector('script[type="application/ld+json"]')?.textContent).toBe(JSON.stringify(seo.jsonLd));
      expect(document.head.querySelectorAll('script[src]')).toHaveLength(1);
      expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    }
    expect(fetch.mock.calls.map(([path]) => path)).toEqual(['/ko/', '/ko/pages/components/button']);
  });

  it('ignores an obsolete response after a newer navigation', async () => {
    installDocument(documentHtml('/', 'en'));
    let resolveOld!: (value: Response) => void;
    vi.stubGlobal('fetch', vi.fn()
      .mockImplementationOnce(() => new Promise<Response>((resolve) => { resolveOld = resolve; }))
      .mockResolvedValueOnce(new Response(documentHtml('/', 'ja'))));
    const controller = new AbortController();
    const old = applySeo('/', 'ko', controller.signal);
    controller.abort();
    await applySeo('/', 'ja');
    resolveOld(new Response(documentHtml('/', 'ko')));
    await old;
    expect(document.title).toBe(buildRouteSeo(home, 'ja').title);
    expect(document.documentElement.lang).toBe('ja');
  });

  it('rejects fallback HTML and failed requests without importing their tags', async () => {
    installDocument(documentHtml('/', 'en'));
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(new Response(documentHtml('/', 'en')))
      .mockResolvedValueOnce(new Response('Unavailable', { status: 503 })));
    await applySeo('/', 'ko');
    await applySeo('/', 'ko');
    expect(document.title).toBe(buildRouteSeo(home, 'en').title);
    expect(warn).toHaveBeenCalledTimes(2);
    warn.mockRestore();
  });
});

describe('not-found head', () => {
  it('drops canonical, sharing tags, hreflang, and JSON-LD', () => {
    installDocument(`
      <html lang="en"><head>
        <title>Home</title>
        <meta name="description" content="Explore authored design directions">
        <meta property="og:url" content="https://webstylebook.com/">
        <meta property="og:title" content="Home">
        <meta name="twitter:card" content="summary_large_image">
        <link rel="canonical" href="https://webstylebook.com/">
        <link rel="alternate" hreflang="en" href="https://webstylebook.com/">
        <link rel="alternate" hreflang="x-default" href="https://webstylebook.com/">
        <script type="application/ld+json">{"@type":"WebSite"}</script>
      </head><body></body></html>
    `);
    applySeo('/ko/missing', 'ko');
    expect(document.title).toBe(localize(notFoundCopy.documentTitle, 'ko'));
    expect(document.documentElement.lang).toBe('ko');
    expect(document.head.querySelector('link[rel="canonical"]')).toBeNull();
    expect(document.head.querySelector('meta[property="og:url"]')).toBeNull();
    expect(document.head.querySelector('meta[name="twitter:card"]')).toBeNull();
    expect(document.head.querySelector('link[rel="alternate"]')).toBeNull();
    expect(document.head.querySelector('script[type="application/ld+json"]')).toBeNull();
    expect(document.head.querySelector('meta[name="description"]')?.getAttribute('content')).not.toContain('Explore');
    expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex, follow');
  });
});

function graph(data: Record<string, unknown>, type: string) {
  const nodes = (data['@graph'] as Array<Record<string, unknown>>) ?? [];
  const node = nodes.find((item) => item['@type'] === type);
  if (!node) throw new Error(`missing ${type}`);
  return node;
}

function makeDocument(html: string) {
  const root = parseElement(html);
  const documentElement = root.query('html') ?? root;
  const head = documentElement.query('head') ?? documentElement;
  return {
    get title() { return head.query('title')?.textContent ?? ''; },
    set title(value: string) {
      const title = head.query('title') ?? head.appendChild(makeElement('title'));
      title.textContent = value;
    },
    documentElement,
    head,
    createElement: makeElement,
    importNode(node: TestElement): TestElement {
      const copy = makeElement(node.tag);
      copy.attrs = { ...node.attrs };
      copy.textContent = node.textContent;
      copy.children = node.children.map((child) => this.importNode(child));
      return copy;
    },
  };
}

function installDocument(html: string) {
  const store = makeDocument(html);
  documentRoot = store.documentElement;
  vi.stubGlobal('document', store);
  vi.stubGlobal('DOMParser', class {
    parseFromString(source: string) { return makeDocument(source); }
  });
}

function parseElement(html: string) {
  const root = makeElement('root');
  const stack = [root];
  const pattern = /<!--[\s\S]*?-->|<\/([a-z0-9]+)>|<([a-z0-9]+)([^>]*)>|([^<]+)/gi;
  for (const match of html.matchAll(pattern)) {
    if (match[0].startsWith('<!--')) continue;
    if (match[1]) {
      while (stack.length > 1 && stack[stack.length - 1].tag !== match[1].toLowerCase()) stack.pop();
      if (stack.length > 1) stack.pop();
      continue;
    }
    if (match[2]) {
      const node = makeElement(match[2].toLowerCase());
      for (const attr of match[3].matchAll(/([:\w-]+)="([^"]*)"/g)) node.attrs[attr[1]] = attr[2];
      stack[stack.length - 1].children.push(node);
      if (!match[3].trim().endsWith('/') && !['meta', 'link'].includes(node.tag)) stack.push(node);
      continue;
    }
    if (match[4]?.trim()) stack[stack.length - 1].textContent += match[4].trim();
  }
  return root;
}

interface TestElement {
  tag: string;
  lang: string;
  attrs: Record<string, string>;
  children: TestElement[];
  textContent: string;
  dataset: Record<string, string>;
  setAttribute(name: string, value: string): void;
  getAttribute(name: string): string | null;
  hasAttribute(name: string): boolean;
  appendChild(child: TestElement): TestElement;
  remove(): void;
  query(selector: string): TestElement | null;
  querySelector(selector: string): TestElement | null;
  querySelectorAll(selector: string): TestElement[];
}

function makeElement(tag: string): TestElement {
  const node: TestElement = {
    tag,
    get lang() { return node.attrs.lang ?? ''; },
    set lang(value: string) { node.attrs.lang = value; },
    attrs: {} as Record<string, string>,
    children: [] as Array<ReturnType<typeof makeElement>>,
    textContent: '',
    get dataset() {
      return new Proxy({}, {
        set: (_target, key, value) => {
          node.attrs[`data-${String(key).replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`] = String(value);
          return true;
        },
      });
    },
    setAttribute(name: string, value: string) {
      node.attrs[name] = value;
    },
    getAttribute(name: string) {
      return node.attrs[name] ?? null;
    },
    hasAttribute(name: string) {
      return name in node.attrs;
    },
    appendChild(child: ReturnType<typeof makeElement>) {
      node.children.push(child);
      return child;
    },
    remove() {
      for (const parent of walk(rootish())) {
        parent.children = parent.children.filter((child) => child !== node);
      }
    },
    query(selector: string) {
      return walk(node).find((item) => matches(item, selector)) ?? null;
    },
    querySelector(selector: string) {
      return node.query(selector);
    },
    querySelectorAll(selector: string) {
      return walk(node).filter((item) => matches(item, selector));
    },
  };
  return node;
}

function rootish() {
  return documentRoot ?? makeElement('html');
}

function walk(node: ReturnType<typeof makeElement>): Array<ReturnType<typeof makeElement>> {
  return [node, ...node.children.flatMap((child) => walk(child))];
}

function matches(node: ReturnType<typeof makeElement>, selector: string): boolean {
  if (selector.includes(',')) return selector.split(',').some((part) => matches(node, part));
  const tag = selector.split('[')[0];
  if (tag && tag !== node.tag) return false;
  return [...selector.matchAll(/\[([\w:-]+)(?:(\^?=)"([^"]*)")?\]/g)].every(([, name, operator, value]) => {
    if (!operator) return node.hasAttribute(name);
    return operator === '^=' ? node.attrs[name]?.startsWith(value) : node.attrs[name] === value;
  });
}
