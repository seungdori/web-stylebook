'use client';

// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Web Stylebook

import { useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import '../theme.css';
import './switch.css';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export interface SwitchProps extends Omit<ComponentPropsWithRef<'input'>, 'type' | 'checked' | 'defaultChecked' | 'onChange' | 'role'> {
  label: ReactNode;
  /** One line under the label. Screen readers read it after the name. */
  description?: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

/** An on/off setting that applies at once. Inside a form that saves later, use a Checkbox. */
export function Switch({ label, description, checked, onCheckedChange, disabled, className, ...rest }: SwitchProps) {
  const labelId = useId();
  const descriptionId = useId();

  return (
    <label className={cx('ws-switch', className)} data-disabled={disabled ? '' : undefined}>
      <input
        {...rest}
        className="ws-switch__input"
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        aria-labelledby={labelId}
        aria-describedby={description ? descriptionId : undefined}
        onChange={(event) => onCheckedChange(event.target.checked)}
      />
      <span className="ws-switch__track" aria-hidden="true">
        <span className="ws-switch__thumb" />
      </span>
      <span className="ws-switch__text">
        <span className="ws-switch__label" id={labelId}>
          {label}
        </span>
        {description ? (
          <span className="ws-switch__description" id={descriptionId}>
            {description}
          </span>
        ) : null}
      </span>
    </label>
  );
}
