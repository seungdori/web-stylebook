import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import recipes from '../../src/visual/recipes.json';
import { TypographyRoleLadder } from '../../src/pages/visual-editor/TypographyRoleLadder';
import { typographySamples } from '../../src/pages/visual-editor/typographySamples';
import {
  exportVisualContract,
  resolveVisualContract,
  typographyRoleStyle,
  visualContractToCss,
  type TypographyRoleName,
} from '../../src/visual';
import { authoredTypographyRoles, typographyRecipeKind, type TypographyRecipeSource } from '../../src/visual/typographyRecipes';

const sourceRecipes = recipes as Array<TypographyRecipeSource & { id: string }>;

describe('role typography recipes', () => {
  it('builds every style from its named recipe and keeps display/body source metrics', () => {
    for (const source of sourceRecipes) {
      const built = authoredTypographyRoles(source);
      const resolved = resolveVisualContract(source.id);
      expect(resolved.typography.roles).toEqual(built.roles);
      expect(resolved.provenance.notes.some((note) => note.includes(`Typography recipe: ${built.kind}`))).toBe(true);
      expect(resolved.typography.roles.data.fontVariantNumeric).toBe('tabular-nums');
      expect(resolved.typography.roles.label.textTransform).toBe('none');
      for (const role of Object.values(resolved.typography.roles)) {
        expect(role.sizeMinRem).toBeLessThanOrEqual(role.sizeMaxRem);
      }
    }
  });

  it('keeps an editorial serif/sans relationship distinct from a dense sans and a mono console', () => {
    const editorial = resolveVisualContract('editorial-silence');
    const operational = resolveVisualContract('quiet-utility');
    // Batch 4 rebuilt terminal-core in VT323 and Inconsolata; fusion-quiet-manifesto keeps one JetBrains Mono for every role.
    const consoleStyle = resolveVisualContract('fusion-quiet-manifesto');
    const poster = resolveVisualContract('brutalist-grid');
    const mixedMono = resolveVisualContract('mono-type');

    expect(typographyRecipeKind(editorial.typography.roles.display.fontFamily, editorial.typography.roles.body.fontFamily)).toBe('editorial');
    // Batch 4: the rebuilt Editorial Silence sets Spectral 200 at clamp(2.25rem, 3.25rem)/1.05, -0.035em
    // and Instrument Sans 400 at 1.6 (recipe and .sy-head h2 / page root), was Noto Serif KR 700 and 1.75.
    expect(editorial.typography.roles.display).toMatchObject({
      fontFamily: "'Spectral', Georgia, serif",
      fontWeight: 200,
      lineHeight: 1.05,
      letterSpacingEm: -0.035,
      sizeMinRem: 2.25,
      sizeMaxRem: 3.25,
    });
    expect(editorial.typography.roles.body).toMatchObject({
      fontFamily: "'Instrument Sans', system-ui, sans-serif",
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacingEm: 0,
    });
    expect(editorial.typography.roles.heading.fontFamily).toContain('Spectral');
    expect(editorial.typography.roles.label.fontFamily).toContain('Instrument Sans');
    expect(editorial.typography.roles.caption.fontFamily).toContain('Instrument Sans');
    expect(editorial.typography.roles.data.fontFamily).toMatch(/monospace/);
    expect(editorial.typography.roles.label.letterSpacingEm).toBeGreaterThan(0);

    expect(typographyRecipeKind("'Inter', sans-serif", "'Inter', sans-serif")).toBe('operational');
    expect(operational.typography.roles.heading.fontFamily).toContain('Inter');
    expect(operational.typography.roles.body.measureCh).toBeLessThan(editorial.typography.roles.body.measureCh);
    expect(operational.typography.roles.heading.sizeMaxRem).toBeLessThan(editorial.typography.roles.heading.sizeMaxRem);
    expect(operational.typography.roles.label.fontFamily).toContain('Inter');

    expect(typographyRecipeKind("'JetBrains Mono', monospace", "'JetBrains Mono', monospace")).toBe('console');
    for (const role of ['display', 'heading', 'body', 'label', 'caption', 'data'] as const) {
      expect(consoleStyle.typography.roles[role].fontFamily).toContain('JetBrains Mono');
    }
    // Batch 4: fusion-quiet-manifesto's own recipe leading (display 0.95, body 1.55) replaces terminal-core's old 1.05 and 1.7.
    expect(consoleStyle.typography.roles.display.lineHeight).toBe(0.95);
    expect(consoleStyle.typography.roles.body.lineHeight).toBe(1.55);
    expect(consoleStyle.typography.roles.label.letterSpacingEm).toBe(0);
    expect(consoleStyle.typography.roles.heading.sizeMaxRem).not.toBe(operational.typography.roles.heading.sizeMaxRem);

    // Batch 4: the rebuilt Brutalist Grid sets Anton 400 at 0.9, 0.005em and Overpass Mono at 1.6 (recipe, .ci-h2 and .ci),
    // was Archivo Black at 0.82, -0.04em and IBM Plex Mono at 1.65.
    expect(poster.typography.roles.display).toMatchObject({
      fontFamily: "'Anton', 'Impact', 'Arial Narrow', sans-serif",
      fontWeight: 400,
      lineHeight: 0.9,
      letterSpacingEm: 0.005,
    });
    expect(poster.typography.roles.body).toMatchObject({
      fontFamily: "'Overpass Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace",
      lineHeight: 1.6,
      letterSpacingEm: 0,
    });
    expect(poster.typography.roles.heading.fontFamily).toContain('Anton');
    // Batch 4: Brutalist Grid's display token is now its 4.5rem section heading, so its derived heading (1.89rem) no longer
    // out-scales Editorial Silence's (1.97rem). fusion-kinetic-brutal is the poster ladder that still does (8rem display, 3.36rem heading).
    expect(resolveVisualContract('fusion-kinetic-brutal').typography.roles.heading.sizeMaxRem).toBeGreaterThan(editorial.typography.roles.heading.sizeMaxRem);
    expect(poster.typography.roles.data.fontFamily).toContain('Overpass Mono');

    expect(mixedMono.typography.roles.display.fontFamily).toBe("'Space Mono', monospace");
    expect(mixedMono.typography.roles.body.fontFamily).toContain('Noto Sans KR');
    expect(mixedMono.typography.roles.data.fontFamily).toContain('Space Mono');
    expect(mixedMono.typography.roles.body.fontFamily).not.toContain('Space Mono');
  });

  it('carries authored font, line-height, letter-spacing, and weight through CSS and JSON', () => {
    const editorial = resolveVisualContract('editorial-silence');
    const poster = resolveVisualContract('brutalist-grid');
    for (const spec of [editorial, poster]) {
      const css = visualContractToCss(spec);
      const json = JSON.parse(exportVisualContract(spec, 'json').rendered) as typeof spec;
      for (const name of ['display', 'body', 'heading', 'label', 'caption', 'data'] as const) {
        const role = spec.typography.roles[name];
        expect(json.typography.roles[name]).toEqual(role);
        expect(css).toContain(`--type-${name}-font-family: ${role.fontFamily};`);
        expect(css).toContain(`--type-${name}-font-weight: ${role.fontWeight};`);
        expect(css).toContain(`--type-${name}-line-height: ${role.lineHeight};`);
        expect(css).toContain(`--type-${name}-letter-spacing: ${role.letterSpacingEm}em;`);
        expect(typographyRoleStyle(role).lineHeight).toBe(role.lineHeight);
        expect(typographyRoleStyle(role).letterSpacing).toBe(`${role.letterSpacingEm}em`);
        expect(typographyRoleStyle(role).fontWeight).toBe(role.fontWeight);
        expect(typographyRoleStyle(role).fontFamily).toBe(role.fontFamily);
      }
    }
    expect(visualContractToCss(editorial)).toContain('clamp(');
    const edited = resolveVisualContract('editorial-silence', {
      overrides: { typography: { body: { lineHeight: 1.9, letterSpacingEm: 0.02, fontWeight: 500 } } },
    });
    expect(edited.colors).toEqual(editorial.colors);
    expect(edited.typography.roles.display).toEqual(editorial.typography.roles.display);
    expect(edited.typography.roles.body.lineHeight).toBe(1.9);
    expect(edited.typography.roles.body.letterSpacingEm).toBe(0.02);
    expect(edited.typography.roles.body.fontWeight).toBe(500);
    const editedCss = visualContractToCss(edited);
    expect(editedCss).toContain('--type-body-line-height: 1.9;');
    expect(editedCss).toContain('--type-body-letter-spacing: 0.02em;');
    expect(editedCss).toContain('--type-body-font-weight: 500;');
    expect(editedCss).toContain(`--type-display-letter-spacing: ${editorial.typography.roles.display.letterSpacingEm}em;`);
  });

  it('keeps authored weight while the portable locale pass adjusts CJK tracking and short leading', () => {
    // Batch 4: the rebuilt Brutalist Grid sets its body at 1.6, under the 1.65 CJK floor, so Korean no longer leaves its
    // body leading alone. mono-type still pairs a short, tracked display (0.95, -0.03em) with a body above the floor (1.85).
    const english = resolveVisualContract('mono-type');
    const korean = resolveVisualContract('mono-type', { contentLocale: 'ko' });
    expect(english.typography.roles.display.letterSpacingEm).toBe(-0.03);
    expect(english.typography.roles.display.lineHeight).toBe(0.95);
    expect(korean.typography.roles.display.fontWeight).toBe(english.typography.roles.display.fontWeight);
    expect(korean.typography.roles.display.letterSpacingEm).toBe(0);
    expect(korean.typography.roles.display.lineHeight).toBeGreaterThan(english.typography.roles.display.lineHeight);
    expect(korean.typography.roles.body.lineHeight).toBe(english.typography.roles.body.lineHeight);
    const css = visualContractToCss(korean);
    expect(css).toContain('--type-display-letter-spacing: 0em;');
    expect(css).toContain(`--type-display-font-weight: ${korean.typography.roles.display.fontWeight};`);
    expect(css).toContain(`--type-body-line-height: ${korean.typography.roles.body.lineHeight};`);
  });
});

describe('typography role ladder', () => {
  it('renders EN, KO, and JA samples from the same resolved roles the export uses', () => {
    const spec = resolveVisualContract('editorial-silence');
    for (const locale of ['en', 'ko', 'ja'] as const) {
      const html = renderToStaticMarkup(createElement(TypographyRoleLadder, {
        spec: resolveVisualContract('editorial-silence', { contentLocale: locale }),
        contentLocale: locale,
        uiLang: 'en',
        width: locale === 'ko' ? 'narrow' : 'wide',
        activeRole: 'body',
      }));
      expect(html).toContain(`lang="${locale}"`);
      expect(html).toContain(typographySamples[locale].display);
      expect(html).toContain(typographySamples[locale].body);
      expect(html).toContain('https://notes.example.com/field-notes/a-slower-way-to-travel');
      expect(html).toContain('12,480.50');
      for (const name of Object.keys(typographySamples.en) as TypographyRoleName[]) {
        expect(html).toContain(`data-type-role="${name}"`);
      }
    }
    const koreanUi = renderToStaticMarkup(createElement(TypographyRoleLadder, {
      spec,
      contentLocale: 'en',
      uiLang: 'ko',
      width: 'narrow',
      activeRole: 'display',
    }));
    expect(koreanUi).toContain(typographySamples.en.heading);
    expect(koreanUi).not.toContain(typographySamples.ko.display);
    expect(koreanUi).toContain('큰 제목');
    expect(koreanUi).toContain('data-width="narrow"');
    expect(koreanUi).toContain('data-active="true"');
    expect(koreanUi).toContain(`line-height:${spec.typography.roles.display.lineHeight}`);
    expect(koreanUi).toContain(`letter-spacing:${spec.typography.roles.display.letterSpacingEm}em`);
    expect(koreanUi).toContain(`font-weight:${spec.typography.roles.body.fontWeight}`);
    // Batch 4: the rebuilt Editorial Silence display face is Spectral, was Noto Serif KR.
    expect(koreanUi).toContain('Spectral');
    expect(visualContractToCss(spec)).toContain(`--type-display-line-height: ${spec.typography.roles.display.lineHeight};`);
    expect(visualContractToCss(spec)).toContain(`--type-body-font-weight: ${spec.typography.roles.body.fontWeight};`);
  });
});
