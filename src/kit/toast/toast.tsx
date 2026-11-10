'use client';

// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Web Stylebook

import {
  isValidElement,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';
import '../theme.css';
import './toast.css';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export type ToastTone = 'neutral' | 'positive' | 'caution' | 'critical';

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  /** Shows a spinner and stays until updated or dismissed. */
  busy?: boolean;
  action?: { label: string; onClick: () => void };
  /** Milliseconds on screen. Defaults to 5000, or 9000 with an action. */
  duration?: number;
}

interface Entry extends ToastOptions {
  id: string;
  leaving: boolean;
  /** Bumped on update, so the timer starts again with the new content. */
  version: number;
}

/* Store. A plain module, so toast() works from any event handler. */

/** Reads --ws-duration, which is 0ms under prefers-reduced-motion. */
function durationMs(): number {
  if (typeof document === 'undefined') return 0;
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--ws-duration').trim();
  if (!raw) return 200;
  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value) || value <= 0) return 0;
  return /ms$/i.test(raw) || !/s$/i.test(raw) ? value : value * 1000;
}

const EMPTY: Entry[] = [];
let entries: Entry[] = EMPTY;
let nextId = 0;
const listeners = new Set<() => void>();

function commit(next: Entry[]) {
  entries = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function dismiss(id?: string) {
  const leaving = entries.filter((entry) => !entry.leaving && (id === undefined || entry.id === id));
  if (!leaving.length) return;
  const ids = new Set(leaving.map((entry) => entry.id));
  const ms = durationMs();
  if (ms === 0) {
    commit(entries.filter((entry) => !ids.has(entry.id)));
    return;
  }
  commit(entries.map((entry) => (ids.has(entry.id) ? { ...entry, leaving: true } : entry)));
  window.setTimeout(() => commit(entries.filter((entry) => !ids.has(entry.id))), ms);
}

/** Shows a toast and returns its id. Render one <Toaster /> near the root of the app. */
export function toast(options: ToastOptions): string {
  nextId += 1;
  const id = `ws-toast-${nextId}`;
  commit([{ ...options, id, leaving: false, version: 0 }, ...entries]);
  return id;
}

/** Changes a toast in place: a busy toast becomes its result. The timer restarts. */
toast.update = (id: string, patch: Partial<ToastOptions>) => {
  commit(entries.map((entry) => (entry.id === id ? { ...entry, ...patch, version: entry.version + 1 } : entry)));
};

/** Dismisses one toast, or all of them with no id. */
toast.dismiss = dismiss;

/* Card */

const icons: Record<ToastTone, ReactNode> = {
  neutral: (
    <>
      <circle cx="8" cy="8" r="6.75" fill="currentColor" />
      <path d="M8 7.25v3.5M8 5.25v.01" stroke="var(--ws-color-panel)" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  positive: (
    <>
      <circle cx="8" cy="8" r="6.75" fill="currentColor" />
      <path d="M5 8.25l2 2 4-4.25" stroke="var(--ws-color-panel)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  caution: (
    <>
      <path d="M8 1.75c.46 0 .88.24 1.1.64l6 10.4a1.28 1.28 0 0 1-1.1 1.91H2a1.28 1.28 0 0 1-1.1-1.91l6-10.4c.22-.4.64-.64 1.1-.64z" fill="currentColor" />
      <path d="M8 6.25v3.25M8 11.75v.01" stroke="var(--ws-color-panel)" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  critical: (
    <>
      <circle cx="8" cy="8" r="6.75" fill="currentColor" />
      <path d="M5.75 5.75l4.5 4.5M10.25 5.75l-4.5 4.5" stroke="var(--ws-color-panel)" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
};

export interface ToastCardProps extends ToastOptions {
  /** The close button's name. Without it, the card has no close button. */
  closeLabel?: string;
  onClose?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

/** The toast surface on its own, for static previews. Use toast() in an app. */
export function ToastCard({ title, description, tone = 'neutral', busy = false, action, closeLabel, onClose, className }: ToastCardProps) {
  return (
    <div className={cx('ws-toast', className)} data-tone={tone}>
      <span className="ws-toast__mark" aria-hidden="true">
        {busy ? (
          <span className="ws-toast__spinner" />
        ) : (
          <svg viewBox="0 0 16 16" fill="none">
            {icons[tone]}
          </svg>
        )}
      </span>
      <div className="ws-toast__text">
        <p className="ws-toast__title">{title}</p>
        {description ? <p className="ws-toast__description">{description}</p> : null}
      </div>
      {action ? (
        <button
          type="button"
          className="ws-toast__action"
          onClick={(event) => {
            action.onClick();
            onClose?.(event);
          }}
        >
          {action.label}
        </button>
      ) : null}
      {closeLabel ? (
        <button type="button" className="ws-toast__close" aria-label={closeLabel} onClick={onClose}>
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}

/* Stack */

const GAP = 8;
const VISIBLE = 3;
const PEEK = 10;
const SHRINK = 0.05;
const SWIPE_DISMISS = 80;

interface Slot {
  y: number;
  scale: number;
  height: number | undefined;
  opacity: number;
}

function ToastItem({
  entry,
  slot,
  covered,
  paused,
  closeLabel,
  onHeight,
  onStackEmptied,
}: {
  entry: Entry;
  slot: Slot | undefined;
  covered: boolean;
  paused: boolean;
  closeLabel: string;
  onHeight: (id: string, height: number) => void;
  onStackEmptied: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState<{ startX: number; x: number; id: number } | null>(null);
  // A leaving toast has no slot and stays where it was while it fades.
  const [held, setHeld] = useState(slot);
  if (slot && (!held || slot.y !== held.y || slot.scale !== held.scale || slot.height !== held.height || slot.opacity !== held.opacity)) {
    setHeld(slot);
  }

  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    onHeight(entry.id, card.offsetHeight);
    const observer = new ResizeObserver(() => onHeight(entry.id, card.offsetHeight));
    observer.observe(card);
    return () => observer.disconnect();
  }, [entry.id, onHeight]);

  const remaining = useRef(0);
  const { busy, action, duration, version, leaving, id } = entry;
  const lifetime = duration ?? (action ? 9000 : 5000);

  // A new version restarts the clock with the full lifetime.
  useEffect(() => {
    remaining.current = lifetime;
  }, [lifetime, version]);

  useEffect(() => {
    if (busy || leaving || paused) return;
    const startedAt = performance.now();
    const timer = window.setTimeout(() => toast.dismiss(id), remaining.current);
    return () => {
      window.clearTimeout(timer);
      remaining.current = Math.max(0, remaining.current - (performance.now() - startedAt));
    };
  }, [busy, leaving, paused, id, version]);

  function close(event: MouseEvent<HTMLButtonElement>) {
    // Keyboard activation has detail 0. Focus moves to a neighbor before this
    // toast goes, so the keyboard user keeps their place in the stack.
    if (event.detail === 0) {
      const item = event.currentTarget.closest('li');
      // A toast that is already leaving cannot hold focus.
      const staying = [...(item?.parentElement?.children ?? [])].filter((li) => li === item || !li.hasAttribute('data-leaving'));
      const position = staying.indexOf(item as Element);
      const neighbor = (staying[position + 1] ?? staying[position - 1])?.querySelector('button');
      if (neighbor) neighbor.focus();
      else onStackEmptied();
    }
    toast.dismiss(id);
  }

  function onPointerDown(event: ReactPointerEvent<HTMLLIElement>) {
    if (event.button !== 0 || (event.target as HTMLElement).closest('button')) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({ startX: event.clientX, x: 0, id: event.pointerId });
  }

  function onPointerMove(event: ReactPointerEvent<HTMLLIElement>) {
    if (drag?.id === event.pointerId) setDrag({ ...drag, x: Math.max(0, event.clientX - drag.startX) });
  }

  function onPointerEnd() {
    // A dismissed toast keeps its offset and fades where the finger left it.
    if (drag && drag.x >= SWIPE_DISMISS) toast.dismiss(id);
    else setDrag(null);
  }

  const place = held ?? { y: 0, scale: 1, height: undefined, opacity: 1 };
  const style = {
    '--ws-toast-y': `${place.y}px`,
    '--ws-toast-scale': place.scale,
    '--ws-toast-x': `${drag?.x ?? 0}px`,
    height: place.height,
    opacity: place.opacity,
  } as CSSProperties;

  return (
    <li
      className="ws-toaster__item"
      style={style}
      data-covered={covered ? '' : undefined}
      data-leaving={leaving ? '' : undefined}
      data-dragging={drag ? '' : undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
    >
      <div ref={cardRef} id={entry.id}>
        <ToastCard {...entry} closeLabel={closeLabel} onClose={close} />
      </div>
    </li>
  );
}

export interface ToasterProps {
  /** Names the notification region for screen readers. */
  label?: string;
  /** The close button's name on every toast. */
  closeLabel?: string;
}

/**
 * Renders the toasts. Newer toasts cover older ones; hover or keyboard focus
 * fans the stack out and stops every timer. Drag a toast right to dismiss it.
 * Render it outside any transformed element, because it uses position: fixed.
 */
function textOf(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).filter(Boolean).join(' ');
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return '';
}

function raiseToaster(element: HTMLElement) {
  if (typeof element.showPopover !== 'function') return;
  try {
    if (element.matches(':popover-open')) element.hidePopover();
    element.showPopover();
  } catch {
    // The element is not connected yet, or this browser has no popover.
  }
}

export function Toaster({ label = 'Notifications', closeLabel = 'Dismiss' }: ToasterProps) {
  const items = useSyncExternalStore(subscribe, () => entries, () => EMPTY);
  const rootRef = useRef<HTMLElement>(null);
  const politeRef = useRef<HTMLDivElement>(null);
  const assertiveRef = useRef<HTMLDivElement>(null);
  const announced = useRef(new Set<string>());
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [heights, setHeights] = useState<Record<string, number>>({});
  const listRef = useRef<HTMLOListElement>(null);
  const focusBefore = useRef<HTMLElement | null>(null);
  const restoreFocus = useCallback(() => focusBefore.current?.focus(), []);
  const measure = useCallback((id: string, height: number) => {
    setHeights((current) => (current[id] === height ? current : { ...current, [id]: height }));
  }, []);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;
    raiseToaster(element);
    const onToggle = (event: Event) => {
      const target = event.target;
      if (target instanceof HTMLDialogElement && target.open) raiseToaster(element);
    };
    document.addEventListener('toggle', onToggle, true);
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        const target = record.target;
        if (target instanceof HTMLDialogElement && target.hasAttribute('open')) raiseToaster(element);
      }
    });
    if (document.body) observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['open'] });
    return () => {
      document.removeEventListener('toggle', onToggle, true);
      observer.disconnect();
      if (element.matches(':popover-open')) {
        try {
          element.hidePopover();
        } catch {
          // Already hidden.
        }
      }
    };
  }, []);

  useEffect(() => {
    for (const entry of items) {
      if (entry.leaving || announced.current.has(entry.id)) continue;
      announced.current.add(entry.id);
      const region = entry.tone === 'critical' ? assertiveRef.current : politeRef.current;
      const text = [textOf(entry.title), textOf(entry.description)].filter(Boolean).join('. ');
      if (!region || !text) continue;
      const node = document.createElement('p');
      node.textContent = text;
      region.appendChild(node);
    }
  }, [items]);

  // A toast removed under the pointer fires no pointerleave, so the first move
  // that lands outside the stack ends the hover.
  useEffect(() => {
    if (!hovered) return;
    function onMove(event: PointerEvent) {
      if (!listRef.current?.contains(event.target as Node)) setHovered(false);
    }
    document.addEventListener('pointermove', onMove);
    return () => document.removeEventListener('pointermove', onMove);
  }, [hovered]);

  const live = items.filter((entry) => !entry.leaving);
  const expanded = (hovered || focused) && live.length > 0;

  // A removed toast fires no pointerleave. Without this, the next toast would
  // arrive to a stack that still counts as hovered and never time out.
  if (live.length === 0 && (hovered || focused)) {
    setHovered(false);
    setFocused(false);
  }

  const slots = new Map<string, Slot>();
  const frontHeight = heights[live[0]?.id];
  let offset = 0;
  live.forEach((entry, index) => {
    const own = heights[entry.id];
    slots.set(
      entry.id,
      expanded
        ? { y: -offset, scale: 1, height: own, opacity: 1 }
        : { y: -index * PEEK, scale: 1 - index * SHRINK, height: frontHeight, opacity: index < VISIBLE ? 1 : 0 },
    );
    offset += (own ?? 0) + GAP;
  });

  // Rendered even when empty: a live region has to exist before its first
  // toast, or screen readers will not announce that toast.
  return (
    <section ref={rootRef} className="ws-toaster" aria-label={label} popover="manual">
      <div ref={politeRef} className="ws-toaster__announce" aria-live="polite" aria-relevant="additions" />
      <div ref={assertiveRef} className="ws-toaster__announce" aria-live="assertive" aria-relevant="additions" />
      <ol
        ref={listRef}
        className="ws-toaster__list"
        data-expanded={expanded ? '' : undefined}
        onPointerEnter={(event) => {
          if (event.pointerType !== 'touch') setHovered(true);
        }}
        onPointerLeave={() => setHovered(false)}
        onFocus={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) focusBefore.current = event.relatedTarget as HTMLElement | null;
          // A mouse press also focuses a button. Only keyboard focus holds the stack open.
          if (event.target.matches(':focus-visible')) setFocused(true);
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
        }}
      >
        {items.map((entry) => (
          <ToastItem
            key={entry.id}
            entry={entry}
            slot={slots.get(entry.id)}
            covered={!expanded && live.indexOf(entry) > 0}
            paused={expanded}
            closeLabel={closeLabel}
            onHeight={measure}
            onStackEmptied={restoreFocus}
          />
        ))}
      </ol>
    </section>
  );
}
