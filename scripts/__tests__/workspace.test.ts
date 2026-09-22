import { describe, expect, it, vi } from 'vitest';
import { createDesignWorkspace, createInitialDraft, DESIGN_DRAFT_RECOVERY_KEY, DESIGN_DRAFT_STORAGE_KEY, draftResolutionOptions, parseComparisonQuery, parseDesignDraft } from '../../src/visual/workspace';
import { getVisualContract, proposeContrastRepairs, resolveVisualContract } from '../../src/visual';
import { findRoute, localizedPath } from '../../src/data/routes';

function memoryStorage(initial?: string) {
  const values = new Map<string, string>();
  if (initial) values.set(DESIGN_DRAFT_STORAGE_KEY, initial);
  return { values, getItem: (key: string) => values.get(key) ?? null, setItem: vi.fn((key: string, value: string) => { values.set(key, value); }) };
}

describe('working design continuity', () => {
  it('restores a selected design, edits, one applied axis, custom copy, and brief across full navigation', () => {
    const storage = memoryStorage();
    const store = createDesignWorkspace(storage, { deferWrites: true });
    store.selectStyle('editorial-silence');
    store.setColorRole('text', '#172031');
    store.setTypographyRole('body', { lineHeight: 1.8, letterSpacingEm: 0 });
    store.setContentLocale('ko');
    store.setPreviewCopy({ heading: '새로운 디자인', body: 'Private client copy stays local.' });
    store.setProjectContext({ name: 'Client project', sectionInstructions: { qa: { mode: 'manual', notes: 'Verify the saved form.' } } });
    store.setComparison({ left: 'brutalist-grid', right: 'glass-orbit', mode: 'axis', axis: 'density' });
    store.applyAxis('density', 'brutalist-grid');
    // A click/locale switch/export flush happens before the 150 ms batch delay.
    expect(store.flush()).toBe(true);
    const restored = createDesignWorkspace(storage);
    expect(restored.getSnapshot().draft).toEqual(store.getSnapshot().draft);
    const result = resolveVisualContract(restored.getSnapshot().draft.styleId, draftResolutionOptions(restored.getSnapshot().draft));
    expect(result.colors.text).toBe('#172031');
    expect(result.typography.roles.body.lineHeight).toBe(1.8);
    expect(result.typography.roles.body.letterSpacingEm).toBe(0);
    expect(result.spacing).toEqual(resolveVisualContract('brutalist-grid').spacing);
    expect(result.contentLocale).toBe('ko');
    expect(storage.getItem(DESIGN_DRAFT_STORAGE_KEY)?.length).toBeLessThan(20_000);
    store.dispose(); restored.dispose();
  });

  it('batches transient writes but preserves the last committed value on immediate flush', () => {
    vi.useFakeTimers();
    const storage = memoryStorage();
    const store = createDesignWorkspace(storage, { deferWrites: true });
    for (const lineHeight of [1.4, 1.5, 1.6, 1.7]) store.setTypographyRole('body', { lineHeight });
    expect(storage.setItem).not.toHaveBeenCalled();
    store.flush();
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    expect(createDesignWorkspace(storage).getSnapshot().draft.overrides.typography?.body?.lineHeight).toBe(1.7);
    vi.advanceTimersByTime(500);
    expect(storage.setItem).toHaveBeenCalledTimes(1);
    store.dispose(); vi.useRealTimers();
  });

  it('comparison links preserve the working design until a choice is explicitly applied', () => {
    const store = createDesignWorkspace(memoryStorage());
    store.setColorRole('accent', '#123456');
    store.setComparison({ left: 'editorial-silence', right: 'glass-orbit', mode: 'original' });
    expect(store.getSnapshot().draft.styleId).toBe('brutalist-grid');
    expect(store.getSnapshot().draft.overrides.colors?.accent).toBe('#123456');
    expect(store.requestStyleSelection('editorial-silence')).toBe(false);
    expect(store.getSnapshot().pendingStyleId).toBe('editorial-silence');
    expect(store.getSnapshot().draft.overrides.colors?.accent).toBe('#123456');
    store.confirmStyleSelection();
    expect(store.getSnapshot().draft.styleId).toBe('editorial-silence');
    expect(store.getSnapshot().draft.overrides).toEqual({});
    store.undo();
    expect(store.getSnapshot().draft.styleId).toBe('brutalist-grid');
    expect(store.getSnapshot().draft.overrides.colors?.accent).toBe('#123456');
  });

  it('preserves all legacy linked style IDs as references without silently combining visual systems', () => {
    const store = createDesignWorkspace(memoryStorage());
    store.setColorRole('text', '#123456');
    expect(store.requestStylePreset('editorial-silence,glass-orbit,quiet-utility')).toBe(false);
    expect(store.getSnapshot().draft.referencedStyleIds).toEqual([]);
    expect(store.getSnapshot().draft.overrides.colors?.text).toBe('#123456');
    store.confirmStyleSelection();
    expect(store.getSnapshot().draft.styleId).toBe('editorial-silence');
    expect(store.getSnapshot().draft.referencedStyleIds).toEqual(['editorial-silence', 'glass-orbit', 'quiet-utility']);
    expect(store.getSnapshot().draft.comparison.right).toBe('glass-orbit');
    expect(store.getSnapshot().draft.overrides).toEqual({});
  });

  it('clears editor buffers only on explicit replacement, not each accepted keystroke', () => {
    const store = createDesignWorkspace(memoryStorage());
    store.setColorRole('text', '#123456');
    store.setColorRole('text', '#123457');
    expect(store.getSnapshot().resetEpoch).toBe(0);
    store.undo();
    expect(store.getSnapshot().resetEpoch).toBe(1);
    store.resetAxis('color');
    expect(store.getSnapshot().resetEpoch).toBe(2);
  });

  it('restores legacy comparison URLs in original mode without replacing edited design values', () => {
    const store = createDesignWorkspace(memoryStorage());
    store.setColorRole('text', '#123456');
    store.setComparison({ mode: 'axis', right: 'quiet-utility' });
    expect(store.requestComparisonSelection('?left=terminal-core&right=editorial-silence')).toBe(true);
    expect(store.getSnapshot().draft.comparison).toMatchObject({ left: 'terminal-core', right: 'editorial-silence', mode: 'original' });
    expect(store.getSnapshot().draft.styleId).toBe('brutalist-grid');
    expect(store.getSnapshot().draft.overrides.colors?.text).toBe('#123456');
    store.requestComparisonSelection('?left=terminal-core&right=editorial-silence&mode=complete');
    expect(store.getSnapshot().draft.comparison.mode).toBe('complete');
    expect(parseComparisonQuery('?left=missing&right=editorial-silence')).toEqual({ ok: false });
    expect(parseComparisonQuery('?mode=unsupported')).toEqual({ ok: false });
    const before = store.getSnapshot().draft;
    store.requestComparisonSelection('?mode=unsupported');
    expect(store.getSnapshot().draft).toEqual(before);
    expect(store.getSnapshot().recoveryReason).toBe('invalid-comparison');
  });

  it('reset-axis, reset authored, undo, and reset-all have distinct effects', () => {
    const store = createDesignWorkspace(memoryStorage());
    store.selectStyle('editorial-silence');
    store.setColorRole('text', '#112233');
    store.applyAxis('typography', 'brutalist-grid');
    store.setProjectContext({ name: 'Retain this brief' });
    store.resetAxis('typography');
    expect(store.getSnapshot().draft.overrides.fonts).toBeUndefined();
    expect(store.getSnapshot().draft.overrides.colors?.text).toBe('#112233');
    store.resetToAuthored();
    expect(store.getSnapshot().draft.overrides).toEqual({});
    expect(store.getSnapshot().draft.projectContext.name).toBe('Retain this brief');
    store.undo();
    expect(store.getSnapshot().draft.overrides.colors?.text).toBe('#112233');
    store.resetDraft();
    expect({ ...store.getSnapshot().draft, revision: 0 }).toEqual(createInitialDraft());
  });

  it('UI-language routes keep the design and preview language independent', () => {
    const storage = memoryStorage();
    const store = createDesignWorkspace(storage);
    store.setContentLocale('ja');
    store.setColorRole('canvas', '#fefefe');
    const before = store.getSnapshot().draft;
    const koreanPath = localizedPath('/pages/typography', 'ko');
    expect(findRoute(koreanPath).path).toBe('/pages/typography');
    expect(findRoute('/ko/pages/typography.html').path).toBe('/pages/typography');
    expect(findRoute('/pages/color-system.html').path).toBe('/pages/color-system');
    store.flush();
    expect(createDesignWorkspace(storage).getSnapshot().draft).toEqual(before);
    expect(before.contentLocale).toBe('ja');
  });

  it('retains current repair decisions only while they still apply after an edit', () => {
    const store = createDesignWorkspace(memoryStorage());
    store.setColorRole('text', '#e6e6e1');
    const draft = store.getSnapshot().draft;
    const proposal = proposeContrastRepairs(resolveVisualContract(draft.styleId, draftResolutionOptions(draft))).find((item) => item.role === 'text');
    expect(proposal).toBeDefined();
    store.acceptRepair(proposal!);
    store.setColorRole('text', '#112233');
    expect(store.getSnapshot().draft.acceptedRepairs.some((item) => item.role === 'text')).toBe(false);
    const restored = createDesignWorkspace(memoryStorage(JSON.stringify(store.getSnapshot().draft)));
    expect(restored.getSnapshot().status).toBe('saved');
    expect(resolveVisualContract(restored.getSnapshot().draft.styleId, draftResolutionOptions(restored.getSnapshot().draft)).colors.text).toBe('#112233');
  });

  it('rejecting refinement restores the exact baseline style, typography, locale, and repair decisions', () => {
    const store = createDesignWorkspace(memoryStorage());
    store.setContentLocale('ko');
    store.applyAxis('typography', 'editorial-silence');
    store.setColorRole('text', '#e6e6e1');
    const originalDraft = store.getSnapshot().draft;
    const proposal = proposeContrastRepairs(resolveVisualContract(originalDraft.styleId, draftResolutionOptions(originalDraft))).find((item) => item.role === 'text');
    store.acceptRepair(proposal!);
    const repaired = store.getSnapshot().draft;
    const baseline = resolveVisualContract(repaired.styleId, draftResolutionOptions(repaired));
    store.setRefinement({ baseline, baselineRevision: baseline.contentHash, baselineAxisSources: repaired.axisSources });
    store.selectStyle('glass-orbit');
    store.setContentLocale('ja');
    expect(store.restoreBaseline()).toBe(true);
    const restored = store.getSnapshot().draft;
    expect(resolveVisualContract(restored.styleId, draftResolutionOptions(restored))).toEqual(baseline);
    expect(restored.axisSources).toEqual(repaired.axisSources);
    expect(restored.refinement.baseline).toEqual(baseline);
  });
});

describe('draft recovery and concurrent tabs', () => {
  it('migrates the supported v0 draft without discarding values', () => {
    const result = parseDesignDraft(JSON.stringify({ schemaVersion: 0, selectedStyleId: 'editorial-silence', overrides: { colors: { text: '#222333' } }, contentLocale: 'ko' }));
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.migrated).toBe(true);
      expect(result.draft.styleId).toBe('editorial-silence');
      expect(result.draft.overrides.colors?.text).toBe('#222333');
      expect(result.draft.contentLocale).toBe('ko');
    }
  });

  it.each(['{broken', JSON.stringify({ schemaVersion: 99 }), JSON.stringify({ ...createInitialDraft(), contractRevision: 'old-revision' })])('keeps unrecoverable original data and supports an editable in-memory draft', (raw) => {
    const storage = memoryStorage(raw);
    const store = createDesignWorkspace(storage);
    expect(store.getSnapshot().status).toBe('recovery-needed');
    store.setColorRole('accent', '#445566');
    expect(store.flush()).toBe(false);
    expect(storage.getItem(DESIGN_DRAFT_STORAGE_KEY)).toBe(raw);
    expect(store.getRecoveryData()).toBe(raw);
    store.resetDraft();
    expect(storage.getItem(DESIGN_DRAFT_RECOVERY_KEY)).toBe(raw);
    expect(store.getSnapshot().status).toBe('saved');
  });

  it('rejects unknown style IDs, unsupported modes, injected CSS, and unexpected fields', () => {
    const original = createInitialDraft();
    for (const value of [
      { ...original, styleId: 'missing-style' },
      { ...original, mode: getVisualContract(original.styleId).defaultMode === 'light' ? 'dark' : 'light' },
      { ...original, overrides: { colors: { text: 'url(https://example.com)' } } },
      { ...original, analyticsCopy: 'private text' },
    ]) expect(parseDesignDraft(JSON.stringify(value)).ok).toBe(false);
    const store = createDesignWorkspace(memoryStorage());
    expect(store.requestStyleSelection('missing-style')).toBe(false);
    expect(store.getSnapshot().recoveryReason).toBe('invalid-selection');
    expect(store.getSnapshot().draft.styleId).toBe(original.styleId);
  });

  it('does not break editing when reading or writing storage fails', () => {
    const storage = { getItem: () => { throw new Error('denied'); }, setItem: () => { throw new Error('quota'); } };
    const store = createDesignWorkspace(storage);
    expect(store.getSnapshot().status).toBe('memory-only');
    store.setColorRole('accent', '#123456');
    expect(store.getSnapshot().draft.overrides.colors?.accent).toBe('#123456');
    expect(store.flush()).toBe(false);
    expect(store.getSnapshot().status).toBe('memory-only');
  });

  it('detects stale competing writes even before a storage event and requires a deliberate choice', () => {
    const storage = memoryStorage();
    const first = createDesignWorkspace(storage);
    const second = createDesignWorkspace(storage);
    first.setColorRole('text', '#112233');
    second.setColorRole('accent', '#aabbcc');
    expect(second.getSnapshot().status).toBe('conflict');
    expect(JSON.parse(storage.getItem(DESIGN_DRAFT_STORAGE_KEY)!).overrides.colors).toEqual({ text: '#112233' });
    const preservedFirst = first.getSnapshot().draft;
    second.keepLocal();
    first.receiveStorage(storage.getItem(DESIGN_DRAFT_STORAGE_KEY));
    expect(first.getSnapshot().status).toBe('conflict');
    expect(first.getSnapshot().draft).toEqual(preservedFirst);
    first.reloadRemote();
    expect(first.getSnapshot().draft.overrides.colors).toEqual({ accent: '#aabbcc' });
    expect(first.getSnapshot().status).toBe('saved');
    first.undo();
    expect(first.getSnapshot().draft.overrides.colors).toEqual({ text: '#112233' });
  });
});
