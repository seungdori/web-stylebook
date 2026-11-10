import {
  allRoutes,
  filePathForPublicPath,
  isLang,
  localizedPath,
  normalizePath,
  type Lang,
} from './routes';

export type PublicResolution =
  | { kind: 'redirect'; pathname: string; search: string }
  | { kind: 'page'; file: string }
  | { kind: 'pass' };

const staticRedirects: Record<string, string> = {
  '/social-card.jpg': '/og/default.png',
};

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function splitLocale(pathname: string): { lang: Lang; rest: string } {
  const match = pathname.match(/^\/(en|ko|ja)(?=\/|$)/);
  if (!match) return { lang: 'en', rest: pathname || '/' };
  const rest = pathname.slice(match[0].length);
  return { lang: match[1] as Lang, rest: rest || '/' };
}

function splitLangQuery(search: string): { lang: Lang | null; search: string } {
  const raw = search.startsWith('?') ? search.slice(1) : search;
  if (!raw) return { lang: null, search: '' };
  let lang: Lang | null = null;
  const kept: string[] = [];
  for (const part of raw.split('&')) {
    if (!part) continue;
    const eq = part.indexOf('=');
    const key = eq === -1 ? part : part.slice(0, eq);
    const value = eq === -1 ? '' : part.slice(eq + 1);
    if (key === 'lang' && lang === null && isLang(safeDecode(value))) {
      lang = safeDecode(value) as Lang;
      continue;
    }
    kept.push(part);
  }
  return { lang, search: kept.length ? `?${kept.join('&')}` : '' };
}

function canonicalBarePath(bare: string): string | null {
  const route = allRoutes.find((item) => item.path === bare || item.aliases?.some((alias) => alias === bare || normalizePath(alias) === bare));
  if (route) return route.path;
  if (/^\/pages\/references\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(bare)) return bare;
  return null;
}

export function resolvePublicRequest(pathname: string, search: string): PublicResolution {
  const decoded = safeDecode(pathname);
  const { lang: queryLang, search: kept } = splitLangQuery(search);
  const nextSearch = queryLang ? kept : search;
  const staticTarget = staticRedirects[decoded];
  if (staticTarget) return { kind: 'redirect', pathname: staticTarget, search: nextSearch };

  const { lang: pathLang, rest } = splitLocale(decoded);
  const canonicalBare = canonicalBarePath(normalizePath(rest));
  if (!canonicalBare) return { kind: 'pass' };

  const canonical = localizedPath(canonicalBare, queryLang ?? pathLang);
  if (canonical !== decoded || nextSearch !== search) {
    return { kind: 'redirect', pathname: canonical, search: nextSearch };
  }
  return { kind: 'page', file: filePathForPublicPath(canonical) };
}
