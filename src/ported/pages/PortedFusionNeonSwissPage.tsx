import { Fragment, useState, type CSSProperties, type ReactNode } from 'react';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedFusionNeonSwissPage.css';

// The night network page of Halden Transit: six night-bus lines that run on
// Friday and Saturday nights. Each neon colour is the colour of one group of
// lines and appears only on those lines. Everything else is white and grey.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

type GroupId = 'river' | 'north' | 'south';
type LineId = 'N1' | 'N2' | 'N3' | 'N4' | 'N5' | 'N6';

/** Buses from one end of a line on one night: first and last clock time, minutes between buses. */
interface Service {
  every: number;
  first: string;
  last: string;
}

interface Stop {
  name: string;
  /** Minutes from Central Square. */
  min: number;
  /** Lines a rider can change to here. */
  change?: LineId[];
}

interface Line {
  id: LineId;
  group: GroupId;
  platform: string;
  /** The stop named on the departures board. It is one of `stops`. */
  via: string;
  about: Tri;
  /** The stops after Central Square, in order. The last one is the terminus. */
  stops: Stop[];
  /** Departures from Central Square. */
  fri: Service;
  sat: Service;
  /** First and last bus from the terminus on Friday night. */
  back: { first: string; last: string };
}

// Every line starts here.
const HUB = 'Central Square';

const GROUPS: Array<{ id: GroupId; name: Tri }> = [
  { id: 'river', name: { en: 'River lines', ko: '강변 노선', ja: '川沿いの路線' } },
  { id: 'north', name: { en: 'North lines', ko: '북부 노선', ja: '北部の路線' } },
  { id: 'south', name: { en: 'South lines', ko: '남부 노선', ja: '南部の路線' } },
];

// An interchange is listed on both lines: Kings Bridge (N1, N3), Canal Bridge (N2, N4),
// Science Park (N2, N5) and Riverside Hospital (N4, N6).
const LINES: Line[] = [
  {
    id: 'N1',
    group: 'river',
    platform: 'A',
    via: 'Old Harbour',
    about: {
      en: 'Nine stops in 27 minutes along the quays to the ferry. Change at Kings Bridge for N3.',
      ko: '부두를 따라 9개 정류장, 27분이면 페리 터미널에 닿습니다. N3로 환승하려면 Kings Bridge에서 갈아타세요.',
      ja: '波止場沿いに9停留所、27分でFerry Terminalに着きます。N3へはKings Bridgeで乗り換えてください。',
    },
    stops: [
      { name: 'Kings Bridge', min: 3, change: ['N3'] },
      { name: 'Fish Market', min: 6 },
      { name: 'Customs House', min: 9 },
      { name: 'Old Harbour', min: 12 },
      { name: 'Rope Walk', min: 16 },
      { name: 'Shipyard Gate', min: 19 },
      { name: 'Lighthouse', min: 23 },
      { name: 'Ferry Terminal', min: 27 },
    ],
    fri: { every: 20, first: '00:10', last: '04:30' },
    sat: { every: 15, first: '00:10', last: '05:10' },
    back: { first: '00:20', last: '04:40' },
  },
  {
    id: 'N2',
    group: 'north',
    platform: 'B',
    via: 'Canal Bridge',
    about: {
      en: 'Nine stops in 29 minutes through the canal quarter to the campus. Change at Canal Bridge for N4 and at Science Park for N5.',
      ko: '운하 지구를 지나 캠퍼스까지 9개 정류장, 29분입니다. N4는 Canal Bridge에서, N5는 Science Park에서 환승하세요.',
      ja: '運河地区を通ってキャンパスまで9停留所、29分です。N4へはCanal Bridge、N5へはScience Parkで乗り換えてください。',
    },
    stops: [
      { name: 'Guildhall', min: 3 },
      { name: 'Canal Bridge', min: 6, change: ['N4'] },
      { name: 'Linden Park', min: 10 },
      { name: 'Observatory Hill', min: 14 },
      { name: 'Science Park', min: 18, change: ['N5'] },
      { name: 'Student Village', min: 22 },
      { name: 'University Library', min: 25 },
      { name: 'University North', min: 29 },
    ],
    fri: { every: 30, first: '00:05', last: '04:35' },
    sat: { every: 30, first: '00:05', last: '05:05' },
    back: { first: '00:15', last: '04:45' },
  },
  {
    id: 'N3',
    group: 'south',
    platform: 'C',
    via: 'Stadium',
    about: {
      en: 'Eight stops in 26 minutes over the river to the stadium and Southmoor. Change at Kings Bridge for N1.',
      ko: '강을 건너 스타디움과 Southmoor까지 8개 정류장, 26분입니다. N1로 환승하려면 Kings Bridge에서 갈아타세요.',
      ja: '川を渡ってスタジアムとSouthmoorまで8停留所、26分です。N1へはKings Bridgeで乗り換えてください。',
    },
    stops: [
      { name: 'Kings Bridge', min: 3, change: ['N1'] },
      { name: 'South Quay', min: 7 },
      { name: 'Glassworks', min: 10 },
      { name: 'Stadium', min: 14 },
      { name: 'Orchard Road', min: 18 },
      { name: 'Moor Lane', min: 22 },
      { name: 'Southmoor', min: 26 },
    ],
    fri: { every: 30, first: '00:25', last: '04:25' },
    sat: { every: 30, first: '00:25', last: '04:55' },
    back: { first: '00:40', last: '04:40' },
  },
  {
    id: 'N4',
    group: 'river',
    platform: 'D',
    via: 'Riverside Hospital',
    about: {
      en: 'Ten stops in 34 minutes along the north bank of the river. Change at Canal Bridge for N2 and at Riverside Hospital for N6.',
      ko: '강 북쪽 둑을 따라 10개 정류장, 34분입니다. N2는 Canal Bridge에서, N6는 Riverside Hospital에서 환승하세요.',
      ja: '川の北岸沿いに10停留所、34分です。N2へはCanal Bridge、N6へはRiverside Hospitalで乗り換えてください。',
    },
    stops: [
      { name: 'Market Hall', min: 3 },
      { name: 'Canal Bridge', min: 6, change: ['N2'] },
      { name: 'Tannery Row', min: 9 },
      { name: 'Riverside Hospital', min: 13, change: ['N6'] },
      { name: 'Brewery Yard', min: 16 },
      { name: 'Eastbank', min: 20 },
      { name: 'Lindholm', min: 24 },
      { name: 'Mill Lane', min: 29 },
      { name: 'Millbrook', min: 34 },
    ],
    fri: { every: 20, first: '00:07', last: '04:27' },
    sat: { every: 15, first: '00:07', last: '05:07' },
    back: { first: '00:12', last: '04:32' },
  },
  {
    id: 'N5',
    group: 'north',
    platform: 'E',
    via: 'Northgate',
    about: {
      en: 'Eight stops in 38 minutes north to the airport terminal. Change at Science Park for N2.',
      ko: '북쪽으로 공항 터미널까지 8개 정류장, 38분입니다. N2로 환승하려면 Science Park에서 갈아타세요.',
      ja: '北へ向かい空港ターミナルまで8停留所、38分です。N2へはScience Parkで乗り換えてください。',
    },
    stops: [
      { name: 'Northgate', min: 4 },
      { name: 'Viaduct', min: 8 },
      { name: 'Science Park', min: 13, change: ['N2'] },
      { name: 'Ring Road North', min: 19 },
      { name: 'Aviation Park', min: 26 },
      { name: 'Cargo Centre', min: 32 },
      { name: 'Airport', min: 38 },
    ],
    fri: { every: 30, first: '00:22', last: '04:22' },
    sat: { every: 30, first: '00:22', last: '04:52' },
    back: { first: '00:17', last: '04:17' },
  },
  {
    id: 'N6',
    group: 'south',
    platform: 'F',
    via: 'Riverside Hospital',
    about: {
      en: 'Nine stops in 31 minutes, over Hospital Bridge and up to Kessler Heights. Change at Riverside Hospital for N4.',
      ko: 'Hospital Bridge를 건너 Kessler Heights까지 9개 정류장, 31분입니다. N4로 환승하려면 Riverside Hospital에서 갈아타세요.',
      ja: 'Hospital Bridgeを渡ってKessler Heightsまで9停留所、31分です。N4へはRiverside Hospitalで乗り換えてください。',
    },
    stops: [
      { name: 'Corn Exchange', min: 3 },
      { name: 'Almshouse Lane', min: 6 },
      { name: 'Riverside Hospital', min: 10, change: ['N4'] },
      { name: 'Hospital Bridge', min: 13 },
      { name: 'Weirside', min: 17 },
      { name: 'Quarry Road', min: 21 },
      { name: 'Kessler Park', min: 26 },
      { name: 'Kessler Heights', min: 31 },
    ],
    fri: { every: 60, first: '00:15', last: '04:15' },
    sat: { every: 30, first: '00:15', last: '04:45' },
    back: { first: '00:45', last: '04:45' },
  },
];

const LINE_BY_ID = Object.fromEntries(LINES.map((line) => [line.id, line])) as Record<LineId, Line>;

const terminus = (line: Line) => line.stops[line.stops.length - 1].name;

// Every time on the page falls between midnight and six, so a clock is minutes after midnight.
const toMinutes = (clock: string) => Number(clock.slice(0, 2)) * 60 + Number(clock.slice(3));
const toClock = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

// The board shows a Friday night at this time. Its rows are worked out from the
// Friday timetable, so the board and the timetable cannot disagree.
const NOW = '00:47';
const BOARD_ROWS = 8;

const DEPARTURES = LINES.flatMap((line) => {
  const rows: Array<{ line: Line; at: number }> = [];
  for (let at = toMinutes(line.fri.first); at <= toMinutes(line.fri.last); at += line.fri.every) {
    if (at >= toMinutes(NOW)) rows.push({ line, at });
  }
  return rows;
})
  .sort((a, b) => a.at - b.at)
  .slice(0, BOARD_ROWS);

const BAR = {
  operator: 'Halden Transit',
  network: { en: 'Night Network', ko: '심야 노선망', ja: '深夜ネットワーク' },
  nav: { en: 'On this page', ko: '페이지 내 메뉴', ja: 'このページ内' },
  departures: { en: 'Departures', ko: '출발 정보', ja: '発車案内' },
  lines: { en: 'Lines', ko: '노선', ja: '路線' },
  timetable: { en: 'Timetable', ko: '시간표', ja: '時刻表' },
  notices: { en: 'Notices', ko: '운행 안내', ja: '運行情報' },
  help: { en: 'Help', ko: '도움말', ja: 'ヘルプ' },
  fares: { en: 'Fares and tickets', ko: '요금과 승차권', ja: '運賃と乗車券' },
  faresShort: { en: 'Fares', ko: '요금', ja: '運賃' },
} as const;

const HERO = {
  title: { en: 'Six lines run after midnight.', ko: '여섯 개 노선이 자정 이후 운행합니다.', ja: '6路線が深夜に運行します。' },
  lede: {
    en: 'The night network runs on Friday and Saturday nights, from just after midnight until about five in the morning. Every line starts at Central Square, platforms A to F.',
    ko: '심야 노선망은 금요일과 토요일 밤, 자정이 조금 지나서부터 새벽 5시쯤까지 운행합니다. 모든 노선은 Central Square에서 출발하며 승강장은 A부터 F까지입니다.',
    ja: '深夜ネットワークは金曜と土曜の夜、午前0時を少し過ぎてから朝5時頃まで運行します。すべての路線はCentral Squareから発車し、のりばはAからFです。',
  },
} satisfies Record<string, Tri>;

const BOARD = {
  title: { en: 'Departures from Central Square', ko: 'Central Square 출발 안내', ja: 'Central Square発の発車案内' },
  night: { en: 'Friday night', ko: '금요일 밤', ja: '金曜の夜' },
  line: { en: 'Line', ko: '노선', ja: '路線' },
  to: { en: 'To', ko: '행선지', ja: '行先' },
  via: { en: 'Via', ko: '경유', ja: '経由' },
  platform: { en: 'Platform', ko: '승강장', ja: 'のりば' },
  platformShort: { en: 'Plat.', ko: '승강장', ja: 'のりば' },
  time: { en: 'Time', ko: '시각', ja: '時刻' },
  due: { en: 'Departs in', ko: '출발까지', ja: '発車まで' },
  now: { en: 'now', ko: '곧 출발', ja: 'まもなく' },
  live: {
    en: 'Live times, refreshed every 30 seconds.',
    ko: '실시간 시각이며 30초마다 갱신됩니다.',
    ja: 'リアルタイムの時刻で、30秒ごとに更新されます。',
  },
} satisfies Record<string, Tri>;

// {n} is a count of minutes; {first} and {last} are clock times.
const UNITS = {
  minutes: { en: '{n} min', ko: '{n}분', ja: '{n}分' },
  span: { en: '{first} to {last}', ko: '{first} ~ {last}', ja: '{first} ～ {last}' },
} satisfies Record<string, Tri>;

const STRIP = {
  // {from} and {to} are stop names.
  route: { en: '{from} to {to}', ko: '{from} → {to}', ja: '{from} → {to}' },
  picker: { en: 'Choose a line', ko: '노선 선택', ja: '路線を選択' },
  // {line} is a line number, {hub} the stop every line starts from.
  label: {
    en: 'Stops on line {line}, with minutes from {hub}',
    ko: '{line} 노선 정류장, {hub} 기준 소요 시간(분)',
    ja: '路線{line}の停留所、{hub}からの分数',
  },
  // {lines} is one line number or more.
  changeFor: { en: 'Change for {lines}', ko: '{lines} 환승', ja: '{lines}へ乗り換え' },
  changeAll: { en: 'Change for all night lines', ko: '심야 전 노선 환승', ja: '深夜の全路線に乗り換え可' },
  allLines: { en: 'All lines', ko: '전 노선', ja: '全路線' },
  first: { en: 'First', ko: '첫차', ja: '始発' },
  last: { en: 'Last', ko: '막차', ja: '最終' },
  ends: {
    en: 'First and last buses are the Friday night departures from each end of the line.',
    ko: '첫차와 막차는 노선 양 끝에서 출발하는 금요일 밤 버스입니다.',
    ja: '始発と最終は、路線の両端から出る金曜の夜のバスです。',
  },
  // {every} is the Saturday frequency in minutes, {later} how many minutes later the last buses leave.
  satFaster: {
    en: 'On Saturday night {line} runs every {every} minutes and the last buses leave {later} minutes later.',
    ko: '토요일 밤에는 {line} 노선이 {every}분 간격으로 운행하고, 막차는 {later}분 늦게 출발합니다.',
    ja: '土曜の夜は{line}が{every}分間隔で運行し、最終便は{later}分遅く出発します。',
  },
  satSame: {
    en: 'On Saturday night {line} keeps its {every}-minute frequency and the last buses leave {later} minutes later.',
    ko: '토요일 밤에도 {line} 노선은 {every}분 간격을 유지하며, 막차는 {later}분 늦게 출발합니다.',
    ja: '土曜の夜も{line}は{every}分間隔を保ち、最終便は{later}分遅く出発します。',
  },
} satisfies Record<string, Tri>;

const TIMETABLE = {
  title: { en: 'Timetable and fares', ko: '시간표와 요금', ja: '時刻表と運賃' },
  frequency: { en: 'Night frequency', ko: '심야 배차 간격', ja: '深夜の運行間隔' },
  frequencyNote: {
    en: 'Times are departures from Central Square.',
    ko: '시각은 Central Square 출발 기준입니다.',
    ja: '時刻はCentral Square発の発車時刻です。',
  },
  friEvery: { en: 'Friday night, every', ko: '금요일 밤 간격', ja: '金曜の夜 間隔' },
  satEvery: { en: 'Saturday night, every', ko: '토요일 밤 간격', ja: '土曜の夜 間隔' },
  span: { en: 'First to last', ko: '첫차 ~ 막차', ja: '始発 ～ 最終' },
  // Read to a screen reader, so the two "First to last" columns have different names.
  friSpan: { en: 'Friday night, first to last', ko: '금요일 밤, 첫차부터 막차까지', ja: '金曜の夜、始発から最終まで' },
  satSpan: { en: 'Saturday night, first to last', ko: '토요일 밤, 첫차부터 막차까지', ja: '土曜の夜、始発から最終まで' },
  // Shown before the frequency when the table is stacked on a phone.
  fri: { en: 'Fri', ko: '금', ja: '金' },
  sat: { en: 'Sat', ko: '토', ja: '土' },
} satisfies Record<string, Tri>;

const FARES = {
  title: { en: 'Fares', ko: '요금', ja: '運賃' },
  note: {
    en: 'Tap a card or phone on the reader by the front door. Drivers do not take cash at night.',
    ko: '출입문 옆 단말기에 카드나 휴대폰을 대세요. 심야에는 기사가 현금을 받지 않습니다.',
    ja: '出入口付近の読取機にカードかスマートフォンをタッチしてください。深夜、運転手は現金を受け取りません。',
  },
  ticket: { en: 'Ticket', ko: '승차권', ja: '乗車券' },
  covers: { en: 'What it covers', ko: '적용 범위', ja: '利用範囲' },
  price: { en: 'Price', ko: '요금', ja: '料金' },
  rows: [
    {
      name: { en: 'Single night ticket', ko: '심야 1회권', ja: '深夜の片道乗車券' },
      body: {
        en: 'One journey on any night line. Changes are free for 90 minutes from the first tap.',
        ko: '심야 노선 1회 승차입니다. 처음 탭한 시점부터 90분 안에는 환승이 무료입니다.',
        ja: '深夜路線の1回乗車です。最初のタップから90分以内の乗り換えは無料です。',
      },
      price: '€3.80',
    },
    {
      name: { en: 'Day pass', ko: '하루권', ja: '1日乗車券' },
      body: {
        en: 'A day pass for Friday or Saturday stays valid on night buses until 05:30 the next morning.',
        ko: '금요일 또는 토요일 하루권은 다음 날 아침 05:30까지 심야버스에서 유효합니다.',
        ja: '金曜または土曜の1日乗車券は、翌朝05:30まで深夜バスで有効です。',
      },
      price: '€8.50',
    },
    {
      name: { en: 'Night supplement', ko: '심야 추가 요금', ja: '深夜追加料金' },
      body: {
        en: 'Added once a night to a monthly or student pass. The reader takes it when you board.',
        ko: '월정기권이나 학생권에 밤마다 한 번 추가됩니다. 승차할 때 단말기에서 차감됩니다.',
        ja: '定期券や学生定期券に、夜ごとに1回追加されます。乗車時に読取機で精算されます。',
      },
      price: '€1.50',
    },
  ] satisfies Array<{ name: Tri; body: Tri; price: string }>,
};

const ALL_LINES = LINES.map((line) => line.id);

const NOTICES = {
  title: { en: 'Service notices', ko: '운행 안내', ja: '運行情報' },
  affects: { en: 'Lines affected:', ko: '영향 노선:', ja: '影響する路線：' },
  rows: [
    {
      lines: ['N1'],
      when: { en: '27 Nov to 6 Dec', ko: '11월 27일 ~ 12월 6일', ja: '11月27日～12月6日' },
      title: { en: 'Diversion away from Old Harbour', ko: 'Old Harbour 우회 운행', ja: 'Old Harbourを迂回して運行' },
      body: {
        en: 'Quay Street is closed for the winter market. N1 runs along Harbour Road between Customs House and Rope Walk and does not call at Old Harbour. Customs House is the nearest stop, about 300 metres away.',
        ko: '겨울 시장 때문에 Quay Street가 통제됩니다. N1은 Harbour Road를 따라 Customs House와 Rope Walk 사이를 운행하며 Old Harbour에는 서지 않습니다. 가장 가까운 정류장은 약 300미터 거리의 Customs House입니다.',
        ja: 'Quay Streetは冬のマーケットのため通行止めです。N1はHarbour Roadを通り、Customs HouseとRope Walkの間を走ります。Old Harbourには停車しません。最寄りの停留所は約300メートル先のCustoms Houseです。',
      },
    },
    {
      lines: ['N4'],
      when: { en: 'Until 12 Dec', ko: '12월 12일까지', ja: '12月12日まで' },
      title: { en: 'Tannery Row stop closed', ko: 'Tannery Row 정류장 폐쇄', ja: 'Tannery Row停留所は休止中' },
      body: {
        en: 'The pavement at Tannery Row is being rebuilt. N4 passes without stopping in both directions. Use Canal Bridge or Riverside Hospital.',
        ko: 'Tannery Row 보도를 재공사하고 있습니다. N4는 양방향 모두 이 정류장에 서지 않고 지나갑니다. Canal Bridge나 Riverside Hospital을 이용해 주세요.',
        ja: 'Tannery Rowの歩道を改修中です。N4は両方向ともこの停留所に停車せず通過します。Canal BridgeまたはRiverside Hospitalをご利用ください。',
      },
    },
    {
      lines: ALL_LINES,
      when: { en: '31 Dec', ko: '12월 31일', ja: '12月31日' },
      title: {
        en: "Saturday timetable on New Year's Eve",
        ko: "12월 31일 토요일 시간표",
        ja: "大晦日の土曜時刻表",
      },
      body: {
        en: 'All six lines run their Saturday night timetable on the night of Thursday 31 December. Buses that leave Central Square between 00:00 and 01:00 may be full.',
        ko: '여섯 개 노선 모두 목요일인 12월 31일 밤에 토요일 심야 시간표로 운행합니다. 0시에서 1시 사이 Central Square를 출발하는 버스는 만석일 수 있습니다.',
        ja: '6路線すべてが木曜日の12月31日の夜に、土曜の深夜時刻表で運行します。0時から1時の間にCentral Squareを発車するバスは混雑することがあります。',
      },
    },
  ] satisfies Array<{ lines: LineId[]; when: Tri; title: Tri; body: Tri }>,
};

const HELP = {
  title: { en: 'Help', ko: '도움말', ja: 'ヘルプ' },
  rows: [
    {
      name: { en: 'Lost property', ko: '분실물', ja: 'お忘れ物' },
      body: {
        en: 'Anything left on a night bus reaches the travel centre by 10:00 the same morning and is kept for 30 days.',
        ko: '심야버스에 두고 내린 물건은 당일 오전 10시까지 여행 센터에 도착하며, 30일 동안 보관합니다.',
        ja: '深夜バスに置き忘れた物は、当日の午前10時までに旅行センターに届き、30日間保管します。',
      },
      fact: { en: 'lost@halden.example', ko: 'lost@halden.example', ja: 'lost@halden.example' },
      note: {
        en: 'Tell us the line, the time and what you lost.',
        ko: '노선, 시각, 잃어버린 물건을 알려 주세요.',
        ja: '路線、時刻、なくした物をお知らせください。',
      },
    },
    {
      name: { en: 'Night helpline', ko: '심야 상담 전화', ja: '深夜ヘルプライン' },
      body: {
        en: 'Staffed on Friday and Saturday nights from 23:30 to 05:30. Call if a bus has not come or if you feel unsafe on board.',
        ko: '금요일과 토요일 밤 23:30부터 05:30까지 상담원이 근무합니다. 버스가 오지 않거나 승차 중 불안하면 전화해 주세요.',
        ja: '金曜と土曜の夜、23:30から05:30まで担当者が対応します。バスが来ない場合や乗車中に不安を感じた場合はお電話ください。',
      },
      fact: { en: '0800 555 0147', ko: '0800 555 0147', ja: '0800 555 0147' },
      note: { en: 'Free from any phone.', ko: '어떤 전화에서든 무료입니다.', ja: 'どの電話からも無料です。' },
    },
    {
      name: { en: 'Travel centre', ko: '여행 센터', ja: '旅行センター' },
      body: {
        en: 'Open Monday to Saturday, 08:00 to 18:00. Staff sell passes and hand back lost property.',
        ko: '월요일부터 토요일까지 08:00에서 18:00까지 엽니다. 직원이 승차권을 팔고 분실물도 돌려줍니다.',
        ja: '月曜から土曜の8時から18時まで営業しています。係員が乗車券を販売し、お忘れ物もお渡しします。',
      },
      fact: { en: 'Central Square, by platform A', ko: 'Central Square, 승강장 A 옆', ja: 'Central Square、のりばA横' },
      note: {
        en: 'Step-free entrance on the east side.',
        ko: '동쪽 출입구에는 계단이 없습니다.',
        ja: '東側の出入口は段差がありません。',
      },
    },
  ] satisfies Array<{ name: Tri; body: Tri; fact: Tri; note: Tri }>,
};

const FOOTER = {
  owner: '© 2026 Halden Transit',
  valid: {
    en: 'Night timetable valid from 6 November 2026.',
    ko: '심야 시간표는 2026년 11월 6일부터 적용됩니다.',
    ja: '深夜時刻表は2026年11月6日から適用されます。',
  },
};

const PROMPTS: Record<Lang, string> = {
  en: `Design one real page in Neon × Swiss fusion: a near-black page on a strict 12-column grid, where each neon colour is a code for one thing and appears only on that thing.

Pick a believable subject that already colour-codes its parts, such as a night bus network, a metro map, a ski area or a festival timetable, and write its real content. The page must read as that subject's page, never as a page about its own style.

TOKENS:
--bg: #06080f
--ink: #ffffff
--muted: #a0a8b8
--line: rgba(255,255,255,0.3)
--teal: #16f2d1
--sky: #7cc7ff
--lime: #e6ff4d
No other colours. No glow, no gradient, no shadow.

THE COLOUR RULE:
- Each neon has one fixed meaning. Here it is a group of bus lines: teal for the river lines, sky for the north lines, lime for the south lines.
- A neon appears only on what it names: the line number, the line drawn in its diagram, the block that says a bus of that line leaves now, the pressed button of that line.
- Headlines, text, rules, links, the one solid button and focus rings are white or grey.
- A key under the first table says what each colour means.

TYPOGRAPHY:
Two families: Familjen Grotesk for headlines and text, Azeret Mono for clock times, platform letters and minute counts.
H1: Familjen Grotesk 600, clamp(2.75rem, 7.4vw, 5.75rem), line-height 0.96, letter-spacing -0.045em
H2: Familjen Grotesk 600, clamp(1.875rem, 5.2vw, 2.875rem), line-height 1.02, letter-spacing -0.035em
Body: Familjen Grotesk 400, 1.0625rem, line-height 1.5
Line numbers: Familjen Grotesk 700 in the line's colour, 2.5rem in the departures table
Figures: Azeret Mono 400 and 500 only, letter-spacing -0.05em to -0.08em so a time reads as one word. Minutes are 2.125rem in the departures table, clock times 1rem.
Column headers and units: 0.9375rem in grey, written in the case they are read in.

LAYOUT:
- One 12-column grid with no gutters, max width about 1120px, everything flush left. Section gap 120px.
- Top bar 72px high on a 1px rule: the operator's name, in-page links, one solid white button.
- Hero: the headline on eight columns and the standfirst on the last four, on a shared baseline. Under it the departures board, a ruled table of the next eight departures with line, destination, via, platform, time and minutes.
- Lines: a picker of six square toggle buttons and the chosen line drawn as a strip of stops. On desktop the strip is horizontal, minutes above the line and stop names below. On phones it turns vertical and the line runs down the left edge.
- Timetable and fares: the heading in a two-column side column, a ruled table on the other ten columns. On phones each table row becomes a stacked block.
- Notices and help: plain ruled rows on the same grid, in columns of 2, 6 and 4.

COMPONENTS:
- Departures board: 2px white rule on top, 1px rules between rows. The row that leaves now shows a solid block in its line's colour with dark text; every other row shows its minutes.
- Line picker: buttons 48px high with a 1px rule and the number in the line's colour. The pressed button is filled with that colour. Exactly one is pressed.
- Line strip: a 6px line in the line's colour, a 4px tick at each stop, an open square at an interchange, a solid bar at the terminus, first and last bus at both ends.
- Button: 44px high, white fill, dark text.
- Rules: 1px at rgba(255,255,255,0.3). Tables start on a 2px white rule.
- Every corner is square.

MOTION:
- Hover changes colour in 160ms. Nothing else moves.

FORBIDDEN:
- Glow, text-shadow, neon tubes, scan lines and grid lines drawn as decoration
- A neon on a headline word, a button or a link that is not a line
- A fourth colour, or a switcher that recolours the page
- Cards, pills, chips and rounded corners
- A small label above a heading, all-caps tracked labels
- Issue numbers, stamps, marquees and other magazine-cover props
- A table that scrolls sideways on a phone

OUTPUT:
1) CSS custom properties
2) Semantic HTML and CSS: real tables, an ordered list for the stops, toggle buttons with aria-pressed
3) Responsive layout down to 320px with no horizontal scroll
4) Visible focus and reduced-motion support`,
  ko: `Neon × Swiss 퓨전으로 실제 페이지 한 장을 디자인한다: 거의 검은 바탕, 엄격한 12열 그리드. 각 네온 색은 대상 하나를 나타내는 코드이며 그 대상에만 쓴다.

이미 부분마다 색으로 구분하는 그럴듯한 주제를 고르고 실제 내용을 쓴다. 예: 심야버스 노선망, 지하철 노선도, 스키장, 축제 시간표. 페이지는 그 주제의 페이지로 읽혀야 하며, 스타일에 관한 페이지로 읽혀서는 안 된다.

TOKENS:
--bg: #06080f
--ink: #ffffff
--muted: #a0a8b8
--line: rgba(255,255,255,0.3)
--teal: #16f2d1
--sky: #7cc7ff
--lime: #e6ff4d
다른 색은 쓰지 않는다. 글로, 그라데이션, 그림자는 금지.

THE COLOUR RULE:
- 각 네온은 고정된 의미 하나를 가진다. 여기서는 버스 노선 묶음이다: 강변 노선은 teal, 북부 노선은 sky, 남부 노선은 lime.
- 네온은 그 이름이 가리키는 대상에만 나타난다: 노선 번호, 도식에 그린 노선, 그 노선 버스가 지금 출발한다는 블록, 눌린 노선 버튼.
- 제목, 본문, 구분선, 링크, 유일한 채움 버튼, 포커스 링은 흰색 또는 회색이다.
- 첫 번째 표 아래 열쇠 설명에 각 색의 뜻을 적는다.

TYPOGRAPHY:
글꼴 두 가지: 제목과 본문은 Familjen Grotesk, 시각, 승강장 글자, 분 숫자는 Azeret Mono.
H1: Familjen Grotesk 600, clamp(2.75rem, 7.4vw, 5.75rem), 줄 간격 0.96, 자간 -0.045em
H2: Familjen Grotesk 600, clamp(1.875rem, 5.2vw, 2.875rem), 줄 간격 1.02, 자간 -0.035em
본문: Familjen Grotesk 400, 1.0625rem, 줄 간격 1.5
노선 번호: Familjen Grotesk 700, 노선 색, 출발 표에서 2.5rem
숫자: Azeret Mono 400과 500만 쓴다. 자간은 -0.05em에서 -0.08em으로 두어 시각이 한 단어로 읽히게 한다. 출발 표에서 분은 2.125rem, 시각은 1rem이다.
열 머리글과 단위: 0.9375rem, 회색, 읽히는 대로의 대소문자로 쓴다.

LAYOUT:
- 12열 그리드 하나, 간격 없음, 최대 너비 약 1120px, 모든 내용 왼쪽 정렬. 섹션 간격 120px.
- 상단 바: 높이 72px, 1px 구분선 위. 운영사 이름, 페이지 내 링크, 흰색 채움 버튼 하나.
- 히어로: 제목은 8열, 소개 문단은 마지막 4열에 두고 기준선을 공유한다. 그 아래 출발 안내판은 다음 출발 8편을 노선, 행선지, 경유, 승강장, 시각, 분 열을 가진 구분선 표로 보여 준다.
- 노선: 정사각형 토글 버튼 6개와 선택한 노선의 정류장 띠 도식. 데스크톱에서 띠는 가로이며 분은 선 위, 정류장 이름은 선 아래에 둔다. 휴대폰에서는 세로로 바뀌어 노선이 왼쪽 가장자리를 따라 내려간다.
- 시간표와 요금: 제목은 2열짜리 옆 열에, 구분선 표는 나머지 10열에 둔다. 휴대폰에서는 표의 각 행이 쌓인 블록이 된다.
- 운행 안내와 도움말: 같은 그리드의 평평한 구분선 행, 2열, 6열, 4열 단위.

COMPONENTS:
- 출발 안내판: 위쪽 2px 흰 선, 행 사이 1px 선. 지금 출발하는 행은 노선 색 블록에 어두운 글자를 쓰고, 나머지 행은 분을 보여 준다.
- 노선 선택기: 버튼 높이 48px, 1px 선, 번호는 노선 색. 눌린 버튼은 그 색으로 채운다. 정확히 하나가 눌려 있다.
- 노선 띠: 노선 색 6px 선, 정류장마다 4px 눈금. 환승역은 빈 정사각형, 종점은 채운 막대, 양 끝에 첫차와 막차.
- 버튼: 높이 44px, 흰색 채움, 어두운 글자.
- 구분선: rgba(255,255,255,0.3) 1px. 표는 2px 흰 선으로 시작한다.
- 모든 모서리는 직각이다.

MOTION:
- 호버는 160ms 동안 색만 바꾼다. 다른 것은 움직이지 않는다.

FORBIDDEN:
- 글로, text-shadow, 네온 튜브, 주사선, 장식으로 그린 격자선
- 제목 단어, 버튼, 노선이 아닌 링크에 쓴 네온
- 네 번째 색, 또는 페이지 색을 바꾸는 스위치
- 카드, 알약 모양, 칩, 둥근 모서리
- 제목 위의 작은 라벨, 전부 대문자에 자간을 넓힌 라벨
- 발행 번호, 도장, 흐르는 자막 띠 같은 잡지 표지 소품
- 휴대폰에서 가로로 스크롤되는 표

OUTPUT:
1) CSS 사용자 정의 속성
2) 시맨틱 HTML과 CSS: 실제 표, 정류장용 순서 있는 목록, aria-pressed를 가진 토글 버튼
3) 320px까지 반응형, 가로 스크롤 없음
4) 보이는 포커스와 reduced-motion 지원`,
  ja: `Neon × Swiss フュージョンで、実際のページを1枚デザインする。ほぼ黒の背景に、厳密な12カラムのグリッドを敷く。各ネオンカラーは1つのものを表すコードで、そのものにだけ現れる。

すでに部分ごとに色分けされている、もっともらしいテーマを1つ選び、実際の内容を書く。例：夜行バスの路線網、地下鉄の路線図、スキー場、フェスティバルのタイムテーブル。ページはそのテーマのページとして読めること。スタイルそのものについてのページになってはならない。

TOKENS:
--bg: #06080f
--ink: #ffffff
--muted: #a0a8b8
--line: rgba(255,255,255,0.3)
--teal: #16f2d1
--sky: #7cc7ff
--lime: #e6ff4d
他の色は使わない。グロー、グラデーション、影は使わない。

THE COLOUR RULE:
- 各ネオンは固定された意味を1つだけ持つ。ここでは路線の群れを表す。川沿いの路線はteal、北の路線はsky、南の路線はlime。
- ネオンは、その名前が示すものにだけ現れる。路線番号、図に描かれた路線、その路線のバスが今発車することを示すブロック、押された路線ボタン。
- 見出し、本文、罫線、リンク、唯一の塗りボタン、フォーカスリングは白またはグレー。
- 最初の表の下の凡例で、各色の意味を示す。

TYPOGRAPHY:
2つのファミリーを使う。見出しと本文はFamiljen Grotesk、時刻、のりばの文字、分の数字はAzeret Mono。
H1: Familjen Grotesk 600、clamp(2.75rem, 7.4vw, 5.75rem)、行間0.96、字間-0.045em
H2: Familjen Grotesk 600、clamp(1.875rem, 5.2vw, 2.875rem)、行間1.02、字間-0.035em
本文: Familjen Grotesk 400、1.0625rem、行間1.5
路線番号: Familjen Grotesk 700、路線の色、発車表では2.5rem
数字: Azeret Mono 400と500のみ。字間は-0.05emから-0.08emにして、時刻が一語として読めるようにする。発車表で分は2.125rem、時刻は1rem。
列見出しと単位: 0.9375rem、グレー。読まれる通りの大文字小文字で書く。

LAYOUT:
- 12カラムのグリッドを1つ。ガターなし、最大幅約1120px、すべて左揃え。セクション間は120px。
- 上部バー：高さ72px、1pxの罫線の上。運営会社名、ページ内リンク、白い塗りボタン1つ。
- ヒーロー：見出しは8カラム、リード文は最後の4カラムに置き、ベースラインを揃える。その下に発車案内板：次の8便を、路線、行先、経由、のりば、時刻、分数の列を持つ罫線付きの表で示す。
- 路線：正方形の切り替えボタン6つの選択部と、選んだ路線を停留所の帯として描いた図。デスクトップでは帯は横向きで、分数は線の上、停留所名は線の下。スマートフォンでは縦向きになり、路線は左端を下へ伸びる。
- 時刻表と運賃：見出しは2カラム分の脇の列に、罫線の表は残りの10カラムに置く。スマートフォンでは表の各行が積み重なったブロックになる。
- 運行情報とヘルプ：同じグリッド上の、罫線で区切られた平らな行。2、6、4カラムの幅。

COMPONENTS:
- 発車案内板：上に2pxの白い線、行の間は1pxの線。今発車する行は路線色のブロックに暗い文字を置き、ほかの行は分数を示す。
- 路線ボタン：高さ48px、1pxの線、番号は路線の色。押されたボタンはその色で塗る。必ず1つだけが押されている。
- 路線の帯：路線色の6pxの線、停留所ごとに4pxの目盛り。乗り換え駅は空いた正方形、終点は塗りつぶしのバー、両端に始発と最終。
- ボタン：高さ44px、白の塗り、暗い文字。
- 罫線：rgba(255,255,255,0.3)の1px。表は2pxの白い線で始まる。
- すべての角は直角。

MOTION:
- ホバーは160msで色だけが変わる。ほかは動かない。

FORBIDDEN:
- グロー、text-shadow、ネオンチューブ、走査線、装飾として描いた格子線
- 見出しの語、ボタン、路線でないリンクに付けるネオン
- 4つめの色、ページの色を変える切り替え
- カード、ピル型、チップ、丸い角
- 見出しの上の小さなラベル、すべて大文字で字間を広げたラベル
- 号数、スタンプ、流れるテロップ、その他の雑誌表紙の小道具
- スマートフォンで横にスクロールする表

OUTPUT:
1) CSS カスタムプロパティ
2) セマンティックなHTMLとCSS：実際の表、停留所の順序付きリスト、aria-pressedを持つトグルボタン
3) 320pxまでのレスポンシブ対応、横スクロールなし
4) 見えるフォーカスとreduced-motionへの対応`,
};

const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key]));

// A translated phrase with {slots}, such as "{n} min" or "Change for {lines}".
// Each slot takes an element; the words around the slots become spans, so a
// layout can hide the words and keep the slots.
function Phrase({ text, slots, words }: { text: string; slots: Record<string, ReactNode>; words?: string }) {
  return text
    .split(/(\{\w+\})/)
    .filter(Boolean)
    .map((part, index) => {
      const slot = part.match(/^\{(\w+)\}$/)?.[1];
      return slot ? <Fragment key={index}>{slots[slot]}</Fragment> : <span key={index} className={words}>{part}</span>;
    });
}

const lineClass = (id: LineId) => `ns-line--${LINE_BY_ID[id].group}`;

export function PortedFusionNeonSwissPage({ lang }: PortedStylePageProps) {
  const [lineId, setLineId] = useState<LineId>('N4');
  const t = (text: Tri) => text[lang];

  const line = LINE_BY_ID[lineId];
  const stops: Stop[] = [{ name: HUB, min: 0 }, ...line.stops];
  const laterOnSaturday = toMinutes(line.sat.last) - toMinutes(line.fri.last);
  const saturday = fill(t(line.sat.every === line.fri.every ? STRIP.satSame : STRIP.satFaster), {
    line: line.id,
    every: line.sat.every,
    later: laterOnSaturday,
  });

  const minutes = (n: number) => <Phrase text={t(UNITS.minutes)} slots={{ n: <b>{n}</b> }} />;
  const span = (service: { first: string; last: string }) => (
    <Phrase text={t(UNITS.span)} slots={{ first: <b>{service.first}</b>, last: <b>{service.last}</b> }} />
  );

  return (
    <FusionShell
      fusionId="fusion-neon-swiss"
      lang={lang}
      tone="dark"
      accent="#ffffff"
      prev={{ href: '/pages/fusion-quiet-manifesto.html', label: 'Quiet Manifesto' }}
      next={{ href: '/pages/fusion-product-swiss.html', label: 'Product × Swiss' }}
      prompts={PROMPTS}
    >
      <div className="ns">
        <div className="ns-bar">
          <div className="ns-mark"><b>{BAR.operator}</b> <span>{t(BAR.network)}</span></div>
          <nav className="ns-bar__nav" aria-label={t(BAR.nav)}>
            <a href="#ns-departures">{t(BAR.departures)}</a>
            <a href="#ns-lines">{t(BAR.lines)}</a>
            <a href="#ns-timetable">{t(BAR.timetable)}</a>
            <a href="#ns-notices">{t(BAR.notices)}</a>
            <a href="#ns-help">{t(BAR.help)}</a>
          </nav>
          <a className="ns-btn" href="#ns-fares">
            <span className="ns-long">{t(BAR.fares)}</span>
            <span className="ns-short">{t(BAR.faresShort)}</span>
          </a>
        </div>

        <section className="ns-hero" aria-labelledby="ns-title">
          <div className="ns-hero__top ns-grid">
            <h1 id="ns-title">{t(HERO.title)}</h1>
            <p className="ns-lede">{t(HERO.lede)}</p>
          </div>

          <div className="ns-board" id="ns-departures">
            <div className="ns-board__head ns-grid">
              <h2 id="ns-board-title">{t(BOARD.title)}</h2>
              <p className="ns-clock"><span>{t(BOARD.night)}</span> <time dateTime={NOW}>{NOW}</time></p>
            </div>
            <table className="ns-departures" aria-labelledby="ns-board-title">
              <thead>
                <tr>
                  <th scope="col">{t(BOARD.line)}</th>
                  <th scope="col">{t(BOARD.to)}</th>
                  <th scope="col">{t(BOARD.via)}</th>
                  <th scope="col">
                    <span className="ns-long">{t(BOARD.platform)}</span>
                    <span className="ns-short">{t(BOARD.platformShort)}</span>
                  </th>
                  <th scope="col">{t(BOARD.time)}</th>
                  <th scope="col">{t(BOARD.due)}</th>
                </tr>
              </thead>
              <tbody>
                {DEPARTURES.map(({ line: bus, at }) => {
                  const wait = at - toMinutes(NOW);
                  return (
                    <tr key={`${bus.id}-${at}`} className={lineClass(bus.id)}>
                      <th scope="row" className="ns-no">{bus.id}</th>
                      <td className="ns-to">{terminus(bus)}</td>
                      <td className="ns-via">{bus.via}</td>
                      <td className="ns-plat">{bus.platform}</td>
                      <td className="ns-at"><time dateTime={toClock(at)}>{toClock(at)}</time></td>
                      <td className="ns-due">{wait === 0 ? <b className="ns-now">{t(BOARD.now)}</b> : minutes(wait)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="ns-board__foot ns-grid">
              <ul className="ns-key" role="list">
                {GROUPS.map((group) => (
                  <li key={group.id} className={`ns-line--${group.id}`}>
                    <i aria-hidden="true" />
                    {t(group.name)}
                    {LINES.filter((item) => item.group === group.id).map((item) => (
                      <Fragment key={item.id}> <b>{item.id}</b></Fragment>
                    ))}
                  </li>
                ))}
              </ul>
              <p className="ns-board__live">{t(BOARD.live)}</p>
            </div>
          </div>
        </section>

        <section className="ns-section" id="ns-lines" aria-labelledby="ns-line-title">
          <div className="ns-head ns-grid">
            <h2 id="ns-line-title">
              <span className={`ns-no ${lineClass(line.id)}`}>{line.id}</span> {fill(t(STRIP.route), { from: HUB, to: terminus(line) })}
            </h2>
            <div className="ns-picker" role="group" aria-label={t(STRIP.picker)}>
              {LINES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={lineClass(item.id)}
                  aria-pressed={item.id === lineId}
                  onClick={() => setLineId(item.id)}
                >
                  {item.id}
                </button>
              ))}
            </div>
            <p>{t(line.about)}</p>
          </div>

          <ol
            className={`ns-strip ${lineClass(line.id)}`}
            role="list"
            aria-label={fill(t(STRIP.label), { line: line.id, hub: HUB })}
            style={{ '--ns-gaps': stops.length - 1 } as CSSProperties}
          >
            {stops.map((stop, index) => {
              const first = index === 0;
              const last = index === stops.length - 1;
              const ends = first ? line.fri : last ? line.back : null;
              return (
                <li key={stop.name} className={`ns-stop${first || stop.change ? ' is-x' : ''}${last ? ' is-end' : ''}`}>
                  <span className="ns-name">{stop.name}</span>
                  <span className="ns-min">{minutes(stop.min)}</span>
                  <i className="ns-tick" aria-hidden="true" />
                  {first ? (
                    <span className="ns-change">
                      <span className="ns-change__words">{t(STRIP.changeAll)}</span>
                      <span className="ns-change__short" aria-hidden="true">{t(STRIP.allLines)}</span>
                    </span>
                  ) : null}
                  {stop.change ? (
                    <span className="ns-change">
                      <Phrase
                        text={t(STRIP.changeFor)}
                        words="ns-change__words"
                        slots={{ lines: stop.change.map((id) => <b key={id} className={lineClass(id)}>{id}</b>) }}
                      />
                    </span>
                  ) : null}
                  {ends ? (
                    <dl className="ns-ends">
                      <div><dt>{t(STRIP.first)}</dt><dd>{ends.first}</dd></div>
                      <div><dt>{t(STRIP.last)}</dt><dd>{ends.last}</dd></div>
                    </dl>
                  ) : null}
                </li>
              );
            })}
          </ol>
          <p className="ns-note">{t(STRIP.ends)} {saturday}</p>
        </section>

        <section className="ns-section" id="ns-timetable" aria-labelledby="ns-timetable-title">
          <div className="ns-head ns-grid">
            <h2 id="ns-timetable-title">{t(TIMETABLE.title)}</h2>
          </div>

          <div className="ns-split ns-grid">
            <div className="ns-side">
              <h3 id="ns-frequency-title">{t(TIMETABLE.frequency)}</h3>
              <p>{t(TIMETABLE.frequencyNote)}</p>
            </div>
            <table className="ns-freq" role="table" aria-labelledby="ns-frequency-title">
              <thead role="rowgroup">
                <tr role="row">
                  <th scope="col" role="columnheader">{t(BOARD.line)}</th>
                  <th scope="col" role="columnheader">{t(BOARD.to)}</th>
                  <th scope="col" role="columnheader">{t(TIMETABLE.friEvery)}</th>
                  <th scope="col" role="columnheader" aria-label={t(TIMETABLE.friSpan)}>{t(TIMETABLE.span)}</th>
                  <th scope="col" role="columnheader">{t(TIMETABLE.satEvery)}</th>
                  <th scope="col" role="columnheader" aria-label={t(TIMETABLE.satSpan)}>{t(TIMETABLE.span)}</th>
                </tr>
              </thead>
              <tbody role="rowgroup">
                {LINES.map((item) => (
                  <tr key={item.id} role="row" className={lineClass(item.id)}>
                    <th scope="row" role="rowheader" className="ns-no">{item.id}</th>
                    <td role="cell" className="ns-to">{terminus(item)}</td>
                    <td role="cell" className="ns-ev ns-ev--fri" data-label={t(TIMETABLE.fri)}>{minutes(item.fri.every)}</td>
                    <td role="cell" className="ns-hrs ns-hrs--fri">{span(item.fri)}</td>
                    <td role="cell" className="ns-ev ns-ev--sat" data-label={t(TIMETABLE.sat)}>{minutes(item.sat.every)}</td>
                    <td role="cell" className="ns-hrs ns-hrs--sat">{span(item.sat)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ns-split ns-grid" id="ns-fares">
            <div className="ns-side">
              <h3 id="ns-fares-title">{t(FARES.title)}</h3>
              <p>{t(FARES.note)}</p>
            </div>
            <table className="ns-fares" role="table" aria-labelledby="ns-fares-title">
              <thead role="rowgroup">
                <tr role="row">
                  <th scope="col" role="columnheader">{t(FARES.ticket)}</th>
                  <th scope="col" role="columnheader">{t(FARES.covers)}</th>
                  <th scope="col" role="columnheader">{t(FARES.price)}</th>
                </tr>
              </thead>
              <tbody role="rowgroup">
                {FARES.rows.map((row) => (
                  <tr key={row.name.en} role="row">
                    <th scope="row" role="rowheader" className="ns-ticket">{t(row.name)}</th>
                    <td role="cell" className="ns-covers">{t(row.body)}</td>
                    <td role="cell" className="ns-price">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="ns-section" id="ns-notices" aria-labelledby="ns-notices-title">
          <div className="ns-head ns-grid">
            <h2 id="ns-notices-title">{t(NOTICES.title)}</h2>
          </div>
          <ul className="ns-rows" role="list">
            {NOTICES.rows.map((row) => (
              <li key={row.title.en}>
                <h3 className="ns-rows__main">{t(row.title)}</h3>
                <p className="ns-rows__key ns-rows__when">{t(row.when)}</p>
                <p className="ns-rows__main ns-rows__text">{t(row.body)}</p>
                <p className="ns-rows__side ns-affects">
                  <span className="ns-sr">{t(NOTICES.affects)}</span>
                  {row.lines.map((id) => (
                    <Fragment key={id}> <b className={`ns-no ${lineClass(id)}`}>{id}</b></Fragment>
                  ))}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="ns-section" id="ns-help" aria-labelledby="ns-help-title">
          <div className="ns-head ns-grid">
            <h2 id="ns-help-title">{t(HELP.title)}</h2>
          </div>
          <dl className="ns-rows">
            {HELP.rows.map((row) => (
              <div key={row.name.en}>
                <dt className="ns-rows__key ns-rows__name">{t(row.name)}</dt>
                <dd className="ns-rows__main ns-rows__text">{t(row.body)}</dd>
                <dd className="ns-rows__side">
                  <span className="ns-fact">{t(row.fact)}</span>
                  <span className="ns-fact__note">{t(row.note)}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <footer className="ns-footer">
          <span>{FOOTER.owner}</span>
          <span>{t(FOOTER.valid)}</span>
        </footer>
      </div>
    </FusionShell>
  );
}
