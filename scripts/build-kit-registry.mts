// Kit registry builder: src/kit -> public/r/*.json (shadcn registry items).
// Each item carries its source as file content, so `npx shadcn add <url>`
// copies the files into src/components/webstylebook/ in the user's project.
//
// Usage:
//   tsx scripts/build-kit-registry.mts            write public/r
//   tsx scripts/build-kit-registry.mts --check    fail if public/r is stale
//   tsx scripts/build-kit-registry.mts --base http://localhost:5173/r --out <dir>
//                                                 local install test

import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const DEFAULT_BASE = 'https://webstylebook.com/r';
const TARGET_DIR = 'src/components/webstylebook';

interface KitItem {
  name: string;
  title: string;
  description: string;
  /** Paths relative to src/kit. */
  files: string[];
  /** Other kit items this one imports. The theme is added to every component. */
  uses?: string[];
}

export const KIT_ITEMS: KitItem[] = [
  {
    name: 'theme',
    title: 'Theme: Quiet Utility',
    description: 'The --ws-* variables every kit component reads. Replace this file to change the style.',
    files: ['theme.css'],
  },
  {
    name: 'surface',
    title: 'Surface',
    description: 'Shell, ShellHeader, and Panel: the framed layers other components sit in.',
    files: ['surface/surface.tsx', 'surface/surface.css'],
  },
  {
    name: 'button',
    title: 'Button',
    description: 'Primary and secondary buttons with an icon slot and a busy state.',
    files: ['button/button.tsx', 'button/button.css'],
  },
  {
    name: 'search-field',
    title: 'Search Field',
    description: 'A search input with a clear button; Escape clears the value.',
    files: ['search-field/search-field.tsx', 'search-field/search-field.css'],
  },
  {
    name: 'skeleton',
    title: 'Skeleton',
    description: 'Placeholder blocks and a group that announces one loading message.',
    files: ['skeleton/skeleton.tsx', 'skeleton/skeleton.css'],
  },
  {
    name: 'status-badge',
    title: 'Status Badge',
    description: 'A one-word state in five tones, with a dot or an icon.',
    files: ['status-badge/status-badge.tsx', 'status-badge/status-badge.css'],
  },
  {
    name: 'empty-state',
    title: 'Empty State',
    description: 'Why a list is empty and what to do next: first visit, no results, or a failed load.',
    files: ['empty-state/empty-state.tsx', 'empty-state/empty-state.css'],
  },
];

const SCHEMA_ITEM = 'https://ui.shadcn.com/schema/registry-item.json';
const SCHEMA_REGISTRY = 'https://ui.shadcn.com/schema/registry.json';

function itemJson(item: KitItem, base: string) {
  const dependsOnTheme = item.name !== 'theme';
  const registryDependencies = [...(dependsOnTheme ? ['theme'] : []), ...(item.uses ?? [])].map((name) => `${base}/${name}.json`);
  return {
    $schema: SCHEMA_ITEM,
    name: item.name,
    type: 'registry:component',
    title: item.title,
    description: item.description,
    ...(registryDependencies.length ? { registryDependencies } : {}),
    files: item.files.map((path) => ({
      path: `src/kit/${path}`,
      type: 'registry:file',
      target: `${TARGET_DIR}/${path}`,
      content: readFileSync(join(ROOT, 'src/kit', path), 'utf8'),
    })),
  };
}

/** Every output file, keyed by its path relative to the output directory. */
export function buildKitRegistry(base = DEFAULT_BASE): Map<string, string> {
  const out = new Map<string, string>();
  for (const item of KIT_ITEMS) {
    out.set(`${item.name}.json`, `${JSON.stringify(itemJson(item, base), null, 2)}\n`);
  }
  const index = {
    $schema: SCHEMA_REGISTRY,
    name: 'webstylebook',
    homepage: 'https://webstylebook.com/pages/components',
    items: KIT_ITEMS.map((item) => {
      const { files, ...rest } = itemJson(item, base);
      return { ...rest, files: files.map(({ path, type, target }) => ({ path, type, target })) };
    }),
  };
  out.set('registry.json', `${JSON.stringify(index, null, 2)}\n`);
  return out;
}

function argValue(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function main() {
  const check = process.argv.includes('--check');
  const base = argValue('--base') ?? DEFAULT_BASE;
  const outDir = resolve(argValue('--out') ?? join(ROOT, 'public/r'));
  const files = buildKitRegistry(base);

  if (check) {
    const stale = [...files].filter(([name, content]) => {
      const path = join(outDir, name);
      return !existsSync(path) || readFileSync(path, 'utf8') !== content;
    });
    if (stale.length) {
      console.error(`Kit registry is stale: ${stale.map(([name]) => name).join(', ')}. Run: npm run kit:registry`);
      process.exit(1);
    }
    console.log(`Kit registry is current (${files.size} files).`);
    return;
  }

  mkdirSync(outDir, { recursive: true });
  for (const [name, content] of files) writeFileSync(join(outDir, name), content);
  console.log(`Wrote ${files.size} files to ${outDir}`);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main();
