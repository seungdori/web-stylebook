import referenceLibraryMeta from '../catalog/references.generated.meta.json';
import { kitCatalog } from './kitCatalog';
import {
  homeRoute,
  languages,
  localizedRouteUrl,
  publicRoutes,
  siteUrl,
  type RouteDefinition,
} from './routes';
import { getStyleById, localize, styleCatalog, type Lang, type LocalizedText } from './styles';

export const siteName = 'Web Stylebook';

export const localeCode: Record<Lang, string> = {
  en: 'en_US',
  ko: 'ko_KR',
  ja: 'ja_JP',
};

export const languageCode: Record<Lang, string> = {
  en: 'en',
  ko: 'ko-KR',
  ja: 'ja-JP',
};

const cardWidth = 1200;
const cardHeight = 630;

export interface RouteImage {
  url: string;
  width: number;
  height: number;
  type: 'image/png';
  alt: Record<Lang, string>;
}

export interface RouteSeo {
  title: string;
  description: string;
  canonicalUrl: string;
  alternates: Record<Lang, string>;
  locale: string;
  alternateLocales: string[];
  image: RouteImage;
  jsonLd: Record<string, unknown>;
  type: 'website' | 'article';
}

export interface OgCardSpec {
  file: string;
  title: string;
  accent: string;
  swatches: string[];
}

export interface ReferenceSeoSource {
  id: string;
  title: string;
  observedAt: string;
  notes?: LocalizedText;
  layout?: LocalizedText;
  analysis?: { notes: LocalizedText; layout: LocalizedText };
}

const descriptionContext: Record<Lang, string> = {
  en: 'It is part of Web Stylebook, with English, Korean, and Japanese pages.',
  ko: '영어, 한국어, 일본어 페이지가 있는 Web Stylebook의 문서입니다.',
  ja: '英語、韓国語、日本語のページがあるWeb Stylebookの文書です。',
};

const styleContext: Record<Lang, string> = {
  en: 'A design direction in Web Stylebook.',
  ko: 'Web Stylebook의 디자인 방향입니다.',
  ja: 'Web Stylebookのデザイン方向です。',
};

function clean(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function trimDescription(text: string): string {
  if (text.length <= 160) return text;
  const window = text.slice(0, 160);
  let sentence = -1;
  for (const mark of ['. ', '。']) {
    sentence = Math.max(sentence, window.lastIndexOf(mark));
  }
  if (sentence >= 110) return text.slice(0, sentence + 1).trim();
  const space = window.lastIndexOf(' ');
  if (space >= 110) return window.slice(0, space).replace(/[,:;/]+$/, '').trim();
  return window.trim();
}

export function fitMetaDescription(parts: string[]): string {
  const cleanParts: string[] = [];
  const seen = new Set<string>();
  for (const part of parts) {
    const text = clean(part);
    if (!text || seen.has(text)) continue;
    seen.add(text);
    cleanParts.push(text);
  }
  const candidates: string[] = [];
  for (let end = 1; end <= cleanParts.length; end += 1) {
    candidates.push(cleanParts.slice(0, end).join(' '));
  }
  const inRange = candidates.filter((item) => item.length >= 110 && item.length <= 160);
  if (inRange.length) return inRange.sort((a, b) => b.length - a.length)[0];
  const tooLong = candidates.filter((item) => item.length > 160).sort((a, b) => a.length - b.length)[0];
  if (tooLong) {
    const trimmed = trimDescription(tooLong);
    if (trimmed.length >= 110) return trimmed;
  }
  return candidates.sort((a, b) => b.length - a.length)[0] ?? '';
}

function kitSlug(path: string): string | null {
  const prefix = '/pages/components/';
  if (!path.startsWith(prefix)) return null;
  const slug = path.slice(prefix.length);
  return slug && !slug.includes('/') ? slug : null;
}

function routeTitle(route: RouteDefinition, lang: Lang): string {
  const style = route.styleId ? getStyleById(route.styleId) : undefined;
  if (style) {
    const name = style.name.en;
    if (lang === 'ko') return `${name} 스타일 - Web Stylebook`;
    if (lang === 'ja') return `${name} スタイル - Web Stylebook`;
    return `${name} - Web Stylebook`;
  }
  const slug = kitSlug(route.path);
  if (slug && slug !== 'getting-started') {
    const entry = kitCatalog.find((item) => item.slug === slug);
    if (entry) {
      if (lang === 'ko') return `${entry.name} 컴포넌트 - Web Stylebook`;
      if (lang === 'ja') return `${entry.name} コンポーネント - Web Stylebook`;
      return `${entry.name} - Web Stylebook`;
    }
  }
  return localize(route.title, lang);
}

function keywordLine(tags: string[], lang: Lang): string {
  const list = tags.join(', ');
  if (lang === 'ko') return `키워드는 ${list}입니다.`;
  if (lang === 'ja') return `キーワードは${list}です。`;
  return `Keywords: ${list}.`;
}

function routeDescription(route: RouteDefinition, lang: Lang): string {
  const style = route.styleId ? getStyleById(route.styleId) : undefined;
  if (style) {
    return fitMetaDescription([
      localize(style.summary, lang),
      localize(style.description, lang),
      styleContext[lang],
      keywordLine(style.tags, lang),
    ]);
  }
  return fitMetaDescription([
    localize(route.description, lang),
    descriptionContext[lang],
  ]);
}

function hexColor(value: string, fallback: string): string {
  const raw = value.trim();
  return /^#[0-9a-fA-F]{6}$/.test(raw) ? raw.toLowerCase() : fallback;
}

export function ogFileForRoute(route: Pick<RouteDefinition, 'path' | 'styleId'>): string {
  if (route.styleId) return `/og/styles/${route.styleId}.png`;
  if (route.path === '/') return '/og/default.png';
  if (route.path === '/pages/reference-explorer' || route.path.startsWith('/pages/references/')) return '/og/references.png';
  return `/og/routes/${route.path.replace(/^\//, '').replaceAll('/', '-')}.png`;
}

function cardAlt(kind: 'default' | 'references' | 'style' | 'page', subject: string): Record<Lang, string> {
  if (kind === 'style') {
    return {
      en: `${subject} on Web Stylebook. The card shows the style name and palette.`,
      ko: `Web Stylebook의 ${subject} 스타일 카드. 영문 이름과 팔레트가 보입니다.`,
      ja: `Web Stylebookの${subject}スタイルカード。英語名と配色が見えます。`,
    };
  }
  if (kind === 'references') {
    return {
      en: 'Web Stylebook card for real website references, with the site name and palette.',
      ko: '실제 웹사이트 레퍼런스를 위한 Web Stylebook 카드. 사이트 이름과 팔레트가 보입니다.',
      ja: '実在Webサイトの参照のためのWeb Stylebookカード。サイト名と配色が見えます。',
    };
  }
  if (kind === 'default') {
    return {
      en: 'Web Stylebook card reading Design References, with the site name and palette.',
      ko: 'Design References라고 적힌 Web Stylebook 카드. 사이트 이름과 팔레트가 보입니다.',
      ja: 'Design Referencesと書かれたWeb Stylebookのカード。サイト名と配色が見えます。',
    };
  }
  return {
    en: `${subject} on Web Stylebook. The card shows the English title and the site palette.`,
    ko: `${subject} 페이지의 Web Stylebook 카드. 영문 제목과 팔레트가 보입니다.`,
    ja: `${subject}ページのWeb Stylebookカード。英語の題名と配色が見えます。`,
  };
}

function routeImage(route: RouteDefinition): RouteImage {
  const style = route.styleId ? getStyleById(route.styleId) : undefined;
  const kind = style ? 'style' : route.path === '/' ? 'default' : route.path === '/pages/reference-explorer' ? 'references' : 'page';
  const subject = style ? style.name.en : localize(route.title, 'en').replace(/ - Web Stylebook$/, '');
  return {
    url: `${siteUrl}${ogFileForRoute(route)}`,
    width: cardWidth,
    height: cardHeight,
    type: 'image/png',
    alt: cardAlt(kind, subject),
  };
}

const referencesImage: RouteImage = {
  url: `${siteUrl}/og/references.png`,
  width: cardWidth,
  height: cardHeight,
  type: 'image/png',
  alt: cardAlt('references', ''),
};

export function catalogRevision(): string {
  return styleCatalog.reduce((max, style) => (style.createdAt > max ? style.createdAt : max), '').slice(0, 10);
}

export function routeLastModified(route: Pick<RouteDefinition, 'path' | 'styleId'>): string {
  const style = route.styleId ? getStyleById(route.styleId) : undefined;
  if (style) return style.createdAt.slice(0, 10);
  if (route.path === '/pages/reference-explorer' || route.path.startsWith('/pages/references/')) {
    return referenceLibraryMeta.generatedAt.slice(0, 10);
  }
  return catalogRevision();
}

function websiteNode(lang: Lang): Record<string, unknown> {
  const url = localizedRouteUrl('/', lang);
  return {
    '@type': 'WebSite',
    '@id': `${url}#website`,
    name: siteName,
    alternateName: ['webstylebook', 'web stylebook', 'WebStylebook'],
    url,
    description: localize(homeRoute.description, lang),
    inLanguage: languageCode[lang],
    sameAs: ['https://github.com/seungdori/web-stylebook'],
  };
}

function pageNode(input: {
  lang: Lang;
  canonicalUrl: string;
  title: string;
  description: string;
  modifiedAt: string;
  image: RouteImage;
  pageType: string;
  published?: string;
  collection?: Record<string, unknown>;
}): Record<string, unknown> {
  return {
    '@type': input.pageType,
    '@id': `${input.canonicalUrl}#webpage`,
    url: input.canonicalUrl,
    name: input.title,
    headline: input.title,
    description: input.description,
    isPartOf: { '@id': `${localizedRouteUrl('/', input.lang)}#website` },
    inLanguage: languageCode[input.lang],
    datePublished: input.published,
    dateModified: input.modifiedAt,
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: input.image.url,
      width: input.image.width,
      height: input.image.height,
      caption: input.image.alt[input.lang],
    },
    ...input.collection,
  };
}

function buildJsonLd(input: {
  lang: Lang;
  canonicalUrl: string;
  title: string;
  description: string;
  modifiedAt: string;
  image: RouteImage;
  pageType: string;
  published?: string;
  collection?: Record<string, unknown>;
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@graph': [websiteNode(input.lang), pageNode(input)],
  };
}

function alternatesFor(path: string): Record<Lang, string> {
  return Object.fromEntries(languages.map((language) => [language, localizedRouteUrl(path, language)])) as Record<Lang, string>;
}

function seoShell(lang: Lang, path: string, title: string, description: string, image: RouteImage, jsonLd: Record<string, unknown>, type: RouteSeo['type']): RouteSeo {
  return {
    title,
    description,
    canonicalUrl: localizedRouteUrl(path, lang),
    alternates: alternatesFor(path),
    locale: localeCode[lang],
    alternateLocales: languages.filter((language) => language !== lang).map((language) => localeCode[language]),
    image,
    jsonLd,
    type,
  };
}

export function buildRouteSeo(route: RouteDefinition, lang: Lang): RouteSeo {
  const title = routeTitle(route, lang);
  const description = routeDescription(route, lang);
  const image = routeImage(route);
  const modifiedAt = routeLastModified(route);
  const style = route.styleId ? getStyleById(route.styleId) : undefined;
  const pageType = route.kind === 'style' ? 'CreativeWork' : route.path === '/pages/reference-explorer' ? 'CollectionPage' : 'WebPage';
  const collection = route.path === '/pages/reference-explorer'
    ? {
      mainEntity: {
        '@type': 'ItemList',
        name: title,
        numberOfItems: referenceLibraryMeta.referenceCount,
        itemListOrder: 'https://schema.org/ItemListUnordered',
      },
    }
    : undefined;
  return seoShell(
    lang,
    route.path,
    title,
    description,
    image,
    buildJsonLd({
      lang,
      canonicalUrl: localizedRouteUrl(route.path, lang),
      title,
      description,
      modifiedAt,
      image,
      pageType,
      published: style?.createdAt.slice(0, 10),
      collection,
    }),
    route.kind === 'style' ? 'article' : 'website',
  );
}

export function buildReferenceSeo(source: ReferenceSeoSource, lang: Lang): RouteSeo {
  const notes = source.notes ?? source.analysis?.notes;
  const layout = source.layout ?? source.analysis?.layout;
  if (!notes || !layout) throw new Error(`Reference ${source.id} is missing observations`);
  const path = `/pages/references/${source.id}`;
  const title = lang === 'ko'
    ? `${source.title} 디자인 레퍼런스 - Web Stylebook`
    : lang === 'ja'
      ? `${source.title} デザイン参照 - Web Stylebook`
      : `${source.title} design reference - Web Stylebook`;
  const description = fitMetaDescription([
    localize(notes, lang),
    localize(layout, lang),
    descriptionContext[lang],
  ]);
  const modifiedAt = source.observedAt.slice(0, 10);
  return seoShell(
    lang,
    path,
    title,
    description,
    referencesImage,
    buildJsonLd({
      lang,
      canonicalUrl: localizedRouteUrl(path, lang),
      title,
      description,
      modifiedAt,
      image: referencesImage,
      pageType: 'WebPage',
      published: modifiedAt,
    }),
    'article',
  );
}

export function ogCardSpecs(): OgCardSpec[] {
  const specs: OgCardSpec[] = [
    {
      file: '/og/default.png',
      title: 'DESIGN REFERENCES',
      accent: '#b8321a',
      swatches: ['#f6f4f2', '#1a1715', '#b8321a', '#ffffff'],
    },
    {
      file: '/og/references.png',
      title: 'REAL REFERENCES',
      accent: '#2557d6',
      swatches: ['#f6f4f2', '#1a1715', '#2557d6', '#9a3412'],
    },
  ];
  const seen = new Set(specs.map((spec) => spec.file));
  for (const style of styleCatalog) {
    const file = `/og/styles/${style.id}.png`;
    if (seen.has(file)) continue;
    seen.add(file);
    specs.push({
      file,
      title: style.name.en.toUpperCase(),
      accent: hexColor(style.accent, '#1a1715'),
      swatches: style.palette.map((color) => hexColor(color, '#1a1715')).slice(0, 5),
    });
  }
  for (const route of publicRoutes) {
    const file = ogFileForRoute(route);
    if (seen.has(file) || route.path === '/' || route.styleId || route.path === '/pages/reference-explorer') continue;
    seen.add(file);
    specs.push({
      file,
      title: localize(route.title, 'en').replace(/ - Web Stylebook$/i, '').toUpperCase(),
      accent: '#b8321a',
      swatches: ['#f6f4f2', '#1a1715', '#b8321a'],
    });
  }
  return specs;
}

export function routePriority(route: RouteDefinition): string {
  if (route.path === '/') return '1.0';
  if (route.kind === 'style') return '0.8';
  return '0.7';
}

export function routeChangeFrequency(route: RouteDefinition): string {
  if (route.path === '/') return 'weekly';
  return route.kind === 'style' ? 'monthly' : 'monthly';
}
