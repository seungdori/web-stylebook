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
    purpose: z.enum(['all', 'mixed', 'operational-saas', 'content-editorial', 'campaign', 'commerce']),
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
export interface WorkspaceSnapshot {
  draft: DesignDraft;
  linkError?: 'invalid-selection' | 'invalid-comparison';
  pendingStyleId?: string;
  canUndo: boolean;
  modified: boolean;
  resetEpoch: number;
}
export interface DraftStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export function draftWithLocationComparison(draft: DesignDraft, search: string | null): DesignDraft {
  if (search === null) return draft;
  const incoming = parseComparisonQuery(search);
  if (!incoming.ok) return draft;
  return { ...draft, comparison: { ...draft.comparison, ...incoming.comparison }, fixtureId: incoming.fixtureId ?? draft.fixtureId };
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

/** A repair depends on its adjacent color pair. Repairs that no longer resolve are dropped; the rest stay. */
function applicableRepairs(draft: DesignDraft): VisualRepair[] {
  const valid: VisualRepair[] = [];
  for (const repair of draft.acceptedRepairs) {
    try { resolveSelectedSpec(draft.styleId, { ...draftResolutionOptions(draft), acceptedRepairs: [...valid, repair] }); valid.push(repair); } catch { /* The color editor offers a new proposal for this pair. */ }
  }
  return valid;
}

type ReadResult = { ok: true; draft: DesignDraft; migrated: boolean } | { ok: false; reason: 'malformed' | 'unsupported-version' };

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
    let draft = parsed.data;
    // A catalog update changes the authored revision. The reader's own values carry over to it.
    const revision = getVisualContract(draft.styleId).revision;
    if (draft.contractRevision !== revision) draft = { ...draft, contractRevision: revision, acceptedRepairs: applicableRepairs(draft) };
    if (draft.refinement.baseline) {
      const baseline = parseResolvedVisualContract(draft.refinement.baseline);
      // A captured baseline describes the old catalog. Only that capture and its decisions are dropped.
      if (baseline.revision !== getVisualContract(baseline.styleId).revision) {
        draft = { ...draft, refinement: { ...draft.refinement, baseline: undefined, baselineRevision: undefined, baselineAxisSources: undefined, acceptedRevision: undefined, changeDecisions: [] } };
      }
    }
    resolveSelectedSpec(draft.styleId, draftResolutionOptions(draft));
    return { ok: true, draft, migrated: version === 0 || draft !== parsed.data };
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

/**
 * The draft saves itself. Each committed edit is written at once, another tab's write is
 * adopted as it arrives, and a browser that cannot store it keeps the draft in this tab.
 * None of this asks the reader for a decision.
 */
export function createDesignWorkspace(storage: DraftStorage | null, options: { initialContentLocale?: DesignDraft['contentLocale'] } = {}) {
  let draft = { ...createInitialDraft(), contentLocale: options.initialContentLocale ?? 'en' };
  let written: string | null = null;
  const warned = new Set<string>();
  let linkError: WorkspaceSnapshot['linkError'];
  let pendingStyleId: string | undefined;
  let pendingReferenceIds: string[] | undefined;
  let resetEpoch = 0;
  const history: DesignDraft[] = [];
  const listeners = new Set<() => void>();
  function warn(message: string, error?: unknown) {
    // The reader is not interrupted. One console line per kind keeps the failure visible to developers.
    if (warned.has(message)) return;
    warned.add(message);
    console.warn(`[web-stylebook] ${message}`, ...(error === undefined ? [] : [error]));
  }
  try {
    const raw = storage?.getItem(DESIGN_DRAFT_STORAGE_KEY) ?? null;
    if (raw) {
      const result = parseDesignDraft(raw);
      if (result.ok) { draft = result.draft; written = raw; }
      else {
        // An unreadable draft is kept aside before the next write replaces it.
        try { storage?.setItem(DESIGN_DRAFT_RECOVERY_KEY, raw); } catch { /* The warning below still reports the discarded draft. */ }
        warn(`Started a new design draft; the saved one was ${result.reason} and is kept under ${DESIGN_DRAFT_RECOVERY_KEY}.`);
      }
    }
  } catch (error) { warn('The design draft could not be read; edits stay in this tab.', error); }
  // The compare page applies its URL from an effect. That runs after the default brutalist specimen has already requested its faces.
  const located = draftWithLocationComparison(draft, typeof window === 'undefined' ? null : window.location.search);
  const locationChanged = located !== draft;
  draft = located;
  let snapshot: WorkspaceSnapshot = { draft, linkError, canUndo: false, modified: isDraftModified(draft), resetEpoch };
  function notify() {
    snapshot = { draft, linkError, pendingStyleId, canUndo: history.length > 0, modified: isDraftModified(draft), resetEpoch };
    listeners.forEach((listener) => listener());
  }
  function persist() {
    if (!storage) return;
    try {
      const serialized = JSON.stringify(draft);
      if (serialized.length > MAX_DRAFT_BYTES) throw new Error(`The draft is ${serialized.length} characters; the limit is ${MAX_DRAFT_BYTES}.`);
      storage.setItem(DESIGN_DRAFT_STORAGE_KEY, serialized);
      written = serialized;
    } catch (error) { warn('The design draft could not be saved; edits stay in this tab.', error); }
  }
  function remember(previous: DesignDraft) {
    history.push(previous);
    if (history.length > MAX_UNDO) history.shift();
  }
  if (locationChanged) persist();
  function commit(update: (current: DesignDraft) => DesignDraft, rememberPrevious = true, resetInputs = false) {
    const next = zDesignDraft.parse(update(draft));
    resolveSelectedSpec(next.styleId, draftResolutionOptions(next));
    if (resetInputs) resetEpoch += 1;
    if (JSON.stringify({ ...next, revision: 0 }) === JSON.stringify({ ...draft, revision: 0 })) { if (resetInputs) notify(); return; }
    if (rememberPrevious) remember(draft);
    draft = { ...next, revision: draft.revision + 1 };
    persist(); notify();
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
      if (overrides.colors) next.acceptedRepairs = applicableRepairs(next);
      return next;
    });
  }
  return {
    getSnapshot: () => snapshot,
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    selectStyle,
    requestStyleSelection: (id: string) => {
      if (!getStyleById(id)) { linkError = 'invalid-selection'; notify(); return false; }
      if (id === draft.styleId) return true;
      if (isDraftModified(draft)) { pendingStyleId = id; pendingReferenceIds = undefined; notify(); return false; }
      selectStyle(id); return true;
    },
    requestStylePreset: (raw: string) => {
      const ids = [...new Set(raw.split(',').map((value) => value.trim()).filter(Boolean))];
      if (!ids.length || ids.length > styleCatalog.length || ids.some((id) => !getStyleById(id))) { linkError = 'invalid-selection'; notify(); return false; }
      if (ids[0] === draft.styleId) {
        if (ids.length > 1) commit((current) => ({ ...current, referencedStyleIds: ids, comparison: { ...current.comparison, left: ids[0], right: ids[1] } }));
        return true;
      }
      if (isDraftModified(draft)) { pendingStyleId = ids[0]; pendingReferenceIds = ids; notify(); return false; }
      selectStyle(ids[0], ids.length > 1 ? ids : []); return true;
    },
    requestComparisonSelection: (search: string) => {
      const incoming = parseComparisonQuery(search);
      if (!incoming.ok) { linkError = 'invalid-comparison'; notify(); return false; }
      if (linkError === 'invalid-comparison') linkError = undefined;
      commit((current) => ({ ...current, comparison: { ...current.comparison, ...incoming.comparison }, fixtureId: incoming.fixtureId ?? current.fixtureId }), false);
      notify(); return true;
    },
    dismissStyleSelection: () => { pendingStyleId = undefined; pendingReferenceIds = undefined; linkError = undefined; notify(); },
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
    resetDraft: () => { commit(() => createInitialDraft(), true, true); notify(); },
    undo: () => { const previous = history.pop(); if (previous) commit(() => previous, false, true); notify(); },
    /** Another tab wrote the draft. This tab follows it; undo steps back to what this tab showed. */
    adoptStoredDraft: (raw: string | null) => {
      if (raw === null || raw === written) return;
      const result = parseDesignDraft(raw);
      // An unreadable write is ignored. This tab's next edit replaces it.
      if (!result.ok) return;
      remember(draft);
      draft = result.draft; written = raw; resetEpoch += 1; notify();
    },
    dispose: () => { listeners.clear(); },
  };
}

export type DesignWorkspace = ReturnType<typeof createDesignWorkspace>;
