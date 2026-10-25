import type { Lang } from '../data/styles';
import { getStyleById, localize } from '../data/styles';
import { withLang } from '../utils/language';
import { useDesignWorkspace } from '../visual/useDesignWorkspace';
import './workspace-status.css';

const copy = {
  en: {
    current: 'Current design', modified: 'Modified', authored: 'Original values',
    color: 'Colors', typography: 'Typography', export: 'Export', undo: 'Undo', reset: 'Reset adjustments', resetAll: 'Start a new draft',
    incoming: 'This link selects another style. Applying it resets color and typography adjustments.', apply: 'Apply linked style', dismiss: 'Keep current design',
    invalid: 'This link names an unavailable style. Your current design is unchanged.', dismissError: 'Dismiss',
    invalidComparison: 'This comparison link contains unavailable styles or settings. Your current design and comparison are unchanged.',
    references: 'This legacy link supplies comparison references; only the primary style is applied. Use Compare to apply another style’s color, typography, or density.',
  },
  ko: {
    current: '현재 디자인', modified: '수정됨', authored: '원본 값',
    color: '색상', typography: '타이포그래피', export: '내보내기', undo: '되돌리기', reset: '조정값 초기화', resetAll: '새 작업 시작',
    incoming: '이 링크는 다른 스타일을 선택합니다. 적용하면 색상과 타이포그래피 조정값이 초기화됩니다.', apply: '링크의 스타일 적용', dismiss: '현재 디자인 유지',
    invalid: '이 링크의 스타일을 찾을 수 없습니다. 현재 디자인은 유지됩니다.', dismissError: '닫기',
    invalidComparison: '이 비교 링크의 스타일이나 설정을 찾을 수 없습니다. 현재 디자인과 비교 설정은 유지됩니다.',
    references: '기존 링크의 스타일은 비교 참고로 유지하며 첫 번째 스타일만 적용합니다. 다른 스타일의 색상·글자·밀도를 적용하려면 비교 도구를 사용하세요.',
  },
  ja: {
    current: '現在のデザイン', modified: '変更あり', authored: '元の値',
    color: '配色', typography: 'タイポグラフィ', export: '書き出し', undo: '元に戻す', reset: '調整をリセット', resetAll: '新しい作業を開始',
    incoming: 'このリンクは別のスタイルを選択します。適用すると配色と文字の調整がリセットされます。', apply: 'リンクのスタイルを適用', dismiss: '現在のデザインを保持',
    invalid: 'リンクのスタイルが見つかりません。現在のデザインは保持されます。', dismissError: '閉じる',
    invalidComparison: '比較リンクのスタイルまたは設定が見つかりません。現在のデザインと比較設定は保持されます。',
    references: '旧リンクのスタイルは比較参照として保持し、先頭のスタイルのみ適用します。別の配色・文字・密度を適用するには比較ツールを使ってください。',
  },
};

export function WorkspaceStatus({ lang }: { lang: Lang }) {
  const workspace = useDesignWorkspace();
  const t = copy[lang];
  const style = getStyleById(workspace.draft.styleId);
  return <aside className="workspace-status" aria-label={t.current}>
    <div className="workspace-status__row">
      <div className="workspace-status__identity"><span>{t.current}</span><strong>{style ? localize(style.name, lang) : workspace.draft.styleId}</strong><small>{workspace.modified ? t.modified : t.authored}</small></div>
      <nav className="workspace-status__tools" aria-label={t.current}>
        <a href={withLang('/pages/color-system', lang)}>{t.color}</a>
        <a href={withLang('/pages/typography', lang)}>{t.typography}</a>
        <a href={withLang('/pages/prompt-workflow', lang)}>{t.export}</a>
        <button type="button" disabled={!workspace.canUndo} onClick={workspace.undo}>{t.undo}</button>
        <details className="workspace-status__reset"><summary>{t.reset}</summary><div><button type="button" disabled={!Object.keys(workspace.draft.overrides).length && !workspace.draft.acceptedRepairs.length} onClick={workspace.resetToAuthored}>{t.reset}</button><button type="button" onClick={workspace.resetDraft}>{t.resetAll}</button></div></details>
      </nav>
    </div>
    {workspace.draft.referencedStyleIds.length > 1 ? <p className="workspace-status__saved">{t.references} <a href={withLang('/pages/compare', lang)}>{workspace.draft.referencedStyleIds.map((id) => localize(getStyleById(id)!.name, lang)).join(' / ')}</a></p> : null}
    {workspace.pendingStyleId ? <div className="workspace-status__notice" role="status"><p>{t.incoming}</p><button type="button" onClick={workspace.confirmStyleSelection}>{t.apply}</button><button type="button" onClick={workspace.dismissStyleSelection}>{t.dismiss}</button></div> : null}
    {workspace.linkError === 'invalid-selection' ? <div className="workspace-status__notice" role="status"><p>{t.invalid}</p><button type="button" onClick={workspace.dismissStyleSelection}>{t.dismissError}</button></div> : null}
    {workspace.linkError === 'invalid-comparison' ? <div className="workspace-status__notice" role="status"><p>{t.invalidComparison}</p><button type="button" onClick={workspace.dismissStyleSelection}>{t.dismissError}</button></div> : null}
  </aside>;
}
