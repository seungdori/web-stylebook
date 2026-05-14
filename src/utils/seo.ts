import { findRoute, languages, localizedRouteUrl, routeUrl } from '../data/routes';
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

function upsertLink(selector: string, attrs: Record<string, string>) {
  let node = document.head.querySelector<HTMLLinkElement>(selector);
  if (!node) {
    node = document.createElement('link');
    document.head.appendChild(node);
  }
  Object.entries(attrs).forEach(([key, value]) => node?.setAttribute(key, value));
}

export function applySeo(pathname: string, lang: Lang) {
  const route = findRoute(pathname);
  const title = localize(route.title, lang);
  const description = localize(route.description, lang);
  const canonical = routeUrl(route.path);

  document.documentElement.lang = lang;
  document.title = title;
  upsertMeta('meta[name="description"]', { name: 'description', content: description });
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
  upsertLink('link[rel="canonical"]', { rel: 'canonical', href: canonical });

  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((node) => node.remove());
  languages.forEach((language) => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = language;
    link.href = localizedRouteUrl(route.path, language);
    document.head.appendChild(link);
  });
  const fallback = document.createElement('link');
  fallback.rel = 'alternate';
  fallback.hreflang = 'x-default';
  fallback.href = canonical;
  document.head.appendChild(fallback);
}
