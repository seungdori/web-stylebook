import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedMeshGradientPage.css';

// The page of a one-day design conference in the Mesh Gradient style. The soft
// colour field lives on one printed poster; everything around it is white, ink
// and ruled lines. Funnel Display sets everything large, Funnel Sans the text.
// Components come from the conference: the poster, a two-room timetable drawn
// to scale, a line-up set as one block, a ticket table, walking minutes.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;
type Place = 'main' | 'studio' | 'all';
type RoomFilter = 'all' | 'main' | 'studio';
type TicketId = 'early' | 'standard' | 'student';

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));

const euros = (amount: number) => `€${amount.toLocaleString('en-US')}`;

const EVENT = {
  name: 'Colorfield',
  year: '2027',
  title: 'Colorfield 2027',
  venue: 'Cinema São Jorge',
  barLabel: { en: 'Colorfield 2027', ko: 'Colorfield 2027', ja: 'Colorfield 2027' },
  lede: {
    en: 'One day of talks in Lisbon on Friday 14 May 2027, by people who make maps, signs, forms, apps and printed matter. Twelve talks in two rooms of Cinema São Jorge, lunch on the terrace, and a party in the foyer after the last one.',
    ko: '2027년 5월 14일 금요일, 리스본에서 열리는 하루 강연입니다. 지도, 표지판, 양식, 앱, 인쇄물을 만드는 사람들이 연사로 나섭니다. Cinema São Jorge의 두 방에서 강연 12개가 열리고, 점심은 테라스에서, 마지막 강연 뒤에는 로비에서 파티가 열립니다.',
    ja: '2027年5月14日(金)、リスボンで行う一日の講演です。地図、サイン、フォーム、アプリ、印刷物をつくる人たちが登壇します。Cinema São Jorgeの2つの会場で講演が12件あり、昼食はテラスで、最後の講演のあとはロビーでパーティーがあります。',
  },
  buy: { en: 'Buy a ticket', ko: '티켓 구매', ja: 'チケットを購入' },
  buyNote: {
    en: 'Early tickets cost €190 until 28 February, then €260. Students pay €80.',
    ko: '얼리버드 티켓은 2월 28일까지 €190, 이후 €260입니다. 학생은 €80입니다.',
    ja: '早割チケットは2月28日まで€190、その後は€260です。学生は€80です。',
  },
} as const;

const NAV: Array<{ href: string; label: Tri; keep?: boolean }> = [
  { href: '#cf-programme', label: { en: 'Programme', ko: '프로그램', ja: 'プログラム' } },
  { href: '#cf-speakers', label: { en: 'Speakers', ko: '연사', ja: '登壇者' } },
  { href: '#cf-tickets', label: { en: 'Tickets', ko: '티켓', ja: 'チケット' }, keep: true },
  { href: '#cf-travel', label: { en: 'Getting there', ko: '오시는 길', ja: 'アクセス' } },
];

// The poster is a picture of a print. Everything it says is in its label and in
// real text further down the page.
const POSTER = {
  label: {
    en: 'Poster for Colorfield: one day of talks on 14 May 2027 in Lisbon, at Cinema São Jorge, Avenida da Liberdade 175. Doors 08:45, talks 09:30 to 17:45, party in the foyer from 18:00.',
    ko: 'Colorfield 포스터: 2027년 5월 14일 리스본 Cinema São Jorge(Avenida da Liberdade 175)에서 열리는 하루 강연. 입장 08:45, 강연 09:30~17:45, 18:00부터 로비 파티.',
    ja: 'Colorfieldのポスター：2027年5月14日、リスボンのCinema São Jorge(Avenida da Liberdade 175)で行う一日の講演。入場08:45、講演09:30〜17:45、18:00からロビーでパーティー。',
  },
  kind: { en: 'One day of talks', ko: '하루 강연', ja: '一日の講演' },
  day: '14',
  monthYear: { en: 'May 2027', ko: '2027년 5월', ja: '2027年5月' },
  city: { en: 'Lisbon', ko: 'Lisbon', ja: 'Lisbon' },
  hall: ['Cinema', 'São Jorge'],
  address: 'Avenida da Liberdade 175',
  times: [
    { en: 'Doors 08:45', ko: '입장 08:45', ja: '開場 08:45' },
    { en: 'Talks 09:30–17:45', ko: '강연 09:30–17:45', ja: '講演 09:30–17:45' },
  ],
  party: [
    { en: 'Party in the foyer', ko: '로비에서 파티', ja: 'ロビーでパーティー' },
    { en: 'from 18:00', ko: '18:00부터', ja: '18:00から' },
  ],
};

const PROGRAMME = {
  title: { en: 'Programme', ko: '프로그램', ja: 'プログラム' },
  note: {
    en: 'Friday 14 May 2027. Talks in the Main hall run 45 minutes and talks in Studio 2 run 40. Both rooms stop together for lunch and coffee. On the day this timetable follows the clock; here it is set to 11:10.',
    ko: '2027년 5월 14일 금요일. 메인 홀 강연은 45분, 스튜디오 2 강연은 40분 동안 진행합니다. 점심과 커피 시간에는 두 방이 함께 쉽니다. 행사 당일에는 이 시간표가 실제 시각을 따르며, 여기서는 11:10으로 맞춰 두었습니다.',
    ja: '2027年5月14日(金)。メインホールの講演は45分、スタジオ2の講演は40分です。昼食とコーヒーの時間は、両方の会場がそろって休憩します。当日はこの時間割が実際の時刻に従います。ここでは11:10に設定しています。',
  },
  filterLegend: { en: 'Show talks in', ko: '강연 보기', ja: '表示する会場' },
  filter: {
    all: { en: 'Both rooms', ko: '두 방 모두', ja: '両方の会場' },
    main: { en: 'Main hall', ko: '메인 홀', ja: 'メインホール' },
    studio: { en: 'Studio 2', ko: '스튜디오 2', ja: 'スタジオ2' },
  } as Record<RoomFilter, Tri>,
  status: {
    all: { en: 'Showing all 12 talks in both rooms.', ko: '두 방의 강연 12개를 모두 보여 줍니다.', ja: '両方の会場の講演12件をすべて表示しています。' },
    main: { en: 'Showing the 7 talks in the Main hall, with the breaks.', ko: '메인 홀의 강연 7개와 휴식 시간을 보여 줍니다.', ja: 'メインホールの講演7件と休憩を表示しています。' },
    studio: { en: 'Showing the 5 talks in Studio 2, with the breaks.', ko: '스튜디오 2의 강연 5개와 휴식 시간을 보여 줍니다.', ja: 'スタジオ2の講演5件と休憩を表示しています。' },
  } as Record<RoomFilter, Tri>,
  // The page sells tickets months ahead, so the marked talk is what the timetable shows at 11:10 on the day, not now.
  now: { en: 'At 11:10, 20 min left', ko: '11:10 기준, 20분 남음', ja: '11:10時点で残り20分' },
  nowTime: '11:10',
};

const ROOMS = {
  main: {
    name: { en: 'Main hall', ko: '메인 홀', ja: 'メインホール' },
    seats: { en: '820 seats, Portuguese captions', ko: '좌석 820석, 포르투갈어 자막', ja: '座席820席、ポルトガル語字幕' },
  },
  studio: {
    name: { en: 'Studio 2', ko: '스튜디오 2', ja: 'スタジオ2' },
    seats: { en: '150 seats', ko: '좌석 150석', ja: '座席150席' },
  },
};

interface Slot {
  id: string;
  start: string;
  end: string;
  place: Place;
  kind: 'talk' | 'plenary' | 'break' | 'party';
  // Items that run across both rooms say where they happen.
  where?: Tri;
  title: Tri;
  who?: Tri;
  now?: boolean;
}

// In order of start time, so the list reads in the order the day runs.
const SLOTS: Slot[] = [
  {
    id: 'welcome', start: '09:30', end: '09:45', place: 'all', kind: 'plenary',
    where: ROOMS.main.name,
    title: { en: 'Welcome', ko: '환영 인사', ja: '開会の挨拶' },
    who: { en: 'Inês Taveira and Rui Pacheco', ko: 'Inês Taveira and Rui Pacheco', ja: 'Inês Taveira and Rui Pacheco' },
  },
  {
    id: 'metro', start: '09:45', end: '10:30', place: 'main', kind: 'talk',
    title: { en: 'Redrawing the metro map before the new line opens', ko: '새 노선이 열리기 전에 지하철 노선도 다시 그리기', ja: '新線の開業前に路線図を描き直す' },
    who: { en: 'Marta Guerreiro, cartographer, Lisbon', ko: 'Marta Guerreiro, 지도 제작자, Lisbon', ja: 'Marta Guerreiro、地図製作者、Lisbon' },
  },
  {
    id: 'tax', start: '10:00', end: '10:40', place: 'studio', kind: 'talk',
    title: { en: 'A tax form people finish on the first try', ko: '사람들이 한 번에 끝내는 세금 신고서', ja: '一度で書き上げられる税務書類' },
    who: { en: 'Ewa Kowalczyk, interaction lead, Kraków', ko: 'Ewa Kowalczyk, 인터랙션 리드, Kraków', ja: 'Ewa Kowalczyk、インタラクションリード、Kraków' },
  },
  {
    id: 'hospital', start: '10:45', end: '11:30', place: 'main', kind: 'talk', now: true,
    title: { en: 'Signs for a hospital with 38 entrances', ko: '출입구가 38곳인 병원의 안내 표지판', ja: '出入口が38か所ある病院のサイン' },
    who: { en: 'Kwame Asante, wayfinding lead, London', ko: 'Kwame Asante, 길 찾기 리드, London', ja: 'Kwame Asante、ウェイファインディングリード、London' },
  },
  {
    id: 'clinic', start: '11:20', end: '12:00', place: 'studio', kind: 'talk',
    title: { en: 'Notes from sixty clinic waiting rooms', ko: '60곳의 진료소 대기실에서 얻은 기록', ja: '60か所の診療所の待合室で集めた記録' },
    who: { en: 'Thandiwe Mokoena, field researcher, Cape Town', ko: 'Thandiwe Mokoena, 현장 연구원, Cape Town', ja: 'Thandiwe Mokoena、現地調査員、Cape Town' },
  },
  {
    id: 'machine', start: '11:45', end: '12:30', place: 'main', kind: 'talk',
    title: { en: 'Eleven prototypes of one ticket machine', ko: '발권기 하나의 시제품 11종', ja: '一台の券売機の試作品11種' },
    who: { en: 'Sofie Lindgren and Jonas Berg, Stockholm', ko: 'Sofie Lindgren and Jonas Berg, Stockholm', ja: 'Sofie Lindgren and Jonas Berg, Stockholm' },
  },
  {
    id: 'lunch', start: '12:30', end: '13:45', place: 'all', kind: 'break',
    where: { en: 'Terrace', ko: '테라스', ja: 'テラス' },
    title: { en: 'Lunch', ko: '점심', ja: '昼食' },
    who: {
      en: 'Grilled fish, a vegetable stew, and pastéis de nata from the bakery across the avenue.',
      ko: '생선구이, 채소 스튜, 대로 건너편 빵집의 pastéis de nata.',
      ja: '魚のグリル、野菜のシチュー、大通りの向かいのパン屋の pastéis de nata。',
    },
  },
  {
    id: 'ballots', start: '13:45', end: '14:30', place: 'main', kind: 'talk',
    title: { en: 'Printing 40,000 ballots that nobody misreads', ko: '아무도 잘못 읽지 않는 투표용지 40,000장 인쇄', ja: '誰も読み違えない投票用紙4万枚の印刷' },
    who: { en: 'Amara Nwosu, print production manager, Lagos', ko: 'Amara Nwosu, 인쇄 제작 책임자, Lagos', ja: 'Amara Nwosu、印刷制作マネージャー、Lagos' },
  },
  {
    id: 'bicycles', start: '14:00', end: '14:40', place: 'studio', kind: 'talk',
    title: { en: 'Finding a free space among 12,500 bicycles', ko: '자전거 12,500대 사이에서 빈자리 찾기', ja: '12,500台の自転車の中で空きスペースを探す' },
    who: { en: 'Lars de Wit and Noor Haddad, Utrecht', ko: 'Lars de Wit and Noor Haddad, Utrecht', ja: 'Lars de Wit and Noor Haddad, Utrecht' },
  },
  {
    id: 'news', start: '14:45', end: '15:30', place: 'main', kind: 'talk',
    title: { en: 'What we took out of a news app with two million readers', ko: '독자 200만 명의 뉴스 앱에서 덜어낸 것들', ja: '読者200万人のニュースアプリから取り除いたもの' },
    who: { en: 'Rita Calado, product lead, Porto', ko: 'Rita Calado, 프로덕트 리드, Porto', ja: 'Rita Calado、プロダクトリード、Porto' },
  },
  {
    id: 'captions', start: '14:50', end: '15:30', place: 'studio', kind: 'talk',
    title: { en: 'Live captions for a football match', ko: '축구 경기의 실시간 자막', ja: 'サッカーの試合のライブ字幕' },
    who: { en: 'Sébastien Roy, broadcast editor, Montréal', ko: 'Sébastien Roy, 방송 편집자, Montréal', ja: 'Sébastien Roy、放送編集者、Montréal' },
  },
  {
    id: 'coffee', start: '15:30', end: '16:00', place: 'all', kind: 'break',
    where: { en: 'Foyer', ko: '로비', ja: 'ロビー' },
    title: { en: 'Coffee', ko: '커피', ja: 'コーヒー' },
  },
  {
    id: 'shopfronts', start: '16:00', end: '16:45', place: 'main', kind: 'talk',
    title: { en: 'Painting every shop front on one street in a week', ko: '일주일 동안 한 거리의 가게 간판을 모두 그리기', ja: '一週間で一本の通りの店先をすべて描く' },
    who: { en: 'Daniela Ochoa, sign painter, Mexico City', ko: 'Daniela Ochoa, 간판 화가, Mexico City', ja: 'Daniela Ochoa、看板絵師、Mexico City' },
  },
  {
    id: 'labels', start: '16:10', end: '16:50', place: 'studio', kind: 'talk',
    title: { en: 'Writing labels for 2,000 museum objects', ko: '박물관 소장품 2,000점의 설명문 쓰기', ja: '博物館の収蔵品2,000点のキャプションを書く' },
    who: { en: 'Min-ji Seo, exhibition writer, Seoul', ko: 'Min-ji Seo, 전시 글 작가, Seoul', ja: 'Min-ji Seo、展示文ライター、Seoul' },
  },
  {
    id: 'programmes', start: '17:00', end: '17:45', place: 'main', kind: 'talk',
    title: { en: 'Seventy-seven years of programmes printed for this cinema', ko: '이 극장을 위해 인쇄해 온 77년의 상영 안내지', ja: 'この映画館のために印刷されてきた77年分の上映プログラム' },
    who: { en: 'Luísa Mendonça, archivist, Lisbon', ko: 'Luísa Mendonça, 기록 보관 담당자, Lisbon', ja: 'Luísa Mendonça、アーキビスト、Lisbon' },
  },
  {
    id: 'party', start: '18:00', end: '23:00', place: 'all', kind: 'party',
    where: { en: 'Foyer', ko: '로비', ja: 'ロビー' },
    title: { en: 'Closing party', ko: '폐막 파티', ja: 'クロージングパーティー' },
    who: { en: 'Your badge gets you in. The bar stays open until 23:00.', ko: '배지가 있으면 입장할 수 있습니다. 바는 23:00까지 엽니다.', ja: 'バッジがあれば入場できます。バーは23:00まで営業します。' },
  },
];

// The time axis: one grid row is five minutes, at a fixed height, so every
// block is exactly as tall as it lasts. Row 1 holds the room names.
const AXIS_START = 9 * 60 + 30;
const AXIS_END = 18 * 60 + 30;
const minutesOf = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};
const rowOf = (time: number) => 2 + (Math.min(time, AXIS_END) - AXIS_START) / 5;
const AXIS_MARKS = Array.from({ length: (18 * 60 - AXIS_START) / 30 + 1 }, (_, index) => {
  const time = AXIS_START + index * 30;
  const label = `${String(Math.floor(time / 60)).padStart(2, '0')}:${String(time % 60).padStart(2, '0')}`;
  return { time, label, row: rowOf(time), hour: time % 60 === 0, head: index === 0 };
});

const SPEAKERS_COPY = {
  title: { en: 'Speakers', ko: '연사', ja: '登壇者' },
  note: {
    en: 'Fourteen people from eleven cities, in order of surname. Every talk is in English.',
    ko: '11개 도시에서 온 14명을 성(姓) 순서로 실었습니다. 모든 강연은 영어로 진행합니다.',
    ja: '11都市から集まった14名を姓の順に掲載しています。すべての講演は英語で行います。',
  },
};

const SPEAKERS: Array<{ name: string; role: Tri; city: Tri }> = [
  { name: 'Kwame Asante', role: { en: 'Wayfinding lead', ko: '길 찾기 리드', ja: 'ウェイファインディングリード' }, city: { en: 'London', ko: 'London', ja: 'London' } },
  { name: 'Jonas Berg', role: { en: 'Hardware engineer', ko: '하드웨어 엔지니어', ja: 'ハードウェアエンジニア' }, city: { en: 'Stockholm', ko: 'Stockholm', ja: 'Stockholm' } },
  { name: 'Rita Calado', role: { en: 'Product lead', ko: '프로덕트 리드', ja: 'プロダクトリード' }, city: { en: 'Porto', ko: 'Porto', ja: 'Porto' } },
  { name: 'Marta Guerreiro', role: { en: 'Cartographer', ko: '지도 제작자', ja: '地図製作者' }, city: { en: 'Lisbon', ko: 'Lisbon', ja: 'Lisbon' } },
  { name: 'Noor Haddad', role: { en: 'Urban researcher', ko: '도시 연구원', ja: '都市研究者' }, city: { en: 'Utrecht', ko: 'Utrecht', ja: 'Utrecht' } },
  { name: 'Ewa Kowalczyk', role: { en: 'Interaction lead', ko: '인터랙션 리드', ja: 'インタラクションリード' }, city: { en: 'Kraków', ko: 'Kraków', ja: 'Kraków' } },
  { name: 'Sofie Lindgren', role: { en: 'Product manager', ko: '프로덕트 매니저', ja: 'プロダクトマネージャー' }, city: { en: 'Stockholm', ko: 'Stockholm', ja: 'Stockholm' } },
  { name: 'Luísa Mendonça', role: { en: 'Archivist', ko: '기록 보관 담당자', ja: 'アーキビスト' }, city: { en: 'Lisbon', ko: 'Lisbon', ja: 'Lisbon' } },
  { name: 'Thandiwe Mokoena', role: { en: 'Field researcher', ko: '현장 연구원', ja: 'フィールドリサーチャー' }, city: { en: 'Cape Town', ko: 'Cape Town', ja: 'Cape Town' } },
  { name: 'Amara Nwosu', role: { en: 'Print production manager', ko: '인쇄 제작 책임자', ja: '印刷制作マネージャー' }, city: { en: 'Lagos', ko: 'Lagos', ja: 'Lagos' } },
  { name: 'Daniela Ochoa', role: { en: 'Sign painter', ko: '간판 화가', ja: '看板絵師' }, city: { en: 'Mexico City', ko: 'Mexico City', ja: 'Mexico City' } },
  { name: 'Sébastien Roy', role: { en: 'Broadcast editor', ko: '방송 편집자', ja: '放送編集者' }, city: { en: 'Montréal', ko: 'Montréal', ja: 'Montréal' } },
  { name: 'Min-ji Seo', role: { en: 'Exhibition writer', ko: '전시 글 작가', ja: '展示文ライター' }, city: { en: 'Seoul', ko: 'Seoul', ja: 'Seoul' } },
  { name: 'Lars de Wit', role: { en: 'Software engineer', ko: '소프트웨어 엔지니어', ja: 'ソフトウェアエンジニア' }, city: { en: 'Utrecht', ko: 'Utrecht', ja: 'Utrecht' } },
];

const TICKETS_COPY = {
  title: { en: 'Tickets', ko: '티켓', ja: 'チケット' },
  note: {
    en: 'Every ticket covers the whole day in both rooms. Prices include 23% VAT.',
    ko: '모든 티켓은 두 방의 하루 전체 일정에 적용됩니다. 가격에는 23% 부가세가 포함되어 있습니다.',
    ja: 'すべてのチケットで、両方の会場の一日分の講演をご覧いただけます。価格には23%の付加価値税が含まれています。',
  },
  legend: { en: 'Ticket type', ko: '티켓 종류', ja: 'チケットの種類' },
  corner: { en: 'What is included', ko: '포함 내용', ja: '含まれるもの' },
  price: { en: 'Price', ko: '가격', ja: '価格' },
  until: { en: 'On sale until', ko: '판매 기간', ja: '販売期間' },
  yes: { en: 'Included', ko: '포함', ja: '含む' },
  no: { en: 'Not included', ko: '미포함', ja: '含まない' },
  quantity: { en: 'Tickets', ko: '매수', ja: '枚数' },
  email: { en: 'Email for the tickets', ko: '티켓을 받을 이메일', ja: 'チケットの送付先メールアドレス' },
  errorEmpty: {
    en: 'Enter the email address the tickets should go to.',
    ko: '티켓을 받을 이메일 주소를 입력해야 합니다.',
    ja: 'チケットの送付先メールアドレスを入力してください。',
  },
  errorInvalid: {
    en: 'Check the email address. It needs an @ and a domain.',
    ko: '이메일 주소를 확인해야 합니다. @ 기호와 도메인이 필요합니다.',
    ja: 'メールアドレスを確認してください。@とドメイン名が必要です。',
  },
  done: {
    en: 'Held for you for 30 minutes: {summary}. The payment link is on its way to {email}.',
    ko: '{summary}, 30분 동안 예약되었습니다. 결제 링크를 {email} 주소로 보내고 있습니다.',
    ja: '{summary}、30分間お取り置きしています。お支払いリンクを {email} 宛に送信しています。',
  },
  again: { en: 'Start a new order', ko: '새로 주문하기', ja: '新しく注文する' },
};

interface Ticket {
  id: TicketId;
  price: number;
  name: Tri;
  stock: Tri;
  until: Tri;
  note: Tri;
  sumOne: Tri;
  sumMany: Tri;
  buyOne: Tri;
  buyMany: Tri;
}

const TICKETS: Ticket[] = [
  {
    id: 'early', price: 190,
    name: { en: 'Early', ko: '얼리버드', ja: '早割' },
    stock: { en: '74 of 300 left', ko: '300장 중 74장 남음', ja: '300枚中残り74枚' },
    until: { en: '28 February', ko: '2월 28일', ja: '2月28日' },
    note: { en: '74 of 300 left. On sale until 28 February.', ko: '300장 중 74장 남음. 2월 28일까지 판매합니다.', ja: '300枚中残り74枚。2月28日まで販売します。' },
    sumOne: { en: 'One early ticket, {total}', ko: '얼리버드 1장, {total}', ja: '早割 1枚、{total}' },
    sumMany: { en: '{count} early tickets, {total}', ko: '얼리버드 {count}장, {total}', ja: '早割 {count}枚、{total}' },
    buyOne: { en: 'Buy an early ticket', ko: '얼리버드 티켓 구매', ja: '早割チケットを購入' },
    buyMany: { en: 'Buy {count} early tickets', ko: '얼리버드 {count}장 구매', ja: '早割チケット{count}枚を購入' },
  },
  {
    id: 'standard', price: 260,
    name: { en: 'Standard', ko: '스탠다드', ja: 'スタンダード' },
    stock: { en: 'Refundable', ko: '환불 가능', ja: '払い戻し可能' },
    until: { en: '13 May', ko: '5월 13일', ja: '5月13日' },
    note: { en: 'Full refund until 14 April. On sale until 13 May.', ko: '4월 14일까지 전액 환불 가능. 5월 13일까지 판매합니다.', ja: '4月14日まで全額払い戻し可能。5月13日まで販売します。' },
    sumOne: { en: 'One standard ticket, {total}', ko: '스탠다드 1장, {total}', ja: 'スタンダード 1枚、{total}' },
    sumMany: { en: '{count} standard tickets, {total}', ko: '스탠다드 {count}장, {total}', ja: 'スタンダード {count}枚、{total}' },
    buyOne: { en: 'Buy a standard ticket', ko: '스탠다드 티켓 구매', ja: 'スタンダードチケットを購入' },
    buyMany: { en: 'Buy {count} standard tickets', ko: '스탠다드 {count}장 구매', ja: 'スタンダードチケット{count}枚を購入' },
  },
  {
    id: 'student', price: 80,
    name: { en: 'Student', ko: '학생', ja: '学生' },
    stock: { en: '18 of 60 left', ko: '60장 중 18장 남음', ja: '60枚中残り18枚' },
    until: { en: '13 May', ko: '5월 13일', ja: '5月13日' },
    note: { en: '18 of 60 left. Bring a student card to the door.', ko: '60장 중 18장 남음. 입장 시 학생증을 가져오세요.', ja: '60枚中残り18枚。入場時に学生証をご持参ください。' },
    sumOne: { en: 'One student ticket, {total}', ko: '학생 1장, {total}', ja: '学生 1枚、{total}' },
    sumMany: { en: '{count} student tickets, {total}', ko: '학생 {count}장, {total}', ja: '学生 {count}枚、{total}' },
    buyOne: { en: 'Buy a student ticket', ko: '학생 티켓 구매', ja: '学生チケットを購入' },
    buyMany: { en: 'Buy {count} student tickets', ko: '학생 {count}장 구매', ja: '学生チケット{count}枚を購入' },
  },
];

const INCLUDES: Array<{ label: Tri; has: Record<TicketId, boolean> }> = [
  { label: { en: 'All twelve talks', ko: '강연 12개 전체', ja: '講演12件すべて' }, has: { early: true, standard: true, student: true } },
  { label: { en: 'Lunch and coffee', ko: '점심과 커피', ja: '昼食とコーヒー' }, has: { early: true, standard: true, student: true } },
  { label: { en: 'Closing party', ko: '폐막 파티', ja: 'クロージングパーティー' }, has: { early: true, standard: true, student: true } },
  { label: { en: 'Recordings, sent on 1 June', ko: '녹화본, 6월 1일 발송', ja: '録画、6月1日に送付' }, has: { early: true, standard: true, student: false } },
  { label: { en: 'Change the name until 7 May', ko: '5월 7일까지 이름 변경', ja: '5月7日まで名義変更' }, has: { early: true, standard: true, student: false } },
  { label: { en: 'Full refund until 14 April', ko: '4월 14일까지 전액 환불', ja: '4月14日まで全額返金' }, has: { early: false, standard: true, student: false } },
];

const QUANTITIES = [1, 2, 3, 4];

const TRAVEL = {
  title: { en: 'Getting to Cinema São Jorge', ko: 'Cinema São Jorge 가는 길', ja: 'Cinema São Jorgeへのアクセス' },
  address: ['Cinema São Jorge', 'Avenida da Liberdade 175', '1250-141 Lisboa'],
  access: {
    en: 'Doors open at 08:45. The entrance on the avenue is step-free, and lifts go to both rooms.',
    ko: '08:45에 입장을 엽니다. 대로 쪽 입구에는 계단이 없고, 엘리베이터가 두 방으로 이어집니다.',
    ja: '08:45に入場を開始します。大通り側の入口には段差がなく、エレベーターで両方の会場へ行けます。',
  },
  min: { en: 'min', ko: '분', ja: '分' },
  walks: [
    {
      minutes: 2, station: 'Avenida',
      line: { en: 'Metro, blue line', ko: '지하철, 파란 노선', ja: '地下鉄、青線' },
      way: { en: 'Take the Avenida da Liberdade exit. The cinema is 150 m away.', ko: 'Avenida da Liberdade 출구로 나갑니다. 극장까지 150m입니다.', ja: 'Avenida da Liberdade 出口から出ます。映画館まで150mです。' },
    },
    {
      minutes: 9, station: 'Marquês de Pombal',
      line: { en: 'Metro, blue and yellow lines', ko: '지하철, 파란 노선과 노란 노선', ja: '地下鉄、青線と黄線' },
      way: { en: 'Walk down the avenue towards the river.', ko: '대로를 따라 강 쪽으로 걸어갑니다.', ja: '大通りを川の方向へ歩きます。' },
    },
    {
      minutes: 10, station: 'Restauradores',
      line: { en: 'Metro, blue line', ko: '지하철, 파란 노선', ja: '地下鉄、青線' },
      way: { en: 'Walk up the avenue, away from the river.', ko: '대로를 따라 강과 반대 방향으로 걸어갑니다.', ja: '大通りを川と反対の方向へ歩きます。' },
    },
    {
      minutes: 12, station: 'Rossio',
      line: { en: 'Trains from Sintra', ko: 'Sintra 방면 열차', ja: 'Sintra方面の列車' },
      way: { en: 'Cross Praça dos Restauradores and walk up the avenue.', ko: 'Praça dos Restauradores를 건너 대로를 따라 올라갑니다.', ja: 'Praça dos Restauradoresを渡り、大通りを進みます。' },
    },
  ],
  air: {
    en: 'From the airport, take the red line to São Sebastião and change to the blue line for Avenida. The ride takes about 30 minutes.',
    ko: '공항에서는 빨간 노선을 타고 São Sebastião에서 내린 뒤, 파란 노선으로 갈아타 Avenida역으로 갑니다. 약 30분 걸립니다.',
    ja: '空港からは赤線でSão Sebastiãoまで行き、青線に乗り換えてAvenida駅へ向かいます。所要時間は約30分です。',
  },
};

const FOOTER = {
  run: {
    en: 'Run by Inês Taveira and Rui Pacheco since 2020. This is the eighth Colorfield.',
    ko: 'Inês Taveira와 Rui Pacheco가 2020년부터 운영합니다. 올해는 여덟 번째 Colorfield입니다.',
    ja: '2020年からInês TaveiraとRui Pachecoが運営しています。今年は8回目のColorfieldです。',
  },
  where: 'Cinema São Jorge, Avenida da Liberdade 175, 1250-141 Lisboa',
};

const PROMPT_EN = `Design one real page in Mesh Gradient style: a white page where one printed poster carries the whole soft colour field, and everything around it is ink, white and ruled lines.

Pick a believable subject that would print a poster, such as a conference, a festival, a concert series or an exhibition, and write its real content (here: Colorfield 2027, one day of design talks in a Lisbon cinema). The page must read as that subject's page, never as a page about its own style.

COLOR TOKENS:
--bg: #ffffff
--ink: #1a1a2e
--muted: #575869
--line: rgba(26,26,46,0.3)
--line-strong: rgba(26,26,46,0.55)
--violet: #5d54f5 (state only: the talk on at the marked time, the chosen option)
--tint: rgba(108,99,255,0.09) (the chosen ticket column)
--error: #b42318 (field errors only)
Mesh, on the poster only: sky rgba(150,208,255,.95), peach rgba(255,190,160,.95), white light rgba(255,255,255,.9), violet rgba(108,99,255,.95), lilac rgba(150,140,255,.85), pink rgba(255,150,196,.95), apricot rgba(255,206,176,.95) over #ece6ff.
No other colours, apart from #2c2c4a for the button's hover and #6c6d7d for placeholder text; the hatching, the paper grain and the text on ink use the ink or white at lower opacity.

THE POSTER:
- One 4:5 printed sheet: seven radial gradients, six at the corners and edges and white light in the middle, and a fractal-noise layer at 0.32 opacity in multiply so it reads as a print, not a screen. A narrow sheet grows taller rather than cut its small print.
- Set inside it like a screen print, sized in container units so the sheet scales as a whole: the event name and "One day of talks" over a rule; the day "14" at 47cqw, weight 800, tracking -0.075em; "May 2027" at 12.5cqw; the city running up the right edge in vertical type at 23cqw; a rule; the venue at 10cqw; the small print in three short blocks.
- The poster is a picture: role="img" with a label that says everything on it, and the same facts appear in real text on the page.
- The mesh appears nowhere else.

TYPOGRAPHY:
Display: Funnel Display 600 to 800 for the poster, the title, headings, talk titles, names, prices and walking minutes
Title: Funnel Display 700, tracking -0.045em; on desktop two lines (name, year) beside the poster, line-height 0.92, up to 7.5rem and smaller on short screens so the ticket button stays on the first screen; below 1000px one line, line-height 0.94, around 3rem on phones
Section headings: Funnel Display 700, clamp(2.25rem, 4.6vw, 3.5rem), line-height 1, tracking -0.04em
Talk titles and station names: Funnel Display 600, 1.1875rem to 1.375rem, tracking -0.015em to -0.02em
Line-up names: Funnel Display 600, 1.875rem (1.75rem below 1200px), so most lines of the bill hold three names; 1.625rem in the tablet and phone list
Text: Funnel Sans 400 to 600, 1.0625rem, line-height 1.55; nothing under 1rem except the hour labels of the drawn time axis and the small print on the poster
Times use tabular figures.

LAYOUT:
- Under the site bar, the event's own bar: the name on the left, links to Programme, Speakers, Tickets and Getting there on the right (on phones only Tickets).
- Hero on desktop: the poster on the left, sized from the screen height so the whole sheet fits a 1280x720 screen; the title at the top of the right column, the lede and the ticket button at its foot, level with the poster's bottom edge. On tablet and phone the poster sits above the title.
- Programme: a real time axis, five minutes per row at a fixed height, so every block is exactly as long as it lasts; two room columns with their seat counts; hour lines solid and half hours dashed; a violet line across both rooms at one marked time, with a note that on the day the timetable follows the clock (tickets sell months ahead, so never claim it is now). Lunch, coffee, the welcome and the party span both rooms and say where they happen.
- Speakers: one centred block of names set like a festival bill, each name followed by role over city, with balanced wrapping so no line holds a single name. On tablets and phones it becomes a ruled list in surname order (two columns, then one).
- Tickets: one comparison table with a radio in each column header; the chosen column filled with ink at the top and tinted below; the order line under it.
- Getting there: the address on the left; on the right, ruled rows with the walking minutes in large figures (3rem) beside the station names.
- Max width 1120px; 128px between sections, 88px on phones.

COMPONENTS:
- Time blocks: 1px line, a 3px ink rule on the left, white fill; breaks hatched at 135 degrees; the party filled with ink; the talk on at the marked time filled with violet and saying how long is left at that time.
- Room filter, on phones only where the two rooms become one list in time order: Both rooms, Main hall, Studio 2 as three joined square segments; the chosen one filled with ink.
- Radios: 20px ink rings; the chosen one a violet dot in an ink ring.
- Included: a 12px ink square; not included: a 16px dash; each carries hidden text.
- Button: an ink rectangle, 52px tall, white text at 600. No pills, no outline buttons.
- Order form: quantity 1 to 4 and an email field, square 1px ink borders, labels above, the error under the field with role="alert". A summary line names the count, the type and the total, and the button label repeats the count and the type. On success a confirmation replaces the form and takes focus.

MOTION:
- None in the page; only the site's smooth scroll to anchors moves. The poster is a print. State changes are immediate.

FORBIDDEN:
- The mesh anywhere outside the poster, gradient text, glass panels, backdrop blur
- Cards, pills, rounded corners, drop shadows
- A timetable whose rows grow with their text: the minutes must stay to scale
- Speaker photos in circles, logo walls, a grid of speaker cards
- A small label above headings, all-caps tracked labels
- Purple-to-pink gradient buttons

OUTPUT:
1) CSS custom properties
2) Semantic HTML and CSS: the programme as a list in time order, the ticket table with real table semantics
3) Responsive down to 320px with no horizontal scroll: the timetable becomes one list with the room filter, the ticket table becomes stacked rows
4) Visible focus, labelled fields, errors next to the field, focus moved to the confirmation`;

const PROMPT_KO = `Mesh Gradient 스타일로 실제 페이지 하나를 디자인한다. 흰 페이지 위에 인쇄 포스터 한 장이 부드러운 색면 전체를 담고, 그 주변은 잉크, 흰색, 구획선으로만 이루어진다.

포스터를 찍을 법한 그럴듯한 주제를 고른다. 컨퍼런스, 페스티벌, 콘서트 시리즈, 전시처럼 실제로 있을 법한 것이면 된다. 그 주제의 실제 내용을 쓴다(여기서는 리스본 극장에서 열리는 하루짜리 디자인 강연 Colorfield 2027). 페이지는 그 주제의 페이지로 읽혀야 하며, 스타일을 설명하는 페이지로 읽히면 안 된다.

COLOR TOKENS:
--bg: #ffffff
--ink: #1a1a2e
--muted: #575869
--line: rgba(26,26,46,0.3)
--line-strong: rgba(26,26,46,0.55)
--violet: #5d54f5 (상태 표시 전용: 정해진 시각에 진행 중인 강연, 선택된 옵션)
--tint: rgba(108,99,255,0.09) (선택된 티켓 열)
--error: #b42318 (입력란 오류 전용)
메시, 포스터에만 사용: 하늘색 rgba(150,208,255,.95), 복숭아색 rgba(255,190,160,.95), 흰 빛 rgba(255,255,255,.9), 보라 rgba(108,99,255,.95), 연보라 rgba(150,140,255,.85), 분홍 rgba(255,150,196,.95), 살구색 rgba(255,206,176,.95). 바탕은 #ece6ff.
다른 색은 쓰지 않는다. 다만 버튼 호버에는 #2c2c4a, 자리표시자 텍스트에는 #6c6d7d를 쓴다. 빗금, 종이 결, 잉크 위의 텍스트는 잉크나 흰색을 낮은 불투명도로 쓴다.

THE POSTER:
- 4:5 비율의 인쇄 용지 한 장. 모서리와 가장자리에 방사형 그라디언트 일곱 개, 가운데에는 흰 빛을 둔다. 프랙탈 노이즈 레이어를 불투명도 0.32, 곱하기(multiply) 모드로 얹어 화면이 아니라 인쇄물처럼 보이게 한다. 폭이 좁은 용지는 작은 글씨를 잘라내는 대신 높이를 늘린다.
- 그 위에 실크스크린처럼 배치하고, 용지 전체가 함께 비례하도록 컨테이너 단위로 크기를 잡는다. 행사명과 “하루 강연”을 구획선 위에 놓는다. 날짜 “14”는 47cqw, 굵기 800, 자간 -0.075em. “2027년 5월”은 12.5cqw. 도시 이름은 오른쪽 가장자리를 따라 세로쓰기로 23cqw 크기로 올린다. 구획선 하나, 장소는 10cqw, 작은 글씨는 짧은 블록 세 개로 나눈다.
- 포스터는 그림으로 취급한다. role="img"를 붙이고, 포스터의 모든 내용을 담은 라벨을 단다. 같은 정보는 페이지의 실제 텍스트로도 보여 준다.
- 메시는 다른 곳에 나타나지 않는다.

TYPOGRAPHY:
Display: 포스터, 제목, 헤딩, 강연 제목, 이름, 가격, 도보 시간에는 Funnel Display 600~800.
Title: Funnel Display 700, 행간 0.92, 자간 -0.045em. 데스크톱에서는 포스터 옆에 두 줄(이름, 연도), 최대 7.5rem이며, 짧은 화면에서는 티켓 버튼이 첫 화면에 남도록 더 작게 쓴다. 1000px 미만에서는 한 줄, 행간 0.94, 휴대폰에서는 약 3rem.
Section headings: Funnel Display 700, clamp(2.25rem, 4.6vw, 3.5rem), 행간 1, 자간 -0.04em
Talk titles and station names: Funnel Display 600, 1.1875rem~1.375rem, 자간 -0.015~-0.02em
Line-up names: Funnel Display 600, 1.875rem(1200px 미만에서는 1.75rem). 대부분의 줄에 이름 세 개가 들어가도록 한다. 태블릿과 휴대폰 목록에서는 1.625rem.
Text: Funnel Sans 400~600, 1.0625rem, 행간 1.55. 그려진 시간축의 시각 라벨과 포스터의 작은 글씨를 제외하고 1rem보다 작은 글자는 쓰지 않는다.
시간은 고정폭 숫자(tabular figures)로 쓴다.

LAYOUT:
- 사이트 바 아래에 행사 전용 바를 둔다. 왼쪽에 행사명, 오른쪽에 프로그램, 연사, 티켓, 오시는 길 링크(휴대폰에서는 티켓 링크만 남긴다).
- 데스크톱 히어로: 포스터는 왼쪽, 화면 높이에 맞춰 용지 전체가 1280x720 화면에 들어가는 크기. 오른쪽 열 맨 위에 제목, 열 하단에 리드 문단과 티켓 버튼을 두며, 포스터 아래쪽 가장자리와 높이를 맞춘다. 태블릿과 휴대폰에서는 포스터를 제목 위에 둔다.
- 프로그램: 실제 시간축을 쓴다. 한 행은 5분이며 높이는 고정하여, 모든 블록이 진행 시간만큼 정확히 길도록 한다. 두 방의 열에는 좌석 수를 표시한다. 시 단위 선은 실선, 30분 단위 선은 점선. 정해진 한 시각에 두 방을 가로지르는 보라색 선을 긋고, 행사 당일에는 이 시간표가 실제 시계를 따른다는 안내를 함께 둔다(티켓은 몇 달 전부터 판매하므로 지금 진행 중이라고 쓰지 않는다). 점심, 커피, 환영 인사, 파티는 두 방에 걸치며 장소를 표시한다.
- 연사: 페스티벌 라인업처럼 가운데 정렬된 이름 블록 하나. 각 이름 뒤에 역할, 그 아래 도시를 붙이고, 줄바꿈의 균형을 맞춰 한 줄에 이름이 하나만 남지 않도록 한다. 태블릿과 휴대폰에서는 성 순서의 구획선 목록이 된다(두 열에서 한 열로).
- 티켓: 비교표 하나. 각 열 헤더에 라디오 버튼을 둔다. 선택된 열은 위쪽을 잉크색으로 채우고 아래쪽은 옅게 물들인다. 그 아래에 주문 요약 줄을 둔다.
- 오시는 길: 왼쪽에 주소, 오른쪽에 구획선이 있는 행들. 도보 시간은 3rem 크기의 큰 숫자로 역 이름 옆에 놓는다.
- 최대 너비 1120px. 섹션 사이 128px, 휴대폰에서는 88px.

COMPONENTS:
- 시간 블록: 1px 선, 왼쪽에 3px 잉크 구획선, 흰색 채우기. 휴식은 135도 빗금. 파티는 잉크색으로 채운다. 정해진 시각에 진행 중인 강연은 보라색으로 채우고, 그 시각에 남은 시간을 표시한다.
- 방 필터는 휴대폰에서만 쓴다. 두 방이 시간순 하나의 목록이 될 때 나타난다. 두 방 모두, 메인 홀, 스튜디오 2를 네모난 세 칸으로 이어 붙인다. 선택된 칸은 잉크색으로 채운다.
- 라디오: 20px 잉크색 원형 테두리. 선택된 것은 잉크색 테두리 안에 보라색 점.
- 포함: 12px 잉크색 정사각형. 미포함: 16px 대시. 두 표시 모두 숨김 텍스트를 가진다.
- 버튼: 높이 52px의 잉크색 직사각형, 흰색 텍스트 600. 알약형 버튼과 외곽선 버튼은 쓰지 않는다.
- 주문 양식: 수량 1~4와 이메일 입력란. 정사각형 1px 잉크색 테두리, 라벨은 위에 둔다. 오류는 입력란 아래에 role="alert"로 표시한다. 요약 줄에는 매수, 종류, 합계를 쓰고, 버튼 라벨도 같은 내용을 쓴다. 성공하면 확인 화면이 양식을 대신하고 포커스를 받는다.

MOTION:
- 페이지에는 움직임이 없다. 사이트의 부드러운 앵커 스크롤만 움직인다. 포스터는 인쇄물이다. 상태 변화는 즉시 일어난다.

FORBIDDEN:
- 포스터 밖의 메시, 그라디언트 텍스트, 유리 패널, 배경 블러
- 카드, 알약형 요소, 둥근 모서리, 드롭 섀도
- 행 높이가 글자 양에 따라 늘어나는 시간표. 시간은 반드시 축척을 지켜야 한다.
- 원형 연사 사진, 로고 벽, 연사 카드 격자
- 헤딩 위의 작은 라벨, 대문자에 자간을 준 라벨
- 보라에서 분홍으로 넘어가는 그라디언트 버튼

OUTPUT:
1) CSS 커스텀 프로퍼티
2) 시맨틱 HTML과 CSS: 프로그램은 시간순 목록으로, 티켓 표는 실제 표의 구조를 갖춘다.
3) 320px까지 가로 스크롤 없이 반응형으로: 시간표는 방 필터와 함께 하나의 목록이 되고, 티켓 표는 쌓인 행이 된다.
4) 보이는 포커스, 라벨이 있는 입력란, 입력란 옆의 오류, 확인 화면으로 옮겨지는 포커스.`;

const PROMPT_JA = `Mesh Gradientスタイルで実在するページを一つデザインする。白いページの上で、印刷されたポスター一枚がやわらかな色面をすべて担い、その周囲はインク、白、罫線だけで構成する。

ポスターになりそうなもっともらしい題材を選ぶ。カンファレンス、フェスティバル、コンサートシリーズ、展覧会などがよい。その題材の実際の内容を書く（ここではリスボンの映画館で行う一日のデザイン講演 Colorfield 2027）。ページはその題材のページとして読めなければならず、スタイルについてのページに見えてはならない。

COLOR TOKENS:
--bg: #ffffff
--ink: #1a1a2e
--muted: #575869
--line: rgba(26,26,46,0.3)
--line-strong: rgba(26,26,46,0.55)
--violet: #5d54f5（状態表示のみ：決まった時刻に進行中の講演、選ばれた項目）
--tint: rgba(108,99,255,0.09)（選ばれたチケット列）
--error: #b42318（入力欄のエラーのみ）
メッシュはポスターにのみ使う。空色 rgba(150,208,255,.95)、ピーチ rgba(255,190,160,.95)、白い光 rgba(255,255,255,.9)、バイオレット rgba(108,99,255,.95)、ライラック rgba(150,140,255,.85)、ピンク rgba(255,150,196,.95)、アプリコット rgba(255,206,176,.95)。下地は #ece6ff。
ほかの色は使わない。ただしボタンのホバーには #2c2c4a、プレースホルダーのテキストには #6c6d7d を使う。ハッチング、紙の質感、インク上のテキストは、インクまたは白を低い不透明度で使う。

THE POSTER:
- 4:5の印刷用紙一枚。角と辺に放射状グラデーションを7つ、中央に白い光を置く。フラクタルノイズのレイヤーを不透明度0.32、乗算（multiply）で重ね、画面ではなく印刷物に見えるようにする。幅の狭い用紙は、小さな文字を削るのではなく、高さを増やす。
- スクリーン印刷のように内側に配置し、用紙全体が一体で縮尺されるようコンテナ単位で寸法を決める。イベント名と「一日の講演」を罫線の上に置く。日付「14」は47cqw、太さ800、字間-0.075em。「2027年5月」は12.5cqw。都市名は右端に沿って縦組みで23cqwの大きさで走らせる。罫線を一本、会場は10cqw、細かい文字は短いブロック3つにまとめる。
- ポスターは画像として扱う。role="img" を付け、そこに書かれているすべてを伝えるラベルを置く。同じ情報はページ上の実際のテキストにも載せる。
- メッシュはほかのどこにも現れない。

TYPOGRAPHY:
Display：ポスター、タイトル、見出し、講演タイトル、名前、価格、徒歩時間には Funnel Display 600〜800。
Title：Funnel Display 700、行間0.92、字間-0.045em。デスクトップではポスターの横に2行（名前、年）、最大7.5rem。短い画面では、チケットボタンが最初の画面に収まるよう小さくする。1000px未満では1行、行間0.94、スマートフォンでは約3rem。
Section headings：Funnel Display 700、clamp(2.25rem, 4.6vw, 3.5rem)、行間1、字間-0.04em
Talk titles and station names：Funnel Display 600、1.1875rem〜1.375rem、字間-0.015〜-0.02em
Line-up names：Funnel Display 600、1.875rem（1200px未満では1.75rem）。ほとんどの行に名前が3つ入るようにする。タブレットとスマートフォンの一覧では1.625rem。
Text：Funnel Sans 400〜600、1.0625rem、行間1.55。描かれた時間軸の時刻ラベルとポスターの小さな文字を除き、1rem未満の文字は使わない。
時刻には等幅数字（tabular figures）を使う。

LAYOUT:
- サイトバーの下に、イベント専用のバーを置く。左にイベント名、右にプログラム、登壇者、チケット、アクセスへのリンク（スマートフォンではチケットのみ）。
- デスクトップのヒーロー：ポスターは左、画面の高さに合わせて、用紙全体が1280x720の画面に収まる大きさにする。右列の最上部にタイトル、下端にリード文とチケットボタンを置き、ポスターの下端と揃える。タブレットとスマートフォンではポスターをタイトルの上に置く。
- プログラム：実際の時間軸を使う。1行は5分で高さは固定し、すべてのブロックが講演時間どおりの長さになるようにする。会場ごとの列には座席数を表示する。時間の線は実線、30分の線は破線。決まった一つの時刻に、両方の会場にまたがる紫の線を引き、当日はこの時間割が実際の時刻に従う旨を注記する（チケットは数か月前から販売するため、今の時刻だとは書かない）。昼食、コーヒー、開会の挨拶、パーティーは両方の会場にまたがり、会場を明記する。
- 登壇者：フェスティバルのラインナップのように、中央揃えの名前のブロックを1つ置く。各名前の後ろに役割、その下に都市を置き、1行に名前が1つだけ残らないよう改行のバランスをとる。タブレットとスマートフォンでは、姓の順に並んだ罫線つきリストになる（2列から1列へ）。
- チケット：比較表を1つ置く。各列の見出しにラジオボタンを付ける。選ばれた列は上部をインクで塗り、下部は薄く色づける。その下に注文の要約行を置く。
- アクセス：左に住所、右に罫線つきの行。徒歩の分数は3remの大きな数字で、駅名の横に置く。
- 最大幅1120px。セクション間は128px、スマートフォンでは88px。

COMPONENTS:
- 時間ブロック：1pxの線、左に3pxのインクの罫線、白の塗り。休憩は135度の斜線。パーティーはインクで塗る。決まった時刻に進行中の講演は紫で塗り、その時刻の残り時間を表示する。
- 会場フィルターは、スマートフォンで両会場が時刻順の1つのリストになるときのみ使う。両方の会場、メインホール、スタジオ2を角の四角い3つのセグメントとして連結する。選ばれたものはインクで塗る。
- ラジオ：20pxのインクの円。選ばれたものはインクの円の中に紫の点。
- 含む：12pxのインクの正方形。含まない：16pxのダッシュ。どちらも非表示のテキストを持つ。
- ボタン：高さ52pxのインクの長方形、白い文字の太さ600。ピル型やアウトラインのボタンは使わない。
- 注文フォーム：枚数1〜4とメールアドレス欄。角の1pxのインクの枠、ラベルは上に置く。エラーは欄の下に role="alert" で表示する。要約行には枚数、種類、合計を書き、ボタンのラベルも同じ内容にする。送信に成功したら、確認画面がフォームに代わり、フォーカスを受け取る。

MOTION:
- ページに動きはない。サイトのアンカーへの滑らかなスクロールだけが動く。ポスターは印刷物である。状態の変化は即時に行う。

FORBIDDEN:
- ポスターの外でのメッシュ、グラデーションの文字、ガラスのパネル、背景のぼかし
- カード、ピル型の要素、角丸、ドロップシャドウ
- 文字量に応じて行の高さが伸びる時間割。時間は必ず縮尺どおりに保つ。
- 円形の登壇者写真、ロゴの壁、登壇者カードのグリッド
- 見出しの上の小さなラベル、字間を空けた大文字のラベル
- 紫からピンクへのグラデーションのボタン

OUTPUT:
1) CSSカスタムプロパティ
2) セマンティックなHTMLとCSS：プログラムは時刻順のリストとし、チケット表は実際の表としての構造を持たせる。
3) 320pxまで横スクロールなしでレスポンシブに：時間割は会場フィルターつきの1つのリストになり、チケット表は積み重ねた行になる。
4) 見えるフォーカス、ラベルのある入力欄、欄の横のエラー、確認画面へ移るフォーカス。`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_KO, ja: PROMPT_JA };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Order {
  ticket: TicketId;
  quantity: number;
  email: string;
}

export function PortedMeshGradientPage({ lang }: PortedStylePageProps) {
  const [room, setRoom] = useState<RoomFilter>('all');
  const [ticketId, setTicketId] = useState<TicketId>('early');
  const [quantity, setQuantity] = useState(1);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<'empty' | 'invalid' | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const quantityRef = useRef<HTMLSelectElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const reopened = useRef(false);
  const t = (text: Tri) => text[lang];

  const ticketById = (id: TicketId) => TICKETS.find((item) => item.id === id) ?? TICKETS[0];
  const summaryOf = (id: TicketId, count: number) => {
    const ticket = ticketById(id);
    return fill(t(count === 1 ? ticket.sumOne : ticket.sumMany), { count, total: euros(ticket.price * count) });
  };
  const ticket = ticketById(ticketId);
  const buyLabel = fill(t(quantity === 1 ? ticket.buyOne : ticket.buyMany), { count: quantity });

  // The confirmation replaces the order form, so focus goes to it; when the form
  // comes back, focus returns to its first field.
  useEffect(() => {
    if (order) {
      doneRef.current?.focus();
    } else if (reopened.current) {
      reopened.current = false;
      quantityRef.current?.focus();
    }
  }, [order]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();
    if (value === '') {
      setError('empty');
      emailRef.current?.focus();
      return;
    }
    if (!EMAIL_PATTERN.test(value)) {
      setError('invalid');
      emailRef.current?.focus();
      return;
    }
    setError(null);
    setOrder({ ticket: ticketId, quantity, email: value });
  };

  const startAgain = () => {
    reopened.current = true;
    setOrder(null);
  };

  return (
    <FusionShell
      fusionId="mesh-gradient"
      lang={lang}
      tone="light"
      accent="#1a1a2e"
      prev={{ href: '/pages/duotone-bold.html', label: 'Duotone Bold' }}
      next={{ href: '/pages/framer-motion.html', label: 'Framer Motion' }}
      prompts={PROMPTS}
    >
      <div className="cf">
        <header className="cf-bar">
          <p className="cf-bar__mark">{EVENT.name}</p>
          <nav className="cf-bar__nav" aria-label={t(EVENT.barLabel)}>
            {NAV.map((item) => (
              <a key={item.href} href={item.href} className={item.keep ? 'is-kept' : undefined}>{t(item.label)}</a>
            ))}
          </nav>
        </header>

        <section className="cf-hero" aria-labelledby="cf-title">
          <div className="cf-poster" role="img" aria-label={t(POSTER.label)}>
            <div className="cf-poster__sheet">
              <div className="cf-poster__top">
                <span className="cf-poster__name">{EVENT.name}</span>
                <span className="cf-poster__kind">{t(POSTER.kind)}</span>
              </div>
              <div className="cf-poster__mid">
                <p className="cf-poster__date">
                  <span className="cf-poster__day">{POSTER.day}</span>
                  <span className="cf-poster__month">{t(POSTER.monthYear)}</span>
                </p>
                <p className="cf-poster__city">{t(POSTER.city)}</p>
              </div>
              <div className="cf-poster__venue">
                <p className="cf-poster__hall">{POSTER.hall[0]}<br />{POSTER.hall[1]}</p>
                <div className="cf-poster__small">
                  <p>{POSTER.address}</p>
                  <p>{t(POSTER.times[0])}<br />{t(POSTER.times[1])}</p>
                  <p>{t(POSTER.party[0])}<br />{t(POSTER.party[1])}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="cf-cap">
            <h1 id="cf-title" className="cf-title">{EVENT.name} <span className="cf-title__year">{EVENT.year}</span></h1>
            <div className="cf-cap__foot">
              <p className="cf-lede">{t(EVENT.lede)}</p>
              <div className="cf-cap__buy">
                <a className="cf-btn" href="#cf-tickets">{t(EVENT.buy)}</a>
                <p>{t(EVENT.buyNote)}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="cf-section" id="cf-programme" aria-labelledby="cf-programme-title">
          <h2 id="cf-programme-title" className="cf-h2">{t(PROGRAMME.title)}</h2>
          <p className="cf-note">{t(PROGRAMME.note)}</p>

          <fieldset className="cf-filter">
            <legend className="cf-filter__legend">{t(PROGRAMME.filterLegend)}</legend>
            <div className="cf-filter__options">
              {(['all', 'main', 'studio'] as RoomFilter[]).map((value) => (
                <label key={value} className={`cf-filter__option${room === value ? ' is-on' : ''}`}>
                  <input
                    type="radio"
                    name="cf-room"
                    value={value}
                    checked={room === value}
                    onChange={() => setRoom(value)}
                  />
                  <span>{t(PROGRAMME.filter[value])}</span>
                </label>
              ))}
            </div>
            <p className="cf-vh" aria-live="polite">{t(PROGRAMME.status[room])}</p>
          </fieldset>

          <div className="cf-tt" data-show={room}>
            <div className="cf-tt__room cf-tt__room--main">
              <b>{t(ROOMS.main.name)}</b>
              <span>{t(ROOMS.main.seats)}</span>
            </div>
            <div className="cf-tt__room cf-tt__room--studio">
              <b>{t(ROOMS.studio.name)}</b>
              <span>{t(ROOMS.studio.seats)}</span>
            </div>

            <div className="cf-tt__axis" aria-hidden="true">
              {AXIS_MARKS.map((mark) => (
                <i
                  key={mark.label}
                  className={`cf-tt__line${mark.head ? ' cf-tt__line--head' : mark.hour ? '' : ' cf-tt__line--half'}`}
                  style={{ gridRow: mark.row }}
                />
              ))}
              {AXIS_MARKS.filter((mark) => mark.hour || mark.head).map((mark) => (
                <span key={mark.label} className="cf-tt__hour" style={{ gridRow: mark.row }}>{mark.label}</span>
              ))}
              <span className="cf-tt__now" style={{ gridRow: rowOf(minutesOf(PROGRAMME.nowTime)) }}>
                <span>{PROGRAMME.nowTime}</span>
              </span>
            </div>

            <ol className="cf-tt__list" role="list">
              {SLOTS.map((slot) => {
                const start = minutesOf(slot.start);
                const end = minutesOf(slot.end);
                const wide = slot.place === 'all';
                const line = slot.kind === 'plenary' || slot.id === 'coffee' || slot.kind === 'party';
                const where = slot.where ?? (slot.place === 'studio' ? ROOMS.studio.name : ROOMS.main.name);
                const classes = [
                  'cf-s',
                  wide ? 'cf-s--wide' : '',
                  line ? 'cf-s--line' : '',
                  slot.kind === 'break' ? 'cf-s--break' : '',
                  slot.kind === 'party' ? 'cf-s--party' : '',
                  slot.now ? 'cf-s--now' : '',
                ].filter(Boolean).join(' ');
                return (
                  <li
                    key={slot.id}
                    className={classes}
                    data-place={slot.place}
                    style={{
                      gridColumn: wide ? '2 / -1' : slot.place === 'main' ? '2' : '3',
                      gridRow: `${rowOf(start)} / ${rowOf(end)}`,
                    }}
                  >
                    <p className="cf-s__time">
                      <span>
                        {slot.start}–{slot.end}
                        <span className="cf-s__room"> {t(where)}</span>
                      </span>
                      {slot.now ? <strong>{t(PROGRAMME.now)}</strong> : null}
                    </p>
                    <h3 className="cf-s__title">{t(slot.title)}</h3>
                    {slot.who ? <p className="cf-s__who">{t(slot.who)}</p> : null}
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <section className="cf-section" id="cf-speakers" aria-labelledby="cf-speakers-title">
          <h2 id="cf-speakers-title" className="cf-h2">{t(SPEAKERS_COPY.title)}</h2>
          <p className="cf-note">{t(SPEAKERS_COPY.note)}</p>
          <ul className="cf-lineup">
            {SPEAKERS.map((speaker) => (
              <li key={speaker.name}>
                <span className="cf-lineup__entry">
                  <span className="cf-lineup__name">{speaker.name}</span>{' '}
                  <span className="cf-lineup__rc">
                    <span className="cf-lineup__role">{t(speaker.role)}</span>
                    <span className="cf-lineup__city">{t(speaker.city)}</span>
                  </span>
                </span>{' '}
              </li>
            ))}
          </ul>
        </section>

        <section className="cf-section" id="cf-tickets" aria-labelledby="cf-tickets-title">
          <h2 id="cf-tickets-title" className="cf-h2">{t(TICKETS_COPY.title)}</h2>
          <p className="cf-note">{t(TICKETS_COPY.note)}</p>

          <fieldset className="cf-tix-set">
            <legend className="cf-vh">{t(TICKETS_COPY.legend)}</legend>
            <table className="cf-tix" role="table" aria-labelledby="cf-tickets-title">
              <thead role="rowgroup">
                <tr role="row">
                  <th role="columnheader" scope="col" className="cf-tix__corner"><span className="cf-vh">{t(TICKETS_COPY.corner)}</span></th>
                  {TICKETS.map((item) => (
                    <th key={item.id} role="columnheader" scope="col" className={item.id === ticketId ? 'is-on' : undefined}>
                      <label className="cf-pick">
                        <input
                          type="radio"
                          name="cf-ticket"
                          value={item.id}
                          checked={item.id === ticketId}
                          onChange={() => setTicketId(item.id)}
                        />
                        <span>{t(item.name)}</span>
                      </label>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody role="rowgroup">
                <tr role="row" className="cf-tix__price">
                  <th role="rowheader" scope="row">{t(TICKETS_COPY.price)}</th>
                  {TICKETS.map((item) => (
                    <td key={item.id} role="cell" data-label={t(item.name)} className={item.id === ticketId ? 'is-on' : undefined}>
                      {euros(item.price)}
                      <small>{t(item.stock)}</small>
                    </td>
                  ))}
                </tr>
                <tr role="row">
                  <th role="rowheader" scope="row">{t(TICKETS_COPY.until)}</th>
                  {TICKETS.map((item) => (
                    <td key={item.id} role="cell" data-label={t(item.name)} className={item.id === ticketId ? 'is-on' : undefined}>{t(item.until)}</td>
                  ))}
                </tr>
                {INCLUDES.map((row) => (
                  <tr key={row.label.en} role="row">
                    <th role="rowheader" scope="row">{t(row.label)}</th>
                    {TICKETS.map((item) => (
                      <td key={item.id} role="cell" data-label={t(item.name)} className={item.id === ticketId ? 'is-on' : undefined}>
                        <span className={row.has[item.id] ? 'cf-yes' : 'cf-no'}>
                          <span className="cf-vh">{t(row.has[item.id] ? TICKETS_COPY.yes : TICKETS_COPY.no)}</span>
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </fieldset>

          {order ? (
            <div className="cf-done" ref={doneRef} tabIndex={-1}>
              <p>{fill(t(TICKETS_COPY.done), { summary: summaryOf(order.ticket, order.quantity), email: order.email })}</p>
              <button type="button" className="cf-textbtn" onClick={startAgain}>{t(TICKETS_COPY.again)}</button>
            </div>
          ) : (
            <form className="cf-order" onSubmit={handleSubmit} noValidate aria-labelledby="cf-tickets-title">
              <p className="cf-order__sum" aria-live="polite">
                <b>{summaryOf(ticketId, quantity)}</b>
                <span>{t(ticket.note)}</span>
              </p>
              <div className="cf-order__fields">
                <div className="cf-field cf-field--qty">
                  <label htmlFor="cf-qty">{t(TICKETS_COPY.quantity)}</label>
                  <select
                    id="cf-qty"
                    ref={quantityRef}
                    value={quantity}
                    onChange={(event) => setQuantity(Number(event.target.value))}
                  >
                    {QUANTITIES.map((count) => <option key={count} value={count}>{count}</option>)}
                  </select>
                </div>
                <div className={`cf-field cf-field--email${error ? ' is-invalid' : ''}`}>
                  <label htmlFor="cf-email">{t(TICKETS_COPY.email)}</label>
                  <input
                    id="cf-email"
                    ref={emailRef}
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={email}
                    aria-invalid={error !== null}
                    aria-describedby={error ? 'cf-email-error' : undefined}
                    onChange={(event) => { setEmail(event.target.value); if (error) setError(null); }}
                  />
                  {error ? (
                    <p className="cf-field__error" id="cf-email-error" role="alert">
                      {t(error === 'empty' ? TICKETS_COPY.errorEmpty : TICKETS_COPY.errorInvalid)}
                    </p>
                  ) : null}
                </div>
                <button type="submit" className="cf-btn cf-order__submit">{buyLabel}</button>
              </div>
            </form>
          )}
        </section>

        <section className="cf-section" id="cf-travel" aria-labelledby="cf-travel-title">
          <h2 id="cf-travel-title" className="cf-h2">{t(TRAVEL.title)}</h2>
          <div className="cf-travel">
            <div className="cf-travel__addr">
              <address>{TRAVEL.address.map((part, index) => <span key={part}>{index > 0 ? <br /> : null}{part}</span>)}</address>
              <p>{t(TRAVEL.access)}</p>
            </div>
            <ul className="cf-walk">
              {TRAVEL.walks.map((walk) => (
                <li key={walk.station}>
                  <span className="cf-walk__min">{walk.minutes}<small>{t(TRAVEL.min)}</small></span>
                  <h3 className="cf-walk__station">{walk.station}</h3>
                  <p className="cf-walk__how">{t(walk.line)}<span>{t(walk.way)}</span></p>
                </li>
              ))}
            </ul>
            <p className="cf-travel__air">{t(TRAVEL.air)}</p>
          </div>
        </section>

        <footer className="cf-foot">
          <p className="cf-foot__mark">{EVENT.title}</p>
          <p>{t(FOOTER.run)}</p>
          <p>{FOOTER.where}</p>
        </footer>
      </div>
    </FusionShell>
  );
}
