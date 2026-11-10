'use client';

// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Web Stylebook

import { useEffect, useId, useLayoutEffect, useRef, useState, type ComponentPropsWithRef, type ReactNode } from 'react';
import '../theme.css';
import './dialog.css';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

/** Reads --ws-duration, which is 0ms under prefers-reduced-motion. */
function durationMs(): number {
  if (typeof document === 'undefined') return 0;
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--ws-duration').trim();
  if (!raw) return 200;
  const value = Number.parseFloat(raw);
  if (!Number.isFinite(value) || value <= 0) return 0;
  return /ms$/i.test(raw) || !/s$/i.test(raw) ? value : value * 1000;
}

export interface DialogProps extends Omit<ComponentPropsWithRef<'dialog'>, 'open' | 'title' | 'onClose' | 'onCancel' | 'onClick' | 'onPointerDown' | 'ref'> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  /** The heading level. Defaults to h2 so the dialog does not take the page title. */
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  description?: ReactNode;
  /** Usually Cancel, then the action. The first focusable element gets focus. */
  footer?: ReactNode;
  /** The close button's name for screen readers. */
  closeLabel?: string;
  /** While work is running: Escape and outside clicks do nothing, and the close button is off. */
  locked?: boolean;
}

/**
 * A modal window on the native dialog element, so the browser keeps focus
 * inside and returns it to the trigger when the dialog closes.
 */
export function Dialog({ open, onOpenChange, title, titleAs: Title = 'h2', description, footer, closeLabel = 'Close', locked = false, className, children, ...rest }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const pressedBackdrop = useRef(false);
  const returnFocus = useRef<HTMLElement | null>(null);
  const lastFocusInside = useRef<HTMLElement | null>(null);
  const askedToClose = useRef(false);
  const [forcedCloses, setForcedCloses] = useState(0);
  const titleId = useId();
  const descriptionId = useId();
  // Stays rendered after open turns false, until the exit has played.
  const [present, setPresent] = useState(open);
  if (open && !present) setPresent(true);

  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    // Read first: showModal focuses the first field, which updates this ref.
    const focusBefore = lastFocusInside.current;
    if (!dialog.open) {
      returnFocus.current ??= document.activeElement as HTMLElement | null;
      dialog.showModal();
    }
    // Back from a forced close or an interrupted exit: focus returns to where it was.
    if (forcedCloses || !dialog.contains(document.activeElement)) focusBefore?.focus({ preventScroll: true });
  }, [open, present, forcedCloses]);

  useEffect(() => {
    if (open || !present) return;
    const finish = () => {
      ref.current?.close();
      setPresent(false);
      setForcedCloses(0);
      lastFocusInside.current = null;
    };
    const ms = durationMs();
    if (ms === 0) {
      finish();
      return;
    }
    const timer = window.setTimeout(finish, ms);
    return () => window.clearTimeout(timer);
  }, [open, present]);

  // The page behind stops scrolling. The gutter keeps it from shifting sideways.
  useEffect(() => {
    if (!present) return;
    const dialog = ref.current;
    const { style } = document.documentElement;
    const before = { overflow: style.overflow, scrollbarGutter: style.scrollbarGutter };
    style.scrollbarGutter = 'stable';
    style.overflow = 'hidden';
    return () => {
      style.overflow = before.overflow;
      style.scrollbarGutter = before.scrollbarGutter;
      // Removed while still open, as with {open && <Dialog open />}: no close
      // ran, so the browser did not return focus.
      if (dialog?.open) returnFocus.current?.focus();
      else returnFocus.current = null;
    };
  }, [present]);

  if (!present) return null;

  return (
    <dialog
      {...rest}
      ref={ref}
      className={cx('ws-dialog', className)}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      data-closing={open ? undefined : ''}
      data-reopened={forcedCloses ? '' : undefined}
      onFocus={(event) => {
        lastFocusInside.current = event.target;
      }}
      onCancel={(event) => {
        // React passes this up the tree, so a nested Dialog must not close this one.
        if (event.target !== event.currentTarget) return;
        // Closing goes through state, so the exit plays and the parent stays in charge.
        event.preventDefault();
        if (locked) return;
        askedToClose.current = true;
        onOpenChange(false);
      }}
      onClose={(event) => {
        if (event.target !== event.currentTarget || !open) return;
        // Chrome closes a dialog on a repeated Escape even when cancel is
        // prevented. If open stays true, the layout effect shows it again.
        if (!locked && !askedToClose.current) onOpenChange(false);
        askedToClose.current = false;
        setForcedCloses((count) => count + 1);
      }}
      onPointerDown={(event) => {
        pressedBackdrop.current = event.target === ref.current;
      }}
      onClick={(event) => {
        // The panel fills the dialog, so only the backdrop reports the dialog as
        // its target. A drag that starts inside and ends outside does not count.
        if (event.target === ref.current && pressedBackdrop.current && !locked) onOpenChange(false);
      }}
    >
      {/* Inert during the exit, so a second Enter cannot run an action twice. */}
      <div className="ws-dialog__panel" inert={!open}>
        <Title className="ws-dialog__title" id={titleId}>
          {title}
        </Title>
        {description ? (
          <p className="ws-dialog__description" id={descriptionId}>
            {description}
          </p>
        ) : null}
        {children ? <div className="ws-dialog__body">{children}</div> : null}
        {footer ? <div className="ws-dialog__footer">{footer}</div> : null}
        {/* Last in the DOM, so opening focuses the content before this button. */}
        <button type="button" className="ws-dialog__close" aria-label={closeLabel} disabled={locked} onClick={() => onOpenChange(false)}>
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4.5 4.5l7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </dialog>
  );
}
