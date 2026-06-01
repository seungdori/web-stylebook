/* global URL, Response */

const defaultLang = 'en';
const supportedLangs = new Set(['en', 'ko', 'ja']);

function stripLocale(pathname) {
  const stripped = pathname.replace(/^\/(?:en|ko|ja)(?=\/|$)/, '');
  return stripped || '/';
}

function removeHtmlRouteAlias(pathname) {
  if (pathname === '/index.html') return '/';
  if (/^\/(?:ko|ja|en)\/index\.html$/.test(pathname)) {
    return pathname.replace(/\/index\.html$/, '/').replace(/^\/en\//, '/');
  }
  if (/^\/(?:(?:ko|ja|en)\/)?pages\/.+\.html$/.test(pathname)) {
    return pathname.replace(/\.html$/, '').replace(/^\/en(?=\/|$)/, '');
  }
  return pathname;
}

function localizedPath(pathname, lang) {
  const base = removeHtmlRouteAlias(stripLocale(pathname));
  if (lang === defaultLang) return base;
  return base === '/' ? `/${lang}/` : `/${lang}${base}`;
}

function redirect(url, pathname) {
  const target = new URL(url.toString());
  target.pathname = pathname;
  return Response.redirect(target.toString(), 308);
}

export function onRequest(context) {
  const url = new URL(context.request.url);
  const lang = url.searchParams.get('lang');

  if (supportedLangs.has(lang)) {
    url.searchParams.delete('lang');
    return redirect(url, localizedPath(url.pathname, lang));
  }

  const normalizedPath = removeHtmlRouteAlias(url.pathname);
  if (normalizedPath !== url.pathname) {
    return redirect(url, normalizedPath);
  }

  return context.next();
}
