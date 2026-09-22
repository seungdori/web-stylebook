// Offline experiment bookkeeping only. This module never invokes a model or network.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { z } from 'zod';

export const DIMENSIONS = [
  'briefFidelity', 'colorRoles', 'typography', 'layoutHierarchy',
  'interactionStates', 'accessibility', 'responsiveBehavior', 'styleFidelity',
  'preservationOfLockedScope',
] as const;
const nonempty = z.string().trim().min(1);
const sha = z.string().regex(/^[a-f0-9]{64}$/);
const commit = z.string().regex(/^[a-f0-9]{40}$/);
const armSchema = z.enum(['baseline', 'improved']);
const assetSchema = z.strictObject({ path: nonempty, sha256: sha });
const fixturesSchema = z.strictObject({
  version: z.literal(1),
  starterRequirements: z.array(nonempty).min(1),
  fixtures: z.array(z.strictObject({
    id: z.string().regex(/^[a-z][a-z0-9-]+$/), productType: nonempty,
    starterState: nonempty, allowedChanges: z.array(nonempty).min(1), lockedScope: z.array(nonempty),
    brief: nonempty, acceptance: z.array(nonempty).min(1),
  })).length(6),
});
const runSchema = z.strictObject({
  id: nonempty, pairId: nonempty, fixtureId: nonempty,
  repetition: z.number().int().min(1), arm: armSchema, prompt: assetSchema,
});
const manifestSchema = z.strictObject({
  version: z.literal(1), protocol: z.literal('offline-matched-handoff-v1'),
  model: nonempty, modelVersion: nonempty, starterCommit: commit,
  generationSettings: z.record(z.string(), z.unknown()),
  generationSettingsSha256: sha,
  repetitions: z.number().int().min(3).max(20),
  budget: z.strictObject({
    maxCostUsd: z.number().positive(), maxTotalTokens: z.number().int().positive(),
    maxOutputTokensPerRun: z.number().int().positive(),
  }),
  fixtures: assetSchema,
  handoffs: z.strictObject({ baseline: assetSchema, improved: assetSchema }),
  runs: z.array(runSchema).min(36),
});
const assessmentSchema = z.strictObject({
  outcome: z.enum(['pass', 'fail', 'not-assessed', 'not-applicable']),
  evidence: nonempty,
});
const assessmentsSchema = z.record(z.enum(DIMENSIONS), assessmentSchema);
const measurementSchema = z.strictObject({
  inputTokens: z.number().int().nonnegative().nullable(),
  outputTokens: z.number().int().nonnegative().nullable(),
  costUsd: z.number().nonnegative().nullable(),
  elapsedMs: z.number().int().nonnegative(),
});
const terminalResultSchema = z.strictObject({
  runId: nonempty, status: z.enum(['succeeded', 'failed']),
  model: nonempty, modelVersion: nonempty, starterCommit: commit,
  promptSha256: sha, generationSettingsSha256: sha,
  measurements: measurementSchema,
  // Paths or review notes point to externally produced evidence; the harness does not execute it.
  artifacts: z.array(nonempty), failureReason: z.string(),
  assessments: assessmentsSchema,
}).superRefine((result, context) => {
  if (result.status === 'failed' && !result.failureReason.trim()) {
    context.addIssue({ code: 'custom', message: 'Failed runs need a failureReason.' });
  }
  if (result.status === 'succeeded' && (result.artifacts.length === 0 || result.failureReason.trim())) {
    context.addIssue({ code: 'custom', message: 'Succeeded runs need artifacts and an empty failureReason.' });
  }
});
const resultSchema = z.union([
  z.strictObject({ runId: nonempty, status: z.literal('not-run') }), terminalResultSchema,
]);
const resultsSchema = z.strictObject({
  version: z.literal(1), manifestSha256: sha, results: z.array(resultSchema),
});
export type Manifest = z.infer<typeof manifestSchema>;
export type RecordedResult = z.infer<typeof terminalResultSchema>;
type Results = z.infer<typeof resultsSchema>;
type Arm = z.infer<typeof armSchema>;

export function hash(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}
function json(value: unknown): string { return `${JSON.stringify(value, null, 2)}\n`; }
function readJson(path: string): unknown { return JSON.parse(readFileSync(path, 'utf8')); }
function snapshot(directory: string, path: string, content: string) {
  writeFileSync(join(directory, path), content, { flag: 'wx' });
  return { path, sha256: hash(content) };
}

export type PrepareOptions = {
  out: string; model: string; modelVersion: string; starterCommit: string;
  baselineHandoff: string; improvedHandoff: string; settings: string;
  maxCostUsd: number; maxTotalTokens: number; maxOutputTokensPerRun: number;
  repetitions?: number; fixturesPath?: string;
};

export function prepareExperiment(options: PrepareOptions): Manifest {
  const fixturesText = readFileSync(options.fixturesPath ?? fileURLToPath(new URL('./quality-fixtures.json', import.meta.url)), 'utf8');
  const fixtures = fixturesSchema.parse(JSON.parse(fixturesText));
  if (new Set(fixtures.fixtures.map(({ id }) => id)).size !== 6) throw new Error('Fixture IDs must be unique.');
  const baseline = readFileSync(options.baselineHandoff, 'utf8');
  const improved = readFileSync(options.improvedHandoff, 'utf8');
  if (!baseline.trim() || !improved.trim() || hash(baseline) === hash(improved)) {
    throw new Error('Provide distinct, nonempty baseline and improved handoff files.');
  }
  if (/^(latest|default|auto)$/i.test(options.modelVersion.trim())) throw new Error('Declare a pinned model version.');
  const settings = z.record(z.string(), z.unknown()).parse(readJson(options.settings));
  if (Object.keys(settings).length === 0) throw new Error('Declare generation settings, including unsupported controls.');
  const directory = resolve(options.out);
  const repetitions = options.repetitions ?? 3;
  // Validate before creating any files. Prompt paths and hashes are completed below.
  const placeholder = { path: 'pending', sha256: hash('pending') };
  manifestSchema.omit({ runs: true }).parse({
    version: 1, protocol: 'offline-matched-handoff-v1', model: options.model,
    modelVersion: options.modelVersion, starterCommit: options.starterCommit,
    generationSettings: settings, generationSettingsSha256: hash(json(settings)), repetitions,
    budget: { maxCostUsd: options.maxCostUsd, maxTotalTokens: options.maxTotalTokens, maxOutputTokensPerRun: options.maxOutputTokensPerRun },
    fixtures: placeholder, handoffs: { baseline: placeholder, improved: placeholder },
  });
  if (options.maxOutputTokensPerRun > options.maxTotalTokens) throw new Error('Per-run output cap exceeds total token budget.');
  mkdirSync(directory); // Refuse to replace a prior experiment, including its failures.
  mkdirSync(join(directory, 'prompts'));
  const inputs = {
    fixtures: snapshot(directory, 'fixtures.json', fixturesText),
    handoffs: {
      baseline: snapshot(directory, 'baseline-handoff.txt', baseline),
      improved: snapshot(directory, 'improved-handoff.txt', improved),
    },
  };
  const runs: Manifest['runs'] = [];
  for (const [fixtureIndex, fixture] of fixtures.fixtures.entries()) {
    for (let repetition = 1; repetition <= repetitions; repetition += 1) {
      const pairId = `${fixture.id}--r${repetition}`;
      // Alternate arm order to avoid always running one condition first.
      const arms: Arm[] = (fixtureIndex + repetition) % 2 ? ['baseline', 'improved'] : ['improved', 'baseline'];
      for (const arm of arms) {
        const id = `${pairId}--${arm}`;
        const prompt = [
          `Implement the following product brief from clean starter commit ${options.starterCommit}.`,
          'Keep the fixed starter, brief, generation settings, and output budget unchanged. Use no prior conversation or generated result. Do not request extra dependencies or assets.',
          '\nFixed starter requirements:', ...fixtures.starterRequirements.map((item) => `- ${item}`),
          '\nFixture starter state:', fixture.starterState,
          '\nAllowed changes:', ...fixture.allowedChanges.map((item) => `- ${item}`),
          '\nLocked scope (takes precedence over the design handoff):',
          ...(fixture.lockedScope.length ? fixture.lockedScope.map((item) => `- ${item}`) : ['No existing product UI is locked for this fixture; the shared starter and brief requirements still apply.']),
          '\nProduct brief:', fixture.brief, '\nRequired behavior:', ...fixture.acceptance.map((item) => `- ${item}`),
          '\nDesign handoff (apply this to the brief; preserve the required content and behavior):',
          arm === 'baseline' ? baseline : improved,
        ].join('\n');
        runs.push({ id, pairId, fixtureId: fixture.id, repetition, arm, prompt: snapshot(directory, `prompts/${id}.txt`, prompt) });
      }
    }
  }
  const manifest = manifestSchema.parse({
    version: 1, protocol: 'offline-matched-handoff-v1', model: options.model,
    modelVersion: options.modelVersion, starterCommit: options.starterCommit,
    generationSettings: settings, generationSettingsSha256: hash(json(settings)), repetitions,
    budget: { maxCostUsd: options.maxCostUsd, maxTotalTokens: options.maxTotalTokens, maxOutputTokensPerRun: options.maxOutputTokensPerRun },
    ...inputs, runs,
  });
  const manifestText = json(manifest);
  writeFileSync(join(directory, 'manifest.json'), manifestText, { flag: 'wx' });
  writeFileSync(join(directory, 'results.json'), json({ version: 1, manifestSha256: hash(manifestText), results: runs.map(({ id }) => ({ runId: id, status: 'not-run' })) }), { flag: 'wx' });
  return manifest;
}

function loadExperiment(manifestPath: string): { manifest: Manifest; results: Results; resultsPath: string } {
  const manifestText = readFileSync(manifestPath, 'utf8');
  const manifest = manifestSchema.parse(JSON.parse(manifestText));
  const directory = dirname(resolve(manifestPath));
  const resultsPath = join(directory, 'results.json');
  const results = resultsSchema.parse(readJson(resultsPath));
  if (results.manifestSha256 !== hash(manifestText)) throw new Error('Manifest changed since preparation.');
  for (const asset of [manifest.fixtures, ...Object.values(manifest.handoffs), ...manifest.runs.map(({ prompt }) => prompt)]) {
    const path = resolve(directory, asset.path);
    if (!path.startsWith(`${directory}/`) || hash(readFileSync(path, 'utf8')) !== asset.sha256) {
      throw new Error(`Input snapshot changed: ${asset.path}`);
    }
  }
  validateResults(manifest, results.results);
  return { manifest, results, resultsPath };
}

function validateResults(manifest: Manifest, results: Results['results']): void {
  if (results.length !== manifest.runs.length || new Set(results.map(({ runId }) => runId)).size !== results.length) {
    throw new Error('Results must retain exactly one entry per planned run, including failures and not-run entries.');
  }
  const runs = new Map(manifest.runs.map((run) => [run.id, run]));
  for (const result of results) {
    const run = runs.get(result.runId);
    if (!run) throw new Error(`Unknown run: ${result.runId}`);
    if (result.status === 'not-run') continue;
    if (result.model !== manifest.model || result.modelVersion !== manifest.modelVersion || result.starterCommit !== manifest.starterCommit || result.promptSha256 !== run.prompt.sha256 || result.generationSettingsSha256 !== manifest.generationSettingsSha256) {
      throw new Error(`Run settings or prompt do not match the experiment: ${result.runId}`);
    }
  }
}

export function recordResult(manifestPath: string, input: unknown): void {
  const experiment = loadExperiment(manifestPath);
  const result = terminalResultSchema.parse(input);
  const existing = experiment.results.results.find((entry) => entry.runId === result.runId);
  if (!existing) throw new Error(`Unknown run: ${result.runId}`);
  if (existing.status !== 'not-run') throw new Error('Recorded attempts cannot be replaced. Keep failures; prepare another experiment for reruns.');
  const updated = experiment.results.results.map((entry) => entry.runId === result.runId ? result : entry);
  validateResults(experiment.manifest, updated);
  const temporaryPath = `${experiment.resultsPath}.${process.pid}.tmp`;
  writeFileSync(temporaryPath, json({ ...experiment.results, results: updated }), { flag: 'wx' });
  renameSync(temporaryPath, experiment.resultsPath);
}

export function reportExperiment(manifestPath: string) {
  const { manifest, results } = loadExperiment(manifestPath);
  const byId = new Map(results.results.map((entry) => [entry.runId, entry]));
  const counts = (arm: Arm) => {
    const entries = manifest.runs.filter((run) => run.arm === arm).map((run) => byId.get(run.id)!);
    return { planned: entries.length, succeeded: entries.filter((r) => r.status === 'succeeded').length, failed: entries.filter((r) => r.status === 'failed').length, notRun: entries.filter((r) => r.status === 'not-run').length };
  };
  const pairs = [...new Set(manifest.runs.map(({ pairId }) => pairId))].map((pairId) => {
    const runs = manifest.runs.filter((run) => run.pairId === pairId);
    const baseline = byId.get(runs.find(({ arm }) => arm === 'baseline')!.id)!;
    const improved = byId.get(runs.find(({ arm }) => arm === 'improved')!.id)!;
    return { fixtureId: runs[0]!.fixtureId, baseline, improved };
  });
  const recorded = results.results.filter((r): r is RecordedResult => r.status !== 'not-run');
  const dimensions = Object.fromEntries(DIMENSIONS.map((dimension) => {
    const tally = { plannedPairs: pairs.length, comparablePairs: 0, improvedPassBaselineFail: 0, baselinePassImprovedFail: 0, bothPass: 0, bothFail: 0, bothNotApplicable: 0, applicabilityDisagreement: 0, unassessedOrNotRun: 0 };
    for (const { baseline, improved } of pairs) {
      const b = baseline.status === 'not-run' ? 'not-assessed' : baseline.assessments[dimension].outcome;
      const i = improved.status === 'not-run' ? 'not-assessed' : improved.assessments[dimension].outcome;
      if (b === 'not-assessed' || i === 'not-assessed') { tally.unassessedOrNotRun += 1; continue; }
      if (b === 'not-applicable' && i === 'not-applicable') { tally.bothNotApplicable += 1; continue; }
      if (b === 'not-applicable' || i === 'not-applicable') { tally.applicabilityDisagreement += 1; continue; }
      tally.comparablePairs += 1;
      if (b === 'pass' && i === 'pass') tally.bothPass += 1;
      else if (b === 'fail' && i === 'fail') tally.bothFail += 1;
      else if (i === 'pass') tally.improvedPassBaselineFail += 1;
      else tally.baselinePassImprovedFail += 1;
    }
    return [dimension, tally];
  }));
  const usage = {
    knownCostUsd: recorded.reduce((sum, r) => sum + (r.measurements.costUsd ?? 0), 0),
    knownTokens: recorded.reduce((sum, r) => sum + (r.measurements.inputTokens ?? 0) + (r.measurements.outputTokens ?? 0), 0),
    runsMissingCost: recorded.filter((r) => r.measurements.costUsd === null).length,
    runsMissingTokens: recorded.filter((r) => r.measurements.inputTokens === null || r.measurements.outputTokens === null).length,
    runsExceedingOutputCap: recorded.filter((r) => (r.measurements.outputTokens ?? 0) > manifest.budget.maxOutputTokensPerRun).map((r) => r.runId),
  };
  return {
    status: recorded.length === 0 ? 'not-run' : recorded.length === manifest.runs.length ? 'complete' : 'partial',
    model: manifest.model, modelVersion: manifest.modelVersion, starterCommit: manifest.starterCommit,
    baseline: counts('baseline'), improved: counts('improved'),
    pairs: { planned: pairs.length, bothRecorded: pairs.filter((p) => p.baseline.status !== 'not-run' && p.improved.status !== 'not-run').length, bothSucceeded: pairs.filter((p) => p.baseline.status === 'succeeded' && p.improved.status === 'succeeded').length },
    fixtureOutcomes: [...new Set(pairs.map(({ fixtureId }) => fixtureId))].map((fixtureId) => {
      const subset = pairs.filter((pair) => pair.fixtureId === fixtureId);
      const outcomeCounts = (arm: Arm) => ({
        succeeded: subset.filter((pair) => pair[arm].status === 'succeeded').length,
        failed: subset.filter((pair) => pair[arm].status === 'failed').length,
        notRun: subset.filter((pair) => pair[arm].status === 'not-run').length,
      });
      return { fixtureId, plannedPairs: subset.length, baseline: outcomeCounts('baseline'), improved: outcomeCounts('improved') };
    }),
    failures: recorded.filter((r) => r.status === 'failed').map((r) => ({ runId: r.runId, reason: r.failureReason })),
    dimensions, budget: manifest.budget, usage,
    declaredBudgetExceeded: usage.knownCostUsd > manifest.budget.maxCostUsd || usage.knownTokens > manifest.budget.maxTotalTokens || usage.runsExceedingOutputCap.length > 0,
    interpretation: 'Separate dimension counts only. Not-run, unassessed, not-applicable, and applicability disagreements remain distinct and retained in planned denominators. Completion is bookkeeping, not proof of quality improvement. Known usage is a lower bound when measurements are missing.',
  };
}

function cli() {
  const [command, ...args] = process.argv.slice(2);
  const flags = new Map<string, string>();
  for (let index = 0; index < args.length; index += 2) {
    if (!args[index]?.startsWith('--') || !args[index + 1] || args[index + 1]!.startsWith('--') || flags.has(args[index]!)) throw new Error('Expected unique --flag value pairs.');
    flags.set(args[index]!, args[index + 1]!);
  }
  const accepted = command === 'prepare'
    ? ['out', 'model', 'model-version', 'starter-commit', 'baseline-handoff', 'improved-handoff', 'settings', 'budget-usd', 'budget-tokens', 'max-output-tokens', 'runs']
    : command === 'record' ? ['manifest', 'result'] : ['manifest'];
  for (const key of flags.keys()) if (!accepted.includes(key.slice(2))) throw new Error(`Unknown option: ${key}`);
  const required = (key: string) => { const value = flags.get(`--${key}`); if (!value) throw new Error(`Missing --${key}.`); return value; };
  if (command === 'prepare') {
    const manifest = prepareExperiment({
      out: required('out'), model: required('model'), modelVersion: required('model-version'), starterCommit: required('starter-commit'),
      baselineHandoff: required('baseline-handoff'), improvedHandoff: required('improved-handoff'), settings: required('settings'),
      maxCostUsd: Number(required('budget-usd')), maxTotalTokens: Number(required('budget-tokens')), maxOutputTokensPerRun: Number(required('max-output-tokens')),
      repetitions: flags.has('--runs') ? Number(required('runs')) : 3,
    });
    process.stdout.write(`Prepared ${manifest.runs.length} runs. All remain not-run. No model or network calls were made.\n`);
  } else if (command === 'record') {
    recordResult(required('manifest'), readJson(required('result')));
    process.stdout.write('Recorded one existing result.\n');
  } else if (command === 'report') {
    process.stdout.write(json(reportExperiment(required('manifest'))));
  } else {
    throw new Error('Use prepare, record, or report. See docs/quality-ai-evaluation.md.');
  }
}

if (process.argv[1] && existsSync(process.argv[1]) && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { cli(); } catch (error) { process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`); process.exitCode = 1; }
}
