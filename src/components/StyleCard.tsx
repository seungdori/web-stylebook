import type { Lang, StyleData } from '../data/styles';
import { localize } from '../data/styles';
import { translate } from '../data/i18n';
import { withLang } from '../utils/language';
import { SHOT_HEIGHT, SHOT_WIDTH, shotSrc, shotSrcSet } from '../pages/home/shots';

interface StyleCardProps {
  style: StyleData;
  lang: Lang;
  /* h4 under a shelf heading, h3 in the full grid. */
  heading?: 'h3' | 'h4';
  sizes: string;
  /* False until the card is close enough to need its screenshot. */
  showImage?: boolean;
}

/* A catalog card on the home page: the style page's screenshot, its name (the link to the
   page, stretched over the card), one line about it, and a link that opens the prompt
   generator with this style preset. */
export function StyleCard({ style, lang, heading: Heading = 'h4', sizes, showImage = true }: StyleCardProps) {
  const name = localize(style.name, lang);
  const workflow = translate(lang, 'card.workflow');
  return (
    <article className={`style-card home-card home-card--${style.kind}`} data-style-id={style.id}>
      <span className="home-card__shot">
        {showImage ? <img src={shotSrc(style.id)} srcSet={shotSrcSet(style.id)} sizes={sizes} width={SHOT_WIDTH} height={SHOT_HEIGHT} alt="" loading="lazy" decoding="async" /> : null}
      </span>
      <Heading className="home-card__name">
        <a href={withLang(style.route, lang)}>{name}</a>
      </Heading>
      <p className="home-card__desc">{localize(style.description, lang)}</p>
      <a className="home-card__prompt" href={withLang('/pages/prompt-workflow', lang, { stylePreset: style.id })} aria-label={`${workflow}: ${name}`}>
        {workflow}
      </a>
    </article>
  );
}
