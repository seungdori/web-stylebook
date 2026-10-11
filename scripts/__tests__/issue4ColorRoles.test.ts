import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { styleCatalog } from '../../src/data/styles';
import { colorPreviewRegions, colorPreviewVariables } from '../../src/pages/visual-editor/colorPreview';
import {
  assessContrast,
  COLOR_ROLES,
  exportVisualContract,
  proposeContrastRepairs,
  resolveVisualContract,
  visualContractToCss,
  visualContractToTheme,
  visualContracts,
} from '../../src/visual';

const genericSoftShadows = [
  '0 1px 2px rgba(0,0,0,0.06)',
  '0 4px 12px rgba(0,0,0,0.10)',
  '0 12px 32px rgba(0,0,0,0.16)',
];

describe('issue 4 color role regressions', () => {
  it('keeps brutalist body text distinct from the red accent the old palette index used as text', () => {
    const style = styleCatalog.find((item) => item.id === 'brutalist-grid')!;
    const positionalText = style.palette[style.palette.length - 1]!;
    expect(positionalText.toLowerCase()).toBe('#d72600');
    expect(style.accent.toLowerCase()).toBe('#d72600');
    const spec = resolveVisualContract('brutalist-grid');
    expect(spec.colors.text.toLowerCase()).toMatch(/^#(?:111|111111)$/);
    expect(spec.colors.accent.toLowerCase()).toBe('#d72600');
    expect(spec.colors.text.toLowerCase()).not.toBe(spec.colors.accent.toLowerCase());
    expect(spec.colors.actionPrimary.toLowerCase()).toBe('#d72600');
    expect(spec.colors.canvas.toLowerCase()).toBe('#e6e6e1');
    const css = visualContractToCss(spec);
    expect(css).toContain('--color-text: #111;');
    expect(css).toContain('--color-bg: #e6e6e1;');
    expect(css).toContain('--color-primary: #d72600;');
    expect(css).toContain('--color-secondary: #fff;');
    expect(css).not.toMatch(/--color-text:\s*#d72600/i);
    const json = JSON.parse(exportVisualContract(spec, 'json').rendered) as { colors: { text: string; accent: string } };
    expect(json.colors).toMatchObject({ text: '#111', accent: '#d72600' });
  });

  it('does not let display palette order change semantic roles or exported design values', () => {
    for (const style of styleCatalog) {
      const original = [...style.palette];
      const before = resolveVisualContract(style.id);
      const beforeCss = visualContractToCss(before);
      const beforeJson = exportVisualContract(before, 'json').rendered;
      style.palette.reverse();
      try {
        const after = resolveVisualContract(style.id);
        expect(after.colors).toEqual(before.colors);
        expect(after.typography).toEqual(before.typography);
        expect(after.shadows).toEqual(before.shadows);
        expect(after.radii).toEqual(before.radii);
        expect(visualContractToCss(after)).toBe(beforeCss);
        expect(exportVisualContract(after, 'json').rendered).toBe(beforeJson);
        expect(colorPreviewVariables(after.colors)).toEqual(colorPreviewVariables(before.colors));
      } finally {
        style.palette.splice(0, style.palette.length, ...original);
      }
    }
  });

  it('paints every component pair and the identity roles the pairs do not cover', () => {
    const spec = resolveVisualContract('brutalist-grid');
    const regions = colorPreviewRegions(spec.components);
    const rendered = new Set(regions.flatMap((region) => [region.foreground, region.background]));
    expect([...rendered].sort()).toEqual([...COLOR_ROLES].sort());
    for (const pair of spec.components) {
      expect(regions.find((region) => region.id === pair.id)).toMatchObject({
        foreground: pair.foreground,
        background: pair.background,
      });
    }
    expect(regions.find((region) => region.id === 'selection')).toMatchObject({
      foreground: 'accentSecondaryText',
      background: 'accentSecondary',
      style: { color: 'var(--role-accent-secondary-text)', backgroundColor: 'var(--role-accent-secondary)' },
    });
    expect(regions.find((region) => region.id === 'accent-identity')?.style).toMatchObject({
      color: 'var(--role-accent-text)',
      backgroundColor: 'var(--role-accent)',
    });
    expect(regions.find((region) => region.id === 'input-placeholder')?.style.backgroundColor).toBe('var(--role-surface-raised)');
    expect(regions.find((region) => region.id === 'input-boundary')?.style.borderColor).toBe('var(--role-border-strong)');
    expect(regions.find((region) => region.id === 'muted-surface')?.background).toBe('surfaceMuted');
    expect(regions.find((region) => region.id === 'inverse-text')?.foreground).toBe('textInverse');
    expect(() => colorPreviewRegions([])).toThrow(/drops roles/);
    const source = readFileSync(new URL('../../src/pages/ColorSystem.tsx', import.meta.url), 'utf8');
    const css = readFileSync(new URL('../../src/pages/visual-editor/editor.css', import.meta.url), 'utf8');
    const ids = new Set(Object.values(visualContracts).flatMap((contract) => contract.components.map((pair) => pair.id)));
    for (const id of [...ids, 'accent-identity', 'inverse-text', 'muted-surface']) expect(source).toContain(`region('${id}')`);
    expect(source).not.toContain('palette');
    expect(css).not.toContain('var(--role-surface-muted)');
    expect(css).not.toContain('var(--role-surface) !important');
  });

  it('preserves none, zero, authored line-height, and explicit density in the website renderers', () => {
    const spec = resolveVisualContract('brutalist-grid', {
      overrides: { typography: { body: { letterSpacingEm: 0, paragraphSpacingEm: 0 } } },
    });
    expect(spec.shadows).toEqual({ sm: 'none', md: 'none', lg: 'none' });
    expect(spec.radii).toEqual({ sm: 0, md: 0, lg: 0 });
    expect(spec.motion.duration).toBe(0);
    expect(spec.motion.reducedMotion).toBe('none');
    expect(spec.typography.roles.display.lineHeight).toBe(0.82);
    expect(spec.typography.roles.body.lineHeight).toBe(1.65);
    expect(spec.typography.roles.body.letterSpacingEm).toBe(0);
    expect(spec.typography.roles.body.paragraphSpacingEm).toBe(0);
    expect(spec.typography.roles.body.textTransform).toBe('none');
    const css = visualContractToCss(spec);
    for (const declaration of [
      '--shadow-sm: none;', '--shadow-md: none;', '--shadow-lg: none;',
      '--radius-sm: 0px;', '--radius-md: 0px;', '--radius-lg: 0px;',
      '--motion-duration: 0ms;', '--motion-reduced: none;',
      '--line-height-tight: 0.82;', '--line-height-normal: 1.65;',
      '--type-display-line-height: 0.82;', '--type-body-line-height: 1.65;',
      '--type-body-letter-spacing: 0em;', '--type-body-margin-block-end: 0em;',
      '--type-body-text-transform: none;',
    ]) expect(css).toContain(declaration);
    for (const shadow of genericSoftShadows) expect(css).not.toContain(shadow);
    const theme = visualContractToTheme(spec);
    expect(theme.extend.boxShadow).toEqual(spec.shadows);
    expect(theme.extend.borderRadius).toEqual({ sm: '0px', md: '0px', lg: '0px' });
    expect(theme.extend.transitionDuration.DEFAULT).toBe('0ms');
    expect(theme.roleStyles.display.lineHeight).toBe(0.82);
    expect(theme.roleStyles.body.lineHeight).toBe(1.65);
    expect(theme.extend.fontSize.display[1]).toMatchObject({ lineHeight: '0.82' });
    expect(theme.extend.fontSize.body[1]).toMatchObject({ lineHeight: '1.65' });
    expect(theme.metadata.typography.roles.body.lineHeight).toBe(1.65);
    const compact = resolveVisualContract('brutalist-grid', { overrides: { density: 'compact' } });
    const compactCss = visualContractToCss(compact);
    expect(compact.spacing).toMatchObject({ density: 'compact', row: 32, gutter: 12, stack: 12 });
    expect(compact.colors).toEqual(resolveVisualContract('brutalist-grid').colors);
    expect(compactCss).toContain('--density-row: 32px;');
    expect(compactCss).toContain('--density-gutter: 12px;');
    expect(compactCss).toContain('--spacing-row: 32px;');
    expect(compactCss).not.toContain('99px');
    const comfortable = resolveVisualContract('brutalist-grid', { overrides: { density: 'comfortable' } });
    expect(comfortable.spacing).toMatchObject({ density: 'comfortable', row: 44, gutter: 24, stack: 20 });
    expect(visualContractToCss(comfortable)).toContain('--density-row: 44px;');
  });

  it('shows the same accepted repair in preview variables and CSS, and refuses false passes', () => {
    const overrides = { colors: { text: '#eeeeee' } };
    const current = resolveVisualContract('brutalist-grid', { overrides });
    expect(current.colors.text).toBe('#eeeeee');
    expect(assessContrast(current).find((pair) => pair.id === 'body-canvas')?.status).toBe('fail');
    const repair = proposeContrastRepairs(current).find((item) => item.role === 'text');
    expect(repair).toBeDefined();
    const accepted = resolveVisualContract('brutalist-grid', { overrides, acceptedRepairs: [repair!] });
    expect(colorPreviewVariables(accepted.colors)['--role-text']).toBe(repair!.after);
    expect(visualContractToCss(accepted)).toContain(`--color-text: ${repair!.after};`);
    expect(exportVisualContract(accepted, 'json').rendered).toContain(repair!.after);
    expect(colorPreviewRegions(accepted.components).find((region) => region.id === 'body-canvas')?.foreground).toBe('text');
    const transparent = resolveVisualContract('brutalist-grid', { overrides: { colors: { canvas: '#ffffff00' } } });
    expect(colorPreviewVariables(transparent.colors)['--role-canvas']).toBe('#ffffff00');
    expect(assessContrast(transparent).find((pair) => pair.id === 'body-canvas')?.status).toBe('needs-rendered-review');
    expect(assessContrast(transparent).find((pair) => pair.id === 'decorative-separator')?.status).toBe('not-applicable');
    expect(() => resolveVisualContract('brutalist-grid', { mode: 'dark' })).toThrow(/no authored/);
  });

  it('preserves authored color identity for light, dark, editorial, brutalist, soft, and glass directions', () => {
    expect(resolveVisualContract('editorial-silence').colors).toMatchObject({ canvas: '#f8f8f8', text: '#1c1c1e', accent: '#3f3f46' });
    expect(resolveVisualContract('editorial-silence').typography.roles.display.fontFamily).toContain('Noto Serif KR');
    expect(resolveVisualContract('midnight-noir')).toMatchObject({
      mode: 'dark',
      colors: { canvas: '#07080B', text: '#ECE4D4', accent: '#C6A15B' },
    });
    expect(resolveVisualContract('soft-pastel').colors).toMatchObject({ canvas: '#fef7f0', text: '#3d3229', accent: '#ff9a76' });
    expect(assessContrast(resolveVisualContract('soft-pastel')).find((pair) => pair.id === 'body-panel')?.status).toBe('needs-rendered-review');
    const glass = resolveVisualContract('glass-orbit');
    expect(glass.mode).toBe('dark');
    expect(glass.colors.text).toBe('#fbeaf3');
    expect(glass.colors.canvas).not.toContain('gradient');
    expect(assessContrast(glass).find((pair) => pair.id === 'body-panel')?.status).toBe('needs-rendered-review');
    const bento = resolveVisualContract('bento-bloom');
    expect(bento.colors.accent).toBe('#f4d56a');
    expect(bento.colors.actionPrimary).toBe('#a7d3b8');
    expect(bento.colors.text).toBe('#2b2620');
  });
});
