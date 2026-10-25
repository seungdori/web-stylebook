export const SCREENSHOT_EVIDENCE_KEY = 'webstylebook.refinement-screenshot';
export const MAX_SCREENSHOT_BYTES = 1_200_000;
export const SCREENSHOT_MIMES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'] as const;
export type ScreenshotMime = typeof SCREENSHOT_MIMES[number];
export type ScreenshotFailure = 'unsupported' | 'too-large' | 'unreadable';
export interface ScreenshotMeta {
  id: string;
  name: string;
  mime: ScreenshotMime;
  byteLength: number;
}
export interface ScreenshotRecord {
  meta: ScreenshotMeta;
  dataUrl: string;
}
interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem?(key: string): void;
}

const mimes = new Set<string>(SCREENSHOT_MIMES);

function cleanName(name: string): string {
  const visible = [...name].filter((char) => {
    const code = char.charCodeAt(0);
    return code >= 32 && code !== 127;
  }).join('').trim().slice(0, 200);
  return visible || 'screenshot';
}

export function screenshotByteLength(dataUrl: string, mime: ScreenshotMime): number | null {
  const prefix = `data:${mime};base64,`;
  if (!dataUrl.startsWith(prefix)) return null;
  const body = dataUrl.slice(prefix.length);
  if (!body || body.length % 4 !== 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(body)) return null;
  const padding = body.endsWith('==') ? 2 : body.endsWith('=') ? 1 : 0;
  return (body.length / 4) * 3 - padding;
}

export function inspectScreenshot(file: { type: string; size: number }): ScreenshotFailure | null {
  if (!mimes.has(file.type)) return 'unsupported';
  if (file.size <= 0 || file.size > MAX_SCREENSHOT_BYTES) return 'too-large';
  return null;
}

/**
 * Opaque file bytes only. Pixel values are not decoded, so a screenshot cannot become a measured token or selector.
 * A browser that cannot store the image still gets a valid record; the page keeps the image in this tab.
 */
export function saveScreenshot(storage: StorageLike | null, input: { name: string; mime: string; byteLength: number; dataUrl: string }): { ok: true; record: ScreenshotRecord; persisted: boolean } | { ok: false; reason: ScreenshotFailure } {
  if (!mimes.has(input.mime)) return { ok: false, reason: 'unsupported' };
  const mime = input.mime as ScreenshotMime;
  const measured = screenshotByteLength(input.dataUrl, mime);
  if (measured === null || measured !== input.byteLength) return { ok: false, reason: 'unreadable' };
  if (measured > MAX_SCREENSHOT_BYTES) return { ok: false, reason: 'too-large' };
  const meta: ScreenshotMeta = { id: globalThis.crypto?.randomUUID?.() ?? `shot-${Date.now()}`, name: cleanName(input.name), mime, byteLength: measured };
  const record = { meta, dataUrl: input.dataUrl };
  if (!storage) return { ok: true, record, persisted: false };
  try {
    storage.setItem(SCREENSHOT_EVIDENCE_KEY, JSON.stringify(record));
  } catch (error) {
    console.warn('[web-stylebook] The screenshot could not be saved; it stays in this tab.', error);
    return { ok: true, record, persisted: false };
  }
  return { ok: true, record, persisted: true };
}

export function readScreenshot(storage: StorageLike | null): ScreenshotRecord | null {
  if (!storage) return null;
  try {
    const raw = storage.getItem(SCREENSHOT_EVIDENCE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const record = parsed as { meta?: Partial<ScreenshotMeta>; dataUrl?: unknown };
    const mime = record.meta?.mime;
    const dataUrl = record.dataUrl;
    if (!mime || !mimes.has(mime) || typeof dataUrl !== 'string' || typeof record.meta?.id !== 'string' || typeof record.meta.byteLength !== 'number') return null;
    const measured = screenshotByteLength(dataUrl, mime);
    if (measured === null || measured !== record.meta.byteLength || measured > MAX_SCREENSHOT_BYTES) return null;
    return { meta: { id: record.meta.id, name: cleanName(String(record.meta.name ?? '')), mime, byteLength: measured }, dataUrl };
  } catch {
    return null;
  }
}

export function clearScreenshot(storage: StorageLike | null) {
  try { storage?.removeItem?.(SCREENSHOT_EVIDENCE_KEY); } catch { /* The page can still drop the in-memory preview. */ }
}

export function readScreenshotFile(file: Blob): Promise<string | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : null);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}
