import { describe, expect, it } from 'vitest';
import { createPairedScrollLock, pairedScrollTop, type FixtureRegion, type PaneSnapshot } from '../../src/visual/pairedScroll';

// Review of 1cbe3d8: the echo record now stays until the moved pane really moves. These cases check
// that a reader who scrolls that pane is never ignored for longer than the 1px echo tolerance,
// including returning to exactly the position the other pane wrote.
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
const pane = (scrollTop: number, regions: FixtureRegion[], maxScroll: number, clientHeight = 320): PaneSnapshot => ({ scrollTop, maxScroll, clientHeight, regions });

/** Simulates the hook: a scroll event runs follow(); a write is applied to the other pane, which then fires its own event. */
function harness(leftMax: number, rightMax: number) {
  const lock = createPairedScrollLock();
  const panes = { left: pane(0, sourceRegions, leftMax), right: pane(0, targetRegions, rightMax) };
  const writes: string[] = [];
  const fire = (id: 'left' | 'right', depth = 0) => {
    const other = id === 'left' ? 'right' : 'left';
    const write = lock.follow(id, panes[id], other, panes[other], true);
    if (!write) return;
    writes.push(`${id}->${other}:${write.scrollTop}`);
    panes[other].scrollTop = Math.min(write.scrollTop, panes[other].maxScroll);
    if (depth < 4) fire(other, depth + 1);
  };
  const scroll = (id: 'left' | 'right', top: number) => {
    panes[id].scrollTop = top;
    fire(id);
  };
  return { lock, panes, writes, scroll, fire };
}

describe('paired scroll echo record (review of 1cbe3d8)', () => {
  it('lets the reader scroll the moved pane away and back to exactly the written position, and it leads both times', () => {
    const h = harness(500, 800);
    h.scroll('left', 250);
    expect(h.writes).toEqual(['left->right:375']);
    // The reader now scrolls the right pane away from where the left pane put it...
    h.scroll('right', 420);
    expect(h.writes.at(-1)).toBe(`right->left:${pairedScrollTop(targetRegions, 420, sourceRegions, 500)}`);
    // ...and back to exactly the written position: it must lead, not be taken for an echo.
    h.scroll('right', 375);
    expect(h.writes.at(-1)).toBe('right->left:250');
    expect(h.panes.left.scrollTop).toBe(250);
  });

  it('ignores a repeated echo of a clamped pane, then lets the reader lead from there', () => {
    const h = harness(500, 200);
    h.scroll('left', 250);
    expect(h.panes.right.scrollTop).toBe(200);
    const before = h.writes.length;
    h.fire('right');
    h.fire('right');
    expect(h.writes.length).toBe(before);
    expect(h.panes.left.scrollTop).toBe(250);
    h.scroll('right', 120);
    expect(h.writes.at(-1)).toBe(`right->left:${pairedScrollTop(targetRegions, 120, sourceRegions, 500)}`);
  });

  it('only swallows a reader movement within the 1px tolerance; the next real step leads', () => {
    const h = harness(500, 800);
    h.scroll('left', 250);
    const before = h.writes.length;
    h.scroll('right', 375.8);
    expect(h.writes.length).toBe(before);
    h.scroll('right', 377);
    expect(h.writes.length).toBe(before + 1);
    expect(h.writes.at(-1)!.startsWith('right->left:')).toBe(true);
  });

  it('a newer write replaces the record, so the older written position is free for the reader', () => {
    const h = harness(500, 800);
    h.scroll('left', 250); // right written at 375
    h.scroll('left', 100); // right written at 300, record replaced
    expect(h.panes.right.scrollTop).toBe(300);
    h.scroll('right', 375); // the older written position: a real reader scroll now
    expect(h.writes.at(-1)).toBe('right->left:250');
  });

  it('turning pairing off clears the record', () => {
    const h = harness(500, 800);
    h.scroll('left', 250);
    expect(h.lock.follow('right', h.panes.right, 'left', h.panes.left, false)).toBeNull();
    h.panes.left.scrollTop = 0;
    expect(h.lock.follow('right', h.panes.right, 'left', h.panes.left, true)?.scrollTop).toBe(250);
  });
});
