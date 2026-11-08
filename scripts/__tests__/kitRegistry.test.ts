import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildKitRegistry, KIT_ITEMS } from '../build-kit-registry.mts';

const publicDir = path.resolve(__dirname, '../../public/r');
const kitDir = path.resolve(__dirname, '../../src/kit');

describe('kit registry', () => {
  it('public/r matches src/kit (run npm run kit:registry after a kit change)', () => {
    for (const [name, content] of buildKitRegistry()) {
      expect(fs.readFileSync(path.join(publicDir, name), 'utf8'), name).toBe(content);
    }
  });

  it('lists every kit file exactly once', () => {
    const listed = KIT_ITEMS.flatMap((item) => item.files).sort();
    const onDisk = fs
      .readdirSync(kitDir, { recursive: true, encoding: 'utf8' })
      .filter((file) => /\.(tsx|css)$/.test(file))
      .map((file) => file.split(path.sep).join('/'))
      .sort();
    expect(listed).toEqual(onDisk);
  });

  it('component CSS uses theme tokens, never raw colors', () => {
    for (const item of KIT_ITEMS.filter((entry) => entry.name !== 'theme')) {
      for (const file of item.files.filter((entry) => entry.endsWith('.css'))) {
        const css = fs.readFileSync(path.join(kitDir, file), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
        expect(css, file).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|oklch\(/i);
      }
    }
  });

  it('every component imports only the theme and its own CSS', () => {
    for (const item of KIT_ITEMS.filter((entry) => entry.name !== 'theme')) {
      const tsx = item.files.find((file) => file.endsWith('.tsx'));
      expect(tsx, item.name).toBeDefined();
      const source = fs.readFileSync(path.join(kitDir, tsx!), 'utf8');
      const imports = [...source.matchAll(/import\s+(?:[^'"]+from\s+)?['"]([^'"]+)['"]/g)].map((match) => match[1]);
      const local = imports.filter((specifier) => specifier.startsWith('.'));
      expect(local.sort(), item.name).toEqual(['../theme.css', `./${item.name}.css`].sort());
      expect(imports.filter((specifier) => !specifier.startsWith('.') && specifier !== 'react'), item.name).toEqual([]);
    }
  });
});
