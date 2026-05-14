import type { Lang } from '../data/styles';
import { fusionStyles, styles } from '../data/styles';
import { translate } from '../data/i18n';
import { utilityRoutes } from '../data/routes';
import { withLang } from '../utils/language';

export function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <strong>Web Stylebook</strong>
          <p>{translate(lang, 'footer.desc')}</p>
          <a className="button button--dark" href={withLang('/pages/prompt-workflow', lang)}>
            {translate(lang, 'home.workflow.cta')}
          </a>
        </div>
        <div className="site-footer__cols">
          <div>
            <span>{styles.length}</span>
            <small>Style Templates</small>
          </div>
          <div>
            <span>{fusionStyles.length}</span>
            <small>Fusion Combos</small>
          </div>
          <div>
            <span>{styles.length + fusionStyles.length + utilityRoutes.length + 1}</span>
            <small>Static Routes</small>
          </div>
        </div>
      </div>
      <div className="site-footer__bottom">
        <a href="/sitemap.xml">Sitemap</a>
        <a href="https://github.com/seungdori/web-stylebook" target="_blank" rel="noreferrer">
          Source
        </a>
        <span>{translate(lang, 'footer.license')}</span>
      </div>
    </footer>
  );
}
