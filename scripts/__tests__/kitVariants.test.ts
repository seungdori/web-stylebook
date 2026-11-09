import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Button } from '../../src/kit/button/button';
import { EmptyState } from '../../src/kit/empty-state/empty-state';
import { StatusBadge } from '../../src/kit/status-badge/status-badge';

describe('kit variants', () => {
  it('StatusBadge marks live work only when asked', () => {
    expect(renderToStaticMarkup(createElement(StatusBadge, { tone: 'info', live: true, children: 'Running' }))).toContain('data-live=""');
    expect(renderToStaticMarkup(createElement(StatusBadge, { tone: 'info', children: 'Running' }))).not.toContain('data-live');
  });

  it('EmptyState compact sets its layout flag', () => {
    expect(renderToStaticMarkup(createElement(EmptyState, { title: 'No matches', compact: true }))).toContain('data-compact=""');
    expect(renderToStaticMarkup(createElement(EmptyState, { title: 'No matches' }))).not.toContain('data-compact');
  });

  it('Button accepts the quiet variant', () => {
    expect(renderToStaticMarkup(createElement(Button, { variant: 'quiet', children: 'Skip' }))).toContain('data-variant="quiet"');
  });
});
