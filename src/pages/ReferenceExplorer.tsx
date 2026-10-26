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
  title: t('Find inspiration in real websites', '실제 웹사이트에서 디자인 찾기', '実際のWebサイトからデザインを探す'),
  intro: t(
    'Compare the screenshots, explore the design, then visit the original site.',
    '화면을 비교하고, 마음에 드는 디자인의 분석과 원본 사이트를 확인하세요.',
    '画面を見比べて、気になるデザインの分析や元サイトを確認できます。',
  ),
  searchLabel: t('Search references', '레퍼런스 검색', 'リファレンスを検索'),
  searchPlaceholder: t(
    'Search a site, style, or keyword',
    '사이트, 스타일, 키워드 검색',
    'サイト、スタイル、キーワードで検索',
  ),
  categoryLabel: t('Filter by category', '카테고리로 찾기', 'カテゴリで絞り込む'),
  all: t('All', '전체', 'すべて'),
  results: t('references', '개 레퍼런스', '件のリファレンス'),
  clear: t('Clear filters', '필터 초기화', '条件を解除'),
  noResults: t('No reference matches this view.', '이 조건에 맞는 레퍼런스가 없습니다.', 'この条件に合う参照はありません。'),
  noResultsBody: t(
    'Try a broader term or return to the complete index.',
    '검색 범위를 넓히거나 전체 인덱스로 돌아가세요.',
    '検索範囲を広げるか、全索引に戻ってください。',
  ),
  inspect: t('Design analysis', '디자인 분석', 'デザイン分析'),
  enlarge: t('View larger', '크게 보기', '拡大表示'),
  close: t('Close preview', '미리보기 닫기', 'プレビューを閉じる'),
  previewLoading: t('Loading preview…', '미리보기 불러오는 중…', 'プレビューを読み込み中…'),
  previewUnavailable: t('Preview unavailable', '미리보기를 불러오지 못했습니다', 'プレビューを表示できません'),
  previewHint: t('You can still visit the original site.', '원본 사이트에서 디자인을 확인하세요.', '元サイトでデザインを確認できます。'),
  screenshot: t('Website screenshot', '웹사이트 캡처', 'Webサイトのキャプチャ'),
  captured: t('Captured', '캡처', '撮影'),
  captureNotice: t('Captured previews may differ from the current site.', '캡처 화면은 현재 사이트와 다를 수 있습니다.', 'キャプチャは現在のサイトと異なる場合があります。'),
  palette: t('Palette', '팔레트', 'パレット'),
  layout: t('Layout', '레이아웃', 'レイアウト'),
  interaction: t('Interaction', '상호작용', 'インタラクション'),
  motion: t('Motion', '모션', 'モーション'),
  measuredTokens: t('Measured tokens', '측정 토큰', '計測トークン'),
  type: t('Type', '서체', '書体'),
  grid: t('Grid', '그리드', 'グリッド'),
  radius: t('Radius', '모서리', '角丸'),
  timing: t('Timing', '시간', '時間'),
  sourceSite: t('Visit site', '원본 사이트', '元サイトを開く'),
  sourceSpec: t('Open measured spec', '측정 스펙 열기', '計測仕様を開く'),
  observed: t('Observed', '관찰일', '観察日'),
  loadMore: t('Load more references', '레퍼런스 더 보기', '参照をさらに表示'),
  remaining: t('remaining', '개 남음', '件残り'),
  attributionTitle: t('Source & rights', '출처와 권리', '出典と権利'),
  collectionMethod: t(
    'Previews load from OpenDesign’s image server. Captures show a past version of each site; follow the original link to explore the current design and interactions.',
    '미리보기는 OpenDesign 이미지 서버에서 불러옵니다. 캡처 당시의 화면이므로 현재 디자인과 실제 동작은 원본 사이트에서 확인하세요.',
    'プレビューはOpenDesignの画像サーバーから読み込みます。撮影時点の画面のため、現在のデザインや動作は元サイトで確認してください。',
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

const PAGE_SIZE = 24;
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

function ExpandIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5" /></svg>;
}

function PreviewImage({ reference, lang, eager = false, large = false }: {
  reference: DesignReference;
  lang: Lang;
  eager?: boolean;
  large?: boolean;
}) {
  const [state, setState] = useState<'loading' | 'loaded' | 'failed'>(reference.preview ? 'loading' : 'failed');
  const src = large ? reference.preview?.url.replace('/thumbnail/800x/', '/thumbnail/1440x/') : reference.preview?.url;
  return (
    <span className="reference-preview" data-state={state}>
      {state !== 'loaded' && (
        <span className="reference-preview__placeholder">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="m3 17 5-5 4 4 4-6 5 7" /><circle cx="8" cy="8" r="1" /></svg>
          <span>{localize(state === 'failed' ? copy.previewUnavailable : copy.previewLoading, lang)}</span>
          {state === 'failed' && <small>{localize(copy.previewHint, lang)}</small>}
        </span>
      )}
      {src && state !== 'failed' && (
        <img
          src={src}
          alt={`${reference.title} — ${localize(copy.screenshot, lang)}`}
          width={large ? 1440 : 800}
          height={large ? 900 : 500}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setState('loaded')}
          onError={() => setState('failed')}
        />
      )}
    </span>
  );
}

function PreviewDialog({ reference, lang, onClose }: { reference: DesignReference; lang: Lang; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog?.showModal();
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      opener?.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog ref={dialogRef} className="reference-dialog" aria-labelledby="reference-preview-title" onCancel={(event) => { event.preventDefault(); onClose(); }} onKeyDown={(event) => {
      if (event.key !== 'Tab') return;
      const controls = event.currentTarget.querySelectorAll<HTMLElement>('a[href], button');
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }} onClick={(event) => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
    }}>
      <div className="reference-dialog__header">
        <div>
          <h2 id="reference-preview-title">{reference.title}</h2>
          <p>{new URL(reference.url).hostname.replace(/^www\./, '')}</p>
        </div>
        <a href={reference.url} target="_blank" rel="noreferrer">{localize(copy.sourceSite, lang)} <span aria-hidden="true">↗</span></a>
        <button ref={closeRef} type="button" onClick={onClose} aria-label={localize(copy.close, lang)}>×</button>
      </div>
      <div className="reference-dialog__image"><PreviewImage reference={reference} lang={lang} eager large /></div>
      <p className="reference-dialog__caption">
        <span>OpenDesign{reference.preview ? ` · ${localize(copy.captured, lang)} ${dateLabel(reference.preview.capturedAt, lang)}` : ''}</span>
        <span>{localize(copy.captureNotice, lang)}</span>
      </p>
    </dialog>
  );
}

export function ReferenceExplorer({ lang }: { lang: Lang }) {
  const [referenceLibrary, setReferenceLibrary] = useState<DesignReferenceLibrary | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [preview, setPreview] = useState<DesignReference | null>(null);
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
      <header className="reference-explorer__header">
        <div>
          <h1>{localize(copy.title, lang)}</h1>
          <p>{localize(copy.intro, lang)}</p>
        </div>
        <label className="reference-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></svg>
          <input
            ref={searchRef}
            type="search"
            aria-label={localize(copy.searchLabel, lang)}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setVisibleCount(PAGE_SIZE);
            }}
            placeholder={localize(copy.searchPlaceholder, lang)}
          />
        </label>
      </header>

      <section className="reference-controls" aria-label={localize(copy.categoryLabel, lang)}>
        <div className="reference-filters">
          <button type="button" aria-pressed={category === 'all'} onClick={() => selectCategory('all')}>
            {localize(copy.all, lang)}
          </button>
          {REFERENCE_CATEGORIES.map((item) => (
            <button key={item} type="button" aria-pressed={category === item} onClick={() => selectCategory(item)}>
              {localize(categoryLabels[item], lang)}{referenceLibrary && <> <b>{categoryCounts[item]}</b></>}
            </button>
          ))}
        </div>
        <div className="reference-controls__status">
          <p role="status" aria-live="polite">{referenceLibrary ? <><strong>{filtered.length}</strong> {localize(copy.results, lang)}</> : localize(loadError ? copy.loadError : copy.loading, lang)}</p>
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
                  <button className="reference-card__preview" type="button" onClick={() => setPreview(reference)} aria-label={`${reference.title} — ${localize(copy.enlarge, lang)}`}>
                    <PreviewImage reference={reference} lang={lang} eager={index < 3} />
                    <span className="reference-card__enlarge"><ExpandIcon />{localize(copy.enlarge, lang)}</span>
                  </button>
                  <div className="reference-card__head">
                    <div>
                      <h2 id={headingId}>{reference.title}</h2>
                      <p>{new URL(reference.url).hostname.replace(/^www\./, '')}</p>
                    </div>
                    <span>{localize(categoryLabels[reference.category], lang)}</span>
                  </div>
                  <a className="reference-card__visit" href={reference.url} target="_blank" rel="noreferrer">{localize(copy.sourceSite, lang)} <span aria-hidden="true">↗</span></a>
                  <details className="reference-card__details" name="reference-library">
                    <summary>{localize(copy.inspect, lang)}</summary>
                    <div className="reference-card__analysis">
                      <p className="reference-card__note">{localize(reference.analysis.notes, lang)}</p>
                      <ul className="reference-card__facts" aria-label={localize(copy.measuredTokens, lang)}>
                        {tokenFacts(reference, lang).map(([label, value]) => (
                          <li key={label}><span>{label}</span><strong>{value}</strong></li>
                        ))}
                      </ul>
                      <div className="reference-card__palette" aria-label={localize(copy.palette, lang)}>
                        {colors.map((color, colorIndex) => <span key={`${color}-${colorIndex}`} title={color} style={{ background: color }} />)}
                      </div>
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
                        {reference.preview && <span>{localize(copy.captured, lang)} · {dateLabel(reference.preview.capturedAt, lang)}</span>}
                      </div>
                      <div className="reference-card__actions">
                        <a href={reference.sourceSpecUrl} target="_blank" rel="noreferrer">{localize(copy.sourceSpec, lang)} ↗</a>
                      </div>
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
      {preview && <PreviewDialog key={preview.id} reference={preview} lang={lang} onClose={() => setPreview(null)} />}
    </div>
  );
}
