import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedFusionSoftInflatePage.css';

// The shop page of Cirro, a maker of inflatable pillows in Annecy, in the Soft Inflate style.
// The material is the page's own: white raised frames and recessed wells on a cool off-white,
// and one blown-up shape for every pillow drawn on it. Varela Round sets the name and the
// headings; Lexend sets everything you read or press. Sky blue marks only what is chosen,
// counted or open today.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

const fill = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));

/** A sentence with links in it: each {key} is replaced by the node of that name. */
const withNodes = (text: string, nodes: Record<string, ReactNode>) =>
  text.split(/(\{\w+\})/g).map((part, index) => {
    const key = part.match(/^\{(\w+)\}$/)?.[1];
    return <Fragment key={index}>{key && key in nodes ? nodes[key] : part}</Fragment>;
  });

const money = (value: number) => (Number.isInteger(value) ? `€${value}` : `€${value.toFixed(2)}`);

const NAME = 'Cirro';
const DELIVERY = 5.9;
const FREE_FROM = 60;

const IMG = {
  balloon: {
    src: 'https://images.unsplash.com/photo-1712574340322-aaeae2cbaa8f?w=1800&q=80&auto=format&fit=crop',
    alt: {
      en: 'A white heart-shaped balloon high in a clear blue sky',
      ko: 'A white heart-shaped balloon high in a clear blue sky',
      ja: 'A white heart-shaped balloon high in a clear blue sky',
    },
    credit: { name: 'insung yoon', url: 'https://unsplash.com/photos/a-white-balloon-floating-in-a-blue-sky-gUhMocUj1ow' },
  },
  fabric: {
    src: 'https://images.unsplash.com/photo-1743142883555-b0beac669a51?w=1000&q=80&auto=format&fit=crop',
    alt: {
      en: 'Close-up of white brushed fabric folding over itself',
      ko: 'Close-up of white brushed fabric folding over itself',
      ja: 'Close-up of white brushed fabric folding over itself',
    },
    credit: { name: 'breee luise', url: 'https://unsplash.com/photos/white-soft-and-fluffy-fabric-hL8F2s31BdE' },
  },
  bench: {
    src: 'https://images.unsplash.com/photo-1776472603139-909c099affd3?w=1200&q=80&auto=format&fit=crop',
    alt: {
      en: 'White fabric with a small band of rainbow light across its folds',
      ko: 'White fabric with a small band of rainbow light across its folds',
      ja: 'White fabric with a small band of rainbow light across its folds',
    },
    credit: { name: 'Yoko Saito', url: 'https://unsplash.com/photos/soft-white-fabric-with-subtle-rainbow-light-reflection-pykFL3LlmGY' },
  },
} satisfies Record<string, { src: string; alt: Tri; credit: { name: string; url: string } }>;

const TOP = {
  nav: { en: 'Shop sections', ko: 'Shop sections', ja: 'Shop sections' },
  pillows: { en: 'Pillows', ko: 'Pillows', ja: 'Pillows' },
  fill: { en: 'How to fill one', ko: 'How to fill one', ja: 'How to fill one' },
  shop: { en: 'The shop', ko: 'The shop', ja: 'The shop' },
  questions: { en: 'Questions', ko: 'Questions', ja: 'Questions' },
  bag: { en: 'Bag', ko: 'Bag', ja: 'Bag' },
  bagTitle: { en: 'Your bag', ko: 'Your bag', ja: 'Your bag' },
  bagEmpty: {
    en: 'Nothing in your bag yet. Choose a cover and add a pillow.',
    ko: 'Nothing in your bag yet. Choose a cover and add a pillow.',
    ja: 'Nothing in your bag yet. Choose a cover and add a pillow.',
  },
  line: { en: '{pillow}, {cover} cover', ko: '{pillow}, {cover} cover', ja: '{pillow}, {cover} cover' },
  delivery: { en: 'Delivery in the EU', ko: 'Delivery in the EU', ja: 'Delivery in the EU' },
  free: { en: 'Free', ko: 'Free', ja: 'Free' },
  total: { en: 'Total', ko: 'Total', ja: 'Total' },
  freeFrom: {
    en: 'Delivery is free from €60. Orders leave Annecy the next working day.',
    ko: 'Delivery is free from €60. Orders leave Annecy the next working day.',
    ja: 'Delivery is free from €60. Orders leave Annecy the next working day.',
  },
  addedOne: {
    en: 'Added the {pillow} pillow in {cover} to your bag. 1 pillow in the bag.',
    ko: 'Added the {pillow} pillow in {cover} to your bag. 1 pillow in the bag.',
    ja: 'Added the {pillow} pillow in {cover} to your bag. 1 pillow in the bag.',
  },
  addedMany: {
    en: 'Added the {pillow} pillow in {cover} to your bag. {n} pillows in the bag.',
    ko: 'Added the {pillow} pillow in {cover} to your bag. {n} pillows in the bag.',
    ja: 'Added the {pillow} pillow in {cover} to your bag. {n} pillows in the bag.',
  },
} satisfies Record<string, Tri>;

const HERO = {
  line: {
    en: 'Inflatable pillows with a soft brushed cover, sewn in Annecy.',
    ko: 'Inflatable pillows with a soft brushed cover, sewn in Annecy.',
    ja: 'Inflatable pillows with a soft brushed cover, sewn in Annecy.',
  },
  cta: { en: 'See the three pillows', ko: 'See the three pillows', ja: 'See the three pillows' },
} satisfies Record<string, Tri>;

type CoverId = 'chalk' | 'sky' | 'slate';
type PillowId = 'travel' | 'camp' | 'wide';

const COVERS: Array<{ id: CoverId; name: Tri }> = [
  { id: 'chalk', name: { en: 'Chalk', ko: 'Chalk', ja: 'Chalk' } },
  { id: 'sky', name: { en: 'Sky', ko: 'Sky', ja: 'Sky' } },
  { id: 'slate', name: { en: 'Slate', ko: 'Slate', ja: 'Slate' } },
];

const coverName = (id: CoverId) => (COVERS.find((cover) => cover.id === id) ?? COVERS[0]).name;

const SHELF = {
  title: { en: 'Three pillows', ko: 'Three pillows', ja: 'Three pillows' },
  note: {
    en: 'The same brushed cover and the same valve in three sizes. The cover zips off and goes in the wash at 30 °C.',
    ko: 'The same brushed cover and the same valve in three sizes. The cover zips off and goes in the wash at 30 °C.',
    ja: 'The same brushed cover and the same valve in three sizes. The cover zips off and goes in the wash at 30 °C.',
  },
  legend: { en: 'Cover colour for the {pillow} pillow', ko: 'Cover colour for the {pillow} pillow', ja: 'Cover colour for the {pillow} pillow' },
  add: { en: 'Add to bag', ko: 'Add to bag', ja: 'Add to bag' },
  have: { en: '{n} in your bag', ko: '{n} in your bag', ja: '{n} in your bag' },
} satisfies Record<string, Tri>;

const PILLOWS: Array<{ id: PillowId; name: Tri; price: number; size: string; cover: CoverId; body: Tri }> = [
  {
    id: 'travel',
    name: { en: 'Travel', ko: 'Travel', ja: 'Travel' },
    price: 34,
    size: '36 × 26 cm',
    cover: 'chalk',
    body: {
      en: 'For planes, trains and night buses. Fills in two breaths and packs to 9 × 6 cm. Weighs 68 g.',
      ko: 'For planes, trains and night buses. Fills in two breaths and packs to 9 × 6 cm. Weighs 68 g.',
      ja: 'For planes, trains and night buses. Fills in two breaths and packs to 9 × 6 cm. Weighs 68 g.',
    },
  },
  {
    id: 'camp',
    name: { en: 'Camp', ko: 'Camp', ja: 'Camp' },
    price: 42,
    size: '44 × 30 cm',
    cover: 'sky',
    body: {
      en: 'For a tent or a hut bunk. Fills in three breaths and packs to 11 × 7 cm. Weighs 96 g.',
      ko: 'For a tent or a hut bunk. Fills in three breaths and packs to 11 × 7 cm. Weighs 96 g.',
      ja: 'For a tent or a hut bunk. Fills in three breaths and packs to 11 × 7 cm. Weighs 96 g.',
    },
  },
  {
    id: 'wide',
    name: { en: 'Wide', ko: 'Wide', ja: 'Wide' },
    price: 56,
    size: '62 × 38 cm',
    cover: 'slate',
    body: {
      en: 'Wide enough for two people sharing a double sleeping bag. Fills in five breaths and packs to 13 × 8 cm. Weighs 142 g.',
      ko: 'Wide enough for two people sharing a double sleeping bag. Fills in five breaths and packs to 13 × 8 cm. Weighs 142 g.',
      ja: 'Wide enough for two people sharing a double sleeping bag. Fills in five breaths and packs to 13 × 8 cm. Weighs 142 g.',
    },
  },
];

const FILL = {
  title: { en: 'How to fill one', ko: 'How to fill one', ja: 'How to fill one' },
  note: {
    en: 'Shown here with the Camp pillow. Travel takes two breaths and Wide takes five; everything else is the same.',
    ko: 'Shown here with the Camp pillow. Travel takes two breaths and Wide takes five; everything else is the same.',
    ja: 'Shown here with the Camp pillow. Travel takes two breaths and Wide takes five; everything else is the same.',
  },
  made: { en: 'What it is made of', ko: 'What it is made of', ja: 'What it is made of' },
} satisfies Record<string, Tri>;

// The four drawn stages, from flat to packed, in the same order as the steps.
const STAGES = ['flat', 'full', 'set', 'pack'] as const;

const STEPS: Array<{ title: Tri; body: Tri }> = [
  {
    title: { en: 'Unroll it', ko: 'Unroll it', ja: 'Unroll it' },
    body: {
      en: 'Take it out of its pouch, lay it flat and twist the valve cap open a quarter turn.',
      ko: 'Take it out of its pouch, lay it flat and twist the valve cap open a quarter turn.',
      ja: 'Take it out of its pouch, lay it flat and twist the valve cap open a quarter turn.',
    },
  },
  {
    title: { en: 'Three breaths', ko: 'Three breaths', ja: 'Three breaths' },
    body: {
      en: 'Breathe out into the valve three times. A flap inside keeps the air in between breaths.',
      ko: 'Breathe out into the valve three times. A flap inside keeps the air in between breaths.',
      ja: 'Breathe out into the valve three times. A flap inside keeps the air in between breaths.',
    },
  },
  {
    title: { en: 'Let a little out', ko: 'Let a little out', ja: 'Let a little out' },
    body: {
      en: 'Lie down on it, then press the middle of the valve for a second at a time until it feels right.',
      ko: 'Lie down on it, then press the middle of the valve for a second at a time until it feels right.',
      ja: 'Lie down on it, then press the middle of the valve for a second at a time until it feels right.',
    },
  },
  {
    title: { en: 'Pack it', ko: 'Pack it', ja: 'Pack it' },
    body: {
      en: 'Hold the valve open, roll it up from the far end and slide the roll back into the pouch.',
      ko: 'Hold the valve open, roll it up from the far end and slide the roll back into the pouch.',
      ja: 'Hold the valve open, roll it up from the far end and slide the roll back into the pouch.',
    },
  },
];

const MATERIALS: Array<[Tri, Tri]> = [
  [
    { en: 'Cover', ko: 'Cover', ja: 'Cover' },
    {
      en: 'Brushed knit, 88% recycled polyester and 12% elastane, 190 g/m². Knitted in Roanne and sewn in our workshop behind the shop.',
      ko: 'Brushed knit, 88% recycled polyester and 12% elastane, 190 g/m². Knitted in Roanne and sewn in our workshop behind the shop.',
      ja: 'Brushed knit, 88% recycled polyester and 12% elastane, 190 g/m². Knitted in Roanne and sewn in our workshop behind the shop.',
    },
  ],
  [
    { en: 'Inside', ko: 'Inside', ja: 'Inside' },
    {
      en: 'A bladder of 0.2 mm TPU film with welded seams. It has far less smell than PVC and stays supple in the cold.',
      ko: 'A bladder of 0.2 mm TPU film with welded seams. It has far less smell than PVC and stays supple in the cold.',
      ja: 'A bladder of 0.2 mm TPU film with welded seams. It has far less smell than PVC and stays supple in the cold.',
    },
  ],
  [
    { en: 'Valve', ko: 'Valve', ja: 'Valve' },
    {
      en: 'One valve for filling and letting air out with one thumb. It unscrews by hand, and we send a new one free for five years.',
      ko: 'One valve for filling and letting air out with one thumb. It unscrews by hand, and we send a new one free for five years.',
      ja: 'One valve for filling and letting air out with one thumb. It unscrews by hand, and we send a new one free for five years.',
    },
  ],
];

const SHOP = {
  title: { en: 'The shop in Annecy', ko: 'The shop in Annecy', ja: 'The shop in Annecy' },
  note: {
    en: 'Every pillow is out on the bench, already blown up, so you can lie down and try them. We sew them in the room at the back.',
    ko: 'Every pillow is out on the bench, already blown up, so you can lie down and try them. We sew them in the room at the back.',
    ja: 'Every pillow is out on the bench, already blown up, so you can lie down and try them. We sew them in the room at the back.',
  },
  street: { en: '14 rue Sainte-Claire', ko: '14 rue Sainte-Claire', ja: '14 rue Sainte-Claire' },
  town: { en: '74000 Annecy, France', ko: '74000 Annecy, France', ja: '74000 Annecy, France' },
  hours: { en: 'Opening hours', ko: 'Opening hours', ja: 'Opening hours' },
  closed: { en: 'Closed', ko: 'Closed', ja: 'Closed' },
  today: { en: 'Today', ko: 'Today', ja: 'Today' },
  openNow: { en: 'Open now, until {time}.', ko: 'Open now, until {time}.', ja: 'Open now, until {time}.' },
  opensToday: { en: 'Closed now. Opens today at {time}.', ko: 'Closed now. Opens today at {time}.', ja: 'Closed now. Opens today at {time}.' },
  opensTomorrow: { en: 'Closed now. Opens tomorrow at {time}.', ko: 'Closed now. Opens tomorrow at {time}.', ja: 'Closed now. Opens tomorrow at {time}.' },
  opensOn: { en: 'Closed now. Opens on {day} at {time}.', ko: 'Closed now. Opens on {day} at {time}.', ja: 'Closed now. Opens on {day} at {time}.' },
  also: { en: 'Also sold at', ko: 'Also sold at', ja: 'Also sold at' },
  post: {
    en: 'Online orders leave Annecy the next working day. Delivery in the EU costs €5.90 and is free from €60.',
    ko: 'Online orders leave Annecy the next working day. Delivery in the EU costs €5.90 and is free from €60.',
    ja: 'Online orders leave Annecy the next working day. Delivery in the EU costs €5.90 and is free from €60.',
  },
  caption: {
    en: 'Chalk covers on the bench by the window, late morning.',
    ko: 'Chalk covers on the bench by the window, late morning.',
    ja: 'Chalk covers on the bench by the window, late morning.',
  },
} satisfies Record<string, Tri>;

// Sunday first, as Date.getDay() counts.
const WEEKDAYS: Tri[] = [
  { en: 'Sunday', ko: 'Sunday', ja: 'Sunday' },
  { en: 'Monday', ko: 'Monday', ja: 'Monday' },
  { en: 'Tuesday', ko: 'Tuesday', ja: 'Tuesday' },
  { en: 'Wednesday', ko: 'Wednesday', ja: 'Wednesday' },
  { en: 'Thursday', ko: 'Thursday', ja: 'Thursday' },
  { en: 'Friday', ko: 'Friday', ja: 'Friday' },
  { en: 'Saturday', ko: 'Saturday', ja: 'Saturday' },
];

/** Opening and closing time in minutes after midnight, per weekday (Sunday first). Monday is closed. */
type Span = readonly [number, number];
const OPEN: Array<Span | null> = [[600, 780], null, [600, 1110], [600, 1110], [600, 1110], [600, 1110], [600, 1140]];

const HOUR_ROWS: Array<{ days: number[]; label: Tri }> = [
  { days: [1], label: WEEKDAYS[1] },
  { days: [2, 3, 4, 5], label: { en: 'Tuesday to Friday', ko: 'Tuesday to Friday', ja: 'Tuesday to Friday' } },
  { days: [6], label: WEEKDAYS[6] },
  { days: [0], label: WEEKDAYS[0] },
];

const STOCKISTS: Array<{ name: string; city: Tri }> = [
  { name: 'Haute Route', city: { en: 'Geneva', ko: 'Geneva', ja: 'Geneva' } },
  { name: 'L’Atelier Vertical', city: { en: 'Chamonix', ko: 'Chamonix', ja: 'Chamonix' } },
  { name: 'Casa Alpina', city: { en: 'Turin', ko: 'Turin', ja: 'Turin' } },
  { name: 'Bergstube', city: { en: 'Innsbruck', ko: 'Innsbruck', ja: 'Innsbruck' } },
  { name: 'Le Bivouac', city: { en: 'Lyon', ko: 'Lyon', ja: 'Lyon' } },
  { name: 'Fjellbua', city: { en: 'Oslo', ko: 'Oslo', ja: 'Oslo' } },
];

const clock = (minutes: number) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const PARIS = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });

/** The weekday and the time of day in Annecy, wherever the visitor is. */
function annecyNow(date: Date): { day: number; minutes: number } {
  const parts = PARIS.formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((entry) => entry.type === type)?.value ?? '';
  const day = SHORT_DAYS.indexOf(part('weekday'));
  if (day < 0) throw new Error(`Unexpected weekday from Intl: ${part('weekday')}`);
  return { day, minutes: Number(part('hour')) * 60 + Number(part('minute')) };
}

const QUESTIONS: Array<[Tri, Tri]> = [
  [
    { en: 'Does it smell of plastic when it is new?', ko: 'Does it smell of plastic when it is new?', ja: 'Does it smell of plastic when it is new?' },
    {
      en: 'A little, for the first day. Blow it up, take the cover off and leave it by an open window overnight. By morning the smell has gone.',
      ko: 'A little, for the first day. Blow it up, take the cover off and leave it by an open window overnight. By morning the smell has gone.',
      ja: 'A little, for the first day. Blow it up, take the cover off and leave it by an open window overnight. By morning the smell has gone.',
    },
  ],
  [
    { en: 'Will it still be firm in the morning?', ko: 'Will it still be firm in the morning?', ja: 'Will it still be firm in the morning?' },
    {
      en: 'Nearly. It softens by about half a breath overnight, mostly because the air inside cools down. One breath into the valve sets it right again.',
      ko: 'Nearly. It softens by about half a breath overnight, mostly because the air inside cools down. One breath into the valve sets it right again.',
      ja: 'Nearly. It softens by about half a breath overnight, mostly because the air inside cools down. One breath into the valve sets it right again.',
    },
  ],
  [
    { en: 'Can I wash it?', ko: 'Can I wash it?', ja: 'Can I wash it?' },
    {
      en: 'The cover, yes: zip it off and wash it at 30 °C, then dry it flat. Wipe the bladder with a damp cloth.',
      ko: 'The cover, yes: zip it off and wash it at 30 °C, then dry it flat. Wipe the bladder with a damp cloth.',
      ja: 'The cover, yes: zip it off and wash it at 30 °C, then dry it flat. Wipe the bladder with a damp cloth.',
    },
  ],
  [
    { en: 'What if the valve starts to leak?', ko: 'What if the valve starts to leak?', ja: 'What if the valve starts to leak?' },
    {
      en: 'Send us a photo through your order page. We post a new valve within two working days, free for five years after you bought the pillow.',
      ko: 'Send us a photo through your order page. We post a new valve within two working days, free for five years after you bought the pillow.',
      ja: 'Send us a photo through your order page. We post a new valve within two working days, free for five years after you bought the pillow.',
    },
  ],
];

const FOOT = {
  questions: { en: 'Questions', ko: 'Questions', ja: 'Questions' },
  credits: {
    en: 'Photographs by {a}, {b} and {c} on {u}',
    ko: 'Photographs by {a}, {b} and {c} on {u}',
    ja: 'Photographs by {a}, {b} and {c} on {u}',
  },
} satisfies Record<string, Tri>;

const PROMPT_EN = `Design one real page in Soft Inflate style: white raised frames and recessed wells on a cool off-white, every drawn object blown up with air, and sky blue only on what is chosen, counted or open today.

Pick a believable subject whose things really hold air or rest soft, such as a maker of inflatable pillows, a bouncy-castle hire, a balloon workshop or a camping-mat brand, and write its real content. The page must read as that subject's page, never as a page about its own style.

COLOR TOKENS:
--bg: #f2f4f8 (cool off-white)
--card: #ffffff (raised)
--well: #e7eaf0 (recessed)
--ink: #0a0c10
--ink-2: #2a2f38 (reading text)
--muted: #535b69
--line: rgba(10, 12, 16, 0.26)
--edge: rgba(10, 12, 16, 0.22) (the 1px border of every raised or recessed surface)
--sky: #0ea5e9 (the bag count)
--sky-ink: #0369a1 (the chosen cover's ring, "Today", step numbers, the 2px focus ring; it is white on the photograph and ink round a swatch)
Cover colours, used only on drawn pillows and their swatches:
--chalk: #fbfcfe
--sky-cover: #a9dcf6
--slate: #5f6d80
Shadows use rgb(30 41 59) at 0.13 to 0.45 and white at up to 0.95. On the hero photograph a dark teal, rgb(4 40 58) at 0.18 to 0.36, makes the scrim under the white text and the shadows of the name and the button. Swatch edges are ink at 0.4. No other colours: no error red (the page has no forms), no hover colour (a hovered link turns ink and underlines, a hovered button rises 1px).

THE MATERIAL:
- Raised: white, 1px edge, a long soft shadow down and right (18px 26px 50px at 0.13), a white glow up and left (-10px -10px 30px at 0.95) and a 1px white inner top highlight. Used for the hero photograph, the two other photographs, buttons, the bag, the bag list and today's row in the opening hours. The bag list opens over the photograph, so it keeps only the dark shadow.
- Recessed: the well colour, 1px edge, two inset shadows (7px 7px 18px dark, -6px -6px 16px white). Used for the shelf the pillows rest on and the tray of filling stages.
- The pillow: one shape for every pillow on the page, border-radius 30% / 44%, the cover colour, a white highlight (radial gradient from the upper left), a darker underside (radial gradient at the lower right), inset shading and a contact shadow underneath. Flat, set and packed stages change only the aspect ratio and the size.
- Radii: 32px on the hero and the shelf (26px on phones), 30px on the tray (22px on phones), 28px on photographs, 22px on the bag list, 16px on buttons and today's row, 14px on the bag. Never a pill.

TYPOGRAPHY:
Display: Varela Round 400, its only weight, for the name, headings, the address, step numbers and questions. Stroke ends fully rounded, like a seam pressed out by air.
- Name clamp(5rem, 17vw, 13.25rem), line-height 0.86, tracking -0.035em
- h2 clamp(2.125rem, 4.1vw, 3.25rem), line-height 1.08, tracking -0.02em
- h3 1.625rem (1.375rem for steps and the stockists); address clamp(1.625rem, 2.5vw, 2rem); step numbers 2rem (1.75rem on phones); questions 1.1875rem
Body: Lexend 350 to 600, 1rem, line-height 1.72, for everything you read or press. Prices 1.5rem, hours and sizes 500 with tabular figures, buttons 500 at 1rem, the hero line 1.25rem at 350.
Hierarchy comes from size, never a faux bold (font-synthesis: none). No text under 16px.

LAYOUT:
- Shop bar: the name, four section links and the bag with its count. On phones the links are hidden.
- Hero: one raised photograph of a white balloon in a clear sky, the name and one line set inside it at the bottom left, "See the three pillows" at the bottom right. 16:9 up to the height of the first screen, 4:3 on tablets, 2:3 on phones.
- Three pillows: a recessed shelf with the three pillows drawn side by side at their real relative sizes (36 × 26, 44 × 30 and 62 × 38 cm, columns 36fr 44fr 62fr) and each size under its pillow; under the shelf, three columns on the same grid with name and price over a 1px rule, the description, the cover swatches and Add to bag. Under 960px the columns stack; under 600px the sizes move from the shelf into each pillow's text.
- How to fill one: a recessed tray split into four stages by 1px lines (flat, full, set, packed), the four numbered steps under it; then a square photograph of the cover fabric beside a ruled list of what it is made of.
- The shop: the address large, the week's opening hours as ruled rows with today's row raised and marked, a line saying whether the shop is open now (Annecy time), the stockists in two ruled columns, and a tall photograph with a caption.
- Questions: ruled rows, question left, answer right.
- Max width about 1120px, sections 128px apart (88px on phones).

COMPONENTS:
- Cover swatches: 32px raised circles in a 44px target, radio buttons. The chosen one gets a 2px sky-ink ring 3px out. Choosing one recolours that pillow on the shelf (and the Camp pillow also recolours the filling stages), and the cover's name shows beside the swatches.
- Buttons: 50px high, raised, 16px radius, ink text; pressed, they sink into the surface.
- Add to bag: adds that pillow in its chosen cover, updates the count in the shop bar and announces it in a polite live region; "1 in your bag" appears beside the button.
- The bag: a 44px raised button with its count on a sky circle. It opens a raised list of what is in it, the EU delivery charge (€5.90, free from €60) and the total; Escape or a click outside closes it.
- Opening hours: today's row is raised and says Today.
- Rows: 1px lines at 0.26 opacity.

MOTION:
- On load, and whenever a cover is chosen, that pillow on the shelf inflates once from its base (0.7s, a slight overshoot). Buttons rise 1px on hover and sink when pressed (0.16s). Nothing loops and nothing else moves.
- prefers-reduced-motion switches all of it off.

FORBIDDEN:
- Cards, pills, a grid of identical rounded boxes
- A small label above a heading, all-caps tracked labels
- Neumorphic toggles and sliders shown for their own sake, grey text on grey, shadows with no edge
- Drawn balloons, clouds, faces or other figurative illustration
- Glass blur, gradient blobs, a pastel rainbow
- A page about its own style

OUTPUT:
1) CSS custom properties for the tokens, the two surfaces and the pillow shape
2) Semantic HTML and CSS
3) Responsive layout down to 320px with no horizontal scroll
4) Working controls: cover radios per pillow, add to bag with a live count and a bag list, today marked in the opening hours; visible focus; reduced-motion support`;

const PROMPTS: Record<Lang, string> = {
  en: PROMPT_EN,
  ko: PROMPT_EN,
  ja: PROMPT_EN,
};

const keyOf = (pillow: PillowId, cover: CoverId) => `${pillow}:${cover}`;

export function PortedFusionSoftInflatePage({ lang }: PortedStylePageProps) {
  const [covers, setCovers] = useState<Record<PillowId, CoverId>>({ travel: 'chalk', camp: 'sky', wide: 'slate' });
  const [bag, setBag] = useState<Record<string, number>>({});
  const [bagOpen, setBagOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [now, setNow] = useState(() => annecyNow(new Date()));
  const bagRef = useRef<HTMLDivElement>(null);
  const bagButtonRef = useRef<HTMLButtonElement>(null);
  const t = (text: Tri) => text[lang];

  const count = Object.values(bag).reduce((sum, n) => sum + n, 0);
  const lines = PILLOWS.flatMap((pillow) =>
    COVERS.filter((cover) => (bag[keyOf(pillow.id, cover.id)] ?? 0) > 0).map((cover) => ({
      key: keyOf(pillow.id, cover.id),
      pillow,
      cover,
      n: bag[keyOf(pillow.id, cover.id)],
    })),
  );
  const subtotal = lines.reduce((sum, line) => sum + line.n * line.pillow.price, 0);
  const delivery = subtotal >= FREE_FROM ? 0 : DELIVERY;

  // The time in Annecy moves on while the page is open, so today and the open line follow it.
  useEffect(() => {
    const timer = window.setInterval(() => setNow(annecyNow(new Date())), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  // The bag list closes on Escape and on a click anywhere else. Escape from inside the bag
  // hands focus back to the bag button.
  useEffect(() => {
    if (!bagOpen) return;
    const onPointer = (event: PointerEvent) => {
      if (!bagRef.current?.contains(event.target as Node)) setBagOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (bagRef.current?.contains(document.activeElement)) bagButtonRef.current?.focus();
      setBagOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [bagOpen]);

  const addToBag = (pillowId: PillowId) => {
    const pillow = PILLOWS.find((entry) => entry.id === pillowId) ?? PILLOWS[0];
    const cover = covers[pillowId];
    const key = keyOf(pillowId, cover);
    setBag({ ...bag, [key]: (bag[key] ?? 0) + 1 });
    const n = count + 1;
    setAnnouncement(fill(t(n === 1 ? TOP.addedOne : TOP.addedMany), { pillow: t(pillow.name), cover: t(coverName(cover)), n }));
  };

  const open = OPEN[now.day];
  let status: string;
  if (open && now.minutes >= open[0] && now.minutes < open[1]) {
    status = fill(t(SHOP.openNow), { time: clock(open[1]) });
  } else if (open && now.minutes < open[0]) {
    status = fill(t(SHOP.opensToday), { time: clock(open[0]) });
  } else {
    const ahead = [1, 2, 3, 4, 5, 6, 7].find((step) => OPEN[(now.day + step) % 7] !== null) ?? 1;
    const day = (now.day + ahead) % 7;
    const time = clock((OPEN[day] as Span)[0]);
    status = ahead === 1 ? fill(t(SHOP.opensTomorrow), { time }) : fill(t(SHOP.opensOn), { day: t(WEEKDAYS[day]), time });
  }

  const campCover = covers.camp;

  return (
    <FusionShell
      fusionId="fusion-soft-inflate"
      lang={lang}
      tone="light"
      accent="#0369a1"
      prev={{ href: '/pages/fusion-pure-noir.html', label: 'Pure Noir' }}
      prompts={PROMPTS}
    >
      <div className="cr">
        <header className="cr-bar">
          <p className="cr-mark">{NAME}</p>
          <nav className="cr-bar__nav" aria-label={t(TOP.nav)}>
            <a href="#cr-pillows">{t(TOP.pillows)}</a>
            <a href="#cr-fill">{t(TOP.fill)}</a>
            <a href="#cr-shop">{t(TOP.shop)}</a>
            <a href="#cr-questions">{t(TOP.questions)}</a>
          </nav>
          <div className="cr-bag" ref={bagRef}>
            <button
              ref={bagButtonRef}
              type="button"
              className="cr-bag__button cr-raised"
              aria-expanded={bagOpen}
              aria-controls="cr-bag-list"
              onClick={() => setBagOpen(!bagOpen)}
            >
              {t(TOP.bag)} <span className="cr-bag__count">{count}</span>
            </button>
            <div className="cr-bag__list cr-raised" id="cr-bag-list" hidden={!bagOpen}>
              <p className="cr-bag__title">{t(TOP.bagTitle)}</p>
              {lines.length === 0 ? (
                <p className="cr-bag__empty">{t(TOP.bagEmpty)}</p>
              ) : (
                <>
                  <ul className="cr-bag__lines">
                    {lines.map((line) => (
                      <li key={line.key}>
                        <span>
                          {fill(t(TOP.line), { pillow: t(line.pillow.name), cover: t(line.cover.name) })}
                          {line.n > 1 ? ` × ${line.n}` : ''}
                        </span>
                        <b>{money(line.n * line.pillow.price)}</b>
                      </li>
                    ))}
                  </ul>
                  <dl className="cr-bag__sum">
                    <div>
                      <dt>{t(TOP.delivery)}</dt>
                      <dd>{delivery === 0 ? t(TOP.free) : money(delivery)}</dd>
                    </div>
                    <div className="cr-bag__total">
                      <dt>{t(TOP.total)}</dt>
                      <dd>{money(subtotal + delivery)}</dd>
                    </div>
                  </dl>
                  <p className="cr-bag__note">{t(TOP.freeFrom)}</p>
                </>
              )}
            </div>
          </div>
          <p className="cr-vh" role="status">{announcement}</p>
        </header>

        <section className="cr-hero cr-raised" aria-labelledby="cr-name">
          <img src={IMG.balloon.src} alt={t(IMG.balloon.alt)} width={1800} height={1200} fetchPriority="high" decoding="async" />
          <div className="cr-hero__say">
            <div>
              <h1 className="cr-name" id="cr-name">{NAME}</h1>
              <p className="cr-hero__line">{t(HERO.line)}</p>
            </div>
            <a className="cr-btn cr-raised" href="#cr-pillows">{t(HERO.cta)}</a>
          </div>
        </section>

        <section className="cr-section" id="cr-pillows" aria-labelledby="cr-pillows-title">
          <div className="cr-head">
            <h2 id="cr-pillows-title" className="cr-h2">{t(SHELF.title)}</h2>
            <p>{t(SHELF.note)}</p>
          </div>

          <div className="cr-shelf cr-well cr-cols" aria-hidden="true">
            {PILLOWS.map((pillow) => (
              <div key={pillow.id}>
                {/* A new key mounts a new pillow, so a newly chosen cover inflates it once. */}
                <div key={covers[pillow.id]} className={`cr-puff cr-puff--${covers[pillow.id]} cr-puff--${pillow.id}`} />
                <span className="cr-dims">{pillow.size}</span>
              </div>
            ))}
          </div>

          <div className="cr-prods cr-cols">
            {PILLOWS.map((pillow) => {
              const chosen = covers[pillow.id];
              const held = COVERS.reduce((sum, cover) => sum + (bag[keyOf(pillow.id, cover.id)] ?? 0), 0);
              return (
                <article key={pillow.id} className="cr-prod" aria-labelledby={`cr-${pillow.id}-name`}>
                  <div className="cr-prod__title">
                    <h3 id={`cr-${pillow.id}-name`} className="cr-h3">{t(pillow.name)}</h3>
                    <span className="cr-price">{money(pillow.price)}</span>
                  </div>
                  <p className="cr-prod__size">{pillow.size}</p>
                  <p className="cr-prod__body">{t(pillow.body)}</p>
                  <fieldset className="cr-cover">
                    <legend className="cr-vh">{fill(t(SHELF.legend), { pillow: t(pillow.name) })}</legend>
                    <span className="cr-cover__name" aria-hidden="true">{t(coverName(chosen))}</span>
                    {COVERS.map((cover) => (
                      <label key={cover.id} className={`cr-sw cr-sw--${cover.id}`}>
                        <input
                          type="radio"
                          name={`cr-cover-${pillow.id}`}
                          value={cover.id}
                          checked={cover.id === chosen}
                          onChange={() => setCovers({ ...covers, [pillow.id]: cover.id })}
                        />
                        <span className="cr-vh">{t(cover.name)}</span>
                      </label>
                    ))}
                  </fieldset>
                  <div className="cr-prod__buy">
                    <button
                      type="button"
                      className="cr-btn cr-raised"
                      aria-describedby={`cr-${pillow.id}-name`}
                      onClick={() => addToBag(pillow.id)}
                    >
                      {t(SHELF.add)}
                    </button>
                    {held > 0 ? <p className="cr-prod__have">{fill(t(SHELF.have), { n: held })}</p> : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="cr-section" id="cr-fill" aria-labelledby="cr-fill-title">
          <div className="cr-head">
            <h2 id="cr-fill-title" className="cr-h2">{t(FILL.title)}</h2>
            <p>{t(FILL.note)}</p>
          </div>
          <div className="cr-tray cr-well" aria-hidden="true">
            {STAGES.map((stage) => (
              <div key={stage}>
                <div className={`cr-puff cr-puff--${campCover} cr-stage--${stage}`} />
              </div>
            ))}
          </div>
          <ol className="cr-steps">
            {STEPS.map((step, index) => (
              <li key={step.title.en} className="cr-step">
                <b className="cr-step__n">{index + 1}</b>
                <h3 className="cr-step__title">{t(step.title)}</h3>
                <p>{t(step.body)}</p>
              </li>
            ))}
          </ol>

          <div className="cr-made">
            <figure className="cr-frame cr-raised">
              <img src={IMG.fabric.src} alt={t(IMG.fabric.alt)} width={1000} height={1000} loading="lazy" decoding="async" />
            </figure>
            <div>
              <h3 className="cr-h3 cr-made__title">{t(FILL.made)}</h3>
              <dl className="cr-mat">
                {MATERIALS.map(([term, value]) => (
                  <div key={term.en}>
                    <dt>{t(term)}</dt>
                    <dd>{t(value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        <section className="cr-section" id="cr-shop" aria-labelledby="cr-shop-title">
          <div className="cr-head">
            <h2 id="cr-shop-title" className="cr-h2">{t(SHOP.title)}</h2>
            <p>{t(SHOP.note)}</p>
          </div>
          <div className="cr-visit">
            <div>
              <address className="cr-addr">
                {t(SHOP.street)}
                <br />
                {t(SHOP.town)}
              </address>
              <ul className="cr-hours" aria-label={t(SHOP.hours)}>
                {HOUR_ROWS.map((row) => {
                  const span = OPEN[row.days[0]];
                  const today = row.days.includes(now.day);
                  return (
                    <li
                      key={row.label.en}
                      className={[today && 'cr-raised is-today', !span && 'is-closed'].filter(Boolean).join(' ') || undefined}
                      aria-current={today ? 'date' : undefined}
                    >
                      <span>
                        {t(row.label)}
                        {today ? <> <span className="cr-today">{t(SHOP.today)}</span></> : null}
                      </span>
                      <b>{span ? `${clock(span[0])} – ${clock(span[1])}` : t(SHOP.closed)}</b>
                    </li>
                  );
                })}
              </ul>
              <p className="cr-now">{status}</p>
              <div className="cr-else">
                <h3 className="cr-h3 cr-else__title">{t(SHOP.also)}</h3>
                <ul className="cr-stock">
                  {STOCKISTS.map((stockist) => (
                    <li key={stockist.name}>
                      {stockist.name}
                      <span>{t(stockist.city)}</span>
                    </li>
                  ))}
                </ul>
                <p>{t(SHOP.post)}</p>
              </div>
            </div>
            <figure className="cr-vis">
              <div className="cr-frame cr-raised">
                <img src={IMG.bench.src} alt={t(IMG.bench.alt)} width={1200} height={1500} loading="lazy" decoding="async" />
              </div>
              <figcaption>{t(SHOP.caption)}</figcaption>
            </figure>
          </div>
        </section>

        <section className="cr-section" id="cr-questions" aria-labelledby="cr-questions-title">
          <div className="cr-head">
            <h2 id="cr-questions-title" className="cr-h2">{t(FOOT.questions)}</h2>
          </div>
          <dl className="cr-faq">
            {QUESTIONS.map(([question, answer]) => (
              <div key={question.en}>
                <dt>{t(question)}</dt>
                <dd>{t(answer)}</dd>
              </div>
            ))}
          </dl>
        </section>

        <footer className="cr-foot">
          <p className="cr-mark">{NAME}</p>
          <p>
            {withNodes(t(FOOT.credits), {
              a: <a href={IMG.balloon.credit.url}>{IMG.balloon.credit.name}</a>,
              b: <a href={IMG.fabric.credit.url}>{IMG.fabric.credit.name}</a>,
              c: <a href={IMG.bench.credit.url}>{IMG.bench.credit.name}</a>,
              u: <a href="https://unsplash.com">Unsplash</a>,
            })}
          </p>
        </footer>
      </div>
    </FusionShell>
  );
}
