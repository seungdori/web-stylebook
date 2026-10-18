import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { FONT_SCRIPT_COVERAGE } from '../src/visual/fontSources';

/** OKLab HyAB distance. A pixel at or under this distance is the same pixel. */
export const PIXEL_THRESHOLD = 0.1;
export const MAX_DIFF_PIXELS = 0;
export const BROWSER_CLI = 'agent-browser@0.38.1';
export const DEVICE_SCALE_FACTOR = 1;
/**
 * agent-browser 0.38.1 has no Chrome zoom control.
 * The site root stays at the CSS initial 16px, so 32px is 200% text zoom.
 */
export const TEXT_ZOOM_ROOT_PX = 32;

export const VIEWPORTS = [
  { width: 320, height: 844 },
  { width: 390, height: 844 },
  { width: 1440, height: 1000 },
] as const;

const LOCALES = ['en', 'ko', 'ja'] as const;
export type VisualLocale = (typeof LOCALES)[number];

export interface CaptureSpec {
  id: string;
  surface: 'color' | 'typography' | 'typography-ladder' | 'compare';
  locale: VisualLocale;
  width: number;
  height: number;
  path: string;
  selector: string;
}

const COMPARE_PAIRS = [
  { name: 'editorial', left: 'editorial-silence', right: 'quiet-utility', fixture: 'editorial' },
  { name: 'utility', left: 'quiet-utility', right: 'editorial-silence', fixture: 'operations' },
  { name: 'expressive', left: 'kinetic-pop', right: 'swiss-poster', fixture: 'product' },
] as const;

function localePrefix(locale: VisualLocale): string {
  return locale === 'en' ? '' : `/${locale}`;
}

export function captureMatrix(): CaptureSpec[] {
  const specs: CaptureSpec[] = [];
  for (const locale of LOCALES) {
    for (const viewport of VIEWPORTS) {
      const prefix = localePrefix(locale);
      specs.push({
        id: `color-${locale}-${viewport.width}`,
        surface: 'color',
        locale,
        width: viewport.width,
        height: viewport.height,
        path: `${prefix}/pages/color-system`,
        selector: '.color-role-preview',
      });
      specs.push({
        id: `typography-${locale}-${viewport.width}`,
        surface: 'typography',
        locale,
        width: viewport.width,
        height: viewport.height,
        path: `${prefix}/pages/typography`,
        selector: '.visual-editor-preview .visual-specimen',
      });
      specs.push({
        id: `typography-ladder-${locale}-${viewport.width}`,
        surface: 'typography-ladder',
        locale,
        width: viewport.width,
        height: viewport.height,
        path: `${prefix}/pages/typography`,
        selector: '.type-workbench',
      });
    }
  }
  for (const pair of COMPARE_PAIRS) {
    for (const viewport of VIEWPORTS) {
      specs.push({
        id: `compare-${pair.name}-${viewport.width}`,
        surface: 'compare',
        locale: 'en',
        width: viewport.width,
        height: viewport.height,
        path: `/pages/compare?left=${pair.left}&right=${pair.right}&mode=complete&fixture=${pair.fixture}&layout=horizontal`,
        selector: '.compare-grid',
      });
    }
  }
  return specs;
}

export interface FontAuditPage {
  id: string;
  path: string;
  ready: string;
}

export function fontAuditPages(): FontAuditPage[] {
  const preview = (id: string, path: string, ready: string): FontAuditPage => ({ id, path, ready });
  return [
    preview('home', '/', '.home-choice .visual-specimen'),
    preview('color-en', '/pages/color-system', '.color-role-preview'),
    preview('color-ko', '/ko/pages/color-system', '.color-role-preview'),
    preview('color-ja', '/ja/pages/color-system', '.color-role-preview'),
    preview('typography-en', '/pages/typography', '.visual-editor-preview .visual-specimen'),
    preview('typography-ko', '/ko/pages/typography', '.visual-editor-preview .visual-specimen'),
    preview('typography-ja', '/ja/pages/typography', '.visual-editor-preview .visual-specimen'),
    preview('compare', '/pages/compare?left=editorial-silence&right=quiet-utility&mode=complete&fixture=editorial&layout=horizontal', '.compare-grid .visual-specimen'),
    preview('prompt', '/pages/prompt-workflow', '.selected-handoff'),
  ];
}

export interface ZoomPage {
  id: string;
  path: string;
  ready: string;
  width: number;
  height: number;
}

export function zoomPages(): ZoomPage[] {
  const pages = [
    { id: 'home', path: '/', ready: '.home-choice' },
    { id: 'color', path: '/pages/color-system', ready: '.color-role-preview' },
    { id: 'typography', path: '/pages/typography', ready: '.visual-editor-preview .visual-specimen' },
    { id: 'compare', path: '/pages/compare?left=editorial-silence&right=quiet-utility&mode=complete&fixture=editorial&layout=horizontal', ready: '.compare-grid .visual-specimen' },
    { id: 'prompt', path: '/pages/prompt-workflow', ready: '.selected-handoff' },
  ];
  const widths = [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
  ];
  return pages.flatMap((page) => widths.map((viewport) => ({ ...page, id: `${page.id}-${viewport.width}`, path: page.path, ...viewport })));
}

export function chromeVersion(userAgent: string): string {
  return /Chrome\/(\d+\.\d+\.\d+\.\d+)/.exec(userAgent)?.[1] ?? '';
}

export interface PixelDiff {
  width: number;
  height: number;
  mismatched: number;
  status: 'pass' | 'fail';
  reason?: string;
}

export function comparePixels(actual: Buffer, expected: Buffer): PixelDiff {
  const left = PNG.sync.read(actual);
  const right = PNG.sync.read(expected);
  if (left.width !== right.width || left.height !== right.height) {
    return {
      width: left.width,
      height: left.height,
      mismatched: left.width * left.height,
      status: 'fail',
      reason: `size ${left.width}x${left.height} vs ${right.width}x${right.height}`,
    };
  }
  const mismatched = pixelmatch(left.data, right.data, null, left.width, left.height, {
    threshold: PIXEL_THRESHOLD,
    includeAA: false,
    checkerboard: false,
  });
  return {
    width: left.width,
    height: left.height,
    mismatched,
    status: mismatched <= MAX_DIFF_PIXELS ? 'pass' : 'fail',
  };
}

export interface ParsedFace {
  family: string;
  weight: string;
  urls: string[];
  ranges: Array<[number, number]> | null;
}

export function parseFontFaces(css: string, baseUrl?: string): ParsedFace[] {
  const faces: ParsedFace[] = [];
  for (const match of css.matchAll(/@font-face\s*\{([^}]*)\}/gi)) {
    const body = match[1];
    const family = /font-family:\s*([^;]+)/i.exec(body)?.[1]?.split(',')[0]?.trim().replace(/^['"]|['"]$/g, '');
    const weight = normalizeWeight(/font-weight:\s*([^;]+)/i.exec(body)?.[1] ?? '400');
    const urls = [...body.matchAll(/url\(\s*['"]?([^'")]+)/gi)].map((item) => resolveFontUrl(item[1], baseUrl));
    const ranges = unicodeRanges(/unicode-range:\s*([^;]+)/i.exec(body)?.[1]);
    if (family && urls.length) faces.push({ family, weight, urls, ranges });
  }
  return faces;
}

export function familiesFromStylesheetUrl(url: string): string[] {
  let parsed: URL;
  try { parsed = new URL(url); } catch { return []; }
  return parsed.searchParams.getAll('family').flatMap((value) => value.split('|')).map((value) => decodeURIComponent(value.split(':')[0].replaceAll('+', ' ')).trim()).filter(Boolean);
}

/** Null means the face did not declare a range, so it can paint any character. */
export function unicodeRanges(value: string | undefined): Array<[number, number]> | null {
  if (!value) return null;
  const ranges: Array<[number, number]> = [];
  const bound = (token: string, high: boolean) => Number.parseInt(token.replaceAll('?', high ? 'F' : '0'), 16);
  for (const part of value.split(',')) {
    const match = /U\+([0-9A-Fa-f?]+)(?:-([0-9A-Fa-f?]+))?/i.exec(part);
    if (!match) continue;
    const start = bound(match[1], false);
    const end = match[2] ? bound(match[2], true) : bound(match[1], true);
    if (Number.isFinite(start) && Number.isFinite(end)) ranges.push([start, end]);
  }
  return ranges.length ? ranges : null;
}

export function codeInRanges(ranges: Array<[number, number]> | null, code: number): boolean {
  if (!ranges) return true;
  return ranges.some(([start, end]) => code >= start && code <= end);
}

export function rangeCovers(ranges: Array<[number, number]> | null, text: string): boolean {
  if (!ranges) return true;
  for (const char of text) {
    const code = char.codePointAt(0);
    if (code === undefined) continue;
    if (ranges.some(([start, end]) => code >= start && code <= end)) return true;
  }
  return false;
}

export function normalizeWeight(weight: string): string {
  const cleaned = weight.trim().toLowerCase().replace(/\s+/g, ' ');
  if (cleaned === 'normal') return '400';
  if (cleaned === 'bold') return '700';
  return cleaned;
}

function resolveFontUrl(url: string, baseUrl?: string): string {
  try { return new URL(url, baseUrl).href; } catch { return url; }
}

function pathnameOf(url: string): string {
  try { return decodeURIComponent(new URL(url).pathname); } catch { return url.split('?')[0]; }
}

function familyKey(family: string): string {
  return family.trim().replace(/^['"]|['"]$/g, '').toLowerCase();
}

export interface WeightRange { min: number; max: number }

export function weightRange(weight: string): WeightRange {
  const parts = normalizeWeight(weight).split(' ').map(Number).filter((value) => Number.isFinite(value));
  if (!parts.length) return { min: 400, max: 400 };
  return { min: Math.min(...parts), max: Math.max(...parts) };
}

export interface RequestedFace {
  family: string;
  weight: string;
  bytes: number;
  files: number;
}

export interface RenderedUse {
  family: string;
  weight: number;
}

function rangeDistance(range: WeightRange, weight: number): number {
  if (weight < range.min) return range.min - weight;
  if (weight > range.max) return weight - range.max;
  return 0;
}

/** CSS font matching: a containing range wins; an equal distance prefers the face above 400. */
export function selectFace(faces: readonly RequestedFace[], weight: number): RequestedFace | undefined {
  if (!faces.length) return;
  const containing = faces.filter((face) => {
    const range = weightRange(face.weight);
    return weight >= range.min && weight <= range.max;
  });
  if (containing.length) {
    return containing.slice().sort((a, b) => {
      const spanA = weightRange(a.weight).max - weightRange(a.weight).min;
      const spanB = weightRange(b.weight).max - weightRange(b.weight).min;
      return spanA - spanB;
    })[0];
  }
  const ranked = faces.map((face) => ({ face, distance: rangeDistance(weightRange(face.weight), weight) }));
  const best = Math.min(...ranked.map((item) => item.distance));
  const ties = ranked.filter((item) => item.distance === best).map((item) => item.face);
  if (ties.length === 1) return ties[0];
  if (weight >= 400) {
    const above = ties.filter((face) => weightRange(face.weight).min >= weight);
    if (above.length) return above.slice().sort((a, b) => weightRange(a.weight).min - weightRange(b.weight).min)[0];
  }
  const below = ties.filter((face) => weightRange(face.weight).max <= weight);
  if (below.length) return below.slice().sort((a, b) => weightRange(b.weight).max - weightRange(a.weight).max)[0];
  return ties[0];
}

export function usedFaces(requested: readonly RequestedFace[], rendered: readonly RenderedUse[]): Set<RequestedFace> {
  const byFamily = new Map<string, RequestedFace[]>();
  for (const face of requested) {
    const key = familyKey(face.family);
    const list = byFamily.get(key) ?? [];
    list.push(face);
    byFamily.set(key, list);
  }
  const used = new Set<RequestedFace>();
  for (const item of rendered) {
    const chosen = selectFace(byFamily.get(familyKey(item.family)) ?? [], item.weight);
    if (chosen) used.add(chosen);
  }
  return used;
}

const GENERICS = new Set(['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-serif', 'ui-sans-serif', 'ui-monospace', 'ui-rounded', '-apple-system', 'blinkmacsystemfont']);

export function isGenericFamily(family: string): boolean {
  return GENERICS.has(familyKey(family));
}

export type CoverageScript = 'latin' | 'hangul' | 'japanese';

export function scriptsInText(text: string, lang: string): CoverageScript[] {
  const scripts = new Set<CoverageScript>();
  for (const char of text) {
    if (/\p{Script=Hangul}/u.test(char)) scripts.add('hangul');
    else if (/\p{Script=Hiragana}/u.test(char) || /\p{Script=Katakana}/u.test(char)) scripts.add('japanese');
    else if (/\p{Script=Han}/u.test(char)) scripts.add(lang.toLowerCase().startsWith('ko') ? 'hangul' : 'japanese');
    else if (/\p{Script=Latin}/u.test(char) || /\p{Nd}/u.test(char)) scripts.add('latin');
  }
  if (!scripts.size) scripts.add('latin');
  return [...scripts];
}

function covers(family: string, script: CoverageScript): boolean {
  if (isGenericFamily(family)) return true;
  const known = FONT_SCRIPT_COVERAGE[family];
  if (!known) return true;
  return known.includes(script);
}

export interface ObservedText {
  families: string[];
  weight: number;
  text: string;
  lang: string;
}

function paintedTextByFamily(elements: readonly ObservedText[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const element of elements) {
    for (const char of element.text) {
      const script = scriptsInText(char, element.lang)[0];
      const family = element.families.find((name) => covers(name, script));
      if (!family || isGenericFamily(family)) continue;
      const key = familyKey(family);
      map.set(key, (map.get(key) ?? '') + char);
    }
  }
  return map;
}

export function renderedUses(elements: readonly ObservedText[]): RenderedUse[] {
  const rendered: RenderedUse[] = [];
  for (const element of elements) {
    for (const script of scriptsInText(element.text, element.lang)) {
      const family = element.families.find((name) => covers(name, script));
      if (!family || isGenericFamily(family)) continue;
      rendered.push({ family, weight: element.weight });
    }
  }
  return rendered;
}

export interface FontFile { url: string; encodedBytes: number }
export interface StylesheetHit { url: string; encodedBytes: number; css: string }

export interface FontAuditResult {
  status: 'pass' | 'fail';
  failures: string[];
  faces: RequestedFace[];
  stylesheetFamilies: string[];
  totalBytes: number;
}

export function auditFonts(stylesheets: readonly StylesheetHit[], files: readonly FontFile[], elements: readonly ObservedText[], catalogFamilies: readonly string[]): FontAuditResult {
  const parsed = stylesheets.flatMap((sheet) => parseFontFaces(sheet.css, sheet.url));
  // One variable file is listed once per weight. The last stylesheet must not rename it.
  const byPath = new Map<string, { family: string; min: number; max: number; ranges: Array<[number, number]> | null }>();
  for (const face of parsed) {
    const range = weightRange(face.weight);
    for (const url of face.urls) {
      const path = pathnameOf(url);
      const current = byPath.get(path);
      if (!current) byPath.set(path, { family: face.family, min: range.min, max: range.max, ranges: face.ranges });
      else {
        current.min = Math.min(current.min, range.min);
        current.max = Math.max(current.max, range.max);
        if (!current.ranges && face.ranges) current.ranges = face.ranges;
      }
    }
  }
  const painted = paintedTextByFamily(elements);
  const renderedWeights = new Map<string, Set<number>>();
  for (const item of renderedUses(elements)) {
    const key = familyKey(item.family);
    const weights = renderedWeights.get(key) ?? new Set<number>();
    weights.add(item.weight);
    renderedWeights.set(key, weights);
  }
  const groups = new Map<string, RequestedFace>();
  const failures: string[] = [];
  for (const file of files) {
    if (!/\.woff2?($|\?)/i.test(file.url) && !/fonts\.gstatic|fontsource|pretendard/i.test(file.url)) continue;
    const face = byPath.get(pathnameOf(file.url));
    if (!face) {
      failures.push(`unmatched font file ${file.url}`);
      continue;
    }
    const weights = renderedWeights.get(familyKey(face.family));
    const weightUsed = Boolean(weights && [...weights].some((weight) => weight >= face.min && weight <= face.max));
    // Chrome sometimes prefetches the latin subset of a CJK face that the painted text never uses.
    if (weightUsed && !rangeCovers(face.ranges, painted.get(familyKey(face.family)) ?? '')) continue;
    const weight = face.min === face.max ? String(face.min) : `${face.min} ${face.max}`;
    const key = `${familyKey(face.family)} ${weight}`;
    const current = groups.get(key) ?? { family: face.family, weight, bytes: 0, files: 0 };
    current.bytes += file.encodedBytes;
    current.files += 1;
    groups.set(key, current);
  }
  const requested = [...groups.values()].sort((a, b) => a.family.localeCompare(b.family) || a.weight.localeCompare(b.weight));
  const stylesheetFamilies = [...new Set(stylesheets.flatMap((sheet) => familiesFromStylesheetUrl(sheet.url)))].sort((a, b) => a.localeCompare(b));
  const rendered = renderedUses(elements);
  const used = usedFaces(requested, rendered);
  for (const face of requested) {
    if (!used.has(face)) failures.push(`unused face ${face.family} ${face.weight}`);
  }
  const renderedKeys = new Set(rendered.map((item) => familyKey(item.family)));
  for (const family of stylesheetFamilies) {
    const renderedFamily = renderedKeys.has(familyKey(family));
    const downloaded = requested.some((face) => familyKey(face.family) === familyKey(family));
    if (!renderedFamily) failures.push(`unused stylesheet ${family}`);
    else if (!downloaded) failures.push(`rendered ${family} without a font file`);
  }
  const loaded = new Set<string>();
  for (const family of [...stylesheetFamilies, ...requested.map((face) => face.family)]) {
    const key = familyKey(family);
    if (catalogFamilies.some((item) => familyKey(item) === key)) loaded.add(key);
  }
  const catalog = new Set(catalogFamilies.map(familyKey));
  if (catalog.size > 0 && loaded.size >= catalog.size) failures.push(`loaded all ${catalog.size} catalog families`);
  const totalBytes = requested.reduce((sum, face) => sum + face.bytes, 0) + stylesheets.reduce((sum, sheet) => sum + sheet.encodedBytes, 0);
  return { status: failures.length ? 'fail' : 'pass', failures, faces: requested, stylesheetFamilies, totalBytes };
}

export interface ZoomControl {
  id: number;
  parentId: number | null;
  name: string;
  left: number;
  top: number;
  right: number;
  bottom: number;
  clipped: boolean;
  textClipped: boolean;
}

export interface ZoomMeasurement {
  page: string;
  width: number;
  scrollWidth: number;
  clientWidth: number;
  controls: ZoomControl[];
}

export function zoomFailures(measurement: ZoomMeasurement): string[] {
  const failures: string[] = [];
  if (measurement.scrollWidth > measurement.clientWidth + 1) {
    failures.push(`${measurement.page}: horizontal overflow ${measurement.scrollWidth}px > ${measurement.clientWidth}px`);
  }
  for (const control of measurement.controls) {
    if (control.clipped) failures.push(`${measurement.page}: clipped ${control.name}`);
    if (control.textClipped) failures.push(`${measurement.page}: text clipped ${control.name}`);
  }
  const ancestors = new Map(measurement.controls.map((control) => [control.id, control.parentId]));
  const nested = (id: number, target: number) => {
    let current = ancestors.get(id) ?? null;
    const seen = new Set<number>();
    while (current !== null && !seen.has(current)) {
      if (current === target) return true;
      seen.add(current);
      current = ancestors.get(current) ?? null;
    }
    return false;
  };
  const visible = measurement.controls.filter((control) => control.right - control.left > 1 && control.bottom - control.top > 1);
  const pairs: string[] = [];
  for (let i = 0; i < visible.length; i += 1) {
    for (let j = i + 1; j < visible.length; j += 1) {
      const a = visible[i];
      const b = visible[j];
      if (nested(a.id, b.id) || nested(b.id, a.id)) continue;
      const overlapWidth = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const overlapHeight = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (overlapWidth <= 0 || overlapHeight <= 0 || overlapWidth * overlapHeight < 8) continue;
      pairs.push(`${a.name} ∩ ${b.name}`);
    }
  }
  for (const pair of pairs.slice(0, 12)) failures.push(`${measurement.page}: overlapping ${pair}`);
  if (pairs.length > 12) failures.push(`${measurement.page}: ${pairs.length - 12} more overlapping controls`);
  return failures;
}

export interface ManifestCapture {
  id: string;
  file: string;
  surface: CaptureSpec['surface'];
  locale: VisualLocale;
  path: string;
  selector: string;
  viewport: { width: number; height: number; deviceScaleFactor: number };
  png: { width: number; height: number; bytes: number };
}

export interface VisualManifest {
  schemaVersion: 1;
  sourceRevision: string;
  browser: { cli: typeof BROWSER_CLI; chrome: string; userAgent: string };
  deviceScaleFactor: typeof DEVICE_SCALE_FACTOR;
  pixelThreshold: typeof PIXEL_THRESHOLD;
  maxDiffPixels: typeof MAX_DIFF_PIXELS;
  textZoomRootPx: typeof TEXT_ZOOM_ROOT_PX;
  captures: ManifestCapture[];
}

export interface FontPageReport {
  id: string;
  path: string;
  status: 'pass' | 'fail';
  failures: string[];
  totalBytes: number;
  stylesheetFamilies: string[];
  faces: RequestedFace[];
}

export interface FontNetworkReport {
  schemaVersion: 1;
  sourceRevision: string;
  browser: { cli: typeof BROWSER_CLI; chrome: string };
  pages: FontPageReport[];
}

export function sameFontPage(actual: FontPageReport, expected: FontPageReport): string[] {
  const failures = [...actual.failures];
  const faceKey = (face: RequestedFace) => `${familyKey(face.family)} ${face.weight} ${face.bytes} ${face.files}`;
  const actualFaces = actual.faces.map(faceKey).join('\n');
  const expectedFaces = expected.faces.map(faceKey).join('\n');
  if (actualFaces !== expectedFaces) failures.push(`font faces changed for ${actual.id}`);
  if (actual.stylesheetFamilies.join('\n') !== expected.stylesheetFamilies.join('\n')) failures.push(`stylesheet families changed for ${actual.id}`);
  return failures;
}
