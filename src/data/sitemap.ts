import { designReferences } from '../catalog/references';
import { languages, localizedRouteUrl, publicRoutes, siteUrl, type RouteDefinition } from './routes';
import { routeChangeFrequency, routeLastModified, routePriority } from './seo';
import type { Lang } from './styles';

function xml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function alternates(path: string): string {
  return [
    ...languages.map((lang) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${xml(localizedRouteUrl(path, lang))}" />`),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${xml(localizedRouteUrl(path, 'en'))}" />`,
  ].join('\n');
}

function urlEntry(path: string, lang: Lang, lastmod: string, changefreq: string, priority: string): string {
  return [
    '  <url>',
    `    <loc>${xml(localizedRouteUrl(path, lang))}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    `    <changefreq>${changefreq}</changefreq>`,
    `    <priority>${priority}</priority>`,
    alternates(path),
    '  </url>',
  ].join('\n');
}

function routeEntries(route: RouteDefinition): string[] {
  return languages.map((lang) => urlEntry(
    route.path,
    lang,
    routeLastModified(route),
    routeChangeFrequency(route),
    routePriority(route),
  ));
}

export function buildSitemapXml(): string {
  const entries = [
    ...publicRoutes.flatMap((route) => routeEntries(route)),
    ...designReferences.flatMap((reference) => languages.map((lang) => urlEntry(
      `/pages/references/${reference.id}`,
      lang,
      reference.observedAt.slice(0, 10),
      'monthly',
      '0.6',
    ))),
  ].join('\n');
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    entries,
    '</urlset>',
    '',
  ].join('\n');
}

export function buildRobotsTxt(): string {
  return [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ].join('\n');
}
