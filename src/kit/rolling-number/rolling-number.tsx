'use client';

// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Web Stylebook

import { useLayoutEffect, useRef, useState, type HTMLAttributes } from 'react';
import '../theme.css';
import './rolling-number.css';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

// Three copies of 0-9 in one text node. The strip rests in the middle copy, so
// a roll from either side always has digits to pass through.
const STRIP = '0123456789'.repeat(3).split('').join('\n');
const CELLS = 30;
const ROLL_MS = 640;
const position = (cell: number) => `translateY(${(-cell / CELLS) * 100}%)`;

function Digit({ digit, delay, enters }: { digit: number; delay: number; enters: boolean }) {
  const stripRef = useRef<HTMLSpanElement>(null);
  const previous = useRef(digit);
  const [entering] = useState(enters);

  useLayoutEffect(() => {
    const strip = stripRef.current;
    const from = previous.current;
    previous.current = digit;
    if (!strip || from === digit || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const target = 10 + digit;
    const running = strip.getAnimations()[0];
    let start = 10 + from;
    if (running) {
      // A value that changes mid-roll carries on from where the strip is now.
      start = -new DOMMatrixReadOnly(getComputedStyle(strip).transform).m42 / (strip.offsetHeight / CELLS);
      running.cancel();
    }
    // The nearest copy of the start digit, so a digit takes the short way round.
    const offset = ((((start - target + 5) % 10) + 10) % 10) - 5;
    strip.animate([{ transform: position(target + offset) }, { transform: position(target) }], {
      duration: ROLL_MS,
      delay,
      easing: 'cubic-bezier(0.2, 0, 0, 1)',
      fill: 'backwards',
    });
  }, [digit, delay]);

  return (
    <span className="ws-roll__digit" data-enter={entering ? '' : undefined}>
      <span className="ws-roll__ghost">{digit}</span>
      <span className="ws-roll__window">
        <span ref={stripRef} className="ws-roll__strip" style={{ transform: position(10 + digit) }}>
          {STRIP}
        </span>
      </span>
    </span>
  );
}

type Slot = { key: string; order: number; digit: number } | { key: string; char: string };

/** Keys count from the right, so the ones digit keeps its column when 999 becomes 1,000. */
function slotsOf(text: string): Slot[] {
  const slots: Slot[] = [];
  let digits = 0;
  let others = 0;
  for (const char of [...text].reverse()) {
    if (/\d/.test(char)) {
      slots.unshift({ key: `d${digits}`, order: digits, digit: Number(char) });
      digits += 1;
      others = 0;
    } else {
      slots.unshift({ key: `c${digits}-${others}`, char });
      others += 1;
    }
  }
  return slots;
}

export interface RollingNumberProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** A number, or a preformatted string such as "54.5k". Only digits roll. */
  value: number | string;
  /** Formats a numeric value. Defaults to en-US grouping. */
  format?: (value: number) => string;
  /** Delay between neighboring digits, right to left, in milliseconds. */
  stagger?: number;
}

/**
 * A number whose digits roll to their new value. Units and separators stay
 * still. Size and weight are inherited; figures are always tabular. Screen
 * readers get the value as one string, with no roll.
 */
export function RollingNumber({ value, format, stagger = 28, className, ...rest }: RollingNumberProps) {
  const text = typeof value === 'number' ? (format ?? new Intl.NumberFormat('en-US').format)(value) : value;
  const slots = slotsOf(text);
  // The first paint is not a change. Only columns beyond it fade in.
  const [firstColumns] = useState(() => slots.filter((slot) => 'digit' in slot).length);

  return (
    <span {...rest} className={cx('ws-roll', className)}>
      <span className="ws-roll__text">{text}</span>
      <span className="ws-roll__glyphs" aria-hidden="true">
        {slots.map((slot) =>
          'char' in slot ? (
            <span key={slot.key}>{slot.char}</span>
          ) : (
            <Digit key={slot.key} digit={slot.digit} delay={slot.order * stagger} enters={slot.order >= firstColumns} />
          ),
        )}
      </span>
    </span>
  );
}
