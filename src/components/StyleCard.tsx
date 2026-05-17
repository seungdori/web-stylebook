import { motion } from 'motion/react';
import type { CSSProperties } from 'react';
import type { Lang, StyleData } from '../data/styles';
import { localize } from '../data/styles';
import { translate } from '../data/i18n';
import { withLang } from '../utils/language';

interface StyleCardProps {
  style: StyleData;
  lang: Lang;
}

const MODE_LABEL: Record<'dark' | 'light' | 'dual', string> = {
  dark: 'Dark',
  light: 'Light',
  dual: 'Dark + Light',
};

function modeOf(tags: string[]): 'dark' | 'light' | 'dual' | null {
  const hasDark = tags.includes('dark');
  const hasLight = tags.includes('light');
  if (tags.includes('dual') || (hasDark && hasLight)) return 'dual';
  if (hasDark) return 'dark';
  if (hasLight) return 'light';
  return null;
}

export function StyleCard({ style, lang }: StyleCardProps) {
  const mode = modeOf(style.tags);
  return (
    <motion.article
      className={`style-card style-card--${style.kind} style-card--${style.id}`}
      data-style-id={style.id}
      data-mode={mode ?? undefined}
      style={{ '--accent': style.accent } as CSSProperties}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
    >
      <div className="style-card__palette" aria-label={translate(lang, 'card.palette')}>
        {style.palette.map((color) => (
          <span key={color} style={{ background: color }} title={color} />
        ))}
      </div>
      <div className="style-card__meta-row">
        {mode ? <span className={`style-card__mode style-card__mode--${mode}`}>{MODE_LABEL[mode]}</span> : null}
        {style.kind === 'fusion' ? <span className="style-card__kind">Fusion</span> : null}
      </div>
      <h3>{localize(style.name, lang)}</h3>
      <p>{localize(style.description, lang)}</p>
      <div className="style-card__tags">
        {style.tags.slice(0, 4).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
      <div className="style-card__actions">
        <a className="button button--dark" href={withLang(style.route, lang)}>
          {translate(lang, 'card.view')}
        </a>
        <a className="button" href={withLang('/pages/prompt-workflow', lang, { stylePreset: style.id })}>
          {translate(lang, 'card.workflow')}
        </a>
      </div>
    </motion.article>
  );
}
