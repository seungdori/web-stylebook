import { useEffect, useMemo, useRef, useState } from 'react';
import {
  uxPrincipleCategories, uxPrinciples,
} from '../catalog/principles';
import type { UxPrincipleCategory } from '../catalog/types';
import type { Lang, LocalizedText } from '../data/styles';
import { localize } from '../data/styles';
import { PrincipleExample } from './principle-examples/PrincipleExample';

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
  noResultsTitle: t('No principles match this view.', '이 조건에 맞는 원칙이 없습니다.', 'この条件に合う原則はありません。'),
  noResultsBody: t(
    'Keep the query, adjust one filter, or clear everything and return to the full index.',
    '검색어는 유지한 채 필터 하나를 바꾸거나, 모두 초기화해 전체 색인으로 돌아가세요.',
    '検索語を保ったまま条件を変えるか、すべて解除して全索引へ戻ってください。',
  ),
  clear: t('Clear filters', '필터 초기화', '条件を解除'),
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

  useEffect(() => {
    const openHashTarget = () => {
      const principleId = decodeURIComponent(window.location.hash.slice(1));
      if (!principleId) return;
      const target = document.getElementById(principleId);
      const disclosure = target?.querySelector('details');
      if (disclosure instanceof HTMLDetailsElement && target) {
        disclosure.open = true;
        window.requestAnimationFrame(() => target.scrollIntoView({ block: 'start', behavior: 'instant' }));
      }
    };

    openHashTarget();
    window.addEventListener('hashchange', openHashTarget);
    return () => window.removeEventListener('hashchange', openHashTarget);
  }, []);

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
                  <details className="ux-principle" name="ux-principles">
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
                      <PrincipleExample
                        scope="ux"
                        principleId={principle.id}
                        principleName={principleName}
                        guidance={principle.apply[0] ?? principle.summary}
                        lang={lang}
                      />
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

    </div>
  );
}
