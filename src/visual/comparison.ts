import { resolveSelectedSpec } from './resolvedSpec';
import type { ResolvedVisualContract, VisualOverrides } from './types';

export type ComparisonAxis = 'color' | 'colors' | 'typography' | 'density';

/** A shared allowlist for both speculative previews and committed draft changes. */
export function getAxisOverrides(axis: ComparisonAxis, source: ResolvedVisualContract): VisualOverrides {
  if (axis === 'color' || axis === 'colors') return { colors: { ...source.colors } };
  if (axis === 'typography') return {
    typography: Object.fromEntries(Object.entries(source.typography.roles).map(([name, role]) => [name, { ...role }])),
    fonts: source.typography.fonts.map((font) => ({ ...font, weights: [...font.weights], scripts: [...font.scripts] })),
  };
  return { spacing: { ...source.spacing } };
}

export function resolveAxisComparison(baseline: ResolvedVisualContract, source: ResolvedVisualContract, axis: ComparisonAxis): ResolvedVisualContract {
  const overrides = { ...baseline.overrides, ...getAxisOverrides(axis, source) };
  // A previously selected density preset must not overwrite the imported exact spacing.
  if (axis === 'density') delete overrides.density;
  return resolveSelectedSpec(baseline.styleId, {
    mode: baseline.mode,
    contentLocale: baseline.contentLocale,
    overrides,
    acceptedRepairs: axis === 'color' || axis === 'colors' ? [] : baseline.repairs,
  });
}

const recordedAxes = ['color', 'typography', 'density'] as const;
export type RecordedAxis = (typeof recordedAxes)[number];

export function compositionOrigins(primaryStyleId: string, sources: Partial<Record<RecordedAxis, string | undefined>>): Array<{ axis: RecordedAxis; styleId: string; imported: boolean }> {
  return recordedAxes.map((axis) => {
    const source = sources[axis];
    const imported = typeof source === 'string' && source.length > 0 && source !== primaryStyleId;
    return { axis, styleId: imported ? source : primaryStyleId, imported };
  });
}

export interface ComparisonFieldDiff { path: string; before: unknown; after: unknown }
export function comparisonFieldDiff(baseline: ResolvedVisualContract, alternative: ResolvedVisualContract, axis: ComparisonAxis): ComparisonFieldDiff[] {
  const key = axis === 'color' || axis === 'colors' ? 'colors' : axis === 'density' ? 'spacing' : 'typography';
  const changes: ComparisonFieldDiff[] = [];
  function visit(before: unknown, after: unknown, path: string) {
    if (JSON.stringify(before) === JSON.stringify(after)) return;
    if (before && after && typeof before === 'object' && typeof after === 'object' && !Array.isArray(before) && !Array.isArray(after)) {
      for (const name of new Set([...Object.keys(before), ...Object.keys(after)])) visit((before as Record<string, unknown>)[name], (after as Record<string, unknown>)[name], `${path}.${name}`);
    } else changes.push({ path, before, after });
  }
  visit(baseline[key], alternative[key], key);
  return changes;
}
