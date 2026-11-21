import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { flushSync } from 'react-dom';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedFusionStudioPixelPage.css';

// The page of Oktop, an eleven-person design and engineering studio in Mapo, Seoul, in the
// Studio Pixel style. Readex Pro (on its HEXP axis) says what the studio says; Jersey 10, the
// low-resolution cut of a sports-shirt numeral, sets every number the studio commits to:
// weeks, dates, prices, years and results, and the second line of the headline.
// Components come from the studio's own working surface: the board of taped job tickets
// (colour = kind of work), a scope sheet on a 20-week ruler, a project track, a price ladder
// beside a quote that was sent, a work index, and the slot calendar with the brief form.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;
type KindId = 'brand' | 'web' | 'desk' | 'mob';

const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key]));

const NAME = 'Oktop';
const EMAIL = 'hello@oktop.studio';
const PHONE = '+82 2 3142 0716';

const HEAD = {
  nav: { en: 'Oktop', ko: 'Oktop', ja: 'Oktop' },
  services: { en: 'Services', ko: 'Services', ja: 'Services' },
  process: { en: 'Process', ko: 'Process', ja: 'Process' },
  prices: { en: 'Prices', ko: 'Prices', ja: 'Prices' },
  work: { en: 'Work', ko: 'Work', ja: 'Work' },
  start: { en: 'Start a project', ko: 'Start a project', ja: 'Start a project' },
} satisfies Record<string, Tri>;

const HERO = {
  strip: {
    en: 'Branding / Websites / Desktop apps / Mobile apps',
    ko: 'Branding / Websites / Desktop apps / Mobile apps',
    ja: 'Branding / Websites / Desktop apps / Mobile apps',
  },
  titleA: { en: 'Brands, sites and apps', ko: 'Brands, sites and apps', ja: 'Brands, sites and apps' },
  titleB: { en: 'for teams of 5 to 50.', ko: 'for teams of 5 to 50.', ja: 'for teams of 5 to 50.' },
  lede: {
    en: 'Oktop is eleven designers and engineers in a rooftop office in Mapo, Seoul. We run up to six projects at a time and stay with each one from the first logo sketch to the app in the store.',
    ko: 'Oktop is eleven designers and engineers in a rooftop office in Mapo, Seoul. We run up to six projects at a time and stay with each one from the first logo sketch to the app in the store.',
    ja: 'Oktop is eleven designers and engineers in a rooftop office in Mapo, Seoul. We run up to six projects at a time and stay with each one from the first logo sketch to the app in the store.',
  },
  prices: { en: 'See prices', ko: 'See prices', ja: 'See prices' },
} satisfies Record<string, Tri>;

const BOARD = {
  rail: { en: 'On the board, week 47', ko: 'On the board, week 47', ja: 'On the board, week 47' },
  nextStart: { en: 'Next start', ko: 'Next start', ja: 'Next start' },
  nextDate: { en: '12 Jan', ko: '12 Jan', ja: '12 Jan' },
  weeks: { en: 'weeks', ko: 'weeks', ja: 'weeks' },
  weekOf: { en: 'week {done} of {total}', ko: 'week {done} of {total}', ja: 'week {done} of {total}' },
  next: { en: 'Next on {client}', ko: 'Next on {client}', ja: 'Next on {client}' },
  announce: { en: '{date}: {news}', ko: '{date}: {news}', ja: '{date}: {news}' },
} satisfies Record<string, Tri>;

const KIND_NAMES: Record<KindId, Tri> = {
  brand: { en: 'Branding', ko: 'Branding', ja: 'Branding' },
  web: { en: 'Website', ko: 'Website', ja: 'Website' },
  desk: { en: 'Desktop app', ko: 'Desktop app', ja: 'Desktop app' },
  mob: { en: 'Mobile app', ko: 'Mobile app', ja: 'Mobile app' },
};

interface Ticket {
  id: string;
  kind: KindId;
  client: string;
  done: number;
  total: number;
  what: Tri;
  date: Tri;
  news: Tri;
}

const TICKETS: Ticket[] = [
  {
    id: 'oda',
    kind: 'brand',
    client: 'Oda Bakery',
    done: 4,
    total: 6,
    what: { en: 'Name, logo and boxes for three shops', ko: 'Name, logo and boxes for three shops', ja: 'Name, logo and boxes for three shops' },
    date: { en: '4 Dec', ko: '4 Dec', ja: '4 Dec' },
    news: {
      en: 'Oda Bakery’s cake boxes go to the printer. Ji‑woo Han leads the identity.',
      ko: 'Oda Bakery’s cake boxes go to the printer. Ji‑woo Han leads the identity.',
      ja: 'Oda Bakery’s cake boxes go to the printer. Ji‑woo Han leads the identity.',
    },
  },
  {
    id: 'haru',
    kind: 'web',
    client: 'Haru Dental',
    done: 7,
    total: 10,
    what: { en: 'Booking site in Korean and English', ko: 'Booking site in Korean and English', ja: 'Booking site in Korean and English' },
    date: { en: '9 Dec', ko: '9 Dec', ja: '9 Dec' },
    news: {
      en: 'Haru Dental’s booking site goes live. Seo‑yeon Kim leads the design.',
      ko: 'Haru Dental’s booking site goes live. Seo‑yeon Kim leads the design.',
      ja: 'Haru Dental’s booking site goes live. Seo‑yeon Kim leads the design.',
    },
  },
  {
    id: 'linefeed',
    kind: 'desk',
    client: 'Linefeed',
    done: 11,
    total: 16,
    what: { en: 'Version 3 of their invoicing app', ko: 'Version 3 of their invoicing app', ja: 'Version 3 of their invoicing app' },
    date: { en: '15 Dec', ko: '15 Dec', ja: '15 Dec' },
    news: {
      en: 'Linefeed’s beta goes out to 40 customers. Tae‑hoon Park leads the build.',
      ko: 'Linefeed’s beta goes out to 40 customers. Tae‑hoon Park leads the build.',
      ja: 'Linefeed’s beta goes out to 40 customers. Tae‑hoon Park leads the build.',
    },
  },
  {
    id: 'bom',
    kind: 'mob',
    client: 'Bom Bikes',
    done: 2,
    total: 14,
    what: { en: 'Rental app for iOS and Android', ko: 'Rental app for iOS and Android', ja: 'Rental app for iOS and Android' },
    date: { en: '26 Nov', ko: '26 Nov', ja: '26 Nov' },
    news: {
      en: 'Bom Bikes reviews the first two directions. Hana Yoon leads the design.',
      ko: 'Bom Bikes reviews the first two directions. Hana Yoon leads the design.',
      ja: 'Bom Bikes reviews the first two directions. Hana Yoon leads the design.',
    },
  },
];

/** A row of square cells: `filled` solid, then `range` hatched, then empty, `total` in all. */
function Cells({ total, filled, range = 0, now }: { total: number; filled: number; range?: number; now?: number }) {
  return (
    <span className="ok-cells" style={{ '--n': total } as CSSProperties} aria-hidden="true">
      {Array.from({ length: total }, (_, index) => {
        const state = index === now ? 'is-now' : index < filled ? 'is-f' : index < filled + range ? 'is-r' : undefined;
        return <i key={index} className={state} />;
      })}
    </span>
  );
}

/** Jersey 10 has no won sign, so it is set apart in the text face. */
function Money({ value }: { value: string }) {
  return (
    <>
      {value.split('₩').flatMap((part, index) => (index === 0 ? [part] : [<span key={index} className="ok-won">₩</span>, part]))}
    </>
  );
}

const SERVICES = {
  title: { en: 'What we make', ko: 'What we make', ja: 'What we make' },
  note: {
    en: 'Four kinds of work. Most clients come for one of them and return for a second within two years. Each bar counts the weeks a project usually takes.',
    ko: 'Four kinds of work. Most clients come for one of them and return for a second within two years. Each bar counts the weeks a project usually takes.',
    ja: 'Four kinds of work. Most clients come for one of them and return for a second within two years. Each bar counts the weeks a project usually takes.',
  },
  weeks: { en: 'weeks', ko: 'weeks', ja: 'weeks' },
  rows: [
    {
      kind: 'brand' as KindId,
      name: { en: 'Branding', ko: 'Branding', ja: 'Branding' },
      body: {
        en: 'Name check, logo, type and colours, packaging or signage, and a guide your own team can follow.',
        ko: 'Name check, logo, type and colours, packaging or signage, and a guide your own team can follow.',
        ja: 'Name check, logo, type and colours, packaging or signage, and a guide your own team can follow.',
      },
      from: 6,
      to: 8,
    },
    {
      kind: 'web' as KindId,
      name: { en: 'Websites', ko: 'Websites', ja: 'Websites' },
      body: {
        en: 'Page structure, copy editing, design, and a build on a CMS your team can update. Korean and English as standard.',
        ko: 'Page structure, copy editing, design, and a build on a CMS your team can update. Korean and English as standard.',
        ja: 'Page structure, copy editing, design, and a build on a CMS your team can update. Korean and English as standard.',
      },
      from: 8,
      to: 12,
    },
    {
      kind: 'desk' as KindId,
      name: { en: 'Desktop apps', ko: 'Desktop apps', ja: 'Desktop apps' },
      body: {
        en: 'Internal tools and paid apps for Mac and Windows, with sign-in, payments and automatic updates.',
        ko: 'Internal tools and paid apps for Mac and Windows, with sign-in, payments and automatic updates.',
        ja: 'Internal tools and paid apps for Mac and Windows, with sign-in, payments and automatic updates.',
      },
      from: 12,
      to: 20,
    },
    {
      kind: 'mob' as KindId,
      name: { en: 'Mobile apps', ko: 'Mobile apps', ja: 'Mobile apps' },
      body: {
        en: 'One codebase for iOS and Android, the store listings, and the first two updates after launch.',
        ko: 'One codebase for iOS and Android, the store listings, and the first two updates after launch.',
        ja: 'One codebase for iOS and Android, the store listings, and the first two updates after launch.',
      },
      from: 10,
      to: 16,
    },
  ],
};

const RULER = [1, 5, 10, 15, 20];

const PROCESS = {
  title: { en: 'How a project runs', ko: 'How a project runs', ja: 'How a project runs' },
  note: {
    en: 'Every project goes through the same four steps. This is the Haru Dental website, ten weeks long. Apps spend more time in step 3.',
    ko: 'Every project goes through the same four steps. This is the Haru Dental website, ten weeks long. Apps spend more time in step 3.',
    ja: 'Every project goes through the same four steps. This is the Haru Dental website, ten weeks long. Apps spend more time in step 3.',
  },
  track: { en: 'Haru Dental website, ten weeks', ko: 'Haru Dental website, ten weeks', ja: 'Haru Dental website, ten weeks' },
  nowSr: { en: ', now in week 7', ko: ', now in week 7', ja: ', now in week 7' },
  nowLead: { en: 'This is week 7.', ko: 'This is week 7.', ja: 'This is week 7.' },
  nowBody: { en: 'The engineers are building the booking flow.', ko: 'The engineers are building the booking flow.', ja: 'The engineers are building the booking flow.' },
  youGet: { en: 'You get', ko: 'You get', ja: 'You get' },
  track4: [
    { weeks: { en: 'Week 1', ko: 'Week 1', ja: 'Week 1' }, total: 1, filled: 1 },
    { weeks: { en: 'Weeks 2–4', ko: 'Weeks 2–4', ja: 'Weeks 2–4' }, total: 3, filled: 3 },
    { weeks: { en: 'Weeks 5–9', ko: 'Weeks 5–9', ja: 'Weeks 5–9' }, total: 5, filled: 2, now: 2 },
    { weeks: { en: 'Week 10', ko: 'Week 10', ja: 'Week 10' }, total: 1, filled: 0 },
  ],
  steps: [
    {
      name: { en: 'Kickoff', ko: 'Kickoff', ja: 'Kickoff' },
      length: { en: '1 week', ko: '1 week', ja: '1 week' },
      body: {
        en: 'Two half-day workshops at our office or yours. We meet the people who will use what we make and agree on scope, budget and a launch date.',
        ko: 'Two half-day workshops at our office or yours. We meet the people who will use what we make and agree on scope, budget and a launch date.',
        ja: 'Two half-day workshops at our office or yours. We meet the people who will use what we make and agree on scope, budget and a launch date.',
      },
      get: { en: 'a two-page brief and a fixed quote.', ko: 'a two-page brief and a fixed quote.', ja: 'a two-page brief and a fixed quote.' },
    },
    {
      name: { en: 'Design', ko: 'Design', ja: 'Design' },
      length: { en: '3 to 5 weeks', ko: '3 to 5 weeks', ja: '3 to 5 weeks' },
      body: {
        en: 'Two directions in the first fortnight, then we develop one. We review together every Thursday at 10:00, here or on a call.',
        ko: 'Two directions in the first fortnight, then we develop one. We review together every Thursday at 10:00, here or on a call.',
        ja: 'Two directions in the first fortnight, then we develop one. We review together every Thursday at 10:00, here or on a call.',
      },
      get: { en: 'approved screens and a prototype you can click through.', ko: 'approved screens and a prototype you can click through.', ja: 'approved screens and a prototype you can click through.' },
    },
    {
      name: { en: 'Build', ko: 'Build', ja: 'Build' },
      length: { en: '4 to 12 weeks', ko: '4 to 12 weeks', ja: '4 to 12 weeks' },
      body: {
        en: 'Every Friday the engineers send a link to the working build. You test it on your own phone and laptop.',
        ko: 'Every Friday the engineers send a link to the working build. You test it on your own phone and laptop.',
        ja: 'Every Friday the engineers send a link to the working build. You test it on your own phone and laptop.',
      },
      get: { en: 'the finished site or app, tested on 14 devices.', ko: 'the finished site or app, tested on 14 devices.', ja: 'the finished site or app, tested on 14 devices.' },
    },
    {
      name: { en: 'Launch and care', ko: 'Launch and care', ja: 'Launch and care' },
      length: { en: 'Launch day and 30 days', ko: 'Launch day and 30 days', ja: 'Launch day and 30 days' },
      body: {
        en: 'We launch with you, then fix anything that breaks in the first 30 days at no charge.',
        ko: 'We launch with you, then fix anything that breaks in the first 30 days at no charge.',
        ja: 'We launch with you, then fix anything that breaks in the first 30 days at no charge.',
      },
      get: { en: 'the source code, the design files and every password.', ko: 'the source code, the design files and every password.', ja: 'the source code, the design files and every password.' },
    },
  ],
};

const PRICES = {
  title: { en: 'Three ways to work with us', ko: 'Three ways to work with us', ja: 'Three ways to work with us' },
  note: {
    en: 'Prices are in Korean won and exclude VAT. Every project starts with a kickoff, ₩3M, which comes off the price if you go ahead with us.',
    ko: 'Prices are in Korean won and exclude VAT. Every project starts with a kickoff, ₩3M, which comes off the price if you go ahead with us.',
    ja: 'Prices are in Korean won and exclude VAT. Every project starts with a kickoff, ₩3M, which comes off the price if you go ahead with us.',
  },
  fixed: { en: 'Fixed project', ko: 'Fixed project', ja: 'Fixed project' },
  fixedBody: {
    en: 'Scope and price are fixed after the kickoff. You pay in three parts: at the start, after design, and at launch.',
    ko: 'Scope and price are fixed after the kickoff. You pay in three parts: at the start, after design, and at launch.',
    ja: 'Scope and price are fixed after the kickoff. You pay in three parts: at the start, after design, and at launch.',
  },
  ladder: { en: 'Fixed project prices', ko: 'Fixed project prices', ja: 'Fixed project prices' },
  team: { en: 'Monthly team', ko: 'Monthly team', ja: 'Monthly team' },
  teamBody: {
    en: 'One designer and one engineer, four days a week, for three months or more. For products that change every month.',
    ko: 'One designer and one engineer, four days a week, for three months or more. For products that change every month.',
    ja: 'One designer and one engineer, four days a week, for three months or more. For products that change every month.',
  },
  care: { en: 'Care plan', ko: 'Care plan', ja: 'Care plan' },
  careBody: {
    en: 'Up to 12 hours a month of fixes and small changes after launch. We reply within one working day.',
    ko: 'Up to 12 hours a month of fixes and small changes after launch. We reply within one working day.',
    ja: 'Up to 12 hours a month of fixes and small changes after launch. We reply within one working day.',
  },
  aMonth: { en: 'a month', ko: 'a month', ja: 'a month' },
  quoteLabel: { en: 'A quote we sent', ko: 'A quote we sent', ja: 'A quote we sent' },
  sent: { en: 'Sent 2 September 2026', ko: 'Sent 2 September 2026', ja: 'Sent 2 September 2026' },
  accepted: { en: 'Accepted 9 September', ko: 'Accepted 9 September', ja: 'Accepted 9 September' },
  quoteTitle: { en: 'Haru Dental, booking website', ko: 'Haru Dental, booking website', ja: 'Haru Dental, booking website' },
  pay: {
    en: '₩14.8M on signing, ₩11.1M when design is approved, ₩11.1M at launch.',
    ko: '₩14.8M on signing, ₩11.1M when design is approved, ₩11.1M at launch.',
    ja: '₩14.8M on signing, ₩11.1M when design is approved, ₩11.1M at launch.',
  },
} satisfies Record<string, Tri>;

const LADDER: Array<{ kind: KindId; price: string }> = [
  { kind: 'brand', price: '₩18–30M' },
  { kind: 'web', price: '₩30–60M' },
  { kind: 'mob', price: '₩60–140M' },
  { kind: 'desk', price: '₩70–160M' },
];

const QUOTE: Array<{ item: Tri; amount: string }> = [
  { item: { en: 'Kickoff, two workshops', ko: 'Kickoff, two workshops', ja: 'Kickoff, two workshops' }, amount: '₩3,000,000' },
  { item: { en: 'Design, 3 weeks', ko: 'Design, 3 weeks', ja: 'Design, 3 weeks' }, amount: '₩12,000,000' },
  { item: { en: 'Build, 5 weeks', ko: 'Build, 5 weeks', ja: 'Build, 5 weeks' }, amount: '₩21,000,000' },
  { item: { en: 'Launch and 30 days of fixes', ko: 'Launch and 30 days of fixes', ja: 'Launch and 30 days of fixes' }, amount: '₩4,000,000' },
  { item: { en: 'Kickoff credit', ko: 'Kickoff credit', ja: 'Kickoff credit' }, amount: '−₩3,000,000' },
];

const QUOTE_TOTAL = { item: { en: 'Total, before VAT', ko: 'Total, before VAT', ja: 'Total, before VAT' }, amount: '₩37,000,000' };

const WORK = {
  title: { en: 'Selected work', ko: 'Selected work', ja: 'Selected work' },
  note: {
    en: 'Thirty-one projects since we opened in 2016. These are six from the last four years, with a number each client was happy to share.',
    ko: 'Thirty-one projects since we opened in 2016. These are six from the last four years, with a number each client was happy to share.',
    ja: 'Thirty-one projects since we opened in 2016. These are six from the last four years, with a number each client was happy to share.',
  },
  year: { en: 'Year', ko: 'Year', ja: 'Year' },
  client: { en: 'Client', ko: 'Client', ja: 'Client' },
  made: { en: 'What we made', ko: 'What we made', ja: 'What we made' },
  result: { en: 'Result', ko: 'Result', ja: 'Result' },
} satisfies Record<string, Tri>;

const WORK_ROWS: Array<{ year: string; client: string; what: Tri; kinds: KindId[]; figure: string; unit: Tri }> = [
  {
    year: '2026',
    client: 'Danbi Climbing',
    what: { en: 'Membership app with day passes and a QR door check, for four gyms.', ko: 'Membership app with day passes and a QR door check, for four gyms.', ja: 'Membership app with day passes and a QR door check, for four gyms.' },
    kinds: ['mob'],
    figure: '11,200',
    unit: { en: 'members', ko: 'members', ja: 'members' },
  },
  {
    year: '2025',
    client: 'Linefeed',
    what: { en: 'Name, logo and the first version of their invoicing app for Mac and Windows.', ko: 'Name, logo and the first version of their invoicing app for Mac and Windows.', ja: 'Name, logo and the first version of their invoicing app for Mac and Windows.' },
    kinds: ['brand', 'desk'],
    figure: '4,200',
    unit: { en: 'paying teams', ko: 'paying teams', ja: 'paying teams' },
  },
  {
    year: '2025',
    client: 'Namu Coffee',
    what: { en: 'A new look for nine cafés, from cups to signs, and a stamp-card app.', ko: 'A new look for nine cafés, from cups to signs, and a stamp-card app.', ja: 'A new look for nine cafés, from cups to signs, and a stamp-card app.' },
    kinds: ['brand', 'mob'],
    figure: '9',
    unit: { en: 'cafés', ko: 'cafés', ja: 'cafés' },
  },
  {
    year: '2024',
    client: 'Weave Rooms',
    what: { en: 'Website and meeting-room booking for six coworking floors.', ko: 'Website and meeting-room booking for six coworking floors.', ja: 'Website and meeting-room booking for six coworking floors.' },
    kinds: ['web'],
    figure: '38%',
    unit: { en: 'booked online', ko: 'booked online', ja: 'booked online' },
  },
  {
    year: '2023',
    client: 'Saebyeok Freight',
    what: { en: 'Dispatch app for Windows, used by the office team that routes 120 drivers.', ko: 'Dispatch app for Windows, used by the office team that routes 120 drivers.', ja: 'Dispatch app for Windows, used by the office team that routes 120 drivers.' },
    kinds: ['desk'],
    figure: '120',
    unit: { en: 'drivers', ko: 'drivers', ja: 'drivers' },
  },
  {
    year: '2022',
    client: 'Gongbang Tools',
    what: { en: 'Brand and online shop for a family hand-tool maker in Incheon.', ko: 'Brand and online shop for a family hand-tool maker in Incheon.', ja: 'Brand and online shop for a family hand-tool maker in Incheon.' },
    kinds: ['brand', 'web'],
    figure: '3×',
    unit: { en: 'online sales', ko: 'online sales', ja: 'online sales' },
  },
];

interface Month {
  id: string;
  short: string;
  name: Tri;
  booked: number;
}

const MONTHS: Month[] = [
  { id: 'dec', short: 'Dec', name: { en: 'December 2026', ko: 'December 2026', ja: 'December 2026' }, booked: 3 },
  { id: 'jan', short: 'Jan', name: { en: 'January 2027', ko: 'January 2027', ja: 'January 2027' }, booked: 2 },
  { id: 'feb', short: 'Feb', name: { en: 'February 2027', ko: 'February 2027', ja: 'February 2027' }, booked: 1 },
  { id: 'mar', short: 'Mar', name: { en: 'March 2027', ko: 'March 2027', ja: 'March 2027' }, booked: 0 },
  { id: 'apr', short: 'Apr', name: { en: 'April 2027', ko: 'April 2027', ja: 'April 2027' }, booked: 0 },
];

const SLOTS_PER_MONTH = 3;

const BUDGETS: Array<{ id: string; label: Tri }> = [
  { id: 'under-30', label: { en: 'Under ₩30M', ko: 'Under ₩30M', ja: 'Under ₩30M' } },
  { id: '30-60', label: { en: '₩30M to ₩60M', ko: '₩30M to ₩60M', ja: '₩30M to ₩60M' } },
  { id: '60-100', label: { en: '₩60M to ₩100M', ko: '₩60M to ₩100M', ja: '₩60M to ₩100M' } },
  { id: 'over-100', label: { en: 'Over ₩100M', ko: 'Over ₩100M', ja: 'Over ₩100M' } },
  { id: 'unsure', label: { en: 'Not sure yet', ko: 'Not sure yet', ja: 'Not sure yet' } },
];

const KIND_ORDER: KindId[] = ['brand', 'web', 'desk', 'mob'];

const START = {
  title: { en: 'Start a project', ko: 'Start a project', ja: 'Start a project' },
  note: {
    en: 'Pick a month, then tell us what you need and a budget range. We reply within two working days with a time for a 30‑minute call.',
    ko: 'Pick a month, then tell us what you need and a budget range. We reply within two working days with a time for a 30‑minute call.',
    ja: 'Pick a month, then tell us what you need and a budget range. We reply within two working days with a time for a 30‑minute call.',
  },
  slots: { en: 'Project slots', ko: 'Project slots', ja: 'Project slots' },
  nextOpening: { en: 'Next opening', ko: 'Next opening', ja: 'Next opening' },
  full: { en: 'Full', ko: 'Full', ja: 'Full' },
  open: { en: '{n} open', ko: '{n} open', ja: '{n} open' },
  booked: { en: 'Booked', ko: 'Booked', ja: 'Booked' },
  openKey: { en: 'Open', ko: 'Open', ja: 'Open' },
  cap: { en: 'We start at most three projects a month.', ko: 'We start at most three projects a month.', ja: 'We start at most three projects a month.' },
  held: {
    en: 'Your month is pencilled in. To choose another, edit the brief.',
    ko: 'Your month is pencilled in. To choose another, edit the brief.',
    ja: 'Your month is pencilled in. To choose another, edit the brief.',
  },
  name: { en: 'Your name', ko: 'Your name', ja: 'Your name' },
  email: { en: 'Email', ko: 'Email', ja: 'Email' },
  kinds: { en: 'What do you need?', ko: 'What do you need?', ja: 'What do you need?' },
  budget: { en: 'Budget range', ko: 'Budget range', ja: 'Budget range' },
  budgetPick: { en: 'Choose a range', ko: 'Choose a range', ja: 'Choose a range' },
  when: { en: 'Start', ko: 'Start', ja: 'Start' },
  whenNone: { en: 'pick an open month in the calendar', ko: 'pick an open month in the calendar', ja: 'pick an open month in the calendar' },
  send: { en: 'Send the brief', ko: 'Send the brief', ja: 'Send the brief' },
  errName: { en: 'Write your name, so we know who to reply to.', ko: 'Write your name, so we know who to reply to.', ja: 'Write your name, so we know who to reply to.' },
  errEmail: { en: 'Write an email address like name@company.com.', ko: 'Write an email address like name@company.com.', ja: 'Write an email address like name@company.com.' },
  errKinds: { en: 'Choose at least one kind of work.', ko: 'Choose at least one kind of work.', ja: 'Choose at least one kind of work.' },
  errBudget: { en: 'Choose a budget range. Not sure yet is fine.', ko: 'Choose a budget range. Not sure yet is fine.', ja: 'Choose a budget range. Not sure yet is fine.' },
  errMonth: { en: 'Choose an open month in the calendar.', ko: 'Choose an open month in the calendar.', ja: 'Choose an open month in the calendar.' },
  doneTitle: { en: 'Thank you, {name}. Your brief is with us.', ko: 'Thank you, {name}. Your brief is with us.', ja: 'Thank you, {name}. Your brief is with us.' },
  doneBody: {
    en: 'Min‑jae Oh will write to {email} within two working days with a time for a 30‑minute call. We have pencilled you in for {month}.',
    ko: 'Min‑jae Oh will write to {email} within two working days with a time for a 30‑minute call. We have pencilled you in for {month}.',
    ja: 'Min‑jae Oh will write to {email} within two working days with a time for a 30‑minute call. We have pencilled you in for {month}.',
  },
  doneWork: { en: 'Work', ko: 'Work', ja: 'Work' },
  doneBudget: { en: 'Budget', ko: 'Budget', ja: 'Budget' },
  edit: { en: 'Edit the brief', ko: 'Edit the brief', ja: 'Edit the brief' },
  writeTo: { en: 'Or write to us', ko: 'Or write to us', ja: 'Or write to us' },
  phone: { en: 'Phone', ko: 'Phone', ja: 'Phone' },
  hours: { en: 'Office hours', ko: 'Office hours', ja: 'Office hours' },
  hoursValue: { en: 'Monday to Friday, 10:00 to 18:00', ko: 'Monday to Friday, 10:00 to 18:00', ja: 'Monday to Friday, 10:00 to 18:00' },
  visit: { en: 'Visit', ko: 'Visit', ja: 'Visit' },
  visitValue: { en: 'Rooftop, 22 Wausan-ro 21-gil, Mapo‑gu, Seoul', ko: 'Rooftop, 22 Wausan-ro 21-gil, Mapo‑gu, Seoul', ja: 'Rooftop, 22 Wausan-ro 21-gil, Mapo‑gu, Seoul' },
  askFor: { en: 'Ask for', ko: 'Ask for', ja: 'Ask for' },
  askForValue: { en: 'Min‑jae Oh, studio lead', ko: 'Min‑jae Oh, studio lead', ja: 'Min‑jae Oh, studio lead' },
} satisfies Record<string, Tri>;

const FOOT = {
  where: { en: 'Oktop Studio, Mapo‑gu, Seoul', ko: 'Oktop Studio, Mapo‑gu, Seoul', ja: 'Oktop Studio, Mapo‑gu, Seoul' },
  reg: { en: 'Business registration 105-88-41207', ko: 'Business registration 105-88-41207', ja: 'Business registration 105-88-41207' },
} satisfies Record<string, Tri>;

const PROMPT_EN = `Design one real page in the Studio Pixel style: a warm cream studio page drawn with 2px ink lines and hard ink offset shadows, a wide rounded sans for what the studio says, a low-resolution pixel numeral for every number it commits to, and four colours that each mean one kind of work.

Pick a believable subject that sells made work on a schedule, such as a small design and engineering studio, a print workshop or a sign maker, and write its real content. The page must read as that subject's page, never as a page about its own style. Here it is Oktop, eleven designers and engineers in a rooftop office in Mapo, Seoul: the jobs on their board this week, what they make, how a project runs, their prices and a quote they sent, selected work, and the slot calendar with a project brief.

TOKENS:
--bg: #fff4ee (under a 96px grid of 1px ink lines at 4.5% and 3.5%)
--paper: #fffdf9 (the board, the track, the quote, the slot calendar, form fields; also the opaque surface for menus)
--ink: #080604
--muted: #5f5651
--faint: rgba(8,6,4,0.3) (ruled lines inside lists, empty ruler cells)
--red: #cc4639 (the square before the studio's name, the service strip, buttons, the stamp, the current step, step numbers, open slots, the next opening, invalid fields and the error marker)
--teal: #2f8b8e (the board's side rail and the focus ring)
--brand: #f2aca1, --web: #d8665a, --desk: #739ed0, --mob: #36a3a5 (one per kind of work)

COLOUR:
- Each kind of work keeps its colour everywhere: its ticket, the date in the strip under the board, its key square, its bar on the ruler, its rung on the price ladder, its line in the work index and its ticked checkbox in the brief.
- Red is for action and for what comes next; teal only for the rail and the focus ring. Text on the four kind colours is ink (5.7:1 or more); text on red and on ink is paper; red text only at 24px and up.
- No other colours. Textures are ink, cream or red at low opacity: the page and board grids, tape (cream at 82% with fine ink lines), the dotted perforation on each ticket, the dashed inner line of the board, a huge "Ok" in red at 8% behind the hero copy. Errors are ink text after a red square. Hover moves buttons and tickets up and left with a longer shadow, underlines links or thickens their underline, and tints calendar rows with --bg.
- Structural edges are 2px ink lines; ruled lines inside lists are 2px --faint.

TYPOGRAPHY:
Two families. Readex Pro (300 to 700, HEXP axis at 36 on headings and names) says what the studio says. Jersey 10 (400) sets every number the studio commits to (weeks, dates, prices, years, results, step numbers, months), the studio's name, the service strip and the second line of the headline. Jersey 10 has no won sign: ₩ is set in Readex Pro 600 at max(1rem, 0.62em) beside the figures.
H1, two lines. Readex Pro 700, line-height 0.98, letter-spacing -0.035em: clamp(2.3rem, 4.6vw, 3.75rem) beside the board, clamp(2.3rem, 6.6vw, 4.25rem) below 1200px. Then Jersey 10, line-height 0.8, letter-spacing 0.01em: clamp(3.9rem, 7.6vw, 6.1rem) beside the board, clamp(3.9rem, 11.6vw, 7.8rem) below 1200px, 3.25rem with line-height 0.86 below 360px.
H2: Readex Pro 700, clamp(2rem, 4vw, 3.4rem), line-height 1, letter-spacing -0.035em, balanced. H3: Readex Pro 600, 1.3rem, line-height 1.15, letter-spacing -0.02em.
Jersey 10 sizes: the studio's name 2.5rem (2.1rem on phones); the service strip 1.75rem, clamp(1.4rem, 2.05vw, 1.65rem) beside the board; ticket weeks 2.1rem; the stamp's date 3rem; the rail 1.6rem (1.5rem on phones); the date in the strip 1.8rem; step numbers and the next opening 4.6rem (3.9rem on phones); track numbers 4.6rem in a row and at the price size once the blocks stack; prices, results, week ranges and the quote number 2.6rem (2rem on phones); years 3rem; months 2.1rem; quote lines 1.5rem; ruler marks 1.25rem.
Body: Readex Pro 300 at 1.03rem, line-height 1.68; the lede 1.125rem; client names in the work index and the calendar's title 600 at 1.3rem; ticket names 600 at 1.0625rem; kinds, labels, buttons and "weeks" 600 at 1rem; ticket lines and notes 400 at 1rem. No text under 1rem. No all-caps tracked labels.

LAYOUT:
- The studio's own bar on a 2px ink rule: the name in Jersey after a red square with a 4px ink offset, four in-page links, one "Start a project" button.
- Hero on a 1120px column, two columns from 1200px (0.88fr and 1.12fr, 48px apart): on the left the red service strip, the two-line headline, a lede and two actions; on the right the board, with the whole headline and board on the first screen of a 1280x800 laptop. Below 1200px the board goes under the copy, at most 620px wide.
- Then: the scope sheet (name and line on the left, the bar on a shared 20-week ruler on the right), the project track and four steps, the price ladder beside the taped quote, the work index, and the slot calendar beside the brief form with the contact details under them. Sections are 96px apart (72px below 860px), each on a 2px ink rule.

COMPONENTS:
- The board: a paper sheet on a 38px grid with a dashed inner line, turned 1deg (0.8deg on phones), two pieces of tape, a red "Next start 12 Jan" stamp turned -7deg over its top-left corner, a 38px teal rail on the right with "On the board, week 47" set vertically, and four job tickets in two columns (one on phones). Each ticket is a toggle button (aria-pressed) in its kind's colour, turned between -2.6deg and 2.4deg, with a strip of tape and a perforated left edge: the kind, the weeks done as a pixel figure over the word "weeks", the client, a row of square cells (ink for weeks done) and one line about the job. The chosen ticket lifts (translate -5px -7px, turned 1deg, a 14px shadow and a 3px ink outline 5px out). The ink strip under the tickets shows the chosen job's next date on its colour and what happens then; a change is announced politely.
- Scope sheet: each service on a row of 20 square cells (filled in its colour for the usual weeks, hatched for the range, empty cells on --faint) with the range in pixel figures.
- Project track: an ordered list of four blocks sized 1:3:5:1 by weeks on paper; the current one is red with this week drawn as a raised paper cell. Below 1080px the blocks become rows. Four steps underneath: number, name, length, what happens, and "You get" over a 2px rule.
- Price ladder: a fixed-price model with rows of key square, kind and price range, then two monthly models with their price on the right. The quote: paper, turned 1.4deg, taped, its number in pixels, a ruled list of lines with the amounts and an ink-ruled total.
- Work index: a table (explicit roles, column headers for assistive technology) of year, client and what was made, kinds with key squares, and the result. Below 860px each row stacks with the year beside it.
- Slot calendar: a paper panel, the next opening in large red pixels, then one radio group of five months, three 36px square cells each (ink booked, red open); a full month is disabled; the chosen month turns ink with paper text. Brief form: name, email, kind of work (four square checkboxes that fill with the kind colour), budget range (a square select with a drawn chevron), and the chosen month restated above the button. Errors sit under their field (role="alert") and turn its border red; a valid brief replaces the fields with a confirmation that takes focus, and the calendar locks until "Edit the brief".
- Square corners everywhere. Shadows are hard ink offsets with no blur: 5px on buttons, 9px on tickets, the stamp and the track, 14px on the quote and the calendar, 18px on the board (smaller on phones).
- Fields are 52px tall with a 2px ink border on paper; buttons are at least 48px; every control is at least 44px tall on phones.

MOTION:
- Buttons and tickets move on hover and selection with a 140ms transform and shadow change; nothing moves on its own. prefers-reduced-motion removes the transitions.

FORBIDDEN:
- Rounded corners, pills, chips, blurred or soft shadows, gradients other than the grid, tape and hatch textures
- A small label above a heading, all-caps tracked labels, numbers on anything that is not a real sequence
- Pixel-art characters, sprites, scenes or any figurative illustration; emoji
- Colour that does not mean a kind of work, an action or what comes next
- Arrows on links, middle-dot meta strings
- Copy about the page, the style, pixels or design

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML: toggle buttons for the tickets, ordered lists for the track and steps, a table with roles for the work, a radio group for the months, a labelled form
3) Working ticket choice with the strip, month choice, and a form with error and success states
4) Responsive layout down to 320px with no horizontal scroll
5) A visible 3px teal focus ring on every control, reduced-motion support`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_EN, ja: PROMPT_EN };

type Errors = { name: boolean; email: boolean; kinds: boolean; budget: boolean; month: boolean };
const NO_ERRORS: Errors = { name: false, email: false, kinds: false, budget: false, month: false };

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export function PortedFusionStudioPixelPage({ lang }: PortedStylePageProps) {
  const t = (text: Tri) => text[lang];

  const [ticketId, setTicketId] = useState('haru');
  const [ticketNews, setTicketNews] = useState('');
  const [month, setMonth] = useState<string | null>(null);
  const [brief, setBrief] = useState({ name: '', email: '', budget: '' });
  const [kinds, setKinds] = useState<KindId[]>([]);
  const [errors, setErrors] = useState<Errors>(NO_ERRORS);
  const [sent, setSent] = useState(false);
  const slotsRef = useRef<HTMLFieldSetElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const kindsRef = useRef<HTMLFieldSetElement>(null);
  const budgetRef = useRef<HTMLSelectElement>(null);
  const doneRef = useRef<HTMLParagraphElement>(null);
  const wasSent = useRef(false);

  const ticket = TICKETS.find((item) => item.id === ticketId) ?? TICKETS[1];
  const chosenMonth = MONTHS.find((item) => item.id === month) ?? null;
  const nextOpen = MONTHS.find((item) => item.booked < SLOTS_PER_MONTH) ?? MONTHS[0];

  // The fields and the confirmation replace each other, and the control that had focus
  // leaves the page with them. Focus goes to what took its place: the confirmation, or,
  // after "Edit the brief", the first field.
  useEffect(() => {
    if (sent) doneRef.current?.focus();
    else if (wasSent.current) nameRef.current?.focus();
    wasSent.current = sent;
  }, [sent]);

  const chooseTicket = (next: Ticket) => {
    setTicketId(next.id);
    setTicketNews(fill(t(BOARD.announce), { date: t(next.date), news: t(next.news) }));
  };

  const toggleKind = (kind: KindId) => {
    setKinds((list) => (list.includes(kind) ? list.filter((item) => item !== kind) : [...list, kind]));
    if (errors.kinds) setErrors({ ...errors, kinds: false });
  };

  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Errors = {
      month: chosenMonth === null,
      name: brief.name.trim() === '',
      email: !isEmail(brief.email.trim()),
      kinds: kinds.length === 0,
      budget: brief.budget === '',
    };
    if (!Object.values(next).some(Boolean)) {
      setErrors(NO_ERRORS);
      setSent(true);
      return;
    }
    // The errors render first, so the first one can be brought into view with its field.
    flushSync(() => setErrors(next));
    if (next.month) {
      slotsRef.current?.querySelector<HTMLInputElement>('input:not(:disabled)')?.focus();
      slotsRef.current?.scrollIntoView({ block: 'nearest' });
      return;
    }
    const target = next.name ? nameRef.current : next.email ? emailRef.current : next.kinds ? kindsRef.current?.querySelector('input') : budgetRef.current;
    target?.focus();
    target?.closest('.ok-field')?.scrollIntoView({ block: 'nearest' });
  };

  const kindList = KIND_ORDER.filter((kind) => kinds.includes(kind)).map((kind) => t(KIND_NAMES[kind])).join(', ');
  const budgetLabel = BUDGETS.find((item) => item.id === brief.budget);

  return (
    <FusionShell
      fusionId="fusion-studio-pixel"
      lang={lang}
      accent="#cc4639"
      prev={{ href: '/pages/fusion-soft-inflate.html', label: 'Soft Inflate' }}
      prompts={PROMPTS}
    >
      <div className="ok">
        <header className="ok-bar">
          <p className="ok-mark"><i aria-hidden="true" />{NAME}</p>
          <nav className="ok-bar__nav" aria-label={t(HEAD.nav)}>
            <a href="#ok-services">{t(HEAD.services)}</a>
            <a href="#ok-process">{t(HEAD.process)}</a>
            <a href="#ok-prices">{t(HEAD.prices)}</a>
            <a href="#ok-work">{t(HEAD.work)}</a>
          </nav>
          <a className="ok-btn ok-bar__start" href="#ok-start">{t(HEAD.start)}</a>
        </header>

        <section className="ok-hero" aria-labelledby="ok-title">
          <span className="ok-hero__ok" aria-hidden="true">Ok</span>
          <div className="ok-hero__copy">
            <p className="ok-strip">{t(HERO.strip)}</p>
            <h1 id="ok-title">
              <span className="ok-h1a">{t(HERO.titleA)}</span>
              <span className="ok-h1b">{t(HERO.titleB)}</span>
            </h1>
            <p className="ok-lede">{t(HERO.lede)}</p>
            <div className="ok-hero__act">
              <a className="ok-btn" href="#ok-start">{t(HEAD.start)}</a>
              <a className="ok-link" href="#ok-prices">{t(HERO.prices)}</a>
            </div>
          </div>

          <section className="ok-board" aria-labelledby="ok-rail">
            <span className="ok-tape ok-tape--l" aria-hidden="true" />
            <span className="ok-tape ok-tape--r" aria-hidden="true" />
            <p className="ok-stamp">
              <span>{t(BOARD.nextStart)}</span> <b>{t(BOARD.nextDate)}</b>
            </p>
            <p className="ok-rail" id="ok-rail">{t(BOARD.rail)}</p>
            <div className="ok-tickets">
              {TICKETS.map((item) => {
                const on = item.id === ticket.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`ok-tick${on ? ' is-on' : ''}`}
                    data-kind={item.kind}
                    aria-pressed={on}
                    onClick={() => chooseTicket(item)}
                  >
                    <span className="ok-tick__kind">{t(KIND_NAMES[item.kind])}</span>
                    <span className="ok-tick__wk" aria-hidden="true">
                      <b>{item.done}/{item.total}</b> <span>{t(BOARD.weeks)}</span>
                    </span>
                    <span className="ok-sr">, {fill(t(BOARD.weekOf), { done: item.done, total: item.total })}, </span>
                    <Cells total={item.total} filled={item.done} />
                    <span className="ok-tick__name">{item.client}</span>
                    <span className="ok-tick__what">{t(item.what)}</span>
                  </button>
                );
              })}
            </div>
            <div className="ok-selected" data-kind={ticket.kind}>
              <p className="ok-selected__date">
                <span className="ok-sr">{fill(t(BOARD.next), { client: ticket.client })}: </span>
                {t(ticket.date)}
              </p>
              <p className="ok-selected__news">{t(ticket.news)}</p>
            </div>
            <p className="ok-sr" role="status">{ticketNews}</p>
          </section>
        </section>

        <section className="ok-sec" id="ok-services" aria-labelledby="ok-services-title">
          <div className="ok-sec__head">
            <h2 id="ok-services-title">{t(SERVICES.title)}</h2>
            <p>{t(SERVICES.note)}</p>
          </div>
          <div className="ok-scope">
            <div className="ok-scope__axis" aria-hidden="true">
              {RULER.map((mark) => <span key={mark} style={{ '--at': mark } as CSSProperties}>{mark}</span>)}
            </div>
            {SERVICES.rows.map((row) => (
              <div key={row.kind} className="ok-svc" data-kind={row.kind}>
                <div className="ok-svc__text">
                  <h3><i className="ok-key" aria-hidden="true" />{t(row.name)}</h3>
                  <p>{t(row.body)}</p>
                </div>
                <div className="ok-svc__bar">
                  <Cells total={20} filled={row.from} range={row.to - row.from} />
                  <p className="ok-svc__len"><b>{row.from}–{row.to}</b> <span>{t(SERVICES.weeks)}</span></p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="ok-sec" id="ok-process" aria-labelledby="ok-process-title">
          <div className="ok-sec__head">
            <h2 id="ok-process-title">{t(PROCESS.title)}</h2>
            <p>{t(PROCESS.note)}</p>
          </div>
          <ol className="ok-track" aria-label={t(PROCESS.track)}>
            {PROCESS.track4.map((block, index) => (
              <li key={block.weeks.en} className={block.now !== undefined ? 'is-now' : undefined}>
                <b>{index + 1}</b>
                <span className="ok-track__weeks">
                  {t(block.weeks)}
                  {block.now !== undefined ? <span className="ok-sr">{t(PROCESS.nowSr)}</span> : null}
                </span>
                <Cells total={block.total} filled={block.filled} now={block.now} />
              </li>
            ))}
          </ol>
          <p className="ok-track__note"><b>{t(PROCESS.nowLead)}</b> {t(PROCESS.nowBody)}</p>
          <ol className="ok-steps">
            {PROCESS.steps.map((step, index) => (
              <li key={step.name.en} className="ok-step">
                <span className="ok-step__n" aria-hidden="true">{index + 1}</span>
                <h3>{t(step.name)}</h3>
                <p className="ok-step__len">{t(step.length)}</p>
                <p>{t(step.body)}</p>
                <p className="ok-step__get"><b>{t(PROCESS.youGet)}</b> {t(step.get)}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="ok-sec" id="ok-prices" aria-labelledby="ok-prices-title">
          <div className="ok-sec__head">
            <h2 id="ok-prices-title">{t(PRICES.title)}</h2>
            <p>{t(PRICES.note)}</p>
          </div>
          <div className="ok-prices">
            <div className="ok-models">
              <div className="ok-model">
                <h3>{t(PRICES.fixed)}</h3>
                <p>{t(PRICES.fixedBody)}</p>
                <ul className="ok-ladder" aria-label={t(PRICES.ladder)}>
                  {LADDER.map((rung) => (
                    <li key={rung.kind} data-kind={rung.kind}>
                      <i className="ok-key" aria-hidden="true" />
                      <span>{t(KIND_NAMES[rung.kind])}</span>
                      <b><Money value={rung.price} /></b>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="ok-model">
                <h3>{t(PRICES.team)}</h3>
                <p>{t(PRICES.teamBody)}</p>
                <p className="ok-model__price"><b><Money value="₩24M" /></b> <span>{t(PRICES.aMonth)}</span></p>
              </div>
              <div className="ok-model">
                <h3>{t(PRICES.care)}</h3>
                <p>{t(PRICES.careBody)}</p>
                <p className="ok-model__price"><b><Money value="₩1.8M" /></b> <span>{t(PRICES.aMonth)}</span></p>
              </div>
            </div>

            <aside className="ok-quote" aria-labelledby="ok-quote-no ok-quote-title">
              <div className="ok-quote__no">
                <p id="ok-quote-no"><span className="ok-sr">{t(PRICES.quoteLabel)}, </span>Q-2611</p>
                <p className="ok-quote__dates">{t(PRICES.sent)}<br />{t(PRICES.accepted)}</p>
              </div>
              <h3 id="ok-quote-title">{t(PRICES.quoteTitle)}</h3>
              <dl>
                {QUOTE.map((line) => (
                  <div key={line.item.en}>
                    <dt>{t(line.item)}</dt>
                    <dd><Money value={line.amount} /></dd>
                  </div>
                ))}
                <div className="ok-quote__total">
                  <dt>{t(QUOTE_TOTAL.item)}</dt>
                  <dd><Money value={QUOTE_TOTAL.amount} /></dd>
                </div>
              </dl>
              <p className="ok-quote__pay">{t(PRICES.pay)}</p>
            </aside>
          </div>
        </section>

        <section className="ok-sec" id="ok-work" aria-labelledby="ok-work-title">
          <div className="ok-sec__head">
            <h2 id="ok-work-title">{t(WORK.title)}</h2>
            <p>{t(WORK.note)}</p>
          </div>
          <table className="ok-work" role="table" aria-labelledby="ok-work-title">
            <thead className="ok-sr" role="rowgroup">
              <tr role="row">
                <th role="columnheader" scope="col">{t(WORK.year)}</th>
                <th role="columnheader" scope="col">{t(WORK.client)}</th>
                <th role="columnheader" scope="col">{t(WORK.made)}</th>
                <th role="columnheader" scope="col">{t(WORK.result)}</th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {WORK_ROWS.map((row) => (
                <tr key={row.client} role="row">
                  <td className="ok-work__yr" role="cell" data-label={t(WORK.year)}>{row.year}</td>
                  <th className="ok-work__client" role="rowheader" scope="row" data-label={t(WORK.client)}>
                    <b>{row.client}</b>
                    <span>{t(row.what)}</span>
                  </th>
                  <td className="ok-work__kinds" role="cell" data-label={t(WORK.made)}>
                    {row.kinds.map((kind) => (
                      <span key={kind} data-kind={kind}><i className="ok-key" aria-hidden="true" />{t(KIND_NAMES[kind])}</span>
                    ))}
                  </td>
                  <td className="ok-work__res" role="cell" data-label={t(WORK.result)}>
                    <b>{row.figure}</b> <span>{t(row.unit)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="ok-sec" id="ok-start" aria-labelledby="ok-start-title">
          <div className="ok-sec__head">
            <h2 id="ok-start-title">{t(START.title)}</h2>
            <p>{t(START.note)}</p>
          </div>

          <form className="ok-brief" noValidate onSubmit={send}>
            <fieldset
              className={`ok-slots${errors.month ? ' is-invalid' : ''}`}
              ref={slotsRef}
              aria-describedby={errors.month ? 'ok-month-error' : 'ok-slots-note'}
            >
              <legend className="ok-sr">{t(START.slots)}</legend>
              <div className="ok-slots__head" aria-hidden="true">
                <p className="ok-slots__title">{t(START.slots)}</p>
                <p className="ok-slots__next"><span>{t(START.nextOpening)}</span> <b>{t(BOARD.nextDate)}</b></p>
              </div>
              <p className="ok-sr">{t(START.nextOpening)} {t(BOARD.nextDate)}, {t(nextOpen.name)}.</p>
              <div className="ok-months">
                {MONTHS.map((item) => {
                  const open = SLOTS_PER_MONTH - item.booked;
                  const full = open === 0;
                  const chosen = item.id === month;
                  return (
                    <label key={item.id} className={`ok-month${full ? ' is-full' : ''}${chosen ? ' is-on' : ''}`}>
                      <input
                        className="ok-sr"
                        type="radio"
                        name="ok-month"
                        value={item.id}
                        checked={chosen}
                        disabled={full || sent}
                        aria-invalid={errors.month || undefined}
                        onChange={() => {
                          setMonth(item.id);
                          if (errors.month) setErrors({ ...errors, month: false });
                        }}
                      />
                      <span className="ok-month__name" aria-hidden="true">{item.short}</span>
                      <span className="ok-sr">{t(item.name)}</span>
                      <Cells total={SLOTS_PER_MONTH} filled={item.booked} />
                      <span className="ok-month__open">{full ? t(START.full) : fill(t(START.open), { n: open })}</span>
                    </label>
                  );
                })}
              </div>
              {errors.month ? (
                <p className="ok-error" id="ok-month-error" role="alert">{t(START.errMonth)}</p>
              ) : null}
              <p className="ok-legend" id="ok-slots-note">
                <span><i className="is-f" aria-hidden="true" />{t(START.booked)}</span>
                <span><i aria-hidden="true" />{t(START.openKey)}</span>
                <span>{sent ? t(START.held) : t(START.cap)}</span>
              </p>
            </fieldset>

            {sent ? (
              <div className="ok-done">
                <p className="ok-done__title" ref={doneRef} tabIndex={-1}>{fill(t(START.doneTitle), { name: brief.name.trim() })}</p>
                <p className="ok-done__body">
                  {fill(t(START.doneBody), { email: brief.email.trim(), month: chosenMonth ? t(chosenMonth.name) : '' })}
                </p>
                <dl className="ok-done__facts">
                  <div><dt>{t(START.doneWork)}</dt><dd>{kindList}</dd></div>
                  <div><dt>{t(START.doneBudget)}</dt><dd>{budgetLabel ? t(budgetLabel.label) : ''}</dd></div>
                  <div><dt>{t(START.when)}</dt><dd>{chosenMonth ? t(chosenMonth.name) : ''}</dd></div>
                </dl>
                <button className="ok-btn ok-btn--plain" type="button" onClick={() => setSent(false)}>{t(START.edit)}</button>
              </div>
            ) : (
              <div className="ok-fields">
                <div className={`ok-field${errors.name ? ' is-invalid' : ''}`}>
                  <label htmlFor="ok-name">{t(START.name)}</label>
                  <input
                    id="ok-name"
                    ref={nameRef}
                    type="text"
                    autoComplete="name"
                    required
                    value={brief.name}
                    aria-invalid={errors.name || undefined}
                    aria-describedby={errors.name ? 'ok-name-error' : undefined}
                    onChange={(event) => {
                      setBrief({ ...brief, name: event.target.value });
                      if (errors.name) setErrors({ ...errors, name: false });
                    }}
                  />
                  {errors.name ? <p className="ok-error" id="ok-name-error" role="alert">{t(START.errName)}</p> : null}
                </div>
                <div className={`ok-field${errors.email ? ' is-invalid' : ''}`}>
                  <label htmlFor="ok-email">{t(START.email)}</label>
                  <input
                    id="ok-email"
                    ref={emailRef}
                    type="email"
                    autoComplete="email"
                    required
                    value={brief.email}
                    aria-invalid={errors.email || undefined}
                    aria-describedby={errors.email ? 'ok-email-error' : undefined}
                    onChange={(event) => {
                      setBrief({ ...brief, email: event.target.value });
                      if (errors.email) setErrors({ ...errors, email: false });
                    }}
                  />
                  {errors.email ? <p className="ok-error" id="ok-email-error" role="alert">{t(START.errEmail)}</p> : null}
                </div>
                <fieldset
                  className={`ok-field ok-kinds${errors.kinds ? ' is-invalid' : ''}`}
                  ref={kindsRef}
                  aria-describedby={errors.kinds ? 'ok-kinds-error' : undefined}
                >
                  <legend>{t(START.kinds)}</legend>
                  <div className="ok-kinds__list">
                    {KIND_ORDER.map((kind) => (
                      <label key={kind} className="ok-check" data-kind={kind}>
                        <input
                          type="checkbox"
                          name="ok-kind"
                          value={kind}
                          checked={kinds.includes(kind)}
                          aria-invalid={errors.kinds || undefined}
                          onChange={() => toggleKind(kind)}
                        />
                        <span>{t(KIND_NAMES[kind])}</span>
                      </label>
                    ))}
                  </div>
                  {errors.kinds ? <p className="ok-error" id="ok-kinds-error" role="alert">{t(START.errKinds)}</p> : null}
                </fieldset>
                <div className={`ok-field${errors.budget ? ' is-invalid' : ''}`}>
                  <label htmlFor="ok-budget">{t(START.budget)}</label>
                  <select
                    id="ok-budget"
                    ref={budgetRef}
                    required
                    value={brief.budget}
                    aria-invalid={errors.budget || undefined}
                    aria-describedby={errors.budget ? 'ok-budget-error' : undefined}
                    onChange={(event) => {
                      setBrief({ ...brief, budget: event.target.value });
                      if (errors.budget) setErrors({ ...errors, budget: false });
                    }}
                  >
                    <option value="" disabled>{t(START.budgetPick)}</option>
                    {BUDGETS.map((item) => <option key={item.id} value={item.id}>{t(item.label)}</option>)}
                  </select>
                  {errors.budget ? <p className="ok-error" id="ok-budget-error" role="alert">{t(START.errBudget)}</p> : null}
                </div>
                <p className="ok-when">
                  {t(START.when)}: {chosenMonth ? <b>{t(chosenMonth.name)}</b> : <span>{t(START.whenNone)}</span>}
                </p>
                <button className="ok-btn ok-btn--send" type="submit">{t(START.send)}</button>
              </div>
            )}
          </form>

          <div className="ok-reach">
            <p className="ok-reach__mail"><span>{t(START.writeTo)}</span> <b>{EMAIL}</b></p>
            <dl>
              <div><dt>{t(START.phone)}</dt><dd>{PHONE}</dd></div>
              <div><dt>{t(START.hours)}</dt><dd>{t(START.hoursValue)}</dd></div>
              <div><dt>{t(START.visit)}</dt><dd>{t(START.visitValue)}</dd></div>
              <div><dt>{t(START.askFor)}</dt><dd>{t(START.askForValue)}</dd></div>
            </dl>
          </div>
        </section>

        <footer className="ok-foot">
          <p>{t(FOOT.where)}</p>
          <p>{t(FOOT.reg)}</p>
        </footer>
      </div>
    </FusionShell>
  );
}
