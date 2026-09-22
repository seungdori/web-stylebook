import { zTypographyRole } from '../../visual/schema';
import type { TypographyRole } from '../../visual/types';

export const numberFields = {
  sizeMinRem: { min: .5, max: 20, step: .05 }, sizeMaxRem: { min: .5, max: 30, step: .05 },
  fontWeight: { min: 100, max: 900, step: 100 }, lineHeight: { min: .8, max: 3, step: .05 },
  letterSpacingEm: { min: -.15, max: .5, step: .005 }, measureCh: { min: 8, max: 120, step: 1 },
  paragraphSpacingEm: { min: 0, max: 6, step: .1 },
} as const;
export type NumberField = keyof typeof numberFields;
export type TypographyDraft = Partial<Record<NumberField | 'fontFamily', string>>;

/** Invalid draft strings never cross into accepted shared state or CSS. */
export function parseTypographyDraft(original: TypographyRole, draft: TypographyDraft): {
  patch: Partial<TypographyRole> | null; errors: Partial<Record<keyof TypographyDraft, 'number' | 'font' | 'scale'>>;
} {
  const patch: Partial<TypographyRole> = {};
  const errors: Partial<Record<keyof TypographyDraft, 'number' | 'font' | 'scale'>> = {};
  for (const field of Object.keys(draft) as Array<keyof TypographyDraft>) {
    const value = draft[field] ?? '';
    if (field === 'fontFamily') {
      if (!zTypographyRole.shape.fontFamily.safeParse(value).success) errors[field] = 'font';
      else patch.fontFamily = value.trim();
    } else {
      const number = Number(value);
      if (!value.trim() || !Number.isFinite(number) || !zTypographyRole.shape[field].safeParse(number).success) errors[field] = 'number';
      else patch[field] = number;
    }
  }
  const candidate = { ...original, ...patch };
  if (candidate.sizeMaxRem < candidate.sizeMinRem) {
    errors.sizeMinRem = 'scale'; errors.sizeMaxRem = 'scale';
  }
  return { patch: Object.keys(errors).length ? null : patch, errors };
}
