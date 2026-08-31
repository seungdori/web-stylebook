import { useEffect, useMemo, useRef, useState } from 'react';
import referenceLibraryMeta from '../catalog/references.generated.meta.json';
import {
  REFERENCE_CATEGORIES,
  type DesignReference,
  type DesignReferenceLibrary,
  type ReferenceCategory,
} from '../catalog/types';
import type { Lang, LocalizedText } from '../data/styles';
import { localize } from '../data/styles';
import './ReferenceExplorer.css';

type CategoryFilter = 'all' | ReferenceCategory;

const t = (en: string, ko: string, ja: string): LocalizedText => ({ en, ko, ja });

const copy = {
  eyebrow: t('Field index / shipped interfaces', '필드 인덱스 / 실제 출시 화면', 'フィールド索引 / 実際に公開された画面'),
  title: t('Study what real products actually shipped.', '실제로 출시된 디자인을 관찰하세요.', '実際に公開されたデザインを観察する。'),
  intro: t(
    'A searchable collection of measured color, type, spacing, layout, and motion signals from real websites. No screenshots or brand assets are mirrored here.',
    '실제 웹사이트에서 측정한 색·글자·간격·레이아웃·모션 신호를 검색할 수 있습니다. 스크린샷이나 브랜드 자산은 복제하지 않습니다.',
    '実在するWebサイトから計測した色、文字、余白、レイアウト、モーションの信号を検索できます。スクリーンショットやブランド資産は複製しません。',
  ),
  sourceCount: t('references passing automated quality gates', '자동 품질 게이트를 통과한 레퍼런스', '自動品質ゲートを通過した参照'),
  sourceScope: t('High-completeness full packs only', '완성도 높은 full pack만 수록', '完成度の高いfull packのみ収録'),
  searchLabel: t('Search the field index', '필드 인덱스 검색', 'フィールド索引を検索'),
  searchPlaceholder: t(
    'Search a product, layout, palette, motion, or tag…',
    '제품, 레이아웃, 팔레트, 모션, 태그 검색…',
    '製品、レイアウト、配色、モーション、タグを検索…',
  ),
  categoryLabel: t('Filter by reference family', '레퍼런스 계열 필터', '参照ファミリーで絞り込む'),
  all: t('All references', '전체 레퍼런스', 'すべての参照'),
  results: t('references in view', '개 레퍼런스 표시', '件の参照を表示'),
  clear: t('Clear filters', '필터 초기화', '条件を解除'),
  noResults: t('No reference matches this view.', '이 조건에 맞는 레퍼런스가 없습니다.', 'この条件に合う参照はありません。'),
  noResultsBody: t(
    'Try a broader term or return to the complete index.',
    '검색 범위를 넓히거나 전체 인덱스로 돌아가세요.',
    '検索範囲を広げるか、全索引に戻ってください。',
  ),
  inspect: t('Inspect signals', '디자인 신호 보기', 'デザイン信号を見る'),
  palette: t('Palette', '팔레트', 'パレット'),
  layout: t('Layout', '레이아웃', 'レイアウト'),
  interaction: t('Interaction', '상호작용', 'インタラクション'),
  motion: t('Motion', '모션', 'モーション'),
  measuredTokens: t('Measured tokens', '측정 토큰', '計測トークン'),
  type: t('Type', '서체', '書体'),
  grid: t('Grid', '그리드', 'グリッド'),
  radius: t('Radius', '모서리', '角丸'),
  timing: t('Timing', '시간', '時間'),
  sourceSite: t('Open original site', '원본 사이트 열기', '元サイトを開く'),
  sourceSpec: t('Open measured spec', '측정 스펙 열기', '計測仕様を開く'),
  observed: t('Observed', '관찰일', '観察日'),
  completeness: t('spec completeness', '스펙 완성도', '仕様完成度'),
  loadMore: t('Load more references', '레퍼런스 더 보기', '参照をさらに表示'),
  remaining: t('remaining', '개 남음', '件残り'),
  attributionTitle: t('Source & rights', '출처와 권리', '出典と権利'),
  collectionMethod: t(
    'The index keeps normalized observations and measured tokens only. It excludes source screenshots, logos, fonts, and copy.',
    '이 인덱스는 정규화된 관찰 내용과 측정 토큰만 보관하며 원본 스크린샷·로고·서체·카피는 포함하지 않습니다.',
    'この索引は正規化した観察内容と計測トークンのみを保持し、元のスクリーンショット、ロゴ、書体、コピーは含みません。',
  ),
  loading: t('Loading the measured reference index…', '측정된 레퍼런스 인덱스를 불러오는 중…', '計測済み参照索引を読み込み中…'),
  loadError: t('The reference index could not be loaded.', '레퍼런스 인덱스를 불러오지 못했습니다.', '参照索引を読み込めませんでした。'),
  retry: t('Retry', '다시 시도', '再試行'),
};

const categoryLabels: Record<ReferenceCategory, LocalizedText> = {
  product: t('Product', '프로덕트', 'プロダクト'),
  technology: t('Technology', '테크·도구', 'テクノロジー'),
  editorial: t('Editorial', '에디토리얼', 'エディトリアル'),
  commerce: t('Commerce', '커머스', 'コマース'),
  portfolio: t('Portfolio', '포트폴리오', 'ポートフォリオ'),
  studio: t('Studio', '스튜디오', 'スタジオ'),
  culture: t('Culture', '문화·예술', '文化・芸術'),
  experimental: t('Experimental', '실험적', '実験'),
};

const categoryColors: Record<ReferenceCategory, string> = {
  product: '#2557d6',
  technology: '#111827',
  editorial: '#9a3412',
  commerce: '#047857',
  portfolio: '#7c3aed',
  studio: '#c026d3',
  culture: '#b45309',
  experimental: '#e11d48',
};

const PAGE_SIZE = 36;
const EMPTY_REFERENCES: DesignReference[] = [];

function searchableText(reference: DesignReference): string {
  const analysis = reference.analysis;
  return [
    reference.title,
    reference.url,
    reference.category,
    ...reference.tags,
    ...Object.values(analysis).flatMap((value) => [value.en, value.ko, value.ja]),
    reference.tokens.typography.display,
    reference.tokens.typography.body,
    reference.tokens.layout.skeleton,
    reference.tokens.motion.easing,
  ].filter(Boolean).join(' ').normalize('NFKC').toLocaleLowerCase();
}

function queryRank(reference: DesignReference, query: string): number {
  if (!query) return 0;
  const title = reference.title.normalize('NFKC').toLocaleLowerCase();
  const url = reference.url.toLocaleLowerCase();
  const tags = reference.tags.join(' ').toLocaleLowerCase();
  if (title === query) return 100;
  if (title.startsWith(query)) return 70;
  if (title.includes(query)) return 50;
  if (url.includes(query)) return 30;
  if (tags.includes(query)) return 20;
  return 0;
}

function interleaveCategories(references: DesignReference[]): DesignReference[] {
  const queues = new Map(REFERENCE_CATEGORIES.map((category) => [
    category,
    references.filter((reference) => reference.category === category),
  ]));
  const result: DesignReference[] = [];
  let added = true;
  while (added) {
    added = false;
    for (const category of REFERENCE_CATEGORIES) {
      const next = queues.get(category)?.shift();
      if (next) {
        result.push(next);
        added = true;
      }
    }
  }
  return result;
}

function safeColor(value: string | null, fallback: string): string {
  if (!value) return fallback;
  if (/^(#[0-9a-f]{3,8}|rgba?\(|hsla?\(|oklch\(|oklab\(|color\()/i.test(value)) return value;
  return fallback;
}

function paletteOf(reference: DesignReference): string[] {
  const colors = reference.tokens.colors;
  return [...new Set([
    safeColor(colors.background, '#f4f4f5'),
    safeColor(colors.backgroundSoft, '#e4e4e7'),
    safeColor(colors.ink, '#18181b'),
    safeColor(colors.muted, '#71717a'),
    safeColor(colors.accent, categoryColors[reference.category]),
  ])];
}

function dateLabel(value: string, lang: Lang): string {
  const locale = lang === 'ko' ? 'ko-KR' : lang === 'ja' ? 'ja-JP' : 'en-US';
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(value));
}

function tokenFacts(reference: DesignReference, lang: Lang) {
  const tokens = reference.tokens;
  const display = tokens.typography.display ?? tokens.typography.body ?? '—';
  const grid = tokens.layout.columns
    ? `${tokens.layout.columns} col · ${tokens.layout.gutter ?? '—'}px`
    : tokens.spacing.base ? `${tokens.spacing.base}px base` : '—';
  const radius = tokens.surfaces.radiusMedium === null ? '—' : `${tokens.surfaces.radiusMedium}px`;
  const timingValue = tokens.motion.small ?? tokens.motion.micro ?? tokens.motion.medium;
  const timing = timingValue === null ? '—' : `${timingValue}ms`;
  return [
    [localize(copy.type, lang), display],
    [localize(copy.grid, lang), grid],
    [localize(copy.radius, lang), radius],
    [localize(copy.timing, lang), timing],
  ];
}

export function ReferenceExplorer({ lang }: { lang: Lang }) {
  const [referenceLibrary, setReferenceLibrary] = useState<DesignReferenceLibrary | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const searchRef = useRef<HTMLInputElement>(null);
  const normalizedQuery = query.trim().normalize('NFKC').toLocaleLowerCase(lang);
  const designReferences = referenceLibrary?.references ?? EMPTY_REFERENCES;

  useEffect(() => {
    const controller = new AbortController();
    fetch('/reference-library.v1.json', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`reference library ${response.status}`);
        return response.json() as Promise<DesignReferenceLibrary>;
      })
      .then((payload) => {
        if (payload.schema !== 'webstylebook.reference-library.v1') throw new Error('reference library schema mismatch');
        setReferenceLibrary(payload);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setLoadError(true);
      });
    return () => controller.abort();
  }, [loadAttempt]);

  const categoryCounts = useMemo(() => Object.fromEntries(
    REFERENCE_CATEGORIES.map((item) => [item, designReferences.filter((reference) => reference.category === item).length]),
  ) as Record<ReferenceCategory, number>, [designReferences]);

  const filtered = useMemo(() => {
    const matches = designReferences.filter((reference) => {
      const categoryMatches = category === 'all' || reference.category === category;
      return categoryMatches && (!normalizedQuery || searchableText(reference).includes(normalizedQuery));
    });
    if (!normalizedQuery && category === 'all') return interleaveCategories(matches);
    return matches
      .map((reference, index) => ({ reference, index, rank: queryRank(reference, normalizedQuery) }))
      .sort((a, b) => b.rank - a.rank || a.index - b.index)
      .map(({ reference }) => reference);
  }, [category, designReferences, normalizedQuery]);

  const visible = filtered.slice(0, visibleCount);
  const remaining = Math.max(0, filtered.length - visible.length);

  const selectCategory = (next: CategoryFilter) => {
    setCategory(next);
    setVisibleCount(PAGE_SIZE);
  };

  const clearFilters = () => {
    setQuery('');
    setCategory('all');
    setVisibleCount(PAGE_SIZE);
    searchRef.current?.focus();
  };

  const retryLoad = () => {
    setLoadError(false);
    setReferenceLibrary(null);
    setLoadAttempt((attempt) => attempt + 1);
  };

  return (
    <div className="reference-explorer">
      <header className="reference-explorer__hero">
        <div className="reference-explorer__hero-copy">
          <p className="hero__eyebrow">{localize(copy.eyebrow, lang)}</p>
          <h1>{localize(copy.title, lang)}</h1>
          <p>{localize(copy.intro, lang)}</p>
        </div>
        <div className="reference-spectrum" aria-label={localize(copy.categoryLabel, lang)}>
          <div className="reference-spectrum__head">
            <span>{localize(copy.sourceScope, lang)}</span>
            <strong>{referenceLibraryMeta.referenceCount}</strong>
            <small>{localize(copy.sourceCount, lang)}</small>
          </div>
          <div className="reference-spectrum__rail" aria-hidden="true">
            {REFERENCE_CATEGORIES.map((item) => (
              <span
                key={item}
                style={{
                  background: categoryColors[item],
                  flexGrow: Math.max(categoryCounts[item], 1),
                }}
              />
            ))}
          </div>
          <ol>
            {REFERENCE_CATEGORIES.map((item) => (
              <li key={item}>
                <i style={{ background: categoryColors[item] }} />
                <span>{localize(categoryLabels[item], lang)}</span>
                <strong>{categoryCounts[item]}</strong>
              </li>
            ))}
          </ol>
        </div>
      </header>

      <section className="reference-controls" aria-label={localize(copy.categoryLabel, lang)}>
        <label className="reference-search">
          <span>{localize(copy.searchLabel, lang)}</span>
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder={localize(copy.searchPlaceholder, lang)}
          />
        </label>
        <div className="reference-filters">
          <span>{localize(copy.categoryLabel, lang)}</span>
          <div>
            <button type="button" aria-pressed={category === 'all'} onClick={() => selectCategory('all')}>
              {localize(copy.all, lang)} <b>{referenceLibraryMeta.referenceCount}</b>
            </button>
            {REFERENCE_CATEGORIES.map((item) => (
              <button key={item} type="button" aria-pressed={category === item} onClick={() => selectCategory(item)}>
                {localize(categoryLabels[item], lang)} <b>{categoryCounts[item]}</b>
              </button>
            ))}
          </div>
        </div>
        <div className="reference-controls__status">
          <p role="status" aria-live="polite"><strong>{filtered.length}</strong> {localize(copy.results, lang)}</p>
          {(query || category !== 'all') ? <button type="button" onClick={clearFilters}>{localize(copy.clear, lang)}</button> : null}
        </div>
      </section>

      {!referenceLibrary && !loadError ? (
        <section className="reference-loading" role="status">
          <span aria-hidden="true" />
          <p>{localize(copy.loading, lang)}</p>
        </section>
      ) : loadError ? (
        <section className="reference-empty" role="alert">
          <h2>{localize(copy.loadError, lang)}</h2>
          <button type="button" onClick={retryLoad}>{localize(copy.retry, lang)}</button>
        </section>
      ) : visible.length ? (
        <ol className="reference-grid">
          {visible.map((reference, index) => {
            const colors = paletteOf(reference);
            const headingId = `reference-${reference.id}-heading`;
            return (
              <li key={reference.id} id={reference.id}>
                <article className="reference-card" aria-labelledby={headingId}>
                  <div className="reference-card__palette" aria-label={localize(copy.palette, lang)}>
                    {colors.map((color, colorIndex) => <span key={`${color}-${colorIndex}`} style={{ background: color }} />)}
                  </div>
                  <div className="reference-card__head">
                    <span>{String(index + 1).padStart(3, '0')}</span>
                    <div>
                      <p>{localize(categoryLabels[reference.category], lang)}</p>
                      <h2 id={headingId}>{reference.title}</h2>
                    </div>
                    <b>{Math.round(reference.specCompleteness * 100)}%</b>
                  </div>
                  <p className="reference-card__note">{localize(reference.analysis.notes, lang)}</p>
                  <ul className="reference-card__facts" aria-label={localize(copy.measuredTokens, lang)}>
                    {tokenFacts(reference, lang).map(([label, value]) => (
                      <li key={label}><span>{label}</span><strong>{value}</strong></li>
                    ))}
                  </ul>
                  <details className="reference-card__details" name="reference-library">
                    <summary>{localize(copy.inspect, lang)}</summary>
                    <dl>
                      {(['palette', 'layout', 'interaction', 'motion'] as const).map((key) => (
                        <div key={key}>
                          <dt>{localize(copy[key], lang)}</dt>
                          <dd>{localize(reference.analysis[key], lang)}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="reference-card__meta">
                      <span>{localize(copy.observed, lang)} · {dateLabel(reference.observedAt, lang)}</span>
                      <span>{Math.round(reference.specCompleteness * 100)}% {localize(copy.completeness, lang)}</span>
                    </div>
                    <div className="reference-card__actions">
                      <a href={reference.url} target="_blank" rel="noreferrer">{localize(copy.sourceSite, lang)} ↗</a>
                      <a href={reference.sourceSpecUrl} target="_blank" rel="noreferrer">{localize(copy.sourceSpec, lang)} ↗</a>
                    </div>
                  </details>
                </article>
              </li>
            );
          })}
        </ol>
      ) : (
        <section className="reference-empty" role="status">
          <h2>{localize(copy.noResults, lang)}</h2>
          <p>{localize(copy.noResultsBody, lang)}</p>
          <button type="button" onClick={clearFilters}>{localize(copy.clear, lang)}</button>
        </section>
      )}

      {remaining > 0 ? (
        <div className="reference-load-more">
          <button type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
            {localize(copy.loadMore, lang)}
            <span>{remaining} {localize(copy.remaining, lang)}</span>
          </button>
        </div>
      ) : null}

      <aside className="reference-attribution">
        <div>
          <span>{localize(copy.attributionTitle, lang)}</span>
          <strong>{referenceLibraryMeta.attribution.sourceName}</strong>
        </div>
        <p>{localize(referenceLibraryMeta.attribution.adaptationNotice, lang)}</p>
        <p>{localize(referenceLibraryMeta.attribution.rightsNotice, lang)}</p>
        <p>{localize(copy.collectionMethod, lang)}</p>
        <div>
          <a href={referenceLibraryMeta.attribution.sourceUrl} target="_blank" rel="noreferrer">OpenDesign ↗</a>
          <a href={referenceLibraryMeta.attribution.sourceLicense.url} target="_blank" rel="noreferrer">
            {referenceLibraryMeta.attribution.sourceLicense.name} ↗
          </a>
        </div>
      </aside>
    </div>
  );
}
