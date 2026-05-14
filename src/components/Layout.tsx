import type { ReactNode } from 'react';
import type { Lang } from '../data/styles';
import { translate } from '../data/i18n';
import { Nav } from './Nav';
import { Footer } from './Footer';

interface LayoutProps {
  lang: Lang;
  onLanguageChange: (lang: Lang) => void;
  children: ReactNode;
  fullBleed?: boolean;
}

export function Layout({ lang, onLanguageChange, children, fullBleed = false }: LayoutProps) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        {translate(lang, 'skip')}
      </a>
      <Nav lang={lang} onLanguageChange={onLanguageChange} />
      <main id="main-content" className={fullBleed ? 'main main--wide' : 'main'}>
        {children}
      </main>
      <Footer lang={lang} />
    </>
  );
}
