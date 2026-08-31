// Deterministic MCP catalog compiler (02 §6, ADR-004 amended).
// src/catalog -> packages/mcp/generated/{catalog.v1.json, manifest.v1.json}
//   1. assemble canonical data   2. reference + locale validation
//   3. zod shape validation      4. content hash (self-excluding)
//   5. stable serialize + emit
// Usage: tsx scripts/generate-mcp-catalog.mts [--check]

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildCatalogData, catalogCounts, CATALOG_DOMAINS } from '../src/catalog/index.ts';
import { validateCatalog, notIdealCoverageWarnings } from './lib/catalog-validation.mts';
import { zCatalogEnvelope } from '../src/catalog/schema.ts';
import { stableStringify, contentHashOf } from './lib/stable-json.mts';
import type { CatalogEnvelope, CatalogManifest } from '../src/catalog/types.ts';

export const CATALOG_VERSION = '0.9.0';
export const SCHEMA_ID = 'webstylebook.catalog.v1' as const;

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'packages', 'mcp', 'generated');

export interface CompiledOutputs {
  catalogJson: string;
  manifestJson: string;
  envelope: CatalogEnvelope;
}

/** Pure compile: assemble, validate, hash, serialize. Throws on any error-severity issue. */
export function compileCatalog(): CompiledOutputs {
  const data = buildCatalogData();

  // 1. reference + invariant + locale validation
  const issues = validateCatalog(data);
  const warnings = [...issues.filter((i) => i.severity === 'warning'), ...notIdealCoverageWarnings(data)];
  const errors = issues.filter((i) => i.severity === 'error');
  for (const w of warnings) console.error(`[catalog][warn] ${w.domain}/${w.id}: ${w.message}`);
  if (errors.length) {
    for (const e of errors) console.error(`[catalog][ERROR] ${e.domain}/${e.id}: ${e.message}`);
    throw new Error(`catalog validation failed: ${errors.length} error(s)`);
  }

  // 2. envelope without hash -> content hash -> full envelope
  const base = {
    schema: SCHEMA_ID,
    catalogVersion: CATALOG_VERSION,
    languages: ['en', 'ko', 'ja'] as ['en', 'ko', 'ja'],
    data,
  };
  const contentHash = contentHashOf(base);
  const envelope: CatalogEnvelope = { ...base, contentHash };

  // 3. zod shape validation (final gate)
  zCatalogEnvelope.parse(envelope);

  // 4. manifest
  const manifest: CatalogManifest = {
    schema: SCHEMA_ID,
    catalogVersion: CATALOG_VERSION,
    contentHash,
    languages: ['en', 'ko', 'ja'],
    counts: catalogCounts(data),
    domains: [...CATALOG_DOMAINS],
  };

  return {
    catalogJson: stableStringify(envelope),
    manifestJson: stableStringify(manifest),
    envelope,
  };
}

function main(): void {
  const checkOnly = process.argv.includes('--check');
  const { catalogJson, manifestJson, envelope } = compileCatalog();
  const catalogPath = join(OUT_DIR, 'catalog.v1.json');
  const manifestPath = join(OUT_DIR, 'manifest.v1.json');

  if (checkOnly) {
    console.error('[catalog] compile OK (check-only, not written)');
  } else {
    mkdirSync(OUT_DIR, { recursive: true });
    writeFileSync(catalogPath, catalogJson, 'utf8');
    writeFileSync(manifestPath, manifestJson, 'utf8');
    console.error(`[catalog] wrote ${catalogPath}`);
    console.error(`[catalog] wrote ${manifestPath}`);
  }
  const c = envelope.data;
  console.error(
    `[catalog] ${envelope.contentHash} · styles ${c.styles.length} · motion ${c.motionPatterns.length}`
    + ` · components ${c.components.length} · principles ${c.uxPrinciples.length}`
    + ` · design principles ${c.designPrinciples.length}`
    + ` · audit checks ${c.policies.auditChecks.length}`
    + ` · references ${c.referenceLibrary.references.length}`
    + ` · surfaces ${c.stateSurfaces.length} · recipes ${c.stateRecipes.length}`
    + ` · products ${c.productArchetypes.length}`,
  );
}

// Only run as a CLI entry — importing this module (e.g. from check-mcp-catalog) must NOT write files.
if (process.argv[1]?.endsWith('generate-mcp-catalog.mts')) {
  main();
}
