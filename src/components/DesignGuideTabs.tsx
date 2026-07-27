import type { Lang } from '../data/styles';
import { translate } from '../data/i18n';
import { withLang } from '../utils/language';

export type DesignGuideKind = 'ux' | 'visual' | 'components';

interface DesignGuideTabsProps {
  active: DesignGuideKind;
  lang: Lang;
}

const links: Array<{
  kind: DesignGuideKind;
  href: string;
  labelKey: string;
  hintKey: string;
}> = [
  {
    kind: 'ux',
    href: '/pages/ux-principles',
    labelKey: 'nav.principles',
    hintKey: 'nav.principles.hint',
  },
  {
    kind: 'visual',
    href: '/pages/design-principles',
    labelKey: 'nav.designPrinciples',
    hintKey: 'nav.designPrinciples.hint',
  },
  {
    kind: 'components',
    href: '/pages/component-glossary',
    labelKey: 'nav.glossary',
    hintKey: 'nav.glossary.hint',
  },
];

export function DesignGuideTabs({ active, lang }: DesignGuideTabsProps) {
  return (
    <nav
      className={`design-guide-tabs design-guide-tabs--${active}`}
      aria-label={translate(lang, 'designGuide.tabs.aria')}
    >
      <span className="design-guide-tabs__eyebrow">{translate(lang, 'nav.designGuide')}</span>
      <div className="design-guide-tabs__list">
        {links.map(({ kind, href, labelKey, hintKey }) => {
          const isActive = active === kind;
          return (
            <a
              href={withLang(href, lang)}
              className={`design-guide-tabs__tab ${isActive ? 'is-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
              key={kind}
            >
              <span className="design-guide-tabs__indicator" aria-hidden="true" />
              <span className="design-guide-tabs__copy">
                <span className="design-guide-tabs__label">{translate(lang, labelKey)}</span>
                <span className="design-guide-tabs__hint">{translate(lang, hintKey)}</span>
              </span>
              {!isActive ? (
                <svg
                  className="design-guide-tabs__arrow"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              ) : null}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
