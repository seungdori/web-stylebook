import type { ReactNode } from 'react';
import type { Lang } from '../data/styles';
import { translate } from '../data/i18n';
import { Nav } from './Nav';
import { Footer } from './Footer';
import { WorkspaceStatus } from './WorkspaceStatus';
import { findRoute } from '../data/routes';

interface LayoutProps {
  lang: Lang;
  onLanguageChange: (lang: Lang) => void;
  children: ReactNode;
  fullBleed?: boolean;
}

export function Layout({ lang, onLanguageChange, children, fullBleed = false }: LayoutProps) {
  const routePath = findRoute(window.location.pathname).path;
  const showWorkspace = ['/', '/pages/compare', '/pages/color-system', '/pages/typography', '/pages/prompt-workflow'].includes(routePath);
  return (
    <>
      <a className="skip-link" href="#main-content">
        {translate(lang, 'skip')}
      </a>
      <Nav lang={lang} onLanguageChange={onLanguageChange} />
      {showWorkspace ? <WorkspaceStatus lang={lang} /> : null}
      <main id="main-content" className={fullBleed ? 'main main--wide' : 'main'}>
        {children}
      </main>
      <Footer lang={lang} />
    </>
  );
}
