import {
  exportVisualContract,
  getVisualContract,
  resolveVisualContract,
  serializeVisualJson,
  validateResolvedVisualContract,
} from './index';
import type { ResolvedVisualContract, VisualLocale, VisualResolutionOptions } from './types';
import { buildSelectedHandoff, type HandoffContext, type SelectedHandoff } from './handoff';

/** Preview-content locales. UI language is not an input and must not change the spec. */
export const selectedSpecLocales = ['en', 'ko', 'ja'] as const satisfies readonly VisualLocale[];

export interface ResolvedSpecProjection {
  spec: ResolvedVisualContract;
  contentHash: string;
  handoff: SelectedHandoff;
  exports: { json: string; css: string };
}

/**
 * The only resolver for a selected design.
 * Preview, export, and AI handoff call this with the same options.
 * They do not map palette order or substitute family defaults on their own.
 */
export function resolveSelectedSpec(styleId: string, options: VisualResolutionOptions = {}): ResolvedVisualContract {
  return validateResolvedVisualContract(resolveVisualContract(styleId, options));
}

export function exportResolvedSpec(spec: ResolvedVisualContract, format: 'css' | 'json'): string {
  const validated = validateResolvedVisualContract(spec);
  if (format === 'css') return exportVisualContract(validated, 'css-variables').rendered;
  const rendered = exportVisualContract(validated, 'json').rendered;
  const parsed = JSON.parse(rendered) as { contentHash?: string };
  if (parsed.contentHash !== validated.contentHash) throw new Error('Selected export hash does not match the resolved spec');
  return rendered;
}

/** Preview, copy/export, and the selected handoff are projections of one validated spec. */
export function projectResolvedSpec(spec: ResolvedVisualContract, context: HandoffContext = {}): ResolvedSpecProjection {
  const validated = validateResolvedVisualContract(spec);
  const handoff = buildSelectedHandoff(validated, context);
  if (handoff.design.contentHash !== validated.contentHash || handoff.identity.contentHash !== validated.contentHash) {
    throw new Error('Selected handoff design hash does not match the resolved spec');
  }
  return {
    spec: validated,
    contentHash: validated.contentHash,
    handoff,
    exports: {
      json: exportResolvedSpec(validated, 'json'),
      css: exportResolvedSpec(validated, 'css'),
    },
  };
}

/** Authored default mode and one content locale. Browser-local edits are never included. */
export function resolveStaticSelectedSpec(styleId: string, contentLocale: VisualLocale): ResolvedSpecProjection {
  const authored = getVisualContract(styleId);
  return projectResolvedSpec(resolveSelectedSpec(styleId, { mode: authored.defaultMode, contentLocale }));
}

/** Compact document written to /agent-handoff/{styleId}.{locale}.json. */
export function staticSelectedHandoffDocument(styleId: string, contentLocale: VisualLocale): string {
  return `${serializeVisualJson(resolveStaticSelectedSpec(styleId, contentLocale).handoff, 0)}\n`;
}
