import { Fragment, useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedConsoleLaunchPage.css';

// The launch-day page of Lomvi Aerospace: Kestrel-2 carries the sea-ice satellite
// Fjellrev-1 from Andøya, in the Console Launch style. B612 was drawn for cockpit
// displays and sets the headings, the reading and every figure; B612 Mono sets the
// labels an operator scans (units, column heads, axes, call signs on the lamps).
// Components come from the control room: the countdown clock, the launch window with
// a "now" line, weather against its limits, the go/no-go poll board, the ascent
// profile and the pad telemetry held at zero. Emerald marks "go" and nothing else;
// a hold is white with hatching. FusionShell is the shared style-page chrome.

type Tri = Record<Lang, string>;
type Zone = 'cet' | 'utc';

const COMPANY = 'Lomvi';
const COMPANY_REST = ' Aerospace';
const PLACE = 'Andøya';
const ZONE_NAME: Record<Zone, string> = { cet: 'CET', utc: 'UTC' };
const ZONES: Zone[] = ['cet', 'utc'];

// Every time on the page is kept in seconds after midnight, Central European Time
// (Norway in November), and shown in the zone the reader picks.
const hms = (h: number, m: number, s = 0) => h * 3600 + m * 60 + s;
const START = hms(11, 57, 50);
const LIFTOFF = hms(12, 40);
const STRIP_FROM = hms(11, 30);
const STRIP_SPAN = hms(2, 30);
const INTERNAL_POWER = hms(12, 30);

const pad = (n: number) => String(n).padStart(2, '0');

function wall(seconds: number, zone: Zone, withSeconds = false) {
  const s = seconds - (zone === 'utc' ? 3600 : 0);
  const text = `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}`;
  return withSeconds ? `${text}:${pad(s % 60)}` : text;
}

const parse = (clock: string) => {
  const [h, m, s = 0] = clock.split(':').map(Number);
  return hms(h, m, s);
};

const countText = (left: number) => `T-${pad(Math.floor(left / 3600))}:${pad(Math.floor((left % 3600) / 60))}:${pad(left % 60)}`;

// The count runs on the real clock from the moment the page opened, and stops at liftoff.
const liveNow = (openedAt: number) => Math.min(LIFTOFF, START + Math.floor((Date.now() - openedAt) / 1000));

// Fills {key} placeholders. A key with no value is left in place for a later step.
const fill = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));

// Sets the {lead} of a sentence in bold.
function lead(text: string, bold: string): ReactNode[] {
  return text.split('{lead}').flatMap((part, index) => (index === 0 ? keep(part, 'a') : [<b key={`lead-${index}`}>{bold}</b>, ...keep(part, `b${index}-`)]));
}

// Names and count times stay on one line: Kestrel-2, Fjellrev-1, T-15, T+09:50.
const NOBREAK = /(Kestrel-2|Fjellrev-1|T[-+]\d+(?::\d\d)*)/;
function keep(text: string, prefix = ''): ReactNode[] {
  return text.split(NOBREAK).map((part, index) => (index % 2 ? <span className="kl-nw" key={`${prefix}${index}`}>{part}</span> : part));
}

const HEAD = {
  nav: { en: 'Launch day', ko: 'Launch day', ja: 'Launch day' },
  poll: { en: 'Go/no-go poll', ko: 'Go/no-go poll', ja: 'Go/no-go poll' },
  flight: { en: 'Flight', ko: 'Flight', ja: 'Flight' },
  tele: { en: 'Telemetry', ko: 'Telemetry', ja: 'Telemetry' },
  alerts: { en: 'Launch alerts', ko: 'Launch alerts', ja: 'Launch alerts' },
  watch: { en: 'Watch live', ko: 'Watch live', ja: 'Watch live' },
} satisfies Record<string, Tri>;

const HERO = {
  title: { en: 'Kestrel-2 launches Fjellrev-1 from Andøya at {time} today', ko: 'Kestrel-2 launches Fjellrev-1 from Andøya at {time} today', ja: 'Kestrel-2 launches Fjellrev-1 from Andøya at {time} today' },
  lede: {
    en: 'Flight 4 lifts off from the Nordmela pad in northern Norway and carries a sea-ice satellite to a 520 km polar orbit.',
    ko: 'Flight 4 lifts off from the Nordmela pad in northern Norway and carries a sea-ice satellite to a 520 km polar orbit.',
    ja: 'Flight 4 lifts off from the Nordmela pad in northern Norway and carries a sea-ice satellite to a 520 km polar orbit.',
  },
} satisfies Record<string, Tri>;

const COUNT = {
  head: { en: 'Liftoff Saturday 21 November, {time}', ko: 'Liftoff Saturday 21 November, {time}', ja: 'Liftoff Saturday 21 November, {time}' },
  running: { en: 'Clock running', ko: 'Clock running', ja: 'Clock running' },
  paused: { en: 'Paused on this page', ko: 'Paused on this page', ja: 'Paused on this page' },
  liftoff: { en: 'Liftoff', ko: 'Liftoff', ja: 'Liftoff' },
  pause: { en: 'Pause', ko: 'Pause', ja: 'Pause' },
  resume: { en: 'Resume', ko: 'Resume', ja: 'Resume' },
  timer: { en: 'T minus {h} hours, {m} minutes, {s} seconds', ko: 'T minus {h} hours, {m} minutes, {s} seconds', ja: 'T minus {h} hours, {m} minutes, {s} seconds' },
  h: { en: 'h', ko: 'h', ja: 'h' },
  min: { en: 'min', ko: 'min', ja: 'min' },
  s: { en: 's', ko: 's', ja: 's' },
  status: {
    en: 'Counting. Range and weather on hold until the T-15 poll.',
    ko: 'Counting. Range and weather on hold until the T-15 poll.',
    ja: 'Counting. Range and weather on hold until the T-15 poll.',
  },
  pausedNews: {
    en: 'Clock paused on this page at {count}. The count goes on at the pad.',
    ko: 'Clock paused on this page at {count}. The count goes on at the pad.',
    ja: 'Clock paused on this page at {count}. The count goes on at the pad.',
  },
  resumedNews: { en: 'Clock live again at {count}.', ko: 'Clock live again at {count}.', ja: 'Clock live again at {count}.' },
} satisfies Record<string, Tri>;

const SEQ_TEXT = {
  title: { en: 'The rest of the count', ko: 'The rest of the count', ja: 'The rest of the count' },
  next: { en: 'next', ko: 'next', ja: 'next' },
} satisfies Record<string, Tri>;

const SEQ: Array<{ count: string; at: string; what: Tri }> = [
  { count: 'T-30:00', at: '12:10', what: { en: 'Live stream starts', ko: 'Live stream starts', ja: 'Live stream starts' } },
  { count: 'T-15:00', at: '12:25', what: { en: 'Final go/no-go poll', ko: 'Final go/no-go poll', ja: 'Final go/no-go poll' } },
  { count: 'T-10:00', at: '12:30', what: { en: 'Rocket switches to internal power', ko: 'Rocket switches to internal power', ja: 'Rocket switches to internal power' } },
  { count: 'T-04:00', at: '12:36', what: { en: 'Tanks pressurised for flight', ko: 'Tanks pressurised for flight', ja: 'Tanks pressurised for flight' } },
  { count: 'T-01:00', at: '12:39', what: { en: 'Flight computer takes over the count', ko: 'Flight computer takes over the count', ja: 'Flight computer takes over the count' } },
  { count: 'T-00:00', at: '12:40', what: { en: 'Liftoff', ko: 'Liftoff', ja: 'Liftoff' } },
];

const WINDOW = {
  title: { en: 'Launch window', ko: 'Launch window', ja: 'Launch window' },
  zone: { en: 'Time zone for every time on this page', ko: 'Time zone for every time on this page', ja: 'Time zone for every time on this page' },
  to: { en: 'to', ko: 'to', ja: 'to' },
  note: { en: '72 minutes. A hold moves liftoff later inside the window.', ko: '72 minutes. A hold moves liftoff later inside the window.', ja: '72 minutes. A hold moves liftoff later inside the window.' },
  now: { en: 'Now', ko: 'Now', ja: 'Now' },
  window: { en: 'Window', ko: 'Window', ja: 'Window' },
  backup: { en: 'Backup', ko: 'Backup', ja: 'Backup' },
  backupDay: { en: 'Sunday 22 November, {range}', ko: 'Sunday 22 November, {range}', ja: 'Sunday 22 November, {range}' },
  range: { en: '{from} to {to}', ko: '{from} to {to}', ja: '{from} to {to}' },
  newsCet: { en: 'Times are now shown in Central European Time.', ko: 'Times are now shown in Central European Time.', ja: 'Times are now shown in Central European Time.' },
  newsUtc: { en: 'Times are now shown in UTC.', ko: 'Times are now shown in UTC.', ja: 'Times are now shown in UTC.' },
} satisfies Record<string, Tri>;

const TICKS = ['11:30', '12:00', '12:30', '13:00', '13:30', '14:00'];

const WX = {
  title: { en: 'Weather at the pad', ko: 'Weather at the pad', ja: 'Weather at the pad' },
  hold: { en: 'HOLD', ko: 'HOLD', ja: 'HOLD' },
};

const WX_ROWS: Array<{ name: Tri; value: Tri; hold?: boolean; limit?: { share: number; label: Tri } }> = [
  {
    name: { en: 'Ground wind', ko: 'Ground wind', ja: 'Ground wind' },
    value: { en: '7 m/s, gusts 11', ko: '7 m/s, gusts 11', ja: '7 m/s, gusts 11' },
    limit: { share: 73, label: { en: 'limit 15', ko: 'limit 15', ja: 'limit 15' } },
  },
  {
    name: { en: 'Wind shear at 11 km', ko: 'Wind shear at 11 km', ja: 'Wind shear at 11 km' },
    value: { en: '92%', ko: '92%', ja: '92%' },
    hold: true,
    limit: { share: 92, label: { en: 'of limit', ko: 'of limit', ja: 'of limit' } },
  },
  { name: { en: 'Cloud ceiling', ko: 'Cloud ceiling', ja: 'Cloud ceiling' }, value: { en: '1,200 m', ko: '1,200 m', ja: '1,200 m' } },
  { name: { en: 'Air temperature', ko: 'Air temperature', ja: 'Air temperature' }, value: { en: '-3 °C', ko: '-3 °C', ja: '-3 °C' } },
  { name: { en: 'Lightning', ko: 'Lightning', ja: 'Lightning' }, value: { en: 'None in 40 km', ko: 'None in 40 km', ja: 'None in 40 km' } },
];

const POLL = {
  title: { en: 'Go/no-go poll', ko: 'Go/no-go poll', ja: 'Go/no-go poll' },
  lede: {
    en: 'Launch director Ingrid Solheim polled the eight stations at {a}, T-45 minutes. Liftoff needs all eight to answer go. The next poll is at {b}. Open a station for its full note.',
    ko: 'Launch director Ingrid Solheim polled the eight stations at {a}, T-45 minutes. Liftoff needs all eight to answer go. The next poll is at {b}. Open a station for its full note.',
    ja: 'Launch director Ingrid Solheim polled the eight stations at {a}, T-45 minutes. Liftoff needs all eight to answer go. The next poll is at {b}. Open a station for its full note.',
  },
  tally: { en: 'of {n} stations go', ko: 'of {n} stations go', ja: 'of {n} stations go' },
  station: { en: 'Station', ko: 'Station', ja: 'Station' },
  console: { en: 'Console', ko: 'Console', ja: 'Console' },
  answer: { en: 'Answer', ko: 'Answer', ja: 'Answer' },
  note: { en: 'Note', ko: 'Note', ja: 'Note' },
  go: { en: 'GO', ko: 'GO', ja: 'GO' },
  hold: { en: 'HOLD', ko: 'HOLD', ja: 'HOLD' },
} satisfies Record<string, Tri>;

interface Station {
  call: string;
  name: Tri;
  who: string;
  hold: boolean;
  note: Tri;
  /** The rest of the station's report, shown when the row is opened. Times are {a}, {b}, ... */
  more: Tri;
  times: Record<string, string>;
}

const STATIONS: Station[] = [
  {
    call: 'PROP',
    name: { en: 'Propulsion', ko: 'Propulsion', ja: 'Propulsion' },
    who: 'Henrik Dahl',
    hold: false,
    note: { en: 'Oxygen and propane loaded. Topping the second-stage oxygen at 0.4 kg/s.', ko: 'Oxygen and propane loaded. Topping the second-stage oxygen at 0.4 kg/s.', ja: 'Oxygen and propane loaded. Topping the second-stage oxygen at 0.4 kg/s.' },
    more: {
      en: 'Loading finished at {a}. Oxygen boils off on the pad, so the second stage is topped up until T-2 minutes and stands at 99.6% now. Tank pressures are 3.4 and 2.9 bar, inside their limits.',
      ko: 'Loading finished at {a}. Oxygen boils off on the pad, so the second stage is topped up until T-2 minutes and stands at 99.6% now. Tank pressures are 3.4 and 2.9 bar, inside their limits.',
      ja: 'Loading finished at {a}. Oxygen boils off on the pad, so the second stage is topped up until T-2 minutes and stands at 99.6% now. Tank pressures are 3.4 and 2.9 bar, inside their limits.',
    },
    times: { a: '11:41' },
  },
  {
    call: 'AVI',
    name: { en: 'Avionics', ko: 'Avionics', ja: 'Avionics' },
    who: 'Marte Lie',
    hold: false,
    note: { en: 'Flight computer switches to internal power at T-10.', ko: 'Flight computer switches to internal power at T-10.', ja: 'Flight computer switches to internal power at T-10.' },
    more: {
      en: 'The flight battery reads 28.9 V on the ground charger. The flight computer has run its full self-test twice today without a fault, the last one at {a}.',
      ko: 'The flight battery reads 28.9 V on the ground charger. The flight computer has run its full self-test twice today without a fault, the last one at {a}.',
      ja: 'The flight battery reads 28.9 V on the ground charger. The flight computer has run its full self-test twice today without a fault, the last one at {a}.',
    },
    times: { a: '11:20' },
  },
  {
    call: 'GNC',
    name: { en: 'Guidance', ko: 'Guidance', ja: 'Guidance' },
    who: 'Jonas Berg',
    hold: false,
    note: { en: 'Targeting file 4C loaded for {a}.', ko: 'Targeting file 4C loaded for {a}.', ja: 'Targeting file 4C loaded for {a}.' },
    more: {
      en: 'File 4C steers to a 520 km polar orbit for a liftoff on the second. If a hold moves liftoff later, the files for every later minute up to {b} are loaded as well.',
      ko: 'File 4C steers to a 520 km polar orbit for a liftoff on the second. If a hold moves liftoff later, the files for every later minute up to {b} are loaded as well.',
      ja: 'File 4C steers to a 520 km polar orbit for a liftoff on the second. If a hold moves liftoff later, the files for every later minute up to {b} are loaded as well.',
    },
    times: { a: '12:40:00', b: '13:52' },
  },
  {
    call: 'GSE',
    name: { en: 'Ground systems', ko: 'Ground systems', ja: 'Ground systems' },
    who: 'Sara Nygaard',
    hold: false,
    note: { en: 'Umbilicals and pad water deluge armed.', ko: 'Umbilicals and pad water deluge armed.', ja: 'Umbilicals and pad water deluge armed.' },
    more: {
      en: 'The tower tank holds 180 tonnes of water for the deluge. The pad was cleared of staff at {a} and the road gate at Nordmela is closed.',
      ko: 'The tower tank holds 180 tonnes of water for the deluge. The pad was cleared of staff at {a} and the road gate at Nordmela is closed.',
      ja: 'The tower tank holds 180 tonnes of water for the deluge. The pad was cleared of staff at {a} and the road gate at Nordmela is closed.',
    },
    times: { a: '11:15' },
  },
  {
    call: 'WX',
    name: { en: 'Weather', ko: 'Weather', ja: 'Weather' },
    who: 'Ola Haug',
    hold: true,
    note: { en: 'Wind shear at 11 km is 92% of the limit and rising.', ko: 'Wind shear at 11 km is 92% of the limit and rising.', ja: 'Wind shear at 11 km is 92% of the limit and rising.' },
    more: {
      en: 'The balloon at {a} read 85% of the limit and the one at {b} read 92%. The next goes up at {c}, and its reading comes in before the {d} poll. Ground wind, cloud and lightning are inside their limits.',
      ko: 'The balloon at {a} read 85% of the limit and the one at {b} read 92%. The next goes up at {c}, and its reading comes in before the {d} poll. Ground wind, cloud and lightning are inside their limits.',
      ja: 'The balloon at {a} read 85% of the limit and the one at {b} read 92%. The next goes up at {c}, and its reading comes in before the {d} poll. Ground wind, cloud and lightning are inside their limits.',
    },
    times: { a: '10:30', b: '11:30', c: '12:05', d: '12:25' },
  },
  {
    call: 'PL',
    name: { en: 'Payload', ko: 'Payload', ja: 'Payload' },
    who: 'Aiko Tanaka',
    hold: false,
    note: { en: 'Fjellrev-1 on its own battery, charged to 98%.', ko: 'Fjellrev-1 on its own battery, charged to 98%.', ja: 'Fjellrev-1 on its own battery, charged to 98%.' },
    more: {
      en: 'Fjellrev-1 went to its own battery at {a}. It stays switched off, apart from its heaters, until it leaves the second stage at T+09:50.',
      ko: 'Fjellrev-1 went to its own battery at {a}. It stays switched off, apart from its heaters, until it leaves the second stage at T+09:50.',
      ja: 'Fjellrev-1 went to its own battery at {a}. It stays switched off, apart from its heaters, until it leaves the second stage at T+09:50.',
    },
    times: { a: '11:50' },
  },
  {
    call: 'TRK',
    name: { en: 'Tracking', ko: 'Tracking', ja: 'Tracking' },
    who: 'Elias Moen',
    hold: false,
    note: { en: 'Antennas on Andøya and Svalbard locked on the vehicle.', ko: 'Antennas on Andøya and Svalbard locked on the vehicle.', ja: 'Antennas on Andøya and Svalbard locked on the vehicle.' },
    more: {
      en: 'Andøya follows Kestrel-2 from liftoff, and Svalbard takes over about six minutes in as the second stage climbs north. Both stations recorded a clean test signal at {a}.',
      ko: 'Andøya follows Kestrel-2 from liftoff, and Svalbard takes over about six minutes in as the second stage climbs north. Both stations recorded a clean test signal at {a}.',
      ja: 'Andøya follows Kestrel-2 from liftoff, and Svalbard takes over about six minutes in as the second stage climbs north. Both stations recorded a clean test signal at {a}.',
    },
    times: { a: '11:45' },
  },
  {
    call: 'RSO',
    name: { en: 'Range safety', ko: 'Range safety', ja: 'Range safety' },
    who: 'Kari Strand',
    hold: true,
    note: { en: 'A fishing boat is inside hazard area B, 14 km off Bleik.', ko: 'A fishing boat is inside hazard area B, 14 km off Bleik.', ja: 'A fishing boat is inside hazard area B, 14 km off Bleik.' },
    more: {
      en: 'The coast guard has spoken to the skipper and the boat is heading south at 9 knots. It should be out by {a}. Hazard areas A and C are clear, and the airspace closed at {b}.',
      ko: 'The coast guard has spoken to the skipper and the boat is heading south at 9 knots. It should be out by {a}. Hazard areas A and C are clear, and the airspace closed at {b}.',
      ja: 'The coast guard has spoken to the skipper and the boat is heading south at 9 knots. It should be out by {a}. Hazard areas A and C are clear, and the airspace closed at {b}.',
    },
    times: { a: '12:20', b: '11:00' },
  },
];

const FLIGHT = {
  title: { en: 'From liftoff to payload separation', ko: 'From liftoff to payload separation', ja: 'From liftoff to payload separation' },
  lede: {
    en: 'Kestrel-2 flies north-west over the Norwegian Sea. Fjellrev-1 leaves the second stage 9 minutes 50 seconds after liftoff, 521 km up.',
    ko: 'Kestrel-2 flies north-west over the Norwegian Sea. Fjellrev-1 leaves the second stage 9 minutes 50 seconds after liftoff, 521 km up.',
    ja: 'Kestrel-2 flies north-west over the Norwegian Sea. Fjellrev-1 leaves the second stage 9 minutes 50 seconds after liftoff, 521 km up.',
  },
  plot: {
    en: 'Altitude against time after liftoff. The climb is steep for the first three minutes, then levels off into a 520 km orbit by T+08:40. Every flight event is listed in the table below.',
    ko: 'Altitude against time after liftoff. The climb is steep for the first three minutes, then levels off into a 520 km orbit by T+08:40. Every flight event is listed in the table below.',
    ja: 'Altitude against time after liftoff. The climb is steep for the first three minutes, then levels off into a 520 km orbit by T+08:40. Every flight event is listed in the table below.',
  },
  minutes: { en: '11 min', ko: '11 min', ja: '11 min' },
  time: { en: 'Time', ko: 'Time', ja: 'Time' },
  event: { en: 'Event', ko: 'Event', ja: 'Event' },
  altitude: { en: 'Altitude', ko: 'Altitude', ja: 'Altitude' },
  speed: { en: 'Speed', ko: 'Speed', ja: 'Speed' },
} satisfies Record<string, Tri>;

type LabelSide = 'up' | 'below' | 'upleft' | 'down';

interface FlightEvent {
  time: string;
  name: Tri;
  note: Tri;
  altitude: string;
  speed: string;
  /** Seconds after liftoff and kilometres up, for the marker on the profile. */
  mark?: { t: number; km: number; label?: LabelSide };
  go?: boolean;
}

const EVENTS: FlightEvent[] = [
  {
    time: 'T+00:00',
    name: { en: 'Liftoff', ko: 'Liftoff', ja: 'Liftoff' },
    note: { en: 'The five first-stage engines reach full thrust and the hold-down clamps let go.', ko: 'The five first-stage engines reach full thrust and the hold-down clamps let go.', ja: 'The five first-stage engines reach full thrust and the hold-down clamps let go.' },
    altitude: '0 km',
    speed: '0 m/s',
    mark: { t: 0, km: 0 },
  },
  {
    time: 'T+00:11',
    name: { en: 'Clears the tower', ko: 'Clears the tower', ja: 'Clears the tower' },
    note: { en: 'Kestrel-2 rolls onto its north-west heading.', ko: 'Kestrel-2 rolls onto its north-west heading.', ja: 'Kestrel-2 rolls onto its north-west heading.' },
    altitude: '0.1 km',
    speed: '31 m/s',
  },
  {
    time: 'T+00:58',
    name: { en: 'Max-Q', ko: 'Max-Q', ja: 'Max-Q' },
    note: { en: 'The highest air pressure on the vehicle in flight, 41 kPa.', ko: 'The highest air pressure on the vehicle in flight, 41 kPa.', ja: 'The highest air pressure on the vehicle in flight, 41 kPa.' },
    altitude: '11 km',
    speed: '410 m/s',
    mark: { t: 58, km: 11, label: 'up' },
  },
  {
    time: 'T+02:24',
    name: { en: 'First-stage cutoff', ko: 'First-stage cutoff', ja: 'First-stage cutoff' },
    note: { en: 'All five engines shut down together.', ko: 'All five engines shut down together.', ja: 'All five engines shut down together.' },
    altitude: '68 km',
    speed: '2,310 m/s',
    mark: { t: 144, km: 68 },
  },
  {
    time: 'T+02:28',
    name: { en: 'Stage separation', ko: 'Stage separation', ja: 'Stage separation' },
    note: { en: 'The first stage falls into the sea 380 km downrange.', ko: 'The first stage falls into the sea 380 km downrange.', ja: 'The first stage falls into the sea 380 km downrange.' },
    altitude: '71 km',
    speed: '2,300 m/s',
    mark: { t: 148, km: 71, label: 'below' },
  },
  {
    time: 'T+02:32',
    name: { en: 'Second-stage ignition', ko: 'Second-stage ignition', ja: 'Second-stage ignition' },
    note: { en: 'One vacuum engine burns for six minutes.', ko: 'One vacuum engine burns for six minutes.', ja: 'One vacuum engine burns for six minutes.' },
    altitude: '74 km',
    speed: '2,295 m/s',
  },
  {
    time: 'T+03:05',
    name: { en: 'Fairing separation', ko: 'Fairing separation', ja: 'Fairing separation' },
    note: { en: 'The two halves of the nose fall away above the air.', ko: 'The two halves of the nose fall away above the air.', ja: 'The two halves of the nose fall away above the air.' },
    altitude: '112 km',
    speed: '2,520 m/s',
    mark: { t: 185, km: 112, label: 'upleft' },
  },
  {
    time: 'T+08:40',
    name: { en: 'Second-stage cutoff', ko: 'Second-stage cutoff', ja: 'Second-stage cutoff' },
    note: { en: 'Kestrel-2 is in a 520 km polar orbit.', ko: 'Kestrel-2 is in a 520 km polar orbit.', ja: 'Kestrel-2 is in a 520 km polar orbit.' },
    altitude: '520 km',
    speed: '7,610 m/s',
    mark: { t: 520, km: 520, label: 'down' },
  },
  {
    time: 'T+09:50',
    name: { en: 'Fjellrev-1 separates', ko: 'Fjellrev-1 separates', ja: 'Fjellrev-1 separates' },
    note: { en: 'Springs push the satellite off its adapter at 0.6 m/s.', ko: 'Springs push the satellite off its adapter at 0.6 m/s.', ja: 'Springs push the satellite off its adapter at 0.6 m/s.' },
    altitude: '521 km',
    speed: '7,612 m/s',
    mark: { t: 590, km: 521, label: 'upleft' },
    go: true,
  },
  {
    time: 'T+10:20',
    name: { en: 'Rideshare release', ko: 'Rideshare release', ja: 'Rideshare release' },
    note: { en: 'Two small satellites built by a student team in Tromsø.', ko: 'Two small satellites built by a student team in Tromsø.', ja: 'Two small satellites built by a student team in Tromsø.' },
    altitude: '521 km',
    speed: '7,612 m/s',
    mark: { t: 620, km: 521 },
  },
];

// The ascent as the profile draws it: 660 s across, 600 km up, with y counted from the top.
const ASCENT_PATH =
  'M0 600 L11 599.9 L30 598 L45 594 L58 589 L75 581 L90 572 L105 562 L120 552 L135 540 L144 532 L148 529 L152 526 L170 507 L185 488 L210 450 L240 400 L270 348 L300 300 L330 255 L360 215 L390 180 L420 150 L450 124 L480 104 L500 91 L520 80 L560 79.2 L660 79';
const Y_MARKS = [
  { km: '600', top: '0%' },
  { km: '400', top: '33.33%' },
  { km: '200', top: '66.67%' },
  { km: '0', top: '100%' },
];
const X_MARKS = ['T+0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

const TELE = {
  title: { en: 'Telemetry from the pad', ko: 'Telemetry from the pad', ja: 'Telemetry from the pad' },
  lede: {
    en: 'Mission time, altitude, speed and distance stay at zero until the clamps let go, then update ten times a second. Tank levels, pressures and power are live now, read over the pad cable.',
    ko: 'Mission time, altitude, speed and distance stay at zero until the clamps let go, then update ten times a second. Tank levels, pressures and power are live now, read over the pad cable.',
    ja: 'Mission time, altitude, speed and distance stay at zero until the clamps let go, then update ten times a second. Tank levels, pressures and power are live now, read over the pad cable.',
  },
  link: { en: 'Kestrel-2 downlink, 2.25 GHz', ko: 'Kestrel-2 downlink, 2.25 GHz', ja: 'Kestrel-2 downlink, 2.25 GHz' },
  locked: { en: 'Locked, updated {t}', ko: 'Locked, updated {t}', ja: 'Locked, updated {t}' },
  mission: { en: 'Mission time', ko: 'Mission time', ja: 'Mission time' },
  altitude: { en: 'Altitude', ko: 'Altitude', ja: 'Altitude' },
  speed: { en: 'Speed', ko: 'Speed', ja: 'Speed' },
  downrange: { en: 'Downrange', ko: 'Downrange', ja: 'Downrange' },
  tanks: { en: 'Propellant tanks', ko: 'Propellant tanks', ja: 'Propellant tanks' },
} satisfies Record<string, Tri>;

const GAUGES: Array<{ name: Tri; value: string; topping?: boolean }> = [
  { name: { en: 'Stage 1 oxygen', ko: 'Stage 1 oxygen', ja: 'Stage 1 oxygen' }, value: '100%' },
  { name: { en: 'Stage 1 propane', ko: 'Stage 1 propane', ja: 'Stage 1 propane' }, value: '100%' },
  { name: { en: 'Stage 2 oxygen', ko: 'Stage 2 oxygen', ja: 'Stage 2 oxygen' }, value: '99.6%', topping: true },
  { name: { en: 'Stage 2 propane', ko: 'Stage 2 propane', ja: 'Stage 2 propane' }, value: '100%' },
];

const PAD = {
  stage1: { en: 'Stage 1 tank pressure', ko: 'Stage 1 tank pressure', ja: 'Stage 1 tank pressure' },
  stage2: { en: 'Stage 2 tank pressure', ko: 'Stage 2 tank pressure', ja: 'Stage 2 tank pressure' },
  battery: { en: 'Flight battery', ko: 'Flight battery', ja: 'Flight battery' },
  satellites: { en: 'Navigation satellites', ko: 'Navigation satellites', ja: 'Navigation satellites' },
  inView: { en: '14 in view', ko: '14 in view', ja: '14 in view' },
  power: { en: 'Power source', ko: 'Power source', ja: 'Power source' },
  ground: { en: 'Ground', ko: 'Ground', ja: 'Ground' },
  internal: { en: 'Internal', ko: 'Internal', ja: 'Internal' },
} satisfies Record<string, Tri>;

const WATCH = {
  title: { en: 'Where to watch', ko: 'Where to watch', ja: 'Where to watch' },
  lede: {
    en: 'In late November the sun stays low over Andøya all day, so the flame shows from far off. Dress for wind and -3 °C.',
    ko: 'In late November the sun stays low over Andøya all day, so the flame shows from far off. Dress for wind and -3 °C.',
    ja: 'In late November the sun stays low over Andøya all day, so the flame shows from far off. Dress for wind and -3 °C.',
  },
  from: { en: 'from {t}', ko: 'from {t}', ja: 'from {t}' },
} satisfies Record<string, Tri>;

const PLACES: Array<{ name: Tri; from: string; lead: Tri; text: Tri; times: Record<string, string> }> = [
  {
    name: { en: 'Live stream', ko: 'Live stream', ja: 'Live stream' },
    from: '12:10',
    lead: { en: 'lomvi.space/live', ko: 'lomvi.space/live', ja: 'lomvi.space/live' },
    text: {
      en: '{lead}, in Norwegian and English. It stays on until Fjellrev-1 sends its first signal, about 50 minutes after liftoff.',
      ko: '{lead}, in Norwegian and English. It stays on until Fjellrev-1 sends its first signal, about 50 minutes after liftoff.',
      ja: '{lead}, in Norwegian and English. It stays on until Fjellrev-1 sends its first signal, about 50 minutes after liftoff.',
    },
    times: {},
  },
  {
    name: { en: 'Bleik harbour', ko: 'Bleik harbour', ja: 'Bleik harbour' },
    from: '10:00',
    lead: { en: '9 km south of the pad', ko: '9 km south of the pad', ja: '9 km south of the pad' },
    text: {
      en: '{lead}, the closest public place. Free. The coast road north of Bleik closes from {a} to {b}, so park in the village. You hear the engines 26 seconds after you see the flame.',
      ko: '{lead}, the closest public place. Free. The coast road north of Bleik closes from {a} to {b}, so park in the village. You hear the engines 26 seconds after you see the flame.',
      ja: '{lead}, the closest public place. Free. The coast road north of Bleik closes from {a} to {b}, so park in the village. You hear the engines 26 seconds after you see the flame.',
    },
    times: { a: '11:30', b: '14:30' },
  },
  {
    name: { en: 'Andenes harbour', ko: 'Andenes harbour', ja: 'Andenes harbour' },
    from: '11:30',
    lead: { en: '22 km north', ko: '22 km north', ja: '22 km north' },
    text: {
      en: '{lead}. Look south-west, low over the hills. The sound arrives about a minute after liftoff.',
      ko: '{lead}. Look south-west, low over the hills. The sound arrives about a minute after liftoff.',
      ja: '{lead}. Look south-west, low over the hills. The sound arrives about a minute after liftoff.',
    },
    times: {},
  },
];

const ALERTS = {
  title: { en: 'Launch alerts', ko: 'Launch alerts', ja: 'Launch alerts' },
  note: {
    en: 'Three emails at most: when the live stream starts at {a}, at liftoff, and if the launch moves to the backup day. We delete the address on 23 November.',
    ko: 'Three emails at most: when the live stream starts at {a}, at liftoff, and if the launch moves to the backup day. We delete the address on 23 November.',
    ja: 'Three emails at most: when the live stream starts at {a}, at liftoff, and if the launch moves to the backup day. We delete the address on 23 November.',
  },
  label: { en: 'Email', ko: 'Email', ja: 'Email' },
  submit: { en: 'Send me alerts', ko: 'Send me alerts', ja: 'Send me alerts' },
  empty: { en: 'Write the email address the alerts should go to.', ko: 'Write the email address the alerts should go to.', ja: 'Write the email address the alerts should go to.' },
  invalid: {
    en: 'This address is missing a part. It should look like name@example.no.',
    ko: 'This address is missing a part. It should look like name@example.no.',
    ja: 'This address is missing a part. It should look like name@example.no.',
  },
  doneTitle: { en: 'Alerts will go to {email}.', ko: 'Alerts will go to {email}.', ja: 'Alerts will go to {email}.' },
  doneBody: {
    en: 'The first one comes at {a}, when the live stream starts. Every email has a link that stops the rest.',
    ko: 'The first one comes at {a}, when the live stream starts. Every email has a link that stops the rest.',
    ja: 'The first one comes at {a}, when the live stream starts. Every email has a link that stops the rest.',
  },
  change: { en: 'Use another address', ko: 'Use another address', ja: 'Use another address' },
} satisfies Record<string, Tri>;

const FOOT = {
  company: { en: 'Lomvi Aerospace, Andenes, Norway', ko: 'Lomvi Aerospace, Andenes, Norway', ja: 'Lomvi Aerospace, Andenes, Norway' },
  cet: { en: 'All times are Central European Time', ko: 'All times are Central European Time', ja: 'All times are Central European Time' },
  utc: { en: 'All times are UTC', ko: 'All times are UTC', ja: 'All times are UTC' },
} satisfies Record<string, Tri>;

const PROMPT_EN = `Design one real page in the Console Launch style: a true-black control-room page in neutral greys, where one emerald marks "go" and nothing else.

Pick a believable subject that is read at a glance against a clock, such as a rocket launch day, a ferry crossing in weather or a marathon start, and write its real content. The page must read as that subject's page, never as a page about its own style. Here it is the launch-day page of Lomvi Aerospace: Kestrel-2 carries the sea-ice satellite Fjellrev-1 from Andøya, Norway, at 12:40 today. The countdown, the launch window, the weather against its limits, the go/no-go poll, the flight from liftoff to payload separation, the pad telemetry, where to watch and a launch-alert sign-up.

TOKENS:
--bg: #080808
--panel: #111111 (also the opaque surface for any menu that opens over the page)
--raise: #191919 (the empty track of a limit bar)
--ink: #ececec (headings, figures, the pressed time-zone key, the HOLD tag and answer, the form's button, the focus ring)
--text: #e2e2e2 (reading text)
--muted: #9c9c9c (labels, notes, units)
--dim: #626262 (the clock's colons and the telemetry still at zero, both large figures)
--line: #4c4c4c (panel borders, section rules, header rules)
--line-soft: #404040 (rows inside a panel or table)
--grid: #262626 (the profile's gridlines)
--fill: #c4c4c4 (the used part of a limit bar and the gauge segments)
--hold: #e6e6e6 (holds: a 4px edge, a hatch of 2px lines every 6px at -45deg, and the hold wash rgba(255,255,255,0.05))
--go: #10b981, --go-soft: #6ee7b7, --go-wash: rgba(16,185,129,0.16), dark text on go: #03140d

COLOUR:
- Emerald appears only on "go": the clock-running and downlink lamps, the square before the count's status, the GO answers and lamps, the launch window band and its label, the liftoff row, the payload separation event and the one "Watch live" action (#6ee7b7 on hover). No emerald headings, borders or gradients.
- A hold is white: a hatched lamp or bar, an ink HOLD tag, a white edge on the row. A form error uses the same white edge on the field and a hatched square before the message, never red. Pausing the page's clock turns its lamp into the hatched square.
- Text is light grey on black; muted text keeps at least 4.5:1. Structural lines are 1px solid #4c4c4c, rows inside them #404040; only the profile's gridlines are fainter. Square corners everywhere, no shadows, no glow.

TYPOGRAPHY:
Two families, both drawn for cockpit displays. B612 (400, 700) sets headings, reading and every figure, with tabular figures. B612 Mono (400, 700) sets what an operator scans: units, column heads, the profile's axes, the call signs on the lamps, the telemetry labels, the gauge captions (B612 on phones), the "next" and HOLD tags, the limits, the time-zone keys and the Pause key.
H1: B612 700, clamp(2.1rem, 3.8vw, 3.125rem), line-height 1.08, letter-spacing -0.02em.
H2: B612 700, clamp(1.75rem, 2.6vw, 2.25rem), line-height 1.15, letter-spacing -0.015em; panel titles 1.0625rem 700.
The countdown: B612 700 sized to its panel (container width / 5.6), line-height 0.9; the colons in --dim; units under each pair in B612 Mono 1rem.
The window times: B612 700 2.375rem. The tally: B612 700 5.25rem. Telemetry readouts: B612 700 clamp(2.4rem, 4.4vw, 3.6rem) in --dim, 2.25rem on phones.
Body: B612 400 at 1rem, line-height 1.6; section ledes 1.0625rem (1rem beside the headline and on phones). No text under 1rem, except the drawn labels of the window strip, the profile's axis numbers and the lamp call signs, which are hidden from assistive technology and said in text nearby, at 0.875rem. No letter-spaced capitals; call signs and GO/HOLD are written as operators write them, with no added tracking.

LAYOUT:
- The site's own bar: the company mark, four in-page links, the local time at the pad, and "Watch live" as the one emerald button.
- Hero on a 12-column grid: the H1 over eight columns with a one-sentence lede beside it; then the countdown panel (eight columns) beside the launch window panel (four), both in full on a 1280x800 laptop's first screen; under them "The rest of the count" beside the weather panel. Below 1080px the countdown takes the full width and the window and weather sit side by side; on phones everything stacks.
- Then the go/no-go poll, the flight, the telemetry, where to watch, launch alerts and a two-part footer. A 1120px column; each section opens on a 1px rule with 72px of space above and below its content (56px on phones).

COMPONENTS:
- Countdown: a panel whose head names liftoff (day and time with its zone), a "Clock running" lamp and a Pause key. The clock is T-hh:mm:ss, a role="timer" with a spoken label, and ticks every second from the real clock. Pause freezes the page's clock and says the count goes on at the pad; Resume shows the live count again. A one-line status sits under the clock.
- Launch window: the window times, a 150-minute strip with the window as a labelled emerald band and a labelled 2px "now" line that moves with the clock, hourly ticks, and the backup day. A CET/UTC switch (two keys with aria-pressed) changes every time on the page, including the header clock, the count's times, the notes, the watch list and the footer, and announces the change.
- The rest of the count: an ordered list of count time, clock time and event; the next event carries a small "next" tag and passed events turn muted.
- Weather: rows of reading against limit, with a thin bar and a 2px limit mark; the reading that holds the count has a HOLD tag and a hatched bar.
- Go/no-go poll: the tally of stations go with eight lamps, then a board of station, console, answer and note. Each station is a button (aria-expanded) that opens its full note under the short one. GO is emerald text on a 3px emerald edge; HOLD is an ink tag, and its row has a white edge and the hold wash.
- Flight: an altitude profile with square event markers and labels, then the same events as a table of time, event, altitude and speed. On phones the labels leave the profile and the table rows stack.
- Telemetry: big readouts held at zero in --dim, four tank gauges of 20 segments, and a list of pad readings; the power source turns from Ground to Internal at T-10.
- Launch alerts: one email field with a label, a solid ink button, an error under the field with role="alert", and a confirmation that replaces the form, takes focus and offers "Use another address".

MOTION:
- Only the clock-running lamp breathes, 2s. The digits change in place without animation. Hover changes colour in 120ms. prefers-reduced-motion stops the lamp and the transitions; the clock still counts.

FORBIDDEN:
- Cards, rounded corners, pills, chips, glass, glows, shadows, neon, scanlines, terminal green
- A small label above a heading, letter-spaced capitals, numbered section markers
- Blue, cyan, red or amber anywhere; emerald on anything that is not "go"
- Rocket illustrations, photographs, emoji, decorative icons
- Arrows on links, middle-dot meta strings, numbers on anything that is not a real sequence
- Copy about consoles, darkness or the design itself

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML: a timer, a toggle group for the zone, an ordered list for the count, a description list for the weather, tables with explicit roles for the poll, the flight and the watch list, a labelled form
3) A working countdown with Pause and Resume, the zone switch, the station notes and the alert form with error and success states
4) Responsive layout down to 320px with no horizontal scroll; every control at least 44px tall on phones
5) Visible focus on every control, a polite live region for the zone and pause changes, reduced-motion support`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_EN, ja: PROMPT_EN };

type EmailError = 'empty' | 'invalid' | null;

export function PortedConsoleLaunchPage({ lang }: PortedStylePageProps) {
  const [zone, setZone] = useState<Zone>('cet');
  const [now, setNow] = useState(START);
  const [paused, setPaused] = useState(false);
  const [news, setNews] = useState('');
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<EmailError>(null);
  const [subscribed, setSubscribed] = useState<string | null>(null);
  const openedAt = useRef<number | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const wasSubscribed = useRef(false);

  const t = (text: Tri) => text[lang];
  const at = (clock: string) => wall(parse(clock), zone, clock.length > 5);
  const timed = (text: Tri, times: Record<string, string>) =>
    fill(t(text), Object.fromEntries(Object.entries(times).map(([key, clock]) => [key, at(clock)])));

  // The clock reads the real time four times a second, so a slow tick never skips a second on screen.
  useEffect(() => {
    if (openedAt.current === null) openedAt.current = Date.now();
    if (paused) return undefined;
    const opened = openedAt.current;
    const id = window.setInterval(() => setNow(liveNow(opened)), 250);
    return () => window.clearInterval(id);
  }, [paused]);

  // The form and the confirmation replace each other; focus goes to what took the place.
  useEffect(() => {
    if (subscribed !== null) doneRef.current?.focus();
    else if (wasSubscribed.current) emailRef.current?.focus();
    wasSubscribed.current = subscribed !== null;
  }, [subscribed]);

  const left = LIFTOFF - now;
  const [hh, mm, ss] = [Math.floor(left / 3600), Math.floor((left % 3600) / 60), left % 60];
  const lifted = left <= 0;
  const nextEvent = SEQ.find((event) => parse(event.at) > now);
  const nowShare = Math.min(100, ((now - STRIP_FROM) / STRIP_SPAN) * 100);
  const goCount = STATIONS.filter((station) => !station.hold).length;

  const togglePause = () => {
    if (paused) {
      const live = liveNow(openedAt.current ?? Date.now());
      setNow(live);
      setPaused(false);
      setNews(fill(t(COUNT.resumedNews), { count: countText(LIFTOFF - live) }));
    } else {
      setPaused(true);
      setNews(fill(t(COUNT.pausedNews), { count: countText(left) }));
    }
  };

  const chooseZone = (next: Zone) => {
    if (next === zone) return;
    setZone(next);
    setNews(t(next === 'utc' ? WINDOW.newsUtc : WINDOW.newsCet));
  };

  const subscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();
    const error: EmailError = value === '' ? 'empty' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? null : 'invalid';
    if (error === null) {
      setEmailError(null);
      setSubscribed(value);
      return;
    }
    // The error renders first, so the field and its message can be brought clear of the fixed page bar.
    flushSync(() => setEmailError(error));
    emailRef.current?.focus();
    emailRef.current?.closest('form')?.scrollIntoView({ block: 'nearest' });
  };

  const lampClass = lifted ? 'kl-lamp' : paused ? 'kl-lamp kl-lamp--paused' : 'kl-lamp kl-lamp--live';
  const lampText = t(lifted ? COUNT.liftoff : paused ? COUNT.paused : COUNT.running);
  const zoneName = ZONE_NAME[zone];

  return (
    <FusionShell
      fusionId="console-launch"
      lang={lang}
      tone="dark"
      accent="#10b981"
      prev={{ href: '/pages/midnight-noir.html', label: 'Midnight Noir' }}
      next={{ href: '/pages/bento-bloom.html', label: 'Bento Bloom' }}
      prompts={PROMPTS}
    >
      <div className="kl">
        <header className="kl-bar">
          <p className="kl-mark">
            <i aria-hidden="true" />
            <span>{COMPANY}<span className="kl-mark__rest">{COMPANY_REST}</span></span>
          </p>
          <nav className="kl-bar__nav" aria-label={t(HEAD.nav)}>
            <a href="#kl-poll">{t(HEAD.poll)}</a>
            <a href="#kl-flight">{t(HEAD.flight)}</a>
            <a href="#kl-tele">{t(HEAD.tele)}</a>
            <a href="#kl-alerts">{t(HEAD.alerts)}</a>
          </nav>
          <p className="kl-now">
            {PLACE} <b>{wall(now, zone, true)}</b> {zoneName}
          </p>
          <a className="kl-btn kl-btn--go" href="#kl-watch">{t(HEAD.watch)}</a>
        </header>

        <section className="kl-hero" aria-labelledby="kl-title">
          <div className="kl-hero__title">
            <h1 id="kl-title">{keep(fill(t(HERO.title), { time: at('12:40') }))}</h1>
            <p className="kl-lede">{t(HERO.lede)}</p>
          </div>

          <section className="kl-panel kl-count" aria-labelledby="kl-count-title">
            <div className="kl-head">
              <h2 id="kl-count-title">{fill(t(COUNT.head), { time: `${wall(LIFTOFF, zone, true)} ${zoneName}` })}</h2>
              <div className="kl-head__end">
                <span className={lampClass}>{lampText}</span>
                <button type="button" className="kl-key" onClick={togglePause}>
                  <i className={paused ? 'kl-key__play' : 'kl-key__pause'} aria-hidden="true" />
                  {t(paused ? COUNT.resume : COUNT.pause)}
                </button>
              </div>
            </div>
            <div className="kl-count__body">
              <div className="kl-clock" role="timer" aria-label={fill(t(COUNT.timer), { h: hh, m: mm, s: ss })}>
                <span aria-hidden="true">T-</span>
                <span aria-hidden="true">{pad(hh)}<small>{t(COUNT.h)}</small></span>
                <span className="kl-clock__sep" aria-hidden="true">:</span>
                <span aria-hidden="true">{pad(mm)}<small>{t(COUNT.min)}</small></span>
                <span className="kl-clock__sep" aria-hidden="true">:</span>
                <span aria-hidden="true">{pad(ss)}<small>{t(COUNT.s)}</small></span>
              </div>
            </div>
            <p className="kl-status"><span>{keep(t(COUNT.status))}</span></p>
          </section>

          <section className="kl-panel kl-window" aria-labelledby="kl-window-title">
            <div className="kl-window__head">
              <h2 className="kl-panel__title" id="kl-window-title">{t(WINDOW.title)}</h2>
              <div className="kl-tz" role="group" aria-label={t(WINDOW.zone)}>
                {ZONES.map((item) => (
                  <button key={item} type="button" aria-pressed={zone === item} onClick={() => chooseZone(item)}>
                    {ZONE_NAME[item]}
                  </button>
                ))}
              </div>
            </div>
            <p className="kl-window__time">
              {at('12:40')}<span> {t(WINDOW.to)} </span>{at('13:52')}
            </p>
            <p className="kl-window__note">{t(WINDOW.note)}</p>
            <div className="kl-strip" aria-hidden="true">
              <div className="kl-strip__track">
                <span className="kl-strip__win">{t(WINDOW.window)}</span>
                <span className="kl-strip__now" style={{ left: `${nowShare.toFixed(3)}%` }}>
                  <span>{t(WINDOW.now)}</span>
                </span>
              </div>
              <div className="kl-strip__ticks">
                {TICKS.map((tick) => <span key={tick}>{at(tick)}</span>)}
              </div>
            </div>
            <p className="kl-backup">
              {t(WINDOW.backup)}{' '}
              <b>
                {t(WINDOW.backupDay).split('{range}')[0]}
                <span className="kl-nw">{fill(t(WINDOW.range), { from: at('12:38'), to: at('13:50') })}</span>
                {t(WINDOW.backupDay).split('{range}')[1]}
              </b>
            </p>
          </section>

          <section className="kl-panel kl-seq" aria-labelledby="kl-seq-title">
            <div className="kl-head">
              <h2 id="kl-seq-title">{t(SEQ_TEXT.title)}</h2>
            </div>
            <ol className="kl-seq__list">
              {SEQ.map((event) => {
                const passed = parse(event.at) <= now;
                const state = [passed ? 'is-done' : '', event === nextEvent ? 'is-next' : '', event.count === 'T-00:00' ? 'is-t0' : ''].filter(Boolean).join(' ');
                return (
                  <li key={event.count} className={state || undefined}>
                    <b>{event.count}</b>
                    <time dateTime={`2026-11-21T${event.at}+01:00`}>{at(event.at)}</time>
                    <span>
                      {t(event.what)}
                      {event === nextEvent ? <span className="kl-tag">{t(SEQ_TEXT.next)}</span> : null}
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="kl-panel kl-wx" aria-labelledby="kl-wx-title">
            <h2 className="kl-panel__title" id="kl-wx-title">{t(WX.title)}</h2>
            <dl>
              {WX_ROWS.map((row) => (
                <div key={row.name.en} className={row.hold ? 'is-hold' : undefined}>
                  <dt>
                    {row.hold ? <span className="kl-hold">{t(WX.hold)}</span> : null}
                    {t(row.name)}
                  </dt>
                  <dd>{t(row.value)}</dd>
                  {row.limit ? (
                    <dd className="kl-limit">
                      <i aria-hidden="true" style={{ '--kl-share': `${row.limit.share}%` } as CSSProperties} />
                      <span>{t(row.limit.label)}</span>
                    </dd>
                  ) : null}
                </div>
              ))}
            </dl>
          </section>
        </section>

        <section className="kl-section kl-poll" id="kl-poll" aria-labelledby="kl-poll-title">
          <div className="kl-poll__head">
            <div>
              <h2 id="kl-poll-title">{t(POLL.title)}</h2>
              <p className="kl-lede">{keep(timed(POLL.lede, { a: '11:55', b: '12:25' }))}</p>
            </div>
            <div className="kl-tally">
              <p>
                <b>{goCount}</b>
                <span>{fill(t(POLL.tally), { n: STATIONS.length })}</span>
              </p>
              <ol className="kl-lamps" aria-hidden="true">
                {STATIONS.map((station) => (
                  <li key={station.call} className={station.hold ? 'is-hold' : undefined}>{station.call}</li>
                ))}
              </ol>
            </div>
          </div>

          <table className="kl-board" role="table" aria-labelledby="kl-poll-title">
            <thead role="rowgroup">
              <tr role="row">
                <th role="columnheader" scope="col">{t(POLL.station)}</th>
                <th role="columnheader" scope="col">{t(POLL.console)}</th>
                <th role="columnheader" scope="col">{t(POLL.answer)}</th>
                <th role="columnheader" scope="col">{t(POLL.note)}</th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {STATIONS.map((station) => {
                const isOpen = open[station.call] === true;
                const id = `kl-note-${station.call.toLowerCase()}`;
                return (
                  <tr key={station.call} role="row" className={station.hold ? 'is-hold' : undefined}>
                    <th role="rowheader" scope="row" data-label={t(POLL.station)}>
                      <button
                        type="button"
                        className="kl-board__open"
                        aria-expanded={isOpen}
                        aria-controls={id}
                        onClick={() => setOpen((current) => ({ ...current, [station.call]: !current[station.call] }))}
                      >
                        <i className={`kl-plus${isOpen ? ' is-open' : ''}`} aria-hidden="true" />
                        <span className="kl-call">{station.call}</span>
                        <span className="kl-board__name">{t(station.name)}</span>
                      </button>
                    </th>
                    <td role="cell" data-label={t(POLL.console)}>{station.who}</td>
                    <td role="cell" data-label={t(POLL.answer)}>
                      <span className={`kl-ans kl-ans--${station.hold ? 'hold' : 'go'}`}>{t(station.hold ? POLL.hold : POLL.go)}</span>
                    </td>
                    <td role="cell" data-label={t(POLL.note)}>
                      <p>{keep(timed(station.note, station.times))}</p>
                      <p className="kl-board__more" id={id} hidden={!isOpen}>{keep(timed(station.more, station.times))}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <section className="kl-section" id="kl-flight" aria-labelledby="kl-flight-title">
          <h2 id="kl-flight-title">{t(FLIGHT.title)}</h2>
          <p className="kl-lede">{keep(t(FLIGHT.lede))}</p>

          <figure className="kl-plot">
            <div className="kl-plot__y" aria-hidden="true">
              <span className="kl-plot__unit">km</span>
              {Y_MARKS.map((mark) => <span key={mark.km} style={{ top: mark.top }}>{mark.km}</span>)}
            </div>
            <div className="kl-plot__area" role="img" aria-label={t(FLIGHT.plot)}>
              <svg viewBox="0 0 660 600" preserveAspectRatio="none" aria-hidden="true">
                <path className="kl-plot__orbit" d="M0 79 H660" />
                <path d={ASCENT_PATH} />
              </svg>
              {EVENTS.filter((event) => event.mark).map((event) => {
                const mark = event.mark!;
                const place = { '--kl-t': mark.t, '--kl-km': mark.km } as CSSProperties;
                return (
                  <Fragment key={event.time}>
                    <i className={`kl-ev${event.go ? ' kl-ev--go' : ''}`} style={place} />
                    {mark.label ? (
                      <span className={`kl-ev-label kl-ev-label--${mark.label}${event.go ? ' kl-ev-label--go' : ''}`} style={place}>
                        {t(event.name)}
                        <small>{event.time}</small>
                      </span>
                    ) : null}
                  </Fragment>
                );
              })}
            </div>
            <div className="kl-plot__x" aria-hidden="true">
              {X_MARKS.map((mark) => <span key={mark}>{mark}</span>)}
              <span>{t(FLIGHT.minutes)}</span>
            </div>
          </figure>

          <table className="kl-ascent" role="table" aria-labelledby="kl-flight-title">
            <thead role="rowgroup">
              <tr role="row">
                <th role="columnheader" scope="col">{t(FLIGHT.time)}</th>
                <th role="columnheader" scope="col">{t(FLIGHT.event)}</th>
                <th role="columnheader" scope="col">{t(FLIGHT.altitude)}</th>
                <th role="columnheader" scope="col">{t(FLIGHT.speed)}</th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {EVENTS.map((event) => (
                <tr key={event.time} role="row" className={event.go ? 'is-go' : undefined}>
                  <td role="cell" data-label={t(FLIGHT.time)}>{event.time}</td>
                  <td role="cell" data-label={t(FLIGHT.event)}>
                    <b>{keep(t(event.name))}</b>
                    <span>{keep(t(event.note))}</span>
                  </td>
                  <td role="cell" data-label={t(FLIGHT.altitude)}>{event.altitude}</td>
                  <td role="cell" data-label={t(FLIGHT.speed)}>{event.speed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="kl-section" id="kl-tele" aria-labelledby="kl-tele-title">
          <h2 id="kl-tele-title">{t(TELE.title)}</h2>
          <p className="kl-lede">{t(TELE.lede)}</p>
          <div className="kl-panel kl-tele">
            <div className="kl-head">
              <span>{keep(t(TELE.link))}</span>
              <span className="kl-lamp">{fill(t(TELE.locked), { t: wall(now - 1, zone, true) })}</span>
            </div>
            <dl className="kl-big">
              <div><dt>{t(TELE.mission)}</dt><dd>T+00:00:00</dd></div>
              <div><dt>{t(TELE.altitude)}</dt><dd>0.0<small>km</small></dd></div>
              <div><dt>{t(TELE.speed)}</dt><dd>0<small>m/s</small></dd></div>
              <div><dt>{t(TELE.downrange)}</dt><dd>0.0<small>km</small></dd></div>
            </dl>
            <div className="kl-pad">
              <div className="kl-gauges" role="group" aria-label={t(TELE.tanks)}>
                {GAUGES.map((gauge) => (
                  <figure key={gauge.name.en} className={`kl-gauge${gauge.topping ? ' kl-gauge--topping' : ''}`}>
                    <b>{gauge.value}</b>
                    <i aria-hidden="true" />
                    <figcaption>{t(gauge.name)}</figcaption>
                  </figure>
                ))}
              </div>
              <dl className="kl-readings">
                <div><dt>{t(PAD.stage1)}</dt><dd>3.4 bar</dd></div>
                <div><dt>{t(PAD.stage2)}</dt><dd>2.9 bar</dd></div>
                <div><dt>{t(PAD.battery)}</dt><dd>28.9 V</dd></div>
                <div><dt>{t(PAD.satellites)}</dt><dd>{t(PAD.inView)}</dd></div>
                <div><dt>{t(PAD.power)}</dt><dd>{t(now >= INTERNAL_POWER ? PAD.internal : PAD.ground)}</dd></div>
              </dl>
            </div>
          </div>
        </section>

        <section className="kl-section" id="kl-watch" aria-labelledby="kl-watch-title">
          <h2 id="kl-watch-title">{t(WATCH.title)}</h2>
          <p className="kl-lede">{t(WATCH.lede)}</p>
          <table className="kl-watch" role="table" aria-labelledby="kl-watch-title">
            <tbody role="rowgroup">
              {PLACES.map((place) => (
                <tr key={place.name.en} role="row">
                  <th role="rowheader" scope="row">{t(place.name)}</th>
                  <td role="cell">{fill(t(WATCH.from), { t: at(place.from) })}</td>
                  <td role="cell">{lead(timed(place.text, place.times), t(place.lead))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="kl-section kl-alerts" id="kl-alerts" aria-labelledby="kl-alerts-title">
          <div>
            <h2 id="kl-alerts-title">{t(ALERTS.title)}</h2>
            <p className="kl-lede">{timed(ALERTS.note, { a: '12:10' })}</p>
          </div>
          {subscribed !== null ? (
            <div className="kl-done" ref={doneRef} tabIndex={-1}>
              <p className="kl-done__title">{fill(t(ALERTS.doneTitle), { email: subscribed })}</p>
              <p>{timed(ALERTS.doneBody, { a: '12:10' })}</p>
              <button type="button" className="kl-link" onClick={() => setSubscribed(null)}>{t(ALERTS.change)}</button>
            </div>
          ) : (
            <form className={`kl-form${emailError ? ' is-invalid' : ''}`} noValidate onSubmit={subscribe}>
              <label htmlFor="kl-email">{t(ALERTS.label)}</label>
              <div className="kl-form__row">
                <input
                  id="kl-email"
                  ref={emailRef}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  spellCheck={false}
                  value={email}
                  aria-invalid={emailError ? true : undefined}
                  aria-describedby={emailError ? 'kl-email-error' : undefined}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (emailError) setEmailError(null);
                  }}
                />
                <button className="kl-btn kl-btn--ink" type="submit">{t(ALERTS.submit)}</button>
              </div>
              {emailError ? (
                <p className="kl-error" id="kl-email-error" role="alert">{t(emailError === 'empty' ? ALERTS.empty : ALERTS.invalid)}</p>
              ) : null}
            </form>
          )}
        </section>

        <footer className="kl-foot">
          <p>{t(FOOT.company)}</p>
          <p>{t(zone === 'utc' ? FOOT.utc : FOOT.cet)}</p>
        </footer>

        <p className="kl-sr" role="status">{news}</p>
      </div>
    </FusionShell>
  );
}
