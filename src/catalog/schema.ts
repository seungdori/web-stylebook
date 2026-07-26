// Runtime validation schema (Zod v4) for the compiled catalog (04 §1.3).
// Used by the catalog compiler (pre-emit) and the MCP repository (on load).
// TypeScript types alone are not trusted — this enforces locale completeness,
// enum membership, and structural invariants at runtime.

import { z } from 'zod';
import {
  PRODUCT_TYPES, TONES, DENSITY_LEVELS, USAGE_FREQUENCIES, TRUST_LEVELS,
  INTENSITY_LEVELS, STATE_CATEGORIES, STATE_CRITICALITIES, COMPONENT_CATEGORIES,
  MOTION_CATEGORIES, TASK_TAGS, UX_PRINCIPLE_CATEGORIES, UX_OUTCOMES, UX_SURFACES,
  UX_PHASES, UX_EVIDENCE_KINDS, UX_EVIDENCE_CONFIDENCE,
  DESIGN_PRINCIPLE_CATEGORIES, DESIGN_CONCERNS,
} from './types';

/** LocalizedText with all three locales present AND non-empty (no EN-fallback reliance). */
export const zLocalizedText = z.object({
  en: z.string().trim().min(1),
  ko: z.string().trim().min(1),
  ja: z.string().trim().min(1),
});

const zHex = z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/, 'hex color');
const zId = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'kebab-case id');

const zProductType = z.enum(PRODUCT_TYPES);
const zTone = z.enum(TONES);
const zDensity = z.enum(DENSITY_LEVELS);
const zUsage = z.enum(USAGE_FREQUENCIES);
const zTrust = z.enum(TRUST_LEVELS);
const zIntensity = z.enum(INTENSITY_LEVELS);
const zTaskTag = z.enum(TASK_TAGS);
const zUxPrincipleCategory = z.enum(UX_PRINCIPLE_CATEGORIES);
const zUxOutcome = z.enum(UX_OUTCOMES);
const zUxSurface = z.enum(UX_SURFACES);
const zUxPhase = z.enum(UX_PHASES);
const zUxEvidenceKind = z.enum(UX_EVIDENCE_KINDS);
const zUxEvidenceConfidence = z.enum(UX_EVIDENCE_CONFIDENCE);
const zDesignPrincipleCategory = z.enum(DESIGN_PRINCIPLE_CATEGORIES);
const zDesignConcern = z.enum(DESIGN_CONCERNS);

const zOntologyTerm = z.object({
  value: z.string().min(1),
  label: zLocalizedText,
  aliases: z.array(z.string().min(1)),
});

export const zRecommendationFacets = z.object({
  productTypes: z.array(zProductType).min(1),
  tones: z.array(zTone),
  antiTones: z.array(zTone),
  density: z.array(zDensity).min(1),
  usageFrequency: z.array(zUsage).min(1),
  trust: z.array(zTrust).min(1),
  strengths: z.array(z.string().min(1)),
  risks: z.array(z.string().min(1)),
  motionIntensity: zIntensity,
  continuousSpectacle: z.boolean(),
  maintenanceComplexity: zIntensity,
}).refine((f) => f.tones.every((tone) => !f.antiTones.includes(tone)), {
  message: 'tones and antiTones must be disjoint',
});

export const zCatalogStyle = z.object({
  id: zId,
  kind: z.enum(['style', 'fusion']),
  name: zLocalizedText,
  description: zLocalizedText,
  summary: zLocalizedText,
  tags: z.array(z.string()),
  palette: z.array(zHex),
  accent: zHex,
  typography: z.string(),
  layout: z.string(),
  motion: z.string(),
  bestFor: z.array(z.string()),
  constraints: z.array(z.string()),
  notIdealFor: z.array(z.string()),
  visualProfile: z.object({ headline: z.string(), surface: z.string(), rhythm: z.string() }),
  recommendationFacets: zRecommendationFacets,
  fusionOf: z.array(zId).optional(),
  styleFamilyId: zId.optional(),
});

export const zStyleFamily = z.object({
  id: zId,
  name: zLocalizedText,
  memberStyleIds: z.array(zId),
  tokenDefaults: z.object({
    color: z.record(z.string(), z.string()),
    typography: z.record(z.string(), z.unknown()),
    radius: z.record(z.string(), z.string()).optional(),
    motion: z.record(z.string(), z.string()).optional(),
    density: z.record(z.string(), z.string()).optional(),
  }),
});

export const zMotionPattern = z.object({
  id: zId,
  category: z.enum(MOTION_CATEGORIES),
  name: zLocalizedText,
  aliases: z.array(z.string()),
  summary: zLocalizedText,
  useWhen: zLocalizedText,
  avoidWhen: zLocalizedText,
  prompt: zLocalizedText,
  intensity: zIntensity,
  continuous: z.boolean(),
  reducedMotionFallback: zLocalizedText,
  previewKind: z.string().optional(),
});

export const zComponentTerm = z.object({
  id: zId,
  category: z.enum(COMPONENT_CATEGORIES),
  name: zLocalizedText,
  aliases: z.array(z.string()),
  plain: zLocalizedText,
  useWhen: zLocalizedText,
  avoidWhen: zLocalizedText,
  semanticRoles: z.array(z.string()),
  relatedStateIds: z.array(zId),
  example: z.string().optional(),
});

export const zUxPrinciple = z.object({
  id: zId,
  name: zLocalizedText,
  aliases: z.array(z.string().min(1)),
  category: zUxPrincipleCategory,
  summary: zLocalizedText,
  designQuestion: zLocalizedText,
  apply: z.array(zLocalizedText).min(1),
  verify: z.array(zLocalizedText).min(1),
  caution: zLocalizedText,
  outcomeTags: z.array(zUxOutcome).min(1),
  surfaceTags: z.array(zUxSurface).min(1),
  phaseTags: z.array(zUxPhase).min(1),
  evidence: z.object({
    kind: zUxEvidenceKind,
    confidence: zUxEvidenceConfidence,
    references: z.array(z.object({
      title: z.string().trim().min(1),
      url: z.string().url(),
    })).min(1),
  }),
  relatedPrincipleIds: z.array(zId),
  referenceUrl: z.string().url(),
});

export const zDesignPrinciple = z.object({
  id: zId,
  name: zLocalizedText,
  aliases: z.array(z.string().min(1)),
  category: zDesignPrincipleCategory,
  summary: zLocalizedText,
  designQuestion: zLocalizedText,
  placement: z.array(zLocalizedText).min(1),
  apply: z.array(zLocalizedText).min(1),
  verify: z.array(zLocalizedText).min(1),
  caution: zLocalizedText,
  concernTags: z.array(zDesignConcern).min(1),
  surfaceTags: z.array(zUxSurface).min(1),
  phaseTags: z.array(zUxPhase).min(1),
  relatedDesignPrincipleIds: z.array(zId),
  relatedUxPrincipleIds: z.array(zId),
});

export const zProductArchetype = z.object({
  id: zId,
  name: zLocalizedText,
  description: zLocalizedText,
  signals: z.array(z.string()),
  primaryTasks: z.array(zTaskTag),
  commonScreens: z.array(z.string()),
  recommendedPrimaryStyleIds: z.array(zId),
  recommendedSecondaryStyleIds: z.array(zId),
  avoidStyleIds: z.array(zId),
  defaultDensity: zDensity,
  defaultUsageFrequency: zUsage,
  defaultTrust: zTrust,
  stateSurfaceIds: z.array(zId),
});

export const zStateSurface = z.object({
  id: zId,
  name: zLocalizedText,
  description: zLocalizedText,
  requiredStateIds: z.array(zId).min(1),
  recommendedStateIds: z.array(zId),
  domainSignals: z.array(z.string()),
});

export const zStateRecipe = z.object({
  id: zId,
  surfaceIds: z.array(zId).min(1),
  category: z.enum(STATE_CATEGORIES),
  criticality: z.enum(STATE_CRITICALITIES),
  name: zLocalizedText,
  summary: zLocalizedText,
  aliases: z.array(z.string()),
  domainSignals: z.array(z.string()),
  triggers: z.array(zLocalizedText).min(1),
  userQuestions: z.array(zLocalizedText).min(1),
  mustShow: z.array(zLocalizedText).min(1),
  mustPreserve: z.array(zLocalizedText),
  primaryActions: z.array(zLocalizedText).min(1),
  secondaryActions: z.array(zLocalizedText),
  mustNot: z.array(zLocalizedText).min(1),
  accessibility: z.object({
    announcement: zLocalizedText.optional(),
    focus: zLocalizedText.optional(),
    keyboard: z.array(zLocalizedText).optional(),
    contrast: z.array(zLocalizedText).optional(),
  }),
  motion: z.object({
    guidance: z.array(zLocalizedText),
    reducedMotion: z.array(zLocalizedText),
  }),
});

const zPolicies = z.object({
  preflight: z.array(z.object({ id: zId, label: zLocalizedText, detail: zLocalizedText })),
  verification: z.array(z.object({ id: zId, title: zLocalizedText, items: z.array(zLocalizedText) })),
  antiPatterns: z.array(z.object({ id: zId, pattern: zLocalizedText, why: zLocalizedText, fix: zLocalizedText })),
  decisionExamples: z.array(z.object({
    id: zId,
    product: zLocalizedText,
    chosenPrimary: zId,
    chosenSecondary: zId.optional(),
    reasoning: zLocalizedText,
    wouldNotPick: z.array(z.object({ id: zId, reason: zLocalizedText })),
  })),
});

export const zWebStylebookCatalogV1 = z.object({
  ontology: z.object({
    productTypes: z.array(zOntologyTerm),
    tones: z.array(zOntologyTerm),
    densityLevels: z.array(zOntologyTerm),
    usageFrequencies: z.array(zOntologyTerm),
    trustLevels: z.array(zOntologyTerm),
    taskTags: z.array(zOntologyTerm),
    stateCategories: z.array(zOntologyTerm),
    productAdjacency: z.record(z.string(), z.array(zProductType)),
    constraintMappings: z.array(z.object({
      constraint: z.string(), matchesRisks: z.array(z.string()),
      hardReject: z.literal('ACCESSIBILITY_CONFLICT').optional(),
    })),
  }),
  ontologyEnums: z.object({
    productTypes: z.array(z.string()), tones: z.array(z.string()),
    densityLevels: z.array(z.string()), usageFrequencies: z.array(z.string()),
    trustLevels: z.array(z.string()), stateCategories: z.array(z.string()),
    taskTags: z.array(z.string()),
    uxPrincipleCategories: z.array(zUxPrincipleCategory),
    uxOutcomes: z.array(zUxOutcome),
    uxSurfaces: z.array(zUxSurface),
    uxPhases: z.array(zUxPhase),
    uxEvidenceKinds: z.array(zUxEvidenceKind),
    uxEvidenceConfidence: z.array(zUxEvidenceConfidence),
    designPrincipleCategories: z.array(zDesignPrincipleCategory),
    designConcerns: z.array(zDesignConcern),
  }),
  styles: z.array(zCatalogStyle).min(1),
  styleFamilies: z.array(zStyleFamily),
  notIdealMap: z.record(z.string(), z.array(zProductType)),
  motionCategories: z.array(z.object({ id: z.enum(MOTION_CATEGORIES), label: zLocalizedText, description: zLocalizedText })),
  motionPatterns: z.array(zMotionPattern).min(1),
  componentCategories: z.array(z.object({ id: z.enum(COMPONENT_CATEGORIES), title: zLocalizedText, description: zLocalizedText })),
  components: z.array(zComponentTerm).min(1),
  uxPrincipleCategories: z.array(z.object({
    id: zUxPrincipleCategory,
    label: zLocalizedText,
    description: zLocalizedText,
  })),
  uxPrinciples: z.array(zUxPrinciple).min(1),
  uxPrincipleAttribution: z.object({
    sourceName: z.string().min(1),
    creator: z.string().min(1),
    sourceUrl: z.string().url(),
    sourceLicense: z.object({ name: z.string().min(1), url: z.string().url() }),
    authoredContentLicense: z.object({ name: z.string().min(1), url: z.string().url() }),
    notice: zLocalizedText,
  }),
  designPrincipleCategories: z.array(z.object({
    id: zDesignPrincipleCategory,
    label: zLocalizedText,
    description: zLocalizedText,
  })),
  designPrinciples: z.array(zDesignPrinciple).min(1),
  productArchetypes: z.array(zProductArchetype).min(1),
  stateSurfaces: z.array(zStateSurface).min(1),
  stateRecipes: z.array(zStateRecipe).min(1),
  policies: zPolicies,
});

export const zCatalogEnvelope = z.object({
  schema: z.literal('webstylebook.catalog.v1'),
  catalogVersion: z.string().min(1),
  contentHash: z.string().regex(/^sha256:[0-9a-f]{64}$/),
  sourceRevision: z.string().optional(),
  languages: z.tuple([z.literal('en'), z.literal('ko'), z.literal('ja')]),
  data: zWebStylebookCatalogV1,
});

export type ValidatedCatalogEnvelope = z.infer<typeof zCatalogEnvelope>;
