import { describe, expect, it } from 'vitest';
import { onRequest } from '../../src/data/pageMiddleware';

function context(path: string) {
  const fetched: string[] = [];
  return {
    fetched,
    request: new Request(`https://webstylebook.com${path}`),
    env: { ASSETS: { fetch: async (input: Request | string) => {
      const pathname = new URL(typeof input === 'string' ? input : input.url).pathname;
      fetched.push(pathname);
      return new Response(`asset:${pathname}`, { headers: { 'content-type': 'text/html' } });
    } } },
    next: async () => new Response('missing', { status: 404 }),
  };
}

describe('public page middleware', () => {
  it('redirects an alias and language query once, then serves the canonical asset', async () => {
    const redirected = await onRequest(context('/pages/components/button/index.html?lang=ko&demo=1'));
    expect(redirected.status).toBe(308);
    expect(redirected.headers.get('location')).toBe('https://webstylebook.com/ko/pages/components/button?demo=1');
    const canonical = context('/ko/pages/components/button?demo=1');
    const response = await onRequest(canonical);
    expect(response.status).toBe(200);
    expect(canonical.fetched).toEqual(['/ko/pages/components/button.html']);
  });

  it.each(['/ko/missing', '/404.ko.html'])('returns a Korean 404 for %s', async (path) => {
    const response = await onRequest(context(path));
    expect(response.status).toBe(404);
    expect(response.headers.get('x-robots-tag')).toBe('noindex, follow');
    expect(await response.text()).toBe('asset:/404.ko.html');
  });

  it('keeps missing assets as assets and unimplemented references as not-found', async () => {
    const asset = await onRequest(context('/missing.png'));
    expect(await asset.text()).toBe('missing');
    const reference = await onRequest(context('/pages/references/aeon'));
    expect(reference.status).toBe(404);
    expect(reference.headers.get('x-robots-tag')).toBe('noindex, follow');
  });
});
