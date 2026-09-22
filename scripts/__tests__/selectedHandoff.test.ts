import { describe, expect, it } from 'vitest';
import { resolveVisualContract, serializeVisualJson } from '../../src/visual/index';
import { buildSelectedHandoff, selectedHandoffToCss, selectedHandoffToPrompt, selectedHandoffToTheme, summarizeVerification, type RefinementContext } from '../../src/visual/handoff';

const refinement = (patch: Partial<RefinementContext> = {}): RefinementContext => ({ allowedChanges: ['typography'], preserve: [], lockedPaths: [], targetRegions: [], sourceReference: 'Existing Vite/React settings page', evidenceKind: 'description', requestedOutcome: 'Improve reading hierarchy', ...patch });

describe('selected design handoff', () => {
  it('preserves actual edited colors, typography, density and locale in self-contained exports', () => {
    const overrides = { colors: { text: '#121212' }, typography: { body: { lineHeight: 1.7, fontWeight: 500 } }, density: 'compact' as const };
    const design = resolveVisualContract('brutalist-grid', { contentLocale: 'ko', overrides });
    const handoff = buildSelectedHandoff(design, { explicitOverrides: overrides, draftRevision: 7 });
    const roundTrip = JSON.parse(serializeVisualJson(handoff));
    expect(roundTrip.design.colors.text).toBe('#121212');
    expect(roundTrip.design.typography.roles.body.lineHeight).toBe(1.7);
    expect(roundTrip.design.typography.roles.body.fontWeight).toBe(500);
    expect(roundTrip.design.spacing.density).toBe('compact');
    expect(roundTrip.identity.contentLocale).toBe('ko');
    expect(roundTrip.explicitOverrides).toEqual(overrides);
    expect(selectedHandoffToCss(handoff)).toContain('--color-text: #121212');
    expect(selectedHandoffToCss(handoff)).toContain('--type-body-line-height: 1.7');
    expect(selectedHandoffToTheme(handoff)).toContain('"lineHeight": 1.7');
    expect(selectedHandoffToTheme(handoff)).toContain('"outcome": "not-run"');
    expect(selectedHandoffToCss(handoff)).toContain('"fonts"');
  });

  it('is deterministic, changes identity for edits, and contains only the selected design', () => {
    const design = resolveVisualContract('editorial-silence');
    expect(buildSelectedHandoff(design)).toEqual(buildSelectedHandoff(design));
    const base = buildSelectedHandoff(design);
    const edited = buildSelectedHandoff(resolveVisualContract('editorial-silence', { overrides: { typography: { body: { lineHeight: 1.8 } } } }));
    expect(base.identity.contentHash).not.toBe(edited.identity.contentHash);
    expect(base.handoffHash).not.toBe(edited.handoffHash);
    const output = selectedHandoffToPrompt(base);
    expect(output).not.toContain('"styles"');
    expect(output).not.toContain('referenceLibrary');
    expect(output).not.toContain('"ko":');
    expect(output).not.toContain('"ja":');
    expect(new TextEncoder().encode(output).length).toBeLessThan(40_000);
  });

  it('compacts implementation payloads losslessly and preserves reference IDs without merging styles', () => {
    const handoff = buildSelectedHandoff(resolveVisualContract('brutalist-grid'), { selectedReferenceIds: ['brutalist-grid', 'editorial-silence'], projectContext: { purpose: 'Keep </script> and Korean 한글 as text' } });
    const prompt = selectedHandoffToPrompt(handoff);
    const payload = prompt.slice(prompt.indexOf('{"schema":'));
    expect(payload).not.toContain('\n');
    expect(JSON.parse(payload)).toEqual(handoff);
    expect(JSON.parse(serializeVisualJson(handoff, 0))).toEqual(JSON.parse(serializeVisualJson(handoff)));
    expect(payload.length).toBeLessThan(serializeVisualJson(handoff).length);
    expect(payload).not.toContain('</script>');
    expect(handoff.selectedReferenceIds).toEqual(['brutalist-grid', 'editorial-silence']);
    expect(handoff.design.styleId).toBe('brutalist-grid');
    expect(handoff.referencePolicy).toContain('no additional style is merged');
    expect(handoff).not.toHaveProperty('styles');
  });

  it('rejects stale resolved values instead of silently exporting a mismatched hash', () => {
    const design = resolveVisualContract('brutalist-grid');
    expect(() => buildSelectedHandoff({ ...design, colors: { ...design.colors, text: '#333333' } })).toThrow();
    expect(() => buildSelectedHandoff({ ...design, schema: 'unknown' } as never)).toThrow();
  });

  it('produces a narrow, measured typography delta with preservation instructions', () => {
    const baseline = resolveVisualContract('brutalist-grid');
    const design = resolveVisualContract('brutalist-grid', { overrides: { typography: { body: { lineHeight: 1.8 } } } });
    const handoff = buildSelectedHandoff(design, { taskMode: 'refine-existing', projectContext: { stack: 'Vite + React', screens: ['Settings'] }, refinement: refinement({ baseline, baselineRevision: baseline.contentHash }) });
    expect(handoff.refinement?.operations.map((operation) => operation.path)).toEqual(['typography.roles.body.lineHeight']);
    expect(handoff.refinement?.operations[0].oldValue).toBe(baseline.typography.roles.body.lineHeight);
    expect(handoff.refinement?.conflicts).toEqual([]);
    expect(handoff.preserve).toContain('colors');
    expect(handoff.preserve).toContain('density');
    const prompt = selectedHandoffToPrompt(handoff);
    expect(prompt).toContain('Change only the allowed axes and target regions');
    expect(prompt).toContain('Vite + React');
    expect(prompt).not.toMatch(/current stable Next|narrow MVP|choose a new typography|Read every entry/);
    expect(handoff.verification.map((check) => check.id)).toEqual(['preservation', 'responsive', 'typography']);
  });

  it.each(['colors', 'density'] as const)('keeps a %s-only request narrow', (axis) => {
    const baseline = resolveVisualContract('brutalist-grid');
    const overrides = axis === 'colors' ? { colors: { text: '#101010' } } : { density: 'compact' as const };
    const design = resolveVisualContract('brutalist-grid', { overrides });
    const handoff = buildSelectedHandoff(design, { taskMode: 'refine-existing', refinement: refinement({ allowedChanges: [axis], baseline, baselineRevision: baseline.contentHash }) });
    expect(handoff.refinement?.operations.length).toBeGreaterThan(0);
    expect(handoff.refinement?.operations.every((operation) => operation.axis === axis)).toBe(true);
    expect(handoff.refinement?.conflicts).toEqual([]);
  });

  it('blocks changes outside scope and locked insufficient-contrast roles', () => {
    const baseline = resolveVisualContract('brutalist-grid');
    const changed = resolveVisualContract('brutalist-grid', { overrides: { colors: { text: '#dddddd' } } });
    const scoped = buildSelectedHandoff(changed, { taskMode: 'refine-existing', refinement: refinement({ baseline, baselineRevision: baseline.contentHash, lockedPaths: ['colors.text'] }) });
    expect(scoped.refinement?.conflicts.some((value) => value.includes('outside the allowed scope'))).toBe(true);
    expect(scoped.refinement?.conflicts.some((value) => value.includes('locked'))).toBe(true);
    expect(() => selectedHandoffToPrompt(scoped)).toThrow('Resolve');
  });

  it('labels screenshot-only context and selectors as unverified without invented before values', () => {
    const handoff = buildSelectedHandoff(resolveVisualContract('editorial-silence'), { taskMode: 'refine-existing', refinement: refinement({ evidenceKind: 'screenshot', targetRegions: ['.heading'] }) });
    expect(handoff.evidenceLimits.join(' ')).toContain('Screenshot-only context does not establish computed tokens');
    expect(handoff.refinement?.targetRegions).toEqual([{ reference: '.heading', verified: false }]);
    expect(handoff.refinement?.baselineRevision).toBe(null);
    expect(handoff.refinement?.operations).toEqual([]);
    expect(summarizeVerification(handoff.verification).complete).toBe(false);
  });

  it('does not treat unavailable commands, missing evidence or risk prose as verification', () => {
    expect(summarizeVerification([{ id: 'browser', scope: 'page', outcome: 'not-run', notes: 'Browser unavailable' }]).complete).toBe(false);
    expect(summarizeVerification([{ id: 'build', scope: 'project', outcome: 'fail', commandOrInspection: 'npm run build', evidence: 'exit 1' }]).complete).toBe(false);
    expect(summarizeVerification([{ id: 'claim', scope: 'all', outcome: 'pass', notes: 'Everything looks good' }]).invalidIds).toEqual(['claim']);
    expect(summarizeVerification([{ id: 'skip', scope: 'all', outcome: 'not-applicable' }]).complete).toBe(false);
    expect(summarizeVerification([{ id: 'actual', scope: 'selected settings page', outcome: 'pass', commandOrInspection: 'Keyboard inspection', evidence: 'captures/settings.png' }]).complete).toBe(true);
  });

  it('serializes hostile notes as data without executable HTML', () => {
    const handoff = buildSelectedHandoff(resolveVisualContract('brutalist-grid'), { projectContext: { purpose: '</script><script>alert(1)</script> */ body{display:none} /*' } });
    expect(selectedHandoffToPrompt(handoff)).not.toContain('</script>');
    expect(selectedHandoffToCss(handoff)).not.toContain('*/ body{display:none}');
  });
});
