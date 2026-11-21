// Review: Home loads styleProfiles.ts on demand (src/pages/home/styleProfileLoader.ts).
// 1. Once the profiles load, the purpose block must match main (d12622b) exactly. The
//    fixture was rendered from a `git archive d12622b` snapshot with the same Home markup
//    extraction used below, for every purpose and every UI language.
//    Batch 4 rewrote the "good for" reasons (promptProfile.bestFor) of rebuilt styles, so the
//    rendered markup is pinned to homePurpose.feat-style-batch4.review.json, captured from this
//    branch with the same extraction. Every purpose must still resolve to main's shortlist ids,
//    order, productFit and caution ids, and the branch markup may differ from main's only in
//    those reason chips.
// 2. A failed import must leave Home usable, and the next request must import again.
// 3. The first-frame preload must cover a purpose from the URL or the saved draft and
//    must never reject (App.tsx puts it inside Home's lazy() promise).
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DesignDraft } from '../../src/visual/workspace';

type Purpose = DesignDraft['discovery']['purpose'];

type MainFixture = {
  discovery: Record<string, unknown>;
  markup: Record<'en' | 'ko' | 'ja', Record<string, string>>;
};
type Discovery = { entries: Array<{ styleId: string; productFit: string; reasons: string[] }>; cautions: Array<{ styleId: string }> };
const main = JSON.parse(readFileSync(new URL('./homePurpose.main-d12622b.review.json', import.meta.url), 'utf8')) as MainFixture;
// Batch 4: the markup is pinned to this branch; main's fixture stays the reference for the shortlist and cautions.
const branch = JSON.parse(readFileSync(new URL('./homePurpose.feat-style-batch4.review.json', import.meta.url), 'utf8')) as MainFixture;

/** What a purpose resolves to, without the reason chips: shortlist ids in order, their productFit, and caution ids. */
function shortlistIds(discovery: unknown) {
  const { entries, cautions, ...rest } = discovery as Discovery;
  return { ...rest, entries: entries.map(({ styleId, productFit }) => ({ styleId, productFit })), cautions: cautions.map(({ styleId }) => styleId) };
}
const LANGS = ['en', 'ko', 'ja'] as const;
const DRAFT_KEY = 'webstylebook.design-draft';

function purposeSection(html: string) {
  const start = html.indexOf('<div class="purpose-discovery"');
  const end = html.indexOf('<div class="filters home-filters"');
  if (start < 0 || end < 0) throw new Error('purpose section not found');
  return html.slice(start, end);
}

/** Main's markup with the results block removed: what a pending purpose should look like. */
function withoutResults(html: string) {
  return html
    .replace('data-purpose-status="shortlist"', 'data-purpose-status="pending"')
    .replace(/<div class="purpose-discovery__results">[\s\S]*<\/div><\/div>$/, '</div>');
}

beforeEach(() => {
  vi.resetModules();
});

afterEach(() => {
  vi.doUnmock('../../src/data/styleProfiles');
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('purpose discovery after the profiles load matches main (d12622b)', () => {
  it('resolves every purpose to the same shortlist and cautions', async () => {
    const { HOME_PURPOSE_IDS, resolvePurposeDiscovery } = await import('../../src/data/purposeDiscovery');
    const { getStyleProfile } = await import('../../src/data/styleProfiles');
    const ids = ['all', ...HOME_PURPOSE_IDS, 'mixed'];
    expect(Object.keys(main.discovery).sort()).toEqual([...ids].sort());
    expect(Object.keys(branch.discovery).sort()).toEqual([...ids].sort());
    for (const id of ids) {
      const resolved = resolvePurposeDiscovery(id, getStyleProfile);
      // Batch 4: shortlist ids, their order and productFit, and caution ids are still main's.
      expect(shortlistIds(resolved), id).toEqual(shortlistIds(main.discovery[id]));
      expect(resolved, id).toEqual(branch.discovery[id]);
    }
  });

  it('differs from main only in the reason chips Batch 4 rewrote', () => {
    for (const lang of LANGS) {
      expect(Object.keys(branch.markup[lang])).toEqual(Object.keys(main.markup[lang]));
      for (const id of Object.keys(main.markup[lang])) {
        let html = main.markup[lang][id];
        (main.discovery[id] as Discovery).entries.forEach((entry, index) => {
          html = html.replace(entry.reasons.join(' · '), (branch.discovery[id] as Discovery).entries[index]!.reasons.join(' · '));
        });
        expect(html, `${lang} ${id}`).toBe(branch.markup[lang][id]);
      }
    }
  });

  it('renders byte-identical purpose markup in en, ko and ja once loaded', async () => {
    const { Home } = await import('../../src/pages/Home');
    const { loadStyleProfiles } = await import('../../src/pages/home/styleProfileLoader');
    const { getDesignWorkspace } = await import('../../src/visual/useDesignWorkspace');
    await loadStyleProfiles();
    for (const lang of LANGS) {
      for (const id of Object.keys(branch.markup[lang]) as Purpose[]) {
        getDesignWorkspace().setDiscovery({ purpose: id });
        const html = purposeSection(renderToStaticMarkup(createElement(Home, { lang })));
        expect(html, `${lang} ${id}`).toBe(branch.markup[lang][id]);
      }
    }
  });

  it('before the profiles load, a chosen purpose renders main\'s markup minus the results block, marked busy', async () => {
    const { Home } = await import('../../src/pages/Home');
    const { HOME_PURPOSE_IDS } = await import('../../src/data/purposeDiscovery');
    const { getDesignWorkspace } = await import('../../src/visual/useDesignWorkspace');
    for (const lang of LANGS) {
      for (const id of HOME_PURPOSE_IDS) {
        getDesignWorkspace().setDiscovery({ purpose: id });
        const html = purposeSection(renderToStaticMarkup(createElement(Home, { lang })));
        expect(html, `${lang} ${id}`).toContain('data-purpose-status="pending" aria-busy="true"');
        expect(html.replace(' aria-busy="true"', ''), `${lang} ${id}`).toBe(withoutResults(main.markup[lang][id]));
      }
      // Browse and mixed never wait for the profiles.
      for (const id of ['all', 'mixed'] as const) {
        getDesignWorkspace().setDiscovery({ purpose: id });
        expect(purposeSection(renderToStaticMarkup(createElement(Home, { lang })))).toBe(main.markup[lang][id]);
      }
    }
  });
});

describe('styleProfileLoader failure and retry', () => {
  it('a failed import rejects and the next call imports again', async () => {
    let calls = 0;
    vi.doMock('../../src/data/styleProfiles', async (importOriginal) => {
      calls += 1;
      if (calls === 1) throw new Error('chunk failed');
      return importOriginal();
    });
    const loader = await import('../../src/pages/home/styleProfileLoader');
    await expect(loader.loadStyleProfiles()).rejects.toThrow();
    const lookup = await loader.loadStyleProfiles();
    expect(calls).toBe(2);
    expect(lookup('quiet-utility').promptProfile.bestFor.length).toBeGreaterThan(0);
  });

  it('requestStyleProfiles reports the failure once without an unhandled rejection', async () => {
    vi.doMock('../../src/data/styleProfiles', async () => { throw new Error('chunk failed'); });
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const unhandled = vi.fn();
    process.on('unhandledRejection', unhandled);
    try {
      const loader = await import('../../src/pages/home/styleProfileLoader');
      loader.requestStyleProfiles();
      await new Promise((resolve) => setTimeout(resolve, 20));
      expect(errors).toHaveBeenCalledTimes(1);
      expect(String(errors.mock.calls[0]![0])).toContain('Style profiles failed to load');
      expect(unhandled).not.toHaveBeenCalled();
    } finally {
      process.off('unhandledRejection', unhandled);
    }
  });

  it('subscribers re-render with the lookup after a retry succeeds', async () => {
    let calls = 0;
    vi.doMock('../../src/data/styleProfiles', async (importOriginal) => {
      calls += 1;
      if (calls === 1) throw new Error('chunk failed');
      return importOriginal();
    });
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { Home } = await import('../../src/pages/Home');
    const loader = await import('../../src/pages/home/styleProfileLoader');
    const { getDesignWorkspace } = await import('../../src/visual/useDesignWorkspace');
    getDesignWorkspace().setDiscovery({ purpose: 'campaign' });
    await expect(loader.loadStyleProfiles()).rejects.toThrow();
    expect(purposeSection(renderToStaticMarkup(createElement(Home, { lang: 'en' })))).toContain('data-purpose-status="pending"');
    await loader.loadStyleProfiles();
    // Batch 4: campaign's reason chips changed (see the header), so the loaded markup is the branch fixture's.
    expect(purposeSection(renderToStaticMarkup(createElement(Home, { lang: 'en' })))).toBe(branch.markup.en.campaign);
  });
});

describe('preloadInitialPurposeProfiles (App.tsx lazy Home)', () => {
  function memoryStorage(initial: Record<string, string> = {}) {
    const values = new Map(Object.entries(initial));
    return {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value); },
      removeItem: (key: string) => { values.delete(key); },
    };
  }

  function stubWindow(search: string, stored?: string) {
    vi.stubGlobal('window', {
      location: { search, pathname: '/', hash: '', origin: 'http://localhost' },
      localStorage: memoryStorage(stored ? { [DRAFT_KEY]: stored } : {}),
      addEventListener: () => {},
      removeEventListener: () => {},
    });
  }

  async function storedDraft(purpose: Purpose) {
    const { createDesignWorkspace } = await import('../../src/visual/workspace');
    const storage = memoryStorage();
    const store = createDesignWorkspace(storage);
    store.setDiscovery({ purpose });
    store.dispose?.();
    const raw = storage.getItem(DRAFT_KEY);
    expect(raw, 'workspace wrote a draft').toBeTruthy();
    return raw!;
  }

  it('loads the profiles for a purpose in the URL before Home renders', async () => {
    let calls = 0;
    vi.doMock('../../src/data/styleProfiles', async (importOriginal) => { calls += 1; return importOriginal(); });
    stubWindow('?purpose=commerce');
    const loader = await import('../../src/pages/home/styleProfileLoader');
    await loader.preloadInitialPurposeProfiles();
    expect(calls).toBe(1);
    // A second load reuses the settled import instead of importing again.
    await loader.loadStyleProfiles();
    expect(calls).toBe(1);
  });

  it('loads the profiles for a purpose restored from the saved draft', async () => {
    let calls = 0;
    vi.doMock('../../src/data/styleProfiles', async (importOriginal) => { calls += 1; return importOriginal(); });
    stubWindow('', await storedDraft('content-editorial'));
    const loader = await import('../../src/pages/home/styleProfileLoader');
    await loader.preloadInitialPurposeProfiles();
    expect(calls).toBe(1);
  });

  it('does not import the profiles for browse, mixed or an unknown purpose', async () => {
    let calls = 0;
    vi.doMock('../../src/data/styleProfiles', async (importOriginal) => { calls += 1; return importOriginal(); });
    for (const search of ['', '?purpose=all', '?purpose=mixed', '?purpose=spaceship']) {
      stubWindow(search);
      const loader = await import('../../src/pages/home/styleProfileLoader');
      await loader.preloadInitialPurposeProfiles();
    }
    expect(calls).toBe(0);
  });

  it('resolves (does not reject) when the import fails, so Home still opens', async () => {
    vi.doMock('../../src/data/styleProfiles', async () => { throw new Error('chunk failed'); });
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    stubWindow('?purpose=campaign');
    const loader = await import('../../src/pages/home/styleProfileLoader');
    await expect(loader.preloadInitialPurposeProfiles()).resolves.toBeUndefined();
    expect(errors).toHaveBeenCalledTimes(1);
  });
});
