'use client';

// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Web Stylebook

import { useCallback, useEffect, useRef, useState, type CompositionEvent, type KeyboardEvent, type PointerEvent, type Ref } from 'react';
import '../theme.css';
import './select.css';
import { FieldFrame, useFieldIds, type FieldProps } from '../field/field';
import { revealInList, useListNavigation, usePopoverList } from '../overlay/overlay';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export interface SelectOption<T extends string = string> {
  value: T;
  /** Also what typing a letter matches. */
  label: string;
  /** Muted text on the right of the option. */
  hint?: string;
  disabled?: boolean;
}

export interface SelectProps<T extends string> extends FieldProps {
  /** The selected value, or '' for none. */
  value: T | '';
  onValueChange: (value: T) => void;
  options: ReadonlyArray<SelectOption<T>>;
  /** Shown while nothing is selected. */
  placeholder?: string;
  disabled?: boolean;
  /** Adds a hidden input, so the value is sent with a form. A disabled select does not submit. */
  name?: string;
  id?: string;
  /** Points at the trigger, so a parent can move focus to it. */
  ref?: Ref<HTMLButtonElement>;
  className?: string;
}

/** One value from a list. Focus stays on the trigger, and the list highlights the current option. */
export function Select<T extends string>({
  label,
  hideLabel,
  description,
  error,
  required,
  value,
  onValueChange,
  options,
  placeholder = '',
  disabled,
  name,
  id,
  ref,
  className,
}: SelectProps<T>) {
  const { controlId, labelId, messageId, describedBy } = useFieldIds(id, Boolean(error || description));
  const valueId = `${controlId}-value`;
  const listId = `${controlId}-list`;
  const optionId = (index: number) => `${controlId}-option-${index}`;

  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const { active, setActive, keyboard, setKeyboard, moveWithKey, hover, first, onCompositionStart, onCompositionEnd } = useListNavigation([...options]);

  const close = useCallback(() => setOpen(false), []);
  usePopoverList(open, close, listRef, triggerRef, { side: 'bottom', align: 'start', gap: 4, matchWidth: true, fitHeight: true });

  useEffect(() => {
    if (!open || active < 0) return;
    revealInList(listRef.current);
  }, [open, active]);

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = options[selectedIndex];

  function show(viaKeyboard: boolean) {
    if (!options.length) return;
    setKeyboard(viaKeyboard);
    setActive(selectedIndex >= 0 && !options[selectedIndex].disabled ? selectedIndex : first);
    setOpen(true);
  }

  function choose(index: number) {
    const option = options[index];
    if (!option || option.disabled) return;
    onValueChange(option.value);
    setOpen(false);
  }

  function keepFocus(event: PointerEvent) {
    event.preventDefault();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.nativeEvent.isComposing || event.key === 'Process') return;
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        if (!event.repeat) show(true);
      } else if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
        show(true);
        moveWithKey(event);
      }
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
    } else if (event.key === 'Tab') {
      setOpen(false);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (active >= 0 && !event.repeat) choose(active);
    } else {
      moveWithKey(event);
    }
  }

  function composeEnd(event: CompositionEvent<HTMLButtonElement>) {
    if (!open) {
      setKeyboard(true);
      setActive(selectedIndex >= 0 && !options[selectedIndex]?.disabled ? selectedIndex : first);
      setOpen(true);
    }
    onCompositionEnd(event);
  }

  return (
    <FieldFrame
      label={label}
      hideLabel={hideLabel}
      description={description}
      error={error}
      required={required}
      controlId={controlId}
      labelId={labelId}
      messageId={messageId}
      className={cx('ws-select', className)}
    >
      <button
        ref={(node) => {
          triggerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        id={controlId}
        type="button"
        className="ws-select__trigger"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-labelledby={`${labelId} ${valueId}`}
        aria-invalid={error ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy}
        aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
        disabled={disabled}
        onClick={() => (open ? setOpen(false) : show(false))}
        onKeyDown={onKeyDown}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={composeEnd}
      >
        <span className="ws-select__value" id={valueId} data-placeholder={selected ? undefined : ''}>
          {selected?.label ?? placeholder}
        </span>
        <svg className="ws-select__chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {name ? <input type="hidden" name={name} value={value} disabled={disabled || undefined} /> : null}
      {open ? (
        <ul ref={listRef} className="ws-select__list" id={listId} role="listbox" aria-labelledby={labelId} popover="manual" data-keyboard={keyboard ? '' : undefined} onPointerDown={keepFocus}>
          {options.map((option, index) => (
            <li
              key={option.value}
              id={optionId(index)}
              className="ws-select__option"
              role="option"
              aria-selected={option.value === value}
              aria-disabled={option.disabled || undefined}
              data-active={index === active ? '' : undefined}
              onPointerMove={() => hover(index)}
              onClick={() => choose(index)}
            >
              <span className="ws-select__option-label">{option.label}</span>
              {option.hint ? <span className="ws-select__hint">{option.hint}</span> : null}
              <svg className="ws-select__check" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3.5 8.5l3 3 6-6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </li>
          ))}
        </ul>
      ) : null}
    </FieldFrame>
  );
}
