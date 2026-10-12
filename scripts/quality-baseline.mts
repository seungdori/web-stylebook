import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { cpus, platform, release } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';
import { styleCatalog } from '../src/data/styles';
import { findRoute } from '../src/data/routes';
import { originalStyleFonts } from '../src/data/routeFontManifest';
import { getRouteFontFamilies, getRouteFontStylesheet } from '../src/utils/routeFonts';
import {
  assessContrast,
  exportVisualContract,
  getVisualContract,
  resolveVisualContract,
  visualContractToCss,
} from '../src/visual';
import { serializeVisualJson } from '../src/visual/export';
import { buildSelectedHandoff, selectedHandoffToPrompt } from '../src/visual/handoff';
import { createInitialDraft, parseDesignDraft } from '../src/visual/workspace';
import { checkBudgets, measureBytes, measureQuality, selectedPayloadViolations, type ResourceBudget } from './quality-measure.mts';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fixtureDir = join(rootDir, 'scripts/fixtures/quality-baseline');
export const BASELINE_PATH = join(rootDir, 'docs/quality-baseline-2026-10-12.json');
export const TOKENIZER = { name: 'utf8-bytes-div-4', version: 'v1' } as const;

interface MeasurementConfig {
  schema: string;
  phase: number;
  issue: number;
  tokenizer: { name: string; version: string; definition: string };
  smokeStyleIds: string[];
  contentLocales: Array<'en' | 'ko' | 'ja'>;
  routes: Array<{ id: string; path: string; chunk: string }>;
  timing: { warmup: number; samples: number };
  duplicateStringMinChars: number;
  allowedHandoffUrlHosts: string[];
  forbiddenRuntimeMarkers: string[];
  brutalistExportMustContain: string[];
  compactDensity: { density: 'compact'; row: number; gutter: number; stack: number };
  comfortableDensity: { density: 'comfortable'; row: number; gutter: number; stack: number };
}

interface FieldExpectation {
  styleId: string;
  contentLocale: 'en' | 'ko' | 'ja';
  mode: 'light' | 'dark';
  canvas: string;
  surface: string;
  text: string;
  accent: string;
  actionPrimary: string;
  displayLineHeight: number;
  displayLetterSpacingEm: number;
  displayTextTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  displayFontFamily: string;
  bodyLineHeight: number;
  bodyLetterSpacingEm: number;
  bodyTextTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  bodyWordBreak: 'normal' | 'keep-all';
  bodyFontFamily: string;
  density: 'comfortable' | 'compact';
  row: number;
  gutter: number;
  stack: number;
}

interface DensitySpacing {
  density: string;
  row: number;
  gutter: number;
  stack: number;
}

interface RecipeRecord {
  id: string;
  canvas: string;
  shadow: string | null;
  shadowNormalizedFromInvalidAuthoredSyntax?: boolean;
  alternativeModes?: Record<string, unknown>;
}

export function loadMeasurementConfig(): MeasurementConfig {
  return JSON.parse(readFileSync(join(fixtureDir, 'measurement.json'), 'utf8')) as MeasurementConfig;
}

export function loadFieldExpectations(): FieldExpectation[] {
  const parsed = JSON.parse(readFileSync(join(fixtureDir, 'field-expectations.json'), 'utf8')) as { expectations: FieldExpectation[] };
  return parsed.expectations;
}

export function estimateTokens(value: string): number {
  return Math.ceil(Buffer.byteLength(value, 'utf8') / 4);
}

export function semanticRoleViolations(sample: { text: string; accent: string }, expected: { text: string; accent: string }): string[] {
  const violations: string[] = [];
  if (sample.text.toLowerCase() === sample.accent.toLowerCase()) violations.push('text and accent are the same color');
  if (sample.text.toLowerCase() !== expected.text.toLowerCase()) violations.push(`text is ${sample.text}, expected ${expected.text}`);
  if (sample.accent.toLowerCase() !== expected.accent.toLowerCase()) violations.push(`accent is ${sample.accent}, expected ${expected.accent}`);
  return violations;
}

export function missingExportDeclarations(css: string, required: readonly string[]): string[] {
  return required.filter((declaration) => !css.includes(declaration)).map((declaration) => `missing export declaration ${declaration}`);
}

export function densityOverrideViolations(spacing: DensitySpacing, requested: 'compact' | 'comfortable'): string[] {
  const config = loadMeasurementConfig();
  const expected = requested === 'compact' ? config.compactDensity : config.comfortableDensity;
  return (Object.keys(expected) as Array<keyof typeof expected>)
    .filter((key) => spacing[key] !== expected[key])
    .map((key) => `spacing.${key} is ${String(spacing[key])}, expected ${String(expected[key])} after ${requested} override`);
}

export function staleDraftExportViolations(decision: { revisionMatches: boolean; exported: boolean }): string[] {
  return !decision.revisionMatches && decision.exported ? ['stale draft revision was exported'] : [];
}

export function fieldExpectationViolations(expected: FieldExpectation): string[] {
  const resolved = resolveVisualContract(expected.styleId, { contentLocale: expected.contentLocale });
  const display = resolved.typography.roles.display;
  const body = resolved.typography.roles.body;
  const pairs: Array<[string, unknown, unknown]> = [
    ['mode', resolved.mode, expected.mode],
    ['colors.canvas', resolved.colors.canvas, expected.canvas],
    ['colors.surface', resolved.colors.surface, expected.surface],
    ['colors.text', resolved.colors.text, expected.text],
    ['colors.accent', resolved.colors.accent, expected.accent],
    ['colors.actionPrimary', resolved.colors.actionPrimary, expected.actionPrimary],
    ['typography.roles.display.lineHeight', display.lineHeight, expected.displayLineHeight],
    ['typography.roles.display.letterSpacingEm', display.letterSpacingEm, expected.displayLetterSpacingEm],
    ['typography.roles.display.textTransform', display.textTransform, expected.displayTextTransform],
    ['typography.roles.display.fontFamily', display.fontFamily, expected.displayFontFamily],
    ['typography.roles.body.lineHeight', body.lineHeight, expected.bodyLineHeight],
    ['typography.roles.body.letterSpacingEm', body.letterSpacingEm, expected.bodyLetterSpacingEm],
    ['typography.roles.body.textTransform', body.textTransform, expected.bodyTextTransform],
    ['typography.roles.body.wordBreak', body.wordBreak, expected.bodyWordBreak],
    ['typography.roles.body.fontFamily', body.fontFamily, expected.bodyFontFamily],
    ['spacing.density', resolved.spacing.density, expected.density],
    ['spacing.row', resolved.spacing.row, expected.row],
    ['spacing.gutter', resolved.spacing.gutter, expected.gutter],
    ['spacing.stack', resolved.spacing.stack, expected.stack],
  ];
  return pairs
    .filter(([, actual, wanted]) => actual !== wanted)
    .map(([path, actual, wanted]) => `${expected.styleId}/${expected.contentLocale} ${path} is ${JSON.stringify(actual)}, expected ${JSON.stringify(wanted)}`);
}

function filesUnder(dir: string, pattern: RegExp): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return filesUnder(path, pattern);
    return pattern.test(entry.name) ? [path] : [];
  });
}

function sha256(value: string | Buffer): string {
  return createHash('sha256').update(value).digest('hex');
}

function readRecipes(): RecipeRecord[] {
  return JSON.parse(readFileSync(join(rootDir, 'src/visual/recipes.json'), 'utf8')) as RecipeRecord[];
}

export function collectKnownDefects() {
  const recipes = readRecipes();
  const recipeById = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  const paletteDisagreements = styleCatalog.map((style) => {
    const resolved = resolveVisualContract(style.id);
    const paletteText = style.palette[style.palette.length - 1] ?? '';
    const paletteCanvas = style.palette[0] ?? '';
    const differs = paletteText.toLowerCase() !== resolved.colors.text.toLowerCase()
      || paletteCanvas.toLowerCase() !== resolved.colors.canvas.toLowerCase()
      || style.accent.toLowerCase() !== resolved.colors.accent.toLowerCase();
    return differs ? {
      styleId: style.id,
      paletteCanvas,
      resolvedCanvas: resolved.colors.canvas,
      paletteText,
      resolvedText: resolved.colors.text,
      catalogAccent: style.accent,
      resolvedAccent: resolved.colors.accent,
    } : null;
  }).filter((entry) => entry !== null);
  const brutalist = styleCatalog.find((style) => style.id === 'brutalist-grid');
  const brutalistResolved = resolveVisualContract('brutalist-grid');
  const terminal = getVisualContract('fusion-editorial-terminal');
  const terminalRecipe = recipeById.get('fusion-editorial-terminal');
  const glassRecipe = recipeById.get('glass-orbit');
  const glass = resolveVisualContract('glass-orbit');
  const softRecipe = recipeById.get('fusion-soft-inflate');
  const soft = resolveVisualContract('fusion-soft-inflate');
  const cyberEn = resolveVisualContract('cyberpunk-glitch', { contentLocale: 'en' });
  const cyberKo = resolveVisualContract('cyberpunk-glitch', { contentLocale: 'ko' });
  const home = findRoute('/');
  const defects = [
    {
      id: 'brutalist-grid-positional-color',
      status: 'recorded' as const,
      resolverStatus: brutalistResolved.colors.text.toLowerCase() === '#d72600' ? 'fail' as const : 'pass' as const,
      palette: brutalist?.palette ?? [],
      catalogAccent: brutalist?.accent ?? '',
      positionalText: brutalist?.palette[brutalist.palette.length - 1] ?? '',
      resolvedText: brutalistResolved.colors.text,
      resolvedAccent: brutalistResolved.colors.accent,
      note: 'Catalog palette order still places the red accent last, and a six-digit #111111 swatch is not the resolved #111 text. Preview, CSS export, and selected handoff use the semantic roles. A consumer that maps palette[length-1] to text recreates issue #4.',
    },
    {
      id: 'palette-order-disagreements',
      status: 'recorded' as const,
      count: paletteDisagreements.length,
      styles: paletteDisagreements,
      note: 'These are differences between the display palette and the resolved semantic roles. They are not a claim that every difference is a rendering bug.',
    },
    {
      id: 'fusion-editorial-terminal-light-mode-withheld',
      status: 'recorded' as const,
      recipeDeclaresLight: Boolean(terminalRecipe?.alternativeModes?.light),
      resolvedModes: Object.keys(terminal.modes).sort(),
      note: 'The recipe names a light alternate that is still visually dark. The contract builder does not advertise that mode.',
    },
    {
      id: 'fusion-soft-inflate-shadow-normalized',
      status: 'recorded' as const,
      authoredFlag: Boolean(softRecipe?.shadowNormalizedFromInvalidAuthoredSyntax),
      resolvedShadows: soft.shadows,
      note: 'Invalid authored shadow syntax is exported as none rather than a generic soft shadow or a claimed computed shadow.',
    },
    {
      id: 'glass-orbit-gradient-canvas-flattened',
      status: 'recorded' as const,
      authoredCanvas: glassRecipe?.canvas ?? '',
      resolvedCanvas: glass.colors.canvas,
      note: 'The authored canvas gradient is not a role color. The contract uses an explicit flat fallback. Backdrop contrast stays needs-rendered-review.',
    },
    {
      id: 'ui-language-ja-shell-fonts-match-en',
      status: 'recorded' as const,
      en: getRouteFontFamilies(home, 'en'),
      ja: getRouteFontFamilies(home, 'ja'),
      ko: getRouteFontFamilies(home, 'ko'),
      note: 'UI language ja does not add a Japanese shell font. Content-locale resolution can still insert Noto Sans JP into a font stack. Those are different mechanisms; this capture did not observe a browser font download.',
    },
    {
      id: 'cyberpunk-glitch-locale-body-line-height-floor',
      status: 'recorded' as const,
      enBodyLineHeight: cyberEn.typography.roles.body.lineHeight,
      koBodyLineHeight: cyberKo.typography.roles.body.lineHeight,
      note: 'Authored body line-height is null. Korean resolution raises the recipe value to the 1.65 locale floor. The field expectations pin the resulting numbers.',
    },
  ];
  return defects;
}

export function buildFidelityBaseline() {
  const config = loadMeasurementConfig();
  const expectations = loadFieldExpectations();
  const fieldViolations = expectations.flatMap((expected) => fieldExpectationViolations(expected));
  const exportCss = visualContractToCss(resolveVisualContract('brutalist-grid'));
  const exportMissing = missingExportDeclarations(exportCss, config.brutalistExportMustContain);
  const zeroToken = resolveVisualContract('brutalist-grid', { overrides: { typography: { body: { letterSpacingEm: 0, paragraphSpacingEm: 0 } } } });
  const zeroCss = visualContractToCss(zeroToken);
  const zeroMissing = missingExportDeclarations(zeroCss, ['--type-body-letter-spacing: 0em;', '--type-body-margin-block-end: 0em;', '--type-body-text-transform: none;']);
  const densityViolations = styleCatalog.flatMap((style) => (['compact', 'comfortable'] as const).flatMap((density) => (
    densityOverrideViolations(resolveVisualContract(style.id, { overrides: { density } }).spacing, density).map((violation) => `${style.id} ${violation}`)
  )));
  const paletteViolations: string[] = [];
  for (const style of styleCatalog) {
    const original = [...style.palette];
    const before = JSON.stringify(resolveVisualContract(style.id).colors);
    style.palette.reverse();
    try {
      if (JSON.stringify(resolveVisualContract(style.id).colors) !== before) paletteViolations.push(style.id);
    } finally {
      style.palette.splice(0, style.palette.length, ...original);
    }
  }
  const staleDraft = JSON.stringify({ ...createInitialDraft('brutalist-grid'), contractRevision: 'fnv1a:0000000000000000' });
  const staleParsed = parseDesignDraft(staleDraft);
  const staleRejected = !staleParsed.ok && staleParsed.reason === 'stale-contract';
  const fingerprints = styleCatalog.map((style) => {
    const en = resolveVisualContract(style.id, { contentLocale: 'en' });
    return {
      id: style.id,
      mode: en.mode,
      en: en.contentHash,
      ko: resolveVisualContract(style.id, { contentLocale: 'ko' }).contentHash,
      ja: resolveVisualContract(style.id, { contentLocale: 'ja' }).contentHash,
    };
  });
  const contrastTotals = { pass: 0, fail: 0, 'needs-rendered-review': 0, 'not-applicable': 0 };
  const contrastFailures: string[] = [];
  for (const style of styleCatalog) {
    for (const check of assessContrast(resolveVisualContract(style.id))) {
      contrastTotals[check.status] += 1;
      if (check.status === 'fail') contrastFailures.push(`${style.id} ${check.id}`);
    }
  }
  const gates = {
    fieldExpectations: fieldViolations.length ? 'fail' as const : 'pass' as const,
    brutalistExport: exportMissing.length ? 'fail' as const : 'pass' as const,
    zeroTokensSurviveExport: zeroMissing.length ? 'fail' as const : 'pass' as const,
    densityOverride: densityViolations.length ? 'fail' as const : 'pass' as const,
    paletteOrderInvariant: paletteViolations.length ? 'fail' as const : 'pass' as const,
    staleDraftRejected: staleRejected ? 'pass' as const : 'fail' as const,
  };
  const failingGates = Object.entries(gates).filter(([, status]) => status !== 'pass').map(([name]) => name);
  return {
    status: failingGates.length ? 'fail' as const : 'pass' as const,
    failingGates,
    fieldViolations,
    exportMissing,
    zeroMissing,
    densityViolations,
    paletteViolations,
    gates,
    styleCount: styleCatalog.length,
    fingerprints,
    anchors: expectations,
    contrast: {
      status: 'recorded' as const,
      claim: 'Contrast counts are separate from build success and from subjective visual preference.',
      totals: contrastTotals,
      failures: contrastFailures,
    },
    knownDefects: collectKnownDefects(),
  };
}

function duplicateStrings(value: unknown, minChars: number) {
  const counts = new Map<string, number>();
  const visit = (current: unknown) => {
    if (typeof current === 'string') {
      if (current.length >= minChars) counts.set(current, (counts.get(current) ?? 0) + 1);
      return;
    }
    if (Array.isArray(current)) {
      current.forEach(visit);
      return;
    }
    if (current && typeof current === 'object') Object.values(current).forEach(visit);
  };
  visit(value);
  return [...counts]
    .filter(([, count]) => count > 1)
    .map(([sample, count]) => ({
      sample: sample.slice(0, 64),
      count,
      duplicateBytes: Buffer.byteLength(sample) * (count - 1),
    }))
    .sort((left, right) => right.duplicateBytes - left.duplicateBytes || left.sample.localeCompare(right.sample));
}

function handoffUrls(rendered: string): string[] {
  return rendered.match(/https?:\/\/[^"\\\s]+/g) ?? [];
}

export function buildHandoffBaseline() {
  const config = loadMeasurementConfig();
  const samples: Array<{ id: string; locale: string; bytes: number; promptBytes: number; estimatedTokens: number; sha256: string; violations: string[] }> = [];
  const hosts = new Map<string, number>();
  let maxDuplicateBytes = 0;
  let duplicateExamples: Array<{ sample: string; count: number; duplicateBytes: number }> = [];
  for (const style of styleCatalog) {
    for (const locale of config.contentLocales) {
      const handoff = buildSelectedHandoff(resolveVisualContract(style.id, { contentLocale: locale }));
      const rendered = `${serializeVisualJson(handoff, 0)}\n`;
      const prompt = selectedHandoffToPrompt(handoff);
      const violations = selectedPayloadViolations(handoff);
      samples.push({
        id: style.id,
        locale,
        bytes: Buffer.byteLength(rendered),
        promptBytes: Buffer.byteLength(prompt),
        estimatedTokens: estimateTokens(prompt),
        sha256: sha256(rendered),
        violations,
      });
      for (const url of handoffUrls(rendered)) {
        const host = new URL(url).host;
        hosts.set(host, (hosts.get(host) ?? 0) + 1);
      }
      const duplicates = duplicateStrings(handoff, config.duplicateStringMinChars);
      const duplicateBytes = duplicates.reduce((sum, item) => sum + item.duplicateBytes, 0);
      if (duplicateBytes > maxDuplicateBytes) {
        maxDuplicateBytes = duplicateBytes;
        duplicateExamples = duplicates.slice(0, 5);
      }
    }
  }
  const unexpectedUrlHosts = [...hosts.keys()].filter((host) => !config.allowedHandoffUrlHosts.includes(host)).sort();
  const violationCount = samples.reduce((sum, sample) => sum + sample.violations.length, 0);
  const smoke = new Set(config.smokeStyleIds);
  return {
    status: violationCount || unexpectedUrlHosts.length ? 'fail' as const : 'pass' as const,
    tokenizer: TOKENIZER,
    tokenizerDefinition: config.tokenizer.definition,
    modelTokenization: { status: 'not-run' as const, reason: 'No provider tokenizer was loaded. Do not bill or compare models with utf8-bytes-div-4/v1.' },
    fetchesPerformed: 0,
    embeddedUrlNote: 'URL counts are strings inside the selected handoff. This measurement performs no fetch.',
    urlHosts: Object.fromEntries([...hosts].sort(([left], [right]) => left.localeCompare(right))),
    unexpectedUrlHosts,
    maxBytes: Math.max(...samples.map((sample) => sample.bytes)),
    maxPromptBytes: Math.max(...samples.map((sample) => sample.promptBytes)),
    maxEstimatedTokens: Math.max(...samples.map((sample) => sample.estimatedTokens)),
    duplicate: { maxDuplicateBytes, examples: duplicateExamples },
    smoke: samples.filter((sample) => smoke.has(sample.id)),
    samples,
  };
}

export function buildFontBaseline() {
  const config = loadMeasurementConfig();
  const routes = Object.fromEntries(config.routes.map((route) => {
    const definition = findRoute(route.path);
    const families = {
      en: getRouteFontFamilies(definition, 'en'),
      ko: getRouteFontFamilies(definition, 'ko'),
      ja: getRouteFontFamilies(definition, 'ja'),
    };
    return [route.id, {
      path: route.path,
      families,
      stylesheets: {
        en: families.en.map((family) => getRouteFontStylesheet(family) ?? null),
        ko: families.ko.map((family) => getRouteFontStylesheet(family) ?? null),
        ja: families.ja.map((family) => getRouteFontStylesheet(family) ?? null),
      },
    }];
  }));
  const catalogFamilies = [...new Set(Object.values(originalStyleFonts).flat())].sort((left, right) => left.localeCompare(right));
  const homeFamilies = routes.home?.families.en ?? [];
  const listsEveryCatalogFamily = catalogFamilies.every((family) => homeFamilies.includes(family));
  return {
    status: listsEveryCatalogFamily ? 'fail' as const : 'pass' as const,
    claim: 'Families come from getRouteFontFamilies. They are not observed font-file downloads. A first specimen may lazy-load an approved face; this inventory does not record that network. Repeat-edit downloads were not-run.',
    catalogFamilyCount: catalogFamilies.length,
    catalogFamilies,
    listsEveryCatalogFamily,
    routes,
  };
}

export function buildStructuralBaseline() {
  const config = loadMeasurementConfig();
  const sourceRoot = join(rootDir, 'src');
  const files = filesUnder(sourceRoot, /\.(?:ts|tsx|css)$/);
  const hits = files.flatMap((path) => {
    const text = readFileSync(path, 'utf8');
    return config.forbiddenRuntimeMarkers
      .filter((marker) => text.includes(marker))
      .map((marker) => ({ file: relative(rootDir, path), marker }));
  });
  const css = readFileSync(join(sourceRoot, 'styles.css'), 'utf8');
  const app = readFileSync(join(sourceRoot, 'App.tsx'), 'utf8');
  const googleFontsInGlobalCss = css.includes('fonts.googleapis.com');
  const staticPortedImport = /from ['"]\.\/ported\//.test(app);
  const lazyHome = app.includes("lazy(() => import('./pages/Home')");
  const editorPaths = ['src/pages/ColorSystem.tsx', 'src/pages/Typography.tsx', 'src/pages/Compare.tsx', 'src/pages/PromptWorkflow.tsx'];
  const editorFetches = editorPaths.filter((path) => readFileSync(join(rootDir, path), 'utf8').includes('fetch('));
  const failed = hits.length > 0 || googleFontsInGlobalCss || staticPortedImport || !lazyHome || editorFetches.length > 0;
  return {
    status: failed ? 'fail' as const : 'pass' as const,
    hits,
    googleFontsInGlobalCss,
    staticPortedImport,
    lazyHome,
    editorFetches,
    note: 'Local token edits, axis switches, and basic export are source-inspected here. This is not a runtime network trace. Browser bundle contents are checked from dist when a build is present.',
  };
}

function documentRequests(html: string) {
  const requests: Array<{ kind: string; url: string }> = [];
  for (const match of html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*>/g)) requests.push({ kind: 'script', url: match[1] ?? '' });
  for (const match of html.matchAll(/<link\b[^>]*>/g)) {
    const tag = match[0];
    const url = /href="([^"]+)"/.exec(tag)?.[1];
    if (!url) continue;
    requests.push({ kind: /rel="([^"]+)"/.exec(tag)?.[1] ?? 'link', url });
  }
  return requests;
}

export async function buildStaticAssetBaseline() {
  const config = loadMeasurementConfig();
  const dist = join(rootDir, 'dist');
  if (!existsSync(join(dist, 'index.html'))) {
    return { status: 'not-run' as const, reason: 'Production dist is missing. Run npm run build before pinning asset bytes.' };
  }
  const measured = await measureQuality(rootDir) as {
    metrics: Record<string, number>;
    site: {
      entry: { bytes: number; gzipBytes: number; sha256: string };
      routeJsModuleClosures: Record<string, { files: string[]; gzipBytes: number }>;
      staticArtifacts: Record<string, { bytes: number; gzipBytes: number; sha256: string }>;
      globalFontFamilyRequests: string[];
      selectedCoverage: { status: string; expected: number; actual: number; missing: string[]; unexpected: string[] };
    };
  };
  const html = readFileSync(join(dist, 'index.html'), 'utf8');
  const requests = documentRequests(html);
  const metadataRels = new Set(['alternate', 'canonical', 'sitemap']);
  const subresources = requests.filter((request) => !metadataRels.has(request.kind));
  const htmlBytes = measureBytes(html);
  const closures = Object.fromEntries(config.routes.map((route) => {
    const closure = measured.site.routeJsModuleClosures[route.chunk];
    return [route.id, closure ? { chunk: route.chunk, gzipBytes: closure.gzipBytes, files: closure.files } : { chunk: route.chunk, status: 'not-run' as const, reason: 'Route chunk was not in the production build.' }];
  }));
  const bundleHits = filesUnder(join(dist, 'assets'), /\.js$/).flatMap((path) => {
    const text = readFileSync(path, 'utf8');
    return config.forbiddenRuntimeMarkers.filter((marker) => text.includes(marker)).map((marker) => ({ file: relative(dist, path), marker }));
  });
  const budgets = (JSON.parse(readFileSync(join(rootDir, 'docs/quality-budgets.json'), 'utf8')) as { budgets: ResourceBudget[] }).budgets
    .filter((budget) => (budget.scope ?? 'site') === 'site');
  const budgetChecks = checkBudgets(measured.metrics, budgets);
  const discovery = {
    slimBytes: measured.site.staticArtifacts['agent-handoff.json']?.bytes ?? null,
    fullBytes: measured.site.staticArtifacts['agent-handoff.full.json']?.bytes ?? null,
    note: 'Discovery documents intentionally index styles and references. Their size is not the selected-handoff budget. generatedAt changes the hash and keeps a fixed ISO length, so bytes are pinned and hashes are not.',
  };
  const fontRequestsInDocument = subresources.filter((request) => request.url.includes('fonts.googleapis.com') || request.url.includes('fonts.gstatic.com'));
  const failed = budgetChecks.some((check) => check.status !== 'pass')
    || measured.site.selectedCoverage.status !== 'pass'
    || bundleHits.length > 0
    || fontRequestsInDocument.length > 0
    || measured.site.globalFontFamilyRequests.length > 0;
  return {
    status: failed ? 'fail' as const : 'pass' as const,
    claim: 'On-disk production bytes, gzip level 9. Not an observed cold or warm browser transfer.',
    metrics: {
      entryJsGzipBytes: measured.metrics.entryJsGzipBytes,
      allJSGzipBytes: measured.metrics.allJSGzipBytes,
      allCSSGzipBytes: measured.metrics.allCSSGzipBytes,
      globalFontFamilyRequests: measured.metrics.globalFontFamilyRequests,
      selectedStaticMaxBytes: measured.metrics.selectedStaticMaxBytes,
      selectedPromptMaxBytes: measured.metrics.selectedPromptMaxBytes,
      legacySlimHandoffBytes: measured.metrics.legacySlimHandoffBytes,
      homeJsClosureGzipBytes: measured.metrics.homeJsClosureGzipBytes,
      colorSystemJsClosureGzipBytes: measured.metrics.colorSystemJsClosureGzipBytes,
      typographyJsClosureGzipBytes: measured.metrics.typographyJsClosureGzipBytes,
      compareJsClosureGzipBytes: measured.metrics.compareJsClosureGzipBytes,
      promptWorkflowJsClosureGzipBytes: measured.metrics.promptWorkflowJsClosureGzipBytes,
    },
    entry: measured.site.entry,
    document: {
      bytes: htmlBytes.bytes,
      gzipBytes: htmlBytes.gzipBytes,
      subresources,
      metadataLinks: requests.filter((request) => metadataRels.has(request.kind)),
      note: 'Subresources are script, stylesheet, preload, and icon URLs in the built document. Metadata links are not transfer bytes. Font files are not in this document.',
    },
    fontRequestsInDocument,
    routeClosures: closures,
    budgetChecks,
    selectedCoverage: measured.site.selectedCoverage,
    discovery,
    bundleHits,
  };
}

function roundMs(value: number): number {
  return Number(value.toFixed(3));
}

export function measureResolutionTiming() {
  const config = loadMeasurementConfig();
  const operation = () => {
    const design = resolveVisualContract('brutalist-grid', { contentLocale: 'en' });
    exportVisualContract(design, 'json');
    exportVisualContract(design, 'css-variables');
    selectedHandoffToPrompt(buildSelectedHandoff(design));
  };
  const coldStart = performance.now();
  operation();
  const coldMs = performance.now() - coldStart;
  for (let index = 0; index < config.timing.warmup; index += 1) operation();
  const samples = Array.from({ length: config.timing.samples }, () => {
    const start = performance.now();
    operation();
    return performance.now() - start;
  }).sort((left, right) => left - right);
  return {
    status: 'informational' as const,
    operation: 'resolve brutalist-grid en, export json and css, build selected prompt',
    cold: { condition: 'first-in-process-call' as const, samples: 1, medianMs: roundMs(coldMs) },
    warm: {
      condition: 'after-warmup' as const,
      warmup: config.timing.warmup,
      samples: samples.length,
      medianMs: roundMs(samples[Math.floor(samples.length / 2)] ?? 0),
      p95Ms: roundMs(samples[Math.floor(samples.length * 0.95)] ?? 0),
    },
    claim: 'Node lab microbenchmark. Not a cold browser start, field interaction latency, long-task duration, or allocation measurement.',
  };
}

export async function buildComparableBaseline() {
  const config = loadMeasurementConfig();
  const fidelity = buildFidelityBaseline();
  const handoff = buildHandoffBaseline();
  const fonts = buildFontBaseline();
  const structural = buildStructuralBaseline();
  const staticAssets = await buildStaticAssetBaseline();
  const fixtureHash = sha256(readFileSync(join(fixtureDir, 'field-expectations.json')));
  const configHash = sha256(readFileSync(join(fixtureDir, 'measurement.json')));
  return {
    schema: 'webstylebook.quality-baseline.v1' as const,
    phase: 1 as const,
    issue: 11 as const,
    fixtureSha256: fixtureHash,
    configSha256: configHash,
    tokenizer: config.tokenizer,
    fidelity,
    handoff,
    fonts,
    structural,
    staticAssets,
    claims: {
      deterministicContract: fidelity.status,
      contrast: 'recorded' as const,
      renderedBrowserFidelity: 'not-run' as const,
      staticAssetInventory: staticAssets.status,
      observedBrowserTransferCold: 'not-run' as const,
      observedBrowserTransferWarm: 'not-run' as const,
      interactionTiming: 'not-run' as const,
      allocation: 'not-run' as const,
      liveModelComparison: 'not-run' as const,
      subjectiveVisualPreference: 'not-run' as const,
      buildSuccess: 'not-applicable' as const,
    },
  };
}

function gitIdentity() {
  const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: rootDir, encoding: 'utf8' }).trim();
  const porcelain = execFileSync('git', ['status', '--porcelain', '--untracked-files=normal'], { cwd: rootDir, encoding: 'utf8' });
  const dirtyPaths = porcelain.split('\n').map((line) => line.trimEnd()).filter(Boolean);
  return { commit, dirty: dirtyPaths.length > 0, dirtyPaths };
}

export async function buildBaselineReport() {
  const comparable = await buildComparableBaseline();
  const lock = measureBytes(readFileSync(join(rootDir, 'package-lock.json')));
  return {
    schema: comparable.schema,
    phase: comparable.phase,
    issue: comparable.issue,
    capturedAt: new Date().toISOString(),
    source: gitIdentity(),
    environment: {
      node: process.version,
      npm: execFileSync('npm', ['--version'], { encoding: 'utf8' }).trim(),
      packageLockSha256: lock.sha256,
      platform: platform(),
      osRelease: release(),
      architecture: process.arch,
      cpu: cpus()[0]?.model ?? 'unknown',
    },
    methodology: {
      assets: 'Production files on disk, gzip level 9. Route closures follow static import declarations and include the entry module. These are not cold or warm browser transfer logs.',
      timing: 'In-process cold call versus warm samples. Informational only.',
      context: `${TOKENIZER.name}/${TOKENIZER.version}. Provider tokenization is not-run.`,
      network: 'The capture does not fetch, call a model, or install packages.',
      commands: ['npm ci', 'npm run build', 'npm run quality:baseline -- --write', 'npm run quality:baseline:check'],
    },
    informational: {
      timing: measureResolutionTiming(),
      allocation: { status: 'not-run' as const, reason: 'Uninstrumented heap deltas are not per-operation allocation measurements.' },
      browserTransfer: {
        cold: { status: 'not-run' as const, reason: 'No browser network log was captured.' },
        warm: { status: 'not-run' as const, reason: 'No repeat navigation was captured in a browser.' },
      },
      browserInteraction: { status: 'not-run' as const, reason: 'Editing, comparison switching, navigation, and long tasks were not timed in a browser.' },
      liveModelComparison: { status: 'not-run' as const, reason: 'Use npm run quality:ai. This baseline does not call a model or spend a budget.' },
    },
    comparable,
  };
}

export function comparableDrift(actual: unknown, pinned: unknown): string[] {
  return JSON.stringify(actual) === JSON.stringify(pinned) ? [] : ['comparable baseline drifted'];
}

function flag(args: string[], name: string): string | undefined {
  const index = args.indexOf(name);
  if (index < 0) return undefined;
  const value = args[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`${name} requires a value`);
  return value;
}

async function main() {
  const args = process.argv.slice(2);
  const output = resolve(flag(args, '--output') ?? BASELINE_PATH);
  const report = await buildBaselineReport();
  if (args.includes('--write')) {
    if (report.comparable.staticAssets.status === 'not-run') throw new Error('Refusing to pin a baseline without a production build.');
    if (report.comparable.fidelity.status !== 'pass' || report.comparable.handoff.status !== 'pass' || report.comparable.structural.status !== 'pass' || report.comparable.fonts.status !== 'pass') {
      throw new Error(`Refusing to pin a failing contract baseline: ${report.comparable.fidelity.failingGates.join(', ') || report.comparable.handoff.status}`);
    }
    mkdirSync(dirname(output), { recursive: true });
    writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
  }
  if (args.includes('--check')) {
    const pinned = JSON.parse(readFileSync(output, 'utf8')) as { comparable: unknown };
    const drift = comparableDrift(report.comparable, pinned.comparable);
    if (drift.length) {
      process.exitCode = 1;
      console.error(drift.join('\n'));
    }
  }
  const assets = report.comparable.staticAssets;
  console.log(JSON.stringify({
    source: report.source.commit,
    dirty: report.source.dirty,
    fidelity: report.comparable.fidelity.status,
    handoff: { status: report.comparable.handoff.status, maxBytes: report.comparable.handoff.maxBytes, maxEstimatedTokens: report.comparable.handoff.maxEstimatedTokens },
    fonts: report.comparable.fonts.status,
    structural: report.comparable.structural.status,
    staticAssets: assets.status,
    budgetFailures: (('budgetChecks' in assets ? assets.budgetChecks : undefined) ?? []).filter((check) => check.status !== 'pass'),
    claims: report.comparable.claims,
    output: args.includes('--write') || args.includes('--check') ? output : null,
  }, null, 2));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
