// Canonical catalog assembly. Single source of truth for the website, the
// agent-handoff generator, and the MCP catalog compiler (P1). Merges the existing
// styles.ts data with the authored facets/families into the compiled CatalogStyle shape.

import { styleCatalog } from '../data/styles';
import {
  PRODUCT_TYPES, TONES, DENSITY_LEVELS, USAGE_FREQUENCIES, TRUST_LEVELS,
  STATE_CATEGORIES, TASK_TAGS, UX_PRINCIPLE_CATEGORIES, UX_OUTCOMES, UX_SURFACES,
  UX_PHASES, UX_EVIDENCE_KINDS, UX_EVIDENCE_CONFIDENCE,
  DESIGN_PRINCIPLE_CATEGORIES, DESIGN_CONCERNS,
} from './types';
import type {
  WebStylebookCatalogV1, CatalogStyle, CatalogCounts,
} from './types';
import { ontology } from './ontology';
import { styleFacets, notIdealMap } from './styleFacets';
import { styleFamilies, styleFamilyOf } from './styleFamilies';
import { motionCategories, motionPatterns } from './motion';
import { componentCategories, components } from './components';
import {
  uxPrincipleAttribution, uxPrincipleCategories, uxPrinciples,
} from './principles';
import {
  designPrincipleCategories, designPrinciples,
} from './designPrinciples';
import { productArchetypes } from './products';
import { stateSurfaces } from './states/surfaces';
import { stateRecipes } from './states/recipes';
import { policies } from './policies';

/** Merge a site StyleData entry + authored facets into the compiled CatalogStyle. */
function toCatalogStyle(s: (typeof styleCatalog)[number]): CatalogStyle {
  const facets = styleFacets[s.id];
  if (!facets) {
    throw new Error(`[catalog] style '${s.id}' is missing recommendationFacets (styleFacets.ts)`);
  }
  return {
    id: s.id,
    kind: s.kind,
    name: s.name,
    description: s.description,
    summary: s.summary,
    tags: s.tags,
    palette: s.palette,
    accent: s.accent,
    typography: s.promptProfile.typography,
    layout: s.promptProfile.layout,
    motion: s.promptProfile.motion,
    bestFor: s.promptProfile.bestFor,
    constraints: s.promptProfile.constraints,
    notIdealFor: s.promptProfile.notIdealFor,
    visualProfile: s.visualProfile,
    recommendationFacets: facets,
    fusionOf: s.fusionOf,
    styleFamilyId: styleFamilyOf[s.id],
  };
}

export const catalogStyles: CatalogStyle[] = styleCatalog.map(toCatalogStyle);

export function buildCatalogData(): WebStylebookCatalogV1 {
  return {
    ontology,
    ontologyEnums: {
      productTypes: [...PRODUCT_TYPES],
      tones: [...TONES],
      densityLevels: [...DENSITY_LEVELS],
      usageFrequencies: [...USAGE_FREQUENCIES],
      trustLevels: [...TRUST_LEVELS],
      stateCategories: [...STATE_CATEGORIES],
      taskTags: [...TASK_TAGS],
      uxPrincipleCategories: [...UX_PRINCIPLE_CATEGORIES],
      uxOutcomes: [...UX_OUTCOMES],
      uxSurfaces: [...UX_SURFACES],
      uxPhases: [...UX_PHASES],
      uxEvidenceKinds: [...UX_EVIDENCE_KINDS],
      uxEvidenceConfidence: [...UX_EVIDENCE_CONFIDENCE],
      designPrincipleCategories: [...DESIGN_PRINCIPLE_CATEGORIES],
      designConcerns: [...DESIGN_CONCERNS],
    },
    styles: catalogStyles,
    styleFamilies,
    notIdealMap,
    motionCategories,
    motionPatterns,
    componentCategories,
    components,
    uxPrincipleCategories,
    uxPrinciples,
    uxPrincipleAttribution,
    designPrincipleCategories,
    designPrinciples,
    productArchetypes,
    stateSurfaces,
    stateRecipes,
    policies,
  };
}

export function catalogCounts(data: WebStylebookCatalogV1): CatalogCounts {
  return {
    styles: data.styles.length,
    motionPatterns: data.motionPatterns.length,
    components: data.components.length,
    principles: data.uxPrinciples.length,
    designPrinciples: data.designPrinciples.length,
    productArchetypes: data.productArchetypes.length,
    stateSurfaces: data.stateSurfaces.length,
    stateRecipes: data.stateRecipes.length,
  };
}

export const CATALOG_DOMAINS = [
  'styles', 'motion', 'components', 'principles', 'design-principles',
  'states', 'products', 'policies',
] as const;

export * from './types';
