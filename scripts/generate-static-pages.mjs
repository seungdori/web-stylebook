import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { buildRouteSeo } from '../src/data/seo.ts';
import { publicRoutes, languages, routeAliasToFilePath, routeToFilePath } from '../src/data/routes.ts';

const ROOT = process.cwd();
const DIST = join(ROOT, 'dist');
const INDEX = join(DIST, 'index.html');

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function metaTag(name, content) {
  return `<meta name="${name}" content="${escapeHtml(content)}" />`;
}

function propertyTag(property, content) {
  return `<meta property="${property}" content="${escapeHtml(content)}" />`;
}

function alternateTags(route) {
  const alternates = buildRouteSeo(route, 'en').alternates;
  return [
    ...languages.map((lang) => `<link rel="alternate" hreflang="${lang}" href="${alternates[lang]}" />`),
    `<link rel="alternate" hreflang="x-default" href="${alternates.en}" />`,
  ].join('\n    ');
}

function stripManagedHead(html) {
  return html
    .replace(/<title\b[\s\S]*?<\/title>/i, '')
    .replace(/\s*<meta\s+name="description"[\s\S]*?>/gi, '')
    .replace(/\s*<meta\s+name="robots"[\s\S]*?>/gi, '')
    .replace(/\s*<meta\s+property="og:(type|locale|locale:alternate|site_name|title|description|url|image|image:width|image:height|image:type|image:alt)"[\s\S]*?>/gi, '')
    .replace(/\s*<meta\s+name="twitter:(card|title|description|image|image:alt)"[\s\S]*?>/gi, '')
    .replace(/\s*<link\s+rel="canonical"[\s\S]*?>/gi, '')
    .replace(/\s*<link\s+rel="alternate"[\s\S]*?>/gi, '')
    .replace(/\s*<link\s+rel="sitemap"[\s\S]*?>/gi, '')
    .replace(/\s*<script\b[^>]*type="application\/ld\+json"[\s\S]*?<\/script>/gi, '');
}

function jsonScript(data) {
  return `<script type="application/ld+json" data-managed-seo-jsonld="true">\n${JSON.stringify(data, null, 2).replace(/</g, '\\u003c')}\n    </script>`;
}

function injectRouteHead(template, route, lang, modifiedAt) {
  const seo = buildRouteSeo(route, lang, modifiedAt);
  const managed = [
    `<title>${escapeHtml(seo.title)}</title>`,
    metaTag('description', seo.description),
    metaTag('robots', 'index, follow'),
    `<link rel="canonical" href="${seo.canonicalUrl}" />`,
    alternateTags(route),
    '<link rel="sitemap" type="application/xml" href="/sitemap.xml" />',
    '<link rel="alternate" type="application/json" title="Web Stylebook Agent Handoff" href="/agent-handoff.json" />',
    propertyTag('og:type', seo.type),
    propertyTag('og:locale', seo.locale),
    ...seo.alternateLocales.map((locale) => propertyTag('og:locale:alternate', locale)),
    propertyTag('og:site_name', 'Web Stylebook'),
    propertyTag('og:title', seo.title),
    propertyTag('og:description', seo.description),
    propertyTag('og:url', seo.canonicalUrl),
    propertyTag('og:image', seo.image.url),
    propertyTag('og:image:width', String(seo.image.width)),
    propertyTag('og:image:height', String(seo.image.height)),
    propertyTag('og:image:type', seo.image.type),
    propertyTag('og:image:alt', seo.image.alt[lang]),
    metaTag('twitter:card', 'summary_large_image'),
    metaTag('twitter:title', seo.title),
    metaTag('twitter:description', seo.description),
    metaTag('twitter:image', seo.image.url),
    metaTag('twitter:image:alt', seo.image.alt[lang]),
    jsonScript(seo.jsonLd),
  ].join('\n    ');

  return stripManagedHead(template)
    .replace(/<html\s+lang="[^"]*"/i, `<html lang="${lang}"`)
    .replace(/<head>/i, `<head>\n    ${managed}`);
}

if (!existsSync(INDEX)) {
  throw new Error('dist/index.html does not exist. Run vite build first.');
}

const template = readFileSync(INDEX, 'utf8');
const modifiedAt = new Date().toISOString();

for (const route of publicRoutes) {
  for (const lang of languages) {
    const file = join(DIST, routeToFilePath(route, lang));
    const html = injectRouteHead(template, route, lang, modifiedAt);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, html, 'utf8');

    for (const alias of route.aliases || []) {
      const aliasFile = join(DIST, routeAliasToFilePath(alias, lang));
      mkdirSync(dirname(aliasFile), { recursive: true });
      writeFileSync(aliasFile, html, 'utf8');
    }
  }
}

/* Cloudflare Pages serves the root index.html with a 200 for any path that
 * matches no asset, which turns every bad URL into a soft 404. A 404.html in
 * the output directory is served with a real 404 status instead. It carries
 * no canonical and asks not to be indexed; the app renders its own not-found
 * view once it boots. */
const notFoundHtml = stripManagedHead(template)
  .replace(/<html\s+lang="[^"]*"/i, '<html lang="en"')
  .replace(
    /<head>/i,
    `<head>\n    ${[
      '<title>Page not found - Web Stylebook</title>',
      metaTag('description', 'This page does not exist. Start again from the Web Stylebook style catalogue.'),
      metaTag('robots', 'noindex, follow'),
      '<link rel="sitemap" type="application/xml" href="/sitemap.xml" />',
    ].join('\n    ')}`,
  );
writeFileSync(join(DIST, '404.html'), notFoundHtml, 'utf8');

const aliasCount = publicRoutes.reduce((count, route) => count + (route.aliases?.length || 0), 0);
console.log(`[static] wrote ${publicRoutes.length * languages.length} localized HTML routes, ${aliasCount * languages.length} compatibility aliases, and 404.html into dist/`);
