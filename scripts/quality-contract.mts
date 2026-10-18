import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { styleCatalog } from '../src/data/styles';
import { COLOR_ROLES, getVisualContract } from '../src/visual';
import type { ColorRole, ResolvedVisualContract, VisualResolutionOptions } from '../src/visual';
import { exportResolvedSpec, resolveSelectedSpec, resolveStaticSelectedSpec, staticSelectedHandoffDocument } from '../src/visual/resolvedSpec';

export interface StyleFieldExpectation {
  styleId: string;
  contentLocale: 'en' | 'ko' | 'ja';
  mode: 'light' | 'dark';
  contractRevision: string;
  contentHash: string;
  colors: Record<ColorRole, string>;
  display: RoleFields;
  body: RoleFields;
  spacing: { density: 'comfortable' | 'compact'; row: number; gutter: number; stack: number; section: number };
  shadows: { sm: string; md: string; lg: string };
  radii: { sm: number; md: number; lg: number };
  borders: { width: number; style: string };
  motion: { duration: number; easing: string; reducedMotion: string; continuous: boolean };
  origins: Record<string, string>;
}

interface RoleFields {
  fontFamily: string;
  lineHeight: number;
  letterSpacingEm: number;
  paragraphSpacingEm: number;
  textTransform: string;
  wordBreak: string;
}

export interface OverrideExpectation {
  styleId: string;
  contentLocale: 'en' | 'ko' | 'ja';
  mode: 'light' | 'dark';
  overrides: {
    colors?: Record<string, string>;
    typography?: Record<string, Record<string, number>>;
    density?: 'comfortable' | 'compact';
  };
  expected: {
    text: string;
    accent: string;
    canvas: string;
    displayLineHeight: number;
    displayLetterSpacingEm: number;
    displayTextTransform: string;
    bodyLineHeight: number;
    bodyLetterSpacingEm: number;
    bodyParagraphSpacingEm: number;
    bodyTextTransform: string;
    density: string;
    row: number;
    gutter: number;
    stack: number;
    section: number;
    shadowSm: string;
    shadowMd: string;
    shadowLg: string;
    radiusSm: number;
    radiusMd: number;
    radiusLg: number;
    motionDuration: number;
    motionReduced: string;
    declarations: string[];
  };
}

const fixtureDir = join(process.cwd(), 'scripts/fixtures/quality-contract');

export function loadStyleFieldExpectations(): StyleFieldExpectation[] {
  const parsed = JSON.parse(readFileSync(join(fixtureDir, 'style-fields.json'), 'utf8')) as { expectations: StyleFieldExpectation[] };
  return parsed.expectations;
}

export function loadOverrideExpectations(): OverrideExpectation[] {
  const parsed = JSON.parse(readFileSync(join(fixtureDir, 'override-expectations.json'), 'utf8')) as { cases: OverrideExpectation[] };
  return parsed.cases;
}

export function cssDeclarationsFor(expected: StyleFieldExpectation): string[] {
  return [
    `--color-text: ${expected.colors.text};`,
    `--color-accent: ${expected.colors.accent};`,
    `--color-bg: ${expected.colors.canvas};`,
    `--color-primary: ${expected.colors.accent};`,
    `--font-display: ${expected.display.fontFamily};`,
    `--font-body: ${expected.body.fontFamily};`,
    `--type-display-font-family: ${expected.display.fontFamily};`,
    `--type-display-line-height: ${expected.display.lineHeight};`,
    `--type-display-letter-spacing: ${expected.display.letterSpacingEm}em;`,
    `--type-display-text-transform: ${expected.display.textTransform};`,
    `--type-body-font-family: ${expected.body.fontFamily};`,
    `--type-body-line-height: ${expected.body.lineHeight};`,
    `--type-body-letter-spacing: ${expected.body.letterSpacingEm}em;`,
    `--type-body-margin-block-end: ${expected.body.paragraphSpacingEm}em;`,
    `--type-body-text-transform: ${expected.body.textTransform};`,
    `--type-body-word-break: ${expected.body.wordBreak};`,
    `--shadow-sm: ${expected.shadows.sm};`,
    `--shadow-md: ${expected.shadows.md};`,
    `--shadow-lg: ${expected.shadows.lg};`,
    `--radius-sm: ${expected.radii.sm}px;`,
    `--radius-md: ${expected.radii.md}px;`,
    `--radius-lg: ${expected.radii.lg}px;`,
    `--border-width: ${expected.borders.width}px;`,
    `--border-style: ${expected.borders.style};`,
    `--motion-duration: ${expected.motion.duration}ms;`,
    `--motion-easing: ${expected.motion.easing};`,
    `--motion-reduced: ${expected.motion.reducedMotion};`,
    `--motion-continuous: ${expected.motion.continuous};`,
    `--density-row: ${expected.spacing.row}px;`,
    `--spacing-density: ${expected.spacing.density};`,
    `--spacing-row: ${expected.spacing.row}px;`,
    `--spacing-gutter: ${expected.spacing.gutter}px;`,
    `--spacing-stack: ${expected.spacing.stack}px;`,
    `--spacing-section: ${expected.spacing.section}px;`,
  ];
}

function differ(path: string, actual: unknown, wanted: unknown): string | null {
  return actual === wanted ? null : `${path} is ${JSON.stringify(actual)}, expected ${JSON.stringify(wanted)}`;
}

export function observedFieldViolations(expected: StyleFieldExpectation, resolved: ResolvedVisualContract): string[] {
  const label = `${expected.styleId}/${expected.contentLocale}`;
  const violations = [
    differ(`${label} styleId`, resolved.styleId, expected.styleId),
    differ(`${label} mode`, resolved.mode, expected.mode),
    differ(`${label} contentLocale`, resolved.contentLocale, expected.contentLocale),
    differ(`${label} revision`, resolved.revision, expected.contractRevision),
    differ(`${label} contentHash`, resolved.contentHash, expected.contentHash),
    ...COLOR_ROLES.map((role) => differ(`${label} colors.${role}`, resolved.colors[role], expected.colors[role])),
    differ(`${label} display.fontFamily`, resolved.typography.roles.display.fontFamily, expected.display.fontFamily),
    differ(`${label} display.lineHeight`, resolved.typography.roles.display.lineHeight, expected.display.lineHeight),
    differ(`${label} display.letterSpacingEm`, resolved.typography.roles.display.letterSpacingEm, expected.display.letterSpacingEm),
    differ(`${label} display.paragraphSpacingEm`, resolved.typography.roles.display.paragraphSpacingEm, expected.display.paragraphSpacingEm),
    differ(`${label} display.textTransform`, resolved.typography.roles.display.textTransform, expected.display.textTransform),
    differ(`${label} display.wordBreak`, resolved.typography.roles.display.wordBreak, expected.display.wordBreak),
    differ(`${label} body.fontFamily`, resolved.typography.roles.body.fontFamily, expected.body.fontFamily),
    differ(`${label} body.lineHeight`, resolved.typography.roles.body.lineHeight, expected.body.lineHeight),
    differ(`${label} body.letterSpacingEm`, resolved.typography.roles.body.letterSpacingEm, expected.body.letterSpacingEm),
    differ(`${label} body.paragraphSpacingEm`, resolved.typography.roles.body.paragraphSpacingEm, expected.body.paragraphSpacingEm),
    differ(`${label} body.textTransform`, resolved.typography.roles.body.textTransform, expected.body.textTransform),
    differ(`${label} body.wordBreak`, resolved.typography.roles.body.wordBreak, expected.body.wordBreak),
    differ(`${label} spacing.density`, resolved.spacing.density, expected.spacing.density),
    differ(`${label} spacing.row`, resolved.spacing.row, expected.spacing.row),
    differ(`${label} spacing.gutter`, resolved.spacing.gutter, expected.spacing.gutter),
    differ(`${label} spacing.stack`, resolved.spacing.stack, expected.spacing.stack),
    differ(`${label} spacing.section`, resolved.spacing.section, expected.spacing.section),
    differ(`${label} shadows.sm`, resolved.shadows.sm, expected.shadows.sm),
    differ(`${label} shadows.md`, resolved.shadows.md, expected.shadows.md),
    differ(`${label} shadows.lg`, resolved.shadows.lg, expected.shadows.lg),
    differ(`${label} radii.sm`, resolved.radii.sm, expected.radii.sm),
    differ(`${label} radii.md`, resolved.radii.md, expected.radii.md),
    differ(`${label} radii.lg`, resolved.radii.lg, expected.radii.lg),
    differ(`${label} borders.width`, resolved.borders.width, expected.borders.width),
    differ(`${label} borders.style`, resolved.borders.style, expected.borders.style),
    differ(`${label} motion.duration`, resolved.motion.duration, expected.motion.duration),
    differ(`${label} motion.easing`, resolved.motion.easing, expected.motion.easing),
    differ(`${label} motion.reducedMotion`, resolved.motion.reducedMotion, expected.motion.reducedMotion),
    differ(`${label} motion.continuous`, resolved.motion.continuous, expected.motion.continuous),
    ...Object.entries(expected.origins).map(([path, wanted]) => differ(`${label} origins.${path}`, resolved.origins[path], wanted)),
  ];
  return violations.filter((item): item is string => item !== null);
}

export function resolvedFieldViolations(expected: StyleFieldExpectation): string[] {
  const resolved = resolveSelectedSpec(expected.styleId, { mode: expected.mode, contentLocale: expected.contentLocale });
  return observedFieldViolations(expected, resolved);
}

export function missingCssDeclarations(css: string, required: readonly string[]): string[] {
  return required.filter((declaration) => !css.includes(declaration)).map((declaration) => `missing export declaration ${declaration}`);
}

export function exportFieldViolations(expected: StyleFieldExpectation): string[] {
  const resolved = resolveSelectedSpec(expected.styleId, { mode: expected.mode, contentLocale: expected.contentLocale });
  const css = exportResolvedSpec(resolved, 'css');
  const json = JSON.parse(exportResolvedSpec(resolved, 'json')) as ResolvedVisualContract;
  return [
    ...missingCssDeclarations(css, cssDeclarationsFor(expected)).map((item) => `${expected.styleId}/${expected.contentLocale} ${item}`),
    ...observedFieldViolations(expected, json).map((item) => `json ${item}`),
  ];
}

export function staticFieldViolations(expected: StyleFieldExpectation, document = staticSelectedHandoffDocument(expected.styleId, expected.contentLocale)): string[] {
  const parsed = JSON.parse(document) as { identity: { styleId: string; contractRevision: string; contentLocale: string; contentHash: string }; design: ResolvedVisualContract };
  const label = `${expected.styleId}/${expected.contentLocale}`;
  return [
    differ(`${label} static identity.styleId`, parsed.identity.styleId, expected.styleId),
    differ(`${label} static identity.contractRevision`, parsed.identity.contractRevision, expected.contractRevision),
    differ(`${label} static identity.contentLocale`, parsed.identity.contentLocale, expected.contentLocale),
    differ(`${label} static identity.contentHash`, parsed.identity.contentHash, expected.contentHash),
    ...observedFieldViolations(expected, parsed.design).map((item) => `static ${item}`),
  ].filter((item): item is string => item !== null);
}

export function staticResolverFieldViolations(expected: StyleFieldExpectation): string[] {
  const projection = resolveStaticSelectedSpec(expected.styleId, expected.contentLocale, { mode: expected.mode });
  return observedFieldViolations(expected, projection.spec).map((item) => `static-resolver ${item}`);
}

export function coverageViolations(expectations: readonly StyleFieldExpectation[]): string[] {
  const seen = new Set<string>();
  const violations: string[] = [];
  for (const expected of expectations) {
    const key = `${expected.styleId}/${expected.mode}/${expected.contentLocale}`;
    if (seen.has(key)) violations.push(`duplicate field row ${key}`);
    seen.add(key);
  }
  const wanted = new Set<string>();
  for (const style of styleCatalog) {
    const contract = getVisualContract(style.id);
    for (const mode of Object.keys(contract.modes)) {
      for (const locale of ['en', 'ko', 'ja']) wanted.add(`${style.id}/${mode}/${locale}`);
    }
  }
  for (const key of wanted) if (!seen.has(key)) violations.push(`missing field row ${key}`);
  for (const key of seen) if (!wanted.has(key)) violations.push(`unexpected field row ${key}`);
  return violations.sort();
}

export function overrideFieldViolations(spec: OverrideExpectation): string[] {
  const options: VisualResolutionOptions = {
    mode: spec.mode,
    contentLocale: spec.contentLocale,
    overrides: spec.overrides as VisualResolutionOptions['overrides'],
  };
  const browser = resolveSelectedSpec(spec.styleId, options);
  const authored = resolveStaticSelectedSpec(spec.styleId, spec.contentLocale, { mode: spec.mode, overrides: spec.overrides });
  const expected = spec.expected;
  const label = `${spec.styleId}/${spec.contentLocale} override`;
  const check = (source: string, resolved: ResolvedVisualContract) => [
    differ(`${label} ${source} text`, resolved.colors.text, expected.text),
    differ(`${label} ${source} accent`, resolved.colors.accent, expected.accent),
    differ(`${label} ${source} canvas`, resolved.colors.canvas, expected.canvas),
    differ(`${label} ${source} display.lineHeight`, resolved.typography.roles.display.lineHeight, expected.displayLineHeight),
    differ(`${label} ${source} display.letterSpacingEm`, resolved.typography.roles.display.letterSpacingEm, expected.displayLetterSpacingEm),
    differ(`${label} ${source} display.textTransform`, resolved.typography.roles.display.textTransform, expected.displayTextTransform),
    differ(`${label} ${source} body.lineHeight`, resolved.typography.roles.body.lineHeight, expected.bodyLineHeight),
    differ(`${label} ${source} body.letterSpacingEm`, resolved.typography.roles.body.letterSpacingEm, expected.bodyLetterSpacingEm),
    differ(`${label} ${source} body.paragraphSpacingEm`, resolved.typography.roles.body.paragraphSpacingEm, expected.bodyParagraphSpacingEm),
    differ(`${label} ${source} body.textTransform`, resolved.typography.roles.body.textTransform, expected.bodyTextTransform),
    differ(`${label} ${source} density`, resolved.spacing.density, expected.density),
    differ(`${label} ${source} row`, resolved.spacing.row, expected.row),
    differ(`${label} ${source} gutter`, resolved.spacing.gutter, expected.gutter),
    differ(`${label} ${source} stack`, resolved.spacing.stack, expected.stack),
    differ(`${label} ${source} section`, resolved.spacing.section, expected.section),
    differ(`${label} ${source} shadow.sm`, resolved.shadows.sm, expected.shadowSm),
    differ(`${label} ${source} shadow.md`, resolved.shadows.md, expected.shadowMd),
    differ(`${label} ${source} shadow.lg`, resolved.shadows.lg, expected.shadowLg),
    differ(`${label} ${source} radius.sm`, resolved.radii.sm, expected.radiusSm),
    differ(`${label} ${source} radius.md`, resolved.radii.md, expected.radiusMd),
    differ(`${label} ${source} radius.lg`, resolved.radii.lg, expected.radiusLg),
    differ(`${label} ${source} motion.duration`, resolved.motion.duration, expected.motionDuration),
    differ(`${label} ${source} motion.reduced`, resolved.motion.reducedMotion, expected.motionReduced),
  ];
  return [
    ...check('browser', browser),
    ...check('static', authored.spec),
    ...missingCssDeclarations(exportResolvedSpec(browser, 'css'), expected.declarations).map((item) => `${label} browser ${item}`),
    ...missingCssDeclarations(exportResolvedSpec(authored.spec, 'css'), expected.declarations).map((item) => `${label} static ${item}`),
  ].filter((item): item is string => item !== null);
}
