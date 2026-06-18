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
export const defaultLang: Lang = 'en';

export function isLang(value: string | null | undefined): value is Lang {
  return !!value && (languages as string[]).includes(value);
}

export const homeRoute: RouteDefinition = {
  path: '/',
  kind: 'home',
  title: t(
    'Web Stylebook — Web Design Style References & AI UI Prompts',
    'Web Stylebook — 웹 디자인 스타일 레퍼런스와 AI UI 프롬프트',
    'Web Stylebook — Webデザインスタイル参照とAI UIプロンプト',
  ),
  description: t(
    'Web Stylebook is a practical catalog of web design styles, UI references, color systems, motion patterns, and AI-ready implementation prompts.',
    'Web Stylebook은 웹 디자인 스타일, UI 레퍼런스, 컬러 시스템, 모션 패턴, AI 구현 프롬프트를 모아둔 실전 스타일북입니다.',
    'Web Stylebookは、Webデザインスタイル、UI参照、カラーシステム、モーションパターン、AI実装プロンプトをまとめた実用的なスタイルブックです。',
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
  {
    path: '/pages/pro-kit',
    aliases: ['/pages/pro-kit.html', '/pro-kit', '/pro-kit.html'],
    kind: 'utility',
    title: t(
      'Pro Kit - Web Stylebook',
      'Pro Kit - Web Stylebook',
      'Pro Kit - Web Stylebook',
    ),
    description: t(
      'A Web Stylebook page for Pro Kit bundles, with direct example pages for each product archetype.',
      '제품 유형별 Pro Kit 번들과 실제 예시 페이지를 바로 볼 수 있는 Web Stylebook 내부 페이지입니다.',
      'プロダクト別Pro Kitバンドルと実際のページ例を直接確認できるWeb Stylebook内のページです。',
    ),
  },
];

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
  const normalized = pathname.endsWith('/') && pathname !== '/' ? pathname.slice(0, -1) : pathname;
  return normalized.endsWith('/index.html') ? normalized.slice(0, -'/index.html'.length) || '/' : normalized;
}

export function pathLocale(pathname: string): Lang | null {
  const normalized = normalizePath(pathname);
  const firstSegment = normalized.split('/').filter(Boolean)[0];
  return isLang(firstSegment) ? firstSegment : null;
}

export function stripLocaleFromPath(pathname: string): string {
  const normalized = normalizePath(pathname);
  const segments = normalized.split('/').filter(Boolean);
  if (!isLang(segments[0])) return normalized;
  const stripped = `/${segments.slice(1).join('/')}`;
  return normalizePath(stripped === '/' ? '/' : stripped);
}

export function findRoute(pathname: string): RouteDefinition {
  const normalized = stripLocaleFromPath(pathname);
  return allRoutes.find((route) => route.path === normalized || route.aliases?.includes(normalized)) || homeRoute;
}

export function routeUrl(path: string): string {
  return `${siteUrl}${path === '/' ? '/' : path}`;
}

export function localizedPath(path: string, lang: Lang): string {
  const normalized = stripLocaleFromPath(path);
  if (lang === defaultLang) return normalized;
  return normalized === '/' ? `/${lang}/` : `/${lang}${normalized}`;
}

export function localizedRouteUrl(path: string, lang: Lang): string {
  return `${siteUrl}${localizedPath(path, lang)}`;
}

function pathToFilePath(path: string): string {
  const normalized = normalizePath(path);
  if (normalized === '/') return 'index.html';
  if (!normalized.endsWith('.html')) return `${normalized.replace(/^\//, '')}/index.html`;
  return normalized.replace(/^\//, '');
}

export function routeToFilePath(route: RouteDefinition, lang: Lang = defaultLang): string {
  return pathToFilePath(localizedPath(route.path, lang));
}

export function routeAliasToFilePath(path: string, lang: Lang = defaultLang): string {
  return pathToFilePath(localizedPath(path, lang));
}
