import { notFoundCopy } from '../data/notFound';
import { localizedPath, localizedRouteUrl, matchRoute } from '../data/routes';
import { localize, type Lang } from '../data/styles';

function upsertMeta(selector: string, attrs: Record<string, string>) {
  let node = document.head.querySelector<HTMLMetaElement>(selector);
  if (!node) {
    node = document.createElement('meta');
    const name = attrs.name || attrs.property;
    if (attrs.name) node.setAttribute('name', name);
    if (attrs.property) node.setAttribute('property', name);
    document.head.appendChild(node);
  }
  Object.entries(attrs).forEach(([key, value]) => node?.setAttribute(key, value));
}

function stripSharingTags() {
  document.head.querySelectorAll('meta').forEach((node) => {
    const property = node.getAttribute('property') ?? '';
    const name = node.getAttribute('name') ?? '';
    if (property.startsWith('og:') || name.startsWith('twitter:')) node.remove();
  });
  document.head.querySelectorAll('link').forEach((node) => {
    const rel = node.getAttribute('rel');
    if (rel === 'canonical' || (rel === 'alternate' && node.hasAttribute('hreflang'))) node.remove();
  });
  document.head.querySelectorAll('script').forEach((node) => {
    if (node.getAttribute('type') === 'application/ld+json') node.remove();
  });
}

export function applyNotFoundSeo(lang: Lang) {
  document.documentElement.lang = lang;
  document.title = localize(notFoundCopy.documentTitle, lang);
  upsertMeta('meta[name="description"]', {
    name: 'description',
    content: localize(notFoundCopy.documentDescription, lang),
  });
  upsertMeta('meta[name="robots"]', { name: 'robots', content: 'noindex, follow' });
  stripSharingTags();
}

// The build owns SEO copy and structured data. Reuse the destination HTML on
// client navigation so the browser never imports the multilingual SEO generator.
const managedHeadSelector = [
  'title',
  'meta[name="description"]',
  'meta[name="robots"]',
  'meta[property^="og:"]',
  'meta[name^="twitter:"]',
  'link[rel="canonical"]',
  'link[rel="alternate"][hreflang]',
  'script[type="application/ld+json"]',
].join(',');

export async function applySeo(pathname: string, lang: Lang, signal?: AbortSignal) {
  if (signal?.aborted) return;
  document.documentElement.lang = lang;
  const route = matchRoute(pathname);
  if (!route) {
    applyNotFoundSeo(lang);
    return;
  }
  const canonical = localizedRouteUrl(route.path, lang);
  if (document.head.querySelector('link[rel="canonical"]')?.getAttribute('href') === canonical) return;

  try {
    const response = await fetch(localizedPath(route.path, lang), { signal });
    if (!response.ok) throw new Error(`SEO document returned ${response.status}`);
    const html = await response.text();
    if (signal?.aborted) return;
    const next = new DOMParser().parseFromString(html, 'text/html');
    // Reject a fallback/404 document instead of applying metadata for another URL.
    if (next.documentElement.lang !== lang
      || next.head.querySelector('link[rel="canonical"]')?.getAttribute('href') !== canonical) {
      throw new Error('SEO document does not match the destination');
    }
    document.head.querySelectorAll(managedHeadSelector).forEach((node) => node.remove());
    next.head.querySelectorAll(managedHeadSelector).forEach((node) => {
      document.head.appendChild(document.importNode(node, true));
    });
  } catch (error) {
    if (!signal?.aborted) console.warn('Unable to refresh page metadata', error);
  }
}
