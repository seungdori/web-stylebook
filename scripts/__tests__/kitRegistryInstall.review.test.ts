// Reviewer tests for the shadcn registry output and its install layout.
// The request: components install with `npx shadcn add <url>` into another
// app, plain CSS reading theme variables, publishing only from public/r.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildKitRegistry, KIT_ITEMS } from '../build-kit-registry.mts';

const root = path.resolve(__dirname, '../..');
const kitDir = path.join(root, 'src/kit');

type ItemFile = { path: string; type: string; target: string; content: string };
type Item = { name: string; registryDependencies?: string[]; files: ItemFile[] };

const built = buildKitRegistry('https://example.test/r');
const items: Item[] = KIT_ITEMS.map((item) => JSON.parse(built.get(`${item.name}.json`)!));
const byName = new Map(items.map((item) => [item.name, item]));

function depName(url: string): string {
  return path.basename(url, '.json');
}

/** Every file an install of `name` writes: its own files plus its registry dependencies, transitively. */
function installedFiles(name: string, seen = new Set<string>()): ItemFile[] {
  if (seen.has(name)) return [];
  seen.add(name);
  const item = byName.get(name);
  if (!item) throw new Error(`Unknown registry item ${name}`);
  return [...item.files, ...(item.registryDependencies ?? []).flatMap((url) => installedFiles(depName(url), seen))];
}

describe('kit registry: install layout', () => {
  it('every relative import in an installed file resolves to a file the same install writes', () => {
    for (const item of items) {
      const targets = new Set(installedFiles(item.name).map((file) => file.target));
      for (const file of item.files) {
        const specifiers = [...file.content.matchAll(/(?:import|from)\s+['"](\.[^'"]+)['"]/g)].map((match) => match[1]);
        for (const specifier of specifiers) {
          const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(file.target), specifier));
          const candidates = [resolved, `${resolved}.tsx`, `${resolved}.ts`];
          expect(
            candidates.some((candidate) => targets.has(candidate)),
            `${item.name}: ${file.target} imports ${specifier}`,
          ).toBe(true);
        }
      }
    }
  });

  it('no two items write the same target path', () => {
    const targets = items.flatMap((item) => item.files.map((file) => file.target));
    expect(new Set(targets).size).toBe(targets.length);
  });

  it('dependency URLs use the requested base and point at items in this registry', () => {
    for (const item of items) {
      for (const url of item.registryDependencies ?? []) {
        expect(url.startsWith('https://example.test/r/'), url).toBe(true);
        expect(byName.has(depName(url)), url).toBe(true);
      }
    }
  });

  it('file content is the kit source byte for byte', () => {
    for (const item of items) {
      for (const file of item.files) {
        expect(file.content, file.path).toBe(fs.readFileSync(path.join(root, file.path), 'utf8'));
      }
    }
  });

  it('the index lists every item without file content', () => {
    const index = JSON.parse(built.get('registry.json')!);
    expect(index.items.map((item: Item) => item.name)).toEqual(KIT_ITEMS.map((item) => item.name));
    for (const item of index.items as Item[]) {
      for (const file of item.files) expect(file).not.toHaveProperty('content');
    }
  });
});

describe('kit CSS: theme variables', () => {
  const themeCss = fs.readFileSync(path.join(kitDir, 'theme.css'), 'utf8');
  const defined = new Set([...themeCss.matchAll(/(--ws-[\w-]+)\s*:/g)].map((match) => match[1]));

  it('every --ws-* variable a component reads is defined in theme.css or in the same file', () => {
    for (const item of KIT_ITEMS.filter((entry) => entry.name !== 'theme')) {
      for (const file of item.files.filter((entry) => entry.endsWith('.css'))) {
        const css = fs.readFileSync(path.join(kitDir, file), 'utf8');
        const local = new Set([...css.matchAll(/(--ws-[\w-]+)\s*:/g)].map((match) => match[1]));
        const used = [...css.matchAll(/var\((--ws-[\w-]+)/g)].map((match) => match[1]);
        for (const name of used) {
          expect(defined.has(name) || local.has(name), `${file} reads ${name}`).toBe(true);
        }
      }
    }
  });

  it('every component class is namespaced ws-, so it cannot collide with app classes', () => {
    for (const item of KIT_ITEMS.filter((entry) => entry.name !== 'theme')) {
      for (const file of item.files.filter((entry) => entry.endsWith('.css'))) {
        const css = fs.readFileSync(path.join(kitDir, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
        const classes = [...css.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((match) => match[1]);
        for (const name of classes) expect(name.startsWith('ws-'), `${file}: .${name}`).toBe(true);
        // No bare element selectors at the top level of a rule (they would restyle the host app).
        const preludes = [...css.matchAll(/(?:^|[{};])\s*([^{};]+)\{/g)].map((match) => match[1].trim());
        expect(preludes.filter((prelude) => prelude.startsWith('.ws-')).length, file).toBeGreaterThan(0);
        for (const prelude of preludes) {
          if (prelude.startsWith('@keyframes')) {
            expect(prelude, file).toMatch(/^@keyframes ws-/);
            continue;
          }
          if (prelude.startsWith('@') || /^(from|to|\d+%)(\s*,\s*(from|to|\d+%))*$/.test(prelude)) continue;
          for (const part of prelude.split(',')) expect(part.trim(), `${file}: ${part}`).toMatch(/^\.ws-/);
        }
      }
    }
  });
});

describe('kit components: React Server Components boundary', () => {
  // A component that uses hooks or attaches an event handler must start with
  // 'use client', or it throws when a Next.js App Router server component renders it.
  it("every component with hooks or event handlers starts with 'use client'", () => {
    for (const item of KIT_ITEMS.filter((entry) => entry.name !== 'theme')) {
      for (const file of item.files.filter((entry) => entry.endsWith('.tsx'))) {
        const source = fs.readFileSync(path.join(kitDir, file), 'utf8');
        const needsClient = /\buse(State|Ref|Id|Effect|LayoutEffect|Callback|Memo|Reducer|Context)\s*\(/.test(source) || /\son[A-Z]\w*=\{/.test(source);
        if (needsClient) expect(source.trimStart().startsWith("'use client'"), file).toBe(true);
      }
    }
  });
});

describe('kit registry: CLI', () => {
  const run = (...args: string[]) =>
    spawnSync(process.execPath, [path.join(root, 'node_modules/tsx/dist/cli.mjs'), path.join(root, 'scripts/build-kit-registry.mts'), ...args], {
      cwd: root,
      encoding: 'utf8',
    });

  it('--check fails on a stale output directory and passes after a write', () => {
    const out = fs.mkdtempSync(path.join(os.tmpdir(), 'kit-registry-'));
    try {
      expect(run('--check', '--out', out).status).toBe(1);
      expect(run('--out', out, '--base', 'http://127.0.0.1:1/r').status).toBe(0);
      expect(fs.readFileSync(path.join(out, 'button.json'), 'utf8')).toContain('http://127.0.0.1:1/r/theme.json');
      expect(run('--check', '--out', out, '--base', 'http://127.0.0.1:1/r').status).toBe(0);
      fs.writeFileSync(path.join(out, 'theme.json'), '{}\n');
      const stale = run('--check', '--out', out, '--base', 'http://127.0.0.1:1/r');
      expect(stale.status).toBe(1);
      expect(stale.stderr).toContain('theme.json');
    } finally {
      fs.rmSync(out, { recursive: true, force: true });
    }
  }, 60_000);

  it('public/_headers serves /r/* as JSON with CORS', () => {
    const headers = fs.readFileSync(path.join(root, 'public/_headers'), 'utf8');
    const block = headers.split(/\n(?=\S)/).find((entry) => entry.startsWith('/r/*'));
    expect(block).toBeDefined();
    expect(block).toMatch(/Content-Type: application\/json/);
    expect(block).toMatch(/Access-Control-Allow-Origin: \*/);
  });
});
