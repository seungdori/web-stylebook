'use client';

// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Web Stylebook

import { useId, useImperativeHandle, useLayoutEffect, useRef, type ComponentPropsWithRef, type ReactNode } from 'react';
import '../theme.css';
import './checkbox.css';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export interface CheckboxProps extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'checked' | 'defaultChecked' | 'onChange'> {
  label: ReactNode;
  /** One line under the label. Screen readers read it after the name. */
  description?: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  /** Some of the items it stands for are selected. Shows a dash. */
  indeterminate?: boolean;
}

/** A choice that can be on or off, usually saved with a form. The mark draws itself when checked. */
export function Checkbox({ label, description, checked, onCheckedChange, indeterminate = false, disabled, className, ref, ...rest }: CheckboxProps) {
  const labelId = useId();
  const descriptionId = useId();
  const inner = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inner.current as HTMLInputElement, []);

  // The mixed state exists only as a DOM property, not an attribute.
  useLayoutEffect(() => {
    if (inner.current) inner.current.indeterminate = indeterminate;
  }, [indeterminate, checked]);

  return (
    <label className={cx('ws-checkbox', className)} data-disabled={disabled ? '' : undefined}>
      <input
        {...rest}
        ref={inner}
        className="ws-checkbox__input"
        type="checkbox"
        checked={checked}
        disabled={disabled}
        aria-labelledby={labelId}
        aria-describedby={description ? descriptionId : undefined}
        onChange={(event) => {
          onCheckedChange(event.target.checked);
          // A click clears the DOM property even if the parent keeps the state.
          event.target.indeterminate = indeterminate;
        }}
      />
      <span className="ws-checkbox__box" aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none">
          <path className="ws-checkbox__check" d="M3.5 8.5l3 3 6-6.5" pathLength={1} />
          <path className="ws-checkbox__dash" d="M4 8h8" pathLength={1} />
        </svg>
      </span>
      <span className="ws-checkbox__text">
        <span className="ws-checkbox__label" id={labelId}>
          {label}
        </span>
        {description ? (
          <span className="ws-checkbox__description" id={descriptionId}>
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
