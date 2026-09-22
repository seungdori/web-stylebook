import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { cpus, platform, release } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';
import { performance } from 'node:perf_hooks';
import { createRequire } from 'node:module';
import ts from 'typescript';

export const QUALITY_STYLE_IDS = ['brutalist-grid', 'editorial-silence', 'runtime-signal', 'glass-orbit', 'cyberpunk-glitch', 'midnight-noir'];
export type MeasurementStatus = 'pass' | 'fail' | 'not-run' | 'not-applicable';
export interface SizeMeasurement { bytes: number; gzipBytes: number; sha256: string }
export interface ResourceBudget { metric: string; max: number; unit: 'bytes' | 'count'; reason: string; scope?: 'site' | 'mcp' }
export function measureBytes(value: string | Buffer): SizeMeasurement {
  const bytes = Buffer.isBuffer(value) ? value : Buffer.from(value);
  return { bytes: bytes.length, gzipBytes: gzipSync(bytes, { level: 9 }).length, sha256: createHash('sha256').update(bytes).digest('hex') };
}
export function checkBudgets(metrics: Record<string, number>, budgets: ResourceBudget[]) {
  return budgets.map((budget) => ({ ...budget, actual: metrics[budget.metric] ?? null, status: metrics[budget.metric] === undefined ? 'not-run' : metrics[budget.metric] <= budget.max ? 'pass' : 'fail' }));
}
export function selectedPayloadViolations(payload: unknown): string[] {
  const violations: string[] = [];
  function visit(value: unknown, path: string) {
    if (!value || typeof value !== 'object') return;
    if (Array.isArray(value)) { value.forEach((item, i) => visit(item, `${path}[${i}]`)); return; }
    const obj = value as Record<string, unknown>;
    for (const key of ['referenceLibrary', 'referenceCorpus', 'uxPrinciples', 'designPrinciples', 'ontologyEnums']) {
      if (key in obj) violations.push(`${path}.${key}: full-catalog domain included`);
    }
    if ('styles' in obj && Array.isArray(obj.styles) && obj.styles.length > 1) violations.push(`${path}.styles: multiple catalog styles included`);
    if (['en', 'ko', 'ja'].every((key) => key in obj)) violations.push(`${path}: all-locales payload included`);
    for (const [key, item] of Object.entries(obj)) visit(item, `${path}.${key}`);
  }
  visit(payload, '$');
  return violations;
}
function flag(args: string[], name: string, fallback?: string) {
  const index = args.indexOf(name);
  if (index < 0) return fallback;
  if (!args[index + 1] || args[index + 1].startsWith('--')) throw new Error(`${name} requires a value`);
  return args[index + 1];
}
function identity(root: string) {
  return { commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), dirty: Boolean(execFileSync('git', ['status', '--porcelain', '--untracked-files=normal'], { cwd: root, encoding: 'utf8' }).trim()) };
}
function filesUnder(root: string): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? filesUnder(join(root, entry.name)) : [join(root, entry.name)]);
}
export function staticModuleImports(source: string): string[] {
  const parsed = ts.createSourceFile('asset.js', source, ts.ScriptTarget.Latest, false, ts.ScriptKind.JS);
  return parsed.statements.flatMap((statement) => {
    if ((ts.isImportDeclaration(statement) || ts.isExportDeclaration(statement)) && statement.moduleSpecifier && ts.isStringLiteral(statement.moduleSpecifier)) return [statement.moduleSpecifier.text];
    return [];
  });
}
interface SelectedSample { id: string; size: SizeMeasurement; estimatedContextUnits: number; violations: string[] }
interface MeasuredOperation { condition: 'first-call-after-import' | 'warm-in-process'; samples: number; medianMs: number; p95Ms: number }
function timeOperation(operation: () => unknown): { first: MeasuredOperation; warm: MeasuredOperation } {
  const before = performance.now(); operation(); const firstMs = performance.now() - before;
  for (let i = 0; i < 20; i++) operation();
  const samples = Array.from({ length: 200 }, () => { const start = performance.now(); operation(); return performance.now() - start; }).sort((a, b) => a - b);
  return { first: { condition: 'first-call-after-import', samples: 1, medianMs: firstMs, p95Ms: firstMs }, warm: { condition: 'warm-in-process', samples: 200, medianMs: samples[100], p95Ms: samples[190] } };
}

export async function measureQuality(siteRoot: string, mcpRoot?: string) {
  const dist = join(siteRoot, 'dist');
  if (!existsSync(join(dist, 'index.html'))) throw new Error('Production dist is missing. Run npm run build first.');
  const metrics: Record<string, number> = {};
  const assetFiles = filesUnder(join(dist, 'assets'));
  const assets = assetFiles.filter((path) => /\.(css|js)$/.test(path)).map((path) => ({ path: path.slice(dist.length + 1), ...measureBytes(readFileSync(path)) }));
  for (const extension of ['js', 'css']) {
    metrics[`all${extension.toUpperCase()}GzipBytes`] = assets.filter((asset) => asset.path.endsWith(`.${extension}`)).reduce((sum, asset) => sum + asset.gzipBytes, 0);
  }
  const html = readFileSync(join(dist, 'index.html'), 'utf8');
  const entryPath = html.match(/<script[^>]+src="([^"]+)"/)?.[1];
  if (!entryPath) throw new Error('Production entry script is missing.');
  const entry = measureBytes(readFileSync(join(dist, entryPath.replace(/^\//, ''))));
  metrics.entryJsGzipBytes = entry.gzipBytes;
  const moduleSources = new Map(assetFiles.filter((path) => path.endsWith('.js')).map((path) => [resolve(path), readFileSync(path, 'utf8')]));
  const staticImports = new Map([...moduleSources].map(([path, source]) => [path, staticModuleImports(source).filter((specifier) => specifier.startsWith('.')).map((specifier) => resolve(dirname(path), specifier))]));
  const routeJsModuleClosures: Record<string, { files: string[]; gzipBytes: number }> = {};
  for (const name of ['Home', 'ColorSystem', 'Typography', 'Compare', 'PromptWorkflow']) {
    const route = assetFiles.find((path) => new RegExp(`/${name}-[^/]+\\.js$`).test(path));
    if (!route) continue;
    const pending = [resolve(dist, entryPath.replace(/^\//, '')), resolve(route)];
    const included = new Set<string>();
    while (pending.length) {
      const path = pending.pop()!;
      if (included.has(path)) continue;
      if (!moduleSources.has(path)) throw new Error(`Unresolved built JavaScript dependency: ${path}`);
      included.add(path);
      pending.push(...(staticImports.get(path) ?? []));
    }
    const gzipBytes = [...included].reduce((sum, path) => sum + measureBytes(moduleSources.get(path)!).gzipBytes, 0);
    routeJsModuleClosures[name] = { files: [...included].map((path) => path.slice(resolve(dist).length + 1)).sort(), gzipBytes };
    metrics[`${name[0].toLowerCase()}${name.slice(1)}JsClosureGzipBytes`] = gzipBytes;
  }
  const staticArtifacts: Record<string, SizeMeasurement> = {};
  for (const file of ['agent-handoff.json', 'agent-handoff.full.json', 'visual-contracts.json']) {
    if (existsSync(join(dist, file))) staticArtifacts[file] = measureBytes(readFileSync(join(dist, file)));
  }
  const selectedArtifacts = existsSync(join(dist, 'agent-handoff')) ? filesUnder(join(dist, 'agent-handoff')).filter((path) => path.endsWith('.json')).map((path) => ({ path: path.slice(dist.length + 1), ...measureBytes(readFileSync(path)), violations: selectedPayloadViolations(JSON.parse(readFileSync(path, 'utf8'))) })) : [];
  const selectedCoverage = { status: 'not-applicable' as MeasurementStatus, expected: 0, actual: selectedArtifacts.length, missing: [] as string[], unexpected: [] as string[] };
  if (selectedArtifacts.length) metrics.selectedStaticMaxBytes = Math.max(...selectedArtifacts.map((file) => file.bytes));
  const selectedPrompts: Array<{ path: string; bytes: number; estimatedContextUnits: number }> = [];
  if (selectedArtifacts.length) {
    const { styleCatalog } = await import(pathToFileURL(join(siteRoot, 'src/data/styles.ts')).href) as { styleCatalog: Array<{ id: string }> };
    const expectedPaths = new Set(styleCatalog.flatMap((style) => ['en', 'ko', 'ja'].map((locale) => `agent-handoff/${style.id}.${locale}.json`)));
    const actualPaths = new Set(selectedArtifacts.map((artifact) => artifact.path));
    selectedCoverage.expected = expectedPaths.size;
    selectedCoverage.missing = [...expectedPaths].filter((path) => !actualPaths.has(path));
    selectedCoverage.unexpected = [...actualPaths].filter((path) => !expectedPaths.has(path));
    selectedCoverage.status = selectedCoverage.missing.length || selectedCoverage.unexpected.length ? 'fail' : 'pass';
    const { selectedHandoffToPrompt } = await import(pathToFileURL(join(siteRoot, 'src/visual/handoff.ts')).href) as { selectedHandoffToPrompt: (handoff: unknown) => string };
    for (const artifact of selectedArtifacts) {
      const prompt = selectedHandoffToPrompt(JSON.parse(readFileSync(join(dist, artifact.path), 'utf8')));
      const bytes = Buffer.byteLength(prompt);
      selectedPrompts.push({ path: artifact.path, bytes, estimatedContextUnits: Math.ceil(bytes / 4) });
    }
    metrics.selectedPromptMaxBytes = Math.max(...selectedPrompts.map((sample) => sample.bytes));
  }
  if (staticArtifacts['agent-handoff.json']) metrics.legacySlimHandoffBytes = staticArtifacts['agent-handoff.json'].bytes;
  const styleSource = readFileSync(join(siteRoot, 'src/styles.css'), 'utf8');
  const globalFontImports = [...styleSource.matchAll(/@import\s+url\((['"])(.*?)\1\)\s*;/g)].map((match) => match[2]).filter((url) => url.includes('fonts.googleapis.com'));
  const globalRequestedFontFamilies = new Set(globalFontImports.flatMap((line) => [...line.matchAll(/family=([^:&]+)/g)].map((match) => decodeURIComponent(match[1]).replaceAll('+', ' '))));
  metrics.globalFontFamilyRequests = globalRequestedFontFamilies.size;
  let mcp: Record<string, unknown> = { status: 'not-run', reason: 'Pass --mcp-root to measure the companion package.' };
  if (mcpRoot) {
    const { CatalogRepository } = await import(pathToFileURL(join(mcpRoot, 'dist/catalog/repository.js')).href);
    const { composeDesignTokens } = await import(pathToFileURL(join(mcpRoot, 'dist/tokens/compile.js')).href);
    const repo = CatalogRepository.load();
    const canonicalAvailable = typeof repo.getVisualContract === 'function';
    const composeTiming = timeOperation(() => composeDesignTokens({ primaryStyleId: 'brutalist-grid', format: 'json', ...(canonicalAvailable ? { contract: { schema: 'webstylebook.visual.v1' } } : {}) }, repo));
    const selected: SelectedSample[] = QUALITY_STYLE_IDS.map((id) => {
      const output: unknown = composeDesignTokens({ primaryStyleId: id, format: 'json' }, repo);
      const size = measureBytes(JSON.stringify(output));
      return { id, size, estimatedContextUnits: Math.ceil(size.bytes / 4), violations: selectedPayloadViolations(output) };
    });
    const canonicalSelected: SelectedSample[] = canonicalAvailable ? repo.listStyles().flatMap((style: { id: string }) => ['en', 'ko', 'ja'].map((locale) => {
      const output: unknown = composeDesignTokens({ primaryStyleId: style.id, format: 'json', locale, contract: { schema: 'webstylebook.visual.v1' } }, repo);
      const size = measureBytes(JSON.stringify(output));
      return { id: `${style.id}.${locale}`, size, estimatedContextUnits: Math.ceil(size.bytes / 4), violations: selectedPayloadViolations(output) };
    })) : [];
    metrics.mcpSelectedMaxBytes = Math.max(...(canonicalSelected.length ? canonicalSelected : selected).map((item) => item.size.bytes));
    const catalog = measureBytes(readFileSync(join(mcpRoot, 'generated/catalog.v1.json')));
    metrics.mcpCatalogBytes = catalog.bytes;
    const requireMcp = createRequire(join(mcpRoot, 'package.json'));
    const { Client } = await import(pathToFileURL(requireMcp.resolve('@modelcontextprotocol/sdk/client/index.js')).href);
    const { InMemoryTransport } = await import(pathToFileURL(requireMcp.resolve('@modelcontextprotocol/sdk/inMemory.js')).href);
    const { createWebStylebookServer } = await import(pathToFileURL(join(mcpRoot, 'dist/server.js')).href);
    const server = createWebStylebookServer(repo);
    const client = new Client({ name: 'quality-measure', version: '1.0.0' });
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    await Promise.all([server.connect(serverTransport), client.connect(clientTransport)]);
    const wireSamples: Array<{ id: string; format: string; envelopeBytes: number; textBytes: number; resourceLinks: number }> = [];
    try {
      const wireCases = canonicalSelected.length ? canonicalSelected : selected;
      for (const sample of wireCases) {
        const [styleId, locale = 'en'] = sample.id.split('.');
        for (const format of ['json', 'css-variables', 'tailwind', 'typescript']) {
          const result = await client.callTool({ name: 'compose_design_tokens', arguments: { primaryStyleId: styleId, locale, format, ...(canonicalAvailable ? { contract: { schema: 'webstylebook.visual.v1' } } : {}) } }) as { isError?: boolean; content: Array<{ type: string; text?: string }> };
          if (result.isError) throw new Error(`MCP tool failed for ${sample.id}/${format}`);
          wireSamples.push({ id: sample.id, format, envelopeBytes: Buffer.byteLength(JSON.stringify(result)), textBytes: result.content.filter((block) => block.type === 'text').reduce((sum, block) => sum + Buffer.byteLength(block.text ?? ''), 0), resourceLinks: result.content.filter((block) => block.type === 'resource_link').length });
        }
      }
    } finally { await client.close(); await server.close(); }
    const wireByFormat = Object.fromEntries(['json', 'css-variables', 'tailwind', 'typescript'].map((format) => {
      const samples = wireSamples.filter((sample) => sample.format === format);
      return [format, { samples: samples.length, envelopeMaxBytes: Math.max(...samples.map((sample) => sample.envelopeBytes)), textMaxBytes: Math.max(...samples.map((sample) => sample.textBytes)) }];
    }));
    metrics.mcpWireMaxBytes = wireByFormat.json.envelopeMaxBytes;
    metrics.mcpTextMaxBytes = wireByFormat.json.textMaxBytes;
    metrics.mcpAllFormatsWireMaxBytes = Math.max(...wireSamples.map((sample) => sample.envelopeBytes));
    metrics.mcpAllFormatsTextMaxBytes = Math.max(...wireSamples.map((sample) => sample.textBytes));
    const pack = JSON.parse(execFileSync('npm', ['pack', '--dry-run', '--ignore-scripts', '--json'], { cwd: mcpRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }))[0] as { size: number; unpackedSize: number; entryCount: number };
    metrics.mcpPackageBytes = pack.size;
    metrics.mcpPackageUnpackedBytes = pack.unpackedSize;
    mcp = { status: [...selected, ...canonicalSelected].some((sample) => sample.violations.length) ? 'fail' : 'pass', source: identity(mcpRoot), selectedLegacy: selected, selectedCanonical: canonicalSelected, wireByFormat, wireSamples, wireMethod: 'In-memory MCP CallToolResult including text fallback and structuredContent, excluding the JSON-RPC transport wrapper. One tool call per style/locale/format sample; no linked resource is fetched. Selected/composed and mcpWireMaxBytes/mcpTextMaxBytes metrics use JSON; all-format maxima are separate. Client behavior determines which representation enters model context.', catalog, package: { compressedBytes: pack.size, unpackedBytes: pack.unpackedSize, entries: pack.entryCount }, composeTiming };
  }
  return {
    schema: 'webstylebook.quality-measurement.v1', capturedAt: new Date().toISOString(), source: identity(siteRoot),
    environment: { node: process.version, npm: execFileSync('npm', ['--version'], { encoding: 'utf8' }).trim(), packageLockSha256: measureBytes(readFileSync(join(siteRoot, 'package-lock.json'))).sha256, platform: platform(), osRelease: release(), architecture: process.arch, cpu: cpus()[0]?.model ?? 'unknown' },
    methodology: { assets: 'On-disk production assets, gzip level 9 per file. Entry script only excludes imported chunks; all-JS/CSS counts include lazy routes. Route JS closures parse static import/export declarations with the installed TypeScript compiler and include the entry plus selected route, excluding dynamic feature modules, CSS, fonts and media. These are not observed network transfer sizes.', timing: 'Node lab microbenchmark, first call after module import plus 200 warm calls after 20 warmup calls; no startup, browser or field performance claim.', context: 'utf8-bytes-div-4/v1 estimate only; actual model tokenizer/version measurement is not-run.', package: 'npm pack --dry-run --ignore-scripts --json; no package publication.' },
    metrics, site: { status: selectedCoverage.status === 'fail' || selectedArtifacts.some((sample) => sample.violations.length) ? 'fail' : 'pass', entry, assets, routeJsModuleClosures, staticArtifacts, selectedArtifacts, selectedCoverage, selectedPrompts, globalFontFamilyRequests: [...globalRequestedFontFamilies].sort() }, mcp,
    browserTransfer: { status: 'not-run', reason: 'Use the browser matrix with cold and warm network captures; static sizes do not substitute for it.' },
    browserInteraction: { status: 'not-run', reason: 'Measure editing/navigation/axis-switch and long tasks in a real browser.' },
    allocation: { status: 'not-run', reason: 'Heap deltas without controlled GC/allocation instrumentation are not reliable per-operation allocation measurements.' },
    liveModelComparison: { status: 'not-run', reason: 'Use the opt-in matched evaluation protocol; resource measurements do not prove model-output quality.' },
  };
}

async function main() {
  const args = process.argv.slice(2);
  const root = resolve(flag(args, '--site-root', join(dirname(fileURLToPath(import.meta.url)), '..'))!);
  const mcpRoot = flag(args, '--mcp-root');
  const report = await measureQuality(root, mcpRoot ? resolve(mcpRoot) : undefined);
  const budgetsPath = flag(args, '--budgets', join(dirname(fileURLToPath(import.meta.url)), '../docs/quality-budgets.json'))!;
  const scope = flag(args, '--scope', mcpRoot ? 'all' : 'site');
  if (!['site', 'mcp', 'all'].includes(scope!)) throw new Error('--scope must be site, mcp, or all');
  const budgets = args.includes('--check') ? checkBudgets(report.metrics, (JSON.parse(readFileSync(budgetsPath, 'utf8')) as { budgets: ResourceBudget[] }).budgets.filter((budget) => scope === 'all' || (budget.scope ?? 'site') === scope)) : [];
  const result = { ...report, budgets };
  const output = flag(args, '--output');
  if (output) { mkdirSync(dirname(resolve(output)), { recursive: true }); writeFileSync(resolve(output), JSON.stringify(result, null, 2) + '\n'); }
  console.log(JSON.stringify({ source: report.source, metrics: report.metrics, checks: { passed: budgets.filter((budget) => budget.status === 'pass').length, failed: budgets.filter((budget) => budget.status === 'fail').length, notRun: budgets.filter((budget) => budget.status === 'not-run').length }, failures: budgets.filter((budget) => budget.status !== 'pass'), output: output ?? null }, null, 2));
  if (budgets.some((budget) => budget.status !== 'pass') || report.mcp.status === 'fail' || report.site.status === 'fail') process.exitCode = 1;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
