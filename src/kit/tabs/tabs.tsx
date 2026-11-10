'use client';

// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Web Stylebook

import { useId, useLayoutEffect, useRef, useState, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import '../theme.css';
import './tabs.css';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export interface TabItem<T extends string = string> {
  value: T;
  label: ReactNode;
  /** A small number after the label. */
  count?: number;
  disabled?: boolean;
  /** Kept mounted while another tab is selected, so its state survives. */
  content: ReactNode;
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export interface TabsProps<T extends string> extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Names the tab list for screen readers. */
  label: string;
  value: T;
  onValueChange: (value: T) => void;
  items: ReadonlyArray<TabItem<T>>;
}

function placeIndicator(list: HTMLElement, indicator: HTMLElement, slide: boolean) {
  const active = list.querySelector<HTMLElement>('[aria-selected="true"]');
  indicator.toggleAttribute('data-slide', slide);
  indicator.toggleAttribute('hidden', !active);
  if (!active) return;
  indicator.style.width = `${active.offsetWidth}px`;
  indicator.style.transform = `translateX(${active.offsetLeft}px)`;
}

/** Related content in one place, one panel at a time. The indicator slides on a click and jumps on a key press. */
export function Tabs<T extends string>({ label, value, onValueChange, items, className, ...rest }: TabsProps<T>) {
  const id = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const skipSlide = useRef(true);
  const [panelStop, setPanelStop] = useState(false);
  // By position: a value may hold characters an id cannot.
  const tabId = (index: number) => `${id}-tab-${index}`;
  const panelId = (index: number) => `${id}-panel-${index}`;

  useLayoutEffect(() => {
    if (listRef.current && indicatorRef.current) placeIndicator(listRef.current, indicatorRef.current, !skipSlide.current);
    skipSlide.current = false;
  });

  // On a new tab only, so a re-render leaves a hand-scrolled list alone. Only
  // the list scrolls: scrollIntoView would also move the page.
  useLayoutEffect(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!list || !active) return;
    if (active.offsetLeft < list.scrollLeft) list.scrollLeft = active.offsetLeft;
    else if (active.offsetLeft + active.offsetWidth > list.scrollLeft + list.clientWidth) list.scrollLeft = active.offsetLeft + active.offsetWidth - list.clientWidth;
  }, [value]);

  useLayoutEffect(() => {
    const list = listRef.current;
    const indicator = indicatorRef.current;
    if (!list || !indicator) return;
    const observer = new ResizeObserver(() => placeIndicator(list, indicator, false));
    observer.observe(list);
    return () => observer.disconnect();
  }, []);

  // APG: the panel is a tab stop only when it contains nothing focusable.
  useLayoutEffect(() => {
    const panel = panelRef.current;
    setPanelStop(Boolean(panel) && !panel?.querySelector(FOCUSABLE));
    if (!panel) return;
    panel.style.animation = 'none';
    void panel.offsetWidth;
    panel.style.animation = '';
  }, [value]);

  function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    // Alt+Left is the browser's Back.
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const enabled = items.flatMap((item, position) => (item.disabled ? [] : [position]));
    const here = enabled.indexOf(index);
    const targets: Record<string, number | undefined> = {
      ArrowRight: enabled[(here + 1) % enabled.length],
      ArrowLeft: enabled[(here - 1 + enabled.length) % enabled.length],
      Home: enabled[0],
      End: enabled[enabled.length - 1],
    };
    const target = targets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    skipSlide.current = true;
    onValueChange(items[target].value);
    listRef.current?.querySelectorAll<HTMLElement>('[role="tab"]')[target]?.focus();
  }

  const current = items.find((item) => item.value === value);
  // Keeps the list reachable when the selected tab is disabled or missing.
  const hasFocusableSelection = Boolean(current && !current.disabled);
  const firstEnabled = items.findIndex((item) => !item.disabled);

  return (
    <div {...rest} className={cx('ws-tabs', className)}>
      <div ref={listRef} className="ws-tabs__list" role="tablist" aria-label={label}>
        <span ref={indicatorRef} className="ws-tabs__indicator" aria-hidden="true" />
        {items.map((item, index) => {
          const selected = item.value === value;
          return (
            <button
              key={item.value}
              type="button"
              className="ws-tabs__tab"
              id={tabId(index)}
              role="tab"
              aria-selected={selected}
              aria-controls={panelId(index)}
              tabIndex={(selected && !item.disabled) || (!hasFocusableSelection && index === firstEnabled) ? 0 : -1}
              disabled={item.disabled}
              onClick={() => onValueChange(item.value)}
              onKeyDown={(event) => move(event, index)}
            >
              {item.label}
              {item.count !== undefined ? <span className="ws-tabs__count">{item.count}</span> : null}
            </button>
          );
        })}
      </div>
      {items.map((item, index) => {
        const selected = item.value === value;
        return (
          <div
            key={item.value}
            ref={selected ? panelRef : undefined}
            className="ws-tabs__panel"
            id={panelId(index)}
            role="tabpanel"
            aria-labelledby={tabId(index)}
            hidden={selected ? undefined : true}
            tabIndex={selected && panelStop ? 0 : undefined}
          >
            {item.content}
          </div>
        );
      })}
    </div>
  );
}
