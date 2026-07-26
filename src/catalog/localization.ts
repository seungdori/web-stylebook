// Catalog localization primitives.
// Single source of the language contract shared by the website, agent-handoff,
// and the MCP catalog. Re-exports the existing Lang/LocalizedText so there is
// exactly one definition in the repo (see 04 §1.2, ADR-013).

import type { Lang, LocalizedText } from '../data/styles';

export type { Lang, LocalizedText };

/** Ordered, canonical list of supported languages. en is the default/fallback. */
export const LANGS: readonly Lang[] = ['en', 'ko', 'ja'] as const;
export const DEFAULT_LANG: Lang = 'en';

/** Build a LocalizedText. Mirrors the helper used across the existing data files. */
export const t = (en: string, ko: string, ja: string): LocalizedText => ({ en, ko, ja });

/** Materialize a single locale, falling back to en. Use ONLY at presentation/protocol boundaries. */
export function text(value: LocalizedText, lang: Lang = DEFAULT_LANG): string {
  return value[lang] || value.en;
}

/** True when all three locales are present AND non-empty (no silent EN-fallback). 04 §1.3 / rank-10. */
export function isLocaleComplete(value: LocalizedText | undefined): boolean {
  if (!value) return false;
  return LANGS.every((l) => typeof value[l] === 'string' && value[l].trim().length > 0);
}
