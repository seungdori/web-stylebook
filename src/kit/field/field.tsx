'use client';

// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Web Stylebook

import { useId, type ReactNode } from 'react';
import '../theme.css';
import './field.css';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export interface FieldProps {
  label: ReactNode;
  /** Hidden from view, still read by screen readers. */
  hideLabel?: boolean;
  /** A hint below the field. An error takes its place. */
  description?: ReactNode;
  /** What is wrong and how to fix it. Marks the field invalid. */
  error?: ReactNode;
  required?: boolean;
}

export function useFieldIds(id: string | undefined, hasMessage: boolean) {
  const fallback = useId();
  const controlId = id ?? fallback;
  return {
    controlId,
    labelId: `${controlId}-label`,
    messageId: `${controlId}-message`,
    describedBy: hasMessage ? `${controlId}-message` : undefined,
  };
}

/** Label, hint, and error shared by text fields and selects. */
export function FieldFrame({
  label,
  hideLabel,
  description,
  error,
  required,
  controlId,
  labelId,
  messageId,
  className,
  children,
}: FieldProps & { controlId: string; labelId: string; messageId: string; className?: string; children: ReactNode }) {
  return (
    <div className={cx('ws-field', className)} data-invalid={error ? '' : undefined}>
      <label id={labelId} className="ws-field__label" htmlFor={controlId} data-hidden={hideLabel ? '' : undefined}>
        {label}
        {required ? (
          <span className="ws-field__required" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p key={String(error)} className="ws-field__error" id={messageId}>
          <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="6" fill="currentColor" />
            <path d="M7 3.75v3.75M7 10.25v.01" stroke="var(--ws-color-panel)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      ) : description ? (
        <p className="ws-field__description" id={messageId}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
