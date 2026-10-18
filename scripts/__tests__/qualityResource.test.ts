import { describe, expect, it, vi } from 'vitest';
import { originalStyleFonts } from '../../src/data/routeFontManifest';
import { createFontLoader, getActiveSpecimenFonts } from '../../src/visual/fontLoader';
import { exportResolvedSpec, resolveSelectedSpec } from '../../src/visual/resolvedSpec';
import { classifyResource, resourceGuardViolations, type ResourcePhase } from '../quality-resource.mts';

const catalogFamilies = [...new Set(Object.values(originalStyleFonts).flat())];

describe('local edit resource guard', () => {
  it('separates a first font load from warm edits and rejects catalog, reference, and model calls', () => {
    const limits = { catalogFamilyCount: catalogFamilies.length, firstUseFamilies: ['Inter'] };
    expect(classifyResource('https://fonts.googleapis.com/css2?family=Inter')).toBe('font');
    expect(classifyResource('https://fonts.gstatic.com/s/inter/v1/inter.woff2')).toBe('font');
    expect(classifyResource('https://api.openai.com/v1/chat/completions')).toBe('model');
    expect(classifyResource('https://api.anthropic.com/v1/messages')).toBe('model');
    expect(classifyResource('/reference-library.v1.json')).toBe('reference');
    expect(classifyResource('/agent-handoff.full.json')).toBe('catalog');
    expect(resourceGuardViolations([{ phase: 'first-use', url: 'https://fonts.googleapis.com/css2?family=Inter' }], limits)).toEqual([]);
    expect(resourceGuardViolations([{ phase: 'warm-edit', url: 'https://fonts.gstatic.com/s/inter/v1/inter.woff2' }], limits).join('\n')).toContain('warm-edit repeated font download');
    expect(resourceGuardViolations([
      { phase: 'first-use', url: 'https://fonts.googleapis.com/css2?family=Inter' },
      { phase: 'first-use', url: 'https://fonts.googleapis.com/css2?family=Inter' },
    ], limits).join('\n')).toContain('repeated first-use font download');
    expect(resourceGuardViolations([{ phase: 'warm-export', url: 'https://api.openai.com/v1/chat/completions' }], limits).join('\n')).toContain('model call');
    expect(resourceGuardViolations([{ phase: 'warm-axis', url: '/reference-library.v1.json' }], limits).join('\n')).toContain('reference fetch');
    expect(resourceGuardViolations([{ phase: 'first-use', url: '/agent-handoff.full.json' }], limits).join('\n')).toContain('catalog fetch');
    expect(resourceGuardViolations([], { catalogFamilyCount: 2, firstUseFamilies: ['Inter', 'Archivo Black'] }).join('\n')).toContain('first-use loaded 2 font families');
  });

  it('downloads the selected specimen fonts once, then skips them for a color edit, density switch, export, and a repeated axis', async () => {
    const events: Array<{ phase: ResourcePhase; url: string }> = [];
    let phase: ResourcePhase = 'first-use';
    const loadStylesheet = vi.fn(async (url: string) => { events.push({ phase, url }); });
    const load = createFontLoader({ loadStylesheet, loadFace: async () => true });
    const originalFetch = globalThis.fetch;
    globalThis.fetch = () => Promise.reject(new Error('local token edit must not fetch'));
    try {
      const authored = resolveSelectedSpec('brutalist-grid', { contentLocale: 'en' });
      const families = getActiveSpecimenFonts(authored).map((font) => font.family);
      expect(families).toEqual(['Archivo Black', 'IBM Plex Mono']);
      expect(families.length).toBeLessThan(catalogFamilies.length);
      for (const font of getActiveSpecimenFonts(authored)) await load(font, 'en');
      expect(exportResolvedSpec(authored, 'css')).toContain('--color-text: #111;');
      expect(exportResolvedSpec(authored, 'json')).toContain('"text": "#111"');
      const firstUseCalls = loadStylesheet.mock.calls.length;
      expect(firstUseCalls).toBe(families.length);

      phase = 'warm-edit';
      const edited = resolveSelectedSpec('brutalist-grid', { contentLocale: 'en', overrides: { colors: { text: '#243447' } } });
      expect(getActiveSpecimenFonts(edited).map((font) => font.family)).toEqual(families);
      for (const font of getActiveSpecimenFonts(edited)) await load(font, 'en');
      expect(exportResolvedSpec(edited, 'json')).toContain('"text": "#243447"');

      phase = 'warm-axis';
      const density = resolveSelectedSpec('brutalist-grid', { contentLocale: 'en', overrides: { density: 'compact' } });
      expect(getActiveSpecimenFonts(density).map((font) => font.family)).toEqual(families);
      for (const font of getActiveSpecimenFonts(density)) await load(font, 'en');

      phase = 'warm-export';
      expect(exportResolvedSpec(density, 'css')).toContain('--density-row: 32px;');
      expect(loadStylesheet).toHaveBeenCalledTimes(firstUseCalls);

      phase = 'first-use';
      const editorial = resolveSelectedSpec('editorial-silence', { contentLocale: 'en' });
      const editorialFamilies = getActiveSpecimenFonts(editorial).map((font) => font.family);
      expect(editorialFamilies).toContain('Noto Serif KR');
      expect(editorialFamilies).not.toEqual(families);
      for (const font of getActiveSpecimenFonts(editorial)) await load(font, 'en');
      expect(loadStylesheet.mock.calls.length).toBeGreaterThan(firstUseCalls);
      const afterNewFamily = loadStylesheet.mock.calls.length;
      phase = 'warm-axis';
      for (const font of getActiveSpecimenFonts(editorial)) await load(font, 'en');
      expect(loadStylesheet).toHaveBeenCalledTimes(afterNewFamily);
      expect(loadStylesheet.mock.calls.map(([url]) => url).join('\n')).not.toContain('Jersey+20');
      expect(resourceGuardViolations(events, { catalogFamilyCount: catalogFamilies.length, firstUseFamilies: [...new Set([...families, ...editorialFamilies])] })).toEqual([]);
      expect(events.filter((event) => event.phase !== 'first-use')).toEqual([]);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it('reports an offline font as an error and still exports the authored none and zero tokens', async () => {
    const load = createFontLoader({
      loadStylesheet: async () => { throw new Error('offline'); },
      loadFace: async () => true,
    });
    const spec = resolveSelectedSpec('brutalist-grid', { contentLocale: 'en' });
    const face = getActiveSpecimenFonts(spec)[0];
    await expect(load(face, 'en')).resolves.toMatchObject({ status: 'error', reason: 'load-failed', family: face.family });
    const css = exportResolvedSpec(spec, 'css');
    expect(css).toContain('--color-text: #111;');
    expect(css).toContain('--shadow-sm: none;');
    expect(css).toContain('--radius-sm: 0px;');
    expect(css).toContain('--motion-duration: 0ms;');
    expect(css).toContain('--type-body-letter-spacing: 0em;');
    expect(css).not.toContain('0 1px 2px rgba(0,0,0,0.06)');
  });
});
