import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { flushSync } from 'react-dom';
import type { Lang } from '../../data/styles';
import type { PortedStylePageProps } from '../registry';
import { FusionShell } from '../FusionShell';
import './PortedSwissPosterPage.css';

// The exhibition page of Museum Kleinbasel for "Ruth Vogt, Posters 1958–1974", in the
// Swiss Poster style. One grotesk, Arimo (drawn to Helvetica's metrics), at every size:
// the name cut to the width of a white poster sheet, bold figures for catalogue numbers,
// hours, prices and talk dates, the regular cut for reading. Components come from a
// museum's exhibition page: the poster itself with crop marks, a room-by-room works list
// with catalogue numbers and a miniature of each sheet, one timetable for hours and
// prices beside the ticket form, and the Thursday talks as a dated list. Red marks only
// the circle in the name, today, the next talk, the ticket buttons and errors.
// FusionShell is the shared style-page chrome (back link, nav, prompt, prev/next).

type Tri = Record<Lang, string>;

const MUSEUM = 'Museum Kleinbasel';
const ADDRESS = 'Clarastrasse 21, 4058 Basel';
const PHONE = '+41 61 555 21 40';
const EMAIL = 'info@museum-kleinbasel.ch';
const YEARS = '1958–1974';

// The page is set on Saturday 21 November 2026. Booking runs from today to the last day.
const TODAY = '2026-11-21';
const LAST_DAY = '2027-01-24';
const CLOSED_DATES = ['2026-12-24', '2026-12-25', '2026-12-31', '2027-01-01'];
const PRICES = { adult: 16, concession: 10 } as const;
const MAX_TICKETS = 9;
const SEATS = 60;

const fill = (text: string, values: Record<string, string | number>) => text.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key]));

const HEAD = {
  nav: { en: 'Museum', ko: 'Museum', ja: 'Museum' },
  works: { en: 'Works', ko: 'Works', ja: 'Works' },
  visit: { en: 'Visit', ko: 'Visit', ja: 'Visit' },
  talks: { en: 'Talks', ko: 'Talks', ja: 'Talks' },
  tickets: { en: 'Tickets', ko: 'Tickets', ja: 'Tickets' },
} satisfies Record<string, Tri>;

const POSTER = {
  posters: { en: 'Posters', ko: 'Posters', ja: 'Posters' },
  from: { en: '18 September 2026', ko: '18 September 2026', ja: '18 September 2026' },
  to: { en: 'to 24 January 2027', ko: 'to 24 January 2027', ja: 'to 24 January 2027' },
  buy: { en: 'Buy tickets', ko: 'Buy tickets', ja: 'Buy tickets' },
} satisfies Record<string, Tri>;

const INTRO = {
  lede: {
    en: 'Ruth Vogt printed 212 posters in Basel between 1958 and 1974, for concert halls, theatres, the tram company and the shops on her own street. Forty of them hang together here for the first time, lent by her estate and by eleven collections.',
    ko: 'Ruth Vogt printed 212 posters in Basel between 1958 and 1974, for concert halls, theatres, the tram company and the shops on her own street. Forty of them hang together here for the first time, lent by her estate and by eleven collections.',
    ja: 'Ruth Vogt printed 212 posters in Basel between 1958 and 1974, for concert halls, theatres, the tram company and the shops on her own street. Forty of them hang together here for the first time, lent by her estate and by eleven collections.',
  },
  body: {
    en: 'They hang in the order she made them, from the linocuts of her first year to the large offset sheets of the 1970s. Next to them are her pencil sketches, colour proofs with the printer’s notes in the margin, and the wooden letters she cut by hand for Musica Viva in 1958.',
    ko: 'They hang in the order she made them, from the linocuts of her first year to the large offset sheets of the 1970s. Next to them are her pencil sketches, colour proofs with the printer’s notes in the margin, and the wooden letters she cut by hand for Musica Viva in 1958.',
    ja: 'They hang in the order she made them, from the linocuts of her first year to the large offset sheets of the 1970s. Next to them are her pencil sketches, colour proofs with the printer’s notes in the margin, and the wooden letters she cut by hand for Musica Viva in 1958.',
  },
  where: { en: 'Where', ko: 'Where', ja: 'Where' },
  hall: { en: 'Hall 2, ground floor', ko: 'Hall 2, ground floor', ja: 'Hall 2, ground floor' },
  today: { en: 'Open today, Saturday', ko: 'Open today, Saturday', ja: 'Open today, Saturday' },
  todayHours: { en: '10:00 to 18:00', ko: '10:00 to 18:00', ja: '10:00 to 18:00' },
  admission: { en: 'Admission', ko: 'Admission', ja: 'Admission' },
  admissionValue: { en: 'CHF 16, under 16 free', ko: 'CHF 16, under 16 free', ja: 'CHF 16, under 16 free' },
} satisfies Record<string, Tri>;

const WORKS = {
  title: { en: 'Works', ko: 'Works', ja: 'Works' },
  note: {
    en: 'Forty posters in four rooms. Sheets are 128 × 90.5 cm, the size of a Basel billboard, unless noted.',
    ko: 'Forty posters in four rooms. Sheets are 128 × 90.5 cm, the size of a Basel billboard, unless noted.',
    ja: 'Forty posters in four rooms. Sheets are 128 × 90.5 cm, the size of a Basel billboard, unless noted.',
  },
  rooms: { en: 'Rooms', ko: 'Rooms', ja: 'Rooms' },
  room: { en: 'Room {n}', ko: 'Room {n}', ja: 'Room {n}' },
  list: { en: 'Room {n}, {years}', ko: 'Room {n}, {years}', ja: 'Room {n}, {years}' },
  cat: { en: 'Cat.', ko: 'Cat.', ja: 'Cat.' },
  sheet: { en: 'Sheet', ko: 'Sheet', ja: 'Sheet' },
  work: { en: 'Title', ko: 'Title', ja: 'Title' },
  year: { en: 'Year', ko: 'Year', ja: 'Year' },
  client: { en: 'Client', ko: 'Client', ja: 'Client' },
  technique: { en: 'Technique', ko: 'Technique', ja: 'Technique' },
  next: { en: 'Room {n}, cat. {from} to {to}', ko: 'Room {n}, cat. {from} to {to}', ja: 'Room {n}, cat. {from} to {to}' },
  back: { en: 'Back to Room 1, cat. {from} to {to}', ko: 'Back to Room 1, cat. {from} to {to}', ja: 'Back to Room 1, cat. {from} to {to}' },
} satisfies Record<string, Tri>;

const TECH = {
  linoLetter: { en: 'Linocut and letterpress', ko: 'Linocut and letterpress', ja: 'Linocut and letterpress' },
  letterpress: { en: 'Letterpress', ko: 'Letterpress', ja: 'Letterpress' },
  screen: { en: 'Screen print', ko: 'Screen print', ja: 'Screen print' },
  screen3: { en: 'Screen print, three colours', ko: 'Screen print, three colours', ja: 'Screen print, three colours' },
  screen4: { en: 'Screen print, four colours', ko: 'Screen print, four colours', ja: 'Screen print, four colours' },
  screen5: { en: 'Screen print, five colours', ko: 'Screen print, five colours', ja: 'Screen print, five colours' },
  screen6: { en: 'Screen print, six colours', ko: 'Screen print, six colours', ja: 'Screen print, six colours' },
  screen12: { en: 'Screen print, twelve colours', ko: 'Screen print, twelve colours', ja: 'Screen print, twelve colours' },
  photolitho: { en: 'Photolithograph', ko: 'Photolithograph', ja: 'Photolithograph' },
  offset2: { en: 'Offset, two colours', ko: 'Offset, two colours', ja: 'Offset, two colours' },
  offset3: { en: 'Offset, three colours', ko: 'Offset, three colours', ja: 'Offset, three colours' },
  offset4: { en: 'Offset, four colours', ko: 'Offset, four colours', ja: 'Offset, four colours' },
  offsetPhoto: { en: 'Offset, photograph and two colours', ko: 'Offset, photograph and two colours', ja: 'Offset, photograph and two colours' },
} satisfies Record<string, Tri>;

interface Work {
  cat: number;
  /** The German title as printed on the sheet. */
  title: string;
  gloss: Tri | null;
  year: number;
  client: string;
  tech: Tri;
  /** Only when the sheet is not the 128 × 90.5 cm billboard size. */
  size?: string;
  /** What the sheet shows, read in place of its miniature. */
  sheet: Tri;
}

interface Room {
  years: string;
  note: Tri;
  works: Work[];
}

const ROOMS: Room[] = [
  {
    years: '1958–1961',
    note: {
      en: 'The first studio, a single room above a print shop on the Rheinsprung. Vogt cut and printed the early sheets herself, two colours at most.',
      ko: 'The first studio, a single room above a print shop on the Rheinsprung. Vogt cut and printed the early sheets herself, two colours at most.',
      ja: 'The first studio, a single room above a print shop on the Rheinsprung. Vogt cut and printed the early sheets herself, two colours at most.',
    },
    works: [
      { cat: 1, title: 'Musica Viva', gloss: { en: 'First concert of the season', ko: 'First concert of the season', ja: 'First concert of the season' }, year: 1958, client: 'Kammerorchester Kleinbasel', tech: TECH.linoLetter, sheet: { en: 'A red circle on black', ko: 'A red circle on black', ja: 'A red circle on black' } },
      { cat: 2, title: 'Neue Wohnungen', gloss: { en: 'New flats', ko: 'New flats', ja: 'New flats' }, year: 1958, client: 'Wohnbaugenossenschaft Hirzbrunnen', tech: TECH.letterpress, sheet: { en: 'Two black bars over a short red one', ko: 'Two black bars over a short red one', ja: 'Two black bars over a short red one' } },
      { cat: 3, title: 'Orgelkonzerte im Münster', gloss: { en: 'Organ concerts in the cathedral', ko: 'Organ concerts in the cathedral', ja: 'Organ concerts in the cathedral' }, year: 1959, client: 'Münstergemeinde Basel', tech: TECH.screen, sheet: { en: 'Close black stripes between white bands', ko: 'Close black stripes between white bands', ja: 'Close black stripes between white bands' } },
      { cat: 4, title: 'Die Uhr', gloss: { en: 'The clock', ko: 'The clock', ja: 'The clock' }, year: 1959, client: 'Uhrenverband Biel', tech: TECH.photolitho, sheet: { en: 'Black rings around a red dot', ko: 'Black rings around a red dot', ja: 'Black rings around a red dot' } },
      { cat: 5, title: 'Herbstmesse 1959', gloss: { en: 'Autumn fair', ko: 'Autumn fair', ja: 'Autumn fair' }, year: 1959, client: 'Messeverein Kleinbasel', tech: TECH.offset2, sheet: { en: 'Red and white, cut on the diagonal', ko: 'Red and white, cut on the diagonal', ja: 'Red and white, cut on the diagonal' } },
      { cat: 6, title: 'Theater am Rhein', gloss: { en: 'Season 1959/60', ko: 'Season 1959/60', ja: 'Season 1959/60' }, year: 1959, client: 'Theater am Rhein', tech: TECH.screen, sheet: { en: 'A black field over a red line', ko: 'A black field over a red line', ja: 'A black field over a red line' } },
      { cat: 7, title: 'Schwarz auf Weiss', gloss: { en: 'Black on white', ko: 'Black on white', ja: 'Black on white' }, year: 1960, client: 'Kunsthalle Olten', tech: TECH.letterpress, size: '64 × 45 cm', sheet: { en: 'A black block on white', ko: 'A black block on white', ja: 'A black block on white' } },
      { cat: 8, title: 'Rheinhafen Kleinhüningen', gloss: { en: 'The Rhine port', ko: 'The Rhine port', ja: 'The Rhine port' }, year: 1960, client: 'Rheinschifffahrt Basel', tech: TECH.offset2, sheet: { en: 'A red block above black lines', ko: 'A red block above black lines', ja: 'A red block above black lines' } },
      { cat: 9, title: 'Jazz im Volkshaus', gloss: { en: 'Jazz at the Volkshaus', ko: 'Jazz at the Volkshaus', ja: 'Jazz at the Volkshaus' }, year: 1961, client: 'Volkshaus Basel', tech: TECH.screen, sheet: { en: 'A red quarter circle meeting a black one', ko: 'A red quarter circle meeting a black one', ja: 'A red quarter circle meeting a black one' } },
      { cat: 10, title: 'Mit dem Tram 8 an den Rhein', gloss: { en: 'Take tram 8 to the Rhine', ko: 'Take tram 8 to the Rhine', ja: 'Take tram 8 to the Rhine' }, year: 1961, client: 'Verkehrsbetriebe Basel', tech: TECH.offset2, sheet: { en: 'A black band across white, with a red block', ko: 'A black band across white, with a red block', ja: 'A black band across white, with a red block' } },
    ],
  },
  {
    years: '1962–1965',
    note: {
      en: 'In 1962 Vogt moved to a ground-floor studio on the Klybeckstrasse and began working with the printer Paul Wassermann, who printed for her until 1974. The sheets grow larger and the type moves to the edge.',
      ko: 'In 1962 Vogt moved to a ground-floor studio on the Klybeckstrasse and began working with the printer Paul Wassermann, who printed for her until 1974. The sheets grow larger and the type moves to the edge.',
      ja: 'In 1962 Vogt moved to a ground-floor studio on the Klybeckstrasse and began working with the printer Paul Wassermann, who printed for her until 1974. The sheets grow larger and the type moves to the edge.',
    },
    works: [
      { cat: 11, title: 'Junge Schweizer Kunst', gloss: { en: 'Young Swiss art', ko: 'Young Swiss art', ja: 'Young Swiss art' }, year: 1962, client: 'Kunsthalle Olten', tech: TECH.offset2, sheet: { en: 'A white circle and a red one on black', ko: 'A white circle and a red one on black', ja: 'A white circle and a red one on black' } },
      { cat: 12, title: 'Weniger Lärm', gloss: { en: 'Less noise', ko: 'Less noise', ja: 'Less noise' }, year: 1962, client: 'Gesundheitsamt Basel-Stadt', tech: TECH.offset2, sheet: { en: 'A field of small black dots', ko: 'A field of small black dots', ja: 'A field of small black dots' } },
      { cat: 13, title: 'Bücher der Woche', gloss: { en: 'Books of the week', ko: 'Books of the week', ja: 'Books of the week' }, year: 1962, client: 'Buchhandlung Krebs', tech: TECH.letterpress, size: '64 × 45 cm', sheet: { en: 'A white block on red', ko: 'A white block on red', ja: 'A white block on red' } },
      { cat: 14, title: 'Theater am Rhein', gloss: { en: 'Season 1962/63', ko: 'Season 1962/63', ja: 'Season 1962/63' }, year: 1962, client: 'Theater am Rhein', tech: TECH.screen, sheet: { en: 'A red dot over a black slope', ko: 'A red dot over a black slope', ja: 'A red dot over a black slope' } },
      { cat: 15, title: 'Fahr mit dem Tram', gloss: { en: 'Take the tram', ko: 'Take the tram', ja: 'Take the tram' }, year: 1963, client: 'Verkehrsbetriebe Basel', tech: TECH.offset3, sheet: { en: 'Black, red and black stripes on white', ko: 'Black, red and black stripes on white', ja: 'Black, red and black stripes on white' } },
      { cat: 16, title: 'Neue Musik im Stadtcasino', gloss: { en: 'New music at the Stadtcasino', ko: 'New music at the Stadtcasino', ja: 'New music at the Stadtcasino' }, year: 1963, client: 'Musik-Forum Basel', tech: TECH.screen, sheet: { en: 'Black and white squares, one inside the other', ko: 'Black and white squares, one inside the other', ja: 'Black and white squares, one inside the other' } },
      { cat: 17, title: 'Herbstmesse 1964', gloss: { en: 'Autumn fair', ko: 'Autumn fair', ja: 'Autumn fair' }, year: 1964, client: 'Messeverein Kleinbasel', tech: TECH.offset4, sheet: { en: 'A red half circle rising from the bottom edge', ko: 'A red half circle rising from the bottom edge', ja: 'A red half circle rising from the bottom edge' } },
      { cat: 18, title: 'Milch', gloss: { en: 'Milk', ko: 'Milk', ja: 'Milk' }, year: 1964, client: 'Milchverband Nordwestschweiz', tech: TECH.photolitho, sheet: { en: 'A large black circle cut by the edge', ko: 'A large black circle cut by the edge', ja: 'A large black circle cut by the edge' } },
      { cat: 19, title: 'Velorennen Basel–Olten', gloss: { en: 'Cycle race', ko: 'Cycle race', ja: 'Cycle race' }, year: 1965, client: 'Veloclub Kleinbasel', tech: TECH.offset2, sheet: { en: 'Black and white diagonal stripes', ko: 'Black and white diagonal stripes', ja: 'Black and white diagonal stripes' } },
      { cat: 20, title: 'Musica Viva 1965/66', gloss: { en: 'Eight concerts', ko: 'Eight concerts', ja: 'Eight concerts' }, year: 1965, client: 'Kammerorchester Kleinbasel', tech: TECH.screen, sheet: { en: 'A red circle over a black line', ko: 'A red circle over a black line', ja: 'A red circle over a black line' } },
    ],
  },
  {
    years: '1966–1970',
    note: {
      en: 'Peter Wyss joined as her assistant in 1967. The studio took on its largest work: the tram company’s campaigns and the theatre’s seasons, printed in up to twelve colours on one press.',
      ko: 'Peter Wyss joined as her assistant in 1967. The studio took on its largest work: the tram company’s campaigns and the theatre’s seasons, printed in up to twelve colours on one press.',
      ja: 'Peter Wyss joined as her assistant in 1967. The studio took on its largest work: the tram company’s campaigns and the theatre’s seasons, printed in up to twelve colours on one press.',
    },
    works: [
      { cat: 21, title: 'Theater am Rhein', gloss: { en: 'Season 1966/67', ko: 'Season 1966/67', ja: 'Season 1966/67' }, year: 1966, client: 'Theater am Rhein', tech: TECH.screen6, sheet: { en: 'Black and white halves with a red block', ko: 'Black and white halves with a red block', ja: 'Black and white halves with a red block' } },
      { cat: 22, title: 'Plakate aus Polen', gloss: { en: 'Posters from Poland', ko: 'Posters from Poland', ja: 'Posters from Poland' }, year: 1966, client: 'Galerie Riehentor', tech: TECH.offset2, sheet: { en: 'A red circle overlapping a black one', ko: 'A red circle overlapping a black one', ja: 'A red circle overlapping a black one' } },
      { cat: 23, title: 'Linie 14', gloss: { en: 'Line 14', ko: 'Line 14', ja: 'Line 14' }, year: 1967, client: 'Verkehrsbetriebe Basel', tech: TECH.offset3, sheet: { en: 'Black rings spreading from one corner', ko: 'Black rings spreading from one corner', ja: 'Black rings spreading from one corner' } },
      { cat: 24, title: 'Zwölf Farben', gloss: { en: 'Twelve colours', ko: 'Twelve colours', ja: 'Twelve colours' }, year: 1967, client: 'Druckerei Wassermann', tech: TECH.screen12, sheet: { en: 'Fine black, red and white stripes', ko: 'Fine black, red and white stripes', ja: 'Fine black, red and white stripes' } },
      { cat: 25, title: 'Jazzfestival Augst', gloss: { en: 'Jazz festival at Augst', ko: 'Jazz festival at Augst', ja: 'Jazz festival at Augst' }, year: 1968, client: 'Jazzverein Augst', tech: TECH.screen4, sheet: { en: 'A small red circle and a large black one', ko: 'A small red circle and a large black one', ja: 'A small red circle and a large black one' } },
      { cat: 26, title: 'Wohnen heute', gloss: { en: 'Living today', ko: 'Living today', ja: 'Living today' }, year: 1968, client: 'Wohnbaugenossenschaft Hirzbrunnen', tech: TECH.offset2, sheet: { en: 'A black and white chequerboard', ko: 'A black and white chequerboard', ja: 'A black and white chequerboard' } },
      { cat: 27, title: 'Fasnacht 1969', gloss: { en: 'Carnival', ko: 'Carnival', ja: 'Carnival' }, year: 1969, client: 'Quartierverein Kleinbasel', tech: TECH.screen5, sheet: { en: 'Black dots over red and white', ko: 'Black dots over red and white', ja: 'Black dots over red and white' } },
      { cat: 28, title: 'Rheinschwimmen', gloss: { en: 'Swimming in the Rhine', ko: 'Swimming in the Rhine', ja: 'Swimming in the Rhine' }, year: 1969, client: 'Rheinclub Basel', tech: TECH.offset2, sheet: { en: 'A red dot over black and white lines', ko: 'A red dot over black and white lines', ja: 'A red dot over black and white lines' } },
      { cat: 29, title: 'Die Dreigroschenoper', gloss: { en: 'The Threepenny Opera', ko: 'The Threepenny Opera', ja: 'The Threepenny Opera' }, year: 1970, client: 'Theater am Rhein', tech: TECH.screen4, sheet: { en: 'A white bar and a red line on black', ko: 'A white bar and a red line on black', ja: 'A white bar and a red line on black' } },
      { cat: 30, title: 'Frauen stimmen', gloss: { en: 'Women vote', ko: 'Women vote', ja: 'Women vote' }, year: 1970, client: 'Aktionskomitee Frauenstimmrecht Basel', tech: TECH.offset2, sheet: { en: 'A white circle on red', ko: 'A white circle on red', ja: 'A white circle on red' } },
    ],
  },
  {
    years: '1971–1974',
    note: {
      en: 'The large offset sheets of the 1970s, with photographs cut into the type. Vogt closed the studio in 1974 and taught lettering in Basel until 1990.',
      ko: 'The large offset sheets of the 1970s, with photographs cut into the type. Vogt closed the studio in 1974 and taught lettering in Basel until 1990.',
      ja: 'The large offset sheets of the 1970s, with photographs cut into the type. Vogt closed the studio in 1974 and taught lettering in Basel until 1990.',
    },
    works: [
      { cat: 31, title: 'Frauenstimmrecht: Ja', gloss: { en: 'Votes for women: yes', ko: 'Votes for women: yes', ja: 'Votes for women: yes' }, year: 1971, client: 'Aktionskomitee Frauenstimmrecht Basel', tech: TECH.offset2, sheet: { en: 'A tall black bar beside a red block', ko: 'A tall black bar beside a red block', ja: 'A tall black bar beside a red block' } },
      { cat: 32, title: 'Musica Viva 1971/72', gloss: { en: 'Nine concerts', ko: 'Nine concerts', ja: 'Nine concerts' }, year: 1971, client: 'Kammerorchester Kleinbasel', tech: TECH.offset3, sheet: { en: 'Three circles in a row, the middle one red', ko: 'Three circles in a row, the middle one red', ja: 'Three circles in a row, the middle one red' } },
      { cat: 33, title: 'Die Stadt am Fluss', gloss: { en: 'The city on the river', ko: 'The city on the river', ja: 'The city on the river' }, year: 1971, client: 'Verkehrsverein Basel', tech: TECH.offsetPhoto, sheet: { en: 'A halftone photograph above a red band', ko: 'A halftone photograph above a red band', ja: 'A halftone photograph above a red band' } },
      { cat: 34, title: 'Rock im Volkshaus', gloss: { en: 'Rock at the Volkshaus', ko: 'Rock at the Volkshaus', ja: 'Rock at the Volkshaus' }, year: 1972, client: 'Volkshaus Basel', tech: TECH.screen3, sheet: { en: 'Red, black and white quarters turned on the corner', ko: 'Red, black and white quarters turned on the corner', ja: 'Red, black and white quarters turned on the corner' } },
      { cat: 35, title: 'Theater am Rhein', gloss: { en: 'Season 1972/73', ko: 'Season 1972/73', ja: 'Season 1972/73' }, year: 1972, client: 'Theater am Rhein', tech: TECH.offset4, sheet: { en: 'A red circle across a black and white split', ko: 'A red circle across a black and white split', ja: 'A red circle across a black and white split' } },
      { cat: 36, title: 'Basler Brot', gloss: { en: 'Bread from Basel', ko: 'Bread from Basel', ja: 'Bread from Basel' }, year: 1972, client: 'Bäckermeisterverband Basel', tech: TECH.offset2, sheet: { en: 'A black ring under a red line', ko: 'A black ring under a red line', ja: 'A black ring under a red line' } },
      { cat: 37, title: 'Herbstmesse 1973', gloss: { en: 'Autumn fair', ko: 'Autumn fair', ja: 'Autumn fair' }, year: 1973, client: 'Messeverein Kleinbasel', tech: TECH.offset4, sheet: { en: 'Red, black and white bands on the diagonal', ko: 'Red, black and white bands on the diagonal', ja: 'Red, black and white bands on the diagonal' } },
      { cat: 38, title: 'Tram 8: letzte Fahrt', gloss: { en: 'Tram 8’s last run', ko: 'Tram 8’s last run', ja: 'Tram 8’s last run' }, year: 1973, client: 'Verkehrsbetriebe Basel', tech: TECH.offset3, sheet: { en: 'A red bar across fine black lines', ko: 'A red bar across fine black lines', ja: 'A red bar across fine black lines' } },
      { cat: 39, title: 'Energie sparen', gloss: { en: 'Save energy', ko: 'Save energy', ja: 'Save energy' }, year: 1974, client: 'Elektrizitätswerk Basel', tech: TECH.offset2, sheet: { en: 'A red dot on a white and black split', ko: 'A red dot on a white and black split', ja: 'A red dot on a white and black split' } },
      { cat: 40, title: 'Ruth Vogt: Plakate', gloss: { en: 'Ruth Vogt: posters', ko: 'Ruth Vogt: posters', ja: 'Ruth Vogt: posters' }, year: 1974, client: 'Galerie Riehentor', tech: TECH.screen, sheet: { en: 'A black ring around a red centre', ko: 'A black ring around a red centre', ja: 'A black ring around a red centre' } },
    ],
  },
];

const VISIT = {
  title: { en: 'Hours and tickets', ko: 'Hours and tickets', ja: 'Hours and tickets' },
  note: {
    en: 'Closed on 24, 25 and 31 December and on 1 January. Tram 6, 8 or 14 to Claraplatz, then two minutes on foot.',
    ko: 'Closed on 24, 25 and 31 December and on 1 January. Tram 6, 8 or 14 to Claraplatz, then two minutes on foot.',
    ja: 'Closed on 24, 25 and 31 December and on 1 January. Tram 6, 8 or 14 to Claraplatz, then two minutes on foot.',
  },
  hours: { en: 'Opening hours', ko: 'Opening hours', ja: 'Opening hours' },
  prices: { en: 'Tickets', ko: 'Tickets', ja: 'Tickets' },
} satisfies Record<string, Tri>;

interface TimetableRow {
  name: Tri;
  value: Tri;
  note?: Tri;
  today?: boolean;
  shut?: boolean;
}

const HOURS: TimetableRow[] = [
  { name: { en: 'Monday', ko: 'Monday', ja: 'Monday' }, value: { en: 'Closed', ko: 'Closed', ja: 'Closed' }, shut: true },
  { name: { en: 'Tuesday and Wednesday', ko: 'Tuesday and Wednesday', ja: 'Tuesday and Wednesday' }, value: { en: '10:00–18:00', ko: '10:00–18:00', ja: '10:00–18:00' } },
  { name: { en: 'Thursday', ko: 'Thursday', ja: 'Thursday' }, value: { en: '10:00–20:00', ko: '10:00–20:00', ja: '10:00–20:00' }, note: { en: 'Talks at 18:30', ko: 'Talks at 18:30', ja: 'Talks at 18:30' } },
  { name: { en: 'Friday', ko: 'Friday', ja: 'Friday' }, value: { en: '10:00–18:00', ko: '10:00–18:00', ja: '10:00–18:00' } },
  { name: { en: 'Saturday, today', ko: 'Saturday, today', ja: 'Saturday, today' }, value: { en: '10:00–18:00', ko: '10:00–18:00', ja: '10:00–18:00' }, today: true },
  { name: { en: 'Sunday', ko: 'Sunday', ja: 'Sunday' }, value: { en: '10:00–17:00', ko: '10:00–17:00', ja: '10:00–17:00' } },
];

const PRICE_LIST: TimetableRow[] = [
  { name: { en: 'Adults', ko: 'Adults', ja: 'Adults' }, value: { en: 'CHF 16', ko: 'CHF 16', ja: 'CHF 16' } },
  { name: { en: 'Students, apprentices and over 65', ko: 'Students, apprentices and over 65', ja: 'Students, apprentices and over 65' }, value: { en: 'CHF 10', ko: 'CHF 10', ja: 'CHF 10' } },
  { name: { en: 'Under 16', ko: 'Under 16', ja: 'Under 16' }, value: { en: 'Free', ko: 'Free', ja: 'Free' } },
  { name: { en: 'Thursday from 17:00', ko: 'Thursday from 17:00', ja: 'Thursday from 17:00' }, value: { en: 'CHF 8', ko: 'CHF 8', ja: 'CHF 8' }, note: { en: 'Includes the talk', ko: 'Includes the talk', ja: 'Includes the talk' } },
  { name: { en: 'Groups of 10 or more', ko: 'Groups of 10 or more', ja: 'Groups of 10 or more' }, value: { en: 'CHF 12 each', ko: 'CHF 12 each', ja: 'CHF 12 each' }, note: { en: 'Book two weeks ahead', ko: 'Book two weeks ahead', ja: 'Book two weeks ahead' } },
];

type Kind = keyof typeof PRICES;
type DateIssue = 'missing' | 'past' | 'late' | 'monday' | 'holiday';

const TICKETS = {
  title: { en: 'Tickets for your visit', ko: 'Tickets for your visit', ja: 'Tickets for your visit' },
  date: { en: 'Day of your visit', ko: 'Day of your visit', ja: 'Day of your visit' },
  open: { en: '{day}, open {from} to {to}', ko: '{day}, open {from} to {to}', ja: '{day}, open {from} to {to}' },
  openTalk: { en: '{day}, open {from} to {to}, talk at 18:30', ko: '{day}, open {from} to {to}, talk at 18:30', ja: '{day}, open {from} to {to}, talk at 18:30' },
  closed: { en: '{day}: the museum is closed.', ko: '{day}: the museum is closed.', ja: '{day}: the museum is closed.' },
  legend: { en: 'Tickets', ko: 'Tickets', ja: 'Tickets' },
  adult: { en: 'Adult', ko: 'Adult', ja: 'Adult' },
  concession: { en: 'Concession', ko: 'Concession', ja: 'Concession' },
  concessionWho: { en: 'Students, apprentices and over 65', ko: 'Students, apprentices and over 65', ja: 'Students, apprentices and over 65' },
  addAdult: { en: 'Add an adult ticket', ko: 'Add an adult ticket', ja: 'Add an adult ticket' },
  removeAdult: { en: 'Remove an adult ticket', ko: 'Remove an adult ticket', ja: 'Remove an adult ticket' },
  addConcession: { en: 'Add a concession ticket', ko: 'Add a concession ticket', ja: 'Add a concession ticket' },
  removeConcession: { en: 'Remove a concession ticket', ko: 'Remove a concession ticket', ja: 'Remove a concession ticket' },
  countNote: {
    en: 'Under 16 free, no ticket needed. Up to nine tickets at a time; for a group of ten or more, call {phone}.',
    ko: 'Under 16 free, no ticket needed. Up to nine tickets at a time; for a group of ten or more, call {phone}.',
    ja: 'Under 16 free, no ticket needed. Up to nine tickets at a time; for a group of ten or more, call {phone}.',
  },
  max: { en: 'Nine tickets is the most for one booking.', ko: 'Nine tickets is the most for one booking.', ja: 'Nine tickets is the most for one booking.' },
  total: { en: 'Total', ko: 'Total', ja: 'Total' },
  email: { en: 'Email for the tickets', ko: 'Email for the tickets', ja: 'Email for the tickets' },
  submitOne: { en: 'Book 1 ticket, CHF {total}', ko: 'Book 1 ticket, CHF {total}', ja: 'Book 1 ticket, CHF {total}' },
  submitMany: { en: 'Book {n} tickets, CHF {total}', ko: 'Book {n} tickets, CHF {total}', ja: 'Book {n} tickets, CHF {total}' },
  submitNone: { en: 'Book tickets', ko: 'Book tickets', ja: 'Book tickets' },
  pay: {
    en: 'Booked tickets are paid at the desk, by card or in cash, and skip the queue.',
    ko: 'Booked tickets are paid at the desk, by card or in cash, and skip the queue.',
    ja: 'Booked tickets are paid at the desk, by card or in cash, and skip the queue.',
  },
  adultsOne: { en: '1 adult', ko: '1 adult', ja: '1 adult' },
  adultsMany: { en: '{n} adults', ko: '{n} adults', ja: '{n} adults' },
  concessionsOne: { en: '1 concession', ko: '1 concession', ja: '1 concession' },
  concessionsMany: { en: '{n} concessions', ko: '{n} concessions', ja: '{n} concessions' },
  both: { en: '{a} and {b}', ko: '{a} and {b}', ja: '{a} and {b}' },
  none: { en: 'No tickets', ko: 'No tickets', ja: 'No tickets' },
  news: { en: '{counts}. Total CHF {total}.', ko: '{counts}. Total CHF {total}.', ja: '{counts}. Total CHF {total}.' },
  doneTitle: { en: 'Booked for {day}.', ko: 'Booked for {day}.', ja: 'Booked for {day}.' },
  doneBody: {
    en: '{counts}, CHF {total}, to pay at the desk. The tickets are on their way to {email}.',
    ko: '{counts}, CHF {total}, to pay at the desk. The tickets are on their way to {email}.',
    ja: '{counts}, CHF {total}, to pay at the desk. The tickets are on their way to {email}.',
  },
  again: { en: 'Book more tickets', ko: 'Book more tickets', ja: 'Book more tickets' },
  countError: { en: 'Add at least one ticket.', ko: 'Add at least one ticket.', ja: 'Add at least one ticket.' },
  emailError: { en: 'Write an email address like name@example.ch.', ko: 'Write an email address like name@example.ch.', ja: 'Write an email address like name@example.ch.' },
} satisfies Record<string, Tri>;

const DATE_ERRORS: Record<DateIssue, Tri> = {
  missing: { en: 'Choose the day of your visit.', ko: 'Choose the day of your visit.', ja: 'Choose the day of your visit.' },
  past: { en: 'Choose today or a later day.', ko: 'Choose today or a later day.', ja: 'Choose today or a later day.' },
  late: { en: 'The exhibition closes on 24 January 2027. Choose a day before then.', ko: 'The exhibition closes on 24 January 2027. Choose a day before then.', ja: 'The exhibition closes on 24 January 2027. Choose a day before then.' },
  monday: { en: 'The museum is closed on Mondays. Choose another day.', ko: 'The museum is closed on Mondays. Choose another day.', ja: 'The museum is closed on Mondays. Choose another day.' },
  holiday: {
    en: 'The museum is closed on 24, 25 and 31 December and on 1 January. Choose another day.',
    ko: 'The museum is closed on 24, 25 and 31 December and on 1 January. Choose another day.',
    ja: 'The museum is closed on 24, 25 and 31 December and on 1 January. Choose another day.',
  },
};

const LOCALES: Record<Lang, string> = { en: 'en-GB', ko: 'ko-KR', ja: 'ja-JP' };

/** A YYYY-MM-DD value as a UTC date, or null when it is not a real day. */
function parseDay(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const day = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return day.toISOString().slice(0, 10) === value ? day : null;
}

function dateIssue(value: string): DateIssue | null {
  const day = parseDay(value);
  if (!day) return 'missing';
  if (value < TODAY) return 'past';
  if (value > LAST_DAY) return 'late';
  if (day.getUTCDay() === 1) return 'monday';
  if (CLOSED_DATES.includes(value)) return 'holiday';
  return null;
}

/** Opening and closing time by weekday, Sunday first. Monday is closed. */
const OPEN_HOURS: Array<[string, string] | null> = [
  ['10:00', '17:00'],
  null,
  ['10:00', '18:00'],
  ['10:00', '18:00'],
  ['10:00', '20:00'],
  ['10:00', '18:00'],
  ['10:00', '18:00'],
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Talk {
  id: string;
  date: string;
  day: number;
  month: Tri;
  when: Tri;
  title: Tri;
  who: Tri;
  /** Past talks: the length of the recording and its chapters. */
  recording?: { minutes: number; chapters: Array<{ at: string; title: Tri }> };
  /** Seats left before you book. Zero means full. */
  left?: number;
  /** People already on the waiting list of a full talk. */
  waiting?: number;
  next?: boolean;
}

const TALKS: Talk[] = [
  {
    id: 'rheinsprung',
    date: '2026-10-08',
    day: 8,
    month: { en: 'October', ko: 'October', ja: 'October' },
    when: { en: 'Thursday, 18:30', ko: 'Thursday, 18:30', ja: 'Thursday, 18:30' },
    title: { en: 'The first studio on the Rheinsprung', ko: 'The first studio on the Rheinsprung', ja: 'The first studio on the Rheinsprung' },
    who: { en: 'Lena Fischer, curator of the exhibition', ko: 'Lena Fischer, curator of the exhibition', ja: 'Lena Fischer, curator of the exhibition' },
    recording: {
      minutes: 52,
      chapters: [
        { at: '0:00', title: { en: 'Why the exhibition starts on the Rheinsprung', ko: 'Why the exhibition starts on the Rheinsprung', ja: 'Why the exhibition starts on the Rheinsprung' } },
        { at: '6:40', title: { en: 'The print shop downstairs and its two presses', ko: 'The print shop downstairs and its two presses', ja: 'The print shop downstairs and its two presses' } },
        { at: '19:15', title: { en: 'Cutting the wooden letters for Musica Viva', ko: 'Cutting the wooden letters for Musica Viva', ja: 'Cutting the wooden letters for Musica Viva' } },
        { at: '34:30', title: { en: 'The first sheet for the tram company', ko: 'The first sheet for the tram company', ja: 'The first sheet for the tram company' } },
        { at: '44:05', title: { en: 'Questions from the room', ko: 'Questions from the room', ja: 'Questions from the room' } },
      ],
    },
  },
  {
    id: 'trams',
    date: '2026-10-29',
    day: 29,
    month: { en: 'October', ko: 'October', ja: 'October' },
    when: { en: 'Thursday, 18:30', ko: 'Thursday, 18:30', ja: 'Thursday, 18:30' },
    title: { en: 'Posters for the Basel trams, 1961 to 1973', ko: 'Posters for the Basel trams, 1961 to 1973', ja: 'Posters for the Basel trams, 1961 to 1973' },
    who: { en: 'Marco Bernasconi, archivist at the Verkehrsbetriebe Basel', ko: 'Marco Bernasconi, archivist at the Verkehrsbetriebe Basel', ja: 'Marco Bernasconi, archivist at the Verkehrsbetriebe Basel' },
    recording: {
      minutes: 47,
      chapters: [
        { at: '0:00', title: { en: 'How the tram company bought posters in 1961', ko: 'How the tram company bought posters in 1961', ja: 'How the tram company bought posters in 1961' } },
        { at: '9:20', title: { en: 'Line 14 and its twelve-week campaign', ko: 'Line 14 and its twelve-week campaign', ja: 'Line 14 and its twelve-week campaign' } },
        { at: '23:45', title: { en: 'What the drivers made of the posters', ko: 'What the drivers made of the posters', ja: 'What the drivers made of the posters' } },
        { at: '36:10', title: { en: 'Tram 8’s last run, 1973', ko: 'Tram 8’s last run, 1973', ja: 'Tram 8’s last run, 1973' } },
        { at: '41:30', title: { en: 'Questions from the room', ko: 'Questions from the room', ja: 'Questions from the room' } },
      ],
    },
  },
  {
    id: 'colours',
    date: '2026-11-26',
    day: 26,
    month: { en: 'November', ko: 'November', ja: 'November' },
    when: { en: 'Thursday, 18:30', ko: 'Thursday, 18:30', ja: 'Thursday, 18:30' },
    title: { en: 'Twelve colours on one press', ko: 'Twelve colours on one press', ja: 'Twelve colours on one press' },
    who: { en: 'Anna Keller, screen printer, with the proofs of cat. 21, 24 and 29', ko: 'Anna Keller, screen printer, with the proofs of cat. 21, 24 and 29', ja: 'Anna Keller, screen printer, with the proofs of cat. 21, 24 and 29' },
    left: 14,
    next: true,
  },
  {
    id: 'assistant',
    date: '2026-12-10',
    day: 10,
    month: { en: 'December', ko: 'December', ja: 'December' },
    when: { en: 'Thursday, 18:30', ko: 'Thursday, 18:30', ja: 'Thursday, 18:30' },
    title: { en: 'Four years as Ruth Vogt’s assistant', ko: 'Four years as Ruth Vogt’s assistant', ja: 'Four years as Ruth Vogt’s assistant' },
    who: { en: 'Peter Wyss, who worked in her studio from 1967 to 1971', ko: 'Peter Wyss, who worked in her studio from 1967 to 1971', ja: 'Peter Wyss, who worked in her studio from 1967 to 1971' },
    left: 0,
    waiting: 3,
  },
  {
    id: 'last-walk',
    date: '2027-01-21',
    day: 21,
    month: { en: 'January 2027', ko: 'January 2027', ja: 'January 2027' },
    when: { en: 'Thursday, 18:30', ko: 'Thursday, 18:30', ja: 'Thursday, 18:30' },
    title: { en: 'Last walk through the four rooms', ko: 'Last walk through the four rooms', ja: 'Last walk through the four rooms' },
    who: { en: 'Lena Fischer, curator of the exhibition', ko: 'Lena Fischer, curator of the exhibition', ja: 'Lena Fischer, curator of the exhibition' },
    left: SEATS,
  },
];

const TALK_COPY = {
  title: { en: 'Talks', ko: 'Talks', ja: 'Talks' },
  note: {
    en: 'Thursdays at 18:30 in the lecture room on the first floor, in German. A seat is free with your ticket; there are 60.',
    ko: 'Thursdays at 18:30 in the lecture room on the first floor, in German. A seat is free with your ticket; there are 60.',
    ja: 'Thursdays at 18:30 in the lecture room on the first floor, in German. A seat is free with your ticket; there are 60.',
  },
  nextTalk: { en: 'Next talk', ko: 'Next talk', ja: 'Next talk' },
  book: { en: 'Book a seat', ko: 'Book a seat', ja: 'Book a seat' },
  cancel: { en: 'Cancel the seat', ko: 'Cancel the seat', ja: 'Cancel the seat' },
  left: { en: '{n} of 60 seats left', ko: '{n} of 60 seats left', ja: '{n} of 60 seats left' },
  have: { en: 'You have a seat. {n} of 60 seats left.', ko: 'You have a seat. {n} of 60 seats left.', ja: 'You have a seat. {n} of 60 seats left.' },
  full: { en: 'Full', ko: 'Full', ja: 'Full' },
  waiting: { en: '{n} people are on the waiting list.', ko: '{n} people are on the waiting list.', ja: '{n} people are on the waiting list.' },
  join: { en: 'Join the waiting list', ko: 'Join the waiting list', ja: 'Join the waiting list' },
  leave: { en: 'Leave the waiting list', ko: 'Leave the waiting list', ja: 'Leave the waiting list' },
  onList: {
    en: 'You are number {n} on the waiting list. Seats that come free are given out at the door from 18:15.',
    ko: 'You are number {n} on the waiting list. Seats that come free are given out at the door from 18:15.',
    ja: 'You are number {n} on the waiting list. Seats that come free are given out at the door from 18:15.',
  },
  recorded: { en: 'Recorded, {n} minutes', ko: 'Recorded, {n} minutes', ja: 'Recorded, {n} minutes' },
  chapters: { en: 'Chapters', ko: 'Chapters', ja: 'Chapters' },
  station: {
    en: 'In German. The recording plays on the listening station in Room 4 until 24 January.',
    ko: 'In German. The recording plays on the listening station in Room 4 until 24 January.',
    ja: 'In German. The recording plays on the listening station in Room 4 until 24 January.',
  },
  booked: { en: '{title}: seat booked. {n} of 60 seats left.', ko: '{title}: seat booked. {n} of 60 seats left.', ja: '{title}: seat booked. {n} of 60 seats left.' },
  cancelled: { en: '{title}: seat cancelled. {n} of 60 seats left.', ko: '{title}: seat cancelled. {n} of 60 seats left.', ja: '{title}: seat cancelled. {n} of 60 seats left.' },
  joined: { en: '{title}: you are number {n} on the waiting list.', ko: '{title}: you are number {n} on the waiting list.', ja: '{title}: you are number {n} on the waiting list.' },
  left_: { en: '{title}: you have left the waiting list.', ko: '{title}: you have left the waiting list.', ja: '{title}: you have left the waiting list.' },
} satisfies Record<string, Tri>;

const FOOT = {
  support: {
    en: 'The exhibition is supported by the Ernst Vogt Foundation and the City of Basel.',
    ko: 'The exhibition is supported by the Ernst Vogt Foundation and the City of Basel.',
    ja: 'The exhibition is supported by the Ernst Vogt Foundation and the City of Basel.',
  },
} satisfies Record<string, Tri>;

const PROMPT_EN = `Design one real page in the Swiss Poster style: an off-white page with one white poster sheet on it, black type in a single grotesk, black rules on a 12-column grid, and one red.

Pick a believable subject whose page has to carry a poster and a lot of exact information, such as a museum exhibition, a concert season or a film festival, and write its real content. The page must read as that subject's page, never as a page about its own style. Here it is Museum Kleinbasel's exhibition "Ruth Vogt, Posters 1958–1974": the poster, the works room by room, hours and tickets with a ticket form, and the Thursday talks.

TOKENS:
--paper: #f5f4ef (the page)
--sheet: #ffffff (the poster sheet, fields and the language menu)
--ink: #111111
--muted: #545454 (secondary text, past talks)
--rule: #111111 (structural rules)
--rule-soft: rgba(17,17,17,0.3) (row rules, miniature edges, disabled steppers)
--red: #d41f18
--baseline: rgba(17,17,17,0.045) (the sheet's 24px baseline lines)
--hover: rgba(17,17,17,0.06) (hover on an unselected room tab)

COLOUR:
- Red marks only the O in the name, today's row in the hours, the date of the next talk, the two ticket buttons (white text, 5.2:1) and error messages and the border of an invalid field. Nothing else is red.
- Buttons are ink on a 2px ink border and fill with ink on hover; the red buttons fill with ink on hover. The selected room tab is white on ink. Focus is a 3px ink ring (white inside the ink tab).
- The miniatures of the posters use only ink, white and red.

TYPOGRAPHY:
One family, Arimo (400 and 700), drawn to Helvetica's metrics. Hierarchy comes from size and weight only.
Name: 700, min(15rem, 27vw) (25vw under 560px, 24vw under 360px), line-height 0.8, letter-spacing -0.055em, upper case, two lines cut to the width of the sheet.
Subtitle: 700, clamp(1.75rem, 3.3vw, 2.75rem), line-height 1, letter-spacing -0.035em. Dates: 400, clamp(1.125rem, 1.6vw, 1.375rem), line-height 1.3.
H2: 700, clamp(2.25rem, 4vw, 3.25rem), line-height 0.98, letter-spacing -0.04em. H3: 700, 1.3125rem.
Lede: 400, clamp(1.1875rem, 1.7vw, 1.4375rem), line-height 1.38.
Figures are 700 and tabular: catalogue numbers 1.625rem, talk days clamp(3.25rem, 5.4vw, 4.5rem) at line-height 0.8, hours and prices 1.25rem, the ticket total 2rem.
Body: 400, 1.0625rem, line-height 1.55. Secondary text 1rem. No text under 1rem. No all-caps labels anywhere except the name.

LAYOUT:
- A 1120px column. A museum bar: the museum's name in 700, three in-page links and an outlined "Tickets" button on a 1px ink rule.
- The poster: a white sheet with a 1px ink border, four 12px crop marks 14px outside its corners (8px and 10px under 560px), 24px baseline lines, and a 1px ink circle in its top right corner. The name fills the first eight columns; the subtitle, the dates and a red "Buy tickets" button stand in the last four, bottom-aligned with the name. The whole sheet fits on the first screen of a 1280x800 laptop. Below 1080px the subtitle and dates move under the name.
- Under the sheet, on the paper: the lede and one paragraph in seven columns, and three facts (where, open today, admission) in the last four, on 1px soft rules.
- Sections 96px apart (72px under 960px, 60px on phones), each opened by a 2px ink rule: the heading and a note in the first three columns, the content in the other nine.
- A three-column footer on a 1px rule.

COMPONENTS:
- Room tabs: four equal cells in a 1px ink frame, "Room 1" in 700 over its years. The tab pattern: roving tabindex, arrow keys, Home and End, one labelled panel. On phones two by two.
- Works list: a table with explicit roles. Catalogue number, a 42px miniature of the sheet (abstract shapes in ink, white and red, with a text description), the German title in 700 with its English meaning under it, year, client, technique. Header row in muted text on a 1px ink rule, rows on soft rules. Under 760px each row stacks: number and miniature on the left, the title, year and client, technique on the right. A button at the end opens the next room and moves focus to its tab.
- Hours and tickets: one timetable in two groups (opening hours, tickets) with the group name in 700 over a 1px ink rule; today's row red. Beside it a ticket form on a 2px ink rule: a date field (today to the last day; Mondays and holidays refused, with the day's opening hours written under it), steppers for adults (CHF 16) and concessions (CHF 10) with 44px square buttons, up to nine tickets, a total in CHF that updates, an email field, and one red full-width button that names the count and the price. Errors sit under their field; a valid booking replaces the form with a confirmation that takes focus.
- Talks: a dated list on soft rules. The day huge, the month and time beside it; title in 700 and the speaker in muted. Past talks in muted with their recording's length and a Chapters disclosure. The next talk's day is red. "Book a seat" and "Join the waiting list" change to "Cancel the seat" and "Leave the waiting list", update the seat count and are announced in a polite live region.
- Square corners everywhere. No shadows.

MOTION:
- None. Hover fills a button with ink or thickens an underline, at once. Nothing moves on its own.

FORBIDDEN:
- Cards, rounded corners, pills, chips, badges, shadows, colour gradients, glass
- A small label above a heading, all-caps tracked labels, numbered section markers
- Red on anything not listed under COLOUR; a second accent colour
- Photographs, illustrations of people or things, emoji, icons beyond a minus and a plus
- Arrows on links, middle-dot meta strings, numbers on anything that is not a real sequence
- Copy about grids, Helvetica, Swiss design or typography

OUTPUT:
1) CSS custom properties for the tokens above
2) Semantic HTML: a tab list with one tab panel, a works table with roles, a timetable with row and group headers, a labelled ticket form, a list of talks
3) Working room tabs, steppers and total, form validation with error and success states, seat booking and waiting list with live announcements
4) Responsive layout down to 320px with no horizontal scroll; tables stack on phones instead of scrolling
5) Visible focus on every control, 44px touch targets, no text under 16px`;

const PROMPTS: Record<Lang, string> = { en: PROMPT_EN, ko: PROMPT_EN, ja: PROMPT_EN };

type Errors = { date: DateIssue | null; count: boolean; email: boolean };
type Booking = { date: string; counts: Record<Kind, number>; email: string; total: number };

const NO_ERRORS: Errors = { date: null, count: false, email: false };

export function PortedSwissPosterPage({ lang }: PortedStylePageProps) {
  const [roomIndex, setRoomIndex] = useState(0);
  const [visitDate, setVisitDate] = useState(TODAY);
  const [counts, setCounts] = useState<Record<Kind, number>>({ adult: 1, concession: 0 });
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Errors>(NO_ERRORS);
  const [countNews, setCountNews] = useState('');
  const [booking, setBooking] = useState<Booking | null>(null);
  const [seats, setSeats] = useState<Record<string, boolean>>({});
  const [waits, setWaits] = useState<Record<string, boolean>>({});
  const [chapters, setChapters] = useState<Record<string, boolean>>({});
  const [talkNews, setTalkNews] = useState('');
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const dateRef = useRef<HTMLInputElement>(null);
  const addAdultRef = useRef<HTMLButtonElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  const wasBooked = useRef(false);

  const t = (text: Tri) => text[lang];
  const room = ROOMS[roomIndex];
  const total = counts.adult * PRICES.adult + counts.concession * PRICES.concession;
  const tickets = counts.adult + counts.concession;

  // The form and the confirmation replace each other. Focus goes to what took the place of
  // the control that left: the confirmation, or, after "Book more tickets", the date field.
  useEffect(() => {
    if (booking) doneRef.current?.focus();
    else if (wasBooked.current) dateRef.current?.focus();
    wasBooked.current = booking !== null;
  }, [booking]);

  const formatDay = (value: string) => {
    const day = parseDay(value);
    return day ? new Intl.DateTimeFormat(LOCALES[lang], { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(day) : '';
  };

  const countPhrase = (value: Record<Kind, number>) => {
    const adults = value.adult === 0 ? '' : value.adult === 1 ? t(TICKETS.adultsOne) : fill(t(TICKETS.adultsMany), { n: value.adult });
    const concessions = value.concession === 0 ? '' : value.concession === 1 ? t(TICKETS.concessionsOne) : fill(t(TICKETS.concessionsMany), { n: value.concession });
    if (adults && concessions) return fill(t(TICKETS.both), { a: adults, b: concessions });
    return adults || concessions || t(TICKETS.none);
  };

  const chooseRoom = (index: number, focus: boolean) => {
    flushSync(() => setRoomIndex(index));
    if (focus) tabRefs.current[index]?.focus();
  };

  const onTabKey = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = ROOMS.length - 1;
    const moves: Record<string, number> = {
      ArrowRight: roomIndex === last ? 0 : roomIndex + 1,
      ArrowDown: roomIndex === last ? 0 : roomIndex + 1,
      ArrowLeft: roomIndex === 0 ? last : roomIndex - 1,
      ArrowUp: roomIndex === 0 ? last : roomIndex - 1,
      Home: 0,
      End: last,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    chooseRoom(moves[event.key], true);
  };

  const step = (kind: Kind, delta: 1 | -1) => {
    if (delta > 0 && tickets >= MAX_TICKETS) {
      setCountNews(t(TICKETS.max));
      return;
    }
    if (delta < 0 && counts[kind] === 0) return;
    const next = { ...counts, [kind]: counts[kind] + delta };
    setCounts(next);
    if (errors.count && next.adult + next.concession > 0) setErrors({ ...errors, count: false });
    setCountNews(fill(t(TICKETS.news), { counts: countPhrase(next), total: next.adult * PRICES.adult + next.concession * PRICES.concession }));
  };

  const book = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Errors = { date: dateIssue(visitDate), count: tickets === 0, email: !EMAIL_PATTERN.test(email.trim()) };
    if (!next.date && !next.count && !next.email) {
      setErrors(NO_ERRORS);
      setBooking({ date: visitDate, counts, email: email.trim(), total });
      return;
    }
    // The error renders first, so the whole field can be brought into view above the fixed page bar.
    flushSync(() => setErrors(next));
    const field = next.date ? dateRef.current : next.count ? addAdultRef.current : emailRef.current;
    field?.focus();
    field?.closest('.rv-field, .rv-count')?.scrollIntoView({ block: 'nearest' });
  };

  const toggleSeat = (talk: Talk) => {
    const has = !seats[talk.id];
    setSeats({ ...seats, [talk.id]: has });
    const left = (talk.left ?? 0) - (has ? 1 : 0);
    setTalkNews(fill(t(has ? TALK_COPY.booked : TALK_COPY.cancelled), { title: t(talk.title), n: left }));
  };

  const toggleWait = (talk: Talk) => {
    const on = !waits[talk.id];
    setWaits({ ...waits, [talk.id]: on });
    setTalkNews(on ? fill(t(TALK_COPY.joined), { title: t(talk.title), n: (talk.waiting ?? 0) + 1 }) : fill(t(TALK_COPY.left_), { title: t(talk.title) }));
  };

  const day = parseDay(visitDate);
  const hours = day ? OPEN_HOURS[day.getUTCDay()] : null;
  const issue = dateIssue(visitDate);
  const dayLine = !day
    ? ''
    : issue === 'monday' || issue === 'holiday'
      ? fill(t(TICKETS.closed), { day: formatDay(visitDate) })
      : issue === null && hours
        ? fill(t(day.getUTCDay() === 4 ? TICKETS.openTalk : TICKETS.open), { day: formatDay(visitDate), from: hours[0], to: hours[1] })
        : '';
  const submitLabel = tickets === 0
    ? t(TICKETS.submitNone)
    : fill(t(tickets === 1 ? TICKETS.submitOne : TICKETS.submitMany), { n: tickets, total });
  const nextRoom = (roomIndex + 1) % ROOMS.length;
  const nextWorks = ROOMS[nextRoom].works;

  return (
    <FusionShell
      fusionId="swiss-poster"
      lang={lang}
      tone="light"
      accent="#d41f18"
      prev={{ href: '/pages/cyberpunk-glitch.html', label: 'Cyberpunk Glitch' }}
      next={{ href: '/pages/quiet-utility.html', label: 'Quiet Utility' }}
      prompts={PROMPTS}
    >
      <div className="rv">
        <header className="rv-bar">
          <p className="rv-mark">{MUSEUM}</p>
          <nav className="rv-bar__nav" aria-label={t(HEAD.nav)}>
            <a href="#rv-works">{t(HEAD.works)}</a>
            <a href="#rv-visit">{t(HEAD.visit)}</a>
            <a href="#rv-talks">{t(HEAD.talks)}</a>
          </nav>
          <a className="rv-btn rv-bar__tickets" href="#rv-buy">{t(HEAD.tickets)}</a>
        </header>

        <section className="rv-poster" aria-labelledby="rv-title">
          <i className="rv-crop rv-crop--tl" aria-hidden="true" />
          <i className="rv-crop rv-crop--tr" aria-hidden="true" />
          <i className="rv-crop rv-crop--bl" aria-hidden="true" />
          <i className="rv-crop rv-crop--br" aria-hidden="true" />
          <div className="rv-poster__sheet">
            <i className="rv-geo" aria-hidden="true" />
            <h1 id="rv-title" className="rv-name">
              <span>Ruth</span>
              <span>V<span className="rv-o">o</span>gt</span>
            </h1>
            <div className="rv-poster__side">
              <p className="rv-sub">{t(POSTER.posters)}<br />{YEARS}</p>
              <p className="rv-dates"><span>{t(POSTER.from)}</span> <span>{t(POSTER.to)}</span></p>
              <a className="rv-btn rv-btn--red rv-poster__buy" href="#rv-buy">{t(POSTER.buy)}</a>
            </div>
          </div>
        </section>

        <div className="rv-intro">
          <div className="rv-about">
            <p className="rv-lede">{t(INTRO.lede)}</p>
            <p>{t(INTRO.body)}</p>
          </div>
          <dl className="rv-facts">
            <div><dt>{t(INTRO.where)}</dt><dd>{t(INTRO.hall)}<br />{ADDRESS}</dd></div>
            <div><dt>{t(INTRO.today)}</dt><dd>{t(INTRO.todayHours)}</dd></div>
            <div><dt>{t(INTRO.admission)}</dt><dd>{t(INTRO.admissionValue)}</dd></div>
          </dl>
        </div>

        <section className="rv-sec" id="rv-works" aria-labelledby="rv-works-title">
          <div className="rv-sec__head">
            <h2 id="rv-works-title">{t(WORKS.title)}</h2>
            <p>{t(WORKS.note)}</p>
          </div>
          <div className="rv-sec__body">
            <div className="rv-rooms" role="tablist" aria-label={t(WORKS.rooms)} onKeyDown={onTabKey}>
              {ROOMS.map((item, index) => (
                <button
                  key={item.years}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  className="rv-tab"
                  type="button"
                  role="tab"
                  id={`rv-tab-${index + 1}`}
                  aria-selected={index === roomIndex}
                  aria-controls="rv-room"
                  tabIndex={index === roomIndex ? 0 : -1}
                  onClick={() => chooseRoom(index, false)}
                >
                  <b>{fill(t(WORKS.room), { n: index + 1 })}</b>
                  <span>{item.years}</span>
                </button>
              ))}
            </div>

            <div className="rv-room" id="rv-room" role="tabpanel" aria-labelledby={`rv-tab-${roomIndex + 1}`}>
              <p className="rv-room__note">{t(room.note)}</p>
              <div className="rv-works" role="table" aria-label={fill(t(WORKS.list), { n: roomIndex + 1, years: room.years })}>
                <div role="rowgroup">
                  <div className="rv-works__row rv-works__row--head" role="row">
                    <span role="columnheader">{t(WORKS.cat)}</span>
                    <span role="columnheader"><span className="rv-sr">{t(WORKS.sheet)}</span></span>
                    <span role="columnheader">{t(WORKS.work)}</span>
                    <span role="columnheader">{t(WORKS.year)}</span>
                    <span role="columnheader">{t(WORKS.client)}</span>
                    <span role="columnheader">{t(WORKS.technique)}</span>
                  </div>
                </div>
                <div role="rowgroup">
                  {room.works.map((work) => (
                    <div key={work.cat} className="rv-works__row" role="row">
                      <span className="rv-works__cat" role="cell" data-label={t(WORKS.cat)}>{work.cat}</span>
                      <span className="rv-works__thumb" role="cell" data-label={t(WORKS.sheet)}>
                        <i className={`rv-mp rv-mp--${work.cat}`} aria-hidden="true" />
                        <span className="rv-sr">{t(work.sheet)}</span>
                      </span>
                      <span className="rv-works__title" role="rowheader" data-label={t(WORKS.work)}>
                        <b lang="de">{work.title}</b>
                        {work.gloss ? <span>{t(work.gloss)}</span> : null}
                      </span>
                      <span className="rv-works__year" role="cell" data-label={t(WORKS.year)}>{work.year}</span>
                      <span className="rv-works__client" role="cell" data-label={t(WORKS.client)} lang="de">{work.client}</span>
                      <span className="rv-works__tech" role="cell" data-label={t(WORKS.technique)}>
                        {t(work.tech)}
                        {work.size ? <span>{work.size}</span> : null}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rv-room__next">
                <button className="rv-btn" type="button" onClick={() => chooseRoom(nextRoom, true)}>
                  {fill(t(nextRoom === 0 ? WORKS.back : WORKS.next), {
                    n: nextRoom + 1,
                    from: nextWorks[0].cat,
                    to: nextWorks[nextWorks.length - 1].cat,
                  })}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="rv-sec" id="rv-visit" aria-labelledby="rv-visit-title">
          <div className="rv-sec__head">
            <h2 id="rv-visit-title">{t(VISIT.title)}</h2>
            <p>{t(VISIT.note)}</p>
          </div>
          <div className="rv-sec__body rv-visit">
            <table className="rv-hours">
              {[
                { name: VISIT.hours, rows: HOURS },
                { name: VISIT.prices, rows: PRICE_LIST },
              ].map((group) => (
                <tbody key={group.name.en}>
                  <tr>
                    <th scope="colgroup" colSpan={2}>{t(group.name)}</th>
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={row.name.en} className={row.today ? 'is-today' : row.shut ? 'is-shut' : undefined}>
                      <th scope="row">{t(row.name)}</th>
                      <td>
                        <b>{t(row.value)}</b>
                        {row.note ? <span>{t(row.note)}</span> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>

            <div className="rv-buy" id="rv-buy">
              <h3 id="rv-buy-title">{t(TICKETS.title)}</h3>
              {booking ? (
                <div className="rv-done" ref={doneRef} tabIndex={-1} aria-labelledby="rv-done-title">
                  <p className="rv-done__title" id="rv-done-title">{fill(t(TICKETS.doneTitle), { day: formatDay(booking.date) })}</p>
                  <p className="rv-done__body">
                    {fill(t(TICKETS.doneBody), { counts: countPhrase(booking.counts), total: booking.total, email: booking.email })}
                  </p>
                  <button className="rv-btn" type="button" onClick={() => setBooking(null)}>{t(TICKETS.again)}</button>
                </div>
              ) : (
                <form className="rv-form" noValidate onSubmit={book} aria-labelledby="rv-buy-title">
                  <div className={`rv-field${errors.date ? ' is-invalid' : ''}`}>
                    <label htmlFor="rv-date">{t(TICKETS.date)}</label>
                    <input
                      id="rv-date"
                      ref={dateRef}
                      type="date"
                      min={TODAY}
                      max={LAST_DAY}
                      required
                      value={visitDate}
                      aria-invalid={errors.date ? true : undefined}
                      aria-describedby={errors.date ? 'rv-date-error' : dayLine ? 'rv-date-day' : undefined}
                      onChange={(event) => {
                        setVisitDate(event.target.value);
                        if (errors.date) setErrors({ ...errors, date: null });
                      }}
                    />
                    {errors.date ? (
                      <p className="rv-error" id="rv-date-error" role="alert">{t(DATE_ERRORS[errors.date])}</p>
                    ) : dayLine ? (
                      <p className="rv-field__note" id="rv-date-day">{dayLine}</p>
                    ) : null}
                  </div>

                  <fieldset className={`rv-count${errors.count ? ' is-invalid' : ''}`} aria-describedby={errors.count ? 'rv-count-error rv-count-note' : 'rv-count-note'}>
                    <legend>{t(TICKETS.legend)}</legend>
                    {(['adult', 'concession'] as const).map((kind) => {
                      const full = tickets >= MAX_TICKETS;
                      const empty = counts[kind] === 0;
                      return (
                        <div key={kind} className="rv-count__row" role="group" aria-labelledby={`rv-${kind}-name rv-${kind}-n`}>
                          <p className="rv-count__name" id={`rv-${kind}-name`}>
                            <b>{t(kind === 'adult' ? TICKETS.adult : TICKETS.concession)}</b>
                            {kind === 'concession' ? <span>{t(TICKETS.concessionWho)}</span> : null}
                            <span>CHF {PRICES[kind]}</span>
                          </p>
                          <div className="rv-step">
                            <button
                              className="rv-step__btn"
                              type="button"
                              aria-label={t(kind === 'adult' ? TICKETS.removeAdult : TICKETS.removeConcession)}
                              aria-disabled={empty || undefined}
                              onClick={() => step(kind, -1)}
                            >
                              <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden="true"><path d="M3 8h10" /></svg>
                            </button>
                            <span className="rv-step__n" id={`rv-${kind}-n`}>{counts[kind]}</span>
                            <button
                              className="rv-step__btn"
                              type="button"
                              ref={kind === 'adult' ? addAdultRef : undefined}
                              aria-label={t(kind === 'adult' ? TICKETS.addAdult : TICKETS.addConcession)}
                              aria-disabled={full || undefined}
                              onClick={() => step(kind, 1)}
                            >
                              <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden="true"><path d="M3 8h10M8 3v10" /></svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    <p className="rv-field__note" id="rv-count-note">{fill(t(TICKETS.countNote), { phone: PHONE })}</p>
                    {errors.count ? <p className="rv-error" id="rv-count-error" role="alert">{t(TICKETS.countError)}</p> : null}
                  </fieldset>

                  <p className="rv-total">
                    <span>{t(TICKETS.total)}</span>
                    <b>CHF {total}</b>
                  </p>

                  <div className={`rv-field${errors.email ? ' is-invalid' : ''}`}>
                    <label htmlFor="rv-email">{t(TICKETS.email)}</label>
                    <input
                      id="rv-email"
                      ref={emailRef}
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      aria-invalid={errors.email || undefined}
                      aria-describedby={errors.email ? 'rv-email-error' : undefined}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (errors.email) setErrors({ ...errors, email: false });
                      }}
                    />
                    {errors.email ? <p className="rv-error" id="rv-email-error" role="alert">{t(TICKETS.emailError)}</p> : null}
                  </div>

                  <button className="rv-btn rv-btn--red rv-form__submit" type="submit">{submitLabel}</button>
                  <p className="rv-field__note">{t(TICKETS.pay)}</p>
                  <p className="rv-sr" role="status">{countNews}</p>
                </form>
              )}
            </div>
          </div>
        </section>

        <section className="rv-sec" id="rv-talks" aria-labelledby="rv-talks-title">
          <div className="rv-sec__head">
            <h2 id="rv-talks-title">{t(TALK_COPY.title)}</h2>
            <p>{t(TALK_COPY.note)}</p>
          </div>
          <div className="rv-sec__body">
            <ul className="rv-talks">
              {TALKS.map((talk) => {
                const past = talk.recording !== undefined;
                const hasSeat = Boolean(seats[talk.id]);
                const onList = Boolean(waits[talk.id]);
                const open = Boolean(chapters[talk.id]);
                const state = past ? ' is-past' : talk.next ? ' is-next' : '';
                return (
                  <li key={talk.id} className={`rv-talk${state}`}>
                    <div className="rv-talk__date">
                      <time dateTime={talk.date}>
                        <span className="rv-talk__day">{talk.day}</span>
                        <span className="rv-talk__when"><b>{t(talk.month)}</b>{t(talk.when)}</span>
                      </time>
                      {talk.next ? <span className="rv-sr">{t(TALK_COPY.nextTalk)}</span> : null}
                    </div>
                    <div className="rv-talk__body">
                      <h3>{t(talk.title)}</h3>
                      <p className="rv-talk__who">{t(talk.who)}</p>
                    </div>
                    <div className="rv-talk__act">
                      {talk.recording ? (
                        <>
                          <p>{fill(t(TALK_COPY.recorded), { n: talk.recording.minutes })}</p>
                          <button
                            className="rv-textbtn"
                            type="button"
                            aria-expanded={open}
                            aria-controls={`rv-chapters-${talk.id}`}
                            onClick={() => setChapters({ ...chapters, [talk.id]: !open })}
                          >
                            {t(TALK_COPY.chapters)}
                          </button>
                        </>
                      ) : talk.left === 0 ? (
                        <>
                          <p><b>{t(TALK_COPY.full)}</b></p>
                          <p>{onList ? fill(t(TALK_COPY.onList), { n: (talk.waiting ?? 0) + 1 }) : fill(t(TALK_COPY.waiting), { n: talk.waiting ?? 0 })}</p>
                          <button className="rv-textbtn" type="button" onClick={() => toggleWait(talk)}>
                            {t(onList ? TALK_COPY.leave : TALK_COPY.join)}
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="rv-btn" type="button" onClick={() => toggleSeat(talk)}>
                            {t(hasSeat ? TALK_COPY.cancel : TALK_COPY.book)}
                          </button>
                          <p>
                            {hasSeat
                              ? fill(t(TALK_COPY.have), { n: (talk.left ?? 0) - 1 })
                              : fill(t(TALK_COPY.left), { n: talk.left ?? 0 })}
                          </p>
                        </>
                      )}
                    </div>
                    {talk.recording ? (
                      <div className="rv-talk__chapters" id={`rv-chapters-${talk.id}`} hidden={!open}>
                        <p>{t(TALK_COPY.station)}</p>
                        <ol>
                          {talk.recording.chapters.map((chapter) => (
                            <li key={chapter.at}>
                              <b>{chapter.at}</b>
                              <span>{t(chapter.title)}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
            <p className="rv-sr" role="status">{talkNews}</p>
          </div>
        </section>

        <footer className="rv-foot">
          <p><b>{MUSEUM}</b><br />{ADDRESS}</p>
          <p>{PHONE}<br />{EMAIL}</p>
          <p>{t(FOOT.support)}</p>
        </footer>
      </div>
    </FusionShell>
  );
}
