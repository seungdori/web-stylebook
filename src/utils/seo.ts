import { buildRouteSeo, type RouteSeo } from '../data/seo';
import { notFoundCopy } from '../data/notFound';
import { findRoute, matchRoute, referenceIdFromPath, languages } from '../data/routes';
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

export function applyBuiltSeo(seo: RouteSeo, lang: Lang) {
  document.documentElement.lang = lang;
  document.title = seo.title;
  upsertMeta('meta[name="description"]', { name: 'description', content: seo.description });
  upsertMeta('meta[name="robots"]', { name: 'robots', content: 'index, follow' });
  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: seo.type });
  upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: seo.locale });
  upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'Web Stylebook' });
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: seo.title });
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: seo.description });
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: seo.canonicalUrl });
  upsertMeta('meta[property="og:image"]', { property: 'og:image', content: seo.image.url });
  upsertMeta('meta[property="og:image:width"]', { property: 'og:image:width', content: String(seo.image.width) });
  upsertMeta('meta[property="og:image:height"]', { property: 'og:image:height', content: String(seo.image.height) });
  upsertMeta('meta[property="og:image:type"]', { property: 'og:image:type', content: seo.image.type });
  upsertMeta('meta[property="og:image:alt"]', { property: 'og:image:alt', content: seo.image.alt[lang] });
  upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: seo.title });
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: seo.description });
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: seo.image.url });
  upsertMeta('meta[name="twitter:image:alt"]', { name: 'twitter:image:alt', content: seo.image.alt[lang] });
  upsertLink('link[rel="canonical"]', { rel: 'canonical', href: seo.canonicalUrl });

  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((node) => node.remove());
  languages.forEach((language) => {
    const link = document.createElement('link');
    link.rel = 'alternate';
    link.hreflang = language;
    link.href = seo.alternates[language];
    document.head.appendChild(link);
  });
  const fallback = document.createElement('link');
  fallback.rel = 'alternate';
  fallback.hreflang = 'x-default';
  fallback.href = seo.alternates.en;
  document.head.appendChild(fallback);

  document.head.querySelectorAll('meta[property="og:locale:alternate"]').forEach((node) => node.remove());
  seo.alternateLocales.forEach((locale) => {
    const meta = document.createElement('meta');
    meta.setAttribute('property', 'og:locale:alternate');
    meta.setAttribute('content', locale);
    document.head.appendChild(meta);
  });

  document.head
    .querySelectorAll('script[type="application/ld+json"]')
    .forEach((node) => node.remove());
  const jsonLd = document.createElement('script');
  jsonLd.type = 'application/ld+json';
  jsonLd.dataset.managedSeoJsonld = 'true';
  jsonLd.textContent = JSON.stringify(seo.jsonLd);
  document.head.appendChild(jsonLd);
}

export function applySeo(pathname: string, lang: Lang) {
  if (referenceIdFromPath(pathname)) {
    document.documentElement.lang = lang;
    return;
  }
  if (!matchRoute(pathname)) {
    applyNotFoundSeo(lang);
    return;
  }
  applyBuiltSeo(buildRouteSeo(findRoute(pathname), lang), lang);
}
