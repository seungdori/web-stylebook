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

const t = (en: string, ko: string, ja: string): LocalizedText => ({ en, ko, ja });

type DesignPrincipleGroupId =
  | 'purpose-evidence'
  | 'hierarchy-layout'
  | 'type-color-media'
  | 'navigation-interaction'
  | 'states-recovery';

type DesignPrincipleGroup = {
  id: DesignPrincipleGroupId;
  label: LocalizedText;
  description: LocalizedText;
};

const designPrincipleGroups: DesignPrincipleGroup[] = [
  {
    id: 'purpose-evidence',
    label: t('Purpose & evidence', '목적·근거', '目的・根拠'),
    description: t(
      'Clarify what the interface is for and what makes its claims credible.',
      '인터페이스의 목적과 주장을 믿을 수 있는 근거를 분명히 합니다.',
      'インターフェースの目的と、主張を信頼できる根拠を明確にします。',
    ),
  },
  {
    id: 'hierarchy-layout',
    label: t('Hierarchy & layout', '위계·배치', '階層・配置'),
    description: t(
      'Shape attention, grouping, density, depth, and responsive composition.',
      '주의 순서·그룹·밀도·깊이·반응형 구성을 다룹니다.',
      '注意の順序、まとまり、密度、奥行き、レスポンシブ構成を扱います。',
    ),
  },
  {
    id: 'type-color-media',
    label: t('Type, color & media', '글자·색·이미지', '文字・色・画像'),
    description: t(
      'Build a readable type, color, token, localization, and imagery system.',
      '읽기 쉬운 글자·색·토큰·현지화·이미지 체계를 만듭니다.',
      '読みやすい文字、色、トークン、ローカライズ、画像の仕組みを作ります。',
    ),
  },
  {
    id: 'navigation-interaction',
    label: t('Navigation & interaction', '내비게이션·상호작용', 'ナビゲーション・操作'),
    description: t(
      'Make location, controls, icons, input methods, and outcomes understandable.',
      '현재 위치·컨트롤·아이콘·입력 방식·결과를 이해할 수 있게 합니다.',
      '現在地、コントロール、アイコン、入力方法、結果を理解できるようにします。',
    ),
  },
  {
    id: 'states-recovery',
    label: t('States & recovery', '상태·복구', '状態・回復'),
    description: t(
      'Explain change, failure, progress, and a safe path forward or back.',
      '변화·실패·진행과 안전하게 계속하거나 돌아가는 길을 설명합니다.',
      '変化、失敗、進行と、安全に進む・戻る経路を説明します。',
    ),
  },
];

const categoryToGroup: Record<DesignPrincipleCategory, DesignPrincipleGroupId> = {
  'intent-iteration': 'purpose-evidence',
  'hierarchy-semantics': 'hierarchy-layout',
  'adaptation-density': 'hierarchy-layout',
  'typography-localization': 'type-color-media',
  'tokens-color-themes': 'type-color-media',
  'interaction-accessibility': 'navigation-interaction',
  'states-feedback-recovery': 'states-recovery',
};

const groupOverrides: Partial<Record<string, DesignPrincipleGroupId>> = {
  'navigation-preserves-context': 'navigation-interaction',
  'iconography-has-a-job': 'navigation-interaction',
  'resilient-imagery': 'type-color-media',
};

function groupForPrinciple(principle: (typeof designPrinciples)[number]): DesignPrincipleGroupId {
  return groupOverrides[principle.id] ?? categoryToGroup[principle.category];
}

const recentlyAddedIds = [
  'evidence-near-claim',
  'navigation-preserves-context',
  'iconography-has-a-job',
] as const;
const recentlyAddedIdSet = new Set<string>(recentlyAddedIds);
const recentlyAddedPrinciples = recentlyAddedIds.flatMap((id) => {
  const principle = designPrinciples.find((item) => item.id === id);
  return principle ? [principle] : [];
});

const copy = {
  index: t('Field guide 02 / interface design', '필드 가이드 02 / 인터페이스 설계', 'フィールドガイド 02 / インターフェース設計'),
  title: t('Design interfaces you can verify.', '인터페이스를 설명하고 검증하세요.', '説明し、検証できるインターフェースへ。'),
  intro: (count: number) => t(
    `${count} principles connect placement, hierarchy, type, color, imagery, navigation, evidence, and states to checks you can actually run.`,
    `${count}개 원칙으로 배치·위계·글자·색·이미지·내비게이션·근거·상태를 실제 검증 항목까지 연결합니다.`,
    `${count}の原則で、配置、階層、文字、色、画像、ナビゲーション、根拠、状態を実際の確認項目までつなぎます。`,
  ),
  jump: t('Open the field guide', '필드 가이드 열기', 'フィールドガイドを開く'),
  searchLabel: t('Search the field guide', '필드 가이드 검색', 'フィールドガイドを検索'),
  searchPlaceholder: t('Search placement, hierarchy, color, empty states…', '배치, 위계, 색, 빈 상태 검색…', '配置、階層、色、空状態を検索…'),
  categoryLabel: t('Filter by interface area', '인터페이스 영역 필터', 'インターフェース領域で絞り込む'),
  all: t('All', '전체', 'すべて'),
  count: t('principles in view', '개 원칙 표시', '件の原則を表示'),
  question: t('Design question', '설계 질문', '設計上の問い'),
  open: t('Inspect', '검토', '確認'),
  placement: t('Place', '배치', '配置'),
  apply: t('Apply', '적용', '適用'),
  verify: t('Verify', '검증', '確認'),
  caution: t('Watch the misuse', '오용 주의', '誤用に注意'),
  relatedUx: t('Related UX principles', '연결된 UX 원칙', '関連するUX原則'),
  furtherReading: t('Further reading', '참고 자료', '参考資料'),
  noResults: t('No principle matches this view.', '이 조건에 맞는 원칙이 없습니다.', 'この条件に合う原則はありません。'),
  noResultsBody: t(
    'Adjust one filter or clear everything to return to the full field guide.',
    '필터 하나를 바꾸거나 모두 초기화해 전체 필드 가이드로 돌아가세요.',
    '条件を変えるか、すべて解除して全フィールドガイドへ戻ってください。',
  ),
  clear: t('Clear filters', '필터 초기화', '条件を解除'),
  latestEyebrow: t('Latest update', '이번 업데이트', '今回の更新'),
  latestTitle: t('Three new principles, with their sources.', '새로 추가한 원칙 3개와 출처를 바로 확인하세요.', '新しく追加した3つの原則と出典を確認できます。'),
  latestBody: t(
    'These additions turn current product-design guidance into concrete review questions. Open one to see the example, application, verification, and original reference.',
    '최신 제품 디자인 자료를 구체적인 검토 질문으로 정리했습니다. 원칙을 열면 예시·적용법·검증법·원문 출처를 함께 볼 수 있습니다.',
    '最新のプロダクトデザイン資料を具体的な確認項目にしました。原則を開くと、例、適用、検証、原典をまとめて確認できます。',
  ),
  recent: t('Recently added', '최근 추가', '最近追加'),
  source: t('Source', '출처', '出典'),
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
  const group = designPrincipleGroups.find((item) => item.id === groupForPrinciple(principle));
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
    ...(group ? [...values(group.label), ...values(group.description)] : []),
    ...principle.concernTags,
    ...principle.surfaceTags,
    ...principle.references.flatMap((reference) => [reference.title, reference.publisher]),
  ].join(' ').normalize('NFKC').toLocaleLowerCase(lang);
}

export function DesignPrinciples({ lang }: { lang: Lang }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | DesignPrincipleGroupId>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const normalizedQuery = query.trim().normalize('NFKC').toLocaleLowerCase(lang);
  const filtered = useMemo(
    () => designPrinciples.filter((principle) => (
      (category === 'all' || groupForPrinciple(principle) === category)
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
          <p>{localize(copy.intro(designPrinciples.length), lang)}</p>
          <a href="#design-principles-catalog">{localize(copy.jump, lang)} ↓</a>
        </div>
      </header>

      <section className="design-principles-latest" aria-labelledby="design-principles-latest-title">
        <header>
          <span>{localize(copy.latestEyebrow, lang)}</span>
          <h2 id="design-principles-latest-title">{localize(copy.latestTitle, lang)}</h2>
          <p>{localize(copy.latestBody, lang)}</p>
        </header>
        <ol>
          {recentlyAddedPrinciples.map((principle) => {
            const catalogNumber = designPrinciples.findIndex((item) => item.id === principle.id) + 1;
            const publishers = [...new Set(principle.references.map((reference) => reference.publisher))];
            return (
              <li key={principle.id}>
                <a href={`#${principle.id}`}>
                  <span>#{catalogNumber.toString().padStart(2, '0')}</span>
                  <strong>{localize(principle.name, lang)}</strong>
                  <small>{localize(copy.source, lang)} · {publishers.join(' + ')}</small>
                </a>
              </li>
            );
          })}
        </ol>
      </section>

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
            {designPrincipleGroups.map((item) => (
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
            const groupMeta = designPrincipleGroups.find((item) => item.id === groupForPrinciple(principle));
            const isRecentlyAdded = recentlyAddedIdSet.has(principle.id);
            const publishers = [...new Set(principle.references.map((reference) => reference.publisher))];
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
                        <span className="design-principle__meta">
                          <small>{groupMeta ? localize(groupMeta.label, lang) : principle.category}</small>
                          {isRecentlyAdded && <em>{localize(copy.recent, lang)}</em>}
                          {isRecentlyAdded && publishers.length > 0 && (
                            <span>{localize(copy.source, lang)} · {publishers.join(' + ')}</span>
                          )}
                        </span>
                        <strong aria-hidden="true">{name}</strong>
                        <span className="design-principle__summary" id={summaryId}>{localize(principle.summary, lang)}</span>
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
                        {principle.references.length > 0 && (
                          <>
                            <span>{localize(copy.furtherReading, lang)}</span>
                            <div>
                              {principle.references.map((reference) => (
                                <a
                                  key={reference.url}
                                  href={reference.url}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  {reference.title} · {reference.publisher} ↗
                                </a>
                              ))}
                            </div>
                          </>
                        )}
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
