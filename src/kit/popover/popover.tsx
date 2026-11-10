'use client';

// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Web Stylebook

import {
  cloneElement,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import '../theme.css';
import './popover.css';
import { usePopoverList, type Side } from '../overlay/overlay';

export interface PopoverProps {
  /** Names the popup for screen readers. */
  label: string;
  /** What the popup holds. It stays until Escape, an outside press, or another toggle. */
  content: ReactNode;
  side?: Side;
  align?: 'center' | 'start';
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The trigger: one button. */
  children: ReactElement<{
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
    'aria-haspopup'?: 'dialog';
    'aria-expanded'?: boolean;
    'aria-controls'?: string;
  }>;
}

/** A click opens it. It is not modal: the page behind stays usable. */
export function Popover({ label, content, children, side = 'bottom', align = 'start', open: openProp, defaultOpen = false, onOpenChange }: PopoverProps) {
  const id = useId();
  const anchorRef = useRef<HTMLSpanElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const open = openProp ?? uncontrolled;

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [onOpenChange, openProp],
  );

  const dismiss = useCallback(() => {
    setOpen(false);
    anchorRef.current?.querySelector('button')?.focus({ preventScroll: true });
  }, [setOpen]);

  usePopoverList(open, dismiss, panelRef, anchorRef, { side, align, gap: 8 });

  useLayoutEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  const trigger = cloneElement(children, {
    'aria-haspopup': 'dialog',
    'aria-expanded': open,
    'aria-controls': open ? id : undefined,
    onClick: (event: MouseEvent<HTMLButtonElement>) => {
      children.props.onClick?.(event);
      setOpen(!open);
    },
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
      children.props.onKeyDown?.(event);
      if (event.key === 'ArrowDown' && !open) {
        event.preventDefault();
        setOpen(true);
      }
    },
  });

  return (
    <>
      <span ref={anchorRef} className="ws-popover-anchor">
        {trigger}
      </span>
      {open ? (
        <div
          ref={panelRef}
          id={id}
          className="ws-popover"
          role="dialog"
          aria-modal="false"
          aria-label={label}
          popover="manual"
          tabIndex={-1}
          onKeyDown={(event) => {
            if (event.key !== 'Escape') return;
            event.preventDefault();
            event.stopPropagation();
            dismiss();
          }}
        >
          {content}
        </div>
      ) : null}
    </>
  );
}
