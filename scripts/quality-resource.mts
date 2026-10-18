export type ResourceKind = 'font' | 'catalog' | 'reference' | 'model' | 'other';
export type ResourcePhase = 'first-use' | 'warm-edit' | 'warm-axis' | 'warm-export';

export interface ResourceEvent {
  phase: ResourcePhase;
  url: string;
}

const MODEL_HOST = /openai\.com|anthropic\.com|generativelanguage\.googleapis|api\.groq\.com|api\.mistral\.ai|\/v1\/chat\/completions|\/v1\/messages/i;
const CATALOG_PATH = /reference-library|reference-corpus|agent-handoff\.full\.json|\/catalog\.json|mcp-catalog/i;
const FONT_URL = /fonts\.googleapis\.com|fonts\.gstatic\.com|fontsource|cdn\.jsdelivr\.net\/[^?\s]*font|\.woff2?(?:$|\?)/i;

export function classifyResource(url: string): ResourceKind {
  if (MODEL_HOST.test(url)) return 'model';
  if (CATALOG_PATH.test(url)) return url.includes('reference') ? 'reference' : 'catalog';
  if (FONT_URL.test(url)) return 'font';
  return 'other';
}

export function resourceGuardViolations(events: readonly ResourceEvent[], limits: { catalogFamilyCount: number; firstUseFamilies: readonly string[] }): string[] {
  const violations: string[] = [];
  const seenFirstUse = new Set<string>();
  for (const event of events) {
    const kind = classifyResource(event.url);
    if (kind === 'model') violations.push(`${event.phase} model call ${event.url}`);
    if (kind === 'catalog' || kind === 'reference') violations.push(`${event.phase} ${kind} fetch ${event.url}`);
    if (kind !== 'font') continue;
    if (event.phase === 'first-use') {
      if (seenFirstUse.has(event.url)) violations.push(`repeated first-use font download ${event.url}`);
      seenFirstUse.add(event.url);
    } else violations.push(`${event.phase} repeated font download ${event.url}`);
  }
  if (limits.firstUseFamilies.length >= limits.catalogFamilyCount) {
    violations.push(`first-use loaded ${limits.firstUseFamilies.length} font families; catalog has ${limits.catalogFamilyCount}`);
  }
  return violations;
}
