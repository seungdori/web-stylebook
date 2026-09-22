import { describe, expect, it } from 'vitest';
import { homeRoute, styleRoutes } from '../../src/data/routes';
import { originalStyleFonts, routeFontQueries } from '../../src/data/routeFontManifest';
import { styleCatalog } from '../../src/data/styles';
import { getRouteFontFamilies, getRouteFontStylesheet } from '../../src/utils/routeFonts';

describe('route font loading', () => {
  it('loads only the site shell on initial English navigation', () => {
    expect(getRouteFontFamilies(homeRoute, 'en')).toEqual(['Inter', 'Space Grotesk', 'IBM Plex Mono']);
    expect(getRouteFontFamilies(homeRoute, 'ko')).toEqual([
      'Inter', 'Space Grotesk', 'IBM Plex Mono', 'IBM Plex Sans KR', 'Noto Sans KR',
    ]);
  });

  it('preserves the original demo font for every catalog style', () => {
    expect(Object.keys(originalStyleFonts).sort()).toEqual(styleCatalog.map((style) => style.id).sort());
    for (const families of Object.values(originalStyleFonts)) {
      for (const family of families) expect(routeFontQueries).toHaveProperty(family);
    }
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
