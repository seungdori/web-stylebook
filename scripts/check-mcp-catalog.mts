// Drift check (ADR-004): recompile in memory and byte-compare against the
// committed snapshot. Non-zero exit if stale. Run in the same CI job as the site gates.
// Usage: tsx scripts/check-mcp-catalog.mts

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { compileCatalog } from './generate-mcp-catalog.mts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'packages', 'mcp', 'generated');

function read(path: string): string {
  try { return readFileSync(path, 'utf8'); } catch { return ''; }
}

const { catalogJson, manifestJson } = compileCatalog();
const committedCatalog = read(join(OUT_DIR, 'catalog.v1.json'));
const committedManifest = read(join(OUT_DIR, 'manifest.v1.json'));

let drift = false;
if (catalogJson !== committedCatalog) { console.error('[drift] catalog.v1.json is stale'); drift = true; }
if (manifestJson !== committedManifest) { console.error('[drift] manifest.v1.json is stale'); drift = true; }

if (drift) {
  console.error('\nFix: npm run mcp:catalog, then sync both generated files to the standalone MCP repository');
  process.exit(1);
}
console.error('[drift] committed catalog matches source ✓');
