import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PNG } from 'pngjs';
import { describe, expect, it } from 'vitest';
import { buildRouteSeo, ogCardSpecs } from '../../src/data/seo';
import { languages, publicRoutes, routeToFilePath } from '../../src/data/routes';
import { buildSitemapXml } from '../../src/data/sitemap';

const dist = (...parts: string[]) => join(process.cwd(), 'dist', ...parts);

describe('published SEO artifacts', () => {
  it('writes canonical metadata and an existing OG card for every public page', () => {
    for (const route of publicRoutes) for (const lang of languages) {
      const html = readFileSync(dist(routeToFilePath(route, lang)), 'utf8');
      const seo = buildRouteSeo(route, lang);
      expect(html).toContain(`rel="canonical" href="${seo.canonicalUrl}"`);
      expect(html).toContain(`property="og:image" content="${seo.image.url}"`);
      expect(html).toContain(`hreflang="x-default" href="${seo.alternates.en}"`);
      expect(html).toContain(`"dateModified": "${String((seo.jsonLd['@graph'] as Array<Record<string, unknown>>).find((node) => node.dateModified)?.dateModified)}"`);
      expect(readFileSync(dist(new URL(seo.image.url).pathname.slice(1))).subarray(1,4).toString()).toBe('PNG');
    }
  });

  it('builds every sharing card at the declared size', () => {
    for (const spec of ogCardSpecs()) {
      const png = PNG.sync.read(readFileSync(dist(spec.file.slice(1))));
      expect([png.width, png.height], spec.file).toEqual([1200,630]);
    }
  });

  it('uses authored dates and localized not-found documents', () => {
    expect(readFileSync(dist('sitemap.xml'), 'utf8')).toBe(buildSitemapXml());
    for (const lang of languages) {
      const html = readFileSync(dist(lang === 'en' ? '404.html' : `404.${lang}.html`), 'utf8');
      expect(html).toContain(`<html lang="${lang}"`);
      expect(html).toContain('content="noindex, follow"');
      expect(html).not.toContain('rel="canonical"');
      expect(html).not.toContain('property="og:');
      expect(html).not.toContain('application/ld+json');
    }
  });
});
