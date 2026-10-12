import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { VisualSpecimen } from '../../src/components/VisualSpecimen';
import type { Lang } from '../../src/data/styles';
import { getVisualContract } from '../../src/visual';
import { selectedHandoffToPrompt } from '../../src/visual/handoff';
import {
  exportResolvedSpec,
  projectResolvedSpec,
  resolveSelectedSpec,
  resolveStaticSelectedSpec,
  staticSelectedHandoffDocument,
} from '../../src/visual/resolvedSpec';
import { createInitialDraft, draftResolutionOptions } from '../../src/visual/workspace';
import type { ResolvedVisualContract } from '../../src/visual/types';

const editedDraft = {
  ...createInitialDraft('brutalist-grid'),
  contentLocale: 'ko' as const,
  overrides: {
    colors: { text: '#121212', accent: '#0b3d91' },
    typography: { heading: { fontWeight: 600 }, body: { lineHeight: 1.75, letterSpacingEm: 0.01 } },
    density: 'compact' as const,
  },
  projectContext: {
    ...createInitialDraft('brutalist-grid').projectContext,
    stack: 'Vite + React',
    screens: ['Settings', 'Billing'],
  },
};

function previewHtml(spec: ResolvedVisualContract, lang: Lang) {
  return renderToStaticMarkup(createElement(VisualSpecimen, { spec, lang, fixtureId: 'product' }));
}

function previewHash(html: string) {
  const hash = html.match(/data-visual-hash="(fnv1a:[0-9a-f]{16})"/)?.[1];
  if (!hash) throw new Error('Preview is missing the resolved spec hash');
  return hash;
}

function cssCustomProperties(css: string) {
  const body = css.slice(css.indexOf(':root {'), css.indexOf('}', css.indexOf(':root {')));
  return new Map([...body.matchAll(/--([a-z0-9-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]));
}

describe('resolved spec shared by preview, export, and handoff', () => {
  it('routes the three consumers through the shared resolver', () => {
    const workflow = readFileSync(new URL('../../src/pages/PromptWorkflow.tsx', import.meta.url), 'utf8');
    const exporter = readFileSync(new URL('../../src/pages/visual-editor/EditorCommon.tsx', import.meta.url), 'utf8');
    const generator = readFileSync(new URL('../generate-agent-handoff.mjs', import.meta.url), 'utf8');
    expect(workflow).toContain('resolveSelectedSpec');
    expect(workflow).toContain('projectResolvedSpec');
    expect(workflow).not.toContain('resolveVisualContract');
    expect(exporter).toContain('exportResolvedSpec');
    expect(exporter).not.toContain('visualContractToCss');
    expect(generator).toContain('staticSelectedHandoffDocument');
    expect(generator).not.toContain('resolveVisualContract');
    expect(generator).not.toContain('buildSelectedHandoff');
  });

  it('keeps one content hash for the rendered preview, the export, and the AI handoff', () => {
    const preview = resolveSelectedSpec(editedDraft.styleId, draftResolutionOptions(editedDraft));
    const html = previewHtml(preview, 'ko');
    const css = cssCustomProperties(exportResolvedSpec(preview, 'css'));
    const exported = JSON.parse(exportResolvedSpec(preview, 'json')) as ResolvedVisualContract;
    const handoff = projectResolvedSpec(preview, {
      taskMode: 'refine-existing',
      projectContext: editedDraft.projectContext,
      refinement: {
        allowedChanges: ['colors', 'typography', 'density'],
        preserve: [],
        lockedPaths: [],
        targetRegions: [],
        sourceReference: 'Existing Vite/React settings page',
        evidenceKind: 'description',
        requestedOutcome: 'Keep the current product and improve the selected roles',
      },
    }).handoff;
    const prompt = selectedHandoffToPrompt(handoff);
    const copied = JSON.parse(prompt.slice(prompt.indexOf('{"schema":'))) as { design: ResolvedVisualContract; project: { stack?: string } };

    expect(preview.colors.text).toBe('#121212');
    expect(preview.colors.accent).toBe('#0b3d91');
    expect(preview.colors.text).not.toBe('#111');
    expect(preview.colors.accent).not.toBe('#d72600');
    expect(preview.typography.roles.body.lineHeight).toBe(1.75);
    expect(preview.typography.roles.body.letterSpacingEm).toBe(0.01);
    expect(preview.typography.roles.heading.fontWeight).toBe(600);
    expect(preview.spacing).toMatchObject({ density: 'compact', row: 32, gutter: 12, stack: 12 });
    expect(preview.mode).toBe('light');
    expect(preview.contentLocale).toBe('ko');
    expect(preview.origins['colors.text']).toBe('override');
    expect(preview.origins['colors.accent']).toBe('override');
    expect(preview.origins['typography.roles.body.lineHeight']).toBe('override');
    expect(preview.origins['typography.roles.heading.fontWeight']).toBe('override');
    expect(preview.origins['spacing.density']).toBe('override');
    expect(preview.warnings.some((warning) => warning.includes('Locale reading adjustments'))).toBe(true);

    expect(previewHash(html)).toBe(preview.contentHash);
    expect(html).toContain('--vs-text:#121212');
    expect(html).toContain('--vs-accent:#0b3d91');
    expect(html).toContain('--vs-row:32px');
    expect(html).toContain('--vs-gutter:12px');
    expect(html).toContain('line-height:1.75');
    expect(html).toContain('letter-spacing:0.01em');
    expect(html).toContain('font-weight:600');

    expect(css.get('color-text')).toBe('#121212');
    expect(css.get('color-accent')).toBe('#0b3d91');
    expect(css.get('type-body-line-height')).toBe('1.75');
    expect(css.get('type-body-letter-spacing')).toBe('0.01em');
    expect(css.get('type-heading-font-weight')).toBe('600');
    expect(css.get('spacing-row')).toBe('32px');
    expect(css.get('density-row')).toBe('32px');
    expect(css.get('spacing-gutter')).toBe('12px');
    expect(css.get('spacing-density')).toBe('compact');

    expect(exported.contentHash).toBe(preview.contentHash);
    expect(exported.colors.text).toBe('#121212');
    expect(exported.colors.accent).toBe('#0b3d91');
    expect(exported.typography.roles.body.lineHeight).toBe(1.75);
    expect(exported.typography.roles.heading.fontWeight).toBe(600);
    expect(exported.spacing.row).toBe(32);
    expect(exported.spacing.density).toBe('compact');
    expect(exported.warnings).toEqual(preview.warnings);
    expect(exported.contentHash).toMatch(/^fnv1a:[0-9a-f]{16}$/);
    expect(exportResolvedSpec(preview, 'json')).toBe(exportResolvedSpec(preview, 'json'));
    expect(exportResolvedSpec(preview, 'json')).not.toMatch(/\d{4}-\d{2}-\d{2}T/);

    expect(handoff.identity.contentHash).toBe(preview.contentHash);
    expect(handoff.design.contentHash).toBe(preview.contentHash);
    expect(handoff.design.colors).toEqual(exported.colors);
    expect(handoff.design.typography.roles.body.lineHeight).toBe(1.75);
    expect(handoff.design.spacing).toEqual(exported.spacing);
    expect(handoff.warnings).toEqual(preview.warnings);
    expect(handoff.verification.every((item) => item.outcome === 'not-run')).toBe(true);
    expect(handoff.verification.some((item) => item.outcome === 'pass')).toBe(false);
    expect(copied.design.contentHash).toBe(preview.contentHash);
    expect(copied.design.colors.text).toBe('#121212');
    expect(copied.project.stack).toBe('Vite + React');
    expect(prompt).toContain('Vite + React');
    expect(prompt).not.toMatch(/current stable Next|narrow MVP|choose a new typography|Read every entry/);
  });

  it('does not change the spec hash when only the UI language or font-status note changes', () => {
    const preview = resolveSelectedSpec(editedDraft.styleId, draftResolutionOptions(editedDraft));
    const englishUi = previewHtml(preview, 'en');
    const koreanUi = previewHtml(preview, 'ko');
    expect(previewHash(englishUi)).toBe(preview.contentHash);
    expect(previewHash(koreanUi)).toBe(preview.contentHash);
    expect(englishUi).toContain('Plan your next release.');
    expect(koreanUi).toContain('다음 출시를 계획하세요.');
    expect(koreanUi).not.toContain('Plan your next release.');

    const quiet = projectResolvedSpec(preview);
    const withFontStatus = projectResolvedSpec(preview, {
      previewFontStatus: [{ family: 'Missing Face', status: 'fallback', reason: 'stylesheet failed' }],
    });
    expect(withFontStatus.contentHash).toBe(quiet.contentHash);
    expect(withFontStatus.handoff.design).toEqual(quiet.handoff.design);
    expect(withFontStatus.handoff.previewEvidence.fonts).toEqual([{ family: 'Missing Face', status: 'fallback', reason: 'stylesheet failed' }]);
    expect(withFontStatus.handoff.handoffHash).not.toBe(quiet.handoff.handoffHash);
    expect(JSON.parse(exportResolvedSpec(preview, 'json')).contentHash).toBe(quiet.contentHash);
  });

  it('changes the shared hash when a color, type role, density, or supported mode changes', () => {
    const preview = resolveSelectedSpec(editedDraft.styleId, draftResolutionOptions(editedDraft));
    const recolored = resolveSelectedSpec(editedDraft.styleId, {
      ...draftResolutionOptions(editedDraft),
      overrides: { ...editedDraft.overrides, colors: { ...editedDraft.overrides.colors, text: '#010101' } },
    });
    expect(recolored.contentHash).not.toBe(preview.contentHash);
    expect(previewHash(previewHtml(recolored, 'ko'))).toBe(recolored.contentHash);
    expect(JSON.parse(exportResolvedSpec(recolored, 'json')).contentHash).toBe(recolored.contentHash);
    expect(projectResolvedSpec(recolored).handoff.design.contentHash).toBe(recolored.contentHash);
    expect(JSON.parse(exportResolvedSpec(recolored, 'json')).colors.text).toBe('#010101');

    const light = resolveSelectedSpec('terminal-core', { mode: 'light', contentLocale: 'en' });
    const lightExport = JSON.parse(exportResolvedSpec(light, 'json')) as ResolvedVisualContract;
    const lightHandoff = projectResolvedSpec(light).handoff;
    expect(light.mode).toBe('light');
    expect(exportResolvedSpec(light, 'css')).toContain('terminal-core; en; light');
    expect(lightExport.mode).toBe('light');
    expect(lightExport.contentHash).toBe(light.contentHash);
    expect(lightHandoff.design.mode).toBe('light');
    expect(lightHandoff.design.contentHash).toBe(light.contentHash);
    expect(previewHash(previewHtml(light, 'en'))).toBe(light.contentHash);
    const authoredDark = JSON.parse(staticSelectedHandoffDocument('terminal-core', 'en')) as { design: ResolvedVisualContract };
    expect(authoredDark.design.mode).toBe('dark');
    expect(authoredDark.design.contentHash).not.toBe(light.contentHash);
  });

  it('matches the static selected handoff to the authored preview and export, without local edits', () => {
    const authored = getVisualContract('brutalist-grid');
    const preview = resolveSelectedSpec('brutalist-grid', { mode: authored.defaultMode, contentLocale: 'ko' });
    const exported = JSON.parse(exportResolvedSpec(preview, 'json')) as ResolvedVisualContract;
    const document = JSON.parse(staticSelectedHandoffDocument('brutalist-grid', 'ko')) as { design: ResolvedVisualContract; identity: { contentHash: string }; evidenceLimits: string[] };
    const projection = resolveStaticSelectedSpec('brutalist-grid', 'ko');
    expect(previewHash(previewHtml(preview, 'ko'))).toBe(preview.contentHash);
    expect(exported.contentHash).toBe(preview.contentHash);
    expect(document.design.contentHash).toBe(preview.contentHash);
    expect(document.identity.contentHash).toBe(preview.contentHash);
    expect(projection.contentHash).toBe(preview.contentHash);
    expect(document.design.colors).toEqual(exported.colors);
    expect(document.design.typography).toEqual(exported.typography);
    expect(document.design.spacing).toEqual(exported.spacing);
    expect(staticSelectedHandoffDocument('brutalist-grid', 'ko')).not.toContain('#121212');
    expect(document.evidenceLimits.join(' ')).toContain('mutable page URL cannot reconstruct local edits');
    expect(staticSelectedHandoffDocument('brutalist-grid', 'en')).toBe(staticSelectedHandoffDocument('brutalist-grid', 'en'));
  });

  it('rejects a stale spec instead of exporting a mismatched hash', () => {
    const preview = resolveSelectedSpec('brutalist-grid');
    const stale = { ...preview, colors: { ...preview.colors, text: '#333333' } };
    expect(() => exportResolvedSpec(stale, 'json')).toThrow(/hash/);
    expect(() => exportResolvedSpec(stale, 'css')).toThrow(/hash/);
    expect(() => projectResolvedSpec(stale)).toThrow(/hash/);
    expect(() => resolveSelectedSpec('brutalist-grid', { mode: 'dark' })).toThrow(/no authored/);
  });
});
