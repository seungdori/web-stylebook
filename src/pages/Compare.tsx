import { useMemo, useState } from 'react';
import type { Lang } from '../data/styles';
import { localize, styleCatalog } from '../data/styles';
import { translate } from '../data/i18n';
import { withLang } from '../utils/language';
import { VisualSpecimen } from '../components/VisualSpecimen';
import { specimenFixtureIds, specimenFixtureNames, getSpecimenCopy } from '../data/visualFixtures';
import { useComparisonLocation, useDesignWorkspace } from '../visual/useDesignWorkspace';
import { getActiveSpecimenFonts, useActiveFonts } from '../visual/useActiveFonts';
import { assessContrast, resolveVisualContract } from '../visual/index';
import { comparisonFieldDiff, resolveAxisComparison } from '../visual/comparison';
import './VisualChoice.css';

const quickPairs = [
  ['neon-drift', 'swiss-poster'], ['quiet-utility', 'kinetic-pop'],
  ['framer-motion', 'zen-minimalism'], ['terminal-core', 'editorial-silence'],
];
const compareText = {
  fontFallback: { en: 'Font availability may affect this preview on your device:', ko: '글꼴 설치와 로딩 상태에 따라 미리보기가 다를 수 있습니다:', ja: 'フォントのインストールや読み込み状況で表示が異なる場合があります：' },
  fontsLoading: { en: 'Loading the selected fonts…', ko: '선택한 글꼴을 불러오는 중…', ja: '選択したフォントを読み込み中…' },
  intro: { en: 'Keep the content fixed, or explore each original composition.', ko: '같은 내용을 비교하거나, 스타일 고유의 원본 구성을 살펴보세요.', ja: '同じ内容で比較したり、各スタイルの元の構成を確認できます。' },
  modes: { en: 'Comparison mode', ko: '비교 방식', ja: '比較方法' },
  original: { en: 'Original examples', ko: '원본 예시', ja: '元の作例' },
  complete: { en: 'Same content', ko: '같은 내용', ja: '同じ内容' },
  axis: { en: 'Change one aspect', ko: '한 요소만 바꾸기', ja: '一つの要素だけ変更' },
  color: { en: 'Colors', ko: '색상', ja: '色' },
  typography: { en: 'Typography', ko: '타이포그래피', ja: 'タイポグラフィ' },
  density: { en: 'Spacing / density', ko: '여백과 밀도', ja: '余白・密度' },
  baseline: { en: 'Current design · A', ko: '현재 디자인 · A', ja: '現在のデザイン · A' },
  alternative: { en: 'Change from · B', ko: '가져올 스타일 · B', ja: '取り入れるスタイル · B' },
  adapted: { en: 'These are adapted specimens using real design values. Content and actions match; each original example retains its complete composition and effects.', ko: '실제 디자인 값을 적용한 비교용 예시입니다. 내용과 행동을 동일하게 유지하며, 전체 구성과 효과는 원본 예시에서 확인할 수 있습니다.', ja: '実際のデザイン値を適用した比較用の例です。内容と操作は共通で、全体の構成や効果は元の作例で確認できます。' },
  isolated: { en: 'A is your current draft. B changes only the chosen aspect; content, viewport and other design values stay fixed.', ko: 'A는 현재 작업 중인 디자인입니다. B는 선택한 요소만 바꾸고 내용, 화면 폭, 나머지 디자인 값은 유지합니다.', ja: 'Aは現在の編集中デザインです。Bは選んだ要素だけを変更し、内容、表示幅、その他のデザイン値は保ちます。' },
  contentLanguage: { en: 'Content language', ko: '예시 언어', ja: '例の言語' },
  fixture: { en: 'Example content', ko: '예시 내용', ja: '例の内容' },
  sharedCopy: { en: 'Edit shared copy', ko: '양쪽 문구 함께 편집', ja: '両方の文章を編集' },
  heading: { en: 'Heading', ko: '제목', ja: '見出し' },
  body: { en: 'Body', ko: '본문', ja: '本文' },
  label: { en: 'Action label', ko: '행동 문구', ja: '操作ラベル' },
  caption: { en: 'Caption', ko: '보조 설명', ja: '補足説明' },
  restoreCopy: { en: 'Restore example copy', ko: '예시 문구로 복원', ja: '例の文章に戻す' },
  apply: { en: 'Use this direction', ko: '이 스타일로 선택', ja: 'このスタイルを選ぶ' },
  applyAxis: { en: 'Apply only this aspect', ko: '이 요소만 적용', ja: 'この要素だけ適用' },
  applied: { en: 'Applied to your working design.', ko: '작업 중인 디자인에 적용했습니다.', ja: '編集中のデザインに適用しました。' },
  undo: { en: 'Undo', ko: '되돌리기', ja: '元に戻す' },
  reset: { en: 'Reset comparison', ko: '비교 초기화', ja: '比較をリセット' },
  fields: { en: 'Changed fields', ko: '변경되는 값', ja: '変更される値' },
  unchanged: { en: 'No value changes for this aspect.', ko: '이 요소에서 달라지는 값이 없습니다.', ja: 'この要素で変わる値はありません。' },
  modeConflict: { en: 'These colors use a different light/dark mode. Choose a source with the same mode, or apply its complete direction first.', ko: '선택한 색상은 현재 디자인과 밝기 모드가 다릅니다. 같은 모드의 스타일을 고르거나, 먼저 해당 스타일 전체를 선택하세요.', ja: '選択した色は現在のデザインと明暗モードが異なります。同じモードのスタイルを選ぶか、先にそのスタイル全体を選択してください。' },
  review: { en: 'Some color pairs need review before applying this combination.', ko: '이 조합을 적용하기 전에 확인이 필요한 색상 쌍이 있습니다.', ja: 'この組み合わせを適用する前に確認が必要な色の組があります。' },
  acknowledge: { en: 'Keep these values for further review in Color System', ko: '이 값을 유지하고 색상 도구에서 추가로 검토하기', ja: '値を保ち、色のツールでさらに確認する' },
  originalLink: { en: 'Open original example', ko: '원본 예시 열기', ja: '元の作例を開く' },
  export: { en: 'Export current design', ko: '현재 디자인 내보내기', ja: '現在のデザインを書き出す' },
  editColors: { en: 'Review colors', ko: '색상 검토', ja: '色を確認' },
  source: { en: 'Source of this aspect', ko: '요소를 가져온 스타일', ja: 'この要素の取得元' },
  layout: { en: 'Preview layout', ko: '미리보기 배치', ja: 'プレビュー配置' },
};

export function Compare({ lang }: { lang: Lang }) {
  useComparisonLocation();
  const workspace = useDesignWorkspace();
  const { draft } = workspace;
  const { left, right, layout, mode, axis } = draft.comparison;
  const [message, setMessage] = useState('');
  const [acknowledgedHash, setAcknowledgedHash] = useState('');
  const text = (key: keyof typeof compareText) => localize(compareText[key], lang);
  const leftStyle = styleCatalog.find((style) => style.id === (mode === 'axis' ? draft.styleId : left))!;
  const rightStyle = styleCatalog.find((style) => style.id === right)!;
  const leftSpec = useMemo(() => leftStyle.id === draft.styleId ? workspace.resolved : resolveVisualContract(leftStyle.id, { contentLocale: draft.contentLocale }), [leftStyle.id, draft.styleId, draft.contentLocale, workspace.resolved]);
  const sourceSpec = useMemo(() => rightStyle.id === draft.styleId ? workspace.resolved : resolveVisualContract(rightStyle.id, { contentLocale: draft.contentLocale }), [rightStyle.id, draft.styleId, draft.contentLocale, workspace.resolved]);
  const rightSpec = useMemo(() => mode === 'axis' ? resolveAxisComparison(leftSpec, sourceSpec, axis) : sourceSpec, [mode, leftSpec, sourceSpec, axis]);
  const fonts = useMemo(() => mode === 'original' ? [] : [...getActiveSpecimenFonts(leftSpec), ...getActiveSpecimenFonts(rightSpec)], [mode, leftSpec, rightSpec]);
  const fontStatus = useActiveFonts(fonts, draft.contentLocale);
  const fallbackFonts = [...new Set(fontStatus.filter((font) => font.status === 'fallback' || font.status === 'error').map((font) => font.family))];
  const fields = useMemo(() => comparisonFieldDiff(leftSpec, rightSpec, axis), [leftSpec, rightSpec, axis]);
  const reviewPairs = useMemo(() => {
    if (mode !== 'axis') return [];
    const baselinePairs = new Map(assessContrast(leftSpec).map((pair) => [pair.id, pair]));
    return assessContrast(rightSpec).filter((pair) => {
      if (pair.status !== 'fail' && pair.status !== 'needs-rendered-review') return false;
      const before = baselinePairs.get(pair.id);
      return axis === 'color' || !before || before.status !== pair.status || before.ratio !== pair.ratio || before.threshold !== pair.threshold;
    });
  }, [mode, axis, leftSpec, rightSpec]);
  const incompatibleMode = mode === 'axis' && axis === 'color' && leftSpec.mode !== sourceSpec.mode;
  const defaultCopy = getSpecimenCopy(draft.fixtureId, draft.contentLocale);
  const copy = Object.fromEntries(Object.entries(draft.previewCopy).filter(([, value]) => value !== ''));
  const acknowledged = acknowledgedHash === rightSpec.contentHash;

  function selectPair(pairLeft: string, pairRight: string) {
    workspace.setComparison({ left: pairLeft, right: pairRight });
    setMessage('');
  }
  function applyDirection(id: string) {
    if (workspace.requestStyleSelection(id)) setMessage(text('applied'));
    else setMessage('');
  }
  function applyAxis() {
    workspace.applyAxis(axis, sourceSpec.styleId);
    setMessage(text('applied'));
  }

  const slot = (side: 'left' | 'right') => {
    const style = side === 'left' ? leftStyle : rightStyle;
    const spec = side === 'left' ? leftSpec : rightSpec;
    return <section className={`compare-slot ${mode !== 'original' ? 'compare-slot--specimen' : ''}`}>
      <div className="compare-slot__head">
        <label>
          {mode === 'axis' ? text(side === 'left' ? 'baseline' : 'alternative') : translate(lang, side === 'left' ? 'compare.left' : 'compare.right')}
          <select aria-label={mode === 'axis' ? text(side === 'left' ? 'baseline' : 'alternative') : translate(lang, side === 'left' ? 'compare.left' : 'compare.right')} value={style.id} disabled={mode === 'axis' && side === 'left'} onChange={(event) => { workspace.setComparison({ [side]: event.target.value }); setMessage(''); }}>
            {styleCatalog.map((item) => <option key={item.id} value={item.id}>{localize(item.name, lang)}</option>)}
          </select>
        </label>
        {mode !== 'axis' ? <button className="button" type="button" onClick={() => applyDirection(style.id)}>{text('apply')}</button> : <strong>{side === 'left' ? 'A' : 'B'}</strong>}
      </div>
      {mode === 'original' ? <>
        <iframe className="compare-frame" src={withLang(`/pages/${style.id}.html`, lang)} title={`${side === 'left' ? 'A' : 'B'} · ${localize(style.name, lang)}`} loading="lazy" />
        <a className="compare-original-link" href={withLang(style.route, lang)}>{text('originalLink')} ↗</a>
      </> : <VisualSpecimen spec={spec} lang={draft.contentLocale} fixtureId={draft.fixtureId} copy={copy} />}
    </section>;
  };

  return <>
    <section className="page-hero compare-intro">
      <h1>{translate(lang, 'compare.title')}</h1>
      <p>{text('intro')}</p>
    </section>
    <section className="compare-setup">
      <div className="home-choice__switches" role="group" aria-label={text('modes')}>
        {(['original', 'complete', 'axis'] as const).map((item) => <button key={item} type="button" aria-pressed={mode === item} className={mode === item ? 'is-active' : ''} onClick={() => { workspace.setComparison({ mode: item }); setMessage(''); }}>{text(item)}</button>)}
      </div>
      {mode === 'axis' ? <div className="home-choice__switches" role="group" aria-label={text('axis')}>
        {(['color', 'typography', 'density'] as const).map((item) => <button key={item} type="button" aria-pressed={axis === item} className={axis === item ? 'is-active' : ''} onClick={() => { workspace.setComparison({ axis: item }); setMessage(''); }}>{text(item)}</button>)}
      </div> : null}
      {mode !== 'original' ? <>
        <p className="visual-choice-note">{text(mode === 'axis' ? 'isolated' : 'adapted')}</p>
        {fontStatus.some((font) => font.status === 'loading') ? <p className="visual-choice-note" role="status">{text('fontsLoading')}</p> : fallbackFonts.length ? <p className="visual-choice-note">{text('fontFallback')} {fallbackFonts.join(', ')}</p> : null}
        <div className="compare-content-controls">
          <label>{text('fixture')}<select aria-label={text('fixture')} value={draft.fixtureId} onChange={(event) => workspace.setFixtureId(event.target.value as typeof draft.fixtureId)}>{specimenFixtureIds.map((id) => <option key={id} value={id}>{localize(specimenFixtureNames[id], lang)}</option>)}</select></label>
          <label>{text('contentLanguage')}<select aria-label={text('contentLanguage')} value={draft.contentLocale} onChange={(event) => workspace.setContentLocale(event.target.value as Lang)}>{(['en', 'ko', 'ja'] as const).map((locale) => <option value={locale} key={locale}>{{ en: 'English', ko: '한국어', ja: '日本語' }[locale]}</option>)}</select></label>
          <details className="compare-copy-editor">
            <summary>{text('sharedCopy')}</summary>
            {(['heading', 'body', 'label', 'caption'] as const).map((key) => <label key={key}>{text(key)}<textarea rows={key === 'body' ? 3 : 1} maxLength={6000} value={draft.previewCopy[key]} placeholder={defaultCopy[key]} onChange={(event) => workspace.setPreviewCopy({ [key]: event.target.value })} /></label>)}
            <button className="button" type="button" onClick={() => workspace.setPreviewCopy({ heading: '', body: '', label: '', caption: '' })}>{text('restoreCopy')}</button>
          </details>
        </div>
      </> : null}
    </section>
    <section className="compare-controls">
      {mode !== 'axis' ? <>
        <div className="quick-pairs">
          <span>{translate(lang, 'compare.quickPairs')}</span>
          {quickPairs.map(([pairLeft, pairRight]) => <button key={`${pairLeft}-${pairRight}`} type="button" onClick={() => selectPair(pairLeft, pairRight)}>{localize(styleCatalog.find((item) => item.id === pairLeft)!.name, lang)} / {localize(styleCatalog.find((item) => item.id === pairRight)!.name, lang)}</button>)}
        </div>
        <button className="button" type="button" onClick={() => selectPair(right, left)}>{translate(lang, 'compare.swap')}</button>
      </> : null}
      <div className="segmented" role="group" aria-label={text('layout')}>
        {(['horizontal', 'vertical'] as const).map((item) => <button key={item} className={layout === item ? 'is-active' : ''} type="button" aria-pressed={layout === item} onClick={() => workspace.setComparison({ layout: item })}>{translate(lang, `compare.${item}`)}</button>)}
      </div>
      <button className="button button--muted" type="button" onClick={() => workspace.setComparison({ left: draft.styleId, right: 'editorial-silence', mode: 'complete', axis: 'color', layout: 'horizontal' })}>{text('reset')}</button>
    </section>
    <section className={`compare-grid compare-grid--${layout} ${mode !== 'original' ? 'compare-grid--specimens' : ''}`}>
      {slot('left')}{slot('right')}
    </section>
    {mode === 'axis' ? <section className="compare-axis-result">
      <p>{text('source')}: <strong>{localize(rightStyle.name, lang)}</strong> · {text(axis)}</p>
      {incompatibleMode ? <p className="compare-warning" role="alert">{text('modeConflict')}</p> : null}
      {reviewPairs.length > 0 ? <div className="compare-warning">
        <p>{text('review')}</p>
        <ul>{reviewPairs.map((pair) => <li key={pair.id}>{pair.foreground} / {pair.background}{pair.ratio !== null ? ` · ${pair.ratio.toFixed(2)}:1` : ''}</li>)}</ul>
        <label><input type="checkbox" checked={acknowledged} onChange={(event) => setAcknowledgedHash(event.target.checked ? rightSpec.contentHash : '')} /> {text('acknowledge')}</label>
      </div> : null}
      <details className="compare-field-diff">
        <summary>{text('fields')} · {fields.length}</summary>
        {fields.length ? <dl>{fields.map((field) => <div key={field.path}><dt>{field.path}</dt><dd><code>{JSON.stringify(field.before)}</code><span aria-hidden="true"> → </span><code>{JSON.stringify(field.after)}</code></dd></div>)}</dl> : <p>{text('unchanged')}</p>}
      </details>
      <button className="button button--dark" type="button" disabled={incompatibleMode || fields.length === 0 || (reviewPairs.length > 0 && !acknowledged)} onClick={applyAxis}>{text('applyAxis')}</button>
    </section> : null}
    <div className="compare-continuation">
      <p role="status">{message}</p>
      {workspace.canUndo ? <button className="button" type="button" onClick={() => { workspace.undo(); setMessage(''); }}>{text('undo')}</button> : null}
      <a className="button" href={withLang('/pages/color-system', lang)}>{text('editColors')}</a>
      <a className="button button--dark" href={withLang('/pages/prompt-workflow', lang)}>{text('export')}</a>
    </div>
  </>;
}
