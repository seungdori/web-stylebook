import type { Lang } from '../data/styles';
import { translate } from '../data/i18n';
import { withLang } from '../utils/language';

export function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <strong>Web Stylebook</strong>
        </div>
        <nav className="site-footer__links" aria-label={translate(lang, 'footer.navigation.aria')}>
          <a href={withLang('/#styles', lang)}>{translate(lang, 'nav.styles')}</a>
          <a href={withLang('/pages/reference-explorer', lang)}>{translate(lang, 'nav.references')}</a>
          <a href={withLang('/pages/design-principles', lang)}>{translate(lang, 'nav.designPrinciples')}</a>
          <a href={withLang('/pages/component-glossary', lang)}>{translate(lang, 'nav.glossary')}</a>
          <a href={withLang('/pages/prompt-workflow', lang)}>{translate(lang, 'nav.workflow')}</a>
        </nav>
      </div>
      <div className="site-footer__bottom">
        <a href="https://github.com/seungdori/web-stylebook" target="_blank" rel="noreferrer">
          {translate(lang, 'nav.github')}
        </a>
        <span>{translate(lang, 'footer.license')}</span>
      </div>
    </footer>
  );
}
