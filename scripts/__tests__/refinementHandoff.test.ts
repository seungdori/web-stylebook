import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { proposeContrastRepairs, resolveVisualContract } from '../../src/visual';
import { assessContrast } from '../../src/visual/contrast';
import {
  buildSelectedHandoff,
  parseVerificationReport,
  refinementHandoffDocument,
  refinementStaticContract,
  selectedHandoffToPrompt,
  verificationReport,
  type ChangeAxis,
  type RefinementContext,
  type VerificationReportCheck,
} from '../../src/visual/handoff';
import { promptWorkflowCopy } from '../../src/pages/promptWorkflowCopy';
import { checkBudgets, selectedPayloadViolations, type ResourceBudget } from '../quality-measure.mts';

const budgets = (JSON.parse(readFileSync(new URL('../../docs/quality-budgets.json', import.meta.url), 'utf8')) as { budgets: ResourceBudget[] }).budgets;
const promptBudget = budgets.find((budget) => budget.metric === 'selectedPromptMaxBytes');
if (!promptBudget) throw new Error('selectedPromptMaxBytes budget is missing');

function context(axis: ChangeAxis, patch: Partial<RefinementContext> = {}): RefinementContext {
  const baseline = resolveVisualContract('brutalist-grid');
  return {
    allowedChanges: [axis],
    preserve: [],
    lockedPaths: [],
    targetRegions: [],
    baseline,
    baselineRevision: baseline.contentHash,
    sourceReference: 'Existing Vite/React settings page',
    evidenceKind: 'draft',
    requestedOutcome: `Improve ${axis} only`,
    ...patch,
  };
}

function refined(axis: ChangeAxis, patch: Partial<RefinementContext> = {}) {
  const refinement = context(axis, patch);
  const overrides = axis === 'colors' ? { colors: { text: '#101010' } } : axis === 'typography' ? { typography: { body: { lineHeight: 1.8 } } } : { density: 'compact' as const };
  const design = resolveVisualContract('brutalist-grid', { overrides });
  const handoff = buildSelectedHandoff(design, { taskMode: 'refine-existing', projectContext: { stack: 'Vite + React' }, refinement });
  return { design, handoff, prompt: selectedHandoffToPrompt(handoff), document: refinementHandoffDocument(handoff) };
}

function section(prompt: string, title: string): string {
  const start = prompt.indexOf(title);
  const headings = ['1. Baseline and evidence', '2. Requested outcome and allowed changes', '3. Preservation', '4. Resolved delta', '5. Implementation', '6. Verification'];
  const next = headings.map((heading) => prompt.indexOf(heading)).filter((index) => index > start).sort((left, right) => left - right)[0];
  return prompt.slice(start, next ?? prompt.length);
}

const greenfield = /current stable Next|narrow MVP|choose a new typography|Read every entry|shadcn|marketing section|marketing page|migrate to Next|add a new section/i;

describe('refinement handoff wording', () => {
  it('keeps a typography-only prompt on typography', () => {
    const { prompt, handoff } = refined('typography');
    expect(handoff.refinement?.operations.map((operation) => operation.path)).toEqual(['typography.roles.body.lineHeight']);
    expect(section(prompt, '4. Resolved delta')).toContain('typography.roles.body.lineHeight');
    expect(section(prompt, '4. Resolved delta')).not.toMatch(/colors\.|spacing\.|components\./);
    expect(section(prompt, '5. Implementation')).toContain('Change only typography.');
    expect(section(prompt, '5. Implementation')).toContain('Do not change colors, spacing and density, layout, hierarchy, and composition, content, or business logic.');
    expect(prompt).toContain('Preserve the existing stack exactly: Vite + React');
    expect(prompt).toContain('Do not migrate the framework.');
    expect(prompt).toContain('Do not create design.md, choose a default stack, add sections, or cut scope to an MVP.');
    expect(prompt).not.toMatch(greenfield);
    expect(handoff.verification.map((check) => check.id)).toEqual(['preservation', 'responsive', 'typography']);
    expect(section(prompt, '6. Verification')).not.toContain('- contrast:');
    expect(section(prompt, '6. Verification')).not.toContain('- density:');
    expect(section(prompt, '6. Verification')).not.toContain('- composition:');
  });

  it('keeps a color-only prompt on color roles', () => {
    const { prompt, handoff } = refined('colors');
    expect(handoff.refinement?.operations.every((operation) => operation.path.startsWith('colors.'))).toBe(true);
    expect(section(prompt, '4. Resolved delta')).toContain('colors.text');
    expect(section(prompt, '4. Resolved delta')).toContain('#101010');
    expect(section(prompt, '4. Resolved delta')).not.toMatch(/typography\.|spacing\.|components\./);
    expect(section(prompt, '5. Implementation')).toContain('Change only colors.');
    expect(section(prompt, '5. Implementation')).toContain('Do not change typography, spacing and density, layout, hierarchy, and composition, content, or business logic.');
    expect(prompt).not.toMatch(greenfield);
    expect(handoff.verification.map((check) => check.id)).toEqual(['preservation', 'responsive', 'contrast']);
  });

  it('keeps a density-only prompt on spacing', () => {
    const { prompt, handoff } = refined('density');
    expect(handoff.refinement?.operations.length).toBeGreaterThan(0);
    expect(handoff.refinement?.operations.every((operation) => operation.path.startsWith('spacing.'))).toBe(true);
    expect(section(prompt, '4. Resolved delta')).toContain('spacing.density');
    expect(section(prompt, '4. Resolved delta')).not.toMatch(/colors\.|typography\.|components\./);
    expect(section(prompt, '5. Implementation')).toContain('Change only density.');
    expect(section(prompt, '5. Implementation')).toContain('Do not change colors, typography, layout, hierarchy, and composition, content, or business logic.');
    expect(prompt).not.toMatch(greenfield);
    expect(handoff.verification.map((check) => check.id)).toEqual(['preservation', 'responsive', 'density']);
  });

  it('uses the same greenfield exclusion in the static discovery contract and the copied prompt', () => {
    const { prompt } = refined('typography');
    const contract = refinementStaticContract();
    expect(contract).toContain('Do not create design.md, choose a default stack, add sections, or cut scope to an MVP.');
    expect(prompt).toContain('Do not create design.md, choose a default stack, add sections, or cut scope to an MVP.');
    expect(contract).toContain('Screenshot-only context is limited confidence');
    expect(prompt.match(/^\d\. /gm)?.length).toBe(6);
  });
});

describe('locked contrast and screenshot evidence', () => {
  it('surfaces a locked low-contrast role and does not repair that role or another locked role', () => {
    const baseline = resolveVisualContract('brutalist-grid');
    const changed = resolveVisualContract('brutalist-grid', { overrides: { colors: { text: '#dddddd' } } });
    expect(assessContrast(changed).some((check) => check.status === 'fail' && check.foreground === 'text')).toBe(true);
    const handoff = buildSelectedHandoff(changed, {
      taskMode: 'refine-existing',
      refinement: context('colors', { baseline, baselineRevision: baseline.contentHash, lockedPaths: ['colors.text', 'colors.canvas'] }),
    });
    expect(handoff.design.colors.text).toBe('#dddddd');
    expect(handoff.design.colors.canvas).toBe(baseline.colors.canvas);
    expect(handoff.refinement?.operations.map((operation) => operation.path)).toEqual(['colors.text']);
    expect(handoff.refinement?.conflicts.some((conflict) => conflict.includes('insufficient contrast') && conflict.includes('locked'))).toBe(true);
    expect(handoff.refinement?.conflicts.some((conflict) => conflict.includes('colors.text is locked'))).toBe(true);
    expect(() => selectedHandoffToPrompt(handoff)).toThrow('Resolve');

    const proposal = proposeContrastRepairs(changed).find((repair) => repair.role === 'text');
    expect(proposal).toBeDefined();
    const repaired = resolveVisualContract('brutalist-grid', { overrides: { colors: { text: '#dddddd' } }, acceptedRepairs: [proposal!] });
    const repairedHandoff = buildSelectedHandoff(repaired, {
      taskMode: 'refine-existing',
      refinement: context('colors', { baseline, baselineRevision: baseline.contentHash, lockedPaths: ['colors.text', 'colors.canvas'] }),
    });
    expect(repairedHandoff.design.colors).toEqual(repaired.colors);
    expect(repairedHandoff.design.colors.canvas).toBe(baseline.colors.canvas);
    expect(repairedHandoff.refinement?.operations.some((operation) => operation.path === 'colors.text' || operation.path === 'colors.canvas')).toBe(false);
    expect(repairedHandoff.refinement?.conflicts.some((conflict) => conflict.includes('contrast repair') && conflict.includes('locked'))).toBe(true);
    expect(() => selectedHandoffToPrompt(repairedHandoff)).toThrow('Resolve');
  });

  it('labels screenshot-only context as limited confidence without computed values or verified selectors', () => {
    const design = resolveVisualContract('editorial-silence');
    const handoff = buildSelectedHandoff(design, {
      taskMode: 'refine-existing',
      refinement: {
        allowedChanges: ['typography'],
        preserve: [],
        lockedPaths: [],
        targetRegions: ['.heading'],
        sourceReference: 'A screenshot of the settings page',
        evidenceKind: 'screenshot-only',
        requestedOutcome: 'Improve the heading hierarchy',
      },
    });
    const prompt = selectedHandoffToPrompt(handoff);
    expect(handoff.refinement?.confidence).toBe('limited');
    expect(handoff.refinement?.baselineRevision).toBeNull();
    expect(handoff.refinement?.operations).toEqual([]);
    expect(handoff.refinement?.targetRegions).toEqual([{ reference: '.heading', verified: false }]);
    expect(prompt).toContain('Evidence completeness: screenshot-only');
    expect(prompt).toContain('Confidence: limited');
    expect(prompt).toContain('Screenshot-only context does not establish computed tokens');
    expect(prompt).toContain('No computed values are included.');
    expect(prompt).toContain('Target regions (unverified): .heading.');
    expect(prompt).not.toMatch(/verified: true|"verified":true/);
    const described = buildSelectedHandoff(design, {
      taskMode: 'refine-existing',
      explicitOverrides: { typography: { body: { lineHeight: 1.9 } } },
      refinement: {
        allowedChanges: ['typography'],
        preserve: [],
        lockedPaths: [],
        targetRegions: [],
        baseline: design,
        baselineRevision: design.contentHash,
        sourceReference: 'A written description of the settings page',
        evidenceKind: 'description',
        requestedOutcome: 'Improve the heading hierarchy',
      },
    });
    const describedPrompt = selectedHandoffToPrompt(described);
    expect(described.refinement?.confidence).toBe('limited');
    expect(described.refinement?.operations).toEqual([]);
    expect(describedPrompt).toContain('Evidence completeness: description');
    expect(describedPrompt).toContain('No computed values are included.');
    expect(describedPrompt).not.toContain('1.9');
    for (const color of Object.values(design.colors)) expect(prompt).not.toContain(color);
    for (const role of Object.values(design.typography.roles)) {
      expect(prompt).not.toContain(`"lineHeight":${role.lineHeight}`);
      expect(prompt).not.toContain(`${role.lineHeight}`);
    }
  });
});

describe('verification report gating', () => {
  it('never promotes not-run, failed commands, or missing browser evidence to pass', () => {
    const notRun: VerificationReportCheck = { id: 'browser', outcome: 'not-run', scope: 'page', notes: 'Browser unavailable' };
    const failed: VerificationReportCheck = { id: 'build', outcome: 'fail', scope: 'project', commandOrInspection: 'npm run build', evidence: 'exit 1' };
    const skipped: VerificationReportCheck = { id: 'motion', outcome: 'not-applicable', scope: 'motion', reason: 'The page has no motion.' };
    const passed: VerificationReportCheck = { id: 'keyboard', outcome: 'pass', scope: 'settings', commandOrInspection: 'Keyboard inspection', evidence: 'captures/settings.png' };
    expect(verificationReport([notRun]).overall).toBe('incomplete');
    expect(verificationReport([failed]).overall).toBe('incomplete');
    expect(verificationReport([passed, notRun]).overall).toBe('incomplete');
    expect(verificationReport([passed, failed]).overall).toBe('incomplete');
    expect(verificationReport([passed, skipped]).overall).toBe('pass');
    expect(verificationReport([]).overall).toBe('incomplete');
    expect(parseVerificationReport({ checks: [{ id: 'browser', outcome: 'not-run', scope: 'page', notes: 'Browser unavailable' }] }).ok && (parseVerificationReport({ checks: [{ id: 'browser', outcome: 'not-run', scope: 'page', notes: 'Browser unavailable' }] }) as { report: { overall: string } }).report.overall).toBe('incomplete');
    expect(parseVerificationReport({ checks: [{ id: 'claim', outcome: 'pass', scope: 'all', notes: 'Everything looks good' }] })).toMatchObject({ ok: false, overall: 'incomplete' });
    expect(parseVerificationReport({ checks: [{ id: 'skip', outcome: 'not-applicable', scope: 'all' }] })).toMatchObject({ ok: false, overall: 'incomplete' });
    expect(parseVerificationReport({ checks: [failed] })).toMatchObject({ ok: true, report: { overall: 'incomplete' } });
  });
});

describe('refinement payload budget', () => {
  it('fits a small typography refinement under the selected prompt budget', () => {
    const { prompt, document } = refined('typography');
    const bytes = Buffer.byteLength(prompt);
    const [check] = checkBudgets({ selectedPromptMaxBytes: bytes }, [promptBudget!]);
    expect(check?.status).toBe('pass');
    expect(bytes).toBeLessThanOrEqual(promptBudget!.max);
    expect(selectedPayloadViolations(document)).toEqual([]);
    expect(document).not.toHaveProperty('design');
    expect(document).not.toHaveProperty('styles');
    const full = selectedHandoffToPrompt(buildSelectedHandoff(resolveVisualContract('brutalist-grid')));
    expect(bytes).toBeLessThan(Buffer.byteLength(full));
  });
});

describe('accepted refinement changes', () => {
  it('copies accepted changes and leaves rejected ones out of the handoff', () => {
    const baseline = resolveVisualContract('brutalist-grid');
    const design = resolveVisualContract('brutalist-grid', { overrides: { typography: { body: { lineHeight: 1.8 } }, colors: { text: '#101010' } } });
    const handoff = buildSelectedHandoff(design, {
      taskMode: 'refine-existing',
      projectContext: { stack: 'Vite + React' },
      refinement: context('typography', {
        allowedChanges: ['typography', 'colors'],
        baseline,
        baselineRevision: baseline.contentHash,
        changeDecisions: [
          { path: 'typography.roles.body.lineHeight', status: 'accepted' },
          { path: 'colors.text', status: 'rejected' },
        ],
      }),
    });
    const prompt = selectedHandoffToPrompt(handoff);
    const document = refinementHandoffDocument(handoff);
    expect(design.colors.text).toBe('#101010');
    expect(handoff.refinement?.operations.map((operation) => operation.path)).toEqual(['typography.roles.body.lineHeight']);
    expect(section(prompt, '4. Resolved delta')).toContain('typography.roles.body.lineHeight');
    expect(section(prompt, '4. Resolved delta')).toContain('1.8');
    expect(section(prompt, '4. Resolved delta')).not.toContain('#101010');
    expect(section(prompt, '4. Resolved delta')).not.toContain('colors.text');
    expect(section(prompt, '5. Implementation')).toContain('Change only typography, colors.');
    expect(prompt).not.toMatch(greenfield);
    expect(document.delta.operations).toEqual(handoff.refinement?.operations);
    expect(handoff.design.colors.text).toBe('#101010');
  });

  it('does not publish a locked path when a decision says it was accepted', () => {
    const baseline = resolveVisualContract('brutalist-grid');
    const changed = resolveVisualContract('brutalist-grid', { overrides: { colors: { text: '#101010' }, typography: { body: { lineHeight: 1.8 } } } });
    const handoff = buildSelectedHandoff(changed, {
      taskMode: 'refine-existing',
      refinement: context('colors', {
        allowedChanges: ['colors', 'typography'],
        baseline,
        baselineRevision: baseline.contentHash,
        lockedPaths: ['colors.text'],
        changeDecisions: [
          { path: 'colors.text', status: 'accepted' },
          { path: 'typography.roles.body.lineHeight', status: 'accepted' },
        ],
      }),
    });
    expect(handoff.design.colors.text).toBe('#101010');
    expect(handoff.refinement?.operations.map((operation) => operation.path)).toEqual(['typography.roles.body.lineHeight']);
    expect(handoff.refinement?.conflicts.some((conflict) => conflict.includes('colors.text is locked'))).toBe(true);
    expect(() => selectedHandoffToPrompt(handoff)).toThrow('Resolve');
  });
});

describe('prompt workflow copy', () => {
  it('uses the same labels in English, Korean, and Japanese', () => {
    expect(Object.keys(promptWorkflowCopy.ko).sort()).toEqual(Object.keys(promptWorkflowCopy.en).sort());
    expect(Object.keys(promptWorkflowCopy.ja).sort()).toEqual(Object.keys(promptWorkflowCopy.en).sort());
    for (const lang of ['en', 'ko', 'ja'] as const) {
      for (const value of Object.values(promptWorkflowCopy[lang])) expect(value.trim().length).toBeGreaterThan(0);
    }
  });
});
