import { useEffect, useRef, useState } from 'react';
import type { Lang } from '../data/styles';
import { translate } from '../data/i18n';
import { stripLocaleFromPath } from '../data/routes';
import { withLang } from '../utils/language';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavProps {
  lang: Lang;
  onLanguageChange: (lang: Lang) => void;
}

type MenuId = 'guide' | 'tools';

interface MenuLink {
  href: string;
  key: string;
  hintKey: string;
}

const guideLinks: MenuLink[] = [
  { href: '/pages/ux-principles', key: 'nav.principles', hintKey: 'nav.principles.hint' },
  { href: '/pages/design-principles', key: 'nav.designPrinciples', hintKey: 'nav.designPrinciples.hint' },
  { href: '/pages/component-glossary', key: 'nav.glossary', hintKey: 'nav.glossary.hint' },
];

const toolLinks: MenuLink[] = [
  { href: '/pages/compare', key: 'nav.compare', hintKey: 'nav.compare.hint' },
  { href: '/pages/color-system', key: 'nav.colors', hintKey: 'nav.colors.hint' },
  { href: '/pages/animation-lab', key: 'nav.animation', hintKey: 'nav.animation.hint' },
  { href: '/pages/prompt-tips', key: 'nav.tips', hintKey: 'nav.tips.hint' },
];

export function Nav({ lang, onLanguageChange }: NavProps) {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuId | null>(null);
  const menusRef = useRef<HTMLDivElement>(null);
  const currentPath = stripLocaleFromPath(window.location.pathname);

  useEffect(() => {
    if (!activeMenu) return;
    const handlePointer = (event: MouseEvent) => {
      if (!menusRef.current?.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveMenu(null);
    };
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [activeMenu]);

  const closeAll = () => {
    setOpen(false);
    setActiveMenu(null);
  };

  const item = (href: string, key: string) => (
    <a href={withLang(href, lang)} onClick={closeAll}>
      {translate(lang, key)}
    </a>
  );

  const menu = (id: MenuId, labelKey: string, ariaKey: string, links: MenuLink[]) => {
    const isOpen = activeMenu === id;
    const isCurrent = links.some(({ href }) => currentPath === href);
    return (
      <div className={`nav-menu ${isOpen ? 'is-open' : ''} ${isCurrent ? 'is-current' : ''}`}>
        <button
          className="nav-menu__trigger"
          type="button"
          aria-expanded={isOpen}
          aria-controls={`nav-menu-${id}`}
          aria-label={translate(lang, ariaKey)}
          onClick={() => setActiveMenu((value) => (value === id ? null : id))}
        >
          <span>{translate(lang, labelKey)}</span>
          <svg className="nav-menu__chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <div className="nav-menu__panel" id={`nav-menu-${id}`}>
          {links.map(({ href, key, hintKey }) => (
            <a
              className={currentPath === href ? 'is-current' : undefined}
              key={key}
              href={withLang(href, lang)}
              aria-current={currentPath === href ? 'page' : undefined}
              onClick={closeAll}
            >
              <span>{translate(lang, key)}</span>
              <small>{translate(lang, hintKey)}</small>
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <nav className="site-nav" aria-label={translate(lang, 'nav.main.aria')}>
      <div className="site-nav__inner">
        <a className="site-nav__logo" href={withLang('/', lang)} onClick={closeAll}>
          Web Stylebook
        </a>
        <button
          className="nav-burger"
          type="button"
          aria-expanded={open}
          aria-controls="site-nav-panel"
          aria-label={translate(lang, open ? 'nav.menu.close' : 'nav.menu.open')}
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>
        <div className={`site-nav__panel ${open ? 'is-open' : ''}`} id="site-nav-panel">
          <div className="site-nav__links" ref={menusRef}>
            {item('/#styles', 'nav.styles')}
            {item('/pages/reference-explorer', 'nav.references')}
            {item('/pages/pro-kit', 'nav.proKit')}
            {item('/pages/prompt-workflow', 'nav.workflow')}
            {menu('guide', 'nav.designGuide', 'nav.designGuide.aria', guideLinks)}
            {menu('tools', 'nav.tools', 'nav.tools.aria', toolLinks)}
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
