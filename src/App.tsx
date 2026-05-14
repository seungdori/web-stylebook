import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { findRoute } from './data/routes';
import type { Lang } from './data/styles';
import { getStyleById } from './data/styles';
import { Layout } from './components/Layout';
import { parseLang } from './utils/language';
import { applySeo } from './utils/seo';

const Home = lazy(() => import('./pages/Home').then(({ Home }) => ({ default: Home })));
const StyleDetail = lazy(() => import('./pages/StyleDetail').then(({ StyleDetail }) => ({ default: StyleDetail })));
const Compare = lazy(() => import('./pages/Compare').then(({ Compare }) => ({ default: Compare })));
const PromptWorkflow = lazy(() => import('./pages/PromptWorkflow').then(({ PromptWorkflow }) => ({ default: PromptWorkflow })));
const ColorSystem = lazy(() => import('./pages/ColorSystem').then(({ ColorSystem }) => ({ default: ColorSystem })));
const PromptTips = lazy(() => import('./pages/PromptTips').then(({ PromptTips }) => ({ default: PromptTips })));
const AnimationLab = lazy(() => import('./pages/AnimationLab').then(({ AnimationLab }) => ({ default: AnimationLab })));
const MotionExample = lazy(() => import('./pages/MotionExample').then(({ MotionExample }) => ({ default: MotionExample })));
const ComponentGlossary = lazy(() => import('./pages/ComponentGlossary').then(({ ComponentGlossary }) => ({ default: ComponentGlossary })));

function readLocation() {
  return {
    pathname: window.location.pathname,
    search: window.location.search,
  };
}

function loadingLabel(lang: Lang) {
  if (lang === 'ko') return '페이지 불러오는 중';
  if (lang === 'ja') return 'ページを読み込み中';
  return 'Loading page';
}

function RouteFallback({ lang }: { lang: Lang }) {
  return (
    <div className="route-fallback" role="status" aria-live="polite">
      <span />
      <strong>{loadingLabel(lang)}</strong>
    </div>
  );
}

export function App() {
  const [locationState, setLocationState] = useState(readLocation);
  const [lang, setLang] = useState<Lang>(() => parseLang(window.location.search));

  const route = useMemo(() => findRoute(locationState.pathname), [locationState.pathname]);

  useEffect(() => {
    const onPop = () => {
      setLocationState(readLocation());
      setLang(parseLang(window.location.search));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    applySeo(locationState.pathname, lang);
  }, [lang, locationState.pathname]);

  function changeLanguage(nextLang: Lang) {
    const params = new URLSearchParams(window.location.search);
    if (nextLang === 'en') params.delete('lang');
    else params.set('lang', nextLang);
    const nextSearch = params.toString() ? `?${params.toString()}` : '';
    const nextUrl = `${window.location.pathname}${nextSearch}${window.location.hash}`;
    window.history.pushState({}, '', nextUrl);
    setLang(nextLang);
    setLocationState(readLocation());
  }

  if (route.kind === 'style') {
    const style = getStyleById(route.styleId);
    if (style) {
      return (
        <Suspense fallback={<RouteFallback lang={lang} />}>
          <StyleDetail style={style} lang={lang} />
        </Suspense>
      );
    }
  }

  let page = <Home lang={lang} />;
  let wide = false;

  if (route.path === '/pages/compare') {
    page = <Compare lang={lang} />;
    wide = true;
  } else if (route.path === '/pages/prompt-workflow') {
    page = <PromptWorkflow lang={lang} />;
  } else if (route.path === '/pages/color-system') {
    page = <ColorSystem lang={lang} />;
    wide = true;
  } else if (route.path === '/pages/prompt-tips') {
    page = <PromptTips lang={lang} />;
  } else if (route.path === '/pages/animation-lab') {
    page = <AnimationLab lang={lang} />;
  } else if (route.path === '/pages/animation-example') {
    page = <MotionExample lang={lang} />;
    wide = true;
  } else if (route.path === '/pages/component-glossary') {
    page = <ComponentGlossary lang={lang} />;
    wide = true;
  }

  return (
    <Layout lang={lang} onLanguageChange={changeLanguage} fullBleed={wide}>
      <Suspense fallback={<RouteFallback lang={lang} />}>
        {page}
      </Suspense>
    </Layout>
  );
}
