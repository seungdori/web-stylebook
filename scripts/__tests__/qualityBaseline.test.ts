import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getVisualContract, visualContractToCss, resolveVisualContract } from '../../src/visual';
import { createInitialDraft, parseDesignDraft } from '../../src/visual/workspace';
import { selectedPayloadViolations } from '../quality-measure.mts';
import {
  BASELINE_PATH,
  buildComparableBaseline,
  buildHandoffBaseline,
  comparableDrift,
  densityOverrideViolations,
  estimateTokens,
  fieldExpectationViolations,
  loadFieldExpectations,
  loadMeasurementConfig,
  missingExportDeclarations,
  semanticRoleViolations,
  staleDraftExportViolations,
} from '../quality-baseline.mts';

const mutations = JSON.parse(readFileSync(join(process.cwd(), 'scripts/fixtures/quality-baseline/mutations.json'), 'utf8')) as {
  swappedBrutalistRoles: { text: string; accent: string };
  expectedBrutalistRoles: { text: string; accent: string };
  removedExportDeclarations: string[];
  ignoredCompactDensity: { density: string; row: number; gutter: number; stack: number };
  staleExport: { revisionMatches: boolean; exported: boolean };
  fullCatalogPayload: unknown;
};

describe('phase 1 fidelity baseline', () => {
  it('estimates tokens with the named utf8-bytes-div-4/v1 proxy', () => {
    expect(estimateTokens('')).toBe(0);
    expect(estimateTokens('abcd')).toBe(1);
    expect(estimateTokens('abcde')).toBe(2);
    expect(estimateTokens('한국어')).toBe(3);
    expect(estimateTokens('한국어')).toBe(estimateTokens('한국어'));
  });

  it('pins smoke-set field values independently of a second wrapper', () => {
    const violations = loadFieldExpectations().flatMap((expected) => fieldExpectationViolations(expected));
    expect(violations).toEqual([]);
    const brutalist = resolveVisualContract('brutalist-grid');
    expect(semanticRoleViolations(
      { text: brutalist.colors.text, accent: brutalist.colors.accent },
      mutations.expectedBrutalistRoles,
    )).toEqual([]);
  });

  it('fails swapped text and accent, dropped tracking, ignored density, stale export, and full-catalog payload', () => {
    expect(semanticRoleViolations(mutations.swappedBrutalistRoles, mutations.expectedBrutalistRoles).length).toBeGreaterThan(0);
    const css = visualContractToCss(resolveVisualContract('brutalist-grid'));
    const removed = mutations.removedExportDeclarations.reduce((source, declaration) => source.replaceAll(declaration, ''), css);
    expect(missingExportDeclarations(removed, mutations.removedExportDeclarations)).toEqual([
      'missing export declaration --type-body-line-height: 1.65;',
      'missing export declaration --type-body-letter-spacing: 0em;',
    ]);
    expect(missingExportDeclarations(css, loadMeasurementConfig().brutalistExportMustContain)).toEqual([]);
    expect(densityOverrideViolations(mutations.ignoredCompactDensity, 'compact').length).toBeGreaterThan(0);
    expect(densityOverrideViolations(resolveVisualContract('brutalist-grid', { overrides: { density: 'compact' } }).spacing, 'compact')).toEqual([]);
    expect(staleDraftExportViolations(mutations.staleExport)).toEqual(['stale draft revision was exported']);
    const stale = JSON.stringify({ ...createInitialDraft('brutalist-grid'), contractRevision: 'fnv1a:0000000000000000' });
    const rebased = parseDesignDraft(stale);
    expect(rebased.ok && rebased.draft.contractRevision).toBe(getVisualContract('brutalist-grid').revision);
    expect(staleDraftExportViolations({ revisionMatches: false, exported: false })).toEqual([]);
    expect(selectedPayloadViolations(mutations.fullCatalogPayload).length).toBeGreaterThan(0);
  });

  it('does not fetch while measuring selected handoffs', () => {
    const original = globalThis.fetch;
    globalThis.fetch = () => Promise.reject(new Error('baseline capture must not fetch'));
    try {
      const handoff = buildHandoffBaseline();
      expect(handoff.fetchesPerformed).toBe(0);
      expect(handoff.status).toBe('pass');
      expect(handoff.modelTokenization.status).toBe('not-run');
    } finally {
      globalThis.fetch = original;
    }
  });

  it('matches stable baseline fields and enforces budget maxima when production byte actuals drift', async () => {
    const pinned = JSON.parse(readFileSync(BASELINE_PATH, 'utf8')) as { comparable: Awaited<ReturnType<typeof buildComparableBaseline>> };
    const comparable = await buildComparableBaseline();
    expect(comparable.claims.observedBrowserTransferCold).toBe('not-run');
    expect(comparable.claims.observedBrowserTransferWarm).toBe('not-run');
    expect(comparable.claims.liveModelComparison).toBe('not-run');
    expect(comparable.claims.allocation).toBe('not-run');
    expect(comparable.claims.interactionTiming).toBe('not-run');
    expect(comparable.claims.contrast).toBe('recorded');
    expect(comparable.fonts.routes.home.families.en).toEqual(['Inter', 'Space Grotesk', 'IBM Plex Mono']);
    expect(comparable.fonts.catalogFamilyCount).toBeGreaterThan(comparable.fonts.routes.home.families.en.length);
    expect(comparable.fidelity).toEqual(pinned.comparable.fidelity);
    expect(comparable.handoff).toEqual(pinned.comparable.handoff);
    expect(comparable.fonts).toEqual(pinned.comparable.fonts);
    expect(comparable.structural).toEqual(pinned.comparable.structural);
    expect(comparable.fixtureSha256).toBe(pinned.comparable.fixtureSha256);
    expect(comparable.configSha256).toBe(pinned.comparable.configSha256);
    if (existsSync(join(process.cwd(), 'dist/index.html'))) {
      expect(comparableDrift(comparable, pinned.comparable)).toEqual([]);
      return;
    }
    expect(comparable.staticAssets.status).toBe('not-run');
  }, 60_000);

  it('ignores toolchain drift in budget actuals and still rejects a raised max or an over-budget actual', () => {
    const pinned = JSON.parse(readFileSync(BASELINE_PATH, 'utf8')) as { comparable: PinnedComparable };
    const within = structuredClone(pinned.comparable);
    const entry = within.staticAssets.budgetChecks.find((check) => check.metric === 'entryJsGzipBytes');
    if (!entry) throw new Error('missing entryJsGzipBytes budget');
    expect(entry.actual).toBeLessThanOrEqual(entry.max);
    entry.actual = 146122;
    expect(entry.actual).toBeLessThanOrEqual(entry.max);
    entry.status = 'pass';
    within.staticAssets.metrics.entryJsGzipBytes = 146122;
    within.staticAssets.entry.gzipBytes = 146122;
    within.staticAssets.entry.bytes += 4000;
    within.staticAssets.entry.sha256 = '0'.repeat(64);
    within.staticAssets.document.gzipBytes += 40;
    within.staticAssets.document.subresources[0].url = '/assets/index-AAAAAAAA.js';
    within.staticAssets.routeClosures.home.gzipBytes += 2000;
    within.staticAssets.routeClosures.home.files[0] = within.staticAssets.routeClosures.home.files[0].replace(/-[A-Za-z0-9_-]{8}\.js$/, '-AAAAAAAA.js');
    expect(comparableDrift(within, pinned.comparable)).toEqual([]);

    const over = structuredClone(pinned.comparable);
    const overEntry = over.staticAssets.budgetChecks[0];
    expect(overEntry?.metric).toBe('entryJsGzipBytes');
    if (!overEntry) throw new Error('missing entryJsGzipBytes budget');
    overEntry.actual = overEntry.max + 1;
    overEntry.status = 'fail';
    expect(comparableDrift(over, pinned.comparable).join('\n')).toContain(`${overEntry.metric}: actual ${overEntry.actual} exceeds max ${overEntry.max}`);

    const raised = structuredClone(pinned.comparable);
    raised.staticAssets.budgetChecks[0].max += 1;
    expect(comparableDrift(raised, pinned.comparable)).toEqual(['comparable baseline drifted: $.staticAssets.budgetChecks[0].max']);

    const coverage = structuredClone(pinned.comparable);
    coverage.staticAssets.selectedCoverage.actual -= 1;
    expect(comparableDrift(coverage, pinned.comparable)).toEqual(['comparable baseline drifted: $.staticAssets.selectedCoverage.actual']);

    const handoff = structuredClone(pinned.comparable);
    handoff.handoff.maxBytes += 1;
    expect(comparableDrift(handoff, pinned.comparable)).toEqual(['comparable baseline drifted: $.handoff.maxBytes']);
  });
});

interface PinnedBudgetCheck {
  metric: string;
  max: number;
  actual: number;
  status: string;
}

interface PinnedComparable {
  handoff: { maxBytes: number };
  staticAssets: {
    metrics: Record<string, number>;
    entry: { bytes: number; gzipBytes: number; sha256: string };
    document: { gzipBytes: number; subresources: Array<{ url: string }> };
    routeClosures: Record<string, { gzipBytes: number; files: string[] }>;
    budgetChecks: PinnedBudgetCheck[];
    selectedCoverage: { actual: number };
  };
}
