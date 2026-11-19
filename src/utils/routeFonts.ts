import { useEffect } from 'react';
import { isKitPath, type RouteDefinition } from '../data/routes';
import type { Lang } from '../data/styles';
import { originalStyleFonts, routeFontQueries } from '../data/routeFontManifest';
import { loadFontStylesheet } from '../visual/fontLoader';
import { CDN_FONT_STYLESHEETS } from '../visual/fontSources';

// The shell is set in Wanted Sans in every language (Latin and Hangul; Japanese falls
// back to the system face after it). IBM Plex Mono is the code face.
const SHELL_SANS = 'Wanted Sans Variable';
const shellFonts = [SHELL_SANS, 'IBM Plex Mono'];
// Style previews were authored against the earlier shell stack and keep loading it,
// in Korean with the Hangul faces they fall back to. The strip above them is shell text.
const previewFonts = ['Inter', 'Space Grotesk', 'IBM Plex Mono'];
const previewKoreanFonts = ['IBM Plex Sans KR', 'Noto Sans KR', 'Pretendard Variable'];
// These routes do not paint IBM Plex Mono on first view. Compare has no mono text.
// Prompt's code block is inside a closed disclosure and loads the face when it opens.
const routesWithoutShellMono = new Set(['/pages/compare', '/pages/prompt-workflow']);

export function getRouteFontFamilies(route: RouteDefinition, lang: Lang): string[] {
  if (route.kind === 'style' && route.styleId) {
    const korean = lang === 'ko' ? previewKoreanFonts : [];
    return [...new Set([SHELL_SANS, ...previewFonts, ...korean, ...(originalStyleFonts[route.styleId] ?? [])])];
  }
  const families = routesWithoutShellMono.has(route.path) ? shellFonts.filter((family) => family !== 'IBM Plex Mono') : shellFonts;
  // Kit components set Latin in Inter on every language (src/kit/theme.css).
  const kit = isKitPath(route.path) ? ['Inter', ...(lang === 'ko' ? ['Pretendard Variable'] : [])] : [];
  return [...new Set([...families, ...kit])];
}

export function getRouteFontStylesheet(family: string): string | undefined {
  const cdn = CDN_FONT_STYLESHEETS[family];
  if (cdn) return cdn;
  const query = routeFontQueries[family];
  return query ? `https://fonts.googleapis.com/css2?family=${query}&display=swap` : undefined;
}

function loadFamily(family: string) {
  const url = getRouteFontStylesheet(family);
  if (!url) return;
  // Each CSS stack already ends in a system fallback. Network failure must not
  // block rendering or claim that the requested web font successfully loaded.
  void loadFontStylesheet(url).catch(() => undefined);
}

/** Loads the shell fonts and, on a style route, the fonts of the current demo. */
export function useRouteFonts(route: RouteDefinition, lang: Lang) {
  useEffect(() => {
    getRouteFontFamilies(route, lang).forEach(loadFamily);
  }, [route, lang]);
}
