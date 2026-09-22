import { afterEach, describe, expect, it } from 'vitest';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  DIMENSIONS, hash, prepareExperiment, recordResult, reportExperiment,
  type Manifest, type PrepareOptions, type RecordedResult,
} from '../quality-ai-evaluation.mts';

const temporaryDirectories: string[] = [];
afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) rmSync(directory, { recursive: true, force: true });
});

function options(overrides: Partial<PrepareOptions> = {}): PrepareOptions {
  const directory = mkdtempSync(join(tmpdir(), 'stylebook-quality-'));
  temporaryDirectories.push(directory);
  const baselineHandoff = join(directory, 'baseline.md');
  const improvedHandoff = join(directory, 'improved.md');
  const settings = join(directory, 'settings.json');
  writeFileSync(baselineHandoff, 'Original handoff\n');
  writeFileSync(improvedHandoff, 'Improved handoff\nPreserve semantic color roles.\n');
  writeFileSync(settings, JSON.stringify({ temperature: 0.2, seedSupport: 'unsupported' }));
  return {
    out: join(directory, 'experiment'), model: 'declared-model', modelVersion: 'version-2026-01',
    starterCommit: 'a'.repeat(40), baselineHandoff, improvedHandoff, settings,
    maxCostUsd: 1, maxTotalTokens: 10000, maxOutputTokensPerRun: 1000,
    ...overrides,
  };
}

function result(manifest: Manifest, arm: 'baseline' | 'improved', outcome: 'pass' | 'fail'): RecordedResult {
  const run = manifest.runs.find((entry) => entry.arm === arm)!;
  return {
    runId: run.id, status: 'succeeded', model: manifest.model, modelVersion: manifest.modelVersion,
    starterCommit: manifest.starterCommit, promptSha256: run.prompt.sha256,
    generationSettingsSha256: manifest.generationSettingsSha256,
    measurements: { inputTokens: 100, outputTokens: 200, costUsd: 0.1, elapsedMs: 1000 },
    artifacts: ['/evidence/build.log', '/evidence/desktop.png'], failureReason: '',
    assessments: Object.fromEntries(DIMENSIONS.map((dimension) => [dimension, { outcome, evidence: `${dimension}: observed fixture requirement in saved evidence.` }])) as RecordedResult['assessments'],
  };
}

describe('offline matched AI evaluation', () => {
  it('prepares six distinct briefs with three paired repetitions and exact frozen inputs, without executing them', () => {
    const config = options();
    const manifest = prepareExperiment(config);
    expect(manifest.runs).toHaveLength(36);
    expect(new Set(manifest.runs.map((run) => run.fixtureId)).size).toBe(6);
    const fixtures = JSON.parse(readFileSync(join(config.out, 'fixtures.json'), 'utf8')) as {
      fixtures: { id: string; productType: string; starterState: string; lockedScope: string[] }[];
    };
    expect(fixtures.fixtures.map((fixture) => fixture.productType).sort()).toEqual([
      'consumer-commerce', 'developer-tooling', 'editorial', 'narrow-refinement', 'operational-saas', 'product-presentation',
    ]);
    const refinement = fixtures.fixtures.find((fixture) => fixture.id === 'existing-project-refinement')!;
    expect(refinement.starterState).toContain('existing, already working');
    expect(refinement.lockedScope).toHaveLength(4);
    const refinementRun = manifest.runs.find((run) => run.fixtureId === refinement.id)!;
    const refinementPrompt = readFileSync(join(config.out, refinementRun.prompt.path), 'utf8');
    expect(refinementPrompt).toContain('Locked scope (takes precedence over the design handoff)');
    expect(refinementPrompt).toContain('240px width');
    expect(new Set(manifest.runs.map((run) => run.pairId)).size).toBe(18);
    expect(manifest.handoffs.baseline.sha256).toBe(hash(readFileSync(config.baselineHandoff, 'utf8')));
    const baselinePrompt = readFileSync(join(config.out, manifest.runs[0]!.prompt.path), 'utf8');
    const improvedPrompt = readFileSync(join(config.out, manifest.runs[1]!.prompt.path), 'utf8');
    expect(baselinePrompt.replace('Original handoff\n', '<HANDOFF>'))
      .toBe(improvedPrompt.replace('Improved handoff\nPreserve semantic color roles.\n', '<HANDOFF>'));
    const report = reportExperiment(join(config.out, 'manifest.json'));
    expect(report.status).toBe('not-run');
    expect(report.baseline).toEqual({ planned: 18, succeeded: 0, failed: 0, notRun: 18 });
    expect(report.improved).toEqual(report.baseline);
    expect(report.dimensions.typography).toMatchObject({ plannedPairs: 18, comparablePairs: 0, unassessedOrNotRun: 18 });
  });

  it('rejects under-repeated, unpinned, identical, or over-written experiments', () => {
    expect(() => prepareExperiment(options({ repetitions: 2 }))).toThrow();
    expect(() => prepareExperiment(options({ modelVersion: 'latest' }))).toThrow(/pinned/);
    expect(() => prepareExperiment(options({ starterCommit: 'short' }))).toThrow();
    const identical = options();
    expect(() => prepareExperiment({ ...identical, improvedHandoff: identical.baselineHandoff })).toThrow(/distinct/);
    const config = options();
    prepareExperiment(config);
    expect(() => prepareExperiment(config)).toThrow();
  });

  it('retains failed attempts and planned denominators while reporting separate matched dimensions', () => {
    const config = options();
    const manifest = prepareExperiment(config);
    const path = join(config.out, 'manifest.json');
    const baseline = result(manifest, 'baseline', 'fail');
    baseline.status = 'failed';
    baseline.failureReason = 'Required keyboard interaction failed during validation.';
    baseline.measurements.costUsd = null;
    baseline.measurements.inputTokens = null;
    recordResult(path, baseline);
    recordResult(path, result(manifest, 'improved', 'pass'));
    expect(() => recordResult(path, result(manifest, 'baseline', 'pass'))).toThrow(/cannot be replaced/);
    const report = reportExperiment(path);
    expect(report.status).toBe('partial');
    expect(report.baseline).toEqual({ planned: 18, succeeded: 0, failed: 1, notRun: 17 });
    expect(report.pairs).toEqual({ planned: 18, bothRecorded: 1, bothSucceeded: 0 });
    expect(report.fixtureOutcomes[0]).toMatchObject({ fixtureId: 'editorial-reading', plannedPairs: 3, baseline: { failed: 1, notRun: 2 } });
    expect(report.failures).toHaveLength(1);
    expect(report.dimensions.typography).toMatchObject({ plannedPairs: 18, comparablePairs: 1, improvedPassBaselineFail: 1, unassessedOrNotRun: 17 });
    expect(report.usage.runsMissingCost).toBe(1);
    expect(report.usage.runsMissingTokens).toBe(1);
    expect(report).not.toHaveProperty('score');
  });

  it('rejects changed input snapshots, missing planned outcomes, mismatched run settings, and incomplete evidence', () => {
    const config = options();
    const manifest = prepareExperiment(config);
    const path = join(config.out, 'manifest.json');
    const baseline = result(manifest, 'baseline', 'pass');
    expect(() => recordResult(path, { ...baseline, modelVersion: 'another-version' })).toThrow(/do not match/);
    expect(() => recordResult(path, { ...baseline, promptSha256: '0'.repeat(64) })).toThrow(/do not match/);
    expect(() => recordResult(path, { ...baseline, generationSettingsSha256: '0'.repeat(64) })).toThrow(/do not match/);
    expect(() => recordResult(path, { ...baseline, artifacts: [] })).toThrow(/artifacts/);
    expect(() => recordResult(path, { ...baseline, assessments: {} })).toThrow();
    const resultsPath = join(config.out, 'results.json');
    const resultsText = readFileSync(resultsPath, 'utf8');
    const results: { results: unknown[] } = JSON.parse(resultsText);
    results.results.pop();
    writeFileSync(resultsPath, JSON.stringify(results));
    expect(() => reportExperiment(path)).toThrow(/exactly one entry/);
    writeFileSync(resultsPath, resultsText);
    writeFileSync(join(config.out, 'improved-handoff.txt'), 'Changed after preparation');
    expect(() => reportExperiment(path)).toThrow(/snapshot changed/);
  });

  it('reports actual budget overages without discarding the attempt or claiming unknown usage is zero', () => {
    const config = options();
    const manifest = prepareExperiment(config);
    const path = join(config.out, 'manifest.json');
    const recorded = result(manifest, 'baseline', 'fail');
    recorded.measurements = { inputTokens: 9000, outputTokens: 2000, costUsd: 2, elapsedMs: 1000 };
    recordResult(path, recorded);
    const report = reportExperiment(path);
    expect(report.declaredBudgetExceeded).toBe(true);
    expect(report.usage.runsExceedingOutputCap).toEqual([recorded.runId]);
    expect(report.baseline.succeeded).toBe(1);
  });

  it('keeps not-applicable findings and applicability disagreements separate from missing assessments', () => {
    const config = options();
    const manifest = prepareExperiment(config);
    const path = join(config.out, 'manifest.json');
    const baseline = result(manifest, 'baseline', 'pass');
    const improved = result(manifest, 'improved', 'pass');
    baseline.assessments.preservationOfLockedScope = { outcome: 'not-applicable', evidence: 'Editorial fixture has no locked product UI.' };
    improved.assessments.preservationOfLockedScope = { outcome: 'not-applicable', evidence: 'Editorial fixture has no locked product UI.' };
    baseline.assessments.styleFidelity = { outcome: 'not-applicable', evidence: 'Reviewer applicability rationale to investigate.' };
    recordResult(path, baseline);
    recordResult(path, improved);
    const report = reportExperiment(path);
    expect(report.dimensions.preservationOfLockedScope).toMatchObject({ plannedPairs: 18, comparablePairs: 0, bothNotApplicable: 1, applicabilityDisagreement: 0, unassessedOrNotRun: 17 });
    expect(report.dimensions.styleFidelity).toMatchObject({ comparablePairs: 0, bothNotApplicable: 0, applicabilityDisagreement: 1, unassessedOrNotRun: 17 });
  });
});
