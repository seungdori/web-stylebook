import { useCallback, useMemo, useState } from 'react';
import type { Lang, StyleData } from '../data/styles';
import { fusionStyles, localize, styleCatalog, styles, styleTags } from '../data/styles';
import { translate } from '../data/i18n';
import { StyleCard } from '../components/StyleCard';
import { withLang } from '../utils/language';
import { productArchetypes } from '../catalog/products';
import { useDesignWorkspace } from '../visual/useDesignWorkspace';
import { getActiveSpecimenFonts, useActiveFonts } from '../visual/useActiveFonts';
import { VisualSpecimen } from '../components/VisualSpecimen';
import './VisualChoice.css';

const homeText = {
  fontFallback: { en: 'Font availability may affect this preview on your device:', ko: '글꼴 설치와 로딩 상태에 따라 미리보기가 다를 수 있습니다:', ja: 'フォントのインストールや読み込み状況で表示が異なる場合があります：' },
  fontsLoading: { en: 'Loading the selected fonts…', ko: '선택한 글꼴을 불러오는 중…', ja: '選択したフォントを読み込み中…' },
  previewSize: { en: 'Preview size', ko: '미리보기 크기', ja: 'プレビューサイズ' },
  overview: { en: 'Overview', ko: '전체 보기', ja: '全体表示' },
  actualSize: { en: 'Actual size', ko: '실제 크기', ja: '実際のサイズ' },
  title: { en: 'One example. Different design choices.', ko: '같은 내용으로, 디자인의 차이를 보세요.', ja: '同じ内容で、デザインの違いを見る。' },
  lead: { en: 'Choose a style, adjust its details, and take the result into your project.', ko: '스타일을 고르고 세부를 조정한 뒤, 내 프로젝트로 가져가세요.', ja: 'スタイルを選び、細部を調整して、自分のプロジェクトに持ち込みましょう。' },
  candidates: { en: 'Try a direction', ko: '스타일 바꿔 보기', ja: 'スタイルを切り替える' },
  chosen: { en: 'Working design', ko: '작업 중인 디자인', ja: '編集中のデザイン' },
  compare: { en: 'Compare', ko: '비교하기', ja: '比較する' },
  adjust: { en: 'Adjust colors', ko: '색상 조정', ja: '色を調整' },
  export: { en: 'Export this design', ko: '이 디자인 내보내기', ja: 'このデザインを書き出す' },
  undo: { en: 'Undo selection', ko: '선택 되돌리기', ja: '選択を元に戻す' },
  adapted: { en: 'An adapted specimen using your current design values. Open the original example for its full composition and effects.', ko: '현재 디자인 값을 적용한 비교용 예시입니다. 전체 구성과 효과는 원본 예시에서 확인하세요.', ja: '現在のデザイン値を適用した比較用の例です。全体の構成や効果は元の作例で確認できます。' },
  original: { en: 'Original example', ko: '원본 예시', ja: '元の作例' },
  purpose: { en: 'What are you making?', ko: '어떤 화면을 만드나요?', ja: 'どんな画面を作りますか？' },
  all: { en: 'Browse freely', ko: '자유롭게 둘러보기', ja: '自由に探す' },
  shortlist: { en: 'A starting shortlist', ko: '먼저 살펴볼 스타일', ja: '最初に見る候補' },
  caution: { en: 'Less suited to this purpose:', ko: '이 목적에는 덜 적합한 스타일:', ja: 'この目的には向きにくいスタイル：' },
  editorial: { en: 'Curated', ko: '추천순', ja: 'おすすめ順' },
  tags: { en: 'Style tags', ko: '스타일 태그', ja: 'スタイルのタグ' },
  utilities: { en: 'Design tools and guides', ko: '디자인 도구와 가이드', ja: 'デザインツールとガイド' },
};
const demoStyles = ['editorial-silence', 'brutalist-grid', 'quiet-utility'];
const purposeIds = ['operational-saas', 'content-editorial', 'campaign', 'commerce'] as const;
const purposeLabels: Record<string, { en: string; ko: string; ja: string }> = {
  'operational-saas': { en: 'Everyday tools', ko: '매일 쓰는 도구', ja: '毎日使うツール' },
  'content-editorial': { en: 'Reading & stories', ko: '읽기와 콘텐츠', ja: '読みもの・記事' },
  campaign: { en: 'Product presentation', ko: '제품 소개', ja: '製品紹介' },
  commerce: { en: 'Shopping', ko: '쇼핑', ja: 'ショッピング' },
};

type SortKey = 'popular' | 'latest' | 'name';
type SortDirection = 'asc' | 'desc';

const popularStyleIds = [
  'runtime-signal',
  'platform-core',
  'brutalist-grid',
  'editorial-silence',
  'kinetic-pop',
  'mono-type',
  'console-launch',
  'terminal-core',
  'quiet-utility',
  'swiss-poster',
  'holographic-fluid',
  'duotone-bold',
  'framer-motion',
  'neumorphism',
];

const popularFusionIds = [
  'fusion-product-swiss',
  'fusion-kinetic-brutal',
  'fusion-editorial-terminal',
];

const lowPriorityStyleIds = ['paper-cut'];
const lowPriorityFusionIds = ['fusion-clay-aurora', 'fusion-grain-mono'];

const popularStyleRank = new Map(popularStyleIds.map((id, index) => [id, index]));
const popularFusionRank = new Map(popularFusionIds.map((id, index) => [id, index]));
const catalogOrder = new Map(styleCatalog.map((style, index) => [style.id, index]));

const catalogRank = (style: StyleData) => catalogOrder.get(style.id) ?? -1;
const createdAtTime = (style: StyleData) => Date.parse(style.createdAt);

const compareLatestDesc = (a: StyleData, b: StyleData) => {
  return createdAtTime(b) - createdAtTime(a) || catalogRank(b) - catalogRank(a);
};

const compareLatestAsc = (a: StyleData, b: StyleData) => {
  return createdAtTime(a) - createdAtTime(b) || catalogRank(a) - catalogRank(b);
};

const popularGroup = (style: StyleData) => {
  const popularRank = style.kind === 'fusion' ? popularFusionRank : popularStyleRank;
  const lowPriorityIds = style.kind === 'fusion' ? lowPriorityFusionIds : lowPriorityStyleIds;
  const rank = popularRank.get(style.id);
  const lowPriorityRank = lowPriorityIds.indexOf(style.id);

  if (rank !== undefined) return { group: 0, rank };
  if (lowPriorityRank !== -1) return { group: 2, rank: lowPriorityRank };

  return { group: 1, rank: 0 };
};

const comparePopular = (a: StyleData, b: StyleData) => {
  const aGroup = popularGroup(a);
  const bGroup = popularGroup(b);

  if (aGroup.group !== bGroup.group) return aGroup.group - bGroup.group;
  if (aGroup.group === 0 || aGroup.group === 2) return aGroup.rank - bGroup.rank;

  return compareLatestDesc(a, b);
};

const resultLabel = (lang: Lang, count: number) => {
  if (lang === 'ko') return `${count}개 결과`;
  if (lang === 'ja') return `${count}件`;
  return `${count} results`;
};

export function Home({ lang }: { lang: Lang }) {
  const workspace = useDesignWorkspace();
  const [previewScale, setPreviewScale] = useState<'fit' | 'actual'>('fit');
  const { query, tag, sort: sortKey, direction: sortDirection, purpose } = workspace.draft.discovery;
  const setQuery = (value: string) => workspace.setDiscovery({ query: value });
  const setTag = (value: string) => workspace.setDiscovery({ tag: value });
  const setSortKey = (value: SortKey) => workspace.setDiscovery({ sort: value });
  const setSortDirection = (value: SortDirection) => workspace.setDiscovery({ direction: value });
  const currentStyle = styleCatalog.find((style) => style.id === workspace.draft.styleId)!;
  const candidates = demoStyles.includes(currentStyle.id) ? demoStyles : [...demoStyles, currentStyle.id];
  const activePurpose = productArchetypes.find((item) => item.id === purpose && purposeIds.some((id) => id === item.id));
  const fontStatus = useActiveFonts(getActiveSpecimenFonts(workspace.resolved), workspace.draft.contentLocale);
  const fallbackFonts = [...new Set(fontStatus.filter((font) => font.status === 'fallback' || font.status === 'error').map((font) => font.family))];
  const text = (key: keyof typeof homeText) => localize(homeText[key], lang);

  const filterAndSort = useCallback((items: StyleData[]) => {
    const value = query.trim().toLowerCase();
    const filtered = items.filter((style) => {
      const text = `${localize(style.name, lang)} ${localize(style.description, lang)} ${style.tags.join(' ')}`.toLowerCase();
      const matchesTag = tag === 'all' || style.tags.includes(tag);
      return matchesTag && (!value || text.includes(value));
    });

    return [...filtered].sort((a, b) => {
      if (sortKey === 'popular') {
        return comparePopular(a, b);
      }

      if (sortKey === 'latest') {
        return sortDirection === 'desc' ? compareLatestDesc(a, b) : compareLatestAsc(a, b);
      }

      if (sortKey === 'name') {
        const result = localize(a.name, lang).localeCompare(localize(b.name, lang), lang);
        return sortDirection === 'asc' ? result : -result;
      }

      return 0;
    });
  }, [lang, query, sortDirection, sortKey, tag]);

  const filteredStyles = useMemo(() => {
    return filterAndSort(styles);
  }, [filterAndSort]);

  const filteredFusions = useMemo(() => {
    return filterAndSort(fusionStyles);
  }, [filterAndSort]);

  const resultCount = filteredStyles.length + filteredFusions.length;
  const hasCustomControls = query.trim() !== '' || tag !== 'all' || purpose !== 'all' || sortKey !== 'popular' || sortDirection !== 'desc';

  const resetControls = () => {
    setQuery('');
    setTag('all');
    setSortKey('popular');
    setSortDirection('desc');
    workspace.setDiscovery({ purpose: 'all' });
  };

  const selectSort = (sort: SortKey) => {
    if (sort === 'popular') {
      setSortKey('popular');
      setSortDirection('desc');
      return;
    }

    if (sortKey === sort) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      return;
    }

    setSortKey(sort);
    setSortDirection(sort === 'latest' ? 'desc' : 'asc');
  };

  return (
    <>
      <section className="home-choice" aria-labelledby="home-choice-title">
        <div className="home-choice__intro">
          <h1 id="home-choice-title">{text('title')}</h1>
          <p>{text('lead')}</p>
        </div>
        <div className="home-choice__switches" role="group" aria-label={text('candidates')}>
          {candidates.map((id) => {
            const style = styleCatalog.find((item) => item.id === id)!;
            return <button key={id} type="button" aria-pressed={id === currentStyle.id} className={id === currentStyle.id ? 'is-active' : ''} onClick={() => { if (id !== currentStyle.id) workspace.requestStyleSelection(id); }}>{localize(style.name, lang)}</button>;
          })}
        </div>
        <div className="home-choice__preview-bar">
          <span>{text('previewSize')}</span>
          <div role="group" aria-label={text('previewSize')}>
            <button type="button" aria-pressed={previewScale === 'fit'} onClick={() => setPreviewScale('fit')}>{text('overview')} <span className="home-choice__desktop-scale">60%</span><span className="home-choice__mobile-scale">100%</span></button>
            <button type="button" aria-pressed={previewScale === 'actual'} onClick={() => setPreviewScale('actual')}>{text('actualSize')} 100%</button>
          </div>
        </div>
        <div className={`home-choice__preview home-choice__preview--${previewScale}`}><VisualSpecimen spec={workspace.resolved} lang={workspace.draft.contentLocale} fixtureId="product" copy={workspace.draft.previewCopy} compact /></div>
        {fontStatus.some((font) => font.status === 'loading') ? <p className="visual-choice-note" role="status">{text('fontsLoading')}</p> : fallbackFonts.length ? <p className="visual-choice-note">{text('fontFallback')} {fallbackFonts.join(', ')}</p> : null}
        <div className="home-choice__selection">
          <p><span>{text('chosen')}</span> <strong>{localize(currentStyle.name, lang)}</strong></p>
          <div className="home-choice__actions">
            <a className="button" href={withLang('/pages/compare', lang, { left: currentStyle.id, mode: 'complete' })}>{text('compare')}</a>
            <a className="button" href={withLang('/pages/color-system', lang)}>{text('adjust')}</a>
            <a className="button button--dark" href={withLang('/pages/prompt-workflow', lang)}>{text('export')}</a>
            {workspace.canUndo ? <button className="button button--muted" type="button" onClick={workspace.undo}>{text('undo')}</button> : null}
          </div>
        </div>
        <p className="visual-choice-note">{text('adapted')} <a href={withLang(currentStyle.route, lang)}>{text('original')} ↗</a></p>
      </section>

      <section className="purpose-discovery" aria-labelledby="purpose-title">
        <h2 id="purpose-title">{text('purpose')}</h2>
        <div className="home-choice__switches" role="group" aria-label={text('purpose')}>
          <button type="button" aria-pressed={!activePurpose} className={!activePurpose ? 'is-active' : ''} onClick={() => workspace.setDiscovery({ purpose: 'all' })}>{text('all')}</button>
          {purposeIds.map((id) => <button type="button" key={id} aria-pressed={purpose === id} className={purpose === id ? 'is-active' : ''} onClick={() => workspace.setDiscovery({ purpose: id })}>{localize(purposeLabels[id], lang)}</button>)}
        </div>
        {activePurpose ? <div className="purpose-discovery__results">
          <h3>{text('shortlist')}</h3>
          <p>{localize(activePurpose.description, lang)}</p>
          <div className="purpose-discovery__shortlist">
            {activePurpose.recommendedPrimaryStyleIds.map((id) => {
              const style = styleCatalog.find((item) => item.id === id);
              return style ? <button key={id} type="button" aria-pressed={currentStyle.id === id} onClick={() => { if (id !== currentStyle.id) workspace.requestStyleSelection(id); document.getElementById('home-choice-title')?.scrollIntoView({ block: 'start' }); }}><strong>{localize(style.name, lang)}</strong><span>{localize(style.description, lang)}</span></button> : null;
            })}
          </div>
          <p className="visual-choice-note">{text('caution')} {activePurpose.avoidStyleIds.map((id) => localize(styleCatalog.find((style) => style.id === id)?.name ?? { en: id, ko: id, ja: id }, lang)).join(', ')}.</p>
          <a href="#styles">{text('all')} · {styleCatalog.length}</a>
        </div> : null}
      </section>

      <section className="utility-strip" aria-label={text('utilities')}>
        <a href={withLang('/pages/reference-explorer', lang)}>{translate(lang, 'nav.references')}</a>
        <a href={withLang('/pages/pro-kit', lang)}>{translate(lang, 'nav.proKit')}</a>
        <a href={withLang('/pages/prompt-workflow', lang)}>{translate(lang, 'nav.workflow')}</a>
        <a href={withLang('/pages/component-glossary', lang)}>{translate(lang, 'nav.glossary')}</a>
        <a href={withLang('/pages/animation-lab', lang)}>{translate(lang, 'nav.animation')}</a>
        <a href={withLang('/pages/compare', lang)}>{translate(lang, 'nav.compare')}</a>
        <a href={withLang('/pages/color-system', lang)}>{translate(lang, 'nav.colors')}</a>
      </section>

      <section className="section" id="styles">
        <div className="section__head section__head--controls">
          <div className="section__title-block">
            <h2>{translate(lang, 'home.styles')}</h2>
            <span className="filter-summary" aria-live="polite">
              {resultLabel(lang, resultCount)}
            </span>
          </div>
          <div className="filters">
            <div className="filter-toolbar">
              <label className="search-field">
                <span className="sr-only">{translate(lang, 'home.search')}</span>
                <input
                  value={query}
                  type="search"
                  placeholder={translate(lang, 'home.search')}
                  aria-label={translate(lang, 'home.search')}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              <div className="sort-control" role="group" aria-label={translate(lang, 'home.sort')}>
                <span className="sort-control__label">{translate(lang, 'home.sort')}</span>
                {(['popular', 'latest', 'name'] as const).map((sort) => {
                  const nextDirection = sortKey === sort ? sortDirection : sort === 'latest' ? 'desc' : 'asc';

                  return (
                    <button
                      aria-label={sort === 'popular' ? text('editorial') : `${translate(lang, `home.sort.${sort}`)} ${translate(lang, `home.sort.${nextDirection}`)}`}
                      aria-pressed={sortKey === sort}
                      className={sortKey === sort ? 'is-active' : ''}
                      key={sort}
                      type="button"
                      onClick={() => selectSort(sort)}
                    >
                      {(sort === 'popular' ? text('editorial') : translate(lang, `home.sort.${sort}`))}
                      {sortKey === sort && sort !== 'popular' ? <span className="sort-direction" aria-hidden="true">{sortDirection === 'asc' ? '↑' : '↓'}</span> : null}
                    </button>
                  );
                })}
              </div>
              <button className="button button--muted filter-reset" type="button" onClick={resetControls} disabled={!hasCustomControls}>
                {translate(lang, 'home.reset')}
              </button>
            </div>
            <div className="filter-chips" role="group" aria-label={text('tags')}>
              <button className={tag === 'all' ? 'is-active' : ''} aria-pressed={tag === 'all'} type="button" onClick={() => setTag('all')}>
                {translate(lang, 'home.all')}
              </button>
              {styleTags.map((item) => (
                <button className={tag === item ? 'is-active' : ''} aria-pressed={tag === item} key={item} type="button" onClick={() => setTag(item)}>
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="style-grid">
          {filteredStyles.map((style) => (
            <StyleCard key={style.id} style={style} lang={lang} />
          ))}
        </div>
        {filteredStyles.length === 0 ? <p className="empty-state">{translate(lang, 'home.noResults')}</p> : null}
      </section>

      <section className="section" id="fusion">
        <div className="section__head">
          <h2>{translate(lang, 'home.fusions')}</h2>
        </div>
        <div className="style-grid">
          {filteredFusions.map((style) => (
            <StyleCard key={style.id} style={style} lang={lang} />
          ))}
        </div>
        {filteredFusions.length === 0 ? <p className="empty-state">{translate(lang, 'home.noResults')}</p> : null}
      </section>

      <section className="workflow-callout">
        <div>
          <h2>{translate(lang, 'home.workflow.title')}</h2>
          <p>{translate(lang, 'home.workflow.desc')}</p>
        </div>
        <a className="button button--dark" href={withLang('/pages/prompt-workflow', lang)}>
          {translate(lang, 'home.workflow.cta')}
        </a>
      </section>
    </>
  );
}
