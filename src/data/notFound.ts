import type { Lang, LocalizedText } from './styles';

const text = (en: string, ko: string, ja: string): LocalizedText => ({ en, ko, ja });

export const notFoundCopy = {
  code: text('404', '404', '404'),
  title: text('This page does not exist.', '없는 페이지입니다.', 'このページは存在しません。'),
  body: text(
    'The address may have changed, or it may never have existed. The catalogue is the best place to start again.',
    '주소가 바뀌었거나, 처음부터 없던 주소일 수 있습니다. 카탈로그에서 다시 시작하시는 편이 빠릅니다.',
    'アドレスが変わったか、元から存在しなかった可能性があります。カタログから探し直すのが確実です。',
  ),
  home: text('Style catalogue', '스타일 카탈로그', 'スタイルカタログ'),
  principles: text('Design guides', '디자인 가이드', 'デザインガイド'),
  glossary: text('Component glossary', '컴포넌트 용어집', 'コンポーネント用語集'),
  documentTitle: text(
    'Page not found - Web Stylebook',
    '없는 페이지 - Web Stylebook',
    'ページが見つかりません - Web Stylebook',
  ),
  documentDescription: text(
    'This page does not exist. Start again from the Web Stylebook catalogue.',
    '없는 페이지입니다. Web Stylebook 카탈로그에서 다시 시작하세요.',
    'このページは存在しません。Web Stylebookのカタログからやり直してください。',
  ),
};

export const notFoundLanguages: Lang[] = ['en', 'ko', 'ja'];
