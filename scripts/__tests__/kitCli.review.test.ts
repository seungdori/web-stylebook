// Independent review of packages/cli. Each test states the behavior a real
// project needs, so a failure here is a bug in the command, not in the test.
import { execFile } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { buildKitRegistry } from '../build-kit-registry.mts';

const CLI = resolve(process.cwd(), 'packages/cli/bin/webstylebook.mjs');

let server: Server;
let registry: string;
let files: Map<string, string>;
const overrides = new Map<string, { status?: number; body: string; type?: string }>();

beforeAll(async () => {
  server = createServer((request, response) => {
    const name = (request.url ?? '').replace('/r/', '');
    const override = overrides.get(name);
    const body = override?.body ?? files.get(name);
    response.writeHead(override?.status ?? (body === undefined ? 404 : 200), { 'Content-Type': override?.type ?? 'application/json' });
    response.end(body ?? '{}');
  });
  await new Promise<void>((done) => server.listen(0, '127.0.0.1', done));
  registry = `http://127.0.0.1:${(server.address() as AddressInfo).port}/r`;
  files = buildKitRegistry(registry);
});

afterAll(() => {
  server.close();
});

let project: string;
const cleanup: string[] = [];

beforeEach(() => {
  project = mkdtempSync(join(tmpdir(), 'webstylebook-review-'));
  mkdirSync(join(project, 'src'));
  writeFileSync(join(project, 'package.json'), JSON.stringify({ dependencies: { react: '^19.0.0' } }));
  overrides.clear();
});

afterEach(() => {
  for (const path of [project, ...cleanup.splice(0)]) rmSync(path, { recursive: true, force: true });
});

function run(args: string[], options: { cwd?: string; registry?: string } = {}) {
  return new Promise<{ code: number; stdout: string; stderr: string }>((done) => {
    execFile(process.execPath, [CLI, ...args, '--registry', options.registry ?? registry], { cwd: options.cwd ?? project }, (error, stdout, stderr) => {
      done({ code: error ? Number(error.code) : 0, stdout, stderr });
    });
  });
}

const install = (path = '') => join(project, 'src/components/webstylebook', path);
const item = (json: unknown) => ({ body: JSON.stringify(json) });
const good = (name: string, ...paths: string[]) => paths.map((path) => ({ target: `src/components/webstylebook/${name}/${path}`, content: 'ok' }));

/** Failed on purpose, in words: exit 1, an Error: line, and no Node stack. */
function expectCleanFailure(result: { code: number; stderr: string }) {
  expect(result.stderr, result.stderr).not.toMatch(/Node\.js v\d+|^\s+at .+\d+:\d+\)?$/m);
  expect(result.stderr).toMatch(/^Error: /m);
  expect(result.code).toBe(1);
}

function allFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => join(entry.parentPath, entry.name));
}

describe('malformed registry responses', () => {
  it.each([
    ['null', 'null'],
    ['files is a number', JSON.stringify({ files: 5 })],
    ['files is an object', JSON.stringify({ files: {} })],
    ['registryDependencies is a number', JSON.stringify({ registryDependencies: 5, files: [] })],
    ['registryDependencies is an object', JSON.stringify({ registryDependencies: {}, files: [] })],
  ])('add fails in words when an item is malformed: %s', async (_label, body) => {
    overrides.set('toast.json', { body });
    expectCleanFailure(await run(['add', 'toast']));
    expect(existsSync(install())).toBe(false);
  });

  it.each([
    ['an empty object', '{}'],
    ['an array', '[]'],
    ['a string', '"hello"'],
  ])('add does not report success when an item has no file list: %s', async (_label, body) => {
    overrides.set('toast.json', { body });
    expectCleanFailure(await run(['add', 'toast']));
  });

  it('add does not treat the index file as a component', async () => {
    expectCleanFailure(await run(['add', 'registry']));
  });

  it.each([
    ['null', 'null'],
    ['a number', '5'],
    ['items is a string', JSON.stringify({ items: 'abc' })],
    ['an item with no name', JSON.stringify({ items: [{}] })],
    ['a null item', JSON.stringify({ items: [null] })],
  ])('list fails in words when the index is malformed: %s', async (_label, body) => {
    overrides.set('registry.json', { body });
    expectCleanFailure(await run(['list']));
  });

  it.each([
    ['an HTML page with a 200', { body: '<!doctype html><title>spa</title>', type: 'text/html' }],
    ['a truncated body', { body: '{"name":"toast","files":[{"tar' }],
    ['a 500', { status: 500, body: 'boom' }],
    ['a 404', { status: 404, body: '' }],
  ])('add fails in words on %s', async (_label, reply) => {
    overrides.set('toast.json', reply);
    expectCleanFailure(await run(['add', 'toast']));
    expect(existsSync(install())).toBe(false);
  });

  it('terminates on a dependency cycle', async () => {
    overrides.set('toast.json', item({ registryDependencies: ['button'], files: good('toast', 'a.tsx') }));
    overrides.set('button.json', item({ registryDependencies: ['toast'], files: good('button', 'b.tsx') }));
    const result = await run(['add', 'toast']);
    expect(result.code).toBe(0);
    expect(existsSync(install('toast/a.tsx'))).toBe(true);
    expect(existsSync(install('button/b.tsx'))).toBe(true);
  });

  it('fails in words on a target the file system cannot hold (NUL byte), writing nothing', async () => {
    overrides.set('toast.json', item({ files: [...good('toast', 'a.tsx'), { target: 'src/components/webstylebook/toast/b\u0000.tsx', content: 'x' }] }));
    expectCleanFailure(await run(['add', 'toast']));
    expect(allFiles(install())).toEqual([]);
  });
});

describe('paths a registry item must not reach', () => {
  it.each([
    'src/components/webstylebook/../../../evil.ts',
    'src/components/webstylebook/a/../../../../evil.ts',
    'src/components/webstylebook/./evil.ts',
    'src/components/webstylebook/',
    'src/components/webstylebook',
    'src/components/webstylebook/..',
    'src/components/webstylebook//tmp/evil.ts',
    'src/components/webstylebook/..\\..\\evil.ts',
    'src/components/webstylebookEVIL/evil.ts',
    '../evil.ts',
    '/tmp/webstylebook-review-evil.ts',
    'package.json',
  ])('refuses %s', async (target) => {
    overrides.set('toast.json', item({ files: [{ target, content: 'x' }] }));
    const result = await run(['add', 'toast']);
    expectCleanFailure(result);
    expect(result.stderr).toContain('invalid file');
    expect(allFiles(project).map((path) => path.replace(project, ''))).toEqual(['/package.json']);
  });

  it('writes nothing when a later file in the item is bad', async () => {
    overrides.set('toast.json', item({ files: [...good('toast', 'a.tsx'), { target: '../evil.ts', content: 'x' }] }));
    expectCleanFailure(await run(['add', 'toast']));
    expect(allFiles(install())).toEqual([]);
  });

  it('writes nothing when a dependency holds a bad file', async () => {
    overrides.set('theme.json', item({ files: [{ target: 'src/components/webstylebook/../evil.css', content: 'x' }] }));
    expectCleanFailure(await run(['add', 'toast']));
    expect(allFiles(install())).toEqual([]);
  });

  it.each([
    ['a bare parent reference', '..'],
    ['a query string', 'button?x=1'],
    ['an uppercase name', 'https://evil.test/r/BUTTON.json'],
  ])('refuses a dependency named with %s', async (_label, dependency) => {
    overrides.set('toast.json', item({ registryDependencies: [dependency], files: [] }));
    expectCleanFailure(await run(['add', 'toast']));
  });
});

describe('partly installed folders', () => {
  it('fails in words, writing nothing, when a file sits where a component folder must go', async () => {
    mkdirSync(install(), { recursive: true });
    writeFileSync(install('toast'), 'a file, not a folder');
    const result = await run(['add', 'button', 'toast']);
    expectCleanFailure(result);
    expect(existsSync(install('button/button.tsx'))).toBe(false);
    expect(existsSync(install('theme.css'))).toBe(false);
  });

  it('fails in words when a folder sits where a file must go', async () => {
    mkdirSync(install('theme.css'), { recursive: true });
    expectCleanFailure(await run(['add', 'button']));
    expect(existsSync(install('button/button.tsx'))).toBe(false);
  });

  it('fails in words, writing nothing, when the install folder is read-only', async () => {
    mkdirSync(install('toast'), { recursive: true });
    chmodSync(install('toast'), 0o555);
    try {
      const result = await run(['add', 'button', 'toast']);
      expectCleanFailure(result);
      expect(existsSync(install('button/button.tsx'))).toBe(false);
    } finally {
      chmodSync(install('toast'), 0o755);
    }
  });

  it('restores a missing file next to an untouched one', async () => {
    await run(['add', 'toast']);
    rmSync(install('toast/toast.css'));
    const before = readFileSync(install('toast/toast.tsx'), 'utf8');
    const result = await run(['add', 'toast']);
    expect(result.code).toBe(0);
    expect(result.stdout).toContain('+ toast/toast.css');
    expect(result.stdout).toContain('= toast/toast.tsx');
    expect(readFileSync(install('toast/toast.tsx'), 'utf8')).toBe(before);
  });

  it('does not restore the missing half when the other half was edited', async () => {
    await run(['add', 'toast']);
    rmSync(install('toast/toast.css'));
    writeFileSync(install('toast/toast.tsx'), '// mine');
    expectCleanFailure(await run(['add', 'toast']));
    expect(existsSync(install('toast/toast.css'))).toBe(false);
    expect(readFileSync(install('toast/toast.tsx'), 'utf8')).toBe('// mine');
  });

  it('--overwrite leaves other installed components alone', async () => {
    await run(['add', 'button', 'toast']);
    writeFileSync(install('button/button.tsx'), '// mine');
    writeFileSync(install('toast/toast.tsx'), '// mine too');
    expect((await run(['add', 'toast', '--overwrite'])).code).toBe(0);
    expect(readFileSync(install('button/button.tsx'), 'utf8')).toBe('// mine');
    expect(readFileSync(install('toast/toast.tsx'), 'utf8')).not.toBe('// mine too');
  });
});

describe('odd working directories', () => {
  it('works from a path with spaces, Hangul, and URL characters', async () => {
    const odd = join(project, '내 프로젝트 #1 100%');
    mkdirSync(join(odd, 'src'), { recursive: true });
    writeFileSync(join(odd, 'package.json'), JSON.stringify({ dependencies: { react: '19.0.0' } }));
    const result = await run(['add', 'toast'], { cwd: odd });
    expect(result.code).toBe(0);
    expect(existsSync(join(odd, 'src/components/webstylebook/toast/toast.tsx'))).toBe(true);
  });

  it('fails in words when src is a file', async () => {
    rmSync(join(project, 'src'), { recursive: true });
    writeFileSync(join(project, 'src'), 'not a folder');
    expectCleanFailure(await run(['add', 'button']));
  });

  it('fails in words when --dir names a file', async () => {
    expectCleanFailure(await run(['add', 'button', '--dir', 'package.json']));
    expect(JSON.parse(readFileSync(join(project, 'package.json'), 'utf8'))).toEqual({ dependencies: { react: '^19.0.0' } });
  });

  it('honors an absolute --dir', async () => {
    const elsewhere = mkdtempSync(join(tmpdir(), 'webstylebook-review-dir-'));
    cleanup.push(elsewhere);
    expect((await run(['add', 'button', '--dir', elsewhere])).code).toBe(0);
    expect(existsSync(join(elsewhere, 'button/button.tsx'))).toBe(true);
  });
});

describe('unusual package.json', () => {
  const manifest = (text: string) => writeFileSync(join(project, 'package.json'), text);

  it('accepts a manifest saved with a byte order mark, as npm does', async () => {
    manifest(`\uFEFF${JSON.stringify({ dependencies: { react: '^19.0.0' } })}`);
    const result = await run(['add', 'button']);
    expect(result.stderr).toBe('');
    expect(result.code).toBe(0);
    expect(existsSync(install('button/button.tsx'))).toBe(true);
  });

  it('fails in words, before writing, when the manifest is the JSON value null', async () => {
    manifest('null');
    expectCleanFailure(await run(['add', 'button']));
    expect(existsSync(install('button/button.tsx'))).toBe(false);
  });

  it.each(['latest', 'next', 'workspace:*', 'catalog:', '*', 'npm:react@^19.0.0', 'git+https://example.test/react.git'])(
    'does not warn about a React range it cannot read as older: %s',
    async (range) => {
      manifest(JSON.stringify({ dependencies: { react: range } }));
      const result = await run(['add', 'button']);
      expect(result.code).toBe(0);
      expect(result.stderr).toBe('');
    },
  );

  it('still installs and warns when React is absent', async () => {
    manifest('{}');
    const result = await run(['add', 'button']);
    expect(result.code).toBe(0);
    expect(result.stderr).toContain('react is not in package.json');
    expect(existsSync(install('button/button.tsx'))).toBe(true);
  });

  it('reports a broken manifest without a stack, before any request', async () => {
    manifest('{ not json');
    const result = await run(['add', 'button']);
    expectCleanFailure(result);
    expect(result.stderr).toContain('package.json is not valid JSON');
  });
});

describe('reaching the registry', () => {
  // A host with several addresses fails with an AggregateError whose message is
  // empty, and webstylebook.com has several. A closed port on localhost is the
  // same shape.
  it('names the reason when every address of a host refuses the connection', async () => {
    const closed = createServer();
    await new Promise<void>((done) => closed.listen(0, '127.0.0.1', done));
    const { port } = closed.address() as AddressInfo;
    await new Promise((done) => closed.close(done));
    const result = await run(['add', 'button'], { registry: `http://localhost:${port}/r` });
    expectCleanFailure(result);
    expect(result.stderr.trim()).not.toMatch(/:\s*$/);
  });

  it('names the reason when the address cannot be parsed', async () => {
    const result = await run(['add', 'button'], { registry: 'not a url' });
    expectCleanFailure(result);
    expect(result.stderr).toContain('not a url');
  });

  it('accepts a registry address with trailing slashes', async () => {
    expect((await run(['add', 'button'], { registry: `${registry}///` })).code).toBe(0);
    expect(existsSync(install('button/button.tsx'))).toBe(true);
  });
});
