import { useEffect, useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from 'react';
import { flushSync } from 'react-dom';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedRetroPixelPage.css';

// The page of Insert Coin, an arcade bar in Manchester's Northern Quarter, in the Retro
// Pixel style. Silkscreen, a bitmap face, sets the bar's name, the section names and every
// figure a player reads off a screen: initials, scores, times and prices. DotGothic16, a
// 16-dot gothic drawn for screens, reads the sentences and the controls. Components come
// from the bar: the high-score board as a cabinet screen, a floor map of the machines as
// tiles, the machine roster with token pips, the tournament sign-up with three-letter
// initials entry, the rounds of the night as the field shrinking, token bundles drawn as
// tokens and a price board. Notched pixel frames, no rounding, no figures.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

const fill = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));

const NAME = 'Insert Coin';
const ADDRESS = '41 Tib Street, Manchester M4 1LA';
const PHONE = '0161 496 0731';
const TOURNAMENT_PLACES = 32;
const PLACES_TAKEN = 23;

const HERO = {
  open: { en: 'Open today', ko: 'Open today', ja: 'Open today' },
  today: '17:00–01:00',
  lede: {
    en: "An arcade bar on Tib Street in Manchester's Northern Quarter, with 31 arcade cabinets and 5 pinball tables. Buy tokens at the bar with your drink. Most games take one.",
    ko: "An arcade bar on Tib Street in Manchester's Northern Quarter, with 31 arcade cabinets and 5 pinball tables. Buy tokens at the bar with your drink. Most games take one.",
    ja: "An arcade bar on Tib Street in Manchester's Northern Quarter, with 31 arcade cabinets and 5 pinball tables. Buy tokens at the bar with your drink. Most games take one.",
  },
  week: { en: 'Opening hours this week', ko: 'Opening hours this week', ja: 'Opening hours this week' },
  closed: { en: 'Closed', ko: 'Closed', ja: 'Closed' },
  machines: { en: 'See the machines', ko: 'See the machines', ja: 'See the machines' },
  tournament: { en: 'Thursday tournament', ko: 'Thursday tournament', ja: 'Thursday tournament' },
  findUs: {
    en: "Four minutes' walk from Shudehill tram stop, step-free from the street. Over-18s only after 21:00.",
    ko: "Four minutes' walk from Shudehill tram stop, step-free from the street. Over-18s only after 21:00.",
    ja: "Four minutes' walk from Shudehill tram stop, step-free from the street. Over-18s only after 21:00.",
  },
} as const;

interface WeekDay {
  id: string;
  name: Tri;
  hours: string | null;
}

// Today is Saturday 21 November; the tournament is on Thursday 26 November.
const TODAY = 'sat';

const WEEK: WeekDay[] = [
  { id: 'mon', name: { en: 'Mon', ko: 'Mon', ja: 'Mon' }, hours: null },
  { id: 'tue', name: { en: 'Tue', ko: 'Tue', ja: 'Tue' }, hours: '17:00–00:00' },
  { id: 'wed', name: { en: 'Wed', ko: 'Wed', ja: 'Wed' }, hours: '17:00–00:00' },
  { id: 'thu', name: { en: 'Thu', ko: 'Thu', ja: 'Thu' }, hours: '17:00–00:00' },
  { id: 'fri', name: { en: 'Fri', ko: 'Fri', ja: 'Fri' }, hours: '17:00–01:00' },
  { id: 'sat', name: { en: 'Sat', ko: 'Sat', ja: 'Sat' }, hours: '17:00–01:00' },
  { id: 'sun', name: { en: 'Sun', ko: 'Sun', ja: 'Sun' }, hours: '15:00–23:00' },
];

type Period = 'week' | 'all';

interface Score {
  ini: string;
  score: number;
  machine: string;
  when: Tri;
  /** Set last night. */
  isNew?: boolean;
}

const BOARD = {
  title: { en: 'High scores', ko: 'High scores', ja: 'High scores' },
  period: { en: 'Period', ko: 'Period', ja: 'Period' },
  week: { en: 'This week', ko: 'This week', ja: 'This week' },
  all: { en: 'All time', ko: 'All time', ja: 'All time' },
  player: { en: 'Player', ko: 'Player', ja: 'Player' },
  score: { en: 'Score', ko: 'Score', ja: 'Score' },
  machine: { en: 'Machine', ko: 'Machine', ja: 'Machine' },
  setOn: { en: 'Set on', ko: 'Set on', ja: 'Set on' },
  isNew: { en: 'New', ko: 'New', ja: 'New' },
  lastNight: { en: ', set last night', ko: ', set last night', ja: ', set last night' },
  footWeek: {
    en: 'The best score on each machine since Tuesday. Clears next Tuesday.',
    ko: 'The best score on each machine since Tuesday. Clears next Tuesday.',
    ja: 'The best score on each machine since Tuesday. Clears next Tuesday.',
  },
  footAll: {
    en: 'The record on each machine since Insert Coin opened in March 2017.',
    ko: 'The record on each machine since Insert Coin opened in March 2017.',
    ja: 'The record on each machine since Insert Coin opened in March 2017.',
  },
  newsWeek: { en: "Showing this week's best scores.", ko: "Showing this week's best scores.", ja: "Showing this week's best scores." },
  newsAll: { en: 'Showing the all-time records.', ko: 'Showing the all-time records.', ja: 'Showing the all-time records.' },
} as const;

const FRI: Tri = { en: 'Fri', ko: 'Fri', ja: 'Fri' };
const THU: Tri = { en: 'Thu', ko: 'Thu', ja: 'Thu' };
const WED: Tri = { en: 'Wed', ko: 'Wed', ja: 'Wed' };
const TUE: Tri = { en: 'Tue', ko: 'Tue', ja: 'Tue' };

const SCORES: Record<Period, Score[]> = {
  week: [
    { ini: 'QBE', score: 287450, machine: 'Galaga', when: FRI, isNew: true },
    { ini: 'OBI', score: 1286400, machine: 'Street Fighter II', when: FRI },
    { ini: 'RHA', score: 118370, machine: 'Ms. Pac-Man', when: THU },
    { ini: 'NAT', score: 612450, machine: 'Metal Slug', when: THU },
    { ini: 'JMC', score: 486200, machine: 'Donkey Kong', when: THU },
    { ini: 'DTK', score: 1042650, machine: 'Robotron: 2084', when: WED },
    { ini: 'MEG', score: 214577, machine: 'Tetris', when: WED },
    { ini: 'AVE', score: 84312, machine: 'Centipede', when: WED },
    { ini: 'SAM', score: 212400, machine: 'Joust', when: TUE },
    { ini: 'LIZ', score: 318900, machine: 'Defender', when: TUE },
  ],
  all: [
    { ini: 'MEG', score: 642880, machine: 'Tetris', when: { en: 'Aug 2025', ko: 'Aug 2025', ja: 'Aug 2025' } },
    { ini: 'KAT', score: 2316500, machine: 'Street Fighter II', when: { en: 'Jan 2025', ko: 'Jan 2025', ja: 'Jan 2025' } },
    { ini: 'NAT', score: 1036200, machine: 'Metal Slug', when: { en: 'Apr 2024', ko: 'Apr 2024', ja: 'Apr 2024' } },
    { ini: 'TBK', score: 1412300, machine: 'Galaga', when: { en: 'Feb 2024', ko: 'Feb 2024', ja: 'Feb 2024' } },
    { ini: 'JMC', score: 1065800, machine: 'Donkey Kong', when: { en: 'Sep 2023', ko: 'Sep 2023', ja: 'Sep 2023' } },
    { ini: 'DTK', score: 1840250, machine: 'Robotron: 2084', when: { en: 'Jun 2022', ko: 'Jun 2022', ja: 'Jun 2022' } },
    { ini: 'LIZ', score: 744100, machine: 'Defender', when: { en: 'Mar 2022', ko: 'Mar 2022', ja: 'Mar 2022' } },
    { ini: 'RHA', score: 382760, machine: 'Ms. Pac-Man', when: { en: 'May 2021', ko: 'May 2021', ja: 'May 2021' } },
    { ini: 'SAM', score: 1104550, machine: 'Joust', when: { en: 'Nov 2019', ko: 'Nov 2019', ja: 'Nov 2019' } },
    { ini: 'AVE', score: 418236, machine: 'Centipede', when: { en: 'Dec 2018', ko: 'Dec 2018', ja: 'Dec 2018' } },
  ],
};

// A cabinet's score counter has seven digits; the leading ones stay unlit.
const SCORE_DIGITS = 7;

type RoomId = 'front' | 'back' | 'pinball';

interface Machine {
  name: string;
  maker: string;
  year: number;
  tokens: number;
  /** Why it is out of order tonight. */
  out?: Tri;
}

interface Room {
  id: RoomId;
  name: Tri;
  machines: Machine[];
}

const ROOMS: Room[] = [
  {
    id: 'front',
    name: { en: 'Front room', ko: 'Front room', ja: 'Front room' },
    machines: [
      { name: 'Galaga', maker: 'Namco', year: 1981, tokens: 1 },
      { name: 'Ms. Pac-Man', maker: 'Midway', year: 1982, tokens: 1 },
      { name: 'Donkey Kong', maker: 'Nintendo', year: 1981, tokens: 1 },
      { name: 'Robotron: 2084', maker: 'Williams', year: 1982, tokens: 1 },
      {
        name: 'Defender',
        maker: 'Williams',
        year: 1981,
        tokens: 1,
        out: { en: 'Fire button sticks. New switch on Tuesday.', ko: 'Fire button sticks. New switch on Tuesday.', ja: 'Fire button sticks. New switch on Tuesday.' },
      },
      { name: 'Centipede', maker: 'Atari', year: 1981, tokens: 1 },
      { name: 'Joust', maker: 'Williams', year: 1982, tokens: 1 },
      { name: 'Tetris', maker: 'Atari Games', year: 1988, tokens: 1 },
      { name: 'Asteroids', maker: 'Atari', year: 1979, tokens: 1 },
      { name: 'Frogger', maker: 'Konami', year: 1981, tokens: 1 },
      { name: 'Dig Dug', maker: 'Namco', year: 1982, tokens: 1 },
      { name: 'Bubble Bobble', maker: 'Taito', year: 1986, tokens: 1 },
    ],
  },
  {
    id: 'back',
    name: { en: 'Back room', ko: 'Back room', ja: 'Back room' },
    machines: [
      { name: 'Street Fighter II', maker: 'Capcom', year: 1991, tokens: 1 },
      { name: 'Street Fighter Alpha 3', maker: 'Capcom', year: 1998, tokens: 1 },
      { name: 'Mortal Kombat II', maker: 'Midway', year: 1993, tokens: 1 },
      { name: 'Tekken 3', maker: 'Namco', year: 1997, tokens: 1 },
      { name: "The King of Fighters '98", maker: 'SNK', year: 1998, tokens: 1 },
      { name: 'Marvel vs. Capcom', maker: 'Capcom', year: 1998, tokens: 1 },
      { name: 'Metal Slug', maker: 'SNK', year: 1996, tokens: 1 },
      { name: 'Teenage Mutant Ninja Turtles', maker: 'Konami', year: 1989, tokens: 1 },
      { name: 'The Simpsons', maker: 'Konami', year: 1991, tokens: 1 },
      { name: 'Golden Axe', maker: 'Sega', year: 1989, tokens: 1 },
      { name: 'NBA Jam', maker: 'Midway', year: 1993, tokens: 1 },
      { name: 'OutRun', maker: 'Sega', year: 1986, tokens: 2 },
      { name: 'Daytona USA', maker: 'Sega', year: 1994, tokens: 2 },
      { name: 'Sega Rally Championship', maker: 'Sega', year: 1995, tokens: 2 },
      { name: "Cruis'n USA", maker: 'Midway', year: 1994, tokens: 2 },
      { name: 'Crazy Taxi', maker: 'Sega', year: 1999, tokens: 2 },
      { name: 'Time Crisis 2', maker: 'Namco', year: 1997, tokens: 2 },
      { name: 'The House of the Dead 2', maker: 'Sega', year: 1998, tokens: 2 },
      {
        name: 'Point Blank',
        maker: 'Namco',
        year: 1994,
        tokens: 2,
        out: { en: 'Screen fault. Engineer booked for Wednesday.', ko: 'Screen fault. Engineer booked for Wednesday.', ja: 'Screen fault. Engineer booked for Wednesday.' },
      },
    ],
  },
  {
    id: 'pinball',
    name: { en: 'Pinball', ko: 'Pinball', ja: 'Pinball' },
    machines: [
      { name: 'The Addams Family', maker: 'Bally', year: 1992, tokens: 3 },
      { name: 'Twilight Zone', maker: 'Bally', year: 1993, tokens: 3 },
      { name: 'Attack from Mars', maker: 'Bally', year: 1995, tokens: 3 },
      { name: 'Theatre of Magic', maker: 'Bally', year: 1995, tokens: 3 },
      { name: 'Medieval Madness', maker: 'Williams', year: 1997, tokens: 3 },
    ],
  },
];

const ALL_MACHINES = ROOMS.flatMap((room) => room.machines);
const OUT_COUNT = ALL_MACHINES.filter((machine) => machine.out).length;
const WORKING_COUNT = ALL_MACHINES.length - OUT_COUNT;

const MACHINES = {
  title: { en: 'The machines', ko: 'The machines', ja: 'The machines' },
  intro: {
    en: 'The front room sits around the bar, the back room has the fighting, driving and light-gun cabinets, and the pinball tables line the corridor between them.',
    ko: 'The front room sits around the bar, the back room has the fighting, driving and light-gun cabinets, and the pinball tables line the corridor between them.',
    ja: 'The front room sits around the bar, the back room has the fighting, driving and light-gun cabinets, and the pinball tables line the corridor between them.',
  },
  working: { en: 'working tonight', ko: 'working tonight', ja: 'working tonight' },
  out: { en: 'out of order', ko: 'out of order', ja: 'out of order' },
  rooms: { en: 'Room', ko: 'Room', ja: 'Room' },
  list: { en: '{room} machines', ko: '{room} machines', ja: '{room} machines' },
  machine: { en: 'Machine', ko: 'Machine', ja: 'Machine' },
  made: { en: 'Made', ko: 'Made', ja: 'Made' },
  tokens: { en: 'Tokens a play', ko: 'Tokens a play', ja: 'Tokens a play' },
  tonight: { en: 'Tonight', ko: 'Tonight', ja: 'Tonight' },
  isWorking: { en: 'Working', ko: 'Working', ja: 'Working' },
  isOut: { en: 'Out of order', ko: 'Out of order', ja: 'Out of order' },
  foot: {
    en: 'If a machine takes your token and does not start, tell the bar and you get the token back.',
    ko: 'If a machine takes your token and does not start, tell the bar and you get the token back.',
    ja: 'If a machine takes your token and does not start, tell the bar and you get the token back.',
  },
} as const;

const TOUR = {
  title: { en: 'Thursday tournament', ko: 'Thursday tournament', ja: 'Thursday tournament' },
  date: { en: 'Thu 26 Nov', ko: 'Thu 26 Nov', ja: 'Thu 26 Nov' },
  where: { en: 'from 20:00, on Ms. Pac-Man', ko: 'from 20:00, on Ms. Pac-Man', ja: 'from 20:00, on Ms. Pac-Man' },
  format: {
    en: 'Qualifying runs from 20:00 to 21:30 on the cabinet by the window. You get three games and your best score counts. The top eight then play head to head on the two cabinets by the bar, one game each, and the higher score goes through.',
    ko: 'Qualifying runs from 20:00 to 21:30 on the cabinet by the window. You get three games and your best score counts. The top eight then play head to head on the two cabinets by the bar, one game each, and the higher score goes through.',
    ja: 'Qualifying runs from 20:00 to 21:30 on the cabinet by the window. You get three games and your best score counts. The top eight then play head to head on the two cabinets by the bar, one game each, and the higher score goes through.',
  },
  entry: {
    en: 'Entry is £5 at the bar on the night and comes with 10 tokens to warm up on anything else. The machine changes on the first Thursday of each month.',
    ko: 'Entry is £5 at the bar on the night and comes with 10 tokens to warm up on anything else. The machine changes on the first Thursday of each month.',
    ja: 'Entry is £5 at the bar on the night and comes with 10 tokens to warm up on anything else. The machine changes on the first Thursday of each month.',
  },
  prizes: { en: 'Prizes', ko: 'Prizes', ja: 'Prizes' },
} as const;

const PRIZES: Array<{ place: string; prize: Tri }> = [
  {
    place: '1st',
    prize: {
      en: '£100 bar tab and your initials on the brass plate by the door',
      ko: '£100 bar tab and your initials on the brass plate by the door',
      ja: '£100 bar tab and your initials on the brass plate by the door',
    },
  },
  { place: '2nd', prize: { en: '80 tokens', ko: '80 tokens', ja: '80 tokens' } },
  { place: '3rd', prize: { en: '40 tokens', ko: '40 tokens', ja: '40 tokens' } },
];

const SIGNUP = {
  title: { en: 'Sign up for 26 November', ko: 'Sign up for 26 November', ja: 'Sign up for 26 November' },
  note: {
    en: 'Your initials go on the qualifying board exactly as you enter them.',
    ko: 'Your initials go on the qualifying board exactly as you enter them.',
    ja: 'Your initials go on the qualifying board exactly as you enter them.',
  },
  left: { en: '{n} places left', ko: '{n} places left', ja: '{n} places left' },
  oneLeft: { en: '1 place left', ko: '1 place left', ja: '1 place left' },
  of: { en: 'of {total}', ko: 'of {total}', ja: 'of {total}' },
  initials: { en: 'Initials', ko: 'Initials', ja: 'Initials' },
  hint: {
    en: 'Three letters, A to Z. Type them, or step through the alphabet with the up and down arrows.',
    ko: 'Three letters, A to Z. Type them, or step through the alphabet with the up and down arrows.',
    ja: 'Three letters, A to Z. Type them, or step through the alphabet with the up and down arrows.',
  },
  letters: [
    { en: 'Initials, first letter', ko: 'Initials, first letter', ja: 'Initials, first letter' },
    { en: 'Initials, second letter', ko: 'Initials, second letter', ja: 'Initials, second letter' },
    { en: 'Initials, third letter', ko: 'Initials, third letter', ja: 'Initials, third letter' },
  ] as Tri[],
  missing: { en: 'Enter all three initials.', ko: 'Enter all three initials.', ja: 'Enter all three initials.' },
  notLetters: {
    en: 'Initials take the letters A to Z only, no numbers or symbols.',
    ko: 'Initials take the letters A to Z only, no numbers or symbols.',
    ja: 'Initials take the letters A to Z only, no numbers or symbols.',
  },
  name: { en: 'First name', ko: 'First name', ja: 'First name' },
  nameError: {
    en: 'Write your first name, so the bar can call you to the cabinet.',
    ko: 'Write your first name, so the bar can call you to the cabinet.',
    ja: 'Write your first name, so the bar can call you to the cabinet.',
  },
  submit: { en: 'Hold my place', ko: 'Hold my place', ja: 'Hold my place' },
  after: {
    en: 'Pay at the bar when you arrive. Places not claimed by 19:45 go to the waiting list.',
    ko: 'Pay at the bar when you arrive. Places not claimed by 19:45 go to the waiting list.',
    ja: 'Pay at the bar when you arrive. Places not claimed by 19:45 go to the waiting list.',
  },
  doneTitle: { en: '{ini} is on the board.', ko: '{ini} is on the board.', ja: '{ini} is on the board.' },
  doneBody: {
    en: 'Thanks, {name}. Your place is held for Thursday 26 November. Pay £5 at the bar and collect your 10 tokens before 19:45.',
    ko: 'Thanks, {name}. Your place is held for Thursday 26 November. Pay £5 at the bar and collect your 10 tokens before 19:45.',
    ja: 'Thanks, {name}. Your place is held for Thursday 26 November. Pay £5 at the bar and collect your 10 tokens before 19:45.',
  },
  another: { en: 'Sign up another player', ko: 'Sign up another player', ja: 'Sign up another player' },
  full: {
    en: 'That was the last place. Ask at the bar to join the waiting list.',
    ko: 'That was the last place. Ask at the bar to join the waiting list.',
    ja: 'That was the last place. Ask at the bar to join the waiting list.',
  },
} as const;

const NIGHT = {
  title: { en: 'How the night runs', ko: 'How the night runs', ja: 'How the night runs' },
  note: {
    en: 'Each round halves the field. Matches are called on the screen above the bar.',
    ko: 'Each round halves the field. Matches are called on the screen above the bar.',
    ja: 'Each round halves the field. Matches are called on the screen above the bar.',
  },
} as const;

const ROUNDS: Array<{ time: string; name: Tri; detail: Tri; field: number; win?: boolean }> = [
  {
    time: '19:00',
    name: { en: 'Sign-up desk opens', ko: 'Sign-up desk opens', ja: 'Sign-up desk opens' },
    detail: { en: 'Collect your 10 tokens', ko: 'Collect your 10 tokens', ja: 'Collect your 10 tokens' },
    field: 0,
  },
  {
    time: '20:00',
    name: { en: 'Qualifying', ko: 'Qualifying', ja: 'Qualifying' },
    detail: { en: '32 players, best of three games', ko: '32 players, best of three games', ja: '32 players, best of three games' },
    field: 32,
  },
  {
    time: '21:45',
    name: { en: 'Quarterfinals', ko: 'Quarterfinals', ja: 'Quarterfinals' },
    detail: { en: '8 players, four matches', ko: '8 players, four matches', ja: '8 players, four matches' },
    field: 8,
  },
  {
    time: '22:30',
    name: { en: 'Semifinals', ko: 'Semifinals', ja: 'Semifinals' },
    detail: { en: '4 players, two matches', ko: '4 players, two matches', ja: '4 players, two matches' },
    field: 4,
  },
  {
    time: '23:00',
    name: { en: 'Final', ko: 'Final', ja: 'Final' },
    detail: { en: '2 players, one game', ko: '2 players, one game', ja: '2 players, one game' },
    field: 2,
  },
  {
    time: '23:20',
    name: { en: 'Prizes', ko: 'Prizes', ja: 'Prizes' },
    detail: {
      en: "The winner's initials go to the engraver on Friday",
      ko: "The winner's initials go to the engraver on Friday",
      ja: "The winner's initials go to the engraver on Friday",
    },
    field: 1,
    win: true,
  },
];

const PRICES = {
  title: { en: 'Tokens and drinks', ko: 'Tokens and drinks', ja: 'Tokens and drinks' },
  intro: {
    en: 'Tokens are sold at the bar and never expire, so keep what you have left for next time.',
    ko: 'Tokens are sold at the bar and never expire, so keep what you have left for next time.',
    ja: 'Tokens are sold at the bar and never expire, so keep what you have left for next time.',
  },
  tokens: { en: 'Tokens', ko: 'Tokens', ja: 'Tokens' },
  count: { en: '{n} tokens', ko: '{n} tokens', ja: '{n} tokens' },
  one: { en: '1 token', ko: '1 token', ja: '1 token' },
  costs: { en: 'Tokens a play', ko: 'Tokens a play', ja: 'Tokens a play' },
  happy: {
    en: 'Tuesday to Thursday before 19:00, £1 buys 6 tokens.',
    ko: 'Tuesday to Thursday before 19:00, £1 buys 6 tokens.',
    ja: 'Tuesday to Thursday before 19:00, £1 buys 6 tokens.',
  },
  bar: { en: 'At the bar', ko: 'At the bar', ja: 'At the bar' },
} as const;

const BUNDLES = [
  { price: '£1', tokens: 4 },
  { price: '£5', tokens: 22 },
  { price: '£10', tokens: 50 },
];

const COSTS: Array<{ what: Tri; tokens: number }> = [
  { what: { en: 'Arcade cabinets', ko: 'Arcade cabinets', ja: 'Arcade cabinets' }, tokens: 1 },
  { what: { en: 'Driving and light-gun cabinets', ko: 'Driving and light-gun cabinets', ja: 'Driving and light-gun cabinets' }, tokens: 2 },
  { what: { en: 'Pinball, three balls', ko: 'Pinball, three balls', ja: 'Pinball, three balls' }, tokens: 3 },
];

const DRINKS: Array<{ id: string; title: Tri; items: Array<{ name: Tri; abv?: string; price: string }> }> = [
  {
    id: 'draught',
    title: { en: 'Draught, by the pint', ko: 'Draught, by the pint', ja: 'Draught, by the pint' },
    items: [
      { name: { en: 'House lager', ko: 'House lager', ja: 'House lager' }, abv: '4.2%', price: '£5.20' },
      { name: { en: 'Pale ale', ko: 'Pale ale', ja: 'Pale ale' }, abv: '5.0%', price: '£5.80' },
      { name: { en: 'Stout', ko: 'Stout', ja: 'Stout' }, abv: '4.2%', price: '£5.40' },
      { name: { en: 'Dry cider', ko: 'Dry cider', ja: 'Dry cider' }, abv: '4.5%', price: '£5.30' },
    ],
  },
  {
    id: 'cocktails',
    title: { en: 'Cocktails', ko: 'Cocktails', ja: 'Cocktails' },
    items: [
      { name: { en: 'Margarita', ko: 'Margarita', ja: 'Margarita' }, price: '£9.50' },
      { name: { en: 'Paloma', ko: 'Paloma', ja: 'Paloma' }, price: '£9.50' },
      { name: { en: 'Espresso martini', ko: 'Espresso martini', ja: 'Espresso martini' }, price: '£10.00' },
    ],
  },
  {
    id: 'soft',
    title: { en: 'Without alcohol', ko: 'Without alcohol', ja: 'Without alcohol' },
    items: [
      { name: { en: 'Lager', ko: 'Lager', ja: 'Lager' }, abv: '0.0%', price: '£4.50' },
      { name: { en: 'Ginger beer', ko: 'Ginger beer', ja: 'Ginger beer' }, price: '£3.20' },
      { name: { en: 'Cola', ko: 'Cola', ja: 'Cola' }, price: '£2.80' },
    ],
  },
];

const RULES_TITLE: Tri = { en: 'House rules', ko: 'House rules', ja: 'House rules' };

const RULES: Array<{ rule: Tri; why: Tri }> = [
  {
    rule: { en: 'Over-18s only after 21:00', ko: 'Over-18s only after 21:00', ja: 'Over-18s only after 21:00' },
    why: { en: 'Before then, under-18s are welcome with an adult.', ko: 'Before then, under-18s are welcome with an adult.', ja: 'Before then, under-18s are welcome with an adult.' },
  },
  {
    rule: { en: 'Let the next player on', ko: 'Let the next player on', ja: 'Let the next player on' },
    why: { en: 'When there is a queue, play one game, then step back.', ko: 'When there is a queue, play one game, then step back.', ja: 'When there is a queue, play one game, then step back.' },
  },
  {
    rule: { en: 'Drinks on the shelves', ko: 'Drinks on the shelves', ja: 'Drinks on the shelves' },
    why: { en: 'Never on top of a cabinet or on the pinball glass.', ko: 'Never on top of a cabinet or on the pinball glass.', ja: 'Never on top of a cabinet or on the pinball glass.' },
  },
  {
    rule: { en: "Nudge, don't lift", ko: "Nudge, don't lift", ja: "Nudge, don't lift" },
    why: {
      en: 'Rocking a pinball table is part of the game. Lifting its legs is not.',
      ko: 'Rocking a pinball table is part of the game. Lifting its legs is not.',
      ja: 'Rocking a pinball table is part of the game. Lifting its legs is not.',
    },
  },
  {
    rule: { en: 'Lost a token?', ko: 'Lost a token?', ja: 'Lost a token?' },
    why: { en: 'Tell the bar. We give it back and put a note on the machine.', ko: 'Tell the bar. We give it back and put a note on the machine.', ja: 'Tell the bar. We give it back and put a note on the machine.' },
  },
  {
    rule: { en: 'Beat a record?', ko: 'Beat a record?', ja: 'Beat a record?' },
    why: {
      en: 'Call the bar before you walk away so we can photograph the screen.',
      ko: 'Call the bar before you walk away so we can photograph the screen.',
      ja: 'Call the bar before you walk away so we can photograph the screen.',
    },
  },
];

const FOOT = {
  entrance: { en: 'Step-free entrance on Tib Street.', ko: 'Step-free entrance on Tib Street.', ja: 'Step-free entrance on Tib Street.' },
  midweek: { en: 'Tuesday to Thursday 17:00–00:00', ko: 'Tuesday to Thursday 17:00–00:00', ja: 'Tuesday to Thursday 17:00–00:00' },
  weekend: { en: 'Friday and Saturday 17:00–01:00', ko: 'Friday and Saturday 17:00–01:00', ja: 'Friday and Saturday 17:00–01:00' },
  sunday: { en: 'Sunday 15:00–23:00, closed Monday', ko: 'Sunday 15:00–23:00, closed Monday', ja: 'Sunday 15:00–23:00, closed Monday' },
} as const;

const PROMPT_EN = `Design one real page in the Retro Pixel style: an 8-bit screen interface on dark navy, notched pixel frames, bright pixel colours that each mean one thing, and chunky bitmap type.

Pick a believable subject that lives on a screen of pixels, such as an arcade bar, a retro game shop or a chiptune night, and write its real content. The page must read as that subject's page, never as a page about its own style. Here it is Insert Coin, an arcade bar on Tib Street in Manchester: the week's high-score board, today's opening hours, the machines on the floor, Thursday's tournament with its sign-up, token and drink prices and the house rules.

TOKENS:
--bg: #1a1c2c
--deep: #10111c (the board screen, the sign-up panel, the drinks board, and text on green, yellow and orange)
--surface: #333c57 (offset shadows of the headings, the board's inner frame, dimmed floor tiles, the focused initials slot, the outlined button's bevel, menus over the page)
--frame: #5d6f8e (every pixel frame and solid rule; dashed rules between rows at 60% of it)
--ink: #e0f8cf
--muted: #a7b5d1
--green: #a7f070, bevel #5f9a3c (open, working, today, the main button)
--yellow: #ffec27 (records: the board, the initials that go on it, the first prize)
--orange: #f77622, bevel #a8461a (tokens and Thursday)
--red: #ff004d (out of order, form errors)
--blue: #29adff (keyboard focus only)

COLOUR:
- Each colour has one meaning: green is open or working, yellow is a record, orange is tokens and Thursday, red is out of order or an error, blue is keyboard focus.
- The board alone adds four details: 2px scanlines at 22% black, unlit leading score digits at 24% of muted, a #0b0c14 hard shadow and a 10% yellow wash on the newest row. No other colours.
- Red text appears only on --deep, where it keeps 4.5:1, and as the large out-of-order count; in the roster "Out of order" is ink beside a red square.
- Hover: buttons brighten by 8% (filter: brightness(1.08)); the period switch and the room tabs go from muted to ink. Nothing else changes on hover.

TYPOGRAPHY:
Two families. Silkscreen (400 and 700), a bitmap face, sets the name, the section names and every figure a player reads off a screen: initials, scores, times, prices, counts. DotGothic16 (400), a 16-dot screen gothic, sets the reading text, the controls and every small label. Silkscreen sizes stay on multiples of 8px so its pixels stay square.
H1 "Insert Coin": Silkscreen 700, 88px, line-height 1, green, an 8px offset shadow in --surface; on two lines beside the board on desktop, one line when the hero is one column; 72px below 860px, 64px below 640px, 56px below 400px.
H2: Silkscreen 700, 48px, line-height 1.05, ink, a 4px offset shadow in --surface; 40px below 860px, 32px below 640px. The board's heading is yellow without a shadow: 32px beside the hero copy, 40px when the hero is one column, 32px below 860px, 24px below 640px.
H3: DotGothic16 22px, line-height 1.3.
Initials on the board: Silkscreen 700, 32px, yellow. Scores: Silkscreen 400, 32px, seven digits with the leading zeros unlit. Both 24px on phones.
Other figures in Silkscreen: today's hours, the tournament date and the prizes at 40px (32px on phones, 24px below 400px), the prizes in 700 and the others in 400; the counts 400 at 56px (40px on phones), round times 400 at 32px (24px on phones), prices 400 at 24px, initials slots 700 at 48px (40px below 400px).
Body: DotGothic16 400 at 18px, line-height 1.7; the lede 20px; controls 18px; notes, hints, errors and table heads 16px. No text under 16px. No letter-spacing anywhere.

LAYOUT:
- A 1120px column. Hero: a 432px copy column beside the board. The copy column holds the H1, "Open today 17:00–01:00" with a green square, the lede, the week's hours in two columns with today filled green, two buttons and the address. The board takes the rest and sits whole on the first screen of a 1280x800 laptop. Below 1272px the hero is one column and the board moves up under the lede.
- Then the machines (counts and a floor map on the left, the roster on the right), Thursday's tournament (format and prizes, the sign-up panel, the rounds of the night across the width), tokens and drinks, house rules and a two-part footer.
- Sections 120px apart (88px below 860px), each opened by a 4px frame rule. Below 1060px every section is one column.

COMPONENTS:
- Pixel frame: four 4px offset box-shadows that leave the corners out, so every frame has notched corners. No border-radius anywhere.
- High-score board: a --deep screen with scanlines, a 4px --surface inner frame, a 12px hard offset shadow (8px on phones). A heading, a This week / All time switch (two aria-pressed buttons, 44px tall), then a table with roles of ten rows: initials, score, machine and the day it was set, on dashed rules. The newest row has a 6px yellow bar at its left, the yellow wash and a "New" tag. The switch changes all ten rows and the note under them and is announced in a polite live region. On phones each row becomes two lines and the column heads are kept for screen readers only.
- Week hours: seven rows on dashed rules; today is filled green with aria-current="date".
- Floor map: one tile per machine, 22px squares (pinball 22x40), grouped by room; the room chosen in the roster is lit green, the others dim to --surface with a 2px frame; out-of-order tiles stay red.
- Machine roster: tabs Front room, Back room, Pinball (tab pattern: roving tabindex, arrows, Home and End, one labelled panel), each with its count, the chosen one ink with a 4px green underline; a table with roles: machine, maker and year, token pips (14px orange squares with a 3px bevel) with the number, and tonight's state. On phones each row stacks.
- Tournament sign-up: a --deep panel in a pixel frame. Places left as one orange tile per place in rows of sixteen (taken filled, free outlined) above the form. Initials are three 64x72 slots in Silkscreen: typing moves to the next slot, Backspace goes back, the up and down arrows step through the alphabet, a paste fills all three; a focused slot fills --surface with a yellow underline. Only A to Z is accepted on submit. First name on an underlined field. An orange "Hold my place" button. Errors sit under their field in red with role="alert" and focus moves to the field; a valid sign-up replaces the form with a confirmation that takes focus, and the places drop by one.
- Rounds: time, round and players, and the field drawn as one 14px orange square per player (32, 8, 4, 2), ending in one 30px yellow square for the winner.
- Token bundles drawn as rows of tokens, twenty-five to a row; costs with pips; the drinks board with dotted leaders and right-aligned prices.
- Buttons: a flat face with a 4px darker bevel on the bottom and right, a notched frame; the bevel flips when pressed. 52px tall; every control at least 44px.

MOTION:
- The green square by "Open today" and the "New" tag blink once a second, five times, then stay lit. Nothing else moves. prefers-reduced-motion stops the blinking.

FORBIDDEN:
- Figurative pixel art: characters, sprites, hearts, swords, coins, scenes
- Health bars, XP bars, RPG dialog boxes and other game-interface pastiche that is not the subject's own
- Rounded corners, soft shadows, glows, neon, gradients other than the scanlines and the dashed rules
- Cards in a grid, pills, chips, a small label above a heading, all-caps tracked labels
- Emoji, arrows on links, middle-dot meta strings, numbers on anything that is not a real sequence
- Copy about pixels, nostalgia, 8-bit or the style itself

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML: aria-pressed buttons for the period, the tab pattern for the rooms, tables with explicit roles, ordered lists for the prizes and the rounds, a labelled form
3) A working period switch, room tabs, initials entry with validation, and the sign-up with error and success states
4) Responsive layout down to 320px with no horizontal scroll; board and roster rows stack on phones
5) Visible blue focus on every control, blinking stopped under reduced motion`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_EN, ja: PROMPT_EN };

const LETTER = /^[A-Z]$/;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

type SignupErrors = { initials: 'missing' | 'letters' | null; name: boolean };

function Pips({ count }: { count: number }) {
  return (
    <span className="ic-pips" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => <i key={index} />)}
    </span>
  );
}

function Tiles({ count, className }: { count: number; className?: string }) {
  return (
    <span className={`ic-tiles${className ? ` ${className}` : ''}`} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => <i key={index} />)}
    </span>
  );
}

export function PortedRetroPixelPage({ lang }: PortedStylePageProps) {
  const [period, setPeriod] = useState<Period>('week');
  const [roomId, setRoomId] = useState<RoomId>('front');
  const [initials, setInitials] = useState(['', '', '']);
  const [firstName, setFirstName] = useState('');
  const [errors, setErrors] = useState<SignupErrors>({ initials: null, name: false });
  const [placesLeft, setPlacesLeft] = useState(TOURNAMENT_PLACES - PLACES_TAKEN);
  const [signed, setSigned] = useState<{ ini: string; name: string } | null>(null);
  const [news, setNews] = useState({ text: '', count: 0 });
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const slotRefs = useRef<Array<HTMLInputElement | null>>([]);
  const nameRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const wasSigned = useRef(false);

  const t = (text: Tri) => text[lang];
  const say = (text: string) => setNews((current) => ({ text, count: current.count + 1 }));

  const room = ROOMS.find((item) => item.id === roomId) ?? ROOMS[0];
  const scores = SCORES[period];
  const taken = TOURNAMENT_PLACES - placesLeft;

  // The form and the confirmation replace each other, and the control that had focus leaves
  // the page with them. Focus goes to what took its place: the confirmation, or, after
  // "Sign up another player", the first initials slot.
  useEffect(() => {
    if (signed) doneRef.current?.focus();
    else if (wasSigned.current) slotRefs.current[0]?.focus();
    wasSigned.current = signed !== null;
  }, [signed]);

  const choosePeriod = (next: Period) => {
    if (next === period) return;
    setPeriod(next);
    say(t(next === 'week' ? BOARD.newsWeek : BOARD.newsAll));
  };

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = ROOMS.length - 1;
    const target = { ArrowRight: index === last ? 0 : index + 1, ArrowLeft: index === 0 ? last : index - 1, Home: 0, End: last }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    setRoomId(ROOMS[target].id);
    tabRefs.current[target]?.focus();
  };

  const focusSlot = (index: number) => {
    const slot = slotRefs.current[index];
    if (!slot) return;
    slot.focus();
    slot.select();
  };

  const setLetter = (index: number, letter: string) => {
    setInitials((current) => current.map((value, i) => (i === index ? letter : value)));
    if (errors.initials) setErrors((current) => ({ ...current, initials: null }));
  };

  const onSlotChange = (index: number, value: string) => {
    // The newest character typed wins; a slot holds one.
    const letter = value.slice(-1).toUpperCase();
    setLetter(index, letter);
    if (letter && index < 2) focusSlot(index + 1);
  };

  const onSlotKey = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
    const current = initials[index];
    if (event.key === 'Backspace' && current === '' && index > 0) {
      event.preventDefault();
      setLetter(index - 1, '');
      focusSlot(index - 1);
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      focusSlot(index - 1);
    } else if (event.key === 'ArrowRight' && index < 2) {
      event.preventDefault();
      focusSlot(index + 1);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      // As on a cabinet: up steps forward through the alphabet, down steps back.
      event.preventDefault();
      const at = ALPHABET.indexOf(current);
      const step = event.key === 'ArrowUp' ? 1 : -1;
      const next = at === -1 ? (step === 1 ? 0 : 25) : (at + step + 26) % 26;
      setLetter(index, ALPHABET[next]);
    }
  };

  const onSlotPaste = (event: ClipboardEvent<HTMLInputElement>, index: number) => {
    event.preventDefault();
    const chars = event.clipboardData.getData('text').replace(/\s/g, '').toUpperCase().slice(0, 3 - index).split('');
    if (chars.length === 0) return;
    setInitials((current) => current.map((value, i) => (i >= index && i < index + chars.length ? chars[i - index] : value)));
    if (errors.initials) setErrors((current) => ({ ...current, initials: null }));
    focusSlot(Math.min(index + chars.length, 2));
  };

  const signUp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const missing = initials.some((letter) => letter === '');
    const wrong = initials.some((letter) => letter !== '' && !LETTER.test(letter));
    const next: SignupErrors = { initials: wrong ? 'letters' : missing ? 'missing' : null, name: firstName.trim() === '' };
    if (!next.initials && !next.name) {
      setErrors(next);
      setPlacesLeft((left) => left - 1);
      setSigned({ ini: initials.join(''), name: firstName.trim() });
      return;
    }
    // The error renders first, so the whole field can be brought into view above the page bar.
    flushSync(() => setErrors(next));
    if (next.initials) {
      const bad = initials.findIndex((letter) => !LETTER.test(letter));
      focusSlot(bad === -1 ? 0 : bad);
      document.getElementById('ic-ini-field')?.scrollIntoView({ block: 'nearest' });
    } else {
      nameRef.current?.focus();
      nameRef.current?.parentElement?.scrollIntoView({ block: 'nearest' });
    }
  };

  const another = () => {
    setInitials(['', '', '']);
    setFirstName('');
    setErrors({ initials: null, name: false });
    setSigned(null);
  };

  const iniDescribedBy = ['ic-ini-hint', errors.initials ? 'ic-ini-error' : ''].filter(Boolean).join(' ');

  return (
    <FusionShell
      fusionId="retro-pixel"
      lang={lang}
      tone="dark"
      accent="#a7f070"
      prev={{ href: '/pages/notion-style.html', label: 'Notion Style' }}
      next={{ href: '/pages/y2k-retro.html', label: 'Windows 98' }}
      prompts={PROMPTS}
    >
      <div className="ic">
        <section className="ic-hero" aria-labelledby="ic-title">
          <div className="ic-hero__copy">
            <h1 id="ic-title">{NAME}</h1>
            <p className="ic-open">
              <i className="ic-blink" aria-hidden="true" />
              <span>{t(HERO.open)}</span> <b>{HERO.today}</b>
            </p>
            <p className="ic-lede">{t(HERO.lede)}</p>
            <ul className="ic-week" aria-label={t(HERO.week)}>
              {WEEK.map((day) => (
                <li key={day.id} className={day.id === TODAY ? 'is-today' : undefined} aria-current={day.id === TODAY ? 'date' : undefined}>
                  <b>{t(day.name)}</b>
                  <span>{day.hours ?? t(HERO.closed)}</span>
                </li>
              ))}
            </ul>
            <div className="ic-actions">
              <a className="ic-btn" href="#ic-machines">{t(HERO.machines)}</a>
              <a className="ic-btn ic-btn--line" href="#ic-thursday">{t(HERO.tournament)}</a>
            </div>
            <p className="ic-findus"><b>{ADDRESS}.</b> {t(HERO.findUs)}</p>
          </div>

          <section className="ic-board" aria-labelledby="ic-board-title">
            <div className="ic-board__top">
              <h2 id="ic-board-title">{t(BOARD.title)}</h2>
              <div className="ic-seg" role="group" aria-label={t(BOARD.period)}>
                {(['week', 'all'] as const).map((item) => (
                  <button key={item} type="button" aria-pressed={period === item} onClick={() => choosePeriod(item)}>
                    {t(BOARD[item])}
                  </button>
                ))}
              </div>
            </div>
            <div className="ic-scores" role="table" aria-labelledby="ic-board-title" aria-describedby="ic-board-foot">
              <div role="rowgroup">
                <div className="ic-scores__row ic-scores__row--head" role="row">
                  <span role="columnheader">{t(BOARD.player)}</span>
                  <span className="ic-scores__sc" role="columnheader">{t(BOARD.score)}</span>
                  <span role="columnheader">{t(BOARD.machine)}</span>
                  <span className="ic-scores__day" role="columnheader">{t(BOARD.setOn)}</span>
                </div>
              </div>
              <div role="rowgroup">
                {scores.map((row) => {
                  const digits = String(row.score);
                  return (
                    <div key={`${period}-${row.ini}-${row.machine}`} className={`ic-scores__row${row.isNew ? ' is-new' : ''}`} role="row">
                      <span className="ic-scores__ini" role="cell" data-label={t(BOARD.player)}>{row.ini}</span>
                      <span className="ic-scores__sc" role="cell" data-label={t(BOARD.score)}>
                        <s aria-hidden="true">{'0'.repeat(Math.max(0, SCORE_DIGITS - digits.length))}</s>
                        {digits}
                      </span>
                      <span className="ic-scores__mach" role="cell" data-label={t(BOARD.machine)}>{row.machine}</span>
                      <span className="ic-scores__day" role="cell" data-label={t(BOARD.setOn)}>
                        {row.isNew ? <span className="ic-new ic-blink">{t(BOARD.isNew)}</span> : null}
                        {t(row.when)}
                        {row.isNew ? <span className="ic-sr">{t(BOARD.lastNight)}</span> : null}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <p className="ic-board__foot" id="ic-board-foot">{t(period === 'week' ? BOARD.footWeek : BOARD.footAll)}</p>
          </section>
        </section>

        <section className="ic-section" id="ic-machines" aria-labelledby="ic-machines-title">
          <div className="ic-floorwrap">
            <div className="ic-floorwrap__side">
              <h2 id="ic-machines-title">{t(MACHINES.title)}</h2>
              <p className="ic-intro">{t(MACHINES.intro)}</p>
              <div className="ic-counts">
                <p className="ic-counts__ok"><b>{WORKING_COUNT}</b>{t(MACHINES.working)}</p>
                <p className="ic-counts__out"><b>{OUT_COUNT}</b>{t(MACHINES.out)}</p>
              </div>
              <div className="ic-floor" aria-hidden="true">
                {ROOMS.map((item) => (
                  <div key={item.id} className={`ic-room${item.id === roomId ? ' is-on' : ''}`}>
                    <p>{t(item.name)} <span>{item.machines.length}</span></p>
                    <span className={`ic-tiles ic-tiles--${item.id}`}>
                      {item.machines.map((machine) => <i key={machine.name} className={machine.out ? 'is-out' : undefined} />)}
                    </span>
                  </div>
                ))}
              </div>
              <p className="ic-note">{t(MACHINES.foot)}</p>
            </div>

            <div className="ic-roster">
              <div className="ic-tabs" role="tablist" aria-label={t(MACHINES.rooms)}>
                {ROOMS.map((item, index) => (
                  <button
                    key={item.id}
                    ref={(node) => {
                      tabRefs.current[index] = node;
                    }}
                    id={`ic-tab-${item.id}`}
                    type="button"
                    role="tab"
                    aria-selected={item.id === roomId}
                    aria-controls="ic-room-panel"
                    tabIndex={item.id === roomId ? 0 : -1}
                    onClick={() => setRoomId(item.id)}
                    onKeyDown={(event) => onTabKey(event, index)}
                  >
                    {t(item.name)} <span>{item.machines.length}</span>
                  </button>
                ))}
              </div>
              <div className="ic-panel" role="tabpanel" id="ic-room-panel" aria-labelledby={`ic-tab-${room.id}`} tabIndex={0}>
                <div className="ic-machines" role="table" aria-label={fill(t(MACHINES.list), { room: t(room.name) })}>
                  <div role="rowgroup">
                    <div className="ic-machines__row ic-machines__row--head" role="row">
                      <span role="columnheader">{t(MACHINES.machine)}</span>
                      <span role="columnheader">{t(MACHINES.made)}</span>
                      <span role="columnheader">{t(MACHINES.tokens)}</span>
                      <span role="columnheader">{t(MACHINES.tonight)}</span>
                    </div>
                  </div>
                  <div role="rowgroup">
                    {room.machines.map((machine) => (
                      <div key={machine.name} className={`ic-machines__row${machine.out ? ' is-out' : ''}`} role="row">
                        <span className="ic-machines__name" role="rowheader" data-label={t(MACHINES.machine)}>{machine.name}</span>
                        <span className="ic-machines__made" role="cell" data-label={t(MACHINES.made)}>{machine.maker}, {machine.year}</span>
                        <span className="ic-machines__tokens" role="cell" data-label={t(MACHINES.tokens)}>
                          <Pips count={machine.tokens} />
                          {machine.tokens}
                        </span>
                        <span className="ic-machines__state" role="cell" data-label={t(MACHINES.tonight)}>
                          <span className={`ic-state${machine.out ? ' ic-state--out' : ''}`}>{t(machine.out ? MACHINES.isOut : MACHINES.isWorking)}</span>
                          {machine.out ? <small>{t(machine.out)}</small> : null}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ic-section" id="ic-thursday" aria-labelledby="ic-thursday-title">
          <div className="ic-tour">
            <div className="ic-tour__about">
              <h2 id="ic-thursday-title">{t(TOUR.title)}</h2>
              <p className="ic-when"><b>{t(TOUR.date)}</b> <span>{t(TOUR.where)}</span></p>
              <p className="ic-intro">{t(TOUR.format)}</p>
              <p className="ic-intro">{t(TOUR.entry)}</p>
              <ol className="ic-prizes" aria-label={t(TOUR.prizes)}>
                {PRIZES.map((item) => (
                  <li key={item.place} className="ic-prize">
                    <b>{item.place}</b>
                    <span>{t(item.prize)}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="ic-signup ic-px">
              <h3 id="ic-signup-title">{t(SIGNUP.title)}</h3>
              <p className="ic-signup__note">{t(SIGNUP.note)}</p>
              <div className="ic-places">
                <p>
                  <b>{placesLeft === 1 ? t(SIGNUP.oneLeft) : fill(t(SIGNUP.left), { n: placesLeft })}</b> {fill(t(SIGNUP.of), { total: TOURNAMENT_PLACES })}
                </p>
                <span className="ic-tiles ic-tiles--places" aria-hidden="true">
                  {Array.from({ length: TOURNAMENT_PLACES }, (_, index) => <i key={index} className={index < taken ? undefined : 'is-free'} />)}
                </span>
              </div>

              {signed ? (
                <div className="ic-done" ref={doneRef} tabIndex={-1}>
                  <p className="ic-done__title">{fill(t(SIGNUP.doneTitle), { ini: signed.ini })}</p>
                  <p className="ic-done__body">{fill(t(SIGNUP.doneBody), { name: signed.name })}</p>
                  {placesLeft > 0 ? (
                    <button className="ic-btn ic-btn--line" type="button" onClick={another}>{t(SIGNUP.another)}</button>
                  ) : (
                    <p className="ic-done__full">{t(SIGNUP.full)}</p>
                  )}
                </div>
              ) : (
                <form className="ic-form" aria-labelledby="ic-signup-title" noValidate onSubmit={signUp}>
                  <div className={`ic-field${errors.initials ? ' is-invalid' : ''}`} id="ic-ini-field">
                    <span className="ic-field__label" id="ic-ini-label">{t(SIGNUP.initials)}</span>
                    <span className="ic-field__hint" id="ic-ini-hint">{t(SIGNUP.hint)}</span>
                    <div className="ic-initials" role="group" aria-labelledby="ic-ini-label">
                      {initials.map((letter, index) => (
                        <input
                          key={index}
                          ref={(node) => {
                            slotRefs.current[index] = node;
                          }}
                          className="ic-slot"
                          type="text"
                          inputMode="text"
                          autoComplete="off"
                          autoCapitalize="characters"
                          spellCheck={false}
                          value={letter}
                          aria-label={t(SIGNUP.letters[index])}
                          aria-describedby={iniDescribedBy}
                          aria-invalid={errors.initials && !LETTER.test(letter) ? true : undefined}
                          onFocus={(event) => event.currentTarget.select()}
                          onChange={(event) => onSlotChange(index, event.target.value)}
                          onKeyDown={(event) => onSlotKey(event, index)}
                          onPaste={(event) => onSlotPaste(event, index)}
                        />
                      ))}
                    </div>
                    {errors.initials ? (
                      <p className="ic-field__error" id="ic-ini-error" role="alert">
                        {t(errors.initials === 'letters' ? SIGNUP.notLetters : SIGNUP.missing)}
                      </p>
                    ) : null}
                  </div>
                  <div className={`ic-field${errors.name ? ' is-invalid' : ''}`}>
                    <label className="ic-field__label" htmlFor="ic-name">{t(SIGNUP.name)}</label>
                    <input
                      id="ic-name"
                      ref={nameRef}
                      className="ic-input"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={firstName}
                      aria-invalid={errors.name || undefined}
                      aria-describedby={errors.name ? 'ic-name-error' : undefined}
                      onChange={(event) => {
                        setFirstName(event.target.value);
                        if (errors.name) setErrors((current) => ({ ...current, name: false }));
                      }}
                    />
                    {errors.name ? <p className="ic-field__error" id="ic-name-error" role="alert">{t(SIGNUP.nameError)}</p> : null}
                  </div>
                  <button className="ic-btn ic-btn--orange" type="submit">{t(SIGNUP.submit)}</button>
                  <p className="ic-signup__after">{t(SIGNUP.after)}</p>
                </form>
              )}
            </div>

            <div className="ic-night">
              <h3>{t(NIGHT.title)}</h3>
              <p className="ic-night__note">{t(NIGHT.note)}</p>
              <ol className="ic-rounds">
                {ROUNDS.map((round) => (
                  <li key={round.time} className="ic-round">
                    <time>{round.time}</time>
                    <div>
                      <b>{t(round.name)}</b>
                      <span>{t(round.detail)}</span>
                    </div>
                    <Tiles count={round.field} className={round.win ? 'ic-tiles--win' : 'ic-tiles--field'} />
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="ic-section" id="ic-prices" aria-labelledby="ic-prices-title">
          <h2 id="ic-prices-title">{t(PRICES.title)}</h2>
          <p className="ic-intro">{t(PRICES.intro)}</p>
          <div className="ic-prices">
            <div className="ic-tokens">
              <h3>{t(PRICES.tokens)}</h3>
              <ul className="ic-bundles">
                {BUNDLES.map((bundle) => (
                  <li key={bundle.price} className="ic-bundle">
                    <p><b>{bundle.price}</b> <span>{fill(t(PRICES.count), { n: bundle.tokens })}</span></p>
                    <Tiles count={bundle.tokens} className="ic-tiles--tokens" />
                  </li>
                ))}
              </ul>
              <ul className="ic-costs" aria-label={t(PRICES.costs)}>
                {COSTS.map((cost) => (
                  <li key={cost.tokens}>
                    <span>{t(cost.what)}</span>
                    <span className="ic-costs__n">
                      {cost.tokens === 1 ? t(PRICES.one) : fill(t(PRICES.count), { n: cost.tokens })}
                      <Pips count={cost.tokens} />
                    </span>
                  </li>
                ))}
              </ul>
              <p className="ic-note">{t(PRICES.happy)}</p>
            </div>

            <div className="ic-drinks ic-px">
              <h3 id="ic-drinks-title">{t(PRICES.bar)}</h3>
              {DRINKS.map((group) => (
                <section key={group.id} className="ic-drinks__group" aria-labelledby={`ic-drinks-${group.id}`}>
                  <h4 id={`ic-drinks-${group.id}`}>{t(group.title)}</h4>
                  <ul className="ic-menu">
                    {group.items.map((item) => (
                      <li key={item.name.en}>
                        <span>{t(item.name)}{item.abv ? <small>{item.abv}</small> : null}</span>
                        <b>{item.price}</b>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section className="ic-section" id="ic-rules" aria-labelledby="ic-rules-title">
          <div className="ic-rules-wrap">
            <h2 id="ic-rules-title">{t(RULES_TITLE)}</h2>
            <ul className="ic-rules">
              {RULES.map((item) => (
                <li key={item.rule.en}>
                  <b>{t(item.rule)}</b>
                  <span>{t(item.why)}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <footer className="ic-foot">
          <p><b>{NAME}</b>, {ADDRESS}<br />{PHONE}. {t(FOOT.entrance)}</p>
          <p>{t(FOOT.midweek)}<br />{t(FOOT.weekend)}<br />{t(FOOT.sunday)}</p>
        </footer>

        <p className="ic-sr" role="status">{news.text}{news.count % 2 ? ' ' : ''}</p>
      </div>
    </FusionShell>
  );
}
