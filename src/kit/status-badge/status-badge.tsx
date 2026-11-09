// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Web Stylebook

import type { HTMLAttributes, ReactNode } from 'react';
import '../theme.css';
import './status-badge.css';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export type StatusTone = 'neutral' | 'info' | 'positive' | 'caution' | 'critical';

// Solid shapes with the glyph cut out in the badge tint.
const glyph = { stroke: 'var(--ws-badge-tint)', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

const icons: Record<StatusTone, ReactNode> = {
  neutral: <circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.5" />,
  info: (
    <>
      <circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 3.5a3.5 3.5 0 0 1 0 7z" fill="currentColor" />
    </>
  ),
  positive: (
    <>
      <circle cx="7" cy="7" r="6" fill="currentColor" />
      <path d="M4.5 7.25l1.75 1.75 3.25-3.75" {...glyph} />
    </>
  ),
  caution: (
    <>
      <path d="M7 1.5c.4 0 .77.21.97.56l5.3 9.2a1.13 1.13 0 0 1-.97 1.69H1.7a1.13 1.13 0 0 1-.97-1.69l5.3-9.2c.2-.35.57-.56.97-.56z" fill="currentColor" />
      <path d="M7 5.5v2.75M7 10.25v.01" {...glyph} />
    </>
  ),
  critical: (
    <>
      <circle cx="7" cy="7" r="6" fill="currentColor" />
      <path d="M5 5l4 4M9 5l-4 4" {...glyph} />
    </>
  ),
};

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: StatusTone;
  /** 'icon' adds a shape per tone, so the state does not rely on color alone. */
  marker?: 'dot' | 'icon';
  /** For work in progress: the dot pulses, and the 'info' icon turns. Stops under reduced motion. */
  live?: boolean;
  children: ReactNode;
}

/** A one-word state such as Queued, Running, Done, Needs review, or Failed. */
export function StatusBadge({ tone = 'neutral', marker = 'dot', live = false, className, children, ...rest }: StatusBadgeProps) {
  return (
    <span className={cx('ws-status-badge', className)} data-tone={tone} data-live={live ? '' : undefined} {...rest}>
      {marker === 'dot' ? (
        <span key={`mark-${tone}`} className="ws-status-badge__dot" aria-hidden="true" />
      ) : (
        <svg key={`mark-${tone}`} className="ws-status-badge__icon" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          {icons[tone]}
        </svg>
      )}
      <span key={`label-${tone}`} className="ws-status-badge__label">
        {children}
      </span>
    </span>
  );
}
