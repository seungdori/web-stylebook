import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { publicRoutes, languages, localizedRouteUrl, routeUrl } from '../src/data/routes.ts';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');

function buildSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const entries = publicRoutes
    .map((route) => {
      const alternates = [
        ...languages.map((lang) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${localizedRouteUrl(route.path, lang)}" />`),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${routeUrl(route.path)}" />`,
      ].join('\n');
      return [
        '  <url>',
        `    <loc>${routeUrl(route.path)}</loc>`,
        `    <lastmod>${today}</lastmod>`,
        alternates,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    entries,
    '</urlset>',
    '',
  ].join('\n');
}

function buildRobots() {
  return ['User-agent: *', 'Allow: /', '', 'Sitemap: https://webstylebook.com/sitemap.xml', ''].join('\n');
}

function writeBoth(relativePath, content) {
  const rootTarget = join(ROOT, relativePath);
  writeFileSync(rootTarget, content, 'utf8');

  if (existsSync(DIST)) {
    const distTarget = join(DIST, relativePath);
    mkdirSync(dirname(distTarget), { recursive: true });
    writeFileSync(distTarget, content, 'utf8');
  }
}

writeBoth('sitemap.xml', buildSitemap());
writeBoth('robots.txt', buildRobots());

console.log(`[seo] routes=${publicRoutes.length}`);
console.log('[seo] wrote sitemap.xml and robots.txt from React route data');
