import { useEffect, useRef, useState } from 'react';
import type { Lang } from '../data/styles';
import { translate } from '../data/i18n';
import { isKitPath, stripLocaleFromPath } from '../data/routes';
import { KIT_PATH } from '../data/kitCatalog';
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

const GITHUB_URL = 'https://github.com/seungdori/web-stylebook';

// The visible label of the button that opens the folded menu under 1080px.
const menuLabel: Record<Lang, string> = { en: 'Menu', ko: '메뉴', ja: 'メニュー' };

const guideLinks: MenuLink[] = [
  { href: '/pages/ux-principles', key: 'nav.principles', hintKey: 'nav.principles.hint' },
  { href: '/pages/design-principles', key: 'nav.designPrinciples', hintKey: 'nav.designPrinciples.hint' },
  { href: '/pages/component-glossary', key: 'nav.glossary', hintKey: 'nav.glossary.hint' },
  { href: '/pages/components', key: 'nav.components', hintKey: 'nav.components.hint' },
];

const toolLinks: MenuLink[] = [
  { href: '/pages/compare', key: 'nav.compare', hintKey: 'nav.compare.hint' },
  { href: '/pages/color-system', key: 'nav.colors', hintKey: 'nav.colors.hint' },
  { href: '/pages/typography', key: 'nav.typography', hintKey: 'nav.typography.hint' },
  { href: '/pages/animation-lab', key: 'nav.animation', hintKey: 'nav.animation.hint' },
  { href: '/pages/prompt-tips', key: 'nav.tips', hintKey: 'nav.tips.hint' },
];

export function Nav({ lang, onLanguageChange }: NavProps) {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuId | null>(null);
  const menusRef = useRef<HTMLElement>(null);
  const currentPath = stripLocaleFromPath(window.location.pathname);
  // Each component page belongs to the Components entry.
  const section = isKitPath(currentPath) ? KIT_PATH : currentPath;

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

  // The Styles entry is the catalogue on the home page.
  const item = (href: string, key: string, current: boolean) => (
    <a className="site-menu__item" href={withLang(href, lang)} aria-current={current ? 'page' : undefined} onClick={closeAll}>
      {translate(lang, key)}
    </a>
  );

  const menu = (id: MenuId, labelKey: string, ariaKey: string, links: MenuLink[]) => {
    const isOpen = activeMenu === id;
    const isCurrent = links.some(({ href }) => section === href);
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
              className={section === href ? 'is-current' : undefined}
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
    <header className={`site-header ${open ? 'is-open' : ''}`}>
      <div className="site-header__inner">
        <a className="site-header__brand" href={withLang('/', lang)} onClick={closeAll}>
          Web Stylebook
        </a>
        <nav className="site-menu" id="site-menu" aria-label={translate(lang, 'nav.main.aria')} ref={menusRef}>
          {item('/#styles', 'nav.styles', currentPath === '/')}
          {item('/pages/reference-explorer', 'nav.references', currentPath === '/pages/reference-explorer')}
          {item('/pages/pro-kit', 'nav.proKit', currentPath === '/pages/pro-kit')}
          {item('/pages/prompt-workflow', 'nav.workflow', currentPath === '/pages/prompt-workflow')}
          {menu('guide', 'nav.designGuide', 'nav.designGuide.aria', guideLinks)}
          {menu('tools', 'nav.tools', 'nav.tools.aria', toolLinks)}
          <a className="site-menu__item site-menu__item--extra" href={GITHUB_URL} target="_blank" rel="noreferrer" onClick={closeAll}>
            {translate(lang, 'nav.github')}
          </a>
        </nav>
        <div className="site-header__end">
          <a className="site-header__pill site-header__github" href={GITHUB_URL} target="_blank" rel="noreferrer">
            {translate(lang, 'nav.github')}
          </a>
          <LanguageSwitcher lang={lang} onChange={onLanguageChange} />
          <button
            className="site-header__pill site-header__toggle"
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {menuLabel[lang]}
          </button>
        </div>
      </div>
    </header>
  );
}
