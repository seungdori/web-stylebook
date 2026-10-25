import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { VisualSpecimen } from '../../src/components/VisualSpecimen';
import { styleCatalog } from '../../src/data/styles';
import { getVisualContract } from '../../src/visual';
import { exportResolvedSpec, resolveSelectedSpec, staticSelectedHandoffDocument } from '../../src/visual/resolvedSpec';
import type { ResolvedVisualContract } from '../../src/visual/types';
import { createDesignWorkspace, createInitialDraft, DESIGN_DRAFT_STORAGE_KEY, draftResolutionOptions, parseDesignDraft } from '../../src/visual/workspace';
import { loadFieldExpectations } from '../quality-baseline.mts';
import { selectedPayloadViolations } from '../quality-measure.mts';
import {
  coverageViolations,
  cssDeclarationsFor,
  exportFieldViolations,
  loadOverrideExpectations,
  loadStyleFieldExpectations,
  missingCssDeclarations,
  observedFieldViolations,
  overrideFieldViolations,
  resolvedFieldViolations,
  staticFieldViolations,
  staticResolverFieldViolations,
} from '../quality-contract.mts';

const mutations = JSON.parse(readFileSync(join(process.cwd(), 'scripts/fixtures/quality-baseline/mutations.json'), 'utf8')) as {
  fullCatalogPayload: unknown;
};

function memoryStorage(initial?: string) {
  const values = new Map<string, string>();
  if (initial) values.set(DESIGN_DRAFT_STORAGE_KEY, initial);
  return { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } };
}

describe('all-style contract fields', () => {
  it('pins a reviewed literal for every current style and content locale', () => {
    const expectations = loadStyleFieldExpectations();
    expect(coverageViolations(expectations)).toEqual([]);
    const authoredRows = styleCatalog.reduce((count, style) => count + Object.keys(getVisualContract(style.id).modes).length * 3, 0);
    expect(expectations).toHaveLength(authoredRows);
    const smoke = loadFieldExpectations();
    for (const item of smoke) {
      const full = expectations.find((expected) => expected.styleId === item.styleId && expected.contentLocale === item.contentLocale && expected.mode === item.mode);
      expect(full, `${item.styleId}/${item.contentLocale}`).toBeDefined();
      if (!full) continue;
      expect(full.mode).toBe(item.mode);
      expect(full.colors.canvas).toBe(item.canvas);
      expect(full.colors.surface).toBe(item.surface);
      expect(full.colors.text).toBe(item.text);
      expect(full.colors.accent).toBe(item.accent);
      expect(full.colors.actionPrimary).toBe(item.actionPrimary);
      expect(full.display.lineHeight).toBe(item.displayLineHeight);
      expect(full.display.letterSpacingEm).toBe(item.displayLetterSpacingEm);
      expect(full.display.fontFamily).toBe(item.displayFontFamily);
      expect(full.body.lineHeight).toBe(item.bodyLineHeight);
      expect(full.body.letterSpacingEm).toBe(item.bodyLetterSpacingEm);
      expect(full.body.fontFamily).toBe(item.bodyFontFamily);
      expect(full.body.wordBreak).toBe(item.bodyWordBreak);
      expect(full.spacing).toMatchObject({ density: item.density, row: item.row, gutter: item.gutter, stack: item.stack });
    }
  });

  it('matches browser resolution, CSS and JSON export, and the static handoff to those literals', () => {
    const violations = loadStyleFieldExpectations().flatMap((expected) => {
      const authoredMode = getVisualContract(expected.styleId).defaultMode;
      const published = expected.mode === authoredMode;
      return [
        ...resolvedFieldViolations(expected),
        ...exportFieldViolations(expected),
        ...staticResolverFieldViolations(expected),
        ...(published ? staticFieldViolations(expected) : []),
      ];
    });
    expect(violations).toEqual([]);
  }, 30_000);

  it('matches the built static artifact for the same contract revision', () => {
    const directory = join(process.cwd(), 'dist/agent-handoff');
    expect(existsSync(directory), 'npm run build must write dist/agent-handoff before this parity check').toBe(true);
    const violations = loadStyleFieldExpectations().flatMap((expected) => {
      if (expected.mode !== getVisualContract(expected.styleId).defaultMode) return [];
      const path = join(directory, `${expected.styleId}.${expected.contentLocale}.json`);
      if (!existsSync(path)) return [`missing static artifact ${expected.styleId}.${expected.contentLocale}.json`];
      return staticFieldViolations(expected, readFileSync(path, 'utf8'));
    });
    expect(violations).toEqual([]);
  });

  it('keeps the same field literals when display palette order is reversed', () => {
    const violations: string[] = [];
    for (const expected of loadStyleFieldExpectations()) {
      const style = styleCatalog.find((item) => item.id === expected.styleId);
      if (!style) throw new Error(`missing catalog style ${expected.styleId}`);
      const original = [...style.palette];
      style.palette.reverse();
      try {
        violations.push(...resolvedFieldViolations(expected));
      } finally {
        style.palette.splice(0, style.palette.length, ...original);
      }
    }
    expect(violations).toEqual([]);
  }, 30_000);

  it('keeps explicit overrides, authored tracking, and none/zero tokens in the browser and static resolvers', () => {
    const violations = loadOverrideExpectations().flatMap((expected) => overrideFieldViolations(expected));
    expect(violations).toEqual([]);
    expect(staticSelectedHandoffDocument('brutalist-grid', 'en')).not.toContain('#101010');
    expect(staticSelectedHandoffDocument('editorial-silence', 'en')).not.toContain('--type-display-letter-spacing: 0em;');
  });

  it('fails swapped roles, dropped tracking, ignored density, a stale export, and a full-catalog payload', () => {
    const expected = loadStyleFieldExpectations().find((item) => item.styleId === 'brutalist-grid' && item.contentLocale === 'en');
    if (!expected) throw new Error('missing brutalist field row');
    const resolved = resolveSelectedSpec(expected.styleId, { mode: expected.mode, contentLocale: expected.contentLocale });
    const swapped: ResolvedVisualContract = {
      ...resolved,
      colors: { ...resolved.colors, text: resolved.colors.accent, accent: resolved.colors.text },
    };
    expect(observedFieldViolations(expected, swapped).join('\n')).toContain('colors.text');
    const css = exportResolvedSpec(resolved, 'css');
    const required = cssDeclarationsFor(expected).filter((declaration) => declaration.startsWith('--type-body-line-height') || declaration.startsWith('--type-body-letter-spacing') || declaration.startsWith('--shadow-sm'));
    const stripped = required.reduce((source, declaration) => source.replaceAll(declaration, ''), css);
    expect(missingCssDeclarations(stripped, required)).toEqual(required.map((declaration) => `missing export declaration ${declaration}`));
    expect(missingCssDeclarations(css, required)).toEqual([]);
    const ignored: ResolvedVisualContract = {
      ...resolved,
      spacing: { ...resolved.spacing, density: 'comfortable', row: 44, gutter: 24, stack: 20 },
    };
    const compact = { ...expected, spacing: { ...expected.spacing, density: 'compact' as const, row: 32, gutter: 12, stack: 12 } };
    expect(observedFieldViolations(compact, ignored).join('\n')).toContain('spacing.density');
    const rebased = parseDesignDraft(JSON.stringify({ ...createInitialDraft('brutalist-grid'), contractRevision: 'fnv1a:0000000000000000' }));
    expect(rebased.ok && rebased.draft.contractRevision).toBe(getVisualContract('brutalist-grid').revision);
    const stale = { ...resolved, colors: { ...resolved.colors, text: '#333333' } };
    expect(() => exportResolvedSpec(stale, 'json')).toThrow(/hash/);
    expect(() => exportResolvedSpec(stale, 'css')).toThrow(/hash/);
    expect(selectedPayloadViolations(JSON.parse(staticSelectedHandoffDocument('brutalist-grid', 'en')))).toEqual([]);
    expect(selectedPayloadViolations(mutations.fullCatalogPayload).length).toBeGreaterThan(0);
  });

  it('changes contract fields with the content locale and leaves UI language on the specimen copy', () => {
    const english = loadStyleFieldExpectations().find((item) => item.styleId === 'brutalist-grid' && item.contentLocale === 'en');
    const korean = loadStyleFieldExpectations().find((item) => item.styleId === 'brutalist-grid' && item.contentLocale === 'ko');
    if (!english || !korean) throw new Error('missing brutalist locale rows');
    const spec = resolveSelectedSpec('brutalist-grid', { mode: 'light', contentLocale: 'en' });
    const koreanSpec = resolveSelectedSpec('brutalist-grid', { mode: 'light', contentLocale: 'ko' });
    expect(spec.typography.roles.display.letterSpacingEm).toBe(english.display.letterSpacingEm);
    expect(spec.typography.roles.display.letterSpacingEm).toBe(-0.04);
    expect(koreanSpec.typography.roles.display.letterSpacingEm).toBe(korean.display.letterSpacingEm);
    expect(koreanSpec.typography.roles.display.letterSpacingEm).toBe(0);
    expect(koreanSpec.typography.roles.body.wordBreak).toBe('keep-all');
    expect(koreanSpec.colors.text).toBe(english.colors.text);
    expect(koreanSpec.contentHash).not.toBe(spec.contentHash);
    const englishUi = renderToStaticMarkup(createElement(VisualSpecimen, { spec, lang: 'en', fixtureId: 'product' }));
    const koreanUi = renderToStaticMarkup(createElement(VisualSpecimen, { spec, lang: 'ko', fixtureId: 'product' }));
    expect(englishUi).toContain('Plan your next release.');
    expect(englishUi).not.toContain('다음 출시를 계획하세요.');
    expect(koreanUi).toContain('다음 출시를 계획하세요.');
    expect(koreanUi).not.toContain('Plan your next release.');
    expect(englishUi).toContain(`--vs-text:${english.colors.text}`);
    expect(koreanUi).toContain(`--vs-text:${english.colors.text}`);
    expect(englishUi).toContain(`data-visual-hash="${spec.contentHash}"`);
    expect(koreanUi).toContain(`data-visual-hash="${spec.contentHash}"`);
  });

  it('exports a migrated draft with the saved color and rebases a stale revision without losing it', () => {
    const raw = JSON.stringify({ schemaVersion: 0, selectedStyleId: 'editorial-silence', overrides: { colors: { text: '#222333' } }, contentLocale: 'ko' });
    const parsed = parseDesignDraft(raw);
    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    expect(parsed.migrated).toBe(true);
    const storage = memoryStorage(raw);
    const store = createDesignWorkspace(storage);
    store.setTypographyRole('body', { lineHeight: 1.9 });
    const draft = store.getSnapshot().draft;
    expect(draft.overrides.colors?.text).toBe('#222333');
    expect(draft.overrides.typography?.body?.lineHeight).toBe(1.9);
    expect(draft.contentLocale).toBe('ko');
    const spec = resolveSelectedSpec(draft.styleId, draftResolutionOptions(draft));
    const css = exportResolvedSpec(spec, 'css');
    expect(spec.colors.text).toBe('#222333');
    expect(spec.typography.roles.body.lineHeight).toBe(1.9);
    expect(spec.typography.roles.body.wordBreak).toBe('keep-all');
    expect(spec.typography.roles.display.letterSpacingEm).toBe(0);
    expect(css).toContain('--color-text: #222333;');
    expect(css).toContain('--type-body-line-height: 1.9;');
    expect(css).toContain('--type-body-word-break: keep-all;');
    expect(css).toContain('--type-display-letter-spacing: 0em;');
    const stale = JSON.stringify({ ...createInitialDraft('editorial-silence'), contractRevision: 'fnv1a:0000000000000000', overrides: { colors: { text: '#222333' } } });
    const rebased = parseDesignDraft(stale);
    expect(rebased.ok).toBe(true);
    if (rebased.ok) {
      expect(rebased.draft.contractRevision).toBe(getVisualContract('editorial-silence').revision);
      expect(rebased.draft.overrides.colors?.text).toBe('#222333');
      expect(resolveSelectedSpec(rebased.draft.styleId, draftResolutionOptions(rebased.draft)).revision).toBe(rebased.draft.contractRevision);
    }
  });
});
