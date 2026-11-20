import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { flushSync } from 'react-dom';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedGlassOrbitPage.css';

// The page of Halo Optics, a lens workshop in Edinburgh that makes prescription
// lenses in five layers. The glass panes of the style are the lens itself: the
// hero is one lens pulled apart into its layers, the tint is a lens held over a
// reading chart, and the booking pane is the shop window. Everything else sits
// flat on the plum.

type Tri = Record<Lang, string>;

const BRAND = 'Halo Optics';
const UNIT = 'µm';
const BASE_PRICE = 120;
const FITTING_MINUTES = 40;
const SHOP_ADDRESS = ['22 Raeburn Place', 'Edinburgh EH4 1HN'];
const SHOP_PHONE = '0131 496 0742';

const HERO = {
  nav: { en: 'On this page', ko: '이 페이지에서', ja: 'このページ内' },
  navTints: { en: 'Tints', ko: '틴트', ja: 'ティント' },
  navPrices: { en: 'Prices', ko: '가격', ja: '価格' },
  navVisit: { en: 'Visit', ko: '매장 안내', ja: '店舗案内' },
  book: { en: 'Book a fitting', ko: '피팅 예약', ja: 'フィッティングを予約' },
  bookShort: { en: 'Book', ko: '예약', ja: '予約' },
  title: { en: 'Five layers in every lens.', ko: '모든 렌즈에는 다섯 겹이 있습니다.', ja: 'すべてのレンズは五つの層でできています。' },
  lede: {
    en: 'We make prescription lenses to order in the workshop behind our shop in Stockbridge, Edinburgh. Each one starts as a 1.60 index lens and takes four coatings, 3.52 µm thick between them.',
    ko: '에든버러 Stockbridge의 매장 뒤편 작업장에서 처방 렌즈를 주문에 따라 제작합니다. 모든 렌즈는 굴절률 1.60 렌즈에서 시작하며, 그 위에 네 겹의 코팅을 입힙니다. 코팅 전체 두께는 3.52 µm입니다.',
    ja: 'エディンバラ・Stockbridgeの店舗の奥にある工房で、処方レンズを注文ごとに製作しています。どのレンズも屈折率1.60のレンズから始まり、4層のコーティングを施します。コーティングの合計の厚さは3.52 µmです。',
  },
  stack: {
    en: 'The layers of one lens, from the outer surface down',
    ko: '렌즈 하나의 층, 바깥 표면부터 아래로',
    ja: 'レンズ1枚の層、外側の表面から下へ',
  },
  caption: { en: 'From the outer surface down', ko: '바깥 표면부터 아래로', ja: '外側の表面から下へ' },
} satisfies Record<string, Tri>;

type LayerId = 'top' | 'blue' | 'ar' | 'hard' | 'base';
type CoatingId = Exclude<LayerId, 'base'>;

// From the outer surface down, as the lens is drawn. `side` puts the callout left or right of the pane.
const LAYERS: Array<{ id: LayerId; side: 'l' | 'r'; um: string; price: number; name: Tri; note: Tri; what: Tri }> = [
  {
    id: 'top',
    side: 'r',
    um: '0.02',
    price: 15,
    name: { en: 'Hydrophobic top coat', ko: '발수 톱코트', ja: '撥水トップコート' },
    note: {
      en: 'Water and skin oil bead off, so a dry cloth wipes it clean.',
      ko: '물과 피지가 맺혀 떨어지므로 마른 천으로 닦으면 깨끗해집니다.',
      ja: '水分や皮脂は玉になって落ちるため、乾いた布で拭くだけできれいになります。',
    },
    what: { en: 'Water and skin oil bead off', ko: '물과 피지가 맺혀 떨어짐', ja: '水分と皮脂をはじく' },
  },
  {
    id: 'blue',
    side: 'l',
    um: '0.2',
    price: 30,
    name: { en: 'Blue-light filter', ko: '블루라이트 필터', ja: 'ブルーライトフィルター' },
    note: {
      en: 'Reflects a fifth of the blue light from screens, between 415 and 455 nm.',
      ko: '화면에서 나오는 블루라이트 중 415~455 nm 대역의 5분의 1을 반사합니다.',
      ja: '画面からの青色光のうち、415〜455 nmの5分の1を反射します。',
    },
    what: {
      en: 'Reflects a fifth of 415 to 455 nm light',
      ko: '415~455 nm 빛의 5분의 1을 반사',
      ja: '415〜455 nmの光の5分の1を反射',
    },
  },
  {
    id: 'ar',
    side: 'r',
    um: '0.3',
    price: 45,
    name: { en: 'Anti-reflective', ko: '반사 방지', ja: '反射防止' },
    note: {
      en: 'Seven alternating layers. Reflections drop from about 10% to under 1%.',
      ko: '일곱 겹이 번갈아 쌓여 있습니다. 반사율이 약 10%에서 1% 미만으로 떨어집니다.',
      ja: '7層が交互に重なっています。反射は約10%から1%未満に下がります。',
    },
    what: {
      en: 'Seven layers, reflections under 1%',
      ko: '7겹, 반사율 1% 미만',
      ja: '7層、反射率1%未満',
    },
  },
  {
    id: 'hard',
    side: 'l',
    um: '3',
    price: 18,
    name: { en: 'Hard coat', ko: '하드코트', ja: 'ハードコート' },
    note: {
      en: 'A clear lacquer that keeps the softer lens from scratching.',
      ko: '투명한 래커 막이 부드러운 렌즈에 흠집이 나지 않도록 막아 줍니다.',
      ja: '透明なラッカー層で、柔らかいレンズに傷がつくのを防ぎます。',
    },
    what: { en: 'Clear lacquer against scratches', ko: '흠집을 막는 투명 래커', ja: '傷を防ぐ透明ラッカー' },
  },
  {
    id: 'base',
    side: 'r',
    um: '1,800',
    price: BASE_PRICE,
    name: { en: 'Base lens, 1.60 index', ko: '베이스 렌즈, 굴절률 1.60', ja: 'ベースレンズ、屈折率1.60' },
    note: {
      en: 'Ground to your prescription. A −2.00 lens is 1.8 mm thick at the centre.',
      ko: '처방에 맞게 연마합니다. −2.00 렌즈는 중심 두께가 1.8 mm입니다.',
      ja: '処方に合わせて研磨します。−2.00のレンズは中心の厚さが1.8 mmです。',
    },
    what: { en: 'Ground to your prescription', ko: '처방에 맞춰 연마', ja: '処方に合わせて研磨' },
  },
];

// The ledger lists the layers in the order they are built: the lens first, the top coat last.
const LEDGER_LAYERS = [...LAYERS].reverse();

type TintId = 'rose' | 'smoke' | 'amber';
const STRENGTHS = [15, 35, 60] as const;
type Strength = (typeof STRENGTHS)[number];

// `light` is the share of light the lens lets through at its top edge. A neutral smoke
// takes a little more light than a rose of the same strength; an amber, which only
// holds back blue, takes less.
const TINTS: Array<{ id: TintId; color: string; name: Tri; light: Record<Strength, number> }> = [
  { id: 'rose', color: '#de468a', name: { en: 'Rose', ko: '로즈', ja: 'ローズ' }, light: { 15: 84, 35: 64, 60: 40 } },
  { id: 'smoke', color: '#5b5157', name: { en: 'Smoke', ko: '스모크', ja: 'スモーク' }, light: { 15: 82, 35: 60, 60: 35 } },
  { id: 'amber', color: '#c4842f', name: { en: 'Amber', ko: '앰버', ja: 'アンバー' }, light: { 15: 86, 35: 68, 60: 45 } },
];

const TINT_PRICE: Record<Strength, number> = { 15: 25, 35: 35, 60: 45 };
// How strongly the lens over the chart is coloured at its top edge.
const TINT_ALPHA: Record<Strength, number> = { 15: 0.36, 35: 0.74, 60: 0.95 };

// {tint} is a tint name, {n} a strength in percent.
const TINT = {
  title: { en: 'Add a tint', ko: '틴트 추가', ja: 'ティントを追加' },
  note: {
    en: 'Tints are dyed into the hard coat, so they cannot peel or rub off. Each one is strongest at the top edge and fades toward the bottom, where you read.',
    ko: '틴트는 하드코트에 염료로 입혀지므로 벗겨지거나 문질러서 지워지지 않습니다. 각 틴트는 윗면 가장자리에서 가장 진하고, 글을 읽는 아래쪽으로 갈수록 옅어집니다.',
    ja: 'ティントはハードコートに染料で入れるため、剥がれたりこすれて落ちたりすることはありません。どの色も上端が最も濃く、読書をする下側に向かって薄くなります。',
  },
  tint: { en: 'Tint', ko: '틴트', ja: 'ティント' },
  strength: { en: 'Strength at the top edge', ko: '윗면 가장자리의 농도', ja: '上端の濃さ' },
  light: { en: 'Light let through', ko: '투과율', ja: '透過率' },
  category: { en: 'Filter category', ko: '필터 카테고리', ja: 'フィルター区分' },
  price: { en: 'For the pair', ko: '한 쌍 가격', ja: '1組の価格' },
  view: {
    en: 'A lens with the {tint} tint at {n} percent, held over a reading chart',
    ko: '{tint} 틴트를 {n}%로 입힌 렌즈를 독서용 차트 위에 든 모습',
    ja: '{tint}ティントを{n}%で入れたレンズを、読書用チャートにかざした様子',
  },
} satisfies Record<string, Tri>;

// One sentence for each filter category the three strengths can reach.
const CATEGORY_NOTE: Record<number, Tri> = {
  0: {
    en: 'Category 0 is light enough to wear for driving at night.',
    ko: '카테고리 0은 밤에 운전할 때 착용할 만큼 밝습니다.',
    ja: 'カテゴリー0は、夜間の運転に着用できるほど明るい色です。',
  },
  1: {
    en: 'Category 1 is fine for driving in daylight. For night driving choose 15%.',
    ko: '카테고리 1은 낮 운전에 적합합니다. 야간 운전에는 15%를 선택하세요.',
    ja: 'カテゴリー1は日中の運転に適しています。夜間の運転には15%を選んでください。',
  },
  2: {
    en: 'Category 2 is for bright days. It is too dark for driving at night.',
    ko: '카테고리 2는 맑은 날에 쓰는 용도입니다. 야간 운전에는 너무 어둡습니다.',
    ja: 'カテゴリー2は晴れた日向けです。夜間の運転には暗すぎます。',
  },
};

// The reading chart behind the lens. Its rows are drawn, not read, and the last two drop out on phones.
const CHART = [
  ['6/60', 'E'],
  ['6/36', 'F P'],
  ['6/24', 'T O Z'],
  ['6/18', 'L P E D'],
  ['6/12', 'P E C F D'],
  ['6/9', 'E D F C Z P'],
];

// {tint} is a tint name, {n} a strength or a number of days.
const LEDGER = {
  title: { en: 'Your lenses, priced by layer', ko: '층별 가격으로 정리한 내 렌즈', ja: '層別の価格で見る、お選びのレンズ' },
  note: {
    en: 'Prices are for a pair of single-vision lenses, edged to the frame you bring in or choose in the shop. Varifocal base lenses start at £220. Every coating can be left out; the lens itself cannot.',
    ko: '가격은 단초점 렌즈 한 쌍 기준이며, 가져오신 안경테나 매장에서 고르신 안경테에 맞춰 가장자리를 가공합니다. 누진 베이스 렌즈는 £220부터 시작합니다. 코팅은 모두 빼실 수 있지만, 렌즈 자체는 뺄 수 없습니다.',
    ja: '価格は単焦点レンズ1組の金額です。お持ち込みの、または店頭でお選びのフレームに合わせて縁を加工します。遠近両用のベースレンズは£220からです。コーティングはすべて外せますが、レンズ本体は外せません。',
  },
  include: { en: 'Include', ko: '포함', ja: '含める' },
  layer: { en: 'Layer', ko: '층', ja: '層' },
  what: { en: 'What it is', ko: '내용', ja: '内容' },
  thickness: { en: 'Thickness', ko: '두께', ja: '厚さ' },
  price: { en: 'Price', ko: '가격', ja: '価格' },
  leftOut: { en: 'left out', ko: '제외됨', ja: '除外' },
  tintName: { en: '{tint} tint, {n}%', ko: '{tint} 틴트, {n}%', ja: '{tint}ティント、{n}%' },
  tintWhat: {
    en: 'Dyed into the hard coat, fading from the top',
    ko: '하드코트에 염료로 입힘, 윗면에서 옅어짐',
    ja: 'ハードコートに染料で着色、上端から薄くなる',
  },
  tintNeeds: {
    en: 'Needs the hard coat, which the tint is dyed into',
    ko: '틴트가 염료로 입혀지는 하드코트가 필요합니다',
    ja: 'ティントを入れるハードコートが必要です',
  },
  edging: { en: 'Edging and fitting', ko: '가장자리 가공 및 피팅', ja: '縁の加工とフィッティング' },
  edgingWhat: {
    en: 'Cut to your frame and adjusted in the shop',
    ko: '안경테에 맞춰 자르고 매장에서 조정',
    ja: 'フレームに合わせて加工し、店頭で調整',
  },
  included: { en: 'Included', ko: '포함됨', ja: '込み' },
  total: { en: 'Total for the pair', ko: '한 쌍 합계', ja: '1組の合計' },
  ready: { en: 'Ready to collect in {n} working days', ko: '{n} 영업일 후 수령 가능', ja: '{n}営業日後に受け取り可能' },
} satisfies Record<string, Tri>;

const WEEKDAY_TIMES = ['09:30', '10:15', '11:00', '11:45', '13:30', '14:15', '15:00', '15:45', '16:30'];
const SATURDAY_TIMES = ['10:00', '10:45', '11:30', '12:15', '13:30', '14:15', '15:00'];

// One week of fittings at the shop. `taken` are slots other customers have booked.
const DAYS: Array<{ id: string; date: number; short: Tri; long: Tri; times: string[]; taken: string[]; optician: string }> = [
  { id: 'mon', date: 23, short: { en: 'Mon', ko: '월', ja: '月' }, long: { en: 'Monday', ko: '월요일', ja: '月曜日' }, times: WEEKDAY_TIMES, taken: ['09:30', '10:15', '13:30', '15:00'], optician: 'Priya Nair' },
  { id: 'tue', date: 24, short: { en: 'Tue', ko: '화', ja: '火' }, long: { en: 'Tuesday', ko: '화요일', ja: '火曜日' }, times: WEEKDAY_TIMES, taken: ['11:00', '15:45'], optician: 'Euan Baird' },
  { id: 'wed', date: 25, short: { en: 'Wed', ko: '수', ja: '水' }, long: { en: 'Wednesday', ko: '수요일', ja: '水曜日' }, times: WEEKDAY_TIMES, taken: ['09:30', '11:45', '14:15', '16:30'], optician: 'Priya Nair' },
  { id: 'thu', date: 26, short: { en: 'Thu', ko: '목', ja: '木' }, long: { en: 'Thursday', ko: '목요일', ja: '木曜日' }, times: WEEKDAY_TIMES, taken: ['11:00', '14:15'], optician: 'Priya Nair' },
  { id: 'fri', date: 27, short: { en: 'Fri', ko: '금', ja: '金' }, long: { en: 'Friday', ko: '금요일', ja: '金曜日' }, times: WEEKDAY_TIMES, taken: ['10:15', '13:30', '15:00'], optician: 'Euan Baird' },
  { id: 'sat', date: 28, short: { en: 'Sat', ko: '토', ja: '土' }, long: { en: 'Saturday', ko: '토요일', ja: '土曜日' }, times: SATURDAY_TIMES, taken: ['10:00', '10:45', '11:30', '13:30', '15:00'], optician: 'Euan Baird' },
];

// {day} is a weekday name, {date} a day of the month, {when} a day and date, {name}, {email}
// and {optician} are names, {time} and {end} times of day.
const BOOK = {
  title: { en: 'Book a fitting', ko: '피팅 예약', ja: 'フィッティングを予約' },
  note: {
    en: 'A fitting takes 40 minutes. We measure your eyes against the frame, check your prescription and order the lenses the same day.',
    ko: '피팅은 40분이 걸립니다. 안경테에 맞춰 눈을 측정하고, 처방전을 확인한 뒤 같은 날 렌즈를 주문합니다.',
    ja: 'フィッティングは40分かかります。フレームに合わせて目の位置を測定し、処方内容を確認して、その日のうちにレンズを注文します。',
  },
  shop: { en: 'Stockbridge', ko: 'Stockbridge', ja: 'Stockbridge' },
  weekdays: { en: 'Monday to Friday', ko: '월요일~금요일', ja: '月曜日〜金曜日' },
  weekdayHours: { en: '09:30 to 17:30', ko: '09:30~17:30', ja: '09:30〜17:30' },
  saturday: { en: 'Saturday', ko: '토요일', ja: '土曜日' },
  saturdayHours: { en: '10:00 to 16:00', ko: '10:00~16:00', ja: '10:00〜16:00' },
  sunday: { en: 'Sunday', ko: '일요일', ja: '日曜日' },
  closed: { en: 'Closed', ko: '휴무', ja: '休業' },
  bring: {
    en: 'Bring your current glasses and a prescription from the last two years.',
    ko: '현재 사용 중인 안경과 최근 2년 안에 받은 처방전을 지참해 주시기 바랍니다.',
    ja: '現在お使いの眼鏡と、過去2年以内の処方箋をお持ちください。',
  },
  week: { en: 'Week of 23 November', ko: '11월 23일 주간', ja: '11月23日の週' },
  dayDate: { en: '{day} {date} November', ko: '11월 {date}일 {day}', ja: '11月{date}日 {day}' },
  times: { en: 'Times on {when}', ko: '{when} 가능 시간', ja: '{when}の空き時間' },
  taken: { en: 'taken', ko: '예약됨', ja: '予約済み' },
  timeError: { en: 'Choose a time for the fitting.', ko: '피팅 시간을 선택해 주십시오.', ja: 'フィッティングの時間を選んでください。' },
  name: { en: 'Name', ko: '이름', ja: 'お名前' },
  email: { en: 'Email', ko: '이메일', ja: 'メールアドレス' },
  nameError: { en: 'Enter your name for the booking.', ko: '예약자 이름을 입력해 주십시오.', ja: '予約者のお名前を入力してください。' },
  emailError: {
    en: 'Enter an email address, like name@example.com.',
    ko: 'name@example.com 같은 형식의 이메일 주소를 입력해 주십시오.',
    ja: 'name@example.com のような形式でメールアドレスを入力してください。',
  },
  noTime: { en: 'Choose a time', ko: '시간 선택', ja: '時間を選択' },
  with: { en: 'With {optician}, dispensing optician', ko: '담당 {optician}, 조제 안경사', ja: '担当 {optician}（眼鏡士）' },
  submit: { en: 'Book this fitting', ko: '이 피팅 예약하기', ja: 'このフィッティングを予約する' },
  doneTitle: { en: 'Your fitting is booked, {name}.', ko: '{name}님, 피팅 예약이 완료되었습니다.', ja: '{name}様、フィッティングのご予約が完了しました。' },
  doneWhen: { en: 'When', ko: '일시', ja: '日時' },
  doneWhenValue: { en: '{when}, {time} to {end}', ko: '{when}, {time}~{end}', ja: '{when} {time}〜{end}' },
  doneWhere: { en: 'Where', ko: '장소', ja: '場所' },
  doneWith: { en: 'With', ko: '담당', ja: '担当' },
  doneWithValue: { en: '{optician}, dispensing optician', ko: '{optician}, 조제 안경사', ja: '{optician}（眼鏡士）' },
  doneMail: {
    en: 'A confirmation is on its way to {email}.',
    ko: '{email} 주소로 확인 메일을 보내 드렸습니다.',
    ja: '確認メールを {email} 宛にお送りしました。',
  },
  change: { en: 'Change the booking', ko: '예약 변경', ja: '予約を変更する' },
} satisfies Record<string, Tri>;

const FOOTER = {
  line: {
    en: 'Prescription lenses made to order in Stockbridge since 2011.',
    ko: '2011년부터 Stockbridge에서 주문 제작해 온 처방 렌즈.',
    ja: '2011年からStockbridgeで注文製作している処方レンズ。',
  },
  shop: { en: 'Shop and workshop', ko: '매장 및 작업장', ja: '店舗と工房' },
  phone: { en: 'Phone', ko: '전화', ja: '電話' },
  hours: { en: 'Opening hours', ko: '영업시간', ja: '営業時間' },
  sunday: { en: 'Closed on Sunday', ko: '일요일 휴무', ja: '日曜定休' },
} satisfies Record<string, Tri>;

const PROMPT_EN = `Design one real page in Glass Orbit style: translucent rose glass panes over a deep plum field, with glass used only where the subject is glass or where the eye looks through something.

Pick a believable subject whose product is literally made of glass layers, such as a lens maker, a glazier or a camera filter brand, and write its real content. The page must read as that subject's page, never as a page about its own style. Here it is Halo Optics, a lens workshop in Edinburgh that makes prescription lenses in five layers.

COLOR TOKENS:
--bg: #241024
--plum: #3a1538 (the glow at the top of the page and any opaque menu surface)
--ink: #fbeaf3
--muted: rgba(251,234,243,0.74)
--line: rgba(255,255,255,0.3)
--edge: rgba(255,255,255,0.44) (the edge of every control and of the glass panes; the outermost lens pane takes 70%)
--rose: #ff7ab8 (the one accent: the primary button, the chosen strength, ticked boxes, the ring in the logo)
--rose-ink: #2b0a24 (text on rose and on chosen tiles)
Tints, used only in the lens over the chart and its three swatches: rose #de468a, smoke #5b5157, amber #c4842f.

GLASS:
- Glass is white at 8 to 24% with a rose cast, a 1px edge at 44% white, a rim light along its far edge and a backdrop blur (5px on the lens panes, 22px on the booking pane). The anti-reflective pane carries a rose sheen; the base lens, which has a body, is a deeper rose.
- It appears in three places only: the five panes of the lens stack, the lens held over the reading chart and the booking pane. The lens over the chart is the tint itself, multiplied onto the chart inside a 2px rim at 82% white.
- Everything else is flat: text, rules and the price table sit straight on the plum, and tiles, fields and plain buttons take a white fill of 7% or less at rest.

TYPOGRAPHY:
Two families. Syne for the headline, section headings, layer names and every large figure; Manrope for reading text, labels, controls and small figures.
H1: Syne 700, clamp(2.375rem, 7.2vw, 6.25rem) (clamp(2.375rem, 12.4vw, 3rem) under 600px), line-height 0.92, letter-spacing -0.05em.
H2: Syne 700, clamp(2rem, 4.4vw, 3.375rem), line-height 1, letter-spacing -0.045em.
Thicknesses: Syne 600 at 2.125rem (1.375 to 1.5rem in the compact stack) with the unit in Manrope 500 at 1rem. Readout figures Syne 600 at 2.125rem (1.75rem on phones), the total at 3rem (2.5rem under 900px).
Body: Manrope 400 at 1.0625rem, line-height 1.6. Nothing under 1rem.

LAYOUT:
- A shop bar with the name, three in-page links and one "Book a fitting" button.
- Hero: the headline on the left with a short statement beside it, then the exploded lens stack across the full width: five elliptical panes on a slanted dashed axis, overlapping glass over glass, each with a leader to its thickness, name and one sentence, alternating left and right. Under 1000px the stack becomes a compact drawing with the thickness beside each pane and the layers listed under it.
- Tint: a lit reading chart with the lens held over it on one side, the tint controls and a readout on the other.
- Prices: a ledger table, one row per layer, ruled off with a 2px line above the total.
- Fittings: one glass pane split into the shop (address, hours) and the picker (days, times, name and email).
- A footer with the address, phone and opening hours.
- Max width 1120px, sections 136px apart, 88px on phones.

COMPONENTS:
- Tint: three lens-shaped swatches as a radio group, and a three-part segmented control for the strength (15, 35, 60%). Both change the lens over the chart and a readout of light let through, filter category and price for the pair.
- Ledger: each coating has a checkbox that leaves it out and updates the total. The base lens cannot be removed, and the tint needs the hard coat it is dyed into.
- Day and time tiles: 14px radius and a 1px edge. Chosen is filled with ink and set in rose-ink; taken is dashed, struck through and cannot be chosen.
- Buttons: rectangles with a 14px radius. One rose button per view.
- Form: labels above the fields and errors under them. A valid booking is replaced by a confirmation that takes focus.

MOTION:
- The tint colour and strength fade over 400ms. Nothing moves on its own.
- prefers-reduced-motion removes the fade.

FORBIDDEN:
- Glass cards for ordinary content, glass behind text blocks, grids of frosted tiles
- Gradient text, purple-to-pink gradient headings, orbs, stars, cosmic backgrounds
- Pill buttons, chips, badges, small labels above headings, all-caps tracked labels
- Arrows on links, middle-dot meta strings, numbers on things that are not a sequence
- Palette switchers, code snippets about the style, blur values shown as content
- Emoji and figurative illustration

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML and CSS: an ordered list for the layers, radio groups, a table for the ledger, a labelled form
3) Working tint, strength, ledger, day, time and form states
4) Responsive layout down to 320px with no horizontal scroll; the ledger becomes stacked rows on phones
5) Visible focus, text alternatives for the drawings, reduced-motion support`;

const PROMPT_KO = `Glass Orbit 스타일의 실제 페이지 하나를 디자인한다. 깊은 플럼 바탕 위에 반투명한 로즈 유리 패널을 올리며, 유리는 주제가 유리이거나 눈이 무언가를 통해 보는 자리에만 쓴다.

제품이 말 그대로 유리 층으로 만들어지는 그럴듯한 주제를 고르고, 실제 내용을 쓴다. 예를 들어 렌즈 제조사, 유리 시공사, 카메라 필터 브랜드처럼 한다. 페이지는 그 주제의 페이지로 읽혀야 하며, 스타일 자체에 관한 페이지처럼 읽혀서는 안 된다. 여기서는 에든버러의 렌즈 공방 Halo Optics이며, 다섯 층의 처방 렌즈를 만든다.

COLOR TOKENS:
--bg: #241024
--plum: #3a1538 (페이지 상단의 광채와 불투명한 메뉴 면)
--ink: #fbeaf3
--muted: rgba(251,234,243,0.74)
--line: rgba(255,255,255,0.3)
--edge: rgba(255,255,255,0.44) (모든 컨트롤과 유리 패널의 가장자리. 가장 바깥쪽 렌즈 패널은 70%를 쓴다)
--rose: #ff7ab8 (유일한 강조색: 기본 버튼, 선택된 농도, 체크된 상자, 로고의 고리)
--rose-ink: #2b0a24 (로즈 위와 선택된 타일 위의 텍스트)
틴트는 차트 위의 렌즈와 그 세 개의 색상 견본에만 쓴다: 로즈 #de468a, 스모크 #5b5157, 앰버 #c4842f.

GLASS:
- 유리는 로즈 기운이 도는 흰색을 8~24%로 쓰고, 44% 흰색의 1px 가장자리, 먼 쪽 가장자리를 따라 난 림 라이트, 배경 블러를 준다(렌즈 패널은 5px, 예약 패널은 22px). 무반사 패널에는 로즈 광택을 입히고, 본체가 있는 베이스 렌즈는 더 진한 로즈로 한다.
- 세 곳에만 나타난다: 렌즈 층을 이루는 다섯 패널, 독서용 차트 위에 든 렌즈, 예약 패널. 차트 위의 렌즈는 틴트 자체로, 흰색 82%의 2px 림 안에서 차트에 곱해진다.
- 그 밖의 모든 요소는 평면으로 둔다. 글자, 선, 가격표는 플럼 바탕 위에 바로 놓고, 타일, 입력란, 일반 버튼은 기본 상태에서 흰색 7% 이하의 채움을 쓴다.

TYPOGRAPHY:
서체는 두 가지다. 제목, 섹션 제목, 층 이름, 큰 숫자 전부에는 Syne을, 본문, 라벨, 컨트롤, 작은 숫자에는 Manrope를 쓴다.
H1: Syne 700, clamp(2.375rem, 7.2vw, 6.25rem) (600px 미만에서는 clamp(2.375rem, 12.4vw, 3rem)), line-height 0.92, letter-spacing -0.05em.
H2: Syne 700, clamp(2rem, 4.4vw, 3.375rem), line-height 1, letter-spacing -0.045em.
두께 숫자: Syne 600, 2.125rem(compact 스택에서는 1.375~1.5rem), 단위는 Manrope 500, 1rem. 판독값 숫자: Syne 600, 2.125rem(휴대폰에서는 1.75rem). 합계: 3rem(900px 미만에서는 2.5rem).
본문: Manrope 400, 1.0625rem, line-height 1.6. 1rem 미만은 쓰지 않는다.

LAYOUT:
- 이름, 페이지 내 링크 3개, "피팅 예약" 버튼 하나가 있는 매장 바.
- 히어로: 왼쪽에 제목, 옆에 짧은 설명, 그 아래 전체 너비에 분해된 렌즈 층을 둔다. 기울어진 점선 축 위에 타원형 패널 다섯 장을 유리 위에 유리를 겹쳐 놓고, 각 패널에서 두께, 이름, 한 문장으로 이어지는 지시선을 그으며 좌우로 번갈아 배치한다. 1000px 미만에서는 층 구조가 간결한 도면이 되어, 각 패널 옆에 두께를 두고 그 아래에 층 목록을 둔다.
- 틴트: 한쪽에는 조명을 받는 독서용 차트와 그 위에 든 렌즈, 다른 쪽에는 틴트 컨트롤과 판독값.
- 가격: 명세표. 층마다 한 행, 합계 위에는 2px 선을 긋는다.
- 피팅: 유리 패널 하나를 매장(주소, 영업시간)과 선택 영역(날짜, 시간, 이름, 이메일)으로 나눈다.
- 주소, 전화번호, 영업시간이 있는 푸터.
- 최대 너비 1120px, 섹션 간격 136px, 휴대폰에서는 88px.

COMPONENTS:
- 틴트: 렌즈 모양 색상 견본 세 개를 라디오 그룹으로 묶고, 농도(15, 35, 60%)는 세 칸짜리 세그먼트 컨트롤로 만든다. 둘 다 차트 위의 렌즈와, 투과율, 필터 카테고리, 한 쌍 가격의 판독값을 바꾼다.
- 명세표: 각 코팅에는 제외할 수 있는 체크박스가 있고, 합계가 바로 갱신된다. 베이스 렌즈는 뺄 수 없으며, 틴트는 염료가 입혀지는 하드코트가 있어야 한다.
- 날짜와 시간 타일: 반지름 14px, 1px 가장자리. 선택된 타일은 ink로 채우고 글자는 rose-ink로 두며, 예약된 타일은 점선에 취소선을 긋고 선택할 수 없다.
- 버튼: 반지름 14px의 사각형. 화면마다 로즈 버튼은 하나만 둔다.
- 폼: 라벨은 입력란 위에, 오류는 아래에 둔다. 유효한 예약은 포커스를 받는 확인 화면으로 바뀐다.

MOTION:
- 틴트 색과 농도는 400ms에 걸쳐 페이드된다. 스스로 움직이는 요소는 없다.
- prefers-reduced-motion에서는 페이드를 없앤다.

FORBIDDEN:
- 일반 콘텐츠를 담은 유리 카드, 텍스트 블록 뒤의 유리, 서리 낀 타일 격자
- 그라데이션 텍스트, 보라에서 분홍으로 가는 그라데이션 제목, 오브, 별, 우주 배경
- 알약형 버튼, 칩, 배지, 제목 위의 작은 라벨, 전부 대문자에 자간을 넓힌 라벨
- 링크의 화살표, 가운뎃점으로 이은 메타 문자열, 순서가 아닌 것에 붙인 번호
- 팔레트 전환기, 스타일에 관한 코드 조각, 콘텐츠로 노출된 블러 값
- 이모지와 구상 일러스트

OUTPUT:
1) 위 토큰에 대한 CSS 사용자 정의 속성
2) 의미에 맞는 HTML과 CSS: 층에는 순서 있는 목록, 라디오 그룹, 명세표에는 표, 라벨이 있는 폼
3) 틴트, 농도, 명세표, 날짜, 시간, 폼의 상태가 실제로 동작하도록 구현
4) 320px까지 가로 스크롤 없이 반응형 레이아웃. 휴대폰에서는 명세표를 쌓인 행으로 바꾼다
5) 보이는 포커스, 도면의 텍스트 대체, reduced-motion 지원`;

const PROMPT_JA = `Glass Orbit スタイルの実際のページを1枚デザインする。深いプラム色の地の上に半透明のローズのガラスパネルを置く。ガラスは、題材がガラスである場合、または目が何かを通して見る場所にだけ使う。

製品が文字通りガラスの層で作られている、もっともらしい題材を選び、その実際の内容を書く。例えばレンズメーカー、ガラス施工業者、カメラフィルターのブランドなど。ページはその題材のページとして読めなければならず、スタイル自体について書いたページに見えてはならない。ここでは、エディンバラのレンズ工房Halo Opticsで、5層の処方レンズを作る。

COLOR TOKENS:
--bg: #241024
--plum: #3a1538（ページ上部の光と、不透明なメニュー面）
--ink: #fbeaf3
--muted: rgba(251,234,243,0.74)
--line: rgba(255,255,255,0.3)
--edge: rgba(255,255,255,0.44)（すべてのコントロールとガラスパネルの縁。最も外側のレンズパネルは70%）
--rose: #ff7ab8（唯一のアクセント色: 主ボタン、選択した濃さ、チェックされたボックス、ロゴの輪）
--rose-ink: #2b0a24（ローズ上および選択されたタイル上の文字）
ティントは、チャート上のレンズと3つの色見本にのみ使う: ローズ #de468a、スモーク #5b5157、アンバー #c4842f。

GLASS:
- ガラスは、ローズの色味を帯びた白を8〜24%で使い、44%の白の1pxの縁、奥側の縁に沿ったリムライト、背景のぼかしを付ける（レンズパネルは5px、予約パネルは22px）。反射防止パネルにはローズの光沢を載せ、本体を持つベースレンズはより濃いローズにする。
- 使うのは3か所だけ: レンズの層を成す5枚のパネル、読書用チャートにかざしたレンズ、予約パネル。チャートにかざしたレンズはティントそのもので、白82%の2pxのリム内でチャートに乗算される。
- それ以外はすべて平面にする。文字、罫線、価格表はプラムの上に直接置き、タイル、入力欄、通常のボタンは通常時に白7%以下の塗りにする。

TYPOGRAPHY:
書体は2種類。見出し、セクション見出し、層の名前、大きな数字すべてにSyneを、本文、ラベル、コントロール、小さな数字にはManropeを使う。
H1: Syne 700, clamp(2.375rem, 7.2vw, 6.25rem)（600px未満ではclamp(2.375rem, 12.4vw, 3rem)）, line-height 0.92, letter-spacing -0.05em.
H2: Syne 700, clamp(2rem, 4.4vw, 3.375rem), line-height 1, letter-spacing -0.045em.
厚さの数値: Syne 600、2.125rem（compactスタックでは1.375〜1.5rem）、単位はManrope 500、1rem。表示値の数字: Syne 600、2.125rem（スマートフォンでは1.75rem）。合計: 3rem（900px未満では2.5rem）。
本文: Manrope 400、1.0625rem、line-height 1.6。1rem未満は使わない。

LAYOUT:
- 店名、ページ内リンク3つ、「フィッティングを予約」ボタン1つがある店舗バー。
- ヒーロー: 左に見出し、その横に短い説明文を置き、その下に全幅で分解したレンズの層を配置する。傾いた破線の軸の上に楕円形のパネル5枚を、ガラスの上にガラスを重ねて並べる。各パネルからは厚さ、名称、一文へ引き出し線を伸ばし、左右交互に配置する。1000px未満では、層の図を簡潔な図版にし、各パネルの横に厚さを置き、その下に層の一覧を置く。
- ティント: 片側に、照明を当てた読書用チャートとその上にかざしたレンズ、もう片側にティントの操作部と表示値を置く。
- 価格: 明細表。層ごとに1行、合計の上に2pxの罫線を引く。
- フィッティング: ガラスのパネル1枚を、店舗（住所、営業時間）と選択欄（日付、時間、名前、メールアドレス）に分ける。
- 住所、電話番号、営業時間を載せたフッター。
- 最大幅1120px、セクション間隔136px、スマートフォンでは88px。

COMPONENTS:
- ティント: レンズ形の色見本3つをラジオグループにし、濃さ（15、35、60%）は3分割のセグメントコントロールにする。どちらもチャート上のレンズと、透過率、フィルター区分、1組の価格の表示を変える。
- 明細表: 各コーティングにはチェックボックスがあり、外すと合計が更新される。ベースレンズは外せず、ティントは染料を入れるハードコートが必要。
- 日付と時間のタイル: 角の半径14px、1pxの縁。選択されたものはinkで塗り、文字はrose-inkにする。予約済みのものは点線で、取り消し線を引き、選べないようにする。
- ボタン: 角の半径14pxの長方形。1画面にローズのボタンは1つだけ。
- フォーム: ラベルは入力欄の上、エラーは下に置く。有効な予約は、フォーカスを受ける確認画面に置き換える。

MOTION:
- ティントの色と濃さは400msかけてフェードする。自発的に動く要素はない。
- prefers-reduced-motionでは、フェードをなくす。

FORBIDDEN:
- 通常のコンテンツを載せたガラスのカード、文章ブロックの背後のガラス、すりガラス状のタイルのグリッド
- グラデーションの文字、紫からピンクへのグラデーションの見出し、オーブ、星、宇宙風の背景
- ピル型ボタン、チップ、バッジ、見出しの上の小さなラベル、大文字で字間を広げたラベル
- リンクの矢印、中黒で区切ったメタ情報の文字列、順序のないものに付けた番号
- パレット切り替え、スタイルに関するコードの断片、コンテンツとして表示したぼかしの値
- 絵文字と具象イラスト

OUTPUT:
1) 上記トークンのCSSカスタムプロパティ
2) 意味に即したHTMLとCSS: 層には順序付きリスト、ラジオグループ、明細表には表、ラベル付きのフォーム
3) ティント、濃さ、明細表、日付、時間、フォームの各状態を実際に動作させる
4) 320pxまで横スクロールなしで対応するレスポンシブレイアウト。スマートフォンでは明細表を積み重ねた行にする
5) 見えるフォーカス、図版の代替テキスト、reduced-motionへの対応`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_KO, ja: PROMPT_JA };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const money = (amount: number) => `£${amount}`;

const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key]));

const addMinutes = (time: string, minutes: number) => {
  const [hours, mins] = time.split(':').map(Number);
  const total = hours * 60 + mins + minutes;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

const filterCategory = (light: number) => (light > 80 ? 0 : light > 43 ? 1 : light > 18 ? 2 : 3);

const isFree = (day: (typeof DAYS)[number], time: string) => day.times.includes(time) && !day.taken.includes(time);

export function PortedGlassOrbitPage({ lang }: PortedStylePageProps) {
  const [tintId, setTintId] = useState<TintId>('rose');
  const [strength, setStrength] = useState<Strength>(35);
  const [coatings, setCoatings] = useState<Record<CoatingId, boolean>>({ hard: true, ar: true, blue: true, top: true });
  const [tintOn, setTintOn] = useState(true);
  const [dayId, setDayId] = useState('thu');
  const [time, setTime] = useState<string | null>('11:45');
  const [guest, setGuest] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({ time: false, name: false, email: false });
  const [booked, setBooked] = useState(false);
  const pickRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const wasBooked = useRef(false);

  const t = (text: Tri) => text[lang];

  const tint = TINTS.find((item) => item.id === tintId) ?? TINTS[0];
  const light = tint.light[strength];
  const category = filterCategory(light);
  const tintPrice = TINT_PRICE[strength];
  const tintName = fill(t(LEDGER.tintName), { tint: t(tint.name), n: strength });
  const viewStyle = { '--ho-tint': tint.color, '--ho-a': String(TINT_ALPHA[strength]) } as CSSProperties;

  // The tint is dyed into the hard coat, so it leaves the build with it.
  const tintIncluded = tintOn && coatings.hard;
  const total = BASE_PRICE
    + LEDGER_LAYERS.reduce((sum, layer) => (layer.id !== 'base' && coatings[layer.id] ? sum + layer.price : sum), 0)
    + (tintIncluded ? tintPrice : 0);
  const readyDays = tintIncluded ? 8 : 6;

  const day = DAYS.find((item) => item.id === dayId) ?? DAYS[0];
  const when = fill(t(BOOK.dayDate), { day: t(day.long), date: day.date });

  // The form and the confirmation replace each other, and the control that had
  // focus leaves the page with them. Focus goes to what took its place.
  useEffect(() => {
    if (booked) doneRef.current?.focus();
    else if (wasBooked.current) pickRef.current?.querySelector<HTMLInputElement>('input[name="ho-day"]:checked')?.focus();
    wasBooked.current = booked;
  }, [booked]);

  const chooseDay = (id: string) => {
    const next = DAYS.find((item) => item.id === id) ?? DAYS[0];
    setDayId(next.id);
    // A time taken on the new day, or not offered on it, is no longer a choice.
    if (time !== null && !isFree(next, time)) setTime(null);
  };

  const chooseTime = (value: string) => {
    setTime(value);
    if (errors.time) setErrors({ ...errors, time: false });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = { time: time === null, name: guest.name.trim() === '', email: !EMAIL_PATTERN.test(guest.email.trim()) };
    if (!next.time && !next.name && !next.email) {
      setErrors(next);
      setBooked(true);
      return;
    }
    // The error is rendered first, so the whole field and its message can be brought into view.
    flushSync(() => setErrors(next));
    const field = next.time
      ? pickRef.current?.querySelector<HTMLInputElement>('input[name="ho-time"]:not(:disabled)')
      : next.name
        ? nameRef.current
        : emailRef.current;
    field?.focus();
    field?.closest('.ho-times, .ho-field')?.scrollIntoView({ block: 'nearest' });
  };

  return (
    <FusionShell
      fusionId="glass-orbit"
      lang={lang}
      tone="dark"
      accent="#ff7ab8"
      prev={{ href: '/pages/neon-drift.html', label: 'Neon Drift' }}
      next={{ href: '/pages/terminal-core.html', label: 'Terminal Core' }}
      prompts={PROMPTS}
    >
      <div className="ho">
        <header className="ho-bar">
          <p className="ho-mark"><i aria-hidden="true" />{BRAND}</p>
          <nav className="ho-bar__nav" aria-label={t(HERO.nav)}>
            <a href="#ho-tint">{t(HERO.navTints)}</a>
            <a href="#ho-prices">{t(HERO.navPrices)}</a>
            <a href="#ho-visit">{t(HERO.navVisit)}</a>
          </nav>
          <a className="ho-btn ho-bar__book" href="#ho-book">
            <span className="ho-bar__long">{t(HERO.book)}</span>
            <span className="ho-bar__short">{t(HERO.bookShort)}</span>
          </a>
        </header>

        <section className="ho-hero" aria-labelledby="ho-title">
          <div className="ho-hero__head">
            <h1 id="ho-title">{t(HERO.title)}</h1>
            <p className="ho-lede">{t(HERO.lede)}</p>
          </div>

          <div className="ho-stack">
            <div className="ho-stack__glow" aria-hidden="true" />
            <div className="ho-stack__axis" aria-hidden="true" />
            <p className="ho-stack__caption" aria-hidden="true">{t(HERO.caption)}</p>
            <ol className="ho-layers" aria-label={t(HERO.stack)}>
              {LAYERS.map((layer) => (
                <li key={layer.id} className={`ho-layer ho-layer--${layer.id} ho-layer--${layer.side}`}>
                  <span className="ho-pane" aria-hidden="true">
                    {layer.id === 'base' ? <span className="ho-pane__face" /> : null}
                    <span className="ho-pane__mark">{layer.um}<small>{UNIT}</small></span>
                  </span>
                  <span className="ho-cap">
                    <b className="ho-um">{layer.um}<small>{UNIT}</small></b>
                    <span className="ho-nm">{t(layer.name)}</span>
                    <span className="ho-fn">{t(layer.note)}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="ho-section ho-tint" aria-labelledby="ho-tint">
          <div className="ho-tint__head">
            <h2 id="ho-tint">{t(TINT.title)}</h2>
            <p className="ho-note">{t(TINT.note)}</p>
          </div>

          <div className="ho-view" role="img" aria-label={fill(t(TINT.view), { tint: t(tint.name), n: strength })} style={viewStyle}>
            <div className="ho-chart">
              {CHART.map(([acuity, letters], index) => (
                <p key={acuity} className={`ho-chart__row ho-chart__row--${index + 1}`}>
                  <span className="ho-chart__acuity">{acuity}</span>
                  {letters}
                </p>
              ))}
            </div>
            <span className="ho-lens" />
            <span className="ho-rim" />
          </div>

          <div className="ho-tint__controls">
            <fieldset className="ho-choose">
              <legend>{t(TINT.tint)}</legend>
              <div className="ho-swatches">
                {TINTS.map((item) => (
                  <label key={item.id} className="ho-swatch" style={{ '--ho-sw': item.color } as CSSProperties}>
                    <input type="radio" name="ho-tint" value={item.id} checked={tintId === item.id} onChange={() => setTintId(item.id)} />
                    <i aria-hidden="true" />
                    <span>{t(item.name)}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <fieldset className="ho-choose">
              <legend>{t(TINT.strength)}</legend>
              <div className="ho-seg">
                {STRENGTHS.map((value) => (
                  <label key={value}>
                    <input type="radio" name="ho-strength" value={value} checked={strength === value} onChange={() => setStrength(value)} />
                    <span>{value}%</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="ho-readout" aria-live="polite" aria-atomic="true">
              <dl>
                <div><dt>{t(TINT.light)}</dt><dd>{light}%</dd></div>
                <div><dt>{t(TINT.category)}</dt><dd>{category}</dd></div>
                <div><dt>{t(TINT.price)}</dt><dd>{money(tintPrice)}</dd></div>
              </dl>
              <p className="ho-readout__note">{t(CATEGORY_NOTE[category])}</p>
            </div>
          </div>
        </section>

        <section className="ho-section" aria-labelledby="ho-prices">
          <h2 id="ho-prices" className="ho-ledger__title">{t(LEDGER.title)}</h2>
          <p className="ho-note">{t(LEDGER.note)}</p>
          {/* The roles are restated because the rows become grids on phones, which drops table semantics. */}
          <table className="ho-build" role="table" aria-labelledby="ho-prices">
            <thead role="rowgroup">
              <tr role="row">
                <th role="columnheader" scope="col" className="ho-build__inc"><span className="ho-sr">{t(LEDGER.include)}</span></th>
                <th role="columnheader" scope="col">{t(LEDGER.layer)}</th>
                <th role="columnheader" scope="col">{t(LEDGER.what)}</th>
                <th role="columnheader" scope="col">{t(LEDGER.thickness)}</th>
                <th role="columnheader" scope="col" className="ho-build__px">{t(LEDGER.price)}</th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {LEDGER_LAYERS.map((layer) => {
                const on = layer.id === 'base' || coatings[layer.id];
                return (
                  <tr key={layer.id} role="row" className={on ? undefined : 'is-off'}>
                    <td role="cell" className="ho-build__inc" data-label={t(LEDGER.include)}>
                      {layer.id === 'base' ? null : (
                        <label className="ho-check">
                          <input
                            type="checkbox"
                            checked={on}
                            aria-labelledby={`ho-row-${layer.id}`}
                            onChange={() => {
                              if (layer.id !== 'base') setCoatings({ ...coatings, [layer.id]: !coatings[layer.id] });
                            }}
                          />
                          <svg viewBox="0 0 16 16" aria-hidden="true"><polyline points="3.5 8.5 6.5 11.5 12.5 4.5" /></svg>
                        </label>
                      )}
                    </td>
                    <th role="rowheader" scope="row" className="ho-build__nm" id={`ho-row-${layer.id}`} data-label={t(LEDGER.layer)}>{t(layer.name)}</th>
                    <td role="cell" className="ho-build__what" data-label={t(LEDGER.what)}>{t(layer.what)}</td>
                    <td role="cell" className="ho-build__um" data-label={t(LEDGER.thickness)}>{layer.um} {UNIT}</td>
                    <td role="cell" className="ho-build__px" data-label={t(LEDGER.price)}>
                      <span className="ho-px">{money(layer.price)}</span>
                      {on ? null : <span className="ho-sr">, {t(LEDGER.leftOut)}</span>}
                    </td>
                  </tr>
                );
              })}
              <tr role="row" className={tintIncluded ? undefined : 'is-off'}>
                <td role="cell" className="ho-build__inc" data-label={t(LEDGER.include)}>
                  <label className="ho-check">
                    <input
                      type="checkbox"
                      checked={tintIncluded}
                      disabled={!coatings.hard}
                      aria-labelledby="ho-row-tint"
                      aria-describedby={coatings.hard ? undefined : 'ho-tint-needs'}
                      onChange={() => setTintOn(!tintOn)}
                    />
                    <svg viewBox="0 0 16 16" aria-hidden="true"><polyline points="3.5 8.5 6.5 11.5 12.5 4.5" /></svg>
                  </label>
                </td>
                <th role="rowheader" scope="row" className="ho-build__nm" id="ho-row-tint" data-label={t(LEDGER.layer)}>{tintName}</th>
                <td role="cell" className="ho-build__what" data-label={t(LEDGER.what)}>
                  {coatings.hard ? t(LEDGER.tintWhat) : <span id="ho-tint-needs">{t(LEDGER.tintNeeds)}</span>}
                </td>
                <td role="cell" className="ho-build__um" data-label={t(LEDGER.thickness)} />
                <td role="cell" className="ho-build__px" data-label={t(LEDGER.price)}>
                  <span className="ho-px">{money(tintPrice)}</span>
                  {tintIncluded ? null : <span className="ho-sr">, {t(LEDGER.leftOut)}</span>}
                </td>
              </tr>
              <tr role="row">
                <td role="cell" className="ho-build__inc" data-label={t(LEDGER.include)} />
                <th role="rowheader" scope="row" className="ho-build__nm" data-label={t(LEDGER.layer)}>{t(LEDGER.edging)}</th>
                <td role="cell" className="ho-build__what" data-label={t(LEDGER.what)}>{t(LEDGER.edgingWhat)}</td>
                <td role="cell" className="ho-build__um" data-label={t(LEDGER.thickness)} />
                <td role="cell" className="ho-build__px" data-label={t(LEDGER.price)}><span className="ho-px ho-px--inc">{t(LEDGER.included)}</span></td>
              </tr>
            </tbody>
            <tfoot role="rowgroup">
              <tr role="row">
                <td role="cell" className="ho-build__inc" />
                <th role="rowheader" scope="row" className="ho-build__nm">{t(LEDGER.total)}</th>
                <td role="cell" className="ho-build__what">{fill(t(LEDGER.ready), { n: readyDays })}</td>
                <td role="cell" className="ho-build__um" />
                <td role="cell" className="ho-build__px"><span className="ho-px ho-px--total">{money(total)}</span></td>
              </tr>
            </tfoot>
          </table>
          <p className="ho-sr" aria-live="polite">{`${t(LEDGER.total)} ${money(total)}`}</p>
        </section>

        <section className="ho-section ho-book" aria-labelledby="ho-book">
          <div className="ho-book__glow" aria-hidden="true" />
          <h2 id="ho-book">{t(BOOK.title)}</h2>
          <p className="ho-note">{t(BOOK.note)}</p>
          <div className="ho-slots">
            <div className="ho-shop">
              <h3>{t(BOOK.shop)}</h3>
              <address>{SHOP_ADDRESS[0]}<br />{SHOP_ADDRESS[1]}</address>
              <dl className="ho-hours">
                <div><dt>{t(BOOK.weekdays)}</dt><dd>{t(BOOK.weekdayHours)}</dd></div>
                <div><dt>{t(BOOK.saturday)}</dt><dd>{t(BOOK.saturdayHours)}</dd></div>
                <div><dt>{t(BOOK.sunday)}</dt><dd>{t(BOOK.closed)}</dd></div>
              </dl>
              <p className="ho-shop__bring">{t(BOOK.bring)}</p>
            </div>

            <div className="ho-pick" ref={pickRef}>
              {booked && time !== null ? (
                <div className="ho-done" ref={doneRef} tabIndex={-1} role="group" aria-labelledby="ho-done-title">
                  <h3 id="ho-done-title">{fill(t(BOOK.doneTitle), { name: guest.name.trim() })}</h3>
                  <dl className="ho-done__rows">
                    <div>
                      <dt>{t(BOOK.doneWhen)}</dt>
                      <dd>{fill(t(BOOK.doneWhenValue), { when, time, end: addMinutes(time, FITTING_MINUTES) })}</dd>
                    </div>
                    <div>
                      <dt>{t(BOOK.doneWhere)}</dt>
                      <dd>{SHOP_ADDRESS.join(', ')}</dd>
                    </div>
                    <div>
                      <dt>{t(BOOK.doneWith)}</dt>
                      <dd>{fill(t(BOOK.doneWithValue), { optician: day.optician })}</dd>
                    </div>
                  </dl>
                  <p className="ho-done__mail">{fill(t(BOOK.doneMail), { email: guest.email.trim() })}</p>
                  <button type="button" className="ho-btn" onClick={() => setBooked(false)}>{t(BOOK.change)}</button>
                </div>
              ) : (
                <form className="ho-form" noValidate onSubmit={handleSubmit}>
                  <fieldset className="ho-days">
                    <legend>{t(BOOK.week)}</legend>
                    <div className="ho-days__grid">
                      {/* Each tile is named by what it shows ("Thu 26"); the legend gives the week. */}
                      {DAYS.map((item) => (
                        <label key={item.id} className="ho-tile">
                          <input
                            type="radio"
                            name="ho-day"
                            value={item.id}
                            checked={dayId === item.id}
                            onChange={() => chooseDay(item.id)}
                          />
                          <span>{t(item.short)}</span>{' '}
                          <b>{item.date}</b>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="ho-times" aria-describedby={errors.time ? 'ho-time-error' : undefined}>
                    <legend>{fill(t(BOOK.times), { when })}</legend>
                    <div className="ho-times__grid">
                      {day.times.map((slot) => {
                        const taken = day.taken.includes(slot);
                        return (
                          <label key={slot} className={`ho-tile${taken ? ' is-taken' : ''}`}>
                            <input
                              type="radio"
                              name="ho-time"
                              value={slot}
                              checked={time === slot}
                              disabled={taken}
                              onChange={() => chooseTime(slot)}
                            />
                            {taken ? (
                              <>
                                <s>{slot}</s>
                                <small> {t(BOOK.taken)}</small>
                              </>
                            ) : <span>{slot}</span>}
                          </label>
                        );
                      })}
                    </div>
                    {errors.time ? <p className="ho-error" id="ho-time-error" role="alert">{t(BOOK.timeError)}</p> : null}
                  </fieldset>

                  <div className="ho-fields">
                    <div className={`ho-field${errors.name ? ' is-invalid' : ''}`}>
                      <label htmlFor="ho-name">{t(BOOK.name)}</label>
                      <input
                        id="ho-name"
                        ref={nameRef}
                        type="text"
                        name="name"
                        autoComplete="name"
                        required
                        value={guest.name}
                        aria-invalid={errors.name}
                        aria-describedby={errors.name ? 'ho-name-error' : undefined}
                        onChange={(event) => {
                          setGuest({ ...guest, name: event.target.value });
                          if (errors.name) setErrors({ ...errors, name: false });
                        }}
                      />
                      {errors.name ? <p className="ho-error" id="ho-name-error" role="alert">{t(BOOK.nameError)}</p> : null}
                    </div>
                    <div className={`ho-field${errors.email ? ' is-invalid' : ''}`}>
                      <label htmlFor="ho-email">{t(BOOK.email)}</label>
                      <input
                        id="ho-email"
                        ref={emailRef}
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        value={guest.email}
                        aria-invalid={errors.email}
                        aria-describedby={errors.email ? 'ho-email-error' : undefined}
                        onChange={(event) => {
                          setGuest({ ...guest, email: event.target.value });
                          if (errors.email) setErrors({ ...errors, email: false });
                        }}
                      />
                      {errors.email ? <p className="ho-error" id="ho-email-error" role="alert">{t(BOOK.emailError)}</p> : null}
                    </div>
                  </div>

                  <div className="ho-confirm">
                    <p className="ho-confirm__when">
                      {time === null ? <span className="ho-confirm__none">{t(BOOK.noTime)}</span> : `${when}, ${time}`}
                      <span className="ho-confirm__with">{fill(t(BOOK.with), { optician: day.optician })}</span>
                    </p>
                    <button className="ho-btn ho-btn--rose" type="submit">{t(BOOK.submit)}</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        <footer className="ho-footer" id="ho-visit">
          <div className="ho-footer__brand">
            <p className="ho-mark"><i aria-hidden="true" />{BRAND}</p>
            <p className="ho-footer__line">{t(FOOTER.line)}</p>
          </div>
          <dl className="ho-footer__facts">
            <div>
              <dt>{t(FOOTER.shop)}</dt>
              <dd>{SHOP_ADDRESS[0]}<br />{SHOP_ADDRESS[1]}</dd>
            </div>
            <div>
              <dt>{t(FOOTER.phone)}</dt>
              <dd><a href={`tel:+44${SHOP_PHONE.replace(/\s/g, '').slice(1)}`}>{SHOP_PHONE}</a></dd>
            </div>
            <div>
              <dt>{t(FOOTER.hours)}</dt>
              <dd>
                {t(BOOK.weekdays)} {t(BOOK.weekdayHours)}<br />
                {t(BOOK.saturday)} {t(BOOK.saturdayHours)}<br />
                {t(FOOTER.sunday)}
              </dd>
            </div>
          </dl>
          <p className="ho-footer__legal">© 2026 {BRAND}</p>
        </footer>
      </div>
    </FusionShell>
  );
}
