import { useMemo, useRef, useState } from 'react';
import {
  uxPrincipleAttribution, uxPrincipleCategories, uxPrinciples,
} from '../catalog/principles';
import type { UxPrincipleCategory } from '../catalog/types';
import type { Lang, LocalizedText } from '../data/styles';
import { localize } from '../data/styles';

type CategoryFilter = 'all' | UxPrincipleCategory;

const t = (en: string, ko: string, ja: string): LocalizedText => ({ en, ko, ja });

const copy = {
  eyebrow: t('Behavior reference', '행동 설계 레퍼런스', '行動設計リファレンス'),
  title: t('UX principles you can verify.', '검증할 수 있는 UX 원칙', '検証できるUX原則'),
  intro: t(
    'Turn psychology and interaction principles into concrete design questions, implementation moves, and observable checks.',
    '심리와 상호작용 원칙을 구체적인 설계 질문, 구현 행동, 관찰 가능한 검증 항목으로 바꿉니다.',
    '心理とインタラクションの原則を、具体的な設計上の問い、実装行動、観察可能な確認項目へ変換します。',
  ),
  scopeLabel: t('Curated scope', '선별 범위', '選定範囲'),
  scope: t(
    'A practical subset chosen for interface work—not a mirror of another index.',
    '다른 색인을 복제하지 않고 인터페이스 작업에 유용한 항목만 선별했습니다.',
    '他の索引を複製せず、インターフェース実務に有用な項目だけを選定しています。',
  ),
  questionLabel: t('Design question', '설계 질문', '設計上の問い'),
  searchLabel: t('Search principles', '원칙 검색', '原則を検索'),
  searchPlaceholder: t(
    'Search a principle, outcome, or design question…',
    '원칙, 결과, 설계 질문 검색…',
    '原則、成果、設計上の問いを検索…',
  ),
  categoryLabel: t('Filter by category', '카테고리 필터', 'カテゴリで絞り込む'),
  all: t('All', '전체', 'すべて'),
  resultSingular: t('principle', '개 원칙', '件の原則'),
  resultPlural: t('principles', '개 원칙', '件の原則'),
  open: t('Guidance', '적용 가이드', 'ガイド'),
  apply: t('Apply', '적용', '適用'),
  verify: t('Verify', '검증', '確認'),
  caution: t('Watch the misuse', '오용 주의', '誤用に注意'),
  evidence: t('Evidence posture', '근거 수준', 'エビデンスの位置づけ'),
  references: t('References', '참고 자료', '参考資料'),
  sourceIndex: t('Laws of UX reference page', 'Laws of UX 참고 페이지', 'Laws of UX 参照ページ'),
  noResultsTitle: t('No principles match this view.', '이 조건에 맞는 원칙이 없습니다.', 'この条件に合う原則はありません。'),
  noResultsBody: t(
    'Keep the query, adjust one filter, or clear everything and return to the full index.',
    '검색어는 유지한 채 필터 하나를 바꾸거나, 모두 초기화해 전체 색인으로 돌아가세요.',
    '検索語を保ったまま条件を変えるか、すべて解除して全索引へ戻ってください。',
  ),
  clear: t('Clear filters', '필터 초기화', '条件を解除'),
  attributionTitle: t('Source and reuse boundary', '출처와 재사용 경계', '出典と再利用の境界'),
  visitSource: t('Visit the original project', '원 프로젝트 보기', '元プロジェクトを見る'),
  sourceLicense: t('Source-content license', '출처 콘텐츠 라이선스', '参照元コンテンツのライセンス'),
  authoredLicense: t('Web Stylebook text license', 'Web Stylebook 작성문 라이선스', 'Web Stylebook 執筆文のライセンス'),
};

const evidenceLabels = {
  empirical: t('empirical', '실증 연구', '実証研究'),
  gestalt: t('Gestalt', '게슈탈트', 'ゲシュタルト'),
  heuristic: t('heuristic', '휴리스틱', 'ヒューリスティック'),
  'systems-maxim': t('systems maxim', '시스템 격언', 'システム格言'),
  strong: t('strong', '강함', '強い'),
  contextual: t('contextual', '맥락 의존', '文脈依存'),
  contested: t('contested', '논쟁적', '議論あり'),
} as const;

function searchableText(principle: (typeof uxPrinciples)[number], lang: Lang): string {
  const localizedValues = (value: LocalizedText) => [value.en, value.ko, value.ja];
  const category = uxPrincipleCategories.find((item) => item.id === principle.category);
  return [
    ...localizedValues(principle.name),
    ...principle.aliases,
    ...localizedValues(principle.summary),
    ...localizedValues(principle.designQuestion),
    ...principle.apply.flatMap(localizedValues),
    ...principle.verify.flatMap(localizedValues),
    ...(category ? [...localizedValues(category.label), ...localizedValues(category.description)] : []),
    ...principle.outcomeTags,
    ...principle.surfaceTags,
  ].join(' ').normalize('NFKC').toLocaleLowerCase(lang);
}

function referenceHost(url: string): string {
  return new URL(url).hostname.replace(/^www\./, '');
}

export function UxPrinciples({ lang }: { lang: Lang }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const normalizedQuery = query.trim().normalize('NFKC').toLocaleLowerCase(lang);

  const filteredPrinciples = useMemo(
    () => uxPrinciples.filter((principle) => {
      const categoryMatches = category === 'all' || principle.category === category;
      const queryMatches = !normalizedQuery || searchableText(principle, lang).includes(normalizedQuery);
      return categoryMatches && queryMatches;
    }),
    [category, lang, normalizedQuery],
  );

  const clearFilters = () => {
    setQuery('');
    setCategory('all');
    searchInputRef.current?.focus();
  };

  return (
    <div className="ux-principles-page">
      <header className="ux-principles-intro">
        <div className="ux-principles-intro__copy">
          <p className="hero__eyebrow">{localize(copy.eyebrow, lang)}</p>
          <h1>{localize(copy.title, lang)}</h1>
          <p>{localize(copy.intro, lang)}</p>
        </div>
        <div className="ux-principles-intro__scope">
          <span>{localize(copy.scopeLabel, lang)}</span>
          <strong>{uxPrinciples.length.toString().padStart(2, '0')}</strong>
          <p>{localize(copy.scope, lang)}</p>
        </div>
      </header>

      <section className="ux-principles-controls" aria-label={localize(copy.categoryLabel, lang)}>
        <label className="ux-principles-search">
          <span>{localize(copy.searchLabel, lang)}</span>
          <input
            ref={searchInputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={localize(copy.searchPlaceholder, lang)}
          />
        </label>
        <div className="ux-principles-filters">
          <span>{localize(copy.categoryLabel, lang)}</span>
          <div>
            <button
              type="button"
              aria-pressed={category === 'all'}
              onClick={() => setCategory('all')}
            >
              {localize(copy.all, lang)}
            </button>
            {uxPrincipleCategories.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={category === item.id}
                onClick={() => setCategory(item.id)}
              >
                {localize(item.label, lang)}
              </button>
            ))}
          </div>
        </div>
        <p className="ux-principles-count" role="status" aria-live="polite">
          <strong>{filteredPrinciples.length}</strong>{' '}
          {localize(filteredPrinciples.length === 1 ? copy.resultSingular : copy.resultPlural, lang)}
        </p>
      </section>

      {filteredPrinciples.length ? (
        <ol className="ux-principles-list">
          {filteredPrinciples.map((principle) => {
            const catalogNumber = uxPrinciples.findIndex((item) => item.id === principle.id) + 1;
            const categoryMeta = uxPrincipleCategories.find((item) => item.id === principle.category);
            const headingId = `${principle.id}-heading`;
            const summaryId = `${principle.id}-summary`;
            const questionId = `${principle.id}-question`;
            const principleName = localize(principle.name, lang);
            return (
              <li id={principle.id} key={principle.id}>
                <article aria-labelledby={headingId}>
                  <h2 className="sr-only" id={headingId}>{principleName}</h2>
                  <details className="ux-principle">
                    <summary
                      aria-labelledby={headingId}
                      aria-describedby={`${summaryId} ${questionId}`}
                    >
                      <span className="ux-principle__number">{catalogNumber.toString().padStart(2, '0')}</span>
                      <span className="ux-principle__summary">
                      <span className="ux-principle__meta">
                        {categoryMeta ? localize(categoryMeta.label, lang) : principle.category}
                        <i aria-hidden="true">·</i>
                        {localize(evidenceLabels[principle.evidence.confidence], lang)}
                      </span>
                      <strong aria-hidden="true">{principleName}</strong>
                      <span id={summaryId}>{localize(principle.summary, lang)}</span>
                      <b id={questionId}>
                        <small>{localize(copy.questionLabel, lang)}</small>
                        {localize(principle.designQuestion, lang)}
                      </b>
                      </span>
                      <span className="ux-principle__open">{localize(copy.open, lang)}</span>
                    </summary>

                    <div className="ux-principle__body">
                      <section>
                        <h3>{localize(copy.apply, lang)}</h3>
                        <ul>
                          {principle.apply.map((item) => <li key={item.en}>{localize(item, lang)}</li>)}
                        </ul>
                      </section>
                      <section>
                        <h3>{localize(copy.verify, lang)}</h3>
                        <ul>
                          {principle.verify.map((item) => <li key={item.en}>{localize(item, lang)}</li>)}
                        </ul>
                      </section>
                      <aside>
                        <span>{localize(copy.caution, lang)}</span>
                        <p>{localize(principle.caution, lang)}</p>
                      </aside>
                      <footer>
                        <div>
                          <span>{localize(copy.evidence, lang)}</span>
                          <strong>
                            {localize(evidenceLabels[principle.evidence.kind], lang)}
                            {' · '}
                            {localize(evidenceLabels[principle.evidence.confidence], lang)}
                          </strong>
                        </div>
                        <div>
                          <span>{localize(copy.references, lang)}</span>
                          <a
                            href={principle.referenceUrl}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`${localize(copy.sourceIndex, lang)}: ${principleName}`}
                          >
                            {uxPrincipleAttribution.sourceName} — {principleName}
                          </a>
                          {principle.evidence.references.map((reference, index) => (
                            <a
                              href={reference.url}
                              target="_blank"
                              rel="noreferrer"
                              key={reference.url}
                              aria-label={`${localize(copy.references, lang)} ${index + 1}: ${reference.title} (${referenceHost(reference.url)})`}
                            >
                              {reference.title} — {referenceHost(reference.url)}
                            </a>
                          ))}
                        </div>
                      </footer>
                    </div>
                  </details>
                </article>
              </li>
            );
          })}
        </ol>
      ) : (
        <section className="ux-principles-empty" role="status">
          <strong>{localize(copy.noResultsTitle, lang)}</strong>
          <p>{localize(copy.noResultsBody, lang)}</p>
          <button type="button" onClick={clearFilters}>{localize(copy.clear, lang)}</button>
        </section>
      )}

      <footer className="ux-principles-attribution">
        <span>{localize(copy.attributionTitle, lang)}</span>
        <p>{localize(uxPrincipleAttribution.notice, lang)}</p>
        <div>
          <a href={uxPrincipleAttribution.sourceUrl} target="_blank" rel="noreferrer">
            {localize(copy.visitSource, lang)} — {uxPrincipleAttribution.sourceName} · {uxPrincipleAttribution.creator}
          </a>
          <a href={uxPrincipleAttribution.sourceLicense.url} target="_blank" rel="noreferrer">
            {localize(copy.sourceLicense, lang)} — {uxPrincipleAttribution.sourceLicense.name}
          </a>
          <a href={uxPrincipleAttribution.authoredContentLicense.url} target="_blank" rel="noreferrer">
            {localize(copy.authoredLicense, lang)} — {uxPrincipleAttribution.authoredContentLicense.name}
          </a>
        </div>
      </footer>
    </div>
  );
}
