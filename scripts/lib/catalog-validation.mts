// Reference + invariant validation for the catalog (02 §6, 04 §1.3).
// Catches dangling ids, alias conflicts, enum violations, and locale gaps that
// the existing agent-handoff pipeline ships silently.

import type {
  WebStylebookCatalogV1, ProductType,
} from '../../src/catalog/types.ts';
import {
  PRODUCT_TYPES, TASK_TAGS, UX_PRINCIPLE_CATEGORIES,
  DESIGN_PRINCIPLE_CATEGORIES, DESIGN_CONCERNS,
} from '../../src/catalog/types.ts';
import { isLocaleComplete } from '../../src/catalog/localization.ts';
import type { LocalizedText } from '../../src/catalog/localization.ts';

export interface ValidationIssue {
  severity: 'error' | 'warning';
  domain: string;
  id: string;
  message: string;
}

const KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;

function assertUnique(items: { id: string }[], domain: string, issues: ValidationIssue[]): void {
  const seen = new Map<string, number>();
  for (const it of items) {
    seen.set(it.id, (seen.get(it.id) ?? 0) + 1);
    if (!KEBAB.test(it.id)) {
      issues.push({ severity: 'error', domain, id: it.id, message: `id is not kebab-case` });
    }
  }
  for (const [id, n] of seen) {
    if (n > 1) issues.push({ severity: 'error', domain, id, message: `duplicate id (${n}×)` });
  }
}

/** Walk every LocalizedText-shaped value and assert all three locales are non-empty. */
function checkLocale(
  value: unknown, domain: string, id: string, path: string, issues: ValidationIssue[],
): void {
  if (Array.isArray(value)) {
    value.forEach((v, i) => checkLocale(v, domain, id, `${path}[${i}]`, issues));
    return;
  }
  if (value && typeof value === 'object') {
    const keys = Object.keys(value);
    const looksLocalized = keys.length > 0 && ['en', 'ko', 'ja'].every((k) => keys.includes(k))
      && keys.every((k) => ['en', 'ko', 'ja'].includes(k));
    if (looksLocalized) {
      if (!isLocaleComplete(value as LocalizedText)) {
        issues.push({ severity: 'error', domain, id, message: `incomplete/empty locale at ${path}` });
      }
      return;
    }
    for (const k of keys) checkLocale((value as Record<string, unknown>)[k], domain, id, `${path}.${k}`, issues);
  }
}

export function validateCatalog(data: WebStylebookCatalogV1): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const styleIds = new Set(data.styles.map((s) => s.id));
  const surfaceIds = new Set(data.stateSurfaces.map((s) => s.id));
  const recipeIds = new Set(data.stateRecipes.map((r) => r.id));
  const principleIds = new Set(data.uxPrinciples.map((p) => p.id));
  const designPrincipleIds = new Set(data.designPrinciples.map((p) => p.id));
  const productTypeSet = new Set<string>(PRODUCT_TYPES);
  const taskTagSet = new Set<string>(TASK_TAGS);

  // id uniqueness + kebab
  assertUnique(data.styles, 'style', issues);
  assertUnique(data.motionPatterns, 'motion', issues);
  assertUnique(data.components, 'component', issues);
  assertUnique(data.uxPrincipleCategories, 'principle-category', issues);
  assertUnique(data.uxPrinciples, 'principle', issues);
  assertUnique(data.designPrincipleCategories, 'design-principle-category', issues);
  assertUnique(data.designPrinciples, 'design-principle', issues);
  assertUnique(data.stateRecipes, 'state', issues);
  assertUnique(data.stateSurfaces, 'surface', issues);
  assertUnique(data.productArchetypes, 'product', issues);

  // styles: facet coverage, fusion refs, family ref, notIdealFor mapping
  for (const s of data.styles) {
    if (!s.recommendationFacets) {
      issues.push({ severity: 'error', domain: 'style', id: s.id, message: 'missing recommendationFacets' });
    }
    for (const parent of s.fusionOf ?? []) {
      if (!styleIds.has(parent)) {
        issues.push({ severity: 'error', domain: 'style', id: s.id, message: `fusionOf references unknown style '${parent}'` });
      }
    }
    if (s.styleFamilyId && !data.styleFamilies.some((f) => f.id === s.styleFamilyId)) {
      issues.push({ severity: 'error', domain: 'style', id: s.id, message: `unknown styleFamilyId '${s.styleFamilyId}'` });
    }
    // facet ↔ prose integrity (04 §3.3): notIdealFor finance/trust ⇒ no high trust
    const ni = s.notIdealFor.join(' ').toLowerCase();
    if (/finance|trust|bank|legal|health/.test(ni) && s.recommendationFacets?.trust.includes('high')) {
      issues.push({ severity: 'warning', domain: 'style', id: s.id, message: `notIdealFor mentions finance/trust but facets.trust includes 'high'` });
    }
    // tones ∩ antiTones disjoint
    const f = s.recommendationFacets;
    if (f && f.tones.some((tone) => f.antiTones.includes(tone))) {
      issues.push({ severity: 'error', domain: 'style', id: s.id, message: `tones and antiTones overlap` });
    }
    // facet enum validity
    for (const pt of f?.productTypes ?? []) {
      if (!productTypeSet.has(pt)) issues.push({ severity: 'error', domain: 'style', id: s.id, message: `facets.productTypes has invalid '${pt}'` });
    }
  }

  // style family membership ↔ assignment consistency
  for (const fam of data.styleFamilies) {
    for (const m of fam.memberStyleIds) {
      if (!styleIds.has(m)) issues.push({ severity: 'error', domain: 'family', id: fam.id, message: `member '${m}' is not a style` });
    }
  }

  // notIdealMap values valid productTypes
  for (const [phrase, pts] of Object.entries(data.notIdealMap)) {
    for (const pt of pts) {
      if (!productTypeSet.has(pt)) issues.push({ severity: 'error', domain: 'notIdealMap', id: phrase, message: `invalid productType '${pt}'` });
    }
  }

  // products: style refs, surface refs, task tags
  for (const p of data.productArchetypes) {
    for (const sid of [...p.recommendedPrimaryStyleIds, ...p.recommendedSecondaryStyleIds, ...p.avoidStyleIds]) {
      if (!styleIds.has(sid)) issues.push({ severity: 'error', domain: 'product', id: p.id, message: `references unknown style '${sid}'` });
    }
    for (const surf of p.stateSurfaceIds) {
      if (!surfaceIds.has(surf)) issues.push({ severity: 'error', domain: 'product', id: p.id, message: `references unknown surface '${surf}'` });
    }
    for (const task of p.primaryTasks) {
      if (!taskTagSet.has(task)) issues.push({ severity: 'error', domain: 'product', id: p.id, message: `invalid task tag '${task}'` });
    }
    // an archetype must NOT recommend a style its own productType would hard-reject, and a
    // curated PRIMARY must claim the productType in its facets (round 4 commerce bug guard).
    if (productTypeSet.has(p.id)) {
      const styleById = new Map(data.styles.map((s) => [s.id, s]));
      const hardRejectsFor = (s: typeof data.styles[number]): boolean => {
        const mapped = new Set<string>();
        for (const phrase of s.notIdealFor) {
          for (const m of (data.notIdealMap[phrase.toLowerCase().trim()] ?? [])) mapped.add(m);
        }
        return mapped.has(p.id) && !s.recommendationFacets.productTypes.includes(p.id as never);
      };
      for (const sid of [...p.recommendedPrimaryStyleIds, ...p.recommendedSecondaryStyleIds]) {
        const s = styleById.get(sid);
        if (s && hardRejectsFor(s)) {
          issues.push({ severity: 'error', domain: 'product', id: p.id, message: `recommends '${sid}' which is hard-rejected (PRODUCT_NOT_IDEAL) for productType '${p.id}'` });
        }
      }
      for (const sid of p.recommendedPrimaryStyleIds) {
        const s = styleById.get(sid);
        if (s && !s.recommendationFacets.productTypes.includes(p.id as never)) {
          issues.push({ severity: 'warning', domain: 'product', id: p.id, message: `curated primary '${sid}' does not claim productType '${p.id}' in its facets (weak fit)` });
        }
      }
    }
  }

  // components: relatedStateIds exist
  for (const c of data.components) {
    for (const rid of c.relatedStateIds) {
      if (!recipeIds.has(rid)) issues.push({ severity: 'error', domain: 'component', id: c.id, message: `relatedStateIds references unknown state '${rid}'` });
    }
  }

  // UX principles: related ids resolve and reference URLs point to the credited index.
  const expectedPrincipleCategories = new Set<string>(UX_PRINCIPLE_CATEGORIES);
  const actualPrincipleCategories = new Set<string>(data.uxPrincipleCategories.map((category) => category.id));
  for (const category of expectedPrincipleCategories) {
    if (!actualPrincipleCategories.has(category)) {
      issues.push({ severity: 'error', domain: 'principle-category', id: category, message: 'missing category definition' });
    }
    if (!data.uxPrinciples.some((principle) => principle.category === category)) {
      issues.push({ severity: 'error', domain: 'principle-category', id: category, message: 'category has no principles' });
    }
  }
  for (const category of actualPrincipleCategories) {
    if (!expectedPrincipleCategories.has(category)) {
      issues.push({ severity: 'error', domain: 'principle-category', id: category, message: 'unknown category definition' });
    }
  }
  for (const p of data.uxPrinciples) {
    for (const relatedId of p.relatedPrincipleIds) {
      if (!principleIds.has(relatedId)) {
        issues.push({ severity: 'error', domain: 'principle', id: p.id, message: `relatedPrincipleIds references unknown principle '${relatedId}'` });
      }
      if (relatedId === p.id) {
        issues.push({ severity: 'error', domain: 'principle', id: p.id, message: 'relatedPrincipleIds must not reference itself' });
      }
    }
    if (!/^https:\/\/lawsofux\.com\/[a-z0-9-]+\/$/.test(p.referenceUrl)) {
      issues.push({ severity: 'error', domain: 'principle', id: p.id, message: 'referenceUrl must be a canonical Laws of UX detail URL' });
    }
    for (const reference of p.evidence.references) {
      if (!reference.title.trim()) {
        issues.push({ severity: 'error', domain: 'principle', id: p.id, message: 'evidence reference title is empty' });
      }
      if (!reference.url.startsWith('https://')) {
        issues.push({ severity: 'error', domain: 'principle', id: p.id, message: 'evidence reference must use HTTPS' });
      }
    }
  }

  // Visual design principles: category coverage, enum tags, and cross-domain references.
  const expectedDesignCategories = new Set<string>(DESIGN_PRINCIPLE_CATEGORIES);
  const actualDesignCategories = new Set<string>(data.designPrincipleCategories.map((category) => category.id));
  const designConcernSet = new Set<string>(DESIGN_CONCERNS);
  for (const category of expectedDesignCategories) {
    if (!actualDesignCategories.has(category)) {
      issues.push({ severity: 'error', domain: 'design-principle-category', id: category, message: 'missing category definition' });
    }
    if (!data.designPrinciples.some((principle) => principle.category === category)) {
      issues.push({ severity: 'error', domain: 'design-principle-category', id: category, message: 'category has no principles' });
    }
  }
  for (const category of actualDesignCategories) {
    if (!expectedDesignCategories.has(category)) {
      issues.push({ severity: 'error', domain: 'design-principle-category', id: category, message: 'unknown category definition' });
    }
  }
  for (const p of data.designPrinciples) {
    for (const concern of p.concernTags) {
      if (!designConcernSet.has(concern)) {
        issues.push({ severity: 'error', domain: 'design-principle', id: p.id, message: `concernTags has invalid '${concern}'` });
      }
    }
    for (const relatedId of p.relatedDesignPrincipleIds) {
      if (!designPrincipleIds.has(relatedId)) {
        issues.push({ severity: 'error', domain: 'design-principle', id: p.id, message: `relatedDesignPrincipleIds references unknown design principle '${relatedId}'` });
      }
      if (relatedId === p.id) {
        issues.push({ severity: 'error', domain: 'design-principle', id: p.id, message: 'relatedDesignPrincipleIds must not reference itself' });
      }
    }
    for (const relatedId of p.relatedUxPrincipleIds) {
      if (!principleIds.has(relatedId)) {
        issues.push({ severity: 'error', domain: 'design-principle', id: p.id, message: `relatedUxPrincipleIds references unknown UX principle '${relatedId}'` });
      }
    }
  }

  // surfaces: required/recommended state ids exist + criticality alignment
  for (const surf of data.stateSurfaces) {
    for (const sid of [...surf.requiredStateIds, ...surf.recommendedStateIds]) {
      if (!recipeIds.has(sid)) issues.push({ severity: 'error', domain: 'surface', id: surf.id, message: `references unknown state '${sid}'` });
    }
  }

  // recipes: surfaceIds resolve to real surfaces (catches 'search-results')
  for (const r of data.stateRecipes) {
    for (const surf of r.surfaceIds) {
      if (!surfaceIds.has(surf)) issues.push({ severity: 'error', domain: 'state', id: r.id, message: `surfaceIds references unknown surface '${surf}'` });
    }
  }

  // policies: decision example style refs
  for (const d of data.policies.decisionExamples) {
    if (!styleIds.has(d.chosenPrimary)) issues.push({ severity: 'error', domain: 'policy', id: d.id, message: `chosenPrimary '${d.chosenPrimary}' is not a style` });
    if (d.chosenSecondary && !styleIds.has(d.chosenSecondary)) issues.push({ severity: 'error', domain: 'policy', id: d.id, message: `chosenSecondary '${d.chosenSecondary}' is not a style` });
    for (const w of d.wouldNotPick) {
      if (!styleIds.has(w.id)) issues.push({ severity: 'error', domain: 'policy', id: d.id, message: `wouldNotPick '${w.id}' is not a style` });
    }
  }

  // resource URI collisions
  const uris = new Set<string>();
  const add = (uri: string, domain: string, id: string) => {
    if (uris.has(uri)) issues.push({ severity: 'error', domain, id, message: `resource URI collision: ${uri}` });
    uris.add(uri);
  };
  data.styles.forEach((s) => add(`webstylebook://styles/${s.id}`, 'style', s.id));
  data.motionPatterns.forEach((m) => add(`webstylebook://motion/${m.id}`, 'motion', m.id));
  data.components.forEach((c) => add(`webstylebook://components/${c.id}`, 'component', c.id));
  data.uxPrinciples.forEach((p) => add(`webstylebook://principles/${p.id}`, 'principle', p.id));
  data.productArchetypes.forEach((p) => add(`webstylebook://products/${p.id}`, 'product', p.id));
  data.stateSurfaces.forEach((s) => add(`webstylebook://states/${s.id}`, 'surface', s.id));

  // locale completeness across every LocalizedText in the catalog
  const localeDomains: Array<[string, { id: string }[]]> = [
    ['style', data.styles], ['motion', data.motionPatterns], ['component', data.components],
    ['principle-category', data.uxPrincipleCategories],
    ['principle', data.uxPrinciples],
    ['design-principle-category', data.designPrincipleCategories],
    ['design-principle', data.designPrinciples],
    ['product', data.productArchetypes], ['surface', data.stateSurfaces], ['state', data.stateRecipes],
  ];
  for (const [domain, items] of localeDomains) {
    for (const it of items) checkLocale(it, domain, it.id, '', issues);
  }
  return issues;
}

export function notIdealCoverageWarnings(data: WebStylebookCatalogV1): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const mapped = new Set(Object.keys(data.notIdealMap).map((k) => k.toLowerCase().trim()));
  const phrases = new Set<string>();
  for (const s of data.styles) for (const p of s.notIdealFor) phrases.add(p.toLowerCase().trim());
  for (const p of phrases) {
    if (!mapped.has(p)) {
      issues.push({ severity: 'warning', domain: 'notIdealMap', id: p, message: `notIdealFor phrase not mapped to a productType` });
    }
  }
  return issues;
}

void (null as unknown as ProductType);
