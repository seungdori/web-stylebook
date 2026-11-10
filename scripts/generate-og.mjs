import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import { ogCardSpecs } from '../src/data/seo.ts';

// A small original bitmap alphabet keeps builds deterministic and offline:
// no browser, system font, remote font, or image service is needed.
const glyphs = {
  A: [14,17,17,31,17,17,17], B: [30,17,17,30,17,17,30],
  C: [14,17,16,16,16,17,14], D: [30,17,17,17,17,17,30],
  E: [31,16,16,30,16,16,31], F: [31,16,16,30,16,16,16],
  G: [14,17,16,23,17,17,15], H: [17,17,17,31,17,17,17],
  I: [31,4,4,4,4,4,31], J: [7,2,2,2,18,18,12],
  K: [17,18,20,24,20,18,17], L: [16,16,16,16,16,16,31],
  M: [17,27,21,21,17,17,17], N: [17,25,21,19,17,17,17],
  O: [14,17,17,17,17,17,14], P: [30,17,17,30,16,16,16],
  Q: [14,17,17,17,21,18,13], R: [30,17,17,30,20,18,17],
  S: [15,16,16,14,1,1,30], T: [31,4,4,4,4,4,4],
  U: [17,17,17,17,17,17,14], V: [17,17,17,17,17,10,4],
  W: [17,17,17,21,21,21,10], X: [17,17,10,4,10,17,17],
  Y: [17,17,10,4,4,4,4], Z: [31,1,2,4,8,16,31],
  0: [14,17,19,21,25,17,14], 1: [4,12,4,4,4,4,14],
  2: [14,17,1,2,4,8,31], 3: [30,1,1,14,1,1,30],
  4: [2,6,10,18,31,2,2], 5: [31,16,16,30,1,1,30],
  6: [14,16,16,30,17,17,14], 7: [31,1,2,4,8,8,8],
  8: [14,17,17,14,17,17,14], 9: [14,17,17,15,1,1,14],
  '-': [0,0,0,31,0,0,0], '.': [0,0,0,0,0,12,12],
  '/': [1,1,2,4,8,16,16], '&': [12,18,20,8,21,18,13],
  ':': [0,12,12,0,12,12,0], ' ': [0,0,0,0,0,0,0],
};

function rgb(hex) {
  if (!/^#[\da-f]{6}$/i.test(hex)) throw new Error(`Invalid card color: ${hex}`);
  return [1,3,5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
}

function rect(png, x, y, width, height, color) {
  const [r,g,b] = rgb(color);
  for (let row = y; row < Math.min(y + height, png.height); row++) {
    for (let col = x; col < Math.min(x + width, png.width); col++) {
      const offset = (row * png.width + col) * 4;
      png.data[offset] = r;
      png.data[offset + 1] = g;
      png.data[offset + 2] = b;
      png.data[offset + 3] = 255;
    }
  }
}

function text(png, value, x, y, scale, color) {
  for (const letter of value) {
    const rows = glyphs[letter];
    if (!rows) throw new Error(`Unsupported card letter: ${letter}`);
    rows.forEach((bits, row) => {
      for (let col = 0; col < 5; col++) {
        if (bits & (1 << (4 - col))) rect(png, x + col * scale, y + row * scale, scale, scale, color);
      }
    });
    x += scale * 6;
  }
}

/** @param {import('../src/data/seo.ts').OgCardSpec} spec */
export function renderOgCard(spec) {
  const png = new PNG({ width: 1200, height: 630 });
  const title = spec.title.toUpperCase().replace(/×/g, 'X').replace(/[–—]/g, '-').replace(/[^A-Z0-9 &./:-]/g, ' ').replace(/\s+/g, ' ').trim();
  const lines = [''];
  for (const word of title.split(' ')) {
    const index = lines.length - 1;
    if (lines[index] && `${lines[index]} ${word}`.length > 25) lines.push(word);
    else lines[index] = [lines[index], word].filter(Boolean).join(' ');
  }
  if (lines.length > 3 || lines.some((line) => line.length > 25)) throw new Error(`Card title needs a shorter layout: ${spec.title}`);
  rect(png, 0, 0, 1200, 630, '#f6f4f2');
  rect(png, 0, 0, 1200, 12, spec.accent);
  text(png, 'WEB STYLEBOOK', 64, 60, 4, '#1a1715');
  lines.forEach((line, index) => text(png, line, 64, 170 + index * 70, 7, '#1a1715'));
  const swatches = spec.swatches.length ? spec.swatches : [spec.accent];
  const width = Math.floor(1072 / swatches.length);
  swatches.forEach((color, index) => rect(png, 64 + index * width, 425, width, 90, color));
  text(png, 'WEBSTYLEBOOK.COM', 64, 558, 3, '#1a1715');
  return PNG.sync.write(png);
}

export function generateOgCards(outDir = resolve('dist')) {
  const specs = ogCardSpecs();
  for (const spec of specs) {
    if (!/^\/og\/(?:[a-z0-9-]+\/)*[a-z0-9-]+\.png$/.test(spec.file)) throw new Error(`Invalid OG path: ${spec.file}`);
    const file = join(outDir, spec.file.slice(1));
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, renderOgCard(spec));
  }
  console.log(`[og] wrote ${specs.length} deterministic 1200x630 cards into ${outDir}/og/`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) generateOgCards();
