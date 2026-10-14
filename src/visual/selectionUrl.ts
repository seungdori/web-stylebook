import type { DesignDraft } from './workspace';

/** Public comparison selection. Preview copy, project text, and overrides are never included. */
export const SELECTION_QUERY_KEYS = ['left', 'right', 'mode', 'axis', 'layout', 'fixture'] as const;
export type SelectionQueryKey = (typeof SELECTION_QUERY_KEYS)[number];

export function selectionParams(draft: Pick<DesignDraft, 'comparison' | 'fixtureId'>): Record<SelectionQueryKey, string> {
  return {
    left: draft.comparison.left,
    right: draft.comparison.right,
    mode: draft.comparison.mode,
    axis: draft.comparison.axis,
    layout: draft.comparison.layout,
    fixture: draft.fixtureId,
  };
}

function readParams(search: string) {
  return new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
}

/** Replace only the allowlisted selection keys and keep every other query parameter. */
export function urlWithSelection(pathname: string, search: string, hash: string, draft: Pick<DesignDraft, 'comparison' | 'fixtureId'>): string {
  const params = readParams(search);
  const next = selectionParams(draft);
  for (const key of SELECTION_QUERY_KEYS) params.set(key, next[key]);
  const qs = params.toString();
  return `${pathname}${qs ? `?${qs}` : ''}${hash}`;
}

/**
 * A single stylePreset can follow the committed style so reload does not replay a stale link.
 * Comma-separated legacy presets stay intact because they also carry comparison references.
 */
export function urlWithAlignedStylePreset(pathname: string, search: string, hash: string, styleId: string): string | null {
  const params = readParams(search);
  const current = params.get('stylePreset');
  if (!current || current.includes(',') || current === styleId) return null;
  params.set('stylePreset', styleId);
  const qs = params.toString();
  return `${pathname}${qs ? `?${qs}` : ''}${hash}`;
}
