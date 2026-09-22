import { useMemo, useState } from 'react';
import type { Lang } from '../data/styles';
import { getSpecimenCopy } from '../data/visualFixtures';
import { localize, styleCatalog } from '../data/styles';
import { copyText } from '../utils/clipboard';
import { useDesignWorkspace } from '../visual/useDesignWorkspace';
import { serializeVisualJson } from '../visual';
import { buildSelectedHandoff, selectedHandoffToCss, selectedHandoffToPrompt, selectedHandoffToTheme, type ChangeAxis } from '../visual/handoff';
import type { ResolvedVisualContract } from '../visual/types';
import { useActiveFonts, getActiveSpecimenFonts } from '../visual/useActiveFonts';
import { VisualSpecimen } from '../components/VisualSpecimen';
import { useEditorStylePreset } from './visual-editor/useEditorStylePreset';
import './PromptWorkflow.css';

const words = {
  en: { title: 'Take your design into implementation', intro: 'Your selected style and edits travel together. Choose a new build or a focused improvement, then copy the current design.', new: 'New design', refine: 'Refine an existing design', style: 'Selected style', project: 'Project brief', name: 'Project name', purpose: 'Product and desired outcome', audience: 'Audience', surface: 'Product surface', screens: 'Required screens (one per line)', stack: 'Existing or requested framework', constraints: 'Keep / avoid / project constraints', advanced: 'Section instructions', auto: 'AI follows the resolved design', manual: 'Use my instructions', copy: 'Copy implementation prompt', copied: 'Copied', copyFailed: 'Copy failed. Select the text below and copy it manually.', exports: 'Other exports', details: 'Review the handoff', source: 'Existing design source or description', outcome: 'What should improve?', evidence: 'Available context', description: 'Description', screenshot: 'Screenshot reference only', sourceCode: 'Source reference', rendered: 'Rendered product reference', scope: 'Allowed changes', colors: 'Color roles', typography: 'Typography', density: 'Spacing and density', composition: 'Composition and hierarchy', locked: 'Locked token paths (one per line)', regions: 'Target regions / selectors (unverified, one per line)', baseline: 'Save current specimen as baseline', accept: 'Accept proposed specimen changes', reject: 'Reject changes and restore baseline', undo: 'Undo last workspace change', specimen: 'These are local specimens, not a live preview of your external product.', pending: 'Review and accept the proposed specimen changes before copying.', conflicts: 'Resolve these change conflicts before copying', noChecks: 'Implementation checks have not run. Exporting does not verify an external product.', tuneColors: 'Adjust colors', tuneType: 'Adjust typography', discover: 'Still choosing a style?', discoverDesc: 'The discovery index helps an agent shortlist styles. These public links contain catalog defaults; they do not include your local edits.', index: 'Compact discovery data', full: 'Full legacy discovery data', metadata: 'Design identity', before: 'Saved baseline', after: 'Current proposal', noBaseline: 'No source values were measured. This export proposes specimen values and labels them as unverified.', readonly: 'Preserved: content, behavior, routes, existing stack, component structure and all unselected design axes.' },
  ko: { title: '선택한 디자인을 구현으로 이어가세요', intro: '선택한 스타일과 수정값을 함께 전달합니다. 새 디자인과 기존 디자인의 부분 개선 중 작업을 고른 뒤 현재 설정을 복사하세요.', new: '새 디자인', refine: '기존 디자인 부분 개선', style: '선택한 스타일', project: '프로젝트 정보', name: '프로젝트 이름', purpose: '제품과 원하는 결과', audience: '사용 대상', surface: '제품 화면 유형', screens: '필요한 화면 (한 줄에 하나)', stack: '현재 또는 요청한 프레임워크', constraints: '유지할 점 / 피할 점 / 제작 조건', advanced: '영역별 구현 지시', auto: 'AI가 선택한 명세에 따라 구현', manual: '직접 적은 지시 사용', copy: '구현 프롬프트 복사', copied: '복사됨', copyFailed: '복사하지 못했어요. 아래 내용을 선택해 직접 복사해 주세요.', exports: '다른 형식으로 내보내기', details: '전달할 내용 확인', source: '기존 디자인 출처 또는 설명', outcome: '무엇을 개선할까요?', evidence: '제공한 자료', description: '설명', screenshot: '스크린샷 참조만 있음', sourceCode: '소스 코드 참조', rendered: '실행 화면 참조', scope: '바꿔도 되는 항목', colors: '색상 역할', typography: '타이포그래피', density: '간격과 밀도', composition: '구성과 위계', locked: '고정할 토큰 경로 (한 줄에 하나)', regions: '대상 영역 / 선택자 (미확인, 한 줄에 하나)', baseline: '현재 예시를 기준으로 저장', accept: '예시 변경안 적용', reject: '변경안 취소하고 기준으로 복원', undo: '최근 작업 변경 되돌리기', specimen: '이 비교는 로컬 디자인 예시입니다. 외부 제품의 실제 미리보기가 아닙니다.', pending: '예시 변경안을 확인하고 적용한 뒤 복사하세요.', conflicts: '복사하기 전에 변경 범위의 충돌을 해결하세요', noChecks: '구현 검증은 아직 실행하지 않았습니다. 내보내기로 외부 제품이 검증되지는 않습니다.', tuneColors: '색상 조정', tuneType: '타이포그래피 조정', discover: '스타일을 아직 고르고 있나요?', discoverDesc: '탐색용 데이터로 AI가 후보를 좁힐 수 있습니다. 이 공개 링크에는 카탈로그 기본값만 있으며, 브라우저에서 수정한 값은 포함되지 않습니다.', index: '간단한 탐색 데이터', full: '기존 전체 탐색 데이터', metadata: '디자인 식별 정보', before: '저장한 기준', after: '현재 변경안', noBaseline: '기존 제품의 값을 측정하지 않았습니다. 예시 값을 제안하며 미확인 상태로 전달합니다.', readonly: '콘텐츠, 기능, 라우트, 기존 스택, 컴포넌트 구조와 선택하지 않은 디자인 항목은 유지합니다.' },
  ja: { title: '選んだデザインを実装へ', intro: '選んだスタイルと編集値を一緒に渡します。新規デザインか既存デザインの部分改善を選び、現在の設定をコピーしてください。', new: '新規デザイン', refine: '既存デザインを部分改善', style: '選択中のスタイル', project: 'プロジェクト情報', name: 'プロジェクト名', purpose: '製品と期待する結果', audience: '対象ユーザー', surface: '製品画面の種類', screens: '必要な画面（1行ずつ）', stack: '現在または指定のフレームワーク', constraints: '維持する点 / 避ける点 / 制作条件', advanced: '領域別の実装指示', auto: 'AIが選択済み仕様に従う', manual: '入力した指示を使用', copy: '実装プロンプトをコピー', copied: 'コピーしました', copyFailed: 'コピーできませんでした。下の内容を選択してコピーしてください。', exports: '他の形式で出力', details: '引き継ぎ内容を確認', source: '既存デザインの参照または説明', outcome: '改善したいこと', evidence: '提供した資料', description: '説明', screenshot: 'スクリーンショット参照のみ', sourceCode: 'ソースコード参照', rendered: '実行画面参照', scope: '変更を許可する項目', colors: '色の役割', typography: 'タイポグラフィ', density: '間隔と密度', composition: '構成と階層', locked: '固定するトークンパス（1行ずつ）', regions: '対象領域 / セレクター（未確認、1行ずつ）', baseline: '現在の見本を基準として保存', accept: '見本の変更案を適用', reject: '変更を取り消して基準に戻す', undo: '直前の作業変更を戻す', specimen: 'これはローカルのデザイン見本です。外部製品のライブプレビューではありません。', pending: '見本の変更案を確認して適用してからコピーしてください。', conflicts: 'コピー前に変更範囲の競合を解決してください', noChecks: '実装の検証はまだ行っていません。出力しても外部製品は検証されません。', tuneColors: '色を調整', tuneType: 'タイポグラフィを調整', discover: 'まだスタイルを選んでいますか？', discoverDesc: '探索用データでAIが候補を絞れます。公開リンクにはカタログの初期値だけが含まれ、ブラウザー内の編集値は含まれません。', index: '簡潔な探索データ', full: '従来の完全な探索データ', metadata: 'デザインの識別情報', before: '保存した基準', after: '現在の変更案', noBaseline: '既存製品の値は測定されていません。見本の値を提案し、未確認として出力します。', readonly: '内容、機能、ルート、既存スタック、コンポーネント構造と未選択のデザイン項目を維持します。' },
};
const sectionNames = {
  en: ['Purpose', 'Style and tone', 'Stack', 'Design system', 'Components', 'Screen assembly', 'Verification'],
  ko: ['제품 목적', '스타일과 톤', '기술 스택', '디자인 시스템', '컴포넌트', '화면 구성', '검증'],
  ja: ['製品の目的', 'スタイルとトーン', '技術スタック', 'デザインシステム', 'コンポーネント', '画面構成', '検証'],
};
const sectionIds = ['purpose', 'styleTone', 'stack', 'designSystem', 'components', 'assembly', 'qa'] as const;
const lines = (value: string) => value.split('\n').map((line) => line.trim()).filter(Boolean);

function LineField({ label, value, limit, lineLimit, onChange, lang, onValidityChange }: { onValidityChange: (valid: boolean) => void; label: string; value: string[]; limit: number; lineLimit: number; onChange: (value: string[]) => void; lang: Lang }) {
  const [invalid, setInvalid] = useState<string | null>(null);
  const error = lang === 'ko' ? `최대 ${limit}개, 각 줄 ${lineLimit}자까지 입력할 수 있습니다. 입력한 내용을 줄여 주세요.` : lang === 'ja' ? `最大${limit}件、1行${lineLimit}文字までです。入力内容を短くしてください。` : `Use at most ${limit} lines and ${lineLimit} characters per line. Please shorten the entered text.`;
  return <label>{label}<textarea value={invalid ?? value.join('\n')} aria-invalid={invalid !== null} onChange={(event) => { const entries = lines(event.target.value); if (entries.length > limit || entries.some((entry) => entry.length > lineLimit)) { setInvalid(event.target.value); onValidityChange(false); return; } setInvalid(null); onValidityChange(true); onChange(entries); }} />{invalid !== null && <span role="alert">{error}</span>}</label>;
}

export function PromptWorkflow({ lang }: { lang: Lang }) {
  useEditorStylePreset();
  const workspace = useDesignWorkspace();
  const { draft, resolved } = workspace;
  const c = words[lang];
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
  const handoff = buildSelectedHandoff(resolved, { taskMode: draft.taskMode, projectContext: project, refinement, explicitOverrides: draft.overrides, draftRevision: draft.revision, previewFontStatus: fontStatus, selectedReferenceIds: draft.referencedStyleIds, fixtureId: draft.fixtureId, previewCopy: specimenCopy });
  const conflicts = handoff.refinement?.conflicts ?? [];
  const pending = Boolean(baseline && handoff.refinement?.operations.length && refinement.acceptedRevision !== resolved.contentHash);
  const canExport = !conflicts.length && !pending && !Object.values(invalidFields).some(Boolean);
  const prompt = canExport ? selectedHandoffToPrompt(handoff) : serializeVisualJson(handoff);
  const isRefinement = draft.taskMode === 'refine-existing';
  async function copy(value: string) {
    try { workspace.flush(); await copyText(value); setNotice(c.copied); } catch { setNotice(c.copyFailed); }
  }
  const localePath = (path: string) => `${lang === 'en' ? '' : `/${lang}`}${path}`;
  function axisToggle(axis: ChangeAxis) {
    workspace.setRefinement({ allowedChanges: refinement.allowedChanges.includes(axis) ? refinement.allowedChanges.filter((item) => item !== axis) : [...refinement.allowedChanges, axis], acceptedRevision: undefined });
  }
  return <div className="selected-handoff">
    <section className="page-hero"><p className="hero__eyebrow">Prompt Workflow</p><h1>{c.title}</h1><p>{c.intro}</p></section>
    <div className="handoff-task-modes" aria-label={c.scope}>{(['new-design', 'refine-existing'] as const).map((mode) => <button className="button" key={mode} type="button" aria-pressed={draft.taskMode === mode} onClick={() => workspace.setTaskMode(mode)}>{mode === 'new-design' ? c.new : c.refine}</button>)}</div>
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
          <label>{c.evidence}<select value={refinement.evidenceKind} onChange={(event) => workspace.setRefinement({ evidenceKind: event.target.value as typeof refinement.evidenceKind })}>{(['description', 'screenshot', 'source', 'rendered'] as const).map((kind) => <option value={kind} key={kind}>{kind === 'source' ? c.sourceCode : c[kind]}</option>)}</select></label>
          <fieldset className="handoff-axis-options"><legend>{c.scope}</legend>{(['colors', 'typography', 'density', 'composition'] as const).map((axis) => <label key={axis}><input type="checkbox" checked={refinement.allowedChanges.includes(axis)} onChange={() => axisToggle(axis)} />{c[axis]}</label>)}</fieldset>
          <p>{c.readonly}</p>
          <LineField onValidityChange={(valid) => validity('locks', valid)} label={c.locked} value={refinement.lockedPaths} limit={64} lineLimit={200} lang={lang} onChange={(lockedPaths) => workspace.setRefinement({ lockedPaths, acceptedRevision: undefined })} />
          <LineField onValidityChange={(valid) => validity('regions', valid)} label={c.regions} value={refinement.targetRegions} limit={30} lineLimit={200} lang={lang} onChange={(targetRegions) => workspace.setRefinement({ targetRegions })} />
          <button className="button" type="button" onClick={() => workspace.setRefinement({ baseline: resolved, baselineRevision: resolved.contentHash, acceptedRevision: resolved.contentHash, baselineAxisSources: draft.axisSources })}>{c.baseline}</button>
        </fieldset>}
        <details><summary>{c.advanced}</summary>{sectionIds.map((id, index) => { const section = project.sectionInstructions?.[id] ?? { mode: 'ai' as const, notes: '' }; return <div className="handoff-section-note" key={id}><label>{sectionNames[lang][index]}<select value={section.mode} onChange={(event) => workspace.setProjectContext({ sectionInstructions: { ...project.sectionInstructions, [id]: { ...section, mode: event.target.value as 'ai' | 'manual' } } })}><option value="ai">{c.auto}</option><option value="manual">{c.manual}</option></select></label><textarea maxLength={6000} aria-label={`${sectionNames[lang][index]} ${c.manual}`} value={section.notes} onChange={(event) => workspace.setProjectContext({ sectionInstructions: { ...project.sectionInstructions, [id]: { ...section, notes: event.target.value } } })} /></div>; })}</details>
      </div>
      <div className="handoff-output">
        {isRefinement && <section><p>{c.specimen}</p><div className="handoff-specimens">{baseline && <div><h3>{c.before}</h3><VisualSpecimen spec={baseline} lang={baseline.contentLocale} fixtureId={draft.fixtureId} compact /></div>}<div><h3>{c.after}</h3><VisualSpecimen spec={resolved} lang={resolved.contentLocale} fixtureId={draft.fixtureId} copy={draft.previewCopy} compact /></div></div>{!baseline && <p>{c.noBaseline}</p>}{baseline && <div className="handoff-actions"><button className="button" type="button" disabled={conflicts.length > 0 || !pending} onClick={() => workspace.setRefinement({ acceptedRevision: resolved.contentHash })}>{c.accept}</button><button className="button" type="button" onClick={() => workspace.restoreBaseline()}>{c.reject}</button></div>}</section>}
        {conflicts.length > 0 && <div role="alert" className="handoff-conflicts"><strong>{c.conflicts}</strong><ul>{conflicts.map((conflict) => <li key={conflict}>{conflict}</li>)}</ul></div>}
        {pending && <p role="status">{c.pending}</p>}
        <div className="handoff-actions"><button className="button button--primary" type="button" disabled={!canExport} onClick={() => copy(prompt)}>{c.copy}</button><button className="button" type="button" disabled={!workspace.canUndo} onClick={workspace.undo}>{c.undo}</button></div>
        <p role="status" aria-live="polite">{notice}</p><p>{c.noChecks}</p>{fontStatus.some((font) => font.status !== 'ready') && <p role="status">{lang === 'ko' ? '일부 글꼴은 로딩 중이거나 대체 글꼴로 표시됩니다. 상태는 내보내기에 함께 기록합니다.' : lang === 'ja' ? '一部のフォントは読み込み中か代替フォントで表示されています。状態は出力にも記録されます。' : 'Some fonts are loading or use a fallback. Their current status is included in the export.'}</p>}
        <details><summary>{c.exports}</summary><div className="handoff-actions"><button className="button" type="button" onClick={() => copy(serializeVisualJson(handoff))}>JSON</button><button className="button" type="button" disabled={!canExport} onClick={() => copy(selectedHandoffToCss(handoff))}>CSS</button><button className="button" type="button" disabled={!canExport} onClick={() => copy(selectedHandoffToTheme(handoff))}>TypeScript</button></div></details>
        <details><summary>{c.metadata}</summary><dl><dt>Style</dt><dd>{resolved.styleId}</dd><dt>Revision</dt><dd>{resolved.revision}</dd><dt>Design</dt><dd>{resolved.contentHash}</dd><dt>Locale</dt><dd>{resolved.contentLocale}</dd><dt>Mode</dt><dd>{resolved.mode}</dd></dl></details>
        <details><summary>{c.details}</summary><pre tabIndex={0}>{serializeVisualJson(handoff)}</pre></details>
      </div>
    </section>
    <details className="handoff-discovery" open={new URLSearchParams(window.location.search).get('path') === 'ai'}><summary>{c.discover}</summary><p>{c.discoverDesc}</p><div className="handoff-links"><a href="/agent-handoff.json">{c.index}</a><a href="/agent-handoff.full.json">{c.full}</a></div></details>
  </div>;
}
