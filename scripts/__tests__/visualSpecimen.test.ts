import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { VisualSpecimen } from '../../src/components/VisualSpecimen';
import { getSpecimenCopy, specimenFixtureIds } from '../../src/data/visualFixtures';
import { resolveVisualContract, TYPOGRAPHY_ROLES, visualContractToCss } from '../../src/visual';

describe('shared visual specimen', () => {
  it('renders every reading role in each localized fixture without inactive form controls', () => {
    for (const lang of ['en', 'ko', 'ja'] as const) {
      const spec = resolveVisualContract('brutalist-grid', { contentLocale: lang });
      for (const fixtureId of specimenFixtureIds) {
        const html = renderToStaticMarkup(createElement(VisualSpecimen, { spec, lang, fixtureId }));
        for (const role of TYPOGRAPHY_ROLES) expect(html).toContain(`data-type-role="${role}"`);
        expect(html).toContain(`lang="${lang}"`);
        expect(html).toContain(getSpecimenCopy(fixtureId, lang).heading);
        expect(html).not.toMatch(/<(?:button|input|select|textarea|a)\b/);
      }
    }
  });

  it('applies resolved user colors and complete typography without changing fixture content', () => {
    const original = resolveVisualContract('brutalist-grid');
    const updated = resolveVisualContract('brutalist-grid', {
      overrides: {
        colors: { actionPrimary: '#123456', actionPrimaryText: '#ffffff' },
        typography: { body: { lineHeight: 1.85, letterSpacingEm: 0.02, measureCh: 44, paragraphSpacingEm: 1.3 } },
      },
    });
    const before = renderToStaticMarkup(createElement(VisualSpecimen, { spec: original, lang: 'en', fixtureId: 'operations' }));
    const after = renderToStaticMarkup(createElement(VisualSpecimen, { spec: updated, lang: 'en', fixtureId: 'operations' }));
    expect(after).toContain('--vs-action-primary:#123456');
    expect(after).toContain('--vs-action-primary-text:#ffffff');
    expect(after).toContain('line-height:1.85');
    expect(after).toContain('letter-spacing:0.02em');
    expect(after).toContain('max-width:44ch');
    expect(after).toContain('margin-block-end:1.3em');
    expect(after.replace(/ style="[^"]*"/g, '').replace(/ data-visual-hash="[^"]*"/g, ''))
      .toEqual(before.replace(/ style="[^"]*"/g, '').replace(/ data-visual-hash="[^"]*"/g, ''));
  });

  it('renders edited copy as text, including markup-like input', () => {
    const spec = resolveVisualContract('editorial-silence');
    const html = renderToStaticMarkup(createElement(VisualSpecimen, {
      spec,
      lang: 'en',
      copy: { heading: '<img src=x onerror=alert(1)>', body: 'A & B', label: 'Read <more>' },
    }));
    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(html).toContain('A &amp; B');
    expect(html).toContain('Read &lt;more&gt;');
  });

  it('keeps localized fixture text when persisted copy fields are empty', () => {
    const spec = resolveVisualContract('brutalist-grid', { contentLocale: 'ko' });
    const props = { spec, lang: 'ko', fixtureId: 'editorial' } as const;
    const defaultPreview = renderToStaticMarkup(createElement(VisualSpecimen, props));
    const emptyDraftPreview = renderToStaticMarkup(createElement(VisualSpecimen, {
      ...props,
      copy: { heading: '', body: '  \n ', label: undefined, caption: '' },
    }));
    expect(emptyDraftPreview).toEqual(defaultPreview);
  });

  it('sizes preview typography to its own container while exported typography uses the viewport', () => {
    const spec = resolveVisualContract('brutalist-grid');
    const html = renderToStaticMarkup(createElement(VisualSpecimen, { spec, lang: 'en', width: 'narrow' }));
    const article = html.match(/^<article[^>]*>/)?.[0];
    expect(html).toContain('cqi');
    expect(html).not.toContain('vw');
    expect(article).toBeDefined();
    expect(article).not.toContain('cqi');
    expect(visualContractToCss(spec)).toContain('vw');
    expect(visualContractToCss(spec)).not.toContain('cqi');
  });
});
