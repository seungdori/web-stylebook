import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { designReferences, referenceLibrary } from '../../src/catalog/references.ts';
import { REFERENCE_CATEGORIES } from '../../src/catalog/types.ts';

describe('real-world design reference library', () => {
  it('ships a substantial, high-completeness collection', () => {
    expect(designReferences.length).toBeGreaterThanOrEqual(500);
    expect(designReferences).toHaveLength(520);
    expect(new Set(designReferences.map((reference) => reference.id)).size).toBe(designReferences.length);
    expect(new Set(designReferences.map((reference) => reference.category))).toEqual(new Set(REFERENCE_CATEGORIES));
  });

  it('keeps provenance and rights boundaries explicit', () => {
    expect(referenceLibrary.sourceRevision).toMatch(/^[0-9a-f]{40}$/);
    expect(Object.keys(referenceLibrary.sourceFiles)).toHaveLength(5);
    expect(Object.values(referenceLibrary.sourceFiles).every((hash) => /^sha256:[0-9a-f]{64}$/.test(hash))).toBe(true);
    expect(referenceLibrary.attribution.sourceName).toBe('OpenDesign');
    expect(referenceLibrary.attribution.sourceLicense.name).toBe('CC BY 4.0');
    expect(referenceLibrary.attribution.adaptationNotice.en).toContain('Adapted by Web Stylebook');
    expect(referenceLibrary.attribution.adaptationNotice.en).toContain('not individual manual verification');
    expect(referenceLibrary.attribution.adaptationNotice.ko).toContain('수정·선별');
    expect(referenceLibrary.attribution.rightsNotice.en).toContain('respective owner');
  });

  it('contains only source-linked observations and compact tokens', () => {
    for (const reference of designReferences) {
      expect(reference.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(reference.url).toMatch(/^https:\/\//);
      expect(reference.sourceSpecUrl).toMatch(/^https:\/\//);
      expect(reference.sourceMarkdownUrl).toMatch(/^https:\/\//);
      expect(reference.specCompleteness).toBeGreaterThanOrEqual(0.9);
      expect(Number.isFinite(Date.parse(reference.observedAt))).toBe(true);
      expect(reference.tags.length).toBeGreaterThan(0);
      for (const analysis of Object.values(reference.analysis)) {
        expect(analysis.en.trim()).not.toBe('');
        expect(analysis.ko.trim()).not.toBe('');
        expect(analysis.ja.trim()).not.toBe('');
      }
    }
  });

  it('excludes known capture failures and never stores image fields', () => {
    const serialized = JSON.stringify(referenceLibrary);
    expect(designReferences.some((reference) => reference.id === 'reveal')).toBe(false);
    expect(serialized).not.toMatch(/"(?:image|screenshot|logo|fontUrl)"\s*:/i);
    expect(serialized).not.toMatch(/access denied|security verification|server error|error state|timeout|browser verification|loading spinner|보안 게이트|보안 검문|브라우저 검증|로딩 스피너|セキュリティゲート|ブラウザ検証/i);
  });

  it('keeps the public lazy-loaded copy byte-identical to the canonical source', () => {
    const canonical = readFileSync(join(process.cwd(), 'src/catalog/references.generated.json'), 'utf8');
    const publicCopy = readFileSync(join(process.cwd(), 'public/reference-library.v1.json'), 'utf8');
    expect(publicCopy).toBe(canonical);
  });
});
