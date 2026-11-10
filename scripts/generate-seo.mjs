import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildRobotsTxt, buildSitemapXml } from '../src/data/sitemap.ts';
import { publicRoutes, languages } from '../src/data/routes.ts';

// Published files belong to the build output. Building must not rewrite the
// repository's legacy sitemap, or replace authored dates with today's date.
const dist = join(process.cwd(), 'dist');
mkdirSync(dist, { recursive: true });
writeFileSync(join(dist, 'sitemap.xml'), buildSitemapXml(), 'utf8');
writeFileSync(join(dist, 'robots.txt'), buildRobotsTxt(), 'utf8');
console.log(`[seo] wrote ${publicRoutes.length * languages.length} canonical URLs and robots.txt into dist/`);
