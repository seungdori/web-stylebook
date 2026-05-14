import { useMemo, useState } from 'react';
import type { Lang } from '../data/styles';
import { translate } from '../data/i18n';
import { withLang } from '../utils/language';
import { GlossaryTabs } from '../components/GlossaryTabs';
import { animationCategories, animationPatterns, text, type AnimationCategoryId, type AnimationPattern } from './animation-lab/catalog';
import { AnimationPreview } from './animation-lab/AnimationPreview';

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

  return (
    <div className="animation-lab-page animation-catalog-page">
      <GlossaryTabs active="motion" lang={lang} />
      <section className="page-hero page-hero--motion">
        <p className="hero__eyebrow">Motion System</p>
        <h1>{translate(lang, 'animation.title')}</h1>
        <div>
          <p>{translate(lang, 'animation.desc')}</p>
          <a className="button button--dark" href={withLang('/pages/animation-example', lang)}>
            {translate(lang, 'animation.exampleCta')}
          </a>
        </div>
      </section>

      <section className="animation-finder">
        <div>
          <span>{translate(lang, 'animation.finderEyebrow')}</span>
          <h2>{translate(lang, 'animation.finderTitle')}</h2>
        </div>
        <label>
          <span className="sr-only">{translate(lang, 'animation.search')}</span>
          <input
            type="search"
            value={query}
            placeholder={translate(lang, 'animation.search')}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </section>

      <section className="animation-category-strip" aria-label={translate(lang, 'animation.categories')}>
        <button className={category === 'all' ? 'is-active' : ''} type="button" onClick={() => setCategory('all')}>
          {translate(lang, 'home.all')}
        </button>
        {animationCategories.map((item) => (
          <button className={category === item.id ? 'is-active' : ''} key={item.id} type="button" onClick={() => setCategory(item.id)}>
            <span>{text(item.label, lang)}</span>
            <small>{animationPatterns.filter((pattern) => pattern.category === item.id).length}</small>
          </button>
        ))}
      </section>

      <section className="animation-catalog-layout">
        <div className="animation-pattern-grid">
          {filteredPatterns.length === 0 ? (
            <p className="empty-state">{translate(lang, 'animation.noResults')}</p>
          ) : null}
          {filteredPatterns.map((pattern) => {
            const active = pattern.id === selectedPattern.id;
            return (
              <button className={active ? 'is-active' : ''} key={pattern.id} type="button" onClick={() => selectPattern(pattern.id)}>
                <AnimationPreview kind={pattern.preview} replayKey={active ? replay : 0} compact />
                <span>{text(pattern.name, lang)}</span>
                <small>{pattern.name.en}</small>
              </button>
            );
          })}
        </div>

        <aside className="animation-detail-panel">
          <div className="animation-detail-panel__head">
            <div>
              <span>{text(selectedCategory.label, lang)}</span>
              <h2>{text(selectedPattern.name, lang)}</h2>
              <p>{selectedPattern.name.en}</p>
            </div>
            <button className="button" type="button" onClick={() => setReplay((value) => value + 1)}>
              {translate(lang, 'animation.reset')}
            </button>
          </div>

          <AnimationPreview kind={selectedPattern.preview} replayKey={replay} />

          <div className="animation-explain">
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

          <div className="animation-aliases">
            <span>{translate(lang, 'animation.aliases')}</span>
            <div>
              {selectedPattern.aliases.map((alias) => (
                <code key={alias}>{alias}</code>
              ))}
            </div>
          </div>

          <div className="animation-prompt-box">
            <span>{translate(lang, 'animation.promptLine')}</span>
            <pre>{text(selectedPattern.prompt, lang)}</pre>
          </div>

          <div className="related-motion">
            <span>{translate(lang, 'animation.related')}</span>
            <div>
              {relatedPatterns.map((pattern) => (
                <button key={pattern.id} type="button" onClick={() => selectPattern(pattern.id)}>
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
