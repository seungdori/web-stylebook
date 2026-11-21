import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { flushSync } from 'react-dom';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedFusionProductSwissPage.css';

// The feature page of Margin, a browser editor for web pages, in the Product x Swiss
// style. Geologica alone carries every size: semibold headlines, light oversized figures,
// plain reading text, and the same face at 13px inside the editor, where a product's own
// UI font lives. Every section shows the part of the editor that does the job: the editor
// window with a customer's homepage open, a comment thread pinned to a layer, three
// breakpoint frames with a switch, an inspected card with redlines and its CSS, one pricing
// table and an open list of questions. One rounded material (the editor surfaces); the
// page itself is square, ruled and on a 12-column grid.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

const BRAND = 'Margin';
const SHOP = 'Linnet Cycles';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key]));

const BAR = {
  nav: { en: 'Margin', ko: 'Margin', ja: 'Margin' },
  features: { en: 'Features', ko: '기능', ja: '機能' },
  customers: { en: 'Customers', ko: '고객', ja: '導入事例' },
  pricing: { en: 'Pricing', ko: '요금제', ja: '料金' },
  questions: { en: 'Questions', ko: '질문', ja: 'よくある質問' },
  start: { en: 'Start free', ko: '무료로 시작', ja: '無料で始める' },
} satisfies Record<string, Tri>;

const HERO = {
  title: {
    en: 'Lay out a website with your whole team in one shared file.',
    ko: '팀 전체가 공유 파일 하나에서 웹사이트 레이아웃을 잡습니다.',
    ja: 'ウェブサイトのレイアウトを、チーム全員が1つの共有ファイルで組みます。',
  },
  lede: {
    en: 'Margin is a web page editor in the browser. Draw at three widths, comment on the exact button and copy its CSS.',
    ko: 'Margin은 브라우저에서 동작하는 웹 페이지 편집기입니다. 세 가지 너비로 그리고, 정확한 버튼에 댓글을 달고, 그 CSS를 복사합니다.',
    ja: 'Marginはブラウザで使うウェブページ編集ツールです。3つの幅で描き、正確なボタンにコメントして、そのCSSをコピーできます。',
  },
  cta: { en: 'Start a free file', ko: '무료 파일 시작하기', ja: '無料ファイルを始める' },
} satisfies Record<string, Tri>;

const APP = {
  label: {
    en: 'The Margin editor with the Linnet Cycles homepage open',
    ko: 'Linnet Cycles 홈페이지가 열린 Margin 편집기',
    ja: 'Linnet Cycles のホームページを開いた Margin エディター',
  },
  file: { en: 'Homepage v3', ko: '홈페이지 v3', ja: 'ホームページ v3' },
  saved: { en: 'Saved just now', ko: '방금 저장됨', ja: 'たった今保存済み' },
  faces: { en: 'Mina, Alex and June are in this file', ko: '이 파일에는 Mina, Alex, June이 있습니다', ja: 'このファイルには Mina、Alex、June がいます' },
  rail: { en: 'Page and layers', ko: '페이지와 레이어', ja: 'ページとレイヤー' },
  page: { en: 'Page', ko: '페이지', ja: 'ページ' },
  pageName: { en: 'Homepage', ko: '홈페이지', ja: 'ホームページ' },
  layers: { en: 'Layers', ko: '레이어', ja: 'レイヤー' },
  canvas: {
    en: 'On the canvas: the Linnet Cycles homepage, with its four service cards. The Full service card is selected, Alex is pointing at it, and Mina has left a comment on it.',
    ko: '캔버스에는 Linnet Cycles 홈페이지와 서비스 카드 네 장이 있습니다. 풀 서비스 카드가 선택되어 있고, Alex가 그 카드를 가리키고 있으며, Mina가 그 카드에 댓글을 남겼습니다.',
    ja: 'キャンバスには Linnet Cycles のホームページと4枚のサービスカードがあります。フルサービスのカードが選ばれており、Alex がそのカードを指し、Mina がその上にコメントを残しています。',
  },
  tagDesktop: { en: 'Homepage, desktop 1440', ko: '홈페이지, 데스크톱 1440', ja: 'ホームページ、デスクトップ 1440' },
  tagPhone: { en: 'Homepage, phone 375', ko: '홈페이지, 휴대폰 375', ja: 'ホームページ、スマートフォン 375' },
  inspector: { en: 'Inspector', ko: '속성 패널', ja: 'プロパティパネル' },
  design: { en: 'Design', ko: '디자인', ja: 'デザイン' },
  inspect: { en: 'Inspect', ko: '검사', ja: '検査' },
  serviceCard: { en: 'Service card', ko: '서비스 카드', ja: 'サービスカード' },
  autoLayout: { en: 'Auto layout', ko: '자동 레이아웃', ja: '自動レイアウト' },
  vertical: { en: 'Vertical', ko: '세로', ja: '縦' },
  gap: { en: 'Gap', ko: '간격', ja: '間隔' },
  padding: { en: 'Padding', ko: '안쪽 여백', ja: '内側の余白' },
  fill: { en: 'Fill', ko: '채우기', ja: '塗り' },
  fillName: { en: 'Card / Lilac', ko: '카드 / 라일락', ja: 'カード / ライラック' },
  radius: { en: 'Radius', ko: '모서리 반경', ja: '角丸' },
  background: { en: 'Background', ko: '배경', ja: '背景' },
  titleText: { en: 'Title', ko: '제목', ja: 'タイトル' },
  priceText: { en: 'Price', ko: '가격', ja: '価格' },
  textValue: { en: '18/24, semibold', ko: '18/24, 세미볼드', ja: '18/24、セミボールド' },
  priceValue: { en: '32/32, semibold', ko: '32/32, 세미볼드', ja: '32/32、セミボールド' },
} satisfies Record<string, Tri>;

/** The customer's homepage drawn inside the editor and the feature frames. */
const SITE = {
  shop: { en: 'Shop', ko: '매장', ja: '店舗' },
  service: { en: 'Service', ko: '서비스', ja: 'サービス' },
  visit: { en: 'Visit us', ko: '찾아오기', ja: 'アクセス' },
  book: { en: 'Book', ko: '예약', ja: '予約' },
  open: { en: 'Open today until 19:00', ko: '오늘 19:00까지 영업', ja: '本日19:00まで営業' },
  title: { en: 'City bikes, serviced in a day.', ko: '시티 자전거, 하루 만에 정비합니다.', ja: '街乗り自転車、1日で整備します。' },
  body: {
    en: 'Drop your bike off before 10:00 and collect it after 17:00. We text you when it is ready.',
    ko: '10:00 전에 자전거를 맡기고 17:00 이후에 찾아가세요. 준비가 되면 문자로 알려 드립니다.',
    ja: '10:00までに自転車をお預けいただき、17:00以降にお受け取りください。準備ができたらSMSでお知らせします。',
  },
  bodyMid: {
    en: 'Drop your bike off before 10:00 and collect it after 17:00.',
    ko: '10:00 전에 자전거를 맡기고 17:00 이후에 찾아가세요.',
    ja: '10:00までにお預けいただき、17:00以降にお受け取りください。',
  },
  bodyShort: { en: 'Drop off before 10:00, collect after 17:00.', ko: '10:00 전 접수, 17:00 이후 수령.', ja: '10:00まで受付、17:00以降お受け取り。' },
  bookService: { en: 'Book a service', ko: '서비스 예약', ja: 'サービスを予約' },
  bookFrom: { en: 'Book a service, from $89', ko: '서비스 예약, $89부터', ja: 'サービスを予約、$89から' },
  bookShort: { en: 'Book, from $89', ko: '예약, $89부터', ja: '予約、$89から' },
  hours: { en: 'Opening hours', ko: '영업시간', ja: '営業時間' },
} satisfies Record<string, Tri>;

interface Service {
  id: 'full' | 'puncture' | 'wheel' | 'brake';
  name: Tri;
  short: Tri;
  time: Tri;
  price: string;
}

const SERVICES: Service[] = [
  { id: 'full', name: { en: 'Full service', ko: '풀 서비스', ja: 'フルサービス' }, short: { en: 'Full', ko: '풀', ja: 'フル' }, time: { en: 'Ready same day', ko: '당일 완료', ja: '当日仕上がり' }, price: '$89' },
  { id: 'puncture', name: { en: 'Puncture repair', ko: '펑크 수리', ja: 'パンク修理' }, short: { en: 'Tyre', ko: '타이어', ja: 'タイヤ' }, time: { en: '30 minutes', ko: '30분', ja: '30分' }, price: '$18' },
  { id: 'wheel', name: { en: 'Wheel truing', ko: '휠 센터링', ja: 'ホイール振れ取り' }, short: { en: 'Wheel', ko: '휠', ja: 'ホイール' }, time: { en: '1 hour', ko: '1시간', ja: '1時間' }, price: '$25' },
  { id: 'brake', name: { en: 'Brake bleed', ko: '브레이크 블리딩', ja: 'ブレーキのエア抜き' }, short: { en: 'Brake', ko: '브레이크', ja: 'ブレーキ' }, time: { en: '1 hour', ko: '1시간', ja: '1時間' }, price: '$35' },
];

type LayerKind = 'frame' | 'comp' | 'text' | 'group';

const LAYERS: { name: Tri; kind: LayerKind; depth: 0 | 1 | 2; on?: boolean }[] = [
  { name: { en: 'Homepage, desktop', ko: '홈페이지, 데스크톱', ja: 'ホームページ、デスクトップ' }, kind: 'frame', depth: 0 },
  { name: { en: 'Nav', ko: '내비게이션', ja: 'ナビゲーション' }, kind: 'comp', depth: 1 },
  { name: { en: 'Headline', ko: '제목', ja: '見出し' }, kind: 'text', depth: 1 },
  { name: { en: 'Book a service', ko: '서비스 예약', ja: 'サービスを予約' }, kind: 'comp', depth: 1 },
  { name: { en: 'Service cards', ko: '서비스 카드', ja: 'サービスカード' }, kind: 'group', depth: 1 },
  { name: { en: 'Full service', ko: '풀 서비스', ja: 'フルサービス' }, kind: 'comp', depth: 2, on: true },
  { name: { en: 'Puncture repair', ko: '펑크 수리', ja: 'パンク修理' }, kind: 'comp', depth: 2 },
  { name: { en: 'Wheel truing', ko: '휠 센터링', ja: 'ホイール振れ取り' }, kind: 'comp', depth: 2 },
];

interface Message {
  initial: 'M' | 'A' | 'J';
  who: Tri;
  time: string;
  text: Tri;
  /** A mention set apart at the start of the last sentence. */
  mention?: Tri;
}

interface ThreadData {
  id: 'hero' | 'feature';
  title: Tri;
  messages: Message[];
}

const THREADS: Record<ThreadData['id'], ThreadData> = {
  hero: {
    id: 'hero',
    title: { en: 'Full service', ko: '풀 서비스', ja: 'フルサービス' },
    messages: [
      {
        initial: 'M',
        who: { en: 'Mina', ko: 'Mina', ja: 'Mina' },
        time: '14:02',
        text: {
          en: "Can the turnaround go above the price? It was the first question in Tuesday's test.",
          ko: '소요 기간을 가격 위에 표시할 수 있을까요? 화요일 테스트에서 처음 나온 질문입니다.',
          ja: '所要時間を価格の上に表示できますか？ 火曜日のテストで最初に出た質問です。',
        },
      },
    ],
  },
  feature: {
    id: 'feature',
    title: { en: 'Book a service', ko: '서비스 예약', ja: 'サービスを予約' },
    messages: [
      {
        initial: 'M',
        who: { en: 'Mina Okafor', ko: 'Mina Okafor', ja: 'Mina Okafor' },
        time: '14:02',
        text: {
          en: "Can the button show the price? Two people asked for it in Tuesday's test.",
          ko: '버튼에 가격을 표시할 수 있을까요? 화요일 테스트에서 두 명이 요청했습니다.',
          ja: 'ボタンに価格を表示できますか？ 火曜日のテストで2名が求めていました。',
        },
      },
      {
        initial: 'A',
        who: { en: 'Alex Brandt', ko: 'Alex Brandt', ja: 'Alex Brandt' },
        time: '14:20',
        text: { en: 'Changed it. Still fits on one line at 375.', ko: '바꿨습니다. 375에서도 한 줄에 들어갑니다.', ja: '変更しました。375でも1行に収まります。' },
      },
      {
        initial: 'J',
        who: { en: 'June Park', ko: 'June Park', ja: 'June Park' },
        time: '14:31',
        text: { en: 'Looks right to me. {mention} can you close this?', ko: '제가 보기에도 맞습니다. {mention}, 이것 마무리해 주시겠어요?', ja: '問題ないと思います。{mention}、こちらを閉じていただけますか？' },
        mention: { en: '@Mina', ko: '@Mina', ja: '@Mina' },
      },
    ],
  },
};

const THREAD = {
  resolve: { en: 'Resolve', ko: '해결', ja: '解決' },
  reopen: { en: 'Reopen', ko: '다시 열기', ja: '再開' },
  resolvedOne: { en: 'Resolved by you just now. 1 comment, folded away.', ko: '방금 해결했습니다. 댓글 1개가 접혔습니다.', ja: 'たった今あなたが解決しました。コメント1件を折りたたみました。' },
  resolvedMany: { en: 'Resolved by you just now. {n} comments, folded away.', ko: '방금 해결했습니다. 댓글 {n}개가 접혔습니다.', ja: 'たった今あなたが解決しました。コメント{n}件を折りたたみました。' },
  resolvedNews: { en: 'Thread on {title} resolved.', ko: '{title} 스레드를 해결했습니다.', ja: '{title}のスレッドを解決しました。' },
  reopenedNews: { en: 'Thread on {title} reopened.', ko: '{title} 스레드를 다시 열었습니다.', ja: '{title}のスレッドを再開しました。' },
} satisfies Record<string, Tri>;

const FEATURES = {
  title: { en: "From the first layout to the developer's screen", ko: '첫 레이아웃부터 개발자 화면까지', ja: '最初のレイアウトから開発者の画面まで' },
  note: {
    en: 'One file holds the pages, the review and the measurements. Nobody exports screenshots or writes a separate spec.',
    ko: '한 파일에 페이지, 검토 내용, 치수가 모두 들어 있습니다. 스크린샷을 내보내거나 별도 사양서를 쓸 필요가 없습니다.',
    ja: '1つのファイルにページ、レビュー、計測値をまとめています。スクリーンショットを書き出したり、別の仕様書を書いたりする必要はありません。',
  },
  commentsTitle: { en: 'Comments stay on the element they are about', ko: '댓글은 해당 요소에 그대로 붙어 있습니다', ja: 'コメントは対象の要素に付いたままです' },
  commentsBody: {
    en: 'Click a layer and type. The thread is pinned to that layer, so when someone moves the button, the conversation moves with it.',
    ko: '레이어를 클릭하고 입력하세요. 스레드는 그 레이어에 고정되므로, 누군가 버튼을 옮기면 대화도 함께 옮겨갑니다.',
    ja: 'レイヤーをクリックして入力します。スレッドはそのレイヤーに固定されるので、誰かがボタンを動かすと会話も一緒に動きます。',
  },
  commentsList: [
    { en: 'Viewers comment on the free seat', ko: '열람자는 무료 좌석으로 댓글을 남깁니다', ja: '閲覧者は無料の席でコメントできます' },
    { en: 'Resolved threads fold away and stay searchable', ko: '해결된 스레드는 접히지만 검색할 수 있습니다', ja: '解決したスレッドは折りたたまれますが、検索できます' },
    { en: 'Send a thread to Jira or Linear as an issue', ko: '스레드를 Jira나 Linear에 이슈로 보낼 수 있습니다', ja: 'スレッドをJiraまたはLinearに課題として送れます' },
  ],
  framesTitle: { en: 'Desktop, tablet and phone side by side', ko: '데스크톱, 태블릿, 휴대폰을 나란히', ja: 'デスクトップ、タブレット、スマートフォンを並べて' },
  framesBody: {
    en: 'Draw the desktop frame once. Auto layout reflows it to 768 and 375 pixels, and you adjust only what has to change. Edit a headline in one frame and the other two update.',
    ko: '데스크톱 프레임은 한 번만 그리세요. 자동 레이아웃이 이를 768픽셀과 375픽셀에 맞춰 다시 배치하므로, 바뀌어야 할 부분만 손보면 됩니다. 한 프레임에서 제목을 고치면 나머지 두 프레임도 함께 바뀝니다.',
    ja: 'デスクトップのフレームは一度だけ描きます。自動レイアウトが768ピクセルと375ピクセルに組み直すので、変えるべき部分だけ調整すれば済みます。1つのフレームで見出しを編集すると、残りの2つも更新されます。',
  },
  framesList: [
    { en: 'Breakpoints match the ones in your CSS', ko: '브레이크포인트는 CSS의 값과 같습니다', ja: 'ブレークポイントは CSS のものと一致します' },
    { en: 'Preview any frame on your phone with a QR code', ko: 'QR 코드로 어떤 프레임이든 휴대폰에서 미리 볼 수 있습니다', ja: 'QRコードで、どのフレームもスマートフォンでプレビューできます' },
  ],
  framesGroup: { en: 'Show breakpoint', ko: '브레이크포인트 보기', ja: 'ブレークポイントを表示' },
  inspectTitle: { en: 'Developers take measurements from the file', ko: '개발자는 파일에서 치수를 확인합니다', ja: '開発者はファイルから計測値を取得します' },
  inspectBody: {
    en: 'Developers open the same link in Inspect mode. Every layer shows its size, spacing, color and text style, with the distances to its neighbors drawn on the canvas. Copy any layer as CSS.',
    ko: '개발자는 같은 링크를 검사 모드로 엽니다. 모든 레이어에 크기, 간격, 색상, 텍스트 스타일이 표시되고, 이웃 요소와의 거리가 캔버스에 그려집니다. 어떤 레이어든 CSS로 복사할 수 있습니다.',
    ja: '開発者は同じリンクを検査モードで開きます。すべてのレイヤーにサイズ、間隔、色、テキストスタイルが表示され、隣接する要素との距離がキャンバスに描かれます。どのレイヤーもCSSとしてコピーできます。',
  },
  inspectList: [
    { en: 'Color and text styles export as CSS variables', ko: '색상과 텍스트 스타일은 CSS 변수로 내보내집니다', ja: '色とテキストスタイルは CSS 変数として書き出せます' },
    { en: 'Inspect mode is free for viewers', ko: '검사 모드는 열람자에게 무료입니다', ja: '検査モードは閲覧者に無料です' },
  ],
  cssTitle: { en: 'CSS for Full service', ko: '풀 서비스의 CSS', ja: 'フルサービスの CSS' },
  copy: { en: 'Copy', ko: '복사', ja: 'コピー' },
  copyLabel: { en: 'Copy the CSS', ko: 'CSS 복사', ja: 'CSS をコピー' },
  copied: { en: 'Copied', ko: '복사됨', ja: 'コピーしました' },
  copiedNews: { en: 'The CSS for Full service is on your clipboard.', ko: '풀 서비스의 CSS를 클립보드에 복사했습니다.', ja: 'フルサービスの CSS をクリップボードにコピーしました。' },
  copyFailed: { en: 'Select the code to copy it', ko: '코드를 선택해 복사하세요', ja: 'コードを選択してコピーしてください' },
  copyFailedNews: {
    en: 'The browser did not allow copying. Select the code and copy it.',
    ko: '브라우저에서 복사를 허용하지 않았습니다. 코드를 선택해 직접 복사하세요.',
    ja: 'ブラウザでコピーが許可されませんでした。コードを選択して、コピーしてください。',
  },
} satisfies Record<string, Tri | Tri[]>;

type FrameId = 'desktop' | 'tablet' | 'phone';

const FRAMES: { id: FrameId; name: Tri; width: number; caption: Tri; news: Tri }[] = [
  {
    id: 'desktop',
    name: { en: 'Desktop', ko: '데스크톱', ja: 'デスクトップ' },
    width: 1440,
    caption: {
      en: 'Desktop 1440: the text and the four service cards sit side by side.',
      ko: '데스크톱 1440: 텍스트와 서비스 카드 네 장이 나란히 놓입니다.',
      ja: 'デスクトップ 1440: テキストと4枚のサービスカードが横に並びます。',
    },
    news: { en: 'Showing the desktop frame, 1440 wide.', ko: '데스크톱 프레임(너비 1440)을 표시합니다.', ja: 'デスクトップのフレーム（幅1440）を表示しています。' },
  },
  {
    id: 'tablet',
    name: { en: 'Tablet', ko: '태블릿', ja: 'タブレット' },
    width: 768,
    caption: {
      en: 'Tablet 768: the cards move under the text in one row of four, and two nav links fold into a menu.',
      ko: '태블릿 768: 카드가 텍스트 아래로 내려가 한 줄에 네 장이 놓이고, 내비게이션 링크 두 개는 메뉴로 접힙니다.',
      ja: 'タブレット 768: カードはテキストの下に移り、1行に4枚並びます。ナビのリンク2つはメニューにまとまります。',
    },
    news: { en: 'Showing the tablet frame, 768 wide.', ko: '태블릿 프레임(너비 768)을 표시합니다.', ja: 'タブレットのフレーム（幅768）を表示しています。' },
  },
  {
    id: 'phone',
    name: { en: 'Phone', ko: '휴대폰', ja: 'スマートフォン' },
    width: 375,
    caption: {
      en: 'Phone 375: the cards stack, two show above the fold, and the button shortens to "Book, from $89".',
      ko: '휴대폰 375: 카드가 세로로 쌓이고, 첫 화면에는 두 장이 보이며, 버튼은 "예약, $89부터"로 줄어듭니다.',
      ja: 'スマートフォン 375: カードは縦に積まれ、ファーストビューには2枚が見えます。ボタンは「予約、$89から」に短くなります。',
    },
    news: { en: 'Showing the phone frame, 375 wide.', ko: '휴대폰 프레임(너비 375)을 표시합니다.', ja: 'スマートフォンのフレーム（幅375）を表示しています。' },
  },
];

/** The CSS that Inspect mode gives for the Full service card. */
const CSS_RULES: [string, string][] = [
  ['display', 'flex'],
  ['flex-direction', 'column'],
  ['gap', '8px'],
  ['width', '240px'],
  ['padding', '20px'],
  ['border-radius', '12px'],
  ['background', 'var(--card-lilac)'],
];
const CSS_COMMENT = '/* Service card / Full service */';
const CSS_TEXT = `${CSS_COMMENT}\n.service-card {\n${CSS_RULES.map(([key, value]) => `  ${key}: ${value};`).join('\n')}\n}`;

interface Case {
  name: string;
  swatch: 'coral' | 'blue';
  who: Tri;
  figure: string;
  unit: Tri;
  caption: Tri;
  body: Tri;
  facts: [Tri, Tri][];
}

const CUSTOMERS = {
  title: { en: 'Who works in Margin', ko: 'Margin을 쓰는 사람들', ja: 'Margin を使うチーム' },
  note: {
    en: 'In-house product teams and small studios. Two of them, in their own numbers.',
    ko: '사내 제품 팀과 작은 스튜디오. 그중 두 곳의 실제 숫자를 보여 드립니다.',
    ja: '社内の製品チームと小規模なスタジオ。そのうち2社の実績を数字で紹介します。',
  },
} satisfies Record<string, Tri>;

const PLAN = { en: 'Plan', ko: '요금제', ja: 'プラン' };
const VIEWERS = { en: 'Viewers', ko: '열람자', ja: '閲覧者' };
const SINCE = { en: 'In Margin since', ko: 'Margin 사용 시작', ja: 'Margin 利用開始' };

const CASES: Case[] = [
  {
    name: 'Nordvik Ferries',
    swatch: 'coral',
    who: { en: 'Bergen. 3 designers and 11 developers.', ko: 'Bergen. 디자이너 3명, 개발자 11명.', ja: 'Bergen。デザイナー3名、開発者11名。' },
    figure: '4',
    unit: { en: 'days', ko: '일', ja: '日' },
    caption: {
      en: 'from an approved screen to merged code, down from 9 days before the move',
      ko: '승인된 화면에서 병합된 코드까지, 도입 전 9일에서 줄었습니다',
      ja: '承認済みの画面からマージまで、導入前の9日から短縮',
    },
    body: {
      en: 'The team rebuilt ticket booking across 64 screens in six weeks. Developers worked from Inspect mode, and questions went into comments on the screen in question.',
      ko: '이 팀은 6주 동안 64개 화면에 걸쳐 티켓 예약을 다시 만들었습니다. 개발자는 검사 모드에서 작업했고, 질문은 해당 화면의 댓글로 남겼습니다.',
      ja: 'このチームは6週間で、64画面にわたるチケット予約を作り直しました。開発者は検査モードで作業し、質問は該当する画面のコメントに書き込まれました。',
    },
    facts: [
      [PLAN, { en: 'Business, 14 editors', ko: 'Business, 편집자 14명', ja: 'Business、編集者14名' }],
      [VIEWERS, { en: '40, including the ticket office', ko: '40명, 매표소 포함', ja: '40名、チケット窓口を含む' }],
      [SINCE, { en: 'March 2025', ko: '2025년 3월', ja: '2025年3月' }],
    ],
  },
  {
    name: 'Studio Okapi',
    swatch: 'blue',
    who: { en: 'Lisbon. A studio of four running 14 client websites.', ko: 'Lisbon. 직원 4명의 스튜디오, 고객 웹사이트 14곳 운영.', ja: 'Lisbon。4名のスタジオで、顧客のウェブサイト14件を運営。' },
    figure: '318',
    unit: { en: 'comments', ko: '댓글', ja: 'コメント' },
    caption: {
      en: 'left by clients in October, every one answered inside the file',
      ko: '10월에 고객이 남긴 댓글, 모두 파일 안에서 답변했습니다',
      ja: '10月に顧客が残したコメント。すべてファイル内で返信済み',
    },
    body: {
      en: 'Clients join as viewers and review on the page itself. Feedback used to arrive as annotated screenshots by email; now each note sits on the heading or image it is about.',
      ko: '고객은 열람자로 참여해 페이지에서 바로 검토합니다. 예전에는 주석이 달린 스크린샷을 이메일로 받았지만, 이제는 각 메모가 해당 제목이나 이미지 위에 놓입니다.',
      ja: 'クライアントは閲覧者として参加し、ページ上で直接レビューします。以前は注釈付きのスクリーンショットをメールで受け取っていましたが、今は各メモが対象の見出しや画像の上に付きます。',
    },
    facts: [
      [PLAN, { en: 'Team, 4 editors', ko: 'Team, 편집자 4명', ja: 'Team、編集者4名' }],
      [VIEWERS, { en: '26 people across 14 clients', ko: '14개 고객사, 26명', ja: '14社、26名' }],
      [SINCE, { en: 'September 2024', ko: '2024년 9월', ja: '2024年9月' }],
    ],
  },
];

const PRICING = {
  title: { en: 'Pricing', ko: '요금제', ja: '料金' },
  note: {
    en: 'You pay for editors, the people who change layouts. Viewers and commenters are free on every plan.',
    ko: '편집자, 즉 레이아웃을 바꾸는 사람에게만 요금을 냅니다. 열람자와 댓글 작성자는 모든 요금제에서 무료입니다.',
    ja: '料金がかかるのは編集者、つまりレイアウトを変更する人です。閲覧者とコメント担当者は、すべてのプランで無料です。',
  },
  billing: { en: 'Billing period', ko: '결제 주기', ja: '請求期間' },
  yearly: { en: 'Yearly', ko: '연간', ja: '年払い' },
  monthly: { en: 'Monthly', ko: '월간', ja: '月払い' },
  perYear: { en: 'Prices per editor, per month, billed yearly', ko: '편집자 1명당 월 가격, 연간 결제', ja: '編集者1名あたりの月額、年払い' },
  perMonth: { en: 'Prices per editor, per month, billed monthly', ko: '편집자 1명당 월 가격, 월간 결제', ja: '編集者1名あたりの月額、月払い' },
  yearlyNews: { en: 'Showing yearly prices. Team is $12 and Business $28 per editor a month.', ko: '연간 가격을 표시합니다. Team은 편집자 1명당 월 $12, Business는 월 $28입니다.', ja: '年払いの価格を表示しています。Teamは編集者1名あたり月額$12、Businessは月額$28です。' },
  monthlyNews: { en: 'Showing monthly prices. Team is $15 and Business $34 per editor a month.', ko: '월간 가격을 표시합니다. Team은 편집자 1명당 월 $15, Business는 월 $34입니다.', ja: '月払いの価格を表示しています。Teamは編集者1名あたり月額$15、Businessは月額$34です。' },
  billedMonthly: { en: '{price} billed monthly', ko: '월간 결제 {price}', ja: '月払い {price}' },
  billedYearly: { en: '{price} billed yearly', ko: '연간 결제 {price}', ja: '年払い {price}' },
  noCard: { en: 'No card needed', ko: '카드 등록 불필요', ja: 'カード登録は不要' },
  feature: { en: 'What you get', ko: '포함 내용', ja: '含まれる内容' },
  startFree: { en: 'Start free', ko: '무료로 시작', ja: '無料で始める' },
  tryTeam: { en: 'Try Team for 30 days', ko: 'Team 30일 무료 체험', ja: 'Team を30日間試す' },
  sales: { en: 'Talk to sales', ko: '영업팀에 문의', ja: '営業に相談' },
} satisfies Record<string, Tri>;

type PlanId = 'starter' | 'team' | 'business';

const PLANS: { id: PlanId; name: string; yearly: number; monthly: number }[] = [
  { id: 'starter', name: 'Starter', yearly: 0, monthly: 0 },
  { id: 'team', name: 'Team', yearly: 12, monthly: 15 },
  { id: 'business', name: 'Business', yearly: 28, monthly: 34 },
];

const INCLUDED = { en: 'Included', ko: '포함', ja: '含む' };
const UNLIMITED = { en: 'Unlimited', ko: '무제한', ja: '無制限' };
const NO = { en: 'No', ko: '미포함', ja: '非対応' };

/** One row of the pricing table: the feature, then Starter, Team and Business. A `null` is a plain "No". */
const PRICE_ROWS: { name: Tri; values: [Tri | null, Tri | null, Tri | null] }[] = [
  { name: { en: 'Editors', ko: '편집자', ja: '編集者' }, values: [{ en: '2', ko: '2', ja: '2' }, UNLIMITED, UNLIMITED] },
  { name: { en: 'Files', ko: '파일', ja: 'ファイル' }, values: [{ en: '3', ko: '3', ja: '3' }, UNLIMITED, UNLIMITED] },
  { name: { en: 'Viewers and commenters', ko: '열람자와 댓글 작성자', ja: '閲覧者とコメント担当者' }, values: [UNLIMITED, UNLIMITED, UNLIMITED] },
  {
    name: { en: 'Version history', ko: '버전 기록', ja: 'バージョン履歴' },
    values: [{ en: '14 days', ko: '14일', ja: '14日間' }, { en: '90 days', ko: '90일', ja: '90日間' }, { en: 'Kept forever', ko: '영구 보관', ja: '無期限で保存' }],
  },
  { name: { en: 'Inspect mode and CSS export', ko: '검사 모드와 CSS 내보내기', ja: '検査モードとCSS書き出し' }, values: [INCLUDED, INCLUDED, INCLUDED] },
  { name: { en: 'Shared component libraries', ko: '공유 컴포넌트 라이브러리', ja: '共有コンポーネントライブラリ' }, values: [null, INCLUDED, INCLUDED] },
  { name: { en: 'Single sign-on', ko: '싱글 사인온', ja: 'シングルサインオン' }, values: [null, null, { en: 'SAML and SCIM', ko: 'SAML and SCIM', ja: 'SAML and SCIM' }] },
  {
    name: { en: 'Support', ko: '지원', ja: 'サポート' },
    values: [
      { en: 'Help center', ko: '도움말 센터', ja: 'ヘルプセンター' },
      { en: 'Email, answered the next working day', ko: '이메일, 다음 영업일에 답변', ja: 'メール、翌営業日に回答' },
      { en: 'A named contact, 4-hour replies', ko: '전담 담당자, 4시간 내 답변', ja: '専任担当者、4時間以内に返信' },
    ],
  },
];

const QUESTIONS = {
  title: { en: 'Questions', ko: '질문', ja: 'よくある質問' },
  items: [
    {
      q: { en: 'Do people who only leave comments need a paid seat?', ko: '댓글만 남기는 사람도 유료 좌석이 필요한가요?', ja: 'コメントだけ残す人も有料の席が必要ですか？' },
      a: {
        en: 'No. Viewers can open every file, comment and use Inspect mode for free on all plans. A seat is only needed to move or edit layers.',
        ko: '아니요. 열람자는 모든 요금제에서 모든 파일을 열고, 댓글을 달고, 검사 모드를 무료로 쓸 수 있습니다. 좌석은 레이어를 옮기거나 편집할 때만 필요합니다.',
        ja: 'いいえ。閲覧者はすべてのプランで、すべてのファイルを開き、コメントし、検査モードを無料で使えます。席が必要なのは、レイヤーを移動または編集する場合だけです。',
      },
    },
    {
      q: { en: 'Can we bring our existing files across?', ko: '기존 파일을 옮겨 올 수 있나요?', ja: '既存のファイルを移行できますか？' },
      a: {
        en: 'Yes. Margin imports .fig and .sketch files with their frames, text styles and color styles. Prototype links and plugins do not come across.',
        ko: '네. Margin은 .fig와 .sketch 파일을 프레임, 텍스트 스타일, 색상 스타일과 함께 가져옵니다. 프로토타입 링크와 플러그인은 옮겨지지 않습니다.',
        ja: 'はい。Marginは.figと.sketchのファイルを、フレーム、テキストスタイル、カラースタイルごと読み込みます。プロトタイプのリンクとプラグインは移行されません。',
      },
    },
    {
      q: { en: 'Where are our files stored?', ko: '파일은 어디에 저장되나요?', ja: 'ファイルはどこに保存されますか？' },
      a: {
        en: 'In Frankfurt or in Virginia, chosen when you create the workspace. Files are encrypted at rest, and Business workspaces get a full nightly backup they can download.',
        ko: 'Frankfurt 또는 Virginia에 저장되며, 워크스페이스를 만들 때 선택합니다. 파일은 저장 상태에서 암호화되고, Business 워크스페이스는 내려받을 수 있는 전체 야간 백업을 받습니다.',
        ja: 'FrankfurtまたはVirginiaに保存され、ワークスペース作成時に選びます。ファイルは保存時に暗号化されます。Businessのワークスペースは、ダウンロードできる毎晩の完全バックアップを受け取れます。',
      },
    },
  ],
};

const START = {
  title: { en: 'Start a free file', ko: '무료 파일 시작하기', ja: '無料ファイルを始める' },
  note: {
    en: 'Three files, two editors and as many viewers as you like. We email you a link that opens your first file, with no card and nothing to install.',
    ko: '파일 3개, 편집자 2명, 열람자는 원하는 만큼. 첫 파일을 여는 링크를 이메일로 보내 드립니다. 카드 등록도, 설치도 필요 없습니다.',
    ja: 'ファイル3つ、編集者2名、閲覧者は何人でも。最初のファイルを開くリンクをメールでお送りします。カード登録もインストールも不要です。',
  },
  email: { en: 'Work email', ko: '업무용 이메일', ja: '業務用メールアドレス' },
  submit: { en: 'Send me the link', ko: '링크 보내기', ja: 'リンクを送信' },
  empty: { en: 'Enter your email address.', ko: '이메일 주소를 입력하세요.', ja: 'メールアドレスを入力してください。' },
  invalid: {
    en: 'Enter an email address with an @ and a domain, like mina@studio.com.',
    ko: '@와 도메인이 있는 이메일 주소를 입력하세요. 예: mina@studio.com',
    ja: '@とドメインを含むメールアドレスを入力してください。例: mina@studio.com',
  },
  doneTitle: { en: 'Check your inbox', ko: '받은편지함을 확인하세요', ja: '受信トレイをご確認ください' },
  doneBody: {
    en: 'We sent a sign-in link to {email}. It opens a blank file with the Linnet Cycles homepage beside it as an example, and it works for 24 hours.',
    ko: '{email}로 로그인 링크를 보냈습니다. 링크를 열면 빈 파일이 열리고, 예시로 Linnet Cycles 홈페이지가 옆에 놓여 있습니다. 링크는 24시간 동안 유효합니다.',
    ja: '{email}宛にサインインリンクを送信しました。リンクを開くと、例としてLinnet Cycles のホームページを横に置いた空のファイルが開きます。リンクの有効期間は24時間です。',
  },
  again: { en: 'Use a different email', ko: '다른 이메일 사용', ja: '別のメールアドレスを使う' },
} satisfies Record<string, Tri>;

const FOOT = {
  nav: { en: 'Footer', ko: '바닥글', ja: 'フッター' },
  company: { en: 'Margin Labs B.V., Rotterdam', ko: 'Margin Labs B.V., Rotterdam', ja: 'Margin Labs B.V., Rotterdam' },
} satisfies Record<string, Tri>;

const PROMPT_EN = `Design one real page in the Product x Swiss style: a white page on a 12-column grid with square, ruled sections, where colour lives only inside the product's own interface (selections, cursors, comment pins, colour swatches) and the product UI is drawn in CSS as the proof.

Pick a real software product whose interface explains it, and write its real feature page: what it does, for whom, how it works, pricing. The page must read as that product's page, never as a page about its own style. Here it is Margin, a browser editor for web pages: designers draw each page at desktop, tablet and phone widths, the team comments on the exact element, and developers copy sizes and CSS from the same file. The file open in the editor is the homepage of Linnet Cycles, a bike repair shop.

TOKENS:
--paper: #ffffff (page, opaque surface for any menu over the page)
--stage: #f4f4f6 (the canvas behind drawn pages, with a 1px dot grid every 18px)
--panel: #fafafb (editor bars and side panels)
--ink: #0d0d0e
--ink-2: #2b2c30 (reading text)
--muted: #5d5f66
--line: #c2c4ca (rules and the editor's frame)
--line-ui: #c8cad0 (fields and dividers inside the editor)
--violet: #6c5cff (selection, focus ring, chosen frame)
--violet-ink: #3f31d6 (violet text on white and on --violet-wash)
--violet-wash: #ecebff
--yellow: #ffd84d, --yellow-wash: #fff3bf (the Team plan's column)
--blue: #73d7ff, --coral: #ff765f, --green: #78d88c, --lilac: #cbb7ff (the logo, the drawn site's service cards, avatars, cursors and the square by each customer's name)
--coral-ink: #b0442f (redlines, CSS property names, component icons and form errors)
--green-ink: #2b7a41 (the drawn site's "open today" line)

COLOUR:
- The page itself is ink on white. Colour appears inside the editor surfaces: the drawn site's four service cards, the selection outline and its size tag, two named cursors, comment pins, avatars and colour swatches.
- Outside the editor, colour appears only in the four-square logo, a small square by each customer's name, and the Team plan's yellow wash with a 4px yellow rule on top of its column.
- Buttons are ink: a solid ink button for the main action and a 1px ink outline for the others; hover darkens the solid one to --ink-2 and fills the outlined one with --stage. Links in bars are --muted and turn ink on hover. Errors are --coral-ink text under the field, and the field's border turns --coral-ink.
- Text on coral and green is a dark tint of each (#2a0d06, #12331c); white text sits only on ink, violet and the grey of a resolved pin (--muted). Shadows, ruler ticks and the dot grid are ink at low alpha. No other colours, and no gradients except the dot grid and ruler ticks.
- Section tops are a 1px ink rule; rows inside sections are 1px --line rules.

TYPOGRAPHY:
One family: Geologica (300 to 800) at every size. Its wide, round letters carry the friendly voice.
H1: 600, clamp(2.25rem, 4vw, 3.125rem), line-height 1.03, letter-spacing -0.03em, two lines beside the lede on desktop.
H2: 600, clamp(1.9rem, 3.4vw, 2.85rem), line-height 1.08, letter-spacing -0.025em.
H3: 600, 1.5rem (1.375rem on phones), line-height 1.2, letter-spacing -0.015em.
Customer figures: 300, clamp(4rem, 7.4vw, 6.4rem), line-height 0.95, letter-spacing -0.04em, with the unit in 500 at 1.375rem.
Plan prices: 600, 2.75rem, letter-spacing -0.035em (1.75rem on phones). Questions: 600, 1.1875rem.
Body: 380, 1.0625rem, line-height 1.6; the hero lede 1rem; lists, captions, facts and table cells 1rem; price notes 0.875rem and the phone table's plan labels 0.8125rem. Inside the editor the same face runs at 0.8125rem, 450 for text and 600 for names, like a product's own UI font; drawn pages inside it may go smaller because they are pictures with a text alternative.
CSS code: the system monospace stack (ui-monospace, SF Mono, Menlo, Consolas) at 0.8125rem, line-height 1.6.
Figures are tabular. No all-caps tracked labels.

LAYOUT:
- A 1120px column on a 12-column grid with 24px gutters.
- Top bar, 56px on a 1px rule: the product name with a four-square logo (coral, yellow, blue, green), four in-page links, and one solid "Start free" button.
- Hero: the H1 across eight columns with the lede and a solid "Start a free file" button in the last four, then the editor window across all twelve. On a 1280x800 laptop the headline and the whole editor window are on the first screen.
- The editor window: 1px --line border, 16px radius, a soft two-layer shadow. A 40px bar (logo, file path, "Saved just now", three avatars, zoom), then three columns: a 184px rail with the page and its layers, the stage with a ruler and the drawn homepage beside an open comment thread, and a 224px inspector with Design and Inspect tabs.
- Then: features (three rows, each with the text in four columns and the part of the editor that does it in eight, on a stage-coloured, dot-gridded, 14px-radius surface), customers (two columns split by a 1px rule), pricing (one table), questions (heading in four columns, answers in eight), the free-file sign-up, and a footer.
- Sections are 112px apart (80px on phones). Below 1200px features stack; below 760px everything is one column.

COMPONENTS:
- Editor window: the stage shows the drawn homepage (nav, "open today" line, headline, text, two buttons, four coloured service cards) with the Full service card selected: a 1.5px violet outline, four square handles and a violet size tag. Two named cursors (Alex in coral, Mina in violet) and a comment pin sit on the canvas. The rail lists the page and its layers with the selected layer on --violet-wash. On phones the drawing switches to its phone layout and the inspector moves under the stage.
- Inspector: two tabs, Design and Inspect (tab pattern: roving tabindex, arrow keys, Home and End, one labelled panel). Design shows position and size fields, auto layout and fill; Inspect shows the same layer as developer values.
- Comment thread: a white 12px-radius panel with the layer's name and a Resolve button, messages with a round avatar, a name, a time and the text, and an @mention on --violet-wash. Resolve folds the messages away into one line and becomes Reopen; the canvas pin turns grey.
- Breakpoint switch: a segmented group of three toggle buttons (Desktop 1440, Tablet 768, Phone 375, aria-pressed). On desktop the three frames stand side by side and the chosen one gets the violet outline while the others fade; on phones only the chosen frame is drawn. A sentence under the frames says what changes at that width.
- Inspect drawing: the Full service card with coral redlines for padding, gap, width and height, beside a white code panel with the card's CSS and a Copy button that confirms with "Copied".
- Pricing: one table with Starter, Team and Business columns, the Team column on the yellow wash. A Yearly/Monthly toggle pair changes every price and the note under each price. On phones the table keeps its roles and each row becomes the feature's name over three labelled values.
- Free-file sign-up: one email field (48px, 1px --muted border, 8px radius) with a visible label and a solid button. Errors sit under the field with role="alert"; a valid address replaces the form with a confirmation that takes focus and shows the address.
- Page buttons are 44px high (40px in the desktop top bar) with an 8px radius; the small buttons inside the editor surfaces are 30 to 38px on desktop. Every control is at least 44px high on phones.
- The page's own blocks have square corners. Radii belong to the editor surfaces (16px window, 14px feature stages, 12px threads and code panel, 9px segmented switches, 6px fields and editor buttons) and to the page's buttons and field (8px).

MOTION:
- A 160ms colour change on hover, and a 160ms fade when another breakpoint frame is chosen. Nothing moves on its own. prefers-reduced-motion removes the transitions.

FORBIDDEN:
- Cards and grids of identical rounded boxes on the page itself, pills, chips, badges, glows, gradients on the page
- A small label above a heading, all-caps tracked labels, numbered section markers
- Pages about design principles, style rules or the palette
- Stock photos, illustrations, floating abstract shapes, emoji, arrows on links, middle-dot meta strings
- Colour as page decoration: no coloured section backgrounds except the Team column

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML: a labelled region for the editor window, a tab list for the inspector, toggle buttons with aria-pressed, a table with explicit roles for pricing, a description list for the questions, a labelled form
3) Working inspector tabs, Resolve and Reopen, the breakpoint switch, the billing toggle, Copy, and the sign-up with its error and success states, each change announced in a polite live region
4) Responsive layout down to 320px with no horizontal scroll and every control at least 44px high on phones
5) Visible focus on every control (2px violet ring), a text alternative for every drawing, reduced-motion support`;

const PROMPT_KO = `Product x Swiss 스타일로 실제 페이지 하나를 디자인한다. 12열 그리드 위의 흰 페이지에 사각형과 선으로 나뉜 섹션을 두고, 색은 제품 자체 인터페이스 안(선택 영역, 커서, 댓글 핀, 색상 견본)에만 쓰며, 제품 UI는 증거로서 CSS로 그린다.

인터페이스가 제품을 설명해 주는 실제 소프트웨어 제품을 고르고, 그 제품의 기능 페이지를 쓴다: 무엇을 하는지, 누구를 위한 것인지, 어떻게 동작하는지, 요금. 페이지는 그 제품의 페이지로 읽혀야 하며, 스타일 자체에 관한 페이지로 읽혀서는 안 된다. 여기서는 웹 페이지용 브라우저 편집기 Margin이다. 디자이너는 데스크톱, 태블릿, 휴대폰 너비로 각 페이지를 그리고, 팀은 정확한 요소에 댓글을 달며, 개발자는 같은 파일에서 크기와 CSS를 복사한다. 편집기에 열린 파일은 자전거 수리점 Linnet Cycles의 홈페이지다.

TOKENS:
--paper: #ffffff (페이지, 페이지 위 메뉴의 불투명한 면)
--stage: #f4f4f6 (그린 페이지 뒤의 캔버스, 18px마다 1px 점 격자)
--panel: #fafafb (편집기 바와 옆 패널)
--ink: #0d0d0e
--ink-2: #2b2c30 (본문 텍스트)
--muted: #5d5f66
--line: #c2c4ca (규칙선과 편집기 테두리)
--line-ui: #c8cad0 (편집기 안의 입력란과 구분선)
--violet: #6c5cff (선택, 포커스 링, 선택된 프레임)
--violet-ink: #3f31d6 (흰 바탕과 --violet-wash 위의 보라색 텍스트)
--violet-wash: #ecebff
--yellow: #ffd84d, --yellow-wash: #fff3bf (Team 요금제 열)
--blue: #73d7ff, --coral: #ff765f, --green: #78d88c, --lilac: #cbb7ff (로고, 그린 사이트의 서비스 카드, 아바타, 커서, 고객 이름 옆 사각형)
--coral-ink: #b0442f (레드라인, CSS 속성 이름, 컴포넌트 아이콘, 폼 오류)
--green-ink: #2b7a41 (그린 사이트의 "오늘 19:00까지 영업" 줄)

COLOUR:
- 페이지 자체는 흰 바탕에 잉크색 글자다. 색은 편집기 면 안에만 나타난다: 그린 사이트의 서비스 카드 네 장, 선택 윤곽선과 크기 태그, 이름이 붙은 커서 두 개, 댓글 핀, 아바타, 색상 견본.
- 편집기 밖에서는 색이 네 칸짜리 로고, 고객 이름 옆의 작은 사각형, 그리고 Team 요금제 열의 노란 바탕과 열 위쪽의 4px 노란 선에만 나타난다.
- 버튼은 잉크색이다. 주요 동작은 채운 잉크색 버튼, 나머지는 1px 잉크색 외곽선 버튼을 쓴다. 호버하면 채운 버튼은 --ink-2로 어두워지고, 외곽선 버튼은 --stage로 채워진다. 바의 링크는 --muted이고 호버하면 잉크색이 된다. 오류는 입력란 아래의 --coral-ink 텍스트이며, 입력란의 테두리도 --coral-ink로 바뀐다.
- 코럴과 그린 위의 글자는 각각의 짙은 음영(#2a0d06, #12331c)이다. 흰 글자는 잉크색, 보라색, 해결된 핀의 회색(--muted) 위에만 놓인다. 그림자, 눈금자 눈금, 점 격자는 낮은 투명도의 잉크색이다. 다른 색은 쓰지 않으며, 그라데이션은 점 격자와 눈금자 눈금 외에는 쓰지 않는다.
- 섹션 상단은 1px 잉크색 선이다. 섹션 안의 행은 1px --line 선으로 구분한다.

TYPOGRAPHY:
서체는 하나다: Geologica(300~800)를 모든 크기에 쓴다. 넓고 둥근 글자가 친근한 어조를 담는다.
H1: 600, clamp(2.25rem, 4vw, 3.125rem), 줄 간격 1.03, 자간 -0.03em, 데스크톱에서는 리드 문단 옆에 두 줄로 놓는다.
H2: 600, clamp(1.9rem, 3.4vw, 2.85rem), 줄 간격 1.08, 자간 -0.025em.
H3: 600, 1.5rem(휴대폰에서는 1.375rem), 줄 간격 1.2, 자간 -0.015em.
고객 수치: 300, clamp(4rem, 7.4vw, 6.4rem), 줄 간격 0.95, 자간 -0.04em, 단위는 500, 1.375rem.
요금제 가격: 600, 2.75rem, 자간 -0.035em(휴대폰에서는 1.75rem). 질문: 600, 1.1875rem.
본문: 380, 1.0625rem, 줄 간격 1.6. 히어로 리드는 1rem. 목록, 캡션, 정보 항목, 표의 셀은 1rem. 요금 설명은 0.875rem, 휴대폰 표의 요금제 이름은 0.8125rem. 편집기 안에서는 같은 서체를 0.8125rem으로 쓰며, 본문은 450, 이름은 600을 쓴다. 제품 자체 UI 글꼴처럼 보이게 한다. 편집기 안의 그린 페이지는 텍스트 대체 설명이 있는 그림이므로 더 작게 써도 된다.
CSS 코드: 시스템 고정폭 서체 스택(ui-monospace, SF Mono, Menlo, Consolas), 0.8125rem, 줄 간격 1.6.
숫자는 자릿수를 맞춘 표 숫자를 쓴다. 자간을 넓힌 전체 대문자 라벨은 쓰지 않는다.

LAYOUT:
- 12열 그리드에 24px 거터를 둔 1120px 너비의 열.
- 상단 바, 1px 선 위의 56px 높이: 네 칸 로고(코럴, 노랑, 파랑, 그린)가 붙은 제품 이름, 페이지 안 링크 네 개, 채운 "무료로 시작" 버튼 하나.
- 히어로: H1은 여덟 열에 걸치고, 리드 문단과 채운 "무료 파일 시작하기" 버튼은 마지막 네 열에 둔다. 그다음 편집기 창을 열두 열 전체에 놓는다. 1280x800 노트북에서는 제목과 편집기 창 전체가 첫 화면에 보여야 한다.
- 편집기 창: 1px --line 테두리, 16px 모서리 반경, 부드러운 이중 그림자. 40px 바(로고, 파일 경로, "방금 저장됨", 아바타 세 개, 확대/축소), 그다음 세 열: 페이지와 레이어가 든 184px 레일, 눈금자와 그린 홈페이지가 열린 댓글 스레드 옆에 놓인 스테이지, 디자인과 검사 탭이 있는 224px 속성 패널.
- 그다음: 기능(행 세 개, 각 행은 텍스트 네 열과 그 기능을 하는 편집기 부분 여덟 열, 스테이지 색 바탕에 점 격자가 있고 14px 모서리 반경을 가진 면 위에), 고객(1px 선으로 나뉜 두 열), 요금제(표 하나), 질문(제목은 네 열, 답변은 여덟 열), 무료 파일 가입, 바닥글.
- 섹션 사이는 112px 간격이다(휴대폰에서는 80px). 1200px 미만에서는 기능 행이 세로로 쌓이고, 760px 미만에서는 모든 요소가 한 열이 된다.

COMPONENTS:
- 편집기 창: 스테이지에는 그린 홈페이지(내비게이션, "오늘 19:00까지 영업" 줄, 제목, 본문, 버튼 두 개, 색이 있는 서비스 카드 네 장)가 보이고, 풀 서비스 카드가 선택되어 1.5px 보라색 윤곽선, 사각 핸들 네 개, 보라색 크기 태그가 붙는다. 이름이 붙은 커서 두 개(코럴의 Alex, 보라색의 Mina)와 댓글 핀이 캔버스 위에 있다. 레일에는 페이지와 레이어 목록이 있고, 선택된 레이어는 --violet-wash로 표시된다. 휴대폰에서는 그림이 휴대폰 레이아웃으로 바뀌고, 속성 패널은 스테이지 아래로 옮겨진다.
- 속성 패널: 탭 두 개, 디자인과 검사(탭 패턴: roving tabindex, 화살표 키, Home과 End, 레이블이 붙은 패널 하나). 디자인은 위치와 크기 입력란, 자동 레이아웃, 채우기를 보여 주고, 검사는 같은 레이어를 개발자용 값으로 보여 준다.
- 댓글 스레드: 레이어 이름과 "해결" 버튼이 있는 흰색 12px 모서리 반경 패널. 메시지는 둥근 아바타, 이름, 시간, 본문으로 구성되며, @멘션은 --violet-wash 위에 표시된다. "해결"을 누르면 메시지가 한 줄로 접히고 버튼은 "다시 열기"가 되며, 캔버스의 핀은 회색으로 바뀐다.
- 브레이크포인트 전환: 토글 버튼 세 개로 된 분할 그룹(데스크톱 1440, 태블릿 768, 휴대폰 375, aria-pressed). 데스크톱에서는 세 프레임이 나란히 서고, 선택한 프레임에는 보라색 윤곽선이 붙고 나머지는 흐려진다. 휴대폰에서는 선택한 프레임만 그려진다. 프레임 아래 문장은 그 너비에서 무엇이 바뀌는지 설명한다.
- 검사 도면: 안쪽 여백, 간격, 너비, 높이를 코럴 레드라인으로 표시한 풀 서비스 카드를 두고, 그 옆에 카드의 CSS가 든 흰색 코드 패널과 "복사됨"으로 확인되는 복사 버튼을 둔다.
- 요금제: Starter, Team, Business 열이 있는 표 하나. Team 열은 노란 바탕 위에 있다. 연간/월간 토글 쌍은 모든 가격과 각 가격 아래 설명을 바꾼다. 휴대폰에서는 표의 역할 정보를 그대로 두고, 각 행을 기능 이름과 레이블이 붙은 값 세 개로 바꾼다.
- 무료 파일 가입: 이메일 입력란 하나(48px, 1px --muted 테두리, 8px 모서리 반경)에 보이는 레이블과 채운 버튼. 오류는 role="alert"로 입력란 아래에 놓인다. 올바른 주소가 입력되면 폼 대신 확인 화면이 나타나 포커스를 받고 주소를 보여 준다.
- 페이지 버튼은 높이 44px(데스크톱 상단 바에서는 40px), 모서리 반경 8px이다. 편집기 면 안의 작은 버튼은 데스크톱에서 30~38px이다. 휴대폰에서는 모든 컨트롤의 높이가 최소 44px이다.
- 페이지 자체의 블록은 모서리가 각지다. 모서리 반경은 편집기 면(16px 창, 14px 기능 스테이지, 12px 스레드와 코드 패널, 9px 분할 스위치, 6px 입력란과 편집기 버튼)과, 페이지의 버튼과 입력란(8px)에만 쓴다.

MOTION:
- 호버 시 160ms 색 변화, 다른 브레이크포인트 프레임을 고르면 160ms 페이드. 저절로 움직이는 것은 없다. prefers-reduced-motion이면 전환을 없앤다.

FORBIDDEN:
- 페이지 자체에 같은 둥근 상자의 카드와 그리드, 알약 모양, 칩, 배지, 글로우, 페이지 위 그라데이션 금지
- 제목 위의 작은 라벨, 자간을 넓힌 전체 대문자 라벨, 번호 섹션 표시 금지
- 디자인 원칙, 스타일 규칙, 팔레트에 관한 페이지 금지
- 스톡 사진, 일러스트, 떠다니는 추상 도형, 이모지, 링크 화살표, 가운뎃점 메타 문자열 금지
- 장식용 색: Team 열을 제외한 색 섹션 배경 금지

OUTPUT:
1) 위 토큰을 담은 CSS 사용자 정의 속성
2) 시맨틱 HTML: 편집기 창의 레이블이 붙은 영역, 속성 패널의 탭 목록, aria-pressed를 가진 토글 버튼, 요금제용 명시적 역할을 가진 표, 질문용 설명 목록, 레이블이 붙은 폼
3) 동작하는 속성 패널 탭, 해결과 다시 열기, 브레이크포인트 스위치, 결제 주기 토글, 복사, 오류와 성공 상태를 가진 가입 폼. 각 변경은 polite 라이브 영역으로 알린다
4) 320px까지 반응형 레이아웃, 가로 스크롤 없음, 휴대폰에서 모든 컨트롤의 높이 최소 44px
5) 모든 컨트롤에 보이는 포커스(2px 보라색 링), 모든 그림에 텍스트 대체 설명, reduced-motion 지원`;

const PROMPT_JA = `Product x Swiss スタイルで、実在するページを1枚デザインする。12列グリッドの白いページに、角張った罫線付きのセクションを置く。色は製品自身のインターフェース内（選択範囲、カーソル、コメントピン、カラースウォッチ）だけに使い、製品UIは証拠としてCSSで描く。

インターフェースが製品を説明する実在のソフトウェアを選び、その機能ページを書く。何をするのか、誰のためか、どう動くのか、料金を書く。ページはその製品のページとして読めなければならず、スタイル自体についてのページになってはならない。ここではウェブページ用のブラウザ編集ツールMarginとする。デザイナーは各ページをデスクトップ、タブレット、スマートフォンの幅で描き、チームは正確な要素にコメントし、開発者は同じファイルからサイズとCSSをコピーする。エディターで開いているファイルは、自転車修理店Linnet Cyclesのホームページである。

TOKENS:
--paper: #ffffff (ページ、ページ上のメニューの不透明な面)
--stage: #f4f4f6 (描いたページの背後のキャンバス、18pxごとに1pxのドット格子)
--panel: #fafafb (エディターのバーとサイドパネル)
--ink: #0d0d0e
--ink-2: #2b2c30 (本文テキスト)
--muted: #5d5f66
--line: #c2c4ca (罫線とエディターの枠)
--line-ui: #c8cad0 (エディター内の入力欄と仕切り線)
--violet: #6c5cff (選択、フォーカスリング、選んだフレーム)
--violet-ink: #3f31d6 (白地と --violet-wash 上の紫色の文字)
--violet-wash: #ecebff
--yellow: #ffd84d, --yellow-wash: #fff3bf (Team プランの列)
--blue: #73d7ff, --coral: #ff765f, --green: #78d88c, --lilac: #cbb7ff (ロゴ、描いたサイトのサービスカード、アバター、カーソル、顧客名の横の四角)
--coral-ink: #b0442f (レッドライン、CSSプロパティ名、コンポーネントのアイコン、フォームのエラー)
--green-ink: #2b7a41 (描いたサイトの「本日19:00まで営業」の行)

COLOUR:
- ページ自体は白地に墨色の文字である。色はエディターの面の中にだけ現れる: 描いたサイトのサービスカード4枚、選択の輪郭線とそのサイズタグ、名前付きのカーソル2つ、コメントピン、アバター、カラースウォッチ。
- エディターの外では、色は4マスのロゴ、各顧客名の横の小さな四角、そしてTeamプランの列の黄色い背景と列上端の4pxの黄色い罫線にだけ現れる。
- ボタンは墨色である。主な操作には塗りつぶした墨色のボタン、その他には1pxの墨色の輪郭線ボタンを使う。ホバー時、塗りのボタンは --ink-2 に濃くなり、輪郭線のボタンは --stage で塗られる。バーのリンクは --muted で、ホバー時に墨色になる。エラーは入力欄の下の --coral-ink のテキストで、入力欄の枠線も --coral-ink に変わる。
- コーラルとグリーンの上の文字は、それぞれの濃い色合い（#2a0d06、#12331c）とする。白い文字は墨色、紫色、解決済みピンの灰色（--muted）の上にだけ置く。影、定規の目盛り、ドットグリッドは、透明度を下げた墨色とする。他の色は使わず、グラデーションはドットグリッドと定規の目盛り以外には使わない。
- セクションの上端は1pxの墨色の罫線とする。セクション内の行は1pxの --line の罫線で区切る。

TYPOGRAPHY:
書体は1つ: Geologica（300〜800）をすべてのサイズで使う。幅が広く丸みのある文字が、やわらかな語り口を担う。
H1: 600、clamp(2.25rem, 4vw, 3.125rem)、行間 1.03、字間 -0.03em、デスクトップではリード文の横に2行で置く。
H2: 600、clamp(1.9rem, 3.4vw, 2.85rem)、行間 1.08、字間 -0.025em。
H3: 600、1.5rem（スマートフォンでは1.375rem）、行間 1.2、字間 -0.015em。
顧客の数値: 300、clamp(4rem, 7.4vw, 6.4rem)、行間 0.95、字間 -0.04em。単位は500、1.375rem。
プラン価格: 600、2.75rem、字間 -0.035em（スマートフォンでは1.75rem）。質問: 600、1.1875rem。
本文: 380、1.0625rem、行間 1.6。ヒーローのリード文は1rem。リスト、キャプション、概要情報、表のセルは1rem。価格の注記は0.875rem、スマートフォンの表のプラン名は0.8125rem。エディター内では同じ書体を0.8125remで使い、本文は450、名前は600とする。製品自身のUIフォントのように見せる。エディター内の描いたページは、テキスト代替を持つ絵なので、さらに小さくしてもよい。
CSSコード: システムの等幅フォントスタック（ui-monospace, SF Mono, Menlo, Consolas）、0.8125rem、行間 1.6。
数字は表組み用の等幅で揃える。字間を空けた全大文字のラベルは使わない。

LAYOUT:
- 12列グリッド、24pxのガターで、幅1120pxの列。
- 上部バー、1pxの罫線の上、高さ56px: 4マスのロゴ（コーラル、黄、青、グリーン）付きの製品名、ページ内リンク4つ、塗りつぶしの「無料で始める」ボタン1つ。
- ヒーロー: H1は8列にまたがり、リード文と塗りつぶしの「無料ファイルを始める」ボタンは最後の4列に置く。その後、編集ウィンドウを12列すべてにわたって置く。1280x800のノートPCでは、見出しと編集ウィンドウ全体が最初の画面に収まる。
- 編集ウィンドウ: 1pxの --line の枠線、16pxの角丸、柔らかい二重の影。40pxのバー（ロゴ、ファイルパス、「たった今保存済み」、アバター3つ、拡大率）、その後に3列: ページとレイヤーを入れた184pxのレール、定規と描いたホームページを、開いたコメントスレッドの横に置くステージ、デザインと検査のタブを持つ224pxのプロパティパネル。
- その後: 機能（3行。各行はテキストを4列に、その機能を担うエディターの部分を8列に置く。ステージ色の、ドットグリッド付き、14pxの角丸の面の上に）、顧客（1pxの罫線で分けた2列）、料金（表1つ）、質問（見出しは4列、回答は8列）、無料ファイルの登録、フッター。
- セクション同士は112px空ける（スマートフォンでは80px）。1200px未満では機能の行を縦に積み、760px未満ではすべてを1列にする。

COMPONENTS:
- エディターのウィンドウ: ステージには描いたホームページ（ナビ、「本日19:00まで営業」の行、見出し、テキスト、ボタン2つ、色付きのサービスカード4枚）が表示され、フルサービスのカードが選ばれて、1.5pxの紫色の輪郭線、4つの角のハンドル、紫色のサイズタグが付く。名前付きのカーソル2つ（コーラルのAlex、紫のMina）とコメントピンがキャンバスに置かれる。レールにはページとレイヤーが並び、選択中のレイヤーは --violet-wash で示す。スマートフォンでは描画がスマートフォン用レイアウトに切り替わり、インスペクターはステージの下へ移る。
- プロパティパネル: タブ2つ、デザインと検査（タブのパターン: roving tabindex、矢印キー、Home と End、ラベル付きのパネル1つ）。デザインは位置とサイズの入力欄、自動レイアウト、塗りを表示し、検査は同じレイヤーを開発者向けの値で表示する。
- コメントスレッド: レイヤー名と「解決」ボタンを持つ、白い12pxの角丸パネル。メッセージは丸いアバター、名前、時刻、本文で構成し、@メンションは --violet-wash 上に置く。「解決」を押すとメッセージは1行にまとめて畳まれ、ボタンは「再開」に変わる。キャンバスのピンは灰色になる。
- ブレークポイントの切り替え: トグルボタン3つのセグメントグループ（デスクトップ 1440、タブレット 768、スマートフォン 375、aria-pressed）。デスクトップでは3つのフレームが横に並び、選んだものには紫の輪郭線が付き、ほかは薄くなる。スマートフォンでは選んだフレームだけを描く。フレームの下の一文が、その幅で何が変わるかを説明する。
- 検査の図: 余白、間隔、幅、高さをコーラルのレッドラインで示したフルサービスのカードを、カードのCSSを入れた白いコードパネルと、「コピーしました」と表示される「コピー」ボタンの横に置く。
- 料金: Starter、Team、Business の列を持つ表が1つ。Team の列は黄色い背景の上に置く。年払い/月払いのトグル組は、すべての価格とその下の注記を切り替える。スマートフォンでは、表は役割情報を保ち、各行は機能名と、ラベル付きの3つの値に変わる。
- 無料ファイルの登録: メール欄1つ（48px、1pxの --muted の枠線、8pxの角丸）に表示されるラベルと、塗りつぶしのボタン。エラーは role="alert" を付けて入力欄の下に表示される。有効なアドレスが入力されると、フォームの代わりに確認画面が現れ、フォーカスを受けてアドレスを示す。
- ページのボタンは高さ44px（デスクトップの上部バーでは40px）、角丸8pxとする。編集面の中の小さなボタンは、デスクトップでは30〜38pxとする。スマートフォンでは、すべてのコントロールの高さを最低44pxにする。
- ページ自体のブロックは角が直角である。角丸は編集面（16pxのウィンドウ、14pxの機能ステージ、12pxのスレッドとコードパネル、9pxのセグメントスイッチ、6pxの入力欄と編集ボタン）と、ページのボタンと入力欄（8px）にだけ付ける。

MOTION:
- ホバー時は160msの色変化、別のブレークポイントのフレームを選ぶと160msのフェード。自動で動くものは何もない。prefers-reduced-motion の場合はトランジションをなくす。

FORBIDDEN:
- 同じ角丸の箱を並べたカードやグリッド、ピル型、チップ、バッジ、グロー、ページ上のグラデーション（ページ自体において）禁止
- 見出しの上の小さなラベル、字間を空けた全大文字のラベル、番号付きのセクションマーカー 禁止
- デザイン原則、スタイルのルール、パレットについてのページ 禁止
- ストック写真、イラスト、浮遊する抽象的な図形、絵文字、リンクの矢印、中点で区切ったメタ文字列 禁止
- 装飾としての色: Team の列を除き、色付きのセクション背景 禁止

OUTPUT:
1) 上のトークンのCSSカスタムプロパティ
2) セマンティックHTML: エディターのウィンドウにはラベル付きの領域、インスペクターにはタブリスト、aria-pressed付きのトグルボタン、料金には明示的な役割を持つ表、質問には説明リスト、ラベル付きのフォーム
3) 動作するインスペクターのタブ、解決と再開、ブレークポイントの切り替え、支払い周期のトグル、コピー、エラーと成功の状態を持つ登録。各変更は polite なライブリージョンで知らせる
4) 320pxまでのレスポンシブレイアウト、横スクロールなし、スマートフォンではすべてのコントロールの高さを最低44px
5) すべてのコントロールに見えるフォーカス（2pxの紫のリング）、すべての描画にテキスト代替、reduced-motion への対応`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_KO, ja: PROMPT_JA };

/** The four-square logo of Margin. */
function Logo() {
  return (
    <span className="mg-logo" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

function Cursor({ who, tone }: { who: string; tone: 'a' | 'm' }) {
  return (
    <span className={`mg-cursor mg-cursor--${tone}`} aria-hidden="true">
      <svg viewBox="0 0 20 20">
        <path d="M3 2 L17 9 L10 11 L8 17 Z" />
      </svg>
      <span>{who}</span>
    </span>
  );
}

function Selection({ size }: { size?: string }) {
  return (
    <span className="mg-sel" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      {size ? <em>{size}</em> : null}
    </span>
  );
}

interface ThreadProps {
  data: ThreadData;
  lang: Lang;
  resolved: boolean;
  onToggle: () => void;
  className?: string;
}

function Thread({ data, lang, resolved, onToggle, className }: ThreadProps) {
  const titleId = `mg-thread-${data.id}`;
  const count = data.messages.length;
  return (
    <div className={`mg-thread${resolved ? ' is-resolved' : ''}${className ? ` ${className}` : ''}`} role="group" aria-labelledby={titleId}>
      <div className="mg-thread__head">
        <p className="mg-thread__title" id={titleId}>{data.title[lang]}</p>
        <button type="button" className="mg-resolve" aria-describedby={titleId} onClick={onToggle}>
          {resolved ? THREAD.reopen[lang] : THREAD.resolve[lang]}
        </button>
      </div>
      {resolved ? (
        <p className="mg-thread__folded">{count === 1 ? THREAD.resolvedOne[lang] : fill(THREAD.resolvedMany[lang], { n: count })}</p>
      ) : (
        <ol className="mg-msgs">
          {data.messages.map((message) => {
            const [before, after] = message.text[lang].split('{mention}');
            return (
              <li key={message.time}>
                <span className={`mg-face mg-face--${message.initial.toLowerCase()}`} aria-hidden="true">{message.initial}</span>
                <div>
                  <p className="mg-msgs__who">
                    <b>{message.who[lang]}</b> <time dateTime={message.time}>{message.time}</time>
                  </p>
                  <p className="mg-msgs__text">
                    {before}
                    {message.mention ? <mark>{message.mention[lang]}</mark> : null}
                    {after}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

/** One of the three breakpoint frames, drawn small. It is a picture; the caption under the frames says what it shows. */
function Frame({ id, lang, on }: { id: FrameId; lang: Lang; on: boolean }) {
  const frame = FRAMES.find((item) => item.id === id) ?? FRAMES[0];
  const cards = id === 'phone' ? SERVICES.slice(0, 2) : SERVICES;
  return (
    <figure className={`mg-fr mg-fr--${id}${on ? ' is-on' : ''}`} aria-hidden="true">
      <figcaption>{frame.name[lang]} {frame.width}</figcaption>
      <div className="mg-fr__page">
        <div className="mg-fr__nav">
          <b>{id === 'phone' ? 'Linnet' : SHOP}</b>
          {id === 'desktop' ? (
            <>
              <span>{SITE.shop[lang]}</span>
              <span>{SITE.service[lang]}</span>
              <span>{SITE.visit[lang]}</span>
            </>
          ) : null}
          {id === 'tablet' ? <span>{SITE.service[lang]}</span> : null}
          {id !== 'desktop' ? <span className="mg-fr__menu" /> : null}
        </div>
        <div className="mg-fr__body">
          <div className="mg-fr__text">
            <span className="mg-fr__h">{SITE.title[lang]}</span>
            <span className="mg-fr__p">{id === 'phone' ? SITE.bodyShort[lang] : SITE.bodyMid[lang]}</span>
            <span className="mg-sb mg-sb--dark">{id === 'phone' ? SITE.bookShort[lang] : SITE.bookFrom[lang]}</span>
          </div>
          <div className="mg-cards">
            {cards.map((service) => (
              <span key={service.id} className={`mg-svc mg-svc--${service.id}`}>
                <b>{id === 'tablet' ? service.short[lang] : service.name[lang]}</b>
                {id === 'desktop' ? <small>{service.time[lang]}</small> : null}
                <span className="mg-svc__price">{service.price}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}

type TabId = 'design' | 'inspect';
const TABS: TabId[] = ['design', 'inspect'];
type EmailError = 'empty' | 'invalid' | null;

export function PortedFusionProductSwissPage({ lang }: PortedStylePageProps) {
  const [tab, setTab] = useState<TabId>('design');
  const [resolved, setResolved] = useState<Record<ThreadData['id'], boolean>>({ hero: false, feature: false });
  const [frame, setFrame] = useState<FrameId>('phone');
  const [yearly, setYearly] = useState(true);
  const [copy, setCopy] = useState<'idle' | 'copied' | 'failed'>('idle');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<EmailError>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [news, setNews] = useState('');
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ design: null, inspect: null });
  const emailRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLParagraphElement>(null);
  const wasSent = useRef(false);
  const copyTimer = useRef<number | undefined>(undefined);

  const t = (text: Tri) => text[lang];

  // A repeated message still reaches the live region: a trailing no-break space makes it new text.
  const announce = (message: string) => setNews((previous) => (previous === message ? `${message}\u00a0` : message));

  // The form and the confirmation replace each other. Focus goes to what took the place
  // of the control that had it: the confirmation, or the email field again.
  useEffect(() => {
    if (sentTo !== null) doneRef.current?.focus();
    else if (wasSent.current) emailRef.current?.focus();
    wasSent.current = sentTo !== null;
  }, [sentTo]);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = TABS.indexOf(tab);
    const target =
      event.key === 'ArrowRight' ? (index + 1) % TABS.length
      : event.key === 'ArrowLeft' ? (index - 1 + TABS.length) % TABS.length
      : event.key === 'Home' ? 0
      : event.key === 'End' ? TABS.length - 1
      : -1;
    if (target < 0) return;
    event.preventDefault();
    setTab(TABS[target]);
    tabRefs.current[TABS[target]]?.focus();
  };

  const toggleThread = (id: ThreadData['id']) => {
    const next = !resolved[id];
    setResolved({ ...resolved, [id]: next });
    announce(fill(t(next ? THREAD.resolvedNews : THREAD.reopenedNews), { title: t(THREADS[id].title) }));
  };

  const chooseFrame = (id: FrameId) => {
    if (id === frame) return;
    setFrame(id);
    announce(t((FRAMES.find((item) => item.id === id) ?? FRAMES[0]).news));
  };

  const chooseBilling = (nextYearly: boolean) => {
    if (nextYearly === yearly) return;
    setYearly(nextYearly);
    announce(t(nextYearly ? PRICING.yearlyNews : PRICING.monthlyNews));
  };

  const copyCss = () => {
    window.clearTimeout(copyTimer.current);
    const done = (ok: boolean) => {
      setCopy(ok ? 'copied' : 'failed');
      announce(t(ok ? FEATURES.copiedNews : FEATURES.copyFailedNews));
      copyTimer.current = window.setTimeout(() => setCopy('idle'), ok ? 2000 : 4000);
    };
    if (!navigator.clipboard) {
      done(false);
      return;
    }
    navigator.clipboard.writeText(CSS_TEXT).then(() => done(true), () => done(false));
  };

  const signUp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();
    const error: EmailError = value === '' ? 'empty' : EMAIL_PATTERN.test(value) ? null : 'invalid';
    if (!error) {
      setEmailError(null);
      setSentTo(value);
      return;
    }
    // The error renders first, so the field and its message can be brought into view together.
    flushSync(() => setEmailError(error));
    emailRef.current?.focus();
    emailRef.current?.parentElement?.scrollIntoView({ block: 'nearest' });
  };

  const priceOf = (plan: (typeof PLANS)[number]) => `$${yearly ? plan.yearly : plan.monthly}`;
  const noteOf = (plan: (typeof PLANS)[number]) => {
    if (plan.id === 'starter') return t(PRICING.noCard);
    return yearly ? fill(t(PRICING.billedMonthly), { price: `$${plan.monthly}` }) : fill(t(PRICING.billedYearly), { price: `$${plan.yearly}` });
  };

  const fullService = SERVICES[0];

  return (
    <FusionShell
      fusionId="fusion-product-swiss"
      lang={lang}
      tone="light"
      accent="#6c5cff"
      prev={{ href: '/pages/fusion-neon-swiss.html', label: 'Neon × Swiss' }}
      next={{ href: '/pages/fusion-bento-noir.html', label: 'Bento × Noir' }}
      prompts={PROMPTS}
    >
      <div className="mg">
        <header className="mg-bar">
          <p className="mg-brand">
            <Logo />
            <b>{BRAND}</b>
          </p>
          <nav className="mg-bar__nav" aria-label={t(BAR.nav)}>
            <a href="#mg-features">{t(BAR.features)}</a>
            <a href="#mg-customers">{t(BAR.customers)}</a>
            <a href="#mg-pricing">{t(BAR.pricing)}</a>
            <a href="#mg-questions">{t(BAR.questions)}</a>
          </nav>
          <a className="mg-btn mg-btn--dark mg-bar__start" href="#mg-start">{t(BAR.start)}</a>
        </header>

        <section className="mg-hero" aria-labelledby="mg-title">
          <div className="mg-hero__head">
            <h1 id="mg-title">{t(HERO.title)}</h1>
            <div className="mg-hero__side">
              <p className="mg-lede">{t(HERO.lede)}</p>
              <a className="mg-btn mg-btn--dark" href="#mg-start">{t(HERO.cta)}</a>
            </div>
          </div>

          <section className="mg-app" aria-label={t(APP.label)}>
            <div className="mg-app__bar">
              <div className="mg-app__file">
                <Logo />
                <span className="mg-app__name">
                  <b>{SHOP}</b>
                  <span className="mg-app__sep" aria-hidden="true">/</span>
                  <span className="mg-app__page">{t(APP.file)}</span>
                </span>
                <span className="mg-app__saved">{t(APP.saved)}</span>
              </div>
              <div className="mg-app__right">
                <span className="mg-faces" role="img" aria-label={t(APP.faces)}>
                  <span className="mg-face mg-face--m">M</span>
                  <span className="mg-face mg-face--a">A</span>
                  <span className="mg-face mg-face--j">J</span>
                </span>
                <span className="mg-zoom">100%</span>
              </div>
            </div>

            <div className="mg-app__body">
              <aside className="mg-rail" aria-label={t(APP.rail)}>
                <p className="mg-rail__page">
                  <span>{t(APP.page)}</span> <b>{t(APP.pageName)}</b>
                </p>
                <p className="mg-rail__h">{t(APP.layers)}</p>
                <ul className="mg-layers">
                  {LAYERS.map((layer) => (
                    <li key={layer.name.en} className={`mg-layers__d${layer.depth}${layer.on ? ' is-on' : ''}`} aria-current={layer.on ? 'true' : undefined}>
                      <span className={`mg-ic mg-ic--${layer.kind}`} aria-hidden="true">{layer.kind === 'text' ? 'T' : null}</span>
                      {t(layer.name)}
                    </li>
                  ))}
                </ul>
              </aside>

              <div className="mg-stage">
                <div className="mg-ruler" aria-hidden="true" />
                <p className="mg-sr">{t(APP.canvas)}</p>
                <div className="mg-stage__grid">
                  <div className="mg-board" aria-hidden="true">
                    <span className="mg-board__tag">
                      <span className="mg-board__tag-d">{t(APP.tagDesktop)}</span>
                      <span className="mg-board__tag-p">{t(APP.tagPhone)}</span>
                    </span>
                    <div className="mg-site">
                      <div className="mg-site__nav">
                        <b>{SHOP}</b>
                        <span>{t(SITE.shop)}</span>
                        <span>{t(SITE.service)}</span>
                        <span>{t(SITE.visit)}</span>
                        <em>{t(SITE.book)}</em>
                      </div>
                      <div className="mg-site__body">
                        <div className="mg-site__text">
                          <span className="mg-open"><i />{t(SITE.open)}</span>
                          <span className="mg-site__h">{t(SITE.title)}</span>
                          <span className="mg-site__p">{t(SITE.body)}</span>
                          <span className="mg-site__btns">
                            <span className="mg-sb mg-sb--dark">{t(SITE.bookService)}</span>
                            <span className="mg-sb">{t(SITE.hours)}</span>
                          </span>
                          <Cursor who="Mina" tone="m" />
                        </div>
                        <div className="mg-cards">
                          {SERVICES.map((service) => (
                            <span key={service.id} className={`mg-svc mg-svc--${service.id}`}>
                              <b>{t(service.name)}</b>
                              <small>{t(service.time)}</small>
                              <span className="mg-svc__price">{service.price}</span>
                              {service.id === 'full' ? (
                                <>
                                  <Selection size="240 × 168" />
                                  <Cursor who="Alex" tone="a" />
                                  <span className={`mg-pin mg-pin--card${resolved.hero ? ' is-resolved' : ''}`}>M</span>
                                </>
                              ) : null}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Thread data={THREADS.hero} lang={lang} resolved={resolved.hero} onToggle={() => toggleThread('hero')} className="mg-thread--hero" />
                </div>
              </div>

              <aside className="mg-insp" aria-label={t(APP.inspector)}>
                <div className="mg-tabs" role="tablist" aria-label={t(APP.inspector)}>
                  {TABS.map((id) => (
                    <button
                      key={id}
                      ref={(node) => {
                        tabRefs.current[id] = node;
                      }}
                      type="button"
                      role="tab"
                      id={`mg-tab-${id}`}
                      className="mg-tab"
                      aria-selected={tab === id}
                      aria-controls="mg-insp-panel"
                      tabIndex={tab === id ? 0 : -1}
                      onClick={() => setTab(id)}
                      onKeyDown={onTabKey}
                    >
                      {t(id === 'design' ? APP.design : APP.inspect)}
                    </button>
                  ))}
                </div>
                <div className="mg-insp__panel" role="tabpanel" id="mg-insp-panel" aria-labelledby={`mg-tab-${tab}`} tabIndex={0}>
                  {tab === 'design' ? (
                    <>
                      <div className="mg-insp__sec">
                        <p className="mg-insp__h">
                          <span className="mg-ic mg-ic--comp" aria-hidden="true" />
                          {t(fullService.name)}
                          <small>{t(APP.serviceCard)}</small>
                        </p>
                        <dl className="mg-fields">
                          <div><dt>X</dt><dd>812</dd></div>
                          <div><dt>Y</dt><dd>96</dd></div>
                          <div><dt>W</dt><dd>240</dd></div>
                          <div><dt>H</dt><dd>168</dd></div>
                        </dl>
                      </div>
                      <div className="mg-insp__sec">
                        <p className="mg-insp__h">
                          {t(APP.autoLayout)}
                          <small>{t(APP.vertical)}</small>
                        </p>
                        <dl className="mg-fields">
                          <div><dt>{t(APP.gap)}</dt><dd>8</dd></div>
                          <div><dt>{t(APP.padding)}</dt><dd>20</dd></div>
                        </dl>
                      </div>
                      <div className="mg-insp__sec">
                        <p className="mg-insp__h">{t(APP.fill)}</p>
                        <p className="mg-row">
                          <i className="mg-row__swatch" aria-hidden="true" />
                          {t(APP.fillName)}
                          <small>#CBB7FF</small>
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="mg-insp__sec mg-insp__sec--code">
                      <p className="mg-insp__h">
                        <span className="mg-ic mg-ic--comp" aria-hidden="true" />
                        {t(fullService.name)}
                        <small>240 × 168</small>
                      </p>
                      <dl className="mg-props">
                        <div><dt>{t(APP.padding)}</dt><dd>20px</dd></div>
                        <div><dt>{t(APP.gap)}</dt><dd>8px</dd></div>
                        <div><dt>{t(APP.radius)}</dt><dd>12px</dd></div>
                        <div><dt>{t(APP.background)}</dt><dd><i className="mg-row__swatch" aria-hidden="true" />#CBB7FF</dd></div>
                        <div><dt>{t(APP.titleText)}</dt><dd>{t(APP.textValue)}</dd></div>
                        <div><dt>{t(APP.priceText)}</dt><dd>{t(APP.priceValue)}</dd></div>
                      </dl>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </section>
        </section>

        <section className="mg-section" id="mg-features" aria-labelledby="mg-features-title">
          <div className="mg-head">
            <h2 id="mg-features-title">{t(FEATURES.title)}</h2>
            <p>{t(FEATURES.note)}</p>
          </div>

          <article className="mg-feature" aria-labelledby="mg-f1">
            <div className="mg-feature__text">
              <h3 id="mg-f1">{t(FEATURES.commentsTitle)}</h3>
              <p>{t(FEATURES.commentsBody)}</p>
              <ul>
                {FEATURES.commentsList.map((item) => <li key={item.en}>{t(item)}</li>)}
              </ul>
            </div>
            <div className="mg-ui mg-ui--thread">
              <div className="mg-crop" aria-hidden="true">
                <span className="mg-open"><i />{t(SITE.open)}</span>
                <span className="mg-crop__h">{t(SITE.title)}</span>
                <span className="mg-crop__btns">
                  <span className="mg-sb mg-sb--dark">
                    {t(SITE.bookFrom)}
                    <Selection />
                  </span>
                  <span className="mg-sb">{t(SITE.hours)}</span>
                </span>
                <span className={`mg-pin mg-pin--crop${resolved.feature ? ' is-resolved' : ''}`}>M</span>
              </div>
              <Thread data={THREADS.feature} lang={lang} resolved={resolved.feature} onToggle={() => toggleThread('feature')} className="mg-thread--feature" />
            </div>
          </article>

          <article className="mg-feature" aria-labelledby="mg-f2">
            <div className="mg-feature__text">
              <h3 id="mg-f2">{t(FEATURES.framesTitle)}</h3>
              <p>{t(FEATURES.framesBody)}</p>
              <ul>
                {FEATURES.framesList.map((item) => <li key={item.en}>{t(item)}</li>)}
              </ul>
            </div>
            <div className="mg-ui mg-ui--frames">
              <div className="mg-seg" role="group" aria-label={t(FEATURES.framesGroup)}>
                {FRAMES.map((item) => (
                  <button key={item.id} type="button" aria-pressed={frame === item.id} onClick={() => chooseFrame(item.id)}>
                    {t(item.name)}<span className="mg-seg__w"> {item.width}</span>
                  </button>
                ))}
              </div>
              <div className={`mg-frames is-${frame}`}>
                {FRAMES.map((item) => <Frame key={item.id} id={item.id} lang={lang} on={frame === item.id} />)}
              </div>
              <p className="mg-frames__caption">{t((FRAMES.find((item) => item.id === frame) ?? FRAMES[0]).caption)}</p>
            </div>
          </article>

          <article className="mg-feature" aria-labelledby="mg-f3">
            <div className="mg-feature__text">
              <h3 id="mg-f3">{t(FEATURES.inspectTitle)}</h3>
              <p>{t(FEATURES.inspectBody)}</p>
              <ul>
                {FEATURES.inspectList.map((item) => <li key={item.en}>{t(item)}</li>)}
              </ul>
            </div>
            <div className="mg-ui mg-ui--inspect">
              <div className="mg-measure" aria-hidden="true">
                <span className="mg-svc mg-svc--full mg-svc--big">
                  <b>{t(fullService.name)}</b>
                  <small>{t(fullService.time)}</small>
                  <span className="mg-svc__price">{fullService.price}</span>
                </span>
                <span className="mg-red mg-red--pad"><em>20</em></span>
                <span className="mg-red mg-red--gap"><em>8</em></span>
                <span className="mg-red mg-red--w"><em>240</em></span>
                <span className="mg-red mg-red--h"><em>168</em></span>
              </div>
              <div className="mg-code">
                <div className="mg-code__head">
                  <p id="mg-css-title">{t(FEATURES.cssTitle)}</p>
                  <button type="button" className="mg-copy" aria-label={copy === 'idle' ? t(FEATURES.copyLabel) : undefined} onClick={copyCss}>
                    {copy === 'copied' ? t(FEATURES.copied) : copy === 'failed' ? t(FEATURES.copyFailed) : t(FEATURES.copy)}
                  </button>
                </div>
                <pre aria-labelledby="mg-css-title"><code><span className="mg-code__c">{CSS_COMMENT}</span>{'\n.service-card {\n'}{CSS_RULES.map(([key, value]) => (
                  <span key={key}>{'  '}<span className="mg-code__k">{key}</span>: <span className="mg-code__v">{value}</span>;{'\n'}</span>
                ))}{'}'}</code></pre>
              </div>
            </div>
          </article>
        </section>

        <section className="mg-section" id="mg-customers" aria-labelledby="mg-customers-title">
          <div className="mg-head">
            <h2 id="mg-customers-title">{t(CUSTOMERS.title)}</h2>
            <p>{t(CUSTOMERS.note)}</p>
          </div>
          <div className="mg-cases">
            {CASES.map((item) => (
              <article key={item.name} className="mg-case" aria-labelledby={`mg-case-${item.swatch}`}>
                <div className="mg-case__org">
                  <i className={`mg-case__swatch mg-case__swatch--${item.swatch}`} aria-hidden="true" />
                  <h3 id={`mg-case-${item.swatch}`}>{item.name}</h3>
                </div>
                <p className="mg-case__who">{t(item.who)}</p>
                <p className="mg-case__fig">
                  <b>{item.figure}</b> <small>{t(item.unit)}</small>
                </p>
                <p className="mg-case__cap">{t(item.caption)}</p>
                <p className="mg-case__body">{t(item.body)}</p>
                <dl className="mg-case__facts">
                  {item.facts.map(([term, value]) => (
                    <div key={term.en}>
                      <dt>{t(term)}</dt>
                      <dd>{t(value)}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="mg-section" id="mg-pricing" aria-labelledby="mg-pricing-title">
          <div className="mg-head mg-head--price">
            <div className="mg-head__main">
              <h2 id="mg-pricing-title">{t(PRICING.title)}</h2>
              <p>{t(PRICING.note)}</p>
            </div>
            <div className="mg-seg mg-seg--bill" role="group" aria-label={t(PRICING.billing)}>
              <button type="button" aria-pressed={yearly} onClick={() => chooseBilling(true)}>{t(PRICING.yearly)}</button>
              <button type="button" aria-pressed={!yearly} onClick={() => chooseBilling(false)}>{t(PRICING.monthly)}</button>
            </div>
          </div>
          <table className="mg-table" role="table" aria-labelledby="mg-pricing-title" aria-describedby="mg-price-note">
            <colgroup>
              <col className="mg-table__label" />
              <col />
              <col className="is-team" />
              <col />
            </colgroup>
            <thead role="rowgroup">
              <tr role="row">
                <td role="cell" className="mg-table__corner">
                  <span className="mg-price-note" id="mg-price-note">{t(yearly ? PRICING.perYear : PRICING.perMonth)}</span>
                </td>
                {PLANS.map((plan) => (
                  <th key={plan.id} role="columnheader" scope="col" className={plan.id === 'team' ? 'is-team' : undefined}>
                    <span className="mg-plan">{plan.name}</span>
                    <span className="mg-price"><b>{priceOf(plan)}</b></span>
                    <span className="mg-price-note">{noteOf(plan)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody role="rowgroup">
              {PRICE_ROWS.map((row) => (
                <tr key={row.name.en} role="row">
                  <th role="rowheader" scope="row">{t(row.name)}</th>
                  {row.values.map((value, index) => (
                    <td
                      key={PLANS[index].id}
                      role="cell"
                      data-label={PLANS[index].name}
                      className={[PLANS[index].id === 'team' ? 'is-team' : '', value === null ? 'is-no' : ''].filter(Boolean).join(' ') || undefined}
                    >
                      {t(value ?? NO)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot role="rowgroup">
              <tr role="row">
                <td role="cell" className="mg-table__corner" />
                <td role="cell"><a className="mg-btn" href="#mg-start">{t(PRICING.startFree)}</a></td>
                <td role="cell" className="is-team"><a className="mg-btn mg-btn--dark" href="#mg-start">{t(PRICING.tryTeam)}</a></td>
                <td role="cell"><a className="mg-btn" href="mailto:sales@margin.example">{t(PRICING.sales)}</a></td>
              </tr>
            </tfoot>
          </table>
        </section>

        <section className="mg-section mg-faq" id="mg-questions" aria-labelledby="mg-questions-title">
          <h2 id="mg-questions-title">{t(QUESTIONS.title)}</h2>
          <dl>
            {QUESTIONS.items.map((item) => (
              <div key={item.q.en}>
                <dt>{t(item.q)}</dt>
                <dd>{t(item.a)}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mg-section" id="mg-start" aria-labelledby="mg-start-title">
          <div className="mg-start">
            <div className="mg-start__text">
              <h2 id="mg-start-title">{t(START.title)}</h2>
              <p>{t(START.note)}</p>
            </div>
            {sentTo !== null ? (
              <div className="mg-done">
                <p className="mg-done__title" ref={doneRef} tabIndex={-1}>{t(START.doneTitle)}</p>
                <p className="mg-done__body">{fill(t(START.doneBody), { email: sentTo })}</p>
                <button type="button" className="mg-btn" onClick={() => setSentTo(null)}>{t(START.again)}</button>
              </div>
            ) : (
              <form className="mg-form" noValidate onSubmit={signUp}>
                <div className={`mg-field${emailError ? ' is-invalid' : ''}`}>
                  <label htmlFor="mg-email">{t(START.email)}</label>
                  <input
                    id="mg-email"
                    ref={emailRef}
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    value={email}
                    aria-invalid={emailError ? true : undefined}
                    aria-describedby={emailError ? 'mg-email-error' : undefined}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (emailError) setEmailError(null);
                    }}
                  />
                  {emailError ? <p className="mg-field__error" id="mg-email-error" role="alert">{t(emailError === 'empty' ? START.empty : START.invalid)}</p> : null}
                </div>
                <button type="submit" className="mg-btn mg-btn--dark">{t(START.submit)}</button>
              </form>
            )}
          </div>
        </section>

        <footer className="mg-foot">
          <p className="mg-brand mg-brand--foot">
            <Logo />
            <b>{BRAND}</b>
          </p>
          <nav aria-label={t(FOOT.nav)}>
            <a href="#mg-features">{t(BAR.features)}</a>
            <a href="#mg-customers">{t(BAR.customers)}</a>
            <a href="#mg-pricing">{t(BAR.pricing)}</a>
            <a href="#mg-questions">{t(BAR.questions)}</a>
          </nav>
          <p className="mg-foot__company">{t(FOOT.company)}</p>
        </footer>

        <p className="mg-sr" role="status">{news}</p>
      </div>
    </FusionShell>
  );
}
