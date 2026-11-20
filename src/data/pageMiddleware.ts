import { notFoundCopy } from './notFound';
import { resolvePublicRequest } from './publicPath';
import { pathLocale } from './routes';
import { localize, type Lang } from './styles';

const assetHeader = 'x-asset-fetch';
const notFoundFiles = new Set(['/404.html', '/404.ko.html', '/404.ja.html']);

export interface AssetFetcher {
  fetch: (input: Request | string) => Promise<Response>;
}

export interface PageContext {
  request: Request;
  env: { ASSETS?: AssetFetcher };
  next: () => Promise<Response>;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wantsHtml(pathname: string): boolean {
  return !/\.(?:js|mjs|css|map|json|png|jpe?g|gif|webp|avif|svg|ico|txt|xml|woff2?|ttf|otf|pdf|mp4|webm)$/i.test(pathname);
}

async function fetchAsset(context: PageContext, pathname: string): Promise<Response | null> {
  if (!context.env.ASSETS) return null;
  const url = new URL(context.request.url);
  url.pathname = pathname;
  url.search = '';
  const headers = new Headers(context.request.headers);
  headers.set(assetHeader, '1');
  try {
    return await context.env.ASSETS.fetch(new Request(url, { method: 'GET', headers, redirect: 'manual' }));
  } catch {
    return null;
  }
}

function fallbackNotFound(lang: Lang): string {
  const title = localize(notFoundCopy.documentTitle, lang);
  const description = localize(notFoundCopy.documentDescription, lang);
  const heading = localize(notFoundCopy.title, lang);
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="noindex, follow"></head><body><main><h1>${escapeHtml(heading)}</h1><p>${escapeHtml(localize(notFoundCopy.body, lang))}</p></main></body></html>`;
}

async function notFoundResponse(context: PageContext, lang: Lang): Promise<Response> {
  const file = lang === 'en' ? '/404.html' : `/404.${lang}.html`;
  const asset = await fetchAsset(context, file);
  const headers = new Headers(asset?.ok ? asset.headers : { 'content-type': 'text/html; charset=utf-8' });
  headers.set('content-type', 'text/html; charset=utf-8');
  headers.set('x-robots-tag', 'noindex, follow');
  const body = asset?.ok ? asset.body : fallbackNotFound(lang);
  return new Response(body, { status: 404, headers });
}

export async function onRequest(context: PageContext): Promise<Response> {
  if (context.request.headers.get(assetHeader) === '1') return context.next();

  const url = new URL(context.request.url);
  if (notFoundFiles.has(url.pathname)) {
    const lang = url.pathname === '/404.ko.html' ? 'ko' : url.pathname === '/404.ja.html' ? 'ja' : 'en';
    return notFoundResponse(context, lang);
  }

  const resolution = resolvePublicRequest(url.pathname, url.search);
  if (resolution.kind === 'redirect') {
    const destination = new URL(url);
    destination.pathname = resolution.pathname;
    destination.search = resolution.search;
    return Response.redirect(destination.toString(), 308);
  }

  if (resolution.kind === 'page') {
    const asset = await fetchAsset(context, resolution.file);
    if (asset && (asset.ok || asset.status === 304)) {
      return new Response(asset.body, { status: asset.status, headers: asset.headers });
    }
  }

  const response = await context.next();
  if (response.status !== 404 || !wantsHtml(url.pathname)) return response;
  return notFoundResponse(context, pathLocale(url.pathname) ?? 'en');
}
