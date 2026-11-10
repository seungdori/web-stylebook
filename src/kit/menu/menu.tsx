'use client';

// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Web Stylebook

import { cloneElement, useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactElement, type ReactNode } from 'react';
import '../theme.css';
import './menu.css';
import { revealInList, useListNavigation, usePopoverList, type Side } from '../overlay/overlay';

export type MenuEntry =
  | {
      key: string;
      /** Also what typing a letter matches. */
      label: string;
      icon?: ReactNode;
      /** Text only, such as "⌘D". The menu does not listen for it. */
      shortcut?: string;
      /** Red, for an action that removes something. */
      critical?: boolean;
      /** @deprecated Use critical. */
      danger?: boolean;
      disabled?: boolean;
      onSelect: () => void;
    }
  | { key: string; separator: true };

type MenuAction = Exclude<MenuEntry, { separator: true }>;
const isAction = (entry: MenuEntry): entry is MenuAction => !('separator' in entry);

export interface MenuProps {
  /** Names the menu for screen readers. */
  label: string;
  items: MenuEntry[];
  side?: Side;
  /** The trigger: one button. */
  children: ReactElement<{
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    onKeyDown?: (event: KeyboardEvent<HTMLButtonElement>) => void;
    'aria-haspopup'?: 'menu';
    'aria-expanded'?: boolean;
    'aria-controls'?: string;
  }>;
}

/** A list of actions on a button. Arrow keys and typing move through it; focus returns to the button. */
export function Menu({ label, items, side = 'bottom', children }: MenuProps) {
  const id = useId();
  const anchorRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const actions = items.filter(isAction);
  const { active, setActive, keyboard, setKeyboard, moveWithKey, hover, first, last, onCompositionStart, onCompositionEnd } = useListNavigation(actions);

  // Every way of closing returns focus, because the focused menu goes away.
  const dismiss = useCallback(() => {
    setOpen(false);
    // Without preventScroll, a scroll that closed the menu would be undone.
    anchorRef.current?.querySelector('button')?.focus({ preventScroll: true });
  }, []);
  usePopoverList(open, dismiss, menuRef, anchorRef, { side, align: 'start', gap: 4, fitHeight: true });

  useLayoutEffect(() => {
    if (open) menuRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open || active < 0) return;
    revealInList(menuRef.current);
  }, [open, active]);

  function run(index: number) {
    const action = actions[index];
    if (!action || action.disabled) return;
    dismiss();
    action.onSelect();
  }

  function show(start: number, viaKeyboard: boolean) {
    setKeyboard(viaKeyboard);
    setActive(start);
    setOpen(true);
  }

  function onMenuKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      // Stops here, so a Dialog around this menu stays open.
      event.preventDefault();
      event.stopPropagation();
      dismiss();
    } else if (event.key === 'Tab') {
      event.preventDefault();
      dismiss();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      // A held key that opened the menu must not also run its first item.
      if (active >= 0 && !event.repeat) run(active);
    } else {
      moveWithKey(event);
    }
  }

  const trigger = cloneElement(children, {
    'aria-haspopup': 'menu',
    'aria-expanded': open,
    'aria-controls': open ? id : undefined,
    onClick: (event: MouseEvent<HTMLButtonElement>) => {
      children.props.onClick?.(event);
      // Keyboard activation has detail 0: start on the first item.
      if (open) setOpen(false);
      else show(event.detail === 0 ? first : -1, event.detail === 0);
    },
    onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
      children.props.onKeyDown?.(event);
      // A held key that just closed the menu must not open it again.
      if (event.repeat && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        return;
      }
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        show(event.key === 'ArrowDown' ? first : last, true);
      }
    },
  });

  return (
    <>
      <span ref={anchorRef} className="ws-menu-anchor">
        {trigger}
      </span>
      {open ? (
        <div
          ref={menuRef}
          id={id}
          className="ws-menu"
          role="menu"
          aria-label={label}
          aria-activedescendant={active >= 0 ? `${id}-${active}` : undefined}
          tabIndex={-1}
          popover="manual"
          data-keyboard={keyboard ? '' : undefined}
          onKeyDown={onMenuKey}
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
        >
          {items.map((entry) => {
            if (!isAction(entry)) return <div key={entry.key} className="ws-menu__separator" role="separator" />;
            const index = actions.indexOf(entry);
            const critical = Boolean(entry.critical || entry.danger);
            return (
              <div
                key={entry.key}
                id={`${id}-${index}`}
                className="ws-menu__item"
                role="menuitem"
                aria-disabled={entry.disabled || undefined}
                data-critical={critical ? '' : undefined}
                data-danger={critical ? '' : undefined}
                data-active={index === active ? '' : undefined}
                onPointerMove={() => hover(index)}
                onClick={() => run(index)}
              >
                {entry.icon ? (
                  <span className="ws-menu__icon" aria-hidden="true">
                    {entry.icon}
                  </span>
                ) : null}
                <span className="ws-menu__label">{entry.label}</span>
                {entry.shortcut ? <kbd className="ws-menu__shortcut">{entry.shortcut}</kbd> : null}
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );
}
