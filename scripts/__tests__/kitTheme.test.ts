import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { visualContrastRatio } from '../../src/visual/contrast';
import { resolveVisualContract } from '../../src/visual/contracts';

const themeCss = fs.readFileSync(path.resolve(__dirname, '../../src/kit/theme.css'), 'utf8');

function rootTokens(css: string): Map<string, string> {
  const start = css.indexOf(':root {');
  const end = css.indexOf('}', start);
  if (start < 0 || end < 0) throw new Error('theme.css has no :root block');
  const block = css.slice(start, end);
  return new Map([...block.matchAll(/(--ws-[\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]));
}

const tokens = rootTokens(themeCss);

function color(name: string): string {
  const value = tokens.get(`--ws-color-${name}`);
  if (!value) throw new Error(`Missing --ws-color-${name}`);
  return value;
}

function ratio(foreground: string, background: string): number {
  const value = visualContrastRatio(color(foreground), color(background));
  if (value === null) throw new Error(`Cannot measure ${foreground} on ${background}`);
  return value;
}

const SURFACES = ['canvas', 'surface', 'surface-hover', 'panel', 'inset'];
const TONES = ['neutral', 'info', 'positive', 'caution', 'critical'];

describe('kit theme: Quiet Utility', () => {
  it.each(SURFACES.flatMap((surface) => ['text', 'text-muted'].map((text) => [text, surface])))(
    'text %s on %s reaches 4.5:1',
    (text, surface) => {
      expect(ratio(text, surface)).toBeGreaterThanOrEqual(4.5);
    },
  );

  it.each([['on-accent', 'accent'], ['on-accent', 'accent-hover']])('%s on %s reaches 4.5:1', (text, fill) => {
    expect(ratio(text, fill)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(TONES)('%s badge text reaches 4.5:1 on its tint and its mark reaches 3:1', (tone) => {
    expect(ratio(`${tone}-text`, `${tone}-tint`)).toBeGreaterThanOrEqual(4.5);
    expect(ratio(`${tone}-mark`, `${tone}-tint`)).toBeGreaterThanOrEqual(3);
  });

  it.each(['canvas', 'surface', 'panel'])('focus ring and field boundary reach 3:1 on %s', (surface) => {
    expect(ratio('focus', surface)).toBeGreaterThanOrEqual(3);
    expect(ratio('field-line', surface)).toBeGreaterThanOrEqual(3);
  });

  it('keeps edges visible: lines reach the 22%-black-on-white floor', () => {
    // 22% black over white is #c7c7c7, 1.69:1 on white.
    for (const line of ['divider', 'line', 'line-hover', ...TONES.map((tone) => `${tone}-line`)]) {
      expect(ratio(line, 'panel')).toBeGreaterThanOrEqual(1.69);
    }
  });

  it('matches the Quiet Utility VisualContract base colors', () => {
    const contract = resolveVisualContract('quiet-utility').colors;
    expect(color('canvas')).toBe(contract.canvas);
    expect(color('surface')).toBe(contract.surface);
    expect(color('text')).toBe(contract.text);
    expect(color('text-muted')).toBe(contract.textMuted);
    expect(color('accent')).toBe(contract.accent);
  });
});
