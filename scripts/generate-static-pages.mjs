import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { publicRoutes, languages, localizedRouteUrl, routeAliasToFilePath, routeToFilePath, routeUrl } from '../src/data/routes.ts';

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
  return [
    ...languages.map((lang) => `<link rel="alternate" hreflang="${lang}" href="${localizedRouteUrl(route.path, lang)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${routeUrl(route.path)}" />`,
  ].join('\n    ');
}

function stripManagedHead(html) {
  return html
    .replace(/<title\b[\s\S]*?<\/title>/i, '')
    .replace(/\s*<meta\s+name="description"[\s\S]*?>/gi, '')
    .replace(/\s*<meta\s+name="robots"[\s\S]*?>/gi, '')
    .replace(/\s*<meta\s+property="og:(title|description|url)"[\s\S]*?>/gi, '')
    .replace(/\s*<meta\s+name="twitter:(title|description)"[\s\S]*?>/gi, '')
    .replace(/\s*<link\s+rel="canonical"[\s\S]*?>/gi, '')
    .replace(/\s*<link\s+rel="alternate"[\s\S]*?>/gi, '')
    .replace(/\s*<link\s+rel="sitemap"[\s\S]*?>/gi, '');
}

function injectRouteHead(template, route) {
  const title = route.title.en;
  const description = route.description.en;
  const canonical = routeUrl(route.path);
  const managed = [
    `<title>${escapeHtml(title)}</title>`,
    metaTag('description', description),
    metaTag('robots', 'index, follow'),
    `<link rel="canonical" href="${canonical}" />`,
    alternateTags(route),
    '<link rel="sitemap" type="application/xml" href="/sitemap.xml" />',
    '<link rel="alternate" type="application/json" title="Web Stylebook Agent Handoff" href="/agent-handoff.json" />',
    propertyTag('og:title', title),
    propertyTag('og:description', description),
    propertyTag('og:url', canonical),
    metaTag('twitter:title', title),
    metaTag('twitter:description', description),
  ].join('\n    ');

  return stripManagedHead(template).replace(/<head>/i, `<head>\n    ${managed}`);
}

if (!existsSync(INDEX)) {
  throw new Error('dist/index.html does not exist. Run vite build first.');
}

const template = readFileSync(INDEX, 'utf8');

for (const route of publicRoutes) {
  const file = join(DIST, routeToFilePath(route));
  const html = injectRouteHead(template, route);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html, 'utf8');

  for (const alias of route.aliases || []) {
    const aliasFile = join(DIST, routeAliasToFilePath(alias));
    mkdirSync(dirname(aliasFile), { recursive: true });
    writeFileSync(aliasFile, html, 'utf8');
  }
}

const aliasCount = publicRoutes.reduce((count, route) => count + (route.aliases?.length || 0), 0);
console.log(`[static] wrote ${publicRoutes.length} HTML routes and ${aliasCount} compatibility aliases into dist/`);
