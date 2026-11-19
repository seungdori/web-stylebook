/**
 * Screenshots of the style pages for the home page's band and shelves.
 *
 * When to rerun: after a style page changes (src/ported/pages/<id>.tsx, its CSS, or its copy) and
 * after a style is added. `npm run shots` captures all of them; `npm run shots -- <id> <id>` only
 * the ones named. Commit the images it writes.
 *
 * What it does: opens /pages/<id> in English at 1280x800 with the shell strip and the page
 * navigation hidden, waits for fonts and images, scrolls once through the first 1600px so
 * scroll-triggered entrances finish, and captures the top 1280x1600 of the page. It writes
 * public/shots/<id>-640.webp for every style, and public/shots/<id>-1280.webp only for the twelve
 * styles on the home page's hero band (BAND_STYLE_IDS in src/pages/home/shots.ts); a 1280px file
 * left over for any other style is removed. Chromium encodes the WebP files through a canvas,
 * so no image tool is needed.
 *
 * Browser: playwright-core is not a dependency of this repo, and this script installs nothing.
 * It loads playwright-core from this repo's node_modules if present, otherwise from the
 * node_modules folder named in PLAYWRIGHT_CORE_DIR, and uses the Chromium that playwright-core
 * keeps in its own cache (`npx playwright-core install chromium` on a new machine).
 * Server: SHOTS_BASE_URL, else http://localhost:5199 if it answers, else a Vite dev server this
 * script starts on port 5198 and stops when it is done.
 */
import { spawn, type ChildProcess } from 'node:child_process';
import { mkdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { styleCatalog } from '../src/data/styles';
import { hasLargeShot } from '../src/pages/home/shots';

const WIDTH = 1280;
const VIEWPORT_HEIGHT = 800;
const CAPTURE_HEIGHT = 1600;
const QUALITY = Number(process.env.SHOTS_QUALITY ?? '0.72');
const HIDDEN = '.workspace-entry,.skip-link,.page-back-link,.page-nav,.fusion-shell__back,.fusion-shell__pagenav';
const OUT_DIR = resolve('public/shots');
const OWN_PORT = 5198;

/* The small part of the playwright-core API this script uses. */
interface Page {
  goto(url: string, options: { waitUntil: 'networkidle' | 'load'; timeout?: number }): Promise<unknown>;
  waitForSelector(selector: string, options: { timeout: number }): Promise<unknown>;
  addStyleTag(options: { content: string }): Promise<unknown>;
  /* In-page code is passed as a string: tsx would wrap a function's inner helpers in its own __name(). */
  evaluate<R>(expression: string): Promise<R>;
  screenshot(options: { clip: { x: number; y: number; width: number; height: number }; fullPage: boolean; type: 'png' }): Promise<Buffer>;
  on(event: 'pageerror', listener: (error: Error) => void): void;
  close(): Promise<void>;
}
interface Context {
  newPage(): Promise<Page>;
  addInitScript(script: string): Promise<void>;
  close(): Promise<void>;
}
interface Browser {
  newContext(options: Record<string, unknown>): Promise<Context>;
  close(): Promise<void>;
}
interface PlaywrightCore {
  chromium: { launch(options: { headless: boolean }): Promise<Browser> };
}

function loadPlaywright(): PlaywrightCore {
  const places = [resolve('package.json'), process.env.PLAYWRIGHT_CORE_DIR ? join(resolve(process.env.PLAYWRIGHT_CORE_DIR), 'noop.js') : null];
  for (const place of places) {
    if (!place) continue;
    try {
      return createRequire(place)('playwright-core') as PlaywrightCore;
    } catch {
      /* Try the next place. */
    }
  }
  throw new Error('playwright-core was not found. Set PLAYWRIGHT_CORE_DIR to a node_modules folder that contains it, for example PLAYWRIGHT_CORE_DIR=~/some-project/node_modules npm run shots');
}

async function answers(url: string) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
    return response.ok;
  } catch {
    return false;
  }
}

async function startServer(): Promise<{ base: string; server?: ChildProcess }> {
  const wanted = process.env.SHOTS_BASE_URL ?? 'http://localhost:5199';
  if (await answers(wanted)) return { base: wanted.replace(/\/$/, '') };
  if (process.env.SHOTS_BASE_URL) throw new Error(`SHOTS_BASE_URL ${wanted} does not answer`);
  const base = `http://127.0.0.1:${OWN_PORT}`;
  const server = spawn(process.execPath, [resolve('node_modules/vite/bin/vite.js'), '--host', '127.0.0.1', '--port', String(OWN_PORT), '--strictPort'], { stdio: 'ignore' });
  for (let attempt = 0; attempt < 120; attempt += 1) {
    if (await answers(base)) return { base, server };
    await delay(250);
  }
  server.kill();
  throw new Error(`The Vite dev server did not start on ${base}`);
}

/* Runs in the page: scroll through the captured area once, return to the top, and wait until
   every image there has loaded and decoded. */
async function settle(page: Page) {
  await page.evaluate(`(async (height) => {
    const wait = (ms) => new Promise((done) => setTimeout(done, ms));
    for (let y = 0; y <= height; y += 400) {
      window.scrollTo(0, y);
      await wait(160);
    }
    window.scrollTo(0, 0);
    await document.fonts.ready;
    const images = [...document.images].filter((image) => image.getBoundingClientRect().top < height && getComputedStyle(image).display !== 'none');
    await Promise.all(images.map((image) => (image.complete ? null : new Promise((done) => {
      image.addEventListener('load', done, { once: true });
      image.addEventListener('error', done, { once: true });
    }))));
    await Promise.all(images.map((image) => image.decode().catch(() => null)));
    await wait(900);
  })(${CAPTURE_HEIGHT})`);
}

/* Runs in a blank page: decode the PNG and encode the requested WebP widths on canvases. */
async function encode(encoder: Page, png: Buffer, sizes: number[]) {
  return encoder.evaluate<Record<string, string>>(`(async (source, quality, width, height, sizes) => {
    const image = new Image();
    image.src = 'data:image/png;base64,' + source;
    await image.decode();
    const out = {};
    for (const size of sizes) {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = Math.round((height * size) / width);
      const context = canvas.getContext('2d');
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const url = canvas.toDataURL('image/webp', quality);
      if (!url.startsWith('data:image/webp')) throw new Error('This Chromium cannot encode WebP');
      out[size] = url.slice(url.indexOf(',') + 1);
    }
    return out;
  })('${png.toString('base64')}', ${QUALITY}, ${WIDTH}, ${CAPTURE_HEIGHT}, ${JSON.stringify(sizes)})`);
}

const requested = process.argv.slice(2).filter((arg) => !arg.startsWith('-'));
const known = new Set(styleCatalog.map((style) => style.id));
const unknown = requested.filter((id) => !known.has(id));
if (unknown.length) throw new Error(`Unknown style id: ${unknown.join(', ')}`);
const ids = requested.length ? requested : styleCatalog.map((style) => style.id);

const { chromium } = loadPlaywright();
const { base, server } = await startServer();
const browser = await chromium.launch({ headless: true });
let total = 0;
let files = 0;
try {
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: VIEWPORT_HEIGHT },
    deviceScaleFactor: 1,
    locale: 'en-US',
    colorScheme: 'light',
    reducedMotion: 'no-preference',
  });
  await context.addInitScript("try { localStorage.removeItem('webstylebook.lang'); } catch { /* Storage may be blocked. */ }");
  const encoder = await context.newPage();
  await encoder.goto("about:blank", { waitUntil: "load" });
  mkdirSync(OUT_DIR, { recursive: true });

  for (const id of ids) {
    const page = await context.newPage();
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`${base}/pages/${id}`, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForSelector('.ported-style-page, .style-experience', { timeout: 30000 });
    await page.addStyleTag({ content: `${HIDDEN} { display: none !important; }` });
    await settle(page);
    const height = await page.evaluate<number>('document.documentElement.scrollHeight');
    if (height < CAPTURE_HEIGHT) throw new Error(`${id} is only ${height}px tall`);
    const png = await page.screenshot({ clip: { x: 0, y: 0, width: WIDTH, height: CAPTURE_HEIGHT }, fullPage: true, type: 'png' });
    const large = hasLargeShot(id);
    const webp = await encode(encoder, png, large ? [WIDTH, WIDTH / 2] : [WIDTH / 2]);
    if (!large) rmSync(join(OUT_DIR, `${id}-${WIDTH}.webp`), { force: true });
    const sizes: string[] = [];
    for (const [size, data] of Object.entries(webp)) {
      const file = join(OUT_DIR, `${id}-${size}.webp`);
      writeFileSync(file, Buffer.from(data, 'base64'));
      const bytes = statSync(file).size;
      total += bytes;
      files += 1;
      sizes.push(`${size}: ${(bytes / 1024).toFixed(0)} KB`);
    }
    if (errors.length) console.warn(`[shots] ${id} page errors: ${errors.join(' | ')}`);
    console.log(`[shots] ${id}  ${sizes.join('  ')}`);
    await page.close();
  }
  await context.close();
} finally {
  await browser.close();
  server?.kill();
}
console.log(`[shots] ${ids.length} styles, ${files} files, ${(total / 1024 / 1024).toFixed(2)} MB`);
