import { productArchetypes } from '../catalog/products';
import { notIdealMap } from '../catalog/styleFacets';
import type { ProductType } from '../catalog/types';
import { getStyleById, type StyleData } from './styles';

export const HERO_STYLE_IDS = ['editorial-silence', 'brutalist-grid', 'quiet-utility'] as const;

export const HOME_FIXTURE_ID = 'product' as const;

export const HOME_PURPOSE_IDS = ['operational-saas', 'content-editorial', 'campaign', 'commerce'] as const;

export type HomePurposeId = (typeof HOME_PURPOSE_IDS)[number];

const SHORTLIST_LIMIT = 3;

export interface PurposeEntry {
  styleId: string;
  productFit: 'recommendedPrimaryStyleIds';
  reasons: string[];
}

export interface PurposeCaution {
  styleId: string;
  source: 'notIdealFor' | 'product-fit';
  phrase?: string;
}

export interface PurposeCautionGroup {
  styleId: string;
  phrases: string[];
  productFit: boolean;
}

export interface PurposeDiscovery {
  input: string;
  status: 'shortlist' | 'neutral';
  neutralReason?: 'browse' | 'mixed' | 'unknown';
  archetypeId?: HomePurposeId;
  entries: PurposeEntry[];
  cautions: PurposeCaution[];
  /** Purpose metadata never removes catalog styles. */
  hidesStyles: false;
}

function isHomePurpose(value: string): value is HomePurposeId {
  return (HOME_PURPOSE_IDS as readonly string[]).includes(value);
}

/**
 * Looks up the authored notIdealFor phrase as a whole key.
 * A longer sentence that merely contains a mapped phrase is not a match.
 */
export function matchingNotIdealPhrases(phrases: readonly string[], productType: string): string[] {
  const matches: string[] = [];
  for (const phrase of phrases) {
    if (!Object.prototype.hasOwnProperty.call(notIdealMap, phrase)) continue;
    const mapped = notIdealMap[phrase];
    if (mapped?.includes(productType as ProductType)) matches.push(phrase);
  }
  return matches;
}

function entryFor(style: StyleData): PurposeEntry {
  return {
    styleId: style.id,
    productFit: 'recommendedPrimaryStyleIds',
    reasons: [...style.promptProfile.bestFor],
  };
}

export function cautionGroups(cautions: readonly PurposeCaution[]): PurposeCautionGroup[] {
  const groups = new Map<string, PurposeCautionGroup>();
  for (const caution of cautions) {
    const group = groups.get(caution.styleId) ?? { styleId: caution.styleId, phrases: [], productFit: false };
    if (caution.phrase && !group.phrases.includes(caution.phrase)) group.phrases.push(caution.phrase);
    if (caution.source === 'product-fit') group.productFit = true;
    groups.set(caution.styleId, group);
  }
  return [...groups.values()];
}

export function resolvePurposeDiscovery(input: string): PurposeDiscovery {
  const neutral = (neutralReason: NonNullable<PurposeDiscovery['neutralReason']>): PurposeDiscovery => ({
    input,
    status: 'neutral',
    neutralReason,
    entries: [],
    cautions: [],
    hidesStyles: false,
  });
  if (input === 'all' || input === '') return neutral('browse');
  if (input === 'mixed') return neutral('mixed');
  if (!isHomePurpose(input)) return neutral('unknown');

  const archetype = productArchetypes.find((item) => item.id === input);
  if (!archetype) return neutral('unknown');

  const entries: PurposeEntry[] = [];
  for (const styleId of archetype.recommendedPrimaryStyleIds) {
    if (entries.length >= SHORTLIST_LIMIT) break;
    const style = getStyleById(styleId);
    if (!style) continue;
    entries.push(entryFor(style));
  }

  const cautions: PurposeCaution[] = [];
  for (const styleId of archetype.avoidStyleIds) {
    const style = getStyleById(styleId);
    if (!style) continue;
    const phrases = matchingNotIdealPhrases(style.promptProfile.notIdealFor, input);
    if (phrases.length === 0) {
      cautions.push({ styleId, source: 'product-fit' });
      continue;
    }
    for (const phrase of phrases) cautions.push({ styleId, source: 'notIdealFor', phrase });
  }

  return {
    input,
    status: 'shortlist',
    archetypeId: input,
    entries,
    cautions,
    hidesStyles: false,
  };
}
