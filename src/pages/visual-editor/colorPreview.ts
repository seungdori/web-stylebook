import { COLOR_ROLES, type ColorRole, type VisualColors, type VisualPair } from '../../visual/types';

/** CSS custom property for one semantic role. Preview and export aliases stay separate. */
export function colorRoleCustomProperty(role: ColorRole): string {
  return `--role-${role.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`;
}

export function colorRoleVariable(role: ColorRole): string {
  return `var(${colorRoleCustomProperty(role)})`;
}

/** Inline custom properties for the preview root. Values come from the resolved contract, never from palette order. */
export function colorPreviewVariables(colors: VisualColors): Record<string, string> {
  return Object.fromEntries(COLOR_ROLES.map((role) => [colorRoleCustomProperty(role), colors[role]]));
}

export interface ColorPreviewRegion {
  id: string;
  foreground: ColorRole;
  background: ColorRole;
  kind: VisualPair['kind'] | 'identity';
  style: Record<string, string>;
}

/** Roles the component pairs do not paint. They stay visible so edits cannot disappear. */
const IDENTITY_REGIONS: ReadonlyArray<{ id: string; foreground: ColorRole; background: ColorRole }> = [
  { id: 'accent-identity', foreground: 'accentText', background: 'accent' },
  { id: 'inverse-text', foreground: 'textInverse', background: 'text' },
  { id: 'muted-surface', foreground: 'textMuted', background: 'surfaceMuted' },
];

function regionStyle(foreground: ColorRole, background: ColorRole, kind: ColorPreviewRegion['kind'], id: string): Record<string, string> {
  if (id === 'input-boundary') {
    return {
      backgroundColor: colorRoleVariable(background),
      borderColor: colorRoleVariable(foreground),
      borderStyle: 'solid',
      borderWidth: '1px',
    };
  }
  if (kind === 'control' && foreground === 'focus') {
    return {
      backgroundColor: colorRoleVariable(background),
      outline: `3px solid ${colorRoleVariable(foreground)}`,
      outlineOffset: '3px',
    };
  }
  if (kind === 'decorative') {
    return {
      backgroundColor: colorRoleVariable(background),
      borderTop: `1px solid ${colorRoleVariable(foreground)}`,
    };
  }
  return {
    color: colorRoleVariable(foreground),
    backgroundColor: colorRoleVariable(background),
  };
}

/**
 * Every contrast pair plus the identity roles the pairs do not cover.
 * Selection is the secondary accent pair, not a muted surface with an accent rule.
 */
export function colorPreviewRegions(components: readonly VisualPair[]): ColorPreviewRegion[] {
  const regions: ColorPreviewRegion[] = [];
  const seen = new Set<string>();
  const add = (region: ColorPreviewRegion) => {
    if (seen.has(region.id)) throw new Error(`Duplicate color preview region '${region.id}'`);
    seen.add(region.id);
    regions.push(region);
  };
  for (const pair of components) {
    add({
      id: pair.id,
      foreground: pair.foreground,
      background: pair.background,
      kind: pair.kind,
      style: regionStyle(pair.foreground, pair.background, pair.kind, pair.id),
    });
  }
  for (const identity of IDENTITY_REGIONS) {
    add({
      ...identity,
      kind: 'identity',
      style: regionStyle(identity.foreground, identity.background, 'identity', identity.id),
    });
  }
  const used = new Set(regions.flatMap((region) => [region.foreground, region.background]));
  const missing = COLOR_ROLES.filter((role) => !used.has(role));
  if (missing.length > 0) throw new Error(`Color preview drops roles: ${missing.join(', ')}`);
  return regions;
}

export function colorPreviewRegionMap(components: readonly VisualPair[]): ReadonlyMap<string, ColorPreviewRegion> {
  return new Map(colorPreviewRegions(components).map((region) => [region.id, region]));
}
