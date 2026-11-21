import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { HOME_PURPOSE_IDS, resolvePurposeDiscovery } from '../../src/data/purposeDiscovery';
import { getStyleProfile } from '../../src/data/styleProfiles';
import { Home } from '../../src/pages/Home';
import { loadStyleProfiles } from '../../src/pages/home/styleProfileLoader';
import { getDesignWorkspace } from '../../src/visual/useDesignWorkspace';

describe('Home loads the style profiles on demand', () => {
  it('needs no profiles to browse or to report a mixed or unknown purpose', () => {
    expect(resolvePurposeDiscovery('all', undefined)).toEqual(resolvePurposeDiscovery('all', getStyleProfile));
    expect(resolvePurposeDiscovery('mixed', undefined)).toEqual(resolvePurposeDiscovery('mixed', getStyleProfile));
    expect(resolvePurposeDiscovery('spaceship', undefined)).toEqual(resolvePurposeDiscovery('spaceship', getStyleProfile));
  });

  it('keeps a chosen purpose pending until the profiles load', () => {
    for (const purpose of HOME_PURPOSE_IDS) {
      expect(resolvePurposeDiscovery(purpose, undefined)).toEqual({ input: purpose, status: 'pending', archetypeId: purpose, entries: [], cautions: [], hidesStyles: false });
    }
  });

  it('renders the same shortlist as before once they have loaded', async () => {
    getDesignWorkspace().setDiscovery({ purpose: 'commerce' });
    const pending = renderToStaticMarkup(createElement(Home, { lang: 'en' }));
    expect(pending).toContain('data-purpose-status="pending"');
    expect(pending).not.toContain('purpose-discovery__shortlist');

    expect(await loadStyleProfiles()).toBe(getStyleProfile);
    const loaded = renderToStaticMarkup(createElement(Home, { lang: 'en' }));
    expect(loaded).toContain('data-purpose-status="shortlist"');
    const expected = resolvePurposeDiscovery('commerce', getStyleProfile);
    for (const entry of expected.entries) {
      expect(loaded).toContain(`data-style-id="${entry.styleId}"`);
      expect(loaded).toContain(entry.reasons.join(' · '));
    }
    for (const caution of expected.cautions) expect(loaded).toContain(`data-caution-for="${caution.styleId}"`);
  });
});
