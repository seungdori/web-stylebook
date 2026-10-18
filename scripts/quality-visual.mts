import { execFileSync, spawn, spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync, statSync, readdirSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { fontFaceDescriptor, fontProbeSample } from '../src/visual/fontLoader';
import { FONT_SCRIPT_COVERAGE } from '../src/visual/fontSources';
import { routeFontQueries } from '../src/data/routeFontManifest';
import {
  BROWSER_CLI,
  DEVICE_SCALE_FACTOR,
  MAX_DIFF_PIXELS,
  PIXEL_THRESHOLD,
  TEXT_ZOOM_ROOT_PX,
  auditFonts,
  captureMatrix,
  chromeVersion,
  comparePixels,
  fontAuditPages,
  fontByteBudget,
  isGenericFamily,
  sameFontPage,
  zoomFailures,
  zoomPages,
  type FontNetworkReport,
  type FontPageReport,
  type StylesheetHit,
  type VisualManifest,
  type ZoomMeasurement,
} from './visual-baseline.mts';

// LCD subpixel edges follow fontconfig rgba and disagree across machines. Grayscale antialiasing does not.
process.env.AGENT_BROWSER_ARGS = [
  '--force-device-scale-factor=1',
  '--disable-lcd-text',
  '--font-render-hinting=none',
  '--disable-font-subpixel-positioning',
  '--force-color-profile=srgb',
  '--disable-skia-runtime-opts',
  // A warm disk cache can hide a unicode-range file from the request log and change the face set.
  '--disable-http-cache',
].join(',');

const update = process.argv.includes('--update');
const base = process.env.WEB_STYLEBOOK_BROWSER_URL ?? 'http://127.0.0.1:4176';
const root = resolve('docs/visual-baselines');
const evidence = resolve('output/playwright/webstylebook-fidelity/visual');
const session = `wsb-visual-${process.pid}`;
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const catalogFamilies = Object.keys(routeFontQueries);

let server: ReturnType<typeof spawn> | undefined;

function browser(sessionName: string, ...args: string[]) {
  const command = spawnSync(npx, ['--yes', BROWSER_CLI, '--session', sessionName, '--json', ...args], { encoding: 'utf8', timeout: 180000, maxBuffer: 64 * 1024 * 1024 });
  if (command.error) throw command.error;
  const lines = command.stdout.trim().split('\n');
  let result: { success?: boolean; data?: unknown; error?: string };
  const jsonLine = [...lines].reverse().find((line) => line.startsWith('{'));
  try { result = JSON.parse(jsonLine ?? ''); }
  catch { throw new Error(command.stderr || command.stdout || `${args[0]} produced no JSON`); }
  if (command.status || !result.success) throw new Error(`${args[0]}: ${result.error ?? command.stderr}`);
  return result.data as Record<string, unknown>;
}

function evaluate<T>(sessionName: string, code: string): T {
  const data = browser(sessionName, 'eval', '-b', Buffer.from(code).toString('base64'));
  return data.result as T;
}

async function waitFor<T>(read: () => T, ready: (value: T) => boolean, label: string, timeout = 45000): Promise<T> {
  const deadline = Date.now() + timeout;
  let last = read();
  while (Date.now() <= deadline) {
    if (ready(last)) return last;
    await delay(150);
    last = read();
  }
  throw new Error(`${label}: ${JSON.stringify(last)}`);
}

function sourceRevision(): string {
  return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
}

function openClean(sessionName: string, path: string, selector: string, width: number, height: number) {
  browser(sessionName, 'set', 'viewport', String(width), String(height), String(DEVICE_SCALE_FACTOR));
  browser(sessionName, 'set', 'media', 'light', 'reduced-motion');
  browser(sessionName, 'open', `${base}${path}`);
  browser(sessionName, 'wait', selector);
  evaluate(sessionName, 'localStorage.clear(); sessionStorage.clear(); true');
  browser(sessionName, 'reload');
  browser(sessionName, 'wait', selector);
}

function faceScript(selector: string): string {
  return `(() => {
    const root = document.querySelector(${JSON.stringify(selector)});
    if (!root) return { faces: [], missing: true };
    const faces = new Map();
    for (const el of [root, ...root.querySelectorAll('*')]) {
      const computed = getComputedStyle(el);
      if (computed.display === 'none' || computed.visibility === 'hidden') continue;
      const family = computed.fontFamily.split(',')[0].trim().replace(/^['"]|['"]$/g, '');
      const weight = Number(computed.fontWeight) || 400;
      if (family) faces.set(family + '/' + weight, { family, weight });
    }
    return { faces: [...faces.values()], missing: false };
  })()`;
}

function loadScript(checks: { descriptor: string; samples: string[] }[]): string {
  return `(async () => {
    const style = document.getElementById('quality-visual-stable') || document.createElement('style');
    style.id = 'quality-visual-stable';
    style.textContent = '*,*::before,*::after{animation:none !important;transition:none !important;caret-color:transparent !important;scroll-behavior:auto !important}';
    document.head.appendChild(style);
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    if (typeof document.fonts?.check !== 'function' || typeof document.fonts.load !== 'function') return { ok: false, pending: ['FontFaceSet'], status: 'missing', families: 0 };
    const checks = ${JSON.stringify(checks)};
    await document.fonts.ready;
    for (const check of checks) {
      for (const sample of check.samples) await document.fonts.load(check.descriptor, sample).catch(() => []);
    }
    await document.fonts.ready;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const pending = checks.filter((check) => !check.samples.every((sample) => document.fonts.check(check.descriptor, sample))).map((check) => check.descriptor);
    const loading = Boolean(document.querySelector('[data-font-status="loading"]'));
    const note = document.querySelector('.visual-choice-note[role="status"]')?.textContent ?? '';
    const loadingNote = /Loading|불러오는|読み込み/.test(note);
    return { ok: pending.length === 0 && !loading && !loadingNote && document.fonts.status !== 'loading', pending, status: document.fonts.status, families: checks.length };
  })()`;
}

function probeSamples(locale: string): string[] {
  if (locale === 'ko') return [fontProbeSample('latin'), fontProbeSample('hangul')];
  if (locale === 'ja') return [fontProbeSample('latin'), fontProbeSample('japanese')];
  return [fontProbeSample('latin')];
}

async function settle(sessionName: string, selector: string, locale: string) {
  const samples = probeSamples(locale);
  return waitFor(() => {
    const found = evaluate<{ faces: { family: string; weight: number }[]; missing: boolean }>(sessionName, faceScript(selector));
    if (found.missing) return { ok: false, pending: ['missing'], status: 'missing', families: 0 };
    const checks = found.faces.filter((face) => !isGenericFamily(face.family)).map((face) => ({
      descriptor: fontFaceDescriptor(face.family, face.weight),
      samples,
    }));
    return evaluate<{ ok: boolean; pending: string[]; status: string; families: number }>(sessionName, loadScript(checks));
  }, (value) => value.ok, `font gate ${selector}`);
}

function writeDiff(actual: Buffer, expected: Buffer, dest: string) {
  const left = PNG.sync.read(actual);
  const right = PNG.sync.read(expected);
  if (left.width !== right.width || left.height !== right.height) return;
  const diff = new PNG({ width: left.width, height: left.height });
  pixelmatch(left.data, right.data, diff.data, left.width, left.height, { threshold: PIXEL_THRESHOLD, includeAA: false, checkerboard: false });
  writeFileSync(dest, PNG.sync.write(diff));
}

function pageFontsScript(): string {
  return `(async () => {
    const style = document.getElementById('quality-visual-stable') || document.createElement('style');
    style.id = 'quality-visual-stable';
    style.textContent = '*,*::before,*::after{animation:none !important;transition:none !important;caret-color:transparent !important;scroll-behavior:auto !important}';
    document.head.appendChild(style);
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    const height = document.documentElement.scrollHeight;
    for (let y = 0; y < height; y += window.innerHeight) window.scrollTo(0, y);
    window.scrollTo(0, 0);
    if (document.fonts?.ready) await document.fonts.ready;
    const loading = Boolean(document.querySelector('[data-font-status="loading"]'));
    const note = document.querySelector('.visual-choice-note[role="status"]')?.textContent ?? '';
    const loadingNote = /Loading|불러오는|読み込み/.test(note);
    return { ok: !loading && !loadingNote && document.fonts.status !== 'loading' };
  })()`;
}

function renderedTextScript(): string {
  return `(async () => {
    const elements = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    let el = walker.nextNode();
    while (el) {
      const style = getComputedStyle(el);
      if (style.display !== 'none' && style.visibility !== 'hidden') {
        let text = '';
        for (const node of el.childNodes) if (node.nodeType === 3) text += node.textContent ?? '';
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) text += \`\${el.value} \${el.placeholder}\`;
        text = text.replace(/\\s+/g, ' ').trim();
        if (text) {
          elements.push({
            families: style.fontFamily.split(',').map((family) => family.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean),
            weight: Number(style.fontWeight) || 400,
            text: text.slice(0, 180),
            lang: el.closest('[lang]')?.lang || document.documentElement.lang || 'en',
          });
        }
      }
      el = walker.nextNode();
    }
    return elements;
  })()`;
}

interface NetworkRequest {
  requestId?: string;
  url: string;
  resourceType?: string;
  mimeType?: string;
  status?: number;
  responseHeaders?: Record<string, string>;
}

function headerValue(headers: Record<string, string> | undefined, name: string): string {
  if (!headers) return '';
  const found = Object.entries(headers).find(([key]) => key.toLowerCase() === name);
  return found?.[1] ?? '';
}

function networkRequests(sessionName: string): NetworkRequest[] {
  const data = browser(sessionName, 'network', 'requests');
  const requests = data.requests;
  return Array.isArray(requests) ? requests as NetworkRequest[] : [];
}

function isFontRequest(request: NetworkRequest): boolean {
  return request.resourceType === 'Font' || request.mimeType === 'font/woff2';
}

async function stableNetwork(sessionName: string, links: readonly string[]): Promise<NetworkRequest[]> {
  let previous = '';
  let stable = 0;
  let latest: NetworkRequest[] = [];
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    latest = networkRequests(sessionName);
    const fonts = latest.filter(isFontRequest).map((request) => request.url).sort().join('\n');
    // A stylesheet can arrive after the first font files. Its faces are part of the same snapshot.
    const linksReady = links.every((href) => latest.some((request) => sameResource(request.url, href)));
    const key = `${linksReady}\n${fonts}`;
    if (linksReady && key === previous) {
      stable += 1;
      if (stable >= 4) return latest;
    } else {
      stable = 0;
      previous = key;
    }
    await delay(250);
  }
  return latest;
}

function fontLinkScript(): string {
  return `(() => [...new Set([...document.querySelectorAll('link[rel~="stylesheet"]')].map((link) => link.href).filter((href) => /fonts\\.googleapis\\.com\\/css|fontsource|pretendard/i.test(href)))])()`;
}

function sameResource(left: string, right: string): boolean {
  try {
    const a = new URL(left);
    const b = new URL(right);
    if (a.origin !== b.origin || a.pathname !== b.pathname) return false;
    const keys = [...new Set([...a.searchParams.keys(), ...b.searchParams.keys()])].sort();
    return keys.every((key) => a.searchParams.getAll(key).slice().sort().join('\0') === b.searchParams.getAll(key).slice().sort().join('\0'));
  } catch {
    return left === right;
  }
}

function stylesheetHits(sessionName: string, requests: readonly NetworkRequest[]): StylesheetHit[] {
  // A fresh fetch can receive a different Google subset than the stylesheet the browser applied.
  const sheets = requests.filter((request) => request.requestId && /fonts\.googleapis\.com\/css|fontsource|pretendard/i.test(request.url));
  return sheets.map((request) => {
    const detail = browser(sessionName, 'network', 'request', request.requestId!) as { responseBody?: string };
    const css = typeof detail.responseBody === 'string' ? detail.responseBody : '';
    if (!css) throw new Error(`missing stylesheet body ${request.url}`);
    return { url: request.url, encodedBytes: Buffer.byteLength(css), css };
  });
}

function zoomScript(page: string, width: number): string {
  return `(async () => {
    const style = document.getElementById('quality-visual-zoom') || document.createElement('style');
    style.id = 'quality-visual-zoom';
    style.textContent = 'html { font-size: ${TEXT_ZOOM_ROOT_PX}px !important; }';
    document.head.appendChild(style);
    window.scrollTo(0, 0);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const controls = [...document.querySelectorAll('button, a, input, select, textarea, summary')];
    const visible = controls.filter((el) => {
      const computed = getComputedStyle(el);
      if (computed.display === 'none' || computed.visibility === 'hidden') return false;
      // Closed details keep descendant boxes under content-visibility. checkVisibility matches what is painted.
      if (typeof el.checkVisibility === 'function' && !el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true, contentVisibilityAuto: true })) return false;
      const rect = el.getBoundingClientRect();
      return rect.width > 1 && rect.height > 1;
    });
    const ids = new Map(visible.map((el, index) => [el, index + 1]));
    const measured = visible.map((el) => {
      const rect = el.getBoundingClientRect();
      const computed = getComputedStyle(el);
      let parent = el.parentElement;
      let parentId = null;
      while (parent) {
        if (ids.has(parent)) { parentId = ids.get(parent); break; }
        parent = parent.parentElement;
      }
      let clipped = rect.left < -1 || rect.right > document.documentElement.clientWidth + 1;
      let box = el.parentElement;
      while (box && !clipped) {
        const boxStyle = getComputedStyle(box);
        const overflow = \`\${boxStyle.overflowX} \${boxStyle.overflow}\`;
        if (/hidden|clip/.test(overflow)) {
          const bounds = box.getBoundingClientRect();
          if (rect.left < bounds.left - 1 || rect.right > bounds.right + 1) clipped = true;
        }
        box = box.parentElement;
      }
      const label = (el.getAttribute('aria-label') || el.textContent || el.getAttribute('placeholder') || el.tagName).replace(/\\s+/g, ' ').trim().slice(0, 48);
      return {
        id: ids.get(el),
        parentId,
        name: label || el.tagName,
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        clipped,
        textClipped: el.scrollWidth > el.clientWidth + 2,
      };
    });
    return {
      page: ${JSON.stringify(page)},
      width: ${width},
      scrollWidth: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
      clientWidth: document.documentElement.clientWidth,
      controls: measured,
    };
  })()`;
}

const CAPTURE_GENERICS = [
  'serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-serif', 'ui-sans-serif', 'ui-monospace', 'ui-rounded',
  '-apple-system', 'blinkmacsystemfont', 'segoe ui', 'arial', 'helvetica', 'helvetica neue', 'georgia', 'times new roman', 'times',
  'courier new', 'courier', 'tahoma', 'verdana', 'trebuchet ms', 'lucida grande', 'menlo', 'consolas', 'monaco', 'roboto',
  'dejavu sans', 'dejavu serif', 'liberation sans', 'liberation serif', 'droid sans fallback',
];

const SYMBOL_FAMILY = 'Noto Sans Symbols 2';

function pinFontsScript(selector: string): string {
  return `(async () => {
    const root = document.querySelector(${JSON.stringify(selector)});
    if (!root) return { pinned: 0, installed: [], loaded: 0 };
    const coverage = ${JSON.stringify(FONT_SCRIPT_COVERAGE)};
    const generics = new Set(${JSON.stringify(CAPTURE_GENERICS)});
    // esbuild rewrites function source with a __name helper the page does not have.
    function unicodeRanges(value) {
      if (!value) return null;
      const ranges = [];
      const bound = (token, high) => Number.parseInt(String(token).replaceAll('?', high ? 'F' : '0'), 16);
      for (const part of value.split(',')) {
        const match = /U\\+([0-9A-Fa-f?]+)(?:-([0-9A-Fa-f?]+))?/i.exec(part);
        if (!match) continue;
        const start = bound(match[1], false);
        const end = match[2] ? bound(match[2], true) : bound(match[1], true);
        if (Number.isFinite(start) && Number.isFinite(end)) ranges.push([start, end]);
      }
      return ranges.length ? ranges : null;
    }
    function codeInRanges(ranges, code) {
      if (!ranges) return true;
      return ranges.some(([start, end]) => code >= start && code <= end);
    }
    const pins = { latin: 'Inter', hangul: 'Noto Sans KR', japanese: 'Noto Sans JP' };
    const style = document.getElementById('quality-visual-pin') || document.createElement('style');
    style.id = 'quality-visual-pin';
    style.textContent = ${JSON.stringify(`${selector} :is(button, input, select, textarea) { appearance: none; }`)};
    document.head.appendChild(style);
    const clean = (value) => value.trim().replace(/^['"]|['"]$/g, '');
    const familyName = (face) => String(face.family).trim().replace(/^['"]|['"]$/g, '');
    const textOf = (el) => {
      let text = '';
      for (const node of el.childNodes) if (node.nodeType === 3) text += node.textContent ?? '';
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) text += \` \${el.value} \${el.placeholder}\`;
      if (el instanceof HTMLSelectElement) text += \` \${el.selectedOptions[0]?.textContent ?? ''}\`;
      return text;
    };
    const lang = (root.closest('[lang]')?.lang || document.documentElement.lang || 'en').toLowerCase();
    const scriptsIn = (text) => {
      const scripts = new Set();
      for (const char of text) {
        if (/\\p{Script=Hangul}/u.test(char)) scripts.add('hangul');
        else if (/\\p{Script=Hiragana}/u.test(char) || /\\p{Script=Katakana}/u.test(char)) scripts.add('japanese');
        else if (/\\p{Script=Han}/u.test(char)) scripts.add(lang.startsWith('ko') ? 'hangul' : 'japanese');
        else if (/\\p{Script=Latin}/u.test(char) || /\\p{Nd}/u.test(char)) scripts.add('latin');
      }
      return scripts;
    };
    const snapshots = [];
    for (const el of [root, ...root.querySelectorAll('*')]) {
      if (el.tagName === 'OPTION') continue;
      const computed = getComputedStyle(el);
      if (computed.display === 'none' || computed.visibility === 'hidden') continue;
      const text = textOf(el);
      if (!text.trim()) continue;
      snapshots.push({
        el,
        text,
        weight: Number(computed.fontWeight) || 400,
        families: computed.fontFamily.split(',').map(clean).filter((name) => name && !generics.has(name.toLowerCase())),
      });
    }
    if (!snapshots.length) return { pinned: 0, installed: [], loaded: 0 };
    const needed = new Set(['Inter', ${JSON.stringify(SYMBOL_FAMILY)}]);
    for (const snap of snapshots) {
      for (const family of snap.families) needed.add(family);
      for (const script of scriptsIn(snap.text)) {
        const pin = pins[script];
        if (pin) needed.add(pin);
      }
    }
    const installed = new Set();
    const captureName = (family) => family === ${JSON.stringify(SYMBOL_FAMILY)} ? 'WSBCapture Symbols' : 'WSBCapture ' + family;
    async function install(family) {
      const query = encodeURIComponent(family).replace(/%20/g, '+');
      let response = await fetch('https://fonts.googleapis.com/css2?family=' + query + ':wght@400;500;600;700&display=swap');
      if (!response.ok) response = await fetch('https://fonts.googleapis.com/css2?family=' + query + '&display=swap');
      if (!response.ok) return;
      const css = await response.text();
      const captureFamily = captureName(family);
      let added = 0;
      for (const match of css.matchAll(/@font-face\\s*\\{([^}]*)\\}/gi)) {
        const body = match[1];
        if (/font-style:\\s*italic/i.test(body)) continue;
        const weight = /font-weight:\\s*([^;]+)/i.exec(body)?.[1]?.trim() ?? '400';
        const unicodeRange = /unicode-range:\\s*([^;]+)/i.exec(body)?.[1]?.trim();
        const source = [...body.matchAll(/url\\(\\s*['"]?([^)'"]+)/gi)].map((item) => item[1]).find((item) => item.startsWith('https:'));
        if (!source) continue;
        try {
          document.fonts.add(new FontFace(captureFamily, 'url("' + source + '")', { weight, style: 'normal', ...(unicodeRange ? { unicodeRange } : {}) }));
          added += 1;
        } catch { /* Duplicate faces still leave a loaded range for the coverage check. */ }
      }
      if (added) installed.add(family);
    }
    await Promise.all([...needed].map((family) => install(family).catch(() => undefined)));
    const covers = (family, script) => {
      const known = coverage[family];
      return known ? known.includes(script) : false;
    };
    const assignments = [];
    for (const snap of snapshots) {
      const stack = [];
      for (const family of snap.families) if (installed.has(family) && !stack.includes(family)) stack.push(family);
      for (const script of scriptsIn(snap.text)) {
        const pin = pins[script];
        if (pin && installed.has(pin) && !stack.some((family) => covers(family, script))) stack.push(pin);
      }
      if (installed.has('Inter') && !stack.includes('Inter')) stack.push('Inter');
      if (installed.has(${JSON.stringify(SYMBOL_FAMILY)}) && !stack.includes(${JSON.stringify(SYMBOL_FAMILY)})) stack.push(${JSON.stringify(SYMBOL_FAMILY)});
      const names = stack.map(captureName);
      snap.el.style.setProperty('font-family', names.map((family) => '"' + family.replaceAll('"', '') + '"').join(', '), 'important');
      assignments.push({ text: snap.text, weight: snap.weight, names });
    }
    const weightDistance = (face, target) => {
      const parts = String(face.weight).trim().split(/\\s+/).map(Number).filter((item) => !Number.isNaN(item));
      const min = parts[0] ?? 400;
      const max = parts[parts.length - 1] ?? min;
      if (target >= min && target <= max) return 0;
      return Math.min(Math.abs(target - min), Math.abs(target - max));
    };
    const intersects = (range, text) => {
      const parsed = unicodeRanges(range);
      for (const char of text) {
        const code = char.codePointAt(0);
        if (code !== undefined && codeInRanges(parsed, code)) return true;
      }
      return false;
    };
    const loads = [];
    for (const item of assignments) {
      for (const name of item.names) {
        const faces = [...document.fonts].filter((face) => familyName(face) === name && face.status === 'unloaded' && intersects(face.unicodeRange, item.text));
        if (!faces.length) continue;
        const best = Math.min(...faces.map((face) => weightDistance(face, item.weight)));
        for (const face of faces) if (weightDistance(face, item.weight) === best) loads.push(face.load().catch(() => undefined));
      }
    }
    await Promise.all(loads);
    await document.fonts.ready;
    const loadedRanges = new Map();
    for (const face of document.fonts) {
      if (face.status !== 'loaded') continue;
      const name = familyName(face);
      if (!name.startsWith('WSBCapture')) continue;
      const list = loadedRanges.get(name) ?? [];
      list.push(unicodeRanges(face.unicodeRange));
      loadedRanges.set(name, list);
    }
    const missing = new Set();
    for (const item of assignments) {
      for (const char of item.text) {
        if (char === '\\n' || char === '\\r' || char === '\\t') continue;
        const code = char.codePointAt(0);
        if (code === undefined) continue;
        const painted = item.names.some((name) => (loadedRanges.get(name) ?? []).some((ranges) => codeInRanges(ranges, code)));
        if (!painted) missing.add(code);
      }
    }
    if (missing.size) throw new Error('uncovered ' + [...missing].slice(0, 24).map((code) => 'U+' + code.toString(16)).join(' '));
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return { pinned: assignments.length, installed: [...installed], loaded: [...document.fonts].filter((face) => face.status === 'loaded' && familyName(face).startsWith('WSBCapture')).length };
  })()`;
}

async function pinCaptureFonts(sessionName: string, selector: string) {
  // local() and generic families follow the host fontconfig. The capture uses network faces under a private family name.
  const result = evaluate<{ pinned: number; installed: string[]; loaded: number }>(sessionName, pinFontsScript(selector));
  if (!result.pinned) throw new Error(`${selector} pinned no text`);
  console.log(`[visual] pin ${selector} ${result.loaded} faces ${result.installed.join(', ')}`);
}

function alignCapture(sessionName: string, selector: string) {
  // Text above the target still uses the host font, so the target’s page position keeps a fractional pixel.
  // A transform layer keeps painting on that fraction. A spacer moves the layout onto a whole pixel instead.
  evaluate(sessionName, `(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el || !el.parentNode) return false;
    const fraction = () => {
      const abs = el.getBoundingClientRect().top + window.scrollY;
      return abs - Math.floor(abs);
    };
    let leftover = fraction();
    if (leftover > 0.01) {
      const shim = document.createElement('div');
      shim.setAttribute('data-visual-align', '');
      shim.style.cssText = 'display:block;height:' + (1 - leftover) + 'px;margin:0;padding:0;border:0;pointer-events:none;';
      el.parentNode.insertBefore(shim, el);
      leftover = fraction();
      if (leftover > 0.01) shim.style.height = (parseFloat(shim.style.height) + (1 - leftover)) + 'px';
    }
    return true;
  })()`);
}

function captureElement(sessionName: string, selector: string, dest: string) {
  alignCapture(sessionName, selector);
  const box = evaluate<{ x: number; y: number; width: number; height: number } | null>(sessionName, `(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return { x: rect.left + window.scrollX, y: rect.top + window.scrollY, width: rect.width, height: rect.height };
  })()`);
  if (!box || box.width < 2 || box.height < 2) throw new Error(`${selector} has no painted box`);
  const fullPath = resolve(evidence, 'actual', 'full.png');
  // An element screenshot is a flat color when the target is below the fold or taller than the viewport.
  browser(sessionName, 'screenshot', '--full', fullPath);
  const full = PNG.sync.read(readFileSync(fullPath));
  const x = Math.max(0, Math.floor(box.x));
  const y = Math.max(0, Math.floor(box.y));
  const width = Math.min(full.width - x, Math.ceil(box.x + box.width) - x);
  const height = Math.min(full.height - y, Math.ceil(box.y + box.height) - y);
  if (width < 2 || height < 2) throw new Error(`${selector} is outside the full-page capture (${full.width}x${full.height})`);
  const image = new PNG({ width, height });
  PNG.bitblt(full, image, x, y, width, height, 0, 0);
  unlinkSync(fullPath);
  writeFileSync(dest, PNG.sync.write(image));
  const first = image.data[0] << 16 | image.data[1] << 8 | image.data[2];
  for (let index = 4; index < image.data.length; index += 16) {
    const color = image.data[index] << 16 | image.data[index + 1] << 8 | image.data[index + 2];
    if (color !== first) return;
  }
  throw new Error(`${selector} captured a single color`);
}

function pngMeta(file: string) {
  const buffer = readFileSync(file);
  const image = PNG.sync.read(buffer);
  return { width: image.width, height: image.height, bytes: buffer.length };
}

function directoryBytes(dir: string): number {
  if (!existsSync(dir)) return 0;
  return readdirSync(dir).filter((name) => name.endsWith('.png')).reduce((sum, name) => sum + statSync(resolve(dir, name)).size, 0);
}

async function main() {
  mkdirSync(evidence, { recursive: true });
  mkdirSync(resolve(evidence, 'actual'), { recursive: true });
  mkdirSync(resolve(evidence, 'diff'), { recursive: true });
  mkdirSync(root, { recursive: true });
  if (!process.env.WEB_STYLEBOOK_BROWSER_URL) {
    if (!existsSync(resolve('dist/index.html'))) throw new Error('quality:visual needs npm run build before the preview server starts');
    server = spawn(process.execPath, [resolve('node_modules/vite/bin/vite.js'), 'preview', '--host', '127.0.0.1', '--port', '4176', '--strictPort'], { stdio: 'ignore' });
    let ready = false;
    for (let attempt = 0; attempt < 80; attempt += 1) {
      try {
        const response = await fetch(base);
        if (response.ok) { ready = true; break; }
      } catch { /* Wait for the owned preview. */ }
      await delay(250);
    }
    if (!ready) throw new Error('The production preview server did not start');
  }

  browser(session, 'open', base);
  const userAgent = evaluate<string>(session, 'navigator.userAgent');
  const fullVersion = evaluate<{ uaFullVersion?: string }>(session, '(async () => navigator.userAgentData.getHighEntropyValues(["uaFullVersion"]))()');
  const chrome = fullVersion.uaFullVersion || chromeVersion(userAgent);
  if (!chrome) throw new Error(`Pinned browser did not report a Chrome version: ${userAgent}`);
  console.log(`[visual] ${BROWSER_CLI} Chrome/${chrome}`);

  const revision = sourceRevision();
  const sizes = new Map<string, number>();
  async function bodyBytes(url: string): Promise<number> {
    const cached = sizes.get(url);
    if (cached !== undefined) return cached;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`font bytes ${response.status} ${url}`);
    const bytes = (await response.arrayBuffer()).byteLength;
    sizes.set(url, bytes);
    return bytes;
  }
  const fontPages: FontPageReport[] = [];
  for (const page of fontAuditPages()) {
    const fontSession = `wsb-font-${page.id}-${process.pid}`;
    try {
      browser(fontSession, 'network', 'requests', '--clear');
      browser(fontSession, 'set', 'viewport', '1440', '1000', String(DEVICE_SCALE_FACTOR));
      browser(fontSession, 'set', 'media', 'light', 'reduced-motion');
      browser(fontSession, 'open', `${base}${page.path}`);
      browser(fontSession, 'wait', page.ready);
      // The screenshot gate loads a latin probe the page may never paint. That request is what made a CJK face gain or lose one subset between runs.
      await waitFor(() => evaluate<{ ok: boolean }>(fontSession, pageFontsScript()), (value) => value.ok, `page fonts ${page.id}`);
      const links = evaluate<string[]>(fontSession, fontLinkScript());
      // A stylesheet can be in the log before Chrome requests its woff2. Resample until that file shows up.
      let requests: NetworkRequest[] = [];
      let audit = auditFonts([], [], [], catalogFamilies);
      for (let attempt = 0; attempt < 5; attempt += 1) {
        requests = await stableNetwork(fontSession, links);
        const missingLinks = links.filter((href) => !requests.some((request) => sameResource(request.url, href)));
        if (missingLinks.length) {
          if (attempt === 4) throw new Error(`${page.id} missing font stylesheet ${missingLinks.join(' ')}`);
          await delay(400);
          continue;
        }
        const files = new Map<string, { url: string; encodedBytes: number }>();
        for (const request of requests) {
          if (!isFontRequest(request)) continue;
          if (request.status && request.status >= 400) throw new Error(`${page.id} font ${request.status} ${request.url}`);
          const length = Number(headerValue(request.responseHeaders, 'content-length'));
          files.set(request.url, { url: request.url, encodedBytes: Number.isFinite(length) && length > 0 ? length : await bodyBytes(request.url) });
        }
        const elements = evaluate<{ families: string[]; weight: number; text: string; lang: string }[]>(fontSession, renderedTextScript());
        audit = auditFonts(stylesheetHits(fontSession, requests), [...files.values()], elements, catalogFamilies);
        if (!audit.failures.some((failure) => failure.includes('without a font file'))) break;
        await delay(400);
      }
      fontPages.push({
        id: page.id,
        path: page.path,
        status: audit.status,
        failures: audit.failures,
        totalBytes: audit.totalBytes,
        byteBudget: fontByteBudget(audit.totalBytes),
        stylesheetFamilies: audit.stylesheetFamilies,
        faces: audit.faces,
      });
      console.log(`[visual] fonts ${page.id} ${audit.status} ${audit.faces.length} faces ${audit.totalBytes}B`);
      if (audit.status === 'fail') console.log(audit.failures.join('\n'));
    } finally {
      try { browser(fontSession, 'close'); } catch { /* A failed font page still has to release its browser. */ }
    }
  }

  const captures: VisualManifest['captures'] = [];
  const pixelFailures: string[] = [];
  for (const spec of captureMatrix()) {
    openClean(session, spec.path, spec.selector, spec.width, spec.height);
    const settled = await settle(session, spec.selector, spec.locale);
    if (settled.families === 0) throw new Error(`${spec.id} captured an empty font set`);
    await pinCaptureFonts(session, spec.selector);
    const actualPath = resolve(evidence, 'actual', `${spec.id}.png`);
    captureElement(session, spec.selector, actualPath);
    const meta = pngMeta(actualPath);
    const entry = {
      id: spec.id,
      file: `${spec.id}.png`,
      surface: spec.surface,
      locale: spec.locale,
      path: spec.path,
      selector: spec.selector,
      viewport: { width: spec.width, height: spec.height, deviceScaleFactor: DEVICE_SCALE_FACTOR },
      png: meta,
    };
    captures.push(entry);
    const baselinePath = resolve(root, entry.file);
    if (update) writeFileSync(baselinePath, readFileSync(actualPath));
    else if (!existsSync(baselinePath)) pixelFailures.push(`${spec.id}: missing baseline`);
    else {
      const diff = comparePixels(readFileSync(actualPath), readFileSync(baselinePath));
      if (diff.status === 'fail') {
        writeDiff(readFileSync(actualPath), readFileSync(baselinePath), resolve(evidence, 'diff', `${spec.id}.png`));
        pixelFailures.push(`${spec.id}: ${diff.reason ?? `${diff.mismatched} pixels`}`);
      }
    }
    console.log(`[visual] ${spec.id} ${meta.width}x${meta.height} ${meta.bytes}B`);
  }

  const zoomResults: string[] = [];
  for (const page of zoomPages()) {
    openClean(session, page.path, page.ready, page.width, page.height);
    await settle(session, page.ready, 'en');
    const measurement = evaluate<ZoomMeasurement>(session, zoomScript(page.id, page.width));
    const failures = zoomFailures(measurement);
    zoomResults.push(...failures);
    console.log(`[visual] zoom ${page.id} ${failures.length ? 'fail' : 'pass'} overflow ${measurement.scrollWidth}/${measurement.clientWidth}`);
  }

  const manifest: VisualManifest = {
    schemaVersion: 1,
    sourceRevision: revision,
    browser: { cli: BROWSER_CLI, chrome, userAgent },
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
    pixelThreshold: PIXEL_THRESHOLD,
    maxDiffPixels: MAX_DIFF_PIXELS,
    textZoomRootPx: TEXT_ZOOM_ROOT_PX,
    captures,
  };
  const fontReport: FontNetworkReport = {
    schemaVersion: 1,
    sourceRevision: revision,
    browser: { cli: BROWSER_CLI, chrome },
    pages: fontPages,
  };
  if (update) {
    writeFileSync(resolve(root, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
    writeFileSync(resolve(root, 'font-network.json'), `${JSON.stringify(fontReport, null, 2)}\n`);
  }

  const failures = [...pixelFailures, ...zoomResults];
  if (!update) {
    const committedManifest = JSON.parse(readFileSync(resolve(root, 'manifest.json'), 'utf8')) as VisualManifest;
    if (committedManifest.browser.chrome !== chrome) failures.push(`browser changed ${committedManifest.browser.chrome} -> ${chrome}; run quality:visual:update and review`);
    if (committedManifest.pixelThreshold !== PIXEL_THRESHOLD || committedManifest.maxDiffPixels !== MAX_DIFF_PIXELS) failures.push('pixel threshold in the manifest does not match the checker');
    const committedFonts = JSON.parse(readFileSync(resolve(root, 'font-network.json'), 'utf8')) as FontNetworkReport;
    for (const page of fontPages) {
      const expected = committedFonts.pages.find((item) => item.id === page.id);
      if (!expected) failures.push(`missing font report ${page.id}`);
      else failures.push(...sameFontPage(page, expected));
    }
  } else {
    for (const page of fontPages) failures.push(...page.failures);
  }
  const pngBytes = directoryBytes(root);
  console.log(`[visual] baseline png bytes ${pngBytes}`);
  writeFileSync(resolve(evidence, 'report.json'), JSON.stringify({ update, chrome, pngBytes, failures, fontPages: fontPages.map(({ id, status, failures: pageFailures, totalBytes, faces }) => ({ id, status, failures: pageFailures, totalBytes, faces })) }, null, 2));
  if (failures.length) {
    console.error(failures.join('\n'));
    throw new Error(`[visual] ${failures.length} failures`);
  }
  console.log(`[visual] PASS ${captures.length} captures, ${fontPages.length} font pages, ${zoomPages().length} zoom pages`);
}

try {
  await main();
} finally {
  try { browser(session, 'close'); } catch { /* Closing a failed browser must not hide the result. */ }
  server?.kill('SIGTERM');
}
