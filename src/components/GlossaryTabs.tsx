import type { Lang } from '../data/styles';
import { translate } from '../data/i18n';
import { withLang } from '../utils/language';

type GlossaryKind = 'components' | 'motion';

interface GlossaryTabsProps {
  active: GlossaryKind;
  lang: Lang;
}

const links: Record<GlossaryKind, string> = {
  components: '/pages/component-glossary',
  motion: '/pages/animation-lab',
};

export function GlossaryTabs({ active, lang }: GlossaryTabsProps) {
  const renderTab = (kind: GlossaryKind, labelKey: string, hintKey: string) => {
    const isActive = active === kind;
    return (
      <a
        href={withLang(links[kind], lang)}
        className={`glossary-tabs__tab ${isActive ? 'is-active' : ''}`}
        aria-current={isActive ? 'page' : undefined}
      >
        <span className="glossary-tabs__indicator" aria-hidden="true" />
        <span className="glossary-tabs__copy">
          <span className="glossary-tabs__label">{translate(lang, labelKey)}</span>
          <span className="glossary-tabs__hint">{translate(lang, hintKey)}</span>
        </span>
        {!isActive ? (
          <svg
            className="glossary-tabs__arrow"
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
  };

  return (
    <nav className="glossary-tabs" aria-label={translate(lang, 'glossary.tabs.aria')}>
      <span className="glossary-tabs__eyebrow">{translate(lang, 'nav.glossary.combined')}</span>
      <div className="glossary-tabs__list" role="tablist">
        {renderTab('components', 'glossary.tabs.components', 'glossary.tabs.components.hint')}
        {renderTab('motion', 'glossary.tabs.motion', 'glossary.tabs.motion.hint')}
      </div>
    </nav>
  );
}
