// SPDX-License-Identifier: MIT
// Finite role recipes for the website catalog. The portable resolver is unchanged:
// these values are authored into the contract, then resolved and exported as-is.
import fontWeights from './fontWeights.json';
import type { TypographyRole, TypographyRoleName } from './types.js';

export const TYPOGRAPHY_RECIPE_KINDS = ['editorial', 'operational', 'console', 'display'] as const;
export type TypographyRecipeKind = (typeof TYPOGRAPHY_RECIPE_KINDS)[number];

const weightsByFamily: Record<string, number[]> = fontWeights;

export interface TypographyRecipeSource {
  displayFont: string | null;
  bodyFont: string | null;
  monoFont: string | null;
  displayMinRem: number | null;
  displayMaxRem: number | null;
  displayWeight: number | null;
  displayWeightResolved?: number | null;
  displayLineHeight: number | string | null;
  displayLetterSpacingEm?: number | null;
  bodySizeRem: number | null;
  bodyMinRem?: number | null;
  bodyMaxRem?: number | null;
  bodyWeight?: number | null;
  bodyLineHeight: number | null;
  bodyLetterSpacingEm?: number | null;
}

function primaryFamily(stack: string): string {
  return stack.split(',')[0]?.trim().replace(/^['"]|['"]$/g, '') ?? stack;
}

function isSerif(stack: string): boolean {
  return /(?:^|,)\s*(?:ui-)?serif\s*$/.test(stack);
}

function isMono(stack: string): boolean {
  return /monospace/i.test(stack);
}

/** Console, editorial, same-family operational, or mixed display. Order is the inheritance rule. */
export function typographyRecipeKind(displayFont: string, bodyFont: string): TypographyRecipeKind {
  if (isMono(displayFont) && isMono(bodyFont)) return 'console';
  if (isSerif(displayFont)) return 'editorial';
  if (primaryFamily(displayFont) === primaryFamily(bodyFont)) return 'operational';
  return 'display';
}

function round(value: number): number {
  return Number(value.toFixed(4));
}

function tracking(value: number): number {
  return round(Math.min(0.5, Math.max(-0.15, value)));
}

function scale(min: number, max: number, floor = 0.75): Pick<TypographyRole, 'sizeMinRem' | 'sizeMaxRem'> {
  const sizeMaxRem = round(Math.min(12, Math.max(floor, min, max)));
  const sizeMinRem = round(Math.min(sizeMaxRem, Math.max(floor, Math.min(min, max))));
  return { sizeMinRem, sizeMaxRem };
}

function snappedWeight(stack: string, preferred: number): number {
  const available = weightsByFamily[primaryFamily(stack)];
  if (!available?.length || available.includes(preferred)) return preferred;
  return available.reduce((best, weight) => (Math.abs(weight - preferred) < Math.abs(best - preferred) ? weight : best));
}

function support(
  fontFamily: string,
  sizeMinRem: number,
  sizeMaxRem: number,
  fontWeight: number,
  lineHeight: number,
  measureCh: number,
  extras: Partial<Pick<TypographyRole, 'letterSpacingEm' | 'paragraphSpacingEm' | 'overflowWrap' | 'fontVariantNumeric'>> = {},
): TypographyRole {
  return {
    fontFamily,
    fontWeight: snappedWeight(fontFamily, fontWeight),
    fontStyle: 'normal',
    ...scale(sizeMinRem, sizeMaxRem),
    lineHeight: round(Math.min(3, Math.max(0.8, lineHeight))),
    letterSpacingEm: tracking(extras.letterSpacingEm ?? 0),
    paragraphSpacingEm: extras.paragraphSpacingEm ?? 0.45,
    measureCh,
    textTransform: 'none',
    wordBreak: 'normal',
    overflowWrap: extras.overflowWrap ?? 'normal',
    fontVariantNumeric: extras.fontVariantNumeric ?? 'normal',
  };
}

function headingSizes(kind: TypographyRecipeKind, bodySize: number, displayMax: number) {
  if (kind === 'editorial') return scale(Math.max(bodySize * 1.35, 1.25), Math.min(displayMax * 0.62, Math.max(bodySize * 1.85, 1.7)));
  if (kind === 'operational') return scale(Math.max(bodySize * 1.12, 1.1), Math.min(2.1, Math.max(bodySize * 1.4, 1.28)));
  if (kind === 'console') return scale(Math.max(bodySize * 1.05, 1), Math.min(Math.max(displayMax * 0.55, bodySize * 1.2), Math.max(bodySize * 1.55, 1.25)));
  const headingMax = Math.min(3.5, Math.max(bodySize * 1.6, Math.min(displayMax * 0.42, 3.5)));
  return scale(Math.min(1.8, headingMax), headingMax);
}

/**
 * Display and body font, size, weight, line-height, and letter-spacing are copied
 * from the source recipe. Supporting roles are an explicit finite recipe, not one scale.
 */
export function authoredTypographyRoles(source: TypographyRecipeSource): {
  kind: TypographyRecipeKind;
  roles: Record<TypographyRoleName, TypographyRole>;
} {
  const bodyFont = source.bodyFont ?? 'system-ui, sans-serif';
  const displayFont = source.displayFont ?? bodyFont;
  const monoFont = source.monoFont ?? 'ui-monospace, monospace';
  const kind = typographyRecipeKind(displayFont, bodyFont);
  const bodySize = source.bodyMinRem ?? source.bodySizeRem ?? 1;
  const bodySizeMax = source.bodyMaxRem ?? bodySize;
  const bodyLeading = source.bodyLineHeight ?? 1.6;
  const bodyWeight = source.bodyWeight ?? 400;
  const displayMin = source.displayMinRem ?? 2;
  const displayMax = source.displayMaxRem ?? Math.max(displayMin, 3.5);
  const displayWeight = source.displayWeight ?? source.displayWeightResolved ?? 700;
  const displayLeading = typeof source.displayLineHeight === 'number' ? source.displayLineHeight : 1.2;
  const displayTracking = source.displayLetterSpacingEm ?? 0;
  const bodyTracking = source.bodyLetterSpacingEm ?? 0;
  const headingFont = kind === 'operational' ? bodyFont : displayFont;
  const headingSize = headingSizes(kind, bodySize, displayMax);
  const headingLeading = kind === 'editorial'
    ? Math.min(1.45, Math.max(1.2, displayLeading))
    : kind === 'operational'
      ? 1.25
      : kind === 'console'
        ? Math.max(1.35, displayLeading)
        : Math.max(1.1, displayLeading);

  const roles: Record<TypographyRoleName, TypographyRole> = {
    display: {
      fontFamily: displayFont,
      fontWeight: displayWeight,
      fontStyle: 'normal',
      sizeMinRem: displayMin,
      sizeMaxRem: Math.max(displayMin, displayMax),
      lineHeight: displayLeading,
      letterSpacingEm: displayTracking,
      paragraphSpacingEm: kind === 'editorial' ? 0.35 : kind === 'operational' ? 0.2 : 0.15,
      measureCh: kind === 'editorial' ? 22 : kind === 'operational' ? 32 : kind === 'console' ? 42 : 18,
      textTransform: 'none',
      wordBreak: 'normal',
      overflowWrap: 'normal',
      fontVariantNumeric: 'normal',
    },
    heading: {
      // support() snaps invented weights. The heading keeps the display face's authored weight.
      ...support(
        headingFont,
        headingSize.sizeMinRem,
        headingSize.sizeMaxRem,
        displayWeight,
        headingLeading,
        kind === 'editorial' ? 34 : kind === 'operational' ? 42 : kind === 'console' ? 52 : 28,
        { letterSpacingEm: kind === 'console' ? 0 : displayTracking * (kind === 'editorial' ? 0.5 : kind === 'operational' ? 0.25 : 0.75), paragraphSpacingEm: 0.4 },
      ),
      fontWeight: displayWeight,
    },
    subheading: support(
      kind === 'operational' || kind === 'console' ? bodyFont : displayFont,
      kind === 'editorial' ? bodySize * 1.12 : kind === 'operational' ? bodySize * 1.02 : kind === 'console' ? bodySize : Math.max(bodySize * 1.15, 1),
      kind === 'editorial' ? bodySize * 1.4 : kind === 'operational' ? bodySize * 1.18 : kind === 'console' ? bodySize * 1.15 : Math.max(bodySize * 1.35, 1.25),
      kind === 'console' ? 500 : Math.min(displayWeight, kind === 'operational' ? 600 : 700),
      kind === 'editorial' ? 1.45 : kind === 'operational' ? 1.32 : kind === 'console' ? 1.45 : 1.35,
      kind === 'editorial' ? 42 : kind === 'operational' ? 48 : kind === 'console' ? 58 : 36,
      { paragraphSpacingEm: 0.45 },
    ),
    body: {
      fontFamily: bodyFont,
      fontWeight: bodyWeight,
      fontStyle: 'normal',
      sizeMinRem: bodySize,
      sizeMaxRem: Math.max(bodySize, bodySizeMax),
      lineHeight: bodyLeading,
      letterSpacingEm: bodyTracking,
      paragraphSpacingEm: kind === 'editorial' ? 0.95 : kind === 'operational' ? 0.55 : kind === 'console' ? 0.7 : 0.8,
      measureCh: kind === 'editorial' ? 70 : kind === 'operational' ? 56 : kind === 'console' ? 66 : 64,
      textTransform: 'none',
      wordBreak: 'normal',
      overflowWrap: 'anywhere',
      fontVariantNumeric: 'normal',
    },
    small: support(
      bodyFont,
      bodySize * (kind === 'operational' ? 0.8125 : kind === 'editorial' ? 0.92 : 0.875),
      bodySize * (kind === 'operational' ? 0.8125 : kind === 'editorial' ? 0.92 : 0.875),
      bodyWeight,
      kind === 'operational' ? Math.min(bodyLeading, 1.5) : bodyLeading,
      kind === 'editorial' ? 72 : kind === 'operational' ? 58 : kind === 'console' ? 70 : 68,
      { overflowWrap: 'anywhere', paragraphSpacingEm: kind === 'operational' ? 0.4 : 0.6 },
    ),
    label: support(
      bodyFont,
      kind === 'operational' ? 0.75 : 0.8125,
      kind === 'operational' ? 0.75 : 0.8125,
      kind === 'display' ? 700 : kind === 'operational' ? 600 : 500,
      kind === 'operational' ? 1.3 : kind === 'console' ? 1.35 : 1.45,
      kind === 'editorial' ? 28 : kind === 'operational' ? 20 : kind === 'console' ? 36 : 24,
      {
        letterSpacingEm: kind === 'console' ? 0 : kind === 'editorial' ? 0.04 : kind === 'operational' ? 0.012 : 0.02,
        paragraphSpacingEm: 0,
      },
    ),
    caption: support(
      bodyFont,
      Math.max(0.75, bodySize * (kind === 'editorial' ? 0.8 : 0.75)),
      Math.max(0.75, bodySize * (kind === 'editorial' ? 0.8 : 0.75)),
      400,
      kind === 'editorial' ? 1.65 : kind === 'operational' ? 1.4 : 1.5,
      kind === 'editorial' ? 66 : kind === 'operational' ? 50 : kind === 'console' ? 70 : 60,
      { letterSpacingEm: kind === 'editorial' ? 0.01 : 0, overflowWrap: 'anywhere', paragraphSpacingEm: 0.4 },
    ),
    data: support(
      monoFont,
      kind === 'operational' ? 0.8125 : Math.max(0.75, bodySize * (kind === 'editorial' ? 0.9 : 0.875)),
      kind === 'operational' ? 0.8125 : Math.max(0.75, bodySize * (kind === 'editorial' ? 0.9 : 0.875)),
      kind === 'operational' || kind === 'console' ? 500 : 400,
      kind === 'editorial' ? 1.6 : kind === 'operational' ? 1.4 : kind === 'console' ? 1.45 : 1.5,
      kind === 'editorial' ? 72 : kind === 'operational' ? 44 : kind === 'console' ? 78 : 70,
      { overflowWrap: 'anywhere', paragraphSpacingEm: 0.25, fontVariantNumeric: 'tabular-nums' },
    ),
  };
  return { kind, roles };
}
