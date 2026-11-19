'use client';

// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Web Stylebook

import { useImperativeHandle, useLayoutEffect, useRef, type ComponentPropsWithRef } from 'react';
import '../theme.css';
import { FieldFrame, useFieldIds, type FieldProps } from '../field/field';
import './text-field.css';

export interface TextFieldProps extends FieldProps, Omit<ComponentPropsWithRef<'input'>, 'value' | 'defaultValue' | 'onChange' | 'size'> {
  value: string;
  onValueChange: (value: string) => void;
}

/** One line of text, with its label, hint, and error wired to the input. */
export function TextField({ label, hideLabel, description, error, value, onValueChange, id, className, required, ...rest }: TextFieldProps) {
  const { controlId, labelId, messageId, describedBy } = useFieldIds(id, Boolean(error || description));
  return (
    <FieldFrame label={label} hideLabel={hideLabel} description={description} error={error} required={required} controlId={controlId} labelId={labelId} messageId={messageId} className={className}>
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
  const { controlId, labelId, messageId, describedBy } = useFieldIds(id, Boolean(error || description));
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
    <FieldFrame label={label} hideLabel={hideLabel} description={description} error={error} required={required} controlId={controlId} labelId={labelId} messageId={messageId} className={className}>
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
