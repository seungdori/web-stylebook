import { useState } from 'react';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedNeonDriftPage.css';

// The page of Apex Circuit, an online sim racing league, on the Saturday night of its
// Night Cup: Round 3 at Harbour Loop is on lap 18 of 30. Chakra Petch carries the whole
// page; its cut corners read like race numbers and kerb paint, and its italic is kept for
// the two racing numbers, the headline and the lap count (and the car numbers).
// Components come from a race broadcast: the timing tower with its gap toggle, the lap
// counter of 30 segments with the pit window under it, the leader's lap-time trace against
// P2, Sunday's knockout bracket with drawn connectors, the drivers table, an on-air grid of
// three feeds with a now line, and the stewards' list. Neon stays on keylines, traces and
// focus: teal is the leader, what is live and the active choice; coral is pits and
// penalties; magenta marks only the fastest lap.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

const LEAGUE = 'Apex Circuit';
const RACE_TIME = '26:47';
const LAP = 18;
const LAPS = 30;

const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key]));

const HEAD = {
  nav: { en: 'Race weekend', ko: '레이스 주말', ja: 'レース週末' },
  standings: { en: 'Standings', ko: '순위', ja: '順位' },
  bracket: { en: 'Bracket', ko: '대진표', ja: 'トーナメント表' },
  drivers: { en: 'Drivers', ko: '드라이버', ja: 'ドライバー' },
  schedule: { en: 'Schedule', ko: '편성표', ja: '放送予定' },
  rules: { en: 'Rules', ko: '규정', ja: '規則' },
  watch: { en: 'Watch live', ko: '생중계 보기', ja: 'ライブ視聴' },
} satisfies Record<string, Tri>;

const HERO = {
  event: { en: 'Night Cup, Saturday 21 November', ko: 'Night Cup, 11월 21일 토요일', ja: 'Night Cup, 11月21日(土)' },
  live: { en: 'Live', ko: '생방송', ja: 'ライブ' },
  raceTime: { en: 'Race time', ko: '레이스 시간', ja: 'レース時間' },
  title: { en: 'Round 3, Harbour Loop', ko: '3라운드, Harbour Loop', ja: '第3戦、Harbour Loop' },
  lede: {
    en: 'Twenty drivers, 30 laps of a 4.1 km street circuit at night, one compulsory pit stop. The top eight on points after tonight race the knockout on Sunday.',
    ko: '드라이버 20명이 야간에 4.1km 시가지 서킷을 30랩 달리며, 피트 정차는 한 번이 의무입니다. 오늘 밤 종료 시점 포인트 상위 8명이 일요일 토너먼트를 치릅니다.',
    ja: 'ドライバー20名が夜に4.1kmの市街地サーキットを30周走ります。ピットストップは1回が義務です。今夜の終了時点でポイント上位8名が、日曜のノックアウト戦を走ります。',
  },
  lap: { en: 'Lap', ko: '랩', ja: 'ラップ' },
  of: { en: 'of {n}', ko: '/ {n}', ja: '/ {n}' },
  pitWindow: { en: 'Pit window, laps 10 to 20', ko: '피트 윈도우, 10~20랩', ja: 'ピットウィンドウ、10〜20周' },
} satisfies Record<string, Tri>;

type Stop = 'none' | 'done' | 'now';

interface TowerRow {
  pos: number;
  initial: string;
  name: string;
  /** Seconds behind the leader. */
  gap: number;
  /** The last lap, or null while the car is in the pit lane. */
  last: string | null;
  stop: Stop;
  best?: boolean;
  penalty?: boolean;
}

const TOWER_ROWS: TowerRow[] = [
  { pos: 1, initial: 'M.', name: 'Lindqvist', gap: 0, last: '1:32.04', stop: 'none' },
  { pos: 2, initial: 'T.', name: 'Okafor', gap: 1.384, last: '1:31.88', stop: 'none' },
  { pos: 3, initial: 'I.', name: 'Santamaría', gap: 4.902, last: '1:32.41', stop: 'none' },
  { pos: 4, initial: 'J.', name: 'Holm', gap: 6.215, last: '1:32.77', stop: 'done' },
  { pos: 5, initial: 'R.', name: 'Tanabe', gap: 9.03, last: '1:31.71', stop: 'done', best: true },
  { pos: 6, initial: 'N.', name: 'van den Berg', gap: 11.476, last: '1:32.95', stop: 'none' },
  { pos: 7, initial: 'O.', name: 'Kowalczyk', gap: 12.008, last: '1:33.10', stop: 'none', penalty: true },
  { pos: 8, initial: 'L.', name: 'Marchetti', gap: 15.66, last: '1:32.52', stop: 'done' },
  { pos: 9, initial: 'B.', name: 'Ferreira', gap: 17.211, last: null, stop: 'now' },
  { pos: 10, initial: 'S.', name: 'Abernethy', gap: 19.845, last: '1:33.40', stop: 'none' },
];

type TimeMode = 'gap' | 'interval';

const TOWER = {
  title: { en: 'Top 10 of 20', ko: '상위 10명 (전체 20명)', ja: '上位10名（全20名）' },
  group: { en: 'Time shown', ko: '표시 기록', ja: '表示する時間' },
  gapButton: { en: 'Gap to leader', ko: '선두와의 차이', ja: 'トップとの差' },
  intervalButton: { en: 'Interval', ko: '간격', ja: 'インターバル' },
  pos: { en: 'Pos', ko: '순위', ja: '順位' },
  position: { en: 'Position', ko: '순위', ja: '順位' },
  driver: { en: 'Driver', ko: '드라이버', ja: 'ドライバー' },
  gap: { en: 'Gap', ko: '차이', ja: '差' },
  interval: { en: 'Interval', ko: '간격', ja: 'インターバル' },
  last: { en: 'Last lap', ko: '직전 랩', ja: '直前のラップ' },
  stop: { en: 'Stop', ko: '정차', ja: 'ピット' },
  leader: { en: 'Leader', ko: '선두', ja: 'トップ' },
  inPit: { en: 'In pit', ko: '피트 중', ja: 'ピット中' },
  stopNone: { en: 'Not stopped yet', ko: '아직 정차 전', ja: 'ピットストップ未実施' },
  stopDone: { en: 'Stopped', ko: '정차 완료', ja: 'ピットストップ済み' },
  stopNow: { en: 'In the pits now', ko: '지금 피트 진입 중', ja: '現在ピット内' },
  key: { en: 'Pit stop:', ko: '피트 정차:', ja: 'ピットストップ:' },
  keyNone: { en: 'not yet', ko: '아직 안 함', ja: '未実施' },
  keyDone: { en: 'made', ko: '완료', ja: '実施済み' },
  keyNow: { en: 'in the pit lane now', ko: '피트 레인 진입 중', ja: 'ピットレーン走行中' },
  personalBest: { en: 'personal best', ko: '개인 최고 랩', ja: '自己ベスト' },
  penalty: { en: '5-second penalty', ko: '5초 페널티', ja: '5秒ペナルティ' },
  penaltyTime: { en: '+5 s', ko: '+5초', ja: '+5秒' },
  note: {
    en: 'Kowalczyk has a 5-second penalty for track limits on lap 16. It is added to his time at the finish.',
    ko: 'Kowalczyk는 16랩에서 트랙 리미트 위반으로 5초 페널티를 받았습니다. 이 시간은 완주 기록에 더해집니다.',
    ja: 'Kowalczykは16周目のトラックリミット違反で5秒のペナルティを受けています。このタイムは決勝の記録に加算されます。',
  },
  showsGap: { en: 'The tower shows each gap to the leader.', ko: '순위표에 선두와의 차이를 표시합니다.', ja: '順位表に各車とトップとの差を表示しています。' },
  showsInterval: {
    en: 'The tower shows each interval to the car ahead.',
    ko: '순위표에 앞차와의 간격을 표시합니다.',
    ja: '順位表に各車と前車との間隔を表示しています。',
  },
} satisfies Record<string, Tri>;

const LEADER = {
  who: { en: 'Leader, Mara Lindqvist', ko: '선두, Mara Lindqvist', ja: 'トップ、Mara Lindqvist' },
  last: { en: 'Last lap', ko: '직전 랩', ja: '直前のラップ' },
  best: { en: 'Best, lap 15', ko: '최고 기록, 15랩', ja: 'ベスト、15周目' },
  ahead: { en: 'Ahead of Okafor', ko: 'Okafor와의 차이', ja: 'Okaforとの差' },
  gapAhead: { en: '1.384 s', ko: '1.384초', ja: '1.384秒' },
  stop: { en: 'Pit stop', ko: '피트 정차', ja: 'ピットストップ' },
  notYet: { en: 'Not yet', ko: '아직', ja: 'まだ' },
} satisfies Record<string, Tri>;

const TRACE = {
  caption: { en: 'Lap times', ko: '랩 타임', ja: 'ラップタイム' },
  leader: { en: 'Lindqvist, P1', ko: 'Lindqvist, 1위', ja: 'Lindqvist、1位' },
  second: { en: 'Okafor, P2', ko: 'Okafor, 2위', ja: 'Okafor、2位' },
  faster: { en: 'Faster is higher.', ko: '빠를수록 위에 있습니다.', ja: '速いほど上に表示しています。' },
  alt: {
    en: 'Lap times for laps 1 to 17, faster higher. Lindqvist opens at 1:33.46 and runs between 1:31.6 and 1:32.4 from lap 4, with his fastest, 1:31.62, on lap 15 inside the pit window. Okafor follows within a few tenths; his last lap is 1:31.88.',
    ko: '1~17랩 랩 타임, 빠를수록 위에 있습니다. Lindqvist는 1:33.46으로 시작해 4랩부터 1:31.6~1:32.4 사이를 달립니다. 최고 기록 1:31.62는 피트 윈도우 안인 15랩에 나왔습니다. Okafor는 0.1초 단위 차이로 바짝 뒤따르며, 마지막 랩은 1:31.88입니다.',
    ja: '1〜17周のラップタイム、速いほど上。Lindqvistは1:33.46で始まり、4周目からは1:31.6〜1:32.4の間を走ります。最速の1:31.62は、ピットウィンドウ内の15周目に出ました。Okaforは0.1秒台の差で後に続き、直前のラップは1:31.88です。',
  },
  window: { en: 'Pit window', ko: '피트 윈도우', ja: 'ピットウィンドウ' },
} satisfies Record<string, Tri>;

// The leader's and P2's lap times as drawn: the view box is 580 wide (20 units a lap, lap 1
// at 0) and 240 high, from 1:31.0 at the top to 1:34.0 at the bottom (80 units a second).
const LEADER_TRACE = '0,196.8 20,136.8 40,112 60,106.4 80,94.4 100,100 120,81.6 140,88 160,75.2 180,84.8 200,70.4 220,104.8 240,63.2 260,68 280,49.6 300,77.6 320,83.2';
const SECOND_TRACE = '0,209.6 20,144 40,121.6 60,108.8 80,112.8 100,96 120,92 140,86.4 160,89.6 180,79.2 200,82.4 220,72 240,85.6 260,74.4 280,80.8 300,60.8 320,70.4';
const Y_TICKS = ['1:31.0', '1:32.0', '1:33.0', '1:34.0'];
const X_TICKS = [1, 5, 10, 15, 20, 25, 30];
const lapX = (lap: number) => ((lap - 1) / (LAPS - 1)) * 100;

const BRACKET = {
  title: { en: "Sunday's knockout", ko: '일요일 토너먼트', ja: '日曜のノックアウト' },
  lead: {
    en: 'The top eight on points race head to head on Sunday 22 November, and the higher seed starts on pole. Seeds below are the points as they stand on lap 18, so they can still change tonight. Prize money is €10,000 in all.',
    ko: '포인트 상위 8명이 11월 22일 일요일에 1대1로 맞붙으며, 시드가 높은 쪽이 폴 포지션에서 출발합니다. 아래 시드는 18랩 시점의 포인트 기준이므로 오늘 밤 바뀔 수 있습니다. 총 상금은 €10,000입니다.',
    ja: 'ポイント上位8名が11月22日(日)に一騎打ちで対戦し、シードの高い方がポールポジションからスタートします。下のシードは18周目時点のポイントで、今夜の結果によって変わる可能性があります。賞金総額は€10,000です。',
  },
  hint: {
    en: 'Choose a quarterfinal to mark its two drivers in the drivers table.',
    ko: '8강 경기를 선택하면 드라이버 표에서 그 경기의 두 드라이버가 표시됩니다.',
    ja: '準々決勝を選ぶと、ドライバー表でその2名に印がつきます。',
  },
  qf: { en: 'Quarterfinals', ko: '8강', ja: '準々決勝' },
  qfNote: { en: '10 laps each, from 18:30', ko: '각 10랩, 18:30 시작', ja: '各10周、18:30開始' },
  sf: { en: 'Semifinals', ko: '4강', ja: '準決勝' },
  sfNote: { en: '12 laps each, from 20:15', ko: '각 12랩, 20:15 시작', ja: '各12周、20:15開始' },
  final: { en: 'Final', ko: '결승', ja: '決勝' },
  finalNote: { en: '20 laps and one stop, 21:20', ko: '20랩, 피트 정차 1회, 21:20', ja: '20周、ピットストップ1回、21:20' },
  winnerOf: { en: 'Winner of {match}', ko: '{match} 승자', ja: '{match}の勝者' },
  pts: { en: '{n} pts', ko: '{n}점', ja: '{n}点' },
  prize: { en: 'Prize money', ko: '상금', ja: '賞金' },
  winner: { en: 'Winner', ko: '우승', ja: '優勝' },
  runnerUp: { en: 'Runner-up', ko: '준우승', ja: '準優勝' },
  semiLoser: { en: 'Each losing semifinalist', ko: '4강 탈락자 각자', ja: '準決勝敗退者（各自）' },
  quarterLoser: { en: 'Each quarterfinal loser', ko: '8강 탈락자 각자', ja: '準々決勝敗退者（各自）' },
  marked: {
    en: '{match}: {a} and {b} are marked in the drivers table.',
    ko: '{match}: 드라이버 표에 {a}, {b} 표시됨.',
    ja: '{match}：ドライバー表で{a}と{b}を表示しました。',
  },
  unmarked: { en: 'No quarterfinal is marked.', ko: '표시된 8강 경기가 없습니다.', ja: '表示中の準々決勝はありません。' },
} satisfies Record<string, Tri>;

type DriverId = 'lindqvist' | 'okafor' | 'santamaria' | 'tanabe' | 'holm' | 'vandenberg' | 'marchetti' | 'kowalczyk';

interface Driver {
  id: DriverId;
  car: number;
  name: string;
  country: Tri;
  team: string;
  age: number;
  wins: number;
  points: number;
  /** Best lap at Harbour Loop, in seconds, and as printed. */
  best: number;
  bestText: string;
}

const DRIVERS: Driver[] = [
  { id: 'lindqvist', car: 7, name: 'Mara Lindqvist', country: { en: 'Sweden', ko: '스웨덴', ja: 'スウェーデン' }, team: 'Nordlys Racing', age: 24, wins: 5, points: 71, best: 91.62, bestText: '1:31.62' },
  { id: 'okafor', car: 22, name: 'Tobi Okafor', country: { en: 'United Kingdom', ko: '영국', ja: 'イギリス' }, team: 'Redline Simsport', age: 27, wins: 3, points: 66, best: 91.76, bestText: '1:31.76' },
  { id: 'santamaria', car: 14, name: 'Iker Santamaría', country: { en: 'Spain', ko: '스페인', ja: 'スペイン' }, team: 'Vértice', age: 21, wins: 2, points: 58, best: 91.9, bestText: '1:31.90' },
  { id: 'tanabe', car: 3, name: 'Rei Tanabe', country: { en: 'Japan', ko: '일본', ja: '日本' }, team: 'Kaiten Racing', age: 19, wins: 1, points: 52, best: 91.71, bestText: '1:31.71' },
  { id: 'holm', car: 31, name: 'Jesper Holm', country: { en: 'Denmark', ko: '덴마크', ja: 'デンマーク' }, team: 'Nordlys Racing', age: 29, wins: 1, points: 49, best: 91.98, bestText: '1:31.98' },
  { id: 'vandenberg', car: 8, name: 'Noor van den Berg', country: { en: 'Netherlands', ko: '네덜란드', ja: 'オランダ' }, team: 'Polder Sim Team', age: 23, wins: 0, points: 44, best: 92.11, bestText: '1:32.11' },
  { id: 'marchetti', car: 55, name: 'Luca Marchetti', country: { en: 'Italy', ko: '이탈리아', ja: 'イタリア' }, team: 'Redline Simsport', age: 26, wins: 1, points: 40, best: 92.06, bestText: '1:32.06' },
  { id: 'kowalczyk', car: 12, name: 'Ola Kowalczyk', country: { en: 'Poland', ko: '폴란드', ja: 'ポーランド' }, team: 'Vistula Motorsport', age: 22, wins: 0, points: 38, best: 92.3, bestText: '1:32.30' },
];

const DRIVER_BY_ID = Object.fromEntries(DRIVERS.map((driver) => [driver.id, driver])) as Record<DriverId, Driver>;
const FASTEST = Math.min(...DRIVERS.map((driver) => driver.best));
// Seeds follow the points as they stand.
const SEED = Object.fromEntries([...DRIVERS].sort((a, b) => b.points - a.points).map((driver, index) => [driver.id, index + 1])) as Record<DriverId, number>;

interface Quarterfinal {
  id: string;
  time: string;
  a: DriverId;
  b: DriverId;
}

const QUARTERFINALS: Quarterfinal[] = [
  { id: 'QF1', time: '18:30', a: 'lindqvist', b: 'kowalczyk' },
  { id: 'QF2', time: '18:50', a: 'tanabe', b: 'holm' },
  { id: 'QF3', time: '19:10', a: 'okafor', b: 'marchetti' },
  { id: 'QF4', time: '19:30', a: 'santamaria', b: 'vandenberg' },
];

const SEMIFINALS = [
  { id: 'SF1', time: '20:15', from: ['QF1', 'QF2'] },
  { id: 'SF2', time: '20:40', from: ['QF3', 'QF4'] },
];

const PRIZES: Array<{ label: keyof typeof BRACKET; amount: string }> = [
  { label: 'winner', amount: '€4,000' },
  { label: 'runnerUp', amount: '€2,000' },
  { label: 'semiLoser', amount: '€1,000' },
  { label: 'quarterLoser', amount: '€500' },
];

type SortKey = 'points' | 'best';
type SortDir = 'ascending' | 'descending';

const TABLE = {
  title: { en: 'Drivers in the knockout', ko: '토너먼트 진출 드라이버', ja: 'ノックアウト進出ドライバー' },
  lead: {
    en: "The eight who would race on Sunday if Round 3 ended now. Best lap is each driver's fastest at Harbour Loop, tonight or in earlier events.",
    ko: '지금 3라운드가 끝난다면 일요일에 경기할 8명입니다. 최고 랩은 각 드라이버가 Harbour Loop에서 기록한 가장 빠른 랩으로, 오늘 밤 기록과 이전 대회 기록을 포함합니다.',
    ja: '第3戦が今終了した場合に日曜に走る8名です。ベストラップは、今夜または過去の大会でHarbour Loopにおける各ドライバーの最速ラップです。',
  },
  noMark: {
    en: 'Choose a quarterfinal in the bracket to mark its two drivers here.',
    ko: '대진표에서 8강 경기를 선택하면 두 드라이버가 여기에 표시됩니다.',
    ja: '対戦表で準々決勝を選ぶと、その2名がここに表示されます。',
  },
  mark: { en: 'Marked: {match} at {time}, {a} against {b}.', ko: '표시됨: {match} {time}, {a} 대 {b}.', ja: '表示中：{match} {time}、{a} 対 {b}。' },
  car: { en: 'No.', ko: '번호', ja: '番号' },
  carLong: { en: 'Car number', ko: '차량 번호', ja: '車番' },
  driver: { en: 'Driver', ko: '드라이버', ja: 'ドライバー' },
  from: { en: 'From', ko: '출신', ja: '出身' },
  team: { en: 'Team', ko: '팀', ja: 'チーム' },
  age: { en: 'Age', ko: '나이', ja: '年齢' },
  wins: { en: 'Wins in 2026', ko: '2026년 우승', ja: '2026年優勝' },
  points: { en: 'Points', ko: '포인트', ja: 'ポイント' },
  best: { en: 'Best lap', ko: '최고 랩', ja: 'ベストラップ' },
  fastest: { en: 'fastest of the eight', ko: '8명 중 최고', ja: '8名中最速' },
  inMatch: { en: 'in {match}', ko: '{match} 경기 중', ja: '{match}の試合' },
  statsNone: { en: 'Age {age}, no wins in 2026', ko: '나이 {age}, 2026년 우승 없음', ja: '年齢{age}、2026年優勝なし' },
  statsOne: { en: 'Age {age}, 1 win in 2026', ko: '나이 {age}, 2026년 우승 1회', ja: '年齢{age}、2026年優勝1回' },
  statsMany: { en: 'Age {age}, {wins} wins in 2026', ko: '나이 {age}, 2026년 우승 {wins}회', ja: '年齢{age}、2026年優勝{wins}回' },
  sortedPointsDesc: { en: 'Sorted by points, most first.', ko: '포인트 많은 순으로 정렬했습니다.', ja: 'ポイントの多い順に並べ替えました。' },
  sortedPointsAsc: { en: 'Sorted by points, fewest first.', ko: '포인트 적은 순으로 정렬했습니다.', ja: 'ポイントの少ない順に並べ替えました。' },
  sortedBestAsc: { en: 'Sorted by best lap, fastest first.', ko: '최고 랩 빠른 순으로 정렬했습니다.', ja: 'ベストラップの速い順に並べ替えました。' },
  sortedBestDesc: { en: 'Sorted by best lap, slowest first.', ko: '최고 랩 느린 순으로 정렬했습니다.', ja: 'ベストラップの遅い順に並べ替えました。' },
} satisfies Record<string, Tri>;

type DayId = 'sat' | 'sun';

interface Programme {
  /** Grid lines on the ten-minute grid from 18:00 (line 1) to 23:00 (line 31). */
  from: number;
  to: number;
  time: string;
  title: Tri;
  on?: boolean;
}

interface Lane {
  id: string;
  name: Tri;
  where: Tri;
  days: Record<DayId, Programme[]>;
}

const LANES: Lane[] = [
  {
    id: 'main',
    name: { en: 'Main broadcast', ko: '메인 방송', ja: 'メイン放送' },
    where: { en: 'Twitch and YouTube', ko: 'Twitch와 YouTube', ja: 'TwitchとYouTube' },
    days: {
      sat: [
        { from: 1, to: 4, time: '18:00', title: { en: 'Pre-show', ko: '프리쇼', ja: 'プレショー' } },
        { from: 4, to: 9, time: '18:30', title: { en: 'Round 1, Granite Ring', ko: '1라운드, Granite Ring', ja: '第1戦、Granite Ring' } },
        { from: 9, to: 12, time: '19:20', title: { en: 'Paddock', ko: '패독', ja: 'パドック' } },
        { from: 12, to: 18, time: '19:50', title: { en: 'Round 2, Ashford Park', ko: '2라운드, Ashford Park', ja: '第2戦、Ashford Park' } },
        { from: 19, to: 25, time: '21:00', title: { en: 'Round 3, Harbour Loop', ko: '3라운드, Harbour Loop', ja: '第3戦、Harbour Loop' }, on: true },
        { from: 25, to: 28, time: '22:00', title: { en: 'Results', ko: '결과', ja: '結果' } },
      ],
      sun: [
        { from: 1, to: 4, time: '18:00', title: { en: 'Pre-show', ko: '프리쇼', ja: 'プレショー' } },
        { from: 4, to: 13, time: '18:30', title: { en: 'Quarterfinals', ko: '8강', ja: '準々決勝' } },
        { from: 13, to: 19, time: '20:00', title: { en: 'Semifinals', ko: '4강', ja: '準決勝' } },
        { from: 19, to: 27, time: '21:00', title: { en: 'Final', ko: '결승', ja: '決勝' } },
        { from: 27, to: 30, time: '22:20', title: { en: 'Podium', ko: '시상식', ja: '表彰式' } },
      ],
    },
  },
  {
    id: 'onboard',
    name: { en: 'Onboard', ko: '온보드', ja: 'オンボード' },
    where: { en: 'Twitch, second channel', ko: 'Twitch, 두 번째 채널', ja: 'Twitch、2つ目のチャンネル' },
    days: {
      sat: [
        { from: 4, to: 9, time: '18:30', title: { en: 'Onboard, Round 1', ko: '온보드, 1라운드', ja: 'オンボード、第1戦' } },
        { from: 12, to: 18, time: '19:50', title: { en: 'Onboard, Round 2', ko: '온보드, 2라운드', ja: 'オンボード、第2戦' } },
        { from: 19, to: 25, time: '21:00', title: { en: 'Onboard, Round 3', ko: '온보드, 3라운드', ja: 'オンボード、第3戦' }, on: true },
      ],
      sun: [
        { from: 4, to: 13, time: '18:30', title: { en: 'Onboard, quarterfinals', ko: '온보드, 8강', ja: 'オンボード、準々決勝' } },
        { from: 13, to: 19, time: '20:00', title: { en: 'Onboard, semifinals', ko: '온보드, 4강', ja: 'オンボード、準決勝' } },
        { from: 19, to: 27, time: '21:00', title: { en: 'Onboard, final', ko: '온보드, 결승', ja: 'オンボード、決勝' } },
      ],
    },
  },
  {
    id: 'spanish',
    name: { en: 'Spanish', ko: '스페인어', ja: 'スペイン語' },
    where: { en: 'YouTube, with commentary in Spanish', ko: 'YouTube, 스페인어 해설', ja: 'YouTube、スペイン語実況' },
    days: {
      sat: [{ from: 4, to: 28, time: '18:30', title: { en: 'Rounds 1 to 3 and results', ko: '1~3라운드 및 결과', ja: '第1〜3戦と結果' }, on: true }],
      sun: [{ from: 4, to: 30, time: '18:30', title: { en: 'Knockout and podium', ko: '토너먼트 및 시상식', ja: 'ノックアウトと表彰式' } }],
    },
  },
];

const AXIS_TIMES = ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
// Saturday, 21:33: 213 of the 300 minutes from 18:00 to 23:00.
const NOW_TIME = '21:33';
const NOW_AT = (213 / 300) * 100;

const SCHEDULE = {
  title: { en: 'On air this weekend', ko: '이번 주말 방송', ja: '今週末の放送' },
  lead: {
    en: 'All times are CET. The main broadcast has English commentary. The onboard feed follows whoever leads the race.',
    ko: '모든 시간은 CET 기준입니다. 메인 방송은 영어 해설로 진행됩니다. 온보드 방송은 선두 드라이버를 따라갑니다.',
    ja: '時刻はすべてCET基準です。メイン放送は英語の実況で行われます。オンボード放送は、レースをリードしているドライバーを追いかけます。',
  },
  day: { en: 'Day', ko: '요일', ja: '曜日' },
  sat: { en: 'Saturday 21', ko: '토 21일', ja: '土 21日' },
  sun: { en: 'Sunday 22', ko: '일 22일', ja: '日 22日' },
  satLong: { en: 'Saturday 21 November', ko: '11월 21일 토요일', ja: '11月21日(土)' },
  sunLong: { en: 'Sunday 22 November', ko: '11월 22일 일요일', ja: '11月22日(日)' },
  grid: { en: 'Broadcasts on {day}', ko: '{day} 방송 편성', ja: '{day}の放送予定' },
  showing: { en: 'Showing the broadcasts on {day}.', ko: '{day} 방송을 표시합니다.', ja: '{day}の放送を表示しています。' },
  onAir: { en: 'On air now', ko: '방송 중', ja: '放送中' },
  until: { en: 'until {time}', ko: '{time}까지', ja: '{time}まで' },
} satisfies Record<string, Tri>;

const lineTime = (line: number) => {
  const minutes = 18 * 60 + (line - 1) * 10;
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;
};

const RULES = {
  title: { en: 'Rules for tonight', ko: '오늘 밤 규정', ja: '今夜のルール' },
  lead: {
    en: 'The stewards are Petra Novak and Daniel Reyes. A penalty shows on the timing tower within two laps and is announced on the main broadcast.',
    ko: '심판은 Petra Novak과 Daniel Reyes입니다. 페널티는 2랩 안에 순위표에 표시되며, 메인 방송에서 발표합니다.',
    ja: '審査役はPetra NovakとDaniel Reyesです。ペナルティは2周以内に順位表へ表示され、メイン放送で発表されます。',
  },
  penaltyHead: { en: 'Penalty', ko: '페널티', ja: 'ペナルティ' },
  rows: [
    {
      term: { en: 'Pit window', ko: '피트 윈도우', ja: 'ピットウィンドウ' },
      body: { en: 'One compulsory stop between laps 10 and 20, with a change of tyre compound.', ko: '10랩에서 20랩 사이에 피트 정차 1회가 의무이며, 타이어 컴파운드를 바꿔야 합니다.', ja: '10周目から20周目の間にピットストップを1回行う必要があり、タイヤのコンパウンドを変えなければなりません。' },
      penalty: { en: 'Drive-through if missed', ko: '미이행 시 드라이브스루', ja: '未実施の場合はドライブスルー' },
      none: false,
    },
    {
      term: { en: 'Pit lane speed', ko: '피트레인 속도', ja: 'ピットレーン速度' },
      body: { en: '60 km/h from the entry line to the exit line. The limiter must be on before the entry line.', ko: '진입 라인부터 진출 라인까지 60km/h입니다. 진입 라인 전에 스피드 리미터를 켜야 합니다.', ja: '進入ラインから退出ラインまで時速60kmです。進入ラインの手前でリミッターをオンにしなければなりません。' },
      penalty: { en: 'Drive-through', ko: '드라이브스루', ja: 'ドライブスルー' },
      none: false,
    },
    {
      term: { en: 'Track limits', ko: '트랙 리미트', ja: 'トラックリミット' },
      body: { en: 'All four wheels past the white line. Three are allowed; the fourth earns a penalty, and every two after that earn another.', ko: '네 바퀴 모두 흰색 라인을 넘으면 위반입니다. 3회까지는 허용되며, 4회째부터 페널티를 받고 그 뒤로는 2회마다 페널티가 추가됩니다.', ja: '4輪すべてが白線を越えた場合が対象です。3回までは許容され、4回目からペナルティを受け、その後は2回ごとにペナルティが加算されます。' },
      penalty: { en: '+5 s', ko: '+5초', ja: '+5秒' },
      none: false,
    },
    {
      term: { en: 'Causing a collision', ko: '접촉 유발', ja: '接触の誘発' },
      body: { en: 'The stewards review contact from replays during the race and decide within two laps.', ko: '심판은 경기 중 리플레이로 접촉을 검토하며 2랩 안에 결정합니다.', ja: '審査役は、レース中にリプレイで接触を確認し、2周以内に判定します。' },
      penalty: { en: '+5 s to drive-through', ko: '+5초 또는 드라이브스루', ja: '+5秒またはドライブスルー' },
      none: false,
    },
    {
      term: { en: 'Unsafe rejoin', ko: '위험한 복귀', ja: '危険な再合流' },
      body: { en: 'Coming back onto the track into the path of another car.', ko: '다른 차량의 진로에 끼어들며 트랙에 복귀하는 경우입니다.', ja: '他車の進路に割り込んでコースに復帰した場合です。' },
      penalty: { en: '+10 s', ko: '+10초', ja: '+10秒' },
      none: false,
    },
    {
      term: { en: 'Disconnection', ko: '접속 끊김', ja: '切断' },
      body: { en: 'Before the end of lap 1, the race restarts. After that, the driver is classified at the last lap they completed.', ko: '1랩이 끝나기 전이라면 레이스를 재시작합니다. 그 이후에는 완료한 마지막 랩을 기준으로 순위가 집계됩니다.', ja: '1周目が終わる前であればレースを再開します。それ以降は、完了した最後のラップで順位が確定します。' },
      penalty: { en: 'No penalty', ko: '페널티 없음', ja: 'ペナルティなし' },
      none: true,
    },
  ],
};

const FOOT = {
  about: { en: 'An online sim racing league, racing at night since 2021.', ko: '2021년부터 밤에 경기를 열고 있는 온라인 시뮬 레이싱 리그입니다.', ja: '2021年から夜間にレースを行っているオンラインシム・レーシングリーグです。' },
  watch: { en: 'Broadcast', ko: '방송', ja: '放送' },
  watchValue: { en: 'Twitch and YouTube, in English and Spanish.', ko: 'Twitch와 YouTube, 영어와 스페인어 방송.', ja: 'TwitchとYouTube、英語とスペイン語。' },
  protests: { en: 'Protests', ko: '이의 제기', ja: '抗議' },
  protestsValue: {
    en: "To race control within 30 minutes of the chequered flag, from the driver's own account.",
    ko: '체커기 후 30분 이내에 드라이버 본인 계정으로 레이스 컨트롤에 제출합니다.',
    ja: 'チェッカーフラッグから30分以内に、ドライバー本人のアカウントからレースコントロールへ提出します。',
  },
} satisfies Record<string, Tri>;

const PROMPT_EN = `Design one real page in the Neon Drift style: a matte near-black broadcast screen where neon lives only on keylines, traces and focus, set in one squared, cut-corner family.

Pick a believable subject that lives on live numbers read at night, such as a sim racing league on race night, a night marathon's live tracker or a late-night esports final, and write its real content. The page must read as that subject's page, never as a page about its own style. Here it is Apex Circuit, an online sim racing league, on the Saturday of its Night Cup: Round 3 at Harbour Loop is on lap 18 of 30. The page holds the race as it runs, Sunday's knockout, the drivers, what is on air and the rules.

TOKENS:
--bg: #05070f
--panel: #08101c (the tower, the matches, the on-air grid)
--surface: #0c1626 (opaque: programme blocks and any menu that opens over the page)
--ink: #e5f4ff
--muted: #9db5c9 (secondary text, a pit stop already made)
--dim: #7d93a9 (column headers, sort buttons at rest, seeds, chart axis figures)
--line: rgba(157,181,201,0.34)
--line-strong: rgba(157,181,201,0.56)
--row: rgba(157,181,201,0.24) (rows inside a table, laps still to go)
--grid: rgba(157,181,201,0.16) (chart and time-grid lines only)
--teal: #2ef2d5
--teal-ink: #03110e (text on teal)
--coral: #ff745f
--magenta: #ff4ed8
Page background: radial-gradient(1100px 520px at 18% -40px, teal at 0.07, transparent 62%) over --bg. The console: linear-gradient(160deg, #0b1320, #05080f 62%).

COLOUR:
- Teal is the leader, what is live and the active choice: the leader's row and readouts, the leader's trace, laps done (at 0.5) and the current lap, the "Watch live" button, pressed toggles, the sorted column, the chosen quarterfinal and the drivers it marks, the final, programmes on air and the now line, a personal-best lap, the winner's prize, focus rings, and the console's top keyline and corner brackets. Washes of teal sit at 0.08 to 0.12.
- Coral is pits and penalties: the on-air mark, the pit window (bar, shaded band at 0.07, label), "In pit", the leader's "Not yet", a penalty tag and its note, P2's dashed trace and the penalty column of the rules.
- Magenta marks only the fastest lap. No other colours; no gradients on text or buttons.
- Hover: links, toggles and sort buttons turn from muted or dim to ink; the solid teal button turns outlined in teal; a quarterfinal gets the strong line. The shell's own controls are ink, with an ink wash at 6% on hover.
- Structural lines are 1px at 0.34; rows inside a table at 0.24.

TYPOGRAPHY:
One family, Chakra Petch: 400, 500, 600, 700, and italic 500 to 700.
H1: italic 600, clamp(2.25rem, 4.4vw, 3.75rem), line-height 1.02, letter-spacing -0.015em, balanced on two lines.
H2: 600, clamp(1.75rem, 2.9vw, 2.375rem), line-height 1.
The lap count: italic 700, clamp(4.75rem, 9vw, 7.5rem), line-height 0.76, letter-spacing -0.03em; "Lap" and "of 30" in 600 at 1.25rem.
Car numbers: italic 700 at 1.5rem. The league name: italic 700 at 1.25rem.
Tower: title 500 at 1.125rem; names 500 at 1.0625rem with initials in 400; positions 700, gaps and last laps 600, all at 1rem. Leader readouts 500 at 1.75rem (1.5rem on phones). Match names 500 at 1.0625rem; round titles 700 at 1.25rem; driver names 500 at 1.125rem; table figures 600 at 1.0625rem; rule names 600 and penalties 700 at 1.25rem; programme titles 500 at 1rem; feed names 700 at 1.125rem.
Body 400 at 1rem, line-height 1.65. Labels, column headers, notes and buttons at 1rem. Only the chart's axis figures, its pit-window label and its fastest-lap figure (hidden from assistive technology, repeated in text beside the chart) go to 0.875rem on phones. Figures are lining; times, gaps and points are tabular.

LAYOUT:
- A top bar: the league name with a one-line chevron mark, five in-page links and the solid teal "Watch live". It stands on the console's top line and has no rule of its own.
- Hero: one console frame (1px line, a teal keyline fading in along its top edge, four 18px teal corner brackets), a chrome strip with the event, the coral on-air mark and the race time, then a 5:7 grid on desktop. Left: the timing tower from the top, as a broadcast places it, with the penalty note and the pit-stop key under it. Right: the H1 and one paragraph, the lap counter (the count right-aligned over 30 segments with 3px gaps, and a coral pit-window bar under laps 10 to 20), and the leader's four readouts under a 3px teal keyline. Under both, full width: the lap-time trace. The whole tower and the lap counter are on the first screen of a 1280x800 laptop. Below 1080px the hero stacks: headline, lap counter, tower, readouts, trace.
- Then Sunday's knockout, the drivers, on air this weekend, the rules and a three-column footer.
- A 1120px column, sections 112px apart (88px on phones).

COMPONENTS:
- Timing tower: a bordered panel with "Top 10 of 20" and a two-button toggle (Gap to leader, Interval; aria-pressed) that recomputes the time column and its header; rows of 36px with position, driver, time, last lap and a pit-stop square (empty, filled muted once made, coral with a glow while in the pits). The leader's row has a teal wash and a 3px teal keyline; a penalty shows as a coral outlined tag after the name. On narrow phones the tower runs edge to edge inside the console and the squares stand in front of the names.
- Lap-time trace: the leader in a solid teal line with a soft glow, P2 in a dashed coral line, on a ruled field with the pit window shaded coral, a dashed now line at lap 18, a square magenta mark on the fastest lap and a square teal mark on the last lap. Faster is higher. It has a text alternative.
- Bracket: three rounds with drawn 1px connectors. The four quarterfinals are toggle buttons; choosing one marks it in teal and marks both its drivers in the drivers table with a teal wash, a 3px keyline and a tag naming the match. Semifinals and the final list "Winner of" lines; the final has a teal edge and a soft glow. Prize money hangs under the final.
- Drivers table: car number, driver, from, team, age, wins, points and best lap; Points and Best lap are sort buttons in their headers with aria-sort (points most first, best lap fastest first; pressing again reverses). On narrower screens the team, then the country, age and wins move under the name; on the narrowest phones the car number stands in front of the name.
- On air: a Saturday and Sunday toggle (aria-pressed) over a time grid from 18:00 to 23:00 in ten-minute columns, one lane per feed; programmes are blocks on --surface, the ones on air have a teal edge and wash, and a dashed teal now line carries the time in a teal flag. Below 1180px each feed becomes a column of times, and on phones one list.
- Rules: a ruled list of term, what it means and the penalty in coral.
- Square corners everywhere, 1px lines, no shadows except the soft glows on the live marks and the focus halo.

MOTION:
- A 160ms colour change on hover. Nothing moves on its own; the race clock and the lap count are a still frame. prefers-reduced-motion removes the transitions.

FORBIDDEN:
- Cards, rounded corners, pills, chips, glass panels, gradient text, neon fog, orbs, large glow halos
- A small label above a heading, all-caps tracked labels, numbered section markers
- Neon on text blocks or headings, purple-blue gradient backgrounds, random sci-fi abbreviations
- Car or helmet illustrations, track maps, photographs, emoji
- Arrows on links, middle-dot meta strings, numbers on anything that is not a real sequence
- Copy about neon, glow, the style or the design

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML: tables for the tower and the drivers, a figure with a text alternative for the trace, toggle buttons with aria-pressed, sort buttons in the column headers with aria-sort
3) A working gap toggle, day toggle, table sort and quarterfinal marking, each announced once in a polite live region
4) Responsive layout down to 320px with no horizontal scroll and no text under 1rem outside the chart
5) Visible focus on every control, 44px touch targets on phones, reduced-motion support`;

const PROMPT_KO = `Neon Drift 스타일의 실제 페이지 하나를 디자인한다: 무광의 거의 검은 방송 화면이며, 네온은 키라인, 트레이스, 포커스에만 쓰고, 모서리를 잘라낸 각진 서체 계열 하나로 구성한다.

밤에 실시간 숫자를 읽는 현실적인 주제를 고르고, 실제 콘텐츠를 쓴다. 예를 들면 레이스 나이트의 시뮬 레이싱 리그, 야간 마라톤의 실시간 트래커, 늦은 밤 e스포츠 결승이다. 페이지는 그 주제의 페이지로 읽혀야 하며, 스타일 자체에 관한 페이지로 읽혀서는 안 된다. 여기서는 온라인 시뮬 레이싱 리그 Apex Circuit의 Night Cup 토요일로, 3라운드 Harbour Loop가 30랩 중 18랩을 달리고 있다. 페이지는 진행 중인 레이스, 일요일 토너먼트, 드라이버, 지금 방송 중인 편성, 규정을 담는다.

TOKENS:
--bg: #05070f
--panel: #08101c (순위표, 대진, 방송 편성 격자)
--surface: #0c1626 (불투명: 편성 블록과 페이지 위에 열리는 모든 메뉴)
--ink: #e5f4ff
--muted: #9db5c9 (보조 텍스트, 이미 마친 피트 정차)
--dim: #7d93a9 (열 머리글, 평소 상태의 정렬 버튼, 시드, 차트 축 숫자)
--line: rgba(157,181,201,0.34)
--line-strong: rgba(157,181,201,0.56)
--row: rgba(157,181,201,0.24) (표 안의 행, 남은 랩)
--grid: rgba(157,181,201,0.16) (차트와 시간 격자 선에만 사용)
--teal: #2ef2d5
--teal-ink: #03110e (청록 위의 텍스트)
--coral: #ff745f
--magenta: #ff4ed8
페이지 배경: --bg 위에 radial-gradient(1100px 520px at 18% -40px, teal at 0.07, transparent 62%). 콘솔: linear-gradient(160deg, #0b1320, #05080f 62%).

COLOUR:
- 청록은 선두, 실시간 상태, 활성 선택을 뜻한다: 선두 행과 수치, 선두의 트레이스, 완료한 랩(0.5)과 현재 랩, "생중계 보기" 버튼, 눌린 토글, 정렬된 열, 선택한 8강과 그 경기가 표시하는 드라이버, 결승, 방송 중인 편성과 현재 시간선, 개인 최고 랩, 우승 상금, 포커스 링, 콘솔 상단 키라인과 모서리 브래킷. 청록의 옅은 바탕은 0.08~0.12로 쓴다.
- 코랄은 피트와 페널티를 뜻한다: 방송 중 표시, 피트 윈도우(바, 0.07 음영 띠, 라벨), "피트 중", 선두의 "아직", 페널티 태그와 그 주석, 2위의 점선 트레이스, 규정의 페널티 열.
- 마젠타는 최고 랩 표시에만 쓴다. 다른 색은 쓰지 않으며, 텍스트나 버튼에 그라데이션을 쓰지 않는다.
- 호버: 링크, 토글, 정렬 버튼은 muted 또는 dim에서 ink로 바뀐다. 채워진 청록 버튼은 청록 외곽선으로 바뀐다. 8강 경기는 진한 선을 얻는다. 셸 자체 컨트롤은 ink이며, 호버 시 6% ink 바탕을 쓴다.
- 구조선은 1px, 투명도 0.34로 쓴다. 표 안의 행은 0.24로 쓴다.

TYPOGRAPHY:
서체 계열은 하나, Chakra Petch를 쓴다: 400, 500, 600, 700과 italic 500~700.
H1: italic 600, clamp(2.25rem, 4.4vw, 3.75rem), line-height 1.02, letter-spacing -0.015em, 두 줄로 균형 있게 나눈다.
H2: 600, clamp(1.75rem, 2.9vw, 2.375rem), line-height 1.
랩 수: italic 700, clamp(4.75rem, 9vw, 7.5rem), line-height 0.76, letter-spacing -0.03em. "랩"과 "/ 30"은 600, 1.25rem.
차량 번호: italic 700, 1.5rem. 리그 이름: italic 700, 1.25rem.
순위표: 제목 500, 1.125rem. 이름 500, 1.0625rem, 이니셜은 400. 순위는 700, 차이와 직전 랩은 600, 모두 1rem. 선두 수치 500, 1.75rem(휴대폰에서는 1.5rem). 대진 이름 500, 1.0625rem. 라운드 제목 700, 1.25rem. 드라이버 이름 500, 1.125rem. 표 숫자 600, 1.0625rem. 규정 항목 이름 600, 페널티 700, 모두 1.25rem. 편성 제목 500, 1rem. 채널 이름 700, 1.125rem.
본문 400, 1rem, line-height 1.65. 라벨, 열 머리글, 주석, 버튼은 모두 1rem. 차트 축 숫자, 피트 윈도우 라벨, 최고 랩 숫자(보조 기술에는 숨기고 차트 옆 글로 반복)만 휴대폰에서 0.875rem으로 줄인다. 숫자는 lining을 쓰고, 시간, 차이, 포인트는 tabular를 쓴다.

LAYOUT:
- 상단 바: 리그 이름과 한 줄짜리 꺾쇠 마크, 페이지 내 링크 5개, 채워진 청록 "생중계 보기". 콘솔의 상단선 위에 놓이며 자체 구분선은 없다.
- 히어로: 콘솔 프레임 하나(1px 선, 위쪽 가장자리를 따라 옅어지는 청록 키라인, 18px 청록 모서리 브래킷 4개), 행사 이름과 코랄 방송 중 표시와 레이스 시간을 담은 크롬 띠, 데스크톱에서는 그 아래 5:7 격자. 왼쪽: 방송처럼 위에서부터 배치한 순위표, 그 아래 페널티 주석과 피트 정차 범례. 오른쪽: H1과 문단 하나, 랩 카운터(30칸 세그먼트를 3px 간격으로 우측 정렬하고, 10~20랩 아래에 코랄 피트 윈도우 바), 그 아래 3px 청록 키라인으로 구분한 선두 수치 4개. 두 열 아래 전체 너비에 랩 타임 트레이스. 순위표 전체와 랩 카운터는 1280x800 노트북의 첫 화면에 들어간다. 1080px 미만에서는 히어로가 세로로 쌓인다: 제목, 랩 카운터, 순위표, 수치, 트레이스.
- 이어서 일요일 토너먼트, 드라이버, 이번 주말 방송, 규정, 세 열 푸터.
- 1120px 칼럼, 섹션 간격 112px(휴대폰에서는 88px).

COMPONENTS:
- 순위표: "상위 10명 (전체 20명)" 제목이 있는 테두리 패널과 2버튼 토글(선두와의 차이, 간격; aria-pressed). 토글은 시간 열과 그 머리글을 다시 계산한다. 행 높이 36px, 순위, 드라이버, 시간, 직전 랩, 피트 정차 사각형(빈 상태, 완료 후 muted로 채움, 피트 중에는 빛나는 코랄). 선두 행에는 청록 바탕과 3px 청록 키라인을 준다. 페널티는 이름 뒤에 코랄 외곽선 태그로 표시한다. 좁은 휴대폰에서는 순위표가 콘솔 안에서 가장자리까지 채우고, 사각형이 이름 앞에 놓인다.
- 랩 타임 트레이스: 선두는 부드러운 빛이 도는 실선 청록, 2위는 점선 코랄. 피트 윈도우를 코랄로 음영 처리한 눈금 바탕 위에, 18랩에 점선 현재선, 최고 랩에 사각형 마젠타 표시, 마지막 랩에 사각형 청록 표시를 둔다. 빠를수록 위에 있다. 텍스트 대체 설명을 둔다.
- 대진표: 1px 연결선을 그린 3개 라운드. 8강 4경기는 토글 버튼이다. 하나를 고르면 청록으로 표시되고, 드라이버 표에서 그 경기의 두 드라이버에 청록 바탕, 3px 키라인, 경기 이름을 밝히는 태그를 준다. 4강과 결승은 "…승자" 줄로 나열한다. 결승은 청록 가장자리와 부드러운 빛을 가진다. 상금은 결승 아래에 걸린다.
- 드라이버 표: 차량 번호, 드라이버, 출신, 팀, 나이, 우승, 포인트, 최고 랩. 포인트와 최고 랩은 머리글의 정렬 버튼이며 aria-sort를 쓴다(포인트는 많은 순, 최고 랩은 빠른 순으로 시작하고, 다시 누르면 반대가 된다). 좁은 화면에서는 팀, 다음으로 국가, 나이, 우승을 이름 아래로 옮기고, 가장 좁은 휴대폰에서는 차량 번호를 이름 앞에 둔다.
- 방송 편성: 토요일과 일요일 토글(aria-pressed) 아래에 18:00~23:00의 10분 단위 열로 된 시간 격자, 채널마다 한 줄. 편성 블록은 --surface 위에 놓으며, 방송 중인 블록은 청록 가장자리와 바탕을 가진다. 점선 청록 현재선은 청록 깃발 안에 시각을 표시한다. 1180px 미만에서는 채널마다 시간 열이 되고, 휴대폰에서는 하나의 목록이 된다.
- 규정: 용어, 뜻, 코랄 색 페널티를 담은 선 목록.
- 모서리는 모두 직각, 선은 1px. 그림자는 없으며, 방송 표시와 포커스 halo의 부드러운 빛만 예외로 둔다.

MOTION:
- 호버 시 160ms 색 변화. 스스로 움직이는 것은 없다. 레이스 시계와 랩 카운터는 정지된 한 장면이다. prefers-reduced-motion에서는 전환을 없앤다.

FORBIDDEN:
- 카드, 둥근 모서리, 필(pill), 칩, 유리 패널, 그라데이션 텍스트, 네온 안개, 오브, 큰 빛 halo 금지
- 제목 위의 작은 라벨, 대문자에 자간을 넓힌 라벨, 번호 섹션 표시 금지
- 텍스트 블록이나 제목에 네온 금지, 보라-파랑 그라데이션 배경 금지, 임의의 SF 약어 금지
- 차량이나 헬멧 일러스트, 트랙 지도, 사진, 이모지 금지
- 링크의 화살표, 가운뎃점으로 이은 메타 문자열, 실제 순서가 아닌 것에 붙인 번호 금지
- 네온, 빛, 스타일, 디자인에 관한 문구 금지

OUTPUT:
1) 위 토큰을 담은 CSS 커스텀 속성
2) 시맨틱 HTML: 순위표와 드라이버는 표, 트레이스는 텍스트 대체 설명이 있는 figure, aria-pressed 토글 버튼, 열 머리글에 aria-sort를 단 정렬 버튼
3) 작동하는 차이 토글, 요일 토글, 표 정렬, 8강 표시. 각 동작은 polite 라이브 영역에서 한 번씩 알린다.
4) 320px까지 반응형으로 구성하고 가로 스크롤을 두지 않는다. 차트 밖의 텍스트는 1rem보다 작게 하지 않는다.
5) 모든 컨트롤에 보이는 포커스, 휴대폰에서 44px 터치 영역, reduced-motion 지원.`;

const PROMPT_JA = `Neon Driftスタイルで実在のページを1つデザインする。つや消しの漆黒に近い放送画面で、ネオンはキーライン、トレース、フォーカスにだけ使い、角を落とした角張った書体ファミリー1つで組む。

夜にライブの数字を読む現実的なテーマを選び、実際のコンテンツを書く。例：レースナイトのシムレーシングリーグ、夜間マラソンのライブトラッカー、深夜のeスポーツ決勝。ページはそのテーマのページとして読めなければならず、スタイルそのものについてのページに見えてはならない。ここではオンラインシムレーシングリーグ Apex Circuit のNight Cup土曜日を扱う。第3戦 Harbour Loop は30周中18周目。ページは進行中のレース、日曜のノックアウト、ドライバー、今放送中の番組、規定を載せる。

TOKENS:
--bg: #05070f
--panel: #08101c（順位表、対戦、放送グリッド）
--surface: #0c1626（不透明：番組ブロックと、ページの上に開くメニュー）
--ink: #e5f4ff
--muted: #9db5c9（補助テキスト、ピットストップ済み）
--dim: #7d93a9（列見出し、通常時の並べ替えボタン、シード、チャート軸の数字）
--line: rgba(157,181,201,0.34)
--line-strong: rgba(157,181,201,0.56)
--row: rgba(157,181,201,0.24)（表の中の行、残りのラップ）
--grid: rgba(157,181,201,0.16)（チャートと時間グリッドの線のみ）
--teal: #2ef2d5
--teal-ink: #03110e（ティールの上の文字）
--coral: #ff745f
--magenta: #ff4ed8
ページ背景：--bg の上に radial-gradient(1100px 520px at 18% -40px, teal at 0.07, transparent 62%)。コンソール：linear-gradient(160deg, #0b1320, #05080f 62%)。

COLOUR:
- ティールは先頭、ライブ中のもの、選択中のものを示す：先頭の行と数値、先頭のトレース、完了ラップ（0.5）と現在のラップ、「ライブ視聴」ボタン、押された切り替え、並べ替えた列、選んだ準々決勝とその2名、決勝、放送中の番組と現在線、自己ベストラップ、優勝賞金、フォーカスリング、コンソール上端のキーラインとコーナーブラケット。ティールの薄い塗りは0.08〜0.12。
- コーラルはピットとペナルティを示す：放送中のマーク、ピットウィンドウ（バー、0.07の帯、ラベル）、「ピット中」、先頭の「まだ」、ペナルティのタグと注記、2位の破線トレース、規則のペナルティ列。
- マゼンタは最速ラップだけに使う。他の色は使わない。文字やボタンにグラデーションを使わない。
- ホバー：リンク、切り替え、並べ替えボタンは補助色または dim から ink に変わる。塗りつぶしのティールボタンはティールの枠線に変わる。準々決勝は強い線になる。シェル自体のコントロールは ink で、ホバー時は6%の ink の薄い塗り。
- 構造線は1px、0.34。表の中の行は0.24。

TYPOGRAPHY:
書体ファミリーは1つ、Chakra Petch：400、500、600、700、およびイタリック500〜700。
H1：イタリック600、clamp(2.25rem, 4.4vw, 3.75rem)、line-height 1.02、letter-spacing -0.015em、2行にバランスよく収める。
H2：600、clamp(1.75rem, 2.9vw, 2.375rem)、line-height 1。
ラップ数：イタリック700、clamp(4.75rem, 9vw, 7.5rem)、line-height 0.76、letter-spacing -0.03em。「ラップ」と「/ 30」は600、1.25rem。
車番：イタリック700、1.5rem。リーグ名：イタリック700、1.25rem。
順位表：タイトル500、1.125rem。名前500、1.0625rem、イニシャルは400。順位は700、差と直前のラップは600、すべて1rem。先頭の数値500、1.75rem（スマートフォンでは1.5rem）。対戦名500、1.0625rem。ラウンドのタイトル700、1.25rem。ドライバー名500、1.125rem。表の数字600、1.0625rem。規則の項目名600、ペナルティ700、いずれも1.25rem。番組名500、1rem。チャンネル名700、1.125rem。
本文400、1rem、line-height 1.65。ラベル、列見出し、注記、ボタンはすべて1rem。チャートの軸の数字、ピットウィンドウのラベル、最速ラップの数字（支援技術からは隠し、チャート横のテキストで繰り返す）だけは、スマートフォンで0.875remにする。数字は lining、時刻・差・ポイントは tabular を使う。

LAYOUT:
- 上部バー：リーグ名と一行のシェブロン記号、ページ内リンク5つ、塗りつぶしのティール「ライブ視聴」。コンソールの上端線の上にあり、独自の罫線は持たない。
- ヒーロー：コンソールの枠1つ（1pxの線、上端に沿って消えていくティールのキーライン、18pxのティールのコーナーブラケット4つ）。イベント名、コーラルの放送中マーク、レース時間を載せたクロームの帯。デスクトップではその下に5:7のグリッド。左：放送のように上から配置した順位表、その下にペナルティ注記とピットストップの凡例。右：H1と段落1つ、ラップカウンター（30区画を3px間隔で右揃えにし、10〜20周の下にコーラルのピットウィンドウバー）、その下に3pxのティールのキーラインで区切った先頭の4つの数値。両方の下、全幅にラップタイムのトレース。順位表全体とラップカウンターは、1280x800のノートPCの最初の画面に収まる。1080px未満ではヒーローが縦に積まれる：見出し、ラップカウンター、順位表、数値、トレース。
- 続けて、日曜のノックアウト、ドライバー、今週末の放送、規定、3列のフッター。
- 1120pxのカラム、セクション間隔112px（スマートフォンでは88px）。

COMPONENTS:
- 順位表：「上位10名（全20名）」の見出しがある枠付きパネルと、2ボタンの切り替え（トップとの差、インターバル；aria-pressed）。切り替えで時間の列とその見出しを再計算する。行の高さは36px。順位、ドライバー、時間、直前のラップ、ピットストップの四角（空欄、済んだら muted で塗る、ピット中は光るコーラル）。先頭の行にはティールの薄い塗りと3pxのティールのキーライン。ペナルティは名前の後にコーラルの外枠タグとして表示する。狭いスマートフォンでは、順位表はコンソール内で端から端まで広がり、四角は名前の前に置く。
- ラップタイムのトレース：先頭は柔らかい光を帯びた実線のティール、2位は破線のコーラル。ピットウィンドウをコーラルで陰影づけした罫線付きの地に、18周目に破線の現在線、最速ラップに四角いマゼンタの印、最終ラップに四角いティールの印を置く。速いほど上。テキストによる代替説明を持つ。
- 対戦表：1pxの接続線を引いた3つのラウンド。準々決勝の4試合はトグルボタン。ひとつを選ぶとティールで示され、ドライバー表でその2名にティールの薄い塗り、3pxのキーライン、試合名を示すタグを付ける。準決勝と決勝は「…の勝者」の行として並べる。決勝にはティールの縁と柔らかい光をつける。賞金は決勝の下に掛けて示す。
- ドライバー表：車番、ドライバー、出身、チーム、年齢、優勝、ポイント、ベストラップ。ポイントとベストラップはヘッダーの並べ替えボタンで、aria-sort を持つ（ポイントは多い順、ベストラップは速い順で始まり、もう一度押すと逆になる）。狭い画面ではチーム、次に国、年齢、優勝を名前の下へ移す。最も狭いスマートフォンでは車番を名前の前に置く。
- 放送編成：土曜と日曜の切り替え（aria-pressed）の下に、18:00〜23:00の10分単位の列からなる時間グリッド。フィードごとに1レーン。番組は --surface の上のブロックで、放送中のものはティールの縁と薄い塗りを持つ。破線のティールの現在線は、ティールの旗の中に時刻を示す。1180px未満では各フィードが時刻の列になり、スマートフォンでは1つのリストになる。
- 規則：用語、意味、コーラルのペナルティを並べた罫線付きのリスト。
- 角はすべて直角、線は1px。影はなく、放送中のマークとフォーカスのハローの柔らかい光だけが例外。

MOTION:
- ホバー時に160msの色の変化。自動で動くものはない。レースの時計とラップカウンターは静止画。prefers-reduced-motion では移行をなくす。

FORBIDDEN:
- カード、角丸、ピル、チップ、ガラスパネル、グラデーション文字、ネオンの霧、オーブ、大きな光のハロー禁止
- 見出しの上の小さなラベル、大文字で字間を広げたラベル、番号付きのセクション表示禁止
- テキストブロックや見出しへのネオン、紫と青のグラデーション背景、意味のないSF風の略語禁止
- 車やヘルメットのイラスト、コース図、写真、絵文字禁止
- リンクの矢印、中黒でつないだメタ文字列、実際の順序でないものへの番号禁止
- ネオン、光、スタイル、デザインについての文言禁止

OUTPUT:
1) 上のトークンのCSSカスタムプロパティ
2) セマンティックHTML：順位表とドライバーは表、トレースはテキスト代替付きの figure、aria-pressed の切り替えボタン、列見出しに aria-sort を付けた並べ替えボタン
3) 動作する差の切り替え、曜日の切り替え、表の並べ替え、準々決勝の選択。それぞれ polite のライブ領域で一度ずつ告知する
4) 320pxまでレスポンシブに、横スクロールなしで。チャート外のテキストは1rem未満にしない
5) すべてのコントロールに見えるフォーカス、スマートフォンでは44pxのタッチ領域、reduced-motion 対応`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_KO, ja: PROMPT_JA };

function SortIcon({ dir }: { dir: SortDir | null }) {
  return (
    <svg className="ac-sort__icon" viewBox="0 0 12 12" width={12} height={12} fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
      {dir === null ? (
        <>
          <polyline points="3 4.5 6 1.5 9 4.5" />
          <polyline points="3 7.5 6 10.5 9 7.5" />
        </>
      ) : dir === 'ascending' ? (
        <polyline points="2.5 7.5 6 4 9.5 7.5" />
      ) : (
        <polyline points="2.5 4.5 6 8 9.5 4.5" />
      )}
    </svg>
  );
}

export function PortedNeonDriftPage({ lang }: PortedStylePageProps) {
  const [mode, setMode] = useState<TimeMode>('gap');
  const [day, setDay] = useState<DayId>('sat');
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({ key: 'points', dir: 'descending' });
  const [matchId, setMatchId] = useState<string | null>(null);
  const [news, setNews] = useState('');

  const t = (text: Tri) => text[lang];

  const match = QUARTERFINALS.find((item) => item.id === matchId) ?? null;
  const marked = new Set<DriverId>(match ? [match.a, match.b] : []);

  const timeOf = (row: TowerRow, index: number) => {
    if (index === 0) return t(TOWER.leader);
    const seconds = mode === 'gap' ? row.gap : row.gap - TOWER_ROWS[index - 1].gap;
    return `+${seconds.toFixed(3)}`;
  };

  const chooseMode = (next: TimeMode) => {
    if (next === mode) return;
    setMode(next);
    setNews(t(next === 'gap' ? TOWER.showsGap : TOWER.showsInterval));
  };

  const chooseDay = (next: DayId) => {
    if (next === day) return;
    setDay(next);
    setNews(fill(t(SCHEDULE.showing), { day: t(next === 'sat' ? SCHEDULE.satLong : SCHEDULE.sunLong) }));
  };

  const sortBy = (key: SortKey) => {
    // Points read most first and best laps fastest first; pressing the sorted column again reverses it.
    const natural: SortDir = key === 'points' ? 'descending' : 'ascending';
    const dir: SortDir = sort.key === key ? (sort.dir === 'ascending' ? 'descending' : 'ascending') : natural;
    setSort({ key, dir });
    const message =
      key === 'points'
        ? dir === 'descending' ? TABLE.sortedPointsDesc : TABLE.sortedPointsAsc
        : dir === 'ascending' ? TABLE.sortedBestAsc : TABLE.sortedBestDesc;
    setNews(t(message));
  };

  const chooseMatch = (next: Quarterfinal) => {
    if (next.id === matchId) {
      setMatchId(null);
      setNews(t(BRACKET.unmarked));
      return;
    }
    setMatchId(next.id);
    setNews(fill(t(BRACKET.marked), { match: next.id, a: DRIVER_BY_ID[next.a].name, b: DRIVER_BY_ID[next.b].name }));
  };

  const sorted = [...DRIVERS].sort((a, b) => {
    const diff = sort.key === 'points' ? a.points - b.points : a.best - b.best;
    return sort.dir === 'ascending' ? diff : -diff;
  });

  const ariaSort = (key: SortKey) => (sort.key === key ? sort.dir : undefined);

  const stopText: Record<Stop, Tri> = { none: TOWER.stopNone, done: TOWER.stopDone, now: TOWER.stopNow };

  const dayLong = t(day === 'sat' ? SCHEDULE.satLong : SCHEDULE.sunLong);

  return (
    <FusionShell
      fusionId="neon-drift"
      lang={lang}
      tone="dark"
      accent="#2ef2d5"
      prev={{ href: '/pages/holographic-fluid.html', label: 'Holographic Fluid' }}
      next={{ href: '/pages/glass-orbit.html', label: 'Glass Orbit' }}
      prompts={PROMPTS}
    >
      <div className="ac">
        <header className="ac-bar">
          <p className="ac-mark">
            <svg width={24} height={16} viewBox="0 0 24 16" aria-hidden="true">
              <path d="M1.5 15 L12 2 L22.5 15" fill="none" stroke="currentColor" strokeWidth={2.2} />
            </svg>
            {LEAGUE}
          </p>
          <nav className="ac-bar__nav" aria-label={t(HEAD.nav)}>
            <a href="#ac-standings">{t(HEAD.standings)}</a>
            <a href="#ac-bracket">{t(HEAD.bracket)}</a>
            <a href="#ac-drivers">{t(HEAD.drivers)}</a>
            <a href="#ac-schedule">{t(HEAD.schedule)}</a>
            <a href="#ac-rules">{t(HEAD.rules)}</a>
          </nav>
          <a className="ac-btn" href="#ac-schedule">
            <i aria-hidden="true" />
            {t(HEAD.watch)}
          </a>
        </header>

        <section className="ac-console" id="ac-standings" aria-labelledby="ac-title">
          <span className="ac-cn ac-cn--tl" aria-hidden="true" />
          <span className="ac-cn ac-cn--tr" aria-hidden="true" />
          <span className="ac-cn ac-cn--bl" aria-hidden="true" />
          <span className="ac-cn ac-cn--br" aria-hidden="true" />
          <div className="ac-chrome">
            <span>{t(HERO.event)}</span>
            <span className="ac-onair"><i aria-hidden="true" />{t(HERO.live)}</span>
            <span>{t(HERO.raceTime)} <span className="ac-n">{RACE_TIME}</span></span>
          </div>

          <div className="ac-hero">
            <div className="ac-head">
              <h1 id="ac-title">{t(HERO.title)}</h1>
              <p className="ac-lede">{t(HERO.lede)}</p>
            </div>

            <div className="ac-lap">
              <p className="ac-lap__n">
                <span>{t(HERO.lap)}</span> <b>{LAP}</b> <span>{fill(t(HERO.of), { n: LAPS })}</span>
              </p>
              <div className="ac-laps" aria-hidden="true">
                {Array.from({ length: LAPS }, (_, index) => (
                  <i key={index} className={index + 1 < LAP ? 'is-done' : index + 1 === LAP ? 'is-now' : undefined} />
                ))}
                <span className="ac-laps__win" />
              </div>
              <p className="ac-laps__label">{t(HERO.pitWindow)}</p>
            </div>

            <div className="ac-towerwrap">
              <section className="ac-tower" aria-labelledby="ac-tower-title">
                <div className="ac-tower__head">
                  <h2 className="ac-tower__title" id="ac-tower-title">{t(TOWER.title)}</h2>
                  <div className="ac-seg" role="group" aria-label={t(TOWER.group)}>
                    <button type="button" aria-pressed={mode === 'gap'} onClick={() => chooseMode('gap')}>{t(TOWER.gapButton)}</button>
                    <button type="button" aria-pressed={mode === 'interval'} onClick={() => chooseMode('interval')}>{t(TOWER.intervalButton)}</button>
                  </div>
                </div>
                <table className="ac-tw" aria-labelledby="ac-tower-title">
                  <thead>
                    <tr>
                      <th scope="col" className="ac-tw__pos"><abbr title={t(TOWER.position)}>{t(TOWER.pos)}</abbr></th>
                      <th scope="col">{t(TOWER.driver)}</th>
                      <th scope="col" className="ac-tw__time">{t(mode === 'gap' ? TOWER.gap : TOWER.interval)}</th>
                      <th scope="col" className="ac-tw__last">{t(TOWER.last)}</th>
                      <th scope="col" className="ac-tw__stop">{t(TOWER.stop)}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TOWER_ROWS.map((row, index) => (
                      <tr key={row.name} className={index === 0 ? 'is-lead' : undefined}>
                        <td className="ac-tw__pos">{row.pos}</td>
                        <th scope="row" className="ac-tw__drv">
                          <span className="ac-tw__ini">{row.initial} </span>
                          {row.name}
                          {row.penalty ? (
                            <span className="ac-tag">
                              <span aria-hidden="true">{t(TOWER.penaltyTime)}</span>
                              <span className="ac-sr">, {t(TOWER.penalty)}</span>
                            </span>
                          ) : null}
                          <span className="ac-tw__lamp">
                            <i className={`ac-st ac-st--${row.stop}`} aria-hidden="true" />
                            <span className="ac-sr">, {t(stopText[row.stop])}</span>
                          </span>
                        </th>
                        <td className="ac-tw__time">{timeOf(row, index)}</td>
                        <td className={`ac-tw__last${row.best ? ' is-best' : ''}${row.last === null ? ' is-pit' : ''}`}>
                          {row.last ?? t(TOWER.inPit)}
                          {row.best ? <span className="ac-sr">, {t(TOWER.personalBest)}</span> : null}
                        </td>
                        <td className="ac-tw__stop">
                          <i className={`ac-st ac-st--${row.stop}`} aria-hidden="true" />
                          <span className="ac-sr">{t(stopText[row.stop])}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
              <p className="ac-tower__note">{t(TOWER.note)}</p>
              <p className="ac-tower__key">
                <span>{t(TOWER.key)}</span>
                <span><i className="ac-st ac-st--none" aria-hidden="true" />{t(TOWER.keyNone)}</span>
                <span><i className="ac-st ac-st--done" aria-hidden="true" />{t(TOWER.keyDone)}</span>
                <span><i className="ac-st ac-st--now" aria-hidden="true" />{t(TOWER.keyNow)}</span>
              </p>
            </div>

            <div className="ac-lead">
              <p className="ac-lead__who">{t(LEADER.who)}</p>
              <dl className="ac-read">
                <div><dt>{t(LEADER.last)}</dt><dd className="ac-n">1:32.04</dd></div>
                <div><dt>{t(LEADER.best)}</dt><dd className="ac-n is-fast">1:31.62</dd></div>
                <div><dt>{t(LEADER.ahead)}</dt><dd className="ac-n">{t(LEADER.gapAhead)}</dd></div>
                <div><dt>{t(LEADER.stop)}</dt><dd className="is-warn">{t(LEADER.notYet)}</dd></div>
              </dl>
            </div>

            <figure className="ac-trace">
              <figcaption>
                <b>{t(TRACE.caption)}</b>
                <span className="ac-key">{t(TRACE.leader)}</span>
                <span className="ac-key ac-key--b">{t(TRACE.second)}</span>
                <span className="ac-trace__faster">{t(TRACE.faster)}</span>
              </figcaption>
              <div className="ac-chart">
                <div className="ac-chart__y" aria-hidden="true">
                  {Y_TICKS.map((tick, index) => (
                    <span key={tick} style={{ top: `${(index / (Y_TICKS.length - 1)) * 100}%` }}>{tick}</span>
                  ))}
                </div>
                <div className="ac-plot" role="img" aria-label={t(TRACE.alt)}>
                  <svg viewBox="0 0 580 240" preserveAspectRatio="none" aria-hidden="true">
                    <rect className="ac-plot__win" x="180" y="0" width="200" height="240" />
                    <path className="ac-plot__edge" d="M180 0V240M380 0V240" />
                    <path className="ac-plot__grid" d="M0 40H580M0 80H580M0 120H580M0 160H580M0 200H580M80 0V240M280 0V240M480 0V240M579.5 0V240" />
                    <polyline className="ac-plot__p2" points={SECOND_TRACE} />
                    <polyline className="ac-plot__p1" points={LEADER_TRACE} />
                    <path className="ac-plot__now" d="M340 0V240" />
                  </svg>
                  <span className="ac-plot__label" aria-hidden="true">{t(TRACE.window)}</span>
                  <i className="ac-mk ac-mk--fast" aria-hidden="true"><b>1:31.62</b></i>
                  <i className="ac-mk ac-mk--now" aria-hidden="true" />
                </div>
                <div className="ac-chart__x" aria-hidden="true">
                  {X_TICKS.map((lap) => (
                    <span key={lap} style={{ left: `${lapX(lap)}%` }}>{lap}</span>
                  ))}
                </div>
              </div>
            </figure>
          </div>
        </section>

        <section className="ac-section" id="ac-bracket" aria-labelledby="ac-bracket-title">
          <div className="ac-sec-head">
            <h2 id="ac-bracket-title">{t(BRACKET.title)}</h2>
            <p>{t(BRACKET.lead)}</p>
          </div>
          <p className="ac-hint" id="ac-bracket-hint">{t(BRACKET.hint)}</p>
          <div className="ac-bracket">
            <div className="ac-round ac-round--qf">
              <h3>{t(BRACKET.qf)}</h3>
              <p className="ac-round__note">{t(BRACKET.qfNote)}</p>
              <ul className="ac-slots">
                {QUARTERFINALS.map((item) => {
                  const on = item.id === matchId;
                  return (
                    <li key={item.id} className="ac-slot">
                      <button
                        type="button"
                        className="ac-match ac-match--pick"
                        aria-pressed={on}
                        aria-describedby="ac-bracket-hint"
                        onClick={() => chooseMatch(item)}
                      >
                        <span className="ac-match__head"><span>{item.id}</span><span className="ac-n">{item.time}</span></span>
                        {[item.a, item.b].map((id) => (
                          <span key={id} className="ac-match__line">
                            <span className="ac-seed">{SEED[id]}</span>
                            <span className="ac-nm">{DRIVER_BY_ID[id].name}</span>
                            <span className="ac-pts">{fill(t(BRACKET.pts), { n: DRIVER_BY_ID[id].points })}</span>
                          </span>
                        ))}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="ac-round ac-round--sf">
              <h3>{t(BRACKET.sf)}</h3>
              <p className="ac-round__note">{t(BRACKET.sfNote)}</p>
              <ul className="ac-slots">
                {SEMIFINALS.map((item) => (
                  <li key={item.id} className="ac-slot">
                    <div className="ac-match">
                      <p className="ac-match__head"><span>{item.id}</span><span className="ac-n">{item.time}</span></p>
                      {item.from.map((from) => (
                        <p key={from} className="ac-match__line is-tbd">
                          <span className="ac-seed" aria-hidden="true" />
                          <span className="ac-nm">{fill(t(BRACKET.winnerOf), { match: from })}</span>
                        </p>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="ac-round ac-round--f">
              <h3>{t(BRACKET.final)}</h3>
              <p className="ac-round__note">{t(BRACKET.finalNote)}</p>
              <ul className="ac-slots">
                <li className="ac-slot">
                  <div className="ac-match ac-match--final">
                    <p className="ac-match__head"><span>{t(BRACKET.final)}</span><span className="ac-n">21:20</span></p>
                    {['SF1', 'SF2'].map((from) => (
                      <p key={from} className="ac-match__line is-tbd">
                        <span className="ac-seed" aria-hidden="true" />
                        <span className="ac-nm">{fill(t(BRACKET.winnerOf), { match: from })}</span>
                      </p>
                    ))}
                  </div>
                </li>
              </ul>
              <dl className="ac-prize" aria-label={t(BRACKET.prize)}>
                {PRIZES.map((prize) => (
                  <div key={prize.label}>
                    <dt>{t(BRACKET[prize.label])}</dt>
                    <dd className="ac-n">{prize.amount}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="ac-section" id="ac-drivers" aria-labelledby="ac-drivers-title">
          <div className="ac-sec-head">
            <h2 id="ac-drivers-title">{t(TABLE.title)}</h2>
            <p>{t(TABLE.lead)}</p>
          </div>
          <p className={`ac-marked${match ? ' is-on' : ''}`}>
            {match
              ? fill(t(TABLE.mark), { match: match.id, time: match.time, a: DRIVER_BY_ID[match.a].name, b: DRIVER_BY_ID[match.b].name })
              : t(TABLE.noMark)}
          </p>
          <table className="ac-dr" aria-labelledby="ac-drivers-title">
            <thead>
              <tr>
                <th scope="col" className="ac-dr__car"><abbr title={t(TABLE.carLong)}>{t(TABLE.car)}</abbr></th>
                <th scope="col" className="ac-dr__who">{t(TABLE.driver)}</th>
                <th scope="col" className="ac-dr__from">{t(TABLE.from)}</th>
                <th scope="col" className="ac-dr__team">{t(TABLE.team)}</th>
                <th scope="col" className="ac-dr__age ac-r">{t(TABLE.age)}</th>
                <th scope="col" className="ac-dr__wins ac-r">{t(TABLE.wins)}</th>
                <th scope="col" className="ac-dr__pts ac-r" aria-sort={ariaSort('points')}>
                  <button type="button" className="ac-sort" onClick={() => sortBy('points')}>
                    {t(TABLE.points)}
                    <SortIcon dir={ariaSort('points') ?? null} />
                  </button>
                </th>
                <th scope="col" className="ac-dr__best ac-r" aria-sort={ariaSort('best')}>
                  <button type="button" className="ac-sort" onClick={() => sortBy('best')}>
                    {t(TABLE.best)}
                    <SortIcon dir={ariaSort('best') ?? null} />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((driver) => {
                const isMarked = marked.has(driver.id);
                return (
                  <tr key={driver.id} className={isMarked ? 'is-marked' : undefined}>
                    <td className="ac-dr__car">{driver.car}</td>
                    <th scope="row" className="ac-dr__who">
                      <span className="ac-dr__name">
                        <span className="ac-dr__no">{driver.car} </span>
                        {driver.name}
                        {isMarked && match ? (
                          <span className="ac-tag ac-tag--mark">
                            <span aria-hidden="true">{match.id}</span>
                            <span className="ac-sr">, {fill(t(TABLE.inMatch), { match: match.id })}</span>
                          </span>
                        ) : null}
                      </span>
                      <span className="ac-dr__sub">
                        {driver.team}
                        <span className="ac-dr__subfrom">, {t(driver.country)}</span>
                      </span>
                      <span className="ac-dr__stats">{fill(t(driver.wins === 0 ? TABLE.statsNone : driver.wins === 1 ? TABLE.statsOne : TABLE.statsMany), { age: driver.age, wins: driver.wins })}</span>
                    </th>
                    <td className="ac-dr__from">{t(driver.country)}</td>
                    <td className="ac-dr__team">{driver.team}</td>
                    <td className="ac-dr__age ac-r ac-n">{driver.age}</td>
                    <td className="ac-dr__wins ac-r ac-n">{driver.wins}</td>
                    <td className="ac-dr__pts ac-r ac-n">{driver.points}</td>
                    <td className={`ac-dr__best ac-r ac-n${driver.best === FASTEST ? ' is-fast' : ''}`}>
                      {driver.bestText}
                      {driver.best === FASTEST ? <span className="ac-sr">, {t(TABLE.fastest)}</span> : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="ac-section" id="ac-schedule" aria-labelledby="ac-schedule-title">
          <div className="ac-sec-head">
            <h2 id="ac-schedule-title">{t(SCHEDULE.title)}</h2>
            <p>{t(SCHEDULE.lead)}</p>
          </div>
          <div className="ac-days" role="group" aria-label={t(SCHEDULE.day)}>
            <button type="button" aria-pressed={day === 'sat'} onClick={() => chooseDay('sat')}>{t(SCHEDULE.sat)}</button>
            <button type="button" aria-pressed={day === 'sun'} onClick={() => chooseDay('sun')}>{t(SCHEDULE.sun)}</button>
          </div>
          <div className={`ac-epg ac-epg--${day}`} role="group" aria-label={fill(t(SCHEDULE.grid), { day: dayLong })}>
            <div className="ac-epg__tz" aria-hidden="true">CET</div>
            <div className="ac-epg__axis" aria-hidden="true">
              {AXIS_TIMES.map((time, index) => (
                <span key={time} style={{ left: `${index * 20}%` }}>{time}</span>
              ))}
            </div>
            {day === 'sat' ? (
              <div className="ac-epg__now" aria-hidden="true" style={{ ['--ac-now' as string]: `${NOW_AT}%` }}>
                <span>{NOW_TIME}</span>
              </div>
            ) : null}
            {LANES.map((lane) => (
              <div key={lane.id} className="ac-lane">
                <div className="ac-lane__name">
                  <h3>{t(lane.name)}</h3>
                  <p>{t(lane.where)}</p>
                </div>
                <ul className="ac-lane__track">
                  {lane.days[day].map((programme) => {
                    const on = day === 'sat' && programme.on;
                    return (
                      <li
                        key={`${day}-${programme.time}`}
                        className={`ac-prog${on ? ' is-on' : ''}`}
                        style={{ gridColumn: `${programme.from} / ${programme.to}` }}
                      >
                        <time>{programme.time}</time>
                        <b>{t(programme.title)}</b>
                        <span className="ac-prog__until">{fill(t(SCHEDULE.until), { time: lineTime(programme.to) })}</span>
                        {on ? <em>{t(SCHEDULE.onAir)}</em> : null}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="ac-section" id="ac-rules" aria-labelledby="ac-rules-title">
          <div className="ac-sec-head">
            <h2 id="ac-rules-title">{t(RULES.title)}</h2>
            <p>{t(RULES.lead)}</p>
          </div>
          <dl className="ac-rules">
            {RULES.rows.map((row) => (
              <div key={row.term.en}>
                <dt>{t(row.term)}</dt>
                <dd>{t(row.body)}</dd>
                <dd className={`ac-rules__pen${row.none ? ' is-none' : ''}`}>
                  <span className="ac-sr">{t(RULES.penaltyHead)}: </span>
                  {t(row.penalty)}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <footer className="ac-foot">
          <p><b>{LEAGUE}</b>{t(FOOT.about)}</p>
          <p><b>{t(FOOT.watch)}</b>{t(FOOT.watchValue)}</p>
          <p><b>{t(FOOT.protests)}</b>{t(FOOT.protestsValue)}</p>
        </footer>

        <p className="ac-sr" role="status">{news}</p>
      </div>
    </FusionShell>
  );
}
