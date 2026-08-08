import { describe, it, expect } from 'vitest';
import { buildCatalogData, catalogCounts } from '../../src/catalog/index.ts';
import { validateCatalog, notIdealCoverageWarnings } from '../lib/catalog-validation.mts';
import { stableStringify } from '../lib/stable-json.mts';
import { styleCatalog } from '../../src/data/styles.ts';
import { styleFacets } from '../../src/catalog/styleFacets.ts';

const data = buildCatalogData();

describe('catalog integrity', () => {
  it('compiles without throwing and has expected counts', () => {
    const c = catalogCounts(data);
    expect(c.styles).toBe(48);
    expect(c.motionPatterns).toBe(29);
    expect(c.components).toBe(20);
    expect(c.principles).toBe(23);
    expect(c.designPrinciples).toBe(25);
    expect(c.auditChecks).toBe(41);
    expect(c.stateSurfaces).toBe(5);
    expect(c.stateRecipes).toBe(57);
    expect(c.productArchetypes).toBe(14);
  });

  it('ships 25 independently authored visual design principles with placement, verification, and source guidance', () => {
    expect(data.designPrinciples).toHaveLength(25);
    expect(data.designPrincipleCategories).toHaveLength(7);
    expect(data.designPrincipleCategories.map((category) => category.id)).toEqual([
      'intent-iteration',
      'hierarchy-semantics',
      'adaptation-density',
      'typography-localization',
      'tokens-color-themes',
      'interaction-accessibility',
      'states-feedback-recovery',
    ]);
    expect(new Set(data.designPrinciples.map((p) => p.id)).size).toBe(25);
    for (const p of data.designPrinciples) {
      expect(p.placement.length).toBeGreaterThan(0);
      expect(p.apply.length).toBeGreaterThan(0);
      expect(p.verify.length).toBeGreaterThan(0);
      expect(p.concernTags.length).toBeGreaterThan(0);
      expect(p.relatedUxPrincipleIds.length).toBeGreaterThan(0);
      expect(Array.isArray(p.references)).toBe(true);
      expect(p.references.every((reference) => (
        Boolean(reference.title.trim())
        && Boolean(reference.publisher.trim())
        && reference.url.startsWith('https://')
      ))).toBe(true);
      for (const value of [
        p.name, p.summary, p.designQuestion, p.caution,
        ...p.placement, ...p.apply, ...p.verify,
      ]) {
        expect(value.en.trim()).not.toBe('');
        expect(value.ko.trim()).not.toBe('');
        expect(value.ja.trim()).not.toBe('');
      }
    }
    expect(data.designPrinciples.map((principle) => principle.id)).toEqual(expect.arrayContaining([
      'explicit-labels-and-semantics',
      'task-aware-density',
      'multi-input-operability',
      'complete-state-model',
      'recoverable-actions',
      'motion-and-preference',
      'evidence-near-claim',
      'navigation-preserves-context',
      'iconography-has-a-job',
    ]));
    for (const id of [
      'evidence-near-claim',
      'navigation-preserves-context',
      'iconography-has-a-job',
    ]) {
      expect(data.designPrinciples.find((principle) => principle.id === id)?.references.length)
        .toBeGreaterThan(0);
    }
  });

  it('has zero validation errors', () => {
    const issues = validateCatalog(data);
    const errors = issues.filter((i) => i.severity === 'error');
    expect(errors, JSON.stringify(errors, null, 2)).toHaveLength(0);
  });

  it('maps every verification item and anti-pattern to one structured audit check', () => {
    const expected = data.policies.verification.reduce((sum, group) => sum + group.items.length, 0)
      + data.policies.antiPatterns.length;
    expect(data.policies.auditChecks).toHaveLength(expected);
    expect(new Set(data.policies.auditChecks.map((check) => check.id)).size).toBe(expected);
    expect(data.policies.auditChecks.some((check) => check.applicability === 'when-present')).toBe(true);
    expect(data.policies.auditChecks.some((check) => check.applicability === 'workflow-only')).toBe(true);
    expect(data.policies.auditChecks.every((check) => check.evidenceTypes.length > 0)).toBe(true);
  });

  it('every style (all 48) has authored facets', () => {
    for (const s of styleCatalog) {
      expect(styleFacets[s.id], `missing facets for ${s.id}`).toBeDefined();
    }
    expect(Object.keys(styleFacets)).toHaveLength(48);
  });

  it('serialization is deterministic (byte-identical)', () => {
    expect(stableStringify(data)).toEqual(stableStringify(buildCatalogData()));
  });

  it('ships 23 curated, independently authored UX principles with complete references', () => {
    expect(data.uxPrinciples).toHaveLength(23);
    expect(new Set(data.uxPrinciples.map((p) => p.id)).size).toBe(23);
    for (const p of data.uxPrinciples) {
      expect(p.apply.length).toBeGreaterThan(0);
      expect(p.verify.length).toBeGreaterThan(0);
      expect(p.evidence.references.length).toBeGreaterThan(0);
      expect(p.evidence.references.every((reference) => reference.title && reference.url.startsWith('https://'))).toBe(true);
      expect(p.referenceUrl).toMatch(/^https:\/\/lawsofux\.com\/[a-z0-9-]+\/$/);
    }
    expect(data.uxPrincipleAttribution.sourceLicense.name).toBe('CC BY-NC-ND 4.0');
    expect(data.uxPrincipleAttribution.authoredContentLicense.name).toBe('MIT');
    expect(data.uxPrincipleAttribution.authoredContentLicense.url)
      .toBe('https://github.com/seungdori/web-stylebook-mcp/blob/main/LICENSE');
    expect(data.uxPrincipleAttribution.notice.en).toContain('independently authored');
    expect(data.uxPrinciples.find((p) => p.id === 'fitts-law')?.referenceUrl)
      .toBe('https://lawsofux.com/fittss-law/');
  });

  it('every state recipe references a real surface', () => {
    const surfaceIds = new Set(data.stateSurfaces.map((s) => s.id));
    for (const r of data.stateRecipes) {
      for (const sid of r.surfaceIds) expect(surfaceIds.has(sid), `${r.id} -> ${sid}`).toBe(true);
    }
  });

  it('all notIdealFor phrases are mapped (no coverage warnings)', () => {
    expect(notIdealCoverageWarnings(data)).toHaveLength(0);
  });

  it('golden facet invariants', () => {
    const byId = Object.fromEntries(data.styles.map((s) => [s.id, s]));
    // cyberpunk-glitch is a continuous-spectacle, high-motion style
    expect(byId['cyberpunk-glitch']?.recommendationFacets.continuousSpectacle).toBe(true);
    expect(byId['cyberpunk-glitch']?.recommendationFacets.motionIntensity).toBe('high');
    // runtime-signal fits operational-saas and is calm/technical, low motion
    expect(byId['runtime-signal']?.recommendationFacets.productTypes).toContain('operational-saas');
    expect(byId['runtime-signal']?.recommendationFacets.continuousSpectacle).toBe(false);
  });

  it('tones and antiTones are disjoint for every style', () => {
    for (const s of data.styles) {
      const overlap = s.recommendationFacets.tones.filter((t) => s.recommendationFacets.antiTones.includes(t));
      expect(overlap, `${s.id} tone/antiTone overlap`).toHaveLength(0);
    }
  });
});
