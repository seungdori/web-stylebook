import { allRoutes } from '../data/routes';
import type { Lang } from '../data/styles';
import { localize } from '../data/styles';
import { translate } from '../data/i18n';
import { withLang } from '../utils/language';

interface PageNavProps {
  currentPath: string;
  lang: Lang;
}

export function PageNav({ currentPath, lang }: PageNavProps) {
  const routeList = allRoutes.filter((route) => route.path !== '/');
  const index = routeList.findIndex((route) => route.path === currentPath);
  if (index < 0) return null;
  const prev = routeList[index - 1];
  const next = routeList[index + 1];

  return (
    <nav className="page-nav" aria-label="Page navigation">
      {prev ? (
        <a href={withLang(prev.path, lang)}>
          <span className="page-nav__label">{translate(lang, 'page.prev')}</span>
          {localize(prev.title, lang).replace(' - Web Stylebook', '')}
        </a>
      ) : (
        <span />
      )}
      {next ? (
        <a href={withLang(next.path, lang)}>
          <span className="page-nav__label">{translate(lang, 'page.next')}</span>
          {localize(next.title, lang).replace(' - Web Stylebook', '')}
        </a>
      ) : (
        <span />
      )}
    </nav>
  );
}
