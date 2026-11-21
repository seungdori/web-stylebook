import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedLiquidMetalPage.css';

// The product page of the Halden HA-1, a headphone amplifier built in Halden, Norway, in
// the Liquid Metal style. Michroma, the wide squared face engraved on test equipment, sets
// the name, the dial scale, the panel legends and every measured value; Hind reads the
// sentences. Components come from the amplifier: the volume knob as a working slider on its
// engraved scale, the rear panel as a brushed plate with its sockets, a measured power table
// with log-scale bars, an impedance scale that sets the drawn gain switch, and a packing
// list. One black base throughout; chrome is the only light.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

const MODEL = 'HA-1';
const PRICE = '1,290';

// Per-element custom properties, so the stylesheet can place an element differently at each width.
const vars = (values: Record<string, string | number>) => values as CSSProperties;

const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key]));

// Puts one value into a sentence as a node, so it can be set in its own weight.
const place = (text: string, key: string, node: ReactNode): ReactNode[] =>
  text.split(`{${key}}`).flatMap((part, index) => (index === 0 ? [part] : [<span key={index}>{node}</span>, part]));

const HEAD = {
  nav: { en: 'Product', ko: 'Product', ja: 'Product' },
  io: { en: 'Inputs and outputs', ko: 'Inputs and outputs', ja: 'Inputs and outputs' },
  specs: { en: 'Specifications', ko: 'Specifications', ja: 'Specifications' },
  headphones: { en: 'Headphones', ko: 'Headphones', ja: 'Headphones' },
  box: { en: 'In the box', ko: 'In the box', ja: 'In the box' },
  buy: { en: 'Buy', ko: 'Buy', ja: 'Buy' },
  basket: { en: 'Basket', ko: 'Basket', ja: 'Basket' },
} satisfies Record<string, Tri>;

// The volume knob: Mute, then 1 dB steps from −79 dB to 0 dB. The scale is linear in dB,
// 3.375 degrees a step, so Mute sits at the bottom left and 0 dB at the bottom right.
const MUTE = -80;
const TOP = 0;
const PAGE_DB = 6;
const DEG_PER_DB = 3.375;
const START_DB = -18;

const angleOf = (db: number) => 135 + db * DEG_PER_DB;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const decibels = (db: number) => (db === 0 ? '0' : `−${Math.abs(db)}`);

// The engraved scale, drawn once: a tick every 2 dB, a longer one at each figure.
const MAJOR = [-80, -60, -40, -20, -10, 0];

const point = (db: number, radius: number) => {
  const angle = (angleOf(db) * Math.PI) / 180;
  return { x: 300 + radius * Math.sin(angle), y: 300 - radius * Math.cos(angle) };
};

const stroke = (db: number, inner: number, outer: number) => {
  const a = point(db, inner);
  const b = point(db, outer);
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
};

const MINOR_TICKS = Array.from({ length: 41 }, (_, index) => MUTE + index * 2)
  .filter((db) => !MAJOR.includes(db))
  .map((db) => stroke(db, 205, 217))
  .join('');
const MAJOR_TICKS = MAJOR.map((db) => stroke(db, 205, 228)).join('');
// Figures at the ends and the top sit centred beyond their ticks. The side figures hang off
// their ticks, anchored at the end nearest the dial, so they never cross a tick at any size.
const SCALE_FIGURES = MAJOR.map((db) => {
  const side: 'start' | 'middle' | 'end' = db === -60 ? 'end' : db === -20 || db === -10 ? 'start' : 'middle';
  return { db, anchor: side, ...point(db, side === 'middle' ? 256 : 234) };
});

const HERO = {
  drives: {
    en: 'Drives everything from 12 ohm in-ears to 600 ohm studio headphones, through balanced or single-ended outputs.',
    ko: 'Drives everything from 12 ohm in-ears to 600 ohm studio headphones, through balanced or single-ended outputs.',
    ja: 'Drives everything from 12 ohm in-ears to 600 ohm studio headphones, through balanced or single-ended outputs.',
  },
  volume: { en: 'Volume', ko: 'Volume', ja: 'Volume' },
  mute: { en: 'Mute', ko: 'Mute', ja: 'Mute' },
  db: { en: '{v} dB', ko: '{v} dB', ja: '{v} dB' },
  priceNote: { en: 'Including VAT and shipping in Europe', ko: 'Including VAT and shipping in Europe', ja: 'Including VAT and shipping in Europe' },
  finish: { en: 'Finish', ko: 'Finish', ja: 'Finish' },
  add: { en: 'Add to basket', ko: 'Add to basket', ja: 'Add to basket' },
  dealer: { en: 'Hear one at a dealer', ko: 'Hear one at a dealer', ja: 'Hear one at a dealer' },
  stock: {
    en: 'In stock. Built and tested in Halden, ships in 2 working days.',
    ko: 'In stock. Built and tested in Halden, ships in 2 working days.',
    ja: 'In stock. Built and tested in Halden, ships in 2 working days.',
  },
  addedOne: {
    en: 'Added to your basket: the HA-1 in {finish}, €1,290.',
    ko: 'Added to your basket: the HA-1 in {finish}, €1,290.',
    ja: 'Added to your basket: the HA-1 in {finish}, €1,290.',
  },
  addedMore: {
    en: 'Added another HA-1 in {finish}. Your basket holds {n}.',
    ko: 'Added another HA-1 in {finish}. Your basket holds {n}.',
    ja: 'Added another HA-1 in {finish}. Your basket holds {n}.',
  },
  finishNews: {
    en: '{finish} finish. The knob and the rear panel are shown in {phrase}.',
    ko: '{finish} finish. The knob and the rear panel are shown in {phrase}.',
    ja: '{finish} finish. The knob and the rear panel are shown in {phrase}.',
  },
} satisfies Record<string, Tri>;

type FinishId = 'silver' | 'black';

const FINISHES: Array<{ id: FinishId; name: Tri; phrase: Tri }> = [
  { id: 'silver', name: { en: 'Silver', ko: 'Silver', ja: 'Silver' }, phrase: { en: 'silver', ko: 'silver', ja: 'silver' } },
  { id: 'black', name: { en: 'Black', ko: 'Black', ja: 'Black' }, phrase: { en: 'black', ko: 'black', ja: 'black' } },
];

const IO = {
  title: { en: 'Inputs and outputs', ko: 'Inputs and outputs', ja: 'Inputs and outputs' },
  note: {
    en: 'Headphones plug in at the front, into a 6.35 mm, a 4.4 mm balanced or a 4-pin XLR socket. Sources and speakers connect at the back.',
    ko: 'Headphones plug in at the front, into a 6.35 mm, a 4.4 mm balanced or a 4-pin XLR socket. Sources and speakers connect at the back.',
    ja: 'Headphones plug in at the front, into a 6.35 mm, a 4.4 mm balanced or a 4-pin XLR socket. Sources and speakers connect at the back.',
  },
  groups: [
    {
      name: { en: 'Balanced in', ko: 'Balanced in', ja: 'Balanced in' },
      body: {
        en: 'Two XLR sockets for a DAC with balanced outputs. Pin 2 hot, takes up to 8 V.',
        ko: 'Two XLR sockets for a DAC with balanced outputs. Pin 2 hot, takes up to 8 V.',
        ja: 'Two XLR sockets for a DAC with balanced outputs. Pin 2 hot, takes up to 8 V.',
      },
    },
    {
      name: { en: 'Line in', ko: 'Line in', ja: 'Line in' },
      body: {
        en: 'Two RCA sockets for a DAC, streamer or phono stage. Takes up to 4 V.',
        ko: 'Two RCA sockets for a DAC, streamer or phono stage. Takes up to 4 V.',
        ja: 'Two RCA sockets for a DAC, streamer or phono stage. Takes up to 4 V.',
      },
    },
    {
      name: { en: 'Pre out', ko: 'Pre out', ja: 'Pre out' },
      body: {
        en: 'To powered speakers. Follows the volume knob and mutes when headphones go in.',
        ko: 'To powered speakers. Follows the volume knob and mutes when headphones go in.',
        ja: 'To powered speakers. Follows the volume knob and mutes when headphones go in.',
      },
    },
    {
      name: { en: 'Serial number', ko: 'Serial number', ja: 'Serial number' },
      body: {
        en: 'Engraved before assembly, No. 0412 on this one. The same number is on the measurement report in the box.',
        ko: 'Engraved before assembly, No. 0412 on this one. The same number is on the measurement report in the box.',
        ja: 'Engraved before assembly, No. 0412 on this one. The same number is on the measurement report in the box.',
      },
    },
    {
      name: { en: 'Power', ko: 'Power', ja: 'Power' },
      body: {
        en: 'IEC inlet with its own switch. Works on any mains supply and draws 14 W at idle.',
        ko: 'IEC inlet with its own switch. Works on any mains supply and draws 14 W at idle.',
        ja: 'IEC inlet with its own switch. Works on any mains supply and draws 14 W at idle.',
      },
    },
  ],
};

const SPECS = {
  title: { en: 'Specifications', ko: 'Specifications', ja: 'Specifications' },
  note: {
    en: 'Measured on an Audio Precision APx555 at our bench in Halden. Every unit is measured before it ships, and the report for your serial number comes in the box.',
    ko: 'Measured on an Audio Precision APx555 at our bench in Halden. Every unit is measured before it ships, and the report for your serial number comes in the box.',
    ja: 'Measured on an Audio Precision APx555 at our bench in Halden. Every unit is measured before it ships, and the report for your serial number comes in the box.',
  },
  caption: { en: 'Output power per channel', ko: 'Output power per channel', ja: 'Output power per channel' },
  captionNote: { en: 'at 1% distortion', ko: 'at 1% distortion', ja: 'at 1% distortion' },
  load: { en: 'Load', ko: 'Load', ja: 'Load' },
  single: { en: '6.35 mm', ko: '6.35 mm', ja: '6.35 mm' },
  balanced: { en: 'Balanced', ko: 'Balanced', ja: 'Balanced' },
  scale: { en: 'Power on a log scale', ko: 'Power on a log scale', ja: 'Power on a log scale' },
  ohms: { en: '{n} ohms', ko: '{n} ohms', ja: '{n} ohms' },
} satisfies Record<string, Tri>;

// Output power per channel; the bars are drawn on a log scale from 0.1 W to 10 W.
const POWER = [
  { load: 16, single: ['4.8', 'W'], balanced: ['5.0', 'W'], bars: [84.1, 85] },
  { load: 32, single: ['2.5', 'W'], balanced: ['9.5', 'W'], bars: [69.9, 98.9] },
  { load: 64, single: ['1.3', 'W'], balanced: ['5.0', 'W'], bars: [55.7, 85] },
  { load: 150, single: ['540', 'mW'], balanced: ['2.2', 'W'], bars: [36.6, 67.1] },
  { load: 300, single: ['270', 'mW'], balanced: ['1.1', 'W'], bars: [21.6, 52.1] },
  { load: 600, single: ['135', 'mW'], balanced: ['540', 'mW'], bars: [6.5, 36.6] },
];

interface Spec {
  name: Tri;
  value: ReactNode;
  note: Tri;
}

const unit = (text: string, mid = false) => <small className={mid ? 'ha-mid' : undefined}>{text}</small>;

const SPEC_LIST: Spec[] = [
  { name: { en: 'THD+N', ko: 'THD+N', ja: 'THD+N' }, value: <>0.0006{unit('%')}</>, note: { en: '1 kHz, 1 W into 32 ohms, balanced', ko: '1 kHz, 1 W into 32 ohms, balanced', ja: '1 kHz, 1 W into 32 ohms, balanced' } },
  { name: { en: 'Output impedance', ko: 'Output impedance', ja: 'Output impedance' }, value: <>0.1{unit('ohm')}</>, note: { en: 'All three headphone outputs', ko: 'All three headphone outputs', ja: 'All three headphone outputs' } },
  { name: { en: 'Output noise', ko: 'Output noise', ja: 'Output noise' }, value: <>0.8{unit('µV')}</>, note: { en: 'A-weighted, Low gain', ko: 'A-weighted, Low gain', ja: 'A-weighted, Low gain' } },
  { name: { en: 'Frequency response', ko: 'Frequency response', ja: 'Frequency response' }, value: <>4{unit('Hz to', true)}120{unit('kHz')}</>, note: { en: 'Within 1 dB', ko: 'Within 1 dB', ja: 'Within 1 dB' } },
  { name: { en: 'Dynamic range', ko: 'Dynamic range', ja: 'Dynamic range' }, value: <>131{unit('dB')}</>, note: { en: 'Balanced, at full output', ko: 'Balanced, at full output', ja: 'Balanced, at full output' } },
  { name: { en: 'Channel separation', ko: 'Channel separation', ja: 'Channel separation' }, value: <>112{unit('dB')}</>, note: { en: '1 kHz, balanced', ko: '1 kHz, balanced', ja: '1 kHz, balanced' } },
  { name: { en: 'Gain', ko: 'Gain', ja: 'Gain' }, value: <>0, +10, +18{unit('dB')}</>, note: { en: 'Low, Mid and High, on a switch at the front', ko: 'Low, Mid and High, on a switch at the front', ja: 'Low, Mid and High, on a switch at the front' } },
  {
    name: { en: 'Volume', ko: 'Volume', ja: 'Volume' },
    value: <>80{unit('steps of 1 dB')}</>,
    note: {
      en: 'A relay attenuator from −79 dB to 0 dB, then Mute. Channels matched within 0.05 dB',
      ko: 'A relay attenuator from −79 dB to 0 dB, then Mute. Channels matched within 0.05 dB',
      ja: 'A relay attenuator from −79 dB to 0 dB, then Mute. Channels matched within 0.05 dB',
    },
  },
  { name: { en: 'Size', ko: 'Size', ja: 'Size' }, value: <>220 × 64 × 240{unit('mm')}</>, note: { en: 'Width, height and depth. Weighs 3.9 kg', ko: 'Width, height and depth. Weighs 3.9 kg', ja: 'Width, height and depth. Weighs 3.9 kg' } },
  { name: { en: 'Power', ko: 'Power', ja: 'Power' }, value: <>14{unit('W at idle')}</>, note: { en: '100 to 240 V, 50 or 60 Hz', ko: '100 to 240 V, 50 or 60 Hz', ja: '100 to 240 V, 50 or 60 Hz' } },
];

const PHONES = {
  title: { en: 'Which headphones it drives', ko: 'Which headphones it drives', ja: 'Which headphones it drives' },
  note: {
    en: 'Impedance is the quickest guide. Find your headphones on the scale, then set the gain switch on the front to the position shown.',
    ko: 'Impedance is the quickest guide. Find your headphones on the scale, then set the gain switch on the front to the position shown.',
    ja: 'Impedance is the quickest guide. Find your headphones on the scale, then set the gain switch on the front to the position shown.',
  },
  scale: { en: 'Headphone impedance in ohms', ko: 'Headphone impedance in ohms', ja: 'Headphone impedance in ohms' },
  group: { en: 'Impedance range', ko: 'Impedance range', ja: 'Impedance range' },
  ohms: { en: ' ohms', ko: ' ohms', ja: ' ohms' },
  set: { en: 'Set the gain switch on the front to {gain}.', ko: 'Set the gain switch on the front to {gain}.', ja: 'Set the gain switch on the front to {gain}.' },
  setFor: { en: 'For {range} ohms', ko: 'For {range} ohms', ja: 'For {range} ohms' },
  news: { en: '{range} ohms. Set the gain switch to {gain}.', ko: '{range} ohms. Set the gain switch to {gain}.', ja: '{range} ohms. Set the gain switch to {gain}.' },
  colRange: { en: 'Impedance', ko: 'Impedance', ja: 'Impedance' },
  colWho: { en: 'Typical headphones', ko: 'Typical headphones', ja: 'Typical headphones' },
  colGain: { en: 'Gain', ko: 'Gain', ja: 'Gain' },
  colPower: { en: 'Power, balanced', ko: 'Power, balanced', ja: 'Power, balanced' },
} satisfies Record<string, Tri>;

type GainId = 'low' | 'mid' | 'high';

const GAIN: Record<GainId, Tri> = {
  low: { en: 'Low', ko: 'Low', ja: 'Low' },
  mid: { en: 'Mid', ko: 'Mid', ja: 'Mid' },
  high: { en: 'High', ko: 'High', ja: 'High' },
};

interface Range {
  id: string;
  label: Tri;
  /** The range inside a sentence. */
  phrase: Tri;
  kind: Tri;
  models: Tri;
  gain: GainId;
  balanced: string;
  single: Tri;
  note: Tri;
  /** Where the range sits on the log scale from 8 to 600 ohms, in percent. */
  from: number;
  to: number;
}

const RANGES: Range[] = [
  {
    id: 'under-20',
    label: { en: 'Under 20', ko: 'Under 20', ja: 'Under 20' },
    phrase: { en: 'under 20', ko: 'under 20', ja: 'under 20' },
    kind: { en: 'In-ears with several drivers', ko: 'In-ears with several drivers', ja: 'In-ears with several drivers' },
    models: { en: 'Campfire Andromeda, 12.8 ohms. Shure SE215, 17 ohms.', ko: 'Campfire Andromeda, 12.8 ohms. Shure SE215, 17 ohms.', ja: 'Campfire Andromeda, 12.8 ohms. Shure SE215, 17 ohms.' },
    gain: 'low',
    balanced: '5.0 W',
    single: { en: '4.8 W from 6.35 mm', ko: '4.8 W from 6.35 mm', ja: '4.8 W from 6.35 mm' },
    note: {
      en: 'Sensitive in-ears are loud long before 12 o’clock. Low gain keeps the knob in its fine middle range and the noise floor at 0.8 µV, below anything you can hear.',
      ko: 'Sensitive in-ears are loud long before 12 o’clock. Low gain keeps the knob in its fine middle range and the noise floor at 0.8 µV, below anything you can hear.',
      ja: 'Sensitive in-ears are loud long before 12 o’clock. Low gain keeps the knob in its fine middle range and the noise floor at 0.8 µV, below anything you can hear.',
    },
    from: 0,
    to: 18.98,
  },
  {
    id: '20-80',
    label: { en: '20 to 80', ko: '20 to 80', ja: '20 to 80' },
    phrase: { en: '20 to 80', ko: '20 to 80', ja: '20 to 80' },
    kind: { en: 'Planar magnetic and closed headphones', ko: 'Planar magnetic and closed headphones', ja: 'Planar magnetic and closed headphones' },
    models: {
      en: 'Audeze LCD-X, 20 ohms. HiFiMAN Sundara, 37 ohms. Audio-Technica ATH-M50x, 38 ohms.',
      ko: 'Audeze LCD-X, 20 ohms. HiFiMAN Sundara, 37 ohms. Audio-Technica ATH-M50x, 38 ohms.',
      ja: 'Audeze LCD-X, 20 ohms. HiFiMAN Sundara, 37 ohms. Audio-Technica ATH-M50x, 38 ohms.',
    },
    gain: 'mid',
    balanced: '9.5 W',
    single: { en: '2.5 W from 6.35 mm', ko: '2.5 W from 6.35 mm', ja: '2.5 W from 6.35 mm' },
    note: {
      en: 'Planar headphones want current more than voltage, and this is where the HA-1 has the most of it. A Sundara at Mid gain reaches a loud 100 dB with the knob just past 12 o’clock.',
      ko: 'Planar headphones want current more than voltage, and this is where the HA-1 has the most of it. A Sundara at Mid gain reaches a loud 100 dB with the knob just past 12 o’clock.',
      ja: 'Planar headphones want current more than voltage, and this is where the HA-1 has the most of it. A Sundara at Mid gain reaches a loud 100 dB with the knob just past 12 o’clock.',
    },
    from: 18.98,
    to: 47.69,
  },
  {
    id: '80-300',
    label: { en: '80 to 300', ko: '80 to 300', ja: '80 to 300' },
    phrase: { en: '80 to 300', ko: '80 to 300', ja: '80 to 300' },
    kind: { en: 'Open dynamic and studio headphones', ko: 'Open dynamic and studio headphones', ja: 'Open dynamic and studio headphones' },
    models: {
      en: 'Beyerdynamic DT 770 Pro, 80 ohms. Sennheiser HD 650 and HD 800 S, 300 ohms.',
      ko: 'Beyerdynamic DT 770 Pro, 80 ohms. Sennheiser HD 650 and HD 800 S, 300 ohms.',
      ja: 'Beyerdynamic DT 770 Pro, 80 ohms. Sennheiser HD 650 and HD 800 S, 300 ohms.',
    },
    gain: 'mid',
    balanced: '1.1 W',
    single: { en: '270 mW from 6.35 mm', ko: '270 mW from 6.35 mm', ja: '270 mW from 6.35 mm' },
    note: {
      en: 'An HD 650 at Mid gain plays at a comfortable 80 dB with the knob near 12 o’clock, which leaves the top half of the dial for quiet recordings.',
      ko: 'An HD 650 at Mid gain plays at a comfortable 80 dB with the knob near 12 o’clock, which leaves the top half of the dial for quiet recordings.',
      ja: 'An HD 650 at Mid gain plays at a comfortable 80 dB with the knob near 12 o’clock, which leaves the top half of the dial for quiet recordings.',
    },
    from: 47.69,
    to: 75.06,
  },
  {
    id: '300-600',
    label: { en: '300 to 600', ko: '300 to 600', ja: '300 to 600' },
    phrase: { en: '300 to 600', ko: '300 to 600', ja: '300 to 600' },
    kind: { en: 'High-impedance studio headphones', ko: 'High-impedance studio headphones', ja: 'High-impedance studio headphones' },
    models: { en: 'Beyerdynamic DT 880 and DT 990, 600 ohms.', ko: 'Beyerdynamic DT 880 and DT 990, 600 ohms.', ja: 'Beyerdynamic DT 880 and DT 990, 600 ohms.' },
    gain: 'high',
    balanced: '540 mW',
    single: { en: '135 mW from 6.35 mm', ko: '135 mW from 6.35 mm', ja: '135 mW from 6.35 mm' },
    note: {
      en: 'High-impedance headphones need voltage. At High gain a DT 880 plays at 85 dB with the knob near 1 o’clock and keeps 10 dB in hand for quiet passages.',
      ko: 'High-impedance headphones need voltage. At High gain a DT 880 plays at 85 dB with the knob near 1 o’clock and keeps 10 dB in hand for quiet passages.',
      ja: 'High-impedance headphones need voltage. At High gain a DT 880 plays at 85 dB with the knob near 1 o’clock and keeps 10 dB in hand for quiet passages.',
    },
    from: 75.06,
    to: 89.42,
  },
];

// The impedance scale's figures, at their place on the log scale from 8 to 600 ohms.
const OHM_MARKS = [
  { n: '8', at: 0 },
  { n: '20', at: 18.98 },
  { n: '80', at: 47.69 },
  { n: '300', at: 75.06 },
  { n: '600', at: 89.42 },
];

const BOX = {
  title: { en: 'In the box', ko: 'In the box', ja: 'In the box' },
  amp: { en: 'HA-1 amplifier', ko: 'HA-1 amplifier', ja: 'HA-1 amplifier' },
  ampNote: {
    en: 'In {phrase}, with its serial number engraved on the back',
    ko: 'In {phrase}, with its serial number engraved on the back',
    ja: 'In {phrase}, with its serial number engraved on the back',
  },
  items: [
    { n: 1, name: { en: 'Power cable, 1.8 m', ko: 'Power cable, 1.8 m', ja: 'Power cable, 1.8 m' }, note: { en: 'With the plug for your country', ko: 'With the plug for your country', ja: 'With the plug for your country' } as Tri | null },
    { n: 1, name: { en: 'Pair of RCA cables, 1 m', ko: 'Pair of RCA cables, 1 m', ja: 'Pair of RCA cables, 1 m' }, note: null },
    { n: 1, name: { en: 'Adapter from 6.35 mm to 3.5 mm', ko: 'Adapter from 6.35 mm to 3.5 mm', ja: 'Adapter from 6.35 mm to 3.5 mm' }, note: null },
    {
      n: 1,
      name: { en: 'Measurement report', ko: 'Measurement report', ja: 'Measurement report' },
      note: { en: 'For your serial number, signed by the person who tested it', ko: 'For your serial number, signed by the person who tested it', ja: 'For your serial number, signed by the person who tested it' },
    },
    { n: 2, name: { en: 'Spare fuses, T1.6 A slow-blow', ko: 'Spare fuses, T1.6 A slow-blow', ja: 'Spare fuses, T1.6 A slow-blow' }, note: null },
  ],
};

const WARRANTY = {
  title: { en: 'Warranty', ko: 'Warranty', ja: 'Warranty' },
  years: { en: '5 years', ko: '5 years', ja: '5 years' },
  lead: {
    en: 'Parts and labour, counted from the day it is delivered. If you sell the amplifier, the warranty goes with it; the new owner only needs the serial number.',
    ko: 'Parts and labour, counted from the day it is delivered. If you sell the amplifier, the warranty goes with it; the new owner only needs the serial number.',
    ja: 'Parts and labour, counted from the day it is delivered. If you sell the amplifier, the warranty goes with it; the new owner only needs the serial number.',
  },
  terms: [
    {
      name: { en: 'Repairs', ko: 'Repairs', ja: 'Repairs' },
      body: {
        en: 'Done at the bench in Halden by the people who built it. We pay shipping both ways inside Europe.',
        ko: 'Done at the bench in Halden by the people who built it. We pay shipping both ways inside Europe.',
        ja: 'Done at the bench in Halden by the people who built it. We pay shipping both ways inside Europe.',
      },
    },
    {
      name: { en: 'Returns', ko: 'Returns', ja: 'Returns' },
      body: { en: '30 days to send it back for a full refund, for any reason.', ko: '30 days to send it back for a full refund, for any reason.', ja: '30 days to send it back for a full refund, for any reason.' },
    },
    {
      name: { en: 'After 5 years', ko: 'After 5 years', ja: 'After 5 years' },
      body: {
        en: 'We keep parts for every HA-1 and quote a repair before we start it.',
        ko: 'We keep parts for every HA-1 and quote a repair before we start it.',
        ja: 'We keep parts for every HA-1 and quote a repair before we start it.',
      },
    },
  ],
};

const FOOT = {
  company: 'Halden Lydteknikk AS',
  address: { en: 'Tistedalsgata 14, 1772 Halden, Norway', ko: 'Tistedalsgata 14, 1772 Halden, Norway', ja: 'Tistedalsgata 14, 1772 Halden, Norway' },
  dealers: { en: 'Hear one at a dealer', ko: 'Hear one at a dealer', ja: 'Hear one at a dealer' },
  dealersBody: {
    en: 'Dealers in Oslo, Stockholm, Copenhagen, Hamburg and Amsterdam keep an HA-1 for listening. Our own room in Halden is open on Saturdays from 11:00 to 15:00.',
    ko: 'Dealers in Oslo, Stockholm, Copenhagen, Hamburg and Amsterdam keep an HA-1 for listening. Our own room in Halden is open on Saturdays from 11:00 to 15:00.',
    ja: 'Dealers in Oslo, Stockholm, Copenhagen, Hamburg and Amsterdam keep an HA-1 for listening. Our own room in Halden is open on Saturdays from 11:00 to 15:00.',
  },
  service: { en: 'Service', ko: 'Service', ja: 'Service' },
  serviceBody: {
    en: '+47 69 17 42 00, weekdays 9:00 to 15:00. The manual and the measurement report for any serial number are sent on request.',
    ko: '+47 69 17 42 00, weekdays 9:00 to 15:00. The manual and the measurement report for any serial number are sent on request.',
    ja: '+47 69 17 42 00, weekdays 9:00 to 15:00. The manual and the measurement report for any serial number are sent on request.',
  },
} as const;

const PROMPT_EN = `Design one real page in the Liquid Metal style: one black page where polished and brushed metal is the only light, and every number reads like an engraved instrument scale.

Pick a believable subject made of machined metal and precise figures, such as a headphone amplifier, a turntable or a camera lens, and write its real content. The page must read as that product's page, never as a page about its own style. Here it is the Halden HA-1, a headphone amplifier built in Halden, Norway: its volume knob, rear panel, measured specifications, the headphones it drives and what comes in the box.

TOKENS:
--bg: #0a0a0a (one base from top to bottom)
--surface: #161616 (opaque, for any menu that opens over the page)
--ink: #f0f0f0
--muted: #a7a7a7
--line: rgba(240,240,240,0.26)
--line-strong: rgba(240,240,240,0.5)
--chrome: linear-gradient(180deg, #ffffff 0%, #e0e0e0 20%, #9e9e9e 45%, #c0c0c0 55%, #ffffff 72%, #a0a0a0 100%) (the product name only, as clipped text)
--button: linear-gradient(180deg, #fbfbfb 0%, #dcdcdc 44%, #a9a9a9 56%, #e9e9e9 100%) with #0a0a0a text (a lighter version of the same on hover)
--bar: linear-gradient(180deg, #ffffff 0%, #d4d4d4 40%, #8d8d8d 56%, #e2e2e2 100%)
No hue anywhere: greys, white and black only. The metal itself (knob, plate, sockets, switch) is drawn with layered linear, radial and conic gradients in greys.

TYPOGRAPHY:
Two families. Michroma (400 only) sets the product name, the headings, the dial scale, the panel legends and every measured value. Hind (400, 500, 600) sets the sentences, labels and buttons.
H1: Michroma 400, clamp(2.75rem, 4.8vw, 3.875rem), line-height 1.04, letter-spacing -0.01em, two lines (maker, model), filled with --chrome.
H2: Michroma 400, clamp(1.5rem, 2.6vw, 2.125rem), line-height 1.18.
H3 (rear panel labels): Michroma 400, 1rem, line-height 1.35.
Price: Michroma 400 at clamp(2rem, 3.2vw, 2.5rem), the euro sign in Hind 500 at 0.62em, raised. Measured values: Michroma at clamp(1.25rem, 1.8vw, 1.5rem), 1.1875rem below 400px; power figures at clamp(1.125rem, 1.7vw, 1.4375rem), 1rem below 400px; the volume readout 1.375rem; the warranty years at clamp(3.5rem, 7vw, 5.5rem); quantities 1.5rem. Units sit beside the figures in Hind 400 at 1rem, muted.
Body: Hind 400 at 1.0625rem, line-height 1.6; notes and labels 1rem. No text under 1rem except the legends engraved in the drawings (rear plate, gain switch) and the impedance scale's figures on phones, all hidden from assistive technology and said again in real text. The dial's figures are sized inside the drawing and grow on phones. Figures lining and tabular, except the price. No all-caps tracked labels. Write "ohms" in words: the faces have no ohm sign.

LAYOUT:
- A 1120px column, sections 120px apart (88px after the hero and on phones).
- Top bar: the maker's name, four in-page links (hidden below 960px) and one outlined "Buy" link that becomes "Basket" with its count.
- Hero on a 12-column grid: the name, one sentence and the buy block (price, finish, Add to basket, a dealer link, stock) in the first five columns; the volume dial, at most 468px, centred in the other seven. On a 1280x800 laptop the dial, name, price and Add to basket all show on the first screen. Below 960px it stacks: name, dial, buy block.
- Then inputs and outputs, specifications, the headphones it drives, in the box with the warranty beside it, and a three-column footer.

COMPONENTS:
- Volume dial: an engraved 270-degree scale (a tick every 2 dB, longer ticks and figures at Mute, -60, -40, -20, -10 and 0 dB) around a spun-aluminium knob drawn with conic and repeating gradients, with a pointer groove. It is a real slider: role="slider", 1 dB steps from Mute (-80) to 0 dB, arrow keys 1 dB, Page Up/Down 6 dB, Home Mute, End 0 dB, and a pointer drag that turns it. The readout under it ("Volume -18 dB") follows. Reflections stay put; only the groove turns.
- Finish: two toggle buttons (Silver, Black) with a brushed swatch each. Black re-draws the knob and the rear panel in black anodised metal with light engraving.
- Add to basket: a chrome button. It confirms in a status line under it and the top bar's link turns into "Basket" with the count.
- Rear panel: one brushed plate with four screws, XLR and RCA sockets, the engraved serial number, the IEC inlet and its switch; a line drops from each group to a label (H3 and a sentence) under the plate. On phones the plate turns on end and the labels sit beside each group.
- Power table: a table with explicit roles. Load, 6.35 mm and balanced power, and a pair of bars per row on a log scale from 0.1 W to 10 W (chrome bar for balanced, outlined bar for 6.35 mm). On phones each row keeps the three figures and puts its bars under them.
- Specifications: a two-column ruled list (one column below 1080px), the name in muted Hind and the value large in Michroma with its unit and a note.
- Impedance scale: a log scale from 8 to 600 ohms with ticks; four range buttons (aria-pressed) laid on it at their real width. Choosing one highlights its stretch of the scale, sets a drawn three-position gain switch (Low, Mid, High) and highlights its row in the list below, which then shows a note on how loud it plays. On tablets and phones the buttons sit in a row or a 2x2 grid under the scale.
- In the box: a ruled list with the quantity in Michroma; the amplifier line names the finish chosen above. Warranty: "5 years" large on an ink rule and three ruled terms.
- Corners 2 to 4px; the plate 10px; the knob and the sockets round. Lines 1px. Shadows only on the drawn metal (knob, plate, sockets, switch) and under the chrome button.

MOTION:
- Nothing moves on its own. Hover changes border, underline and text colour in 160ms, and the chrome button's gradient lightens; the gain switch slides 160ms to its new place. prefers-reduced-motion removes the transitions.

FORBIDDEN:
- Any colour accent; blue or warm-tinted metal; glows behind text; text-shadow
- Cards, pills, chips, badges, glass panels, tiles, a grid of feature boxes
- A small label above a heading, all-caps tracked labels, numbered section markers
- Chrome gradients on body text, headings other than the product name, or on lines
- Photographs, product renders, illustrations, emoji, swirling liquid blobs
- Arrows on links, middle-dot meta strings, numbers on anything that is not a real sequence
- Copy about chrome, metal, luxury or precision as a style

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML: a slider for the volume, toggle buttons for the finish and the impedance ranges, a table with roles for the power, a description list for the specifications, lists for the ranges and the box
3) Working volume slider (keys and drag), finish, impedance choice and Add to basket, with status changes announced politely
4) Responsive layout down to 320px with no horizontal scroll; the rear panel turns on end on phones
5) Visible focus on every control, text alternatives for every drawing, reduced-motion and forced-colours support`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_EN, ja: PROMPT_EN };

// The engraved legends on the rear plate are the same in every language.
function RearPlate() {
  return (
    <>
      <div className="ha-plate" aria-hidden="true" />
      <div className="ha-grp" style={vars({ '--ha-i': 1 })} aria-hidden="true">
        <span className="ha-eng">Balanced in</span>
        <span className="ha-jacks">
          <span className="ha-jack"><i className="ha-xlr" /><span className="ha-eng">L</span></span>
          <span className="ha-jack"><i className="ha-xlr" /><span className="ha-eng">R</span></span>
        </span>
      </div>
      <div className="ha-grp" style={vars({ '--ha-i': 2 })} aria-hidden="true">
        <span className="ha-eng">Line in</span>
        <span className="ha-jacks">
          <span className="ha-jack"><i className="ha-rca" /><span className="ha-eng">L</span></span>
          <span className="ha-jack"><i className="ha-rca" /><span className="ha-eng">R</span></span>
        </span>
      </div>
      <div className="ha-grp" style={vars({ '--ha-i': 3 })} aria-hidden="true">
        <span className="ha-eng">Pre out</span>
        <span className="ha-jacks">
          <span className="ha-jack"><i className="ha-rca" /><span className="ha-eng">L</span></span>
          <span className="ha-jack"><i className="ha-rca" /><span className="ha-eng">R</span></span>
        </span>
      </div>
      <div className="ha-grp" style={vars({ '--ha-i': 4 })} aria-hidden="true">
        <span className="ha-serial">
          <span className="ha-serial__no">No. 0412</span>
          <span className="ha-eng">Made in Halden, Norway</span>
        </span>
      </div>
      <div className="ha-grp" style={vars({ '--ha-i': 5 })} aria-hidden="true">
        <span className="ha-eng">100–240 V<br />50/60 Hz</span>
        <span className="ha-power-in"><i className="ha-iec"><i /></i><i className="ha-rocker" /></span>
      </div>
    </>
  );
}

export function PortedLiquidMetalPage({ lang }: PortedStylePageProps) {
  const [volume, setVolume] = useState(START_DB);
  const [finishId, setFinishId] = useState<FinishId>('silver');
  const [rangeId, setRangeId] = useState('80-300');
  const [basket, setBasket] = useState<FinishId[]>([]);
  const [news, setNews] = useState('');
  const turn = useRef<{ pointer: number; angle: number; value: number } | null>(null);

  const t = (text: Tri) => text[lang];

  const finish = FINISHES.find((item) => item.id === finishId) ?? FINISHES[0];
  const range = RANGES.find((item) => item.id === rangeId) ?? RANGES[2];
  const volumeText = volume <= MUTE ? t(HERO.mute) : fill(t(HERO.db), { v: decibels(volume) });
  const lastAdded = basket.length > 0 ? FINISHES.find((item) => item.id === basket[basket.length - 1]) ?? FINISHES[0] : null;

  const setDb = (db: number) => setVolume(clamp(Math.round(db), MUTE, TOP));

  const onKnobKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const steps: Record<string, number> = {
      ArrowUp: 1,
      ArrowRight: 1,
      ArrowDown: -1,
      ArrowLeft: -1,
      PageUp: PAGE_DB,
      PageDown: -PAGE_DB,
    };
    let next: number | undefined;
    if (event.key in steps) next = volume + steps[event.key];
    else if (event.key === 'Home') next = MUTE;
    else if (event.key === 'End') next = TOP;
    if (next === undefined) return;
    event.preventDefault();
    setDb(next);
  };

  // Turning the knob: the level follows the change of angle from where the pointer went
  // down, so a tap changes nothing and the knob turns like a real one.
  const angleAt = (event: PointerEvent<HTMLElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - (box.left + box.width / 2);
    const y = event.clientY - (box.top + box.height / 2);
    return { angle: (Math.atan2(x, -y) * 180) / Math.PI, centre: Math.hypot(x, y) < box.width * 0.08 };
  };

  const onKnobDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    turn.current = { pointer: event.pointerId, angle: angleAt(event).angle, value: volume };
  };

  const onKnobMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = turn.current;
    if (!drag || drag.pointer !== event.pointerId) return;
    const { angle, centre } = angleAt(event);
    if (centre) return;
    let delta = angle - drag.angle;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    drag.angle = angle;
    drag.value = clamp(drag.value + delta / DEG_PER_DB, MUTE, TOP);
    setDb(drag.value);
  };

  const endTurn = (event: PointerEvent<HTMLDivElement>) => {
    if (turn.current?.pointer === event.pointerId) turn.current = null;
  };

  const chooseFinish = (id: FinishId) => {
    if (id === finishId) return;
    const next = FINISHES.find((item) => item.id === id) ?? FINISHES[0];
    setFinishId(id);
    setNews(fill(t(HERO.finishNews), { finish: t(next.name), phrase: t(next.phrase) }));
  };

  const chooseRange = (next: Range) => {
    if (next.id === rangeId) return;
    setRangeId(next.id);
    setNews(fill(t(PHONES.news), { range: t(next.label), gain: t(GAIN[next.gain]) }));
  };

  const addToBasket = () => setBasket((items) => [...items, finishId]);

  return (
    <FusionShell
      fusionId="liquid-metal"
      lang={lang}
      tone="dark"
      accent="#f0f0f0"
      prev={{ href: '/pages/earth-atelier.html', label: 'Earth Atelier' }}
      next={{ href: '/pages/aurora-gradient.html', label: 'Aurora Gradient' }}
      prompts={PROMPTS}
    >
      <div className="ha" data-finish={finishId}>
        <header className="ha-bar">
          <p className="ha-mark">Halden</p>
          <nav className="ha-bar__nav" aria-label={t(HEAD.nav)}>
            <a href="#ha-io">{t(HEAD.io)}</a>
            <a href="#ha-specs">{t(HEAD.specs)}</a>
            <a href="#ha-phones">{t(HEAD.headphones)}</a>
            <a href="#ha-box">{t(HEAD.box)}</a>
          </nav>
          <a className="ha-btn ha-bar__buy" href="#ha-buy">
            {basket.length > 0 ? (
              <>
                {t(HEAD.basket)} <b className="ha-num">{basket.length}</b>
              </>
            ) : (
              t(HEAD.buy)
            )}
          </a>
        </header>

        <section className="ha-hero" aria-labelledby="ha-name">
          <div className="ha-hero__name">
            <h1 id="ha-name" className="ha-chrome">
              <span>Halden</span> <span>{MODEL}</span>
            </h1>
            <p className="ha-drives">{t(HERO.drives)}</p>
          </div>

          <div className="ha-dial">
            <svg viewBox="0 0 600 600" aria-hidden="true" focusable="false">
              <path className="ha-dial__arc" d="M155.2 444.8A205 205 0 1 1 444.8 444.8" />
              <path className="ha-dial__tick" d={MINOR_TICKS} />
              <path className="ha-dial__tick ha-dial__tick--major" d={MAJOR_TICKS} />
              {SCALE_FIGURES.map((figure) => (
                <text
                  key={figure.db}
                  className={figure.db === TOP ? 'is-top' : undefined}
                  x={figure.x.toFixed(1)}
                  y={figure.y.toFixed(1)}
                  textAnchor={figure.anchor}
                >
                  {figure.db === MUTE ? t(HERO.mute) : figure.db === TOP ? '0 dB' : decibels(figure.db)}
                </text>
              ))}
            </svg>
            <div
              className="ha-knob"
              role="slider"
              tabIndex={0}
              aria-labelledby="ha-volume-label"
              aria-valuemin={MUTE}
              aria-valuemax={TOP}
              aria-valuenow={volume}
              aria-valuetext={volumeText}
              onKeyDown={onKnobKey}
              onPointerDown={onKnobDown}
              onPointerMove={onKnobMove}
              onPointerUp={endTurn}
              onPointerCancel={endTurn}
            >
              <span className="ha-knob__face" />
              <span className="ha-knob__ptr" style={{ transform: `rotate(${angleOf(volume)}deg)` }}>
                <i />
              </span>
            </div>
            <p className="ha-readout">
              <span id="ha-volume-label">{t(HERO.volume)}</span> <b className="ha-num">{volumeText}</b>
            </p>
          </div>

          <div className="ha-hero__buy" id="ha-buy">
            <p className="ha-price">
              <b className="ha-num"><span className="ha-cur">€</span>{PRICE}</b> <span>{t(HERO.priceNote)}</span>
            </p>
            <fieldset className="ha-finish">
              <legend>{t(HERO.finish)}</legend>
              {FINISHES.map((item) => (
                <button key={item.id} type="button" aria-pressed={item.id === finishId} onClick={() => chooseFinish(item.id)}>
                  <i className={`ha-sw ha-sw--${item.id}`} aria-hidden="true" />
                  {t(item.name)}
                </button>
              ))}
            </fieldset>
            <div className="ha-actions">
              <button className="ha-btn ha-btn--chrome" type="button" onClick={addToBasket}>{t(HERO.add)}</button>
              <a className="ha-link" href="#ha-dealers">{t(HERO.dealer)}</a>
            </div>
            <p className="ha-added" role="status">
              {lastAdded
                ? fill(t(basket.length === 1 ? HERO.addedOne : HERO.addedMore), { finish: t(lastAdded.phrase), n: basket.length })
                : ''}
            </p>
            <p className="ha-stock">{t(HERO.stock)}</p>
          </div>
        </section>

        <section className="ha-section" id="ha-io" aria-labelledby="ha-io-title">
          <div className="ha-sec-head">
            <h2 id="ha-io-title">{t(IO.title)}</h2>
            <p>{t(IO.note)}</p>
          </div>
          <div className="ha-rear">
            <RearPlate />
            {IO.groups.map((group, index) => (
              <div key={group.name.en} className="ha-lab" style={vars({ '--ha-i': index + 1 })}>
                <h3>{t(group.name)}</h3>
                <p>{t(group.body)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="ha-section" id="ha-specs" aria-labelledby="ha-specs-title">
          <div className="ha-sec-head">
            <h2 id="ha-specs-title">{t(SPECS.title)}</h2>
            <p>{t(SPECS.note)}</p>
          </div>

          <p className="ha-power__cap" id="ha-power-cap">
            {t(SPECS.caption)} <span>{t(SPECS.captionNote)}</span>
          </p>
          <div className="ha-power" role="table" aria-labelledby="ha-power-cap">
            <div role="rowgroup">
              <div className="ha-power__row ha-power__row--head" role="row">
                <span role="columnheader">{t(SPECS.load)}</span>
                <span role="columnheader"><i className="ha-key ha-key--se" aria-hidden="true" />{t(SPECS.single)}</span>
                <span role="columnheader"><i className="ha-key ha-key--bal" aria-hidden="true" />{t(SPECS.balanced)}</span>
                <span className="ha-power__scale" role="columnheader">
                  <span className="ha-sr">{t(SPECS.scale)}</span>
                  <span className="ha-power__marks ha-num" aria-hidden="true">
                    <span>0.1 W</span>
                    <span>1 W</span>
                    <span>10 W</span>
                  </span>
                </span>
              </div>
            </div>
            <div role="rowgroup">
              {POWER.map((row) => (
                <div key={row.load} className="ha-power__row" role="row">
                  <span className="ha-power__load" role="rowheader">{fill(t(SPECS.ohms), { n: row.load })}</span>
                  <span className="ha-power__v ha-num" role="cell">{row.single[0]}<small>{row.single[1]}</small></span>
                  <span className="ha-power__v ha-num" role="cell">{row.balanced[0]}<small>{row.balanced[1]}</small></span>
                  <span className="ha-power__bars" role="cell">
                    <span aria-hidden="true">
                      <i className="ha-bar-se" style={{ width: `${row.bars[0]}%` }} />
                      <i className="ha-bar-bal" style={{ width: `${row.bars[1]}%` }} />
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <dl className="ha-spec">
            {SPEC_LIST.map((spec) => (
              <div key={spec.name.en}>
                <dt>{t(spec.name)}</dt>
                <dd>
                  <b className="ha-num">{spec.value}</b>
                  <span>{t(spec.note)}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="ha-section" id="ha-phones" aria-labelledby="ha-phones-title">
          <div className="ha-sec-head">
            <h2 id="ha-phones-title">{t(PHONES.title)}</h2>
            <p>{t(PHONES.note)}</p>
          </div>

          <div className="ha-scale-box">
            <p className="ha-scale-cap">{t(PHONES.scale)}</p>
            <div className="ha-scale ha-num" aria-hidden="true">
              {OHM_MARKS.map((mark) => (
                <span key={mark.n} style={{ left: `${mark.at}%` }}>{mark.n}</span>
              ))}
            </div>
            <div className="ha-ticks" aria-hidden="true">
              <i className="ha-ticks__on" style={{ left: `${range.from}%`, width: `${range.to - range.from}%` }} />
            </div>
            <div className="ha-bands" role="group" aria-label={t(PHONES.group)}>
              {RANGES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={item.id === rangeId}
                  style={vars({ '--ha-from': `${item.from}%`, '--ha-to': `${item.to}%` })}
                  onClick={() => chooseRange(item)}
                >
                  {t(item.label)}
                  <span className="ha-sr">{t(PHONES.ohms)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="ha-setting">
            <span className="ha-setting__panel" aria-hidden="true">
              <span className="ha-switch ha-switch--large" data-pos={range.gain}>
                <i />
              </span>
              <span className="ha-setting__legend">
                <span>{t(GAIN.low)}</span>
                <span>{t(GAIN.mid)}</span>
                <span>{t(GAIN.high)}</span>
              </span>
            </span>
            <p className="ha-setting__text">
              <span className="ha-setting__for">{fill(t(PHONES.setFor), { range: t(range.phrase) })}</span>
              {place(t(PHONES.set), 'gain', <b>{t(GAIN[range.gain])}</b>)}
            </p>
          </div>

          <div className="ha-ranges">
            <div className="ha-ranges__th" aria-hidden="true">
              <span>{t(PHONES.colRange)}</span>
              <span>{t(PHONES.colWho)}</span>
              <span>{t(PHONES.colGain)}</span>
              <span>{t(PHONES.colPower)}</span>
            </div>
            <ul>
              {RANGES.map((item) => {
                const on = item.id === rangeId;
                return (
                  <li key={item.id} className={`ha-range${on ? ' is-on' : ''}`} aria-current={on ? 'true' : undefined}>
                    <b className="ha-range__ohms ha-num">{t(item.label)}{t(PHONES.ohms)}</b>
                    <div className="ha-range__who">
                      <p>{t(item.kind)}</p>
                      <p>{t(item.models)}</p>
                    </div>
                    <p className="ha-range__gain">
                      <span className="ha-switch" data-pos={item.gain} aria-hidden="true"><i /></span>
                      <span className="ha-sr">{t(PHONES.colGain)}: </span>
                      {t(GAIN[item.gain])}
                    </p>
                    <p className="ha-range__pw">
                      <span className="ha-sr">{t(PHONES.colPower)}: </span>
                      <b className="ha-num">{item.balanced}</b>
                      <span>{t(item.single)}</span>
                    </p>
                    {on ? <p className="ha-range__note">{t(item.note)}</p> : null}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="ha-section ha-box" id="ha-box" aria-labelledby="ha-box-title ha-war-title">
          <div className="ha-box__in">
            <h2 id="ha-box-title">{t(BOX.title)}</h2>
            <ul className="ha-items">
              <li>
                <b className="ha-items__q ha-num">1</b>
                <span>
                  {t(BOX.amp)}
                  <small>{fill(t(BOX.ampNote), { phrase: t(finish.phrase) })}</small>
                </span>
              </li>
              {BOX.items.map((item) => (
                <li key={item.name.en}>
                  <b className="ha-items__q ha-num">{item.n}</b>
                  <span>
                    {t(item.name)}
                    {item.note ? <small>{t(item.note)}</small> : null}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="ha-box__war">
            <h2 id="ha-war-title">{t(WARRANTY.title)}</h2>
            <p className="ha-years ha-num">{t(WARRANTY.years)}</p>
            <p className="ha-war__lead">{t(WARRANTY.lead)}</p>
            <dl className="ha-war">
              {WARRANTY.terms.map((term) => (
                <div key={term.name.en}>
                  <dt>{t(term.name)}</dt>
                  <dd>{t(term.body)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <footer className="ha-foot">
          <p>
            <b>{FOOT.company}</b>
            {t(FOOT.address)}
          </p>
          <p id="ha-dealers">
            <b>{t(FOOT.dealers)}</b>
            {t(FOOT.dealersBody)}
          </p>
          <p>
            <b>{t(FOOT.service)}</b>
            {t(FOOT.serviceBody)}
          </p>
        </footer>

        <p className="ha-sr" role="status">{news}</p>
      </div>
    </FusionShell>
  );
}
