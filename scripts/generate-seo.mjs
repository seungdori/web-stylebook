import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const CONFIG_PATH = join(ROOT, 'site.config.json');
const CNAME_PATH = join(ROOT, 'CNAME');
const PAGES_DIR = join(ROOT, 'pages');

function normalizeSiteUrl(value) {
  if (!value) return '';
  return value.trim().replace(/\/+$/, '');
}

function loadConfig() {
  if (!existsSync(CONFIG_PATH)) return {};
  try {
    return JSON.parse(readFileSync(CONFIG_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function inferSiteUrl(config) {
  const envUrl = normalizeSiteUrl(process.env.SITE_URL || '');
  if (envUrl) return envUrl;

  const configUrl = normalizeSiteUrl(config.siteUrl || '');
  if (configUrl) return configUrl;

  if (existsSync(CNAME_PATH)) {
    const cname = readFileSync(CNAME_PATH, 'utf8').trim();
    if (cname) return `https://${cname}`;
  }

  const repo = process.env.GITHUB_REPOSITORY || '';
  const [owner, name] = repo.split('/');
  if (owner && name) return `https://${owner}.github.io/${name}`;

  return 'https://example.com';
}

function collectRoutes() {
  const routes = [{ path: '/index.html', sitemapPath: '/' }];

  if (!existsSync(PAGES_DIR)) return routes;

  const htmlFiles = readdirSync(PAGES_DIR)
    .filter((name) => name.endsWith('.html'))
    .sort((a, b) => a.localeCompare(b));

  for (const file of htmlFiles) {
    routes.push({
      path: `/pages/${file}`,
      sitemapPath: `/pages/${file}`,
    });
  }

  return routes;
}

function getLastMod(filePath) {
  try {
    return statSync(join(ROOT, filePath)).mtime.toISOString().slice(0, 10);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function buildSitemap(siteUrl, routes) {
  const entries = routes
    .map((route) => {
      const loc = `${siteUrl}${route.sitemapPath}`;
      const lastmod = getLastMod(route.path.slice(1));
      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    '</urlset>',
    '',
  ].join('\n');
}

function buildRobots(siteUrl) {
  return [`User-agent: *`, 'Allow: /', '', `Sitemap: ${siteUrl}/sitemap.xml`, ''].join('\n');
}

const config = loadConfig();
const siteUrl = inferSiteUrl(config);
const routes = collectRoutes();

writeFileSync(join(ROOT, 'sitemap.xml'), buildSitemap(siteUrl, routes), 'utf8');
writeFileSync(join(ROOT, 'robots.txt'), buildRobots(siteUrl), 'utf8');

console.log(`[seo] siteUrl=${siteUrl}`);
console.log(`[seo] routes=${routes.length}`);
console.log('[seo] wrote sitemap.xml and robots.txt');
