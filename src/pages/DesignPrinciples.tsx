import { useEffect, useMemo, useRef, useState } from 'react';
import {
  designPrincipleCategories,
  designPrinciples,
} from '../catalog/designPrinciples';
import { uxPrinciples } from '../catalog/principles';
import type { DesignPrincipleCategory } from '../catalog/types';
import { DesignGuideTabs } from '../components/DesignGuideTabs';
import type { Lang, LocalizedText } from '../data/styles';
import { localize } from '../data/styles';
import { withLang } from '../utils/language';
import './DesignPrinciples.css';
import { PrincipleExample } from './principle-examples/PrincipleExample';

type CategoryFilter = 'all' | DesignPrincipleCategory;
const t = (en: string, ko: string, ja: string): LocalizedText => ({ en, ko, ja });

const copy = {
  index: t('Field guide 02 / visual craft', '필드 가이드 02 / 시각 설계', 'フィールドガイド 02 / 視覚設計'),
  title: t('Place every element with a reason.', '모든 요소를 이유 있게 배치하세요.', 'すべての要素を、理由のある場所へ。'),
  intro: t(
    'Twenty-one principles connect placement, hierarchy, type, color, imagery, and states to checks you can actually run.',
    '21개 원칙으로 배치·위계·글자·색·이미지·상태를 실제 검증 항목까지 연결합니다.',
    '21の原則で、配置、階層、文字、色、画像、状態を実際の確認項目までつなぎます。',
  ),
  jump: t('Open the field guide', '필드 가이드 열기', 'フィールドガイドを開く'),
  diagramLabel: t('A placement pass', '배치 검토 한 번', '配置チェック'),
  diagramFocus: t('01 / focus', '01 / 초점', '01 / 焦点'),
  diagramGroup: t('02 / grouping', '02 / 그룹', '02 / まとまり'),
  diagramRead: t('03 / reading', '03 / 읽기', '03 / 読み'),
  diagramCaption: t(
    'Rank attention → group relationships → constrain reading measure.',
    '주의 순위 → 관계 그룹 → 읽기 폭 순서로 검토합니다.',
    '注意の順位 → 関係のまとまり → 読書幅の順に確認します。',
  ),
  searchLabel: t('Search the field guide', '필드 가이드 검색', 'フィールドガイドを検索'),
  searchPlaceholder: t('Search placement, hierarchy, color, empty states…', '배치, 위계, 색, 빈 상태 검색…', '配置、階層、色、空状態を検索…'),
  categoryLabel: t('Filter by craft area', '설계 영역 필터', '設計領域で絞り込む'),
  all: t('All', '전체', 'すべて'),
  count: t('principles in view', '개 원칙 표시', '件の原則を表示'),
  question: t('Design question', '설계 질문', '設計上の問い'),
  open: t('Inspect', '검토', '確認'),
  placement: t('Place', '배치', '配置'),
  apply: t('Apply', '적용', '適用'),
  verify: t('Verify', '검증', '確認'),
  caution: t('Watch the misuse', '오용 주의', '誤用に注意'),
  relatedUx: t('Related UX principles', '연결된 UX 원칙', '関連するUX原則'),
  noResults: t('No principle matches this view.', '이 조건에 맞는 원칙이 없습니다.', 'この条件に合う原則はありません。'),
  noResultsBody: t(
    'Adjust one filter or clear everything to return to the full field guide.',
    '필터 하나를 바꾸거나 모두 초기화해 전체 필드 가이드로 돌아가세요.',
    '条件を変えるか、すべて解除して全フィールドガイドへ戻ってください。',
  ),
  clear: t('Clear filters', '필터 초기화', '条件を解除'),
  guideTitle: t('Use this as a field guide', '검토용 필드 가이드 사용법', '実務ガイドとしての使い方'),
  guideBody: t(
    'These principles are contextual review prompts, not universal laws or fixed recipes. Select only what serves the task, surface, and phase.',
    '이 원칙들은 보편 법칙이나 고정된 처방이 아니라 맥락에 맞춰 고르는 검토 질문입니다. 과업·화면·단계에 필요한 것만 선택하세요.',
    'これらは普遍法則や固定レシピではなく、文脈に応じて選ぶ確認項目です。タスク、画面、段階に必要なものだけを使います。',
  ),
  select: t('Select', '선택', '選択'),
  selectBody: t(
    'Choose a small set of principles for the current surface and design phase.',
    '현재 화면과 설계 단계에 맞는 소수의 원칙을 고르세요.',
    '現在の画面と設計段階に合う少数の原則を選びます。',
  ),
  prioritize: t('Prioritize', '우선순위', '優先'),
  prioritizeBody: t(
    'Semantic order, accessibility, safety, and truthful feedback override visual polish.',
    '의미 순서·접근성·안전·정확한 피드백을 시각적 마감보다 우선하세요.',
    '意味順序、アクセシビリティ、安全、正確なフィードバックを視覚的な仕上げより優先します。',
  ),
  verifyGuide: t('Verify in context', '실제 맥락에서 검증', '実環境で確認'),
  verifyGuideBody: t(
    'Test real content, 320 CSS pixels, 400% zoom, input modes, locales, preferences, and failure states.',
    '실제 콘텐츠·320 CSS 픽셀·400% 확대·입력 방식·언어·사용자 선호·실패 상태를 함께 테스트하세요.',
    '実際の内容、320 CSSピクセル、400%拡大、入力方式、言語、利用者設定、失敗状態を確認します。',
  ),
};

function searchableText(principle: (typeof designPrinciples)[number], lang: Lang): string {
  const values = (value: LocalizedText) => [value.en, value.ko, value.ja];
  const category = designPrincipleCategories.find((item) => item.id === principle.category);
  return [
    ...values(principle.name),
    ...principle.aliases,
    ...values(principle.summary),
    ...values(principle.designQuestion),
    ...principle.placement.flatMap(values),
    ...principle.apply.flatMap(values),
    ...principle.verify.flatMap(values),
    ...values(principle.caution),
    ...(category ? [...values(category.label), ...values(category.description)] : []),
    ...principle.concernTags,
    ...principle.surfaceTags,
  ].join(' ').normalize('NFKC').toLocaleLowerCase(lang);
}

export function DesignPrinciples({ lang }: { lang: Lang }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const normalizedQuery = query.trim().normalize('NFKC').toLocaleLowerCase(lang);
  const filtered = useMemo(
    () => designPrinciples.filter((principle) => (
      (category === 'all' || principle.category === category)
      && (!normalizedQuery || searchableText(principle, lang).includes(normalizedQuery))
    )),
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
    <div className="design-principles-page">
      <DesignGuideTabs active="visual" lang={lang} />
      <header className="design-principles-hero">
        <div className="design-principles-hero__copy">
          <span>{localize(copy.index, lang)}</span>
          <h1>{localize(copy.title, lang)}</h1>
          <p>{localize(copy.intro, lang)}</p>
          <a href="#design-principles-catalog">{localize(copy.jump, lang)} ↓</a>
        </div>
        <figure className="design-principles-workbench" aria-label={localize(copy.diagramLabel, lang)}>
          <div className="design-principles-workbench__axis" aria-hidden="true">
            <span>{localize(copy.diagramFocus, lang)}</span>
            <span>{localize(copy.diagramGroup, lang)}</span>
            <span>{localize(copy.diagramRead, lang)}</span>
          </div>
          <div className="design-principles-workbench__frame" aria-hidden="true">
            <i className="design-principles-workbench__primary" />
            <i className="design-principles-workbench__support" />
            <i className="design-principles-workbench__measure" />
            <i className="design-principles-workbench__measure design-principles-workbench__measure--short" />
            <b>01</b>
            <b>02</b>
            <b>03</b>
          </div>
          <figcaption>{localize(copy.diagramCaption, lang)}</figcaption>
        </figure>
      </header>

      <section
        className="design-principles-controls"
        id="design-principles-catalog"
        aria-label={localize(copy.categoryLabel, lang)}
      >
        <label className="design-principles-search">
          <span>{localize(copy.searchLabel, lang)}</span>
          <input
            ref={searchInputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={localize(copy.searchPlaceholder, lang)}
          />
        </label>
        <div className="design-principles-filters">
          <span>{localize(copy.categoryLabel, lang)}</span>
          <div>
            <button type="button" aria-pressed={category === 'all'} onClick={() => setCategory('all')}>
              {localize(copy.all, lang)}
            </button>
            {designPrincipleCategories.map((item) => (
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
        <p className="design-principles-count" role="status" aria-live="polite">
          <strong>{filtered.length.toString().padStart(2, '0')}</strong> {localize(copy.count, lang)}
        </p>
      </section>

      {filtered.length ? (
        <ol className="design-principles-list">
          {filtered.map((principle) => {
            const catalogNumber = designPrinciples.findIndex((item) => item.id === principle.id) + 1;
            const categoryMeta = designPrincipleCategories.find((item) => item.id === principle.category);
            const headingId = `${principle.id}-design-heading`;
            const summaryId = `${principle.id}-design-summary`;
            const questionId = `${principle.id}-design-question`;
            const name = localize(principle.name, lang);
            return (
              <li id={principle.id} key={principle.id}>
                <article aria-labelledby={headingId}>
                  <h2 className="sr-only" id={headingId}>{name}</h2>
                  <details className="design-principle" name="design-principles">
                    <summary aria-labelledby={headingId} aria-describedby={`${summaryId} ${questionId}`}>
                      <span className="design-principle__number">{catalogNumber.toString().padStart(2, '0')}</span>
                      <span className="design-principle__headline">
                        <small>{categoryMeta ? localize(categoryMeta.label, lang) : principle.category}</small>
                        <strong aria-hidden="true">{name}</strong>
                        <span id={summaryId}>{localize(principle.summary, lang)}</span>
                      </span>
                      <b id={questionId}>
                        <small>{localize(copy.question, lang)}</small>
                        {localize(principle.designQuestion, lang)}
                      </b>
                      <span className="design-principle__open">{localize(copy.open, lang)}</span>
                    </summary>
                    <div className="design-principle__body">
                      <PrincipleExample
                        scope="design"
                        principleId={principle.id}
                        principleName={name}
                        guidance={principle.apply[0] ?? principle.summary}
                        lang={lang}
                      />
                      {([
                        [copy.placement, principle.placement],
                        [copy.apply, principle.apply],
                        [copy.verify, principle.verify],
                      ] as const).map(([label, items]) => (
                        <section key={label.en}>
                          <h3>{localize(label, lang)}</h3>
                          <ul>{items.map((item) => <li key={item.en}>{localize(item, lang)}</li>)}</ul>
                        </section>
                      ))}
                      <aside>
                        <span>{localize(copy.caution, lang)}</span>
                        <p>{localize(principle.caution, lang)}</p>
                      </aside>
                      <footer>
                        <span>{localize(copy.relatedUx, lang)}</span>
                        <div>
                          {principle.relatedUxPrincipleIds.map((id) => (
                            <a
                              key={id}
                              href={`${withLang('/pages/ux-principles', lang)}#${id}`}
                              title={id}
                            >
                              {localize(uxPrinciples.find((item) => item.id === id)?.name ?? {
                                en: id,
                                ko: id,
                                ja: id,
                              }, lang)}
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
        <section className="design-principles-empty" role="status">
          <strong>{localize(copy.noResults, lang)}</strong>
          <p>{localize(copy.noResultsBody, lang)}</p>
          <button type="button" onClick={clearFilters}>{localize(copy.clear, lang)}</button>
        </section>
      )}

      <footer className="design-principles-note">
        <span>{localize(copy.guideTitle, lang)}</span>
        <p>{localize(copy.guideBody, lang)}</p>
        <dl>
          <div>
            <dt>{localize(copy.select, lang)}</dt>
            <dd>{localize(copy.selectBody, lang)}</dd>
          </div>
          <div>
            <dt>{localize(copy.prioritize, lang)}</dt>
            <dd>{localize(copy.prioritizeBody, lang)}</dd>
          </div>
          <div>
            <dt>{localize(copy.verifyGuide, lang)}</dt>
            <dd>{localize(copy.verifyGuideBody, lang)}</dd>
          </div>
        </dl>
      </footer>
    </div>
  );
}
