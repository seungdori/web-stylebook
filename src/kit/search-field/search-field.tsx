'use client';

import { useCallback, useId, useRef, type ComponentPropsWithRef, type KeyboardEvent } from 'react';
import '../theme.css';
import './search-field.css';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export interface SearchFieldProps
  extends Omit<ComponentPropsWithRef<'input'>, 'value' | 'defaultValue' | 'onChange' | 'type' | 'size'> {
  /** Always required. Hidden from view unless showLabel is set. */
  label: string;
  showLabel?: boolean;
  value: string;
  onValueChange: (value: string) => void;
  /** Accessible name of the clear button. */
  clearLabel?: string;
}

/**
 * Search input with a clear button. Escape clears a non-empty value.
 * `ref` reaches the input, so a parent can move focus back to the field.
 */
export function SearchField({
  label,
  showLabel = false,
  value,
  onValueChange,
  clearLabel = 'Clear search',
  id,
  className,
  disabled,
  readOnly,
  onKeyDown,
  ref,
  ...rest
}: SearchFieldProps) {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;
  const inputRef = useRef<HTMLInputElement | null>(null);
  // One stable callback that also feeds the caller's ref. It returns a
  // cleanup (React 19), so the caller's own cleanup runs on detach and a
  // callback ref that returns a cleanup never receives null.
  const setInput = useCallback(
    (node: HTMLInputElement | null) => {
      inputRef.current = node;
      const callerCleanup = typeof ref === 'function' ? ref(node) : undefined;
      if (ref && typeof ref !== 'function') ref.current = node;
      return () => {
        inputRef.current = null;
        if (typeof callerCleanup === 'function') callerCleanup();
        else if (typeof ref === 'function') ref(null);
        else if (ref) ref.current = null;
      };
    },
    [ref],
  );
  const clearable = value !== '' && !disabled && !readOnly;

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(event);
    // Escape during IME composition cancels the composition, not the query.
    if (event.defaultPrevented || event.key !== 'Escape' || event.nativeEvent.isComposing || !clearable) return;
    event.preventDefault();
    event.stopPropagation();
    onValueChange('');
  }

  return (
    <div className={cx('ws-search', className)}>
      <label className="ws-search__label" htmlFor={inputId} data-hidden={showLabel ? undefined : ''}>
        {label}
      </label>
      <div className="ws-search__control">
        <svg className="ws-search__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="4.25" stroke="currentColor" strokeWidth="1.5" />
          <path d="M10.25 10.25L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          {...rest}
          ref={setInput}
          id={inputId}
          className="ws-search__input"
          type="search"
          value={value}
          disabled={disabled}
          readOnly={readOnly}
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        {clearable ? (
          <button
            type="button"
            className="ws-search__clear"
            aria-label={clearLabel}
            onClick={() => {
              onValueChange('');
              inputRef.current?.focus();
            }}
          >
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        ) : null}
      </div>
    </div>
  );
}
