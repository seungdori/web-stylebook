import { afterEach, describe, expect, it, vi } from 'vitest';
import { activeFontStylesheet, createFontLoader, getActiveSpecimenFonts, initialFontStatus, loadFontStylesheet, scriptForLocale } from '../../src/visual/fontLoader';
import { FONT_LICENSES } from '../../src/visual/fontSources';
import type { FontMetadata, ResolvedVisualContract, TypographyRole, VisualLocale } from '../../src/visual/types';

const font: FontMetadata = {
  family: 'Inter',
  source: 'external',
  stylesheetUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Nunito:wght@400;700&display=swap',
  ...FONT_LICENSES.Inter,
  weights: [400, 700],
  scripts: ['latin'],
  fallback: 'system-ui, sans-serif',
  availability: 'requires-load',
};

describe('active font loading', () => {
  it('requests only the active family and keeps its authored axes', () => {
    const selected = new URL(activeFontStylesheet(font)!);
    expect(selected.searchParams.getAll('family')).toEqual(['Inter:wght@400;700']);
    expect(selected.searchParams.get('display')).toBe('swap');
    expect(activeFontStylesheet({ ...font, family: 'Nunito', ...FONT_LICENSES.Nunito })).toContain('Nunito');
  });

  it('does not treat claimed licenses, arbitrary providers or unrelated family URLs as approved', () => {
    expect(activeFontStylesheet({ ...font, license: 'See upstream license' })).toBeUndefined();
    expect(activeFontStylesheet({ ...font, stylesheetUrl: 'https://example.com/fonts.css' })).toBeUndefined();
    expect(activeFontStylesheet({ ...font, stylesheetUrl: 'https://fonts.googleapis.com.evil.test/css2?family=Inter' })).toBeUndefined();
    expect(activeFontStylesheet({ ...font, stylesheetUrl: 'https://fonts.googleapis.com/css2?family=Poppins' })).toBeUndefined();
    expect(activeFontStylesheet({ ...font, stylesheetUrl: 'https://fonts.googleapis.com/css2?family=Unverified+Face' })).toBeUndefined();
    expect(activeFontStylesheet({ ...font, source: 'user' })).toBeUndefined();
  });

  it('reports system and unverified fallbacks without requesting an unrelated font', async () => {
    const loadStylesheet = vi.fn(async () => undefined);
    const loadFace = vi.fn<(descriptor: string, sample: string) => Promise<boolean>>().mockResolvedValue(true);
    const load = createFontLoader({ loadStylesheet, loadFace });
    expect((await load({ ...font, source: 'system' }, 'en')).reason).toBe('system-dependent');
    expect((await load({ ...font, source: 'user' }, 'ko')).reason).toBe('unverified-source');
    expect(loadStylesheet).not.toHaveBeenCalled();
    expect(loadFace).not.toHaveBeenCalled();
    expect(scriptForLocale('ko-KR')).toBe('hangul');
    expect(scriptForLocale('ja-JP')).toBe('japanese');
    expect(initialFontStatus(font, 'en').status).toBe('loading');
  });

  it('loads a Latin primary for mixed CJK text without claiming CJK script readiness', async () => {
    const loadStylesheet = vi.fn(async () => undefined);
    const loadFace = vi.fn<(descriptor: string, sample: string) => Promise<boolean>>().mockResolvedValue(true);
    const load = createFontLoader({ loadStylesheet, loadFace });
    expect(await load({ ...font, scripts: ['latin', 'hangul', 'japanese'] }, 'ko')).toMatchObject({ status: 'fallback', reason: 'script-not-covered', script: 'hangul', loadedScript: 'latin' });
    expect(loadStylesheet).toHaveBeenCalledTimes(1);
    expect(loadFace.mock.calls[0][1]).toBe('Hamburgefontsiv0123456789');
  });

  it('waits for each requested weight and shares successful/in-flight face requests', async () => {
    const loadFace = vi.fn<(descriptor: string, sample: string) => Promise<boolean>>().mockResolvedValue(true);
    const load = createFontLoader({ loadStylesheet: async () => undefined, loadFace });
    const [first, concurrent] = await Promise.all([load(font, 'en'), load(font, 'en')]);
    expect(first).toMatchObject({ status: 'ready', reason: 'font-face-ready' });
    expect(concurrent.status).toBe('ready');
    expect(loadFace).toHaveBeenCalledTimes(2);
    expect(loadFace.mock.calls.map(([descriptor]) => descriptor)).toEqual(['400 16px "Inter"', '700 16px "Inter"']);
    await load(font, 'en');
    expect(loadFace).toHaveBeenCalledTimes(2);
  });

  it('uses a content-script probe and treats missing faces honestly', async () => {
    const loadFace = vi.fn<(descriptor: string, sample: string) => Promise<boolean>>().mockResolvedValue(false);
    const load = createFontLoader({ loadStylesheet: async () => undefined, loadFace });
    const korean: FontMetadata = { ...font, family: 'Noto Sans KR', ...FONT_LICENSES['Noto Sans KR'], stylesheetUrl: 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400', scripts: ['latin', 'hangul'], weights: [400] };
    expect((await load(korean, 'ko')).reason).toBe('font-face-unavailable');
    expect(loadFace.mock.calls[0][1]).toContain('한글');
    expect(loadFace.mock.calls[0][1]).not.toMatch(/[A-Za-z0-9]/);
    expect((await createFontLoader({ loadStylesheet: async () => undefined })(font, 'en')).reason).toBe('font-api-unavailable');
  });

  it('reports failures and permits a later explicit re-selection to retry', async () => {
    const loadFace = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue(true);
    const load = createFontLoader({ loadStylesheet: async () => undefined, loadFace });
    const singleWeight = { ...font, weights: [400] };
    expect((await load(singleWeight, 'en')).status).toBe('error');
    expect((await load(singleWeight, 'en')).status).toBe('ready');
    expect(loadFace).toHaveBeenCalledTimes(2);
    const stylesheetFailure = createFontLoader({ loadStylesheet: async () => { throw new Error('timeout'); }, loadFace });
    expect((await stylesheetFailure(singleWeight, 'en')).reason).toBe('load-failed');
  });
});

const koreanFont: FontMetadata = { ...font, family: 'Noto Sans KR', ...FONT_LICENSES['Noto Sans KR'], stylesheetUrl: 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap', scripts: ['latin', 'hangul'] };
const japaneseFont: FontMetadata = { ...font, family: 'Noto Sans JP', ...FONT_LICENSES['Noto Sans JP'], stylesheetUrl: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap', scripts: ['latin', 'japanese'] };

function specimenSpec(stack: string, fonts: FontMetadata[], contentLocale: VisualLocale): Pick<ResolvedVisualContract, 'typography' | 'contentLocale'> {
  const role: TypographyRole = { fontFamily: stack, fontWeight: 400, fontStyle: 'normal', sizeMinRem: 1, sizeMaxRem: 1, lineHeight: 1.6, letterSpacingEm: 0, paragraphSpacingEm: 1, measureCh: 68, textTransform: 'none', wordBreak: 'normal', overflowWrap: 'anywhere', fontVariantNumeric: 'normal' };
  return { contentLocale, typography: { fonts, roles: { display: role, heading: role, subheading: role, body: role, small: role, label: role, caption: role, data: role } } };
}

describe('specimen font selection', () => {
  it('excludes stale catalog entries after a role font override', () => {
    const poppins: FontMetadata = { ...font, family: 'Poppins', ...FONT_LICENSES.Poppins, stylesheetUrl: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap' };
    const active = getActiveSpecimenFonts(specimenSpec('"Poppins", system-ui, sans-serif', [font, koreanFont, japaneseFont, poppins], 'en'));
    expect(active.map((entry) => entry.family)).toEqual(['Poppins']);
  });

  it('selects the first supported family separately for Latin and the content script', () => {
    const stack = '"Inter", "Noto Sans KR", "Noto Sans JP", sans-serif';
    const metadata = [font, koreanFont, japaneseFont];
    expect(getActiveSpecimenFonts(specimenSpec(stack, metadata, 'en')).map((entry) => entry.family)).toEqual(['Inter']);
    expect(getActiveSpecimenFonts(specimenSpec(stack, metadata, 'ko')).map((entry) => entry.family)).toEqual(['Inter', 'Noto Sans KR']);
    expect(getActiveSpecimenFonts(specimenSpec(stack, metadata, 'ja')).map((entry) => entry.family)).toEqual(['Inter', 'Noto Sans JP']);
  });

  it('stops at system fallback and ignores forged primary-script metadata', () => {
    const metadata = [{ ...font, scripts: ['latin', 'hangul', 'japanese'] as FontMetadata['scripts'] }, koreanFont, japaneseFont];
    expect(getActiveSpecimenFonts(specimenSpec('Inter, system-ui, "Noto Sans KR", sans-serif', metadata, 'ko')).map((entry) => entry.family)).toEqual(['Inter', 'system-ui']);
    expect(getActiveSpecimenFonts(specimenSpec('Inter, "Noto Sans KR", sans-serif', metadata, 'ko')).map((entry) => entry.family)).toEqual(['Inter', 'Noto Sans KR']);
  });

  it('keeps the status of an unverified chosen family without downloading stale metadata', () => {
    const active = getActiveSpecimenFonts(specimenSpec('"My local font", sans-serif', [font, koreanFont, japaneseFont], 'ko'));
    expect(active.map((entry) => [entry.family, entry.source])).toEqual([['My local font', 'user'], ['sans-serif', 'system']]);
  });
});

function stylesheetDocument() {
  const links: ReturnType<typeof createLink>[] = [];
  const createLink = () => {
    const listeners = new Map<string, () => void>();
    const link = {
      href: '', rel: '', dataset: {} as Record<string, string>, sheet: null,
      addEventListener: (event: string, listener: () => void) => listeners.set(event, listener),
      removeEventListener: (event: string) => listeners.delete(event),
      remove: () => { links.splice(links.indexOf(link), 1); },
      dispatch: (event: string) => listeners.get(event)?.(),
    };
    return link;
  };
  const appendChild = vi.fn((link: ReturnType<typeof createLink>) => { links.push(link); });
  return { links, appendChild, document: { querySelectorAll: () => links, createElement: createLink, head: { appendChild } } };
}

describe('shared stylesheet resources', () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.useRealTimers(); });

  it('shares one normalized link across active specimens and authored routes', async () => {
    const browser = stylesheetDocument();
    vi.stubGlobal('document', browser.document);
    const first = loadFontStylesheet('https://fonts.googleapis.com/css2?family=Inter:wght@300&display=swap');
    const second = loadFontStylesheet('https://fonts.googleapis.com/css2?display=swap&family=Inter:wght@300');
    expect(first).toBe(second);
    expect(browser.appendChild).toHaveBeenCalledTimes(1);
    browser.links[0].dispatch('load');
    await first;
    expect(loadFontStylesheet('https://fonts.googleapis.com/css2?family=Inter:wght@300&display=swap')).toBe(first);
    expect(browser.links[0].dataset.fontState).toBe('ready');
  });

  it('removes a failed owned link and permits a later retry', async () => {
    const browser = stylesheetDocument();
    vi.stubGlobal('document', browser.document);
    const url = 'https://fonts.googleapis.com/css2?family=Nunito:wght@500&display=swap';
    const first = loadFontStylesheet(url);
    const failure = expect(first).rejects.toThrow('stylesheet failed');
    browser.links[0].dispatch('error');
    await failure;
    expect(browser.links).toHaveLength(0);
    const retry = loadFontStylesheet(url);
    browser.links[0].dispatch('load');
    await retry;
    expect(browser.appendChild).toHaveBeenCalledTimes(2);
  });

  it('times out instead of leaving a specimen permanently loading', async () => {
    vi.useFakeTimers();
    const browser = stylesheetDocument();
    vi.stubGlobal('document', browser.document);
    const first = loadFontStylesheet('https://fonts.googleapis.com/css2?family=Oswald:wght@600&display=swap');
    const failure = expect(first).rejects.toThrow('timed out');
    await vi.advanceTimersByTimeAsync(12_000);
    await failure;
    expect(browser.links).toHaveLength(0);
  });
});
