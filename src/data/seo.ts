import {
  languages,
  localizedRouteUrl,
  routeUrl,
  siteUrl,
  type RouteDefinition,
} from './routes';
import { getStyleById, localize, type Lang } from './styles';

export const siteName = 'Web Stylebook';
export const siteDescription =
  'Explore 48 web design references, practical UX and visual design guides, UI vocabulary, interactive tools, and AI-ready frontend prompts.';

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

export const socialImage = {
  url: `${siteUrl}/social-card.jpg`,
  width: 1280,
  height: 800,
  type: 'image/jpeg',
  alt: {
    en: 'Web Stylebook interface preview with curated design systems.',
    ko: '큐레이션된 디자인 시스템을 보여주는 Web Stylebook 인터페이스 미리보기.',
    ja: '厳選されたデザインシステムを示すWeb Stylebookのプレビュー。',
  } satisfies Record<Lang, string>,
};

export interface RouteSeo {
  title: string;
  description: string;
  canonicalUrl: string;
  alternates: Record<Lang, string>;
  locale: string;
  alternateLocales: string[];
  image: typeof socialImage;
  jsonLd: Record<string, unknown>;
  type: 'website' | 'article';
}

function buildRouteJsonLd(route: RouteDefinition, lang: Lang, modifiedAt: string): Record<string, unknown> {
  const title = localize(route.title, lang);
  const description = localize(route.description, lang);
  const canonicalUrl = localizedRouteUrl(route.path, lang);
  const style = route.styleId ? getStyleById(route.styleId) : undefined;
  const pageType = route.kind === 'style' ? 'CreativeWork' : 'WebPage';

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: siteName,
        alternateName: ['webstylebook', 'web stylebook', 'WebStylebook'],
        url: routeUrl('/'),
        description: siteDescription,
        inLanguage: languageCode[lang],
        sameAs: ['https://github.com/seungdori/web-stylebook'],
      },
      {
        '@type': pageType,
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: title,
        headline: title,
        description,
        isPartOf: { '@id': `${siteUrl}/#website` },
        inLanguage: languageCode[lang],
        datePublished: style?.createdAt,
        dateModified: modifiedAt,
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: socialImage.url,
          width: socialImage.width,
          height: socialImage.height,
          caption: socialImage.alt[lang],
        },
      },
    ],
  };
}

export function buildRouteSeo(route: RouteDefinition, lang: Lang, modifiedAt = new Date().toISOString()): RouteSeo {
  const alternates = Object.fromEntries(
    languages.map((language) => [language, localizedRouteUrl(route.path, language)]),
  ) as Record<Lang, string>;

  return {
    title: localize(route.title, lang),
    description: localize(route.description, lang),
    canonicalUrl: localizedRouteUrl(route.path, lang),
    alternates,
    locale: localeCode[lang],
    alternateLocales: languages.filter((language) => language !== lang).map((language) => localeCode[language]),
    image: socialImage,
    jsonLd: buildRouteJsonLd(route, lang, modifiedAt),
    type: route.kind === 'style' ? 'article' : 'website',
  };
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
