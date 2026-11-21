import { Fragment, useEffect, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedCyberpunkGlitchPage.css';

// The page of Sector 9 Repair, a phone, tablet and laptop repair stall in a night market
// in Kowloon, in the Cyberpunk Glitch style. Tektur, a squared face with a width axis,
// sets the stall's name wide and heavy and every figure a customer reads from across the
// aisle at the condensed end of the axis: the number being served, prices, tickets, part
// counts. Red Hat Mono says everything else, in the voice of the queue screen.
// Components come from the stall: the hours on hazard tape, the now-serving display over
// the three benches, a lit price board with a device switch, the queue screen with a
// ticket lookup and a ticket machine, the parts drawers, and a plan of the market rows.
// Colour has one meaning each: yellow is what to look at now, cyan is on a bench, in
// stock or a link, magenta is waiting, running low or a mistake in a form.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

const NAME = 'Sector 9 Repair';
const NAME_LINES = ['Sector 9', 'Repair'];

// Fills {key} slots; a slot without a value is left for place().
const fill = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (slot, key: string) => (key in values ? String(values[key]) : slot));
// Puts one value into a sentence as a node, so it can be set in its own face and colour.
const place = (text: string, key: string, node: ReactNode): ReactNode[] =>
  text.split(`{${key}}`).flatMap((part, index) => (index === 0 ? [part] : [<Fragment key={index}>{node}</Fragment>, part]));
const pad = (n: number) => String(n).padStart(3, '0');
const clock = (minutes: number) => {
  const m = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

const HEAD = {
  nav: { en: 'Stall', ko: 'Stall', ja: 'Stall' },
  prices: { en: 'Prices', ko: 'Prices', ja: 'Prices' },
  queue: { en: 'Queue', ko: 'Queue', ja: 'Queue' },
  parts: { en: 'Parts', ko: 'Parts', ja: 'Parts' },
  find: { en: 'Find the stall', ko: 'Find the stall', ja: 'Find the stall' },
} satisfies Record<string, Tri>;

const HERO = {
  open: { en: 'Open 19:00–03:00', ko: 'Open 19:00–03:00', ja: 'Open 19:00–03:00' },
  openNote: { en: 'Last walk-in at 02:15. Closed on Tuesdays.', ko: 'Last walk-in at 02:15. Closed on Tuesdays.', ja: 'Last walk-in at 02:15. Closed on Tuesdays.' },
  lede: {
    en: 'Phone, tablet and laptop repairs at stall 14 in Row C of the Temple Lane night market, Kowloon. Screens and batteries are fitted at the counter while you wait. Longer jobs are ready the next night.',
    ko: 'Phone, tablet and laptop repairs at stall 14 in Row C of the Temple Lane night market, Kowloon. Screens and batteries are fitted at the counter while you wait. Longer jobs are ready the next night.',
    ja: 'Phone, tablet and laptop repairs at stall 14 in Row C of the Temple Lane night market, Kowloon. Screens and batteries are fitted at the counter while you wait. Longer jobs are ready the next night.',
  },
  take: { en: 'Take a queue ticket', ko: 'Take a queue ticket', ja: 'Take a queue ticket' },
  prices: { en: 'See tonight’s prices', ko: 'See tonight’s prices', ja: 'See tonight’s prices' },
  benches: {
    en: 'Three benches tonight: Kit on batteries and ports, Joy on screens, Marco on laptops and data recovery.',
    ko: 'Three benches tonight: Kit on batteries and ports, Joy on screens, Marco on laptops and data recovery.',
    ja: 'Three benches tonight: Kit on batteries and ports, Joy on screens, Marco on laptops and data recovery.',
  },
} satisfies Record<string, Tri>;

const HUD = {
  label: { en: 'Now serving', ko: 'Now serving', ja: 'Now serving' },
  what: { en: 'Pixel 7 screen', ko: 'Pixel 7 screen', ja: 'Pixel 7 screen' },
  where: { en: 'Bench 2 with Joy', ko: 'Bench 2 with Joy', ja: 'Bench 2 with Joy' },
  benches: { en: 'On the benches', ko: 'On the benches', ja: 'On the benches' },
  next: { en: 'The next ticket is {n}, about {wait} away.', ko: 'The next ticket is {n}, about {wait} away.', ja: 'The next ticket is {n}, about {wait} away.' },
  full: { en: 'No more tickets tonight. The queue is full until 03:00.', ko: 'No more tickets tonight. The queue is full until 03:00.', ja: 'No more tickets tonight. The queue is full until 03:00.' },
  ready: { en: 'Ready to collect', ko: 'Ready to collect', ja: 'Ready to collect' },
} satisfies Record<string, Tri>;

const NOW_SERVING = 47;

const BENCHES: Array<{ job: Tri; state: Tri; progress: number }> = [
  { job: { en: '045 iPhone 13 battery', ko: '045 iPhone 13 battery', ja: '045 iPhone 13 battery' }, state: { en: 'Bench 1, 3 min left', ko: 'Bench 1, 3 min left', ja: 'Bench 1, 3 min left' }, progress: 87 },
  { job: { en: '046 MacBook data recovery', ko: '046 MacBook data recovery', ja: '046 MacBook data recovery' }, state: { en: 'Bench 3, 100 of 238 GB', ko: 'Bench 3, 100 of 238 GB', ja: 'Bench 3, 100 of 238 GB' }, progress: 42 },
  { job: { en: '044 Galaxy S22 screen', ko: '044 Galaxy S22 screen', ja: '044 Galaxy S22 screen' }, state: { en: 'At the counter since 21:12', ko: 'At the counter since 21:12', ja: 'At the counter since 21:12' }, progress: 100 },
];

// "1 h 50 min", the wait for a ticket taken now. No-break spaces keep it on one line.
const WAIT = { en: '{h}\u00a0h\u00a0{m}\u00a0min', ko: '{h}\u00a0h\u00a0{m}\u00a0min', ja: '{h}\u00a0h\u00a0{m}\u00a0min' } satisfies Tri;

type DeviceId = 'phones' | 'tablets' | 'laptops' | 'consoles';

interface Service {
  name: Tri;
  note: Tri;
  time: Tri;
  from: boolean;
  price: string;
}

const PRICES = {
  title: { en: 'Prices', ko: 'Prices', ja: 'Prices' },
  intro: {
    en: 'Every price includes the part and a 90-day warranty on it. We quote before we open anything, and if the quote changes once the device is open, you decide again.',
    ko: 'Every price includes the part and a 90-day warranty on it. We quote before we open anything, and if the quote changes once the device is open, you decide again.',
    ja: 'Every price includes the part and a 90-day warranty on it. We quote before we open anything, and if the quote changes once the device is open, you decide again.',
  },
  device: { en: 'Device', ko: 'Device', ja: 'Device' },
  note: { en: 'In HK$. Cash, Octopus or FPS.', ko: 'In HK$. Cash, Octopus or FPS.', ja: 'In HK$. Cash, Octopus or FPS.' },
  from: { en: 'from', ko: 'from', ja: 'from' },
  takes: { en: 'Takes', ko: 'Takes', ja: 'Takes' },
  currency: { en: 'HK$', ko: 'HK$', ja: 'HK$' },
} satisfies Record<string, Tri>;

const DEVICES: Array<{ id: DeviceId; name: Tri; services: Service[] }> = [
  {
    id: 'phones',
    name: { en: 'Phones', ko: 'Phones', ja: 'Phones' },
    services: [
      {
        name: { en: 'Screen replacement', ko: 'Screen replacement', ja: 'Screen replacement' },
        note: {
          en: 'OLED or LCD, fitted and sealed at the counter. iPhone 11 to 15, Galaxy S21 to S24, Pixel 6 to 8.',
          ko: 'OLED or LCD, fitted and sealed at the counter. iPhone 11 to 15, Galaxy S21 to S24, Pixel 6 to 8.',
          ja: 'OLED or LCD, fitted and sealed at the counter. iPhone 11 to 15, Galaxy S21 to S24, Pixel 6 to 8.',
        },
        time: { en: '40 min', ko: '40 min', ja: '40 min' },
        from: true,
        price: '480',
      },
      {
        name: { en: 'Battery swap', ko: 'Battery swap', ja: 'Battery swap' },
        note: {
          en: 'A new cell and a new adhesive seal. Battery health reads 100% when you leave.',
          ko: 'A new cell and a new adhesive seal. Battery health reads 100% when you leave.',
          ja: 'A new cell and a new adhesive seal. Battery health reads 100% when you leave.',
        },
        time: { en: '20 min', ko: '20 min', ja: '20 min' },
        from: false,
        price: '280',
      },
      {
        name: { en: 'Data recovery', ko: 'Data recovery', ja: 'Data recovery' },
        note: {
          en: 'From phones that will not start, or after water. You pay only if we recover the files you list.',
          ko: 'From phones that will not start, or after water. You pay only if we recover the files you list.',
          ja: 'From phones that will not start, or after water. You pay only if we recover the files you list.',
        },
        time: { en: '1 to 3 nights', ko: '1 to 3 nights', ja: '1 to 3 nights' },
        from: true,
        price: '900',
      },
      {
        name: { en: 'Charging port', ko: 'Charging port', ja: 'Charging port' },
        note: {
          en: 'Cleaned first at no charge, and replaced only if cleaning does not fix it.',
          ko: 'Cleaned first at no charge, and replaced only if cleaning does not fix it.',
          ja: 'Cleaned first at no charge, and replaced only if cleaning does not fix it.',
        },
        time: { en: '30 min', ko: '30 min', ja: '30 min' },
        from: false,
        price: '220',
      },
      {
        name: { en: 'Back glass', ko: 'Back glass', ja: 'Back glass' },
        note: {
          en: 'The cracked glass comes off by laser. New panel and camera lens cover.',
          ko: 'The cracked glass comes off by laser. New panel and camera lens cover.',
          ja: 'The cracked glass comes off by laser. New panel and camera lens cover.',
        },
        time: { en: '90 min', ko: '90 min', ja: '90 min' },
        from: false,
        price: '420',
      },
    ],
  },
  {
    id: 'tablets',
    name: { en: 'Tablets', ko: 'Tablets', ja: 'Tablets' },
    services: [
      {
        name: { en: 'Screen and touch glass', ko: 'Screen and touch glass', ja: 'Screen and touch glass' },
        note: {
          en: 'Replaced together, so the glass sits flat. iPad 7th to 10th generation, iPad Air 3 to 5, Galaxy Tab S7 to S9.',
          ko: 'Replaced together, so the glass sits flat. iPad 7th to 10th generation, iPad Air 3 to 5, Galaxy Tab S7 to S9.',
          ja: 'Replaced together, so the glass sits flat. iPad 7th to 10th generation, iPad Air 3 to 5, Galaxy Tab S7 to S9.',
        },
        time: { en: '2 hours', ko: '2 hours', ja: '2 hours' },
        from: true,
        price: '950',
      },
      {
        name: { en: 'Battery', ko: 'Battery', ja: 'Battery' },
        note: {
          en: 'Tablet batteries are glued in. We fit the new one tonight and keep the tablet until the adhesive has set.',
          ko: 'Tablet batteries are glued in. We fit the new one tonight and keep the tablet until the adhesive has set.',
          ja: 'Tablet batteries are glued in. We fit the new one tonight and keep the tablet until the adhesive has set.',
        },
        time: { en: 'Next night', ko: 'Next night', ja: 'Next night' },
        from: true,
        price: '650',
      },
      {
        name: { en: 'Charging port', ko: 'Charging port', ja: 'Charging port' },
        note: {
          en: 'USB-C and Lightning ports, on a new flex cable.',
          ko: 'USB-C and Lightning ports, on a new flex cable.',
          ja: 'USB-C and Lightning ports, on a new flex cable.',
        },
        time: { en: '60 min', ko: '60 min', ja: '60 min' },
        from: false,
        price: '380',
      },
      {
        name: { en: 'Water damage', ko: 'Water damage', ja: 'Water damage' },
        note: {
          en: 'Opened, cleaned in the ultrasonic bath and dried overnight. No charge if it does not come back.',
          ko: 'Opened, cleaned in the ultrasonic bath and dried overnight. No charge if it does not come back.',
          ja: 'Opened, cleaned in the ultrasonic bath and dried overnight. No charge if it does not come back.',
        },
        time: { en: '1 night', ko: '1 night', ja: '1 night' },
        from: false,
        price: '450',
      },
      {
        name: { en: 'Bent frame', ko: 'Bent frame', ja: 'Bent frame' },
        note: {
          en: 'Pressed straight before a new screen goes on, so it does not crack again in a week.',
          ko: 'Pressed straight before a new screen goes on, so it does not crack again in a week.',
          ja: 'Pressed straight before a new screen goes on, so it does not crack again in a week.',
        },
        time: { en: '30 min', ko: '30 min', ja: '30 min' },
        from: false,
        price: '300',
      },
    ],
  },
  {
    id: 'laptops',
    name: { en: 'Laptops', ko: 'Laptops', ja: 'Laptops' },
    services: [
      {
        name: { en: 'Screen', ko: 'Screen', ja: 'Screen' },
        note: {
          en: 'MacBook Air and Pro from 2018, ThinkPad T and X series, Dell XPS 13. Panels we do not stock arrive in two days.',
          ko: 'MacBook Air and Pro from 2018, ThinkPad T and X series, Dell XPS 13. Panels we do not stock arrive in two days.',
          ja: 'MacBook Air and Pro from 2018, ThinkPad T and X series, Dell XPS 13. Panels we do not stock arrive in two days.',
        },
        time: { en: '1 to 2 nights', ko: '1 to 2 nights', ja: '1 to 2 nights' },
        from: true,
        price: '1,600',
      },
      {
        name: { en: 'Keyboard', ko: 'Keyboard', ja: 'Keyboard' },
        note: {
          en: 'MacBook Air M1 and M2 keyboards in stock. Other models are ordered and fitted two nights later.',
          ko: 'MacBook Air M1 and M2 keyboards in stock. Other models are ordered and fitted two nights later.',
          ja: 'MacBook Air M1 and M2 keyboards in stock. Other models are ordered and fitted two nights later.',
        },
        time: { en: '1 night', ko: '1 night', ja: '1 night' },
        from: true,
        price: '1,100',
      },
      {
        name: { en: 'Battery', ko: 'Battery', ja: 'Battery' },
        note: {
          en: 'Cells of the original capacity. The cycle count starts again at zero.',
          ko: 'Cells of the original capacity. The cycle count starts again at zero.',
          ja: 'Cells of the original capacity. The cycle count starts again at zero.',
        },
        time: { en: '90 min', ko: '90 min', ja: '90 min' },
        from: true,
        price: '780',
      },
      {
        name: { en: 'Data recovery', ko: 'Data recovery', ja: 'Data recovery' },
        note: {
          en: 'From drives that will not mount, after a spill or a failed update. You pay only if we recover the files you list.',
          ko: 'From drives that will not mount, after a spill or a failed update. You pay only if we recover the files you list.',
          ja: 'From drives that will not mount, after a spill or a failed update. You pay only if we recover the files you list.',
        },
        time: { en: '1 to 3 nights', ko: '1 to 3 nights', ja: '1 to 3 nights' },
        from: true,
        price: '1,200',
      },
      {
        name: { en: 'Fan and thermal paste', ko: 'Fan and thermal paste', ja: 'Fan and thermal paste' },
        note: {
          en: 'Dust out, new paste on the processor, and a new fan if the old one rattles.',
          ko: 'Dust out, new paste on the processor, and a new fan if the old one rattles.',
          ja: 'Dust out, new paste on the processor, and a new fan if the old one rattles.',
        },
        time: { en: '60 min', ko: '60 min', ja: '60 min' },
        from: false,
        price: '350',
      },
    ],
  },
  {
    id: 'consoles',
    name: { en: 'Consoles', ko: 'Consoles', ja: 'Consoles' },
    services: [
      {
        name: { en: 'Joy-Con stick', ko: 'Joy-Con stick', ja: 'Joy-Con stick' },
        note: {
          en: 'Hall-effect sticks that do not drift. Both sticks of a pair for HK$ 300.',
          ko: 'Hall-effect sticks that do not drift. Both sticks of a pair for HK$ 300.',
          ja: 'Hall-effect sticks that do not drift. Both sticks of a pair for HK$ 300.',
        },
        time: { en: '20 min', ko: '20 min', ja: '20 min' },
        from: false,
        price: '180',
      },
      {
        name: { en: 'Switch screen', ko: 'Switch screen', ja: 'Switch screen' },
        note: {
          en: 'Switch, Switch Lite and Switch OLED, with new touch glass.',
          ko: 'Switch, Switch Lite and Switch OLED, with new touch glass.',
          ja: 'Switch, Switch Lite and Switch OLED, with new touch glass.',
        },
        time: { en: '90 min', ko: '90 min', ja: '90 min' },
        from: true,
        price: '520',
      },
      {
        name: { en: 'HDMI port', ko: 'HDMI port', ja: 'HDMI port' },
        note: {
          en: 'PS5 and Xbox Series X ports, soldered at the bench and tested on a 4K screen.',
          ko: 'PS5 and Xbox Series X ports, soldered at the bench and tested on a 4K screen.',
          ja: 'PS5 and Xbox Series X ports, soldered at the bench and tested on a 4K screen.',
        },
        time: { en: '1 night', ko: '1 night', ja: '1 night' },
        from: false,
        price: '650',
      },
      {
        name: { en: 'Disc drive', ko: 'Disc drive', ja: 'Disc drive' },
        note: {
          en: 'A new laser or drive belt for PS4, PS5, Xbox One and Series X.',
          ko: 'A new laser or drive belt for PS4, PS5, Xbox One and Series X.',
          ja: 'A new laser or drive belt for PS4, PS5, Xbox One and Series X.',
        },
        time: { en: '1 night', ko: '1 night', ja: '1 night' },
        from: true,
        price: '480',
      },
      {
        name: { en: 'Clean and repaste', ko: 'Clean and repaste', ja: 'Clean and repaste' },
        note: {
          en: 'For consoles that run loud or switch themselves off. Dust out, new paste and thermal pads.',
          ko: 'For consoles that run loud or switch themselves off. Dust out, new paste and thermal pads.',
          ja: 'For consoles that run loud or switch themselves off. Dust out, new paste and thermal pads.',
        },
        time: { en: '60 min', ko: '60 min', ja: '60 min' },
        from: false,
        price: '320',
      },
    ],
  },
];

type QueueState = 'ready' | 'bench' | 'called' | 'part' | 'queued';

interface Ticket {
  n: number;
  /** A device name, or what the visitor typed when taking a ticket. */
  device: string;
  repair: Tri;
  state: QueueState;
  /** Shown in the State column, except for queued tickets. */
  stateText?: Tri;
  progress?: number;
  doneBy: string;
  /** What the lookup says about a ticket that is not simply queued. */
  summary?: Tri;
  /** Said after the queued sentence. */
  extra?: Tri;
  /** What the visitor chose, on a ticket taken from this page. */
  problem?: ProblemId;
}

const QUEUE_BASE: Ticket[] = [
  {
    n: 44,
    device: 'Galaxy S22',
    repair: { en: 'Screen', ko: 'Screen', ja: 'Screen' },
    state: 'ready',
    stateText: { en: 'Ready to collect', ko: 'Ready to collect', ja: 'Ready to collect' },
    doneBy: '21:12',
    summary: {
      en: 'Your Galaxy S22 has been ready since 21:12. Collect it at the counter with this ticket.',
      ko: 'Your Galaxy S22 has been ready since 21:12. Collect it at the counter with this ticket.',
      ja: 'Your Galaxy S22 has been ready since 21:12. Collect it at the counter with this ticket.',
    },
  },
  {
    n: 45,
    device: 'iPhone 13',
    repair: { en: 'Battery', ko: 'Battery', ja: 'Battery' },
    state: 'bench',
    stateText: { en: 'Bench 1', ko: 'Bench 1', ja: 'Bench 1' },
    progress: 87,
    doneBy: '21:43',
    summary: {
      en: 'Your iPhone 13 is on bench 1 with Kit, about 3 minutes left. Wait by the counter.',
      ko: 'Your iPhone 13 is on bench 1 with Kit, about 3 minutes left. Wait by the counter.',
      ja: 'Your iPhone 13 is on bench 1 with Kit, about 3 minutes left. Wait by the counter.',
    },
  },
  {
    n: 46,
    device: 'MacBook Air M1',
    repair: { en: 'Data recovery', ko: 'Data recovery', ja: 'Data recovery' },
    state: 'bench',
    stateText: { en: 'Bench 3', ko: 'Bench 3', ja: 'Bench 3' },
    progress: 42,
    doneBy: '23:10',
    summary: {
      en: 'Your MacBook Air is on bench 3 with Marco. 100 of 238 GB are copied so far, and it should be done around 23:10.',
      ko: 'Your MacBook Air is on bench 3 with Marco. 100 of 238 GB are copied so far, and it should be done around 23:10.',
      ja: 'Your MacBook Air is on bench 3 with Marco. 100 of 238 GB are copied so far, and it should be done around 23:10.',
    },
  },
  {
    n: 47,
    device: 'Pixel 7',
    repair: { en: 'Screen', ko: 'Screen', ja: 'Screen' },
    state: 'called',
    stateText: { en: 'Called to bench 2', ko: 'Called to bench 2', ja: 'Called to bench 2' },
    doneBy: '22:20',
    summary: {
      en: 'Your number is on the screen now. Bring the Pixel 7 to bench 2, where Joy is waiting.',
      ko: 'Your number is on the screen now. Bring the Pixel 7 to bench 2, where Joy is waiting.',
      ja: 'Your number is on the screen now. Bring the Pixel 7 to bench 2, where Joy is waiting.',
    },
  },
  {
    n: 48,
    device: 'iPad, 9th generation',
    repair: { en: 'Charging port', ko: 'Charging port', ja: 'Charging port' },
    state: 'part',
    stateText: { en: 'Waiting for the part, due 23:30', ko: 'Waiting for the part, due 23:30', ja: 'Waiting for the part, due 23:30' },
    doneBy: '00:10',
    summary: {
      en: 'Waiting for the part, due at 23:30. Your iPad goes on a bench as soon as it arrives and should be done around 00:10.',
      ko: 'Waiting for the part, due at 23:30. Your iPad goes on a bench as soon as it arrives and should be done around 00:10.',
      ja: 'Waiting for the part, due at 23:30. Your iPad goes on a bench as soon as it arrives and should be done around 00:10.',
    },
  },
  { n: 49, device: 'Switch OLED', repair: { en: 'Joy-Con stick', ko: 'Joy-Con stick', ja: 'Joy-Con stick' }, state: 'queued', doneBy: '22:05' },
  { n: 50, device: 'Galaxy A54', repair: { en: 'Battery', ko: 'Battery', ja: 'Battery' }, state: 'queued', doneBy: '22:30' },
  { n: 51, device: 'iPhone 12 mini', repair: { en: 'Back glass', ko: 'Back glass', ja: 'Back glass' }, state: 'queued', doneBy: '22:50' },
  {
    n: 52,
    device: 'iPhone 14',
    repair: { en: 'Screen', ko: 'Screen', ja: 'Screen' },
    state: 'queued',
    doneBy: '23:05',
    extra: { en: 'The screen for it is already set aside.', ko: 'The screen for it is already set aside.', ja: 'The screen for it is already set aside.' },
  },
];

const FIRST_TICKET = QUEUE_BASE[0].n;
const NEXT_TICKET = QUEUE_BASE[QUEUE_BASE.length - 1].n + 1;
// A ticket taken now is done 1 h 50 min from now, at 23:30; each one after it 25 minutes later.
const FIRST_WAIT = 110;
const FIRST_DONE = 23 * 60 + 30;
const STEP = 25;
// After six more tickets the last one is done at 01:35, and the benches are full until closing.
const MAX_TAKEN = 6;

const QUEUE = {
  title: { en: 'Queue', ko: 'Queue', ja: 'Queue' },
  intro: {
    en: 'Take a ticket at the counter or from this page. Numbers are called on the screen above the stall, and a missed number is held for 15 minutes.',
    ko: 'Take a ticket at the counter or from this page. Numbers are called on the screen above the stall, and a missed number is held for 15 minutes.',
    ja: 'Take a ticket at the counter or from this page. Numbers are called on the screen above the stall, and a missed number is held for 15 minutes.',
  },
  label: { en: 'Your ticket', ko: 'Your ticket', ja: 'Your ticket' },
  find: { en: 'Find my ticket', ko: 'Find my ticket', ja: 'Find my ticket' },
  format: { en: 'Write the three-digit number on your ticket, like 052.', ko: 'Write the three-digit number on your ticket, like 052.', ja: 'Write the three-digit number on your ticket, like 052.' },
  collected: {
    en: 'Ticket {n} was collected earlier tonight. If you still have the device with you, show this ticket at the counter.',
    ko: 'Ticket {n} was collected earlier tonight. If you still have the device with you, show this ticket at the counter.',
    ja: 'Ticket {n} was collected earlier tonight. If you still have the device with you, show this ticket at the counter.',
  },
  notYet: {
    en: 'Ticket {n} has not been given out yet tonight. The next ticket is {next}.',
    ko: 'Ticket {n} has not been given out yet tonight. The next ticket is {next}.',
    ja: 'Ticket {n} has not been given out yet tonight. The next ticket is {next}.',
  },
  notTonight: {
    en: 'Ticket {n} has not been given out, and tonight’s queue is full.',
    ko: 'Ticket {n} has not been given out, and tonight’s queue is full.',
    ja: 'Ticket {n} has not been given out, and tonight’s queue is full.',
  },
  next: { en: 'You are next. Your {device} should be done around {time}.', ko: 'You are next. Your {device} should be done around {time}.', ja: 'You are next. Your {device} should be done around {time}.' },
  one: {
    en: 'One ticket ahead of you. Your {device} should be done around {time}.',
    ko: 'One ticket ahead of you. Your {device} should be done around {time}.',
    ja: 'One ticket ahead of you. Your {device} should be done around {time}.',
  },
  many: {
    en: '{count} tickets ahead of you. Your {device} should be done around {time}.',
    ko: '{count} tickets ahead of you. Your {device} should be done around {time}.',
    ja: '{count} tickets ahead of you. Your {device} should be done around {time}.',
  },
  table: { en: 'Tonight’s queue', ko: 'Tonight’s queue', ja: 'Tonight’s queue' },
  colTicket: { en: 'Ticket', ko: 'Ticket', ja: 'Ticket' },
  colDevice: { en: 'Device', ko: 'Device', ja: 'Device' },
  colRepair: { en: 'Repair', ko: 'Repair', ja: 'Repair' },
  colState: { en: 'State', ko: 'State', ja: 'State' },
  colDone: { en: 'Done by', ko: 'Done by', ja: 'Done by' },
  queued: { en: 'Queued', ko: 'Queued', ja: 'Queued' },
  yours: { en: '{state}, your ticket', ko: '{state}, your ticket', ja: '{state}, your ticket' },
} satisfies Record<string, Tri>;

type ProblemId = 'screen' | 'battery' | 'port' | 'water' | 'start' | 'other';

const PROBLEMS: Array<{ id: ProblemId; name: Tri; repair: Tri }> = [
  { id: 'screen', name: { en: 'Screen', ko: 'Screen', ja: 'Screen' }, repair: { en: 'Screen', ko: 'Screen', ja: 'Screen' } },
  { id: 'battery', name: { en: 'Battery', ko: 'Battery', ja: 'Battery' }, repair: { en: 'Battery', ko: 'Battery', ja: 'Battery' } },
  { id: 'port', name: { en: 'Charging port', ko: 'Charging port', ja: 'Charging port' }, repair: { en: 'Charging port', ko: 'Charging port', ja: 'Charging port' } },
  { id: 'water', name: { en: 'Water damage', ko: 'Water damage', ja: 'Water damage' }, repair: { en: 'Water damage', ko: 'Water damage', ja: 'Water damage' } },
  { id: 'start', name: { en: 'Will not start', ko: 'Will not start', ja: 'Will not start' }, repair: { en: 'Check first', ko: 'Check first', ja: 'Check first' } },
  { id: 'other', name: { en: 'Something else', ko: 'Something else', ja: 'Something else' }, repair: { en: 'Check first', ko: 'Check first', ja: 'Check first' } },
];

const TAKE = {
  title: { en: 'Take a queue ticket', ko: 'Take a queue ticket', ja: 'Take a queue ticket' },
  intro: {
    en: 'Tell us the device and what is wrong, and you get the next number. Bring the device to the counter before your number comes up; we look at it there before it goes on a bench.',
    ko: 'Tell us the device and what is wrong, and you get the next number. Bring the device to the counter before your number comes up; we look at it there before it goes on a bench.',
    ja: 'Tell us the device and what is wrong, and you get the next number. Bring the device to the counter before your number comes up; we look at it there before it goes on a bench.',
  },
  rule: {
    en: 'One ticket for each device. Tickets are given out until 02:15.',
    ko: 'One ticket for each device. Tickets are given out until 02:15.',
    ja: 'One ticket for each device. Tickets are given out until 02:15.',
  },
  device: { en: 'Device', ko: 'Device', ja: 'Device' },
  deviceHint: { en: 'For example iPhone 14 or Switch OLED', ko: 'For example iPhone 14 or Switch OLED', ja: 'For example iPhone 14 or Switch OLED' },
  deviceError: { en: 'Write the device, for example Galaxy A54.', ko: 'Write the device, for example Galaxy A54.', ja: 'Write the device, for example Galaxy A54.' },
  problem: { en: 'What is wrong', ko: 'What is wrong', ja: 'What is wrong' },
  problemError: { en: 'Choose what is wrong, or Something else.', ko: 'Choose what is wrong, or Something else.', ja: 'Choose what is wrong, or Something else.' },
  submit: { en: 'Take ticket {n}', ko: 'Take ticket {n}', ja: 'Take ticket {n}' },
  doneTitle: { en: 'Ticket {n} is yours.', ko: 'Ticket {n} is yours.', ja: 'Ticket {n} is yours.' },
  doneBody: {
    en: '{device}, {problem}. About {wait} from now, done around {time}. It is marked as your ticket in the queue above, and a missed number is held for 15 minutes.',
    ko: '{device}, {problem}. About {wait} from now, done around {time}. It is marked as your ticket in the queue above, and a missed number is held for 15 minutes.',
    ja: '{device}, {problem}. About {wait} from now, done around {time}. It is marked as your ticket in the queue above, and a missed number is held for 15 minutes.',
  },
  again: { en: 'Take another ticket', ko: 'Take another ticket', ja: 'Take another ticket' },
  full: {
    en: 'Tonight’s queue is full. Come to the counter: if a bench frees up before 02:15, we take walk-ins.',
    ko: 'Tonight’s queue is full. Come to the counter: if a bench frees up before 02:15, we take walk-ins.',
    ja: 'Tonight’s queue is full. Come to the counter: if a bench frees up before 02:15, we take walk-ins.',
  },
} satisfies Record<string, Tri>;

const PARTS = {
  title: { en: 'Parts in stock', ko: 'Parts in stock', ja: 'Parts in stock' },
  intro: {
    en: 'Counted at 19:00 tonight. Message us the model and we will hold a part for 24 hours.',
    ko: 'Counted at 19:00 tonight. Message us the model and we will hold a part for 24 hours.',
    ja: 'Counted at 19:00 tonight. Message us the model and we will hold a part for 24 hours.',
  },
  inStock: { en: 'in stock', ko: 'in stock', ja: 'in stock' },
} satisfies Record<string, Tri>;

const DRAWERS: Array<{ count: number; part: Tri; fits: Tri; level?: 'low' | 'out' }> = [
  { count: 6, part: { en: 'iPhone 13 screen', ko: 'iPhone 13 screen', ja: 'iPhone 13 screen' }, fits: { en: 'OLED, original grade', ko: 'OLED, original grade', ja: 'OLED, original grade' } },
  { count: 2, part: { en: 'iPhone 14 screen', ko: 'iPhone 14 screen', ja: 'iPhone 14 screen' }, fits: { en: 'One held for ticket 052', ko: 'One held for ticket 052', ja: 'One held for ticket 052' }, level: 'low' },
  { count: 0, part: { en: 'iPhone 15 screen', ko: 'iPhone 15 screen', ja: 'iPhone 15 screen' }, fits: { en: 'Next delivery Thursday', ko: 'Next delivery Thursday', ja: 'Next delivery Thursday' }, level: 'out' },
  { count: 3, part: { en: 'Galaxy S23 screen', ko: 'Galaxy S23 screen', ja: 'Galaxy S23 screen' }, fits: { en: 'With frame, fitted in 50 min', ko: 'With frame, fitted in 50 min', ja: 'With frame, fitted in 50 min' } },
  { count: 4, part: { en: 'Pixel 7 screen', ko: 'Pixel 7 screen', ja: 'Pixel 7 screen' }, fits: { en: 'With frame', ko: 'With frame', ja: 'With frame' } },
  { count: 23, part: { en: 'iPhone batteries', ko: 'iPhone batteries', ja: 'iPhone batteries' }, fits: { en: 'iPhone 11 to 14', ko: 'iPhone 11 to 14', ja: 'iPhone 11 to 14' } },
  { count: 11, part: { en: 'Galaxy batteries', ko: 'Galaxy batteries', ja: 'Galaxy batteries' }, fits: { en: 'S21 to S23', ko: 'S21 to S23', ja: 'S21 to S23' } },
  { count: 18, part: { en: 'USB-C ports', ko: 'USB-C ports', ja: 'USB-C ports' }, fits: { en: 'Galaxy A and S series', ko: 'Galaxy A and S series', ja: 'Galaxy A and S series' } },
  { count: 9, part: { en: 'Lightning ports', ko: 'Lightning ports', ja: 'Lightning ports' }, fits: { en: 'iPhone 11 to 14', ko: 'iPhone 11 to 14', ja: 'iPhone 11 to 14' } },
  { count: 1, part: { en: 'MacBook Air keyboard', ko: 'MacBook Air keyboard', ja: 'MacBook Air keyboard' }, fits: { en: 'M1 and M2, US layout', ko: 'M1 and M2, US layout', ja: 'M1 and M2, US layout' }, level: 'low' },
  { count: 40, part: { en: 'Joy-Con sticks', ko: 'Joy-Con sticks', ja: 'Joy-Con sticks' }, fits: { en: 'Hall-effect, no drift', ko: 'Hall-effect, no drift', ja: 'Hall-effect, no drift' } },
  { count: 7, part: { en: '1 TB drives', ko: '1 TB drives', ja: '1 TB drives' }, fits: { en: 'For recovered data, HK$ 520', ko: 'For recovered data, HK$ 520', ja: 'For recovered data, HK$ 520' } },
];

const FIND = {
  title: { en: 'Find the stall', ko: 'Find the stall', ja: 'Find the stall' },
  intro: {
    en: 'The market has five rows off one main aisle. We are near the middle, two minutes from the gate.',
    ko: 'The market has five rows off one main aisle. We are near the middle, two minutes from the gate.',
    ja: 'The market has five rows off one main aisle. We are near the middle, two minutes from the gate.',
  },
  plan: {
    en: 'Plan of the market: rows A to E off the main aisle. The walk goes from the Temple Lane gate up the aisle, right into Row C at the fish-ball stall, to stall 14.',
    ko: 'Plan of the market: rows A to E off the main aisle. The walk goes from the Temple Lane gate up the aisle, right into Row C at the fish-ball stall, to stall 14.',
    ja: 'Plan of the market: rows A to E off the main aisle. The walk goes from the Temple Lane gate up the aisle, right into Row C at the fish-ball stall, to stall 14.',
  },
  gate: { en: 'Temple Lane gate', ko: 'Temple Lane gate', ja: 'Temple Lane gate' },
  keyStall: { en: 'Sector 9 Repair, C14', ko: 'Sector 9 Repair, C14', ja: 'Sector 9 Repair, C14' },
  keyCorner: { en: 'Fish-ball stall on the corner', ko: 'Fish-ball stall on the corner', ja: 'Fish-ball stall on the corner' },
  keyWalk: { en: 'The walk from the gate', ko: 'The walk from the gate', ja: 'The walk from the gate' },
  row: { en: 'Row C', ko: 'Row C', ja: 'Row C' },
  stall: { en: 'stall 14', ko: 'stall 14', ja: 'stall 14' },
  where: { en: 'Temple Lane night market, Kowloon.', ko: 'Temple Lane night market, Kowloon.', ja: 'Temple Lane night market, Kowloon.' },
  steps: { en: 'The walk from the gate', ko: 'The walk from the gate', ja: 'The walk from the gate' },
  closed: { en: 'Closed', ko: 'Closed', ja: 'Closed' },
  closedNote: {
    en: 'on Tuesdays, and whenever typhoon signal 8 or higher is up.',
    ko: 'on Tuesdays, and whenever typhoon signal 8 or higher is up.',
    ja: 'on Tuesdays, and whenever typhoon signal 8 or higher is up.',
  },
} satisfies Record<string, Tri>;

const STEPS: Tri[] = [
  { en: 'Come in at the Temple Lane gate, next to the 24-hour pharmacy.', ko: 'Come in at the Temple Lane gate, next to the 24-hour pharmacy.', ja: 'Come in at the Temple Lane gate, next to the 24-hour pharmacy.' },
  { en: 'Walk up the main aisle past Rows E and D, about 60 metres.', ko: 'Walk up the main aisle past Rows E and D, about 60 metres.', ja: 'Walk up the main aisle past Rows E and D, about 60 metres.' },
  { en: 'Turn right into Row C at the fish-ball stall.', ko: 'Turn right into Row C at the fish-ball stall.', ja: 'Turn right into Row C at the fish-ball stall.' },
  { en: 'We are the 14th stall on the left, under the yellow sign with the 9.', ko: 'We are the 14th stall on the left, under the yellow sign with the 9.', ja: 'We are the 14th stall on the left, under the yellow sign with the 9.' },
];

const ROWS = ['A', 'B', 'C', 'D', 'E'];

const FOOT = {
  address: { en: 'Row C, stall 14, Temple Lane night market, Kowloon', ko: 'Row C, stall 14, Temple Lane night market, Kowloon', ja: 'Row C, stall 14, Temple Lane night market, Kowloon' },
  hours: { en: 'Hours', ko: 'Hours', ja: 'Hours' },
  hoursValue: { en: '19:00 to 03:00, Wednesday to Monday', ko: '19:00 to 03:00, Wednesday to Monday', ja: '19:00 to 03:00, Wednesday to Monday' },
  messages: { en: 'Messages', ko: 'Messages', ja: 'Messages' },
  messagesValue: { en: 'WhatsApp or Signal, answered from 18:00', ko: 'WhatsApp or Signal, answered from 18:00', ja: 'WhatsApp or Signal, answered from 18:00' },
} satisfies Record<string, Tri>;

const PROMPT_EN = `Design one real page in the Cyberpunk Glitch style: a near-black ground with a faint cyan grid and scanlines, three neons with one meaning each, square corners, neon frames with corner brackets, and an RGB split on the name.

Pick a believable subject that lives on numbers read from across a dark room, such as a repair stall in a night market, an arcade's prize counter or a late-night noodle bar's order screen, and write its real content. The page must read as that subject's page, never as a page about its own style. Here it is Sector 9 Repair, a phone, tablet and laptop repair stall at Row C, stall 14 of the Temple Lane night market in Kowloon: tonight's hours, the number being served, the price board, the queue with a ticket lookup and a ticket form, the parts in stock and the walk from the gate.

TOKENS:
--bg: #09090b
--surface: #16161a (opaque, for any menu that opens over the page)
--ink: #e2e8f0
--muted: #a7b0c0
--line: rgba(226,232,240,0.28)
--line-strong: rgba(226,232,240,0.5)
--yellow: #fde047
--cyan: #22d3ee
--magenta: #d946ef
--hover: cyan at 14% over --bg (color-mix), for the device keys and the problem cells

COLOUR:
- Yellow is what to look at now: the stall's name and hours, the number being served, prices, the next ticket, your ticket, the stall on the plan, the buttons.
- Cyan is on a bench, in stock, a link or a chosen option: bench meters, part counts, times, in-page links, the selected device key and problem cell, the focus ring.
- Magenta is waiting or wrong: a job waiting for a part, a part running low, the now-serving frame, and form errors.
- No other hues. Every tint, stripe and glow is one of the three neons or ink at an alpha: frame fills 4% (the price board a cyan wash from 8% to 2%), the lookup and confirmation 6%, your queue row 9%, hazard stripes yellow 9%, low-stock stripes magenta 12%, out-of-stock stripes ink 7%. The ground carries a 1px cyan grid at 5% every 30px, and the whole page sits under fixed scanlines (2px clear, 2px black at 16%). Muted text keeps at least 4.5:1; structural lines are 1px at 0.28 or 0.5, section rules 1px cyan.

TYPOGRAPHY:
Two families. Tektur (400 to 900, width axis 75 to 100) sets the stall's name, headings, service and part names, buttons and every figure. Red Hat Mono (400, and 500 on the yellow "Ready to collect" bar) says everything else.
Name: Tektur 800 at full width, uppercase, line-height 0.84, letter-spacing -0.02em, two lines ("Sector 9" / "Repair"); clamp(3rem, 18vw, 13.5rem) below 1080px and clamp(6.5rem, 9.7vw, 7.75rem) from 1080px. Its split is a 3px magenta shadow down-right and a 3px cyan shadow up-left (1.8px below 760px).
H2: Tektur 700, clamp(2rem, 3.6vw, 3rem), line-height 1.05, letter-spacing -0.025em, sentence case, with a 2px magenta and cyan sideways split at 85%.
Service names Tektur 600 1.5rem (1.375rem at 480px and below); part names Tektur 600 1.25rem; the ticket form heading Tektur 700 clamp(1.75rem, 2.6vw, 2.25rem); the hours Tektur 700 1.375rem; the stall mark Tektur 800 1.25rem; buttons Tektur 600 1.125rem; footer names Tektur 700 1.125rem.
Figures drop to the condensed end of the width axis (font-stretch 75%), Tektur 700, tabular: the number being served 6rem in the desktop display and clamp(6rem, 11vw, 9rem) when stacked; prices clamp(2.75rem, 4.6vw, 4rem); queue tickets 1.75rem; the ticket field 1.875rem; part counts 3rem; step numbers 1.5rem. The stall address ("Row C / stall 14") is Tektur 800 uppercase at clamp(2.5rem, 4.4vw, 3.75rem) with a 2px split.
Body: Red Hat Mono 400 at 1rem, line-height 1.65; the lede 1.1875rem, line-height 1.55 (1.125rem at 480px and below); device keys and "Now serving" 1.0625rem; text fields 1.125rem. No text under 1rem. No all-caps tracked labels.

LAYOUT:
- A 1120px column. The stall's bar: the name on the left and four in-page links in cyan on the right, on a 1px cyan rule, at least 60px tall; below 760px the links wrap under the name. Every link and control is at least 44px tall.
- Hero from 1080px: two columns, 28fr and 26fr with a 32px gap. Left: the hours on hazard tape, the name, the lede, a yellow outline button "Take a queue ticket" and a cyan underlined link. Right: the now-serving display and one muted line about tonight's three benches. On a 1280x800 laptop the name and the whole display sit on the first screen. Below 1080px everything stacks in that order, the display at most 640px wide.
- Section heads: the H2 left and a muted intro right (5fr and 6fr, bottom aligned), one column below 1080px. Sections 112px apart, 88px below 760px.
- Then the price board, the queue (lookup, queue screen, ticket form), the parts cabinet, the plan with the walk, and a three-column footer on a cyan rule (one column below 760px).

COMPONENTS:
- Hazard tape: 2px yellow border, -45° stripes of yellow at 9% every 18px, a lit 14x20px square before the hours, the walk-in and closing note in yellow at 82%.
- Neon frame: 1px border with 3px corner brackets 18px long at the top left and bottom right. Magenta for the now-serving display, cyan for the price board.
- Now serving: "Now serving" with a lit square, the number with a 3px split, the job and bench beside it; three bench lines, each the job and its state on one line over a 20px meter of cyan segments (10px lit, 2px gap) with a 14px glow; a finished job is a solid yellow bar reading "Ready to collect"; a last line names the next ticket in yellow and the wait.
- Price board: a device switch that is a real tab list (Phones, Tablets, Laptops, Consoles): keys 44px tall with 1px cyan walls, the selected key solid cyan with dark text, arrow keys, Home and End move and select. One tab panel of five services: name and note, the time in cyan, the price right-aligned with "from" when it varies, lit as a dot matrix (a 3px grid of dots masked over the figure) with a 7px yellow glow. Below 1080px the time moves under the name; on phones the note takes the full width and the time and price share the last line.
- Ticket lookup: a yellow frame at 6% with "Your ticket", a three-digit field (52px tall, 2px yellow border, 4px yellow halo at 20%) and a "Find my ticket" button. A known number marks its row in the queue and says what happens next (tickets ahead and the time, or bench, ready, called, waiting for a part). An unknown number, a number collected earlier tonight, a number not given out yet or anything that is not a number shows a magenta error with a lit square next to the field (role alert); the frame turns magenta and no row stays marked.
- Queue screen: a table with explicit roles: ticket, device, repair, state, done by. State squares: solid yellow ready, solid cyan on a bench or called, 2px magenta outline waiting for a part, 1px muted outline queued; a bench job also shows a 120px segmented bar. The called number is yellow with a 1px split; your row has a 9% yellow wash and a 4px yellow edge, and its state ends with ", your ticket". On phones each ticket is one block: the number on the left, then device, repair, state and "Done by".
- Ticket form, under a cyan rule: what to do on the left (5fr), the form on the right (6fr). A device field (52px, 1px line-strong border) with a hint, and "What is wrong" as one radio group of six square cells with shared 1px walls, three across (two below 760px), the chosen cell solid cyan. One solid yellow button that names the number: "Take ticket 053". Errors sit under their field in magenta; the first invalid field takes focus. A valid ticket replaces the form with a confirmation in a yellow frame that takes focus, adds the row to the queue as your ticket, and moves the next number on; after six tickets the queue is full and says so.
- Parts cabinet: one grid with 1px shared walls, four across (three below 1080px, two below 760px), each drawer a count, the part and what it fits. Running low: magenta count and note on magenta stripes; out of stock: muted count on ink stripes.
- The plan: 18 columns, rows A to E as strips of 16 stalls off one aisle, the gate as a cyan block, the corner stall outlined in cyan, our stall solid yellow with a 3px split, the walk as a dashed cyan line (7 on, 5 off); a legend under it, then the address large, four numbered steps (a real sequence) and when the stall is closed.
- Square corners everywhere. Focus ring 2px cyan at 3px offset; yellow on the device keys, the problem cells and the ticket field. The confirmation shows its ring on focus.

MOTION:
- The name has two copies behind it, cyan and magenta, each clipped to a band. When the page opens they slide between five positions for about 3.75 seconds (3s and 2.5s linear runs, 1.25 and 1.5 times, alternating) and then hold still; they slide again only while the pointer rests on the name. They slide, never blink, so nothing flashes.
- The two lit squares (hours and "Now serving") blink three times, once every 1.1 seconds, then stay lit.
- Hover changes fill and colour, over 160ms on buttons, device keys and problem cells; buttons light up yellow with a 22px glow.
- prefers-reduced-motion: no slices moving, no blinking, no transitions.

FORBIDDEN:
- Cards, rounded boxes, pills, chips, badges, glass panels
- A small label above a heading, all-caps tracked labels, numbered section markers
- Neon text or fills outside the colour rules (the RGB split on the name, headings and address is the only decoration), gradient text, extra hues
- Endless glitch loops, flicker, flashing, text that jitters while it is read
- Circuit-board art, skylines, figures, photographs, emoji, binary-code backgrounds, terminal prompts
- Arrows on links, middle-dot meta strings, numbers on anything that is not a real sequence
- Copy about hacking, the future, neon or the style itself

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML: a tab list and one tab panel for the price board, a table with roles for the queue, a radio group for the problems, labelled forms, an ordered list for the walk
3) Working device switch, ticket lookup with its errors, ticket form with error and success states that adds the ticket to the queue
4) Responsive layout down to 320px with no horizontal scroll; the queue becomes one block per ticket on phones
5) Visible focus on every control, a text alternative for the plan, the slices kept out of the heading's accessible name, reduced-motion support`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_EN, ja: PROMPT_EN };

type FormErrors = { device: boolean; problem: boolean };
type Lookup = { kind: 'found'; n: number } | { kind: 'error'; message: string };

export function PortedCyberpunkGlitchPage({ lang }: PortedStylePageProps) {
  const [deviceId, setDeviceId] = useState<DeviceId>('phones');
  const [taken, setTaken] = useState<Ticket[]>([]);
  const [ticketInput, setTicketInput] = useState('052');
  const [lookup, setLookup] = useState<Lookup>({ kind: 'found', n: 52 });
  const [lookupNews, setLookupNews] = useState('');
  const [form, setForm] = useState<{ device: string; problem: ProblemId | '' }>({ device: '', problem: '' });
  const [errors, setErrors] = useState<FormErrors>({ device: false, problem: false });
  const [issued, setIssued] = useState<number | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const deviceRef = useRef<HTMLInputElement>(null);
  const problemRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLParagraphElement>(null);
  const wasIssued = useRef(false);

  const t = (text: Tri) => text[lang];

  const device = DEVICES.find((item) => item.id === deviceId) ?? DEVICES[0];
  const queue = [...QUEUE_BASE, ...taken];
  const nextNumber = NEXT_TICKET + taken.length;
  const full = taken.length >= MAX_TAKEN;
  const waitFor = (index: number) => {
    const minutes = FIRST_WAIT + STEP * index;
    return fill(t(WAIT), { h: Math.floor(minutes / 60), m: String(minutes % 60).padStart(2, '0') });
  };
  const found = lookup.kind === 'found' ? lookup.n : null;
  const issuedTicket = issued === null ? undefined : queue.find((ticket) => ticket.n === issued);

  // The form and the confirmation replace each other. Focus goes to what took the place
  // of the control that had it: the confirmation, or, after "Take another ticket", the
  // device field.
  useEffect(() => {
    if (issued !== null) doneRef.current?.focus();
    else if (wasIssued.current) deviceRef.current?.focus();
    wasIssued.current = issued !== null;
  }, [issued]);

  const describe = (ticket: Ticket) => {
    if (ticket.state !== 'queued') return t(ticket.summary ?? QUEUE.queued);
    const ahead = queue.filter((other) => other.state === 'queued' && other.n < ticket.n).length;
    const template = ahead === 0 ? QUEUE.next : ahead === 1 ? QUEUE.one : QUEUE.many;
    const sentence = fill(t(template), { count: ahead, device: ticket.device, time: ticket.doneBy });
    return ticket.extra ? `${sentence} ${t(ticket.extra)}` : sentence;
  };

  const chooseDevice = (index: number) => {
    const next = DEVICES[(index + DEVICES.length) % DEVICES.length];
    setDeviceId(next.id);
    tabRefs.current[DEVICES.indexOf(next)]?.focus();
  };

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const moves: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: DEVICES.length - 1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    chooseDevice(moves[event.key]);
  };

  const findTicket = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = ticketInput.trim();
    const fail = (message: string) => {
      setLookup({ kind: 'error', message });
      setLookupNews('');
    };
    if (!/^\d{1,3}$/.test(value)) {
      fail(t(QUEUE.format));
      return;
    }
    const n = Number(value);
    const ticket = queue.find((item) => item.n === n);
    if (!ticket) {
      const message = n < FIRST_TICKET ? QUEUE.collected : full ? QUEUE.notTonight : QUEUE.notYet;
      fail(fill(t(message), { n: pad(n), next: pad(nextNumber) }));
      return;
    }
    setTicketInput(pad(n));
    setLookup({ kind: 'found', n });
    setLookupNews(describe(ticket));
  };

  const takeTicket = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = form.device.trim();
    const next = { device: name === '', problem: form.problem === '' };
    if (next.device || next.problem) {
      // The error renders first, so the whole field can be brought into view above the fixed page bar.
      flushSync(() => setErrors(next));
      if (next.device) {
        deviceRef.current?.focus();
        deviceRef.current?.parentElement?.scrollIntoView({ block: 'nearest' });
      } else {
        problemRef.current?.querySelector<HTMLInputElement>('input')?.focus();
        problemRef.current?.scrollIntoView({ block: 'nearest' });
      }
      return;
    }
    const problem = PROBLEMS.find((item) => item.id === form.problem) ?? PROBLEMS[0];
    const index = taken.length;
    const ticket: Ticket = { n: nextNumber, device: name, repair: problem.repair, state: 'queued', doneBy: clock(FIRST_DONE + STEP * index), problem: problem.id };
    setErrors({ device: false, problem: false });
    setTaken([...taken, ticket]);
    // The new ticket becomes the one the queue marks as yours. The confirmation takes
    // focus and says so, so the lookup's live region stays quiet.
    setTicketInput(pad(ticket.n));
    setLookup({ kind: 'found', n: ticket.n });
    setLookupNews('');
    setIssued(ticket.n);
  };

  const takeAnother = () => {
    setForm({ device: '', problem: '' });
    setIssued(null);
  };

  const foundTicket = found === null ? undefined : queue.find((ticket) => ticket.n === found);

  return (
    <FusionShell
      fusionId="cyberpunk-glitch"
      lang={lang}
      tone="dark"
      accent="#22d3ee"
      prev={{ href: '/pages/kinetic-pop.html', label: 'Kinetic Pop' }}
      next={{ href: '/pages/swiss-poster.html', label: 'Swiss Poster' }}
      prompts={PROMPTS}
    >
      <div className="s9">
        <header className="s9-bar">
          <p className="s9-mark">{NAME}</p>
          <nav className="s9-bar__nav" aria-label={t(HEAD.nav)}>
            <a href="#s9-prices">{t(HEAD.prices)}</a>
            <a href="#s9-queue">{t(HEAD.queue)}</a>
            <a href="#s9-parts">{t(HEAD.parts)}</a>
            <a href="#s9-find">{t(HEAD.find)}</a>
          </nav>
        </header>

        <section className="s9-hero" aria-labelledby="s9-title">
          <div className="s9-hero__main">
            <p className="s9-hours">
              <b><i className="s9-sq s9-blink" aria-hidden="true" />{t(HERO.open)}</b> <span>{t(HERO.openNote)}</span>
            </p>
            <h1 className="s9-glitch" id="s9-title" data-text={NAME_LINES.join('\n')}>
              <span>{NAME_LINES[0]}</span> <span>{NAME_LINES[1]}</span>
            </h1>
            <p className="s9-lede">{t(HERO.lede)}</p>
            <div className="s9-actions">
              <a className="s9-btn" href="#s9-take">{t(HERO.take)}</a>
              <a className="s9-link" href="#s9-prices">{t(HERO.prices)}</a>
            </div>
          </div>

          <div className="s9-hero__side">
            <section className="s9-hud s9-frame" aria-labelledby="s9-now-label">
              <div className="s9-now">
                <p className="s9-now__label" id="s9-now-label"><i className="s9-sq s9-blink" aria-hidden="true" />{t(HUD.label)}</p>
                <p className="s9-now__num s9-num">{pad(NOW_SERVING)}</p>
                <p className="s9-now__what">{t(HUD.what)}<span>{t(HUD.where)}</span></p>
              </div>
              <ul className="s9-benches" aria-label={t(HUD.benches)}>
                {BENCHES.map((bench) => (
                  <li key={bench.job.en}>
                    <span className="s9-benches__job">{t(bench.job)}</span>
                    <span className="s9-benches__state">{t(bench.state)}</span>
                    {bench.progress === 100 ? (
                      <span className="s9-meter s9-meter--done"><b>{t(HUD.ready)}</b></span>
                    ) : (
                      <span className="s9-meter" aria-hidden="true"><i style={{ '--p': `${bench.progress}%` } as CSSProperties} /></span>
                    )}
                  </li>
                ))}
              </ul>
              <p className="s9-hud__foot">
                {full ? t(HUD.full) : place(fill(t(HUD.next), { wait: waitFor(taken.length) }), 'n', <b>{pad(nextNumber)}</b>)}
              </p>
            </section>
            <p className="s9-hero__note">{t(HERO.benches)}</p>
          </div>
        </section>

        <section className="s9-section" id="s9-prices" aria-labelledby="s9-prices-title">
          <div className="s9-head">
            <h2 id="s9-prices-title">{t(PRICES.title)}</h2>
            <p className="s9-intro">{t(PRICES.intro)}</p>
          </div>
          <div className="s9-board s9-frame">
            <div className="s9-board__top">
              <div className="s9-seg" role="tablist" aria-label={t(PRICES.device)}>
                {DEVICES.map((item, index) => {
                  const selected = item.id === device.id;
                  return (
                    <button
                      key={item.id}
                      ref={(node) => {
                        tabRefs.current[index] = node;
                      }}
                      type="button"
                      role="tab"
                      id={`s9-tab-${item.id}`}
                      aria-selected={selected}
                      aria-controls="s9-price-panel"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => chooseDevice(index)}
                      onKeyDown={(event) => onTabKey(event, index)}
                    >
                      {t(item.name)}
                    </button>
                  );
                })}
              </div>
              <p className="s9-board__note">{t(PRICES.note)}</p>
            </div>
            <div className="s9-board__panel" role="tabpanel" id="s9-price-panel" aria-labelledby={`s9-tab-${device.id}`} tabIndex={0}>
              <ul className="s9-rows">
                {device.services.map((service) => (
                  <li key={service.name.en} className="s9-row">
                    <div>
                      <h3>{t(service.name)}</h3>
                      <p>{t(service.note)}</p>
                    </div>
                    <p className="s9-time"><span className="s9-sr">{t(PRICES.takes)} </span>{t(service.time)}</p>
                    <p className="s9-price">
                      {service.from ? <small>{t(PRICES.from)}</small> : null}
                      <span className="s9-sr">{t(PRICES.currency)} </span>
                      <b className="s9-led s9-num"><span>{service.price}</span></b>
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="s9-section" id="s9-queue" aria-labelledby="s9-queue-title">
          <div className="s9-head">
            <h2 id="s9-queue-title">{t(QUEUE.title)}</h2>
            <p className="s9-intro">{t(QUEUE.intro)}</p>
          </div>

          <div className={`s9-lookup${lookup.kind === 'error' ? ' is-invalid' : ''}`}>
            <form className="s9-lookup__form" noValidate onSubmit={findTicket}>
              <label htmlFor="s9-ticket">{t(QUEUE.label)}</label>
              <input
                id="s9-ticket"
                className="s9-num"
                type="text"
                inputMode="numeric"
                autoComplete="off"
                value={ticketInput}
                aria-invalid={lookup.kind === 'error' || undefined}
                aria-describedby={lookup.kind === 'error' ? 's9-ticket-error' : undefined}
                onChange={(event) => setTicketInput(event.target.value)}
              />
              <button className="s9-btn s9-btn--small" type="submit">{t(QUEUE.find)}</button>
            </form>
            {lookup.kind === 'error' ? (
              <p className="s9-error" id="s9-ticket-error" role="alert"><i className="s9-sq" aria-hidden="true" />{lookup.message}</p>
            ) : foundTicket ? (
              <p className="s9-lookup__result">{describe(foundTicket)}</p>
            ) : null}
          </div>
          <p className="s9-sr" role="status">{lookupNews}</p>

          <div className="s9-q" role="table" aria-label={t(QUEUE.table)}>
            <div role="rowgroup">
              <div className="s9-q__row s9-q__row--head" role="row">
                <span role="columnheader">{t(QUEUE.colTicket)}</span>
                <span role="columnheader">{t(QUEUE.colDevice)}</span>
                <span role="columnheader">{t(QUEUE.colRepair)}</span>
                <span role="columnheader">{t(QUEUE.colState)}</span>
                <span role="columnheader">{t(QUEUE.colDone)}</span>
              </div>
            </div>
            <div role="rowgroup">
              {queue.map((ticket) => {
                const mine = ticket.n === found;
                const state = ticket.stateText ? t(ticket.stateText) : t(QUEUE.queued);
                return (
                  <div
                    key={ticket.n}
                    className={`s9-q__row is-${ticket.state}${mine ? ' is-you' : ''}${ticket.n === NOW_SERVING ? ' is-called' : ''}`}
                    role="row"
                    aria-current={mine ? 'true' : undefined}
                  >
                    <span className="s9-q__tk s9-num" role="rowheader">{pad(ticket.n)}</span>
                    <span className="s9-q__device" role="cell">{ticket.device}</span>
                    <span className="s9-q__repair" role="cell">{t(ticket.repair)}</span>
                    <span className="s9-q__state" role="cell">
                      <span className="s9-state">
                        <i className="s9-sq" aria-hidden="true" />
                        {mine ? fill(t(QUEUE.yours), { state }) : state}
                      </span>
                      {ticket.progress ? (
                        <span className="s9-blocks" aria-hidden="true"><i style={{ '--p': `${ticket.progress}%` } as CSSProperties} /></span>
                      ) : null}
                    </span>
                    <span className="s9-q__done" role="cell">
                      <span className="s9-q__label" aria-hidden="true">{t(QUEUE.colDone)} </span>
                      {ticket.doneBy}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="s9-take" id="s9-take">
            <div className="s9-take__intro">
              <h3>{t(TAKE.title)}</h3>
              <p>{t(TAKE.intro)}</p>
              <p className="s9-take__rule">{t(TAKE.rule)}</p>
            </div>
            {issuedTicket ? (
              <div className="s9-done">
                <p className="s9-done__title" ref={doneRef} tabIndex={-1}>
                  {place(t(TAKE.doneTitle), 'n', <b className="s9-num">{pad(issuedTicket.n)}</b>)}
                </p>
                <p className="s9-done__body">
                  {fill(t(TAKE.doneBody), {
                    device: issuedTicket.device,
                    problem: t((PROBLEMS.find((item) => item.id === issuedTicket.problem) ?? PROBLEMS[0]).name),
                    wait: waitFor(issuedTicket.n - NEXT_TICKET),
                    time: issuedTicket.doneBy,
                  })}
                </p>
                {full ? <p className="s9-done__full">{t(TAKE.full)}</p> : <button className="s9-btn" type="button" onClick={takeAnother}>{t(TAKE.again)}</button>}
              </div>
            ) : full ? (
              <p className="s9-take__full">{t(TAKE.full)}</p>
            ) : (
              <form className="s9-form" noValidate onSubmit={takeTicket}>
                <div className={`s9-field${errors.device ? ' is-invalid' : ''}`}>
                  <label htmlFor="s9-device">{t(TAKE.device)}</label>
                  <input
                    id="s9-device"
                    ref={deviceRef}
                    type="text"
                    autoComplete="off"
                    maxLength={40}
                    value={form.device}
                    aria-invalid={errors.device || undefined}
                    aria-describedby={errors.device ? 's9-device-hint s9-device-error' : 's9-device-hint'}
                    onChange={(event) => {
                      setForm({ ...form, device: event.target.value });
                      if (errors.device) setErrors({ ...errors, device: false });
                    }}
                  />
                  <p className="s9-field__hint" id="s9-device-hint">{t(TAKE.deviceHint)}</p>
                  {errors.device ? <p className="s9-error" id="s9-device-error" role="alert"><i className="s9-sq" aria-hidden="true" />{t(TAKE.deviceError)}</p> : null}
                </div>
                <div
                  className={`s9-field${errors.problem ? ' is-invalid' : ''}`}
                  role="radiogroup"
                  aria-labelledby="s9-problem-label"
                  aria-describedby={errors.problem ? 's9-problem-error' : undefined}
                  ref={problemRef}
                >
                  <p className="s9-field__label" id="s9-problem-label">{t(TAKE.problem)}</p>
                  <div className="s9-choices">
                    {PROBLEMS.map((problem) => (
                      <label key={problem.id} className={`s9-choice${form.problem === problem.id ? ' is-on' : ''}`}>
                        <input
                          className="s9-sr"
                          type="radio"
                          name="s9-problem"
                          value={problem.id}
                          checked={form.problem === problem.id}
                          onChange={() => {
                            setForm({ ...form, problem: problem.id });
                            if (errors.problem) setErrors({ ...errors, problem: false });
                          }}
                        />
                        {t(problem.name)}
                      </label>
                    ))}
                  </div>
                  {errors.problem ? <p className="s9-error" id="s9-problem-error" role="alert"><i className="s9-sq" aria-hidden="true" />{t(TAKE.problemError)}</p> : null}
                </div>
                <button className="s9-btn s9-btn--solid" type="submit">{fill(t(TAKE.submit), { n: pad(nextNumber) })}</button>
              </form>
            )}
          </div>
        </section>

        <section className="s9-section" id="s9-parts" aria-labelledby="s9-parts-title">
          <div className="s9-head">
            <h2 id="s9-parts-title">{t(PARTS.title)}</h2>
            <p className="s9-intro">{t(PARTS.intro)}</p>
          </div>
          <ul className="s9-cabinet">
            {DRAWERS.map((drawer) => (
              <li key={drawer.part.en} className={drawer.level ? `is-${drawer.level}` : undefined}>
                <b className="s9-count s9-num">{drawer.count}<span className="s9-sr"> {t(PARTS.inStock)}</span></b>
                <span className="s9-part">{t(drawer.part)}</span>
                <span className="s9-fits">{t(drawer.fits)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="s9-section" id="s9-find" aria-labelledby="s9-find-title">
          <div className="s9-head">
            <h2 id="s9-find-title">{t(FIND.title)}</h2>
            <p className="s9-intro">{t(FIND.intro)}</p>
          </div>
          <div className="s9-find">
            <div>
              <div className="s9-plan" role="img" aria-label={t(FIND.plan)}>
                {ROWS.map((row, index) => (
                  <Fragment key={row}>
                    <b className={`s9-rl${row === 'C' ? ' s9-rl--c' : ''}`} style={{ gridRow: index * 2 + 1 }}>{row}</b>
                    <i className="s9-strip" style={{ gridRow: index * 2 + 1 }} />
                  </Fragment>
                ))}
                <i className="s9-aisle" />
                <i className="s9-corner" />
                <i className="s9-stall" />
                <i className="s9-gate" />
                <span className="s9-gate-label">{t(FIND.gate)}</span>
                <svg className="s9-route" viewBox="0 0 18 27" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M1.5 25.6 V14 H15.5 V13" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
              <ul className="s9-legend">
                <li><i className="s9-legend__stall" aria-hidden="true" />{t(FIND.keyStall)}</li>
                <li><i className="s9-legend__corner" aria-hidden="true" />{t(FIND.keyCorner)}</li>
                <li><i className="s9-legend__walk" aria-hidden="true" />{t(FIND.keyWalk)}</li>
              </ul>
            </div>
            <div>
              <p className="s9-addr"><span>{t(FIND.row)}</span> <span>{t(FIND.stall)}</span></p>
              <p className="s9-where">{t(FIND.where)}</p>
              <ol className="s9-steps" aria-label={t(FIND.steps)}>
                {STEPS.map((step) => <li key={step.en}>{t(step)}</li>)}
              </ol>
              <p className="s9-closed"><b>{t(FIND.closed)}</b> {t(FIND.closedNote)}</p>
            </div>
          </div>
        </section>

        <footer className="s9-foot">
          <p><b>{NAME}</b>{t(FOOT.address)}</p>
          <p><b>{t(FOOT.hours)}</b>{t(FOOT.hoursValue)}</p>
          <p><b>{t(FOOT.messages)}</b>{t(FOOT.messagesValue)}</p>
        </footer>
      </div>
    </FusionShell>
  );
}
