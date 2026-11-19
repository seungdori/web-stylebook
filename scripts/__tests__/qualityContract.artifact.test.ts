import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { siteUrl } from '../../src/data/routes';
import { getVisualContract } from '../../src/visual';
import { loadStyleFieldExpectations, staticFieldViolations } from '../quality-contract.mts';

describe('built static artifacts', () => {
  it('matches dist/agent-handoff to the reviewed field literals', () => {
    const directory = join(process.cwd(), 'dist/agent-handoff');
    expect(existsSync(directory), 'npm run build must write dist/agent-handoff before this parity check').toBe(true);
    const violations = loadStyleFieldExpectations().flatMap((expected) => {
      if (expected.mode !== getVisualContract(expected.styleId).defaultMode) return [];
      const path = join(directory, `${expected.styleId}.${expected.contentLocale}.json`);
      if (!existsSync(path)) return [`missing static artifact ${expected.styleId}.${expected.contentLocale}.json`];
      return staticFieldViolations(expected, readFileSync(path, 'utf8'));
    });
    expect(violations).toEqual([]);
  });

  it('publishes the canonical origin and writes the sitemap only under dist', () => {
    const root = process.cwd();
    const slim = readFileSync(join(root, 'dist/agent-handoff.json'), 'utf8');
    expect(slim).toContain(`${siteUrl}/pages/`);
    expect(slim).not.toContain('https://www.webstylebook.com');
    expect(existsSync(join(root, 'dist/sitemap.xml'))).toBe(true);
    expect(existsSync(join(root, 'dist/robots.txt'))).toBe(true);
    expect(readFileSync(join(root, 'dist/robots.txt'), 'utf8')).toContain(`Sitemap: ${siteUrl}/sitemap.xml`);
    expect(existsSync(join(root, 'sitemap.xml'))).toBe(false);
    expect(existsSync(join(root, 'robots.txt'))).toBe(false);
  });
});
