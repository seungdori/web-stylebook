import { useEffect, useRef, useState } from 'react';
import type { Lang } from '../data/styles';
import { translate } from '../data/i18n';
import { withLang } from '../utils/language';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavProps {
  lang: Lang;
  onLanguageChange: (lang: Lang) => void;
}

const toolLinks: Array<{ href: string; key: string }> = [
  // Pro Kit is hidden until the paid product ships. Route still works in dev.
  // { href: '/pages/pro-kit', key: 'nav.proKit' },
  { href: '/pages/compare', key: 'nav.compare' },
  { href: '/pages/color-system', key: 'nav.colors' },
  { href: '/pages/prompt-tips', key: 'nav.tips' },
];

export function Nav({ lang, onLanguageChange }: NavProps) {
  const [open, setOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!toolsOpen) return;
    const handlePointer = (event: MouseEvent) => {
      if (!toolsRef.current?.contains(event.target as Node)) {
        setToolsOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setToolsOpen(false);
    };
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [toolsOpen]);

  const closeAll = () => {
    setOpen(false);
    setToolsOpen(false);
  };

  const item = (href: string, key: string) => (
    <a href={withLang(href, lang)} onClick={closeAll}>
      {translate(lang, key)}
    </a>
  );

  return (
    <nav className="site-nav" aria-label="Main navigation">
      <div className="site-nav__inner">
        <a className="site-nav__logo" href={withLang('/', lang)} onClick={closeAll}>
          Web Stylebook
        </a>
        <button
          className="nav-burger"
          type="button"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
        <div className={`site-nav__panel ${open ? 'is-open' : ''}`}>
          <div className="site-nav__links">
            {item('/#styles', 'nav.styles')}
            {item('/pages/prompt-workflow', 'nav.workflow')}
            {item('/pages/component-glossary', 'nav.glossary.combined')}
            <div className={`nav-tools ${toolsOpen ? 'is-open' : ''}`} ref={toolsRef}>
              <button
                className="nav-tools__trigger"
                type="button"
                aria-expanded={toolsOpen}
                aria-haspopup="menu"
                aria-label={translate(lang, 'nav.tools.aria')}
                onClick={() => setToolsOpen((value) => !value)}
              >
                <span>{translate(lang, 'nav.tools')}</span>
                <svg className="nav-tools__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div className="nav-tools__menu" role="menu">
                {toolLinks.map(({ href, key }) => (
                  <a key={key} href={withLang(href, lang)} role="menuitem" onClick={closeAll}>
                    {translate(lang, key)}
                  </a>
                ))}
              </div>
            </div>
            <a href="https://github.com/seungdori/web-stylebook" target="_blank" rel="noreferrer" onClick={closeAll}>
              {translate(lang, 'nav.github')}
            </a>
          </div>
          <LanguageSwitcher lang={lang} onChange={onLanguageChange} />
        </div>
      </div>
    </nav>
  );
}
