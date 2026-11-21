import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { flushSync } from 'react-dom';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedFusionProductSwissPage.css';

// The feature page of Margin, a browser editor for web pages, in the Product x Swiss
// style. Geologica alone carries every size: semibold headlines, light oversized figures,
// plain reading text, and the same face at 13px inside the editor, where a product's own
// UI font lives. Every section shows the part of the editor that does the job: the editor
// window with a customer's homepage open, a comment thread pinned to a layer, three
// breakpoint frames with a switch, an inspected card with redlines and its CSS, one pricing
// table and an open list of questions. One rounded material (the editor surfaces); the
// page itself is square, ruled and on a 12-column grid.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

const BRAND = 'Margin';
const SHOP = 'Linnet Cycles';
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key]));

const BAR = {
  nav: { en: 'Margin', ko: 'Margin', ja: 'Margin' },
  features: { en: 'Features', ko: 'Features', ja: 'Features' },
  customers: { en: 'Customers', ko: 'Customers', ja: 'Customers' },
  pricing: { en: 'Pricing', ko: 'Pricing', ja: 'Pricing' },
  questions: { en: 'Questions', ko: 'Questions', ja: 'Questions' },
  start: { en: 'Start free', ko: 'Start free', ja: 'Start free' },
} satisfies Record<string, Tri>;

const HERO = {
  title: {
    en: 'Lay out a website with your whole team in one shared file.',
    ko: 'Lay out a website with your whole team in one shared file.',
    ja: 'Lay out a website with your whole team in one shared file.',
  },
  lede: {
    en: 'Margin is a web page editor in the browser. Draw at three widths, comment on the exact button and copy its CSS.',
    ko: 'Margin is a web page editor in the browser. Draw at three widths, comment on the exact button and copy its CSS.',
    ja: 'Margin is a web page editor in the browser. Draw at three widths, comment on the exact button and copy its CSS.',
  },
  cta: { en: 'Start a free file', ko: 'Start a free file', ja: 'Start a free file' },
} satisfies Record<string, Tri>;

const APP = {
  label: {
    en: 'The Margin editor with the Linnet Cycles homepage open',
    ko: 'The Margin editor with the Linnet Cycles homepage open',
    ja: 'The Margin editor with the Linnet Cycles homepage open',
  },
  file: { en: 'Homepage v3', ko: 'Homepage v3', ja: 'Homepage v3' },
  saved: { en: 'Saved just now', ko: 'Saved just now', ja: 'Saved just now' },
  faces: { en: 'Mina, Alex and June are in this file', ko: 'Mina, Alex and June are in this file', ja: 'Mina, Alex and June are in this file' },
  rail: { en: 'Page and layers', ko: 'Page and layers', ja: 'Page and layers' },
  page: { en: 'Page', ko: 'Page', ja: 'Page' },
  pageName: { en: 'Homepage', ko: 'Homepage', ja: 'Homepage' },
  layers: { en: 'Layers', ko: 'Layers', ja: 'Layers' },
  canvas: {
    en: 'On the canvas: the Linnet Cycles homepage, with its four service cards. The Full service card is selected, Alex is pointing at it, and Mina has left a comment on it.',
    ko: 'On the canvas: the Linnet Cycles homepage, with its four service cards. The Full service card is selected, Alex is pointing at it, and Mina has left a comment on it.',
    ja: 'On the canvas: the Linnet Cycles homepage, with its four service cards. The Full service card is selected, Alex is pointing at it, and Mina has left a comment on it.',
  },
  tagDesktop: { en: 'Homepage, desktop 1440', ko: 'Homepage, desktop 1440', ja: 'Homepage, desktop 1440' },
  tagPhone: { en: 'Homepage, phone 375', ko: 'Homepage, phone 375', ja: 'Homepage, phone 375' },
  inspector: { en: 'Inspector', ko: 'Inspector', ja: 'Inspector' },
  design: { en: 'Design', ko: 'Design', ja: 'Design' },
  inspect: { en: 'Inspect', ko: 'Inspect', ja: 'Inspect' },
  serviceCard: { en: 'Service card', ko: 'Service card', ja: 'Service card' },
  autoLayout: { en: 'Auto layout', ko: 'Auto layout', ja: 'Auto layout' },
  vertical: { en: 'Vertical', ko: 'Vertical', ja: 'Vertical' },
  gap: { en: 'Gap', ko: 'Gap', ja: 'Gap' },
  padding: { en: 'Padding', ko: 'Padding', ja: 'Padding' },
  fill: { en: 'Fill', ko: 'Fill', ja: 'Fill' },
  fillName: { en: 'Card / Lilac', ko: 'Card / Lilac', ja: 'Card / Lilac' },
  radius: { en: 'Radius', ko: 'Radius', ja: 'Radius' },
  background: { en: 'Background', ko: 'Background', ja: 'Background' },
  titleText: { en: 'Title', ko: 'Title', ja: 'Title' },
  priceText: { en: 'Price', ko: 'Price', ja: 'Price' },
  textValue: { en: '18/24, semibold', ko: '18/24, semibold', ja: '18/24, semibold' },
  priceValue: { en: '32/32, semibold', ko: '32/32, semibold', ja: '32/32, semibold' },
} satisfies Record<string, Tri>;

/** The customer's homepage drawn inside the editor and the feature frames. */
const SITE = {
  shop: { en: 'Shop', ko: 'Shop', ja: 'Shop' },
  service: { en: 'Service', ko: 'Service', ja: 'Service' },
  visit: { en: 'Visit us', ko: 'Visit us', ja: 'Visit us' },
  book: { en: 'Book', ko: 'Book', ja: 'Book' },
  open: { en: 'Open today until 19:00', ko: 'Open today until 19:00', ja: 'Open today until 19:00' },
  title: { en: 'City bikes, serviced in a day.', ko: 'City bikes, serviced in a day.', ja: 'City bikes, serviced in a day.' },
  body: {
    en: 'Drop your bike off before 10:00 and collect it after 17:00. We text you when it is ready.',
    ko: 'Drop your bike off before 10:00 and collect it after 17:00. We text you when it is ready.',
    ja: 'Drop your bike off before 10:00 and collect it after 17:00. We text you when it is ready.',
  },
  bodyMid: {
    en: 'Drop your bike off before 10:00 and collect it after 17:00.',
    ko: 'Drop your bike off before 10:00 and collect it after 17:00.',
    ja: 'Drop your bike off before 10:00 and collect it after 17:00.',
  },
  bodyShort: { en: 'Drop off before 10:00, collect after 17:00.', ko: 'Drop off before 10:00, collect after 17:00.', ja: 'Drop off before 10:00, collect after 17:00.' },
  bookService: { en: 'Book a service', ko: 'Book a service', ja: 'Book a service' },
  bookFrom: { en: 'Book a service, from $89', ko: 'Book a service, from $89', ja: 'Book a service, from $89' },
  bookShort: { en: 'Book, from $89', ko: 'Book, from $89', ja: 'Book, from $89' },
  hours: { en: 'Opening hours', ko: 'Opening hours', ja: 'Opening hours' },
} satisfies Record<string, Tri>;

interface Service {
  id: 'full' | 'puncture' | 'wheel' | 'brake';
  name: Tri;
  short: Tri;
  time: Tri;
  price: string;
}

const SERVICES: Service[] = [
  { id: 'full', name: { en: 'Full service', ko: 'Full service', ja: 'Full service' }, short: { en: 'Full', ko: 'Full', ja: 'Full' }, time: { en: 'Ready same day', ko: 'Ready same day', ja: 'Ready same day' }, price: '$89' },
  { id: 'puncture', name: { en: 'Puncture repair', ko: 'Puncture repair', ja: 'Puncture repair' }, short: { en: 'Tyre', ko: 'Tyre', ja: 'Tyre' }, time: { en: '30 minutes', ko: '30 minutes', ja: '30 minutes' }, price: '$18' },
  { id: 'wheel', name: { en: 'Wheel truing', ko: 'Wheel truing', ja: 'Wheel truing' }, short: { en: 'Wheel', ko: 'Wheel', ja: 'Wheel' }, time: { en: '1 hour', ko: '1 hour', ja: '1 hour' }, price: '$25' },
  { id: 'brake', name: { en: 'Brake bleed', ko: 'Brake bleed', ja: 'Brake bleed' }, short: { en: 'Brake', ko: 'Brake', ja: 'Brake' }, time: { en: '1 hour', ko: '1 hour', ja: '1 hour' }, price: '$35' },
];

type LayerKind = 'frame' | 'comp' | 'text' | 'group';

const LAYERS: { name: Tri; kind: LayerKind; depth: 0 | 1 | 2; on?: boolean }[] = [
  { name: { en: 'Homepage, desktop', ko: 'Homepage, desktop', ja: 'Homepage, desktop' }, kind: 'frame', depth: 0 },
  { name: { en: 'Nav', ko: 'Nav', ja: 'Nav' }, kind: 'comp', depth: 1 },
  { name: { en: 'Headline', ko: 'Headline', ja: 'Headline' }, kind: 'text', depth: 1 },
  { name: { en: 'Book a service', ko: 'Book a service', ja: 'Book a service' }, kind: 'comp', depth: 1 },
  { name: { en: 'Service cards', ko: 'Service cards', ja: 'Service cards' }, kind: 'group', depth: 1 },
  { name: { en: 'Full service', ko: 'Full service', ja: 'Full service' }, kind: 'comp', depth: 2, on: true },
  { name: { en: 'Puncture repair', ko: 'Puncture repair', ja: 'Puncture repair' }, kind: 'comp', depth: 2 },
  { name: { en: 'Wheel truing', ko: 'Wheel truing', ja: 'Wheel truing' }, kind: 'comp', depth: 2 },
];

interface Message {
  initial: 'M' | 'A' | 'J';
  who: Tri;
  time: string;
  text: Tri;
  /** A mention set apart at the start of the last sentence. */
  mention?: Tri;
}

interface ThreadData {
  id: 'hero' | 'feature';
  title: Tri;
  messages: Message[];
}

const THREADS: Record<ThreadData['id'], ThreadData> = {
  hero: {
    id: 'hero',
    title: { en: 'Full service', ko: 'Full service', ja: 'Full service' },
    messages: [
      {
        initial: 'M',
        who: { en: 'Mina', ko: 'Mina', ja: 'Mina' },
        time: '14:02',
        text: {
          en: "Can the turnaround go above the price? It was the first question in Tuesday's test.",
          ko: "Can the turnaround go above the price? It was the first question in Tuesday's test.",
          ja: "Can the turnaround go above the price? It was the first question in Tuesday's test.",
        },
      },
    ],
  },
  feature: {
    id: 'feature',
    title: { en: 'Book a service', ko: 'Book a service', ja: 'Book a service' },
    messages: [
      {
        initial: 'M',
        who: { en: 'Mina Okafor', ko: 'Mina Okafor', ja: 'Mina Okafor' },
        time: '14:02',
        text: {
          en: "Can the button show the price? Two people asked for it in Tuesday's test.",
          ko: "Can the button show the price? Two people asked for it in Tuesday's test.",
          ja: "Can the button show the price? Two people asked for it in Tuesday's test.",
        },
      },
      {
        initial: 'A',
        who: { en: 'Alex Brandt', ko: 'Alex Brandt', ja: 'Alex Brandt' },
        time: '14:20',
        text: { en: 'Changed it. Still fits on one line at 375.', ko: 'Changed it. Still fits on one line at 375.', ja: 'Changed it. Still fits on one line at 375.' },
      },
      {
        initial: 'J',
        who: { en: 'June Park', ko: 'June Park', ja: 'June Park' },
        time: '14:31',
        text: { en: 'Looks right to me. {mention} can you close this?', ko: 'Looks right to me. {mention} can you close this?', ja: 'Looks right to me. {mention} can you close this?' },
        mention: { en: '@Mina', ko: '@Mina', ja: '@Mina' },
      },
    ],
  },
};

const THREAD = {
  resolve: { en: 'Resolve', ko: 'Resolve', ja: 'Resolve' },
  reopen: { en: 'Reopen', ko: 'Reopen', ja: 'Reopen' },
  resolvedOne: { en: 'Resolved by you just now. 1 comment, folded away.', ko: 'Resolved by you just now. 1 comment, folded away.', ja: 'Resolved by you just now. 1 comment, folded away.' },
  resolvedMany: { en: 'Resolved by you just now. {n} comments, folded away.', ko: 'Resolved by you just now. {n} comments, folded away.', ja: 'Resolved by you just now. {n} comments, folded away.' },
  resolvedNews: { en: 'Thread on {title} resolved.', ko: 'Thread on {title} resolved.', ja: 'Thread on {title} resolved.' },
  reopenedNews: { en: 'Thread on {title} reopened.', ko: 'Thread on {title} reopened.', ja: 'Thread on {title} reopened.' },
} satisfies Record<string, Tri>;

const FEATURES = {
  title: { en: "From the first layout to the developer's screen", ko: "From the first layout to the developer's screen", ja: "From the first layout to the developer's screen" },
  note: {
    en: 'One file holds the pages, the review and the measurements. Nobody exports screenshots or writes a separate spec.',
    ko: 'One file holds the pages, the review and the measurements. Nobody exports screenshots or writes a separate spec.',
    ja: 'One file holds the pages, the review and the measurements. Nobody exports screenshots or writes a separate spec.',
  },
  commentsTitle: { en: 'Comments stay on the element they are about', ko: 'Comments stay on the element they are about', ja: 'Comments stay on the element they are about' },
  commentsBody: {
    en: 'Click a layer and type. The thread is pinned to that layer, so when someone moves the button, the conversation moves with it.',
    ko: 'Click a layer and type. The thread is pinned to that layer, so when someone moves the button, the conversation moves with it.',
    ja: 'Click a layer and type. The thread is pinned to that layer, so when someone moves the button, the conversation moves with it.',
  },
  commentsList: [
    { en: 'Viewers comment on the free seat', ko: 'Viewers comment on the free seat', ja: 'Viewers comment on the free seat' },
    { en: 'Resolved threads fold away and stay searchable', ko: 'Resolved threads fold away and stay searchable', ja: 'Resolved threads fold away and stay searchable' },
    { en: 'Send a thread to Jira or Linear as an issue', ko: 'Send a thread to Jira or Linear as an issue', ja: 'Send a thread to Jira or Linear as an issue' },
  ],
  framesTitle: { en: 'Desktop, tablet and phone side by side', ko: 'Desktop, tablet and phone side by side', ja: 'Desktop, tablet and phone side by side' },
  framesBody: {
    en: 'Draw the desktop frame once. Auto layout reflows it to 768 and 375 pixels, and you adjust only what has to change. Edit a headline in one frame and the other two update.',
    ko: 'Draw the desktop frame once. Auto layout reflows it to 768 and 375 pixels, and you adjust only what has to change. Edit a headline in one frame and the other two update.',
    ja: 'Draw the desktop frame once. Auto layout reflows it to 768 and 375 pixels, and you adjust only what has to change. Edit a headline in one frame and the other two update.',
  },
  framesList: [
    { en: 'Breakpoints match the ones in your CSS', ko: 'Breakpoints match the ones in your CSS', ja: 'Breakpoints match the ones in your CSS' },
    { en: 'Preview any frame on your phone with a QR code', ko: 'Preview any frame on your phone with a QR code', ja: 'Preview any frame on your phone with a QR code' },
  ],
  framesGroup: { en: 'Show breakpoint', ko: 'Show breakpoint', ja: 'Show breakpoint' },
  inspectTitle: { en: 'Developers take measurements from the file', ko: 'Developers take measurements from the file', ja: 'Developers take measurements from the file' },
  inspectBody: {
    en: 'Developers open the same link in Inspect mode. Every layer shows its size, spacing, color and text style, with the distances to its neighbors drawn on the canvas. Copy any layer as CSS.',
    ko: 'Developers open the same link in Inspect mode. Every layer shows its size, spacing, color and text style, with the distances to its neighbors drawn on the canvas. Copy any layer as CSS.',
    ja: 'Developers open the same link in Inspect mode. Every layer shows its size, spacing, color and text style, with the distances to its neighbors drawn on the canvas. Copy any layer as CSS.',
  },
  inspectList: [
    { en: 'Color and text styles export as CSS variables', ko: 'Color and text styles export as CSS variables', ja: 'Color and text styles export as CSS variables' },
    { en: 'Inspect mode is free for viewers', ko: 'Inspect mode is free for viewers', ja: 'Inspect mode is free for viewers' },
  ],
  cssTitle: { en: 'CSS for Full service', ko: 'CSS for Full service', ja: 'CSS for Full service' },
  copy: { en: 'Copy', ko: 'Copy', ja: 'Copy' },
  copyLabel: { en: 'Copy the CSS', ko: 'Copy the CSS', ja: 'Copy the CSS' },
  copied: { en: 'Copied', ko: 'Copied', ja: 'Copied' },
  copiedNews: { en: 'The CSS for Full service is on your clipboard.', ko: 'The CSS for Full service is on your clipboard.', ja: 'The CSS for Full service is on your clipboard.' },
  copyFailed: { en: 'Select the code to copy it', ko: 'Select the code to copy it', ja: 'Select the code to copy it' },
  copyFailedNews: {
    en: 'The browser did not allow copying. Select the code and copy it.',
    ko: 'The browser did not allow copying. Select the code and copy it.',
    ja: 'The browser did not allow copying. Select the code and copy it.',
  },
} satisfies Record<string, Tri | Tri[]>;

type FrameId = 'desktop' | 'tablet' | 'phone';

const FRAMES: { id: FrameId; name: Tri; width: number; caption: Tri; news: Tri }[] = [
  {
    id: 'desktop',
    name: { en: 'Desktop', ko: 'Desktop', ja: 'Desktop' },
    width: 1440,
    caption: {
      en: 'Desktop 1440: the text and the four service cards sit side by side.',
      ko: 'Desktop 1440: the text and the four service cards sit side by side.',
      ja: 'Desktop 1440: the text and the four service cards sit side by side.',
    },
    news: { en: 'Showing the desktop frame, 1440 wide.', ko: 'Showing the desktop frame, 1440 wide.', ja: 'Showing the desktop frame, 1440 wide.' },
  },
  {
    id: 'tablet',
    name: { en: 'Tablet', ko: 'Tablet', ja: 'Tablet' },
    width: 768,
    caption: {
      en: 'Tablet 768: the cards move under the text in one row of four, and two nav links fold into a menu.',
      ko: 'Tablet 768: the cards move under the text in one row of four, and two nav links fold into a menu.',
      ja: 'Tablet 768: the cards move under the text in one row of four, and two nav links fold into a menu.',
    },
    news: { en: 'Showing the tablet frame, 768 wide.', ko: 'Showing the tablet frame, 768 wide.', ja: 'Showing the tablet frame, 768 wide.' },
  },
  {
    id: 'phone',
    name: { en: 'Phone', ko: 'Phone', ja: 'Phone' },
    width: 375,
    caption: {
      en: 'Phone 375: the cards stack, two show above the fold, and the button shortens to "Book, from $89".',
      ko: 'Phone 375: the cards stack, two show above the fold, and the button shortens to "Book, from $89".',
      ja: 'Phone 375: the cards stack, two show above the fold, and the button shortens to "Book, from $89".',
    },
    news: { en: 'Showing the phone frame, 375 wide.', ko: 'Showing the phone frame, 375 wide.', ja: 'Showing the phone frame, 375 wide.' },
  },
];

/** The CSS that Inspect mode gives for the Full service card. */
const CSS_RULES: [string, string][] = [
  ['display', 'flex'],
  ['flex-direction', 'column'],
  ['gap', '8px'],
  ['width', '240px'],
  ['padding', '20px'],
  ['border-radius', '12px'],
  ['background', 'var(--card-lilac)'],
];
const CSS_COMMENT = '/* Service card / Full service */';
const CSS_TEXT = `${CSS_COMMENT}\n.service-card {\n${CSS_RULES.map(([key, value]) => `  ${key}: ${value};`).join('\n')}\n}`;

interface Case {
  name: string;
  swatch: 'coral' | 'blue';
  who: Tri;
  figure: string;
  unit: Tri;
  caption: Tri;
  body: Tri;
  facts: [Tri, Tri][];
}

const CUSTOMERS = {
  title: { en: 'Who works in Margin', ko: 'Who works in Margin', ja: 'Who works in Margin' },
  note: {
    en: 'In-house product teams and small studios. Two of them, in their own numbers.',
    ko: 'In-house product teams and small studios. Two of them, in their own numbers.',
    ja: 'In-house product teams and small studios. Two of them, in their own numbers.',
  },
} satisfies Record<string, Tri>;

const PLAN = { en: 'Plan', ko: 'Plan', ja: 'Plan' };
const VIEWERS = { en: 'Viewers', ko: 'Viewers', ja: 'Viewers' };
const SINCE = { en: 'In Margin since', ko: 'In Margin since', ja: 'In Margin since' };

const CASES: Case[] = [
  {
    name: 'Nordvik Ferries',
    swatch: 'coral',
    who: { en: 'Bergen. 3 designers and 11 developers.', ko: 'Bergen. 3 designers and 11 developers.', ja: 'Bergen. 3 designers and 11 developers.' },
    figure: '4',
    unit: { en: 'days', ko: 'days', ja: 'days' },
    caption: {
      en: 'from an approved screen to merged code, down from 9 days before the move',
      ko: 'from an approved screen to merged code, down from 9 days before the move',
      ja: 'from an approved screen to merged code, down from 9 days before the move',
    },
    body: {
      en: 'The team rebuilt ticket booking across 64 screens in six weeks. Developers worked from Inspect mode, and questions went into comments on the screen in question.',
      ko: 'The team rebuilt ticket booking across 64 screens in six weeks. Developers worked from Inspect mode, and questions went into comments on the screen in question.',
      ja: 'The team rebuilt ticket booking across 64 screens in six weeks. Developers worked from Inspect mode, and questions went into comments on the screen in question.',
    },
    facts: [
      [PLAN, { en: 'Business, 14 editors', ko: 'Business, 14 editors', ja: 'Business, 14 editors' }],
      [VIEWERS, { en: '40, including the ticket office', ko: '40, including the ticket office', ja: '40, including the ticket office' }],
      [SINCE, { en: 'March 2025', ko: 'March 2025', ja: 'March 2025' }],
    ],
  },
  {
    name: 'Studio Okapi',
    swatch: 'blue',
    who: { en: 'Lisbon. A studio of four running 14 client websites.', ko: 'Lisbon. A studio of four running 14 client websites.', ja: 'Lisbon. A studio of four running 14 client websites.' },
    figure: '318',
    unit: { en: 'comments', ko: 'comments', ja: 'comments' },
    caption: {
      en: 'left by clients in October, every one answered inside the file',
      ko: 'left by clients in October, every one answered inside the file',
      ja: 'left by clients in October, every one answered inside the file',
    },
    body: {
      en: 'Clients join as viewers and review on the page itself. Feedback used to arrive as annotated screenshots by email; now each note sits on the heading or image it is about.',
      ko: 'Clients join as viewers and review on the page itself. Feedback used to arrive as annotated screenshots by email; now each note sits on the heading or image it is about.',
      ja: 'Clients join as viewers and review on the page itself. Feedback used to arrive as annotated screenshots by email; now each note sits on the heading or image it is about.',
    },
    facts: [
      [PLAN, { en: 'Team, 4 editors', ko: 'Team, 4 editors', ja: 'Team, 4 editors' }],
      [VIEWERS, { en: '26 people across 14 clients', ko: '26 people across 14 clients', ja: '26 people across 14 clients' }],
      [SINCE, { en: 'September 2024', ko: 'September 2024', ja: 'September 2024' }],
    ],
  },
];

const PRICING = {
  title: { en: 'Pricing', ko: 'Pricing', ja: 'Pricing' },
  note: {
    en: 'You pay for editors, the people who change layouts. Viewers and commenters are free on every plan.',
    ko: 'You pay for editors, the people who change layouts. Viewers and commenters are free on every plan.',
    ja: 'You pay for editors, the people who change layouts. Viewers and commenters are free on every plan.',
  },
  billing: { en: 'Billing period', ko: 'Billing period', ja: 'Billing period' },
  yearly: { en: 'Yearly', ko: 'Yearly', ja: 'Yearly' },
  monthly: { en: 'Monthly', ko: 'Monthly', ja: 'Monthly' },
  perYear: { en: 'Prices per editor, per month, billed yearly', ko: 'Prices per editor, per month, billed yearly', ja: 'Prices per editor, per month, billed yearly' },
  perMonth: { en: 'Prices per editor, per month, billed monthly', ko: 'Prices per editor, per month, billed monthly', ja: 'Prices per editor, per month, billed monthly' },
  yearlyNews: { en: 'Showing yearly prices. Team is $12 and Business $28 per editor a month.', ko: 'Showing yearly prices. Team is $12 and Business $28 per editor a month.', ja: 'Showing yearly prices. Team is $12 and Business $28 per editor a month.' },
  monthlyNews: { en: 'Showing monthly prices. Team is $15 and Business $34 per editor a month.', ko: 'Showing monthly prices. Team is $15 and Business $34 per editor a month.', ja: 'Showing monthly prices. Team is $15 and Business $34 per editor a month.' },
  billedMonthly: { en: '{price} billed monthly', ko: '{price} billed monthly', ja: '{price} billed monthly' },
  billedYearly: { en: '{price} billed yearly', ko: '{price} billed yearly', ja: '{price} billed yearly' },
  noCard: { en: 'No card needed', ko: 'No card needed', ja: 'No card needed' },
  feature: { en: 'What you get', ko: 'What you get', ja: 'What you get' },
  startFree: { en: 'Start free', ko: 'Start free', ja: 'Start free' },
  tryTeam: { en: 'Try Team for 30 days', ko: 'Try Team for 30 days', ja: 'Try Team for 30 days' },
  sales: { en: 'Talk to sales', ko: 'Talk to sales', ja: 'Talk to sales' },
} satisfies Record<string, Tri>;

type PlanId = 'starter' | 'team' | 'business';

const PLANS: { id: PlanId; name: string; yearly: number; monthly: number }[] = [
  { id: 'starter', name: 'Starter', yearly: 0, monthly: 0 },
  { id: 'team', name: 'Team', yearly: 12, monthly: 15 },
  { id: 'business', name: 'Business', yearly: 28, monthly: 34 },
];

const INCLUDED = { en: 'Included', ko: 'Included', ja: 'Included' };
const UNLIMITED = { en: 'Unlimited', ko: 'Unlimited', ja: 'Unlimited' };
const NO = { en: 'No', ko: 'No', ja: 'No' };

/** One row of the pricing table: the feature, then Starter, Team and Business. A `null` is a plain "No". */
const PRICE_ROWS: { name: Tri; values: [Tri | null, Tri | null, Tri | null] }[] = [
  { name: { en: 'Editors', ko: 'Editors', ja: 'Editors' }, values: [{ en: '2', ko: '2', ja: '2' }, UNLIMITED, UNLIMITED] },
  { name: { en: 'Files', ko: 'Files', ja: 'Files' }, values: [{ en: '3', ko: '3', ja: '3' }, UNLIMITED, UNLIMITED] },
  { name: { en: 'Viewers and commenters', ko: 'Viewers and commenters', ja: 'Viewers and commenters' }, values: [UNLIMITED, UNLIMITED, UNLIMITED] },
  {
    name: { en: 'Version history', ko: 'Version history', ja: 'Version history' },
    values: [{ en: '14 days', ko: '14 days', ja: '14 days' }, { en: '90 days', ko: '90 days', ja: '90 days' }, { en: 'Kept forever', ko: 'Kept forever', ja: 'Kept forever' }],
  },
  { name: { en: 'Inspect mode and CSS export', ko: 'Inspect mode and CSS export', ja: 'Inspect mode and CSS export' }, values: [INCLUDED, INCLUDED, INCLUDED] },
  { name: { en: 'Shared component libraries', ko: 'Shared component libraries', ja: 'Shared component libraries' }, values: [null, INCLUDED, INCLUDED] },
  { name: { en: 'Single sign-on', ko: 'Single sign-on', ja: 'Single sign-on' }, values: [null, null, { en: 'SAML and SCIM', ko: 'SAML and SCIM', ja: 'SAML and SCIM' }] },
  {
    name: { en: 'Support', ko: 'Support', ja: 'Support' },
    values: [
      { en: 'Help center', ko: 'Help center', ja: 'Help center' },
      { en: 'Email, answered the next working day', ko: 'Email, answered the next working day', ja: 'Email, answered the next working day' },
      { en: 'A named contact, 4-hour replies', ko: 'A named contact, 4-hour replies', ja: 'A named contact, 4-hour replies' },
    ],
  },
];

const QUESTIONS = {
  title: { en: 'Questions', ko: 'Questions', ja: 'Questions' },
  items: [
    {
      q: { en: 'Do people who only leave comments need a paid seat?', ko: 'Do people who only leave comments need a paid seat?', ja: 'Do people who only leave comments need a paid seat?' },
      a: {
        en: 'No. Viewers can open every file, comment and use Inspect mode for free on all plans. A seat is only needed to move or edit layers.',
        ko: 'No. Viewers can open every file, comment and use Inspect mode for free on all plans. A seat is only needed to move or edit layers.',
        ja: 'No. Viewers can open every file, comment and use Inspect mode for free on all plans. A seat is only needed to move or edit layers.',
      },
    },
    {
      q: { en: 'Can we bring our existing files across?', ko: 'Can we bring our existing files across?', ja: 'Can we bring our existing files across?' },
      a: {
        en: 'Yes. Margin imports .fig and .sketch files with their frames, text styles and color styles. Prototype links and plugins do not come across.',
        ko: 'Yes. Margin imports .fig and .sketch files with their frames, text styles and color styles. Prototype links and plugins do not come across.',
        ja: 'Yes. Margin imports .fig and .sketch files with their frames, text styles and color styles. Prototype links and plugins do not come across.',
      },
    },
    {
      q: { en: 'Where are our files stored?', ko: 'Where are our files stored?', ja: 'Where are our files stored?' },
      a: {
        en: 'In Frankfurt or in Virginia, chosen when you create the workspace. Files are encrypted at rest, and Business workspaces get a full nightly backup they can download.',
        ko: 'In Frankfurt or in Virginia, chosen when you create the workspace. Files are encrypted at rest, and Business workspaces get a full nightly backup they can download.',
        ja: 'In Frankfurt or in Virginia, chosen when you create the workspace. Files are encrypted at rest, and Business workspaces get a full nightly backup they can download.',
      },
    },
  ],
};

const START = {
  title: { en: 'Start a free file', ko: 'Start a free file', ja: 'Start a free file' },
  note: {
    en: 'Three files, two editors and as many viewers as you like. We email you a link that opens your first file, with no card and nothing to install.',
    ko: 'Three files, two editors and as many viewers as you like. We email you a link that opens your first file, with no card and nothing to install.',
    ja: 'Three files, two editors and as many viewers as you like. We email you a link that opens your first file, with no card and nothing to install.',
  },
  email: { en: 'Work email', ko: 'Work email', ja: 'Work email' },
  submit: { en: 'Send me the link', ko: 'Send me the link', ja: 'Send me the link' },
  empty: { en: 'Enter your email address.', ko: 'Enter your email address.', ja: 'Enter your email address.' },
  invalid: {
    en: 'Enter an email address with an @ and a domain, like mina@studio.com.',
    ko: 'Enter an email address with an @ and a domain, like mina@studio.com.',
    ja: 'Enter an email address with an @ and a domain, like mina@studio.com.',
  },
  doneTitle: { en: 'Check your inbox', ko: 'Check your inbox', ja: 'Check your inbox' },
  doneBody: {
    en: 'We sent a sign-in link to {email}. It opens a blank file with the Linnet Cycles homepage beside it as an example, and it works for 24 hours.',
    ko: 'We sent a sign-in link to {email}. It opens a blank file with the Linnet Cycles homepage beside it as an example, and it works for 24 hours.',
    ja: 'We sent a sign-in link to {email}. It opens a blank file with the Linnet Cycles homepage beside it as an example, and it works for 24 hours.',
  },
  again: { en: 'Use a different email', ko: 'Use a different email', ja: 'Use a different email' },
} satisfies Record<string, Tri>;

const FOOT = {
  nav: { en: 'Footer', ko: 'Footer', ja: 'Footer' },
  company: { en: 'Margin Labs B.V., Rotterdam', ko: 'Margin Labs B.V., Rotterdam', ja: 'Margin Labs B.V., Rotterdam' },
} satisfies Record<string, Tri>;

const PROMPT_EN = `Design one real page in the Product x Swiss style: a white page on a 12-column grid with square, ruled sections, where colour lives only inside the product's own interface (selections, cursors, comment pins, colour swatches) and the product UI is drawn in CSS as the proof.

Pick a real software product whose interface explains it, and write its real feature page: what it does, for whom, how it works, pricing. The page must read as that product's page, never as a page about its own style. Here it is Margin, a browser editor for web pages: designers draw each page at desktop, tablet and phone widths, the team comments on the exact element, and developers copy sizes and CSS from the same file. The file open in the editor is the homepage of Linnet Cycles, a bike repair shop.

TOKENS:
--paper: #ffffff (page, opaque surface for any menu over the page)
--stage: #f4f4f6 (the canvas behind drawn pages, with a 1px dot grid every 18px)
--panel: #fafafb (editor bars and side panels)
--ink: #0d0d0e
--ink-2: #2b2c30 (reading text)
--muted: #5d5f66
--line: #c2c4ca (rules and the editor's frame)
--line-ui: #c8cad0 (fields and dividers inside the editor)
--violet: #6c5cff (selection, focus ring, chosen frame)
--violet-ink: #3f31d6 (violet text on white and on --violet-wash)
--violet-wash: #ecebff
--yellow: #ffd84d, --yellow-wash: #fff3bf (the Team plan's column)
--blue: #73d7ff, --coral: #ff765f, --green: #78d88c, --lilac: #cbb7ff (the logo, the drawn site's service cards, avatars, cursors and the square by each customer's name)
--coral-ink: #b0442f (redlines, CSS property names, component icons and form errors)
--green-ink: #2b7a41 (the drawn site's "open today" line)

COLOUR:
- The page itself is ink on white. Colour appears inside the editor surfaces: the drawn site's four service cards, the selection outline and its size tag, two named cursors, comment pins, avatars and colour swatches.
- Outside the editor, colour appears only in the four-square logo, a small square by each customer's name, and the Team plan's yellow wash with a 4px yellow rule on top of its column.
- Buttons are ink: a solid ink button for the main action and a 1px ink outline for the others; hover darkens the solid one to --ink-2 and fills the outlined one with --stage. Links in bars are --muted and turn ink on hover. Errors are --coral-ink text under the field, and the field's border turns --coral-ink.
- Text on coral and green is a dark tint of each (#2a0d06, #12331c); white text sits only on ink, violet and the grey of a resolved pin (--muted). Shadows, ruler ticks and the dot grid are ink at low alpha. No other colours, and no gradients except the dot grid and ruler ticks.
- Section tops are a 1px ink rule; rows inside sections are 1px --line rules.

TYPOGRAPHY:
One family: Geologica (300 to 800) at every size. Its wide, round letters carry the friendly voice.
H1: 600, clamp(2.25rem, 4vw, 3.125rem), line-height 1.03, letter-spacing -0.03em, two lines beside the lede on desktop.
H2: 600, clamp(1.9rem, 3.4vw, 2.85rem), line-height 1.08, letter-spacing -0.025em.
H3: 600, 1.5rem (1.375rem on phones), line-height 1.2, letter-spacing -0.015em.
Customer figures: 300, clamp(4rem, 7.4vw, 6.4rem), line-height 0.95, letter-spacing -0.04em, with the unit in 500 at 1.375rem.
Plan prices: 600, 2.75rem, letter-spacing -0.035em (1.75rem on phones). Questions: 600, 1.1875rem.
Body: 380, 1.0625rem, line-height 1.6; the hero lede 1rem; lists, captions, facts and table cells 1rem; price notes 0.875rem and the phone table's plan labels 0.8125rem. Inside the editor the same face runs at 0.8125rem, 450 for text and 600 for names, like a product's own UI font; drawn pages inside it may go smaller because they are pictures with a text alternative.
CSS code: the system monospace stack (ui-monospace, SF Mono, Menlo, Consolas) at 0.8125rem, line-height 1.6.
Figures are tabular. No all-caps tracked labels.

LAYOUT:
- A 1120px column on a 12-column grid with 24px gutters.
- Top bar, 56px on a 1px rule: the product name with a four-square logo (coral, yellow, blue, green), four in-page links, and one solid "Start free" button.
- Hero: the H1 across eight columns with the lede and a solid "Start a free file" button in the last four, then the editor window across all twelve. On a 1280x800 laptop the headline and the whole editor window are on the first screen.
- The editor window: 1px --line border, 16px radius, a soft two-layer shadow. A 40px bar (logo, file path, "Saved just now", three avatars, zoom), then three columns: a 184px rail with the page and its layers, the stage with a ruler and the drawn homepage beside an open comment thread, and a 224px inspector with Design and Inspect tabs.
- Then: features (three rows, each with the text in four columns and the part of the editor that does it in eight, on a stage-coloured, dot-gridded, 14px-radius surface), customers (two columns split by a 1px rule), pricing (one table), questions (heading in four columns, answers in eight), the free-file sign-up, and a footer.
- Sections are 112px apart (80px on phones). Below 1200px features stack; below 760px everything is one column.

COMPONENTS:
- Editor window: the stage shows the drawn homepage (nav, "open today" line, headline, text, two buttons, four coloured service cards) with the Full service card selected: a 1.5px violet outline, four square handles and a violet size tag. Two named cursors (Alex in coral, Mina in violet) and a comment pin sit on the canvas. The rail lists the page and its layers with the selected layer on --violet-wash. On phones the drawing switches to its phone layout and the inspector moves under the stage.
- Inspector: two tabs, Design and Inspect (tab pattern: roving tabindex, arrow keys, Home and End, one labelled panel). Design shows position and size fields, auto layout and fill; Inspect shows the same layer as developer values.
- Comment thread: a white 12px-radius panel with the layer's name and a Resolve button, messages with a round avatar, a name, a time and the text, and an @mention on --violet-wash. Resolve folds the messages away into one line and becomes Reopen; the canvas pin turns grey.
- Breakpoint switch: a segmented group of three toggle buttons (Desktop 1440, Tablet 768, Phone 375, aria-pressed). On desktop the three frames stand side by side and the chosen one gets the violet outline while the others fade; on phones only the chosen frame is drawn. A sentence under the frames says what changes at that width.
- Inspect drawing: the Full service card with coral redlines for padding, gap, width and height, beside a white code panel with the card's CSS and a Copy button that confirms with "Copied".
- Pricing: one table with Starter, Team and Business columns, the Team column on the yellow wash. A Yearly/Monthly toggle pair changes every price and the note under each price. On phones the table keeps its roles and each row becomes the feature's name over three labelled values.
- Free-file sign-up: one email field (48px, 1px --muted border, 8px radius) with a visible label and a solid button. Errors sit under the field with role="alert"; a valid address replaces the form with a confirmation that takes focus and shows the address.
- Page buttons are 44px high (40px in the desktop top bar) with an 8px radius; the small buttons inside the editor surfaces are 30 to 38px on desktop. Every control is at least 44px high on phones.
- The page's own blocks have square corners. Radii belong to the editor surfaces (16px window, 14px feature stages, 12px threads and code panel, 9px segmented switches, 6px fields and editor buttons) and to the page's buttons and field (8px).

MOTION:
- A 160ms colour change on hover, and a 160ms fade when another breakpoint frame is chosen. Nothing moves on its own. prefers-reduced-motion removes the transitions.

FORBIDDEN:
- Cards and grids of identical rounded boxes on the page itself, pills, chips, badges, glows, gradients on the page
- A small label above a heading, all-caps tracked labels, numbered section markers
- Pages about design principles, style rules or the palette
- Stock photos, illustrations, floating abstract shapes, emoji, arrows on links, middle-dot meta strings
- Colour as page decoration: no coloured section backgrounds except the Team column

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML: a labelled region for the editor window, a tab list for the inspector, toggle buttons with aria-pressed, a table with explicit roles for pricing, a description list for the questions, a labelled form
3) Working inspector tabs, Resolve and Reopen, the breakpoint switch, the billing toggle, Copy, and the sign-up with its error and success states, each change announced in a polite live region
4) Responsive layout down to 320px with no horizontal scroll and every control at least 44px high on phones
5) Visible focus on every control (2px violet ring), a text alternative for every drawing, reduced-motion support`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_EN, ja: PROMPT_EN };

/** The four-square logo of Margin. */
function Logo() {
  return (
    <span className="mg-logo" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

function Cursor({ who, tone }: { who: string; tone: 'a' | 'm' }) {
  return (
    <span className={`mg-cursor mg-cursor--${tone}`} aria-hidden="true">
      <svg viewBox="0 0 20 20">
        <path d="M3 2 L17 9 L10 11 L8 17 Z" />
      </svg>
      <span>{who}</span>
    </span>
  );
}

function Selection({ size }: { size?: string }) {
  return (
    <span className="mg-sel" aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      {size ? <em>{size}</em> : null}
    </span>
  );
}

interface ThreadProps {
  data: ThreadData;
  lang: Lang;
  resolved: boolean;
  onToggle: () => void;
  className?: string;
}

function Thread({ data, lang, resolved, onToggle, className }: ThreadProps) {
  const titleId = `mg-thread-${data.id}`;
  const count = data.messages.length;
  return (
    <div className={`mg-thread${resolved ? ' is-resolved' : ''}${className ? ` ${className}` : ''}`} role="group" aria-labelledby={titleId}>
      <div className="mg-thread__head">
        <p className="mg-thread__title" id={titleId}>{data.title[lang]}</p>
        <button type="button" className="mg-resolve" aria-describedby={titleId} onClick={onToggle}>
          {resolved ? THREAD.reopen[lang] : THREAD.resolve[lang]}
        </button>
      </div>
      {resolved ? (
        <p className="mg-thread__folded">{count === 1 ? THREAD.resolvedOne[lang] : fill(THREAD.resolvedMany[lang], { n: count })}</p>
      ) : (
        <ol className="mg-msgs">
          {data.messages.map((message) => {
            const [before, after] = message.text[lang].split('{mention}');
            return (
              <li key={message.time}>
                <span className={`mg-face mg-face--${message.initial.toLowerCase()}`} aria-hidden="true">{message.initial}</span>
                <div>
                  <p className="mg-msgs__who">
                    <b>{message.who[lang]}</b> <time dateTime={message.time}>{message.time}</time>
                  </p>
                  <p className="mg-msgs__text">
                    {before}
                    {message.mention ? <mark>{message.mention[lang]}</mark> : null}
                    {after}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

/** One of the three breakpoint frames, drawn small. It is a picture; the caption under the frames says what it shows. */
function Frame({ id, lang, on }: { id: FrameId; lang: Lang; on: boolean }) {
  const frame = FRAMES.find((item) => item.id === id) ?? FRAMES[0];
  const cards = id === 'phone' ? SERVICES.slice(0, 2) : SERVICES;
  return (
    <figure className={`mg-fr mg-fr--${id}${on ? ' is-on' : ''}`} aria-hidden="true">
      <figcaption>{frame.name[lang]} {frame.width}</figcaption>
      <div className="mg-fr__page">
        <div className="mg-fr__nav">
          <b>{id === 'phone' ? 'Linnet' : SHOP}</b>
          {id === 'desktop' ? (
            <>
              <span>{SITE.shop[lang]}</span>
              <span>{SITE.service[lang]}</span>
              <span>{SITE.visit[lang]}</span>
            </>
          ) : null}
          {id === 'tablet' ? <span>{SITE.service[lang]}</span> : null}
          {id !== 'desktop' ? <span className="mg-fr__menu" /> : null}
        </div>
        <div className="mg-fr__body">
          <div className="mg-fr__text">
            <span className="mg-fr__h">{SITE.title[lang]}</span>
            <span className="mg-fr__p">{id === 'phone' ? SITE.bodyShort[lang] : SITE.bodyMid[lang]}</span>
            <span className="mg-sb mg-sb--dark">{id === 'phone' ? SITE.bookShort[lang] : SITE.bookFrom[lang]}</span>
          </div>
          <div className="mg-cards">
            {cards.map((service) => (
              <span key={service.id} className={`mg-svc mg-svc--${service.id}`}>
                <b>{id === 'tablet' ? service.short[lang] : service.name[lang]}</b>
                {id === 'desktop' ? <small>{service.time[lang]}</small> : null}
                <span className="mg-svc__price">{service.price}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </figure>
  );
}

type TabId = 'design' | 'inspect';
const TABS: TabId[] = ['design', 'inspect'];
type EmailError = 'empty' | 'invalid' | null;

export function PortedFusionProductSwissPage({ lang }: PortedStylePageProps) {
  const [tab, setTab] = useState<TabId>('design');
  const [resolved, setResolved] = useState<Record<ThreadData['id'], boolean>>({ hero: false, feature: false });
  const [frame, setFrame] = useState<FrameId>('phone');
  const [yearly, setYearly] = useState(true);
  const [copy, setCopy] = useState<'idle' | 'copied' | 'failed'>('idle');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<EmailError>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [news, setNews] = useState('');
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ design: null, inspect: null });
  const emailRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLParagraphElement>(null);
  const wasSent = useRef(false);
  const copyTimer = useRef<number | undefined>(undefined);

  const t = (text: Tri) => text[lang];

  // A repeated message still reaches the live region: a trailing no-break space makes it new text.
  const announce = (message: string) => setNews((previous) => (previous === message ? `${message}\u00a0` : message));

  // The form and the confirmation replace each other. Focus goes to what took the place
  // of the control that had it: the confirmation, or the email field again.
  useEffect(() => {
    if (sentTo !== null) doneRef.current?.focus();
    else if (wasSent.current) emailRef.current?.focus();
    wasSent.current = sentTo !== null;
  }, [sentTo]);

  useEffect(() => () => window.clearTimeout(copyTimer.current), []);

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = TABS.indexOf(tab);
    const target =
      event.key === 'ArrowRight' ? (index + 1) % TABS.length
      : event.key === 'ArrowLeft' ? (index - 1 + TABS.length) % TABS.length
      : event.key === 'Home' ? 0
      : event.key === 'End' ? TABS.length - 1
      : -1;
    if (target < 0) return;
    event.preventDefault();
    setTab(TABS[target]);
    tabRefs.current[TABS[target]]?.focus();
  };

  const toggleThread = (id: ThreadData['id']) => {
    const next = !resolved[id];
    setResolved({ ...resolved, [id]: next });
    announce(fill(t(next ? THREAD.resolvedNews : THREAD.reopenedNews), { title: t(THREADS[id].title) }));
  };

  const chooseFrame = (id: FrameId) => {
    if (id === frame) return;
    setFrame(id);
    announce(t((FRAMES.find((item) => item.id === id) ?? FRAMES[0]).news));
  };

  const chooseBilling = (nextYearly: boolean) => {
    if (nextYearly === yearly) return;
    setYearly(nextYearly);
    announce(t(nextYearly ? PRICING.yearlyNews : PRICING.monthlyNews));
  };

  const copyCss = () => {
    window.clearTimeout(copyTimer.current);
    const done = (ok: boolean) => {
      setCopy(ok ? 'copied' : 'failed');
      announce(t(ok ? FEATURES.copiedNews : FEATURES.copyFailedNews));
      copyTimer.current = window.setTimeout(() => setCopy('idle'), ok ? 2000 : 4000);
    };
    if (!navigator.clipboard) {
      done(false);
      return;
    }
    navigator.clipboard.writeText(CSS_TEXT).then(() => done(true), () => done(false));
  };

  const signUp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();
    const error: EmailError = value === '' ? 'empty' : EMAIL_PATTERN.test(value) ? null : 'invalid';
    if (!error) {
      setEmailError(null);
      setSentTo(value);
      return;
    }
    // The error renders first, so the field and its message can be brought into view together.
    flushSync(() => setEmailError(error));
    emailRef.current?.focus();
    emailRef.current?.parentElement?.scrollIntoView({ block: 'nearest' });
  };

  const priceOf = (plan: (typeof PLANS)[number]) => `$${yearly ? plan.yearly : plan.monthly}`;
  const noteOf = (plan: (typeof PLANS)[number]) => {
    if (plan.id === 'starter') return t(PRICING.noCard);
    return yearly ? fill(t(PRICING.billedMonthly), { price: `$${plan.monthly}` }) : fill(t(PRICING.billedYearly), { price: `$${plan.yearly}` });
  };

  const fullService = SERVICES[0];

  return (
    <FusionShell
      fusionId="fusion-product-swiss"
      lang={lang}
      tone="light"
      accent="#6c5cff"
      prev={{ href: '/pages/fusion-neon-swiss.html', label: 'Neon × Swiss' }}
      next={{ href: '/pages/fusion-bento-noir.html', label: 'Bento × Noir' }}
      prompts={PROMPTS}
    >
      <div className="mg">
        <header className="mg-bar">
          <p className="mg-brand">
            <Logo />
            <b>{BRAND}</b>
          </p>
          <nav className="mg-bar__nav" aria-label={t(BAR.nav)}>
            <a href="#mg-features">{t(BAR.features)}</a>
            <a href="#mg-customers">{t(BAR.customers)}</a>
            <a href="#mg-pricing">{t(BAR.pricing)}</a>
            <a href="#mg-questions">{t(BAR.questions)}</a>
          </nav>
          <a className="mg-btn mg-btn--dark mg-bar__start" href="#mg-start">{t(BAR.start)}</a>
        </header>

        <section className="mg-hero" aria-labelledby="mg-title">
          <div className="mg-hero__head">
            <h1 id="mg-title">{t(HERO.title)}</h1>
            <div className="mg-hero__side">
              <p className="mg-lede">{t(HERO.lede)}</p>
              <a className="mg-btn mg-btn--dark" href="#mg-start">{t(HERO.cta)}</a>
            </div>
          </div>

          <section className="mg-app" aria-label={t(APP.label)}>
            <div className="mg-app__bar">
              <div className="mg-app__file">
                <Logo />
                <span className="mg-app__name">
                  <b>{SHOP}</b>
                  <span className="mg-app__sep" aria-hidden="true">/</span>
                  <span className="mg-app__page">{t(APP.file)}</span>
                </span>
                <span className="mg-app__saved">{t(APP.saved)}</span>
              </div>
              <div className="mg-app__right">
                <span className="mg-faces" role="img" aria-label={t(APP.faces)}>
                  <span className="mg-face mg-face--m">M</span>
                  <span className="mg-face mg-face--a">A</span>
                  <span className="mg-face mg-face--j">J</span>
                </span>
                <span className="mg-zoom">100%</span>
              </div>
            </div>

            <div className="mg-app__body">
              <aside className="mg-rail" aria-label={t(APP.rail)}>
                <p className="mg-rail__page">
                  <span>{t(APP.page)}</span> <b>{t(APP.pageName)}</b>
                </p>
                <p className="mg-rail__h">{t(APP.layers)}</p>
                <ul className="mg-layers">
                  {LAYERS.map((layer) => (
                    <li key={layer.name.en} className={`mg-layers__d${layer.depth}${layer.on ? ' is-on' : ''}`} aria-current={layer.on ? 'true' : undefined}>
                      <span className={`mg-ic mg-ic--${layer.kind}`} aria-hidden="true">{layer.kind === 'text' ? 'T' : null}</span>
                      {t(layer.name)}
                    </li>
                  ))}
                </ul>
              </aside>

              <div className="mg-stage">
                <div className="mg-ruler" aria-hidden="true" />
                <p className="mg-sr">{t(APP.canvas)}</p>
                <div className="mg-stage__grid">
                  <div className="mg-board" aria-hidden="true">
                    <span className="mg-board__tag">
                      <span className="mg-board__tag-d">{t(APP.tagDesktop)}</span>
                      <span className="mg-board__tag-p">{t(APP.tagPhone)}</span>
                    </span>
                    <div className="mg-site">
                      <div className="mg-site__nav">
                        <b>{SHOP}</b>
                        <span>{t(SITE.shop)}</span>
                        <span>{t(SITE.service)}</span>
                        <span>{t(SITE.visit)}</span>
                        <em>{t(SITE.book)}</em>
                      </div>
                      <div className="mg-site__body">
                        <div className="mg-site__text">
                          <span className="mg-open"><i />{t(SITE.open)}</span>
                          <span className="mg-site__h">{t(SITE.title)}</span>
                          <span className="mg-site__p">{t(SITE.body)}</span>
                          <span className="mg-site__btns">
                            <span className="mg-sb mg-sb--dark">{t(SITE.bookService)}</span>
                            <span className="mg-sb">{t(SITE.hours)}</span>
                          </span>
                          <Cursor who="Mina" tone="m" />
                        </div>
                        <div className="mg-cards">
                          {SERVICES.map((service) => (
                            <span key={service.id} className={`mg-svc mg-svc--${service.id}`}>
                              <b>{t(service.name)}</b>
                              <small>{t(service.time)}</small>
                              <span className="mg-svc__price">{service.price}</span>
                              {service.id === 'full' ? (
                                <>
                                  <Selection size="240 × 168" />
                                  <Cursor who="Alex" tone="a" />
                                  <span className={`mg-pin mg-pin--card${resolved.hero ? ' is-resolved' : ''}`}>M</span>
                                </>
                              ) : null}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Thread data={THREADS.hero} lang={lang} resolved={resolved.hero} onToggle={() => toggleThread('hero')} className="mg-thread--hero" />
                </div>
              </div>

              <aside className="mg-insp" aria-label={t(APP.inspector)}>
                <div className="mg-tabs" role="tablist" aria-label={t(APP.inspector)}>
                  {TABS.map((id) => (
                    <button
                      key={id}
                      ref={(node) => {
                        tabRefs.current[id] = node;
                      }}
                      type="button"
                      role="tab"
                      id={`mg-tab-${id}`}
                      className="mg-tab"
                      aria-selected={tab === id}
                      aria-controls="mg-insp-panel"
                      tabIndex={tab === id ? 0 : -1}
                      onClick={() => setTab(id)}
                      onKeyDown={onTabKey}
                    >
                      {t(id === 'design' ? APP.design : APP.inspect)}
                    </button>
                  ))}
                </div>
                <div className="mg-insp__panel" role="tabpanel" id="mg-insp-panel" aria-labelledby={`mg-tab-${tab}`} tabIndex={0}>
                  {tab === 'design' ? (
                    <>
                      <div className="mg-insp__sec">
                        <p className="mg-insp__h">
                          <span className="mg-ic mg-ic--comp" aria-hidden="true" />
                          {t(fullService.name)}
                          <small>{t(APP.serviceCard)}</small>
                        </p>
                        <dl className="mg-fields">
                          <div><dt>X</dt><dd>812</dd></div>
                          <div><dt>Y</dt><dd>96</dd></div>
                          <div><dt>W</dt><dd>240</dd></div>
                          <div><dt>H</dt><dd>168</dd></div>
                        </dl>
                      </div>
                      <div className="mg-insp__sec">
                        <p className="mg-insp__h">
                          {t(APP.autoLayout)}
                          <small>{t(APP.vertical)}</small>
                        </p>
                        <dl className="mg-fields">
                          <div><dt>{t(APP.gap)}</dt><dd>8</dd></div>
                          <div><dt>{t(APP.padding)}</dt><dd>20</dd></div>
                        </dl>
                      </div>
                      <div className="mg-insp__sec">
                        <p className="mg-insp__h">{t(APP.fill)}</p>
                        <p className="mg-row">
                          <i className="mg-row__swatch" aria-hidden="true" />
                          {t(APP.fillName)}
                          <small>#CBB7FF</small>
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="mg-insp__sec mg-insp__sec--code">
                      <p className="mg-insp__h">
                        <span className="mg-ic mg-ic--comp" aria-hidden="true" />
                        {t(fullService.name)}
                        <small>240 × 168</small>
                      </p>
                      <dl className="mg-props">
                        <div><dt>{t(APP.padding)}</dt><dd>20px</dd></div>
                        <div><dt>{t(APP.gap)}</dt><dd>8px</dd></div>
                        <div><dt>{t(APP.radius)}</dt><dd>12px</dd></div>
                        <div><dt>{t(APP.background)}</dt><dd><i className="mg-row__swatch" aria-hidden="true" />#CBB7FF</dd></div>
                        <div><dt>{t(APP.titleText)}</dt><dd>{t(APP.textValue)}</dd></div>
                        <div><dt>{t(APP.priceText)}</dt><dd>{t(APP.priceValue)}</dd></div>
                      </dl>
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </section>
        </section>

        <section className="mg-section" id="mg-features" aria-labelledby="mg-features-title">
          <div className="mg-head">
            <h2 id="mg-features-title">{t(FEATURES.title)}</h2>
            <p>{t(FEATURES.note)}</p>
          </div>

          <article className="mg-feature" aria-labelledby="mg-f1">
            <div className="mg-feature__text">
              <h3 id="mg-f1">{t(FEATURES.commentsTitle)}</h3>
              <p>{t(FEATURES.commentsBody)}</p>
              <ul>
                {FEATURES.commentsList.map((item) => <li key={item.en}>{t(item)}</li>)}
              </ul>
            </div>
            <div className="mg-ui mg-ui--thread">
              <div className="mg-crop" aria-hidden="true">
                <span className="mg-open"><i />{t(SITE.open)}</span>
                <span className="mg-crop__h">{t(SITE.title)}</span>
                <span className="mg-crop__btns">
                  <span className="mg-sb mg-sb--dark">
                    {t(SITE.bookFrom)}
                    <Selection />
                  </span>
                  <span className="mg-sb">{t(SITE.hours)}</span>
                </span>
                <span className={`mg-pin mg-pin--crop${resolved.feature ? ' is-resolved' : ''}`}>M</span>
              </div>
              <Thread data={THREADS.feature} lang={lang} resolved={resolved.feature} onToggle={() => toggleThread('feature')} className="mg-thread--feature" />
            </div>
          </article>

          <article className="mg-feature" aria-labelledby="mg-f2">
            <div className="mg-feature__text">
              <h3 id="mg-f2">{t(FEATURES.framesTitle)}</h3>
              <p>{t(FEATURES.framesBody)}</p>
              <ul>
                {FEATURES.framesList.map((item) => <li key={item.en}>{t(item)}</li>)}
              </ul>
            </div>
            <div className="mg-ui mg-ui--frames">
              <div className="mg-seg" role="group" aria-label={t(FEATURES.framesGroup)}>
                {FRAMES.map((item) => (
                  <button key={item.id} type="button" aria-pressed={frame === item.id} onClick={() => chooseFrame(item.id)}>
                    {t(item.name)}<span className="mg-seg__w"> {item.width}</span>
                  </button>
                ))}
              </div>
              <div className={`mg-frames is-${frame}`}>
                {FRAMES.map((item) => <Frame key={item.id} id={item.id} lang={lang} on={frame === item.id} />)}
              </div>
              <p className="mg-frames__caption">{t((FRAMES.find((item) => item.id === frame) ?? FRAMES[0]).caption)}</p>
            </div>
          </article>

          <article className="mg-feature" aria-labelledby="mg-f3">
            <div className="mg-feature__text">
              <h3 id="mg-f3">{t(FEATURES.inspectTitle)}</h3>
              <p>{t(FEATURES.inspectBody)}</p>
              <ul>
                {FEATURES.inspectList.map((item) => <li key={item.en}>{t(item)}</li>)}
              </ul>
            </div>
            <div className="mg-ui mg-ui--inspect">
              <div className="mg-measure" aria-hidden="true">
                <span className="mg-svc mg-svc--full mg-svc--big">
                  <b>{t(fullService.name)}</b>
                  <small>{t(fullService.time)}</small>
                  <span className="mg-svc__price">{fullService.price}</span>
                </span>
                <span className="mg-red mg-red--pad"><em>20</em></span>
                <span className="mg-red mg-red--gap"><em>8</em></span>
                <span className="mg-red mg-red--w"><em>240</em></span>
                <span className="mg-red mg-red--h"><em>168</em></span>
              </div>
              <div className="mg-code">
                <div className="mg-code__head">
                  <p id="mg-css-title">{t(FEATURES.cssTitle)}</p>
                  <button type="button" className="mg-copy" aria-label={copy === 'idle' ? t(FEATURES.copyLabel) : undefined} onClick={copyCss}>
                    {copy === 'copied' ? t(FEATURES.copied) : copy === 'failed' ? t(FEATURES.copyFailed) : t(FEATURES.copy)}
                  </button>
                </div>
                <pre aria-labelledby="mg-css-title"><code><span className="mg-code__c">{CSS_COMMENT}</span>{'\n.service-card {\n'}{CSS_RULES.map(([key, value]) => (
                  <span key={key}>{'  '}<span className="mg-code__k">{key}</span>: <span className="mg-code__v">{value}</span>;{'\n'}</span>
                ))}{'}'}</code></pre>
              </div>
            </div>
          </article>
        </section>

        <section className="mg-section" id="mg-customers" aria-labelledby="mg-customers-title">
          <div className="mg-head">
            <h2 id="mg-customers-title">{t(CUSTOMERS.title)}</h2>
            <p>{t(CUSTOMERS.note)}</p>
          </div>
          <div className="mg-cases">
            {CASES.map((item) => (
              <article key={item.name} className="mg-case" aria-labelledby={`mg-case-${item.swatch}`}>
                <div className="mg-case__org">
                  <i className={`mg-case__swatch mg-case__swatch--${item.swatch}`} aria-hidden="true" />
                  <h3 id={`mg-case-${item.swatch}`}>{item.name}</h3>
                </div>
                <p className="mg-case__who">{t(item.who)}</p>
                <p className="mg-case__fig">
                  <b>{item.figure}</b> <small>{t(item.unit)}</small>
                </p>
                <p className="mg-case__cap">{t(item.caption)}</p>
                <p className="mg-case__body">{t(item.body)}</p>
                <dl className="mg-case__facts">
                  {item.facts.map(([term, value]) => (
                    <div key={term.en}>
                      <dt>{t(term)}</dt>
                      <dd>{t(value)}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="mg-section" id="mg-pricing" aria-labelledby="mg-pricing-title">
          <div className="mg-head mg-head--price">
            <div className="mg-head__main">
              <h2 id="mg-pricing-title">{t(PRICING.title)}</h2>
              <p>{t(PRICING.note)}</p>
            </div>
            <div className="mg-seg mg-seg--bill" role="group" aria-label={t(PRICING.billing)}>
              <button type="button" aria-pressed={yearly} onClick={() => chooseBilling(true)}>{t(PRICING.yearly)}</button>
              <button type="button" aria-pressed={!yearly} onClick={() => chooseBilling(false)}>{t(PRICING.monthly)}</button>
            </div>
          </div>
          <table className="mg-table" role="table" aria-labelledby="mg-pricing-title" aria-describedby="mg-price-note">
            <colgroup>
              <col className="mg-table__label" />
              <col />
              <col className="is-team" />
              <col />
            </colgroup>
            <thead role="rowgroup">
              <tr role="row">
                <td role="cell" className="mg-table__corner">
                  <span className="mg-price-note" id="mg-price-note">{t(yearly ? PRICING.perYear : PRICING.perMonth)}</span>
                </td>
                {PLANS.map((plan) => (
                  <th key={plan.id} role="columnheader" scope="col" className={plan.id === 'team' ? 'is-team' : undefined}>
                    <span className="mg-plan">{plan.name}</span>
                    <span className="mg-price"><b>{priceOf(plan)}</b></span>
                    <span className="mg-price-note">{noteOf(plan)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody role="rowgroup">
              {PRICE_ROWS.map((row) => (
                <tr key={row.name.en} role="row">
                  <th role="rowheader" scope="row">{t(row.name)}</th>
                  {row.values.map((value, index) => (
                    <td
                      key={PLANS[index].id}
                      role="cell"
                      data-label={PLANS[index].name}
                      className={[PLANS[index].id === 'team' ? 'is-team' : '', value === null ? 'is-no' : ''].filter(Boolean).join(' ') || undefined}
                    >
                      {t(value ?? NO)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot role="rowgroup">
              <tr role="row">
                <td role="cell" className="mg-table__corner" />
                <td role="cell"><a className="mg-btn" href="#mg-start">{t(PRICING.startFree)}</a></td>
                <td role="cell" className="is-team"><a className="mg-btn mg-btn--dark" href="#mg-start">{t(PRICING.tryTeam)}</a></td>
                <td role="cell"><a className="mg-btn" href="mailto:sales@margin.example">{t(PRICING.sales)}</a></td>
              </tr>
            </tfoot>
          </table>
        </section>

        <section className="mg-section mg-faq" id="mg-questions" aria-labelledby="mg-questions-title">
          <h2 id="mg-questions-title">{t(QUESTIONS.title)}</h2>
          <dl>
            {QUESTIONS.items.map((item) => (
              <div key={item.q.en}>
                <dt>{t(item.q)}</dt>
                <dd>{t(item.a)}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mg-section" id="mg-start" aria-labelledby="mg-start-title">
          <div className="mg-start">
            <div className="mg-start__text">
              <h2 id="mg-start-title">{t(START.title)}</h2>
              <p>{t(START.note)}</p>
            </div>
            {sentTo !== null ? (
              <div className="mg-done">
                <p className="mg-done__title" ref={doneRef} tabIndex={-1}>{t(START.doneTitle)}</p>
                <p className="mg-done__body">{fill(t(START.doneBody), { email: sentTo })}</p>
                <button type="button" className="mg-btn" onClick={() => setSentTo(null)}>{t(START.again)}</button>
              </div>
            ) : (
              <form className="mg-form" noValidate onSubmit={signUp}>
                <div className={`mg-field${emailError ? ' is-invalid' : ''}`}>
                  <label htmlFor="mg-email">{t(START.email)}</label>
                  <input
                    id="mg-email"
                    ref={emailRef}
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    required
                    value={email}
                    aria-invalid={emailError ? true : undefined}
                    aria-describedby={emailError ? 'mg-email-error' : undefined}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (emailError) setEmailError(null);
                    }}
                  />
                  {emailError ? <p className="mg-field__error" id="mg-email-error" role="alert">{t(emailError === 'empty' ? START.empty : START.invalid)}</p> : null}
                </div>
                <button type="submit" className="mg-btn mg-btn--dark">{t(START.submit)}</button>
              </form>
            )}
          </div>
        </section>

        <footer className="mg-foot">
          <p className="mg-brand mg-brand--foot">
            <Logo />
            <b>{BRAND}</b>
          </p>
          <nav aria-label={t(FOOT.nav)}>
            <a href="#mg-features">{t(BAR.features)}</a>
            <a href="#mg-customers">{t(BAR.customers)}</a>
            <a href="#mg-pricing">{t(BAR.pricing)}</a>
            <a href="#mg-questions">{t(BAR.questions)}</a>
          </nav>
          <p className="mg-foot__company">{t(FOOT.company)}</p>
        </footer>

        <p className="mg-sr" role="status">{news}</p>
      </div>
    </FusionShell>
  );
}
