import { useRef, useState, type FormEvent, type MouseEvent } from 'react';
import { flushSync } from 'react-dom';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedZenMinimalismPage.css';

// Dasil, a tea room with six seats in Bukchon, set in one monospace on white.
// The page is built from the room's day: one line for the day with a bar for each
// 90-minute sitting, a tea list with dotted leaders, a reservation form whose sitting
// row repeats the day line, a walk from the station timed in minutes, and a week strip
// of opening days. The bar means "seats exist at this time" wherever it appears.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

const fill = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key]));

/* ---------- the room's book ---------- */

const NAME = 'Dasil';
const PHONE = '02-742-0618';
const SEATS = 6;
const DAY_MS = 86_400_000;

// The page is set on one day, Friday 20 November 2026. Seats can be booked four weeks ahead.
const TODAY = Date.UTC(2026, 10, 20);
const LAST_DAY = TODAY + 28 * DAY_MS;
const FIRST_FORM_DAY = Date.UTC(2026, 10, 28);

/** 0 is Monday, 6 is Sunday. */
function weekday(day: number) {
  return (new Date(day).getUTCDay() + 6) % 7;
}

// The date strip pages through the weeks from the one that holds today to the one
// that holds the last bookable day.
const FIRST_MONDAY = TODAY - weekday(TODAY) * DAY_MS;
const WEEK_MS = 7 * DAY_MS;
const WEEK_COUNT = Math.floor((LAST_DAY - FIRST_MONDAY) / WEEK_MS) + 1;
const weekOf = (day: number) => Math.floor((day - FIRST_MONDAY) / WEEK_MS);

type DayState = 'past' | 'closed' | 'later';

function dayState(day: number): DayState | null {
  if (day < TODAY) return 'past';
  if (day > LAST_DAY) return 'later';
  if (weekday(day) < 2) return 'closed';
  return null;
}

const SITTINGS = [
  { start: '11:00', end: '12:30', hold: '11:15' },
  { start: '13:30', end: '15:00', hold: '13:45' },
  { start: '16:00', end: '17:30', hold: '16:15' },
  { start: '18:30', end: '20:00', hold: '18:45' },
];

// Seats still free in the book. Today and the 28th are written out; the other days
// follow a fixed pattern, so every visit shows the same book.
const BOOK: Record<number, number[]> = {
  [TODAY]: [0, 2, 5, 1],
  [FIRST_FORM_DAY]: [0, 1, 4, 6],
};

function freeInBook(day: number, sitting: number) {
  const written = BOOK[day];
  if (written) return written[sitting];
  return (new Date(day).getUTCDate() * 5 + sitting * 3 + 2) % 7;
}

function validMobile(value: string) {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('82')) digits = `0${digits.slice(2)}`;
  return /^01\d{8,9}$/.test(digits);
}

/* ---------- copy ---------- */

const WEEKDAYS: Tri[] = [
  { en: 'Monday', ko: '월요일', ja: '月曜日' },
  { en: 'Tuesday', ko: '화요일', ja: '火曜日' },
  { en: 'Wednesday', ko: '수요일', ja: '水曜日' },
  { en: 'Thursday', ko: '목요일', ja: '木曜日' },
  { en: 'Friday', ko: '금요일', ja: '金曜日' },
  { en: 'Saturday', ko: '토요일', ja: '土曜日' },
  { en: 'Sunday', ko: '일요일', ja: '日曜日' },
];

const WEEKDAYS_SHORT: Tri[] = [
  { en: 'Mon', ko: '월', ja: '月' },
  { en: 'Tue', ko: '화', ja: '火' },
  { en: 'Wed', ko: '수', ja: '水' },
  { en: 'Thu', ko: '목', ja: '木' },
  { en: 'Fri', ko: '금', ja: '金' },
  { en: 'Sat', ko: '토', ja: '土' },
  { en: 'Sun', ko: '일', ja: '日' },
];

const MONTHS: Tri[] = [
  { en: 'January', ko: '1월', ja: '1月' },
  { en: 'February', ko: '2월', ja: '2月' },
  { en: 'March', ko: '3월', ja: '3月' },
  { en: 'April', ko: '4월', ja: '4月' },
  { en: 'May', ko: '5월', ja: '5月' },
  { en: 'June', ko: '6월', ja: '6月' },
  { en: 'July', ko: '7월', ja: '7月' },
  { en: 'August', ko: '8월', ja: '8月' },
  { en: 'September', ko: '9월', ja: '9月' },
  { en: 'October', ko: '10월', ja: '10月' },
  { en: 'November', ko: '11월', ja: '11月' },
  { en: 'December', ko: '12월', ja: '12月' },
];

const DATES = {
  long: { en: '{weekday} {day} {month}', ko: '{month} {day}일 {weekday}', ja: '{month}{day}日 {weekday}' },
  sameMonth: { en: '{from} to {to} {month}', ko: '{month} {from}일 – {to}일', ja: '{month}{from}日～{to}日' },
  twoMonths: {
    en: '{from} {fromMonth} to {to} {toMonth}',
    ko: '{fromMonth} {from}일 – {toMonth} {to}일',
    ja: '{fromMonth}{from}日～{toMonth}{to}日',
  },
} satisfies Record<string, Tri>;

const SEATS_TEXT = {
  full: { en: 'Full', ko: '마감', ja: '満席' },
  one: { en: '{n} seat left', ko: '{n}석 남음', ja: '残り{n}席' },
  many: { en: '{n} seats left', ko: '{n}석 남음', ja: '残り{n}席' },
  guestOne: { en: '1 guest', ko: '1명', ja: '1名' },
  guestMany: { en: '{n} guests', ko: '{n}명', ja: '{n}名' },
} satisfies Record<string, Tri>;

const HERO = {
  line: {
    en: 'A tea room with six seats in Bukchon, Seoul, pouring four sittings a day.',
    ko: '서울 북촌에 있는 좌석 여섯 개의 다실로, 하루에 네 번 회차를 운영합니다.',
    ja: 'ソウル北村にある6席の茶室。1日4回の回制で、お茶をお出しします。',
  },
  today: { en: 'Today, {date}', ko: '오늘, {date}', ja: '本日、{date}' },
  reserveAt: { en: 'Reserve at {time}, {left}', ko: '{time} 회차 예약, {left}', ja: '{time}の回を予約、{left}' },
} satisfies Record<string, Tri>;

const TEAS = {
  title: { en: 'Teas for late autumn', ko: '늦가을 차', ja: '晩秋のお茶' },
  note: {
    en: 'Each tea comes by the pot with one rice cake, and the kettle is refilled for as long as your sitting lasts. Prices are in won.',
    ko: '모든 차는 주전자째 나오며 떡 한 조각이 함께 나갑니다. 회차가 끝날 때까지 물을 계속 채워 드립니다. 가격은 원화 기준입니다.',
    ja: 'どのお茶も急須ごとお出しし、餅菓子を一つお付けします。回が終わるまで湯を差し足します。価格はウォン表示です。',
  },
  list: [
    {
      name: { en: 'Ujeon green tea', ko: '우전 녹차', ja: '雨前（ウジョン）緑茶' },
      price: '14,000',
      from: {
        en: 'Hwagae Valley, Hadong. Picked 12 to 17 April 2026, before the grain rain.',
        ko: '하동 화개. 곡우 전인 2026년 4월 12일~17일에 땄습니다.',
        ja: '河東・花開。穀雨前の2026年4月12日～17日に摘採。',
      },
      steep: { en: '70 °C for 90 seconds, three infusions.', ko: '70 °C에서 90초, 3회 우림.', ja: '70 °C、90秒、3煎。' },
    },
    {
      name: { en: 'Sejak green tea', ko: '세작 녹차', ja: '細雀（セジャク）緑茶' },
      price: '11,000',
      from: {
        en: 'Boseong, South Jeolla. Picked 2 to 9 May 2026.',
        ko: '전라남도 보성. 2026년 5월 2일~9일에 땄습니다.',
        ja: '全羅南道・宝城。2026年5月2日～9日に摘採。',
      },
      steep: { en: '75 °C for 60 seconds, three infusions.', ko: '75 °C에서 60초, 3회 우림.', ja: '75 °C、60秒、3煎。' },
    },
    {
      name: { en: 'Hwangcha yellow tea', ko: '황차', ja: '黄茶（ファンチャ）' },
      price: '12,000',
      from: {
        en: 'Hadong. Picked in late May 2026 and rested in cotton cloth for two days.',
        ko: '하동. 2026년 5월 말에 따서 면포에 싸 이틀간 두었습니다.',
        ja: '河東。2026年5月下旬に摘採し、綿布に包んで2日間寝かせました。',
      },
      steep: { en: '90 °C for 45 seconds, five infusions.', ko: '90 °C에서 45초, 5회 우림.', ja: '90 °C、45秒、5煎。' },
    },
    {
      name: { en: 'Jeju black tea', ko: '제주 홍차', ja: '済州紅茶' },
      price: '12,000',
      from: {
        en: 'Seogwipo, Jeju. Picked in June 2026 from second-flush leaves.',
        ko: '제주 서귀포. 2026년 6월에 두 번째 채엽한 찻잎으로 만들었습니다.',
        ja: '済州・西帰浦。2026年6月、二番茶の茶葉から作りました。',
      },
      steep: { en: '95 °C for 3 minutes, two infusions.', ko: '95 °C에서 3분, 2회 우림.', ja: '95 °C、3分、2煎。' },
    },
    {
      name: { en: 'Gamguk chrysanthemum', ko: '감국차', ja: '甘菊（カムグク）茶' },
      price: '13,000',
      from: {
        en: 'Sancheong, South Gyeongsang. Flowers picked 18 to 24 October 2026 and dried over low heat for nine days.',
        ko: '경상남도 산청. 2026년 10월 18일~24일에 꽃을 따서 약한 불에 9일간 말렸습니다.',
        ja: '慶尚南道・山清。2026年10月18日～24日に花を摘み、弱火で9日間乾燥させました。',
      },
      steep: { en: '85 °C for 2 minutes, four infusions.', ko: '85 °C에서 2분, 4회 우림.', ja: '85 °C、2分、4煎。' },
    },
  ],
};

const RESERVE = {
  title: { en: 'Reserve seats', ko: '좌석 예약', ja: '席の予約' },
  note: {
    en: 'A sitting lasts 90 minutes. You can book up to four weeks ahead, and a party of six has the room to itself.',
    ko: '한 회차는 90분입니다. 최대 4주 전까지 예약할 수 있으며, 여섯 명이 오시면 방을 전부 쓰실 수 있습니다.',
    ja: '1回は90分です。4週間前まで予約でき、6名でお越しの場合は店内を貸し切りでご利用いただけます。',
  },
  date: { en: 'Date', ko: '날짜', ja: '日付' },
  earlier: { en: 'Earlier week', ko: '이전 주', ja: '前の週' },
  later: { en: 'Later week', ko: '다음 주', ja: '次の週' },
  sitting: { en: 'Sitting', ko: '회차', ja: '回' },
  sittingError: { en: 'Choose a sitting with free seats.', ko: '잔여 좌석이 있는 회차를 선택하세요.', ja: '空席のある回を選んでください。' },
  guests: { en: 'Guests', ko: '인원', ja: '人数' },
  fitOne: { en: '1 seat is free at {time} on this day.', ko: '이날 {time} 회차는 1석이 남아 있습니다.', ja: 'この日の{time}の回は残り1席です。' },
  fitMany: { en: '{n} seats are free at {time} on this day.', ko: '이날 {time} 회차는 {n}석이 남아 있습니다.', ja: 'この日の{time}の回は残り{n}席です。' },
  fitAll: {
    en: 'All 6 seats are free at {time} on this day, so a party of six would have the room.',
    ko: '이날 {time} 회차는 6석이 모두 비어 있어 여섯 명이 방을 전부 쓸 수 있습니다.',
    ja: 'この日の{time}の回は6席すべて空いており、6名での貸し切りが可能です。',
  },
  fitNone: {
    en: 'Choose a sitting to see how many seats are free.',
    ko: '회차를 선택하면 남은 좌석 수가 표시됩니다.',
    ja: '回を選ぶと残りの席数が表示されます。',
  },
  name: { en: 'Name', ko: '이름', ja: 'お名前' },
  nameError: { en: 'Write the name the seats are held under.', ko: '좌석을 잡아 둘 예약자 이름을 입력하세요.', ja: '座席の予約者のお名前を入力してください。' },
  mobile: { en: 'Mobile', ko: '휴대폰 번호', ja: '携帯番号' },
  mobileHint: {
    en: 'We send one text on the morning of your visit.',
    ko: '방문 당일 아침에 문자 한 통을 보내 드립니다.',
    ja: 'ご来店当日の朝にSMSを1通お送りします。',
  },
  mobileError: {
    en: 'Write a mobile number such as 010-2345-6789.',
    ko: '010-2345-6789 형식의 휴대폰 번호를 입력하세요.',
    ja: '010-2345-6789 のような携帯番号を入力してください。',
  },
  summary: { en: '{date}, {start} to {end}', ko: '{date}, {start}~{end}', ja: '{date}、{start}～{end}' },
  summaryOpen: { en: '{date}, no sitting chosen yet', ko: '{date}, 회차 미선택', ja: '{date}、回は未選択' },
  summaryParty: { en: '{guests}, tea chosen at the table', ko: '{guests}, 차는 자리에서 고릅니다', ja: '{guests}、お茶は席でお選びいただけます' },
  submitOne: { en: 'Reserve 1 seat', ko: '1석 예약하기', ja: '1席を予約する' },
  submitMany: { en: 'Reserve {n} seats', ko: '{n}석 예약하기', ja: '{n}席を予約する' },
  terms: {
    en: 'Nothing is paid in advance. We keep your seats until {hold}. To cancel, call {phone} by 20:00 the evening before.',
    ko: '선결제는 없습니다. {hold}까지 좌석을 잡아 둡니다. 취소하시려면 전날 20:00까지 {phone}로 전화해 주세요.',
    ja: '事前決済はありません。{hold}まで座席を確保します。キャンセルは前日の20:00までに{phone}へお電話ください。',
  },
  termsOpen: {
    en: 'Nothing is paid in advance. We keep your seats for 15 minutes after the sitting starts. To cancel, call {phone} by 20:00 the evening before.',
    ko: '선결제는 없습니다. 회차가 시작된 뒤 15분 동안 좌석을 잡아 둡니다. 취소하시려면 전날 20:00까지 {phone}로 전화해 주세요.',
    ja: '事前決済はありません。回の開始後15分間、座席を確保します。キャンセルは前日の20:00までに{phone}へお電話ください。',
  },
} satisfies Record<string, Tri>;

const DAY_STATE: Record<DayState, Tri> = {
  past: { en: 'past', ko: '지난 날', ja: '過去' },
  closed: { en: 'closed', ko: '휴무', ja: '休業日' },
  later: { en: 'not open for booking yet', ko: '예약 접수 전', ja: '予約受付前' },
};

const DONE = {
  title: { en: 'Your seats are reserved, {name}.', ko: '{name}님, 좌석 예약이 완료되었습니다.', ja: '{name}様、ご予約が完了しました。' },
  sittingValue: { en: '{start} to {end}', ko: '{start}~{end}', ja: '{start}～{end}' },
  note: {
    en: 'We keep your seats until {hold}. Nothing is paid in advance. To cancel, call {phone} by 20:00 the evening before.',
    ko: '{hold}까지 좌석을 잡아 둡니다. 선결제는 없습니다. 취소하시려면 전날 20:00까지 {phone}로 전화해 주세요.',
    ja: '{hold}まで座席を確保します。事前決済はありません。キャンセルは前日の20:00までに{phone}へお電話ください。',
  },
  change: { en: 'Change the booking', ko: '예약 변경', ja: '予約を変更する' },
} satisfies Record<string, Tri>;

// Bookings already confirmed stay listed above a new form, so a second booking never
// replaces the first.
const HELD: Tri = { en: 'Already reserved', ko: '이미 예약된 내역', ja: '予約済みの内容' };

const FIND = {
  title: { en: 'Finding the door', ko: '찾아오시는 길', ja: '入口への行き方' },
  address: {
    en: 'Bukchon-ro 11-gil 24-3, Jongno-gu, Seoul. Six minutes on foot from Anguk station.',
    ko: '서울 종로구 북촌로11길 24-3. 안국역에서 도보 6분.',
    ja: 'ソウル市 鍾路区 北村路11-gil 24-3。安国駅から徒歩6分。',
  },
  walk: { en: 'Walk from Anguk station', ko: '안국역에서 걷기', ja: '安国駅から歩く' },
  minutes: { en: '{n} min', ko: '{n}분', ja: '{n}分' },
  steps: [
    {
      at: 0,
      text: {
        en: 'Take subway line 3 to Anguk station and leave by exit 2.',
        ko: '지하철 3호선 안국역에서 2번 출구로 나갑니다.',
        ja: '地下鉄3号線で安国駅へ行き、2番出口から出ます。',
      },
    },
    {
      at: 1,
      text: {
        en: 'Walk straight on up Bukchon-ro, with the road on your left.',
        ko: '북촌로를 따라 곧장 올라갑니다. 길은 왼쪽에 둡니다.',
        ja: '北村路に沿ってまっすぐ上ります。道は左手に見えます。',
      },
    },
    {
      at: 4,
      text: {
        en: 'Turn right into the alley just after the hanji paper shop. It is too narrow for cars.',
        ko: '한지 가게를 지나자마자 오른쪽 골목으로 들어갑니다. 차가 다니기 어려울 만큼 좁습니다.',
        ja: '韓紙の店を過ぎたところで右の路地に入ります。車は通れないほど狭い道です。',
      },
    },
    {
      at: 5,
      text: {
        en: 'Climb the stone steps. At the top the alley bends left.',
        ko: '돌계단을 올라갑니다. 계단 위에서 골목이 왼쪽으로 꺾입니다.',
        ja: '石段を上ります。上り切ると路地は左に曲がります。',
      },
    },
    {
      at: 6,
      text: {
        en: 'Dasil is the fourth house on the left, behind a low wooden door with an iron ring. There is no sign, so ring the bell once.',
        ko: 'Dasil은 왼쪽에서 네 번째 집입니다. 쇠고리가 달린 낮은 나무문이 있으며 간판은 없으니 벨을 한 번 눌러 주세요.',
        ja: 'Dasilは左側の4軒目です。鉄の輪がついた低い木の扉の奥にあります。看板はないので、呼び鈴を一度押してください。',
      },
    },
  ],
};

const HOURS = {
  title: { en: 'Opening days', ko: '영업일', ja: '営業日' },
  open: { en: '{day}, open', ko: '{day}, 영업', ja: '{day}、営業' },
  closed: { en: '{day}, closed', ko: '{day}, 휴무', ja: '{day}、休業' },
  body: {
    en: 'Open Wednesday to Sunday with sittings at 11:00, 13:30, 16:00 and 18:30. Closed on Monday and Tuesday, and for the three days of Seollal and of Chuseok.',
    ko: '수요일부터 일요일까지 11:00, 13:30, 16:00, 18:30에 회차를 엽니다. 월요일과 화요일은 쉬며, 설날과 추석 연휴 각 3일간도 쉽니다.',
    ja: '水曜日から日曜日まで、11:00、13:30、16:00、18:30の回で営業します。月曜日と火曜日は休業し、ソルラル（旧正月）と秋夕（チュソク）の連休中の3日間も休業します。',
  },
  holidays: {
    en: 'In 2027 the room is closed from 6 to 8 February for Seollal and from 14 to 16 September for Chuseok.',
    ko: '2027년에는 설날 연휴인 2월 6일부터 8일까지, 추석 연휴인 9월 14일부터 16일까지 쉽니다.',
    ja: '2027年は、ソルラルにあたる2月6日～8日、秋夕にあたる9月14日～16日は休業します。',
  },
} satisfies Record<string, Tri>;

const FOOT = {
  address: {
    en: 'Dasil, Bukchon-ro 11-gil 24-3, Jongno-gu, Seoul 03060',
    ko: 'Dasil, 서울 종로구 북촌로11길 24-3, 03060',
    ja: 'Dasil、ソウル市 鍾路区 北村路11-gil 24-3（03060）',
  },
  phone: {
    en: '{phone}, answered from 10:00 to 11:00 and between sittings',
    ko: '{phone}, 10:00~11:00 및 회차 사이에 받습니다',
    ja: '{phone}、10:00～11:00と各回の合間に電話に出ます',
  },
} satisfies Record<string, Tri>;

const PROMPT_EN = `Design one real page in Zen Minimalism: a white page in one monospace, where empty space, one ruled line and one short bar do all the work.

Pick a believable subject whose day is made of a few fixed times and a few plain facts, such as a small tea room, a bathhouse, a reading room or a one-chair barber, and write its real content. The page must read as that subject's page, never as a page about its own style. Here it is Dasil, a tea room with six seats in Bukchon, Seoul, pouring four 90-minute sittings a day.

TOKENS:
--bg: #ffffff
--ink: #1a1a18
--grey: #3a3a36 (running text)
--muted: #6b6b66 (labels and notes)
--off: #8a8a85 (full sittings, closed days, disabled cells)
--line: rgba(26,26,24,0.28) (rules between rows)
--edge: rgba(26,26,24,0.62) (the edges of controls)
No other colours: no tints, no shadows, no gradients other than the drawn lines below.

THE BAR:
- One horizontal line for the day, 11:00 to 21:00, in four equal columns of 150 minutes. Each sitting is a short tick and a 3px bar over 60% of its column: the 90 minutes of the sitting.
- The bar means "seats exist at this time". It comes back as the chosen sitting in the form, on the open days of the date strip and on the open days of the week.
- A full sitting keeps its tick and bar in --off.

TYPOGRAPHY:
One family, Sometype Mono, weights 400 to 600. No second face and no italics.
Sitting times: 400, clamp(1.375rem, 4.4vw, 3.5rem) (clamp(2rem, 11vw, 2.75rem) on phones, where the day line folds), letter-spacing -0.06em, tabular figures. They are the largest type on the page.
H1, the name: 600, 1.125rem, small and high.
H2: 500, clamp(1.5rem, 2.4vw, 1.875rem), line-height 1.25, letter-spacing -0.03em.
Tea names: 500, 1.125rem. Body: 400, 1rem, line-height 1.75. Nothing under 1rem.

LAYOUT:
- Hero: the name and one sentence at the top, a measured empty field, then today's date and the day line across the full width.
- Every section below starts at 25% of the width, where the second sitting starts, in a column of at most 44rem: the teas, the reservation, the walk from the station, the opening days and a two-line footer.
- Sections stand about 150px apart. Below 900px the column moves to the left edge; below 600px the day line folds into two rows of two sittings.

COMPONENTS:
- Day line: each sitting with seats is a link that fills the form with that sitting and moves to it. A full sitting is plain text.
- Tea list: the name, a dotted leader drawn after its last word, and the price on one baseline; under it the origin and harvest dates, then the steeping note.
- Reservation: ruled rows with the label in an 8.5rem column. Date: the chosen date, Earlier week and Later week as underlined words, and a seven-day strip where open days carry the bar, closed and past days are --off and the chosen day is filled ink. Sitting: the day line again, as a radio group. Guests: six square cells for six seats; cells above the seats left are disabled. Changing the day keeps the guest's sitting and party: a sitting that is full on the new day shows as unavailable and the party is capped at the seats left, and both come back on a day with room. Name and mobile number on a 1px line. A summary of date, time and party beside one filled square button whose label names the seats.
- Errors sit under their field with role="alert". A valid booking replaces the form with a confirmation that takes focus and shows a focus ring, and the seats it holds leave the day line. A day-line link used after that opens a new form and keeps the confirmed booking listed above it.
- The walk: the minutes from the station beside each step, on ruled rows. Opening days: a seven-day strip with the bar on open days.

MOTION:
- Only a smooth scroll to the form, removed under prefers-reduced-motion.

FORBIDDEN:
- Cards, pills, rounded corners, shadows, a second colour
- A small label above a heading, all-caps tracked labels
- Light grey type under 1rem, sections about empty space, quotes about emptiness
- Enso circles, brush strokes, stones, bamboo, kanji as decoration
- Icons, illustrations, photographs, emoji
- Numbers on anything that is not a real sequence

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML and CSS: an ordered list for the day, radio groups for the date, sitting and guests, a labelled form
3) A working day line, date strip, sitting and guest choice, summary, validation and confirmation
4) Responsive layout down to 320px with no horizontal scroll
5) Visible focus on every control and reduced-motion support`;

const PROMPT_KO = `Zen Minimalism 스타일로 실제 페이지 하나를 디자인한다. 하나의 고정폭 서체로 된 흰 페이지에서 빈 여백, 한 줄의 구분선, 짧은 막대 하나가 모든 일을 한다.

실제에 가까운 주제를 고르고, 그 주제의 실제 내용을 쓴다. 하루가 몇 개의 고정된 시간과 몇 가지 평범한 사실로 이루어진 곳이어야 한다. 예를 들어 작은 다실, 대중목욕탕, 열람실, 의자가 한 개뿐인 이발소가 있다. 페이지는 그 주제의 페이지로 읽혀야 하며, 스타일 자체에 관한 페이지로 읽혀서는 안 된다. 여기서는 서울 북촌의 좌석 여섯 개짜리 다실 Dasil이며, 하루 90분 회차를 네 번 운영한다.

TOKENS:
--bg: #ffffff
--ink: #1a1a18
--grey: #3a3a36 (본문 텍스트)
--muted: #6b6b66 (라벨과 메모)
--off: #8a8a85 (마감된 회차, 휴무일, 비활성 칸)
--line: rgba(26,26,24,0.28) (행 사이 구분선)
--edge: rgba(26,26,24,0.62) (컨트롤의 테두리)
다른 색은 쓰지 않는다. 틴트, 그림자, 그라데이션을 쓰지 않으며, 아래에서 그리는 선만 예외다.

THE BAR:
- 하루를 나타내는 가로선 하나. 11:00부터 21:00까지이며, 150분씩 같은 너비의 열 네 개로 나눈다. 각 회차는 짧은 눈금과, 그 열의 60%에 걸친 3px 막대 하나다. 막대는 회차의 90분을 뜻한다.
- 막대는 "이 시간에 좌석이 있다"는 뜻이다. 막대는 양식에서 선택된 회차로 다시 나타나며, 날짜 띠의 영업일과 주간의 영업일에도 나타난다.
- 마감된 회차는 눈금과 막대를 --off 색으로 둔다.

TYPOGRAPHY:
서체는 Sometype Mono 하나만 쓰고, 굵기는 400~600을 쓴다. 두 번째 서체와 기울임꼴은 쓰지 않는다.
회차 시간: 굵기 400, clamp(1.375rem, 4.4vw, 3.5rem), 휴대폰에서는 clamp(2rem, 11vw, 2.75rem)(하루 줄이 접히는 화면), 자간 -0.06em, 표 숫자(tabular figures). 페이지에서 가장 큰 글자다.
H1, 이름: 굵기 600, 1.125rem. 작게, 위쪽에 둔다.
H2: 굵기 500, clamp(1.5rem, 2.4vw, 1.875rem), 행간 1.25, 자간 -0.03em.
차 이름: 굵기 500, 1.125rem. 본문: 굵기 400, 1rem, 행간 1.75. 1rem보다 작은 글자는 쓰지 않는다.

LAYOUT:
- 히어로: 맨 위에 이름과 한 문장, 그 아래 정해진 여백, 그다음 전체 너비에 걸쳐 오늘 날짜와 하루 줄을 둔다.
- 이하의 모든 섹션은 너비의 25% 지점, 즉 두 번째 회차가 시작하는 위치에서 시작한다. 최대 44rem 너비의 단에 놓는다. 순서는 차, 예약, 역에서 가는 길, 영업일, 두 줄짜리 바닥글이다.
- 섹션 사이 간격은 약 150px. 900px 미만에서는 단을 왼쪽 가장자리로 옮기고, 600px 미만에서는 하루 줄을 회차 두 개씩 두 줄로 접는다.

COMPONENTS:
- 하루 줄: 좌석이 남은 회차는 링크이며, 누르면 양식에 그 회차가 채워지고 그 위치로 이동한다. 마감된 회차는 일반 텍스트다.
- 차 목록: 이름, 마지막 단어 뒤에 그려지는 점선 리더, 같은 기준선에 놓인 가격. 그 아래에 산지와 채엽일, 그다음 우림 메모를 둔다.
- 예약: 라벨은 8.5rem 너비의 열에 두고, 행마다 구분선을 긋는다. 날짜: 선택한 날짜, 이전 주와 다음 주는 밑줄 친 단어로 표시하고, 7일짜리 띠를 둔다. 영업일에는 막대를 표시하고, 휴무일과 지난 날은 --off로 표시하며, 선택한 날은 잉크색으로 채운다. 회차: 하루 줄을 다시 쓰되 라디오 그룹으로 만든다. 인원: 좌석 여섯 개에 맞춰 정사각형 칸 여섯 개를 둔다. 남은 좌석보다 큰 칸은 비활성화한다. 날짜를 바꿔도 손님이 고른 회차와 인원은 유지한다. 새 날짜에서 마감된 회차는 선택할 수 없는 것으로 표시하고, 인원은 남은 좌석 수까지로 제한한다. 좌석이 남는 날로 돌아가면 둘 다 다시 나타난다. 이름과 휴대폰 번호는 1px 선 위에 쓴다. 날짜, 시간, 인원 요약을 두고, 그 옆에 버튼 라벨에 좌석 수가 들어가는 채워진 정사각형 버튼 하나를 둔다.
- 오류는 해당 입력란 아래에 role="alert"와 함께 표시한다. 유효한 예약이 들어오면 포커스를 받고 포커스 링이 보이는 확인 화면으로 양식을 바꾸고, 그 예약이 잡은 좌석은 하루 줄에서 빠진다. 그 뒤 하루 줄의 링크를 누르면 새 양식이 열리고, 확정된 예약은 그 위에 계속 표시된다.
- 길 안내: 각 단계 옆에 역에서 걸리는 분을 구분선이 있는 행에 표시한다. 영업일: 7일짜리 띠에서 영업일에 막대를 표시한다.

MOTION:
- 양식으로 가는 부드러운 스크롤 하나만 둔다. prefers-reduced-motion에서는 이것도 제거한다.

FORBIDDEN:
- 카드, 알약 모양 버튼, 둥근 모서리, 그림자, 두 번째 색
- 제목 위의 작은 라벨, 대문자에 자간을 넓힌 라벨
- 1rem 미만의 연한 회색 글자, 빈 여백에 관한 섹션, 공허함에 관한 인용문
- 장식으로 쓰는 엔소 원, 붓 자국, 돌, 대나무, 한자
- 아이콘, 일러스트, 사진, 이모지
- 실제 순서가 아닌 것에 붙이는 번호

OUTPUT:
1) 위 토큰을 담은 CSS 사용자 정의 속성
2) 시맨틱 HTML과 CSS: 하루는 순서 있는 목록, 날짜·회차·인원은 라디오 그룹, 라벨이 붙은 양식
3) 실제로 동작하는 하루 줄, 날짜 띠, 회차와 인원 선택, 요약, 검증, 확인 화면
4) 320px까지 가로 스크롤 없이 대응하는 반응형 레이아웃
5) 모든 컨트롤에 보이는 포커스 표시와 reduced-motion 대응`;

const PROMPT_JA = `Zen Minimalismで実在するページを1つデザインする。一つの等幅フォントで組んだ白いページで、余白、一本の罫線、短いバー一本がすべての役割を担う。

実在感のある題材を1つ選び、その実際の内容を書く。一日がいくつかの決まった時刻と、いくつかの平凡な事実でできている場所にする。例えば小さな茶室、銭湯、閲覧室、椅子が1脚だけの理髪店などである。ページはその題材のページとして読まれなければならず、スタイルそのものについてのページになってはならない。ここではソウル北村にある6席の茶室、Dasilで、1日90分の回を4回営業する。

TOKENS:
--bg: #ffffff
--ink: #1a1a18
--grey: #3a3a36 (本文テキスト)
--muted: #6b6b66 (ラベルとメモ)
--off: #8a8a85 (満席の回、休業日、無効なセル)
--line: rgba(26,26,24,0.28) (行の間の罫線)
--edge: rgba(26,26,24,0.62) (コントロールの縁)
その他の色は使わない。色味、影、グラデーションは使わず、下で描く線だけを例外とする。

THE BAR:
- 一日を表す横線を1本引く。11:00から21:00までを、150分ずつの等しい4列に分ける。各回は短い目盛りと、列の60%にかかる3pxのバーで示す。バーは回の90分を表す。
- バーは「この時間に席がある」ことを示す。フォームで選んだ回として再び現れ、日付ストリップの営業日と週の営業日にも表示される。
- 満席の回は、目盛りとバーを --off で表示する。

TYPOGRAPHY:
書体は Sometype Mono の1種類のみ。ウェイトは400～600。2つ目の書体と斜体は使わない。
回の時刻：ウェイト400、clamp(1.375rem, 4.4vw, 3.5rem)、スマートフォンでは clamp(2rem, 11vw, 2.75rem)（一日の線が折り返す画面）、letter-spacing -0.06em、等幅数字（tabular figures）。ページで最も大きい文字とする。
H1、名前：ウェイト600、1.125rem。小さく、上部に置く。
H2：ウェイト500、clamp(1.5rem, 2.4vw, 1.875rem)、行の高さ1.25、letter-spacing -0.03em。
お茶の名前：ウェイト500、1.125rem。本文：ウェイト400、1rem、行の高さ1.75。1rem未満の文字は使わない。

LAYOUT:
- ヒーロー：上部に名前と一文、その下に決めた余白、続いて全幅に今日の日付と一日の線を置く。
- 以下の各セクションは、幅の25%の位置、つまり2番目の回が始まる位置から始め、最大44remの段に収める。順序は、お茶、予約、駅からの道順、営業日、二行のフッター。
- セクション同士の間隔は約150px。900px未満では段を左端に寄せ、600px未満では一日の線を2回ずつ2行に折り返す。

COMPONENTS:
- 一日の線：席が残っている各回はリンクで、押すとフォームにその回が入力され、そこへ移動する。満席の回は通常のテキストにする。
- お茶の一覧：名前、最後の語の後に描く点線のリーダー、同じベースライン上の価格。その下に産地と摘採日、続いて抽出のメモを置く。
- 予約：ラベルは8.5remの列に置き、各行を罫線で区切る。日付：選んだ日付を表示し、「前の週」「次の週」は下線付きの語とする。7日分のストリップでは、営業日にバーを付け、休業日と過去の日は --off、選んだ日は墨色で塗りつぶす。回：一日の線をラジオグループとして再び置く。人数：6席分の正方形のセル6つ。残席より上のセルは無効にする。日付を変えても、お客様が選んだ回と人数は保持する。新しい日付で満席の回は選択不可として表示し、人数は残席数までに制限する。空席のある日に戻すと、どちらも再び表示する。名前と携帯番号は1pxの線の上に入力する。日付、時間、人数の要約を、ラベルに席数が入った塗りつぶしの正方形ボタンの横に置く。
- エラーは該当の入力欄の下に role="alert" を付けて表示する。有効な予約が送られたら、フォームを、フォーカスを受けてフォーカスリングを表示する確認画面に置き換え、その予約が確保した席は一日の線から消す。その後に一日の線のリンクを使うと新しいフォームが開き、確定した予約はその上に表示されたままになる。
- 道順：各ステップの横に駅からの分数を、罫線付きの行で示す。営業日：7日分のストリップで、営業日にバーを付ける。

MOTION:
- フォームへのなめらかなスクロールだけを使う。prefers-reduced-motion の場合は、これも取り除く。

FORBIDDEN:
- カード、ピル型ボタン、角丸、影、2色目
- 見出しの上の小さなラベル、字間を広げた大文字のラベル
- 1rem未満の薄い灰色の文字、余白について語るセクション、空虚さについての引用
- 装飾としての円相、筆のストローク、石、竹、漢字
- アイコン、イラスト、写真、絵文字
- 実際の順序ではないものに付ける番号

OUTPUT:
1) 上のトークンのためのCSSカスタムプロパティ
2) セマンティックなHTMLとCSS：一日は順序付きリスト、日付・回・人数はラジオグループ、ラベル付きのフォーム
3) 実際に動作する一日の線、日付ストリップ、回と人数の選択、要約、検証、確認画面
4) 320pxまで横スクロールなしで対応するレスポンシブレイアウト
5) すべてのコントロールに見えるフォーカス表示と、reduced-motion への対応`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_KO, ja: PROMPT_JA };

interface Booking {
  day: number;
  sitting: number;
  guests: number;
  name: string;
  mobile: string;
}

const NO_ERRORS = { sitting: false, name: false, mobile: false };

export function PortedZenMinimalismPage({ lang }: PortedStylePageProps) {
  const [day, setDay] = useState(FIRST_FORM_DAY);
  const [week, setWeek] = useState(weekOf(FIRST_FORM_DAY));
  // What the guest chose. Changing the day keeps both; what the day can seat is derived below.
  const [sitting, setSitting] = useState<number | null>(2);
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [errors, setErrors] = useState(NO_ERRORS);
  // Confirmed bookings, oldest first. The last one is shown as the confirmation until a
  // new form is opened; the others are listed above the form.
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [confirming, setConfirming] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const heldRef = useRef<HTMLDivElement>(null);
  const sittingRefs = useRef<Array<HTMLInputElement | null>>([]);
  const nameRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  const t = (text: Tri) => text[lang];

  // Confirmed bookings hold their seats, so the day line and the form show them as taken.
  const free = (onDay: number, at: number) =>
    bookings.reduce(
      (left, item) => (item.day === onDay && item.sitting === at ? left - item.guests : left),
      freeInBook(onDay, at),
    );

  const booking = confirming ? bookings.at(-1) ?? null : null;
  const held = booking ? bookings.slice(0, -1) : bookings;

  const longDate = (value: number) => {
    const date = new Date(value);
    return fill(t(DATES.long), { weekday: t(WEEKDAYS[weekday(value)]), day: date.getUTCDate(), month: t(MONTHS[date.getUTCMonth()]) });
  };

  const weekRange = (monday: number) => {
    const from = new Date(monday);
    const to = new Date(monday + 6 * DAY_MS);
    return from.getUTCMonth() === to.getUTCMonth()
      ? fill(t(DATES.sameMonth), { from: from.getUTCDate(), to: to.getUTCDate(), month: t(MONTHS[to.getUTCMonth()]) })
      : fill(t(DATES.twoMonths), {
        from: from.getUTCDate(),
        fromMonth: t(MONTHS[from.getUTCMonth()]),
        to: to.getUTCDate(),
        toMonth: t(MONTHS[to.getUTCMonth()]),
      });
  };

  const seatsText = (left: number) =>
    left === 0 ? t(SEATS_TEXT.full) : fill(t(left === 1 ? SEATS_TEXT.one : SEATS_TEXT.many), { n: left });

  const guestsText = (n: number) => fill(t(n === 1 ? SEATS_TEXT.guestOne : SEATS_TEXT.guestMany), { n });

  // The guest's choices are kept when the day changes. What this day can seat is
  // derived from them: a sitting that is full on this day counts as not chosen, and
  // the party is capped at the seats left. Going back to a day with room restores both.
  const chosenAt = sitting !== null && free(day, sitting) > 0 ? sitting : null;
  const room = chosenAt === null ? SEATS : free(day, chosenAt);
  const party = Math.min(guests, room);
  const chosen = chosenAt === null ? null : SITTINGS[chosenAt];
  const fitText = chosen === null
    ? t(RESERVE.fitNone)
    : fill(t(room === SEATS ? RESERVE.fitAll : room === 1 ? RESERVE.fitOne : RESERVE.fitMany), { n: room, time: chosen.start });

  const chooseSitting = (next: number) => {
    setSitting(next);
    setErrors((value) => ({ ...value, sitting: false }));
  };

  const scrollBehavior = (): ScrollBehavior =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

  // Brings the form into view with any bookings already held above it, and puts focus
  // on a sitting.
  const showForm = (focusAt: number | null) => {
    (heldRef.current ?? formRef.current)?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    if (focusAt !== null) sittingRefs.current[focusAt]?.focus({ preventScroll: true });
  };

  // A sitting on the day line fills the form with today and that sitting, then moves
  // to it. A booking already confirmed is kept and listed above the new form.
  const takeSitting = (event: MouseEvent<HTMLAnchorElement>, next: number) => {
    event.preventDefault();
    flushSync(() => {
      setConfirming(false);
      setDay(TODAY);
      setWeek(weekOf(TODAY));
      setErrors(NO_ERRORS);
      chooseSitting(next);
    });
    showForm(next);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = { sitting: chosenAt === null, name: name.trim() === '', mobile: !validMobile(mobile) };
    if (chosenAt !== null && !next.name && !next.mobile) {
      // The form leaves the page. Focus goes to the confirmation that takes its place.
      flushSync(() => {
        setErrors(NO_ERRORS);
        setBookings([...bookings, { day, sitting: chosenAt, guests: party, name: name.trim(), mobile: mobile.trim() }]);
        setConfirming(true);
      });
      doneRef.current?.focus();
      return;
    }
    // The error is rendered first, so the whole row can be brought into view with it.
    flushSync(() => setErrors(next));
    const field = next.sitting
      ? sittingRefs.current.find((input) => input && !input.disabled) ?? null
      : next.name
        ? nameRef.current
        : mobileRef.current;
    field?.focus({ preventScroll: true });
    field?.closest('.ds-row')?.scrollIntoView({ behavior: scrollBehavior(), block: 'nearest' });
  };

  // The confirmation leaves the page and its seats go back to the book, with the form
  // still filled in. Focus goes back to the sitting it held.
  const changeBooking = () => {
    flushSync(() => {
      setBookings(bookings.slice(0, -1));
      setConfirming(false);
    });
    showForm(sitting);
  };

  const monday = FIRST_MONDAY + week * WEEK_MS;
  const weekDays = Array.from({ length: 7 }, (_, index) => monday + index * DAY_MS);

  return (
    <FusionShell
      fusionId="zen-minimalism"
      lang={lang}
      tone="light"
      accent="#1a1a18"
      prev={{ href: '/pages/aurora-gradient.html', label: 'Aurora Gradient' }}
      next={{ href: '/pages/mono-type.html', label: 'Mono Type' }}
      prompts={PROMPTS}
    >
      <div className="ds">
        <header className="ds-hero">
          <div className="ds-mast">
            <h1>{NAME}</h1>
            <p>{t(HERO.line)}</p>
          </div>
          <div className="ds-today">
            <p className="ds-today__date" id="ds-today">{fill(t(HERO.today), { date: longDate(TODAY) })}</p>
            <ol className="ds-day" aria-labelledby="ds-today">
              {SITTINGS.map((item, at) => {
                const left = free(TODAY, at);
                const body = (
                  <>
                    <time dateTime={`2026-11-20T${item.start}`}>{item.start}</time>
                    <i className="ds-seg" aria-hidden="true" />
                    <span className="ds-left">{seatsText(left)}</span>
                  </>
                );
                return (
                  <li key={item.start} className={left === 0 ? 'is-full' : undefined}>
                    {left === 0 ? (
                      <span className="ds-day__item">{body}</span>
                    ) : (
                      <a
                        className="ds-day__item"
                        href="#ds-reserve"
                        aria-label={fill(t(HERO.reserveAt), { time: item.start, left: seatsText(left) })}
                        onClick={(event) => takeSitting(event, at)}
                      >
                        {body}
                      </a>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </header>

        <section className="ds-section ds-section--first ds-col" aria-labelledby="ds-teas">
          <h2 id="ds-teas">{t(TEAS.title)}</h2>
          <p className="ds-note">{t(TEAS.note)}</p>
          <ul className="ds-teas">
            {TEAS.list.map((tea) => (
              <li key={tea.name.en}>
                <p className="ds-tea">
                  <span className="ds-tea__name">{t(tea.name)}</span>
                  <span className="ds-tea__price">{tea.price}</span>
                </p>
                <p className="ds-tea__from">{t(tea.from)}</p>
                <p className="ds-tea__steep">{t(tea.steep)}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="ds-section ds-col" id="ds-reserve" aria-labelledby="ds-reserve-title">
          <h2 id="ds-reserve-title">{t(RESERVE.title)}</h2>
          <p className="ds-note">{t(RESERVE.note)}</p>

          {held.length > 0 ? (
            <div className="ds-held" ref={heldRef}>
              <p id="ds-held-title">{t(HELD)}</p>
              <ul aria-labelledby="ds-held-title">
                {held.map((item, index) => (
                  <li key={index}>
                    <span>
                      {fill(t(RESERVE.summary), {
                        date: longDate(item.day),
                        start: SITTINGS[item.sitting].start,
                        end: SITTINGS[item.sitting].end,
                      })}
                    </span>
                    <span>{guestsText(item.guests)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {booking ? (
            <div className="ds-done" ref={doneRef} tabIndex={-1} role="group" aria-labelledby="ds-done-title">
              <h3 id="ds-done-title">{fill(t(DONE.title), { name: booking.name })}</h3>
              <dl className="ds-done__rows">
                <div>
                  <dt>{t(RESERVE.date)}</dt>
                  <dd>{longDate(booking.day)}</dd>
                </div>
                <div>
                  <dt>{t(RESERVE.sitting)}</dt>
                  <dd>{fill(t(DONE.sittingValue), { start: SITTINGS[booking.sitting].start, end: SITTINGS[booking.sitting].end })}</dd>
                </div>
                <div>
                  <dt>{t(RESERVE.guests)}</dt>
                  <dd>{guestsText(booking.guests)}</dd>
                </div>
                <div>
                  <dt>{t(RESERVE.mobile)}</dt>
                  <dd>{booking.mobile}</dd>
                </div>
              </dl>
              <p className="ds-small">{fill(t(DONE.note), { hold: SITTINGS[booking.sitting].hold, phone: PHONE })}</p>
              <button type="button" className="ds-textbtn ds-done__change" onClick={changeBooking}>{t(DONE.change)}</button>
            </div>
          ) : (
            <form className="ds-book" ref={formRef} noValidate onSubmit={handleSubmit}>
              <div className="ds-row">
                <span className="ds-lab" id="ds-date-label">{t(RESERVE.date)}</span>
                <div className="ds-date">
                  <div className="ds-date__head">
                    <p className="ds-date__value">{longDate(day)}</p>
                    <div className="ds-date__nav">
                      <button
                        type="button"
                        className="ds-textbtn"
                        aria-controls="ds-pick"
                        aria-disabled={week === 0}
                        onClick={() => { if (week > 0) setWeek(week - 1); }}
                      >
                        {t(RESERVE.earlier)}
                      </button>
                      <button
                        type="button"
                        className="ds-textbtn"
                        aria-controls="ds-pick"
                        aria-disabled={week === WEEK_COUNT - 1}
                        onClick={() => { if (week < WEEK_COUNT - 1) setWeek(week + 1); }}
                      >
                        {t(RESERVE.later)}
                      </button>
                    </div>
                  </div>
                  <div className="ds-pick" id="ds-pick" role="radiogroup" aria-labelledby="ds-date-label ds-week">
                    {weekDays.map((value) => {
                      const state = dayState(value);
                      const label = longDate(value);
                      return (
                        <label
                          key={value}
                          className={`ds-pick__day${state ? ' is-off' : ''}${value === day ? ' is-chosen' : ''}`}
                        >
                          <input
                            type="radio"
                            name="ds-day"
                            value={value}
                            checked={value === day}
                            disabled={state !== null}
                            aria-label={state ? `${label}, ${t(DAY_STATE[state])}` : label}
                            onChange={() => setDay(value)}
                          />
                          <span className="ds-pick__wd" aria-hidden="true">{t(WEEKDAYS_SHORT[weekday(value)])}</span>
                          <span className="ds-pick__d" aria-hidden="true">{new Date(value).getUTCDate()}</span>
                        </label>
                      );
                    })}
                  </div>
                  <p className="ds-pick__week" id="ds-week" aria-live="polite">{weekRange(monday)}</p>
                </div>
              </div>

              <div className="ds-row">
                <span className="ds-lab" id="ds-sitting-label">{t(RESERVE.sitting)}</span>
                <div>
                  <div
                    className="ds-opts"
                    role="radiogroup"
                    aria-labelledby="ds-sitting-label"
                    aria-describedby={errors.sitting ? 'ds-sitting-error' : undefined}
                  >
                    {SITTINGS.map((item, at) => {
                      const left = free(day, at);
                      return (
                        <label key={item.start} className={`ds-opt${left === 0 ? ' is-full' : ''}`}>
                          <input
                            ref={(node) => { sittingRefs.current[at] = node; }}
                            type="radio"
                            name="ds-sitting"
                            value={item.start}
                            checked={chosenAt === at}
                            disabled={left === 0}
                            onChange={() => chooseSitting(at)}
                          />
                          <span className="ds-opt__t">{item.start}</span>
                          <i className="ds-opt__s" aria-hidden="true" />
                          <span className="ds-opt__n">{seatsText(left)}</span>
                        </label>
                      );
                    })}
                  </div>
                  {errors.sitting ? <p className="ds-error" id="ds-sitting-error" role="alert">{t(RESERVE.sittingError)}</p> : null}
                </div>
              </div>

              <div className="ds-row">
                <span className="ds-lab" id="ds-guests-label">{t(RESERVE.guests)}</span>
                <div>
                  <div className="ds-count" role="radiogroup" aria-labelledby="ds-guests-label" aria-describedby="ds-fit">
                    {Array.from({ length: SEATS }, (_, index) => index + 1).map((n) => (
                      <label key={n}>
                        <input
                          type="radio"
                          name="ds-guests"
                          value={n}
                          checked={party === n}
                          disabled={n > room}
                          onChange={() => setGuests(n)}
                        />
                        {n}
                      </label>
                    ))}
                  </div>
                  <p className="ds-fit" id="ds-fit" aria-live="polite">{fitText}</p>
                </div>
              </div>

              <div className="ds-row">
                <label className="ds-lab" htmlFor="ds-name">{t(RESERVE.name)}</label>
                <div className="ds-val">
                  <input
                    id="ds-name"
                    ref={nameRef}
                    className="ds-field"
                    type="text"
                    name="name"
                    autoComplete="name"
                    value={name}
                    aria-invalid={errors.name}
                    aria-describedby={errors.name ? 'ds-name-error' : undefined}
                    onChange={(event) => {
                      setName(event.target.value);
                      if (errors.name) setErrors({ ...errors, name: false });
                    }}
                  />
                  {errors.name ? <p className="ds-error" id="ds-name-error" role="alert">{t(RESERVE.nameError)}</p> : null}
                </div>
              </div>

              <div className="ds-row">
                <label className="ds-lab" htmlFor="ds-mobile">{t(RESERVE.mobile)}</label>
                <div className="ds-val">
                  <input
                    id="ds-mobile"
                    ref={mobileRef}
                    className="ds-field"
                    type="tel"
                    name="mobile"
                    autoComplete="tel"
                    inputMode="tel"
                    value={mobile}
                    aria-invalid={errors.mobile}
                    aria-describedby={errors.mobile ? 'ds-mobile-error ds-mobile-hint' : 'ds-mobile-hint'}
                    onChange={(event) => {
                      setMobile(event.target.value);
                      if (errors.mobile) setErrors({ ...errors, mobile: false });
                    }}
                  />
                  {errors.mobile ? <p className="ds-error" id="ds-mobile-error" role="alert">{t(RESERVE.mobileError)}</p> : null}
                  <p className="ds-hint" id="ds-mobile-hint">{t(RESERVE.mobileHint)}</p>
                </div>
              </div>

              <div className="ds-send">
                <p>
                  {chosen
                    ? fill(t(RESERVE.summary), { date: longDate(day), start: chosen.start, end: chosen.end })
                    : fill(t(RESERVE.summaryOpen), { date: longDate(day) })}
                  <span>{fill(t(RESERVE.summaryParty), { guests: guestsText(party) })}</span>
                </p>
                <button className="ds-btn" type="submit">
                  {party === 1 ? t(RESERVE.submitOne) : fill(t(RESERVE.submitMany), { n: party })}
                </button>
              </div>
              <p className="ds-small">
                {chosen ? fill(t(RESERVE.terms), { hold: chosen.hold, phone: PHONE }) : fill(t(RESERVE.termsOpen), { phone: PHONE })}
              </p>
            </form>
          )}
        </section>

        <section className="ds-section ds-col" aria-labelledby="ds-find">
          <h2 id="ds-find">{t(FIND.title)}</h2>
          <p className="ds-note">{t(FIND.address)}</p>
          <ol className="ds-walk" aria-label={t(FIND.walk)}>
            {FIND.steps.map((step) => (
              <li key={step.at}>
                <span className="ds-min">{fill(t(FIND.minutes), { n: step.at })}</span>
                <p>{t(step.text)}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="ds-section ds-section--near ds-col" aria-labelledby="ds-hours">
          <h2 id="ds-hours">{t(HOURS.title)}</h2>
          <ol className="ds-week" aria-labelledby="ds-hours">
            {WEEKDAYS.map((item, index) => {
              const open = index >= 2;
              return (
                <li key={item.en} className={open ? undefined : 'is-off'}>
                  <span aria-hidden="true">{t(WEEKDAYS_SHORT[index])}</span>
                  <span className="ds-vh">{fill(t(open ? HOURS.open : HOURS.closed), { day: t(item) })}</span>
                </li>
              );
            })}
          </ol>
          <p className="ds-note">{t(HOURS.body)}</p>
          <p className="ds-note">{t(HOURS.holidays)}</p>
        </section>

        <footer className="ds-foot ds-col">
          <p>{t(FOOT.address)}</p>
          <p>{fill(t(FOOT.phone), { phone: PHONE })}</p>
        </footer>
      </div>
    </FusionShell>
  );
}
