import type { Lang } from '../data/styles';
import { withLang } from '../utils/language';

type Localized = Record<Lang, string>;

interface KitCard {
  id: string;
  title: Localized;
  description: Localized;
  fileCount: number;
  examplePath: string;
}

const copy = {
  en: {
    eyebrow: 'Web Stylebook',
    title: 'Pro Kit',
    lead:
      'Open the finished example pages first. If the fit is right, inspect what is included in the Pro Kit bundle.',
    viewExamplesAction: 'Browse examples',
    examplesKicker: 'Examples',
    examplesTitle: 'Example pages',
    exampleLead:
      'Pick a product type and open the finished page directly.',
    viewExample: 'View example page',
    inspectStore: 'View bundle details',
    storePriceCta: 'View bundle details · $39',
    promptGenerator: 'Open prompt generator',
    fileCount: (count: number) => `${count} files`,
    includedTitle: 'Bundle contents',
    includedLead:
      'The free stylebook stays useful on its own. Pro Kit is the paid bundle for people who want the reusable files behind these examples.',
    included: [
      'Build, repair, and audit prompts per product type',
      'Color, type, spacing, and motion rules',
      'React/Tailwind starter files and component notes',
      'QA checklist for common AI-generated UI drift',
    ],
  },
  ko: {
    eyebrow: 'Web Stylebook',
    title: 'Pro Kit',
    lead:
      '완성된 예시 페이지를 먼저 열어보세요. 맞는 유형이 있으면 Pro Kit 번들에 들어있는 파일을 이어서 확인하면 됩니다.',
    viewExamplesAction: '예시 페이지 보기',
    examplesKicker: '예시 페이지',
    examplesTitle: '제품 유형별 예시',
    exampleLead:
      '제품 유형을 고르면 완성된 예시 페이지를 바로 열 수 있습니다.',
    viewExample: '예시 페이지 보기',
    inspectStore: '번들 상세 보기',
    storePriceCta: '번들 상세 보기 · $39',
    promptGenerator: '프롬프트 생성기 열기',
    fileCount: (count: number) => `${count}개 파일`,
    includedTitle: '번들 구성',
    includedLead:
      '무료 스타일북은 그대로 유용하게 둡니다. Pro Kit은 아래 예시를 만들 때 반복되는 파일만 묶은 유료 번들입니다.',
    included: [
      '제품 유형별 build, repair, audit 프롬프트',
      '색상, 폰트, 간격, 모션 규칙',
      'React/Tailwind 스타터 파일과 컴포넌트 노트',
      'AI 생성 UI가 흔히 무너지는 지점에 대한 QA 체크리스트',
    ],
  },
  ja: {
    eyebrow: 'Web Stylebook',
    title: 'Pro Kit',
    lead:
      '完成したページ例を先に開いてください。合うタイプがあれば、Pro Kitバンドルに含まれるファイルを確認できます。',
    viewExamplesAction: 'ページ例を見る',
    examplesKicker: 'ページ例',
    examplesTitle: 'プロダクト別のページ例',
    exampleLead:
      'プロダクト種別を選ぶと、完成したページ例を直接開けます。',
    viewExample: 'ページ例を見る',
    inspectStore: 'バンドル詳細を見る',
    storePriceCta: 'バンドル詳細を見る · $39',
    promptGenerator: 'プロンプト生成を開く',
    fileCount: (count: number) => `${count}ファイル`,
    includedTitle: 'バンドル内容',
    includedLead:
      '無料のStylebookはそのまま役立つ状態に保ちます。Pro Kitは下の例を作るための反復ファイルをまとめた有料バンドルです。',
    included: [
      'プロダクト別のbuild、repair、auditプロンプト',
      '色、フォント、余白、モーションの規則',
      'React/Tailwindスターターとコンポーネントノート',
      'AI生成UIで崩れやすい点を確認するQAチェックリスト',
    ],
  },
} satisfies Record<Lang, {
  eyebrow: string;
  title: string;
  lead: string;
  viewExamplesAction: string;
  examplesKicker: string;
  examplesTitle: string;
  exampleLead: string;
  viewExample: string;
  inspectStore: string;
  storePriceCta: string;
  promptGenerator: string;
  fileCount: (count: number) => string;
  includedTitle: string;
  includedLead: string;
  included: string[];
}>;

const kits: KitCard[] = [
  {
    id: 'operational-saas',
    title: {
      en: 'Operational SaaS',
      ko: '운영형 SaaS',
      ja: '運用SaaS',
    },
    description: {
      en: 'Dense but quiet operations UI for products used every day.',
      ko: '매일 쓰는 업무 도구를 위한 차분한 운영 화면.',
      ja: '毎日使う業務ツール向けの落ち着いた運用画面。',
    },
    fileCount: 17,
    examplePath: '/pages/pro-kit/operational-saas-example',
  },
  {
    id: 'launch-campaign',
    title: {
      en: 'Launch Campaign',
      ko: '런칭 캠페인',
      ja: 'ローンチキャンペーン',
    },
    description: {
      en: 'A poster-like launch page that still converts on mobile.',
      ko: '모바일에서도 전환되는 포스터형 런칭 페이지.',
      ja: 'モバイルでも転換できるポスター型ローンチページ。',
    },
    fileCount: 13,
    examplePath: '/pages/pro-kit/launch-campaign-example',
  },
  {
    id: 'developer-docs',
    title: {
      en: 'Developer Docs',
      ko: '개발자 문서',
      ja: '開発者ドキュメント',
    },
    description: {
      en: 'Docs that read like product writing, not a CMS dump.',
      ko: 'CMS 덤프가 아니라 글처럼 읽히는 개발자 문서.',
      ja: 'CMSの羅列ではなく、文章として読める開発者ドキュメント。',
    },
    fileCount: 16,
    examplePath: '/pages/pro-kit/developer-docs-example',
  },
  {
    id: 'portfolio-studio',
    title: {
      en: 'Portfolio / Studio',
      ko: '포트폴리오 / 스튜디오',
      ja: 'ポートフォリオ / スタジオ',
    },
    description: {
      en: 'Editorial studio portfolio that feels made by a person.',
      ko: '템플릿이 아니라 누군가 만든 작업처럼 읽히는 포트폴리오.',
      ja: 'テンプレートではなく人の手で作ったように読めるポートフォリオ。',
    },
    fileCount: 16,
    examplePath: '/pages/pro-kit/portfolio-studio-example',
  },
  {
    id: 'portfolio-expressive',
    title: {
      en: 'Portfolio / Studio (expressive)',
      ko: '포트폴리오 / 스튜디오 (expressive)',
      ja: 'ポートフォリオ / スタジオ (expressive)',
    },
    description: {
      en: 'A bolder portfolio where structure carries the energy.',
      ko: '구조가 에너지를 지탱하는 대담한 포트폴리오.',
      ja: '構造がエネルギーを支える大胆なポートフォリオ。',
    },
    fileCount: 16,
    examplePath: '/pages/pro-kit/portfolio-expressive-example',
  },
  {
    id: 'developer-tool',
    title: {
      en: 'Developer Tool',
      ko: '개발자 도구',
      ja: '開発者ツール',
    },
    description: {
      en: 'A technical product page that makes installation feel clear.',
      ko: '설치를 납득시키는 개발자 도구 페이지.',
      ja: '導入を納得させる開発者ツールページ。',
    },
    fileCount: 17,
    examplePath: '/pages/pro-kit/developer-tool-example',
  },
];

function localizedUrl(path: string, lang: Lang): string {
  const prefix = lang === 'en' ? '' : `/${lang}`;
  return `https://store.webstylebook.com${prefix}${path}`;
}

export function ProKit({ lang }: { lang: Lang }) {
  const deck = copy[lang];

  return (
    <div className="prokit-page">
      <section className="prokit-hero">
        <div>
          <p className="prokit-eyebrow">{deck.eyebrow}</p>
          <h1>{deck.title}</h1>
          <p>{deck.lead}</p>
          <div className="prokit-hero__actions">
            <a className="button button--dark" href="#prokit-examples-title">
              {deck.viewExamplesAction}
            </a>
            <a className="button" href={localizedUrl('/', lang)}>
              {deck.inspectStore}
            </a>
          </div>
        </div>
        <div className="prokit-hero__preview" aria-hidden="true">
          {kits.slice(0, 3).map((kit) => (
            <img
              key={kit.id}
              src={`/previews/pro-kit/${kit.id}.jpg`}
              alt=""
              width={1280}
              height={800}
            />
          ))}
        </div>
      </section>

      <section className="prokit-examples" aria-labelledby="prokit-examples-title">
        <header className="prokit-section-head">
          <span>{deck.examplesKicker}</span>
          <h2 id="prokit-examples-title">{deck.examplesTitle}</h2>
          <p>{deck.exampleLead}</p>
        </header>
        <div className="prokit-card-grid">
          {kits.map((kit) => (
            <article className="prokit-card" key={kit.id}>
              <a className="prokit-card__media" href={localizedUrl(kit.examplePath, lang)}>
                <img
                  src={`/previews/pro-kit/${kit.id}.jpg`}
                  alt=""
                  width={1280}
                  height={800}
                />
                <span>{deck.viewExample}</span>
              </a>
              <div className="prokit-card__body">
                <span>{deck.fileCount(kit.fileCount)}</span>
                <h3>{kit.title[lang]}</h3>
                <p>{kit.description[lang]}</p>
                <a href={localizedUrl(kit.examplePath, lang)}>
                  {deck.viewExample}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="prokit-included" aria-labelledby="prokit-included-title">
        <div>
          <span>{deck.eyebrow}</span>
          <h2 id="prokit-included-title">{deck.includedTitle}</h2>
          <p>{deck.includedLead}</p>
          <a className="button button--dark" href={localizedUrl('/', lang)}>
            {deck.storePriceCta}
          </a>
        </div>
        <ul>
          {deck.included.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="prokit-footer-cta">
        <a className="button button--dark" href={localizedUrl('/', lang)}>
          {deck.inspectStore}
        </a>
        <a className="button" href={withLang('/pages/prompt-workflow', lang)}>
          {deck.promptGenerator}
        </a>
      </section>
    </div>
  );
}
