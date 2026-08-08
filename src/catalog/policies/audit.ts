import { antiPatterns, verificationGroups } from '../../data/agentHandoff';
import type {
  AuditApplicability,
  AuditAutomationLevel,
  AuditCheckDefinition,
  AuditEvidenceType,
  AuditSeverity,
  UxSurface,
} from '../types';

type Metadata = {
  severity: AuditSeverity;
  evidenceTypes: AuditEvidenceType[];
  automation: AuditAutomationLevel;
  applicability?: AuditApplicability;
  surfaceTags?: UxSurface[];
};

function verification(
  id: string,
  groupId: string,
  itemIndex: number,
  metadata: Metadata,
): AuditCheckDefinition {
  if (!verificationGroups.find((group) => group.id === groupId)?.items[itemIndex]) {
    throw new Error(`[audit] missing verification source ${groupId}:${itemIndex}`);
  }
  return {
    id,
    source: { kind: 'verification', groupId, itemIndex },
    severity: metadata.severity,
    evidenceTypes: metadata.evidenceTypes,
    automation: metadata.automation,
    applicability: metadata.applicability ?? 'always',
    surfaceTags: metadata.surfaceTags ?? ['global'],
  };
}

function antiPattern(
  id: string,
  antiPatternId: string,
  metadata: Metadata,
): AuditCheckDefinition {
  if (!antiPatterns.some((entry) => entry.id === antiPatternId)) {
    throw new Error(`[audit] missing anti-pattern source ${antiPatternId}`);
  }
  return {
    id,
    source: { kind: 'anti-pattern', antiPatternId },
    severity: metadata.severity,
    evidenceTypes: metadata.evidenceTypes,
    automation: metadata.automation,
    applicability: metadata.applicability ?? 'always',
    surfaceTags: metadata.surfaceTags ?? ['global'],
  };
}

// Stable, language-neutral audit metadata. Human-facing criterion/fix text remains sourced from
// verificationGroups and antiPatterns, so the website handoff and MCP cannot drift in wording.
export const auditChecks: AuditCheckDefinition[] = [
  verification('lint-passes', 'build', 0, { severity: 'blocker', evidenceTypes: ['command'], automation: 'automated' }),
  verification('typecheck-passes', 'build', 1, { severity: 'blocker', evidenceTypes: ['command'], automation: 'automated' }),
  verification('build-succeeds', 'build', 2, { severity: 'blocker', evidenceTypes: ['command'], automation: 'automated' }),
  verification('runtime-console-clean', 'build', 3, { severity: 'major', evidenceTypes: ['command', 'interaction'], automation: 'assisted' }),
  verification('hydration-clean', 'build', 4, { severity: 'major', evidenceTypes: ['command', 'interaction'], automation: 'assisted' }),

  verification('no-horizontal-scroll', 'layout', 0, { severity: 'major', evidenceTypes: ['dom', 'screenshot'], automation: 'assisted' }),
  verification('no-meaningful-text-clipping', 'layout', 1, { severity: 'major', evidenceTypes: ['dom', 'screenshot'], automation: 'assisted' }),
  verification('mobile-renders-cleanly', 'layout', 2, { severity: 'major', evidenceTypes: ['screenshot', 'interaction'], automation: 'assisted' }),
  verification('desktop-composition-holds', 'layout', 3, { severity: 'major', evidenceTypes: ['screenshot', 'manual'], automation: 'manual' }),
  verification('no-purpose-free-nested-surfaces', 'layout', 4, { severity: 'minor', evidenceTypes: ['screenshot', 'manual'], automation: 'manual' }),
  verification('borders-remain-legible', 'layout', 5, { severity: 'minor', evidenceTypes: ['computed-style', 'screenshot'], automation: 'assisted' }),
  verification('opening-demonstrates-product', 'layout', 6, {
    severity: 'major', evidenceTypes: ['screenshot', 'manual'], automation: 'manual',
    applicability: 'when-present', surfaceTags: ['landing-page'],
  }),

  verification('style-direction-is-visible', 'fidelity', 0, { severity: 'major', evidenceTypes: ['screenshot', 'manual'], automation: 'manual' }),
  verification('design-tokens-are-used', 'fidelity', 1, { severity: 'major', evidenceTypes: ['document', 'computed-style'], automation: 'assisted' }),
  verification('typography-hierarchy-is-legible', 'fidelity', 2, { severity: 'major', evidenceTypes: ['computed-style', 'screenshot'], automation: 'assisted' }),
  verification('body-text-meets-contrast', 'fidelity', 3, { severity: 'blocker', evidenceTypes: ['computed-style'], automation: 'automated' }),
  verification('decoration-carries-information', 'fidelity', 4, {
    severity: 'minor', evidenceTypes: ['screenshot', 'manual'], automation: 'manual', applicability: 'when-present',
  }),
  verification('headline-is-product-specific', 'fidelity', 5, {
    severity: 'major', evidenceTypes: ['document', 'screenshot', 'manual'], automation: 'manual',
    applicability: 'when-present', surfaceTags: ['landing-page', 'content'],
  }),

  verification('keyboard-focus-is-visible', 'behavior', 0, { severity: 'blocker', evidenceTypes: ['interaction', 'screenshot'], automation: 'assisted' }),
  verification('reduced-motion-is-honored', 'behavior', 1, { severity: 'major', evidenceTypes: ['interaction', 'computed-style'], automation: 'assisted' }),
  verification('form-errors-are-visible', 'behavior', 2, {
    severity: 'blocker', evidenceTypes: ['interaction', 'screenshot'], automation: 'assisted',
    applicability: 'when-present', surfaceTags: ['form', 'checkout', 'onboarding', 'settings'],
  }),
  verification('navigation-and-route-behavior-works', 'behavior', 3, {
    severity: 'major', evidenceTypes: ['interaction'], automation: 'assisted', applicability: 'when-present',
  }),
  verification('navigation-semantics-match-behavior', 'behavior', 4, {
    severity: 'major', evidenceTypes: ['interaction', 'dom', 'screenshot'], automation: 'assisted',
    applicability: 'when-present', surfaceTags: ['navigation', 'settings', 'content', 'data-table'],
  }),

  verification('design-principles-produce-decisions', 'principles', 0, {
    severity: 'major', evidenceTypes: ['document', 'screenshot'], automation: 'assisted', applicability: 'workflow-only',
  }),
  verification('ux-principles-keep-evidence-labels', 'principles', 1, {
    severity: 'major', evidenceTypes: ['document'], automation: 'assisted', applicability: 'workflow-only',
  }),
  verification('principle-checks-are-observed', 'principles', 2, {
    severity: 'major', evidenceTypes: ['document', 'screenshot', 'interaction'], automation: 'assisted', applicability: 'workflow-only',
  }),
  verification('principles-respect-safety-boundaries', 'principles', 3, {
    severity: 'blocker', evidenceTypes: ['interaction', 'screenshot', 'manual'], automation: 'manual',
  }),

  verification('design-doc-matches-output', 'docs', 0, {
    severity: 'major', evidenceTypes: ['document', 'screenshot'], automation: 'assisted', applicability: 'workflow-only',
  }),
  verification('assumptions-are-recorded', 'docs', 1, {
    severity: 'minor', evidenceTypes: ['document'], automation: 'assisted', applicability: 'workflow-only',
  }),
  verification('verification-summary-is-complete', 'docs', 2, {
    severity: 'major', evidenceTypes: ['document', 'command'], automation: 'assisted', applicability: 'workflow-only',
  }),

  antiPattern('avoid-generic-saas', 'generic-saas', {
    severity: 'major', evidenceTypes: ['screenshot', 'manual'], automation: 'manual', surfaceTags: ['landing-page'],
  }),
  antiPattern('avoid-formulaic-opening', 'formulaic-opening', {
    severity: 'major', evidenceTypes: ['screenshot', 'manual'], automation: 'manual',
    applicability: 'when-present', surfaceTags: ['landing-page'],
  }),
  antiPattern('avoid-ai-headline-cadence', 'ai-headline-cadence', {
    severity: 'major', evidenceTypes: ['document', 'screenshot', 'manual'], automation: 'manual',
    applicability: 'when-present', surfaceTags: ['landing-page', 'content'],
  }),
  antiPattern('avoid-fake-content', 'fake-content', { severity: 'major', evidenceTypes: ['document', 'manual'], automation: 'manual' }),
  antiPattern('avoid-proof-free-polish', 'proof-free-polish', {
    severity: 'major', evidenceTypes: ['document', 'screenshot', 'manual'], automation: 'manual',
    applicability: 'when-present', surfaceTags: ['landing-page', 'onboarding', 'content'],
  }),
  antiPattern('avoid-nested-cards', 'nested-cards', { severity: 'minor', evidenceTypes: ['screenshot', 'manual'], automation: 'manual' }),
  antiPattern('avoid-decorative-chips', 'decorative-chips', {
    severity: 'minor', evidenceTypes: ['screenshot', 'manual'], automation: 'manual', applicability: 'when-present',
  }),
  antiPattern('avoid-decorative-iconography', 'decorative-iconography', {
    severity: 'minor', evidenceTypes: ['screenshot', 'manual'], automation: 'manual',
    applicability: 'when-present', surfaceTags: ['global', 'navigation', 'settings', 'data-table', 'content'],
  }),
  antiPattern('avoid-principle-as-decoration', 'principle-as-decoration', {
    severity: 'major', evidenceTypes: ['document'], automation: 'assisted', applicability: 'workflow-only',
  }),
  antiPattern('avoid-unverified-completion', 'unverified-completion', {
    severity: 'major', evidenceTypes: ['document', 'command'], automation: 'assisted', applicability: 'workflow-only',
  }),
  antiPattern('avoid-wsb-as-product', 'wsb-as-product', { severity: 'blocker', evidenceTypes: ['document', 'manual'], automation: 'manual' }),
];
