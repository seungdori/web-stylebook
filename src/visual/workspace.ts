import { z } from 'zod';
import { getStyleById, styleCatalog } from '../data/styles';
import { diffContractLeaves, EVIDENCE_KINDS, lockCovers, type EvidenceKind } from './handoff';
import { getVisualContract, parseResolvedVisualContract, zVisualOverrides, zResolvedVisualContract } from './index';
import { resolveSelectedSpec } from './resolvedSpec';
import { COLOR_ROLES } from './types';
import type { TypographyRole, VisualColors, VisualOverrides, VisualRepair } from './index';
import { getAxisOverrides } from './comparison';
import { applyResolvedLeaf } from './refinementChanges';

export const DESIGN_DRAFT_STORAGE_KEY = 'webstylebook.design-draft';
export const DESIGN_DRAFT_RECOVERY_KEY = `${DESIGN_DRAFT_STORAGE_KEY}.recovery`;
export const MAX_DRAFT_BYTES = 96_000;
const MAX_UNDO = 20;
const text = z.string().max(6_000);
const styleId = z.string().refine((id) => !!getStyleById(id), 'Unknown style');
const locale = z.enum(['en', 'ko', 'ja']);
const axis = z.enum(['color', 'typography', 'density']);
const mode = z.enum(['light', 'dark']);
const baseline = zResolvedVisualContract;

export const zDesignDraft = z.object({
  schemaVersion: z.literal(1),
  revision: z.number().int().nonnegative(),
  contractRevision: z.string().max(128),
  styleId,
  mode,
  contentLocale: locale,
  fixtureId: z.enum(['product', 'operations', 'editorial']),
  overrides: zVisualOverrides,
  axisSources: z.object({ color: styleId.optional(), typography: styleId.optional(), density: styleId.optional() }).strict(),
  referencedStyleIds: z.array(styleId).max(styleCatalog.length).default([]),
  acceptedRepairs: z.array(z.object({ id: z.string().max(200), role: z.enum(COLOR_ROLES), before: z.string().max(64), after: z.string().max(64), pairId: z.string().max(200), reason: z.string().max(1000) }).strict()).max(32),
  previewCopy: z.object({ heading: text, body: text, label: text, caption: text }).strict(),
  comparison: z.object({
    left: styleId, right: styleId,
    mode: z.enum(['original', 'complete', 'axis']), axis,
    layout: z.enum(['horizontal', 'vertical']),
  }).strict(),
  discovery: z.object({
    query: z.string().max(200), tag: z.string().max(80),
    sort: z.enum(['popular', 'latest', 'name']), direction: z.enum(['asc', 'desc']),
    purpose: z.enum(['all', 'operational-saas', 'content-editorial', 'campaign', 'commerce']),
  }).strict(),
  taskMode: z.enum(['new-design', 'refine-existing']),
  projectContext: z.object({
    name: text, purpose: text, surface: text, screens: z.array(z.string().max(500)).max(40), stack: text,
    audience: text.optional(), constraints: text.optional(),
    sectionInstructions: z.partialRecord(z.enum(['purpose', 'styleTone', 'stack', 'designSystem', 'components', 'assembly', 'qa']), z.object({ mode: z.enum(['manual', 'ai']), notes: text }).strict()).optional(),
  }).strict(),
  refinement: z.object({
    allowedChanges: z.array(z.enum(['colors', 'typography', 'density', 'composition'])).max(4),
    preserve: z.array(z.string().max(500)).max(30),
    lockedPaths: z.array(z.string().max(200)).max(64), targetRegions: z.array(z.string().max(200)).max(30),
    baselineRevision: z.string().max(128).optional(), acceptedRevision: z.string().max(128).optional(), baseline: baseline.optional(),
    baselineAxisSources: z.object({ color: styleId.optional(), typography: styleId.optional(), density: styleId.optional() }).strict().optional(),
    sourceReference: text, evidenceKind: z.enum(EVIDENCE_KINDS), requestedOutcome: text,
    changeDecisions: z.array(z.object({ path: z.string().max(200), status: z.enum(['accepted', 'rejected']), proposedJson: z.string().max(4000).optional() }).strict()).max(128).default([]),
    screenshot: z.object({ id: z.string().max(80), name: z.string().max(200), mime: z.enum(['image/png', 'image/jpeg', 'image/webp', 'image/gif']), byteLength: z.number().int().positive().max(1_200_000) }).strict().optional(),
  }).strict(),
}).strict();

export type DesignDraft = z.infer<typeof zDesignDraft>;
export function draftResolutionOptions(draft: DesignDraft) {
  return { mode: draft.mode, contentLocale: draft.contentLocale, overrides: draft.overrides, acceptedRepairs: draft.acceptedRepairs };
}
export type DesignAxis = 'color' | 'colors' | 'typography' | 'density';
export type WorkspaceStatus = 'saved' | 'saving' | 'memory-only' | 'recovery-needed' | 'conflict';
export interface WorkspaceSnapshot {
  draft: DesignDraft;
  status: WorkspaceStatus;
  recoveryReason?: 'malformed' | 'unsupported-version' | 'stale-contract' | 'invalid-selection' | 'invalid-comparison';
  pendingStyleId?: string;
  canUndo: boolean;
  modified: boolean;
  resetEpoch: number;
}
export interface DraftStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function parseComparisonQuery(search: string): { ok: true; comparison: Partial<DesignDraft['comparison']>; fixtureId?: DesignDraft['fixtureId'] } | { ok: false } {
  const params = new URLSearchParams(search);
  const values = Object.fromEntries(['left', 'right', 'mode', 'axis', 'layout'].filter((key) => params.has(key)).map((key) => [key, params.get(key)]));
  if ((params.has('left') || params.has('right')) && !params.has('mode')) values.mode = 'original';
  const comparison = zDesignDraft.shape.comparison.partial().safeParse(values);
  const fixture = params.has('fixture') ? zDesignDraft.shape.fixtureId.safeParse(params.get('fixture')) : null;
  if (!comparison.success || (fixture && !fixture.success)) return { ok: false };
  return { ok: true, comparison: comparison.data, ...(fixture?.success ? { fixtureId: fixture.data } : {}) };
}

export function createInitialDraft(selectedId = 'brutalist-grid'): DesignDraft {
  const contract = getVisualContract(selectedId);
  return {
    schemaVersion: 1, revision: 0, contractRevision: contract.revision,
    styleId: selectedId, mode: contract.defaultMode, contentLocale: 'en', fixtureId: 'product',
    overrides: {}, axisSources: {}, referencedStyleIds: [], acceptedRepairs: [],
    previewCopy: { heading: '', body: '', label: '', caption: '' },
    comparison: { left: selectedId, right: 'editorial-silence', mode: 'complete', axis: 'color', layout: 'horizontal' },
    discovery: { query: '', tag: 'all', sort: 'popular', direction: 'desc', purpose: 'all' },
    taskMode: 'new-design', projectContext: { name: '', purpose: '', surface: '', screens: [], stack: '' },
    refinement: { allowedChanges: ['typography'], preserve: ['content', 'business behavior', 'routes and data contracts', 'existing stack', 'component structure'], lockedPaths: [], targetRegions: [], sourceReference: '', evidenceKind: 'description', requestedOutcome: '', changeDecisions: [] },
  };
}

type ReadResult = { ok: true; draft: DesignDraft; migrated: boolean } | { ok: false; reason: NonNullable<WorkspaceSnapshot['recoveryReason']> };

const legacyEvidenceKind: Record<string, EvidenceKind> = { screenshot: 'screenshot-only', source: 'structured-snapshot', rendered: 'draft' };

function migrateRefinementEvidence(candidate: unknown): unknown {
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return candidate;
  const draft = candidate as Record<string, unknown>;
  const refinement = draft.refinement;
  if (!refinement || typeof refinement !== 'object' || Array.isArray(refinement)) return candidate;
  const record = refinement as Record<string, unknown>;
  const kind = record.evidenceKind;
  if (typeof kind !== 'string' || !(kind in legacyEvidenceKind)) return candidate;
  return { ...draft, refinement: { ...record, evidenceKind: legacyEvidenceKind[kind] } };
}

/** v0 was the pre-release {schemaVersion:0, selectedStyleId, overrides, contentLocale} draft. */
export function parseDesignDraft(raw: string): ReadResult {
  if (raw.length > MAX_DRAFT_BYTES) return { ok: false, reason: 'malformed' };
  try {
    const input: unknown = JSON.parse(raw);
    if (!input || typeof input !== 'object' || Array.isArray(input)) return { ok: false, reason: 'malformed' };
    const version = (input as Record<string, unknown>).schemaVersion;
    let candidate: unknown = input;
    if (version === 0) {
      const legacy = z.object({ schemaVersion: z.literal(0), selectedStyleId: styleId, overrides: zVisualOverrides.optional(), contentLocale: locale.optional() }).strict().safeParse(input);
      if (!legacy.success) return { ok: false, reason: 'malformed' };
      candidate = { ...createInitialDraft(legacy.data.selectedStyleId), overrides: legacy.data.overrides ?? {}, contentLocale: legacy.data.contentLocale ?? 'en' };
    } else if (version !== 1) return { ok: false, reason: 'unsupported-version' };
    const parsed = zDesignDraft.safeParse(migrateRefinementEvidence(candidate));
    if (!parsed.success) return { ok: false, reason: 'malformed' };
    const contract = getVisualContract(parsed.data.styleId);
    if (parsed.data.contractRevision !== contract.revision) return { ok: false, reason: 'stale-contract' };
    resolveSelectedSpec(parsed.data.styleId, draftResolutionOptions(parsed.data));
    if (parsed.data.refinement.baseline) {
      const baseline = parseResolvedVisualContract(parsed.data.refinement.baseline);
      if (baseline.revision !== getVisualContract(baseline.styleId).revision) return { ok: false, reason: 'stale-contract' };
    }
    return { ok: true, draft: parsed.data, migrated: version === 0 };
  } catch {
    return { ok: false, reason: 'malformed' };
  }
}

export function isDraftModified(draft: DesignDraft): boolean {
  return Object.keys(draft.overrides).length > 0 || Object.keys(draft.axisSources).length > 0
    || draft.acceptedRepairs.length > 0 || Object.values(draft.previewCopy).some(Boolean)
    || Object.values(draft.projectContext).some((value) => Array.isArray(value) ? value.length > 0 : !!value)
    || draft.taskMode === 'refine-existing';
}

export function createDesignWorkspace(storage: DraftStorage | null, options: { deferWrites?: boolean; initialContentLocale?: DesignDraft['contentLocale'] } = {}) {
  let draft = { ...createInitialDraft(), contentLocale: options.initialContentLocale ?? 'en' };
  let rawAtRead: string | null = null;
  let recoveryRaw: string | null = null;
  let remoteRaw: string | null = null;
  let status: WorkspaceStatus = storage ? 'saved' : 'memory-only';
  let recoveryReason: WorkspaceSnapshot['recoveryReason'];
  let pendingStyleId: string | undefined;
  let pendingReferenceIds: string[] | undefined;
  let resetEpoch = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const history: DesignDraft[] = [];
  const listeners = new Set<() => void>();
  try {
    rawAtRead = storage?.getItem(DESIGN_DRAFT_STORAGE_KEY) ?? null;
    if (rawAtRead) {
      const result = parseDesignDraft(rawAtRead);
      if (result.ok) draft = result.draft;
      else { status = 'recovery-needed'; recoveryRaw = rawAtRead; recoveryReason = result.reason; }
    }
  } catch { status = 'memory-only'; }
  let snapshot: WorkspaceSnapshot = { draft, status, recoveryReason, canUndo: false, modified: isDraftModified(draft), resetEpoch };
  function notify() {
    snapshot = { draft, status, recoveryReason, pendingStyleId, canUndo: history.length > 0, modified: isDraftModified(draft), resetEpoch };
    listeners.forEach((listener) => listener());
  }
  function flush(force = false) {
    clearTimeout(timer);
    if (!storage || (!force && (status === 'recovery-needed' || status === 'conflict'))) return false;
    try {
      const current = storage.getItem(DESIGN_DRAFT_STORAGE_KEY);
      if (!force && current !== rawAtRead) { remoteRaw = current; status = 'conflict'; notify(); return false; }
      const serialized = JSON.stringify(zDesignDraft.parse(draft));
      if (serialized.length > MAX_DRAFT_BYTES) throw new Error('Draft too large');
      storage.setItem(DESIGN_DRAFT_STORAGE_KEY, serialized);
      rawAtRead = serialized; status = 'saved'; recoveryReason = undefined; notify(); return true;
    } catch { status = 'memory-only'; notify(); return false; }
  }
  function schedule() {
    if (status === 'recovery-needed' || status === 'conflict') return;
    if (!storage) { status = 'memory-only'; return; }
    if (options.deferWrites) {
      status = 'saving'; clearTimeout(timer); timer = setTimeout(() => flush(), 150);
    } else flush();
  }
  function commit(update: (current: DesignDraft) => DesignDraft, remember = true, resetInputs = false) {
    const next = zDesignDraft.parse(update(draft));
    resolveSelectedSpec(next.styleId, draftResolutionOptions(next));
    if (resetInputs) resetEpoch += 1;
    if (JSON.stringify({ ...next, revision: 0 }) === JSON.stringify({ ...draft, revision: 0 })) { if (resetInputs) notify(); return; }
    if (remember) { history.push(draft); if (history.length > MAX_UNDO) history.shift(); }
    draft = { ...next, revision: draft.revision + 1 };
    schedule(); notify();
  }
  function selectStyle(id: string, references?: string[]) {
    const contract = getVisualContract(id);
    pendingStyleId = undefined;
    const referencedStyleIds = references ?? [];
    pendingReferenceIds = undefined;
    commit((current) => ({ ...current, styleId: id, contractRevision: contract.revision, mode: contract.defaultMode, overrides: {}, axisSources: {}, referencedStyleIds, acceptedRepairs: [],
      comparison: referencedStyleIds.length > 1 ? { ...current.comparison, left: referencedStyleIds[0], right: referencedStyleIds[1] } : current.comparison,
      refinement: { ...current.refinement, changeDecisions: [], acceptedRevision: undefined },
    }), true, true);
    notify();
  }
  function setOverrides(overrides: VisualOverrides) {
    commit((current) => {
      const next = { ...current, overrides: {
      ...current.overrides, ...overrides,
      ...(overrides.colors ? { colors: { ...current.overrides.colors, ...overrides.colors } } : {}),
      ...(overrides.spacing ? { spacing: { ...current.overrides.spacing, ...overrides.spacing } } : {}),
      ...(overrides.typography ? { typography: { ...current.overrides.typography, ...Object.fromEntries(Object.entries(overrides.typography).map(([key, value]) => [key, { ...current.overrides.typography?.[key as keyof NonNullable<VisualOverrides['typography']>], ...value }])) } } : {}),
      } };
      if (overrides.colors) {
        // A repair depends on its adjacent color pair. Retain independent repairs,
        // and let the editor offer new proposals for any pair changed by this edit.
        const valid: VisualRepair[] = [];
        for (const repair of next.acceptedRepairs) {
          try { resolveSelectedSpec(next.styleId, { ...draftResolutionOptions(next), acceptedRepairs: [...valid, repair] }); valid.push(repair); } catch { /* Stale proposals are re-evaluated by the color editor. */ }
        }
        next.acceptedRepairs = valid;
      }
      return next;
    });
  }
  return {
    getSnapshot: () => snapshot,
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    flush,
    selectStyle,
    requestStyleSelection: (id: string) => {
      if (!getStyleById(id)) { recoveryReason = 'invalid-selection'; notify(); return false; }
      if (id === draft.styleId) return true;
      if (isDraftModified(draft)) { pendingStyleId = id; pendingReferenceIds = undefined; notify(); return false; }
      selectStyle(id); return true;
    },
    requestStylePreset: (raw: string) => {
      const ids = [...new Set(raw.split(',').map((value) => value.trim()).filter(Boolean))];
      if (!ids.length || ids.length > styleCatalog.length || ids.some((id) => !getStyleById(id))) { recoveryReason = 'invalid-selection'; notify(); return false; }
      if (ids[0] === draft.styleId) {
        if (ids.length > 1) commit((current) => ({ ...current, referencedStyleIds: ids, comparison: { ...current.comparison, left: ids[0], right: ids[1] } }));
        return true;
      }
      if (isDraftModified(draft)) { pendingStyleId = ids[0]; pendingReferenceIds = ids; notify(); return false; }
      selectStyle(ids[0], ids.length > 1 ? ids : []); return true;
    },
    requestComparisonSelection: (search: string) => {
      const incoming = parseComparisonQuery(search);
      if (!incoming.ok) { recoveryReason = 'invalid-comparison'; notify(); return false; }
      if (recoveryReason === 'invalid-comparison') recoveryReason = undefined;
      commit((current) => ({ ...current, comparison: { ...current.comparison, ...incoming.comparison }, fixtureId: incoming.fixtureId ?? current.fixtureId }), false);
      notify(); return true;
    },
    dismissStyleSelection: () => { pendingStyleId = undefined; pendingReferenceIds = undefined; recoveryReason = undefined; notify(); },
    confirmStyleSelection: () => { if (pendingStyleId) selectStyle(pendingStyleId, pendingReferenceIds); },
    setOverrides,
    replaceOverrides: (overrides: VisualOverrides) => commit((current) => ({ ...current, overrides, acceptedRepairs: [] })),
    setColorRole: (role: keyof VisualColors, value: string) => setOverrides({ colors: { [role]: value } }),
    setTypographyRole: (role: keyof NonNullable<VisualOverrides['typography']>, value: Partial<TypographyRole>) => setOverrides({ typography: { [role]: value } }),
    setMode: (value: DesignDraft['mode']) => commit((current) => ({ ...current, mode: value, acceptedRepairs: [] }), true, true),
    setContentLocale: (value: DesignDraft['contentLocale']) => commit((current) => ({ ...current, contentLocale: value }), true, true),
    setFixtureId: (value: DesignDraft['fixtureId']) => commit((current) => ({ ...current, fixtureId: value })),
    setPreviewCopy: (value: Partial<DesignDraft['previewCopy']>) => commit((current) => ({ ...current, previewCopy: { ...current.previewCopy, ...value } })),
    setComparison: (value: Partial<DesignDraft['comparison']>) => commit((current) => ({ ...current, comparison: { ...current.comparison, ...value } }), false),
    setDiscovery: (value: Partial<DesignDraft['discovery']>) => commit((current) => ({ ...current, discovery: { ...current.discovery, ...value } }), false),
    setProjectContext: (value: Partial<DesignDraft['projectContext']>) => commit((current) => ({ ...current, projectContext: { ...current.projectContext, ...value } })),
    setTaskMode: (value: DesignDraft['taskMode']) => commit((current) => ({ ...current, taskMode: value })),
    setRefinement: (value: Partial<DesignDraft['refinement']>) => commit((current) => ({ ...current, refinement: { ...current.refinement, ...value } })),
    acceptRefinementChange: (path: string) => {
      const baseline = draft.refinement.baseline;
      if (!baseline || lockCovers(draft.refinement.lockedPaths, path)) return false;
      const resolved = resolveSelectedSpec(draft.styleId, draftResolutionOptions(draft));
      const change = diffContractLeaves(baseline, resolved).find((item) => item.path === path);
      if (!change || !draft.refinement.allowedChanges.includes(change.axis)) return false;
      commit((current) => ({
        ...current,
        refinement: {
          ...current.refinement,
          acceptedRevision: undefined,
          changeDecisions: [...current.refinement.changeDecisions.filter((item) => item.path !== path), { path, status: 'accepted' as const }],
        },
      }));
      return true;
    },
    rejectRefinementChange: (path: string) => {
      const baseline = draft.refinement.baseline;
      if (!baseline) return false;
      const resolved = resolveSelectedSpec(draft.styleId, draftResolutionOptions(draft));
      const change = diffContractLeaves(baseline, resolved).find((item) => item.path === path);
      if (!change) return false;
      const proposedJson = JSON.stringify(change.newValue);
      if (proposedJson.length > 4000) return false;
      const reverted = applyResolvedLeaf(
        { overrides: draft.overrides, acceptedRepairs: draft.acceptedRepairs },
        path,
        change.oldValue,
        resolved.spacing,
      );
      commit((current) => ({
        ...current,
        ...(reverted ? { overrides: reverted.overrides, acceptedRepairs: reverted.acceptedRepairs } : {}),
        refinement: {
          ...current.refinement,
          acceptedRevision: undefined,
          changeDecisions: [...current.refinement.changeDecisions.filter((item) => item.path !== path), { path, status: 'rejected' as const, proposedJson }],
        },
      }));
      return true;
    },
    undoRefinementChange: (path: string) => {
      const decision = draft.refinement.changeDecisions.find((item) => item.path === path);
      if (!decision) return false;
      let restored: ReturnType<typeof applyResolvedLeaf> = null;
      if (decision.status === 'rejected' && decision.proposedJson) {
        const resolved = resolveSelectedSpec(draft.styleId, draftResolutionOptions(draft));
        restored = applyResolvedLeaf(
          { overrides: draft.overrides, acceptedRepairs: draft.acceptedRepairs },
          path,
          JSON.parse(decision.proposedJson),
          resolved.spacing,
        );
      }
      commit((current) => ({
        ...current,
        ...(restored ? { overrides: restored.overrides, acceptedRepairs: restored.acceptedRepairs } : {}),
        refinement: {
          ...current.refinement,
          acceptedRevision: undefined,
          changeDecisions: current.refinement.changeDecisions.filter((item) => item.path !== path),
        },
      }));
      return true;
    },
    acceptUnlockedRefinementChanges: () => {
      const baseline = draft.refinement.baseline;
      if (!baseline) return 0;
      const resolved = resolveSelectedSpec(draft.styleId, draftResolutionOptions(draft));
      const paths = diffContractLeaves(baseline, resolved)
        .filter((change) => draft.refinement.allowedChanges.includes(change.axis) && !lockCovers(draft.refinement.lockedPaths, change.path))
        .map((change) => change.path)
        .filter((path) => draft.refinement.changeDecisions.find((item) => item.path === path)?.status !== 'accepted');
      if (!paths.length) return 0;
      commit((current) => ({
        ...current,
        refinement: {
          ...current.refinement,
          acceptedRevision: undefined,
          changeDecisions: [
            ...current.refinement.changeDecisions.filter((item) => !paths.includes(item.path)),
            ...paths.map((path) => ({ path, status: 'accepted' as const })),
          ],
        },
      }));
      return paths.length;
    },
    restoreBaseline: () => {
      const baseline = draft.refinement.baseline;
      if (!baseline) return false;
      parseResolvedVisualContract(baseline);
      if (getVisualContract(baseline.styleId).revision !== baseline.revision) return false;
      commit((current) => ({
        ...current, styleId: baseline.styleId, contractRevision: baseline.revision,
        mode: baseline.mode, contentLocale: baseline.contentLocale,
        overrides: baseline.overrides, acceptedRepairs: baseline.repairs,
        axisSources: current.refinement.baselineAxisSources ?? {},
        refinement: { ...current.refinement, acceptedRevision: undefined, changeDecisions: [] },
      }), true, true);
      return true;
    },
    acceptRepair: (repair: VisualRepair) => commit((current) => ({ ...current, acceptedRepairs: [...current.acceptedRepairs.filter((item) => item.id !== repair.id), repair] })),
    applyAxis: (selectedAxis: DesignAxis, sourceId: string) => {
      const normalized = selectedAxis === 'colors' ? 'color' : selectedAxis;
      if (!getStyleById(sourceId)) return false;
      const source = resolveSelectedSpec(sourceId, { contentLocale: draft.contentLocale });
      // Color roles from the other light/dark mode are a different design, not an axis swap.
      if (normalized === 'color' && source.mode !== draft.mode) return false;
      const values = getAxisOverrides(normalized, source);
      commit((current) => {
        const overrides = { ...current.overrides, ...values };
        if (normalized === 'density') delete overrides.density;
        return { ...current, overrides, axisSources: { ...current.axisSources, [normalized]: sourceId }, acceptedRepairs: normalized === 'color' ? [] : current.acceptedRepairs };
      }, true, true);
      return true;
    },
    resetAxis: (selectedAxis: DesignAxis) => {
      const normalized = selectedAxis === 'colors' ? 'color' : selectedAxis;
      commit((current) => {
        const overrides = { ...current.overrides }; const sources = { ...current.axisSources };
        delete overrides[normalized === 'color' ? 'colors' : normalized]; delete sources[normalized];
        if (normalized === 'density') delete overrides.spacing;
        if (normalized === 'typography') delete overrides.fonts;
        return { ...current, overrides, axisSources: sources, acceptedRepairs: normalized === 'color' ? [] : current.acceptedRepairs };
      }, true, true);
    },
    resetToAuthored: () => commit((current) => ({ ...current, overrides: {}, axisSources: {}, acceptedRepairs: [] }), true, true),
    resetDraft: () => {
      if (recoveryRaw && storage) { try { storage.setItem(DESIGN_DRAFT_RECOVERY_KEY, recoveryRaw); } catch { /* Recovery remains downloadable in this tab. */ } }
      commit(() => createInitialDraft(), true, true);
      if (status === 'recovery-needed') { status = storage ? 'saving' : 'memory-only'; flush(true); }
      notify();
    },
    undo: () => { const previous = history.pop(); if (previous) commit(() => previous, false, true); notify(); },
    receiveStorage: (raw: string | null) => {
      if (raw === rawAtRead) return;
      clearTimeout(timer); remoteRaw = raw; status = 'conflict'; notify();
    },
    reloadRemote: () => {
      const raw = remoteRaw;
      if (!raw) { recoveryReason = 'malformed'; recoveryRaw = raw; status = 'recovery-needed'; notify(); return false; }
      const parsed = parseDesignDraft(raw);
      if (!parsed.ok) { recoveryReason = parsed.reason; recoveryRaw = raw; status = 'recovery-needed'; notify(); return false; }
      history.push(draft); draft = parsed.draft; rawAtRead = raw; remoteRaw = null; status = 'saved'; resetEpoch += 1; notify(); return true;
    },
    keepLocal: () => {
      const remote = remoteRaw ? parseDesignDraft(remoteRaw) : null;
      draft = { ...draft, revision: Math.max(draft.revision, remote?.ok ? remote.draft.revision : 0) + 1 };
      return flush(true);
    },
    getRecoveryData: () => recoveryRaw ?? remoteRaw,
    dispose: () => { clearTimeout(timer); listeners.clear(); },
  };
}

export type DesignWorkspace = ReturnType<typeof createDesignWorkspace>;
