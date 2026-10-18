import { describe, expect, it, vi } from 'vitest';
import { translate } from '../../src/data/i18n';
import { createPairedScrollLock, normalizeRegions, paneScrollBehavior, pairedScrollTop, regionAnchor, scrollDeltaForKey, type FixtureRegion, type PaneSnapshot } from '../../src/visual/pairedScroll';
import { assessTypographyGate, fontFamilyDelta, gateFonts, type GateFont } from '../../src/visual/typographyGate';
import { createFontLoader, fontFaceDescriptor, fontProbeSample, getActiveSpecimenFonts } from '../../src/visual/fontLoader';
import { resolveVisualContract } from '../../src/visual';
import { resolveAxisComparison } from '../../src/visual/comparison';
import type { ActiveFontStatus } from '../../src/visual/fontLoader';

const sourceRegions: FixtureRegion[] = [
  { id: 'hero', start: 0, end: 100 },
  { id: 'section', start: 100, end: 400 },
  { id: 'footer', start: 400, end: 500 },
];
const targetRegions: FixtureRegion[] = [
  { id: 'hero', start: 0, end: 300 },
  { id: 'section', start: 300, end: 450 },
  { id: 'footer', start: 450, end: 700 },
];

function pane(scrollTop: number, regions: FixtureRegion[], maxScroll = 900, clientHeight = 320): PaneSnapshot {
  return { scrollTop, maxScroll, clientHeight, regions };
}

describe('paired fixture scrolling', () => {
  it('follows the same region progress when the panes have different heights', () => {
    expect(regionAnchor(sourceRegions, 250)).toEqual({ id: 'section', progress: 0.5 });
    expect(pairedScrollTop(sourceRegions, 250, targetRegions, 900)).toBe(375);
    expect(pairedScrollTop(sourceRegions, 250, targetRegions, 900)).not.toBe(250);
    expect(pairedScrollTop(targetRegions, 375, sourceRegions, 900)).toBe(250);
    expect(pairedScrollTop(sourceRegions, 0, targetRegions, 900)).toBe(0);
    expect(pairedScrollTop(sourceRegions, 400, targetRegions, 40)).toBe(40);
  });

  it('does not copy a pixel offset when the target is missing that region', () => {
    expect(pairedScrollTop(sourceRegions, 250, [{ id: 'hero', start: 0, end: 80 }], 400)).toBeNull();
    expect(normalizeRegions([{ id: '', start: 0, end: 10 }, { id: 'footer', start: 20, end: 20 }, { id: 'hero', start: 4, end: 9 }])).toEqual([{ id: 'hero', start: 4, end: 9 }]);
  });

  it('keeps programmatic sync instant and lets an unpaired reduced-motion pane stay instant', () => {
    expect(paneScrollBehavior(true, false)).toBe('auto');
    expect(paneScrollBehavior(false, true)).toBe('auto');
    expect(paneScrollBehavior(false, false)).toBe('smooth');
  });

  it('maps keyboard keys onto the focused pane without using modifier shortcuts', () => {
    const metrics = { scrollTop: 80, clientHeight: 200, scrollHeight: 900 };
    expect(scrollDeltaForKey('ArrowDown', {}, metrics)).toBe(48);
    expect(scrollDeltaForKey('PageDown', {}, metrics)).toBe(152);
    expect(scrollDeltaForKey(' ', { shift: true }, metrics)).toBe(-152);
    expect(scrollDeltaForKey('Home', {}, metrics)).toBe(-80);
    expect(scrollDeltaForKey('End', {}, metrics)).toBe(820);
    expect(scrollDeltaForKey('ArrowDown', { alt: true }, metrics)).toBeNull();
    expect(scrollDeltaForKey('ArrowDown', { ctrl: true }, metrics)).toBeNull();
    expect(scrollDeltaForKey('ArrowDown', { meta: true }, metrics)).toBeNull();
    expect(scrollDeltaForKey('Tab', {}, metrics)).toBeNull();
  });

  it('ignores the scroll echoed by the pane it just moved, including a later key press', () => {
    const lock = createPairedScrollLock();
    const panes = {
      left: pane(0, sourceRegions, 500),
      right: pane(0, targetRegions, 800),
    };
    const writes: string[] = [];
    function scroll(id: 'left' | 'right', top: number) {
      panes[id].scrollTop = top;
      const other = id === 'left' ? 'right' : 'left';
      const write = lock.follow(id, panes[id], other, panes[other], true);
      if (!write) return;
      writes.push(`${id}->${other}:${write.scrollTop}`);
      expect(write.behavior).toBe('auto');
      panes[other].scrollTop = write.scrollTop;
      scroll(other, panes[other].scrollTop);
    }
    scroll('left', 250);
    expect(writes).toEqual(['left->right:375']);
    expect(panes.left.scrollTop).toBe(250);
    scroll('left', 100);
    expect(panes.left.scrollTop).toBe(100);
    expect(panes.right.scrollTop).toBe(300);
    expect(lock.follow('left', panes.left, 'right', { ...panes.right, clientHeight: 0 }, true)).toBeNull();
    panes.left.scrollTop = 40;
    expect(lock.follow('left', panes.left, 'right', panes.right, false)).toBeNull();
    expect(lock.follow('left', panes.left, 'right', panes.right, true)?.scrollTop).toBe(120);
  });
});

function gateFont(patch: Partial<GateFont> = {}): GateFont {
  return { family: 'Inter', status: 'ready', reason: 'font-face-ready', loadedScript: 'latin', weights: [400], script: 'latin', ...patch };
}

describe('typography comparison font gate', () => {
  it('stays pending until both panes have left the loading state', () => {
    const confirm = vi.fn(() => true);
    expect(assessTypographyGate([[gateFont({ status: 'loading', reason: 'pending' })], [gateFont()]], confirm)).toEqual({ state: 'pending', failedFamilies: [] });
    expect(assessTypographyGate([[], [gateFont()]], confirm).state).toBe('pending');
    expect(confirm).not.toHaveBeenCalled();
  });

  it('fails instead of passing when FontFaceSet cannot confirm the faces', () => {
    const faces = [gateFont(), gateFont({ family: 'Source Serif', weights: [400, 700] })];
    expect(assessTypographyGate([faces, [gateFont({ family: 'IBM Plex Mono' })]], null)).toMatchObject({ state: 'failed' });
    const rejected = assessTypographyGate([[gateFont()], [gateFont({ family: 'IBM Plex Mono' })]], () => false);
    expect(rejected).toEqual({ state: 'failed', failedFamilies: ['Inter', 'IBM Plex Mono'] });
    expect(assessTypographyGate([[gateFont({ status: 'error', reason: 'load-failed' })], [gateFont()]], () => true)).toEqual({ state: 'failed', failedFamilies: ['Inter'] });
    expect(assessTypographyGate([[gateFont({ status: 'fallback', reason: 'font-api-unavailable', loadedScript: undefined })], [gateFont()]], () => true).state).toBe('failed');
    expect(assessTypographyGate([[gateFont({ status: 'fallback', reason: 'script-not-covered', loadedScript: undefined })], [gateFont()]], () => true).state).toBe('failed');
  });

  it('reports ready only after every settled face passes the same FontFaceSet probe the loader uses', () => {
    const seen: string[] = [];
    const gate = assessTypographyGate([
      [gateFont({ family: 'Noto Sans KR', script: 'hangul', loadedScript: 'hangul' })],
      [gateFont({ status: 'fallback', reason: 'system-dependent', loadedScript: undefined, family: 'system-ui', script: 'hangul' })],
    ], (descriptor, sample) => {
      seen.push(`${descriptor}:${sample}`);
      return true;
    });
    expect(gate).toEqual({ state: 'ready', failedFamilies: [] });
    expect(seen).toEqual([
      `${fontFaceDescriptor('Noto Sans KR', 400)}:${fontProbeSample('hangul')}`,
      `${fontFaceDescriptor('system-ui', 400)}:${fontProbeSample('latin')}`,
    ]);
  });

  it('accepts a Latin face that loaded for a CJK comparison only when that loaded script checks out', () => {
    const partial = gateFont({ status: 'fallback', reason: 'script-not-covered', loadedScript: 'latin', script: 'hangul' });
    expect(assessTypographyGate([[partial], [gateFont()]], (_descriptor, sample) => sample === fontProbeSample('latin')).state).toBe('ready');
  });

  it('asks for no new families when color or density changes, and does not reload the families that stay', async () => {
    const baseline = resolveVisualContract('brutalist-grid');
    const source = resolveVisualContract('editorial-silence');
    const families = (spec: Parameters<typeof getActiveSpecimenFonts>[0]) => getActiveSpecimenFonts(spec).map((font) => font.family);
    const base = families(baseline);
    expect(fontFamilyDelta(base, families(resolveAxisComparison(baseline, source, 'color'))).added).toEqual([]);
    expect(fontFamilyDelta(base, families(resolveAxisComparison(baseline, source, 'density'))).added).toEqual([]);
    const added = fontFamilyDelta(base, families(resolveAxisComparison(baseline, source, 'typography'))).added;
    expect(added.length).toBeGreaterThan(0);
    expect(added.every((family) => !base.includes(family))).toBe(true);

    const loadStylesheet = vi.fn<(url: string) => Promise<void>>(async () => undefined);
    const loadFace = vi.fn<(descriptor: string, sample: string) => Promise<boolean>>(async () => true);
    const load = createFontLoader({ loadStylesheet, loadFace });
    for (const font of getActiveSpecimenFonts(baseline)) await load(font, 'en');
    const faceCalls = loadFace.mock.calls.length;
    const sheetCalls = loadStylesheet.mock.calls.length;
    for (const font of getActiveSpecimenFonts(resolveAxisComparison(baseline, source, 'color'))) await load(font, 'en');
    for (const font of getActiveSpecimenFonts(resolveAxisComparison(baseline, source, 'density'))) await load(font, 'en');
    expect(loadFace).toHaveBeenCalledTimes(faceCalls);
    expect(loadStylesheet).toHaveBeenCalledTimes(sheetCalls);
    for (const font of getActiveSpecimenFonts(resolveAxisComparison(baseline, source, 'typography'))) await load(font, 'en');
    const fresh = loadFace.mock.calls.slice(faceCalls).map((call) => call[0]);
    expect(fresh.length).toBeGreaterThan(0);
    expect(fresh.every((descriptor) => added.some((family) => descriptor.includes(`"${family}"`)))).toBe(true);
    expect(fresh.some((descriptor) => base.some((family) => descriptor.includes(`"${family}"`)))).toBe(false);
  });

  it('pairs loader status with the requested families without treating a missing status as ready', () => {
    const status: ActiveFontStatus = { family: 'Inter', status: 'ready', reason: 'font-face-ready', script: 'latin', source: 'external', fallback: 'sans-serif', license: 'OFL' };
    const [font] = gateFonts([{ family: 'Inter', source: 'external', license: 'OFL', weights: [400, 700], scripts: ['latin'], fallback: 'sans-serif', availability: 'requires-load' }], [status], 'latin');
    expect(font.weights).toEqual([400, 700]);
    expect(gateFonts([{ ...{ family: 'Missing', source: 'external', license: 'OFL', weights: [], scripts: ['latin'], fallback: 'sans-serif', availability: 'requires-load' } }], [], 'latin')[0]).toMatchObject({ status: 'loading', reason: 'pending' });
  });
});

describe('comparison copy', () => {
  it('ships the scroll and font-gate strings in English, Korean, and Japanese', () => {
    expect(translate('en', 'compare.pairScroll')).toBe('Pair scrolling');
    expect(translate('ko', 'compare.pairScroll')).toBe('스크롤 맞추기');
    expect(translate('ja', 'compare.pairScroll')).toBe('スクロールを揃える');
    expect(translate('en', 'compare.fontsPending')).toContain('not a typography result');
    expect(translate('ko', 'compare.fontsPending')).toContain('타이포그래피 결과');
    expect(translate('ja', 'compare.fontsFailed')).toContain('タイポグラフィの結果');
    expect(translate('ko', 'compare.pairScrollOriginal')).toContain('원본');
    expect(translate('ja', 'compare.paneScroll').length).toBeGreaterThan(0);
  });
});
