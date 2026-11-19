import { useMemo, useState } from 'react';
import type { Lang } from '../data/styles';
import { translate } from '../data/i18n';
import { withLang } from '../utils/language';
import { animationCategories, animationPatterns, text, type AnimationCategoryId, type AnimationPattern } from './animation-lab/catalog';
import { AnimationPreview } from './animation-lab/AnimationPreview';
import './shell-kit.css';

function searchableText(pattern: AnimationPattern, lang: Lang) {
  return [
    text(pattern.name, lang),
    pattern.name.en,
    pattern.name.ko,
    pattern.aliases.join(' '),
    text(pattern.short, lang),
    text(pattern.useWhen, lang),
  ].join(' ').toLowerCase();
}

export function AnimationLab({ lang }: { lang: Lang }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | AnimationCategoryId>('all');
  const [selectedId, setSelectedId] = useState(animationPatterns[1].id);
  const [replay, setReplay] = useState(0);
  // A tile plays only while it is hovered or focused; the detail panel plays the selection.
  const [playingId, setPlayingId] = useState<string | null>(null);

  const filteredPatterns = useMemo(() => {
    const value = query.trim().toLowerCase();
    return animationPatterns.filter((pattern) => {
      const categoryMatches = category === 'all' || pattern.category === category;
      const queryMatches = !value || searchableText(pattern, lang).includes(value);
      return categoryMatches && queryMatches;
    });
  }, [category, lang, query]);

  const selectedPattern = useMemo(
    () => filteredPatterns.find((pattern) => pattern.id === selectedId) || filteredPatterns[0] || animationPatterns.find((pattern) => pattern.id === selectedId) || animationPatterns[0],
    [filteredPatterns, selectedId],
  );

  const selectedCategory = animationCategories.find((item) => item.id === selectedPattern.category) || animationCategories[0];

  const relatedPatterns = useMemo(
    () => animationPatterns.filter((pattern) => pattern.category === selectedPattern.category && pattern.id !== selectedPattern.id).slice(0, 4),
    [selectedPattern],
  );

  function selectPattern(patternId: string) {
    setSelectedId(patternId);
    setReplay((value) => value + 1);
  }

  const stopPlaying = (patternId: string) => setPlayingId((current) => (current === patternId ? null : current));

  return (
    <div className="alab-page">
      <section className="page-hero alab-hero">
        <p className="sk-label">Motion System</p>
        <h1>{translate(lang, 'animation.title')}</h1>
        <p>{translate(lang, 'animation.desc')}</p>
        <div className="sk-actions">
          <a className="button button--dark button--lg" href={withLang('/pages/animation-example', lang)}>
            {translate(lang, 'animation.exampleCta')}
          </a>
        </div>
      </section>

      <section className="sk-head alab-finder" aria-labelledby="alab-finder-title">
        <p className="sk-label">{translate(lang, 'animation.finderEyebrow')}</p>
        <h2 id="alab-finder-title">{translate(lang, 'animation.finderTitle')}</h2>
        <label className="search-field alab-search">
          <span className="sr-only">{translate(lang, 'animation.search')}</span>
          <input
            type="search"
            value={query}
            placeholder={translate(lang, 'animation.search')}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="segmented alab-categories" role="group" aria-label={translate(lang, 'animation.categories')}>
          <button aria-pressed={category === 'all'} type="button" onClick={() => setCategory('all')}>
            {translate(lang, 'home.all')}
          </button>
          {animationCategories.map((item) => (
            <button aria-pressed={category === item.id} key={item.id} type="button" onClick={() => setCategory(item.id)}>
              <span>{text(item.label, lang)}</span>
              <small>{animationPatterns.filter((pattern) => pattern.category === item.id).length}</small>
            </button>
          ))}
        </div>
      </section>

      <section className="alab-catalog">
        <div className="alab-grid">
          {filteredPatterns.length === 0 ? (
            <p className="empty-state">{translate(lang, 'animation.noResults')}</p>
          ) : null}
          {filteredPatterns.map((pattern) => {
            const active = pattern.id === selectedPattern.id;
            return (
              <button
                className={active ? 'is-active' : ''}
                aria-pressed={active}
                key={pattern.id}
                type="button"
                onClick={() => selectPattern(pattern.id)}
                onPointerEnter={() => setPlayingId(pattern.id)}
                onPointerLeave={() => stopPlaying(pattern.id)}
                onFocus={() => setPlayingId(pattern.id)}
                onBlur={() => stopPlaying(pattern.id)}
              >
                <AnimationPreview kind={pattern.preview} replayKey={active ? replay : 0} still={playingId !== pattern.id} compact />
                <span>{text(pattern.name, lang)}</span>
                <small>{pattern.name.en}</small>
              </button>
            );
          })}
        </div>

        <aside className="alab-detail">
          <div className="alab-detail__head">
            <div>
              <p className="sk-label">{text(selectedCategory.label, lang)}</p>
              <h2>{text(selectedPattern.name, lang)}</h2>
              <p>{selectedPattern.name.en}</p>
            </div>
            <button className="button" type="button" onClick={() => setReplay((value) => value + 1)}>
              {translate(lang, 'animation.reset')}
            </button>
          </div>

          <AnimationPreview kind={selectedPattern.preview} replayKey={replay} />

          <div className="alab-explain">
            <section>
              <h3>{translate(lang, 'animation.what')}</h3>
              <p>{text(selectedPattern.short, lang)}</p>
            </section>
            <section>
              <h3>{translate(lang, 'animation.useWhen')}</h3>
              <p>{text(selectedPattern.useWhen, lang)}</p>
            </section>
            <section>
              <h3>{translate(lang, 'animation.avoidWhen')}</h3>
              <p>{text(selectedPattern.avoidWhen, lang)}</p>
            </section>
          </div>

          <div className="alab-block">
            <p className="sk-label">{translate(lang, 'animation.aliases')}</p>
            <div className="alab-aliases">
              {selectedPattern.aliases.map((alias) => (
                <span key={alias}>{alias}</span>
              ))}
            </div>
          </div>

          <div className="alab-block">
            <p className="sk-label">{translate(lang, 'animation.promptLine')}</p>
            <pre className="alab-prompt">{text(selectedPattern.prompt, lang)}</pre>
          </div>

          <div className="alab-block">
            <p className="sk-label">{translate(lang, 'animation.related')}</p>
            <div className="alab-related">
              {relatedPatterns.map((pattern) => (
                <button className="button" key={pattern.id} type="button" onClick={() => selectPattern(pattern.id)}>
                  {text(pattern.name, lang)}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
