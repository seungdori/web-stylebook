// SPDX-License-Identifier: MIT
/**
 * The recipe fields a visual contract is built from.
 * recipes.json also keeps authoring evidence that no contract reads: where a weight,
 * size or motion value was found, and the selectors and notes of alternate modes.
 * `runtimeRecipe` keeps only the fields below. contracts.ts applies it, and the site
 * build (vite.config.ts) applies it to recipes.json before bundling, so the browser
 * ships only these fields and builds the same contracts as Node.
 */
export type SourceRecipe = {
  id:string;defaultMode:string;canvas:string;surface:string|null;text:string;muted:string|null;accent:string|null;border:string|null;
  displayFont:string|null;bodyFont:string|null;monoFont:string|null;displayMinRem:number|null;displayMaxRem:number|null;
  displayWeight:number|null;displayLineHeight:number|string|null;bodySizeRem:number|null;bodyLineHeight:number|null;
  borderWidthPx:number|null;radiusPx:number|null;shadow:string|null;density:string;
  source:unknown;notes:string|string[];supportedAlternateModes?:Array<Record<string,unknown>>;alternativeModes?:Partial<Record<string,Record<string,unknown>>>;
  shadowNormalizedFromInvalidAuthoredSyntax?:boolean;
  displayLetterSpacingEm?:number|null;bodyLetterSpacingEm?:number|null;bodyWeight?:number|null;
  motionDurationMs?:number|null;motionEasing?:string|null;
  bodyMinRem?:number|null;bodyMaxRem?:number|null;displayWeightResolved?:number|null;fidelityNotes?:string[];
};

const RECIPE_FIELDS = [
  'id', 'defaultMode', 'canvas', 'surface', 'text', 'muted', 'accent', 'border',
  'displayFont', 'bodyFont', 'monoFont', 'displayMinRem', 'displayMaxRem',
  'displayWeight', 'displayLineHeight', 'bodySizeRem', 'bodyLineHeight',
  'borderWidthPx', 'radiusPx', 'shadow', 'density',
  'source', 'notes', 'supportedAlternateModes', 'alternativeModes',
  'shadowNormalizedFromInvalidAuthoredSyntax',
  'displayLetterSpacingEm', 'bodyLetterSpacingEm', 'bodyWeight',
  'motionDurationMs', 'motionEasing',
  'bodyMinRem', 'bodyMaxRem', 'displayWeightResolved', 'fidelityNotes',
] as const satisfies readonly (keyof SourceRecipe)[];
// A field added to SourceRecipe without adding it above fails to compile here.
const everyFieldListed: Exclude<keyof SourceRecipe, (typeof RECIPE_FIELDS)[number]> extends never ? true : never = true;
void everyFieldListed;

/** contracts.ts reads an alternate mode's colors, its shadow and its mode name. */
const ALTERNATE_MODE_FIELDS = ['mode', 'canvas', 'surface', 'text', 'muted', 'accent', 'border', 'shadow'] as const;

function pick<T extends object>(value: T, fields: readonly string[]): T {
  return Object.fromEntries(Object.entries(value).filter(([field]) => fields.includes(field))) as T;
}

export function runtimeRecipe(recipe: SourceRecipe): SourceRecipe {
  const projected = pick(recipe, RECIPE_FIELDS);
  if (recipe.supportedAlternateModes) projected.supportedAlternateModes = recipe.supportedAlternateModes.map((mode) => pick(mode, ALTERNATE_MODE_FIELDS));
  if (recipe.alternativeModes) projected.alternativeModes = Object.fromEntries(Object.entries(recipe.alternativeModes).map(([mode, fields]) => [mode, fields && pick(fields, ALTERNATE_MODE_FIELDS)]));
  return projected;
}
