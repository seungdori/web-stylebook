'use client';

// SPDX-License-Identifier: MIT
// Copyright (c) 2026 Web Stylebook

import { useId, useState, type HTMLAttributes, type ReactNode } from 'react';
import '../theme.css';
import './accordion.css';

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export interface AccordionItem {
  value: string;
  title: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  items: AccordionItem[];
  /** Lets several sections stay open. By default, opening one closes the others. */
  multiple?: boolean;
  /** The values open at first. Ignored while `open` is set. */
  defaultOpen?: string[];
  /** The values open now. Pass this to control the accordion. */
  open?: string[];
  onOpenChange?: (open: string[]) => void;
  /** Use a heading level that fits the page outline. */
  headingAs?: 'h2' | 'h3' | 'h4';
}

/** Sections that fold. The height animates in CSS, with no measuring. */
export function Accordion({ items, multiple = false, defaultOpen = [], open: openProp, onOpenChange, headingAs: Heading = 'h3', className, ...rest }: AccordionProps) {
  const id = useId();
  const [uncontrolled, setUncontrolled] = useState<string[]>(defaultOpen);
  const open = openProp ?? uncontrolled;

  function toggle(value: string) {
    const next = open.includes(value) ? open.filter((item) => item !== value) : multiple ? [...open, value] : [value];
    if (openProp === undefined) setUncontrolled(next);
    onOpenChange?.(next);
  }

  return (
    <div {...rest} className={cx('ws-accordion', className)}>
      {items.map((item, index) => {
        const expanded = open.includes(item.value);
        // By position: a value may hold characters an id cannot.
        const triggerId = `${id}-${index}-trigger`;
        const panelId = `${id}-${index}-panel`;
        return (
          <div key={item.value} className="ws-accordion__item" data-open={expanded ? '' : undefined}>
            <Heading className="ws-accordion__heading">
              <button
                type="button"
                className="ws-accordion__trigger"
                id={triggerId}
                aria-expanded={expanded}
                aria-controls={panelId}
                disabled={item.disabled}
                onClick={() => toggle(item.value)}
              >
                <span>{item.title}</span>
                <svg className="ws-accordion__chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </Heading>
            {/* Inert while closed, so links inside it leave the tab order. */}
            <div className="ws-accordion__panel" id={panelId} role="region" aria-labelledby={triggerId} inert={!expanded}>
              <div className="ws-accordion__clip">
                <div className="ws-accordion__content">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
