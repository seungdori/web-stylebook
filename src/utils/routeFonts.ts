import { useEffect } from 'react';
import type { RouteDefinition } from '../data/routes';
import type { Lang } from '../data/styles';
import { originalStyleFonts, routeFontQueries } from '../data/routeFontManifest';
import { loadFontStylesheet } from '../visual/fontLoader';
import { PRETENDARD_STYLESHEET } from '../visual/fontSources';

const shellFonts = ['Inter', 'Space Grotesk', 'IBM Plex Mono'];
// Korean chrome is set Hangul-first in Pretendard, which also carries the body Latin.
// Space Grotesk (logo, Latin display) and IBM Plex Mono (labels, code) stay separate.
const koreanShellFonts = ['Space Grotesk', 'IBM Plex Mono', 'Pretendard Variable'];
// Style previews were authored against the earlier shell stack and keep it.
const previewKoreanFonts = ['IBM Plex Sans KR', 'Noto Sans KR'];
// These routes do not paint IBM Plex Mono on first view. Compare has no mono text.
// Prompt's code block is inside a closed disclosure and loads the face when it opens.
const routesWithoutShellMono = new Set(['/pages/compare', '/pages/prompt-workflow']);

export function getRouteFontFamilies(route: RouteDefinition, lang: Lang): string[] {
  if (route.kind === 'style' && route.styleId) {
    // The chrome bar above the preview is Korean text in Pretendard.
    const korean = lang === 'ko' ? [...previewKoreanFonts, 'Pretendard Variable'] : [];
    return [...new Set([...shellFonts, ...korean, ...(originalStyleFonts[route.styleId] ?? [])])];
  }
  const shell = lang === 'ko' ? koreanShellFonts : shellFonts;
  const families = routesWithoutShellMono.has(route.path) ? shell.filter((family) => family !== 'IBM Plex Mono') : shell;
  return [...new Set(families)];
}

export function getRouteFontStylesheet(family: string): string | undefined {
  if (family === 'Pretendard Variable') return PRETENDARD_STYLESHEET;
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

/** Loads shell and current-demo fonts, then progressively loads visible card titles. */
export function useRouteFonts(route: RouteDefinition, lang: Lang) {
  const { kind, path } = route;

  useEffect(() => {
    getRouteFontFamilies(route, lang).forEach(loadFamily);
  }, [route, lang]);

  useEffect(() => {
    if (kind !== 'home') return;
    const root = document.getElementById('root');
    if (!root) return;

    const observed = new WeakSet<Element>();
    function loadCardTitle(card: Element) {
      const title = card.querySelector('h3');
      if (!title) return;
      // Only the first authored family is needed; later families are fallbacks.
      const family = getComputedStyle(title).fontFamily.split(',')[0].trim().replace(/^['"]|['"]$/g, '');
      loadFamily(family);
    }

    const visibility = typeof IntersectionObserver === 'function'
      ? new IntersectionObserver((entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          loadCardTitle(entry.target);
          visibility?.unobserve(entry.target);
        }
      }, { rootMargin: '160px' })
      : null;

    function registerCards() {
      if (!root) return;
      for (const card of root.querySelectorAll('.style-card[data-style-id]')) {
        if (observed.has(card)) continue;
        observed.add(card);
        if (visibility) visibility.observe(card);
        else loadCardTitle(card);
      }
    }

    // The lazy page and filtering can add cards after App's effect has run.
    const additions = new MutationObserver(registerCards);
    additions.observe(root, { childList: true, subtree: true });
    registerCards();
    return () => {
      additions.disconnect();
      visibility?.disconnect();
    };
  }, [kind, path, lang]);
}
