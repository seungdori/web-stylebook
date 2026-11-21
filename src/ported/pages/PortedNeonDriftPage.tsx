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
  nav: { en: 'Race weekend', ko: 'Race weekend', ja: 'Race weekend' },
  standings: { en: 'Standings', ko: 'Standings', ja: 'Standings' },
  bracket: { en: 'Bracket', ko: 'Bracket', ja: 'Bracket' },
  drivers: { en: 'Drivers', ko: 'Drivers', ja: 'Drivers' },
  schedule: { en: 'Schedule', ko: 'Schedule', ja: 'Schedule' },
  rules: { en: 'Rules', ko: 'Rules', ja: 'Rules' },
  watch: { en: 'Watch live', ko: 'Watch live', ja: 'Watch live' },
} satisfies Record<string, Tri>;

const HERO = {
  event: { en: 'Night Cup, Saturday 21 November', ko: 'Night Cup, Saturday 21 November', ja: 'Night Cup, Saturday 21 November' },
  live: { en: 'Live', ko: 'Live', ja: 'Live' },
  raceTime: { en: 'Race time', ko: 'Race time', ja: 'Race time' },
  title: { en: 'Round 3, Harbour Loop', ko: 'Round 3, Harbour Loop', ja: 'Round 3, Harbour Loop' },
  lede: {
    en: 'Twenty drivers, 30 laps of a 4.1 km street circuit at night, one compulsory pit stop. The top eight on points after tonight race the knockout on Sunday.',
    ko: 'Twenty drivers, 30 laps of a 4.1 km street circuit at night, one compulsory pit stop. The top eight on points after tonight race the knockout on Sunday.',
    ja: 'Twenty drivers, 30 laps of a 4.1 km street circuit at night, one compulsory pit stop. The top eight on points after tonight race the knockout on Sunday.',
  },
  lap: { en: 'Lap', ko: 'Lap', ja: 'Lap' },
  of: { en: 'of {n}', ko: 'of {n}', ja: 'of {n}' },
  pitWindow: { en: 'Pit window, laps 10 to 20', ko: 'Pit window, laps 10 to 20', ja: 'Pit window, laps 10 to 20' },
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
  title: { en: 'Top 10 of 20', ko: 'Top 10 of 20', ja: 'Top 10 of 20' },
  group: { en: 'Time shown', ko: 'Time shown', ja: 'Time shown' },
  gapButton: { en: 'Gap to leader', ko: 'Gap to leader', ja: 'Gap to leader' },
  intervalButton: { en: 'Interval', ko: 'Interval', ja: 'Interval' },
  pos: { en: 'Pos', ko: 'Pos', ja: 'Pos' },
  position: { en: 'Position', ko: 'Position', ja: 'Position' },
  driver: { en: 'Driver', ko: 'Driver', ja: 'Driver' },
  gap: { en: 'Gap', ko: 'Gap', ja: 'Gap' },
  interval: { en: 'Interval', ko: 'Interval', ja: 'Interval' },
  last: { en: 'Last lap', ko: 'Last lap', ja: 'Last lap' },
  stop: { en: 'Stop', ko: 'Stop', ja: 'Stop' },
  leader: { en: 'Leader', ko: 'Leader', ja: 'Leader' },
  inPit: { en: 'In pit', ko: 'In pit', ja: 'In pit' },
  stopNone: { en: 'Not stopped yet', ko: 'Not stopped yet', ja: 'Not stopped yet' },
  stopDone: { en: 'Stopped', ko: 'Stopped', ja: 'Stopped' },
  stopNow: { en: 'In the pits now', ko: 'In the pits now', ja: 'In the pits now' },
  key: { en: 'Pit stop:', ko: 'Pit stop:', ja: 'Pit stop:' },
  keyNone: { en: 'not yet', ko: 'not yet', ja: 'not yet' },
  keyDone: { en: 'made', ko: 'made', ja: 'made' },
  keyNow: { en: 'in the pit lane now', ko: 'in the pit lane now', ja: 'in the pit lane now' },
  personalBest: { en: 'personal best', ko: 'personal best', ja: 'personal best' },
  penalty: { en: '5-second penalty', ko: '5-second penalty', ja: '5-second penalty' },
  note: {
    en: 'Kowalczyk has a 5-second penalty for track limits on lap 16. It is added to his time at the finish.',
    ko: 'Kowalczyk has a 5-second penalty for track limits on lap 16. It is added to his time at the finish.',
    ja: 'Kowalczyk has a 5-second penalty for track limits on lap 16. It is added to his time at the finish.',
  },
  showsGap: { en: 'The tower shows each gap to the leader.', ko: 'The tower shows each gap to the leader.', ja: 'The tower shows each gap to the leader.' },
  showsInterval: {
    en: 'The tower shows each interval to the car ahead.',
    ko: 'The tower shows each interval to the car ahead.',
    ja: 'The tower shows each interval to the car ahead.',
  },
} satisfies Record<string, Tri>;

const LEADER = {
  who: { en: 'Leader, Mara Lindqvist', ko: 'Leader, Mara Lindqvist', ja: 'Leader, Mara Lindqvist' },
  last: { en: 'Last lap', ko: 'Last lap', ja: 'Last lap' },
  best: { en: 'Best, lap 15', ko: 'Best, lap 15', ja: 'Best, lap 15' },
  ahead: { en: 'Ahead of Okafor', ko: 'Ahead of Okafor', ja: 'Ahead of Okafor' },
  stop: { en: 'Pit stop', ko: 'Pit stop', ja: 'Pit stop' },
  notYet: { en: 'Not yet', ko: 'Not yet', ja: 'Not yet' },
} satisfies Record<string, Tri>;

const TRACE = {
  caption: { en: 'Lap times', ko: 'Lap times', ja: 'Lap times' },
  leader: { en: 'Lindqvist, P1', ko: 'Lindqvist, P1', ja: 'Lindqvist, P1' },
  second: { en: 'Okafor, P2', ko: 'Okafor, P2', ja: 'Okafor, P2' },
  faster: { en: 'Faster is higher.', ko: 'Faster is higher.', ja: 'Faster is higher.' },
  alt: {
    en: 'Lap times for laps 1 to 17, faster higher. Lindqvist opens at 1:33.46 and runs between 1:31.6 and 1:32.4 from lap 4, with his fastest, 1:31.62, on lap 15 inside the pit window. Okafor follows within a few tenths; his last lap is 1:31.88.',
    ko: 'Lap times for laps 1 to 17, faster higher. Lindqvist opens at 1:33.46 and runs between 1:31.6 and 1:32.4 from lap 4, with his fastest, 1:31.62, on lap 15 inside the pit window. Okafor follows within a few tenths; his last lap is 1:31.88.',
    ja: 'Lap times for laps 1 to 17, faster higher. Lindqvist opens at 1:33.46 and runs between 1:31.6 and 1:32.4 from lap 4, with his fastest, 1:31.62, on lap 15 inside the pit window. Okafor follows within a few tenths; his last lap is 1:31.88.',
  },
  window: { en: 'Pit window', ko: 'Pit window', ja: 'Pit window' },
} satisfies Record<string, Tri>;

// The leader's and P2's lap times as drawn: the view box is 580 wide (20 units a lap, lap 1
// at 0) and 240 high, from 1:31.0 at the top to 1:34.0 at the bottom (80 units a second).
const LEADER_TRACE = '0,196.8 20,136.8 40,112 60,106.4 80,94.4 100,100 120,81.6 140,88 160,75.2 180,84.8 200,70.4 220,104.8 240,63.2 260,68 280,49.6 300,77.6 320,83.2';
const SECOND_TRACE = '0,209.6 20,144 40,121.6 60,108.8 80,112.8 100,96 120,92 140,86.4 160,89.6 180,79.2 200,82.4 220,72 240,85.6 260,74.4 280,80.8 300,60.8 320,70.4';
const Y_TICKS = ['1:31.0', '1:32.0', '1:33.0', '1:34.0'];
const X_TICKS = [1, 5, 10, 15, 20, 25, 30];
const lapX = (lap: number) => ((lap - 1) / (LAPS - 1)) * 100;

const BRACKET = {
  title: { en: "Sunday's knockout", ko: "Sunday's knockout", ja: "Sunday's knockout" },
  lead: {
    en: 'The top eight on points race head to head on Sunday 22 November, and the higher seed starts on pole. Seeds below are the points as they stand on lap 18, so they can still change tonight. Prize money is €10,000 in all.',
    ko: 'The top eight on points race head to head on Sunday 22 November, and the higher seed starts on pole. Seeds below are the points as they stand on lap 18, so they can still change tonight. Prize money is €10,000 in all.',
    ja: 'The top eight on points race head to head on Sunday 22 November, and the higher seed starts on pole. Seeds below are the points as they stand on lap 18, so they can still change tonight. Prize money is €10,000 in all.',
  },
  hint: {
    en: 'Choose a quarterfinal to mark its two drivers in the drivers table.',
    ko: 'Choose a quarterfinal to mark its two drivers in the drivers table.',
    ja: 'Choose a quarterfinal to mark its two drivers in the drivers table.',
  },
  qf: { en: 'Quarterfinals', ko: 'Quarterfinals', ja: 'Quarterfinals' },
  qfNote: { en: '10 laps each, from 18:30', ko: '10 laps each, from 18:30', ja: '10 laps each, from 18:30' },
  sf: { en: 'Semifinals', ko: 'Semifinals', ja: 'Semifinals' },
  sfNote: { en: '12 laps each, from 20:15', ko: '12 laps each, from 20:15', ja: '12 laps each, from 20:15' },
  final: { en: 'Final', ko: 'Final', ja: 'Final' },
  finalNote: { en: '20 laps and one stop, 21:20', ko: '20 laps and one stop, 21:20', ja: '20 laps and one stop, 21:20' },
  winnerOf: { en: 'Winner of {match}', ko: 'Winner of {match}', ja: 'Winner of {match}' },
  pts: { en: '{n} pts', ko: '{n} pts', ja: '{n} pts' },
  prize: { en: 'Prize money', ko: 'Prize money', ja: 'Prize money' },
  winner: { en: 'Winner', ko: 'Winner', ja: 'Winner' },
  runnerUp: { en: 'Runner-up', ko: 'Runner-up', ja: 'Runner-up' },
  semiLoser: { en: 'Each losing semifinalist', ko: 'Each losing semifinalist', ja: 'Each losing semifinalist' },
  quarterLoser: { en: 'Each quarterfinal loser', ko: 'Each quarterfinal loser', ja: 'Each quarterfinal loser' },
  marked: {
    en: '{match}: {a} and {b} are marked in the drivers table.',
    ko: '{match}: {a} and {b} are marked in the drivers table.',
    ja: '{match}: {a} and {b} are marked in the drivers table.',
  },
  unmarked: { en: 'No quarterfinal is marked.', ko: 'No quarterfinal is marked.', ja: 'No quarterfinal is marked.' },
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
  { id: 'lindqvist', car: 7, name: 'Mara Lindqvist', country: { en: 'Sweden', ko: 'Sweden', ja: 'Sweden' }, team: 'Nordlys Racing', age: 24, wins: 5, points: 71, best: 91.62, bestText: '1:31.62' },
  { id: 'okafor', car: 22, name: 'Tobi Okafor', country: { en: 'United Kingdom', ko: 'United Kingdom', ja: 'United Kingdom' }, team: 'Redline Simsport', age: 27, wins: 3, points: 66, best: 91.76, bestText: '1:31.76' },
  { id: 'santamaria', car: 14, name: 'Iker Santamaría', country: { en: 'Spain', ko: 'Spain', ja: 'Spain' }, team: 'Vértice', age: 21, wins: 2, points: 58, best: 91.9, bestText: '1:31.90' },
  { id: 'tanabe', car: 3, name: 'Rei Tanabe', country: { en: 'Japan', ko: 'Japan', ja: 'Japan' }, team: 'Kaiten Racing', age: 19, wins: 1, points: 52, best: 91.71, bestText: '1:31.71' },
  { id: 'holm', car: 31, name: 'Jesper Holm', country: { en: 'Denmark', ko: 'Denmark', ja: 'Denmark' }, team: 'Nordlys Racing', age: 29, wins: 1, points: 49, best: 91.98, bestText: '1:31.98' },
  { id: 'vandenberg', car: 8, name: 'Noor van den Berg', country: { en: 'Netherlands', ko: 'Netherlands', ja: 'Netherlands' }, team: 'Polder Sim Team', age: 23, wins: 0, points: 44, best: 92.11, bestText: '1:32.11' },
  { id: 'marchetti', car: 55, name: 'Luca Marchetti', country: { en: 'Italy', ko: 'Italy', ja: 'Italy' }, team: 'Redline Simsport', age: 26, wins: 1, points: 40, best: 92.06, bestText: '1:32.06' },
  { id: 'kowalczyk', car: 12, name: 'Ola Kowalczyk', country: { en: 'Poland', ko: 'Poland', ja: 'Poland' }, team: 'Vistula Motorsport', age: 22, wins: 0, points: 38, best: 92.3, bestText: '1:32.30' },
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
  title: { en: 'Drivers in the knockout', ko: 'Drivers in the knockout', ja: 'Drivers in the knockout' },
  lead: {
    en: "The eight who would race on Sunday if Round 3 ended now. Best lap is each driver's fastest at Harbour Loop, tonight or in earlier events.",
    ko: "The eight who would race on Sunday if Round 3 ended now. Best lap is each driver's fastest at Harbour Loop, tonight or in earlier events.",
    ja: "The eight who would race on Sunday if Round 3 ended now. Best lap is each driver's fastest at Harbour Loop, tonight or in earlier events.",
  },
  noMark: {
    en: 'Choose a quarterfinal in the bracket to mark its two drivers here.',
    ko: 'Choose a quarterfinal in the bracket to mark its two drivers here.',
    ja: 'Choose a quarterfinal in the bracket to mark its two drivers here.',
  },
  mark: { en: 'Marked: {match} at {time}, {a} against {b}.', ko: 'Marked: {match} at {time}, {a} against {b}.', ja: 'Marked: {match} at {time}, {a} against {b}.' },
  car: { en: 'No.', ko: 'No.', ja: 'No.' },
  carLong: { en: 'Car number', ko: 'Car number', ja: 'Car number' },
  driver: { en: 'Driver', ko: 'Driver', ja: 'Driver' },
  from: { en: 'From', ko: 'From', ja: 'From' },
  team: { en: 'Team', ko: 'Team', ja: 'Team' },
  age: { en: 'Age', ko: 'Age', ja: 'Age' },
  wins: { en: 'Wins in 2026', ko: 'Wins in 2026', ja: 'Wins in 2026' },
  points: { en: 'Points', ko: 'Points', ja: 'Points' },
  best: { en: 'Best lap', ko: 'Best lap', ja: 'Best lap' },
  fastest: { en: 'fastest of the eight', ko: 'fastest of the eight', ja: 'fastest of the eight' },
  inMatch: { en: 'in {match}', ko: 'in {match}', ja: 'in {match}' },
  statsNone: { en: 'Age {age}, no wins in 2026', ko: 'Age {age}, no wins in 2026', ja: 'Age {age}, no wins in 2026' },
  statsOne: { en: 'Age {age}, 1 win in 2026', ko: 'Age {age}, 1 win in 2026', ja: 'Age {age}, 1 win in 2026' },
  statsMany: { en: 'Age {age}, {wins} wins in 2026', ko: 'Age {age}, {wins} wins in 2026', ja: 'Age {age}, {wins} wins in 2026' },
  sortedPointsDesc: { en: 'Sorted by points, most first.', ko: 'Sorted by points, most first.', ja: 'Sorted by points, most first.' },
  sortedPointsAsc: { en: 'Sorted by points, fewest first.', ko: 'Sorted by points, fewest first.', ja: 'Sorted by points, fewest first.' },
  sortedBestAsc: { en: 'Sorted by best lap, fastest first.', ko: 'Sorted by best lap, fastest first.', ja: 'Sorted by best lap, fastest first.' },
  sortedBestDesc: { en: 'Sorted by best lap, slowest first.', ko: 'Sorted by best lap, slowest first.', ja: 'Sorted by best lap, slowest first.' },
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
    name: { en: 'Main broadcast', ko: 'Main broadcast', ja: 'Main broadcast' },
    where: { en: 'Twitch and YouTube', ko: 'Twitch and YouTube', ja: 'Twitch and YouTube' },
    days: {
      sat: [
        { from: 1, to: 4, time: '18:00', title: { en: 'Pre-show', ko: 'Pre-show', ja: 'Pre-show' } },
        { from: 4, to: 9, time: '18:30', title: { en: 'Round 1, Granite Ring', ko: 'Round 1, Granite Ring', ja: 'Round 1, Granite Ring' } },
        { from: 9, to: 12, time: '19:20', title: { en: 'Paddock', ko: 'Paddock', ja: 'Paddock' } },
        { from: 12, to: 18, time: '19:50', title: { en: 'Round 2, Ashford Park', ko: 'Round 2, Ashford Park', ja: 'Round 2, Ashford Park' } },
        { from: 19, to: 25, time: '21:00', title: { en: 'Round 3, Harbour Loop', ko: 'Round 3, Harbour Loop', ja: 'Round 3, Harbour Loop' }, on: true },
        { from: 25, to: 28, time: '22:00', title: { en: 'Results', ko: 'Results', ja: 'Results' } },
      ],
      sun: [
        { from: 1, to: 4, time: '18:00', title: { en: 'Pre-show', ko: 'Pre-show', ja: 'Pre-show' } },
        { from: 4, to: 13, time: '18:30', title: { en: 'Quarterfinals', ko: 'Quarterfinals', ja: 'Quarterfinals' } },
        { from: 13, to: 19, time: '20:00', title: { en: 'Semifinals', ko: 'Semifinals', ja: 'Semifinals' } },
        { from: 19, to: 27, time: '21:00', title: { en: 'Final', ko: 'Final', ja: 'Final' } },
        { from: 27, to: 30, time: '22:20', title: { en: 'Podium', ko: 'Podium', ja: 'Podium' } },
      ],
    },
  },
  {
    id: 'onboard',
    name: { en: 'Onboard', ko: 'Onboard', ja: 'Onboard' },
    where: { en: 'Twitch, second channel', ko: 'Twitch, second channel', ja: 'Twitch, second channel' },
    days: {
      sat: [
        { from: 4, to: 9, time: '18:30', title: { en: 'Onboard, Round 1', ko: 'Onboard, Round 1', ja: 'Onboard, Round 1' } },
        { from: 12, to: 18, time: '19:50', title: { en: 'Onboard, Round 2', ko: 'Onboard, Round 2', ja: 'Onboard, Round 2' } },
        { from: 19, to: 25, time: '21:00', title: { en: 'Onboard, Round 3', ko: 'Onboard, Round 3', ja: 'Onboard, Round 3' }, on: true },
      ],
      sun: [
        { from: 4, to: 13, time: '18:30', title: { en: 'Onboard, quarterfinals', ko: 'Onboard, quarterfinals', ja: 'Onboard, quarterfinals' } },
        { from: 13, to: 19, time: '20:00', title: { en: 'Onboard, semifinals', ko: 'Onboard, semifinals', ja: 'Onboard, semifinals' } },
        { from: 19, to: 27, time: '21:00', title: { en: 'Onboard, final', ko: 'Onboard, final', ja: 'Onboard, final' } },
      ],
    },
  },
  {
    id: 'spanish',
    name: { en: 'Spanish', ko: 'Spanish', ja: 'Spanish' },
    where: { en: 'YouTube, with commentary in Spanish', ko: 'YouTube, with commentary in Spanish', ja: 'YouTube, with commentary in Spanish' },
    days: {
      sat: [{ from: 4, to: 28, time: '18:30', title: { en: 'Rounds 1 to 3 and results', ko: 'Rounds 1 to 3 and results', ja: 'Rounds 1 to 3 and results' }, on: true }],
      sun: [{ from: 4, to: 30, time: '18:30', title: { en: 'Knockout and podium', ko: 'Knockout and podium', ja: 'Knockout and podium' } }],
    },
  },
];

const AXIS_TIMES = ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
// Saturday, 21:33: 213 of the 300 minutes from 18:00 to 23:00.
const NOW_TIME = '21:33';
const NOW_AT = (213 / 300) * 100;

const SCHEDULE = {
  title: { en: 'On air this weekend', ko: 'On air this weekend', ja: 'On air this weekend' },
  lead: {
    en: 'All times are CET. The main broadcast has English commentary. The onboard feed follows whoever leads the race.',
    ko: 'All times are CET. The main broadcast has English commentary. The onboard feed follows whoever leads the race.',
    ja: 'All times are CET. The main broadcast has English commentary. The onboard feed follows whoever leads the race.',
  },
  day: { en: 'Day', ko: 'Day', ja: 'Day' },
  sat: { en: 'Saturday 21', ko: 'Saturday 21', ja: 'Saturday 21' },
  sun: { en: 'Sunday 22', ko: 'Sunday 22', ja: 'Sunday 22' },
  satLong: { en: 'Saturday 21 November', ko: 'Saturday 21 November', ja: 'Saturday 21 November' },
  sunLong: { en: 'Sunday 22 November', ko: 'Sunday 22 November', ja: 'Sunday 22 November' },
  grid: { en: 'Broadcasts on {day}', ko: 'Broadcasts on {day}', ja: 'Broadcasts on {day}' },
  showing: { en: 'Showing the broadcasts on {day}.', ko: 'Showing the broadcasts on {day}.', ja: 'Showing the broadcasts on {day}.' },
  onAir: { en: 'On air now', ko: 'On air now', ja: 'On air now' },
  until: { en: 'until {time}', ko: 'until {time}', ja: 'until {time}' },
} satisfies Record<string, Tri>;

const lineTime = (line: number) => {
  const minutes = 18 * 60 + (line - 1) * 10;
  return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}`;
};

const RULES = {
  title: { en: 'Rules for tonight', ko: 'Rules for tonight', ja: 'Rules for tonight' },
  lead: {
    en: 'The stewards are Petra Novak and Daniel Reyes. A penalty shows on the timing tower within two laps and is announced on the main broadcast.',
    ko: 'The stewards are Petra Novak and Daniel Reyes. A penalty shows on the timing tower within two laps and is announced on the main broadcast.',
    ja: 'The stewards are Petra Novak and Daniel Reyes. A penalty shows on the timing tower within two laps and is announced on the main broadcast.',
  },
  penaltyHead: { en: 'Penalty', ko: 'Penalty', ja: 'Penalty' },
  rows: [
    {
      term: { en: 'Pit window', ko: 'Pit window', ja: 'Pit window' },
      body: { en: 'One compulsory stop between laps 10 and 20, with a change of tyre compound.', ko: 'One compulsory stop between laps 10 and 20, with a change of tyre compound.', ja: 'One compulsory stop between laps 10 and 20, with a change of tyre compound.' },
      penalty: { en: 'Drive-through if missed', ko: 'Drive-through if missed', ja: 'Drive-through if missed' },
      none: false,
    },
    {
      term: { en: 'Pit lane speed', ko: 'Pit lane speed', ja: 'Pit lane speed' },
      body: { en: '60 km/h from the entry line to the exit line. The limiter must be on before the entry line.', ko: '60 km/h from the entry line to the exit line. The limiter must be on before the entry line.', ja: '60 km/h from the entry line to the exit line. The limiter must be on before the entry line.' },
      penalty: { en: 'Drive-through', ko: 'Drive-through', ja: 'Drive-through' },
      none: false,
    },
    {
      term: { en: 'Track limits', ko: 'Track limits', ja: 'Track limits' },
      body: { en: 'All four wheels past the white line. Three are allowed; the fourth earns a penalty, and every two after that earn another.', ko: 'All four wheels past the white line. Three are allowed; the fourth earns a penalty, and every two after that earn another.', ja: 'All four wheels past the white line. Three are allowed; the fourth earns a penalty, and every two after that earn another.' },
      penalty: { en: '+5 s', ko: '+5 s', ja: '+5 s' },
      none: false,
    },
    {
      term: { en: 'Causing a collision', ko: 'Causing a collision', ja: 'Causing a collision' },
      body: { en: 'The stewards review contact from replays during the race and decide within two laps.', ko: 'The stewards review contact from replays during the race and decide within two laps.', ja: 'The stewards review contact from replays during the race and decide within two laps.' },
      penalty: { en: '+5 s to drive-through', ko: '+5 s to drive-through', ja: '+5 s to drive-through' },
      none: false,
    },
    {
      term: { en: 'Unsafe rejoin', ko: 'Unsafe rejoin', ja: 'Unsafe rejoin' },
      body: { en: 'Coming back onto the track into the path of another car.', ko: 'Coming back onto the track into the path of another car.', ja: 'Coming back onto the track into the path of another car.' },
      penalty: { en: '+10 s', ko: '+10 s', ja: '+10 s' },
      none: false,
    },
    {
      term: { en: 'Disconnection', ko: 'Disconnection', ja: 'Disconnection' },
      body: { en: 'Before the end of lap 1, the race restarts. After that, the driver is classified at the last lap they completed.', ko: 'Before the end of lap 1, the race restarts. After that, the driver is classified at the last lap they completed.', ja: 'Before the end of lap 1, the race restarts. After that, the driver is classified at the last lap they completed.' },
      penalty: { en: 'No penalty', ko: 'No penalty', ja: 'No penalty' },
      none: true,
    },
  ],
};

const FOOT = {
  about: { en: 'An online sim racing league, racing at night since 2021.', ko: 'An online sim racing league, racing at night since 2021.', ja: 'An online sim racing league, racing at night since 2021.' },
  watch: { en: 'Broadcast', ko: 'Broadcast', ja: 'Broadcast' },
  watchValue: { en: 'Twitch and YouTube, in English and Spanish.', ko: 'Twitch and YouTube, in English and Spanish.', ja: 'Twitch and YouTube, in English and Spanish.' },
  protests: { en: 'Protests', ko: 'Protests', ja: 'Protests' },
  protestsValue: {
    en: "To race control within 30 minutes of the chequered flag, from the driver's own account.",
    ko: "To race control within 30 minutes of the chequered flag, from the driver's own account.",
    ja: "To race control within 30 minutes of the chequered flag, from the driver's own account.",
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

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_EN, ja: PROMPT_EN };

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
                              <span aria-hidden="true">+5 s</span>
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
                <div><dt>{t(LEADER.ahead)}</dt><dd className="ac-n">1.384 s</dd></div>
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
