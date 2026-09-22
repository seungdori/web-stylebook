import { describe, expect, it } from 'vitest';
import { resolveVisualContract } from '../../src/visual';
import { comparisonFieldDiff, getAxisOverrides, resolveAxisComparison } from '../../src/visual/comparison';
import { createDesignWorkspace } from '../../src/visual/workspace';

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
        store.applyAxis(axis, source.styleId);
        const after = store.getSnapshot().draft;
        const applied = resolveVisualContract(after.styleId, { mode: after.mode, contentLocale: after.contentLocale, overrides: after.overrides, acceptedRepairs: after.acceptedRepairs });
        expect(applied).toEqual(alternative);
        expect(after.axisSources[axis]).toBe(source.styleId);
        store.undo();
        expect(store.getSnapshot().draft.overrides).toEqual(draft.overrides);
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

  it('swapping the comparison twice restores selections, modes, and preserved draft edits', () => {
    const store = createDesignWorkspace(null);
    store.setOverrides({ colors: { accent: '#a33025' } });
    store.setComparison({ left: 'editorial-silence', right: 'quiet-utility', mode: 'original', layout: 'vertical' });
    const before = store.getSnapshot().draft;
    store.setComparison({ left: before.comparison.right, right: before.comparison.left });
    const swapped = store.getSnapshot().draft;
    store.setComparison({ left: swapped.comparison.right, right: swapped.comparison.left });
    const after = store.getSnapshot().draft;
    expect(after.comparison).toEqual(before.comparison);
    expect(after.overrides).toEqual(before.overrides);
  });
});
