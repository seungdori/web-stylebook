import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedRisographPrintPage.css';

// The page of Duplo Press, a risograph studio in a railway arch in Bermondsey, in the
// Risograph Print style. Everything coloured on the page is printed: the studio's house
// sheet with crop and registration marks and its name overprinted in two inks, off
// register; ink drums as tint ramps screened like the press screens them; paper stocks
// with a cut chip of each sheet; a quote docket with a tear-off stub; a separation proof
// beside the file checklist; and the production week. Young Serif sets the name, headings
// and the things you order; Anonymous Pro sets everything you read, type or check.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;
type Vars = CSSProperties & Record<`--${string}`, string | number>;

const fill = (text: string, values: Record<string, string | number>) =>
  text.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));

const count = new Intl.NumberFormat('en-GB');
const pounds = (pence: number) =>
  `£${(pence / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const NAME = 'Duplo Press';
const EMAIL = 'hello@duplopress.co.uk';
const PHONE = '020 7946 0381';
const PHONE_HREF = 'tel:+442079460381';
const STREET = 'Arch 14, Enid Street';
const POSTCODE = 'London SE16 3RA';

const MIN_COPIES = 50;
const MAX_COPIES = 5000;
const COPY_STEP = 50;
const MAX_INKS = 4;
// Quote numbers continue from the last job the studio quoted.
const FIRST_QUOTE = 4127;

const TOP = {
  nav: { en: 'Studio sections', ko: 'Studio sections', ja: 'Studio sections' },
  inks: { en: 'Inks', ko: 'Inks', ja: 'Inks' },
  paper: { en: 'Paper', ko: 'Paper', ja: 'Paper' },
  prices: { en: 'Prices', ko: 'Prices', ja: 'Prices' },
  files: { en: 'Files', ko: 'Files', ja: 'Files' },
  pickup: { en: 'Pickup', ko: 'Pickup', ja: 'Pickup' },
  order: { en: 'Start an order', ko: 'Start an order', ja: 'Start an order' },
} satisfies Record<string, Tri>;

const HERO = {
  claim: { en: 'Prints from 50 copies, ready in 3 days.', ko: 'Prints from 50 copies, ready in 3 days.', ja: 'Prints from 50 copies, ready in 3 days.' },
  body: {
    en: 'We print zines, posters, cards and booklets on two Riso MZ machines in a railway arch in Bermondsey. Price your job below, send the files, then collect from the arch or have the prints sent.',
    ko: 'We print zines, posters, cards and booklets on two Riso MZ machines in a railway arch in Bermondsey. Price your job below, send the files, then collect from the arch or have the prints sent.',
    ja: 'We print zines, posters, cards and booklets on two Riso MZ machines in a railway arch in Bermondsey. Price your job below, send the files, then collect from the arch or have the prints sent.',
  },
  cta: { en: 'Price a job', ko: 'Price a job', ja: 'Price a job' },
  slug: {
    en: 'House sheet, printed 17 November in Fluorescent Pink and Teal on Munken Pure 120 g.',
    ko: 'House sheet, printed 17 November in Fluorescent Pink and Teal on Munken Pure 120 g.',
    ja: 'House sheet, printed 17 November in Fluorescent Pink and Teal on Munken Pure 120 g.',
  },
} satisfies Record<string, Tri>;

const FACTS: Array<[Tri, Tri]> = [
  [
    { en: 'Copies', ko: 'Copies', ja: 'Copies' },
    { en: '50 to 5,000', ko: '50 to 5,000', ja: '50 to 5,000' },
  ],
  [
    { en: 'Sheet sizes', ko: 'Sheet sizes', ja: 'Sheet sizes' },
    { en: 'A5, A4, A3', ko: 'A5, A4, A3', ja: 'A5, A4, A3' },
  ],
  [
    { en: 'Inks', ko: 'Inks', ja: 'Inks' },
    { en: '14, up to 4 a job', ko: '14, up to 4 a job', ja: '14, up to 4 a job' },
  ],
  [
    { en: 'Open', ko: 'Open', ja: 'Open' },
    { en: 'Tue to Sat, 10:00 to 18:00', ko: 'Tue to Sat, 10:00 to 18:00', ja: 'Tue to Sat, 10:00 to 18:00' },
  ],
];

type InkId = 'black' | 'pink' | 'teal' | 'yellow' | 'sunflower' | 'orange' | 'red' | 'burgundy' | 'purple' | 'blue' | 'aqua' | 'green' | 'grey' | 'gold';

interface Ink {
  id: InkId;
  name: Tri;
  color: string;
  // The press lays the lightest ink down first. Lower ranks print earlier.
  rank: number;
  drum?: 1 | 2;
  out?: boolean;
  // Extra charge for the job, in pence.
  extra?: number;
}

// In the order the drums stand on the shelf.
const INKS: Ink[] = [
  { id: 'black', name: { en: 'Black', ko: 'Black', ja: 'Black' }, color: '#24242a', rank: 14 },
  { id: 'pink', name: { en: 'Fluorescent Pink', ko: 'Fluorescent Pink', ja: 'Fluorescent Pink' }, color: '#ff48b0', rank: 4, drum: 1 },
  { id: 'teal', name: { en: 'Teal', ko: 'Teal', ja: 'Teal' }, color: '#00838a', rank: 10, drum: 2 },
  { id: 'yellow', name: { en: 'Yellow', ko: 'Yellow', ja: 'Yellow' }, color: '#ffe800', rank: 1 },
  { id: 'sunflower', name: { en: 'Sunflower', ko: 'Sunflower', ja: 'Sunflower' }, color: '#ffb511', rank: 2 },
  { id: 'orange', name: { en: 'Fluorescent Orange', ko: 'Fluorescent Orange', ja: 'Fluorescent Orange' }, color: '#ff7477', rank: 3, out: true },
  { id: 'red', name: { en: 'Bright Red', ko: 'Bright Red', ja: 'Bright Red' }, color: '#f15060', rank: 6 },
  { id: 'burgundy', name: { en: 'Burgundy', ko: 'Burgundy', ja: 'Burgundy' }, color: '#914e72', rank: 12 },
  { id: 'purple', name: { en: 'Purple', ko: 'Purple', ja: 'Purple' }, color: '#765ba7', rank: 11 },
  { id: 'blue', name: { en: 'Federal Blue', ko: 'Federal Blue', ja: 'Federal Blue' }, color: '#3d5588', rank: 13 },
  { id: 'aqua', name: { en: 'Aqua', ko: 'Aqua', ja: 'Aqua' }, color: '#5ec8e5', rank: 5 },
  { id: 'green', name: { en: 'Green', ko: 'Green', ja: 'Green' }, color: '#00a95c', rank: 9 },
  { id: 'grey', name: { en: 'Light Grey', ko: 'Light Grey', ja: 'Light Grey' }, color: '#88898a', rank: 8 },
  { id: 'gold', name: { en: 'Metallic Gold', ko: 'Metallic Gold', ja: 'Metallic Gold' }, color: '#ac936e', rank: 7, extra: 1000 },
];

const inkById = (id: InkId) => INKS.find((ink) => ink.id === id) ?? INKS[0];

const DRUMS = {
  title: { en: 'Ink drums', ko: 'Ink drums', ja: 'Ink drums' },
  note: {
    en: 'Every ink is its own drum and its own pass through the machine. Use up to four in one job. Fluorescent Pink and Teal are in the machine today, so jobs in those two can start first.',
    ko: 'Every ink is its own drum and its own pass through the machine. Use up to four in one job. Fluorescent Pink and Teal are in the machine today, so jobs in those two can start first.',
    ja: 'Every ink is its own drum and its own pass through the machine. Use up to four in one job. Fluorescent Pink and Teal are in the machine today, so jobs in those two can start first.',
  },
  drum: { en: 'Drum {n} today', ko: 'Drum {n} today', ja: 'Drum {n} today' },
  out: { en: 'Back on 2 December', ko: 'Back on 2 December', ja: 'Back on 2 December' },
  extra: { en: '£10 extra a job', ko: '£10 extra a job', ja: '£10 extra a job' },
} satisfies Record<string, Tri>;

type PaperId = 'munken120' | 'munken300' | 'cyclus' | 'candy' | 'mist' | 'citrine' | 'kraft';

interface Paper {
  id: PaperId;
  name: string;
  // The name in the paper menu, short enough for a phone.
  short?: string;
  weight: string;
  colour: Tri;
  use: Tri;
  // Price of one sheet in pence.
  a4: number;
  a3: number;
  chip: string;
  cut?: 'thick' | 'fleck' | 'kraft';
}

const PAPERS: Paper[] = [
  {
    id: 'munken120',
    name: 'Munken Pure',
    weight: '120 g',
    colour: { en: 'Natural white', ko: 'Natural white', ja: 'Natural white' },
    use: { en: 'Zines, posters', ko: 'Zines, posters', ja: 'Zines, posters' },
    a4: 9,
    a3: 18,
    chip: '#f8f4e9',
  },
  {
    id: 'munken300',
    name: 'Munken Pure',
    weight: '300 g',
    colour: { en: 'Natural white', ko: 'Natural white', ja: 'Natural white' },
    use: { en: 'Covers, postcards', ko: 'Covers, postcards', ja: 'Covers, postcards' },
    a4: 22,
    a3: 44,
    chip: '#f8f4e9',
    cut: 'thick',
  },
  {
    id: 'cyclus',
    name: 'Cyclus Offset, recycled',
    short: 'Cyclus Offset',
    weight: '115 g',
    colour: { en: 'Grey white', ko: 'Grey white', ja: 'Grey white' },
    use: { en: 'Flyers, newsletters', ko: 'Flyers, newsletters', ja: 'Flyers, newsletters' },
    a4: 7,
    a3: 14,
    chip: '#e9e7df',
    cut: 'fleck',
  },
  {
    id: 'candy',
    name: 'Colorplan Candy Pink',
    weight: '270 g',
    colour: { en: 'Pale pink', ko: 'Pale pink', ja: 'Pale pink' },
    use: { en: 'Cards, invitations', ko: 'Cards, invitations', ja: 'Cards, invitations' },
    a4: 31,
    a3: 62,
    chip: '#f3c9d3',
    cut: 'thick',
  },
  {
    id: 'mist',
    name: 'Colorplan Mist',
    weight: '270 g',
    colour: { en: 'Pale grey green', ko: 'Pale grey green', ja: 'Pale grey green' },
    use: { en: 'Cards, covers', ko: 'Cards, covers', ja: 'Cards, covers' },
    a4: 31,
    a3: 62,
    chip: '#d2dbd5',
    cut: 'thick',
  },
  {
    id: 'citrine',
    name: 'Colorplan Citrine',
    weight: '135 g',
    colour: { en: 'Bright yellow', ko: 'Bright yellow', ja: 'Bright yellow' },
    use: { en: 'Posters, inserts', ko: 'Posters, inserts', ja: 'Posters, inserts' },
    a4: 19,
    a3: 38,
    chip: '#f1d64c',
  },
  {
    id: 'kraft',
    name: 'Brown kraft',
    weight: '140 g',
    colour: { en: 'Brown', ko: 'Brown', ja: 'Brown' },
    use: { en: 'Tags, wrapping', ko: 'Tags, wrapping', ja: 'Tags, wrapping' },
    a4: 12,
    a3: 24,
    chip: '#bb8f60',
    cut: 'kraft',
  },
];

const PAPER_COPY = {
  title: { en: 'Paper', ko: 'Paper', ja: 'Paper' },
  note: {
    en: 'All uncoated, because riso ink dries by soaking into the sheet. Prices are per sheet and go on top of the printing. You can bring your own paper from 80 to 300 g for a £10 handling charge.',
    ko: 'All uncoated, because riso ink dries by soaking into the sheet. Prices are per sheet and go on top of the printing. You can bring your own paper from 80 to 300 g for a £10 handling charge.',
    ja: 'All uncoated, because riso ink dries by soaking into the sheet. Prices are per sheet and go on top of the printing. You can bring your own paper from 80 to 300 g for a £10 handling charge.',
  },
  caption: { en: 'Paper stocks and their price per sheet', ko: 'Paper stocks and their price per sheet', ja: 'Paper stocks and their price per sheet' },
  paper: { en: 'Paper', ko: 'Paper', ja: 'Paper' },
  weight: { en: 'Weight', ko: 'Weight', ja: 'Weight' },
  colour: { en: 'Colour', ko: 'Colour', ja: 'Colour' },
  use: { en: 'Good for', ko: 'Good for', ja: 'Good for' },
  a4: { en: 'A4 sheet', ko: 'A4 sheet', ja: 'A4 sheet' },
  a3: { en: 'A3 sheet', ko: 'A3 sheet', ja: 'A3 sheet' },
} satisfies Record<string, Tri>;

type Size = 'A5' | 'A4' | 'A3';
const SIZES: Size[] = ['A5', 'A4', 'A3'];
type PaperChoice = PaperId | 'own';

const PRICE = {
  title: { en: 'Price a job', ko: 'Price a job', ja: 'Price a job' },
  note: {
    en: 'The price covers masters, ink, paper and trimming to size. Ink colour does not change it, apart from Metallic Gold. From 1,000 copies the printing rate drops.',
    ko: 'The price covers masters, ink, paper and trimming to size. Ink colour does not change it, apart from Metallic Gold. From 1,000 copies the printing rate drops.',
    ja: 'The price covers masters, ink, paper and trimming to size. Ink colour does not change it, apart from Metallic Gold. From 1,000 copies the printing rate drops.',
  },
  size: { en: 'Sheet size', ko: 'Sheet size', ja: 'Sheet size' },
  copies: { en: 'Copies', ko: 'Copies', ja: 'Copies' },
  fewer: { en: '− 50 copies', ko: '− 50 copies', ja: '− 50 copies' },
  more: { en: '+ 50 copies', ko: '+ 50 copies', ja: '+ 50 copies' },
  copiesNote: { en: '50 to 5,000. The buttons move in steps of 50.', ko: '50 to 5,000. The buttons move in steps of 50.', ja: '50 to 5,000. The buttons move in steps of 50.' },
  copiesMin: { en: 'The minimum is 50 copies, so the job is set to 50.', ko: 'The minimum is 50 copies, so the job is set to 50.', ja: 'The minimum is 50 copies, so the job is set to 50.' },
  copiesMax: { en: '5,000 is the most for one job. For more, email us.', ko: '5,000 is the most for one job. For more, email us.', ja: '5,000 is the most for one job. For more, email us.' },
  inks: { en: 'Inks', ko: 'Inks', ja: 'Inks' },
  inksNote: {
    en: 'Up to four. We print the lightest ink first, and the numbers show the order.',
    ko: 'Up to four. We print the lightest ink first, and the numbers show the order.',
    ja: 'Up to four. We print the lightest ink first, and the numbers show the order.',
  },
  printed: { en: 'printing order', ko: 'printing order', ja: 'printing order' },
  moreInks: { en: '{n} more inks', ko: '{n} more inks', ja: '{n} more inks' },
  fewerInks: { en: 'Fewer inks', ko: 'Fewer inks', ja: 'Fewer inks' },
  inksMax: {
    en: 'Four inks is the most for one job. Take one off to add {ink}.',
    ko: 'Four inks is the most for one job. Take one off to add {ink}.',
    ja: 'Four inks is the most for one job. Take one off to add {ink}.',
  },
  inksMin: { en: 'A job needs at least one ink.', ko: 'A job needs at least one ink.', ja: 'A job needs at least one ink.' },
  sides: { en: 'Printed on', ko: 'Printed on', ja: 'Printed on' },
  oneSide: { en: 'One side', ko: 'One side', ja: 'One side' },
  bothSides: { en: 'Both sides', ko: 'Both sides', ja: 'Both sides' },
  paper: { en: 'Paper', ko: 'Paper', ja: 'Paper' },
  own: { en: 'Your own paper', ko: 'Your own paper', ja: 'Your own paper' },
} satisfies Record<string, Tri>;

const RATES: Array<[Tri, Tri]> = [
  [
    { en: 'Masters', ko: 'Masters', ja: 'Masters' },
    { en: '£8.00 per ink, per side', ko: '£8.00 per ink, per side', ja: '£8.00 per ink, per side' },
  ],
  [
    { en: 'Printing', ko: 'Printing', ja: 'Printing' },
    { en: '5p per A4 sheet, 8p per A3 sheet, per ink', ko: '5p per A4 sheet, 8p per A3 sheet, per ink', ja: '5p per A4 sheet, 8p per A3 sheet, per ink' },
  ],
  [
    { en: 'From 1,000', ko: 'From 1,000', ja: 'From 1,000' },
    { en: '3p per A4 sheet, 5p per A3 sheet, per ink', ko: '3p per A4 sheet, 5p per A3 sheet, per ink', ja: '3p per A4 sheet, 5p per A3 sheet, per ink' },
  ],
  [
    { en: 'A5', ko: 'A5', ja: 'A5' },
    { en: 'printed two to an A4 sheet, then trimmed', ko: 'printed two to an A4 sheet, then trimmed', ja: 'printed two to an A4 sheet, then trimmed' },
  ],
  [
    { en: 'Paper', ko: 'Paper', ja: 'Paper' },
    { en: 'per sheet, from the list above', ko: 'per sheet, from the list above', ja: 'per sheet, from the list above' },
  ],
];

const INK_COUNT: Record<number, Tri> = {
  1: { en: 'one ink', ko: 'one ink', ja: 'one ink' },
  2: { en: 'two inks', ko: 'two inks', ja: 'two inks' },
  3: { en: 'three inks', ko: 'three inks', ja: 'three inks' },
  4: { en: 'four inks', ko: 'four inks', ja: 'four inks' },
};

const DOCKET = {
  title: { en: 'Your quote', ko: 'Your quote', ja: 'Your quote' },
  summary: { en: '{copies} copies, {size}, {inks}, {sides}, {paper}', ko: '{copies} copies, {size}, {inks}, {sides}, {paper}', ja: '{copies} copies, {size}, {inks}, {sides}, {paper}' },
  oneSide: { en: 'one side', ko: 'one side', ja: 'one side' },
  bothSides: { en: 'both sides', ko: 'both sides', ja: 'both sides' },
  ownPaper: { en: 'your own paper', ko: 'your own paper', ja: 'your own paper' },
  order: { en: 'Printing order', ko: 'Printing order', ja: 'Printing order' },
  masters: { en: 'Masters', ko: 'Masters', ja: 'Masters' },
  master: { en: '1 master at £8.00', ko: '1 master at £8.00', ja: '1 master at £8.00' },
  mastersN: { en: '{n} masters at £8.00', ko: '{n} masters at £8.00', ja: '{n} masters at £8.00' },
  printing: { en: 'Printing', ko: 'Printing', ja: 'Printing' },
  passes: { en: '{n} passes at {rate}p', ko: '{n} passes at {rate}p', ja: '{n} passes at {rate}p' },
  paper: { en: 'Paper', ko: 'Paper', ja: 'Paper' },
  sheets: { en: '{n} {size} sheets at {price}p', ko: '{n} {size} sheets at {price}p', ja: '{n} {size} sheets at {price}p' },
  handling: { en: 'Handling your own paper', ko: 'Handling your own paper', ja: 'Handling your own paper' },
  gold: { en: 'Metallic Gold', ko: 'Metallic Gold', ja: 'Metallic Gold' },
  goldNote: { en: 'extra for the job', ko: 'extra for the job', ja: 'extra for the job' },
  trim: { en: 'Trimming and packing', ko: 'Trimming and packing', ja: 'Trimming and packing' },
  free: { en: 'Free', ko: 'Free', ja: 'Free' },
  subtotal: { en: 'Subtotal', ko: 'Subtotal', ja: 'Subtotal' },
  vat: { en: 'VAT at 20%', ko: 'VAT at 20%', ja: 'VAT at 20%' },
  total: { en: 'Total', ko: 'Total', ja: 'Total' },
  eachPence: { en: 'About {n}p a copy.', ko: 'About {n}p a copy.', ja: 'About {n}p a copy.' },
  eachPounds: { en: 'About {n} a copy.', ko: 'About {n} a copy.', ja: 'About {n} a copy.' },
  ready: {
    en: 'Ready {day} if your files reach us by 12:00 on Monday 23 November.',
    ko: 'Ready {day} if your files reach us by 12:00 on Monday 23 November.',
    ja: 'Ready {day} if your files reach us by 12:00 on Monday 23 November.',
  },
  cta: { en: 'Order this job', ko: 'Order this job', ja: 'Order this job' },
  live: { en: 'Quote updated: {total} for {copies} copies.', ko: 'Quote updated: {total} for {copies} copies.', ja: 'Quote updated: {total} for {copies} copies.' },
} satisfies Record<string, Tri>;

// Two passes a sheet (two inks, or one ink on both sides) take the three days. Every two
// passes more add a day, and the studio prints on Saturdays.
const READY_DAYS: Tri[] = [
  { en: 'Thursday 26 November', ko: 'Thursday 26 November', ja: 'Thursday 26 November' },
  { en: 'Friday 27 November', ko: 'Friday 27 November', ja: 'Friday 27 November' },
  { en: 'Saturday 28 November', ko: 'Saturday 28 November', ja: 'Saturday 28 November' },
  { en: 'Tuesday 1 December', ko: 'Tuesday 1 December', ja: 'Tuesday 1 December' },
];

const STEPS: Array<{ title: Tri; body: Tri; files?: string[] }> = [
  {
    title: { en: 'One file per ink', ko: 'One file per ink', ja: 'One file per ink' },
    body: {
      en: 'Put everything that prints in pink on one page and everything in teal on another. Name them after the ink:',
      ko: 'Put everything that prints in pink on one page and everything in teal on another. Name them after the ink:',
      ja: 'Put everything that prints in pink on one page and everything in teal on another. Name them after the ink:',
    },
    files: ['poster_pink.pdf', 'poster_teal.pdf'],
  },
  {
    title: { en: 'Black and grey only', ko: 'Black and grey only', ja: 'Black and grey only' },
    body: {
      en: '100% black prints the ink at full strength, and 40% grey prints a 40% tint of it. Convert photos to greyscale before you place them.',
      ko: '100% black prints the ink at full strength, and 40% grey prints a 40% tint of it. Convert photos to greyscale before you place them.',
      ja: '100% black prints the ink at full strength, and 40% grey prints a 40% tint of it. Convert photos to greyscale before you place them.',
    },
  },
  {
    title: { en: 'Keep 5 mm clear at every edge', ko: 'Keep 5 mm clear at every edge', ja: 'Keep 5 mm clear at every edge' },
    body: {
      en: 'The drum cannot print to the edge of the sheet. For prints that run off the edge, add 3 mm bleed: we print on the next size up and trim, priced as the larger sheet.',
      ko: 'The drum cannot print to the edge of the sheet. For prints that run off the edge, add 3 mm bleed: we print on the next size up and trim, priced as the larger sheet.',
      ja: 'The drum cannot print to the edge of the sheet. For prints that run off the edge, add 3 mm bleed: we print on the next size up and trim, priced as the larger sheet.',
    },
  },
  {
    title: { en: 'Large solids at 85%', ko: 'Large solids at 85%', ja: 'Large solids at 85%' },
    body: {
      en: 'Big areas of full ink pick up roller marks and can rub onto the next sheet. Set them to 85% grey and they print evenly.',
      ko: 'Big areas of full ink pick up roller marks and can rub onto the next sheet. Set them to 85% grey and they print evenly.',
      ja: 'Big areas of full ink pick up roller marks and can rub onto the next sheet. Set them to 85% grey and they print evenly.',
    },
  },
  {
    title: { en: 'Export a flat PDF', ko: 'Export a flat PDF', ja: 'Export a flat PDF' },
    body: {
      en: 'At the final size, fonts embedded, images at 600 dpi. Leave crop marks off; we add our own.',
      ko: 'At the final size, fonts embedded, images at 600 dpi. Leave crop marks off; we add our own.',
      ja: 'At the final size, fonts embedded, images at 600 dpi. Leave crop marks off; we add our own.',
    },
  },
  {
    title: { en: 'Approve the proof', ko: 'Approve the proof', ja: 'Approve the proof' },
    body: {
      en: 'Within one working day we email a photo of the first sheet off each drum. Printing starts when you reply OK.',
      ko: 'Within one working day we email a photo of the first sheet off each drum. Printing starts when you reply OK.',
      ja: 'Within one working day we email a photo of the first sheet off each drum. Printing starts when you reply OK.',
    },
  },
];

const FILES = {
  title: { en: 'Preparing your files', ko: 'Preparing your files', ja: 'Preparing your files' },
  note: {
    en: 'Send a PDF for each ink. We check every file before printing and tell you the same day if something needs changing.',
    ko: 'Send a PDF for each ink. We check every file before printing and tell you the same day if something needs changing.',
    ja: 'Send a PDF for each ink. We check every file before printing and tell you the same day if something needs changing.',
  },
  proof: { en: 'Example: two ink files and the print they make', ko: 'Example: two ink files and the print they make', ja: 'Example: two ink files and the print they make' },
  both: { en: 'The print, both inks', ko: 'The print, both inks', ja: 'The print, both inks' },
} satisfies Record<string, Tri>;

const ORDER = {
  title: { en: 'Start an order', ko: 'Start an order', ja: 'Start an order' },
  note: {
    en: 'Send your name, an email and a link to the files. We check them the same day and email a photo of the proof. Nothing is printed or charged until you reply OK.',
    ko: 'Send your name, an email and a link to the files. We check them the same day and email a photo of the proof. Nothing is printed or charged until you reply OK.',
    ja: 'Send your name, an email and a link to the files. We check them the same day and email a photo of the proof. Nothing is printed or charged until you reply OK.',
  },
  job: { en: 'The job', ko: 'The job', ja: 'The job' },
  quote: { en: 'Quote', ko: 'Quote', ja: 'Quote' },
  ready: { en: 'Ready', ko: 'Ready', ja: 'Ready' },
  change: { en: 'Change the job', ko: 'Change the job', ja: 'Change the job' },
  name: { en: 'Your name', ko: 'Your name', ja: 'Your name' },
  email: { en: 'Email', ko: 'Email', ja: 'Email' },
  link: { en: 'Link to your files', ko: 'Link to your files', ja: 'Link to your files' },
  linkHint: {
    en: 'A WeTransfer, Dropbox or Google Drive link to one PDF per ink.',
    ko: 'A WeTransfer, Dropbox or Google Drive link to one PDF per ink.',
    ja: 'A WeTransfer, Dropbox or Google Drive link to one PDF per ink.',
  },
  nameError: { en: 'Write the name for the order.', ko: 'Write the name for the order.', ja: 'Write the name for the order.' },
  emailError: {
    en: 'Check the email address. It needs an @ and a domain.',
    ko: 'Check the email address. It needs an @ and a domain.',
    ja: 'Check the email address. It needs an @ and a domain.',
  },
  linkError: {
    en: 'Paste the full link to your files, starting with https://.',
    ko: 'Paste the full link to your files, starting with https://.',
    ja: 'Paste the full link to your files, starting with https://.',
  },
  send: { en: 'Send the order, {total}', ko: 'Send the order, {total}', ja: 'Send the order, {total}' },
  pay: { en: 'You pay when you approve the proof.', ko: 'You pay when you approve the proof.', ja: 'You pay when you approve the proof.' },
  doneTitle: { en: 'Order {quote} is in', ko: 'Order {quote} is in', ja: 'Order {quote} is in' },
  doneJob: { en: 'Quote {quote}: {summary}, {total}.', ko: 'Quote {quote}: {summary}, {total}.', ja: 'Quote {quote}: {summary}, {total}.' },
  doneBody: {
    en: 'We check the files at {link} and email a proof photo to {email} by 17:00 on Monday 23 November. Nothing prints until you reply OK.',
    ko: 'We check the files at {link} and email a proof photo to {email} by 17:00 on Monday 23 November. Nothing prints until you reply OK.',
    ja: 'We check the files at {link} and email a proof photo to {email} by 17:00 on Monday 23 November. Nothing prints until you reply OK.',
  },
  again: { en: 'Start another order', ko: 'Start another order', ja: 'Start another order' },
} satisfies Record<string, Tri>;

const WEEK = {
  title: { en: 'Turnaround and pickup', ko: 'Turnaround and pickup', ja: 'Turnaround and pickup' },
  note: {
    en: 'Three working days from the day your files arrive, for two passes a sheet. Every two passes more add a day. Rush jobs up to 300 copies can be ready the next working day for 50% more, when a drum is free.',
    ko: 'Three working days from the day your files arrive, for two passes a sheet. Every two passes more add a day. Rush jobs up to 300 copies can be ready the next working day for 50% more, when a drum is free.',
    ja: 'Three working days from the day your files arrive, for two passes a sheet. Every two passes more add a day. Rush jobs up to 300 copies can be ready the next working day for 50% more, when a drum is free.',
  },
  week: { en: 'A two-ink job, files in on Monday', ko: 'A two-ink job, files in on Monday', ja: 'A two-ink job, files in on Monday' },
  collect: { en: 'Collect from the arch', ko: 'Collect from the arch', ja: 'Collect from the arch' },
  collectBody: {
    en: "Tuesday to Saturday, 10:00 to 18:00. Five minutes' walk from Bermondsey station. Ring the bell beside the shutter.",
    ko: "Tuesday to Saturday, 10:00 to 18:00. Five minutes' walk from Bermondsey station. Ring the bell beside the shutter.",
    ja: "Tuesday to Saturday, 10:00 to 18:00. Five minutes' walk from Bermondsey station. Ring the bell beside the shutter.",
  },
  options: { en: 'Ways to get your prints', ko: 'Ways to get your prints', ja: 'Ways to get your prints' },
} satisfies Record<string, Tri>;

const DAYS: Array<{ day: Tri; date: Tri; body: Tri; done: number }> = [
  {
    day: { en: 'Monday', ko: 'Monday', ja: 'Monday' },
    date: { en: '23 November', ko: '23 November', ja: '23 November' },
    body: { en: 'Files in by 12:00. We check them and email a proof photo by 17:00.', ko: 'Files in by 12:00. We check them and email a proof photo by 17:00.', ja: 'Files in by 12:00. We check them and email a proof photo by 17:00.' },
    done: 25,
  },
  {
    day: { en: 'Tuesday', ko: 'Tuesday', ja: 'Tuesday' },
    date: { en: '24 November', ko: '24 November', ja: '24 November' },
    body: { en: 'Masters made and the first ink printed. The sheets dry overnight.', ko: 'Masters made and the first ink printed. The sheets dry overnight.', ja: 'Masters made and the first ink printed. The sheets dry overnight.' },
    done: 50,
  },
  {
    day: { en: 'Wednesday', ko: 'Wednesday', ja: 'Wednesday' },
    date: { en: '25 November', ko: '25 November', ja: '25 November' },
    body: { en: 'The second ink, or the back of the sheet, goes onto the dry stack.', ko: 'The second ink, or the back of the sheet, goes onto the dry stack.', ja: 'The second ink, or the back of the sheet, goes onto the dry stack.' },
    done: 75,
  },
  {
    day: { en: 'Thursday', ko: 'Thursday', ja: 'Thursday' },
    date: { en: '26 November, from 14:00', ko: '26 November, from 14:00', ja: '26 November, from 14:00' },
    body: { en: 'Trimmed, counted and packed. Ready to collect or to send.', ko: 'Trimmed, counted and packed. Ready to collect or to send.', ja: 'Trimmed, counted and packed. Ready to collect or to send.' },
    done: 100,
  },
];

const OPTIONS: Array<{ name: Tri; note?: Tri; price: Tri }> = [
  {
    name: { en: 'Collect from the arch', ko: 'Collect from the arch', ja: 'Collect from the arch' },
    price: { en: 'Free', ko: 'Free', ja: 'Free' },
  },
  {
    name: { en: 'Bike courier in London', ko: 'Bike courier in London', ja: 'Bike courier in London' },
    note: { en: 'Same day, booked by 15:00', ko: 'Same day, booked by 15:00', ja: 'Same day, booked by 15:00' },
    price: { en: '£14.00', ko: '£14.00', ja: '£14.00' },
  },
  {
    name: { en: 'Courier, UK mainland', ko: 'Courier, UK mainland', ja: 'Courier, UK mainland' },
    note: { en: 'Next working day, up to 10 kg', ko: 'Next working day, up to 10 kg', ja: 'Next working day, up to 10 kg' },
    price: { en: '£9.50', ko: '£9.50', ja: '£9.50' },
  },
  {
    name: { en: 'Rush job', ko: 'Rush job', ja: 'Rush job' },
    note: { en: 'Ready next working day, up to 300 copies', ko: 'Ready next working day, up to 300 copies', ja: 'Ready next working day, up to 300 copies' },
    price: { en: '+50%', ko: '+50%', ja: '+50%' },
  },
];

const FOOT = {
  made: { en: 'Printed in Bermondsey on two Riso MZ machines', ko: 'Printed in Bermondsey on two Riso MZ machines', ja: 'Printed in Bermondsey on two Riso MZ machines' },
} satisfies Record<string, Tri>;

const PROMPT_EN = `Design one real page in Risograph Print style: spot inks on uncoated paper, printed one drum at a time, a little off register.

Pick a believable subject that lives in print, such as a riso studio, a zine library, a small-press publisher or a screen-print workshop, and write its real content. The page must read as that subject's page, never as a page about its own style.

COLOR TOKENS:
--paper: #f5f0e8 (the page, under a fine paper grain)
--slip: #fdfaf4 (the quote docket, fields)
--ink: #2c3e50 (text, rules, buttons)
--muted: #55606d
--line: rgba(44, 62, 80, 0.36)
Spot inks, used only as ink:
--pink: #ff48b0 (Fluorescent Pink)
--teal: #00838a
--yellow: #ffe800
The ink drum list adds the rest of the studio's inks, each once: #24242a black, #ffb511, #ff7477, #f15060, #914e72, #765ba7, #3d5588, #5ec8e5, #00a95c, #88898a, #ac936e. Paper chips are the colours of their sheets, with brown flecks or fibre on the recycled and kraft stock. Separation files are drawn in near-black and grey on white. The ink at low opacity draws chip and plate edges and the flat offset shadows. No other colours: text is ink or muted, slip on a filled button; hovers move a button into its pink shadow, underline a toggle or darken an outline; errors are ink text beside a pink square and a pink offset under the field.

THE PRINT:
- Solid ink carries a speckle: an SVG feTurbulence mask knocks small holes out of every solid. Tints are screened: two offset radial-gradient dot grids at 45 degrees, the dot radius sets the tint (100, 70, 45, 25, 10%).
- Overprint: the studio name is set twice, teal underneath and pink on top with mix-blend-mode: multiply, the pink shifted 5px left and 3px up (3px and 2px on phones). Where the two inks cross they darken. The quote total is printed the same way.
- The hero is the studio's own house sheet: a 2px ink trim, crop marks in the margin, registration targets at mid height, and three shapes in three inks behind the type (a screened pink circle, a solid teal disc, a solid yellow band), all multiplied.
- Buttons are ink with a 4px pink offset shadow, like a second colour printed off register.

TYPOGRAPHY:
Display: Young Serif 400, its one weight, for the studio name, headings, the claim, ink and paper names, field labels, step numbers, days and the total.
- Studio name clamp(4.1rem, 14.6vw, 11.6rem), line-height 0.88, tracking -0.035em; 22vw on phones
- h2 clamp(2.25rem, 4.6vw, 3.75rem), line-height 1, tracking -0.025em
- Claim clamp(1.6rem, 2.7vw, 2.2rem), line-height 1.12; h3 1.5rem; names and field labels 1.1875rem; total clamp(2.25rem, 5vw, 3.9rem)
Text: Anonymous Pro 400 and 700, 1.125rem, line-height 1.55, for everything you read, type or check: prices, counts, sizes, file names, notes at 1rem. Tabular figures. No text under 16px. font-synthesis: none.

LAYOUT:
- Studio bar: the name with two overprinted circles, five section links, a "Start an order" button. Links hide under 960px.
- Hero: the house sheet on a 12-column grid. The name across the top, the claim and one paragraph under it on the left, a ruled facts list on the right; a one-line slug under the trim says what the sheet was printed in.
- Ink drums: a ruled two-column list (one column under 960px), each ink as a five-step tint ramp, its name and its state ("Drum 1 today" in an ink box, back-in-stock date, surcharge).
- Paper: a ruled table with a cut chip of each sheet (thicker stock shows its edge, recycled shows flecks, kraft shows fibre). Under 761px each row stacks with its labels.
- Price a job: the form on the left (7 columns), the quote docket on the right (5 columns) with a dashed tear-off line above the total. Under 960px the docket follows the form.
- Files: a numbered checklist beside a separation proof (two black-and-grey files and the two-ink print they make).
- Start an order: the current job beside a short form.
- Turnaround: the production week in four columns, each with a bar filling in pink; the pickup address beside a ruled delivery table.
- Max width 1120px, sections about 128px apart (96px on phones), square corners everywhere, 2px ink rules over lists, 1px lines between rows.

COMPONENTS:
- Segmented toggles (sheet size, sides): a 2px ink frame, 2px ink dividers, the chosen one filled ink.
- Copies stepper: one 2px ink frame holding −, a typed number field and +. The buttons move in steps of 50 between 50 and 5,000; a typed value outside that range is set back to the nearest limit with a note.
- Ink picker: toggle buttons with a speckled chip of the ink and a 1px outline of the ink at 60%; chosen ones get a 2px ink frame and a numbered ink square for their printing order (lightest ink first); out-of-stock inks are disabled and say when they are back; a fifth ink is refused with a note.
- Paper: a native select in a 2px ink frame.
- Quote docket: slip paper, 2px ink frame, a 6px ink shadow at 14%, the inks overprinted as circles in the corner, line items in a ruled list, the total overprinted.
- Form: visible labels, square 2px fields, errors next to the field, a confirmation with the quote number that takes the form's place.

MOTION:
- None. A button moves 2px into its shadow on hover, without a transition.

FORBIDDEN:
- Cards, pills, rounded corners, soft drop shadows, gradients used as colour
- A small label above a heading, all-caps tracked labels
- Palette swatches with hex codes, type specimen or principles sections
- Pink or teal reading text (only the overprinted name and total are set in the spot inks)
- Figurative illustration, halftone photos of people, emoji
- A page about its own style

OUTPUT:
1) CSS custom properties for the tokens, the speckle mask and the dot screen
2) Semantic HTML and CSS
3) Responsive layout down to 320px with no horizontal scroll
4) Working controls: a live price calculator (size, copies, up to four inks, sides, paper) with its line items, and a validated order form that confirms with a quote number; visible focus`;

const PROMPTS: Record<Lang, string> = {
  en: PROMPT_EN,
  ko: PROMPT_EN,
  ja: PROMPT_EN,
};

// The ink picker shows these until the visitor asks for the whole shelf.
const PICK_FIRST: InkId[] = ['pink', 'teal', 'yellow', 'black'];

interface Job {
  size: Size;
  copies: number;
  inks: InkId[];
  sides: 1 | 2;
  paper: PaperChoice;
}

function quoteFor(job: Job) {
  const big = job.size === 'A3';
  const sheetSize = big ? 'A3' : 'A4';
  // A5 prints two to an A4 sheet.
  const sheets = job.size === 'A5' ? Math.ceil(job.copies / 2) : job.copies;
  const rate = job.copies >= 1000 ? (big ? 5 : 3) : big ? 8 : 5;
  const masterCount = job.inks.length * job.sides;
  const passes = sheets * masterCount;
  const paper = job.paper === 'own' ? null : PAPERS.find((entry) => entry.id === job.paper) ?? PAPERS[0];
  const sheetPrice = paper ? (big ? paper.a3 : paper.a4) : 0;
  const masters = masterCount * 800;
  const printing = passes * rate;
  const paperCost = sheets * sheetPrice;
  const handling = paper ? 0 : 1000;
  const extras = job.inks.reduce((sum, id) => sum + (inkById(id).extra ?? 0), 0);
  const subtotal = masters + printing + paperCost + handling + extras;
  const vat = Math.round(subtotal * 0.2);
  const total = subtotal + vat;
  const readyIndex = Math.min(READY_DAYS.length - 1, Math.ceil(masterCount / 2) - 1);
  return { sheetSize, sheets, rate, masterCount, passes, paper, sheetPrice, masters, printing, paperCost, handling, extras, subtotal, vat, total, readyIndex };
}

export function PortedRisographPrintPage({ lang }: PortedStylePageProps) {
  const [size, setSize] = useState<Size>('A3');
  const [copies, setCopies] = useState(200);
  const [copiesText, setCopiesText] = useState('200');
  const [copiesFlag, setCopiesFlag] = useState('');
  const [inks, setInks] = useState<InkId[]>(['pink', 'teal']);
  const [allInks, setAllInks] = useState(false);
  const [keptInks, setKeptInks] = useState<InkId[]>([]);
  const [inkFlag, setInkFlag] = useState('');
  const [sides, setSides] = useState<1 | 2>(1);
  const [paper, setPaper] = useState<PaperChoice>('munken120');
  const [live, setLive] = useState('');
  const [guest, setGuest] = useState({ name: '', email: '', link: '' });
  const [errors, setErrors] = useState({ name: false, email: false, link: false });
  const [orders, setOrders] = useState(0);
  const [placed, setPlaced] = useState<{ quote: string; summary: string; total: string; email: string; link: string } | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const wasPlaced = useRef(false);
  const lastQuote = useRef(`${copies}:${size}:${inks.join()}:${sides}:${paper}`);
  const t = (text: Tri) => text[lang];

  const job: Job = { size, copies, inks, sides, paper };
  const quote = quoteFor(job);
  const printOrder = INKS.filter((ink) => inks.includes(ink.id)).sort((a, b) => a.rank - b.rank);
  const paperLabel = quote.paper ? `${quote.paper.name} ${quote.paper.weight}` : t(DOCKET.ownPaper);
  const summary = fill(t(DOCKET.summary), {
    copies: count.format(copies),
    size,
    inks: t(INK_COUNT[inks.length]),
    sides: t(sides === 1 ? DOCKET.oneSide : DOCKET.bothSides),
    paper: paperLabel,
  });
  const total = pounds(quote.total);
  const each = quote.total / copies;
  const perCopy = each < 100 ? fill(t(DOCKET.eachPence), { n: Math.max(1, Math.round(each)) }) : fill(t(DOCKET.eachPounds), { n: pounds(Math.round(each)) });
  const readyDay = t(READY_DAYS[quote.readyIndex]);
  const quoteKey = `${copies}:${size}:${inks.join()}:${sides}:${paper}`;
  const liveText = fill(t(DOCKET.live), { total, copies: count.format(copies) });

  // The quote is read out once the visitor stops changing the job, not on every keystroke.
  useEffect(() => {
    if (quoteKey === lastQuote.current) return;
    lastQuote.current = quoteKey;
    const timer = window.setTimeout(() => setLive(liveText), 700);
    return () => window.clearTimeout(timer);
  }, [quoteKey, liveText]);

  // The form and the confirmation replace each other, so focus goes to what took its place.
  useEffect(() => {
    if (placed) doneRef.current?.focus();
    else if (wasPlaced.current) nameRef.current?.focus();
    wasPlaced.current = placed !== null;
  }, [placed]);

  const commitCopies = (value: number) => {
    setCopies(value);
    setCopiesText(String(value));
  };

  const stepCopies = (direction: 1 | -1) => {
    const next = direction > 0 ? Math.floor(copies / COPY_STEP) * COPY_STEP + COPY_STEP : Math.ceil(copies / COPY_STEP) * COPY_STEP - COPY_STEP;
    if (next < MIN_COPIES) {
      setCopiesFlag(t(PRICE.copiesMin));
      commitCopies(MIN_COPIES);
      return;
    }
    if (next > MAX_COPIES) {
      setCopiesFlag(t(PRICE.copiesMax));
      commitCopies(MAX_COPIES);
      return;
    }
    setCopiesFlag('');
    commitCopies(next);
  };

  const typeCopies = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 5);
    setCopiesText(digits);
    const value = Number(digits);
    if (digits !== '' && value >= MIN_COPIES && value <= MAX_COPIES) {
      setCopies(value);
      setCopiesFlag('');
    }
  };

  // A typed number outside the range is set back to the nearest limit when the field is left.
  const settleCopies = () => {
    const value = Number(copiesText);
    if (copiesText === '') {
      setCopiesText(String(copies));
    } else if (value < MIN_COPIES) {
      setCopiesFlag(t(PRICE.copiesMin));
      commitCopies(MIN_COPIES);
    } else if (value > MAX_COPIES) {
      setCopiesFlag(t(PRICE.copiesMax));
      commitCopies(MAX_COPIES);
    } else {
      commitCopies(value);
    }
  };

  const toggleInk = (ink: Ink) => {
    if (ink.out) return;
    if (inks.includes(ink.id)) {
      if (inks.length === 1) {
        setInkFlag(t(PRICE.inksMin));
        return;
      }
      setInks(inks.filter((id) => id !== ink.id));
      setInkFlag('');
      return;
    }
    if (inks.length >= MAX_INKS) {
      setInkFlag(fill(t(PRICE.inksMax), { ink: t(ink.name) }));
      return;
    }
    setInks([...inks, ink.id]);
    setInkFlag('');
  };

  // Folding the shelf away keeps every ink that is chosen in view, so none of them vanish.
  const toggleShelf = () => {
    if (allInks) setKeptInks(inks.filter((id) => !PICK_FIRST.includes(id)));
    setAllInks(!allInks);
  };

  const shownInks = allInks ? INKS : INKS.filter((ink) => PICK_FIRST.includes(ink.id) || keptInks.includes(ink.id));
  const hiddenCount = INKS.length - shownInks.length;

  const handleOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const link = guest.link.trim();
    const linkOk = URL.canParse(link) && /^https?:$/.test(new URL(link).protocol) && new URL(link).hostname.includes('.');
    const next = { name: guest.name.trim() === '', email: !EMAIL_PATTERN.test(guest.email.trim()), link: !linkOk };
    setErrors(next);
    if (next.name || next.email || next.link) {
      (next.name ? nameRef : next.email ? emailRef : linkRef).current?.focus();
      return;
    }
    setPlaced({ quote: `DP-${FIRST_QUOTE + orders}`, summary, total, email: guest.email.trim(), link });
    setOrders(orders + 1);
  };

  const orderAgain = () => {
    setGuest({ name: '', email: '', link: '' });
    setErrors({ name: false, email: false, link: false });
    setPlaced(null);
  };

  const field = (key: 'name' | 'email' | 'link', value: string) => {
    setGuest({ ...guest, [key]: value });
    if (errors[key]) setErrors({ ...errors, [key]: false });
  };

  return (
    <FusionShell
      fusionId="risograph-print"
      lang={lang}
      tone="light"
      accent="#2c3e50"
      prev={{ href: '/pages/y2k-retro.html', label: 'Windows 98' }}
      next={{ href: '/pages/paper-cut.html', label: 'Paper Cut / Layered' }}
      prompts={PROMPTS}
    >
      <div className="dp">
        <header className="dp-top">
          <p className="dp-mark"><i aria-hidden="true" />{NAME}</p>
          <nav className="dp-top__nav" aria-label={t(TOP.nav)}>
            <a href="#dp-inks">{t(TOP.inks)}</a>
            <a href="#dp-paper">{t(TOP.paper)}</a>
            <a href="#dp-price">{t(TOP.prices)}</a>
            <a href="#dp-files">{t(TOP.files)}</a>
            <a href="#dp-pickup">{t(TOP.pickup)}</a>
          </nav>
          <a className="dp-btn dp-btn--sm" href="#dp-order">{t(TOP.order)}</a>
        </header>

        <section className="dp-hero" aria-labelledby="dp-title">
          <div className="dp-trim">
            <span className="dp-crop dp-crop--tl" aria-hidden="true" />
            <span className="dp-crop dp-crop--tr" aria-hidden="true" />
            <span className="dp-crop dp-crop--bl" aria-hidden="true" />
            <span className="dp-crop dp-crop--br" aria-hidden="true" />
            <span className="dp-reg dp-reg--l" aria-hidden="true" />
            <span className="dp-reg dp-reg--r" aria-hidden="true" />
            <div className="dp-sheet">
              <div className="dp-art" aria-hidden="true">
                <i className="dp-dot dp-ht" />
                <i className="dp-disc dp-solid" />
                <i className="dp-band dp-solid" />
              </div>
              <h1 className="dp-op" id="dp-title">
                <span><span className="dp-line">Duplo</span> <span className="dp-line">Press</span></span>
                <span aria-hidden="true"><span className="dp-line">Duplo</span> <span className="dp-line">Press</span></span>
              </h1>
              <div className="dp-hero__copy">
                <p className="dp-claim">{t(HERO.claim)}</p>
                <p className="dp-hero__body">{t(HERO.body)}</p>
                <a className="dp-btn" href="#dp-price">{t(HERO.cta)}</a>
              </div>
              <dl className="dp-facts">
                {FACTS.map(([term, value]) => (
                  <div key={term.en}><dt>{t(term)}</dt><dd>{t(value)}</dd></div>
                ))}
              </dl>
            </div>
          </div>
          <p className="dp-slug">{t(HERO.slug)}</p>
        </section>

        <section className="dp-sec" id="dp-inks" aria-labelledby="dp-inks-title">
          <div className="dp-head">
            <h2 id="dp-inks-title">{t(DRUMS.title)}</h2>
            <p>{t(DRUMS.note)}</p>
          </div>
          <ul className="dp-inks">
            {INKS.map((ink) => (
              <li key={ink.id} className={ink.out ? 'is-out' : undefined} style={{ '--dp-c': ink.color } as Vars}>
                <span className="dp-ramp" aria-hidden="true">
                  <i className="dp-solid" /><i className="dp-ht" /><i className="dp-ht" /><i className="dp-ht" /><i className="dp-ht" />
                </span>
                <b>{t(ink.name)}</b>
                {ink.drum ? (
                  <span className="dp-state dp-state--on">{fill(t(DRUMS.drum), { n: ink.drum })}</span>
                ) : ink.out ? (
                  <span className="dp-state">{t(DRUMS.out)}</span>
                ) : ink.extra ? (
                  <span className="dp-state">{t(DRUMS.extra)}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <section className="dp-sec" id="dp-paper" aria-labelledby="dp-paper-title">
          <div className="dp-head">
            <h2 id="dp-paper-title">{t(PAPER_COPY.title)}</h2>
            <p>{t(PAPER_COPY.note)}</p>
          </div>
          {/* Under 761px the rows stack, so the table roles are spelled out for screen readers. */}
          <table className="dp-papers" role="table">
            <caption className="dp-vh">{t(PAPER_COPY.caption)}</caption>
            <thead role="rowgroup">
              <tr role="row">
                <th role="columnheader" scope="col">{t(PAPER_COPY.paper)}</th>
                <th role="columnheader" scope="col">{t(PAPER_COPY.weight)}</th>
                <th role="columnheader" scope="col">{t(PAPER_COPY.colour)}</th>
                <th role="columnheader" scope="col">{t(PAPER_COPY.use)}</th>
                <th role="columnheader" scope="col" className="dp-num">{t(PAPER_COPY.a4)}</th>
                <th role="columnheader" scope="col" className="dp-num">{t(PAPER_COPY.a3)}</th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {PAPERS.map((entry) => (
                <tr key={entry.id} role="row">
                  <td role="cell" className="dp-papers__name">
                    <span className="dp-pname">
                      <i className={`dp-chip${entry.cut ? ` dp-chip--${entry.cut}` : ''}`} style={{ '--dp-pc': entry.chip } as Vars} aria-hidden="true" />
                      <b>{entry.name}</b>
                    </span>
                  </td>
                  <td role="cell" className="dp-papers__wt" data-label={t(PAPER_COPY.weight)}>{entry.weight}</td>
                  <td role="cell" className="dp-papers__clr" data-label={t(PAPER_COPY.colour)}>{t(entry.colour)}</td>
                  <td role="cell" className="dp-papers__use" data-label={t(PAPER_COPY.use)}>{t(entry.use)}</td>
                  <td role="cell" className="dp-num" data-label="A4">{pounds(entry.a4)}</td>
                  <td role="cell" className="dp-num" data-label="A3">{pounds(entry.a3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="dp-sec" id="dp-price" aria-labelledby="dp-price-title">
          <div className="dp-head">
            <h2 id="dp-price-title">{t(PRICE.title)}</h2>
            <p>{t(PRICE.note)}</p>
          </div>
          <div className="dp-calc">
            {/* Enter in the copies field settles the number; the form sends nothing. */}
            <form
              className="dp-form"
              noValidate
              onSubmit={(event) => {
                event.preventDefault();
                settleCopies();
              }}
            >
              <div className="dp-field" role="group" aria-labelledby="dp-size-label">
                <span className="dp-lab" id="dp-size-label">{t(PRICE.size)}</span>
                <div className="dp-seg">
                  {SIZES.map((entry) => (
                    <button key={entry} type="button" aria-pressed={size === entry} onClick={() => setSize(entry)}>{entry}</button>
                  ))}
                </div>
              </div>

              <div className="dp-field">
                <label className="dp-lab" htmlFor="dp-copies">{t(PRICE.copies)}</label>
                <div className="dp-step">
                  <button
                    type="button"
                    aria-label={t(PRICE.fewer)}
                    aria-disabled={copies <= MIN_COPIES}
                    aria-controls="dp-copies"
                    onClick={() => stepCopies(-1)}
                  >
                    <span aria-hidden="true">−</span>
                  </button>
                  <input
                    id="dp-copies"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    value={copiesText}
                    aria-describedby="dp-copies-note"
                    onChange={(event) => typeCopies(event.target.value)}
                    onBlur={settleCopies}
                  />
                  <button
                    type="button"
                    aria-label={t(PRICE.more)}
                    aria-disabled={copies >= MAX_COPIES}
                    aria-controls="dp-copies"
                    onClick={() => stepCopies(1)}
                  >
                    <span aria-hidden="true">+</span>
                  </button>
                </div>
                <p className="dp-note" id="dp-copies-note">{t(PRICE.copiesNote)}</p>
                <p className="dp-flag" role="status">{copiesFlag}</p>
              </div>

              <div className="dp-field" role="group" aria-labelledby="dp-inks-label">
                <span className="dp-lab" id="dp-inks-label">{t(PRICE.inks)}</span>
                <div className="dp-pick" id="dp-pick">
                  {shownInks.map((ink) => {
                    const at = printOrder.findIndex((entry) => entry.id === ink.id);
                    const chosen = at >= 0;
                    const full = !chosen && !ink.out && inks.length >= MAX_INKS;
                    return (
                      <button
                        key={ink.id}
                        type="button"
                        className={ink.out ? 'is-out' : undefined}
                        aria-pressed={chosen}
                        aria-disabled={full || undefined}
                        disabled={ink.out}
                        onClick={() => toggleInk(ink)}
                      >
                        <i className="dp-solid" style={{ '--dp-c': ink.color } as Vars} aria-hidden="true" />
                        {t(ink.name)}
                        {chosen ? <em><span className="dp-vh">, {t(PRICE.printed)} </span>{at + 1}</em> : null}
                        {ink.out ? <small><span className="dp-vh">, </span>{t(DRUMS.out)}</small> : null}
                      </button>
                    );
                  })}
                  <button type="button" className="dp-more" aria-expanded={allInks} aria-controls="dp-pick" onClick={toggleShelf}>
                    {allInks ? t(PRICE.fewerInks) : fill(t(PRICE.moreInks), { n: hiddenCount })}
                  </button>
                </div>
                <p className="dp-note">{t(PRICE.inksNote)}</p>
                <p className="dp-flag" role="status">{inkFlag}</p>
              </div>

              <div className="dp-field" role="group" aria-labelledby="dp-sides-label">
                <span className="dp-lab" id="dp-sides-label">{t(PRICE.sides)}</span>
                <div className="dp-seg">
                  <button type="button" aria-pressed={sides === 1} onClick={() => setSides(1)}>{t(PRICE.oneSide)}</button>
                  <button type="button" aria-pressed={sides === 2} onClick={() => setSides(2)}>{t(PRICE.bothSides)}</button>
                </div>
              </div>

              <div className="dp-field">
                <label className="dp-lab" htmlFor="dp-paper-select">{t(PRICE.paper)}</label>
                <span className="dp-select">
                  <select id="dp-paper-select" value={paper} onChange={(event) => setPaper(event.target.value as PaperChoice)}>
                    {PAPERS.map((entry) => (
                      <option key={entry.id} value={entry.id}>{`${entry.short ?? entry.name} ${entry.weight}`}</option>
                    ))}
                    <option value="own">{t(PRICE.own)}</option>
                  </select>
                </span>
              </div>

              <dl className="dp-rates">
                {RATES.map(([term, value]) => (
                  <div key={term.en}><dt>{t(term)}</dt><dd>{t(value)}</dd></div>
                ))}
              </dl>
            </form>

            <aside className="dp-docket" aria-labelledby="dp-quote-title">
              <div className="dp-docket__body">
                <div className="dp-docket__top">
                  <h3 id="dp-quote-title">{t(DOCKET.title)}</h3>
                  <span className="dp-mix" aria-hidden="true" style={{ '--dp-n': printOrder.length } as Vars}>
                    {printOrder.map((ink, index) => (
                      <i key={ink.id} className="dp-solid" style={{ '--dp-c': ink.color, '--dp-i': index } as Vars} />
                    ))}
                  </span>
                </div>
                <p className="dp-sub">{summary}</p>
                <p className="dp-runs">
                  <span>{t(DOCKET.order)}</span>
                  <span className="dp-runs__list">
                    {printOrder.map((ink, index) => (
                      <span key={ink.id}><em>{index + 1}</em>{t(ink.name)}</span>
                    ))}
                  </span>
                </p>
                <dl className="dp-lines">
                  <div>
                    <dt>{t(DOCKET.masters)} <small>{quote.masterCount === 1 ? t(DOCKET.master) : fill(t(DOCKET.mastersN), { n: quote.masterCount })}</small></dt>
                    <dd>{pounds(quote.masters)}</dd>
                  </div>
                  <div>
                    <dt>{t(DOCKET.printing)} <small>{fill(t(DOCKET.passes), { n: count.format(quote.passes), rate: quote.rate })}</small></dt>
                    <dd>{pounds(quote.printing)}</dd>
                  </div>
                  {quote.paper ? (
                    <div>
                      <dt>{t(DOCKET.paper)} <small>{fill(t(DOCKET.sheets), { n: count.format(quote.sheets), size: quote.sheetSize, price: quote.sheetPrice })}</small></dt>
                      <dd>{pounds(quote.paperCost)}</dd>
                    </div>
                  ) : (
                    <div>
                      <dt>{t(DOCKET.handling)}</dt>
                      <dd>{pounds(quote.handling)}</dd>
                    </div>
                  )}
                  {quote.extras > 0 ? (
                    <div>
                      <dt>{t(DOCKET.gold)} <small>{t(DOCKET.goldNote)}</small></dt>
                      <dd>{pounds(quote.extras)}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt>{t(DOCKET.trim)}</dt>
                    <dd>{t(DOCKET.free)}</dd>
                  </div>
                  <div className="dp-lines__soft">
                    <dt>{t(DOCKET.subtotal)}</dt>
                    <dd>{pounds(quote.subtotal)}</dd>
                  </div>
                  <div className="dp-lines__soft">
                    <dt>{t(DOCKET.vat)}</dt>
                    <dd>{pounds(quote.vat)}</dd>
                  </div>
                </dl>
              </div>
              <div className="dp-stub">
                <p className="dp-total">
                  <span>{t(DOCKET.total)}</span>
                  <span className="dp-op dp-op--sum">
                    <span>{total}</span>
                    <span aria-hidden="true">{total}</span>
                  </span>
                </p>
                <p>{perCopy} {fill(t(DOCKET.ready), { day: readyDay })}</p>
                <a className="dp-btn" href="#dp-order">{t(DOCKET.cta)}</a>
              </div>
              <p className="dp-vh" role="status">{live}</p>
            </aside>
          </div>
        </section>

        <section className="dp-sec" id="dp-files" aria-labelledby="dp-files-title">
          <div className="dp-head">
            <h2 id="dp-files-title">{t(FILES.title)}</h2>
            <p>{t(FILES.note)}</p>
          </div>
          <div className="dp-files">
            <ol className="dp-steps">
              {STEPS.map(({ title, body, files = [] }) => (
                <li key={title.en}>
                  <b>{t(title)}</b>
                  <p>
                    {t(body)}
                    {files.map((file, index) => (
                      <span key={file}> <code>{file}</code>{index < files.length - 1 ? ',' : '.'}</span>
                    ))}
                  </p>
                </li>
              ))}
            </ol>
            <div className="dp-proof" role="group" aria-label={t(FILES.proof)}>
              <figure className="dp-plate">
                <div aria-hidden="true"><i className="dp-p-disc dp-k" /><i className="dp-p-bar dp-k dp-k--grey" /></div>
                <figcaption>poster_pink.pdf</figcaption>
              </figure>
              <figure className="dp-plate">
                <div aria-hidden="true"><i className="dp-p-block dp-k" /></div>
                <figcaption>poster_teal.pdf</figcaption>
              </figure>
              <figure className="dp-plate dp-plate--print">
                <div aria-hidden="true">
                  <i className="dp-p-disc dp-solid" style={{ '--dp-c': 'var(--dp-pink)' } as Vars} />
                  <i className="dp-p-bar dp-ht" style={{ '--dp-c': 'var(--dp-pink)', '--r': '1.45px' } as Vars} />
                  <i className="dp-p-block dp-solid" style={{ '--dp-c': 'var(--dp-teal)' } as Vars} />
                </div>
                <figcaption>{t(FILES.both)}</figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="dp-sec" id="dp-order" aria-labelledby="dp-order-title">
          <div className="dp-head">
            <h2 id="dp-order-title">{t(ORDER.title)}</h2>
            <p>{t(ORDER.note)}</p>
          </div>
          <div className="dp-orderbox">
            <div className="dp-job">
              <dl>
                <div><dt>{t(ORDER.job)}</dt><dd>{summary}</dd></div>
                <div><dt>{t(ORDER.quote)}</dt><dd className="dp-job__total">{total}</dd></div>
                <div><dt>{t(ORDER.ready)}</dt><dd>{readyDay}</dd></div>
              </dl>
              <a className="dp-textlink" href="#dp-price">{t(ORDER.change)}</a>
            </div>

            {placed ? (
              <div className="dp-done" ref={doneRef} tabIndex={-1} role="group" aria-labelledby="dp-done-title">
                <h3 id="dp-done-title">{fill(t(ORDER.doneTitle), { quote: placed.quote })}</h3>
                <p>{fill(t(ORDER.doneJob), { quote: placed.quote, summary: placed.summary, total: placed.total })}</p>
                <p>{fill(t(ORDER.doneBody), { link: placed.link, email: placed.email })}</p>
                <button className="dp-btn" type="button" onClick={orderAgain}>{t(ORDER.again)}</button>
              </div>
            ) : (
              <form className="dp-order" noValidate onSubmit={handleOrder}>
                <div className={`dp-input${errors.name ? ' is-invalid' : ''}`}>
                  <label htmlFor="dp-name">{t(ORDER.name)}</label>
                  <input
                    id="dp-name"
                    ref={nameRef}
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                    value={guest.name}
                    aria-invalid={errors.name}
                    aria-describedby={errors.name ? 'dp-name-error' : undefined}
                    onChange={(event) => field('name', event.target.value)}
                  />
                  {errors.name ? <p className="dp-error" id="dp-name-error" role="alert">{t(ORDER.nameError)}</p> : null}
                </div>
                <div className={`dp-input${errors.email ? ' is-invalid' : ''}`}>
                  <label htmlFor="dp-email">{t(ORDER.email)}</label>
                  <input
                    id="dp-email"
                    ref={emailRef}
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    value={guest.email}
                    aria-invalid={errors.email}
                    aria-describedby={errors.email ? 'dp-email-error' : undefined}
                    onChange={(event) => field('email', event.target.value)}
                  />
                  {errors.email ? <p className="dp-error" id="dp-email-error" role="alert">{t(ORDER.emailError)}</p> : null}
                </div>
                <div className={`dp-input${errors.link ? ' is-invalid' : ''}`}>
                  <label htmlFor="dp-link">{t(ORDER.link)}</label>
                  <input
                    id="dp-link"
                    ref={linkRef}
                    type="url"
                    name="files"
                    inputMode="url"
                    autoComplete="url"
                    required
                    value={guest.link}
                    aria-invalid={errors.link}
                    aria-describedby={errors.link ? 'dp-link-hint dp-link-error' : 'dp-link-hint'}
                    onChange={(event) => field('link', event.target.value)}
                  />
                  <p className="dp-hint" id="dp-link-hint">{t(ORDER.linkHint)}</p>
                  {errors.link ? <p className="dp-error" id="dp-link-error" role="alert">{t(ORDER.linkError)}</p> : null}
                </div>
                <div className="dp-send">
                  <button className="dp-btn" type="submit">{fill(t(ORDER.send), { total })}</button>
                  <p>{t(ORDER.pay)}</p>
                </div>
              </form>
            )}
          </div>
        </section>

        <section className="dp-sec" id="dp-pickup" aria-labelledby="dp-pickup-title">
          <div className="dp-head">
            <h2 id="dp-pickup-title">{t(WEEK.title)}</h2>
            <p>{t(WEEK.note)}</p>
          </div>
          <ol className="dp-days" aria-label={t(WEEK.week)}>
            {DAYS.map((day, index) => (
              <li key={day.day.en} className={`dp-day${index === DAYS.length - 1 ? ' is-ready' : ''}`}>
                <span className="dp-bar" aria-hidden="true">
                  <i className="dp-solid" style={{ '--dp-c': 'var(--dp-pink)', '--dp-w': `${day.done}%` } as Vars} />
                  <i className="dp-ht" />
                </span>
                <b>{t(day.day)}</b>
                <span className="dp-date">{t(day.date)}</span>
                <p>{t(day.body)}</p>
              </li>
            ))}
          </ol>
          <div className="dp-pickup">
            <div>
              <h3>{t(WEEK.collect)}</h3>
              <address><span>{STREET}</span><span>{POSTCODE}</span></address>
              <p>{t(WEEK.collectBody)}</p>
            </div>
            <table className="dp-opts">
              <caption className="dp-vh">{t(WEEK.options)}</caption>
              <tbody>
                {OPTIONS.map((option) => (
                  <tr key={option.name.en}>
                    <td>{t(option.name)}{option.note ? <small><span className="dp-vh">, </span>{t(option.note)}</small> : null}</td>
                    <td>{t(option.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="dp-foot">
          <p className="dp-foot__name">{NAME}</p>
          <p>{STREET}, {POSTCODE}</p>
          <p><a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
          <p><a href={PHONE_HREF}>{PHONE}</a></p>
          <p>{t(FOOT.made)}</p>
        </footer>
      </div>
    </FusionShell>
  );
}
