import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

function headerBlocks(source: string) {
  const blocks = new Map<string, Map<string, string>>();
  let current = '';
  for (const line of source.split('\n')) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;
    if (!/^[ \t]/.test(line)) {
      current = line.trim();
      blocks.set(current, new Map());
      continue;
    }
    const match = /^[ \t]+([^:]+):\s*(.*)$/.exec(line);
    if (!match || !current) throw new Error(`header outside a path: ${line}`);
    blocks.get(current)?.set(match[1], match[2]);
  }
  return blocks;
}

const blocks = headerBlocks(readFileSync(resolve(process.cwd(), 'public/_headers'), 'utf8'));
const corsPaths = ['/agent-handoff.json', '/agent-handoff.full.json', '/r/*'];

describe('published response headers', () => {
  it('sets the document security headers on every path', () => {
    const shared = blocks.get('/*');
    expect(shared?.get('X-Content-Type-Options')).toBe('nosniff');
    expect(shared?.get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(shared?.get('Strict-Transport-Security')).toBe('max-age=31536000; includeSubDomains');
    expect(shared?.get('Permissions-Policy')).toContain('camera=()');
    expect(shared?.get('Permissions-Policy')).toContain('microphone=()');
    expect(shared?.get('Permissions-Policy')).toContain('geolocation=()');
    const policy = shared?.get('Content-Security-Policy') ?? '';
    expect(policy).toContain("frame-ancestors 'self'");
    expect(policy).toContain("frame-src 'self'");
    expect(policy).toContain("script-src 'self' 'unsafe-inline'");
    expect(policy).toContain("style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net");
    expect(policy).toContain('https://fonts.gstatic.com');
    expect(policy).toContain('https://opendesign-1254041526.cos.ap-shanghai.myqcloud.com');
    expect(shared?.has('Access-Control-Allow-Origin')).toBe(false);
  });

  it('allows cross-origin reads of the agent handoff and the component registry only', () => {
    for (const path of corsPaths) {
      expect(blocks.get(path)?.get('Access-Control-Allow-Origin'), path).toBe('*');
      expect(blocks.get(path)?.get('Content-Type'), path).toContain('application/json');
    }
    for (const [path, headers] of blocks) {
      if (corsPaths.includes(path)) continue;
      expect(headers.has('Access-Control-Allow-Origin'), path).toBe(false);
    }
  });
});
