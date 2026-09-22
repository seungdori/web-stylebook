import { deepStrictEqual } from 'node:assert';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import type { ResolvedVisualContract, VisualContract, VisualResolutionOptions } from '../src/visual/types.ts';

export function assertVisualParity(expected: ResolvedVisualContract, actual: unknown, label: string) {
  deepStrictEqual(actual, expected, `${label}: visual values, provenance or resolution identity differ`);
}

export async function checkVisualParity(siteRoot: string, mcpRoot: string) {
  const visual = await import(pathToFileURL(join(siteRoot, 'src/visual/index.ts')).href) as {
    getVisualContract: (id: string) => VisualContract;
    resolveVisualContract: (id: string, options?: VisualResolutionOptions) => ResolvedVisualContract;
    visualContractToCss: (contract: ResolvedVisualContract) => string;
  };
  const handoff = await import(pathToFileURL(join(siteRoot, 'src/visual/handoff.ts')).href) as { buildSelectedHandoff: (contract: ResolvedVisualContract) => { design: ResolvedVisualContract } };
  const { CatalogRepository } = await import(pathToFileURL(join(mcpRoot, 'dist/catalog/repository.js')).href);
  const { composeDesignTokens } = await import(pathToFileURL(join(mcpRoot, 'dist/tokens/compile.js')).href);
  const repo = CatalogRepository.load();
  const cases: Array<{ styleId: string; mode: string; locale: string; overrides: boolean; status: 'pass' }> = [];
  let staticCases = 0;
  const brutalist = visual.resolveVisualContract('brutalist-grid');
  deepStrictEqual({ text: brutalist.colors.text, accent: brutalist.colors.accent }, { text: '#111', accent: '#d72600' }, 'Independent authored brutalist text/accent anchors changed');
  for (const style of repo.listStyles() as Array<{ id: string }>) {
    const authored = visual.getVisualContract(style.id);
    for (const mode of Object.keys(authored.modes) as Array<'light' | 'dark'>) {
      for (const locale of ['en', 'ko', 'ja'] as const) {
        for (const edited of [false, true]) {
          const overrides = edited ? { colors: { text: '#101010' }, typography: { body: { lineHeight: 1.8, letterSpacingEm: 0 } }, density: 'compact' as const } : {};
          const expected = visual.resolveVisualContract(style.id, { mode, contentLocale: locale, overrides });
          const input = { primaryStyleId: style.id, format: 'json', colorMode: mode, locale, overrides, contract: { schema: 'webstylebook.visual.v1', revision: authored.revision } };
          const result = composeDesignTokens(input, repo) as { visualContract: unknown; rendered: string };
          const label = `${style.id}/${mode}/${locale}/${edited ? 'edited' : 'authored'}`;
          assertVisualParity(expected, result.visualContract, `${label}/MCP`);
          assertVisualParity(expected, JSON.parse(result.rendered), `${label}/MCP JSON`);
          assertVisualParity(expected, handoff.buildSelectedHandoff(expected).design, `${label}/browser handoff`);
          if (edited) {
            deepStrictEqual({ text: expected.colors.text, tracking: expected.typography.roles.body.letterSpacingEm, lineHeight: expected.typography.roles.body.lineHeight, row: expected.spacing.row }, { text: '#101010', tracking: 0, lineHeight: 1.8, row: 32 }, `${label}/explicit override anchors`);
          } else if (mode === authored.defaultMode) {
            const path = join(siteRoot, `dist/agent-handoff/${style.id}.${locale}.json`);
            if (!existsSync(path)) throw new Error(`Missing selected static artifact: ${path}. Build the site first.`);
            assertVisualParity(expected, (JSON.parse(readFileSync(path, 'utf8')) as { design: unknown }).design, `${label}/static handoff`);
            staticCases++;
          }
          if (locale === 'en') {
            const css = composeDesignTokens({ ...input, format: 'css-variables' }, repo) as { rendered: string };
            deepStrictEqual(css.rendered, visual.visualContractToCss(expected), `${label}/CSS parity`);
          }
          cases.push({ styleId: style.id, mode, locale, overrides: edited, status: 'pass' });
        }
      }
    }
  }
  return { schema: 'webstylebook.visual-parity.v1', status: 'pass', catalogHash: repo.contentHash, visualLibraryHash: repo.visualContractMetadata.contentHash, styleCount: repo.listStyles().length, resolvedCases: cases.length, staticCases, cases };
}

async function main() {
  const args = process.argv.slice(2);
  const flag = (name: string, fallback: string) => { const i = args.indexOf(name); if (i < 0) return fallback; if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`${name} requires a path`); return resolve(args[i + 1]); };
  const siteRoot = flag('--site-root', join(dirname(fileURLToPath(import.meta.url)), '..'));
  const mcpRoot = flag('--mcp-root', join(siteRoot, '../web-stylebook-mcp'));
  const report = await checkVisualParity(siteRoot, mcpRoot);
  const output = args.includes('--output') ? flag('--output', '') : undefined;
  if (output) writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ status: report.status, catalogHash: report.catalogHash, visualLibraryHash: report.visualLibraryHash, styleCount: report.styleCount, resolvedCases: report.resolvedCases, staticCases: report.staticCases, output: output ?? null }, null, 2));
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
