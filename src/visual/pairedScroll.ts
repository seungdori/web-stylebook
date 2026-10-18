export interface FixtureRegion {
  id: string;
  start: number;
  end: number;
}

export interface PaneSnapshot {
  scrollTop: number;
  maxScroll: number;
  clientHeight: number;
  regions: readonly FixtureRegion[];
}

export interface PairedScrollWrite {
  scrollTop: number;
  /** Programmatic sync stays instant. A smooth scroll would emit intermediate positions and drag the other pane. */
  behavior: 'auto';
}

export function normalizeRegions(regions: readonly FixtureRegion[]): FixtureRegion[] {
  return regions
    .filter((region) => region.id.length > 0 && region.end > region.start)
    .map((region) => ({ id: region.id, start: region.start, end: region.end }))
    .sort((left, right) => left.start - right.start || left.id.localeCompare(right.id));
}

export function regionAnchor(regions: readonly FixtureRegion[], scrollTop: number): { id: string; progress: number } | null {
  const ordered = normalizeRegions(regions);
  if (!ordered.length) return null;
  const top = Math.max(0, scrollTop);
  let index = 0;
  for (let cursor = 0; cursor < ordered.length; cursor += 1) {
    if (ordered[cursor].start <= top + 0.5) index = cursor;
  }
  const region = ordered[index];
  const next = ordered[index + 1];
  const span = Math.max((next ? next.start : region.end) - region.start, 1);
  const progress = Math.min(1, Math.max(0, (top - region.start) / span));
  return { id: region.id, progress };
}

export function scrollTopForAnchor(regions: readonly FixtureRegion[], anchor: { id: string; progress: number }, maxScroll: number): number | null {
  const ordered = normalizeRegions(regions);
  const index = ordered.findIndex((region) => region.id === anchor.id);
  if (index < 0) return null;
  const region = ordered[index];
  const next = ordered[index + 1];
  const span = Math.max((next ? next.start : region.end) - region.start, 1);
  const top = region.start + Math.min(1, Math.max(0, anchor.progress)) * span;
  return Math.min(Math.max(0, maxScroll), top);
}

/** Map by shared fixture region. A missing region does not fall back to the source pixel offset. */
export function pairedScrollTop(sourceRegions: readonly FixtureRegion[], sourceScrollTop: number, targetRegions: readonly FixtureRegion[], targetMaxScroll: number): number | null {
  const anchor = regionAnchor(sourceRegions, sourceScrollTop);
  if (!anchor) return null;
  return scrollTopForAnchor(targetRegions, anchor, targetMaxScroll);
}

export function paneScrollBehavior(reducedMotion: boolean, paired: boolean): 'auto' | 'smooth' {
  if (reducedMotion || paired) return 'auto';
  return 'smooth';
}

export function scrollDeltaForKey(key: string, modifiers: { shift?: boolean; alt?: boolean; ctrl?: boolean; meta?: boolean }, metrics: { scrollTop: number; clientHeight: number; scrollHeight: number }): number | null {
  if (modifiers.alt || modifiers.ctrl || modifiers.meta) return null;
  const page = Math.max(metrics.clientHeight - 48, 48);
  if (key === 'ArrowDown') return 48;
  if (key === 'ArrowUp') return -48;
  if (key === 'PageDown' || (key === ' ' && !modifiers.shift)) return page;
  if (key === 'PageUp' || (key === ' ' && modifiers.shift)) return -page;
  if (key === 'Home') return -metrics.scrollTop;
  if (key === 'End') return Math.max(0, metrics.scrollHeight - metrics.scrollTop);
  return null;
}

export function createPairedScrollLock() {
  const echoed = new Map<string, number>();
  return {
    follow(sourceId: string, source: PaneSnapshot, targetId: string, target: PaneSnapshot, enabled: boolean): PairedScrollWrite | null {
      if (!enabled) {
        echoed.clear();
        return null;
      }
      const echo = echoed.get(sourceId);
      if (echo !== undefined && Math.abs(echo - source.scrollTop) <= 1) {
        echoed.delete(sourceId);
        return null;
      }
      if (echo !== undefined) echoed.delete(sourceId);
      if (source.clientHeight <= 0 || target.clientHeight <= 0) return null;
      const scrollTop = pairedScrollTop(source.regions, source.scrollTop, target.regions, target.maxScroll);
      if (scrollTop === null || Math.abs(scrollTop - target.scrollTop) <= 1) return null;
      echoed.set(targetId, scrollTop);
      return { scrollTop, behavior: 'auto' };
    },
  };
}
