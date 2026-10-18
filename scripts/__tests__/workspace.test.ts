import { describe, expect, it, vi } from 'vitest';
import { createDesignWorkspace, createInitialDraft, DESIGN_DRAFT_RECOVERY_KEY, DESIGN_DRAFT_STORAGE_KEY, draftResolutionOptions, draftWithLocationComparison, parseComparisonQuery, parseDesignDraft } from '../../src/visual/workspace';
import { getVisualContract, proposeContrastRepairs, resolveVisualContract } from '../../src/visual';
import { buildSelectedHandoff, selectedHandoffToPrompt } from '../../src/visual/handoff';
import { projectResolvedSpec } from '../../src/visual/resolvedSpec';
import { selectionParams, urlWithAlignedStylePreset, urlWithSelection } from '../../src/visual/selectionUrl';
import { findRoute, localizedPath } from '../../src/data/routes';
import { styleCatalog } from '../../src/data/styles';
import { withLang } from '../../src/utils/language';

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
    expect(draftWithLocationComparison(createInitialDraft(), '?left=editorial-silence&right=quiet-utility&mode=complete&fixture=editorial&layout=horizontal').comparison).toMatchObject({ left: 'editorial-silence', right: 'quiet-utility', mode: 'complete', layout: 'horizontal' });
    expect(draftWithLocationComparison(createInitialDraft(), '?left=editorial-silence&right=quiet-utility&mode=complete&fixture=editorial').fixtureId).toBe('editorial');
    vi.stubGlobal('window', { location: { search: '?left=editorial-silence&right=quiet-utility&mode=complete&fixture=editorial&layout=horizontal' } });
    expect(createDesignWorkspace(null).getSnapshot().draft.comparison.left).toBe('editorial-silence');
    vi.unstubAllGlobals();
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

  it('keeps the refinement baseline and the current draft when a new page reads storage', () => {
    const storage = memoryStorage();
    const store = createDesignWorkspace(storage);
    store.setTaskMode('refine-existing');
    store.setContentLocale('ko');
    const current = store.getSnapshot().draft;
    const baseline = resolveVisualContract(current.styleId, draftResolutionOptions(current));
    store.setRefinement({
      evidenceKind: 'draft',
      allowedChanges: ['typography'],
      baseline,
      baselineRevision: baseline.contentHash,
      baselineAxisSources: current.axisSources,
      sourceReference: 'Settings page',
    });
    store.setTypographyRole('body', { lineHeight: 1.85 });
    expect(store.flush()).toBe(true);
    const reloaded = createDesignWorkspace(storage).getSnapshot().draft;
    expect(reloaded.taskMode).toBe('refine-existing');
    expect(reloaded.contentLocale).toBe('ko');
    expect(reloaded.refinement.evidenceKind).toBe('draft');
    expect(reloaded.refinement.baselineRevision).toBe(baseline.contentHash);
    expect(reloaded.refinement.baseline).toEqual(baseline);
    expect(reloaded.overrides.typography?.body?.lineHeight).toBe(1.85);
    expect(reloaded.refinement.sourceReference).toBe('Settings page');
  });

  it('accepts, rejects, and undoes one change without moving a locked part, then keeps that state across navigation', () => {
    const storage = memoryStorage();
    const store = createDesignWorkspace(storage);
    store.setTaskMode('refine-existing');
    const initial = store.getSnapshot().draft;
    const baseline = resolveVisualContract(initial.styleId, draftResolutionOptions(initial));
    store.setRefinement({
      evidenceKind: 'draft',
      allowedChanges: ['typography', 'colors'],
      baseline,
      baselineRevision: baseline.contentHash,
      baselineAxisSources: initial.axisSources,
    });
    store.setTypographyRole('body', { lineHeight: 1.8 });
    store.setColorRole('text', '#101010');
    store.setRefinement({ lockedPaths: ['colors.text'] });
    const lockedColor = store.getSnapshot().draft.overrides.colors?.text;
    expect(store.acceptRefinementChange('colors.text')).toBe(false);
    expect(store.getSnapshot().draft.overrides.colors?.text).toBe(lockedColor);
    expect(store.getSnapshot().draft.refinement.changeDecisions).toEqual([]);
    expect(store.acceptRefinementChange('typography.roles.body.lineHeight')).toBe(true);
    expect(store.rejectRefinementChange('colors.text')).toBe(true);
    const decided = store.getSnapshot().draft;
    expect(resolveVisualContract(decided.styleId, draftResolutionOptions(decided)).colors.text).toBe(baseline.colors.text);
    expect(decided.overrides.typography?.body?.lineHeight).toBe(1.8);
    const accepted = buildSelectedHandoff(resolveVisualContract(decided.styleId, draftResolutionOptions(decided)), {
      taskMode: 'refine-existing',
      refinement: decided.refinement,
    });
    expect(accepted.refinement?.operations.map((operation) => operation.path)).toEqual(['typography.roles.body.lineHeight']);
    expect(selectedHandoffToPrompt(accepted)).toContain('typography.roles.body.lineHeight');
    expect(selectedHandoffToPrompt(accepted)).not.toContain('#101010');
    expect(store.undoRefinementChange('typography.roles.body.lineHeight')).toBe(true);
    expect(store.getSnapshot().draft.overrides.typography?.body?.lineHeight).toBe(1.8);
    const pending = store.getSnapshot().draft;
    const withheld = buildSelectedHandoff(resolveVisualContract(pending.styleId, draftResolutionOptions(pending)), {
      taskMode: 'refine-existing',
      refinement: pending.refinement,
    });
    expect(withheld.refinement?.operations).toEqual([]);
    expect(store.undoRefinementChange('colors.text')).toBe(true);
    expect(store.getSnapshot().draft.overrides.colors?.text).toBe('#101010');
    expect(store.acceptRefinementChange('colors.text')).toBe(false);
    expect(store.getSnapshot().draft.overrides.colors?.text).toBe('#101010');
    expect(store.acceptRefinementChange('typography.roles.body.lineHeight')).toBe(true);
    expect(store.flush()).toBe(true);
    const reloaded = createDesignWorkspace(storage).getSnapshot().draft;
    expect(reloaded.taskMode).toBe('refine-existing');
    expect(reloaded.refinement.baseline).toEqual(baseline);
    expect(reloaded.refinement.lockedPaths).toEqual(['colors.text']);
    expect(reloaded.overrides.colors?.text).toBe('#101010');
    expect(reloaded.overrides.typography?.body?.lineHeight).toBe(1.8);
    expect(reloaded.refinement.changeDecisions).toEqual([{ path: 'typography.roles.body.lineHeight', status: 'accepted' }]);
    const reloadedHandoff = buildSelectedHandoff(resolveVisualContract(reloaded.styleId, draftResolutionOptions(reloaded)), {
      taskMode: 'refine-existing',
      refinement: reloaded.refinement,
    });
    expect(reloadedHandoff.refinement?.operations.map((operation) => operation.path)).toEqual(['typography.roles.body.lineHeight']);
    expect(reloadedHandoff.refinement?.conflicts.some((conflict) => conflict.includes('colors.text is locked'))).toBe(true);
    store.dispose();
  });
});

describe('draft recovery and concurrent tabs', () => {
  it('migrates legacy refinement evidence kinds onto the current completeness values', () => {
    const initial = createInitialDraft();
    for (const [legacy, evidenceKind] of [['screenshot', 'screenshot-only'], ['source', 'structured-snapshot'], ['rendered', 'draft']] as const) {
      const raw = JSON.stringify({ ...initial, refinement: { ...initial.refinement, evidenceKind: legacy } });
      const parsed = parseDesignDraft(raw);
      expect(parsed.ok).toBe(true);
      if (parsed.ok) expect(parsed.draft.refinement.evidenceKind).toBe(evidenceKind);
    }
  });

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

describe('selection URL and export continuity', () => {
  it('keeps one draft from selection through color, typography, comparison, one axis, and prompt export', () => {
    const storage = memoryStorage();
    const store = createDesignWorkspace(storage, { deferWrites: true });
    store.selectStyle('editorial-silence');
    store.setColorRole('text', '#172031');
    store.setTypographyRole('body', { lineHeight: 1.8, letterSpacingEm: 0 });
    store.setPreviewCopy({ heading: '새로운 디자인', body: 'Private client copy stays local.' });
    store.setProjectContext({ name: 'Client project' });
    const beforeLink = store.getSnapshot().draft;
    expect(store.requestComparisonSelection('?left=brutalist-grid&right=quiet-utility')).toBe(true);
    expect(store.getSnapshot().draft.styleId).toBe('editorial-silence');
    expect(store.getSnapshot().draft.overrides.colors?.text).toBe('#172031');
    expect(store.getSnapshot().draft.comparison).toMatchObject({ left: 'brutalist-grid', right: 'quiet-utility', mode: 'original' });
    expect(store.applyAxis('density', 'brutalist-grid')).toBe(true);
    store.flush();
    const draft = createDesignWorkspace(storage).getSnapshot().draft;
    expect(draft.overrides.typography?.body?.lineHeight).toBe(1.8);
    expect(draft.overrides.colors?.text).toBe('#172031');
    const resolved = resolveVisualContract(draft.styleId, draftResolutionOptions(draft));
    const { handoff } = projectResolvedSpec(resolved, {
      taskMode: draft.taskMode,
      projectContext: draft.projectContext,
      refinement: draft.refinement,
      explicitOverrides: draft.overrides,
      draftRevision: draft.revision,
      fixtureId: draft.fixtureId,
      previewCopy: draft.previewCopy,
      selectedReferenceIds: draft.referencedStyleIds,
      axisSources: draft.axisSources,
    });
    const prompt = selectedHandoffToPrompt(handoff);
    expect(handoff.axisSources).toEqual({ density: 'brutalist-grid' });
    expect(handoff.design.colors.text).toBe('#172031');
    expect(handoff.design.typography.roles.body.lineHeight).toBe(1.8);
    expect(handoff.design.spacing).toEqual(resolveVisualContract('brutalist-grid').spacing);
    expect(handoff.project.name).toBe('Client project');
    expect(prompt).toContain('#172031');
    expect(prompt).toContain('Private client copy stays local.');
    expect(handoff.verification.every((item) => item.outcome === 'not-run')).toBe(true);
    const generic = withLang('/pages/prompt-workflow', 'ko', { stylePreset: 'editorial-silence' });
    expect(generic).toBe('/ko/pages/prompt-workflow?stylePreset=editorial-silence');
    expect(generic).not.toContain('172031');
    expect(generic).not.toContain('Private');
    expect(generic).not.toContain('Client');
    expect(beforeLink.overrides.colors?.text).toBe('#172031');
    store.dispose();
  });

  it('restores a full comparison snapshot on back without carrying private draft fields', () => {
    const store = createDesignWorkspace(memoryStorage());
    store.setColorRole('text', '#172031');
    store.setPreviewCopy({ heading: '새로운 디자인' });
    store.requestComparisonSelection('?left=brutalist-grid&right=editorial-silence');
    const landing = urlWithSelection('/pages/compare', '?left=brutalist-grid&right=editorial-silence', '', store.getSnapshot().draft);
    expect(landing).not.toContain('172031');
    expect(landing).not.toContain(encodeURIComponent('새로운 디자인'));
    expect(Object.keys(selectionParams(store.getSnapshot().draft)).sort()).toEqual(['axis', 'fixture', 'layout', 'left', 'mode', 'right']);
    store.setComparison({ mode: 'axis', axis: 'density', right: 'quiet-utility' });
    store.setFixtureId('editorial');
    const forward = urlWithSelection('/pages/compare', landing.slice(landing.indexOf('?')), '', store.getSnapshot().draft);
    expect(forward).toContain('mode=axis');
    expect(forward).toContain('axis=density');
    expect(forward).toContain('right=quiet-utility');
    expect(forward).toContain('fixture=editorial');
    const history = [landing, forward];
    const back = new URL(history[0], 'https://webstylebook.com').search;
    expect(store.requestComparisonSelection(back)).toBe(true);
    expect(store.getSnapshot().draft.comparison).toMatchObject({ left: 'brutalist-grid', right: 'editorial-silence', mode: 'original', axis: 'color', layout: 'horizontal' });
    expect(store.getSnapshot().draft.fixtureId).toBe('product');
    expect(store.getSnapshot().draft.overrides.colors?.text).toBe('#172031');
    expect(store.getSnapshot().draft.previewCopy.heading).toBe('새로운 디자인');
    expect(urlWithAlignedStylePreset('/pages/color-system', '?stylePreset=brutalist-grid', '', 'editorial-silence')).toBe('/pages/color-system?stylePreset=editorial-silence');
    expect(urlWithAlignedStylePreset('/pages/prompt-workflow', '?stylePreset=editorial-silence,glass-orbit', '', 'quiet-utility')).toBeNull();
    store.dispose();
  });

  it('refuses a color axis whose authored mode differs and leaves the draft unchanged', () => {
    const store = createDesignWorkspace(memoryStorage());
    const current = getVisualContract(store.getSnapshot().draft.styleId);
    const other = styleCatalog.find((style) => getVisualContract(style.id).defaultMode !== current.defaultMode);
    expect(other).toBeDefined();
    store.setColorRole('text', '#123456');
    expect(store.applyAxis('color', other!.id)).toBe(false);
    expect(store.getSnapshot().draft.overrides.colors).toEqual({ text: '#123456' });
    expect(store.getSnapshot().draft.axisSources.color).toBeUndefined();
    expect(store.applyAxis('typography', other!.id)).toBe(true);
    expect(store.getSnapshot().draft.overrides.colors?.text).toBe('#123456');
    expect(store.getSnapshot().draft.axisSources.typography).toBe(other!.id);
    store.dispose();
  });
});
