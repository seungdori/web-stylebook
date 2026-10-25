import { describe, expect, it } from 'vitest';
import { homeRoute, styleRoutes, utilityRoutes } from '../../src/data/routes';
import { originalStyleFonts, routeFontQueries } from '../../src/data/routeFontManifest';
import { styleCatalog } from '../../src/data/styles';
import { getRouteFontFamilies, getRouteFontStylesheet } from '../../src/utils/routeFonts';
import { PRETENDARD_STYLESHEET } from '../../src/visual/fontSources';

describe('route font loading', () => {
  it('loads only the site shell on initial English navigation', () => {
    expect(getRouteFontFamilies(homeRoute, 'en')).toEqual(['Inter', 'Space Grotesk', 'IBM Plex Mono']);
  });

  it('sets Korean chrome Hangul-first in Pretendard with separate Latin display and mono faces', () => {
    expect(getRouteFontFamilies(homeRoute, 'ko')).toEqual(['Space Grotesk', 'IBM Plex Mono', 'Pretendard Variable']);
    expect(getRouteFontFamilies(homeRoute, 'ko')).not.toContain('IBM Plex Sans KR');
    expect(getRouteFontStylesheet('Pretendard Variable')).toBe(PRETENDARD_STYLESHEET);
  });

  it('keeps the Korean faces a style preview was authored against', () => {
    const brutalist = styleRoutes.find((route) => route.styleId === 'brutalist-grid')!;
    const korean = getRouteFontFamilies(brutalist, 'ko');
    expect(korean).toEqual(expect.arrayContaining(['Inter', 'IBM Plex Sans KR', 'Noto Sans KR', 'Pretendard Variable', 'Archivo Black']));
    expect(getRouteFontFamilies(brutalist, 'en')).not.toContain('Pretendard Variable');
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
    expect(getRouteFontFamilies(compare, 'en')).toEqual(['Inter', 'Space Grotesk']);
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
