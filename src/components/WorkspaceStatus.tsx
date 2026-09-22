import type { Lang } from '../data/styles';
import { getStyleById, localize } from '../data/styles';
import { withLang } from '../utils/language';
import { useDesignWorkspace } from '../visual/useDesignWorkspace';
import './workspace-status.css';

const copy = {
  en: {
    current: 'Current design', modified: 'Modified', authored: 'Original values', saved: 'Saved in this browser', saving: 'Saving…',
    color: 'Colors', typography: 'Typography', export: 'Export', undo: 'Undo', reset: 'Reset adjustments', resetAll: 'Start a new draft',
    local: 'Changes are available in this tab, but could not be saved. Export before leaving.',
    recovery: 'The saved draft could not be restored. Its original data is kept for recovery; this tab is using a new draft.',
    stale: 'The saved draft uses a different catalog revision. Download it before starting again; its values have not been silently updated.',
    conflict: 'Another tab changed this draft. Choose which version to keep before saving.',
    remote: 'Load other tab’s version', keep: 'Keep this tab’s version', download: 'Download recovery data',
    incoming: 'This link selects another style. Applying it resets color and typography adjustments.', apply: 'Apply linked style', dismiss: 'Keep current design',
    invalid: 'This link names an unavailable style. Your current design is unchanged.', dismissError: 'Dismiss',
    invalidComparison: 'This comparison link contains unavailable styles or settings. Your current design and comparison are unchanged.',
    linkNote: 'Page links do not include your local edits.',
    references: 'This legacy link supplies comparison references; only the primary style is applied. Use Compare to apply another style’s color, typography, or density.',
  },
  ko: {
    current: '현재 디자인', modified: '수정됨', authored: '원본 값', saved: '이 브라우저에 저장됨', saving: '저장 중…',
    color: '색상', typography: '타이포그래피', export: '내보내기', undo: '되돌리기', reset: '조정값 초기화', resetAll: '새 작업 시작',
    local: '이 탭에서는 수정할 수 있지만 저장하지 못했습니다. 페이지를 떠나기 전에 내보내세요.',
    recovery: '저장된 작업을 복원하지 못했습니다. 원본 데이터는 복구용으로 보관하고 이 탭에서는 새 작업을 사용합니다.',
    stale: '저장된 작업의 카탈로그 버전이 다릅니다. 새로 시작하기 전에 복구 데이터를 받으세요. 기존 값을 자동으로 변경하지 않았습니다.',
    conflict: '다른 탭에서 작업이 변경되었습니다. 저장하기 전에 유지할 버전을 선택하세요.',
    remote: '다른 탭의 작업 불러오기', keep: '이 탭의 작업 유지', download: '복구 데이터 다운로드',
    incoming: '이 링크는 다른 스타일을 선택합니다. 적용하면 색상과 타이포그래피 조정값이 초기화됩니다.', apply: '링크의 스타일 적용', dismiss: '현재 디자인 유지',
    invalid: '이 링크의 스타일을 찾을 수 없습니다. 현재 디자인은 유지됩니다.', dismissError: '닫기',
    invalidComparison: '이 비교 링크의 스타일이나 설정을 찾을 수 없습니다. 현재 디자인과 비교 설정은 유지됩니다.',
    linkNote: '페이지 링크에는 이 브라우저의 수정값이 포함되지 않습니다.',
    references: '기존 링크의 스타일은 비교 참고로 유지하며 첫 번째 스타일만 적용합니다. 다른 스타일의 색상·글자·밀도를 적용하려면 비교 도구를 사용하세요.',
  },
  ja: {
    current: '現在のデザイン', modified: '変更あり', authored: '元の値', saved: 'このブラウザーに保存済み', saving: '保存中…',
    color: '配色', typography: 'タイポグラフィ', export: '書き出し', undo: '元に戻す', reset: '調整をリセット', resetAll: '新しい作業を開始',
    local: 'このタブでは編集できますが、保存できませんでした。移動する前に書き出してください。',
    recovery: '保存された作業を復元できませんでした。元のデータは復旧用に保持し、このタブでは新しい作業を使用しています。',
    stale: '保存された作業のカタログ版が異なります。再開前に復旧データを保存してください。以前の値は自動変更していません。',
    conflict: '別のタブで作業が変更されました。保存する前に保持する版を選んでください。',
    remote: '別のタブの作業を読み込む', keep: 'このタブの作業を保持', download: '復旧データをダウンロード',
    incoming: 'このリンクは別のスタイルを選択します。適用すると配色と文字の調整がリセットされます。', apply: 'リンクのスタイルを適用', dismiss: '現在のデザインを保持',
    invalid: 'リンクのスタイルが見つかりません。現在のデザインは保持されます。', dismissError: '閉じる',
    invalidComparison: '比較リンクのスタイルまたは設定が見つかりません。現在のデザインと比較設定は保持されます。',
    linkNote: 'ページリンクにはローカルの編集内容は含まれません。',
    references: '旧リンクのスタイルは比較参照として保持し、先頭のスタイルのみ適用します。別の配色・文字・密度を適用するには比較ツールを使ってください。',
  },
};

export function WorkspaceStatus({ lang }: { lang: Lang }) {
  const workspace = useDesignWorkspace();
  const t = copy[lang];
  const style = getStyleById(workspace.draft.styleId);
  const recovery = workspace.status === 'recovery-needed';
  function downloadRecovery() {
    const raw = workspace.getRecoveryData();
    if (raw === null) return;
    const url = URL.createObjectURL(new Blob([raw], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = 'webstylebook-draft-recovery.json'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
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
    {workspace.status === 'saved' || workspace.status === 'saving' ? <small className="workspace-status__saved">{workspace.status === 'saving' ? t.saving : t.saved} · {t.linkNote}</small> : null}
    {workspace.draft.referencedStyleIds.length > 1 ? <p className="workspace-status__saved">{t.references} <a href={withLang('/pages/compare', lang)}>{workspace.draft.referencedStyleIds.map((id) => localize(getStyleById(id)!.name, lang)).join(' / ')}</a></p> : null}
    {workspace.status === 'memory-only' ? <p className="workspace-status__notice" role="status">{t.local}</p> : null}
    {recovery ? <div className="workspace-status__notice" role="status"><p>{workspace.recoveryReason === 'stale-contract' ? t.stale : t.recovery}</p><button type="button" onClick={downloadRecovery}>{t.download}</button><button type="button" onClick={workspace.resetDraft}>{t.resetAll}</button></div> : null}
    {workspace.status === 'conflict' ? <div className="workspace-status__notice" role="status"><p>{t.conflict}</p><button type="button" onClick={workspace.reloadRemote}>{t.remote}</button><button type="button" onClick={workspace.keepLocal}>{t.keep}</button><button type="button" onClick={downloadRecovery}>{t.download}</button></div> : null}
    {workspace.pendingStyleId ? <div className="workspace-status__notice" role="status"><p>{t.incoming}</p><button type="button" onClick={workspace.confirmStyleSelection}>{t.apply}</button><button type="button" onClick={workspace.dismissStyleSelection}>{t.dismiss}</button></div> : null}
    {workspace.recoveryReason === 'invalid-selection' ? <div className="workspace-status__notice" role="status"><p>{t.invalid}</p><button type="button" onClick={workspace.dismissStyleSelection}>{t.dismissError}</button></div> : null}
    {workspace.recoveryReason === 'invalid-comparison' ? <div className="workspace-status__notice" role="status"><p>{t.invalidComparison}</p><button type="button" onClick={workspace.dismissStyleSelection}>{t.dismissError}</button></div> : null}
  </aside>;
}
