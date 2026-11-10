'use client';

// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Web Stylebook

import type { ComponentPropsWithRef, MouseEvent, ReactNode } from 'react';
import '../theme.css';
import './button.css';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

type ButtonVariant = 'primary' | 'secondary' | 'quiet' | 'critical' | 'danger';

interface ButtonCommon {
  /**
   * 'critical' is the destructive action. 'danger' is a deprecated alias and
   * still renders the same button.
   */
  variant?: ButtonVariant;
  /** A 16px line icon before the label. */
  icon?: ReactNode;
  /** Shows a spinner and ignores clicks. The control keeps focus and its label. */
  busy?: boolean;
}

/** A visible label, or an accessible name when the button shows only an icon. */
type AccessibleName =
  | { children: ReactNode; 'aria-label'?: string; 'aria-labelledby'?: string }
  | { children?: undefined; 'aria-label': string; 'aria-labelledby'?: string }
  | { children?: undefined; 'aria-label'?: string; 'aria-labelledby': string };

type ButtonAsButton = ButtonCommon &
  AccessibleName &
  Omit<ComponentPropsWithRef<'button'>, 'children' | 'aria-label' | 'aria-labelledby'> & { href?: undefined };

type ButtonAsLink = ButtonCommon &
  AccessibleName &
  Omit<ComponentPropsWithRef<'a'>, 'children' | 'aria-label' | 'aria-labelledby' | 'href'> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

function ButtonBody({ busy, icon, children }: { busy: boolean; icon?: ReactNode; children?: ReactNode }) {
  return (
    <>
      {busy ? (
        <span className="ws-button__spinner" aria-hidden="true" />
      ) : icon ? (
        <span className="ws-button__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
      {children}
    </>
  );
}

/** A button, or a link that looks like one when `href` is set. React 19 passes `ref` as a prop. */
export function Button(props: ButtonProps) {
  const { variant = 'secondary', icon, busy = false, className, children, onClick } = props;
  const iconOnly = children == null || children === false || children === '';
  const shared = {
    className: cx('ws-button', className),
    'data-variant': variant,
    'data-icon-only': iconOnly ? '' : undefined,
    'aria-busy': busy || undefined,
    'aria-label': props['aria-label'],
    'aria-labelledby': props['aria-labelledby'],
  };

  if (props.href !== undefined) {
    const { href, variant: _variant, icon: _icon, busy: _busy, className: _className, children: _children, onClick: _onClick, ...rest } = props;
    return (
      <a
        {...rest}
        {...shared}
        href={busy ? undefined : href}
        aria-disabled={busy || rest['aria-disabled'] || undefined}
        onClick={(event: MouseEvent<HTMLAnchorElement>) => {
          if (busy || rest['aria-disabled']) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
        }}
      >
        <ButtonBody busy={busy} icon={icon}>
          {children}
        </ButtonBody>
      </a>
    );
  }

  const { href: _href, variant: _variant, icon: _icon, busy: _busy, className: _className, children: _children, onClick: _onClick, type = 'button', ...rest } = props;
  return (
    <button
      {...rest}
      {...shared}
      type={type}
      aria-disabled={busy || rest['aria-disabled'] || undefined}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        if (busy) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
    >
      <ButtonBody busy={busy} icon={icon}>
        {children}
      </ButtonBody>
    </button>
  );
}
