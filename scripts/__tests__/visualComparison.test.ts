import { describe, expect, it } from 'vitest';
import { resolveVisualContract } from '../../src/visual';
import { comparisonFieldDiff, compositionOrigins, getAxisOverrides, resolveAxisComparison } from '../../src/visual/comparison';
import { buildSelectedHandoff, selectedHandoffToPrompt } from '../../src/visual/handoff';
import { projectResolvedSpec } from '../../src/visual/resolvedSpec';
import { createDesignWorkspace } from '../../src/visual/workspace';
import type { ResolvedVisualContract } from '../../src/visual/types';

function contractLeaves(value: unknown, path: string, out: Map<string, unknown>) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => contractLeaves(item, `${path}[${index}]`, out));
    return;
  }
  if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) contractLeaves(child, path ? `${path}.${key}` : key, out);
    return;
  }
  out.set(path, value);
}

function expectOnlyAxisPathsDiffer(baseline: ResolvedVisualContract, alternative: ResolvedVisualContract, axis: 'color' | 'typography' | 'density') {
  const allowed = axis === 'color' ? 'colors' : axis === 'density' ? 'spacing' : 'typography';
  const derived = new Set(['contentHash', 'overrides', 'origins', 'repairs', 'warnings']);
  const before = new Map<string, unknown>();
  const after = new Map<string, unknown>();
  contractLeaves(baseline, '', before);
  contractLeaves(alternative, '', after);
  const changed: string[] = [];
  for (const path of new Set([...before.keys(), ...after.keys()])) {
    const root = path.split(/[.[]/)[0];
    if (derived.has(root)) continue;
    if (before.get(path) === after.get(path)) continue;
    changed.push(path);
  }
  expect(changed.every((path) => path === allowed || path.startsWith(`${allowed}.`) || path.startsWith(`${allowed}[`))).toBe(true);
  expect(changed.some((path) => path === allowed || path.startsWith(`${allowed}.`) || path.startsWith(`${allowed}[`))).toBe(true);
}

const axes = ['color', 'typography', 'density'] as const;
const valueKeys = ['colors', 'typography', 'spacing', 'borders', 'radii', 'shadows', 'motion', 'components', 'usage'] as const;

describe('controlled design comparison', () => {
  for (const locale of ['en', 'ko', 'ja'] as const) {
    for (const axis of axes) {
      it(`${locale} ${axis} copies only the selected values and matches committed application`, () => {
        const store = createDesignWorkspace(null);
        store.selectStyle('brutalist-grid');
        store.setContentLocale(locale);
        store.setOverrides({ colors: { text: '#222222' }, typography: { heading: { lineHeight: 1.9 } }, density: 'compact' });
        const draft = store.getSnapshot().draft;
        const baseline = resolveVisualContract(draft.styleId, { mode: draft.mode, contentLocale: locale, overrides: draft.overrides });
        const source = resolveVisualContract('editorial-silence', { contentLocale: locale });
        const alternative = resolveAxisComparison(baseline, source, axis);
        const changedKey = axis === 'color' ? 'colors' : axis === 'density' ? 'spacing' : 'typography';
        for (const key of valueKeys) expect(alternative[key], key).toEqual(key === changedKey ? source[key] : baseline[key]);
        expectOnlyAxisPathsDiffer(baseline, alternative, axis);
        store.applyAxis(axis, source.styleId);
        const after = store.getSnapshot().draft;
        const applied = resolveVisualContract(after.styleId, { mode: after.mode, contentLocale: after.contentLocale, overrides: after.overrides, acceptedRepairs: after.acceptedRepairs });
        expect(applied).toEqual(alternative);
        expect(after.axisSources[axis]).toBe(source.styleId);
        expect(after.styleId).toBe(draft.styleId);
        expect(after.previewCopy).toEqual(draft.previewCopy);
        expect(after.fixtureId).toBe(draft.fixtureId);
        expect(after.comparison).toEqual(draft.comparison);
        expect(after.mode).toBe(draft.mode);
        if (axis !== 'color') expect(after.overrides.colors).toEqual(draft.overrides.colors);
        if (axis !== 'typography') expect(after.overrides.typography).toEqual(draft.overrides.typography);
        const { handoff } = projectResolvedSpec(applied, { explicitOverrides: after.overrides, axisSources: after.axisSources, draftRevision: after.revision, fixtureId: after.fixtureId, previewCopy: after.previewCopy });
        const prompt = selectedHandoffToPrompt(handoff);
        expect(JSON.parse(prompt.slice(prompt.indexOf('{')))).toEqual(handoff);
        expect(handoff.axisSources).toEqual({ [axis]: 'editorial-silence' });
        expect(handoff.design.colors).toEqual(applied.colors);
        expect(handoff.design.typography).toEqual(applied.typography);
        expect(handoff.design.spacing).toEqual(applied.spacing);
        store.undo();
        expect(store.getSnapshot().draft.overrides).toEqual(draft.overrides);
        expect(store.getSnapshot().draft.axisSources).toEqual(draft.axisSources);
      });
    }
  }

  it('copies spacing numbers, including zero, without an old density preset overwriting them', () => {
    const baseline = resolveVisualContract('quiet-utility', { overrides: { density: 'compact' } });
    const source = resolveVisualContract('editorial-silence', { overrides: { spacing: { unit: 0, section: 0, gutter: 0, row: 39, stack: 7 } } });
    const alternative = resolveAxisComparison(baseline, source, 'density');
    expect(alternative.spacing).toEqual(source.spacing);
    expect(alternative.overrides.density).toBeUndefined();
    expect(alternative.shadows).toEqual(baseline.shadows);
  });

  it('includes source font loading metadata when copying typography', () => {
    const source = resolveVisualContract('editorial-silence');
    expect(getAxisOverrides('typography', source).fonts).toEqual(source.typography.fonts);
    expect(getAxisOverrides('typography', source).fonts).not.toBe(source.typography.fonts);
  });

  it('reports actual leaf differences only inside the selected axis', () => {
    const baseline = resolveVisualContract('quiet-utility');
    const alternative = resolveAxisComparison(baseline, resolveVisualContract('brutalist-grid'), 'color');
    const fields = comparisonFieldDiff(baseline, alternative, 'color');
    expect(fields.length).toBeGreaterThan(0);
    expect(fields.every((field) => field.path.startsWith('colors.') && field.before !== field.after)).toBe(true);
    expect(comparisonFieldDiff(baseline, baseline, 'color')).toEqual([]);
  });

  it('swapping the comparison twice restores selections, provenance, and preserved draft edits', () => {
    const store = createDesignWorkspace(null);
    store.setOverrides({ colors: { accent: '#a33025' } });
    store.setPreviewCopy({ heading: 'Shared heading' });
    store.setComparison({ left: 'editorial-silence', right: 'quiet-utility', mode: 'original', layout: 'vertical' });
    const before = store.getSnapshot().draft;
    const provenance = (id: string) => resolveVisualContract(id).provenance;
    store.setComparison({ left: before.comparison.right, right: before.comparison.left });
    const swapped = store.getSnapshot().draft;
    expect(swapped.comparison.left).toBe(before.comparison.right);
    expect(swapped.comparison.right).toBe(before.comparison.left);
    expect(provenance(swapped.comparison.left)).toEqual(provenance(before.comparison.right));
    expect(provenance(swapped.comparison.right)).toEqual(provenance(before.comparison.left));
    expect(swapped.overrides).toEqual(before.overrides);
    expect(swapped.previewCopy).toEqual(before.previewCopy);
    store.setComparison({ left: swapped.comparison.right, right: swapped.comparison.left });
    const after = store.getSnapshot().draft;
    expect(after.comparison).toEqual(before.comparison);
    expect(provenance(after.comparison.left)).toEqual(provenance(before.comparison.left));
    expect(provenance(after.comparison.right)).toEqual(provenance(before.comparison.right));
    expect(after.overrides).toEqual(before.overrides);
    expect(after.styleId).toBe(before.styleId);
    expect(after.previewCopy.heading).toBe('Shared heading');
  });

  it('names each axis source and keeps unlisted axes on the primary style', () => {
    expect(compositionOrigins('brutalist-grid', { typography: 'editorial-silence' })).toEqual([
      { axis: 'color', styleId: 'brutalist-grid', imported: false },
      { axis: 'typography', styleId: 'editorial-silence', imported: true },
      { axis: 'density', styleId: 'brutalist-grid', imported: false },
    ]);
    expect(compositionOrigins('quiet-utility', { color: 'quiet-utility' })).toEqual([
      { axis: 'color', styleId: 'quiet-utility', imported: false },
      { axis: 'typography', styleId: 'quiet-utility', imported: false },
      { axis: 'density', styleId: 'quiet-utility', imported: false },
    ]);
  });

  it('refuses an axis source that is not a style id', () => {
    expect(() => buildSelectedHandoff(resolveVisualContract('quiet-utility'), { axisSources: { typography: '../editorial' } })).toThrow(/Reopen the axis sources/);
  });

  it('copies text color together with its surface', () => {
    const source = resolveVisualContract('editorial-silence');
    const overrides = getAxisOverrides('color', source);
    expect(overrides.colors).toEqual(source.colors);
    expect(overrides.colors?.text).toBe(source.colors.text);
    expect(overrides.colors?.surface).toBe(source.colors.surface);
    expect(overrides.colors?.canvas).toBe(source.colors.canvas);
    expect(overrides.typography).toBeUndefined();
    expect(overrides.spacing).toBeUndefined();
  });
});
