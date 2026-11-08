import type { HTMLAttributes, ReactNode } from 'react';
import '../theme.css';
import './status-badge.css';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export type StatusTone = 'neutral' | 'info' | 'positive' | 'caution' | 'critical';

const icons: Record<StatusTone, ReactNode> = {
  neutral: <circle cx="6" cy="6" r="4.25" stroke="currentColor" strokeWidth="1.5" />,
  info: (
    <>
      <circle cx="6" cy="6" r="4.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 1.75a4.25 4.25 0 0 1 0 8.5z" fill="currentColor" />
    </>
  ),
  positive: <path d="M2.5 6.25l2.25 2.25L9.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />,
  caution: (
    <>
      <path d="M6 2.5v4.25" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="6" cy="9.25" r="0.95" fill="currentColor" />
    </>
  ),
  critical: <path d="M3.25 3.25l5.5 5.5M8.75 3.25l-5.5 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />,
};

export interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: StatusTone;
  /** 'icon' adds a shape per tone, so the state does not rely on color alone. */
  marker?: 'dot' | 'icon';
  children: ReactNode;
}

/** A one-word state such as Queued, Running, Done, Needs review, or Failed. */
export function StatusBadge({ tone = 'neutral', marker = 'dot', className, children, ...rest }: StatusBadgeProps) {
  return (
    <span className={cx('ws-status-badge', className)} data-tone={tone} {...rest}>
      {marker === 'dot' ? (
        <span className="ws-status-badge__dot" aria-hidden="true" />
      ) : (
        <svg className="ws-status-badge__icon" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          {icons[tone]}
        </svg>
      )}
      <span className="ws-status-badge__label">{children}</span>
    </span>
  );
}
