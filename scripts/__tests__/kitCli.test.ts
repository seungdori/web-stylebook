import { execFile } from 'node:child_process';
import { chmodSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { buildKitRegistry } from '../build-kit-registry.mts';

const CLI = resolve(process.cwd(), 'packages/cli/bin/webstylebook.mjs');
const kitFile = (path: string) => readFileSync(resolve(process.cwd(), 'src/kit', path), 'utf8');

let server: Server;
let registry: string;
let files: Map<string, string>;
const overrides = new Map<string, string>();
const requests: string[] = [];

beforeAll(async () => {
  server = createServer((request, response) => {
    const name = (request.url ?? '').replace('/r/', '');
    requests.push(name);
    const body = overrides.get(name) ?? files.get(name);
    response.writeHead(body ? 200 : 404, { 'Content-Type': 'application/json' });
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

beforeEach(() => {
  project = mkdtempSync(join(tmpdir(), 'webstylebook-cli-'));
  mkdirSync(join(project, 'src'));
  writeFileSync(join(project, 'package.json'), JSON.stringify({ dependencies: { react: '^19.0.0' } }));
  overrides.clear();
  requests.length = 0;
});

afterEach(() => {
  rmSync(project, { recursive: true, force: true });
});

function run(...args: string[]) {
  return new Promise<{ code: number; stdout: string; stderr: string }>((done) => {
    execFile(process.execPath, [CLI, ...args, '--registry', registry], { cwd: project }, (error, stdout, stderr) => {
      done({ code: error ? Number(error.code) : 0, stdout, stderr });
    });
  });
}

const installed = (path: string) => join(project, 'src/components/webstylebook', path);

describe('webstylebook add', () => {
  it('copies a component and the theme, unchanged from the source', async () => {
    const result = await run('add', 'toast');
    expect(result.code).toBe(0);
    expect(readFileSync(installed('toast/toast.tsx'), 'utf8')).toBe(kitFile('toast/toast.tsx'));
    expect(readFileSync(installed('toast/toast.css'), 'utf8')).toBe(kitFile('toast/toast.css'));
    expect(readFileSync(installed('theme.css'), 'utf8')).toBe(kitFile('theme.css'));
  });

  it('fetches a shared dependency once for several components', async () => {
    await run('add', 'toast', 'tooltip');
    expect(requests.filter((name) => name === 'theme.json')).toHaveLength(1);
    expect(existsSync(installed('tooltip/tooltip.tsx'))).toBe(true);
  });

  it('uses components/webstylebook in a project with no src folder', async () => {
    rmSync(join(project, 'src'), { recursive: true });
    await run('add', 'button');
    expect(existsSync(join(project, 'components/webstylebook/button/button.tsx'))).toBe(true);
  });

  it('honors --dir', async () => {
    await run('add', 'button', '--dir', 'lib/ui');
    expect(existsSync(join(project, 'lib/ui/button/button.tsx'))).toBe(true);
    expect(existsSync(join(project, 'lib/ui/theme.css'))).toBe(true);
  });

  it('writes nothing at all when one requested file would be replaced', async () => {
    mkdirSync(installed('toast'), { recursive: true });
    writeFileSync(installed('toast/toast.tsx'), '// mine');
    const result = await run('add', 'button', 'toast');
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('toast/toast.tsx');
    expect(result.stderr).toContain('--overwrite');
    expect(existsSync(installed('button/button.tsx'))).toBe(false);
    expect(readFileSync(installed('toast/toast.tsx'), 'utf8')).toBe('// mine');
  });

  it('--overwrite replaces the named component', async () => {
    mkdirSync(installed('toast'), { recursive: true });
    writeFileSync(installed('toast/toast.tsx'), '// mine');
    expect((await run('add', 'toast', '--overwrite')).code).toBe(0);
    expect(readFileSync(installed('toast/toast.tsx'), 'utf8')).toBe(kitFile('toast/toast.tsx'));
  });

  it('keeps an edited theme when adding another component, even with --overwrite', async () => {
    await run('add', 'button');
    writeFileSync(installed('theme.css'), ':root { --ws-color-accent: red; }');
    const later = await run('add', 'toast');
    expect(later.code).toBe(0);
    expect(later.stdout).toContain('kept your version');
    await run('add', 'toast', '--overwrite');
    expect(readFileSync(installed('theme.css'), 'utf8')).toContain('red');
  });

  it('replaces the theme only when the theme itself is named', async () => {
    await run('add', 'button');
    writeFileSync(installed('theme.css'), '/* mine */');
    await run('add', 'theme', '--overwrite');
    expect(readFileSync(installed('theme.css'), 'utf8')).toBe(kitFile('theme.css'));
  });

  // Root ignores file permissions, so this cannot fail a write there.
  it.skipIf(process.getuid?.() === 0)('restores every file when a read-only file stops the install', async () => {
    await run('add', 'button');
    writeFileSync(installed('button/button.tsx'), '// my button');
    mkdirSync(installed('toast'));
    writeFileSync(installed('toast/toast.tsx'), '// my toast');
    chmodSync(installed('toast/toast.tsx'), 0o444);
    const result = await run('add', 'button', 'toast', '--overwrite');
    chmodSync(installed('toast/toast.tsx'), 0o644);
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Nothing was changed');
    expect(readFileSync(installed('button/button.tsx'), 'utf8')).toBe('// my button');
    expect(readFileSync(installed('toast/toast.tsx'), 'utf8')).toBe('// my toast');
  });

  it.skipIf(process.getuid?.() === 0)('removes what it added when a read-only file stops a fresh install', async () => {
    mkdirSync(installed('toast'), { recursive: true });
    writeFileSync(installed('toast/toast.tsx'), '// my toast');
    chmodSync(installed('toast/toast.tsx'), 0o444);
    const result = await run('add', 'button', 'toast', '--overwrite');
    chmodSync(installed('toast/toast.tsx'), 0o644);
    expect(result.code).toBe(1);
    expect(existsSync(installed('button'))).toBe(false);
    expect(existsSync(installed('theme.css'))).toBe(false);
  });

  it('stops on an older shared overlay, and --overwrite updates it', async () => {
    mkdirSync(installed('overlay'), { recursive: true });
    writeFileSync(installed('overlay/overlay.tsx'), '// older');
    const blocked = await run('add', 'tooltip');
    expect(blocked.code).toBe(1);
    expect(blocked.stderr).toContain('overlay/overlay.tsx');
    expect((await run('add', 'tooltip', '--overwrite')).code).toBe(0);
    expect(readFileSync(installed('overlay/overlay.tsx'), 'utf8')).toBe(kitFile('overlay/overlay.tsx'));
  });

  it('installs the shared overlay with the components that use it', async () => {
    expect((await run('add', 'select')).code).toBe(0);
    expect(readFileSync(installed('overlay/overlay.tsx'), 'utf8')).toBe(kitFile('overlay/overlay.tsx'));
  });

  it('leaves identical files alone on a second run', async () => {
    await run('add', 'toast');
    const second = await run('add', 'toast');
    expect(second.code).toBe(0);
    expect(second.stdout).toContain('= toast/toast.tsx');
  });

  it('names an unknown component', async () => {
    const result = await run('add', 'nope');
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Unknown component "nope"');
  });

  it('rejects a bad name before any request', async () => {
    const result = await run('add', '../secret');
    expect(result.code).toBe(1);
    expect(requests).toHaveLength(0);
  });

  it.each(['src/components/webstylebook/../../evil.ts', 'src/components/webstylebook//etc/evil', '/etc/evil', 'src/components/webstylebook/a\\..\\b'])(
    'refuses a registry file aimed outside the folder: %s',
    async (target) => {
      overrides.set('toast.json', JSON.stringify({ name: 'toast', files: [{ target, content: 'x' }] }));
      const result = await run('add', 'toast');
      expect(result.code).toBe(1);
      expect(result.stderr).toContain('invalid file');
      expect(existsSync(join(project, 'evil.ts'))).toBe(false);
    },
  );

  it('resolves dependencies on its own registry, never a host named in an item', async () => {
    const file = { target: 'src/components/webstylebook/toast/toast.tsx', content: '// x' };
    overrides.set('toast.json', JSON.stringify({ name: 'toast', registryDependencies: ['https://evil.test/r/button.json'], files: [file] }));
    expect((await run('add', 'toast')).code).toBe(0);
    expect(requests).toContain('button.json');
  });

  it('stops outside a project', async () => {
    rmSync(join(project, 'package.json'));
    const result = await run('add', 'toast');
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('No package.json');
    expect(requests).toHaveLength(0);
  });

  it('warns about an older React and still installs', async () => {
    writeFileSync(join(project, 'package.json'), JSON.stringify({ dependencies: { react: '^18.3.1' } }));
    const result = await run('add', 'button');
    expect(result.code).toBe(0);
    expect(result.stderr).toContain('React 19');
  });

  it('asks for a name when none is given', async () => {
    const result = await run('add');
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('Name at least one component');
  });
});

describe('webstylebook list and help', () => {
  it('lists components but not the theme', async () => {
    const result = await run('list');
    expect(result.stdout).toContain('rolling-number');
    expect(result.stdout).not.toMatch(/^theme\b/m);
    expect(result.stdout).not.toMatch(/^overlay\b/m);
    expect(result.stdout).not.toMatch(/^field\b/m);
  });

  it('prints help with no command', async () => {
    expect((await run()).stdout).toContain('npx webstylebook add');
  });

  it('prints the package version', async () => {
    const version = JSON.parse(readFileSync(resolve(process.cwd(), 'packages/cli/package.json'), 'utf8')).version;
    expect((await run('--version')).stdout.trim()).toBe(version);
  });

  it('reports an unknown command and an unknown option', async () => {
    expect((await run('remove')).stderr).toContain('Unknown command');
    const result = await run('add', 'toast', '--nope');
    expect(result.code).toBe(1);
    expect(result.stderr).toContain('--help');
  });
});
