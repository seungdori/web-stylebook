import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedDuotoneBoldPage.css';

// The page of Night Lap 10K, a winter series of four Friday night races in Rotterdam.
// Printed in two inks, black and one fluorescent lime. Big Shoulders Display, drawn from
// Chicago street signage, sets the race date, the headings and every figure in capitals;
// Golos Text reads the words around them. Components come from a race series: the next
// race night as a street poster over a halftone dot field that swells to solid ink (the
// date knocks out where it crosses it), the four nights as a tour-date list with places
// left as a solid-and-dotted bar, the route as an elevation profile and a checkpoint
// sequence, the entry form with start pens, and the last race's results.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

const SERIES = 'Night Lap';
const CAPACITY = 1500;
const START = '21:00';
const PRICE = { one: 32, three: 84 } as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key]));

// Puts one value into a sentence as a node, so it can be set in its own face.
const place = (text: string, key: string, node: ReactNode): ReactNode[] =>
  text.split(`{${key}}`).flatMap((part, index) => (index === 0 ? [part] : [<span key={index}>{node}</span>, part]));

const count = new Intl.NumberFormat('en-GB');

type RaceId = 1 | 2 | 3 | 4;
type OpenRace = 2 | 3 | 4;

interface Race {
  n: RaceId;
  date: string;
  short: Tri;
  /** The date without the weekday, for the one-night entry option. */
  day: Tri;
  long: Tri;
  /** Places left before anyone enters on this page. */
  left: number;
  closes: Tri;
  note?: Tri;
}

const RACES: Race[] = [
  {
    n: 1,
    date: '2026-11-13',
    short: { en: '13 Nov', ko: '11월 13일', ja: '11月13日' },
    day: { en: '13 November', ko: '11월 13일', ja: '11月13日' },
    long: { en: 'Friday 13 November', ko: '11월 13일 금요일', ja: '11月13日(金)' },
    left: 0,
    closes: { en: 'Tuesday 10 November', ko: '11월 10일 화요일', ja: '11月10日(火)' },
  },
  {
    n: 2,
    date: '2026-12-11',
    short: { en: '11 Dec', ko: '12월 11일', ja: '12月11日' },
    day: { en: '11 December', ko: '12월 11일', ja: '12月11日' },
    long: { en: 'Friday 11 December', ko: '12월 11일 금요일', ja: '12月11日(金)' },
    left: 214,
    closes: { en: 'Tuesday 8 December', ko: '12월 8일 화요일', ja: '12月8日(火)' },
  },
  {
    n: 3,
    date: '2027-01-15',
    short: { en: '15 Jan', ko: '1월 15일', ja: '1月15日' },
    day: { en: '15 January', ko: '1월 15일', ja: '1月15日' },
    long: { en: 'Friday 15 January', ko: '1월 15일 금요일', ja: '1月15日(金)' },
    left: 682,
    closes: { en: 'Tuesday 12 January', ko: '1월 12일 화요일', ja: '1月12日(火)' },
  },
  {
    n: 4,
    date: '2027-02-12',
    short: { en: '12 Feb', ko: '2월 12일', ja: '2月12日' },
    day: { en: '12 February', ko: '2월 12일', ja: '2月12日' },
    long: { en: 'Friday 12 February', ko: '2월 12일 금요일', ja: '2月12日(金)' },
    left: 1049,
    closes: { en: 'Tuesday 9 February', ko: '2월 9일 화요일', ja: '2月9日(火)' },
    note: { en: 'Series final, with prizes for the top three overall.', ko: '시리즈 최종 경기입니다. 종합 상위 3명에게 상을 드립니다.', ja: 'シリーズ最終戦です。総合上位3名に賞品を贈ります。' },
  },
];

const OPEN: OpenRace[] = [2, 3, 4];
const raceOf = (n: RaceId) => RACES[n - 1];
/** The next race night, set as the poster at the top of the page. */
const NEXT = raceOf(2);

const HEAD = {
  nav: { en: 'Night Lap 10K', ko: 'Night Lap 10K', ja: 'Night Lap 10K' },
  nights: { en: 'Race nights', ko: '경기 일정', ja: 'レース日程' },
  route: { en: 'Route', ko: '코스', ja: 'コース' },
  entry: { en: 'Entry', ko: '참가', ja: '参加' },
  results: { en: 'Results', ko: '결과', ja: '結果' },
  enter: { en: 'Enter race {n}', ko: '{n}차 경기 참가', ja: '第{n}レースに参加' },
  enterShort: { en: 'Enter', ko: '참가', ja: '参加' },
} satisfies Record<string, Tri>;

const HERO = {
  title: {
    en: 'Night Lap 10K, race 2: Friday 11 December, starting at 21:00',
    ko: 'Night Lap 10K, 2차 경기: 12월 11일 금요일, 21:00 출발',
    ja: 'Night Lap 10K、第2レース：12月11日(金)、21:00スタート',
  },
  day: { en: 'Friday', ko: '금요일', ja: '金曜日' },
  lede: {
    en: 'Race 2 of the winter series in Rotterdam. One 10 km lap of the city centre after dark, over the Willemsbrug and the Erasmusbrug, starting and finishing on the Coolsingel in front of City Hall.',
    ko: '로테르담 겨울 시리즈 2차 경기입니다. 해가 진 뒤 도심을 한 바퀴 10km 달리며 Willemsbrug와 Erasmusbrug를 건넙니다. 시청 앞 Coolsingel에서 출발해 같은 곳에서 끝납니다.',
    ja: 'ロッテルダム冬季シリーズの第2レースです。日没後に市中心部を1周10km走り、WillemsbrugとErasmusbrugを渡ります。市庁舎前のCoolsingelをスタートし、同じ場所にゴールします。',
  },
  left: { en: 'places left of {capacity}', ko: '정원 {capacity}명 중 남은 자리', ja: '定員{capacity}名のうち残席' },
  enter: { en: 'Enter for €{price}', ko: '€{price}에 참가하기', ja: '€{price}で参加する' },
  closes: {
    en: 'Entry closes on {day} at midnight, or earlier if the race fills.',
    ko: '참가 접수는 {day} 자정에 마감되며, 정원이 먼저 차면 그보다 일찍 마감됩니다.',
    ja: '参加受付は{day}の深夜0時に締め切ります。定員に達した場合は、それより早く締め切ります。',
  },
} satisfies Record<string, Tri>;

const NIGHTS = {
  title: { en: 'Four Friday nights', ko: '금요일 밤 경기 4회', ja: '金曜の夜 全4回' },
  note: {
    en: 'Every race starts at 21:00 and runs the same lap. Your best three times count toward the series ranking, which is settled on 12 February.',
    ko: '모든 경기는 21:00에 출발하며 같은 코스를 달립니다. 최고 기록 3회가 시리즈 순위에 반영되며, 순위는 2월 12일에 확정됩니다.',
    ja: '全レースは21:00にスタートし、同じコースを走ります。ベスト3回のタイムがシリーズ順位に反映され、順位は2月12日に確定します。',
  },
  race: { en: 'Race {n}', ko: '{n}차 경기', ja: '第{n}レース' },
  done: { en: 'Finished. 1,431 runners, won in 31:08.', ko: '종료. 참가자 1,431명, 우승 기록 31:08.', ja: '終了。1,431名が完走、優勝タイムは31:08。' },
  seeResults: { en: 'See results', ko: '결과 보기', ja: '結果を見る' },
  ofRace: { en: ' of race 1', ko: ' (1차 경기)', ja: '（第1レース）' },
  left: { en: '{left} of {capacity} places left', ko: '{capacity}명 중 {left}명 남음', ja: '定員{capacity}名のうち残り{left}名' },
  choose: { en: 'Choose', ko: '선택', ja: '選択' },
  chosen: { en: 'Chosen', ko: '선택됨', ja: '選択中' },
  which: { en: ' race {n}, {date}', ko: ' {n}차 경기, {date}', ja: ' 第{n}レース、{date}' },
  news: {
    en: 'Race {n} on {date} is chosen. The entry form is now for race {n}.',
    ko: '{n}차 경기, {date}를 선택했습니다. 참가 양식이 이제 {n}차 경기로 설정됩니다.',
    ja: '第{n}レース（{date}）を選択しました。参加フォームは第{n}レースに設定されます。',
  },
} satisfies Record<string, Tri>;

const ROUTE = {
  title: { en: 'The route', ko: '코스', ja: 'コース' },
  note: {
    en: 'One clockwise lap on closed roads. It is flat apart from two bridge climbs. The course closes 90 minutes after the start, at 22:30.',
    ko: '통제된 도로를 시계 방향으로 한 바퀴 달립니다. 다리 오르막 두 곳을 빼면 평지입니다. 코스는 출발 90분 뒤인 22:30에 닫힙니다.',
    ja: '通行止めの道路を時計回りに1周します。二つの橋の上り坂を除けば平坦です。コースは出発から90分後の22:30に閉鎖されます。',
  },
  checkpoint: { en: 'Checkpoint', ko: '체크포인트', ja: 'チェックポイント' },
  water: { en: 'Water', ko: '급수', ja: '給水' },
  list: { en: 'Checkpoints from start to finish', ko: '출발부터 결승까지 체크포인트', ja: 'スタートからゴールまでのチェックポイント' },
  waterHere: { en: ', water', ko: ', 급수', ja: '、給水' },
} satisfies Record<string, Tri>;

interface Checkpoint {
  km: string;
  name: Tri;
  note: Tri;
  water?: boolean;
}

const CHECKPOINTS: Checkpoint[] = [
  {
    km: '0.0',
    name: { en: 'Start, Coolsingel', ko: '출발, Coolsingel', ja: 'スタート、Coolsingel' },
    note: { en: 'In front of City Hall. Start pens open at 20:30.', ko: '시청 앞. 출발 구역은 20:30에 열립니다.', ja: '市庁舎前。スタート枠は20:30に開きます。' },
  },
  {
    km: '1.3',
    name: { en: 'Markthal', ko: 'Markthal', ja: 'Markthal' },
    note: { en: 'Along the Binnenrotte and past the market hall.', ko: 'Binnenrotte를 따라 마켓홀 옆을 지납니다.', ja: 'Binnenrotteに沿って、マーケットホールの脇を通ります。' },
  },
  {
    km: '2.2',
    name: { en: 'Oude Haven', ko: 'Oude Haven', ja: 'Oude Haven' },
    note: { en: 'Water at the foot of the Witte Huis.', ko: 'Witte Huis 아래에서 급수합니다.', ja: 'Witte Huisのふもとで給水します。' },
    water: true,
  },
  {
    km: '3.1',
    name: { en: 'Willemsbrug', ko: 'Willemsbrug', ja: 'Willemsbrug' },
    note: { en: 'First climb, about 12 m up over the Maas.', ko: '첫 번째 오르막입니다. Maas 위로 약 12m 올라갑니다.', ja: '最初の上り坂です。マース川の上を約12m上ります。' },
  },
  {
    km: '3.9',
    name: { en: 'Noordereiland', ko: 'Noordereiland', ja: 'Noordereiland' },
    note: { en: 'Along the Maaskade, the quietest stretch.', ko: 'Maaskade를 따라가는 구간으로, 가장 조용합니다.', ja: 'Maaskadeに沿う区間で、最も静かな区間です。' },
  },
  {
    km: '5.0',
    name: { en: 'Wilhelminapier', ko: 'Wilhelminapier', ja: 'Wilhelminapier' },
    note: {
      en: 'Half-way timing mat, water and toilets by Hotel New York.',
      ko: '중간 계시 매트, 급수대와 화장실이 Hotel New York 옆에 있습니다.',
      ja: '中間計時マット。給水とトイレはHotel New York脇にあります。',
    },
    water: true,
  },
  {
    km: '6.0',
    name: { en: 'Erasmusbrug', ko: 'Erasmusbrug', ja: 'Erasmusbrug' },
    note: { en: 'Second climb and the highest point of the lap.', ko: '두 번째 오르막이자 코스의 가장 높은 지점입니다.', ja: '二つ目の上り坂で、コースの最高地点です。' },
  },
  {
    km: '7.1',
    name: { en: 'Veerhaven', ko: 'Veerhaven', ja: 'Veerhaven' },
    note: { en: 'Water on the quay between the moored ships.', ko: '정박한 배 사이 부두에서 급수합니다.', ja: '停泊中の船の間の岸壁で給水します。' },
    water: true,
  },
  {
    km: '8.3',
    name: { en: 'Het Park', ko: 'Het Park', ja: 'Het Park' },
    note: { en: 'Under the Euromast, on a path lit for the race.', ko: 'Euromast 아래, 경기를 위해 불을 밝힌 길입니다.', ja: 'Euromastの真下、レースのために照明された道です。' },
  },
  {
    km: '9.0',
    name: { en: 'Witte de Withstraat', ko: 'Witte de Withstraat', ja: 'Witte de Withstraat' },
    note: { en: 'One kilometre to go.', ko: '결승까지 1km 남았습니다.', ja: 'ゴールまで残り1kmです。' },
  },
  {
    km: '10.0',
    name: { en: 'Finish, Coolsingel', ko: '결승, Coolsingel', ja: 'ゴール、Coolsingel' },
    note: { en: 'Shirts, soup and tea in the City Hall courtyard.', ko: '완주 티셔츠, 수프, 차를 시청 안뜰에서 드립니다.', ja: '完走Tシャツ、スープ、お茶を市庁舎の中庭で配ります。' },
  },
];

// The elevation profile: x in tenths of a kilometre (0 to 1000), y from 20 m at the top
// (0) to 0 m at the bottom (100). The dotted fill uses the same points in percent.
const PROFILE: Array<[number, number]> = [
  [0, 85], [100, 85], [200, 80], [260, 80], [290, 50], [310, 35], [330, 50], [360, 85], [400, 90], [500, 85],
  [550, 85], [580, 55], [600, 40], [620, 55], [650, 85], [710, 90], [830, 80], [920, 85], [1000, 85],
];
const PROFILE_LINE = PROFILE.map(([x, y]) => `${x},${y}`).join(' ');
const PROFILE_FILL = `polygon(0 100%, ${PROFILE.map(([x, y]) => `${x / 10}% ${y}%`).join(', ')}, 100% 100%)`;
const KM_TICKS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const PEAKS = [
  { name: 'Willemsbrug', km: '3.1 km', x: 31, y: 65 },
  { name: 'Erasmusbrug', km: '6.0 km', x: 60, y: 60 },
];

type Pass = 'one' | 'three';
type Pen = 'A' | 'B' | 'C' | 'D';

const PENS: Array<{ id: Pen; range: Tri }> = [
  { id: 'A', range: { en: 'under 40 min', ko: '40분 미만', ja: '40分未満' } },
  { id: 'B', range: { en: '40 to 50 min', ko: '40~50분', ja: '40～50分' } },
  { id: 'C', range: { en: '50 to 60 min', ko: '50~60분', ja: '50～60分' } },
  { id: 'D', range: { en: 'over 60 min', ko: '60분 초과', ja: '60分超' } },
];

const ENTRY = {
  title: { en: 'Enter race {n}', ko: '{n}차 경기 참가', ja: '第{n}レースに参加' },
  forOne: { en: 'for one night', ko: '1회 참가 기준', ja: '1夜分' },
  alt: {
    en: 'Or €84 for the three nights still to run: 11 December, 15 January and 12 February.',
    ko: '또는 남은 3회 경기 전체 €84: 12월 11일, 1월 15일, 2월 12일.',
    ja: 'または残る3回分 €84：12月11日、1月15日、2月12日。',
  },
  includes: { en: 'Every entry includes', ko: '모든 참가에 포함', ja: 'すべての参加に含まれるもの' },
  pass: { en: 'Entry', ko: '참가 방식', ja: '参加方式' },
  one: { en: 'One night', ko: '1회 참가', ja: '1夜' },
  three: { en: 'Three nights', ko: '3회 참가', ja: '3夜' },
  threeDates: { en: '11 Dec, 15 Jan, 12 Feb', ko: '12월 11일, 1월 15일, 2월 12일', ja: '12月11日、1月15日、2月12日' },
  pen: { en: 'Start pen, by the 10 km time you expect', ko: '출발 구역, 예상 10km 기록 기준', ja: 'スタート枠（予想する10kmのタイム基準）' },
  name: { en: 'Full name', ko: '이름 (전체)', ja: 'お名前（フルネーム）' },
  email: { en: 'Email', ko: '이메일', ja: 'メールアドレス' },
  submit: { en: 'Pay €{price} and enter', ko: '€{price} 결제하고 참가하기', ja: '€{price}を支払って参加する' },
  fine: {
    en: 'You can pass your place to another runner until {day} for €5. Entries are not refunded.',
    ko: '{day}까지 €5를 내면 다른 참가자에게 자리를 넘길 수 있습니다. 참가비는 환불되지 않습니다.',
    ja: '{day}までは€5で、ほかのランナーに出場枠を譲ることができます。参加費は返金されません。',
  },
  penError: { en: 'Choose a start pen by the 10 km time you expect.', ko: '예상 10km 기록에 맞춰 출발 구역을 선택해 주세요.', ja: '予想する10kmのタイムに合わせてスタート枠を選択してください。' },
  nameError: {
    en: 'Write your full name as it should appear in the results.',
    ko: '결과에 표시될 이름 전체를 입력해 주세요.',
    ja: '結果に表示される通りのフルネームを入力してください。',
  },
  emailError: {
    en: 'Write the email address for your receipt, like name@example.nl.',
    ko: '영수증을 받을 이메일 주소를 입력해 주세요. 예: name@example.nl',
    ja: '領収書を受け取るメールアドレスを入力してください。例：name@example.nl',
  },
  doneOne: { en: '{name}, you are in race {n} on {date}.', ko: '{name}님, {date} {n}차 경기 참가가 완료되었습니다.', ja: '{name}様、{date}の第{n}レースへの参加が完了しました。' },
  doneThree: { en: '{name}, you are in races 2, 3 and 4.', ko: '{name}님, 2·3·4차 경기 참가가 완료되었습니다.', ja: '{name}様、第2・第3・第4レースへの参加が完了しました。' },
  doneBody: {
    en: 'Start pen {pen}. The receipt for €{price} is on its way to {email}. Collect your bib and rear light in the City Hall courtyard from 19:30 on race night.',
    ko: '출발 구역 {pen}. €{price} 영수증을 {email}(으)로 보내는 중입니다. 경기일 19:30부터 시청 안뜰에서 배번호와 후미등을 받아 가세요.',
    ja: 'スタート枠 {pen}。€{price}の領収書を{email}宛に送信中です。当日19:30から市庁舎の中庭で、ゼッケンと後部ライトを受け取ってください。',
  },
  again: { en: 'Enter another runner', ko: '다른 참가자 등록하기', ja: '別の参加者を登録する' },
} satisfies Record<string, Tri>;

const INCLUDED: Array<{ name: Tri; note: Tri }> = [
  {
    name: { en: 'Chip timing', ko: '칩 계측', ja: 'チップ計時' },
    note: { en: 'Your time by text message within a minute of finishing.', ko: '완주 후 1분 안에 문자 메시지로 기록을 받습니다.', ja: 'ゴール後1分以内に、タイムをSMSでお知らせします。' },
  },
  {
    name: { en: 'A clip-on rear light', ko: '클립형 후미등', ja: 'クリップ式の後部ライト' },
    note: { en: 'It comes with your bib. Every runner wears one after dark.', ko: '배번호와 함께 드립니다. 어두워진 뒤에는 모든 참가자가 착용합니다.', ja: 'ゼッケンと一緒にお渡しします。暗くなってからは全員が装着します。' },
  },
  {
    name: { en: 'Long-sleeve finisher shirt', ko: '긴팔 완주 티셔츠', ja: '長袖の完走Tシャツ' },
    note: { en: 'Handed out in the City Hall courtyard.', ko: '시청 안뜰에서 나눠 드립니다.', ja: '市庁舎の中庭で配布します。' },
  },
  {
    name: { en: 'Bag drop', ko: '짐 보관', ja: '荷物預かり' },
    note: { en: 'In the City Hall courtyard from 19:30.', ko: '19:30부터 시청 안뜰에서 운영합니다.', ja: '19:30から市庁舎の中庭で受け付けます。' },
  },
  {
    name: { en: 'Hot soup and tea', ko: '따뜻한 수프와 차', ja: '温かいスープとお茶' },
    note: { en: 'At the finish until 23:00.', ko: '23:00까지 결승선에서 제공합니다.', ja: '23:00まで、ゴールで提供します。' },
  },
  {
    name: { en: 'Free metro and tram', ko: '메트로·트램 무료 이용', ja: 'メトロ・トラム無料' },
    note: { en: 'Across Rotterdam from 18:00 to 02:00 with your bib.', ko: '배번호를 지니면 18:00부터 02:00까지 로테르담 전역에서 무료입니다.', ja: 'ゼッケンを付けていれば、18:00から翌2:00までロッテルダム全域で無料です。' },
  },
];

type ListId = 'overall' | 'women' | 'men';
const LIST_IDS: ListId[] = ['overall', 'women', 'men'];

const RESULTS = {
  title: { en: 'Race 1 results', ko: '1차 경기 결과', ja: '第1レース結果' },
  note: {
    en: 'Friday 13 November, 1,431 finishers. It was 7 °C and dry at the start.',
    ko: '11월 13일 금요일, 완주자 1,431명. 출발할 때 기온은 7 °C였고 비는 오지 않았습니다.',
    ja: '11月13日(金)、完走者1,431名。スタート時の気温は7 °Cで、雨は降っていませんでした。',
  },
  tabs: { en: 'Show results for', ko: '결과 보기 기준', ja: '表示する結果' },
  overall: { en: 'Overall', ko: '전체', ja: '総合' },
  women: { en: 'Women', ko: '여성', ja: '女子' },
  men: { en: 'Men', ko: '남성', ja: '男子' },
  find: { en: 'Find a runner', ko: '참가자 찾기', ja: '参加者を探す' },
  placeholder: { en: 'Bib or name', ko: '배번호 또는 이름', ja: 'ゼッケン番号または名前' },
  place: { en: 'Place', ko: '순위', ja: '順位' },
  bib: { en: 'Bib', ko: '배번호', ja: 'ゼッケン' },
  runner: { en: 'Runner', ko: '참가자', ja: 'ランナー' },
  split: { en: '5 km', ko: '5km 구간', ja: '5km 通過' },
  time: { en: 'Time', ko: '기록', ja: 'タイム' },
  behind: { en: 'Behind', ko: '선두와 차이', ja: 'トップとの差' },
  noClub: { en: 'No club', ko: '소속 없음', ja: '所属なし' },
  women_: { en: 'women {from} to {to}', ko: '여성 {from}~{to}세', ja: '女子 {from}～{to}歳' },
  men_: { en: 'men {from} to {to}', ko: '남성 {from}~{to}세', ja: '男子 {from}～{to}歳' },
  captionOverall: { en: 'Race 1, the overall top ten', ko: '1차 경기, 전체 상위 10명', ja: '第1レース、総合上位10名' },
  captionWomen: { en: 'Race 1, the top ten women', ko: '1차 경기, 여성 상위 10명', ja: '第1レース、女子上位10名' },
  captionMen: { en: 'Race 1, the top ten men', ko: '1차 경기, 남성 상위 10명', ja: '第1レース、男子上位10名' },
  matchOne: { en: 'One runner matches “{q}”.', ko: '“{q}”에 해당하는 참가자가 1명 있습니다.', ja: '“{q}”に一致する参加者は1名です。' },
  matchMany: { en: '{n} runners match “{q}”.', ko: '“{q}”에 해당하는 참가자가 {n}명 있습니다.', ja: '“{q}”に一致する参加者は{n}名です。' },
  emptyOverall: { en: 'No runner in the overall top ten matches “{q}”.', ko: '전체 상위 10명 중 “{q}”에 해당하는 참가자가 없습니다.', ja: '総合上位10名に“{q}”に一致する参加者はいません。' },
  emptyWomen: { en: 'None of the top ten women matches “{q}”.', ko: '여성 상위 10명 중 “{q}”에 해당하는 참가자가 없습니다.', ja: '女子上位10名に“{q}”に一致する参加者はいません。' },
  emptyMen: { en: 'None of the top ten men matches “{q}”.', ko: '남성 상위 10명 중 “{q}”에 해당하는 참가자가 없습니다.', ja: '男子上位10名に“{q}”に一致する参加者はいません。' },
  emptyHelp: {
    en: 'Search by bib number or by name. Every finisher has their own time in the results email of 14 November.',
    ko: '배번호나 이름으로 검색해 보세요. 모든 완주자의 기록은 11월 14일 결과 이메일에 있습니다.',
    ja: 'ゼッケン番号か名前で検索してください。全完走者のタイムは11月14日の結果メールに記載されています。',
  },
  clear: { en: 'Clear search', ko: '검색 지우기', ja: '検索をクリア' },
  cleared: { en: 'Showing all ten runners again.', ko: '상위 10명을 다시 모두 표시합니다.', ja: '上位10名をすべて表示しています。' },
  more: {
    en: 'The full list of 1,431 times with 5 km splits was emailed to every finisher on Saturday 14 November.',
    ko: '5km 구간 기록을 포함한 1,431명의 전체 기록표를 11월 14일 토요일에 모든 완주자에게 이메일로 보냈습니다.',
    ja: '5km通過タイムを含む1,431名分の全記録は、11月14日(土)に全完走者へメールで送信しました。',
  },
} satisfies Record<string, Tri>;

const CAPTIONS: Record<ListId, Tri> = { overall: RESULTS.captionOverall, women: RESULTS.captionWomen, men: RESULTS.captionMen };
const EMPTY: Record<ListId, Tri> = { overall: RESULTS.emptyOverall, women: RESULTS.emptyWomen, men: RESULTS.emptyMen };

interface Runner {
  overall: number;
  bib: number;
  name: string;
  club: string | null;
  sex: 'w' | 'm';
  ages: [number, number];
  split: string;
  time: string;
}

// Race 1, in finishing order. Enough runners for the top ten of each list.
const RUNNERS: Runner[] = [
  { overall: 1, bib: 1007, name: 'Youssef El Amrani', club: 'AV Delfshaven', sex: 'm', ages: [20, 34], split: '15:41', time: '31:08' },
  { overall: 2, bib: 1388, name: 'Daan Verhoeven', club: 'Maasstad Runners', sex: 'm', ages: [20, 34], split: '15:42', time: '31:26' },
  { overall: 3, bib: 512, name: 'Thijs de Graaf', club: 'Kralingen Loopgroep', sex: 'm', ages: [40, 44], split: '15:58', time: '32:02' },
  { overall: 4, bib: 1046, name: 'Lotte Hendriks', club: 'AV Delfshaven', sex: 'w', ages: [20, 34], split: '16:21', time: '32:40' },
  { overall: 5, bib: 87, name: 'Bram Visser', club: null, sex: 'm', ages: [20, 34], split: '16:10', time: '32:51' },
  { overall: 6, bib: 1211, name: 'Ayla Demir', club: 'Maasstad Runners', sex: 'w', ages: [20, 34], split: '16:39', time: '33:15' },
  { overall: 7, bib: 633, name: 'Jonas Pieters', club: 'Schiedam Atletiek', sex: 'm', ages: [45, 49], split: '16:44', time: '33:22' },
  { overall: 8, bib: 958, name: 'Merel van Dijk', club: 'Kralingen Loopgroep', sex: 'w', ages: [35, 39], split: '16:55', time: '33:47' },
  { overall: 9, bib: 1402, name: 'Kofi Mensah', club: null, sex: 'm', ages: [20, 34], split: '17:12', time: '34:05' },
  { overall: 10, bib: 271, name: 'Inês Carvalho', club: 'Maasstad Runners', sex: 'w', ages: [40, 44], split: '17:01', time: '34:18' },
  { overall: 11, bib: 1129, name: 'Sem Bakker', club: 'Rotterdam Atletiek', sex: 'm', ages: [20, 34], split: '17:08', time: '34:22' },
  { overall: 12, bib: 344, name: 'Rutger Jansen', club: 'Kralingen Loopgroep', sex: 'm', ages: [35, 39], split: '17:15', time: '34:31' },
  { overall: 13, bib: 1290, name: 'Fenna de Wit', club: 'AV Delfshaven', sex: 'w', ages: [20, 34], split: '17:20', time: '34:40' },
  { overall: 14, bib: 761, name: 'Mohamed Bouzid', club: null, sex: 'm', ages: [20, 34], split: '17:19', time: '34:44' },
  { overall: 15, bib: 418, name: 'Pieter Smit', club: 'Schiedam Atletiek', sex: 'm', ages: [50, 54], split: '17:31', time: '34:58' },
  { overall: 16, bib: 902, name: 'Sanne Mulder', club: 'Maasstad Runners', sex: 'w', ages: [35, 39], split: '17:36', time: '35:12' },
  { overall: 17, bib: 1477, name: 'Noor Haddou', club: null, sex: 'w', ages: [20, 34], split: '17:44', time: '35:30' },
  { overall: 19, bib: 655, name: 'Iris Kok', club: 'Kralingen Loopgroep', sex: 'w', ages: [45, 49], split: '17:52', time: '35:49' },
  { overall: 21, bib: 1338, name: 'Esther Boateng', club: 'Rotterdam Atletiek', sex: 'w', ages: [20, 34], split: '18:03', time: '36:04' },
  { overall: 23, bib: 207, name: 'Julia Nowak', club: null, sex: 'w', ages: [35, 39], split: '18:10', time: '36:21' },
];

const seconds = (time: string) => {
  const [minutes, rest] = time.split(':').map(Number);
  return minutes * 60 + rest;
};
const clock = (total: number) => `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;

interface Row extends Runner {
  place: number;
  behind: string | null;
}

const toRows = (runners: Runner[]): Row[] =>
  runners.slice(0, 10).map((runner, index) => ({
    ...runner,
    place: index + 1,
    behind: index === 0 ? null : clock(seconds(runner.time) - seconds(runners[0].time)),
  }));

const LISTS: Record<ListId, Row[]> = {
  overall: toRows(RUNNERS),
  women: toRows(RUNNERS.filter((runner) => runner.sex === 'w')),
  men: toRows(RUNNERS.filter((runner) => runner.sex === 'm')),
};

// Bib numbers match from their first digit; names match anywhere, without accents.
const fold = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
const matches = (row: Row, query: string) => {
  const q = fold(query.trim());
  if (q === '') return true;
  if (/^\d+$/.test(q)) return String(row.bib).startsWith(q);
  return fold(row.name).includes(q);
};

const FOOT = {
  organiser: {
    en: 'Organised by Stichting Nachtloop Rotterdam with the City of Rotterdam.',
    ko: '주최: Stichting Nachtloop Rotterdam, 로테르담시 협력.',
    ja: '主催：Stichting Nachtloop Rotterdam、ロッテルダム市の協力。',
  },
  closures: { en: 'Road closures', ko: '도로 통제', ja: '道路規制' },
  closuresBody: {
    en: 'The Coolsingel, the Boompjes and the Erasmusbrug close to traffic from 20:15 to 22:45 on race nights.',
    ko: '경기일에는 20:15부터 22:45까지 Coolsingel, Boompjes, Erasmusbrug의 차량 통행을 막습니다.',
    ja: 'レース当日は20:15から22:45まで、Coolsingel、Boompjes、Erasmusbrugへの車両の通行を止めます。',
  },
  questions: { en: 'Questions', ko: '문의', ja: 'お問い合わせ' },
  questionsBody: {
    en: 'race@nightlap.nl, answered on weekdays within one working day.',
    ko: 'race@nightlap.nl. 평일에 영업일 기준 1일 이내로 답변합니다.',
    ja: 'race@nightlap.nl。平日、営業日1日以内に返信します。',
  },
} satisfies Record<string, Tri>;

const PROMPT_EN = `Design one real page in the Duotone Bold style: printed in two inks only, a near-black ground and one fluorescent lime, with huge condensed capitals and a halftone dot field that swells into solid ink.

Pick a believable subject that lives on a date, a time and a few big numbers, such as a night race series, a club night or a print fair, and write its real content. The page must read as that subject's page, never as a page about its own style. Here it is Night Lap 10K, a winter series of four Friday night races in Rotterdam: the next race night as a street poster, the four nights, the route, the entry form and the last race's results.

TOKENS:
--ink: #0a0a0a (the ground, and every text on lime)
--lime: #c5ff00 (text, rules, buttons, the chosen state, the halftone)
--soft: rgba(197,255,0,0.8) (secondary text)
--line: rgba(197,255,0,0.42) (1px row rules)
--hint: rgba(197,255,0,0.55) (placeholders)
--wash: rgba(197,255,0,0.12) (hover on an unchosen option)
The halftone is built from greyscale layers (#000, #fff, #4d4d4d) that a contrast filter thresholds, so it prints only lime and black; the poster date is #cfff0a with mix-blend-mode: difference, so it reads lime on black and black on lime.

COLOUR:
- Two inks and nothing else: no grey, no third colour, no gradient that shows as a gradient. Errors are an inverted lime block with ink text under the field, never red.
- Lime text on ink; ink text on lime (the entry panel, the chosen race night, chosen options, the selected tab, the winner's place, the confirmation, the error blocks). Structural rules are 2px lime under the top bar and the poster and at the top of every list, the results and the footer; 1px --line between rows.
- Focus is a 3px lime ring 3px clear of the control, drawn in ink on lime surfaces.
- Square corners everywhere. No drop shadows, no glows, no opacity fades on solid ink. The one box-shadow is an 8px ink keyline around the entry panel, which knocks it out of the dot field.

TYPOGRAPHY:
Two families. Big Shoulders Display (500 to 900) sets the date, the headings and every figure, in capitals with near-zero tracking. Golos Text (400 to 700) reads the words around them.
The poster: the day 800 at 3rem (clamp(2rem, 4.6vw, 3.75rem) below 1080px); the date 900 at 19rem on a laptop and clamp(6.5rem, 37vw, 30rem) below 1080px, line-height 0.84; the start time in the same cut at 10rem on a laptop, clamp(4rem, 19vw, 16rem) on tablets and 22vw on phones, set in outline with a 3px lime stroke (2px on phones).
H2: 900, clamp(3.5rem, 6.6vw, 6rem), line-height 0.88. Race night dates 900 at clamp(4.5rem, 9.6vw, 8rem), line-height 0.84; race numbers 800 at 1.75rem.
Figures: places left 900 at 5.5rem in the panel and 2.25rem in the list; kilometres 900 at 3.25rem (2.6rem on phones); the fee 900 at clamp(7rem, 13vw, 11.5rem); option prices 900 at 3rem (2.5rem on small phones); pen letters 900 at 2.25rem; results place and time 900 at 3rem; bib, split and gap 700 at 1.375rem (1.25rem on phones). Figures are lining and tabular. The mark, headings, dates, race numbers and pen letters are set in capitals with tracking between 0 and 0.02em.
Body: Golos Text 400 at 1.0625rem, line-height 1.55; strong words 600; small text 1rem. Nothing under 1rem. Inputs at 1.0625rem.

LAYOUT:
- A 1120px column. A top bar on a 2px lime rule: the series mark (NIGHT LAP with 10K knocked out of a lime block), four in-page links and a solid lime "Enter race 2" button.
- The poster fills the first screen of a 1280x800 laptop: FRIDAY, then 11 DEC huge, then 21:00 in outline, in the left eight of twelve columns; the entry panel (places left, "Enter for €32", when entry closes) solid lime in the right four, bottom-aligned with the time. Behind them a halftone dot field (dots rotated 45°, 12px pitch, 9px on phones) swells to solid lime around the right end of the date; the date knocks out where it crosses it. The lede sits under the poster in the left five columns. Below 1080px the date runs the full width, and the lede and panel share the row under it; on phones they stack.
- Then four race nights as a tour-date list, the route, entry (fee and what it includes on the left, the form on the right), the results, a three-column footer and a halftone band that fades up into solid lime.
- Sections 112px apart (84px on phones); each opens with the H2 on the left and its note on the right.

COMPONENTS:
- Race nights: one row per night with the race number, the date huge, the state and an action. The finished night is set in outline with its result and a "See results" link; each open night shows places left as a figure and a bar (solid for taken places, dotted for free ones) and a Choose button (aria-pressed). The chosen night inverts to a lime band. Choosing a night makes it the race in the entry section and the top bar, and announces it.
- Route: an elevation profile drawn in dots under a 3px lime line, with the two bridges named at their peaks, a km ruler with checkpoint squares (filled for water), then the checkpoints as an ordered list of eleven in two columns: kilometre figure, place, one line.
- Entry: the fee huge, the three-night price in one line, six things included as ruled rows. The form: Entry (one night for the chosen race or three nights) and Start pen A to D as radio groups drawn as square tiles that invert when chosen; full name and email on single 2px underlines; one solid button that names the price ("Pay €32 and enter"). Pen, name and email are validated; each error appears under its field with role="alert", the field's underline thickens to 4px, and focus moves to the first one. A valid entry replaces the form with a confirmation that takes focus, and the places left drop by one for each night entered.
- Results: Overall, Women and Men as tabs (roving tabindex, arrow keys, one labelled panel), a "Find a runner" search by bib or name on one underline, and the top ten as a table: place (the winner's in a lime block), bib, runner with club and age group, 5 km split, time, gap to the leader. An empty search shows what to try and a Clear search button. On phones each row stacks into place, runner and time with labelled bib, split and gap.
- Footer: organiser, road closures, questions; then the halftone band.

MOTION:
- A 160ms colour change on hover and nothing else. Nothing moves on its own. prefers-reduced-motion removes the transition.

FALLBACK:
- The halftone needs mix-blend-mode. Without it (and in forced colours) the dot field and band are not drawn and the date is plain solid lime; without text stroke the time is solid too.

FORBIDDEN:
- Cards, rounded corners, pills, badges, chips, shadows, glows, glass
- A small label above a heading, all-caps tracked labels, numbered section markers
- Grey text, a third colour, red errors, colour gradients
- Figures of runners, maps drawn as pictures, photographs, emoji, icons beyond a small square
- Arrows on links, middle-dot meta strings, numbers on anything that is not a real sequence
- Copy about colour, contrast, print or design

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML: radio groups for the entry and the pens, a tab list with one tab panel, a table with explicit roles for the results, ordered lists for the nights and the checkpoints, a labelled form
3) Working race choice, entry form with error and success states, results tabs and search with an empty state
4) Responsive layout down to 320px with no horizontal scroll; the results table stacks into rows on phones
5) Visible focus on every control (lime ring, ink on lime surfaces), a text alternative for the poster date, the solid fallback for the halftone`;

const PROMPT_KO = `Duotone Bold 스타일로 실제 페이지 한 장을 디자인합니다. 인쇄 잉크는 두 가지만 씁니다. 거의 검은 바탕과 형광 라임 하나입니다. 크고 좁은 대문자를 쓰고, 솔리드 잉크로 번지는 하프톤 점 면을 함께 씁니다.

날짜, 시간, 몇 개의 큰 숫자와 관련된 그럴듯한 주제를 고르고 실제 내용을 씁니다. 예를 들면 야간 대회 시리즈, 클럽의 밤, 인쇄 박람회 같은 주제입니다. 페이지는 그 주제의 페이지로 읽혀야 하며, 스타일 자체에 관한 페이지로 읽혀서는 안 됩니다. 여기서는 로테르담에서 열리는 겨울 금요일 야간 대회 시리즈 4회, Night Lap 10K입니다. 다음 경기일을 거리 포스터로, 나머지 네 번의 야간 경기, 코스, 참가 양식, 지난 경기 결과를 담습니다.

TOKENS:
--ink: #0a0a0a (바탕과 라임 위의 모든 글자)
--lime: #c5ff00 (글자, 선, 버튼, 선택 상태, 하프톤)
--soft: rgba(197,255,0,0.8) (보조 글자)
--line: rgba(197,255,0,0.42) (1px 행 구분선)
--hint: rgba(197,255,0,0.55) (입력 안내 글자)
--wash: rgba(197,255,0,0.12) (선택되지 않은 항목의 hover)
하프톤은 회색조 레이어(#000, #fff, #4d4d4d)에 대비 필터로 임계값을 줘서 만듭니다. 그래서 라임과 검정 두 가지로만 인쇄됩니다. 포스터 날짜는 #cfff0a에 mix-blend-mode: difference를 적용해, 검정 위에서는 라임으로, 라임 위에서는 검정으로 읽히게 합니다.

COLOUR:
- 잉크 두 가지만 씁니다. 회색, 세 번째 색, 색 그라데이션으로 보이는 그라데이션은 쓰지 않습니다. 오류는 빨간색이 아니라, 필드 아래에 라임 바탕과 잉크 글자를 뒤집은 블록으로 표시합니다.
- 라임 글자는 잉크 바탕 위에, 잉크 글자는 라임 바탕 위에 씁니다(참가 패널, 선택된 경기일, 선택된 옵션, 선택된 탭, 우승자 순위, 완료 확인, 오류 블록). 구조선은 상단 바와 포스터 아래, 모든 목록의 맨 위, 결과와 바닥글에 2px 라임 선으로 씁니다. 행 사이는 1px --line 선입니다.
- 포커스는 컨트롤에서 3px 떨어진 3px 라임 링으로 표시합니다. 라임 면 위에서는 링을 잉크 색으로 그립니다.
- 모서리는 모두 직각입니다. 그림자, 빛번짐, 솔리드 잉크 위의 투명도 페이드는 쓰지 않습니다. 유일한 box-shadow는 참가 패널 둘레의 8px 잉크 외곽선이며, 이것으로 패널이 점 격자 위에서 잘려 나와 보이게 합니다.

TYPOGRAPHY:
두 가지 글꼴 계열을 씁니다. Big Shoulders Display(500~900)는 날짜, 제목, 모든 숫자를 자간이 거의 없는 대문자로 조판합니다. Golos Text(400~700)는 그 주변의 글을 읽히게 합니다.
포스터: 요일은 800, 3rem(1080px 미만에서는 clamp(2rem, 4.6vw, 3.75rem)). 날짜는 900, 노트북에서 19rem, 1080px 미만에서는 clamp(6.5rem, 37vw, 30rem), 줄 높이 0.84. 시작 시각은 같은 글꼴로, 노트북에서 10rem, 태블릿에서 clamp(4rem, 19vw, 16rem), 휴대폰에서 22vw. 3px 라임 외곽선만 그립니다(휴대폰에서는 2px).
H2: 900, clamp(3.5rem, 6.6vw, 6rem), 줄 높이 0.88. 경기일 날짜는 900, clamp(4.5rem, 9.6vw, 8rem), 줄 높이 0.84. 경기 번호는 800, 1.75rem.
숫자: 남은 자리는 패널에서 900, 5.5rem, 목록에서 2.25rem. 킬로미터는 900, 3.25rem(휴대폰에서 2.6rem). 참가비는 900, clamp(7rem, 13vw, 11.5rem). 옵션 가격은 900, 3rem(작은 휴대폰에서 2.5rem). 출발 구역 문자는 900, 2.25rem. 결과의 순위와 기록은 900, 3rem. 배번호, 구간, 차이는 700, 1.375rem(휴대폰에서 1.25rem). 숫자는 lining, tabular로 씁니다. 로고, 제목, 날짜, 경기 번호, 출발 구역 문자는 대문자로 조판하고, 자간은 0~0.02em입니다.
본문: Golos Text 400, 1.0625rem, 줄 높이 1.55. 강조어는 600. 작은 글은 1rem. 1rem보다 작은 글은 쓰지 않습니다. 입력란은 1.0625rem입니다.

LAYOUT:
- 1120px 열. 2px 라임 선 위의 상단 바: 시리즈 표식(NIGHT LAP과, 라임 블록에서 뚫어 낸 10K), 페이지 내 링크 네 개, 채워진 라임 "2차 경기 참가" 버튼.
- 포스터는 1280x800 노트북의 첫 화면을 채웁니다. 12열 중 왼쪽 8열에 FRIDAY, 그다음 크게 12월 11일, 그다음 아웃라인으로 21:00을 둡니다. 오른쪽 4열에는 채운 라임 색의 참가 패널(남은 자리, "€32로 참가하기", 접수 마감)을 두고, 아래쪽을 시각에 맞춥니다. 뒤에는 점 격자(점은 45도 회전, 간격 12px, 휴대폰에서 9px)가 있고, 날짜의 오른쪽 끝 부근에서 솔리드 라임으로 번집니다. 날짜가 겹치는 부분은 잘라냅니다. 소개글은 포스터 아래 왼쪽 5열에 둡니다. 1080px 미만에서는 날짜가 전체 너비를 쓰고, 소개글과 패널은 그 아래 한 줄을 나눠 씁니다. 휴대폰에서는 모두 세로로 쌓습니다.
- 이어서 네 번의 경기를 투어 일정 목록으로, 코스, 참가(왼쪽에 참가비와 포함 내용, 오른쪽에 양식), 결과, 3열 바닥글을 놓고, 솔리드 라임으로 올라가며 사라지는 하프톤 띠로 마무리합니다.
- 섹션 간격은 112px(휴대폰에서는 84px). 각 섹션은 왼쪽의 H2로 시작하고, 설명은 오른쪽에 둡니다.

COMPONENTS:
- 경기일: 경기 번호, 큰 날짜, 상태, 동작이 있는 행을 밤마다 하나씩 둡니다. 끝난 경기는 아웃라인으로 쓰고, 결과와 "결과 보기" 링크를 둡니다. 열린 경기마다 남은 자리를 숫자와 막대로 보여 줍니다(채워진 자리는 솔리드, 빈 자리는 점선). 그리고 "선택" 버튼(aria-pressed)을 둡니다. 선택된 경기는 라임 띠로 반전합니다. 경기일을 고르면 참가 섹션과 상단 바의 경기가 그 경기로 바뀌고, 이를 알립니다.
- 코스: 3px 라임 선 아래에 점으로 그린 고도 프로필을 둡니다. 두 다리는 정상에 이름을 붙여 표시합니다. 그 아래 km 눈금에 체크포인트 사각형을 두며(급수 지점은 채움), 마지막으로 체크포인트 11곳을 두 열의 순서 있는 목록으로 둡니다. 각 항목은 킬로미터 숫자, 장소, 한 줄 설명입니다.
- 참가: 참가비는 크게, 세 회 가격은 한 줄로, 포함 내용 여섯 가지는 구분선이 있는 행으로 보여 줍니다. 양식은 참가 방식(선택한 경기 1회 또는 3회)과 출발 구역 A~D의 라디오 그룹으로 구성합니다. 구역은 선택하면 반전되는 정사각형 타일로 그립니다. 이름과 이메일은 각각 2px 밑줄 하나짜리 입력란으로 둡니다. 실행 버튼은 하나이며 가격을 적습니다("€32 결제하고 참가하기"). 구역, 이름, 이메일은 검증합니다. 각 오류는 해당 필드 아래에 role="alert"로 나타나고, 필드의 밑줄은 4px로 굵어지며, 포커스는 첫 번째 오류 필드로 이동합니다. 유효한 참가는 확인 화면이 양식을 대신하고, 확인 화면이 포커스를 받습니다. 참가 한 건마다 남은 자리는 1씩 줄어듭니다.
- 결과: 전체, 여성, 남성을 탭으로 둡니다(roving tabindex, 화살표 키, 레이블이 있는 탭 패널 하나). 배번호나 이름으로 찾는 "참가자 찾기" 검색은 밑줄 하나로 둡니다. 상위 10명은 표로 보여 줍니다. 열은 순위(우승자는 라임 블록), 배번호, 소속과 연령대가 있는 참가자, 5km 구간, 기록, 선두와의 차이입니다. 빈 검색 결과에는 시도해 볼 방법과 "검색 지우기" 버튼을 보여 줍니다. 휴대폰에서는 각 행이 순위, 참가자, 기록 순으로 쌓이며, 배번호, 구간, 차이에는 레이블을 붙입니다.
- 바닥글: 주최, 도로 통제, 문의, 그다음 하프톤 띠.

MOTION:
- 색 변화는 hover에서만 160ms로 줍니다. 그 밖에는 아무것도 움직이지 않습니다. 저절로 움직이는 요소는 없습니다. prefers-reduced-motion에서는 전환을 없앱니다.

FALLBACK:
- 하프톤에는 mix-blend-mode가 필요합니다. 이를 지원하지 않거나 강제 색상 모드에서는 점 격자와 띠를 그리지 않고, 날짜는 솔리드 라임으로 둡니다. 텍스트 외곽선을 지원하지 않으면 시각도 솔리드로 둡니다.

FORBIDDEN:
- 카드, 둥근 모서리, 알약 모양, 배지, 칩, 그림자, 빛번짐, 유리 효과
- 제목 위의 작은 라벨, 대문자에 자간을 넓힌 라벨, 번호가 붙은 섹션 표시
- 회색 글자, 세 번째 색, 빨간 오류, 색 그라데이션
- 러너 그림, 그림으로 그린 지도, 사진, 이모지, 작은 정사각형을 넘는 아이콘
- 링크의 화살표, 가운뎃점으로 이은 메타 문자열, 실제 순서가 아닌 것에 붙인 숫자
- 색, 대비, 인쇄, 디자인에 관한 문구

OUTPUT:
1) 위 토큰의 CSS 커스텀 속성
2) 시맨틱 HTML: 참가와 출발 구역에는 라디오 그룹, 탭 패널 하나를 둔 탭 목록, 결과에는 명시적 role을 가진 표, 경기일과 체크포인트에는 순서 있는 목록, 레이블이 있는 양식
3) 동작하는 경기 선택, 오류와 완료 상태가 있는 참가 양식, 결과 탭과 빈 상태가 있는 검색
4) 320px까지 가로 스크롤 없이 대응하는 반응형 레이아웃. 휴대폰에서는 결과 표가 행으로 쌓입니다.
5) 모든 컨트롤의 보이는 포커스(라임 링, 라임 면 위에서는 잉크 색), 포스터 날짜의 텍스트 대체, 하프톤의 솔리드 대체 화면`;

const PROMPT_JA = `Duotone Bold スタイルで、実在しそうなページを1枚デザインします。印刷は2色のみです。ほぼ黒の地色と蛍光ライム1色。大きく細い大文字と、ソリッドインクに広がるハーフトーンのドット面を使います。

日付、時間、いくつかの大きな数字で成り立つ、もっともらしいテーマを選び、実際の内容を書きます。例えばナイトレースのシリーズ、クラブの夜、印刷の展示会などです。ページはそのテーマのページとして読めなければならず、スタイル自体についてのページに見えてはいけません。ここではロッテルダムで行われる冬の金曜夜のレース全4回、Night Lap 10Kです。次のレース日を街頭ポスターとして、残りの4回、コース、参加フォーム、前回レースの結果を載せます。

TOKENS:
--ink: #0a0a0a（地色、およびライム上のすべての文字）
--lime: #c5ff00（文字、罫線、ボタン、選択状態、ハーフトーン）
--soft: rgba(197,255,0,0.8)（補助文字）
--line: rgba(197,255,0,0.42)（1pxの行罫線）
--hint: rgba(197,255,0,0.55)（プレースホルダー）
--wash: rgba(197,255,0,0.12)（未選択項目のhover）
ハーフトーンは、グレースケールのレイヤー（#000、#fff、#4d4d4d）にコントラストフィルターで閾値を与えて作ります。そのためライムと黒の2色だけで印刷されます。ポスターの日付は #cfff0a に mix-blend-mode: difference を適用し、黒地ではライムに、ライム地では黒に読めるようにします。

COLOUR:
- 2色のみ。グレー、第3の色、色の変化に見えるグラデーションは使いません。エラーは赤ではなく、フィールドの下にインク色の文字を載せた反転ライムのブロックで示します。
- ライムの文字はインクの地色の上に、インクの文字はライムの地色の上に置きます（参加パネル、選択された開催日、選択されたオプション、選択されたタブ、優勝者の順位、完了の確認、エラーのブロック）。構造罫線は、上部バーとポスターの下、各リストの先頭、結果、フッターに2pxのライム線です。行の間は1px --lineです。
- フォーカスは、コントロールから3px離した3pxのライムのリングで示します。ライムの面の上では、リングをインクの色で描きます。
- 角はすべて直角。ドロップシャドウ、グロー、ソリッドインクの上の透明度のフェードは使いません。唯一のbox-shadowは参加パネルを囲む8pxのインクの縁取りで、ドット面の上にパネルを切り抜いて見せます。

TYPOGRAPHY:
フォントは2系統です。Big Shoulders Display（500〜900）は日付、見出し、すべての数字を、字間をほぼゼロにした大文字で組みます。Golos Text（400〜700）は、その周りの文章を読ませます。
ポスター：曜日は800、3rem（1080px未満ではclamp(2rem, 4.6vw, 3.75rem)）。日付は900、ノートPCで19rem、1080px未満ではclamp(6.5rem, 37vw, 30rem)、行の高さ0.84。開始時刻は同じ書体で、ノートPCでは10rem、タブレットではclamp(4rem, 19vw, 16rem)、スマートフォンでは22vw。3pxのライムの縁取りで輪郭のみ（スマートフォンでは2px）。
H2：900、clamp(3.5rem, 6.6vw, 6rem)、行の高さ0.88。開催日の日付は900、clamp(4.5rem, 9.6vw, 8rem)、行の高さ0.84。レース番号は800、1.75rem。
数字：残り定員はパネルで900の5.5rem、リストでは2.25rem。キロ数は900の3.25rem（スマートフォンでは2.6rem）。参加料は900のclamp(7rem, 13vw, 11.5rem)。オプション価格は900の3rem（小型のスマートフォンでは2.5rem）。出走枠の文字は900の2.25rem。結果の順位とタイムは900の3rem。ゼッケン、区間、差は700の1.375rem（スマートフォンでは1.25rem）。数字はlining、tabularで組みます。ロゴ、見出し、日付、レース番号、出走枠の文字は大文字で組み、字間は0〜0.02emです。
本文：Golos Text 400、1.0625rem、行の高さ1.55。強調語は600。小さい文字は1rem。1rem未満の文字は使いません。入力欄は1.0625remです。

LAYOUT:
- 1120pxのカラム。2pxのライムの罫線の上に上部バー：シリーズのマーク（NIGHT LAPと、ライムのブロックから抜いた10K）、ページ内リンク4つ、塗りつぶしのライム「第2レースに参加」ボタン。
- ポスターは1280x800のノートPCの最初の画面を埋めます。12列のうち左8列に、FRIDAY、次に大きく12月11日、次にアウトラインの21:00を置きます。右4列には、塗りつぶしのライムの参加パネル（残り定員、「€32で参加する」、受付締切）を、下端を時刻に揃えて置きます。背後にはハーフトーンのドット面（ドットは45°回転、12pxピッチ、スマートフォンでは9px）があり、日付の右端付近でソリッドのライムに膨らみます。日付と交わる部分は切り抜きます。紹介文はポスターの下、左5列に置きます。1080px未満では日付が全幅になり、紹介文とパネルはその下の行を分け合います。スマートフォンでは縦に積みます。
- 続いて、ツアー日程のリストとしての4回のレース、コース、参加（左に参加料と含まれるもの、右にフォーム）、結果、3列のフッター、そしてソリッドのライムへ上がっていくハーフトーンの帯。
- セクションの間隔は112px（スマートフォンでは84px）。各セクションは左のH2で始まり、説明文は右に置きます。

COMPONENTS:
- 開催日：夜ごとに1行。レース番号、大きな日付、状態、操作を置きます。終了したレースはアウトラインで表示し、結果と「結果を見る」リンクを置きます。募集中の各レースは残り定員を数字と棒で示します（埋まった席は塗りつぶし、空いた席は点線）。「選択」ボタン（aria-pressed）を置きます。選択された開催日はライムの帯に反転します。開催日を選ぶと、参加セクションと上部バーのレースがそれに変わり、その旨を通知します。
- コース：3pxのライム線の下に、点で描いた標高プロファイル。2本の橋は頂点に名前を付けて示します。km目盛りの上にチェックポイントの四角（給水地点は塗りつぶし）を置きます。最後に、11のチェックポイントを2列の順序付きリストで示します。各項目は、キロ数、地点、1行の説明です。
- 参加：参加料は大きく、3回分の価格は1行で、含まれる6項目は罫線付きの行で示します。フォームは、参加方式（選んだレースの1回または3回）と、出走枠A〜Dのラジオグループで構成します。枠は選ばれると反転する正方形のタイルとして描きます。氏名とメールは、それぞれ2pxの下線1本の入力欄にします。送信ボタンは1つで、価格を書きます（「€32を支払って参加する」）。枠、氏名、メールは検証します。各エラーは該当フィールドの下に role="alert" で出し、フィールドの下線を4pxに太くし、フォーカスを最初のエラーに移します。有効な参加では、フォームを確認画面に置き換え、その画面がフォーカスを受け取ります。参加1件ごとに残り定員は1ずつ減ります。
- 結果：総合、女子、男子をタブにします（roving tabindex、矢印キー、ラベル付きのタブパネル1つ）。ゼッケンまたは名前で探す「ランナーを探す」検索は下線1本です。上位10名は表で示します。列は順位（優勝者はライムのブロック）、ゼッケン、所属と年齢区分のあるランナー、5km通過、タイム、トップとの差です。検索結果が空の場合は、試すべきことと「検索をクリア」ボタンを表示します。スマートフォンでは各行を順位、ランナー、タイムに積み、ゼッケン、通過、差にはラベルを付けます。
- フッター：主催、交通規制、お問い合わせ。その後にハーフトーンの帯。

MOTION:
- 色の変化は hover 時の160msだけ。ほかは動かしません。何も自動で動きません。prefers-reduced-motion では遷移を取り除きます。

FALLBACK:
- ハーフトーンには mix-blend-mode が必要です。非対応や強制カラーでは、ドット面と帯を描かず、日付は塗りつぶしのライムにします。テキストの縁取りがなければ、時刻も塗りつぶしにします。

FORBIDDEN:
- カード、角丸、ピル型、バッジ、チップ、影、グロー、ガラス効果
- 見出しの上の小さなラベル、大文字で字間を空けたラベル、番号付きのセクションマーカー
- グレーの文字、第3の色、赤いエラー、色のグラデーション
- ランナーの絵、絵で描いた地図、写真、絵文字、小さな正方形を超えるアイコン
- リンクの矢印、中黒で区切ったメタ文字列、実際の順序ではないものへの番号
- 色、コントラスト、印刷、デザインについての文言

OUTPUT:
1) 上記トークンのCSSカスタムプロパティ
2) セマンティックHTML：参加と出走枠はラジオグループ、タブパネルが1つのタブリスト、結果は明示的なroleを持つ表、開催日とチェックポイントは順序付きリスト、ラベル付きのフォーム
3) 動作するレース選択、エラーと完了の状態を持つ参加フォーム、結果タブと空状態のある検索
4) 320pxまで横スクロールなしのレスポンシブレイアウト。スマートフォンでは結果の表を行に積みます。
5) すべてのコントロールに見えるフォーカス（ライムのリング、ライムの面上ではインク色）、ポスターの日付のテキスト代替、ハーフトーンのソリッドによるフォールバック`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_KO, ja: PROMPT_JA };

type Errors = { pen: boolean; name: boolean; email: boolean };
const NO_ERRORS: Errors = { pen: false, name: false, email: false };

interface Entry {
  pass: Pass;
  race: OpenRace;
  pen: Pen;
  name: string;
  email: string;
}

export function PortedDuotoneBoldPage({ lang }: PortedStylePageProps) {
  const [raceN, setRaceN] = useState<OpenRace>(2);
  const [taken, setTaken] = useState<Record<RaceId, number>>({ 1: 0, 2: 0, 3: 0, 4: 0 });
  const [nightNews, setNightNews] = useState('');
  const [pass, setPass] = useState<Pass>('one');
  const [pen, setPen] = useState<Pen | null>(null);
  const [runner, setRunner] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState<Errors>(NO_ERRORS);
  const [entry, setEntry] = useState<Entry | null>(null);
  const [list, setList] = useState<ListId>('overall');
  const [query, setQuery] = useState('');
  const [resultNews, setResultNews] = useState('');
  const penRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const findRef = useRef<HTMLInputElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const wasEntered = useRef(false);
  const newsTimer = useRef(0);

  const t = (text: Tri) => text[lang];
  const race = raceOf(raceN);
  const leftOf = (item: Race) => item.left - taken[item.n];
  const price = PRICE[pass];
  const rows = LISTS[list].filter((row) => matches(row, query));

  // The form and the confirmation replace each other, and the control that had focus
  // leaves the page with them. Focus goes to what took its place: the confirmation, or,
  // after "Enter another runner", the chosen entry option at the top of the form.
  useEffect(() => {
    if (entry) doneRef.current?.focus();
    else if (wasEntered.current) formRef.current?.querySelector<HTMLInputElement>('input:checked')?.focus();
    wasEntered.current = entry !== null;
  }, [entry]);

  useEffect(() => () => window.clearTimeout(newsTimer.current), []);

  const choose = (n: OpenRace) => {
    if (n === raceN) return;
    setRaceN(n);
    setNightNews(fill(t(NIGHTS.news), { n, date: t(raceOf(n).long) }));
  };

  // The match count is announced once typing pauses, never on every key.
  const announceMatches = (value: string, id: ListId, delay: number) => {
    window.clearTimeout(newsTimer.current);
    const q = value.trim();
    if (q === '') return;
    newsTimer.current = window.setTimeout(() => {
      const found = LISTS[id].filter((row) => matches(row, q)).length;
      setResultNews(found === 0 ? fill(t(EMPTY[id]), { q }) : found === 1 ? fill(t(RESULTS.matchOne), { q }) : fill(t(RESULTS.matchMany), { n: found, q }));
    }, delay);
  };

  const showList = (index: number, moveFocus: boolean) => {
    const id = LIST_IDS[index];
    setList(id);
    if (moveFocus) tabRefs.current[index]?.focus();
    announceMatches(query, id, 0);
  };

  const onTabKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = LIST_IDS.indexOf(list);
    const last = LIST_IDS.length - 1;
    const moves: Record<string, number> = {
      ArrowRight: current === last ? 0 : current + 1,
      ArrowLeft: current === 0 ? last : current - 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    showList(moves[event.key], true);
  };

  const clearSearch = () => {
    window.clearTimeout(newsTimer.current);
    setQuery('');
    setResultNews(t(RESULTS.cleared));
    findRef.current?.focus();
  };

  const enter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Errors = {
      pen: pen === null,
      name: runner.name.trim().length < 2,
      email: !EMAIL_PATTERN.test(runner.email.trim()),
    };
    if (pen !== null && !next.name && !next.email) {
      const nights: RaceId[] = pass === 'three' ? OPEN : [raceN];
      setTaken((before) => {
        const after = { ...before };
        for (const n of nights) after[n] += 1;
        return after;
      });
      setErrors(NO_ERRORS);
      setEntry({ pass, race: raceN, pen, name: runner.name.trim(), email: runner.email.trim() });
      return;
    }
    // The error renders first, so the whole field can be brought into view above the fixed page bar.
    flushSync(() => setErrors(next));
    const field = next.pen ? penRef.current : next.name ? nameRef.current : emailRef.current;
    field?.focus();
    field?.closest('.nl-field, .nl-pens')?.scrollIntoView({ block: 'nearest' });
  };

  const again = () => {
    setRunner({ name: '', email: '' });
    setPen(null);
    setEntry(null);
  };

  const nextLeft = leftOf(NEXT);

  return (
    <FusionShell
      fusionId="duotone-bold"
      lang={lang}
      tone="dark"
      accent="#c5ff00"
      prev={{ href: '/pages/mono-type.html', label: 'Mono Type' }}
      next={{ href: '/pages/mesh-gradient.html', label: 'Mesh Gradient' }}
      prompts={PROMPTS}
    >
      <div className="nl">
        <header className="nl-bar">
          <div className="nl-mark">{SERIES} <b>10K</b></div>
          <nav className="nl-bar__nav" aria-label={t(HEAD.nav)}>
            <a href="#nl-nights">{t(HEAD.nights)}</a>
            <a href="#nl-route">{t(HEAD.route)}</a>
            <a href="#nl-enter">{t(HEAD.entry)}</a>
            <a href="#nl-results">{t(HEAD.results)}</a>
          </nav>
          <a className="nl-btn nl-btn--solid nl-bar__enter" href="#nl-enter" aria-label={fill(t(HEAD.enter), { n: raceN })}>
            <span className="nl-bar__long">{fill(t(HEAD.enter), { n: raceN })}</span>
            <span className="nl-bar__short">{t(HEAD.enterShort)}</span>
          </a>
        </header>

        <section className="nl-hero" aria-labelledby="nl-title">
          <div className="nl-ht" aria-hidden="true">
            <div className="nl-ht__ink"><span className="nl-ht__dots" /><span className="nl-ht__tone" /></div>
          </div>
          <div className="nl-hero__in">
            <h1 className="nl-when" id="nl-title">
              <span className="nl-sr">{t(HERO.title)}</span>
              <span className="nl-when__day" aria-hidden="true">{t(HERO.day)}</span>
              <span className="nl-when__date" aria-hidden="true">{t(NEXT.short)}</span>
              <span className="nl-when__time" aria-hidden="true">{START}</span>
            </h1>
            <p className="nl-lede">{t(HERO.lede)}</p>
            <div className="nl-act">
              <p className="nl-act__left">
                <b>{count.format(nextLeft)}</b>
                <span>{fill(t(HERO.left), { capacity: count.format(CAPACITY) })}</span>
              </p>
              <a
                className="nl-btn nl-btn--ink"
                href="#nl-enter"
                onClick={() => {
                  setRaceN(2);
                  setPass('one');
                }}
              >
                {fill(t(HERO.enter), { price: PRICE.one })}
              </a>
              <p className="nl-act__note">{fill(t(HERO.closes), { day: t(NEXT.closes) })}</p>
            </div>
          </div>
        </section>

        <section className="nl-sec" id="nl-nights" aria-labelledby="nl-nights-title">
          <div className="nl-head">
            <h2 id="nl-nights-title">{t(NIGHTS.title)}</h2>
            <p>{t(NIGHTS.note)}</p>
          </div>
          <ol className="nl-nights">
            {RACES.map((item) => {
              const done = item.n === 1;
              const on = item.n === raceN;
              const left = leftOf(item);
              return (
                <li key={item.n} className={`nl-night${done ? ' is-done' : ''}${on ? ' is-on' : ''}`}>
                  <div className="nl-night__n">{fill(t(NIGHTS.race), { n: item.n })}</div>
                  <div className="nl-night__date">
                    <time dateTime={item.date}>{t(item.short)}</time>
                  </div>
                  {done ? (
                    <p className="nl-night__state">{t(NIGHTS.done)}</p>
                  ) : (
                    <div className="nl-night__state">
                      <p className="nl-night__left">
                        {place(fill(t(NIGHTS.left), { capacity: count.format(CAPACITY), left: '{left}' }), 'left', <b>{count.format(left)}</b>)}
                      </p>
                      <span className="nl-cap" aria-hidden="true" style={{ '--nl-taken': `${((CAPACITY - left) / CAPACITY) * 100}%` } as CSSProperties}>
                        <i />
                      </span>
                      {item.note ? <p className="nl-night__note">{t(item.note)}</p> : null}
                    </div>
                  )}
                  {done ? (
                    <a className="nl-night__go" href="#nl-results">
                      {t(NIGHTS.seeResults)}
                      <span className="nl-sr">{t(NIGHTS.ofRace)}</span>
                    </a>
                  ) : (
                    <button className="nl-night__go" type="button" aria-pressed={on} onClick={() => choose(item.n as OpenRace)}>
                      {t(on ? NIGHTS.chosen : NIGHTS.choose)}
                      <span className="nl-sr">{fill(t(NIGHTS.which), { n: item.n, date: t(item.long) })}</span>
                    </button>
                  )}
                </li>
              );
            })}
          </ol>
          <p className="nl-sr" role="status">{nightNews}</p>
        </section>

        <section className="nl-sec" id="nl-route" aria-labelledby="nl-route-title">
          <div className="nl-head">
            <h2 id="nl-route-title">{t(ROUTE.title)}</h2>
            <p>{t(ROUTE.note)}</p>
          </div>
          <div className="nl-profile" aria-hidden="true">
            <div className="nl-plot">
              <span className="nl-plot__grid" />
              <span className="nl-plot__fill" style={{ clipPath: PROFILE_FILL }} />
              <svg viewBox="0 0 1000 100" preserveAspectRatio="none" focusable="false">
                <polyline points={PROFILE_LINE} />
              </svg>
              <span className="nl-plot__y nl-plot__y--top">20 m</span>
              <span className="nl-plot__y nl-plot__y--base">0 m</span>
              {PEAKS.map((peak, index) => (
                <span key={peak.name} className={`nl-peak${index === 0 ? ' nl-peak--first' : ''}`} style={{ '--nl-x': `${peak.x}%`, '--nl-y': `${peak.y}%` } as CSSProperties}>
                  {peak.name}
                  <span>{peak.km}</span>
                </span>
              ))}
            </div>
            <div className="nl-axis">
              {KM_TICKS.map((km) => (
                <span key={km} className="nl-axis__km" style={{ '--nl-k': km } as CSSProperties}>
                  {km === 0 || km === 10 ? `${km} km` : km}
                </span>
              ))}
              {CHECKPOINTS.map((point) => (
                <i key={point.km} className={`nl-axis__cp${point.water ? ' is-water' : ''}`} style={{ '--nl-k': Number(point.km) } as CSSProperties} />
              ))}
            </div>
          </div>
          <p className="nl-key" aria-hidden="true">
            <span>{t(ROUTE.checkpoint)}</span>
            <span className="is-water">{t(ROUTE.water)}</span>
          </p>
          <ol className="nl-cps" aria-label={t(ROUTE.list)}>
            {CHECKPOINTS.map((point) => (
              <li key={point.km} className={point.water ? 'is-water' : undefined}>
                <span className="nl-cps__km">{point.km}<span className="nl-sr"> km</span></span>
                <div>
                  <b>
                    {t(point.name)}
                    {point.water ? <span className="nl-sr">{t(ROUTE.waterHere)}</span> : null}
                  </b>
                  <p>{t(point.note)}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="nl-sec nl-entry" id="nl-enter" aria-labelledby="nl-enter-title">
          <div className="nl-fee">
            <h2 id="nl-enter-title">{fill(t(ENTRY.title), { n: raceN })}</h2>
            <p className="nl-price">
              <b><span className="nl-cur">€</span>{PRICE.one}</b>
              <span>{t(ENTRY.forOne)}</span>
            </p>
            <p className="nl-price__alt">{t(ENTRY.alt)}</p>
            <ul className="nl-incl" aria-label={t(ENTRY.includes)}>
              {INCLUDED.map((item) => (
                <li key={item.name.en}>
                  <b>{t(item.name)}</b>
                  <span>{t(item.note)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="nl-entry__side">
            {entry ? (
              <div className="nl-done" ref={doneRef} tabIndex={-1} aria-labelledby="nl-done-title">
                <p className="nl-done__title" id="nl-done-title">
                  {entry.pass === 'three'
                    ? fill(t(ENTRY.doneThree), { name: entry.name })
                    : fill(t(ENTRY.doneOne), { name: entry.name, n: entry.race, date: t(raceOf(entry.race).long) })}
                </p>
                <p className="nl-done__body">
                  {fill(t(ENTRY.doneBody), { pen: entry.pen, price: PRICE[entry.pass], email: entry.email })}
                </p>
                <button className="nl-btn nl-btn--ink" type="button" onClick={again}>{t(ENTRY.again)}</button>
              </div>
            ) : (
              <form className="nl-form" ref={formRef} noValidate onSubmit={enter} aria-labelledby="nl-enter-title">
                <fieldset className="nl-pick">
                  <legend>{t(ENTRY.pass)}</legend>
                  <div className="nl-opts">
                    {(['one', 'three'] as const).map((id) => (
                      <label key={id} className={`nl-opt${pass === id ? ' is-on' : ''}`}>
                        <input className="nl-opt__input" type="radio" name="nl-pass" value={id} checked={pass === id} onChange={() => setPass(id)} />
                        <b>{t(id === 'one' ? ENTRY.one : ENTRY.three)}</b>
                        <span>{t(id === 'one' ? race.day : ENTRY.threeDates)}</span>
                        <em><span className="nl-cur">€</span>{PRICE[id]}</em>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className={`nl-pens${errors.pen ? ' is-invalid' : ''}`} aria-describedby={errors.pen ? 'nl-pen-error' : undefined}>
                  <legend>{t(ENTRY.pen)}</legend>
                  <div className="nl-opts nl-opts--4">
                    {PENS.map((item, index) => (
                      <label key={item.id} className={`nl-opt${pen === item.id ? ' is-on' : ''}`}>
                        <input
                          className="nl-opt__input"
                          ref={index === 0 ? penRef : undefined}
                          type="radio"
                          name="nl-pen"
                          value={item.id}
                          checked={pen === item.id}
                          required
                          onChange={() => {
                            setPen(item.id);
                            if (errors.pen) setErrors({ ...errors, pen: false });
                          }}
                        />
                        <strong>{item.id}</strong>
                        <span>{t(item.range)}</span>
                      </label>
                    ))}
                  </div>
                  {errors.pen ? <p className="nl-error" id="nl-pen-error" role="alert">{t(ENTRY.penError)}</p> : null}
                </fieldset>

                <div className="nl-fields">
                  <div className={`nl-field${errors.name ? ' is-invalid' : ''}`}>
                    <label htmlFor="nl-name">{t(ENTRY.name)}</label>
                    <input
                      id="nl-name"
                      ref={nameRef}
                      type="text"
                      autoComplete="name"
                      required
                      value={runner.name}
                      aria-invalid={errors.name || undefined}
                      aria-describedby={errors.name ? 'nl-name-error' : undefined}
                      onChange={(event) => {
                        setRunner({ ...runner, name: event.target.value });
                        if (errors.name) setErrors({ ...errors, name: false });
                      }}
                    />
                    {errors.name ? <p className="nl-error" id="nl-name-error" role="alert">{t(ENTRY.nameError)}</p> : null}
                  </div>
                  <div className={`nl-field${errors.email ? ' is-invalid' : ''}`}>
                    <label htmlFor="nl-email">{t(ENTRY.email)}</label>
                    <input
                      id="nl-email"
                      ref={emailRef}
                      type="email"
                      autoComplete="email"
                      required
                      value={runner.email}
                      aria-invalid={errors.email || undefined}
                      aria-describedby={errors.email ? 'nl-email-error' : undefined}
                      onChange={(event) => {
                        setRunner({ ...runner, email: event.target.value });
                        if (errors.email) setErrors({ ...errors, email: false });
                      }}
                    />
                    {errors.email ? <p className="nl-error" id="nl-email-error" role="alert">{t(ENTRY.emailError)}</p> : null}
                  </div>
                </div>

                <button className="nl-btn nl-btn--solid nl-form__submit" type="submit">{fill(t(ENTRY.submit), { price })}</button>
                <p className="nl-fine">{fill(t(ENTRY.fine), { day: t(race.closes) })}</p>
              </form>
            )}
          </div>
        </section>

        <section className="nl-sec" id="nl-results" aria-labelledby="nl-results-title">
          <div className="nl-head">
            <h2 id="nl-results-title">{t(RESULTS.title)}</h2>
            <p>{t(RESULTS.note)}</p>
          </div>
          <div className="nl-tools">
            <div className="nl-tabs" role="tablist" aria-label={t(RESULTS.tabs)} onKeyDown={onTabKey}>
              {LIST_IDS.map((id, index) => (
                <button
                  key={id}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  className="nl-tab"
                  type="button"
                  role="tab"
                  id={`nl-tab-${id}`}
                  aria-selected={id === list}
                  aria-controls="nl-list"
                  tabIndex={id === list ? 0 : -1}
                  onClick={() => showList(index, false)}
                >
                  {t(RESULTS[id])}
                </button>
              ))}
            </div>
            <div className="nl-find">
              <label htmlFor="nl-find">{t(RESULTS.find)}</label>
              <input
                id="nl-find"
                ref={findRef}
                type="search"
                autoComplete="off"
                spellCheck={false}
                placeholder={t(RESULTS.placeholder)}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  announceMatches(event.target.value, list, 700);
                }}
              />
            </div>
          </div>

          <div id="nl-list" role="tabpanel" aria-labelledby={`nl-tab-${list}`}>
            {rows.length > 0 ? (
              <table className="nl-res" role="table">
                <caption className="nl-sr">{t(CAPTIONS[list])}</caption>
                <thead role="rowgroup">
                  <tr role="row">
                    <th role="columnheader" scope="col">{t(RESULTS.place)}</th>
                    <th role="columnheader" scope="col" className="nl-res__bib">{t(RESULTS.bib)}</th>
                    <th role="columnheader" scope="col">{t(RESULTS.runner)}</th>
                    <th role="columnheader" scope="col" className="nl-res__split">{t(RESULTS.split)}</th>
                    <th role="columnheader" scope="col" className="nl-res__time">{t(RESULTS.time)}</th>
                    <th role="columnheader" scope="col" className="nl-res__gap">{t(RESULTS.behind)}</th>
                  </tr>
                </thead>
                <tbody role="rowgroup">
                  {rows.map((row) => (
                    <tr key={row.bib} role="row" className={row.place === 1 ? 'is-first' : undefined}>
                      <td role="cell" className="nl-res__pos">
                        <span>{row.place}</span>
                      </td>
                      <td role="cell" className="nl-res__bib" data-label={t(RESULTS.bib)}>{row.bib}</td>
                      <th role="rowheader" scope="row" className="nl-res__who">
                        <b>{row.name}</b>
                        <span>
                          {row.club ?? t(RESULTS.noClub)}, {fill(t(row.sex === 'w' ? RESULTS.women_ : RESULTS.men_), { from: row.ages[0], to: row.ages[1] })}
                        </span>
                      </th>
                      <td role="cell" className="nl-res__split" data-label={t(RESULTS.split)}>{row.split}</td>
                      <td role="cell" className="nl-res__time">{row.time}</td>
                      <td role="cell" className="nl-res__gap" data-label={t(RESULTS.behind)}>{row.behind ?? ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="nl-empty">
                <p className="nl-empty__title">{fill(t(EMPTY[list]), { q: query.trim() })}</p>
                <p>{t(RESULTS.emptyHelp)}</p>
                <button className="nl-btn" type="button" onClick={clearSearch}>{t(RESULTS.clear)}</button>
              </div>
            )}
          </div>
          <p className="nl-more">{t(RESULTS.more)}</p>
          <p className="nl-sr" role="status">{resultNews}</p>
        </section>

        <footer className="nl-foot">
          <div className="nl-foot__cols">
            <p><b>{SERIES} 10K</b>{t(FOOT.organiser)}</p>
            <p><b>{t(FOOT.closures)}</b>{t(FOOT.closuresBody)}</p>
            <p><b>{t(FOOT.questions)}</b>{t(FOOT.questionsBody)}</p>
          </div>
          <div className="nl-band" aria-hidden="true">
            <div className="nl-ht">
              <div className="nl-ht__ink"><span className="nl-ht__dots" /><span className="nl-ht__tone" /></div>
            </div>
          </div>
        </footer>
      </div>
    </FusionShell>
  );
}
