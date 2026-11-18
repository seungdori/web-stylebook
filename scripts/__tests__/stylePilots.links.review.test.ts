// Reviewer test for the shared click handler of style pages (usePortedPageEffects).
// The three rebuilt pages are built on in-page links: the nav, the hero buttons,
// "Try the timer", "Get the reservation email". In a browser, on /ko and /ja, each
// of those links reloads the page and leaves the visitor at the top with the page
// state reset, because the handler adds ?lang= to the link before the browser
// follows it. English routes are unaffected.
// The hook runs here without a DOM: React's useEffect is replaced so the effects
// can be called by hand against small stand-ins for the root, the link and window.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Lang } from '../../src/data/styles';

const effects: Array<() => void | (() => void)> = [];

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return {
    ...actual,
    useEffect: (effect: () => void | (() => void)) => {
      effects.push(effect);
    },
    useCallback: <T,>(callback: T) => callback,
  };
});

// Renamed so the lint rule for hooks does not read the direct call below as a hook call.
const { usePortedPageEffects: runPageEffects } = await import('../../src/ported/usePortedPageEffects');

function fakeRoot() {
  const listeners = new Map<string, (event: unknown) => void>();
  return {
    listeners,
    lang: '',
    dataset: {} as Record<string, string>,
    classList: { toggle: () => false, contains: () => false },
    querySelector: () => null,
    querySelectorAll: () => [],
    getAttribute: () => null,
    setAttribute: () => undefined,
    removeAttribute: () => undefined,
    addEventListener: (type: string, listener: (event: unknown) => void) => listeners.set(type, listener),
    removeEventListener: () => undefined,
  };
}

/** Clicks a link with the given href on a style page at `pageUrl`, and returns where the link points afterwards. */
function clickLink(pageUrl: string, lang: Lang, href: string): URL {
  const location = new URL(pageUrl);
  const frame = { location };
  vi.stubGlobal('window', Object.assign(frame, { self: frame, top: frame }));
  vi.stubGlobal('MouseEvent', class {});

  const root = fakeRoot();
  effects.length = 0;
  runPageEffects({ current: root as unknown as HTMLElement }, lang);
  for (const effect of effects) effect();

  // An anchor's href property reads back as an absolute URL.
  const link = { href: new URL(href, pageUrl).href };
  const click = root.listeners.get('click');
  if (!click) throw new Error('The hook registered no click handler');
  click({
    target: { closest: (selector: string) => (selector === 'a[href]' ? link : null) },
    defaultPrevented: false,
    preventDefault: () => undefined,
  });
  return new URL(link.href, pageUrl);
}

const sameDocument = (next: URL, pageUrl: string) => {
  const page = new URL(pageUrl);
  return next.origin === page.origin && next.pathname === page.pathname && next.search === page.search;
};

describe('in-page links on a style page', () => {
  beforeEach(() => {
    effects.length = 0;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('stay in the same document in English', () => {
    const page = 'http://localhost/pages/runtime-signal';
    const next = clickLink(page, 'en', '#plans');
    expect(sameDocument(next, page)).toBe(true);
    expect(next.hash).toBe('#plans');
  });

  // FAIL in round two: the link becomes /ko/pages/…?lang=ko#plans, a different URL, so the browser
  // loads the page again instead of scrolling to the target.
  it.each([
    ['ko', 'http://localhost/ko/pages/runtime-signal', '#plans'],
    ['ja', 'http://localhost/ja/pages/runtime-signal', '#how'],
    ['ko', 'http://localhost/ko/pages/holographic-fluid', '#hf-notify'],
    ['ja', 'http://localhost/ja/pages/fusion-holo-glass', '#hg-timer'],
  ] as Array<[Lang, string, string]>)('stay in the same document in %s (%s %s)', (lang, page, href) => {
    const next = clickLink(page, lang, href);
    expect(next.hash).toBe(href);
    expect(sameDocument(next, page), `the link now points at ${next.pathname}${next.search}${next.hash}`).toBe(true);
  });

  it('links to another page still carry the language', () => {
    const next = clickLink('http://localhost/ko/pages/runtime-signal', 'ko', '/pages/holographic-fluid.html');
    expect(next.pathname).toBe('/pages/holographic-fluid.html');
    expect(next.searchParams.get('lang') === 'ko' || next.pathname.startsWith('/ko/')).toBe(true);
  });

  it('links to another site are left alone', () => {
    const next = clickLink('http://localhost/ko/pages/runtime-signal', 'ko', 'https://example.com/docs#x');
    expect(next.href).toBe('https://example.com/docs#x');
  });
});

// Round three. The language menu builds the new URL from the path, so it can leave a
// localized route. In a browser this was checked from en, ko and ja on Runtime Signal,
// Platform Core, Holographic Fluid and Grain x Mono.
function chooseLanguage(pageUrl: string, lang: Lang, next: string) {
  const location = new URL(pageUrl);
  const pushed: string[] = [];
  const stored = new Map<string, string>();
  let popped = 0;
  const frame = {
    location,
    history: { pushState: (_state: unknown, _title: string, target: string) => pushed.push(target) },
    localStorage: { setItem: (key: string, value: string) => stored.set(key, value), getItem: (key: string) => stored.get(key) ?? null },
    dispatchEvent: () => {
      popped += 1;
      return true;
    },
  };
  vi.stubGlobal('window', Object.assign(frame, { self: frame, top: frame }));
  vi.stubGlobal('MouseEvent', class {});
  vi.stubGlobal('PopStateEvent', class {});

  const root = fakeRoot();
  effects.length = 0;
  runPageEffects({ current: root as unknown as HTMLElement }, lang);
  for (const effect of effects) effect();

  const button = { dataset: { langSelect: next }, closest: () => ({ classList: { remove: () => undefined } }) };
  const click = root.listeners.get('click');
  if (!click) throw new Error('The hook registered no click handler');
  click({
    target: { closest: (selector: string) => (selector === '[data-lang-select]' ? button : null) },
    defaultPrevented: false,
    preventDefault: () => undefined,
  });
  return { pushed, stored: stored.get('webstylebook.lang'), popped };
}

describe('the language menu on a style page', () => {
  beforeEach(() => {
    effects.length = 0;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each([
    ['ko', 'http://localhost/ko/pages/runtime-signal', 'en', '/pages/runtime-signal'],
    ['ja', 'http://localhost/ja/pages/runtime-signal', 'ko', '/ko/pages/runtime-signal'],
    ['en', 'http://localhost/pages/fusion-holo-glass#hg-timer', 'ja', '/ja/pages/fusion-holo-glass#hg-timer'],
    ['ja', 'http://localhost/ja/pages/holographic-fluid.html?lang=ja', 'en', '/pages/holographic-fluid.html'],
    ['ko', 'http://localhost/pages/platform-core?lang=ko&view=a', 'ja', '/ja/pages/platform-core?view=a'],
  ] as Array<[Lang, string, string, string]>)('from %s at %s to %s goes to %s', (lang, page, next, expected) => {
    const result = chooseLanguage(page, lang, next);
    expect(result.pushed).toEqual([expected]);
    expect(result.stored).toBe(next);
    expect(result.popped).toBe(1);
  });

  it('ignores a value that is not a language', () => {
    const result = chooseLanguage('http://localhost/ko/pages/runtime-signal', 'ko', 'xx');
    expect(result.pushed).toEqual([]);
    expect(result.stored).toBeUndefined();
    expect(result.popped).toBe(0);
  });
});
