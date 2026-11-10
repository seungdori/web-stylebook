'use client';

// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Web Stylebook

import type { HTMLAttributes, ReactNode } from 'react';
import '../theme.css';
import './alert.css';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export type AlertTone = 'neutral' | 'info' | 'positive' | 'caution' | 'critical';

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: AlertTone;
  /** The one line a person should read. */
  title: ReactNode;
  /** Stays on the page until the parent removes it. */
  children?: ReactNode;
  icon?: ReactNode;
  /** Shows a close button. The alert does not dismiss itself. */
  onDismiss?: () => void;
  dismissLabel?: string;
}

const marks: Record<AlertTone, ReactNode> = {
  neutral: (
    <>
      <circle cx="8" cy="8" r="6.25" />
      <path d="M8 7.25v3.5M8 5.15v.01" />
    </>
  ),
  info: (
    <>
      <circle cx="8" cy="8" r="6.25" />
      <path d="M8 7.25v3.5M8 5.15v.01" />
    </>
  ),
  positive: (
    <>
      <circle cx="8" cy="8" r="6.25" />
      <path d="M5 8.25l2 2 4-4.25" />
    </>
  ),
  caution: (
    <>
      <path d="M8 1.75l6.2 11.1H1.8L8 1.75z" />
      <path d="M8 6.25v3.25M8 11.6v.01" />
    </>
  ),
  critical: (
    <>
      <circle cx="8" cy="8" r="6.25" />
      <path d="M5.75 5.75l4.5 4.5M10.25 5.75l-4.5 4.5" />
    </>
  ),
};

/** A message that stays in the page. A critical alert is announced. The others are read with the page. */
export function Alert({ tone = 'info', title, children, icon, onDismiss, dismissLabel = 'Dismiss', className, ...rest }: AlertProps) {
  return (
    <div {...rest} className={cx('ws-alert', className)} data-tone={tone} role={tone === 'critical' ? 'alert' : undefined}>
      <span className="ws-alert__mark" aria-hidden="true">
        {icon ?? (
          <svg viewBox="0 0 16 16" fill="none">
            {marks[tone]}
          </svg>
        )}
      </span>
      <div className="ws-alert__text">
        <p className="ws-alert__title">{title}</p>
        {children ? <div className="ws-alert__body">{children}</div> : null}
      </div>
      {onDismiss ? (
        <button type="button" className="ws-alert__dismiss" aria-label={dismissLabel} onClick={onDismiss}>
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
