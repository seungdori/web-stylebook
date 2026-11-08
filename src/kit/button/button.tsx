'use client';

import type { ComponentPropsWithRef, MouseEvent, ReactNode } from 'react';
import '../theme.css';
import './button.css';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  variant?: 'primary' | 'secondary';
  /** A 16px line icon before the label. */
  icon?: ReactNode;
  /** Shows a spinner and ignores clicks. The button keeps focus and its label. */
  busy?: boolean;
}

/** React 19 passes `ref` as a prop, so a parent can move focus to the button. */
export function Button({
  variant = 'secondary',
  icon,
  busy = false,
  type = 'button',
  className,
  children,
  onClick,
  ...rest
}: ButtonProps) {
  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (busy) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  }

  return (
    <button
      {...rest}
      type={type}
      className={cx('ws-button', className)}
      data-variant={variant}
      aria-busy={busy || undefined}
      aria-disabled={busy || rest['aria-disabled'] || undefined}
      onClick={handleClick}
    >
      {busy ? (
        <span className="ws-button__spinner" aria-hidden="true" />
      ) : icon ? (
        <span className="ws-button__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {children}
    </button>
  );
}
