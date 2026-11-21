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
    short: { en: '13 Nov', ko: '13 Nov', ja: '13 Nov' },
    day: { en: '13 November', ko: '13 November', ja: '13 November' },
    long: { en: 'Friday 13 November', ko: 'Friday 13 November', ja: 'Friday 13 November' },
    left: 0,
    closes: { en: 'Tuesday 10 November', ko: 'Tuesday 10 November', ja: 'Tuesday 10 November' },
  },
  {
    n: 2,
    date: '2026-12-11',
    short: { en: '11 Dec', ko: '11 Dec', ja: '11 Dec' },
    day: { en: '11 December', ko: '11 December', ja: '11 December' },
    long: { en: 'Friday 11 December', ko: 'Friday 11 December', ja: 'Friday 11 December' },
    left: 214,
    closes: { en: 'Tuesday 8 December', ko: 'Tuesday 8 December', ja: 'Tuesday 8 December' },
  },
  {
    n: 3,
    date: '2027-01-15',
    short: { en: '15 Jan', ko: '15 Jan', ja: '15 Jan' },
    day: { en: '15 January', ko: '15 January', ja: '15 January' },
    long: { en: 'Friday 15 January', ko: 'Friday 15 January', ja: 'Friday 15 January' },
    left: 682,
    closes: { en: 'Tuesday 12 January', ko: 'Tuesday 12 January', ja: 'Tuesday 12 January' },
  },
  {
    n: 4,
    date: '2027-02-12',
    short: { en: '12 Feb', ko: '12 Feb', ja: '12 Feb' },
    day: { en: '12 February', ko: '12 February', ja: '12 February' },
    long: { en: 'Friday 12 February', ko: 'Friday 12 February', ja: 'Friday 12 February' },
    left: 1049,
    closes: { en: 'Tuesday 9 February', ko: 'Tuesday 9 February', ja: 'Tuesday 9 February' },
    note: { en: 'Series final, with prizes for the top three overall.', ko: 'Series final, with prizes for the top three overall.', ja: 'Series final, with prizes for the top three overall.' },
  },
];

const OPEN: OpenRace[] = [2, 3, 4];
const raceOf = (n: RaceId) => RACES[n - 1];
/** The next race night, set as the poster at the top of the page. */
const NEXT = raceOf(2);

const HEAD = {
  nav: { en: 'Night Lap 10K', ko: 'Night Lap 10K', ja: 'Night Lap 10K' },
  nights: { en: 'Race nights', ko: 'Race nights', ja: 'Race nights' },
  route: { en: 'Route', ko: 'Route', ja: 'Route' },
  entry: { en: 'Entry', ko: 'Entry', ja: 'Entry' },
  results: { en: 'Results', ko: 'Results', ja: 'Results' },
  enter: { en: 'Enter race {n}', ko: 'Enter race {n}', ja: 'Enter race {n}' },
  enterShort: { en: 'Enter', ko: 'Enter', ja: 'Enter' },
} satisfies Record<string, Tri>;

const HERO = {
  title: {
    en: 'Night Lap 10K, race 2: Friday 11 December, starting at 21:00',
    ko: 'Night Lap 10K, race 2: Friday 11 December, starting at 21:00',
    ja: 'Night Lap 10K, race 2: Friday 11 December, starting at 21:00',
  },
  day: { en: 'Friday', ko: 'Friday', ja: 'Friday' },
  lede: {
    en: 'Race 2 of the winter series in Rotterdam. One 10 km lap of the city centre after dark, over the Willemsbrug and the Erasmusbrug, starting and finishing on the Coolsingel in front of City Hall.',
    ko: 'Race 2 of the winter series in Rotterdam. One 10 km lap of the city centre after dark, over the Willemsbrug and the Erasmusbrug, starting and finishing on the Coolsingel in front of City Hall.',
    ja: 'Race 2 of the winter series in Rotterdam. One 10 km lap of the city centre after dark, over the Willemsbrug and the Erasmusbrug, starting and finishing on the Coolsingel in front of City Hall.',
  },
  left: { en: 'places left of {capacity}', ko: 'places left of {capacity}', ja: 'places left of {capacity}' },
  enter: { en: 'Enter for €{price}', ko: 'Enter for €{price}', ja: 'Enter for €{price}' },
  closes: {
    en: 'Entry closes on {day} at midnight, or earlier if the race fills.',
    ko: 'Entry closes on {day} at midnight, or earlier if the race fills.',
    ja: 'Entry closes on {day} at midnight, or earlier if the race fills.',
  },
} satisfies Record<string, Tri>;

const NIGHTS = {
  title: { en: 'Four Friday nights', ko: 'Four Friday nights', ja: 'Four Friday nights' },
  note: {
    en: 'Every race starts at 21:00 and runs the same lap. Your best three times count toward the series ranking, which is settled on 12 February.',
    ko: 'Every race starts at 21:00 and runs the same lap. Your best three times count toward the series ranking, which is settled on 12 February.',
    ja: 'Every race starts at 21:00 and runs the same lap. Your best three times count toward the series ranking, which is settled on 12 February.',
  },
  race: { en: 'Race {n}', ko: 'Race {n}', ja: 'Race {n}' },
  done: { en: 'Finished. 1,431 runners, won in 31:08.', ko: 'Finished. 1,431 runners, won in 31:08.', ja: 'Finished. 1,431 runners, won in 31:08.' },
  seeResults: { en: 'See results', ko: 'See results', ja: 'See results' },
  ofRace: { en: ' of race 1', ko: ' of race 1', ja: ' of race 1' },
  left: { en: '{left} of {capacity} places left', ko: '{left} of {capacity} places left', ja: '{left} of {capacity} places left' },
  choose: { en: 'Choose', ko: 'Choose', ja: 'Choose' },
  chosen: { en: 'Chosen', ko: 'Chosen', ja: 'Chosen' },
  which: { en: ' race {n}, {date}', ko: ' race {n}, {date}', ja: ' race {n}, {date}' },
  news: {
    en: 'Race {n} on {date} is chosen. The entry form is now for race {n}.',
    ko: 'Race {n} on {date} is chosen. The entry form is now for race {n}.',
    ja: 'Race {n} on {date} is chosen. The entry form is now for race {n}.',
  },
} satisfies Record<string, Tri>;

const ROUTE = {
  title: { en: 'The route', ko: 'The route', ja: 'The route' },
  note: {
    en: 'One clockwise lap on closed roads. It is flat apart from two bridge climbs. The course closes 90 minutes after the start, at 22:30.',
    ko: 'One clockwise lap on closed roads. It is flat apart from two bridge climbs. The course closes 90 minutes after the start, at 22:30.',
    ja: 'One clockwise lap on closed roads. It is flat apart from two bridge climbs. The course closes 90 minutes after the start, at 22:30.',
  },
  checkpoint: { en: 'Checkpoint', ko: 'Checkpoint', ja: 'Checkpoint' },
  water: { en: 'Water', ko: 'Water', ja: 'Water' },
  list: { en: 'Checkpoints from start to finish', ko: 'Checkpoints from start to finish', ja: 'Checkpoints from start to finish' },
  waterHere: { en: ', water', ko: ', water', ja: ', water' },
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
    name: { en: 'Start, Coolsingel', ko: 'Start, Coolsingel', ja: 'Start, Coolsingel' },
    note: { en: 'In front of City Hall. Start pens open at 20:30.', ko: 'In front of City Hall. Start pens open at 20:30.', ja: 'In front of City Hall. Start pens open at 20:30.' },
  },
  {
    km: '1.3',
    name: { en: 'Markthal', ko: 'Markthal', ja: 'Markthal' },
    note: { en: 'Along the Binnenrotte and past the market hall.', ko: 'Along the Binnenrotte and past the market hall.', ja: 'Along the Binnenrotte and past the market hall.' },
  },
  {
    km: '2.2',
    name: { en: 'Oude Haven', ko: 'Oude Haven', ja: 'Oude Haven' },
    note: { en: 'Water at the foot of the Witte Huis.', ko: 'Water at the foot of the Witte Huis.', ja: 'Water at the foot of the Witte Huis.' },
    water: true,
  },
  {
    km: '3.1',
    name: { en: 'Willemsbrug', ko: 'Willemsbrug', ja: 'Willemsbrug' },
    note: { en: 'First climb, about 12 m up over the Maas.', ko: 'First climb, about 12 m up over the Maas.', ja: 'First climb, about 12 m up over the Maas.' },
  },
  {
    km: '3.9',
    name: { en: 'Noordereiland', ko: 'Noordereiland', ja: 'Noordereiland' },
    note: { en: 'Along the Maaskade, the quietest stretch.', ko: 'Along the Maaskade, the quietest stretch.', ja: 'Along the Maaskade, the quietest stretch.' },
  },
  {
    km: '5.0',
    name: { en: 'Wilhelminapier', ko: 'Wilhelminapier', ja: 'Wilhelminapier' },
    note: {
      en: 'Half-way timing mat, water and toilets by Hotel New York.',
      ko: 'Half-way timing mat, water and toilets by Hotel New York.',
      ja: 'Half-way timing mat, water and toilets by Hotel New York.',
    },
    water: true,
  },
  {
    km: '6.0',
    name: { en: 'Erasmusbrug', ko: 'Erasmusbrug', ja: 'Erasmusbrug' },
    note: { en: 'Second climb and the highest point of the lap.', ko: 'Second climb and the highest point of the lap.', ja: 'Second climb and the highest point of the lap.' },
  },
  {
    km: '7.1',
    name: { en: 'Veerhaven', ko: 'Veerhaven', ja: 'Veerhaven' },
    note: { en: 'Water on the quay between the moored ships.', ko: 'Water on the quay between the moored ships.', ja: 'Water on the quay between the moored ships.' },
    water: true,
  },
  {
    km: '8.3',
    name: { en: 'Het Park', ko: 'Het Park', ja: 'Het Park' },
    note: { en: 'Under the Euromast, on a path lit for the race.', ko: 'Under the Euromast, on a path lit for the race.', ja: 'Under the Euromast, on a path lit for the race.' },
  },
  {
    km: '9.0',
    name: { en: 'Witte de Withstraat', ko: 'Witte de Withstraat', ja: 'Witte de Withstraat' },
    note: { en: 'One kilometre to go.', ko: 'One kilometre to go.', ja: 'One kilometre to go.' },
  },
  {
    km: '10.0',
    name: { en: 'Finish, Coolsingel', ko: 'Finish, Coolsingel', ja: 'Finish, Coolsingel' },
    note: { en: 'Shirts, soup and tea in the City Hall courtyard.', ko: 'Shirts, soup and tea in the City Hall courtyard.', ja: 'Shirts, soup and tea in the City Hall courtyard.' },
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
  { id: 'A', range: { en: 'under 40 min', ko: 'under 40 min', ja: 'under 40 min' } },
  { id: 'B', range: { en: '40 to 50 min', ko: '40 to 50 min', ja: '40 to 50 min' } },
  { id: 'C', range: { en: '50 to 60 min', ko: '50 to 60 min', ja: '50 to 60 min' } },
  { id: 'D', range: { en: 'over 60 min', ko: 'over 60 min', ja: 'over 60 min' } },
];

const ENTRY = {
  title: { en: 'Enter race {n}', ko: 'Enter race {n}', ja: 'Enter race {n}' },
  forOne: { en: 'for one night', ko: 'for one night', ja: 'for one night' },
  alt: {
    en: 'Or €84 for the three nights still to run: 11 December, 15 January and 12 February.',
    ko: 'Or €84 for the three nights still to run: 11 December, 15 January and 12 February.',
    ja: 'Or €84 for the three nights still to run: 11 December, 15 January and 12 February.',
  },
  includes: { en: 'Every entry includes', ko: 'Every entry includes', ja: 'Every entry includes' },
  pass: { en: 'Entry', ko: 'Entry', ja: 'Entry' },
  one: { en: 'One night', ko: 'One night', ja: 'One night' },
  three: { en: 'Three nights', ko: 'Three nights', ja: 'Three nights' },
  threeDates: { en: '11 Dec, 15 Jan, 12 Feb', ko: '11 Dec, 15 Jan, 12 Feb', ja: '11 Dec, 15 Jan, 12 Feb' },
  pen: { en: 'Start pen, by the 10 km time you expect', ko: 'Start pen, by the 10 km time you expect', ja: 'Start pen, by the 10 km time you expect' },
  name: { en: 'Full name', ko: 'Full name', ja: 'Full name' },
  email: { en: 'Email', ko: 'Email', ja: 'Email' },
  submit: { en: 'Pay €{price} and enter', ko: 'Pay €{price} and enter', ja: 'Pay €{price} and enter' },
  fine: {
    en: 'You can pass your place to another runner until {day} for €5. Entries are not refunded.',
    ko: 'You can pass your place to another runner until {day} for €5. Entries are not refunded.',
    ja: 'You can pass your place to another runner until {day} for €5. Entries are not refunded.',
  },
  penError: { en: 'Choose a start pen by the 10 km time you expect.', ko: 'Choose a start pen by the 10 km time you expect.', ja: 'Choose a start pen by the 10 km time you expect.' },
  nameError: {
    en: 'Write your full name as it should appear in the results.',
    ko: 'Write your full name as it should appear in the results.',
    ja: 'Write your full name as it should appear in the results.',
  },
  emailError: {
    en: 'Write the email address for your receipt, like name@example.nl.',
    ko: 'Write the email address for your receipt, like name@example.nl.',
    ja: 'Write the email address for your receipt, like name@example.nl.',
  },
  doneOne: { en: '{name}, you are in race {n} on {date}.', ko: '{name}, you are in race {n} on {date}.', ja: '{name}, you are in race {n} on {date}.' },
  doneThree: { en: '{name}, you are in races 2, 3 and 4.', ko: '{name}, you are in races 2, 3 and 4.', ja: '{name}, you are in races 2, 3 and 4.' },
  doneBody: {
    en: 'Start pen {pen}. The receipt for €{price} is on its way to {email}. Collect your bib and rear light in the City Hall courtyard from 19:30 on race night.',
    ko: 'Start pen {pen}. The receipt for €{price} is on its way to {email}. Collect your bib and rear light in the City Hall courtyard from 19:30 on race night.',
    ja: 'Start pen {pen}. The receipt for €{price} is on its way to {email}. Collect your bib and rear light in the City Hall courtyard from 19:30 on race night.',
  },
  again: { en: 'Enter another runner', ko: 'Enter another runner', ja: 'Enter another runner' },
} satisfies Record<string, Tri>;

const INCLUDED: Array<{ name: Tri; note: Tri }> = [
  {
    name: { en: 'Chip timing', ko: 'Chip timing', ja: 'Chip timing' },
    note: { en: 'Your time by text message within a minute of finishing.', ko: 'Your time by text message within a minute of finishing.', ja: 'Your time by text message within a minute of finishing.' },
  },
  {
    name: { en: 'A clip-on rear light', ko: 'A clip-on rear light', ja: 'A clip-on rear light' },
    note: { en: 'It comes with your bib. Every runner wears one after dark.', ko: 'It comes with your bib. Every runner wears one after dark.', ja: 'It comes with your bib. Every runner wears one after dark.' },
  },
  {
    name: { en: 'Long-sleeve finisher shirt', ko: 'Long-sleeve finisher shirt', ja: 'Long-sleeve finisher shirt' },
    note: { en: 'Handed out in the City Hall courtyard.', ko: 'Handed out in the City Hall courtyard.', ja: 'Handed out in the City Hall courtyard.' },
  },
  {
    name: { en: 'Bag drop', ko: 'Bag drop', ja: 'Bag drop' },
    note: { en: 'In the City Hall courtyard from 19:30.', ko: 'In the City Hall courtyard from 19:30.', ja: 'In the City Hall courtyard from 19:30.' },
  },
  {
    name: { en: 'Hot soup and tea', ko: 'Hot soup and tea', ja: 'Hot soup and tea' },
    note: { en: 'At the finish until 23:00.', ko: 'At the finish until 23:00.', ja: 'At the finish until 23:00.' },
  },
  {
    name: { en: 'Free metro and tram', ko: 'Free metro and tram', ja: 'Free metro and tram' },
    note: { en: 'Across Rotterdam from 18:00 to 02:00 with your bib.', ko: 'Across Rotterdam from 18:00 to 02:00 with your bib.', ja: 'Across Rotterdam from 18:00 to 02:00 with your bib.' },
  },
];

type ListId = 'overall' | 'women' | 'men';
const LIST_IDS: ListId[] = ['overall', 'women', 'men'];

const RESULTS = {
  title: { en: 'Race 1 results', ko: 'Race 1 results', ja: 'Race 1 results' },
  note: {
    en: 'Friday 13 November, 1,431 finishers. It was 7 °C and dry at the start.',
    ko: 'Friday 13 November, 1,431 finishers. It was 7 °C and dry at the start.',
    ja: 'Friday 13 November, 1,431 finishers. It was 7 °C and dry at the start.',
  },
  tabs: { en: 'Show results for', ko: 'Show results for', ja: 'Show results for' },
  overall: { en: 'Overall', ko: 'Overall', ja: 'Overall' },
  women: { en: 'Women', ko: 'Women', ja: 'Women' },
  men: { en: 'Men', ko: 'Men', ja: 'Men' },
  find: { en: 'Find a runner', ko: 'Find a runner', ja: 'Find a runner' },
  placeholder: { en: 'Bib or name', ko: 'Bib or name', ja: 'Bib or name' },
  place: { en: 'Place', ko: 'Place', ja: 'Place' },
  bib: { en: 'Bib', ko: 'Bib', ja: 'Bib' },
  runner: { en: 'Runner', ko: 'Runner', ja: 'Runner' },
  split: { en: '5 km', ko: '5 km', ja: '5 km' },
  time: { en: 'Time', ko: 'Time', ja: 'Time' },
  behind: { en: 'Behind', ko: 'Behind', ja: 'Behind' },
  noClub: { en: 'No club', ko: 'No club', ja: 'No club' },
  women_: { en: 'women {from} to {to}', ko: 'women {from} to {to}', ja: 'women {from} to {to}' },
  men_: { en: 'men {from} to {to}', ko: 'men {from} to {to}', ja: 'men {from} to {to}' },
  captionOverall: { en: 'Race 1, the overall top ten', ko: 'Race 1, the overall top ten', ja: 'Race 1, the overall top ten' },
  captionWomen: { en: 'Race 1, the top ten women', ko: 'Race 1, the top ten women', ja: 'Race 1, the top ten women' },
  captionMen: { en: 'Race 1, the top ten men', ko: 'Race 1, the top ten men', ja: 'Race 1, the top ten men' },
  matchOne: { en: 'One runner matches “{q}”.', ko: 'One runner matches “{q}”.', ja: 'One runner matches “{q}”.' },
  matchMany: { en: '{n} runners match “{q}”.', ko: '{n} runners match “{q}”.', ja: '{n} runners match “{q}”.' },
  emptyOverall: { en: 'No runner in the overall top ten matches “{q}”.', ko: 'No runner in the overall top ten matches “{q}”.', ja: 'No runner in the overall top ten matches “{q}”.' },
  emptyWomen: { en: 'None of the top ten women matches “{q}”.', ko: 'None of the top ten women matches “{q}”.', ja: 'None of the top ten women matches “{q}”.' },
  emptyMen: { en: 'None of the top ten men matches “{q}”.', ko: 'None of the top ten men matches “{q}”.', ja: 'None of the top ten men matches “{q}”.' },
  emptyHelp: {
    en: 'Search by bib number or by name. Every finisher has their own time in the results email of 14 November.',
    ko: 'Search by bib number or by name. Every finisher has their own time in the results email of 14 November.',
    ja: 'Search by bib number or by name. Every finisher has their own time in the results email of 14 November.',
  },
  clear: { en: 'Clear search', ko: 'Clear search', ja: 'Clear search' },
  cleared: { en: 'Showing all ten runners again.', ko: 'Showing all ten runners again.', ja: 'Showing all ten runners again.' },
  more: {
    en: 'The full list of 1,431 times with 5 km splits was emailed to every finisher on Saturday 14 November.',
    ko: 'The full list of 1,431 times with 5 km splits was emailed to every finisher on Saturday 14 November.',
    ja: 'The full list of 1,431 times with 5 km splits was emailed to every finisher on Saturday 14 November.',
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
    ko: 'Organised by Stichting Nachtloop Rotterdam with the City of Rotterdam.',
    ja: 'Organised by Stichting Nachtloop Rotterdam with the City of Rotterdam.',
  },
  closures: { en: 'Road closures', ko: 'Road closures', ja: 'Road closures' },
  closuresBody: {
    en: 'The Coolsingel, the Boompjes and the Erasmusbrug close to traffic from 20:15 to 22:45 on race nights.',
    ko: 'The Coolsingel, the Boompjes and the Erasmusbrug close to traffic from 20:15 to 22:45 on race nights.',
    ja: 'The Coolsingel, the Boompjes and the Erasmusbrug close to traffic from 20:15 to 22:45 on race nights.',
  },
  questions: { en: 'Questions', ko: 'Questions', ja: 'Questions' },
  questionsBody: {
    en: 'race@nightlap.nl, answered on weekdays within one working day.',
    ko: 'race@nightlap.nl, answered on weekdays within one working day.',
    ja: 'race@nightlap.nl, answered on weekdays within one working day.',
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

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_EN, ja: PROMPT_EN };

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
