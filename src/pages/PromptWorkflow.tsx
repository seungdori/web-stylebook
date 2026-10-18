import { useMemo, useState } from 'react';
import type { Lang } from '../data/styles';
import { getSpecimenCopy } from '../data/visualFixtures';
import { localize, styleCatalog } from '../data/styles';
import { copyText } from '../utils/clipboard';
import { useDesignWorkspace } from '../visual/useDesignWorkspace';
import { serializeVisualJson } from '../visual';
import { draftResolutionOptions } from '../visual/workspace';
import { projectResolvedSpec, resolveSelectedSpec } from '../visual/resolvedSpec';
import { refinementHandoffDocument, selectedHandoffToCss, selectedHandoffToPrompt, selectedHandoffToTheme, type ChangeAxis, type EvidenceKind } from '../visual/handoff';
import type { ResolvedVisualContract } from '../visual/types';
import { useActiveFonts, getActiveSpecimenFonts } from '../visual/useActiveFonts';
import { VisualSpecimen } from '../components/VisualSpecimen';
import { useEditorStylePreset } from './visual-editor/useEditorStylePreset';
import { promptWorkflowCopy } from './promptWorkflowCopy';
import './PromptWorkflow.css';

const sectionNames = {
  en: ['Purpose', 'Style and tone', 'Stack', 'Design system', 'Components', 'Screen assembly', 'Verification'],
  ko: ['제품 목적', '스타일과 톤', '기술 스택', '디자인 시스템', '컴포넌트', '화면 구성', '검증'],
  ja: ['製品の目的', 'スタイルとトーン', '技術スタック', 'デザインシステム', 'コンポーネント', '画面構成', '検証'],
} as const;
const sectionIds = ['purpose', 'styleTone', 'stack', 'designSystem', 'components', 'assembly', 'qa'] as const;
const evidenceKinds = ['structured-snapshot', 'draft', 'description', 'screenshot-only'] as const satisfies readonly EvidenceKind[];
const evidenceLabel: Record<EvidenceKind, 'structuredSnapshot' | 'savedDraft' | 'description' | 'screenshotOnly'> = { 'structured-snapshot': 'structuredSnapshot', draft: 'savedDraft', description: 'description', 'screenshot-only': 'screenshotOnly' };
const lines = (value: string) => value.split('\n').map((line) => line.trim()).filter(Boolean);

function LineField({ label, value, limit, lineLimit, onChange, lang, onValidityChange }: { onValidityChange: (valid: boolean) => void; label: string; value: string[]; limit: number; lineLimit: number; onChange: (value: string[]) => void; lang: Lang }) {
  const [invalid, setInvalid] = useState<string | null>(null);
  const error = lang === 'ko' ? `최대 ${limit}개, 각 줄 ${lineLimit}자까지 입력할 수 있습니다. 입력한 내용을 줄여 주세요.` : lang === 'ja' ? `最大${limit}件、1行${lineLimit}文字までです。入力内容を短くしてください。` : `Use at most ${limit} lines and ${lineLimit} characters per line. Please shorten the entered text.`;
  return <label>{label}<textarea value={invalid ?? value.join('\n')} aria-invalid={invalid !== null} onChange={(event) => { const entries = lines(event.target.value); if (entries.length > limit || entries.some((entry) => entry.length > lineLimit)) { setInvalid(event.target.value); onValidityChange(false); return; } setInvalid(null); onValidityChange(true); onChange(entries); }} />{invalid !== null && <span role="alert">{error}</span>}</label>;
}

export function PromptWorkflow({ lang }: { lang: Lang }) {
  useEditorStylePreset();
  const workspace = useDesignWorkspace();
  const { draft } = workspace;
  const resolved = useMemo(() => resolveSelectedSpec(draft.styleId, draftResolutionOptions(draft)), [draft]);
  const c = promptWorkflowCopy[lang];
  const [notice, setNotice] = useState('');
  const [invalidFields, setInvalidFields] = useState<Record<string, boolean>>({});
  const validity = (field: string, valid: boolean) => setInvalidFields((previous) => ({ ...previous, [field]: !valid }));
  const refinement = draft.refinement;
  const project = draft.projectContext;
  const baseline: ResolvedVisualContract | null = refinement.baseline ?? null;
  const fonts = useMemo(() => [...getActiveSpecimenFonts(resolved), ...(baseline ? getActiveSpecimenFonts(baseline) : [])], [resolved, baseline]);
  const fontStatus = useActiveFonts(fonts, resolved.contentLocale);
  const defaultCopy = getSpecimenCopy(draft.fixtureId, draft.contentLocale);
  const specimenCopy = Object.fromEntries((['heading', 'body', 'label', 'caption'] as const).map((key) => [key, draft.previewCopy[key].trim() ? draft.previewCopy[key] : defaultCopy[key]])) as typeof draft.previewCopy;
  const handoff = projectResolvedSpec(resolved, { taskMode: draft.taskMode, projectContext: project, refinement, explicitOverrides: draft.overrides, draftRevision: draft.revision, previewFontStatus: fontStatus, selectedReferenceIds: draft.referencedStyleIds, axisSources: draft.axisSources, fixtureId: draft.fixtureId, previewCopy: specimenCopy }).handoff;
  const conflicts = handoff.refinement?.conflicts ?? [];
  const pending = Boolean(baseline && handoff.refinement?.operations.length && refinement.acceptedRevision !== resolved.contentHash);
  const canExport = !conflicts.length && !Object.values(invalidFields).some(Boolean);
  const isRefinement = draft.taskMode === 'refine-existing';
  const prompt = canExport ? selectedHandoffToPrompt(handoff) : '';
  const review = !isRefinement ? serializeVisualJson(handoff) : conflicts.length ? conflicts.join('\n') : prompt;
  async function copy(value: string) {
    try { workspace.flush(); await copyText(value); setNotice(c.copied); } catch { setNotice(c.copyFailed); }
  }
  const localePath = (path: string) => `${lang === 'en' ? '' : `/${lang}`}${path}`;
  function axisToggle(axis: ChangeAxis) {
    workspace.setRefinement({ allowedChanges: refinement.allowedChanges.includes(axis) ? refinement.allowedChanges.filter((item) => item !== axis) : [...refinement.allowedChanges, axis], acceptedRevision: undefined });
  }
  return <div className="selected-handoff">
    <section className="page-hero"><p className="hero__eyebrow">Prompt Workflow</p><h1>{c.title}</h1><p>{c.intro}</p></section>
    <div className="handoff-task-modes" role="group" aria-label={c.task}>{(['new-design', 'refine-existing'] as const).map((mode) => <button className="button" key={mode} type="button" aria-pressed={draft.taskMode === mode} onClick={() => workspace.setTaskMode(mode)}>{mode === 'new-design' ? c.new : c.refine}</button>)}</div>
    <section className="handoff-workbench">
      <div className="handoff-fields">
        <label>{c.style}<select value={draft.styleId} onChange={(event) => workspace.requestStyleSelection(event.target.value)}>{styleCatalog.map((style) => <option key={style.id} value={style.id}>{localize(style.name, lang)}</option>)}</select></label>
        <div className="handoff-links"><a href={localePath('/pages/color-system')}>{c.tuneColors}</a><a href={localePath('/pages/typography')}>{c.tuneType}</a></div>
        <fieldset><legend>{c.project}</legend>
          <label>{c.name}<input maxLength={6000} value={project.name} onChange={(event) => workspace.setProjectContext({ name: event.target.value })} /></label>
          <label>{c.purpose}<textarea maxLength={6000} value={project.purpose} onChange={(event) => workspace.setProjectContext({ purpose: event.target.value })} /></label>
          <label>{c.audience}<input maxLength={6000} value={project.audience ?? ''} onChange={(event) => workspace.setProjectContext({ audience: event.target.value })} /></label>
          <label>{c.surface}<input maxLength={6000} value={project.surface} onChange={(event) => workspace.setProjectContext({ surface: event.target.value })} /></label>
          <LineField onValidityChange={(valid) => validity('screens', valid)} label={c.screens} value={project.screens} limit={40} lineLimit={500} lang={lang} onChange={(screens) => workspace.setProjectContext({ screens })} />
          <label>{c.stack}<input maxLength={6000} value={project.stack} onChange={(event) => workspace.setProjectContext({ stack: event.target.value })} /></label>
          <label>{c.constraints}<textarea maxLength={6000} value={project.constraints ?? ''} onChange={(event) => workspace.setProjectContext({ constraints: event.target.value })} /></label>
        </fieldset>
        {isRefinement && <fieldset><legend>{c.refine}</legend>
          <label>{c.source}<textarea maxLength={6000} value={refinement.sourceReference} onChange={(event) => workspace.setRefinement({ sourceReference: event.target.value })} /></label>
          <label>{c.outcome}<textarea maxLength={6000} value={refinement.requestedOutcome} onChange={(event) => workspace.setRefinement({ requestedOutcome: event.target.value })} /></label>
          <label>{c.evidence}<select value={refinement.evidenceKind} onChange={(event) => workspace.setRefinement({ evidenceKind: event.target.value as EvidenceKind })}>{evidenceKinds.map((kind) => <option value={kind} key={kind}>{c[evidenceLabel[kind]]}</option>)}</select></label>
          {refinement.evidenceKind === 'screenshot-only' && <p role="status">{c.limited}</p>}
          <fieldset className="handoff-axis-options"><legend>{c.scope}</legend>{(['colors', 'typography', 'density', 'composition'] as const).map((axis) => <label key={axis}><input type="checkbox" checked={refinement.allowedChanges.includes(axis)} onChange={() => axisToggle(axis)} />{c[axis]}</label>)}</fieldset>
          <p>{c.readonly}</p>
          <LineField onValidityChange={(valid) => validity('locks', valid)} label={c.locked} value={refinement.lockedPaths} limit={64} lineLimit={200} lang={lang} onChange={(lockedPaths) => workspace.setRefinement({ lockedPaths, acceptedRevision: undefined })} />
          <LineField onValidityChange={(valid) => validity('regions', valid)} label={c.regions} value={refinement.targetRegions} limit={30} lineLimit={200} lang={lang} onChange={(targetRegions) => workspace.setRefinement({ targetRegions })} />
          <button className="button" type="button" onClick={() => workspace.setRefinement({ baseline: resolved, baselineRevision: resolved.contentHash, acceptedRevision: resolved.contentHash, baselineAxisSources: draft.axisSources, ...(refinement.evidenceKind === 'description' ? { evidenceKind: 'draft' as const } : {}) })}>{c.baseline}</button>
        </fieldset>}
        <details><summary>{c.advanced}</summary>{sectionIds.map((id, index) => { const section = project.sectionInstructions?.[id] ?? { mode: 'ai' as const, notes: '' }; return <div className="handoff-section-note" key={id}><label>{sectionNames[lang][index]}<select value={section.mode} onChange={(event) => workspace.setProjectContext({ sectionInstructions: { ...project.sectionInstructions, [id]: { ...section, mode: event.target.value as 'ai' | 'manual' } } })}><option value="ai">{c.auto}</option><option value="manual">{c.manual}</option></select></label><textarea maxLength={6000} aria-label={`${sectionNames[lang][index]} ${c.manual}`} value={section.notes} onChange={(event) => workspace.setProjectContext({ sectionInstructions: { ...project.sectionInstructions, [id]: { ...section, notes: event.target.value } } })} /></div>; })}</details>
      </div>
      <div className="handoff-output">
        {isRefinement && <section><p>{c.specimen}</p><div className="handoff-specimens">{baseline && <div><h3>{c.before}</h3><VisualSpecimen spec={baseline} lang={baseline.contentLocale} fixtureId={draft.fixtureId} compact /></div>}<div><h3>{c.after}</h3><VisualSpecimen spec={resolved} lang={resolved.contentLocale} fixtureId={draft.fixtureId} copy={draft.previewCopy} compact /></div></div>{!baseline && <p>{c.noBaseline}</p>}{baseline && <div className="handoff-actions"><button className="button" type="button" disabled={conflicts.length > 0 || !pending} onClick={() => workspace.setRefinement({ acceptedRevision: resolved.contentHash })}>{c.accept}</button><button className="button" type="button" onClick={() => workspace.restoreBaseline()}>{c.reject}</button></div>}</section>}
        {conflicts.length > 0 && <div role="alert" className="handoff-conflicts"><strong>{c.conflicts}</strong><ul>{conflicts.map((conflict) => <li key={conflict}>{conflict}</li>)}</ul></div>}
        {pending && <p role="status">{c.pending}</p>}
        <div className="handoff-actions"><button className="button button--primary" type="button" disabled={!canExport} onClick={() => copy(prompt)}>{c.copy}</button><button className="button" type="button" disabled={!workspace.canUndo} onClick={workspace.undo}>{c.undo}</button></div>
        <p role="status" aria-live="polite">{notice}</p><p>{c.noChecks}</p>{fontStatus.some((font) => font.status !== 'ready') && <p role="status">{lang === 'ko' ? '일부 글꼴은 로딩 중이거나 대체 글꼴로 표시됩니다. 상태는 내보내기에 함께 기록합니다.' : lang === 'ja' ? '一部のフォントは読み込み中か代替フォントで表示されています。状態は出力にも記録されます。' : 'Some fonts are loading or use a fallback. Their current status is included in the export.'}</p>}
        <details><summary>{c.exports}</summary><div className="handoff-actions"><button className="button" type="button" disabled={isRefinement && !canExport} onClick={() => copy(isRefinement ? serializeVisualJson(refinementHandoffDocument(handoff), 0) : serializeVisualJson(handoff))}>JSON</button><button className="button" type="button" disabled={!canExport || isRefinement} onClick={() => copy(selectedHandoffToCss(handoff))}>CSS</button><button className="button" type="button" disabled={!canExport || isRefinement} onClick={() => copy(selectedHandoffToTheme(handoff))}>TypeScript</button></div></details>
        <details><summary>{c.metadata}</summary><dl><dt>Style</dt><dd>{resolved.styleId}</dd><dt>Revision</dt><dd>{resolved.revision}</dd><dt>Design</dt><dd>{resolved.contentHash}</dd><dt>Locale</dt><dd>{resolved.contentLocale}</dd><dt>Mode</dt><dd>{resolved.mode}</dd></dl></details>
        <details><summary>{c.details}</summary><pre tabIndex={0}>{review}</pre></details>
      </div>
    </section>
    <details className="handoff-discovery" open={new URLSearchParams(window.location.search).get('path') === 'ai'}><summary>{c.discover}</summary><p>{c.discoverDesc}</p><div className="handoff-links"><a href="/agent-handoff.json">{c.index}</a><a href="/agent-handoff.full.json">{c.full}</a></div></details>
  </div>;
}
