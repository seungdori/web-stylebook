#!/usr/bin/env node
// Copies Web Stylebook components into a project. No dependencies: it reads the
// item files published at /r and writes their source next to your code.

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { parseArgs } from 'node:util';

const DEFAULT_REGISTRY = 'https://webstylebook.com/r';
const DOCS = 'https://webstylebook.com/pages/components';
// Each file's target starts with this. What follows is its path inside the
// install folder, so the kit's relative imports keep working.
const TARGET_PREFIX = 'src/components/webstylebook/';
const REQUEST_TIMEOUT_MS = 15000;

const HELP = `Copy Web Stylebook components into your project.

Usage
  npx webstylebook add <component...>   Add components and the theme
  npx webstylebook list                 Show every component

Options
  --dir <path>       Install folder. Default: src/components/webstylebook,
                     or components/webstylebook in a project with no src folder
  --overwrite        Replace files of the named components that you changed
  --registry <url>   Read components from another address
  -h, --help         Show this help
  -v, --version      Show the version

Docs: ${DOCS}
`;

/** A problem the person running the command can fix. Printed without a stack. */
class UserError extends Error {}

/** @param {unknown} error */
function asRecord(error) {
  return typeof error === 'object' && error !== null ? /** @type {Record<string, unknown>} */ (error) : {};
}

/** @param {unknown} error */
function errorMessage(error) {
  const message = asRecord(error).message;
  return typeof message === 'string' ? message : String(error);
}

async function getJson(url, notFoundMessage) {
  let response;
  try {
    response = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  } catch (error) {
    const failure = asRecord(error);
    if (failure.name === 'TimeoutError') throw new UserError(`${url} timed out.`);
    // A host with several addresses fails with an AggregateError and no message.
    const cause = asRecord(failure.cause);
    const detail = (typeof cause.code === 'string' && cause.code) || (typeof cause.message === 'string' && cause.message) || errorMessage(error);
    throw new UserError(`Could not reach ${url}: ${detail}`);
  }
  if (response.status === 404 && notFoundMessage) throw new UserError(notFoundMessage);
  if (!response.ok) throw new UserError(`${url} returned ${response.status}.`);
  try {
    return await response.json();
  } catch (error) {
    throw new UserError(asRecord(error).name === 'TimeoutError' ? `${url} timed out.` : `${url} did not return valid JSON.`);
  }
}

/** The named items and everything they depend on, each once. */
async function collectItems(names, registry) {
  const items = new Map();

  async function visit(name) {
    if (items.has(name)) return;
    if (!/^[a-z0-9-]+$/.test(name)) throw new UserError(`"${name}" is not a component name.`);
    items.set(name, null);
    const unknown = `Unknown component "${name}". Run "npx webstylebook list" to see them all.`;
    const item = await getJson(`${registry}/${name}.json`, unknown);
    // /r/registry.json is a real file too, and it is not a component.
    if (!Array.isArray(item?.files) || item.files.length === 0) throw new UserError(unknown);
    const dependencies = item.registryDependencies ?? [];
    if (!Array.isArray(dependencies)) throw new UserError(`The registry sent invalid dependencies for "${name}".`);
    items.set(name, item);
    // Dependencies resolve against this registry, so an item cannot send the
    // command to another host.
    for (const url of dependencies) await visit((String(url).split('/').pop() ?? '').replace(/\.json$/, ''));
  }

  for (const name of names) await visit(name);
  return [...items.entries()].map(([name, item]) => ({ name, item }));
}

/** Backslash or a control character. Either one can escape the install folder or hide the path. */
function isUnsafePath(value) {
  if (value.includes('\\')) return true;
  for (let index = 0; index < value.length; index += 1) {
    if (value.charCodeAt(index) <= 31) return true;
  }
  return false;
}

/** A registry file's path inside the install folder. Rejects anything that could leave it. */
function insidePath(file, itemName) {
  const target = file?.target;
  const valid =
    typeof target === 'string' &&
    typeof file.content === 'string' &&
    target.startsWith(TARGET_PREFIX) &&
    !isUnsafePath(target) &&
    target.slice(TARGET_PREFIX.length).split('/').every((part) => part !== '' && part !== '.' && part !== '..' && part.length <= 255);
  if (!valid) throw new UserError(`The registry sent an invalid file for "${itemName}": ${String(target)}`);
  return target.slice(TARGET_PREFIX.length);
}

/** Decides what happens to each file before anything is written. */
function planFiles(collected, requested, root, overwrite) {
  const files = [];
  const conflicts = [];
  for (const { name, item } of collected) {
    for (const file of item.files) {
      const path = insidePath(file, name);
      const destination = join(root, path);
      let action = 'add';
      if (existsSync(destination)) {
        const same = readFileSync(destination, 'utf8') === file.content;
        // The theme is the one dependency meant to hold your edits. Other
        // shared code must match the components that import it.
        if (same) action = 'unchanged';
        else if (name === 'theme' && !requested.has('theme')) action = 'keep';
        else if (overwrite) action = 'replace';
        else conflicts.push(path);
      }
      files.push({ path, destination, content: file.content, action });
    }
  }
  return { files, conflicts };
}

function warnAboutReact(manifest) {
  const version = manifest.dependencies?.react ?? manifest.peerDependencies?.react ?? manifest.devDependencies?.react;
  if (!version) {
    console.warn('Warning: react is not in package.json. These components need React 19.');
    return;
  }
  const major = Number(/\d+/.exec(version)?.[0]);
  if (major < 19) console.warn(`Warning: these components need React 19. This project has react ${version}.`);
}

function readManifest(cwd) {
  const path = join(cwd, 'package.json');
  if (!existsSync(path)) throw new UserError('No package.json here. Run this from your project folder.');
  let manifest;
  try {
    // Some editors save a byte-order mark. npm accepts it, so this does too.
    manifest = JSON.parse(readFileSync(path, 'utf8').replace(/^\uFEFF/, ''));
  } catch {
    throw new UserError('package.json is not valid JSON.');
  }
  if (typeof manifest !== 'object' || manifest === null) throw new UserError('package.json is not a JSON object.');
  return manifest;
}

/** Writes every file, or puts everything back and reports what stopped it. */
function writeAll(files) {
  const undo = [];
  let current;
  try {
    for (const file of files) {
      if (file.action !== 'add' && file.action !== 'replace') continue;
      current = file;
      const before = file.action === 'replace' ? readFileSync(file.destination) : null;
      const firstNewFolder = mkdirSync(dirname(file.destination), { recursive: true });
      if (firstNewFolder) undo.push({ path: firstNewFolder, run: () => rmSync(firstNewFolder, { recursive: true, force: true }) });
      // A failed write may leave part of a file, or nothing changed at all.
      // Each step checks first, so it never rewrites a file it cannot touch.
      undo.push({
        path: file.path,
        run: () => {
          if (before === null) {
            if (existsSync(file.destination)) rmSync(file.destination);
          } else if (!readFileSync(file.destination).equals(before)) {
            writeFileSync(file.destination, before);
          }
        },
      });
      writeFileSync(file.destination, file.content);
    }
  } catch (error) {
    const failure = asRecord(error);
    if (typeof failure.syscall !== 'string') throw error;
    // Undo in reverse: files come back before their new folders go. One step
    // that fails must not stop the others.
    const stuck = [];
    for (const step of undo.reverse()) {
      try {
        step.run();
      } catch {
        stuck.push(step.path);
      }
    }
    const outcome = stuck.length ? `These could not be restored:\n${stuck.map((path) => `  ${path}`).join('\n')}` : 'Nothing was changed.';
    const code = typeof failure.code === 'string' ? failure.code : 'unknown';
    throw new UserError(`Could not write ${current.path} (${code}). ${outcome}`);
  }
}

const SYMBOL = { add: '+', replace: '~', unchanged: '=', keep: '=' };

async function add(names, options, registry) {
  if (!names.length) throw new UserError('Name at least one component: npx webstylebook add toast');
  const cwd = process.cwd();
  const manifest = readManifest(cwd);
  const root = resolve(cwd, options.dir ?? (existsSync(join(cwd, 'src')) ? 'src/components/webstylebook' : 'components/webstylebook'));

  const collected = await collectItems(names, registry);
  const { files, conflicts } = planFiles(collected, new Set(names), root, options.overwrite);

  if (conflicts.length) {
    throw new UserError(
      `These files already exist and differ from the registry:\n${conflicts.map((path) => `  ${path}`).join('\n')}\nNothing was written. Use --overwrite to replace them.`,
    );
  }

  writeAll(files);

  console.log(`\n${relative(cwd, root) || '.'}`);
  for (const file of files) console.log(`  ${SYMBOL[file.action]} ${file.path}${file.action === 'keep' ? ' (kept your version)' : ''}`);
  warnAboutReact(manifest);
  if (files.some((file) => file.path === 'theme.css' && file.action === 'add')) {
    console.log(`\nNext, load the fonts and import a component: ${DOCS}/getting-started`);
  }
}

async function list(registry) {
  const index = await getJson(`${registry}/registry.json`);
  const all = index?.items;
  if (!Array.isArray(all) || !all.length || !all.every((item) => typeof item?.name === 'string')) {
    throw new UserError(`${registry}/registry.json is not a component list.`);
  }
  // These install with the components that need them.
  const items = all.filter((item) => !['theme', 'overlay'].includes(item.name));
  const width = Math.max(...items.map((item) => item.name.length));
  for (const item of items) console.log(`${item.name.padEnd(width)}  ${item.description ?? ''}`);
}

async function main() {
  let parsed;
  try {
    parsed = parseArgs({
      allowPositionals: true,
      options: {
        dir: { type: 'string' },
        overwrite: { type: 'boolean', default: false },
        registry: { type: 'string' },
        help: { type: 'boolean', short: 'h', default: false },
        version: { type: 'boolean', short: 'v', default: false },
      },
    });
  } catch (error) {
    throw new UserError(`${errorMessage(error)}\nRun "npx webstylebook --help" for the options.`);
  }

  const { values, positionals } = parsed;
  const [command, ...names] = positionals;
  const registry = (values.registry ?? DEFAULT_REGISTRY).replace(/\/+$/, '');

  if (values.version) {
    console.log(JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version);
  } else if (values.help || !command) {
    console.log(HELP);
  } else if (command === 'add') {
    await add(names, values, registry);
  } else if (command === 'list') {
    await list(registry);
  } else {
    throw new UserError(`Unknown command "${command}". Run "npx webstylebook --help".`);
  }
}

main().catch((error) => {
  // A blocked path or missing permission is the user's to fix, not a crash.
  const message = error instanceof UserError ? error.message : error.syscall ? `Could not access ${error.path ?? 'the current folder'} (${error.code}).` : null;
  if (message === null) throw error;
  console.error(`Error: ${message}`);
  process.exitCode = 1;
});
