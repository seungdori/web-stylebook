// Validate the COMMITTED catalog snapshot (used by the CLI --validate-catalog and CI).
// Re-parses with zod, recomputes the content hash, and re-runs reference validation.
// Usage: tsx scripts/validate-mcp-catalog.mts

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { zCatalogEnvelope } from '../src/catalog/schema.ts';
import { validateCatalog } from './lib/catalog-validation.mts';
import { contentHashOf } from './lib/stable-json.mts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = join(__dirname, '..', 'packages', 'mcp', 'generated', 'catalog.v1.json');

const raw = readFileSync(CATALOG_PATH, 'utf8');
const parsed = JSON.parse(raw);

// 1. zod shape (structural validation — note: this trims strings, so do NOT hash from it)
const envelope = zCatalogEnvelope.parse(parsed);

// 2. content hash reproduces, computed over the RAW parsed bytes (self-excluding),
//    matching exactly how the generator hashed the un-transformed data.
const { contentHash, ...withoutHash } = parsed as { contentHash: string } & Record<string, unknown>;
const recomputed = contentHashOf(withoutHash);
if (recomputed !== contentHash) {
  console.error(`[validate] content hash mismatch: stored ${contentHash}, recomputed ${recomputed}`);
  process.exit(1);
}

// 3. reference + locale validation
const issues = validateCatalog(envelope.data);
const errors = issues.filter((i) => i.severity === 'error');
for (const i of issues) console.error(`[validate][${i.severity}] ${i.domain}/${i.id}: ${i.message}`);
if (errors.length) {
  console.error(`[validate] FAILED: ${errors.length} error(s)`);
  process.exit(1);
}

console.error(
  `[validate] OK · ${contentHash} · catalog ${envelope.catalogVersion}`
  + ` · ${envelope.data.styles.length} styles · ${envelope.data.stateRecipes.length} recipes`,
);
