import { useMemo, useState } from 'react';
import type { Lang } from '../data/styles';
import { localize, styleCatalog } from '../data/styles';
import { translate } from '../data/i18n';
import { withLang } from '../utils/language';

const quickPairs = [
  ['neon-drift', 'swiss-poster'],
  ['quiet-utility', 'kinetic-pop'],
  ['framer-motion', 'zen-minimalism'],
  ['terminal-core', 'editorial-silence'],
];

function initialParam(key: string, fallback: string) {
  return new URLSearchParams(window.location.search).get(key) || fallback;
}

function previewRoute(styleId: string, lang: Lang) {
  return withLang(`/pages/${styleId}.html`, lang);
}

export function Compare({ lang }: { lang: Lang }) {
  const [left, setLeft] = useState(() => initialParam('left', 'neon-drift'));
  const [right, setRight] = useState(() => initialParam('right', 'editorial-silence'));
  const [layout, setLayout] = useState<'horizontal' | 'vertical'>('horizontal');

  const options = useMemo(() => styleCatalog, []);
  const leftStyle = options.find((style) => style.id === left);
  const rightStyle = options.find((style) => style.id === right);

  function selectPair(pairLeft: string, pairRight: string) {
    setLeft(pairLeft);
    setRight(pairRight);
  }

  const slot = (side: 'left' | 'right', selected: string, onChange: (value: string) => void) => {
    const style = options.find((item) => item.id === selected);
    return (
      <section className="compare-slot">
        <div className="compare-slot__head">
          <label>
            {translate(lang, side === 'left' ? 'compare.left' : 'compare.right')}
            <select value={selected} onChange={(event) => onChange(event.target.value)}>
              <option value="">{translate(lang, 'compare.select')}</option>
              {options.map((item) => (
                <option key={item.id} value={item.id}>
                  {localize(item.name, lang)}
                </option>
              ))}
            </select>
          </label>
          <strong>{style ? localize(style.name, lang) : '-'}</strong>
        </div>
        {style ? (
          <iframe className="compare-frame" src={previewRoute(style.id, lang)} title={localize(style.name, lang)} loading="lazy" />
        ) : (
          <div className="compare-empty">{translate(lang, 'compare.empty')}</div>
        )}
      </section>
    );
  };

  return (
    <>
      <section className="page-hero">
        <p className="hero__eyebrow">Compare</p>
        <h1>{translate(lang, 'compare.title')}</h1>
        <p>{translate(lang, 'compare.desc')}</p>
      </section>

      <section className="compare-controls">
        <div className="quick-pairs">
          <span>{translate(lang, 'compare.quickPairs')}</span>
          {quickPairs.map(([pairLeft, pairRight]) => (
            <button key={`${pairLeft}-${pairRight}`} type="button" onClick={() => selectPair(pairLeft, pairRight)}>
              {localize(options.find((item) => item.id === pairLeft)?.name || { en: pairLeft, ko: pairLeft, ja: pairLeft }, lang)} /{' '}
              {localize(options.find((item) => item.id === pairRight)?.name || { en: pairRight, ko: pairRight, ja: pairRight }, lang)}
            </button>
          ))}
        </div>
        <button className="button" type="button" onClick={() => selectPair(right, left)}>
          {translate(lang, 'compare.swap')}
        </button>
        <div className="segmented">
          <button className={layout === 'horizontal' ? 'is-active' : ''} type="button" onClick={() => setLayout('horizontal')}>
            {translate(lang, 'compare.horizontal')}
          </button>
          <button className={layout === 'vertical' ? 'is-active' : ''} type="button" onClick={() => setLayout('vertical')}>
            {translate(lang, 'compare.vertical')}
          </button>
        </div>
      </section>

      <section className={`compare-grid compare-grid--${layout}`}>
        {slot('left', leftStyle?.id || '', setLeft)}
        {slot('right', rightStyle?.id || '', setRight)}
      </section>
    </>
  );
}
