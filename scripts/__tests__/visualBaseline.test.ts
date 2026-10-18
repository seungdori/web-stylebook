import { describe, expect, it } from 'vitest';
import { PNG } from 'pngjs';
import {
  PIXEL_THRESHOLD,
  MAX_DIFF_PIXELS,
  TEXT_ZOOM_ROOT_PX,
  auditFonts,
  captureMatrix,
  comparePixels,
  familiesFromStylesheetUrl,
  fontAuditPages,
  parseFontFaces,
  rangeCovers,
  sameFontPage,
  scriptsInText,
  selectFace,
  unicodeRanges,
  zoomFailures,
  zoomPages,
  type RequestedFace,
} from '../visual-baseline.mts';

function png(width: number, height: number, paint: (data: Buffer) => void): Buffer {
  const image = new PNG({ width, height });
  image.data.fill(255);
  paint(image.data);
  return PNG.sync.write(image);
}

describe('visual baseline contract', () => {
  it('keeps a small per-pixel threshold and does not ignore real pixels', () => {
    expect(PIXEL_THRESHOLD).toBe(0.1);
    expect(MAX_DIFF_PIXELS).toBe(0);
    expect(TEXT_ZOOM_ROOT_PX).toBe(32);
    const same = png(2, 1, () => undefined);
    expect(comparePixels(same, png(2, 1, () => undefined)).status).toBe('pass');
    const changed = png(2, 1, (data) => { data[0] = 0; data[1] = 0; data[2] = 0; });
    const diff = comparePixels(changed, same);
    expect(diff.status).toBe('fail');
    expect(diff.mismatched).toBeGreaterThan(0);
  });

  it('covers color and typography in en/ko/ja at 320, 390, and 1440, plus same-content specimens', () => {
    const specs = captureMatrix();
    expect(new Set(specs.map((spec) => spec.id)).size).toBe(specs.length);
    for (const locale of ['en', 'ko', 'ja']) {
      for (const width of [320, 390, 1440]) {
        expect(specs.some((spec) => spec.surface === 'color' && spec.locale === locale && spec.width === width)).toBe(true);
        expect(specs.some((spec) => spec.surface === 'typography' && spec.locale === locale && spec.width === width)).toBe(true);
      }
    }
    for (const name of ['editorial', 'utility', 'expressive']) {
      for (const width of [320, 390, 1440]) {
        const spec = specs.find((item) => item.id === `compare-${name}-${width}`);
        expect(spec?.path).toContain('mode=complete');
        expect(spec?.selector).toBe('.compare-grid');
      }
    }
  });

  it('audits the zoom pages and does not put the browser gate in the unit matrix', () => {
    const zoom = zoomPages().map((page) => page.id);
    expect(zoom).toEqual([
      'home-1440', 'home-390', 'color-1440', 'color-390', 'typography-1440', 'typography-390',
      'compare-1440', 'compare-390', 'prompt-1440', 'prompt-390',
    ]);
    expect(fontAuditPages().map((page) => page.id)).toContain('home');
    expect(fontAuditPages().some((page) => page.path.startsWith('/ko/'))).toBe(true);
  });
});

describe('font network judgment', () => {
  const css = `@font-face { font-family: 'Inter'; font-weight: 400; src: url(https://fonts.gstatic.com/s/inter/a.woff2) format('woff2'); }
@font-face { font-family: "Inter"; font-weight: 700; src: url(https://fonts.gstatic.com/s/inter/b.woff2) format('woff2'); }`;

  it('parses unicode-range wildcards and basic latin', () => {
    expect(unicodeRanges('U+4??')).toEqual([[0x400, 0x4ff]]);
    expect(rangeCovers(unicodeRanges('U+0000-00FF, U+0131'), 'A ')).toBe(true);
    expect(rangeCovers(unicodeRanges('U+4??'), 'A')).toBe(false);
  });

  it('parses stylesheet families and faces', () => {
    expect(familiesFromStylesheetUrl('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@400&display=swap')).toEqual(['Space Grotesk', 'IBM Plex Mono']);
    expect(parseFontFaces(css).map((face) => face.weight)).toEqual(['400', '700']);
  });

  it('fails an unused weight and a request for every catalog family', () => {
    const elements = [{ families: ['Inter', 'sans-serif'], weight: 400, text: 'Tickets', lang: 'en' }];
    const stylesheets = [{ url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap', encodedBytes: 100, css }];
    const files = [
      { url: 'https://fonts.gstatic.com/s/inter/a.woff2', encodedBytes: 10 },
      { url: 'https://fonts.gstatic.com/s/inter/b.woff2', encodedBytes: 12 },
    ];
    const unused = auditFonts(stylesheets, files, elements, ['Inter', 'Fraunces']);
    expect(unused.failures).toContain('unused face Inter 700');
    expect(unused.status).toBe('fail');
    const onlyUsed = auditFonts(stylesheets, files.slice(0, 1), elements, ['Inter', 'Fraunces']);
    expect(onlyUsed.status).toBe('pass');
    const missingFile = auditFonts([{ url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap', encodedBytes: 10, css: '' }], [], elements, ['Inter', 'Fraunces']);
    expect(missingFile.failures).toContain('rendered Inter without a font file');
    const everyone = auditFonts(
      [
        { url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap', encodedBytes: 1, css: css.split('\n')[0] },
        { url: 'https://fonts.googleapis.com/css2?family=Fraunces:wght@400&display=swap', encodedBytes: 1, css: `@font-face { font-family: 'Fraunces'; font-weight: 400; src: url(https://fonts.gstatic.com/s/fraunces/a.woff2); }` },
      ],
      [
        { url: 'https://fonts.gstatic.com/s/inter/a.woff2', encodedBytes: 10 },
        { url: 'https://fonts.gstatic.com/s/fraunces/a.woff2', encodedBytes: 10 },
      ],
      [
        { families: ['Inter', 'sans-serif'], weight: 400, text: 'A', lang: 'en' },
        { families: ['Fraunces', 'serif'], weight: 400, text: 'B', lang: 'en' },
      ],
      ['Inter', 'Fraunces'],
    );
    expect(everyone.failures.some((failure) => failure.startsWith('loaded all'))).toBe(true);
  });

  it('drops a speculative subset whose range the painted text never uses', () => {
    const css = `@font-face { font-family: 'Dela Gothic One'; font-weight: 400; src: url(https://fonts.gstatic.com/s/dela/latin.woff2); unicode-range: U+0000-00FF; }
@font-face { font-family: 'Dela Gothic One'; font-weight: 400; src: url(https://fonts.gstatic.com/s/dela/jp.woff2); unicode-range: U+3000-30FF; }`;
    const result = auditFonts(
      [{ url: 'https://fonts.googleapis.com/css2?family=Dela+Gothic+One&display=swap', encodedBytes: 8, css }],
      [
        { url: 'https://fonts.gstatic.com/s/dela/latin.woff2', encodedBytes: 100 },
        { url: 'https://fonts.gstatic.com/s/dela/jp.woff2', encodedBytes: 40 },
      ],
      [{ families: ['Dela Gothic One', 'sans-serif'], weight: 400, text: 'あ', lang: 'ja' }],
      ['Dela Gothic One', 'Inter'],
    );
    expect(result.status).toBe('pass');
    expect(result.faces).toEqual([{ family: 'Dela Gothic One', weight: '400', bytes: 40, files: 1 }]);
  });

  it('keeps one variable file on the span of every weight that lists it', () => {
    const css = `@font-face { font-family: 'Inter'; font-weight: 600; src: url(https://fonts.gstatic.com/s/inter/v.woff2); }
@font-face { font-family: 'Inter'; font-weight: 800; src: url(https://fonts.gstatic.com/s/inter/v.woff2); }`;
    const result = auditFonts(
      [{ url: 'https://fonts.googleapis.com/css2?family=Inter:wght@600;800&display=swap', encodedBytes: 4, css }],
      [{ url: 'https://fonts.gstatic.com/s/inter/v.woff2', encodedBytes: 30 }],
      [{ families: ['Inter', 'sans-serif'], weight: 600, text: 'Tickets', lang: 'en' }],
      ['Inter', 'Fraunces'],
    );
    expect(result.status).toBe('pass');
    expect(result.faces).toEqual([{ family: 'Inter', weight: '600 800', bytes: 30, files: 1 }]);
  });

  it('treats a variable face as used across its weight range and prefers the nearer static face', () => {
    const variable: RequestedFace = { family: 'Inter', weight: '300 900', bytes: 20, files: 1 };
    expect(selectFace([variable], 650)?.weight).toBe('300 900');
    const faces: RequestedFace[] = [
      { family: 'Inter', weight: '400', bytes: 1, files: 1 },
      { family: 'Inter', weight: '700', bytes: 1, files: 1 },
    ];
    expect(selectFace(faces, 650)?.weight).toBe('700');
    expect(scriptsInText('가격 12', 'ko')).toEqual(['hangul', 'latin']);
  });

  it('pins the committed face list', () => {
    const page = {
      id: 'home', path: '/', status: 'pass' as const, failures: [], totalBytes: 10,
      stylesheetFamilies: ['Inter'], faces: [{ family: 'Inter', weight: '400', bytes: 10, files: 1 }],
    };
    expect(sameFontPage(page, page)).toEqual([]);
    expect(sameFontPage({ ...page, faces: [{ family: 'Inter', weight: '700', bytes: 10, files: 1 }] }, page)[0]).toMatch(/changed/);
  });
});

describe('text zoom failures', () => {
  const box = { left: 0, top: 0, right: 40, bottom: 20, clipped: false, textClipped: false };

  it('reports overflow, clipping, and overlap, and ignores a control inside another', () => {
    expect(zoomFailures({
      page: 'home-1440', width: 1440, scrollWidth: 1600, clientWidth: 1440,
      controls: [{ id: 1, parentId: null, name: 'Menu', ...box }],
    })[0]).toMatch(/horizontal overflow/);
    expect(zoomFailures({
      page: 'color-390', width: 390, scrollWidth: 390, clientWidth: 390,
      controls: [{ id: 1, parentId: null, name: 'Save', ...box, clipped: true }],
    })).toEqual(['color-390: clipped Save']);
    const overlap = zoomFailures({
      page: 'prompt-1440', width: 1440, scrollWidth: 1440, clientWidth: 1440,
      controls: [
        { id: 1, parentId: null, name: 'Copy', ...box },
        { id: 2, parentId: null, name: 'Undo', left: 10, top: 0, right: 50, bottom: 20, clipped: false, textClipped: false },
      ],
    });
    expect(overlap).toEqual(['prompt-1440: overlapping Copy ∩ Undo']);
    expect(zoomFailures({
      page: 'prompt-1440', width: 1440, scrollWidth: 1440, clientWidth: 1440,
      controls: [
        { id: 1, parentId: null, name: 'Form', ...box, right: 80 },
        { id: 2, parentId: 1, name: 'Email', left: 8, top: 2, right: 40, bottom: 16, clipped: false, textClipped: false },
      ],
    })).toEqual([]);
  });
});
