import type { VisualOverrides, VisualRepair } from './types';
import { COLOR_ROLES, TYPOGRAPHY_ROLES } from './types';
import { visualOverridesSchema } from './schema';

const densityKeys = ['density', 'row', 'gutter', 'stack'] as const;
type Spacing = { unit: number; section: number; stack: number; density: 'comfortable' | 'compact'; row: number; gutter: number };

const colorRoles = new Set<string>(COLOR_ROLES);
const typeRoles = new Set<string>(TYPOGRAPHY_ROLES);
const typeFields = new Set(['fontFamily', 'fontWeight', 'fontStyle', 'sizeMinRem', 'sizeMaxRem', 'lineHeight', 'letterSpacingEm', 'paragraphSpacingEm', 'measureCh', 'textTransform', 'wordBreak', 'overflowWrap', 'fontVariantNumeric']);
const spacingFields = new Set(['unit', 'section', 'stack', 'density', 'row', 'gutter']);

export interface LeafDraft {
  overrides: VisualOverrides;
  acceptedRepairs: VisualRepair[];
}

export function applyResolvedLeaf(draft: LeafDraft, path: string, value: unknown, currentSpacing: Spacing): LeafDraft | null {
  const color = /^colors\.([A-Za-z]+)$/.exec(path);
  if (color) {
    if (!colorRoles.has(color[1]) || typeof value !== 'string') return null;
    const role = color[1] as VisualRepair['role'];
    const next: LeafDraft = {
      overrides: { ...draft.overrides, colors: { ...draft.overrides.colors, [role]: value } },
      acceptedRepairs: draft.acceptedRepairs.filter((repair) => repair.role !== role),
    };
    return visualOverridesSchema.safeParse(next.overrides).success ? next : null;
  }
  const type = /^typography\.roles\.([A-Za-z]+)\.([A-Za-z]+)$/.exec(path);
  if (type) {
    if (!typeRoles.has(type[1]) || !typeFields.has(type[2])) return null;
    const role = type[1] as keyof NonNullable<VisualOverrides['typography']>;
    const field = type[2];
    const next: LeafDraft = {
      overrides: {
        ...draft.overrides,
        typography: { ...draft.overrides.typography, [role]: { ...draft.overrides.typography?.[role], [field]: value } },
      },
      acceptedRepairs: draft.acceptedRepairs,
    };
    return visualOverridesSchema.safeParse(next.overrides).success ? next : null;
  }
  const spacingMatch = /^spacing\.([A-Za-z]+)$/.exec(path);
  if (spacingMatch) {
    const field = spacingMatch[1];
    if (!spacingFields.has(field)) return null;
    const overrides: VisualOverrides = { ...draft.overrides };
    const spacing = { ...overrides.spacing };
    const numeric = typeof value === 'number' ? value : null;
    if (field === 'density' && (value === 'comfortable' || value === 'compact')) spacing.density = value;
    else if (field === 'row' && numeric !== null) spacing.row = numeric;
    else if (field === 'gutter' && numeric !== null) spacing.gutter = numeric;
    else if (field === 'stack' && numeric !== null) spacing.stack = numeric;
    else if (field === 'unit' && numeric !== null) spacing.unit = numeric;
    else if (field === 'section' && numeric !== null) spacing.section = numeric;
    else return null;
    if (densityKeys.includes(field as typeof densityKeys[number]) && overrides.density) {
      spacing.density ??= currentSpacing.density;
      spacing.row ??= currentSpacing.row;
      spacing.gutter ??= currentSpacing.gutter;
      spacing.stack ??= currentSpacing.stack;
      delete overrides.density;
    }
    overrides.spacing = spacing;
    const next = { overrides, acceptedRepairs: draft.acceptedRepairs };
    return visualOverridesSchema.safeParse(next.overrides).success ? next : null;
  }
  return null;
}
