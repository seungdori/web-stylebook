'use client';

// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Web Stylebook

import { useId, type HTMLAttributes, type ReactNode } from 'react';
import '../theme.css';
import './progress-bar.css';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export type ProgressTone = 'accent' | 'info' | 'positive' | 'caution' | 'critical';

export interface ProgressBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Names the bar for everyone. Visually hidden with hideLabel. */
  label: string;
  hideLabel?: boolean;
  value?: number;
  max?: number;
  /** Text beside the label, such as "3.2 GB of 5 GB". Defaults to the percentage. */
  valueText?: string;
  tone?: ProgressTone;
  /** Work with no known end. A segment travels along the track. */
  indeterminate?: boolean;
}

/** How far a task has come, or how much of a limit is used. */
export function ProgressBar({
  label,
  hideLabel = false,
  value = 0,
  max = 100,
  valueText,
  tone = 'accent',
  indeterminate = false,
  className,
  ...rest
}: ProgressBarProps) {
  const labelId = useId();
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  const shownValue = indeterminate ? valueText : (valueText ?? `${Math.round(percent)}%`);

  return (
    <div {...rest} className={cx('ws-progress', className)} data-tone={tone}>
      <div className="ws-progress__head" data-hidden={hideLabel ? '' : undefined}>
        <span className="ws-progress__label" id={labelId}>
          {label}
        </span>
        {shownValue ? <span className="ws-progress__value">{shownValue}</span> : null}
      </div>
      <div
        className="ws-progress__track"
        role="progressbar"
        aria-labelledby={labelId}
        aria-valuemin={indeterminate ? undefined : 0}
        aria-valuemax={indeterminate ? undefined : max}
        aria-valuenow={indeterminate ? undefined : value}
        aria-valuetext={shownValue || undefined}
        data-indeterminate={indeterminate ? '' : undefined}
      >
        <span className="ws-progress__fill" style={indeterminate ? undefined : { transform: `translateX(${percent - 100}%)` }} />
      </div>
    </div>
  );
}

export interface StackedBarSegment {
  label: string;
  value: number;
  tone: ProgressTone;
  /** Text after the label. Defaults to the value. */
  valueText?: ReactNode;
}

export interface StackedBarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Names the list of segments for screen readers. */
  label: string;
  segments: StackedBarSegment[];
  /** The whole bar. Defaults to the sum of the segments; a larger max leaves free space. */
  max?: number;
}

/** Parts of a whole. The legend carries the values, so the bar itself is decorative. */
export function StackedBar({ label, segments, max, className, ...rest }: StackedBarProps) {
  const sum = segments.reduce((total, segment) => total + segment.value, 0);
  const whole = Math.max(max ?? sum, sum);
  // Grow values that add up to 1, so fractional inputs still fill the bar.
  const share = (value: number) => (whole > 0 ? value / whole : 0);
  const free = whole - sum;

  return (
    <div {...rest} className={cx('ws-stacked', className)}>
      <div className="ws-stacked__bar" aria-hidden="true">
        {segments
          .filter((segment) => segment.value > 0)
          .map((segment) => (
            <span key={segment.label} className="ws-stacked__part" data-tone={segment.tone} style={{ flexGrow: share(segment.value) }} />
          ))}
        {free > 0 ? <span className="ws-stacked__free" style={{ flexGrow: share(free) }} /> : null}
      </div>
      <ul className="ws-stacked__legend" aria-label={label}>
        {segments.map((segment) => (
          <li key={segment.label} className="ws-stacked__item">
            <span className="ws-stacked__swatch" data-tone={segment.tone} aria-hidden="true" />
            <span className="ws-stacked__name">{segment.label}</span>
            <span className="ws-stacked__amount">{segment.valueText ?? segment.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
