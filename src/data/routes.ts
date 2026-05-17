import { styleCatalog, type Lang, type LocalizedText } from './styles';

export type RouteKind = 'home' | 'style' | 'utility';

export interface RouteDefinition {
  path: string;
  aliases?: string[];
  kind: RouteKind;
  title: LocalizedText;
  description: LocalizedText;
  styleId?: string;
  // When true, the route stays available in dev (App.tsx still renders it) but
  // is excluded from sitemap generation, static HTML output, and nav links.
  // Use for unreleased pages we don't want findable on the live site yet.
  hidden?: boolean;
}

const t = (en: string, ko: string, ja: string): LocalizedText => ({ en, ko, ja });

export const siteUrl = 'https://webstylebook.com';
export const languages: Lang[] = ['en', 'ko', 'ja'];

export const homeRoute: RouteDefinition = {
  path: '/',
  kind: 'home',
  title: t(
    'Web Design Styles — Style References & Prompt Workflows | Web Stylebook',
    '웹 디자인 스타일 — 스타일 레퍼런스와 프롬프트 워크플로우 | Web Stylebook',
    'Web Design Styles — スタイル参照とプロンプトワークフロー | Web Stylebook',
  ),
  description: t(
    'A practical catalog for choosing a visual direction, comparing styles, and turning decisions into implementation prompts.',
    '디자인 방향을 고르고, 스타일을 비교하고, 바로 구현 프롬프트로 이어가기 위한 실전 스타일북입니다.',
    'デザインの方向性を選び、スタイルを比較し、そのまま実装プロンプトへつなげる実用的なスタイルブックです。',
  ),
};

export const utilityRoutes: RouteDefinition[] = [
  {
    path: '/pages/compare',
    aliases: ['/pages/compare.html'],
    kind: 'utility',
    title: t('Style Compare - Web Stylebook', '스타일 비교 - Web Stylebook', 'スタイル比較 - Web Stylebook'),
    description: t(
      'Compare web design styles side by side with responsive previews.',
      '웹 디자인 스타일을 나란히 놓고 반응형 미리보기로 비교합니다.',
      'Webデザインスタイルを横並びで比較し、レスポンシブに確認します。',
    ),
  },
  {
    path: '/pages/prompt-workflow',
    aliases: ['/pages/prompt-workflow.html'],
    kind: 'utility',
    title: t('Prompt Generator - Web Stylebook', '프롬프트 생성기 - Web Stylebook', 'プロンプト生成 - Web Stylebook'),
    description: t(
      'Generate implementation-ready design, component, assembly, and QA prompts from selected style references.',
      '선택한 스타일 레퍼런스에서 설계, 컴포넌트, 조립, QA 프롬프트를 바로 생성합니다.',
      '選択したスタイルから設計、コンポーネント、組み立て、QAプロンプトを生成します。',
    ),
  },
  {
    path: '/pages/color-system',
    aliases: ['/pages/color-system.html'],
    kind: 'utility',
    title: t('Color System - Web Stylebook', '색상 시스템 - Web Stylebook', 'カラーシステム - Web Stylebook'),
    description: t(
      'Test curated palettes, contrast ratios, and exportable color tokens for modern web interfaces.',
      '큐레이션 팔레트, 명도 대비, 내보내기 가능한 컬러 토큰을 테스트합니다.',
      'キュレーションされた配色、コントラスト、書き出し可能なカラートークンを確認します。',
    ),
  },
  {
    path: '/pages/prompt-tips',
    aliases: ['/pages/prompt-tips.html'],
    kind: 'utility',
    title: t('Prompt Tips - Web Stylebook', '프롬프트 팁 - Web Stylebook', 'プロンプトTips - Web Stylebook'),
    description: t(
      'Practical prompting principles that keep AI-generated interfaces from becoming generic.',
      'AI 생성 인터페이스가 평범해지지 않도록 막는 실전 프롬프트 원칙입니다.',
      'AI生成UIが凡庸にならないための実践的なプロンプト原則です。',
    ),
  },
  {
    path: '/pages/animation-lab',
    aliases: ['/pages/animation-lab.html'],
    kind: 'utility',
    title: t('Animation Lab - Web Stylebook', '애니메이션 랩 - Web Stylebook', 'アニメーションラボ - Web Stylebook'),
    description: t(
      'A visual glossary for people who know the feeling they want, but not the animation name.',
      '원하는 느낌은 아는데 애니메이션 이름을 모르는 사람을 위한 시각 사전입니다.',
      '欲しい雰囲気は分かるけれど名前が分からない人のための視覚的なモーション辞典です。',
    ),
  },
  {
    path: '/pages/animation-example',
    aliases: ['/pages/animation-example.html'],
    kind: 'utility',
    title: t('Animation Showcase - Web Stylebook', '애니메이션 쇼케이스 - Web Stylebook', 'アニメーションショーケース - Web Stylebook'),
    description: t(
      'A quiet motion workspace for comparing reveal, touch, state, loading, and ambient animation effects from Animation Lab.',
      '애니메이션 랩의 등장, 반응, 상태 전환, 로딩, 배경 움직임을 차분하게 비교하는 모션 워크스페이스입니다.',
      'アニメーションラボの表示、反応、状態変化、読み込み、環境モーションを静かに比較するモーションワークスペースです。',
    ),
  },
  {
    path: '/pages/component-glossary',
    aliases: ['/pages/component-glossary.html'],
    kind: 'utility',
    title: t('Component Glossary - Web Stylebook', '컴포넌트 용어집 - Web Stylebook', 'コンポーネント用語集 - Web Stylebook'),
    description: t(
      'Plain-language explanations of common frontend component names such as hover, focus, dropdown, modal, toast, tabs, cards, and skeleton loading.',
      '호버, 포커스, 드롭다운, 모달, 토스트, 탭, 카드, 스켈레톤 로딩처럼 자주 쓰는 프론트엔드 컴포넌트 명칭을 일반인도 이해하기 쉽게 설명합니다.',
      'ホバー、フォーカス、ドロップダウン、モーダル、トースト、タブ、カード、スケルトンローディングなど、よく使うフロントエンド用語をやさしく説明します。',
    ),
  },
];

// Pro Kit is dev-only until the paid product ships. In Vite production builds
// `import.meta.env.DEV` is statically replaced with `false`, so Rollup deletes
// the whole if-block and no `pro-kit` metadata (path, title, description)
// reaches the public bundle. In Node build scripts (tsx) `import.meta.env` is
// undefined and the access throws — the catch swallows it because those
// scripts already exclude hidden routes via `publicRoutes`.
try {
  if (import.meta.env.DEV) {
    utilityRoutes.push({
      path: '/pages/pro-kit',
      aliases: ['/pages/pro-kit.html'],
      kind: 'utility',
      hidden: true,
      title: t(
        'Pro Kit — Style implementation bundles - Web Stylebook',
        'Pro Kit — 스타일 구현 번들 - Web Stylebook',
        'Pro Kit — スタイル実装バンドル - Web Stylebook',
      ),
      description: t(
        'Generate repeatable style implementation kits for Codex, Lovable, Framer, and Webflow from product archetypes.',
        '제품 유형에서 Codex, Lovable, Framer, Webflow용 반복 가능한 스타일 구현 키트를 생성합니다.',
        'プロダクト種別からCodex、Lovable、Framer、Webflow向けの再利用可能なスタイル実装キットを生成します。',
      ),
    });
    utilityRoutes.push({
      path: '/pages/pro-kit/operational-saas-example',
      aliases: ['/pages/pro-kit/operational-saas-example.html'],
      kind: 'utility',
      hidden: true,
      title: t('Operational SaaS Example - Web Stylebook', '운영형 SaaS 예시 - Web Stylebook', '運用SaaS例 - Web Stylebook'),
      description: t(
        'A working operational SaaS page example based on the Pro Kit catalog direction.',
        'Pro Kit 카탈로그의 운영형 SaaS 방향을 실제 운영 콘솔 화면으로 만든 예시입니다.',
        'Pro Kitカタログの運用SaaS方向を実際の運用コンソール画面にした例です。',
      ),
    });
    utilityRoutes.push({
      path: '/pages/pro-kit/portfolio-expressive-example',
      aliases: ['/pages/pro-kit/portfolio-expressive-example.html'],
      kind: 'utility',
      hidden: true,
      title: t(
        'Portfolio Expressive Example - Web Stylebook',
        '포트폴리오 (Expressive) 예시 - Web Stylebook',
        'ポートフォリオ (Expressive) 例 - Web Stylebook',
      ),
      description: t(
        'A working bento-grid studio portfolio built end-to-end on the expressive Pro Kit.',
        'Expressive Pro Kit으로 처음부터 끝까지 만든 벤토 그리드 스튜디오 포트폴리오 예시입니다.',
        'Expressive Pro Kitで端から端まで作ったベントグリッドのスタジオポートフォリオ例。',
      ),
    });
    utilityRoutes.push({
      path: '/pages/pro-kit/portfolio-studio-example',
      aliases: ['/pages/pro-kit/portfolio-studio-example.html'],
      kind: 'utility',
      hidden: true,
      title: t(
        'Portfolio Studio (editorial) Example - Web Stylebook',
        '포트폴리오 / 스튜디오 (editorial) 예시 - Web Stylebook',
        'ポートフォリオ / スタジオ (editorial) 例 - Web Stylebook',
      ),
      description: t(
        'A working editorial studio portfolio built end-to-end on the portfolio-studio Pro Kit.',
        'Portfolio Studio Pro Kit으로 처음부터 끝까지 만든 에디토리얼 스튜디오 포트폴리오 예시입니다.',
        'Portfolio Studio Pro Kitで端から端まで作ったエディトリアルスタジオのポートフォリオ例。',
      ),
    });
    utilityRoutes.push({
      path: '/pages/pro-kit/developer-docs-example',
      aliases: ['/pages/pro-kit/developer-docs-example.html'],
      kind: 'utility',
      hidden: true,
      title: t(
        'Developer Docs Example - Web Stylebook',
        '개발자 문서 예시 - Web Stylebook',
        '開発者ドキュメント例 - Web Stylebook',
      ),
      description: t(
        'A working editorial-terminal developer docs page built end-to-end on the developer-docs Pro Kit.',
        'Developer Docs Pro Kit으로 처음부터 끝까지 만든 에디토리얼-터미널 개발자 문서 예시입니다.',
        'Developer Docs Pro Kitで端から端まで作ったエディトリアル+ターミナル混合の開発者ドキュメント例。',
      ),
    });
    utilityRoutes.push({
      path: '/pages/pro-kit/launch-campaign-example',
      aliases: ['/pages/pro-kit/launch-campaign-example.html'],
      kind: 'utility',
      hidden: true,
      title: t(
        'Launch Campaign Example - Web Stylebook',
        '런칭 캠페인 예시 - Web Stylebook',
        'ローンチキャンペーン例 - Web Stylebook',
      ),
      description: t(
        'A working kinetic-brutalist drop campaign built end-to-end on the launch-campaign Pro Kit.',
        'Launch Campaign Pro Kit으로 처음부터 끝까지 만든 키네틱 브루탈리스트 드롭 캠페인 예시입니다.',
        'Launch Campaign Pro Kitで端から端まで作ったキネティック・ブルータリストのドロップキャンペーン例。',
      ),
    });
    utilityRoutes.push({
      path: '/pages/pro-kit/developer-tool-example',
      aliases: ['/pages/pro-kit/developer-tool-example.html'],
      kind: 'utility',
      hidden: true,
      title: t(
        'Developer Tool Example - Web Stylebook',
        '개발자 도구 예시 - Web Stylebook',
        '開発者ツール例 - Web Stylebook',
      ),
      description: t(
        'A working terminal-core CLI product page built end-to-end on the developer-tool Pro Kit.',
        'Developer Tool Pro Kit으로 처음부터 끝까지 만든 터미널 코어 CLI 제품 페이지 예시입니다.',
        'Developer Tool Pro Kitで端から端まで作ったターミナル・コアCLIプロダクトページ例。',
      ),
    });
  }
} catch {
  // tsx / Node ESM has no import.meta.env — fine, build scripts already skip.
}

export const styleRoutes: RouteDefinition[] = styleCatalog.map((style) => ({
  path: style.route,
  aliases: [`${style.route}.html`],
  kind: 'style',
  styleId: style.id,
  title: style.seo.title,
  description: style.seo.description,
}));

export const allRoutes: RouteDefinition[] = [homeRoute, ...styleRoutes, ...utilityRoutes];

// `publicRoutes` is the canonical list for anything that publishes URLs to the
// outside world: sitemap, static HTML generation, agent-handoff. Hidden routes
// stay in `allRoutes` so `findRoute` still resolves them for local dev.
export const publicRoutes: RouteDefinition[] = allRoutes.filter((route) => !route.hidden);

export function normalizePath(pathname: string): string {
  if (!pathname || pathname === '/index.html') return '/';
  return pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;
}

export function findRoute(pathname: string): RouteDefinition {
  const normalized = normalizePath(pathname);
  return allRoutes.find((route) => route.path === normalized || route.aliases?.includes(normalized)) || homeRoute;
}

export function routeUrl(path: string): string {
  return `${siteUrl}${path === '/' ? '/' : path}`;
}

export function localizedRouteUrl(path: string, lang: Lang): string {
  const base = routeUrl(path);
  return lang === 'en' ? base : `${base}?lang=${lang}`;
}

export function routeToFilePath(route: RouteDefinition): string {
  if (route.path === '/') return 'index.html';
  if (!route.path.endsWith('.html')) return `${route.path.replace(/^\//, '')}/index.html`;
  return route.path.replace(/^\//, '');
}

export function routeAliasToFilePath(path: string): string {
  if (path === '/' || path === '/index.html') return 'index.html';
  if (!path.endsWith('.html')) return `${path.replace(/^\//, '')}/index.html`;
  return path.replace(/^\//, '');
}
