import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Lang, StyleData } from '../data/styles';
import { fusionStyles, getStyleById, localize, styleCatalog, styles, styleTags } from '../data/styles';
import { translate } from '../data/i18n';
import { StyleCard } from '../components/StyleCard';
import { withLang } from '../utils/language';
import { productArchetypes } from '../catalog/products';
import { useDesignWorkspace } from '../visual/useDesignWorkspace';
import { getActiveSpecimenFonts, useActiveFonts } from '../visual/useActiveFonts';
import { VisualSpecimen } from '../components/VisualSpecimen';
import { findRoute } from '../data/routes';
import { parseDiscoveryQuery, urlWithDiscovery, type DiscoveryQueryResult } from '../data/discoveryUrl';
import { formatCount, homeChoiceText, purposeChoiceLabels } from '../data/homeChoiceCopy';
import { cautionGroups, HERO_STYLE_IDS, HOME_FIXTURE_ID, HOME_PURPOSE_IDS, resolvePurposeDiscovery } from '../data/purposeDiscovery';
import './VisualChoice.css';

type SortKey = 'popular' | 'latest' | 'name';
type SortDirection = 'asc' | 'desc';

const popularStyleIds = [
  'runtime-signal',
  'platform-core',
  'brutalist-grid',
  'editorial-silence',
  'kinetic-pop',
  'mono-type',
  'console-launch',
  'terminal-core',
  'quiet-utility',
  'swiss-poster',
  'holographic-fluid',
  'duotone-bold',
  'framer-motion',
  'neumorphism',
];

const popularFusionIds = [
  'fusion-product-swiss',
  'fusion-kinetic-brutal',
  'fusion-editorial-terminal',
];

const lowPriorityStyleIds = ['paper-cut'];
const lowPriorityFusionIds = ['fusion-clay-aurora', 'fusion-grain-mono'];

const popularStyleRank = new Map(popularStyleIds.map((id, index) => [id, index]));
const popularFusionRank = new Map(popularFusionIds.map((id, index) => [id, index]));
const catalogOrder = new Map(styleCatalog.map((style, index) => [style.id, index]));

const catalogRank = (style: StyleData) => catalogOrder.get(style.id) ?? -1;
const createdAtTime = (style: StyleData) => Date.parse(style.createdAt);

const compareLatestDesc = (a: StyleData, b: StyleData) => {
  return createdAtTime(b) - createdAtTime(a) || catalogRank(b) - catalogRank(a);
};

const compareLatestAsc = (a: StyleData, b: StyleData) => {
  return createdAtTime(a) - createdAtTime(b) || catalogRank(a) - catalogRank(b);
};

const popularGroup = (style: StyleData) => {
  const popularRank = style.kind === 'fusion' ? popularFusionRank : popularStyleRank;
  const lowPriorityIds = style.kind === 'fusion' ? lowPriorityFusionIds : lowPriorityStyleIds;
  const rank = popularRank.get(style.id);
  const lowPriorityRank = lowPriorityIds.indexOf(style.id);

  if (rank !== undefined) return { group: 0, rank };
  if (lowPriorityRank !== -1) return { group: 2, rank: lowPriorityRank };

  return { group: 1, rank: 0 };
};

const comparePopular = (a: StyleData, b: StyleData) => {
  const aGroup = popularGroup(a);
  const bGroup = popularGroup(b);

  if (aGroup.group !== bGroup.group) return aGroup.group - bGroup.group;
  if (aGroup.group === 0 || aGroup.group === 2) return aGroup.rank - bGroup.rank;

  return compareLatestDesc(a, b);
};

const resultLabel = (lang: Lang, count: number) => {
  if (lang === 'ko') return `${count}개 결과`;
  if (lang === 'ja') return `${count}件`;
  return `${count} results`;
};

const emptyQuery: DiscoveryQueryResult = { hasKeys: false, discovery: {}, problems: [] };

function readDiscoveryQuery(): DiscoveryQueryResult {
  if (typeof window === 'undefined') return emptyQuery;
  return parseDiscoveryQuery(window.location.search, styleTags);
}

export function Home({ lang }: { lang: Lang }) {
  const workspace = useDesignWorkspace();
  const { setDiscovery, getSnapshot } = workspace;
  const [previewScale, setPreviewScale] = useState<'fit' | 'actual'>('fit');
  const [locationEpoch, setLocationEpoch] = useState(0);
  const { query, tag, sort: sortKey, direction: sortDirection, purpose } = workspace.draft.discovery;
  const preservedPurpose = useRef<string | null>(null);
  const queryState = locationEpoch >= 0 ? readDiscoveryQuery() : emptyQuery;
  const commitDiscovery = (patch: Partial<typeof workspace.draft.discovery>) => {
    if (Object.prototype.hasOwnProperty.call(patch, 'purpose')) preservedPurpose.current = null;
    const nextDiscovery = { ...workspace.draft.discovery, ...patch };
    if (typeof window !== 'undefined' && findRoute(window.location.pathname).path === '/') {
      const nextUrl = new URL(urlWithDiscovery(window.location.pathname, window.location.search, window.location.hash, nextDiscovery), window.location.origin);
      if (preservedPurpose.current && nextDiscovery.purpose === 'all') nextUrl.searchParams.set('purpose', preservedPurpose.current);
      const next = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
      const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (next !== current) window.history.replaceState({}, '', next);
    }
    setDiscovery(patch);
  };
  const setQuery = (value: string) => commitDiscovery({ query: value });
  const setTag = (value: string) => commitDiscovery({ tag: value });
  const setSortKey = (value: SortKey) => commitDiscovery({ sort: value });
  const setSortDirection = (value: SortDirection) => commitDiscovery({ direction: value });
  const currentStyle = getStyleById(workspace.draft.styleId);
  const fontStatus = useActiveFonts(
    currentStyle ? getActiveSpecimenFonts(workspace.resolved) : [],
    workspace.draft.contentLocale,
  );
  const fallbackFonts = [...new Set(fontStatus.filter((font) => font.status === 'fallback' || font.status === 'error').map((font) => font.family))];
  const text = (key: Parameters<typeof homeChoiceText>[1]) => homeChoiceText(lang, key);
  const rawPurpose = queryState.problems.includes('purpose')
    ? new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search).get('purpose') ?? ''
    : purpose;
  const discovery = resolvePurposeDiscovery(rawPurpose);
  const activePurpose = discovery.archetypeId ? productArchetypes.find((item) => item.id === discovery.archetypeId) : undefined;
  const compareRight = HERO_STYLE_IDS.find((id) => id !== currentStyle?.id) ?? HERO_STYLE_IDS[0];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const remember = () => {
      const parsed = parseDiscoveryQuery(window.location.search, styleTags);
      preservedPurpose.current = parsed.problems.includes('purpose') ? new URLSearchParams(window.location.search).get('purpose') : null;
      return parsed;
    };
    const publishStored = () => {
      if (findRoute(window.location.pathname).path !== '/') return;
      const discovery = getSnapshot().draft.discovery;
      const nextUrl = new URL(urlWithDiscovery(window.location.pathname, window.location.search, window.location.hash, discovery), window.location.origin);
      if (preservedPurpose.current && discovery.purpose === 'all') nextUrl.searchParams.set('purpose', preservedPurpose.current);
      const next = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
      const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (next !== current) window.history.replaceState({}, '', next);
    };
    const applyIncoming = () => {
      if (findRoute(window.location.pathname).path !== '/') return;
      const parsed = remember();
      if (Object.keys(parsed.discovery).length > 0) setDiscovery(parsed.discovery);
      else publishStored();
      setLocationEpoch((value) => value + 1);
    };
    const parsed = remember();
    if (findRoute(window.location.pathname).path === '/') {
      if (Object.keys(parsed.discovery).length > 0) setDiscovery(parsed.discovery);
      else publishStored();
    }
    window.addEventListener('popstate', applyIncoming);
    return () => window.removeEventListener('popstate', applyIncoming);
  }, [getSnapshot, setDiscovery]);

  const filterAndSort = useCallback((items: StyleData[]) => {
    const value = query.trim().toLowerCase();
    const filtered = items.filter((style) => {
      const haystack = `${localize(style.name, lang)} ${localize(style.description, lang)} ${style.tags.join(' ')}`.toLowerCase();
      const matchesTag = tag === 'all' || style.tags.includes(tag);
      return matchesTag && (!value || haystack.includes(value));
    });

    return [...filtered].sort((a, b) => {
      if (sortKey === 'popular') return comparePopular(a, b);
      if (sortKey === 'latest') return sortDirection === 'desc' ? compareLatestDesc(a, b) : compareLatestAsc(a, b);
      if (sortKey === 'name') {
        const result = localize(a.name, lang).localeCompare(localize(b.name, lang), lang);
        return sortDirection === 'asc' ? result : -result;
      }
      return 0;
    });
  }, [lang, query, sortDirection, sortKey, tag]);

  const filteredStyles = useMemo(() => filterAndSort(styles), [filterAndSort]);
  const filteredFusions = useMemo(() => filterAndSort(fusionStyles), [filterAndSort]);
  const resultCount = filteredStyles.length + filteredFusions.length;
  const hasCustomControls = query.trim() !== '' || tag !== 'all' || purpose !== 'all' || sortKey !== 'popular' || sortDirection !== 'desc';
  const fontsLoading = fontStatus.some((font) => font.status === 'loading');

  const resetControls = () => {
    commitDiscovery({ query: '', tag: 'all', sort: 'popular', direction: 'desc', purpose: 'all' });
  };

  const selectSort = (sort: SortKey) => {
    if (sort === 'popular') {
      setSortKey('popular');
      setSortDirection('desc');
      return;
    }
    if (sortKey === sort) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      return;
    }
    setSortKey(sort);
    setSortDirection(sort === 'latest' ? 'desc' : 'asc');
  };

  const selectStyle = (id: string) => {
    if (id !== workspace.draft.styleId) workspace.requestStyleSelection(id);
  };

  return (
    <>
      <section className="home-choice" aria-labelledby="home-choice-title" data-active-style={currentStyle?.id ?? ''}>
        <div className="home-choice__intro">
          <h1 id="home-choice-title">{text('title')}</h1>
          <p>{text('lead')}</p>
        </div>
        <div className="home-choice__switches" role="group" aria-label={text('candidates')}>
          {HERO_STYLE_IDS.map((id) => {
            const style = getStyleById(id);
            if (!style) return null;
            const selected = id === currentStyle?.id;
            return (
              <button
                key={id}
                type="button"
                data-home-style={id}
                aria-pressed={selected}
                className={selected ? 'is-active' : ''}
                onClick={() => selectStyle(id)}
              >
                {localize(style.name, lang)}
              </button>
            );
          })}
        </div>
        <div className="home-choice__preview-bar">
          <span>{text('previewSize')}</span>
          <div role="group" aria-label={text('previewSize')}>
            <button type="button" aria-pressed={previewScale === 'fit'} onClick={() => setPreviewScale('fit')}>
              {text('overview')} <span className="home-choice__desktop-scale">60%</span><span className="home-choice__mobile-scale">100%</span>
            </button>
            <button type="button" aria-pressed={previewScale === 'actual'} onClick={() => setPreviewScale('actual')}>{text('actualSize')} 100%</button>
          </div>
        </div>
        <div className={`home-choice__preview home-choice__preview--${previewScale}`}>
          {currentStyle ? (
            <VisualSpecimen
              spec={workspace.resolved}
              lang={workspace.draft.contentLocale}
              fixtureId={HOME_FIXTURE_ID}
              copy={workspace.draft.previewCopy}
              compact
            />
          ) : (
            <p role="alert">{text('missingStyle')}</p>
          )}
        </div>
        <p className="home-choice__font-status" role="status">
          {fontsLoading ? text('fontsLoading') : fallbackFonts.length ? `${text('fontFallback')} ${fallbackFonts.join(', ')}` : ''}
        </p>
        {currentStyle ? (
          <div className="home-choice__selection">
            <p><span>{text('chosen')}</span> <strong>{localize(currentStyle.name, lang)}</strong></p>
            <div className="home-choice__actions">
              <a className="button" href={withLang('/pages/compare', lang, { left: currentStyle.id, right: compareRight, mode: 'complete', fixture: HOME_FIXTURE_ID })}>{text('compare')}</a>
              <a className="button" href={withLang('/pages/color-system', lang)}>{text('adjust')}</a>
              <a className="button button--dark" href={withLang('/pages/prompt-workflow', lang)}>{text('export')}</a>
              {workspace.canUndo ? <button className="button button--muted" type="button" onClick={workspace.undo}>{text('undo')}</button> : null}
            </div>
          </div>
        ) : null}
        {currentStyle ? <p className="visual-choice-note">{text('adapted')} <a href={withLang(currentStyle.route, lang)}>{text('original')} ↗</a></p> : null}
      </section>

      <section className="purpose-discovery" aria-labelledby="purpose-title" data-purpose-status={discovery.status}>
        <h2 id="purpose-title">{text('purpose')}</h2>
        <div className="home-choice__switches" role="group" aria-label={text('purpose')}>
          <button type="button" data-purpose="all" aria-pressed={purpose === 'all' && !queryState.problems.includes('purpose')} className={purpose === 'all' && !queryState.problems.includes('purpose') ? 'is-active' : ''} onClick={() => commitDiscovery({ purpose: 'all' })}>{text('browse')}</button>
          {HOME_PURPOSE_IDS.map((id) => (
            <button type="button" key={id} data-purpose={id} aria-pressed={purpose === id} className={purpose === id ? 'is-active' : ''} onClick={() => commitDiscovery({ purpose: id })}>
              {localize(purposeChoiceLabels[id], lang)}
            </button>
          ))}
          <button type="button" data-purpose="mixed" aria-pressed={purpose === 'mixed'} className={purpose === 'mixed' ? 'is-active' : ''} onClick={() => commitDiscovery({ purpose: 'mixed' })}>{text('mixed')}</button>
        </div>
        {discovery.neutralReason === 'mixed' || discovery.neutralReason === 'unknown' ? (
          <p className="visual-choice-note" role="status">{discovery.neutralReason === 'mixed' ? text('neutralMixed') : text('neutralUnknown')}</p>
        ) : null}
        {discovery.status === 'shortlist' && activePurpose ? (
          <div className="purpose-discovery__results">
            <h3>{text('shortlist')}</h3>
            <p>{localize(activePurpose.description, lang)}</p>
            <div className="purpose-discovery__shortlist">
              {discovery.entries.map((entry) => {
                const style = getStyleById(entry.styleId);
                if (!style) return null;
                const selected = currentStyle?.id === entry.styleId;
                return (
                  <button
                    key={entry.styleId}
                    type="button"
                    data-style-id={entry.styleId}
                    data-reason-source="bestFor"
                    aria-pressed={selected}
                    onClick={() => {
                      selectStyle(entry.styleId);
                      document.getElementById('home-choice-title')?.scrollIntoView({ block: 'start' });
                    }}
                  >
                    <strong>{localize(style.name, lang)}</strong>
                    <span>{text('because')}: {entry.reasons.join(' · ')}</span>
                  </button>
                );
              })}
            </div>
            <ul className="purpose-discovery__cautions">
              {cautionGroups(discovery.cautions).map((group) => {
                const style = getStyleById(group.styleId);
                const name = style ? localize(style.name, lang) : group.styleId;
                return (
                  <li key={group.styleId} data-caution-for={group.styleId} data-caution-source={group.phrases.length ? 'notIdealFor' : 'product-fit'}>
                    <span>{text('caution')}</span> {name}
                    {group.phrases.length ? ` — ${group.phrases.join('; ')}` : ` — ${text('poorFit')}`}
                  </li>
                );
              })}
            </ul>
            <a href="#styles">{text('fullCatalog')} ({styleCatalog.length})</a>
          </div>
        ) : null}
      </section>

      <nav className="home-tools" aria-label={text('utilities')}>
        <a href={withLang('/pages/reference-explorer', lang)}>{translate(lang, 'nav.references')}</a>
        <a href={withLang('/pages/pro-kit', lang)}>{translate(lang, 'nav.proKit')}</a>
        <a href={withLang('/pages/component-glossary', lang)}>{translate(lang, 'nav.glossary')}</a>
        <a href={withLang('/pages/ux-principles', lang)}>{translate(lang, 'nav.principles')}</a>
        <a href={withLang('/pages/design-principles', lang)}>{translate(lang, 'nav.designPrinciples')}</a>
        <a href={withLang('/pages/animation-lab', lang)}>{translate(lang, 'nav.animation')}</a>
        <a href={withLang('/pages/prompt-tips', lang)}>{translate(lang, 'nav.tips')}</a>
      </nav>

      {queryState.problems.includes('tag') ? <p className="visual-choice-note" role="status" data-discovery-problem="tag">{text('unsupported')}</p> : null}

      <section className="section" id="styles" data-catalog-count={styleCatalog.length}>
        <div className="section__head section__head--controls">
          <div className="section__title-block">
            <h2>{translate(lang, 'home.styles')}</h2>
            <span className="section-count">{formatCount(text('styleCount'), styles.length)}</span>
            <span className="filter-summary" aria-live="polite">{resultLabel(lang, resultCount)}</span>
          </div>
          <div className="filters">
            <div className="filter-toolbar">
              <label className="search-field">
                <span className="sr-only">{translate(lang, 'home.search')}</span>
                <input
                  value={query}
                  type="search"
                  placeholder={translate(lang, 'home.search')}
                  aria-label={translate(lang, 'home.search')}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              <div className="sort-control" role="group" aria-label={translate(lang, 'home.sort')}>
                <span className="sort-control__label">{translate(lang, 'home.sort')}</span>
                {(['popular', 'latest', 'name'] as const).map((sort) => {
                  const nextDirection = sortKey === sort ? sortDirection : sort === 'latest' ? 'desc' : 'asc';
                  return (
                    <button
                      aria-label={sort === 'popular' ? translate(lang, 'home.sort.popular') : `${translate(lang, `home.sort.${sort}`)} ${translate(lang, `home.sort.${nextDirection}`)}`}
                      aria-pressed={sortKey === sort}
                      className={sortKey === sort ? 'is-active' : ''}
                      key={sort}
                      type="button"
                      onClick={() => selectSort(sort)}
                    >
                      {translate(lang, `home.sort.${sort}`)}
                      {sortKey === sort && sort !== 'popular' ? <span className="sort-direction" aria-hidden="true">{sortDirection === 'asc' ? '↑' : '↓'}</span> : null}
                    </button>
                  );
                })}
              </div>
              <button className="button button--muted filter-reset" type="button" onClick={resetControls} disabled={!hasCustomControls}>
                {translate(lang, 'home.reset')}
              </button>
            </div>
            <div className="filter-chips" role="group" aria-label={text('tags')}>
              <button className={tag === 'all' ? 'is-active' : ''} aria-pressed={tag === 'all'} type="button" onClick={() => setTag('all')}>
                {translate(lang, 'home.all')}
              </button>
              {styleTags.map((item) => (
                <button className={tag === item ? 'is-active' : ''} aria-pressed={tag === item} key={item} type="button" onClick={() => setTag(item)}>
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="style-grid">
          {filteredStyles.map((style) => (
            <StyleCard key={style.id} style={style} lang={lang} />
          ))}
        </div>
        {filteredStyles.length === 0 ? <p className="empty-state">{translate(lang, 'home.noResults')}</p> : null}
      </section>

      <section className="section" id="fusion">
        <div className="section__head">
          <h2>{translate(lang, 'home.fusions')}</h2>
          <span className="section-count">{formatCount(text('fusionCount'), fusionStyles.length)}</span>
        </div>
        <div className="style-grid">
          {filteredFusions.map((style) => (
            <StyleCard key={style.id} style={style} lang={lang} />
          ))}
        </div>
        {filteredFusions.length === 0 ? <p className="empty-state">{translate(lang, 'home.noResults')}</p> : null}
      </section>

      <section className="workflow-callout">
        <div>
          <h2>{translate(lang, 'home.workflow.title')}</h2>
          <p>{translate(lang, 'home.workflow.desc')}</p>
        </div>
        <a className="button button--dark" href={withLang('/pages/prompt-workflow', lang)}>
          {translate(lang, 'home.workflow.cta')}
        </a>
      </section>
    </>
  );
}
