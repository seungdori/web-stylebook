import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { productArchetypes } from '../../src/catalog/products';
import { notIdealMap } from '../../src/catalog/styleFacets';
import { parseDiscoveryQuery, urlWithDiscovery } from '../../src/data/discoveryUrl';
import { homeChoiceCopy, purposeChoiceLabels } from '../../src/data/homeChoiceCopy';
import { HERO_STYLE_IDS, HOME_PURPOSE_IDS, matchingNotIdealPhrases, resolvePurposeDiscovery } from '../../src/data/purposeDiscovery';
import { homeRoute } from '../../src/data/routes';
import { getStyleById, styleCatalog, styleTags, type Lang } from '../../src/data/styles';
import { Home } from '../../src/pages/Home';
import { createDesignWorkspace, createInitialDraft, draftResolutionOptions, type DesignDraft } from '../../src/visual/workspace';
import { resolveSelectedSpec } from '../../src/visual/resolvedSpec';

function memoryStorage() {
  const values = new Map<string, string>();
  return { values, getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
}

describe('purpose-first discovery', () => {
  it('maps each home purpose deterministically to catalog product fit, bestFor reasons, and exact notIdealFor cautions', () => {
    for (const purpose of HOME_PURPOSE_IDS) {
      const first = resolvePurposeDiscovery(purpose);
      const second = resolvePurposeDiscovery(purpose);
      expect(second).toEqual(first);
      expect(first.status).toBe('shortlist');
      expect(first.hidesStyles).toBe(false);
      expect(first.entries.length).toBeGreaterThan(0);
      expect(first.entries.length).toBeLessThanOrEqual(3);

      const archetype = productArchetypes.find((item) => item.id === purpose);
      expect(archetype).toBeDefined();
      expect(first.entries.map((entry) => entry.styleId)).toEqual(archetype!.recommendedPrimaryStyleIds.slice(0, 3));

      for (const entry of first.entries) {
        const style = getStyleById(entry.styleId);
        expect(style).toBeDefined();
        expect(entry.productFit).toBe('recommendedPrimaryStyleIds');
        expect(entry.reasons).toEqual(style!.promptProfile.bestFor);
        expect(entry.reasons.length).toBeGreaterThan(0);
      }

      for (const caution of first.cautions) {
        const style = getStyleById(caution.styleId);
        expect(archetype!.avoidStyleIds).toContain(caution.styleId);
        if (caution.source === 'notIdealFor') {
          expect(caution.phrase).toEqual(expect.any(String));
          expect(style!.promptProfile.notIdealFor).toContain(caution.phrase);
          expect(Object.prototype.hasOwnProperty.call(notIdealMap, caution.phrase!)).toBe(true);
          expect(notIdealMap[caution.phrase!]).toContain(purpose);
        } else {
          expect(caution.phrase).toBeUndefined();
          expect(matchingNotIdealPhrases(style!.promptProfile.notIdealFor, purpose)).toEqual([]);
        }
      }
    }
  });

  it('does not treat a prose substring as a purpose match', () => {
    expect(matchingNotIdealPhrases(['enterprise SaaS'], 'operational-saas')).toEqual(['enterprise SaaS']);
    expect(matchingNotIdealPhrases(['enterprise SaaS marketing', 'prefix enterprise SaaS'], 'operational-saas')).toEqual([]);
    expect(matchingNotIdealPhrases(['B2B SaaS dashboards'], 'operational-saas')).toEqual(['B2B SaaS dashboards']);
    expect(matchingNotIdealPhrases(['not B2B SaaS dashboards at all'], 'operational-saas')).toEqual([]);
  });

  it('keeps unknown and mixed purposes neutral without hiding the catalog', () => {
    for (const input of ['mixed', 'not-a-purpose', '']) {
      const result = resolvePurposeDiscovery(input);
      expect(result.status).toBe('neutral');
      expect(result.entries).toEqual([]);
      expect(result.cautions).toEqual([]);
      expect(result.hidesStyles).toBe(false);
    }
    expect(resolvePurposeDiscovery('mixed').neutralReason).toBe('mixed');
    expect(resolvePurposeDiscovery('not-a-purpose').neutralReason).toBe('unknown');
    expect(resolvePurposeDiscovery('all').neutralReason).toBe('browse');
    expect(styleCatalog.length).toBeGreaterThan(HOME_PURPOSE_IDS.length);
  });

  it('continues a shortlist or hero choice into the working draft', () => {
    const store = createDesignWorkspace(memoryStorage());
    const commerce = resolvePurposeDiscovery('commerce');
    const chosen = commerce.entries[0]!.styleId;
    expect(store.requestStyleSelection(chosen)).toBe(true);
    expect(store.getSnapshot().draft.styleId).toBe(chosen);
    const resolved = resolveSelectedSpec(chosen, draftResolutionOptions(store.getSnapshot().draft));
    expect(resolved.styleId).toBe(chosen);

    expect(store.requestStyleSelection(HERO_STYLE_IDS[0])).toBe(true);
    expect(store.getSnapshot().draft.styleId).toBe(HERO_STYLE_IDS[0]);
    expect(HERO_STYLE_IDS).toHaveLength(3);
    for (const id of HERO_STYLE_IDS) expect(getStyleById(id)).toBeDefined();
    store.dispose();
  });

  it('keeps project text out of the discovery URL and rejects an unknown purpose', () => {
    const discovery: DesignDraft['discovery'] = { ...createInitialDraft().discovery, query: 'quiet', tag: 'minimal', purpose: 'commerce' };
    const url = urlWithDiscovery('/ko/', '?left=brutalist-grid', '', discovery);
    expect(url.startsWith('/ko/?')).toBe(true);
    expect(url).toContain('q=quiet');
    expect(url).toContain('tag=minimal');
    expect(url).toContain('purpose=commerce');
    expect(url).toContain('left=brutalist-grid');
    expect(url).not.toContain('Secret');

    const secret = 'Confidential client launch';
    expect(urlWithDiscovery('/', '', '', { ...createInitialDraft().discovery, query: '' })).not.toContain(secret);
    const parsed = parseDiscoveryQuery('?purpose=spaceship&q=desk', styleTags);
    expect(parsed.problems).toContain('purpose');
    expect(parsed.discovery.purpose).toBeUndefined();
    expect(parsed.discovery.query).toBe('desk');
    const unsupported = parseDiscoveryQuery('?tag=not-a-tag', styleTags);
    expect(unsupported.problems).toContain('tag');
    expect(unsupported.discovery.tag).toBe('not-a-tag');
  });

  it('renders the shared specimen, purpose reasons, and a catalog count in every UI language', () => {
    for (const lang of ['en', 'ko', 'ja'] as const satisfies readonly Lang[]) {
      expect(homeChoiceCopy[lang].title.length).toBeGreaterThan(0);
      for (const purpose of HOME_PURPOSE_IDS) expect(purposeChoiceLabels[purpose][lang].length).toBeGreaterThan(0);
      const html = renderToStaticMarkup(createElement(Home, { lang }));
      expect(html).toContain('data-fixture="product"');
      expect(html).toContain('data-home-style="editorial-silence"');
      expect(html).toContain('data-home-style="brutalist-grid"');
      expect(html).toContain('data-home-style="quiet-utility"');
      expect(html).not.toContain('<iframe');
      expect(html).toContain(`data-catalog-count="${styleCatalog.length}"`);
      expect(html).toContain(homeChoiceCopy[lang].title);
      expect(html).toContain(purposeChoiceLabels.commerce[lang]);
    }
    expect(homeRoute.description.en).toContain(`${styleCatalog.length} authored`);
  });
});
