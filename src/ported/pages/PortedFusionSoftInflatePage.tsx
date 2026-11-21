import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedFusionSoftInflatePage.css';

// The shop page of Cirro, a maker of inflatable pillows in Annecy, in the Soft Inflate style.
// The material is the page's own: white raised frames and recessed wells on a cool off-white,
// and one blown-up shape for every pillow drawn on it. Varela Round sets the name and the
// headings; Lexend sets everything you read or press. Sky blue marks only what is chosen,
// counted or open today.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

const fill = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));

/** A sentence with links in it: each {key} is replaced by the node of that name. */
const withNodes = (text: string, nodes: Record<string, ReactNode>) =>
  text.split(/(\{\w+\})/g).map((part, index) => {
    const key = part.match(/^\{(\w+)\}$/)?.[1];
    return <Fragment key={index}>{key && key in nodes ? nodes[key] : part}</Fragment>;
  });

const money = (value: number) => (Number.isInteger(value) ? `€${value}` : `€${value.toFixed(2)}`);

const NAME = 'Cirro';
const DELIVERY = 5.9;
const FREE_FROM = 60;

const IMG = {
  balloon: {
    src: 'https://images.unsplash.com/photo-1712574340322-aaeae2cbaa8f?w=1800&q=80&auto=format&fit=crop',
    alt: {
      en: 'A white heart-shaped balloon high in a clear blue sky',
      ko: '맑고 푸른 하늘 높이 떠 있는 흰색 하트 모양 풍선',
      ja: '澄んだ青空の高いところに浮かぶ白いハート形の風船',
    },
    credit: { name: 'insung yoon', url: 'https://unsplash.com/photos/a-white-balloon-floating-in-a-blue-sky-gUhMocUj1ow' },
  },
  fabric: {
    src: 'https://images.unsplash.com/photo-1743142883555-b0beac669a51?w=1000&q=80&auto=format&fit=crop',
    alt: {
      en: 'Close-up of white brushed fabric folding over itself',
      ko: '흰색 기모 원단이 자기 위로 접혀 들어가는 클로즈업',
      ja: '白い起毛生地が折り重なるクローズアップ',
    },
    credit: { name: 'breee luise', url: 'https://unsplash.com/photos/white-soft-and-fluffy-fabric-hL8F2s31BdE' },
  },
  bench: {
    src: 'https://images.unsplash.com/photo-1776472603139-909c099affd3?w=1200&q=80&auto=format&fit=crop',
    alt: {
      en: 'White fabric with a small band of rainbow light across its folds',
      ko: '주름을 가로지르는 작은 무지개빛 띠가 있는 흰색 원단',
      ja: '襞を横切る小さな虹色の光の帯がある白い生地',
    },
    credit: { name: 'Yoko Saito', url: 'https://unsplash.com/photos/soft-white-fabric-with-subtle-rainbow-light-reflection-pykFL3LlmGY' },
  },
} satisfies Record<string, { src: string; alt: Tri; credit: { name: string; url: string } }>;

const TOP = {
  nav: { en: 'Shop sections', ko: '매장 섹션', ja: 'ショップの項目' },
  pillows: { en: 'Pillows', ko: '베개', ja: '枕' },
  fill: { en: 'How to fill one', ko: '베개 부풀리는 법', ja: '枕の膨らませ方' },
  shop: { en: 'The shop', ko: '매장', ja: 'ショップ' },
  questions: { en: 'Questions', ko: '질문', ja: '質問' },
  bag: { en: 'Bag', ko: '장바구니', ja: 'カート' },
  bagTitle: { en: 'Your bag', ko: '장바구니', ja: 'カート' },
  bagEmpty: {
    en: 'Nothing in your bag yet. Choose a cover and add a pillow.',
    ko: '장바구니가 아직 비어 있습니다. 커버를 고르고 베개를 담아 보세요.',
    ja: 'カートはまだ空です。カバーを選んで、枕を入れてください。',
  },
  line: { en: '{pillow}, {cover} cover', ko: '{pillow}, {cover} 커버', ja: '{pillow}、{cover}カバー' },
  delivery: { en: 'Delivery in the EU', ko: 'EU 내 배송', ja: 'EU国内の配送' },
  free: { en: 'Free', ko: '무료', ja: '無料' },
  total: { en: 'Total', ko: '합계', ja: '合計' },
  freeFrom: {
    en: 'Delivery is free from €60. Orders leave Annecy the next working day.',
    ko: '€60 이상이면 배송비가 무료입니다. 주문은 다음 영업일에 안시에서 발송됩니다.',
    ja: '€60以上で配送料は無料です。ご注文は翌営業日にアヌシーから発送します。',
  },
  addedOne: {
    en: 'Added the {pillow} pillow in {cover} to your bag. 1 pillow in the bag.',
    ko: '{cover} 커버의 {pillow} 베개를 장바구니에 담았습니다. 장바구니에 베개 1개가 있습니다.',
    ja: '{cover}カバーの{pillow}枕をカートに入れました。カートに枕が1個あります。',
  },
  addedMany: {
    en: 'Added the {pillow} pillow in {cover} to your bag. {n} pillows in the bag.',
    ko: '{cover} 커버의 {pillow} 베개를 장바구니에 담았습니다. 장바구니에 베개 {n}개가 있습니다.',
    ja: '{cover}カバーの{pillow}枕をカートに入れました。カートに枕が{n}個あります。',
  },
} satisfies Record<string, Tri>;

const HERO = {
  line: {
    en: 'Inflatable pillows with a soft brushed cover, sewn in Annecy.',
    ko: '부드러운 기모 커버를 씌워 안시에서 봉제한 공기 베개입니다.',
    ja: 'やわらかな起毛カバーをつけ、アヌシーで縫製した空気枕です。',
  },
  cta: { en: 'See the three pillows', ko: '세 가지 베개 보기', ja: '3種類の枕を見る' },
} satisfies Record<string, Tri>;

type CoverId = 'chalk' | 'sky' | 'slate';
type PillowId = 'travel' | 'camp' | 'wide';

const COVERS: Array<{ id: CoverId; name: Tri }> = [
  { id: 'chalk', name: { en: 'Chalk', ko: 'Chalk', ja: 'Chalk' } },
  { id: 'sky', name: { en: 'Sky', ko: 'Sky', ja: 'Sky' } },
  { id: 'slate', name: { en: 'Slate', ko: 'Slate', ja: 'Slate' } },
];

const coverName = (id: CoverId) => (COVERS.find((cover) => cover.id === id) ?? COVERS[0]).name;

const SHELF = {
  title: { en: 'Three pillows', ko: '베개 세 종', ja: '3種類の枕' },
  note: {
    en: 'The same brushed cover and the same valve in three sizes. The cover zips off and goes in the wash at 30 °C.',
    ko: '같은 기모 커버와 같은 밸브를 세 가지 크기로 만들었습니다. 커버는 지퍼로 떼어 30 °C에서 세탁할 수 있습니다.',
    ja: '同じ起毛カバーと同じバルブを、3つのサイズで作りました。カバーはファスナーで外して、30 °Cで洗えます。',
  },
  legend: { en: 'Cover colour for the {pillow} pillow', ko: '{pillow} 베개의 커버 색', ja: '{pillow}枕のカバーの色' },
  add: { en: 'Add to bag', ko: '장바구니에 담기', ja: 'カートに入れる' },
  have: { en: '{n} in your bag', ko: '장바구니에 {n}개', ja: 'カートに{n}個' },
} satisfies Record<string, Tri>;

const PILLOWS: Array<{ id: PillowId; name: Tri; price: number; size: string; cover: CoverId; body: Tri }> = [
  {
    id: 'travel',
    name: { en: 'Travel', ko: 'Travel', ja: 'Travel' },
    price: 34,
    size: '36 × 26 cm',
    cover: 'chalk',
    body: {
      en: 'For planes, trains and night buses. Fills in two breaths and packs to 9 × 6 cm. Weighs 68 g.',
      ko: '비행기, 기차, 야간 버스용입니다. 숨 두 번이면 부풀고, 접으면 9 × 6 cm가 됩니다. 무게는 68 g입니다.',
      ja: '飛行機、電車、夜行バス向けです。息を2回吹き込めば膨らみ、たたむと9 × 6 cmになります。重さは68 gです。',
    },
  },
  {
    id: 'camp',
    name: { en: 'Camp', ko: 'Camp', ja: 'Camp' },
    price: 42,
    size: '44 × 30 cm',
    cover: 'sky',
    body: {
      en: 'For a tent or a hut bunk. Fills in three breaths and packs to 11 × 7 cm. Weighs 96 g.',
      ko: '텐트나 산장 침상용입니다. 숨 세 번이면 부풀고, 접으면 11 × 7 cm가 됩니다. 무게는 96 g입니다.',
      ja: 'テントや山小屋の寝台向けです。息を3回吹き込めば膨らみ、たたむと11 × 7 cmになります。重さは96 gです。',
    },
  },
  {
    id: 'wide',
    name: { en: 'Wide', ko: 'Wide', ja: 'Wide' },
    price: 56,
    size: '62 × 38 cm',
    cover: 'slate',
    body: {
      en: 'Wide enough for two people sharing a double sleeping bag. Fills in five breaths and packs to 13 × 8 cm. Weighs 142 g.',
      ko: '2인용 침낭을 함께 쓰는 두 사람이 벨 만큼 넓습니다. 숨 다섯 번이면 부풀고, 접으면 13 × 8 cm가 됩니다. 무게는 142 g입니다.',
      ja: '2人用の寝袋を二人で使えるほど広いサイズです。息を5回吹き込めば膨らみ、たたむと13 × 8 cmになります。重さは142 gです。',
    },
  },
];

const FILL = {
  title: { en: 'How to fill one', ko: '베개 부풀리는 법', ja: '枕の膨らませ方' },
  note: {
    en: 'Shown here with the Camp pillow. Travel takes two breaths and Wide takes five; everything else is the same.',
    ko: 'Camp 베개로 보여 줍니다. Travel은 숨 두 번, Wide는 숨 다섯 번이 걸리며 나머지는 같습니다.',
    ja: 'Campの枕で示しています。Travelは息2回、Wideは息5回で、ほかの手順は同じです。',
  },
  made: { en: 'What it is made of', ko: '소재', ja: '素材' },
} satisfies Record<string, Tri>;

// The four drawn stages, from flat to packed, in the same order as the steps.
const STAGES = ['flat', 'full', 'set', 'pack'] as const;

const STEPS: Array<{ title: Tri; body: Tri }> = [
  {
    title: { en: 'Unroll it', ko: '펼치기', ja: '広げる' },
    body: {
      en: 'Take it out of its pouch, lay it flat and twist the valve cap open a quarter turn.',
      ko: '파우치에서 꺼내 평평하게 놓고, 밸브 캡을 4분의 1바퀴 돌려 엽니다.',
      ja: 'ポーチから出して平らに置き、バルブキャップを4分の1回転させて開けます。',
    },
  },
  {
    title: { en: 'Three breaths', ko: '숨 세 번', ja: '息を3回' },
    body: {
      en: 'Breathe out into the valve three times. A flap inside keeps the air in between breaths.',
      ko: '밸브에 대고 숨을 세 번 내쉽니다. 안쪽의 판막이 숨과 숨 사이의 공기를 붙잡아 둡니다.',
      ja: 'バルブに向かって3回息を吐きます。内側の弁が、息と息の間も空気を保ちます。',
    },
  },
  {
    title: { en: 'Let a little out', ko: '조금 빼기', ja: '少し抜く' },
    body: {
      en: 'Lie down on it, then press the middle of the valve for a second at a time until it feels right.',
      ko: '베개에 몸을 눕힌 뒤, 적당하다고 느껴질 때까지 밸브 가운데를 1초씩 눌러 공기를 뺍니다.',
      ja: '枕に横になり、ちょうどよいと感じるまで、バルブの中央を1秒ずつ押して空気を抜きます。',
    },
  },
  {
    title: { en: 'Pack it', ko: '접어 넣기', ja: 'たたんで収納' },
    body: {
      en: 'Hold the valve open, roll it up from the far end and slide the roll back into the pouch.',
      ko: '밸브를 연 채로 먼 쪽 끝부터 말고, 만 베개를 파우치에 다시 밀어 넣습니다.',
      ja: 'バルブを開けたまま奥の端から丸め、丸めた枕をポーチに戻します。',
    },
  },
];

const MATERIALS: Array<[Tri, Tri]> = [
  [
    { en: 'Cover', ko: '커버', ja: 'カバー' },
    {
      en: 'Brushed knit, 88% recycled polyester and 12% elastane, 190 g/m². Knitted in Roanne and sewn in our workshop behind the shop.',
      ko: '기모 니트, 재생 폴리에스터 88%와 엘라스테인 12%, 190 g/m². 로안에서 짜고 매장 뒤 작업실에서 봉제합니다.',
      ja: '起毛ニット、再生ポリエステル88%とエラスタン12%、190 g/m²。ロアンヌで編み、店の裏の作業場で縫製しています。',
    },
  ],
  [
    { en: 'Inside', ko: '내부', ja: '内部' },
    {
      en: 'A bladder of 0.2 mm TPU film with welded seams. It has far less smell than PVC and stays supple in the cold.',
      ko: '이음매를 열로 붙인 0.2 mm TPU 필름 공기주머니입니다. PVC보다 냄새가 훨씬 적고, 추운 곳에서도 부드럽습니다.',
      ja: '継ぎ目を熱で溶着した0.2 mm TPUフィルムの空気袋です。PVCよりにおいがずっと少なく、寒い場所でも柔らかさを保ちます。',
    },
  ],
  [
    { en: 'Valve', ko: '밸브', ja: 'バルブ' },
    {
      en: 'One valve for filling and letting air out with one thumb. It unscrews by hand, and we send a new one free for five years.',
      ko: '밸브 하나로 공기를 넣고, 엄지 하나로 공기를 뺍니다. 손으로 풀 수 있으며, 5년 동안 새 밸브를 무료로 보내 드립니다.',
      ja: 'バルブは1つで、空気を入れるのも親指ひとつで抜くのもこれで行います。手で外せ、5年間は新しいバルブを無料でお送りします。',
    },
  ],
];

const SHOP = {
  title: { en: 'The shop in Annecy', ko: '안시 매장', ja: 'アヌシーの店舗' },
  note: {
    en: 'Every pillow is out on the bench, already blown up, so you can lie down and try them. We sew them in the room at the back.',
    ko: '모든 베개가 이미 부풀린 채로 벤치에 놓여 있어, 직접 누워 보고 고를 수 있습니다. 베개는 뒤쪽 방에서 봉제합니다.',
    ja: 'すべての枕は膨らませた状態で展示台に置いてあり、横になって試せます。縫製は奥の部屋で行っています。',
  },
  street: { en: '14 rue Sainte-Claire', ko: '14 rue Sainte-Claire', ja: '14 rue Sainte-Claire' },
  town: { en: '74000 Annecy, France', ko: '74000 Annecy, France', ja: '74000 Annecy, France' },
  hours: { en: 'Opening hours', ko: '영업시간', ja: '営業時間' },
  closed: { en: 'Closed', ko: '휴무', ja: '定休日' },
  today: { en: 'Today', ko: '오늘', ja: '今日' },
  openNow: { en: 'Open now, until {time}.', ko: '지금 영업 중입니다. {time}까지 엽니다.', ja: '現在営業中です。{time}まで。' },
  opensToday: { en: 'Closed now. Opens today at {time}.', ko: '지금은 휴무입니다. 오늘 {time}에 엽니다.', ja: '現在は営業時間外です。本日{time}に開店します。' },
  opensTomorrow: { en: 'Closed now. Opens tomorrow at {time}.', ko: '지금은 휴무입니다. 내일 {time}에 엽니다.', ja: '現在は営業時間外です。明日{time}に開店します。' },
  opensOn: { en: 'Closed now. Opens on {day} at {time}.', ko: '지금은 휴무입니다. {day} {time}에 엽니다.', ja: '現在は営業時間外です。{day}の{time}に開店します。' },
  also: { en: 'Also sold at', ko: '취급 매장', ja: '取り扱い店舗' },
  post: {
    en: 'Online orders leave Annecy the next working day. Delivery in the EU costs €5.90 and is free from €60.',
    ko: '온라인 주문은 다음 영업일에 안시에서 발송됩니다. EU 내 배송비는 €5.90이며, €60 이상이면 무료입니다.',
    ja: 'オンライン注文は翌営業日にアヌシーから発送します。EU国内の配送料は€5.90で、€60以上なら無料です。',
  },
  caption: {
    en: 'Chalk covers on the bench by the window, late morning.',
    ko: '늦은 오전, 창가 벤치에 놓인 Chalk 커버들.',
    ja: '午前遅く、窓際のベンチに置かれたChalkカバー。',
  },
} satisfies Record<string, Tri>;

// Sunday first, as Date.getDay() counts.
const WEEKDAYS: Tri[] = [
  { en: 'Sunday', ko: '일요일', ja: '日曜日' },
  { en: 'Monday', ko: '월요일', ja: '月曜日' },
  { en: 'Tuesday', ko: '화요일', ja: '火曜日' },
  { en: 'Wednesday', ko: '수요일', ja: '水曜日' },
  { en: 'Thursday', ko: '목요일', ja: '木曜日' },
  { en: 'Friday', ko: '금요일', ja: '金曜日' },
  { en: 'Saturday', ko: '토요일', ja: '土曜日' },
];

/** Opening and closing time in minutes after midnight, per weekday (Sunday first). Monday is closed. */
type Span = readonly [number, number];
const OPEN: Array<Span | null> = [[600, 780], null, [600, 1110], [600, 1110], [600, 1110], [600, 1110], [600, 1140]];

const HOUR_ROWS: Array<{ days: number[]; label: Tri }> = [
  { days: [1], label: WEEKDAYS[1] },
  { days: [2, 3, 4, 5], label: { en: 'Tuesday to Friday', ko: '화요일부터 금요일까지', ja: '火曜日から金曜日' } },
  { days: [6], label: WEEKDAYS[6] },
  { days: [0], label: WEEKDAYS[0] },
];

const STOCKISTS: Array<{ name: string; city: Tri }> = [
  { name: 'Haute Route', city: { en: 'Geneva', ko: 'Geneva', ja: 'Geneva' } },
  { name: 'L’Atelier Vertical', city: { en: 'Chamonix', ko: 'Chamonix', ja: 'Chamonix' } },
  { name: 'Casa Alpina', city: { en: 'Turin', ko: 'Turin', ja: 'Turin' } },
  { name: 'Bergstube', city: { en: 'Innsbruck', ko: 'Innsbruck', ja: 'Innsbruck' } },
  { name: 'Le Bivouac', city: { en: 'Lyon', ko: 'Lyon', ja: 'Lyon' } },
  { name: 'Fjellbua', city: { en: 'Oslo', ko: 'Oslo', ja: 'Oslo' } },
];

const clock = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const PARIS = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

/** The weekday and the time of day in Annecy, wherever the visitor is. */
function annecyNow(date: Date): { day: number; minutes: number } {
  const parts = PARIS.formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((entry) => entry.type === type)?.value ?? '';
  const day = SHORT_DAYS.indexOf(part('weekday'));
  if (day < 0) throw new Error(`Unexpected weekday from Intl: ${part('weekday')}`);
  return { day, minutes: Number(part('hour')) * 60 + Number(part('minute')) };
}

const QUESTIONS: Array<[Tri, Tri]> = [
  [
    { en: 'Does it smell of plastic when it is new?', ko: '새 제품에서 플라스틱 냄새가 나나요?', ja: '新品はプラスチックのようなにおいがしますか?' },
    {
      en: 'A little, for the first day. Blow it up, take the cover off and leave it by an open window overnight. By morning the smell has gone.',
      ko: '첫날에는 조금 납니다. 부풀린 뒤 커버를 벗기고 창문을 열어 둔 곳에 하룻밤 두세요. 아침이면 냄새가 사라집니다.',
      ja: '最初の1日は少し匂います。膨らませてカバーを外し、窓を開けた場所に一晩置いてください。朝にはにおいが消えています。',
    },
  ],
  [
    { en: 'Will it still be firm in the morning?', ko: '아침에도 여전히 단단한가요?', ja: '朝になっても硬さは残っていますか?' },
    {
      en: 'Nearly. It softens by about half a breath overnight, mostly because the air inside cools down. One breath into the valve sets it right again.',
      ko: '거의 그렇습니다. 밤사이 숨 반 번 정도 분량만큼 부드러워지는데, 주로 안의 공기가 식기 때문입니다. 밸브에 숨을 한 번 불어 넣으면 다시 단단해집니다.',
      ja: 'ほぼ残ります。夜の間に息半分ほど柔らかくなるのは、主に中の空気が冷えるためです。バルブに息を1回吹き込めば、また硬さが戻ります。',
    },
  ],
  [
    { en: 'Can I wash it?', ko: '세탁할 수 있나요?', ja: '洗えますか?' },
    {
      en: 'The cover, yes: zip it off and wash it at 30 °C, then dry it flat. Wipe the bladder with a damp cloth.',
      ko: '커버는 세탁할 수 있습니다. 지퍼를 열어 떼어 낸 뒤 30 °C에서 세탁하고, 평평하게 펴서 말리세요. 공기주머니는 젖은 천으로 닦으세요.',
      ja: 'カバーは洗えます。ファスナーで外して30 °Cで洗い、平らにして乾かしてください。空気袋は濡れた布で拭いてください。',
    },
  ],
  [
    { en: 'What if the valve starts to leak?', ko: '밸브에서 바람이 새기 시작하면 어떻게 하나요?', ja: 'バルブから空気が漏れ始めたらどうすればよいですか?' },
    {
      en: 'Send us a photo through your order page. We post a new valve within two working days, free for five years after you bought the pillow.',
      ko: '주문 페이지에서 사진을 보내 주세요. 영업일 기준 2일 안에 새 밸브를 보내 드리며, 베개를 구입한 날부터 5년 동안 무료입니다.',
      ja: 'ご注文ページから写真をお送りください。営業日2日以内に新しいバルブを発送します。枕をご購入から5年間は無料です。',
    },
  ],
];

const FOOT = {
  questions: { en: 'Questions', ko: '질문', ja: '質問' },
  credits: {
    en: 'Photographs by {a}, {b} and {c} on {u}',
    ko: '사진 출처: {a}, {b}, {c} ({u})',
    ja: '写真: {a}、{b}、{c}（{u}）',
  },
} satisfies Record<string, Tri>;

const PROMPT_EN = `Design one real page in Soft Inflate style: white raised frames and recessed wells on a cool off-white, every drawn object blown up with air, and sky blue only on what is chosen, counted or open today.

Pick a believable subject whose things really hold air or rest soft, such as a maker of inflatable pillows, a bouncy-castle hire, a balloon workshop or a camping-mat brand, and write its real content. The page must read as that subject's page, never as a page about its own style.

COLOR TOKENS:
--bg: #f2f4f8 (cool off-white)
--card: #ffffff (raised)
--well: #e7eaf0 (recessed)
--ink: #0a0c10
--ink-2: #2a2f38 (reading text)
--muted: #535b69
--line: rgba(10, 12, 16, 0.26)
--edge: rgba(10, 12, 16, 0.22) (the 1px border of every raised or recessed surface)
--sky: #0ea5e9 (the bag count)
--sky-ink: #0369a1 (the chosen cover's ring, "Today", step numbers, the 2px focus ring; it is white on the photograph and ink round a swatch)
Cover colours, used only on drawn pillows and their swatches:
--chalk: #fbfcfe
--sky-cover: #a9dcf6
--slate: #5f6d80
Shadows use rgb(30 41 59) at 0.13 to 0.45 and white at up to 0.95. On the hero photograph a dark teal, rgb(4 40 58) at 0.18 to 0.36, makes the scrim under the white text and the shadows of the name and the button. Swatch edges are ink at 0.4. No other colours: no error red (the page has no forms), no hover colour (a hovered link turns ink and underlines, a hovered button rises 1px).

THE MATERIAL:
- Raised: white, 1px edge, a long soft shadow down and right (18px 26px 50px at 0.13), a white glow up and left (-10px -10px 30px at 0.95) and a 1px white inner top highlight. Used for the hero photograph, the two other photographs, buttons, the bag, the bag list and today's row in the opening hours. The bag list opens over the photograph, so it keeps only the dark shadow.
- Recessed: the well colour, 1px edge, two inset shadows (7px 7px 18px dark, -6px -6px 16px white). Used for the shelf the pillows rest on and the tray of filling stages.
- The pillow: one shape for every pillow on the page, border-radius 30% / 44%, the cover colour, a white highlight (radial gradient from the upper left), a darker underside (radial gradient at the lower right), inset shading and a contact shadow underneath. Flat, set and packed stages change only the aspect ratio and the size.
- Radii: 32px on the hero and the shelf (26px on phones), 30px on the tray (22px on phones), 28px on photographs, 22px on the bag list, 16px on buttons and today's row, 14px on the bag. Never a pill.

TYPOGRAPHY:
Display: Varela Round 400, its only weight, for the name, headings, the address, step numbers and questions. Stroke ends fully rounded, like a seam pressed out by air.
- Name clamp(5rem, 17vw, 13.25rem), line-height 0.86, tracking -0.035em
- h2 clamp(2.125rem, 4.1vw, 3.25rem), line-height 1.08, tracking -0.02em
- h3 1.625rem (1.375rem for steps and the stockists); address clamp(1.625rem, 2.5vw, 2rem); step numbers 2rem (1.75rem on phones); questions 1.1875rem
Body: Lexend 350 to 600, 1rem, line-height 1.72, for everything you read or press. Prices 1.5rem, hours and sizes 500 with tabular figures, buttons 500 at 1rem, the hero line 1.25rem at 350.
Hierarchy comes from size, never a faux bold (font-synthesis: none). No text under 16px.

LAYOUT:
- Shop bar: the name, four section links and the bag with its count. On phones the links are hidden.
- Hero: one raised photograph of a white balloon in a clear sky, the name and one line set inside it at the bottom left, "See the three pillows" at the bottom right. 16:9 up to the height of the first screen, 4:3 on tablets, 2:3 on phones.
- Three pillows: a recessed shelf with the three pillows drawn side by side at their real relative sizes (36 × 26, 44 × 30 and 62 × 38 cm, columns 36fr 44fr 62fr) and each size under its pillow; under the shelf, three columns on the same grid with name and price over a 1px rule, the description, the cover swatches and Add to bag. Under 960px the columns stack; under 600px the sizes move from the shelf into each pillow's text.
- How to fill one: a recessed tray split into four stages by 1px lines (flat, full, set, packed), the four numbered steps under it; then a square photograph of the cover fabric beside a ruled list of what it is made of.
- The shop: the address large, the week's opening hours as ruled rows with today's row raised and marked, a line saying whether the shop is open now (Annecy time), the stockists in two ruled columns, and a tall photograph with a caption.
- Questions: ruled rows, question left, answer right.
- Max width about 1120px, sections 128px apart (88px on phones).

COMPONENTS:
- Cover swatches: 32px raised circles in a 44px target, radio buttons. The chosen one gets a 2px sky-ink ring 3px out. Choosing one recolours that pillow on the shelf (and the Camp pillow also recolours the filling stages), and the cover's name shows beside the swatches.
- Buttons: 50px high, raised, 16px radius, ink text; pressed, they sink into the surface.
- Add to bag: adds that pillow in its chosen cover, updates the count in the shop bar and announces it in a polite live region; "1 in your bag" appears beside the button.
- The bag: a 44px raised button with its count on a sky circle. It opens a raised list of what is in it, the EU delivery charge (€5.90, free from €60) and the total; Escape or a click outside closes it.
- Opening hours: today's row is raised and says Today.
- Rows: 1px lines at 0.26 opacity.

MOTION:
- On load, and whenever a cover is chosen, that pillow on the shelf inflates once from its base (0.7s, a slight overshoot). Buttons rise 1px on hover and sink when pressed (0.16s). Nothing loops and nothing else moves.
- prefers-reduced-motion switches all of it off.

FORBIDDEN:
- Cards, pills, a grid of identical rounded boxes
- A small label above a heading, all-caps tracked labels
- Neumorphic toggles and sliders shown for their own sake, grey text on grey, shadows with no edge
- Drawn balloons, clouds, faces or other figurative illustration
- Glass blur, gradient blobs, a pastel rainbow
- A page about its own style

OUTPUT:
1) CSS custom properties for the tokens, the two surfaces and the pillow shape
2) Semantic HTML and CSS
3) Responsive layout down to 320px with no horizontal scroll
4) Working controls: cover radios per pillow, add to bag with a live count and a bag list, today marked in the opening hours; visible focus; reduced-motion support`;

const PROMPT_KO = `Soft Inflate 스타일로 실제 페이지 한 장을 디자인한다. 차가운 오프화이트 바탕에 흰색으로 솟은 틀과 안쪽으로 들어간 움푹한 면을 쓰고, 그려진 사물은 모두 공기로 부풀린 모양으로 만든다. 하늘색은 선택되었거나, 세거나, 오늘 열려 있는 것에만 쓴다.

실제로 공기를 담거나 부드럽게 놓이는 것을 다루는 그럴듯한 주제를 고른다. 예를 들어 공기 베개 제조사, 바운시 캐슬 대여점, 풍선 공방, 캠핑 매트 브랜드가 있다. 실제 내용을 쓴다. 페이지는 그 주제의 페이지로 읽혀야 하며, 자기 스타일에 관한 페이지로 읽혀서는 안 된다.

COLOR TOKENS:
--bg: #f2f4f8 (차가운 오프화이트)
--card: #ffffff (솟은 면)
--well: #e7eaf0 (움푹한 면)
--ink: #0a0c10
--ink-2: #2a2f38 (본문 글)
--muted: #535b69
--line: rgba(10, 12, 16, 0.26)
--edge: rgba(10, 12, 16, 0.22) (솟거나 움푹한 면마다 있는 1px 테두리)
--sky: #0ea5e9 (장바구니 개수)
--sky-ink: #0369a1 (선택한 커버의 고리, "Today", 단계 번호, 2px 포커스 링. 사진 위에서는 흰색, 색 견본 둘레에서는 잉크색이다)
커버 색은 그려진 베개와 색 견본에만 쓴다:
--chalk: #fbfcfe
--sky-cover: #a9dcf6
--slate: #5f6d80
그림자는 rgb(30 41 59)을 0.13~0.45로, 흰색은 최대 0.95까지 쓴다. 히어로 사진 위에서는 짙은 청록 rgb(4 40 58)을 0.18~0.36으로 써서 흰 글자 밑의 어두운 막과 이름 및 버튼의 그림자를 만든다. 색 견본 테두리는 잉크색 0.4다. 그 밖의 색은 쓰지 않는다. 오류 빨강은 없다(폼이 없는 페이지다). 호버 색도 없다(호버한 링크는 잉크색이 되고 밑줄이 생기며, 호버한 버튼은 1px 솟는다).

THE MATERIAL:
- 솟은 면: 흰색, 1px 테두리, 아래와 오른쪽으로 길게 번지는 부드러운 그림자(18px 26px 50px, 0.13), 위와 왼쪽으로 번지는 흰 빛(-10px -10px 30px, 0.95), 1px 흰색 안쪽 윗부분 하이라이트. 히어로 사진, 나머지 두 사진, 버튼, 장바구니, 장바구니 목록, 영업시간의 오늘 행에 쓴다. 장바구니 목록은 사진 위에 열리므로 어두운 그림자만 남긴다.
- 움푹한 면: 움푹한 면의 색, 1px 테두리, 안쪽 그림자 두 개(7px 7px 18px 어두운 색, -6px -6px 16px 흰색). 베개가 놓이는 선반과 충전 단계 트레이에 쓴다.
- 베개: 페이지의 모든 베개가 같은 모양을 쓴다. border-radius 30% / 44%, 커버 색, 왼쪽 위에서 퍼지는 흰 하이라이트(방사형 그라데이션), 오른쪽 아래의 어두운 밑면(방사형 그라데이션), 안쪽 음영, 아래에 깔리는 접촉 그림자. 평평한, 부푼, 고정된, 접은 단계는 가로세로 비율과 크기만 바꾼다.
- 모서리 반경: 히어로와 선반 32px(휴대폰에서는 26px), 트레이 30px(휴대폰에서는 22px), 사진 28px, 장바구니 목록 22px, 버튼과 오늘 행 16px, 장바구니 14px. 알약 모양은 쓰지 않는다.

TYPOGRAPHY:
디스플레이: Varela Round 400, 이 서체의 유일한 굵기다. 이름, 제목, 주소, 단계 번호, 질문에 쓴다. 획의 끝은 완전히 둥글게 하여 공기로 눌러 낸 솔기처럼 보이게 한다.
- 이름 clamp(5rem, 17vw, 13.25rem), 줄 높이 0.86, 자간 -0.035em
- h2 clamp(2.125rem, 4.1vw, 3.25rem), 줄 높이 1.08, 자간 -0.02em
- h3 1.625rem(단계와 취급 매장은 1.375rem), 주소 clamp(1.625rem, 2.5vw, 2rem), 단계 번호 2rem(휴대폰에서는 1.75rem), 질문 1.1875rem
본문: Lexend 350~600, 1rem, 줄 높이 1.72. 읽거나 누르는 모든 글에 쓴다. 가격은 1.5rem, 영업시간과 크기는 500 굵기에 고정폭 숫자(tabular figures), 버튼은 500 굵기의 1rem, 히어로 한 줄 문구는 350 굵기의 1.25rem이다.
위계는 크기로만 만든다. 가짜 굵기는 쓰지 않는다(font-synthesis: none). 16px 미만의 글자는 쓰지 않는다.

LAYOUT:
- 상단 바: 이름, 섹션 링크 네 개, 개수가 있는 장바구니. 휴대폰에서는 링크를 숨긴다.
- 히어로: 맑은 하늘의 흰 풍선을 찍은 솟은 사진 한 장. 이름과 한 줄 문구는 사진 안 왼쪽 아래에, "세 가지 베개 보기" 버튼은 오른쪽 아래에 둔다. 첫 화면 높이까지는 16:9, 태블릿에서는 4:3, 휴대폰에서는 2:3이다.
- 세 가지 베개: 움푹한 선반에 세 베개를 실제 상대 크기(36 × 26, 44 × 30, 62 × 38 cm, 열 비율 36fr 44fr 62fr)로 나란히 그리고, 각 베개 아래에 크기를 적는다. 선반 아래에는 같은 격자의 열 세 개를 둔다. 각 열에는 위에 이름과 가격, 그 아래 1px 선, 설명, 커버 색 견본, 장바구니에 담기를 놓는다. 960px 미만에서는 열을 세로로 쌓는다. 600px 미만에서는 크기를 선반에서 각 베개의 글 영역으로 옮긴다.
- 베개 부풀리는 법: 움푹한 트레이를 1px 선으로 네 단계(평평함, 부풂, 고정, 접음)로 나누고, 그 아래에 번호가 붙은 네 단계를 둔다. 그다음 커버 원단의 정사각형 사진을 두고, 옆에 소재를 적은 줄 쳐진 목록을 놓는다.
- 매장: 주소를 크게, 이번 주 영업시간을 줄 쳐진 행으로 쓰고 오늘 행은 솟게 하여 표시한다. 지금 영업 중인지 알려 주는 한 줄(안시 시간 기준), 취급 매장을 줄 쳐진 두 열로, 캡션이 달린 세로로 긴 사진을 둔다.
- 질문: 줄 쳐진 행. 질문은 왼쪽, 답은 오른쪽.
- 최대 너비 약 1120px, 섹션 간격 128px(휴대폰에서는 88px).

COMPONENTS:
- 커버 색 견본: 44px 터치 영역 안의 32px 솟은 원, 라디오 버튼. 선택한 것은 3px 떨어진 2px sky-ink 고리를 가진다. 고르면 그 베개의 색이 선반에서 바뀌고(Camp 베개는 충전 단계도 함께 바뀐다), 커버 이름이 견본 옆에 나타난다.
- 버튼: 높이 50px, 솟은 면, 모서리 반경 16px, 잉크색 글자. 눌렀을 때는 면 안으로 가라앉는다.
- 장바구니에 담기: 선택한 커버의 그 베개를 담고, 상단 바의 개수를 갱신하며, polite 라이브 영역으로 알린다. 버튼 옆에 "장바구니에 1개"가 나타난다.
- 장바구니: 44px의 솟은 버튼이며, 개수는 하늘색 원 안에 표시한다. 열면 담긴 항목, EU 배송비(5.90€, 60€ 이상이면 무료), 합계를 적은 솟은 목록이 나온다. Escape를 누르거나 바깥을 클릭하면 닫힌다.
- 영업시간: 오늘 행은 솟아 있고 "오늘"이라고 표시한다.
- 줄: 불투명도 0.26의 1px 선.

MOTION:
- 페이지를 불러올 때, 그리고 커버를 고를 때마다, 선반의 그 베개가 밑면에서부터 한 번 부풀어 오른다(0.7초, 살짝 넘치게). 버튼은 호버하면 1px 솟고 누르면 가라앉는다(0.16초). 반복되는 움직임은 없으며, 그 밖에는 아무것도 움직이지 않는다.
- prefers-reduced-motion을 설정하면 이 모든 움직임을 끈다.

FORBIDDEN:
- 카드, 알약 모양, 같은 둥근 상자가 늘어선 격자
- 제목 위의 작은 라벨, 전부 대문자이고 자간을 넓힌 라벨
- 그 자체를 보여 주려고 넣은 뉴모피즘 토글과 슬라이더, 회색 위의 회색 글자, 테두리 없는 그림자
- 그려진 풍선, 구름, 얼굴 등 구상적인 일러스트
- 유리 블러, 그라데이션 얼룩, 파스텔 무지개
- 자기 스타일에 관한 페이지

OUTPUT:
1) 토큰, 두 종류의 면, 베개 모양을 위한 CSS 커스텀 속성
2) 의미 있는 HTML과 CSS
3) 가로 스크롤 없이 320px까지 내려가는 반응형 레이아웃
4) 동작하는 컨트롤: 베개마다 커버 라디오, 라이브 개수와 장바구니 목록이 있는 장바구니에 담기, 영업시간의 오늘 표시, 보이는 포커스, reduced-motion 지원`;

const PROMPT_JA = `Soft Inflate スタイルで、実在するページを1枚デザインする。冷たいオフホワイトの地に、白く浮き上がった枠と内側にくぼんだ面を置く。描かれるものはすべて空気で膨らませた形にする。空色は、選ばれたもの、数えるもの、今日開いているものにだけ使う。

空気を含む、または柔らかく横たわるものを扱う、もっともらしい題材を選ぶ。例えば空気枕のメーカー、バウンシーキャッスルのレンタル、風船工房、キャンプマットのブランドなどである。実際の内容を書く。ページはその題材のページとして読めること。自分のスタイルについてのページに見えてはならない。

COLOR TOKENS:
--bg: #f2f4f8（冷たいオフホワイト）
--card: #ffffff（浮き上がった面）
--well: #e7eaf0（くぼんだ面）
--ink: #0a0c10
--ink-2: #2a2f38（本文の文字）
--muted: #535b69
--line: rgba(10, 12, 16, 0.26)
--edge: rgba(10, 12, 16, 0.22)（浮き上がった面・くぼんだ面すべての1pxの縁）
--sky: #0ea5e9（カートの数）
--sky-ink: #0369a1（選んだカバーのリング、「Today」、手順番号、2pxのフォーカスリング。写真の上では白、色見本の周りではインク色）
カバーの色。描かれた枕と色見本にだけ使う:
--chalk: #fbfcfe
--sky-cover: #a9dcf6
--slate: #5f6d80
影は rgb(30 41 59) を 0.13〜0.45、白は最大 0.95 で使う。ヒーロー写真の上では、濃い青緑 rgb(4 40 58) を 0.18〜0.36 で使い、白い文字の下の暗い幕と、名前とボタンの影を作る。色見本の縁はインク色の 0.4。ほかの色は使わない。エラーの赤はない（フォームのないページである）。ホバーの色もない（ホバーしたリンクはインク色になり下線が付く。ホバーしたボタンは1px浮く）。

THE MATERIAL:
- 浮き上がった面: 白、1pxの縁、下と右に長く柔らかく落ちる影（18px 26px 50px、0.13）、上と左に広がる白い光（-10px -10px 30px、0.95）、1pxの白い内側の上端ハイライト。ヒーロー写真、ほかの2枚の写真、ボタン、カート、カートの一覧、営業時間の今日の行に使う。カートの一覧は写真の上に開くため、暗い影だけを残す。
- くぼんだ面: くぼみの色、1pxの縁、内側の影を2つ（7px 7px 18px 暗い色、-6px -6px 16px 白）。枕を載せる棚と、充填段階のトレイに使う。
- 枕: ページ上のすべての枕に同じ形を使う。border-radius 30% / 44%、カバーの色、左上から広がる白いハイライト（放射状グラデーション）、右下の暗い底面（放射状グラデーション）、内側の陰影、下に落ちる接触影。平たい・膨らんだ・固定した・たたんだ段階は、縦横比と大きさだけを変える。
- 角丸: ヒーローと棚は32px（スマートフォンでは26px）、トレイは30px（スマートフォンでは22px）、写真は28px、カートの一覧は22px、ボタンと今日の行は16px、カートは14px。錠剤型は使わない。

TYPOGRAPHY:
ディスプレイ: Varela Round 400（この書体のウェイトはこれだけ）。名前、見出し、住所、手順番号、質問に使う。線の端は完全に丸くし、空気で押し出した縫い目のように見せる。
- 名前 clamp(5rem, 17vw, 13.25rem)、行の高さ 0.86、字間 -0.035em
- h2 clamp(2.125rem, 4.1vw, 3.25rem)、行の高さ 1.08、字間 -0.02em
- h3 1.625rem（手順と取り扱い店舗は1.375rem）、住所 clamp(1.625rem, 2.5vw, 2rem)、手順番号 2rem（スマートフォンでは1.75rem）、質問 1.1875rem
本文: Lexend 350〜600、1rem、行の高さ 1.72。読むものと押すものすべてに使う。価格は1.5rem、営業時間とサイズは500のタブラー数字（等幅数字）、ボタンは500の1rem、ヒーローの一行は350の1.25rem。
階層は大きさだけで作る。偽の太字は使わない（font-synthesis: none）。16px未満の文字は使わない。

LAYOUT:
- ショップバー: 名前、4つのセクションへのリンク、件数付きのカート。スマートフォンではリンクを隠す。
- ヒーロー: 晴れた空の白い風船を写した、浮き上がった写真1枚。名前と一行の文は写真の中の左下に、「3種類の枕を見る」は右下に置く。最初の画面の高さまでは16:9、タブレットでは4:3、スマートフォンでは2:3。
- 3種類の枕: くぼんだ棚に、3つの枕を実際の相対サイズ（36 × 26、44 × 30、62 × 38 cm、列は 36fr 44fr 62fr）で並べて描き、各枕の下にサイズを書く。棚の下には同じ格子の3列を置き、各列には上に名前と価格、その下に1pxの線、説明、カバーの色見本、カートに入れるを配置する。960px未満では列を積み重ねる。600px未満ではサイズを棚から各枕の本文へ移す。
- 枕の膨らませ方: くぼんだトレイを1pxの線で4段階（平ら、膨らみ、整形、たたみ）に分け、その下に番号付きの4つの手順を置く。続けて、カバー生地の正方形の写真を、素材を並べた罫線付きのリストの横に置く。
- 店舗: 住所を大きく、今週の営業時間を罫線付きの行で書き、今日の行は浮き上がらせて印を付ける。今営業中かどうかを示す一行（アヌシー時間）、取り扱い店舗を罫線で区切った2列、キャプション付きの縦長の写真。
- 質問: 罫線付きの行。質問は左、答えは右。
- 最大幅は約1120px、セクションの間隔は128px（スマートフォンでは88px）。

COMPONENTS:
- カバーの色見本: 44pxの操作域の中に、32pxの浮き上がった円のラジオボタン。選ばれたものは3px離れた2pxのsky-inkのリングを持つ。選ぶと、その枕の色が棚で変わり（Campの枕は充填段階も変わる）、カバーの名前が色見本の横に出る。
- ボタン: 高さ50px、浮き上がった面、角丸16px、インク色の文字。押すと面の中へ沈む。
- カートに入れる: 選んだカバーのその枕を入れ、ショップバーの件数を更新し、polite なライブリージョンで知らせる。ボタンの横に「カートに1個」が出る。
- カート: 44pxの浮き上がったボタン。件数は空色の円の中に表示する。開くと、入っているもの、EUの配送料（€5.90、€60以上で無料）、合計を示す浮き上がった一覧が出る。Escapeか外側のクリックで閉じる。
- 営業時間: 今日の行は浮き上がり、「今日」と表示する。
- 罫線: 不透明度0.26の1pxの線。

MOTION:
- 読み込み時、およびカバーを選ぶたびに、棚のその枕が底面から一度膨らむ（0.7秒、わずかにオーバーシュートする）。ボタンはホバーで1px浮き、押すと沈む（0.16秒）。繰り返すアニメーションはなく、ほかは動かない。
- prefers-reduced-motionでは、すべての動きを切る。

FORBIDDEN:
- カード、錠剤型、同じ角丸の箱が並ぶ格子
- 見出しの上の小さなラベル、すべて大文字で字間を広げたラベル
- それ自体を見せるためのニューモーフィズムのトグルとスライダー、灰色の上の灰色の文字、縁のない影
- 描かれた風船、雲、顔、その他の具象的なイラスト
- すりガラスのぼかし、グラデーションの染み、パステルの虹
- 自分のスタイルについてのページ

OUTPUT:
1) トークン、二種類の面、枕の形のための CSS カスタムプロパティ
2) 意味のある HTML と CSS
3) 横スクロールなしで320pxまで対応するレスポンシブレイアウト
4) 動作するコントロール: 枕ごとのカバーのラジオ、ライブの件数とカート一覧付きのカートに入れる、営業時間での今日の表示、見えるフォーカス、reduced-motion 対応`;

const PROMPTS: Record<Lang, string> = {
  en: PROMPT_EN,
  ko: PROMPT_KO,
  ja: PROMPT_JA,
};

const keyOf = (pillow: PillowId, cover: CoverId) => `${pillow}:${cover}`;

export function PortedFusionSoftInflatePage({ lang }: PortedStylePageProps) {
  const [covers, setCovers] = useState<Record<PillowId, CoverId>>({ travel: 'chalk', camp: 'sky', wide: 'slate' });
  const [bag, setBag] = useState<Record<string, number>>({});
  const [bagOpen, setBagOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [now, setNow] = useState(() => annecyNow(new Date()));
  const bagRef = useRef<HTMLDivElement>(null);
  const bagButtonRef = useRef<HTMLButtonElement>(null);
  const t = (text: Tri) => text[lang];

  const count = Object.values(bag).reduce((sum, n) => sum + n, 0);
  const lines = PILLOWS.flatMap((pillow) =>
    COVERS.filter((cover) => (bag[keyOf(pillow.id, cover.id)] ?? 0) > 0).map((cover) => ({
      key: keyOf(pillow.id, cover.id),
      pillow,
      cover,
      n: bag[keyOf(pillow.id, cover.id)],
    })),
  );
  const subtotal = lines.reduce((sum, line) => sum + line.n * line.pillow.price, 0);
  const delivery = subtotal >= FREE_FROM ? 0 : DELIVERY;

  // The time in Annecy moves on while the page is open, so today and the open line follow it.
  useEffect(() => {
    const timer = window.setInterval(() => setNow(annecyNow(new Date())), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  // The bag list closes on Escape and on a click anywhere else. Escape from inside the bag
  // hands focus back to the bag button.
  useEffect(() => {
    if (!bagOpen) return;
    const onPointer = (event: PointerEvent) => {
      if (!bagRef.current?.contains(event.target as Node)) setBagOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (bagRef.current?.contains(document.activeElement)) bagButtonRef.current?.focus();
      setBagOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [bagOpen]);

  const addToBag = (pillowId: PillowId) => {
    const pillow = PILLOWS.find((entry) => entry.id === pillowId) ?? PILLOWS[0];
    const cover = covers[pillowId];
    const key = keyOf(pillowId, cover);
    setBag({ ...bag, [key]: (bag[key] ?? 0) + 1 });
    const n = count + 1;
    setAnnouncement(fill(t(n === 1 ? TOP.addedOne : TOP.addedMany), { pillow: t(pillow.name), cover: t(coverName(cover)), n }));
  };

  const open = OPEN[now.day];
  let status: string;
  if (open && now.minutes >= open[0] && now.minutes < open[1]) {
    status = fill(t(SHOP.openNow), { time: clock(open[1]) });
  } else if (open && now.minutes < open[0]) {
    status = fill(t(SHOP.opensToday), { time: clock(open[0]) });
  } else {
    const ahead = [1, 2, 3, 4, 5, 6, 7].find((step) => OPEN[(now.day + step) % 7] !== null) ?? 1;
    const day = (now.day + ahead) % 7;
    const time = clock((OPEN[day] as Span)[0]);
    status = ahead === 1 ? fill(t(SHOP.opensTomorrow), { time }) : fill(t(SHOP.opensOn), { day: t(WEEKDAYS[day]), time });
  }

  const campCover = covers.camp;

  return (
    <FusionShell
      fusionId="fusion-soft-inflate"
      lang={lang}
      tone="light"
      accent="#0369a1"
      prev={{ href: '/pages/fusion-pure-noir.html', label: 'Pure Noir' }}
      prompts={PROMPTS}
    >
      <div className="cr">
        <header className="cr-bar">
          <p className="cr-mark">{NAME}</p>
          <nav className="cr-bar__nav" aria-label={t(TOP.nav)}>
            <a href="#cr-pillows">{t(TOP.pillows)}</a>
            <a href="#cr-fill">{t(TOP.fill)}</a>
            <a href="#cr-shop">{t(TOP.shop)}</a>
            <a href="#cr-questions">{t(TOP.questions)}</a>
          </nav>
          <div className="cr-bag" ref={bagRef}>
            <button
              ref={bagButtonRef}
              type="button"
              className="cr-bag__button cr-raised"
              aria-expanded={bagOpen}
              aria-controls="cr-bag-list"
              onClick={() => setBagOpen(!bagOpen)}
            >
              {t(TOP.bag)} <span className="cr-bag__count">{count}</span>
            </button>
            <div className="cr-bag__list cr-raised" id="cr-bag-list" hidden={!bagOpen}>
              <p className="cr-bag__title">{t(TOP.bagTitle)}</p>
              {lines.length === 0 ? (
                <p className="cr-bag__empty">{t(TOP.bagEmpty)}</p>
              ) : (
                <>
                  <ul className="cr-bag__lines">
                    {lines.map((line) => (
                      <li key={line.key}>
                        <span>
                          {fill(t(TOP.line), { pillow: t(line.pillow.name), cover: t(line.cover.name) })}
                          {line.n > 1 ? ` × ${line.n}` : ''}
                        </span>
                        <b>{money(line.n * line.pillow.price)}</b>
                      </li>
                    ))}
                  </ul>
                  <dl className="cr-bag__sum">
                    <div>
                      <dt>{t(TOP.delivery)}</dt>
                      <dd>{delivery === 0 ? t(TOP.free) : money(delivery)}</dd>
                    </div>
                    <div className="cr-bag__total">
                      <dt>{t(TOP.total)}</dt>
                      <dd>{money(subtotal + delivery)}</dd>
                    </div>
                  </dl>
                  <p className="cr-bag__note">{t(TOP.freeFrom)}</p>
                </>
              )}
            </div>
          </div>
          <p className="cr-vh" role="status">{announcement}</p>
        </header>

        <section className="cr-hero cr-raised" aria-labelledby="cr-name">
          <img src={IMG.balloon.src} alt={t(IMG.balloon.alt)} width={1800} height={1200} fetchPriority="high" decoding="async" />
          <div className="cr-hero__say">
            <div>
              <h1 className="cr-name" id="cr-name">{NAME}</h1>
              <p className="cr-hero__line">{t(HERO.line)}</p>
            </div>
            <a className="cr-btn cr-raised" href="#cr-pillows">{t(HERO.cta)}</a>
          </div>
        </section>

        <section className="cr-section" id="cr-pillows" aria-labelledby="cr-pillows-title">
          <div className="cr-head">
            <h2 id="cr-pillows-title" className="cr-h2">{t(SHELF.title)}</h2>
            <p>{t(SHELF.note)}</p>
          </div>

          <div className="cr-shelf cr-well cr-cols" aria-hidden="true">
            {PILLOWS.map((pillow) => (
              <div key={pillow.id}>
                {/* A new key mounts a new pillow, so a newly chosen cover inflates it once. */}
                <div key={covers[pillow.id]} className={`cr-puff cr-puff--${covers[pillow.id]} cr-puff--${pillow.id}`} />
                <span className="cr-dims">{pillow.size}</span>
              </div>
            ))}
          </div>

          <div className="cr-prods cr-cols">
            {PILLOWS.map((pillow) => {
              const chosen = covers[pillow.id];
              const held = COVERS.reduce((sum, cover) => sum + (bag[keyOf(pillow.id, cover.id)] ?? 0), 0);
              return (
                <article key={pillow.id} className="cr-prod" aria-labelledby={`cr-${pillow.id}-name`}>
                  <div className="cr-prod__title">
                    <h3 id={`cr-${pillow.id}-name`} className="cr-h3">{t(pillow.name)}</h3>
                    <span className="cr-price">{money(pillow.price)}</span>
                  </div>
                  <p className="cr-prod__size">{pillow.size}</p>
                  <p className="cr-prod__body">{t(pillow.body)}</p>
                  <fieldset className="cr-cover">
                    <legend className="cr-vh">{fill(t(SHELF.legend), { pillow: t(pillow.name) })}</legend>
                    <span className="cr-cover__name" aria-hidden="true">{t(coverName(chosen))}</span>
                    {COVERS.map((cover) => (
                      <label key={cover.id} className={`cr-sw cr-sw--${cover.id}`}>
                        <input
                          type="radio"
                          name={`cr-cover-${pillow.id}`}
                          value={cover.id}
                          checked={cover.id === chosen}
                          onChange={() => setCovers({ ...covers, [pillow.id]: cover.id })}
                        />
                        <span className="cr-vh">{t(cover.name)}</span>
                      </label>
                    ))}
                  </fieldset>
                  <div className="cr-prod__buy">
                    <button
                      type="button"
                      className="cr-btn cr-raised"
                      aria-describedby={`cr-${pillow.id}-name`}
                      onClick={() => addToBag(pillow.id)}
                    >
                      {t(SHELF.add)}
                    </button>
                    {held > 0 ? <p className="cr-prod__have">{fill(t(SHELF.have), { n: held })}</p> : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="cr-section" id="cr-fill" aria-labelledby="cr-fill-title">
          <div className="cr-head">
            <h2 id="cr-fill-title" className="cr-h2">{t(FILL.title)}</h2>
            <p>{t(FILL.note)}</p>
          </div>
          <div className="cr-tray cr-well" aria-hidden="true">
            {STAGES.map((stage) => (
              <div key={stage}>
                <div className={`cr-puff cr-puff--${campCover} cr-stage--${stage}`} />
              </div>
            ))}
          </div>
          <ol className="cr-steps">
            {STEPS.map((step, index) => (
              <li key={step.title.en} className="cr-step">
                <b className="cr-step__n">{index + 1}</b>
                <h3 className="cr-step__title">{t(step.title)}</h3>
                <p>{t(step.body)}</p>
              </li>
            ))}
          </ol>

          <div className="cr-made">
            <figure className="cr-frame cr-raised">
              <img src={IMG.fabric.src} alt={t(IMG.fabric.alt)} width={1000} height={1000} loading="lazy" decoding="async" />
            </figure>
            <div>
              <h3 className="cr-h3 cr-made__title">{t(FILL.made)}</h3>
              <dl className="cr-mat">
                {MATERIALS.map(([term, value]) => (
                  <div key={term.en}>
                    <dt>{t(term)}</dt>
                    <dd>{t(value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="cr-section" id="cr-shop" aria-labelledby="cr-shop-title">
          <div className="cr-head">
            <h2 id="cr-shop-title" className="cr-h2">{t(SHOP.title)}</h2>
            <p>{t(SHOP.note)}</p>
          </div>
          <div className="cr-visit">
            <div>
              <address className="cr-addr">
                {t(SHOP.street)}
                <br />
                {t(SHOP.town)}
              </address>
              <ul className="cr-hours" aria-label={t(SHOP.hours)}>
                {HOUR_ROWS.map((row) => {
                  const span = OPEN[row.days[0]];
                  const today = row.days.includes(now.day);
                  return (
                    <li
                      key={row.label.en}
                      className={[today && 'cr-raised is-today', !span && 'is-closed'].filter(Boolean).join(' ') || undefined}
                      aria-current={today ? 'date' : undefined}
                    >
                      <span>
                        {t(row.label)}
                        {today ? <> <span className="cr-today">{t(SHOP.today)}</span></> : null}
                      </span>
                      <b>{span ? `${clock(span[0])} – ${clock(span[1])}` : t(SHOP.closed)}</b>
                    </li>
                  );
                })}
              </ul>
              <p className="cr-now">{status}</p>
              <div className="cr-else">
                <h3 className="cr-h3 cr-else__title">{t(SHOP.also)}</h3>
                <ul className="cr-stock">
                  {STOCKISTS.map((stockist) => (
                    <li key={stockist.name}>
                      {stockist.name}
                      <span>{t(stockist.city)}</span>
                    </li>
                  ))}
                </ul>
                <p>{t(SHOP.post)}</p>
              </div>
            </div>
            <figure className="cr-vis">
              <div className="cr-frame cr-raised">
                <img src={IMG.bench.src} alt={t(IMG.bench.alt)} width={1200} height={1500} loading="lazy" decoding="async" />
              </div>
              <figcaption>{t(SHOP.caption)}</figcaption>
            </figure>
          </div>
        </section>

        <section className="cr-section" id="cr-questions" aria-labelledby="cr-questions-title">
          <div className="cr-head">
            <h2 id="cr-questions-title" className="cr-h2">{t(FOOT.questions)}</h2>
          </div>
          <dl className="cr-faq">
            {QUESTIONS.map(([question, answer]) => (
              <div key={question.en}>
                <dt>{t(question)}</dt>
                <dd>{t(answer)}</dd>
              </div>
            ))}
          </dl>
        </section>

        <footer className="cr-foot">
          <p className="cr-mark">{NAME}</p>
          <p>
            {withNodes(t(FOOT.credits), {
              a: <a href={IMG.balloon.credit.url}>{IMG.balloon.credit.name}</a>,
              b: <a href={IMG.fabric.credit.url}>{IMG.fabric.credit.name}</a>,
              c: <a href={IMG.bench.credit.url}>{IMG.bench.credit.name}</a>,
              u: <a href="https://unsplash.com">Unsplash</a>,
            })}
          </p>
        </footer>
      </div>
    </FusionShell>
  );
}
