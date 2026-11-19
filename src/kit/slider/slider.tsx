'use client';

// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Web Stylebook

import { useId, type ComponentPropsWithRef, type CSSProperties, type ReactNode } from 'react';
import '../theme.css';
import './slider.css';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export interface SliderProps extends Omit<ComponentPropsWithRef<'input'>, 'value' | 'defaultValue' | 'onChange' | 'type' | 'min' | 'max' | 'step'> {
  label: ReactNode;
  /** Hidden from view, still read by screen readers. */
  hideLabel?: boolean;
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** The text shown beside the label and read by screen readers, such as "4 GB". */
  format?: (value: number) => string;
  /** Tick values shown under the track. */
  marks?: number[];
}

/** A value on a range. A native range input, so keyboard and touch come from the browser. */
export function Slider({ label, hideLabel, value, onValueChange, min = 0, max = 100, step = 1, format = String, marks, id, className, disabled, ...rest }: SliderProps) {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;
  const ratio = (amount: number) => (max > min ? Math.min(1, Math.max(0, (amount - min) / (max - min))) : 0);
  const text = format(value);

  return (
    <div className={cx('ws-slider', className)} data-disabled={disabled ? '' : undefined}>
      <div className="ws-slider__head">
        <label className="ws-slider__label" htmlFor={inputId} data-hidden={hideLabel ? '' : undefined}>
          {label}
        </label>
        <span className="ws-slider__value">{text}</span>
      </div>
      <div className="ws-slider__control" style={{ '--ws-slider-ratio': ratio(value) } as CSSProperties}>
        <span className="ws-slider__track" aria-hidden="true">
          <span className="ws-slider__fill" />
        </span>
        <input
          {...rest}
          id={inputId}
          className="ws-slider__input"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          aria-valuetext={text}
          onChange={(event) => onValueChange(Number(event.target.value))}
        />
      </div>
      {marks?.length ? (
        <div className="ws-slider__marks" aria-hidden="true">
          {marks.map((mark) => (
            <span key={mark} className="ws-slider__mark" style={{ '--ws-slider-ratio': ratio(mark) } as CSSProperties}>
              {format(mark)}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
