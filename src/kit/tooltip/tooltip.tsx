'use client';

// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Web Stylebook

import {
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import '../theme.css';
import './tooltip.css';
import { boxOf, placeOverlay, type Side } from '../overlay/overlay';

// Pointer travel from the trigger onto the tooltip. Long enough to cross the gap.
const CLOSE_DELAY = 90;
// After a tooltip closes, the next one opens at once for this long.
const WARM_MS = 500;

// One tooltip at a time, across every instance on the page.
let warmUntil = 0;
let closeOpenTooltip: (() => void) | null = null;

// Props a parent such as Menu passes to the trigger reach the element itself.
function forwardToTrigger(own: Record<string, unknown>, child: Record<string, unknown>) {
  const merged = { ...own };
  for (const [key, value] of Object.entries(own)) {
    const existing = child[key];
    if (typeof value === 'function' && typeof existing === 'function') {
      merged[key] = (...args: unknown[]) => {
        existing(...args);
        value(...args);
      };
    }
  }
  return merged;
}

export interface TooltipProps extends Omit<HTMLAttributes<HTMLElement>, 'content' | 'children'> {
  /** A short hint that adds to the trigger's name. Do not put the only copy of anything here. */
  content: ReactNode;
  /** The preferred side. Flips when there is no room. */
  side?: Side;
  /** Wait before the first tooltip opens, in milliseconds. */
  delay?: number;
  /** One focusable element. It receives aria-describedby while the tooltip is open. */
  children: ReactElement<Record<string, unknown>>;
}

/**
 * A hint for one control, shown on hover and keyboard focus. Stays open while
 * the pointer is on it, closes on Escape, and opens instantly once one is warm.
 */
export function Tooltip({ content, side = 'top', delay = 450, children, ...triggerProps }: TooltipProps) {
  const id = useId();
  const anchorRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const timer = useRef(0);
  const [open, setOpen] = useState<null | 'animated' | 'instant'>(null);

  const close = useCallback(() => {
    window.clearTimeout(timer.current);
    setOpen(null);
  }, []);

  const show = useCallback(() => {
    window.clearTimeout(timer.current);
    const warm = performance.now() < warmUntil || closeOpenTooltip !== null;
    const reveal = () => setOpen((current) => current ?? (warm ? 'instant' : 'animated'));
    if (warm) reveal();
    else timer.current = window.setTimeout(reveal, delay);
  }, [delay]);

  const closeSoon = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(close, CLOSE_DELAY);
  }, [close]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useLayoutEffect(() => {
    const tip = tipRef.current;
    const anchor = anchorRef.current;
    if (!open || !tip || !anchor) return;
    tip.showPopover();

    placeOverlay(tip, boxOf(anchor), { side });
  }, [open, side]);

  useEffect(() => {
    if (!open) return;
    if (closeOpenTooltip && closeOpenTooltip !== close) closeOpenTooltip();
    closeOpenTooltip = close;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      // Cancelled, so a Dialog around this tooltip stays open.
      event.preventDefault();
      close();
    }
    // Only a scroll that moves the trigger matters.
    function onScroll(event: Event) {
      if (event.target instanceof Node && anchorRef.current && event.target.contains(anchorRef.current)) close();
    }
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('scroll', onScroll, { capture: true, passive: true });
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('scroll', onScroll, { capture: true });
      if (closeOpenTooltip === close) closeOpenTooltip = null;
      warmUntil = performance.now() + WARM_MS;
    };
  }, [open, close]);

  // A hint that repeats the trigger's own name would be read twice.
  const describes = open && children.props['aria-label'] !== content;

  // A touch has no hover, and a tap should not leave a hint behind.
  function fromMouse(event: PointerEvent, run: () => void) {
    if (event.pointerType !== 'touch') run();
  }

  return (
    <>
      <span
        ref={anchorRef}
        className="ws-tooltip-anchor"
        onPointerEnter={(event) => fromMouse(event, show)}
        onPointerLeave={(event) => fromMouse(event, closeSoon)}
        onPointerDown={close}
        onFocus={(event) => {
          if (event.target.matches(':focus-visible')) show();
        }}
        onBlur={close}
      >
        {cloneElement(children, { ...forwardToTrigger(triggerProps, children.props), 'aria-describedby': describes ? id : children.props['aria-describedby'] })}
      </span>
      {open ? (
        <div
          ref={tipRef}
          id={id}
          className="ws-tooltip"
          role="tooltip"
          popover="manual"
          data-instant={open === 'instant' ? '' : undefined}
          onPointerEnter={() => window.clearTimeout(timer.current)}
          onPointerLeave={closeSoon}
        >
          {content}
        </div>
      ) : null}
    </>
  );
}
