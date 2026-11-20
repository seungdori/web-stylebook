import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedEarthAtelierPage.css';

// The shop page of Madder & Weld, a natural dye house in Porto, in the Earth Atelier style.
// Every coloured surface on the page is a piece of dyed linen: cut swatches with pinked
// edges, goods drawn to one scale, colourway chips, a vat calendar drawn like a weaving
// draft and an indigo square from the workshop. Hedvig Letters Serif sets names, prices
// and dates; Hedvig Letters Sans sets everything you read or press. Each has one weight.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;
type Vars = CSSProperties & Record<`--${string}`, string | number>;

const fill = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));

const money = (value: number) => `€${value}`;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NAME = 'Madder & Weld';
const EMAIL = 'ola@madderandweld.pt';
const PHONE = '+351 222 014 387';
const PHONE_HREF = 'tel:+351222014387';

type DyeId = 'madder' | 'terra' | 'weld' | 'green' | 'indigo' | 'gall';

const dye = (id: DyeId) => `var(--mw-${id})`;

const TOP = {
  nav: { en: 'Shop sections', ko: '매장 메뉴', ja: 'ショップ内メニュー' },
  shop: { en: 'Shop', ko: '매장', ja: 'ショップ' },
  vats: { en: 'Vats', ko: '염색 통', ja: '染槽' },
  workshop: { en: 'Workshops', ko: '워크숍', ja: 'ワークショップ' },
  visit: { en: 'Visit', ko: '방문', ja: '来店案内' },
  basket: { en: 'Basket ({n})', ko: '장바구니 ({n})', ja: 'カゴ ({n})' },
  addedOne: {
    en: 'Added to the basket: {item}, {way}. 1 piece in the basket.',
    ko: '장바구니에 담았습니다: {item}, {way}. 장바구니에 1점 있습니다.',
    ja: 'カゴに入れました：{item}、{way}。カゴに1点あります。',
  },
  addedMany: {
    en: 'Added to the basket: {item}, {way}. {n} pieces in the basket.',
    ko: '장바구니에 담았습니다: {item}, {way}. 장바구니에 {n}점 있습니다.',
    ja: 'カゴに入れました：{item}、{way}。カゴに{n}点あります。',
  },
} satisfies Record<string, Tri>;

const HERO = {
  strip: { en: 'The colours in the shop this month', ko: '이번 달 매장의 색상', ja: '今月ショップで扱う色' },
  title: {
    en: 'Linen dyed with madder, weld, indigo and oak galls.',
    ko: '꼭두서니, 웰드, 인디고, 참나무 벌레혹으로 물들인 리넨.',
    ja: '西洋茜、ウェルド、インディゴ、没食子で染めたリネン。',
  },
  lede: {
    en: 'We dye washed linen in four vats behind our shop on Rua das Flores, Porto.',
    ko: '포르투 Rua das Flores의 매장 뒤편, 염색 통 네 개에서 세탁한 리넨을 물들입니다.',
    ja: 'ポルトのRua das Floresにある店の裏手、4つの染槽で洗ったリネンを染めています。',
  },
} satisfies Record<string, Tri>;

// Each swatch places its light and dark patches somewhere else, so no two cuts match.
const SWATCHES: Array<{ dye: DyeId; name: Tri; on: Tri; m1: string; m2: string }> = [
  {
    dye: 'madder',
    name: { en: 'Madder root', ko: '꼭두서니 뿌리', ja: '西洋茜の根' },
    on: { en: 'on alum', ko: '명반 매염', ja: '明礬媒染' },
    m1: '22% 26%',
    m2: '82% 78%',
  },
  {
    dye: 'terra',
    name: { en: 'Madder, second bath', ko: '꼭두서니, 두 번째 염액', ja: '西洋茜、2回目の染液' },
    on: { en: 'on alum and chalk', ko: '명반과 백악으로 매염', ja: '明礬と白亜で媒染' },
    m1: '66% 18%',
    m2: '24% 84%',
  },
  {
    dye: 'weld',
    name: { en: 'Weld', ko: '웰드', ja: 'ウェルド' },
    on: { en: 'on alum', ko: '명반 매염', ja: '明礬媒染' },
    m1: '30% 70%',
    m2: '78% 22%',
  },
  {
    dye: 'green',
    name: { en: 'Weld over indigo', ko: '인디고 위에 웰드', ja: 'インディゴの上にウェルド' },
    on: { en: 'on alum', ko: '명반 매염', ja: '明礬媒染' },
    m1: '74% 64%',
    m2: '20% 30%',
  },
  {
    dye: 'indigo',
    name: { en: 'Indigo', ko: '인디고', ja: 'インディゴ' },
    on: { en: 'no mordant needed', ko: '매염 불필요', ja: '媒染は不要' },
    m1: '40% 22%',
    m2: '70% 86%',
  },
  {
    dye: 'gall',
    name: { en: 'Oak galls', ko: '참나무 벌레혹', ja: '没食子' },
    on: { en: 'with iron', ko: '철 매염', ja: '鉄媒染' },
    m1: '76% 34%',
    m2: '26% 72%',
  },
];

const SHOP = {
  title: { en: 'In the shop', ko: '매장 상품', ja: '店頭の商品' },
  note: {
    en: 'Washed linen from a mill in Kaunas, dyed here and washed again before it ships. No two pieces come out quite the same shade.',
    ko: '카우나스의 방적 공장에서 들여온 리넨을 여기서 염색하고, 출고 전에 다시 세탁합니다. 같은 색으로 나오는 제품은 하나도 없습니다.',
    ja: 'カウナスの紡績工場から仕入れたリネンを、ここで染め、出荷前にもう一度洗います。同じ色に仕上がる製品は一つもありません。',
  },
  scale: { en: '50 cm. Every piece is drawn to this scale.', ko: '50cm. 모든 제품은 이 축척에 맞춰 그렸습니다.', ja: '50cm。すべての製品をこの縮尺で描いています。' },
  add: { en: 'Add to basket', ko: '장바구니에 담기', ja: 'カゴに入れる' },
  have: { en: '{n} in your basket', ko: '장바구니에 {n}점', ja: 'カゴに{n}点' },
} satisfies Record<string, Tri>;

type ItemId = 'napkins' | 'scarf' | 'runner';

interface Way {
  dye: DyeId;
  name: Tri;
  stock: Tri;
  // Only a few pieces are left in this colourway. The basket cannot take more.
  limit?: number;
  gone?: Tri;
}

interface Item {
  id: ItemId;
  name: Tri;
  size: Tri;
  legend: Tri;
  price: number;
  ways: Way[];
}

const ITEMS: Item[] = [
  {
    id: 'napkins',
    name: { en: 'Napkins, set of four', ko: '냅킨, 4장 세트', ja: 'ナプキン、4枚セット' },
    size: { en: '45 × 45 cm each, hemmed by hand', ko: '각 45 × 45cm, 손 단처리', ja: '各45 × 45cm、手縫いのヘム仕上げ' },
    legend: { en: 'Colourway for the napkins', ko: '냅킨 색상 선택', ja: 'ナプキンの色を選択' },
    price: 48,
    ways: [
      {
        dye: 'madder',
        name: { en: 'Madder', ko: '꼭두서니', ja: '西洋茜' },
        stock: { en: 'In stock, ships on Monday', ko: '재고 있음, 월요일 출고', ja: '在庫あり、月曜日に出荷' },
      },
      {
        dye: 'weld',
        name: { en: 'Weld', ko: '웰드', ja: 'ウェルド' },
        stock: {
          en: 'Dyed to order in the weld bath on 25 November, ships on the 27th',
          ko: '11월 25일 웰드 염액에서 주문 염색, 27일 출고',
          ja: '11月25日にウェルド染液で受注染色、27日出荷',
        },
      },
      {
        dye: 'indigo',
        name: { en: 'Indigo', ko: '인디고', ja: 'インディゴ' },
        stock: { en: 'In stock, ships on Monday', ko: '재고 있음, 월요일 출고', ja: '在庫あり、月曜日に出荷' },
      },
      {
        dye: 'gall',
        name: { en: 'Oak gall', ko: '참나무 벌레혹', ja: '没食子' },
        stock: { en: 'Last 3 sets in oak gall', ko: '참나무 벌레혹 3세트 남음', ja: '没食子は残り3セット' },
        limit: 3,
        gone: {
          en: 'All 3 sets in oak gall are in your basket',
          ko: '참나무 벌레혹 3세트가 모두 장바구니에 있습니다',
          ja: '没食子の3セットはすべてカゴに入っています',
        },
      },
    ],
  },
  {
    id: 'scarf',
    name: { en: 'Scarf', ko: '스카프', ja: 'スカーフ' },
    size: { en: '50 × 180 cm, light linen with fringed ends', ko: '50 × 180cm, 끝단 술 장식이 있는 가벼운 리넨', ja: '50 × 180cm、房飾り付きの軽いリネン' },
    legend: { en: 'Colourway for the scarf', ko: '스카프 색상 선택', ja: 'スカーフの色を選択' },
    price: 72,
    ways: [
      {
        dye: 'indigo',
        name: { en: 'Indigo', ko: '인디고', ja: 'インディゴ' },
        stock: { en: 'Last 2 in indigo', ko: '인디고 2장 남음', ja: 'インディゴは残り2点' },
        limit: 2,
        gone: {
          en: 'Both indigo scarves are in your basket',
          ko: '인디고 스카프 2장이 모두 장바구니에 있습니다',
          ja: 'インディゴのスカーフ2点はすべてカゴに入っています',
        },
      },
      {
        dye: 'green',
        name: { en: 'Weld over indigo', ko: '인디고 위에 웰드', ja: 'インディゴの上にウェルド' },
        stock: {
          en: 'Dyed to order on 1 December, ships on the 3rd',
          ko: '12월 1일 주문 염색, 3일 출고',
          ja: '12月1日に受注染色、3日出荷',
        },
      },
      {
        dye: 'terra',
        name: { en: 'Madder, second bath', ko: '꼭두서니, 두 번째 염액', ja: '西洋茜、2回目の染液' },
        stock: { en: 'In stock, ships on Monday', ko: '재고 있음, 월요일 출고', ja: '在庫あり、月曜日に出荷' },
      },
    ],
  },
  {
    id: 'runner',
    name: { en: 'Table runner', ko: '테이블 러너', ja: 'テーブルランナー' },
    size: { en: '40 × 200 cm, heavy linen, mitred corners', ko: '40 × 200cm, 두꺼운 리넨, 모서리 45도 접음', ja: '40 × 200cm、厚手のリネン、角は45度に留め' },
    legend: { en: 'Colourway for the table runner', ko: '테이블 러너 색상 선택', ja: 'テーブルランナーの色を選択' },
    price: 64,
    ways: [
      {
        dye: 'weld',
        name: { en: 'Weld', ko: '웰드', ja: 'ウェルド' },
        stock: {
          en: 'Dyed to order in the weld bath on 25 November, ships on the 27th',
          ko: '11월 25일 웰드 염액에서 주문 염색, 27일 출고',
          ja: '11月25日にウェルド染液で受注染色、27日出荷',
        },
      },
      {
        dye: 'terra',
        name: { en: 'Madder, second bath', ko: '꼭두서니, 두 번째 염액', ja: '西洋茜、2回目の染液' },
        stock: {
          en: 'Dyed to order on 2 and 3 December, ships on the 5th',
          ko: '12월 2일과 3일 주문 염색, 5일 출고',
          ja: '12月2日と3日に受注染色、5日出荷',
        },
      },
      {
        dye: 'gall',
        name: { en: 'Oak gall', ko: '참나무 벌레혹', ja: '没食子' },
        stock: {
          en: 'Dyed to order: tannin on 27 November, iron on the 30th, ships on 2 December',
          ko: '주문 염색: 11월 27일 타닌, 30일 철, 12월 2일 출고',
          ja: '受注染色：11月27日タンニン、30日鉄媒染、12月2日出荷',
        },
      },
    ],
  },
];

// Four napkins laid out overlapping, each with its own light and dark patches.
const NAPKINS = ['28% 30%', '70% 20%', '20% 80%', '64% 58%'];

const VATS_COPY = {
  title: { en: 'The vats, 20 November to 3 December', ko: '염색 통, 11월 20일~12월 3일', ja: '染槽、11月20日～12月3日' },
  note: {
    en: 'Each order goes into the next bath of its colour, then spends a day drying on the roof. The studio is closed on Sundays. Choose a bath to see what goes in.',
    ko: '주문은 같은 색의 다음 염액에 들어간 뒤, 하루 동안 지붕에서 말립니다. 일요일에는 스튜디오가 문을 닫습니다. 염액을 선택하면 무엇이 들어가는지 볼 수 있습니다.',
    ja: '注文は同じ色の次の染液に入り、その後1日、屋根の上で乾かします。日曜日はスタジオを休みます。染液を選ぶと、何が入るかご覧いただけます。',
  },
  group: {
    en: 'Dye baths from Friday 20 November to Thursday 3 December',
    ko: '11월 20일 금요일부터 12월 3일 목요일까지 염액',
    ja: '11月20日（金）から12月3日（木）までの染液',
  },
  today: { en: 'today', ko: '오늘', ja: '今日' },
} satisfies Record<string, Tri>;

const DAYS: Array<{ weekday: Tri; date: string; month?: Tri; shut?: boolean }> = [
  { weekday: { en: 'Fri', ko: '금', ja: '金' }, date: '20' },
  { weekday: { en: 'Sat', ko: '토', ja: '土' }, date: '21' },
  { weekday: { en: 'Sun', ko: '일', ja: '日' }, date: '22', shut: true },
  { weekday: { en: 'Mon', ko: '월', ja: '月' }, date: '23' },
  { weekday: { en: 'Tue', ko: '화', ja: '火' }, date: '24' },
  { weekday: { en: 'Wed', ko: '수', ja: '水' }, date: '25' },
  { weekday: { en: 'Thu', ko: '목', ja: '木' }, date: '26' },
  { weekday: { en: 'Fri', ko: '금', ja: '金' }, date: '27' },
  { weekday: { en: 'Sat', ko: '토', ja: '土' }, date: '28' },
  { weekday: { en: 'Sun', ko: '일', ja: '日' }, date: '29', shut: true },
  { weekday: { en: 'Mon', ko: '월', ja: '月' }, date: '30' },
  { weekday: { en: 'Tue', ko: '화', ja: '火' }, date: '1', month: { en: 'Dec', ko: '12월', ja: '12月' } },
  { weekday: { en: 'Wed', ko: '수', ja: '水' }, date: '2' },
  { weekday: { en: 'Thu', ko: '목', ja: '木' }, date: '3' },
];

const VATS: Array<{ dye: DyeId; name: Tri; note: Tri }> = [
  { dye: 'madder', name: { en: 'Madder', ko: '꼭두서니', ja: '西洋茜' }, note: { en: '60 °C, left overnight', ko: '60°C, 밤새 둠', ja: '60°C、一晩置く' } },
  { dye: 'weld', name: { en: 'Weld', ko: '웰드', ja: 'ウェルド' }, note: { en: '80 °C for one hour', ko: '80°C에서 1시간', ja: '80°Cで1時間' } },
  { dye: 'indigo', name: { en: 'Indigo', ko: '인디고', ja: 'インディゴ' }, note: { en: 'cold, kept going', ko: '상온, 계속 담금', ja: '常温、浸け足しながら' } },
  { dye: 'gall', name: { en: 'Oak gall', ko: '참나무 벌레혹', ja: '没食子' }, note: { en: 'tannin, then iron', ko: '타닌, 그다음 철', ja: 'タンニン、その後に鉄媒染' } },
];

// `day` is the index in DAYS, `vat` the index in VATS, `len` the number of days the bath runs.
const BATHS: Array<{ id: string; day: number; len?: number; vat: number; dye: DyeId; label: Tri; title: Tri; body: Tri }> = [
  {
    id: 'b20',
    day: 0,
    vat: 2,
    dye: 'indigo',
    label: {
      en: 'Indigo, today, Friday 20 November: last two dips for 14 scarves',
      ko: '인디고, 오늘 11월 20일 금요일: 스카프 14장 마지막 두 번 담금',
      ja: 'インディゴ、今日11月20日（金）：スカーフ14点の最後の2回の浸染',
    },
    title: { en: 'Friday 20 November, indigo', ko: '11월 20일 금요일, 인디고', ja: '11月20日（金）、インディゴ' },
    body: {
      en: 'The last two of four dips for 14 scarves that had their first two yesterday. Each dip is three minutes under the surface and twenty in the air, while the cloth turns from green to blue.',
      ko: '어제 첫 두 번을 담근 스카프 14장을 네 번 중 마지막 두 번 담급니다. 한 번 담글 때마다 액 속에 3분, 공기 중에 20분 두며, 그동안 천은 초록에서 파랑으로 바뀝니다.',
      ja: '昨日最初の2回を浸した、スカーフ14点の4回のうち最後の2回です。1回ごとに液の中に3分、空気中に20分置き、その間に布は緑から青へ変わります。',
    },
  },
  {
    id: 'b21',
    day: 1,
    vat: 2,
    dye: 'indigo',
    label: { en: 'Indigo, Saturday 21 November: workshop', ko: '인디고, 11월 21일 토요일: 워크숍', ja: 'インディゴ、11月21日（土）：ワークショップ' },
    title: { en: 'Saturday 21 November, indigo workshop', ko: '11월 21일 토요일, 인디고 워크숍', ja: '11月21日（土）、インディゴのワークショップ' },
    body: {
      en: 'Six people fold and clamp their squares in the morning and dip them after lunch. The vat is theirs for the day, so no orders go in.',
      ko: '참가자 6명이 오전에 천을 접어 집게로 고정하고, 점심 뒤에 담급니다. 이날은 이 염색 통을 참가자가 하루 종일 쓰므로 주문은 들어가지 않습니다.',
      ja: '参加者6名が午前に布を畳んで締め具で留め、昼食後に浸します。この日は一日中この染槽を参加者が使うため、注文は入れません。',
    },
  },
  {
    id: 'b23',
    day: 3,
    len: 2,
    vat: 0,
    dye: 'madder',
    label: {
      en: 'Madder, Monday 23 and Tuesday 24 November: 30 sets of napkins',
      ko: '꼭두서니, 11월 23일 월요일과 24일 화요일: 냅킨 30세트',
      ja: '西洋茜、11月23日（月）と24日（火）：ナプキン30セット',
    },
    title: { en: 'Monday 23 and Tuesday 24 November, madder', ko: '11월 23일 월요일과 24일 화요일, 꼭두서니', ja: '11月23日（月）と24日（火）、西洋茜' },
    body: {
      en: 'Ground madder root, half the weight of the cloth, held at 60 °C and left in the vat overnight. Going in: 30 sets of napkins, mordanted with alum the week before.',
      ko: '꼭두서니 뿌리를 갈아 천 무게의 절반을 넣고 60°C로 유지한 뒤 밤새 염색 통에 둡니다. 들어가는 제품: 냅킨 30세트, 전주에 명반으로 매염한 것.',
      ja: '西洋茜の根を挽いて布の重さの半分を入れ、60°Cに保って一晩染槽に置きます。投入するもの：ナプキン30セット（前週に明礬で媒染済み）。',
    },
  },
  {
    id: 'b25',
    day: 5,
    vat: 1,
    dye: 'weld',
    label: {
      en: 'Weld, Wednesday 25 November: 12 table runners and 20 sets of napkins',
      ko: '웰드, 11월 25일 수요일: 테이블 러너 12장과 냅킨 20세트',
      ja: 'ウェルド、11月25日（水）：テーブルランナー12点とナプキン20セット',
    },
    title: { en: 'Wednesday 25 November, weld', ko: '11월 25일 수요일, 웰드', ja: '11月25日（水）、ウェルド' },
    body: {
      en: '1.2 kg of dried weld for 4 kg of linen, held at 80 °C for one hour. Going in: 12 table runners and 20 sets of napkins, every weld order placed by Monday night.',
      ko: '리넨 4kg에 건조 웰드 1.2kg을 넣고 80°C에서 1시간 유지합니다. 들어가는 제품: 테이블 러너 12장과 냅킨 20세트. 월요일 밤까지 들어온 웰드 주문은 모두 포함합니다.',
      ja: 'リネン4kgに乾燥ウェルド1.2kgを使い、80°Cで1時間保ちます。投入するもの：テーブルランナー12点とナプキン20セット。月曜日の夜までに入ったウェルドのご注文はすべて含みます。',
    },
  },
  {
    id: 'b26',
    day: 6,
    len: 2,
    vat: 2,
    dye: 'indigo',
    label: {
      en: 'Indigo, Thursday 26 and Friday 27 November: 16 scarves',
      ko: '인디고, 11월 26일 목요일과 27일 금요일: 스카프 16장',
      ja: 'インディゴ、11月26日（木）と27日（金）：スカーフ16点',
    },
    title: {
      en: 'Thursday 26 and Friday 27 November, indigo',
      ko: '11월 26일 목요일과 27일 금요일, 인디고',
      ja: '11月26日（木）と27日（金）、インディゴ',
    },
    body: {
      en: 'Two dips a day for 16 scarves. They need four dips over two days to reach the blue of the swatch.',
      ko: '스카프 16장을 하루에 두 번씩 담급니다. 견본의 파랑에 이르려면 이틀 동안 네 번 담가야 합니다.',
      ja: 'スカーフ16点を1日2回ずつ浸します。見本の青に届かせるには、2日間で4回浸す必要があります。',
    },
  },
  {
    id: 'b27',
    day: 7,
    vat: 3,
    dye: 'gall',
    label: {
      en: 'Oak gall tannin bath, Friday 27 November: 8 table runners',
      ko: '참나무 벌레혹 타닌 염액, 11월 27일 금요일: 테이블 러너 8장',
      ja: '没食子タンニン液、11月27日（金）：テーブルランナー8点',
    },
    title: { en: 'Friday 27 November, oak gall', ko: '11월 27일 금요일, 참나무 벌레혹', ja: '11月27日（金）、没食子' },
    body: {
      en: 'Crushed oak galls, soaked for a week, make the tannin bath. 8 table runners steep in it overnight and stay a pale beige until the iron bath on Monday.',
      ko: '참나무 벌레혹을 빻아 일주일 불려서 타닌 염액을 만듭니다. 테이블 러너 8장은 이 염액에 밤새 담가 두고, 월요일 철 염액 전까지 옅은 베이지색으로 남습니다.',
      ja: '没食子を砕いて1週間浸し、タンニン液を作ります。テーブルランナー8点は一晩この液に浸し、月曜日の鉄媒染液に入れるまで淡いベージュのままです。',
    },
  },
  {
    id: 'b28',
    day: 8,
    vat: 2,
    dye: 'indigo',
    label: { en: 'Indigo, Saturday 28 November: workshop', ko: '인디고, 11월 28일 토요일: 워크숍', ja: 'インディゴ、11月28日（土）：ワークショップ' },
    title: { en: 'Saturday 28 November, indigo workshop', ko: '11월 28일 토요일, 인디고 워크숍', ja: '11月28日（土）、インディゴのワークショップ' },
    body: {
      en: 'The last workshop in November. The vat is kept for the class all day, so no orders go in.',
      ko: '11월의 마지막 워크숍입니다. 수업을 위해 하루 종일 이 염색 통을 비워 두므로 주문은 들어가지 않습니다.',
      ja: '11月最後のワークショップです。授業のため一日中この染槽を空けておくので、注文は入れません。',
    },
  },
  {
    id: 'b30',
    day: 10,
    vat: 3,
    dye: 'gall',
    label: {
      en: 'Iron bath, Monday 30 November: the same 8 table runners',
      ko: '철 염액, 11월 30일 월요일: 같은 테이블 러너 8장',
      ja: '鉄媒染液、11月30日（月）：同じテーブルランナー8点',
    },
    title: { en: 'Monday 30 November, iron', ko: '11월 30일 월요일, 철', ja: '11月30日（月）、鉄媒染' },
    body: {
      en: 'Ten minutes in iron water turns the tannin from beige to the grey of the swatch. Any longer and the linen weakens.',
      ko: '철 용액에 10분 담그면 타닌의 베이지색이 견본의 회색으로 바뀝니다. 더 오래 담그면 리넨이 약해집니다.',
      ja: '鉄水に10分浸すと、タンニンのベージュが見本のグレーに変わります。それ以上浸すとリネンが弱くなります。',
    },
  },
  {
    id: 'b01',
    day: 11,
    vat: 1,
    dye: 'green',
    label: {
      en: 'Weld over indigo, Tuesday 1 December: 10 scarves',
      ko: '인디고 위에 웰드, 12월 1일 화요일: 스카프 10장',
      ja: 'インディゴの上にウェルド、12月1日（火）：スカーフ10点',
    },
    title: { en: 'Tuesday 1 December, weld over indigo', ko: '12월 1일 화요일, 인디고 위에 웰드', ja: '12月1日（火）、インディゴの上にウェルド' },
    body: {
      en: '10 scarves dipped twice in indigo last week go into a fresh weld bath. Yellow over pale blue gives the green in the shop.',
      ko: '지난주 인디고에 두 번 담근 스카프 10장을 새 웰드 염액에 넣습니다. 옅은 파랑 위의 노랑이 매장의 초록을 만듭니다.',
      ja: '先週インディゴに2回浸したスカーフ10点を、新しいウェルド液に入れます。淡い青の上の黄色が、店頭の緑になります。',
    },
  },
  {
    id: 'b02',
    day: 12,
    len: 2,
    vat: 0,
    dye: 'terra',
    label: {
      en: 'Madder, second bath, Wednesday 2 and Thursday 3 December: 14 table runners',
      ko: '꼭두서니, 두 번째 염액, 12월 2일 수요일과 3일 목요일: 테이블 러너 14장',
      ja: '西洋茜、2回目の染液、12月2日（水）と3日（木）：テーブルランナー14点',
    },
    title: {
      en: 'Wednesday 2 and Thursday 3 December, madder, second bath',
      ko: '12월 2일 수요일과 3일 목요일, 꼭두서니 두 번째 염액',
      ja: '12月2日（水）と3日（木）、西洋茜の2回目の染液',
    },
    body: {
      en: 'The madder left from the napkins is used again with a little chalk. It gives the softer, browner red of the second swatch. Going in: 14 table runners.',
      ko: '냅킨을 염색하고 남은 꼭두서니 액에 백악을 조금 넣어 다시 씁니다. 두 번째 견본의 더 부드럽고 갈색빛이 도는 붉은색이 나옵니다. 들어가는 제품: 테이블 러너 14장.',
      ja: 'ナプキンの染色後に残った西洋茜の液に白亜を少し加えて再び使います。2つ目の見本のより柔らかく茶色みを帯びた赤になります。投入するもの：テーブルランナー14点。',
    },
  },
];

const WORKSHOP = {
  title: { en: 'Indigo workshop on Saturdays', ko: '토요일 인디고 워크숍', ja: '毎週土曜のインディゴ・ワークショップ' },
  body: {
    en: 'Six people around one indigo vat for a day. You fold, clamp and dip a 50 × 50 cm linen square and a cotton tote, and take both home.',
    ko: '하루 동안 인디고 염색 통 하나를 둘러싸고 6명이 함께합니다. 50 × 50cm 리넨 천과 면 토트백을 접고, 집게로 고정하고, 담가서 둘 다 가져갑니다.',
    ja: '1日、インディゴの染槽を囲んで6名で作業します。50 × 50cmのリネンの布と綿のトートバッグを、畳んで締め、浸して、両方お持ち帰りいただけます。',
  },
  figure: {
    en: 'A linen square dyed in indigo with a grid of pale squares where the wooden blocks pressed',
    ko: '인디고로 물들인 리넨 천. 나무 블록이 눌렀던 자리는 옅은 사각형 격자로 남아 있습니다',
    ja: 'インディゴで染めたリネンの布。木型が押さえた部分に淡い正方形の格子が残っています',
  },
  caption: {
    en: 'Folded into a small square stack and clamped between two wooden blocks. Where the blocks pressed, the indigo did not reach.',
    ko: '작은 정사각형으로 접어 나무 블록 두 개 사이에 끼워 고정합니다. 블록이 눌렀던 자리에는 인디고가 닿지 않았습니다.',
    ja: '小さな正方形に畳み、2枚の木型で挟んで締めます。木型が押さえた部分には、インディゴが届きませんでした。',
  },
  dates: { en: 'Workshop date', ko: '워크숍 날짜', ja: 'ワークショップの日程' },
  full: { en: 'Full', ko: '마감', ja: '満席' },
  left: { en: '{n} of 6 left', ko: '6자리 중 {n}자리 남음', ja: '残り{n}席（全6席）' },
  name: { en: 'Your name', ko: '이름', ja: 'お名前' },
  email: { en: 'Email', ko: '이메일', ja: 'メールアドレス' },
  nameError: { en: 'Write the name for the seat.', ko: '자리를 예약할 이름을 입력해 주세요.', ja: '席の予約者のお名前を入力してください。' },
  emailError: {
    en: 'Check the email address. It needs an @ and a domain.',
    ko: '이메일 주소를 확인해 주세요. @와 도메인이 필요합니다.',
    ja: 'メールアドレスをご確認ください。@とドメインが必要です。',
  },
  book: { en: 'Book a seat on {date}', ko: '{date} 자리 예약하기', ja: '{date}の席を予約する' },
  paid: { en: '€95, paid when you book', ko: '€95, 예약할 때 결제', ja: '€95、予約時にお支払い' },
  doneTitle: { en: 'Your seat on {date} is booked', ko: '{date} 자리가 예약되었습니다', ja: '{date}の席を予約しました' },
  doneBody: {
    en: 'The receipt for €95 is on its way to {email}. We start at 10:00, so come a little early in clothes that can turn blue.',
    ko: '€95 영수증을 {email}(으)로 발송했습니다. 10:00에 시작하니, 파랗게 물들어도 괜찮은 옷을 입고 조금 일찍 오세요.',
    ja: '€95の領収書を{email}宛に送信しました。開始は10:00です。青く染まってもよい服装で、少し早めにお越しください。',
  },
  again: { en: 'Book another seat', ko: '다른 자리 예약하기', ja: '別の席を予約する' },
} satisfies Record<string, Tri>;

const WORKSHOP_FACTS: Array<[Tri, Tri]> = [
  [
    { en: 'Time', ko: '시간', ja: '時間' },
    { en: '10:00 to 15:00, lunch at 12:30', ko: '10:00~15:00, 점심 12:30', ja: '10:00～15:00、昼食は12:30' },
  ],
  [
    { en: 'Price', ko: '가격', ja: '料金' },
    { en: '€95 a seat, with the cloth, the tote and lunch', ko: '자리당 €95, 천, 토트백, 점심 포함', ja: '1席€95、布・トートバッグ・昼食込み' },
  ],
  [
    { en: 'Language', ko: '언어', ja: '言語' },
    { en: 'Portuguese and English', ko: '포르투갈어와 영어', ja: 'ポルトガル語と英語' },
  ],
  [
    { en: 'Wear', ko: '복장', ja: '服装' },
    { en: 'Clothes that can turn blue', ko: '파랗게 물들어도 괜찮은 옷', ja: '青く染まってもよい服' },
  ],
];

const SEATS = 6;

const DATES: Array<{ id: string; day: string; month: Tri; short: Tri; long: Tri; taken: number }> = [
  {
    id: 'nov-21',
    day: '21',
    month: { en: 'November', ko: '11월', ja: '11月' },
    short: { en: '21 November', ko: '11월 21일', ja: '11月21日' },
    long: { en: 'Saturday 21 November', ko: '11월 21일 토요일', ja: '11月21日（土）' },
    taken: 6,
  },
  {
    id: 'nov-28',
    day: '28',
    month: { en: 'November', ko: '11월', ja: '11月' },
    short: { en: '28 November', ko: '11월 28일', ja: '11月28日' },
    long: { en: 'Saturday 28 November', ko: '11월 28일 토요일', ja: '11月28日（土）' },
    taken: 4,
  },
  {
    id: 'dec-5',
    day: '5',
    month: { en: 'December', ko: '12월', ja: '12月' },
    short: { en: '5 December', ko: '12월 5일', ja: '12月5日' },
    long: { en: 'Saturday 5 December', ko: '12월 5일 토요일', ja: '12月5日（土）' },
    taken: 2,
  },
  {
    id: 'dec-12',
    day: '12',
    month: { en: 'December', ko: '12월', ja: '12月' },
    short: { en: '12 December', ko: '12월 12일', ja: '12月12日' },
    long: { en: 'Saturday 12 December', ko: '12월 12일 토요일', ja: '12月12日（土）' },
    taken: 1,
  },
];

// The pale squares the clamped blocks left. The dye crept in unevenly at each fold, so every
// square sits a little off, turns a little and has a softer or harder edge.
// [margin inside its cell, rotation in degrees, blur in px, opacity]
const RESIST: Array<[string, number, number, number]> = [
  ['27% 30% 25% 26%', -1.5, 1.6, 0.92],
  ['24% 27% 29% 28%', 2, 1.2, 0.88],
  ['29% 25% 26% 31%', 0.5, 2.1, 0.8],
  ['25% 31% 30% 24%', -2.5, 1.4, 0.9],
  ['31% 26% 23% 27%', 1.5, 1.8, 0.84],
  ['26% 28% 28% 26%', -0.5, 1.1, 0.95],
  ['23% 29% 31% 25%', 3, 1.5, 0.9],
  ['28% 23% 27% 31%', -2, 2.4, 0.78],
  ['31% 28% 23% 26%', 1, 1.9, 0.83],
  ['25% 26% 27% 29%', -3, 1.3, 0.93],
  ['27% 31% 29% 23%', 2.5, 1.2, 0.9],
  ['23% 25% 31% 30%', -1, 2.2, 0.8],
  ['30% 32% 24% 25%', 0, 2.6, 0.74],
  ['26% 27% 26% 28%', 1.5, 1.7, 0.86],
  ['31% 23% 28% 29%', -2, 1.4, 0.9],
  ['22% 30% 27% 27%', 2, 2, 0.82],
];

const VISIT = {
  title: { en: 'Visit the shop', ko: '매장 방문', ja: '店舗へのご来店' },
  body: {
    en: 'The shop is at the front of the building and the vats are in the yard behind it. Ask at the counter and we will take you through to see what is in the vats that day.',
    ko: '매장은 건물 앞쪽에 있고 염색 통은 뒤쪽 마당에 있습니다. 카운터에서 말씀해 주시면 그날 염색 통에 무엇이 있는지 직접 안내해 드리겠습니다.',
    ja: '店舗は建物の正面にあり、染槽は裏手の中庭にあります。カウンターでお声がけいただければ、その日どの染槽に何が入っているかご覧いただけるよう、ご案内します。',
  },
  address: { en: 'Address', ko: '주소', ja: '住所' },
  addressValue: { en: 'Rua das Flores 112, 4050-266 Porto', ko: 'Rua das Flores 112, 4050-266 Porto', ja: 'Rua das Flores 112, 4050-266 Porto' },
  hours: { en: 'Opening hours', ko: '영업시간', ja: '営業時間' },
  hoursValue: { en: 'Tuesday to Saturday, 11:00 to 19:00', ko: '화요일~토요일, 11:00~19:00', ja: '火曜日～土曜日、11:00～19:00' },
  route: { en: 'Getting there', ko: '오시는 길', ja: 'アクセス' },
  routeValue: {
    en: 'Five minutes on foot from São Bento station',
    ko: '상벤투역에서 도보 5분',
    ja: 'サン・ベント駅から徒歩5分',
  },
  contact: { en: 'Contact', ko: '연락처', ja: '連絡先' },
  made: { en: 'Linen woven in Kaunas, dyed in Porto', ko: '카우나스에서 짠 리넨, 포르투에서 물들임', ja: 'カウナスで織ったリネン、ポルトで染色' },
} satisfies Record<string, Tri>;

const PROMPT_EN = `Design one real page in Earth Atelier style — undyed linen, plant dyes and quiet ink, where every coloured surface on the page is a piece of dyed cloth.

Pick a believable subject that lives in natural materials, such as a natural dye house, a linen weaver, a ceramics studio or an herbal apothecary, and write its real content. The page must read as that subject's page, never as a page about its own style.

COLOR TOKENS:
--bg: #f4f3f1 (undyed linen)
--surface: #fbfaf8
--ink: #2e2a24
--muted: #59534a
--line: rgba(46, 42, 36, 0.32)
--rule: rgba(46, 42, 36, 0.6)
Dyes, used only as cloth:
--madder: #9b3a2a
--terra: #ab6b49
--weld: #ada640
--green: #56653d
--indigo: #283a57
--gall: #67635c
--flax: #d5d0c7
No other colours, except white, near-black and the ink at low opacity for the weave, edges, shadows, hovers and today's shade, and pale blue-greys around #c6cdd6 where the workshop's clamped blocks kept the indigo out. Text is ink or muted, linen on a filled button. Madder red marks low stock and form errors; indigo fills the one main button.

THE CLOTH:
- Every coloured surface is cloth: the dye colour under a fine plain weave (two repeating 1px thread gradients), a few thicker slubs, a fibre noise from an SVG feTurbulence stretched along the warp and along the weft, and two soft radial patches where the dye took lighter or darker.
- Cut swatches have pinking-shear zigzags along the top and bottom (a conic-gradient mask). Hemmed pieces get a darker turned edge and a dashed running stitch.
- Goods are drawn to one scale (2px per cm from 1200px wide, less on smaller screens) beside a 50 cm ruler, so a napkin, a scarf and a table runner keep their real proportions.
- Cloth that is a control (a colourway chip, a dye bath) gets a 1px dark edge so it holds 3:1 against the linen.
- No flat blocks of dye colour. Gradients only weave the cloth and draw the ruler's ticks, the calendar's grid and the Sunday hatching.

TYPOGRAPHY:
Display: Hedvig Letters Serif 400, its one weight, optical size 12 to 24. For the headline, headings, the shop name, dye and colourway names, prices, dates, seats left, the low-stock line and the visit details.
- h1 clamp(2.7rem, 6.3vw, 5.35rem), at 640px and below clamp(2.4rem, 11vw, 3.4rem); line-height 1.02, tracking -0.03em
- h2 clamp(2.15rem, 4vw, 3.25rem), line-height 1.04, tracking -0.025em
- h3 1.625rem (1.5rem at 480px and below); prices 2.125rem; workshop dates 2.375rem
Body: Hedvig Letters Sans 400, its one weight, 1.0625rem, line-height 1.62, for everything you read or press.
The hierarchy comes from size, family and colour. font-synthesis: none, never a faux bold. No text under 16px.

LAYOUT:
- Shop bar: the name, four section links, the basket count and its total. Under 900px the links take a second row; on phones they are hidden.
- Hero: six cut swatches in a row (three across under 900px), each with its dye and mordant under it; then the headline and one line saying where the dyeing happens. On a short screen the swatches get shorter so the whole headline shows on the first screen.
- Shop: a ruled list. Each row: the piece drawn to scale, its name and size, colourway chips, then price, stock line and an outlined button on the right.
- The vats: a two-week calendar drawn like a weaving draft. Days run across, the four vats run down, each dye bath is a block of cloth on its days; today is shaded, Sundays are hatched. Under 1024px the draft turns and the days run down.
- Workshop: the dyed square beside the description, facts as a two-column list, dates as ruled rows with six seat squares each, then the booking form.
- Visit: a short paragraph beside address, hours, route and contact as ruled rows.
- Max width about 1120px, sections about 128px apart (96px on phones), square corners everywhere.

COMPONENTS:
- Colourway chips: 30px squares of cloth inside a 2px frame that turns ink when chosen. They are radio buttons and recolour the drawn piece and its name.
- Buttons: 1.5px ink outline, square, filled with ink on hover. The booking button is solid indigo.
- Dye baths: toggle buttons in the calendar; the chosen one gets a 2px ink ring and its recipe shows under the calendar.
- Rows: 1px lines at 0.32 opacity, a 1.5px ink rule over each list.
- Seats: six small squares, dyed indigo when taken.
- Form: visible labels, square fields with a 1.5px border, the error in madder under its field, a confirmation that takes the form's place.

MOTION:
- A chosen colourway soaks into the drawn piece over 0.45s (a registered colour custom property). Section links scroll smoothly. Nothing else moves.
- prefers-reduced-motion switches both off.

FORBIDDEN:
- Cards, pills, rounded corners, panels with drop shadows
- A small label above a heading, all-caps tracked labels
- Flat colour swatches with hex codes, palette, type specimen or principles sections
- Pale beige text on beige, faux bold on the single-weight faces
- Leaves, sprigs, roman numerals and other ornament
- A page about its own style

OUTPUT:
1) CSS custom properties for the tokens and the cloth
2) Semantic HTML and CSS
3) Responsive layout down to 320px with no horizontal scroll
4) Working controls: colourway radios, add to basket with a live count, the dye bath calendar, workshop dates (full dates disabled) and a validated booking form; visible focus; reduced-motion support`;

const PROMPT_KO = `Earth Atelier 스타일로 실제 페이지 하나를 디자인한다. 무염색 리넨, 식물 염료, 차분한 잉크를 쓰고, 페이지의 모든 유색 면은 염색한 천이다.

천연 소재를 다루는 그럴듯한 주제를 고른다. 예를 들면 천연 염색 공방, 리넨 직조 공방, 도예 스튜디오, 허브 약방이 있다. 그 주제의 실제 내용을 쓴다. 페이지는 그 주제의 페이지로 읽혀야 하며, 스타일 자체에 관한 페이지로 읽혀서는 안 된다.

COLOR TOKENS:
--bg: #f4f3f1 (무염색 리넨)
--surface: #fbfaf8
--ink: #2e2a24
--muted: #59534a
--line: rgba(46, 42, 36, 0.32)
--rule: rgba(46, 42, 36, 0.6)
염료는 천으로만 쓴다:
--madder: #9b3a2a
--terra: #ab6b49
--weld: #ada640
--green: #56653d
--indigo: #283a57
--gall: #67635c
--flax: #d5d0c7
다른 색은 쓰지 않는다. 예외는 흰색, 거의 검은색, 짜임과 가장자리, 그림자, 호버, 오늘 표시에 쓰는 낮은 불투명도의 잉크와, 나무 블록이 눌렀던 자리에 쓰는 #c6cdd6 근처의 옅은 회청색이다. 글자는 잉크색 또는 --muted 색이다. 채워진 버튼 위의 글자는 리넨색이다. 꼭두서니 빨강은 재고 부족과 폼 오류에만 쓰고, 인디고는 주요 버튼 하나를 채운다.

THE CLOTH:
- 모든 유색 면은 천이다. 촘촘한 평직 아래에 염료색이 깔리고(1px 실 그라디언트 두 개를 반복), 굵은 슬럽 몇 개가 있으며, 날실과 씨실 방향으로 늘린 SVG feTurbulence 섬유 노이즈가 들어가고, 염료가 더 옅거나 짙게 든 부드러운 방사형 얼룩 두 개가 있다.
- 재단한 견본은 위아래에 핑킹 가위 지그재그가 있다(conic-gradient 마스크). 단을 접은 제품에는 더 짙은 접힌 가장자리와 점선 홈질을 넣는다.
- 제품은 하나의 축척으로 그린다(1200px 이상 화면에서 1cm당 2px, 작은 화면에서는 더 작게). 50cm 자와 나란히 두어, 냅킨, 스카프, 테이블 러너가 실제 비율을 유지하게 한다.
- 조작 요소인 천(색상 칩, 염액)에는 1px 짙은 테두리를 넣어 리넨 대비 3:1을 유지하게 한다.
- 염료색의 단색 면은 쓰지 않는다. 그라디언트는 천의 짜임을 만들고, 자의 눈금, 달력 격자, 일요일 빗금을 그리는 데만 쓴다.

TYPOGRAPHY:
디스플레이: Hedvig Letters Serif 400, 단일 굵기, optical size 12~24. 제목, 소제목, 매장 이름, 색상 이름, 가격, 날짜, 남은 자리, 재고 부족 줄, 방문 정보에 쓴다.
- h1 clamp(2.7rem, 6.3vw, 5.35rem), 640px 이하에서는 clamp(2.4rem, 11vw, 3.4rem); line-height 1.02, tracking -0.03em
- h2 clamp(2.15rem, 4vw, 3.25rem), line-height 1.04, tracking -0.025em
- h3 1.625rem(480px 이하에서는 1.5rem); 가격 2.125rem; 워크숍 날짜 2.375rem
본문: Hedvig Letters Sans 400, 단일 굵기, 1.0625rem, line-height 1.62. 읽거나 누르는 모든 텍스트에 쓴다.
위계는 크기, 서체, 색으로 만든다. font-synthesis: none, 가짜 굵게는 금지. 16px 미만 텍스트는 쓰지 않는다.

LAYOUT:
- 매장 바: 이름, 섹션 링크 네 개, 장바구니 개수와 합계. 900px 미만에서는 링크가 둘째 줄로 내려가고, 휴대폰에서는 숨긴다.
- 히어로: 재단한 견본 여섯 개를 한 줄로 놓고(900px 미만에서는 세 개씩), 각 견본 아래에 염료와 매염 방식을 적는다. 이어서 제목과, 염색이 어디서 이루어지는지 말하는 한 줄을 둔다. 화면이 낮으면 견본을 더 낮게 만들어 제목 전체가 첫 화면에 보이게 한다.
- 매장: 줄이 있는 목록. 각 행은 축척에 맞춘 제품 그림, 이름과 크기, 색상 칩, 그다음 오른쪽에 가격, 재고 줄, 외곽선 버튼을 둔다.
- 염색 통: 직조 도안처럼 그린 2주짜리 달력. 날짜는 가로로, 염색 통 네 개는 세로로 배치한다. 각 염액은 해당 날짜에 천 블록으로 표시한다. 오늘은 음영으로, 일요일은 빗금으로 표시한다. 1024px 미만에서는 도안이 돌아가 날짜가 세로로 내려간다.
- 워크숍: 설명 옆에 염색한 정사각형 천, 정보는 두 칸 목록, 날짜는 자리 여섯 칸이 있는 줄 행으로 둔다. 그다음 예약 폼을 둔다.
- 방문: 짧은 문단 옆에 주소, 영업시간, 오시는 길, 연락처를 줄 행으로 둔다.
- 최대 너비 약 1120px, 섹션 간격 약 128px(휴대폰에서는 96px), 모든 모서리는 직각.

COMPONENTS:
- 색상 칩: 2px 테두리 안의 30px 천 사각형. 선택되면 테두리가 잉크색이 된다. 라디오 버튼이며, 그려진 제품과 그 이름의 색을 바꾼다.
- 버튼: 1.5px 잉크색 외곽선, 직각. 마우스를 올리면 잉크색으로 채운다. 예약 버튼은 단색 인디고다.
- 염액: 달력 안의 토글 버튼. 선택한 것은 2px 잉크색 링을 얻고, 그 레시피가 달력 아래에 표시된다.
- 행: 불투명도 0.32의 1px 선, 각 목록 위에 1.5px 잉크색 선.
- 자리: 작은 정사각형 여섯 개. 예약되면 인디고로 물든다.
- 폼: 항상 보이는 라벨, 1.5px 테두리의 직각 입력칸. 오류는 해당 입력칸 아래에 꼭두서니색으로 표시하고, 확인 메시지는 폼 자리를 대신한다.

MOTION:
- 선택한 색상은 0.45초에 걸쳐 그려진 제품에 스며든다(등록된 색 커스텀 속성). 섹션 링크는 부드럽게 스크롤된다. 다른 요소는 움직이지 않는다.
- prefers-reduced-motion에서는 두 효과를 모두 끈다.

FORBIDDEN:
- 카드, 알약형 버튼, 둥근 모서리, 그림자가 있는 패널
- 제목 위의 작은 라벨, 전부 대문자이고 자간을 넓힌 라벨
- 헥스 코드가 적힌 단색 견본, 팔레트, 서체 견본, 원칙 섹션
- 베이지 위의 옅은 베이지 글자, 단일 굵기 서체의 가짜 굵게
- 잎, 가지, 로마 숫자 등 장식
- 자기 스타일에 관한 페이지

OUTPUT:
1) 토큰과 천을 위한 CSS 커스텀 속성
2) 시맨틱 HTML과 CSS
3) 320px까지 반응형 레이아웃, 가로 스크롤 없음
4) 동작하는 컨트롤: 색상 라디오, 개수가 바로 바뀌는 장바구니 담기, 염액 달력, 워크숍 날짜(마감된 날짜는 비활성), 검증하는 예약 폼. 보이는 포커스와 reduced-motion 지원`;

const PROMPT_JA = `Earth Atelier スタイルで実在するページを1つデザインする。無染色のリネン、植物染料、控えめなインクを使い、ページ上のあらゆる有色の面は染めた布とする。

天然素材を扱う実在感のあるテーマを選び、その実際の内容を書く。例：天然染色工房、リネン織り職人、陶芸スタジオ、ハーブ薬局。ページはそのテーマのページとして読めるものでなければならず、自身のスタイルについてのページであってはならない。

COLOR TOKENS:
--bg: #f4f3f1 (無染色のリネン)
--surface: #fbfaf8
--ink: #2e2a24
--muted: #59534a
--line: rgba(46, 42, 36, 0.32)
--rule: rgba(46, 42, 36, 0.6)
染料は布としてのみ使う：
--madder: #9b3a2a
--terra: #ab6b49
--weld: #ada640
--green: #56653d
--indigo: #283a57
--gall: #67635c
--flax: #d5d0c7
他の色は使わない。例外は白、ほぼ黒、織り・縁・影・ホバー・今日の網掛けに使う低い不透明度のインク、そして木型が押さえた部分にインディゴが届かなかった #c6cdd6 付近の淡い青灰色である。文字はインクまたは --muted のみ。塗りのボタン上の文字はリネン色。西洋茜の赤は在庫僅少とフォームのエラーにだけ使い、インディゴは主要ボタン1つを塗る。

THE CLOTH:
- すべての有色の面は布である。細かい平織りの下に染料の色（1pxの糸グラデーションを2つ繰り返す）、やや太い節が少し、経糸・緯糸の方向に引き伸ばした SVG feTurbulence の繊維ノイズ、染料がより淡く、または濃く入った柔らかい放射状の斑点2つを置く。
- 裁断した見本は、上下に鋏（ピンキングシア）によるジグザグを付ける（conic-gradient マスク）。縫い代を折り返した製品には、より濃い折り返しの縁と破線の並び縫い（running stitch）を付ける。
- 製品は1つの縮尺で描く（幅1200px以上の画面では1cmあたり2px、小さい画面ではそれより小さく）。50cmの定規と並べ、ナプキン、スカーフ、テーブルランナーが実際の比率を保つようにする。
- 操作要素となる布（色のチップ、染液）には1pxの濃い縁を付け、リネンに対して3:1のコントラストを保つ。
- 単色の染料面は使わない。グラデーションは布の織りと、定規の目盛り、カレンダーの格子、日曜の斜線を描く場合にだけ使う。

TYPOGRAPHY:
ディスプレイ：Hedvig Letters Serif 400、単一ウェイト、optical size 12〜24。見出し、小見出し、店舗名、色の名前、価格、日付、残席、在庫僅少の行、来店案内の詳細に使う。
- h1 clamp(2.7rem, 6.3vw, 5.35rem)、640px以下では clamp(2.4rem, 11vw, 3.4rem)；line-height 1.02、tracking -0.03em
- h2 clamp(2.15rem, 4vw, 3.25rem)、line-height 1.04、tracking -0.025em
- h3 1.625rem（480px以下では1.5rem）；価格 2.125rem；ワークショップの日付 2.375rem
本文：Hedvig Letters Sans 400、単一ウェイト、1.0625rem、line-height 1.62。読む・押すすべての要素に使う。
階層はサイズ、書体、色で作る。font-synthesis: none、偽の太字は使わない。16px未満の文字は使わない。

LAYOUT:
- ショップバー：店舗名、4つのセクションリンク、カゴの点数と合計。900px未満ではリンクが2段目に移り、スマートフォンでは隠す。
- ヒーロー：カットした見本6枚を横一列に並べ（900px未満では3枚ずつ）、各見本の下に染料と媒染を示す。続けて見出しと、どこで染色しているかを示す一行を置く。画面が低い場合は見本を低くし、見出し全体が最初の画面に収まるようにする。
- ショップ：罫線付きのリスト。各行は、縮尺どおりに描いた製品、名前とサイズ、色のチップ、続けて右側に価格、在庫行、アウトラインボタンを置く。
- 染槽：織りの設計図のように描いた2週間のカレンダー。日付は横に、4つの染槽は縦に並ぶ。各染液はその日に布のブロックとして表示する。今日は網掛け、日曜は斜線。1024px未満では図が回転し、日付が縦に並ぶ。
- ワークショップ：染めた正方形を説明の横に置き、情報は2列のリスト、日付は席6つの枠を持つ罫線行とし、その後に予約フォームを置く。
- 来店案内：短い文章の横に、住所、営業時間、アクセス、連絡先を罫線行で置く。
- 最大幅およそ1120px、セクション間隔およそ128px（スマートフォンでは96px）、角はすべて直角。

COMPONENTS:
- 色のチップ：2pxの枠の中の30pxの布の正方形。選択時は枠がインクの色になる。ラジオボタンで、描かれた製品とその名前の色を変える。
- ボタン：1.5pxのインク色の外枠、直角。ホバー時はインクで塗りつぶす。予約ボタンは単色のインディゴ。
- 染液：カレンダー内のトグルボタン。選ばれたものは2pxのインク色のリングが付き、そのレシピがカレンダーの下に表示される。
- 罫線：不透明度0.32の1px線。各リストの上に1.5pxのインク色の罫線。
- 席：小さな正方形6つ。予約済みのものはインディゴで染まる。
- フォーム：常に見えるラベル、1.5pxの枠の直角の入力欄。エラーは該当欄の下に西洋茜の色で表示する。確認メッセージはフォームの代わりに表示する。

MOTION:
- 選んだ色は0.45秒かけて描かれた製品に染み込む（登録された色のカスタムプロパティ）。セクションリンクは滑らかにスクロールする。他は動かさない。
- prefers-reduced-motion では両方とも無効にする。

FORBIDDEN:
- カード、ピル型ボタン、角丸、影付きのパネル
- 見出しの上の小さなラベル、すべて大文字で字間を広げたラベル
- 16進数コード付きの単色見本、パレット、書体見本、原則のセクション
- ベージュの上の淡いベージュの文字、単一ウェイトの書体での偽の太字
- 葉、小枝、ローマ数字などの装飾
- 自身のスタイルについてのページ

OUTPUT:
1) トークンと布のための CSS カスタムプロパティ
2) セマンティックな HTML と CSS
3) 320pxまで対応するレスポンシブレイアウト。横スクロールなし
4) 動作するコントロール：色のラジオ、件数がすぐに変わるカゴへの追加、染液カレンダー、ワークショップの日付（満席の日付は無効）、検証付きの予約フォーム。見えるフォーカスとreduced-motionへの対応`;

const PROMPTS: Record<Lang, string> = {
  en: PROMPT_EN,
  ko: PROMPT_KO,
  ja: PROMPT_JA,
};

const keyOf = (item: ItemId, way: DyeId) => `${item}:${way}`;

export function PortedEarthAtelierPage({ lang }: PortedStylePageProps) {
  const [ways, setWays] = useState<Record<ItemId, DyeId>>({ napkins: 'madder', scarf: 'indigo', runner: 'weld' });
  const [basket, setBasket] = useState<Record<string, number>>({});
  const [announcement, setAnnouncement] = useState('');
  const [bathId, setBathId] = useState('b25');
  const [dateId, setDateId] = useState('nov-28');
  const [bookedSeats, setBookedSeats] = useState<Record<string, number>>({});
  const [guest, setGuest] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({ name: false, email: false });
  const [booking, setBooking] = useState<{ dateId: string; email: string } | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const wasBooked = useRef(false);
  const t = (text: Tri) => text[lang];

  const pieces = Object.values(basket).reduce((sum, n) => sum + n, 0);
  const total = ITEMS.reduce(
    (sum, item) => sum + item.ways.reduce((part, way) => part + (basket[keyOf(item.id, way.dye)] ?? 0) * item.price, 0),
    0,
  );

  const bath = BATHS.find((entry) => entry.id === bathId) ?? BATHS[0];
  const seatsLeft = (id: string) => {
    const entry = DATES.find((item) => item.id === id) ?? DATES[0];
    return SEATS - entry.taken - (bookedSeats[id] ?? 0);
  };
  const date = DATES.find((item) => item.id === dateId) ?? DATES[1];
  const bookedDate = booking ? DATES.find((item) => item.id === booking.dateId) ?? date : date;

  // The form and the confirmation replace each other, and the control that had focus
  // leaves the page with them. Focus goes to what took its place.
  useEffect(() => {
    if (booking) doneRef.current?.focus();
    else if (wasBooked.current) nameRef.current?.focus();
    wasBooked.current = booking !== null;
  }, [booking]);

  const addToBasket = (item: Item, way: Way) => {
    const key = keyOf(item.id, way.dye);
    const held = basket[key] ?? 0;
    if (way.limit !== undefined && held >= way.limit) {
      if (way.gone) setAnnouncement(t(way.gone));
      return;
    }
    setBasket({ ...basket, [key]: held + 1 });
    const n = pieces + 1;
    setAnnouncement(fill(t(n === 1 ? TOP.addedOne : TOP.addedMany), { item: t(item.name), way: t(way.name), n }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = { name: guest.name.trim() === '', email: !EMAIL_PATTERN.test(guest.email.trim()) };
    setErrors(next);
    if (next.name || next.email) {
      (next.name ? nameRef : emailRef).current?.focus();
      return;
    }
    setBookedSeats({ ...bookedSeats, [date.id]: (bookedSeats[date.id] ?? 0) + 1 });
    setBooking({ dateId: date.id, email: guest.email.trim() });
  };

  // A new booking starts on the chosen date, or on the next one with a seat if that filled up.
  const bookAnother = () => {
    if (seatsLeft(dateId) <= 0) {
      const open = DATES.find((item) => seatsLeft(item.id) > 0);
      if (open) setDateId(open.id);
    }
    setGuest({ name: '', email: '' });
    setErrors({ name: false, email: false });
    setBooking(null);
  };

  return (
    <FusionShell
      fusionId="earth-atelier"
      lang={lang}
      tone="light"
      accent="#283a57"
      prev={{ href: '/pages/bento-bloom.html', label: 'Bento Bloom' }}
      next={{ href: '/pages/liquid-metal.html', label: 'Liquid Metal' }}
      prompts={PROMPTS}
    >
      <div className="mw">
        <header className="mw-bar">
          <p className="mw-mark">{NAME}</p>
          <nav className="mw-bar__nav" aria-label={t(TOP.nav)}>
            <a href="#mw-shop">{t(TOP.shop)}</a>
            <a href="#mw-vats">{t(TOP.vats)}</a>
            <a href="#mw-workshop">{t(TOP.workshop)}</a>
            <a href="#mw-visit">{t(TOP.visit)}</a>
          </nav>
          <span className="mw-basket">
            {fill(t(TOP.basket), { n: pieces })}
            {pieces > 0 ? <span className="mw-basket__total">{money(total)}</span> : null}
          </span>
          <p className="mw-vh" role="status">{announcement}</p>
        </header>

        <section className="mw-hero" aria-labelledby="mw-title">
          <ul className="mw-strip" aria-label={t(HERO.strip)}>
            {SWATCHES.map((swatch) => (
              <li key={swatch.dye} style={{ '--mw-dye': dye(swatch.dye), '--mw-m1': swatch.m1, '--mw-m2': swatch.m2 } as Vars}>
                <span className="mw-cut" aria-hidden="true"><i className="mw-cloth mw-pinked" /></span>
                <span className="mw-strip__name">{t(swatch.name)}</span>
                <span className="mw-strip__on">{t(swatch.on)}</span>
              </li>
            ))}
          </ul>
          <h1 id="mw-title" className="mw-title">{t(HERO.title)}</h1>
          <p className="mw-lede">{t(HERO.lede)}</p>
        </section>

        <section className="mw-section" id="mw-shop" aria-labelledby="mw-shop-title">
          <div className="mw-head">
            <div>
              <h2 id="mw-shop-title" className="mw-h2">{t(SHOP.title)}</h2>
              <p className="mw-note">{t(SHOP.note)}</p>
            </div>
            <p className="mw-scale"><i aria-hidden="true" /><span>{t(SHOP.scale)}</span></p>
          </div>
          <ul className="mw-goods">
            {ITEMS.map((item) => {
              const way = item.ways.find((entry) => entry.dye === ways[item.id]) ?? item.ways[0];
              const held = basket[keyOf(item.id, way.dye)] ?? 0;
              const soldThrough = way.limit !== undefined && held >= way.limit;
              const inBasket = item.ways.reduce((sum, entry) => sum + (basket[keyOf(item.id, entry.dye)] ?? 0), 0);
              const stock = soldThrough && way.gone ? way.gone : way.stock;
              return (
                <li key={item.id} className="mw-item">
                  <div className={`mw-draw mw-draw--${item.id}`} aria-hidden="true" style={{ '--mw-dye': dye(way.dye) } as Vars}>
                    {item.id === 'napkins' ? (
                      <span className="mw-napkins">
                        {NAPKINS.map((patch, index) => (
                          <i key={patch} className="mw-cloth mw-hem" style={{ '--mw-i': index, '--mw-m1': patch } as Vars} />
                        ))}
                      </span>
                    ) : item.id === 'scarf' ? (
                      <span className="mw-scarf"><i className="mw-cloth" /></span>
                    ) : (
                      <span className="mw-runner"><i className="mw-cloth mw-hem" /></span>
                    )}
                  </div>
                  <div className="mw-info">
                    <h3 className="mw-h3">{t(item.name)}</h3>
                    <p className="mw-size">{t(item.size)}</p>
                    <fieldset className="mw-ways">
                      <legend className="mw-vh">{t(item.legend)}</legend>
                      {item.ways.map((entry) => (
                        <label key={entry.dye} className="mw-chip">
                          <input
                            type="radio"
                            name={`mw-way-${item.id}`}
                            value={entry.dye}
                            checked={entry.dye === way.dye}
                            onChange={() => setWays({ ...ways, [item.id]: entry.dye })}
                          />
                          <i className="mw-cloth" style={{ '--mw-dye': dye(entry.dye) } as Vars} aria-hidden="true" />
                          <span className="mw-vh">{t(entry.name)}</span>
                        </label>
                      ))}
                      <span className="mw-way" aria-hidden="true">{t(way.name)}</span>
                    </fieldset>
                  </div>
                  <div className="mw-buy">
                    <span className="mw-price">{money(item.price)}</span>
                    <p className={`mw-stock${way.limit !== undefined && !soldThrough ? ' mw-stock--low' : ''}`}>{t(stock)}</p>
                    {/* The button stays focusable when the last piece is taken, so focus is not lost. */}
                    <button className="mw-add" type="button" aria-disabled={soldThrough} onClick={() => addToBasket(item, way)}>
                      {t(SHOP.add)}
                    </button>
                    {inBasket > 0 ? <p className="mw-have">{fill(t(SHOP.have), { n: inBasket })}</p> : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="mw-section" id="mw-vats" aria-labelledby="mw-vats-title">
          <div className="mw-head">
            <div>
              <h2 id="mw-vats-title" className="mw-h2">{t(VATS_COPY.title)}</h2>
              <p className="mw-note">{t(VATS_COPY.note)}</p>
            </div>
          </div>
          <div className="mw-cal" role="group" aria-label={t(VATS_COPY.group)}>
            <div className="mw-cal__field" aria-hidden="true" />
            <div className="mw-cal__now" aria-hidden="true" />
            {DAYS.map((day, index) => (day.shut ? (
              <div key={`shut-${day.date}`} className="mw-cal__shut" style={{ '--mw-d': index + 2 } as Vars} aria-hidden="true" />
            ) : null))}
            {DAYS.map((day, index) => (
              <div
                key={`day-${day.date}`}
                className={`mw-cal__day${index === 0 ? ' is-today' : ''}${day.shut ? ' is-shut' : ''}${index === DAYS.length - 1 ? ' is-last' : ''}`}
                style={{ '--mw-d': index + 2 } as Vars}
                aria-hidden="true"
              >
                <span className="mw-cal__wd">{t(day.weekday)}</span>
                <span className="mw-cal__date">{day.date}</span>
                {index === 0 ? <span className="mw-cal__extra mw-cal__extra--today">{t(VATS_COPY.today)}</span> : null}
                {day.month ? <span className="mw-cal__extra">{t(day.month)}</span> : null}
              </div>
            ))}
            {VATS.map((vat, index) => (
              <div
                key={vat.dye}
                className={`mw-cal__vat${index === VATS.length - 1 ? ' is-last' : ''}`}
                style={{ '--mw-v': index + 2 } as Vars}
                aria-hidden="true"
              >
                <i className="mw-cloth" style={{ '--mw-dye': dye(vat.dye) } as Vars} />
                <span className="mw-cal__vatname">{t(vat.name)}</span>
                <span className="mw-cal__vatnote">{t(vat.note)}</span>
              </div>
            ))}
            {BATHS.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className="mw-bath mw-cloth"
                aria-pressed={entry.id === bath.id}
                aria-label={t(entry.label)}
                aria-controls="mw-bath-detail"
                style={{ '--mw-d': entry.day + 2, '--mw-len': entry.len ?? 1, '--mw-v': entry.vat + 2, '--mw-dye': dye(entry.dye) } as Vars}
                onClick={() => setBathId(entry.id)}
              />
            ))}
          </div>
          <div className="mw-detail" id="mw-bath-detail" aria-live="polite">
            <h3 className="mw-detail__title">
              <i className="mw-cloth" style={{ '--mw-dye': dye(bath.dye) } as Vars} aria-hidden="true" />
              {t(bath.title)}
            </h3>
            <p>{t(bath.body)}</p>
          </div>
        </section>

        <section className="mw-section mw-class" id="mw-workshop" aria-labelledby="mw-workshop-title">
          <figure className="mw-class__figure">
            <div className="mw-itajime mw-cloth" role="img" aria-label={t(WORKSHOP.figure)}>
              {RESIST.map(([inset, turn, blur, alpha], index) => (
                <i
                  key={index}
                  style={{ '--mw-in': inset, '--mw-turn': `${turn}deg`, '--mw-blur': `${blur}px`, '--mw-alpha': alpha } as Vars}
                />
              ))}
            </div>
            <figcaption>{t(WORKSHOP.caption)}</figcaption>
          </figure>
          <div className="mw-class__text">
            <h2 id="mw-workshop-title" className="mw-h2">{t(WORKSHOP.title)}</h2>
            <p className="mw-class__body">{t(WORKSHOP.body)}</p>
            <dl className="mw-facts">
              {WORKSHOP_FACTS.map(([term, value]) => (
                <div key={term.en}><dt>{t(term)}</dt><dd>{t(value)}</dd></div>
              ))}
            </dl>
            <fieldset className="mw-dates">
              <legend className="mw-vh">{t(WORKSHOP.dates)}</legend>
              {DATES.map((entry) => {
                const left = seatsLeft(entry.id);
                const full = left <= 0;
                return (
                  <label key={entry.id} className={`mw-date${full ? ' is-full' : ''}`}>
                    <input
                      type="radio"
                      name="mw-date"
                      value={entry.id}
                      checked={entry.id === dateId}
                      disabled={full}
                      onChange={() => setDateId(entry.id)}
                    />
                    <i className="mw-tick" aria-hidden="true" />
                    <span className="mw-when">
                      <span className="mw-when__day">{entry.day}</span>
                      <span className="mw-when__month">{t(entry.month)}</span>
                    </span>
                    <span className="mw-seats" aria-hidden="true">
                      {Array.from({ length: SEATS }, (_, seat) => (
                        <i key={seat} className={seat < SEATS - left ? 'mw-cloth' : undefined} />
                      ))}
                    </span>
                    <span className="mw-left">{full ? t(WORKSHOP.full) : fill(t(WORKSHOP.left), { n: left })}</span>
                  </label>
                );
              })}
            </fieldset>

            {booking ? (
              <div className="mw-done" ref={doneRef} tabIndex={-1} role="group" aria-labelledby="mw-done-title">
                <h3 id="mw-done-title" className="mw-done__title">{fill(t(WORKSHOP.doneTitle), { date: t(bookedDate.long) })}</h3>
                <p>{fill(t(WORKSHOP.doneBody), { email: booking.email })}</p>
                <button className="mw-add mw-again" type="button" onClick={bookAnother}>{t(WORKSHOP.again)}</button>
              </div>
            ) : (
              <form className="mw-form" noValidate onSubmit={handleSubmit}>
                <div className={`mw-field${errors.name ? ' is-invalid' : ''}`}>
                  <label htmlFor="mw-name">{t(WORKSHOP.name)}</label>
                  <input
                    id="mw-name"
                    ref={nameRef}
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                    value={guest.name}
                    aria-invalid={errors.name}
                    aria-describedby={errors.name ? 'mw-name-error' : undefined}
                    onChange={(event) => {
                      setGuest({ ...guest, name: event.target.value });
                      if (errors.name) setErrors({ ...errors, name: false });
                    }}
                  />
                  {errors.name ? <p className="mw-error" id="mw-name-error" role="alert">{t(WORKSHOP.nameError)}</p> : null}
                </div>
                <div className={`mw-field${errors.email ? ' is-invalid' : ''}`}>
                  <label htmlFor="mw-email">{t(WORKSHOP.email)}</label>
                  <input
                    id="mw-email"
                    ref={emailRef}
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={guest.email}
                    aria-invalid={errors.email}
                    aria-describedby={errors.email ? 'mw-email-error' : undefined}
                    onChange={(event) => {
                      setGuest({ ...guest, email: event.target.value });
                      if (errors.email) setErrors({ ...errors, email: false });
                    }}
                  />
                  {errors.email ? <p className="mw-error" id="mw-email-error" role="alert">{t(WORKSHOP.emailError)}</p> : null}
                </div>
                <div className="mw-book">
                  <button type="submit">{fill(t(WORKSHOP.book), { date: t(date.short) })}</button>
                  <p>{t(WORKSHOP.paid)}</p>
                </div>
              </form>
            )}
          </div>
        </section>

        <section className="mw-section mw-visit" id="mw-visit" aria-labelledby="mw-visit-title">
          <div>
            <h2 id="mw-visit-title" className="mw-h2">{t(VISIT.title)}</h2>
            <p className="mw-note">{t(VISIT.body)}</p>
          </div>
          <dl className="mw-visit__rows">
            <div><dt>{t(VISIT.address)}</dt><dd>{t(VISIT.addressValue)}</dd></div>
            <div><dt>{t(VISIT.hours)}</dt><dd>{t(VISIT.hoursValue)}</dd></div>
            <div><dt>{t(VISIT.route)}</dt><dd>{t(VISIT.routeValue)}</dd></div>
            <div>
              <dt>{t(VISIT.contact)}</dt>
              <dd>
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
                <a href={PHONE_HREF}>{PHONE}</a>
              </dd>
            </div>
          </dl>
        </section>

        <footer className="mw-foot">
          <p>© 2026 {NAME}</p>
          <p>{t(VISIT.made)}</p>
        </footer>
      </div>
    </FusionShell>
  );
}
