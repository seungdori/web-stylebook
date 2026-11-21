import { Fragment, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedKineticPopPage.css';

// The page of the Fizz Lab pop-up, a soda brewery's two-week tasting bar on Calvert Avenue
// in Shoreditch, in the Kinetic Pop style. Bowlby One shouts (the hero words, pour numbers,
// dates, prices, counts) and Work Sans reads. Components come from the pop-up itself: the
// hero card with a starburst for the free tasting, a flavour ticker, a tasting flight of six
// die-cut shapes in pour order, a two-week opening strip with a speech bubble for the chosen
// day, a crate of twelve to fill, a merch price list with round price stickers and sold-out
// stamps, a pick-up list, and a street map drawn in thick lines.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key]));

const ADDRESS = '22 Calvert Avenue';
const POSTCODE = 'London E2 7JP';
const CRATE_SIZE = 12;
const CRATE_PRICE = 26;
const MAPS_URL = 'https://www.openstreetmap.org/search?query=22%20Calvert%20Avenue%2C%20London%20E2%207JP';

type Shape = 'diamond' | 'circle' | 'triangle' | 'square' | 'arch' | 'star';

const STAR = '50.0,5.0 62.9,35.2 95.7,38.2 70.9,59.8 78.2,91.8 50.0,75.0 21.8,91.8 29.1,59.8 4.3,38.2 37.1,35.2';
const BURST =
  '50.0,2.0 58.7,12.0 70.8,6.8 74.3,19.5 87.5,20.1 85.1,33.1 96.8,39.3 89.0,50.0 96.8,60.7 85.1,66.9 87.5,79.9 74.3,80.5 70.8,93.2 58.7,88.0 50.0,98.0 41.3,88.0 29.2,93.2 25.7,80.5 12.5,79.9 14.9,66.9 3.2,60.7 11.0,50.0 3.2,39.3 14.9,33.1 12.5,20.1 25.7,19.5 29.2,6.8 41.3,12.0';

// One die-cut shape on a 100 x 100 box.
function ShapePath({ shape }: { shape: Shape }) {
  switch (shape) {
    case 'diamond':
      return <polygon points="50,3 97,50 50,97 3,50" />;
    case 'circle':
      return <circle cx="50" cy="50" r="47" />;
    case 'triangle':
      return <polygon points="50,5 97,93 3,93" />;
    case 'square':
      return <rect x="4" y="4" width="92" height="92" rx="9" />;
    case 'arch':
      return <path d="M7,96 V48 A43,43 0 0 1 93,48 V96 Z" />;
    case 'star':
      return <polygon points={STAR} />;
  }
}

const HEAD = {
  nav: { en: 'Pop-up', ko: 'Pop-up', ja: 'Pop-up' },
  flavours: { en: 'Flavours', ko: 'Flavours', ja: 'Flavours' },
  dates: { en: 'Dates', ko: 'Dates', ja: 'Dates' },
  crates: { en: 'Crates', ko: 'Crates', ja: 'Crates' },
  merch: { en: 'Merch', ko: 'Merch', ja: 'Merch' },
  go: { en: 'Getting there', ko: 'Getting there', ja: 'Getting there' },
  pickUp: { en: 'Pick-up', ko: 'Pick-up', ja: 'Pick-up' },
  listWord: { en: 'list', ko: 'list', ja: 'list' },
} satisfies Record<string, Tri>;

const HERO = {
  words: [
    { en: 'Fizz', ko: 'Fizz', ja: 'Fizz' },
    { en: 'Lab', ko: 'Lab', ja: 'Lab' },
    { en: 'Pop-up', ko: 'Pop-up', ja: 'Pop-up' },
  ] as Tri[],
  when: { en: '13–26 Nov', ko: '13–26 Nov', ja: '13–26 Nov' },
  whenSpoken: { en: '13 to 26 November', ko: '13 to 26 November', ja: '13 to 26 November' },
  lede: {
    en: 'Six sodas from our Hackney Wick brewery, poured free at a bar on Calvert Avenue for two weeks. Walk in, taste all six, and carry a crate home.',
    ko: 'Six sodas from our Hackney Wick brewery, poured free at a bar on Calvert Avenue for two weeks. Walk in, taste all six, and carry a crate home.',
    ja: 'Six sodas from our Hackney Wick brewery, poured free at a bar on Calvert Avenue for two weeks. Walk in, taste all six, and carry a crate home.',
  },
  directions: { en: 'Get directions', ko: 'Get directions', ja: 'Get directions' },
  where: { en: '22 Calvert Avenue, Shoreditch', ko: '22 Calvert Avenue, Shoreditch', ja: '22 Calvert Avenue, Shoreditch' },
  open: { en: 'Open today until 23:00', ko: 'Open today until 23:00', ja: 'Open today until 23:00' },
  free: { en: 'Free', ko: 'Free', ja: 'Free' },
  tasting: { en: 'tasting', ko: 'tasting', ja: 'tasting' },
  pours: { en: 'Six pours, no ticket needed', ko: 'Six pours, no ticket needed', ja: 'Six pours, no ticket needed' },
} as const;

const TICKER = {
  free: { en: 'Free tasting', ko: 'Free tasting', ja: 'Free tasting' },
  pause: { en: 'Pause', ko: 'Pause', ja: 'Pause' },
  play: { en: 'Play', ko: 'Play', ja: 'Play' },
  what: { en: 'the flavour ticker', ko: 'the flavour ticker', ja: 'the flavour ticker' },
} satisfies Record<string, Tri>;

type FlavourId = 'mint' | 'yuzu' | 'grapefruit' | 'blue' | 'rhubarb' | 'cola';

interface Flavour {
  id: FlavourId;
  name: string;
  text: Tri;
  sugar: string;
  fizz: number;
  /** The shape's fill, a page colour. */
  fill: string;
  /** The colour of the pour number drawn on it. */
  numberColor: string;
  shape: Shape;
  size: number;
  rotate: number;
  /** Lowers the number into the body of a shape whose weight sits low. */
  numberDrop: string;
}

const FLAVOURS: Flavour[] = [
  {
    id: 'mint',
    name: 'Glacier Mint',
    text: {
      en: 'Spearmint and cucumber water, barely sweet. Poured at 2 °C, so it tastes colder than the rest.',
      ko: 'Spearmint and cucumber water, barely sweet. Poured at 2 °C, so it tastes colder than the rest.',
      ja: 'Spearmint and cucumber water, barely sweet. Poured at 2 °C, so it tastes colder than the rest.',
    },
    sugar: '2.4',
    fizz: 3,
    fill: 'var(--fz-sky)',
    numberColor: '#ffffff',
    shape: 'diamond',
    size: 150,
    rotate: 4,
    numberDrop: '0%',
  },
  {
    id: 'yuzu',
    name: 'Yuzu Sherbet',
    text: {
      en: 'Yuzu peel and lemon sherbet. Sharp on the first sip, then very dry, with a fizz that prickles.',
      ko: 'Yuzu peel and lemon sherbet. Sharp on the first sip, then very dry, with a fizz that prickles.',
      ja: 'Yuzu peel and lemon sherbet. Sharp on the first sip, then very dry, with a fizz that prickles.',
    },
    sugar: '3.2',
    fizz: 4,
    fill: 'var(--fz-yellow)',
    numberColor: '#ffffff',
    shape: 'circle',
    size: 136,
    rotate: -6,
    numberDrop: '0%',
  },
  {
    id: 'grapefruit',
    name: 'Grapefruit & Sea Salt',
    text: {
      en: 'Pink grapefruit with the bitter pith left in and a pinch of Essex sea salt. The most bubbles of the six.',
      ko: 'Pink grapefruit with the bitter pith left in and a pinch of Essex sea salt. The most bubbles of the six.',
      ja: 'Pink grapefruit with the bitter pith left in and a pinch of Essex sea salt. The most bubbles of the six.',
    },
    sugar: '4.1',
    fizz: 5,
    fill: 'var(--fz-pink)',
    numberColor: '#ffffff',
    shape: 'triangle',
    size: 160,
    rotate: 7,
    numberDrop: '16%',
  },
  {
    id: 'blue',
    name: 'Blue Hour',
    text: {
      en: 'Butterfly pea flower and lime. It pours blue and turns violet when the bar squeezes in the lime.',
      ko: 'Butterfly pea flower and lime. It pours blue and turns violet when the bar squeezes in the lime.',
      ja: 'Butterfly pea flower and lime. It pours blue and turns violet when the bar squeezes in the lime.',
    },
    sugar: '4.6',
    fizz: 3,
    fill: 'var(--fz-blue)',
    numberColor: '#ffffff',
    shape: 'square',
    size: 140,
    rotate: -4,
    numberDrop: '0%',
  },
  {
    id: 'rhubarb',
    name: 'Rhubarb Custard',
    text: {
      en: 'Yorkshire forced rhubarb with vanilla. Soft bubbles and a creamy finish, like the boiled sweet.',
      ko: 'Yorkshire forced rhubarb with vanilla. Soft bubbles and a creamy finish, like the boiled sweet.',
      ja: 'Yorkshire forced rhubarb with vanilla. Soft bubbles and a creamy finish, like the boiled sweet.',
    },
    sugar: '5.9',
    fizz: 2,
    fill: 'var(--fz-blush)',
    numberColor: '#ffffff',
    shape: 'arch',
    size: 146,
    rotate: 5,
    numberDrop: '10%',
  },
  {
    id: 'cola',
    name: 'Cherry Cola',
    text: {
      en: 'Black cherry, cassia and vanilla over a proper cola bite. The only one with caffeine: 18 mg a can.',
      ko: 'Black cherry, cassia and vanilla over a proper cola bite. The only one with caffeine: 18 mg a can.',
      ja: 'Black cherry, cassia and vanilla over a proper cola bite. The only one with caffeine: 18 mg a can.',
    },
    sugar: '6.4',
    fizz: 4,
    fill: 'var(--fz-ink)',
    numberColor: 'var(--fz-yellow)',
    shape: 'star',
    size: 164,
    rotate: -8,
    numberDrop: '7%',
  },
];

const FLIGHT = {
  title: { en: 'Six flavours, {mark} to taste', ko: 'Six flavours, {mark} to taste', ja: 'Six flavours, {mark} to taste' },
  mark: { en: 'free', ko: 'free', ja: 'free' },
  note: {
    en: 'Ask at the bar for a flight: six 60 ml pours, driest first. Cans are £2.50 each to take away, or £26 for a crate of twelve.',
    ko: 'Ask at the bar for a flight: six 60 ml pours, driest first. Cans are £2.50 each to take away, or £26 for a crate of twelve.',
    ja: 'Ask at the bar for a flight: six 60 ml pours, driest first. Cans are £2.50 each to take away, or £26 for a crate of twelve.',
  },
  sugar: { en: 'Sugar', ko: 'Sugar', ja: 'Sugar' },
  sugarValue: { en: '{n} g per 100 ml', ko: '{n} g per 100 ml', ja: '{n} g per 100 ml' },
  fizz: { en: 'Fizz', ko: 'Fizz', ja: 'Fizz' },
  fizzValue: { en: '{n} of 5', ko: '{n} of 5', ja: '{n} of 5' },
} satisfies Record<string, Tri>;

// Puts one node into a sentence in place of {key}.
const place = (text: string, key: string, node: ReactNode): ReactNode[] =>
  text.split(`{${key}}`).flatMap((part, index) => (index === 0 ? [part] : [<Fragment key={index}>{node}</Fragment>, part]));

type DayKind = 'week' | 'late' | 'sun' | 'shut';

interface Day {
  date: string;
  n: number;
  short: Tri;
  long: Tri;
  kind: DayKind;
  open?: string;
  close?: string;
  /** Something on that night; the bar stays open later. */
  star?: Tri;
  past?: boolean;
  today?: boolean;
  events: Array<{ time: string; text: Tri }>;
}

const WD = {
  fri: { short: { en: 'Fri', ko: 'Fri', ja: 'Fri' }, long: { en: 'Friday', ko: 'Friday', ja: 'Friday' } },
  sat: { short: { en: 'Sat', ko: 'Sat', ja: 'Sat' }, long: { en: 'Saturday', ko: 'Saturday', ja: 'Saturday' } },
  sun: { short: { en: 'Sun', ko: 'Sun', ja: 'Sun' }, long: { en: 'Sunday', ko: 'Sunday', ja: 'Sunday' } },
  mon: { short: { en: 'Mon', ko: 'Mon', ja: 'Mon' }, long: { en: 'Monday', ko: 'Monday', ja: 'Monday' } },
  tue: { short: { en: 'Tue', ko: 'Tue', ja: 'Tue' }, long: { en: 'Tuesday', ko: 'Tuesday', ja: 'Tuesday' } },
  wed: { short: { en: 'Wed', ko: 'Wed', ja: 'Wed' }, long: { en: 'Wednesday', ko: 'Wednesday', ja: 'Wednesday' } },
  thu: { short: { en: 'Thu', ko: 'Thu', ja: 'Thu' }, long: { en: 'Thursday', ko: 'Thursday', ja: 'Thursday' } },
};

const OPENS = { en: 'Tasting bar opens.', ko: 'Tasting bar opens.', ja: 'Tasting bar opens.' };
const POUR_YOUR_OWN = {
  en: 'Pour your own: children mix a soda from three syrups, free.',
  ko: 'Pour your own: children mix a soda from three syrups, free.',
  ja: 'Pour your own: children mix a soda from three syrups, free.',
};
const AFTER_WORK = { en: 'After-work flight with salted crisps, £3.', ko: 'After-work flight with salted crisps, £3.', ja: 'After-work flight with salted crisps, £3.' };
const SYRUP_LAB = {
  en: 'Syrup lab with our brewer Dami Okafor: why Blue Hour turns violet.',
  ko: 'Syrup lab with our brewer Dami Okafor: why Blue Hour turns violet.',
  ja: 'Syrup lab with our brewer Dami Okafor: why Blue Hour turns violet.',
};

const DAYS: Day[] = [
  {
    date: '2026-11-13', n: 13, ...WD.fri, kind: 'late', open: '11:00', close: '23:00', past: true,
    star: { en: 'opening night', ko: 'opening night', ja: 'opening night' },
    events: [
      { time: '11:00', text: { en: 'Doors open for the first pour.', ko: 'Doors open for the first pour.', ja: 'Doors open for the first pour.' } },
      {
        time: '18:00',
        text: {
          en: 'Opening night: our brewers pour all six and say how each is made.',
          ko: 'Opening night: our brewers pour all six and say how each is made.',
          ja: 'Opening night: our brewers pour all six and say how each is made.',
        },
      },
      { time: '21:00', text: { en: 'Records from Sol Ferreira until close.', ko: 'Records from Sol Ferreira until close.', ja: 'Records from Sol Ferreira until close.' } },
    ],
  },
  {
    date: '2026-11-14', n: 14, ...WD.sat, kind: 'late', open: '11:00', close: '22:00', past: true,
    events: [
      { time: '11:00', text: OPENS },
      {
        time: '14:00',
        text: {
          en: 'The risograph poster is printed in the window, one colour an hour.',
          ko: 'The risograph poster is printed in the window, one colour an hour.',
          ja: 'The risograph poster is printed in the window, one colour an hour.',
        },
      },
    ],
  },
  { date: '2026-11-15', n: 15, ...WD.sun, kind: 'sun', open: '11:00', close: '18:00', past: true, events: [{ time: '11:00', text: OPENS }, { time: '13:00', text: POUR_YOUR_OWN }] },
  { date: '2026-11-16', n: 16, ...WD.mon, kind: 'shut', past: true, events: [] },
  { date: '2026-11-17', n: 17, ...WD.tue, kind: 'week', open: '12:00', close: '20:00', past: true, events: [{ time: '12:00', text: OPENS }, { time: '17:30', text: AFTER_WORK }] },
  { date: '2026-11-18', n: 18, ...WD.wed, kind: 'week', open: '12:00', close: '20:00', past: true, events: [{ time: '12:00', text: OPENS }, { time: '18:00', text: SYRUP_LAB }] },
  {
    date: '2026-11-19', n: 19, ...WD.thu, kind: 'week', open: '12:00', close: '20:00', past: true,
    events: [
      { time: '12:00', text: OPENS },
      { time: '19:00', text: { en: 'Quiz at the bar. The winning table takes a crate home.', ko: 'Quiz at the bar. The winning table takes a crate home.', ja: 'Quiz at the bar. The winning table takes a crate home.' } },
    ],
  },
  {
    date: '2026-11-20', n: 20, ...WD.fri, kind: 'late', open: '11:00', close: '22:00', past: true,
    events: [
      { time: '11:00', text: OPENS },
      { time: '18:00', text: { en: 'The printers sign the risograph posters.', ko: 'The printers sign the risograph posters.', ja: 'The printers sign the risograph posters.' } },
    ],
  },
  {
    date: '2026-11-21', n: 21, ...WD.sat, kind: 'late', open: '11:00', close: '23:00', today: true,
    star: { en: 'float night', ko: 'float night', ja: 'float night' },
    events: [
      { time: '11:00', text: { en: 'Tasting bar opens. Quietest before 14:00.', ko: 'Tasting bar opens. Quietest before 14:00.', ja: 'Tasting bar opens. Quietest before 14:00.' } },
      {
        time: '18:00',
        text: {
          en: 'Float night: Cherry Cola over soft serve from Lick, £4.50.',
          ko: 'Float night: Cherry Cola over soft serve from Lick, £4.50.',
          ja: 'Float night: Cherry Cola over soft serve from Lick, £4.50.',
        },
      },
      { time: '20:00', text: { en: 'Records from Anna Kiyoshi until close.', ko: 'Records from Anna Kiyoshi until close.', ja: 'Records from Anna Kiyoshi until close.' } },
    ],
  },
  { date: '2026-11-22', n: 22, ...WD.sun, kind: 'sun', open: '11:00', close: '18:00', events: [{ time: '11:00', text: OPENS }, { time: '13:00', text: POUR_YOUR_OWN }] },
  { date: '2026-11-23', n: 23, ...WD.mon, kind: 'shut', events: [] },
  {
    date: '2026-11-24', n: 24, ...WD.tue, kind: 'week', open: '12:00', close: '20:00',
    events: [
      { time: '12:00', text: { en: 'Tasting bar opens. Forty more bucket hats are in.', ko: 'Tasting bar opens. Forty more bucket hats are in.', ja: 'Tasting bar opens. Forty more bucket hats are in.' } },
      { time: '17:30', text: AFTER_WORK },
    ],
  },
  { date: '2026-11-25', n: 25, ...WD.wed, kind: 'week', open: '12:00', close: '20:00', events: [{ time: '12:00', text: OPENS }, { time: '18:00', text: SYRUP_LAB }] },
  {
    date: '2026-11-26', n: 26, ...WD.thu, kind: 'week', open: '12:00', close: '21:00',
    star: { en: 'last day', ko: 'last day', ja: 'last day' },
    events: [
      { time: '12:00', text: { en: 'Tasting bar opens for the last time.', ko: 'Tasting bar opens for the last time.', ja: 'Tasting bar opens for the last time.' } },
      {
        time: '18:00',
        text: {
          en: 'Last night: every can left is £1.50 until we close at 21:00.',
          ko: 'Last night: every can left is £1.50 until we close at 21:00.',
          ja: 'Last night: every can left is £1.50 until we close at 21:00.',
        },
      },
    ],
  },
];

const TODAY = DAYS.findIndex((day) => day.today);

const DATES = {
  title: { en: 'Open until Thursday 26 November', ko: 'Open until Thursday 26 November', ja: 'Open until Thursday 26 November' },
  note: {
    en: 'Free tasting all day, every day we are open. Fridays and Saturdays stay open late, and on Mondays we close to restock. Choose a day to see its hours and what is on.',
    ko: 'Free tasting all day, every day we are open. Fridays and Saturdays stay open late, and on Mondays we close to restock. Choose a day to see its hours and what is on.',
    ja: 'Free tasting all day, every day we are open. Fridays and Saturdays stay open late, and on Mondays we close to restock. Choose a day to see its hours and what is on.',
  },
  legend: { en: 'Opening days, 13 to 26 November', ko: 'Opening days, 13 to 26 November', ja: 'Opening days, 13 to 26 November' },
  today: { en: 'Today', ko: 'Today', ja: 'Today' },
  month: { en: 'November', ko: 'November', ja: 'November' },
  closed: { en: 'Closed', ko: 'Closed', ja: 'Closed' },
  dayTitle: { en: '{day} {n} November', ko: '{day} {n} November', ja: '{day} {n} November' },
  hoursToday: { en: 'Today, {open} to {close}', ko: 'Today, {open} to {close}', ja: 'Today, {open} to {close}' },
  hoursPast: { en: 'Was open {open} to {close}', ko: 'Was open {open} to {close}', ja: 'Was open {open} to {close}' },
  hoursNext: { en: 'Open {open} to {close}', ko: 'Open {open} to {close}', ja: 'Open {open} to {close}' },
  shutNote: {
    en: 'We close on Mondays to restock the fridges and wash the glasses. Back on Tuesday at 12:00.',
    ko: 'We close on Mondays to restock the fridges and wash the glasses. Back on Tuesday at 12:00.',
    ja: 'We close on Mondays to restock the fridges and wash the glasses. Back on Tuesday at 12:00.',
  },
  keyLabel: { en: 'Opening hours', ko: 'Opening hours', ja: 'Opening hours' },
} satisfies Record<string, Tri>;

const KEY: Array<{ swatch: 'week' | 'late' | 'sun' | 'shut' | 'star'; name: Tri; hours: Tri }> = [
  { swatch: 'week', name: { en: 'Tuesday to Thursday', ko: 'Tuesday to Thursday', ja: 'Tuesday to Thursday' }, hours: { en: '12:00–20:00', ko: '12:00–20:00', ja: '12:00–20:00' } },
  { swatch: 'late', name: { en: 'Friday and Saturday', ko: 'Friday and Saturday', ja: 'Friday and Saturday' }, hours: { en: '11:00–22:00', ko: '11:00–22:00', ja: '11:00–22:00' } },
  { swatch: 'sun', name: { en: 'Sunday', ko: 'Sunday', ja: 'Sunday' }, hours: { en: '11:00–18:00', ko: '11:00–18:00', ja: '11:00–18:00' } },
  { swatch: 'shut', name: { en: 'Monday', ko: 'Monday', ja: 'Monday' }, hours: { en: 'Closed', ko: 'Closed', ja: 'Closed' } },
  { swatch: 'star', name: { en: 'Something on that night', ko: 'Something on that night', ja: 'Something on that night' }, hours: { en: 'Open later', ko: 'Open later', ja: 'Open later' } },
];

const CRATE = {
  title: { en: 'Fill a {mark} of twelve', ko: 'Fill a {mark} of twelve', ja: 'Fill a {mark} of twelve' },
  mark: { en: 'crate', ko: 'crate', ja: 'crate' },
  note: {
    en: 'Any mix of the six, twelve cans for £26. Put it aside here and pay at the till when you pick it up. We keep it behind the bar for two days.',
    ko: 'Any mix of the six, twelve cans for £26. Put it aside here and pay at the till when you pick it up. We keep it behind the bar for two days.',
    ja: 'Any mix of the six, twelve cans for £26. Put it aside here and pay at the till when you pick it up. We keep it behind the bar for two days.',
  },
  picture: { en: 'A crate with {n} of 12 cans', ko: 'A crate with {n} of 12 cans', ja: 'A crate with {n} of 12 cans' },
  of: { en: 'of 12', ko: 'of 12', ja: 'of 12' },
  cans: { en: 'cans in the crate', ko: 'cans in the crate', ja: 'cans in the crate' },
  more: { en: 'Pick {n} more to fill it.', ko: 'Pick {n} more to fill it.', ja: 'Pick {n} more to fill it.' },
  full: { en: 'Full. Twelve cans for £26.', ko: 'Full. Twelve cans for £26.', ja: 'Full. Twelve cans for £26.' },
  less: { en: 'One fewer {name}', ko: 'One fewer {name}', ja: 'One fewer {name}' },
  plus: { en: 'One more {name}', ko: 'One more {name}', ja: 'One more {name}' },
  flavours: { en: 'Cans by flavour', ko: 'Cans by flavour', ja: 'Cans by flavour' },
  twoEach: { en: 'Two of each', ko: 'Two of each', ja: 'Two of each' },
  empty: { en: 'Empty the crate', ko: 'Empty the crate', ja: 'Empty the crate' },
  put: { en: 'Put the crate aside', ko: 'Put the crate aside', ja: 'Put the crate aside' },
  newsCount: { en: '{name} {n}. {total} of 12 cans.', ko: '{name} {n}. {total} of 12 cans.', ja: '{name} {n}. {total} of 12 cans.' },
  newsFull: { en: '{name} {n}. The crate is full.', ko: '{name} {n}. The crate is full.', ja: '{name} {n}. The crate is full.' },
  newsBlocked: {
    en: 'The crate is full. Take a can out to swap it for another.',
    ko: 'The crate is full. Take a can out to swap it for another.',
    ja: 'The crate is full. Take a can out to swap it for another.',
  },
  newsNone: { en: 'There is no {name} in the crate.', ko: 'There is no {name} in the crate.', ja: 'There is no {name} in the crate.' },
  newsTwoEach: { en: 'Two of each flavour. The crate is full.', ko: 'Two of each flavour. The crate is full.', ja: 'Two of each flavour. The crate is full.' },
  newsEmpty: { en: 'The crate is empty.', ko: 'The crate is empty.', ja: 'The crate is empty.' },
  newsNotFull: { en: 'Pick {n} more cans before you put the crate aside.', ko: 'Pick {n} more cans before you put the crate aside.', ja: 'Pick {n} more cans before you put the crate aside.' },
  doneTitle: { en: 'Crate {no} is behind the till', ko: 'Crate {no} is behind the till', ja: 'Crate {no} is behind the till' },
  doneNote: {
    en: 'Give the bar the number and pay £26 when you collect it. We keep it for two days.',
    ko: 'Give the bar the number and pay £26 when you collect it. We keep it for two days.',
    ja: 'Give the bar the number and pay £26 when you collect it. We keep it for two days.',
  },
  another: { en: 'Fill another crate', ko: 'Fill another crate', ja: 'Fill another crate' },
} satisfies Record<string, Tri>;

type Counts = Record<FlavourId, number>;

const EMPTY: Counts = { mint: 0, yuzu: 0, grapefruit: 0, blue: 0, rhubarb: 0, cola: 0 };
const TWO_EACH: Counts = { mint: 2, yuzu: 2, grapefruit: 2, blue: 2, rhubarb: 2, cola: 2 };
const START: Counts = { mint: 2, yuzu: 2, grapefruit: 1, blue: 2, rhubarb: 0, cola: 1 };

const totalOf = (counts: Counts) => FLAVOURS.reduce((sum, flavour) => sum + counts[flavour.id], 0);
const mixOf = (counts: Counts) =>
  FLAVOURS.filter((flavour) => counts[flavour.id] > 0)
    .map((flavour) => `${counts[flavour.id]} ${flavour.name}`)
    .join(', ');

interface MerchItem {
  id: string;
  name: Tri;
  text: Tri;
  price: number;
  sticker: string;
  stickerText?: string;
  rotate: number;
  /** Sold out: cannot be put aside. */
  soldOut?: boolean;
  /** Gone for good: a stamp and a struck price instead of the sticker. */
  stamp?: boolean;
  /** A short run; the count is shown. */
  stock?: number;
  state: Tri;
  note?: Tri;
}

const MERCH: MerchItem[] = [
  {
    id: 'tote',
    name: { en: 'Tote bag', ko: 'Tote bag', ja: 'Tote bag' },
    text: { en: 'Heavy natural canvas, printed with the flight in pour order.', ko: 'Heavy natural canvas, printed with the flight in pour order.', ja: 'Heavy natural canvas, printed with the flight in pour order.' },
    price: 14,
    sticker: 'var(--fz-sky)',
    rotate: 8,
    state: { en: 'In stock', ko: 'In stock', ja: 'In stock' },
  },
  {
    id: 'poster',
    name: { en: 'Risograph poster', ko: 'Risograph poster', ja: 'Risograph poster' },
    text: { en: 'A2, the six flavours in yellow, pink and blue. Numbered edition of 200.', ko: 'A2, the six flavours in yellow, pink and blue. Numbered edition of 200.', ja: 'A2, the six flavours in yellow, pink and blue. Numbered edition of 200.' },
    price: 22,
    sticker: 'var(--fz-blue)',
    stickerText: '#ffffff',
    rotate: -4,
    stock: 18,
    state: { en: '{n} left', ko: '{n} left', ja: '{n} left' },
    note: { en: 'One per person.', ko: 'One per person.', ja: 'One per person.' },
  },
  {
    id: 'stickers',
    name: { en: 'Sticker sheet', ko: 'Sticker sheet', ja: 'Sticker sheet' },
    text: { en: 'The six shapes die-cut on one sheet the size of a postcard.', ko: 'The six shapes die-cut on one sheet the size of a postcard.', ja: 'The six shapes die-cut on one sheet the size of a postcard.' },
    price: 4,
    sticker: 'var(--fz-yellow)',
    rotate: -7,
    state: { en: 'In stock', ko: 'In stock', ja: 'In stock' },
  },
  {
    id: 'hat',
    name: { en: 'Bucket hat', ko: 'Bucket hat', ja: 'Bucket hat' },
    text: { en: 'Yellow needlecord with the star stitched on the front. S/M and L/XL.', ko: 'Yellow needlecord with the star stitched on the front. S/M and L/XL.', ja: 'Yellow needlecord with the star stitched on the front. S/M and L/XL.' },
    price: 28,
    sticker: 'var(--fz-pink)',
    rotate: 5,
    soldOut: true,
    state: { en: 'Sold out in both sizes', ko: 'Sold out in both sizes', ja: 'Sold out in both sizes' },
    note: { en: 'Forty more arrive Tuesday 24 November.', ko: 'Forty more arrive Tuesday 24 November.', ja: 'Forty more arrive Tuesday 24 November.' },
  },
  {
    id: 'pins',
    name: { en: 'Enamel pin set', ko: 'Enamel pin set', ja: 'Enamel pin set' },
    text: { en: 'Six pins, one for each flavour’s shape, on a backing card.', ko: 'Six pins, one for each flavour’s shape, on a backing card.', ja: 'Six pins, one for each flavour’s shape, on a backing card.' },
    price: 12,
    sticker: 'var(--fz-pink)',
    rotate: -8,
    soldOut: true,
    stamp: true,
    state: { en: 'Sold out on 15 November', ko: 'Sold out on 15 November', ja: 'Sold out on 15 November' },
    note: { en: 'Not being remade.', ko: 'Not being remade.', ja: 'Not being remade.' },
  },
  {
    id: 'glass',
    name: { en: 'Tasting glass', ko: 'Tasting glass', ja: 'Tasting glass' },
    text: { en: 'A 350 ml tumbler with the 60 ml pour line printed on the side.', ko: 'A 350 ml tumbler with the 60 ml pour line printed on the side.', ja: 'A 350 ml tumbler with the 60 ml pour line printed on the side.' },
    price: 9,
    sticker: 'var(--fz-pink)',
    rotate: -8,
    soldOut: true,
    stamp: true,
    state: { en: 'Sold out on 20 November', ko: 'Sold out on 20 November', ja: 'Sold out on 20 November' },
    note: { en: 'The bar still pours into them.', ko: 'The bar still pours into them.', ja: 'The bar still pours into them.' },
  },
];

const SHOP = {
  title: { en: 'Merch, here until it’s {mark}', ko: 'Merch, here until it’s {mark}', ja: 'Merch, here until it’s {mark}' },
  mark: { en: 'gone', ko: 'gone', ja: 'gone' },
  note: {
    en: 'Made in small runs for these two weeks and sold only at the shop, never posted. Put something aside here and we keep it behind the till for two days. The till takes cards and phones, no cash.',
    ko: 'Made in small runs for these two weeks and sold only at the shop, never posted. Put something aside here and we keep it behind the till for two days. The till takes cards and phones, no cash.',
    ja: 'Made in small runs for these two weeks and sold only at the shop, never posted. Put something aside here and we keep it behind the till for two days. The till takes cards and phones, no cash.',
  },
  put: { en: 'Put aside', ko: 'Put aside', ja: 'Put aside' },
  yours: { en: 'One is put aside for you.', ko: 'One is put aside for you.', ja: 'One is put aside for you.' },
  soldOut: { en: 'Sold out', ko: 'Sold out', ja: 'Sold out' },
  listTitle: { en: 'Your pick-up list', ko: 'Your pick-up list', ja: 'Your pick-up list' },
  listEmpty: {
    en: 'Nothing put aside yet. Fill a crate, or put aside something from the list above.',
    ko: 'Nothing put aside yet. Fill a crate, or put aside something from the list above.',
    ja: 'Nothing put aside yet. Fill a crate, or put aside something from the list above.',
  },
  crateLine: { en: 'Crate {no}', ko: 'Crate {no}', ja: 'Crate {no}' },
  remove: { en: 'Remove', ko: 'Remove', ja: 'Remove' },
  total: { en: 'Total', ko: 'Total', ja: 'Total' },
  totalNote: {
    en: 'Paid at the till when you collect, by card or phone. We keep everything for two days.',
    ko: 'Paid at the till when you collect, by card or phone. We keep everything for two days.',
    ja: 'Paid at the till when you collect, by card or phone. We keep everything for two days.',
  },
  newsAdded: { en: '{name} put aside. {n} on your pick-up list.', ko: '{name} put aside. {n} on your pick-up list.', ja: '{name} put aside. {n} on your pick-up list.' },
  newsRemoved: { en: '{name} taken off your pick-up list.', ko: '{name} taken off your pick-up list.', ja: '{name} taken off your pick-up list.' },
} satisfies Record<string, Tri>;

const GO = {
  title: { en: 'Getting there', ko: 'Getting there', ja: 'Getting there' },
  note: {
    en: 'We are in the old print shop on Calvert Avenue, the short street between Shoreditch High Street and Arnold Circus.',
    ko: 'We are in the old print shop on Calvert Avenue, the short street between Shoreditch High Street and Arnold Circus.',
    ja: 'We are in the old print shop on Calvert Avenue, the short street between Shoreditch High Street and Arnold Circus.',
  },
  map: {
    en: 'Street map. The shop is at the west end of Calvert Avenue, just off Shoreditch High Street. The walk from Shoreditch High Street station goes west along Bethnal Green Road, north up the High Street, then right into Calvert Avenue.',
    ko: 'Street map. The shop is at the west end of Calvert Avenue, just off Shoreditch High Street. The walk from Shoreditch High Street station goes west along Bethnal Green Road, north up the High Street, then right into Calvert Avenue.',
    ja: 'Street map. The shop is at the west end of Calvert Avenue, just off Shoreditch High Street. The walk from Shoreditch High Street station goes west along Bethnal Green Road, north up the High Street, then right into Calvert Avenue.',
  },
  maps: { en: 'Open in Maps', ko: 'Open in Maps', ja: 'Open in Maps' },
} satisfies Record<string, Tri>;

const WAYS: Array<{ icon: 'circle' | 'square' | 'triangle' | 'diamond'; color?: string; name: Tri; text: Tri }> = [
  {
    icon: 'circle',
    color: 'var(--fz-yellow)',
    name: { en: 'Overground', ko: 'Overground', ja: 'Overground' },
    text: { en: 'Shoreditch High Street, 5 minutes on foot. Follow Bethnal Green Road to the High Street, turn right, then right again into Calvert Avenue.', ko: 'Shoreditch High Street, 5 minutes on foot. Follow Bethnal Green Road to the High Street, turn right, then right again into Calvert Avenue.', ja: 'Shoreditch High Street, 5 minutes on foot. Follow Bethnal Green Road to the High Street, turn right, then right again into Calvert Avenue.' },
  },
  {
    icon: 'square',
    color: 'var(--fz-blue)',
    name: { en: 'Northern line', ko: 'Northern line', ja: 'Northern line' },
    text: { en: 'Old Street, 14 minutes. Walk east along Old Street to Shoreditch Church, cross the High Street, and Calvert Avenue is a minute south.', ko: 'Old Street, 14 minutes. Walk east along Old Street to Shoreditch Church, cross the High Street, and Calvert Avenue is a minute south.', ja: 'Old Street, 14 minutes. Walk east along Old Street to Shoreditch Church, cross the High Street, and Calvert Avenue is a minute south.' },
  },
  { icon: 'triangle', name: { en: 'Bus', ko: 'Bus', ja: 'Bus' }, text: { en: 'The 26, 35, 47 and 78 stop on Shoreditch High Street, two minutes away.', ko: 'The 26, 35, 47 and 78 stop on Shoreditch High Street, two minutes away.', ja: 'The 26, 35, 47 and 78 stop on Shoreditch High Street, two minutes away.' } },
  {
    icon: 'diamond',
    color: 'var(--fz-pink)',
    name: { en: 'Bike and step-free', ko: 'Bike and step-free', ja: 'Bike and step-free' },
    text: { en: 'Racks for eight bikes outside. Level entrance and an accessible toilet at the back.', ko: 'Racks for eight bikes outside. Level entrance and an accessible toilet at the back.', ja: 'Racks for eight bikes outside. Level entrance and an accessible toilet at the back.' },
  },
];

const FOOT = {
  note: {
    en: 'Fizz Lab sodas are brewed in Queen’s Yard, Hackney Wick. After 26 November you can buy them at 40 shops across London.',
    ko: 'Fizz Lab sodas are brewed in Queen’s Yard, Hackney Wick. After 26 November you can buy them at 40 shops across London.',
    ja: 'Fizz Lab sodas are brewed in Queen’s Yard, Hackney Wick. After 26 November you can buy them at 40 shops across London.',
  },
  handle: '@fizzlab.soda',
};

const PROMPT_EN = `Design one real page in the Kinetic Pop style: a warm paper page drawn in thick ink lines, with three loud fills (yellow, pink, blue), hard offset shadows and things that move when you touch them.

Pick a believable subject that lives on bright, short, shouted information, such as a pop-up shop, a summer festival or a launch party, and write its real content. The page must read as that subject's page, never as a page about its own style. Here it is the Fizz Lab pop-up: a Hackney Wick soda brewery's two-week tasting bar at 22 Calvert Avenue in Shoreditch, with its six flavours, its opening days, a crate of twelve to fill, its merch and how to get there.

TOKENS:
--yellow: #ffe85d
--pink: #ff4f7b
--blue: #196bff
--ink: #141313
--paper: #f6f3ea
--sky: #b4cdfd
--blush: #ffd4dd
--muted: #4f4a46
--white: #ffffff
Page background: radial-gradient(circle at 10% 8%, rgba(255,79,123,0.28) 0, transparent 24%), radial-gradient(circle at 90% 18%, rgba(25,107,255,0.22) 0, transparent 28%), linear-gradient(180deg, #fffdf2 0%, #f6f3ea 100%).
Ink tints: hatching in ink at 38% (2px lines every 9px, at 135deg) for closed days and their key; ink at 7% hatching on merch that is gone for good; ink dots at 7% (hero, 12px grid) and 12% (crate and map, 11px grid).
No other colours.

COLOUR:
- Text is ink. Muted is only for past days, struck prices and the "Put aside" key of sold-out merch. There is no error colour: the page has no form.
- Yellow, pink, blue, sky and blush are fills, never text or lines on paper. The exceptions are drawn letters: the hero words filled yellow, pink and blue inside an ink stroke, the white "Free" and pour numbers inside an ink stroke, yellow text on ink (the ticker key, a pressed toggle, the Cherry Cola number), white text on the ink "Today" tag and on the blue price sticker.
- Every structural line is ink, 3 to 5px. Every shadow is a hard ink offset (2 to 6px), never blurred.
- Hover: the yellow buttons and the pick-up key lift 2px up and left while their shadow grows; the steppers and "Put aside" fill yellow; the ticker key turns pink with ink text; in-page links get a 3px underline and text buttons thicken theirs from 2px to 3px; a day cell rises 5px.
- A control that cannot act yet has a 3px dashed ink border on paper and no shadow.
- Focus: a 3px ink outline 3px clear of the control (5 to 7px around a day cell, the crate confirmation and the list heading); on the ink ticker key a yellow ring drawn inside it.

TYPOGRAPHY:
Two families. Bowlby One (one weight, 400, never bolded) shouts: the hero words, dates, headings, names, pour numbers, prices and counts. Work Sans (400 and 600) reads.
Hero words and the dates line: Bowlby One clamp(2.4rem, 6.5vw, 4.9rem), line-height 1, letter-spacing -0.02em, upper case, a 2.5px ink stroke under the fill (1.75px under 640px), each word turned a little (-3deg, 2deg, -1.5deg).
H2: Bowlby One clamp(1.85rem, 3.9vw, 3rem), line-height 1.04, letter-spacing -0.025em, balanced; one word in a yellow (or pink) box with a 3px ink border, 10px radius and a 4px shadow, turned -2deg (pink 1.5deg).
Other Bowlby sizes: pour numbers and the crate count 2.6rem; flavour names 1.4rem (1.19rem on phones); day numbers 1.8rem (1.3rem on phones); bubble, confirmation and list headings 1.6rem (1.45rem on phones); stepper counts 1.6rem (1.4rem on phones); stepper names 1.2rem (1.05rem on phones); can numbers 1.35rem (1.2rem on phones); merch names 1.3rem (1.2rem on phones); prices on stickers 1.35rem (1.16rem on phones); list prices and ways 1.2rem; the address 1.55rem (1.4rem on phones); stamps 1rem; the brand name 1.45rem (1.3rem under 400px); ticker words 1.15rem upper case at -0.015em; the yellow buttons 1rem. The toggles, the ticker key and the text buttons are Work Sans 600 1rem.
Work Sans body 1.0625rem, line-height 1.62; the hero lede 1.125rem; facts, hints, notes and keys 1rem; labels in 600. No text under 1rem except the street names inside the map (0.875rem on phones, 0.8125rem under 360px), which has a text alternative.

LAYOUT:
- A 1120px column. A top bar: the brand (a yellow circle and a pink square in ink, then the name), five in-page links and a "Pick-up list" key with a round yellow count sticker. Under 1000px the links move to a second row.
- Hero: the pop-up's poster card, 5px ink border, 36px radius (28px on phones), white, 6px shadow, clipping three blobs (yellow 200px top right, pink 140px bottom left, blue 100px at the bottom), five small ink-outlined shapes and 12px halftone dots. The name and dates, one paragraph, "Get directions" and the address on the left; the free-tasting starburst on the right (below on phones). On a 1280x800 laptop the whole card shows above the fixed prev/next bar.
- Then the ticker band, and sections divided by a 20px ink zigzag with 56px above and below (44px on phones): flavours, dates, the crate, merch, getting there, and a footer on a 4px ink rule.
- Section heads: the heading on the left (1.1fr) and one paragraph on the right (1fr), bottom-aligned; stacked under 1000px.
- Flavours: three columns, the second 70px and the third 26px lower; two columns under 1000px; one under 640px with the shape at 96px beside its text.
- Crate: the crate on 5 columns, the steppers on 7; stacked under 900px. Merch: one list box. Pick-up list: heading and note on 5 columns, the list on 7. Getting there: map on 7, address and ways on 5.

COMPONENTS:
- Starburst: a 14-point pink star with a 4px ink edge, turned 9deg, 5px ink drop shadow; "Free" white in Bowlby 2.2rem (2rem on phones) with a 2.5px stroke, "tasting" 1.1rem, "Six pours, no ticket needed" in Work Sans 600 1rem.
- Flavour ticker: a yellow band between 4px ink rules, flavour names in a row separated by small pink stars, sliding left in a 34s loop, with an ink Pause/Play key (yellow text, 44px tall) at its right end.
- Tasting flight: an ordered list of six die-cut shapes (diamond, circle, triangle, rounded square, arch, star) in sky, yellow, pink, blue, blush and ink, 136 to 164px, 4px ink edges, turned -8 to 7deg, 5px drop shadow, the pour number on each; name, one sentence, then sugar and fizz (five 13px dots) under a 3px rule.
- Opening strip: a radio group of 14 day cells on an ink grid (3px gaps and a 4px border, 2px and 3px on phones, 16px radius, 6px shadow); 7 per row under 1000px. White Tuesday to Thursday, blush Friday and Saturday, sky Sunday, hatched Monday, paper with muted text for past days, a star for nights with something on. The chosen cell turns yellow, lifts 14px, turns -3deg and grows 8% inside a 4px ink ring (8px, 6% and 3px on phones). An ink "Today" tag sits above today (inside it under 1000px, an ink bar under the date on phones). Arrows, Home and End move between days.
- Speech bubble: white, 4px ink, 26px radius, 6px shadow, up to 540px wide (full width on phones). It slides under the chosen day and its tail points at that day's cell. It says the day, its hours (today, was open, open or closed) and its events in a time column under a 3px rule.
- Crate: a yellow card crate with ink dots, 4px border, 26px radius, turned -1.5deg, a handle slot, and twelve can tops in four columns: empty is white on a 3px dashed ring; a can is its flavour's colour on a solid ring with a 3px shadow and its pour number, filled in pour order. Under it the count, "8 of 12". Beside it six stepper rows (shape, name, minus, count, plus) with 44px square keys (3px ink, 10px radius, 3px shadow); plus stops at twelve cans, minus at none. "Two of each" and "Empty the crate" are underlined text buttons. "Put the crate aside" (yellow, 50px, 12px radius, 4px shadow) works only at exactly twelve, with a hint beside it ("Pick 4 more to fill it.") and a round £26 price sticker. The confirmation replaces the steppers: a bubble pointing at the crate with its number ("Crate 7 is behind the till"), the mix and "Fill another crate"; it takes focus.
- Merch list: one white box (4px ink, 28px radius, 6px shadow), rows on 3px rules: name and description, the stock state, a "Put aside" toggle, a 92px round price sticker (76px on phones) turned a few degrees. A short run shows its count in a small yellow box. The toggle is pressed with aria-pressed: ink fill, yellow text, a tick, sunk into its shadow. Sold-out items cannot be put aside (the key is disabled); items gone for good show a pink "Sold out" stamp turned -8deg and the struck price, on a faintly hatched row.
- Pick-up list: a white box listing each crate (with its mix) and each piece of merch put aside, its price and a Remove text button, then the total. Removing a line moves focus to the list's heading. The count sticker in the top bar follows the list.
- Map: a sky street map in white roads with ink edges, Arnold Circus as a yellow ring, a pink dotted walking route from the Overground station, a pink star pin and an ink-edged "Fizz Lab" label; then the address in Bowlby, "Open in Maps" and four ways to get there, each with a small shape.
- One polite live region says what changed: the chosen day and its hours, each can added or taken out, what was put aside or removed.
- Radii: 36px hero (28px on phones), 22 to 28px boxes, 16px strip, 10 to 12px buttons, keys and the chosen day, 6 to 8px tags and stamps. Circles are kept for stickers, can tops, fizz dots, blobs and drawn shapes.

MOTION:
- The ticker slides; its key pauses it. Buttons lift on hover (160ms) and press in on click. A day cell rises 5px on hover; the chosen one springs into place (240ms, cubic-bezier(0.3, 1.5, 0.6, 1)); the bubble and its tail slide (360ms, cubic-bezier(0.3, 1.25, 0.6, 1)); each new can drops in (340ms); the count sticker pops (320ms).
- prefers-reduced-motion: the ticker stands still with every name shown and no key; no transitions and no keyframes.

FORBIDDEN:
- A grid of identical rounded cards; pill-shaped buttons
- A small label above a heading; all-caps tracked labels (upper case only on the hero words, the dates line, "Free" and the ticker, always with negative tracking)
- Thin or pale lines, blurred or soft shadows, glows, glass, gradient text
- Colour as text on paper, colours outside the tokens, more than three loud fills
- Illustrations, photographs, emoji; die-cut shapes are the only drawings, plus the street map
- Arrows on links, middle-dot meta strings, numbers on anything that is not a real sequence (pour order, dates, crate numbers)
- Copy about pop art, colour, energy or design

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML: an ordered list for the flight, a radio group for the days, groups of labelled steppers, toggle buttons with aria-pressed, a live region
3) Working ticker pause, day choice with the moving bubble, crate builder with its twelve-can rule and confirmation, merch put-aside with sold-out items refused, and the pick-up list with removal
4) Responsive layout down to 320px with no horizontal scroll and every control at least 44px tall on phones
5) Visible focus on every control, focus moved to what replaces a control, reduced-motion support`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_EN, ja: PROMPT_EN };

interface CrateLine {
  no: number;
  counts: Counts;
}

const vars = (values: Record<string, string | number>) => values as CSSProperties;

export function PortedKineticPopPage({ lang }: PortedStylePageProps) {
  const [paused, setPaused] = useState(false);
  const [dayIndex, setDayIndex] = useState(TODAY);
  const [counts, setCounts] = useState<Counts>(START);
  const [doneNo, setDoneNo] = useState<number | null>(null);
  const [crates, setCrates] = useState<CrateLine[]>([]);
  const [aside, setAside] = useState<string[]>([]);
  const [news, setNews] = useState('');
  const nextNo = useRef(7);
  const doneRef = useRef<HTMLDivElement>(null);
  const firstPlusRef = useRef<HTMLButtonElement>(null);
  const listHeadRef = useRef<HTMLHeadingElement>(null);

  const t = (text: Tri) => text[lang];

  const day = DAYS[dayIndex];
  const total = totalOf(counts);
  const full = total === CRATE_SIZE;
  const merchAside = MERCH.filter((item) => aside.includes(item.id));
  const listCount = crates.length + merchAside.length;
  const listTotal = crates.length * CRATE_PRICE + merchAside.reduce((sum, item) => sum + item.price, 0);

  // The cans in pour order, one slot each, then the empty slots. A can keeps its key while
  // others are added or taken out, so only a new can drops in.
  const slots: Array<{ key: string; flavour: Flavour | null }> = FLAVOURS.flatMap((flavour) =>
    Array.from({ length: counts[flavour.id] }, (_, k) => ({ key: `${flavour.id}-${k}`, flavour })),
  );
  while (slots.length < CRATE_SIZE) slots.push({ key: `empty-${slots.length}`, flavour: null });

  const dayTitle = fill(t(DATES.dayTitle), { day: t(day.long), n: day.n });
  const dayHours = day.kind === 'shut' || !day.open || !day.close
    ? t(DATES.closed)
    : fill(t(day.today ? DATES.hoursToday : day.past ? DATES.hoursPast : DATES.hoursNext), { open: day.open, close: day.close });

  const chooseDay = (index: number) => {
    const next = DAYS[index];
    setDayIndex(index);
    const hours = next.kind === 'shut' || !next.open || !next.close
      ? t(DATES.closed)
      : fill(t(next.today ? DATES.hoursToday : next.past ? DATES.hoursPast : DATES.hoursNext), { open: next.open, close: next.close });
    setNews(`${fill(t(DATES.dayTitle), { day: t(next.long), n: next.n })}: ${hours}.`);
  };

  // The radios move with the arrow keys. Home and End reach the first and the last day.
  const jumpDay = (event: KeyboardEvent<HTMLFieldSetElement>) => {
    if (event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const index = event.key === 'Home' ? 0 : DAYS.length - 1;
    chooseDay(index);
    event.currentTarget.querySelectorAll<HTMLInputElement>('input')[index]?.focus();
  };

  const step = (flavour: Flavour, by: 1 | -1) => {
    const n = counts[flavour.id];
    if (by === 1 && full) {
      setNews(t(CRATE.newsBlocked));
      return;
    }
    if (by === -1 && n === 0) {
      setNews(fill(t(CRATE.newsNone), { name: flavour.name }));
      return;
    }
    const next = { ...counts, [flavour.id]: n + by };
    const nextTotal = totalOf(next);
    setCounts(next);
    setNews(fill(t(nextTotal === CRATE_SIZE ? CRATE.newsFull : CRATE.newsCount), { name: flavour.name, n: n + by, total: nextTotal }));
  };

  const putCrateAside = () => {
    if (!full) {
      setNews(fill(t(CRATE.newsNotFull), { n: CRATE_SIZE - total }));
      return;
    }
    const no = nextNo.current;
    nextNo.current += 1;
    flushSync(() => {
      setCrates([...crates, { no, counts }]);
      setDoneNo(no);
      setNews('');
    });
    doneRef.current?.focus();
  };

  const fillAnother = () => {
    flushSync(() => {
      setCounts(EMPTY);
      setDoneNo(null);
    });
    firstPlusRef.current?.focus();
  };

  const toggleMerch = (item: MerchItem) => {
    if (item.soldOut) return;
    if (aside.includes(item.id)) {
      setAside(aside.filter((id) => id !== item.id));
      setNews(fill(t(SHOP.newsRemoved), { name: t(item.name) }));
    } else {
      setAside([...aside, item.id]);
      setNews(fill(t(SHOP.newsAdded), { name: t(item.name), n: listCount + 1 }));
    }
  };

  // A removed line leaves the list; focus goes to the list's heading.
  const removeCrate = (no: number) => {
    flushSync(() => {
      setCrates(crates.filter((crate) => crate.no !== no));
      if (doneNo === no) setDoneNo(null);
      setNews(fill(t(SHOP.newsRemoved), { name: fill(t(SHOP.crateLine), { no }) }));
    });
    listHeadRef.current?.focus();
  };

  const removeMerch = (item: MerchItem) => {
    flushSync(() => {
      setAside(aside.filter((id) => id !== item.id));
      setNews(fill(t(SHOP.newsRemoved), { name: t(item.name) }));
    });
    listHeadRef.current?.focus();
  };

  const tickerItems = [t(TICKER.free), ...FLAVOURS.map((flavour) => flavour.name)];

  return (
    <FusionShell
      fusionId="kinetic-pop"
      lang={lang}
      tone="light"
      accent="#ffe85d"
      prev={{ href: '/pages/editorial-silence.html', label: 'Editorial Silence' }}
      next={{ href: '/pages/cyberpunk-glitch.html', label: 'Cyberpunk Glitch' }}
      prompts={PROMPTS}
    >
      <div className="fz">
        <header className="fz-top">
          <p className="fz-mark">
            <span className="fz-mark__shapes" aria-hidden="true"><i /><i /></span>
            Fizz Lab
          </p>
          <nav className="fz-top__nav" aria-label={t(HEAD.nav)}>
            <a href="#fz-flavours">{t(HEAD.flavours)}</a>
            <a href="#fz-dates">{t(HEAD.dates)}</a>
            <a href="#fz-crate">{t(HEAD.crates)}</a>
            <a href="#fz-merch">{t(HEAD.merch)}</a>
            <a href="#fz-go">{t(HEAD.go)}</a>
          </nav>
          <a className="fz-top__list" href="#fz-pickup">
            <span>
              {t(HEAD.pickUp)}
              <span className="fz-top__word">{` ${t(HEAD.listWord)}`}</span>
            </span>
            <span className="fz-top__count" key={listCount}>{listCount}</span>
          </a>
        </header>

        <p className="fz-sr" role="status">{news}</p>

        <section className="fz-hero" aria-labelledby="fz-hero-title">
          <div className="fz-hero__clip">
            <div className="fz-halftone" aria-hidden="true" />
            <span className="fz-blob fz-blob--a" aria-hidden="true" />
            <span className="fz-blob fz-blob--b" aria-hidden="true" />
            <span className="fz-blob fz-blob--c" aria-hidden="true" />
            <div className="fz-geo" aria-hidden="true">
              <span className="fz-geo__circle" />
              <span className="fz-geo__triangle" />
              <span className="fz-geo__square" />
              <span className="fz-geo__star" />
              <span className="fz-geo__diamond" />
            </div>
            <div className="fz-hero__text">
              <h1 className="fz-hero__title" id="fz-hero-title">
                {HERO.words.map((word, index) => (
                  <Fragment key={word.en}>
                    {index > 0 ? ' ' : null}
                    <span className="fz-word">{t(word)}</span>
                  </Fragment>
                ))}
              </h1>
              <p className="fz-when">
                <span aria-hidden="true">{t(HERO.when)}</span>
                <span className="fz-sr">{t(HERO.whenSpoken)}</span>
              </p>
              <p className="fz-lede">{t(HERO.lede)}</p>
              <div className="fz-hero__act">
                <a className="fz-btn" href="#fz-go">{t(HERO.directions)}</a>
                <p>
                  {t(HERO.where)}
                  <span>{t(HERO.open)}</span>
                </p>
              </div>
            </div>
            <div className="fz-burst">
              <svg viewBox="0 0 100 100" aria-hidden="true"><polygon points={BURST} /></svg>
              <p>
                <b>{t(HERO.free)}</b> <span>{t(HERO.tasting)}</span> <small>{t(HERO.pours)}</small>
              </p>
            </div>
          </div>
        </section>

        <div className={`fz-ticker${paused ? ' is-paused' : ''}`}>
          <div className="fz-ticker__view" aria-hidden="true">
            <div className="fz-ticker__track">
              {[0, 1].map((copy) => (
                <div className="fz-ticker__copy" key={copy}>
                  {tickerItems.map((item) => (
                    <Fragment key={item}>
                      <span>{item}</span>
                      <i />
                    </Fragment>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <button className="fz-ticker__btn" type="button" onClick={() => setPaused(!paused)}>
            <svg viewBox="0 0 20 20" aria-hidden="true">
              {paused ? <polygon points="5,3 17,10 5,17" /> : (
                <>
                  <rect x="4" y="3" width="4" height="14" />
                  <rect x="12" y="3" width="4" height="14" />
                </>
              )}
            </svg>
            <span>{t(paused ? TICKER.play : TICKER.pause)}</span>
            <span className="fz-sr"> {t(TICKER.what)}</span>
          </button>
        </div>

        <div className="fz-zigzag" aria-hidden="true" />

        <section className="fz-section" id="fz-flavours" aria-labelledby="fz-flavours-title">
          <div className="fz-head">
            <h2 id="fz-flavours-title">{place(t(FLIGHT.title), 'mark', <mark>{t(FLIGHT.mark)}</mark>)}</h2>
            <p>{t(FLIGHT.note)}</p>
          </div>
          <ol className="fz-flight">
            {FLAVOURS.map((flavour, index) => (
              <li className="fz-fl" key={flavour.id}>
                <div
                  className="fz-fl__shape"
                  style={vars({
                    '--fz-c': flavour.fill,
                    '--fz-s': `${flavour.size}px`,
                    '--fz-r': `${flavour.rotate}deg`,
                    '--fz-ny': flavour.numberDrop,
                    '--fz-nc': flavour.numberColor,
                  })}
                >
                  <svg viewBox="0 0 100 100" aria-hidden="true"><ShapePath shape={flavour.shape} /></svg>
                  <b aria-hidden="true">{index + 1}</b>
                </div>
                <h3>{flavour.name}</h3>
                <p>{t(flavour.text)}</p>
                <dl className="fz-facts">
                  <dt>{t(FLIGHT.sugar)}</dt>
                  <dd>{fill(t(FLIGHT.sugarValue), { n: flavour.sugar })}</dd>
                  <dt>{t(FLIGHT.fizz)}</dt>
                  <dd>
                    <span className="fz-fizz" role="img" aria-label={fill(t(FLIGHT.fizzValue), { n: flavour.fizz })}>
                      {[1, 2, 3, 4, 5].map((dot) => <i key={dot} className={dot <= flavour.fizz ? 'is-on' : undefined} />)}
                    </span>
                  </dd>
                </dl>
              </li>
            ))}
          </ol>
        </section>

        <div className="fz-zigzag" aria-hidden="true" />

        <section className="fz-section" id="fz-dates" aria-labelledby="fz-dates-title">
          <div className="fz-head">
            <h2 id="fz-dates-title">{t(DATES.title)}</h2>
            <p>{t(DATES.note)}</p>
          </div>
          <fieldset className="fz-days" onKeyDown={jumpDay}>
            <legend className="fz-sr">{t(DATES.legend)}</legend>
            <ol className="fz-cal">
              {DAYS.map((item, index) => {
                const classes = ['fz-day', `fz-day--${item.kind}`];
                if (item.past) classes.push('is-past');
                if (item.today) classes.push('is-today');
                if (index === dayIndex) classes.push('is-on');
                return (
                  <li key={item.date}>
                    <label className={classes.join(' ')}>
                      <input
                        className="fz-day__input"
                        type="radio"
                        name="fz-day"
                        value={item.date}
                        checked={index === dayIndex}
                        onChange={() => chooseDay(index)}
                      />
                      {item.today ? <span className="fz-day__today">{t(DATES.today)}</span> : null}
                      <span className="fz-day__wd">{t(item.short)}</span>
                      <span className="fz-day__n">{item.n}</span>
                      <span className="fz-sr"> {t(DATES.month)}</span>
                      <span className="fz-day__h">
                        {item.open && item.close ? ` ${item.open.slice(0, 2)}–${item.close.slice(0, 2)}` : ` ${t(DATES.closed)}`}
                      </span>
                      {item.star ? (
                        <>
                          <i className="fz-day__star" aria-hidden="true" />
                          <span className="fz-sr">, {t(item.star)}</span>
                        </>
                      ) : null}
                    </label>
                  </li>
                );
              })}
            </ol>
          </fieldset>

          <div className="fz-say">
            <div
              className="fz-bubble"
              style={vars({ '--fz-d14': (dayIndex + 0.5) / 14, '--fz-d7': ((dayIndex % 7) + 0.5) / 7 })}
            >
              <h3>{dayTitle}</h3>
              <p className="fz-bubble__time">{dayHours}</p>
              {day.kind === 'shut' ? (
                <p className="fz-bubble__shut">{t(DATES.shutNote)}</p>
              ) : (
                <ul>
                  {day.events.map((event) => (
                    <li key={event.time + event.text.en}>
                      <time dateTime={`${day.date}T${event.time}`}>{event.time}</time>
                      <span>{t(event.text)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <dl className="fz-key" aria-label={t(DATES.keyLabel)}>
            {KEY.map((row) => (
              <div key={row.name.en}>
                <i className={`fz-key__swatch fz-key__swatch--${row.swatch}`} aria-hidden="true" />
                <dt>{t(row.name)}</dt>
                <dd>{t(row.hours)}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="fz-zigzag" aria-hidden="true" />

        <section className="fz-section" id="fz-crate" aria-labelledby="fz-crate-title">
          <div className="fz-head">
            <h2 id="fz-crate-title">{place(t(CRATE.title), 'mark', <mark>{t(CRATE.mark)}</mark>)}</h2>
            <p>{t(CRATE.note)}</p>
          </div>

          <div className="fz-builder">
            <div className="fz-crate-side">
              <div
                className={`fz-crate${full ? ' is-full' : ''}`}
                role="img"
                aria-label={`${fill(t(CRATE.picture), { n: total })}${total > 0 ? `: ${mixOf(counts)}` : ''}`}
              >
                <span className="fz-crate__handle" aria-hidden="true" />
                {slots.map(({ key, flavour }) => (
                  <span
                    key={key}
                    className={`fz-can${flavour ? ' is-in' : ''}`}
                    style={flavour ? vars({ '--fz-c': flavour.fill, '--fz-nc': flavour.numberColor }) : undefined}
                  >
                    {flavour ? <b>{FLAVOURS.indexOf(flavour) + 1}</b> : null}
                  </span>
                ))}
              </div>
              <p className="fz-tally">
                <b>{total}</b> <span className="fz-tally__of">{t(CRATE.of)}</span>
                <span className="fz-tally__cans">{t(CRATE.cans)}</span>
              </p>
            </div>

            {doneNo !== null ? (
              <div className="fz-done" ref={doneRef} tabIndex={-1}>
                <p className="fz-done__title">{fill(t(CRATE.doneTitle), { no: doneNo })}</p>
                <p className="fz-done__mix">{mixOf(crates.find((crate) => crate.no === doneNo)?.counts ?? counts)}.</p>
                <p>{t(CRATE.doneNote)}</p>
                <button className="fz-btn fz-btn--white" type="button" onClick={fillAnother}>{t(CRATE.another)}</button>
              </div>
            ) : (
              <div className="fz-pick">
                <ul className="fz-steps" aria-label={t(CRATE.flavours)}>
                  {FLAVOURS.map((flavour, index) => {
                    const n = counts[flavour.id];
                    return (
                      <li className="fz-steprow" key={flavour.id}>
                        <span className="fz-steprow__shape" style={vars({ '--fz-c': flavour.fill })} aria-hidden="true">
                          <svg viewBox="0 0 100 100"><ShapePath shape={flavour.shape} /></svg>
                        </span>
                        <span className="fz-steprow__name" id={`fz-step-${flavour.id}`}>{flavour.name}</span>
                        <div className="fz-stepper" role="group" aria-labelledby={`fz-step-${flavour.id}`}>
                          <button
                            type="button"
                            aria-label={fill(t(CRATE.less), { name: flavour.name })}
                            aria-disabled={n === 0 || undefined}
                            onClick={() => step(flavour, -1)}
                          >
                            <svg viewBox="0 0 20 20" aria-hidden="true"><line x1="4" y1="10" x2="16" y2="10" /></svg>
                          </button>
                          <span className="fz-stepper__n">{n}</span>
                          <button
                            type="button"
                            ref={index === 0 ? firstPlusRef : undefined}
                            aria-label={fill(t(CRATE.plus), { name: flavour.name })}
                            aria-disabled={full || undefined}
                            onClick={() => step(flavour, 1)}
                          >
                            <svg viewBox="0 0 20 20" aria-hidden="true">
                              <line x1="4" y1="10" x2="16" y2="10" />
                              <line x1="10" y1="4" x2="10" y2="16" />
                            </svg>
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <div className="fz-pick__quick">
                  <button
                    className="fz-textbtn"
                    type="button"
                    onClick={() => {
                      setCounts(TWO_EACH);
                      setNews(t(CRATE.newsTwoEach));
                    }}
                  >
                    {t(CRATE.twoEach)}
                  </button>
                  <button
                    className="fz-textbtn"
                    type="button"
                    onClick={() => {
                      setCounts(EMPTY);
                      setNews(t(CRATE.newsEmpty));
                    }}
                  >
                    {t(CRATE.empty)}
                  </button>
                </div>
                <div className="fz-pick__put">
                  <span className="fz-sticker" style={vars({ '--fz-c': 'var(--fz-yellow)', '--fz-r': '-7deg' })}>£{CRATE_PRICE}</span>
                  <div>
                    <button
                      className="fz-btn"
                      type="button"
                      aria-disabled={!full || undefined}
                      aria-describedby="fz-pick-hint"
                      onClick={putCrateAside}
                    >
                      {t(CRATE.put)}
                    </button>
                    <p className="fz-pick__hint" id="fz-pick-hint">
                      {full ? t(CRATE.full) : fill(t(CRATE.more), { n: CRATE_SIZE - total })}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="fz-zigzag" aria-hidden="true" />

        <section className="fz-section" id="fz-merch" aria-labelledby="fz-merch-title">
          <div className="fz-head">
            <h2 id="fz-merch-title">{place(t(SHOP.title), 'mark', <mark className="fz-pink">{t(SHOP.mark)}</mark>)}</h2>
            <p>{t(SHOP.note)}</p>
          </div>
          <ul className="fz-merch">
            {MERCH.map((item) => {
              const isAside = aside.includes(item.id);
              const left = item.stock !== undefined ? item.stock - (isAside ? 1 : 0) : undefined;
              const state = fill(t(item.state), { n: left ?? '' });
              return (
                <li className={`fz-item${item.stamp ? ' is-gone' : ''}`} key={item.id}>
                  <div className="fz-item__name">
                    <h3>{t(item.name)}</h3>
                    <p>{t(item.text)}</p>
                  </div>
                  <div className="fz-item__state">
                    <p>
                      {left !== undefined ? <mark>{state}</mark> : state}
                      {item.note ? <small>{t(item.note)}</small> : null}
                      {isAside ? <small className="fz-item__yours">{t(SHOP.yours)}</small> : null}
                    </p>
                    <button
                      className="fz-put"
                      type="button"
                      aria-pressed={item.soldOut ? undefined : isAside}
                      disabled={item.soldOut}
                     
                      onClick={() => toggleMerch(item)}
                    >
                      <svg viewBox="0 0 20 20" aria-hidden="true"><polyline points="4,10.5 8.5,15 16,5" /></svg>
                      {t(SHOP.put)}
                      <span className="fz-sr">{` ${t(item.name)}, £${item.price}`}</span>
                    </button>
                  </div>
                  {item.stamp ? (
                    <span className="fz-soldout">
                      <span className="fz-stamp">{t(SHOP.soldOut)}</span>
                      <s>£{item.price}</s>
                    </span>
                  ) : (
                    <span
                      className="fz-sticker"
                      style={vars({ '--fz-c': item.sticker, '--fz-r': `${item.rotate}deg`, '--fz-tc': item.stickerText ?? 'var(--fz-ink)' })}
                    >
                      £{item.price}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="fz-pickup" id="fz-pickup">
            <div className="fz-pickup__head">
              <h3 ref={listHeadRef} tabIndex={-1}>{t(SHOP.listTitle)}</h3>
              <p>{t(SHOP.totalNote)}</p>
            </div>
            <div className="fz-slip">
              {listCount === 0 ? (
                <p>{t(SHOP.listEmpty)}</p>
              ) : (
                <>
                  <ul>
                    {crates.map((crate) => {
                      const name = fill(t(SHOP.crateLine), { no: crate.no });
                      return (
                        <li key={`crate-${crate.no}`}>
                          <p className="fz-slip__name">
                            {name}
                            <small>{mixOf(crate.counts)}</small>
                          </p>
                          <span className="fz-slip__price">£{CRATE_PRICE}</span>
                          <button className="fz-textbtn" type="button" onClick={() => removeCrate(crate.no)}>
                            {t(SHOP.remove)}
                            <span className="fz-sr"> {name}</span>
                          </button>
                        </li>
                      );
                    })}
                    {merchAside.map((item) => (
                      <li key={item.id}>
                        <p className="fz-slip__name">{t(item.name)}</p>
                        <span className="fz-slip__price">£{item.price}</span>
                        <button className="fz-textbtn" type="button" onClick={() => removeMerch(item)}>
                          {t(SHOP.remove)}
                          <span className="fz-sr"> {t(item.name)}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <p className="fz-slip__total">
                    <span>{t(SHOP.total)}</span>
                    <b>£{listTotal}</b>
                  </p>
                </>
              )}
            </div>
          </div>
        </section>

        <div className="fz-zigzag" aria-hidden="true" />

        <section className="fz-section" id="fz-go" aria-labelledby="fz-go-title">
          <div className="fz-head">
            <h2 id="fz-go-title">{t(GO.title)}</h2>
            <p>{t(GO.note)}</p>
          </div>
          <div className="fz-go">
            <div className="fz-map" role="img" aria-label={t(GO.map)}>
              <span className="fz-road fz-road--v fz-r-hs" />
              <span className="fz-road fz-road--h fz-r-old" />
              <span className="fz-road fz-road--h fz-r-calvert" />
              <span className="fz-road fz-road--h fz-r-bgr" />
              <span className="fz-circus" />
              <svg className="fz-route fz-route--wide" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <polyline points="48,80.8 23.7,80.8 23.7,41.8 34,41.8" />
              </svg>
              <svg className="fz-route fz-route--narrow" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                <polyline points="46,74.6 21.9,74.6 21.9,42.6 34,42.6" />
              </svg>
              <span className="fz-label fz-l-hs">Shoreditch High St</span>
              <span className="fz-label fz-l-old">Old St</span>
              <span className="fz-label fz-l-calvert">Calvert Ave</span>
              <span className="fz-label fz-l-bgr">Bethnal Green Rd</span>
              <span className="fz-label fz-l-circus">Arnold Circus</span>
              <span className="fz-stn" />
              <span className="fz-label fz-l-stn">Shoreditch<br />High Street</span>
              <span className="fz-pin"><svg viewBox="0 0 100 100"><polygon points={STAR} /></svg></span>
              <span className="fz-pin-label">Fizz Lab</span>
            </div>
            <div className="fz-go__text">
              <p className="fz-addr">{ADDRESS}<br />{POSTCODE}</p>
              <a className="fz-btn" href={MAPS_URL} target="_blank" rel="noreferrer">{t(GO.maps)}</a>
              <ul className="fz-ways">
                {WAYS.map((way) => (
                  <li key={way.name.en}>
                    <i className={`fz-ways__icon fz-ways__icon--${way.icon}`} style={way.color ? vars({ '--fz-k': way.color }) : undefined} aria-hidden="true" />
                    <div>
                      <h3>{t(way.name)}</h3>
                      <p>{t(way.text)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <footer className="fz-foot">
          <p>{t(FOOT.note)}</p>
          <p>{FOOT.handle}</p>
        </footer>
      </div>
    </FusionShell>
  );
}
