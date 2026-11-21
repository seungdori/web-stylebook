import { Fragment, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedKineticPopPage.css';

// The page of the Fizz Lab pop-up, a soda brewery's two-week tasting bar on Calvert Avenue
// in Shoreditch, in the Kinetic Pop style. Bowlby One shouts (the hero words, pour numbers,
// dates, prices, counts) and Work Sans reads. Components come from the pop-up itself: the
// hero card with a starburst for the free tasting, a flavour ticker, a tasting flight of six
// die-cut shapes in pour order, a two-week opening strip with a speech bubble for the chosen
// day, a crate of twelve to fill, a merch price list with round price stickers and sold-out
// stamps, a pick-up list, and a street map drawn in thick lines.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key]));

const ADDRESS = '22 Calvert Avenue';
const POSTCODE = 'London E2 7JP';
const CRATE_SIZE = 12;
const CRATE_PRICE = 26;
const MAPS_URL = 'https://www.openstreetmap.org/search?query=22%20Calvert%20Avenue%2C%20London%20E2%207JP';

type Shape = 'diamond' | 'circle' | 'triangle' | 'square' | 'arch' | 'star';

const STAR = '50.0,5.0 62.9,35.2 95.7,38.2 70.9,59.8 78.2,91.8 50.0,75.0 21.8,91.8 29.1,59.8 4.3,38.2 37.1,35.2';
const BURST =
  '50.0,2.0 58.7,12.0 70.8,6.8 74.3,19.5 87.5,20.1 85.1,33.1 96.8,39.3 89.0,50.0 96.8,60.7 85.1,66.9 87.5,79.9 74.3,80.5 70.8,93.2 58.7,88.0 50.0,98.0 41.3,88.0 29.2,93.2 25.7,80.5 12.5,79.9 14.9,66.9 3.2,60.7 11.0,50.0 3.2,39.3 14.9,33.1 12.5,20.1 25.7,19.5 29.2,6.8 41.3,12.0';

// One die-cut shape on a 100 x 100 box.
function ShapePath({ shape }: { shape: Shape }) {
  switch (shape) {
    case 'diamond':
      return <polygon points="50,3 97,50 50,97 3,50" />;
    case 'circle':
      return <circle cx="50" cy="50" r="47" />;
    case 'triangle':
      return <polygon points="50,5 97,93 3,93" />;
    case 'square':
      return <rect x="4" y="4" width="92" height="92" rx="9" />;
    case 'arch':
      return <path d="M7,96 V48 A43,43 0 0 1 93,48 V96 Z" />;
    case 'star':
      return <polygon points={STAR} />;
  }
}

const HEAD = {
  nav: { en: 'Pop-up', ko: '팝업', ja: 'ポップアップ' },
  flavours: { en: 'Flavours', ko: '맛', ja: 'フレーバー' },
  dates: { en: 'Dates', ko: '날짜', ja: '営業日' },
  crates: { en: 'Crates', ko: '상자', ja: 'ケース' },
  merch: { en: 'Merch', ko: '굿즈', ja: 'グッズ' },
  go: { en: 'Getting there', ko: '오시는 길', ja: 'アクセス' },
  pickUp: { en: 'Pick-up', ko: '픽업', ja: 'お受け取り' },
  listWord: { en: 'list', ko: '목록', ja: 'リスト' },
} satisfies Record<string, Tri>;

const HERO = {
  words: [
    { en: 'Fizz', ko: 'Fizz', ja: 'Fizz' },
    { en: 'Lab', ko: 'Lab', ja: 'Lab' },
    { en: 'Pop-up', ko: '팝업', ja: 'ポップアップ' },
  ] as Tri[],
  when: { en: '13–26 Nov', ko: '11월 13–26일', ja: '11月13–26日' },
  whenSpoken: { en: '13 to 26 November', ko: '11월 13일부터 26일까지', ja: '11月13日から26日まで' },
  lede: {
    en: 'Six sodas from our Hackney Wick brewery, poured free at a bar on Calvert Avenue for two weeks. Walk in, taste all six, and carry a crate home.',
    ko: 'Hackney Wick 양조장에서 만든 탄산음료 여섯 종을 2주 동안 Calvert Avenue 바에서 무료로 따릅니다. 들어와서 여섯 가지를 모두 맛보고, 상자 하나를 집에 가져가세요.',
    ja: 'Hackney Wick の醸造所で作るソーダ6種を、2週間 Calvert Avenue のバーで無料で注ぎます。立ち寄って6種すべてを試し、ケースをひとつ持ち帰ってください。',
  },
  directions: { en: 'Get directions', ko: '길찾기', ja: '道順を見る' },
  where: { en: '22 Calvert Avenue, Shoreditch', ko: '22 Calvert Avenue, Shoreditch', ja: '22 Calvert Avenue, Shoreditch' },
  open: { en: 'Open today until 23:00', ko: '오늘 23:00까지 영업', ja: '本日23:00まで営業' },
  free: { en: 'Free', ko: '무료', ja: '無料' },
  tasting: { en: 'tasting', ko: '시음', ja: '試飲' },
  pours: { en: 'Six pours, no ticket needed', ko: '여섯 잔, 입장권 없이', ja: '6杯、チケット不要' },
} as const;

const TICKER = {
  free: { en: 'Free tasting', ko: '무료 시음', ja: '無料試飲' },
  pause: { en: 'Pause', ko: '일시정지', ja: '一時停止' },
  play: { en: 'Play', ko: '재생', ja: '再生' },
  what: { en: 'the flavour ticker', ko: '맛 목록', ja: 'フレーバー一覧' },
} satisfies Record<string, Tri>;

type FlavourId = 'mint' | 'yuzu' | 'grapefruit' | 'blue' | 'rhubarb' | 'cola';

interface Flavour {
  id: FlavourId;
  name: string;
  text: Tri;
  sugar: string;
  fizz: number;
  /** The shape's fill, a page colour. */
  fill: string;
  /** The colour of the pour number drawn on it. */
  numberColor: string;
  shape: Shape;
  size: number;
  rotate: number;
  /** Lowers the number into the body of a shape whose weight sits low. */
  numberDrop: string;
}

const FLAVOURS: Flavour[] = [
  {
    id: 'mint',
    name: 'Glacier Mint',
    text: {
      en: 'Spearmint and cucumber water, barely sweet. Poured at 2 °C, so it tastes colder than the rest.',
      ko: '스피어민트와 오이 워터, 단맛은 거의 없습니다. 2 °C로 따라서 다른 음료보다 차갑게 느껴집니다.',
      ja: 'スペアミントとキュウリの水、ほとんど甘くありません。2 °Cで注ぐので、ほかより冷たく感じます。',
    },
    sugar: '2.4',
    fizz: 3,
    fill: 'var(--fz-sky)',
    numberColor: '#ffffff',
    shape: 'diamond',
    size: 150,
    rotate: 4,
    numberDrop: '0%',
  },
  {
    id: 'yuzu',
    name: 'Yuzu Sherbet',
    text: {
      en: 'Yuzu peel and lemon sherbet. Sharp on the first sip, then very dry, with a fizz that prickles.',
      ko: '유자 껍질과 레몬 셔벗. 첫 모금은 새콤하고, 이후에는 아주 드라이하며 톡 쏘는 탄산이 있습니다.',
      ja: 'ゆずの皮とレモンシャーベット。最初の一口は酸味が立ち、その後はとてもドライで、ぴりっとした炭酸が続きます。',
    },
    sugar: '3.2',
    fizz: 4,
    fill: 'var(--fz-yellow)',
    numberColor: '#ffffff',
    shape: 'circle',
    size: 136,
    rotate: -6,
    numberDrop: '0%',
  },
  {
    id: 'grapefruit',
    name: 'Grapefruit & Sea Salt',
    text: {
      en: 'Pink grapefruit with the bitter pith left in and a pinch of Essex sea salt. The most bubbles of the six.',
      ko: '속껍질의 쌉싸름함을 살리고 Essex산 바다 소금을 한 꼬집 넣은 핑크 자몽. 여섯 가지 중 기포가 가장 많습니다.',
      ja: '苦味のある白い皮を残し、エセックス産の海塩をひとつまみ加えたピンクグレープフルーツ。6種のなかで最も泡が多いです。',
    },
    sugar: '4.1',
    fizz: 5,
    fill: 'var(--fz-pink)',
    numberColor: '#ffffff',
    shape: 'triangle',
    size: 160,
    rotate: 7,
    numberDrop: '16%',
  },
  {
    id: 'blue',
    name: 'Blue Hour',
    text: {
      en: 'Butterfly pea flower and lime. It pours blue and turns violet when the bar squeezes in the lime.',
      ko: '버터플라이 피 꽃과 라임. 파란색으로 따르고, 바에서 라임을 짜 넣으면 보라색으로 변합니다.',
      ja: 'バタフライピーの花とライム。青色で注がれ、バーでライムを搾ると紫色に変わります。',
    },
    sugar: '4.6',
    fizz: 3,
    fill: 'var(--fz-blue)',
    numberColor: '#ffffff',
    shape: 'square',
    size: 140,
    rotate: -4,
    numberDrop: '0%',
  },
  {
    id: 'rhubarb',
    name: 'Rhubarb Custard',
    text: {
      en: 'Yorkshire forced rhubarb with vanilla. Soft bubbles and a creamy finish, like the boiled sweet.',
      ko: 'Yorkshire산 포스드 루바브와 바닐라. 기포는 부드럽고 마무리는 크림처럼 진하며, 보일드 스위트 같은 맛입니다.',
      ja: 'Yorkshire産フォースド・ルバーブとバニラ。泡はやわらかく、後味はクリーミーで、ボイルドスイーツのような味わいです。',
    },
    sugar: '5.9',
    fizz: 2,
    fill: 'var(--fz-blush)',
    numberColor: '#ffffff',
    shape: 'arch',
    size: 146,
    rotate: 5,
    numberDrop: '10%',
  },
  {
    id: 'cola',
    name: 'Cherry Cola',
    text: {
      en: 'Black cherry, cassia and vanilla over a proper cola bite. The only one with caffeine: 18 mg a can.',
      ko: '블랙 체리, 카시아, 바닐라에 제대로 된 콜라의 쏘는 맛을 더했습니다. 여섯 가지 중 카페인이 든 유일한 제품이며, 캔 하나에 18 mg입니다.',
      ja: 'ブラックチェリー、カシア、バニラに本格的なコーラの刺激を重ねました。6種のなかで唯一カフェインを含み、1缶あたり18 mgです。',
    },
    sugar: '6.4',
    fizz: 4,
    fill: 'var(--fz-ink)',
    numberColor: 'var(--fz-yellow)',
    shape: 'star',
    size: 164,
    rotate: -8,
    numberDrop: '7%',
  },
];

const FLIGHT = {
  title: { en: 'Six flavours, {mark} to taste', ko: '여섯 가지 맛, {mark}로 맛보세요', ja: 'フレーバー6種を{mark}で試飲' },
  mark: { en: 'free', ko: '무료', ja: '無料' },
  note: {
    en: 'Ask at the bar for a flight: six 60 ml pours, driest first. Cans are £2.50 each to take away, or £26 for a crate of twelve.',
    ko: '바에서 시음 세트를 주문하세요. 60 ml씩 여섯 잔이며, 가장 드라이한 맛부터 나옵니다. 캔은 가져갈 때 한 개 £2.50, 12개들이 상자는 £26입니다.',
    ja: 'バーでテイスティングセットを頼めます。60 mlずつ6杯、ドライな順に出します。缶は持ち帰りで1本£2.50、12本入りケースは£26です。',
  },
  sugar: { en: 'Sugar', ko: '당류', ja: '糖分' },
  sugarValue: { en: '{n} g per 100 ml', ko: '100 ml당 {n} g', ja: '100 mlあたり {n} g' },
  fizz: { en: 'Fizz', ko: '탄산', ja: '炭酸' },
  fizzValue: { en: '{n} of 5', ko: '5점 만점에 {n}점', ja: '5段階の{n}' },
} satisfies Record<string, Tri>;

// Puts one node into a sentence in place of {key}.
const place = (text: string, key: string, node: ReactNode): ReactNode[] =>
  text.split(`{${key}}`).flatMap((part, index) => (index === 0 ? [part] : [<Fragment key={index}>{node}</Fragment>, part]));

type DayKind = 'week' | 'late' | 'sun' | 'shut';

interface Day {
  date: string;
  n: number;
  short: Tri;
  long: Tri;
  kind: DayKind;
  open?: string;
  close?: string;
  /** Something on that night; the bar stays open later. */
  star?: Tri;
  past?: boolean;
  today?: boolean;
  events: Array<{ time: string; text: Tri }>;
}

const WD = {
  fri: { short: { en: 'Fri', ko: '금', ja: '金' }, long: { en: 'Friday', ko: '금요일', ja: '金曜日' } },
  sat: { short: { en: 'Sat', ko: '토', ja: '土' }, long: { en: 'Saturday', ko: '토요일', ja: '土曜日' } },
  sun: { short: { en: 'Sun', ko: '일', ja: '日' }, long: { en: 'Sunday', ko: '일요일', ja: '日曜日' } },
  mon: { short: { en: 'Mon', ko: '월', ja: '月' }, long: { en: 'Monday', ko: '월요일', ja: '月曜日' } },
  tue: { short: { en: 'Tue', ko: '화', ja: '火' }, long: { en: 'Tuesday', ko: '화요일', ja: '火曜日' } },
  wed: { short: { en: 'Wed', ko: '수', ja: '水' }, long: { en: 'Wednesday', ko: '수요일', ja: '水曜日' } },
  thu: { short: { en: 'Thu', ko: '목', ja: '木' }, long: { en: 'Thursday', ko: '목요일', ja: '木曜日' } },
};

const OPENS = { en: 'Tasting bar opens.', ko: '시음 바가 문을 엽니다.', ja: '試飲バーがオープンします。' };
const POUR_YOUR_OWN = {
  en: 'Pour your own: children mix a soda from three syrups, free.',
  ko: '직접 따르기: 어린이는 시럽 세 가지로 탄산음료를 직접 섞어 무료로 만들 수 있습니다.',
  ja: 'セルフで注ぐ: 子どもは3種のシロップから自分でソーダを作れ、無料です。',
};
const AFTER_WORK = { en: 'After-work flight with salted crisps, £3.', ko: '퇴근 후 시음 세트와 소금 간 감자칩, £3.', ja: '仕事帰りのテイスティングセットと塩味のポテトチップス、£3。' };
const SYRUP_LAB = {
  en: 'Syrup lab with our brewer Dami Okafor: why Blue Hour turns violet.',
  ko: '시럽 실험실, 양조 담당 Dami Okafor와 함께: Blue Hour가 보라색으로 변하는 이유.',
  ja: 'シロップ実験室、醸造担当の Dami Okafor と: Blue Hour が紫色に変わる理由。',
};

const DAYS: Day[] = [
  {
    date: '2026-11-13', n: 13, ...WD.fri, kind: 'late', open: '11:00', close: '23:00', past: true,
    star: { en: 'opening night', ko: '오프닝 나이트', ja: 'オープニングナイト' },
    events: [
      { time: '11:00', text: { en: 'Doors open for the first pour.', ko: '첫 잔을 따르며 문을 엽니다.', ja: '最初の一杯とともにオープンします。' } },
      {
        time: '18:00',
        text: {
          en: 'Opening night: our brewers pour all six and say how each is made.',
          ko: '오프닝 나이트: 양조 담당자가 여섯 가지를 모두 따르며 각각 어떻게 만들었는지 설명합니다.',
          ja: 'オープニングナイト: 醸造担当が6種すべてを注ぎ、それぞれの作り方を説明します。',
        },
      },
      { time: '21:00', text: { en: 'Records from Sol Ferreira until close.', ko: 'Sol Ferreira의 레코드를 마감까지 틉니다.', ja: 'Sol Ferreira のレコードを閉店まで流します。' } },
    ],
  },
  {
    date: '2026-11-14', n: 14, ...WD.sat, kind: 'late', open: '11:00', close: '22:00', past: true,
    events: [
      { time: '11:00', text: OPENS },
      {
        time: '14:00',
        text: {
          en: 'The risograph poster is printed in the window, one colour an hour.',
          ko: '리소그래프 포스터를 창가에서 한 시간마다 한 가지 색씩 인쇄합니다.',
          ja: 'リソグラフのポスターを窓際で、1時間ごとに1色ずつ刷ります。',
        },
      },
    ],
  },
  { date: '2026-11-15', n: 15, ...WD.sun, kind: 'sun', open: '11:00', close: '18:00', past: true, events: [{ time: '11:00', text: OPENS }, { time: '13:00', text: POUR_YOUR_OWN }] },
  { date: '2026-11-16', n: 16, ...WD.mon, kind: 'shut', past: true, events: [] },
  { date: '2026-11-17', n: 17, ...WD.tue, kind: 'week', open: '12:00', close: '20:00', past: true, events: [{ time: '12:00', text: OPENS }, { time: '17:30', text: AFTER_WORK }] },
  { date: '2026-11-18', n: 18, ...WD.wed, kind: 'week', open: '12:00', close: '20:00', past: true, events: [{ time: '12:00', text: OPENS }, { time: '18:00', text: SYRUP_LAB }] },
  {
    date: '2026-11-19', n: 19, ...WD.thu, kind: 'week', open: '12:00', close: '20:00', past: true,
    events: [
      { time: '12:00', text: OPENS },
      { time: '19:00', text: { en: 'Quiz at the bar. The winning table takes a crate home.', ko: '바에서 퀴즈를 합니다. 우승 테이블은 상자 하나를 가져갑니다.', ja: 'バーでクイズ大会。優勝したテーブルはケースを持ち帰れます。' } },
    ],
  },
  {
    date: '2026-11-20', n: 20, ...WD.fri, kind: 'late', open: '11:00', close: '22:00', past: true,
    events: [
      { time: '11:00', text: OPENS },
      { time: '18:00', text: { en: 'The printers sign the risograph posters.', ko: '인쇄소가 리소그래프 포스터에 서명합니다.', ja: '印刷所がリソグラフのポスターに署名します。' } },
    ],
  },
  {
    date: '2026-11-21', n: 21, ...WD.sat, kind: 'late', open: '11:00', close: '23:00', today: true,
    star: { en: 'float night', ko: '플로트 나이트', ja: 'フロートナイト' },
    events: [
      { time: '11:00', text: { en: 'Tasting bar opens. Quietest before 14:00.', ko: '시음 바가 문을 엽니다. 14:00 이전이 가장 한산합니다.', ja: '試飲バーがオープンします。14:00までが最も空いています。' } },
      {
        time: '18:00',
        text: {
          en: 'Float night: Cherry Cola over soft serve from Lick, £4.50.',
          ko: '플로트 나이트: Lick의 소프트 아이스크림을 올린 체리 콜라, £4.50.',
          ja: 'フロートナイト: Lick のソフトクリームをのせたチェリーコーラ、£4.50。',
        },
      },
      { time: '20:00', text: { en: 'Records from Anna Kiyoshi until close.', ko: 'Anna Kiyoshi의 레코드를 마감까지 틉니다.', ja: 'Anna Kiyoshi のレコードを閉店まで流します。' } },
    ],
  },
  { date: '2026-11-22', n: 22, ...WD.sun, kind: 'sun', open: '11:00', close: '18:00', events: [{ time: '11:00', text: OPENS }, { time: '13:00', text: POUR_YOUR_OWN }] },
  { date: '2026-11-23', n: 23, ...WD.mon, kind: 'shut', events: [] },
  {
    date: '2026-11-24', n: 24, ...WD.tue, kind: 'week', open: '12:00', close: '20:00',
    events: [
      { time: '12:00', text: { en: 'Tasting bar opens. Forty more bucket hats are in.', ko: '시음 바가 문을 엽니다. 버킷햇 40개가 추가로 입고됩니다.', ja: '試飲バーがオープンします。バケットハットが40点追加入荷します。' } },
      { time: '17:30', text: AFTER_WORK },
    ],
  },
  { date: '2026-11-25', n: 25, ...WD.wed, kind: 'week', open: '12:00', close: '20:00', events: [{ time: '12:00', text: OPENS }, { time: '18:00', text: SYRUP_LAB }] },
  {
    date: '2026-11-26', n: 26, ...WD.thu, kind: 'week', open: '12:00', close: '21:00',
    star: { en: 'last day', ko: '마지막 날', ja: '最終日' },
    events: [
      { time: '12:00', text: { en: 'Tasting bar opens for the last time.', ko: '시음 바가 마지막으로 문을 엽니다.', ja: '試飲バーが最後の営業日を迎えます。' } },
      {
        time: '18:00',
        text: {
          en: 'Last night: every can left is £1.50 until we close at 21:00.',
          ko: '마지막 밤: 21:00 마감까지 남은 캔은 모두 £1.50입니다.',
          ja: '最終日の夜: 21:00の閉店まで、残りの缶はすべて£1.50です。',
        },
      },
    ],
  },
];

const TODAY = DAYS.findIndex((day) => day.today);

const DATES = {
  title: { en: 'Open until Thursday 26 November', ko: '11월 26일 목요일까지 엽니다', ja: '11月26日(木)まで営業' },
  note: {
    en: 'Free tasting all day, every day we are open. Fridays and Saturdays stay open late, and on Mondays we close to restock. Choose a day to see its hours and what is on.',
    ko: '영업하는 날에는 하루 종일 무료로 시음하실 수 있습니다. 금요일과 토요일은 늦게까지 열고, 월요일에는 재고를 채우기 위해 문을 닫습니다. 날짜를 선택하면 영업시간과 행사를 확인할 수 있습니다.',
    ja: '営業日は終日いつでも無料で試飲できます。金曜と土曜は遅くまで営業し、月曜は仕入れのため休業します。日付を選ぶと、営業時間と催しをご確認いただけます。',
  },
  legend: { en: 'Opening days, 13 to 26 November', ko: '영업일, 11월 13일–26일', ja: '営業日、11月13日–26日' },
  today: { en: 'Today', ko: '오늘', ja: '本日' },
  month: { en: 'November', ko: '11월', ja: '11月' },
  closed: { en: 'Closed', ko: '휴무', ja: '休業' },
  dayTitle: { en: '{day} {n} November', ko: '11월 {n}일 {day}', ja: '11月{n}日 {day}' },
  hoursToday: { en: 'Today, {open} to {close}', ko: '오늘 {open}–{close}', ja: '本日 {open}–{close}' },
  hoursPast: { en: 'Was open {open} to {close}', ko: '{open}–{close}에 영업했습니다', ja: '{open}–{close}に営業していました' },
  hoursNext: { en: 'Open {open} to {close}', ko: '{open}–{close} 영업', ja: '{open}–{close} 営業' },
  shutNote: {
    en: 'We close on Mondays to restock the fridges and wash the glasses. Back on Tuesday at 12:00.',
    ko: '재고를 채우고 잔을 씻기 위해 월요일에는 문을 닫습니다. 화요일 12:00에 다시 엽니다.',
    ja: '冷蔵庫の補充とグラスの洗浄のため、月曜は休業します。火曜12:00に再開します。',
  },
  keyLabel: { en: 'Opening hours', ko: '영업시간', ja: '営業時間' },
} satisfies Record<string, Tri>;

const KEY: Array<{ swatch: 'week' | 'late' | 'sun' | 'shut' | 'star'; name: Tri; hours: Tri }> = [
  { swatch: 'week', name: { en: 'Tuesday to Thursday', ko: '화요일부터 목요일', ja: '火曜日から木曜日' }, hours: { en: '12:00–20:00', ko: '12:00–20:00', ja: '12:00–20:00' } },
  { swatch: 'late', name: { en: 'Friday and Saturday', ko: '금요일과 토요일', ja: '金曜日と土曜日' }, hours: { en: '11:00–22:00', ko: '11:00–22:00', ja: '11:00–22:00' } },
  { swatch: 'sun', name: { en: 'Sunday', ko: '일요일', ja: '日曜日' }, hours: { en: '11:00–18:00', ko: '11:00–18:00', ja: '11:00–18:00' } },
  { swatch: 'shut', name: { en: 'Monday', ko: '월요일', ja: '月曜日' }, hours: { en: 'Closed', ko: '휴무', ja: '休業' } },
  { swatch: 'star', name: { en: 'Something on that night', ko: '그날 밤 행사 있음', ja: 'その夜は催しあり' }, hours: { en: 'Open later', ko: '늦게까지 영업', ja: '遅くまで営業' } },
];

const CRATE = {
  title: { en: 'Fill a {mark} of twelve', ko: '12개들이 {mark}를 채우세요', ja: '12本入り{mark}を詰めよう' },
  mark: { en: 'crate', ko: '상자', ja: 'ケース' },
  note: {
    en: 'Any mix of the six, twelve cans for £26. Put it aside here and pay at the till when you pick it up. We keep it behind the bar for two days.',
    ko: '여섯 가지 중 어떤 조합이든 캔 12개를 £26에 드립니다. 여기서 담아 두고, 찾아갈 때 계산대에서 결제하세요. 이틀 동안 바 뒤에 보관합니다.',
    ja: '6種のどの組み合わせでも、缶12本を£26でお渡しします。ここで取り置きし、受け取り時にレジでお支払いください。2日間バーの裏で保管します。',
  },
  picture: { en: 'A crate with {n} of 12 cans', ko: '캔 12개 중 {n}개가 든 상자', ja: '缶12本のうち{n}本入りのケース' },
  of: { en: 'of 12', ko: '/ 12', ja: '/ 12' },
  cans: { en: 'cans in the crate', ko: '캔 담김', ja: '本' },
  more: { en: 'Pick {n} more to fill it.', ko: '{n}개 더 골라 채우세요.', ja: 'あと{n}本選ぶと埋まります。' },
  full: { en: 'Full. Twelve cans for £26.', ko: '가득 찼습니다. 캔 12개에 £26.', ja: '満杯です。缶12本で£26。' },
  less: { en: 'One fewer {name}', ko: '{name} 한 개 줄이기', ja: '{name}を1本減らす' },
  plus: { en: 'One more {name}', ko: '{name} 한 개 더하기', ja: '{name}を1本追加' },
  flavours: { en: 'Cans by flavour', ko: '맛별 캔', ja: 'フレーバー別の缶' },
  twoEach: { en: 'Two of each', ko: '각 2개씩', ja: '各2本ずつ' },
  empty: { en: 'Empty the crate', ko: '상자 비우기', ja: 'ケースを空にする' },
  put: { en: 'Put the crate aside', ko: '상자 담아 두기', ja: 'ケースを取り置き' },
  newsCount: { en: '{name} {n}. {total} of 12 cans.', ko: '{name} {n}개. 캔 12개 중 {total}개.', ja: '{name} {n}本。缶12本中{total}本。' },
  newsFull: { en: '{name} {n}. The crate is full.', ko: '{name} {n}개. 상자가 가득 찼습니다.', ja: '{name} {n}本。ケースがいっぱいです。' },
  newsBlocked: {
    en: 'The crate is full. Take a can out to swap it for another.',
    ko: '상자가 가득 찼습니다. 캔을 하나 빼면 다른 캔으로 바꿀 수 있습니다.',
    ja: 'ケースがいっぱいです。缶を1本取り出せば、別の缶と入れ替えられます。',
  },
  newsNone: { en: 'There is no {name} in the crate.', ko: '상자에 {name} 캔이 없습니다.', ja: 'ケースに{name}の缶はありません。' },
  newsTwoEach: { en: 'Two of each flavour. The crate is full.', ko: '맛마다 2개씩. 상자가 가득 찼습니다.', ja: '各フレーバー2本ずつ。ケースがいっぱいです。' },
  newsEmpty: { en: 'The crate is empty.', ko: '상자를 비웠습니다.', ja: 'ケースを空にしました。' },
  newsNotFull: { en: 'Pick {n} more cans before you put the crate aside.', ko: '상자를 담아 두기 전에 캔을 {n}개 더 고르세요.', ja: 'ケースを取り置きする前に、あと{n}本選んでください。' },
  doneTitle: { en: 'Crate {no} is behind the till', ko: '상자 {no}번은 계산대 뒤에 있습니다', ja: 'ケース{no}番はレジ奥にあります' },
  doneNote: {
    en: 'Give the bar the number and pay £26 when you collect it. We keep it for two days.',
    ko: '바에 번호를 알려 주고, 찾아갈 때 £26을 결제하세요. 이틀 동안 보관합니다.',
    ja: 'バーで番号をお伝えのうえ、受け取り時に£26をお支払いください。2日間保管します。',
  },
  another: { en: 'Fill another crate', ko: '상자 하나 더 채우기', ja: 'ケースをもう1つ詰める' },
} satisfies Record<string, Tri>;

type Counts = Record<FlavourId, number>;

const EMPTY: Counts = { mint: 0, yuzu: 0, grapefruit: 0, blue: 0, rhubarb: 0, cola: 0 };
const TWO_EACH: Counts = { mint: 2, yuzu: 2, grapefruit: 2, blue: 2, rhubarb: 2, cola: 2 };
const START: Counts = { mint: 2, yuzu: 2, grapefruit: 1, blue: 2, rhubarb: 0, cola: 1 };

const totalOf = (counts: Counts) => FLAVOURS.reduce((sum, flavour) => sum + counts[flavour.id], 0);
const mixOf = (counts: Counts) =>
  FLAVOURS.filter((flavour) => counts[flavour.id] > 0)
    .map((flavour) => `${counts[flavour.id]} ${flavour.name}`)
    .join(', ');

interface MerchItem {
  id: string;
  name: Tri;
  text: Tri;
  price: number;
  sticker: string;
  stickerText?: string;
  rotate: number;
  /** Sold out: cannot be put aside. */
  soldOut?: boolean;
  /** Gone for good: a stamp and a struck price instead of the sticker. */
  stamp?: boolean;
  /** A short run; the count is shown. */
  stock?: number;
  state: Tri;
  note?: Tri;
}

const MERCH: MerchItem[] = [
  {
    id: 'tote',
    name: { en: 'Tote bag', ko: '토트백', ja: 'トートバッグ' },
    text: { en: 'Heavy natural canvas, printed with the flight in pour order.', ko: '두툼한 무염색 캔버스에 시음 세트를 잔 순서대로 인쇄했습니다.', ja: '厚手の生成りキャンバス地に、テイスティングセットを杯の順で印刷しました。' },
    price: 14,
    sticker: 'var(--fz-sky)',
    rotate: 8,
    state: { en: 'In stock', ko: '재고 있음', ja: '在庫あり' },
  },
  {
    id: 'poster',
    name: { en: 'Risograph poster', ko: '리소그래프 포스터', ja: 'リソグラフポスター' },
    text: { en: 'A2, the six flavours in yellow, pink and blue. Numbered edition of 200.', ko: 'A2 크기, 노랑·분홍·파랑 세 색으로 찍은 여섯 가지 맛. 200부 한정 넘버링 에디션.', ja: 'A2判、黄・ピンク・青の3色で刷った6種のフレーバー。200部限定の番号入りエディション。' },
    price: 22,
    sticker: 'var(--fz-blue)',
    stickerText: '#ffffff',
    rotate: -4,
    stock: 18,
    state: { en: '{n} left', ko: '{n}부 남음', ja: '残り{n}点' },
    note: { en: 'One per person.', ko: '1인 1점.', ja: 'お一人様1点まで。' },
  },
  {
    id: 'stickers',
    name: { en: 'Sticker sheet', ko: '스티커 시트', ja: 'ステッカーシート' },
    text: { en: 'The six shapes die-cut on one sheet the size of a postcard.', ko: '엽서 크기 한 장에 여섯 가지 도형을 다이컷으로 만든 스티커입니다.', ja: 'はがきサイズの1枚に、6種の図形をダイカットしたシートです。' },
    price: 4,
    sticker: 'var(--fz-yellow)',
    rotate: -7,
    state: { en: 'In stock', ko: '재고 있음', ja: '在庫あり' },
  },
  {
    id: 'hat',
    name: { en: 'Bucket hat', ko: '버킷햇', ja: 'バケットハット' },
    text: { en: 'Yellow needlecord with the star stitched on the front. S/M and L/XL.', ko: '노란 니들코드 원단, 앞면에 별 자수. S/M과 L/XL.', ja: 'イエローのニードルコード生地、前面に星の刺繍。S/M と L/XL。' },
    price: 28,
    sticker: 'var(--fz-pink)',
    rotate: 5,
    soldOut: true,
    state: { en: 'Sold out in both sizes', ko: '두 사이즈 모두 품절', ja: '両サイズ売り切れ' },
    note: { en: 'Forty more arrive Tuesday 24 November.', ko: '40개가 11월 24일 화요일에 더 들어옵니다.', ja: '11月24日(火)に40点が追加入荷します。' },
  },
  {
    id: 'pins',
    name: { en: 'Enamel pin set', ko: '에나멜 핀 세트', ja: 'エナメルピンセット' },
    text: { en: 'Six pins, one for each flavour’s shape, on a backing card.', ko: '여섯 개의 핀, 맛마다 도형 하나씩, 백킹 카드에 고정했습니다.', ja: 'フレーバーごとの図形を1本ずつ、台紙に留めた6本のピンです。' },
    price: 12,
    sticker: 'var(--fz-pink)',
    rotate: -8,
    soldOut: true,
    stamp: true,
    state: { en: 'Sold out on 15 November', ko: '11월 15일 품절', ja: '11月15日に売り切れ' },
    note: { en: 'Not being remade.', ko: '재입고하지 않습니다.', ja: '再製作はしません。' },
  },
  {
    id: 'glass',
    name: { en: 'Tasting glass', ko: '테이스팅 잔', ja: 'テイスティンググラス' },
    text: { en: 'A 350 ml tumbler with the 60 ml pour line printed on the side.', ko: '350 ml 텀블러이며, 옆면에 60 ml 따르는 선이 인쇄되어 있습니다.', ja: '350 mlのタンブラーで、側面に60 mlの注ぎ線が印刷されています。' },
    price: 9,
    sticker: 'var(--fz-pink)',
    rotate: -8,
    soldOut: true,
    stamp: true,
    state: { en: 'Sold out on 20 November', ko: '11월 20일 품절', ja: '11月20日に売り切れ' },
    note: { en: 'The bar still pours into them.', ko: '바에서는 지금도 이 잔에 따릅니다.', ja: 'バーでは今もこのグラスに注いでいます。' },
  },
];

const SHOP = {
  title: { en: 'Merch, here until it’s {mark}', ko: '굿즈는 {mark}까지 판매합니다', ja: 'グッズは{mark}まで販売します' },
  mark: { en: 'gone', ko: '다 떨어질 때', ja: '在庫がなくなるまで' },
  note: {
    en: 'Made in small runs for these two weeks and sold only at the shop, never posted. Put something aside here and we keep it behind the till for two days. The till takes cards and phones, no cash.',
    ko: '이번 2주 동안만 소량으로 만들며, 매장에서만 판매하고 온라인에는 올리지 않습니다. 여기서 담아 두면 이틀 동안 계산대 뒤에 보관합니다. 계산대는 카드와 휴대폰 결제만 받으며 현금은 받지 않습니다.',
    ja: '今回の2週間のためだけに少量で製作し、店頭でのみ販売してオンラインには掲載しません。ここで取り置きすると、2日間レジの奥で保管します。レジはカードとスマホ決済のみで、現金は使えません。',
  },
  put: { en: 'Put aside', ko: '담아 두기', ja: '取り置き' },
  yours: { en: 'One is put aside for you.', ko: '한 개를 담아 두었습니다.', ja: '1点を取り置きしています。' },
  soldOut: { en: 'Sold out', ko: '품절', ja: '売り切れ' },
  listTitle: { en: 'Your pick-up list', ko: '내 픽업 목록', ja: 'お受け取りリスト' },
  listEmpty: {
    en: 'Nothing put aside yet. Fill a crate, or put aside something from the list above.',
    ko: '아직 담아 둔 것이 없습니다. 상자를 채우거나 위 목록에서 상품을 담아 두세요.',
    ja: 'まだ取り置きはありません。ケースを詰めるか、上のリストから商品を取り置きしてください。',
  },
  crateLine: { en: 'Crate {no}', ko: '상자 {no}번', ja: 'ケース{no}番' },
  remove: { en: 'Remove', ko: '삭제', ja: '削除' },
  total: { en: 'Total', ko: '합계', ja: '合計' },
  totalNote: {
    en: 'Paid at the till when you collect, by card or phone. We keep everything for two days.',
    ko: '수령할 때 계산대에서 카드나 휴대폰으로 결제합니다. 모든 항목은 이틀 동안 보관합니다.',
    ja: '受け取り時にレジでカードかスマホ決済でお支払いください。すべて2日間保管します。',
  },
  newsAdded: { en: '{name} put aside. {n} on your pick-up list.', ko: '{name} 담아 둠. 픽업 목록 {n}개.', ja: '{name}を取り置きしました。受け取りリストは{n}件です。' },
  newsRemoved: { en: '{name} taken off your pick-up list.', ko: '{name} 픽업 목록에서 삭제됨.', ja: '{name}を受け取りリストから削除しました。' },
} satisfies Record<string, Tri>;

const GO = {
  title: { en: 'Getting there', ko: '오시는 길', ja: 'アクセス' },
  note: {
    en: 'We are in the old print shop on Calvert Avenue, the short street between Shoreditch High Street and Arnold Circus.',
    ko: '저희는 Calvert Avenue의 옛 인쇄소에 있습니다. Shoreditch High Street와 Arnold Circus 사이에 있는 짧은 길입니다.',
    ja: '場所はCalvert Avenueの旧印刷所です。Shoreditch High StreetとArnold Circusの間の短い通りです。',
  },
  map: {
    en: 'Street map. The shop is at the west end of Calvert Avenue, just off Shoreditch High Street. The walk from Shoreditch High Street station goes west along Bethnal Green Road, north up the High Street, then right into Calvert Avenue.',
    ko: '거리 지도. 매장은 Calvert Avenue 서쪽 끝, Shoreditch High Street 바로 옆에 있습니다. Shoreditch High Street역에서 걸어가는 길은 Bethnal Green Road를 따라 서쪽으로 간 뒤, High Street를 따라 북쪽으로 올라가서, 오른쪽으로 꺾어 Calvert Avenue로 들어갑니다.',
    ja: '道順図。店はCalvert Avenueの西端、Shoreditch High Streetのすぐ脇にあります。Shoreditch High Street駅からは、Bethnal Green Roadを西へ進み、High Streetを北へ上がって、右折してCalvert Avenueに入ります。',
  },
  maps: { en: 'Open in Maps', ko: '지도에서 열기', ja: 'マップで開く' },
} satisfies Record<string, Tri>;

const WAYS: Array<{ icon: 'circle' | 'square' | 'triangle' | 'diamond'; color?: string; name: Tri; text: Tri }> = [
  {
    icon: 'circle',
    color: 'var(--fz-yellow)',
    name: { en: 'Overground', ko: 'Overground', ja: 'Overground' },
    text: { en: 'Shoreditch High Street, 5 minutes on foot. Follow Bethnal Green Road to the High Street, turn right, then right again into Calvert Avenue.', ko: 'Shoreditch High Street에서 도보 5분. Bethnal Green Road를 따라 High Street까지 간 뒤 우회전하고, 다시 우회전하면 Calvert Avenue입니다.', ja: 'Shoreditch High Streetから徒歩5分。Bethnal Green Roadを進んでHigh Streetに出たら右折し、もう一度右折するとCalvert Avenueです。' },
  },
  {
    icon: 'square',
    color: 'var(--fz-blue)',
    name: { en: 'Northern line', ko: 'Northern선', ja: 'Northern線' },
    text: { en: 'Old Street, 14 minutes. Walk east along Old Street to Shoreditch Church, cross the High Street, and Calvert Avenue is a minute south.', ko: 'Old Street에서 도보 14분. Old Street를 동쪽으로 걸어 Shoreditch Church까지 간 뒤 High Street를 건너면, Calvert Avenue는 남쪽으로 1분 거리입니다.', ja: 'Old Streetから徒歩14分。Old Streetを東へ進んでShoreditch Churchまで行き、High Streetを渡ると、Calvert Avenueは南へ1分です。' },
  },
  { icon: 'triangle', name: { en: 'Bus', ko: '버스', ja: 'バス' }, text: { en: 'The 26, 35, 47 and 78 stop on Shoreditch High Street, two minutes away.', ko: '26, 35, 47, 78번 버스가 Shoreditch High Street에 서며, 2분 거리입니다.', ja: '26・35・47・78番のバスがShoreditch High Streetに停まり、2分の距離です。' } },
  {
    icon: 'diamond',
    color: 'var(--fz-pink)',
    name: { en: 'Bike and step-free', ko: '자전거 및 무단차 출입', ja: '自転車・段差なし' },
    text: { en: 'Racks for eight bikes outside. Level entrance and an accessible toilet at the back.', ko: '입구 앞에 자전거 8대를 세울 수 있는 거치대가 있습니다. 출입구에 단차가 없고, 뒤쪽에 휠체어 이용자용 화장실이 있습니다.', ja: '店の前に自転車8台分のラックがあります。出入口に段差はなく、奥に車椅子対応のトイレがあります。' },
  },
];

const FOOT = {
  note: {
    en: 'Fizz Lab sodas are brewed in Queen’s Yard, Hackney Wick. After 26 November you can buy them at 40 shops across London.',
    ko: 'Fizz Lab 소다는 Hackney Wick의 Queen’s Yard에서 양조합니다. 11월 26일 이후에는 London의 매장 40곳에서 구입하실 수 있습니다.',
    ja: 'Fizz Labのソーダは Hackney Wick の Queen’s Yard で醸造しています。11月26日以降は、Londonの40店舗でお買い求めいただけます。',
  },
  handle: '@fizzlab.soda',
};

const PROMPT_EN = `Design one real page in the Kinetic Pop style: a warm paper page drawn in thick ink lines, with three loud fills (yellow, pink, blue), hard offset shadows and things that move when you touch them.

Pick a believable subject that lives on bright, short, shouted information, such as a pop-up shop, a summer festival or a launch party, and write its real content. The page must read as that subject's page, never as a page about its own style. Here it is the Fizz Lab pop-up: a Hackney Wick soda brewery's two-week tasting bar at 22 Calvert Avenue in Shoreditch, with its six flavours, its opening days, a crate of twelve to fill, its merch and how to get there.

TOKENS:
--yellow: #ffe85d
--pink: #ff4f7b
--blue: #196bff
--ink: #141313
--paper: #f6f3ea
--sky: #b4cdfd
--blush: #ffd4dd
--muted: #4f4a46
--white: #ffffff
Page background: radial-gradient(circle at 10% 8%, rgba(255,79,123,0.28) 0, transparent 24%), radial-gradient(circle at 90% 18%, rgba(25,107,255,0.22) 0, transparent 28%), linear-gradient(180deg, #fffdf2 0%, #f6f3ea 100%).
Ink tints: hatching in ink at 38% (2px lines every 9px, at 135deg) for closed days and their key; ink at 7% hatching on merch that is gone for good; ink dots at 7% (hero, 12px grid) and 12% (crate and map, 11px grid).
No other colours.

COLOUR:
- Text is ink. Muted is only for past days, struck prices and the "Put aside" key of sold-out merch. There is no error colour: the page has no form.
- Yellow, pink, blue, sky and blush are fills, never text or lines on paper. The exceptions are drawn letters: the hero words filled yellow, pink and blue inside an ink stroke, the white "Free" and pour numbers inside an ink stroke, yellow text on ink (the ticker key, a pressed toggle, the Cherry Cola number), white text on the ink "Today" tag and on the blue price sticker.
- Every structural line is ink, 3 to 5px. Every shadow is a hard ink offset (2 to 6px), never blurred.
- Hover: the yellow buttons and the pick-up key lift 2px up and left while their shadow grows; the steppers and "Put aside" fill yellow; the ticker key turns pink with ink text; in-page links get a 3px underline and text buttons thicken theirs from 2px to 3px; a day cell rises 5px.
- A control that cannot act yet has a 3px dashed ink border on paper and no shadow.
- Focus: a 3px ink outline 3px clear of the control (5 to 7px around a day cell, the crate confirmation and the list heading); on the ink ticker key a yellow ring drawn inside it.

TYPOGRAPHY:
Two families. Bowlby One (one weight, 400, never bolded) shouts: the hero words, dates, headings, names, pour numbers, prices and counts. Work Sans (400 and 600) reads.
Hero words and the dates line: Bowlby One clamp(2.4rem, 6.5vw, 4.9rem), line-height 1, letter-spacing -0.02em, upper case, a 2.5px ink stroke under the fill (1.75px under 640px), each word turned a little (-3deg, 2deg, -1.5deg).
H2: Bowlby One clamp(1.85rem, 3.9vw, 3rem), line-height 1.04, letter-spacing -0.025em, balanced; one word in a yellow (or pink) box with a 3px ink border, 10px radius and a 4px shadow, turned -2deg (pink 1.5deg).
Other Bowlby sizes: pour numbers and the crate count 2.6rem; flavour names 1.4rem (1.19rem on phones); day numbers 1.8rem (1.3rem on phones); bubble, confirmation and list headings 1.6rem (1.45rem on phones); stepper counts 1.6rem (1.4rem on phones); stepper names 1.2rem (1.05rem on phones); can numbers 1.35rem (1.2rem on phones); merch names 1.3rem (1.2rem on phones); prices on stickers 1.35rem (1.16rem on phones); list prices and ways 1.2rem; the address 1.55rem (1.4rem on phones); stamps 1rem; the brand name 1.45rem (1.3rem under 400px); ticker words 1.15rem upper case at -0.015em; the yellow buttons 1rem. The toggles, the ticker key and the text buttons are Work Sans 600 1rem.
Work Sans body 1.0625rem, line-height 1.62; the hero lede 1.125rem; facts, hints, notes and keys 1rem; labels in 600. No text under 1rem except the street names inside the map (0.875rem on phones, 0.8125rem under 360px), which has a text alternative.

LAYOUT:
- A 1120px column. A top bar: the brand (a yellow circle and a pink square in ink, then the name), five in-page links and a "Pick-up list" key with a round yellow count sticker. Under 1000px the links move to a second row.
- Hero: the pop-up's poster card, 5px ink border, 36px radius (28px on phones), white, 6px shadow, clipping three blobs (yellow 200px top right, pink 140px bottom left, blue 100px at the bottom), five small ink-outlined shapes and 12px halftone dots. The name and dates, one paragraph, "Get directions" and the address on the left; the free-tasting starburst on the right (below on phones). On a 1280x800 laptop the whole card shows above the fixed prev/next bar.
- Then the ticker band, and sections divided by a 20px ink zigzag with 56px above and below (44px on phones): flavours, dates, the crate, merch, getting there, and a footer on a 4px ink rule.
- Section heads: the heading on the left (1.1fr) and one paragraph on the right (1fr), bottom-aligned; stacked under 1000px.
- Flavours: three columns, the second 70px and the third 26px lower; two columns under 1000px; one under 640px with the shape at 96px beside its text.
- Crate: the crate on 5 columns, the steppers on 7; stacked under 900px. Merch: one list box. Pick-up list: heading and note on 5 columns, the list on 7. Getting there: map on 7, address and ways on 5.

COMPONENTS:
- Starburst: a 14-point pink star with a 4px ink edge, turned 9deg, 5px ink drop shadow; "Free" white in Bowlby 2.2rem (2rem on phones) with a 2.5px stroke, "tasting" 1.1rem, "Six pours, no ticket needed" in Work Sans 600 1rem.
- Flavour ticker: a yellow band between 4px ink rules, flavour names in a row separated by small pink stars, sliding left in a 34s loop, with an ink Pause/Play key (yellow text, 44px tall) at its right end.
- Tasting flight: an ordered list of six die-cut shapes (diamond, circle, triangle, rounded square, arch, star) in sky, yellow, pink, blue, blush and ink, 136 to 164px, 4px ink edges, turned -8 to 7deg, 5px drop shadow, the pour number on each; name, one sentence, then sugar and fizz (five 13px dots) under a 3px rule.
- Opening strip: a radio group of 14 day cells on an ink grid (3px gaps and a 4px border, 2px and 3px on phones, 16px radius, 6px shadow); 7 per row under 1000px. White Tuesday to Thursday, blush Friday and Saturday, sky Sunday, hatched Monday, paper with muted text for past days, a star for nights with something on. The chosen cell turns yellow, lifts 14px, turns -3deg and grows 8% inside a 4px ink ring (8px, 6% and 3px on phones). An ink "Today" tag sits above today (inside it under 1000px, an ink bar under the date on phones). Arrows, Home and End move between days.
- Speech bubble: white, 4px ink, 26px radius, 6px shadow, up to 540px wide (full width on phones). It slides under the chosen day and its tail points at that day's cell. It says the day, its hours (today, was open, open or closed) and its events in a time column under a 3px rule.
- Crate: a yellow card crate with ink dots, 4px border, 26px radius, turned -1.5deg, a handle slot, and twelve can tops in four columns: empty is white on a 3px dashed ring; a can is its flavour's colour on a solid ring with a 3px shadow and its pour number, filled in pour order. Under it the count, "8 of 12". Beside it six stepper rows (shape, name, minus, count, plus) with 44px square keys (3px ink, 10px radius, 3px shadow); plus stops at twelve cans, minus at none. "Two of each" and "Empty the crate" are underlined text buttons. "Put the crate aside" (yellow, 50px, 12px radius, 4px shadow) works only at exactly twelve, with a hint beside it ("Pick 4 more to fill it.") and a round £26 price sticker. The confirmation replaces the steppers: a bubble pointing at the crate with its number ("Crate 7 is behind the till"), the mix and "Fill another crate"; it takes focus.
- Merch list: one white box (4px ink, 28px radius, 6px shadow), rows on 3px rules: name and description, the stock state, a "Put aside" toggle, a 92px round price sticker (76px on phones) turned a few degrees. A short run shows its count in a small yellow box. The toggle is pressed with aria-pressed: ink fill, yellow text, a tick, sunk into its shadow. Sold-out items cannot be put aside (the key is disabled); items gone for good show a pink "Sold out" stamp turned -8deg and the struck price, on a faintly hatched row.
- Pick-up list: a white box listing each crate (with its mix) and each piece of merch put aside, its price and a Remove text button, then the total. Removing a line moves focus to the list's heading. The count sticker in the top bar follows the list.
- Map: a sky street map in white roads with ink edges, Arnold Circus as a yellow ring, a pink dotted walking route from the Overground station, a pink star pin and an ink-edged "Fizz Lab" label; then the address in Bowlby, "Open in Maps" and four ways to get there, each with a small shape.
- One polite live region says what changed: the chosen day and its hours, each can added or taken out, what was put aside or removed.
- Radii: 36px hero (28px on phones), 22 to 28px boxes, 16px strip, 10 to 12px buttons, keys and the chosen day, 6 to 8px tags and stamps. Circles are kept for stickers, can tops, fizz dots, blobs and drawn shapes.

MOTION:
- The ticker slides; its key pauses it. Buttons lift on hover (160ms) and press in on click. A day cell rises 5px on hover; the chosen one springs into place (240ms, cubic-bezier(0.3, 1.5, 0.6, 1)); the bubble and its tail slide (360ms, cubic-bezier(0.3, 1.25, 0.6, 1)); each new can drops in (340ms); the count sticker pops (320ms).
- prefers-reduced-motion: the ticker stands still with every name shown and no key; no transitions and no keyframes.

FORBIDDEN:
- A grid of identical rounded cards; pill-shaped buttons
- A small label above a heading; all-caps tracked labels (upper case only on the hero words, the dates line, "Free" and the ticker, always with negative tracking)
- Thin or pale lines, blurred or soft shadows, glows, glass, gradient text
- Colour as text on paper, colours outside the tokens, more than three loud fills
- Illustrations, photographs, emoji; die-cut shapes are the only drawings, plus the street map
- Arrows on links, middle-dot meta strings, numbers on anything that is not a real sequence (pour order, dates, crate numbers)
- Copy about pop art, colour, energy or design

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML: an ordered list for the flight, a radio group for the days, groups of labelled steppers, toggle buttons with aria-pressed, a live region
3) Working ticker pause, day choice with the moving bubble, crate builder with its twelve-can rule and confirmation, merch put-aside with sold-out items refused, and the pick-up list with removal
4) Responsive layout down to 320px with no horizontal scroll and every control at least 44px tall on phones
5) Visible focus on every control, focus moved to what replaces a control, reduced-motion support`;

const PROMPT_KO = `Kinetic Pop 스타일로 실제 페이지 한 장을 디자인한다: 두꺼운 잉크 선으로 그린 따뜻한 종이 페이지에 강한 채움 세 가지(노랑, 분홍, 파랑), 딱딱한 오프셋 그림자, 손으로 건드리면 움직이는 요소를 둔다.

밝고 짧게 외치는 정보로 살아가는, 그럴듯한 주제를 고르고 실제 내용을 쓴다. 팝업 숍, 여름 축제, 출시 파티 등이 해당한다. 페이지는 그 주제의 페이지여야 하며, 스타일 자체에 관한 페이지가 되어서는 안 된다. 여기서는 Fizz Lab 팝업이다. Shoreditch의 22 Calvert Avenue에 있는 Hackney Wick 탄산음료 양조장이 2주 동안 여는 시음 바로, 여섯 가지 맛, 영업일, 채워 담는 12개들이 상자, 굿즈, 오시는 길을 담는다.

TOKENS:
--yellow: #ffe85d
--pink: #ff4f7b
--blue: #196bff
--ink: #141313
--paper: #f6f3ea
--sky: #b4cdfd
--blush: #ffd4dd
--muted: #4f4a46
--white: #ffffff
페이지 배경: radial-gradient(circle at 10% 8%, rgba(255,79,123,0.28) 0, transparent 24%), radial-gradient(circle at 90% 18%, rgba(25,107,255,0.22) 0, transparent 28%), linear-gradient(180deg, #fffdf2 0%, #f6f3ea 100%).
잉크 색조: 휴무일과 그 범례에는 잉크 38% 빗금(9px 간격의 2px 선, 135deg). 완전히 판매 종료된 굿즈에는 잉크 7% 빗금. 잉크 점은 히어로에 7%(12px 격자), 상자와 지도에 12%(11px 격자)를 찍는다.
다른 색은 쓰지 않는다.

COLOUR:
- 글자는 잉크색이다. 흐린 색은 지난 날짜, 취소선이 그어진 가격, 품절 굿즈의 "담아 두기" 키에만 쓴다. 페이지에 양식이 없으므로 오류 색은 없다.
- 노랑, 분홍, 파랑, 하늘색, 블러시는 채움색이며, 종이 위의 글자나 선으로 쓰지 않는다. 예외는 그려진 글자다: 잉크 획 안을 노랑, 분홍, 파랑으로 채운 히어로 단어, 잉크 획 안의 흰색 "무료"와 잔 번호, 잉크 바탕 위의 노란 글자(시음 키, 눌린 토글, 체리 콜라 번호), 잉크 "오늘" 태그와 파란 가격 스티커 위의 흰 글자.
- 구조선은 모두 3~5px 잉크선이다. 그림자는 모두 2~6px의 딱딱한 잉크 오프셋이며, 흐리게 하지 않는다.
- 호버: 노란 버튼과 픽업 키는 그림자가 커지면서 위와 왼쪽으로 2px 올라간다. 수량 버튼과 "담아 두기"는 노랑으로 채운다. 시음 키는 분홍으로 바뀌고 글자는 잉크색이다. 페이지 내 링크에는 3px 밑줄이 생기고, 텍스트 버튼은 밑줄을 2px에서 3px로 두껍게 한다. 날짜 칸은 5px 올라간다.
- 아직 동작할 수 없는 컨트롤은 종이 위에 3px 점선 잉크 테두리를 두고 그림자는 두지 않는다.
- 포커스: 컨트롤에서 3px 떨어진 3px 잉크 외곽선(날짜 칸, 상자 확인, 목록 제목은 5~7px). 잉크색 시음 키에서는 안쪽에 그린 노란 고리.

TYPOGRAPHY:
두 가지 서체를 쓴다. Bowlby One(굵기 400 하나, 절대 굵게 하지 않음)은 외치는 역할이다. 히어로 단어, 날짜, 제목, 이름, 잔 번호, 가격, 수량에 쓴다. Work Sans(400과 600)는 읽는 역할이다.
히어로 단어와 날짜 줄: Bowlby One clamp(2.4rem, 6.5vw, 4.9rem), line-height 1, letter-spacing -0.02em, 대문자 표기, 채움 아래 2.5px 잉크 획(640px 미만에서는 1.75px), 각 단어를 조금씩 기울인다(-3deg, 2deg, -1.5deg).
H2: Bowlby One clamp(1.85rem, 3.9vw, 3rem), line-height 1.04, letter-spacing -0.025em, text-wrap: balance. 한 단어는 노랑(또는 분홍) 상자에 넣고 3px 잉크 테두리, 10px radius, 4px 그림자를 주며, -2deg(분홍은 1.5deg) 기울인다.
그 밖의 Bowlby 크기: 잔 번호와 상자 수량 2.6rem. 맛 이름 1.4rem(휴대폰 1.19rem). 날짜 숫자 1.8rem(휴대폰 1.3rem). 말풍선, 확인, 목록 제목 1.6rem(휴대폰 1.45rem). 수량 숫자 1.6rem(휴대폰 1.4rem). 수량 조절 이름 1.2rem(휴대폰 1.05rem). 캔 번호 1.35rem(휴대폰 1.2rem). 굿즈 이름 1.3rem(휴대폰 1.2rem). 스티커 가격 1.35rem(휴대폰 1.16rem). 목록 가격과 오시는 길 항목 1.2rem. 주소 1.55rem(휴대폰 1.4rem). 도장 1rem. 브랜드 이름 1.45rem(400px 미만에서 1.3rem). 티커 단어 1.15rem 대문자, letter-spacing -0.015em. 노란 버튼 1rem. 토글, 시음 키, 텍스트 버튼은 Work Sans 600 1rem.
Work Sans 본문 1.0625rem, line-height 1.62. 히어로 리드 1.125rem. 정보, 힌트, 메모, 범례 1rem. 라벨은 600. 1rem 미만의 글자는 지도 안의 도로 이름만 허용한다(휴대폰 0.875rem, 360px 미만 0.8125rem). 이 이름에는 텍스트 대체가 있다.

LAYOUT:
- 폭 1120px 칼럼. 상단 바: 브랜드(잉크 테두리의 노란 원과 분홍 사각형, 그다음 이름), 페이지 내 링크 다섯 개, 둥근 노란 수량 스티커가 붙은 "픽업 목록" 키. 1000px 미만에서는 링크가 두 번째 줄로 내려간다.
- 히어로: 팝업의 포스터 카드. 5px 잉크 테두리, 36px radius(휴대폰 28px), 흰색, 6px 그림자. 안에서 자른 블롭 세 개(노랑 200px 오른쪽 위, 분홍 140px 왼쪽 아래, 파랑 100px 아래쪽), 잉크 외곽선의 작은 도형 다섯 개, 12px 하프톤 점. 왼쪽에는 이름과 날짜, 문단 하나, "길찾기" 버튼과 주소. 오른쪽에는 무료 시음 버스트(휴대폰에서는 아래). 1280x800 노트북에서는 카드 전체가 고정된 이전/다음 바 위에 보여야 한다.
- 이어서 티커 띠. 위아래 56px(휴대폰 44px) 여백을 둔 20px 잉크 지그재그로 나뉜 섹션: 맛, 날짜, 상자, 굿즈, 오시는 길. 4px 잉크 선 위에 푸터를 둔다.
- 섹션 머리말: 왼쪽에 제목(1.1fr), 오른쪽에 문단 하나(1fr), 아래쪽 정렬. 1000px 미만에서는 세로로 쌓는다.
- 맛: 세 칼럼. 두 번째는 70px, 세 번째는 26px 아래로 내린다. 1000px 미만에서는 두 칼럼, 640px 미만에서는 한 칼럼이며 도형은 96px로 줄여 글 옆에 둔다.
- 상자: 상자는 5칼럼, 수량 조절은 7칼럼. 900px 미만에서는 세로로 쌓는다. 굿즈: 목록 상자 하나. 픽업 목록: 제목과 메모는 5칼럼, 목록은 7칼럼. 오시는 길: 지도는 7칼럼, 주소와 이동 방법은 5칼럼.

COMPONENTS:
- 버스트: 14개 꼭짓점의 분홍 별. 4px 잉크 테두리, 9deg 기울임, 5px 잉크 드롭 그림자. "무료"는 흰색 Bowlby 2.2rem(휴대폰 2rem), 2.5px 획. "시음"은 1.1rem. "여섯 잔, 입장권 없이"는 Work Sans 600 1rem.
- 맛 티커: 4px 잉크 선 사이의 노란 띠. 맛 이름을 작은 분홍 별로 구분해 한 줄로 배치하고, 34초 주기로 왼쪽으로 흐른다. 오른쪽 끝에는 잉크색 일시정지/재생 키(노란 글자, 높이 44px).
- 시음 세트: 다이컷 도형 여섯 개(다이아몬드, 원, 삼각형, 둥근 사각형, 아치, 별)를 순서 목록으로 둔다. 색은 하늘색, 노랑, 분홍, 파랑, 블러시, 잉크. 136~164px, 4px 잉크 테두리, -8~7deg 기울임, 5px 드롭 그림자, 각각에 잔 번호. 이름, 한 문장, 그다음 3px 선 아래 당류와 탄산(13px 점 다섯 개).
- 영업일 띠: 잉크 격자 위의 날짜 칸 14개 라디오 그룹(간격 3px, 테두리 4px, 휴대폰에서는 2px와 3px, radius 16px, 그림자 6px). 1000px 미만에서는 한 줄에 7개. 화~목은 흰색, 금·토는 블러시, 일은 하늘색, 월은 빗금, 지난 날은 종이색 바탕에 흐린 글자, 행사가 있는 밤에는 별. 선택한 칸은 노랗게 바뀌고 14px 올라가며, -3deg로 기울고 8% 커져서 4px 잉크 고리 안에 든다(휴대폰에서는 8px, 6%, 3px). 오늘 칸 위에는 잉크 "오늘" 태그(1000px 미만에서는 칸 안, 휴대폰에서는 날짜 아래 잉크 막대). 화살표, Home, End로 날짜 사이를 이동한다.
- 말풍선: 흰색, 4px 잉크, 26px radius, 6px 그림자, 최대 폭 540px(휴대폰에서는 전체 폭). 선택한 날 아래로 미끄러져 들어오며 꼬리는 그 날짜 칸을 가리킨다. 날짜, 영업시간(오늘, 영업했음, 영업 중 또는 휴무), 3px 선 아래 시간 열의 행사를 보여 준다.
- 상자: 잉크 점이 찍힌 노란 카드 상자. 4px 테두리, 26px radius, -1.5deg 기울임, 손잡이 슬롯, 4열로 배열된 캔 윗면 열두 개. 빈 칸은 3px 점선 고리의 흰색이다. 캔은 맛 색으로 채운 실선 고리에 3px 그림자와 잔 번호가 있으며, 잔 순서대로 채워진다. 아래에는 "8 / 12 캔 담김" 같은 수량을 표시한다. 옆에는 수량 조절 줄 여섯 개(도형, 이름, 빼기, 수량, 더하기)와 44px 정사각 키(3px 잉크, 10px radius, 3px 그림자). 더하기는 열두 개에서 멈추고, 빼기는 0개에서 멈춘다. "각 2개씩"과 "상자 비우기"는 밑줄 있는 텍스트 버튼이다. "상자 담아 두기"(노랑, 50px, 12px radius, 4px 그림자)는 정확히 열두 개일 때만 동작하며, 옆에 힌트("4개 더 골라 채우세요.")와 둥근 £26 가격 스티커가 있다. 확인 화면은 수량 조절을 대신한다. 상자를 가리키는 말풍선에 번호("상자 7번은 계산대 뒤에 있습니다"), 구성, "상자 하나 더 채우기"가 나오며, 포커스를 받는다.
- 굿즈 목록: 흰색 상자 하나(4px 잉크, 28px radius, 6px 그림자). 3px 선으로 나뉜 행에 이름과 설명, 재고 상태, "담아 두기" 토글, 몇 도 기울어진 92px 둥근 가격 스티커(휴대폰 76px)를 둔다. 수량이 적은 상품은 개수를 노란 작은 상자에 표시한다. 토글은 aria-pressed로 눌림을 나타낸다: 잉크 채움, 노란 글자, 체크 표시, 그림자 안으로 가라앉은 모습. 품절 상품은 담아 둘 수 없다(키 비활성). 완전히 판매 종료된 상품은 -8deg로 기울어진 분홍 "품절" 도장과 취소선 가격을 보여 주며, 행은 옅은 빗금 배경이다.
- 픽업 목록: 흰색 상자에 상자마다(구성 포함)와 담아 둔 굿즈마다 항목, 가격, "삭제" 텍스트 버튼을 나열하고 그 아래 합계를 둔다. 항목을 삭제하면 포커스가 목록 제목으로 옮겨진다. 상단 바의 수량 스티커도 목록을 따라 바뀐다.
- 지도: 하늘색 바탕에 잉크 가장자리의 흰 도로. Arnold Circus는 노란 고리, Overground 역에서 이어지는 분홍 점선 도보 경로, 분홍 별 핀, 잉크 외곽선의 "Fizz Lab" 표지. 그 아래에 Bowlby로 주소, "지도에서 열기", 작은 도형이 붙은 이동 방법 네 가지.
- 정중한 라이브 영역 하나가 바뀐 내용을 알린다: 선택한 날짜와 영업시간, 추가되거나 빠진 캔마다, 담아 두거나 삭제한 항목.
- Radius: 히어로 36px(휴대폰 28px), 상자류 22~28px, 날짜 띠 16px, 버튼, 키, 선택한 날 10~12px, 태그와 도장 6~8px. 원형은 스티커, 캔 윗면, 탄산 점, 블롭, 그려진 도형에만 쓴다.

MOTION:
- 티커는 흐르고, 시음 키로 멈춘다. 버튼은 호버 시 올라가고(160ms), 클릭 시 눌려 들어간다. 날짜 칸은 호버 시 5px 올라가고, 선택한 칸은 제자리로 튕겨 들어간다(240ms, cubic-bezier(0.3, 1.5, 0.6, 1)). 말풍선과 꼬리는 미끄러져 이동한다(360ms, cubic-bezier(0.3, 1.25, 0.6, 1)). 새 캔은 떨어져 들어간다(340ms). 수량 스티커는 팝 효과로 나타난다(320ms).
- prefers-reduced-motion: 티커는 멈추고 모든 이름을 보여 주며 키는 두지 않는다. 트랜지션과 키프레임을 쓰지 않는다.

FORBIDDEN:
- 같은 모양의 둥근 카드를 늘어놓은 격자. 알약 모양 버튼
- 제목 위의 작은 라벨. 자간을 넓힌 전체 대문자 라벨(대문자는 히어로 단어, 날짜 줄, "무료", 티커에만 쓰고, 항상 음수 자간)
- 얇거나 연한 선, 흐리거나 부드러운 그림자, 글로우, 유리 효과, 그라데이션 글자
- 종이 위의 글자로 쓰는 색, 토큰 밖의 색, 강한 채움 세 가지를 넘는 것
- 일러스트, 사진, 이모지. 다이컷 도형과 도로 지도 외에는 그림을 쓰지 않는다
- 링크의 화살표, 가운뎃점으로 이은 메타 문자열, 실제 순서가 아닌 것에 붙이는 번호(잔 순서, 날짜, 상자 번호에만 허용)
- 팝 아트, 색, 에너지, 디자인에 관한 문구

OUTPUT:
1) 위 토큰을 담은 CSS 사용자 정의 속성
2) 시맨틱 HTML: 시음 세트는 순서 목록, 날짜는 라디오 그룹, 라벨이 붙은 수량 조절 그룹, aria-pressed를 쓰는 토글 버튼, 라이브 영역
3) 동작하는 티커 일시정지, 움직이는 말풍선과 함께하는 날짜 선택, 열두 캔 규칙과 확인이 있는 상자 구성, 품절 상품을 막는 굿즈 담아 두기, 삭제가 가능한 픽업 목록
4) 320px까지 대응하는 반응형 레이아웃(가로 스크롤 없음), 휴대폰에서는 모든 컨트롤의 높이 44px 이상
5) 모든 컨트롤에 보이는 포커스, 컨트롤을 대신하는 요소로 포커스 이동, reduced-motion 지원`;

const PROMPT_JA = `Kinetic Popスタイルで実在するページを1枚デザインする: 太いインクの線で描いた温かみのある紙のページに、強い塗り3色（黄、ピンク、青）、硬いオフセットの影、触れると動く要素を置く。

ショップ、夏のフェス、ローンチパーティーなど、明るく短く叫ぶような情報で成り立つ、もっともらしい題材を選び、実際の内容を書く。ページはその題材のページでなければならず、スタイル自体についてのページであってはならない。ここではFizz Labのポップアップとする。Shoreditchの22 Calvert Avenueにある、Hackney Wickのソーダ醸造所による2週間限定の試飲バーで、6種のフレーバー、営業日、12本入りケースの詰め合わせ、グッズ、アクセス方法を載せる。

TOKENS:
--yellow: #ffe85d
--pink: #ff4f7b
--blue: #196bff
--ink: #141313
--paper: #f6f3ea
--sky: #b4cdfd
--blush: #ffd4dd
--muted: #4f4a46
--white: #ffffff
ページ背景: radial-gradient(circle at 10% 8%, rgba(255,79,123,0.28) 0, transparent 24%), radial-gradient(circle at 90% 18%, rgba(25,107,255,0.22) 0, transparent 28%), linear-gradient(180deg, #fffdf2 0%, #f6f3ea 100%).
インクの色調: 休業日とその凡例には、インク38%のハッチング（9px間隔の2px線、135deg）。完売したグッズには、インク7%のハッチング。インクの点は、ヒーローに7%（12pxグリッド）、ケースと地図に12%（11pxグリッド）を打つ。
ほかの色は使わない。

COLOUR:
- 文字はインク色。薄い色は過去の日付、取り消し線の価格、売り切れグッズの「取り置き」キーにのみ使う。フォームがないので、エラー色はない。
- 黄、ピンク、青、空色、ブラッシュは塗りであり、紙の上の文字や線には使わない。例外は描かれた文字: インクの縁取りの中を黄・ピンク・青で塗ったヒーローの単語、インクの縁取りの中の白い「無料」と杯の番号、インク地の上の黄色い文字（試飲キー、押された切替、チェリーコーラの番号）、インクの「本日」タグと青い価格スティッカー上の白い文字。
- 構造線はすべて3〜5pxのインク。影はすべて2〜6pxの硬いインクのオフセットで、ぼかさない。
- ホバー: 黄色のボタンとピックアップキーは、影が大きくなりながら上と左へ2px持ち上がる。数量ボタンと「取り置き」は黄色で塗る。試飲キーはピンクになり、文字はインク色。ページ内リンクには3pxの下線、テキストボタンは下線を2pxから3pxへ太くする。日付のマスは5px上がる。
- まだ操作できないコントロールは、紙の上に3pxの破線のインク枠を持ち、影はない。
- フォーカス: コントロールから3px離した3pxのインクのアウトライン（日付のマス周辺、ケースの確認、リストの見出しは5〜7px）。インク色の試飲キーでは、内側に描いた黄色のリング。

TYPOGRAPHY:
2種類の書体を使う。Bowlby One（ウェイトは400のみ、太字にしない）は叫ぶ役割で、ヒーローの単語、日付、見出し、名前、杯の番号、価格、数量に使う。Work Sans（400と600）は読む役割。
ヒーローの単語と日付行: Bowlby One clamp(2.4rem, 6.5vw, 4.9rem)、line-height 1、letter-spacing -0.02em、大文字表記、塗りの下に2.5pxのインクの縁取り（640px未満では1.75px）、各単語をわずかに傾ける（-3deg, 2deg, -1.5deg）。
H2: Bowlby One clamp(1.85rem, 3.9vw, 3rem)、line-height 1.04、letter-spacing -0.025em、text-wrap: balance。1語を黄色（またはピンク）の箱に入れ、3pxのインク枠、10pxの角丸、4pxの影を付け、-2deg（ピンクは1.5deg）傾ける。
そのほかのBowlbyサイズ: 杯の番号とケースの数量 2.6rem。味の名前 1.4rem（スマホでは1.19rem）。日付の数字 1.8rem（スマホでは1.3rem）。吹き出し、確認、リストの見出し 1.6rem（スマホでは1.45rem）。数量の数字 1.6rem（スマホでは1.4rem）。数量ボタンの名前 1.2rem（スマホでは1.05rem）。缶の番号 1.35rem（スマホでは1.2rem）。グッズ名 1.3rem（スマホでは1.2rem）。スティッカーの価格 1.35rem（スマホでは1.16rem）。リストの価格とアクセス方法 1.2rem。住所 1.55rem（スマホでは1.4rem）。スタンプ 1rem。ブランド名 1.45rem（400px未満では1.3rem）。ティッカーの単語 1.15rem 大文字、letter-spacing -0.015em。黄色のボタン 1rem。切替、試飲キー、テキストボタンはWork Sans 600 1rem。
Work Sans本文 1.0625rem、line-height 1.62。ヒーローのリード 1.125rem。情報、ヒント、メモ、凡例 1rem。ラベルは600。1rem未満の文字は、地図内の道路名だけ許可する（スマホでは0.875rem、360px未満では0.8125rem）。この道路名には文字による代替がある。

LAYOUT:
- 幅1120pxのカラム。上部バー: ブランド（インクで縁取りした黄色の円と桃色の四角、その後に名前）、ページ内リンク5つ、丸い黄色の数量スティッカー付きの「ピックアップリスト」キー。1000px未満ではリンクは2段目に移る。
- ヒーロー: ポップアップのポスターカード。5pxのインク枠、36pxの角丸（スマホでは28px）、白、6pxの影。カードで切り抜く3つのブロブ（黄200px右上、ピンク140px左下、青100px下部）、インク縁取りの小さな図形5つ、12pxのハーフトーンの点。左に名前と日付、段落1つ、「道順を見る」ボタンと住所。右に無料試飲のバースト（スマホでは下）。1280x800のノートPCでは、固定の前後バーの上にカード全体が見えること。
- 続いてティッカー帯。上下56px（スマホでは44px）の余白を取った20pxのインクのジグザグで区切ったセクション: 味、日付、ケース、グッズ、アクセス。4pxのインクの罫線の上にフッターを置く。
- セクション見出し: 左に見出し（1.1fr）、右に段落1つ（1fr）、下揃え。1000px未満では縦に積む。
- 味: 3カラム。2つ目は70px、3つ目は26px下げる。1000px未満は2カラム、640px未満は1カラムで、図形は96pxに縮めて本文の横に置く。
- ケース: ケースは5カラム、数量調整は7カラム。900px未満では縦に積む。グッズ: リストボックス1つ。ピックアップリスト: 見出しとメモが5カラム、リストが7カラム。アクセス: 地図が7カラム、住所と方法が5カラム。

COMPONENTS:
- バースト: 14角形のピンクの星。4pxのインクの縁、9deg回転、5pxのインクのドロップシャドウ。「無料」は白のBowlby 2.2rem（スマホでは2rem）、2.5pxの縁取り。「試飲」は1.1rem。「6杯、チケット不要」はWork Sans 600 1rem。
- 味のティッカー: 4pxのインク罫線の間の黄色い帯。味の名前を小さなピンクの星で区切って一列に並べ、34秒のループで左へ流れる。右端にインクの一時停止/再生キー（黄色の文字、高さ44px）。
- 試飲セット: ダイカットの図形6つを順序付きリストで置く（ダイヤ、円、三角、角丸の正方形、アーチ、星）。色は空色、黄、ピンク、青、ブラッシュ、インク。136〜164px、4pxのインクの縁、-8〜7degの回転、5pxのドロップシャドウ、それぞれに杯の番号。名前、1文、そして3pxの罫線の下に糖分と炭酸（13pxの点5つ）。
- 営業日の帯: インクの格子の上の日付マス14個のラジオグループ（3pxの間隔、4pxの枠、スマホでは2pxと3px、16pxの角丸、6pxの影）。1000px未満では1行7個。火〜木は白、金・土はブラッシュ、日は空色、月は斜線、過去の日は紙色の上に薄い文字、何かある夜は星。選んだマスは黄色になり、14px持ち上がり、-3degに傾いて8%拡大し、4pxのインクのリングの中に入る（スマホでは8px、6%、3px）。今日の上にはインクの「本日」タグ（1000px未満ではマスの中、スマホでは日付の下のインクのバー）。矢印、Home、Endで日の間を移動する。
- 吹き出し: 白、4pxのインク、26pxの角丸、6pxの影、最大幅540px（スマホでは全幅）。選んだ日の下へ滑り込み、しっぽがその日のマスを指す。日付、営業時間（本日、営業済み、営業中または休業）、3pxの罫線の下の時刻欄の行事を示す。
- ケース: インクの点がある黄色のカードのケース。4pxの枠、26pxの角丸、-1.5degの回転、取っ手のスロット、4列に並ぶ12個の缶のふた。空は白で、3pxの破線のリング。缶はその味の色で、実線のリングに3pxの影と杯の番号があり、杯の順に埋まる。その下に「8 / 12本」のような数量。横に数量の行6つ（図形、名前、マイナス、数、プラス）、44pxの正方形のキー（3pxのインク、10pxの角丸、3pxの影）。プラスは12本で止まり、マイナスは0で止まる。「各2本ずつ」と「ケースを空にする」は下線付きのテキストボタン。「ケースを取り置き」（黄色、50px、12pxの角丸、4pxの影）は、ちょうど12本のときだけ動き、横にヒント（「あと4本選ぶと埋まります。」）と丸い£26の価格スティッカーを置く。確認画面は数量調整の代わりに出る: ケースを指す吹き出しに番号（「ケース7番はレジ奥にあります」）、内容、「ケースをもう1つ詰める」。フォーカスを受け取る。
- グッズ一覧: 白い箱1つ（4pxのインク、28pxの角丸、6pxの影）。3pxの罫線で区切った行に、名前と説明、在庫の状態、「取り置き」切替、数度回転した92pxの丸い価格スティッカー（スマホでは76px）を並べる。在庫が少ない商品は、残数を黄色の小さな箱に表示する。切替はaria-pressedで押下状態を示す: インクの塗り、黄色の文字、チェック、影の中へ沈んだ見た目。売り切れの商品は取り置きできない（キーは無効）。完全に販売終了した商品は、-8degに傾いたピンクの「売り切れ」スタンプと取り消し線の価格を示し、行は薄いハッチングの上に置く。
- ピックアップリスト: 白い箱に、各ケース（内容を含む）と取り置きした各グッズを、価格と「削除」テキストボタンとともに並べ、その後に合計を置く。行を削除すると、フォーカスはリストの見出しへ移る。上部バーの数量スティッカーはリストに追従する。
- 地図: 白い道路にインクの縁を付けた空色の街路図。Arnold Circusは黄色のリング、Overground駅からの桃色の点線の徒歩ルート、ピンクの星のピン、インクの縁取りの「Fizz Lab」ラベル。その下に、Bowlbyの住所、「マップで開く」、小さな図形付きの移動方法4つ。
- 控えめなライブリージョンが1つ、変化を伝える: 選んだ日と営業時間、追加または取り出された缶それぞれ、取り置きまたは削除された項目。
- 角丸: ヒーロー36px（スマホでは28px）、箱類22〜28px、日付の帯16px、ボタン、キー、選んだ日10〜12px、タグと図形のスタンプ6〜8px。円はスティッカー、缶のふた、炭酸の点、ブロブ、描かれた図形に限る。

MOTION:
- ティッカーは流れ、そのキーで止まる。ボタンはホバーで持ち上がり（160ms）、クリックで押し込まれる。日付のマスはホバーで5px上がり、選んだマスは所定の位置へ弾んで入る（240ms、cubic-bezier(0.3, 1.5, 0.6, 1)）。吹き出しとしっぽは滑る（360ms、cubic-bezier(0.3, 1.25, 0.6, 1)）。新しい缶は落ちて入る（340ms）。数量スティッカーはポップする（320ms）。
- prefers-reduced-motion: ティッカーは止まり、すべての名前を表示し、キーは置かない。トランジションもキーフレームも使わない。

FORBIDDEN:
- 同じ角丸カードを並べたグリッド。カプセル型のボタン
- 見出しの上の小さなラベル。字間を空けた全大文字のラベル（大文字はヒーローの単語、日付行、「無料」、ティッカーにのみ使い、常に負の字間）
- 細い線や薄い線、ぼけた影やソフトな影、グロー、ガラス効果、グラデーション文字
- 紙の上の文字としての色、トークン外の色、強い塗りの3色を超えるもの
- イラスト、写真、絵文字。ダイカットの図形と道路地図以外の描画はしない
- リンクの矢印、中点で区切ったメタ文字列、実際の順序ではないものへの番号（杯の順、日付、ケース番号にのみ使う）
- ポップアート、色、エネルギー、デザインについての文言

OUTPUT:
1) 上記トークンのCSSカスタムプロパティ
2) セマンティックHTML: 試飲セットは順序付きリスト、日付はラジオグループ、ラベル付きの数量調整のグループ、aria-pressedの切替ボタン、ライブリージョン
3) 動作するティッカーの一時停止、動く吹き出しとの日付選択、12本ルールと確認のあるケース作成、売り切れを拒否するグッズの取り置き、削除のあるピックアップリスト
4) 320pxまでのレスポンシブレイアウト（横スクロールなし）。スマホではすべてのコントロールの高さ44px以上
5) すべてのコントロールに見えるフォーカス、コントロールの代わりになるものへのフォーカス移動、reduced-motion対応`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_KO, ja: PROMPT_JA };

interface CrateLine {
  no: number;
  counts: Counts;
}

const vars = (values: Record<string, string | number>) => values as CSSProperties;

export function PortedKineticPopPage({ lang }: PortedStylePageProps) {
  const [paused, setPaused] = useState(false);
  const [dayIndex, setDayIndex] = useState(TODAY);
  const [counts, setCounts] = useState<Counts>(START);
  const [doneNo, setDoneNo] = useState<number | null>(null);
  const [crates, setCrates] = useState<CrateLine[]>([]);
  const [aside, setAside] = useState<string[]>([]);
  const [news, setNews] = useState('');
  const nextNo = useRef(7);
  const doneRef = useRef<HTMLDivElement>(null);
  const firstPlusRef = useRef<HTMLButtonElement>(null);
  const listHeadRef = useRef<HTMLHeadingElement>(null);

  const t = (text: Tri) => text[lang];

  const day = DAYS[dayIndex];
  const total = totalOf(counts);
  const full = total === CRATE_SIZE;
  const merchAside = MERCH.filter((item) => aside.includes(item.id));
  const listCount = crates.length + merchAside.length;
  const listTotal = crates.length * CRATE_PRICE + merchAside.reduce((sum, item) => sum + item.price, 0);

  // The cans in pour order, one slot each, then the empty slots. A can keeps its key while
  // others are added or taken out, so only a new can drops in.
  const slots: Array<{ key: string; flavour: Flavour | null }> = FLAVOURS.flatMap((flavour) =>
    Array.from({ length: counts[flavour.id] }, (_, k) => ({ key: `${flavour.id}-${k}`, flavour })),
  );
  while (slots.length < CRATE_SIZE) slots.push({ key: `empty-${slots.length}`, flavour: null });

  const dayTitle = fill(t(DATES.dayTitle), { day: t(day.long), n: day.n });
  const dayHours = day.kind === 'shut' || !day.open || !day.close
    ? t(DATES.closed)
    : fill(t(day.today ? DATES.hoursToday : day.past ? DATES.hoursPast : DATES.hoursNext), { open: day.open, close: day.close });

  const chooseDay = (index: number) => {
    const next = DAYS[index];
    setDayIndex(index);
    const hours = next.kind === 'shut' || !next.open || !next.close
      ? t(DATES.closed)
      : fill(t(next.today ? DATES.hoursToday : next.past ? DATES.hoursPast : DATES.hoursNext), { open: next.open, close: next.close });
    setNews(`${fill(t(DATES.dayTitle), { day: t(next.long), n: next.n })}: ${hours}.`);
  };

  // The radios move with the arrow keys. Home and End reach the first and the last day.
  const jumpDay = (event: KeyboardEvent<HTMLFieldSetElement>) => {
    if (event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const index = event.key === 'Home' ? 0 : DAYS.length - 1;
    chooseDay(index);
    event.currentTarget.querySelectorAll<HTMLInputElement>('input')[index]?.focus();
  };

  const step = (flavour: Flavour, by: 1 | -1) => {
    const n = counts[flavour.id];
    if (by === 1 && full) {
      setNews(t(CRATE.newsBlocked));
      return;
    }
    if (by === -1 && n === 0) {
      setNews(fill(t(CRATE.newsNone), { name: flavour.name }));
      return;
    }
    const next = { ...counts, [flavour.id]: n + by };
    const nextTotal = totalOf(next);
    setCounts(next);
    setNews(fill(t(nextTotal === CRATE_SIZE ? CRATE.newsFull : CRATE.newsCount), { name: flavour.name, n: n + by, total: nextTotal }));
  };

  const putCrateAside = () => {
    if (!full) {
      setNews(fill(t(CRATE.newsNotFull), { n: CRATE_SIZE - total }));
      return;
    }
    const no = nextNo.current;
    nextNo.current += 1;
    flushSync(() => {
      setCrates([...crates, { no, counts }]);
      setDoneNo(no);
      setNews('');
    });
    doneRef.current?.focus();
  };

  const fillAnother = () => {
    flushSync(() => {
      setCounts(EMPTY);
      setDoneNo(null);
    });
    firstPlusRef.current?.focus();
  };

  const toggleMerch = (item: MerchItem) => {
    if (item.soldOut) return;
    if (aside.includes(item.id)) {
      setAside(aside.filter((id) => id !== item.id));
      setNews(fill(t(SHOP.newsRemoved), { name: t(item.name) }));
    } else {
      setAside([...aside, item.id]);
      setNews(fill(t(SHOP.newsAdded), { name: t(item.name), n: listCount + 1 }));
    }
  };

  // A removed line leaves the list; focus goes to the list's heading.
  const removeCrate = (no: number) => {
    flushSync(() => {
      setCrates(crates.filter((crate) => crate.no !== no));
      if (doneNo === no) setDoneNo(null);
      setNews(fill(t(SHOP.newsRemoved), { name: fill(t(SHOP.crateLine), { no }) }));
    });
    listHeadRef.current?.focus();
  };

  const removeMerch = (item: MerchItem) => {
    flushSync(() => {
      setAside(aside.filter((id) => id !== item.id));
      setNews(fill(t(SHOP.newsRemoved), { name: t(item.name) }));
    });
    listHeadRef.current?.focus();
  };

  const tickerItems = [t(TICKER.free), ...FLAVOURS.map((flavour) => flavour.name)];

  return (
    <FusionShell
      fusionId="kinetic-pop"
      lang={lang}
      tone="light"
      accent="#ffe85d"
      prev={{ href: '/pages/editorial-silence.html', label: 'Editorial Silence' }}
      next={{ href: '/pages/cyberpunk-glitch.html', label: 'Cyberpunk Glitch' }}
      prompts={PROMPTS}
    >
      <div className="fz">
        <header className="fz-top">
          <p className="fz-mark">
            <span className="fz-mark__shapes" aria-hidden="true"><i /><i /></span>
            Fizz Lab
          </p>
          <nav className="fz-top__nav" aria-label={t(HEAD.nav)}>
            <a href="#fz-flavours">{t(HEAD.flavours)}</a>
            <a href="#fz-dates">{t(HEAD.dates)}</a>
            <a href="#fz-crate">{t(HEAD.crates)}</a>
            <a href="#fz-merch">{t(HEAD.merch)}</a>
            <a href="#fz-go">{t(HEAD.go)}</a>
          </nav>
          <a className="fz-top__list" href="#fz-pickup">
            <span>
              {t(HEAD.pickUp)}
              <span className="fz-top__word">{` ${t(HEAD.listWord)}`}</span>
            </span>
            <span className="fz-top__count" key={listCount}>{listCount}</span>
          </a>
        </header>

        <p className="fz-sr" role="status">{news}</p>

        <section className="fz-hero" aria-labelledby="fz-hero-title">
          <div className="fz-hero__clip">
            <div className="fz-halftone" aria-hidden="true" />
            <span className="fz-blob fz-blob--a" aria-hidden="true" />
            <span className="fz-blob fz-blob--b" aria-hidden="true" />
            <span className="fz-blob fz-blob--c" aria-hidden="true" />
            <div className="fz-geo" aria-hidden="true">
              <span className="fz-geo__circle" />
              <span className="fz-geo__triangle" />
              <span className="fz-geo__square" />
              <span className="fz-geo__star" />
              <span className="fz-geo__diamond" />
            </div>
            <div className="fz-hero__text">
              <h1 className="fz-hero__title" id="fz-hero-title">
                {HERO.words.map((word, index) => (
                  <Fragment key={word.en}>
                    {index > 0 ? ' ' : null}
                    <span className="fz-word">{t(word)}</span>
                  </Fragment>
                ))}
              </h1>
              <p className="fz-when">
                <span aria-hidden="true">{t(HERO.when)}</span>
                <span className="fz-sr">{t(HERO.whenSpoken)}</span>
              </p>
              <p className="fz-lede">{t(HERO.lede)}</p>
              <div className="fz-hero__act">
                <a className="fz-btn" href="#fz-go">{t(HERO.directions)}</a>
                <p>
                  {t(HERO.where)}
                  <span>{t(HERO.open)}</span>
                </p>
              </div>
            </div>
            <div className="fz-burst">
              <svg viewBox="0 0 100 100" aria-hidden="true"><polygon points={BURST} /></svg>
              <p>
                <b>{t(HERO.free)}</b> <span>{t(HERO.tasting)}</span> <small>{t(HERO.pours)}</small>
              </p>
            </div>
          </div>
        </section>

        <div className={`fz-ticker${paused ? ' is-paused' : ''}`}>
          <div className="fz-ticker__view" aria-hidden="true">
            <div className="fz-ticker__track">
              {[0, 1].map((copy) => (
                <div className="fz-ticker__copy" key={copy}>
                  {tickerItems.map((item) => (
                    <Fragment key={item}>
                      <span>{item}</span>
                      <i />
                    </Fragment>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <button className="fz-ticker__btn" type="button" onClick={() => setPaused(!paused)}>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              {paused ? <polygon points="5,3 17,10 5,17" /> : (
                <>
                  <rect x="4" y="3" width="4" height="14" />
                  <rect x="12" y="3" width="4" height="14" />
                </>
              )}
            </svg>
            <span>{t(paused ? TICKER.play : TICKER.pause)}</span>
            <span className="fz-sr"> {t(TICKER.what)}</span>
          </button>
        </div>

        <div className="fz-zigzag" aria-hidden="true" />

        <section className="fz-section" id="fz-flavours" aria-labelledby="fz-flavours-title">
          <div className="fz-head">
            <h2 id="fz-flavours-title">{place(t(FLIGHT.title), 'mark', <mark>{t(FLIGHT.mark)}</mark>)}</h2>
            <p>{t(FLIGHT.note)}</p>
          </div>
          <ol className="fz-flight">
            {FLAVOURS.map((flavour, index) => (
              <li className="fz-fl" key={flavour.id}>
                <div
                  className="fz-fl__shape"
                  style={vars({
                    '--fz-c': flavour.fill,
                    '--fz-s': `${flavour.size}px`,
                    '--fz-r': `${flavour.rotate}deg`,
                    '--fz-ny': flavour.numberDrop,
                    '--fz-nc': flavour.numberColor,
                  })}
                >
                  <svg viewBox="0 0 100 100" aria-hidden="true"><ShapePath shape={flavour.shape} /></svg>
                  <b aria-hidden="true">{index + 1}</b>
                </div>
                <h3>{flavour.name}</h3>
                <p>{t(flavour.text)}</p>
                <dl className="fz-facts">
                  <dt>{t(FLIGHT.sugar)}</dt>
                  <dd>{fill(t(FLIGHT.sugarValue), { n: flavour.sugar })}</dd>
                  <dt>{t(FLIGHT.fizz)}</dt>
                  <dd>
                    <span className="fz-fizz" role="img" aria-label={fill(t(FLIGHT.fizzValue), { n: flavour.fizz })}>
                      {[1, 2, 3, 4, 5].map((dot) => <i key={dot} className={dot <= flavour.fizz ? 'is-on' : undefined} />)}
                    </span>
                  </dd>
                </dl>
              </li>
            ))}
          </ol>
        </section>

        <div className="fz-zigzag" aria-hidden="true" />

        <section className="fz-section" id="fz-dates" aria-labelledby="fz-dates-title">
          <div className="fz-head">
            <h2 id="fz-dates-title">{t(DATES.title)}</h2>
            <p>{t(DATES.note)}</p>
          </div>
          <fieldset className="fz-days" onKeyDown={jumpDay}>
            <legend className="fz-sr">{t(DATES.legend)}</legend>
            <ol className="fz-cal">
              {DAYS.map((item, index) => {
                const classes = ['fz-day', `fz-day--${item.kind}`];
                if (item.past) classes.push('is-past');
                if (item.today) classes.push('is-today');
                if (index === dayIndex) classes.push('is-on');
                return (
                  <li key={item.date}>
                    <label className={classes.join(' ')}>
                      <input
                        className="fz-day__input"
                        type="radio"
                        name="fz-day"
                        value={item.date}
                        checked={index === dayIndex}
                        onChange={() => chooseDay(index)}
                      />
                      {item.today ? <span className="fz-day__today">{t(DATES.today)}</span> : null}
                      <span className="fz-day__wd">{t(item.short)}</span>
                      <span className="fz-day__n">{item.n}</span>
                      <span className="fz-sr"> {t(DATES.month)}</span>
                      <span className="fz-day__h">
                        {item.open && item.close ? ` ${item.open.slice(0, 2)}–${item.close.slice(0, 2)}` : ` ${t(DATES.closed)}`}
                      </span>
                      {item.star ? (
                        <>
                          <i className="fz-day__star" aria-hidden="true" />
                          <span className="fz-sr">, {t(item.star)}</span>
                        </>
                      ) : null}
                    </label>
                  </li>
                );
              })}
            </ol>
          </fieldset>

          <div className="fz-say">
            <div
              className="fz-bubble"
              style={vars({ '--fz-d14': (dayIndex + 0.5) / 14, '--fz-d7': ((dayIndex % 7) + 0.5) / 7 })}
            >
              <h3>{dayTitle}</h3>
              <p className="fz-bubble__time">{dayHours}</p>
              {day.kind === 'shut' ? (
                <p className="fz-bubble__shut">{t(DATES.shutNote)}</p>
              ) : (
                <ul>
                  {day.events.map((event) => (
                    <li key={event.time + event.text.en}>
                      <time dateTime={`${day.date}T${event.time}`}>{event.time}</time>
                      <span>{t(event.text)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <dl className="fz-key" aria-label={t(DATES.keyLabel)}>
            {KEY.map((row) => (
              <div key={row.name.en}>
                <i className={`fz-key__swatch fz-key__swatch--${row.swatch}`} aria-hidden="true" />
                <dt>{t(row.name)}</dt>
                <dd>{t(row.hours)}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="fz-zigzag" aria-hidden="true" />

        <section className="fz-section" id="fz-crate" aria-labelledby="fz-crate-title">
          <div className="fz-head">
            <h2 id="fz-crate-title">{place(t(CRATE.title), 'mark', <mark>{t(CRATE.mark)}</mark>)}</h2>
            <p>{t(CRATE.note)}</p>
          </div>

          <div className="fz-builder">
            <div className="fz-crate-side">
              <div
                className={`fz-crate${full ? ' is-full' : ''}`}
                role="img"
                aria-label={`${fill(t(CRATE.picture), { n: total })}${total > 0 ? `: ${mixOf(counts)}` : ''}`}
              >
                <span className="fz-crate__handle" aria-hidden="true" />
                {slots.map(({ key, flavour }) => (
                  <span
                    key={key}
                    className={`fz-can${flavour ? ' is-in' : ''}`}
                    style={flavour ? vars({ '--fz-c': flavour.fill, '--fz-nc': flavour.numberColor }) : undefined}
                  >
                    {flavour ? <b>{FLAVOURS.indexOf(flavour) + 1}</b> : null}
                  </span>
                ))}
              </div>
              <p className="fz-tally">
                <b>{total}</b> <span className="fz-tally__of">{t(CRATE.of)}</span>
                <span className="fz-tally__cans">{t(CRATE.cans)}</span>
              </p>
            </div>

            {doneNo !== null ? (
              <div className="fz-done" ref={doneRef} tabIndex={-1}>
                <p className="fz-done__title">{fill(t(CRATE.doneTitle), { no: doneNo })}</p>
                <p className="fz-done__mix">{mixOf(crates.find((crate) => crate.no === doneNo)?.counts ?? counts)}.</p>
                <p>{t(CRATE.doneNote)}</p>
                <button className="fz-btn fz-btn--white" type="button" onClick={fillAnother}>{t(CRATE.another)}</button>
              </div>
            ) : (
              <div className="fz-pick">
                <ul className="fz-steps" aria-label={t(CRATE.flavours)}>
                  {FLAVOURS.map((flavour, index) => {
                    const n = counts[flavour.id];
                    return (
                      <li className="fz-steprow" key={flavour.id}>
                        <span className="fz-steprow__shape" style={vars({ '--fz-c': flavour.fill })} aria-hidden="true">
                          <svg viewBox="0 0 100 100"><ShapePath shape={flavour.shape} /></svg>
                        </span>
                        <span className="fz-steprow__name" id={`fz-step-${flavour.id}`}>{flavour.name}</span>
                        <div className="fz-stepper" role="group" aria-labelledby={`fz-step-${flavour.id}`}>
                          <button
                            type="button"
                            aria-label={fill(t(CRATE.less), { name: flavour.name })}
                            aria-disabled={n === 0 || undefined}
                            onClick={() => step(flavour, -1)}
                          >
                            <svg viewBox="0 0 20 20" aria-hidden="true"><line x1="4" y1="10" x2="16" y2="10" /></svg>
                          </button>
                          <span className="fz-stepper__n">{n}</span>
                          <button
                            type="button"
                            ref={index === 0 ? firstPlusRef : undefined}
                            aria-label={fill(t(CRATE.plus), { name: flavour.name })}
                            aria-disabled={full || undefined}
                            onClick={() => step(flavour, 1)}
                          >
                            <svg viewBox="0 0 20 20" aria-hidden="true">
                              <line x1="4" y1="10" x2="16" y2="10" />
                              <line x1="10" y1="4" x2="10" y2="16" />
                            </svg>
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="fz-pick__quick">
                  <button
                    className="fz-textbtn"
                    type="button"
                    onClick={() => {
                      setCounts(TWO_EACH);
                      setNews(t(CRATE.newsTwoEach));
                    }}
                  >
                    {t(CRATE.twoEach)}
                  </button>
                  <button
                    className="fz-textbtn"
                    type="button"
                    onClick={() => {
                      setCounts(EMPTY);
                      setNews(t(CRATE.newsEmpty));
                    }}
                  >
                    {t(CRATE.empty)}
                  </button>
                </div>
                <div className="fz-pick__put">
                  <span className="fz-sticker" style={vars({ '--fz-c': 'var(--fz-yellow)', '--fz-r': '-7deg' })}>£{CRATE_PRICE}</span>
                  <div>
                    <button
                      className="fz-btn"
                      type="button"
                      aria-disabled={!full || undefined}
                      aria-describedby="fz-pick-hint"
                      onClick={putCrateAside}
                    >
                      {t(CRATE.put)}
                    </button>
                    <p className="fz-pick__hint" id="fz-pick-hint">
                      {full ? t(CRATE.full) : fill(t(CRATE.more), { n: CRATE_SIZE - total })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="fz-zigzag" aria-hidden="true" />

        <section className="fz-section" id="fz-merch" aria-labelledby="fz-merch-title">
          <div className="fz-head">
            <h2 id="fz-merch-title">{place(t(SHOP.title), 'mark', <mark className="fz-pink">{t(SHOP.mark)}</mark>)}</h2>
            <p>{t(SHOP.note)}</p>
          </div>
          <ul className="fz-merch">
            {MERCH.map((item) => {
              const isAside = aside.includes(item.id);
              const left = item.stock !== undefined ? item.stock - (isAside ? 1 : 0) : undefined;
              const state = fill(t(item.state), { n: left ?? '' });
              return (
                <li className={`fz-item${item.stamp ? ' is-gone' : ''}`} key={item.id}>
                  <div className="fz-item__name">
                    <h3>{t(item.name)}</h3>
                    <p>{t(item.text)}</p>
                  </div>
                  <div className="fz-item__state">
                    <p>
                      {left !== undefined ? <mark>{state}</mark> : state}
                      {item.note ? <small>{t(item.note)}</small> : null}
                      {isAside ? <small className="fz-item__yours">{t(SHOP.yours)}</small> : null}
                    </p>
                    <button
                      className="fz-put"
                      type="button"
                      aria-pressed={item.soldOut ? undefined : isAside}
                      disabled={item.soldOut}
                     
                      onClick={() => toggleMerch(item)}
                    >
                      <svg viewBox="0 0 20 20" aria-hidden="true"><polyline points="4,10.5 8.5,15 16,5" /></svg>
                      {t(SHOP.put)}
                      <span className="fz-sr">{` ${t(item.name)}, £${item.price}`}</span>
                    </button>
                  </div>
                  {item.stamp ? (
                    <span className="fz-soldout">
                      <span className="fz-stamp">{t(SHOP.soldOut)}</span>
                      <s>£{item.price}</s>
                    </span>
                  ) : (
                    <span
                      className="fz-sticker"
                      style={vars({ '--fz-c': item.sticker, '--fz-r': `${item.rotate}deg`, '--fz-tc': item.stickerText ?? 'var(--fz-ink)' })}
                    >
                      £{item.price}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="fz-pickup" id="fz-pickup">
            <div className="fz-pickup__head">
              <h3 ref={listHeadRef} tabIndex={-1}>{t(SHOP.listTitle)}</h3>
              <p>{t(SHOP.totalNote)}</p>
            </div>
            <div className="fz-slip">
              {listCount === 0 ? (
                <p>{t(SHOP.listEmpty)}</p>
              ) : (
                <>
                  <ul>
                    {crates.map((crate) => {
                      const name = fill(t(SHOP.crateLine), { no: crate.no });
                      return (
                        <li key={`crate-${crate.no}`}>
                          <p className="fz-slip__name">
                            {name}
                            <small>{mixOf(crate.counts)}</small>
                          </p>
                          <span className="fz-slip__price">£{CRATE_PRICE}</span>
                          <button className="fz-textbtn" type="button" onClick={() => removeCrate(crate.no)}>
                            {t(SHOP.remove)}
                            <span className="fz-sr"> {name}</span>
                          </button>
                        </li>
                      );
                    })}
                    {merchAside.map((item) => (
                      <li key={item.id}>
                        <p className="fz-slip__name">{t(item.name)}</p>
                        <span className="fz-slip__price">£{item.price}</span>
                        <button className="fz-textbtn" type="button" onClick={() => removeMerch(item)}>
                          {t(SHOP.remove)}
                          <span className="fz-sr"> {t(item.name)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p className="fz-slip__total">
                    <span>{t(SHOP.total)}</span>
                    <b>£{listTotal}</b>
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        <div className="fz-zigzag" aria-hidden="true" />

        <section className="fz-section" id="fz-go" aria-labelledby="fz-go-title">
          <div className="fz-head">
            <h2 id="fz-go-title">{t(GO.title)}</h2>
            <p>{t(GO.note)}</p>
          </div>
          <div className="fz-go">
            <div className="fz-map" role="img" aria-label={t(GO.map)}>
              <span className="fz-road fz-road--v fz-r-hs" />
              <span className="fz-road fz-road--h fz-r-old" />
              <span className="fz-road fz-road--h fz-r-calvert" />
              <span className="fz-road fz-road--h fz-r-bgr" />
              <span className="fz-circus" />
              <svg className="fz-route fz-route--wide" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <polyline points="48,80.8 23.7,80.8 23.7,41.8 34,41.8" />
              </svg>
              <svg className="fz-route fz-route--narrow" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <polyline points="46,74.6 21.9,74.6 21.9,42.6 34,42.6" />
              </svg>
              <span className="fz-label fz-l-hs">Shoreditch High St</span>
              <span className="fz-label fz-l-old">Old St</span>
              <span className="fz-label fz-l-calvert">Calvert Ave</span>
              <span className="fz-label fz-l-bgr">Bethnal Green Rd</span>
              <span className="fz-label fz-l-circus">Arnold Circus</span>
              <span className="fz-stn" />
              <span className="fz-label fz-l-stn">Shoreditch<br />High Street</span>
              <span className="fz-pin"><svg viewBox="0 0 100 100"><polygon points={STAR} /></svg></span>
              <span className="fz-pin-label">Fizz Lab</span>
            </div>
            <div className="fz-go__text">
              <p className="fz-addr">{ADDRESS}<br />{POSTCODE}</p>
              <a className="fz-btn" href={MAPS_URL} target="_blank" rel="noreferrer">{t(GO.maps)}</a>
              <ul className="fz-ways">
                {WAYS.map((way) => (
                  <li key={way.name.en}>
                    <i className={`fz-ways__icon fz-ways__icon--${way.icon}`} style={way.color ? vars({ '--fz-k': way.color }) : undefined} aria-hidden="true" />
                    <div>
                      <h3>{t(way.name)}</h3>
                      <p>{t(way.text)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <footer className="fz-foot">
          <p>{t(FOOT.note)}</p>
          <p>{FOOT.handle}</p>
        </footer>
      </div>
    </FusionShell>
  );
}
