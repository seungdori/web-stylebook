import { describe, expect, it, vi } from 'vitest';
import { homeRoute, styleRoutes, utilityRoutes } from '../../src/data/routes';
import { originalStyleFonts, routeFontQueries } from '../../src/data/routeFontManifest';
import { styleCatalog } from '../../src/data/styles';
import { getRouteFontFamilies, getRouteFontStylesheet } from '../../src/utils/routeFonts';
import { PRETENDARD_STYLESHEET, WANTED_SANS_STYLESHEET } from '../../src/visual/fontSources';

// The hook runs here without a DOM: React's useEffect is replaced so its effects can be
// called by hand, and the stylesheet loader records the URLs it is asked for.
const effects: Array<() => void | (() => void)> = [];
const requested: string[] = [];

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  return {
    ...actual,
    useEffect: (effect: () => void | (() => void)) => {
      effects.push(effect);
    },
  };
});

vi.mock('../../src/visual/fontLoader', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../src/visual/fontLoader')>();
  return {
    ...actual,
    loadFontStylesheet: (url: string) => {
      requested.push(url);
      return Promise.resolve();
    },
  };
});

// Renamed so the lint rule for hooks does not read the direct call below as a hook call.
const { useRouteFonts: runRouteFonts } = await import('../../src/utils/routeFonts');

describe('route font loading', () => {
  it('loads only the site shell on initial English navigation', () => {
    expect(getRouteFontFamilies(homeRoute, 'en')).toEqual(['Wanted Sans Variable', 'IBM Plex Mono']);
  });

  it('requests the shell faces on the home page and nothing later, since the cards set their names in the shell face', () => {
    effects.length = 0;
    requested.length = 0;
    runRouteFonts(homeRoute, 'en');
    // One effect: the route's families. No observer loads card title faces afterwards.
    expect(effects).toHaveLength(1);
    for (const effect of effects) effect();
    expect(requested).toEqual(getRouteFontFamilies(homeRoute, 'en').map((family) => getRouteFontStylesheet(family)));
  });

  it('sets the shell in Wanted Sans in every language, with IBM Plex Mono for code', () => {
    expect(getRouteFontFamilies(homeRoute, 'ko')).toEqual(['Wanted Sans Variable', 'IBM Plex Mono']);
    expect(getRouteFontFamilies(homeRoute, 'ja')).toEqual(['Wanted Sans Variable', 'IBM Plex Mono']);
    for (const lang of ['en', 'ko', 'ja'] as const) {
      expect(getRouteFontFamilies(homeRoute, lang)).not.toContain('Inter');
      expect(getRouteFontFamilies(homeRoute, lang)).not.toContain('Space Grotesk');
      expect(getRouteFontFamilies(homeRoute, lang)).not.toContain('Pretendard Variable');
    }
    expect(getRouteFontStylesheet('Wanted Sans Variable')).toBe(WANTED_SANS_STYLESHEET);
    expect(getRouteFontStylesheet('Pretendard Variable')).toBe(PRETENDARD_STYLESHEET);
  });

  it('keeps the faces a style preview was authored against and adds the shell face for the strip above it', () => {
    const brutalist = styleRoutes.find((route) => route.styleId === 'brutalist-grid')!;
    const korean = getRouteFontFamilies(brutalist, 'ko');
    expect(korean).toEqual(expect.arrayContaining(['Wanted Sans Variable', 'Inter', 'Space Grotesk', 'IBM Plex Mono', 'IBM Plex Sans KR', 'Noto Sans KR', 'Pretendard Variable', 'Archivo Black']));
    expect(getRouteFontFamilies(brutalist, 'en')).toEqual(expect.arrayContaining(['Wanted Sans Variable', 'Inter', 'Space Grotesk', 'IBM Plex Mono']));
    expect(getRouteFontFamilies(brutalist, 'en')).not.toContain('Pretendard Variable');
  });

  it('keeps Inter, and Pretendard in Korean, for the kit components on component pages', () => {
    const components = utilityRoutes.find((route) => route.path === '/pages/components')!;
    expect(getRouteFontFamilies(components, 'en')).toEqual(['Wanted Sans Variable', 'IBM Plex Mono', 'Inter']);
    expect(getRouteFontFamilies(components, 'ko')).toEqual(['Wanted Sans Variable', 'IBM Plex Mono', 'Inter', 'Pretendard Variable']);
  });

  it('preserves the original demo font for every catalog style', () => {
    expect(Object.keys(originalStyleFonts).sort()).toEqual(styleCatalog.map((style) => style.id).sort());
    for (const families of Object.values(originalStyleFonts)) {
      for (const family of families) expect(routeFontQueries).toHaveProperty(family);
    }
  });

  it('does not request IBM Plex Mono for routes that do not paint it', () => {
    const compare = utilityRoutes.find((route) => route.path === '/pages/compare')!;
    const prompt = utilityRoutes.find((route) => route.path === '/pages/prompt-workflow')!;
    expect(getRouteFontFamilies(compare, 'en')).toEqual(['Wanted Sans Variable']);
    expect(getRouteFontFamilies(prompt, 'ko')).not.toContain('IBM Plex Mono');
    expect(getRouteFontFamilies(homeRoute, 'en')).toContain('IBM Plex Mono');
  });

  it('loads the active original demo without unrelated catalog fonts', () => {
    const brutalist = styleRoutes.find((route) => route.styleId === 'brutalist-grid')!;
    const editorial = styleRoutes.find((route) => route.styleId === 'editorial-silence')!;
    expect(getRouteFontFamilies(brutalist, 'en')).toContain('Archivo Black');
    expect(getRouteFontFamilies(brutalist, 'en')).not.toContain('Noto Serif JP');
    expect(getRouteFontFamilies(editorial, 'ja')).toContain('Noto Serif JP');
    expect(getRouteFontFamilies(editorial, 'ja')).not.toContain('Archivo Black');
  });

  it('uses a single known family per nonblocking external stylesheet', () => {
    expect(new URL(WANTED_SANS_STYLESHEET).hostname).toBe('cdn.jsdelivr.net');
    expect(WANTED_SANS_STYLESHEET).toContain('@v1.0.3/');
    for (const family of Object.keys(routeFontQueries)) {
      const url = new URL(getRouteFontStylesheet(family)!);
      expect(url.hostname).toBe('fonts.googleapis.com');
      expect(url.searchParams.getAll('family')).toHaveLength(1);
      expect(url.searchParams.get('display')).toBe('swap');
    }
    expect(getRouteFontStylesheet('unconfigured font')).toBeUndefined();
    expect(getRouteFontStylesheet('Space Grotesk')).not.toContain('900');
    expect(getRouteFontStylesheet('Plus Jakarta Sans')).not.toContain('900');
  });
});
