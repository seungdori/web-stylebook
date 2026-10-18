import { useEffect, useRef, useState } from 'react';
import { createPairedScrollLock, paneScrollBehavior, scrollDeltaForKey, type FixtureRegion, type PaneSnapshot } from '../visual/pairedScroll';

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);
  return reduced;
}

function fixtureRegions(pane: HTMLElement): FixtureRegion[] {
  const origin = pane.getBoundingClientRect().top;
  const scrollTop = pane.scrollTop;
  const regions: FixtureRegion[] = [];
  for (const node of pane.querySelectorAll<HTMLElement>('[data-fixture-region]')) {
    const id = node.dataset.fixtureRegion;
    if (!id) continue;
    const rect = node.getBoundingClientRect();
    const start = rect.top - origin + scrollTop;
    regions.push({ id, start, end: start + rect.height });
  }
  return regions;
}

function snapshot(pane: HTMLDivElement): PaneSnapshot {
  return {
    scrollTop: pane.scrollTop,
    maxScroll: Math.max(0, pane.scrollHeight - pane.clientHeight),
    clientHeight: pane.clientHeight,
    regions: fixtureRegions(pane),
  };
}

export function usePairedCompareScroll(enabled: boolean, active: boolean) {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const behavior = paneScrollBehavior(reducedMotion, enabled);

  useEffect(() => {
    if (!active) return undefined;
    const left = leftRef.current;
    const right = rightRef.current;
    if (!left || !right) return undefined;
    const lock = createPairedScrollLock();
    const panes = { left, right };
    const onScroll = (sourceId: 'left' | 'right') => {
      const targetId = sourceId === 'left' ? 'right' : 'left';
      const write = lock.follow(sourceId, snapshot(panes[sourceId]), targetId, snapshot(panes[targetId]), enabled);
      if (!write) return;
      panes[targetId].scrollTop = write.scrollTop;
    };
    const onKey = (sourceId: 'left' | 'right', event: KeyboardEvent) => {
      const pane = panes[sourceId];
      if (event.target !== pane) return;
      const delta = scrollDeltaForKey(event.key, { shift: event.shiftKey, alt: event.altKey, ctrl: event.ctrlKey, meta: event.metaKey }, pane);
      if (delta === null) return;
      event.preventDefault();
      pane.scrollTop += delta;
    };
    const leftScroll = () => onScroll('left');
    const rightScroll = () => onScroll('right');
    const leftKey = (event: KeyboardEvent) => onKey('left', event);
    const rightKey = (event: KeyboardEvent) => onKey('right', event);
    left.addEventListener('scroll', leftScroll, { passive: true });
    right.addEventListener('scroll', rightScroll, { passive: true });
    left.addEventListener('keydown', leftKey);
    right.addEventListener('keydown', rightKey);
    return () => {
      left.removeEventListener('scroll', leftScroll);
      right.removeEventListener('scroll', rightScroll);
      left.removeEventListener('keydown', leftKey);
      right.removeEventListener('keydown', rightKey);
    };
  }, [enabled, active, reducedMotion]);

  return { leftRef, rightRef, reducedMotion, behavior };
}
