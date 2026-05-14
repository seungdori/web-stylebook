import { languages } from '../data/routes';
import type { Lang } from '../data/styles';

export function parseLang(search: string): Lang {
  const lang = new URLSearchParams(search).get('lang');
  return languages.includes(lang as Lang) ? (lang as Lang) : 'en';
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
