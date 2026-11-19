'use client';

// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Web Stylebook

import { useEffect, useLayoutEffect, useRef, useState, type CompositionEvent, type KeyboardEvent, type RefObject } from 'react';

// Shared by Tooltip, Select, and Menu. Installed with them.

export type Side = 'top' | 'right' | 'bottom' | 'left';

const OPPOSITE: Record<Side, Side> = { top: 'bottom', right: 'left', bottom: 'top', left: 'right' };
const EDGE = 8;

export interface PlaceOptions {
  side: Side;
  /** Along the anchor's edge. 'start' lines up left edges, for a list under its trigger. */
  align?: 'center' | 'start';
  gap?: number;
  /** Makes the overlay at least as wide as the anchor. */
  matchWidth?: boolean;
  /** Shortens a scrolling list so it fits on the side with the most room. */
  fitHeight?: boolean;
}

/** The first element at or under this one that has a box. A wrapper with display: contents has none. */
export function boxOf(element: Element): Element {
  if (element.getClientRects().length) return element;
  for (const child of element.children) {
    const box = boxOf(child);
    if (box.getClientRects().length) return box;
  }
  return element;
}

/** Positions a top-layer element next to its anchor. Flips when there is no room, and stays on screen. */
export function placeOverlay(overlay: HTMLElement, anchorElement: Element, { side, align = 'center', gap = 8, matchWidth = false, fitHeight = false }: PlaceOptions) {
  const anchor = anchorElement.getBoundingClientRect();
  if (matchWidth) overlay.style.minWidth = `${anchor.width}px`;
  if (fitHeight) {
    const stacked = side === 'top' || side === 'bottom';
    const available = stacked ? Math.max(anchor.top, window.innerHeight - anchor.bottom) - gap - EDGE : window.innerHeight - EDGE * 2;
    overlay.style.maxHeight = `${Math.min(parseFloat(getComputedStyle(overlay).maxHeight) || Infinity, available)}px`;
  }
  // Layout size: an entrance may be scaled down at this moment.
  const width = overlay.offsetWidth;
  const height = overlay.offsetHeight;

  const room: Record<Side, number> = {
    top: anchor.top,
    bottom: window.innerHeight - anchor.bottom,
    left: anchor.left,
    right: window.innerWidth - anchor.right,
  };
  const needed = (candidate: Side) => (candidate === 'top' || candidate === 'bottom' ? height : width) + gap + EDGE;
  const placed = room[side] >= needed(side) || room[OPPOSITE[side]] < needed(OPPOSITE[side]) ? side : OPPOSITE[side];

  const alongX = align === 'start' ? anchor.left : anchor.left + anchor.width / 2 - width / 2;
  const alongY = align === 'start' ? anchor.top : anchor.top + anchor.height / 2 - height / 2;
  const clampX = (value: number) => Math.min(Math.max(EDGE, value), window.innerWidth - width - EDGE);
  const clampY = (value: number) => Math.min(Math.max(EDGE, value), window.innerHeight - height - EDGE);
  // Clamped on both axes: with no room on either side, it covers the anchor rather than leave the screen.
  const left = clampX(placed === 'left' ? anchor.left - gap - width : placed === 'right' ? anchor.right + gap : alongX);
  const top = clampY(placed === 'top' ? anchor.top - gap - height : placed === 'bottom' ? anchor.bottom + gap : alongY);

  overlay.style.left = `${left}px`;
  overlay.style.top = `${top}px`;
  // It grows out of the point on its edge nearest the anchor.
  overlay.style.transformOrigin = {
    top: `${anchor.left + anchor.width / 2 - left}px 100%`,
    bottom: `${anchor.left + anchor.width / 2 - left}px 0%`,
    left: `100% ${anchor.top + anchor.height / 2 - top}px`,
    right: `0% ${anchor.top + anchor.height / 2 - top}px`,
  }[placed];
}

/** Shows a popover list while open, and closes it on an outside press, a page scroll, or a resize. */
export function usePopoverList(
  open: boolean,
  close: () => void,
  overlayRef: RefObject<HTMLElement | null>,
  anchorRef: RefObject<HTMLElement | null>,
  place: PlaceOptions,
) {
  const { side, align, gap, matchWidth, fitHeight } = place;

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const anchor = anchorRef.current;
    if (!open || !overlay || !anchor) return;
    overlay.showPopover();
    placeOverlay(overlay, boxOf(anchor), { side, align, gap, matchWidth, fitHeight });
  }, [open, overlayRef, anchorRef, side, align, gap, matchWidth, fitHeight]);

  useEffect(() => {
    if (!open) return;
    const outside = (target: EventTarget | null) => !overlayRef.current?.contains(target as Node) && !anchorRef.current?.contains(target as Node);
    // close() flips `open` and this effect cleans up before the click that
    // follows the pointerdown. The swallow has to outlive that cleanup, and
    // it has to be gone before the next gesture: the click, pointercancel,
    // and a timeout after pointerup each drop it.
    let swallow: ((event: MouseEvent) => void) | null = null;
    let endGesture: ((event: PointerEvent) => void) | null = null;
    let dropTimer = 0;
    function disarm() {
      window.clearTimeout(dropTimer);
      if (swallow) window.removeEventListener('click', swallow, true);
      if (endGesture) {
        window.removeEventListener('pointerup', endGesture, true);
        window.removeEventListener('pointercancel', endGesture, true);
      }
      swallow = null;
      endGesture = null;
    }
    function scheduleDisarm(ms: number) {
      window.clearTimeout(dropTimer);
      dropTimer = window.setTimeout(disarm, ms);
    }
    function armDialogSwallow() {
      disarm();
      swallow = (event: MouseEvent) => {
        event.stopPropagation();
        disarm();
      };
      endGesture = (event: PointerEvent) => {
        if (event.type === 'pointercancel') {
          disarm();
          return;
        }
        scheduleDisarm(0);
      };
      window.addEventListener('click', swallow, true);
      window.addEventListener('pointerup', endGesture, true);
      window.addEventListener('pointercancel', endGesture, true);
      scheduleDisarm(4000);
    }
    const onPress = (event: PointerEvent) => {
      if (!outside(event.target)) return;
      if (event.target instanceof HTMLDialogElement && event.button === 0) armDialogSwallow();
      close();
    };
    // Only a scroll that moves the anchor matters. An unrelated scrolling log does not.
    const onScroll = (event: Event) => {
      if (event.target instanceof Node && anchorRef.current && event.target.contains(anchorRef.current)) close();
    };
    document.addEventListener('pointerdown', onPress);
    window.addEventListener('scroll', onScroll, { capture: true, passive: true });
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('pointerdown', onPress);
      window.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('resize', close);
    };
  }, [open, close, overlayRef, anchorRef]);
}

/** Scrolls a popover list so the highlighted item shows. The page does not move. */
export function revealInList(list: HTMLElement | null) {
  const item = list?.querySelector<HTMLElement>('[data-active]');
  if (!list || !item) return;
  if (item.offsetTop < list.scrollTop) list.scrollTop = item.offsetTop;
  else if (item.offsetTop + item.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = item.offsetTop + item.offsetHeight - list.clientHeight;
}

export interface ListEntry {
  label: string;
  disabled?: boolean;
}

const TYPEAHEAD_RESET_MS = 500;

/** Which entry is highlighted, and how the keyboard moves it: arrows, Home, End, and typing a name. */
export function useListNavigation(entries: ListEntry[]) {
  const [storedActive, setActive] = useState(-1);
  // A list that shrank while open may no longer hold the stored index.
  const active = storedActive < entries.length ? storedActive : -1;
  const [keyboard, setKeyboard] = useState(false);
  const typed = useRef({ text: '', at: 0 });
  const composing = useRef(false);
  const skipKey = useRef('');

  const enabled = entries.flatMap((entry, index) => (entry.disabled ? [] : [index]));
  const first = enabled[0] ?? -1;
  const last = enabled.at(-1) ?? -1;

  function next(from: number, direction: 1 | -1) {
    if (!enabled.length) return -1;
    if (from < 0) return direction === 1 ? first : last;
    const position = enabled.indexOf(from);
    return enabled[(position + direction + enabled.length) % enabled.length];
  }

  function typeahead(character: string) {
    const now = Date.now();
    const text = (now - typed.current.at > TYPEAHEAD_RESET_MS ? '' : typed.current.text) + character.toLowerCase();
    typed.current = { text, at: now };
    // Repeating one letter cycles through the names that start with it.
    const repeated = [...text].every((letter) => letter === text[0]);
    const search = repeated ? text[0] : text;
    const ordered = [...enabled.filter((index) => index > active), ...enabled.filter((index) => index <= active)];
    const match = ordered.find((index) => entries[index].label.toLowerCase().startsWith(search));
    if (match !== undefined) setActive(match);
  }

  function onCompositionStart() {
    composing.current = true;
  }

  function onCompositionEnd(event: CompositionEvent<Element>) {
    composing.current = false;
    const text = event.data;
    if (!text) return;
    skipKey.current = text;
    typeahead(text);
  }

  /** Returns true when the key moved the highlight. */
  function moveWithKey(event: KeyboardEvent) {
    if (composing.current || event.nativeEvent.isComposing || event.key === 'Process' || event.key === 'Unidentified') return false;
    if (skipKey.current) {
      const skip = skipKey.current;
      skipKey.current = '';
      if (event.key === skip) return false;
    }
    const moves: Record<string, number | undefined> = {
      ArrowDown: next(active, 1),
      ArrowUp: next(active, -1),
      Home: first,
      End: last,
    };
    if (event.key in moves) {
      event.preventDefault();
      setKeyboard(true);
      setActive(moves[event.key] ?? -1);
      return true;
    }
    if (event.key.length === 1 && event.key !== ' ' && !event.metaKey && !event.ctrlKey && !event.altKey) {
      setKeyboard(true);
      typeahead(event.key);
      return true;
    }
    return false;
  }

  function hover(index: number) {
    setKeyboard(false);
    setActive(entries[index].disabled ? -1 : index);
  }

  return { active, setActive, keyboard, setKeyboard, moveWithKey, hover, first, last, onCompositionStart, onCompositionEnd };
}
