'use client';

// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Web Stylebook

import { useLayoutEffect, useRef, type HTMLAttributes, type KeyboardEvent, type ReactNode } from 'react';
import '../theme.css';
import './segmented-control.css';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export interface SegmentedOption<T extends string = string> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string> extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'role'> {
  /** The group's name for screen readers. */
  label: string;
  value: T;
  options: ReadonlyArray<SegmentedOption<T>>;
  onValueChange: (value: T) => void;
  /** 'md' lines up with a Button or Search Field. 'sm' is for dense toolbars. */
  size?: 'sm' | 'md';
  /** Adds a hidden input, so the value is sent with a form. */
  name?: string;
}

function placeThumb(root: HTMLElement, thumb: HTMLElement, slide: boolean) {
  const active = root.querySelector<HTMLElement>('[aria-checked="true"]');
  thumb.toggleAttribute('data-slide', slide);
  thumb.toggleAttribute('hidden', !active);
  root.setAttribute('data-ready', '');
  if (!active) return;
  // Measured, not computed: labels differ in width per language.
  thumb.style.width = `${active.offsetWidth}px`;
  thumb.style.height = `${active.offsetHeight}px`;
  thumb.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
}

/**
 * One choice from a short list. The thumb slides on a click and jumps on a
 * key press, because someone arrowing through options is not waiting to watch.
 */
export function SegmentedControl<T extends string>({
  label,
  value,
  options,
  onValueChange,
  size = 'md',
  name,
  className,
  ...rest
}: SegmentedControlProps<T>) {
  const rootRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const skipSlide = useRef(true);

  // Runs on every commit: a changed label moves the thumb as well.
  useLayoutEffect(() => {
    if (rootRef.current && thumbRef.current) placeThumb(rootRef.current, thumbRef.current, !skipSlide.current);
    skipSlide.current = false;
  });

  // A resize or a late web font is not a new choice, so nothing slides.
  useLayoutEffect(() => {
    const root = rootRef.current;
    const thumb = thumbRef.current;
    if (!root || !thumb) return;
    const observer = new ResizeObserver(() => placeThumb(root, thumb, false));
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const hasSelection = options.some((option) => option.value === value && !option.disabled);
  const firstEnabled = options.findIndex((option) => !option.disabled);
  const selected = options.find((option) => option.value === value);

  function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    // Alt+Left is the browser's Back.
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const enabled = options.flatMap((option, position) => (option.disabled ? [] : [position]));
    const here = enabled.indexOf(index);
    const targets: Record<string, number | undefined> = {
      ArrowRight: enabled[(here + 1) % enabled.length],
      ArrowDown: enabled[(here + 1) % enabled.length],
      ArrowLeft: enabled[(here - 1 + enabled.length) % enabled.length],
      ArrowUp: enabled[(here - 1 + enabled.length) % enabled.length],
      Home: enabled[0],
      End: enabled[enabled.length - 1],
    };
    const target = targets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    skipSlide.current = true;
    onValueChange(options[target].value);
    rootRef.current?.querySelectorAll<HTMLElement>('[role="radio"]')[target]?.focus();
  }

  return (
    <div {...rest} ref={rootRef} className={cx('ws-segmented', className)} role="radiogroup" aria-label={label} data-size={size}>
      <span ref={thumbRef} className="ws-segmented__thumb" aria-hidden="true" />
      {name ? <input type="hidden" name={name} value={value} disabled={!selected || selected.disabled || undefined} /> : null}
      {options.map((option, index) => {
        const checked = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            className="ws-segmented__item"
            role="radio"
            aria-checked={checked}
            disabled={option.disabled}
            // One tab stop for the group, on the selected option.
            tabIndex={checked || (!hasSelection && index === firstEnabled) ? 0 : -1}
            onClick={() => onValueChange(option.value)}
            onKeyDown={(event) => move(event, index)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
