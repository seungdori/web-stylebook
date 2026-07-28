import type { Lang, LocalizedText } from '../data/styles';
import { localize } from '../data/styles';
import { withLang } from '../utils/language';

const t = (en: string, ko: string, ja: string): LocalizedText => ({ en, ko, ja });

const copy = {
  code: t('404', '404', '404'),
  title: t('This page does not exist.', '없는 페이지입니다.', 'このページは存在しません。'),
  body: t(
    'The address may have changed, or it may never have existed. The catalogue is the best place to start again.',
    '주소가 바뀌었거나, 처음부터 없던 주소일 수 있습니다. 카탈로그에서 다시 시작하시는 편이 빠릅니다.',
    'アドレスが変わったか、元から存在しなかった可能性があります。カタログから探し直すのが確実です。',
  ),
  home: t('Style catalogue', '스타일 카탈로그', 'スタイルカタログ'),
  principles: t('Design guides', '디자인 가이드', 'デザインガイド'),
  glossary: t('Component glossary', '컴포넌트 용어집', 'コンポーネント用語集'),
};

export function NotFound({ lang }: { lang: Lang }) {
  return (
    <section className="notfound">
      <p className="notfound__code">{localize(copy.code, lang)}</p>
      <h1>{localize(copy.title, lang)}</h1>
      <p className="notfound__body">{localize(copy.body, lang)}</p>
      <div className="notfound__links">
        <a className="button button--dark" href={withLang('/', lang)}>
          {localize(copy.home, lang)}
        </a>
        <a className="button" href={withLang('/pages/design-principles', lang)}>
          {localize(copy.principles, lang)}
        </a>
        <a className="button" href={withLang('/pages/component-glossary', lang)}>
          {localize(copy.glossary, lang)}
        </a>
      </div>
    </section>
  );
}
