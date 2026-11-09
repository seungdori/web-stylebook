'use client';

// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Web Stylebook

import { useId, useImperativeHandle, useLayoutEffect, useRef, type ComponentPropsWithRef, type ReactNode } from 'react';
import '../theme.css';
import './text-field.css';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

interface FieldProps {
  label: ReactNode;
  /** Hidden from view, still read by screen readers. */
  hideLabel?: boolean;
  /** A hint below the field. An error takes its place. */
  description?: ReactNode;
  /** What is wrong and how to fix it. Marks the field invalid. */
  error?: ReactNode;
}

function useFieldIds(id: string | undefined, hasMessage: boolean) {
  const fallback = useId();
  const controlId = id ?? fallback;
  return { controlId, messageId: `${controlId}-message`, describedBy: hasMessage ? `${controlId}-message` : undefined };
}

function FieldFrame({
  label,
  hideLabel,
  description,
  error,
  required,
  controlId,
  messageId,
  className,
  children,
}: FieldProps & { required?: boolean; controlId: string; messageId: string; className?: string; children: ReactNode }) {
  return (
    <div className={cx('ws-field', className)} data-invalid={error ? '' : undefined}>
      <label className="ws-field__label" htmlFor={controlId} data-hidden={hideLabel ? '' : undefined}>
        {label}
        {required ? (
          <span className="ws-field__required" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        // Keyed on the text, so a new error plays the entrance again.
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

export interface TextFieldProps extends FieldProps, Omit<ComponentPropsWithRef<'input'>, 'value' | 'defaultValue' | 'onChange' | 'size'> {
  value: string;
  onValueChange: (value: string) => void;
}

/** One line of text, with its label, hint, and error wired to the input. */
export function TextField({ label, hideLabel, description, error, value, onValueChange, id, className, required, ...rest }: TextFieldProps) {
  const { controlId, messageId, describedBy } = useFieldIds(id, Boolean(error || description));
  return (
    <FieldFrame label={label} hideLabel={hideLabel} description={description} error={error} required={required} controlId={controlId} messageId={messageId} className={className}>
      <input
        {...rest}
        id={controlId}
        className="ws-field__control"
        value={value}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        onChange={(event) => onValueChange(event.target.value)}
      />
    </FieldFrame>
  );
}

function fitToContent(element: HTMLTextAreaElement) {
  // Measured from auto, so the box also shrinks when text is removed.
  element.style.height = 'auto';
  // Hidden elements measure 0. Leave auto, so the rows attribute decides.
  if (element.scrollHeight > 0) element.style.height = `${element.scrollHeight + 2}px`;
}

export interface TextAreaProps extends FieldProps, Omit<ComponentPropsWithRef<'textarea'>, 'value' | 'defaultValue' | 'onChange'> {
  value: string;
  onValueChange: (value: string) => void;
}

/** Several lines of text. The box grows with its content, up to a limit, then scrolls. */
export function TextArea({ label, hideLabel, description, error, value, onValueChange, id, className, required, rows = 3, ref, ...rest }: TextAreaProps) {
  const { controlId, messageId, describedBy } = useFieldIds(id, Boolean(error || description));
  const inner = useRef<HTMLTextAreaElement>(null);
  useImperativeHandle(ref, () => inner.current as HTMLTextAreaElement, []);

  useLayoutEffect(() => {
    if (inner.current) fitToContent(inner.current);
  }, [value]);

  // A box that starts hidden, as in a closed Dialog, measures 0 until shown.
  // A new width can also rewrap the text.
  useLayoutEffect(() => {
    const element = inner.current;
    if (!element) return;
    let width = element.offsetWidth;
    const observer = new ResizeObserver(() => {
      if (element.offsetWidth === width) return;
      width = element.offsetWidth;
      fitToContent(element);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <FieldFrame label={label} hideLabel={hideLabel} description={description} error={error} required={required} controlId={controlId} messageId={messageId} className={className}>
      <textarea
        {...rest}
        ref={inner}
        id={controlId}
        className="ws-field__control"
        data-multiline=""
        rows={rows}
        value={value}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        onChange={(event) => onValueChange(event.target.value)}
      />
    </FieldFrame>
  );
}
