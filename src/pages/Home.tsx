import { useCallback, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import type { Lang, StyleData } from '../data/styles';
import { fusionStyles, localize, styleCatalog, styles, styleTags } from '../data/styles';
import { translate } from '../data/i18n';
import { StyleCard } from '../components/StyleCard';
import { withLang } from '../utils/language';

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

export function Home({ lang }: { lang: Lang }) {
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('all');
  const [sortKey, setSortKey] = useState<SortKey>('popular');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const filterAndSort = useCallback((items: StyleData[]) => {
    const value = query.trim().toLowerCase();
    const filtered = items.filter((style) => {
      const text = `${localize(style.name, lang)} ${localize(style.description, lang)} ${style.tags.join(' ')}`.toLowerCase();
      const matchesTag = tag === 'all' || style.tags.includes(tag);
      return matchesTag && (!value || text.includes(value));
    });

    return [...filtered].sort((a, b) => {
      if (sortKey === 'popular') {
        return comparePopular(a, b);
      }

      if (sortKey === 'latest') {
        return sortDirection === 'desc' ? compareLatestDesc(a, b) : compareLatestAsc(a, b);
      }

      if (sortKey === 'name') {
        const result = localize(a.name, lang).localeCompare(localize(b.name, lang), lang);
        return sortDirection === 'asc' ? result : -result;
      }

      return 0;
    });
  }, [lang, query, sortDirection, sortKey, tag]);

  const filteredStyles = useMemo(() => {
    return filterAndSort(styles);
  }, [filterAndSort]);

  const filteredFusions = useMemo(() => {
    return filterAndSort(fusionStyles);
  }, [filterAndSort]);

  const resultCount = filteredStyles.length + filteredFusions.length;
  const hasCustomControls = query.trim() !== '' || tag !== 'all' || sortKey !== 'popular' || sortDirection !== 'desc';

  const resetControls = () => {
    setQuery('');
    setTag('all');
    setSortKey('popular');
    setSortDirection('desc');
  };

  const selectSort = (sort: SortKey) => {
    if (sort === 'popular') {
      setSortKey('popular');
      setSortDirection('desc');
      return;
    }

    if (sortKey === sort) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortKey(sort);
    setSortDirection(sort === 'latest' ? 'desc' : 'asc');
  };

  return (
    <>
      <section className="hero hero--home">
        <motion.p className="hero__eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {translate(lang, 'home.eyebrow')}
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.04 }}>
          {translate(lang, 'home.title')}
        </motion.h1>
        <motion.p className="hero__lead" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
          {translate(lang, 'home.desc')}
        </motion.p>
        <motion.div className="hero__chips chip-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.14 }}>
          {[
            ['Glassmorphism', 'chip--glass'],
            ['Neumorphism', 'chip--neumo'],
            ['Brutalist', 'chip--brutal'],
            ['Minimalist', 'chip--minimal'],
            ['Cyberpunk', 'chip--cyber'],
          ].map(([chip, className]) => (
            <span className={`chip ${className}`} key={chip}>
              {chip}
            </span>
          ))}
          <a className="chip chip--more" href="#styles">
            +29 styles
          </a>
        </motion.div>
      </section>

      <section className="utility-strip" aria-label="Workflow utilities">
        <a href={withLang('/pages/reference-explorer', lang)}>{translate(lang, 'nav.references')}</a>
        <a href={withLang('/pages/pro-kit', lang)}>{translate(lang, 'nav.proKit')}</a>
        <a href={withLang('/pages/prompt-workflow', lang)}>{translate(lang, 'nav.workflow')}</a>
        <a href={withLang('/pages/component-glossary', lang)}>{translate(lang, 'nav.glossary')}</a>
        <a href={withLang('/pages/animation-lab', lang)}>{translate(lang, 'nav.animation')}</a>
        <a href={withLang('/pages/compare', lang)}>{translate(lang, 'nav.compare')}</a>
        <a href={withLang('/pages/color-system', lang)}>{translate(lang, 'nav.colors')}</a>
      </section>

      <section className="section" id="styles">
        <div className="section__head section__head--controls">
          <div className="section__title-block">
            <h2>{translate(lang, 'home.styles')}</h2>
            <span className="filter-summary" aria-live="polite">
              {resultLabel(lang, resultCount)}
            </span>
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
                      aria-label={sort === 'popular' ? translate(lang, `home.sort.${sort}`) : `${translate(lang, `home.sort.${sort}`)} ${translate(lang, `home.sort.${nextDirection}`)}`}
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
            <div className="filter-chips" role="group" aria-label="Tag filters">
              <button className={tag === 'all' ? 'is-active' : ''} type="button" onClick={() => setTag('all')}>
                {translate(lang, 'home.all')}
              </button>
              {styleTags.map((item) => (
                <button className={tag === item ? 'is-active' : ''} key={item} type="button" onClick={() => setTag(item)}>
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
