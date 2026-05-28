import { isLang, localizedPath, pathLocale, siteUrl, stripLocaleFromPath } from '../data/routes';
import type { Lang } from '../data/styles';

const STORAGE_KEY = 'webstylebook.lang';

function readStoredLang(): Lang | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isLang(stored) ? stored : null;
  } catch {
    return null;
  }
}

function detectBrowserLang(): Lang | null {
  if (typeof navigator === 'undefined') return null;
  const candidates = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const tag of candidates) {
    if (!tag) continue;
    const base = tag.toLowerCase().split('-')[0];
    if (isLang(base)) return base;
  }
  return null;
}

export function parseLang(search: string, pathname = ''): Lang {
  const localeFromPath = pathLocale(pathname);
  if (localeFromPath) return localeFromPath;

  const urlLang = new URLSearchParams(search).get('lang');
  if (isLang(urlLang)) return urlLang;
  return readStoredLang() ?? detectBrowserLang() ?? 'en';
}

export function persistLang(lang: Lang): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // ignore quota / privacy mode failures
  }
}

export function withLang(path: string, lang: Lang, extraQuery?: Record<string, string | undefined>): string {
  const url = new URL(path, siteUrl);
  const basePath = stripLocaleFromPath(url.pathname);
  url.searchParams.delete('lang');
  Object.entries(extraQuery || {}).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  return `${localizedPath(basePath, lang)}${url.search}${url.hash}`;
}
