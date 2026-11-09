'use client';

// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Web Stylebook

import { useId, type HTMLAttributes, type ReactNode } from 'react';
import '../theme.css';
import './radio-group.css';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export interface RadioOption<T extends string = string> {
  value: T;
  label: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps<T extends string> extends Omit<HTMLAttributes<HTMLFieldSetElement>, 'onChange'> {
  /** Names the group. Hidden from view with hideLabel. */
  label: ReactNode;
  hideLabel?: boolean;
  value: T | '';
  onValueChange: (value: T) => void;
  options: ReadonlyArray<RadioOption<T>>;
  /** 'cards' frames each option, for choices that need a description. */
  variant?: 'list' | 'cards';
  /** The form field name. Generated when omitted. */
  name?: string;
}

/** One choice from a few, all visible at once. Native radios, so the arrow keys work as usual. */
export function RadioGroup<T extends string>({ label, hideLabel, value, onValueChange, options, variant = 'list', name, className, ...rest }: RadioGroupProps<T>) {
  const fallbackName = useId();
  return (
    <fieldset {...rest} className={cx('ws-radios', className)} data-variant={variant}>
      <legend className="ws-radios__legend" data-hidden={hideLabel ? '' : undefined}>
        {label}
      </legend>
      <div className="ws-radios__options">
        {options.map((option) => (
          <label key={option.value} className="ws-radio" data-checked={option.value === value ? '' : undefined} data-disabled={option.disabled ? '' : undefined}>
            <input
              className="ws-radio__input"
              type="radio"
              name={name ?? fallbackName}
              value={option.value}
              checked={option.value === value}
              disabled={option.disabled}
              onChange={() => onValueChange(option.value)}
            />
            <span className="ws-radio__ring" aria-hidden="true">
              <span className="ws-radio__dot" />
            </span>
            <span className="ws-radio__text">
              <span className="ws-radio__label">{option.label}</span>
              {option.description ? <span className="ws-radio__description">{option.description}</span> : null}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
