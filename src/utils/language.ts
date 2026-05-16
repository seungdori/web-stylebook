import { languages } from '../data/routes';
import type { Lang } from '../data/styles';

const STORAGE_KEY = 'webstylebook.lang';

function isLang(value: string | null | undefined): value is Lang {
  return !!value && (languages as string[]).includes(value);
}

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

export function parseLang(search: string): Lang {
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

export function getLangQuery(lang: Lang): string {
  return lang === 'en' ? '' : `?lang=${lang}`;
}

export function withLang(path: string, lang: Lang, extraQuery?: Record<string, string | undefined>): string {
  const url = new URL(path, 'https://webstylebook.com');
  if (lang !== 'en') url.searchParams.set('lang', lang);
  Object.entries(extraQuery || {}).forEach(([key, value]) => {
    if (value) url.searchParams.set(key, value);
  });
  return `${url.pathname}${url.search}${url.hash}`;
}
