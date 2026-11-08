// Reviewer tests for the kit components (src/kit). Written from the request:
// Status Badge + Empty State plus the Surface, Button, Search Field, and
// Skeleton they need, each with states, keyboard behavior, and accessible
// semantics. Markup is checked with renderToStaticMarkup; click handling is
// checked by calling the handler React would attach.
import { createElement, isValidElement, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../../src/kit/button/button';
import { EmptyState } from '../../src/kit/empty-state/empty-state';
import { SearchField } from '../../src/kit/search-field/search-field';
import { Skeleton, SkeletonGroup } from '../../src/kit/skeleton/skeleton';
import { StatusBadge, type StatusTone } from '../../src/kit/status-badge/status-badge';
import { Panel, Shell, ShellHeader } from '../../src/kit/surface/surface';

const html = (element: ReactElement) => renderToStaticMarkup(element);
const noop = () => {};

describe('Button', () => {
  it('defaults to type="button" so it never submits a form by accident', () => {
    expect(html(createElement(Button, null, 'Save'))).toMatch(/^<button[^>]*type="button"/);
  });

  it('busy: announces busy, reads as disabled, shows a spinner instead of the icon, keeps the label', () => {
    const markup = html(createElement(Button, { busy: true, icon: createElement('svg', { 'data-icon': '' }) }, 'Saving'));
    expect(markup).toContain('aria-busy="true"');
    expect(markup).toContain('aria-disabled="true"');
    expect(markup).toContain('ws-button__spinner');
    expect(markup).not.toContain('data-icon');
    expect(markup).toContain('Saving');
    // Still focusable: busy must not set the disabled attribute.
    expect(markup).not.toMatch(/\sdisabled(=|\s|>)/);
  });

  it('busy: ignores activation and cancels the default action (form submit)', () => {
    const onClick = vi.fn();
    const element = Button({ busy: true, onClick, children: 'Save' });
    if (!isValidElement<{ onClick: (event: unknown) => void }>(element)) throw new Error('Button did not return an element');
    const event = { preventDefault: vi.fn() };
    element.props.onClick(event);
    expect(onClick).not.toHaveBeenCalled();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('not busy: forwards clicks and keeps a caller aria-disabled', () => {
    const onClick = vi.fn();
    const element = Button({ onClick, 'aria-disabled': true, children: 'Save' });
    if (!isValidElement<{ onClick: (event: unknown) => void; 'aria-disabled'?: unknown }>(element)) throw new Error('no element');
    element.props.onClick({ preventDefault: noop });
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(element.props['aria-disabled']).toBe(true);
    expect(html(createElement(Button, null, 'Save'))).not.toContain('aria-busy');
  });
});

describe('StatusBadge', () => {
  const tones: StatusTone[] = ['neutral', 'info', 'positive', 'caution', 'critical'];

  it('defaults to the neutral tone with a decorative dot', () => {
    const markup = html(createElement(StatusBadge, null, 'Queued'));
    expect(markup).toContain('data-tone="neutral"');
    expect(markup).toMatch(/ws-status-badge__dot" aria-hidden="true"/);
    expect(markup).toContain('>Queued<');
  });

  it("marker='icon' gives every tone a different, decorative shape (state not by color alone)", () => {
    const shapes = tones.map((tone) => {
      const markup = html(createElement(StatusBadge, { tone, marker: 'icon', children: tone }));
      expect(markup, tone).toMatch(/<svg class="ws-status-badge__icon"[^>]*aria-hidden="true"/);
      return markup.replace(/data-tone="\w+"/, '').replace(/>\w+<\/span><\/span>$/, '');
    });
    expect(new Set(shapes).size).toBe(tones.length);
  });
});

describe('EmptyState', () => {
  it('neutral: no live-region role, title as <p> by default, icon hidden from AT', () => {
    const markup = html(createElement(EmptyState, { title: 'No saved styles yet', icon: createElement('svg') }));
    expect(markup).not.toContain('role=');
    expect(markup).toContain('<p class="ws-empty__title">No saved styles yet</p>');
    expect(markup).toMatch(/ws-empty__icon" aria-hidden="true"/);
    expect(markup).not.toContain('ws-empty__description');
    expect(markup).not.toContain('ws-empty__actions');
  });

  it("critical: role='alert' so a failed load is announced; caller can override the role", () => {
    expect(html(createElement(EmptyState, { tone: 'critical', title: "Couldn't load" }))).toContain('role="alert"');
    expect(html(createElement(EmptyState, { tone: 'critical', role: 'status', title: "Couldn't load" }))).toContain('role="status"');
  });

  it('critical with role={undefined} renders no role (a docs or static preview is not announced)', () => {
    const markup = html(createElement(EmptyState, { tone: 'critical', role: undefined, title: "Couldn't load" }));
    expect(markup).not.toContain('role=');
    expect(markup).toContain('data-tone="critical"');
  });

  it('titleAs picks the heading level; framed adds the frame flag', () => {
    const markup = html(createElement(EmptyState, { title: 'Empty', titleAs: 'h3', framed: true, description: 'Next', actions: createElement('button') }));
    expect(markup).toContain('<h3 class="ws-empty__title">Empty</h3>');
    expect(markup).toContain('data-framed=""');
    expect(markup).toContain('<p class="ws-empty__description">Next</p>');
    expect(markup).toContain('ws-empty__actions');
  });
});

describe('SearchField', () => {
  const base = { label: 'Search saved styles', onValueChange: noop };

  it('labels the input (visually hidden by default) and uses type="search"', () => {
    const markup = html(createElement(SearchField, { ...base, id: 'q', value: '' }));
    expect(markup).toMatch(/<label class="ws-search__label" for="q" data-hidden="">Search saved styles<\/label>/);
    expect(markup).toMatch(/<input[^>]*id="q"[^>]*type="search"/);
  });

  it('generates a matching id when none is given', () => {
    const markup = html(createElement(SearchField, { ...base, value: '' }));
    const labelFor = markup.match(/<label[^>]*for="([^"]+)"/)?.[1];
    const inputId = markup.match(/<input[^>]*id="([^"]+)"/)?.[1];
    expect(labelFor).toBeTruthy();
    expect(labelFor).toBe(inputId);
  });

  it('showLabel shows the label', () => {
    expect(html(createElement(SearchField, { ...base, value: '', showLabel: true }))).not.toContain('data-hidden');
  });

  it('shows a named clear button only when there is a value to clear', () => {
    expect(html(createElement(SearchField, { ...base, value: '' }))).not.toContain('ws-search__clear');
    const filled = html(createElement(SearchField, { ...base, value: 'glass', clearLabel: '검색어 지우기' }));
    expect(filled).toMatch(/<button type="button" class="ws-search__clear" aria-label="검색어 지우기">/);
  });

  it('no clear button on a disabled field', () => {
    expect(html(createElement(SearchField, { ...base, value: 'glass', disabled: true }))).not.toContain('ws-search__clear');
  });

  // Review finding: a read-only field must not offer a way to clear it.
  it('no clear button on a read-only field', () => {
    expect(html(createElement(SearchField, { ...base, value: 'glass', readOnly: true }))).not.toContain('ws-search__clear');
  });
});

describe('Skeleton', () => {
  it('blocks are hidden from AT and default to 100% x 12px', () => {
    const markup = html(createElement(Skeleton));
    expect(markup).toContain('aria-hidden="true"');
    expect(markup).toContain('width:100%');
    expect(markup).toContain('height:12px');
  });

  it('the loading label is its own status region; aria-busy sits on the blocks only', () => {
    const markup = html(createElement(SkeletonGroup, { label: 'Loading saved styles' }, createElement(Skeleton)));
    expect(markup).toContain('<span class="ws-skeleton-group__label" role="status">Loading saved styles</span>');
    expect(markup).toContain('<div class="ws-skeleton-group__blocks" aria-busy="true">');
    expect(markup).toMatch(/^<div class="ws-skeleton-group">/);
  });
});

describe('Surface', () => {
  it('Shell is a <div> by default (no landmark) and accepts other elements', () => {
    expect(html(createElement(Shell, null))).toMatch(/^<div class="ws-shell"/);
    expect(html(createElement(Shell, { as: 'section' }))).toMatch(/^<section class="ws-shell"/);
  });

  it('ShellHeader renders titleAs/titleId and a zero meta value', () => {
    const markup = html(createElement(ShellHeader, { title: 'Deploys', titleAs: 'h2', titleId: 't', meta: 0 }));
    expect(markup).toContain('<h2 class="ws-shell-header__title" id="t">Deploys</h2>');
    expect(markup).toContain('<span class="ws-shell-header__meta">0</span>');
  });

  it('Panel merges a caller class', () => {
    expect(html(createElement(Panel, { className: 'x' }))).toContain('class="ws-panel x"');
  });
});
