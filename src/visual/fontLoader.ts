import type { FontMetadata, ResolvedVisualContract } from './types';
import { FONT_LICENSES, FONT_SCRIPT_COVERAGE, PRETENDARD_STYLESHEET } from './fontSources';

export type FontScript = FontMetadata['scripts'][number];
export type FontLoadReason = 'pending' | 'font-face-ready' | 'system-dependent' | 'unverified-source' | 'script-not-covered' | 'font-api-unavailable' | 'font-face-unavailable' | 'load-failed';
export interface ActiveFontStatus {
  family: string;
  status: 'loading' | 'ready' | 'fallback' | 'error';
  reason: FontLoadReason;
  script: FontScript;
  source: FontMetadata['source'];
  fallback: string;
  license: string;
  licenseUrl?: string;
  /** The script whose loaded face was checked; other characters can still fall back. */
  loadedScript?: FontScript;
}

const LOAD_TIMEOUT_MS = 12_000;
const stylesheetRequests = new Map<string, Promise<void>>();

export function scriptForLocale(locale: string): FontScript {
  if (/^ko(?:-|$)/i.test(locale)) return 'hangul';
  if (/^ja(?:-|$)/i.test(locale)) return 'japanese';
  return 'latin';
}

/** Only the repository's verified open font providers/families can be requested. */
function approvedStylesheet(url: string): URL | undefined {
  try {
    const parsed = new URL(url);
    if (parsed.href === PRETENDARD_STYLESHEET) return parsed;
    if (parsed.protocol !== 'https:' || parsed.hostname !== 'fonts.googleapis.com' || !['/css', '/css2'].includes(parsed.pathname)) return;
    if (parsed.username || parsed.password || parsed.port || parsed.hash) return;
    const families = parsed.searchParams.getAll('family').flatMap((family) => family.split('|'));
    if (!families.length || families.some((family) => !FONT_LICENSES[family.split(':')[0]])) return;
    if ([...parsed.searchParams.keys()].some((key) => !['family', 'display', 'text', 'subset'].includes(key))) return;
    return parsed;
  } catch {
    return;
  }
}

/** Preserve axes from the authored import while excluding its inactive families. */
export function activeFontStylesheet(font: FontMetadata): string | undefined {
  const verified = FONT_LICENSES[font.family];
  if (font.source !== 'external' || !font.stylesheetUrl || !verified || verified.license !== font.license || verified.licenseUrl !== font.licenseUrl) return;
  const parsed = approvedStylesheet(font.stylesheetUrl);
  if (!parsed) return;
  if (parsed.href === PRETENDARD_STYLESHEET) return font.family === 'Pretendard Variable' ? parsed.href : undefined;
  const matchingFamilies = parsed.searchParams.getAll('family').flatMap((family) => family.split('|')).filter((family) => family.split(':')[0] === font.family);
  if (!matchingFamilies.length) return;
  parsed.searchParams.delete('family');
  for (const family of matchingFamilies) parsed.searchParams.append('family', family);
  parsed.searchParams.set('display', 'swap');
  // Normalize parameter order so route and active-specimen callers share a link.
  parsed.searchParams.sort();
  return parsed.href;
}

function verifiedScripts(font: FontMetadata): readonly FontScript[] {
  // Imported workspace metadata cannot invent script support for a verified family.
  return activeFontStylesheet(font) ? FONT_SCRIPT_COVERAGE[font.family] ?? [] : [];
}

const SYSTEM_FAMILIES = new Set(['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-serif', 'ui-sans-serif', 'ui-monospace', 'ui-rounded', '-apple-system', 'blinkmacsystemfont']);

/** Select the faces CSS can actually reach for Latin and the current content script. */
export function getActiveSpecimenFonts(spec: Pick<ResolvedVisualContract, 'typography' | 'contentLocale'>): FontMetadata[] {
  const metadata = new Map(spec.typography.fonts.map((font) => [font.family.toLowerCase(), font]));
  const selected = new Map<string, FontMetadata>();
  for (const role of Object.values(spec.typography.roles)) {
    const needed = new Set<FontScript>(['latin', scriptForLocale(spec.contentLocale)]);
    const families = role.fontFamily.split(',').map((family) => family.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
    for (const [index, family] of families.entries()) {
      if (needed.size === 0) break;
      const key = family.toLowerCase();
      const known = metadata.get(key);
      const system = known?.source === 'system' || SYSTEM_FAMILIES.has(key);
      const font: FontMetadata = known ?? {
        family, source: system ? 'system' : 'user', license: system ? 'System-provided font; not redistributed' : 'User supplied font; availability and license require verification',
        weights: [role.fontWeight], scripts: [], fallback: families.slice(index + 1).join(', ') || 'system-ui, sans-serif', availability: system ? 'system-dependent' : 'unverified',
      };
      const scripts = verifiedScripts(font);
      const relevant = scripts.some((script) => needed.has(script));
      // Preserve an unverified primary's status, but do not download its stale catalog peers.
      if (index === 0 || system || relevant) selected.set(key, { ...font, scripts: system ? font.scripts : [...scripts] });
      if (system) break;
      for (const script of scripts) needed.delete(script);
    }
  }
  return [...selected.values()];
}

/** Shared by authored routes and active specimens; successful links survive unmount. */
export function loadFontStylesheet(url: string): Promise<void> {
  const parsed = approvedStylesheet(url);
  if (!parsed || typeof document === 'undefined') return Promise.reject(new Error('Font source is unavailable'));
  parsed.searchParams.sort();
  const href = parsed.href;
  const cached = stylesheetRequests.get(href);
  if (cached) return cached;
  const request = new Promise<void>((resolve, reject) => {
    const existing = [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')].find((link) => link.href === href);
    const link = existing ?? document.createElement('link');
    if (existing && (existing.sheet || existing.dataset.fontState === 'ready')) {
      resolve();
      return;
    }
    const finish = (error?: Error) => {
      clearTimeout(timer);
      link.removeEventListener('load', loaded);
      link.removeEventListener('error', failed);
      link.dataset.fontState = error ? 'error' : 'ready';
      if (error) {
        if (!existing) link.remove();
        reject(error);
      } else resolve();
    };
    const loaded = () => finish();
    const failed = () => finish(new Error('Font stylesheet failed'));
    const timer = setTimeout(() => finish(new Error('Font stylesheet timed out')), LOAD_TIMEOUT_MS);
    link.addEventListener('load', loaded, { once: true });
    link.addEventListener('error', failed, { once: true });
    if (!existing) {
      link.rel = 'stylesheet';
      link.href = href;
      link.dataset.fontState = 'loading';
      document.head.appendChild(link);
    }
  });
  stylesheetRequests.set(href, request);
  void request.catch(() => stylesheetRequests.delete(href));
  return request;
}

function statusFor(font: FontMetadata, locale: string, status: ActiveFontStatus['status'], reason: FontLoadReason): ActiveFontStatus {
  return { family: font.family, source: font.source, fallback: font.fallback, license: font.license, licenseUrl: font.licenseUrl, script: scriptForLocale(locale), status, reason };
}

export function initialFontStatus(font: FontMetadata, locale: string): ActiveFontStatus {
  if (font.source === 'system') return statusFor(font, locale, 'fallback', 'system-dependent');
  if (!activeFontStylesheet(font)) return statusFor(font, locale, 'fallback', 'unverified-source');
  if (!verifiedScripts(font).includes(scriptForLocale(locale))) return statusFor(font, locale, 'fallback', 'script-not-covered');
  return statusFor(font, locale, 'loading', 'pending');
}

export interface FontLoaderEnvironment {
  loadStylesheet: (url: string) => Promise<void>;
  /** True means FontFaceSet.load returned a matching loaded face, not full glyph coverage. */
  loadFace?: (font: string, sample: string) => Promise<boolean>;
}

/** Injectable boundary keeps source policy and cache behavior testable without a browser. */
export function createFontLoader(environment: FontLoaderEnvironment) {
  const faceRequests = new Map<string, Promise<boolean>>();
  return async (font: FontMetadata, locale: string): Promise<ActiveFontStatus> => {
    const initial = initialFontStatus(font, locale);
    const latinFallback = initial.reason === 'script-not-covered' && verifiedScripts(font).includes('latin');
    if (initial.status !== 'loading' && !latinFallback) return initial;
    if (!environment.loadFace) return statusFor(font, locale, 'fallback', 'font-api-unavailable');
    try {
      await environment.loadStylesheet(activeFontStylesheet(font)!);
      const loadedScript = latinFallback ? 'latin' : scriptForLocale(locale);
      // A CJK probe must not succeed solely because the face contains Latin digits.
      const sample = { latin: 'Hamburgefontsiv0123456789', hangul: '한글가나다라마바사', japanese: '日本語あいうえおカタカナ' }[loadedScript];
      const weights = [...new Set(font.weights.length ? font.weights : [400])];
      const family = font.family.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
      const results = await Promise.all(weights.map((weight) => {
        const descriptor = `${weight} 16px "${family}"`;
        const key = `${descriptor}:${sample}`;
        let request = faceRequests.get(key);
        if (!request) {
          request = environment.loadFace!(descriptor, sample);
          faceRequests.set(key, request);
          void request.then((ready) => { if (!ready) faceRequests.delete(key); }, () => faceRequests.delete(key));
        }
        return request;
      }));
      return results.every(Boolean)
        ? { ...statusFor(font, locale, latinFallback ? 'fallback' : 'ready', latinFallback ? 'script-not-covered' : 'font-face-ready'), loadedScript }
        : statusFor(font, locale, 'fallback', 'font-face-unavailable');
    } catch {
      return statusFor(font, locale, 'error', 'load-failed');
    }
  };
}

function loadBrowserFace(descriptor: string, sample: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Font face timed out')), LOAD_TIMEOUT_MS);
    document.fonts.load(descriptor, sample).then((faces) => {
      clearTimeout(timer);
      resolve(faces.length > 0 && faces.every((face) => face.status === 'loaded') && document.fonts.check(descriptor, sample));
    }, (error: unknown) => {
      clearTimeout(timer);
      reject(error);
    });
  });
}

let browserLoader: ReturnType<typeof createFontLoader> | undefined;
export function loadActiveFont(font: FontMetadata, locale: string): Promise<ActiveFontStatus> {
  browserLoader ??= createFontLoader({
    loadStylesheet: loadFontStylesheet,
    loadFace: typeof document !== 'undefined' && typeof document.fonts?.load === 'function' ? loadBrowserFace : undefined,
  });
  return browserLoader(font, locale);
}
