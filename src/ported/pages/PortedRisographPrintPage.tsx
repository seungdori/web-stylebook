import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedRisographPrintPage.css';

// The page of Duplo Press, a risograph studio in a railway arch in Bermondsey, in the
// Risograph Print style. Everything coloured on the page is printed: the studio's house
// sheet with crop and registration marks and its name overprinted in two inks, off
// register; ink drums as tint ramps screened like the press screens them; paper stocks
// with a cut chip of each sheet; a quote docket with a tear-off stub; a separation proof
// beside the file checklist; and the production week. Young Serif sets the name, headings
// and the things you order; Anonymous Pro sets everything you read, type or check.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;
type Vars = CSSProperties & Record<`--${string}`, string | number>;

const fill = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));

const count = new Intl.NumberFormat('en-GB');
const pounds = (pence: number) =>
  `£${(pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NAME = 'Duplo Press';
const EMAIL = 'hello@duplopress.co.uk';
const PHONE = '020 7946 0381';
const PHONE_HREF = 'tel:+442079460381';
const STREET = 'Arch 14, Enid Street';
const POSTCODE = 'London SE16 3RA';

const MIN_COPIES = 50;
const MAX_COPIES = 5000;
const COPY_STEP = 50;
const MAX_INKS = 4;
// Quote numbers continue from the last job the studio quoted.
const FIRST_QUOTE = 4127;

const TOP = {
  nav: { en: 'Studio sections', ko: '스튜디오 섹션', ja: 'スタジオのセクション' },
  inks: { en: 'Inks', ko: '잉크', ja: 'インク' },
  paper: { en: 'Paper', ko: '용지', ja: '用紙' },
  prices: { en: 'Prices', ko: '가격', ja: '料金' },
  files: { en: 'Files', ko: '파일', ja: 'データ' },
  pickup: { en: 'Pickup', ko: '수령', ja: '受け取り' },
  order: { en: 'Start an order', ko: '주문 시작', ja: '注文する' },
} satisfies Record<string, Tri>;

const HERO = {
  claim: { en: 'Prints from 50 copies, ready in 3 days.', ko: '50부부터 인쇄하며, 3일이면 준비됩니다.', ja: '50部から印刷し、3日で仕上がります。' },
  body: {
    en: 'We print zines, posters, cards and booklets on two Riso MZ machines in a railway arch in Bermondsey. Price your job below, send the files, then collect from the arch or have the prints sent.',
    ko: 'Bermondsey 철도 아치 작업실의 Riso MZ 기계 두 대로 진(zine), 포스터, 카드, 소책자를 인쇄합니다. 아래에서 작업 가격을 확인하고 파일을 보내 주시면, 아치에서 직접 찾아가시거나 인쇄물을 배송해 드립니다.',
    ja: 'Bermondsey の鉄道高架下の工房で、Riso MZ 2台を使い、ジン（zine）、ポスター、カード、小冊子を印刷しています。下で作業の料金を確認し、データをお送りください。高架下でお受け取りいただくか、印刷物を発送いたします。',
  },
  cta: { en: 'Price a job', ko: '작업 견적 보기', ja: '見積もりを確認' },
  slug: {
    en: 'House sheet, printed 17 November in Fluorescent Pink and Teal on Munken Pure 120 g.',
    ko: '하우스 시트, 11월 17일 인쇄. Fluorescent Pink와 Teal 잉크, Munken Pure 120 g 용지.',
    ja: 'ハウスシート。11月17日印刷。Fluorescent Pink と Teal のインク、Munken Pure 120 g 用紙。',
  },
} satisfies Record<string, Tri>;

const FACTS: Array<[Tri, Tri]> = [
  [
    { en: 'Copies', ko: '부수', ja: '部数' },
    { en: '50 to 5,000', ko: '50~5,000부', ja: '50～5,000部' },
  ],
  [
    { en: 'Sheet sizes', ko: '용지 크기', ja: '用紙サイズ' },
    { en: 'A5, A4, A3', ko: 'A5, A4, A3', ja: 'A5, A4, A3' },
  ],
  [
    { en: 'Inks', ko: '잉크', ja: 'インク' },
    { en: '14, up to 4 a job', ko: '14색, 작업당 최대 4색', ja: '14色、1件につき最大4色' },
  ],
  [
    { en: 'Open', ko: '영업시간', ja: '営業時間' },
    { en: 'Tue to Sat, 10:00 to 18:00', ko: '화~토 10:00~18:00', ja: '火～土 10:00～18:00' },
  ],
];

type InkId = 'black' | 'pink' | 'teal' | 'yellow' | 'sunflower' | 'orange' | 'red' | 'burgundy' | 'purple' | 'blue' | 'aqua' | 'green' | 'grey' | 'gold';

interface Ink {
  id: InkId;
  name: Tri;
  color: string;
  // The press lays the lightest ink down first. Lower ranks print earlier.
  rank: number;
  drum?: 1 | 2;
  out?: boolean;
  // Extra charge for the job, in pence.
  extra?: number;
}

// In the order the drums stand on the shelf.
const INKS: Ink[] = [
  { id: 'black', name: { en: 'Black', ko: 'Black', ja: 'Black' }, color: '#24242a', rank: 14 },
  { id: 'pink', name: { en: 'Fluorescent Pink', ko: 'Fluorescent Pink', ja: 'Fluorescent Pink' }, color: '#ff48b0', rank: 4, drum: 1 },
  { id: 'teal', name: { en: 'Teal', ko: 'Teal', ja: 'Teal' }, color: '#00838a', rank: 10, drum: 2 },
  { id: 'yellow', name: { en: 'Yellow', ko: 'Yellow', ja: 'Yellow' }, color: '#ffe800', rank: 1 },
  { id: 'sunflower', name: { en: 'Sunflower', ko: 'Sunflower', ja: 'Sunflower' }, color: '#ffb511', rank: 2 },
  { id: 'orange', name: { en: 'Fluorescent Orange', ko: 'Fluorescent Orange', ja: 'Fluorescent Orange' }, color: '#ff7477', rank: 3, out: true },
  { id: 'red', name: { en: 'Bright Red', ko: 'Bright Red', ja: 'Bright Red' }, color: '#f15060', rank: 6 },
  { id: 'burgundy', name: { en: 'Burgundy', ko: 'Burgundy', ja: 'Burgundy' }, color: '#914e72', rank: 12 },
  { id: 'purple', name: { en: 'Purple', ko: 'Purple', ja: 'Purple' }, color: '#765ba7', rank: 11 },
  { id: 'blue', name: { en: 'Federal Blue', ko: 'Federal Blue', ja: 'Federal Blue' }, color: '#3d5588', rank: 13 },
  { id: 'aqua', name: { en: 'Aqua', ko: 'Aqua', ja: 'Aqua' }, color: '#5ec8e5', rank: 5 },
  { id: 'green', name: { en: 'Green', ko: 'Green', ja: 'Green' }, color: '#00a95c', rank: 9 },
  { id: 'grey', name: { en: 'Light Grey', ko: 'Light Grey', ja: 'Light Grey' }, color: '#88898a', rank: 8 },
  { id: 'gold', name: { en: 'Metallic Gold', ko: 'Metallic Gold', ja: 'Metallic Gold' }, color: '#ac936e', rank: 7, extra: 1000 },
];

const inkById = (id: InkId) => INKS.find((ink) => ink.id === id) ?? INKS[0];

const DRUMS = {
  title: { en: 'Ink drums', ko: '잉크 드럼', ja: 'インクドラム' },
  note: {
    en: 'Every ink is its own drum and its own pass through the machine. Use up to four in one job. Fluorescent Pink and Teal are in the machine today, so jobs in those two can start first.',
    ko: '잉크마다 드럼이 따로 있고, 기계에서도 색마다 한 번씩 따로 통과합니다. 작업 하나에는 최대 4색까지 쓸 수 있습니다. Fluorescent Pink와 Teal은 지금 기계에 걸려 있으므로, 이 두 색을 쓰는 작업부터 먼저 시작할 수 있습니다.',
    ja: 'インクはそれぞれ独立したドラムで、機械にも色ごとに1回ずつ通します。1件の作業で使えるのは最大4色です。Fluorescent Pink と Teal は現在機械にセットされているため、この2色を使う作業は先に始められます。',
  },
  drum: { en: 'Drum {n} today', ko: '오늘 {n}번 드럼', ja: '本日 {n}番ドラム' },
  out: { en: 'Back on 2 December', ko: '12월 2일 재입고', ja: '12月2日に再入荷' },
  extra: { en: '£10 extra a job', ko: '작업당 £10 추가', ja: '1件につき £10 追加' },
} satisfies Record<string, Tri>;

type PaperId = 'munken120' | 'munken300' | 'cyclus' | 'candy' | 'mist' | 'citrine' | 'kraft';

interface Paper {
  id: PaperId;
  name: Tri;
  // The name in the paper menu, short enough for a phone.
  short?: string;
  weight: string;
  colour: Tri;
  use: Tri;
  // Price of one sheet in pence.
  a4: number;
  a3: number;
  chip: string;
  cut?: 'thick' | 'fleck' | 'kraft';
}

const PAPERS: Paper[] = [
  {
    id: 'munken120',
    name: { en: 'Munken Pure', ko: 'Munken Pure', ja: 'Munken Pure' },
    weight: '120 g',
    colour: { en: 'Natural white', ko: '내추럴 화이트', ja: 'ナチュラルホワイト' },
    use: { en: 'Zines, posters', ko: '진, 포스터', ja: 'ジン、ポスター' },
    a4: 9,
    a3: 18,
    chip: '#f8f4e9',
  },
  {
    id: 'munken300',
    name: { en: 'Munken Pure', ko: 'Munken Pure', ja: 'Munken Pure' },
    weight: '300 g',
    colour: { en: 'Natural white', ko: '내추럴 화이트', ja: 'ナチュラルホワイト' },
    use: { en: 'Covers, postcards', ko: '표지, 엽서', ja: '表紙、ポストカード' },
    a4: 22,
    a3: 44,
    chip: '#f8f4e9',
    cut: 'thick',
  },
  {
    id: 'cyclus',
    name: { en: 'Cyclus Offset, recycled', ko: 'Cyclus Offset, 재생지', ja: 'Cyclus Offset, 再生紙' },
    short: 'Cyclus Offset',
    weight: '115 g',
    colour: { en: 'Grey white', ko: '회백색', ja: 'グレーホワイト' },
    use: { en: 'Flyers, newsletters', ko: '전단, 소식지', ja: 'チラシ、ニュースレター' },
    a4: 7,
    a3: 14,
    chip: '#e9e7df',
    cut: 'fleck',
  },
  {
    id: 'candy',
    name: { en: 'Colorplan Candy Pink', ko: 'Colorplan Candy Pink', ja: 'Colorplan Candy Pink' },
    weight: '270 g',
    colour: { en: 'Pale pink', ko: '연분홍', ja: '淡いピンク' },
    use: { en: 'Cards, invitations', ko: '카드, 청첩장', ja: 'カード、招待状' },
    a4: 31,
    a3: 62,
    chip: '#f3c9d3',
    cut: 'thick',
  },
  {
    id: 'mist',
    name: { en: 'Colorplan Mist', ko: 'Colorplan Mist', ja: 'Colorplan Mist' },
    weight: '270 g',
    colour: { en: 'Pale grey green', ko: '연한 회녹색', ja: '淡い灰緑色' },
    use: { en: 'Cards, covers', ko: '카드, 표지', ja: 'カード、表紙' },
    a4: 31,
    a3: 62,
    chip: '#d2dbd5',
    cut: 'thick',
  },
  {
    id: 'citrine',
    name: { en: 'Colorplan Citrine', ko: 'Colorplan Citrine', ja: 'Colorplan Citrine' },
    weight: '135 g',
    colour: { en: 'Bright yellow', ko: '선명한 노랑', ja: '鮮やかな黄色' },
    use: { en: 'Posters, inserts', ko: '포스터, 끼움지', ja: 'ポスター、挟み込み' },
    a4: 19,
    a3: 38,
    chip: '#f1d64c',
  },
  {
    id: 'kraft',
    name: { en: 'Brown kraft', ko: '갈색 크라프트지', ja: 'ブラウンクラフト紙' },
    weight: '140 g',
    colour: { en: 'Brown', ko: '갈색', ja: '茶色' },
    use: { en: 'Tags, wrapping', ko: '태그, 포장', ja: 'タグ、包装' },
    a4: 12,
    a3: 24,
    chip: '#bb8f60',
    cut: 'kraft',
  },
];

const PAPER_COPY = {
  title: { en: 'Paper', ko: '용지', ja: '用紙' },
  note: {
    en: 'All uncoated, because riso ink dries by soaking into the sheet. Prices are per sheet and go on top of the printing. You can bring your own paper from 80 to 300 g for a £10 handling charge.',
    ko: '모두 코팅되지 않은 용지입니다. 리소 잉크는 종이 속으로 스며들어 마르기 때문입니다. 가격은 장당이며 인쇄 요금과 별도입니다. 직접 가져오신 80~300 g 용지는 £10 취급 수수료로 인쇄해 드립니다.',
    ja: 'すべて非コート紙です。リソインクは紙に染み込んで乾くためです。価格は1枚あたりで、印刷料金に加算されます。80～300 gの持ち込み用紙は、取り扱い料£10で印刷できます。',
  },
  caption: { en: 'Paper stocks and their price per sheet', ko: '용지 종류와 장당 가격', ja: '用紙の種類と1枚あたりの価格' },
  paper: { en: 'Paper', ko: '용지', ja: '用紙' },
  weight: { en: 'Weight', ko: '평량', ja: '坪量' },
  colour: { en: 'Colour', ko: '색', ja: '色' },
  use: { en: 'Good for', ko: '용도', ja: '用途' },
  a4: { en: 'A4 sheet', ko: 'A4 장당', ja: 'A4 1枚' },
  a3: { en: 'A3 sheet', ko: 'A3 장당', ja: 'A3 1枚' },
} satisfies Record<string, Tri>;

type Size = 'A5' | 'A4' | 'A3';
const SIZES: Size[] = ['A5', 'A4', 'A3'];
type PaperChoice = PaperId | 'own';

const PRICE = {
  title: { en: 'Price a job', ko: '작업 견적 보기', ja: '見積もりを確認' },
  note: {
    en: 'The price covers masters, ink, paper and trimming to size. Ink colour does not change it, apart from Metallic Gold. From 1,000 copies the printing rate drops.',
    ko: '가격에는 마스터 제판, 잉크, 용지, 크기에 맞춘 재단이 포함됩니다. 잉크 색은 가격을 바꾸지 않지만 Metallic Gold는 예외입니다. 1,000부부터는 인쇄 단가가 내려갑니다.',
    ja: '料金には、マスター製版、インク、用紙、サイズに合わせた裁断が含まれます。インクの色では料金は変わりませんが、Metallic Gold のみ別途加算されます。1,000部からは印刷単価が下がります。',
  },
  size: { en: 'Sheet size', ko: '용지 크기', ja: '用紙サイズ' },
  copies: { en: 'Copies', ko: '부수', ja: '部数' },
  fewer: { en: '− 50 copies', ko: '− 50부', ja: '− 50部' },
  more: { en: '+ 50 copies', ko: '+ 50부', ja: '+ 50部' },
  copiesNote: { en: '50 to 5,000. The buttons move in steps of 50.', ko: '50~5,000부. 버튼은 50부 단위로 움직입니다.', ja: '50～5,000部。ボタンは50部ずつ増減します。' },
  copiesMin: { en: 'The minimum is 50 copies, so the job is set to 50.', ko: '최소 주문은 50부이므로 50부로 맞췄습니다.', ja: '最小注文は50部のため、50部に設定しました。' },
  copiesMax: { en: '5,000 is the most for one job. For more, email us.', ko: '1건당 최대는 5,000부입니다. 그 이상은 이메일로 문의해 주세요.', ja: '1件の最大は5,000部です。それ以上は、メールでお問い合わせください。' },
  inks: { en: 'Inks', ko: '잉크', ja: 'インク' },
  inksNote: {
    en: 'Up to four. We print the lightest ink first, and the numbers show the order.',
    ko: '최대 4색입니다. 가장 밝은 잉크부터 인쇄하며, 숫자가 인쇄 순서입니다.',
    ja: '最大4色です。明るい色から印刷し、数字が印刷順を示します。',
  },
  printed: { en: 'printing order', ko: '인쇄 순서', ja: '印刷順' },
  moreInks: { en: '{n} more inks', ko: '잉크 {n}색 더 보기', ja: 'ほかのインク {n}色' },
  fewerInks: { en: 'Fewer inks', ko: '잉크 접기', ja: 'インクを閉じる' },
  inksMax: {
    en: 'Four inks is the most for one job. Take one off to add {ink}.',
    ko: '작업 하나에는 최대 4색입니다. {ink} 추가 전에 한 색을 빼 주세요.',
    ja: '1件に使えるのは最大4色です。{ink}を追加するには、1色外してください。',
  },
  inksMin: { en: 'A job needs at least one ink.', ko: '작업에는 최소 한 색이 필요합니다.', ja: '1件には少なくとも1色が必要です。' },
  sides: { en: 'Printed on', ko: '인쇄 면', ja: '印刷面' },
  oneSide: { en: 'One side', ko: '한 면', ja: '片面' },
  bothSides: { en: 'Both sides', ko: '양면', ja: '両面' },
  paper: { en: 'Paper', ko: '용지', ja: '用紙' },
  own: { en: 'Your own paper', ko: '직접 가져온 용지', ja: '持ち込み用紙' },
} satisfies Record<string, Tri>;

const RATES: Array<[Tri, Tri]> = [
  [
    { en: 'Masters', ko: '마스터 제판', ja: 'マスター製版' },
    { en: '£8.00 per ink, per side', ko: '잉크 1색, 면당 £8.00', ja: 'インク1色・片面につき £8.00' },
  ],
  [
    { en: 'Printing', ko: '인쇄', ja: '印刷' },
    { en: '5p per A4 sheet, 8p per A3 sheet, per ink', ko: 'A4 장당 5p, A3 장당 8p, 잉크 1색당', ja: 'A4 1枚 5p、A3 1枚 8p、インク1色につき' },
  ],
  [
    { en: 'From 1,000', ko: '1,000부부터', ja: '1,000部から' },
    { en: '3p per A4 sheet, 5p per A3 sheet, per ink', ko: 'A4 장당 3p, A3 장당 5p, 잉크 1색당', ja: 'A4 1枚 3p、A3 1枚 5p、インク1色につき' },
  ],
  [
    { en: 'A5', ko: 'A5', ja: 'A5' },
    { en: 'printed two to an A4 sheet, then trimmed', ko: 'A4 한 장에 두 부씩 인쇄한 뒤 재단', ja: 'A4用紙1枚に2部ずつ印刷してから裁断' },
  ],
  [
    { en: 'Paper', ko: '용지', ja: '用紙' },
    { en: 'per sheet, from the list above', ko: '장당, 위 목록 기준', ja: '1枚あたり、上の一覧の価格' },
  ],
];

const INK_COUNT: Record<number, Tri> = {
  1: { en: 'one ink', ko: '1색', ja: '1色' },
  2: { en: 'two inks', ko: '2색', ja: '2色' },
  3: { en: 'three inks', ko: '3색', ja: '3色' },
  4: { en: 'four inks', ko: '4색', ja: '4色' },
};

const DOCKET = {
  title: { en: 'Your quote', ko: '견적서', ja: '見積書' },
  summary: { en: '{copies} copies, {size}, {inks}, {sides}, {paper}', ko: '{copies}부, {size}, {inks}, {sides}, {paper}', ja: '{copies}部、{size}、{inks}、{sides}、{paper}' },
  oneSide: { en: 'one side', ko: '한 면', ja: '片面' },
  bothSides: { en: 'both sides', ko: '양면', ja: '両面' },
  ownPaper: { en: 'your own paper', ko: '직접 가져온 용지', ja: '持ち込み用紙' },
  order: { en: 'Printing order', ko: '인쇄 순서', ja: '印刷順' },
  masters: { en: 'Masters', ko: '마스터 제판', ja: 'マスター製版' },
  master: { en: '1 master at £8.00', ko: '마스터 1개, 개당 £8.00', ja: 'マスター1枚、1枚あたり £8.00' },
  mastersN: { en: '{n} masters at £8.00', ko: '마스터 {n}개, 개당 £8.00', ja: 'マスター{n}枚、1枚あたり £8.00' },
  printing: { en: 'Printing', ko: '인쇄', ja: '印刷' },
  passes: { en: '{n} passes at {rate}p', ko: '{n}회 인쇄, 회당 {rate}p', ja: '{n}回の刷り、1回あたり{rate}p' },
  paper: { en: 'Paper', ko: '용지', ja: '用紙' },
  sheets: { en: '{n} {size} sheets at {price}p', ko: '{size} 용지 {n}장, 장당 {price}p', ja: '{size}用紙 {n}枚、1枚あたり{price}p' },
  handling: { en: 'Handling your own paper', ko: '직접 가져온 용지 취급', ja: '持ち込み用紙の取り扱い' },
  gold: { en: 'Metallic Gold', ko: 'Metallic Gold', ja: 'Metallic Gold' },
  goldNote: { en: 'extra for the job', ko: '작업 추가 요금', ja: '作業の追加料金' },
  trim: { en: 'Trimming and packing', ko: '재단과 포장', ja: '裁断と梱包' },
  free: { en: 'Free', ko: '무료', ja: '無料' },
  subtotal: { en: 'Subtotal', ko: '소계', ja: '小計' },
  vat: { en: 'VAT at 20%', ko: '부가세 20%', ja: '付加価値税（VAT）20%' },
  total: { en: 'Total', ko: '합계', ja: '合計' },
  eachPence: { en: 'About {n}p a copy.', ko: '1부당 약 {n}p입니다.', ja: '1部あたり約{n}pです。' },
  eachPounds: { en: 'About {n} a copy.', ko: '1부당 약 {n}입니다.', ja: '1部あたり約{n}です。' },
  ready: {
    en: 'Ready {day} if your files reach us by 12:00 on Monday 23 November.',
    ko: '파일이 11월 23일 월요일 12:00까지 도착하면 {day}에 준비됩니다.',
    ja: 'ファイルが11月23日(月)12:00までに届けば、{day}に仕上がります。',
  },
  cta: { en: 'Order this job', ko: '이 작업 주문하기', ja: 'この作業を注文する' },
  live: { en: 'Quote updated: {total} for {copies} copies.', ko: '견적 갱신: {copies}부 기준 {total}', ja: '見積もりを更新：{copies}部、{total}' },
} satisfies Record<string, Tri>;

// Two passes a sheet (two inks, or one ink on both sides) take the three days. Every two
// passes more add a day, and the studio prints on Saturdays.
const READY_DAYS: Tri[] = [
  { en: 'Thursday 26 November', ko: '11월 26일 목요일', ja: '11月26日(木)' },
  { en: 'Friday 27 November', ko: '11월 27일 금요일', ja: '11月27日(金)' },
  { en: 'Saturday 28 November', ko: '11월 28일 토요일', ja: '11月28日(土)' },
  { en: 'Tuesday 1 December', ko: '12월 1일 화요일', ja: '12月1日(火)' },
];

const STEPS: Array<{ title: Tri; body: Tri; files?: string[] }> = [
  {
    title: { en: 'One file per ink', ko: '잉크마다 파일 하나', ja: 'インクごとに1ファイル' },
    body: {
      en: 'Put everything that prints in pink on one page and everything in teal on another. Name them after the ink:',
      ko: '분홍 잉크로 인쇄될 요소는 한 페이지에, Teal로 인쇄될 요소는 다른 페이지에 모아 주세요. 파일 이름은 잉크 이름으로 지어 주세요:',
      ja: 'ピンクで印刷するものは1ページに、Tealで印刷するものは別のページにまとめてください。ファイル名はインク名にしてください：',
    },
    files: ['poster_pink.pdf', 'poster_teal.pdf'],
  },
  {
    title: { en: 'Black and grey only', ko: '검정과 회색만', ja: '黒とグレーだけ' },
    body: {
      en: '100% black prints the ink at full strength, and 40% grey prints a 40% tint of it. Convert photos to greyscale before you place them.',
      ko: '100% 검정은 잉크를 전부 찍고, 40% 회색은 그 잉크의 40% 망점으로 찍습니다. 사진은 배치하기 전에 흑백으로 바꿔 주세요.',
      ja: '100%の黒はインクを100%の濃さで刷り、40%のグレーはその40%の網点で刷ります。写真は配置する前にグレースケールに変換してください。',
    },
  },
  {
    title: { en: 'Keep 5 mm clear at every edge', ko: '가장자리 5 mm 비우기', ja: '端から5 mmは空ける' },
    body: {
      en: 'The drum cannot print to the edge of the sheet. For prints that run off the edge, add 3 mm bleed: we print on the next size up and trim, priced as the larger sheet.',
      ko: '드럼은 용지 가장자리까지 인쇄할 수 없습니다. 가장자리를 넘어가는 인쇄물에는 3 mm 블리드를 더해 주세요. 한 단계 큰 용지에 인쇄한 뒤 재단하며, 큰 용지 가격으로 계산합니다.',
      ja: 'ドラムは用紙の端まで印刷できません。端を越える印刷物には3 mmのブリードを追加してください。ひと回り大きいサイズに印刷して裁断し、大きい用紙の料金で計算します。',
    },
  },
  {
    title: { en: 'Large solids at 85%', ko: '큰 면은 85%로', ja: '広い面は85%で' },
    body: {
      en: 'Big areas of full ink pick up roller marks and can rub onto the next sheet. Set them to 85% grey and they print evenly.',
      ko: '넓은 면을 100% 잉크로 채우면 롤러 자국이 남고 다음 장에 묻을 수 있습니다. 85% 회색으로 설정하면 고르게 인쇄됩니다.',
      ja: '100%インクの広い面にはローラーの跡が残り、次の用紙に移ることがあります。85%のグレーに設定すると、均一に印刷されます。',
    },
  },
  {
    title: { en: 'Export a flat PDF', ko: '평면 PDF로 내보내기', ja: 'フラットなPDFで書き出す' },
    body: {
      en: 'At the final size, fonts embedded, images at 600 dpi. Leave crop marks off; we add our own.',
      ko: '최종 크기로, 글꼴은 포함하고, 이미지는 600 dpi로 설정해 주세요. 트림 마크는 빼 주세요. 저희가 직접 넣습니다.',
      ja: '仕上がりサイズで、フォントを埋め込み、画像は600 dpiにしてください。トンボは付けないでください。こちらで付けます。',
    },
  },
  {
    title: { en: 'Approve the proof', ko: '교정본 승인', ja: '校正の承認' },
    body: {
      en: 'Within one working day we email a photo of the first sheet off each drum. Printing starts when you reply OK.',
      ko: '영업일 하루 안에 드럼마다 찍은 첫 장의 사진을 이메일로 보내 드립니다. OK라고 회신해 주시면 인쇄를 시작합니다.',
      ja: '営業日1日以内に、各ドラムの最初の1枚の写真をメールでお送りします。OKとご返信いただいてから印刷を開始します。',
    },
  },
];

const FILES = {
  title: { en: 'Preparing your files', ko: '파일 준비', ja: 'データの準備' },
  note: {
    en: 'Send a PDF for each ink. We check every file before printing and tell you the same day if something needs changing.',
    ko: '잉크마다 PDF 한 개를 보내 주세요. 인쇄 전에 모든 파일을 확인하고, 수정이 필요하면 당일에 알려 드립니다.',
    ja: 'インクごとにPDFを1つ送ってください。印刷前にすべてのファイルを確認し、修正が必要な場合は当日にお知らせします。',
  },
  proof: { en: 'Example: two ink files and the print they make', ko: '예시: 잉크 파일 두 개와 그 인쇄물', ja: '例：インクのファイル2つと、その印刷結果' },
  both: { en: 'The print, both inks', ko: '인쇄물, 두 잉크', ja: '印刷物（2色）' },
} satisfies Record<string, Tri>;

const ORDER = {
  title: { en: 'Start an order', ko: '주문 시작', ja: '注文する' },
  note: {
    en: 'Send your name, an email and a link to the files. We check them the same day and email a photo of the proof. Nothing is printed or charged until you reply OK.',
    ko: '이름, 이메일, 파일 링크를 보내 주세요. 당일 확인한 뒤 교정 사진을 이메일로 보내 드립니다. OK라고 회신하기 전까지는 인쇄하거나 요금을 청구하지 않습니다.',
    ja: 'お名前、メールアドレス、データのリンクをお送りください。当日中に確認し、校正の写真をメールでお送りします。OKとご返信いただくまで、印刷も請求も行いません。',
  },
  job: { en: 'The job', ko: '작업 내용', ja: '作業内容' },
  quote: { en: 'Quote', ko: '견적', ja: '見積もり' },
  ready: { en: 'Ready', ko: '완료 예정', ja: '完成予定' },
  change: { en: 'Change the job', ko: '작업 내용 변경', ja: '作業内容を変更' },
  name: { en: 'Your name', ko: '이름', ja: 'お名前' },
  email: { en: 'Email', ko: '이메일', ja: 'メールアドレス' },
  link: { en: 'Link to your files', ko: '파일 링크', ja: 'データのリンク' },
  linkHint: {
    en: 'A WeTransfer, Dropbox or Google Drive link to one PDF per ink.',
    ko: 'WeTransfer, Dropbox 또는 Google Drive 링크. 잉크마다 PDF 한 개씩.',
    ja: 'WeTransfer、Dropbox、Google Drive のリンク。インクごとに PDF を1つ。',
  },
  nameError: { en: 'Write the name for the order.', ko: '주문자 이름을 입력해 주세요.', ja: '注文のお名前を入力してください。' },
  emailError: {
    en: 'Check the email address. It needs an @ and a domain.',
    ko: '이메일 주소를 확인해 주세요. @와 도메인이 필요합니다.',
    ja: 'メールアドレスをご確認ください。@とドメインが必要です。',
  },
  linkError: {
    en: 'Paste the full link to your files, starting with https://.',
    ko: '파일이 있는 링크 전체를 붙여 넣어 주세요. https://로 시작해야 합니다.',
    ja: 'データのリンク全体を貼り付けてください。https://で始まる必要があります。',
  },
  send: { en: 'Send the order, {total}', ko: '주문 보내기, {total}', ja: '注文を送信、{total}' },
  pay: { en: 'You pay when you approve the proof.', ko: '교정을 승인하실 때 결제하시면 됩니다.', ja: '校正を承認されたときに決済となります。' },
  doneTitle: { en: 'Order {quote} is in', ko: '주문 {quote}이 접수되었습니다', ja: '注文 {quote} を受け付けました' },
  doneJob: { en: 'Quote {quote}: {summary}, {total}.', ko: '견적 {quote}: {summary}, {total}.', ja: '見積もり {quote}：{summary}、{total}。' },
  doneBody: {
    en: 'We check the files at {link} and email a proof photo to {email} by 17:00 on Monday 23 November. Nothing prints until you reply OK.',
    ko: '{link}에 있는 파일을 확인한 뒤, 11월 23일 월요일 17:00까지 교정 사진을 {email} 주소로 보내 드리겠습니다. OK 회신을 주시기 전에는 인쇄하지 않습니다.',
    ja: '{link} のデータを確認し、11月23日(月)17:00までに校正の写真を {email} にお送りします。OKのご返信があるまで印刷はしません。',
  },
  again: { en: 'Start another order', ko: '다른 주문 하기', ja: '別の注文をする' },
} satisfies Record<string, Tri>;

const WEEK = {
  title: { en: 'Turnaround and pickup', ko: '완료와 수령', ja: '仕上がりと受け取り' },
  note: {
    en: 'Three working days from the day your files arrive, for two passes a sheet. Every two passes more add a day. Rush jobs up to 300 copies can be ready the next working day for 50% more, when a drum is free.',
    ko: '파일이 도착한 날부터 3영업일이며, 기준은 한 장당 2패스입니다. 패스가 두 번 늘어날 때마다 하루가 더 걸립니다. 300부 이하 긴급 작업은 드럼이 비어 있을 때 50% 추가 요금으로 다음 영업일에 준비됩니다.',
    ja: 'ファイルが届いた日から3営業日です（1枚あたり2パスが基準）。パスが2回増えるごとに1日加わります。300部までの特急作業は、ドラムが空いていれば50%増しで翌営業日に仕上がります。',
  },
  week: { en: 'A two-ink job, files in on Monday', ko: '2색 작업, 월요일에 파일 도착', ja: '2色の作業、月曜日にデータ到着' },
  collect: { en: 'Collect from the arch', ko: '아치에서 직접 수령', ja: '高架下で受け取り' },
  collectBody: {
    en: "Tuesday to Saturday, 10:00 to 18:00. Five minutes' walk from Bermondsey station. Ring the bell beside the shutter.",
    ko: '화~토 10:00~18:00. Bermondsey역에서 도보 5분. 셔터 옆 벨을 눌러 주세요.',
    ja: '火～土 10:00～18:00。Bermondsey駅から徒歩5分。シャッター横のベルを鳴らしてください。',
  },
  options: { en: 'Ways to get your prints', ko: '수령 방법', ja: '受け取り方法' },
} satisfies Record<string, Tri>;

const DAYS: Array<{ day: Tri; date: Tri; body: Tri; done: number }> = [
  {
    day: { en: 'Monday', ko: '월요일', ja: '月曜日' },
    date: { en: '23 November', ko: '11월 23일', ja: '11月23日' },
    body: { en: 'Files in by 12:00. We check them and email a proof photo by 17:00.', ko: '12:00까지 파일 도착. 확인 후 17:00까지 교정 사진을 보내 드립니다.', ja: '12:00までにデータ到着。確認し、17:00までに校正の写真をお送りします。' },
    done: 25,
  },
  {
    day: { en: 'Tuesday', ko: '화요일', ja: '火曜日' },
    date: { en: '24 November', ko: '11월 24일', ja: '11月24日' },
    body: { en: 'Masters made and the first ink printed. The sheets dry overnight.', ko: '마스터를 만들고 첫 잉크를 인쇄합니다. 인쇄물은 밤새 건조합니다.', ja: 'マスターを作り、最初のインクを印刷します。用紙は一晩乾かします。' },
    done: 50,
  },
  {
    day: { en: 'Wednesday', ko: '수요일', ja: '水曜日' },
    date: { en: '25 November', ko: '11월 25일', ja: '11月25日' },
    body: { en: 'The second ink, or the back of the sheet, goes onto the dry stack.', ko: '두 번째 잉크, 또는 용지 뒷면을 건조 적재대에 올립니다.', ja: '2色目のインク、または用紙の裏面を、乾燥用の積み重ね台に置きます。' },
    done: 75,
  },
  {
    day: { en: 'Thursday', ko: '목요일', ja: '木曜日' },
    date: { en: '26 November, from 14:00', ko: '11월 26일 14:00부터', ja: '11月26日 14:00から' },
    body: { en: 'Trimmed, counted and packed. Ready to collect or to send.', ko: '재단하고 세어서 포장합니다. 수령하시거나 발송할 준비가 됩니다.', ja: '裁断し、数えて梱包します。受け取りまたは発送の準備ができます。' },
    done: 100,
  },
];

const OPTIONS: Array<{ name: Tri; note?: Tri; price: Tri }> = [
  {
    name: { en: 'Collect from the arch', ko: '아치에서 직접 수령', ja: '高架下で受け取り' },
    price: { en: 'Free', ko: '무료', ja: '無料' },
  },
  {
    name: { en: 'Bike courier in London', ko: '런던 자전거 배송', ja: 'ロンドン市内のバイク便' },
    note: { en: 'Same day, booked by 15:00', ko: '당일 배송, 15:00까지 예약', ja: '当日配送、15:00までの予約' },
    price: { en: '£14.00', ko: '£14.00', ja: '£14.00' },
  },
  {
    name: { en: 'Courier, UK mainland', ko: '택배, 영국 본토', ja: '宅配便、英国本土' },
    note: { en: 'Next working day, up to 10 kg', ko: '영업일 다음 날 도착, 10 kg 이하', ja: '翌営業日配達、10 kgまで' },
    price: { en: '£9.50', ko: '£9.50', ja: '£9.50' },
  },
  {
    name: { en: 'Rush job', ko: '긴급 작업', ja: '特急作業' },
    note: { en: 'Ready next working day, up to 300 copies', ko: '다음 영업일 준비, 300부 이하', ja: '翌営業日に仕上がり、300部まで' },
    price: { en: '+50%', ko: '+50%', ja: '+50%' },
  },
];

const FOOT = {
  made: { en: 'Printed in Bermondsey on two Riso MZ machines', ko: 'Bermondsey에서 Riso MZ 2대로 인쇄', ja: 'Bermondsey で Riso MZ 2台を使って印刷' },
} satisfies Record<string, Tri>;

const PROMPT_EN = `Design one real page in Risograph Print style: spot inks on uncoated paper, printed one drum at a time, a little off register.

Pick a believable subject that lives in print, such as a riso studio, a zine library, a small-press publisher or a screen-print workshop, and write its real content. The page must read as that subject's page, never as a page about its own style.

COLOR TOKENS:
--paper: #f5f0e8 (the page, under a fine paper grain)
--slip: #fdfaf4 (the quote docket, fields)
--ink: #2c3e50 (text, rules, buttons)
--muted: #55606d
--line: rgba(44, 62, 80, 0.36)
Spot inks, used only as ink:
--pink: #ff48b0 (Fluorescent Pink)
--teal: #00838a
--yellow: #ffe800
The ink drum list adds the rest of the studio's inks, each once: #24242a black, #ffb511, #ff7477, #f15060, #914e72, #765ba7, #3d5588, #5ec8e5, #00a95c, #88898a, #ac936e. Paper chips are the colours of their sheets, with brown flecks or fibre on the recycled and kraft stock. Separation files are drawn in near-black and grey on white. The ink at low opacity draws chip and plate edges and the flat offset shadows. No other colours: text is ink or muted, slip on a filled button; hovers move a button into its pink shadow, underline a toggle or darken an outline; errors are ink text beside a pink square and a pink offset under the field.

THE PRINT:
- Solid ink carries a speckle: an SVG feTurbulence mask knocks small holes out of every solid. Tints are screened: two offset radial-gradient dot grids at 45 degrees, the dot radius sets the tint (100, 70, 45, 25, 10%).
- Overprint: the studio name is set twice, teal underneath and pink on top with mix-blend-mode: multiply, the pink shifted 5px left and 3px up (3px and 2px on phones). Where the two inks cross they darken. The quote total is printed the same way.
- The hero is the studio's own house sheet: a 2px ink trim, crop marks in the margin, registration targets at mid height, and three shapes in three inks behind the type (a screened pink circle, a solid teal disc, a solid yellow band), all multiplied.
- Buttons are ink with a 4px pink offset shadow, like a second colour printed off register.

TYPOGRAPHY:
Display: Young Serif 400, its one weight, for the studio name, headings, the claim, ink and paper names, field labels, step numbers, days and the total.
- Studio name clamp(4.1rem, 14.6vw, 11.6rem), line-height 0.88, tracking -0.035em; 22vw on phones
- h2 clamp(2.25rem, 4.6vw, 3.75rem), line-height 1, tracking -0.025em
- Claim clamp(1.6rem, 2.7vw, 2.2rem), line-height 1.12; h3 1.5rem; names and field labels 1.1875rem; total clamp(2.25rem, 5vw, 3.9rem)
Text: Anonymous Pro 400 and 700, 1.125rem, line-height 1.55, for everything you read, type or check: prices, counts, sizes, file names, notes at 1rem. Tabular figures. No text under 16px. font-synthesis: none.

LAYOUT:
- Studio bar: the name with two overprinted circles, five section links, a "Start an order" button. Links hide under 960px.
- Hero: the house sheet on a 12-column grid. The name across the top, the claim and one paragraph under it on the left, a ruled facts list on the right; a one-line slug under the trim says what the sheet was printed in.
- Ink drums: a ruled two-column list (one column under 960px), each ink as a five-step tint ramp, its name and its state ("Drum 1 today" in an ink box, back-in-stock date, surcharge).
- Paper: a ruled table with a cut chip of each sheet (thicker stock shows its edge, recycled shows flecks, kraft shows fibre). Under 761px each row stacks with its labels.
- Price a job: the form on the left (7 columns), the quote docket on the right (5 columns) with a dashed tear-off line above the total. Under 960px the docket follows the form.
- Files: a numbered checklist beside a separation proof (two black-and-grey files and the two-ink print they make).
- Start an order: the current job beside a short form.
- Turnaround: the production week in four columns, each with a bar filling in pink; the pickup address beside a ruled delivery table.
- Max width 1120px, sections about 128px apart (96px on phones), square corners everywhere, 2px ink rules over lists, 1px lines between rows.

COMPONENTS:
- Segmented toggles (sheet size, sides): a 2px ink frame, 2px ink dividers, the chosen one filled ink.
- Copies stepper: one 2px ink frame holding −, a typed number field and +. The buttons move in steps of 50 between 50 and 5,000; a typed value outside that range is set back to the nearest limit with a note.
- Ink picker: toggle buttons with a speckled chip of the ink and a 1px outline of the ink at 60%; chosen ones get a 2px ink frame and a numbered ink square for their printing order (lightest ink first); out-of-stock inks are disabled and say when they are back; a fifth ink is refused with a note.
- Paper: a native select in a 2px ink frame.
- Quote docket: slip paper, 2px ink frame, a 6px ink shadow at 14%, the inks overprinted as circles in the corner, line items in a ruled list, the total overprinted.
- Form: visible labels, square 2px fields, errors next to the field, a confirmation with the quote number that takes the form's place.

MOTION:
- None. A button moves 2px into its shadow on hover, without a transition.

FORBIDDEN:
- Cards, pills, rounded corners, soft drop shadows, gradients used as colour
- A small label above a heading, all-caps tracked labels
- Palette swatches with hex codes, type specimen or principles sections
- Pink or teal reading text (only the overprinted name and total are set in the spot inks)
- Figurative illustration, halftone photos of people, emoji
- A page about its own style

OUTPUT:
1) CSS custom properties for the tokens, the speckle mask and the dot screen
2) Semantic HTML and CSS
3) Responsive layout down to 320px with no horizontal scroll
4) Working controls: a live price calculator (size, copies, up to four inks, sides, paper) with its line items, and a validated order form that confirms with a quote number; visible focus`;

const PROMPT_KO = `리소 프린트 스타일의 실제 페이지 하나를 디자인한다. 무코팅 용지에 별색 잉크를 쓰고, 드럼을 하나씩 돌려 인쇄하며, 판 맞춤이 살짝 어긋난 느낌이어야 한다.

인쇄물 안에 존재하는 그럴듯한 주제를 고른다. 예: 리소 스튜디오, 진(zine) 도서관, 소형 출판사, 실크스크린 공방. 그 주제의 실제 콘텐츠를 쓴다. 페이지는 스타일에 관한 페이지가 아니라, 그 주제의 페이지로 읽혀야 한다.

COLOR TOKENS:
--paper: #f5f0e8 (미세한 종이 결이 있는 페이지 바탕)
--slip: #fdfaf4 (견적서 용지, 입력 칸)
--ink: #2c3e50 (본문, 선, 버튼)
--muted: #55606d
--line: rgba(44, 62, 80, 0.36)
별색 잉크, 잉크로만 사용:
--pink: #ff48b0 (Fluorescent Pink)
--teal: #00838a
--yellow: #ffe800
잉크 드럼 목록에는 스튜디오의 나머지 잉크가 한 번씩 더 들어간다: #24242a black, #ffb511, #ff7477, #f15060, #914e72, #765ba7, #3d5588, #5ec8e5, #00a95c, #88898a, #ac936e. 용지 칩은 해당 용지의 색으로 하고, 재생지와 크래프트지에는 갈색 얼룩이나 섬유 결을 넣는다. 분해 파일은 흰 바탕에 검정과 회색으로 그린다. 낮은 불투명도의 잉크로 칩과 판의 가장자리, 평면적인 오프셋 그림자를 그린다. 그 밖의 색은 쓰지 않는다. 본문은 잉크 색 또는 muted 색이고, 채워진 버튼 위에서는 slip 색을 쓴다. 호버에서는 버튼이 분홍 그림자 쪽으로 옮겨 가고, 토글은 밑줄이 생기며, 테두리 버튼은 테두리가 진해진다. 오류는 분홍 사각형 옆의 잉크 색 글자로 표시하고, 입력 칸 아래에 분홍 오프셋을 둔다.

THE PRINT:
- 채워진 잉크에는 얼룩 질감을 넣는다. SVG feTurbulence 마스크로 모든 채운 면에 작은 구멍을 뚫는다. 망점(틴트)은 스크린 인쇄처럼 처리한다. 45도로 어긋난 두 개의 radial-gradient 점 격자를 쓰고, 점의 반지름으로 농도를 정한다 (100, 70, 45, 25, 10%).
- 오버프린트: 스튜디오 이름을 두 번 조판한다. 아래는 teal, 위는 pink이며 mix-blend-mode: multiply로 겹치고, pink는 왼쪽으로 5px, 위로 3px 옮긴다(휴대폰에서는 3px, 2px). 두 잉크가 겹치는 곳은 진해진다. 견적 합계도 같은 방식으로 인쇄한다.
- 히어로는 스튜디오 자체의 하우스 시트다. 2px 잉크 재단선, 여백의 크롭 마크, 중간 높이의 등록 표적, 글자 뒤의 세 가지 잉크 도형 세 개(망점 pink 원, 채운 teal 원판, 채운 yellow 띠)를 두고, 모두 multiply로 겹친다.
- 버튼은 잉크 색으로 하고 4px 분홍 오프셋 그림자를 준다. 다른 색이 어긋나게 찍힌 두 번째 판처럼 보이게 한다.

TYPOGRAPHY:
디스플레이: Young Serif 400(굵기는 하나뿐)을 쓴다. 스튜디오 이름, 제목, 한 줄 문구, 잉크와 용지 이름, 입력 칸 라벨, 단계 번호, 요일, 합계에 쓴다.
- 스튜디오 이름 clamp(4.1rem, 14.6vw, 11.6rem), 줄 간격 0.88, 자간 -0.035em. 휴대폰에서는 22vw
- h2 clamp(2.25rem, 4.6vw, 3.75rem), 줄 간격 1, 자간 -0.025em
- 한 줄 문구 clamp(1.6rem, 2.7vw, 2.2rem), 줄 간격 1.12. h3 1.5rem. 이름과 입력 칸 라벨 1.1875rem. 합계 clamp(2.25rem, 5vw, 3.9rem)
본문: Anonymous Pro 400과 700, 1.125rem, 줄 간격 1.55. 읽거나 입력하거나 확인하는 모든 것에 쓴다: 가격, 수량, 크기, 파일 이름, 1rem 주석. 표 숫자 정렬(tabular figures). 16px 미만 글자 금지. font-synthesis: none.

LAYOUT:
- 스튜디오 바: 두 개의 겹친 원이 있는 이름, 섹션 링크 다섯 개, "주문 시작" 버튼. 링크는 960px 미만에서 숨긴다.
- 히어로: 12열 격자 위의 하우스 시트. 위쪽에 이름을 가로로 두고, 왼쪽에 한 줄 문구와 문단 하나, 오른쪽에 선이 그어진 정보 목록을 둔다. 재단선 아래의 한 줄 슬러그는 어떤 잉크로 어떤 용지에 찍었는지 말한다.
- 잉크 드럼: 선으로 나뉜 두 열 목록(960px 미만에서는 한 열). 각 잉크는 다섯 단계 망점 띠, 이름, 상태(잉크 상자 안의 "오늘 1번 드럼", 재입고 날짜, 추가 요금)로 이루어진다.
- 용지: 각 용지의 재단 칩이 있는 선 표(두꺼운 용지는 가장자리가 보이고, 재생지는 얼룩, 크래프트지는 섬유가 보인다). 761px 미만에서는 각 행이 라벨과 함께 쌓인다.
- 작업 가격 보기: 왼쪽에 폼(7열), 오른쪽에 견적서(5열). 합계 위에 점선 뜯는 선을 둔다. 960px 미만에서는 견적서가 폼 뒤에 온다.
- 파일: 번호 매긴 체크리스트 옆에 분해 교정본(흑백 파일 두 개와 그 결과인 두 잉크 인쇄물).
- 주문 시작: 현재 작업 내용과 짧은 폼을 나란히 둔다.
- 완료 일정: 네 열의 제작 주간. 각 열에는 분홍으로 채워지는 막대가 있다. 수령 주소와 선이 있는 배송 표를 나란히 둔다.
- 최대 너비 1120px, 섹션 간격은 약 128px(휴대폰에서는 96px). 모서리는 모두 직각. 목록 위에는 2px 잉크 선, 행 사이에는 1px 선.

COMPONENTS:
- 세그먼트 토글(용지 크기, 인쇄 면): 2px 잉크 테두리, 2px 잉크 구분선, 선택된 항목은 잉크 색으로 채운다.
- 부수 스테퍼: 2px 잉크 테두리 안에 −, 숫자를 직접 입력하는 칸, +. 버튼은 50~5,000 사이에서 50 단위로 움직인다. 범위를 벗어난 입력은 가장 가까운 한계값으로 되돌리고 안내를 표시한다.
- 잉크 선택기: 잉크의 얼룩 칩이 있는 토글 버튼, 잉크 색 60%의 1px 외곽선. 선택된 항목에는 2px 잉크 테두리와, 인쇄 순서(가장 밝은 잉크가 먼저)를 나타내는 번호 있는 잉크 사각형을 붙인다. 재고가 없는 잉크는 비활성화하고 재입고 날짜를 말한다. 다섯 번째 잉크는 안내와 함께 거부한다.
- 용지: 2px 잉크 테두리 안의 기본 select.
- 견적서: slip 색 용지, 2px 잉크 테두리, 농도 14%의 6px 잉크 그림자, 모서리에 겹쳐 찍은 원형 잉크, 선으로 나뉜 목록의 항목, 겹쳐 인쇄한 합계.
- 폼: 항상 보이는 라벨, 직각의 2px 입력 칸, 칸 옆의 오류 메시지, 폼을 대신하는 견적 번호 확인 화면.

MOTION:
- 없음. 버튼은 호버 시 전환 효과 없이 2px 그림자 쪽으로 움직인다.

FORBIDDEN:
- 카드, 알약 모양, 둥근 모서리, 부드러운 드롭 그림자, 색으로 쓰는 그라데이션
- 제목 위의 작은 라벨, 자간을 넓힌 전부 대문자 라벨
- hex 코드가 있는 색 견본, 서체 견본이나 원칙 섹션
- 분홍이나 청록 본문(오버프린트한 이름과 합계만 별색 잉크로 조판)
- 그림 일러스트, 사람의 하프톤 사진, 이모지
- 스타일 자체에 관한 페이지

OUTPUT:
1) 토큰, 얼룩 마스크, 망점 스크린을 위한 CSS 사용자 정의 속성
2) 시맨틱 HTML과 CSS
3) 320px까지 가로 스크롤 없는 반응형 레이아웃
4) 작동하는 컨트롤: 크기, 부수, 최대 4색, 인쇄 면, 용지를 고르는 실시간 가격 계산기(항목별 내역 포함), 견적 번호로 확인되는 검증된 주문 폼. 보이는 포커스`;

const PROMPT_JA = `リソ印刷スタイルで、実在するような1ページをデザインしてください。非コート紙に特色インクを載せ、ドラムを1色ずつ回して印刷し、わずかに見当がずれた仕上がりにします。

印刷物の世界に存在するもっともらしい題材を選んでください。例：リソ印刷スタジオ、ジン（zine）図書館、小規模出版社、シルクスクリーン工房など。その題材の実際のコンテンツを書いてください。このページはスタイルについてのページではなく、その題材のページとして読めなければなりません。

COLOR TOKENS:
--paper: #f5f0e8（ページ。細かい紙目の上に載せる）
--slip: #fdfaf4（見積書、入力欄）
--ink: #2c3e50（本文、罫線、ボタン）
--muted: #55606d
--line: rgba(44, 62, 80, 0.36)
特色インク。インクとしてのみ使う：
--pink: #ff48b0（Fluorescent Pink）
--teal: #00838a
--yellow: #ffe800
インクドラムの一覧には、スタジオのほかのインクを一度ずつ加えます：#24242a black, #ffb511, #ff7477, #f15060, #914e72, #765ba7, #3d5588, #5ec8e5, #00a95c, #88898a, #ac936e。用紙チップは各用紙の色とし、再生紙とクラフト紙には茶色の斑点または繊維を入れます。分解データは白地に黒とグレーで描きます。低い不透明度のインクでチップと版の縁、平面的なオフセットの影を描きます。ほかの色は使いません。本文はインク色または muted 色とし、塗りつぶしボタンの上では slip 色を使います。ホバーではボタンが pink の影の方へ移動し、トグルには下線が付き、アウトラインボタンは輪郭が濃くなります。エラーは pink の四角の横にインク色の文字で示し、入力欄の下に pink のオフセットを付けます。

THE PRINT:
- 塗りの面には斑点（ムラ）を入れます。SVGのfeTurbulenceマスクで、すべての塗りに小さな穴を抜きます。網点（トーン）はスクリーン印刷のように処理します。45度に傾けた2つのradial-gradientのドット格子を使い、ドットの半径で濃度を決めます（100, 70, 45, 25, 10%）。
- オーバープリント：スタジオ名を2回組みます。下は teal、上は pink とし、mix-blend-mode: multiply で重ねます。pink は左へ5px、上へ3px ずらします（スマートフォンでは3pxと2px）。2色が重なる部分は濃くなります。見積もりの合計も同じ方法で印刷します。
- ヒーローはスタジオ自身のハウスシートです。2pxのインクの仕上がり線、余白のトリムマーク、中央の高さの見当マーク、文字の背後に3色の図形3つ（網点の pink の円、塗りの teal の円盤、塗りの yellow の帯）を置き、すべて multiply で重ねます。
- ボタンはインク色で、4pxの pink のオフセット影を付けます。見当がずれた2色目を重ねたように見せます。

TYPOGRAPHY:
ディスプレイ：Young Serif 400（ウェイトは1種類のみ）。スタジオ名、見出し、キャッチコピー、インクと用紙の名前、入力欄のラベル、手順番号、曜日、合計に使います。
- スタジオ名 clamp(4.1rem, 14.6vw, 11.6rem)、行間 0.88、字間 -0.035em。スマートフォンでは 22vw
- h2 clamp(2.25rem, 4.6vw, 3.75rem)、行間 1、字間 -0.025em
- キャッチコピー clamp(1.6rem, 2.7vw, 2.2rem)、行間 1.12。h3 は 1.5rem。名前と入力欄ラベルは 1.1875rem。合計は clamp(2.25rem, 5vw, 3.9rem)
本文：Anonymous Pro 400 と 700、1.125rem、行間 1.55。読む、入力する、確認するすべてのもの（価格、数量、サイズ、ファイル名、1rem の注記）に使います。表示数字の等幅（tabular figures）。16px 未満の文字は使いません。font-synthesis: none。

LAYOUT:
- スタジオバー：2つの重なった円を含む名前、セクションリンク5つ、「注文する」ボタン。リンクは960px未満では隠します。
- ヒーロー：12列グリッド上のハウスシート。上部に名前を横長に置き、左側にキャッチコピーと段落1つ、右側に罫線付きの情報リストを置きます。仕上がり線の下の1行のスラグは、どのインクで何の用紙に印刷したかを示します。
- インクドラム：罫線付きの2列の一覧（960px未満では1列）。各インクは5段階の網点の帯、名前、状態（インク枠内の「本日 1番ドラム」、再入荷日、追加料金）を持ちます。
- 用紙：罫線付きの表。各用紙の裁断チップ付きです（厚手の紙は端が見え、再生紙は斑点、クラフト紙は繊維が見えます）。761px未満では各行がラベル付きで積み重なります。
- 作業の見積もり：左にフォーム（7列）、右に見積書（5列）。合計の上に点線のミシン目を入れます。960px未満では見積書がフォームの後に続きます。
- ファイル：番号付きのチェックリストと、分解版の校正（墨と灰色の2つのファイルと、その結果の2色印刷）を並べます。
- 注文する：現在の作業内容と短いフォームを並べます。
- 制作スケジュール：4列の制作週。各列には pink で埋まっていくバーがあります。受け取り住所と罫線付きの配送表を並べます。
- 最大幅1120px、セクション間は約128px（スマートフォンでは96px）。角はすべて直角。一覧の上には2pxのインク罫線、行の間には1px線。

COMPONENTS:
- セグメント型トグル（用紙サイズ、印刷面）：2pxのインク枠、2pxのインク区切り。選択された項目はインク色で塗ります。
- 部数ステッパー：2pxのインク枠の中に「−」、数値を直接入力する欄、「+」。ボタンは50〜5,000の間で50ずつ動きます。範囲外の入力は最も近い上限・下限に戻し、注記を表示します。
- インクピッカー：インクのムラのあるチップ付きのトグルボタン、インク色60%の1pxアウトライン。選ばれたものには2pxのインク枠と、印刷順（明るい色が先）を示す番号付きのインク四角を付けます。在庫切れのインクは無効にし、再入荷日を示します。5色目は注記とともに受け付けません。
- 用紙：2pxのインク枠の中のネイティブの select。
- 見積書：slip 色の紙、2pxのインク枠、濃度14%の6pxのインク影、角に円として重ねて示したインク、罫線で区切られた項目、重ね刷りの合計。
- フォーム：常に表示されるラベル、角張った2pxの入力欄、入力欄の横のエラー、フォームに代わって表示される見積もり番号付きの確認表示。

MOTION:
- なし。ボタンはホバー時、トランジションなしで2pxだけ影の方へ移動します。

FORBIDDEN:
- カード、ピル形、角丸、柔らかいドロップシャドウ、色として使うグラデーション
- 見出しの上の小さなラベル、字間を広げた全大文字のラベル
- hex コード付きのカラースウォッチ、書体見本や原則のセクション
- ピンクやティールの本文（オーバープリントした名前と合計だけを特色インクで組む）
- 具象イラスト、人物のハーフトーン写真、絵文字
- スタイルそのものについてのページ

OUTPUT:
1) トークン、斑点マスク、網点スクリーンのための CSS カスタムプロパティ
2) セマンティックな HTML と CSS
3) 320pxまで横スクロールのないレスポンシブレイアウト
4) 動作するコントロール：サイズ、部数、最大4色、印刷面、用紙を選べるリアルタイムの料金計算（項目別の内訳付き）、見積番号で確認が出る検証付きの注文フォーム。見えるフォーカス`;

const PROMPTS: Record<Lang, string> = {
  en: PROMPT_EN,
  ko: PROMPT_KO,
  ja: PROMPT_JA,
};

// The ink picker shows these until the visitor asks for the whole shelf.
const PICK_FIRST: InkId[] = ['pink', 'teal', 'yellow', 'black'];

interface Job {
  size: Size;
  copies: number;
  inks: InkId[];
  sides: 1 | 2;
  paper: PaperChoice;
}

function quoteFor(job: Job) {
  const big = job.size === 'A3';
  const sheetSize = big ? 'A3' : 'A4';
  // A5 prints two to an A4 sheet.
  const sheets = job.size === 'A5' ? Math.ceil(job.copies / 2) : job.copies;
  const rate = job.copies >= 1000 ? (big ? 5 : 3) : big ? 8 : 5;
  const masterCount = job.inks.length * job.sides;
  const passes = sheets * masterCount;
  const paper = job.paper === 'own' ? null : PAPERS.find((entry) => entry.id === job.paper) ?? PAPERS[0];
  const sheetPrice = paper ? (big ? paper.a3 : paper.a4) : 0;
  const masters = masterCount * 800;
  const printing = passes * rate;
  const paperCost = sheets * sheetPrice;
  const handling = paper ? 0 : 1000;
  const extras = job.inks.reduce((sum, id) => sum + (inkById(id).extra ?? 0), 0);
  const subtotal = masters + printing + paperCost + handling + extras;
  const vat = Math.round(subtotal * 0.2);
  const total = subtotal + vat;
  const readyIndex = Math.min(READY_DAYS.length - 1, Math.ceil(masterCount / 2) - 1);
  return { sheetSize, sheets, rate, masterCount, passes, paper, sheetPrice, masters, printing, paperCost, handling, extras, subtotal, vat, total, readyIndex };
}

export function PortedRisographPrintPage({ lang }: PortedStylePageProps) {
  const [size, setSize] = useState<Size>('A3');
  const [copies, setCopies] = useState(200);
  const [copiesText, setCopiesText] = useState('200');
  const [copiesFlag, setCopiesFlag] = useState('');
  const [inks, setInks] = useState<InkId[]>(['pink', 'teal']);
  const [allInks, setAllInks] = useState(false);
  const [keptInks, setKeptInks] = useState<InkId[]>([]);
  const [inkFlag, setInkFlag] = useState('');
  const [sides, setSides] = useState<1 | 2>(1);
  const [paper, setPaper] = useState<PaperChoice>('munken120');
  const [live, setLive] = useState('');
  const [guest, setGuest] = useState({ name: '', email: '', link: '' });
  const [errors, setErrors] = useState({ name: false, email: false, link: false });
  const [orders, setOrders] = useState(0);
  const [placed, setPlaced] = useState<{ quote: string; summary: string; total: string; email: string; link: string } | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const wasPlaced = useRef(false);
  const lastQuote = useRef(`${copies}:${size}:${inks.join()}:${sides}:${paper}`);
  const t = (text: Tri) => text[lang];

  const job: Job = { size, copies, inks, sides, paper };
  const quote = quoteFor(job);
  const printOrder = INKS.filter((ink) => inks.includes(ink.id)).sort((a, b) => a.rank - b.rank);
  const paperLabel = quote.paper ? `${t(quote.paper.name)} ${quote.paper.weight}` : t(DOCKET.ownPaper);
  const summary = fill(t(DOCKET.summary), {
    copies: count.format(copies),
    size,
    inks: t(INK_COUNT[inks.length]),
    sides: t(sides === 1 ? DOCKET.oneSide : DOCKET.bothSides),
    paper: paperLabel,
  });
  const total = pounds(quote.total);
  const each = quote.total / copies;
  const perCopy = each < 100 ? fill(t(DOCKET.eachPence), { n: Math.max(1, Math.round(each)) }) : fill(t(DOCKET.eachPounds), { n: pounds(Math.round(each)) });
  const readyDay = t(READY_DAYS[quote.readyIndex]);
  const quoteKey = `${copies}:${size}:${inks.join()}:${sides}:${paper}`;
  const liveText = fill(t(DOCKET.live), { total, copies: count.format(copies) });

  // The quote is read out once the visitor stops changing the job, not on every keystroke.
  useEffect(() => {
    if (quoteKey === lastQuote.current) return;
    lastQuote.current = quoteKey;
    const timer = window.setTimeout(() => setLive(liveText), 700);
    return () => window.clearTimeout(timer);
  }, [quoteKey, liveText]);

  // The form and the confirmation replace each other, so focus goes to what took its place.
  useEffect(() => {
    if (placed) doneRef.current?.focus();
    else if (wasPlaced.current) nameRef.current?.focus();
    wasPlaced.current = placed !== null;
  }, [placed]);

  const commitCopies = (value: number) => {
    setCopies(value);
    setCopiesText(String(value));
  };

  const stepCopies = (direction: 1 | -1) => {
    const next = direction > 0 ? Math.floor(copies / COPY_STEP) * COPY_STEP + COPY_STEP : Math.ceil(copies / COPY_STEP) * COPY_STEP - COPY_STEP;
    if (next < MIN_COPIES) {
      setCopiesFlag(t(PRICE.copiesMin));
      commitCopies(MIN_COPIES);
      return;
    }
    if (next > MAX_COPIES) {
      setCopiesFlag(t(PRICE.copiesMax));
      commitCopies(MAX_COPIES);
      return;
    }
    setCopiesFlag('');
    commitCopies(next);
  };

  const typeCopies = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 5);
    setCopiesText(digits);
    const value = Number(digits);
    if (digits !== '' && value >= MIN_COPIES && value <= MAX_COPIES) {
      setCopies(value);
      setCopiesFlag('');
    }
  };

  // A typed number outside the range is set back to the nearest limit when the field is left.
  const settleCopies = () => {
    const value = Number(copiesText);
    if (copiesText === '') {
      setCopiesText(String(copies));
    } else if (value < MIN_COPIES) {
      setCopiesFlag(t(PRICE.copiesMin));
      commitCopies(MIN_COPIES);
    } else if (value > MAX_COPIES) {
      setCopiesFlag(t(PRICE.copiesMax));
      commitCopies(MAX_COPIES);
    } else {
      commitCopies(value);
    }
  };

  const toggleInk = (ink: Ink) => {
    if (ink.out) return;
    if (inks.includes(ink.id)) {
      if (inks.length === 1) {
        setInkFlag(t(PRICE.inksMin));
        return;
      }
      setInks(inks.filter((id) => id !== ink.id));
      setInkFlag('');
      return;
    }
    if (inks.length >= MAX_INKS) {
      setInkFlag(fill(t(PRICE.inksMax), { ink: t(ink.name) }));
      return;
    }
    setInks([...inks, ink.id]);
    setInkFlag('');
  };

  // Folding the shelf away keeps every ink that is chosen in view, so none of them vanish.
  const toggleShelf = () => {
    if (allInks) setKeptInks(inks.filter((id) => !PICK_FIRST.includes(id)));
    setAllInks(!allInks);
  };

  const shownInks = allInks ? INKS : INKS.filter((ink) => PICK_FIRST.includes(ink.id) || keptInks.includes(ink.id));
  const hiddenCount = INKS.length - shownInks.length;

  const handleOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const link = guest.link.trim();
    const linkOk = URL.canParse(link) && /^https?:$/.test(new URL(link).protocol) && new URL(link).hostname.includes('.');
    const next = { name: guest.name.trim() === '', email: !EMAIL_PATTERN.test(guest.email.trim()), link: !linkOk };
    setErrors(next);
    if (next.name || next.email || next.link) {
      (next.name ? nameRef : next.email ? emailRef : linkRef).current?.focus();
      return;
    }
    setPlaced({ quote: `DP-${FIRST_QUOTE + orders}`, summary, total, email: guest.email.trim(), link });
    setOrders(orders + 1);
  };

  const orderAgain = () => {
    setGuest({ name: '', email: '', link: '' });
    setErrors({ name: false, email: false, link: false });
    setPlaced(null);
  };

  const field = (key: 'name' | 'email' | 'link', value: string) => {
    setGuest({ ...guest, [key]: value });
    if (errors[key]) setErrors({ ...errors, [key]: false });
  };

  return (
    <FusionShell
      fusionId="risograph-print"
      lang={lang}
      tone="light"
      accent="#2c3e50"
      prev={{ href: '/pages/y2k-retro.html', label: 'Windows 98' }}
      next={{ href: '/pages/paper-cut.html', label: 'Paper Cut / Layered' }}
      prompts={PROMPTS}
    >
      <div className="dp">
        <header className="dp-top">
          <p className="dp-mark"><i aria-hidden="true" />{NAME}</p>
          <nav className="dp-top__nav" aria-label={t(TOP.nav)}>
            <a href="#dp-inks">{t(TOP.inks)}</a>
            <a href="#dp-paper">{t(TOP.paper)}</a>
            <a href="#dp-price">{t(TOP.prices)}</a>
            <a href="#dp-files">{t(TOP.files)}</a>
            <a href="#dp-pickup">{t(TOP.pickup)}</a>
          </nav>
          <a className="dp-btn dp-btn--sm" href="#dp-order">{t(TOP.order)}</a>
        </header>

        <section className="dp-hero" aria-labelledby="dp-title">
          <div className="dp-trim">
            <span className="dp-crop dp-crop--tl" aria-hidden="true" />
            <span className="dp-crop dp-crop--tr" aria-hidden="true" />
            <span className="dp-crop dp-crop--bl" aria-hidden="true" />
            <span className="dp-crop dp-crop--br" aria-hidden="true" />
            <span className="dp-reg dp-reg--l" aria-hidden="true" />
            <span className="dp-reg dp-reg--r" aria-hidden="true" />
            <div className="dp-sheet">
              <div className="dp-art" aria-hidden="true">
                <i className="dp-dot dp-ht" />
                <i className="dp-disc dp-solid" />
                <i className="dp-band dp-solid" />
              </div>
              <h1 className="dp-op" id="dp-title">
                <span><span className="dp-line">Duplo</span> <span className="dp-line">Press</span></span>
                <span aria-hidden="true"><span className="dp-line">Duplo</span> <span className="dp-line">Press</span></span>
              </h1>
              <div className="dp-hero__copy">
                <p className="dp-claim">{t(HERO.claim)}</p>
                <p className="dp-hero__body">{t(HERO.body)}</p>
                <a className="dp-btn" href="#dp-price">{t(HERO.cta)}</a>
              </div>
              <dl className="dp-facts">
                {FACTS.map(([term, value]) => (
                  <div key={term.en}><dt>{t(term)}</dt><dd>{t(value)}</dd></div>
                ))}
              </dl>
            </div>
          </div>
          <p className="dp-slug">{t(HERO.slug)}</p>
        </section>

        <section className="dp-sec" id="dp-inks" aria-labelledby="dp-inks-title">
          <div className="dp-head">
            <h2 id="dp-inks-title">{t(DRUMS.title)}</h2>
            <p>{t(DRUMS.note)}</p>
          </div>
          <ul className="dp-inks">
            {INKS.map((ink) => (
              <li key={ink.id} className={ink.out ? 'is-out' : undefined} style={{ '--dp-c': ink.color } as Vars}>
                <span className="dp-ramp" aria-hidden="true">
                  <i className="dp-solid" /><i className="dp-ht" /><i className="dp-ht" /><i className="dp-ht" /><i className="dp-ht" />
                </span>
                <b>{t(ink.name)}</b>
                {ink.drum ? (
                  <span className="dp-state dp-state--on">{fill(t(DRUMS.drum), { n: ink.drum })}</span>
                ) : ink.out ? (
                  <span className="dp-state">{t(DRUMS.out)}</span>
                ) : ink.extra ? (
                  <span className="dp-state">{t(DRUMS.extra)}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <section className="dp-sec" id="dp-paper" aria-labelledby="dp-paper-title">
          <div className="dp-head">
            <h2 id="dp-paper-title">{t(PAPER_COPY.title)}</h2>
            <p>{t(PAPER_COPY.note)}</p>
          </div>
          {/* Under 761px the rows stack, so the table roles are spelled out for screen readers. */}
          <table className="dp-papers" role="table">
            <caption className="dp-vh">{t(PAPER_COPY.caption)}</caption>
            <thead role="rowgroup">
              <tr role="row">
                <th role="columnheader" scope="col">{t(PAPER_COPY.paper)}</th>
                <th role="columnheader" scope="col">{t(PAPER_COPY.weight)}</th>
                <th role="columnheader" scope="col">{t(PAPER_COPY.colour)}</th>
                <th role="columnheader" scope="col">{t(PAPER_COPY.use)}</th>
                <th role="columnheader" scope="col" className="dp-num">{t(PAPER_COPY.a4)}</th>
                <th role="columnheader" scope="col" className="dp-num">{t(PAPER_COPY.a3)}</th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {PAPERS.map((entry) => (
                <tr key={entry.id} role="row">
                  <td role="cell" className="dp-papers__name">
                    <span className="dp-pname">
                      <i className={`dp-chip${entry.cut ? ` dp-chip--${entry.cut}` : ''}`} style={{ '--dp-pc': entry.chip } as Vars} aria-hidden="true" />
                      <b>{t(entry.name)}</b>
                    </span>
                  </td>
                  <td role="cell" className="dp-papers__wt" data-label={t(PAPER_COPY.weight)}>{entry.weight}</td>
                  <td role="cell" className="dp-papers__clr" data-label={t(PAPER_COPY.colour)}>{t(entry.colour)}</td>
                  <td role="cell" className="dp-papers__use" data-label={t(PAPER_COPY.use)}>{t(entry.use)}</td>
                  <td role="cell" className="dp-num" data-label="A4">{pounds(entry.a4)}</td>
                  <td role="cell" className="dp-num" data-label="A3">{pounds(entry.a3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="dp-sec" id="dp-price" aria-labelledby="dp-price-title">
          <div className="dp-head">
            <h2 id="dp-price-title">{t(PRICE.title)}</h2>
            <p>{t(PRICE.note)}</p>
          </div>
          <div className="dp-calc">
            {/* Enter in the copies field settles the number; the form sends nothing. */}
            <form
              className="dp-form"
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                settleCopies();
              }}
            >
              <div className="dp-field" role="group" aria-labelledby="dp-size-label">
                <span className="dp-lab" id="dp-size-label">{t(PRICE.size)}</span>
                <div className="dp-seg">
                  {SIZES.map((entry) => (
                    <button key={entry} type="button" aria-pressed={size === entry} onClick={() => setSize(entry)}>{entry}</button>
                  ))}
                </div>
              </div>

              <div className="dp-field">
                <label className="dp-lab" htmlFor="dp-copies">{t(PRICE.copies)}</label>
                <div className="dp-step">
                  <button
                    type="button"
                    aria-label={t(PRICE.fewer)}
                    aria-disabled={copies <= MIN_COPIES}
                    aria-controls="dp-copies"
                    onClick={() => stepCopies(-1)}
                  >
                    <span aria-hidden="true">−</span>
                  </button>
                  <input
                    id="dp-copies"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    value={copiesText}
                    aria-describedby="dp-copies-note"
                    onChange={(event) => typeCopies(event.target.value)}
                    onBlur={settleCopies}
                  />
                  <button
                    type="button"
                    aria-label={t(PRICE.more)}
                    aria-disabled={copies >= MAX_COPIES}
                    aria-controls="dp-copies"
                    onClick={() => stepCopies(1)}
                  >
                    <span aria-hidden="true">+</span>
                  </button>
                </div>
                <p className="dp-note" id="dp-copies-note">{t(PRICE.copiesNote)}</p>
                <p className="dp-flag" role="status">{copiesFlag}</p>
              </div>

              <div className="dp-field" role="group" aria-labelledby="dp-inks-label">
                <span className="dp-lab" id="dp-inks-label">{t(PRICE.inks)}</span>
                <div className="dp-pick" id="dp-pick">
                  {shownInks.map((ink) => {
                    const at = printOrder.findIndex((entry) => entry.id === ink.id);
                    const chosen = at >= 0;
                    const full = !chosen && !ink.out && inks.length >= MAX_INKS;
                    return (
                      <button
                        key={ink.id}
                        type="button"
                        className={ink.out ? 'is-out' : undefined}
                        aria-pressed={chosen}
                        aria-disabled={full || undefined}
                        disabled={ink.out}
                        onClick={() => toggleInk(ink)}
                      >
                        <i className="dp-solid" style={{ '--dp-c': ink.color } as Vars} aria-hidden="true" />
                        {t(ink.name)}
                        {chosen ? <em><span className="dp-vh">, {t(PRICE.printed)} </span>{at + 1}</em> : null}
                        {ink.out ? <small><span className="dp-vh">, </span>{t(DRUMS.out)}</small> : null}
                      </button>
                    );
                  })}
                  <button type="button" className="dp-more" aria-expanded={allInks} aria-controls="dp-pick" onClick={toggleShelf}>
                    {allInks ? t(PRICE.fewerInks) : fill(t(PRICE.moreInks), { n: hiddenCount })}
                  </button>
                </div>
                <p className="dp-note">{t(PRICE.inksNote)}</p>
                <p className="dp-flag" role="status">{inkFlag}</p>
              </div>

              <div className="dp-field" role="group" aria-labelledby="dp-sides-label">
                <span className="dp-lab" id="dp-sides-label">{t(PRICE.sides)}</span>
                <div className="dp-seg">
                  <button type="button" aria-pressed={sides === 1} onClick={() => setSides(1)}>{t(PRICE.oneSide)}</button>
                  <button type="button" aria-pressed={sides === 2} onClick={() => setSides(2)}>{t(PRICE.bothSides)}</button>
                </div>
              </div>

              <div className="dp-field">
                <label className="dp-lab" htmlFor="dp-paper-select">{t(PRICE.paper)}</label>
                <span className="dp-select">
                  <select id="dp-paper-select" value={paper} onChange={(event) => setPaper(event.target.value as PaperChoice)}>
                    {PAPERS.map((entry) => (
                      <option key={entry.id} value={entry.id}>{`${entry.short ?? t(entry.name)} ${entry.weight}`}</option>
                    ))}
                    <option value="own">{t(PRICE.own)}</option>
                  </select>
                </span>
              </div>

              <dl className="dp-rates">
                {RATES.map(([term, value]) => (
                  <div key={term.en}><dt>{t(term)}</dt><dd>{t(value)}</dd></div>
                ))}
              </dl>
            </form>

            <aside className="dp-docket" aria-labelledby="dp-quote-title">
              <div className="dp-docket__body">
                <div className="dp-docket__top">
                  <h3 id="dp-quote-title">{t(DOCKET.title)}</h3>
                  <span className="dp-mix" aria-hidden="true" style={{ '--dp-n': printOrder.length } as Vars}>
                    {printOrder.map((ink, index) => (
                      <i key={ink.id} className="dp-solid" style={{ '--dp-c': ink.color, '--dp-i': index } as Vars} />
                    ))}
                  </span>
                </div>
                <p className="dp-sub">{summary}</p>
                <p className="dp-runs">
                  <span>{t(DOCKET.order)}</span>
                  <span className="dp-runs__list">
                    {printOrder.map((ink, index) => (
                      <span key={ink.id}><em>{index + 1}</em>{t(ink.name)}</span>
                    ))}
                  </span>
                </p>
                <dl className="dp-lines">
                  <div>
                    <dt>{t(DOCKET.masters)} <small>{quote.masterCount === 1 ? t(DOCKET.master) : fill(t(DOCKET.mastersN), { n: quote.masterCount })}</small></dt>
                    <dd>{pounds(quote.masters)}</dd>
                  </div>
                  <div>
                    <dt>{t(DOCKET.printing)} <small>{fill(t(DOCKET.passes), { n: count.format(quote.passes), rate: quote.rate })}</small></dt>
                    <dd>{pounds(quote.printing)}</dd>
                  </div>
                  {quote.paper ? (
                    <div>
                      <dt>{t(DOCKET.paper)} <small>{fill(t(DOCKET.sheets), { n: count.format(quote.sheets), size: quote.sheetSize, price: quote.sheetPrice })}</small></dt>
                      <dd>{pounds(quote.paperCost)}</dd>
                    </div>
                  ) : (
                    <div>
                      <dt>{t(DOCKET.handling)}</dt>
                      <dd>{pounds(quote.handling)}</dd>
                    </div>
                  )}
                  {quote.extras > 0 ? (
                    <div>
                      <dt>{t(DOCKET.gold)} <small>{t(DOCKET.goldNote)}</small></dt>
                      <dd>{pounds(quote.extras)}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt>{t(DOCKET.trim)}</dt>
                    <dd>{t(DOCKET.free)}</dd>
                  </div>
                  <div className="dp-lines__soft">
                    <dt>{t(DOCKET.subtotal)}</dt>
                    <dd>{pounds(quote.subtotal)}</dd>
                  </div>
                  <div className="dp-lines__soft">
                    <dt>{t(DOCKET.vat)}</dt>
                    <dd>{pounds(quote.vat)}</dd>
                  </div>
                </dl>
              </div>
              <div className="dp-stub">
                <p className="dp-total">
                  <span>{t(DOCKET.total)}</span>
                  <span className="dp-op dp-op--sum">
                    <span>{total}</span>
                    <span aria-hidden="true">{total}</span>
                  </span>
                </p>
                <p>{perCopy} {fill(t(DOCKET.ready), { day: readyDay })}</p>
                <a className="dp-btn" href="#dp-order">{t(DOCKET.cta)}</a>
              </div>
              <p className="dp-vh" role="status">{live}</p>
            </aside>
          </div>
        </section>

        <section className="dp-sec" id="dp-files" aria-labelledby="dp-files-title">
          <div className="dp-head">
            <h2 id="dp-files-title">{t(FILES.title)}</h2>
            <p>{t(FILES.note)}</p>
          </div>
          <div className="dp-files">
            <ol className="dp-steps">
              {STEPS.map(({ title, body, files = [] }) => (
                <li key={title.en}>
                  <b>{t(title)}</b>
                  <p>
                    {t(body)}
                    {files.map((file, index) => (
                      <span key={file}> <code>{file}</code>{index < files.length - 1 ? ',' : '.'}</span>
                    ))}
                  </p>
                </li>
              ))}
            </ol>
            <div className="dp-proof" role="group" aria-label={t(FILES.proof)}>
              <figure className="dp-plate">
                <div aria-hidden="true"><i className="dp-p-disc dp-k" /><i className="dp-p-bar dp-k dp-k--grey" /></div>
                <figcaption>poster_pink.pdf</figcaption>
              </figure>
              <figure className="dp-plate">
                <div aria-hidden="true"><i className="dp-p-block dp-k" /></div>
                <figcaption>poster_teal.pdf</figcaption>
              </figure>
              <figure className="dp-plate dp-plate--print">
                <div aria-hidden="true">
                  <i className="dp-p-disc dp-solid" style={{ '--dp-c': 'var(--dp-pink)' } as Vars} />
                  <i className="dp-p-bar dp-ht" style={{ '--dp-c': 'var(--dp-pink)', '--r': '1.45px' } as Vars} />
                  <i className="dp-p-block dp-solid" style={{ '--dp-c': 'var(--dp-teal)' } as Vars} />
                </div>
                <figcaption>{t(FILES.both)}</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="dp-sec" id="dp-order" aria-labelledby="dp-order-title">
          <div className="dp-head">
            <h2 id="dp-order-title">{t(ORDER.title)}</h2>
            <p>{t(ORDER.note)}</p>
          </div>
          <div className="dp-orderbox">
            <div className="dp-job">
              <dl>
                <div><dt>{t(ORDER.job)}</dt><dd>{summary}</dd></div>
                <div><dt>{t(ORDER.quote)}</dt><dd className="dp-job__total">{total}</dd></div>
                <div><dt>{t(ORDER.ready)}</dt><dd>{readyDay}</dd></div>
              </dl>
              <a className="dp-textlink" href="#dp-price">{t(ORDER.change)}</a>
            </div>

            {placed ? (
              <div className="dp-done" ref={doneRef} tabIndex={-1} role="group" aria-labelledby="dp-done-title">
                <h3 id="dp-done-title">{fill(t(ORDER.doneTitle), { quote: placed.quote })}</h3>
                <p>{fill(t(ORDER.doneJob), { quote: placed.quote, summary: placed.summary, total: placed.total })}</p>
                <p>{fill(t(ORDER.doneBody), { link: placed.link, email: placed.email })}</p>
                <button className="dp-btn" type="button" onClick={orderAgain}>{t(ORDER.again)}</button>
              </div>
            ) : (
              <form className="dp-order" noValidate onSubmit={handleOrder}>
                <div className={`dp-input${errors.name ? ' is-invalid' : ''}`}>
                  <label htmlFor="dp-name">{t(ORDER.name)}</label>
                  <input
                    id="dp-name"
                    ref={nameRef}
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                    value={guest.name}
                    aria-invalid={errors.name}
                    aria-describedby={errors.name ? 'dp-name-error' : undefined}
                    onChange={(event) => field('name', event.target.value)}
                  />
                  {errors.name ? <p className="dp-error" id="dp-name-error" role="alert">{t(ORDER.nameError)}</p> : null}
                </div>
                <div className={`dp-input${errors.email ? ' is-invalid' : ''}`}>
                  <label htmlFor="dp-email">{t(ORDER.email)}</label>
                  <input
                    id="dp-email"
                    ref={emailRef}
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={guest.email}
                    aria-invalid={errors.email}
                    aria-describedby={errors.email ? 'dp-email-error' : undefined}
                    onChange={(event) => field('email', event.target.value)}
                  />
                  {errors.email ? <p className="dp-error" id="dp-email-error" role="alert">{t(ORDER.emailError)}</p> : null}
                </div>
                <div className={`dp-input${errors.link ? ' is-invalid' : ''}`}>
                  <label htmlFor="dp-link">{t(ORDER.link)}</label>
                  <input
                    id="dp-link"
                    ref={linkRef}
                    type="url"
                    name="files"
                    inputMode="url"
                    autoComplete="url"
                    required
                    value={guest.link}
                    aria-invalid={errors.link}
                    aria-describedby={errors.link ? 'dp-link-hint dp-link-error' : 'dp-link-hint'}
                    onChange={(event) => field('link', event.target.value)}
                  />
                  <p className="dp-hint" id="dp-link-hint">{t(ORDER.linkHint)}</p>
                  {errors.link ? <p className="dp-error" id="dp-link-error" role="alert">{t(ORDER.linkError)}</p> : null}
                </div>
                <div className="dp-send">
                  <button className="dp-btn" type="submit">{fill(t(ORDER.send), { total })}</button>
                  <p>{t(ORDER.pay)}</p>
                </div>
              </form>
            )}
          </div>
        </section>

        <section className="dp-sec" id="dp-pickup" aria-labelledby="dp-pickup-title">
          <div className="dp-head">
            <h2 id="dp-pickup-title">{t(WEEK.title)}</h2>
            <p>{t(WEEK.note)}</p>
          </div>
          <ol className="dp-days" aria-label={t(WEEK.week)}>
            {DAYS.map((day, index) => (
              <li key={day.day.en} className={`dp-day${index === DAYS.length - 1 ? ' is-ready' : ''}`}>
                <span className="dp-bar" aria-hidden="true">
                  <i className="dp-solid" style={{ '--dp-c': 'var(--dp-pink)', '--dp-w': `${day.done}%` } as Vars} />
                  <i className="dp-ht" />
                </span>
                <b>{t(day.day)}</b>
                <span className="dp-date">{t(day.date)}</span>
                <p>{t(day.body)}</p>
              </li>
            ))}
          </ol>
          <div className="dp-pickup">
            <div>
              <h3>{t(WEEK.collect)}</h3>
              <address><span>{STREET}</span><span>{POSTCODE}</span></address>
              <p>{t(WEEK.collectBody)}</p>
            </div>
            <table className="dp-opts">
              <caption className="dp-vh">{t(WEEK.options)}</caption>
              <tbody>
                {OPTIONS.map((option) => (
                  <tr key={option.name.en}>
                    <td>{t(option.name)}{option.note ? <small><span className="dp-vh">, </span>{t(option.note)}</small> : null}</td>
                    <td>{t(option.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="dp-foot">
          <p className="dp-foot__name">{NAME}</p>
          <p>{STREET}, {POSTCODE}</p>
          <p><a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
          <p><a href={PHONE_HREF}>{PHONE}</a></p>
          <p>{t(FOOT.made)}</p>
        </footer>
      </div>
    </FusionShell>
  );
}
